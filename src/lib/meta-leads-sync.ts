import 'server-only';
import { META_API_VERSION } from '@/lib/meta-api';
import { sendCrmStage, type CrmLead } from '@/lib/meta-crm-events';
import { mapMetaGraphLeadToImportPayload, type MetaGraphLeadInput } from '@/lib/lead-workflow';
import { generatePublicToken, logActivityEvent, resolveAutoAssignment } from '@/lib/crm-operations';
import { notifyNewLeadAlert } from '@/lib/alerts';
import { parseNumericGpa } from '@/lib/wa-templates';
import prisma from '@/lib/prisma';
import { decryptSecret } from '@/lib/secret-box';
import { getAllSettings } from '@/lib/settings';

const SYNC_INTERVAL_MS = 30_000;
const GRAPH_TIMEOUT_MS = 5000;

const DEFAULT_PAGE_IDS = ['693839983823261', '259627373903121', '61579794026767'];
const DEFAULT_FORM_IDS = ['986182003780725'];
const DEFAULT_CAMPAIGN_IDS = ['120251306120530245'];

export type MetaLeadsSyncResult = {
  ok: boolean;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  formsChecked: number;
  syncedAt: string;
  error?: string;
};

type SyncOptions = {
  force?: boolean;
  request?: typeof fetch;
  onLeadCreated?: (lead: CrmLead) => void;
};

type GraphResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

let lastSyncAt = 0;
let lastResult: MetaLeadsSyncResult | null = null;
let inFlightSync: Promise<MetaLeadsSyncResult> | null = null;

function parseEnvList(raw: string | undefined, defaults: string[]): string[] {
  const values = (raw || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return Array.from(new Set([...values, ...defaults]));
}

async function graphGet<T>(
  path: string,
  params: Record<string, string>,
  token: string,
  request: typeof fetch = fetch,
): Promise<GraphResponse<T>> {
  try {
    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${path.replace(/^\//, '')}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const response = await request(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
    });
    const payload = (await response.json()) as T & { error?: { message?: string; code?: number } };
    if (!response.ok || payload?.error) {
      const msg = payload?.error?.message || `Graph HTTP ${response.status}`;
      return { ok: false, error: msg };
    }
    return { ok: true, data: payload };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Graph request failed' };
  }
}

async function resolveTokensAndForms(seedTokens: string[], request: typeof fetch) {
  const pageIds = parseEnvList(process.env.META_PAGE_IDS, DEFAULT_PAGE_IDS);
  const formIds = new Set(parseEnvList(process.env.META_LEAD_FORM_IDS, DEFAULT_FORM_IDS));
  const formNames = new Map<string, string>();
  const tokens: string[] = [];
  const pushToken = (tok?: string | null) => {
    const clean = typeof tok === 'string' ? tok.trim() : '';
    if (clean && !tokens.includes(clean)) tokens.push(clean);
  };

  type AccountsResponse = { data?: Array<{ id?: string; access_token?: string }> };
  type PageTokenResponse = { id?: string; access_token?: string };

  const lookupCalls = seedTokens.flatMap((token) => [
    graphGet<AccountsResponse>('me/accounts', { fields: 'id,access_token', limit: '25' }, token, request).then((res) => ({ kind: 'accounts' as const, res })),
    ...pageIds.map((id) =>
      graphGet<PageTokenResponse>(id, { fields: 'id,access_token' }, token, request).then((res) => ({ kind: 'page' as const, res })),
    ),
  ]);

  const settledLookups = await Promise.allSettled(lookupCalls);
  for (const settled of settledLookups) {
    if (settled.status !== 'fulfilled') continue;
    if (settled.value.kind === 'accounts' && settled.value.res.ok && Array.isArray(settled.value.res.data?.data)) {
      for (const acct of settled.value.res.data.data) {
        if (acct?.id && !pageIds.includes(acct.id)) pageIds.push(acct.id);
        pushToken(acct?.access_token);
      }
    } else if (settled.value.kind === 'page' && settled.value.res.ok) {
      pushToken(settled.value.res.data?.access_token);
    }
  }
  for (const token of seedTokens) {
    pushToken(token);
  }

  type FormsResponse = { data?: Array<{ id?: string; name?: string }> };
  const formDiscoveryCalls = pageIds.slice(0, 4).flatMap((pageId) =>
    tokens.slice(0, 3).map((tok) =>
      graphGet<FormsResponse>(`${encodeURIComponent(pageId)}/leadgen_forms`, { fields: 'id,name', limit: '25' }, tok, request),
    ),
  );
  const discovered = await Promise.allSettled(formDiscoveryCalls);
  for (const res of discovered) {
    if (res.status === 'fulfilled' && res.value.ok && Array.isArray(res.value.data?.data)) {
      for (const form of res.value.data.data) {
        const fid = form?.id?.trim();
        if (fid) {
          formIds.add(fid);
          if (form?.name?.trim()) formNames.set(fid, form.name.trim());
        }
      }
    }
  }

  return { tokens, formIds: Array.from(formIds).slice(0, 6), formNames };
}

const META_LEAD_FIELDS = 'id,created_time,field_data,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,form_name,platform';

function parseUtmObject(raw: string | null | undefined): Record<string, string> {
  if (!raw || typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string' && v.trim()) out[k] = v.trim();
      else if (typeof v === 'number' && Number.isFinite(v)) out[k] = String(v);
    }
    return out;
  } catch {
    return {};
  }
}

async function fetchFormLeadsWithTokens(
  formId: string,
  tokens: string[],
  request: typeof fetch,
): Promise<{ leads: MetaGraphLeadInput[]; error?: string }> {
  type LeadsResponse = { data?: MetaGraphLeadInput[] };
  let lastError: string | undefined;

  for (const token of tokens) {
    const res = await graphGet<LeadsResponse>(
      `${encodeURIComponent(formId)}/leads`,
      {
        fields: META_LEAD_FIELDS,
        limit: '100',
      },
      token,
      request,
    );
    if (res.ok) {
      return { leads: Array.isArray(res.data?.data) ? res.data.data : [] };
    }
    lastError = res.error;
  }
  return { leads: [], error: lastError };
}

async function fetchCampaignAdLeads(
  campaignId: string,
  tokens: string[],
  request: typeof fetch,
): Promise<MetaGraphLeadInput[]> {
  type CampaignAdsResponse = {
    data?: Array<{
      id?: string;
      name?: string;
      adset?: { id?: string; name?: string };
      campaign?: { id?: string; name?: string };
      leads?: { data?: MetaGraphLeadInput[] };
    }>;
  };
  for (const token of tokens) {
    const res = await graphGet<CampaignAdsResponse>(
      `${encodeURIComponent(campaignId)}/ads`,
      {
        fields: `id,name,adset{id,name},campaign{id,name},leads.limit(100){${META_LEAD_FIELDS}}`,
        limit: '50',
      },
      token,
      request,
    );
    if (res.ok && Array.isArray(res.data?.data)) {
      const collected: MetaGraphLeadInput[] = [];
      for (const ad of res.data.data) {
        const adLeads = ad?.leads?.data;
        if (!Array.isArray(adLeads)) continue;
        for (const lead of adLeads) {
          collected.push({
            ...lead,
            ad_id: lead.ad_id || ad.id,
            ad_name: lead.ad_name || ad.name,
            adset_id: lead.adset_id || ad.adset?.id,
            adset_name: lead.adset_name || ad.adset?.name,
            campaign_id: lead.campaign_id || ad.campaign?.id || campaignId,
            campaign_name: lead.campaign_name || ad.campaign?.name,
          });
        }
      }
      return collected;
    }
  }
  return [];
}

async function enrichNumericMetaAdIds(
  existingLeads: Array<{ id: string; utm: string | null }>,
  tokens: string[],
  request: typeof fetch,
): Promise<number> {
  if (tokens.length === 0) return 0;
  const targetsByObjectId = new Map<string, Array<{ id: string; utmObj: Record<string, string> }>>();

  for (const lead of existingLeads) {
    const utmObj = parseUtmObject(lead.utm);
    if (utmObj.ad_name) continue;
    const candidateId = utmObj.ad_id || (utmObj.utm_term && /^\d{10,24}$/.test(utmObj.utm_term) ? utmObj.utm_term : '');
    if (!candidateId) continue;
    const bucket = targetsByObjectId.get(candidateId) || [];
    bucket.push({ id: lead.id, utmObj });
    targetsByObjectId.set(candidateId, bucket);
  }

  if (targetsByObjectId.size === 0) return 0;

  type MetaObjectMeta = {
    id?: string;
    name?: string;
    adset?: { id?: string; name?: string };
    campaign?: { id?: string; name?: string };
  };

  let enrichedLeads = 0;
  const uniqueIds = Array.from(targetsByObjectId.keys()).slice(0, 12);

  for (const objectId of uniqueIds) {
    let resolved: MetaObjectMeta | null = null;
    for (const token of tokens.slice(0, 3)) {
      const res = await graphGet<MetaObjectMeta>(
        encodeURIComponent(objectId),
        { fields: 'id,name,adset{id,name},campaign{id,name}' },
        token,
        request,
      );
      if (res.ok && res.data?.name) {
        resolved = res.data;
        break;
      }
      // Fallback for AdSet objects that don't expose nested `adset`
      const fallbackRes = await graphGet<MetaObjectMeta>(
        encodeURIComponent(objectId),
        { fields: 'id,name,campaign{id,name}' },
        token,
        request,
      );
      if (fallbackRes.ok && fallbackRes.data?.name) {
        resolved = fallbackRes.data;
        break;
      }
    }
    if (!resolved?.name) continue;

    const bucket = targetsByObjectId.get(objectId) || [];
    for (const entry of bucket) {
      const nextUtm: Record<string, string> = {
        ...entry.utmObj,
        ad_id: entry.utmObj.ad_id || objectId,
        ad_name: resolved.name,
        ...(resolved.adset?.id ? { adset_id: resolved.adset.id } : {}),
        ...(resolved.adset?.name ? { adset_name: resolved.adset.name } : {}),
        ...(resolved.campaign?.id ? { campaign_id: resolved.campaign.id } : {}),
        ...(resolved.campaign?.name ? { campaign_name: resolved.campaign.name } : {}),
      };
      await prisma.lead.update({
        where: { id: entry.id },
        data: { utm: JSON.stringify(nextUtm) },
      });
      enrichedLeads++;
    }
  }

  return enrichedLeads;
}

async function collectCandidateSeedTokens(): Promise<string[]> {
  const settings = await getAllSettings();
  const rawCandidates = [
    process.env.META_LEAD_ACCESS_TOKEN,
    decryptSecret(settings.metaAccessToken),
    process.env.META_ACCESS_TOKEN,
  ];
  const unique: string[] = [];
  for (const candidate of rawCandidates) {
    const clean = typeof candidate === 'string' ? candidate.trim() : '';
    if (clean && !unique.includes(clean)) unique.push(clean);
  }
  return unique;
}

async function runSync(options?: SyncOptions): Promise<MetaLeadsSyncResult> {
  const syncedAt = new Date().toISOString();
  const request = options?.request ?? fetch;

  try {
    const seedTokens = await collectCandidateSeedTokens();
    if (seedTokens.length === 0) {
      return { ok: false, importedCount: 0, updatedCount: 0, skippedCount: 0, formsChecked: 0, syncedAt, error: 'Meta access token not configured.' };
    }

    const { tokens, formIds, formNames } = await resolveTokensAndForms(seedTokens, request);
    const campaignIds = parseEnvList(process.env.META_CAMPAIGN_IDS, DEFAULT_CAMPAIGN_IDS);

    const [formResults, campaignResults] = await Promise.all([
      Promise.all(formIds.map((id) => fetchFormLeadsWithTokens(id, tokens, request).then((r) => ({ id, ...r })))),
      Promise.all(campaignIds.slice(0, 4).map((cid) => fetchCampaignAdLeads(cid, tokens, request))),
    ]);

    const rawLeads: Array<{ lead: MetaGraphLeadInput; formId?: string; formName?: string }> = [];
    let anySucceeded = false;
    let firstError: string | undefined;

    for (const res of formResults) {
      if (!res.error) anySucceeded = true;
      else if (!firstError) firstError = res.error;
      for (const lead of res.leads) {
        rawLeads.push({ lead, formId: res.id, formName: formNames.get(res.id) });
      }
    }
    for (const batch of campaignResults) {
      if (batch.length > 0) anySucceeded = true;
      for (const lead of batch) {
        rawLeads.push({ lead });
      }
    }

    const existingLeads = await prisma.lead.findMany({
      select: { id: true, phone: true, utm: true, message: true },
    });

    let updatedCount = 0;
    if (options?.force) {
      updatedCount += await enrichNumericMetaAdIds(existingLeads, tokens, request);
    }

    if (rawLeads.length === 0) {
      return {
        ok: anySucceeded || updatedCount > 0,
        importedCount: 0,
        updatedCount,
        skippedCount: 0,
        formsChecked: formIds.length,
        syncedAt,
        ...(anySucceeded || updatedCount > 0 ? {} : { error: firstError || 'No accessible leads returned by Meta Graph API.' }),
      };
    }

    const existingByPhone = new Map<string, { id: string; phone: string; utm: string | null; message: string | null }>();
    for (const l of existingLeads) {
      const k = String(l.phone || '').replace(/\D/g, '').slice(-10);
      if (k && !existingByPhone.has(k)) {
        existingByPhone.set(k, l);
      }
    }

    const prepared = rawLeads
      .map(({ lead, formId, formName }) => mapMetaGraphLeadToImportPayload(lead, { formId, formName }))
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => Date.parse(a.consentTimestamp) - Date.parse(b.consentTimestamp));

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of prepared) {
      const digits = item.phone.replace(/\D/g, '');
      const key10 = digits.slice(-10);
      const existing = key10 ? existingByPhone.get(key10) : undefined;
      if (existing) {
        // Backfill missing individual Meta Ad attribution onto existing leads
        const incomingUtm = parseUtmObject(item.utm);
        const currentUtm = parseUtmObject(existing.utm);
        const hasNewAttribution =
          (incomingUtm.ad_id && !currentUtm.ad_id) ||
          (incomingUtm.ad_name && !currentUtm.ad_name) ||
          (incomingUtm.adset_name && !currentUtm.adset_name) ||
          (incomingUtm.campaign_id && !currentUtm.campaign_id) ||
          (incomingUtm.meta_lead_id && !currentUtm.meta_lead_id) ||
          (!existing.utm && Object.keys(incomingUtm).length > 0);

        if (hasNewAttribution) {
          const mergedUtm: Record<string, string> = { ...incomingUtm, ...currentUtm };
          // Prefer specific Meta Graph ad fields whenever missing in currentUtm
          for (const key of ['ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'form_id', 'form_name', 'meta_lead_id', 'platform']) {
            if (!mergedUtm[key] && incomingUtm[key]) {
              mergedUtm[key] = incomingUtm[key];
            }
          }
          if (!mergedUtm.utm_content && mergedUtm.ad_name) mergedUtm.utm_content = mergedUtm.ad_name;
          if (!mergedUtm.utm_term && mergedUtm.ad_id) mergedUtm.utm_term = mergedUtm.ad_id;

          const nextMessage =
            mergedUtm.ad_name && existing.message && !/(?:^|\|)\s*Ad:/i.test(existing.message)
              ? `${existing.message} | Ad: ${mergedUtm.ad_name}`
              : existing.message;
          const mergedUtmJson = JSON.stringify(mergedUtm);

          await prisma.lead.update({
            where: { id: existing.id },
            data: {
              utm: mergedUtmJson,
              ...(nextMessage !== existing.message ? { message: nextMessage } : {}),
            },
          });
          existing.utm = mergedUtmJson;
          existing.message = nextMessage;
          updatedCount++;
        } else {
          skippedCount++;
        }
        continue;
      }

      const createdAt = new Date(item.consentTimestamp);
      const validCreatedAt = !Number.isNaN(createdAt.getTime()) && createdAt.getTime() <= Date.now() + 60_000
        ? createdAt
        : new Date();

      const autoAssigned = await resolveAutoAssignment({
        assignedTeam: item.assignedTeam,
        country: item.country,
      });
      const parsedGpa = parseNumericGpa(null, item.assessAcademicResults);

      const createdLead = await prisma.lead.create({
        data: {
          name: item.name,
          email: item.email,
          phone: item.phone,
          country: item.country,
          program: item.program,
          message: item.message,
          status: item.status,
          source: item.source,
          utm: item.utm || null,
          leadType: item.leadType,
          assignedTeam: item.assignedTeam,
          assignedTo: autoAssigned.assignedTo,
          assignedEmployeeId: autoAssigned.assignedEmployeeId,
          publicToken: generatePublicToken(),
          publicEnabled: true,
          gpa: parsedGpa,
          degree: item.assessAcademicLevel || null,
          destinationInterest: item.destinationInterest,
          landingPage: item.landingPage,
          ...(item.assessAcademicLevel ? { assessAcademicLevel: item.assessAcademicLevel } : {}),
          ...(item.assessAcademicResults ? { assessAcademicResults: item.assessAcademicResults } : {}),
          ...(item.assessLanguage ? { assessLanguage: item.assessLanguage } : {}),
          adTrackingConsent: true,
          consentTimestamp: validCreatedAt,
          consentPolicyVersion: item.consentPolicyVersion,
          createdAt: validCreatedAt,
        },
      });

      void logActivityEvent({
        type: 'lead_created',
        actorName: 'Meta Graph Sync',
        employeeId: autoAssigned.assignedEmployeeId,
        leadId: createdLead.id,
        leadName: createdLead.name,
        toValue: autoAssigned.assignedTo || item.assignedTeam,
        details: `${item.country} · ${item.source}`,
      });
      void notifyNewLeadAlert(createdLead);

      if (options?.onLeadCreated) {
        options.onLeadCreated(createdLead);
      } else {
        void sendCrmStage(createdLead, 'new').catch(() => {});
      }

      importedCount++;
      if (key10) {
        existingByPhone.set(key10, {
          id: createdLead.id,
          phone: createdLead.phone,
          utm: item.utm || null,
          message: createdLead.message,
        });
      }
    }

    return {
      ok: true,
      importedCount,
      updatedCount,
      skippedCount,
      formsChecked: formIds.length,
      syncedAt,
    };
  } catch (err) {
    return {
      ok: false,
      importedCount: 0,
      updatedCount: 0,
      skippedCount: 0,
      formsChecked: 0,
      syncedAt,
      error: err instanceof Error ? err.message : 'Meta lead sync failed.',
    };
  }
}

/**
 * Throttled sync of Meta Instant Form leads via Graph API (`/{form_id}/leads` and campaign ads).
 * Coalesces concurrent requests and never throws so `/api/admin/leads` always loads reliably.
 */
export async function syncMetaInstantFormLeads(options?: SyncOptions): Promise<MetaLeadsSyncResult> {
  const now = Date.now();
  if (!options?.force && lastResult && now - lastSyncAt < SYNC_INTERVAL_MS) {
    return lastResult;
  }
  if (inFlightSync) {
    return inFlightSync;
  }

  inFlightSync = runSync(options)
    .then((res) => {
      lastSyncAt = Date.now();
      lastResult = res;
      return res;
    })
    .finally(() => {
      inFlightSync = null;
    });

  return inFlightSync;
}

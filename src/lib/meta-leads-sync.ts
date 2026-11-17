import 'server-only';
import { META_API_VERSION } from '@/lib/meta-api';
import { sendCrmStage, type CrmLead } from '@/lib/meta-crm-events';
import { mapMetaGraphLeadToImportPayload, type MetaGraphLeadInput } from '@/lib/lead-workflow';
import prisma from '@/lib/prisma';
import { getMetaConfig } from '@/lib/settings';

const SYNC_INTERVAL_MS = 30_000;
const GRAPH_TIMEOUT_MS = 5000;

const DEFAULT_PAGE_IDS = ['693839983823261', '259627373903121', '61579794026767'];
const DEFAULT_FORM_IDS = ['986182003780725'];
const DEFAULT_CAMPAIGN_IDS = ['120251306120530245'];

export type MetaLeadsSyncResult = {
  ok: boolean;
  importedCount: number;
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

async function resolveTokensAndForms(accessToken: string, request: typeof fetch) {
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

  const [accountsRes, ...pageResList] = await Promise.allSettled([
    graphGet<AccountsResponse>('me/accounts', { fields: 'id,access_token', limit: '25' }, accessToken, request),
    ...pageIds.map((id) =>
      graphGet<PageTokenResponse>(id, { fields: 'id,access_token' }, accessToken, request),
    ),
  ]);

  if (accountsRes.status === 'fulfilled' && accountsRes.value.ok && Array.isArray(accountsRes.value.data?.data)) {
    for (const acct of accountsRes.value.data.data) {
      if (acct?.id && !pageIds.includes(acct.id)) pageIds.push(acct.id);
      pushToken(acct?.access_token);
    }
  }
  for (const res of pageResList) {
    if (res.status === 'fulfilled' && res.value.ok) {
      pushToken(res.value.data?.access_token);
    }
  }
  pushToken(accessToken);

  type FormsResponse = { data?: Array<{ id?: string; name?: string }> };
  const formDiscoveryCalls = pageIds.slice(0, 4).map((pageId) =>
    graphGet<FormsResponse>(`${encodeURIComponent(pageId)}/leadgen_forms`, { fields: 'id,name', limit: '25' }, tokens[0], request),
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
        fields: 'id,created_time,field_data,ad_name,campaign_name,form_id,form_name',
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
      name?: string;
      leads?: { data?: MetaGraphLeadInput[] };
    }>;
  };
  for (const token of tokens) {
    const res = await graphGet<CampaignAdsResponse>(
      `${encodeURIComponent(campaignId)}/ads`,
      {
        fields: 'id,name,leads.limit(100){id,created_time,field_data,ad_name,campaign_name,form_id,form_name}',
        limit: '25',
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
          collected.push({ ...lead, ad_name: lead.ad_name || ad.name });
        }
      }
      return collected;
    }
  }
  return [];
}

async function runSync(options?: SyncOptions): Promise<MetaLeadsSyncResult> {
  const syncedAt = new Date().toISOString();
  const request = options?.request ?? fetch;

  try {
    const { accessToken } = await getMetaConfig();
    if (!accessToken) {
      return { ok: false, importedCount: 0, skippedCount: 0, formsChecked: 0, syncedAt, error: 'Meta access token not configured.' };
    }

    const { tokens, formIds, formNames } = await resolveTokensAndForms(accessToken, request);
    const campaignIds = parseEnvList(process.env.META_CAMPAIGN_IDS, DEFAULT_CAMPAIGN_IDS);

    const [formResults, campaignResults] = await Promise.all([
      Promise.all(formIds.map((id) => fetchFormLeadsWithTokens(id, tokens, request).then((r) => ({ id, ...r })))),
      Promise.all(campaignIds.slice(0, 2).map((cid) => fetchCampaignAdLeads(cid, tokens, request))),
    ]);

    const rawLeads: Array<{ lead: MetaGraphLeadInput; formName?: string }> = [];
    let anySucceeded = false;
    let firstError: string | undefined;

    for (const res of formResults) {
      if (!res.error) anySucceeded = true;
      else if (!firstError) firstError = res.error;
      for (const lead of res.leads) {
        rawLeads.push({ lead, formName: formNames.get(res.id) });
      }
    }
    for (const batch of campaignResults) {
      if (batch.length > 0) anySucceeded = true;
      for (const lead of batch) {
        rawLeads.push({ lead });
      }
    }

    if (rawLeads.length === 0) {
      return {
        ok: anySucceeded,
        importedCount: 0,
        skippedCount: 0,
        formsChecked: formIds.length,
        syncedAt,
        ...(anySucceeded ? {} : { error: firstError || 'No accessible leads returned by Meta Graph API.' }),
      };
    }

    const existingLeads = await prisma.lead.findMany({ select: { phone: true } });
    const existingPhones = new Set(
      existingLeads.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
    );

    const prepared = rawLeads
      .map(({ lead, formName }) => mapMetaGraphLeadToImportPayload(lead, { formName }))
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => Date.parse(a.consentTimestamp) - Date.parse(b.consentTimestamp));

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of prepared) {
      const digits = item.phone.replace(/\D/g, '');
      const key10 = digits.slice(-10);
      if (key10 && existingPhones.has(key10)) {
        skippedCount++;
        continue;
      }

      const createdAt = new Date(item.consentTimestamp);
      const validCreatedAt = !Number.isNaN(createdAt.getTime()) && createdAt.getTime() <= Date.now() + 60_000
        ? createdAt
        : new Date();

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
          leadType: item.leadType,
          assignedTeam: item.assignedTeam,
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

      if (options?.onLeadCreated) {
        options.onLeadCreated(createdLead);
      } else {
        void sendCrmStage(createdLead, 'new').catch(() => {});
      }

      importedCount++;
      if (key10) existingPhones.add(key10);
    }

    return {
      ok: true,
      importedCount,
      skippedCount,
      formsChecked: formIds.length,
      syncedAt,
    };
  } catch (err) {
    return {
      ok: false,
      importedCount: 0,
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

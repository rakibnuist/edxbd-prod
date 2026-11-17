import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse, after } from 'next/server';
import { META_API_VERSION } from '@/lib/meta-api';
import { sendCrmStage } from '@/lib/meta-crm-events';
import {
  buildMetaInstantFormMessage,
  extractMetaFormFields,
  normalizeMetaLeadPhone,
  parseMetaLeadTimestamp,
} from '@/lib/lead-workflow';
import prisma from '@/lib/prisma';
import { getMetaConfig } from '@/lib/settings';

const MAX_WEBHOOK_BYTES = 256 * 1024;

type GraphLeadField = {
  name?: string;
  values?: string[];
};

type GraphLeadResponse = {
  id?: string;
  created_time?: string | number;
  form_id?: string;
  form_name?: string;
  ad_name?: string;
  campaign_name?: string;
  field_data?: GraphLeadField[];
};

type WebhookChangeValue = {
  leadgen_id?: string;
  page_id?: string;
  form_id?: string;
  form_name?: string;
  ad_name?: string;
  campaign_name?: string;
  created_time?: string | number;
  full_name?: string;
  name?: string;
  phone_number?: string;
  phone?: string;
  whatsapp_number?: string;
  email?: string;
  field_data?: GraphLeadField[];
};

function safeTokenEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function verifyMetaWebhookSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;
  const providedHex = signatureHeader.slice('sha256='.length).trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(providedHex)) return false;
  const expectedHex = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');
  return safeTokenEqual(providedHex, expectedHex);
}

function parseWebhookTimestamp(raw: string | number | undefined): Date {
  const parsed = new Date(parseMetaLeadTimestamp(raw));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function extractFieldDataMap(fieldData?: GraphLeadField[]): Record<string, string> {
  const map: Record<string, string> = {};
  if (!Array.isArray(fieldData)) return map;
  for (const entry of fieldData) {
    const key = typeof entry?.name === 'string' ? entry.name.trim().toLowerCase() : '';
    const firstVal = Array.isArray(entry?.values)
      ? entry.values.find((v) => typeof v === 'string' && v.trim())
      : undefined;
    if (key && firstVal) {
      map[key] = firstVal.trim();
    }
  }
  return map;
}

async function resolvePageToken(pageId: string, accessToken: string): Promise<string | null> {
  try {
    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(pageId)}`);
    url.searchParams.set('fields', 'access_token');
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { access_token?: string };
    return typeof data?.access_token === 'string' && data.access_token.trim() ? data.access_token.trim() : null;
  } catch {
    return null;
  }
}

async function fetchMetaLeadDetails(
  leadgenId: string,
  accessToken: string,
  pageId?: string,
): Promise<GraphLeadResponse | null> {
  const queryLead = async (token: string): Promise<GraphLeadResponse | null> => {
    try {
      const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(leadgenId)}`);
      url.searchParams.set('fields', 'created_time,field_data,form_id,form_name,ad_name,campaign_name');
      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return null;
      const data = (await response.json()) as GraphLeadResponse;
      return data && typeof data === 'object' ? data : null;
    } catch {
      return null;
    }
  };

  const direct = await queryLead(accessToken);
  if (direct) return direct;

  if (pageId) {
    const pageToken = await resolvePageToken(pageId, accessToken);
    if (pageToken) {
      return queryLead(pageToken);
    }
  }
  return null;
}

function getWebhookSecretCandidates(): string[] {
  return Array.from(
    new Set(
      [process.env.META_WEBHOOK_VERIFY_TOKEN, process.env.REVALIDATE_SECRET]
        .map((v) => (v || '').trim())
        .filter(Boolean),
    ),
  );
}

function matchesAnySecret(provided: string, candidates: string[]): boolean {
  if (!provided || candidates.length === 0) return false;
  return candidates.some((expected) => safeTokenEqual(provided, expected));
}

function isDirectWebhookAuthorized(request: NextRequest): boolean {
  const candidates = getWebhookSecretCandidates();
  if (candidates.length === 0) return false;

  const queryToken = new URL(request.url).searchParams.get('token')?.trim() || '';
  const headerToken = request.headers.get('x-webhook-secret')?.trim() || '';
  const authHeader = request.headers.get('authorization')?.trim() || '';
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';

  return (
    matchesAnySecret(queryToken, candidates) ||
    matchesAnySecret(headerToken, candidates) ||
    matchesAnySecret(bearerToken, candidates)
  );
}

type NormalizedWebhookLeadInput = {
  rawName: string;
  rawPhone: string;
  rawEmail: string;
  formName: string;
  campaignName: string;
  adName: string;
  leadgenId: string;
  lastDegree: string;
  gpa: string;
  englishScore: string;
  whatsappPhone: string;
  createdRaw?: string | number;
};

async function persistNormalizedWebhookLead(
  input: NormalizedWebhookLeadInput,
  existingPhones: Set<string>,
): Promise<'stored' | 'skipped'> {
  const phone = normalizeMetaLeadPhone(input.rawPhone);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return 'skipped';

  const key10 = digits.slice(-10);
  if (key10 && existingPhones.has(key10)) return 'skipped';

  const email =
    input.rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.rawEmail)
      ? input.rawEmail
      : `no-email+${digits}@leads.eduexpressint.com`;
  const createdAt = parseWebhookTimestamp(input.createdRaw);

  const createdLead = await prisma.lead.create({
    data: {
      name: (input.rawName || 'Student').slice(0, 120),
      email,
      phone,
      country: 'China',
      program: 'China March 2027 Intake',
      message: buildMetaInstantFormMessage({
        formName: input.formName,
        campaignName: input.campaignName || 'META_Leads_BD_China-Mar2027_2026Q1',
        adName: input.adName,
        leadId: input.leadgenId,
        lastDegree: input.lastDegree,
        gpa: input.gpa,
        englishScore: input.englishScore,
        whatsappPhone: input.whatsappPhone,
        primaryPhone: phone,
      }),
      status: 'new',
      source: 'meta_china_march_2027',
      leadType: 'assessment',
      assignedTeam: 'china',
      destinationInterest: 'china',
      landingPage: '/china-march-2027-intake',
      ...(input.lastDegree ? { assessAcademicLevel: input.lastDegree.slice(0, 120) } : {}),
      ...(input.gpa ? { assessAcademicResults: input.gpa.slice(0, 120) } : {}),
      ...(input.englishScore ? { assessLanguage: input.englishScore.slice(0, 120) } : {}),
      adTrackingConsent: true,
      consentTimestamp: createdAt,
      consentPolicyVersion: '2026-04-privacy-v1',
      ...(createdAt.getTime() <= Date.now() + 60_000 ? { createdAt } : {}),
    },
  });

  after(() => sendCrmStage(createdLead, 'new'));
  if (key10) existingPhones.add(key10);
  return 'stored';
}

function normalizeDirectLeadRecord(raw: Record<string, unknown>): NormalizedWebhookLeadInput {
  const stringMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k.trim().toLowerCase();
    if (!key || v === null || v === undefined) continue;
    const text = typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '';
    if (text) stringMap[key] = text;
  }

  const extracted = extractMetaFormFields(stringMap);
  const createdRaw =
    typeof raw.created_time === 'string' || typeof raw.created_time === 'number'
      ? raw.created_time
      : stringMap.created || stringMap.created_at || stringMap.date || undefined;

  return {
    rawName: extracted.name,
    rawPhone: extracted.phone,
    rawEmail: extracted.email,
    formName: stringMap.form_name || stringMap.form || 'WebLead&InstantForm_18_4_2026',
    campaignName: stringMap.campaign_name || stringMap.campaign || 'META_Leads_BD_China-Mar2027_2026Q1',
    adName: stringMap.ad_name || stringMap.ad || '',
    leadgenId: stringMap.leadgen_id || stringMap.lead_id || stringMap.id || '',
    lastDegree: extracted.lastDegree,
    gpa: extracted.gpa,
    englishScore: extracted.englishScore,
    whatsappPhone: extracted.whatsappPhone,
    createdRaw,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const verifyToken = searchParams.get('hub.verify_token') || '';
  const challenge = searchParams.get('hub.challenge') || '';

  const candidates = getWebhookSecretCandidates();

  if (mode !== 'subscribe' || !matchesAnySecret(verifyToken, candidates)) {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const declaredLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_WEBHOOK_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const directAuthorized = isDirectWebhookAuthorized(request);
    const appSecret = process.env.META_APP_SECRET?.trim();
    if (appSecret && !directAuthorized) {
      const signature = request.headers.get('x-hub-signature-256');
      if (!verifyMetaWebhookSignature(rawBody, signature, appSecret)) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
    }

    const payload = parsedBody as {
      object?: string;
      leads?: unknown[];
      entry?: Array<{
        changes?: Array<{
          field?: string;
          value?: WebhookChangeValue;
        }>;
      }>;
    };

    const isMetaPagePayload = payload?.object === 'page' && Array.isArray(payload.entry);
    if (!isMetaPagePayload && !directAuthorized) {
      return NextResponse.json({ error: 'Unauthorized webhook payload' }, { status: 401 });
    }

    const { accessToken } = await getMetaConfig();
    const existingLeads = await prisma.lead.findMany({ select: { phone: true } });
    const existingPhones = new Set(
      existingLeads.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
    );

    let processed = 0;
    let stored = 0;
    let skipped = 0;

    if (isMetaPagePayload) {
      for (const entry of payload.entry!) {
        if (!Array.isArray(entry?.changes)) continue;
        for (const change of entry.changes) {
          if (change?.field !== 'leadgen' || !change.value || typeof change.value !== 'object') continue;
          processed++;

          const val = change.value;
          const leadgenId = typeof val.leadgen_id === 'string' ? val.leadgen_id.trim() : '';
          const pageId = typeof val.page_id === 'string' ? val.page_id.trim() : '';

          let rawName = (val.full_name || val.name || '').trim();
          let rawPhone = (val.phone_number || val.phone || val.whatsapp_number || '').trim();
          let rawEmail = (val.email || '').trim().toLowerCase();
          let formName = (val.form_name || '').trim();
          let adName = (val.ad_name || '').trim();
          let campaignName = (val.campaign_name || '').trim();
          let createdRaw: string | number | undefined = val.created_time;

          const inlineFields = extractMetaFormFields(extractFieldDataMap(val.field_data));
          rawName = inlineFields.name || rawName;
          rawPhone = rawPhone || inlineFields.phone;
          rawEmail = rawEmail || inlineFields.email;
          let lastDegree = inlineFields.lastDegree;
          let gpa = inlineFields.gpa;
          let englishScore = inlineFields.englishScore;
          let whatsappPhone = inlineFields.whatsappPhone;

          if ((!rawPhone || !lastDegree) && leadgenId && accessToken) {
            const graphLead = await fetchMetaLeadDetails(leadgenId, accessToken, pageId || undefined);
            if (graphLead) {
              const graphFields = extractMetaFormFields(extractFieldDataMap(graphLead.field_data));
              rawName = graphFields.name || rawName;
              rawPhone = rawPhone || graphFields.phone;
              rawEmail = rawEmail || graphFields.email;
              lastDegree = lastDegree || graphFields.lastDegree;
              gpa = gpa || graphFields.gpa;
              englishScore = englishScore || graphFields.englishScore;
              whatsappPhone = whatsappPhone || graphFields.whatsappPhone;
              formName = formName || (graphLead.form_name || '').trim();
              adName = adName || (graphLead.ad_name || '').trim();
              campaignName = campaignName || (graphLead.campaign_name || '').trim();
              createdRaw = graphLead.created_time ?? createdRaw;
            }
          }

          const outcome = await persistNormalizedWebhookLead(
            {
              rawName,
              rawPhone,
              rawEmail,
              formName: formName || (val.form_id ? `Form ${val.form_id}` : 'WebLead&InstantForm_18_4_2026'),
              campaignName,
              adName,
              leadgenId,
              lastDegree,
              gpa,
              englishScore,
              whatsappPhone,
              createdRaw,
            },
            existingPhones,
          );
          if (outcome === 'stored') stored++;
          else skipped++;
        }
      }
      return NextResponse.json({ ok: true, processed, stored, skipped }, { status: 200 });
    }

    const directItems = Array.isArray(parsedBody)
      ? parsedBody
      : Array.isArray(payload?.leads)
        ? payload.leads
        : [parsedBody];

    for (const item of directItems) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      processed++;
      const normalized = normalizeDirectLeadRecord(item as Record<string, unknown>);
      const outcome = await persistNormalizedWebhookLead(normalized, existingPhones);
      if (outcome === 'stored') stored++;
      else skipped++;
    }

    return NextResponse.json({ ok: true, processed, stored, skipped }, { status: 200 });
  } catch (error) {
    console.error('Meta leads webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse, after } from 'next/server';
import { META_API_VERSION } from '@/lib/meta-api';
import { sendCrmStage } from '@/lib/meta-crm-events';
import { normalizeMetaLeadPhone, parseMetaLeadTimestamp } from '@/lib/lead-workflow';
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
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    return new Date(ms);
  }
  if (typeof raw === 'string' && raw.trim()) {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      if (Number.isFinite(num) && num > 0) {
        return new Date(num < 1e12 ? num * 1000 : num);
      }
    }
    const isoFixed = trimmed.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
    const direct = new Date(isoFixed);
    if (!Number.isNaN(direct.getTime())) return direct;
    const parsed = new Date(parseMetaLeadTimestamp(trimmed));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
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

async function fetchMetaLeadDetails(leadgenId: string, accessToken: string): Promise<GraphLeadResponse | null> {
  try {
    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(leadgenId)}`);
    url.searchParams.set('fields', 'created_time,field_data,form_id,ad_name,campaign_name');
    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as GraphLeadResponse;
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const verifyToken = searchParams.get('hub.verify_token') || '';
  const challenge = searchParams.get('hub.challenge') || '';

  const expectedToken = (
    process.env.META_WEBHOOK_VERIFY_TOKEN ||
    process.env.REVALIDATE_SECRET ||
    ''
  ).trim();

  if (mode !== 'subscribe' || !expectedToken || !verifyToken || !safeTokenEqual(verifyToken, expectedToken)) {
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

    const appSecret = process.env.META_APP_SECRET?.trim();
    if (appSecret) {
      const signature = request.headers.get('x-hub-signature-256');
      if (!verifyMetaWebhookSignature(rawBody, signature, appSecret)) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let payload: {
      object?: string;
      entry?: Array<{
        changes?: Array<{
          field?: string;
          value?: WebhookChangeValue;
        }>;
      }>;
    };
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
    }

    if (payload?.object !== 'page' || !Array.isArray(payload.entry)) {
      return NextResponse.json({ ok: true, processed: 0, stored: 0 }, { status: 200 });
    }

    const { accessToken } = await getMetaConfig();
    const existingLeads = await prisma.lead.findMany({ select: { phone: true } });
    const existingPhones = new Set(
      existingLeads.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
    );

    let processed = 0;
    let stored = 0;
    let skipped = 0;

    for (const entry of payload.entry) {
      if (!Array.isArray(entry?.changes)) continue;
      for (const change of entry.changes) {
        if (change?.field !== 'leadgen' || !change.value || typeof change.value !== 'object') continue;
        processed++;

        const val = change.value;
        const leadgenId = typeof val.leadgen_id === 'string' ? val.leadgen_id.trim() : '';

        let rawName = (val.full_name || val.name || '').trim();
        let rawPhone = (val.phone_number || val.phone || val.whatsapp_number || '').trim();
        let rawEmail = (val.email || '').trim().toLowerCase();
        let formName = (val.form_name || '').trim();
        let adName = (val.ad_name || '').trim();
        let campaignName = (val.campaign_name || '').trim();
        let createdRaw: string | number | undefined = val.created_time;

        const inlineMap = extractFieldDataMap(val.field_data);
        if (!rawName) rawName = inlineMap.full_name || inlineMap.name || inlineMap.first_name || '';
        if (!rawPhone) rawPhone = inlineMap.phone_number || inlineMap.phone || inlineMap.whatsapp_number || '';
        if (!rawEmail) rawEmail = (inlineMap.email || inlineMap.email_address || '').toLowerCase();

        if (!rawPhone && leadgenId && accessToken) {
          const graphLead = await fetchMetaLeadDetails(leadgenId, accessToken);
          if (graphLead) {
            const graphMap = extractFieldDataMap(graphLead.field_data);
            rawName = rawName || graphMap.full_name || graphMap.name || graphMap.first_name || '';
            rawPhone = rawPhone || graphMap.phone_number || graphMap.phone || graphMap.whatsapp_number || '';
            rawEmail = rawEmail || (graphMap.email || graphMap.email_address || '').toLowerCase();
            formName = formName || (graphLead.form_name || '').trim();
            adName = adName || (graphLead.ad_name || '').trim();
            campaignName = campaignName || (graphLead.campaign_name || '').trim();
            createdRaw = graphLead.created_time ?? createdRaw;
          }
        }

        const phone = normalizeMetaLeadPhone(rawPhone);
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 7) {
          skipped++;
          continue;
        }

        const key10 = digits.slice(-10);
        if (key10 && existingPhones.has(key10)) {
          skipped++;
          continue;
        }

        const email =
          rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail)
            ? rawEmail
            : `no-email+${digits}@leads.eduexpressint.com`;
        const createdAt = parseWebhookTimestamp(createdRaw);
        const resolvedFormName = formName || (val.form_id ? `Form ${val.form_id}` : 'WebLead&InstantForm_18_4_2026');

        const createdLead = await prisma.lead.create({
          data: {
            name: (rawName || 'Student').slice(0, 120),
            email,
            phone,
            country: 'China',
            program: 'China March 2027 Intake',
            message: [
              `Meta Instant Form (${resolvedFormName})`,
              `Campaign: ${campaignName || 'META_Leads_BD_China-Mar2027_2026Q1'}`,
              adName && `Ad: ${adName}`,
              leadgenId && `Lead ID: ${leadgenId}`,
            ]
              .filter(Boolean)
              .join(' | '),
            status: 'new',
            source: 'meta_china_march_2027',
            leadType: 'assessment',
            assignedTeam: 'china',
            destinationInterest: 'china',
            landingPage: '/china-march-2027-intake',
            adTrackingConsent: true,
            consentTimestamp: createdAt,
            consentPolicyVersion: '2026-04-privacy-v1',
            ...(createdAt.getTime() <= Date.now() + 60_000 ? { createdAt } : {}),
          },
        });

        after(() => sendCrmStage(createdLead, 'new'));

        stored++;
        if (key10) existingPhones.add(key10);
      }
    }

    return NextResponse.json({ ok: true, processed, stored, skipped }, { status: 200 });
  } catch (error) {
    console.error('Meta leads webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

#!/usr/bin/env node
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { mapMetaGraphLeadToImportPayload } = await import('../src/lib/lead-workflow.ts');
const prismaModule = await import('../src/lib/prisma.ts');
const prisma = prismaModule.default;

const token = process.argv[2] || process.env.META_LEAD_ACCESS_TOKEN;
if (!token) {
  console.error('Usage: node scripts/sync-meta-leads-graph.mjs <page-or-system-token> [form-id]');
  process.exit(1);
}

const formId = process.argv[3] || '986182003780725';
console.log(`Starting sync for form ${formId}...`);

async function fetchAllLeads(targetFormId, accessToken) {
  let url = `https://graph.facebook.com/v26.0/${targetFormId}/leads?fields=id,created_time,field_data,ad_name,campaign_name,form_id,form_name&limit=100`;
  const all = [];
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Graph error: ${res.status} ${err}`);
    }
    const json = await res.json();
    if (Array.isArray(json.data)) {
      all.push(...json.data);
    }
    url = json.paging?.next || null;
  }
  return all;
}

const rawLeads = await fetchAllLeads(formId, token);
console.log(`Fetched ${rawLeads.length} total leads from Meta.`);

const existing = await prisma.lead.findMany({ select: { phone: true } });
const existingPhones = new Set(
  existing.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
);

let imported = 0;
let skipped = 0;

for (const raw of rawLeads) {
  const payload = mapMetaGraphLeadToImportPayload(raw, { formName: 'WebLead&InstantForm_18_4_2026' });
  if (!payload) {
    skipped += 1;
    continue;
  }
  const key10 = payload.phone.replace(/\D/g, '').slice(-10);
  if (key10 && existingPhones.has(key10)) {
    skipped += 1;
    continue;
  }

  const parsedConsent = new Date(payload.consentTimestamp);
  const validConsent = !Number.isNaN(parsedConsent.getTime()) ? parsedConsent : new Date();

  await prisma.lead.create({
    data: {
      ...payload,
      consentTimestamp: validConsent,
      ...(validConsent.getTime() <= Date.now() + 60_000 ? { createdAt: validConsent } : {}),
    },
  });
  imported += 1;
  if (key10) existingPhones.add(key10);
}

console.log(`Successfully imported ${imported} new Meta Instant Form leads (${skipped} skipped/duplicate).`);
await prisma.$disconnect();

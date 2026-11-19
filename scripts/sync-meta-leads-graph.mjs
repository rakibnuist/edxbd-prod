#!/usr/bin/env node
import crypto from 'node:crypto';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { mapMetaGraphLeadToImportPayload, selectCounselorFromPool } = await import('../src/lib/lead-workflow.ts');
const { parseNumericGpa } = await import('../src/lib/wa-templates.ts');
const { decryptSecret } = await import('../src/lib/secret-box.ts');
const {
  ALERT_KEY_BOT_TOKEN,
  ALERT_KEY_CHAT_ID,
  ALERT_KEY_PREFS,
  buildNewLeadTelegramHtml,
  resolveAlertConfigFromRows,
  sendTelegramBotMessage,
} = await import('../src/lib/telegram.ts');
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

const [rawLeads, existing, activeEmployees, settingRows] = await Promise.all([
  fetchAllLeads(formId, token),
  prisma.lead.findMany({ select: { phone: true } }),
  prisma.employee.findMany({
    where: { active: true },
    orderBy: { empId: 'asc' },
    select: {
      id: true,
      empId: true,
      name: true,
      team: true,
      role: true,
      _count: {
        select: {
          leads: {
            where: { status: { notIn: ['closed', 'not_interested', 'enrolled', 'converted'] } },
          },
        },
      },
    },
  }),
  prisma.setting.findMany({
    where: { key: { in: [ALERT_KEY_BOT_TOKEN, ALERT_KEY_CHAT_ID, ALERT_KEY_PREFS] } },
  }).catch(() => []),
]);
console.log(`Fetched ${rawLeads.length} total leads from Meta.`);

const existingPhones = new Set(
  existing.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
);
const pool = activeEmployees.map((e) => ({
  id: e.id,
  empId: e.empId,
  name: e.name,
  team: e.team,
  role: e.role,
  activeCount: e._count.leads,
}));
const alertCfg = resolveAlertConfigFromRows(settingRows, decryptSecret, { includeSecret: true });

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
  const chosen = selectCounselorFromPool(pool, {
    assignedTeam: payload.assignedTeam,
    country: payload.country,
  });
  if (chosen) chosen.activeCount += 1;

  const parsedGpa = parseNumericGpa(null, payload.assessAcademicResults);
  const createdLead = await prisma.lead.create({
    data: {
      ...payload,
      assignedTo: chosen?.name ?? null,
      assignedEmployeeId: chosen?.id ?? null,
      publicToken: crypto.randomBytes(12).toString('hex'),
      publicEnabled: true,
      gpa: parsedGpa,
      degree: payload.assessAcademicLevel || null,
      consentTimestamp: validConsent,
      ...(validConsent.getTime() <= Date.now() + 60_000 ? { createdAt: validConsent } : {}),
    },
  });

  await prisma.activityEvent.create({
    data: {
      type: 'lead_created',
      actorName: 'Meta Graph Cron',
      employeeId: chosen?.id ?? null,
      leadId: createdLead.id,
      leadName: createdLead.name,
      toValue: chosen?.name || payload.assignedTeam,
      details: `${payload.country} · ${payload.source}`,
    },
  }).catch(() => {});

  if (alertCfg.telegramBotToken && alertCfg.telegramChatId) {
    const html = buildNewLeadTelegramHtml(createdLead, alertCfg.preferences);
    if (html) {
      await sendTelegramBotMessage(alertCfg.telegramBotToken, alertCfg.telegramChatId, html).catch(() => {});
    }
  }

  imported += 1;
  if (key10) existingPhones.add(key10);
}

console.log(`Successfully imported ${imported} new Meta Instant Form leads (${skipped} skipped/duplicate).`);
await prisma.$disconnect();

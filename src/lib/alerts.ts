import 'server-only';
import prisma from '@/lib/prisma';
import { decryptSecret, encryptSecret } from '@/lib/secret-box';
import {
  ALERT_KEY_BOT_TOKEN,
  ALERT_KEY_CHAT_ID,
  ALERT_KEY_PREFS,
  type AlertPreferences,
  buildNewLeadTelegramHtml,
  DEFAULT_ALERT_PREFS,
  escapeTelegramHtml,
  resolveAlertConfigFromRows,
  sendTelegramBotMessage,
} from '@/lib/telegram';

export { DEFAULT_ALERT_PREFS, type AlertPreferences };

export async function getAlertConfig(options?: { includeSecret?: boolean }): Promise<{
  telegramBotToken: string;
  telegramBotTokenSet: boolean;
  telegramChatId: string;
  preferences: AlertPreferences;
}> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: [ALERT_KEY_BOT_TOKEN, ALERT_KEY_CHAT_ID, ALERT_KEY_PREFS] } },
  }).catch(() => []);

  return resolveAlertConfigFromRows(rows, decryptSecret, options);
}

export async function saveAlertConfig(input: {
  telegramBotToken?: string;
  telegramChatId?: string;
  preferences?: Partial<AlertPreferences>;
}): Promise<void> {
  if (typeof input.telegramBotToken === 'string') {
    const clean = input.telegramBotToken.trim();
    const sealed = clean ? encryptSecret(clean) : '';
    await prisma.setting.upsert({
      where: { key: ALERT_KEY_BOT_TOKEN },
      update: { value: sealed },
      create: { key: ALERT_KEY_BOT_TOKEN, value: sealed },
    });
  }

  if (typeof input.telegramChatId === 'string') {
    const cleanChat = input.telegramChatId.trim().slice(0, 80);
    await prisma.setting.upsert({
      where: { key: ALERT_KEY_CHAT_ID },
      update: { value: cleanChat },
      create: { key: ALERT_KEY_CHAT_ID, value: cleanChat },
    });
  }

  if (input.preferences) {
    const current = await getAlertConfig();
    const nextPrefs: AlertPreferences = {
      enabled: typeof input.preferences.enabled === 'boolean' ? input.preferences.enabled : current.preferences.enabled,
      alertOnNewLead: typeof input.preferences.alertOnNewLead === 'boolean' ? input.preferences.alertOnNewLead : current.preferences.alertOnNewLead,
      alertOnHighGpaOnly: typeof input.preferences.alertOnHighGpaOnly === 'boolean' ? input.preferences.alertOnHighGpaOnly : current.preferences.alertOnHighGpaOnly,
      minGpaThreshold:
        typeof input.preferences.minGpaThreshold === 'number' && Number.isFinite(input.preferences.minGpaThreshold)
          ? Math.min(5.5, Math.max(0, Number(input.preferences.minGpaThreshold.toFixed(2))))
          : current.preferences.minGpaThreshold,
      alertOnPortalActivity: typeof input.preferences.alertOnPortalActivity === 'boolean' ? input.preferences.alertOnPortalActivity : current.preferences.alertOnPortalActivity,
    };
    await prisma.setting.upsert({
      where: { key: ALERT_KEY_PREFS },
      update: { value: JSON.stringify(nextPrefs) },
      create: { key: ALERT_KEY_PREFS, value: JSON.stringify(nextPrefs) },
    });
  }
}

export async function sendTelegramAlert(htmlMessage: string): Promise<{ ok: boolean; error?: string }> {
  const cfg = await getAlertConfig({ includeSecret: true });
  return sendTelegramBotMessage(cfg.telegramBotToken, cfg.telegramChatId, htmlMessage);
}

export async function notifyNewLeadAlert(lead: {
  id: string;
  name: string;
  phone: string;
  country: string;
  program?: string | null;
  source: string;
  gpa?: number | null;
  assessAcademicResults?: string | null;
  assessAcademicLevel?: string | null;
  assignedTo?: string | null;
}): Promise<void> {
  const cfg = await getAlertConfig({ includeSecret: true });
  if (!cfg.telegramBotToken || !cfg.telegramChatId) return;
  const html = buildNewLeadTelegramHtml(lead, cfg.preferences);
  if (!html) return;
  await sendTelegramBotMessage(cfg.telegramBotToken, cfg.telegramChatId, html).catch(() => {});
}

export async function notifyPortalActivityAlert(input: {
  kind: 'document_upload' | 'student_message';
  leadId: string;
  leadName: string;
  country?: string | null;
  assignedTo?: string | null;
  detail: string;
}): Promise<void> {
  const cfg = await getAlertConfig({ includeSecret: true });
  if (!cfg.preferences.enabled || !cfg.preferences.alertOnPortalActivity) return;
  if (!cfg.telegramBotToken || !cfg.telegramChatId) return;

  const title = input.kind === 'document_upload'
    ? '📄 <b>Student Uploaded Document Link</b>'
    : '💬 <b>New Student Portal Message</b>';

  const lines = [
    title,
    `<b>Student:</b> ${escapeTelegramHtml(input.leadName)}${input.country ? ` (${escapeTelegramHtml(input.country)})` : ''}`,
    `<b>Counselor:</b> ${escapeTelegramHtml(input.assignedTo || 'Admissions Desk')}`,
    `<b>Detail:</b> ${escapeTelegramHtml(input.detail.slice(0, 350))}`,
    `🔗 <a href="https://eduexpressint.com/admin/leads?lead=${encodeURIComponent(input.leadId)}">Review in Admin Portal</a>`,
  ];

  await sendTelegramBotMessage(cfg.telegramBotToken, cfg.telegramChatId, lines.join('\n')).catch(() => {});
}

export async function notifyScholarshipNoticeAlert(input: {
  universityName: string;
  deadline: string;
  sourceUrl?: string | null;
  action: 'created_draft' | 'updated_draft' | 'created_refresh_draft';
}): Promise<void> {
  const cfg = await getAlertConfig({ includeSecret: true });
  if (!cfg.preferences.enabled) return;
  if (!cfg.telegramBotToken || !cfg.telegramChatId) return;

  const badge =
    input.action === 'created_refresh_draft'
      ? '🔄 <b>China Scholarship Refresh Draft</b>'
      : input.action === 'updated_draft'
        ? '📝 <b>China Scholarship Draft Updated</b>'
        : '🎓 <b>New China Scholarship Draft</b>';

  const lines = [
    badge,
    `<b>University:</b> ${escapeTelegramHtml(input.universityName)}`,
    `<b>Deadline:</b> ${escapeTelegramHtml(input.deadline)}`,
    input.sourceUrl ? `<b>Official URL:</b> ${escapeTelegramHtml(input.sourceUrl)}` : '',
    `🔗 <a href="https://eduexpressint.com/admin/content">Review Draft in Content Desk</a>`,
  ].filter(Boolean);

  await sendTelegramBotMessage(cfg.telegramBotToken, cfg.telegramChatId, lines.join('\n')).catch(() => {});
}

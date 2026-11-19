import 'server-only';
import prisma from '@/lib/prisma';
import { decryptSecret, encryptSecret } from '@/lib/secret-box';

const KEY_BOT_TOKEN = 'alert_telegram_bot_token';
const KEY_CHAT_ID = 'alert_telegram_chat_id';
const KEY_PREFS = 'alert_preferences_json';

export interface AlertPreferences {
  enabled: boolean;
  alertOnNewLead: boolean;
  alertOnHighGpaOnly: boolean;
  minGpaThreshold: number;
  alertOnPortalActivity: boolean;
}

export const DEFAULT_ALERT_PREFS: AlertPreferences = {
  enabled: true,
  alertOnNewLead: true,
  alertOnHighGpaOnly: false,
  minGpaThreshold: 3.5,
  alertOnPortalActivity: true,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function getAlertConfig(options?: { includeSecret?: boolean }): Promise<{
  telegramBotToken: string;
  telegramBotTokenSet: boolean;
  telegramChatId: string;
  preferences: AlertPreferences;
}> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: [KEY_BOT_TOKEN, KEY_CHAT_ID, KEY_PREFS] } },
  }).catch(() => []);

  const map = new Map(rows.map((r) => [r.key, r.value]));
  const storedToken = map.get(KEY_BOT_TOKEN);
  const decrypted = storedToken ? decryptSecret(storedToken) : '';
  const botToken = decrypted || (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (map.get(KEY_CHAT_ID) || process.env.TELEGRAM_CHAT_ID || '').trim();

  let preferences = { ...DEFAULT_ALERT_PREFS };
  const rawPrefs = map.get(KEY_PREFS);
  if (rawPrefs) {
    try {
      const parsed = JSON.parse(rawPrefs) as Partial<AlertPreferences>;
      preferences = {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_ALERT_PREFS.enabled,
        alertOnNewLead: typeof parsed.alertOnNewLead === 'boolean' ? parsed.alertOnNewLead : DEFAULT_ALERT_PREFS.alertOnNewLead,
        alertOnHighGpaOnly: typeof parsed.alertOnHighGpaOnly === 'boolean' ? parsed.alertOnHighGpaOnly : DEFAULT_ALERT_PREFS.alertOnHighGpaOnly,
        minGpaThreshold:
          typeof parsed.minGpaThreshold === 'number' && Number.isFinite(parsed.minGpaThreshold)
            ? Math.min(5.5, Math.max(0, Number(parsed.minGpaThreshold.toFixed(2))))
            : DEFAULT_ALERT_PREFS.minGpaThreshold,
        alertOnPortalActivity: typeof parsed.alertOnPortalActivity === 'boolean' ? parsed.alertOnPortalActivity : DEFAULT_ALERT_PREFS.alertOnPortalActivity,
      };
    } catch {
      // keep defaults
    }
  }

  return {
    telegramBotToken: options?.includeSecret ? botToken : '',
    telegramBotTokenSet: Boolean(botToken),
    telegramChatId: chatId,
    preferences,
  };
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
      where: { key: KEY_BOT_TOKEN },
      update: { value: sealed },
      create: { key: KEY_BOT_TOKEN, value: sealed },
    });
  }

  if (typeof input.telegramChatId === 'string') {
    const cleanChat = input.telegramChatId.trim().slice(0, 80);
    await prisma.setting.upsert({
      where: { key: KEY_CHAT_ID },
      update: { value: cleanChat },
      create: { key: KEY_CHAT_ID, value: cleanChat },
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
      where: { key: KEY_PREFS },
      update: { value: JSON.stringify(nextPrefs) },
      create: { key: KEY_PREFS, value: JSON.stringify(nextPrefs) },
    });
  }
}

export async function sendTelegramAlert(htmlMessage: string): Promise<{ ok: boolean; error?: string }> {
  const cfg = await getAlertConfig({ includeSecret: true });
  if (!cfg.telegramBotToken || !cfg.telegramChatId) {
    return { ok: false, error: 'Telegram Bot Token or Chat ID is not configured.' };
  }

  try {
    const url = `https://api.telegram.org/bot${cfg.telegramBotToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cfg.telegramChatId,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(6000),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.description || `Telegram HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Telegram request failed' };
  }
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
  if (!cfg.preferences.enabled || !cfg.preferences.alertOnNewLead) return;
  if (!cfg.telegramBotToken || !cfg.telegramChatId) return;

  const gpa = lead.gpa ?? (lead.assessAcademicResults ? Number.parseFloat(lead.assessAcademicResults) || null : null);
  const isHot = gpa !== null && gpa >= cfg.preferences.minGpaThreshold;
  if (cfg.preferences.alertOnHighGpaOnly && !isHot) return;

  const header = isHot
    ? `🔥 <b>HOT LEAD (GPA ${gpa!.toFixed(2)})</b>`
    : `📩 <b>New Student Lead</b>`;

  const lines = [
    header,
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Phone:</b> <code>${escapeHtml(lead.phone)}</code>`,
    `<b>Destination:</b> ${escapeHtml(lead.country)}${lead.program ? ` · ${escapeHtml(lead.program)}` : ''}`,
    lead.assessAcademicLevel || lead.assessAcademicResults || gpa
      ? `<b>Academics:</b> ${escapeHtml([lead.assessAcademicLevel, gpa ? `GPA ${gpa.toFixed(2)}` : lead.assessAcademicResults].filter(Boolean).join(' · '))}`
      : '',
    `<b>Source:</b> ${escapeHtml(lead.source)}`,
    `<b>Assigned:</b> ${escapeHtml(lead.assignedTo || 'Unassigned')}`,
    `🔗 <a href="https://eduexpressint.com/admin/leads?lead=${encodeURIComponent(lead.id)}">Open in Leads Desk</a>`,
  ].filter(Boolean);

  await sendTelegramAlert(lines.join('\n')).catch(() => {});
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
    `<b>Student:</b> ${escapeHtml(input.leadName)}${input.country ? ` (${escapeHtml(input.country)})` : ''}`,
    `<b>Counselor:</b> ${escapeHtml(input.assignedTo || 'Admissions Desk')}`,
    `<b>Detail:</b> ${escapeHtml(input.detail.slice(0, 350))}`,
    `🔗 <a href="https://eduexpressint.com/admin/leads?lead=${encodeURIComponent(input.leadId)}">Review in Admin Portal</a>`,
  ];

  await sendTelegramAlert(lines.join('\n')).catch(() => {});
}

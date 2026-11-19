export const ALERT_KEY_BOT_TOKEN = 'alert_telegram_bot_token';
export const ALERT_KEY_CHAT_ID = 'alert_telegram_chat_id';
export const ALERT_KEY_PREFS = 'alert_preferences_json';

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

export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function normalizeAlertPreferences(raw: string | undefined | null): AlertPreferences {
  if (!raw) return { ...DEFAULT_ALERT_PREFS };
  try {
    const parsed = JSON.parse(raw) as Partial<AlertPreferences>;
    return {
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
    return { ...DEFAULT_ALERT_PREFS };
  }
}

export function resolveAlertConfigFromRows(
  rows: Array<{ key: string; value: string }>,
  decryptFn: (stored: string | null | undefined) => string,
  options?: { includeSecret?: boolean },
): {
  telegramBotToken: string;
  telegramBotTokenSet: boolean;
  telegramChatId: string;
  preferences: AlertPreferences;
} {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const storedToken = map.get(ALERT_KEY_BOT_TOKEN);
  const decrypted = storedToken ? decryptFn(storedToken) : '';
  const botToken = decrypted || (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (map.get(ALERT_KEY_CHAT_ID) || process.env.TELEGRAM_CHAT_ID || '').trim();

  return {
    telegramBotToken: options?.includeSecret ? botToken : '',
    telegramBotTokenSet: Boolean(botToken),
    telegramChatId: chatId,
    preferences: normalizeAlertPreferences(map.get(ALERT_KEY_PREFS)),
  };
}

export function buildNewLeadTelegramHtml(
  lead: {
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
  },
  preferences: AlertPreferences,
): string | null {
  if (!preferences.enabled || !preferences.alertOnNewLead) return null;

  const gpa = lead.gpa ?? (lead.assessAcademicResults ? Number.parseFloat(lead.assessAcademicResults) || null : null);
  const isHot = gpa !== null && gpa >= preferences.minGpaThreshold;
  if (preferences.alertOnHighGpaOnly && !isHot) return null;

  const header = isHot
    ? `🔥 <b>HOT LEAD (GPA ${gpa!.toFixed(2)})</b>`
    : `📩 <b>New Student Lead</b>`;

  const lines = [
    header,
    `<b>Name:</b> ${escapeTelegramHtml(lead.name)}`,
    `<b>Phone:</b> <code>${escapeTelegramHtml(lead.phone)}</code>`,
    `<b>Destination:</b> ${escapeTelegramHtml(lead.country)}${lead.program ? ` · ${escapeTelegramHtml(lead.program)}` : ''}`,
    lead.assessAcademicLevel || lead.assessAcademicResults || gpa
      ? `<b>Academics:</b> ${escapeTelegramHtml([lead.assessAcademicLevel, gpa ? `GPA ${gpa.toFixed(2)}` : lead.assessAcademicResults].filter(Boolean).join(' · '))}`
      : '',
    `<b>Source:</b> ${escapeTelegramHtml(lead.source)}`,
    `<b>Assigned:</b> ${escapeTelegramHtml(lead.assignedTo || 'Unassigned')}`,
    `🔗 <a href="https://eduexpressint.com/admin/leads?lead=${encodeURIComponent(lead.id)}">Open in Leads Desk</a>`,
  ].filter(Boolean);

  return lines.join('\n');
}

export async function sendTelegramBotMessage(
  botToken: string,
  chatId: string,
  htmlMessage: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!botToken || !chatId) {
    return { ok: false, error: 'Telegram Bot Token or Chat ID is not configured.' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
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

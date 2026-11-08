import 'server-only';
import { createHash } from 'node:crypto';
import { sendMetaEvents, type MetaDelivery } from '@/lib/meta-api';
import { recordMetaDelivery } from '@/lib/meta-health';
import { getAllSettings, resolveMetaConfig } from '@/lib/settings';

// Meta "Send a CRM event" (Conversions API for CRM / conversion leads).
// Each lead stage change is sent to the website dataset as a system_generated
// event with event_source "crm", so Meta can learn which leads become students.
// Stage names are deliberately not standard events (Lead, Purchase…) so CRM
// stages never inflate website conversion reporting.

export const CRM_LEAD_EVENT_SOURCE = 'EduExpress CRM';

const STAGES: Record<string, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  consultation_scheduled: 'Consultation Scheduled',
  consultation_completed: 'Consultation Completed',
  qualified: 'Qualified Lead',
  application_started: 'Application Started',
  application_submitted: 'Application Submitted',
  admission_received: 'Admission Received',
  visa_applied: 'Visa Applied',
  visa_approved: 'Visa Approved',
  enrolled: 'Enrolled',
  converted: 'Converted',
  not_interested: 'Not Interested',
  closed: 'Closed Lost',
  // "no_response" is a follow-up flag, not a funnel stage, so it is not sent.
};

export const crmStageName = (status: string) => STAGES[status] ?? null;

export type CrmLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  adTrackingConsent: boolean;
  metaFbc?: string | null;
  metaFbp?: string | null;
};

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const normalEmail = (value: string) => value.trim().toLowerCase();
const normalName = (value: string) => value.trim().toLowerCase().replace(/[^\p{L}]/gu, '');

/** Digits with country code; Bangladeshi local numbers (01XXXXXXXXX) get 880. */
export function normalPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('01')) digits = `88${digits}`;
  return digits;
}

/** Build one CRM event in Meta's documented shape, or null when the status is not a stage. */
export function buildCrmEvent(lead: CrmLead, status: string, eventTime = Date.now()) {
  const stage = crmStageName(status);
  if (!stage) return null;
  const [first, ...rest] = lead.name.trim().split(/\s+/);
  const phone = normalPhone(lead.phone || '');
  const firstName = first ? normalName(first) : '';
  const lastName = rest.length ? normalName(rest.join('')) : '';
  return {
    event_name: stage,
    event_time: Math.floor(eventTime / 1000),
    action_source: 'system_generated',
    custom_data: { event_source: 'crm', lead_event_source: CRM_LEAD_EVENT_SOURCE },
    user_data: {
      ...(lead.email ? { em: [sha256(normalEmail(lead.email))] } : {}),
      ...(phone ? { ph: [sha256(phone)] } : {}),
      ...(firstName ? { fn: [sha256(firstName)] } : {}),
      ...(lastName ? { ln: [sha256(lastName)] } : {}),
      ...(phone.startsWith('880') ? { country: [sha256('bd')] } : {}),
      external_id: [sha256(lead.id)],
      ...(lead.metaFbc ? { fbc: lead.metaFbc } : {}),
      ...(lead.metaFbp ? { fbp: lead.metaFbp } : {}),
    },
  };
}

export type CrmDelivery = MetaDelivery | { ok: false; skipped: string };

/**
 * Send a lead's stage to Meta. Skips leads without advertising consent, statuses
 * that are not stages, and sites without a saved Meta access token. Never throws.
 * Admin Settings key `metaCrmTestEventCode` routes events to Events Manager → Test events.
 */
export async function sendCrmStage(lead: CrmLead, status: string): Promise<CrmDelivery> {
  try {
    if (!lead.adTrackingConsent) return { ok: false, skipped: 'no advertising consent' };
    const event = buildCrmEvent(lead, status);
    if (!event) return { ok: false, skipped: 'not a CRM stage' };
    const settings = await getAllSettings();
    const config = resolveMetaConfig(settings);
    if (!config.pixelId || !config.accessToken) return { ok: false, skipped: 'Meta access token not configured' };
    const testCode = settings.metaCrmTestEventCode?.trim() || process.env.META_CRM_TEST_EVENT_CODE?.trim() || undefined;
    const result = await sendMetaEvents(config, [event], fetch, testCode);
    // Production sends update Settings → Meta tracking ("Last accepted server event").
    if (!testCode) await recordMetaDelivery(config, result);
    if (!result.ok) console.warn(`Meta CRM stage "${event.event_name}" not delivered: ${result.error}`);
    return result;
  } catch {
    console.warn('Meta CRM stage could not be sent.');
    return { ok: false, skipped: 'unexpected error' };
  }
}

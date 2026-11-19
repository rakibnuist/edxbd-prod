export type LeadSyncPayload = {
  name: string;
  phone: string;
  email?: string | null;
  destination?: string | null;
  program?: string | null;
  major?: string | null;
  source?: string | null;
  referrer?: string | null;
  message?: string | null;
  notes?: string | null;
  page_url?: string | null;
  last_education?: string | null;
  gpa?: number | null;
  english_score?: string | null;
  intake_term?: string | null;
};

/**
 * Forwards a lead from eduexpressint.com to the live EduExpress CRM.
 * Runs non-blocking (e.g. inside Next.js `after()`).
 */
export async function syncLeadToCrm(payload: LeadSyncPayload): Promise<boolean> {
  const crmUrl = process.env.CRM_WEBHOOK_URL || 'https://crm.eduexpressint.com/api/webhook/website-lead';
  const crmSecret = process.env.CRM_WEBHOOK_SECRET || process.env.WEBSITE_WEBHOOK_SECRET;

  if (!crmSecret) {
    console.warn('[crm-sync] CRM_WEBHOOK_SECRET is not configured; skipping CRM forward.');
    return false;
  }

  try {
    const res = await fetch(crmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': crmSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[crm-sync] CRM webhook returned HTTP ${res.status}: ${errText}`);
      return false;
    }

    const data = (await res.json().catch(() => ({}))) as { success?: boolean; lead_id?: string | number };
    console.log(`[crm-sync] Lead synced to CRM successfully: lead_id=${data.lead_id ?? 'OK'}`);
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[crm-sync] Failed to sync lead to CRM:', msg);
    return false;
  }
}

export const LEAD_STATUSES = [
  ['new', 'New'], ['contacted', 'Contacted'], ['no_response', 'No Response'],
  ['consultation_scheduled', 'Consultation scheduled'], ['consultation_completed', 'Consultation completed'],
  ['qualified', 'Qualified'], ['application_started', 'Application started'],
  ['application_submitted', 'Application submitted'], ['admission_received', 'Admission received'],
  ['visa_applied', 'Visa applied'], ['visa_approved', 'Visa approved'], ['enrolled', 'Enrolled'],
  ['converted', 'Converted'], ['not_interested', 'Not interested'], ['closed', 'Closed'],
] as const;
export type LeadStatus = typeof LEAD_STATUSES[number][0];
export type LeadQueue = 'all' | 'new' | 'no_response' | 'in_progress' | 'closed';
export type LeadRecord = {
  id: string; name: string; email: string; phone?: string | null; country: string;
  program?: string | null; message?: string | null; status: string; source: string;
  notes?: string | null; assignedTeam?: string | null; assignedTo?: string | null;
  leadType?: string; riskFlag?: boolean; medicalProgram?: boolean;
  assessAcademicLevel?: string | null; assessAcademicResults?: string | null;
  assessSubject?: string | null; assessBudget?: string | null; assessIntake?: string | null;
  assessLanguage?: string | null; assessCareerGoal?: string | null;
  destinationInterest?: string | null; landingPage?: string | null;
  createdAt: string; updatedAt: string;
};
export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === 'string' && LEAD_STATUSES.some(([status]) => status === value);
export const leadStatusLabel = (value: string) => LEAD_STATUSES.find(([status]) => status === value)?.[1]
  ?? value.replaceAll('_', ' ').replace(/^./, value => value.toUpperCase());
const closed = new Set(['closed', 'not_interested', 'enrolled', 'converted']);
export function leadQueue(status: string): Exclude<LeadQueue, 'all'> {
  if (status === 'new' || status === 'no_response') return status;
  return closed.has(status) ? 'closed' : 'in_progress';
}
export const leadStatusTone = (status: string) => status === 'no_response' ? 'bg-amber-50 text-amber-900'
  : status === 'new' ? 'bg-sky-50 text-sky-900'
  : ['enrolled', 'converted', 'visa_approved'].includes(status) ? 'bg-emerald-50 text-emerald-900'
  : 'bg-gray-100 text-gray-700';
export function leadCounts(leads: LeadRecord[]) {
  const counts = { all: leads.length, new: 0, no_response: 0, in_progress: 0, closed: 0 };
  for (const lead of leads) counts[leadQueue(lead.status)]++;
  return counts;
}
export function filterLeads(leads: LeadRecord[], filters: {
  search: string; queue: LeadQueue; status: string; country: string; source: string; sort: string;
}) {
  const query = filters.search.trim().toLocaleLowerCase();
  return leads.filter(lead => (!query || [lead.name, lead.email, lead.phone, lead.country, lead.program, lead.source]
    .some(value => value?.toLocaleLowerCase().includes(query)))
    && (filters.queue === 'all' || leadQueue(lead.status) === filters.queue)
    && (filters.status === 'all' || lead.status === filters.status)
    && (filters.country === 'all' || lead.country === filters.country)
    && (filters.source === 'all' || lead.source === filters.source))
    .sort((a, b) => filters.sort === 'oldest' ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
      : filters.sort === 'updated' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      : Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
export function validateLeadUpdate(value: unknown): { data?: { status?: LeadStatus; notes?: string }; error?: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Provide a lead update.' };
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some(key => !['status', 'notes'].includes(key))) return { error: 'Only status and counselor notes can be updated here.' };
  const data: { status?: LeadStatus; notes?: string } = {};
  if ('status' in body) {
    if (!isLeadStatus(body.status)) return { error: 'Choose a supported lead status.' };
    data.status = body.status;
  }
  if ('notes' in body) {
    if (typeof body.notes !== 'string' || body.notes.length > 12000) return { error: 'Counselor notes must be text of at most 12,000 characters.' };
    data.notes = body.notes.trim();
  }
  return Object.keys(data).length ? { data } : { error: 'Choose a status or update the counselor notes.' };
}
export function leadContactLinks(lead: Pick<LeadRecord, 'phone' | 'email' | 'name'>) {
  const rawDigits = (lead.phone || '').replace(/[^0-9]/g, '');
  const digits = /^88001[0-9]{9}$/.test(rawDigits)
    ? `880${rawDigits.slice(4)}`
    : /^1[3-9][0-9]{8}$/.test(rawDigits)
      ? `880${rawDigits}`
      : rawDigits;
  const whatsapp = digits.startsWith('00880') ? digits.slice(2) : /^01[0-9]{9}$/.test(digits) ? `88${digits}` : digits;
  const callPrefix = (lead.phone || '').trim().startsWith('+') || /^8801[0-9]{9}$/.test(digits) ? '+' : '';
  return {
    call: digits ? `tel:${callPrefix}${digits}` : null,
    email: lead.email ? `mailto:${encodeURIComponent(lead.email)}` : null,
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}` : null,
  };
}

export type MetaLeadImportPayload = {
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  message: string;
  status: 'new';
  source: string;
  leadType: string;
  assignedTeam: string;
  destinationInterest: string;
  landingPage: string;
  adTrackingConsent: boolean;
  consentTimestamp: string;
  consentPolicyVersion: string;
};

function parseCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out;
}

const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeMetaLeadPhone(raw: string): string {
  let ascii = '';
  for (const ch of raw) {
    const bnIdx = BENGALI_DIGITS.indexOf(ch);
    if (bnIdx !== -1) {
      ascii += String(bnIdx);
      continue;
    }
    const arIdx = ARABIC_INDIC_DIGITS.indexOf(ch);
    if (arIdx !== -1) {
      ascii += String(arIdx);
      continue;
    }
    ascii += ch;
  }
  const cleaned = ascii
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .trim()
    .replace(/^(?:p|tel):/i, '')
    .replace(/[^\d+]/g, '');
  if (/^\+?88001[3-9]\d{8}$/.test(cleaned)) {
    return `+880${cleaned.replace(/^\+?8800/, '')}`;
  }
  if (/^\+?8801[3-9]\d{8}$/.test(cleaned)) {
    return `+${cleaned.replace(/^\+/, '')}`;
  }
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return `+880${cleaned.slice(1)}`;
  }
  if (/^1[3-9]\d{8}$/.test(cleaned)) {
    return `+880${cleaned}`;
  }
  return cleaned;
}

export function parseMetaLeadTimestamp(raw: string): string {
  const trimmed = raw.trim();
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(am|pm)$/i.exec(trimmed);
  if (m) {
    let hour = Number.parseInt(m[4], 10);
    if (m[6].toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (m[6].toLowerCase() === 'am' && hour === 12) hour = 0;
    const isoDhaka = `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}T${String(hour).padStart(2, '0')}:${m[5]}:00+06:00`;
    const parsed = new Date(isoDhaka);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) return direct.toISOString();
  return new Date().toISOString();
}

export function parseMetaLeadsCsv(csvText: string): MetaLeadImportPayload[] {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = parseCsvLine(lines[0], delimiter).map((h) => h.toLowerCase().trim());
  const idx = (names: string[]) => headers.findIndex((h) => names.includes(h));

  const nameIdx = idx(['name', 'full_name', 'full name']);
  const emailIdx = idx(['email', 'email_address', 'email address']);
  const phoneIdx = idx(['phone', 'phone_number', 'phone number', 'contact_number', 'contact number', 'mobile_number', 'mobile number']);
  const secPhoneIdx = idx(['secondary phone number', 'secondary_phone_number']);
  const waPhoneIdx = idx(['whatsapp number', 'whatsapp_number']);
  const createdIdx = idx(['created', 'created_time', 'date']);
  const formIdx = idx(['form', 'form_name']);
  const adNameIdx = idx(['ad_name', 'ad name']);
  const campaignNameIdx = idx(['campaign_name', 'campaign name']);

  const parsedRows: MetaLeadImportPayload[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line, delimiter);
    const name = (nameIdx >= 0 ? cols[nameIdx] : '')?.trim() || 'Student';
    const rawPhone =
      (phoneIdx >= 0 ? cols[phoneIdx] : '') ||
      (waPhoneIdx >= 0 ? cols[waPhoneIdx] : '') ||
      (secPhoneIdx >= 0 ? cols[secPhoneIdx] : '') ||
      '';
    const phone = normalizeMetaLeadPhone(rawPhone);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) continue;

    const rawEmail = (emailIdx >= 0 ? cols[emailIdx] : '')?.trim().toLowerCase() || '';
    const email =
      rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail)
        ? rawEmail
        : `no-email+${digits}@leads.eduexpressint.com`;
    const created = (createdIdx >= 0 ? cols[createdIdx] : '')?.trim() || '';
    const formName = (formIdx >= 0 ? cols[formIdx] : '')?.trim() || 'WebLead&InstantForm_18_4_2026';
    const campaignName = (campaignNameIdx >= 0 ? cols[campaignNameIdx] : '')?.trim() || 'META_Leads_BD_China-Mar2027_2026Q1';
    const adName = (adNameIdx >= 0 ? cols[adNameIdx] : '')?.trim() || '';

    parsedRows.push({
      name: name.slice(0, 120),
      email,
      phone,
      country: 'China',
      program: 'China March 2027 Intake',
      message: [
        `Meta Instant Form (${formName})`,
        `Campaign: ${campaignName}`,
        adName && `Ad: ${adName}`,
        created && `Created: ${created}`,
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
      consentTimestamp: parseMetaLeadTimestamp(created),
      consentPolicyVersion: '2026-04-privacy-v1',
    });
  }

  return parsedRows.reverse();
}

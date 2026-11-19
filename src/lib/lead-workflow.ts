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
  assignedEmployeeId?: string | null;
  publicToken?: string | null; publicEnabled?: boolean;
  applicationStage?: string | null; university?: string | null; degree?: string | null;
  gpa?: number | null; visaDeadline?: string | null; departureDate?: string | null;
  nextFollowup?: string | null; driveLink?: string | null;
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
function extractLeadGpaNumber(lead: Pick<LeadRecord, 'gpa' | 'assessAcademicResults'>): number | null {
  if (typeof lead.gpa === 'number' && Number.isFinite(lead.gpa) && lead.gpa > 0) return lead.gpa;
  const raw = (lead.assessAcademicResults || '').trim();
  if (!raw) return null;
  const m = raw.match(/([0-5](?:\.[0-9]{1,2})?)/);
  if (!m) return null;
  const parsed = Number.parseFloat(m[1]);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 5.5 ? parsed : null;
}

export type LeadQuickPreset = 'all' | 'china_hot' | 'sla_risk' | 'followup_due';

export function filterLeads(leads: LeadRecord[], filters: {
  search: string;
  queue: LeadQueue;
  status: string;
  country: string;
  source: string;
  sort: string;
  gpaMin?: number | null;
  assignedTo?: string;
  quickPreset?: LeadQuickPreset;
}) {
  const query = filters.search.trim().toLocaleLowerCase();
  const gpaMin = typeof filters.gpaMin === 'number' && Number.isFinite(filters.gpaMin) ? filters.gpaMin : null;
  const assignedFilter = filters.assignedTo && filters.assignedTo !== 'all' ? filters.assignedTo : null;
  const quick = filters.quickPreset || 'all';
  const todayDhaka = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);
  const twoHoursAgoMs = Date.now() - 2 * 3600 * 1000;

  return leads.filter(lead => {
    if (query && ![
      lead.name, lead.email, lead.phone, lead.country, lead.program,
      lead.source, lead.university, lead.assignedTo, lead.assessAcademicResults,
    ].some(value => value?.toLocaleLowerCase().includes(query))) {
      return false;
    }
    if (filters.queue !== 'all' && leadQueue(lead.status) !== filters.queue) return false;
    if (filters.status !== 'all' && lead.status !== filters.status) return false;
    if (filters.country !== 'all' && lead.country !== filters.country) return false;
    if (filters.source !== 'all' && lead.source !== filters.source) return false;
    if (assignedFilter) {
      if (assignedFilter === '__unassigned__' && lead.assignedTo) return false;
      if (assignedFilter !== '__unassigned__' && lead.assignedTo !== assignedFilter) return false;
    }
    if (gpaMin !== null) {
      const g = extractLeadGpaNumber(lead);
      if (g === null || g < gpaMin) return false;
    }
    if (quick === 'china_hot') {
      const isChina = (lead.country || '').toLowerCase().includes('china') || (lead.destinationInterest || '').toLowerCase().includes('china');
      const g = extractLeadGpaNumber(lead);
      if (!isChina || (g !== null && g < 3.5)) return false;
      if (g === null && !lead.assessAcademicResults) return false;
    } else if (quick === 'sla_risk') {
      const createdMs = Date.parse(lead.createdAt);
      if (lead.status !== 'new' || Number.isNaN(createdMs) || createdMs > twoHoursAgoMs) return false;
    } else if (quick === 'followup_due') {
      if (!lead.nextFollowup || lead.nextFollowup > todayDhaka || closed.has(lead.status)) return false;
    }
    return true;
  }).sort((a, b) => filters.sort === 'oldest' ? Date.parse(a.createdAt) - Date.parse(b.createdAt)
    : filters.sort === 'updated' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    : filters.sort === 'gpa_desc' ? (extractLeadGpaNumber(b) ?? -1) - (extractLeadGpaNumber(a) ?? -1)
    : Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export type LeadUpdateData = {
  status?: LeadStatus;
  notes?: string;
  assignedTo?: string | null;
  assignedEmployeeId?: string | null;
  applicationStage?: string;
  university?: string | null;
  degree?: string | null;
  gpa?: number | null;
  nextFollowup?: string | null;
  visaDeadline?: string | null;
  departureDate?: string | null;
  driveLink?: string | null;
  publicEnabled?: boolean;
  assessAcademicLevel?: string | null;
  assessAcademicResults?: string | null;
  assessLanguage?: string | null;
};

const ALLOWED_APPLICATION_STAGES = new Set<string>([
  'documents', 'submitted', 'review', 'interview', 'admitted', 'jw202', 'visa', 'enrolled', 'fly',
]);

function normalizeBoundedHttpUrl(raw: unknown, maxLen = 1000): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > maxLen || /[\u0000-\u001f\u007f]/.test(trimmed)) return null;
  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname || parsed.username || parsed.password) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

const ALLOWED_LEAD_UPDATE_KEYS = new Set<string>([
  'status', 'notes', 'assignedTo', 'assignedEmployeeId', 'applicationStage',
  'university', 'degree', 'gpa', 'nextFollowup', 'visaDeadline', 'departureDate',
  'driveLink', 'publicEnabled', 'assessAcademicLevel', 'assessAcademicResults', 'assessLanguage',
]);

function normalizeOptionalShortText(raw: unknown, field: string, maxLen = 200): { ok: true; value: string | null } | { ok: false; error: string } {
  if (raw === null) return { ok: true, value: null };
  if (typeof raw !== 'string') return { ok: false, error: `${field} must be text.` };
  if (raw.length > maxLen) return { ok: false, error: `${field} must be at most ${maxLen} characters.` };
  const trimmed = raw.trim();
  return { ok: true, value: trimmed || null };
}

export function validateLeadUpdate(value: unknown): { data?: LeadUpdateData; error?: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Provide a lead update.' };
  const body = value as Record<string, unknown>;
  if (Object.keys(body).some(key => !ALLOWED_LEAD_UPDATE_KEYS.has(key))) {
    return { error: 'Only supported lead workflow fields can be updated here.' };
  }
  const data: LeadUpdateData = {};
  if ('status' in body) {
    if (!isLeadStatus(body.status)) return { error: 'Choose a supported lead status.' };
    data.status = body.status;
  }
  if ('notes' in body) {
    if (typeof body.notes !== 'string' || body.notes.length > 12000) return { error: 'Counselor notes must be text of at most 12,000 characters.' };
    data.notes = body.notes.trim();
  }
  if ('applicationStage' in body) {
    if (typeof body.applicationStage !== 'string' || !ALLOWED_APPLICATION_STAGES.has(body.applicationStage)) {
      return { error: 'Choose a supported application milestone stage.' };
    }
    data.applicationStage = body.applicationStage;
  }
  if ('publicEnabled' in body) {
    if (typeof body.publicEnabled !== 'boolean') return { error: 'publicEnabled must be true or false.' };
    data.publicEnabled = body.publicEnabled;
  }
  if ('gpa' in body) {
    if (body.gpa === null || body.gpa === '') {
      data.gpa = null;
    } else {
      const n = typeof body.gpa === 'number' ? body.gpa : Number(body.gpa);
      if (!Number.isFinite(n) || n < 0 || n > 5.5) return { error: 'GPA must be between 0 and 5.5.' };
      data.gpa = Number(n.toFixed(2));
    }
  }
  if ('driveLink' in body) {
    if (body.driveLink === null || body.driveLink === '') {
      data.driveLink = null;
    } else {
      const safe = normalizeBoundedHttpUrl(body.driveLink, 1000);
      if (!safe) return { error: 'Drive link must be a valid http(s) URL.' };
      data.driveLink = safe;
    }
  }
  for (const field of ['assignedTo', 'assignedEmployeeId', 'university', 'degree', 'assessAcademicLevel', 'assessAcademicResults', 'assessLanguage'] as const) {
    if (field in body) {
      const res = normalizeOptionalShortText(body[field], field, 200);
      if (!res.ok) return { error: res.error };
      data[field] = res.value;
    }
  }
  for (const dateField of ['nextFollowup', 'visaDeadline', 'departureDate'] as const) {
    if (dateField in body) {
      const res = normalizeOptionalShortText(body[dateField], dateField, 32);
      if (!res.ok) return { error: res.error };
      if (res.value && !/^\d{4}-\d{2}-\d{2}$/.test(res.value)) {
        return { error: `${dateField} must be YYYY-MM-DD.` };
      }
      data[dateField] = res.value;
    }
  }
  return Object.keys(data).length ? { data } : { error: 'Choose a field to update.' };
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
  assessAcademicLevel?: string;
  assessAcademicResults?: string;
  assessLanguage?: string;
  adTrackingConsent: boolean;
  consentTimestamp: string;
  consentPolicyVersion: string;
};

export type ExtractedMetaFormFields = {
  name: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  lastDegree: string;
  gpa: string;
  englishScore: string;
};

const NON_PERSON_NAME_KEY_RE = /(?:^|_|\s)(?:form|ad|adset|campaign|page|owner|stage|source|channel|labels|city|country|university|program)(?:$|_|\s)/i;

function pickFieldValues(
  entries: Array<[string, string]>,
  exactKeys: string[],
  matchers: RegExp[],
  shouldExcludeKey?: (key: string) => boolean,
): string[] {
  const seen = new Set<string>();
  const results: string[] = [];
  const pushVal = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      results.push(trimmed);
    }
  };

  for (const targetKey of exactKeys) {
    for (const [k, v] of entries) {
      if (k === targetKey) pushVal(v);
    }
  }
  for (const matcher of matchers) {
    for (const [k, v] of entries) {
      if (shouldExcludeKey?.(k)) continue;
      if (matcher.test(k)) pushVal(v);
    }
  }
  return results;
}

/**
 * Extracts student name, phone, WhatsApp, email, and academic fields from Meta Instant Form
 * `field_data` maps or CSV columns (including Bengali+English labels on WebLead&InstantForm_18_4_2026).
 */
export function extractMetaFormFields(fieldMap: Record<string, string>): ExtractedMetaFormFields {
  const entries: Array<[string, string]> = Object.entries(fieldMap)
    .map(([k, v]): [string, string] => [k.trim().toLowerCase(), typeof v === 'string' ? v.trim() : ''])
    .filter(([, v]) => Boolean(v));

  const name = pickFieldValues(
    entries,
    ['আপনার নাম (name)', 'আপনার_নাম_(name)', 'full_name', 'full name', 'name', 'first_name', 'first name'],
    [/^(?:full[_\s]?)?name$/i, /(?:\bname\b|নাম|full_?name|first_?name)/i],
    (key) => NON_PERSON_NAME_KEY_RE.test(key),
  )[0] || '';

  const phoneCandidates = pickFieldValues(
    entries,
    [
      'phone_number', 'phone number', 'phone',
      'mobile_number', 'mobile number', 'contact_number', 'contact number',
      'হোয়াটসঅ্যাপ নাম্বার (phone)', 'হোয়াটসঅ্যাপ_নাম্বার_(phone)',
      'whatsapp_number', 'whatsapp number', 'whatsapp',
      'secondary phone number', 'secondary_phone_number',
    ],
    [/(?:phone|whatsapp|mobile|contact[_\s]?number|হোয়াটসঅ্যাপ|নাম্বার|মোবাইল)/i],
    (key) => /(?:^|_)(?:id|code|country)$/i.test(key),
  );

  let phone = '';
  for (const candidate of phoneCandidates) {
    const normalized = normalizeMetaLeadPhone(candidate);
    if (normalized.replace(/\D/g, '').length >= 7) {
      phone = normalized;
      break;
    }
  }
  if (!phone && phoneCandidates[0]) {
    phone = normalizeMetaLeadPhone(phoneCandidates[0]);
  }

  const whatsappCandidates = pickFieldValues(
    entries,
    ['হোয়াটসঅ্যাপ নাম্বার (phone)', 'হোয়াটসঅ্যাপ_নাম্বার_(phone)', 'whatsapp_number', 'whatsapp number', 'whatsapp'],
    [/(?:whatsapp|হোয়াটসঅ্যাপ)/i],
  );
  let whatsappPhone = '';
  for (const candidate of whatsappCandidates) {
    const normalized = normalizeMetaLeadPhone(candidate);
    if (normalized.replace(/\D/g, '').length >= 7) {
      whatsappPhone = normalized;
      break;
    }
  }

  const email = pickFieldValues(
    entries,
    ['email', 'email_address', 'email address'],
    [/(?:email|ইমেইল)/i],
  )[0]?.toLowerCase() || '';

  const lastDegree = pickFieldValues(
    entries,
    ['সর্বশেষ ডিগ্রি (last degree)', 'সর্বশেষ_ডিগ্রি_(last_degree)', 'last_degree', 'last degree', 'degree'],
    [/(?:degree|ডিগ্রি|qualification)/i],
  )[0] || '';

  const gpa = pickFieldValues(
    entries,
    ['রেজাল্ট (gpa)', 'রেজাল্ট_(gpa)', 'gpa', 'cgpa', 'result'],
    [/(?:\bgpa\b|\bcgpa\b|রেজাল্ট|result)/i],
  )[0] || '';

  const englishScore = pickFieldValues(
    entries,
    [
      'ইংলিশ স্কোর (ielts/duolingo/toefl) - optional',
      'ইংলিশ_স্কোর_(ielts/duolingo/toefl)_-_optional',
      'english_score', 'english score', 'ielts',
    ],
    [/(?:ielts|duolingo|toefl|english[_\s]?score|ইংলিশ)/i],
  )[0] || '';

  return { name, phone, whatsappPhone, email, lastDegree, gpa, englishScore };
}

/** Formats consistent summary notes for Meta Instant Form leads across CSV, webhook, and Graph sync. */
export function buildMetaInstantFormMessage(details: {
  formName?: string;
  campaignName?: string;
  adName?: string;
  leadId?: string;
  created?: string;
  lastDegree?: string;
  gpa?: string;
  englishScore?: string;
  whatsappPhone?: string;
  primaryPhone?: string;
}): string {
  const formLabel = details.formName?.trim() || 'WebLead&InstantForm_18_4_2026';
  const campaignLabel = details.campaignName?.trim() || 'META_Leads_BD_China-Mar2027_2026Q1';
  const distinctWhatsapp =
    details.whatsappPhone && details.whatsappPhone !== details.primaryPhone
      ? `WhatsApp: ${details.whatsappPhone}`
      : '';

  return [
    `Meta Instant Form (${formLabel})`,
    `Campaign: ${campaignLabel}`,
    details.adName?.trim() && `Ad: ${details.adName.trim()}`,
    details.lastDegree?.trim() && `Last Degree: ${details.lastDegree.trim()}`,
    details.gpa?.trim() && `GPA: ${details.gpa.trim()}`,
    details.englishScore?.trim() && `English Score: ${details.englishScore.trim()}`,
    distinctWhatsapp,
    details.leadId?.trim() && `Lead ID: ${details.leadId.trim()}`,
    details.created?.trim() && `Created: ${details.created.trim()}`,
  ]
    .filter(Boolean)
    .join(' | ');
}

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

/** Parses Meta CSV, Leads Center, and Graph API timestamps (unix seconds/ms, Dhaka AM/PM, or ISO) to UTC ISO strings. */
export function parseMetaLeadTimestamp(raw: string | number | undefined): string {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    return new Date(ms).toISOString();
  }
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) return new Date().toISOString();

  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isFinite(num) && num > 0) {
      return new Date(num < 1e12 ? num * 1000 : num).toISOString();
    }
  }

  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(trimmed);
  if (m) {
    let hour = Number.parseInt(m[4], 10);
    if (m[6].toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (m[6].toLowerCase() === 'am' && hour === 12) hour = 0;
    const isoDhaka = `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}T${String(hour).padStart(2, '0')}:${m[5]}:00+06:00`;
    const parsed = new Date(isoDhaka);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  const normalized = trimmed
    .replace(/([+-]\d{2})(\d{2})$/, '$1:$2')
    .replace(/(\d{1,2}:\d{2})(am|pm)\b/i, '$1 $2');
  const direct = new Date(normalized);
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

  const parsedRows: MetaLeadImportPayload[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line, delimiter);
    const rowMap: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      const key = headers[i];
      const val = (cols[i] ?? '').trim();
      if (key && val && !rowMap[key]) {
        rowMap[key] = val;
      }
    }

    const extracted = extractMetaFormFields(rowMap);
    const created = rowMap.created || rowMap.created_time || rowMap['created time'] || rowMap.date || '';
    const formName =
      rowMap.form || rowMap.form_name || rowMap['form name'] || 'WebLead&InstantForm_18_4_2026';
    const campaignName =
      rowMap.campaign_name || rowMap['campaign name'] || 'META_Leads_BD_China-Mar2027_2026Q1';
    const adName = rowMap.ad_name || rowMap['ad name'] || '';
    const leadId = rowMap.lead_id || rowMap['lead id'] || rowMap.id || '';

    const payload = buildMetaLeadPayload(extracted, {
      created,
      formName,
      campaignName,
      adName,
      leadId,
      includeCreatedText: true,
    });
    if (payload) {
      parsedRows.push(payload);
    }
  }

  return parsedRows.reverse();
}

export type MetaGraphLeadField = {
  name?: string;
  values?: string[];
};

export type MetaGraphLeadInput = {
  id?: string;
  created_time?: string | number;
  form_id?: string;
  form_name?: string;
  ad_name?: string;
  campaign_name?: string;
  field_data?: MetaGraphLeadField[];
};

function buildMetaLeadPayload(
  extracted: ExtractedMetaFormFields,
  meta: {
    created?: string | number;
    formName?: string;
    campaignName?: string;
    adName?: string;
    leadId?: string;
    includeCreatedText?: boolean;
  },
): MetaLeadImportPayload | null {
  const phone = extracted.phone;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return null;

  const email =
    extracted.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(extracted.email)
      ? extracted.email
      : `no-email+${digits}@leads.eduexpressint.com`;

  const createdStr = typeof meta.created === 'string' ? meta.created.trim() : '';

  return {
    name: (extracted.name || 'Student').slice(0, 120),
    email,
    phone,
    country: 'China',
    program: 'China March 2027 Intake',
    message: buildMetaInstantFormMessage({
      formName: meta.formName,
      campaignName: meta.campaignName,
      adName: meta.adName,
      leadId: meta.leadId,
      created: meta.includeCreatedText ? createdStr : undefined,
      lastDegree: extracted.lastDegree,
      gpa: extracted.gpa,
      englishScore: extracted.englishScore,
      whatsappPhone: extracted.whatsappPhone,
      primaryPhone: phone,
    }),
    status: 'new',
    source: 'meta_china_march_2027',
    leadType: 'assessment',
    assignedTeam: 'china',
    destinationInterest: 'china',
    landingPage: '/china-march-2027-intake',
    ...(extracted.lastDegree ? { assessAcademicLevel: extracted.lastDegree.slice(0, 120) } : {}),
    ...(extracted.gpa ? { assessAcademicResults: extracted.gpa.slice(0, 120) } : {}),
    ...(extracted.englishScore ? { assessLanguage: extracted.englishScore.slice(0, 120) } : {}),
    adTrackingConsent: true,
    consentTimestamp: parseMetaLeadTimestamp(meta.created),
    consentPolicyVersion: '2026-04-privacy-v1',
  };
}

/** Converts a Meta Graph API `field_data` lead object into a normalized MetaLeadImportPayload, or null if phone is invalid. */
export function mapMetaGraphLeadToImportPayload(
  lead: MetaGraphLeadInput,
  defaults?: { formName?: string; campaignName?: string; adName?: string },
): MetaLeadImportPayload | null {
  const fieldMap: Record<string, string> = {};
  if (Array.isArray(lead.field_data)) {
    for (const entry of lead.field_data) {
      const key = typeof entry?.name === 'string' ? entry.name.trim().toLowerCase() : '';
      const firstVal = Array.isArray(entry?.values)
        ? entry.values.find((v) => typeof v === 'string' && v.trim())
        : undefined;
      if (key && firstVal) {
        fieldMap[key] = firstVal.trim();
      }
    }
  }

  const extracted = extractMetaFormFields(fieldMap);
  const resolvedFormName =
    lead.form_name?.trim() ||
    defaults?.formName?.trim() ||
    (lead.form_id ? `Form ${lead.form_id}` : 'WebLead&InstantForm_18_4_2026');

  return buildMetaLeadPayload(extracted, {
    created: lead.created_time,
    formName: resolvedFormName,
    campaignName: lead.campaign_name?.trim() || defaults?.campaignName?.trim() || 'META_Leads_BD_China-Mar2027_2026Q1',
    adName: lead.ad_name?.trim() || defaults?.adName?.trim() || '',
    leadId: lead.id?.trim() || '',
  });
}

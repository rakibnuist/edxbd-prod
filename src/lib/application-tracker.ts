export interface ApplicationStageDef {
  key: string;
  label: string;
  shortLabel: string;
  order: number;
  bucket: 'docs' | 'submitted' | 'admitted' | 'visa' | 'flight' | 'withdrawn';
  tone: 'slate' | 'blue' | 'violet' | 'cyan' | 'amber' | 'emerald' | 'teal' | 'orange' | 'green' | 'indigo' | 'rose';
}

export const APPLICATION_TRACKER_STAGES: readonly ApplicationStageDef[] = [
  { key: 'documents',            label: 'Document Collection',       shortLabel: 'Documents',     order: 0,  bucket: 'docs',      tone: 'slate' },
  { key: 'ready',                label: 'Documents Ready',           shortLabel: 'Ready',         order: 1,  bucket: 'docs',      tone: 'blue' },
  { key: 'submitted',            label: 'Application Submitted',     shortLabel: 'Submitted',     order: 2,  bucket: 'submitted', tone: 'violet' },
  { key: 'interview',            label: 'University Interview',      shortLabel: 'Interview',     order: 3,  bucket: 'submitted', tone: 'indigo' },
  { key: 'pre_admission',        label: 'Pre-Admission Notice',      shortLabel: 'Pre-Admit',     order: 4,  bucket: 'submitted', tone: 'cyan' },
  { key: 'deposit',              label: 'University Deposit',        shortLabel: 'Deposit',       order: 5,  bucket: 'submitted', tone: 'amber' },
  { key: 'admitted',             label: 'Admission Notice & JW202',  shortLabel: 'Admitted',      order: 6,  bucket: 'admitted',  tone: 'emerald' },
  { key: 'jw202',                label: 'JW202 / DQ Issued',         shortLabel: 'JW202',         order: 7,  bucket: 'admitted',  tone: 'teal' },
  { key: 'visa_applied',         label: 'Visa Submitted',            shortLabel: 'Visa Sent',     order: 8,  bucket: 'visa',      tone: 'orange' },
  { key: 'visa_approved',        label: 'Visa Approved',             shortLabel: 'Visa Approved', order: 9,  bucket: 'visa',      tone: 'green' },
  { key: 'partial_payment',      label: 'Partial Payment',           shortLabel: 'Partial Pay',   order: 10, bucket: 'flight',    tone: 'amber' },
  { key: 'air_ticket',           label: 'Air Ticket Booked',         shortLabel: 'Air Ticket',    order: 11, bucket: 'flight',    tone: 'blue' },
  { key: 'complete_payment',     label: 'Complete Payment',          shortLabel: 'Full Paid',     order: 12, bucket: 'flight',    tone: 'emerald' },
  { key: 'pre_departure',        label: 'Pre-Departure Briefing',    shortLabel: 'Pre-Depart',    order: 13, bucket: 'flight',    tone: 'indigo' },
  { key: 'fly',                  label: 'Arrival & Enrolled (Fly)',  shortLabel: 'Flown / Enrolled', order: 14, bucket: 'flight', tone: 'green' },
  { key: 'documents_withdraw',   label: 'Documents Withdraw',        shortLabel: 'Docs Withdraw', order: 15, bucket: 'withdrawn', tone: 'rose' },
  { key: 'application_withdraw', label: 'Application Withdraw',      shortLabel: 'Withdrawn',     order: 16, bucket: 'withdrawn', tone: 'rose' },
] as const;

export const ALLOWED_TRACKER_STAGE_KEYS = new Set<string>([
  ...APPLICATION_TRACKER_STAGES.map((s) => s.key),
  'review',
  'visa',
  'enrolled',
]);

export const TRACKER_UNI_STATUSES = [
  { key: 'documents',           label: 'Documents',           tone: 'slate' },
  { key: 'ready',               label: 'Ready',               tone: 'blue' },
  { key: 'submitted',           label: 'Submitted',           tone: 'violet' },
  { key: 'pending',             label: 'Pending',             tone: 'slate' },
  { key: 'processing',          label: 'Processing',          tone: 'indigo' },
  { key: 'initial_review_pass', label: 'Initial Review Pass', tone: 'cyan' },
  { key: 'interview',           label: 'Interview',           tone: 'amber' },
  { key: 'pre_admission',       label: 'Pre-Admission',       tone: 'teal' },
  { key: 'admitted',            label: 'Admitted',            tone: 'emerald' },
  { key: 'returned',            label: 'Returned',            tone: 'orange' },
  { key: 'rejected',            label: 'Rejected',            tone: 'rose' },
] as const;

export const ALLOWED_TRACKER_UNI_STATUSES = new Set<string>(TRACKER_UNI_STATUSES.map((s) => s.key));

export const TRACKER_DOC_STATUSES = [
  { key: 'pending',      label: 'Pending' },
  { key: 'received',     label: 'Received' },
  { key: 'verified',     label: 'Verified' },
  { key: 'rejected',     label: 'Rejected' },
  { key: 'not_required', label: 'N/A' },
] as const;

export const EMBASSY_STATUSES = [
  'Pending',
  'Processing',
  'Submitted',
  'Done',
  'Rejected',
  'N/A',
] as const;

export const DEGREE_OPTIONS = [
  'Bachelor',
  'L+Bachelor',
  'Diploma',
  'L+Diploma',
  'Masters',
  'PhD',
  'Foundation',
  'Language',
  'MBBS',
] as const;

export const INTAKE_YEAR_OPTIONS = ['2027', '2026', '2028'] as const;

export const INTAKE_SESSION_OPTIONS = [
  { key: 'March', label: 'March / Spring' },
  { key: 'September', label: 'September / Fall' },
  { key: 'January', label: 'January / Winter' },
] as const;

export type IntakeSessionKey = 'March' | 'September' | 'January' | 'Other';

export function extractIntakeYear(term?: string | null): string {
  if (!term) return 'Unscheduled';
  const match = String(term).match(/\b(202\d)\b/);
  return match ? match[1] : 'Unscheduled';
}

export function extractIntakeSession(term?: string | null): IntakeSessionKey {
  if (!term) return 'Other';
  const s = String(term).toLowerCase();
  if (s.includes('mar') || s.includes('spring')) return 'March';
  if (s.includes('sep') || s.includes('fall') || s.includes('autumn')) return 'September';
  if (s.includes('jan') || s.includes('dec') || s.includes('winter')) return 'January';
  return 'Other';
}

export function composeIntakeTerm(session?: string | null, year?: string | null): string | null {
  const cleanSession = (session || '').trim();
  const cleanYear = (year || '').trim();
  if (!cleanSession && !cleanYear) return null;
  if (!cleanSession) return cleanYear;
  if (!cleanYear || cleanYear === 'Unscheduled') return cleanSession;
  return `${cleanSession} ${cleanYear}`;
}

export const DESTINATION_OPTIONS = [
  'China',
  'Malaysia',
  'United Kingdom',
  'Hungary',
  'South Korea',
  'Finland',
  'Malta',
  'Cyprus',
  'Georgia',
  'Greece',
  'Croatia',
  'Thailand',
] as const;

export const DOC_TEMPLATES_BY_COUNTRY: Record<string, readonly string[]> = {
  China: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'SSC Marksheet',
    'HSC Marksheet',
    'Passport-size Photo',
    'NID/Birth Certificate',
    'English Medium Certificate (MOI)',
    'CV',
    'Statement of Purpose',
    'Police Clearance',
    'Medical Check-up',
    'Bank Statement',
  ],
  Malta: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'Marksheets',
    'IELTS Score',
    'Passport-size Photo',
    'CV',
    'Statement of Purpose',
    'Bank Statement',
    'Accommodation Proof',
    'Sponsorship Letter',
  ],
  Hungary: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'Marksheets',
    'IELTS Score',
    'Passport-size Photo',
    'CV',
    'Statement of Purpose',
    'Recommendation Letters',
    'Bank Statement',
    'Health Insurance',
  ],
  Malaysia: [
    'Passport',
    'SSC Certificate',
    'HSC Certificate',
    'Marksheets',
    'Passport-size Photo',
    'Medical Declaration',
    'IELTS / MOI',
    'CV',
  ],
};

export const DEFAULT_TRACKER_DOCS: readonly string[] = [
  'Passport',
  'SSC Certificate',
  'HSC Certificate',
  'Marksheets',
  'Passport-size Photo',
  'CV',
  'Statement of Purpose',
  'Bank Statement',
];

export function getDocsTemplateForDestination(country?: string | null): readonly string[] {
  if (!country) return DOC_TEMPLATES_BY_COUNTRY.China;
  const key = Object.keys(DOC_TEMPLATES_BY_COUNTRY).find(
    (k) => k.toLowerCase() === country.trim().toLowerCase(),
  );
  return key ? DOC_TEMPLATES_BY_COUNTRY[key] : DEFAULT_TRACKER_DOCS;
}

export function normalizeTrackerStage(raw?: string | null): string {
  const key = (raw || '').trim().toLowerCase();
  if (!key) return 'documents';
  if (key === 'enrolled') return 'fly';
  if (key === 'visa') return 'visa_approved';
  if (key === 'review') return 'submitted';
  if (ALLOWED_TRACKER_STAGE_KEYS.has(key)) return key;
  return 'documents';
}

export function getStageDef(stageKey?: string | null): ApplicationStageDef {
  const normalized = normalizeTrackerStage(stageKey);
  return (
    APPLICATION_TRACKER_STAGES.find((s) => s.key === normalized) ||
    APPLICATION_TRACKER_STAGES[0]
  );
}

export function getStageBucket(stageKey?: string | null): ApplicationStageDef['bucket'] {
  return getStageDef(stageKey).bucket;
}

export function getIntakeSortValue(term?: string | null): number {
  if (!term) return 0;
  const match = String(term).match(
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Spring|Fall|Autumn|Winter)?\s*(\d{4})/i,
  );
  if (!match) return 0;
  const monthMap: Record<string, number> = {
    january: 1, jan: 1, february: 2, feb: 2, spring: 3, march: 3, mar: 3,
    april: 4, apr: 4, may: 5, june: 6, jun: 6, july: 7, jul: 7,
    august: 8, aug: 8, fall: 9, autumn: 9, september: 9, sep: 9,
    october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12, winter: 12,
  };
  const mStr = (match[1] || '').toLowerCase();
  const month = monthMap[mStr] || 6;
  const year = Number.parseInt(match[2], 10);
  return year * 100 + month;
}

export function isIsoDateString(raw: unknown): raw is string {
  if (typeof raw !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) return false;
  const d = new Date(`${raw.trim()}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === raw.trim();
}

function cleanStr(val: unknown, maxLen: number): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  return s ? s.slice(0, maxLen) : null;
}

export function validateSafeDriveOrLink(raw: unknown): string | null | { error: string } {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  if (trimmed.length > 1000) return { error: 'Drive link is too long.' };
  // Allow either valid http(s) URL or a legacy folder label (no javascript:/data: schemes)
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { error: 'Invalid URL protocol in Drive link.' };
  }
  return trimmed;
}

export function deriveLeadStatusFromStage(stage: string, currentStatus?: string): string {
  const normalized = normalizeTrackerStage(stage);
  switch (normalized) {
    case 'fly':
    case 'enrolled':
      return 'enrolled';
    case 'visa_approved':
    case 'partial_payment':
    case 'air_ticket':
    case 'complete_payment':
    case 'pre_departure':
      return 'visa_approved';
    case 'visa_applied':
      return 'visa_applied';
    case 'admitted':
    case 'jw202':
      return 'admission_received';
    case 'submitted':
    case 'interview':
    case 'pre_admission':
    case 'deposit':
      return 'application_submitted';
    case 'documents_withdraw':
    case 'application_withdraw':
      return 'closed';
    case 'documents':
    case 'ready':
      return 'application_started';
    default:
      return currentStatus && !['new', 'closed', 'no_response', 'not_interested'].includes(currentStatus)
        ? currentStatus
        : 'application_started';
  }
}

export function generateNextLeadRef(existingRefs: Array<string | null>): string {
  let maxNum = 445;
  for (const ref of existingRefs) {
    if (!ref) continue;
    const m = ref.match(/(?:LEAD|APP)-(\d+)/i);
    if (m) {
      const n = Number.parseInt(m[1], 10);
      if (Number.isFinite(n) && n > maxNum) maxNum = n;
    }
  }
  return `APP-${String(maxNum + 1).padStart(4, '0')}`;
}

export function validateApplicationPatchPayload(body: Record<string, unknown>): {
  data?: Record<string, unknown>;
  error?: string;
} {
  const data: Record<string, unknown> = {};

  if ('name' in body) {
    const v = cleanStr(body.name, 140);
    if (!v) return { error: 'Student name cannot be empty.' };
    data.name = v;
  }
  if ('phone' in body) {
    const v = cleanStr(body.phone, 40);
    if (v) data.phone = v;
  }
  if ('email' in body) {
    const v = cleanStr(body.email, 200);
    if (v) data.email = v.toLowerCase();
  }
  if ('country' in body) {
    const v = cleanStr(body.country, 80);
    if (v) {
      data.country = v;
      data.destinationInterest = v.toLowerCase();
    }
  }
  if ('leadRef' in body) data.leadRef = cleanStr(body.leadRef, 60);
  if ('leadMarket' in body) {
    const m = cleanStr(body.leadMarket, 40);
    if (m && ['Bangladesh', 'China'].includes(m)) data.leadMarket = m;
  }
  if ('channelType' in body) {
    const c = cleanStr(body.channelType, 20);
    if (c && ['B2C', 'B2B'].includes(c.toUpperCase())) data.channelType = c.toUpperCase();
  }
  if ('source' in body) {
    const s = cleanStr(body.source, 80);
    if (s) data.source = s;
  }
  if ('referrer' in body) data.referrer = cleanStr(body.referrer, 120);
  if ('nationality' in body) data.nationality = cleanStr(body.nationality, 80);
  if ('passport' in body) data.passport = cleanStr(body.passport, 40);
  if ('assessIntake' in body) data.assessIntake = cleanStr(body.assessIntake, 80);
  if ('degree' in body) data.degree = cleanStr(body.degree, 80);
  if ('program' in body) {
    const p = cleanStr(body.program, 160);
    data.program = p;
    data.assessSubject = p;
  }
  if ('university' in body) data.university = cleanStr(body.university, 180);
  if ('assessAcademicLevel' in body) data.assessAcademicLevel = cleanStr(body.assessAcademicLevel, 100);
  if ('assessAcademicResults' in body) data.assessAcademicResults = cleanStr(body.assessAcademicResults, 80);
  if ('assessLanguage' in body) data.assessLanguage = cleanStr(body.assessLanguage, 80);
  if ('applicationNotes' in body) data.applicationNotes = cleanStr(body.applicationNotes, 4000);
  if ('notes' in body) data.notes = cleanStr(body.notes, 4000);
  if ('bloodGroup' in body) data.bloodGroup = cleanStr(body.bloodGroup, 12);
  if ('emergencyContact' in body) data.emergencyContact = cleanStr(body.emergencyContact, 200);
  if ('medicalNotes' in body) data.medicalNotes = cleanStr(body.medicalNotes, 1000);
  if ('hardcopyStatus' in body) data.hardcopyStatus = cleanStr(body.hardcopyStatus, 40);
  if ('embassyStatus' in body) data.embassyStatus = cleanStr(body.embassyStatus, 40);
  if ('assignedTo' in body) data.assignedTo = cleanStr(body.assignedTo, 120);
  if ('assignedEmployeeId' in body) data.assignedEmployeeId = cleanStr(body.assignedEmployeeId, 60);
  if ('publicEnabled' in body && typeof body.publicEnabled === 'boolean') {
    data.publicEnabled = body.publicEnabled;
  }
  if ('isApplication' in body && typeof body.isApplication === 'boolean') {
    data.isApplication = body.isApplication;
  }

  if ('applicationStage' in body) {
    const rawStage = String(body.applicationStage || '').trim().toLowerCase();
    if (!ALLOWED_TRACKER_STAGE_KEYS.has(rawStage)) {
      return { error: `Unknown application stage "${rawStage}".` };
    }
    data.applicationStage = rawStage;
  }

  for (const dateField of ['visaDeadline', 'departureDate', 'dateOfBirth', 'embassyDate'] as const) {
    if (dateField in body) {
      const raw = body[dateField];
      if (raw === null || raw === '') {
        data[dateField] = null;
      } else if (isIsoDateString(raw)) {
        data[dateField] = raw.trim();
      } else {
        return { error: `${dateField} must be YYYY-MM-DD.` };
      }
    }
  }

  if ('nextFollowup' in body) {
    const raw = body.nextFollowup;
    if (raw === null || raw === '') {
      data.nextFollowup = null;
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim().replace(' ', 'T');
      if (/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/.test(trimmed)) {
        data.nextFollowup = trimmed.slice(0, 16);
      } else {
        return { error: 'nextFollowup must be YYYY-MM-DD or YYYY-MM-DDTHH:mm.' };
      }
    } else {
      return { error: 'nextFollowup must be text.' };
    }
  }

  for (const numField of ['serviceFee', 'paidAmount', 'deposit'] as const) {
    if (numField in body) {
      const raw = body[numField];
      if (raw === null || raw === '') {
        data[numField] = 0;
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0 || n > 100_000_000) {
          return { error: `${numField} must be a valid non-negative number.` };
        }
        data[numField] = n;
      }
    }
  }

  if ('gpa' in body) {
    const raw = body.gpa;
    if (raw === null || raw === '') {
      data.gpa = null;
    } else {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0 || n > 5.5) {
        return { error: 'GPA must be between 0 and 5.5.' };
      }
      data.gpa = Number(n.toFixed(2));
    }
  }

  if ('driveLink' in body) {
    const checked = validateSafeDriveOrLink(body.driveLink);
    if (checked && typeof checked === 'object' && 'error' in checked) {
      return { error: checked.error };
    }
    data.driveLink = checked;
  }

  return { data };
}

export interface ApplicationRowDto {
  id: string;
  legacyCrmId: number | null;
  leadRef: string | null;
  name: string;
  email: string;
  phone: string;
  country: string;
  leadMarket: string;
  channelType: string;
  source: string;
  referrer: string | null;
  nationality: string | null;
  passport: string | null;
  assessIntake: string | null;
  degree: string | null;
  program: string | null;
  university: string | null;
  gpa: number | null;
  assessAcademicLevel: string | null;
  assessAcademicResults: string | null;
  assessLanguage: string | null;
  status: string;
  applicationStage: string;
  embassyStatus: string | null;
  embassyDate: string | null;
  hardcopyStatus: string | null;
  visaDeadline: string | null;
  departureDate: string | null;
  nextFollowup: string | null;
  driveLink: string | null;
  serviceFee: number;
  paidAmount: number;
  deposit: number;
  applicationNotes: string | null;
  notes: string | null;
  bloodGroup: string | null;
  dateOfBirth: string | null;
  emergencyContact: string | null;
  medicalNotes: string | null;
  publicToken: string | null;
  publicEnabled: boolean;
  assignedTo: string | null;
  assignedEmployeeId: string | null;
  employeeName: string | null;
  docsTotal: number;
  docsReceived: number;
  uniTotal: number;
  uniAdmitted: number;
  uniList: string;
  financeReceivedTotal: number | null;
  financeSpentTotal: number | null;
  createdAt: string;
  updatedAt: string;
}

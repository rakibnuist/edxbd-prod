import { toSafeExternalUrl } from './safe-url';

export const B2B_PRIVACY_POLICY_VERSION = '2026-07-19';

export type B2BServiceTrackId =
  | 'b2b_china_desk'
  | 'b2b_malaysia_desk'
  | 'b2b_multi_destination'
  | 'b2b_institutional';

export type B2BOrganizationType =
  | 'consultancy'
  | 'sub_agent'
  | 'institution'
  | 'referral';

export type B2BServiceTrack = {
  id: B2BServiceTrackId;
  number: string;
  title: string;
  audience: string;
  turnaround: string;
  summary: string;
  deliverables: string[];
  commercialModel: string;
  featured?: boolean;
};

export const B2B_SERVICE_TRACKS: readonly B2BServiceTrack[] = [
  {
    id: 'b2b_china_desk',
    number: '01',
    title: 'China Admissions & Scholarship Desk',
    audience: 'Education agencies & sub-agents',
    turnaround: '24–48h file audit',
    featured: true,
    summary:
      'Dedicated B2B file preparation and submission support across verified Chinese universities — covering Foundation, Bachelor’s, Master’s, PhD, MBBS (BMDC-checked), and Chinese Language routes.',
    deliverables: [
      'Eligibility, CSCA requirement & recognition pre-check',
      'CSC, Provincial & University scholarship pathway matching',
      'Timestamped portal submission ID & offer tracking',
      'JW201 / JW202 follow-up & X1/X2 visa document audit',
    ],
    commercialModel: 'Bilateral MOU · Milestone-linked terms confirmed in writing',
  },
  {
    id: 'b2b_malaysia_desk',
    number: '02',
    title: 'Malaysia EMGS & Campus Processing',
    audience: 'Regional agencies & counsellors',
    turnaround: '24–48h file audit',
    summary:
      'Co-placement processing across Malaysian public universities, private universities, and UK/Australian branch campuses with EMGS and Student File readiness documentation.',
    deliverables: [
      'MQA programme recognition & entry verification',
      'Offer follow-up & EMGS / eVAL dossier preparation',
      'MYR & BDT itemised third-party fee separation',
      'Bangladesh Bank Student File & SEV document guidance',
    ],
    commercialModel: 'Bilateral MOU · Commission & settlement terms confirmed in writing',
  },
  {
    id: 'b2b_multi_destination',
    number: '03',
    title: 'Multi-Destination Co-Placement Desk',
    audience: 'Consultancies expanding destination coverage',
    turnaround: '2 working days audit',
    summary:
      'Structured partner support for UK, Hungary, South Korea, Finland, and six active European/Asian routes — using country-specific entry, bank solvency, and visa rules.',
    deliverables: [
      'Country-specific academic & IELTS/SAT/TOPIK screening',
      '28-day / Migri / D-2 solvency & apostille checklists',
      'ClearCost™ breakdown separating official vs agency charges',
      'Named country desk coordinator for escalation',
    ],
    commercialModel: 'Bilateral MOU · Destination-specific written annex',
  },
  {
    id: 'b2b_institutional',
    number: '04',
    title: 'Institutional, School & University Desk',
    audience: 'Universities, Bangladeshi colleges & training centres',
    turnaround: '1–2 working days response',
    summary:
      'Direct cooperation with international university admissions offices for Bangladesh outreach, plus evidence-first guidance seminars for HSC students, parents, and institutions.',
    deliverables: [
      'Verified institution & tuition schedule updates in directory',
      'Documented recruitment representation (written authorisation required)',
      'Joint campus & parent awareness sessions in Dhaka and nationwide',
      'Direct media & academic benchmark data coordination',
    ],
    commercialModel: 'Institutional Agreement · Written authorisation on file',
  },
] as const;

export const B2B_ORGANIZATION_TYPES: readonly {
  value: B2BOrganizationType;
  label: string;
  businessType: 'consultancy' | 'individual' | 'institution' | 'other';
  description: string;
}[] = [
  {
    value: 'consultancy',
    label: 'Education Consultancy / Agency',
    businessType: 'consultancy',
    description: 'Registered study-abroad agency or regional office placing multiple students',
  },
  {
    value: 'sub_agent',
    label: 'Sub-Agent / Independent Advisor',
    businessType: 'individual',
    description: 'Independent counsellor or freelance admissions advisor referring files',
  },
  {
    value: 'institution',
    label: 'University / College / Institute',
    businessType: 'institution',
    description: 'International admissions office, local college, or language/test-prep centre',
  },
  {
    value: 'referral',
    label: 'Corporate / Referral Partner',
    businessType: 'other',
    description: 'Education network, alumni group, or verified student referral desk',
  },
] as const;

export const B2B_DESTINATION_OPTIONS = [
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

export const B2B_MONTHLY_VOLUMES = [
  { value: '1-3', label: '1–3 student files / month', numericTarget: 2 },
  { value: '4-10', label: '4–10 student files / month', numericTarget: 7 },
  { value: '11-25', label: '11–25 student files / month', numericTarget: 18 },
  { value: '25+', label: '25+ student files / month', numericTarget: 30 },
] as const;

export const B2B_SLAS = [
  { metric: '1–2 working days', label: 'Partner vetting & scope call', detail: 'Every B2B inquiry is reviewed by our partner desk in Dhanmondi.' },
  { metric: '24–48 hours', label: 'Student file eligibility audit', detail: 'Recognition, GPA, language, and gap checks before portal submission.' },
  { metric: '100% written', label: 'Non-poaching & file attribution', detail: 'Submitted students remain attributed exclusively to your agency.' },
  { metric: 'Custom MOU', label: 'Bilateral commercial schedule', detail: 'Commission, processing fees & payout triggers agreed before start.' },
] as const;

export const B2B_SOP_STAGES = [
  {
    step: '01',
    title: 'Partner vetting & scope call',
    detail: 'Submit your agency or institutional profile. Our B2B coordinator reviews your target destinations, student volume, and compliance expectations within 1–2 working days.',
  },
  {
    step: '02',
    title: 'Written MOU & commercial schedule',
    detail: 'Before the first application moves, we confirm destination scope, per-file processing or commission terms, payout triggers, refund conditions, and non-poaching clauses in a signed schedule.',
  },
  {
    step: '03',
    title: '6-point file audit (24–48h)',
    detail: 'Each student file you send is checked against the Better Education Standard: institutional recognition, academic/language fit, gap history, and an itemised ClearCost™ sheet.',
  },
  {
    step: '04',
    title: 'Timestamped portal & offer tracking',
    detail: 'You receive submission references, university portal screenshots or confirmation IDs, official offer letters, and JW202 / eVAL updates so nothing depends on verbal assurances.',
  },
  {
    step: '05',
    title: 'Visa readiness & commercial settlement',
    detail: 'We complete the embassy or EMGS document checklist review with your desk and settle partner invoices or commissions strictly on the milestone defined in your signed MOU.',
  },
] as const;

export const B2B_PROTECTIONS = [
  {
    title: 'Strict Non-Poaching & Attribution',
    description:
      'Every student profile remains logged under your agency ID. EduExpress never contacts a partner’s student independently or reassigns leads without written partner consent.',
  },
  {
    title: 'Separated Official vs Service Receipts',
    description:
      'University application fees, tuition deposits, EMGS charges, and embassy fees are always kept separate from consultancy charges, with recipient and refund status stated in writing.',
  },
  {
    title: 'Sensitive Document Confidentiality',
    description:
      'Passports, academic transcripts, bank statements, and visa pages are restricted to assigned processing staff and are never published in case studies or public channels.',
  },
  {
    title: 'Honest Outcome Boundaries',
    description:
      'No consultancy controls an admission, scholarship, or visa decision. EduExpress provides documented eligibility audits and readiness checks while official outcomes belong solely to universities, scholarship bodies, and embassies.',
  },
] as const;

export const B2B_FAQS: { question: string; answer: string }[] = [
  {
    question: 'Why are B2B commission rates and partner fees not listed in a public table on this page?',
    answer:
      'Commercial terms vary by service track (full-file processing vs co-placement vs institutional cooperation), destination, scholarship tier, and monthly student volume. Rather than publishing generic rates that change by university, EduExpress issues a custom written commercial schedule and MOU for each vetted partner before any student file is submitted.',
  },
  {
    question: 'How does EduExpress protect our students and agency brand from poaching?',
    answer:
      'Our bilateral MOU includes an explicit non-poaching and partner-attribution clause. All file communications, portal updates, and fee schedules flow through your designated agency coordinator unless you provide written authorization for direct student briefing.',
  },
  {
    question: 'Which destinations are open for B2B sub-agent and agency processing?',
    answer:
      'China is our flagship high-volume B2B desk (covering CSC, provincial, university scholarships, MBBS, Bachelor’s, Master’s, PhD, and Language programmes), alongside active B2B processing for Malaysia (public, private, and branch campuses with EMGS/eVAL guidance) and our 10 active destinations including the UK, Hungary, South Korea, and Finland.',
  },
  {
    question: 'What is the turnaround time for assessing a B2B student file?',
    answer:
      'Once your agency is onboarded, new student dossiers receive an initial eligibility, recognition, and missing-document audit within 24–48 business hours, along with a written cost schedule separating university and third-party charges.',
  },
  {
    question: 'When are partner commissions or processing charges settled?',
    answer:
      'Settlement milestones, currency, refund conditions, and required invoice/receipt proof are locked into your signed commercial annex before intake starts—such as university tuition settlement, visa approval, or post-enrolment verification depending on the university and route.',
  },
  {
    question: 'Do you accept independent sub-agents outside Dhaka or outside Bangladesh?',
    answer:
      'Yes. We work with independent education advisors, regional offices across Bangladesh (Chattogram, Sylhet, Rajshahi, Khulna, Cumilla, and beyond), and international partner consultancies after basic identity and compliance vetting.',
  },
];

export const PARTNERSHIP_TYPE_LABELS: Record<string, string> = {
  b2b_china_desk: 'B2B · China Admissions Desk',
  b2b_malaysia_desk: 'B2B · Malaysia EMGS Desk',
  b2b_multi_destination: 'B2B · Multi-Destination Desk',
  b2b_institutional: 'B2B · Institutional / School',
  b2b_agency_desk: 'B2B · Agency Desk',
  b2b_sub_agent: 'B2B · Sub-Agent',
  b2b_referral: 'B2B · Referral Partner',
  individual_agent: 'Individual Agent',
  company: 'Company',
};

export function formatPartnershipTypeLabel(value?: string | null): string {
  if (!value) return 'Partner Inquiry';
  return PARTNERSHIP_TYPE_LABELS[value] ?? value.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function normalizeB2BPhone(raw: unknown): { phone?: string; error?: string } {
  if (typeof raw !== 'string') return { error: 'Phone / WhatsApp number is required.' };
  let ascii = '';
  for (const ch of raw) {
    const bn = BENGALI_DIGITS.indexOf(ch);
    if (bn !== -1) { ascii += String(bn); continue; }
    const ar = ARABIC_INDIC_DIGITS.indexOf(ch);
    if (ar !== -1) { ascii += String(ar); continue; }
    ascii += ch;
  }
  const cleaned = ascii.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '').trim();
  if (!cleaned || cleaned.length > 40) return { error: 'Enter a valid phone or WhatsApp number.' };

  const hasPlus = cleaned.startsWith('+');
  let digits = cleaned.replace(/\D/g, '');
  if (digits.startsWith('00880') && digits.length >= 15) digits = digits.slice(2);
  if (/^88001\d{9}$/.test(digits)) digits = `880${digits.slice(4)}`;
  else if (!hasPlus && /^01\d{9}$/.test(digits)) return { phone: `+880${digits.slice(1)}` };
  else if (!hasPlus && /^1[3-9]\d{8}$/.test(digits)) return { phone: `+880${digits}` };

  if (digits.length < 7 || digits.length > 15) {
    return { error: 'Enter a valid phone number including country code (7–15 digits).' };
  }
  return { phone: `+${digits}` };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface NormalizedB2BInquiry {
  isHoneypot: boolean;
  companyName: string;
  businessType: 'consultancy' | 'individual' | 'institution' | 'other';
  businessRegistrationNumber?: string;
  website?: string;
  yearsInBusiness: number;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  partnershipType: B2BServiceTrackId;
  targetCountries: string[];
  currentClients: number;
  monthlyTarget: number;
  experience: string;
  expectedCommission: string;
  localNetwork: string;
  motivation: string;
  expectations: string;
  additionalInfo?: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  consentTimestamp: Date;
  consentPolicyVersion: string;
  trackingConsent: boolean;
}

const VALID_TRACK_IDS = new Set<B2BServiceTrackId>(B2B_SERVICE_TRACKS.map((t) => t.id));
const ORG_TYPE_MAP = new Map(B2B_ORGANIZATION_TYPES.map((o) => [o.value, o]));
const VOLUME_MAP = new Map<string, (typeof B2B_MONTHLY_VOLUMES)[number]>(
  B2B_MONTHLY_VOLUMES.map((v) => [v.value, v]),
);

function readTrimmed(obj: Record<string, unknown>, key: string, maxLen: number): { value?: string; error?: string } {
  const raw = obj[key];
  if (raw === undefined || raw === null) return {};
  if (typeof raw !== 'string') return { error: `${key} must be text.` };
  const trimmed = raw.trim();
  if (!trimmed) return {};
  if (trimmed.length > maxLen) return { error: `${key} is too long (max ${maxLen} characters).` };
  return { value: trimmed };
}

export function validateB2BInquiryInput(raw: unknown): {
  isHoneypot?: boolean;
  data?: NormalizedB2BInquiry;
  error?: string;
} {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'B2B inquiry payload must be a JSON object.' };
  }
  const body = raw as Record<string, unknown>;

  const honeypot = readTrimmed(body, 'companyWebsite', 200);
  if (honeypot.value) {
    return { isHoneypot: true };
  }

  const orgRaw = readTrimmed(body, 'organizationType', 40);
  const orgSpec = orgRaw.value ? ORG_TYPE_MAP.get(orgRaw.value as B2BOrganizationType) : ORG_TYPE_MAP.get('consultancy');
  if (!orgSpec) {
    return { error: 'Invalid organizationType.' };
  }

  const trackRaw = readTrimmed(body, 'serviceTrack', 60);
  const serviceTrack: B2BServiceTrackId =
    trackRaw.value && VALID_TRACK_IDS.has(trackRaw.value as B2BServiceTrackId)
      ? (trackRaw.value as B2BServiceTrackId)
      : 'b2b_china_desk';
  if (trackRaw.value && !VALID_TRACK_IDS.has(trackRaw.value as B2BServiceTrackId)) {
    return { error: 'Invalid serviceTrack.' };
  }

  const contactRes = readTrimmed(body, 'contactPerson', 120);
  if (contactRes.error || !contactRes.value || contactRes.value.length < 2) {
    return { error: contactRes.error || 'Contact person name (at least 2 characters) is required.' };
  }

  const companyRes = readTrimmed(body, 'companyName', 200);
  if (companyRes.error) return { error: companyRes.error };
  if ((orgSpec.value === 'consultancy' || orgSpec.value === 'institution') && (!companyRes.value || companyRes.value.length < 2)) {
    return { error: 'Organization or agency name is required for consultancies and institutions.' };
  }
  const companyName = companyRes.value || `${contactRes.value} (${orgSpec.label})`;

  const emailRes = readTrimmed(body, 'email', 254);
  if (emailRes.error || !emailRes.value) {
    return { error: emailRes.error || 'Work email is required.' };
  }
  const email = emailRes.value.toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Please enter a valid work email address.' };
  }

  const phoneRes = normalizeB2BPhone(body.phone);
  if (phoneRes.error || !phoneRes.phone) {
    return { error: phoneRes.error || 'Valid phone / WhatsApp number is required.' };
  }

  const cityRes = readTrimmed(body, 'city', 100);
  if (cityRes.error || !cityRes.value || cityRes.value.length < 2) {
    return { error: cityRes.error || 'City is required.' };
  }

  const countryRes = readTrimmed(body, 'country', 100);
  if (countryRes.error || !countryRes.value || countryRes.value.length < 2) {
    return { error: countryRes.error || 'Country is required.' };
  }

  const websiteRaw = readTrimmed(body, 'website', 500);
  if (websiteRaw.error) return { error: websiteRaw.error };
  let safeWebsite: string | undefined;
  if (websiteRaw.value) {
    const parsedUrl = toSafeExternalUrl(websiteRaw.value, 500);
    if (!parsedUrl) {
      return { error: 'Website must be a valid http:// or https:// URL.' };
    }
    safeWebsite = parsedUrl;
  }

  const regRes = readTrimmed(body, 'businessRegistrationNumber', 100);
  if (regRes.error) return { error: regRes.error };

  let targetCountries: string[] = ['China'];
  if (body.targetCountries !== undefined && body.targetCountries !== null && body.targetCountries !== '') {
    if (typeof body.targetCountries === 'string') {
      const trimmed = body.targetCountries.trim();
      if (trimmed.length > 100) return { error: 'targetCountries is too long.' };
      if (trimmed) targetCountries = [trimmed];
    } else if (Array.isArray(body.targetCountries)) {
      if (body.targetCountries.length > 15) return { error: 'targetCountries has too many items.' };
      const cleaned: string[] = [];
      for (const entry of body.targetCountries) {
        if (typeof entry !== 'string') return { error: 'targetCountries items must be text.' };
        const t = entry.trim();
        if (!t) continue;
        if (t.length > 100) return { error: 'targetCountries item is too long.' };
        cleaned.push(t);
      }
      if (cleaned.length > 0) targetCountries = cleaned;
    } else {
      return { error: 'targetCountries must be a list of text items.' };
    }
  }

  let monthlyTarget = 2;
  let monthlyLabel = '1–3 student files / month';
  if (typeof body.monthlyVolume === 'string' && body.monthlyVolume.trim()) {
    const vol = VOLUME_MAP.get(body.monthlyVolume.trim());
    if (!vol) return { error: 'Invalid monthlyVolume selection.' };
    monthlyTarget = vol.numericTarget;
    monthlyLabel = vol.label;
  } else if (typeof body.monthlyTarget === 'number' && Number.isFinite(body.monthlyTarget) && body.monthlyTarget >= 0) {
    monthlyTarget = Math.min(Math.floor(body.monthlyTarget), 10000);
    monthlyLabel = `${monthlyTarget} student files / month`;
  }

  let yearsInBusiness = 1;
  if (body.yearsInBusiness !== undefined && body.yearsInBusiness !== null && body.yearsInBusiness !== '') {
    const parsedYears = Number.parseInt(String(body.yearsInBusiness), 10);
    if (!Number.isFinite(parsedYears) || parsedYears < 0 || parsedYears > 120) {
      return { error: 'Years in business must be a whole number between 0 and 120.' };
    }
    yearsInBusiness = parsedYears;
  }

  const motivationRes = readTrimmed(body, 'motivation', 4000);
  if (motivationRes.error || !motivationRes.value || motivationRes.value.length < 20) {
    return { error: motivationRes.error || 'Please share at least 20 characters about your students or B2B goals.' };
  }

  const expectationsRes = readTrimmed(body, 'expectations', 2000);
  if (expectationsRes.error) return { error: expectationsRes.error };

  const additionalRes = readTrimmed(body, 'additionalInfo', 2000);
  if (additionalRes.error) return { error: additionalRes.error };

  if (body.consent !== true) {
    return { error: 'Privacy policy consent is required before submitting.' };
  }

  const consentPolicyRes = readTrimmed(body, 'consentPolicyVersion', 100);
  const consentPolicyVersion = consentPolicyRes.value || B2B_PRIVACY_POLICY_VERSION;

  let consentTimestamp = new Date();
  if (typeof body.consentTimestamp === 'string' && body.consentTimestamp.trim()) {
    const parsedDate = new Date(body.consentTimestamp);
    if (Number.isNaN(parsedDate.getTime())) {
      return { error: 'consentTimestamp must be a valid ISO date.' };
    }
    consentTimestamp = parsedDate;
  }

  const sourceRes = readTrimmed(body, 'source', 100);
  const trackInfo = B2B_SERVICE_TRACKS.find((t) => t.id === serviceTrack)!;

  const priority: 'low' | 'medium' | 'high' =
    monthlyTarget >= 11 || orgSpec.value === 'institution' || yearsInBusiness >= 3
      ? 'high'
      : monthlyTarget >= 4 || orgSpec.value === 'consultancy'
        ? 'medium'
        : 'low';

  return {
    data: {
      isHoneypot: false,
      companyName,
      businessType: orgSpec.businessType,
      businessRegistrationNumber: regRes.value,
      website: safeWebsite,
      yearsInBusiness,
      contactPerson: contactRes.value,
      email,
      phone: phoneRes.phone,
      address: `${cityRes.value}, ${countryRes.value}`,
      city: cityRes.value,
      state: countryRes.value,
      country: countryRes.value,
      postalCode: '00000',
      partnershipType: serviceTrack,
      targetCountries,
      currentClients: 0,
      monthlyTarget,
      experience: `${trackInfo.title} · Expected volume: ${monthlyLabel} · Org: ${orgSpec.label}`,
      expectedCommission: 'Custom MOU / Written Schedule',
      localNetwork: `${cityRes.value}, ${countryRes.value} (${orgSpec.label})`,
      motivation: motivationRes.value,
      expectations: expectationsRes.value || 'Written bilateral MOU, SOP turnaround SLA, and custom commercial schedule after vetting.',
      additionalInfo: additionalRes.value,
      priority,
      source: sourceRes.value || 'b2b_page',
      consentTimestamp,
      consentPolicyVersion,
      trackingConsent: body.trackingConsent === true,
    },
  };
}

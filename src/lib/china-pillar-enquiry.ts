import { isMetaMarchCampaignAttribution, normalizeMarchPhoneInput } from './march-campaign-enquiry';

export const chinaStudyRoutes = [
  'Bachelor’s Degree',
  'Foundation → Bachelor',
  'MBBS in China',
  'Master’s Degree',
  'PhD',
  'Chinese Language',
  'Scholarship Assessment',
  'Help me choose a route',
] as const;

export const chinaAcademicLevels = [
  'SSC / O Level completed',
  'HSC / A Level in progress',
  'HSC / A Level completed',
  'Diploma in progress / completed',
  'Bachelor’s in progress / completed',
  'Master’s completed',
] as const;

export const chinaTargetIntakes = [
  'March 2027 (Spring)',
  'September 2027 (Main)',
  'Any next open intake',
] as const;

export type ChinaEnquiryFields = {
  academicLevel: string;
  result: string;
  route: string;
  intake: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

export type ChinaEnquiryErrors = Partial<Record<keyof ChinaEnquiryFields, string>>;

export const emptyChinaEnquiry: ChinaEnquiryFields = {
  academicLevel: '',
  result: '',
  route: '',
  intake: 'September 2027 (Main)',
  name: '',
  phone: '',
  email: '',
  consent: false,
};

export function validateChinaEnquiry(fields: ChinaEnquiryFields): ChinaEnquiryErrors {
  const errors: ChinaEnquiryErrors = {};
  if (!chinaAcademicLevels.includes(fields.academicLevel as (typeof chinaAcademicLevels)[number])) {
    errors.academicLevel = 'Select your current academic qualification.';
  }
  if (fields.result.trim().length < 1) {
    errors.result = 'Enter your latest GPA / CGPA, e.g. HSC GPA 4.50.';
  }
  if (!chinaStudyRoutes.includes(fields.route as (typeof chinaStudyRoutes)[number])) {
    errors.route = 'Choose a study route, or select Help me choose.';
  }
  if (fields.name.trim().length < 2) {
    errors.name = 'Enter your full name.';
  }
  const cleanPhone = normalizeMarchPhoneInput(fields.phone);
  const digits = cleanPhone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(cleanPhone) || digits.length < 10 || digits.length > 15) {
    errors.phone = 'Enter a valid WhatsApp or phone number (e.g. 01XXXXXXXXX).';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address, e.g. name@example.com.';
  }
  if (!fields.consent) {
    errors.consent = 'Please confirm we may contact you about your China study plan.';
  }
  return errors;
}

export function chinaPillarEnquiryPayload(
  fields: ChinaEnquiryFields,
  context: {
    university?: string;
    program?: string;
    consentTimestamp: string;
    utm: Record<string, string>;
    trackingConsent: boolean;
    eventId: string;
    metaFbc?: string;
    metaFbp?: string;
    metaExternalId?: string;
    metaEventSourceUrl?: string;
  },
) {
  const selected = [context.university, context.program].filter(Boolean).join(' — ');
  const isMeta = isMetaMarchCampaignAttribution(context);
  return {
    name: fields.name.trim(),
    phone: normalizeMarchPhoneInput(fields.phone),
    email: fields.email.trim().toLowerCase(),
    country: 'China',
    program: selected || fields.route,
    message: [
      'Study in China fit assessment.',
      `Study route: ${fields.route}.`,
      `Target intake: ${fields.intake || 'Any next open intake'}.`,
      `Qualification: ${fields.academicLevel}.`,
      `Result: ${fields.result.trim()}.`,
      selected && `Selected university: ${selected}.`,
      'Requested: university shortlist, scholarship options, written cost schedule and document checklist.',
    ]
      .filter(Boolean)
      .join('\n'),
    notes: ['Page: /study-in-china-from-bangladesh', fields.intake && `Intake: ${fields.intake}`, selected && `Selected: ${selected}`]
      .filter(Boolean)
      .join(' | '),
    source: isMeta ? 'meta_china_study_page' : 'china_study_landing',
    leadType: 'assessment',
    destinationInterest: ['China'],
    assessment: {
      academicLevel: fields.academicLevel,
      academicResults: fields.result.trim(),
      subject: selected || fields.route,
      intake: fields.intake || 'Next open intake',
      preferredCountries: ['China'],
    },
    consent: fields.consent,
    consentTimestamp: context.consentTimestamp,
    consentPolicyVersion: '2026-07-19',
    landingPage: '/study-in-china-from-bangladesh',
    utm: context.utm,
    trackingConsent: context.trackingConsent,
    metaEventId: context.eventId,
    ...(context.metaFbc ? { metaFbc: context.metaFbc } : {}),
    ...(context.metaFbp ? { metaFbp: context.metaFbp } : {}),
    ...(context.metaExternalId ? { metaExternalId: context.metaExternalId } : {}),
    ...(context.metaEventSourceUrl ? { metaEventSourceUrl: context.metaEventSourceUrl } : {}),
  };
}

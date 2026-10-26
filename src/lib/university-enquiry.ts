export const UNIVERSITY_ENQUIRY_PRIVACY_VERSION = '2026-07-19';
export type UniversityEnquiryFields = { name: string; phone: string; email: string; consent: boolean };
export type UniversityEnquiryErrors = Partial<Record<keyof UniversityEnquiryFields, string>>;
export function validateUniversityEnquiry(fields: UniversityEnquiryFields): UniversityEnquiryErrors {
  const errors: UniversityEnquiryErrors = {};
  if (fields.name.trim().length < 2) errors.name = 'Enter your full name.';
  const digits = fields.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(fields.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a valid WhatsApp or phone number, including your country code.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Enter a valid email address for your study plan.';
  if (!fields.consent) errors.consent = 'Please agree so a counselor can contact you about this enquiry.';
  return errors;
}
export function universityEnquiryPayload(
  fields: UniversityEnquiryFields,
  context: { university: string; country: string; program?: string; level?: string; scholarship?: string },
  consentTimestamp: string,
  options: { eventId?: string; trackingConsent?: boolean } = {},
) {
  const destination = context.country === 'United Kingdom' ? 'uk' : context.country.toLowerCase().replace(/\s+/g, '-');
  return {
    name: fields.name.trim(), email: fields.email.trim().toLowerCase(), phone: fields.phone.trim(), country: context.country,
    program: context.program || 'Help me choose a program',
    source: 'university_profile_enquiry', leadType: 'application', destinationInterest: destination,
    message: [`University plan enquiry: ${context.university}`, context.level && `Study level: ${context.level}`, context.program ? `Program interest: ${context.program}` : 'Program interest: help me choose', context.scholarship && `Funding interest: ${context.scholarship}`, 'Requested support: eligibility, scholarship options, documents and a written cost plan.'].filter(Boolean).join('\n'),
    notes: `University: ${context.university} | University profile enquiry`,
    assessment: { subject: context.program || '', intake: '2027 planning', preferredCountries: [destination] },
    consent: fields.consent, consentTimestamp, consentPolicyVersion: UNIVERSITY_ENQUIRY_PRIVACY_VERSION,
    trackingConsent: options.trackingConsent === true,
    ...(options.eventId ? { metaEventId: options.eventId } : {}),
  };
}

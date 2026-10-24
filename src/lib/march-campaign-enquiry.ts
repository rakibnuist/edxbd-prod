export const marchStudyRoutes = ['Chinese language', 'Foundation → Bachelor', 'Direct Bachelor', 'Master’s', 'Help me choose a route'] as const;
export const marchAcademicLevels = ['SSC / O Level completed', 'HSC / A Level in progress', 'HSC / A Level completed', 'Diploma in progress / completed', 'Bachelor’s in progress / completed', 'Master’s completed'] as const;
export type MarchEnquiryFields = { academicLevel: string; result: string; route: string; name: string; phone: string; email: string; consent: boolean };
export type MarchEnquiryErrors = Partial<Record<keyof MarchEnquiryFields, string>>;
export const emptyMarchEnquiry: MarchEnquiryFields = { academicLevel: '', result: '', route: '', name: '', phone: '', email: '', consent: false };
export function validateMarchEnquiry(fields: MarchEnquiryFields): MarchEnquiryErrors {
  const errors: MarchEnquiryErrors = {};
  if (!marchAcademicLevels.includes(fields.academicLevel as typeof marchAcademicLevels[number])) errors.academicLevel = 'Select your current academic qualification.';
  if (fields.result.trim().length < 2) errors.result = 'Enter your latest result, for example HSC GPA 4.50.';
  if (!marchStudyRoutes.includes(fields.route as typeof marchStudyRoutes[number])) errors.route = 'Choose a study route, or select Help me choose.';
  if (fields.name.trim().length < 2) errors.name = 'Enter your full name.';
  const digits = fields.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(fields.phone.trim()) || digits.length < 10 || digits.length > 15) errors.phone = 'Enter a valid phone number, including your country code.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Enter a valid email address, for example name@example.com.';
  if (!fields.consent) errors.consent = 'Please agree so we can contact you about this enquiry.';
  return errors;
}
export function marchEnquiryPayload(fields: MarchEnquiryFields, context: { university?: string; program?: string; consentTimestamp: string; utm: Record<string,string>; trackingConsent: boolean; eventId: string }) {
  const selected = [context.university, context.program].filter(Boolean).join(' — ');
  return {
    name: fields.name.trim(), phone: fields.phone.trim(), email: fields.email.trim().toLowerCase(), country: 'China', program: selected || fields.route,
    message: [`China March 2027 study plan.`, `Study route: ${fields.route}.`, `Qualification: ${fields.academicLevel}.`, `Result: ${fields.result.trim()}.`, selected && `Selected option: ${selected}.`, 'Requested: university shortlist, scholarship eligibility, written costs and application document checklist.'].filter(Boolean).join('\n'),
    notes: ['Campaign: China March 2027', selected && `Selected option: ${selected}`].filter(Boolean).join(' | '),
    source: /^(meta|facebook|fb|instagram|ig)$/i.test(context.utm.utm_source || '') ? 'meta_china_march_2027' : 'china_march_2027_landing',
    leadType: 'campaign_assessment', destinationInterest: 'china',
    assessment: { academicLevel: fields.academicLevel, academicResults: fields.result.trim(), subject: selected || fields.route, intake: 'March 2027', preferredCountries: ['china'] },
    consent: fields.consent, consentTimestamp: context.consentTimestamp, consentPolicyVersion: '2026-10-11', landingPage: '/china-march-2027-intake', utm: context.utm,
    trackingConsent: context.trackingConsent, metaEventId: context.eventId,
  };
}

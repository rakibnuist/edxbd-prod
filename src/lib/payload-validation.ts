import { extractSanitizedClientIp } from './client-ip';
import { normalizeMetaLeadPhone } from './lead-workflow';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export { extractSanitizedClientIp };

export const PARTNERSHIP_STATUSES = [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'active',
  'suspended',
  'on_hold',
] as const;

export const PARTNERSHIP_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

function asPlainObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

export function normalizeSafeHttpUrl(value: unknown, maxLength = 500): { url?: string; error?: string } {
  if (value === undefined || value === null) return { url: undefined };
  if (typeof value !== 'string') return { error: 'Website URL must be text.' };
  const trimmed = value.trim();
  if (!trimmed) return { url: undefined };
  if (trimmed.length > maxLength) return { error: 'Website URL is too long.' };
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { error: 'URL must use http:// or https://.' };
    }
    return { url: parsed.toString() };
  } catch {
    return { error: 'Website must be a valid http:// or https:// URL.' };
  }
}

function readOptionalText(
  body: Record<string, unknown>,
  field: string,
  maxLength: number
): { value?: string; error?: string } {
  const raw = body[field];
  if (raw === undefined || raw === null) return { value: undefined };
  if (typeof raw !== 'string') return { error: `${field} must be text.` };
  const trimmed = raw.trim();
  if (!trimmed) return { value: undefined };
  if (trimmed.length > maxLength) return { error: `${field} is too long.` };
  return { value: trimmed };
}

function readOptionalNullableText(
  body: Record<string, unknown>,
  field: string,
  maxLength: number
): { present: boolean; value?: string | null; error?: string } {
  if (!(field in body)) return { present: false };
  const raw = body[field];
  if (raw === null) return { present: true, value: null };
  if (typeof raw !== 'string') return { present: true, error: `${field} must be text.` };
  const trimmed = raw.trim();
  if (trimmed.length > maxLength) return { present: true, error: `${field} is too long.` };
  return { present: true, value: trimmed || null };
}

function readOptionalNonNegInt(
  body: Record<string, unknown>,
  field: string,
  max = 1_000_000
): { present: boolean; value?: number; error?: string } {
  if (!(field in body) || body[field] === undefined || body[field] === null || body[field] === '') {
    return { present: false };
  }
  const raw = body[field];
  const parsed = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return { present: true, error: `${field} must be a non-negative whole number.` };
  }
  return { present: true, value: Math.min(parsed, max) };
}

export function normalizeStringList(
  value: unknown,
  field: string,
  maxItems = 30,
  maxItemLength = 150
): { list?: string[]; error?: string } {
  if (value === undefined || value === null || value === '') return { list: [] };
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return { list: [] };
    if (trimmed.length > maxItemLength) return { error: `${field} is too long.` };
    return { list: [trimmed] };
  }
  if (!Array.isArray(value)) return { error: `${field} must be a list of text items.` };
  if (value.length > maxItems) return { error: `${field} has too many items.` };
  const items: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string') return { error: `${field} items must be text.` };
    const trimmed = entry.trim();
    if (!trimmed) continue;
    if (trimmed.length > maxItemLength) return { error: `${field} item is too long.` };
    items.push(trimmed);
  }
  return { list: items };
}

export function normalizeFlatRecord(
  value: unknown,
  field: string,
  maxKeys = 15,
  maxValLength = 300
): { json?: string; error?: string } {
  if (value === undefined || value === null || value === '') return { json: '{}' };
  if (typeof value === 'string') {
    if (value.trim().length > maxValLength) return { error: `${field} is too long.` };
    return { json: value.trim() };
  }
  if (Array.isArray(value)) {
    const listRes = normalizeStringList(value, field, maxKeys, maxValLength);
    if (listRes.error) return { error: listRes.error };
    return { json: JSON.stringify(listRes.list || []) };
  }
  const obj = asPlainObject(value);
  if (!obj) return { error: `${field} must be an object or list.` };
  const entries = Object.entries(obj);
  if (entries.length > maxKeys) return { error: `${field} has too many fields.` };
  const clean: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (typeof v !== 'string') return { error: `${field}.${k} must be text.` };
    const key = k.trim().slice(0, 60);
    const val = v.trim();
    if (val.length > maxValLength) return { error: `${field}.${k} is too long.` };
    if (key) clean[key] = val;
  }
  return { json: JSON.stringify(clean) };
}

export function validateAdminLeadCreate(
  raw: unknown,
  isValidStatus: (value: unknown) => boolean = (v) => typeof v === 'string' && v.length > 0 && v.length <= 60
): {
  data?: {
    name: string;
    email: string;
    phone: string;
    country: string;
    program?: string;
    message?: string;
    status: string;
    source: string;
    leadType: string;
    notes?: string;
    assignedTeam: string;
    assignedTo?: string;
    destinationInterest?: string;
    landingPage?: string;
    utm?: string;
    assessAcademicLevel?: string;
    assessAcademicResults?: string;
    assessLanguage?: string;
    riskFlag: boolean;
    medicalProgram: boolean;
    consentTimestamp: Date;
    consentPolicyVersion: string;
    createdAt?: Date;
  };
  error?: string;
} {
  const body = asPlainObject(raw);
  if (!body) return { error: 'Lead payload must be an object.' };

  const name = readOptionalText(body, 'name', 120);
  if (name.error || !name.value) return { error: name.error || 'Name is required.' };

  const emailRes = readOptionalText(body, 'email', 254);
  if (emailRes.error || !emailRes.value) return { error: emailRes.error || 'Email is required.' };
  const email = emailRes.value.toLowerCase();
  if (!EMAIL_REGEX.test(email)) return { error: 'Invalid email format.' };

  const phone = readOptionalText(body, 'phone', 40);
  if (phone.error || !phone.value) return { error: phone.error || 'Phone is required.' };
  const normalizedPhone = normalizeMetaLeadPhone(phone.value) || phone.value;

  const country = readOptionalText(body, 'country', 120);
  if (country.error || !country.value) return { error: country.error || 'Country is required.' };

  const program = readOptionalText(body, 'program', 200);
  const message = readOptionalText(body, 'message', 4000);
  const source = readOptionalText(body, 'source', 100);
  const leadType = readOptionalText(body, 'leadType', 50);
  const notes = readOptionalText(body, 'notes', 12000);
  const assignedTeam = readOptionalText(body, 'assignedTeam', 100);
  const assignedTo = readOptionalText(body, 'assignedTo', 120);
  const destinationInterest = readOptionalText(body, 'destinationInterest', 500);
  const landingPage = readOptionalText(body, 'landingPage', 2048);
  const utm = readOptionalText(body, 'utm', 4000);
  const assessAcademicLevel = readOptionalText(body, 'assessAcademicLevel', 120);
  const assessAcademicResults = readOptionalText(body, 'assessAcademicResults', 120);
  const assessLanguage = readOptionalText(body, 'assessLanguage', 120);
  const consentPolicyVersion = readOptionalText(body, 'consentPolicyVersion', 100);

  for (const check of [program, message, source, leadType, notes, assignedTeam, assignedTo, destinationInterest, landingPage, utm, assessAcademicLevel, assessAcademicResults, assessLanguage, consentPolicyVersion]) {
    if (check.error) return { error: check.error };
  }

  let status = 'new';
  if ('status' in body && body.status !== undefined && body.status !== '') {
    if (!isValidStatus(body.status)) return { error: 'Invalid lead status.' };
    status = String(body.status);
  }

  if ('riskFlag' in body && body.riskFlag !== undefined && typeof body.riskFlag !== 'boolean') {
    return { error: 'riskFlag must be a boolean.' };
  }
  if ('medicalProgram' in body && body.medicalProgram !== undefined && typeof body.medicalProgram !== 'boolean') {
    return { error: 'medicalProgram must be a boolean.' };
  }

  let hasExplicitConsentTimestamp = false;
  let consentTimestamp = new Date();
  if ('consentTimestamp' in body && body.consentTimestamp !== undefined && body.consentTimestamp !== '') {
    if (typeof body.consentTimestamp !== 'string') return { error: 'consentTimestamp must be a date string.' };
    const parsed = new Date(body.consentTimestamp);
    if (Number.isNaN(parsed.getTime())) return { error: 'consentTimestamp must be a valid date.' };
    consentTimestamp = parsed;
    hasExplicitConsentTimestamp = true;
  }

  let explicitCreatedAt: Date | undefined;
  if ('createdAt' in body && body.createdAt !== undefined && body.createdAt !== '') {
    if (typeof body.createdAt !== 'string') return { error: 'createdAt must be a date string.' };
    const parsedCreated = new Date(body.createdAt);
    if (Number.isNaN(parsedCreated.getTime())) return { error: 'createdAt must be a valid date.' };
    if (parsedCreated.getTime() <= Date.now() + 60_000) {
      explicitCreatedAt = parsedCreated;
    }
  } else if (hasExplicitConsentTimestamp && consentTimestamp.getTime() <= Date.now() + 60_000) {
    explicitCreatedAt = consentTimestamp;
  }

  return {
    data: {
      name: name.value,
      email,
      phone: normalizedPhone,
      country: country.value,
      program: program.value,
      message: message.value,
      status,
      source: source.value || 'admin_created',
      leadType: leadType.value || 'contact',
      notes: notes.value,
      assignedTeam: assignedTeam.value || 'general',
      assignedTo: assignedTo.value,
      destinationInterest: destinationInterest.value,
      landingPage: landingPage.value,
      ...(utm.value ? { utm: utm.value } : {}),
      ...(assessAcademicLevel.value ? { assessAcademicLevel: assessAcademicLevel.value } : {}),
      ...(assessAcademicResults.value ? { assessAcademicResults: assessAcademicResults.value } : {}),
      ...(assessLanguage.value ? { assessLanguage: assessLanguage.value } : {}),
      riskFlag: Boolean(body.riskFlag),
      medicalProgram: Boolean(body.medicalProgram),
      consentTimestamp,
      consentPolicyVersion: consentPolicyVersion.value || 'admin-entry',
      ...(explicitCreatedAt ? { createdAt: explicitCreatedAt } : {}),
    },
  };
}

const PROTECTED_PARTNERSHIP_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'ipAddress',
  'userAgent',
  'consentTimestamp',
  'consentPolicyVersion',
  'source',
]);

export function validateAdminPartnershipCreate(raw: unknown): {
  data?: Record<string, unknown>;
  error?: string;
} {
  const body = asPlainObject(raw);
  if (!body) return { error: 'Partnership payload must be an object.' };

  const companyName = readOptionalText(body, 'companyName', 200);
  const businessType = readOptionalText(body, 'businessType', 100);
  const contactPerson = readOptionalText(body, 'contactPerson', 120);
  const emailRes = readOptionalText(body, 'email', 254);
  const phone = readOptionalText(body, 'phone', 40);

  const isIndividual = businessType.value?.toLowerCase() === 'individual';
  if (companyName.error) return { error: companyName.error };
  if (!isIndividual && !companyName.value) return { error: 'companyName is required for non-individual partners.' };
  if (contactPerson.error || !contactPerson.value) return { error: contactPerson.error || 'contactPerson is required.' };
  if (emailRes.error || !emailRes.value) return { error: emailRes.error || 'email is required.' };
  if (!EMAIL_REGEX.test(emailRes.value.toLowerCase())) return { error: 'Invalid email format.' };
  if (phone.error || !phone.value) return { error: phone.error || 'phone is required.' };

  const websiteRes = normalizeSafeHttpUrl(body.website);
  if (websiteRes.error) return { error: websiteRes.error };

  const status = typeof body.status === 'string' && body.status ? body.status : 'pending';
  if (!(PARTNERSHIP_STATUSES as readonly string[]).includes(status)) {
    return { error: 'Invalid partnership status.' };
  }

  const priority = typeof body.priority === 'string' && body.priority ? body.priority : 'medium';
  if (!(PARTNERSHIP_PRIORITIES as readonly string[]).includes(priority)) {
    return { error: 'Invalid partnership priority.' };
  }

  const data: Record<string, unknown> = {
    companyName: companyName.value || contactPerson.value,
    contactPerson: contactPerson.value,
    email: emailRes.value.toLowerCase(),
    phone: phone.value,
    status,
    priority,
    source: 'admin_created',
    ...(websiteRes.url ? { website: websiteRes.url } : {}),
  };

  const optionalStrings: Array<[string, number]> = [
    ['businessType', 100],
    ['businessRegistrationNumber', 100],
    ['businessLicense', 200],
    ['alternatePhone', 40],
    ['address', 500],
    ['city', 100],
    ['state', 100],
    ['country', 100],
    ['postalCode', 32],
    ['partnershipType', 100],
    ['experience', 2000],
    ['annualRevenue', 100],
    ['investmentCapacity', 100],
    ['expectedCommission', 100],
    ['localNetwork', 1000],
    ['motivation', 4000],
    ['expectations', 4000],
    ['additionalInfo', 4000],
    ['assignedTo', 120],
    ['reviewNotes', 4000],
  ];

  for (const [field, maxLen] of optionalStrings) {
    const res = readOptionalText(body, field, maxLen);
    if (res.error) return { error: res.error };
    if (res.value !== undefined) data[field] = res.value;
  }

  for (const intField of ['yearsInBusiness', 'currentClients', 'monthlyTarget']) {
    const intRes = readOptionalNonNegInt(body, intField);
    if (intRes.error) return { error: intRes.error };
    if (intRes.present && intRes.value !== undefined) data[intField] = intRes.value;
  }

  return { data };
}

export function validateAdminPartnershipUpdate(raw: unknown): {
  data?: Record<string, unknown>;
  error?: string;
} {
  const body = asPlainObject(raw);
  if (!body) return { error: 'Partnership update must be an object.' };

  for (const key of Object.keys(body)) {
    if (PROTECTED_PARTNERSHIP_FIELDS.has(key)) {
      return { error: `Field "${key}" cannot be modified.` };
    }
  }

  const data: Record<string, unknown> = {};

  if ('status' in body) {
    if (typeof body.status !== 'string' || !(PARTNERSHIP_STATUSES as readonly string[]).includes(body.status)) {
      return { error: 'Invalid partnership status.' };
    }
    data.status = body.status;
  }

  if ('priority' in body) {
    if (typeof body.priority !== 'string' || !(PARTNERSHIP_PRIORITIES as readonly string[]).includes(body.priority)) {
      return { error: 'Invalid partnership priority.' };
    }
    data.priority = body.priority;
  }

  if ('email' in body) {
    const emailRes = readOptionalText(body, 'email', 254);
    if (emailRes.error || !emailRes.value) return { error: emailRes.error || 'Email cannot be empty.' };
    const normalized = emailRes.value.toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) return { error: 'Invalid email format.' };
    data.email = normalized;
  }

  if ('website' in body) {
    const websiteRes = normalizeSafeHttpUrl(body.website);
    if (websiteRes.error) return { error: websiteRes.error };
    data.website = websiteRes.url ?? null;
  }

  const requiredIfPresent: Array<[string, number]> = [
    ['businessType', 100],
    ['contactPerson', 120],
    ['phone', 40],
    ['partnershipType', 100],
  ];
  for (const [field, maxLen] of requiredIfPresent) {
    if (field in body) {
      const res = readOptionalText(body, field, maxLen);
      if (res.error || !res.value) return { error: res.error || `${field} cannot be empty.` };
      data[field] = res.value;
    }
  }

  const nullableStrings: Array<[string, number]> = [
    ['companyName', 200],
    ['businessRegistrationNumber', 100],
    ['businessLicense', 200],
    ['alternatePhone', 40],
    ['address', 500],
    ['city', 100],
    ['state', 100],
    ['country', 100],
    ['postalCode', 32],
    ['experience', 2000],
    ['annualRevenue', 100],
    ['investmentCapacity', 100],
    ['expectedCommission', 100],
    ['localNetwork', 1000],
    ['motivation', 4000],
    ['expectations', 4000],
    ['additionalInfo', 4000],
    ['assignedTo', 120],
    ['reviewNotes', 4000],
  ];
  for (const [field, maxLen] of nullableStrings) {
    const res = readOptionalNullableText(body, field, maxLen);
    if (res.error) return { error: res.error };
    if (res.present) data[field] = res.value;
  }

  for (const intField of ['yearsInBusiness', 'currentClients', 'monthlyTarget']) {
    if (intField in body) {
      const intRes = readOptionalNonNegInt(body, intField);
      if (intRes.error) return { error: intRes.error };
      if (intRes.present && intRes.value !== undefined) data[intField] = intRes.value;
    }
  }

  if (Object.keys(data).length === 0) {
    return { error: 'Provide at least one updatable partnership field.' };
  }

  return { data };
}

export function validateLeadAssessmentInput(raw: unknown): {
  destinationInterest?: string | null;
  routeDestinationInterest?: string;
  assessment: {
    academicLevel?: string;
    academicResults?: string;
    subject?: string;
    budget?: string;
    intake?: string;
    language?: string;
    careerGoal?: string;
    preferredCountriesJson: string | null;
  };
  error?: string;
} {
  const body = asPlainObject(raw);
  if (!body) {
    return {
      assessment: { preferredCountriesJson: null },
      error: 'Lead payload must be an object.',
    };
  }

  let destinationInterest: string | null = null;
  let routeDestinationInterest: string | undefined;
  const rawDest = body.destinationInterest;
  if (rawDest !== undefined && rawDest !== null && rawDest !== '') {
    if (typeof rawDest === 'string') {
      const trimmed = rawDest.trim();
      if (trimmed.length > 200) return { assessment: { preferredCountriesJson: null }, error: 'destinationInterest is too long.' };
      if (trimmed) {
        destinationInterest = JSON.stringify(trimmed);
        routeDestinationInterest = trimmed;
      }
    } else if (Array.isArray(rawDest)) {
      const listRes = normalizeStringList(rawDest, 'destinationInterest', 20, 100);
      if (listRes.error) return { assessment: { preferredCountriesJson: null }, error: listRes.error };
      if (listRes.list && listRes.list.length > 0) {
        destinationInterest = JSON.stringify(listRes.list);
        routeDestinationInterest = listRes.list[0];
      }
    } else {
      return { assessment: { preferredCountriesJson: null }, error: 'destinationInterest must be text or a list of destinations.' };
    }
  }

  if (body.assessment === undefined || body.assessment === null) {
    return { destinationInterest, routeDestinationInterest, assessment: { preferredCountriesJson: null } };
  }

  const assessObj = asPlainObject(body.assessment);
  if (!assessObj) {
    return { assessment: { preferredCountriesJson: null }, error: 'assessment must be an object.' };
  }

  const academicLevel = readOptionalText(assessObj, 'academicLevel', 200);
  const academicResults = readOptionalText(assessObj, 'academicResults', 200);
  const subject = readOptionalText(assessObj, 'subject', 200);
  const budget = readOptionalText(assessObj, 'budget', 200);
  const intake = readOptionalText(assessObj, 'intake', 200);
  const language = readOptionalText(assessObj, 'language', 200);
  const careerGoal = readOptionalText(assessObj, 'careerGoal', 500);
  for (const check of [academicLevel, academicResults, subject, budget, intake, language, careerGoal]) {
    if (check.error) return { assessment: { preferredCountriesJson: null }, error: check.error };
  }

  let preferredCountriesJson: string | null = null;
  if (assessObj.preferredCountries !== undefined && assessObj.preferredCountries !== null) {
    const prefRes = normalizeStringList(assessObj.preferredCountries, 'preferredCountries', 20, 100);
    if (prefRes.error) return { assessment: { preferredCountriesJson: null }, error: prefRes.error };
    preferredCountriesJson = JSON.stringify(prefRes.list || []);
  }

  return {
    destinationInterest,
    routeDestinationInterest,
    assessment: {
      academicLevel: academicLevel.value,
      academicResults: academicResults.value,
      subject: subject.value,
      budget: budget.value,
      intake: intake.value,
      language: language.value,
      careerGoal: careerGoal.value,
      preferredCountriesJson,
    },
  };
}

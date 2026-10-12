import type { IUniversity } from '@/types/university';

const hasHttpUrl = (value: unknown) => /^https?:\/\//i.test(String(value || '').trim());
const isFutureDate = (value: unknown, now = new Date()) => {
  if (!value) return false;
  const date = new Date(String(value));
  return !Number.isNaN(date.getTime()) && date.getTime() >= now.getTime();
};

const sourceList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).filter(hasHttpUrl);
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).filter(hasHttpUrl) : [];
  } catch {
    return [];
  }
};

export function universityVerificationErrors(university: Partial<IUniversity>, now = new Date()): string[] {
  const errors: string[] = [];
  const publishedPlans = (university.costPlans || []).filter(plan => plan.isPublished);

  publishedPlans.forEach((plan, index) => {
    const label = plan.title?.trim() || `ClearCost plan ${index + 1}`;
    if (!hasHttpUrl(plan.sourceUrl)) errors.push(`${label}: add the official cost source.`);
    if (!plan.lastVerifiedAt) errors.push(`${label}: add the verification date.`);
    if (!plan.programName?.trim()) errors.push(`${label}: select the exact program.`);
    if (!plan.totalEstimate?.trim()) errors.push(`${label}: add the written first-year total.`);
  });

  if (university.verificationStatus !== 'verified') return errors;

  return [...errors, ...universityIndexingErrors(university, now)];
}

export function universityIndexingErrors(university: Partial<IUniversity>, now = new Date()): string[] {
  const errors: string[] = [];
  const programs = (university.programs || []).filter(program => program.name?.trim() && program.status === 'active');
  const fees = (university.fees || []).filter(fee => fee.item?.trim());
  const scholarships = (university.scholarships || []).filter(item => item.title?.trim() && item.status === 'active');

  if (!hasHttpUrl(university.officialUrl)) errors.push('Add the official university website.');
  if (!sourceList(university.sourceUrls).length) errors.push('Add at least one official university source URL.');
  if (!university.lastVerifiedAt) errors.push('Add the university verification date.');
  if (!isFutureDate(university.verificationExpiresAt, now)) errors.push('Set a future verification expiry date.');
  if (!hasHttpUrl(university.recognitionSourceUrl)) errors.push('Add the recognition or accreditation source.');
  if (!programs.length) errors.push('Add at least one active program.');

  programs.forEach(program => {
    if (!hasHttpUrl(program.sourceUrl)) errors.push(`${program.name}: add the official program source.`);
    if (!program.duration?.trim()) errors.push(`${program.name}: add the official duration.`);
  });
  fees.forEach(fee => {
    if (!hasHttpUrl(fee.sourceUrl)) errors.push(`${fee.item}: add the official fee source.`);
  });
  scholarships.forEach(scholarship => {
    if (!hasHttpUrl(scholarship.sourceUrl)) errors.push(`${scholarship.title}: add the official scholarship source.`);
  });

  if (university.relationshipType && university.relationshipType !== 'unverified' && university.relationshipType !== 'public_direct_application' && !hasHttpUrl(university.relationshipEvidenceUrl)) {
    errors.push('Add evidence for the selected institutional relationship type.');
  }

  return errors;
}

export function universityIsIndexable(university: {
  officialUrl?: string | null;
  sourceUrls?: string[] | string | null;
  lastVerifiedAt?: Date | string | null;
  verificationExpiresAt?: Date | string | null;
  verificationStatus?: string | null;
}, now = new Date()) {
  return university.verificationStatus === 'verified'
    && hasHttpUrl(university.officialUrl)
    && sourceList(university.sourceUrls).length > 0
    && Boolean(university.lastVerifiedAt)
    && isFutureDate(university.verificationExpiresAt, now);
}

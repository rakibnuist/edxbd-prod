import 'server-only';

import { cache } from 'react';
import connectDB from '@/lib/mongodb';
import University from '@/models/University';

export type CleanUniversityRecord = {
  _id: string;
  slug: string;
  legacySlugs: string[];
  name: string;
  aliases: string[];
  location: string;
  country: string;
  city: string;
  intake: string[];
  degree: string[];
  taught: string[];
  rankings: { country?: number; world?: number; national?: number };
  details: { majors: string[]; tuition: string; tuitionDetails: string[] };
  programs: {
    level: string;
    name: string;
    subject?: string;
    languages: string[];
    duration?: string;
    intakes: string[];
    tuition?: string;
    tuitionAfterScholarship?: string;
    applicationDeadline?: string;
    eligibility: string[];
    sourceUrl?: string;
    status: 'active' | 'planned' | 'paused';
  }[];
  fees: { item: string; cost: string; notes?: string; recipient?: string; refundable?: 'yes' | 'no' | 'conditional' | ''; validFor?: string; sourceUrl?: string }[];
  scholarships: { title: string; type?: string; details: string[]; amount?: string; condition?: string; eligiblePrograms: string[]; coverage?: string; renewal?: string; deadline?: string; sourceUrl?: string; status: 'active' | 'planned' | 'closed' }[];
  documents: string[];
  deadlines: { application: string; startDate: string };
  notes: string[];
  badges: string[];
  logo?: string;
  isActive: boolean;
  officialUrl?: string;
  relationshipType: 'direct_partner' | 'authorized_representative' | 'network_access' | 'public_direct_application' | 'unverified';
  relationshipEvidenceUrl?: string;
  recognitionAuthority?: string;
  recognitionSourceUrl?: string;
  sourceUrls: string[];
  lastVerifiedAt?: string;
  verificationExpiresAt?: string;
  verificationStatus: 'verified' | 'under_verification' | 'expired';
  createdAt?: string;
  updatedAt?: string;
};

type RawRecord = Record<string, unknown>;

const text = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim();

const comparisonKey = (value: unknown) => text(value)
  .toLocaleLowerCase('en')
  .replace(/&/g, 'and')
  .replace(/\bfees?\b/g, 'fee')
  .replace(/[^a-z0-9]+/g, '');

const uniqueStrings = (values: unknown) => {
  const seen = new Set<string>();
  return (Array.isArray(values) ? values : [])
    .map(text)
    .filter(value => {
      const key = comparisonKey(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const uniqueObjects = <T>(values: unknown, keyFor: (value: T) => string) => {
  const seen = new Set<string>();
  return (Array.isArray(values) ? values : [])
    .filter((value): value is T => Boolean(value && typeof value === 'object'))
    .filter(value => {
      const key = keyFor(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const dateString = (value: unknown) => {
  if (!value) return undefined;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const levelLabel = (value: string) => {
  const key = comparisonKey(value);
  if (key === 'masters' || key === 'master') return "Master's";
  if (key === 'phd' || key === 'doctorate') return 'PhD';
  if (key === 'bachelors' || key === 'bachelor') return 'Bachelor';
  if (key === 'mbbs' || key === 'medicine') return 'MBBS';
  return value;
};

const intakeLabel = (value: string) => {
  if (/^(fall\s+2026|fall\s+2027|september|september\s+2026)$/i.test(value)) return 'September 2027';
  return value.replace(/2026/g, '2027');
};

const currencyLabel = (value: unknown) => text(value)
  .replace(/\bRMB\b/gi, 'CNY')
  .replace(/\bYuan\b/gi, 'CNY')
  .replace(/\s*[-–—]\s*/g, ' – ')
  .replace(/\/year\b/gi, '/Year')
  .replace(/\s+/g, ' ')
  .trim();

export function cleanUniversityRecord(raw: RawRecord): CleanUniversityRecord {
  const details = (raw.details && typeof raw.details === 'object' ? raw.details : {}) as Record<string, unknown>;
  const deadlines = (raw.deadlines && typeof raw.deadlines === 'object' ? raw.deadlines : {}) as Record<string, unknown>;
  const sourceUrls = uniqueStrings(raw.sourceUrls);
  const lastVerifiedAt = dateString(raw.lastVerifiedAt);
  const verificationExpiresAt = dateString(raw.verificationExpiresAt);
  const verificationIsCurrent = Boolean(
    raw.verificationStatus === 'verified'
    && sourceUrls.length
    && lastVerifiedAt
    && verificationExpiresAt
    && new Date(verificationExpiresAt) >= new Date(),
  );

  const fees = uniqueObjects<Record<string, unknown>>(
    raw.fees,
    fee => comparisonKey(`${fee.item}|${currencyLabel(fee.cost)}|${fee.notes ?? ''}`),
  ).map(fee => ({
    item: text(fee.item),
    cost: currencyLabel(fee.cost),
    ...(text(fee.notes) ? { notes: text(fee.notes) } : {}),
    ...(text(fee.recipient) ? { recipient: text(fee.recipient) } : {}),
    refundable: (['yes', 'no', 'conditional'].includes(text(fee.refundable)) ? text(fee.refundable) : '') as 'yes' | 'no' | 'conditional' | '',
    ...(text(fee.validFor) ? { validFor: text(fee.validFor) } : {}),
    ...(text(fee.sourceUrl) ? { sourceUrl: text(fee.sourceUrl) } : {}),
  })).filter(fee => fee.item || fee.cost);

  const programs = uniqueObjects<Record<string, unknown>>(
    raw.programs,
    program => comparisonKey(`${program.level}|${program.name}`),
  ).map(program => ({
    level: levelLabel(text(program.level) || 'Bachelor'),
    name: text(program.name),
    ...(text(program.subject) ? { subject: text(program.subject) } : {}),
    languages: uniqueStrings(program.languages),
    ...(text(program.duration) ? { duration: text(program.duration) } : {}),
    intakes: uniqueStrings(program.intakes).map(intakeLabel),
    ...(text(program.tuition) ? { tuition: currencyLabel(program.tuition) } : {}),
    ...(text(program.tuitionAfterScholarship) ? { tuitionAfterScholarship: currencyLabel(program.tuitionAfterScholarship) } : {}),
    ...(text(program.applicationDeadline) ? { applicationDeadline: text(program.applicationDeadline) } : {}),
    eligibility: uniqueStrings(program.eligibility),
    ...(text(program.sourceUrl) ? { sourceUrl: text(program.sourceUrl) } : {}),
    status: ['planned', 'paused'].includes(text(program.status)) ? text(program.status) as 'planned' | 'paused' : 'active' as const,
  })).filter(program => program.name);

  const scholarships = uniqueObjects<Record<string, unknown>>(
    raw.scholarships,
    scholarship => comparisonKey(`${scholarship.title}|${scholarship.amount ?? ''}|${JSON.stringify(scholarship.details ?? [])}`),
  ).map(scholarship => ({
    title: text(scholarship.title) || 'Scholarship record',
    ...(text(scholarship.type) ? { type: text(scholarship.type) } : {}),
    details: uniqueStrings(scholarship.details),
    ...(text(scholarship.amount) ? { amount: currencyLabel(scholarship.amount) } : {}),
    ...(text(scholarship.condition) ? { condition: text(scholarship.condition) } : {}),
    eligiblePrograms: uniqueStrings(scholarship.eligiblePrograms),
    ...(text(scholarship.coverage) ? { coverage: text(scholarship.coverage) } : {}),
    ...(text(scholarship.renewal) ? { renewal: text(scholarship.renewal) } : {}),
    ...(text(scholarship.deadline) ? { deadline: text(scholarship.deadline) } : {}),
    ...(text(scholarship.sourceUrl) ? { sourceUrl: text(scholarship.sourceUrl) } : {}),
    status: ['planned', 'closed'].includes(text(scholarship.status)) ? text(scholarship.status) as 'planned' | 'closed' : 'active' as const,
  }));

  const degree = uniqueStrings(raw.degree).map(levelLabel);
  const intake = uniqueStrings(raw.intake).map(intakeLabel);

  return {
    _id: text(raw._id),
    slug: text(raw.slug).toLowerCase(),
    legacySlugs: uniqueStrings(raw.legacySlugs).map(value => value.toLowerCase()),
    name: text(raw.name).replace(/\s+\([A-Z0-9-]{2,12}\)\s*$/, '').trim(),
    aliases: uniqueStrings(raw.aliases),
    location: text(raw.location),
    country: text(raw.country),
    city: text(raw.city),
    intake: uniqueStrings(intake),
    degree: uniqueStrings(degree),
    taught: uniqueStrings(raw.taught),
    rankings: (raw.rankings && typeof raw.rankings === 'object' ? raw.rankings : {}) as CleanUniversityRecord['rankings'],
    details: {
      majors: uniqueStrings(details.majors),
      tuition: currencyLabel(details.tuition) || 'Current tuition confirmed in the ClearCost Sheet',
      tuitionDetails: uniqueStrings(details.tuitionDetails).map(currencyLabel),
    },
    programs,
    fees,
    scholarships,
    documents: uniqueStrings(raw.documents),
    deadlines: {
      application: text(deadlines.application) || '2027 deadline confirmed before application',
      startDate: text(deadlines.startDate) || intake[0] || '2027 intake planning',
    },
    notes: uniqueStrings(raw.notes),
    badges: uniqueStrings(raw.badges),
    ...(text(raw.logo) ? { logo: text(raw.logo) } : {}),
    isActive: raw.isActive !== false,
    ...(text(raw.officialUrl) ? { officialUrl: text(raw.officialUrl) } : {}),
    relationshipType: text(raw.relationshipEvidenceUrl)
      ? (raw.relationshipType as CleanUniversityRecord['relationshipType'] || 'unverified')
      : 'unverified',
    ...(text(raw.relationshipEvidenceUrl) ? { relationshipEvidenceUrl: text(raw.relationshipEvidenceUrl) } : {}),
    ...(text(raw.recognitionAuthority) ? { recognitionAuthority: text(raw.recognitionAuthority) } : {}),
    ...(text(raw.recognitionSourceUrl) ? { recognitionSourceUrl: text(raw.recognitionSourceUrl) } : {}),
    sourceUrls,
    ...(lastVerifiedAt ? { lastVerifiedAt } : {}),
    ...(verificationExpiresAt ? { verificationExpiresAt } : {}),
    verificationStatus: verificationIsCurrent ? 'verified' : raw.verificationStatus === 'expired' ? 'expired' : 'under_verification',
    ...(dateString(raw.createdAt) ? { createdAt: dateString(raw.createdAt) } : {}),
    ...(dateString(raw.updatedAt) ? { updatedAt: dateString(raw.updatedAt) } : {}),
  };
}

export const getUniversityRecords = cache(async (country?: string): Promise<CleanUniversityRecord[]> => {
  await connectDB();
  const query: Record<string, unknown> = { isActive: true };
  if (country) query.country = { $regex: `^${country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
  const records = await University.find(query).sort({ name: 1 }).lean();
  return records.map(record => cleanUniversityRecord(record as unknown as RawRecord));
});

export const getUniversityRoute = cache(async (slug: string) => {
  await connectDB();
  const normalizedSlug = slug.toLowerCase();
  const record = await University.findOne({
    isActive: true,
    $or: [{ slug: normalizedSlug }, { legacySlugs: normalizedSlug }],
  }).lean();
  if (!record) return null;
  const clean = cleanUniversityRecord(record as unknown as RawRecord);
  return { record: clean, isLegacySlug: clean.slug !== normalizedSlug };
});

export const getUniversityRouteSlugs = cache(async () => {
  await connectDB();
  const records = await University.find({ isActive: true }, 'slug legacySlugs').lean();
  return records.flatMap(record => [record.slug, ...(record.legacySlugs || [])]).filter(Boolean);
});

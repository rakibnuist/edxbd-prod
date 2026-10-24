import 'server-only';
/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy database fields are normalized into CleanUniversityRecord here. */
import { cache } from 'react';
import prisma from '@/lib/prisma';

export type CleanUniversityRecord = {
  id: string;
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
  publishedRankings?: { publisher: string; rank: string; scope: 'world' | 'national' | 'subject'; subject?: string }[];
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
  costPlans: { id: string; title: string; programName?: string; scholarshipTitle?: string; intake?: string; currency: string; tuitionBeforeScholarship?: string; scholarshipValue?: string; tuitionAfterScholarship?: string; applicationFee?: string; hostel?: string; insurance?: string; medical?: string; visa?: string; travel?: string; living?: string; serviceFee?: string; otherCosts: string[]; totalEstimate?: string; notes: string[]; sourceUrl?: string; lastVerifiedAt?: string; isPublished: boolean }[];
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

// Utility to parse JSON safely
const parseJson = (str: string | null | undefined, defaultVal: any = []) => {
  if (!str) return defaultVal;
  try { return JSON.parse(str); } catch { return defaultVal; }
};

// Utility to parse CSV strings
const parseCsv = (str: string | null | undefined) => {
  if (!str) return [];
  return Array.from(new Set(str.split(',').map(value => value.trim()).filter(Boolean)));
};

const normalizedKey = (...values: Array<string | null | undefined>) => values
  .map(value => (value || '').trim().toLowerCase().replace(/\s+/g, ' '))
  .join('|');

const dedupeBy = <T,>(items: T[], keyFor: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = keyFor(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// Map Prisma output to CleanUniversityRecord
function mapPrismaToClean(record: any): CleanUniversityRecord {
  type CleanProgram = CleanUniversityRecord['programs'][number];
  type CleanFee = CleanUniversityRecord['fees'][number];
  type CleanScholarship = CleanUniversityRecord['scholarships'][number];

  const programs: CleanUniversityRecord['programs'] = dedupeBy<CleanProgram>(
    record.programs.map((p: any): CleanProgram => ({
      level: p.level?.trim() || 'Program',
      name: p.name?.trim() || 'Study option',
      subject: p.subject?.trim() || undefined,
      languages: parseCsv(p.languages),
      duration: p.duration?.trim() || undefined,
      intakes: parseCsv(p.intakes),
      tuition: p.tuition?.trim() || undefined,
      tuitionAfterScholarship: p.tuitionAfterScholarship?.trim() || undefined,
      applicationDeadline: p.applicationDeadline?.trim() || undefined,
      eligibility: Array.from(new Set(parseJson(p.eligibility, []).map((value: string) => value.trim()).filter(Boolean))),
      sourceUrl: p.sourceUrl?.trim() || undefined,
      status: ['active', 'planned', 'paused'].includes(p.status) ? p.status : 'active',
    })),
    program => normalizedKey(program.level, program.name, program.tuition, program.applicationDeadline),
  );

  const fees: CleanUniversityRecord['fees'] = dedupeBy<CleanFee>(
    record.fees.map((f: any): CleanFee => ({
      item: f.item?.trim() || 'Additional fee',
      cost: f.cost?.trim() || 'Confirmed in the written cost plan',
      notes: f.notes?.trim() || undefined,
      recipient: f.recipient?.trim() || undefined,
      refundable: ['yes', 'no', 'conditional'].includes(f.refundable) ? f.refundable : '',
      validFor: f.validFor?.trim() || undefined,
      sourceUrl: f.sourceUrl?.trim() || undefined,
    })),
    fee => normalizedKey(fee.item, fee.cost, fee.validFor),
  );

  const scholarships: CleanUniversityRecord['scholarships'] = dedupeBy<CleanScholarship>(
    record.scholarships.map((s: any): CleanScholarship => ({
      title: s.title?.trim() || 'Scholarship option',
      type: s.type?.trim() || undefined,
      details: Array.from(new Set(parseJson(s.details, []).map((value: string) => value.trim()).filter(Boolean))),
      amount: s.amount?.trim() || undefined,
      condition: s.condition?.trim() || undefined,
      eligiblePrograms: Array.from(new Set(parseJson(s.eligiblePrograms, []).map((value: string) => value.trim()).filter(Boolean))),
      coverage: s.coverage?.trim() || undefined,
      renewal: s.renewal?.trim() || undefined,
      deadline: s.deadline?.trim() || undefined,
      sourceUrl: s.sourceUrl?.trim() || undefined,
      status: ['active', 'planned', 'closed'].includes(s.status) ? s.status : 'planned',
    })),
    scholarship => normalizedKey(scholarship.title, scholarship.type, scholarship.amount, scholarship.deadline),
  );

  return {
    id: record.id,
    slug: record.slug,
    legacySlugs: parseJson(record.legacySlugs, []),
    name: record.name,
    aliases: parseJson(record.aliases, []),
    location: record.location,
    country: record.country,
    city: record.city,
    intake: parseCsv(record.intake),
    degree: parseCsv(record.degree),
    taught: parseCsv(record.taught),
    rankings: {
      country: record.rankingCountry ?? undefined,
      world: record.rankingWorld ?? undefined,
      national: record.rankingNational ?? undefined,
    },
    details: {
      majors: parseCsv(record.majors),
      tuition: record.tuition,
      tuitionDetails: parseJson(record.tuitionDetails, []),
    },
    programs,
    fees,
    scholarships,
    costPlans: record.costPlans.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      programName: plan.programName || undefined,
      scholarshipTitle: plan.scholarshipTitle || undefined,
      intake: plan.intake || undefined,
      currency: plan.currency,
      tuitionBeforeScholarship: plan.tuitionBeforeScholarship || undefined,
      scholarshipValue: plan.scholarshipValue || undefined,
      tuitionAfterScholarship: plan.tuitionAfterScholarship || undefined,
      applicationFee: plan.applicationFee || undefined,
      hostel: plan.hostel || undefined,
      insurance: plan.insurance || undefined,
      medical: plan.medical || undefined,
      visa: plan.visa || undefined,
      travel: plan.travel || undefined,
      living: plan.living || undefined,
      serviceFee: plan.serviceFee || undefined,
      otherCosts: parseJson(plan.otherCosts, []),
      totalEstimate: plan.totalEstimate || undefined,
      notes: parseJson(plan.notes, []),
      sourceUrl: plan.sourceUrl || undefined,
      lastVerifiedAt: plan.lastVerifiedAt?.toISOString(),
      isPublished: plan.isPublished,
    })),
    documents: parseJson(record.documents, []),
    deadlines: {
      application: record.deadlineApplication ?? '',
      startDate: record.deadlineStartDate ?? '',
    },
    notes: parseJson(record.notes, []),
    badges: parseJson(record.badges, []),
    logo: record.logo ?? undefined,
    isActive: record.isActive,
    officialUrl: record.officialUrl ?? undefined,
    relationshipType: record.relationshipType as any,
    relationshipEvidenceUrl: record.relationshipEvidenceUrl ?? undefined,
    recognitionAuthority: record.recognitionAuthority ?? undefined,
    recognitionSourceUrl: record.recognitionSourceUrl ?? undefined,
    sourceUrls: parseJson(record.sourceUrls, []),
    lastVerifiedAt: record.lastVerifiedAt ? record.lastVerifiedAt.toISOString() : undefined,
    verificationExpiresAt: record.verificationExpiresAt ? record.verificationExpiresAt.toISOString() : undefined,
    verificationStatus: record.verificationStatus as any,
    createdAt: record.createdAt ? record.createdAt.toISOString() : undefined,
    updatedAt: record.updatedAt ? record.updatedAt.toISOString() : undefined,
  };
}

export const getUniversityRecords = cache(async (country?: string): Promise<CleanUniversityRecord[]> => {
  const whereClause: any = { isActive: true };
  if (country) {
    whereClause.country = { contains: country }; // SQLite doesn't have insensitive regex easily, but contains works for exact matches usually or we can rely on slug.
  }
  
  const records = await prisma.university.findMany({
    where: whereClause,
    orderBy: { name: 'asc' },
    include: {
      programs: true,
      fees: true,
      scholarships: true,
      costPlans: true,
    }
  });

  // Filter country case-insensitively in JS if necessary for SQLite
  let filtered = records;
  if (country) {
    const lower = country.toLowerCase();
    filtered = records.filter(r => r.country.toLowerCase() === lower);
  }

  return filtered.map(mapPrismaToClean);
});

export const getUniversityRoute = cache(async (slug: string) => {
  const normalizedSlug = slug.toLowerCase();
  
  // Need to search by slug or legacySlugs
  // SQLite Prisma doesn't support JSON querying in where, so we just fetch all slugs and filter.
  // Actually, since slug is indexed, we'll try slug first.
  let record = await prisma.university.findFirst({
    where: { isActive: true, slug: normalizedSlug },
    include: { programs: true, fees: true, scholarships: true, costPlans: true }
  });

  let isLegacySlug = false;

  if (!record) {
    // Fallback: fetch all active and check legacySlugs in memory (only 68 records, so it's fast)
    const all = await prisma.university.findMany({
      where: { isActive: true },
      include: { programs: true, fees: true, scholarships: true, costPlans: true }
    });
    
    record = all.find(r => {
      const legacy = parseJson(r.legacySlugs, []) as string[];
      return legacy.includes(normalizedSlug);
    }) || null;
    
    if (record) isLegacySlug = true;
  }

  if (!record) return null;
  return { record: mapPrismaToClean(record), isLegacySlug };
});

export const getUniversityRouteSlugs = cache(async () => {
  const records = await prisma.university.findMany({
    where: { isActive: true },
    select: { slug: true, legacySlugs: true }
  });
  
  return records.flatMap(r => {
    const legacy = parseJson(r.legacySlugs, []) as string[];
    return [r.slug, ...legacy];
  }).filter(Boolean);
});

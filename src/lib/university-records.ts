import 'server-only';
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

// Utility to parse JSON safely
const parseJson = (str: string | null | undefined, defaultVal: any = []) => {
  if (!str) return defaultVal;
  try { return JSON.parse(str); } catch { return defaultVal; }
};

// Utility to parse CSV strings
const parseCsv = (str: string | null | undefined) => {
  if (!str) return [];
  return str.split(',').filter(Boolean);
};

// Map Prisma output to CleanUniversityRecord
function mapPrismaToClean(record: any): CleanUniversityRecord {
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
    programs: record.programs.map((p: any) => ({
      level: p.level,
      name: p.name,
      subject: p.subject ?? undefined,
      languages: parseCsv(p.languages),
      duration: p.duration ?? undefined,
      intakes: parseCsv(p.intakes),
      tuition: p.tuition ?? undefined,
      tuitionAfterScholarship: p.tuitionAfterScholarship ?? undefined,
      applicationDeadline: p.applicationDeadline ?? undefined,
      eligibility: parseJson(p.eligibility, []),
      sourceUrl: p.sourceUrl ?? undefined,
      status: p.status as any,
    })),
    fees: record.fees.map((f: any) => ({
      item: f.item,
      cost: f.cost,
      notes: f.notes ?? undefined,
      recipient: f.recipient ?? undefined,
      refundable: f.refundable as any,
      validFor: f.validFor ?? undefined,
      sourceUrl: f.sourceUrl ?? undefined,
    })),
    scholarships: record.scholarships.map((s: any) => ({
      title: s.title,
      type: s.type ?? undefined,
      details: parseJson(s.details, []),
      amount: s.amount ?? undefined,
      condition: s.condition ?? undefined,
      eligiblePrograms: parseJson(s.eligiblePrograms, []),
      coverage: s.coverage ?? undefined,
      renewal: s.renewal ?? undefined,
      deadline: s.deadline ?? undefined,
      sourceUrl: s.sourceUrl ?? undefined,
      status: s.status as any,
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
    include: { programs: true, fees: true, scholarships: true }
  });

  let isLegacySlug = false;

  if (!record) {
    // Fallback: fetch all active and check legacySlugs in memory (only 68 records, so it's fast)
    const all = await prisma.university.findMany({
      where: { isActive: true },
      include: { programs: true, fees: true, scholarships: true }
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

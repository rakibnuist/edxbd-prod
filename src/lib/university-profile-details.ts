import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import type { UniversityProfileDetail, UniversityProfileFee, UniversityProgramDetail } from '@/types/university-profile';

const stringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
const feeKeys = new Set(['tuition', 'application', 'deposit', 'housing', 'insurance', 'medical', 'residence', 'other']);
const feePeriods = new Set(['programme', 'semester', 'year', 'month', 'oneoff', 'day']);

function publicFee(value: unknown): UniversityProfileFee | null {
  if (!value || typeof value !== 'object') return null;
  const fee = value as Record<string, unknown>;
  if (typeof fee.key !== 'string' || !feeKeys.has(fee.key) || typeof fee.item !== 'string'
    || typeof fee.currency !== 'string' || typeof fee.period !== 'string' || !feePeriods.has(fee.period)
    || (fee.stage !== 'before_china' && fee.stage !== 'in_china')
    || (fee.amount !== undefined && (typeof fee.amount !== 'number' || !Number.isFinite(fee.amount) || fee.amount < 0))) return null;
  return {
    key: fee.key as UniversityProfileFee['key'], item: fee.item, currency: fee.currency,
    period: fee.period as UniversityProfileFee['period'], stage: fee.stage,
    ...(typeof fee.amount === 'number' ? { amount: fee.amount } : {}),
    ...(typeof fee.notes === 'string' ? { notes: fee.notes } : {}),
    ...(typeof fee.displayAmount === 'string' ? { displayAmount: fee.displayAmount } : {}),
    ...(typeof fee.optional === 'boolean' ? { optional: fee.optional } : {}),
    ...(fee.creditToward === 'tuition' || fee.creditToward === 'housing' ? { creditToward: fee.creditToward } : {}),
  };
}

function publicProgram(value: unknown): UniversityProgramDetail | null {
  if (!value || typeof value !== 'object') return null;
  const program = value as Record<string, unknown>;
  if (!['id', 'name', 'level', 'duration'].every(key => typeof program[key] === 'string')
    || !['languages', 'qualifications', 'languageRequirements', 'documents', 'notes'].every(key => stringArray(program[key]))
    || !Array.isArray(program.fees)) return null;
  const fees = program.fees.map(publicFee);
  if (fees.some(fee => fee === null)) return null;
  // Whitelist each public field. Source files, links and internal maintenance records never reach clients.
  const result: UniversityProgramDetail = {
    id: program.id as string, name: program.name as string, level: program.level as string,
    languages: program.languages as string[], duration: program.duration as string,
    qualifications: program.qualifications as string[], languageRequirements: program.languageRequirements as string[],
    documents: program.documents as string[], notes: program.notes as string[], fees: fees as UniversityProfileFee[],
  };
  for (const key of ['periodLabel', 'intake', 'deadline', 'campus', 'school', 'progression'] as const) {
    if (typeof program[key] === 'string') result[key] = program[key];
  }
  if (stringArray(program.scholarships)) result.scholarships = program.scholarships;
  return result;
}

function publicScholarship(value: unknown): UniversityScholarshipOption | null {
  if (!value || typeof value !== 'object') return null;
  const award = value as Record<string, unknown>;
  if (!['id', 'title', 'type'].every(key => typeof award[key] === 'string')
    || !['levels', 'coverage', 'conditions', 'renewal', 'documents', 'applicationSteps', 'notes'].every(key => stringArray(award[key]))
    || !['open', 'closed', 'confirm'].includes(String(award.status))) return null;
  const result: UniversityScholarshipOption = {
    id: award.id as string, title: award.title as string, type: award.type as string,
    levels: award.levels as string[], coverage: award.coverage as string[], conditions: award.conditions as string[],
    renewal: award.renewal as string[], documents: award.documents as string[], applicationSteps: award.applicationSteps as string[],
    status: award.status as UniversityScholarshipOption['status'], notes: award.notes as string[],
  };
  for (const key of ['languages', 'programNames', 'programIds'] as const) {
    if (stringArray(award[key])) result[key] = award[key];
  }
  for (const key of ['cycle', 'deadline', 'stipend'] as const) {
    if (typeof award[key] === 'string') result[key] = award[key];
  }
  if (Array.isArray(award.feeWaivers) && award.feeWaivers.every(item => item === 'housing' || item === 'insurance')) {
    result.feeWaivers = award.feeWaivers as ('housing' | 'insurance')[];
  }
  if (award.tuitionReduction && typeof award.tuitionReduction === 'object') {
    const reduction = award.tuitionReduction as Record<string, unknown>;
    if ((reduction.type === 'percent' || reduction.type === 'fixed') && typeof reduction.value === 'number'
      && Number.isFinite(reduction.value) && reduction.value >= 0 && (reduction.type !== 'percent' || reduction.value <= 100)
      && (reduction.period === undefined || ['year', 'semester', 'programme'].includes(String(reduction.period)))) {
      result.tuitionReduction = { type: reduction.type, value: reduction.value,
        ...(typeof reduction.currency === 'string' ? { currency: reduction.currency } : {}),
        ...(reduction.period ? { period: reduction.period as 'year' | 'semester' | 'programme' } : {}),
      };
    }
  }
  return result;
}

export const getAllUniversityProfileDetails = cache(async (): Promise<UniversityProfileDetail[]> => {
  try {
    const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
    if (!record?.isPublished) return [];
    const parsed: unknown = JSON.parse(record.contentJson);
    if (!parsed || typeof parsed !== 'object' || !('universities' in parsed) || !Array.isArray(parsed.universities)) return [];
    return parsed.universities.flatMap((value: unknown) => {
      if (!value || typeof value !== 'object') return [];
      const profile = value as Record<string, unknown>;
      if (typeof profile.slug !== 'string' || typeof profile.overview !== 'string' || !Array.isArray(profile.programs)) return [];
      const programs = profile.programs.map(publicProgram);
      if (programs.some(program => program === null)) return [];
      const scholarshipOptions = Array.isArray(profile.scholarshipOptions) ? profile.scholarshipOptions.map(publicScholarship).filter((award): award is UniversityScholarshipOption => award !== null) : undefined;
      const highlights = Array.isArray(profile.highlights) ? profile.highlights.flatMap(value => {
        if (!value || typeof value !== 'object') return [];
        const highlight = value as Record<string, unknown>;
        return typeof highlight.title === 'string' && typeof highlight.description === 'string'
          ? [{ title: highlight.title, description: highlight.description }] : [];
      }) : [];
      return [{ slug: profile.slug, overview: profile.overview, programs: programs as UniversityProgramDetail[], ...(highlights.length ? { highlights } : {}), ...(scholarshipOptions?.length ? { scholarshipOptions } : {}) }];
    });
  } catch (error) {
    console.warn('University programme information unavailable:', error instanceof Error ? error.name : 'Unknown error');
    return [];
  }
});

export const getUniversityProfileDetails = cache(async (slug: string): Promise<UniversityProfileDetail | null> => {
  const profiles = await getAllUniversityProfileDetails();
  return profiles.find(profile => profile.slug === slug) ?? null;
});

import 'server-only';
/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma relation records are normalized at this database boundary. */

import type { IUniversity, IUniversityCostPlan, IUniversityFee, IUniversityProgram, IUniversityScholarship } from '@/types/university';

export const universityAdminInclude = {
  programs: true,
  fees: true,
  scholarships: true,
  costPlans: true,
} as const;

const parseJson = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

const csv = (value: string | null | undefined) => value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];
const strings = (value: unknown) => Array.isArray(value) ? Array.from(new Set(value.map(item => String(item).trim()).filter(Boolean))) : [];
const joinCsv = (value: unknown) => strings(value).join(',');
const jsonStrings = (value: unknown) => JSON.stringify(strings(value));
const optional = (value: unknown) => String(value || '').trim() || null;

const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const dedupe = <T,>(items: T[], key: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter(item => {
    const normalized = key(item).trim().toLowerCase().replace(/\s+/g, ' ');
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

export function serializeUniversity(record: any): IUniversity {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    location: record.location,
    country: record.country,
    city: record.city,
    intake: csv(record.intake),
    degree: csv(record.degree),
    taught: csv(record.taught),
    rankings: { country: record.rankingCountry ?? undefined, world: record.rankingWorld ?? undefined, national: record.rankingNational ?? undefined },
    details: { majors: csv(record.majors), tuition: record.tuition, tuitionDetails: parseJson(record.tuitionDetails, []) },
    programs: (record.programs || []).map((program: any): IUniversityProgram => ({
      id: program.id,
      level: program.level,
      name: program.name,
      subject: program.subject || undefined,
      languages: csv(program.languages),
      duration: program.duration || undefined,
      intakes: csv(program.intakes),
      tuition: program.tuition || undefined,
      tuitionAfterScholarship: program.tuitionAfterScholarship || undefined,
      applicationDeadline: program.applicationDeadline || undefined,
      eligibility: parseJson(program.eligibility, []),
      sourceUrl: program.sourceUrl || undefined,
      status: ['active', 'planned', 'paused'].includes(program.status) ? program.status : 'active',
    })),
    fees: (record.fees || []).map((fee: any): IUniversityFee => ({
      id: fee.id,
      item: fee.item,
      cost: fee.cost,
      notes: fee.notes || undefined,
      recipient: fee.recipient || undefined,
      refundable: ['yes', 'no', 'conditional'].includes(fee.refundable) ? fee.refundable : '',
      validFor: fee.validFor || undefined,
      sourceUrl: fee.sourceUrl || undefined,
    })),
    scholarships: (record.scholarships || []).map((scholarship: any): IUniversityScholarship => ({
      id: scholarship.id,
      title: scholarship.title,
      type: scholarship.type || undefined,
      details: parseJson(scholarship.details, []),
      amount: scholarship.amount || undefined,
      condition: scholarship.condition || undefined,
      eligiblePrograms: parseJson(scholarship.eligiblePrograms, []),
      coverage: scholarship.coverage || undefined,
      renewal: scholarship.renewal || undefined,
      deadline: scholarship.deadline || undefined,
      sourceUrl: scholarship.sourceUrl || undefined,
      status: ['active', 'planned', 'closed'].includes(scholarship.status) ? scholarship.status : 'planned',
    })),
    costPlans: (record.costPlans || []).map((plan: any): IUniversityCostPlan => ({
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
      lastVerifiedAt: plan.lastVerifiedAt || undefined,
      isPublished: plan.isPublished,
    })),
    documents: parseJson(record.documents, []),
    deadlines: { application: record.deadlineApplication || '', startDate: record.deadlineStartDate || '' },
    notes: parseJson(record.notes, []),
    badges: parseJson(record.badges, []),
    logo: record.logo || undefined,
    isActive: record.isActive,
    officialUrl: record.officialUrl || undefined,
    aliases: parseJson(record.aliases, []),
    legacySlugs: parseJson(record.legacySlugs, []),
    relationshipType: record.relationshipType,
    relationshipEvidenceUrl: record.relationshipEvidenceUrl || undefined,
    recognitionAuthority: record.recognitionAuthority || undefined,
    recognitionSourceUrl: record.recognitionSourceUrl || undefined,
    sourceUrls: parseJson(record.sourceUrls, []),
    lastVerifiedAt: record.lastVerifiedAt || undefined,
    verificationExpiresAt: record.verificationExpiresAt || undefined,
    verificationStatus: record.verificationStatus,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function universityWriteData(body: Partial<IUniversity>, includeRelations = true) {
  const programs = dedupe((body.programs || []).filter(program => program.name?.trim()), program => [program.level, program.name, program.tuition, program.applicationDeadline].join('|'));
  const fees = dedupe((body.fees || []).filter(fee => fee.item?.trim()), fee => [fee.item, fee.cost, fee.validFor].join('|'));
  const scholarships = dedupe((body.scholarships || []).filter(scholarship => scholarship.title?.trim()), scholarship => [scholarship.title, scholarship.type, scholarship.amount, scholarship.deadline].join('|'));
  const costPlans = dedupe((body.costPlans || []).filter(plan => plan.title?.trim()), plan => [plan.title, plan.programName, plan.scholarshipTitle, plan.intake].join('|'));

  const scalar = {
    slug: String(body.slug || '').trim(),
    name: String(body.name || '').trim(),
    location: String(body.location || body.city || '').trim(),
    country: String(body.country || '').trim(),
    city: String(body.city || '').trim(),
    intake: joinCsv(body.intake),
    degree: joinCsv(body.degree),
    taught: joinCsv(body.taught),
    rankingCountry: body.rankings?.country || null,
    rankingWorld: body.rankings?.world || null,
    rankingNational: body.rankings?.national || null,
    majors: joinCsv(body.details?.majors),
    tuition: String(body.details?.tuition || '').trim(),
    tuitionDetails: jsonStrings(body.details?.tuitionDetails),
    documents: jsonStrings(body.documents),
    deadlineApplication: optional(body.deadlines?.application),
    deadlineStartDate: optional(body.deadlines?.startDate),
    notes: jsonStrings(body.notes),
    badges: jsonStrings(body.badges),
    logo: optional(body.logo),
    isActive: body.isActive !== false,
    officialUrl: optional(body.officialUrl),
    aliases: jsonStrings(body.aliases),
    legacySlugs: jsonStrings(body.legacySlugs),
    relationshipType: body.relationshipType || 'unverified',
    relationshipEvidenceUrl: optional(body.relationshipEvidenceUrl),
    recognitionAuthority: optional(body.recognitionAuthority),
    recognitionSourceUrl: optional(body.recognitionSourceUrl),
    sourceUrls: jsonStrings(body.sourceUrls),
    lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
    verificationExpiresAt: dateOrNull(body.verificationExpiresAt),
    verificationStatus: body.verificationStatus || 'under_verification',
  };

  if (!includeRelations) return scalar;
  return {
    ...scalar,
    programs: { deleteMany: {}, create: programs.map(program => ({
      level: program.level || 'Program', name: program.name.trim(), subject: optional(program.subject), languages: joinCsv(program.languages),
      duration: optional(program.duration), intakes: joinCsv(program.intakes), tuition: optional(program.tuition), tuitionAfterScholarship: optional(program.tuitionAfterScholarship),
      applicationDeadline: optional(program.applicationDeadline), eligibility: jsonStrings(program.eligibility), sourceUrl: optional(program.sourceUrl), status: program.status || 'active',
    })) },
    fees: { deleteMany: {}, create: fees.map(fee => ({
      item: fee.item.trim(), cost: fee.cost?.trim() || 'Prepared in the written cost plan', notes: optional(fee.notes), recipient: optional(fee.recipient),
      refundable: fee.refundable || '', validFor: optional(fee.validFor), sourceUrl: optional(fee.sourceUrl),
    })) },
    scholarships: { deleteMany: {}, create: scholarships.map(scholarship => ({
      title: scholarship.title.trim(), type: optional(scholarship.type), details: jsonStrings(scholarship.details), amount: optional(scholarship.amount),
      condition: optional(scholarship.condition), eligiblePrograms: jsonStrings(scholarship.eligiblePrograms), coverage: optional(scholarship.coverage),
      renewal: optional(scholarship.renewal), deadline: optional(scholarship.deadline), sourceUrl: optional(scholarship.sourceUrl), status: scholarship.status || 'planned',
    })) },
    costPlans: { deleteMany: {}, create: costPlans.map(plan => ({
      title: plan.title.trim(), programName: optional(plan.programName), scholarshipTitle: optional(plan.scholarshipTitle), intake: optional(plan.intake),
      currency: plan.currency?.trim() || 'CNY', tuitionBeforeScholarship: optional(plan.tuitionBeforeScholarship), scholarshipValue: optional(plan.scholarshipValue),
      tuitionAfterScholarship: optional(plan.tuitionAfterScholarship), applicationFee: optional(plan.applicationFee), hostel: optional(plan.hostel),
      insurance: optional(plan.insurance), medical: optional(plan.medical), visa: optional(plan.visa), travel: optional(plan.travel), living: optional(plan.living),
      serviceFee: optional(plan.serviceFee), otherCosts: jsonStrings(plan.otherCosts), totalEstimate: optional(plan.totalEstimate), notes: jsonStrings(plan.notes),
      sourceUrl: optional(plan.sourceUrl), lastVerifiedAt: dateOrNull(plan.lastVerifiedAt), isPublished: plan.isPublished === true,
    })) },
  };
}

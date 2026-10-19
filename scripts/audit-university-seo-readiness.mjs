import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { universityIsIndexable, universityVerificationErrors } from '../src/lib/university-governance.ts';
import { universityProfileSeo } from '../src/lib/university-profile-seo.ts';

const prisma = new PrismaClient();
const slug = process.argv[2] || 'nuist';
const parse = (value, fallback = []) => { try { return JSON.parse(value); } catch { return fallback; } };

try {
  const [university, profiles] = await Promise.all([
    prisma.university.findUnique({ where: { slug }, include: { programs: true, fees: true, scholarships: true, costPlans: true } }),
    prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } }),
  ]);
  if (!university) throw new Error(`University not found: ${slug}`);
  const record = {
    ...university,
    aliases: parse(university.aliases), sourceUrls: parse(university.sourceUrls),
    programs: university.programs,
    fees: university.fees,
    scholarships: university.scholarships,
    costPlans: university.costPlans,
  };
  const profile = profiles?.isPublished ? parse(profiles.contentJson, {}).universities?.find(item => item.slug === slug) : null;
  console.log(JSON.stringify({
    slug,
    canonical: universityProfileSeo(record).canonical,
    title: universityProfileSeo(record).title,
    verificationStatus: university.verificationStatus,
    indexable: universityIsIndexable(record),
    recognitionAuthority: university.recognitionAuthority,
    recognitionSourceUrl: university.recognitionSourceUrl,
    lastVerifiedAt: university.lastVerifiedAt,
    verificationExpiresAt: university.verificationExpiresAt,
    linkedOfficialSources: record.sourceUrls.length,
    legacyProgramCounts: Object.fromEntries(['active', 'planned', 'paused'].map(status => [status, university.programs.filter(item => item.status === status).length])),
    publicCataloguePrograms: profile?.programs?.length || 0,
    publicScholarshipOptions: profile?.scholarshipOptions?.length || 0,
    cmsVerificationBlockers: universityVerificationErrors({ ...record, verificationStatus: 'verified' }),
    reviewDecision: 'A source check does not complete the required education/compliance review. No status or data was changed by this audit.',
  }, null, 2));
} finally {
  await prisma.$disconnect();
}

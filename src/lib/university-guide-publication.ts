import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { universityGuideIsIndexable } from './university-guide-indexing';
import { universityIsIndexable } from './university-governance';

export const getIndexableUniversityGuides = cache(async (): Promise<Set<string>> => {
  try {
    const campaign = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
    if (!campaign?.isPublished) return new Set();
    const payload = JSON.parse(campaign.contentJson);
    if (!Array.isArray(payload.universities)) return new Set();
    return new Set(payload.universities.filter((profile: unknown) => universityGuideIsIndexable(profile)).map((profile: { slug: string }) => profile.slug));
  } catch { return new Set(); }
});

/** Both sitemap formats use the same eligibility decision as profile metadata. */
export const getIndexableUniversitySitemapRecords = cache(async () => {
  const [records, guides] = await Promise.all([
    prisma.university.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true, verificationStatus: true, officialUrl: true, sourceUrls: true, lastVerifiedAt: true, verificationExpiresAt: true } }),
    getIndexableUniversityGuides(),
  ]);
  return records.filter(record => guides.has(record.slug) || universityIsIndexable(record));
});

import prisma from '@/lib/prisma';
import { sitemapResponse } from '@/lib/sitemap-xml';
import { getUniversityRecords } from '@/lib/university-records';
import { chinaCities } from '@/lib/city-pages';

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      where: { 
        isActive: true, 
        verificationStatus: 'verified', 
        officialUrl: { not: null },
        lastVerifiedAt: { not: null },
        verificationExpiresAt: { gte: new Date() },
        AND: [{ sourceUrls: { not: '[]' } }],
      },
      select: { slug: true, updatedAt: true }
    });
    const cities = chinaCities(await getUniversityRecords('China'));
    return sitemapResponse([
      ...universities.map((university) => ({
        loc: `https://eduexpressint.com/universities/${university.slug}`,
        lastmod: university.updatedAt?.toISOString()
      })),
      ...cities.map((city) => ({ loc: `https://eduexpressint.com/china-universities/${city.slug}` })),
    ]);
  } catch {
    return sitemapResponse([]);
  }
}

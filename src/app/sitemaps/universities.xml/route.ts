import { sitemapResponse } from '@/lib/sitemap-xml';
import { getIndexableUniversitySitemapRecords } from '@/lib/university-guide-publication';
import { getUniversityRecords } from '@/lib/university-records';
import { chinaCities } from '@/lib/city-pages';

export async function GET() {
  try {
    const universities = await getIndexableUniversitySitemapRecords();
    const cities = chinaCities(await getUniversityRecords('China'));
    return sitemapResponse([
      ...universities.map((university) => ({
        loc: `https://eduexpressint.com/universities/${university.slug}`,
        lastmod: university.updatedAt?.toISOString(),
      })),
      ...cities.map((city) => ({ loc: `https://eduexpressint.com/china-universities/${city.slug}` })),
    ]);
  } catch {
    return sitemapResponse([]);
  }
}

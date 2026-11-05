import { sitemapResponse } from '@/lib/sitemap-xml';
import { getIndexableUniversitySitemapRecords } from '@/lib/university-guide-publication';

export async function GET() {
  try {
    const universities = await getIndexableUniversitySitemapRecords();
    return sitemapResponse(universities.map((university) => ({ 
      loc: `https://eduexpressint.com/universities/${university.slug}`, 
      lastmod: university.updatedAt?.toISOString() 
    })));
  } catch {
    return sitemapResponse([]);
  }
}

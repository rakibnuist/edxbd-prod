import { sitemapResponse } from '@/lib/sitemap-xml';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const published = { isPublished: true };
    const [all, china] = await Promise.all([
      prisma.testimonial.count({ where: published }),
      prisma.testimonial.count({ where: { ...published, country: { contains: 'China' } } }),
    ]);
    return sitemapResponse([
      ...(all ? [{ loc: 'https://eduexpressint.com/success-stories' }] : []),
      ...(china ? [{ loc: 'https://eduexpressint.com/china-success-stories' }] : []),
    ]);
  } catch {
    return sitemapResponse([]);
  }
}

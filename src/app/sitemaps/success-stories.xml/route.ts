import { sitemapResponse } from '@/lib/sitemap-xml';
import prisma from '@/lib/prisma';
import { publicTestimonialWhere } from '@/lib/testimonial-visibility';

export async function GET() {
  try {
    const published = publicTestimonialWhere();
    const [all, china] = await Promise.all([
      prisma.testimonial.count({ where: published }),
      prisma.testimonial.count({ where: { AND: [published, { country: { contains: 'China' } }] } }),
    ]);
    return sitemapResponse([
      ...(all ? [{ loc: 'https://eduexpressint.com/success-stories' }] : []),
      ...(china ? [{ loc: 'https://eduexpressint.com/china-success-stories' }] : []),
    ]);
  } catch {
    return sitemapResponse([]);
  }
}

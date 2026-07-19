import prisma from '@/lib/prisma';
import { sitemapResponse } from '@/lib/sitemap-xml';

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      where: { 
        isActive: true, 
        verificationStatus: 'verified', 
        verificationExpiresAt: { gte: new Date() } 
      },
      select: { slug: true, updatedAt: true }
    });
    return sitemapResponse(universities.map((university) => ({ 
      loc: `https://eduexpressint.com/universities/${university.slug}`, 
      lastmod: university.updatedAt?.toISOString() 
    })));
  } catch {
    return sitemapResponse([]);
  }
}


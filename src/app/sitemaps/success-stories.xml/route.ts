import { sitemapResponse } from '@/lib/sitemap-xml';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const currentConsent = {
      isPublished: true,
      consentVerified: true,
      consentImageApproved: true,
      consentEvidenceId: { not: null },
      consentRecordedAt: { not: null },
      consentRevokedAt: null,
      image: { not: null },
      OR: [{ consentExpiresAt: null }, { consentExpiresAt: { gte: new Date() } }],
    };
    const [all, china] = await Promise.all([
      prisma.testimonial.count({ where: currentConsent }),
      prisma.testimonial.count({ where: { ...currentConsent, country: { contains: 'China' } } }),
    ]);
    return sitemapResponse([
      ...(all ? [{ loc: 'https://eduexpressint.com/success-stories' }] : []),
      ...(china ? [{ loc: 'https://eduexpressint.com/china-success-stories' }] : []),
    ]);
  } catch {
    return sitemapResponse([]);
  }
}

import connectDB from '@/lib/mongodb';
import University from '@/models/University';
import { sitemapResponse } from '@/lib/sitemap-xml';

export async function GET() {
  try {
    await connectDB();
    const universities = await University.find({ isActive: true, verificationStatus: 'verified', verificationExpiresAt: { $gte: new Date() } }, 'slug updatedAt').lean();
    return sitemapResponse(universities.map((university) => ({ loc: `https://eduexpressint.com/universities/${university.slug}`, lastmod: university.updatedAt?.toISOString() })));
  } catch {
    return sitemapResponse([]);
  }
}

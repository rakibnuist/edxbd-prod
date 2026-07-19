import { MetadataRoute } from 'next';
import { activeCountries } from '@/lib/countries';
import prisma from '@/lib/prisma';
import { evidencePages } from '@/data/evidencePages';

// PHASE 0 FIX:
// - baseUrl moved to apex domain (www redirects -> canonical mismatch before)
// - added /services, /updates, /partnership to static routes
// - added published update posts (/updates/[slug]) so Google & AI crawlers
//   discover every article
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eduexpressint.com';

  // Static routes
  const routes = [
    '',
    '/about',
    '/destinations',
    '/universities',
    '/services',
    '/updates',
    '/partnership',
    '/contact',
    '/education-fit-assessment',
    ...Object.keys(evidencePages).map((slug) => `/${slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/education-fit-assessment' ? 0.9 : 0.8,
  }));

  // Dynamic routes (Countries)
  const countryRoutes = activeCountries.map((country) => ({
    url: `${baseUrl}/destinations/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  try {
    // Universities
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });
    const universityRoutes = universities.map((uni) => ({
      url: `${baseUrl}/universities/${uni.slug}`,
      lastModified: uni.updatedAt ? new Date(uni.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Published updates/articles
    const updates = await prisma.content.findMany({
      where: { type: 'update', isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true }
    });
    const updateRoutes = updates.map((post) => ({
    url: `${baseUrl}/updates/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

    return [...routes, ...countryRoutes, ...universityRoutes, ...updateRoutes];
  } catch (error) {
    console.warn('Sitemap generated without database routes:', error);
    return [...routes, ...countryRoutes];
  }
}

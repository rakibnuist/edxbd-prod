import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { evidencePages } from '@/data/evidencePages';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { sitemapStaticRouteSlugs } from '@/data/staticRoutePages';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { categoriesFromUpdate, categorySlug } from '@/lib/update-categories';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';
import { getIndexableUniversitySitemapRecords } from '@/lib/university-guide-publication';

// PHASE 0 FIX:
// - baseUrl moved to apex domain (www redirects -> canonical mismatch before)
// - added /services, /updates, /partnership to static routes
// - added published update posts (/updates/[slug]) so Google & AI crawlers
//   discover every article
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eduexpressint.com';

  // Static routes
  const staticPaths = Array.from(new Set([
    '',
    '/about',
    '/destinations',
    '/find-education',
    '/your-study-journey',
    '/scholarships',
    '/universities',
    '/services',
    '/updates',
    '/partnership',
    '/contact',
    '/education-fit-assessment',
    '/china-march-2027-intake',
    '/for-parents',
    '/proof-library',
    // Pages served by a hand-built route under src/app/
    ...sitemapStaticRouteSlugs.map((slug) => `/${slug}`),
    // Pages served by app/[slug] from the two data files
    ...Object.keys(evidencePages)
      .filter((slug) => !slug.includes('/'))
      .map((slug) => `/${slug}`),
    ...Object.keys(chinaGuidePages).map((slug) => `/${slug}`),
  ]));
  const routes = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/education-fit-assessment' ? 0.9 : 0.8,
  }));

  // Dynamic routes (Countries)
  const countryRoutes: MetadataRoute.Sitemap = activeCountries
    .filter((country) => country.slug !== 'china')
    .map((country) => ({
    url: `${baseUrl}${destinationPath(country.slug)}`,
    lastModified: new Date('2026-08-24'),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  try {
    // Universities
    const universities = await getIndexableUniversitySitemapRecords();
    const universityRoutes = universities.map((uni) => ({
      url: `${baseUrl}/universities/${uni.slug}`,
      lastModified: uni.updatedAt ? new Date(uni.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    // Published updates/articles
    const updates = await prisma.content.findMany({
      where: { type: { in: ['update', 'article'] }, archivedAt: null, ...currentVisibleContentWhere() },
      select: { slug: true, updatedAt: true, publishedAt: true, category: true, categories: true }
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

    // Category archives, derived from the same rows (no extra query)
    const categoryPaths = Array.from(new Set(
      updates
        .flatMap(post => categoriesFromUpdate(post))
        .map(label => categorySlug(label)),
    ));
    const categoryRoutes: MetadataRoute.Sitemap = categoryPaths.map((slug) => ({
      url: `${baseUrl}/updates/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...countryRoutes, ...universityRoutes, ...updateRoutes, ...categoryRoutes];
  } catch (error) {
    console.warn('Sitemap generated without database routes:', error);
    return [...routes, ...countryRoutes];
  }
}

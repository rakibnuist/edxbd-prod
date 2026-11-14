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
import { DESTINATION_PHOTOS } from '@/components/destinations/DestinationCover';
import { programSegments } from '@/lib/program-segments';
import { chinaCities } from '@/lib/city-pages';
import { getUniversityRecords } from '@/lib/university-records';

const SITE = 'https://eduexpressint.com';
const abs = (src: string) => (src.startsWith('http') ? src : `${SITE}${src}`);

/**
 * Real photos rendered on each static page, listed for Google Images. Only
 * photos that actually appear on the page belong here.
 */
const PAGE_IMAGES: Record<string, string[]> = {
  '': ['/images/home/china-campus-group.webp', '/images/students/departure-family.webp'],
  '/about': ['/images/home/dhanmondi-counselling-team.webp'],
  '/destinations': Object.values(DESTINATION_PHOTOS),
  '/for-parents': ['/images/home/parent-counselling.webp'],
  '/success-stories': ['/images/students/success-banner.webp'],
  '/china-universities': ['/images/students/campus-nuist.webp'],
  '/study-in-china-from-bangladesh': ['/images/real/china_campus/cie_campus_visit.webp'],
  '/china-march-2027-intake': ['/images/home/consultation-family.webp'],
};

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
    '/csc-scholarship-bangladesh',
    '/bn/study-in-china',
    '/programs',
    ...programSegments.map((segment) => `/programs/${segment.slug}`),
    '/compare-costs',
    // Pages served by a hand-built route under src/app/
    ...sitemapStaticRouteSlugs.map((slug) => `/${slug}`),
    // Pages served by app/[slug] from the two data files
    ...Object.keys(evidencePages)
      .filter((slug) => !slug.includes('/'))
      .map((slug) => `/${slug}`),
    ...Object.keys(chinaGuidePages).map((slug) => `/${slug}`),
  ]));
  // Static pages were rebuilt on the shared page kit on this date.
  const STATIC_CONTENT_UPDATED = new Date('2026-11-06');
  const routes = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/education-fit-assessment' ? 0.9 : 0.8,
    ...(PAGE_IMAGES[route] ? { images: PAGE_IMAGES[route].map(abs) } : {}),
  }));

  // Dynamic routes (Countries)
  const countryRoutes: MetadataRoute.Sitemap = activeCountries
    .filter((country) => country.slug !== 'china')
    .map((country) => ({
    url: `${baseUrl}${destinationPath(country.slug)}`,
    lastModified: new Date('2026-11-06'),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
    ...(DESTINATION_PHOTOS[country.slug] ? { images: [abs(DESTINATION_PHOTOS[country.slug])] } : {}),
  }));

  try {
    // Universities
    const universities = await getIndexableUniversitySitemapRecords();
    const universityRoutes = universities.map((uni) => ({
      url: `${baseUrl}/universities/${uni.slug}`,
      lastModified: uni.updatedAt ? new Date(uni.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      ...(uni.logo ? { images: [abs(uni.logo)] } : {}),
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

    // China city landing pages, built from the same university records
    const cityRoutes: MetadataRoute.Sitemap = chinaCities(await getUniversityRecords('China')).map((city) => ({
      url: `${baseUrl}/china-universities/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    return [...routes, ...countryRoutes, ...universityRoutes, ...cityRoutes, ...updateRoutes, ...categoryRoutes];
  } catch (error) {
    console.warn('Sitemap generated without database routes:', error);
    return [...routes, ...countryRoutes];
  }
}

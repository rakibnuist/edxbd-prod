import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { evidencePages } from '@/data/evidencePages';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { sitemapStaticRouteSlugs, staticRouteGuides } from '@/data/staticRoutePages';
import { getIndexableUpdatesForSitemap } from '@/lib/content-records';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';
import { getIndexableUniversitySitemapRecords } from '@/lib/university-guide-publication';
import { DESTINATION_PHOTOS } from '@/components/destinations/DestinationCover';
import { programSegments } from '@/lib/program-segments';
import { chinaCities } from '@/lib/city-pages';
import { getUniversityRecords } from '@/lib/university-records';
import { publicTestimonialWhere } from '@/lib/testimonial-visibility';

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
  '/bangladesh-study-abroad-market': ['/images/home/consultation-family.webp'],
};

// PHASE 0 FIX:
// - baseUrl moved to apex domain (www redirects -> canonical mismatch before)
// - added /services, /updates, /partnership to static routes
// - added published update posts (/updates/[slug]) so Google & AI crawlers
//   discover every article
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eduexpressint.com';

  // Static routes
  const staticPaths = Array.from(new Set([
    '',
    '/about',
    '/press',
    '/destinations',
    '/find-education',
    '/your-study-journey',
    '/scholarships',
    '/universities',
    '/apply',
    '/services',
    '/b2b',
    '/updates',
    '/partnership',
    '/contact',
    '/education-fit-assessment',
    '/china-march-2027-intake',
    '/for-parents',
    '/proof-library',
    '/csc-scholarship-bangladesh',
    '/china-study-report-bangladesh',
    '/bangladesh-study-abroad-market',
    '/bn/bangladesh-study-abroad-market',
    '/bn/study-in-china',
    '/bn/china-student-visa-bangladesh',
    '/bn/study-in-china-cost-bangladesh',
    '/bn/csc-scholarship-bangladesh',
    '/bn/mbbs-in-china-bangladesh',
    '/bn/csca-exam-bangladesh',
    '/bn/study-in-china-after-ssc-dakhil',
    '/uk-study-cost-bangladesh',
    '/finland-study-cost-bangladesh',
    '/hungary-study-cost-bangladesh',
    '/south-korea-study-cost-bangladesh',
    '/malaysia-study-cost-bangladesh',
    '/malaysia-student-visa-bangladesh',
    '/study-in-malaysia-after-o-level',
    '/study-in-china-after-o-level-ssc',
    '/compare-bachelor-china-abroad-bangladesh',
    '/bangladesh-vs-china-bachelor-study',
    '/bangladesh-vs-china-mbbs',
    '/bangladesh-vs-study-abroad-countries',
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
  const NOVEMBER_MID_UPDATED = new Date('2026-11-15');
  const novemberMidPaths = new Set([
    '',
    '/about',
    '/apply',
    '/b2b',
    '/compare-costs',
    '/contact',
    '/education-fit-assessment',
    '/fees-and-transparency',
    '/find-education',
    '/for-parents',
    '/partnership',
    '/proof-library',
    '/scholarships',
    '/services',
    '/universities',
    '/your-study-journey',
    '/china-study-report-bangladesh',
    '/education-consultant-dhaka',
    '/study-in-china-from-bangladesh',
    '/china-intakes-deadlines',
    '/china-march-2027-intake',
    '/csc-scholarship-bangladesh',
    '/bn/study-in-china',
    '/bn/china-student-visa-bangladesh',
    '/bn/study-in-china-cost-bangladesh',
    '/bn/csc-scholarship-bangladesh',
    '/bn/mbbs-in-china-bangladesh',
    '/bn/csca-exam-bangladesh',
    '/study-in-malaysia-from-bangladesh',
    '/study-in-uk-from-bangladesh',
    '/study-in-hungary-from-bangladesh',
    '/study-in-south-korea-from-bangladesh',
    '/study-in-finland-from-bangladesh',
    '/study-in-malta-from-bangladesh',
    '/study-in-cyprus-from-bangladesh',
    '/study-in-georgia-from-bangladesh',
    '/study-in-greece-from-bangladesh',
    '/study-in-croatia-from-bangladesh',
    '/study-in-thailand-from-bangladesh',
    '/uk-study-cost-bangladesh',
    '/finland-study-cost-bangladesh',
    '/hungary-study-cost-bangladesh',
    '/south-korea-study-cost-bangladesh',
    '/malaysia-study-cost-bangladesh',
    '/malaysia-student-visa-bangladesh',
    '/study-in-malaysia-after-o-level',
    '/study-in-china-after-o-level-ssc',
    '/compare-bachelor-china-abroad-bangladesh',
    '/bangladesh-vs-china-bachelor-study',
    '/bangladesh-vs-china-mbbs',
    '/bangladesh-vs-study-abroad-countries',
    '/programs',
    ...programSegments.map((segment) => `/programs/${segment.slug}`),
    '/china-universities',
    '/updates',
  ]);
  const routes = staticPaths.map((route) => {
    const slug = route.replace(/^\//, '');
    const evidenceReviewedAt = evidencePages[slug]?.reviewedAt;
    const guideDate = slug in staticRouteGuides ? staticRouteGuides[slug] : undefined;
    const lastModified = evidenceReviewedAt
      ? new Date(evidenceReviewedAt)
      : slug in staticRouteGuides
        ? guideDate
          ? new Date(guideDate)
          : undefined
        : slug in chinaGuidePages
          ? undefined
          : route === '/study-in-malaysia-after-o-level' ||
              route === '/study-in-china-after-o-level-ssc' ||
              route === '/compare-bachelor-china-abroad-bangladesh' ||
              route === '/bangladesh-vs-china-bachelor-study' ||
              route === '/bangladesh-vs-study-abroad-countries' ||
              route === '/bn/study-in-china-after-ssc-dakhil' ||
              route === '/bangladesh-study-abroad-market' ||
              route === '/bn/bangladesh-study-abroad-market' ||
              route === '/press'
            ? new Date('2026-11-21')
            : route === '/b2b' || route === '/partnership'
              ? new Date('2026-11-20')
              : novemberMidPaths.has(route)
                ? NOVEMBER_MID_UPDATED
                : STATIC_CONTENT_UPDATED;
    return {
      url: `${baseUrl}${route}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : route === '/education-fit-assessment' ? 0.9 : 0.8,
      ...(PAGE_IMAGES[route] ? { images: PAGE_IMAGES[route].map(abs) } : {}),
    };
  });

  // Dynamic routes (Countries)
  const countryRoutes: MetadataRoute.Sitemap = activeCountries
    .filter((country) => country.slug !== 'china')
    .map((country) => ({
    url: `${baseUrl}${destinationPath(country.slug)}`,
    lastModified: NOVEMBER_MID_UPDATED,
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
    // Published updates/articles and category archives (shared with /sitemaps/guides.xml)
    const { updates, categorySlugs } = await getIndexableUpdatesForSitemap();
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

    const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
      url: `${baseUrl}/updates/category/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // China city landing pages, built from the same university records
    const cityRoutes: MetadataRoute.Sitemap = chinaCities(await getUniversityRecords('China')).map((city) => ({
      url: `${baseUrl}/china-universities/${city.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));

    const publishedTestimonials = publicTestimonialWhere();
    const [allStoriesCount, chinaStoriesCount] = await Promise.all([
      prisma.testimonial.count({ where: publishedTestimonials }),
      prisma.testimonial.count({
        where: { AND: [publishedTestimonials, { country: { contains: 'China' } }] },
      }),
    ]);
    const storyRoutes: MetadataRoute.Sitemap = [
      ...(allStoriesCount > 0
        ? [
            {
              url: `${baseUrl}/success-stories`,
              lastModified: NOVEMBER_MID_UPDATED,
              changeFrequency: 'weekly' as const,
              priority: 0.75,
              ...(PAGE_IMAGES['/success-stories']
                ? { images: PAGE_IMAGES['/success-stories'].map(abs) }
                : {}),
            },
          ]
        : []),
      ...(chinaStoriesCount > 0
        ? [
            {
              url: `${baseUrl}/china-success-stories`,
              lastModified: NOVEMBER_MID_UPDATED,
              changeFrequency: 'weekly' as const,
              priority: 0.75,
            },
          ]
        : []),
    ];

    return [...routes, ...countryRoutes, ...universityRoutes, ...cityRoutes, ...updateRoutes, ...categoryRoutes, ...storyRoutes];
  } catch (error) {
    console.warn('Sitemap generated without database routes:', error);
    return [...routes, ...countryRoutes];
  }
}

// Slugs owned by a hand-built route under src/app/.
//
// In the Next.js App Router a static segment always beats the [slug] catch-all,
// so a slug listed here must not also be pre-rendered by app/[slug]. A static
// route can still reuse the shared chinaGuidePages record; the static wrapper
// remains the single route owner, while its content has one shared data source.
//
// Values are recorded content review dates used for sitemap <lastmod>. New
// routes without a recorded review date omit it rather than inventing one.
export const staticRouteGuides: Record<string, string | undefined> = {
  'china-universities': '2026-07-19',
  'china-student-visa-bangladesh': '2026-07-19',
  'study-in-china-cost-bangladesh': '2026-07-19',
  'study-in-china-without-ielts': '2026-07-19',
  'mbbs-in-china-bangladesh': '2026-07-19',
  'china-intakes-deadlines': '2026-07-19',
  'life-in-china-bangladeshi-students': '2026-07-19',
  'study-in-china-from-bangladesh': '2026-07-19',
  'china-admission-requirements': undefined,
};

// Non-guide pages that also own their slug via a static route.
export const staticRoutePages: Record<string, string> = {
  'fees-and-transparency': '2026-07-19',
  'education-consultant-dhaka': '2026-07-19',
};

// Pages that own a static route but must NOT be listed in the main sitemap,
// because they set their own robots directive at request time. Listing them
// unconditionally would advertise a URL that may be noindex.
//   china-success-stories -> robots.index is false until a consented China
//   story exists; sitemaps/success-stories.xml adds it conditionally instead.
export const conditionallyIndexedStaticRoutes: Record<string, string> = {
  'china-success-stories': '2026-07-19',
};

// Every slug served by a hand-built route rather than app/[slug]. Use this to
// keep dead entries out of the catch-all.
export const staticRouteSlugs = [
  ...Object.keys(staticRouteGuides),
  ...Object.keys(staticRoutePages),
  ...Object.keys(conditionallyIndexedStaticRoutes),
];

// Safe to list unconditionally in the main sitemap.
export const sitemapStaticRouteSlugs = [
  ...Object.keys(staticRouteGuides),
  ...Object.keys(staticRoutePages),
];

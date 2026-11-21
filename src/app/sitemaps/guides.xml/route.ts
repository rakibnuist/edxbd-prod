import { evidencePages } from '@/data/evidencePages';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { staticRouteGuides } from '@/data/staticRoutePages';
import { getIndexableUpdatesForSitemap } from '@/lib/content-records';
import { sitemapResponse } from '@/lib/sitemap-xml';

export const revalidate = 300;

// Guide URLs come from four owners. Each URL appears exactly once, and each
// owner is the single source of truth for its own pages:
//   - staticRouteGuides    : slugs in staticRoutePages.ts with hand-built routes
//   - handbuiltStaticGuides: standalone campaign/destination guides under src/app/
//   - chinaGuidePages      : slugs rendered via ChinaGuidePage
//   - evidencePages        : slugs rendered via app/[slug] as an evidence page
const handbuiltStaticGuides = new Set([
  'csc-scholarship-bangladesh',
  'china-march-2027-intake',
  'malaysia-study-cost-bangladesh',
  'malaysia-student-visa-bangladesh',
  'study-in-malaysia-after-o-level',
  'study-in-china-after-o-level-ssc',
  'compare-bachelor-china-abroad-bangladesh',
  'bangladesh-vs-china-bachelor-study',
  'bangladesh-vs-study-abroad-countries',
  'bn/china-student-visa-bangladesh',
  'bn/study-in-china-cost-bangladesh',
  'bn/csc-scholarship-bangladesh',
  'bn/mbbs-in-china-bangladesh',
  'bn/csca-exam-bangladesh',
  'bn/study-in-china-after-ssc-dakhil',
  'bn/bangladesh-study-abroad-market',
]);

const handbuiltLastmod: Record<string, string> = {
  'csc-scholarship-bangladesh': '2026-11-15',
  'china-march-2027-intake': '2026-11-15',
  'malaysia-study-cost-bangladesh': '2026-11-15',
  'malaysia-student-visa-bangladesh': '2026-11-15',
  'study-in-malaysia-after-o-level': '2026-11-21',
  'study-in-china-after-o-level-ssc': '2026-11-21',
  'compare-bachelor-china-abroad-bangladesh': '2026-11-21',
  'bangladesh-vs-china-bachelor-study': '2026-11-21',
  'bangladesh-vs-study-abroad-countries': '2026-11-21',
  'bn/china-student-visa-bangladesh': '2026-11-15',
  'bn/study-in-china-cost-bangladesh': '2026-11-15',
  'bn/csc-scholarship-bangladesh': '2026-11-15',
  'bn/mbbs-in-china-bangladesh': '2026-11-15',
  'bn/csca-exam-bangladesh': '2026-11-15',
  'bn/study-in-china-after-ssc-dakhil': '2026-11-21',
  'bn/bangladesh-study-abroad-market': '2026-11-21',
};

const guideSlugs = [
  'china-universities',
  'china-scholarships-bangladesh',
  'china-admission-requirements',
  'china-student-visa-bangladesh',
  'study-in-china-cost-bangladesh',
  'study-in-china-without-ielts',
  'mbbs-in-china-bangladesh',
  'china-intakes-deadlines',
  'life-in-china-bangladeshi-students',
  'china-visa-first-policy',
  'csc-scholarship-bangladesh',
  'china-march-2027-intake',
  'malaysia-study-cost-bangladesh',
  'malaysia-student-visa-bangladesh',
  'study-in-malaysia-after-o-level',
  'study-in-china-after-o-level-ssc',
  'compare-bachelor-china-abroad-bangladesh',
  'bangladesh-vs-china-bachelor-study',
  'bangladesh-vs-study-abroad-countries',
  'bn/china-student-visa-bangladesh',
  'bn/study-in-china-cost-bangladesh',
  'bn/csc-scholarship-bangladesh',
  'bn/mbbs-in-china-bangladesh',
  'bn/csca-exam-bangladesh',
  'bn/study-in-china-after-ssc-dakhil',
  'bn/bangladesh-study-abroad-market',
];

export async function GET() {
  const staticEntries = guideSlugs
    .filter(
      slug =>
        slug in staticRouteGuides ||
        handbuiltStaticGuides.has(slug) ||
        slug in chinaGuidePages ||
        slug in evidencePages,
    )
    .map(slug => ({
      loc: `https://eduexpressint.com/${slug}`,
      lastmod:
        slug in staticRouteGuides
          ? staticRouteGuides[slug]
          : handbuiltStaticGuides.has(slug)
            ? handbuiltLastmod[slug]
            : slug in chinaGuidePages
              ? undefined
              : evidencePages[slug]?.reviewedAt,
    }));

  try {
    const { updates, categorySlugs } = await getIndexableUpdatesForSitemap();
    const updateEntries = updates.map(post => ({
      loc: `https://eduexpressint.com/updates/${post.slug}`,
      lastmod: (post.updatedAt ?? post.publishedAt)?.toISOString().slice(0, 10),
    }));
    const categoryEntries = categorySlugs.map(slug => ({
      loc: `https://eduexpressint.com/updates/category/${slug}`,
    }));
    return sitemapResponse([...staticEntries, ...updateEntries, ...categoryEntries]);
  } catch {
    return sitemapResponse(staticEntries);
  }
}

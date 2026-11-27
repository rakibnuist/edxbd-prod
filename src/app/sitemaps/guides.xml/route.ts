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
  'uk-student-visa-bangladesh',
  'hungary-student-visa-bangladesh',
  'south-korea-student-visa-bangladesh',
  'finland-student-visa-bangladesh',
  'malta-student-visa-bangladesh',
  'cyprus-student-visa-bangladesh',
  'georgia-student-visa-bangladesh',
  'greece-student-visa-bangladesh',
  'croatia-student-visa-bangladesh',
  'thailand-student-visa-bangladesh',
  'hungary-scholarships-bangladesh',
  'south-korea-scholarships-bangladesh',
  'uk-scholarships-bangladesh',
  'finland-scholarships-bangladesh',
  'malaysia-scholarships-bangladesh',
  'study-abroad-without-ielts-from-bangladesh',
  'bmdc-recognized-medical-colleges-abroad',
  'document-attestation-apostille-bangladesh',
  'study-gap-acceptable-countries-bangladesh',
  'student-visa-bank-solvency-bangladesh',
  'uk-study-cost-bangladesh',
  'hungary-study-cost-bangladesh',
  'finland-study-cost-bangladesh',
  'south-korea-study-cost-bangladesh',
  'malta-study-cost-bangladesh',
  'cyprus-study-cost-bangladesh',
  'georgia-study-cost-bangladesh',
  'greece-study-cost-bangladesh',
  'croatia-study-cost-bangladesh',
  'thailand-study-cost-bangladesh',
  'bangladesh-vs-china-mbbs',
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
  'bn/study-in-malaysia-from-bangladesh',
]);

const handbuiltLastmod: Record<string, string> = {
  'csc-scholarship-bangladesh': '2026-11-15',
  'china-march-2027-intake': '2026-11-15',
  'malaysia-study-cost-bangladesh': '2026-11-15',
  'malaysia-student-visa-bangladesh': '2026-11-15',
  'uk-student-visa-bangladesh': '2026-11-27',
  'hungary-student-visa-bangladesh': '2026-11-27',
  'south-korea-student-visa-bangladesh': '2026-11-27',
  'finland-student-visa-bangladesh': '2026-11-27',
  'malta-student-visa-bangladesh': '2026-11-27',
  'cyprus-student-visa-bangladesh': '2026-11-27',
  'georgia-student-visa-bangladesh': '2026-11-27',
  'greece-student-visa-bangladesh': '2026-11-27',
  'croatia-student-visa-bangladesh': '2026-11-27',
  'thailand-student-visa-bangladesh': '2026-11-27',
  'hungary-scholarships-bangladesh': '2026-11-27',
  'south-korea-scholarships-bangladesh': '2026-11-27',
  'uk-scholarships-bangladesh': '2026-11-27',
  'finland-scholarships-bangladesh': '2026-11-27',
  'malaysia-scholarships-bangladesh': '2026-11-27',
  'study-abroad-without-ielts-from-bangladesh': '2026-11-27',
  'bmdc-recognized-medical-colleges-abroad': '2026-11-27',
  'document-attestation-apostille-bangladesh': '2026-11-27',
  'study-gap-acceptable-countries-bangladesh': '2026-11-27',
  'student-visa-bank-solvency-bangladesh': '2026-11-27',
  'uk-study-cost-bangladesh': '2026-11-27',
  'hungary-study-cost-bangladesh': '2026-11-27',
  'finland-study-cost-bangladesh': '2026-11-27',
  'south-korea-study-cost-bangladesh': '2026-11-27',
  'malta-study-cost-bangladesh': '2026-11-27',
  'cyprus-study-cost-bangladesh': '2026-11-27',
  'georgia-study-cost-bangladesh': '2026-11-27',
  'greece-study-cost-bangladesh': '2026-11-27',
  'croatia-study-cost-bangladesh': '2026-11-27',
  'thailand-study-cost-bangladesh': '2026-11-27',
  'bangladesh-vs-china-mbbs': '2026-11-27',
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
  'bn/study-in-malaysia-from-bangladesh': '2026-11-28',
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
  'uk-student-visa-bangladesh',
  'hungary-student-visa-bangladesh',
  'south-korea-student-visa-bangladesh',
  'finland-student-visa-bangladesh',
  'malta-student-visa-bangladesh',
  'cyprus-student-visa-bangladesh',
  'georgia-student-visa-bangladesh',
  'greece-student-visa-bangladesh',
  'croatia-student-visa-bangladesh',
  'thailand-student-visa-bangladesh',
  'hungary-scholarships-bangladesh',
  'south-korea-scholarships-bangladesh',
  'uk-scholarships-bangladesh',
  'finland-scholarships-bangladesh',
  'malaysia-scholarships-bangladesh',
  'study-abroad-without-ielts-from-bangladesh',
  'bmdc-recognized-medical-colleges-abroad',
  'document-attestation-apostille-bangladesh',
  'study-gap-acceptable-countries-bangladesh',
  'student-visa-bank-solvency-bangladesh',
  'uk-study-cost-bangladesh',
  'hungary-study-cost-bangladesh',
  'finland-study-cost-bangladesh',
  'south-korea-study-cost-bangladesh',
  'malta-study-cost-bangladesh',
  'cyprus-study-cost-bangladesh',
  'georgia-study-cost-bangladesh',
  'greece-study-cost-bangladesh',
  'croatia-study-cost-bangladesh',
  'thailand-study-cost-bangladesh',
  'bangladesh-vs-china-mbbs',
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
  'bn/study-in-malaysia-from-bangladesh',
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

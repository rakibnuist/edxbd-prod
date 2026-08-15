import { evidencePages } from '@/data/evidencePages';
import { chinaGuidePages } from '@/data/chinaGuidePages';
import { staticRouteGuides } from '@/data/staticRoutePages';
import { sitemapResponse } from '@/lib/sitemap-xml';

// Guide URLs come from three owners. Each URL appears exactly once, and each
// owner is the single source of truth for its own pages:
//   - staticRoutePages : slugs rendered by a hand-built route under src/app/
//   - chinaGuidePages  : slugs rendered by app/[slug] via ChinaGuidePage
//   - evidencePages    : slugs rendered by app/[slug] as an evidence page
const guideSlugs = [
  'china-universities',
  'china-scholarships-bangladesh',
  'china-student-visa-bangladesh',
  'study-in-china-cost-bangladesh',
  'study-in-china-without-ielts',
  'mbbs-in-china-bangladesh',
  'china-intakes-deadlines',
  'life-in-china-bangladeshi-students',
  'china-visa-first-policy',
];

export function GET() {
  const entries = guideSlugs
    .filter(slug => slug in staticRouteGuides || slug in chinaGuidePages || slug in evidencePages)
    .map(slug => ({
      loc: `https://eduexpressint.com/${slug}`,
      lastmod: evidencePages[slug]?.reviewedAt ?? staticRouteGuides[slug] ?? undefined,
    }));

  return sitemapResponse(entries);
}

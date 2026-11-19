import { evidencePages } from '@/data/evidencePages';
import { sitemapResponse } from '@/lib/sitemap-xml';
import { programSegments } from '@/lib/program-segments';

const evidenceSlugs = [
  'better-education-standard',
  'how-we-verify-universities',
  'student-data-privacy',
  'complaints-and-resolution',
  'compare-study-destinations',
  'country-status',
] as const;

const pages: { path: string; lastmod: string }[] = [
  { path: '/destinations', lastmod: '2026-11-06' },
  ...[
    '',
    '/find-education',
    '/universities',
    '/apply',
    '/programs',
    ...programSegments.map(segment => `/programs/${segment.slug}`),
    '/scholarships',
    '/compare-costs',
    '/your-study-journey',
    '/services',
    '/updates',
    '/education-fit-assessment',
    '/for-parents',
    '/proof-library',
    '/about',
    '/contact',
    '/fees-and-transparency',
  ].map(path => ({ path, lastmod: '2026-11-15' })),
  { path: '/b2b', lastmod: '2026-11-20' },
  { path: '/partnership', lastmod: '2026-11-20' },
  ...evidenceSlugs.map(slug => ({
    path: `/${slug}`,
    lastmod: evidencePages[slug]?.reviewedAt ?? '2026-11-15',
  })),
  { path: '/china-study-report-bangladesh', lastmod: '2026-11-15' },
  { path: '/education-consultant-dhaka', lastmod: '2026-11-15' },
];

export function GET() {
  return sitemapResponse(pages.map(({ path, lastmod }) => ({ loc: `https://eduexpressint.com${path}`, lastmod })));
}

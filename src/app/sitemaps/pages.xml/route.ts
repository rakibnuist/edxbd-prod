import { sitemapResponse } from '@/lib/sitemap-xml';
import { programSegments } from '@/lib/program-segments';

const pages = ['', '/find-education', '/destinations', '/universities', '/programs', ...programSegments.map(segment => `/programs/${segment.slug}`), '/scholarships', '/your-study-journey', '/services', '/updates', '/education-fit-assessment', '/for-parents', '/proof-library', '/about', '/contact', '/better-education-standard', '/fees-and-transparency', '/how-we-verify-universities', '/student-data-privacy', '/complaints-and-resolution', '/education-consultant-dhaka', '/compare-study-destinations', '/country-status'];

export function GET() {
  return sitemapResponse(pages.map((path) => ({ loc: `https://eduexpressint.com${path}`, lastmod: '2026-08-24' })));
}

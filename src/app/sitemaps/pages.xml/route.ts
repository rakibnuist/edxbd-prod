import { sitemapResponse } from '@/lib/sitemap-xml';

const pages = ['', '/about', '/services', '/contact', '/universities', '/better-education-standard', '/fees-and-transparency', '/how-we-verify-universities', '/student-data-privacy', '/complaints-and-resolution', '/education-consultant-dhaka', '/compare-study-destinations', '/country-status'];

export function GET() {
  return sitemapResponse(pages.map((path) => ({ loc: `https://eduexpressint.com${path}`, lastmod: '2026-07-19' })));
}

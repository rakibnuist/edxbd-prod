import { sitemapResponse } from '@/lib/sitemap-xml';

export function GET() {
  return sitemapResponse([{ loc: 'https://eduexpressint.com/china-success-stories', lastmod: '2026-07-19' }]);
}

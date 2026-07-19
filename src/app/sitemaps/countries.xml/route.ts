import { sitemapResponse } from '@/lib/sitemap-xml';

export function GET() {
  return sitemapResponse([
    { loc: 'https://eduexpressint.com/study-in-china-from-bangladesh', lastmod: '2026-07-19' },
    { loc: 'https://eduexpressint.com/bn/study-in-china', lastmod: '2026-07-19' },
  ]);
}

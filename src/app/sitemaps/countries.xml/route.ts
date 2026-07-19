import { sitemapResponse } from '@/lib/sitemap-xml';

export function GET() {
  const activeCountries = [
    'uk',
    'hungary',
    'south-korea',
    'finland',
    'malaysia',
    'malta',
    'cyprus',
    'georgia',
    'greece',
    'croatia',
    'thailand',
  ];

  return sitemapResponse([
    { loc: 'https://eduexpressint.com/study-in-china-from-bangladesh', lastmod: '2026-07-19' },
    { loc: 'https://eduexpressint.com/bn/study-in-china', lastmod: '2026-07-19' },
    ...activeCountries.map((slug) => ({
      loc: `https://eduexpressint.com/destinations/${slug}`,
      lastmod: '2026-07-19',
    })),
  ]);
}

import { sitemapResponse } from '@/lib/sitemap-xml';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';

export function GET() {
  return sitemapResponse([
    ...activeCountries.map((country) => ({
      loc: `https://eduexpressint.com${destinationPath(country.slug)}`,
      lastmod: '2026-08-24',
    })),
    { loc: 'https://eduexpressint.com/bn/study-in-china', lastmod: '2026-08-24' },
  ]);
}

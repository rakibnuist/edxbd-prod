import { MetadataRoute } from 'next';
import { activeCountries } from '@/lib/countries';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.eduexpressint.com';

  // Static routes
  const routes = [
    '',
    '/about',
    '/destinations',
    '/contact',
    '/scholarship-assessment',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Countries)
  const countryRoutes = activeCountries.map((country) => ({
    url: `${baseUrl}/destinations/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...countryRoutes];
}

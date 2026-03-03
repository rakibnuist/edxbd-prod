import { MetadataRoute } from 'next';
import { activeCountries } from '@/lib/countries';
import connectDB from '@/lib/mongodb';
import University from '@/models/University';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.eduexpressint.com';

  // Static routes
  const routes = [
    '',
    '/about',
    '/destinations',
    '/universities',
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

  // Fetch Universities
  await connectDB();
  const universities = await University.find({ isActive: true }, 'slug updatedAt').lean();

  const universityRoutes = universities.map((uni) => ({
    url: `${baseUrl}/universities/${uni.slug}`,
    lastModified: uni.updatedAt ? new Date(uni.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...countryRoutes, ...universityRoutes];
}

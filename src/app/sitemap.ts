import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Content from '@/models/Content'
import { countries } from '@/lib/countries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.eduexpressint.com'
  
  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partnership`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Country destination pages
  const countryPages = countries.map(country => ({
    url: `${baseUrl}/destinations/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Service pages
  const servicePages = [
    'scholarship-assistance',
    'visa-application',
    'university-application',
    'ielts-preparation',
    'documentation',
    'pre-departure',
    'post-arrival'
  ].map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic update pages from database - skip during build to prevent DNS issues
  let updatePages: MetadataRoute.Sitemap = [];
  
  // Skip database connection during build to prevent DNS issues
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
    // Use static fallback during build
    updatePages = [
      'scholarships',
      'visa-updates',
      'university-news',
      'events',
      'success-stories'
    ].map(update => ({
      url: `${baseUrl}/updates/${update}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } else {
    try {
      await connectDB();
      const updates = await Content.find({ 
        type: 'update', 
        isPublished: true 
      }).select('slug updatedAt').limit(100);
      
      updatePages = updates.map(update => ({
        url: `${baseUrl}/updates/${update.slug}`,
        lastModified: update.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error('Error fetching updates for sitemap:', error);
      // Fallback to static update pages
      updatePages = [
        'scholarships',
        'visa-updates',
        'university-news',
        'events',
        'success-stories'
      ].map(update => ({
        url: `${baseUrl}/updates/${update}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  }

  // Admin pages (lower priority, not indexed)
  const adminPages = [
    'admin',
    'admin/dashboard',
    'admin/content',
    'admin/testimonials',
    'admin/leads',
    'admin/settings'
  ].map(admin => ({
    url: `${baseUrl}/${admin}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.1,
  }))

  return [
    ...mainPages,
    ...countryPages,
    ...servicePages,
    ...updatePages,
    ...adminPages
  ]
}

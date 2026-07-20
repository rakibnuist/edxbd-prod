import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import UpdatesClient from './UpdatesClient';
import type { Update } from '@/lib/types';

// PHASE 0 FIX: this page now fetches updates on the SERVER and passes them to
// the client component, so every article title/excerpt is present in the HTML
// for Google and AI crawlers (previously the HTML only said "Loading updates...").
// ISR: regenerated at most every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  // PHASE 0 FIX: brand suffix removed — the root layout template appends it
  // (was causing "| EduExpress International | EduExpress International")
  title: 'Latest Study Abroad Updates & News',
  description: 'Stay updated with the latest study abroad news, scholarship opportunities, visa updates, and university announcements. Get expert guidance for your international education journey.',
  keywords: [
    'study abroad updates',
    'scholarship news',
    'visa updates',
    'university announcements',
    'study abroad opportunities',
    'education news',
    'study abroad Bangladesh',
    'international education updates'
  ],
  authors: [{ name: 'EduExpress International' }],
  creator: 'EduExpress International',
  publisher: 'EduExpress International',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Latest Study Abroad Updates & News',
    description: 'Stay updated with the latest study abroad news, scholarship opportunities, visa updates, and university announcements.',
    type: 'website',
    url: '/updates',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Study Abroad Updates & News',
    description: 'Stay updated with the latest study abroad news, scholarship opportunities, visa updates, and university announcements.',
  },
  alternates: {
    // PHASE 0 FIX: relative canonical, resolved against apex metadataBase
    canonical: '/updates',
  },
  other: {
    'geo.region': 'BD-DH',
    'geo.placename': 'Dhaka',
    'geo.position': '23.8103;90.4125',
    'ICBM': '23.8103, 90.4125',
  },
};

const normalizeList = (values: unknown[]) =>
  Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

async function getUpdates(): Promise<{ updates: Update[]; categories: string[] }> {
  try {
    const rawUpdates = await prisma.content.findMany({
      where: { type: 'update', isPublished: true },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const singleCategories = rawUpdates
      .map(u => u.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    const multiCategories = rawUpdates
      .map(u => u.categories ? JSON.parse(u.categories) : [])
      .flat()
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    // Map Prisma models to Update type if needed, specifically id
    const updates = rawUpdates.map(u => ({
      ...u,
      id: u.id, // For backward compatibility with UpdatesClient
      tags: u.tags ? JSON.parse(u.tags) : [],
      categories: u.categories ? JSON.parse(u.categories) : [],
      sourceUrls: u.sourceUrls ? JSON.parse(u.sourceUrls) : [],
    }));

    return {
      // Serialize Mongoose documents (ObjectId, Date) for the client component
      updates: JSON.parse(JSON.stringify(updates)),
      categories: normalizeList([...singleCategories, ...multiCategories]),
    };
  } catch (error) {
    console.error('Error fetching updates server-side:', error);
    // Fall back to empty — the client component will fetch from the API instead
    return { updates: [], categories: [] };
  }
}

export default async function UpdatesPage() {
  const { updates, categories } = await getUpdates();

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': 'https://eduexpressint.com/updates#blog',
        url: 'https://eduexpressint.com/updates',
        name: 'EduExpress Updates',
        description: 'Verified study-abroad updates, intake news and guidance for Bangladeshi students.',
        inLanguage: 'en-BD',
        publisher: { '@id': 'https://eduexpressint.com/#organization' },
        blogPost: updates.slice(0, 20).map((u) => ({
          '@type': 'BlogPosting',
          headline: u.title,
          url: `https://eduexpressint.com/updates/${u.slug}`,
          datePublished: u.publishedAt || u.createdAt,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://eduexpressint.com/updates#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
          { '@type': 'ListItem', position: 2, name: 'Updates', item: 'https://eduexpressint.com/updates' },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <UpdatesClient initialUpdates={updates} initialCategories={categories} />
    </>
  );
}

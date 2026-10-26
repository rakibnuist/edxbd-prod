import { Metadata } from 'next';
import UpdatesClient from './UpdatesClient';
import type { Update } from '@/lib/types';
import { getPublishedUpdates } from '@/lib/content-records';

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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
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
    types: { 'application/rss+xml': '/updates/feed.xml' },
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
    const updates = await getPublishedUpdates();
    const singleCategories = updates
      .map(u => u.category)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');
    const multiCategories = updates
      .map(u => u.categories || [])
      .flat()
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    return {
      updates,
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

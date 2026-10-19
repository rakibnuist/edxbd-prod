import type { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const metadata: Metadata = {
  title: { absolute: 'About EduExpress International | Evidence-First Education Consultancy' },
  description: "Learn how EduExpress applies evidence-first education guidance, clear costs and written proof to overseas study decisions from Dhanmondi, Dhaka.",
  openGraph: {
    title: 'About EduExpress International | Evidence-First Education Consultancy',
    description: 'Better Education. Clear Costs. Written Proof.',
    type: 'website',
    url: 'https://eduexpressint.com/about',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'About EduExpress International | Evidence-First Education Consultancy',
    description: 'Better Education. Clear Costs. Written Proof.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://eduexpressint.com/about',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://eduexpressint.com/about#aboutpage',
      url: 'https://eduexpressint.com/about',
      name: 'About EduExpress International',
      description: 'Evidence-first education consultancy in Dhanmondi, Dhaka — comparing education quality, cost, recognition and career fit with written proof.',
      inLanguage: 'en-BD',
      about: { '@id': 'https://eduexpressint.com/#organization' },
      isPartOf: { '@id': 'https://eduexpressint.com/#organization' },
      breadcrumb: { '@id': 'https://eduexpressint.com/about#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://eduexpressint.com/about#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'About', item: 'https://eduexpressint.com/about' },
      ],
    },
  ],
};

export default async function About() {
  const { team } = await getPublicTrustRecords();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <AboutClient team={team} />
    </>
  );
}

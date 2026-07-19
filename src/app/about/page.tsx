import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About EduExpress International - Your Gateway to Global Education',
  description: "Learn how EduExpress applies evidence-first education guidance, clear costs and written proof to overseas study decisions.",
  keywords: [
    'about eduexpress international',
    'study abroad consultancy bangladesh',
    'education consultant dhaka',
    'international education services',
    'study abroad experience',
    'education consultancy team',
    'overseas education experts',
    'university selection bangladesh',
    'visa support bangladesh',
    'scholarship assistance bangladesh',
    'study abroad success rate',
    'global education consultant'
  ],
  openGraph: {
    title: 'About EduExpress International - Your Gateway to Global Education',
    description: 'Better Education. Clear Costs. Written Proof.',
    type: 'website',
    url: 'https://eduexpressint.com/about',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'About EduExpress International - Your Gateway to Global Education',
    description: 'Better Education. Clear Costs. Written Proof.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://eduexpressint.com/about',
  },
};

export default function About() {
  return <AboutClient />;
}

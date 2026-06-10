import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About EduExpress International - Your Gateway to Global Education',
  description: 'Learn about EduExpress International, Bangladesh\'s trusted study abroad consultancy since 2018. 6+ years of experience, 3,000+ students placed, 98% success rate. Expert guidance for university selection, visa support, and scholarships.',
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
    description: 'Trusted study abroad consultancy since 2018. 3,000+ students placed, 98% success rate. Expert guidance for university selection, visa support, and scholarships.',
    type: 'website',
    url: 'https://www.eduexpressint.com/about',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'About EduExpress International - Your Gateway to Global Education',
    description: 'Trusted study abroad consultancy since 2018. 3,000+ students placed, 98% success rate. Expert guidance for university selection, visa support, and scholarships.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://www.eduexpressint.com/about',
  },
};

export default function About() {
  return <AboutClient />;
}

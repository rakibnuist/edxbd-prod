import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service - EduExpress International',
  description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'service agreement',
    'EduExpress International terms',
    'study abroad terms',
    'education consultancy terms',
    'legal terms',
    'service conditions',
    'user agreement',
    'terms of use'
  ],
  openGraph: {
    title: 'Terms of Service - EduExpress International',
    description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
    type: 'website',
    url: 'https://www.eduexpressint.com/terms',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'Terms of Service - EduExpress International',
    description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://www.eduexpressint.com/terms',
  },
};

export default function Terms() {
  return <TermsClient />;
}

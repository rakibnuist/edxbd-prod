import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
  openGraph: {
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
    title: 'Terms of Service',
    description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
    type: 'website',
    url: 'https://eduexpressint.com/terms',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'Terms of Service',
    description: 'Read the terms and conditions for using EduExpress International services. Our comprehensive terms cover service usage, responsibilities, and legal agreements.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://eduexpressint.com/terms',
  },
};

export default function Terms() {
  return <TermsClient />;
}

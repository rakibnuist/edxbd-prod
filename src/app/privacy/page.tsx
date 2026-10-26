import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how EduExpress International protects your personal information and privacy. Our comprehensive privacy policy covers data collection, usage, and protection practices.',
  keywords: [
    'privacy policy',
    'data protection',
    'personal information',
    'EduExpress International privacy',
    'study abroad privacy',
    'education consultancy privacy',
    'student data protection',
    'GDPR compliance',
    'privacy rights',
    'data security'
  ],
  openGraph: {
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
    title: 'Privacy Policy',
    description: 'Learn how EduExpress International protects your personal information and privacy. Our comprehensive privacy policy covers data collection, usage, and protection practices.',
    type: 'website',
    url: 'https://eduexpressint.com/privacy',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'Privacy Policy',
    description: 'Learn how EduExpress International protects your personal information and privacy. Our comprehensive privacy policy covers data collection, usage, and protection practices.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://eduexpressint.com/privacy',
  },
};

export default function Privacy() {
  return <PrivacyClient />;
}

import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - EduExpress International',
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
    title: 'Privacy Policy - EduExpress International',
    description: 'Learn how EduExpress International protects your personal information and privacy. Our comprehensive privacy policy covers data collection, usage, and protection practices.',
    type: 'website',
    url: 'https://www.eduexpressint.com/privacy',
    siteName: 'EduExpress International',
  },
  twitter: {
    title: 'Privacy Policy - EduExpress International',
    description: 'Learn how EduExpress International protects your personal information and privacy. Our comprehensive privacy policy covers data collection, usage, and protection practices.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://www.eduexpressint.com/privacy',
  },
};

export default function Privacy() {
  return <PrivacyClient />;
}

import { pageMetadata } from '@/lib/seo';
import PrivacyClient from './PrivacyClient';

export const metadata = pageMetadata({
  title: 'Privacy Policy: How We Protect Student Data | EduExpress',
  description:
    'How EduExpress International collects, uses and protects student data and documents, and how to request a copy or deletion of your records at our Dhaka office.',
  path: '/privacy',
});

export default function Privacy() {
  return <PrivacyClient />;
}

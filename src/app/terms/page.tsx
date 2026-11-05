import { pageMetadata } from '@/lib/seo';
import TermsClient from './TermsClient';

export const metadata = pageMetadata({
  title: 'Terms of Service for Study Abroad Counselling | EduExpress',
  description:
    'EduExpress terms of service: free initial evaluation, no file opening fee, China service fee only after visa approval, third-party fees itemised in writing.',
  path: '/terms',
});

export default function Terms() {
  return <TermsClient />;
}

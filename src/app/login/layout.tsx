import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

const base = pageMetadata({
  title: 'Staff Login | EduExpress International',
  description:
    'Internal counsellor and administrator authentication portal for managing verified EduExpress International records in Dhaka.',
  path: '/login',
  noindex: true,
});

export const metadata: Metadata = {
  ...base,
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';
import StudentPortalClient from '@/components/portal/StudentPortalClient';

export const metadata: Metadata = {
  title: { absolute: 'Application Tracking Portal | EduExpress International' },
  robots: { index: false, follow: false, noarchive: true },
};

export default async function StudentTrackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <StudentPortalClient token={token} />;
}

import type { Metadata } from 'next';
import ApplicationTrackerClient from '@/components/admin/ApplicationTrackerClient';

export const metadata: Metadata = {
  title: 'Application Tracker | EduExpress Admin',
  robots: { index: false, follow: false },
};

export default function AdminApplicationsPage() {
  return <ApplicationTrackerClient />;
}

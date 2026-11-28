import { Suspense } from 'react';
import type { Metadata } from 'next';
import ApplicationTrackerClient from '@/components/admin/ApplicationTrackerClient';

export const metadata: Metadata = {
  title: 'Application Tracker | EduExpress Admin',
  robots: { index: false, follow: false },
};

export default function AdminApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
          Loading Application Tracker…
        </div>
      }
    >
      <ApplicationTrackerClient />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamsAdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/users?tab=public');
  }, [router]);

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-[#0f3a5c]">Team &amp; Users Are Unified</h1>
        <p className="mt-2 text-sm text-slate-600">
          Office counselors, CRM logins, and public website bios now live together under{' '}
          <strong>Team &amp; Users</strong>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/admin/users?tab=public"
            className="rounded-lg bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#124b7a]"
          >
            Open Public About Bios →
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Open Office Counselors &amp; Logins
          </Link>
        </div>
      </div>
    </div>
  );
}

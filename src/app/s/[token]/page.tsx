import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Redirecting | EduExpress International' },
  robots: { index: false, follow: false, noarchive: true },
};

export default async function LegacyShortTrackRedirect({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/track/${encodeURIComponent(token)}`);
}

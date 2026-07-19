import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Netherlands Education Service Status',
  description: 'EduExpress does not currently present the Netherlands as an active destination service.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/country-status' },
};

export default function NetherlandsStatusPage() {
  return <main className="min-h-screen bg-slate-950 px-4 pb-20 pt-32 text-white"><div className="mx-auto max-w-3xl"><p className="font-bold uppercase tracking-widest text-amber-300">Service not active</p><h1 className="mt-4 text-5xl font-bold">Netherlands education guidance is under research</h1><p className="mt-6 text-lg leading-8 text-slate-300">EduExpress has not published a verified Netherlands service. We will not accept an application or payment commitment until the destination launch gate passes.</p><Link href="/country-status" className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-950">View country service status</Link></div></main>;
}

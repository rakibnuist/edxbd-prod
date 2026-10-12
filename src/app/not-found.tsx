import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This EduExpress page is unavailable. Continue to verified study options, universities or the Dhanmondi decision desk.',
  robots: { index: false, follow: true, noarchive: true },
};

const recoveryLinks = [
  { href: '/find-education', label: 'Find suitable education', detail: 'Compare options by study fit and destination.', icon: GraduationCap },
  { href: '/universities', label: 'Explore universities', detail: 'Review institutions and verification status.', icon: BookOpen },
  { href: '/contact', label: 'Ask the decision desk', detail: 'Speak with the Dhanmondi team about your next step.', icon: MessageCircle },
];

export default function NotFound() {
  return (
    <main className="min-h-[75vh] bg-[#f7fafc] px-5 pb-20 pt-32 text-[#08263c] sm:px-8 lg:pt-40">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#174f7a]">Error 404</p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight sm:text-7xl">This page is no longer here.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">The address may be outdated or the content may have moved. Use one of the verified paths below, or return to the homepage.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {recoveryLinks.map(({ href, label, detail, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-[#174f7a]/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Icon className="text-[#174f7a]" aria-hidden="true" />
              <h2 className="mt-5 font-heading text-xl font-bold">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#174f7a]">Continue <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>

        <Link href="/" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Return to homepage <ArrowRight size={15} /></Link>
      </div>
    </main>
  );
}

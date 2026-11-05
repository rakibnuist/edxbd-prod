import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign, FileCheck2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const metadata: Metadata = {
  title: { absolute: 'Education Consultant in Dhanmondi, Dhaka | EduExpress International' },
  description: 'Visit EduExpress International in Dhanmondi for education fit guidance, university comparison, complete cost planning and application support.',
  alternates: { canonical: '/education-consultant-dhaka' },
};

const steps = [
  { title: 'Check education fit', copy: 'Start with results, subject, budget and career direction.', icon: ShieldCheck },
  { title: 'Compare complete costs', copy: 'Separate tuition, living, official and service charges.', icon: CircleDollarSign },
  { title: 'Keep written records', copy: 'Understand documents, responsibilities and application actions.', icon: FileCheck2 },
];

export default async function EducationConsultantDhakaPage() {
  const { offices, metrics } = await getPublicTrustRecords();
  const office = offices[0];
  if (!office) return null;
  const schema = {
    '@context': 'https://schema.org', '@type': ['EducationalOrganization', 'LocalBusiness'], '@id': 'https://eduexpressint.com/#organization',
    name: 'EduExpress International', url: 'https://eduexpressint.com/education-consultant-dhaka', telephone: office.phonePrimary, email: office.email,
    address: { '@type': 'PostalAddress', streetAddress: office.address, addressLocality: office.city, postalCode: office.postalCode, addressCountry: 'BD' },
    openingHours: 'Sa-Th 11:00-18:00', priceRange: 'Written cost plan provided',
  };

  return <main className="bg-ed-paper pb-20 pt-[74px] text-ed-ink xl:pt-[106px]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="relative overflow-hidden border-b border-[#12436b]/10 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9fc_100%)] px-5 py-12 sm:px-8 sm:py-14 lg:px-12"><div className="pointer-events-none absolute inset-0 ed-grid-lines-dark opacity-60" aria-hidden="true" /><div className="relative mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1fr_360px] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.16em] text-ed-navy">EduExpress International Bangladesh</p><h1 className="mt-3 max-w-4xl ed-home-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.03em]">Education consultant in Dhanmondi, Dhaka</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">Compare overseas education options, recognition, scholarship conditions and complete costs with a counselor at our Dhanmondi office.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/education-fit-assessment" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-ed-navy px-6 text-sm font-black text-white">Start a free fit assessment <ArrowRight size={15} /></Link><a href={`tel:${office.phonePrimary}`} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[#12436b]/18 bg-white px-6 text-sm font-black"><Phone size={15} /> Call the office</a></div></div><article className="rounded-3xl bg-ed-sand/40 p-6"><MapPin className="text-ed-navy" /><h2 className="mt-4 ed-home-display text-2xl leading-[1.05]">{office.name}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{office.address}</p><p className="mt-3 text-xs font-bold text-ed-navy">{office.hours}</p>{office.mapUrl && <a href={office.mapUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-ed-navy">Open directions <ArrowRight size={13} /></a>}</article></div></header>

    <section className="mt-14 px-5 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1180px]"><h2 className="ed-home-display text-3xl leading-[1.05]">What happens at the decision desk</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{steps.map(({ title, copy, icon: Icon }) => <article key={title} className="rounded-3xl border border-[#12436b]/10 bg-white p-6 shadow-sm"><Icon className="text-ed-navy" /><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></article>)}</div></div></section>

    <section className="mt-14 border-y border-[#12436b]/10 bg-white px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1180px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.15em] text-ed-navy">Database managed evidence</p><h2 className="mt-2 ed-home-display text-3xl leading-[1.05]">Company records with a definition</h2></div><Link href="/proof-library" className="inline-flex items-center gap-2 text-sm font-black text-ed-navy">Open proof library <ArrowRight size={14} /></Link></div><div className="mt-7 grid gap-4 md:grid-cols-3">{metrics.slice(0, 3).map(metric => <article key={metric.id} className="rounded-3xl bg-ed-paper p-6"><strong className="ed-home-display text-4xl text-ed-navy">{metric.value}</strong><h3 className="mt-3 font-black">{metric.label}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{metric.definition}</p></article>)}</div></div></section>

    <section className="px-5 pt-14 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-6 rounded-3xl bg-ed-navy p-7 text-white sm:flex-row sm:items-center"><div><h2 className="ed-home-display text-2xl leading-[1.05]">Parents can join the conversation.</h2><p className="mt-2 text-sm text-white/60">Bring academic results, subject direction and a realistic family budget.</p></div><Link href="/contact?audience=parent" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ed-mist px-5 text-sm font-black text-ed-ink">Book a conversation <ArrowRight size={14} /></Link></div></section>
  </main>;
}

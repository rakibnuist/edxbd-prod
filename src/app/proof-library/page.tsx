import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, FileCheck2, MapPin, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'EduExpress Proof Library | Authorizations, Outcomes and Office Records',
  description: 'Inspect EduExpress company metrics, privacy-safe authorization and admission evidence, student feedback and real office details.',
  alternates: { canonical: '/proof-library' },
  openGraph: {
    title: 'EduExpress Proof Library — Authorizations, Outcomes and Office Records',
    description: 'Inspect privacy-safe authorizations, admission evidence, student feedback and real office records.',
    url: '/proof-library',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — proof library' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduExpress Proof Library — Authorizations, Outcomes and Office Records',
    description: 'Inspect privacy-safe authorizations, admission evidence, student feedback and real office records.',
    images: ['/og-image.jpg'],
  },
};

export default async function ProofLibraryPage() {
  // getPublicTrustRecords applies the complete, fail-closed consent policy.
  // Never query published testimonials independently on a public page.
  const trust = await getPublicTrustRecords();
  const testimonials = trust.testimonials;

  return <main className="bg-ed-paper pb-20 pt-[74px] text-ed-ink xl:pt-[106px]">
    <header className="relative overflow-hidden border-b border-[#12436b]/10 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9fc_100%)] px-5 py-12 sm:px-8 sm:py-14 lg:px-12"><div className="pointer-events-none absolute inset-0 ed-grid-lines-dark opacity-60" aria-hidden="true"></div><div className="relative mx-auto max-w-[1240px]"><nav className="text-xs font-bold text-ed-navy"><Link href="/">Home</Link> / Proof library</nav><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.17em] text-ed-navy">Public evidence register</p><h1 className="mt-3 max-w-4xl ed-home-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.03em]">Trust should be inspectable.</h1><p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">Company records, approved evidence and real student feedback are managed in the central database. Private identifiers never belong on a public page.</p></div><div className="rounded-2xl bg-ed-navy p-5 text-white"><ShieldCheck className="text-ed-mist" /><strong className="mt-4 block">Publication rule</strong><p className="mt-2 text-xs leading-5 text-white/60">No passport number, date of birth, visa identifier or private student record is made public.</p></div></div></div></header>

    <section className="mt-12 px-5 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><h2 className="ed-home-display text-3xl leading-[1.05]">Company records with definitions</h2><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{trust.metrics.map(metric => <article key={metric.id} className="rounded-3xl border border-[#12436b]/10 bg-white p-6 shadow-sm"><strong className="ed-home-display text-5xl text-ed-navy">{metric.value}</strong><h3 className="mt-4 text-lg font-black">{metric.label}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{metric.definition}</p>{metric.evidenceNote && <p className="mt-5 border-t border-[#12436b]/10 pt-4 text-[12px] font-bold leading-5 text-slate-500">{metric.evidenceNote}</p>}</article>)}</div></div></section>

    <section className="mt-16 border-y border-[#12436b]/10 bg-white px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.16em] text-ed-navy">Privacy safe inspection</p><h2 className="mt-2 ed-home-display text-3xl leading-[1.05]">Authorizations and application evidence</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Current institutional records and clearly labelled archive records are shown separately from student identity. Every public outcome preview has been privacy checked.</p></div><span className="text-xs font-bold text-slate-500">{trust.evidence.length} public record{trust.evidence.length === 1 ? '' : 's'}</span></div>{trust.evidence.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{trust.evidence.map(asset => { const archive = asset.type.includes('archive'); return <article key={asset.id} className="overflow-hidden rounded-3xl border border-[#12436b]/10 bg-ed-paper"><div className="relative aspect-[3/4] bg-[#f1f5f9]">{asset.thumbnailUrl ? <Image src={asset.thumbnailUrl} alt={`Privacy safe preview: ${asset.title}`} fill sizes="(max-width:640px) 100vw, 300px" className="object-contain p-3" /> : <div className="grid h-full place-items-center"><FileCheck2 size={46} className="text-ed-navy" /></div>}<span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[12px] font-black uppercase tracking-[.12em] text-white ${archive ? 'bg-[#256994]' : 'bg-[#12436b]'}`}>{archive ? 'Archive record' : 'Public evidence'}</span></div><div className="p-5"><span className="text-[12px] font-black uppercase tracking-[.15em] text-ed-navy">{asset.type.replaceAll('_', ' ')}</span><h3 className="mt-2 ed-home-display text-xl font-bold">{asset.title}</h3>{asset.summary && <p className="mt-3 text-sm leading-6 text-slate-600">{asset.summary}</p>}{asset.university && <Link href={`/universities/${asset.university.slug}`} className="mt-4 block text-xs font-black text-ed-navy">View {asset.university.name}</Link>}<p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700"><ShieldCheck size={14} /> Privacy checked</p></div></article>; })}</div> : <div className="mt-7 rounded-3xl border border-[#12436b]/20 bg-ed-paper p-8"><FileCheck2 className="text-ed-navy" /><h3 className="mt-4 ed-home-display text-2xl leading-[1.05]">Inspect privacy safe records at the Dhanmondi decision desk.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Admission notices, JW201 or JW202 records and authorization documents may contain sensitive identifiers. EduExpress shows an approved redacted copy publicly or arranges a controlled office inspection.</p><Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-ed-navy">Arrange an inspection <ArrowRight size={14} /></Link></div>}</div></section>

    {testimonials.length > 0 && <section className="px-5 py-14 sm:px-8 lg:px-12"><div className="mx-auto max-w-[1240px]"><div className="flex items-center gap-3"><MessageSquareQuote className="text-ed-navy" /><h2 className="ed-home-display text-3xl leading-[1.05]">Published student feedback</h2></div><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{testimonials.map(item => <blockquote key={item.id} className="rounded-3xl border border-[#12436b]/10 bg-white p-6 shadow-sm"><p className="text-sm leading-7 text-slate-600">“{item.content}”</p><footer className="mt-5 border-t border-[#12436b]/10 pt-4"><strong className="text-sm">{item.displayName || item.studentName}</strong><span className="mt-1 block text-xs text-slate-500">{[item.university, item.country].filter(Boolean).join(', ')}</span></footer></blockquote>)}</div></div></section>}

    {trust.offices[0] && <section className="px-5 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1240px] gap-6 rounded-3xl bg-ed-navy p-7 text-white lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex gap-4">{trust.offices[0].photoUrl ? <Image src={trust.offices[0].photoUrl} alt={trust.offices[0].name} width={112} height={112} className="size-16 shrink-0 rounded-2xl object-cover sm:size-20" /> : <Building2 className="shrink-0 text-ed-mist" />}<div><p className="text-xs font-black uppercase tracking-[.14em] text-ed-mist">Real office record</p><h2 className="mt-2 ed-home-display text-2xl leading-[1.05]">{trust.offices[0].name}</h2><p className="mt-3 flex gap-2 text-sm leading-6 text-white/65"><MapPin size={15} className="mt-1 shrink-0" />{trust.offices[0].address}</p><p className="mt-2 text-xs text-white/55">{trust.offices[0].hours}</p></div></div><Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ed-mist px-5 text-sm font-black text-ed-ink">Visit or contact us <ArrowRight size={15} /></Link></div></section>}
  </main>;
}

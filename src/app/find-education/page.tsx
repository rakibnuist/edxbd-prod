import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, CheckCircle2, Globe2, GraduationCap, Search, SlidersHorizontal } from 'lucide-react';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';

export const metadata: Metadata = {
  title: 'Find Universities, Programs and Scholarships',
  description: 'Explore universities, destinations and scholarship guidance, then match options to your level, subject, budget and intake.',
  alternates: { canonical: '/find-education' },
  openGraph: {
    title: 'Find Universities, Programs and Scholarships',
    description: 'Match universities, destinations and funding options to your level, subject, budget and intake.',
    url: '/find-education',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — find education' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Universities, Programs and Scholarships',
    description: 'Match universities, destinations and funding options to your level, subject, budget and intake.',
    images: ['/og-image.jpg'],
  },
};

const discoveryPaths = [
  {
    icon: GraduationCap,
    number: '01',
    title: 'Find universities',
    copy: 'Browse institution records and inspect the details available before asking for a shortlist.',
    href: '/universities',
    cta: 'Browse universities',
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Compare destinations',
    copy: 'Compare recognition, academic fit, total cost and visa readiness across 12 open destinations.',
    href: '/compare-study-destinations',
    cta: 'Compare destinations',
  },
  {
    icon: BadgeDollarSign,
    number: '03',
    title: 'Understand scholarships',
    copy: 'Look beyond the headline amount to eligibility, coverage, renewal conditions and remaining costs.',
    href: '/scholarships',
    cta: 'Explore scholarship guidance',
  },
  {
    icon: SlidersHorizontal,
    number: '04',
    title: 'Match your profile',
    copy: 'Use your level, results, subject, budget, language readiness and intake to shape a realistic shortlist.',
    href: '/education-fit-assessment',
    cta: 'Start free assessment',
  },
];

export default function FindEducationPage() {
  return (
    <main className="min-h-screen bg-white text-[#08263c]">
      <section className="relative overflow-hidden bg-[#eaf7fc] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-40 lg:px-12">
        <div className="absolute -right-24 top-12 size-[420px] rounded-full bg-[#64b5df]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[.94fr_1.06fr] lg:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs font-bold text-[#17699a]"><Link href="/">Home</Link> <span aria-hidden>/</span> Find Education</nav>
            <p className="mt-8 text-xs font-black uppercase tracking-[.18em] text-[#e34c43]">One starting point · Four ways to discover</p>
            <h1 className="mt-4 max-w-[12ch] text-[clamp(3.2rem,6vw,6.7rem)] font-black leading-[.9] tracking-[-.065em]">Find education that fits your life.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Start with your subject, level, budget and intake. Then compare universities, destinations and funding without losing sight of the complete cost or the admission journey.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e34c43] px-7 text-sm font-black text-white">Find my education fit <ArrowRight size={17} /></Link>
              <Link href="/universities" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#174f7a]/20 bg-white px-7 text-sm font-black text-[#174f7a]">Browse universities <Search size={17} /></Link>
            </div>
          </div>
          <div className="relative min-h-[480px] overflow-hidden rounded-[36px] bg-[#08263c] shadow-[0_30px_80px_rgba(8,38,60,.18)]">
            <Image src="/images/students/students-campus.webp" alt="International students on a university campus" fill priority sizes="(max-width:1024px) 100vw, 54vw" className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061c2d]/95 via-[#061c2d]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#8ed0ee]">The EduExpress sequence</p>
              <p className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">Profile → comparison → clear cost → application decision</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#17699a]">Choose what you need now</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-6xl">Four doors. One connected decision.</h2><p className="mt-5 text-base leading-8 text-slate-600">Each door leads back to the same question: does this option fit your education, finances and readiness?</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {discoveryPaths.map(({ icon: Icon, number, title, copy, href, cta }) => (
              <Link key={title} href={href} className="group rounded-[28px] border border-[#174f7a]/12 bg-[#f7fbfd] p-6 transition hover:-translate-y-1 hover:border-[#174f7a]/30 hover:shadow-[0_24px_60px_rgba(8,38,60,.09)] sm:p-8">
                <div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#dff3fb] text-[#17699a]"><Icon size={23} /></span><span className="text-xs font-black tracking-[.16em] text-[#e34c43]">{number}</span></div>
                <h2 className="mt-8 text-3xl font-black">{title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#17699a]">{cta} <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#08263c] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#8ed0ee]">12 destinations · all open</p><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.045em] sm:text-6xl">Explore every route EduExpress supports.</h2></div><Link href="/destinations" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#08263c]">View destination hub <ArrowRight size={16} /></Link></div>
          <div className="mt-10 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {activeCountries.map(country => <Link key={country.slug} href={destinationPath(country.slug)} className="group flex items-center justify-between rounded-2xl border border-white/14 bg-white/[.06] px-5 py-4 transition hover:bg-white/[.12]"><span className="flex items-center gap-3"><span className="text-xl" aria-hidden>{country.flag}</span><strong className="text-sm">{country.name}</strong></span><ArrowRight size={14} className="text-[#8ed0ee] transition group-hover:translate-x-1" /></Link>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-10 rounded-[34px] bg-[#eaf7fc] p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:p-14">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#17699a]">Before a shortlist</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em]">What we need to understand.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">{['Current academic level and results', 'Subject and career direction', 'Realistic yearly and total budget', 'Language and document readiness', 'Preferred intake and timing', 'Recognition or licensing needs'].map(item => <p key={item} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-bold"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#25865f]" />{item}</p>)}</div>
        </div>
      </section>
    </main>
  );
}

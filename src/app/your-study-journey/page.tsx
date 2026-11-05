import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const canonical = absoluteUrl('/your-study-journey');

export const metadata: Metadata = {
  title: { absolute: 'Your Complete Study Abroad Journey | EduExpress International' },
  description:
    'See the seven-stage EduExpress journey from education fit and applications to visa readiness, departure, arrival and university registration. Every stage has a clear output and named responsibility.',
  alternates: { canonical },
  openGraph: {
    title: 'Your Complete Study Abroad Journey | EduExpress International',
    description: 'Seven visible stages, a clear output from each, and written responsibilities throughout.',
    url: canonical,
    type: 'website',
    siteName: 'EduExpress International',
    locale: 'en_BD',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — the complete study journey' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Complete Study Abroad Journey | EduExpress International',
    description: 'Seven visible stages, a clear output from each, and written responsibilities throughout.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

type JourneyStage = {
  id: string;
  number: string;
  title: string;
  promise: string;
  work: string[];
  output: string;
  owner: string;
  icon: LucideIcon;
  image?: string;
};

const stages: JourneyStage[] = [
  {
    id: 'education-fit',
    number: '01',
    title: 'Open your education profile',
    promise: 'The journey begins with your academic reality, goals and family budget—not a pre-selected country.',
    work: ['Review level, results and study gaps', 'Understand subject and career direction', 'Record budget, intake and language readiness'],
    output: 'Education profile',
    owner: 'Student + EduExpress counselor',
    icon: Sparkles,
    image: '/images/office/counselor-office.webp',
  },
  {
    id: 'compare-options',
    number: '02',
    title: 'Compare suitable options',
    promise: 'Countries, universities and programs are compared against the same education-fit questions.',
    work: ['Check institution and program recognition', 'Compare entry requirements and curriculum fit', 'Identify risks, missing facts and alternatives'],
    output: 'EduFit comparison',
    owner: 'EduExpress research + counseling',
    icon: Search,
  },
  {
    id: 'clear-costs',
    number: '03',
    title: 'See the complete cost',
    promise: 'A scholarship or tuition figure is not the whole financial decision.',
    work: ['Separate university, official and EduExpress charges', 'Add living, travel and document-related costs', 'Record payment timing, recipient and known conditions'],
    output: 'ClearCost view',
    owner: 'EduExpress explains; family decides',
    icon: WalletCards,
  },
  {
    id: 'application-file',
    number: '04',
    title: 'Build and submit the application file',
    promise: 'Documents are prepared against the selected institution’s current requirements.',
    work: ['Create the document checklist', 'Check consistency, translations and required formats', 'Record submissions and outstanding conditions'],
    output: 'Application Proof Pack',
    owner: 'Student supplies originals; EduExpress supports preparation',
    icon: ClipboardCheck,
    image: '/images/office/admission-packets.webp',
  },
  {
    id: 'visa-to-registration',
    number: '05',
    title: 'Admission and visa readiness',
    promise: 'An offer is checked for conditions, then the visa file is prepared against official requirements.',
    work: ['Review offer conditions and next deadlines', 'Build the visa-readiness checklist', 'Explain evidence gaps and authority-controlled decisions'],
    output: 'Offer + visa checklist',
    owner: 'University and authority decide; EduExpress prepares',
    icon: ShieldCheck,
  },
  {
    id: 'departure',
    number: '06',
    title: 'Prepare to fly',
    promise: 'Departure is planned as a handover into student life, not the end of the service story.',
    work: ['Review travel and arrival documents', 'Prepare first-day essentials and contact plan', 'Confirm institution arrival instructions'],
    output: 'Departure and arrival plan',
    owner: 'Student + family + EduExpress',
    icon: Plane,
    image: '/images/students/departure-airport.webp',
  },
  {
    id: 'registration',
    number: '07',
    title: 'Arrive and register at university',
    promise: 'The visible journey closes when the student reaches campus and understands the registration steps.',
    work: ['Follow the institution arrival process', 'Complete required registration steps', 'Know where to seek campus and emergency support'],
    output: 'Registration completion check',
    owner: 'Student + university, with EduExpress guidance',
    icon: GraduationCap,
    image: '/images/students/campus-nuist.webp',
  },
];

export default function StudyJourneyPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Your complete study abroad journey',
        description:
          'Seven visible stages from education fit and applications to visa readiness, departure, arrival and university registration.',
        inLanguage: 'en-BD',
        dateModified: '2026-11-04',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Your study journey', item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#stages`,
        name: 'The seven stages of the EduExpress study journey',
        numberOfItems: stages.length,
        itemListElement: stages.map((stage) => ({
          '@type': 'ListItem',
          position: Number(stage.number),
          name: stage.title,
          url: `${canonical}#${stage.id}`,
        })),
      },
    ],
  };

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule bg-chalk">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-20 size-[380px] rounded-full bg-sky-400/20 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
          <Breadcrumbs items={[{ name: 'Your study journey' }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <p className="ed-label">File open → university registration</p>
              <h1 className="ed-home-display mt-4 max-w-[14ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-ink">
                See your whole journey.
              </h1>
              <p className="mt-4 max-w-[54ch] text-[14.5px] leading-7 text-ink-soft">
                Seven visible stages. A clear output from each. Written responsibilities throughout—so your family understands what happens next.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Start stage one free <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">
                  Inspect the proof library <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-mute">
                <li className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-jade" aria-hidden="true" />
                  7 stages, 7 written outputs
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-jade" aria-hidden="true" />
                  Named responsibility at every step
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {stages.map((stage) => (
                <a
                  key={stage.number}
                  href={`#${stage.id}`}
                  className="group rounded-2xl border border-rule bg-white p-4 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)] transition hover:border-petrol-400/40 hover:bg-mint-100"
                >
                  <span className="ed-figure text-[12px] font-bold tracking-[0.14em] text-petrol-600">{stage.number}</span>
                  <strong className="mt-2 block text-[15px] leading-5 text-ink group-hover:text-petrol-700">{stage.title}</strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principle strip */}
      <section className="border-b border-rule bg-white px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-4">
          <p className="max-w-[70ch] text-[15px] leading-6 text-ink-soft">
            Every stage answers three questions: what happens, what you receive, who owns the decision.
          </p>
          <Link href="/proof-library" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-petrol-700 hover:text-petrol-900">
            Inspect real work proof <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Stages */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto max-w-shell">
          <div className="max-w-[58ch]">
            <p className="ed-label">The seven stages</p>
            <h2 className="ed-home-display mt-4 text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.06] text-ink">
              One file, seven visible handovers
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-ink-soft">
              Each stage has a document you can keep and a named owner for the decision. Nothing moves forward on a spoken promise.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const reverse = index % 2 === 1;
              return (
                <article
                  id={stage.id}
                  key={stage.number}
                  className="scroll-mt-28 overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)]"
                >
                  <div className={`grid ${stage.image ? 'lg:grid-cols-2' : ''}`}>
                    {stage.image && (
                      <figure className={`relative min-h-[260px] ${reverse ? 'lg:order-2' : ''}`}>
                        <Image
                          src={stage.image}
                          alt={`${stage.title} in the EduExpress student journey`}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/50 to-transparent" aria-hidden="true" />
                        <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-petrol-700 backdrop-blur">
                          Stage {stage.number}
                        </figcaption>
                      </figure>
                    )}
                    <div className={`p-6 sm:p-8 lg:p-10 ${reverse && stage.image ? 'lg:order-1' : ''}`}>
                      <div className="flex items-start justify-between gap-6">
                        <span className="grid size-11 place-items-center rounded-2xl bg-mint-100 text-petrol-700 ring-1 ring-petrol-400/10">
                          <Icon size={22} aria-hidden="true" />
                        </span>
                        <span className="ed-figure text-[13px] font-bold tracking-[0.16em] text-ink-mute">{stage.number} / 07</span>
                      </div>
                      <h3 className="ed-home-display mt-6 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.08] text-ink">{stage.title}</h3>
                      <p className="mt-3 text-[15px] leading-7 text-ink-soft">{stage.promise}</p>
                      <ul className="mt-5 grid gap-2.5">
                        {stage.work.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[15px] leading-6 text-ink">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-jade" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-rule bg-chalk-100 p-4">
                          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">What you receive</p>
                          <strong className="mt-1.5 block text-[15px] text-ink">{stage.output}</strong>
                        </div>
                        <div className="rounded-xl border border-rule bg-chalk-100 p-4">
                          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Responsibility</p>
                          <strong className="mt-1.5 block text-[15px] text-ink">{stage.owner}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Proof + boundary */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-4 lg:grid-cols-2">
          <article className="rounded-[26px] border border-rule bg-white p-7 shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)] sm:p-9">
            <span className="grid size-11 place-items-center rounded-2xl bg-mint-100 text-jade">
              <FileCheck2 size={22} aria-hidden="true" />
            </span>
            <h2 className="ed-home-display mt-5 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.08] text-ink">
              Proof travels with the journey
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-soft">
              EduExpress publishes privacy-safe examples of admission work, document records and institutional evidence. Your own file remains private.
            </p>
            <Link href="/proof-library" className="ed-btn ed-btn-outline mt-5 min-h-11">
              Open proof library <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>

          <article className="ed-band ed-band-sky rounded-[26px] border border-rule p-7 sm:p-9">
            <p className="ed-label">Important boundary</p>
            <h2 className="ed-home-display mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.08] text-ink">
              Support is not a guarantee
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-ink-soft">
              Universities decide admission and scholarships. Government authorities decide visas and permits. EduExpress can compare, prepare, check, explain and support—but cannot replace an official decision.
            </p>
            <Link href="/better-education-standard" className="ed-btn ed-btn-primary mt-5 min-h-11">
              Read our standard <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="ed-band ed-band-navy relative mx-auto max-w-shell overflow-hidden rounded-[30px] px-6 py-10 sm:px-9 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2.5 text-[14px] font-bold text-mint-300">
                <span className="h-px w-7 bg-mint-300" aria-hidden="true" /> Your next honest step
              </p>
              <h2 className="ed-home-display mt-4 max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.04] text-white">
                Open stage one with your real profile.
              </h2>
              <p className="mt-3 max-w-[50ch] text-[15px] leading-7 text-white/80">
                The free assessment gives your counselor the context needed to compare education routes responsibly.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row lg:justify-end">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                Start my assessment <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ed-btn ed-btn-on-dark min-h-12 px-6">
                Talk to a counsellor <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

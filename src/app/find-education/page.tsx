import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  Globe2,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { activeCountries } from '@/lib/countries';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

const canonical = `${SITE_URL}/find-education`;
const LAST_REVIEWED = '2026-11-04';

export const metadata: Metadata = {
  title: { absolute: 'Find Universities, Programs & Scholarships 2027 | EduExpress' },
  description:
    'Compare universities, programs, tuition, scholarships and intakes across 12 study destinations. Free education fit assessment for students in Bangladesh.',
  alternates: { canonical },
  openGraph: {
    title: 'Find Universities, Programs and Scholarships | EduExpress International',
    description:
      'A structured way to compare universities, destinations, tuition and funding before you apply. Free assessment for students in Bangladesh.',
    url: canonical,
    type: 'website',
    siteName: 'EduExpress International',
    locale: 'en_BD',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — find universities, programs and scholarships' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Universities, Programs and Scholarships | EduExpress International',
    description:
      'Compare universities, destinations, tuition and funding before you apply. Free assessment for students in Bangladesh.',
    images: ['/og-image.jpg'],
  },
};

const discoveryPaths = [
  {
    icon: GraduationCap,
    number: '01',
    title: 'Find universities',
    copy: 'Search institution records by country, degree level and subject. Each profile shows what is verified, what it costs and when the record was last checked.',
    href: '/universities',
    cta: 'Browse university records',
    tone: 'bg-petrol-700 text-white',
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Compare destinations',
    copy: 'Put recognition, total cost, visa requirements and student life side by side before choosing a country.',
    href: '/compare-study-destinations',
    cta: 'Compare destinations',
    tone: 'bg-petrol-500 text-white',
  },
  {
    icon: BadgeDollarSign,
    number: '03',
    title: 'Understand scholarships',
    copy: 'Read eligibility, coverage, renewal conditions and the costs that remain after an award — not just the headline value.',
    href: '/scholarships',
    cta: 'Explore scholarship guidance',
    tone: 'bg-sky-500 text-petrol-900',
  },
  {
    icon: SlidersHorizontal,
    number: '04',
    title: 'Match your profile',
    copy: 'Share your results, budget, language readiness and preferred intake. A counsellor reviews the realistic options with you.',
    href: '/education-fit-assessment',
    cta: 'Start the free assessment',
    tone: 'bg-petrol-700 text-white',
  },
];

const startingPoints = [
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
  { label: 'Cost of studying in China', href: '/study-in-china-cost-bangladesh' },
  { label: 'China scholarships explained', href: '/china-scholarships-bangladesh' },
  { label: 'University and program finder', href: '/universities' },
  { label: 'Compare study destinations', href: '/compare-study-destinations' },
  { label: 'Guidance for parents and sponsors', href: '/for-parents' },
];

const readinessItems = [
  'Current academic level and results',
  'Subject and career direction',
  'Realistic yearly and total budget',
  'Language and document readiness',
  'Preferred intake and timing',
  'Recognition or licensing needs',
];

const faqs = [
  {
    question: 'How do I choose a university or destination?',
    answer:
      'Start with what the qualification must do for your career, then compare recognition, total cost, language of instruction, intake timing and student support. A destination that looks affordable can become expensive once living costs, travel and deposits are added, so compare the full schedule rather than tuition alone.',
  },
  {
    question: 'Can EduExpress shortlist universities before I pay?',
    answer:
      'The initial education fit assessment is free. A counsellor reviews your level, results, budget and preferred intake, then explains which options can be shortlisted and which documents are needed to confirm them. For the China visa-first package, no EduExpress service fee is due before China visa approval; any third-party fee required earlier is itemised in writing.',
  },
  {
    question: 'Do you guarantee admission, a scholarship or a visa?',
    answer:
      'No. Admission, funding and visa decisions belong to the relevant university, scholarship body or embassy. EduExpress checks eligibility, prepares the application and explains the evidence behind each recommendation, but no consultancy can guarantee an outcome.',
  },
  {
    question: 'What should I prepare before the first counselling session?',
    answer:
      'Bring your latest academic transcripts or certificates, passport details, an English or language test result if available, and a realistic budget range. A CV or personal statement helps for postgraduate applications. The exact document list depends on the destination and university and is confirmed in writing before submission.',
  },
];

async function getUniversityCount() {
  try {
    const records = await getUniversityRecords();
    return records.filter(record => record.isActive).length;
  } catch {
    return 0;
  }
}

export default async function FindEducationPage() {
  const universityCount = await getUniversityCount();
  const destinations = activeCountries;

  const facts = [
    { value: String(destinations.length), label: 'destination services' },
    { value: String(discoveryPaths.length), label: 'research paths' },
    { value: String(readinessItems.length), label: 'facts checked before a shortlist' },
    { value: '0', label: 'service fee before China visa approval' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Find universities, programs and scholarships',
        description:
          'Compare universities, programs, tuition, scholarships and intakes across study destinations, then request a free education fit assessment.',
        inLanguage: 'en-BD',
        dateModified: LAST_REVIEWED,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl('/images/students/students-campus.webp') },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Find education', item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#research-paths`,
        name: 'Ways to research study options',
        numberOfItems: discoveryPaths.length,
        itemListElement: discoveryPaths.map((path, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: path.title,
          url: absoluteUrl(path.href),
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#destinations`,
        name: 'Study destinations supported by EduExpress International',
        numberOfItems: destinations.length,
        itemListElement: destinations.map((country, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `Study in ${country.name}`,
          url: absoluteUrl(destinationPath(country.slug)),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule bg-chalk px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-24 size-[420px] rounded-full bg-sky-400/25 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell">
          <Breadcrumbs items={[{ name: 'Find education' }]} />

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
            <div className="min-w-0">
              <p className="ed-label">University, destination and funding research</p>
              <h1 className="ed-home-display mt-5 max-w-[16ch] text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] text-ink">
                Find universities, programs and scholarships that fit your life.
              </h1>
              <p className="mt-6 max-w-[56ch] text-[15px] leading-7 text-ink-soft">
                A free, structured starting point for students and families in Bangladesh. Compare institutions,
                destinations, tuition, funding and intake timing before you commit to an application.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary min-h-12 px-6">
                  Start the free fit assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/universities" className="ed-btn ed-btn-outline min-h-12 bg-white/70 px-6">
                  Browse university records <Search size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-ink-mute">
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-jade" aria-hidden="true" />
                  {universityCount > 0 ? `${universityCount} university records` : 'Source-based university records'}
                </li>
                <li aria-hidden="true" className="text-ink-mute/50">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-petrol-600" aria-hidden="true" /> Dhanmondi, Dhaka
                </li>
                <li aria-hidden="true" className="text-ink-mute/50">·</li>
                <li>Reviewed {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(LAST_REVIEWED))}</li>
              </ul>
            </div>

            <div className="relative min-w-0">
              <figure className="overflow-hidden rounded-[30px] border border-white bg-white p-2.5 shadow-[0_36px_80px_-46px_rgba(15,53,87,0.55)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-petrol-800">
                  <Image
                    src="/images/students/students-campus.webp"
                    alt="International students walking on a university campus"
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/80 via-petrol-900/10 to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-petrol-600">The EduExpress sequence</p>
                    <p className="mt-1 text-[13px] font-semibold leading-6 text-ink">
                      Profile → comparison → clear cost → application decision
                    </p>
                  </figcaption>
                </div>
              </figure>

              <div className="absolute -left-3 -top-4 hidden rounded-2xl bg-petrol-700 px-4 py-3 text-white shadow-[0_18px_40px_-20px_rgba(7,28,46,0.7)] sm:block">
                <span className="ed-numeral block text-[30px] leading-none text-mint-300">
                  {String(destinations.length).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section aria-label="Directory facts" className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-10">
        <dl className="mx-auto grid max-w-shell grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-rule bg-rule shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)] sm:grid-cols-4">
          {facts.map((item, index) => (
            <div key={item.label} className="bg-white px-5 py-5">
              <div className="flex items-baseline justify-between gap-2">
                <dd className="ed-numeral text-[32px] text-petrol-700">{item.value}</dd>
                <span className="ed-figure text-[10px] font-bold tracking-[0.14em] text-ink-mute">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <dt className="mt-2 text-[11.5px] leading-4 text-ink-mute">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Research paths */}
      <section className="relative px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[56ch]">
              <p className="ed-label">Research paths</p>
              <h2 className="ed-home-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                Four ways to research, one decision.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[14px] leading-7 text-ink-soft lg:pb-2">
              Each path returns to the same question: does this option fit your education, finances and readiness?
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {discoveryPaths.map(({ icon: Icon, number, title, copy, href, cta, tone }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_34px_70px_-40px_rgba(15,53,87,0.42)]"
              >
                <div className={`relative h-[92px] overflow-hidden ${tone}`}>
                  <span className="ed-numeral absolute -right-2 -top-5 text-[100px] opacity-[0.16]" aria-hidden="true">
                    {number}
                  </span>
                  <span className="absolute bottom-4 left-6 grid size-11 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-5 right-6 text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">
                    Path {number}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="ed-home-display text-[24px] leading-snug text-ink">{title}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-6 text-ink-soft">{copy}</p>
                  <span className="mt-5 inline-flex items-center justify-between gap-2 border-t border-rule pt-4 text-[12.5px] font-bold text-petrol-600">
                    {cta}
                    <span className="grid size-7 place-items-center rounded-full bg-mint-100 transition-colors group-hover:bg-mint-200">
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Starting points */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-shell rounded-[26px] border border-rule bg-white p-6 shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ed-label">Popular starting points</p>
              <h2 className="mt-3 ed-home-display text-[clamp(1.55rem,2.4vw,2.05rem)] leading-tight text-ink">
                Go straight to the question you are researching.
              </h2>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-mute">2027 cycle</span>
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {startingPoints.map(point => (
              <li key={point.href}>
                <Link
                  href={point.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-rule bg-chalk-100 px-4 py-3 text-[13px] font-semibold text-ink transition-colors hover:border-petrol-400/40 hover:bg-mint-100"
                >
                  {point.label}
                  <ArrowUpRight size={14} className="shrink-0 text-petrol-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Destinations */}
      <section className="ed-band ed-band-navy relative overflow-hidden px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-[58ch]">
              <p className="ed-label text-mint-300 before:!bg-mint-300">{destinations.length} destinations · all open</p>
              <h2 className="ed-home-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-white">
                Explore every destination we support.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-white/75">
                Each route page explains recognition, indicative costs, intake timing and visa steps for that country.
                China carries the deepest published evidence set.
              </p>
            </div>
            <Link href="/destinations" className="ed-btn ed-btn-on-dark min-h-11 w-fit shrink-0">
              View the destination hub <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-10 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {destinations.map(country => (
              <li key={country.slug}>
                <Link
                  href={destinationPath(country.slug)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 transition-colors hover:border-white/25 hover:bg-white/[0.1]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="text-xl" aria-hidden="true">{country.flag}</span>
                    <span className="min-w-0">
                      <strong className="block truncate text-[13.5px] font-semibold text-white">{country.name}</strong>
                      <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-mint-300">
                        {country.serviceStatus}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-mint-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Readiness */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 rounded-[34px] border border-rule bg-sand/70 p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:p-14">
          <div>
            <p className="ed-label">Before a shortlist</p>
            <h2 className="ed-home-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-ink">
              Six facts we need before recommending anything.
            </h2>
            <p className="mt-4 max-w-[42ch] text-[14px] leading-7 text-ink-soft">
              A shortlist is only useful if it matches your results and your family&apos;s budget. These are the facts a
              counsellor checks first, so the options discussed are realistic from the start.
            </p>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary mt-7 min-h-11">
              Review my profile <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-[11px] leading-5 text-ink-mute">Free assessment · no payment details requested</p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {readinessItems.map(item => (
              <li key={item} className="flex gap-3 rounded-2xl border border-white bg-white px-4 py-4 text-[13px] font-semibold leading-6 text-ink shadow-[0_14px_30px_-30px_rgba(15,53,87,0.5)]">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-jade" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <p className="ed-label">Questions before you choose</p>
            <h2 className="ed-home-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-ink">
              Clear answers before you commit.
            </h2>
            <p className="mt-4 max-w-[40ch] text-[14px] leading-7 text-ink-soft">
              If your results, budget or timing need a different conversation, contact a counsellor directly.
            </p>
            <Link href="/contact" className="ed-btn ed-btn-outline mt-6 min-h-11">
              Contact EduExpress
            </Link>
          </div>

          <div className="grid gap-3">
            {faqs.map(item => (
              <details key={item.question} className="group rounded-[20px] border border-rule bg-white px-5 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)] open:border-[#cfe7f5]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 ed-home-display text-[17px] leading-snug text-ink">
                  {item.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong bg-chalk-100 text-[16px] leading-none text-petrol-600 transition group-open:rotate-45 group-open:border-petrol-400 group-open:bg-mint-100">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 text-[13px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="ed-band ed-band-navy relative mx-auto max-w-shell overflow-hidden rounded-[34px] px-6 py-12 sm:px-9 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -top-28 size-[420px] rounded-full bg-sky-500/25 blur-[110px]" aria-hidden="true" />
          <div className="relative grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2.5 text-[12px] font-bold text-mint-300">
                <span className="h-px w-7 bg-mint-300" aria-hidden="true" /> Next step
              </p>
              <h2 className="ed-home-display mt-4 max-w-[24ch] text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.04] text-white">
                Start with a profile review, not an application.
              </h2>
              <p className="mt-4 max-w-[50ch] text-[14px] leading-7 text-white/80">
                A counsellor will review your level, results, budget and preferred intake, then explain the realistic
                options and the documents needed before you pay anything.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Get my free assessment <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/universities" className="ed-btn ed-btn-on-dark min-h-12 px-6">
                  Browse universities
                </Link>
              </div>
            </div>

            <ol className="grid gap-3 text-[13px] text-white/85">
              {[
                ['01', 'Profile review', 'Level, results, subject, budget and intake.'],
                ['02', 'Options in writing', 'Recognition, costs and entry requirements compared.'],
                ['03', 'Your decision', 'Apply only when the fit and the cost are clear.'],
              ].map(([number, title, copy]) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
                  <span className="ed-figure text-[11px] font-bold tracking-[0.12em] text-mint-300">{number}</span>
                  <span>
                    <strong className="block text-[13.5px] font-semibold text-white">{title}</strong>
                    <span className="mt-0.5 block text-[11.5px] leading-5 text-white/70">{copy}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}

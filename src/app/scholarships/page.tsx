import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BadgeDollarSign,
  Check,
  CheckCircle2,
  CircleAlert,
  FileSearch,
  GraduationCap,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const canonical = absoluteUrl('/scholarships');
const LAST_REVIEWED = '2026-11-04';

export const metadata: Metadata = {
  title: { absolute: 'Scholarship Guidance for Bangladeshi Students | EduExpress' },
  description:
    'Scholarship guidance for Bangladeshi students: check eligibility, exact coverage, renewal conditions, remaining costs and application readiness before applying. Evidence-based advice across study destinations.',
  alternates: { canonical },
  openGraph: {
    title: 'Scholarship Guidance for Bangladeshi Students | EduExpress International',
    description:
      'Understand scholarship eligibility, coverage, renewal conditions and the costs that remain after an award. Compare opportunities by destination with written proof.',
    url: canonical,
    type: 'website',
    siteName: 'EduExpress International',
    locale: 'en_BD',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduExpress International — scholarship guidance for Bangladeshi students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarship Guidance for Bangladeshi Students | EduExpress International',
    description:
      'Understand eligibility, exact coverage, renewal conditions and remaining costs before applying for overseas scholarships.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const checks = [
  {
    icon: GraduationCap,
    title: 'Education fit first',
    copy: 'The program and university must fit your academic direction, recognition needs and career goals before chasing an award.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Exact coverage',
    copy: 'Confirm whether tuition, accommodation, stipend, insurance, fees or deposits are covered — and get it in writing.',
  },
  {
    icon: FileSearch,
    title: 'Eligibility & evidence',
    copy: 'Check grades, language, tests, portfolio, documents and whether a separate scholarship application is required.',
  },
  {
    icon: WalletCards,
    title: 'Remaining family cost',
    copy: 'Calculate living, travel, visa, medical, translation and any uncovered costs for the full program duration.',
  },
];

const comparisonItems = [
  'Official scholarship name, provider and source URL',
  'Eligible university, program and intake',
  'Award amount or exact coverage (itemised)',
  'Renewal conditions, GPA requirements and terms',
  'Application deadline, result timeline and process',
  'Remaining first-year and estimated total program costs',
];

const faqs = [
  {
    question: 'Can EduExpress guarantee a scholarship?',
    answer:
      'No. Scholarship decisions are made by universities and awarding bodies. We help you identify realistic opportunities, check eligibility, prepare a complete file and verify coverage in writing, but we cannot guarantee an award.',
  },
  {
    question: 'What does a "full scholarship" actually cover?',
    answer:
      'It varies. Some cover tuition only; others cover tuition, accommodation, monthly stipend, insurance and airfare. Always ask for an itemised breakdown in writing and confirm what remains payable.',
  },
  {
    question: 'Should I apply for scholarships before choosing a university?',
    answer:
      'Start with education fit first. Shortlist universities and programs that are realistic for your profile, then check which scholarships apply to those options for your intake. This avoids applying to awards you cannot actually use.',
  },
  {
    question: 'Are there scholarships for Bangladeshi students with moderate grades?',
    answer:
      'Yes, though competition is high. Many opportunities consider the full profile (academics, motivation, fit). We focus on realistic options based on published criteria for your intake, not just headline amounts.',
  },
];

export default function ScholarshipsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Scholarship guidance for Bangladeshi students',
        description:
          'Understand scholarship eligibility, exact coverage, renewal conditions, remaining costs and application readiness before applying for overseas education.',
        inLanguage: 'en-BD',
        dateModified: LAST_REVIEWED,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl('/images/students/students-campus.webp'),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Scholarships', item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: 'Scholarship guidance and comparison',
        serviceType: 'Education consultancy',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
        description:
          'Compare scholarships by exact coverage, eligibility, renewal conditions and remaining costs across study destinations.',
      },
    ],
  };

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-mint-100/70 to-white relative overflow-hidden border-b border-rule px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-24 size-[420px] rounded-full bg-sky-500/25 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 bottom-[-30%] size-[520px] rounded-full bg-petrol-400/20 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell">
          <Breadcrumbs
            items={[{ name: 'Scholarships' }]}
            className="text-ink-soft [&_a]:text-ink-soft [&_a:hover]:text-ink [&_span]:text-ink-soft"
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ed-chip-light">
                  <span className="ed-chip-light-dot" aria-hidden="true" />
                  Scholarship guidance
                </span>
                <span className="ed-chip-light">Evidence-first comparison</span>
              </div>
              <h1 className="ed-display mt-6 max-w-[18ch] text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.01] text-ink">
                Funding should improve a good decision—not create a bad one.
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15px] leading-8 text-ink-soft">
                We assess scholarships after education fit. The useful question isn&apos;t just &ldquo;how much?&rdquo; It&apos;s what the award covers, what keeps it active, and what your family still needs to pay.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Check my education & funding fit <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-12 px-6">
                  Explore China scholarships <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-soft">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-petrol-600" aria-hidden="true" />
                  Itemised coverage in writing
                </li>
                <li aria-hidden="true" className="text-ink-mute">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-petrol-600" aria-hidden="true" />
                  No scholarship guarantee
                </li>
                <li aria-hidden="true" className="text-ink-mute">·</li>
                <li>Reviewed {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(LAST_REVIEWED))}</li>
              </ul>
            </div>

            <div className="relative min-w-0">
              <figure className="ed-frame ed-frame-sky overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                  <Image
                    src="/images/students/students-campus.webp"
                    alt="Students researching scholarships and funding options"
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/90 via-petrol-900/15 to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-4 py-3 backdrop-blur">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-petrol-600">Read past the headline</p>
                    <p className="mt-1 text-[15px] font-semibold leading-6 text-ink">
                      Coverage • Conditions • Remaining costs • Fit
                    </p>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Checks */}
      <section className="relative px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="relative mx-auto max-w-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[60ch]">
              <p className="ed-label">Four checks before you apply</p>
              <h2 className="ed-display mt-4 text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.06] text-ink">
                Read past the scholarship headline
              </h2>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-ink-soft">
                A realistic shortlist starts with fit, then checks exact coverage and what your family still needs to pay.
              </p>
            </div>
            <Link href="/find-education" className="ed-btn ed-btn-outline min-h-11 w-fit shrink-0">
              Research destinations & universities <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {checks.map(({ icon: Icon, title, copy }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[28px] border border-rule bg-white shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_34px_70px_-40px_rgba(15,53,87,0.42)]"
              >
                <div className="absolute right-6 top-6 text-[13px] font-bold tracking-[0.16em] text-ink-mute">
                  0{index + 1}
                </div>
                <div className="p-7 sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-petrol-700 ring-1 ring-petrol-400/10">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="ed-home-display text-[24px] leading-snug text-ink">{title}</h3>
                  </div>
                  <p className="mt-4 text-[14px] leading-7 text-ink-soft">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="ed-band ed-band-sky relative overflow-hidden px-4 py-section sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="ed-label">What a written comparison should show</p>
            <h2 className="ed-display mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.06] text-ink">
              The award and the cost beside it
            </h2>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-7 text-ink-soft">
              A scholarship is only meaningful when the official conditions and your remaining financial responsibility are visible together, side by side.
            </p>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary mt-7 min-h-11">
              Get a written comparison <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-2">
            {comparisonItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white bg-white px-5 py-4 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)]"
              >
                <CheckCircle2 size={18} className="shrink-0 text-jade" aria-hidden="true" />
                <span className="text-[15px] font-semibold leading-6 text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <p className="ed-label">Scholarship FAQs</p>
            <h2 className="ed-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-ink">
              Clear answers before you commit
            </h2>
            <p className="mt-4 max-w-[40ch] text-[14px] leading-7 text-ink-soft">
              If your profile needs a different conversation, speak to a counsellor directly.
            </p>
            <Link href="/contact" className="ed-btn ed-btn-outline mt-6 min-h-11">
              Contact EduExpress
            </Link>
          </div>

          <div className="grid gap-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-[20px] border border-rule bg-white px-5 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)] open:border-[#cfe7f5]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 ed-home-display text-[17px] leading-snug text-ink">
                  {item.question}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong bg-chalk-100 text-[16px] leading-none text-petrol-600 transition group-open:rotate-45 group-open:border-petrol-400 group-open:bg-mint-100">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-10 text-[15px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-2">
          <article className="ed-band ed-band-navy relative overflow-hidden rounded-[32px] px-7 py-10 sm:px-9 sm:py-12">
            <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 -top-24 size-[360px] rounded-full bg-sky-500/25 blur-[90px]" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-mint-300">
                  <CircleAlert size={22} aria-hidden="true" />
                </span>
                <p className="text-[14px] font-bold uppercase tracking-[0.14em] text-mint-300">Important</p>
              </div>
              <h2 className="ed-display mt-5 text-[clamp(2rem,4vw,2.8rem)] leading-[1.06] text-white">
                No scholarship guarantee
              </h2>
              <p className="mt-4 max-w-[48ch] text-[14px] leading-7 text-white/80">
                Scholarship bodies and universities decide awards. Published criteria, deadlines and availability can change. We help compare, prepare and verify the current route, but cannot guarantee an award.
              </p>
              <Link href="/better-education-standard" className="ed-btn ed-btn-on-dark mt-7 min-h-11">
                See our evidence standard <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article className="rounded-[32px] border border-rule bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] sm:p-9">
            <p className="ed-label">Start with fit</p>
            <h2 className="ed-display mt-4 text-[clamp(2rem,4vw,2.8rem)] leading-[1.06] text-ink">
              Bring your profile, not just a scholarship screenshot
            </h2>
            <p className="mt-4 max-w-[50ch] text-[14px] leading-7 text-ink-soft">
              Your results, subject, budget, intake and language readiness determine which opportunities are worth checking. Get a written read on realistic routes before applying.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary min-h-11">
                Start free assessment <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/destinations" className="ed-btn ed-btn-outline min-h-11">
                Explore destinations <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

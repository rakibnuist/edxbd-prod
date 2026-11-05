import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeCheck, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const canonical = absoluteUrl('/education-fit-assessment');
const LAST_REVIEWED = '2026-11-04';

export const metadata: Metadata = {
  title: { absolute: 'Free Education Fit Assessment | Compare Study Options Before You Commit' },
  description:
    'Free, written education fit assessment for Bangladeshi students. Compare suitable study-abroad routes, recognition, total costs, risks and missing information before you apply. No obligation.',
  alternates: { canonical },
  openGraph: {
    title: 'Free Education Fit Assessment | EduExpress International',
    description:
      'Compare before you commit. Get a written read on suitable routes, realistic costs, risks and next steps for studying abroad from Bangladesh.',
    url: canonical,
    type: 'website',
    siteName: 'EduExpress International',
    locale: 'en_BD',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduExpress International — Free Education Fit Assessment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Education Fit Assessment | EduExpress International',
    description:
      'Compare before you commit. A written read on your suitable routes, risks and next step for studying abroad.',
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

const promises = [
  'We compare at least three suitable routes and explain why each is recommended or set aside.',
  'We separate university, embassy and third-party costs from EduExpress charges — in writing.',
  'No file-opening charge, and no EduExpress service fee before China visa approval.',
];

const whatYouGet = [
  'A written shortlist of realistic routes based on your profile',
  'Recognition, entry requirements and language fit for each option',
  'Itemised costs: tuition, living, fees and what remains payable',
  'Risks, timelines and documents still needed',
  'Clear next steps — apply only when fit and costs are clear',
];

const faqs = [
  {
    question: 'Is the education fit assessment really free?',
    answer:
      'Yes. The initial assessment is free. There is no obligation to proceed. For the China visa-first package, no EduExpress service fee is due before China visa approval; any third-party fees are itemised in writing if required earlier.',
  },
  {
    question: 'What should I prepare before taking the assessment?',
    answer:
      'Have your latest academic results/transcripts, passport details, budget range, preferred intake and subject/career goal ready. If you have test scores (IELTS/other), include them. Parents can join the conversation.',
  },
  {
    question: 'Do you guarantee admission, scholarship or visa?',
    answer:
      'No. Admission, funding and visa decisions belong to universities, scholarship bodies and embassies. We assess fit, prepare files properly, check against published rules and explain risks, but we cannot guarantee outcomes.',
  },
  {
    question: 'How long does it take to get the written assessment?',
    answer:
      'After you submit the form, a counsellor reviews your profile and shares a written response with suitable routes and next steps. Timing depends on completeness of information, but we aim to respond promptly during working hours.',
  },
];

export default function EducationFitAssessmentPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Free Education Fit Assessment',
        description:
          'Free, written education fit assessment comparing suitable study-abroad routes, costs, risks and next steps before you commit.',
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
          { '@type': 'ListItem', position: 2, name: 'Education Fit Assessment', item: canonical },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: 'Free Education Fit Assessment',
        serviceType: 'Education counselling',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh',
        },
        description:
          'Written comparison of suitable study routes with recognition, total costs, risks and missing information before applying.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BDT',
          availability: 'https://schema.org/InStock',
        },
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
    ],
  };

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero */}
      <section className="ed-band ed-band-navy relative overflow-hidden border-b border-white/10 px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-24 size-[420px] rounded-full bg-sky-500/25 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 bottom-[-30%] size-[520px] rounded-full bg-petrol-400/20 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell">
          <Breadcrumbs
            items={[{ name: 'Education Fit Assessment' }]}
            className="text-white/80 [&_a]:text-white/80 [&_a:hover]:text-white [&_span]:text-white/60"
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ed-chip-dark">
                  <span className="ed-chip-dark-dot" aria-hidden="true" />
                  Free · Written · No obligation
                </span>
                <span className="ed-chip-dark">Compare before you commit</span>
              </div>
              <h1 className="ed-display mt-6 max-w-[18ch] text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.01] text-white">
                Compare before you commit — with a written read on your fit
              </h1>
              <p className="mt-6 max-w-[58ch] text-[15px] leading-8 text-white/80">
                Share a few details about your results, budget, intake and goals. We return the suitable routes for you, the risks to weigh, and the information we still need — before any money or application is involved.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#assessment-form" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Start my assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/find-education" className="ed-btn ed-btn-on-dark min-h-12 px-6">
                  Research destinations & universities <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-white/70">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-mint-300" aria-hidden="true" />
                  Compare at least 3 routes
                </li>
                <li aria-hidden="true" className="text-white/40">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-mint-300" aria-hidden="true" />
                  Costs in writing
                </li>
                <li aria-hidden="true" className="text-white/40">·</li>
                <li>Reviewed {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(LAST_REVIEWED))}</li>
              </ul>
            </div>

            <div className="relative min-w-0">
              <figure className="ed-frame ed-frame-sky overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                  <Image
                    src="/images/students/students-campus.webp"
                    alt="Students getting education fit assessment counselling"
                    fill
                    sizes="(max-width:1024px) 100vw, 560px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/90 via-petrol-900/15 to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-petrol-600">Written before you commit</p>
                    <p className="mt-1 text-[13px] font-semibold leading-6 text-ink">
                      Routes • Risks • Costs • Next steps
                    </p>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-rule bg-rule shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)] md:grid-cols-3">
          {promises.map((promise) => (
            <div key={promise} className="flex items-start gap-3 bg-white px-5 py-5">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-jade" aria-hidden="true" />
              <p className="text-[13px] leading-6 text-ink">{promise}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="ed-label">What you get</p>
            <h2 className="ed-display mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.06] text-ink">
              A clear, written read on your fit
            </h2>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-7 text-ink-soft">
              We don&apos;t just suggest countries — we compare realistic options against your profile and show the tradeoffs in writing.
            </p>
            <Link href="/better-education-standard" className="ed-btn ed-btn-outline mt-7 min-h-11">
              See our evidence standard <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-2">
            {whatYouGet.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-rule bg-white px-5 py-4 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)]"
              >
                <CheckCircle2 size={18} className="shrink-0 text-jade" aria-hidden="true" />
                <span className="text-[13.5px] font-semibold leading-6 text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section id="assessment-form" className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20 scroll-mt-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 text-center">
            <p className="ed-label justify-center">Start your assessment</p>
            <h2 className="ed-display mt-4 text-[clamp(2rem,4vw,2.8rem)] leading-[1.06] text-ink">
              Share your profile to get your written assessment
            </h2>
            <p className="mx-auto mt-3 max-w-[56ch] text-[14px] leading-7 text-ink-soft">
              Takes a few minutes. No payment details required. We&apos;ll review and respond with suitable routes and next steps.
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-rule bg-white shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)]">
            <div className="h-1.5 w-full bg-gradient-to-r from-petrol-700 via-petrol-500 to-sky-400" aria-hidden="true" />
            <div className="p-5 sm:p-8 lg:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-shell gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <p className="ed-label">FAQs</p>
            <h2 className="ed-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-ink">
              Common questions about the assessment
            </h2>
            <p className="mt-4 max-w-[40ch] text-[14px] leading-7 text-ink-soft">
              If you need clarification before submitting, we&apos;re happy to talk.
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
                <p className="pb-5 pr-10 text-[13px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

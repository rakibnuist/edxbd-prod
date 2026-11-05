import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeDollarSign, CheckCircle2, Globe2, GraduationCap, Search, SlidersHorizontal } from 'lucide-react';

import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { activeCountries } from '@/lib/countries';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

const PATH = '/find-education';
const canonical = `${SITE_URL}${PATH}`;
const LAST_REVIEWED = '2026-11-04';

export const metadata = pageMetadata({
  title: 'Find Universities, Programs & Scholarships 2027 | EduExpress',
  description: `Compare universities, programs, tuition, scholarships and intakes across ${activeCountries.length} study destinations. Free education fit assessment for students in Bangladesh.`,
  path: PATH,
  image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — find universities, programs and scholarships' },
});

const discoveryPaths = [
  {
    icon: GraduationCap,
    number: '01',
    title: 'Find universities',
    copy: 'Search institution records by country, degree level and subject. Each profile shows what is verified, what it costs and when the record was last checked.',
    href: '/universities',
    cta: 'Browse university records',
    tone: 'sage',
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Compare destinations',
    copy: 'Put recognition, total cost, visa requirements and student life side by side before choosing a country.',
    href: '/compare-study-destinations',
    cta: 'Compare destinations',
    tone: 'lime',
  },
  {
    icon: BadgeDollarSign,
    number: '03',
    title: 'Understand scholarships',
    copy: 'Read eligibility, coverage, renewal conditions and the costs that remain after an award, not just the headline value.',
    href: '/scholarships',
    cta: 'Explore scholarship guidance',
    tone: 'sage',
  },
  {
    icon: SlidersHorizontal,
    number: '04',
    title: 'Match your profile',
    copy: 'Share your results, budget, language readiness and preferred intake. A counsellor reviews the realistic options with you.',
    href: '/education-fit-assessment',
    cta: 'Start the free assessment',
    tone: 'dark',
  },
] as const;

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

const nextSteps = [
  { number: '01', title: 'Profile review', copy: 'Level, results, subject, budget and intake.' },
  { number: '02', title: 'Options in writing', copy: 'Recognition, costs and entry requirements compared.' },
  { number: '03', title: 'Your decision', copy: 'Apply only when the fit and the cost are clear.' },
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

const cardTone = { sage: kit.cardSage, lime: kit.cardLime, dark: kit.cardDark } as const;

export default async function FindEducationPage() {
  const universityCount = await getUniversityCount();
  const destinations = activeCountries;

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
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Find education' }]}
        eyebrow="Universities, destinations and funding"
        title="Find universities, programs and scholarships that fit."
        lead="A free, structured starting point for students and families in Bangladesh. Compare institutions, destinations, tuition, funding and intake timing before you commit to an application."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start the free fit assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Browse university records <Search size={18} aria-hidden="true" />
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/students/students-campus.webp"
                alt="Students standing in front of an admissions banner on a university campus in China"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-4 py-3">
              <span className="block text-[14px] font-semibold text-ink-soft">The EduExpress sequence</span>
              <span className="mt-0.5 block text-[16px] font-semibold leading-6 text-petrol-800">
                Profile → comparison → clear cost → application decision
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar universities={universityCount > 0 ? universityCount : undefined} />

      <Section
        title="Four ways to research, one decision."
        intro="Each path returns to the same question: does this option fit your education, finances and readiness?"
      >
        <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          {discoveryPaths.map(({ icon: Icon, number, title, copy, href, cta, tone }) => {
            const dark = tone === 'dark';
            return (
              <li key={title}>
                <Link href={href} className={`group flex h-full flex-col transition duration-200 hover:-translate-y-1 ${cardTone[tone]}`}>
                  <span className="flex items-center justify-between gap-4">
                    <span className={dark ? kit.iconLime : kit.icon}><Icon size={22} aria-hidden="true" /></span>
                    <span className={`font-display text-[15px] font-black tracking-[0.08em] ${dark ? 'text-white/75' : 'text-ink-soft'}`}>PATH {number}</span>
                  </span>
                  <h3 className={`mt-6 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>{title}</h3>
                  <p className={`mt-2 flex-1 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{copy}</p>
                  <span className={`mt-6 inline-flex items-center gap-1.5 text-[16px] font-semibold underline-offset-4 group-hover:underline ${dark ? 'text-white' : 'text-petrol-800'}`}>
                    {cta} <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="sage" title="Go straight to the question you are researching." intro="Popular starting points for the 2027 cycle.">
        <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {startingPoints.map(point => (
            <li key={point.href}>
              <Link
                href={point.href}
                className="group flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
              >
                {point.label}
                <ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="navy"
        title="Explore every destination we support."
        intro={`${destinations.length} destinations, all open. Each route page explains recognition, indicative costs, intake timing and visa steps for that country. China carries the deepest published evidence set.`}
        action={
          <Link href="/destinations" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">
            View the destination hub <ArrowRight size={18} aria-hidden="true" />
          </Link>
        }
      >
        <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {destinations.map(country => (
            <li key={country.slug}>
              <Link
                href={destinationPath(country.slug)}
                className="group flex min-h-[72px] items-center justify-between gap-3 rounded-2xl bg-white/[0.07] px-4 py-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] hover:ring-white/25"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="text-[22px]" aria-hidden="true">{country.flag}</span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[16px] font-semibold text-white">{country.name}</strong>
                    <span className="mt-0.5 block text-[14px] font-semibold text-lime">{country.serviceStatus}</span>
                  </span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-lime transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <h2 data-anim="up" className={kit.h2}>Six facts we need before recommending anything.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              A shortlist is only useful if it matches your results and your family&apos;s budget. These are the facts a counsellor
              checks first, so the options discussed are realistic from the start.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Review my profile <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <p className="text-[15px] text-ink-soft">Free assessment · no payment details requested</p>
            </div>
          </div>

          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2">
            {readinessItems.map(item => (
              <li key={item} className="flex gap-3 rounded-2xl bg-canvas-soft px-5 py-4 text-[16px] font-semibold leading-6 text-petrol-800">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#2ead4b]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h3 className={kit.h3}>Start with a profile review, not an application.</h3>
          <ol data-anim="stagger" className="mt-5 grid gap-4 md:grid-cols-3">
            {nextSteps.map(step => (
              <li key={step.number} className={kit.cardLime}>
                <span className="font-display text-[34px] font-black leading-none text-petrol-800">{step.number}</span>
                <strong className="mt-4 block text-[18px] font-semibold text-petrol-800">{step.title}</strong>
                <span className="mt-1 block text-[16px] leading-6 text-ink-soft">{step.copy}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[16px] leading-7 text-ink-soft">
            Want to see how we charge first?{' '}
            <Link href="/fees-and-transparency" className="font-semibold text-petrol-800 underline underline-offset-4">Read our fees and transparency policy</Link>
            {' '}or{' '}
            <Link href="/how-we-verify-universities" className="font-semibold text-petrol-800 underline underline-offset-4">how we verify university records</Link>.
          </p>
        </div>
      </Section>

      <FaqBlock items={faqs} title="Clear answers before you commit." />

      <CtaBand
        title="Start with a profile review."
        text="A counsellor will review your level, results, budget and preferred intake, then explain the realistic options and the documents needed before you pay anything."
      />
    </>
  );
}

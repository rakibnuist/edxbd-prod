import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { CtaBand, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { chinaGuideMetadata, chinaGuidePages } from '@/data/chinaGuidePages';
import { evidencePages, type EvidencePage } from '@/data/evidencePages';
import { staticRouteSlugs } from '@/data/staticRoutePages';
import { countries } from '@/lib/countries';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';

type Props = { params: Promise<{ slug: string }> };

// A static segment under src/app/ always beats this catch-all, so any slug that
// also has a hand-built route must not be pre-rendered here. Static wrappers
// may reuse the shared guide data, but each URL has only one rendering owner.
const isOwnedByStaticRoute = (slug: string) => staticRouteSlugs.includes(slug);

/**
 * Search titles (45–60 chars) and descriptions (120–160 chars) for the evidence
 * pages, written from each page's own content. The data titles stay as the
 * visible H1 and breadcrumb names.
 */
const EVIDENCE_SEO: Record<string, { title: string; description: string }> = {
  'better-education-standard': {
    title: 'The Better Education Standard: 6 Checks | EduExpress',
    description:
      'The six checks EduExpress makes before recommending a study abroad option: recognition, academic fit, career value, total cost, visa readiness and support.',
  },
  'how-we-verify-universities': {
    title: 'How We Verify Universities and Programs | EduExpress',
    description:
      'How EduExpress verifies universities and programs: official names, source links, recognition evidence, fees, intake status and the date each fact was checked.',
  },
  'student-data-privacy': {
    title: 'Student Data and Document Privacy Policy | EduExpress',
    description:
      'How EduExpress handles student consent, sensitive documents, staff access and retention, and how you can ask to see, correct or delete the data we hold.',
  },
  'complaints-and-resolution': {
    title: 'Complaints and Resolution Process | EduExpress',
    description:
      'How to raise a complaint with EduExpress: a written acknowledgement within two working days, a named management owner and a written response within ten.',
  },
  'compare-study-destinations': {
    title: 'Compare Study Destinations from Bangladesh | EduExpress',
    description:
      'Compare study abroad destinations from Bangladesh by recognition, entry and language fit, total cost, funding rules, visa readiness and career pathways.',
  },
  'country-status': {
    title: 'Country Service Status for 12 Destinations | EduExpress',
    description:
      'EduExpress service status for 12 study destinations: China is the flagship service, and the UK, South Korea, Hungary, Finland and seven more are active.',
  },
};

const seoFor = (page: EvidencePage) =>
  EVIDENCE_SEO[page.slug] ?? { title: `${page.title} | EduExpress`, description: page.description };

/** Pages that list every destination service, with links to each guide. */
const DESTINATION_GRID_PAGES = new Set(['country-status', 'compare-study-destinations']);

const sectionId = (heading: string, index: number) =>
  `part-${index + 1}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

const formatDate = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(new Date(iso));

const assessmentSteps = [
  { number: '01', title: 'Profile review', text: 'Results, goals, budget and preferred intake.' },
  { number: '02', title: 'Written comparison', text: 'Recognition, costs, risks and realistic options.' },
  { number: '03', title: 'Clear next steps', text: 'Apply only when fit and costs are clear in writing.' },
];

export function generateStaticParams() {
  const evidenceSlugs = Object.keys(evidencePages).filter((slug) => !slug.includes('/'));
  const chinaGuideSlugs = Object.keys(chinaGuidePages);

  return [...new Set([...evidenceSlugs, ...chinaGuideSlugs])]
    .filter((slug) => !isOwnedByStaticRoute(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = evidencePages[slug];
  const chinaGuide = chinaGuidePages[slug];
  if (!page && !chinaGuide) return {};
  if (chinaGuide) return chinaGuideMetadata(slug);

  const seo = seoFor(page);
  return pageMetadata({ title: seo.title, description: seo.description, path: `/${slug}`, type: 'article', locale: 'en_BD' });
}

export default async function EvidencePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = evidencePages[slug];
  const chinaGuide = chinaGuidePages[slug];

  if (!page && !chinaGuide) notFound();

  if (chinaGuide) return <ChinaGuidePage guide={chinaGuide} />;

  const path = `/${slug}`;
  const canonical = absoluteUrl(path);
  const seo = seoFor(page);
  const reviewedLong = formatDate(page.reviewedAt, { day: 'numeric', month: 'long', year: 'numeric' });
  const reviewedMonth = formatDate(page.reviewedAt, { month: 'long', year: 'numeric' });
  const parts = page.sections.map((section, index) => ({ ...section, id: sectionId(section.heading, index) }));

  const showDestinations = DESTINATION_GRID_PAGES.has(slug);
  const destinations = countries
    .filter((country) => country.isActive)
    .map((country) => ({ ...country, status: country.serviceStatus ?? 'Active' }))
    .sort((a, b) => (a.status === b.status ? 0 : a.status === 'Flagship' ? -1 : 1));

  const related = [
    ...Object.values(evidencePages)
      .filter((item) => item.slug !== slug)
      .map((item) => ({ href: `/${item.slug}`, title: item.title, text: item.description })),
    {
      href: '/china-visa-first-policy',
      title: 'China visa-first service policy',
      text: 'No EduExpress service fee before China visa approval, and every earlier third-party cost itemised in writing.',
    },
    {
      href: '/fees-and-transparency',
      title: 'Fees and transparency',
      text: 'How EduExpress charges are kept separate from university, embassy and other third-party costs.',
    },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: seo.description,
        inLanguage: 'en-BD',
        dateModified: page.reviewedAt,
        datePublished: page.reviewedAt,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: page.title,
        description: seo.description,
        dateModified: page.reviewedAt,
        datePublished: page.reviewedAt,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-BD',
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
        ...(page.sources?.length
          ? { citation: page.sources.map((source) => ({ '@type': 'CreativeWork', name: source.label, url: source.href })) }
          : {}),
      },
    ],
  };

  const record = [
    { label: 'Owner', value: 'Content & Compliance' },
    { label: 'Reviewed', value: reviewedLong },
    { label: 'Sections', value: String(parts.length) },
    { label: 'Status', value: 'Public' },
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={path}
        trail={[{ name: page.title }]}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.intro}
        reviewed={reviewedMonth}
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Open the proof library
            </Link>
          </>
        }
        aside={
          <aside aria-label="About this record" className={kit.cardDark}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white/70">The record</p>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              {record.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/[0.08] px-4 py-3.5">
                  <dt className="text-[14px] text-white/70">{item.label}</dt>
                  <dd className="mt-1 text-[17px] font-semibold leading-snug text-lime">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[15px] leading-7 text-white/85">
              Every claim here is tied to a written responsibility or an official source. Private student records are never published.
            </p>
            <Link
              href="/proof-library"
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline-offset-4 hover:underline"
            >
              Inspect the proof library <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <div className={kit.cardSage}>
              <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-ink-soft">On this page</p>
              <ol className="mt-4 grid gap-1">
                {parts.map((part, index) => (
                  <li key={part.id}>
                    <a
                      href={`#${part.id}`}
                      className="flex min-h-[44px] items-start gap-3 rounded-xl px-2 py-2.5 text-[15px] font-semibold leading-6 text-petrol-800 hover:bg-white"
                    >
                      <span className="font-display text-[14px] font-black text-ink-mute">{String(index + 1).padStart(2, '0')}</span>
                      {part.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl">
            {parts.map((part, index) => (
              <section
                key={part.id}
                id={part.id}
                aria-labelledby={`${part.id}-title`}
                className="scroll-mt-28 border-t border-canvas-soft py-10 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div data-anim="up">
                  <p className={kit.badge}>Part {String(index + 1).padStart(2, '0')}</p>
                  <h2
                    id={`${part.id}-title`}
                    className="mt-4 font-display text-[30px] font-black leading-[1.05] tracking-[-0.01em] text-petrol-800 sm:text-[36px]"
                  >
                    {part.heading}
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-[17px] leading-8 text-ink-soft">{part.body}</p>
                </div>
                {part.items && part.items.length > 0 && (
                  <ul data-anim="stagger" className="mt-6 grid gap-3 sm:grid-cols-2">
                    {part.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-2xl bg-canvas-soft px-4 py-3.5 text-[16px] font-semibold leading-6 text-petrol-800">
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-lime-deep" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {page.sources?.length ? (
              <section aria-labelledby="official-sources" className="border-t border-canvas-soft pt-10">
                <h2 id="official-sources" className="font-display text-[30px] font-black leading-[1.05] text-petrol-800">
                  Official sources
                </h2>
                <p className="mt-3 text-[16px] leading-7 text-ink-soft">Links to official authorities referenced in this policy.</p>
                <ul className="mt-5 grid gap-2">
                  {page.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex min-h-[52px] items-center justify-between gap-4 rounded-2xl bg-canvas-soft px-5 py-3 text-[16px] font-semibold text-petrol-800 hover:underline"
                      >
                        {source.label}
                        <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </Section>

      {showDestinations && (
        <Section
          tone="sage"
          title="Destination services."
          intro="Every listed destination is open for counselling and application support. China is the flagship service with the deepest published evidence base."
        >
          <ul data-anim="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((country) => (
              <li key={country.slug}>
                <Link
                  href={destinationPath(country.slug)}
                  className="group flex h-full min-h-[88px] items-center justify-between gap-4 rounded-3xl bg-white px-6 py-5"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-[28px] leading-none" aria-hidden="true">{country.flag}</span>
                    <span>
                      <span className="block text-[18px] font-semibold text-petrol-800 group-hover:underline">{country.name}</span>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[14px] font-semibold ${
                          country.status === 'Flagship' ? 'bg-petrol-800 text-lime' : 'bg-lime-pale text-lime-deep'
                        }`}
                      >
                        {country.status}
                      </span>
                    </span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 text-petrol-800" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        tone={showDestinations ? 'white' : 'sage'}
        title="Related policies and standards."
        intro="The written rules behind every EduExpress recommendation, payment and record."
      >
        <ul data-anim="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex h-full flex-col rounded-3xl p-6 sm:p-7 ${showDestinations ? 'bg-canvas-soft' : 'bg-white'}`}
              >
                <span className={`${kit.h3} group-hover:underline`}>{item.title}</span>
                <span className="mt-2 flex-1 text-[16px] leading-7 text-ink-soft">{item.text}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-petrol-800">
                  Read the page <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone={showDestinations ? 'sage' : 'white'} title="Compare before you commit.">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className={kit.lead}>
              Share your academic profile, subject, budget, intake, language readiness and career goal. We identify suitable routes,
              risks and missing information in writing before you commit.
            </p>
            <ol data-anim="stagger" className="mt-8 grid gap-3">
              {assessmentSteps.map((step) => (
                <li key={step.number} className={`flex gap-4 ${showDestinations ? kit.card : kit.cardSage}`}>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime font-display text-[15px] font-black text-petrol-800">
                    {step.number}
                  </span>
                  <span>
                    <span className="block text-[18px] font-semibold text-petrol-800">{step.title}</span>
                    <span className="mt-0.5 block text-[16px] leading-7 text-ink-soft">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Start my assessment <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ed-btn ed-btn-outline min-h-[52px] px-7">Talk to a counsellor</Link>
            </div>
          </div>
          <figure data-anim="up" className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/consultation-student-parent.webp"
                alt="An EduExpress counsellor reviewing study options with a student and parent at the Dhanmondi office"
                fill
                sizes="(max-width:1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </Section>

      {showDestinations ? (
        <CtaBand />
      ) : (
        <CtaBand
          title="Questions about this policy?"
          text="Visit our Dhanmondi office or start the free assessment online. A counsellor replies within one working day with a written summary of suitable routes."
        />
      )}
    </>
  );
}

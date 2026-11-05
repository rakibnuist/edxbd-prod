import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, BadgeCheck, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import { evidencePages } from '@/data/evidencePages';
import ChinaGuidePage from '@/components/china/ChinaGuidePage';
import { chinaGuideMetadata, chinaGuidePages } from '@/data/chinaGuidePages';
import { staticRouteSlugs } from '@/data/staticRoutePages';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

type Props = { params: Promise<{ slug: string }> };

// A static segment under src/app/ always beats this catch-all, so any slug that
// also has a hand-built route must not be pre-rendered here. Static wrappers
// may reuse the shared guide data, but each URL has only one rendering owner.
const isOwnedByStaticRoute = (slug: string) => staticRouteSlugs.includes(slug);

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
  if (chinaGuide) {
    return chinaGuideMetadata(slug);
  }

  const canonical = absoluteUrl(`/${slug}`);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: 'article',
      siteName: 'EduExpress International',
      locale: 'en_BD',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${page.title} | EduExpress International`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
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
}

export default async function EvidencePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = evidencePages[slug];
  const chinaGuide = chinaGuidePages[slug];

  if (!page && !chinaGuide) notFound();

  if (chinaGuide) return <ChinaGuidePage guide={chinaGuide} />;

  const canonical = absoluteUrl(`/${slug}`);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: 'en-BD',
        dateModified: page.reviewedAt,
        datePublished: page.reviewedAt,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: page.title,
        description: page.description,
        dateModified: page.reviewedAt,
        datePublished: page.reviewedAt,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-BD',
        mainEntityOfPage: { '@id': `${canonical}#webpage` },
      },
      ...(page.sources?.length
        ? [
            {
              '@type': 'WebPage',
              name: 'Referenced sources',
              about: page.sources.map((source) => ({
                '@type': 'WebPage',
                name: source.label,
                url: source.href,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="overflow-x-clip bg-chalk text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule bg-chalk">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-20 size-[380px] rounded-full bg-sky-400/20 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-4 pb-14 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
          <Breadcrumbs items={[{ name: page.title }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <p className="ed-label">{page.eyebrow}</p>
              <h1 className="ed-home-display mt-5 max-w-[18ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-ink">
                {page.title}
              </h1>
              <p className="mt-5 max-w-[58ch] text-[15px] leading-8 text-ink-soft">{page.intro}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Start free fit assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">
                  Open proof library <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-mute">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-jade" aria-hidden="true" />
                  Owned by Content &amp; Compliance
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-jade" aria-hidden="true" />
                  Official sources &amp; written responsibilities
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li>Reviewed {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(page.reviewedAt))}</li>
              </ul>
            </div>

            <aside className="rounded-[22px] border border-rule bg-white p-6 shadow-lift">
              <p className="ed-label">The record</p>
              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-rule bg-rule">
                <div className="bg-white p-4">
                  <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Owner</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-ink">Content &amp; Compliance</dd>
                </div>
                <div className="bg-white p-4">
                  <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Reviewed</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-ink">
                    {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(page.reviewedAt))}
                  </dd>
                </div>
                <div className="bg-white p-4">
                  <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Sources</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-ink">Official</dd>
                </div>
                <div className="bg-white p-4">
                  <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Status</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-jade">Public</dd>
                </div>
              </dl>
              <p className="mt-4 text-[14px] leading-6 text-ink-soft">
                Every claim here is tied to a written responsibility or an official source. Private student records are never published.
              </p>
              <Link href="/proof-library" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-petrol-700 hover:text-petrol-900">
                Inspect the proof library <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-section sm:px-6 lg:px-10">
        <div className="mx-auto max-w-shell">
          <div className="grid gap-5">
            {page.sections.map((section, idx) => (
              <article
                key={section.heading}
                className="overflow-hidden rounded-[32px] border border-rule bg-white shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)]"
              >
                <div className="flex flex-col gap-4 border-b border-rule p-7 sm:flex-row sm:items-start sm:justify-between sm:p-9">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="ed-figure text-[13px] font-bold tracking-[0.14em] text-ink-mute">
                        SECTION {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px w-6 bg-rule-strong" aria-hidden="true" />
                    </div>
                    <h2 className="ed-home-display mt-4 text-[clamp(1.7rem,2.8vw,2.4rem)] leading-[1.08] text-ink">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-rule-strong bg-chalk-100 px-3 py-1.5 text-[13px] font-semibold text-petrol-700">
                    <FileText size={13} aria-hidden="true" />
                    EduExpress standard
                  </div>
                </div>
                <div className="p-7 sm:p-9">
                  <p className="max-w-[86ch] whitespace-pre-line text-[14px] leading-8 text-ink-soft">{section.body}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 rounded-2xl border border-rule bg-chalk-100 px-4 py-3 text-[15px] font-semibold leading-6 text-ink"
                        >
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-jade" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}

            {page.sources?.length ? (
              <article className="rounded-[32px] border border-rule bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] sm:p-9">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="ed-label">References</p>
                    <h2 className="ed-display mt-4 text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.08] text-ink">
                      Official sources
                    </h2>
                    <p className="mt-2 text-[15px] text-ink-soft">
                      Links to official authorities referenced in this policy.
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-2">
                  {page.sources.map((source) => (
                    <li key={source.href}>
                      <a
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-rule bg-chalk-100 px-5 py-4 transition-colors hover:border-petrol-400/40 hover:bg-mint-100"
                        href={source.href}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        <span className="text-[15px] font-semibold text-ink">{source.label}</span>
                        <ArrowUpRight size={16} className="shrink-0 text-petrol-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}

            {/* CTA */}
            <section className="ed-band ed-band-sky relative overflow-hidden rounded-[28px] border border-rule px-6 py-10 sm:px-9 lg:px-12 lg:py-12">
              <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
                <div>
                  <p className="ed-label">Compare before you commit</p>
                  <h2 className="ed-home-display mt-4 max-w-[26ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.04] text-ink">
                    Get your free education fit assessment
                  </h2>
                  <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-ink-soft">
                    Share your academic profile, subject, budget, intake, language readiness and career goal. We&apos;ll identify suitable routes, risks and missing information in writing before you commit.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary min-h-12 px-6">
                      Start my assessment <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link href="/contact" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">
                      Talk to a counsellor <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <ol className="grid gap-2.5 text-[15px]">
                  {[
                    ['01', 'Profile review', 'Results, goals, budget and preferred intake.'],
                    ['02', 'Written comparison', 'Recognition, costs, risks and realistic options.'],
                    ['03', 'Clear next steps', 'Apply only when fit and costs are clear in writing.'],
                  ].map(([number, title, copy]) => (
                    <li key={title} className="flex gap-4 rounded-2xl border border-white bg-white px-4 py-3.5 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)]">
                      <span className="ed-figure text-[13px] font-bold tracking-[0.12em] text-petrol-600">{number}</span>
                      <span>
                        <strong className="block text-[15px] font-semibold text-ink">{title}</strong>
                        <span className="mt-0.5 block text-[13px] leading-5 text-ink-soft">{copy}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  Landmark,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCover, { destinationPhoto } from '@/components/destinations/DestinationCover';
import { countries } from '@/lib/countries';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';

type Props = { params: Promise<{ country: string }> };

function RouteDetail({
  icon: Icon,
  title,
  children,
  open = false,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details
      open={open}
      className="group mt-5 overflow-hidden rounded-[26px] border border-rule bg-white shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)] open:shadow-[0_30px_70px_-40px_rgba(15,53,87,0.42)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 sm:px-8 sm:py-6">
        <span className="flex items-center gap-4 text-petrol-700">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint-100 ring-1 ring-petrol-400/10">
            <Icon size={21} aria-hidden="true" />
          </span>
          <h2 className="ed-home-display text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight text-ink">{title}</h2>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-rule-strong bg-chalk-100 text-lg font-bold text-petrol-600 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-rule px-6 pb-7 pt-6 sm:px-8 sm:pb-9">{children}</div>
    </details>
  );
}

function getLastReviewed(country: (typeof countries)[number]) {
  if (country.reviewerInfo?.lastVerifiedDate) {
    const date = new Date(`${country.reviewerInfo.lastVerifiedDate} 1`);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
    }
  }
  return '4 November 2026';
}

export function generateStaticParams() {
  return countries.map(({ slug }) => ({ country: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) return { title: 'Country Not Found' };

  const china = country.slug === 'china';
  const path = china ? '/study-in-china-from-bangladesh' : `/study-in-${slug}-from-bangladesh`;
  const canonical = absoluteUrl(path);
  const title = country.metaTitle || (china ? 'Study in China from Bangladesh' : `Study in ${country.name} from Bangladesh | Universities, Costs, Visa`);
  const description =
    country.metaDescription ||
    (china
      ? 'Study in China from Bangladesh with CSC scholarships, university checks, written costs and visa-first guidance.'
      : `Study in ${country.name} from Bangladesh. Compare universities, programs, recognition, tuition, living costs, scholarships and visa readiness with evidence-based guidance.`);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'EduExpress International',
      locale: 'en_BD',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Study in ${country.name} from Bangladesh | EduExpress International`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) notFound();
  if (country.slug === 'china') permanentRedirect('/study-in-china-from-bangladesh');

  const programAreas = country.programs.length
    ? country.programs
    : ['Business', 'Technology', 'Health and Social Sciences', 'International programs'];

  const path = `/study-in-${slug}-from-bangladesh`;
  const pageUrl = absoluteUrl(path);
  const heroImage = destinationPhoto(slug) ?? '/og-image.jpg';
  const lastReviewed = getLastReviewed(country);
  const verifiedDate = country.reviewerInfo?.lastVerifiedDate ? new Date(`${country.reviewerInfo.lastVerifiedDate} 1`) : null;
  const dateModified =
    verifiedDate && !Number.isNaN(verifiedDate.getTime())
      ? verifiedDate.toISOString().slice(0, 10)
      : '2026-11-04';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Study in ${country.name} from Bangladesh`,
        description:
          country.metaDescription ||
          `Education fit, institution checks, recognition, clear costs and visa readiness for studying in ${country.name} from Bangladesh.`,
        inLanguage: 'en-BD',
        dateModified,
        datePublished: '2026-01-01',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl(heroImage),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Destinations', item: absoluteUrl('/destinations') },
          { '@type': 'ListItem', position: 3, name: `Study in ${country.name} from Bangladesh`, item: pageUrl },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#programs`,
        name: `Popular study areas in ${country.name} for Bangladeshi students`,
        numberOfItems: programAreas.length,
        itemListElement: programAreas.map((program, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: program,
        })),
      },
      ...(country.universities && country.universities.length > 0
        ? [
            {
              '@type': 'ItemList',
              '@id': `${pageUrl}#universities`,
              name: `Institutions noted for ${country.name}`,
              numberOfItems: country.universities.length,
              itemListElement: country.universities.map((university, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: university,
              })),
            },
          ]
        : []),
      ...(country.faqs && country.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${pageUrl}#faq`,
              mainEntity: country.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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

        <div className="relative mx-auto max-w-shell px-4 pb-16 pt-[104px] sm:px-6 lg:px-10 lg:pb-20 lg:pt-[142px]">
          <Breadcrumbs
            items={[
              { name: 'Destinations', href: '/destinations' },
              { name: `Study in ${country.name} from Bangladesh` },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-12">
            <div className="min-w-0">
              <p className="ed-label">
                <span aria-hidden="true">{country.flag}</span> {country.serviceStatus || 'Active'} destination service
              </p>
              <h1 className="ed-home-display mt-4 max-w-[17ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-ink">
                Study in {country.name} from Bangladesh
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14.5px] leading-7 text-ink-soft">
                {country.valueStatement ||
                  `EduExpress supports Bangladeshi students with education fit, institution checks, written costs, application guidance and visa readiness for ${country.name}. Recommendations are evidence-based and explained before any commitment.`}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Start free education fit assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/find-education" className="ed-btn ed-btn-outline min-h-12 bg-white px-6">
                  Research universities <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-mute">
                <li className="inline-flex items-center gap-1.5">
                  <BadgeCheck size={13} className="text-jade" aria-hidden="true" />
                  Institution checks &amp; recognition review
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li className="inline-flex items-center gap-1.5">
                  <CircleDollarSign size={13} className="text-jade" aria-hidden="true" />
                  Clear cost review before application
                </li>
                <li aria-hidden="true" className="text-ink-mute/40">·</li>
                <li>Reviewed {lastReviewed}</li>
              </ul>
            </div>

            <div className="relative min-w-0">
              <figure className="overflow-hidden rounded-[20px] border border-rule bg-white p-2 shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-petrol-900">
                  <DestinationCover
                    slug={slug}
                    name={country.name}
                    flag={country.flag}
                    priority
                    sizes="(max-width:1024px) 100vw, 560px"
                    className="ed-photo-settle"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petrol-900/55 via-transparent to-transparent" aria-hidden="true" />
                  <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-4 py-3 backdrop-blur">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-petrol-600">Evidence-first guidance</p>
                    <p className="mt-1 text-[14px] font-semibold leading-5 text-ink">
                      Recognition • Total costs • Visa readiness • Realistic fit
                    </p>
                  </figcaption>
                </div>
              </figure>

              <div className="absolute -left-2 -top-4 hidden rounded-2xl border border-rule bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(7,28,46,0.35)] sm:block">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-mute">Next deadline</span>
                <strong className="mt-1 block text-[15px] text-ink">{country.nextDeadline || 'Check current cycle'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section aria-label="Quick facts" className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-10">
        <dl className="mx-auto grid max-w-shell grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-rule bg-rule shadow-[0_30px_70px_-48px_rgba(15,53,87,0.5)] sm:grid-cols-4">
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Primary intakes</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">{country.intakesText || 'Confirmed per intake'}</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Next major deadline</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">{country.nextDeadline || 'Check current cycle'}</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Indicative tuition</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">{country.costs?.tuition || 'Varies by institution'}</dd>
          </div>
          <div className="bg-white px-5 py-5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Indicative living</dt>
            <dd className="mt-2 text-[14px] font-semibold text-ink">{country.costs?.living || 'Varies by city'}</dd>
          </div>
        </dl>
      </section>

      <div className="mx-auto max-w-shell px-4 pb-24 pt-10 sm:px-6 lg:px-10 lg:pt-12">
        {/* Who this route fits */}
        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[28px] border border-jade/20 bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] md:p-9">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-mint-100 text-jade">
                <CheckCircle2 size={22} aria-hidden="true" />
              </span>
              <h2 className="ed-home-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink">Who this route fits</h2>
            </div>
            <ul className="mt-6 grid gap-4">
              {(country.whoItFits || [
                'Students who want a clear comparison of recognition, total cost and entry rules before applying.',
                'Families looking for written costs and realistic timelines.',
                'Applicants ready to build a complete, verifiable file.',
              ]).map((point, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-7 text-ink-soft">
                  <Check size={18} className="mt-1 shrink-0 text-jade" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[28px] border border-marigold/30 bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] md:p-9">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-sky-100 text-petrol-700">
                <Info size={22} aria-hidden="true" />
              </span>
              <h2 className="ed-home-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-ink">Check before choosing</h2>
            </div>
            <ul className="mt-6 grid gap-4">
              {(country.whoShouldReconsider || [
                'Do not rely on part-time work alone to cover tuition and living costs.',
                'Verify recognition for your specific program and career/licensing goals.',
                'Visa rules change frequently — always check current official guidance for your intake.',
              ]).map((point, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-7 text-ink-soft">
                  <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-petrol-500" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* Detailed modules */}
        <section className="mt-10">
          <RouteDetail icon={Landmark} title="Education system and recognition" open>
            <p className="max-w-[76ch] text-[14px] leading-8 text-ink-soft">
              {country.educationSystemAndRecognition ||
                'Education quality, recognition, and accreditation are reviewed against published official sources. Always confirm recognition for your exact program and intended career path.'}
            </p>
          </RouteDetail>

          <RouteDetail icon={GraduationCap} title="Universities, programs and entry focus">
            <p className="max-w-[76ch] text-[14px] leading-8 text-ink-soft">
              EduExpress focuses on institution checks and program fit for Bangladeshi students. Popular study areas for {country.name} include:
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {programAreas.map((program) => (
                <span
                  key={program}
                  className="rounded-full border border-rule-strong bg-chalk-100 px-4 py-2 text-[14px] font-semibold text-petrol-700"
                >
                  {program}
                </span>
              ))}
            </div>
            {country.universities && country.universities.length > 0 && (
              <div className="mt-8 rounded-[22px] border border-rule bg-chalk-100 p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-petrol-600" aria-hidden="true" />
                  <h3 className="ed-home-display text-[19px] text-ink">Institutions noted in current guidance</h3>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {country.universities.map((university) => (
                    <li key={university} className="flex items-center gap-2 text-[15px] text-ink-soft">
                      <Check size={16} className="shrink-0 text-jade" aria-hidden="true" />
                      <span>{university}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-ink-mute">
                  Availability changes by intake. Always confirm current admission status for your chosen intake.
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/universities" className="ed-btn ed-btn-outline min-h-10">
                Browse university records <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
              <Link href="/find-education" className="ed-btn ed-btn-ghost min-h-10">
                Research by program <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </RouteDetail>

          <RouteDetail icon={FileText} title="Admission requirements for Bangladeshi students">
            <p className="max-w-[76ch] text-[14px] leading-8 text-ink-soft">
              Requirements vary by institution and intake. Use this as a starting checklist — confirm the exact list in writing for your shortlisted program.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-rule bg-white p-6">
                <h3 className="ed-home-display text-[18px] text-ink">Language & academics</h3>
                <ul className="mt-4 grid gap-3">
                  {(country.requirements?.language || []).map((req, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-7 text-ink-soft">
                      <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-petrol-500" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[22px] border border-rule bg-white p-6">
                <h3 className="ed-home-display text-[18px] text-ink">Documents to prepare</h3>
                <ul className="mt-4 grid gap-3">
                  {(country.requirements?.documents || []).map((req, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-7 text-ink-soft">
                      <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-petrol-500" aria-hidden="true" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RouteDetail>

          <RouteDetail icon={CircleDollarSign} title="Cost, fees and funding reality">
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Indicative tuition</p>
                <p className="mt-2 ed-home-display text-[20px] leading-snug text-ink">{country.costs?.tuition || 'Varies widely by institution'}</p>
                <p className="mt-2 text-[14px] text-ink-mute">Currency: {country.costs?.currency || 'Check with institution'}</p>
              </article>
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Indicative living costs</p>
                <p className="mt-2 ed-home-display text-[20px] leading-snug text-ink">{country.costs?.living || 'Varies by city and lifestyle'}</p>
                <p className="mt-2 text-[14px] text-ink-mute">Prepare a dated, itemised cost sheet</p>
              </article>
            </div>
            {country.scholarships && country.scholarships.length > 0 && (
              <div className="mt-6 rounded-[22px] border border-rule bg-chalk-100 p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <BadgeCheck size={18} className="text-petrol-600" aria-hidden="true" />
                  <h3 className="ed-home-display text-[19px] text-ink">Funding opportunities to check</h3>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {country.scholarships.map((scholarship) => (
                    <div key={scholarship} className="flex items-center gap-3 rounded-xl border border-white bg-white px-4 py-3 text-[15px] font-semibold text-ink">
                      <Check size={16} className="shrink-0 text-jade" aria-hidden="true" />
                      <span>{scholarship}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-ink-mute">
                  Eligibility changes by intake. Always confirm coverage, renewal conditions and costs that remain.
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/scholarships" className="ed-btn ed-btn-outline min-h-10">
                Scholarship guidance <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-ghost min-h-10">
                Fees & transparency <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </RouteDetail>

          <RouteDetail icon={FileCheck2} title="Visa, residence and documentation">
            <p className="max-w-[76ch] text-[14px] leading-8 text-ink-soft">
              Visa decisions are made solely by the relevant immigration authority. EduExpress checks your file against published requirements and flags gaps before submission.
            </p>
            <ul className="mt-5 grid gap-3">
              {(country.requirements?.visa || []).map((visa, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-rule bg-chalk-100 p-4 text-[15px] leading-7 text-ink-soft">
                  <ArrowRight size={16} className="mt-1 shrink-0 text-petrol-600" aria-hidden="true" />
                  <span>{visa}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-ink-mute">
              Processing times, fees and forms change. Always verify against the official embassy/consulate website for your intake.
            </p>
          </RouteDetail>

          <RouteDetail icon={Briefcase} title="Work rights, careers and realistic expectations">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <div className="flex items-center gap-2 text-jade">
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <h3 className="ed-home-display text-[18px] text-ink">Work rights</h3>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                  {country.workRightsAndCareer?.rights || 'Check current student work rules with the official immigration source.'}
                </p>
              </article>
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <div className="flex items-center gap-2 text-petrol-600">
                  <ArrowUpRight size={18} aria-hidden="true" />
                  <h3 className="ed-home-display text-[18px] text-ink">Career opportunities</h3>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                  {country.workRightsAndCareer?.opportunities || 'Outcomes depend on skills, language, networking and the job market at graduation.'}
                </p>
              </article>
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <div className="flex items-center gap-2 text-petrol-700">
                  <Info size={18} aria-hidden="true" />
                  <h3 className="ed-home-display text-[18px] text-ink">Reality check</h3>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                  {country.workRightsAndCareer?.caveats ||
                    'Do not rely on part-time work to cover tuition. Post-study rules change frequently — verify for your exact intake.'}
                </p>
              </article>
            </div>
          </RouteDetail>

          <RouteDetail icon={Calendar} title="Intakes, deadlines and timing">
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-[22px] border border-rule bg-chalk-100 p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Primary intakes</p>
                <p className="mt-2 ed-home-display text-[20px] text-ink">{country.intakesText || 'Confirmed per institution'}</p>
              </article>
              <article className="rounded-[22px] border border-rule bg-chalk-100 p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Next major deadline</p>
                <p className="mt-2 ed-home-display text-[20px] text-ink">{country.nextDeadline || 'Contact us for current deadlines'}</p>
              </article>
            </div>
            <p className="mt-4 text-[14px] text-ink-mute">
              Deadlines are often tied to scholarship rounds and visa processing. Start early to avoid last-minute document gaps.
            </p>
          </RouteDetail>

          <RouteDetail icon={ShieldCheck} title="Compare {country.name} with realistic alternatives">
            <p className="max-w-[76ch] text-[14px] leading-8 text-ink-soft">
              Compare fit by recognition, total cost, language of instruction, post-study options and timeline — not just tuition alone.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <h3 className="ed-home-display text-[19px] text-ink">vs {country.comparisons?.countryA || 'Another destination'}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                  {country.comparisons?.countryA_description ||
                    'Consider recognition, total cost, visa rules and career fit side by side for your goals.'}
                </p>
              </article>
              <article className="rounded-[22px] border border-rule bg-white p-6">
                <h3 className="ed-home-display text-[19px] text-ink">vs {country.comparisons?.countryB || 'Another destination'}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">
                  {country.comparisons?.countryB_description ||
                    'Compare realistic scholarship access, living costs and application timelines before deciding.'}
                </p>
              </article>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-10">
                Compare all destinations <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </RouteDetail>
        </section>

        {/* FAQ */}
        {country.faqs && country.faqs.length > 0 && (
          <section className="mt-10 rounded-[32px] border border-rule bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] sm:p-9 lg:p-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="ed-label">Frequently asked questions</p>
                <h2 className="ed-display mt-4 text-[clamp(2rem,4vw,2.8rem)] leading-[1.06] text-ink">
                  {country.name} study FAQs for Bangladeshi students
                </h2>
                <p className="mt-3 max-w-[56ch] text-[14px] leading-7 text-ink-soft">
                  Practical answers based on published guidance. Rules can change — always confirm for your exact intake.
                </p>
              </div>
              <Link href="/contact" className="ed-btn ed-btn-outline min-h-11 w-fit">
                Ask a counsellor <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-3">
              {country.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-[20px] border border-rule bg-chalk-100 px-5 shadow-[0_16px_36px_-32px_rgba(15,53,87,0.45)] open:border-[#cfe7f5] open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 ed-home-display text-[17px] leading-snug text-ink">
                    {faq.question}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-rule-strong bg-white text-[16px] leading-none text-petrol-600 transition group-open:rotate-45 group-open:border-petrol-400 group-open:bg-mint-100">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-10 text-[15px] leading-7 text-ink-soft">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Trust & verification */}
        <section className="mt-10 rounded-[32px] border border-rule bg-white p-7 shadow-[0_24px_60px_-52px_rgba(15,53,87,0.5)] sm:p-9 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[60ch]">
              <p className="ed-label">Trust & verification</p>
              <h2 className="ed-display mt-4 text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.08] text-ink">
                Evidence-first, updated against official sources
              </h2>
              <p className="mt-4 text-[14px] leading-7 text-ink-soft">
                Information on this page is reviewed against published embassy, immigration, higher education and scholarship sources. We state costs as indicative and always itemise fees in writing before you proceed.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-rule bg-chalk-100 p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Reviewed by</p>
                <p className="mt-2 ed-home-display text-[18px] text-ink">{country.reviewerInfo?.name || 'EduExpress Review Team'}</p>
                <p className="mt-1 text-[15px] text-ink-soft">{country.reviewerInfo?.role || 'Admissions & Compliance'}</p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-rule-strong bg-white px-3 py-1 text-[13px] font-semibold text-petrol-700">
                  <BadgeCheck size={13} aria-hidden="true" />
                  Last verified: {lastReviewed}
                </p>
              </div>
              <div className="rounded-[22px] border border-rule bg-chalk-100 p-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-mute">Primary sources</p>
                <ul className="mt-3 grid gap-2">
                  {(country.reviewerInfo?.primarySources || [
                    'Official embassy/consulate guidance',
                    'Higher education authority',
                    'Immigration authority',
                  ]).map((source, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] leading-6 text-ink-soft">
                      <Check size={16} className="mt-0.5 shrink-0 text-jade" aria-hidden="true" />
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-ghost min-h-10">
              China visa-first payment terms <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/fees-and-transparency" className="ed-btn ed-btn-ghost min-h-10">
              Fees & transparency <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/about" className="ed-btn ed-btn-ghost min-h-10">
              About EduExpress <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="ed-band ed-band-navy relative mt-10 overflow-hidden rounded-[34px] px-6 py-12 sm:px-9 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 ed-grid-lines" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -top-28 size-[420px] rounded-full bg-sky-500/25 blur-[110px]" aria-hidden="true" />
          <div className="relative grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2.5 text-[14px] font-bold text-mint-300">
                <span className="h-px w-7 bg-mint-300" aria-hidden="true" /> Next step
              </p>
              <h2 className="ed-display mt-4 max-w-[26ch] text-[clamp(2.1rem,4vw,3.2rem)] leading-[1.04] text-white">
                Start with an education fit assessment for {country.name}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-white/80">
                Share your results, budget, intake and goals. We&apos;ll review realistic options for {country.name}, flag risks and costs in writing, and tell you exactly what&apos;s missing before you commit to an application.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-12 px-6">
                  Get my free assessment <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href={destinationPath('china') === '/study-in-china-from-bangladesh' ? '/study-in-china-from-bangladesh' : '/destinations'} className="ed-btn ed-btn-on-dark min-h-12 px-6">
                  Explore other destinations <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-4 text-[13px] text-white/60">
                No obligation. For China, no EduExpress service fee before China visa approval.
              </p>
            </div>

            <ol className="grid gap-3 text-[15px] text-white/85">
              {[
                ['01', 'Profile review', 'Level, results, subject, budget and preferred intake.'],
                ['02', 'Written shortlist', 'Recognition, costs, entry rules and realistic fit compared.'],
                ['03', 'Clear next steps', 'Apply only when fit, timeline and costs are clear in writing.'],
              ].map(([number, title, copy]) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
                  <span className="ed-figure text-[13px] font-bold tracking-[0.12em] text-mint-300">{number}</span>
                  <span>
                    <strong className="block text-[15px] font-semibold text-white">{title}</strong>
                    <span className="mt-0.5 block text-[13px] leading-5 text-white/70">{copy}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}

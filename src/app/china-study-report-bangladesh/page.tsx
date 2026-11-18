import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  FileCheck2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { getPublishedStories } from '@/app/success-stories/stories';
import ReportCitationActions from '@/components/china/ReportCitationActions';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import {
  buildChinaBenchmark,
  CHINA_REPORT_OFFICIAL_AUTHORITIES,
  type NumericDistribution,
} from '@/lib/china-benchmark';
import {
  CHINA_INTAKE_VERIFIED_ON,
  getChinaIntakes,
} from '@/lib/china-intakes';
import { config } from '@/lib/config';
import { citationJsonLd } from '@/lib/json-ld';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

const SITE = 'https://eduexpressint.com';
const PATH = '/china-study-report-bangladesh';
const VISA_FIRST_TERMS =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

const formatCny = (amount: number | null) =>
  amount === null ? '—' : `CNY ${amount.toLocaleString('en-US')}`;

const formatRange = (min: number | null, max: number | null) =>
  min === null || max === null
    ? '—'
    : min === max
      ? formatCny(min)
      : `${formatCny(min)} – ${formatCny(max)}`;

const reportFaqs = [
  {
    question: 'How does EduExpress calculate China tuition quartiles in this report?',
    answer:
      'Every figure comes directly from recorded programme rows in the EduExpress university catalogue. Only records stating one explicit annual CNY fee (without ranged estimates or conditional waivers) enter the quartile calculation so ranges are never averaged into guesses.',
  },
  {
    question: 'Why are some universities listed as “under verification” rather than fully verified?',
    answer:
      'EduExpress refuses to mark a record verified unless an admissions check has been completed within the current review cycle and linked to primary documentation. Showing both verified and under-verification counts lets families, journalists and partner offices see exactly what still needs a current-intake check before payment.',
  },
  {
    question: 'Are EduExpress service fees included in the CNY university totals?',
    answer:
      'No. University charges are kept in CNY, while EduExpress service packages are kept in BDT under separate terms. Under the China visa-first policy, there is no file opening charge and no EduExpress service fee before China visa approval.',
  },
  {
    question: 'Can media outlets, researchers or school counsellors cite numbers from this page?',
    answer:
      'Yes. Journalists, school career offices, student advisors and researchers may cite figures directly from this live report with attribution to EduExpress International and a link to eduexpressint.com/china-study-report-bangladesh, noting the exact verification scope and currency (CNY).',
  },
  {
    question: 'Does a CSC scholarship waive non-tuition arrival costs in China?',
    answer:
      'A full CSC Type A or Type B award typically covers tuition, university dormitory accommodation, comprehensive medical insurance and a monthly living stipend. Airfare, passport, notarisation, health check before departure and personal transition cash remain separate.',
  },
];

const relatedGuides = [
  { label: 'Study in China from Bangladesh (pillar)', href: '/study-in-china-from-bangladesh' },
  { label: 'Browse Chinese university directory', href: '/china-universities' },
  { label: 'Search programs & annual CNY fees', href: '/programs' },
  { label: 'Compare first-year costs side-by-side', href: '/compare-costs' },
  { label: 'CSC scholarship from Bangladesh', href: '/csc-scholarship-bangladesh' },
  { label: 'MBBS in China & BMDC pathway', href: '/mbbs-in-china-bangladesh' },
  { label: 'China visa-first payment policy', href: '/china-visa-first-policy' },
  { label: 'বাংলাদেশীদের জন্য চীনে পড়াশোনা (বাংলা)', href: '/bn/study-in-china' },
];

export async function generateMetadata() {
  const universities = await getUniversityRecords('China');
  const count = universities.length;
  return pageMetadata({
    title: 'Bangladesh to China Study Data & Cost Report | EduExpress',
    description: `Live data across ${count} Chinese universities: explicit CNY tuition quartiles, first-year non-tuition fees, scholarships, intakes and verification checks.`,
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china', 'Bangladeshi students on a Chinese university campus'),
  });
}

function TuitionRow({
  label,
  href,
  dist,
}: {
  label: string;
  href: string;
  dist: NumericDistribution;
}) {
  return (
    <tr className="border-t border-canvas-soft">
      <th scope="row" className="px-5 py-4 align-top font-semibold text-petrol-800">
        <Link href={href} className="underline decoration-lime-deep/40 underline-offset-4 hover:text-lime-deep">
          {label}
        </Link>
      </th>
      <td className="px-5 py-4 align-top text-ink-soft">{dist.count}</td>
      <td className="px-5 py-4 align-top text-ink-soft">{formatCny(dist.min)}</td>
      <td className="px-5 py-4 align-top font-semibold text-petrol-800">{formatCny(dist.median)}</td>
      <td className="px-5 py-4 align-top text-ink-soft">{formatRange(dist.q1, dist.q3)}</td>
      <td className="px-5 py-4 align-top text-ink-soft">{formatCny(dist.max)}</td>
    </tr>
  );
}

export default async function ChinaStudyReportPage() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords('China'),
    getPublishedStories({ country: { contains: 'China' } }),
  ]);
  const intakes = getChinaIntakes(now);
  const report = buildChinaBenchmark(universities, intakes, stories.length, now);
  const url = `${SITE}${PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Report'],
        '@id': `${url}#page`,
        url,
        mainEntityOfPage: url,
        name: 'Bangladesh to China Study Data & Cost Benchmark Report',
        headline: 'Bangladesh to China Study Data & Cost Benchmark Report | EduExpress International',
        description: `Live catalogue benchmark covering ${report.universityCount} Chinese universities, ${report.programCounts.total} degree and language programmes, CNY tuition quartiles, and ${report.scholarshipTotal} recorded scholarships.`,
        image: `${SITE}/og/china.jpg`,
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og/china.jpg` },
        inLanguage: 'en-BD',
        isAccessibleForFree: true,
        datePublished: report.latestVerifiedIso ? `${report.latestVerifiedIso}T00:00:00Z` : '2026-11-15T00:00:00Z',
        dateModified: report.latestVerifiedIso ? `${report.latestVerifiedIso}T00:00:00Z` : '2026-11-15T00:00:00Z',
        author: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        mainEntity: { '@id': `${url}#dataset` },
        ...citationJsonLd([...CHINA_REPORT_OFFICIAL_AUTHORITIES]),
      },
      {
        '@type': 'Dataset',
        '@id': `${url}#dataset`,
        name: 'EduExpress Bangladesh-to-China University Tuition, Fee & Scholarship Dataset',
        description: `Structured database counts and explicit annual CNY tuition distributions across ${report.universityCount} active Chinese universities in ${report.cityCount} cities tracked for Bangladeshi students.`,
        url,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        ...(report.latestVerifiedIso ? { dateModified: `${report.latestVerifiedIso}T00:00:00Z` } : {}),
        measurementTechnique:
          'Direct aggregation of active university catalogue profiles with explicit single-year CNY tuition and non-tuition fee schedules; no synthetic currency conversion.',
        creator: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        spatialCoverage: { '@type': 'Place', name: 'China and Bangladesh' },
        temporalCoverage: '2026/2027',
        distribution: [
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE}/china-study-report.json`,
          },
        ],
        variableMeasured: [
          'Annual programme tuition in CNY',
          'First-year university non-tuition charges in CNY',
          'Scholarship counts by awarding body',
          'City distribution of English-taught Chinese universities',
        ],
        keywords: [
          'China university tuition benchmark',
          'CSC scholarship data Bangladesh',
          'Study in China fee distributions',
          'Bangladesh to China university dataset',
        ],
      },
    ],
  };

  return (
    <article>
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Study in China', path: '/study-in-china-from-bangladesh' },
          { name: 'Data & cost benchmark report' },
        ]}
        eyebrow="Live Catalogue Benchmark · China 2027"
        title="Bangladesh to China Study Data & Cost Report."
        lead={`A live, strictly source-computed benchmark across ${report.universityCount} Chinese universities in ${report.cityCount} cities — built for students, parents, school counsellors, journalists and education researchers.`}
        reviewed={CHINA_INTAKE_VERIFIED_ON}
        actions={
          <>
            <Link href="/programs" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Explore {report.programCounts.total} China programs <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/compare-costs" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare first-year costs
            </Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-lime">Live database snapshot</p>
            <dl className="mt-3 divide-y divide-white/15">
              {[
                ['Active China universities', String(report.universityCount), `Across ${report.cityCount} Chinese cities`],
                ['Recorded study programmes', String(report.programCounts.total), `${report.programCounts.bachelorEnglish} English-taught bachelor rows tracked`],
                ['Recorded scholarships', String(report.scholarshipTotal), 'CSC, provincial, city, CLEC & university'],
                ['Source-linked institutions', `${report.verification.withOfficialSource} / ${report.universityCount}`, 'Carrying official admissions or programme URLs'],
              ].map(([label, val, note]) => (
                <div key={label} className="py-3.5">
                  <dt className="text-[14px] text-white/75">{label}</dt>
                  <dd className="mt-1 font-display text-[30px] font-black leading-none text-white">{val}</dd>
                  <dd className="mt-1 text-[14px] text-white/70">{note}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <TrustBar />

      <Section
        id="tuition-benchmark"
        title="Annual China university tuition in CNY (before scholarships)."
        intro="Only programmes carrying one explicit yearly CNY figure without ambiguous ranges are included in the quartile calculation below. Accommodation, insurance, medical checks and living expenses are separate."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[660px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">Annual China university tuition distributions in CNY by degree route</caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Study route</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Explicit records (N)</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Minimum</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Median</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Middle 50% (Q1–Q3)</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Maximum</th>
              </tr>
            </thead>
            <tbody>
              <TuitionRow
                label="English-taught Bachelor’s"
                href="/programs/english-taught-bachelor-china"
                dist={report.tuitionDistributions.bachelorEnglish}
              />
              <TuitionRow
                label="Chinese-taught Bachelor’s"
                href="/programs/chinese-taught-bachelor-china"
                dist={report.tuitionDistributions.bachelorChinese}
              />
              <TuitionRow
                label="Master’s programmes"
                href="/programs/masters-in-china"
                dist={report.tuitionDistributions.master}
              />
              <TuitionRow
                label="PhD programmes"
                href="/programs/phd-in-china"
                dist={report.tuitionDistributions.phd}
              />
              <TuitionRow
                label="All explicit yearly CNY programmes"
                href="/programs"
                dist={report.tuitionDistributions.allExplicit}
              />
            </tbody>
          </table>
        </div>

        <div data-anim="stagger" className="mt-8 grid gap-4 md:grid-cols-3">
          <div className={kit.cardSage}>
            <span className={kit.icon}><BarChart3 size={22} aria-hidden="true" /></span>
            <h3 className={`mt-5 ${kit.h3}`}>Programme level inventory</h3>
            <p className={`mt-2 ${kit.body}`}>
              Catalogue spans <strong>{report.programCounts.bachelorEnglish}</strong> English-taught bachelor rows,{' '}
              <strong>{report.programCounts.bachelorChinese}</strong> Chinese-taught bachelor rows,{' '}
              <strong>{report.programCounts.master}</strong> master’s rows,{' '}
              <strong>{report.programCounts.phd}</strong> PhD rows, and{' '}
              <strong>{report.programCounts.languageAndFoundation}</strong> Chinese language and foundation tracks.
            </p>
          </div>
          <div className={kit.cardSage}>
            <span className={kit.icon}><Building2 size={22} aria-hidden="true" /></span>
            <h3 className={`mt-5 ${kit.h3}`}>English medium &amp; MBBS</h3>
            <p className={`mt-2 ${kit.body}`}>
              <strong>{report.englishMediumUniversityCount}</strong> of {report.universityCount} Chinese institutions offer English-medium pathways.{' '}
              <strong>{report.mbbsListedUniversityCount}</strong> records carry explicit MoE/WDOMS/BMDC medical governance references.
            </p>
            <Link href="/mbbs-in-china-bangladesh" className={`mt-3 ${kit.link}`}>
              Review MBBS &amp; BMDC rules <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className={kit.cardLime}>
            <span className={kit.icon}><Calculator size={22} aria-hidden="true" /></span>
            <h3 className={`mt-5 ${kit.h3}`}>Why we keep CNY separate</h3>
            <p className={`mt-2 ${kit.body}`}>
              University charges are payable in RMB/CNY, while EduExpress service packages remain in BDT. Never rely on a frozen unofficial BDT conversion when planning your bank remittance.
            </p>
            <Link href="/compare-costs" className={`mt-3 ${kit.link}`}>
              Launch first-year calculator <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="first-year-fees"
        tone="sage"
        title="Recorded first-year non-tuition university & arrival charges."
        intro="Separate from tuition and separate from EduExpress service fees. Figures summarize explicit single-value CNY fee records stored across Chinese universities in the catalogue."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white">
          <table className="w-full min-w-[580px] border-collapse text-left text-[15px] leading-6">
            <caption className="sr-only">Recorded first-year non-tuition fees in China (CNY)</caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Charge category</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Explicit fee rows (N)</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Lowest recorded</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Median recorded</th>
                <th scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">Highest recorded</th>
              </tr>
            </thead>
            <tbody>
              {report.feeBenchmarks.map(item => (
                <tr key={item.category} className="border-t border-canvas-soft">
                  <th scope="row" className="px-5 py-4 font-semibold text-petrol-800">{item.label}</th>
                  <td className="px-5 py-4 text-ink-soft">{item.sampleCount}</td>
                  <td className="px-5 py-4 text-ink-soft">{formatCny(item.min)}</td>
                  <td className="px-5 py-4 font-semibold text-petrol-800">{formatCny(item.median)}</td>
                  <td className="px-5 py-4 text-ink-soft">{formatCny(item.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="cities-and-scholarships"
        title="Geographic concentration & recorded scholarship mix."
        intro={`Catalogue spans ${report.cityCount} Chinese cities. Cities with three or more tracked universities have dedicated city guides linked below.`}
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className={kit.cardOutline}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}><MapPin size={21} aria-hidden="true" /></span>
              <h3 className={kit.h3}>Top Chinese study cities indexed</h3>
            </div>
            <ul className="mt-5 divide-y divide-canvas-soft text-[15px]">
              {report.topCities.map(item => (
                <li key={item.slug} className="flex items-center justify-between gap-4 py-3">
                  {item.hasCityPage ? (
                    <Link href={`/china-universities/${item.slug}`} className="font-semibold text-petrol-800 underline decoration-petrol-800/30 underline-offset-4 hover:text-lime-deep">
                      {item.city} universities in China
                    </Link>
                  ) : (
                    <span className="font-semibold text-petrol-800">{item.city}</span>
                  )}
                  <span className="rounded-full bg-canvas-soft px-3 py-1 font-semibold text-petrol-800">
                    {item.count} {item.count === 1 ? 'university' : 'universities'}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/china-universities" className={`mt-5 ${kit.link}`}>
              View all {report.cityCount} cities in directory <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="space-y-5">
            <div className={kit.cardOutline}>
              <div className="flex items-center gap-3">
                <span className={kit.iconLime}><BookOpen size={21} aria-hidden="true" /></span>
                <h3 className={kit.h3}>Scholarships by awarding authority ({report.scholarshipTotal})</h3>
              </div>
              <ul className="mt-5 divide-y divide-canvas-soft text-[15px]">
                {report.scholarshipCategories.map(item => (
                  <li key={item.category} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-semibold text-petrol-800">{item.category}</span>
                    <span className="rounded-full bg-lime-pale px-3 py-1 font-semibold text-lime-deep">{item.count} records</span>
                  </li>
                ))}
              </ul>
              <Link href="/scholarships" className={`mt-5 ${kit.link}`}>
                Search scholarship database <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className={kit.cardSage}>
              <div className="flex items-center gap-3">
                <span className={kit.icon}><Calendar size={21} aria-hidden="true" /></span>
                <h3 className={kit.h3}>Live intake schedule</h3>
              </div>
              <ul className="mt-4 space-y-3 text-[15px]">
                {report.intakes.map(intake => (
                  <li key={intake.name} className="rounded-2xl bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-petrol-800">{intake.name.split(' — ')[0]}</span>
                      <span className="rounded-full bg-lime px-3 py-0.5 text-[13px] font-semibold text-petrol-800">{intake.status}</span>
                    </div>
                    <p className="mt-1 text-ink-soft">
                      Opens {intake.opensLabel} · university deadline {intake.deadlineLabel}
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/china-intakes-deadlines" className={`mt-4 ${kit.link}`}>
                Full intake &amp; CSC calendar <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="methodology"
        tone="navy"
        title="Data methodology, honest verification status & visa-first rule."
        intro={VISA_FIRST_TERMS}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/20 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <FileCheck2 size={20} aria-hidden="true" /> Verification transparency ({report.universityCount} records)
            </h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-7 text-white/85">
              <li>
                <strong className="text-white">Currently cycle-verified records:</strong> {report.verification.verified} institutions carrying active current-cycle verification status.
              </li>
              <li>
                <strong className="text-white">Records flagged “under verification”:</strong> {report.verification.underVerification} institutions with linked historical sources ({report.verification.withOfficialSource} total source-linked) pending fresh current-intake confirmation before any fee is paid.
              </li>
              <li>
                <strong className="text-white">Published student story cases:</strong> {report.storyCount} consented China student cases published on <Link href="/china-success-stories" className="text-lime underline underline-offset-4">China success stories</Link>.
              </li>
              <li>
                <strong className="text-white">Independent decisions:</strong> Chinese universities, CSC, municipal/provincial bureaus, BMDC and the Chinese Embassy make all admission, scholarship, registration and visa decisions.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/how-we-verify-universities" className="ed-btn ed-btn-signal min-h-[48px] px-6">
                Verification standard
              </Link>
              <Link href="/proof-library" className="ed-btn ed-btn-on-dark min-h-[48px] px-6">
                View proof library
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <ShieldCheck size={20} aria-hidden="true" /> Citation &amp; press / university verification desk
            </h3>
            <p className="mt-3 text-[16px] leading-7 text-white/85">
              Suggested citation for journalists, school career advisors, and academic comparisons:
            </p>
            <blockquote className="mt-3 rounded-2xl border border-white/15 bg-black/20 p-4 text-[14px] leading-6 text-white/90">
              EduExpress International ({now.getUTCFullYear()}). <em>Bangladesh to China Study Data &amp; Cost Benchmark Report</em>. Retrieved from {url}
            </blockquote>
            <p className="mt-2 text-[13px] leading-5 text-white/75">
              Open Research License:{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime underline underline-offset-4 hover:text-white"
              >
                Creative Commons Attribution 4.0 International (CC BY 4.0)
              </a>
              . Free for academic, media, and school career counselling use with source attribution.
            </p>
            <ReportCitationActions
              citationText={`EduExpress International (${now.getUTCFullYear()}). Bangladesh to China Study Data & Cost Benchmark Report. Retrieved from ${url}`}
              datasetUrl={`${SITE}/china-study-report.json`}
            />
            <dl className="mt-5 space-y-2 text-[15px] text-white/80">
              <div>
                <dt className="inline font-semibold text-white">Dhaka head office: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.address}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Office hours: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.hours}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Verification &amp; media desk: </dt>
                <dd className="inline">
                  <a href={`mailto:${config.contact.email}`} className="text-lime underline underline-offset-4">
                    {config.contact.email}
                  </a>{' '}
                  ·{' '}
                  <a href={`tel:${config.contact.phone}`} className="text-lime underline underline-offset-4">
                    {config.contact.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section
        id="official-sources"
        tone="sage"
        title="Primary official & regulatory sources."
        intro="Verify institutional recognition, scholarship rules, CSCA requirements, medical licensing and Dhaka visa submission notices directly at the governing authorities below."
      >
        <ul data-anim="stagger" className="grid gap-3 md:grid-cols-2">
          {CHINA_REPORT_OFFICIAL_AUTHORITIES.map(source => {
            const safeHref = toSafeExternalUrl(source.href);
            return safeHref ? (
              <li key={source.href}>
                <a
                  href={safeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between rounded-3xl bg-white p-5 transition-colors hover:bg-lime-pale"
                >
                  <span className="text-[16px] font-semibold text-petrol-800 group-hover:underline">
                    {source.label}
                  </span>
                  <span className="mt-1.5 text-[14px] leading-6 text-ink-soft">{source.note}</span>
                </a>
              </li>
            ) : null;
          })}
        </ul>
      </Section>

      <div id="report-faq" className="scroll-mt-28">
        <FaqBlock items={reportFaqs} title="Methodology & cost benchmark FAQs." tone="white" />
      </div>

      <Section tone="sage" title="Explore China hubs & calculators.">
        <nav aria-label="China data and study guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedGuides.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-[64px] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
                >
                  {item.label}
                  <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBand
        title="Want a written cost sheet for your exact programme?"
        text="Share your SSC, HSC or bachelor results, subject and budget. We will send you matching verified programmes and an itemized written cost sheet."
      />
    </article>
  );
}

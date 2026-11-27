import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  Landmark,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import ReportCitationActions from '@/components/china/ReportCitationActions';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import {
  LivingCostSeparationNotice,
  PathwayGovernanceSection,
} from '@/components/pathways/PathwaySharedBlocks';
import {
  BANGLADESH_MACRO_INDICATORS,
  BANGLADESH_MARKET_LAST_VERIFIED_ISO,
  BANGLADESH_MARKET_LAST_VERIFIED_LABEL,
  BANGLADESH_MARKET_NEXT_REVIEW_LABEL,
  BANGLADESH_MARKET_SOURCES,
  STUDENT_FILE_COMPARISON,
  buildBangladeshMarketBenchmark,
} from '@/lib/bangladesh-market-benchmark';
import { getChinaIntakes } from '@/lib/china-intakes';
import { config } from '@/lib/config';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import {
  OPEN_DATA_CSV_DOWNLOADS,
  OPEN_DATA_IDENTIFIERS,
  OPEN_DATA_REPOSITORIES,
  OPEN_DATA_SAME_AS,
} from '@/lib/open-data';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';
import { getPublishedStories } from '@/app/success-stories/stories';

export const revalidate = 3600;

const SITE = 'https://eduexpressint.com';
const PATH = '/bangladesh-study-abroad-market';
const BN_PATH = '/bn/bangladesh-study-abroad-market';
const canonical = `${SITE}${PATH}`;

export const metadata = pageMetadata({
  title: 'Bangladesh Study Abroad Market 2027 Report | EduExpress',
  description:
    'Bangladesh study abroad market 2027: outbound trends, 12 active destinations, BDT cost separation, Student File rules, live university data & B2B desk.',
  path: PATH,
  type: 'article',
  locale: 'en_BD',
  languages: {
    'en-BD': PATH,
    'bn-BD': BN_PATH,
    'x-default': PATH,
  },
  image: ogImage(
    'destinations',
    'Bangladesh study abroad market 2027 report comparing destinations, BDT costs, and university pathways',
  ),
});

const QUALIFICATION_TRACKS = [
  {
    icon: GraduationCap,
    stage: 'After O-Level / SSC / Dakhil',
    title: 'Fast-Track Foundation & 3+2 Diploma Bridges',
    summary:
      'Skip two extra pre-university years (and BDT 4.8–15L+ in Dhaka A-Level school/exam costs) through Malaysia 1-Year Foundation + 3-Year Bachelor (4 years total) or China 3-Year Higher Vocational Diploma + 2-Year Top-Up Bachelor (5 years total). Under-18 China applicants require MoE Order No. 42 legal guardian checks.',
    links: [
      { label: 'Malaysia After O-Level', href: '/study-in-malaysia-after-o-level' },
      { label: 'China After O-Level / SSC (3+2)', href: '/study-in-china-after-o-level-ssc' },
      { label: 'বাংলা SSC ও দাখিল গাইড', href: '/bn/study-in-china-after-ssc-dakhil' },
    ],
  },
  {
    icon: Compass,
    stage: 'After A-Level / HSC / Alim',
    title: 'Ranked Bachelor’s, MBBS & Branch Campuses',
    summary:
      'Compare NSU, EWU, and AIUB domestic tuition (BDT 9.17–14.30L over 4 years) against ranked Chinese universities with University/Provincial scholarships, Malaysian UK/AU branch campuses (Monash, Nottingham, Heriot-Watt), UK 3-year Honours, Hungary, South Korea, Finland, and BMDC/WDOMS-checked MBBS tracks.',
    links: [
      { label: 'Bangladesh vs. Abroad Matrix', href: '/bangladesh-vs-study-abroad-countries' },
      { label: 'Bangladesh vs. China Bachelor', href: '/bangladesh-vs-china-bachelor-study' },
      { label: 'MBBS in China & BMDC Rules', href: '/mbbs-in-china-bangladesh' },
    ],
  },
  {
    icon: Building2,
    stage: 'After Bachelor’s / Postgraduate',
    title: 'Master’s, PhD & Government Scholarship Windows',
    summary:
      'Target CSC Type A & Type B scholarships in China, Global Korea Scholarship (GKS), Stipendium Hungaricum (Hungary, January 15 cycle), UK 1-year Master’s (note: 18-month Graduate Route applies to most non-PhD applications from 1 Jan 2027), and Finnish research degrees with EUR 9,600/yr documented funds.',
    links: [
      { label: 'CSC Scholarship Guide', href: '/csc-scholarship-bangladesh' },
      { label: 'China Data & Tuition Report', href: '/china-study-report-bangladesh' },
      { label: 'Search All Scholarships', href: '/scholarships' },
    ],
  },
] as const;

const MARKET_FAQS = [
  {
    question: 'Why are more Bangladeshi students choosing China, Malaysia, and Europe in 2026–2027?',
    answer:
      'Tighter immigration rules and higher financial thresholds in traditional Western destinations—including the UK Graduate Route shortening to 18 months for most non-PhD applications from 1 January 2027, Canadian study-permit caps, and BDT depreciation—have pushed families to compare total BDT return on investment. China, Malaysia, Hungary, South Korea, and Finland offer globally accredited programs at significantly lower upfront tuition.',
  },
  {
    question: 'Which study abroad routes from Bangladesh do NOT require a Bangladesh Bank Student File?',
    answer:
      'Full CSC Type A/B scholarships in China cover tuition and dormitory costs directly, and many self-funded or provincial-waiver Chinese universities allow remaining tuition and hostel fees to be paid on campus during registration week. That means families typically use standard passport currency endorsement instead of opening a bank Student File—unlike Malaysia, the UK, Finland, or other destinations requiring advance cross-border tuition wires.',
  },
  {
    question: 'How does EduExpress keep tuition and living costs transparent across 12 destinations?',
    answer:
      'Every comparison table keeps Tuition & Institutional Fees strictly separated from Living Expenses (dormitory/rent, meals, local transit, insurance) and third-party statutory charges (visa, EMGS, medical, notarization). Before a student commits, EduExpress issues a written ClearCost Sheet naming the exact recipient, amount, due date, and refund status of every charge.',
  },
  {
    question: 'Can O-Level or SSC / Dakhil students study abroad without completing A-Levels or HSC?',
    answer:
      'Yes. In Malaysia, students with 5 O-Level credits can enter a 1-year Foundation followed by a 3-year Bachelor’s (4 years total), or enter a 2-year Diploma with 3 credits. In China, SSC, Dakhil, and O-Level graduates can pursue a 3-year Higher Vocational Diploma + 2-year Top-Up Bachelor (5 years total), subject to MoE Order No. 42 guardian rules if under 18.',
  },
  {
    question: 'How does EduExpress serve B2B education agencies and sub-agents in Bangladesh?',
    answer:
      'Through the EduExpress B2B Partner Desk (/b2b), partner agencies and regional counselors access structured file processing across China, Malaysia, and 10 active destinations with 24–48 hour file audits, written non-poaching protection, a 5-stage SOP, and bilateral MOU terms. Published China partner tiers are also available on /partnership.',
  },
];

const RELATED_HUBS = [
  { label: 'Study in China (Flagship Pillar)', href: '/study-in-china-from-bangladesh' },
  { label: 'Bangladesh–China Live Cost Report', href: '/china-study-report-bangladesh' },
  { label: 'Study in Malaysia (BDT 0 Fee)', href: '/study-in-malaysia-from-bangladesh' },
  { label: 'Bangladesh vs. Abroad Countries', href: '/bangladesh-vs-study-abroad-countries' },
  { label: 'Compare All 12 Destinations', href: '/compare-study-destinations' },
  { label: 'Fees & Transparency Policy', href: '/fees-and-transparency' },
  { label: 'B2B Agency Partner Desk', href: '/b2b' },
  { label: 'বাংলাদেশ মার্কেট গাইড (বাংলা)', href: '/bn/bangladesh-study-abroad-market' },
];

export default async function BangladeshStudyAbroadMarketPage() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords(),
    getPublishedStories().catch(() => []),
  ]);
  const snapshot = buildBangladeshMarketBenchmark(universities, stories.length, now, getChinaIntakes(now));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Report'],
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        name: 'Bangladesh Study Abroad Market 2027: Destinations, Costs & Pathways',
        headline: 'Bangladesh Study Abroad Market 2027 Report | EduExpress International',
        description:
          'Comprehensive market analysis of Bangladeshi outbound student mobility across 12 active destinations, separated BDT tuition and living costs, Bangladesh Bank Student File rules, academic bridges, and B2B processing standards.',
        image: `${SITE}/og/destinations.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/destinations.jpg'),
        inLanguage: 'en-BD',
        isAccessibleForFree: true,
        datePublished: `${BANGLADESH_MARKET_LAST_VERIFIED_ISO}T00:00:00Z`,
        dateModified: `${BANGLADESH_MARKET_LAST_VERIFIED_ISO}T00:00:00Z`,
        author: { '@type': 'Person', name: 'Mukta Rahaman', jobTitle: 'Senior Consultant' },
        reviewedBy: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        mainEntity: { '@id': `${canonical}#dataset` },
        ...citationJsonLd(BANGLADESH_MARKET_SOURCES),
      },
      {
        '@type': 'Dataset',
        '@id': `${canonical}#dataset`,
        name: 'Bangladesh Global Study Abroad Cost & Scholarship Dataset (2027)',
        description: `Live catalogue metrics (${snapshot.liveCatalog.activeUniversities} active universities, ${snapshot.liveCatalog.programsCount} programs, ${snapshot.liveCatalog.itemizedFeeRowsCount} itemized fees, ${snapshot.liveCatalog.scholarshipsCount} scholarships) and ${snapshot.globalBenchmarkDestinationCount}-country global Bangladesh outbound study matrix (${snapshot.activeDestinationCount} active EduExpress destinations + ${snapshot.globalBenchmarkDestinationCount - snapshot.activeDestinationCount} benchmark destinations).`,
        url: canonical,
        identifier: [...OPEN_DATA_IDENTIFIERS],
        sameAs: [...OPEN_DATA_SAME_AS],
        version: OPEN_DATA_REPOSITORIES.version,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        dateModified: `${BANGLADESH_MARKET_LAST_VERIFIED_ISO}T00:00:00Z`,
        measurementTechnique:
          'Aggregation of verified university catalogue profiles, official immigration/education authorities, and separated tuition vs. living cost schedules.',
        creator: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        spatialCoverage: { '@type': 'Country', name: 'Bangladesh' },
        temporalCoverage: '2026/2027',
        distribution: [
          {
            '@type': 'DataDownload',
            name: 'Bangladesh Study Abroad Market 2027 Benchmark (JSON)',
            encodingFormat: 'application/json',
            contentUrl: `${SITE}/bangladesh-study-abroad-market.json`,
          },
          OPEN_DATA_CSV_DOWNLOADS.globalDestinationsMatrix,
          OPEN_DATA_CSV_DOWNLOADS.countryScholarships,
          OPEN_DATA_CSV_DOWNLOADS.universities,
          OPEN_DATA_CSV_DOWNLOADS.programs,
        ],
        variableMeasured: [
          'Active university & scholarship coverage by country',
          'Separated tuition and living cost benchmarks across 12 destinations',
          'Bangladesh Bank Student File applicability by destination',
          'Post-O-Level/SSC and Post-A-Level/HSC timeline comparisons',
        ],
        keywords: [
          'Bangladesh study abroad market 2027',
          'Bangladeshi outbound student mobility',
          'Bangladesh Bank Student File',
          'Study abroad cost in BDT',
        ],
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Find education', path: '/find-education' },
          { name: 'Bangladesh Study Abroad Market 2027' },
        ]}
        eyebrow="Market Intelligence & Decision Hub · Bangladesh 2027"
        title="Bangladesh Study Abroad Market 2027."
        lead="An evidence-first overview of Bangladeshi outbound student trends, all 12 active destinations, separated tuition and living costs, Bangladesh Bank Student File rules, B2C qualification pathways, and compliant B2B agency infrastructure."
        reviewed={BANGLADESH_MARKET_LAST_VERIFIED_LABEL}
        actions={
          <>
            <Link href="#market-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={BN_PATH} hrefLang="bn" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              বাংলা গাইড পড়ুন
            </Link>
            <Link href="/bangladesh-vs-study-abroad-countries" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare BD vs. Abroad
            </Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-lime">
              Live EduExpress Market Inventory
            </p>
            <dl className="mt-3 divide-y divide-white/15">
              {[
                [
                  'Active university records',
                  String(snapshot.liveCatalog.activeUniversities),
                  snapshot.liveCatalog.byCountry.map((item) => `${item.country}: ${item.count}`).join(' · ') ||
                    'China & Malaysia live records',
                ],
                [
                  'Recorded study programs',
                  String(snapshot.liveCatalog.programsCount),
                  `${snapshot.liveCatalog.itemizedFeeRowsCount} itemized fee rows · ${snapshot.liveCatalog.scholarshipsCount} scholarships`,
                ],
                [
                  'Active destination desks',
                  String(snapshot.activeDestinationCount),
                  'China flagship + Malaysia (BDT 0 fee) + 10 Asia/EU routes',
                ],
                [
                  'Pre-visa fee protection',
                  'BDT 0',
                  'No EduExpress fee before China visa approval; BDT 0 fee for Malaysia',
                ],
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

      <TrustBar feeNote="Written costs across 12 destinations" />

      {/* Direct Answer + Core Cost Separation Rule */}
      <Section
        id="executive-summary"
        title="How the Bangladesh study abroad market is shifting in 2026–2027"
        intro="Bangladesh’s outbound student market—anchored by an OECD baseline of 50,000+ tertiary students abroad and broader 2025–2026 industry estimates exceeding 100,000 across levels—is moving decisively away from high-debt Western routes toward cost-predictable destinations. With ~30% BDT depreciation over under three years, UK Graduate Route changes (18 months for most non-PhD applications from 1 January 2027), and stricter sponsor compliance, Bangladeshi students and co-funding parents increasingly prioritize China, Malaysia, Hungary, South Korea, and targeted European options where institutional tuition and living expenses are verifiable upfront."
      >
        <LivingCostSeparationNotice summary="Every benchmark on this page separates Tuition & Institutional Fees from Monthly Living Expenses and Third-Party Statutory Fees (embassy, medical, EMGS, insurance). EduExpress never bundles daily food or airfare into misleading 'all-in package' claims." />
      </Section>

      {/* Macro Market Fundamentals */}
      <Section
        id="macro-fundamentals"
        tone="sage"
        title="Five structural forces shaping Bangladeshi student & parent decisions"
        intro="Verified macro signals driving destination selection, agency vetting, and AI-assisted research across Dhaka and regional cities."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BANGLADESH_MACRO_INDICATORS.map((item) => (
            <div key={item.indicator} className={kit.card}>
              <span className={kit.badge}>
                <BarChart3 size={14} aria-hidden="true" />
                {item.indicator}
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{item.figure}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.implication}</p>
              <p className="mt-3 text-[13px] font-medium text-ink-mute">Source context: {item.sourceNote}</p>
            </div>
          ))}
          <figure className="overflow-hidden rounded-3xl bg-white">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/home/consultation-family.webp"
                alt="Bangladeshi student and parent reviewing overseas study cost schedules with an EduExpress counselor in Dhaka"
                fill
                sizes="(max-width:1024px) 100vw, 380px"
                className="object-cover"
              />
            </div>
            <figcaption className="p-5 text-[14px] font-semibold text-petrol-800">
              Parents co-decide ~50% of study-abroad choices in Bangladesh, making BDT clarity and Bengali documentation essential.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* Complete 12-Destination Portfolio Matrix */}
      <Section
        id="destination-portfolio"
        title="All 12 active destinations: separated tuition, living & Student File status"
        intro="Built directly from EduExpress’s active country data. China serves as the flagship proof hub; every destination carries distinct service terms, financial rules, and compliance guardrails."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[980px] text-left text-[14px] leading-6">
            <caption className="sr-only">
              12 active study abroad destinations from Bangladesh with separated tuition, living costs, and Student File rules
            </caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Destination &amp; Tier</th>
                <th scope="col" className="p-4 font-bold">Primary Intakes</th>
                <th scope="col" className="p-4 font-bold">Indicative Tuition (No Living)</th>
                <th scope="col" className="p-4 font-bold">Living Cost (Separated)</th>
                <th scope="col" className="p-4 font-bold">Student File &amp; EduExpress Fee</th>
                <th scope="col" className="p-4 font-bold">Key Compliance Guardrail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {snapshot.destinations.map((dest) => (
                <tr key={dest.slug} className={dest.slug === 'china' || dest.slug === 'malaysia' ? 'bg-lime-pale/30' : undefined}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    <Link href={dest.href} className="underline decoration-petrol-800/30 underline-offset-4 hover:text-lime-deep">
                      {dest.name}
                    </Link>
                    <span className="mt-1 block text-[12px] font-semibold text-lime-deep">{dest.tier}</span>
                  </th>
                  <td className="p-4 align-top font-medium text-petrol-800">{dest.intakes}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{dest.indicativeTuition}</td>
                  <td className="p-4 align-top font-medium text-clay">{dest.indicativeLiving}</td>
                  <td className="p-4 align-top">
                    <span className="block font-semibold text-petrol-800">{dest.studentFileRule}</span>
                    <span className="mt-1 block text-[13px] text-ink-soft">{dest.eduExpressFeeModel}</span>
                  </td>
                  <td className="p-4 align-top text-[13.5px]">{dest.keyGuardrail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/destinations" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Explore all {snapshot.activeDestinationCount} destination hubs
          </Link>
          <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Compare by recognition &amp; fit
          </Link>
          <Link href="/china-study-report-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            View China CNY quartile report
          </Link>
        </div>
      </Section>

      {/* Academic Entry Pathways */}
      <Section
        id="academic-pathways"
        tone="sage"
        title="Bangladesh qualification bridges: SSC / O-Level to PhD"
        intro="Route planning starts from the student’s current academic certificate—SSC, Dakhil, O-Level, HSC, Alim, A-Level, or Bachelor’s—rather than generic destination hype."
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-3">
          {QUALIFICATION_TRACKS.map((track) => (
            <div key={track.stage} className={`${kit.card} flex flex-col justify-between sm:p-7`}>
              <div>
                <div className="flex items-center gap-3">
                  <span className={kit.iconLime}>
                    <track.icon size={21} aria-hidden="true" />
                  </span>
                  <span className={kit.badge}>{track.stage}</span>
                </div>
                <h3 className={`mt-4 ${kit.h3}`}>{track.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{track.summary}</p>
              </div>
              <div className="mt-5 flex flex-col gap-2 border-t border-canvas-soft pt-4">
                {track.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    hrefLang={item.href.startsWith('/bn/') ? 'bn' : 'en'}
                    className={kit.link}
                  >
                    {item.label} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Bangladesh Bank Student File vs China Payment Simplicity */}
      <Section
        id="student-file-mechanics"
        title="Bangladesh Bank Student File rules vs. China payment simplicity"
        intro="Cross-border tuition remittance is one of the biggest operational bottlenecks for Bangladeshi guardians. Understanding where a central-bank Student File applies prevents missed deposit deadlines."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[760px] text-left text-[15px] leading-7">
            <caption className="sr-only">
              Bangladesh Bank AD bank Student File remittance rules compared against China scholarship and on-campus fee tracks
            </caption>
            <thead className="bg-canvas-soft">
              <tr>
                <th scope="col" className="p-4 font-bold text-petrol-800">Operational Factor</th>
                <th scope="col" className="p-4 font-bold text-petrol-800">
                  Student File Destinations (Malaysia, UK, Finland, Europe, Western)
                </th>
                <th scope="col" className="p-4 font-bold text-petrol-800">
                  China Tracks (CSC Full Scholarship &amp; On-Campus Arrival Routes)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {STUDENT_FILE_COMPARISON.map((row) => (
                <tr key={row.dimension}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    {row.dimension}
                  </th>
                  <td className="p-4 align-top">{row.studentFileCountries}</td>
                  <td className="p-4 align-top bg-lime-pale/20 font-medium text-petrol-800">
                    {row.chinaAdvantage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/malaysia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Malaysia Student File &amp; BDT cost guide
          </Link>
          <Link href="/study-in-china-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            China tuition &amp; on-campus cost guide
          </Link>
        </div>
      </Section>

      {/* B2C Trust Protection vs B2B Agency Ecosystem */}
      <Section
        id="trust-and-b2b"
        tone="sage"
        title="B2C family protection & the Bangladesh B2B consultancy ecosystem"
        intro="Whether advising a family in Dhanmondi or processing files for a partner agency nationwide, written accountability replaces verbal assurances."
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
          <div className={`${kit.cardLime} sm:p-8`}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>B2C Trust Assets (For Students &amp; Parents)</h3>
            </div>
            <ul className="mt-5 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li>
                <strong className="text-petrol-800">EduFit Decision Report:</strong> Compares at least three realistic pathways against recognition, budget, and visa readiness before applying.
              </li>
              <li>
                <strong className="text-petrol-800">ClearCost Sheet:</strong> Separates tuition, hostel, statutory third-party charges, and EduExpress fees—stating exact refundability and recipient.
              </li>
              <li>
                <strong className="text-petrol-800">Document Custody Rule:</strong> Students never surrender original passports or SSC/HSC certificates as agency collateral.
              </li>
              <li>
                <strong className="text-petrol-800">Zero Unverified Visa Promises:</strong> Universities and embassies issue official decisions; past cohorts never guarantee individual outcomes.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/for-parents" className="ed-btn ed-btn-outline min-h-[46px] px-5">
                Parent guide
              </Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[46px] px-5">
                Fee policy
              </Link>
              <Link href="/complaints-and-resolution" className="ed-btn ed-btn-outline min-h-[46px] px-5">
                Complaints &amp; resolution
              </Link>
            </div>
          </div>

          <div className={`${kit.card} sm:p-8`}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <Briefcase size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>B2B Partner &amp; Sub-Agent Processing Desk</h3>
            </div>
            <p className={`mt-4 ${kit.body}`}>
              Across Bangladesh’s ~429 education agencies, stricter international compliance (UK sponsor rules, Malaysia EMGS/MYCAS, China CSCA &amp; institutional audits) has raised the cost of manual processing errors. As Founding Member (#08) of{' '}
              <a href="https://cbcabd.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-lime-deep">
                CBCA
              </a>{' '}
              and Active Member (ID: FCM-452) of{' '}
              <a href="https://www.facdcab.org/members/directory/2264" target="_blank" rel="noopener noreferrer" className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-lime-deep">
                FACD-CAB / FACECAB (#2264)
              </a>
              , EduExpress operates a dedicated B2B admissions desk built on:
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <Landmark size={17} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                <span>24–48 hour eligibility &amp; document audits across China, Malaysia, and 10 active destinations</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck size={17} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                <span>Written non-poaching protection and client attribution locked before file submission</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FileCheck2 size={17} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                <span>Bilateral written MOU with clear payout milestones (plus published China partner rates on /partnership)</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/b2b" className="ed-btn ed-btn-signal min-h-[46px] px-5">
                Explore B2B Desk <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/partnership" className="ed-btn ed-btn-outline min-h-[46px] px-5">
                Global Partner Terms
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Open Data Methodology & Citation Desk */}
      <Section
        id="open-dataset"
        tone="navy"
        title="Open market dataset, verification rules & media citation"
        intro="Researchers, school career counselors, journalists, and AI engines can inspect or cite the live JSON dataset behind this report under CC BY 4.0."
      >
        <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardDark}>
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <Globe2 size={20} aria-hidden="true" /> Live Verification &amp; Legal Identity
            </h3>
            <ul className="mt-4 space-y-3 text-[15.5px] leading-7 text-white/85">
              <li>
                <strong className="text-white">Active catalog records:</strong> {snapshot.liveCatalog.activeUniversities} active institutions ({snapshot.liveCatalog.verifiedUniversitiesCount} currently cycle-verified; remaining records transparently flagged for fresh intake check prior to payment).
              </li>
              <li>
                <strong className="text-white">Independent Bangladeshi entity:</strong> EduExpress International (founded 8 March 2018 in Dhaka by Abdullah Al Rakib) is Founding Member (#08) of{' '}
                <a href="https://cbcabd.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-lime underline underline-offset-4 hover:text-white">
                  CBCA
                </a>{' '}
                and Active Member (ID: FCM-452) of{' '}
                <a href="https://www.facdcab.org/members/directory/2264" target="_blank" rel="noopener noreferrer" className="font-semibold text-lime underline underline-offset-4 hover:text-white">
                  FACD-CAB / FACECAB
                </a>
                , and is unaffiliated with unrelated companies sharing a similar name outside Bangladesh.
              </li>
              <li>
                <strong className="text-white">Service policy:</strong> No file opening charge across all 12 destinations; no EduExpress service fee before China visa approval (BDT 2,00,000 package after visa); BDT 0 EduExpress service fee for Malaysia and the United Kingdom (UK); BDT 1,00,000 service fee for other European destinations payable 100% after visa approval.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/how-we-verify-universities" className="ed-btn ed-btn-signal min-h-[46px] px-5">
                How we verify institutions
              </Link>
              <Link href="/education-consultant-dhaka" className="ed-btn ed-btn-on-dark min-h-[46px] px-5">
                Dhanmondi Dhaka office
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <ShieldAlert size={20} aria-hidden="true" /> Cite or Download Open Dataset (CC BY 4.0)
            </h3>
            <blockquote className="mt-4 rounded-2xl border border-white/15 bg-black/20 p-4 text-[14px] leading-6 text-white/90">
              EduExpress International ({now.getUTCFullYear()}). <em>Bangladesh Study Abroad Market 2027 Report &amp; 12-Destination Benchmark</em>. Retrieved from {canonical}
            </blockquote>
            <ReportCitationActions
              citationText={`EduExpress International (${now.getUTCFullYear()}). Bangladesh Study Abroad Market 2027 Report & 12-Destination Benchmark. Retrieved from ${canonical}`}
              reportUrl={canonical}
              reportTitle="Bangladesh Study Abroad Market 2027 Report & 12-Destination Cost Benchmark (EduExpress International)"
              datasetUrl={`${SITE}/bangladesh-study-abroad-market.json`}
              downloadPath="/bangladesh-study-abroad-market.json"
              downloadFilename="eduexpress-bangladesh-study-abroad-market.json"
              analyticsDestination="bangladesh_market"
              analyticsLabel="bangladesh_market_report_json"
            />
            <dl className="mt-5 space-y-2 text-[14.5px] text-white/80">
              <div>
                <dt className="inline font-semibold text-white">Dhanmondi Office: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.address}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Hours: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.hours}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Desk Contact: </dt>
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

      {/* Primary Official & Regulatory Sources */}
      <Section
        id="official-sources"
        tone="white"
        title="Primary official & regulatory sources referenced"
        intro="Verify foreign exchange, immigration, accreditation, and medical licensing rules directly at the responsible authorities."
      >
        <ul data-anim="stagger" className="grid gap-3 md:grid-cols-2">
          {BANGLADESH_MARKET_SOURCES.map((source) => {
            const safeHref = toSafeExternalUrl(source.href);
            return safeHref ? (
              <li key={source.href}>
                <a
                  href={safeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between rounded-3xl bg-canvas-soft p-5 transition-colors hover:bg-lime-pale"
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

      {/* Governance & Editorial Review */}
      <PathwayGovernanceSection
        tone="sage"
        authorName="Mukta Rahaman"
        authorRole="Senior Consultant (Education Fit & Cost Planning)"
        reviewerName="Abdullah Al Rakib"
        reviewerRole="Founder and CEO (Chinese & International Higher Education since 2018)"
        lastVerified={BANGLADESH_MARKET_LAST_VERIFIED_LABEL}
        nextReview={BANGLADESH_MARKET_NEXT_REVIEW_LABEL}
        whatMayChange={[
          'Bangladesh Bank Foreign Exchange circular rules and AD bank card/Student File processing thresholds update periodically.',
          'UK Graduate Route (18-month change from Jan 2027), Finnish Migri income thresholds, and Chinese CSCA / CSC intake notices follow government updates.',
          'BDT exchange rates against CNY, MYR, GBP, EUR, and USD shift daily—confirm AD bank TT selling quotes before remitting funds.',
        ]}
        sources={BANGLADESH_MARKET_SOURCES.map(({ label, href }) => ({ label, href }))}
      />

      {/* Visible FAQs + Schema */}
      <div id="market-faq" className="scroll-mt-24">
        <FaqBlock items={MARKET_FAQS} title="Bangladesh study abroad market FAQs" tone="white" />
      </div>

      {/* Related Hubs */}
      <Section tone="sage" title="Explore connected market hubs & calculators">
        <nav aria-label="Bangladesh study abroad hubs and reports">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_HUBS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  hrefLang={item.href.startsWith('/bn/') ? 'bn' : 'en'}
                  className="flex min-h-[64px] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 text-[15px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale"
                >
                  <span>{item.label}</span>
                  <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {/* Embedded Assessment */}
      <Section
        id="market-assessment"
        title="Get an Education Fit Assessment tailored to your budget"
        intro="Share your academic level, GPA/grades, subject preference, and realistic BDT budget. A counselor prepares a written shortlist across matching countries within one working day."
      >
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment />
        </div>
      </Section>

      <CtaBand
        title="Compare destinations with the costs in writing."
        text="Visit our Dhanmondi office or complete the free assessment online—no file-opening fee and zero obligation."
        assessmentHref="#market-assessment"
      />
    </article>
  );
}

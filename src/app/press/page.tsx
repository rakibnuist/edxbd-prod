import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Landmark,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { getPublishedStories } from '@/app/success-stories/stories';
import ReportCitationActions from '@/components/china/ReportCitationActions';
import EmbedCodeSnippet from '@/components/embed/EmbedCodeSnippet';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import PressBriefCopyActions from '@/components/press/PressBriefCopyActions';
import {
  BANGLADESH_MARKET_LAST_VERIFIED_LABEL,
  BANGLADESH_MARKET_SOURCES,
  buildBangladeshMarketBenchmark,
} from '@/lib/bangladesh-market-benchmark';
import {
  CHINA_REPORT_OFFICIAL_AUTHORITIES,
  buildChinaBenchmark,
} from '@/lib/china-benchmark';
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
import { ogImage, pageMetadata } from '@/lib/seo';
import { getUniversityRecords } from '@/lib/university-records';

export const revalidate = 3600;

const SITE = 'https://eduexpressint.com';
const PATH = '/press';
const canonical = `${SITE}${PATH}`;

export const metadata = pageMetadata({
  title: 'Media, Data & Research Press Room | EduExpress',
  description:
    'Open CC BY 4.0 Bangladesh study abroad datasets, CNY/BDT tuition benchmarks, 4 ready-to-cite EN/BN press briefs, spokesperson bios & verification contacts.',
  path: PATH,
  type: 'website',
  locale: 'en_BD',
  image: ogImage('china', 'EduExpress International Media, Data and Research Press Room'),
});

const MEDIA_FAQS = [
  {
    question: 'Under what license may journalists and researchers republish EduExpress data?',
    answer: `Both live JSON endpoints (/china-study-report.json and /bangladesh-study-abroad-market.json) and our archived open-data mirrors on Zenodo (DOI ${OPEN_DATA_REPOSITORIES.zenodoDoi}), GitHub, and Kaggle are released under Creative Commons Attribution 4.0 International (CC BY 4.0). Journalists, researchers, and career counselors may quote figures freely with attribution and a link to the cited report or DOI.`,
  },
  {
    question: 'How does EduExpress calculate China tuition quartiles without guessing?',
    answer:
      'Tuition quartiles on the Bangladesh-to-China Study Data & Cost Report include only active catalogue programme rows that state a single explicit annual CNY figure. Ranged estimates and conditional fee waivers are excluded from quartile math so figures reflect documented university schedules rather than marketing averages.',
  },
  {
    question: 'Is EduExpress International (Dhaka) connected to UK-registered EduExpress Ltd.?',
    answer:
      'No. EduExpress International is an independent Bangladeshi study abroad consultancy founded in Dhaka on 8 March 2018 by Abdullah Al Rakib (office at Evergreen Latif, House 12/1, Road 4/A, Ground Floor, Dhanmondi, Dhaka 1209). It has no legal, operational, or corporate affiliation with unrelated companies bearing a similar name outside Bangladesh.',
  },
  {
    question: 'How quickly can reporters confirm quotes or inspect source documents?',
    answer:
      'Our verification and media desk responds within one working day (Saturday to Thursday, 11:00 AM to 6:00 PM Dhaka time) via info@eduexpressint.com or +880 1983-333566. Primary regulatory sources and methodology notes are linked publicly on every report.',
  },
];

export default async function PressRoomPage() {
  const now = new Date();
  const [universities, stories] = await Promise.all([
    getUniversityRecords(),
    getPublishedStories().catch(() => []),
  ]);
  const chinaUniversities = universities.filter(u => u.country === 'China');
  const intakes = getChinaIntakes(now);
  const chinaReport = buildChinaBenchmark(chinaUniversities, intakes, stories.length, now);
  const marketSnapshot = buildBangladeshMarketBenchmark(universities, stories.length, now, intakes);
  const year = now.getUTCFullYear();

  const bachelorMedian = chinaReport.tuitionDistributions.bachelorEnglish.median;
  const masterMedian = chinaReport.tuitionDistributions.master.median;

  const pressBriefs = [
    {
      id: 'private-uni-vs-china-roi',
      beat: 'Cost & Higher Education ROI',
      targetOutlets: 'Prothom Alo · The Daily Star · The Daily Campus',
      enTitle: 'Dhaka Private University Tuition vs. China & Malaysia Bachelor Routes (2027 Benchmark)',
      enSummary:
        '4-year CSE/BBA tuition at Dhaka Category-A private universities (EWU, NSU, AIUB) runs ~BDT 9.17–14.30 lakh excluding living costs. Separated-cost schedules show how university-level scholarships in China and post-O-Level Foundation tracks in Malaysia compare transparently.',
      enQuote:
        '"Families should never compare a foreign all-in package estimate against local tuition alone. When tuition and living costs are separated line by line, parents can evaluate real return on investment without hidden surprises." — Abdullah Al Rakib, Founder & CEO',
      bnTitle: 'দেশের বেসরকারি বিশ্ববিদ্যালয় বনাম চীন ও মালয়েশিয়ায় স্নাতক খরচ: ২০২৭ বাস্তব তুলনা',
      bnSummary:
        'ঢাকার ক্যাটাগরি-এ বেসরকারি বিশ্ববিদ্যালয়ে (EWU, NSU, AIUB) ৪ বছরের BBA/CSE টিউশন ফি প্রায় ৯.১৭ থেকে ১৪.৩০ লাখ টাকা (থাকা-খাওয়া আলাদা)। বিপরীতে চীনের র‍্যাঙ্কড বিশ্ববিদ্যালয়ের ইউনিভার্সিটি/প্রভিন্সিয়াল স্কলারশিপ ও মালয়েশিয়ায় O-Level পরবর্তী ফাউন্ডেশন রুটে প্রকৃত খরচ কীভাবে ভিন্ন হয়, তা লিখিত শিডিউলে দেখানো হয়েছে।',
      bnQuote:
        '"বিদেশে পড়ার খরচ যাচাইয়ে টিউশন ফি ও থাকা-খাওয়ার খরচ সবসময় আলাদা দেখতে হবে—তা না হলে অভিভাবকরা ভুল বাজেটের ফাঁদে পড়েন।" — আব্দুল্লাহ আল রাকিব, প্রতিষ্ঠাতা ও সিইও',
      sourceHref: `${SITE}/bangladesh-vs-china-bachelor-study`,
      sourceLabel: 'Bangladesh vs. China Bachelor Comparison (EduExpress International)',
    },
    {
      id: 'student-file-vs-china-payment',
      beat: 'Banking, Remittance & Policy',
      targetOutlets: 'The Business Standard · Bonik Barta · The Financial Express',
      enTitle: 'Bangladesh Bank Student File Rules vs. China On-Campus & CSC Payment Pathways',
      enSummary: `Covering ${marketSnapshot.activeDestinationCount} active study destinations and ${marketSnapshot.liveCatalog.activeUniversities} university records (${chinaReport.universityCount} in China), the 2027 benchmark clarifies where Authorized Dealer (AD) bank Student Files are mandatory (Malaysia, UK, Finland) versus CSC and on-campus China registration payments.`,
      enQuote:
        '"Understanding Bangladesh Bank GFET Student File rules early prevents last-minute offer expiry and helps families plan official foreign-exchange disbursements cleanly." — Mukta Rahaman, Senior Consultant',
      bnTitle: 'বাংলাদেশ ব্যাংক স্টুডেন্ট ফাইল নিয়ম বনাম চীনে স্কলারশিপ ও অন-ক্যাম্পাস পেমেন্ট সুবিধা',
      bnSummary:
        'মালয়েশিয়া, যুক্তরাজ্য বা ফিনল্যান্ডে অগ্রিম টিউশন পাঠাতে বাংলাদেশ ব্যাংকের নীতিমালা অনুযায়ী AD বাণিজ্যিক ব্যাংকে স্টুডেন্ট ফাইল খুলতে হয়। অন্যদিকে চীনে পূর্ণ CSC স্কলারশিপ বা অন-ক্যাম্পাস রেজিস্ট্রেশন পেমেন্ট রুটে কীভাবে পাসপোর্ট এনডোর্সমেন্ট ও ডুয়াল-কারেন্সি কার্ডে প্রক্রিয়া সম্পন্ন হয়, তা ১২ দেশের মার্কেট রিপোর্টে বিশ্লেষণ করা হয়েছে।',
      bnQuote:
        '"আগেই স্টুডেন্ট ফাইল ও বৈধ ব্যাংকিং চ্যানেলের নিয়ম জেনে নিলে অফার লেটার পাওয়ার পর শেষ মুহূর্তের জটিলতা এড়ানো যায়।" — মুক্তা রহমান, সিনিয়র কাউন্সেলর',
      sourceHref: `${SITE}/bangladesh-study-abroad-market`,
      sourceLabel: 'Bangladesh Study Abroad Market 2027 Report (EduExpress International)',
    },
    {
      id: 'anti-fraud-visa-first-policy',
      beat: 'Consumer Protection & Transparency',
      targetOutlets: 'Samakal · Dhaka Tribune · Dhaka Post · JagoNews24',
      enTitle: 'Spotting Fake Visa Guarantee Claims & Hidden Consultancy Charges in Bangladesh',
      enSummary:
        'Only embassies and immigration authorities grant visas, yet unauthorized marketing claims often bundle opaque fees upfront. Under EduExpress International’s Visa-First Policy for China, there is BDT 0 file-opening charge and no EduExpress service fee before China student visa approval (and BDT 0 service fee for Malaysia admissions).',
      enQuote:
        '"No consultancy can guarantee a visa. The strongest safeguard for Bangladeshi parents is an itemized written schedule naming every recipient, amount, and refund rule before paying a single taka." — Abdullah Al Rakib, Founder & CEO',
      bnTitle: 'স্টাডি অ্যাব্রড প্রতারণা প্রতিরোধ: ভুয়া "১০০% ভিসা গ্যারান্টি" ও লুকানো চার্জ চেনার উপায়',
      bnSummary:
        'ভিসা দেওয়ার একক এখতিয়ার দূতাবাসের—কোনো এজেন্সি ভিসার গ্যারান্টি দিতে পারে না। শিক্ষার্থী ও অভিভাবকদের সুরক্ষায় EduExpress International চীনের ক্ষেত্রে ফাইল ওপেনিং ও ভিসার আগে ০ টাকা সার্ভিস ফি নীতি (এবং মালয়েশিয়ায় ০ টাকা সার্ভিস ফি) ও লিখিত ClearCost শিডিউল অনুসরণ করে।',
      bnQuote:
        '"টাকা দেওয়ার আগে কোন ফি কাকে, কখন দিতে হবে এবং রিফান্ডের শর্ত কী—তা লিখিতভাবে নেওয়াই অভিভাবকদের সবচেয়ে বড় সুরক্ষা।" — আব্দুল্লাহ আল রাকিব, প্রতিষ্ঠাতা ও সিইও',
      sourceHref: `${SITE}/china-visa-first-policy`,
      sourceLabel: 'China Visa-First Payment Policy & Verification Rules (EduExpress International)',
    },
    {
      id: 'china-mbbs-bmdc-csca-2027',
      beat: 'Medical, STEM & Entrance Rules',
      targetOutlets: 'Education Portals · Medical & STEM Beats',
      enTitle: `China MBBS & STEM 2027: BMDC Recognition, CSCA Exam & Live Tuition Data (${chinaReport.universityCount} Universities)`,
      enSummary: `Across ${chinaReport.universityCount} active Chinese universities (${chinaReport.programCounts.total} recorded programmes, ${chinaReport.scholarshipTotal} scholarships), explicit median English-taught Bachelor tuition sits at ${bachelorMedian ? `CNY ${bachelorMedian.toLocaleString('en-US')}/yr` : 'published CNY schedules'} and Master's at ${masterMedian ? `CNY ${masterMedian.toLocaleString('en-US')}/yr` : 'published CNY schedules'}. Medical applicants must confirm China MoE English authorization, WDOMS listing, and Bangladesh BMDC RQE rules before paying deposits.`,
      enQuote:
        '"For medical and undergraduate STEM applicants, verifying MoE authorization, BMDC eligibility, and CSCA test readiness upfront matters far more than chasing unverified tuition discounts." — Mukta Rahaman, Senior Consultant',
      bnTitle: 'চীনে MBBS ও ইঞ্জিনিয়ারিং ২০২৭: BMDC স্বীকৃতি, WDOMS যাচাই ও নতুন CSCA পরীক্ষার প্রস্তুতি',
      bnSummary: `চীনের ${chinaReport.universityCount}টি সক্রিয় বিশ্ববিদ্যালয়ের (${chinaReport.programCounts.total}টি প্রোগ্রাম ও ${chinaReport.scholarshipTotal}টি স্কলারশিপ রেকর্ড) ডেটা অনুযায়ী MBBS শিক্ষার্থীর জন্য China MoE অনুমোদন, WDOMS তালিকাভুক্তি এবং বাংলাদেশে ফিরে BMDC রেজিস্ট্রেশন কোয়ালিফাইং পরীক্ষার (RQE) নিয়ম যাচাই বাধ্যতামূলক; পাশাপাশি আন্ডারগ্র্যাজুয়েট ভর্তিতে CSCA পরীক্ষার প্রস্তুতিও এখন গুরুত্বপূর্ণ।`,
      bnQuote:
        '"MBBS বা ইঞ্জিনিয়ারিংয়ে ভর্তির আগে বিশ্ববিদ্যালয়ের সরকারি স্বীকৃতি, BMDC যোগ্যতা ও CSCA পরীক্ষার নিয়ম যাচাই করাই সবচেয়ে জরুরি।" — মুক্তা রহমান, সিনিয়র কাউন্সেলর',
      sourceHref: `${SITE}/china-study-report-bangladesh`,
      sourceLabel: 'Bangladesh to China Study Data & Cost Benchmark Report (EduExpress International)',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'CollectionPage'],
        '@id': `${canonical}#webpage`,
        url: canonical,
        mainEntityOfPage: canonical,
        name: 'Media, Data & Research Press Room — EduExpress International',
        headline: 'Media, Data & Research Press Room | EduExpress International',
        description: `Open CC BY 4.0 Bangladesh study abroad datasets (Zenodo DOI ${OPEN_DATA_REPOSITORIES.zenodoDoi}, GitHub, Kaggle), CNY/BDT tuition benchmarks, bilingual press briefs, spokesperson bios, and verification contacts.`,
        image: `${SITE}/og/china.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
        inLanguage: 'en-BD',
        isAccessibleForFree: true,
        datePublished: '2026-11-21T00:00:00Z',
        dateModified: OPEN_DATA_REPOSITORIES.releaseDateIso,
        about: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        mainEntity: { '@id': `${canonical}#dataset` },
        sameAs: [...OPEN_DATA_SAME_AS],
        ...citationJsonLd([
          ...CHINA_REPORT_OFFICIAL_AUTHORITIES,
          ...BANGLADESH_MARKET_SOURCES.slice(0, 4),
        ]),
      },
      {
        '@type': 'Dataset',
        '@id': `${canonical}#dataset`,
        name: 'Bangladesh Global Study Abroad Cost & Scholarship Dataset (2027)',
        alternateName: 'EduExpress International Bangladesh Global Study Abroad Open Dataset',
        description: `Open CC BY 4.0 dataset covering ${marketSnapshot.liveCatalog.activeUniversities} verified active universities (${chinaReport.universityCount} in China across ${chinaReport.cityCount} cities and ${marketSnapshot.liveCatalog.activeUniversities - chinaReport.universityCount} in Malaysia), ${marketSnapshot.liveCatalog.programsCount} structured degree and language programs, ${marketSnapshot.liveCatalog.itemizedFeeRowsCount} itemized non-tuition fee rows, ${marketSnapshot.liveCatalog.scholarshipsCount} structured university scholarship tracks, and a ${marketSnapshot.globalBenchmarkDestinationCount}-country global Bangladesh outbound cost, visa proof, and scholarship matrix (${marketSnapshot.activeDestinationCount} active EduExpress destinations + ${marketSnapshot.globalBenchmarkDestinationCount - marketSnapshot.activeDestinationCount} global reference benchmarks).`,
        url: canonical,
        identifier: [...OPEN_DATA_IDENTIFIERS],
        sameAs: [...OPEN_DATA_SAME_AS],
        version: OPEN_DATA_REPOSITORIES.version,
        isAccessibleForFree: true,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        datePublished: OPEN_DATA_REPOSITORIES.releaseDateIso,
        dateModified: OPEN_DATA_REPOSITORIES.releaseDateIso,
        inLanguage: ['en-BD', 'bn-BD'],
        measurementTechnique:
          'Direct aggregation of verified active university catalogue profiles, official ministry and immigration sources, explicit single-year CNY tuition rows, and separated non-tuition arrival fees without synthetic currency conversion.',
        creator: [
          {
            '@type': 'Person',
            name: 'Abdullah Al Rakib',
            jobTitle: 'Founder & CEO',
            affiliation: { '@id': `${SITE}/#organization` },
          },
          { '@id': `${SITE}/#organization` },
        ],
        publisher: { '@id': `${SITE}/#organization` },
        spatialCoverage: [
          { '@type': 'Country', name: 'Bangladesh' },
          { '@type': 'Country', name: 'China' },
          { '@type': 'Country', name: 'Malaysia' },
        ],
        temporalCoverage: '2026/2027',
        distribution: [
          {
            '@type': 'DataDownload',
            name: 'Bangladesh Study Abroad Market 2027 Benchmark (Live JSON)',
            encodingFormat: 'application/json',
            contentUrl: `${SITE}/bangladesh-study-abroad-market.json`,
          },
          {
            '@type': 'DataDownload',
            name: 'Bangladesh-to-China Study Cost Benchmark (Live JSON)',
            encodingFormat: 'application/json',
            contentUrl: `${SITE}/china-study-report.json`,
          },
          OPEN_DATA_CSV_DOWNLOADS.universities,
          OPEN_DATA_CSV_DOWNLOADS.programs,
          OPEN_DATA_CSV_DOWNLOADS.scholarships,
          OPEN_DATA_CSV_DOWNLOADS.fees,
          OPEN_DATA_CSV_DOWNLOADS.globalDestinationsMatrix,
          OPEN_DATA_CSV_DOWNLOADS.countryScholarships,
        ],
        variableMeasured: [
          'Annual university tuition in explicit CNY and MYR',
          'Itemized non-tuition arrival, dormitory, insurance, residence permit, and EMGS fees',
          'Scholarship tracks by awarding body (CSC, provincial, university)',
          '12-destination Bangladesh outbound study cost and Bangladesh Bank Student File matrix',
        ],
        keywords: [
          'Bangladesh study abroad dataset',
          'Study in China tuition benchmark',
          'CSC scholarship Bangladesh',
          'Bangladesh Bank Student File',
          'Study in Malaysia cost benchmark',
          'Higher education open data',
          `Zenodo DOI ${OPEN_DATA_REPOSITORIES.zenodoDoi}`,
        ],
      },
    ],
  };

  return (
    <article>
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Media & Press Room' }]}
        eyebrow="Digital PR · Open Research Desk (CC BY 4.0)"
        title="Media, data & research press room."
        lead="Open, zero-signup study abroad datasets, verified tuition benchmarks, bilingual press briefs, and spokesperson contacts for journalists, researchers, and school counselors in Bangladesh."
        reviewed="26 November 2026"
        actions={
          <>
            <a href="#open-datasets" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Browse open datasets <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#press-briefs" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              4 ready-to-cite press briefs
            </a>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <span className={kit.iconLime}>
              <Newspaper size={22} aria-hidden="true" />
            </span>
            <p className="mt-5 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">
              Press &amp; Fact-Checking Desk
            </p>
            <p className="mt-2 text-[15px] leading-6 text-white/85">
              Same-day or next-working-day verification comments on China admissions, CSC/CSCA rules, BMDC medical checks, Malaysia EMGS, and Bangladesh Bank Student Files.
            </p>
            <dl className="mt-5 space-y-2.5 border-t border-white/15 pt-4 text-[14.5px] text-white/90">
              <div className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-lime" aria-hidden="true" />
                <a href={`mailto:${config.contact.email}`} className="underline underline-offset-4 hover:text-lime">
                  {config.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-lime" aria-hidden="true" />
                <a href={`tel:${DEFAULT_OFFICE_RECORD.phonePrimary}`} className="underline underline-offset-4 hover:text-lime">
                  +880 1983-333566
                </a>
              </div>
            </dl>
            <p className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3.5 text-[13px] leading-5 text-white/80">
              <strong className="text-white">Entity note:</strong> Independent Bangladeshi consultancy founded 8 March 2018 in Dhaka; unaffiliated with UK-registered EduExpress Ltd.
            </p>
          </div>
        }
      />

      <TrustBar
        universities={marketSnapshot.liveCatalog.activeUniversities}
        feeNote="All open datasets published under CC BY 4.0"
      />

      {/* Open Datasets & Live Benchmarks */}
      <Section
        id="open-datasets"
        tone="white"
        title="Open datasets & live citation tools."
        intro="All live metrics compute directly from the EduExpress database without synthetic currency estimates. Inspect our permanently archived open-data mirrors (Zenodo DOI, GitHub, and Kaggle), copy APA citations or clean HTML attribution backlinks, or download the live JSON endpoints."
      >
        {/* Archived Open-Data Mirrors & Academic DOI Badges */}
        <div className="mb-8 rounded-3xl border border-petrol-800/15 bg-canvas-soft p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-petrol-800 px-3 py-1 text-[12.5px] font-bold text-lime">
                <Award size={14} aria-hidden="true" />
                Zenodo DOI {OPEN_DATA_REPOSITORIES.zenodoDoi}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-petrol-800/15 bg-white px-3 py-1 text-[12.5px] font-semibold text-petrol-800">
                Release v{OPEN_DATA_REPOSITORIES.version} · CC BY 4.0
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-petrol-800/15 bg-white px-3 py-1 text-[12.5px] font-semibold text-petrol-800">
                {marketSnapshot.liveCatalog.activeUniversities} Verified Universities · {marketSnapshot.globalBenchmarkDestinationCount} Global Countries · 7 CSVs + 2 JSONs
              </span>
            </div>
            <a
              href={OPEN_DATA_REPOSITORIES.zenodoDoiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-petrol-800 underline decoration-lime-deep/50 underline-offset-4 hover:text-lime-deep"
            >
              Verify permanent DOI <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <a
              href={OPEN_DATA_REPOSITORIES.zenodoRecordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0d6efd]/10 px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#0b5ed7]">
                    <Award size={13} aria-hidden="true" /> Zenodo · CERN
                  </span>
                  <ExternalLink size={15} className="text-ink-soft transition group-hover:text-petrol-800" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-[16.5px] font-bold text-petrol-800 group-hover:underline">
                  DOI: {OPEN_DATA_REPOSITORIES.zenodoDoi}
                </h3>
                <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
                  Permanent academic open-access archive with immutable versioned release metadata and DataCite DOI resolution.
                </p>
              </div>
              <span className="mt-3 text-[12.5px] font-semibold text-lime-deep">
                Open Zenodo record →
              </span>
            </a>

            <a
              href={OPEN_DATA_REPOSITORIES.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-petrol-800/10 px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-petrol-800">
                    <GitBranch size={13} aria-hidden="true" /> GitHub Open Data
                  </span>
                  <ExternalLink size={15} className="text-ink-soft transition group-hover:text-petrol-800" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-[16.5px] font-bold text-petrol-800 group-hover:underline">
                  bangladesh-study-abroad-dataset
                </h3>
                <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
                  Direct raw CSV/JSON downloads, Frictionless <code>datapackage.json</code>, <code>CITATION.cff</code>, and Python/JS examples.
                </p>
              </div>
              <span className="mt-3 text-[12.5px] font-semibold text-lime-deep">
                Browse GitHub repo →
              </span>
            </a>

            <a
              href={OPEN_DATA_REPOSITORIES.kaggleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#20beff]/15 px-2.5 py-1 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#0369a1]">
                    <Database size={13} aria-hidden="true" /> Kaggle Public
                  </span>
                  <ExternalLink size={15} className="text-ink-soft transition group-hover:text-petrol-800" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-[16.5px] font-bold text-petrol-800 group-hover:underline">
                  Bangladesh Study Abroad Benchmark
                </h3>
                <p className="mt-1 text-[13.5px] leading-5 text-ink-soft">
                  Interactive tabular explorer across all 9 files ({marketSnapshot.liveCatalog.activeUniversities} universities, {marketSnapshot.liveCatalog.programsCount} programs, {marketSnapshot.globalBenchmarkDestinationCount} countries &amp; scholarships).
                </p>
              </div>
              <span className="mt-3 text-[12.5px] font-semibold text-lime-deep">
                Explore on Kaggle →
              </span>
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardDark}>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-lime">
                <BarChart3 size={15} aria-hidden="true" /> Dataset 01 · {marketSnapshot.globalBenchmarkDestinationCount} Global Destinations ({marketSnapshot.activeDestinationCount} Active)
              </span>
              <span className="text-[13px] text-white/70">Updated {BANGLADESH_MARKET_LAST_VERIFIED_LABEL}</span>
            </div>
            <h3 className="mt-4 text-[24px] font-bold leading-snug text-white">
              Bangladesh Study Abroad Market {year} Report
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-7 text-white/85">
              Aggregates {marketSnapshot.liveCatalog.activeUniversities} active university records,{' '}
              {marketSnapshot.liveCatalog.programsCount} programmes, {marketSnapshot.liveCatalog.scholarshipsCount}{' '}
              scholarships, and {marketSnapshot.activeDestinationCount} destination matrices with separated tuition vs. living budgets and Bangladesh Bank Student File rules.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-semibold">
              <Link href="/bangladesh-study-abroad-market" className="text-lime underline underline-offset-4 hover:text-white">
                English report
              </Link>
              <span aria-hidden="true" className="text-white/40">·</span>
              <Link href="/bn/bangladesh-study-abroad-market" className="text-lime underline underline-offset-4 hover:text-white">
                বাংলা মার্কেট গাইড
              </Link>
              <span aria-hidden="true" className="text-white/40">·</span>
              <Link href="/bangladesh-vs-china-bachelor-study" className="text-lime underline underline-offset-4 hover:text-white">
                BD Private vs. China ROI
              </Link>
            </div>
            <ReportCitationActions
              citationText={`EduExpress International (${year}). Bangladesh Study Abroad Market 2027 Report & 12-Destination Benchmark. ${OPEN_DATA_REPOSITORIES.zenodoDoiUrl} (Report: ${SITE}/bangladesh-study-abroad-market)`}
              reportUrl={`${SITE}/bangladesh-study-abroad-market`}
              reportTitle="Bangladesh Study Abroad Market 2027 Report & 12-Destination Cost Benchmark (EduExpress International)"
              datasetUrl={`${SITE}/bangladesh-study-abroad-market.json`}
              downloadPath="/bangladesh-study-abroad-market.json"
              downloadFilename="eduexpress-bangladesh-study-abroad-market.json"
              analyticsDestination="press_market"
              analyticsLabel="press_bangladesh_market_json"
            />
          </div>

          <div className={kit.cardDark}>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-lime">
                <Landmark size={15} aria-hidden="true" /> Dataset 02 · Flagship China
              </span>
              <span className="text-[13px] text-white/70">{chinaReport.cityCount} Chinese cities</span>
            </div>
            <h3 className="mt-4 text-[24px] font-bold leading-snug text-white">
              Bangladesh-to-China Study Data &amp; Cost Benchmark
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-7 text-white/85">
              Tracks {chinaReport.universityCount} active Chinese universities, {chinaReport.programCounts.total}{' '}
              degree and language programmes, {chinaReport.scholarshipTotal} scholarship records, explicit CNY tuition quartiles, and non-tuition arrival fees alongside CSC, MoE, and BMDC sources.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-semibold">
              <Link href="/china-study-report-bangladesh" className="text-lime underline underline-offset-4 hover:text-white">
                Interactive CNY report
              </Link>
              <span aria-hidden="true" className="text-white/40">·</span>
              <Link href="/compare-costs" className="text-lime underline underline-offset-4 hover:text-white">
                Cost comparison tool
              </Link>
              <span aria-hidden="true" className="text-white/40">·</span>
              <Link href="/mbbs-in-china-bangladesh" className="text-lime underline underline-offset-4 hover:text-white">
                China MBBS &amp; BMDC rules
              </Link>
            </div>
            <ReportCitationActions
              citationText={`EduExpress International (${year}). Bangladesh to China Study Data & Cost Benchmark Report. ${OPEN_DATA_REPOSITORIES.zenodoDoiUrl} (Report: ${SITE}/china-study-report-bangladesh)`}
              reportUrl={`${SITE}/china-study-report-bangladesh`}
              reportTitle="Bangladesh to China Study Data & Cost Benchmark Report (EduExpress International)"
              datasetUrl={`${SITE}/china-study-report.json`}
              downloadPath="/china-study-report.json"
              downloadFilename="eduexpress-china-study-report.json"
              analyticsDestination="press_china"
              analyticsLabel="press_china_report_json"
            />
          </div>
        </div>

        {/* Free Embeddable Study Abroad Cost Calculator Widget */}
        <div id="embed-widget" className="mt-8 scroll-mt-24">
          <EmbedCodeSnippet
            chinaUniversitiesCount={chinaReport.universityCount}
            activeUniversitiesCount={marketSnapshot.liveCatalog.activeUniversities}
            globalDestinationsCount={marketSnapshot.globalBenchmarkDestinationCount}
          />
        </div>
      </Section>

      {/* 4 Bilingual Ready-to-Cite Press Briefs */}
      <Section
        id="press-briefs"
        tone="sage"
        title="4 ready-to-cite EN / BN press briefs."
        intro="Prepared for Bangladeshi education, economy, banking, and consumer-protection beats. Copy either the English brief, Bengali brief, or clean HTML source backlink with one click."
      >
        <div className="grid gap-6">
          {pressBriefs.map((brief, index) => {
            const englishCopy = `${brief.enTitle}\n\n${brief.enSummary}\n\n${brief.enQuote}\n\nSource: ${brief.sourceHref}`;
            const bengaliCopy = `${brief.bnTitle}\n\n${brief.bnSummary}\n\n${brief.bnQuote}\n\nসূত্র: ${brief.sourceHref}`;
            const htmlSnippet = `Source: <a href="${brief.sourceHref}">${brief.sourceLabel}</a> (CC BY 4.0)`;
            return (
              <article key={brief.id} className={kit.card}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-soft pb-3">
                  <span className={kit.badge}>
                    <FileText size={14} aria-hidden="true" />
                    Brief 0{index + 1} · {brief.beat}
                  </span>
                  <span className="text-[13.5px] font-semibold text-ink-soft">
                    Target desks: {brief.targetOutlets}
                  </span>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-lime-deep">
                      English Press Brief
                    </p>
                    <h3 className={`mt-1.5 ${kit.h3}`}>{brief.enTitle}</h3>
                    <p className={`mt-2.5 ${kit.body}`}>{brief.enSummary}</p>
                    <blockquote className="mt-3 rounded-2xl border-l-4 border-lime bg-canvas-soft p-3.5 text-[14.5px] leading-6 text-petrol-800">
                      {brief.enQuote}
                    </blockquote>
                  </div>

                  <div>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-lime-deep">
                      বাংলা প্রেস ব্রিফ (Bangla Desk)
                    </p>
                    <h3 className={`mt-1.5 ${kit.h3}`}>{brief.bnTitle}</h3>
                    <p className={`mt-2.5 ${kit.body}`}>{brief.bnSummary}</p>
                    <blockquote className="mt-3 rounded-2xl border-l-4 border-petrol-800 bg-canvas-soft p-3.5 text-[14.5px] leading-6 text-petrol-800">
                      {brief.bnQuote}
                    </blockquote>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-canvas-soft pt-3">
                  <Link href={brief.sourceHref.replace(SITE, '')} className={kit.link}>
                    Inspect underlying data &amp; official citations <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>

                <PressBriefCopyActions
                  briefId={brief.id}
                  englishBriefText={englishCopy}
                  bengaliBriefText={bengaliCopy}
                  htmlBacklinkSnippet={htmlSnippet}
                />
              </article>
            );
          })}
        </div>
      </Section>

      {/* Spokespersons & Verification Contacts */}
      <Section
        id="spokespersons"
        tone="white"
        title="Verified spokespersons for commentary."
        intro="Available for interviews, data fact-checks, and background briefings in English and Bengali from our Dhanmondi office."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className={kit.cardSage}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <UserCheck size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className={kit.h3}>Abdullah Al Rakib</h3>
                <p className="text-[14px] font-semibold text-lime-deep">Founder &amp; CEO · EduExpress International</p>
              </div>
            </div>
            <p className={`mt-4 ${kit.body}`}>
              Active in Chinese higher-education admissions since 8 March 2018 (including establishing Wuxi Haiying Culture and Art Consulting Co., Ltd. in 2019 before relaunching Bangladesh operations in 2023). Advises journalists on China university cooperation, visa-first consumer safeguards, and B2B agency governance.
            </p>
            <p className="mt-3 text-[14px] font-semibold text-petrol-800">
              Commentary topics: China higher-education policy, anti-fraud fee transparency, institutional verification.
            </p>
          </div>

          <div className={kit.cardSage}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}>
                <MessageSquareQuote size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className={kit.h3}>Mukta Rahaman</h3>
                <p className="text-[14px] font-semibold text-lime-deep">Senior Consultant · All Active Destinations</p>
              </div>
            </div>
            <p className={`mt-4 ${kit.body}`}>
              Leads family cost planning and multi-destination academic fit reviews across China, Malaysia, the UK, Hungary, South Korea, and Finland. Provides background analysis on Bangladesh Bank Student Files, O/A-Level fast-tracks, and BMDC medical recognition steps.
            </p>
            <p className="mt-3 text-[14px] font-semibold text-petrol-800">
              Commentary topics: Tuition vs. living cost planning, Student File documentation, post-SSC/O-Level pathways.
            </p>
          </div>
        </div>
      </Section>

      {/* Entity Facts, Official Assets & Disambiguation */}
      <Section
        id="entity-facts"
        tone="navy"
        title="Official brand facts & entity verification."
        intro="Canonical attribution details for editors, citation indexes, and AI search verification."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/20 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <Building2 size={20} aria-hidden="true" /> Canonical Entity &amp; Dhanmondi Office
            </h3>
            <dl className="mt-4 space-y-2.5 text-[15.5px] leading-7 text-white/85">
              <div>
                <dt className="inline font-semibold text-white">Registered Name: </dt>
                <dd className="inline">EduExpress International (Independent Bangladeshi entity, founded 8 March 2018)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Head Office: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.address}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Phones: </dt>
                <dd className="inline">+880 1983-333566 / +880 1329-663505</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Hours: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.hours} (Friday closed)</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Media &amp; Verification Email: </dt>
                <dd className="inline">{DEFAULT_OFFICE_RECORD.email}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Industry Associations: </dt>
                <dd className="inline">
                  Founding Member (#08),{' '}
                  <a href="https://cbcabd.org/" target="_blank" rel="noopener noreferrer" className="text-lime underline underline-offset-4 hover:text-white">
                    China Bangladesh Consultancy Alliance (CBCA)
                  </a>{' '}
                  · Active Member (ID: FCM-452),{' '}
                  <a href="https://www.facdcab.org/members/directory/2264" target="_blank" rel="noopener noreferrer" className="text-lime underline underline-offset-4 hover:text-white">
                    FACD-CAB Official Directory (#2264)
                  </a>
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-white">Disambiguation: </dt>
                <dd className="inline">
                  Unaffiliated with UK-registered EduExpress Ltd. or similarly named foreign companies outside Bangladesh.
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[20px] font-semibold text-lime">
              <ShieldCheck size={20} aria-hidden="true" /> Governance, Policies &amp; Official Brand Files
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15.5px] leading-7 text-white/85">
              <li>
                <Link href="/how-we-verify-universities" className="text-lime underline underline-offset-4 hover:text-white">
                  How EduExpress verifies universities &amp; recognition
                </Link>
              </li>
              <li>
                <Link href="/fees-and-transparency" className="text-lime underline underline-offset-4 hover:text-white">
                  Public fee policy &amp; ClearCost schedule rules
                </Link>
              </li>
              <li>
                <Link href="/proof-library" className="text-lime underline underline-offset-4 hover:text-white">
                  Proof library &amp; public company records
                </Link>
              </li>
              <li>
                <Link href="/education-consultant-dhaka" className="text-lime underline underline-offset-4 hover:text-white">
                  Dhanmondi Dhaka local office page
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" className="text-lime underline underline-offset-4 hover:text-white">
                  AI &amp; machine-readable discovery index (/llms.txt)
                </Link>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/logo.png"
                download="eduexpress-international-logo.png"
                className="ed-btn ed-btn-signal min-h-[44px] px-5 text-[14px]"
              >
                Download logo (PNG)
              </a>
              <a
                href="/white-logo.png"
                download="eduexpress-international-white-logo.png"
                className="ed-btn ed-btn-on-dark min-h-[44px] px-5 text-[14px]"
              >
                Download white logo (PNG)
              </a>
            </div>
          </div>
        </div>
      </Section>

      <FaqBlock items={MEDIA_FAQS} title="Media, licensing & verification FAQs" tone="sage" />

      <CtaBand
        title="Need custom data or an interview quote?"
        text="Email info@eduexpressint.com or schedule a briefing with our Dhanmondi verification desk."
        assessmentHref="/contact"
      />
    </article>
  );
}

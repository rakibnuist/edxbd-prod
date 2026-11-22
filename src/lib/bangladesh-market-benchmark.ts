import { OFFICIAL_COUNTRY_SOURCES } from '../app/destinations/[country]/country-seo';
import { CHINA_REPORT_OFFICIAL_AUTHORITIES } from './china-benchmark';
import type { ChinaIntakeRow } from './china-intakes';
import { activeCountries } from './countries';
import { destinationPath } from './site-urls';
import type { CleanUniversityRecord } from './university-records';

export const BANGLADESH_MARKET_LAST_VERIFIED_ISO = '2026-11-21';
export const BANGLADESH_MARKET_LAST_VERIFIED_LABEL = '21 November 2026';
export const BANGLADESH_MARKET_NEXT_REVIEW_LABEL = '21 February 2027';

export type MarketAuthoritySource = {
  label: string;
  href: string;
  note: string;
};

export const BANGLADESH_MARKET_SOURCES: MarketAuthoritySource[] = [
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy Department (GFET & Student File)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Official central bank foreign exchange regulations for overseas education remittances and AD bank Student Files',
  },
  {
    label: 'Bangladesh Medical & Dental Council (BMDC)',
    href: 'https://www.bmdc.org.bd/',
    note: 'Foreign medical graduate eligibility and Registration Qualifying Examination (RQE) governance',
  },
  {
    label: 'Campus China — Official Ministry of Education & CSC Portal',
    href: 'https://www.campuschina.org/',
    note: 'Official Chinese Government Scholarship categories, stipends, and Order No. 42 regulations',
  },
  {
    label: 'Education Malaysia Global Services (EMGS)',
    href: 'https://educationmalaysia.gov.my/',
    note: 'Official Malaysian Student Pass, eVAL tracking, and international admission rules',
  },
  {
    label: 'Malaysian Qualifications Register (MQA / MQR)',
    href: 'https://www2.mqa.gov.my/mqr/',
    note: 'Statutory accreditation registry for Malaysian public, private, and international branch campuses',
  },
  {
    label: 'UK Visas and Immigration (UKVI) — Student & Graduate Route',
    href: 'https://www.gov.uk/student-visa',
    note: 'UK Student Visa financial rules, licensed sponsor register, and Jan 2027 18-month Graduate Route transition',
  },
  {
    label: 'Tempus Public Foundation — Stipendium Hungaricum (Bangladesh)',
    href: 'https://stipendiumhungaricum.hu/',
    note: 'Official Hungarian Government scholarship portal and Bangladesh bilateral partner rules',
  },
  {
    label: 'NIIED — Study in Korea & Global Korea Scholarship (GKS)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Official South Korean government admissions, TOPIK, and GKS guidelines',
  },
  {
    label: 'Finnish Immigration Service (Migri) — Studying in Finland',
    href: 'https://migri.fi/en/studying-in-finland',
    note: 'Type A residence permit rules and official EUR 800/month (EUR 9,600/year) means-of-support benchmark',
  },
  {
    label: 'British Council Bangladesh — School & Language Exams',
    href: 'https://www.britishcouncil.org.bd/en/exam/school',
    note: 'CAIE / Edexcel O-Level & A-Level exam registration framework and IELTS testing in Bangladesh',
  },
  {
    label: 'China Bangladesh Consultancy Alliance (CBCA) — Founding Member #08',
    href: 'https://cbcabd.org/',
    note: 'Bilateral China–Bangladesh education consultancy alliance and ethical admissions framework',
  },
  {
    label: 'FACD-CAB (FACECAB) Official Member Directory — EduExpress International (ID: FCM-452)',
    href: 'https://www.facdcab.org/members/directory/2264',
    note: 'Foreign Admission & Career Development Consultants Association of Bangladesh verified member record',
  },
];

export const BANGLADESH_MACRO_INDICATORS = [
  {
    indicator: 'Outbound Bangladeshi Student Pool',
    figure: '50,000+ tertiary (OECD) · 100,000+ broader outbound estimates',
    implication:
      'Bangladesh outbound demand is rising steadily across undergraduate, MBBS, and postgraduate tiers, led by families comparing long-term degree ROI against local private fees.',
    sourceNote: 'OECD Education at a Glance baseline & 2025–2026 ICEF / industry outbound estimates',
  },
  {
    indicator: 'UK Bangladesh Cohort & Policy Shift',
    figure: '12,700 students in UK (HESA 2024–25) · Graduate Route 18 mos from Jan 2027',
    implication:
      'Shorter 18-month post-study Graduate visas (applied on or after 1 Jan 2027) and stricter sponsor compliance require realistic upfront UK ROI checks.',
    sourceNote: 'HESA via UUK & GOV.UK Immigration Rules',
  },
  {
    indicator: 'Macro Currency & Family Co-Decision',
    figure: 'BDT ~30% depreciation over <3 yrs · 49% population under age 24',
    implication:
      'Because parents/guardians co-fund education in BDT, separating institutional tuition from living costs and checking official bank exchange rates prevents mid-degree funding shocks.',
    sourceNote: 'IMF / Bangladesh macro context; EduExpress parent consultation records',
  },
  {
    indicator: 'AI Search Discovery in Admissions',
    figure: '46% student AI tool usage in 2026 college search (up from 26% in 2025)',
    implication:
      'Students and counselors increasingly cross-check fees and visas via AI assistants — making dated, open-license, source-cited datasets essential.',
    sourceNote: 'EAB College Search AI Survey 2026',
  },
  {
    indicator: 'Bangladesh Consultancy Structure',
    figure: '~429 agencies nationally (61% based in Dhaka; median 11–50 staff)',
    implication:
      'Heavy Dhaka agency density without mandatory fee standardization makes written ClearCost schedules and B2B non-poaching MOUs critical differentiators.',
    sourceNote: 'RevenueBase Bangladesh Agency Census (Sep 2026)',
  },
] as const;

export const STUDENT_FILE_COMPARISON = [
  {
    dimension: 'Regulatory Requirement',
    studentFileCountries:
      'Required for countries needing advance tuition or blocked-account remittance (Malaysia, UK, Finland, Hungary self-funded, Germany, Australia, USA). Governed by Bangladesh Bank GFET via an Authorized Dealer (AD) bank branch.',
    chinaAdvantage:
      'Not required for full CSC / Type A scholarships (zero tuition remittance) and most self-funded/provincial-waiver Chinese tracks where fees are settled on campus upon arrival during registration week.',
  },
  {
    dimension: 'Required Documents & Compliance',
    studentFileCountries:
      'Official Offer Letter, itemized institutional fee estimate, attested academic transcripts, IELTS/test score, valid passport/visa, TM form, and sponsor financial/TIN files locked to one AD bank branch (1 academic year limit per release).',
    chinaAdvantage:
      'Standard passport foreign-currency endorsement (USD/CNY) + dual-currency bank card for personal transition funds, transitioning to Alipay/WeChat Pay on campus.',
  },
  {
    dimension: 'Bank Fees & Timeline Friction',
    studentFileCountries:
      'Typical bank Student File opening fee of BDT 5,000–6,000 + VAT, annual renewal fee, SWIFT transfer fees, and multi-day bank branch compliance review before visa deadlines.',
    chinaAdvantage:
      'Zero AD Student File opening fee and zero cross-border wire delay before departure on eligible routes — a major relief for Bangladeshi guardians.',
  },
] as const;

const DESTINATION_MARKET_META: Record<
  string,
  {
    tier: 'Flagship' | 'Wave 1 Active' | 'Wave 2 Active' | 'Wave 3 Active';
    studentFileRule: string;
    eduExpressFeeModel: string;
    keyGuardrail: string;
  }
> = {
  china: {
    tier: 'Flagship',
    studentFileRule: 'Usually Not Needed (On-campus / CSC stipend)',
    eduExpressFeeModel: 'BDT 0 before China visa approval (BDT 200,000 post-visa package)',
    keyGuardrail: 'Third-party app/medical/notary fees itemized separately; MoE/BMDC checks for MBBS.',
  },
  malaysia: {
    tier: 'Wave 1 Active',
    studentFileRule: 'AD Bank Student File for tuition wire',
    eduExpressFeeModel: 'BDT 0 EduExpress service fee',
    keyGuardrail: 'EMGS, VAL, medical & MQA verification required; no guaranteed part-time funding.',
  },
  uk: {
    tier: 'Wave 1 Active',
    studentFileRule: 'AD Bank Student File + 28-day bank solvency',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Graduate Route moves to 18 mos (from Jan 2027); verify licensed sponsor status.',
  },
  hungary: {
    tier: 'Wave 1 Active',
    studentFileRule: 'Not needed for Stipendium Hungaricum; AD file for self-funded',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Follow Tempus Public Foundation deadlines (Jan 15); never promise nomination.',
  },
  'south-korea': {
    tier: 'Wave 1 Active',
    studentFileRule: 'AD Bank Student File for self-funded tuition',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Check NIIED GKS deadlines & Korean TOPIK vs English-track readiness.',
  },
  finland: {
    tier: 'Wave 1 Active',
    studentFileRule: 'AD Bank Student File + EUR 9,600/yr liquid proof',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Migri EUR 800/month (€9,600/yr) living proof required separately from tuition.',
  },
  malta: {
    tier: 'Wave 2 Active',
    studentFileRule: 'AD Bank Student File for direct tuition',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Verify institution accreditation and language requirements before deposit.',
  },
  cyprus: {
    tier: 'Wave 2 Active',
    studentFileRule: 'AD Bank Student File / verified bank proof',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Strictly distinguish Republic of Cyprus (EU) vs Northern Cyprus jurisdiction.',
  },
  georgia: {
    tier: 'Wave 2 Active',
    studentFileRule: 'AD Bank Student File / verified wire',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Lead medical (MD/MBBS) checks with WDOMS & BMDC RQE licensing rules.',
  },
  greece: {
    tier: 'Wave 3 Active',
    studentFileRule: 'AD Bank Student File for tuition wire',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Verify English-taught degree availability & national visa steps first.',
  },
  croatia: {
    tier: 'Wave 3 Active',
    studentFileRule: 'AD Bank Student File for tuition wire',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Lead with accredited degree recognition; never market Schengen mobility.',
  },
  thailand: {
    tier: 'Wave 3 Active',
    studentFileRule: 'AD Bank Student File / verified tuition transfer',
    eduExpressFeeModel: 'Written service schedule before onboarding',
    keyGuardrail: 'Separate accredited university degrees from short language courses; verify ED visa.',
  },
};

export type DestinationPortfolioRow = {
  slug: string;
  name: string;
  href: string;
  tier: string;
  intakes: string;
  indicativeTuition: string;
  indicativeLiving: string;
  studentFileRule: string;
  eduExpressFeeModel: string;
  keyGuardrail: string;
  officialSources: { label: string; href: string }[];
};

export type BangladeshMarketSnapshot = {
  generatedAtIso: string;
  activeDestinationCount: number;
  liveCatalog: {
    activeUniversities: number;
    byCountry: { country: string; count: number }[];
    programsCount: number;
    itemizedFeeRowsCount: number;
    scholarshipsCount: number;
    verifiedUniversitiesCount: number;
    consentedStoriesCount: number;
  };
  chinaIntakes: ChinaIntakeRow[];
  destinations: DestinationPortfolioRow[];
};

export function buildBangladeshMarketBenchmark(
  universities: CleanUniversityRecord[],
  storyCount: number,
  now: Date = new Date(),
  chinaIntakes: ChinaIntakeRow[] = [],
): BangladeshMarketSnapshot {
  const activeUnis = universities.filter((u) => u.isActive);
  const countryMap = new Map<string, number>();
  let programsCount = 0;
  let itemizedFeeRowsCount = 0;
  let scholarshipsCount = 0;
  let verifiedUniversitiesCount = 0;

  for (const uni of activeUnis) {
    countryMap.set(uni.country, (countryMap.get(uni.country) ?? 0) + 1);
    programsCount += uni.programs.length;
    itemizedFeeRowsCount += uni.fees.length;
    scholarshipsCount += uni.scholarships.length;
    if (uni.verificationStatus === 'verified') verifiedUniversitiesCount += 1;
  }

  const byCountry = [...countryMap.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));

  const destinations: DestinationPortfolioRow[] = activeCountries.map((country) => {
    const meta = DESTINATION_MARKET_META[country.slug] ?? {
      tier: 'Wave 3 Active',
      studentFileRule: 'AD Bank Student File where advance tuition wire applies',
      eduExpressFeeModel: 'Written service schedule before onboarding',
      keyGuardrail: 'Confirm institution accreditation and official embassy notice prior to payment.',
    };
    const sources =
      country.slug === 'china'
        ? CHINA_REPORT_OFFICIAL_AUTHORITIES.slice(0, 3).map((s) => ({ label: s.label, href: s.href }))
        : country.slug === 'malaysia'
          ? [
              { label: 'Education Malaysia Global Services (EMGS)', href: 'https://educationmalaysia.gov.my/' },
              { label: 'Malaysian Qualifications Register (MQR / MQA)', href: 'https://www2.mqa.gov.my/mqr/' },
            ]
          : OFFICIAL_COUNTRY_SOURCES[country.slug] ?? [];

    return {
      slug: country.slug,
      name: country.name,
      href: destinationPath(country.slug),
      tier: meta.tier,
      intakes: country.intakesText || 'Check current cycle',
      indicativeTuition: country.costs?.tuition || 'Confirmed per institution',
      indicativeLiving: country.costs?.living || 'Prepared in written schedule',
      studentFileRule: meta.studentFileRule,
      eduExpressFeeModel: meta.eduExpressFeeModel,
      keyGuardrail: meta.keyGuardrail,
      officialSources: sources,
    };
  });

  return {
    generatedAtIso: now.toISOString(),
    activeDestinationCount: activeCountries.length,
    liveCatalog: {
      activeUniversities: activeUnis.length,
      byCountry,
      programsCount,
      itemizedFeeRowsCount,
      scholarshipsCount,
      verifiedUniversitiesCount,
      consentedStoriesCount: storyCount,
    },
    chinaIntakes,
    destinations,
  };
}

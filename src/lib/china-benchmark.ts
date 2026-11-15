import {
  SCHOLARSHIP_CATEGORIES,
  toFeeRows,
  toProgramRows,
  toScholarshipRows,
  type FeeCategory,
  type ScholarshipCategory,
} from './catalog-views';
import { MIN_CITY_UNIVERSITIES, citySlug } from './city-pages';
import type { ChinaIntakeRow } from './china-intakes';
import type { CleanUniversityRecord } from './university-records';

export type NumericDistribution = {
  count: number;
  min: number | null;
  q1: number | null;
  median: number | null;
  q3: number | null;
  max: number | null;
};

export type CityBenchmarkRow = {
  city: string;
  slug: string;
  count: number;
  hasCityPage: boolean;
};

export type FeeBenchmarkRow = {
  category: FeeCategory;
  label: string;
  sampleCount: number;
  min: number | null;
  median: number | null;
  max: number | null;
};

export type ChinaBenchmarkReport = {
  universityCount: number;
  cityCount: number;
  topCities: CityBenchmarkRow[];
  verification: {
    verified: number;
    underVerification: number;
    expired: number;
    withOfficialSource: number;
  };
  englishMediumUniversityCount: number;
  mbbsListedUniversityCount: number;
  programCounts: {
    total: number;
    bachelorEnglish: number;
    bachelorChinese: number;
    master: number;
    phd: number;
    mbbs: number;
    languageAndFoundation: number;
  };
  tuitionDistributions: {
    allExplicit: NumericDistribution;
    bachelorEnglish: NumericDistribution;
    bachelorChinese: NumericDistribution;
    master: NumericDistribution;
    phd: NumericDistribution;
  };
  feeBenchmarks: FeeBenchmarkRow[];
  scholarshipTotal: number;
  scholarshipCategories: { category: ScholarshipCategory; count: number }[];
  intakes: ChinaIntakeRow[];
  storyCount: number;
  latestVerifiedIso: string | null;
};

function percentile(sorted: number[], p: number): number {
  const idx = (sorted.length - 1) * p;
  const low = Math.floor(idx);
  const high = Math.ceil(idx);
  if (low === high) return sorted[low];
  return Math.round(sorted[low] + (sorted[high] - sorted[low]) * (idx - low));
}

export function summarizeDistribution(values: number[]): NumericDistribution {
  const valid = values
    .filter(value => Number.isFinite(value) && value >= 0)
    .sort((a, b) => a - b);
  if (!valid.length) {
    return { count: 0, min: null, q1: null, median: null, q3: null, max: null };
  }
  return {
    count: valid.length,
    min: valid[0],
    q1: percentile(valid, 0.25),
    median: percentile(valid, 0.5),
    q3: percentile(valid, 0.75),
    max: valid[valid.length - 1],
  };
}

const FEE_BENCHMARK_ITEMS: { category: FeeCategory; label: string }[] = [
  { category: 'application', label: 'University application fee (one-off / recorded CNY)' },
  { category: 'accommodation', label: 'On-campus dormitory (annual CNY)' },
  { category: 'insurance', label: 'Comprehensive medical insurance (annual CNY)' },
  { category: 'medical', label: 'Health check / verification (recorded CNY)' },
  { category: 'residence', label: 'Residence permit issuance (recorded CNY)' },
];

export const CHINA_REPORT_OFFICIAL_AUTHORITIES = [
  {
    label: 'Chinese Government Scholarship Portal (CSC / CampusChina)',
    href: 'https://www.campuschina.org/',
    note: 'Official CSC Type A & Type B scholarship categories and stipend rules',
  },
  {
    label: 'Ministry of Education of the People’s Republic of China (MoE)',
    href: 'https://en.moe.gov.cn/documents/laws_policies/201506/t20150626_191405.html',
    note: 'Regulations governing English-taught international undergraduate medical programmes',
  },
  {
    label: 'Chinese Visa Application Service Center in Dhaka (CVASC)',
    href: 'https://www.visaforchina.cn/DAC4_EN/',
    note: 'Official Dhaka visa submission desk for X1 and X2 student visas',
  },
  {
    label: 'Chinese Embassy Bangladesh Visa Agency Notice',
    href: 'https://bd.china-embassy.gov.cn/eng/lsyw/lsxx/202605/t20260520_11914015.htm',
    note: 'Confirmation that China does not appoint exclusive commercial visa agencies',
  },
  {
    label: 'China Scholastic Competency Assessment (CSCA)',
    href: 'https://csca.cn/',
    note: 'Undergraduate entrance assessment subjects required by participating Chinese universities',
  },
  {
    label: 'Bangladesh Medical & Dental Council (BMDC)',
    href: 'https://www.bmdc.org.bd/',
    note: 'Foreign medical graduate eligibility and Registration Qualifying Examination governance',
  },
] as const;

export function buildChinaBenchmark(
  universities: CleanUniversityRecord[],
  intakes: ChinaIntakeRow[],
  storyCount: number,
  now: Date = new Date(),
): ChinaBenchmarkReport {
  const chinaUniversities = universities.filter(
    university => university.isActive && university.country.toLowerCase() === 'china',
  );

  const cityMap = new Map<string, number>();
  let verified = 0;
  let underVerification = 0;
  let expired = 0;
  let withOfficialSource = 0;
  let englishMediumUniversityCount = 0;
  let mbbsListedUniversityCount = 0;
  let latestVerifiedMs = -1;

  for (const university of chinaUniversities) {
    const cityName = university.city.trim();
    if (cityName) cityMap.set(cityName, (cityMap.get(cityName) ?? 0) + 1);

    if (university.verificationStatus === 'verified') verified += 1;
    else if (university.verificationStatus === 'expired') expired += 1;
    else underVerification += 1;

    const hasSource = Boolean(
      university.officialUrl
      || university.sourceUrls.length
      || university.programs.some(program => Boolean(program.sourceUrl)),
    );
    if (hasSource) withOfficialSource += 1;

    if (university.taught.some(lang => /english/i.test(lang)) || university.programs.some(p => p.languages.some(l => /english/i.test(l)))) {
      englishMediumUniversityCount += 1;
    }

    if (
      /bmdc|wdoms|moe/i.test(university.recognitionAuthority || '') && /bmdc|wdoms/i.test(university.recognitionAuthority || '')
      || university.badges.some(badge => /mbbs/i.test(badge))
    ) {
      mbbsListedUniversityCount += 1;
    }

    if (university.lastVerifiedAt) {
      const parsed = Date.parse(university.lastVerifiedAt);
      if (Number.isFinite(parsed) && parsed > latestVerifiedMs) latestVerifiedMs = parsed;
    }
  }

  const topCities: CityBenchmarkRow[] = [...cityMap.entries()]
    .map(([city, count]) => ({
      city,
      slug: citySlug(city),
      count,
      hasCityPage: count >= MIN_CITY_UNIVERSITIES,
    }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, 10);

  const programRows = toProgramRows(chinaUniversities, now);
  const bachelorEnglishRows = programRows.filter(row => row.level === 'Bachelor' && row.languages.includes('English'));
  const bachelorChineseRows = programRows.filter(row => row.level === 'Bachelor' && row.languages.includes('Chinese') && !row.languages.includes('English'));
  const masterRows = programRows.filter(row => row.level === 'Master');
  const phdRows = programRows.filter(row => row.level === 'PhD');
  const mbbsRows = programRows.filter(row => row.level === 'MBBS');
  const langFoundationRows = programRows.filter(row => row.level === 'Chinese language' || row.level === 'Foundation');

  const explicitCny = (rows: typeof programRows) =>
    rows.map(row => row.annualTuitionCny).filter((value): value is number => value !== null);

  const allFeeRows = chinaUniversities.flatMap(toFeeRows);
  const feeBenchmarks: FeeBenchmarkRow[] = FEE_BENCHMARK_ITEMS.map(({ category, label }) => {
    const amounts = allFeeRows
      .filter(fee => fee.category === category && fee.firstYearCny !== null)
      .map(fee => fee.firstYearCny as number);
    const dist = summarizeDistribution(amounts);
    return {
      category,
      label,
      sampleCount: dist.count,
      min: dist.min,
      median: dist.median,
      max: dist.max,
    };
  });

  const scholarshipRows = toScholarshipRows(chinaUniversities, now);
  const scholarshipCategories = SCHOLARSHIP_CATEGORIES.map(category => ({
    category,
    count: scholarshipRows.filter(item => item.category === category).length,
  }));

  return {
    universityCount: chinaUniversities.length,
    cityCount: cityMap.size,
    topCities,
    verification: {
      verified,
      underVerification,
      expired,
      withOfficialSource,
    },
    englishMediumUniversityCount,
    mbbsListedUniversityCount,
    programCounts: {
      total: programRows.length,
      bachelorEnglish: bachelorEnglishRows.length,
      bachelorChinese: bachelorChineseRows.length,
      master: masterRows.length,
      phd: phdRows.length,
      mbbs: mbbsRows.length,
      languageAndFoundation: langFoundationRows.length,
    },
    tuitionDistributions: {
      allExplicit: summarizeDistribution(explicitCny(programRows)),
      bachelorEnglish: summarizeDistribution(explicitCny(bachelorEnglishRows)),
      bachelorChinese: summarizeDistribution(explicitCny(bachelorChineseRows)),
      master: summarizeDistribution(explicitCny(masterRows)),
      phd: summarizeDistribution(explicitCny(phdRows)),
    },
    feeBenchmarks,
    scholarshipTotal: scholarshipRows.length,
    scholarshipCategories,
    intakes,
    storyCount,
    latestVerifiedIso: latestVerifiedMs > 0 ? new Date(latestVerifiedMs).toISOString().slice(0, 10) : null,
  };
}

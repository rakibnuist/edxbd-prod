import 'server-only';

/**
 * Zero-Leak Public Serializer for the Embeddable Cost Calculator & Public Cost API.
 *
 * Implements the 2-Tier Hybrid Model:
 * - Strictly whitelists ONLY public cost, program, fee, and scholarship fields.
 * - NEVER emits private deep `sourceUrl`, `sourceUrls`, `officialUrl`,
 *   `recognitionSourceUrl`, or `relationshipEvidenceUrl` into client props or API JSON.
 * - Keeps deep monitoring URLs strictly in `InternalSourceWatch` (admin-only).
 */

import { toFeeRows, toProgramRows, type FeeRow, type ProgramRow } from './catalog-views';
import {
  GLOBAL_DESTINATIONS_BENCHMARK,
  type CountryScholarshipBenchmark,
  type DestinationRegion,
  type DestinationServiceStatus,
} from './global-study-destinations';
import type { CleanUniversityRecord } from './university-records';
import {
  toPublicScholarshipScenario,
  type PublicScholarshipScenario,
} from './widget-scholarship-math';

export type PublicCalculatorProgram = Omit<ProgramRow, 'sourceUrl'>;
export type PublicCalculatorFee = Omit<FeeRow, 'sourceUrl'>;

export type PublicCalculatorUniversitySummary = {
  slug: string;
  name: string;
  city: string;
  country: string;
  levels: string[];
  languages: string[];
  hasEnglishTaught: boolean;
  hasChineseLanguage: boolean;
  programCount: number;
  scholarshipCount: number;
  minAnnualTuitionCny: number | null;
  lastVerifiedIso: string | null;
  /** Compact searchable index string (city + university + majors/programs + badges). */
  searchText: string;
};

export type PublicCalculatorUniversityDetail = {
  slug: string;
  name: string;
  city: string;
  country: string;
  lastVerifiedIso: string | null;
  recognitionAuthority: string | null;
  programs: PublicCalculatorProgram[];
  fees: PublicCalculatorFee[];
  scholarships: PublicScholarshipScenario[];
};

export type PublicCalculatorDestination = {
  slug: string;
  name: string;
  flag: string;
  region: DestinationRegion;
  serviceStatus: DestinationServiceStatus;
  tier: string;
  href: string | null;
  currency: string;
  intakes: string;
  indicativeTuition: string;
  indicativeLiving: string;
  officialVisaFinancialProof: string;
  studentFileRule: string;
  partTimeWorkRights: string;
  postStudyWorkPolicy: string;
  eduExpressFeeModel: string;
  keyGuardrail: string;
  flagshipScholarships: CountryScholarshipBenchmark[];
  publicAuthorityNames: string[];
  lastVerifiedIso: string;
};

function stripProgramSourceUrl(row: ProgramRow): PublicCalculatorProgram {
  const { sourceUrl: _hidden, ...pub } = row;
  void _hidden;
  return pub;
}

function stripFeeSourceUrl(row: FeeRow): PublicCalculatorFee {
  const { sourceUrl: _hidden, ...pub } = row;
  void _hidden;
  return pub;
}

export function buildPublicUniversityDetail(
  university: CleanUniversityRecord,
  now: Date = new Date(),
): PublicCalculatorUniversityDetail {
  const programs = toProgramRows([university], now).map(stripProgramSourceUrl);
  const fees = toFeeRows(university).map(stripFeeSourceUrl);
  const scholarships = university.scholarships
    .filter((s) => s.status !== 'closed')
    .map((s, idx) => toPublicScholarshipScenario(university.slug, idx, s));

  return {
    slug: university.slug,
    name: university.name,
    city: university.city,
    country: university.country,
    lastVerifiedIso: university.lastVerifiedAt ? university.lastVerifiedAt.slice(0, 10) : null,
    recognitionAuthority: university.recognitionAuthority || null,
    programs,
    fees,
    scholarships,
  };
}

export function buildPublicUniversitySummaries(
  chinaUniversities: CleanUniversityRecord[],
  now: Date = new Date(),
): PublicCalculatorUniversitySummary[] {
  return chinaUniversities
    .filter((u) => u.isActive && u.country.toLowerCase() === 'china')
    .map((u) => {
      const programs = toProgramRows([u], now);
      const levels = Array.from(new Set(programs.map((p) => p.level)));
      const langSet = new Set<string>();
      for (const l of u.taught) if (l.trim()) langSet.add(l.trim());
      for (const p of programs) {
        for (const l of p.languages) if (l.trim()) langSet.add(l.trim());
      }
      const languages = Array.from(langSet);

      const hasEnglishTaught =
        languages.some((l) => /english/i.test(l)) ||
        programs.some((p) => p.languages.some((l) => /english/i.test(l)));

      const hasChineseLanguage =
        levels.includes('Chinese language') ||
        programs.some((p) => p.level === 'Chinese language' || /chinese\s+language/i.test(p.name)) ||
        u.degree.some((d) => /language|non.?degree/i.test(d));

      const explicitTuitions = programs
        .map((p) => p.annualTuitionCny)
        .filter((v): v is number => v !== null && v > 0);
      const minAnnualTuitionCny = explicitTuitions.length ? Math.min(...explicitTuitions) : null;

      const uniqueProgramNames = Array.from(new Set(programs.map((p) => p.name))).slice(0, 40);
      const searchText = [
        u.name,
        u.aliases.join(' '),
        u.city,
        u.location,
        levels.join(' '),
        languages.join(' '),
        u.badges.join(' '),
        uniqueProgramNames.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return {
        slug: u.slug,
        name: u.name,
        city: u.city,
        country: u.country,
        levels,
        languages,
        hasEnglishTaught,
        hasChineseLanguage,
        programCount: programs.length,
        scholarshipCount: u.scholarships.filter((s) => s.status !== 'closed').length,
        minAnnualTuitionCny,
        lastVerifiedIso: u.lastVerifiedAt ? u.lastVerifiedAt.slice(0, 10) : null,
        searchText,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Public-safe destination rows for the embeddable widget (zero external URLs;
 * keeps Tier-1 authority names + verification date only).
 */
export function buildPublicCalculatorDestinations(): PublicCalculatorDestination[] {
  return GLOBAL_DESTINATIONS_BENCHMARK.map((d) => ({
    slug: d.slug,
    name: d.name,
    flag: d.flag,
    region: d.region,
    serviceStatus: d.serviceStatus,
    tier: d.tier,
    href: d.href,
    currency: d.currency,
    intakes: d.intakes,
    indicativeTuition: d.indicativeTuition,
    indicativeLiving: d.indicativeLiving,
    officialVisaFinancialProof: d.officialVisaFinancialProof,
    studentFileRule: d.studentFileRule,
    partTimeWorkRights: d.partTimeWorkRights,
    postStudyWorkPolicy: d.postStudyWorkPolicy,
    eduExpressFeeModel: d.eduExpressFeeModel,
    keyGuardrail: d.keyGuardrail,
    flagshipScholarships: d.flagshipScholarships,
    publicAuthorityNames: d.publicAuthorityNames,
    lastVerifiedIso: d.lastVerifiedIso,
  }));
}

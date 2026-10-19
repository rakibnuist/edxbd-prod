import type { CleanUniversityRecord } from './university-records';
import { parseSourceFee } from './clear-cost';

/** Flat, serializable views of the university catalogue for cross-university finders. */

export type ProgramRow = {
  key: string;
  universitySlug: string;
  universityName: string;
  city: string;
  level: string;
  name: string;
  languages: string[];
  duration?: string;
  tuitionLabel?: string;
  /** Only set when the recorded tuition is one explicit CNY amount per year. */
  annualTuitionCny: number | null;
  deadline?: string;
  deadlinePassed: boolean;
  sourceUrl?: string;
};

export type ScholarshipCategory = 'Chinese Government (CSC)' | 'Provincial or city government' | 'Belt and Road / ministry' | 'Chinese language (CLEC)' | 'University scholarship';

export type ScholarshipRow = {
  key: string;
  title: string;
  category: ScholarshipCategory;
  universitySlug: string;
  universityName: string;
  city: string;
  summary: string[];
  eligiblePrograms: string[];
  renewal?: string;
  deadline?: string;
  deadlinePassed: boolean;
  sourceUrl?: string;
};

export const SCHOLARSHIP_CATEGORIES: ScholarshipCategory[] = ['Chinese Government (CSC)', 'Provincial or city government', 'Belt and Road / ministry', 'Chinese language (CLEC)', 'University scholarship'];

const httpUrl = (value?: string) => (value && /^https?:\/\//i.test(value) ? value : undefined);

/** Map catalogue spellings ("Master's", "Masters", "Undergraduate") onto one label. */
export function levelLabel(value: string): string {
  const label = value.trim().toLowerCase().replace(/[’'.-]/g, '');
  if (/mbbs|clinical medicine/.test(label)) return 'MBBS';
  if (/phd|doctor/.test(label)) return 'PhD';
  if (/master|postgraduate/.test(label)) return 'Master';
  if (/bachelor|undergraduate/.test(label)) return 'Bachelor';
  if (/language|chinese studies|nondegree/.test(label)) return 'Chinese language';
  if (/foundation|preparatory|preuniversity/.test(label)) return 'Foundation';
  return value.trim() || 'Other';
}

const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december';

/**
 * Read the first explicit day-month-year date in a free-text deadline.
 * Text that says "closed" is treated as passed; anything unreadable is not.
 */
export function deadlineHasPassed(raw: string | undefined, now: Date): boolean {
  if (!raw?.trim()) return false;
  if (/\bclosed\b/i.test(raw)) return true;
  const text = raw.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1');
  const dayFirst = text.match(new RegExp(`\\b(\\d{1,2})\\s+(${MONTHS})\\s*,?\\s+(\\d{4})`, 'i'));
  const monthFirst = text.match(new RegExp(`\\b(${MONTHS})\\s+(\\d{1,2})\\s*,?\\s+(\\d{4})`, 'i'));
  const parts = dayFirst ? { day: dayFirst[1], month: dayFirst[2], year: dayFirst[3] } : monthFirst ? { day: monthFirst[2], month: monthFirst[1], year: monthFirst[3] } : null;
  if (!parts) return false;
  const month = MONTHS.split('|').indexOf(parts.month.toLowerCase());
  // A deadline stays open until the end of its stated day.
  const end = new Date(Number(parts.year), month, Number(parts.day), 23, 59, 59);
  return Number.isFinite(end.getTime()) && end < now;
}

export function scholarshipCategory(title: string, type = ''): ScholarshipCategory {
  const text = `${title} ${type}`.toLowerCase();
  if (/chinese government|\bcsc\b|china scholarship council/.test(text)) return 'Chinese Government (CSC)';
  if (/belt and road|silk road|ministry of commerce|mofcom|\bwmo\b/.test(text)) return 'Belt and Road / ministry';
  if (/\bclec\b|chinese language teachers|confucius/.test(text)) return 'Chinese language (CLEC)';
  if (/provincial|province|municipal|government scholarship|city scholarship/.test(text)) return 'Provincial or city government';
  return 'University scholarship';
}

export type FeeCategory = 'application' | 'registration' | 'accommodation' | 'insurance' | 'medical' | 'residence' | 'other';
export const FEE_LABELS: Record<FeeCategory, string> = {
  application: 'Application fee', registration: 'Registration fee', accommodation: 'Accommodation',
  insurance: 'Insurance', medical: 'Medical check', residence: 'Residence permit', other: 'Other recorded fees',
};
/** Charges every student pays in year one; "other" is shown but never added to a total. */
export const FIRST_YEAR_FEES: FeeCategory[] = ['application', 'registration', 'accommodation', 'insurance', 'medical', 'residence'];

export type FeeRow = { item: string; cost: string; category: FeeCategory; firstYearCny: number | null; sourceUrl?: string };

export function feeCategory(item: string): FeeCategory | null {
  const text = item.toLowerCase();
  if (/tuition/.test(text)) return null; // Tuition comes from the program record.
  if (/application/.test(text)) return 'application';
  if (/registration/.test(text)) return 'registration';
  if (/hostel|accommodation|dormitor/.test(text)) return 'accommodation';
  if (/insurance/.test(text)) return 'insurance';
  if (/medical|health check|physical exam/.test(text)) return 'medical';
  if (/residen|visa extension/.test(text)) return 'residence';
  return 'other';
}

/** Yearly charges must say "per year"; one-off charges must not name any period. */
const firstYearAmount = (category: FeeCategory, cost: string) => (['accommodation', 'insurance'].includes(category)
  ? parseSourceFee(cost, 'CNY', 'year')
  : parseSourceFee(cost, 'CNY', 'oneoff') ?? parseSourceFee(cost, 'CNY', 'year'));

export function toFeeRows(university: CleanUniversityRecord): FeeRow[] {
  return university.fees.flatMap(fee => {
    const category = feeCategory(fee.item);
    if (!category) return [];
    return [{ item: fee.item, cost: fee.cost, category, firstYearCny: category === 'other' ? null : firstYearAmount(category, fee.cost), sourceUrl: httpUrl(fee.sourceUrl) }];
  });
}

/**
 * First-year cost from recorded figures. A total is only given when tuition and
 * every recorded first-year fee are explicit CNY amounts; otherwise the gaps are named.
 */
export function firstYearEstimate(program: Pick<ProgramRow, 'annualTuitionCny'>, fees: FeeRow[]) {
  const unclear: string[] = [];
  let total = program.annualTuitionCny ?? 0;
  if (program.annualTuitionCny === null) unclear.push('Tuition');
  for (const category of FIRST_YEAR_FEES) {
    const items = fees.filter(fee => fee.category === category);
    if (!items.length) continue;
    // Several room types or plans: the student's choice decides, so do not pick one.
    if (items.length > 1 || items[0].firstYearCny === null) unclear.push(FEE_LABELS[category]);
    else total += items[0].firstYearCny;
  }
  const missing = FIRST_YEAR_FEES.filter(category => !fees.some(fee => fee.category === category)).map(category => FEE_LABELS[category]);
  return { total: unclear.length ? null : total, partial: total, unclear, missing };
}

const sentenceList = (value?: string) => (value || '').split(/;\s*/).map(item => item.trim()).filter(Boolean);

export function toProgramRows(universities: CleanUniversityRecord[], now: Date): ProgramRow[] {
  return universities.filter(university => university.isActive).flatMap(university => university.programs
    .filter(program => program.status !== 'paused')
    .map((program, index) => ({
      key: `${university.slug}-${index}`,
      universitySlug: university.slug,
      universityName: university.name,
      city: university.city,
      level: levelLabel(program.level),
      name: program.name,
      languages: program.languages,
      duration: program.duration,
      tuitionLabel: program.tuition,
      annualTuitionCny: parseSourceFee(program.tuition, 'CNY', 'year'),
      deadline: program.applicationDeadline,
      deadlinePassed: deadlineHasPassed(program.applicationDeadline, now),
      sourceUrl: httpUrl(program.sourceUrl),
    })));
}

export function toScholarshipRows(universities: CleanUniversityRecord[], now: Date): ScholarshipRow[] {
  return universities.filter(university => university.isActive).flatMap(university => university.scholarships.map((scholarship, index) => {
    const recorded = [...sentenceList(scholarship.amount), ...sentenceList(scholarship.coverage), ...scholarship.details]
      .filter(item => !/^see details$/i.test(item));
    return {
      key: `${university.slug}-${index}`,
      title: scholarship.title,
      category: scholarshipCategory(scholarship.title, scholarship.type),
      universitySlug: university.slug,
      universityName: university.name,
      city: university.city,
      summary: Array.from(new Set(recorded)).slice(0, 4),
      eligiblePrograms: scholarship.eligiblePrograms,
      renewal: scholarship.renewal,
      deadline: scholarship.deadline,
      deadlinePassed: scholarship.status === 'closed' || deadlineHasPassed(scholarship.deadline, now),
      sourceUrl: httpUrl(scholarship.sourceUrl),
    };
  }));
}

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

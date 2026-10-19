import type { CleanUniversityRecord } from './university-records';

export type DirectoryFilters = {
  search: string;
  country: string;
  city: string;
  level: string;
  language: string;
  subject: string;
  intake: string;
  scholarship: boolean;
  sort: 'name' | 'city';
};

export const emptyDirectoryFilters: DirectoryFilters = {
  search: '', country: '', city: '', level: '', language: '', subject: '', intake: '', scholarship: false, sort: 'name',
};

const filterKeys = ['search', 'country', 'city', 'level', 'language', 'subject', 'intake', 'scholarship', 'sort'] as const;
const normalized = (value: string) => value.trim().toLocaleLowerCase();
const same = (a: string, b: string) => normalized(a) === normalized(b);
const contains = (values: string[], selected: string) => values.some(value => same(value, selected));
// Source catalogues use both degree names and possessive labels. A planner's
// canonical level must find the same programme under either spelling.
const studyLevel = (value: string) => {
  const label = normalized(value).replace(/[’'.-]/g, '');
  if (/phd|doctor/.test(label)) return 'phd';
  if (/bachelor|undergraduate/.test(label)) return 'bachelor';
  if (/master|postgraduate/.test(label)) return 'master';
  if (/language|chinese studies|nondegree/.test(label)) return 'language';
  if (/foundation|preparatory|preuniversity/.test(label)) return 'foundation';
  if (/diploma|associate/.test(label)) return 'diploma';
  return label;
};
const sameStudyLevel = (a: string, b: string) => studyLevel(a) === studyLevel(b);

export function readDirectoryFilters(params: Pick<URLSearchParams, 'get'>): DirectoryFilters {
  return {
    search: params.get('search') || '', country: params.get('country') || '', city: params.get('city') || '',
    level: params.get('level') || '', language: params.get('language') || '', subject: params.get('subject') || '',
    intake: params.get('intake') || '', scholarship: params.get('scholarship') === '1',
    sort: params.get('sort') === 'city' ? 'city' : 'name',
  };
}

export function writeDirectoryFilters(params: URLSearchParams, filters: DirectoryFilters): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of filterKeys) {
    next.delete(key);
    const value = filters[key];
    if (key === 'scholarship') {
      if (value) next.set(key, '1');
    } else if (value && !(key === 'sort' && value === 'name')) next.set(key, String(value));
  }
  next.delete('limit');
  return next;
}

export const availablePrograms = (university: CleanUniversityRecord) => university.programs.filter(program => program.status !== 'paused');
export const programSubject = (program: CleanUniversityRecord['programs'][number]) => program.subject || program.name;

// Legacy university-level fields are a fallback only when no program records exist.
// With program records, all selected academic filters must match one non-paused program.
export function matchingPrograms(university: CleanUniversityRecord, filters: DirectoryFilters) {
  return availablePrograms(university).filter(program => (
    (!filters.level || sameStudyLevel(program.level, filters.level))
    && (!filters.language || contains(program.languages, filters.language))
    && (!filters.subject || same(programSubject(program), filters.subject))
    && (!filters.intake || contains(program.intakes, filters.intake))
  ));
}

export function universityMatchesFilters(university: CleanUniversityRecord, filters: DirectoryFilters): boolean {
  if (!university.isActive) return false;
  if (filters.country && !same(university.country, filters.country)) return false;
  if (filters.city && !same(university.city, filters.city)) return false;
  if (filters.scholarship && !university.scholarships.some(item => item.status !== 'closed')) return false;

  const programs = availablePrograms(university);
  const haystack = [university.name, ...university.aliases, university.city, university.country,
    ...programs.flatMap(program => [program.name, program.subject || '']),
    ...(university.programs.length ? [] : university.details.majors)].join(' ').toLocaleLowerCase();
  if (filters.search.trim() && !haystack.includes(normalized(filters.search))) return false;

  if (!(filters.level || filters.language || filters.subject || filters.intake)) return true;
  if (university.programs.length) return matchingPrograms(university, filters).length > 0;
  return (!filters.level || university.degree.some(level => sameStudyLevel(level, filters.level)))
    && (!filters.language || contains(university.taught, filters.language))
    && (!filters.subject || contains(university.details.majors, filters.subject))
    && (!filters.intake || contains(university.intake, filters.intake));
}

export function filterUniversities(universities: CleanUniversityRecord[], filters: DirectoryFilters) {
  return universities.filter(university => universityMatchesFilters(university, filters))
    .sort((a, b) => filters.sort === 'city'
      ? a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name));
}

export function directoryOptions(universities: CleanUniversityRecord[], country: string) {
  const records = universities.filter(item => item.isActive && (!country || same(item.country, country)));
  const distinct = (items: string[]) => Array.from(new Set(items.map(value => value.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const programOrLegacy = (university: CleanUniversityRecord, programValues: string[], legacyValues: string[]) => university.programs.length ? programValues : legacyValues;
  return {
    countries: distinct(universities.filter(item => item.isActive).map(item => item.country)),
    cities: distinct(records.map(item => item.city)),
    levels: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).map(program => program.level), item.degree))),
    languages: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).flatMap(program => program.languages), item.taught))),
    subjects: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).map(programSubject), item.details.majors))),
    intakes: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).flatMap(program => program.intakes), item.intake))),
  };
}

export function selectedComparisonSlugs(params: Pick<URLSearchParams, 'get'>, universities: CleanUniversityRecord[]) {
  const validSlugs = new Set(universities.filter(item => item.isActive).map(item => item.slug));
  return Array.from(new Set((params.get('compare') || '').split(',').filter(slug => validSlugs.has(slug)))).slice(0, 3);
}

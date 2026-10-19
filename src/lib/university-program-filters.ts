import type { UniversityProgramDetail } from '@/types/university-profile';

export type UniversityProgramFilters = { major: string; medium: string; query: string };

const comparable = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase('en');

/** Intersect the student's choices within the currently selected study level. */
export function filterProgramRows(programs: UniversityProgramDetail[], filters: UniversityProgramFilters): UniversityProgramDetail[] {
  const major = comparable(filters.major);
  const medium = comparable(filters.medium);
  const terms = comparable(filters.query).split(/\s+/).filter(Boolean);
  return programs.filter(program => {
    if (major && comparable(program.name) !== major) return false;
    if (medium && !program.languages.some(language => comparable(language) === medium)) return false;
    const searchable = comparable(`${program.name} ${program.school || ''} ${program.languages.join(' ')}`);
    return terms.every(term => searchable.includes(term));
  });
}

export function programFilterChoices(values: string[]): string[] {
  const choices = new Map<string, string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed && !choices.has(comparable(trimmed))) choices.set(comparable(trimmed), trimmed);
  }
  return [...choices.values()].sort((a, b) => a.localeCompare(b, 'en'));
}

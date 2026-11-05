import type { CleanUniversityRecord } from './university-records';

export type DirectoryFundingRoute = {
  title: string; value: string; levels: string[]; languages?: string[]; programNames?: string[];
};
export type DirectoryUniversity = Pick<CleanUniversityRecord,
  'id' | 'slug' | 'name' | 'aliases' | 'city' | 'country' | 'isActive' | 'logo' | 'publishedRankings' | 'programs' | 'degree' | 'taught' | 'intake' | 'details' | 'scholarships'
> & {
  fundingRoutes?: DirectoryFundingRoute[];
  verification?: { status: 'verified' | 'under_verification' | 'expired'; lastVerifiedAt?: string };
  relationship?: 'Direct university partner' | 'Authorized representative' | 'Network access' | 'Public direct application';
  clearCost?: boolean;
};

export type DirectoryFilters = {
  search: string;
  country: string;
  city: string;
  level: string;
  language: string;
  subject: string;
  intake: string;
  scholarship: boolean;
  cscaFree: boolean;
  sort: 'name' | 'city' | 'fee' | 'ranking' | 'scholarship';
};

export const emptyDirectoryFilters: DirectoryFilters = {
  search: '', country: '', city: '', level: '', language: '', subject: '', intake: '', scholarship: false, cscaFree: false, sort: 'name',
};

const filterKeys = ['search', 'country', 'city', 'level', 'language', 'subject', 'intake', 'scholarship', 'cscaFree', 'sort'] as const;
const normalized = (value: string) => value.trim().toLocaleLowerCase();
const same = (a: string, b: string) => normalized(a) === normalized(b);
const contains = (values: string[], selected: string) => values.some(value => same(value, selected));
// Source catalogues use both degree names and possessive labels. A planner's
// canonical level must find the same programme under either spelling.
const studyLevel = (value: string) => {
  const label = normalized(value).replace(/[’'.-]/g, '');
  if (/phd|doctor/.test(label)) return 'phd';
  if (/bachelor|undergraduate|mbbs/.test(label)) return 'bachelor';
  if (/master|postgraduate/.test(label)) return 'master';
  if (/language|chinese studies|nondegree/.test(label)) return 'language';
  if (/foundation|preparatory|preuniversity/.test(label)) return 'foundation';
  if (/diploma|associate/.test(label)) return 'diploma';
  return label;
};
const sameStudyLevel = (a: string, b: string) => studyLevel(a) === studyLevel(b);
const searchText = (value: string) => normalized(value).replace(/master[’']?s?/g, 'master').replace(/bachelor[’']?s?/g, 'bachelor').replace(/doctoral|doctorate/g, 'phd').replace(/\bscholarships\b/g, 'scholarship');
const searchTerms = (value: string) => searchText(value).split(/\s+/).filter(Boolean);
const universitySearchText = (university: DirectoryUniversity) => searchText([
  university.name, ...university.aliases, university.city, university.country,
].join(' '));
const fundingSearchText = (university: DirectoryUniversity, program?: CleanUniversityRecord['programs'][number]) => searchText((university.fundingRoutes?.length
  ? university.fundingRoutes.filter(route => !program || fundingMatchesProgram(route, program)).flatMap(route => ['scholarship', route.title, route.value])
  : university.scholarships.filter(item => item.status !== 'closed').flatMap(item => ['scholarship', item.title, item.coverage || ''])).join(' '));

export const INTAKE_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function intakeMonths(values: string[]): string[] {
  const found = new Set<string>();
  for (const value of values) {
    // A range such as September to July describes study duration, not a July intake.
    const starts = value.replace(/(?:\b(?:to|until|through)\b|[–—])\s*(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[^;,)]+/gi, '');
    for (const match of starts.matchAll(/\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/gi)) {
      const full = INTAKE_MONTHS.find(month => month.slice(0, 3).toLowerCase() === match[1].slice(0, 3).toLowerCase());
      if (full) found.add(full);
    }
  }
  return INTAKE_MONTHS.filter(month => found.has(month));
}
const matchesIntake = (values: string[], selected: string) => {
  const months = intakeMonths([selected]);
  return months.length ? intakeMonths(values).some(month => months.includes(month)) : contains(values, selected);
};

export function readDirectoryFilters(params: Pick<URLSearchParams, 'get'>): DirectoryFilters {
  return {
    search: params.get('search') || '', country: params.get('country') || '', city: params.get('city') || '',
    level: params.get('level') || '', language: params.get('language') || '', subject: params.get('subject') || '',
    intake: intakeMonths([params.get('intake') || ''])[0] || params.get('intake') || '', scholarship: params.get('scholarship') === '1', cscaFree: params.get('cscaFree') === '1',
    sort: ['city', 'fee', 'ranking', 'scholarship'].includes(params.get('sort') || '') ? (params.get('sort') as DirectoryFilters['sort']) : 'name',
  };
}

export function writeDirectoryFilters(params: URLSearchParams, filters: DirectoryFilters): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of filterKeys) {
    next.delete(key);
    const value = filters[key];
    if (key === 'scholarship' || key === 'cscaFree') {
      if (value) next.set(key, '1');
    } else if (value && !(key === 'sort' && value === 'name')) next.set(key, String(value));  }
  next.delete('limit');
  return next;
}

export const availablePrograms = (university: DirectoryUniversity) => university.programs.filter(program => program.status !== 'paused');
export const programSubject = (program: CleanUniversityRecord['programs'][number]) => program.subject || program.name;

/** Aggregate only comparable fee amounts. Never mix currencies or billing periods. */
export function directoryTuitionSummary(values: string[]) {
  const distinct = [...new Set(values.map(value => value.trim()).filter(Boolean))];
  if (!distinct.length) return '';
  const parsed = distinct.map(value => {
    const match = value.match(/^(?:(CNY|RMB|BDT|USD|EUR|GBP)\s*)?(\d[\d,]*(?:\.\d+)?)\s*(CNY|RMB|BDT|USD|EUR|GBP)?\s*(?:\/|per)\s*(year|academic year|semester|month|program(?:me)?|one-time)$/i);
    if (!match || Boolean(match[1]) === Boolean(match[3])) return null;
    return { amount: Number(match[2].replaceAll(',', '')), currency: (match[1] || match[3]).toUpperCase().replace('RMB', 'CNY'), period: match[4].toLowerCase().replace('academic year', 'year').replace('programme', 'program') };
  });
  const first = parsed[0];
  if (distinct.length === 1 && !first) return distinct[0];
  if (!first || parsed.some(fee => !fee || fee.currency !== first.currency || fee.period !== first.period)) return 'View program fees';
  const amounts = parsed.map(fee => fee!.amount);
  const low = Math.min(...amounts), high = Math.max(...amounts);
  return `${first.currency} ${low.toLocaleString('en-US')}${low !== high ? `–${high.toLocaleString('en-US')}` : ''} / ${first.period}`;
}
export function fundingMatchesProgram(route: DirectoryFundingRoute, program: CleanUniversityRecord['programs'][number]) {
  return (!route.levels.length || route.levels.some(level => sameStudyLevel(level, program.level)))
    && (!route.languages?.length || route.languages.some(language => contains(program.languages, language)))
    && (!route.programNames?.length || route.programNames.some(name => same(name, program.name)));
}

// Only explicit, sourced whole-exam exemptions qualify. Silence and individual
// subject exemptions (for example Professional Chinese) are not exemptions.
export function programIsCscaFree(program: CleanUniversityRecord['programs'][number]) {
  if (!program.sourceUrl || !/^https?:\/\//i.test(program.sourceUrl)) return false;
  return program.eligibility.some(text => {
    const statements = text.split(/[.;\n]/).map(value => value.trim());
    return statements.some(statement => /^(?:CSCA(?: exam(?:ination)?)? (?:is )?not required|No CSCA(?: exam(?:ination)?)? (?:is )?required|Exempt from (?:the )?CSCA(?: exam(?:ination)?)?)[.!]?$/i.test(statement));
  });
}

// Legacy university-level fields are a fallback only when no program records exist.
// With program records, all selected academic filters must match one non-paused program.
export function matchingPrograms(university: DirectoryUniversity, filters: DirectoryFilters) {
  const institution = universitySearchText(university);
  const terms = searchTerms(filters.search);
  const wantsFunding = filters.scholarship || terms.includes('scholarship');
  return availablePrograms(university).filter(program => (
    (!filters.cscaFree || (university.country.toLowerCase() === 'china' && programIsCscaFree(program)))
    && (!filters.level || sameStudyLevel(program.level, filters.level))
    && (!filters.language || contains(program.languages, filters.language))
    && (!filters.subject || same(programSubject(program), filters.subject))
    && (!filters.intake || matchesIntake(program.intakes, filters.intake))
    && (!wantsFunding || !university.fundingRoutes?.length || university.fundingRoutes.some(route => fundingMatchesProgram(route, program)))
    && terms.every(term => institution.includes(term) || (searchText([program.name, program.subject || '', program.level, studyLevel(program.level), ...program.languages, ...program.intakes, program.tuition || ''].join(' ')) + ' ' + fundingSearchText(university, program)).includes(term))
  ));
}

export function universityMatchesFilters(university: DirectoryUniversity, filters: DirectoryFilters): boolean {
  if (!university.isActive) return false;
  if (filters.country && !same(university.country, filters.country)) return false;
  if (filters.city && !same(university.city, filters.city)) return false;
  if (filters.scholarship && !(university.fundingRoutes?.length || university.scholarships.some(item => item.status !== 'closed'))) return false;

  const programs = availablePrograms(university);
  const haystack = universitySearchText(university) + ' ' + fundingSearchText(university) + ' ' + searchText((university.programs.length ? [] : [...university.details.majors, ...university.degree, ...university.taught, ...university.intake]).join(' '));
  const terms = searchTerms(filters.search);
  if (university.programs.length) return matchingPrograms(university, filters).length > 0 || (!programs.length && terms.every(term => universitySearchText(university).includes(term)) && !(filters.level || filters.language || filters.subject || filters.intake || filters.cscaFree));
  if (!terms.every(term => haystack.includes(term))) return false;
  if (filters.cscaFree && (!university.programs.length || university.country.toLowerCase() !== 'china')) return false;

  if (!(filters.level || filters.language || filters.subject || filters.intake || filters.cscaFree)) return true;
  if (university.programs.length) return matchingPrograms(university, filters).length > 0;
  return (!filters.level || university.degree.some(level => sameStudyLevel(level, filters.level)))
    && (!filters.language || contains(university.taught, filters.language))
    && (!filters.subject || contains(university.details.majors, filters.subject))
    && (!filters.intake || matchesIntake(university.intake, filters.intake));
}

// Lowest verifiable annual tuition across recorded programs, grouped by
// currency. Only full-year fees count: semester/month amounts are excluded so
// sort groups stay honest. Unparseable fees sort after every currency group.
export function directoryFeeSortKey(university: DirectoryUniversity): [string, number] | undefined {
  const amounts: Array<{ currency: string; amount: number }> = [];
  for (const program of availablePrograms(university)) {
    // Trailing parentheticals such as '(Bachelor)' don't affect the fee itself.
    const tuition = (program.tuition || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
    // Ranges such as '39,800–43,300 / year' sort by their lower bound.
    const match = tuition.match(/^(?:(CNY|RMB|BDT|USD|EUR|GBP)\s*)?(\d[\d,]*(?:\.\d+)?)(?:\s*[–—-]\s*(?:CNY|RMB|BDT|USD|EUR|GBP)?\s*[\d,]+(?:\.\d+)?)?\s*(CNY|RMB|BDT|USD|EUR|GBP)?\s*(?:\/|per)\s*year$/i);
    const currency = (match?.[1] || match?.[3] || '').toUpperCase().replace('RMB', 'CNY');
    if (match && Boolean(match[1]) !== Boolean(match[3]) && currency) {
      amounts.push({ currency, amount: Number(match[2].replaceAll(',', '')) });
    }
  }
  if (!amounts.length) return undefined;
  const currency = amounts.map(fee => fee.currency).sort((a, b) => a.localeCompare(b))[0];
  return [currency, Math.min(...amounts.filter(fee => fee.currency === currency).map(fee => fee.amount))];
}

// Best published ranking position: world first, then national, then any listed
// subject record. Ranges such as '251-300' or '=142' use their first number;
// universities without a ranking sort after every ranked record (999_999).
export function directoryRankingSortKey(university: DirectoryUniversity): number {
  const ranks = university.publishedRankings || [];
  const ranked = ranks.find(rank => rank.scope === 'world') || ranks.find(rank => rank.scope === 'national') || ranks[0];
  const parsed = ranked?.rank?.match(/=?(\d+)/);
  return parsed ? Number(parsed[1]) : 999999;
}

// Strings such as 'September 2026' are normalized to the month itself so the
// directory stays evergreen: intake facts repeat usefully every year.
export function evergreenIntakes(values: string[]): string[] {
  const parsed = intakeMonths(values);
  if (parsed.length) return parsed;
  // Unknown formats keep their wording with year digits stripped so the list
  // stays evergreen without inventing facts.
  return values.map((value) => value.replace(/\b\d{4}\b/g, '').trim()).filter(Boolean);
}

// Universities with live funding options lead; unlisted records keep their
// alphabetical position so the sort never invents a ranking.
export function directoryScholarshipSortKey(university: DirectoryUniversity): number {
  return university.fundingRoutes?.length || university.scholarships.some(item => item.status !== 'closed') ? 0 : 1;
}

export function filterUniversities(universities: DirectoryUniversity[], filters: DirectoryFilters) {
  const byName = (a: DirectoryUniversity, b: DirectoryUniversity) => a.name.localeCompare(b.name);
  const matching = universities.filter(university => universityMatchesFilters(university, filters));
  if (filters.sort === 'city') {
    return matching.sort((a, b) => a.city.localeCompare(b.city) || byName(a, b));
  }
  if (filters.sort === 'fee') {
    // Currency groups sort before unparseable records; inside a group by the
    // lowest annually countable fee so no mixed-currency comparison occurs.
    return matching.sort((a, b) => {
      const keyA = directoryFeeSortKey(a), keyB = directoryFeeSortKey(b);
      const groupA = keyA ? 'a' + keyA[0] + String(keyA[1]).padStart(10, '0') : 'z';
      const groupB = keyB ? 'a' + keyB[0] + String(keyB[1]).padStart(10, '0') : 'z';
      return groupA < groupB ? -1 : groupA > groupB ? 1 : byName(a, b);
    });
  }
  if (filters.sort === 'scholarship') {
    return matching.sort((a, b) => directoryScholarshipSortKey(a) - directoryScholarshipSortKey(b) || directoryRankingSortKey(a) - directoryRankingSortKey(b) || byName(a, b));
  }
  if (filters.sort === 'ranking') {
    return matching.sort((a, b) => directoryRankingSortKey(a) - directoryRankingSortKey(b) || byName(a, b));
  }
  return matching.sort(byName);
}

export function directoryOptions(universities: DirectoryUniversity[], country: string) {
  const records = universities.filter(item => item.isActive && (!country || same(item.country, country)));
  const distinct = (items: string[]) => Array.from(new Set(items.map(value => value.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const programOrLegacy = (university: DirectoryUniversity, programValues: string[], legacyValues: string[]) => university.programs.length ? programValues : legacyValues;
  return {
    countries: distinct(universities.filter(item => item.isActive).map(item => item.country)),
    cities: distinct(records.map(item => item.city)),
    levels: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).map(program => program.level), item.degree))),
    languages: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).flatMap(program => program.languages), item.taught))),
    subjects: distinct(records.flatMap(item => programOrLegacy(item, availablePrograms(item).map(programSubject), item.details.majors))),
    intakes: INTAKE_MONTHS.filter(month => ['January', 'February', 'March', 'April', 'May', 'September'].includes(month) || intakeMonths(records.flatMap(item => programOrLegacy(item, availablePrograms(item).flatMap(program => program.intakes), item.intake))).includes(month)),
  };
}

export function selectedComparisonSlugs(params: Pick<URLSearchParams, 'get'>, universities: CleanUniversityRecord[]) {
  const validSlugs = new Set(universities.filter(item => item.isActive).map(item => item.slug));
  return Array.from(new Set((params.get('compare') || '').split(',').filter(slug => validSlugs.has(slug)))).slice(0, 3);
}

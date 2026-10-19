import type { CleanUniversityRecord } from './university-records';

/** A city gets its own indexable page only with enough universities to compare. */
export const MIN_CITY_UNIVERSITIES = 3;

export const citySlug = (city: string) => city.normalize('NFKD').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function chinaCities(universities: CleanUniversityRecord[]) {
  const byCity = new Map<string, CleanUniversityRecord[]>();
  for (const university of universities) {
    if (!university.isActive || university.country.toLowerCase() !== 'china' || !university.city.trim()) continue;
    const list = byCity.get(university.city.trim()) || [];
    list.push(university);
    byCity.set(university.city.trim(), list);
  }
  return [...byCity.entries()]
    .filter(([, list]) => list.length >= MIN_CITY_UNIVERSITIES)
    .map(([city, list]) => ({ city, slug: citySlug(city), universities: list.sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => b.universities.length - a.universities.length || a.city.localeCompare(b.city));
}

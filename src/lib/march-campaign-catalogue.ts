import type landing from '../../data/research/china-march-2027-landing.json';
export type MarchCatalogueProgramme = typeof landing.universities[number]['programmes'][number];
type InternalUniversity = typeof landing.universities[number];
export type MarchCatalogueUniversity = Omit<InternalUniversity, 'ranking'> & { ranking: Omit<NonNullable<InternalUniversity['ranking']>, 'year' | 'sourceUrl'> | null };
export function publicMarchCatalogue(universities: InternalUniversity[]): MarchCatalogueUniversity[] {
  return universities.map(({ ranking, ...university }) => ({ ...university, ranking: ranking ? { value: ranking.value, scope: ranking.scope, publisher: ranking.publisher, rankingName: ranking.rankingName } : null }));
}
export function filterMarchCatalogue(universities: MarchCatalogueUniversity[], query: string, route: string) {
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return universities.flatMap(university => {
    const identity=[university.name,university.acronym,university.city].join(' ').toLowerCase();
    const programmes=university.programmes.filter(programme => (route==='all'||programme.route===route) && words.every(word => (identity+' '+[programme.name,programme.route,programme.teachingLanguage,programme.awardTitle,...programme.majors].join(' ').toLowerCase()).includes(word)));
    return programmes.length ? [{...university,programmes}] : [];
  });
}

export type MarchCatalogueSort = 'recommended' | 'world-ranking' | 'china-ranking' | 'fees-low' | 'fees-high' | 'name';
export function sortMarchCatalogue(universities: MarchCatalogueUniversity[], order: MarchCatalogueSort) {
  if (order === 'recommended') return universities;
  const fee = (university: MarchCatalogueUniversity) => Math.min(...university.programmes.map(programme => Number(programme.tuition.match(/\d[\d,]*(?:\.\d+)?/)?.[0].replaceAll(',', '') ?? Infinity)));
  const ranking = (university: MarchCatalogueUniversity, scope: string) => university.ranking?.scope === scope ? Number(university.ranking.value.match(/\d+/)?.[0] ?? Infinity) : Infinity;
  return [...universities].sort((a, b) => {
    if (order === 'name') return a.name.localeCompare(b.name);
    if (order === 'fees-low') return fee(a) - fee(b);
    if (order === 'fees-high') return fee(b) - fee(a);
    const scope = order === 'world-ranking' ? 'World' : 'China';
    const left = ranking(a, scope), right = ranking(b, scope);
    return left === right ? 0 : left < right ? -1 : 1;
  });
}

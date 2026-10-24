'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, MapPin, Trophy, Search, SlidersHorizontal, X } from 'lucide-react';
import { evergreenText } from '@/lib/university-profile-public';
import { activeCountries } from '@/lib/countries';
import { destinationPath } from '@/lib/site-urls';
import { trackConversion } from '@/lib/conversion-events';
import { availablePrograms, directoryOptions, directoryTuitionSummary, emptyDirectoryFilters, filterUniversities, fundingMatchesProgram, matchingPrograms, readDirectoryFilters, writeDirectoryFilters, type DirectoryFilters, type DirectoryUniversity } from '@/lib/university-directory';

type Props = { initialUniversities: DirectoryUniversity[] };
const fieldClass = 'mt-1.5 h-11 w-full rounded-lg border border-[#cfdbe3] bg-white px-3 text-sm text-[#102b40] outline-none transition focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/15';
const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));
const levelLabel = (level: string) => /phd|doctor/i.test(level) ? 'PhD' : /master|postgraduate/i.test(level) ? 'Master’s' : /bachelor|undergraduate|mbbs/i.test(level) ? 'Bachelor’s' : /language|chinese studies|non.?degree/i.test(level) ? 'Language' : level;
const levelOrder = ['Bachelor’s', 'Master’s', 'PhD', 'Language', 'Foundation', 'Diploma'];

function SelectFilter({ label, value, values, onChange, emptyLabel, name }: { label: string; value: string; values: string[]; onChange: (value: string) => void; emptyLabel: string; name: string }) {
  const selectedValue = values.find(item => item.toLowerCase() === value.toLowerCase()) || value;
  const id = 'university-filter-' + name;
  return <div className="min-w-0"><label htmlFor={id} className="block text-xs font-semibold text-slate-600">{label}</label><select id={id} name={name} value={selectedValue} onChange={event => onChange(event.target.value)} className={fieldClass}><option value="">{emptyLabel}</option>{selectedValue && !values.includes(selectedValue) && <option value={selectedValue}>{selectedValue}</option>}{values.map(item => <option key={item} value={item}>{item}</option>)}</select></div>;
}

function UniversityLogo({ university }: { university: DirectoryUniversity }) {
  const [failed, setFailed] = useState(false);
  const initials = university.aliases.find(alias => /^[A-Z]{2,7}$/.test(alias)) || university.name.split(/\s+/).filter(word => !/^(of|and|the|in)$/i.test(word)).map(word => word[0]).join('').slice(0, 6);
  return <div className={'grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-200 p-2 ' + (['hsu', 'njit', 'jit', 'ctgu'].includes(university.slug) && !failed ? 'bg-[#174f7a]' : 'bg-white')}>
    {university.logo && !failed ? <Image src={university.logo} alt={university.name + ' logo'} width={54} height={54} unoptimized onError={() => setFailed(true)} className="h-full w-full object-contain" /> : <span role="img" aria-label={university.name + ' initials'} className="text-center text-base font-bold text-[#174f7a]">{initials}</span>}
  </div>;
}

function legacyScholarshipValue(award: DirectoryUniversity['scholarships'][number]) {
  const coverage = evergreenText(award.coverage || '');
  if (/tuition(?: fee)?\s*:\s*100%\s*(?:free|waived)/i.test(award.details.join('; '))) return '100% tuition waiver';
  const percent = coverage.match(/\b(?:100|[1-9]?\d)%\s*(?:tuition(?: fee)?(?: waiver| reduction)?)/i);
  if (percent) return percent[0];
  if (/full(?:y)?[ -]?(?:funded|tuition)|tuition[^.;]*accommodation/i.test(coverage)) return /accommodation/i.test(coverage) ? 'Tuition & accommodation' : 'Full tuition coverage';
  const amount = evergreenText(award.amount || '').trim();
  if (amount && amount.length < 75 && !/^100%\s*free$/i.test(amount)) return amount;
  return coverage.match(/(?:CNY|RMB|BDT|USD|EUR|GBP)\s*[\d,]+(?:\s*[–-]\s*[\d,]+)?(?:\s*\/\s*(?:year|month|semester))?/i)?.[0] || '';
}

function UniversityCard({ university, filters }: { university: DirectoryUniversity; filters: DirectoryFilters }) {
  const matching = matchingPrograms(university, filters);
  const all = availablePrograms(university);
  const narrowed = Boolean(filters.level || filters.subject || filters.language || filters.intake || filters.cscaFree);
  const preferred = narrowed ? matching : matching.filter(program => /bachelor|undergraduate/i.test(program.level));
  const programs = preferred.length ? preferred : matching;
  const levels = unique((all.length ? all.map(program => program.level) : university.degree).map(levelLabel)).sort((a, b) => (levelOrder.indexOf(a) < 0 ? 99 : levelOrder.indexOf(a)) - (levelOrder.indexOf(b) < 0 ? 99 : levelOrder.indexOf(b)));
  const teaching = unique((programs.length ? programs.flatMap(program => program.languages) : university.taught));
  const ranks = university.publishedRankings || [];
  const ranking = ranks.find(rank => rank.scope === 'world') || ranks.find(rank => rank.scope === 'national') || ranks[0];
  const routes = university.fundingRoutes?.filter(route => programs.some(program => fundingMatchesProgram(route, program))) || [];
  const route = routes.find(item => /100%|full tuition|tuition & accommodation/i.test(item.value)) || routes.find(item => item.value) || routes[0];
  const legacyAwards = university.scholarships.filter(award => award.status !== 'closed');
  const legacyAward = !university.fundingRoutes?.length ? legacyAwards.find(award => /100%|full tuition|fully funded/i.test(award.coverage || '')) || legacyAwards.find(award => legacyScholarshipValue(award)) : undefined;
  const awardValue = route?.value || (legacyAward ? legacyScholarshipValue(legacyAward) : '');
  const awardTitle = route?.title || (legacyAward ? evergreenText(legacyAward.title) : '');
  const tuition = directoryTuitionSummary(programs.map(program => evergreenText(program.tuition || ''))) || evergreenText(university.details.tuition || '');
  const showTuition = tuition && !/not recorded|contact|request|not specified|not confirmed|unknown/i.test(tuition);
  const firstLevel = programs[0] ? levelLabel(programs[0].level) : '';
  const majors = unique(programs.map(program => program.name)).slice(0, 2);
  const selectedProgram = matching.length === 1 ? levelLabel(matching[0].level) + ' · ' + matching[0].name : '';
  const programHref = '/universities/' + university.slug + '#programs';
  const applyHref = '/apply?' + new URLSearchParams({ university: university.name, country: university.country, intake: filters.intake ? filters.intake + ' 2027' : '2027 planning', ...(selectedProgram ? { program: selectedProgram } : {}) }).toString();
  const recordClick = (action: 'university_programs_click' | 'university_apply_click') => trackConversion(action, { university_slug: university.slug, destination: university.country, label: 'university_directory', page_location: window.location.origin + window.location.pathname });

  return <article aria-label={university.name} className="group flex min-w-0 flex-col rounded-xl border border-[#d8e2e8] bg-white transition-colors hover:border-[#9bb3c4] focus-within:border-[#174f7a]">
    <div className="flex items-start gap-3 p-5 pb-4"><UniversityLogo university={university} /><div className="min-w-0"><h2 className="font-heading text-[17px] font-bold leading-6 text-[#082d45]"><Link href={programHref} onClick={() => recordClick('university_programs_click')} className="underline-offset-4 hover:underline">{university.name}</Link></h2><p className="mt-2 flex items-start gap-1 text-xs leading-5 text-slate-500"><MapPin size={13} className="mt-0.5 shrink-0" />{[university.city, university.country].filter(Boolean).join(', ')}</p></div></div>
    <div className="flex flex-1 flex-col px-5 pb-5">
      <div className={'grid gap-4 border-y border-slate-100 py-3.5 ' + (ranking ? 'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]' : '')}>
        <div><p className="text-[11px] text-slate-500">{firstLevel ? firstLevel + ' tuition' : 'Tuition'}</p><p className="mt-1 line-clamp-2 text-sm font-bold leading-6 tabular-nums text-[#082d45]">{showTuition ? tuition : 'View program fees'}</p></div>
        {ranking && <div className="border-l border-slate-100 pl-3"><p className="flex items-center gap-1 text-[11px] text-slate-500"><Trophy size={12} className="text-[#b57b20]" />{ranking.scope === 'world' ? 'World ranking' : ranking.scope === 'national' ? 'National ranking' : 'Subject ranking'}</p><p className="mt-1 text-lg font-bold leading-6 tabular-nums text-[#082d45]">#{ranking.rank}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{ranking.publisher}{ranking.scope === 'subject' && ranking.subject ? ' · ' + ranking.subject : ''}</p></div>}
      </div>
      {awardTitle && <div className="mt-3.5 rounded-lg border border-[#d9e9df] bg-[#edf7f1] px-3 py-3"><div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1"><p className="text-[11px] font-medium text-[#17624f]">Scholarship</p>{awardValue && <p className="text-sm font-bold leading-5 text-[#17624f]">{awardValue}</p>}</div><p className="mt-1 line-clamp-1 text-[11px] leading-5 text-[#43685a]">{awardTitle}</p></div>}
      <div className="mt-4"><p className="sr-only">Available programs</p><div className="flex flex-wrap gap-1.5">{levels.map(level => <span key={level} className={'rounded-md px-2 py-1 text-[11px] font-semibold ' + (filters.level && levelLabel(filters.level) === level ? 'bg-[#174f7a] text-white' : 'bg-[#edf2f6] text-[#365168]')}>{level}</span>)}</div>{teaching.length > 0 && <p className="mt-2 text-xs leading-5 text-slate-500">{teaching.slice(0, 3).join(' / ')}</p>}{majors.length > 0 && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{majors.join(' · ')}</p>}</div>
      <div className="mt-auto grid grid-cols-[1.35fr_1fr] gap-2.5 pt-5"><Link href={programHref} onClick={() => recordClick('university_programs_click')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#174f7a] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#103d60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174f7a]" aria-label={'View programs at ' + university.name}>View programs<ArrowRight size={15} /></Link><Link href={applyHref} onClick={() => recordClick('university_apply_click')} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#efa93d] px-3 text-sm font-bold text-[#08263c] transition-colors hover:bg-[#e39a2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174f7a]" aria-label={'Apply to ' + university.name + ' with EduExpress International'}>Apply</Link></div>
    </div>
  </article>;
}

export default function UniversitiesClient({ initialUniversities }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [advancedPreference, setAdvancedPreference] = useState<boolean | null>(null);
  const urlQuery = searchParams.toString();
  const params = useMemo(() => new URLSearchParams(urlQuery), [urlQuery]);
  const filters = useMemo(() => readDirectoryFilters(params), [params]);
  const options = useMemo(() => directoryOptions(initialUniversities, filters.country), [initialUniversities, filters.country]);
  const destination = activeCountries.find(country => country.name.toLowerCase() === filters.country.toLowerCase());
  const destinationNotListed = Boolean(destination && !options.countries.some(country => country.toLowerCase() === filters.country.toLowerCase()));
  const filtered = useMemo(() => filterUniversities(initialUniversities, filters), [initialUniversities, filters]);
  const limitValue = params.get('limit') || '12';
  const visible = /^\d+$/.test(limitValue) ? Math.max(12, Math.min(Number(limitValue), initialUniversities.length || 12)) : 12;
  const updateUrl = (next: URLSearchParams, replace = false) => {
    const query = next.toString();
    const url = pathname + (query ? '?' + query : '') + window.location.hash;
    if (replace) window.history.replaceState(null, '', url); else window.history.pushState(null, '', url);
  };
  const setFilters = (patch: Partial<DirectoryFilters>, replace = false) => updateUrl(writeDirectoryFilters(new URLSearchParams(window.location.search), { ...readDirectoryFilters(new URLSearchParams(window.location.search)), ...patch }), replace);
  const clearFilters = () => { setAdvancedPreference(null); setFilters(emptyDirectoryFilters); };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); document.getElementById('university-results')?.scrollIntoView({ block: 'start', behavior: 'auto' }); };
  const advancedCount = [filters.city, filters.subject, filters.intake, filters.scholarship, filters.cscaFree].filter(Boolean).length;
  const advancedOpen = advancedPreference ?? Boolean(advancedCount);
  const chips: { label: string; key: keyof DirectoryFilters }[] = [
    ...(filters.search ? [{ label: 'Search: ' + filters.search, key: 'search' as const }] : []),
    ...(['country', 'city', 'level', 'subject', 'language', 'intake'] as const).filter(key => filters[key]).map(key => ({ label: ({ country: 'Destination', city: 'City', level: 'Degree', subject: 'Subject', language: 'Language', intake: 'Intake' })[key] + ': ' + filters[key], key })),
    ...(filters.scholarship ? [{ label: 'Scholarship options', key: 'scholarship' as const }] : []),
    ...(filters.cscaFree ? [{ label: 'CSCA exam not required', key: 'cscaFree' as const }] : []),
  ];
  const removeFilter = (key: keyof DirectoryFilters) => setFilters(key === 'country' ? { country: '', city: '' } : { [key]: key === 'scholarship' || key === 'cscaFree' ? false : '' });

  return <section className="min-h-[60vh] bg-[#f4f6f7] px-5 pb-12 sm:px-8 lg:px-10" aria-label="University finder">
    <div className="mx-auto max-w-[1280px]">
      <form role="search" aria-label="Find universities and programs" action="/universities" method="get" onSubmit={submitSearch} className="relative -mt-0 rounded-b-xl border border-t-0 border-[#d8e2e8] bg-white p-4 sm:p-5">
        <label className="sr-only" htmlFor="university-search">Search universities or programs</label>
        <div className="flex gap-2"><div className="relative min-w-0 flex-1"><Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="university-search" name="search" type="search" value={filters.search} onChange={event => setFilters({ search: event.target.value }, true)} placeholder="University or subject" autoComplete="off" className="h-12 w-full rounded-lg border border-[#cfdbe3] bg-[#f7f9fa] pl-11 pr-3 text-sm text-[#102b40] outline-none transition focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/15" /></div><button type="submit" className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-[#174f7a] px-4 text-sm font-semibold text-white hover:bg-[#103d60] sm:px-7">Search</button></div>
        <div className="mt-4 grid grid-cols-2 items-end gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <SelectFilter name="country" label="Destination" emptyLabel="All destinations" value={filters.country} values={unique([...options.countries, ...activeCountries.map(country => country.name)])} onChange={value => setFilters({ country: value, city: '', subject: '', cscaFree: false })} />
          <SelectFilter name="level" label="Degree / program" emptyLabel="All study levels" value={filters.level} values={unique(options.levels.map(levelLabel)).sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b))} onChange={value => setFilters({ level: value })} />
          <SelectFilter name="language" label="Teaching language" emptyLabel="Any language" value={filters.language} values={options.languages} onChange={value => setFilters({ language: value })} />
          <button type="button" aria-expanded={advancedOpen} aria-controls="advanced-university-filters" onClick={() => setAdvancedPreference(!advancedOpen)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cfdbe3] px-3 text-xs font-semibold text-[#174f7a]"><SlidersHorizontal size={15} />More filters{advancedCount ? <span className="grid size-5 place-items-center rounded-full bg-[#174f7a] text-[10px] text-white">{advancedCount}</span> : <ChevronDown size={14} className={advancedOpen ? 'rotate-180' : ''} />}</button>
        </div>
        <div id="advanced-university-filters" hidden={!advancedOpen} className="mt-4 border-t border-slate-100 pt-4">
          <div className="grid gap-3 sm:grid-cols-3"><SelectFilter name="subject" label="Subject / program" value={filters.subject} values={options.subjects} onChange={value => setFilters({ subject: value })} emptyLabel="All subjects" /><SelectFilter name="city" label="City" value={filters.city} values={options.cities} onChange={value => setFilters({ city: value })} emptyLabel="All cities" /><SelectFilter name="intake" label="Intake month" value={filters.intake} values={options.intakes} onChange={value => setFilters({ intake: value })} emptyLabel="Any listed intake" /></div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1"><label className="flex min-h-11 items-center gap-2 text-sm text-[#102b40]"><input name="scholarship" value="1" type="checkbox" checked={filters.scholarship} onChange={event => setFilters({ scholarship: event.target.checked })} className="size-4 accent-[#174f7a]" />Scholarship options</label><label className="flex min-h-11 items-center gap-2 text-sm text-[#102b40]"><input name="cscaFree" value="1" type="checkbox" checked={filters.cscaFree} onChange={event => setFilters({ cscaFree: event.target.checked })} className="size-4 accent-[#174f7a]" />CSCA exam not required</label></div>
        </div>
        {chips.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4" aria-label="Active filters">{chips.map(chip => <button key={chip.key} type="button" onClick={() => removeFilter(chip.key)} className="inline-flex min-h-8 max-w-full items-center gap-2 rounded-md bg-[#edf3f7] px-2.5 text-xs text-[#174f7a]" aria-label={'Remove filter ' + chip.label}><span className="truncate">{chip.label}</span><X size={12} className="shrink-0" /></button>)}<button type="button" onClick={clearFilters} className="min-h-8 px-1 text-xs font-semibold text-[#174f7a] underline underline-offset-4">Clear all</button></div>}
      </form>
      <div id="university-results" className="flex scroll-mt-32 flex-wrap items-center justify-between gap-3 pb-4 pt-5 xl:scroll-mt-40"><p role="status" aria-live="polite" className="text-sm text-slate-500"><strong className="font-bold text-[#102b40]">{filtered.length} {filtered.length === 1 ? 'university' : 'universities'}</strong>{filters.country ? ' in ' + filters.country : ''}{filtered.length > visible ? ' · Showing ' + visible : ''}</p><div className="flex items-center gap-2 text-xs text-slate-500"><label htmlFor="university-sort">Sort by</label><select id="university-sort" value={filters.sort} onChange={event => setFilters({ sort: event.target.value === 'city' ? 'city' : 'name' })} className="h-9 rounded-lg border border-[#d8e2e8] bg-white px-2.5 text-xs font-medium text-[#102b40]"><option value="name">Name</option><option value="city">City</option></select></div></div>
      {filtered.length ? <><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, visible).map(university => <UniversityCard key={university.id} university={university} filters={filters} />)}</div>{visible < filtered.length && <div className="mt-7 flex flex-col items-center gap-3"><p className="text-xs text-slate-500">Showing {Math.min(visible, filtered.length)} of {filtered.length} universities</p><button type="button" onClick={() => { const next = new URLSearchParams(window.location.search); next.set('limit', String(visible + 12)); updateUrl(next); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#174f7a] bg-white px-6 text-sm font-semibold text-[#174f7a] hover:bg-[#edf3f7]">View {Math.min(12, filtered.length - visible)} more universities<ArrowRight size={15} /></button></div>}</> : <div className="rounded-xl border border-[#d8e2e8] bg-white px-5 py-10 text-center sm:py-14"><Search size={28} className="mx-auto text-[#174f7a]" /><h2 className="mt-4 text-xl font-bold text-[#102b40]">{destinationNotListed ? 'Find your university in ' + filters.country : 'No matches for this search'}</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">{destinationNotListed ? 'Explore the destination guide or tell us your subject to get help choosing a university.' : filters.cscaFree ? 'Try removing the CSCA filter or changing your degree and language choices.' : 'Try a university name, a broader subject or fewer filters.'}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={clearFilters} className="min-h-11 rounded-lg bg-[#174f7a] px-5 text-sm font-semibold text-white">Reset search</button>{destinationNotListed && destination && <Link href={destinationPath(destination.slug)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#174f7a] px-5 text-sm font-semibold text-[#174f7a]">View destination guide</Link>}<Link href="/education-fit-assessment" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#cfdbe3] px-5 text-sm font-semibold text-[#174f7a]">Help me choose</Link></div></div>}
    </div>
  </section>;
}

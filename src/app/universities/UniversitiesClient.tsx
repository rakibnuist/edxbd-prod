'use client';

import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, FileText, Gift, MapPin, Plus, Search, SlidersHorizontal, Trophy, X } from 'lucide-react';
import { evergreenText } from '@/lib/university-profile-public';
import { activeCountries } from '@/lib/countries';
import { trackConversion } from '@/lib/conversion-events';
import {
  availablePrograms,
  directoryOptions,
  directoryTuitionSummary,
  emptyDirectoryFilters,
  evergreenIntakes,
  filterUniversities,
  fundingMatchesProgram,
  matchingPrograms,
  readDirectoryFilters,
  writeDirectoryFilters,
  type DirectoryFilters,
  type DirectoryUniversity,
} from '@/lib/university-directory';

type Props = { initialUniversities: DirectoryUniversity[] };

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));
const levelLabel = (level: string) =>
  /phd|doctor/i.test(level)
    ? 'PhD'
    : /master|postgraduate/i.test(level)
      ? 'Master’s'
      : /bachelor|undergraduate|mbbs/i.test(level)
        ? 'Bachelor’s'
        : /language|chinese studies|non.?degree/i.test(level)
          ? 'Language'
          : level;
const levelOrder = ['Bachelor’s', 'Master’s', 'PhD', 'Language', 'Foundation', 'Diploma'];

function UniversityMark({ university, size = 44 }: { university: DirectoryUniversity; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initials =
    university.aliases.find(alias => /^[A-Z]{2,7}$/.test(alias)) ||
    university.name
      .split(/\s+/)
      .filter(word => !/^(of|and|the|in)$/i.test(word))
      .map(word => word[0])
      .join('')
      .slice(0, 5);
  return (
    <span className="grid shrink-0 place-items-center overflow-hidden rounded-xl border border-rule bg-white p-1" style={{ width: size, height: size }}>
      {university.logo && !failed ? (
        <Image
          src={university.logo}
          alt={`${university.name} logo`}
          width={size - 8}
          height={size - 8}
          unoptimized
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-center text-[13px] font-semibold leading-tight text-petrol-600">{initials}</span>
      )}
    </span>
  );
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

type Row = {
  university: DirectoryUniversity;
  tuition: string;
  showTuition: boolean;
  intake: string[];
  ranking?: { publisher: string; rank: string; scope: string };
  awardValue: string;
  levels: string[];
  englishTaught: boolean;
  relationship?: string;
};

function buildRow(university: DirectoryUniversity, filters: DirectoryFilters): Row {
  const matching = matchingPrograms(university, filters);
  const all = availablePrograms(university);
  const narrowed = Boolean(filters.level || filters.subject || filters.language || filters.intake || filters.cscaFree);
  const preferred = narrowed ? matching : matching.filter(program => /bachelor|undergraduate/i.test(program.level));
  const programs = preferred.length ? preferred : matching;
  const levels = unique((all.length ? all.map(program => program.level) : university.degree).map(levelLabel)).sort(
    (a, b) => (levelOrder.indexOf(a) < 0 ? 99 : levelOrder.indexOf(a)) - (levelOrder.indexOf(b) < 0 ? 99 : levelOrder.indexOf(b)),
  );
  const teaching = unique(programs.length ? programs.flatMap(program => program.languages) : university.taught);
  const ranks = university.publishedRankings || [];
  const ranking = ranks.find(rank => rank.scope === 'world') || ranks.find(rank => rank.scope === 'national') || ranks[0];
  const routes = university.fundingRoutes?.filter(route => programs.some(program => fundingMatchesProgram(route, program))) || [];
  const route = routes.find(item => /100%|full tuition|tuition & accommodation/i.test(item.value)) || routes.find(item => item.value) || routes[0];
  const legacyAwards = university.scholarships.filter(award => award.status !== 'closed');
  const legacyAward = !university.fundingRoutes?.length
    ? legacyAwards.find(award => /100%|full tuition|fully funded/i.test(award.coverage || '')) || legacyAwards.find(award => legacyScholarshipValue(award))
    : undefined;
  const programIntakeValues = programs.flatMap(program => program.intakes || []).filter(Boolean);
  const tuition = directoryTuitionSummary(programs.map(program => evergreenText(program.tuition || ''))) || evergreenText(university.details.tuition || '');

  return {
    university,
    tuition,
    showTuition: Boolean(tuition) && !/not recorded|contact|request|not specified|not confirmed|unknown/i.test(tuition),
    // Program rows are the specific source; the legacy university-level text can
    // hold deadline notes ("July 2026 or December 2026 (application deadlines
    // passed)") that would otherwise surface as July/December intakes.
    intake: evergreenIntakes(programIntakeValues.length ? programIntakeValues : university.intake),
    ranking,
    awardValue: route?.value || (legacyAward ? legacyScholarshipValue(legacyAward) : ''),
    levels,
    englishTaught: teaching.some(language => /english/i.test(language)),
    relationship: university.relationship,
  };
}

function CompareDialog({ rows, onClose, onRemove }: { rows: Row[]; onClose: () => void; onRemove: (slug: string) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const fields: { label: string; render: (row: Row) => React.ReactNode }[] = [
    { label: 'Destination', render: row => [row.university.city, row.university.country].filter(Boolean).join(', ') },
    { label: 'Tuition (as recorded)', render: row => (row.showTuition ? row.tuition : 'Not published') },
    { label: 'Intakes', render: row => (row.intake.length ? row.intake.join(', ') : 'Not listed') },
    { label: 'Study levels', render: row => row.levels.join(', ') || '—' },
    { label: 'Languages', render: row => (row.englishTaught ? 'English-taught route' : 'Check programme record') },
    { label: 'Ranking', render: row => (row.ranking ? `#${row.ranking.rank} · ${row.ranking.publisher}` : 'Not recorded') },
    { label: 'Scholarship on file', render: row => row.awardValue || 'None published' },
    { label: 'EduExpress relationship', render: row => row.relationship || 'No recorded agreement' },
    {
      label: 'Full cost sheet',
      render: row =>
        row.university.clearCost ? (
          <Link href={`/universities/${row.university.slug}/clear-cost`} className="font-semibold text-petrol-600 underline underline-offset-4">
            Open ClearCost
          </Link>
        ) : (
          <span className="text-ink-mute">On profile</span>
        ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button type="button" aria-label="Close comparison" onClick={onClose} className="absolute inset-0 cursor-default bg-petrol-900/60" />
      <div role="dialog" aria-modal="true" aria-label="Compare universities" className="relative max-h-[92dvh] w-full max-w-[1100px] overflow-y-auto rounded-t-3xl bg-white shadow-deep sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-canvas-soft bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[14px] font-semibold text-ink-soft">Side by side</p>
            <h2 className="mt-1 font-display text-[24px] font-black leading-tight text-petrol-800">{rows.length} universities compared</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full bg-canvas-soft text-petrol-800 hover:bg-lime-pale" aria-label="Close comparison">
            <X size={17} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <caption className="sr-only">Comparison of selected universities by record fields</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 w-[150px] border-b border-rule bg-canvas-soft px-4 py-3 text-[14px] font-semibold text-ink-soft">
                  Field
                </th>
                {rows.map(row => (
                  <th key={row.university.id} scope="col" className="border-b border-l border-rule px-4 py-3 align-top">
                    <span className="flex items-start gap-2">
                      <UniversityMark university={row.university} size={34} />
                      <span className="min-w-0">
                        <Link href={`/universities/${row.university.slug}`} className="block text-[16px] font-semibold leading-tight text-petrol-800 hover:underline">
                          {row.university.name}
                        </Link>
                        <button type="button" onClick={() => onRemove(row.university.slug)} className="mt-1 text-[14px] text-ink-soft underline underline-offset-2 hover:text-clay">
                          Remove
                        </button>
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map(field => (
                <tr key={field.label} className="border-b border-rule">
                  <th scope="row" className="sticky left-0 bg-white px-4 py-3 align-top text-[14px] font-semibold text-ink-soft">
                    {field.label}
                  </th>
                  {rows.map(row => (
                    <td key={row.university.id} className="border-l border-rule px-4 py-3 align-top text-petrol-800">
                      {field.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-canvas-soft bg-canvas-soft px-5 py-4 sm:px-6">
          <p className="text-[14px] leading-5 text-ink-soft">Figures come from each university record. Where a figure is under verification, the profile says so.</p>
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-11 text-[15px]">
            Ask a counsellor to review these <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesClient({ initialUniversities }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const urlQuery = searchParams.toString();
  const params = useMemo(() => new URLSearchParams(urlQuery), [urlQuery]);
  const filters = useMemo(() => readDirectoryFilters(params), [params]);
  const options = useMemo(() => directoryOptions(initialUniversities, filters.country), [initialUniversities, filters.country]);
  const destination = activeCountries.find(country => country.name.toLowerCase() === filters.country.toLowerCase());
  const destinationNotListed = Boolean(destination && !options.countries.some(country => country.toLowerCase() === filters.country.toLowerCase()));
  const filtered = useMemo(() => filterUniversities(initialUniversities, filters), [initialUniversities, filters]);

  const limitValue = params.get('limit') || '12';
  const visibleCount = /^\d+$/.test(limitValue) ? Math.max(12, Math.min(Number(limitValue), initialUniversities.length || 12)) : 12;
  const moreParams = new URLSearchParams(urlQuery);
  moreParams.set('limit', String(visibleCount + 12));
  const moreHref = `/universities${moreParams.toString() ? `?${moreParams.toString()}` : ''}`;

  const updateUrl = (next: URLSearchParams, replace = false) => {
    const query = next.toString();
    const url = pathname + (query ? `?${query}` : '') + window.location.hash;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };
  const setFilters = (patch: Partial<DirectoryFilters>, replace = false) =>
    updateUrl(
      writeDirectoryFilters(new URLSearchParams(window.location.search), { ...readDirectoryFilters(new URLSearchParams(window.location.search)), ...patch }),
      replace,
    );
  const clearFilters = () => {
    setCompare([]);
    setFilters(emptyDirectoryFilters);
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    document.getElementById('university-results')?.scrollIntoView({ block: 'start', behavior: 'auto' });
  };

  // "/" jumps to search; Escape clears it — the two shortcuts a directory needs.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const advancedCount = [filters.city, filters.subject, filters.intake, filters.scholarship, filters.cscaFree].filter(Boolean).length;
  const chips: { label: string; key: keyof DirectoryFilters }[] = [
    ...(filters.search ? [{ label: `Search: ${filters.search}`, key: 'search' as const }] : []),
    ...(['country', 'city', 'level', 'subject', 'intake'] as const)
      .filter(key => filters[key])
      .map(key => ({
        label: `${({ country: 'Destination', city: 'City', level: 'Degree', subject: 'Subject', intake: 'Intake' })[key]}: ${filters[key]}`,
        key,
      })),
    ...(filters.scholarship ? [{ label: 'Scholarship on file', key: 'scholarship' as const }] : []),
    ...(filters.cscaFree ? [{ label: 'CSCA not required', key: 'cscaFree' as const }] : []),
  ];
  const removeFilter = (key: keyof DirectoryFilters) =>
    setFilters(key === 'country' ? { country: '', city: '' } : { [key]: key === 'scholarship' || key === 'cscaFree' ? false : '' });

  const visibleRows = useMemo(() => filtered.slice(0, visibleCount).map(university => buildRow(university, filters)), [filtered, filters, visibleCount]);
  const compareRows = useMemo(
    () =>
      compare
        .map(slug => initialUniversities.find(university => university.slug === slug))
        .filter((university): university is DirectoryUniversity => Boolean(university))
        .map(university => buildRow(university, filters)),
    [compare, initialUniversities, filters],
  );
  const toggleCompare = (slug: string) =>
    setCompare(current => (current.includes(slug) ? current.filter(item => item !== slug) : current.length >= 4 ? current : [...current, slug]));

  const recordClick = (action: 'university_programs_click' | 'university_apply_click', university: DirectoryUniversity) =>
    trackConversion(action, {
      university_slug: university.slug,
      destination: university.country,
      label: 'university_directory',
      page_location: window.location.origin + window.location.pathname,
    });

  return (
    <section aria-label="University finder" className="bg-white pb-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          {/* Facet rail */}
          <form role="search" aria-label="Filter universities" action="/universities" method="get" onSubmit={submitSearch} className="lg:sticky lg:top-[124px] lg:self-start">
            <div className="flex items-center justify-between border-b border-canvas-soft pb-2">
              <p className="text-[16px] font-semibold text-petrol-800">Filter the directory</p>
              {chips.length > 0 && (
                <button type="button" onClick={clearFilters} className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-ink-soft underline underline-offset-4 hover:text-clay">
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="sr-only" htmlFor="university-search">
                Search universities or programmes
              </label>
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
                <input
                  ref={searchRef}
                  id="university-search"
                  name="search"
                  type="search"
                  value={filters.search}
                  onChange={event => setFilters({ search: event.target.value }, true)}
                  onKeyDown={event => {
                    if (event.key === 'Escape' && filters.search) setFilters({ search: '' }, true);
                  }}
                  placeholder="University, city or subject"
                  autoComplete="off"
                  className="ed-field ed-field-icon"
                />
              </div>
              <p className="mt-1.5 text-[14px] text-ink-soft">Press / to search, Esc to clear.</p>
            </div>

            <div className="mt-4 grid gap-3">
              <div>
                <label htmlFor="filter-country" className="block text-[13px] font-semibold text-ink-soft">
                  Destination
                </label>
                <select
                  id="filter-country"
                  className="ed-field mt-1"
                  value={filters.country}
                  onChange={event => setFilters({ country: event.target.value, city: '', subject: '', cscaFree: false })}
                >
                  <option value="">All destinations</option>
                  {unique([...options.countries, ...activeCountries.map(country => country.name)]).map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-level" className="block text-[13px] font-semibold text-ink-soft">
                  Study level
                </label>
                <select id="filter-level" className="ed-field mt-1" value={filters.level} onChange={event => setFilters({ level: event.target.value })}>
                  <option value="">All levels</option>
                  {unique(options.levels.map(levelLabel))
                    .sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
                    .map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="button"
                aria-expanded={advancedOpen}
                aria-controls="advanced-university-filters"
                onClick={() => setAdvancedOpen(value => !value)}
                className="flex min-h-[44px] items-center justify-between rounded-xl bg-canvas-soft px-3.5 text-[15px] font-semibold text-petrol-800 hover:bg-lime-pale"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal size={13} aria-hidden="true" /> More filters
                  {advancedCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-petrol-800 text-[12px] text-white">{advancedCount}</span>}
                </span>
                <ChevronDown size={13} className={advancedOpen ? 'rotate-180' : ''} aria-hidden="true" />
              </button>

              <div id="advanced-university-filters" hidden={!advancedOpen} className="grid gap-3 border-t border-canvas-soft pt-3">
                <div>
                  <label htmlFor="filter-subject" className="block text-[13px] font-semibold text-ink-soft">
                    Subject
                  </label>
                  <select id="filter-subject" className="ed-field mt-1" value={filters.subject} onChange={event => setFilters({ subject: event.target.value })}>
                    <option value="">All subjects</option>
                    {options.subjects.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-city" className="block text-[13px] font-semibold text-ink-soft">
                    City
                  </label>
                  <select id="filter-city" className="ed-field mt-1" value={filters.city} onChange={event => setFilters({ city: event.target.value })}>
                    <option value="">All cities</option>
                    {options.cities.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-intake" className="block text-[13px] font-semibold text-ink-soft">
                    Intake month
                  </label>
                  <select id="filter-intake" className="ed-field mt-1" value={filters.intake} onChange={event => setFilters({ intake: event.target.value })}>
                    <option value="">Any listed intake</option>
                    {options.intakes.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex min-h-9 items-center gap-2 text-[15px] text-ink">
                  <input type="checkbox" checked={filters.scholarship} onChange={event => setFilters({ scholarship: event.target.checked })} className="size-4 accent-[#175180]" />
                  Scholarship on file
                </label>
                <label className="flex min-h-9 items-center gap-2 text-[15px] text-ink">
                  <input type="checkbox" checked={filters.cscaFree} onChange={event => setFilters({ cscaFree: event.target.checked })} className="size-4 accent-[#175180]" />
                  CSCA exam not required
                </label>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 border-t border-canvas-soft pt-3" aria-label="Active filters">
                <div className="flex flex-wrap gap-1.5">
                  {chips.map(chip => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => removeFilter(chip.key)}
                      className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full bg-lime-pale px-3 text-[14px] font-semibold text-petrol-800 hover:bg-canvas-soft hover:text-clay"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      <span className="truncate">{chip.label}</span>
                      <X size={11} className="shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* Results */}
          <div>
            <div id="university-results" className="flex scroll-mt-32 flex-wrap items-center justify-between gap-3 border-b border-canvas-soft pb-3 xl:scroll-mt-40">
              <p role="status" aria-live="polite" className="text-[15px] text-ink-soft">
                <strong className="font-display text-[20px] font-black text-petrol-800">{filtered.length}</strong> {filtered.length === 1 ? 'university' : 'universities'}
                {filters.country ? ` in ${filters.country}` : ''}
                {filtered.length > visibleCount ? ` · showing ${visibleCount}` : ''}
              </p>
              <div className="flex items-center gap-2 text-[14px] text-ink-soft">
                <label htmlFor="university-sort">Sort</label>
                <select
                  id="university-sort"
                  value={filters.sort}
                  onChange={event =>
                    setFilters({ sort: ['name', 'city', 'fee', 'ranking', 'scholarship'].includes(event.target.value) ? (event.target.value as DirectoryFilters['sort']) : 'recommended' })
                  }
                  className="h-11 rounded-xl border border-rule-strong bg-white px-3 text-[15px] font-medium text-petrol-800"
                >
                  <option value="recommended">Recommended</option>
                  <option value="ranking">Best ranking</option>
                  <option value="scholarship">Scholarships first</option>
                  <option value="fee">Lowest tuition</option>
                  <option value="city">City</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-3xl bg-canvas-soft px-6 py-12 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-petrol-800"><Search size={22} aria-hidden="true" /></span>
                <h2 className="mt-4 font-display text-[26px] font-black leading-tight text-petrol-800">
                  {destinationNotListed ? `Find your university in ${filters.country}` : 'No record matches this combination'}
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-[15px] leading-7 text-ink-soft">
                  {destinationNotListed
                    ? 'That destination is served by counselling, but has no verified directory records yet. Read the destination guide or ask us to check a specific university.'
                    : 'Loosen one filter, or tell a counsellor the subject and budget you are working with — we will check the route directly.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={clearFilters} className="ed-btn ed-btn-outline min-h-11 text-[15px]">
                    Clear all filters
                  </button>
                  <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-11 text-[15px]">
                    Ask for a shortlist
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="mt-6 grid gap-5 md:grid-cols-2">
                  {visibleRows.map((row, index) => {
                    const { university } = row;
                    const selected = compare.includes(university.slug);
                    const applicationHref = `/apply?${new URLSearchParams({
                      university: university.name,
                      country: university.country,
                      intake: filters.intake || 'Upcoming intake',
                    }).toString()}`;
                    return (
                      <Fragment key={university.id}>
                        <li>
                          <article
                            aria-label={university.name}
                            className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-petrol-800/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(11,43,69,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                          >
                            <div className="relative h-[92px] bg-petrol-800 bg-[radial-gradient(circle_at_90%_-10%,rgba(159,232,112,0.35),transparent_55%)]">
                              {row.awardValue && (
                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-[13px] font-bold text-petrol-800">
                                  <Gift size={13} aria-hidden="true" /> Scholarship
                                </span>
                              )}
                              {row.ranking && (
                                <span className="absolute right-4 top-4 inline-flex max-w-[60%] items-center gap-1.5 truncate rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold text-white">
                                  <Trophy size={13} className="shrink-0 text-lime" aria-hidden="true" /> #{row.ranking.rank}
                                  <span className="truncate font-normal text-white/75">{row.ranking.publisher}</span>
                                </span>
                              )}
                            </div>
                            <div className="relative -mt-9 flex flex-1 flex-col px-5 pb-5 sm:px-6">
                              <span className="w-fit rounded-2xl bg-white p-1 shadow-[0_6px_18px_-8px_rgba(11,43,69,0.45)]">
                                <UniversityMark university={university} size={60} />
                              </span>
                              <h2 className="mt-3 text-[20px] font-semibold leading-tight tracking-[-0.01em] text-petrol-800">
                                <Link
                                  href={`/universities/${university.slug}`}
                                  onClick={() => recordClick('university_programs_click', university)}
                                  className="after:absolute after:inset-0 focus-visible:outline-none"
                                >
                                  {university.name}
                                </Link>
                              </h2>
                              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-ink-soft">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin size={13} className="shrink-0" aria-hidden="true" />
                                  {[university.city, university.country].filter(Boolean).join(', ')}
                                </span>
                                {row.englishTaught && <span className="font-semibold text-jade">English-taught</span>}
                              </p>
                              {row.levels.length > 0 && (
                                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Study levels">
                                  {row.levels.slice(0, 4).map(level => (
                                    <li key={level} className="rounded-full bg-canvas-soft px-2.5 py-0.5 text-[13px] font-semibold text-petrol-800">{level}</li>
                                  ))}
                                </ul>
                              )}
                              {row.awardValue && (
                                <p className="mt-3 line-clamp-2 rounded-xl bg-lime-pale px-3 py-2 text-[14px] font-semibold leading-5 text-lime-deep">{row.awardValue}</p>
                              )}
                              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-canvas-soft pt-4 text-[14px]">
                                <div>
                                  <dt className="text-ink-soft">Tuition</dt>
                                  <dd className="mt-0.5 font-semibold leading-5 text-petrol-800">{row.showTuition ? row.tuition : 'See programmes'}</dd>
                                </div>
                                <div>
                                  <dt className="text-ink-soft">Intake</dt>
                                  <dd className="mt-0.5 font-semibold leading-5 text-petrol-800">{row.intake.length ? row.intake.join(', ') : 'See profile'}</dd>
                                </div>
                              </dl>
                              {university.clearCost && (
                                <Link
                                  href={`/universities/${university.slug}/clear-cost`}
                                  className="relative z-10 mt-3 inline-flex w-fit items-center gap-1 text-[14px] font-semibold text-petrol-800 underline underline-offset-4"
                                >
                                  <FileText size={13} aria-hidden="true" /> Full cost sheet
                                </Link>
                              )}
                              <div className="relative z-10 mt-auto flex items-center gap-2 pt-5">
                                <button
                                  type="button"
                                  onClick={() => toggleCompare(university.slug)}
                                  aria-pressed={selected}
                                  aria-label={selected ? `Remove ${university.name} from comparison` : `Add ${university.name} to comparison`}
                                  title={selected ? 'In comparison' : 'Compare'}
                                  className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                                    selected ? 'bg-petrol-800 text-white' : 'bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
                                  }`}
                                >
                                  {selected ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
                                </button>
                                <Link
                                  href={`/universities/${university.slug}`}
                                  onClick={() => recordClick('university_programs_click', university)}
                                  className="ed-btn ed-btn-outline min-h-11 flex-1 px-3 text-[15px]"
                                  aria-label={`View ${university.name} profile`}
                                >
                                  Profile
                                </Link>
                                <Link
                                  href={applicationHref}
                                  onClick={() => recordClick('university_apply_click', university)}
                                  className="ed-btn ed-btn-signal min-h-11 flex-[1.4] whitespace-nowrap px-3 text-[14px] sm:text-[15px]"
                                  aria-label={`Check eligibility for ${university.name} with EduExpress International`}
                                >
                                  Check eligibility
                                </Link>
                              </div>
                            </div>
                          </article>
                        </li>
                        {index === 3 && (
                          <li className="md:col-span-2">
                            <aside className="flex flex-col gap-5 rounded-3xl bg-petrol-800 p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-display text-[26px] font-black leading-[1.04] text-lime sm:text-[32px]">Not sure which university fits you?</p>
                                <p className="mt-2 max-w-xl text-[16px] leading-7 text-white/80">
                                  Send your results and budget once. A counsellor shortlists the universities and scholarships you can realistically get, free of charge.
                                </p>
                              </div>
                              <a href="#shortlist" className="ed-btn ed-btn-signal min-h-[52px] shrink-0 px-7">
                                Get my free shortlist <ArrowRight size={18} aria-hidden="true" />
                              </a>
                            </aside>
                          </li>
                        )}
                      </Fragment>
                    );
                  })}
                </ul>

                {visibleCount < filtered.length && (
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-[14px] text-ink-soft">
                      Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} universities
                    </p>
                    <Link href={moreHref} scroll={false} prefetch={false} className="ed-btn ed-btn-outline min-h-11 text-[15px]">
                      Show {Math.min(12, filtered.length - visibleCount)} more
                    </Link>
                  </div>
                )}

                <p className="mt-8 border-t border-canvas-soft pt-4 text-[14px] leading-6 text-ink-soft">
                  Tuition, scholarship and ranking entries link to the official source record inside each profile. Where a figure is under verification, the profile says so — we do not publish estimates as facts.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compare tray */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[60] bg-petrol-800 px-4 py-3 text-white shadow-deep">
          <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-display text-[18px] font-black text-lime">{compare.length}/4</span>
              <p className="truncate text-[14px] text-white/85">{compareRows.map(row => row.university.name).join(' · ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCompare([])} className="min-h-11 px-3 text-[14px] font-semibold text-white/75 hover:text-white">
                Clear
              </button>
              <button type="button" onClick={() => setCompareOpen(true)} className="ed-btn ed-btn-signal min-h-11 px-5 text-[15px]">
                Compare {compare.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && compareRows.length > 0 && (
        <CompareDialog rows={compareRows} onClose={() => setCompareOpen(false)} onRemove={slug => setCompare(current => current.filter(item => item !== slug))} />
      )}
    </section>
  );
}

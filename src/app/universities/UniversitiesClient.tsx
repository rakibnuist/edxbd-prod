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
import { expandDirectory, type CompactUniversity } from '@/lib/university-directory-compact';

type Props = { directory: CompactUniversity[] };

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

const flagFor = (country?: string) => {
  if (!country) return '🌐';
  const c = country.toLowerCase();
  if (c.includes('malaysia')) return '🇲🇾';
  if (c.includes('china')) return '🇨🇳';
  if (c.includes('united kingdom') || c === 'uk') return '🇬🇧';
  if (c.includes('hungary')) return '🇭🇺';
  if (c.includes('finland')) return '🇫🇮';
  if (c.includes('korea')) return '🇰🇷';
  if (c.includes('cyprus')) return '🇨🇾';
  if (c.includes('croatia')) return '🇭🇷';
  if (c.includes('georgia')) return '🇬🇪';
  if (c.includes('malta')) return '🇲🇹';
  if (c.includes('greece')) return '🇬🇷';
  if (c.includes('thailand')) return '🇹🇭';
  return '🏛️';
};

function UniversityMark({ university, size = 56 }: { university: DirectoryUniversity; size?: number }) {
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
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-2xl border border-rule bg-white p-1.5 shadow-sm"
      style={{ width: size, height: size }}
    >
      {university.logo && !failed ? (
        <Image
          src={university.logo}
          alt={`${university.name} official logo`}
          width={size - 8}
          height={size - 8}
          unoptimized
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-center text-[13px] font-black leading-tight text-petrol-800">{initials}</span>
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
  const rawTuition = directoryTuitionSummary(programs.map(program => evergreenText(program.tuition || ''))) || evergreenText(university.details.tuition || '');
  const isAwkwardTuition = /dated official fee|next-cycle|require confirmation|research below|not recorded|contact|request|not specified|not confirmed|unknown/i.test(rawTuition);
  const tuition = isAwkwardTuition ? 'View program fees' : rawTuition;
  const showTuition = Boolean(tuition) && !isAwkwardTuition;

  return {
    university,
    tuition,
    showTuition,
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
          <p className="text-[14px] leading-5 text-ink-soft">Figures come from each university record and its official sources.</p>
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-11 text-[15px]">
            Ask a counsellor to review these <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesClient({ directory }: Props) {
  const initialUniversities = useMemo(() => expandDirectory(directory), [directory]);
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
    <section aria-label="University finder" className="bg-[#f8fafc] pb-20 pt-2">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          {/* Facet rail */}
          <form
            role="search"
            aria-label="Filter universities"
            action="/universities"
            method="get"
            onSubmit={submitSearch}
            className="lg:sticky lg:top-[88px] lg:self-start rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[14px] font-bold uppercase tracking-wider text-slate-800">Filters</span>
              {chips.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Reset ({chips.length})
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="mt-4">
              <label htmlFor="university-search" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Keyword Search
              </label>
              <div className="relative mt-1.5">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
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
                  placeholder="Name, city, major..."
                  autoComplete="off"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-petrol-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3.5">
              <div>
                <label htmlFor="filter-country" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Destination Country
                </label>
                <select
                  id="filter-country"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-petrol-800 focus:bg-white"
                  value={filters.country}
                  onChange={event => setFilters({ country: event.target.value, city: '', subject: '', cscaFree: false })}
                >
                  <option value="">All Destinations</option>
                  {unique([...options.countries, ...activeCountries.map(country => country.name)]).map(item => (
                    <option key={item} value={item}>
                      {flagFor(item)} {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-level" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Study Level
                </label>
                <select
                  id="filter-level"
                  className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-petrol-800 focus:bg-white"
                  value={filters.level}
                  onChange={event => setFilters({ level: event.target.value })}
                >
                  <option value="">All Degree Levels</option>
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
                className="flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal size={13} aria-hidden="true" /> Specific Criteria
                  {advancedCount > 0 && (
                    <span className="grid size-4 place-items-center rounded-full bg-petrol-800 text-[10px] text-white">
                      {advancedCount}
                    </span>
                  )}
                </span>
                <ChevronDown size={14} className={`transition-transform ${advancedOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              <div id="advanced-university-filters" hidden={!advancedOpen} className="grid gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label htmlFor="filter-subject" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Subject Field
                  </label>
                  <select
                    id="filter-subject"
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-petrol-800"
                    value={filters.subject}
                    onChange={event => setFilters({ subject: event.target.value })}
                  >
                    <option value="">All Subjects</option>
                    {options.subjects.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-city" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    City Location
                  </label>
                  <select
                    id="filter-city"
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-petrol-800"
                    value={filters.city}
                    onChange={event => setFilters({ city: event.target.value })}
                  >
                    <option value="">All Cities</option>
                    {options.cities.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="filter-intake" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Intake Month
                  </label>
                  <select
                    id="filter-intake"
                    className="mt-1 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-petrol-800"
                    value={filters.intake}
                    onChange={event => setFilters({ intake: event.target.value })}
                  >
                    <option value="">Any Intake</option>
                    {options.intakes.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={filters.scholarship}
                    onChange={event => setFilters({ scholarship: event.target.checked })}
                    className="size-4 rounded accent-petrol-800"
                  />
                  <span>Scholarship Available Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.cscaFree}
                    onChange={event => setFilters({ cscaFree: event.target.checked })}
                    className="size-4 rounded accent-petrol-800"
                  />
                  <span>CSCA Exam Exempt</span>
                </label>
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-3" aria-label="Active filters">
                <div className="flex flex-wrap gap-1.5">
                  {chips.map(chip => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => removeFilter(chip.key)}
                      className="inline-flex h-7 max-w-full items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
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

          {/* Results Area */}
          <div>
            <div id="university-results" className="mb-5 flex scroll-mt-32 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-sm xl:scroll-mt-40">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-slate-600">
                  Showing <strong className="font-extrabold text-slate-900">{filtered.length}</strong> {filtered.length === 1 ? 'University' : 'Universities'}
                  {filters.country && <span> in <strong className="text-emerald-700">{filters.country}</strong></span>}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <label htmlFor="university-sort">Sort:</label>
                <select
                  id="university-sort"
                  value={filters.sort}
                  onChange={event =>
                    setFilters({ sort: ['name', 'city', 'fee', 'ranking', 'scholarship'].includes(event.target.value) ? (event.target.value as DirectoryFilters['sort']) : 'recommended' })
                  }
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none focus:border-petrol-800"
                >
                  <option value="recommended">Recommended (Top Ranked & Funding)</option>
                  <option value="ranking">Highest World Ranking</option>
                  <option value="scholarship">Active Scholarships First</option>
                  <option value="fee">Lowest Indicative Tuition</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-3xl bg-white border border-slate-200 px-6 py-14 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-petrol-800"><Search size={22} aria-hidden="true" /></span>
                <h2 className="mt-4 font-display text-[24px] font-black leading-tight text-slate-900">
                  {destinationNotListed ? `Find your university in ${filters.country}` : 'No matching universities found'}
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-[14px] leading-relaxed text-slate-500">
                  {destinationNotListed
                    ? 'That destination is served by our personalized counselling team. Ask a counselor to check available partner universities for you.'
                    : 'Try clearing or loosening your filters to explore more institutions, or contact an advisor directly.'}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={clearFilters} className="ed-btn ed-btn-outline min-h-[44px] text-xs font-bold">
                    Clear all filters
                  </button>
                  <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[44px] text-xs font-bold">
                    Ask for a free shortlist
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="grid gap-5 md:grid-cols-2">
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
                            className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
                          >
                            <div>
                              {/* Header: Logo, Location & Status Badge */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <UniversityMark university={university} size={42} />
                                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
                                    <span className="text-sm">{flagFor(university.country)}</span>
                                    <span>{[university.city, university.country].filter(Boolean).join(', ')}</span>
                                  </span>
                                </div>

                                <div className="shrink-0">
                                  {row.ranking ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-petrol-800 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                      <Trophy size={11} className="text-lime" aria-hidden="true" />
                                      #{row.ranking.rank} <span className="font-normal text-white/70">{row.ranking.publisher}</span>
                                    </span>
                                  ) : row.awardValue ? (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                      <Gift size={11} className="text-emerald-600" aria-hidden="true" /> Scholarship
                                    </span>
                                  ) : row.englishTaught ? (
                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                      English-Taught
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              {/* University Name: Full width so it never truncates */}
                              <h2 className="mt-2.5 text-[17px] font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2 min-h-[46px] flex items-center">
                                <Link
                                  href={`/universities/${university.slug}`}
                                  onClick={() => recordClick('university_programs_click', university)}
                                  className="focus-visible:outline-none"
                                >
                                  {university.name}
                                </Link>
                              </h2>

                              {/* Key Specs Matrix */}
                              <div className="mt-4 grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100 py-3 text-xs">
                                <div className="pr-3">
                                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Indicative Tuition</span>
                                  <span className="mt-0.5 block font-bold text-slate-900 text-[13px] truncate">
                                    {row.showTuition ? row.tuition : 'See programs on profile'}
                                  </span>
                                </div>
                                <div className="pl-3">
                                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Upcoming Intake</span>
                                  <span className="mt-0.5 block font-bold text-slate-900 text-[13px] truncate">
                                    {row.intake.length ? row.intake.slice(0, 2).join(', ') : 'September'}
                                  </span>
                                </div>
                              </div>

                              {/* Study Levels & Medium */}
                              <div className="mt-3 flex flex-wrap items-center gap-1.5 min-h-[26px]">
                                {row.levels.slice(0, 4).map(level => (
                                  <span key={level} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                    {level}
                                  </span>
                                ))}
                                {row.englishTaught && (
                                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                    ● English Medium
                                  </span>
                                )}
                              </div>

                              {/* Funding / Scholarship Line */}
                              {row.awardValue ? (
                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-2 text-xs font-semibold text-emerald-950">
                                  <Gift size={13} className="shrink-0 text-emerald-700" />
                                  <span className="truncate">
                                    <strong className="text-emerald-800">Scholarship:</strong> {row.awardValue}
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
                                  <span className="truncate">Standard direct university admission pathway</span>
                                </div>
                              )}

                              {/* Agency Fee Trust Line */}
                              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                {university.country.toLowerCase() === 'malaysia' ? (
                                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                                    <Check size={13} className="text-emerald-600" /> BDT 0 EduExpress Service Fee
                                  </span>
                                ) : (
                                  <span className="text-slate-600 flex items-center gap-1">
                                    <Check size={13} className="text-emerald-600" /> Visa-First Pledge (BDT 0 Pre-Visa)
                                  </span>
                                )}
                                {university.clearCost && (
                                  <Link
                                    href={`/universities/${university.slug}#fees`}
                                    className="font-bold text-petrol-800 hover:text-emerald-700 hover:underline"
                                  >
                                    ClearCost™ Sheet →
                                  </Link>
                                )}
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5">
                              <button
                                type="button"
                                onClick={() => toggleCompare(university.slug)}
                                aria-pressed={selected}
                                aria-label={selected ? `Remove ${university.name} from comparison` : `Add ${university.name} to comparison`}
                                title={selected ? 'In comparison' : 'Compare'}
                                className={`grid size-10 shrink-0 place-items-center rounded-xl border transition-all ${
                                  selected ? 'border-petrol-800 bg-petrol-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {selected ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                              </button>
                              <Link
                                href={`/universities/${university.slug}`}
                                onClick={() => recordClick('university_programs_click', university)}
                                className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-center text-xs font-bold text-slate-800 transition-colors hover:bg-slate-50 hover:border-slate-400"
                                aria-label={`View ${university.name} details`}
                              >
                                View Details
                              </Link>
                              <Link
                                href={applicationHref}
                                onClick={() => recordClick('university_apply_click', university)}
                                className="ed-btn ed-btn-signal min-h-[42px] flex-[1.2] whitespace-nowrap px-3 text-xs font-bold"
                                aria-label={`Check eligibility for ${university.name}`}
                              >
                                Check Eligibility
                              </Link>
                            </div>
                          </article>
                        </li>
                        {index === 3 && (
                          <li className="md:col-span-2">
                            <aside className="flex flex-col gap-5 rounded-2xl bg-petrol-800 p-6 text-white sm:p-7 md:flex-row md:items-center md:justify-between shadow-md">
                              <div>
                                <p className="font-display text-[22px] font-black leading-tight text-lime sm:text-[26px]">Not sure which university fits you?</p>
                                <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-white/80">
                                  Send your transcripts and budget. An EduExpress counselor shortlists the universities and scholarships you qualify for, completely free.
                                </p>
                              </div>
                              <a href="#shortlist" className="ed-btn ed-btn-signal min-h-[46px] shrink-0 px-6 text-xs font-bold">
                                Get my free shortlist <ArrowRight size={16} aria-hidden="true" />
                              </a>
                            </aside>
                          </li>
                        )}
                      </Fragment>
                    );
                  })}
                </ul>

                {visibleCount < filtered.length && (
                  <div className="mt-8 flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500">
                      Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} universities
                    </p>
                    <Link href={moreHref} scroll={false} prefetch={false} className="ed-btn ed-btn-outline min-h-[44px] px-6 text-xs font-bold">
                      Show {Math.min(12, filtered.length - visibleCount)} more universities
                    </Link>
                  </div>
                )}

                <p className="mt-8 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
                  Tuition, scholarship and ranking entries link to official records and ministry registers. Ask an EduExpress counselor to verify requirements for your specific intake.
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

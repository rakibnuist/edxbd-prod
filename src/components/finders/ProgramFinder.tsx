'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, ExternalLink, Languages, MapPin, Search, WalletCards } from 'lucide-react';
import type { ProgramRow } from '@/lib/catalog-views';

type Sort = 'tuition-asc' | 'tuition-desc' | 'name' | 'university';
const PAGE = 24;
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#08263c] outline-none focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10';
const distinct = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
const LEVEL_ORDER = ['Chinese language', 'Foundation', 'Bachelor', 'MBBS', 'Master', 'PhD'];
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 });

function Select({ label, value, values, onChange, all }: { label: string; value: string; values: string[]; onChange: (value: string) => void; all: string }) {
  return <label className="block min-w-0 text-xs font-bold text-slate-600">{label}<select value={value} onChange={event => onChange(event.target.value)} className={fieldClass}><option value="">{all}</option>{values.map(item => <option key={item} value={item}>{item}</option>)}</select></label>;
}

export default function ProgramFinder({ rows }: { rows: ProgramRow[] }) {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [city, setCity] = useState('');
  const [maxTuition, setMaxTuition] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('tuition-asc');
  const [rate, setRate] = useState('');
  const [visible, setVisible] = useState(PAGE);

  const options = useMemo(() => ({
    levels: distinct(rows.map(row => row.level)).sort((a, b) => (LEVEL_ORDER.indexOf(a) + 1 || 99) - (LEVEL_ORDER.indexOf(b) + 1 || 99)),
    languages: distinct(rows.flatMap(row => row.languages)),
    cities: distinct(rows.map(row => row.city)),
  }), [rows]);

  const budget = /^\d+$/.test(maxTuition) ? Number(maxTuition) : null;
  const bdtRate = /^\d+(\.\d+)?$/.test(rate.trim()) && Number(rate) > 0 ? Number(rate) : null;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = rows.filter(row => (!query || `${row.name} ${row.universityName} ${row.city}`.toLowerCase().includes(query))
      && (!level || row.level === level)
      && (!language || row.languages.includes(language))
      && (!city || row.city === city)
      && (budget === null || (row.annualTuitionCny !== null && row.annualTuitionCny <= budget))
      && (!openOnly || !row.deadlinePassed));
    const byTuition = (direction: 1 | -1) => (a: ProgramRow, b: ProgramRow) => {
      // Programs without one explicit annual figure always sort last.
      if (a.annualTuitionCny === null) return b.annualTuitionCny === null ? a.name.localeCompare(b.name) : 1;
      if (b.annualTuitionCny === null) return -1;
      return direction * (a.annualTuitionCny - b.annualTuitionCny) || a.name.localeCompare(b.name);
    };
    const sorters: Record<Sort, (a: ProgramRow, b: ProgramRow) => number> = {
      'tuition-asc': byTuition(1),
      'tuition-desc': byTuition(-1),
      name: (a, b) => a.name.localeCompare(b.name),
      university: (a, b) => a.universityName.localeCompare(b.universityName) || a.name.localeCompare(b.name),
    };
    return matches.sort(sorters[sort]);
  }, [rows, search, level, language, city, budget, openOnly, sort]);

  const reset = (apply: () => void) => { apply(); setVisible(PAGE); };
  const priced = filtered.filter(row => row.annualTuitionCny !== null).map(row => row.annualTuitionCny as number);
  const anyFilter = Boolean(search || level || language || city || maxTuition || openOnly);

  return (
    <section aria-label="Program finder" className="bg-[#f7fafc] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="rounded-2xl border border-[#174f7a]/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block text-xs font-bold text-slate-600 md:col-span-2">Program, university or city<span className="relative mt-1.5 block"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={event => reset(() => setSearch(event.target.value))} placeholder="e.g. Computer Science, Nanjing, MBBS" className={`${fieldClass} mt-0 pl-11`} /></span></label>
            <Select label="Study level" value={level} values={options.levels} onChange={value => reset(() => setLevel(value))} all="All study levels" />
            <Select label="Teaching language" value={language} values={options.languages} onChange={value => reset(() => setLanguage(value))} all="Any language" />
            <Select label="City" value={city} values={options.cities} onChange={value => reset(() => setCity(value))} all="All cities" />
            <label className="block text-xs font-bold text-slate-600">Max tuition per year (CNY)<input inputMode="numeric" value={maxTuition} onChange={event => reset(() => setMaxTuition(event.target.value.replace(/\D/g, '')))} placeholder="e.g. 20000" className={fieldClass} /></label>
            <label className="block text-xs font-bold text-slate-600">Sort by<select value={sort} onChange={event => setSort(event.target.value as Sort)} className={fieldClass}><option value="tuition-asc">Lowest tuition first</option><option value="tuition-desc">Highest tuition first</option><option value="name">Program name</option><option value="university">University name</option></select></label>
            <label className="block text-xs font-bold text-slate-600">Your BDT rate for 1 CNY (optional)<input inputMode="decimal" value={rate} onChange={event => setRate(event.target.value.replace(/[^\d.]/g, ''))} placeholder="Enter today's rate" className={fieldClass} /></label>
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600"><input type="checkbox" checked={openOnly} onChange={event => reset(() => setOpenOnly(event.target.checked))} className="size-4 accent-[#174f7a]" />Hide programs whose recorded deadline has passed</label>
            {anyFilter && <button type="button" onClick={() => reset(() => { setSearch(''); setLevel(''); setLanguage(''); setCity(''); setMaxTuition(''); setOpenOnly(false); })} className="min-h-11 text-left text-sm font-bold text-[#174f7a] underline sm:text-right">Clear all filters</button>}
          </div>
          <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-600"><strong className="text-[#08263c]">{filtered.length}</strong> of {rows.length} programs{priced.length > 0 && <> · Recorded tuition from <strong className="text-[#08263c]">CNY {number(Math.min(...priced))}</strong> to <strong className="text-[#08263c]">CNY {number(Math.max(...priced))}</strong> per year</>}</p>
          {budget !== null && <p className="mt-2 text-xs leading-5 text-slate-500">A budget filter only includes programs with one explicit yearly CNY figure. Ranges, scholarship-reduced prices and &ldquo;free&rdquo; labels are left out rather than guessed.</p>}
        </div>

        {filtered.length ? <>
          <ul className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map(row => (
              <li key={row.key} className="flex flex-col rounded-2xl border border-[#174f7a]/15 bg-white p-5 shadow-sm transition hover:border-[#174f7a]/35 hover:shadow-lg">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold"><span className="rounded-full bg-[#e9f7fd] px-2.5 py-1 text-[#174f7a]">{row.level}</span>{row.deadlinePassed && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Recorded deadline passed</span>}</div>
                <h3 className="mt-3 text-lg font-black leading-snug">{row.name}</h3>
                <Link href={`/universities/${row.universitySlug}`} className="mt-1 text-sm font-bold text-[#174f7a] hover:underline">{row.universityName}</Link>
                <dl className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-[#174f7a]" /><dt className="sr-only">City</dt><dd>{row.city}</dd></div>
                  <div className="flex gap-2"><Languages size={16} className="mt-0.5 shrink-0 text-[#174f7a]" /><dt className="sr-only">Teaching language</dt><dd>{row.languages.join(', ') || 'Not recorded'}{row.duration && ` · ${row.duration}`}</dd></div>
                  <div className="flex gap-2"><WalletCards size={16} className="mt-0.5 shrink-0 text-[#174f7a]" /><dt className="sr-only">Tuition</dt><dd><strong className="text-[#08263c]">{row.tuitionLabel || 'Tuition not recorded'}</strong>{bdtRate && row.annualTuitionCny !== null && <span className="block text-xs">≈ BDT {number(row.annualTuitionCny * bdtRate)} per year at your rate</span>}</dd></div>
                  <div className="flex gap-2"><CalendarClock size={16} className="mt-0.5 shrink-0 text-[#174f7a]" /><dt className="sr-only">Deadline</dt><dd>{row.deadline || 'Deadline not recorded'}</dd></div>
                </dl>
                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/universities/${row.universitySlug}/clear-cost`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-4 text-sm font-black text-white hover:bg-[#174f7a]">Full cost breakdown <ArrowRight size={15} /></Link>
                    <Link href={`/compare-costs?p=${encodeURIComponent(row.key)}`} className="inline-flex min-h-11 items-center rounded-xl border border-[#174f7a]/25 px-3 text-sm font-bold text-[#174f7a]">Compare</Link>
                    {row.sourceUrl && <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#174f7a]/25 px-3 text-sm font-bold text-[#174f7a]">Source <ExternalLink size={14} /></a>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {visible < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisible(value => value + PAGE)} className="inline-flex min-h-13 items-center gap-2 rounded-xl border-2 border-[#08263c] bg-white px-6 text-sm font-black">Show {Math.min(PAGE, filtered.length - visible)} more programs</button></div>}
        </> : <div className="mt-7 rounded-2xl border border-dashed border-[#174f7a]/30 bg-white px-6 py-14 text-center"><h2 className="font-heading text-2xl font-bold">No recorded program matches every filter</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Try a higher budget or fewer filters, or ask a counselor to check programs we have not recorded yet.</p><Link href="/education-fit-assessment" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#174f7a] px-5 text-sm font-black text-white">Get a free assessment <ArrowRight size={15} /></Link></div>}
      </div>
    </section>
  );
}

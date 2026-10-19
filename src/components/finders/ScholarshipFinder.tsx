'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, CheckCircle2, ExternalLink, MapPin, Search } from 'lucide-react';
import { SCHOLARSHIP_CATEGORIES, type ScholarshipRow } from '@/lib/catalog-views';

const PAGE = 18;
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#08263c] outline-none focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10';
const distinct = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));

export default function ScholarshipFinder({ rows }: { rows: ScholarshipRow[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [showPassed, setShowPassed] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const cities = useMemo(() => distinct(rows.map(row => row.city)), [rows]);
  const counts = useMemo(() => Object.fromEntries(SCHOLARSHIP_CATEGORIES.map(name => [name, rows.filter(row => row.category === name && (showPassed || !row.deadlinePassed)).length])), [rows, showPassed]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter(row => (showPassed || !row.deadlinePassed)
      && (!category || row.category === category)
      && (!city || row.city === city)
      && (!query || `${row.title} ${row.universityName} ${row.city} ${row.summary.join(' ')}`.toLowerCase().includes(query)))
      .sort((a, b) => SCHOLARSHIP_CATEGORIES.indexOf(a.category) - SCHOLARSHIP_CATEGORIES.indexOf(b.category) || a.universityName.localeCompare(b.universityName));
  }, [rows, search, category, city, showPassed]);
  const reset = (apply: () => void) => { apply(); setVisible(PAGE); };

  return (
    <section id="scholarship-database" aria-labelledby="scholarship-database-title" className="scroll-mt-28 bg-[#f7fafc] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1260px]">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#17699a]">Scholarship database</p>
          <h2 id="scholarship-database-title" className="mt-3 text-3xl font-black tracking-[-.035em] sm:text-5xl">{rows.length} China scholarships, each tied to a university</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Every entry shows what the award covers as recorded from the university&apos;s published terms, its deadline and a source link where we have one. Coverage and seats change each intake, so confirm before you apply.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Scholarship type">
          <button type="button" onClick={() => reset(() => setCategory(''))} aria-pressed={!category} className={`min-h-10 rounded-full px-4 text-sm font-bold ${!category ? 'bg-[#08263c] text-white' : 'border border-[#174f7a]/20 bg-white text-[#174f7a]'}`}>All types</button>
          {SCHOLARSHIP_CATEGORIES.filter(name => counts[name] > 0).map(name => <button key={name} type="button" onClick={() => reset(() => setCategory(name))} aria-pressed={category === name} className={`min-h-10 rounded-full px-4 text-sm font-bold ${category === name ? 'bg-[#08263c] text-white' : 'border border-[#174f7a]/20 bg-white text-[#174f7a]'}`}>{name} <span className="opacity-70">({counts[name]})</span></button>)}
        </div>

        <div className="mt-4 grid gap-4 rounded-2xl border border-[#174f7a]/15 bg-white p-4 shadow-sm sm:p-5 md:grid-cols-[2fr_1fr]">
          <label className="block text-xs font-bold text-slate-600">Scholarship, university or coverage<span className="relative mt-1.5 block"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={event => reset(() => setSearch(event.target.value))} placeholder="e.g. stipend, tuition free, Nanjing" className={`${fieldClass} mt-0 pl-11`} /></span></label>
          <label className="block text-xs font-bold text-slate-600">City<select value={city} onChange={event => reset(() => setCity(event.target.value))} className={fieldClass}><option value="">All cities</option>{cities.map(item => <option key={item}>{item}</option>)}</select></label>
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600"><input type="checkbox" checked={showPassed} onChange={event => reset(() => setShowPassed(event.target.checked))} className="size-4 accent-[#174f7a]" />Include scholarships whose recorded deadline has passed</label>
            <p role="status" aria-live="polite" className="text-sm text-slate-600"><strong className="text-[#08263c]">{filtered.length}</strong> matching scholarships</p>
          </div>
        </div>

        {filtered.length ? <>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map(row => (
              <li key={row.key} className="flex flex-col rounded-2xl border border-[#174f7a]/15 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-[#e9f7fd] px-2.5 py-1 text-[#174f7a]">{row.category}</span>{row.deadlinePassed && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Deadline passed</span>}</div>
                <h3 className="mt-3 text-lg font-black leading-snug">{row.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={14} className="shrink-0 text-[#174f7a]" /><Link href={`/universities/${row.universitySlug}`} className="font-bold text-[#174f7a] hover:underline">{row.universityName}</Link>, {row.city}</p>
                {row.summary.length ? <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">{row.summary.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#25865f]" />{item}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-500">Coverage not recorded yet. Ask a counselor for the current published terms.</p>}
                {row.eligiblePrograms.length > 0 && <p className="mt-3 text-xs leading-5 text-slate-500"><strong>For:</strong> {row.eligiblePrograms.slice(0, 3).join('; ')}{row.eligiblePrograms.length > 3 && ` and ${row.eligiblePrograms.length - 3} more`}</p>}
                {row.renewal && <p className="mt-2 text-xs leading-5 text-slate-500"><strong>Renewal:</strong> {row.renewal}</p>}
                <p className="mt-4 flex gap-2 text-sm text-slate-600"><CalendarClock size={16} className="mt-0.5 shrink-0 text-[#174f7a]" />{row.deadline || 'Deadline not recorded'}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link href={`/universities/${row.universitySlug}/clear-cost`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-4 text-sm font-black text-white hover:bg-[#174f7a]">Cost after scholarship <ArrowRight size={15} /></Link>
                  {row.sourceUrl ? <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#174f7a]/25 px-3 text-sm font-bold text-[#174f7a]">Source <ExternalLink size={14} /></a> : <span className="inline-flex min-h-11 items-center px-1 text-xs text-slate-500">Source link pending</span>}
                </div>
              </li>
            ))}
          </ul>
          {visible < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisible(value => value + PAGE)} className="inline-flex min-h-13 items-center gap-2 rounded-xl border-2 border-[#08263c] bg-white px-6 text-sm font-black">Show {Math.min(PAGE, filtered.length - visible)} more scholarships</button></div>}
        </> : <p className="mt-6 rounded-2xl border border-dashed border-[#174f7a]/30 bg-white px-6 py-12 text-center text-sm text-slate-600">No recorded scholarship matches these filters. Try another city or include passed deadlines.</p>}
      </div>
    </section>
  );
}

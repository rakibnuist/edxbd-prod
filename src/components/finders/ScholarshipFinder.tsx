'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, CheckCircle2, ExternalLink, MapPin, Search } from 'lucide-react';
import { SCHOLARSHIP_CATEGORIES, type ScholarshipRow } from '@/lib/catalog-views';

const PAGE = 18;
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] font-semibold text-petrol-800 outline-none focus:border-petrol-800 focus:ring-4 focus:ring-lime/50';
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
    <section id="scholarship-database" aria-labelledby="scholarship-database-title" className="scroll-mt-28 bg-canvas-soft py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep">Scholarship database</p>
          <h2 id="scholarship-database-title" className="mt-5 font-display text-[36px] font-black leading-[1] tracking-[-0.02em] text-petrol-800 sm:text-[48px]">{rows.length} China scholarships, each tied to a university</h2>
          <p className="mt-4 text-[18px] leading-[1.6] text-ink-soft">Every entry shows what the award covers as recorded from the university&apos;s published terms, its deadline and a source link where we have one. Coverage and seats change each intake, so confirm before you apply.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Scholarship type">
          <button type="button" onClick={() => reset(() => setCategory(''))} aria-pressed={!category} className={`min-h-10 rounded-full px-4 text-[15px] font-bold ${!category ? 'bg-petrol-800 text-white' : 'border border-petrol-800/20 bg-white text-petrol-800'}`}>All types</button>
          {SCHOLARSHIP_CATEGORIES.filter(name => counts[name] > 0).map(name => <button key={name} type="button" onClick={() => reset(() => setCategory(name))} aria-pressed={category === name} className={`min-h-10 rounded-full px-4 text-[15px] font-bold ${category === name ? 'bg-petrol-800 text-white' : 'border border-petrol-800/20 bg-white text-petrol-800'}`}>{name} <span className="opacity-70">({counts[name]})</span></button>)}
        </div>

        <div className="mt-4 grid gap-4 rounded-3xl border border-petrol-800/15 bg-white p-4 sm:p-5 md:grid-cols-[2fr_1fr]">
          <label className="block text-[14px] font-bold text-ink-soft">Scholarship, university or coverage<span className="relative mt-1.5 block"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={event => reset(() => setSearch(event.target.value))} placeholder="e.g. stipend, tuition free, Nanjing" className={`${fieldClass} mt-0 pl-11`} /></span></label>
          <label className="block text-[14px] font-bold text-ink-soft">City<select value={city} onChange={event => reset(() => setCity(event.target.value))} className={fieldClass}><option value="">All cities</option>{cities.map(item => <option key={item}>{item}</option>)}</select></label>
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] font-semibold text-ink-soft"><input type="checkbox" checked={showPassed} onChange={event => reset(() => setShowPassed(event.target.checked))} className="size-4 accent-petrol-800" />Include scholarships whose recorded deadline has passed</label>
            <p role="status" aria-live="polite" className="text-[15px] text-ink-soft"><strong className="text-petrol-800">{filtered.length}</strong> matching scholarships</p>
          </div>
        </div>

        {filtered.length ? <>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map(row => (
              <li key={row.key} className="flex flex-col rounded-3xl border border-petrol-800/15 bg-white p-5">
                <div className="flex flex-wrap gap-2 text-[14px] font-bold"><span className="rounded-full bg-lime-pale px-2.5 py-1 text-lime-deep">{row.category}</span>{row.deadlinePassed && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">Deadline passed</span>}</div>
                <h3 className="mt-3 text-lg font-black leading-snug">{row.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-soft"><MapPin size={14} className="shrink-0 text-petrol-800" /><Link href={`/universities/${row.universitySlug}`} className="font-bold text-petrol-800 hover:underline">{row.universityName}</Link>, {row.city}</p>
                {row.summary.length ? <ul className="mt-4 space-y-2 text-[15px] leading-6 text-slate-700">{row.summary.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-1 shrink-0 text-lime-deep" />{item}</li>)}</ul> : <p className="mt-4 text-[15px] leading-6 text-ink-mute">Coverage not recorded yet. Ask a counselor for the current published terms.</p>}
                {row.eligiblePrograms.length > 0 && <p className="mt-3 text-[14px] leading-5 text-ink-mute"><strong>For:</strong> {row.eligiblePrograms.slice(0, 3).join('; ')}{row.eligiblePrograms.length > 3 && ` and ${row.eligiblePrograms.length - 3} more`}</p>}
                {row.renewal && <p className="mt-2 text-[14px] leading-5 text-ink-mute"><strong>Renewal:</strong> {row.renewal}</p>}
                <p className="mt-4 flex gap-2 text-[15px] text-ink-soft"><CalendarClock size={16} className="mt-0.5 shrink-0 text-petrol-800" />{row.deadline || 'Deadline not recorded'}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link href={`/universities/${row.universitySlug}#costs`} className="ed-btn ed-btn-signal min-h-11 w-full text-[15px]">Cost after scholarship <ArrowRight size={15} /></Link>
                  {row.sourceUrl ? <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-11 gap-1.5 px-4 text-[15px]">Source <ExternalLink size={14} /></a> : <span className="inline-flex min-h-11 items-center px-1 text-[14px] text-ink-mute">Source link pending</span>}
                </div>
              </li>
            ))}
          </ul>
          {visible < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisible(value => value + PAGE)} className="ed-btn ed-btn-outline min-h-[52px] px-7">Show {Math.min(PAGE, filtered.length - visible)} more scholarships</button></div>}
        </> : <p className="mt-6 rounded-3xl border border-dashed border-petrol-800/30 bg-white px-6 py-12 text-center text-[15px] text-ink-soft">No recorded scholarship matches these filters. Try another city or include passed deadlines.</p>}
      </div>
    </section>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, Plus, Search, X } from 'lucide-react';
import { FEE_LABELS, FIRST_YEAR_FEES, firstYearEstimate, type FeeCategory, type FeeRow, type ProgramRow } from '@/lib/catalog-views';

const MAX = 3;
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 });
const fieldClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] font-semibold text-petrol-800 outline-none focus:border-petrol-800 focus:ring-4 focus:ring-lime/50';

type Props = { programs: ProgramRow[]; fees: Record<string, FeeRow[]> };

function FeeCell({ fees }: { fees: FeeRow[] }) {
  if (!fees.length) return <span className="text-slate-400">Not recorded</span>;
  return <ul className="space-y-1.5">{fees.map((fee, index) => <li key={index}><span className="font-semibold text-petrol-800">{fee.cost}</span>{fees.length > 1 && <span className="block text-[14px] text-ink-mute">{fee.item}</span>}{fee.sourceUrl && <a href={fee.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center text-petrol-800" aria-label={`Source for ${fee.item}`}><ExternalLink size={12} /></a>}</li>)}</ul>;
}

export default function CostCompare({ programs, fees }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [rate, setRate] = useState('');
  const selectedKeys = useMemo(() => (searchParams.get('p') || '').split(',').filter(key => programs.some(row => row.key === key)).slice(0, MAX), [searchParams, programs]);
  const selected = selectedKeys.flatMap(key => programs.find(row => row.key === key) || []);
  const bdtRate = /^\d+(\.\d+)?$/.test(rate.trim()) && Number(rate) > 0 ? Number(rate) : null;

  const setSelection = (keys: string[]) => {
    const next = new URLSearchParams(window.location.search);
    if (keys.length) next.set('p', keys.join(',')); else next.delete('p');
    window.history.replaceState(null, '', `${pathname}${next.size ? `?${next}` : ''}`);
  };
  const add = (key: string) => { setSelection([...selectedKeys, key].slice(0, MAX)); setQuery(''); };
  const remove = (key: string) => setSelection(selectedKeys.filter(item => item !== key));

  const suggestions = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (text.length < 2) return [];
    return programs.filter(row => !selectedKeys.includes(row.key) && `${row.name} ${row.universityName} ${row.city} ${row.level}`.toLowerCase().includes(text)).slice(0, 8);
  }, [query, programs, selectedKeys]);

  const columns = selected.map(program => {
    const universityFees = fees[program.universitySlug] || [];
    return { program, universityFees, estimate: firstYearEstimate(program, universityFees) };
  });
  const byCategory = (list: FeeRow[], category: FeeCategory) => list.filter(fee => fee.category === category);

  return (
    <section aria-label="First-year cost comparison" className="bg-canvas-soft py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-petrol-800/15 bg-white p-4 sm:p-5 md:grid-cols-[2fr_1fr]">
          <div className="relative">
            <label htmlFor="cost-search" className="text-[14px] font-bold text-ink-soft">Add a program ({selected.length}/{MAX})</label>
            <span className="relative mt-1.5 block"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="cost-search" type="search" value={query} onChange={event => setQuery(event.target.value)} disabled={selected.length >= MAX} placeholder={selected.length >= MAX ? 'Remove one to add another' : 'Type a program or university, e.g. Computer Science'} className={`${fieldClass} pl-11 disabled:bg-slate-50`} autoComplete="off" /></span>
            {suggestions.length > 0 && <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">{suggestions.map(row => <li key={row.key}><button type="button" onClick={() => add(row.key)} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-canvas-soft"><Plus size={16} className="mt-0.5 shrink-0 text-petrol-800" /><span><strong className="block text-[15px]">{row.name} <span className="font-semibold text-ink-mute">· {row.level}</span></strong><span className="text-[14px] text-ink-soft">{row.universityName}, {row.city} · {row.tuitionLabel || 'Tuition not recorded'}</span></span></button></li>)}</ul>}
          </div>
          <label className="block text-[14px] font-bold text-ink-soft">Your BDT rate for 1 CNY (optional)<input inputMode="decimal" value={rate} onChange={event => setRate(event.target.value.replace(/[^\d.]/g, ''))} placeholder="Enter today's rate" className={`${fieldClass} mt-1.5`} /></label>
        </div>

        {columns.length === 0 ? <div className="mt-7 rounded-3xl border border-dashed border-petrol-800/30 bg-white px-6 py-14 text-center"><h2 className="font-display text-2xl font-bold">Add up to three programs to compare</h2><p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-ink-soft">Search above, or pick programs in the <Link href="/programs" className="font-bold text-petrol-800 underline">program finder</Link> first. You will see tuition and every recorded first-year fee side by side.</p></div> : (
          <div className="mt-7 overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <caption className="sr-only">First-year costs for selected programs, in CNY as recorded</caption>
              <thead><tr className="border-b border-slate-200 align-top"><th scope="col" className="w-44 p-4 text-[14px] font-bold text-ink-mute">Program</th>{columns.map(({ program }) => <th key={program.key} scope="col" className="p-4"><div className="flex items-start justify-between gap-2"><div><span className="block text-base font-black text-petrol-800">{program.name}</span><Link href={`/universities/${program.universitySlug}`} className="text-[15px] font-bold text-petrol-800 hover:underline">{program.universityName}</Link><span className="block text-[14px] font-semibold text-ink-mute">{program.level} · {program.city}</span></div><button type="button" onClick={() => remove(program.key)} aria-label={`Remove ${program.name}`} className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-slate-100"><X size={16} /></button></div></th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 align-top">
                <tr><th scope="row" className="p-4 font-bold">Tuition (per year)</th>{columns.map(({ program }) => <td key={program.key} className="p-4"><span className="font-semibold text-petrol-800">{program.tuitionLabel || 'Not recorded'}</span>{program.sourceUrl && <a href={program.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex text-petrol-800" aria-label="Tuition source"><ExternalLink size={12} /></a>}</td>)}</tr>
                {FIRST_YEAR_FEES.map(category => <tr key={category}><th scope="row" className="p-4 font-bold">{FEE_LABELS[category]}</th>{columns.map(({ program, universityFees }) => <td key={program.key} className="p-4"><FeeCell fees={byCategory(universityFees, category)} /></td>)}</tr>)}
                {columns.some(({ universityFees }) => byCategory(universityFees, 'other').length) && <tr><th scope="row" className="p-4 font-bold">{FEE_LABELS.other}<span className="block text-[14px] font-semibold text-ink-mute">Not added to the total</span></th>{columns.map(({ program, universityFees }) => <td key={program.key} className="p-4"><FeeCell fees={byCategory(universityFees, 'other')} /></td>)}</tr>}
                <tr className="bg-petrol-800 text-white"><th scope="row" className="p-4 font-black">First-year estimate</th>{columns.map(({ program, estimate }) => <td key={program.key} className="p-4">{estimate.total !== null ? <><strong className="text-xl">CNY {number(estimate.total)}</strong>{bdtRate && <span className="block text-[15px] text-white/80">≈ BDT {number(estimate.total * bdtRate)}</span>}</> : <><span className="flex items-center gap-1.5 font-black"><AlertTriangle size={16} className="text-amber-300" />Incomplete</span><span className="mt-1 block text-[14px] leading-5 text-white/80">Confirm: {estimate.unclear.join(', ')}</span>{estimate.partial > 0 && <span className="mt-1 block text-[14px] text-white/80">Clear items so far: CNY {number(estimate.partial)}</span>}</>}{estimate.missing.length > 0 && <span className="mt-1 block text-[14px] leading-5 text-white/70">Not recorded: {estimate.missing.join(', ')}</span>}</td>)}</tr>
              </tbody>
            </table>
          </div>
        )}
        {columns.length > 0 && <p className="mt-4 text-[14px] leading-5 text-ink-mute">Figures are copied from recorded university fee schedules and may be out of date. A total appears only when tuition and every recorded first-year fee is one explicit CNY amount; ranges, room choices and unclear periods are left for you to confirm. Living costs, flights, visa and EduExpress service charges are not included. <Link href="/fees-and-transparency" className="font-bold text-petrol-800 underline">How we separate our fees</Link>.</p>}
      </div>
    </section>
  );
}

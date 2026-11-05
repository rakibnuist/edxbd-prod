'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react';
import type { ChinaMbbsGuide } from '@/lib/china-mbbs-guide';
import { mbbsApplyHref } from '@/lib/mbbs-enquiry';

type University = ChinaMbbsGuide['universities'][number];
const money = (amount: number) => new Intl.NumberFormat('en-US').format(amount);
const control = 'min-h-[50px] w-full rounded-xl border border-petrol-800 bg-white text-[16px] text-petrol-800 focus:outline-none focus:ring-4 focus:ring-lime/60';
const label = 'mb-1.5 block text-[14px] font-semibold text-petrol-800';
export default function MbbsUniversityFinder({ universities }: { universities: University[] }) {
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState('all');
  const [funding, setFunding] = useState(false);
  const [sort, setSort] = useState('fees');
  const filtered = useMemo(() => universities.filter(item => {
    const matches = `${item.name} ${item.acronym} ${item.city} ${item.highlight}`.toLowerCase().includes(query.trim().toLowerCase());
    return matches && (budget === 'all' || item.tuition <= Number(budget)) && (!funding || item.funding);
  }).sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : a.tuition - b.tuition), [universities, query, budget, funding, sort]);
  const reset = () => { setQuery(''); setBudget('all'); setFunding(false); setSort('fees'); };
  return <div>
    <form onSubmit={event => event.preventDefault()} role="search" aria-label="Find an MBBS university" className="rounded-3xl bg-canvas-soft p-5 sm:p-6">
      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><label htmlFor="mbbs-search" className={label}>University or city</label><div className="relative"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true"/><input id="mbbs-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Wenzhou, Shanghai or CQMU" className={`${control} pl-11 pr-4 placeholder:text-ink-mute`}/></div></div>
        <div><label htmlFor="mbbs-budget" className={label}>Annual tuition budget</label><select id="mbbs-budget" value={budget} onChange={event => setBudget(event.target.value)} className={`${control} px-4`}><option value="all">All tuition fees</option><option value="35000">Up to CNY 35,000</option><option value="45000">Up to CNY 45,000</option></select></div>
        <div><label htmlFor="mbbs-sort" className={label}>Sort by</label><select id="mbbs-sort" value={sort} onChange={event => setSort(event.target.value)} className={`${control} px-4`}><option value="fees">Tuition: low to high</option><option value="name">University name</option></select></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px] font-medium text-petrol-800"><input type="checkbox" checked={funding} onChange={event => setFunding(event.target.checked)} className="size-5 accent-petrol-800"/>Show published freshman award examples</label><button type="button" onClick={reset} className="min-h-[44px] text-[15px] font-semibold text-petrol-800 underline-offset-4 hover:underline">Reset filters</button></div>
    </form>
    <p role="status" aria-live="polite" className="my-5 text-[15px] text-ink-soft">{filtered.length} university {filtered.length === 1 ? 'option' : 'options'} · English-taught MBBS · Tuition before scholarship</p>
    <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map(item => <article key={item.id} id={`mbbs-${item.id}`} className="scroll-mt-32 overflow-hidden rounded-3xl border border-canvas-soft bg-white">
        <div className="p-6"><div className="flex min-h-[60px] items-start gap-3">{item.logo && <Image src={item.logo} alt={`${item.name} logo`} width={56} height={56} className="size-14 shrink-0 rounded-2xl border border-canvas-soft bg-white object-contain p-1.5"/>}<div><h3 className="text-[18px] font-semibold leading-6 text-petrol-800">{item.name}</h3><p className="mt-1 inline-flex items-center gap-1 text-[14px] text-ink-soft"><MapPin size={14} aria-hidden="true"/>{item.city}, China</p></div></div>
          <p className={`mt-4 min-h-11 rounded-2xl px-3.5 py-2.5 text-[14px] font-semibold leading-5 ${item.funding ? 'bg-lime-pale text-lime-deep' : 'bg-canvas-soft text-petrol-800'}`}>{item.highlight}</p>
          <dl className="mt-5"><dt className="text-[14px] text-ink-soft">Annual tuition</dt><dd className="mt-1 font-display text-[30px] font-black leading-none tracking-[-0.01em] text-petrol-800">CNY {money(item.tuition)}<span className="ml-1 font-sans text-[14px] font-normal tracking-normal text-ink-soft">/year</span></dd></dl>
          <p className="mt-2 text-[14px] text-ink-soft">{item.duration} · {item.medium} · Clinical Medicine</p>
          {item.profileSlug && <Link href={`/universities/${item.profileSlug}#programs`} className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-semibold text-petrol-800 underline-offset-4 hover:underline">View university profile<ArrowRight size={15} aria-hidden="true"/></Link>}
          <Link href={mbbsApplyHref(item.name)} className="ed-btn ed-btn-signal mt-3 min-h-[48px] w-full justify-between">Apply for MBBS<ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
        <details className="group border-t border-canvas-soft"><summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-2 px-6 py-3 text-[15px] font-semibold text-petrol-800 [&::-webkit-details-marker]:hidden">View programme details<ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transform-none" aria-hidden="true"/></summary><dl className="space-y-4 px-6 pb-6 text-[15px] leading-6 text-ink-soft">{[['Accommodation',item.housing],['Other charges',item.expenses],['Academic entry',item.admission],['English & language',item.language],['CSCA subjects',item.csca],['Scholarship & funding',item.scholarship]].map(([term,body]) => <div key={term}><dt className="font-semibold text-petrol-800">{term}</dt><dd className="mt-1">{body}</dd></div>)}</dl></details>
      </article>)}
    </div>
    {filtered.length === 0 && <div className="rounded-3xl border border-dashed border-petrol-800/30 p-8 text-center"><p className="text-[16px] font-semibold text-petrol-800">Try a wider tuition budget or another city.</p><button type="button" onClick={reset} className="ed-btn ed-btn-soft mt-4 min-h-[48px] px-6">Show all universities</button></div>}
  </div>;
}

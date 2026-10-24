'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react';
import type { ChinaMbbsGuide } from '@/lib/china-mbbs-guide';
import { mbbsApplyHref } from '@/lib/mbbs-enquiry';

type University = ChinaMbbsGuide['universities'][number];
const money = (amount: number) => new Intl.NumberFormat('en-US').format(amount);
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
    <form onSubmit={event => event.preventDefault()} role="search" aria-label="Find an MBBS university" className="mt-6 rounded-xl border border-[#d7e2ea] bg-[#f4f8fa] p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><label htmlFor="mbbs-search" className="mb-2 block text-xs font-semibold">University or city</label><div className="relative"><Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/><input id="mbbs-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Wenzhou, Shanghai or CQMU" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 outline-offset-2 focus:outline-[#174f7a]"/></div></div>
        <div><label htmlFor="mbbs-budget" className="mb-2 block text-xs font-semibold">Annual tuition budget</label><select id="mbbs-budget" value={budget} onChange={event => setBudget(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"><option value="all">All tuition fees</option><option value="35000">Up to CNY 35,000</option><option value="45000">Up to CNY 45,000</option></select></div>
        <div><label htmlFor="mbbs-sort" className="mb-2 block text-xs font-semibold">Sort by</label><select id="mbbs-sort" value={sort} onChange={event => setSort(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"><option value="fees">Tuition: low to high</option><option value="name">University name</option></select></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={funding} onChange={event => setFunding(event.target.checked)} className="size-4 accent-[#17624f]"/>Show published freshman award examples</label><button type="button" onClick={reset} className="min-h-10 text-xs font-semibold text-[#174f7a] hover:underline">Reset filters</button></div>
    </form>
    <p role="status" aria-live="polite" className="my-4 text-xs text-slate-500">{filtered.length} university {filtered.length === 1 ? 'option' : 'options'} · English-taught MBBS · Tuition before scholarship</p>
    <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map(item => <article key={item.id} id={`mbbs-${item.id}`} className="scroll-mt-40 overflow-hidden rounded-xl border border-[#d7e2ea] bg-white">
        <div className="p-5"><div className="flex min-h-[60px] items-start gap-3">{item.logo && <Image src={item.logo} alt={`${item.name} logo`} width={52} height={52} className="size-[52px] shrink-0 rounded-lg border border-slate-100 object-contain p-1"/>}<div><h3 className="text-base font-bold leading-6">{item.name}</h3><p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500"><MapPin size={12}/>{item.city}, China</p></div></div>
          <p className={`mt-4 min-h-11 rounded-lg px-3 py-2 text-xs font-semibold leading-5 ${item.funding ? 'bg-[#eaf4ed] text-[#17624f]' : 'bg-[#edf4f8] text-[#174f7a]'}`}>{item.highlight}</p>
          <dl className="mt-4"><dt className="text-xs text-slate-500">Annual tuition</dt><dd className="mt-1 text-[26px] font-bold tracking-tight">CNY {money(item.tuition)}<span className="ml-1 text-xs font-normal tracking-normal text-slate-500">/year</span></dd></dl>
          <p className="mt-2 text-xs text-slate-500">{item.duration} · {item.medium} · Clinical Medicine</p>
          {item.profileSlug && <Link href={`/universities/${item.profileSlug}#programs`} className="mt-2 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#174f7a] hover:underline">View university profile<ArrowRight size={14}/></Link>}
          <Link href={mbbsApplyHref(item.name)} className="mt-4 inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-lg bg-[#174f7a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0b2f4a]">Apply for MBBS<ArrowRight size={16}/></Link>
        </div>
        <details className="group border-t border-slate-200"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-5 py-3 text-xs font-bold text-[#174f7a] [&::-webkit-details-marker]:hidden">View programme details<ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transform-none"/></summary><dl className="space-y-4 px-5 pb-5 text-xs leading-6 text-slate-600">{[['Accommodation',item.housing],['Other charges',item.expenses],['Academic entry',item.admission],['English & language',item.language],['CSCA subjects',item.csca],['Scholarship & funding',item.scholarship]].map(([label,body]) => <div key={label}><dt className="font-bold text-[#0b2f4a]">{label}</dt><dd className="mt-1">{body}</dd></div>)}</dl></details>
      </article>)}
    </div>
    {filtered.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-7 text-center"><p className="text-sm font-semibold">Try a wider tuition budget or another city.</p><button onClick={reset} className="mt-3 min-h-11 text-sm font-bold text-[#174f7a] underline">Show all universities</button></div>}
  </div>;
}

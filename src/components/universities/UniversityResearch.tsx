import Link from 'next/link';
import { ExternalLink, BookOpenCheck } from 'lucide-react';
import type { UniversityResearch as Research } from '@/lib/university-research';

export default function UniversityResearch({ research }: { research: Research }) {
  return <section id="official-research" className="scroll-mt-28 border-b border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-[1240px]">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#174f7a]"><BookOpenCheck size={17} />Official university research</p>
      <h2 className="mt-3 font-heading text-3xl font-bold">Understand {research.name}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{research.overview}</p>
      <p className="mt-4 rounded-xl bg-sky-50 px-4 py-3 text-sm font-semibold text-[#174f7a]">{research.cycle}</p>
      <p className="mt-3 text-xs leading-6 text-slate-500">This research does not verify every legacy listing or confirm an open intake.</p>
      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <div><h3 className="text-xl font-bold">Academic and application details</h3><dl className="mt-4 divide-y divide-slate-100">{research.facts.map(([label, value]) => <div key={label} className="py-4 text-sm"><dt className="font-bold">{label}</dt><dd className="mt-1 leading-6 text-slate-600">{value}</dd></div>)}</dl></div>
        <div><h3 className="text-xl font-bold">Published costs and scope</h3>{research.fees.length ? <div className="mt-4 overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><caption className="sr-only">Official cost examples for {research.name}, for the cycle shown above</caption><thead className="bg-slate-50"><tr><th className="p-3">Item</th><th className="p-3">Published amount</th></tr></thead><tbody>{research.fees.map(([label, value]) => <tr key={label} className="border-t border-slate-100"><th scope="row" className="p-3 font-medium">{label}</th><td className="p-3 leading-6 text-slate-600">{value}</td></tr>)}</tbody></table></div> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">A complete current fee schedule was not confirmed in this research. Request it from the university before budgeting or payment.</p>}<p className="mt-3 text-xs leading-6 text-slate-500">CNY and RMB refer to Chinese yuan. Listed items do not constitute a complete first-year total or a scholarship offer. Confirm the selected program, fee period, refund terms and current notice.</p></div>
      </div>
      <div className="mt-7 grid gap-6 rounded-2xl bg-[#f7fafc] p-5 md:grid-cols-2"><div><h3 className="font-bold">Check before choosing</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{research.checks.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3 className="font-bold">Go to the official sources</h3><ul className="mt-3 space-y-3">{research.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-2 text-sm font-semibold text-[#174f7a] underline underline-offset-4">{source.label}<ExternalLink size={14} className="mt-1 shrink-0" /></a></li>)}</ul></div></div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#174f7a]"><Link href="/china-universities" className="underline">Compare China universities</Link><Link href="/study-in-china-cost-bangladesh" className="underline">Plan all study costs</Link><Link href="/china-visa-first-policy" className="underline">Read service and payment terms</Link></div>
    </div>
  </section>;
}

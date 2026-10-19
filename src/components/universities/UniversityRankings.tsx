import { ArrowUpRight, Globe2, GraduationCap, Trophy } from 'lucide-react';
import type { UniversityRanking } from '@/lib/university-rankings';

const scopeLabels = { world: 'Overall world ranking', subject: 'Global subject ranking', national: 'China ranking' };

export default function UniversityRankings({ rankings }: { rankings: UniversityRanking[] }) {
  const hasWorldRanking = rankings.some(ranking => ranking.scope === 'world');

  return <section id="rankings" aria-labelledby="rankings-heading" className="scroll-mt-32 border-b border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-[1240px]">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#174f7a]"><Trophy size={17} aria-hidden="true" />University rankings</p>
      <h2 id="rankings-heading" className="mt-3 font-heading text-3xl font-bold text-slate-950">World standing, with the source</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">Compare the publisher, edition and scope together. A rank band is a published range; an equals sign means a shared rank.</p>
      {!hasWorldRanking && <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">A sourced world ranking is not available for this profile. This does not mean the university is unrecognised or unsuitable for your subject.</p>}
      {rankings.length > 0 && <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rankings.map(ranking => <article key={`${ranking.publisher}-${ranking.rankingName}-${ranking.year}-${ranking.subject ?? 'all'}`} className={`flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${ranking.scope === 'world' ? 'border-[#174f7a]/20 bg-[#f2f7fb]' : 'border-slate-200 bg-white'}`}>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174f7a]">{ranking.scope === 'world' ? <Globe2 size={15} aria-hidden="true" /> : <GraduationCap size={15} aria-hidden="true" />}{scopeLabels[ranking.scope]}</p>
        <p className="mt-5 break-words font-heading text-4xl font-bold tracking-tight text-slate-950">{ranking.rank}<span className="ml-2 text-base font-medium text-slate-500">/ {ranking.year}</span></p>
        <h3 className="mt-3 text-base font-bold text-slate-900">{ranking.publisher}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{ranking.rankingName}</p>
        {ranking.subject && <p className="mt-2 text-sm font-semibold text-[#174f7a]">{ranking.subject}</p>}
        {ranking.note && <p className="mt-3 text-xs leading-6 text-slate-500">{ranking.note}</p>}
        <a href={ranking.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-[#174f7a] underline underline-offset-4 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">View publisher source<span className="sr-only"> for {ranking.subject || ranking.rankingName}, {ranking.year} (opens in a new tab)</span><ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>)}</div>}
      <p className="mt-5 max-w-4xl text-xs leading-6 text-slate-500">Subject and China rankings describe a different scope from an overall world ranking. Rankings use different methods and do not establish degree recognition, professional licensing eligibility or an admission offer.</p>
    </div>
  </section>;
}

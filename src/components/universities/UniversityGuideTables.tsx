import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { feeText } from '@/lib/university-profile-view';
import { scholarshipReductionLabel } from '@/lib/university-scholarship-view';

/** These reference tables render every course and funding route in initial HTML. */
export function UniversityProgramTable({ programs, onChoose }: { programs: UniversityProgramDetail[]; onChoose: (id: string) => void }) {
  const table = (rows: UniversityProgramDetail[]) => <div className="overflow-x-auto"><table className="block w-full text-left text-sm sm:table sm:min-w-[560px]"><caption className="sr-only">Programs, teaching languages, duration and tuition before scholarship</caption><thead className="hidden border-y border-slate-200 bg-[#f2f6f7] text-xs text-slate-500 sm:table-header-group"><tr><th scope="col" className="px-4 py-3 font-medium">Program</th><th scope="col" className="px-3 py-3 font-medium">Duration / language</th><th scope="col" className="px-4 py-3 text-right font-medium">Tuition</th></tr></thead><tbody className="block sm:table-row-group">{rows.map(program => { const fee = program.fees.find(item => item.key === 'tuition' && !item.optional); return <tr id={`course-${encodeURIComponent(program.id)}`} key={program.id} className="grid scroll-mt-48 grid-cols-2 border-b border-slate-200 last:border-0 sm:table-row sm:border-slate-100"><th scope="row" className="col-span-2 block px-4 pb-2 pt-4 font-medium sm:table-cell sm:py-4"><button type="button" onClick={() => onChoose(program.id)} className="text-left leading-6 text-[#174f7a] underline-offset-4 hover:underline">{program.name}</button><span className="mt-1 block text-xs font-normal text-slate-500">{program.level}</span></th><td className="block px-4 pb-4 text-xs leading-6 text-slate-600 sm:table-cell sm:px-3 sm:py-4">{program.duration}<span className="block">{program.languages.join(' / ')}</span></td><td className="block px-4 pb-4 text-right text-xs font-semibold leading-6 tabular-nums text-[#102b40] sm:table-cell sm:py-4"><span className="block font-normal text-slate-500 sm:hidden">Tuition</span>{fee ? feeText(fee) : 'Request a fee plan'}</td></tr>; })}</tbody></table></div>;
  return <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">{table(programs.slice(0, 8))}{programs.length > 8 && <details className="border-t border-slate-200"><summary className="cursor-pointer px-4 py-4 text-sm font-semibold text-[#174f7a]">View all {programs.length} study options</summary>{table(programs.slice(8))}</details>}</div>;
}

export function UniversityFundingTable({ options, onChoose }: { options: UniversityScholarshipOption[]; onChoose: (option: UniversityScholarshipOption) => void }) {
  return <div className="mt-6 divide-y divide-[#d8e6df] overflow-hidden rounded-xl border border-[#d8e6df] bg-[#f1f7f3]">{options.map(option => <div key={option.id} className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3 p-4 sm:p-5"><div className="max-w-md"><h3 className="text-sm font-semibold leading-6 text-[#164e3e]">{option.title}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{option.levels.join(' · ')}</p></div><button type="button" onClick={() => onChoose(option)} className="text-left text-sm font-bold leading-6 text-[#17624f] underline-offset-4 hover:underline">{scholarshipReductionLabel(option) || option.coverage[0] || 'Explore coverage'}</button></div>)}</div>;
}

export function UniversityEntrySummary({ programs, selectedId }: { programs: UniversityProgramDetail[]; selectedId: string }) {
  const groups = new Map<string, { ids: string[]; names: string[]; qualifications: string[]; languageRequirements: string[] }>();
  for (const program of programs) {
    if (!program.qualifications.length && !program.languageRequirements.length) continue;
    const key = JSON.stringify([program.level, program.qualifications, program.languageRequirements]);
    const group = groups.get(key);
    if (group) { group.names.push(program.name); group.ids.push(program.id); }
    else groups.set(key, { ids: [program.id], names: [`${program.level} · ${program.name}`], qualifications: program.qualifications, languageRequirements: program.languageRequirements });
  }
  return <div className="mt-5 divide-y divide-slate-200">{[...groups.values()].map((group, index) => <details key={index} open={group.ids.includes(selectedId) || (!selectedId && index === 0)} className="py-3"><summary className="cursor-pointer py-2 text-sm font-semibold leading-6 text-[#102b40]">{group.names.join(' / ')}</summary><ul className="space-y-2 pb-3 pt-2">{[...group.qualifications, ...group.languageRequirements].map((item, i) => <li key={i} className="border-l-2 border-[#cbdde3] pl-4 text-sm leading-7 text-slate-600">{item}</li>)}</ul></details>)}</div>;
}

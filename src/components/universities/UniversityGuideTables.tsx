import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { feeText } from '@/lib/university-profile-view';
import { scholarshipReductionLabel } from '@/lib/university-scholarship-view';

/** These reference tables render every course and funding route in initial HTML. */
export function UniversityProgramTable({ programs, onChoose }: { programs: UniversityProgramDetail[]; onChoose: (id: string) => void }) {
  // Lean row markup (styles live in .ptable in globals.css): catalogues can hold 500+ programmes.
  const table = (rows: UniversityProgramDetail[]) => <div className="overflow-x-auto"><table className="ptable"><caption className="sr-only">Programs, teaching languages, duration and tuition before scholarship</caption><thead><tr><th scope="col">Program</th><th scope="col">Duration / language</th><th scope="col">Tuition</th></tr></thead><tbody>{rows.map(program => { const fee = program.fees.find(item => item.key === 'tuition' && !item.optional); return <tr id={`course-${encodeURIComponent(program.id)}`} key={program.id}><th scope="row"><button type="button" onClick={() => onChoose(program.id)}>{program.name}</button><span>{program.level}</span></th><td>{program.duration}<span>{program.languages.join(' / ')}</span></td><td><span>Tuition</span>{fee ? feeText(fee) : 'Request a fee plan'}</td></tr>; })}</tbody></table></div>;
  return <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">{table(programs.slice(0, 8))}{programs.length > 8 && <details className="border-t border-slate-200"><summary className="cursor-pointer px-4 py-4 text-sm font-semibold text-[#12436b]">View all {programs.length} study options</summary>{table(programs.slice(8))}</details>}</div>;
}

export function UniversityFundingTable({ options, onChoose }: { options: UniversityScholarshipOption[]; onChoose: (option: UniversityScholarshipOption) => void }) {
  return <div className="mt-6 divide-y divide-[#e3f0f9] overflow-hidden rounded-xl border border-[#e3f0f9] bg-[#f1f5f9]">{options.map(option => <div key={option.id} className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3 p-4 sm:p-5"><div className="max-w-md"><h3 className="text-sm font-semibold leading-6 text-[#0b2b45]">{option.title || option.type || 'Scholarship option'}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{option.levels.join(' · ')}</p></div><button type="button" onClick={() => onChoose(option)} className="text-left text-sm font-bold leading-6 text-[#276b55] underline-offset-4 hover:underline">{scholarshipReductionLabel(option) || option.coverage[0] || 'Explore coverage'}</button></div>)}</div>;
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
  return <div className="mt-5 divide-y divide-slate-200">{[...groups.values()].map((group, index) => <details key={index} open={group.ids.includes(selectedId) || (!selectedId && index === 0)} className="py-3"><summary className="cursor-pointer py-2 text-sm font-semibold leading-6 text-[#14212e]">{group.names.join(' / ')}</summary><ul className="space-y-2 pb-3 pt-2">{[...group.qualifications, ...group.languageRequirements].map((item, i) => <li key={i} className="border-l-2 border-[#cfe7f5] pl-4 text-sm leading-7 text-slate-600">{item}</li>)}</ul></details>)}</div>;
}

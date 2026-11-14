import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { feeText } from '@/lib/university-profile-view';
import { scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import { ArrowRight, Clock, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

/** Modern program catalogue table with clean row hierarchy and interactive actions. */
export function UniversityProgramTable({
  programs,
  onChoose,
}: {
  programs: UniversityProgramDetail[];
  onChoose: (id: string) => void;
}) {
  const table = (rows: UniversityProgramDetail[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Programs, teaching languages, duration and tuition before scholarship</caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th scope="col" className="px-5 py-3.5">Degree & Major</th>
            <th scope="col" className="px-4 py-3.5">Duration & Medium</th>
            <th scope="col" className="px-5 py-3.5 text-right">Annual Tuition</th>
            <th scope="col" className="px-4 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((program) => {
            const fee = program.fees.find((item) => item.key === 'tuition' && !item.optional);
            return (
              <tr
                id={`course-${encodeURIComponent(program.id)}`}
                key={program.id}
                className="group transition-colors hover:bg-slate-50/70"
              >
                <th scope="row" className="px-5 py-4 font-normal">
                  <button
                    type="button"
                    onClick={() => onChoose(program.id)}
                    className="text-left font-bold text-slate-900 group-hover:text-emerald-800 transition-colors block text-[15px]"
                  >
                    {program.name}
                  </button>
                  <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    {program.level}
                  </span>
                </th>
                <td className="px-4 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>{program.duration || 'Standard duration'}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                    <Globe2 size={13} className="text-slate-400 shrink-0" />
                    <span>{program.languages.join(' / ') || 'English'}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="block text-sm font-bold tabular-nums text-slate-900">
                    {fee ? feeText(fee) : 'Request fee plan'}
                  </span>
                  <span className="block text-[11px] text-slate-400">official gross fee</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onChoose(program.id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-petrol-800 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 shadow-xs"
                  >
                    Select <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs">
      {table(programs.slice(0, 10))}
      {programs.length > 10 && (
        <details className="border-t border-slate-200 bg-slate-50/60">
          <summary className="cursor-pointer px-5 py-3.5 text-xs font-bold text-petrol-800 hover:text-emerald-700">
            View all {programs.length} programs at this institution ↓
          </summary>
          {table(programs.slice(10))}
        </details>
      )}
    </div>
  );
}

export function UniversityFundingTable({
  options,
  onChoose,
}: {
  options: UniversityScholarshipOption[];
  onChoose: (option: UniversityScholarshipOption) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <div
          key={option.id}
          className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 transition-all hover:border-emerald-300 hover:shadow-xs"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles size={14} className="text-emerald-700" />
              <span>{option.type || 'Scholarship Award'}</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
              {option.title || 'Institutional Scholarship'}
            </h3>
            {option.levels.length > 0 && (
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Eligible Levels: {option.levels.join(' · ')}
              </p>
            )}
            {option.coverage.length > 0 && (
              <p className="mt-2.5 text-xs font-semibold text-emerald-900 leading-relaxed bg-white/80 rounded-xl p-2.5 border border-emerald-100/60">
                {option.coverage.join(' ')}
              </p>
            )}
          </div>
          <div className="mt-4 border-t border-emerald-100/80 pt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">
              {scholarshipReductionLabel(option) || 'Full or Partial Waiver'}
            </span>
            <button
              type="button"
              onClick={() => onChoose(option)}
              className="inline-flex items-center gap-1 text-xs font-bold text-petrol-800 hover:text-emerald-700 hover:underline"
            >
              View Eligible Programs <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UniversityEntrySummary({
  programs,
  selectedId,
}: {
  programs: UniversityProgramDetail[];
  selectedId: string;
}) {
  const groups = new Map<string, { ids: string[]; names: string[]; qualifications: string[]; languageRequirements: string[] }>();
  for (const program of programs) {
    if (!program.qualifications.length && !program.languageRequirements.length) continue;
    const key = JSON.stringify([program.level, program.qualifications, program.languageRequirements]);
    const group = groups.get(key);
    if (group) {
      group.names.push(program.name);
      group.ids.push(program.id);
    } else {
      groups.set(key, {
        ids: [program.id],
        names: [`${program.level} · ${program.name}`],
        qualifications: program.qualifications,
        languageRequirements: program.languageRequirements,
      });
    }
  }

  return (
    <div className="space-y-3">
      {[...groups.values()].map((group, index) => {
        const isOpen = group.ids.includes(selectedId) || (!selectedId && index === 0);
        return (
          <details
            key={index}
            open={isOpen}
            className="rounded-2xl border border-slate-200/90 bg-white p-4.5 transition-all"
          >
            <summary className="cursor-pointer text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>
                {group.names.slice(0, 3).join(' / ')}
                {group.names.length > 3 ? ` (+${group.names.length - 3} more)` : ''}
              </span>
            </summary>
            <ul className="mt-3.5 space-y-2 border-t border-slate-100 pt-3">
              {[...group.qualifications, ...group.languageRequirements].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs leading-5 text-slate-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

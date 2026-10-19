'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import { filterProgramRows, programFilterChoices } from '@/lib/university-program-filters';
import type { UniversityProgramDetail } from '@/types/university-profile';

const labels: Record<ProgramLevel, string> = { Bachelor: "Bachelor’s", Master: "Master’s", PhD: 'PhD', Language: 'Language', Foundation: 'Foundation', Diploma: 'Diploma' };

export default function UniversityPrograms({ name, programs, level, query, selectedId, onLevel, onQuery, onProgram }: {
  name: string; programs: UniversityProgramDetail[]; level: ProgramLevel; query: string; selectedId: string;
  onLevel: (level: ProgramLevel) => void; onQuery: (query: string) => void; onProgram: (id: string) => void;
}) {
  const id = useId();
  const [majorChoice, setMajorChoice] = useState({ level, value: '' });
  const [medium, setMedium] = useState('');
  const major = majorChoice.level === level ? majorChoice.value : '';
  const levelRows = programs.filter(program => normalizeProgramLevel(program.level) === level);
  const majors = programFilterChoices(levelRows.map(program => program.name));
  const media = programFilterChoices(programs.flatMap(program => program.languages));
  const visibleCount = filterProgramRows(levelRows, { major, medium, query }).length;
  const hasFilters = Boolean(major || medium || query.trim());
  const controlClass = 'min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-800 outline-none focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/15';
  const chooseLevel = (next: ProgramLevel) => {
    setMajorChoice({ level: next, value: '' });
    onLevel(next);
  };
  const resetFilters = () => {
    setMajorChoice({ level, value: '' });
    setMedium('');
    onQuery('');
  };
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % PROGRAM_LEVELS.length;
    else if (event.key === 'ArrowLeft') next = (index + PROGRAM_LEVELS.length - 1) % PROGRAM_LEVELS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = PROGRAM_LEVELS.length - 1;
    else return;
    event.preventDefault(); chooseLevel(PROGRAM_LEVELS[next]);
    document.getElementById(`${id}-level-${next}`)?.focus();
  };
  return <>
    <div role="tablist" aria-label="Program level" className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">{PROGRAM_LEVELS.map((item, index) => <button key={item} id={`${id}-level-${index}`} type="button" role="tab" aria-selected={level === item} aria-controls={`${id}-list-${index}`} tabIndex={level === item ? 0 : -1} onKeyDown={event => keyDown(event, index)} onClick={() => chooseLevel(item)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#174f7a] ${level === item ? 'border-[#174f7a] text-[#174f7a]' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>{labels[item]}<span className="text-xs font-normal text-slate-500">{programs.filter(program => normalizeProgramLevel(program.level) === item).length}</span></button>)}</div>
    <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <label htmlFor={`${id}-major`} className="min-w-0 text-xs font-medium text-slate-600">Program / major<select id={`${id}-major`} value={major} onChange={event => setMajorChoice({ level, value: event.target.value })} className={`${controlClass} mt-2`}><option value="">All programs</option>{majors.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
      <label htmlFor={`${id}-medium`} className="min-w-0 text-xs font-medium text-slate-600">Medium of instruction<select id={`${id}-medium`} value={medium} onChange={event => setMedium(event.target.value)} className={`${controlClass} mt-2`}><option value="">All languages</option>{media.map(language => <option key={language} value={language}>{language}</option>)}</select></label>
      <label htmlFor={`${id}-search`} className="col-span-2 min-w-0 text-xs font-medium text-slate-600 sm:col-span-1">Search<span className="relative mt-2 block"><Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-500" aria-hidden="true" /><input id={`${id}-search`} value={query} onChange={event => onQuery(event.target.value)} placeholder="Major or school" className={`${controlClass} pl-10`} /></span></label>
    </div>
    <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1"><p role="status" aria-live="polite" className="text-xs leading-6 text-slate-600">{visibleCount} {visibleCount === 1 ? 'program' : 'programs'}{hasFilters ? ' matching your filters' : ` at ${labels[level]} level`}</p>{hasFilters && <button type="button" onClick={resetFilters} className="min-h-11 text-xs font-semibold text-[#174f7a] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#174f7a]">Clear filters</button>}</div>
    {/* Every degree catalogue is present in the initial HTML, even when its tab is inactive. */}
    {PROGRAM_LEVELS.map((item, index) => {
      const rows = programs.filter(program => normalizeProgramLevel(program.level) === item);
      const visible = filterProgramRows(rows, { major, medium, query });
      return <div key={item} id={`${id}-list-${index}`} role="tabpanel" aria-labelledby={`${id}-level-${index}`} hidden={level !== item} className="mt-2 min-w-0">
        {rows.length ? <><table className="block w-full table-fixed border-collapse text-left text-sm sm:table"><caption className="sr-only">{labels[item]} programs and majors at {name}</caption><thead className="sr-only sm:not-sr-only sm:table-header-group"><tr className="border-b border-slate-200 text-xs font-medium text-slate-500"><th scope="col" className="w-[48%] pb-3 pr-4 font-medium">Program / major</th><th scope="col" className="w-[25%] pb-3 pr-4 font-medium">Medium / duration</th><th scope="col" className="w-[27%] pb-3 text-right font-medium">Tuition</th></tr></thead><tbody className="block sm:table-row-group">{visible.map(program => {
          const tuition = program.fees.find(fee => fee.key === 'tuition' && !fee.optional);
          return <tr key={program.id} className={`grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 border-b border-slate-100 py-4 last:border-0 sm:table-row sm:p-0 ${selectedId === program.id ? 'bg-[#f2f7fa]' : ''}`}><th scope="row" className="col-span-2 min-w-0 align-top font-medium text-[#102b40] sm:py-4 sm:pr-4"><button type="button" onClick={() => onProgram(program.id)} aria-label={`View ${program.name} program details`} aria-pressed={selectedId === program.id} className="min-h-11 w-full break-words px-2 text-left leading-6 outline-none hover:text-[#174f7a] hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#174f7a]">{program.name}<span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{program.school || 'View program details'}</span></button></th><td className="min-w-0 break-words pl-2 align-top text-sm leading-6 text-slate-600 sm:py-4 sm:pl-0 sm:pr-4">{program.languages.join(' / ') || 'Not specified'}<span className="block text-xs sm:text-sm">{program.duration}</span></td><td className="min-w-0 break-words pr-2 text-right align-top text-sm font-medium leading-6 tabular-nums text-slate-700 sm:py-4"><span className="block text-xs font-normal text-slate-500 sm:hidden">Tuition</span>{tuition ? feeText(tuition) : 'Not specified'}</td></tr>;
        })}</tbody></table>{visible.length === 0 && <div className="py-8"><p className="text-sm leading-7 text-slate-600">No program matches these filters at this study level.</p><button type="button" onClick={resetFilters} className="mt-2 min-h-11 text-sm font-semibold text-[#174f7a] hover:underline">Clear filters</button></div>}</> : <div className="rounded-lg bg-slate-50 px-5 py-7"><h3 className="text-sm font-medium text-slate-700">{labels[item]} program information is not available yet.</h3><p className="mt-2 text-sm leading-6 text-slate-500">Choose another level or ask about your intended course.</p></div>}
      </div>;
    })}
  </>;
}

'use client';

import { ArrowRight } from 'lucide-react';
import { useId, useState } from 'react';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '@/lib/university-scholarship-view';

function Paragraphs({ values }: { values: string[] }) {
  return <div className="space-y-3">{values.map((value, index) => <p key={index} className="text-sm leading-7 text-slate-600">{value}</p>)}</div>;
}

export default function UniversityScholarships({ options, programs, onEstimate, onDocuments }: {
  options: UniversityScholarshipOption[];
  programs: UniversityProgramDetail[];
  onEstimate: (option: UniversityScholarshipOption) => void;
  onDocuments?: () => void;
}) {
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');
  const id = useId();
  const levels = ['All', ...new Set(options.flatMap(option => option.levels))];
  const matches = (option: UniversityScholarshipOption) => (level === 'All' || option.levels.includes(level)) && `${option.title} ${option.type}`.toLowerCase().includes(query.trim().toLowerCase());
  const resultCount = options.filter(matches).length;

  return <div className="mt-7">
    <div className="flex flex-wrap gap-2" aria-label="Filter scholarships by study level">{levels.map(value => <button key={value} type="button" aria-pressed={level === value} onClick={() => setLevel(value)} className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors ${level === value ? 'border-[#174f7a] bg-[#174f7a] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>{value === 'All' ? 'All scholarships' : value}</button>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <label htmlFor={`${id}-query`} className="block min-w-0 flex-1"><span className="sr-only">Search scholarships</span><input id={`${id}-query`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a scholarship or provider" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/10" /></label>
      <p className="text-sm text-slate-500" aria-live="polite">{resultCount} {resultCount === 1 ? 'option' : 'options'}</p>
    </div>

    {onDocuments && <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-lg bg-slate-50 px-5 py-4"><div className="max-w-xl"><h3 className="text-sm font-semibold text-[#102b40]">Documents for your university application</h3><p className="mt-1 text-sm leading-6 text-slate-600">Find the admission checklist for every study route. Each scholarship also sets out its own supporting documents below.</p></div><button type="button" onClick={onDocuments} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a]">View admission documents<ArrowRight size={16} /></button></div>}

    <div className="mt-6 space-y-6">{options.map(option => {
      const reduction = scholarshipReductionLabel(option);
      const compatible = programs.some(program => scholarshipMatchesProgram(option, program));
      const sections: { title: string; items: string[] }[] = [
        { title: 'Eligibility & scholarship conditions', items: option.conditions },
        { title: 'Renewal & continuation', items: option.renewal },
        { title: 'Documents for this funding route', items: option.documents },
        { title: 'Application process', items: option.applicationSteps },
        { title: 'Additional details', items: option.notes },
      ];

      return <article key={option.id} hidden={!matches(option)} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="p-5 sm:p-7">
          <p className="text-sm font-medium text-[#287465]">{option.type}</p>
          <h3 className="mt-2 text-xl font-semibold leading-8 tracking-tight text-[#102b40] sm:text-[22px]">{option.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">{option.levels.join(' · ')}{option.languages?.length ? ` · ${option.languages.join(' / ')}` : ''}</p>

          {(reduction || option.stipend) && <dl className={`mt-5 grid gap-5 rounded-lg bg-[#f1f6f8] p-5 ${reduction && option.stipend ? 'sm:grid-cols-2' : ''}`}>
            {reduction && <div><dt className="text-sm text-slate-600">Tuition support</dt><dd className="mt-1.5 text-lg font-semibold leading-8 text-[#174f7a]">{reduction}</dd></div>}
            {option.stipend && <div><dt className="text-sm text-slate-600">Living allowance</dt><dd className="mt-1.5 text-lg font-semibold leading-8 text-[#174f7a]">{option.stipend}</dd></div>}
          </dl>}

          {option.coverage.length > 0 && <section className="mt-6" aria-label="Scholarship coverage"><h4 className="mb-3 text-sm font-semibold text-[#102b40]">What the scholarship covers</h4><Paragraphs values={option.coverage} /></section>}

          {sections.some(section => section.items.length > 0) && <details className="mt-6 border-t border-slate-200 pt-2">
            <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold leading-6 text-[#174f7a]">Conditions, renewal & application details</summary>
            <div className="mt-4 space-y-7 pb-2">{sections.filter(section => section.items.length > 0).map(section => <section key={section.title}><h4 className="mb-3 text-base font-semibold text-[#102b40]">{section.title}</h4><Paragraphs values={section.items} /></section>)}</div>
          </details>}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7">
          <p className="max-w-xl text-sm leading-6 text-slate-500">{!compatible ? 'An eligible program is not listed in this catalog.' : option.tuitionReduction ? 'Compare the published tuition reduction alongside the other costs of studying.' : 'Compare this funding route. Enter only the tuition reduction confirmed in your award; no value is assumed.'}</p>
          <button type="button" disabled={!compatible} onClick={() => onEstimate(option)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#174f7a] bg-white px-4 text-sm font-semibold text-[#174f7a] transition-colors hover:bg-[#174f7a] hover:text-white disabled:cursor-default disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white disabled:hover:text-slate-400">Compare in ClearCost<ArrowRight size={16} /></button>
        </footer>
      </article>;
    })}</div>

    {resultCount === 0 && <p className="py-10 text-sm leading-7 text-slate-500">No scholarship matches this search and study level.</p>}
  </div>;
}

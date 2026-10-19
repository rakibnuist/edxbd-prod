'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ChevronRight, GraduationCap, MapPin } from 'lucide-react';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityRanking } from '@/lib/university-rankings';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import UniversityClearCost from './UniversityClearCost';
import UniversityDocuments from './UniversityDocuments';
import UniversityPrograms from './UniversityPrograms';
import UniversityScholarships from './UniversityScholarships';

type Panel = 'overview' | 'programs' | 'scholarships' | 'fees' | 'admission' | 'documents' | 'rankings';
const PANELS: { id: Panel; label: string }[] = [
  { id: 'overview', label: 'Overview' }, { id: 'programs', label: 'Programs & majors' },
  { id: 'scholarships', label: 'Scholarships' }, { id: 'fees', label: 'Fees & ClearCost' },
  { id: 'admission', label: 'Entry requirements' }, { id: 'documents', label: 'Documents required' },
  { id: 'rankings', label: 'Rankings' },
];
const LEVEL_LABELS: Record<ProgramLevel, string> = { Bachelor: 'Bachelor’s', Master: 'Master’s', PhD: 'PhD', Language: 'Language', Foundation: 'Foundation', Diploma: 'Diploma' };
const titleClass = 'text-2xl font-semibold tracking-tight text-[#102b40] sm:text-[28px] sm:leading-9';
const mutedClass = 'text-sm leading-7 text-slate-500';
const selectClass = 'mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/10';
const sheetClass = 'rounded-xl border border-slate-200 bg-white p-5 sm:p-8';
const textAction = 'inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#174f7a] hover:text-[#102b40] hover:underline';
const applyClass = 'inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#174f7a] px-5 py-3 text-center text-sm font-semibold leading-6 text-white transition-colors hover:bg-[#103d60]';

type Props = {
  university: Pick<CleanUniversityRecord, 'name' | 'slug' | 'city' | 'country' | 'location' | 'logo' | 'scholarships'>;
  shortName: string;
  displayName: string;
  scholarshipOptions: UniversityScholarshipOption[];
  overview: string;
  highlights: { title: string; description: string }[];
  campusImage?: { src: string; alt: string };
  programs: UniversityProgramDetail[];
  hasDetailedPrograms: boolean;
  rankings: Omit<UniversityRanking, 'sourceUrl'>[];
  servicePackages: { title: string; priceLabel: string; summary?: string }[];
};

function PlainList({ items, empty = 'Details are not yet available for this program.' }: { items: string[]; empty?: string }) {
  if (!items.length) return <p className={mutedClass}>{empty}</p>;
  return <ul className="space-y-4">{items.map((item, index) => <li key={`${index}-${item}`} className="border-l-2 border-[#d9e7e8] pl-4 text-sm leading-7 text-slate-600">{item}</li>)}</ul>;
}

export default function UniversityProfileClient({ university, shortName, displayName, overview, highlights, campusImage, programs, hasDetailedPrograms, scholarshipOptions, rankings, servicePackages }: Props) {
  const [panel, setPanel] = useState<Panel>('overview');
  const [level, setLevel] = useState<ProgramLevel>(programs[0] ? normalizeProgramLevel(programs[0].level) : 'Bachelor');
  const [selectedId, setSelectedId] = useState(programs[0]?.id || '');
  const [query, setQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);
  const [scholarshipScenario, setScholarshipScenario] = useState<UniversityScholarshipOption | null>(null);
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const selected = programs.find(program => program.id === selectedId);
  const availableLevels = PROGRAM_LEVELS.filter(item => programs.some(program => normalizeProgramLevel(program.level) === item));
  const languages = [...new Set(programs.flatMap(program => program.languages))];
  const worldRanking = rankings.find(ranking => ranking.scope === 'world');
  const majorPreviews = programs.filter((program, index) => programs.findIndex(other => other.name === program.name) === index).slice(0, 6);
  const scholarshipPreviews = scholarshipOptions.filter((option, index) => scholarshipOptions.findIndex(other => other.type === option.type) === index).slice(0, 3);
  const feePreviews = availableLevels.flatMap(item => {
    const fees = programs.filter(program => normalizeProgramLevel(program.level) === item).flatMap(program => program.fees.filter(fee => fee.key === 'tuition' && !fee.optional && fee.amount !== undefined));
    if (!fees.length || new Set(fees.map(fee => fee.currency)).size !== 1 || new Set(fees.map(fee => fee.period)).size !== 1) return [];
    const low = Math.min(...fees.map(fee => fee.amount!));
    const high = Math.max(...fees.map(fee => fee.amount!));
    return [{ level: item, amount: `${fees[0].currency} ${low.toLocaleString('en-US')}${high > low ? `–${high.toLocaleString('en-US')}` : ''}`, period: ({ year: 'per year', semester: 'per semester', programme: 'per program', month: 'per month', day: 'per day', oneoff: 'one-time' })[fees[0].period] }];
  });
  const programScholarships = selected?.scholarships || selected?.notes.filter(note => /scholarship|\baward\b|stipend/i.test(note)) || [];
  const assessmentHref = `/apply?${new URLSearchParams({ university: university.name, country: university.country, ...(selected ? { program: selected.name } : {}) }).toString()}`;
  const activeScenario = selected && scholarshipScenario && scholarshipMatchesProgram(scholarshipScenario, selected) ? scholarshipScenario : null;

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      const match = PANELS.find(item => item.id === hash || (hash === 'costs' && item.id === 'fees'));
      setPanel(match?.id || 'overview');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const openPanel = (next: Panel) => {
    setPanel(next);
    window.history.replaceState(null, '', `#${next}`);
    window.requestAnimationFrame(() => contentRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' }));
  };
  const chooseLevel = (next: ProgramLevel) => {
    setLevel(next); setQuery(''); setScholarshipScenario(null);
    setSelectedId(programs.find(program => normalizeProgramLevel(program.level) === next)?.id || '');
  };
  const chooseProgram = (value: string) => {
    setSelectedId(value); setScholarshipScenario(null);
    const program = programs.find(item => item.id === value);
    if (program) setLevel(normalizeProgramLevel(program.level));
  };
  const chooseScholarship = (option: UniversityScholarshipOption | null) => {
    setScholarshipScenario(option);
    if (!option) return;
    const program = selected && scholarshipMatchesProgram(option, selected) ? selected : programs.find(item => scholarshipMatchesProgram(option, item));
    if (program) { setSelectedId(program.id); setLevel(normalizeProgramLevel(program.level)); }
  };
  const estimateScholarship = (option: UniversityScholarshipOption) => { chooseScholarship(option); openPanel('fees'); };
  const tabKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % PANELS.length;
    else if (event.key === 'ArrowLeft') next = (index + PANELS.length - 1) % PANELS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = PANELS.length - 1;
    else return;
    event.preventDefault(); openPanel(PANELS[next].id);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };
  const programPicker = (context: string) => programs.length > 0 && <label htmlFor={`${id}-${context}-program`} className="mb-7 block text-sm font-medium text-slate-600">Choose your program<select id={`${id}-${context}-program`} value={selectedId} onChange={event => chooseProgram(event.target.value)} className={selectClass}><option value="" disabled>Select a program</option>{programs.map(program => <option key={program.id} value={program.id}>{LEVEL_LABELS[normalizeProgramLevel(program.level)]} · {program.name} · {program.languages.join(' / ')}</option>)}</select></label>;
  const noSelection = <p className={mutedClass}>Choose a listed program to view its details.</p>;
  const panelProps = (name: Panel) => ({ id: `${id}-panel-${name}`, role: 'tabpanel', 'aria-labelledby': `${id}-tab-${PANELS.findIndex(item => item.id === name)}`, hidden: panel !== name, tabIndex: 0 });

  return <article className="min-h-screen bg-[#f5f7f8] pb-16 pt-[76px] text-slate-800 xl:pt-[112px]">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10 lg:pb-0">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs leading-5 text-slate-500"><Link href="/" className="hover:text-[#174f7a]">Home</Link><ChevronRight size={12} /><Link href="/universities" className="hover:text-[#174f7a]">Universities</Link><ChevronRight size={12} /><span>{shortName}</span></nav>
        <div className={`grid items-center gap-7 pb-7 ${campusImage ? 'lg:grid-cols-[minmax(0,1fr)_310px]' : ''}`}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5">{university.logo && !logoFailed ? <Image src={university.logo} alt={`${university.name} logo`} width={56} height={56} className="h-full w-full object-contain" unoptimized onError={() => setLogoFailed(true)} /> : <GraduationCap size={28} className="text-[#174f7a]" strokeWidth={1.4} aria-hidden="true" />}</div>
              <p className="text-sm font-medium text-[#287465]">Your university guide · {university.country}</p>
            </div>
            <h1 className="max-w-3xl text-[28px] font-semibold leading-[1.22] tracking-tight text-[#102b40] sm:text-4xl">{displayName}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">Find your major. Explore scholarships. Plan your study budget.</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2"><Link href={assessmentHref} className={applyClass}>Apply with EduExpress International<ArrowRight size={17} className="shrink-0" /></Link><button type="button" onClick={() => openPanel('programs')} className={textAction}>Explore programs<ArrowRight size={16} /></button></div>
          </div>
          {campusImage && <figure className="relative hidden h-[236px] overflow-hidden rounded-xl lg:block"><Image src={campusImage.src} alt={campusImage.alt} fill priority sizes="310px" className="object-cover object-[65%_45%]" /><figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#102b40]/80 to-transparent px-5 pb-4 pt-10 text-xs font-medium text-white">On campus in {university.city}</figcaption></figure>}
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-slate-200 py-5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200">
          <div className="lg:pr-5"><dt className="text-xs text-slate-500">Location</dt><dd className="mt-2 flex items-start gap-2 text-sm font-semibold leading-6 text-[#102b40]"><MapPin size={16} className="mt-1 shrink-0 text-[#287465]" aria-hidden="true" />{university.location || `${university.city}, ${university.country}`}</dd></div>
          <div className="lg:px-6"><dt className="text-xs text-slate-500">World ranking{worldRanking ? ` · ${worldRanking.publisher === 'Times Higher Education' ? 'THE' : worldRanking.publisher}` : ''}</dt><dd><button type="button" onClick={() => openPanel('rankings')} className="mt-1 min-h-11 text-left text-xl font-semibold tabular-nums tracking-tight text-[#102b40] hover:text-[#174f7a]">{worldRanking?.rank || 'View rankings'}</button></dd></div>
          <div className="lg:px-6"><dt className="text-xs text-slate-500">Scholarships</dt><dd><button type="button" onClick={() => openPanel('scholarships')} className="mt-1 min-h-11 text-left text-sm font-semibold text-[#102b40] hover:text-[#174f7a]">{scholarshipOptions.length ? `${scholarshipOptions.length} funding options` : 'Explore funding options'}<span className="block text-xs font-normal leading-5 text-slate-500">{scholarshipOptions.some(option => /CSC|Chinese Government/.test(option.title)) ? 'CSC, university & other awards' : 'Coverage, values & conditions'}</span></button></dd></div>
          <div className="lg:pl-6"><dt className="text-xs text-slate-500">Programs & majors</dt><dd><button type="button" onClick={() => openPanel('programs')} className="mt-1 min-h-11 text-left text-sm font-semibold text-[#102b40] hover:text-[#174f7a]">{programs.length} study options<span className="block text-xs font-normal leading-5 text-slate-500">{availableLevels.map(item => LEVEL_LABELS[item]).join(' · ')}</span></button></dd></div>
        </dl>
      </div>
    </header>

    <div className="sticky top-[76px] z-20 border-b border-slate-200 bg-white xl:top-[112px]">
      <div role="tablist" aria-label="University information" className="mx-auto flex max-w-[1280px] overflow-x-auto px-5 sm:px-8 lg:px-10">{PANELS.map((item, index) => <button key={item.id} id={`${id}-tab-${index}`} type="button" role="tab" aria-selected={panel === item.id} aria-controls={`${id}-panel-${item.id}`} tabIndex={panel === item.id ? 0 : -1} onKeyDown={event => tabKeys(event, index)} onClick={() => openPanel(item.id)} className={`min-h-14 shrink-0 border-b-2 px-4 text-sm font-semibold transition-colors first:pl-0 ${panel === item.id ? 'border-[#174f7a] text-[#174f7a]' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{item.label}</button>)}</div>
    </div>

    <div ref={contentRef} className={`mx-auto grid max-w-[1280px] scroll-mt-[148px] items-start gap-7 px-5 pt-8 sm:px-8 xl:scroll-mt-[184px] lg:px-10 ${panel === 'fees' ? '' : 'lg:grid-cols-[minmax(0,1fr)_280px]'}`}>
      <div className="min-w-0">
        <section {...panelProps('overview')} className="space-y-7">
          <div className={sheetClass}>
            <p className="mb-2 text-sm font-medium text-[#287465]">Discover {shortName}</p><h2 className={titleClass}>Study at {shortName}</h2>
            <div className="mt-5 space-y-4">{overview.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="text-[15px] leading-8 text-slate-600">{paragraph}</p>)}</div>
            {highlights.length > 0 && <div className="mt-8 border-t border-slate-200 pt-6"><h3 className="mb-6 text-lg font-semibold text-[#102b40]">What makes {shortName} stand out</h3><div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">{highlights.map((highlight, index) => <div key={highlight.title} className={index === 0 ? 'sm:col-span-2' : ''}><h4 className="text-base font-semibold leading-7 text-[#102b40]">{highlight.title}</h4><p className="mt-1.5 text-sm leading-7 text-slate-500">{highlight.description}</p></div>)}</div></div>}
          </div>
          <div className="rounded-xl bg-[#eaf1f3] p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="mb-1 text-sm text-[#287465]">Find your academic direction</p><h2 className="text-xl font-semibold tracking-tight text-[#102b40]">Explore majors at {shortName}</h2></div><button type="button" onClick={() => openPanel('programs')} className={textAction}>All programs<ArrowRight size={16} /></button></div>
            <div className="mt-5 grid gap-x-8 sm:grid-cols-2">{majorPreviews.map(program => <button key={program.id} type="button" onClick={() => { chooseProgram(program.id); openPanel('programs'); }} className="group flex min-h-[76px] items-center justify-between gap-3 border-t border-[#cbdce1] py-3 text-left"><span className="text-sm font-medium leading-6 text-[#102b40] group-hover:text-[#174f7a]">{program.name}<span className="mt-0.5 block text-xs font-normal text-slate-500">{LEVEL_LABELS[normalizeProgramLevel(program.level)]} · {program.languages.join(' / ')}</span></span><ArrowRight size={16} className="shrink-0 text-[#174f7a]" /></button>)}</div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{availableLevels.map(item => LEVEL_LABELS[item]).join(' · ')}<span className="mx-2 text-slate-400">/</span>{languages.join(' / ') || 'Explore teaching languages by program'}</p>
          </div>
          <div className={sheetClass}>
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold tracking-tight text-[#102b40]">Scholarships at {shortName}</h2><button type="button" onClick={() => openPanel('scholarships')} className={textAction}>All funding routes<ArrowRight size={16} /></button></div>
            {scholarshipPreviews.length > 0 ? <div className="mt-3 divide-y divide-slate-100">{scholarshipPreviews.map(option => <button key={option.id} type="button" onClick={() => openPanel('scholarships')} className="flex w-full items-center justify-between gap-5 py-5 text-left"><span><span className="text-sm font-semibold leading-7 text-[#102b40]">{option.title}</span><span className="mt-1 block text-sm leading-6 text-[#287465]">{scholarshipReductionLabel(option) || option.coverage[0]}</span><span className="mt-1 block text-xs leading-6 text-slate-500">{option.levels.join(' · ')}</span></span><ChevronRight size={18} className="shrink-0 text-[#174f7a]" /></button>)}</div> : <p className="mt-4 text-sm leading-7 text-slate-600">Explore scholarship coverage, qualifying programs and award conditions for your study route.</p>}
            <p className="border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">Scholarships depend on eligibility, selection and continued academic performance. Compare the conditions before building your budget.</p>
          </div>
          <div className={sheetClass}>
            <h2 className="text-xl font-semibold tracking-tight text-[#102b40]">Plan your {shortName} study budget</h2><p className="mt-2 text-sm leading-7 text-slate-500">Start with tuition, then compare scholarship support and your costs before travel and in China.</p>
            {feePreviews.length > 0 && <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">{feePreviews.map(fee => <div key={fee.level} className="border-l-2 border-[#c5d8dc] pl-4"><dt className="text-sm text-slate-500">{LEVEL_LABELS[fee.level]}</dt><dd className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-[#102b40]">{fee.amount}<span className="mt-1 block text-xs font-normal tracking-normal text-slate-500">{fee.period} · before scholarship</span></dd></div>)}</dl>}
            <button type="button" onClick={() => openPanel('fees')} className={`mt-5 ${textAction}`}>Build my ClearCost estimate<ArrowRight size={16} /></button>
          </div>
        </section>

        <section {...panelProps('programs')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} programs & majors</h2><p className="mt-2 text-sm leading-7 text-slate-500">Choose a study level, major and medium of instruction to find your course.</p>
          <UniversityPrograms name={university.name} programs={programs} level={level} query={query} selectedId={selectedId} onLevel={chooseLevel} onQuery={setQuery} onProgram={value => { chooseProgram(value); openPanel('admission'); }} />
          {selected && <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs text-slate-500">Selected program</p><h3 className="mt-1.5 text-base font-semibold text-[#102b40]">{selected.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{[selected.duration, selected.languages.join(' / ')].filter(Boolean).join(' · ')}</p><div className="mt-3 flex flex-wrap gap-x-6"><button type="button" onClick={() => openPanel('fees')} className={textAction}>Fees & ClearCost<ArrowRight size={16} /></button><button type="button" onClick={() => openPanel('documents')} className={textAction}>Documents required<ArrowRight size={16} /></button></div></div>}
        </section>

        <section {...panelProps('fees')} className="space-y-6">
          <div className={sheetClass}><h2 className={titleClass}>{shortName} fees & ClearCost</h2><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Choose your program, compare scholarship support and see when you pay.</p>{programPicker('fees')}{!selected && noSelection}</div>
          {selected && <UniversityClearCost key={selected.id} university={university} programs={[]} programDetails={[selected]} scholarshipOptions={scholarshipOptions} selectedScholarshipId={scholarshipScenario?.id || ''} onScholarshipChange={chooseScholarship} scholarshipScenario={activeScenario?.tuitionReduction ? { id: activeScenario.id, title: activeScenario.title, ...activeScenario.tuitionReduction, feeWaivers: activeScenario.feeWaivers } : undefined} hideProgramPicker servicePackages={servicePackages} fees={[]} scholarships={university.scholarships} costPlans={[]} assessmentHref={assessmentHref} />}
          {selected && <details className={sheetClass}><summary className="min-h-11 cursor-pointer text-lg font-semibold leading-7 text-[#102b40]">All program fees & payment conditions</summary><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Review the full fee schedule for {selected.name}.</p><div className="grid gap-8 lg:grid-cols-2">{(['before_china', 'in_china'] as const).map(stage => <div key={stage}><h3 className="border-b border-slate-200 pb-3 text-base font-semibold text-[#102b40]">{stage === 'before_china' ? 'Before China' : 'In China'}</h3><dl className="divide-y divide-slate-100">{selected.fees.filter(fee => fee.stage === stage).map((fee, index) => <div key={`${fee.key}-${index}`} className="py-4"><div className="flex items-start justify-between gap-5 text-sm"><dt className="text-slate-600">{fee.item}{fee.optional && <span className="mt-1 block text-xs text-slate-500">If applicable</span>}</dt><dd className="text-right font-medium tabular-nums leading-6 text-slate-800">{feeText(fee)}</dd></div>{fee.notes && <details className="mt-2 text-sm leading-7 text-slate-500"><summary className="min-h-7 cursor-pointer text-xs font-medium">Fee conditions</summary><p className="mt-2">{fee.notes}</p></details>}</div>)}{selected.fees.filter(fee => fee.stage === stage).length === 0 && <p className="py-5 text-sm leading-7 text-slate-500">Fee amounts for this stage have not been specified.</p>}</dl>{stage === 'before_china' && <p className="mt-4 text-sm leading-7 text-slate-500">Select an EduExpress Package in the calculator to include its published fee automatically.</p>}</div>)}</div></details>}
        </section>

        <section {...panelProps('admission')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} entry requirements</h2><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Academic qualifications and language requirements for your program.</p>{programPicker('admission')}{selected ? <div className="space-y-8"><div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4"><p className="text-sm leading-7 text-slate-600">{selected.duration} · {selected.languages.join(' / ')}{selected.campus ? ` · ${selected.campus}` : ''}</p><button type="button" onClick={() => openPanel('documents')} className={textAction}>Admission documents<ArrowRight size={16} /></button></div><div><h3 className="mb-4 text-lg font-semibold text-[#102b40]">Application qualifications</h3><PlainList items={selected.qualifications} /></div><div><h3 className="mb-4 text-lg font-semibold text-[#102b40]">Language requirements</h3><PlainList items={selected.languageRequirements} /></div>{selected.progression && <div><h3 className="mb-3 text-lg font-semibold text-[#102b40]">Progression</h3><p className={mutedClass}>{selected.progression}</p></div>}{selected.notes.filter(note => !/scholarship|\baward\b|stipend/i.test(note)).length > 0 && <details className="border-t border-slate-200 pt-5"><summary className="min-h-11 cursor-pointer text-sm font-semibold text-[#174f7a]">Additional program guidance</summary><PlainList items={selected.notes.filter(note => !/scholarship|\baward\b|stipend/i.test(note))} /></details>}<Link href={assessmentHref} className={applyClass}>Apply with EduExpress International<ArrowRight size={16} /></Link></div> : noSelection}
        </section>

        <section {...panelProps('documents')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} documents required</h2><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Prepare your admission application with the right documents for your program.</p>{programPicker('documents')}{selected ? <UniversityDocuments documents={selected.documents} programName={selected.name} applyHref={assessmentHref} /> : noSelection}
        </section>

        <section {...panelProps('scholarships')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} scholarships</h2>{scholarshipOptions.length > 0 ? <><p className="mt-3 text-sm leading-7 text-slate-600">Compare coverage, tuition reductions, eligibility and renewal conditions for each funding route.</p><UniversityScholarships options={scholarshipOptions} programs={programs} onEstimate={estimateScholarship} onDocuments={() => openPanel('documents')} /></> : hasDetailedPrograms ? <div className="mt-6">{programPicker('scholarships')}{selected ? <><h3 className="mb-4 text-base font-semibold text-[#102b40]">{selected.name}</h3><PlainList items={programScholarships} empty="A scholarship amount has not been confirmed for this program. Budget with full tuition until you have a written award." /></> : noSelection}</div> : university.scholarships.length > 0 ? <div className="mt-6 divide-y divide-slate-200">{university.scholarships.map((scholarship, index) => <article key={`${scholarship.title}-${index}`} className="py-6 first:pt-0"><h3 className="text-lg font-semibold text-[#102b40]">{scholarship.title}</h3>{scholarship.amount && <p className="mt-3 text-lg font-medium text-[#287465]">{scholarship.amount}</p>}{scholarship.coverage && <p className="mt-3 text-sm leading-7 text-slate-600">{scholarship.coverage}</p>}<div className="mt-4"><PlainList items={scholarship.details} /></div>{scholarship.condition && <p className="mt-4 text-sm leading-7 text-slate-500"><strong className="font-semibold">Eligibility: </strong>{scholarship.condition}</p>}{scholarship.renewal && <p className="mt-3 text-sm leading-7 text-slate-500"><strong className="font-semibold">Renewal: </strong>{scholarship.renewal}</p>}</article>)}</div> : <p className={`mt-5 ${mutedClass}`}>A scholarship amount has not been confirmed for the listed programs. Plan with the full tuition fee until you have a written award.</p>}
        </section>

        <section {...panelProps('rankings')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} rankings</h2><p className="mt-2 text-sm leading-7 text-slate-500">Explore {shortName}’s position in global and subject rankings.</p>{rankings.length > 0 ? <div className="mt-6"><table className="w-full text-left text-sm"><caption className="sr-only">Published university rankings</caption><thead><tr className="border-b border-slate-200 text-xs text-slate-500"><th scope="col" className="pb-3 pr-4 font-medium">Ranking & scope</th><th scope="col" className="pb-3 text-right font-medium">Position</th></tr></thead><tbody>{rankings.map((ranking, index) => <tr key={`${ranking.publisher}-${index}`} className="border-b border-slate-100 last:border-0"><th scope="row" className="py-5 pr-5 font-medium leading-7 text-slate-700">{ranking.publisher}<span className="mt-1 block text-xs font-normal leading-6 text-slate-500">{ranking.rankingName}{ranking.subject ? ` · ${ranking.subject}` : ''}</span><span className="mt-1 block text-xs font-normal text-[#287465]">{ranking.scope === 'world' ? 'Overall world ranking' : ranking.scope === 'subject' ? 'Subject ranking' : 'National ranking'}</span></th><td className="py-5 text-right align-top text-lg font-semibold tabular-nums text-[#102b40]">{ranking.rank}</td></tr>)}</tbody></table></div> : <p className={`mt-6 ${mutedClass}`}>A published world ranking is not available for this profile.</p>}<p className="mt-5 text-sm leading-7 text-slate-500">Rankings measure different aspects of a university. Consider your subject, degree recognition and entry requirements alongside its position.</p>
        </section>
      </div>

      {panel !== 'fees' && <aside className="space-y-6 lg:sticky lg:top-[188px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold tracking-tight text-[#102b40]">Your study plan</h2><dl className="mt-5 space-y-5 text-sm">{[['Location', `${university.city}, ${university.country}`], ['Selected program', selected?.name || 'Choose a study option'], ['Duration', selected?.duration || 'Not specified'], ['Medium of instruction', selected?.languages.join(' / ') || 'Not specified']].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1.5 leading-7 text-slate-700">{value}</dd></div>)}</dl><button type="button" onClick={() => openPanel('programs')} className={`mt-4 ${textAction}`}>Find another program<ArrowRight size={15} /></button></div>
        <div className="rounded-xl bg-[#eaf1f3] p-6"><p className="text-xs font-medium text-[#287465]">With EduExpress International</p><h2 className="mt-2 text-xl font-semibold leading-7 tracking-tight text-[#102b40]">Make your next move.</h2><p className="mt-3 text-sm leading-7 text-slate-600">Get guidance on your program, scholarship route and application documents.</p><Link href={assessmentHref} className={`mt-5 w-full ${applyClass}`}>Apply with EduExpress International<ArrowRight size={16} className="shrink-0" /></Link><button type="button" onClick={() => openPanel('fees')} className={`mt-2 ${textAction}`}>Calculate my study cost<ArrowRight size={15} /></button></div>
        <Link href="/universities?country=china" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#174f7a]">Compare other universities<ArrowRight size={15} /></Link>
      </aside>}
    </div>
  </article>;
}

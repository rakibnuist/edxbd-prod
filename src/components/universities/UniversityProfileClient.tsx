'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useId, useState } from 'react';
import { ArrowRight, ChevronRight, GraduationCap, MapPin, Trophy, BookOpen, Wallet, CheckCircle2 } from 'lucide-react';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityRanking } from '@/lib/university-rankings';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import UniversityEnquiryForm from './UniversityEnquiryForm';
import UniversityDocuments from './UniversityDocuments';
import { UniversityProgramTable, UniversityFundingTable, UniversityEntrySummary } from './UniversityGuideTables';
import UniversityScholarships from './UniversityScholarships';

const UniversityClearCost = dynamic(() => import('./UniversityClearCost'), { loading: () => <p className="p-5 text-sm text-slate-500">Loading your cost planner…</p> });
const UniversityPrograms = dynamic(() => import('./UniversityPrograms'), { loading: () => <p className="py-5 text-sm text-slate-500">Loading program filters…</p> });

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
  generalDetails: { majors: string[]; degrees: string[]; languages: string[]; tuition: string; documents: string[]; fees: { item: string; cost: string; notes?: string }[] };
  intakeMonths?: string[];
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

export default function UniversityProfileClient({ university, shortName, displayName, overview, highlights, campusImage, intakeMonths = [], generalDetails, programs, hasDetailedPrograms, scholarshipOptions, rankings, servicePackages }: Props) {
  const [panel, setPanel] = useState<Panel>('overview');
  const [level, setLevel] = useState<ProgramLevel>(programs[0] ? normalizeProgramLevel(programs[0].level) : 'Bachelor');
  const [selectedId, setSelectedId] = useState(programs[0]?.id || '');
  const [query, setQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);
  const [scholarshipScenario, setScholarshipScenario] = useState<UniversityScholarshipOption | null>(null);
  const id = useId();
  const [costOpen, setCostOpen] = useState(false);
  const [costMounted, setCostMounted] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);
  const selected = programs.find(program => program.id === selectedId);
  const availableLevels = PROGRAM_LEVELS.filter(item => programs.some(program => normalizeProgramLevel(program.level) === item));
  const languages = [...new Set(programs.flatMap(program => program.languages))];
  const hasMedicalProgram = programs.some(program => /\bMBBS\b|clinical medicine|ophthalmological and optometric medicine/i.test(program.name));
  const worldRanking = rankings.find(ranking => ranking.scope === 'world');
  const feePreviews = availableLevels.flatMap(item => {
    const fees = programs.filter(program => normalizeProgramLevel(program.level) === item).flatMap(program => program.fees.filter(fee => fee.key === 'tuition' && !fee.optional && fee.amount !== undefined));
    if (!fees.length || new Set(fees.map(fee => fee.currency)).size !== 1 || new Set(fees.map(fee => fee.period)).size !== 1) return [];
    const low = Math.min(...fees.map(fee => fee.amount!));
    const high = Math.max(...fees.map(fee => fee.amount!));
    return [{ level: item, amount: `${fees[0].currency} ${low.toLocaleString('en-US')}${high > low ? `–${high.toLocaleString('en-US')}` : ''}`, period: ({ year: 'per year', semester: 'per semester', programme: 'per program', month: 'per month', day: 'per day', oneoff: 'one-time' })[fees[0].period] }];
  });
  const programScholarships = selected?.scholarships || selected?.notes.filter(note => /scholarship|\baward\b|stipend/i.test(note)) || [];
  const assessmentHref = '#university-enquiry';
  const activeScenario = selected && scholarshipScenario && scholarshipMatchesProgram(scholarshipScenario, selected) ? scholarshipScenario : null;
  const scholarshipHighlight = activeScenario || scholarshipOptions.find(option => !selected || scholarshipMatchesProgram(option, selected));
  const scholarshipHighlightLabel = scholarshipHighlight && (scholarshipReductionLabel(scholarshipHighlight) || scholarshipHighlight.coverage[0]);

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
    if (next === 'fees') setCostOpen(true);
    window.history.replaceState(null, '', '#' + next);
    document.getElementById(next)?.scrollIntoView({ block: 'start', behavior: 'auto' });
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
  const programPicker = (context: string) => programs.length > 0 && <label htmlFor={`${id}-${context}-program`} className="mb-7 block text-sm font-medium text-slate-600">Choose your program<select id={`${id}-${context}-program`} value={selectedId} onChange={event => chooseProgram(event.target.value)} className={selectClass}><option value="" disabled>Select a program</option>{programs.map(program => <option key={program.id} value={program.id}>{LEVEL_LABELS[normalizeProgramLevel(program.level)]} · {program.name} · {program.languages.join(' / ')}</option>)}</select></label>;
  const generalFeeTable = <div className={sheetClass}><h3 className="text-lg font-semibold text-[#102b40]">University fee information</h3><p className="mt-2 text-sm leading-7 text-slate-500">Confirm the fee for your exact program before budgeting.</p><dl className="mt-4 divide-y divide-slate-100">{[...(generalDetails.tuition ? [{ item: 'Tuition', cost: generalDetails.tuition, notes: undefined }] : []), ...generalDetails.fees].map((fee, index) => <div key={`${fee.item}-${index}`} className="py-4"><div className="flex items-start justify-between gap-5 text-sm"><dt className="text-slate-600">{fee.item}</dt><dd className="text-right font-semibold text-[#102b40]">{fee.cost}</dd></div>{fee.notes && <p className="mt-2 text-xs leading-6 text-slate-500">{fee.notes}</p>}</div>)}</dl></div>;
  const noSelection = <p className={mutedClass}>Choose a listed program to view its details.</p>;
  const panelProps = (name: Panel) => ({ id: name, 'aria-label': PANELS.find(item => item.id === name)?.label });
  const tuitionHighlight = selected?.fees.find(fee => fee.key === 'tuition' && !fee.optional);


  return <article className="min-h-screen bg-[#f4f6f7] pb-16 pt-[76px] text-slate-800 xl:pt-[112px]">
    <header className="overflow-hidden bg-[#082d45] text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs leading-5 text-[#b8cbd8]"><Link href="/" className="hover:text-white">Home</Link><ChevronRight size={12} /><Link href="/universities" className="hover:text-white">Universities</Link><ChevronRight size={12} /><span>{shortName}</span></nav>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="min-w-0 lg:py-2">
            <div className="flex items-center gap-4"><div className={'grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 p-2.5 ' + (['hsu', 'njit', 'jit', 'ctgu'].includes(university.slug) && !logoFailed ? 'bg-[#174f7a]' : 'bg-white')}>{university.logo && !logoFailed ? <Image src={university.logo} alt={university.name + ' logo'} width={76} height={76} className="h-full w-full object-contain" unoptimized onError={() => setLogoFailed(true)} /> : <GraduationCap size={32} className="text-[#174f7a]" aria-hidden="true" />}</div><div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#edbc69]">University guide · {university.country}</p><p className="mt-2 flex items-center gap-1.5 text-sm text-[#c4d6e2]"><MapPin size={15} />{university.city}, {university.country}</p></div></div>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(1.9rem,3.3vw,2.7rem)] font-bold leading-[1.16] tracking-[-.025em]">{displayName}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#ccdae4]">{overview.split(/\n\s*\n/)[0]}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-[#ccdae4]"><BookOpen size={18} className="mt-1 shrink-0 text-[#edbc69]" />{(availableLevels.length ? availableLevels.map(item => LEVEL_LABELS[item]) : generalDetails.degrees).join(' · ') || 'Find your study route'}{languages.length ? ' · ' + languages.join(' / ') : ''}</p>
            <div className="mt-6 flex flex-wrap gap-3"><a href="#programs" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-[#082d45]">Explore programs<ArrowRight size={16} /></a><a href="#university-enquiry" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#597386] px-5 text-sm font-semibold text-white hover:bg-white/10">Get my university plan<ArrowRight size={16} /></a></div>
            <dl className="mt-7 grid grid-cols-2 gap-5 border-y border-white/15 py-5 sm:grid-cols-3">
              {worldRanking && <div><dt className="flex items-center gap-1.5 text-xs text-[#b8cbd8]"><Trophy size={14} />World ranking</dt><dd className="mt-2"><a href="#rankings" className="text-2xl font-bold tabular-nums text-white">#{worldRanking.rank}<span className="mt-1 block text-xs font-normal text-[#b8cbd8]">{worldRanking.publisher}</span></a></dd></div>}
              <div><dt className="flex items-center gap-1.5 text-xs text-[#b8cbd8]"><Wallet size={14} />Scholarship highlight</dt><dd className="mt-2"><a href="#scholarships" className="text-base font-bold leading-6 text-[#a9e4c3]">{scholarshipHighlightLabel || 'Explore scholarship routes'}<span className="mt-1 block text-xs font-normal leading-5 text-[#b8cbd8]">{scholarshipHighlight?.title || 'Funding, coverage and conditions'}</span></a></dd></div>
              <div><dt className="text-xs text-[#b8cbd8]">Selected program tuition</dt><dd className="mt-2"><a href="#fees" className="text-base font-bold leading-6 text-white">{tuitionHighlight ? feeText(tuitionHighlight) : 'Build a study budget'}<span className="mt-1 block text-xs font-normal leading-5 text-[#b8cbd8]">{selected ? LEVEL_LABELS[normalizeProgramLevel(selected.level)] + ' · before scholarship' : 'Program fees and living costs'}</span></a></dd></div>
            </dl>
            {selected && !campusImage && <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/5 px-4 py-4"><div><p className="text-[11px] font-medium uppercase tracking-[.1em] text-[#edbc69]">Your study option</p><p className="mt-1 text-sm font-semibold leading-6 text-white">{selected.name}</p><p className="mt-1 text-xs leading-6 text-[#b8cbd8]">{LEVEL_LABELS[normalizeProgramLevel(selected.level)]} · {selected.duration} · {selected.languages.join(' / ')}</p></div><a href="#programs" className="inline-flex min-h-10 shrink-0 items-center gap-1 text-xs font-semibold text-white underline underline-offset-4">Explore<ArrowRight size={14} /></a></div>}
            {campusImage && <figure className="relative mt-5 hidden h-[125px] overflow-hidden rounded-xl lg:block"><Image src={campusImage.src} alt={campusImage.alt} fill priority sizes="650px" className="object-cover object-[65%_45%]" /></figure>}
            <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#b8cbd8]"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[#a9e4c3]" />Programs, scholarship options and a cost plan. Personal guidance for students from Bangladesh.</p>
          </div>
          <UniversityEnquiryForm university={university} programs={programs} selectedProgramId={selectedId} onProgram={chooseProgram} scholarship={scholarshipScenario?.title} />
        </div>
      </div>
    </header>
    <nav aria-label="On this university page" className="sticky top-[76px] z-20 border-b border-slate-200 bg-white xl:top-[112px]"><div className="mx-auto flex max-w-[1280px] items-center gap-3 px-5 sm:px-8 lg:px-10"><div className="flex min-w-0 flex-1 overflow-x-auto">{PANELS.map(item => <a key={item.id} href={'#' + item.id} onClick={() => setPanel(item.id)} aria-current={panel === item.id ? 'location' : undefined} className={'inline-flex min-h-14 shrink-0 items-center border-b-2 px-4 text-sm font-semibold first:pl-0 ' + (panel === item.id ? 'border-[#dca64b] text-[#082d45]' : 'border-transparent text-slate-500 hover:text-[#082d45]')}>{item.label}</a>)}</div><a href={assessmentHref} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#efa93d] px-3 text-xs font-bold text-[#08263c]">Enquire<ArrowRight size={14} /></a></div></nav>
    <div className="mx-auto max-w-[1160px] space-y-7 px-5 pt-7 sm:px-8 lg:px-10 [&>section]:scroll-mt-[148px] xl:[&>section]:scroll-mt-[184px]">
      <section {...panelProps('overview')} className={sheetClass}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-[#17624f]">The university at a glance</p><h2 className={titleClass}>About {university.name}</h2><div className="mt-4 space-y-3">{overview.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="text-[15px] leading-8 text-slate-600">{paragraph}</p>)}</div>{highlights.length > 0 && <div className="mt-6 grid gap-5 sm:grid-cols-2">{highlights.map(highlight => <div key={highlight.title} className="border-l-2 border-[#dab16c] pl-4"><h3 className="text-sm font-bold leading-6 text-[#102b40]">{highlight.title}</h3><p className="mt-1 text-sm leading-7 text-slate-500">{highlight.description}</p></div>)}</div>}</div>
        <div className="rounded-xl bg-[#f0f5f6] p-5"><h3 className="text-base font-bold text-[#102b40]">Plan your study route</h3><dl className="mt-4 space-y-4 text-sm">{[['Location', university.city + ', ' + university.country], ['Intake months', intakeMonths.join(', ')], ['Teaching languages', languages.join(' / ') || generalDetails.languages.join(' / ')], ['Selected program', selected?.name]].filter(([,value]) => value).map(([label,value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-medium leading-6 text-[#102b40]">{value}</dd></div>)}</dl><a href="#university-enquiry" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#174f7a]">Review my study options<ArrowRight size={15} /></a></div></div>
      </section>

        <section {...panelProps('programs')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} programs & majors</h2><p className="mt-2 text-sm leading-7 text-slate-500">Choose a study level, major and medium of instruction to find your course.</p>
          {!programs.length && <div className="mt-6"><p className="text-sm leading-7 text-slate-600">{generalDetails.degrees.join(' · ')}{generalDetails.languages.length ? ` · ${generalDetails.languages.join(' / ')}` : ''}</p><h3 className="mb-4 mt-5 font-semibold">Listed subject areas</h3><PlainList items={generalDetails.majors} empty="Request the program catalogue for your subject." /><p className="mt-4 text-xs leading-6 text-slate-500">Confirm which degree level and teaching language apply to your chosen subject.</p></div>}
          {programs.length > 0 && <><UniversityProgramTable programs={programs} onChoose={value => { chooseProgram(value); openPanel('admission'); }} /><details open={filtersOpen} onToggle={event => { setFiltersOpen(event.currentTarget.open); if (event.currentTarget.open) setFiltersMounted(true); }} className="mt-5 rounded-lg border border-slate-200 p-4 sm:p-5"><summary className="cursor-pointer text-sm font-semibold text-[#174f7a]">Filter programs by degree, subject and teaching language</summary>{(filtersOpen || filtersMounted) && <UniversityPrograms name={university.name} programs={programs} level={level} query={query} selectedId={selectedId} onLevel={chooseLevel} onQuery={setQuery} onProgram={value => { chooseProgram(value); openPanel('admission'); }} />}</details></>}

          {selected && <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs text-slate-500">Selected program</p><h3 className="mt-1.5 text-base font-semibold text-[#102b40]">{selected.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{[selected.duration, selected.languages.join(' / ')].filter(Boolean).join(' · ')}</p><div className="mt-3 flex flex-wrap gap-x-6"><button type="button" onClick={() => openPanel('fees')} className={textAction}>Fees & ClearCost<ArrowRight size={16} /></button><button type="button" onClick={() => openPanel('documents')} className={textAction}>Documents required<ArrowRight size={16} /></button></div></div>}
        </section>

        <section {...panelProps('scholarships')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} scholarships</h2>{scholarshipOptions.length > 0 ? <><p className="mt-3 text-sm leading-7 text-slate-600">Compare coverage, tuition reductions, eligibility and renewal conditions for each funding route.</p><UniversityFundingTable options={scholarshipOptions} onChoose={estimateScholarship} /><details className="mt-5 rounded-lg border border-slate-200 p-4 sm:p-5"><summary className="cursor-pointer text-sm font-semibold text-[#174f7a]">Scholarship eligibility, renewal and application details</summary><UniversityScholarships options={scholarshipOptions} programs={programs} onEstimate={estimateScholarship} onDocuments={() => openPanel('documents')} /></details></> : hasDetailedPrograms ? <div className="mt-6">{programPicker('scholarships')}{selected ? <><h3 className="mb-4 text-base font-semibold text-[#102b40]">{selected.name}</h3><PlainList items={programScholarships} empty="A scholarship amount has not been confirmed for this program. Budget with full tuition until you have a written award." /></> : noSelection}</div> : university.scholarships.length > 0 ? <div className="mt-6 divide-y divide-slate-200">{university.scholarships.map((scholarship, index) => <article key={`${scholarship.title}-${index}`} className="py-6 first:pt-0"><h3 className="text-lg font-semibold text-[#102b40]">{scholarship.title}</h3>{scholarship.amount && <p className="mt-3 text-lg font-medium text-[#287465]">{scholarship.amount}</p>}{scholarship.coverage && <p className="mt-3 text-sm leading-7 text-slate-600">{scholarship.coverage}</p>}<div className="mt-4"><PlainList items={scholarship.details} /></div>{scholarship.condition && <p className="mt-4 text-sm leading-7 text-slate-500"><strong className="font-semibold">Eligibility: </strong>{scholarship.condition}</p>}{scholarship.renewal && <p className="mt-3 text-sm leading-7 text-slate-500"><strong className="font-semibold">Renewal: </strong>{scholarship.renewal}</p>}</article>)}</div> : <p className={`mt-5 ${mutedClass}`}>A scholarship amount has not been confirmed for the listed programs. Plan with the full tuition fee until you have a written award.</p>}
        </section>

        <section {...panelProps('fees')} className="space-y-6">
          <div className="grid items-center gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] [&_label]:mb-0"><div><h2 className={titleClass}>{shortName} fees & ClearCost</h2><p className="mt-2 text-sm leading-7 text-slate-500">Choose your program and plan when you pay.</p></div>{programPicker('fees')}{!selected && <p className={mutedClass}>Request a program-specific fee sheet to build your ClearCost plan.</p>}</div>
          {feePreviews.length > 0 && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{feePreviews.map(fee => <div key={fee.level} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs text-slate-500">{LEVEL_LABELS[fee.level]} tuition</p><p className="mt-2 text-xl font-bold tabular-nums text-[#102b40]">{fee.amount}</p><p className="mt-1 text-xs text-slate-500">{fee.period} · before scholarship</p></div>)}</div>}
          {!selected && generalFeeTable}
          {selected && <details id="clearcost-planner" open={costOpen} onToggle={event => { setCostOpen(event.currentTarget.open); if (event.currentTarget.open) setCostMounted(true); }} className="scroll-mt-48 rounded-xl border border-[#c5d9df] bg-white"><summary className="cursor-pointer p-5 text-base font-bold text-[#174f7a]">Build your personal ClearCost plan</summary><div className="border-t border-slate-200 p-3 sm:p-5">{(costOpen || costMounted) && <UniversityClearCost key={selected.id} university={university} programs={[]} programDetails={[selected]} scholarshipOptions={scholarshipOptions} selectedScholarshipId={scholarshipScenario?.id || ''} onScholarshipChange={chooseScholarship} scholarshipScenario={activeScenario && (activeScenario.tuitionReduction || activeScenario.feeWaivers?.length) ? { id: activeScenario.id, title: activeScenario.title, ...(activeScenario.tuitionReduction || { type: 'fixed' as const, value: 0 }), feeWaivers: activeScenario.feeWaivers } : undefined} hideProgramPicker servicePackages={servicePackages} fees={[]} scholarships={university.scholarships} costPlans={[]} assessmentHref={assessmentHref} />}</div></details>}
          {selected && <details open className={sheetClass}><summary className="min-h-11 cursor-pointer text-lg font-semibold leading-7 text-[#102b40]">All program fees & payment conditions</summary><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Review the full fee schedule for {selected.name}.</p><div className="grid gap-8 lg:grid-cols-2">{(['before_china', 'in_china'] as const).map(stage => <div key={stage}><h3 className="border-b border-slate-200 pb-3 text-base font-semibold text-[#102b40]">{stage === 'before_china' ? 'Before China' : 'In China'}</h3><dl className="divide-y divide-slate-100">{selected.fees.filter(fee => fee.stage === stage).map((fee, index) => <div key={`${fee.key}-${index}`} className="py-4"><div className="flex items-start justify-between gap-5 text-sm"><dt className="text-slate-600">{fee.item}{fee.optional && <span className="mt-1 block text-xs text-slate-500">If applicable</span>}</dt><dd className="text-right font-medium tabular-nums leading-6 text-slate-800">{feeText(fee)}</dd></div>{fee.notes && <details className="mt-2 text-sm leading-7 text-slate-500"><summary className="min-h-7 cursor-pointer text-xs font-medium">Fee conditions</summary><p className="mt-2">{fee.notes}</p></details>}</div>)}{selected.fees.filter(fee => fee.stage === stage).length === 0 && <p className="py-5 text-sm leading-7 text-slate-500">Fee amounts for this stage have not been specified.</p>}</dl>{stage === 'before_china' && <p className="mt-4 text-sm leading-7 text-slate-500">Select an EduExpress Package in the calculator to include its published fee automatically.</p>}</div>)}</div></details>}
        </section>

      <section {...panelProps('admission')} className={sheetClass}>
        <h2 className={titleClass}>{shortName} admission requirements</h2><p className="mt-3 text-sm leading-7 text-slate-500">Compare the academic qualifications and language evidence for your chosen degree.</p>
        <UniversityEntrySummary programs={programs} selectedId={selectedId} />
        {!programs.some(program => program.qualifications.length || program.languageRequirements.length) && <p className="mt-4 text-sm leading-7 text-slate-600">Tell us your chosen course and current qualification for a program-specific admission review.</p>}
        <div className="mt-5 flex flex-wrap gap-5"><a href="#documents" className={textAction}>View application documents<ArrowRight size={16} /></a><a href={assessmentHref} className={applyClass}>Apply with EduExpress International<ArrowRight size={16} /></a></div>
      </section>

        <section {...panelProps('documents')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} documents required</h2><p className="mb-6 mt-2 text-sm leading-7 text-slate-500">Prepare your admission application with the right documents for your program.</p>{programPicker('documents')}{!programs.length && <PlainList items={generalDetails.documents} empty="Request the admission document checklist for your chosen program." />}{selected ? <UniversityDocuments documents={selected.documents} programName={selected.name} applyHref={assessmentHref} /> : noSelection}
        </section>

        <section {...panelProps('rankings')} className={sheetClass}>
          <h2 className={titleClass}>{shortName} rankings</h2><p className="mt-2 text-sm leading-7 text-slate-500">Explore {shortName}’s position in global and subject rankings.</p>{rankings.length > 0 ? <div className="mt-6"><table className="w-full text-left text-sm"><caption className="sr-only">Published university rankings</caption><thead><tr className="border-b border-slate-200 text-xs text-slate-500"><th scope="col" className="pb-3 pr-4 font-medium">Ranking & scope</th><th scope="col" className="pb-3 text-right font-medium">Position</th></tr></thead><tbody>{rankings.map((ranking, index) => <tr key={`${ranking.publisher}-${index}`} className="border-b border-slate-100 last:border-0"><th scope="row" className="py-5 pr-5 font-medium leading-7 text-slate-700">{ranking.publisher}<span className="mt-1 block text-xs font-normal leading-6 text-slate-500">{ranking.rankingName}{ranking.subject ? ` · ${ranking.subject}` : ''}</span><span className="mt-1 block text-xs font-normal text-[#287465]">{ranking.scope === 'world' ? 'Overall world ranking' : ranking.scope === 'subject' ? 'Subject ranking' : 'National ranking'}</span></th><td className="py-5 text-right align-top text-lg font-semibold tabular-nums text-[#102b40]">{ranking.rank}</td></tr>)}</tbody></table></div> : <p className={`mt-6 ${mutedClass}`}>A published world ranking is not available for this profile.</p>}<p className="mt-5 text-sm leading-7 text-slate-500">Rankings measure different aspects of a university. Consider your subject, degree recognition and entry requirements alongside its position.</p>
        </section>
      <section id="questions" aria-labelledby="university-questions" className={sheetClass}>
        <h2 id="university-questions" className={titleClass}>{shortName}: frequently asked questions</h2><div className="mt-5 divide-y divide-slate-200">{[
          { question: 'Where is ' + university.name + '?', answer: university.name + ' is located in ' + university.city + ', ' + university.country + '.' },
          { question: 'What are the tuition fees at ' + shortName + '?', answer: feePreviews.length ? feePreviews.map(fee => LEVEL_LABELS[fee.level] + ': ' + fee.amount + ' ' + fee.period).join('; ') + '. These are tuition amounts before scholarship. Accommodation and other required costs are separate.' : 'Tuition depends on the selected degree and course. Use the program list and fee section to plan the full cost with EduExpress.' },
          { question: 'Can I study in English at ' + shortName + '?', answer: languages.some(language => /english/i.test(language)) ? 'The catalogue includes English-taught options. Each program lists its teaching language, and the admission section explains the English evidence required for the degree.' : 'Check the teaching language for your chosen course in the program list. Our counselors can help match your language preparation to a suitable route.' },
          { question: 'How do I apply from Bangladesh?', answer: 'Choose a program, review its admission documents and ask EduExpress International for a personal eligibility and cost plan. A counselor reviews your academic background and guides your application preparation. The university makes the admission decision.' },
        ].map(item => <details key={item.question} className="py-3"><summary className="cursor-pointer py-2 text-sm font-semibold leading-6 text-[#102b40]">{item.question}</summary><p className="pb-2 pt-2 text-sm leading-7 text-slate-600">{item.answer}</p></details>)}</div>
      </section>
      {university.country.toLowerCase() === 'china' && <section aria-label="Related study guides" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-8"><h2 className="text-xl font-bold text-[#102b40]">Prepare for studying in China</h2><p className="mt-2 text-sm leading-7 text-slate-500">Continue with the practical guides for students from Bangladesh.</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[...(hasMedicalProgram ? [{href:'/mbbs-in-china-bangladesh',label:'MBBS & BMDC pathway guide'}] : []),{href:'/study-in-china-from-bangladesh',label:'Study in China guide'},{href:'/study-in-china-cost-bangladesh',label:'Living and study costs'},{href:'/china-scholarships-bangladesh',label:'China scholarship routes'},{href:'/china-student-visa-bangladesh',label:'Student visa preparation'}].map(link => <Link key={link.href} href={link.href} className="flex min-h-14 items-center justify-between gap-3 rounded-lg bg-[#f0f5f6] p-4 text-sm font-semibold leading-6 text-[#174f7a]">{link.label}<ArrowRight size={15} className="shrink-0" /></Link>)}</div></section>}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-[#082d45] p-6 text-white sm:p-8"><div><h2 className="text-2xl font-bold">Your next step at {shortName}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#ccdae4]">Get help with eligibility, the right program, scholarship conditions and a written study budget.</p></div><a href={assessmentHref} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#efa93d] px-5 text-sm font-bold text-[#08263c]">Get my university plan<ArrowRight size={16} /></a></section>
    </div>
  </article>;
}

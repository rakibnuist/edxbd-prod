'use client';

import { useMemo, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpenCheck, CheckCircle2, ExternalLink, GitCompareArrows, GraduationCap, Languages, MapPin, Search, Sparkles, X } from 'lucide-react';
import { universityIsIndexable } from '@/lib/university-governance';
import { availablePrograms, directoryOptions, emptyDirectoryFilters, filterUniversities, matchingPrograms, readDirectoryFilters, selectedComparisonSlugs, writeDirectoryFilters, type DirectoryFilters } from '@/lib/university-directory';
import type { CleanUniversityRecord } from '@/lib/university-records';

type Props = { initialUniversities: CleanUniversityRecord[] };
const fieldClass = 'mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#08263c] outline-none focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10';
const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));
const sourceLink = (record: CleanUniversityRecord) => [record.officialUrl, ...record.sourceUrls, ...record.programs.map(program => program.sourceUrl)].find(value => value && /^https?:\/\//i.test(value));

function SelectFilter({ label, value, values, onChange, emptyLabel }: { label: string; value: string; values: string[]; onChange: (value: string) => void; emptyLabel?: string }) {
  return <label className="block min-w-0 text-xs font-bold text-slate-600">{label}<select value={value} onChange={event => onChange(event.target.value)} className={fieldClass}><option value="">{emptyLabel || `All ${label.toLowerCase()} options`}</option>{value && !values.includes(value) && <option value={value}>{value} (not in this destination)</option>}{values.map(item => <option key={item} value={item}>{item}</option>)}</select></label>;
}

function SourceContext({ university }: { university: CleanUniversityRecord }) {
  const current = universityIsIndexable(university);
  const source = sourceLink(university);
  return <div className="text-xs leading-5 text-slate-500"><p>{current ? 'Verification current' : university.verificationStatus === 'expired' ? 'Verification expired — needs review' : source ? 'Sources linked; full record under review' : 'Official source review needed'}</p>{source && <a href={source} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-bold text-[#174f7a] underline underline-offset-2">{source === university.officialUrl ? 'University website' : 'View linked source'}<ExternalLink size={11} /><span className="sr-only"> (opens in a new tab)</span></a>}</div>;
}

function UniversityComparison({ universities, filters, onRemove }: { universities: CleanUniversityRecord[]; filters: DirectoryFilters; onRemove: (slug: string) => void }) {
  if (!universities.length) return null;
  const hasAcademicFilters = Boolean(filters.level || filters.language || filters.subject || filters.intake);
  const options = (university: CleanUniversityRecord) => hasAcademicFilters ? matchingPrograms(university, filters) : availablePrograms(university);
  const join = (values: string[], fallback = 'Not recorded') => unique(values).join('; ') || fallback;
  const rows: { title: string; detail: string; value: (university: CleanUniversityRecord) => ReactNode }[] = [
    { title: 'Location', detail: 'City and destination', value: item => [item.city, item.country].filter(Boolean).join(', ') },
    { title: 'Academic fit', detail: 'Recorded program, level and duration', value: item => options(item).length ? <ul className="space-y-3">{options(item).slice(0, 3).map((program, index) => <li key={`${program.name}-${index}`}><strong className="block text-[#08263c]">{program.name}</strong>{join([program.level, program.duration || ''], 'Duration not recorded')}<span className="mt-1 block text-xs text-slate-500">{program.status === 'planned' ? 'Planned / historical record; confirm current offering' : 'Recorded option; confirm current admission'}</span></li>)}{options(item).length > 3 && <li className="text-xs">More options on the university profile.</li>}</ul> : item.programs.length ? 'No non-paused program matches the current academic filters.' : join(item.details.majors, 'Program details need an official source review.') },
    { title: 'Language & entry', detail: 'Check the exact program requirements', value: item => <><p><strong>Teaching:</strong> {join(item.programs.length ? options(item).flatMap(program => program.languages) : item.taught)}</p><p className="mt-2"><strong>Entry requirements:</strong> {join(options(item).flatMap(program => program.eligibility), 'Not recorded — request program-specific eligibility.')}</p></> },
    { title: 'Recognition', detail: 'Registry and professional practice fit', value: item => <>{item.recognitionAuthority || 'Recognition authority not recorded.'}{item.recognitionSourceUrl && /^https?:\/\//i.test(item.recognitionSourceUrl) && <a href={item.recognitionSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block font-bold text-[#174f7a] underline">Check recognition source<span className="sr-only"> (opens in a new tab)</span></a>}<p className="mt-2 text-xs text-slate-500">For regulated careers, check the exact qualification with the relevant professional regulator.</p></> },
    { title: 'Career value', detail: 'Curriculum and intended career', value: () => 'Review the curriculum, practical training and recognition for your intended career with a counselor. A career outcome is not recorded in this directory.' },
    { title: 'Tuition', detail: 'Recorded figures, not a total-cost quote', value: item => <>{options(item).some(program => program.tuition) ? <ul className="space-y-2">{options(item).filter(program => program.tuition).slice(0, 3).map((program, index) => <li key={`${program.name}-${index}`}><strong>{program.name}:</strong> {program.tuition}</li>)}</ul> : item.details.tuition || 'Tuition not recorded.'}<p className="mt-2 text-xs text-slate-500">Confirm the academic year, currency and billing period in the linked source.</p></> },
    { title: 'Total financial reality', detail: 'Housing, living and other required fees', value: item => { const plan = item.costPlans.find(plan => plan.isPublished); return plan?.totalEstimate ? <>{plan.title}: {plan.totalEstimate} ({plan.currency})<p className="mt-2 text-xs">Request a current itemized ClearCost Sheet.</p></> : 'A published full-cost plan is not available. Include accommodation, insurance, living expenses, travel, official fees and EduExpress charges in a written ClearCost Sheet.'; } },
    { title: 'Scholarships', detail: 'Affordability after education fit', value: item => { const scholarships = item.scholarships.filter(option => option.status !== 'closed'); return scholarships.length ? <ul className="space-y-3">{scholarships.slice(0, 3).map((option, index) => <li key={`${option.title}-${index}`}><strong>{option.title}</strong>{option.coverage && <p>{option.coverage}</p>}<p className="mt-1 text-xs text-slate-500">{option.status === 'planned' ? 'Planned / recorded option' : 'Recorded option'} · eligibility, deadline and renewal require confirmation</p></li>)}</ul> : 'No non-closed scholarship option is recorded. This does not establish availability or eligibility.'; } },
    { title: 'Intake & deadline', detail: 'A recorded intake is not an open application', value: item => <><p><strong>Intake:</strong> {join(item.programs.length ? options(item).flatMap(program => program.intakes) : item.intake)}</p><p className="mt-2"><strong>Recorded deadline:</strong> {join(options(item).map(program => program.applicationDeadline || ''), item.deadlines.application || 'Not recorded')}</p><p className="mt-2 text-xs text-slate-500">Historical dates may be closed. Confirm the next application cycle before payment.</p></> },
    { title: 'Visa readiness', detail: 'Documents, funding and timing', value: item => item.country.toLowerCase() === 'china' ? <><Link href="/china-student-visa-bangladesh" className="font-bold text-[#174f7a] underline">Review China X1/X2 visa guidance</Link><p className="mt-2">Check admission documents, funding and your current official visa checklist.</p></> : 'Request the destination-specific visa checklist and a review of document and funding gaps.' },
    { title: 'Student support & safety', detail: 'Housing, welfare and on-campus contacts', value: () => 'Ask for confirmed housing availability, international student office contacts, insurance details and the scope of arrival support.' },
    { title: 'Source & review status', detail: 'Evidence behind the record', value: item => <SourceContext university={item} /> },
  ];
  return <section id="university-comparison" aria-labelledby="comparison-title" className="mt-10 scroll-mt-32 rounded-2xl border border-[#174f7a]/20 bg-white p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#174f7a]">Better Education Standard</p><h2 id="comparison-title" className="mt-2 font-heading text-2xl font-bold">Compare your shortlist</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Compare recognition, academic fit, career value, full cost, visa readiness and student support. Missing information is a question to resolve before choosing.</p></div><Link href="/education-fit-assessment" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#08263c] px-4 text-sm font-bold text-white">Review my education fit <ArrowRight size={15} /></Link></div><p className="mt-4 text-xs leading-5 text-slate-500">Academic rows follow your current study level, subject, language and intake filters. {universities.length === 1 ? 'Add another university to compare side by side.' : 'On a small screen, swipe the table horizontally.'}</p><div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#174f7a]/10" tabIndex={0} role="region" aria-label="University comparison table, scroll horizontally"><table className="w-full table-fixed border-collapse text-left text-sm" style={{ minWidth: `${176 + universities.length * 280}px` }}><caption className="sr-only">Education fit comparison of {universities.map(item => item.name).join(', ')}</caption><thead><tr className="bg-[#f1f7fa]"><th scope="col" className="w-44 border-b border-slate-200 p-4 align-top">What to compare</th>{universities.map(item => <th key={item.id} scope="col" className="min-w-56 border-b border-l border-slate-200 p-4 align-top"><Link href={`/universities/${item.slug}`} className="font-heading text-xl leading-6 hover:underline">{item.name}</Link><button type="button" onClick={() => onRemove(item.slug)} className="mt-3 flex min-h-9 items-center gap-1 text-xs font-bold text-[#174f7a]" aria-label={`Remove ${item.name} from comparison`}><X size={13} />Remove</button></th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.title} className="even:bg-[#f7fafc]"><th scope="row" className="border-b border-slate-100 p-4 align-top font-bold">{row.title}<span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{row.detail}</span></th>{universities.map(item => <td key={item.id} className="break-words border-b border-l border-slate-100 p-4 align-top leading-6 text-slate-600">{row.value(item)}</td>)}</tr>)}</tbody></table></div></section>;
}

export default function UniversitiesClient({ initialUniversities }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlQuery = searchParams.toString();
  const params = useMemo(() => new URLSearchParams(urlQuery), [urlQuery]);
  const filters = useMemo(() => readDirectoryFilters(params), [params]);
  const options = useMemo(() => directoryOptions(initialUniversities, filters.country), [initialUniversities, filters.country]);
  const filtered = useMemo(() => filterUniversities(initialUniversities, filters), [initialUniversities, filters]);
  const comparisonSlugs = useMemo(() => selectedComparisonSlugs(params, initialUniversities), [params, initialUniversities]);
  const comparison = comparisonSlugs.flatMap(slug => initialUniversities.find(item => item.slug === slug) || []);
  const limitValue = params.get('limit') || '12';
  const visible = /^\d+$/.test(limitValue) ? Math.max(12, Math.min(Number(limitValue), initialUniversities.length || 12)) : 12;

  const updateUrl = (next: URLSearchParams, replace = false) => {
    const query = next.toString();
    const url = `${pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  };
  const setFilters = (patch: Partial<DirectoryFilters>, replace = false) => updateUrl(writeDirectoryFilters(new URLSearchParams(window.location.search), { ...readDirectoryFilters(new URLSearchParams(window.location.search)), ...patch }), replace);
  const clearFilters = () => setFilters(emptyDirectoryFilters);
  const toggleComparison = (slug: string) => {
    const next = new URLSearchParams(window.location.search);
    const selected = selectedComparisonSlugs(next, initialUniversities);
    const slugs = selected.includes(slug) ? selected.filter(item => item !== slug) : [...selected, slug].slice(0, 3);
    if (slugs.length) next.set('compare', slugs.join(','));
    else next.delete('compare');
    updateUrl(next);
  };
  const chips: { label: string; key: keyof DirectoryFilters }[] = [
    ...(filters.search ? [{ label: `Search: ${filters.search}`, key: 'search' as const }] : []),
    ...(['country', 'city', 'level', 'subject', 'language', 'intake'] as const).filter(key => filters[key]).map(key => ({ label: `${({ country: 'Destination', city: 'City', level: 'Study level', subject: 'Subject', language: 'Language', intake: 'Intake' })[key]}: ${filters[key]}`, key })),
    ...(filters.scholarship ? [{ label: 'Recorded scholarship options', key: 'scholarship' as const }] : []),
  ];
  const removeFilter = (key: keyof DirectoryFilters) => setFilters(key === 'country' ? { country: '', city: '' } : { [key]: key === 'scholarship' ? false : '' });

  return (
    <section className="min-h-[60vh] bg-[#f7fafc] px-5 py-10 sm:px-8 sm:py-14 lg:px-12" aria-label="University search and comparison">
      <div className="mx-auto max-w-[1320px]">
        <div className="rounded-2xl border border-[#174f7a]/15 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block text-xs font-bold text-slate-600 md:col-span-2">University, program or city<span className="relative mt-1.5 block"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={filters.search} onChange={event => setFilters({ search: event.target.value }, true)} placeholder="Search name, subject or location" className="h-12 w-full rounded-xl border border-slate-200 bg-[#f7fafc] pl-11 pr-4 text-sm font-semibold text-[#08263c] outline-none transition focus:border-[#174f7a] focus:ring-4 focus:ring-[#174f7a]/10" /></span></label>
            {options.countries.length > 1 ? <SelectFilter label="Destination" emptyLabel="All destinations" value={filters.country} values={options.countries} onChange={value => setFilters({ country: value, city: '' })} /> : <div className="text-xs font-bold text-slate-600">Destination<p className="mt-1.5 flex min-h-12 items-center rounded-xl bg-[#f1f7fa] px-3 text-sm text-[#08263c]">{options.countries[0] || 'All destinations'}</p></div>}
            <SelectFilter label="City" value={filters.city} values={options.cities} onChange={value => setFilters({ city: value })} emptyLabel="All cities" />
            <SelectFilter label="Study level" value={filters.level} values={options.levels} onChange={value => setFilters({ level: value })} emptyLabel="All study levels" />
            <SelectFilter label="Subject / program" value={filters.subject} values={options.subjects} onChange={value => setFilters({ subject: value })} emptyLabel="All recorded subjects" />
            <SelectFilter label="Teaching language" value={filters.language} values={options.languages} onChange={value => setFilters({ language: value })} emptyLabel="All teaching languages" />
            <SelectFilter label="Recorded intake" value={filters.intake} values={options.intakes} onChange={value => setFilters({ intake: value })} emptyLabel="All recorded intakes" />
          </div>
          <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"><label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600"><input type="checkbox" checked={filters.scholarship} onChange={event => setFilters({ scholarship: event.target.checked })} className="size-4 accent-[#174f7a]" />Has recorded scholarship options</label><label className="flex items-center gap-3 text-xs font-bold text-slate-600">Sort by<select value={filters.sort} onChange={event => setFilters({ sort: event.target.value === 'city' ? 'city' : 'name' })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#08263c] focus:ring-4 focus:ring-[#174f7a]/10"><option value="name">University name</option><option value="city">City</option></select></label></div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Study level, subject, language and intake must match the same non-paused program when program details exist. Recorded intakes and scholarships include historical or planned options; they do not confirm open applications or an award.</p>
          {chips.length > 0 && <div className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">{chips.map(chip => <button key={chip.key} type="button" onClick={() => removeFilter(chip.key)} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full bg-[#e9f7fd] px-3 text-xs font-bold text-[#174f7a]" aria-label={`Remove filter ${chip.label}`}><span className="truncate">{chip.label}</span><X size={13} className="shrink-0" /></button>)}</div>}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><p role="status" aria-live="polite" className="text-sm text-slate-500"><strong className="text-[#08263c]">{filtered.length}</strong> matching university {filtered.length === 1 ? 'record' : 'records'} · Showing {Math.min(visible, filtered.length)}</p>{(chips.length > 0 || filters.sort !== 'name') && <button type="button" onClick={clearFilters} className="min-h-10 text-xs font-black text-[#174f7a] underline underline-offset-2">Clear all filters</button>}</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#174f7a]/15 bg-[#e9f7fd] px-5 py-4"><div className="flex items-center gap-3"><GitCompareArrows size={22} className="shrink-0 text-[#174f7a]" /><div><p className="text-sm font-bold">Compare up to 3 universities</p><p className="mt-1 text-xs text-slate-600" aria-live="polite">{comparison.length} of 3 selected. Your filters and shortlist are saved in this page’s URL.</p></div></div>{comparison.length > 0 && <a href="#university-comparison" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#08263c] px-4 text-xs font-black text-white">View comparison <ArrowRight size={14} /></a>}{comparison.length > 0 && <div className="flex w-full flex-wrap gap-2">{comparison.map(item => <button key={item.id} type="button" onClick={() => toggleComparison(item.slug)} aria-label={`Remove ${item.name} from comparison`} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#174f7a]/15 bg-white px-3 text-xs font-bold text-[#174f7a]">{item.name}<X size={13} /></button>)}</div>}</div>

        {filtered.length ? <>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map(university => {
              const verified = universityIsIndexable(university);
              const programs = filters.level || filters.language || filters.subject || filters.intake ? matchingPrograms(university, filters) : availablePrograms(university);
              const studyLevels = unique(university.programs.length ? programs.map(program => program.level) : university.degree);
              const programNames = unique(programs.map(program => program.name));
              const teaching = unique(university.programs.length ? programs.flatMap(program => program.languages) : university.taught);
              const intakes = unique(university.programs.length ? programs.flatMap(program => program.intakes) : university.intake);
              const scholarships = university.scholarships.filter(item => item.status !== 'closed');
              const selected = comparisonSlugs.includes(university.slug);
              const comparisonFull = comparison.length >= 3 && !selected;
              return <article key={university.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#174f7a]/15 bg-white shadow-sm transition hover:border-[#174f7a]/35 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-[#174f7a]/10 bg-[#f7fafc] px-5 py-3 text-xs font-black uppercase tracking-[.1em]"><span className="flex items-center gap-2 text-[#174f7a]"><MapPin size={13} className="shrink-0" />{[university.city, university.country].filter(Boolean).join(', ')}</span><span className={`shrink-0 rounded-full px-2.5 py-1 ${verified ? 'bg-emerald-50 text-emerald-700' : 'bg-[#e9f7fd] text-[#174f7a]'}`}>{verified ? 'Verification current' : sourceLink(university) ? 'Sources linked' : 'Under verification'}</span></div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start gap-4"><span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#174f7a]/12 bg-white p-2 shadow-sm">{university.logo ? <Image src={university.logo} alt={`${university.name} logo`} width={52} height={52} className="max-h-full max-w-full object-contain" /> : <GraduationCap size={25} className="text-[#174f7a]" />}</span><h2 className="font-heading text-2xl font-bold leading-7"><Link href={`/universities/${university.slug}`} className="hover:text-[#174f7a]">{university.name}</Link></h2></div>
                  <div className="mt-4 flex flex-wrap gap-2">{studyLevels.slice(0, 3).map(item => <span key={item} className="rounded-full bg-[#e9f7fd] px-2.5 py-1 text-xs font-bold text-[#174f7a]">{item}</span>)}</div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">{programNames.length ? programNames.slice(0, 2).map(program => <p key={program} className="flex items-start gap-2"><BookOpenCheck size={15} className="mt-0.5 shrink-0 text-[#174f7a]" />{program}</p>) : <p className="text-xs leading-5">Detailed program information needs a source review.</p>}{programNames.length > 2 && <p className="pl-6 text-xs font-bold text-[#174f7a]">+ {programNames.length - 2} more recorded program options</p>}</div>
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f7fafc] p-3 text-xs"><div><span className="flex items-center gap-1.5 font-bold text-slate-500"><Languages size={13} />Teaching</span><strong className="mt-1 block text-[#08263c]">{teaching.slice(0, 2).join(', ') || 'Not recorded'}</strong></div><div><span className="flex items-center gap-1.5 font-bold text-slate-500"><Sparkles size={13} />Scholarships</span><strong className="mt-1 block text-[#08263c]">{scholarships.length ? `${scholarships.length} recorded option${scholarships.length === 1 ? '' : 's'}` : 'None recorded'}</strong></div></div>
                  <p className="mt-4 text-xs leading-5 text-slate-600"><strong>Recorded tuition:</strong> {unique(programs.map(program => program.tuition || '')).slice(0, 2).join('; ') || university.details.tuition || 'Not recorded — request a written cost plan'}<br /><strong>Recorded intake:</strong> {intakes.join(', ') || 'Not recorded'}</p>
                  <div className="mb-4 mt-3"><SourceContext university={university} /></div>
                  <div className="mt-auto space-y-2"><Link href={`/universities/${university.slug}`} className="inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-[#08263c] px-4 text-sm font-black text-white transition hover:bg-[#174f7a]">View university & programs <ArrowRight size={15} /></Link><button type="button" onClick={() => toggleComparison(university.slug)} disabled={comparisonFull} aria-pressed={selected} aria-label={`${selected ? 'Remove' : 'Add'} ${university.name} ${selected ? 'from' : 'to'} comparison`} className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold focus:ring-4 focus:ring-[#174f7a]/10 ${selected ? 'border-[#174f7a] bg-[#e9f7fd] text-[#174f7a]' : 'border-slate-200 text-slate-600 hover:bg-[#f7fafc]'} disabled:cursor-not-allowed disabled:opacity-50`}><GitCompareArrows size={15} />{selected ? 'Added to comparison' : comparisonFull ? '3 selected — remove one to add' : 'Add to comparison'}</button></div>
                </div>
              </article>;
            })}
          </div>
          {visible < filtered.length && <div className="mt-8 text-center"><button type="button" onClick={() => { const next = new URLSearchParams(window.location.search); next.set('limit', String(visible + 12)); updateUrl(next); }} className="inline-flex min-h-13 items-center gap-2 rounded-xl border-2 border-[#08263c] bg-white px-6 text-sm font-black">Show {Math.min(12, filtered.length - visible)} more <ArrowRight size={15} /></button></div>}
        </> : <div className="mt-7 rounded-2xl border border-dashed border-[#174f7a]/30 bg-white px-6 py-14 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e9f7fd] text-[#174f7a]"><Search size={24} /></span><h2 className="mt-5 font-heading text-2xl font-bold">No recorded program matches every filter</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">Try removing the intake or language filter, or use a broader subject. Missing records do not mean a university has no suitable course; the exact program needs an official source check.</p>{chips.length > 0 && <p className="mt-3 text-xs text-slate-500">Use the filter chips above to remove one requirement at a time.</p>}<div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={clearFilters} className="min-h-12 rounded-xl bg-[#08263c] px-5 text-sm font-black text-white">Clear filters</button><Link href="/education-fit-assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#08263c] px-5 text-sm font-black">Ask for an education fit review <ArrowRight size={15} /></Link></div></div>}

        <UniversityComparison universities={comparison} filters={filters} onRemove={toggleComparison} />
        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-[#dff3fb] p-5 text-sm leading-6 text-slate-600"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-[#174f7a]" /><p><strong className="text-[#08263c]">Before application:</strong> Check the selected program, recognition, current deadline, eligibility and itemized full cost against official sources. A linked source supports the stated fact; it does not verify every field in the profile.</p></div>
      </div>
    </section>
  );
}

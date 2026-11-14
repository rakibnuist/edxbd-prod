'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Award, BookOpen, Check, GraduationCap, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import {
  filterMarchCatalogue,
  sortMarchCatalogue,
  type MarchCatalogueSort,
  type MarchCatalogueUniversity,
  type MarchCatalogueProgramme,
} from '@/lib/march-campaign-catalogue';

type Props = {
  universities: MarchCatalogueUniversity[];
  onChoose: (university: MarchCatalogueUniversity, programme: MarchCatalogueProgramme, major?: string) => void;
};

const filters = [
  ['all', 'All universities'],
  ['foundation', 'Foundation → Bachelor'],
  ['bachelor', 'Direct Bachelor'],
  ['masters', 'Master’s'],
  ['language', 'Language'],
];

function Logo({ university }: { university: MarchCatalogueUniversity }) {
  const wide = university.id === 'wuzhou-university';
  return (
    <div
      className={`relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs ${
        wide ? 'bg-[#0b2b45]' : 'bg-white p-1.5'
      }`}
    >
      <Image
        src={university.logo}
        alt={`${university.name} logo`}
        width={wide ? 316 : 64}
        height={wide ? 82 : 64}
        className={wide ? 'absolute left-1 top-1 h-14 w-auto max-w-none' : 'max-h-12 w-full object-contain'}
        sizes="64px"
      />
    </div>
  );
}

export default function MarchUniversityCatalogue({ universities, onChoose }: Props) {
  const [query, setQuery] = useState('');
  const [route, setRoute] = useState('all');
  const [sort, setSort] = useState<MarchCatalogueSort>('recommended');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [majors, setMajors] = useState<Record<string, string>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const detail = universities.find(university => university.id === detailId);
  const visible = sortMarchCatalogue(filterMarchCatalogue(universities, query, route), sort);

  useEffect(() => {
    const element = dialog.current;
    if (!detailId || !element) return;
    const previous = document.body.style.overflow;
    element.showModal();
    element.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      if (element.open) element.close();
    };
  }, [detailId]);

  const choose = (university: MarchCatalogueUniversity, programme: MarchCatalogueProgramme) => {
    dialog.current?.close();
    setDetailId(null);
    onChoose(university, programme, majors[programme.id]);
  };

  return (
    <section
      id="study-options"
      aria-labelledby="study-options-title"
      className="scroll-mt-16 bg-[#f8fafc] px-5 py-14 sm:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime-deep">
              March 2027 University Directory
            </span>
            <h2
              id="study-options-title"
              className="mt-3 font-display text-[32px] font-black leading-[1.02] tracking-tight text-petrol-800 sm:text-[42px]"
            >
              Explore your March study options.
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-7 text-slate-600">
              Compare all {universities.length} universities in our March 2027 shortlist. Inspect rankings, tuition fees, scholarship tiers, and majors before choosing your route.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-2xl border border-[#cfe7f5] bg-white px-4 py-2.5 text-xs font-bold text-[#12436b] shadow-2xs">
            <BookOpen size={16} className="text-[#2c6a97]" />
            {universities.length} universities · {universities.reduce((n, u) => n + u.programmes.length, 0)} routes
          </span>
        </div>

        {/* Search & Filter Control Box */}
        <div className="mt-7 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <label htmlFor="march-university-search" className="sr-only">
                Search universities, cities or majors
              </label>
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-3.5 text-slate-400" />
                <input
                  id="march-university-search"
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search university name, city (e.g. Wuhan, Shanghai, Chongqing) or major…"
                  className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50/60 pl-11 pr-4 text-sm font-medium text-[#0b2b45] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#12436b] focus:bg-white focus:ring-3 focus:ring-[#12436b]/15"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <label htmlFor="march-university-sort" className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500">
                Sort by
              </label>
              <select
                id="march-university-sort"
                value={sort}
                onChange={event => setSort(event.target.value as MarchCatalogueSort)}
                className="h-12 min-h-12 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-[#12436b] outline-none transition focus:border-[#12436b] focus:ring-3 focus:ring-[#12436b]/15"
              >
                <option value="recommended">Recommended</option>
                <option value="world-ranking">World ranking: highest first</option>
                <option value="china-ranking">China ranking: highest first</option>
                <option value="fees-low">Starting fee: low to high</option>
                <option value="fees-high">Starting fee: high to low</option>
                <option value="name">University name: A–Z</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Programme category">
              <SlidersHorizontal size={16} className="mr-1 hidden text-slate-400 sm:block" />
              {filters.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={route === value}
                  onClick={() => setRoute(value)}
                  className={`min-h-10 rounded-xl border px-3.5 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12436b] ${
                    route === value
                      ? 'border-[#12436b] bg-[#12436b] text-white shadow-2xs'
                      : 'border-slate-200 bg-slate-50/70 text-[#12436b] hover:border-[#cfe7f5] hover:bg-[#e3f0f9]'
                  }`}
                >
                  {label}
                </button>
              ))}
              {(query || route !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setRoute('all');
                  }}
                  className="min-h-10 px-2.5 text-xs font-bold text-slate-500 underline hover:text-petrol-800"
                >
                  Clear filters
                </button>
              )}
            </div>

            <p role="status" className="text-xs font-semibold text-slate-500">
              Showing {visible.length} {visible.length === 1 ? 'university' : 'universities'}
              {sort.startsWith('fees-') && <span className="ml-1.5">· Starting CNY amount; billing period shown below</span>}
            </p>
          </div>
        </div>

        {/* 17 University Cards Grid */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map(university => {
            const programmes = university.programmes;
            const first = programmes[0];
            const subjects = [...new Set(programmes.flatMap(programme => programme.majors))];
            return (
              <article
                key={university.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#12436b]/35 hover:shadow-[0_18px_40px_rgba(15,58,92,.10)]"
              >
                {/* Card Header */}
                <div className="flex items-start gap-3.5 border-b border-slate-100 p-5">
                  <Logo university={university} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-petrol-800">
                        {university.acronym}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                        <MapPin size={12} className="shrink-0 text-[#2c6a97]" />
                        {university.city}, China
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[17px] font-bold leading-snug tracking-tight text-[#0b2b45]">
                      {university.name}
                    </h3>
                  </div>
                </div>

                {/* Ranking Bar */}
                <div className="border-b border-slate-100 bg-[#f8fafc] px-5 py-2.5">
                  {university.ranking ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12436b]">
                        <Award size={15} className="shrink-0 text-amber-600" />
                        {university.ranking.value}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#2c6a97] ring-1 ring-slate-200/80">
                        {university.ranking.publisher}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12436b]">
                        <GraduationCap size={15} className="shrink-0 text-[#2c6a97]" />
                        Art & design specialist institution
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/80">
                        Public Academy
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Route Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set(programmes.map(programme => programme.route))].map(item => (
                      <span
                        key={item}
                        className="rounded-lg bg-[#e3f0f9] px-2.5 py-1 text-xs font-bold text-[#12436b]"
                      >
                        {
                          (
                            {
                              foundation: 'Foundation → Degree',
                              bachelor: 'Bachelor',
                              masters: 'Master’s',
                              language: 'Language',
                            } as Record<string, string>
                          )[item]
                        }
                      </span>
                    ))}
                  </div>

                  {/* Tuition Fee Box */}
                  <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-2.5">
                    {programmes.map(programme => (
                      <div key={programme.id} className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-600">{programme.tuitionLabel}</p>
                        <p className="shrink-0 text-base font-black tracking-tight text-[#0b2b45]">
                          {programme.tuition}
                          <span className="ml-1 text-[11px] font-medium text-slate-500">/ {programme.period}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Scholarship Highlight Box */}
                  <div className="mt-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <Sparkles size={13} className="shrink-0 text-emerald-700" />
                        Scholarship & funding
                      </span>
                      <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#12436b]">
                        {first.fundingStage}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] font-bold leading-5 text-emerald-950">
                      {first.fundingHighlight}
                    </p>
                  </div>

                  {/* Major Interests */}
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {first.route === 'language' ? 'Course focus' : `Available majors (${subjects.length})`}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-600">
                      {subjects.join(' · ')}
                    </p>
                  </div>

                  {/* Card Footer CTAs */}
                  <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
                    <button
                      type="button"
                      onClick={() => setDetailId(university.id)}
                      aria-label={`View details for ${university.name}`}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-[#0b2b45] transition hover:border-[#12436b] hover:bg-slate-50"
                    >
                      View details
                      <ArrowRight size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => choose(university, first)}
                      aria-label={`Get a study plan for ${university.name}`}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#12436b] px-3 text-xs font-bold text-white transition hover:bg-[#0b2b45]"
                    >
                      Get my plan
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-bold text-petrol-800">No matching study options.</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try a university name, a broader subject or another programme category.
            </p>
          </div>
        )}

        <p className="mt-6 max-w-4xl text-xs leading-6 text-slate-500">
          Click &ldquo;View details&rdquo; on any university card to inspect full scholarship tiers, bachelor progression rules, accommodation costs, and entry requirements.
        </p>

        {/* University Full Dossier Modal */}
        <dialog
          ref={dialog}
          onClose={() => setDetailId(null)}
          onClick={event => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          aria-labelledby="march-detail-title"
          className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-3xl bg-white p-0 text-[#0b2b45] shadow-2xl backdrop:bg-[#071e30]/70 backdrop:backdrop-blur-xs"
        >
          {detail && (
            <>
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur-md sm:p-6">
                <div className="flex items-center gap-3.5">
                  <Logo university={detail} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-petrol-800">
                        {detail.acronym}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{detail.city}, China</span>
                    </div>
                    <h2 id="march-detail-title" className="mt-1 text-lg font-bold leading-snug sm:text-xl">
                      {detail.name}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  aria-label="Close university details"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {detail.ranking && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-slate-200/80 bg-[#f8fafc] px-4 py-3">
                    <strong className="inline-flex items-center gap-2 text-sm font-bold text-[#12436b]">
                      <Award size={18} className="text-amber-600" />
                      {detail.ranking.value}
                    </strong>
                    <p className="text-xs font-medium leading-6 text-slate-600">
                      {detail.ranking.publisher} · {detail.ranking.rankingName}
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-6">
                  {detail.programmes.map(programme => (
                    <section key={programme.id} className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="border-b border-slate-200 bg-gradient-to-r from-[#0b2b45] to-[#12436b] px-5 py-4 text-white">
                        <span className="rounded-md bg-lime/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-lime">
                          {programme.duration} · {programme.teachingLanguage}
                        </span>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-white">{programme.name}</h3>
                        <p className="mt-1 text-xs text-white/80">{programme.entry}</p>
                      </div>

                      <div className="space-y-5 p-5">
                        {programme.professionalNote && (
                          <p className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs font-medium leading-6 text-amber-950">
                            {programme.professionalNote}
                          </p>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {programme.tuitionLabel}
                            </p>
                            <p className="mt-1.5 text-2xl font-black text-[#12436b]">{programme.tuition}</p>
                            <p className="text-xs font-medium text-slate-500">Per {programme.period}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Accommodation & other fees
                            </h4>
                            <p className="mt-1.5 text-xs leading-6 text-slate-600">{programme.extra}</p>
                          </div>
                        </div>

                        {programme.costItems.length > 0 && (
                          <div>
                            <h4 className="mb-3 text-sm font-bold text-[#0b2b45]">Itemised university costs</h4>
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                              <table className="w-full table-fixed text-left text-xs">
                                <thead className="bg-[#e3f0f9] text-[#12436b]">
                                  <tr>
                                    <th className="w-[58%] px-4 py-3 font-bold">Cost item</th>
                                    <th className="px-4 py-3 font-bold">Amount / billing period</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {programme.costItems.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-3 align-top leading-6 text-slate-700">
                                        <span className="font-medium">{item.item}</span>
                                        {item.note && (
                                          <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 align-top font-bold leading-6 text-[#12436b]">
                                        {item.amount}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                            {programme.fundingStage}
                          </p>
                          <h4 className="text-base font-bold text-emerald-950">{programme.awardTitle}</h4>
                          <p className="mt-1.5 text-xs leading-6 text-emerald-900">{programme.scholarship}</p>
                          {programme.scholarshipTiers.length > 0 && (
                            <dl className="mt-3 divide-y divide-emerald-200/70 border-t border-emerald-200/70 pt-2">
                              {programme.scholarshipTiers.map((item, index) => (
                                <div key={index} className="grid gap-1 py-2.5 sm:grid-cols-[.4fr_1fr] sm:gap-4">
                                  <dt className="text-xs font-bold leading-6 text-emerald-950">{item.name}</dt>
                                  <dd className="text-xs leading-6 text-emerald-900">{item.coverage}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                          <p className="mt-3 border-t border-emerald-200/70 pt-3 text-xs font-medium leading-6 text-emerald-950">
                            {programme.scholarshipConditions}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-[#0b2b45]">Entry requirements</h4>
                          <p className="mt-1.5 text-xs leading-6 text-slate-600">{programme.eligibility}</p>
                          {programme.csca && (
                            <p className="mt-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs leading-6 text-slate-700">
                              <strong className="text-[#12436b]">CSCA requirement: </strong>
                              {programme.csca}
                            </p>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-[#0b2b45]">
                            {programme.route === 'language'
                              ? 'Course modules'
                              : programme.id === 'hust-foundation'
                              ? 'Foundation subjects'
                              : programme.route === 'foundation'
                              ? 'Degree progression majors'
                              : 'Major list'}
                          </h4>
                          {programme.majorGroups.length > 0 ? (
                            programme.majorGroups.map(group => (
                              <div key={group.label} className="mt-3.5">
                                <h5 className="text-xs font-bold text-[#12436b]">{group.label}</h5>
                                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                                  {group.majors.map(major => (
                                    <li key={major} className="flex items-start gap-2 text-xs leading-6 text-slate-600">
                                      <Check size={14} className="mt-1 shrink-0 text-emerald-600" />
                                      <span>{major}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          ) : (
                            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                              {programme.majors.map(major => (
                                <li key={major} className="flex items-start gap-2 text-xs leading-6 text-slate-600">
                                  <Check size={14} className="mt-1 shrink-0 text-emerald-600" />
                                  <span>{major}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {programme.documentChecklist.length > 0 && (
                          <details className="rounded-xl border border-slate-200 bg-slate-50/60 px-4">
                            <summary className="cursor-pointer py-3.5 text-xs font-bold text-[#12436b]">
                              Admission document checklist ({programme.documentChecklist.length} items)
                            </summary>
                            <ul className="mb-3 list-disc space-y-1.5 pl-4 text-xs leading-6 text-slate-600">
                              {programme.documentChecklist.map(item => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                            <p className="mb-3 text-xs leading-5 text-slate-500">
                              For self-funded and scholarship applicants; the programme determines the final requirements.
                            </p>
                          </details>
                        )}

                        {programme.route !== 'language' && programme.id !== 'hust-foundation' && (
                          <div>
                            <label htmlFor={`major-${programme.id}`} className="text-xs font-bold text-[#0b2b45]">
                              Your major interest <span className="font-normal text-slate-500">(optional)</span>
                            </label>
                            <select
                              id={`major-${programme.id}`}
                              value={majors[programme.id] || ''}
                              onChange={event =>
                                setMajors(current => ({ ...current, [programme.id]: event.target.value }))
                              }
                              className="mt-1.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-medium outline-none focus:border-[#12436b] focus:ring-3 focus:ring-[#12436b]/15"
                            >
                              <option value="">Help me choose a major</option>
                              {programme.majors.map(major => (
                                <option key={major}>{major}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => choose(detail, programme)}
                          className="ed-btn ed-btn-signal inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-petrol-800 shadow-xs"
                        >
                          Get my plan for this programme
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </section>
                  ))}
                </div>

                <p className="mt-5 text-xs leading-6 text-slate-500">
                  We match your academic profile to the programme, confirm scholarship conditions and prepare an itemised cost plan before file processing.
                </p>
              </div>
            </>
          )}
        </dialog>
      </div>
    </section>
  );
}

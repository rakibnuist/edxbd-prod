'use client';

import { useState } from 'react';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import { scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import { ArrowRight, Clock, Globe2, Sparkles, CheckCircle2, Search, Home, GraduationCap, Languages } from 'lucide-react';

const LEVEL_NAMES: Record<ProgramLevel, string> = {
  Bachelor: "Bachelor’s",
  Master: "Master’s",
  PhD: 'PhD',
  Language: 'Language',
  Foundation: 'Foundation',
  Diploma: 'Diploma',
};

/** Interactive, SEO-friendly program catalogue with instant level/language/keyword filtering and hostel fee preview. */
export function UniversityProgramTable({
  programs,
  selectedId,
  onChoose,
}: {
  programs: UniversityProgramDetail[];
  selectedId?: string;
  onChoose: (id: string) => void;
}) {
  const [activeLevel, setActiveLevel] = useState<ProgramLevel | 'ALL'>('ALL');
  const [activeLang, setActiveLang] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const availableLevels = PROGRAM_LEVELS.filter((lvl) =>
    programs.some((p) => normalizeProgramLevel(p.level) === lvl)
  );
  const allLanguages = [...new Set(programs.flatMap((p) => p.languages).filter(Boolean))];

  const filtered = programs.filter((program) => {
    if (activeLevel !== 'ALL' && normalizeProgramLevel(program.level) !== activeLevel) return false;
    if (activeLang !== 'ALL' && !program.languages.some((l) => l.toLowerCase() === activeLang.toLowerCase())) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const hay = `${program.name} ${program.level} ${program.school || ''} ${program.languages.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const renderRows = (rows: UniversityProgramDetail[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Programs, teaching languages, duration, accommodation and tuition before scholarship</caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th scope="col" className="px-5 py-3.5">Degree & Major</th>
            <th scope="col" className="px-4 py-3.5">Duration & Medium</th>
            <th scope="col" className="px-4 py-3.5 text-right">Annual Tuition</th>
            <th scope="col" className="hidden md:table-cell px-4 py-3.5 text-right">Hostel / Dorm</th>
            <th scope="col" className="px-4 py-3.5 text-right">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((program) => {
            const fee = program.fees.find((item) => item.key === 'tuition' && !item.optional);
            const hostel = program.fees.find(
              (item) => item.key === 'housing' || /accommodation|hostel|dorm/i.test(item.item)
            );
            const isSelected = selectedId === program.id;

            return (
              <tr
                id={`course-${encodeURIComponent(program.id)}`}
                key={program.id}
                onClick={() => onChoose(program.id)}
                className={`group cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-emerald-50/60 hover:bg-emerald-50/80'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                <th scope="row" className="px-5 py-4 font-normal">
                  <div className="flex items-start gap-2.5">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChoose(program.id);
                        }}
                        className="text-left font-bold text-slate-900 group-hover:text-emerald-800 transition-colors block text-[15px] leading-snug"
                      >
                        {program.name}
                      </button>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-block rounded-md bg-petrol-800/10 px-2 py-0.5 text-[11px] font-bold text-petrol-800">
                          {program.level}
                        </span>
                        {program.intake && (
                          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                            Intake: {program.intake}
                          </span>
                        )}
                        {program.school && (
                          <span className="text-[11px] text-slate-500">· {program.school}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Clock size={13} className="text-emerald-700 shrink-0" />
                    <span>{program.duration || '4 years'}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-slate-500">
                    <Globe2 size={13} className="text-slate-400 shrink-0" />
                    <span>{program.languages.join(' / ') || 'English'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="block text-sm font-bold tabular-nums text-slate-900">
                    {fee ? feeText(fee) : 'Ask counselor'}
                  </span>
                  <span className="block text-[11px] text-slate-400">before scholarship</span>
                </td>
                <td className="hidden md:table-cell px-4 py-4 text-right">
                  <span className="block text-xs font-semibold tabular-nums text-slate-700">
                    {hostel ? feeText(hostel) : 'Campus dorms'}
                  </span>
                  <span className="block text-[11px] text-slate-400">on-campus housing</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChoose(program.id);
                    }}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-petrol-800 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        Viewing <CheckCircle2 size={12} />
                      </>
                    ) : (
                      <>
                        View Fees <ArrowRight size={12} />
                      </>
                    )}
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
    <div className="space-y-4">
      {/* Easy-to-use Filter & Search Bar */}
      {(availableLevels.length > 1 || allLanguages.length > 1 || programs.length > 3) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveLevel('ALL')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                activeLevel === 'ALL'
                  ? 'bg-petrol-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-petrol-800'
              }`}
            >
              All Levels ({programs.length})
            </button>
            {availableLevels.map((lvl) => {
              const count = programs.filter((p) => normalizeProgramLevel(p.level) === lvl).length;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setActiveLevel(lvl)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                    activeLevel === lvl
                      ? 'bg-petrol-800 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-petrol-800'
                  }`}
                >
                  {LEVEL_NAMES[lvl]} ({count})
                </button>
              );
            })}
            {allLanguages.length > 1 && (
              <select
                aria-label="Filter by medium of instruction"
                value={activeLang}
                onChange={(e) => setActiveLang(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-petrol-800"
              >
                <option value="ALL">All Languages</option>
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}-Taught
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search major (e.g. Computer, Trade)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 outline-none focus:border-petrol-800"
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-xs">
        {filtered.length > 0 ? (
          <>
            {renderRows(filtered.slice(0, 12))}
            {filtered.length > 12 && (
              <details className="border-t border-slate-200 bg-slate-50/60">
                <summary className="cursor-pointer px-5 py-3.5 text-xs font-bold text-petrol-800 hover:text-emerald-700">
                  Show all {filtered.length} matching programs ({filtered.length - 12} more) ↓
                </summary>
                {renderRows(filtered.slice(12))}
              </details>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No programs match your filter.</p>
            <button
              type="button"
              onClick={() => {
                setActiveLevel('ALL');
                setActiveLang('ALL');
                setSearch('');
              }}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
            >
              Reset filters to show all {programs.length} programs
            </button>
          </div>
        )}
      </div>
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
    <div className="grid gap-4 lg:grid-cols-2">
      {options.map((option) => (
        <article
          key={option.id}
          className="flex flex-col justify-between rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50/60 p-6 shadow-xs transition-all hover:border-emerald-300"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                <Sparkles size={13} className="text-emerald-700" />
                {option.type || 'Scholarship Route'}
              </span>
              <span className="rounded-full bg-petrol-800 px-3 py-1 text-[11px] font-bold text-lime">
                {scholarshipReductionLabel(option) || 'Full or Partial Waiver'}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">
              {option.title || 'Institutional Merit Scholarship'}
            </h3>

            {option.levels.length > 0 && (
              <p className="mt-1 text-xs text-slate-600 font-medium">
                <strong>Eligible Degrees:</strong> {option.levels.join(' · ')}
              </p>
            )}

            {option.coverage.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-200/60 bg-white p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  What This Scholarship Covers
                </p>
                <ul className="mt-2 space-y-1.5">
                  {option.coverage.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs leading-5 text-slate-700 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(option.conditions.length > 0 || option.renewal.length > 0) && (
              <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                {option.conditions.length > 0 && (
                  <div>
                    <strong className="font-bold text-slate-800">Eligibility & Assessment: </strong>
                    <span>{option.conditions.slice(0, 2).join(' ')}</span>
                  </div>
                )}
                {option.renewal.length > 0 && (
                  <div>
                    <strong className="font-bold text-slate-800">Renewal Rule: </strong>
                    <span>{option.renewal.join(' ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-slate-200/80 pt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Assessed on academic transcripts & quota
            </span>
            <button
              type="button"
              onClick={() => onChoose(option)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-petrol-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              Check Scholarship Eligibility <ArrowRight size={13} />
            </button>
          </div>
        </article>
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
  const groups = new Map<
    string,
    { ids: string[]; levelKey: ProgramLevel; level: string; names: string[]; qualifications: string[]; languageRequirements: string[] }
  >();
  for (const program of programs) {
    if (!program.qualifications.length && !program.languageRequirements.length) continue;
    const levelKey = normalizeProgramLevel(program.level);
    const key = levelKey;
    const group = groups.get(key);
    if (group) {
      group.names.push(program.name);
      group.ids.push(program.id);
      for (const q of program.qualifications) {
        if (!group.qualifications.includes(q)) group.qualifications.push(q);
      }
      for (const l of program.languageRequirements) {
        if (!group.languageRequirements.includes(l)) group.languageRequirements.push(l);
      }
    } else {
      groups.set(key, {
        ids: [program.id],
        levelKey,
        level: LEVEL_NAMES[levelKey],
        names: [program.name],
        qualifications: [...program.qualifications],
        languageRequirements: [...program.languageRequirements],
      });
    }
  }

  const allGroups = [...groups.values()];

  if (allGroups.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-petrol-800 flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-700" />
            Academic Qualification Standards
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bachelor’s Applicants:</strong> HSC / A-Level / 4-year Diploma pass with competitive GPA and clean academic transcripts.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Master’s / PhD Applicants:</strong> Recognized Bachelor’s or Master’s degree in a relevant discipline.</span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-petrol-800 flex items-center gap-2">
            <Languages size={16} className="text-emerald-700" />
            English & Language Proficiency
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>English-Taught Programs:</strong> IELTS / TOEFL score or official Medium of Instruction (MOI) certificate where accepted by the faculty.</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allGroups.map((group, index) => {
        const isHighlighted = group.ids.includes(selectedId);
        return (
          <div
            key={index}
            className={`rounded-2xl border p-5 sm:p-6 transition-all ${
              isHighlighted
                ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                : 'border-slate-200/90 bg-slate-50/50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-petrol-800 px-2.5 py-1 text-xs font-bold text-white">
                  {group.level}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {group.level} Programs ({group.names.length} {group.names.length === 1 ? 'major' : 'majors'})
                </h3>
              </div>
              {isHighlighted && (
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-bold text-emerald-900">
                  Active Degree Level
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-petrol-800">
                  <GraduationCap size={15} className="text-emerald-700 shrink-0" />
                  Academic Qualifications
                </h4>
                <ul className="mt-2.5 space-y-2">
                  {(group.qualifications.length > 0
                    ? group.qualifications
                    : ['Recognized secondary (HSC/A-Level) or degree qualification matching the program level.']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm leading-6 text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-petrol-800">
                  <Languages size={15} className="text-emerald-700 shrink-0" />
                  Language Proficiency Requirements
                </h4>
                <ul className="mt-2.5 space-y-2">
                  {(group.languageRequirements.length > 0
                    ? group.languageRequirements
                    : ['English proficiency proof (IELTS/TOEFL or acceptable MOI certificate) depending on teaching medium.']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm leading-6 text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

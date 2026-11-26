'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Globe2,
  GraduationCap,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type {
  PublicCalculatorDestination,
  PublicCalculatorUniversityDetail,
  PublicCalculatorUniversitySummary,
} from '@/lib/calculator-public';
import type { DestinationRegion } from '@/lib/global-study-destinations';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';
import {
  computeScholarshipAdjustedEstimate,
  scholarshipAppliesToProgram,
} from '@/lib/widget-scholarship-math';

type TabKey = 'china' | 'destinations';
type MediumFilter = 'All' | 'English-Taught' | 'Chinese Language' | 'Chinese-Taught';
type ScopeFilter = 'all' | 'active';

type Props = {
  initialTab?: TabKey;
  universities: PublicCalculatorUniversitySummary[];
  initialDetail: PublicCalculatorUniversityDetail | null;
  destinations: PublicCalculatorDestination[];
  activeUniversitiesCount: number;
  chinaUniversitiesCount: number;
};

const LEVEL_FILTERS = [
  'All',
  'Bachelor',
  'MBBS',
  'Master',
  'PhD',
  'Chinese language',
  'Foundation',
  'Diploma',
] as const;

const MEDIUM_FILTERS: MediumFilter[] = [
  'All',
  'English-Taught',
  'Chinese Language',
  'Chinese-Taught',
];

const REGION_FILTERS: Array<'All' | DestinationRegion> = [
  'All',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'Middle East',
];

function formatCny(amount: number): string {
  return `CNY ${Math.round(amount).toLocaleString('en-US')}`;
}

function formatBdt(amount: number): string {
  return `BDT ${Math.round(amount).toLocaleString('en-US')}`;
}

export default function CostCalculatorWidget({
  initialTab = 'china',
  universities,
  initialDetail,
  destinations,
  activeUniversitiesCount,
  chinaUniversitiesCount,
}: Props) {
  const [tab, setTab] = useState<TabKey>(initialTab);

  // China tab state
  const [mediumFilter, setMediumFilter] = useState<MediumFilter>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniSlug, setSelectedUniSlug] = useState<string>(
    initialDetail?.slug ?? universities[0]?.slug ?? '',
  );
  const [selectedProgramKey, setSelectedProgramKey] = useState<string>(
    initialDetail?.programs[0]?.key ?? '',
  );
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('none');
  const [cnyToBdtInput, setCnyToBdtInput] = useState<string>('');

  // In-memory cache of zero-leak university details fetched on demand
  const [detailsBySlug, setDetailsBySlug] = useState<Record<string, PublicCalculatorUniversityDetail>>(
    () => (initialDetail ? { [initialDetail.slug]: initialDetail } : {}),
  );
  const [failedSlugs, setFailedSlugs] = useState<Record<string, boolean>>({});

  // Global Destinations tab state
  const [regionFilter, setRegionFilter] = useState<'All' | DestinationRegion>('All');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('all');
  const [destA, setDestA] = useState<string>(destinations[0]?.slug ?? 'china');
  const [destB, setDestB] = useState<string>(
    destinations.find((d) => d.slug === 'germany')?.slug ?? destinations[1]?.slug ?? 'malaysia',
  );

  // Filter China universities cleanly (no 180-item cap!)
  const filteredUniversities = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return universities.filter((u) => {
      if (mediumFilter === 'English-Taught' && !u.hasEnglishTaught) return false;
      if (mediumFilter === 'Chinese Language' && !u.hasChineseLanguage) return false;
      if (mediumFilter === 'Chinese-Taught' && !u.languages.some((l) => /chinese/i.test(l))) {
        return false;
      }
      if (levelFilter !== 'All' && !u.levels.includes(levelFilter)) return false;
      if (!q) return true;
      return u.searchText.includes(q);
    });
  }, [universities, mediumFilter, levelFilter, searchTerm]);

  const effectiveUniSlug = useMemo(() => {
    if (filteredUniversities.some((u) => u.slug === selectedUniSlug)) return selectedUniSlug;
    return filteredUniversities[0]?.slug ?? '';
  }, [filteredUniversities, selectedUniSlug]);

  const activeDetail = effectiveUniSlug ? (detailsBySlug[effectiveUniSlug] ?? null) : null;
  const loadingUni = Boolean(
    effectiveUniSlug && !detailsBySlug[effectiveUniSlug] && !failedSlugs[effectiveUniSlug],
  );

  // Fetch university detail on demand whenever an uncached university is selected
  useEffect(() => {
    if (!effectiveUniSlug || detailsBySlug[effectiveUniSlug] || failedSlugs[effectiveUniSlug]) {
      return;
    }

    let cancelled = false;
    fetch(`/api/public/calculator-university/${encodeURIComponent(effectiveUniSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PublicCalculatorUniversityDetail | null) => {
        if (cancelled) return;
        if (data) {
          setDetailsBySlug((prev) => ({ ...prev, [effectiveUniSlug]: data }));
        } else {
          setFailedSlugs((prev) => ({ ...prev, [effectiveUniSlug]: true }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailedSlugs((prev) => ({ ...prev, [effectiveUniSlug]: true }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveUniSlug, detailsBySlug, failedSlugs]);

  // Filter programs within selected university
  const universityPrograms = useMemo(() => {
    if (!activeDetail) return [];
    return activeDetail.programs.filter((p) => {
      if (levelFilter !== 'All' && p.level !== levelFilter) return false;
      if (mediumFilter === 'English-Taught' && !p.languages.some((l) => /english/i.test(l))) {
        return false;
      }
      if (
        mediumFilter === 'Chinese Language' &&
        p.level !== 'Chinese language' &&
        !/chinese\s+language/i.test(p.name)
      ) {
        return false;
      }
      if (mediumFilter === 'Chinese-Taught' && !p.languages.some((l) => /chinese/i.test(l))) {
        return false;
      }
      return true;
    });
  }, [activeDetail, levelFilter, mediumFilter]);

  const activeProgram = useMemo(() => {
    return (
      universityPrograms.find((p) => p.key === selectedProgramKey) ||
      universityPrograms[0] ||
      activeDetail?.programs[0] ||
      null
    );
  }, [universityPrograms, selectedProgramKey, activeDetail]);

  // Match scholarships to the selected program
  const matchingScholarships = useMemo(() => {
    if (!activeDetail || !activeProgram) return [];
    return activeDetail.scholarships.filter((s) => scholarshipAppliesToProgram(s, activeProgram));
  }, [activeDetail, activeProgram]);

  const activeScholarship = useMemo(() => {
    if (selectedScholarshipId === 'none') return null;
    return matchingScholarships.find((s) => s.id === selectedScholarshipId) ?? null;
  }, [matchingScholarships, selectedScholarshipId]);

  const estimate = useMemo(() => {
    if (!activeProgram || !activeDetail) return null;
    return computeScholarshipAdjustedEstimate(activeProgram, activeDetail.fees, activeScholarship);
  }, [activeProgram, activeDetail, activeScholarship]);

  const parsedRate = useMemo(() => {
    const num = Number(cnyToBdtInput.trim());
    return Number.isFinite(num) && num > 0 && num < 500 ? num : null;
  }, [cnyToBdtInput]);

  // Filtered global destinations for Tab 2
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      if (scopeFilter === 'active' && d.serviceStatus === 'Benchmark Reference') return false;
      if (regionFilter !== 'All' && d.region !== regionFilter) return false;
      return true;
    });
  }, [destinations, scopeFilter, regionFilter]);

  const activeDeskCount = useMemo(
    () => destinations.filter((d) => d.serviceStatus !== 'Benchmark Reference').length,
    [destinations],
  );

  const rowA =
    filteredDestinations.find((d) => d.slug === destA) ??
    filteredDestinations[0] ??
    destinations[0] ??
    null;
  const rowB =
    filteredDestinations.find((d) => d.slug === destB && d.slug !== rowA?.slug) ??
    filteredDestinations.find((d) => d.slug !== rowA?.slug) ??
    filteredDestinations[0] ??
    destinations[1] ??
    null;

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl bg-[#12436b] px-4 py-3.5 text-white sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#d9f99d] text-[#12436b]">
            <Calculator className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-[15px] font-bold leading-tight sm:text-[16px]">
              Bangladesh Study Abroad Cost &amp; Scholarship Calculator
            </h1>
            <p className="text-[11.5px] text-white/80">
              Verified data across {chinaUniversitiesCount} Chinese universities ({activeUniversitiesCount} active catalog) &amp; {destinations.length} global destinations
            </p>
          </div>
        </div>
        <a
          href="https://eduexpressint.com/compare-costs?utm_source=embed_widget&utm_medium=referral&utm_campaign=cost_calculator"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11.5px] font-semibold text-[#d9f99d] hover:bg-white/20"
        >
          Full tool <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-3 pt-2.5 sm:px-5">
        <button
          type="button"
          onClick={() => setTab('china')}
          className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] font-semibold transition ${
            tab === 'china'
              ? 'border-[#12436b] text-[#12436b]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="size-3.5" aria-hidden="true" />
          China Cost &amp; Scholarships ({chinaUniversitiesCount})
        </button>
        <button
          type="button"
          onClick={() => setTab('destinations')}
          className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] font-semibold transition ${
            tab === 'destinations'
              ? 'border-[#12436b] text-[#12436b]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe2 className="size-3.5" aria-hidden="true" />
          {destinations.length}-Country Global &amp; Scholarship Matrix
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {tab === 'china' ? (
          <div className="space-y-4">
            {/* Teaching Medium & Degree Level Filters */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Medium:
                </span>
                {MEDIUM_FILTERS.map((med) => (
                  <button
                    key={med}
                    type="button"
                    onClick={() => {
                      setMediumFilter(med);
                      setSelectedScholarshipId('none');
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition ${
                      mediumFilter === med
                        ? 'bg-emerald-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {med}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Level:
                </span>
                {LEVEL_FILTERS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setLevelFilter(lvl);
                      setSelectedScholarshipId('none');
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition ${
                      levelFilter === lvl
                        ? 'bg-[#12436b] text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Search + University + Program + Scholarship + Optional BDT rate */}
            <div className="grid gap-3 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <label htmlFor="embed-search" className="block text-[11.5px] font-semibold text-slate-600">
                  Search university, city, or major
                </label>
                <input
                  id="embed-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Nanjing, MBBS, AI, Chinese Language..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-7">
                <label htmlFor="embed-university" className="block text-[11.5px] font-semibold text-slate-600">
                  1. Select University ({filteredUniversities.length} matching)
                </label>
                <select
                  id="embed-university"
                  value={effectiveUniSlug}
                  onChange={(e) => {
                    setSelectedUniSlug(e.target.value);
                    setSelectedProgramKey('');
                    setSelectedScholarshipId('none');
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {filteredUniversities.map((u) => (
                    <option key={u.slug} value={u.slug}>
                      {u.name} ({u.city}) — {u.programCount} prog · {u.scholarshipCount} schol
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="embed-program" className="block text-[11.5px] font-semibold text-slate-600">
                  2. Select Program ({universityPrograms.length})
                </label>
                <select
                  id="embed-program"
                  value={activeProgram?.key ?? ''}
                  onChange={(e) => {
                    setSelectedProgramKey(e.target.value);
                    setSelectedScholarshipId('none');
                  }}
                  disabled={loadingUni || universityPrograms.length === 0}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none disabled:bg-slate-100"
                >
                  {universityPrograms.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name} ({p.level}
                      {p.languages.length ? ` · ${p.languages.join('/')}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="embed-scholarship" className="block text-[11.5px] font-semibold text-slate-600">
                  3. Scholarship Scenario ({matchingScholarships.length} recorded)
                </label>
                <select
                  id="embed-scholarship"
                  value={activeScholarship?.id ?? 'none'}
                  onChange={(e) => setSelectedScholarshipId(e.target.value)}
                  disabled={loadingUni}
                  className="mt-1 w-full rounded-lg border border-emerald-300 bg-emerald-50/40 px-3 py-2 text-[13px] font-medium text-slate-900 focus:border-[#12436b] focus:outline-none disabled:bg-slate-100"
                >
                  <option value="none">No Scholarship (Self-Funded Gross)</option>
                  {matchingScholarships.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="embed-bdt-rate" className="block text-[11.5px] font-semibold text-slate-600">
                  Bank BDT / 1 CNY
                </label>
                <input
                  id="embed-bdt-rate"
                  type="number"
                  step="0.1"
                  min="1"
                  max="500"
                  value={cnyToBdtInput}
                  onChange={(e) => setCnyToBdtInput(e.target.value)}
                  placeholder="Optional rate"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                />
              </div>
            </div>

            {/* Breakdown Table */}
            {loadingUni ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-8 text-[13px] text-slate-600">
                <Loader2 className="size-4 animate-spin text-[#12436b]" aria-hidden="true" />
                Loading verified tuition, fees &amp; scholarships…
              </div>
            ) : activeProgram && activeDetail && estimate ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[14.5px] font-bold text-[#12436b]">
                      {activeDetail.name}
                    </p>
                    <p className="text-[12.5px] text-slate-600">
                      {activeProgram.name} · {activeProgram.level} · {activeDetail.city}
                      {activeProgram.languages.length ? ` · ${activeProgram.languages.join(' / ')}` : ''}
                      {activeProgram.duration ? ` · ${activeProgram.duration}` : ''}
                    </p>
                  </div>
                  <a
                    href={`https://eduexpressint.com/universities/${activeDetail.slug}?utm_source=embed_widget&utm_medium=referral&utm_campaign=cost_calculator`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#12436b] underline underline-offset-2"
                  >
                    University profile <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>

                {/* Selected Scholarship Banner */}
                {activeScholarship && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-950">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <Sparkles className="size-3.5 text-emerald-700" aria-hidden="true" />
                        Selected Scenario: {activeScholarship.title}
                      </span>
                      <span className="rounded-full bg-emerald-700/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        {activeScholarship.category}
                      </span>
                    </div>
                    <p className="mt-1 text-emerald-900">
                      <strong>Recorded coverage:</strong> {activeScholarship.coverageSummary}
                    </p>
                    <p className="mt-0.5 text-[11px] text-emerald-800">
                      <strong>Renewal / condition:</strong> {activeScholarship.renewalNote}
                      {activeScholarship.deadline ? ` · Deadline: ${activeScholarship.deadline}` : ''}
                    </p>
                  </div>
                )}

                <dl className="mt-3 divide-y divide-slate-200/80 text-[13px]">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <dt className="font-medium text-slate-700">Gross Annual Tuition</dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {activeProgram.annualTuitionCny !== null
                        ? formatCny(activeProgram.annualTuitionCny)
                        : activeProgram.tuitionLabel || 'Confirm with university'}
                      {parsedRate && activeProgram.annualTuitionCny !== null ? (
                        <span className="ml-2 text-[11.5px] font-normal text-slate-500">
                          (≈ {formatBdt(activeProgram.annualTuitionCny * parsedRate)})
                        </span>
                      ) : null}
                    </dd>
                  </div>

                  {activeScholarship && (
                    <div className="flex items-center justify-between gap-3 py-1.5 text-emerald-800">
                      <dt className="font-medium">Estimated Tuition Reduction</dt>
                      <dd className="text-right font-semibold">
                        {estimate.tuitionDeductionCny !== null
                          ? `− ${formatCny(estimate.tuitionDeductionCny)}`
                          : estimate.netTuitionCny === 0
                            ? '100% Tuition Waived (CNY 0)'
                            : 'Varies by award tier — confirm in offer letter'}
                      </dd>
                    </div>
                  )}

                  {activeScholarship && estimate.netTuitionCny !== null && (
                    <div className="flex items-center justify-between gap-3 py-1.5">
                      <dt className="font-semibold text-slate-800">Net Annual Tuition After Scholarship</dt>
                      <dd className="text-right font-bold text-emerald-800">
                        {formatCny(estimate.netTuitionCny)}
                        {parsedRate ? (
                          <span className="ml-2 text-[11.5px] font-normal text-slate-500">
                            (≈ {formatBdt(estimate.netTuitionCny * parsedRate)})
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  )}

                  {estimate.feeLines.map((line) => (
                    <div key={line.category} className="flex items-center justify-between gap-3 py-1.5">
                      <dt className="text-slate-600">{line.label}</dt>
                      <dd className="text-right font-medium text-slate-800">
                        {line.waivedByScholarship ? (
                          <span className="font-semibold text-emerald-700">
                            CNY 0 (Waived by scholarship)
                          </span>
                        ) : (
                          <>
                            {line.recordedText}
                            {parsedRate && line.grossCny !== null ? (
                              <span className="ml-2 text-[11.5px] font-normal text-slate-500">
                                (≈ {formatBdt(line.grossCny * parsedRate)})
                              </span>
                            ) : null}
                          </>
                        )}
                      </dd>
                    </div>
                  ))}

                  {/* Gross Total (when scholarship is selected, show gross reference too) */}
                  {activeScholarship && (
                    <div className="flex items-center justify-between gap-3 py-2 text-slate-600">
                      <dt className="font-medium">
                        {estimate.grossTotalCny !== null
                          ? 'Self-Funded Gross 1st-Year Baseline'
                          : 'Self-Funded Explicit Partial'}
                      </dt>
                      <dd className="text-right font-semibold line-through decoration-slate-400">
                        {formatCny(estimate.grossTotalCny ?? estimate.grossPartialCny)}
                      </dd>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2.5">
                    <dt className="font-bold text-[#12436b]">
                      {activeScholarship
                        ? estimate.netTotalCny !== null
                          ? 'Est. 1st-Year Out-of-Pocket (After Scholarship)'
                          : 'Est. Out-of-Pocket (Explicit Items Only)'
                        : estimate.grossTotalCny !== null
                          ? 'Recorded 1st-Year Total (Self-Funded)'
                          : 'Recorded Explicit Partial (Self-Funded)'}
                    </dt>
                    <dd className="text-right font-bold text-[#12436b]">
                      {activeScholarship
                        ? formatCny(estimate.netTotalCny ?? estimate.netPartialCny)
                        : formatCny(estimate.grossTotalCny ?? estimate.grossPartialCny)}
                      {parsedRate ? (
                        <span className="ml-2 text-[12px] font-semibold text-emerald-700">
                          (≈{' '}
                          {formatBdt(
                            (activeScholarship
                              ? estimate.netTotalCny ?? estimate.netPartialCny
                              : estimate.grossTotalCny ?? estimate.grossPartialCny) * parsedRate,
                          )}
                          )
                        </span>
                      ) : null}
                    </dd>
                  </div>
                </dl>

                {/* Separate Living Stipend Row (NEVER deducted from upfront cash fees) */}
                {estimate.stipendLabel && (
                  <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-[11.5px] leading-4 text-sky-950">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-sky-700" aria-hidden="true" />
                    <span>
                      <strong>Separate Living Stipend:</strong> {estimate.stipendLabel}. Stipends
                      are paid after arrival in China and are never subtracted from upfront arrival
                      cash fees.
                    </span>
                  </div>
                )}

                {(estimate.unclear.length > 0 ||
                  estimate.missing.length > 0 ||
                  estimate.scholarshipTermsVariable) && (
                  <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11.5px] leading-4 text-amber-900">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      Verify directly before paying:{' '}
                      {[
                        ...estimate.unclear,
                        ...estimate.missing,
                        ...(estimate.scholarshipTermsVariable
                          ? ['Exact scholarship waiver tier']
                          : []),
                      ].join(', ')}
                      . Scholarships are competitive and never guaranteed.
                    </span>
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-2.5 text-[11.5px] leading-4 text-slate-600">
                  <span className="inline-flex items-start gap-1.5">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    <span>
                      <strong>Visa-First Policy:</strong> BDT 0 EduExpress service fee before China
                      visa approval (third-party fees itemized separately).
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <CheckCircle2 className="size-3 text-emerald-700" aria-hidden="true" />
                    Verified from official institutional notice
                    {activeDetail.lastVerifiedIso ? ` · ${activeDetail.lastVerifiedIso}` : ''}
                  </span>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-slate-200 p-4 text-center text-[13px] text-slate-500">
                No matching China university or program found. Try clearing your filter.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Region & Scope Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {REGION_FILTERS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setRegionFilter(region)}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition ${
                      regionFilter === region
                        ? 'bg-[#12436b] text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setScopeFilter('all')}
                  className={`rounded-full px-2.5 py-1 transition ${
                    scopeFilter === 'all' ? 'bg-[#12436b] text-white' : 'text-slate-600'
                  }`}
                >
                  All ({destinations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScopeFilter('active')}
                  className={`rounded-full px-2.5 py-1 transition ${
                    scopeFilter === 'active' ? 'bg-emerald-700 text-white' : 'text-slate-600'
                  }`}
                >
                  EduExpress Active ({activeDeskCount})
                </button>
              </div>
            </div>

            {/* Side-by-Side Selectors */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="embed-dest-a" className="block text-[11.5px] font-semibold text-slate-600">
                  Destination A ({filteredDestinations.length} countries)
                </label>
                <select
                  id="embed-dest-a"
                  value={rowA?.slug ?? ''}
                  onChange={(e) => setDestA(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {filteredDestinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.flag} {d.name} ({d.serviceStatus})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="embed-dest-b" className="block text-[11.5px] font-semibold text-slate-600">
                  Destination B
                </label>
                <select
                  id="embed-dest-b"
                  value={rowB?.slug ?? ''}
                  onChange={(e) => setDestB(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {filteredDestinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.flag} {d.name} ({d.serviceStatus})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {rowA && rowB && (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-left text-[12.5px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="w-36 px-3 py-2.5 font-semibold">Factor</th>
                      <th className="px-3 py-2.5 font-bold text-[#12436b]">
                        {rowA.flag} {rowA.name}
                        <span className="ml-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {rowA.serviceStatus}
                        </span>
                      </th>
                      <th className="px-3 py-2.5 font-bold text-[#12436b]">
                        {rowB.flag} {rowB.name}
                        <span className="ml-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {rowB.serviceStatus}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Main Intakes</td>
                      <td className="px-3 py-2">{rowA.intakes}</td>
                      <td className="px-3 py-2">{rowB.intakes}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Indicative Tuition</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{rowA.indicativeTuition}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{rowB.indicativeTuition}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Living Estimate</td>
                      <td className="px-3 py-2">{rowA.indicativeLiving}</td>
                      <td className="px-3 py-2">{rowB.indicativeLiving}</td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="px-3 py-2 font-semibold text-slate-700">Statutory Visa Financial Proof</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{rowA.officialVisaFinancialProof}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{rowB.officialVisaFinancialProof}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">BD Bank Student File</td>
                      <td className="px-3 py-2">{rowA.studentFileRule}</td>
                      <td className="px-3 py-2">{rowB.studentFileRule}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Work &amp; Post-Study</td>
                      <td className="px-3 py-2 text-slate-700">
                        <span className="block"><strong>During study:</strong> {rowA.partTimeWorkRights}</span>
                        <span className="mt-1 block"><strong>Post-study:</strong> {rowA.postStudyWorkPolicy}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        <span className="block"><strong>During study:</strong> {rowB.partTimeWorkRights}</span>
                        <span className="mt-1 block"><strong>Post-study:</strong> {rowB.postStudyWorkPolicy}</span>
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="px-3 py-2.5 font-semibold text-emerald-900">
                        Flagship Scholarships (BD Eligible)
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <ul className="space-y-1.5">
                          {rowA.flagshipScholarships.map((s) => (
                            <li key={s.name} className="rounded-lg border border-emerald-200/80 bg-white p-2">
                              <p className="font-bold text-[#12436b]">{s.name}</p>
                              <p className="mt-0.5 text-[11.5px] text-slate-700">{s.coverage}</p>
                              <p className="mt-0.5 text-[11px] font-medium text-emerald-800">
                                {s.category} · Window: {s.typicalDeadline}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-3 py-2.5 align-top">
                        <ul className="space-y-1.5">
                          {rowB.flagshipScholarships.map((s) => (
                            <li key={s.name} className="rounded-lg border border-emerald-200/80 bg-white p-2">
                              <p className="font-bold text-[#12436b]">{s.name}</p>
                              <p className="mt-0.5 text-[11.5px] text-slate-700">{s.coverage}</p>
                              <p className="mt-0.5 text-[11px] font-medium text-emerald-800">
                                {s.category} · Window: {s.typicalDeadline}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Key Guardrail</td>
                      <td className="px-3 py-2 text-slate-700">{rowA.keyGuardrail}</td>
                      <td className="px-3 py-2 text-slate-700">{rowB.keyGuardrail}</td>
                    </tr>
                    <tr className="bg-slate-50/80 text-[11.5px] text-slate-600">
                      <td className="px-3 py-2 font-semibold">Authority Basis</td>
                      <td className="px-3 py-2">
                        {rowA.publicAuthorityNames.join(' · ')} (Verified {rowA.lastVerifiedIso})
                      </td>
                      <td className="px-3 py-2">
                        {rowB.publicAuthorityNames.join(' · ')} (Verified {rowB.lastVerifiedIso})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-[11.5px] text-slate-600 sm:px-5">
        <span className="inline-flex items-center gap-1.5">
          <Award className="size-3.5 text-[#12436b]" aria-hidden="true" />
          Open data:{' '}
          <a
            href="https://eduexpressint.com/bangladesh-study-abroad-market?utm_source=embed_widget&utm_medium=referral&utm_campaign=cost_calculator"
            target="_blank"
            rel="noopener"
            className="font-semibold text-[#12436b] underline underline-offset-2"
          >
            EduExpress International
          </a>{' '}
          (
          <a
            href={OPEN_DATA_REPOSITORIES.zenodoDoiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            CC BY 4.0 · DOI: {OPEN_DATA_REPOSITORIES.zenodoDoi}
          </a>
          )
        </span>
        <a
          href="https://eduexpressint.com/press#embed-widget"
          target="_blank"
          rel="noopener"
          className="font-semibold text-slate-700 hover:text-[#12436b]"
        >
          Embed free on your site →
        </a>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Award, Calculator, ExternalLink, Globe2, Info, ShieldCheck } from 'lucide-react';
import {
  FEE_LABELS,
  FIRST_YEAR_FEES,
  firstYearEstimate,
  type FeeRow,
  type ProgramRow,
} from '@/lib/catalog-views';
import type { DestinationPortfolioRow } from '@/lib/bangladesh-market-benchmark';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';

type TabKey = 'china' | 'destinations';

type Props = {
  initialTab?: TabKey;
  programs: ProgramRow[];
  feesByUniversity: Record<string, FeeRow[]>;
  destinations: DestinationPortfolioRow[];
  activeUniversitiesCount: number;
};

const LEVEL_FILTERS = ['All', 'Bachelor', 'MBBS', 'Master', 'PhD', 'Foundation'] as const;

function formatCny(amount: number): string {
  return `CNY ${Math.round(amount).toLocaleString('en-US')}`;
}

function formatBdt(amount: number): string {
  return `BDT ${Math.round(amount).toLocaleString('en-US')}`;
}

export default function CostCalculatorWidget({
  initialTab = 'china',
  programs,
  feesByUniversity,
  destinations,
  activeUniversitiesCount,
}: Props) {
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramKey, setSelectedProgramKey] = useState<string>(programs[0]?.key ?? '');
  const [cnyToBdtInput, setCnyToBdtInput] = useState<string>('');

  const [destA, setDestA] = useState<string>(destinations[0]?.slug ?? 'china');
  const [destB, setDestB] = useState<string>(destinations[1]?.slug ?? 'malaysia');

  const filteredPrograms = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return programs.filter((p) => {
      if (levelFilter !== 'All' && p.level !== levelFilter) return false;
      if (!q) return true;
      return (
        p.universityName.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    });
  }, [programs, levelFilter, searchTerm]);

  const activeProgram = useMemo(() => {
    return (
      filteredPrograms.find((p) => p.key === selectedProgramKey) ||
      filteredPrograms[0] ||
      programs[0] ||
      null
    );
  }, [filteredPrograms, selectedProgramKey, programs]);

  const activeFees = useMemo(() => {
    if (!activeProgram) return [];
    return feesByUniversity[activeProgram.universitySlug] ?? [];
  }, [activeProgram, feesByUniversity]);

  const estimate = useMemo(() => {
    if (!activeProgram) return null;
    return firstYearEstimate(activeProgram, activeFees);
  }, [activeProgram, activeFees]);

  const parsedRate = useMemo(() => {
    const num = Number(cnyToBdtInput.trim());
    return Number.isFinite(num) && num > 0 && num < 500 ? num : null;
  }, [cnyToBdtInput]);

  const rowA = destinations.find((d) => d.slug === destA) ?? destinations[0] ?? null;
  const rowB = destinations.find((d) => d.slug === destB) ?? destinations[1] ?? destinations[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl bg-[#12436b] px-4 py-3.5 text-white sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#d9f99d] text-[#12436b]">
            <Calculator className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-[15px] font-bold leading-tight sm:text-[16px]">
              Bangladesh Study Abroad Cost Calculator
            </h1>
            <p className="text-[11.5px] text-white/80">
              Verified data across {activeUniversitiesCount} active universities &amp; {destinations.length} destinations
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
      <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2.5 sm:px-5">
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
          China 1st-Year Cost
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
          12-Destination &amp; Student File Matrix
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {tab === 'china' ? (
          <div className="space-y-4">
            {/* Level pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {LEVEL_FILTERS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setLevelFilter(lvl);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition ${
                    levelFilter === lvl
                      ? 'bg-[#12436b] text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Search + Select + Optional BDT rate */}
            <div className="grid gap-3 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <label htmlFor="embed-search" className="block text-[11.5px] font-semibold text-slate-600">
                  Filter university or city
                </label>
                <input
                  id="embed-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Nanjing, MBBS, CS..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="embed-program" className="block text-[11.5px] font-semibold text-slate-600">
                  Select program ({filteredPrograms.length})
                </label>
                <select
                  id="embed-program"
                  value={activeProgram?.key ?? ''}
                  onChange={(e) => setSelectedProgramKey(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {filteredPrograms.slice(0, 180).map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.universityName} — {p.name} ({p.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="embed-bdt-rate" className="block text-[11.5px] font-semibold text-slate-600">
                  Your bank BDT / 1 CNY
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
            {activeProgram && estimate ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[14.5px] font-bold text-[#12436b]">
                      {activeProgram.universityName}
                    </p>
                    <p className="text-[12.5px] text-slate-600">
                      {activeProgram.name} · {activeProgram.level} · {activeProgram.city}
                      {activeProgram.languages.length ? ` · ${activeProgram.languages.join(' / ')}` : ''}
                    </p>
                  </div>
                  <a
                    href={`https://eduexpressint.com/universities/${activeProgram.universitySlug}?utm_source=embed_widget&utm_medium=referral&utm_campaign=cost_calculator`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#12436b] underline underline-offset-2"
                  >
                    University profile <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </div>

                <dl className="mt-3 divide-y divide-slate-200/80 text-[13px]">
                  <div className="flex items-center justify-between gap-3 py-1.5">
                    <dt className="font-medium text-slate-700">Annual Tuition</dt>
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

                  {FIRST_YEAR_FEES.map((category) => {
                    const matched = activeFees.filter((f) => f.category === category);
                    if (matched.length === 0) return null;
                    const singleVal = matched.length === 1 ? matched[0].firstYearCny : null;
                    return (
                      <div key={category} className="flex items-center justify-between gap-3 py-1.5">
                        <dt className="text-slate-600">{FEE_LABELS[category]}</dt>
                        <dd className="text-right font-medium text-slate-800">
                          {singleVal !== null ? formatCny(singleVal) : matched.map((m) => m.cost).join(' / ')}
                          {parsedRate && singleVal !== null ? (
                            <span className="ml-2 text-[11.5px] font-normal text-slate-500">
                              (≈ {formatBdt(singleVal * parsedRate)})
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between gap-3 pt-2.5">
                    <dt className="font-bold text-[#12436b]">
                      {estimate.total !== null ? 'Recorded 1st-Year Total' : 'Recorded Explicit Partial'}
                    </dt>
                    <dd className="text-right font-bold text-[#12436b]">
                      {estimate.total !== null ? formatCny(estimate.total) : formatCny(estimate.partial)}
                      {parsedRate ? (
                        <span className="ml-2 text-[12px] font-semibold text-emerald-700">
                          (≈ {formatBdt((estimate.total ?? estimate.partial) * parsedRate)})
                        </span>
                      ) : null}
                    </dd>
                  </div>
                </dl>

                {(estimate.unclear.length > 0 || estimate.missing.length > 0) && (
                  <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-2 text-[11.5px] leading-4 text-amber-900">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      Verify directly before paying:{' '}
                      {[...estimate.unclear, ...estimate.missing].join(', ')}.
                      Official university fees can vary by room type and intake.
                    </span>
                  </p>
                )}

                <p className="mt-2.5 flex items-start gap-1.5 text-[11.5px] leading-4 text-slate-600">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>
                    <strong>Visa-First Policy:</strong> BDT 0 consultancy service fee before China visa approval (third-party university/medical/notary costs itemized separately).
                  </span>
                </p>
              </div>
            ) : (
              <p className="rounded-lg border border-slate-200 p-4 text-center text-[13px] text-slate-500">
                No matching China program found. Try clearing your filter.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="embed-dest-a" className="block text-[11.5px] font-semibold text-slate-600">
                  Destination A
                </label>
                <select
                  id="embed-dest-a"
                  value={destA}
                  onChange={(e) => setDestA(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {destinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name} ({d.tier})
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
                  value={destB}
                  onChange={(e) => setDestB(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-900 focus:border-[#12436b] focus:outline-none"
                >
                  {destinations.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name} ({d.tier})
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
                      <th className="w-32 px-3 py-2 font-semibold">Factor</th>
                      <th className="px-3 py-2 font-bold text-[#12436b]">{rowA.name}</th>
                      <th className="px-3 py-2 font-bold text-[#12436b]">{rowB.name}</th>
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
                      <td className="px-3 py-2 font-medium">{rowA.indicativeTuition}</td>
                      <td className="px-3 py-2 font-medium">{rowB.indicativeTuition}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Living Estimate</td>
                      <td className="px-3 py-2">{rowA.indicativeLiving}</td>
                      <td className="px-3 py-2">{rowB.indicativeLiving}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">BD Bank Student File</td>
                      <td className="px-3 py-2">{rowA.studentFileRule}</td>
                      <td className="px-3 py-2">{rowB.studentFileRule}</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-slate-600">Key Guardrail</td>
                      <td className="px-3 py-2 text-slate-700">{rowA.keyGuardrail}</td>
                      <td className="px-3 py-2 text-slate-700">{rowB.keyGuardrail}</td>
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
            DOI: {OPEN_DATA_REPOSITORIES.zenodoDoi}
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

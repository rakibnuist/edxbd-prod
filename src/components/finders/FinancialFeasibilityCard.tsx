'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Coins,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { FeeRow, ProgramRow } from '@/lib/catalog-views';
import type { FitResponseLanguage } from '@/lib/fit-matcher';
import type { FeasibilityProgramInput, FeasibilityReport } from '@/lib/cost-feasibility';

interface FinancialFeasibilityCardProps {
  selectedPrograms: ProgramRow[];
  fees: Record<string, FeeRow[]>;
  bdtRate?: number | null;
}

const BUDGET_PRESETS = [
  { label: '5 Lakh BDT / yr', value: 500000 },
  { label: '7 Lakh BDT / yr', value: 700000 },
  { label: '10 Lakh BDT / yr', value: 1000000 },
  { label: '14 Lakh BDT / yr', value: 1400000 },
];

export default function FinancialFeasibilityCard({
  selectedPrograms,
  fees,
  bdtRate,
}: FinancialFeasibilityCardProps) {
  const [budgetBdt, setBudgetBdt] = useState<number>(700000);
  const [customBudget, setCustomBudget] = useState('');
  const [language, setLanguage] = useState<FitResponseLanguage>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  if (selectedPrograms.length === 0) return null;

  const currentRate = bdtRate && bdtRate > 0 ? bdtRate : 17.2;
  const bn = language === 'bn';

  const handleBudgetSelect = (val: number) => {
    setBudgetBdt(val);
    setCustomBudget('');
  };

  const handleCustomBudgetChange = (val: string) => {
    setCustomBudget(val);
    const num = Number(val.replace(/\D/g, ''));
    if (num > 0) {
      setBudgetBdt(num);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    const formattedPrograms: FeasibilityProgramInput[] = selectedPrograms.map(p => {
      const tuitionNum = p.annualTuitionCny || Number((p.tuitionLabel || '').replace(/\D/g, '')) || 20000;
      const recorded = fees[p.universitySlug] || [];
      return {
        key: p.key,
        name: p.name,
        universityName: p.universityName,
        universitySlug: p.universitySlug,
        city: p.city,
        level: p.level,
        tuitionCny: tuitionNum,
        tuitionText: p.tuitionLabel || `CNY ${tuitionNum.toLocaleString()}`,
        recordedFees: recorded,
      };
    });

    try {
      const response = await fetch('/api/ai/cost-feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programs: formattedPrograms,
          familyBudgetBdtPerYear: budgetBdt,
          bdtCnyExchangeRate: currentRate,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze budget feasibility.');
      }

      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feasibility service is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/80 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
            <Coins size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-petrol-800">
                {bn ? 'ক্লিয়ারকস্ট বাজেট ও আর্থিক সম্ভাব্যতা বিশ্লেষণ' : 'ClearCost Budget Feasibility Analyzer'}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-petrol-900">
                AI Feasibility
              </span>
            </div>
            <p className="text-[13px] text-ink-soft">
              {bn
                ? 'পারিবারিক বাজেটের সাথে ১ম বর্ষের ক্যাশ রিকোয়ারমেন্ট ও টাকার বাফার মূল্যায়ন'
                : 'Evaluate year-one cash requirement, recurring expenses, and BDT buffer with Gemini'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                language === 'bn'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              বাং
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="grid size-8 place-items-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-800"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 sm:p-8">
          {/* Budget input section */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5">
            <label className="block text-[13px] font-bold uppercase tracking-wider text-stone-600">
              {bn ? 'আপনার সম্ভাব্য পারিবারিক বাৎসরিক বাজেট নির্বাচন করুন:' : 'Select Planned Annual Family Budget:'}
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {BUDGET_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleBudgetSelect(preset.value)}
                  className={`rounded-xl border px-3.5 py-2 text-[13px] font-semibold transition-all ${
                    budgetBdt === preset.value && !customBudget
                      ? 'border-petrol-800 bg-petrol-800 text-white shadow-sm'
                      : 'border-stone-200 bg-white text-petrol-800 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <div className="relative">
                <input
                  type="text"
                  placeholder={bn ? 'কাস্টম বাজেট (BDT)' : 'Custom BDT'}
                  value={customBudget}
                  onChange={e => handleCustomBudgetChange(e.target.value)}
                  className="h-10 w-36 rounded-xl border border-stone-300 bg-white px-3 text-[13px] text-stone-800 placeholder:text-stone-400 focus:border-petrol-800 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="ed-btn ed-btn-signal ml-auto min-h-[42px] px-5 text-[13px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                    <span>{bn ? 'বিশ্লেষণ হচ্ছে…' : 'Analyzing Budget…'}</span>
                  </>
                ) : (
                  <>
                    <span>{bn ? 'সম্ভাব্যতা বিশ্লেষণ করুন' : 'Run Feasibility Analysis'}</span>
                    <Sparkles size={14} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-[12px] text-stone-500">
              {bn
                ? `বর্তমান হিসাব: ১ CNY = BDT ${currentRate.toFixed(1)} এবং বার্ষিক বাজেট BDT ${budgetBdt.toLocaleString()}`
                : `Current conversion rate: 1 CNY = BDT ${currentRate.toFixed(1)} · Evaluating against BDT ${budgetBdt.toLocaleString()} annual budget`}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-800">
              {error}
            </div>
          )}

          {/* Results section */}
          {report && (
            <div className="mt-6 space-y-6">
              {/* Verdict Banner */}
              <div
                className={`rounded-2xl border p-5 ${
                  report.verdict === 'comfortably_affordable'
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                    : report.verdict === 'realistic_with_buffer'
                    ? 'border-sky-200 bg-sky-50/70 text-sky-950'
                    : report.verdict === 'budget_stretch'
                    ? 'border-amber-200 bg-amber-50/70 text-amber-950'
                    : 'border-rose-200 bg-rose-50/70 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {report.verdict === 'comfortably_affordable' || report.verdict === 'realistic_with_buffer' ? (
                    <ShieldCheck size={24} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <ShieldAlert size={24} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
                  )}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                      {report.mode === 'gemini'
                        ? 'Google Gemini 4 Hydrogen · Budget Feasibility'
                        : 'EduExpress Verified Baseline Feasibility'}
                    </span>
                    <h4 className="mt-0.5 text-[18px] font-bold">{report.verdictHeadline}</h4>
                    <p className="mt-1.5 text-[14px] leading-relaxed">{report.verdictDetail}</p>
                  </div>
                </div>
              </div>

              {/* Program cost cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.programAnalyses.map(p => (
                  <div
                    key={p.universitySlug + p.programName}
                    className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <strong className="block text-[15px] font-bold text-petrol-800">
                            {p.universityName}
                          </strong>
                          <span className="text-[12px] text-stone-500">
                            {p.city} · {p.cityTier}
                          </span>
                        </div>
                        <Link
                          href={`/universities/${p.universitySlug}`}
                          className="shrink-0 text-stone-400 hover:text-petrol-800"
                          title="View university profile"
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                        </Link>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-stone-100 pt-3 text-[13px]">
                        <div className="flex items-baseline justify-between">
                          <span className="text-stone-600">{bn ? '১ম বর্ষের মোট ক্যাশ:' : 'Year 1 Cash Req:'}</span>
                          <div className="text-right">
                            <span className="font-bold text-petrol-800">
                              CNY {p.firstYearTotalCny.toLocaleString()}
                            </span>
                            <span className="block text-[11px] font-semibold text-lime-deep">
                              ~BDT {p.firstYearTotalBdt.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between border-t border-stone-100 pt-2">
                          <span className="text-stone-600">{bn ? '২য়-৪র্থ বর্ষ (বার্ষিক):' : 'Years 2-4 (Annual):'}</span>
                          <div className="text-right">
                            <span className="font-semibold text-petrol-800">
                              CNY {p.recurringYearsAnnualCny.toLocaleString()}
                            </span>
                            <span className="block text-[11px] text-stone-500">
                              ~BDT {p.recurringYearsAnnualBdt.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-stone-50 p-3 text-[12px] leading-relaxed text-stone-600">
                        {p.scholarshipImpact}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-stone-100 pt-3">
                      <Link
                        href={`/universities/${p.universitySlug}/clear-cost`}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-petrol-800 hover:underline"
                      >
                        {bn ? 'পূর্ণ ক্লিয়ারকস্ট ব্রেকডাউন' : 'Inspect ClearCost Schedule'}
                        <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Currency sensitivity banner */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 text-[13px] leading-relaxed text-stone-700">
                <span className="font-bold text-petrol-800">
                  {bn ? 'মুদ্রা ঝুঁকি ও বাফার পরামর্শ:' : 'Currency Risk & Buffer Advice:'}
                </span>{' '}
                {report.currencySensitivityNote}
              </div>

              {/* Fee Separation Table */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5">
                <h5 className="text-[14px] font-bold text-petrol-800">
                  {bn ? 'স্বচ্ছতা নীতি: কোন ফি কার কাছে প্রদেয়?' : 'Fee Transparency: Who Receives Each Payment?'}
                </h5>
                <div className="mt-3 grid gap-3 text-[13px] sm:grid-cols-3">
                  <div className="rounded-xl bg-stone-50 p-3.5">
                    <span className="block font-bold text-petrol-800">{bn ? '১. বিশ্ববিদ্যালয়' : '1. University'}</span>
                    <p className="mt-1 text-stone-600">{report.feeTransparencyAudit.universityPayable}</p>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-3.5">
                    <span className="block font-bold text-petrol-800">{bn ? '২. থার্ড-পার্টি ও দূতাবাস' : '2. Third Parties'}</span>
                    <p className="mt-1 text-stone-600">{report.feeTransparencyAudit.thirdPartyPayable}</p>
                  </div>
                  <div className="rounded-xl bg-lime-pale/60 p-3.5">
                    <span className="block font-bold text-lime-deep">{bn ? '৩. EduExpress পলিসি' : '3. EduExpress Policy'}</span>
                    <p className="mt-1 text-petrol-900 font-medium">{report.feeTransparencyAudit.eduExpressPolicy}</p>
                  </div>
                </div>
              </div>

              {/* Actionable tips & CTA */}
              <div className="rounded-2xl border border-stone-200 bg-canvas-soft p-5">
                <h5 className="text-[14px] font-bold text-petrol-800">
                  {bn ? 'কাউন্সেলর বাজেট পরামর্শ:' : 'Counselor Budget Advice:'}
                </h5>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-ink-soft">
                  {report.counselorBudgetTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 pt-4">
                  <p className="text-[12px] text-stone-500">
                    {bn ? 'ভর্তি বা স্কলারশিপের কোনো গ্যারান্টি দেওয়া হয় না।' : 'No admission or scholarship guarantees.'}
                  </p>
                  <Link
                    href="/education-fit-assessment"
                    className="ed-btn ed-btn-signal min-h-[38px] px-4 text-[13px]"
                  >
                    {bn ? 'লিখিত শর্টলিস্ট চান? ফ্রি অ্যাসেসমেন্ট' : 'Request Written Profile Review'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

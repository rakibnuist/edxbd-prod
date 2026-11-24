'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle2, Clock, ShieldAlert, SlidersHorizontal } from 'lucide-react';

type CreditTier = 'five_plus' | 'three_to_four';
type ALevelRoute = 'coaching' | 'mid_school' | 'premium_school';
type MalaysiaTier = 'standard' | 'dual_private' | 'branch';
type AgeBand = 'under_18' | 'eighteen_plus';

const A_LEVEL_BENCHMARKS: Record<
  ALevelRoute,
  { label: string; minLakh: number; maxLakh: number; summary: string }
> = {
  coaching: {
    label: 'Private / Coaching (3 Subjects)',
    minLakh: 4.8,
    maxLakh: 7.35,
    summary: 'Coaching BDT 3.5–4.0L + labs/mocks + British Council CAIE/Edexcel exams (incl. 15% VAT)',
  },
  mid_school: {
    label: 'Mid-Tier Dhaka School (2 Yrs)',
    minLakh: 7.5,
    maxLakh: 10.5,
    summary: 'BDT 18k–30k/mo tuition + admission/lab session fees + British Council board exams',
  },
  premium_school: {
    label: 'Premium Dhaka School (2 Yrs)',
    minLakh: 11.0,
    maxLakh: 15.0,
    summary: 'BDT 35k–65k+/mo tuition + session/lab charges + British Council CAIE/Edexcel exams',
  },
};

const MALAYSIA_TIERS: Record<
  MalaysiaTier,
  {
    label: string;
    foundationRm: [number, number];
    diplomaAnnualRm: [number, number];
    bachelorAnnualRm: [number, number];
    campuses: { name: string; slug: string; qs2027: string; note: string }[];
  }
> = {
  standard: {
    label: 'Standard MQA Private',
    foundationRm: [15000, 22000],
    diplomaAnnualRm: [18000, 24000],
    bachelorAnnualRm: [24000, 32000],
    campuses: [
      { name: 'Asia Pacific University (APU)', slug: 'asia-pacific-university', qs2027: 'QS #528', note: 'Tech & Computing · De Montfort UK dual award' },
      { name: 'UCSI University', slug: 'ucsi-university', qs2027: 'QS #282', note: '4,600+ corporate co-op partners · 20–50% merit waivers' },
    ],
  },
  dual_private: {
    label: 'UK Dual-Award Private',
    foundationRm: [25000, 32000],
    diplomaAnnualRm: [22000, 30000],
    bachelorAnnualRm: [28000, 48000],
    campuses: [
      { name: 'Taylor’s University', slug: 'taylors-university', qs2027: 'QS #272', note: 'UWE Bristol UK dual degree · up to RM 15k/yr Distinction' },
      { name: 'Sunway University', slug: 'sunway-university', qs2027: 'QS #354', note: 'Lancaster Univ. UK dual degree · 25–75% Jeffrey Cheah award' },
    ],
  },
  branch: {
    label: 'UK / AU Branch Campus',
    foundationRm: [28000, 36000],
    diplomaAnnualRm: [24000, 35000],
    bachelorAnnualRm: [42000, 58000],
    campuses: [
      { name: 'Monash University Malaysia', slug: 'monash-university-malaysia', qs2027: 'QS #31*', note: 'Via MUFY at Sunway College (5 Credits) · Identical AU Go8 degree' },
      { name: 'University of Nottingham Malaysia', slug: 'university-of-nottingham-malaysia', qs2027: 'QS #97*', note: 'Nottingham Foundation (Apr/Sep) · Identical UK Russell Group degree' },
      { name: 'Heriot-Watt University Malaysia', slug: 'heriot-watt-university-malaysia', qs2027: 'QS #325*', note: 'Actuarial, Engineering & Business · Identical UK Royal Charter degree' },
    ],
  },
};

function fmtLakh(bdt: number): string {
  return `BDT ${(bdt / 100000).toFixed(2)}L`;
}

function fmtK(bdt: number): string {
  return `BDT ${Math.round(bdt / 1000).toLocaleString('en-US')}k`;
}

export default function MalaysiaOLevelInteractivePlanner() {
  const [credits, setCredits] = useState<CreditTier>('five_plus');
  const [ageBand, setAgeBand] = useState<AgeBand>('under_18');
  const [aLevelRoute, setALevelRoute] = useState<ALevelRoute>('mid_school');
  const [malaysiaTier, setMalaysiaTier] = useState<MalaysiaTier>('dual_private');
  const [myrRate, setMyrRate] = useState<number>(30.2);

  const safeRate = Number.isFinite(myrRate) && myrRate >= 15 && myrRate <= 60 ? myrRate : 30.2;

  const model = useMemo(() => {
    const aLevel = A_LEVEL_BENCHMARKS[aLevelRoute];
    const tier = MALAYSIA_TIERS[malaysiaTier];
    const isFoundation = credits === 'five_plus';

    const entryRmMin = isFoundation ? tier.foundationRm[0] : tier.diplomaAnnualRm[0] * 2;
    const entryRmMax = isFoundation ? tier.foundationRm[1] : tier.diplomaAnnualRm[1] * 2.5;
    const entryBdtMin = entryRmMin * safeRate;
    const entryBdtMax = entryRmMax * safeRate;

    const totalYears = isFoundation ? 4 : 4.5;
    const yearsSaved = isFoundation ? '2 full years' : '1.5 to 2 years';
    const livingMinBdt = 1200 * safeRate;
    const livingMaxBdt = 2000 * safeRate;

    return {
      aLevel,
      tier,
      isFoundation,
      entryRmMin,
      entryRmMax,
      entryBdtMin,
      entryBdtMax,
      totalYears,
      yearsSaved,
      livingMinBdt,
      livingMaxBdt,
    };
  }, [aLevelRoute, credits, malaysiaTier, safeRate]);

  return (
    <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-canvas-soft pb-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-bold text-lime-deep">
            <Calculator size={15} aria-hidden="true" />
            Interactive September 2027 Planner
          </span>
          <h3 className="mt-3 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">
            Check Your O-Level Pathway, Timeline &amp; Live MYR → BDT Cost
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-soft">
            Select your O-Level credits, Dhaka A-Level baseline, and target Malaysian tier. Academic tuition stays strictly separated from monthly living expenses.
          </p>
        </div>

        <label className="flex flex-col rounded-2xl border border-petrol-800/15 bg-canvas-soft px-4 py-2.5 text-[13px] font-semibold text-petrol-800">
          <span className="flex items-center gap-1.5 text-[12px] text-ink-soft">
            <SlidersHorizontal size={13} aria-hidden="true" />
            Live FX (1 MYR = BDT)
          </span>
          <input
            type="number"
            step="0.1"
            min="15"
            max="60"
            value={myrRate}
            onChange={e => setMyrRate(Number(e.target.value))}
            aria-label="MYR to BDT exchange rate"
            className="mt-1 w-28 rounded-xl border border-petrol-800/20 bg-white px-2.5 py-1 text-[15px] font-bold text-petrol-800 focus:border-petrol-800 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Controls Column */}
        <div className="space-y-6">
          <div>
            <p className="text-[14px] font-bold text-petrol-800">1. O-Level / IGCSE Credits (Grade C / 4 or above)</p>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setCredits('five_plus')}
                aria-pressed={credits === 'five_plus'}
                className={`min-h-[52px] rounded-2xl border px-4 py-3 text-left transition ${
                  credits === 'five_plus'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                }`}
              >
                <span className="block text-[15px] font-bold">5+ Credits (Fastest)</span>
                <span className={`block text-[12.5px] ${credits === 'five_plus' ? 'text-white/80' : 'text-ink-soft'}`}>
                  Unlocks 1-Year MQA Foundation → Yr 1 Bachelor
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCredits('three_to_four')}
                aria-pressed={credits === 'three_to_four'}
                className={`min-h-[52px] rounded-2xl border px-4 py-3 text-left transition ${
                  credits === 'three_to_four'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                }`}
              >
                <span className="block text-[15px] font-bold">3 – 4 Credits</span>
                <span className={`block text-[12.5px] ${credits === 'three_to_four' ? 'text-white/80' : 'text-ink-soft'}`}>
                  Unlocks 2–2.5 Yr MQA Diploma → Yr 2 Transfer
                </span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">2. Target Malaysian University Tier</p>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
              {(Object.keys(MALAYSIA_TIERS) as MalaysiaTier[]).map(key => {
                const active = malaysiaTier === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMalaysiaTier(key)}
                    aria-pressed={active}
                    className={`min-h-[48px] rounded-2xl border px-3.5 py-2.5 text-left text-[13.5px] font-bold transition ${
                      active
                        ? 'border-petrol-800 bg-lime text-petrol-800'
                        : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                    }`}
                  >
                    {MALAYSIA_TIERS[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">3. Compare Against Your Bangladesh A-Level Route</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
              {(Object.keys(A_LEVEL_BENCHMARKS) as ALevelRoute[]).map(key => {
                const active = aLevelRoute === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setALevelRoute(key)}
                    aria-pressed={active}
                    className={`min-h-[46px] rounded-2xl border px-3 py-2 text-left text-[13px] font-semibold transition ${
                      active
                        ? 'border-petrol-800 bg-petrol-800 text-white'
                        : 'border-petrol-800/15 bg-white text-petrol-800 hover:bg-canvas-soft'
                    }`}
                  >
                    {A_LEVEL_BENCHMARKS[key].label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-soft">{model.aLevel.summary}</p>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">4. Student Age at September 2027 Entry</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setAgeBand('under_18')}
                aria-pressed={ageBand === 'under_18'}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-[13.5px] font-semibold transition ${
                  ageBand === 'under_18'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                }`}
              >
                Age 16 – 17 (Under 18)
              </button>
              <button
                type="button"
                onClick={() => setAgeBand('eighteen_plus')}
                aria-pressed={ageBand === 'eighteen_plus'}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-[13.5px] font-semibold transition ${
                  ageBand === 'eighteen_plus'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                }`}
              >
                Age 18+
              </button>
            </div>
          </div>
        </div>

        {/* Live Output Column */}
        <div className="flex flex-col justify-between gap-5 rounded-3xl bg-canvas-soft p-5 sm:p-6">
          <div className="space-y-4">
            {/* Visual Time Comparison Bars */}
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-petrol-800">
                  <Clock size={15} className="text-lime-deep" aria-hidden="true" />
                  Timeline After O-Level to Bachelor Graduation
                </span>
                <span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-black text-petrol-800">
                  Save {model.yearsSaved}
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="flex justify-between text-[12.5px] font-semibold text-petrol-800">
                    <span>{model.isFoundation ? 'Malaysia (1-Yr Foundation + 3-Yr Bachelor)' : 'Malaysia (Diploma + Yr 2 Transfer)'}</span>
                    <span className="text-lime-deep">{model.totalYears} Years</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-canvas-soft">
                    <div
                      className="h-full rounded-full bg-lime-deep transition-all duration-300"
                      style={{ width: `${Math.round((model.totalYears / 6) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12.5px] font-semibold text-ink-soft">
                    <span>Stay in Dhaka (2-Yr A-Level + 4-Yr Bachelor)</span>
                    <span className="text-clay">6 Years</span>
                  </div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-canvas-soft">
                    <div className="h-full w-full rounded-full bg-clay/75" />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Cost vs Dhaka A-Level Spend */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-petrol-800 p-4 text-white">
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-lime">
                  {model.isFoundation ? 'Malaysia 1-Yr Foundation' : 'Malaysia 2–2.5 Yr Diploma'}
                </p>
                <p className="mt-1 font-display text-[20px] font-black leading-tight">
                  RM {model.entryRmMin.toLocaleString('en-US')} – {model.entryRmMax.toLocaleString('en-US')}
                </p>
                <p className="mt-1 text-[13px] text-white/85">
                  ~{fmtLakh(model.entryBdtMin)} – {fmtLakh(model.entryBdtMax)} (Tuition only)
                </p>
              </div>
              <div className="rounded-2xl border border-petrol-800/12 bg-white p-4">
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-clay">
                  Dhaka 2-Yr A-Level Spend
                </p>
                <p className="mt-1 font-display text-[20px] font-black leading-tight text-petrol-800">
                  BDT {model.aLevel.minLakh.toFixed(1)}L – {model.aLevel.maxLakh.toFixed(1)}L
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  High-school prep only (0 university credit)
                </p>
              </div>
            </div>

            {/* Strictly Separated Living & Pre-Departure */}
            <div className="rounded-2xl border border-petrol-800/10 bg-white p-4 text-[13.5px] leading-6 text-ink-soft">
              <p className="font-bold text-petrol-800">Separated Budgets (Not Mixed Into Tuition):</p>
              <ul className="mt-1.5 space-y-1">
                <li>
                  • <strong className="text-petrol-800">Monthly Living:</strong> RM 1,200 – 2,000/mo (~{fmtK(model.livingMinBdt)} – {fmtK(model.livingMaxBdt)}/mo)
                </li>
                <li>
                  • <strong className="text-petrol-800">EMGS + eVAL + Yr 1 Insurance:</strong> RM 2,250 – 3,200 (~{fmtK(2250 * safeRate)} – {fmtK(3200 * safeRate)})
                </li>
                <li>
                  • <strong className="text-lime-deep">EduExpress Consultancy Fee:</strong> <strong>BDT 0</strong> (Paid directly to university &amp; EMGS)
                </li>
              </ul>
            </div>

            {/* Age Safeguard Notice */}
            {ageBand === 'under_18' && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-clay/25 bg-clay/5 p-3.5 text-[13px] leading-5 text-ink-soft">
                <ShieldAlert size={17} className="mt-0.5 shrink-0 text-clay" aria-hidden="true" />
                <span>
                  <strong className="text-petrol-800">Under-18 EMGS Rule:</strong> Eligible for September 2027 with parent-signed consent and university-approved on-campus accommodation until age 18. Verified in writing before filing.
                </span>
              </div>
            )}

            {/* Matched Verified Campuses */}
            <div className="rounded-2xl bg-white p-4">
              <p className="text-[13px] font-bold text-petrol-800">Matched Verified Campuses (QS World 2027):</p>
              <ul className="mt-2 space-y-2">
                {model.tier.campuses.map(campus => (
                  <li key={campus.slug} className="flex items-start justify-between gap-2 text-[13px]">
                    <span className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                      <span>
                        <Link href={`/universities/${campus.slug}`} className="font-bold text-petrol-800 hover:underline">
                          {campus.name}
                        </Link>
                        <span className="block text-[12px] text-ink-soft">{campus.note}</span>
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-lime-pale px-2 py-0.5 text-[11.5px] font-bold text-lime-deep">
                      {campus.qs2027}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <a href="#o-level-assessment" className="ed-btn ed-btn-signal min-h-[46px] flex-1 px-5 text-[14px]">
              Get Written O-Level Shortlist <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

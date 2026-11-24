'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, Clock, ShieldAlert, SlidersHorizontal, Wrench } from 'lucide-react';

type Qualification = 'o_level' | 'ssc' | 'dakhil';
type ScholarshipTierId = 'tier1' | 'tier2' | 'tier3';
type MajorTrack = 'robotics' | 'computing' | 'infrastructure' | 'mbbs';
type AgeBand = 'under_18' | 'eighteen_plus';

const TIERS: Record<
  ScholarshipTierId,
  {
    label: string;
    short: string;
    annualMinCny: number;
    annualMaxCny: number;
    tuitionText: string;
    hostelText: string;
    note: string;
  }
> = {
  tier1: {
    label: 'Tier 1 · Full Diploma Scholarship',
    short: 'CNY 0 / yr',
    annualMinCny: 0,
    annualMaxCny: 0,
    tuitionText: 'CNY 0 (100% Free)',
    hostelText: 'CNY 0 (Free On-Campus Dorm)',
    note: 'Competitive provincial/college quota; subject to annual attendance & academic review.',
  },
  tier2: {
    label: 'Tier 2 · Class B (Tuition-Free)',
    short: 'CNY 1.2k–3k / yr',
    annualMinCny: 1200,
    annualMaxCny: 3000,
    tuitionText: 'CNY 0 (100% Free)',
    hostelText: 'CNY 1,200 – 3,000 / yr (Hostel only)',
    note: 'Most widely available merit route for solid O-Level, SSC & Dakhil profiles.',
  },
  tier3: {
    label: 'Tier 3 · Partial Scholarship Package',
    short: 'CNY 5k–8k / yr',
    annualMinCny: 5000,
    annualMaxCny: 8000,
    tuitionText: 'Subsidized tuition',
    hostelText: 'Included in CNY 5,000–8,000/yr range',
    note: 'Accessible backup option when Tier 1/2 seats fill; exact split stated in written offer letter.',
  },
};

const MAJOR_TRACKS: Record<
  MajorTrack,
  { label: string; eligible: boolean; exampleCollege: string; note: string }
> = {
  robotics: {
    label: 'Mechatronics, CNC & Robotics',
    eligible: true,
    exampleCollege: 'Yunnan Vocational College of Mechanical & Electrical Tech (Kunming)',
    note: 'Hands-on industrial automation, CNC & robotics workshops from Year 1 with Provincial Scholarship options.',
  },
  computing: {
    label: 'IT, Software & E-Commerce',
    eligible: true,
    exampleCollege: 'Jiangsu Shipping College (Nantong — verified full tuition + dorm case)',
    note: 'Computer Network Technology, software application, and cross-border digital logistics.',
  },
  infrastructure: {
    label: 'Rail, Civil & Hospitality',
    eligible: true,
    exampleCollege: 'Accredited Provincial Technical Colleges (Sep 2027)',
    note: 'High-speed rail operations, civil construction & aviation hospitality tracks.',
  },
  mbbs: {
    label: 'MBBS / Clinical Medicine',
    eligible: false,
    exampleCollege: 'Not eligible via 3+2 Vocational Diploma',
    note: 'BMDC-recognized Clinical Medicine strictly requires 12th-grade A-Level, HSC, or Alim Biology, Chemistry & Physics—never a vocational diploma.',
  },
};

function fmtLakh(bdt: number): string {
  return `BDT ${(bdt / 100000).toFixed(2)}L`;
}

function fmtK(bdt: number): string {
  return `BDT ${Math.round(bdt / 1000).toLocaleString('en-US')}k`;
}

export default function ChinaDiplomaInteractivePlanner() {
  const [qualification, setQualification] = useState<Qualification>('o_level');
  const [ageBand, setAgeBand] = useState<AgeBand>('under_18');
  const [majorTrack, setMajorTrack] = useState<MajorTrack>('robotics');
  const [tierId, setTierId] = useState<ScholarshipTierId>('tier2');
  const [cnyRate, setCnyRate] = useState<number>(18.7);

  const safeRate = Number.isFinite(cnyRate) && cnyRate >= 10 && cnyRate <= 35 ? cnyRate : 18.7;

  const model = useMemo(() => {
    const tier = TIERS[tierId];
    const major = MAJOR_TRACKS[majorTrack];
    const threeYrMinCny = tier.annualMinCny * 3;
    const threeYrMaxCny = tier.annualMaxCny * 3;
    return {
      tier,
      major,
      threeYrMinCny,
      threeYrMaxCny,
      threeYrMinBdt: threeYrMinCny * safeRate,
      threeYrMaxBdt: threeYrMaxCny * safeRate,
      monthlyMinBdt: 800 * safeRate,
      monthlyMaxBdt: 1400 * safeRate,
      insuranceBdt: 800 * safeRate,
    };
  }, [majorTrack, safeRate, tierId]);

  const qualLabel =
    qualification === 'o_level'
      ? 'GCE O-Level / IGCSE (Attested transcripts; Math & Science checked for STEM)'
      : qualification === 'dakhil'
        ? 'Dakhil — Bangladesh Madrasah Education Board (10th-grade equivalent with MoE/MoFA attestation)'
        : 'National SSC (10th-grade equivalent with board transcripts & notarized English copies)';

  return (
    <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-canvas-soft pb-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-bold text-lime-deep">
            <Calculator size={15} aria-hidden="true" />
            Interactive 3+2 China Pathway &amp; Eligibility Simulator
          </span>
          <h3 className="mt-3 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">
            Simulate Your 5-Year China 3+2 Cost, Scholarship Tier &amp; Age Safeguards
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-soft">
            Test O-Level, SSC, or Dakhil eligibility across all three institutional scholarship tiers with live CNY → BDT conversion and mandatory MoE Order No. 42 age checks.
          </p>
        </div>

        <label className="flex flex-col rounded-2xl border border-petrol-800/15 bg-canvas-soft px-4 py-2.5 text-[13px] font-semibold text-petrol-800">
          <span className="flex items-center gap-1.5 text-[12px] text-ink-soft">
            <SlidersHorizontal size={13} aria-hidden="true" />
            Live FX (1 CNY = BDT)
          </span>
          <input
            type="number"
            step="0.1"
            min="10"
            max="35"
            value={cnyRate}
            onChange={e => setCnyRate(Number(e.target.value))}
            aria-label="CNY to BDT exchange rate"
            className="mt-1 w-28 rounded-xl border border-petrol-800/20 bg-white px-2.5 py-1 text-[15px] font-bold text-petrol-800 focus:border-petrol-800 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <p className="text-[14px] font-bold text-petrol-800">1. Current 10th-Grade Qualification</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ['o_level', 'O-Level / IGCSE'],
                  ['ssc', 'SSC (National)'],
                  ['dakhil', 'Dakhil (Madrasah)'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setQualification(id)}
                  aria-pressed={qualification === id}
                  className={`min-h-[46px] rounded-2xl border px-3.5 py-2.5 text-[13.5px] font-bold transition ${
                    qualification === id
                      ? 'border-petrol-800 bg-petrol-800 text-white'
                      : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-soft">{qualLabel}</p>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">2. Intended Technical Major</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
              {(Object.keys(MAJOR_TRACKS) as MajorTrack[]).map(key => {
                const active = majorTrack === key;
                const isWarning = key === 'mbbs';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMajorTrack(key)}
                    aria-pressed={active}
                    className={`min-h-[48px] rounded-2xl border px-3.5 py-2.5 text-left text-[13.5px] font-bold transition ${
                      active
                        ? isWarning
                          ? 'border-clay bg-clay text-white'
                          : 'border-petrol-800 bg-lime text-petrol-800'
                        : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                    }`}
                  >
                    {MAJOR_TRACKS[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">3. Compare Diploma Scholarship Tiers (Years 1–3)</p>
            <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
              {(Object.keys(TIERS) as ScholarshipTierId[]).map(key => {
                const active = tierId === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTierId(key)}
                    aria-pressed={active}
                    className={`min-h-[54px] rounded-2xl border px-3 py-2.5 text-left transition ${
                      active
                        ? 'border-petrol-800 bg-petrol-800 text-white'
                        : 'border-petrol-800/15 bg-white text-petrol-800 hover:bg-canvas-soft'
                    }`}
                  >
                    <span className="block text-[13px] font-bold">{TIERS[key].label.split(' · ')[0]}</span>
                    <span className={`block text-[12px] ${active ? 'text-lime' : 'text-lime-deep font-semibold'}`}>
                      {TIERS[key].short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-bold text-petrol-800">4. Student Age at Departure</p>
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

        {/* Live Output Panel */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-canvas-soft p-5 sm:p-6">
          <div className="space-y-4">
            {!model.major.eligible ? (
              <div className="rounded-2xl border border-clay/30 bg-clay/10 p-5">
                <div className="flex items-center gap-2 text-clay">
                  <ShieldAlert size={20} aria-hidden="true" />
                  <h4 className="text-[16px] font-bold">Not Eligible for 3+2 Vocational Track</h4>
                </div>
                <p className="mt-2 text-[14px] leading-6 text-petrol-800">{model.major.note}</p>
                <p className="mt-2 text-[13.5px] text-ink-soft">
                  Complete 12th-grade HSC, Alim, or A-Level Science (Biology, Chemistry, Physics) first, then apply through our BMDC-checked MBBS pathway.
                </p>
              </div>
            ) : (
              <>
                {/* 5-Yr vs 6-Yr Visual Bar */}
                <div className="rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-petrol-800">
                      <Clock size={15} className="text-lime-deep" aria-hidden="true" />
                      Total Years After O-Level / SSC to Bachelor
                    </span>
                    <span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-black text-petrol-800">
                      Save 1 Full Year
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-petrol-800">
                        <span>China 3+2 (3-Yr Diploma + 2-Yr Top-Up Bachelor)</span>
                        <span className="text-lime-deep">5 Years</span>
                      </div>
                      <div className="mt-1 flex h-3 w-[83%] overflow-hidden rounded-full bg-canvas-soft">
                        <div className="h-full w-[60%] bg-petrol-800" />
                        <div className="h-full w-[40%] bg-lime-deep" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[12.5px] font-semibold text-ink-soft">
                        <span>Bangladesh (2-Yr HSC/A-Level + 4-Yr Bachelor)</span>
                        <span className="text-clay">6 Years</span>
                      </div>
                      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-canvas-soft">
                        <div className="h-full w-full rounded-full bg-clay/75" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-Year Institutional Cost Card */}
                <div className="rounded-2xl bg-petrol-800 p-4 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-lime">
                      {model.tier.label}
                    </span>
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11.5px] font-semibold">
                      3-Year Cumulative (Tuition + Dorm)
                    </span>
                  </div>
                  <p className="mt-2 font-display text-[22px] font-black leading-tight">
                    {model.threeYrMaxCny === 0
                      ? 'CNY 0 (BDT 0 Tuition & Dorm)'
                      : `CNY ${model.threeYrMinCny.toLocaleString('en-US')} – ${model.threeYrMaxCny.toLocaleString('en-US')}`}
                  </p>
                  <p className="mt-1 text-[13.5px] text-white/85">
                    {model.threeYrMaxCny === 0
                      ? 'Annual tuition CNY 0 + free on-campus dorm (living expenses separate)'
                      : `≈ ${fmtLakh(model.threeYrMinBdt)} – ${fmtLakh(model.threeYrMaxBdt)} total over 3 years (${model.tier.tuitionText} · ${model.tier.hostelText})`}
                  </p>
                </div>

                {/* Catalog Example */}
                <div className="rounded-2xl bg-white p-4 text-[13.5px]">
                  <p className="flex items-center gap-1.5 font-bold text-petrol-800">
                    <Wrench size={15} className="text-lime-deep" aria-hidden="true" />
                    Catalog Reference: {model.major.exampleCollege}
                  </p>
                  <p className="mt-1 leading-5 text-ink-soft">{model.major.note}</p>
                </div>
              </>
            )}

            {/* Separated Living + Regulatory Checks */}
            <div className="rounded-2xl border border-petrol-800/10 bg-white p-4 text-[13.5px] leading-6 text-ink-soft">
              <p className="font-bold text-petrol-800">Separated Costs &amp; Mandatory Pre-Application Checks:</p>
              <ul className="mt-1.5 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                  <span>
                    <strong className="text-petrol-800">Monthly Food &amp; Personal (Separate):</strong> CNY 800 – 1,400/mo (~{fmtK(model.monthlyMinBdt)} – {fmtK(model.monthlyMaxBdt)}/mo) + mandatory insurance ~CNY 800/yr (~{fmtK(model.insuranceBdt)}).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                  <span>
                    <strong className="text-petrol-800">Chinese Language Progression:</strong> Most diplomas include 1 semester–1 year Chinese prep toward HSK 3–4 before Top-Up Bachelor articulation.
                  </span>
                </li>
                {ageBand === 'under_18' && (
                  <li className="flex items-start gap-2 rounded-xl bg-clay/5 p-2 text-petrol-800">
                    <ShieldAlert size={15} className="mt-0.5 shrink-0 text-clay" aria-hidden="true" />
                    <span>
                      <strong>Under-18 MoE Order No. 42 Rule:</strong> Applicants under 18 require a legally notarized China-resident guardian until age 18. EduExpress verifies minor-accepting colleges in writing before applying.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <a href="#china-diploma-assessment" className="ed-btn ed-btn-signal min-h-[46px] px-5 text-[14px]">
            Verify My 3+2 Eligibility (BDT 0 File Opening) <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

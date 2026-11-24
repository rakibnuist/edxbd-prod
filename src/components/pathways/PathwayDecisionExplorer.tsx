'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';

type Stage = 'after_olevel' | 'after_alevel';
type Priority = 'speed' | 'scholarship' | 'western_brand' | 'europe';
type BudgetBand = 'under_5l' | '5_to_12l' | '12_to_25l' | 'above_25l';

type RouteCard = {
  id: string;
  country: string;
  serviceBadge: string;
  headline: string;
  duration: string;
  qsStanding: string;
  tuitionRange: string;
  livingSeparated: string;
  winReason: string;
  href: string;
  cta: string;
  score: number;
};

export default function PathwayDecisionExplorer() {
  const [stage, setStage] = useState<Stage>('after_olevel');
  const [priority, setPriority] = useState<Priority>('speed');
  const [budget, setBudget] = useState<BudgetBand>('5_to_12l');

  const rankedRoutes = useMemo<RouteCard[]>(() => {
    const candidates: RouteCard[] = [
      {
        id: 'malaysia',
        country: 'Malaysia (Active · BDT 0 Agency Fee)',
        serviceBadge: stage === 'after_olevel' ? '1-Yr Foundation / 2-Yr Diploma' : '3-Yr Honours / Branch / UK Dual',
        headline:
          stage === 'after_olevel'
            ? 'Skip 2 Years of A-Levels — Graduate in 4 Years Total'
            : 'Monash (#31*), Nottingham (#97*) & UK Dual Degrees at ~1/3 Cost',
        duration: stage === 'after_olevel' ? '4 Years Total after O-Level' : '3 Years Honours (4 Yrs Eng.)',
        qsStanding: 'QS World 2027 #31* – #528',
        tuitionRange:
          stage === 'after_olevel'
            ? 'Foundation RM 15k–36k (~BDT 4.5L–10.9L) · Bachelor RM 10k–58k/yr'
            : 'Public RM 10k–28k/yr · Dual/Branch RM 24k–58k/yr (15%–75% merit waivers)',
        livingSeparated: 'RM 1,200 – 2,000/mo (~BDT 36.2k–60.4k/mo)',
        winReason:
          'Fastest English-medium post-O-Level jump and strongest UK/AU credential value without BDT 1–3 Cr Western undergraduate bills.',
        href: stage === 'after_olevel' ? '/study-in-malaysia-after-o-level' : '/study-in-malaysia-from-bangladesh',
        cta: stage === 'after_olevel' ? 'Open Malaysia After O-Level Guide' : 'Open Malaysia Hub',
        score:
          (stage === 'after_olevel' ? 35 : 28) +
          (priority === 'speed' ? 40 : priority === 'western_brand' ? 35 : 15) +
          (budget === '5_to_12l' || budget === '12_to_25l' ? 25 : 12),
      },
      {
        id: 'china',
        country: 'China (Flagship · Visa-First Policy)',
        serviceBadge: stage === 'after_olevel' ? '5-Year 3+2 Diploma → Bachelor' : '4-Yr Ranked Bachelor + Uni Scholarships',
        headline:
          stage === 'after_olevel'
            ? 'Applied Robotics, CNC & IT Diploma + Top-Up Bachelor in 5 Years'
            : 'QS World #47–#730 Research Universities With Direct Waivers',
        duration: stage === 'after_olevel' ? '5 Years Total (Save 1 Year)' : '4 Years Bachelor (5+1 MBBS)',
        qsStanding: stage === 'after_olevel' ? 'MoE Accredited Technical Colleges' : 'QS World 2027 #47 – #730',
        tuitionRange:
          stage === 'after_olevel'
            ? 'Diploma Tiers: CNY 0 (Tier 1) · CNY 1.2k–3k/yr (Class B) · CNY 5k–8k/yr (Partial)'
            : 'Net CNY 0 – 18,000/yr (~BDT 0–3.37L/yr) under University/Provincial waivers',
        livingSeparated: 'Campus dorm CNY 1.2k–9.6k/yr + Living CNY 800–1,400/mo',
        winReason:
          'Unbeatable scholarship support and residential STEM/AI research campuses—beats Dhaka private fees while keeping Western Master’s doors open.',
        href: stage === 'after_olevel' ? '/study-in-china-after-o-level-ssc' : '/bangladesh-vs-china-bachelor-study',
        cta: stage === 'after_olevel' ? 'Open China 3+2 After O-Level Guide' : 'Compare China vs. Dhaka Private',
        score:
          (stage === 'after_olevel' ? 30 : 34) +
          (priority === 'scholarship' ? 45 : priority === 'speed' ? 28 : 20) +
          (budget === 'under_5l' ? 35 : budget === '5_to_12l' ? 25 : 15),
      },
      {
        id: 'europe',
        country: 'Europe Active Routes (Hungary, Finland, Cyprus, Georgia)',
        serviceBadge: 'English-Taught Public & Specialist Degrees',
        headline: 'European Public Tuition Well Below UK, US & Australian Costs',
        duration: '3 – 4 Years Bachelor (5–6 Yrs MBBS in Georgia)',
        qsStanding: 'EU / EEA Bologna-Recognized Degrees',
        tuitionRange: 'Hungary €3k–€6k/yr · Finland €6k–€12k/yr · Cyprus €2.5k–€4.5k/yr',
        livingSeparated: 'Hungary €400–600/mo · Finland €800/mo (Migri €9,600/yr)',
        winReason:
          'Accessible European tuition and Schengen mobility for A-Level/HSC graduates, plus competitive Stipendium Hungaricum awards.',
        href: '/destinations',
        cta: 'Browse European Destinations',
        score:
          (stage === 'after_alevel' ? 26 : 6) +
          (priority === 'europe' ? 50 : 12) +
          (budget === '5_to_12l' || budget === '12_to_25l' ? 22 : 10),
      },
      {
        id: 'uk',
        country: 'United Kingdom (Active EduExpress Service)',
        serviceBadge: 'Direct 3-Yr Honours / 1-Yr Master’s',
        headline: 'Direct UK Campus Study & 18-Month Graduate Route (From Jan 2027)',
        duration: stage === 'after_olevel' ? '1-Yr UK Foundation + 3-Yr Honours' : '3 Years Bachelor · 1 Year Master’s',
        qsStanding: 'UK QAA / QS World Top 50–600',
        tuitionRange: '£12,000 – £38,000 / yr (~BDT 18L – 58L/yr)',
        livingSeparated: '£10,800 – £14,100 / yr (~BDT 16L – 22L/yr)',
        winReason:
          'Fastest Western Honours (3 yrs) and Master’s (1 yr) for families with GBP budget—or best combined as a 1-yr Master’s after China/Malaysia.',
        href: '/study-in-uk-from-bangladesh',
        cta: 'Explore UK Study Options',
        score:
          (stage === 'after_alevel' ? 24 : 10) +
          (priority === 'western_brand' ? 38 : 10) +
          (budget === 'above_25l' ? 40 : 4),
      },
      {
        id: 'dhaka',
        country: 'Stay in Bangladesh (NSU, EWU, AIUB Baseline)',
        serviceBadge: 'Domestic Baseline Comparison',
        headline: 'Local Commuter Track With Longest 6-Year Post-O-Level Timeline',
        duration: stage === 'after_olevel' ? '2 Yrs A-Level + 4 Yrs Bachelor (6 Yrs)' : '4 Years Local Bachelor',
        qsStanding: 'NSU QS #901–950 · AIUB #1401+ · EWU NL',
        tuitionRange:
          stage === 'after_olevel'
            ? 'A-Level BDT 4.8L–15L+ + Private Uni BDT 9.17L–14.30L'
            : 'BDT 9.17L – 14.30L (4-yr academic fees)',
        livingSeparated: 'Family home or Dhaka rent & commute',
        winReason:
          'Fits students who must stay in Dhaka for family/business care, but trails China and Malaysia on timeline and QS global ranking.',
        href: '/bangladesh-vs-china-bachelor-study',
        cta: 'Compare Dhaka vs. China',
        score:
          (budget === 'under_5l' ? 18 : 10) +
          (priority === 'speed' ? 2 : 8),
      },
    ];

    return candidates.sort((a, b) => b.score - a.score);
  }, [budget, priority, stage]);

  return (
    <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-canvas-soft pb-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-bold text-lime-deep">
          <Compass size={15} aria-hidden="true" />
          Interactive Pathway Matcher (September 2027)
        </span>
        <h3 className="mt-3 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">
          Filter Which Destination Wins for Your Stage, Goal &amp; Tuition Budget
        </h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-soft">
          Pick three profile filters below to rank Bangladesh, Malaysia, China, Europe, and UK pathways by real educational return—keeping living costs separated.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div>
            <p className="text-[13px] font-bold text-petrol-800">1. Academic Stage</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStage('after_olevel')}
                aria-pressed={stage === 'after_olevel'}
                className={`min-h-[44px] rounded-xl border px-3 py-2 text-[13px] font-bold transition ${
                  stage === 'after_olevel'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                }`}
              >
                After O-Level / SSC
              </button>
              <button
                type="button"
                onClick={() => setStage('after_alevel')}
                aria-pressed={stage === 'after_alevel'}
                className={`min-h-[44px] rounded-xl border px-3 py-2 text-[13px] font-bold transition ${
                  stage === 'after_alevel'
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                }`}
              >
                After A-Level / HSC
              </button>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-petrol-800">2. Primary Priority</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ['speed', 'Save 1–2 Years'],
                  ['scholarship', 'Top Scholarships'],
                  ['western_brand', 'UK / AU Degree'],
                  ['europe', 'Europe Public'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPriority(id)}
                  aria-pressed={priority === id}
                  className={`min-h-[40px] rounded-xl border px-2.5 py-1.5 text-[12.5px] font-bold transition ${
                    priority === id
                      ? 'border-petrol-800 bg-lime text-petrol-800'
                      : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-petrol-800">3. Annual Tuition Budget (No Living)</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ['under_5l', 'Under BDT 5L/yr'],
                  ['5_to_12l', 'BDT 5L – 12L/yr'],
                  ['12_to_25l', 'BDT 12L – 25L/yr'],
                  ['above_25l', 'BDT 25L+/yr'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBudget(id)}
                  aria-pressed={budget === id}
                  className={`min-h-[40px] rounded-xl border px-2.5 py-1.5 text-[12.5px] font-bold transition ${
                    budget === id
                      ? 'border-petrol-800 bg-petrol-800 text-white'
                      : 'border-petrol-800/15 bg-canvas-soft text-petrol-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Ranked Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rankedRoutes.slice(0, 3).map((route, idx) => (
          <div
            key={route.id}
            className={`flex flex-col justify-between rounded-3xl border p-5 transition ${
              idx === 0
                ? 'border-petrol-800 bg-petrol-800 text-white'
                : 'border-petrol-800/12 bg-canvas-soft text-petrol-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-extrabold ${
                    idx === 0 ? 'bg-lime text-petrol-800' : 'bg-white text-lime-deep'
                  }`}
                >
                  {idx === 0 ? <Sparkles size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}
                  {idx === 0 ? 'Best Fit #1' : `Strong Option #${idx + 1}`}
                </span>
                <span className={`text-[12px] font-bold ${idx === 0 ? 'text-lime' : 'text-petrol-800'}`}>
                  {route.qsStanding}
                </span>
              </div>

              <h4 className={`mt-3 text-[18px] font-bold leading-snug ${idx === 0 ? 'text-white' : 'text-petrol-800'}`}>
                {route.country}
              </h4>
              <p className={`mt-1 text-[13.5px] font-semibold ${idx === 0 ? 'text-lime' : 'text-lime-deep'}`}>
                {route.headline}
              </p>

              <dl className={`mt-3.5 space-y-1.5 text-[13px] ${idx === 0 ? 'text-white/85' : 'text-ink-soft'}`}>
                <div>
                  <dt className="inline font-bold">Timeline: </dt>
                  <dd className="inline">{route.duration}</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Tuition (No Living): </dt>
                  <dd className="inline">{route.tuitionRange}</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Living (Separated): </dt>
                  <dd className="inline">{route.livingSeparated}</dd>
                </div>
              </dl>

              <p className={`mt-3 text-[13px] leading-5 ${idx === 0 ? 'text-white/80' : 'text-ink-soft'}`}>
                {route.winReason}
              </p>
            </div>

            <div className={`mt-5 border-t pt-3.5 ${idx === 0 ? 'border-white/15' : 'border-petrol-800/10'}`}>
              <Link
                href={route.href}
                className={`inline-flex items-center gap-1.5 text-[14px] font-bold hover:underline ${
                  idx === 0 ? 'text-lime' : 'text-petrol-800'
                }`}
              >
                {route.cta} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

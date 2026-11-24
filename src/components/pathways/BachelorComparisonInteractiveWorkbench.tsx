'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, Globe2, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

type DhakaUniId = 'ewu' | 'nsu' | 'aiub';
type MajorGroup = 'cse' | 'bba';
type ChinaAwardTier = 'full' | 'merit' | 'partial';

const DHAKA_BENCHMARKS: Record<
  DhakaUniId,
  { name: string; qs2027: string; cseLakh: number; bbaLakh: number }
> = {
  ewu: { name: 'East West University (EWU)', qs2027: 'Not listed in QS 2027', cseLakh: 10.03, bbaLakh: 9.17 },
  nsu: { name: 'North South University (NSU)', qs2027: 'QS World #901–950', cseLakh: 11.66, bbaLakh: 10.56 },
  aiub: { name: 'AIUB', qs2027: 'QS World #1401+', cseLakh: 14.05, bbaLakh: 11.05 },
};

const CHINA_AWARD_SCENARIOS: Record<
  ChinaAwardTier,
  { label: string; annualTuitionCny: number; note: string }
> = {
  full: {
    label: '100% Tuition Waiver (CNY 0/yr)',
    annualTuitionCny: 0,
    note: 'HIT/HITSZ, SCUT, Nantong, SUES, SUEP full entrance/merit waiver where awarded (GPA renewable).',
  },
  merit: {
    label: 'High Merit / Belt & Road (CNY 6,000/yr)',
    annualTuitionCny: 6000,
    note: 'Illustrative net tuition after Sichuan Belt & Road (CNY 20k/yr) or Provincial/University deductions.',
  },
  partial: {
    label: 'Partial / Self-Funded (CNY 18,000/yr)',
    annualTuitionCny: 18000,
    note: 'Standard public English-taught engineering/business tuition before or after minor entrance waivers.',
  },
};

export type InteractiveUniversityItem = {
  slug: string;
  name: string;
  city: string;
  country: 'China' | 'Malaysia';
  qs2027: string;
  qsSort: number;
  majors: string;
  tuition: string;
  scholarship: string;
  dormOrLiving: string;
};

const VERIFIED_EXPLORER_UNIVERSITIES: InteractiveUniversityItem[] = [
  {
    slug: 'monash-university-malaysia',
    name: 'Monash University Malaysia',
    city: 'Sunway, Selangor',
    country: 'Malaysia',
    qs2027: 'QS #31*',
    qsSort: 31,
    majors: 'Computer Science, Business & Commerce, Engineering',
    tuition: 'RM 44,000 – 58,000 / yr',
    scholarship: 'RM 10,000/yr High Achiever Award (1/3 AU cost)',
    dormOrLiving: 'Hostel RM 800–1,800/mo',
  },
  {
    slug: 'zhejiang-university',
    name: 'Zhejiang University (ZJU)',
    city: 'Hangzhou',
    country: 'China',
    qs2027: 'QS #47',
    qsSort: 47,
    majors: 'Computer Science, Engineering, Economics',
    tuition: 'Selective public tuition',
    scholarship: 'Zhejiang Govt (CNY 30,000) + ZJU Scholarship',
    dormOrLiving: 'Dorm ~CNY 8,000 / yr',
  },
  {
    slug: 'universiti-malaya',
    name: 'Universiti Malaya (UM)',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    qs2027: 'QS #56',
    qsSort: 56,
    majors: 'Computer Science (AI), Electrical Eng., Business',
    tuition: 'RM 12,000 – 28,000 / yr',
    scholarship: 'Subsidized flagship public research tuition',
    dormOrLiving: 'Dorm RM 450–800/mo',
  },
  {
    slug: 'university-of-nottingham-malaysia',
    name: 'University of Nottingham Malaysia',
    city: 'Semenyih, Selangor',
    country: 'Malaysia',
    qs2027: 'QS #97*',
    qsSort: 97,
    majors: 'Chemical/Civil Eng., Economics, Computer Science',
    tuition: 'RM 42,000 – 56,000 / yr',
    scholarship: '25% High Achiever Waiver (1/3 UK cost)',
    dormOrLiving: 'Dorm RM 450–850/mo',
  },
  {
    slug: 'universiti-teknologi-malaysia',
    name: 'Universiti Teknologi Malaysia (UTM)',
    city: 'Johor Bahru & KL',
    country: 'Malaysia',
    qs2027: 'QS #158',
    qsSort: 158,
    majors: 'Mechanical Eng., Software Eng. (Washington Accord)',
    tuition: 'RM 10,000 – 22,000 / yr',
    scholarship: 'Up to 30% UTM Young Scholars Award',
    dormOrLiving: 'Dorm RM 350–600/mo',
  },
  {
    slug: 'hit-harbin',
    name: 'Harbin Institute of Technology (HIT / HITSZ)',
    city: 'Harbin & Shenzhen',
    country: 'China',
    qs2027: 'QS #190',
    qsSort: 190,
    majors: 'Computer Science, Automation, IC Design, Mechanical',
    tuition: 'CNY 26,000 – 30,000 / yr gross',
    scholarship: 'HIT / HITSZ Entrance Scholarship up to 100% Free',
    dormOrLiving: 'Dorm CNY 240–1,000/mo',
  },
  {
    slug: 'tianjin-university',
    name: 'Tianjin University',
    city: 'Tianjin',
    country: 'China',
    qs2027: 'QS #235',
    qsSort: 235,
    majors: 'Chemical Eng., Pharmaceutical Sci., Env. Engineering',
    tuition: 'CNY 16,000 / yr gross',
    scholarship: 'Type A / B / C University Scholarships',
    dormOrLiving: 'Dorm CNY 750–900/mo',
  },
  {
    slug: 'taylors-university',
    name: 'Taylor’s University',
    city: 'Subang Jaya, Selangor',
    country: 'Malaysia',
    qs2027: 'QS #272',
    qsSort: 272,
    majors: 'Business, Hospitality, Architecture, Computing',
    tuition: 'RM 32,000 – 48,000 / yr',
    scholarship: 'Up to RM 15k/yr Distinction · UWE Bristol UK Dual',
    dormOrLiving: 'Hostel RM 850–1,600/mo',
  },
  {
    slug: 'ucsi-university',
    name: 'UCSI University',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    qs2027: 'QS #282',
    qsSort: 282,
    majors: 'Computer Science, Pharmacy, Biotechnology, Eng.',
    tuition: 'RM 24,000 – 38,000 / yr',
    scholarship: '20%–50% Trust Scholarship · 4,600+ co-op partners',
    dormOrLiving: 'Hostel RM 500–950/mo',
  },
  {
    slug: 'sichuan-university',
    name: 'Sichuan University',
    city: 'Chengdu',
    country: 'China',
    qs2027: 'QS #300',
    qsSort: 300,
    majors: 'Software Engineering, Civil Eng., Business Admin.',
    tuition: 'CNY 17,500 – 22,000 / yr gross',
    scholarship: 'Belt & Road Scholarship (CNY 20,000/yr)',
    dormOrLiving: 'Dorm CNY 1,500–6,000/yr',
  },
  {
    slug: 'heriot-watt-university-malaysia',
    name: 'Heriot-Watt University Malaysia',
    city: 'Putrajaya',
    country: 'Malaysia',
    qs2027: 'QS #325*',
    qsSort: 325,
    majors: 'Actuarial Science (IFoA UK), Mechanical Eng., Business',
    tuition: 'RM 42,000 – 58,000 / yr',
    scholarship: 'RM 8k–12k/yr High Achiever Waiver · UK Charter',
    dormOrLiving: 'Hostel RM 600–1,200/mo',
  },
  {
    slug: 'scut',
    name: 'South China Univ. of Technology (SCUT)',
    city: 'Guangzhou',
    country: 'China',
    qs2027: 'QS #=342',
    qsSort: 342,
    majors: 'Computer Science, International Trade, Engineering',
    tuition: 'CNY 26,000 / yr gross',
    scholarship: 'SCUT Scholarship Policy up to 100% Free',
    dormOrLiving: 'Dorm CNY 12–27/day',
  },
  {
    slug: 'sunway-university',
    name: 'Sunway University',
    city: 'Sunway City, Selangor',
    country: 'Malaysia',
    qs2027: 'QS #354',
    qsSort: 354,
    majors: 'Computer Science (Lancaster Dual), Actuarial Studies',
    tuition: 'RM 28,000 – 42,000 / yr',
    scholarship: '25%–75% Jeffrey Cheah Entrance Scholarship',
    dormOrLiving: 'Hostel RM 800–1,500/mo',
  },
  {
    slug: 'dalian-university-of-technology',
    name: 'Dalian University of Technology',
    city: 'Dalian',
    country: 'China',
    qs2027: 'QS #463',
    qsSort: 463,
    majors: 'Intelligent Construction, Mech. Automation, Physics',
    tuition: 'CNY 19,500 – 25,000 / yr gross',
    scholarship: 'University Merit Scholarship tiers',
    dormOrLiving: 'Dorm CNY 600–1,800/mo',
  },
  {
    slug: 'asia-pacific-university',
    name: 'Asia Pacific University (APU)',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    qs2027: 'QS #528',
    qsSort: 528,
    majors: 'Cyber Security, AI, Software Eng., FinTech',
    tuition: 'RM 24,000 – 32,000 / yr',
    scholarship: '15%–30% Merit Waiver · De Montfort UK Dual',
    dormOrLiving: 'Hostel RM 750–1,400/mo',
  },
  {
    slug: 'zhengzhou-university',
    name: 'Zhengzhou University (ZZU)',
    city: 'Zhengzhou',
    country: 'China',
    qs2027: 'QS #=581',
    qsSort: 581,
    majors: 'Computer Science, Engineering, Sciences',
    tuition: 'Public university schedule',
    scholarship: 'Henan Govt (CNY 15k) + ZZU President Award',
    dormOrLiving: 'Dorm CNY 5,000 / yr',
  },
  {
    slug: 'nuaa',
    name: 'Nanjing Univ. of Aeronautics & Astronautics',
    city: 'Nanjing',
    country: 'China',
    qs2027: 'QS #721–730',
    qsSort: 721,
    majors: 'Aircraft Design, CS, Mechanical, Electrical Eng.',
    tuition: 'CNY 22,900 – 23,900 / yr gross',
    scholarship: 'NUAA Freshmen Scholarship up to 100% (1st Yr)',
    dormOrLiving: 'Dorm CNY 4,000 / yr',
  },
  {
    slug: 'nantong-university',
    name: 'Nantong University (NTU)',
    city: 'Nantong, Jiangsu',
    country: 'China',
    qs2027: 'Public Applied',
    qsSort: 999,
    majors: 'Computer Science, Robotics Eng., Int’l Economics',
    tuition: 'CNY 16,000 / yr gross',
    scholarship: '100% Tuition Waiver (Class I) or CNY 6k–9k/yr off',
    dormOrLiving: 'Dorm CNY 3,000 / yr',
  },
];

export default function BachelorComparisonInteractiveWorkbench({
  mode = 'global-5way',
  assessmentHref = '#compare-assessment',
}: {
  mode?: 'bd-vs-china' | 'global-5way';
  assessmentHref?: string;
}) {
  const [dhakaUni, setDhakaUni] = useState<DhakaUniId>('nsu');
  const [major, setMajor] = useState<MajorGroup>('cse');
  const [chinaAward, setChinaAward] = useState<ChinaAwardTier>('merit');
  const [cnyRate, setCnyRate] = useState<number>(18.7);
  const [myrRate, setMyrRate] = useState<number>(30.2);
  const [showMasterplan, setShowMasterplan] = useState<boolean>(mode === 'global-5way');
  const [countryFilter, setCountryFilter] = useState<'all' | 'China' | 'Malaysia'>(
    mode === 'bd-vs-china' ? 'China' : 'all',
  );
  const [query, setQuery] = useState<string>('');

  const safeCny = Number.isFinite(cnyRate) && cnyRate >= 10 && cnyRate <= 35 ? cnyRate : 18.7;
  const safeMyr = Number.isFinite(myrRate) && myrRate >= 15 && myrRate <= 60 ? myrRate : 30.2;

  const bars = useMemo(() => {
    const bd = DHAKA_BENCHMARKS[dhakaUni];
    const bdTotalLakh = major === 'cse' ? bd.cseLakh : bd.bbaLakh;
    const china4YrLakh = (CHINA_AWARD_SCENARIOS[chinaAward].annualTuitionCny * 4 * safeCny) / 100000;
    const malaysiaDual3YrLakh = (32000 * 3 * safeMyr) / 100000; // RM 32k/yr illustrative pre-waiver
    const ukMaster1YrLakh = 26; // ~£17k 1-yr UK Master illustrative
    const uk3YrLakh = 90; // Midpoint £60k (~BDT 90L; range 54L–1.74 Cr)
    const usa4YrLakh = 180; // Illustrative $145k midpoint (range 1.0–3.2+ Cr)

    const items = [
      {
        label: `China Ranked Bachelor (4 Yrs · ${CHINA_AWARD_SCENARIOS[chinaAward].label.split(' (')[0]})`,
        lakh: china4YrLakh,
        display: `BDT ${china4YrLakh.toFixed(2)}L (CNY ${(CHINA_AWARD_SCENARIOS[chinaAward].annualTuitionCny * 4).toLocaleString('en-US')})`,
        rankTag: 'QS #47 – #730',
        tone: 'bg-lime-deep',
      },
      {
        label: `${bd.name} (${major.toUpperCase()} · 4 Yrs)`,
        lakh: bdTotalLakh,
        display: `BDT ${bdTotalLakh.toFixed(2)}L`,
        rankTag: bd.qs2027,
        tone: 'bg-petrol-800/50',
      },
    ];

    if (mode === 'global-5way') {
      items.push(
        {
          label: 'Malaysia UK Dual Degree (3 Yrs · Before 15–75% Merit)',
          lakh: malaysiaDual3YrLakh,
          display: `~BDT ${malaysiaDual3YrLakh.toFixed(1)}L (RM 96k ref.)`,
          rankTag: 'QS #31 – #528',
          tone: 'bg-petrol-800',
        },
        {
          label: 'Direct UK 3-Yr Honours (Mid-Range Tuition)',
          lakh: uk3YrLakh,
          display: 'BDT 54L – 1.74 Cr',
          rankTag: 'UK Direct',
          tone: 'bg-clay/80',
        },
        {
          label: 'Direct USA 4-Yr Bachelor (Mid-Range Tuition)',
          lakh: usa4YrLakh,
          display: 'BDT 1.0 – 3.2+ Cr',
          rankTag: 'USA Direct',
          tone: 'bg-clay',
        },
      );
    }

    const maxLakh = Math.max(...items.map(i => i.lakh), 16);
    return {
      items,
      maxLakh,
      bdTotalLakh,
      china4YrLakh,
      twoStepTotalLakh: china4YrLakh + ukMaster1YrLakh,
      savedVsUkLakh: Math.max(0, uk3YrLakh - (china4YrLakh + ukMaster1YrLakh)),
    };
  }, [chinaAward, dhakaUni, major, mode, safeCny, safeMyr]);

  const filteredUnis = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VERIFIED_EXPLORER_UNIVERSITIES.filter(u => {
      if (countryFilter !== 'all' && u.country !== countryFilter) return false;
      if (!q) return true;
      return `${u.name} ${u.city} ${u.majors} ${u.scholarship} ${u.qs2027}`.toLowerCase().includes(q);
    });
  }, [countryFilter, query]);

  return (
    <div className="space-y-8">
      {/* Part A: Interactive Cost & Masterplan Simulator */}
      <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-canvas-soft pb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-bold text-lime-deep">
              <Calculator size={15} aria-hidden="true" />
              Interactive 2027 Tuition &amp; Ranking Simulator
            </span>
            <h3 className="mt-3 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">
              {mode === 'bd-vs-china'
                ? 'Compare Dhaka Category-A Tuition Against Ranked China Live'
                : 'Compare 4-Year / Full-Degree Academic Tuition Across Global Routes'}
            </h3>
            <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-soft">
              Toggle your Dhaka private benchmark, Chinese scholarship tier, and bank FX rates. Every bar displays <strong>tuition only</strong> with living expenses kept strictly separate.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <label className="flex flex-col rounded-2xl border border-petrol-800/15 bg-canvas-soft px-3.5 py-2 text-[12px] font-semibold text-petrol-800">
              <span className="flex items-center gap-1 text-ink-soft">
                <SlidersHorizontal size={12} aria-hidden="true" />
                1 CNY = BDT
              </span>
              <input
                type="number"
                step="0.1"
                min="10"
                max="35"
                value={cnyRate}
                onChange={e => setCnyRate(Number(e.target.value))}
                aria-label="CNY to BDT rate"
                className="mt-1 w-20 rounded-lg border border-petrol-800/20 bg-white px-2 py-1 text-[14px] font-bold text-petrol-800"
              />
            </label>
            {mode === 'global-5way' && (
              <label className="flex flex-col rounded-2xl border border-petrol-800/15 bg-canvas-soft px-3.5 py-2 text-[12px] font-semibold text-petrol-800">
                <span className="flex items-center gap-1 text-ink-soft">
                  <SlidersHorizontal size={12} aria-hidden="true" />
                  1 MYR = BDT
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="15"
                  max="60"
                  value={myrRate}
                  onChange={e => setMyrRate(Number(e.target.value))}
                  aria-label="MYR to BDT rate"
                  className="mt-1 w-20 rounded-lg border border-petrol-800/20 bg-white px-2 py-1 text-[14px] font-bold text-petrol-800"
                />
              </label>
            )}
          </div>
        </div>

        {/* Selector Row */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div>
            <p className="text-[13.5px] font-bold text-petrol-800">1. Dhaka Private University Baseline</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(DHAKA_BENCHMARKS) as DhakaUniId[]).map(id => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDhakaUni(id)}
                  aria-pressed={dhakaUni === id}
                  className={`min-h-[42px] rounded-xl border px-3.5 py-2 text-[13px] font-bold transition ${
                    dhakaUni === id
                      ? 'border-petrol-800 bg-petrol-800 text-white'
                      : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                  }`}
                >
                  {id.toUpperCase()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMajor(major === 'cse' ? 'bba' : 'cse')}
                className="min-h-[42px] rounded-xl border border-petrol-800/20 bg-lime-pale px-3.5 py-2 text-[13px] font-bold text-lime-deep transition hover:bg-lime"
              >
                Major: {major.toUpperCase()} ⇄
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[13.5px] font-bold text-petrol-800">2. China University Scholarship Scenario</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(Object.keys(CHINA_AWARD_SCENARIOS) as ChinaAwardTier[]).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChinaAward(key)}
                  aria-pressed={chinaAward === key}
                  className={`min-h-[46px] rounded-xl border px-3 py-2 text-left text-[12.5px] font-bold transition ${
                    chinaAward === key
                      ? 'border-petrol-800 bg-lime text-petrol-800'
                      : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale/60'
                  }`}
                >
                  {CHINA_AWARD_SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-soft">{CHINA_AWARD_SCENARIOS[chinaAward].note}</p>
          </div>
        </div>

        {/* Live Responsive Bar Chart */}
        <div className="mt-6 space-y-3.5 rounded-3xl bg-canvas-soft p-5 sm:p-6">
          {bars.items.map(bar => {
            const widthPct = Math.max(4, Math.min(100, Math.round((bar.lakh / bars.maxLakh) * 100)));
            return (
              <div key={bar.label}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-[13.5px]">
                  <span className="font-bold text-petrol-800">
                    {bar.label}{' '}
                    <span className="ml-1 inline-block rounded-full bg-white px-2 py-0.5 text-[11.5px] font-semibold text-ink-soft">
                      {bar.rankTag}
                    </span>
                  </span>
                  <span className="font-display text-[15px] font-black text-petrol-800">{bar.display}</span>
                </div>
                <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${bar.tone}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* 2-Step Masterplan Toggle */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-petrol-800/10 pt-4">
            <button
              type="button"
              onClick={() => setShowMasterplan(v => !v)}
              aria-pressed={showMasterplan}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-petrol-800 px-4 py-2 text-[13px] font-bold text-lime transition hover:bg-petrol-700"
            >
              <Sparkles size={15} aria-hidden="true" />
              {showMasterplan ? 'Hide 2-Step Western Master’s Math' : 'Reveal 2-Step Western Master’s Strategy'}
            </button>
            <a href={assessmentHref} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-petrol-800 hover:underline">
              Request my exact written ClearCost Sheet <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>

          {showMasterplan && (
            <div className="rounded-2xl bg-petrol-800 p-5 text-white">
              <p className="text-[12px] font-bold uppercase tracking-wider text-lime">
                2-Step Global Masterplan: China Ranked Bachelor + 1-Year UK Master’s
              </p>
              <div className="mt-2 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[12px] text-white/75">4-Yr China Net Tuition</p>
                  <p className="font-display text-[20px] font-black">BDT {bars.china4YrLakh.toFixed(2)}L</p>
                </div>
                <div>
                  <p className="text-[12px] text-white/75">+ 1-Yr UK Master’s (~£17k ref.)</p>
                  <p className="font-display text-[20px] font-black text-lime">
                    ~BDT {bars.twoStepTotalLakh.toFixed(1)}L Combined
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-white/75">Capital Preserved vs. UK Bachelor Alone</p>
                  <p className="font-display text-[20px] font-black text-lime">
                    ~BDT {bars.savedVsUkLakh.toFixed(0)}L+ Saved
                  </p>
                </div>
              </div>
              <p className="mt-2.5 text-[13px] leading-5 text-white/80">
                Both degrees (QS-ranked China Bachelor + 1-Year UK Master’s) still cost dramatically less in academic tuition than a single 3-year Western undergraduate degree—while keeping monthly living costs strictly separated.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Part B: Interactive Filterable QS World 2027 University Explorer */}
      <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-3 py-1 text-[12.5px] font-bold text-petrol-800">
              <Globe2 size={14} aria-hidden="true" />
              Verified QS World Rankings 2027 Explorer
            </span>
            <h3 className="mt-2.5 font-display text-[22px] font-black text-petrol-800 sm:text-[26px]">
              Filter Verified China &amp; Malaysia Campuses by Major, City or Rank
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'global-5way' && (
              <div className="flex rounded-full border border-petrol-800/15 bg-canvas-soft p-1">
                {(['all', 'China', 'Malaysia'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCountryFilter(tab)}
                    className={`min-h-[36px] rounded-full px-3.5 text-[13px] font-bold transition ${
                      countryFilter === tab ? 'bg-petrol-800 text-white' : 'text-petrol-800 hover:bg-white'
                    }`}
                  >
                    {tab === 'all' ? 'All (18)' : tab}
                  </button>
                ))}
              </div>
            )}
            <label className="relative flex items-center">
              <Search size={15} className="pointer-events-none absolute left-3.5 text-ink-mute" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search CS, AI, Business, Shanghai..."
                aria-label="Filter universities by major, city, or name"
                className="min-h-[42px] w-60 rounded-full border border-petrol-800/20 bg-canvas-soft pl-9 pr-4 text-[13.5px] text-petrol-800 placeholder:text-ink-mute focus:border-petrol-800 focus:bg-white focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnis.map(uni => (
            <div
              key={uni.slug}
              className="flex flex-col justify-between rounded-2xl border border-canvas-soft bg-canvas-soft/60 p-4 transition hover:border-petrol-800/25 hover:bg-white"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-petrol-800 px-2.5 py-0.5 text-[11.5px] font-bold text-lime">
                    {uni.qs2027}
                  </span>
                  <span className="text-[12px] font-semibold text-ink-soft">
                    {uni.city}, {uni.country}
                  </span>
                </div>
                <h4 className="mt-2.5 text-[16px] font-bold leading-snug text-petrol-800">{uni.name}</h4>
                <p className="mt-1.5 text-[13px] leading-5 text-ink-soft">
                  <strong className="text-petrol-800">Majors:</strong> {uni.majors}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-petrol-800">
                  <strong>Tuition:</strong> {uni.tuition}
                </p>
                <p className="mt-1 text-[12.5px] font-semibold leading-5 text-lime-deep">{uni.scholarship}</p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-petrol-800/10 pt-2.5 text-[12.5px]">
                <span className="text-ink-soft">{uni.dormOrLiving}</span>
                <Link href={`/universities/${uni.slug}`} className="font-bold text-petrol-800 hover:underline">
                  Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredUnis.length === 0 && (
          <p className="mt-5 rounded-2xl bg-canvas-soft p-5 text-center text-[14.5px] text-ink-soft">
            No universities matched &ldquo;{query}&rdquo;. Try searching &ldquo;Computer&rdquo;, &ldquo;Engineering&rdquo;, &ldquo;Business&rdquo;, &ldquo;Dual&rdquo;, or clear the filter.
          </p>
        )}
      </div>
    </div>
  );
}

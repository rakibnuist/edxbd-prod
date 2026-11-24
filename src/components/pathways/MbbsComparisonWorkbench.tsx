'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MOE_MBBS_UNIVERSITIES,
  type MoeMbbsUniversityRecord,
} from '@/data/bangladeshVsChinaMbbs';

type ChinaPresetKey = 'budget' | 'flagship' | 'elite';

const CHINA_PRESETS: Record<
  ChinaPresetKey,
  {
    label: string;
    examples: string;
    tuitionRmb: number;
    hostelRmb: number;
    otherFeesRmb: number;
    defaultYear1Award: number;
  }
> = {
  budget: {
    label: 'Budget MOE Tier (CNY 24k–28k/yr)',
    examples: 'China Three Gorges (24k), Nantong (26k), Beihua (26k), North Sichuan (26k), Shihezi (28k)',
    tuitionRmb: 26000,
    hostelRmb: 4000,
    otherFeesRmb: 1600,
    defaultYear1Award: 5000,
  },
  flagship: {
    label: 'Provincial Flagship Tier (CNY 30k–34k/yr)',
    examples: 'CQMU (30k), Kunming Med (30k), Guangzhou Med (30k), WMU (33k), Jilin (33k), JSU (34k)',
    tuitionRmb: 30000,
    hostelRmb: 4800,
    otherFeesRmb: 1600,
    defaultYear1Award: 15000,
  },
  elite: {
    label: '985 / 211 / C9 Research Tier (CNY 40k–45k/yr)',
    examples: 'XJTU (40k), Wuhan (40k), HUST (40k), Sichuan (42k), Zhejiang (42.8k), Tongji (45k)',
    tuitionRmb: 42000,
    hostelRmb: 6000,
    otherFeesRmb: 1800,
    defaultYear1Award: 20000,
  },
};

const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
const fmtLakh = (bdt: number) => `BDT ${(bdt / 100000).toFixed(2)} Lakh`;

export function MbbsCostCalculator({ assessmentHref = '#mbbs-assessment' }: { assessmentHref?: string }) {
  const [preset, setPreset] = useState<ChinaPresetKey>('flagship');
  const [fxRate, setFxRate] = useState<number>(18.7);
  const [tuitionRmb, setTuitionRmb] = useState<number>(CHINA_PRESETS.flagship.tuitionRmb);
  const [hostelRmb, setHostelRmb] = useState<number>(CHINA_PRESETS.flagship.hostelRmb);
  const [otherFeesRmb, setOtherFeesRmb] = useState<number>(CHINA_PRESETS.flagship.otherFeesRmb);
  const [includePreMed, setIncludePreMed] = useState<boolean>(false);
  const [preMedFeeRmb, setPreMedFeeRmb] = useState<number>(9500);
  const [year1AwardRmb, setYear1AwardRmb] = useState<number>(CHINA_PRESETS.flagship.defaultYear1Award);
  const [annualMeritRmb, setAnnualMeritRmb] = useState<number>(0);

  const applyPreset = (key: ChinaPresetKey) => {
    setPreset(key);
    setTuitionRmb(CHINA_PRESETS[key].tuitionRmb);
    setHostelRmb(CHINA_PRESETS[key].hostelRmb);
    setOtherFeesRmb(CHINA_PRESETS[key].otherFeesRmb);
    setYear1AwardRmb(CHINA_PRESETS[key].defaultYear1Award);
  };

  // Bangladesh Private Medical Statutory Core (MOHFW / DGME Gazette)
  const bdDay1AdmissionBdt = 1274400; // 60% of BDT 21,24,000 admission + internship ceiling
  const bdStatutoryCoreBdt = 2724000; // 19.44L admission + 1.80L internship + 6.00L (60 mos * 10k)
  const bdExamRegEstBdt = 350000; // Univ registration (DU/CMU/RU), 4 Prof exams, BMDC student reg, clinical kits
  const bdAcademicCoreBdt = bdStatutoryCoreBdt + bdExamRegEstBdt; // ~30.74L academic before hostel & food
  const bdSeparateHostelFoodBdt = 900000; // 60 months * ~15,000 BDT/mo hostel + dining (separate living)

  // China MOE MBBS University Academic + Dorm Calculation
  const chinaYear1GrossRmb = tuitionRmb + hostelRmb + otherFeesRmb;
  const chinaYear1NetRmb = Math.max(0, chinaYear1GrossRmb - year1AwardRmb) + (includePreMed ? preMedFeeRmb : 0);
  const chinaYear1NetBdt = chinaYear1NetRmb * fxRate;

  const china6YrGrossRmb = chinaYear1GrossRmb * 6 + (includePreMed ? preMedFeeRmb : 0);
  const chinaTotalAwardsRmb = year1AwardRmb + annualMeritRmb * 4; // Yrs 2–5 merit potential
  const china6YrNetRmb = Math.max(0, china6YrGrossRmb - chinaTotalAwardsRmb);
  const china6YrNetBdt = china6YrNetRmb * fxRate;

  const day1SavingsBdt = bdDay1AdmissionBdt - chinaYear1NetBdt;

  return (
    <div className="rounded-3xl border border-petrol-800/12 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-canvas-soft pb-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-bold text-lime-deep">
            <Calculator size={15} aria-hidden="true" />
            Interactive Cash-Flow &amp; 6-Year Budget Model
          </span>
          <h3 className="mt-3 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">
            Compare Day-1 Upfront Cash &amp; 6-Year Academic Costs
          </h3>
          <p className="mt-1.5 text-[15px] leading-6 text-ink-soft">
            Select a Chinese MOE university tier and adjust the live RMB→BDT rate, optional March Pre-Med semester, or
            verified freshman scholarship. Personal food/living expenses are kept strictly separate below.
          </p>
        </div>
        <div className="rounded-2xl bg-canvas-soft px-4 py-3 text-right">
          <label htmlFor="mbbs-fx-rate" className="block text-[12px] font-bold uppercase tracking-wider text-ink-soft">
            Editable Bank Rate (1 CNY)
          </label>
          <div className="mt-1 flex items-center justify-end gap-2">
            <input
              id="mbbs-fx-rate"
              type="number"
              min={16}
              max={23}
              step={0.05}
              value={fxRate}
              onChange={(e) => setFxRate(Math.max(16, Math.min(23, Number(e.target.value) || 18.7)))}
              className="w-24 rounded-xl border border-petrol-800/25 bg-white px-3 py-1.5 text-right font-display text-[18px] font-black text-petrol-800 focus:outline-none focus:ring-2 focus:ring-lime"
            />
            <span className="text-[14px] font-bold text-petrol-800">BDT</span>
          </div>
        </div>
      </div>

      {/* Tier Presets */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {(Object.keys(CHINA_PRESETS) as ChinaPresetKey[]).map((key) => {
          const item = CHINA_PRESETS[key];
          const active = preset === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? 'border-petrol-800 bg-petrol-800 text-white shadow-sm'
                  : 'border-petrol-800/15 bg-canvas-soft/70 text-petrol-800 hover:bg-lime-pale/50'
              }`}
            >
              <p className={`text-[14.5px] font-bold ${active ? 'text-lime' : 'text-petrol-800'}`}>{item.label}</p>
              <p className={`mt-1 text-[12.5px] leading-5 ${active ? 'text-white/80' : 'text-ink-soft'}`}>
                {item.examples}
              </p>
            </button>
          );
        })}
      </div>

      {/* Fine-Tune Controls */}
      <div className="mt-6 grid gap-4 rounded-2xl bg-canvas-soft p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="calc-tuition" className="block text-[13px] font-semibold text-petrol-800">
            Annual MBBS Tuition (CNY)
          </label>
          <input
            id="calc-tuition"
            type="number"
            min={24000}
            max={75000}
            step={1000}
            value={tuitionRmb}
            onChange={(e) => setTuitionRmb(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-petrol-800/20 bg-white px-3.5 text-[15px] font-semibold text-petrol-800"
          />
        </div>

        <div>
          <label htmlFor="calc-hostel" className="block text-[13px] font-semibold text-petrol-800">
            Annual Dorm + Insurance (CNY)
          </label>
          <input
            id="calc-hostel"
            type="number"
            min={3500}
            max={20000}
            step={200}
            value={hostelRmb + otherFeesRmb}
            onChange={(e) => {
              const total = Math.max(0, Number(e.target.value) || 0);
              setHostelRmb(Math.max(0, total - otherFeesRmb));
            }}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-petrol-800/20 bg-white px-3.5 text-[15px] font-semibold text-petrol-800"
          />
        </div>

        <div>
          <label htmlFor="calc-y1-award" className="block text-[13px] font-semibold text-petrol-800">
            Year-1 Freshman / Prov. Award (CNY)
          </label>
          <select
            id="calc-y1-award"
            value={year1AwardRmb}
            onChange={(e) => setYear1AwardRmb(Number(e.target.value))}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-petrol-800/20 bg-white px-3 text-[15px] font-semibold text-petrol-800"
          >
            <option value={0}>CNY 0 (Self-funded baseline)</option>
            <option value={5000}>CNY 5,000 (Tier-3 Freshman)</option>
            <option value={10000}>CNY 10,000 (Guangdong / UJS)</option>
            <option value={15000}>CNY 15,000 (CQMU / Sichuan)</option>
            <option value={20000}>CNY 20,000 (WMU / Zhejiang)</option>
            <option value={30000}>CNY 30,000 (Jasmine / Fujian)</option>
          </select>
        </div>

        <div>
          <label htmlFor="calc-merit-award" className="block text-[13px] font-semibold text-petrol-800">
            Yrs 2–5 Annual Merit Award (CNY/yr)
          </label>
          <select
            id="calc-merit-award"
            value={annualMeritRmb}
            onChange={(e) => setAnnualMeritRmb(Number(e.target.value))}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-petrol-800/20 bg-white px-3 text-[15px] font-semibold text-petrol-800"
          >
            <option value={0}>CNY 0/yr (Conservative plan)</option>
            <option value={4000}>CNY 4,000/yr (3rd Prize Merit)</option>
            <option value={8000}>CNY 8,000/yr (2nd Prize Merit)</option>
            <option value={12000}>CNY 12,000/yr (1st Prize Top 10%)</option>
          </select>
        </div>
      </div>

      {/* Optional March Pre-Med Toggle */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-petrol-800/10 bg-white px-4 py-3">
        <label className="inline-flex cursor-pointer items-center gap-3 text-[14.5px] font-semibold text-petrol-800">
          <input
            type="checkbox"
            checked={includePreMed}
            onChange={(e) => setIncludePreMed(e.target.checked)}
            className="size-5 accent-petrol-800"
          />
          Include optional 6-Month March Pre-Med Foundation (for Spring entry / 17-yr-olds / CSCA prep)
        </label>
        {includePreMed && (
          <div className="flex items-center gap-2 text-[14px]">
            <span className="text-ink-soft">Pre-Med Fee:</span>
            <input
              type="number"
              min={7000}
              max={20000}
              step={500}
              value={preMedFeeRmb}
              onChange={(e) => setPreMedFeeRmb(Math.max(0, Number(e.target.value) || 0))}
              className="w-28 rounded-lg border border-petrol-800/20 px-2.5 py-1 text-right font-bold text-petrol-800"
            />
            <span className="font-semibold text-petrol-800">CNY</span>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Output Cards */}
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        {/* Bangladesh Card */}
        <div className="rounded-3xl border border-clay/20 bg-canvas-soft/60 p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-clay/10 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-clay">
              Bangladesh Private Medical (MOHFW Gazette)
            </span>
          </div>
          <dl className="mt-5 space-y-3.5 text-[15px]">
            <div className="flex items-baseline justify-between gap-3 border-b border-petrol-800/10 pb-3">
              <dt className="font-semibold text-petrol-800">Day-1 Mandatory Upfront Installment (60%)</dt>
              <dd className="font-display text-[22px] font-black text-clay">{fmtLakh(bdDay1AdmissionBdt)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-soft">Statutory Admission + Internship Ceiling</dt>
              <dd className="font-semibold text-petrol-800">BDT 21,24,000</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-soft">60-Month Tuition (BDT 10,000/mo)</dt>
              <dd className="font-semibold text-petrol-800">BDT 6,00,000</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-ink-soft">Univ. Registration, 4 Prof Exams &amp; Kits (est.)</dt>
              <dd className="font-semibold text-petrol-800">~BDT 3,50,000</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-petrol-800/15 pt-3">
              <dt className="font-bold text-petrol-800">5-Yr Academic Core (Before Hostel &amp; Meals)</dt>
              <dd className="font-display text-[22px] font-black text-petrol-800">{fmtLakh(bdAcademicCoreBdt)}</dd>
            </div>
            <div className="rounded-2xl bg-white p-3.5 text-[13.5px] leading-5 text-ink-soft">
              <strong className="text-petrol-800">Separated Local Hostel + Mess (5 yrs):</strong> ~{fmtLakh(bdSeparateHostelFoodBdt)} additional (~BDT 12k–18k/mo) →{' '}
              <strong className="text-petrol-800">~{fmtLakh(bdAcademicCoreBdt + bdSeparateHostelFoodBdt)} residential total</strong>, with a 250–750 bed local private hospital.
            </div>
          </dl>
        </div>

        {/* China Card */}
        <div className="rounded-3xl bg-petrol-800 p-6 text-white">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-lime px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-petrol-800">
              China MOE Public Medical University
            </span>
            <span className="text-[12.5px] font-semibold text-lime">BDT 0 Capitation</span>
          </div>
          <dl className="mt-5 space-y-3.5 text-[15px]">
            <div className="flex items-baseline justify-between gap-3 border-b border-white/15 pb-3">
              <dt className="font-semibold text-white">Year-1 Net University Tuition + Dorm</dt>
              <dd className="text-right">
                <span className="block font-display text-[22px] font-black text-lime">{fmtLakh(chinaYear1NetBdt)}</span>
                <span className="text-[12.5px] text-white/75">CNY {fmtNum(chinaYear1NetRmb)} @ {fxRate.toFixed(2)}</span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-white/80">Annual MBBS Tuition (Before Award)</dt>
              <dd className="font-semibold text-white">CNY {fmtNum(tuitionRmb)}/yr</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-white/80">On-Campus Dorm + Insurance / Permit</dt>
              <dd className="font-semibold text-white">CNY {fmtNum(hostelRmb + otherFeesRmb)}/yr</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-white/80">Total Scholarships Applied (Yr 1 + Yrs 2–5)</dt>
              <dd className="font-semibold text-lime">− CNY {fmtNum(chinaTotalAwardsRmb)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-white/20 pt-3">
              <dt className="font-bold text-white">6-Yr University Tuition + Dorm Subtotal</dt>
              <dd className="text-right">
                <span className="block font-display text-[22px] font-black text-lime">{fmtLakh(china6YrNetBdt)}</span>
                <span className="text-[12.5px] text-white/75">CNY {fmtNum(china6YrNetRmb)} total over 6 yrs</span>
              </dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-3.5 text-[13.5px] leading-5 text-white/85">
              <strong className="text-lime">Day-1 Cash Flow Advantage:</strong>{' '}
              {day1SavingsBdt > 0
                ? `Pay ~${fmtLakh(day1SavingsBdt)} LESS upfront in Year 1 compared to Bangladesh’s mandatory BDT 12.74L admission installment.`
                : 'Paid annually without any private capitation fee.'}{' '}
              Separated meals/living (~CNY 800–1,300/mo), flights, visa &amp; EduExpress Visa-First service package are budgeted separately.
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-canvas-soft pt-5">
        <p className="text-[13.5px] leading-5 text-ink-soft">
          <strong>Note:</strong> If your university permits the 6th-year clinical internship in Bangladesh after passing BMDC RQE, Year-6 China dorm and living expenses drop further. Request a written university-specific ClearCost Sheet before paying any deposit.
        </p>
        <a href={assessmentHref} className="ed-btn ed-btn-signal min-h-[46px] shrink-0 px-6">
          Get My Written ClearCost Sheet <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function MoeMbbsDirectoryExplorer({
  universities = MOE_MBBS_UNIVERSITIES,
}: {
  universities?: MoeMbbsUniversityRecord[];
}) {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('All');
  const [tierGroup, setTierGroup] = useState('All');
  const [maxTuition, setMaxTuition] = useState('all');
  const [onlyPreMed, setOnlyPreMed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const provinces = useMemo(() => {
    const counts = new Map<string, number>();
    universities.forEach((u) => counts.set(u.province, (counts.get(u.province) ?? 0) + 1));
    return ['All', ...Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([p]) => p)];
  }, [universities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities
      .filter((u) => {
        const matchesQuery =
          !q ||
          `${u.name} ${u.chineseName} ${u.city} ${u.province} ${u.tier} ${u.scholarshipDetail}`
            .toLowerCase()
            .includes(q);
        const matchesProvince = province === 'All' || u.province === province;
        const matchesTier = tierGroup === 'All' || u.tierGroup === tierGroup;
        const matchesTuition = maxTuition === 'all' || u.tuitionRmb <= Number(maxTuition);
        const matchesPreMed = !onlyPreMed || u.preMedAvailable;
        return matchesQuery && matchesProvince && matchesTier && matchesTuition && matchesPreMed;
      })
      .sort((a, b) => a.tuitionRmb - b.tuitionRmb);
  }, [universities, query, province, tierGroup, maxTuition, onlyPreMed]);

  const visible = showAll ? filtered : filtered.slice(0, 12);

  const reset = () => {
    setQuery('');
    setProvince('All');
    setTierGroup('All');
    setMaxTuition('all');
    setOnlyPreMed(false);
  };

  return (
    <div>
      {/* Filter Toolbar */}
      <div className="rounded-3xl bg-canvas-soft p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="moe-search" className="mb-1.5 block text-[13.5px] font-semibold text-petrol-800">
              Search university or city
            </label>
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true" />
              <input
                id="moe-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Nanjing, Sichuan, Wenzhou, CTGU"
                className="min-h-[46px] w-full rounded-xl border border-petrol-800/20 bg-white pl-10 pr-3.5 text-[15px] text-petrol-800 placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>

          <div>
            <label htmlFor="moe-province" className="mb-1.5 block text-[13.5px] font-semibold text-petrol-800">
              Province / Municipality
            </label>
            <select
              id="moe-province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-petrol-800/20 bg-white px-3.5 text-[15px] text-petrol-800"
            >
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Provinces (45 Schools)' : p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="moe-tier" className="mb-1.5 block text-[13.5px] font-semibold text-petrol-800">
              University Tier
            </label>
            <select
              id="moe-tier"
              value={tierGroup}
              onChange={(e) => setTierGroup(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-petrol-800/20 bg-white px-3.5 text-[15px] text-petrol-800"
            >
              <option value="All">All Tiers</option>
              <option value="C9 / 985 / 211">C9 League / Project 985 / 211</option>
              <option value="Double First-Class">Double First-Class Medical</option>
              <option value="Provincial Medical">Provincial Flagship &amp; Key Medical</option>
            </select>
          </div>

          <div>
            <label htmlFor="moe-budget" className="mb-1.5 block text-[13.5px] font-semibold text-petrol-800">
              Max Annual Tuition
            </label>
            <select
              id="moe-budget"
              value={maxTuition}
              onChange={(e) => setMaxTuition(e.target.value)}
              className="min-h-[46px] w-full rounded-xl border border-petrol-800/20 bg-white px-3.5 text-[15px] text-petrol-800"
            >
              <option value="all">All Tuition Ranges (CNY 24k–75k)</option>
              <option value="28000">Budget: Up to CNY 28,000 / yr</option>
              <option value="35000">Mid-Range: Up to CNY 35,000 / yr</option>
              <option value="45000">Up to CNY 45,000 / yr</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-petrol-800/10 pt-3.5">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[14.5px] font-medium text-petrol-800">
            <input
              type="checkbox"
              checked={onlyPreMed}
              onChange={(e) => setOnlyPreMed(e.target.checked)}
              className="size-4 accent-petrol-800"
            />
            Only show universities with 6-Month March / Pre-Med Foundation
          </label>
          <div className="flex items-center gap-4 text-[14px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-petrol-800">
              <SlidersHorizontal size={14} aria-hidden="true" />
              Showing {visible.length} of {filtered.length} matching universities
            </span>
            {(query || province !== 'All' || tierGroup !== 'All' || maxTuition !== 'all' || onlyPreMed) && (
              <button
                type="button"
                onClick={reset}
                className="font-semibold text-petrol-800 underline underline-offset-4 hover:text-lime-deep"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Table (Desktop) + Responsive Cards */}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-canvas-soft bg-white shadow-sm">
        <table className="w-full min-w-[960px] text-left text-[14px] leading-5">
          <caption className="sr-only">
            Reference directory of 45 Chinese MOE-authorized English-medium MBBS universities with tuition, hostel, Pre-Med, CSCA, HSK and scholarship details
          </caption>
          <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
            <tr>
              <th scope="col" className="p-4 font-bold">University &amp; City</th>
              <th scope="col" className="p-4 font-bold">Tier &amp; Quota</th>
              <th scope="col" className="p-4 font-bold text-lime">Tuition &amp; Hostel (CNY/yr)</th>
              <th scope="col" className="p-4 font-bold">March Pre-Med &amp; CSCA</th>
              <th scope="col" className="p-4 font-bold">Scholarships &amp; Internship</th>
              <th scope="col" className="p-4 font-bold text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-canvas-soft text-ink-soft">
            {visible.map((u) => (
              <tr key={u.no} className="transition-colors hover:bg-canvas-soft/45">
                <td className="p-4 align-top">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-canvas-soft text-[11px] font-bold text-petrol-800">
                      {u.no}
                    </span>
                    <div>
                      <p className="font-bold text-petrol-800">{u.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] text-ink-soft">
                        <MapPin size={12} aria-hidden="true" />
                        {u.city}, {u.province} · {u.chineseName}
                      </p>
                      {u.verified2026FeeNote && (
                        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-lime-pale px-2.5 py-0.5 text-[11.5px] font-semibold text-lime-deep">
                          <CheckCircle2 size={11} aria-hidden="true" />
                          {u.verified2026FeeNote}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className="inline-flex items-center gap-1 rounded-full bg-canvas-soft px-2.5 py-0.5 text-[12px] font-semibold text-petrol-800">
                    <Building2 size={11} aria-hidden="true" />
                    {u.tier}
                  </span>
                  <p className="mt-1.5 text-[12.5px]">Annual Quota: <strong className="text-petrol-800">{u.quota} seats</strong></p>
                  <p className="text-[12.5px]">Deadline: {u.deadline}</p>
                </td>
                <td className="bg-lime-pale/20 p-4 align-top">
                  <p className="font-display text-[17px] font-black text-petrol-800">
                    CNY {fmtNum(u.tuitionRmb)}<span className="font-sans text-[12px] font-normal text-ink-soft">/yr</span>
                  </p>
                  <p className="mt-0.5 text-[12.5px]">Dorm: CNY {fmtNum(u.hostelRmb)}/yr</p>
                  <p className="text-[12px] text-ink-mute">
                    ≈ BDT {((u.tuitionRmb * 18.7) / 100000).toFixed(2)}L/yr tuition
                  </p>
                </td>
                <td className="p-4 align-top">
                  <p className="font-semibold text-petrol-800">
                    {u.preMedAvailable ? `${u.preMedNote} (${fmtNum(u.preMedFeeRmb)} RMB)` : u.preMedNote}
                  </p>
                  <p className="mt-1 text-[12.5px]">CSCA: <strong className="text-petrol-800">{u.cscaStatus}</strong></p>
                  <p className="text-[12.5px]">HSK: {u.hskRule}</p>
                </td>
                <td className="p-4 align-top">
                  <p className="font-semibold text-lime-deep">{u.scholarshipDetail}</p>
                  <p className="mt-1 text-[12.5px]">Internship: {u.internshipPolicy}</p>
                </td>
                <td className="p-4 align-top text-right">
                  <Link
                    href={`/universities/${u.slug}`}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-canvas-soft px-3.5 text-[13px] font-bold text-petrol-800 transition hover:bg-lime"
                  >
                    View <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="mt-5 rounded-3xl border border-dashed border-petrol-800/25 p-8 text-center">
          <p className="text-[16px] font-semibold text-petrol-800">No medical universities matched those filters.</p>
          <button type="button" onClick={reset} className="ed-btn ed-btn-outline mt-4 min-h-[44px] px-6">
            Show All 45 MOE Universities
          </button>
        </div>
      )}

      {filtered.length > 12 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="ed-btn ed-btn-outline min-h-[48px] px-7"
          >
            {showAll ? (
              <>
                Show Compact Top 12 <ChevronUp size={17} aria-hidden="true" />
              </>
            ) : (
              <>
                Expand All {filtered.length} MOE Medical Universities <ChevronDown size={17} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

type DegreeLevel = 'bachelor' | 'master' | 'phd';
type ProofQuality = 'strong_work_tax' | 'academic_session_jam' | 'informal_none';

type CountryRule = {
  name: string;
  flag: string;
  href: string;
  maxGapSafe: Record<DegreeLevel, number>;
  maxGapConditional: Record<DegreeLevel, number>;
  maxAgeLimit: Record<DegreeLevel, number>;
  scholarshipAgeNote: string;
  evidenceNote: string;
};

const COUNTRY_GAP_RULES: CountryRule[] = [
  {
    name: 'China (Flagship)',
    flag: '🇨🇳',
    href: '/study-in-china-from-bangladesh',
    maxGapSafe: { bachelor: 3, master: 6, phd: 10 },
    maxGapConditional: { bachelor: 5, master: 10, phd: 14 },
    maxAgeLimit: { bachelor: 25, master: 35, phd: 40 },
    scholarshipAgeNote: 'CSC age limits: Bachelor <25, Master <35, PhD <40 (Self-funded / University tracks allow slightly higher age with strong CV).',
    evidenceNote: 'Continuous CV chronology + Employer NOC or BTEB/Session Jam certificate.',
  },
  {
    name: 'Malaysia (BDT 0 Fee)',
    flag: '🇲🇾',
    href: '/study-in-malaysia-from-bangladesh',
    maxGapSafe: { bachelor: 5, master: 10, phd: 15 },
    maxGapConditional: { bachelor: 7, master: 15, phd: 20 },
    maxAgeLimit: { bachelor: 35, master: 45, phd: 45 },
    scholarshipAgeNote: 'EMGS eVAL permits international students up to age 45; private merit waivers (10%–75%) have no strict gap penalty.',
    evidenceNote: 'Updated CV + work experience certificate or study gap explanation letter.',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    href: '/study-in-uk-from-bangladesh',
    maxGapSafe: { bachelor: 2, master: 6, phd: 12 },
    maxGapConditional: { bachelor: 3, master: 10, phd: 15 },
    maxAgeLimit: { bachelor: 26, master: 45, phd: 50 },
    scholarshipAgeNote: 'No statutory upper age cap for Postgraduate study, provided Pre-CAS credibility interview & salary trail are clean.',
    evidenceNote: 'Mandatory verifiable employment NOC + bank salary credits/payslips for gaps >2 years.',
  },
  {
    name: 'Finland',
    flag: '🇫🇮',
    href: '/study-in-finland-from-bangladesh',
    maxGapSafe: { bachelor: 4, master: 10, phd: 15 },
    maxGapConditional: { bachelor: 6, master: 14, phd: 20 },
    maxAgeLimit: { bachelor: 40, master: 50, phd: 55 },
    scholarshipAgeNote: 'Nordic lifelong learning policy has no upper age cap; admission depends on entrance exam + Migri €9,600 personal bank provenance.',
    evidenceNote: 'Pass national UAS/University entrance exam + transparent source of funds.',
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    href: '/study-in-hungary-from-bangladesh',
    maxGapSafe: { bachelor: 2, master: 5, phd: 10 },
    maxGapConditional: { bachelor: 3, master: 8, phd: 12 },
    maxAgeLimit: { bachelor: 25, master: 36, phd: 42 },
    scholarshipAgeNote: 'Stipendium Hungaricum requires turning 18 by Aug 31; self-funded Type D visa interviews scrutinize gaps >3 years closely.',
    evidenceNote: 'Pass university entrance exam + clear verbal explanation at VFS/Embassy interview.',
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    href: '/study-in-south-korea-from-bangladesh',
    maxGapSafe: { bachelor: 1, master: 4, phd: 8 },
    maxGapConditional: { bachelor: 2, master: 6, phd: 10 },
    maxAgeLimit: { bachelor: 25, master: 39, phd: 40 },
    scholarshipAgeNote: 'GKS caps: Bachelor <25, Graduate <40. Korean Embassy Dhaka strictly audits self-funded undergraduate gaps >2 years.',
    evidenceNote: 'Tax-verifiable employment record + apostilled academic transcripts.',
  },
  {
    name: 'Malta',
    flag: '🇲🇹',
    href: '/study-in-malta-from-bangladesh',
    maxGapSafe: { bachelor: 3, master: 7, phd: 10 },
    maxGapConditional: { bachelor: 4, master: 10, phd: 14 },
    maxAgeLimit: { bachelor: 30, master: 42, phd: 48 },
    scholarshipAgeNote: 'Identità CVU conducts video interviews to verify career alignment for mature applicants.',
    evidenceNote: 'Employment experience letters + 6-month salary/tax trail.',
  },
  {
    name: 'Republic of Cyprus (EU)',
    flag: '🇨🇾',
    href: '/study-in-cyprus-from-bangladesh',
    maxGapSafe: { bachelor: 3, master: 6, phd: 10 },
    maxGapConditional: { bachelor: 4, master: 8, phd: 12 },
    maxAgeLimit: { bachelor: 28, master: 38, phd: 45 },
    scholarshipAgeNote: 'CYQAA-accredited EU universities accept 3–6 yr gaps when backed by MOFA-attested documents.',
    evidenceNote: 'MOFA-attested transcripts + continuous employment/study timeline.',
  },
  {
    name: 'Georgia',
    flag: '🇬🇪',
    href: '/study-in-georgia-from-bangladesh',
    maxGapSafe: { bachelor: 4, master: 8, phd: 12 },
    maxGapConditional: { bachelor: 6, master: 10, phd: 15 },
    maxAgeLimit: { bachelor: 32, master: 42, phd: 48 },
    scholarshipAgeNote: 'Note: For MBBS/MD returning to Bangladesh, BMDC restricts HSC passing gap to ≤1–2 years.',
    evidenceNote: 'NCEQE EQE recognition + video interview readiness.',
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    href: '/study-in-greece-from-bangladesh',
    maxGapSafe: { bachelor: 2, master: 6, phd: 10 },
    maxGapConditional: { bachelor: 3, master: 8, phd: 12 },
    maxAgeLimit: { bachelor: 27, master: 38, phd: 45 },
    scholarshipAgeNote: 'HAHE-accredited public Master’s programs welcome working professionals with 3–7 years experience.',
    evidenceNote: 'e-Apostille transcripts + work certificate for Type D visa.',
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    href: '/study-in-croatia-from-bangladesh',
    maxGapSafe: { bachelor: 2, master: 6, phd: 10 },
    maxGapConditional: { bachelor: 4, master: 8, phd: 12 },
    maxAgeLimit: { bachelor: 28, master: 38, phd: 45 },
    scholarshipAgeNote: 'MUP Temporary Stay for Studies requires clear academic progression for AZVO-accredited degrees.',
    evidenceNote: 'e-Apostille PCC + verifiable work/study chronology.',
  },
  {
    name: 'Thailand',
    flag: '🇹🇭',
    href: '/study-in-thailand-from-bangladesh',
    maxGapSafe: { bachelor: 4, master: 9, phd: 15 },
    maxGapConditional: { bachelor: 6, master: 12, phd: 18 },
    maxAgeLimit: { bachelor: 32, master: 45, phd: 50 },
    scholarshipAgeNote: 'AIT, Chulalongkorn & Mahidol actively recruit mid-career Bangladeshi professionals for Master’s/PhD fellowships.',
    evidenceNote: 'Employer reference letter + Royal Thai Embassy Dhaka e-Visa checklist.',
  },
];

export default function StudyGapEligibilityMatcher() {
  const [level, setLevel] = useState<DegreeLevel>('bachelor');
  const [gapYears, setGapYears] = useState<number>(2);
  const [age, setAge] = useState<number>(21);
  const [proof, setProof] = useState<ProofQuality>('academic_session_jam');

  const handleLevelChange = (nextLevel: DegreeLevel) => {
    setLevel(nextLevel);
    if (nextLevel === 'bachelor') {
      setAge(21);
      setGapYears(2);
    } else if (nextLevel === 'master') {
      setAge(26);
      setGapYears(3);
    } else {
      setAge(30);
      setGapYears(4);
    }
  };

  const evaluateCountry = (c: CountryRule) => {
    const overAge = age > c.maxAgeLimit[level];
    const effectiveGap =
      proof === 'academic_session_jam' ? Math.max(0, gapYears - 1) : gapYears;

    if (overAge || effectiveGap > c.maxGapConditional[level]) {
      return 'high_risk' as const;
    }
    if (
      effectiveGap <= c.maxGapSafe[level] &&
      (gapYears <= 2 || proof !== 'informal_none')
    ) {
      return 'high_fit' as const;
    }
    return 'conditional' as const;
  };

  const highFit = COUNTRY_GAP_RULES.filter((c) => evaluateCountry(c) === 'high_fit');
  const conditional = COUNTRY_GAP_RULES.filter((c) => evaluateCountry(c) === 'conditional');
  const highRisk = COUNTRY_GAP_RULES.filter((c) => evaluateCountry(c) === 'high_risk');

  return (
    <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lime text-petrol-800">
            <Clock size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Interactive 12-Country Profile Matcher
            </span>
            <h3 className="text-xl font-bold text-petrol-800">
              Study Gap &amp; Age Limit Destination Matcher (2027)
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-canvas-soft px-3.5 py-1.5 text-xs font-bold text-petrol-800">
          {highFit.length} High-Fit · {conditional.length} Conditional Routes
        </span>
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-petrol-800">
            1. Target Degree Level
          </span>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {(
              [
                ['bachelor', 'Bachelor'],
                ['master', 'Master’s'],
                ['phd', 'PhD'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleLevelChange(id)}
                className={`rounded-xl border px-2.5 py-2.5 text-xs font-bold transition ${
                  level === id
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
            <label htmlFor="gap-years-slider">2. Study Gap Since Last Degree</label>
            <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold text-emerald-800">
              {gapYears} {gapYears === 1 ? 'Year' : 'Years'}
            </span>
          </div>
          <input
            id="gap-years-slider"
            type="range"
            min={0}
            max={12}
            step={1}
            value={gapYears}
            onChange={(e) => setGapYears(Number(e.target.value))}
            className="mt-3 w-full accent-petrol-800"
          />
          <span className="mt-1 block text-[11px] text-slate-500">0 to 12+ years</span>
        </div>

        <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
            <label htmlFor="applicant-age-slider">3. Your Current Age</label>
            <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold text-emerald-800">
              {age} yrs
            </span>
          </div>
          <input
            id="applicant-age-slider"
            type="range"
            min={17}
            max={45}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="mt-3 w-full accent-petrol-800"
          />
          <span className="mt-1 block text-[11px] text-slate-500">Checks CSC / GKS age caps</span>
        </div>

        <div>
          <label
            htmlFor="gap-proof-select"
            className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
          >
            4. Verifiable Gap Evidence
          </label>
          <select
            id="gap-proof-select"
            value={proof}
            onChange={(e) => setProof(e.target.value as ProofQuality)}
            className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-3.5 py-3 text-xs font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
          >
            <option value="strong_work_tax">
              Official Job NOC + Bank Salary / TIN
            </option>
            <option value="academic_session_jam">
              Session Jam / Diploma / Admission Prep
            </option>
            <option value="informal_none">
              No Formal Bank-Backed Proof Yet
            </option>
          </select>
        </div>
      </div>

      {/* Results Columns */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {/* Column 1: High Fit */}
        <div className="rounded-2xl border border-emerald-700/20 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <CheckCircle2 size={16} className="text-emerald-700" /> High-Fit Destinations
            </span>
            <span className="rounded-full bg-emerald-200/70 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
              {highFit.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Your {gapYears}-year gap and age ({age}) fall within standard admission &amp; visa limits.
          </p>
          <ul className="mt-4 space-y-2.5">
            {highFit.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-emerald-700/15 bg-white p-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={c.href}
                    className="text-xs font-bold text-petrol-800 hover:underline"
                  >
                    {c.flag} {c.name}
                  </Link>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    Up to {c.maxGapSafe[level]}y safe
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">{c.evidenceNote}</p>
              </li>
            ))}
            {highFit.length === 0 && (
              <li className="rounded-xl bg-white p-3 text-xs text-slate-600">
                With a {gapYears}-year gap at age {age}, see Conditional routes or switch to a Postgraduate / verifiable employment track.
              </li>
            )}
          </ul>
        </div>

        {/* Column 2: Conditional */}
        <div className="rounded-2xl border border-amber-600/25 bg-amber-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950">
              <AlertTriangle size={16} className="text-amber-700" /> Conditional / Audit Needed
            </span>
            <span className="rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-bold text-amber-950">
              {conditional.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Requires a written Study Plan + verifiable bank/tax employment or session-jam proof.
          </p>
          <ul className="mt-4 space-y-2.5">
            {conditional.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-amber-600/15 bg-white p-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={c.href}
                    className="text-xs font-bold text-petrol-800 hover:underline"
                  >
                    {c.flag} {c.name}
                  </Link>
                  <span className="text-[11px] font-semibold text-amber-800">
                    Max {c.maxGapConditional[level]}y w/ proof
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">
                  {c.scholarshipAgeNote}
                </p>
              </li>
            ))}
            {conditional.length === 0 && (
              <li className="rounded-xl bg-white p-3 text-xs text-slate-600">
                No destinations currently fall in the conditional band for this profile.
              </li>
            )}
          </ul>
        </div>

        {/* Column 3: High Risk / Age-Capped */}
        <div className="rounded-2xl border border-rose-600/20 bg-rose-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-950">
              <ShieldAlert size={16} className="text-rose-700" /> High Visa Risk / Age-Capped
            </span>
            <span className="rounded-full bg-rose-200/70 px-2.5 py-0.5 text-xs font-bold text-rose-950">
              {highRisk.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            High refusal probability for {level} level at age {age} / {gapYears}y gap.
          </p>
          <ul className="mt-4 space-y-2.5">
            {highRisk.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-rose-600/15 bg-white p-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-petrol-800">
                    {c.flag} {c.name}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700">
                    Cap: {c.maxAgeLimit[level]}y / {c.maxGapConditional[level]}y gap
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">
                  {c.scholarshipAgeNote}
                </p>
              </li>
            ))}
            {highRisk.length === 0 && (
              <li className="rounded-xl bg-white p-3 text-xs text-emerald-800 font-semibold">
                ✓ None! Your age ({age}) and gap ({gapYears}y) do not trigger hard age/gap exclusions.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom Warning & CTA */}
      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-petrol-800 p-5 text-white sm:flex-row sm:items-center">
        <div className="text-xs leading-5 text-white/90">
          <strong className="text-lime">Zero-Deception Audit Policy:</strong> Never submit backdated cash-salary job letters without bank/tax trails. Our Dhanmondi desk audits your real chronology for <strong>BDT 0 file-opening charge</strong>.
        </div>
        <Link
          href="/education-fit-assessment"
          className="ed-btn ed-btn-signal min-h-[44px] shrink-0 px-5 text-xs font-bold"
        >
          Get Written Study Gap Audit <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

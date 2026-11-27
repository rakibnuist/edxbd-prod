'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

type TargetDegree = 'bachelor' | 'master';
type EnglishProofType = 'moi_only' | 'duolingo_pte' | 'hsc_olevel_english' | 'no_certificate';

type CountryMoiRule = {
  name: string;
  flag: string;
  href: string;
  evalStatus: (degree: TargetDegree, proof: EnglishProofType) => 'safe' | 'conditional' | 'strict';
  universityRule: string;
  embassyVisaRule: string;
  substituteRequired: string;
};

const MOI_RULES: CountryMoiRule[] = [
  {
    name: 'China (Flagship)',
    flag: '🇨🇳',
    href: '/study-in-china-without-ielts',
    evalStatus: () => 'safe',
    universityRule: 'Accepts English MOI Certificate + live video interview, Duolingo, or 1-Yr Chinese HSK Foundation.',
    embassyVisaRule: 'Chinese Visa Application Center in Dhaka officially accepts JW202/DQ issued on MOI or Chinese-medium basis.',
    substituteRequired: 'Official MOI Letter + University Skype/Voov Interview (or Chinese Foundation Year).',
  },
  {
    name: 'Malaysia (BDT 0 Fee)',
    flag: '🇲🇾',
    href: '/study-in-malaysia-from-bangladesh',
    evalStatus: (_deg, proof) => (proof === 'no_certificate' ? 'conditional' : 'safe'),
    universityRule: 'Private & dual-award universities accept English MOI or offer internal English Placement / IEP classes.',
    embassyVisaRule: 'EMGS eVAL and Malaysian High Commission Dhaka accept unconditional offer or conditional IEP offer.',
    substituteRequired: 'MOI Certificate, Duolingo/PTE, or on-campus Intensive English Programme (IEP).',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    href: '/uk-student-visa-bangladesh',
    evalStatus: (deg, proof) => {
      if (proof === 'duolingo_pte') return 'safe';
      if (deg === 'master' && proof === 'moi_only') return 'conditional';
      if (deg === 'bachelor' && proof === 'hsc_olevel_english') return 'conditional';
      return 'strict';
    },
    universityRule: 'Select UK universities accept MOI from UGC-approved BD universities (graduated ≤2–5 yrs) or O/A-Level English C/B.',
    embassyVisaRule: 'UKVI accepts no-IELTS ONLY if a licensed HEP university explicitly certifies CEFR B2 assessment on your CAS.',
    substituteRequired: 'Approved BD University MOI + Internal Password/ELLT Test + Mandatory Pre-CAS Interview (or PTE/IELTS).',
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    href: '/hungary-student-visa-bangladesh',
    evalStatus: (_deg, proof) => (proof === 'no_certificate' ? 'conditional' : 'safe'),
    universityRule: 'Self-funded public universities (Debrecen, Pécs, Szeged) test your English directly in a live Zoom faculty exam.',
    embassyVisaRule: 'Embassy/VFS Dhaka conducts a live spoken English academic & financial credibility interview.',
    substituteRequired: 'MOI + Passing University Live Oral Entrance Exam (Note: SHED Stipendium Hungaricum requires IELTS/TOEFL).',
  },
  {
    name: 'Finland',
    flag: '🇫🇮',
    href: '/finland-student-visa-bangladesh',
    evalStatus: (deg, proof) => {
      if (proof === 'duolingo_pte') return 'safe';
      if (deg === 'bachelor') return 'conditional';
      return 'strict';
    },
    universityRule: 'UAS Bachelor programs waive IELTS if you pass the written & spoken International UAS Entrance Exam on Studyinfo.fi.',
    embassyVisaRule: 'Migri accepts admission earned via the official International UAS Exam; Master’s requires IELTS 6.5 / PTE 62.',
    substituteRequired: 'Bachelor: International UAS Digital Entrance Exam · Master’s: Official IELTS / PTE / TOEFL.',
  },
  {
    name: 'Georgia',
    flag: '🇬🇪',
    href: '/georgia-student-visa-bangladesh',
    evalStatus: () => 'safe',
    universityRule: 'Tbilisi medical (MD) & engineering faculties assess English via a recorded Zoom video interview.',
    embassyVisaRule: 'D3 Study Visa accepts NCEQE Ministry Recognition Order issued after the recorded Zoom English interview.',
    substituteRequired: 'Recorded University Zoom English Interview + High School / Bachelor Transcript.',
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    href: '/south-korea-student-visa-bangladesh',
    evalStatus: (deg, proof) => {
      if (proof === 'duolingo_pte') return 'conditional';
      if (deg === 'master' && proof === 'moi_only') return 'conditional';
      return 'strict';
    },
    universityRule: 'Some Korean graduate STEM labs accept MOI for initial admission, or D-4 Korean Language Year requires no IELTS.',
    embassyVisaRule: 'Korean Embassy Dhaka strongly enforces IELTS 5.5–6.0+ or TOPIK 3+ for D-2 degree visa approval.',
    substituteRequired: 'IELTS 5.5–6.5 or TOPIK for D-2 Degree Visa (MOI alone faces high visa refusal risk in Dhaka).',
  },
  {
    name: 'Republic of Cyprus (EU)',
    flag: '🇨🇾',
    href: '/cyprus-student-visa-bangladesh',
    evalStatus: (_deg, proof) =>
      proof === 'duolingo_pte' || proof === 'moi_only' ? 'conditional' : 'strict',
    universityRule: 'CYQAA universities conduct internal placement tests alongside IELTS 5.0–5.5 / PTE.',
    embassyVisaRule: 'CRMD Blue Slip entry permit strongly prefers IELTS 5.5+ or PTE Academic for Bangladeshi nationals.',
    substituteRequired: 'IELTS 5.5 / PTE 50+ strongly recommended for smooth CRMD Blue Slip clearance.',
  },
  {
    name: 'Malta',
    flag: '🇲🇹',
    href: '/malta-student-visa-bangladesh',
    evalStatus: (_deg, proof) =>
      proof === 'duolingo_pte' || proof === 'moi_only' ? 'conditional' : 'strict',
    universityRule: 'Several MFHEA private colleges & GBS Malta accept MOI or Duolingo/PTE for offer letters.',
    embassyVisaRule: 'Identità Central Visa Unit conducts strict video interviews; weak spoken English causes immediate refusal.',
    substituteRequired: 'MOI + Fluent Spoken Video Interview (or PTE / IELTS 5.5–6.0).',
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    href: '/greece-student-visa-bangladesh',
    evalStatus: (_deg, proof) => (proof === 'moi_only' || proof === 'duolingo_pte' ? 'conditional' : 'strict'),
    universityRule: 'HAHE public Master’s programs accept official CEFR B2 certificates, PTE, TOEFL, or verified English-medium Bachelor MOI.',
    embassyVisaRule: 'Embassy of Greece verifies B2 English competency during Type D National Visa review.',
    substituteRequired: 'Verified English-Medium Bachelor MOI (for Master’s) or IELTS 6.0 / PTE / TOEFL B2.',
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    href: '/croatia-student-visa-bangladesh',
    evalStatus: (_deg, proof) => (proof === 'moi_only' || proof === 'duolingo_pte' ? 'conditional' : 'strict'),
    universityRule: 'AZVO-accredited universities verify English via MOI + online faculty interview or B2 test.',
    embassyVisaRule: 'MUP Temporary Stay for Studies requires confirmed university enrollment and clean interview credibility.',
    substituteRequired: 'MOI + Online Faculty Interview (or IELTS 5.5–6.0 / PTE).',
  },
  {
    name: 'Thailand',
    flag: '🇹🇭',
    href: '/thailand-student-visa-bangladesh',
    evalStatus: (_deg, proof) => (proof === 'no_certificate' ? 'conditional' : 'safe'),
    universityRule: 'AIT, Mahidol, Chulalongkorn & Assumption accept MOI, internal English tests (AIT-EET), Duolingo, or PTE.',
    embassyVisaRule: 'Royal Thai Embassy Dhaka issues Non-Immigrant ED Visa based on official MHESI university acceptance.',
    substituteRequired: 'MOI Certificate, University Internal English Exam (e.g., AIT-EET), or Duolingo/PTE.',
  },
];

export default function MoiVisaMatcher() {
  const [degree, setDegree] = useState<TargetDegree>('bachelor');
  const [proof, setProof] = useState<EnglishProofType>('moi_only');

  const safeCountries = MOI_RULES.filter((c) => c.evalStatus(degree, proof) === 'safe');
  const conditionalCountries = MOI_RULES.filter(
    (c) => c.evalStatus(degree, proof) === 'conditional'
  );
  const strictCountries = MOI_RULES.filter((c) => c.evalStatus(degree, proof) === 'strict');

  return (
    <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lime text-petrol-800">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Interactive 12-Country Language Audit
            </span>
            <h3 className="text-xl font-bold text-petrol-800">
              Without-IELTS / MOI University vs. Embassy Visa Matcher
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-canvas-soft px-3.5 py-1.5 text-xs font-bold text-petrol-800">
          {safeCountries.length} Visa-Safe · {conditionalCountries.length} Interview-Dependent
        </span>
      </div>

      {/* Controls */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-petrol-800">
            1. Select Target Degree Level
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDegree('bachelor')}
              className={`rounded-xl border px-3.5 py-3 text-left text-xs font-bold transition ${
                degree === 'bachelor'
                  ? 'border-petrol-800 bg-petrol-800 text-white'
                  : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
              }`}
            >
              Bachelor’s / MBBS / Diploma (After HSC or O/A-Level)
            </button>
            <button
              type="button"
              onClick={() => setDegree('master')}
              className={`rounded-xl border px-3.5 py-3 text-left text-xs font-bold transition ${
                degree === 'master'
                  ? 'border-petrol-800 bg-petrol-800 text-white'
                  : 'border-petrol-800/15 bg-canvas-soft text-petrol-800 hover:bg-lime-pale'
              }`}
            >
              Master’s / MBA / PhD (After 4-Yr BD Bachelor’s)
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="moi-proof-select"
            className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
          >
            2. Your Current English Proof (Without IELTS)
          </label>
          <select
            id="moi-proof-select"
            value={proof}
            onChange={(e) => setProof(e.target.value as EnglishProofType)}
            className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3.5 text-xs font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
          >
            <option value="moi_only">
              Official Medium of Instruction (MOI) Certificate from BD Institution
            </option>
            <option value="duolingo_pte">
              PTE Academic / Duolingo (DET) / Oxford ELLT Score
            </option>
            <option value="hsc_olevel_english">
              O/A-Level English (Grade A–C) or HSC English ≥ 75%
            </option>
            <option value="no_certificate">
              Bangla Medium HSC (Need University Exam or Language Foundation Year)
            </option>
          </select>
        </div>
      </div>

      {/* Output Grid */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        {/* Safe */}
        <div className="rounded-2xl border border-emerald-700/20 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <CheckCircle2 size={16} className="text-emerald-700" /> Both Uni &amp; Visa Safe
            </span>
            <span className="rounded-full bg-emerald-200/70 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
              {safeCountries.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Accepts your profile at BOTH the university offer stage and the embassy visa stage.
          </p>
          <ul className="mt-4 space-y-2.5">
            {safeCountries.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-emerald-700/15 bg-white p-3 shadow-2xs"
              >
                <Link href={c.href} className="text-xs font-bold text-petrol-800 hover:underline">
                  {c.flag} {c.name}
                </Link>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">
                  <strong>Substitute:</strong> {c.substituteRequired}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditional */}
        <div className="rounded-2xl border border-amber-600/25 bg-amber-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950">
              <AlertTriangle size={16} className="text-amber-700" /> Exam / Interview Required
            </span>
            <span className="rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-bold text-amber-950">
              {conditionalCountries.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Requires passing an online university entrance test or fluent consular spoken interview.
          </p>
          <ul className="mt-4 space-y-2.5">
            {conditionalCountries.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-amber-600/15 bg-white p-3 shadow-2xs"
              >
                <Link href={c.href} className="text-xs font-bold text-petrol-800 hover:underline">
                  {c.flag} {c.name}
                </Link>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">
                  <strong>Visa Rule:</strong> {c.embassyVisaRule}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Strict */}
        <div className="rounded-2xl border border-rose-600/20 bg-rose-50/40 p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-950">
              <ShieldAlert size={16} className="text-rose-700" /> IELTS / PTE Recommended
            </span>
            <span className="rounded-full bg-rose-200/70 px-2.5 py-0.5 text-xs font-bold text-rose-950">
              {strictCountries.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Applying with MOI alone carries high visa refusal risk for this level; take IELTS or PTE.
          </p>
          <ul className="mt-4 space-y-2.5">
            {strictCountries.map((c) => (
              <li
                key={c.name}
                className="rounded-xl border border-rose-600/15 bg-white p-3 shadow-2xs"
              >
                <Link href={c.href} className="text-xs font-bold text-petrol-800 hover:underline">
                  {c.flag} {c.name}
                </Link>
                <p className="mt-1 text-[11px] leading-4 text-slate-600">
                  <strong>Why:</strong> {c.embassyVisaRule}
                </p>
              </li>
            ))}
            {strictCountries.length === 0 && (
              <li className="rounded-xl bg-white p-3 text-xs font-semibold text-emerald-800">
                ✓ With PTE/Duolingo, nearly all 12 destinations have accessible pathways!
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl bg-petrol-800 p-5 text-white sm:flex-row sm:items-center">
        <div className="text-xs leading-5 text-white/90">
          <strong className="text-lime">Free MOI &amp; Spoken English Check:</strong> Bring your Bangladeshi university or school transcript to our Dhanmondi desk. We verify whether your MOI is accepted on the UKVI/EMGS/China list for <strong>BDT 0 file-opening charge</strong>.
        </div>
        <Link
          href="/education-fit-assessment"
          className="ed-btn ed-btn-signal min-h-[44px] shrink-0 px-5 text-xs font-bold"
        >
          Verify My MOI Eligibility <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

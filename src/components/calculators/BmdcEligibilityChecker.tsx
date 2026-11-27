'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export default function BmdcEligibilityChecker() {
  const [sscGpa, setSscGpa] = useState<number>(4.8);
  const [hscGpa, setHscGpa] = useState<number>(4.5);
  const [biologyGpa, setBiologyGpa] = useState<number>(4.0);
  const [hscYear, setHscYear] = useState<'2026' | '2025' | '2024' | '2023_or_older'>('2026');
  const [ageGroup, setAgeGroup] = useState<'17_25' | 'under_17' | 'over_25'>('17_25');

  const combinedGpa = Number((sscGpa + hscGpa).toFixed(2));
  const meetsCombinedGpa = combinedGpa >= 7.0;
  const meetsIndividualGpa = sscGpa >= 3.0 && hscGpa >= 3.0;
  const meetsBiologyGpa = biologyGpa >= 3.5;
  const meetsYearStrict = hscYear === '2026' || hscYear === '2025';
  const isBorderlineYear = hscYear === '2024';
  const meetsChinaMbbsAge = ageGroup === '17_25';

  const isFullyEligible =
    meetsCombinedGpa && meetsIndividualGpa && meetsBiologyGpa && meetsYearStrict;
  const isConditional =
    meetsCombinedGpa && meetsIndividualGpa && meetsBiologyGpa && isBorderlineYear;

  return (
    <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lime text-petrol-800">
            <Stethoscope size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Interactive Statutory Pre-Check · BMDC Act 2010
            </span>
            <h3 className="text-xl font-bold text-petrol-800">
              BMDC Foreign Medical Eligibility &amp; China 45 MOE Checker
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
          2026 / 2027 Medical Intake Rules
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* Left Inputs */}
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
              <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
                <label htmlFor="bmdc-ssc-gpa">SSC / O-Level GPA</label>
                <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold text-emerald-800">
                  {sscGpa.toFixed(2)}
                </span>
              </div>
              <input
                id="bmdc-ssc-gpa"
                type="range"
                min={2.5}
                max={5.0}
                step={0.05}
                value={sscGpa}
                onChange={(e) => setSscGpa(Number(e.target.value))}
                className="mt-3 w-full accent-petrol-800"
              />
              <span className="mt-1 block text-[11px] text-slate-500">Min required: 3.00</span>
            </div>

            <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
              <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
                <label htmlFor="bmdc-hsc-gpa">HSC / A-Level GPA</label>
                <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold text-emerald-800">
                  {hscGpa.toFixed(2)}
                </span>
              </div>
              <input
                id="bmdc-hsc-gpa"
                type="range"
                min={2.5}
                max={5.0}
                step={0.05}
                value={hscGpa}
                onChange={(e) => setHscGpa(Number(e.target.value))}
                className="mt-3 w-full accent-petrol-800"
              />
              <span className="mt-1 block text-[11px] text-slate-500">Min required: 3.00</span>
            </div>

            <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
              <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
                <label htmlFor="bmdc-bio-gpa">HSC Biology GPA</label>
                <span className="rounded bg-white px-2 py-0.5 text-sm font-extrabold text-emerald-800">
                  {biologyGpa.toFixed(2)}
                </span>
              </div>
              <input
                id="bmdc-bio-gpa"
                type="range"
                min={2.0}
                max={5.0}
                step={0.1}
                value={biologyGpa}
                onChange={(e) => setBiologyGpa(Number(e.target.value))}
                className="mt-3 w-full accent-petrol-800"
              />
              <span className="mt-1 block text-[11px] text-slate-500">Statutory min: 3.50</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="bmdc-hsc-year"
                className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
              >
                HSC / A-Level Passing Year
              </label>
              <select
                id="bmdc-hsc-year"
                value={hscYear}
                onChange={(e) =>
                  setHscYear(e.target.value as '2026' | '2025' | '2024' | '2023_or_older')
                }
                className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3 text-sm font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
              >
                <option value="2026">2026 (Current Batch)</option>
                <option value="2025">2025 (Immediate Preceding Year)</option>
                <option value="2024">2024 (2-Year Gap — Verify Gazette Cutoff)</option>
                <option value="2023_or_older">2023 or Earlier (3+ Year Study Gap)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bmdc-age-group"
                className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
              >
                Applicant Age at Enrollment
              </label>
              <select
                id="bmdc-age-group"
                value={ageGroup}
                onChange={(e) =>
                  setAgeGroup(e.target.value as '17_25' | 'under_17' | 'over_25')
                }
                className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3 text-sm font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
              >
                <option value="17_25">17 to 25 Years Old (Standard MBBS Range)</option>
                <option value="under_17">Under 17 (Guardian Affidavit Required)</option>
                <option value="over_25">Over 25 Years Old</option>
              </select>
            </div>
          </div>

          {/* Checklist of 4 Statutory Gates */}
          <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-petrol-800">
              BMDC Pre-Departure Gate Breakdown
            </span>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Combined SSC + HSC GPA (Min 7.00):</span>
                <span
                  className={`font-bold ${
                    meetsCombinedGpa ? 'text-emerald-800' : 'text-rose-700'
                  }`}
                >
                  {combinedGpa.toFixed(2)} / 10.00 {meetsCombinedGpa ? '✓ Pass' : '✕ Below 7.00'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">Individual SSC &amp; HSC GPA (Min 3.00 each):</span>
                <span
                  className={`font-bold ${
                    meetsIndividualGpa ? 'text-emerald-800' : 'text-rose-700'
                  }`}
                >
                  {meetsIndividualGpa ? '✓ Pass' : '✕ Below 3.00'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">HSC Biology Grade Point (Min 3.50):</span>
                <span
                  className={`font-bold ${
                    meetsBiologyGpa ? 'text-emerald-800' : 'text-rose-700'
                  }`}
                >
                  GP {biologyGpa.toFixed(2)} {meetsBiologyGpa ? '✓ Pass' : '✕ Below 3.50'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-700">HSC Passing Year Window:</span>
                <span
                  className={`font-bold ${
                    meetsYearStrict
                      ? 'text-emerald-800'
                      : isBorderlineYear
                        ? 'text-amber-700'
                        : 'text-rose-700'
                  }`}
                >
                  {meetsYearStrict
                    ? '✓ Within Active Window'
                    : isBorderlineYear
                      ? '⚠ Verify Current BMDC Circular'
                      : '✕ Exceeds BMDC Gap Limit'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Result Verdict */}
        <div className="flex flex-col justify-between rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime">
              Statutory BMDC &amp; Overseas Medical Verdict
            </span>

            {isFullyEligible ? (
              <div className="mt-3 rounded-2xl bg-emerald-950/80 p-4 ring-1 ring-lime/40">
                <div className="flex items-center gap-2 text-lime">
                  <CheckCircle2 size={20} />
                  <h4 className="font-display text-lg font-bold">
                    Eligible for BMDC Pre-Departure Certificate
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/90">
                  Your Combined GPA ({combinedGpa.toFixed(2)}), Biology GP ({biologyGpa.toFixed(2)}), and HSC passing year ({hscYear}) satisfy the Bangladesh Medical &amp; Dental Council (BMDC) requirements for an official Foreign Medical Study Eligibility Certificate.
                </p>
              </div>
            ) : isConditional ? (
              <div className="mt-3 rounded-2xl bg-amber-950/80 p-4 ring-1 ring-amber-400/50">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle size={20} />
                  <h4 className="font-display text-lg font-bold">
                    GPA Eligible · Verify 2024 HSC Cutoff at BMDC Desk
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/90">
                  Your GPA ({combinedGpa.toFixed(2)}) and Biology GP ({biologyGpa.toFixed(2)}) meet statutory thresholds, but BMDC restricts Eligibility Certificates to the current and immediate preceding HSC passing years. Confirm whether the active BMDC circular covers the 2024 batch before paying any overseas medical deposit.
                </p>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl bg-rose-950/90 p-4 ring-1 ring-rose-400/50">
                <div className="flex items-center gap-2 text-rose-300">
                  <ShieldAlert size={20} />
                  <h4 className="font-display text-lg font-bold">
                    Not Eligible for BMDC Medical Doctor Licensing
                  </h4>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/90">
                  Under BMDC rules, graduating from a foreign MBBS/MD program without meeting the Combined GPA ≥ 7.00, Biology ≥ 3.50, and HSC passing-year window means <strong>you will be barred from sitting the BMDC RQE licensing exam</strong> in Bangladesh. Do NOT pay any agent claiming &ldquo;BMDC can be managed later.&rdquo;
                </p>
              </div>
            )}

            {/* Recommended Pathways Based on Result */}
            <div className="mt-5 space-y-3 text-xs">
              {isFullyEligible || isConditional ? (
                <>
                  <div className="rounded-2xl bg-white/[0.07] p-3.5">
                    <strong className="text-lime">
                      1. China 45 MOE Public Medical Universities:
                    </strong>
                    <p className="mt-1 text-white/85">
                      {meetsChinaMbbsAge
                        ? 'You qualify for the 45 China MOE English-medium MBBS universities (tuition CNY 24,000–48,000/yr ≈ BDT 4.5L–9.0L/yr). EduExpress includes a complimentary CNY 99 CSCA Master Pro exam activation code when you open a verified China file at BDT 0 file-opening charge.'
                        : 'Note: Most Chinese MOE English-medium MBBS programs cap applicant age at 25 (or require a guardian affidavit if under 18). Consider Georgia or Croatia if over 25.'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.07] p-3.5">
                    <strong className="text-lime">
                      2. Georgia (WFME 6-Year MD) &amp; Croatia (EU 6-Year MD):
                    </strong>
                    <p className="mt-1 text-white/85">
                      Both offer WDOMS-listed 6-year English MD degrees (Georgia USD 5,300–8,000/yr; Croatia EUR 12,000/yr) eligible for USMLE, UKMLA/PLAB, and BMDC RQE (provided you obtain your BMDC Eligibility Certificate prior to departure).
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <strong className="text-lime">
                    Safe Alternative Healthcare &amp; STEM Bachelor’s Routes (No BMDC RQE Required):
                  </strong>
                  <p className="mt-1.5 leading-5 text-white/85">
                    Instead of risking an unregistrable MBBS degree, consider accredited 4-year B.Sc. degrees in <strong>Pharmacy, Biotechnology, Biomedical Engineering, Public Health, Nursing, or Medical Laboratory Science</strong> in China or Malaysia — where your current GPA &amp; gap are 100% accepted with generous scholarships.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4">
            <Link
              href="/education-fit-assessment"
              className="ed-btn ed-btn-signal min-h-[44px] px-5 text-xs font-bold"
            >
              {isFullyEligible || isConditional
                ? 'Request Written BMDC & 45 MOE Medical Shortlist'
                : 'Explore Safe Pharmacy, Biotech & STEM Alternatives'}{' '}
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/mbbs-in-china-bangladesh"
              className="ed-btn ed-btn-on-dark min-h-[44px] px-4 text-xs"
            >
              MBBS in China Guide
            </Link>
            <Link
              href="/bangladesh-vs-china-mbbs"
              className="ed-btn ed-btn-on-dark min-h-[44px] px-4 text-xs"
            >
              BD Private vs China MBBS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

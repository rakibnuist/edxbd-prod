'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calculator,
  CalendarClock,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  UserCheck,
  Wallet,
} from 'lucide-react';

type CountryConfig = {
  id: string;
  name: string;
  flag: string;
  currency: string;
  rateToBdt: number;
  defaultUnpaidTuition: number;
  maxTuitionSlider: number;
  tuitionStep: number;
  includesUnpaidTuitionInBankBalance: boolean;
  livingRequirementForeign: number;
  livingRequirementLabel: string;
  scholarshipWaivesSolvency: boolean;
  scholarshipName: string;
  accountOwnershipRule: string;
  holdingPeriodRule: string;
  bankConstraint: string;
  studentFileNote: string;
  eduExpressFeeRule: string;
  visaGuideHref: string;
  costGuideHref: string;
};

const COUNTRIES: CountryConfig[] = [
  {
    id: 'china',
    name: 'China (X1 / X2 Student Visa)',
    flag: '🇨🇳',
    currency: 'USD',
    rateToBdt: 122,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 6000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: true,
    livingRequirementForeign: 3000,
    livingRequirementLabel: 'USD 2,500 – 3,500 baseline (+ uncovered Year-1 fees)',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'Full CSC Type A / Type B or Full Provincial Scholarship',
    accountOwnershipRule: 'Student, Mother, Father, or verified blood-relative sponsor (with notarized Affidavit of Support).',
    holdingPeriodRule: '3 to 6 months active bank statement showing stable balance covering Year-1 uncovered costs.',
    bankConstraint: 'Any scheduled commercial bank regulated by Bangladesh Bank (English statement + solvency certificate).',
    studentFileNote: 'No pre-visa tuition wire required for most Chinese universities; tuition is typically paid after registration or via bank draft.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 200,000 full package payable 100% AFTER China visa approval.',
    visaGuideHref: '/china-student-visa-bangladesh',
    costGuideHref: '/study-in-china-cost-bangladesh',
  },
  {
    id: 'malaysia',
    name: 'Malaysia (EMGS eVAL & SEV)',
    flag: '🇲🇾',
    currency: 'MYR',
    rateToBdt: 27,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 30000,
    tuitionStep: 1000,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 20000,
    livingRequirementLabel: 'MYR 15,000 – 25,000 recommended closing balance for SEV',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'MTCP / MIS or Private Merit Waiver (10%–75%)',
    accountOwnershipRule: 'Student or Legal Parents (Mother / Father).',
    holdingPeriodRule: '3 to 6 months active bank statement required during Single Entry Visa (SEV) filing in Dhaka.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh with Authorized Dealer (AD) branch for Student File.',
    studentFileNote: 'Bangladesh Bank Student File required after EMGS eVAL to wire semester tuition directly to the Malaysian university.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 0 EduExpress service fee (100% Free Consultancy for Malaysia).',
    visaGuideHref: '/malaysia-student-visa-bangladesh',
    costGuideHref: '/malaysia-study-cost-bangladesh',
  },
  {
    id: 'uk-outside',
    name: 'UK — Outside London (Student Route)',
    flag: '🇬🇧',
    currency: 'GBP',
    rateToBdt: 155,
    defaultUnpaidTuition: 11000,
    maxTuitionSlider: 25000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: true,
    livingRequirementForeign: 10224,
    livingRequirementLabel: '£10,224 statutory living maintenance (£1,136/mo × 9 months)',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'Full Chevening / Commonwealth Award',
    accountOwnershipRule: 'Strictly Student or Legal Parents (Mother/Father) ONLY. Uncles, aunts, siblings, or company accounts are rejected by UKVI.',
    holdingPeriodRule: '28 consecutive days untouched (balance must never drop below the required sum for even 1 day); statement dated within 31 days of application.',
    bankConstraint: 'UKVI-verifiable Bangladesh Bank scheduled commercial bank (e.g., Standard Chartered, HSBC, EBL, City Bank, BRAC Bank, MTB, Prime Bank).',
    studentFileNote: 'CAS deposit (£2,000–£5,000) is wired first via AD Bank Student File; remaining unpaid Year-1 tuition + £10,224 must sit in the bank for 28 days.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 0 EduExpress service fee (100% Free Consultancy for the UK).',
    visaGuideHref: '/uk-student-visa-bangladesh',
    costGuideHref: '/uk-study-cost-bangladesh',
  },
  {
    id: 'uk-london',
    name: 'UK — Inside Greater London (Student Route)',
    flag: '🇬🇧',
    currency: 'GBP',
    rateToBdt: 155,
    defaultUnpaidTuition: 13000,
    maxTuitionSlider: 30000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: true,
    livingRequirementForeign: 13347,
    livingRequirementLabel: '£13,347 statutory living maintenance (£1,483/mo × 9 months)',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'Full Chevening / Commonwealth Award',
    accountOwnershipRule: 'Strictly Student or Legal Parents (Mother/Father) ONLY. Third-party or sibling accounts are automatically refused.',
    holdingPeriodRule: '28 consecutive days untouched; closing date within 31 days of GOV.UK online visa submission.',
    bankConstraint: 'UKVI-verifiable commercial bank in Bangladesh with central email/SWIFT verification.',
    studentFileNote: 'CAS deposit wired via AD Bank Student File lowers your unpaid Year-1 tuition balance pound-for-pound on the CAS statement.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 0 EduExpress service fee (100% Free Consultancy for the UK).',
    visaGuideHref: '/uk-student-visa-bangladesh',
    costGuideHref: '/uk-study-cost-bangladesh',
  },
  {
    id: 'finland',
    name: 'Finland (Migri Type A Residence Permit)',
    flag: '🇫🇮',
    currency: 'EUR',
    rateToBdt: 130,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 15000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: true,
    livingRequirementForeign: 9600,
    livingRequirementLabel: 'EUR 9,600 statutory living fund (EUR 800/mo × 12 months)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'Finland Scholarship (100% Tuition + €5,000 Relocation)',
    accountOwnershipRule: 'SOLE Personal Bank Account of the Student ONLY. Parent accounts or shared accounts without transfer into the student’s own account are rejected by Migri.',
    holdingPeriodRule: 'Funds must be transferred into the student’s personal account via traceable bank transfer (no sudden unexplained cash drops) + 6-month parent tax/income trail.',
    bankConstraint: 'Scheduled commercial bank with online banking screenshot + official bank statement in the student’s name.',
    studentFileNote: 'First-year tuition (after early-bird waiver) is typically wired via AD Bank Student File prior to Enter Finland visa submission.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Finland residence permit approval.',
    visaGuideHref: '/finland-student-visa-bangladesh',
    costGuideHref: '/finland-study-cost-bangladesh',
  },
  {
    id: 'hungary',
    name: 'Hungary (Schengen Type D Study Visa)',
    flag: '🇭🇺',
    currency: 'EUR',
    rateToBdt: 130,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 10000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 7500,
    livingRequirementLabel: 'EUR 6,500 – 8,000 liquid living solvency (+ paid tuition receipt)',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'Stipendium Hungaricum Government Scholarship',
    accountOwnershipRule: 'Student or Legal Parents (with notarized Affidavit of Financial Support, trade license/job NOC, and NBR tax return).',
    holdingPeriodRule: '6 months active transaction statement demonstrating regular income inflows.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh + SWIFT MT103 proof of paid 1st-year/semester tuition.',
    studentFileNote: 'Self-funded students open a Bangladesh Bank Student File to remit 1st-year/semester tuition in EUR before the VFS Global Dhaka appointment.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Hungary visa approval.',
    visaGuideHref: '/hungary-student-visa-bangladesh',
    costGuideHref: '/hungary-study-cost-bangladesh',
  },
  {
    id: 'south-korea',
    name: 'South Korea (D-2 Degree Student Visa)',
    flag: '🇰🇷',
    currency: 'USD',
    rateToBdt: 122,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 12000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 20000,
    livingRequirementLabel: 'USD 20,000 (Seoul Metro) / USD 16,000–18,000 (Regional)',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'Global Korea Scholarship (GKS) or 100% Professor Lab Stipend',
    accountOwnershipRule: 'Student or Legal Parents ONLY (backed by Family Relationship Certificate and NBR Income Tax Ack. Receipt).',
    holdingPeriodRule: '30 to 90 days seasoned balance + 6-month bank statement issued within 30 days of submission.',
    bankConstraint: 'Strictly must be held in one of the Korean Embassy Dhaka’s 14 designated commercial banks (e.g., EBL, BRAC, City, SCB, HSBC, Prime, Dhaka Bank).',
    studentFileNote: 'Standard track requires wiring tuition after CoA invoice via AD Bank Student File; IEQAS visa-code track submits financial proof first to university.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · 100% Post-Visa Service Terms.',
    visaGuideHref: '/south-korea-student-visa-bangladesh',
    costGuideHref: '/south-korea-study-cost-bangladesh',
  },
  {
    id: 'malta',
    name: 'Malta (Identità Central Visa Unit)',
    flag: '🇲🇹',
    currency: 'EUR',
    rateToBdt: 132,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 10000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 9000,
    livingRequirementLabel: 'EUR 8,000 – 10,000 living solvency (+ paid tuition receipt)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'University Merit Reduction',
    accountOwnershipRule: 'Student or Legal Parents (with sponsor affidavit, bank verification letter, and tax certificate).',
    holdingPeriodRule: '6 months consistent bank statement meeting 75% national minimum wage daily benchmark.',
    bankConstraint: 'Scheduled commercial bank + official SWIFT MT103 tuition receipt to MFHEA-accredited institution.',
    studentFileNote: 'Tuition wired directly to Malta university IBAN via Bangladesh Bank Student File prior to VFS filing.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Malta visa approval.',
    visaGuideHref: '/malta-student-visa-bangladesh',
    costGuideHref: '/malta-study-cost-bangladesh',
  },
  {
    id: 'cyprus',
    name: 'Republic of Cyprus (EU CRMD Entry Permit)',
    flag: '🇨🇾',
    currency: 'EUR',
    rateToBdt: 132,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 8000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 7500,
    livingRequirementLabel: 'EUR 7,000 – 8,500 bank solvency (+ tuition deposit wire)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'CYQAA University Entrance Bursary (20%–50%)',
    accountOwnershipRule: 'Parents or Student (attested by issuing bank and MOFA Bangladesh / e-Apostille).',
    holdingPeriodRule: '6-month bank statement showing sufficient funds for 1 academic year of living.',
    bankConstraint: 'Authorized Dealer commercial bank in Bangladesh issuing SWIFT MT103 receipt for initial tuition deposit.',
    studentFileNote: 'Open Student File with Blue Slip / Admission offer to wire initial EUR 3,000–4,500 deposit to CYQAA-accredited university.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Cyprus Blue Slip / Visa approval.',
    visaGuideHref: '/cyprus-student-visa-bangladesh',
    costGuideHref: '/cyprus-study-cost-bangladesh',
  },
  {
    id: 'georgia',
    name: 'Georgia (D3 Study Visa & NCEQE)',
    flag: '🇬🇪',
    currency: 'USD',
    rateToBdt: 122,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 8000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 4500,
    livingRequirementLabel: 'USD 3,500 – 5,000 closing balance (+ 1st-semester tuition receipt)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'Academic GPA Tuition Discount',
    accountOwnershipRule: 'Student or Parents (with notarized sponsorship declaration and income proof).',
    holdingPeriodRule: '6-month active bank statement.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh.',
    studentFileNote: 'After Ministry of Education (MES/NCEQE) Recognition Order, wire 1st-semester tuition via AD Bank Student File.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Georgia D3 visa approval.',
    visaGuideHref: '/georgia-student-visa-bangladesh',
    costGuideHref: '/georgia-study-cost-bangladesh',
  },
  {
    id: 'greece',
    name: 'Greece (Schengen Type D National Visa)',
    flag: '🇬🇷',
    currency: 'EUR',
    rateToBdt: 132,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 8000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 6500,
    livingRequirementLabel: 'EUR 6,000 – 7,800 living solvency (EUR 500–650/mo × 12)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'HAHE Public University Low-Tuition Track',
    accountOwnershipRule: 'Student or Legal Parents (backed by e-Apostille attested sponsorship & tax returns).',
    holdingPeriodRule: '6-month bank statement with stable income deposits.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh.',
    studentFileNote: 'First-year tuition wired to HAHE-accredited Greek university via AD Bank Student File.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Greece Type D visa approval.',
    visaGuideHref: '/greece-student-visa-bangladesh',
    costGuideHref: '/greece-study-cost-bangladesh',
  },
  {
    id: 'croatia',
    name: 'Croatia (MUP Temporary Stay for Studies)',
    flag: '🇭🇷',
    currency: 'EUR',
    rateToBdt: 132,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 12000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 6600,
    livingRequirementLabel: 'EUR 6,000 – 7,200 statutory MUP subsistence (~EUR 500–600/mo)',
    scholarshipWaivesSolvency: false,
    scholarshipName: 'AZVO / ASHE Public University Track',
    accountOwnershipRule: 'Student or Parents (with e-Apostille sponsorship affidavit & 6-month bank statement).',
    holdingPeriodRule: '3 to 6 months seasoned balance prior to MUP / VFS filing.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh + SWIFT MT103 receipt of paid 1st-year tuition.',
    studentFileNote: 'Wire 1st-year tuition via AD Bank Student File to AZVO-accredited Croatian institution.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Croatia study visa approval.',
    visaGuideHref: '/croatia-student-visa-bangladesh',
    costGuideHref: '/croatia-study-cost-bangladesh',
  },
  {
    id: 'thailand',
    name: 'Thailand (Non-Immigrant ED Student Visa)',
    flag: '🇹🇭',
    currency: 'USD',
    rateToBdt: 122,
    defaultUnpaidTuition: 0,
    maxTuitionSlider: 8000,
    tuitionStep: 500,
    includesUnpaidTuitionInBankBalance: false,
    livingRequirementForeign: 5000,
    livingRequirementLabel: 'USD 4,000 – 6,000 (~5.0L–7.5L BDT) for Royal Thai Embassy Dhaka',
    scholarshipWaivesSolvency: true,
    scholarshipName: 'AIT Fellowship / Chulalongkorn or Mahidol Full Graduate Scholarship',
    accountOwnershipRule: 'Student or Legal Parents (with signed sponsorship letter and relationship proof).',
    holdingPeriodRule: '6-month bank statement with official bank solvency certificate.',
    bankConstraint: 'Scheduled commercial bank in Bangladesh.',
    studentFileNote: 'Open Student File at AD bank to remit 1st-semester tuition to MHESI-accredited Thai university.',
    eduExpressFeeRule: 'BDT 0 file-opening charge · BDT 100,000 service fee payable 100% AFTER Thailand ED visa approval.',
    visaGuideHref: '/thailand-student-visa-bangladesh',
    costGuideHref: '/thailand-study-cost-bangladesh',
  },
];

export default function VisaSolvencyCalculator() {
  const [selectedId, setSelectedId] = useState<string>('uk-outside');
  const [hasFullScholarship, setHasFullScholarship] = useState<boolean>(false);
  const [unpaidTuition, setUnpaidTuition] = useState<number>(11000);

  const country = COUNTRIES.find((c) => c.id === selectedId) ?? COUNTRIES[0];

  const handleCountryChange = (newId: string) => {
    const next = COUNTRIES.find((c) => c.id === newId) ?? COUNTRIES[0];
    setSelectedId(newId);
    setUnpaidTuition(next.defaultUnpaidTuition);
    setHasFullScholarship(false);
  };

  const waived = hasFullScholarship && country.scholarshipWaivesSolvency;
  const effectiveTuitionInBalance =
    !waived && country.includesUnpaidTuitionInBankBalance ? unpaidTuition : 0;
  const totalForeignRequired = waived
    ? 0
    : country.livingRequirementForeign + effectiveTuitionInBalance;
  const totalBdtRequired = Math.round(totalForeignRequired * country.rateToBdt);
  const recommendedSafeBufferBdt = waived
    ? 250000
    : Math.round(totalBdtRequired * 1.1);

  return (
    <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lime text-petrol-800">
            <Calculator size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Interactive 2027 Financial Tool
            </span>
            <h3 className="text-xl font-bold text-petrol-800">
              12-Country Visa Bank Solvency &amp; Student File Calculator
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-canvas-soft px-3.5 py-1.5 text-xs font-bold text-petrol-800">
          Planning Rate: 1 {country.currency} ≈ {country.rateToBdt} BDT
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* Left Controls */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="solvency-country-select"
              className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
            >
              1. Select Destination &amp; Visa Track
            </label>
            <select
              id="solvency-country-select"
              value={selectedId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3.5 text-sm font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {country.includesUnpaidTuitionInBankBalance && (
            <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
              <div className="flex items-center justify-between text-xs font-bold text-petrol-800">
                <label htmlFor="unpaid-tuition-slider">
                  2. Unpaid Year-1 Tuition (After Deposit / Waiver)
                </label>
                <span className="rounded-lg bg-white px-2.5 py-1 text-sm font-extrabold text-emerald-800">
                  {country.currency} {unpaidTuition.toLocaleString()}
                </span>
              </div>
              <input
                id="unpaid-tuition-slider"
                type="range"
                min={0}
                max={country.maxTuitionSlider}
                step={country.tuitionStep}
                value={unpaidTuition}
                disabled={waived}
                onChange={(e) => setUnpaidTuition(Number(e.target.value))}
                className="mt-3 w-full accent-petrol-800"
              />
              <p className="mt-1.5 text-[11.5px] leading-5 text-slate-600">
                For {country.name.split(' (')[0]}, your visa bank statement must hold both statutory living funds AND any unpaid first-year tuition balance remaining on your CAS/offer letter.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-petrol-800/10 bg-canvas-soft p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-petrol-800">
              {country.includesUnpaidTuitionInBankBalance ? '3.' : '2.'} Funding / Scholarship Status
            </span>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setHasFullScholarship(false)}
                className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition ${
                  !hasFullScholarship
                    ? 'border-petrol-800 bg-petrol-800 text-white'
                    : 'border-petrol-800/15 bg-white text-petrol-800 hover:bg-lime-pale'
                }`}
              >
                Self-Funded / Partial Tuition Waiver
              </button>
              <button
                type="button"
                onClick={() => setHasFullScholarship(true)}
                className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition ${
                  hasFullScholarship
                    ? 'border-emerald-800 bg-emerald-800 text-white'
                    : 'border-petrol-800/15 bg-white text-petrol-800 hover:bg-lime-pale'
                }`}
              >
                Full Govt. Scholarship ({country.scholarshipName.split(' ')[0]})
              </button>
            </div>
            {hasFullScholarship && !country.scholarshipWaivesSolvency && (
              <p className="mt-2.5 flex items-start gap-1.5 text-[11.5px] font-semibold text-amber-900">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-700" />
                <span>
                  Note: Even with a 100% tuition waiver in {country.name.split(' (')[0]}, immigration still requires proof of annual living maintenance in your bank account.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="flex flex-col justify-between rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lime">
                Minimum Statutory Closing Balance
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">
                {country.flag} {country.name.split(' (')[0]}
              </span>
            </div>

            {waived ? (
              <div className="mt-4 rounded-2xl bg-white/10 p-4">
                <p className="font-display text-2xl font-black text-lime">
                  Bank Solvency Waived (Full Award)
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/85">
                  Official awardees of <strong>{country.scholarshipName}</strong> submit their official scholarship certificate in place of personal bank solvency. We still recommend a BDT 2.0L–3.0L personal buffer for flights, medicals, and initial settlement.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <span className="text-[11px] font-semibold uppercase text-white/70">
                    Required Foreign Currency
                  </span>
                  <p className="mt-1 font-display text-2xl font-black text-lime">
                    {country.currency} {totalForeignRequired.toLocaleString()}
                  </p>
                  <span className="mt-1 block text-[11px] text-white/75">
                    {country.livingRequirementLabel}
                  </span>
                </div>
                <div className="rounded-2xl bg-lime/15 p-4 ring-1 ring-lime/40">
                  <span className="text-[11px] font-semibold uppercase text-lime">
                    Approx. BDT Equivalent
                  </span>
                  <p className="mt-1 font-display text-2xl font-black text-white">
                    BDT {totalBdtRequired.toLocaleString()}
                  </p>
                  <span className="mt-1 block text-[11px] text-lime">
                    Safe 10% FX Buffer: ~BDT {recommendedSafeBufferBdt.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Statutory Rules Grid */}
            <div className="mt-5 space-y-3 text-xs">
              <div className="flex items-start gap-2.5 rounded-2xl bg-white/[0.06] p-3.5">
                <UserCheck size={16} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <strong className="text-white">Permitted Account Holder:</strong>{' '}
                  <span className="text-white/85">{country.accountOwnershipRule}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl bg-white/[0.06] p-3.5">
                <CalendarClock size={16} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <strong className="text-white">Mandatory Holding / Maturity Rule:</strong>{' '}
                  <span className="text-white/85">{country.holdingPeriodRule}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl bg-white/[0.06] p-3.5">
                <Landmark size={16} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <strong className="text-white">Bank &amp; Student File Requirement:</strong>{' '}
                  <span className="text-white/85">
                    {country.bankConstraint} {country.studentFileNote}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-950/60 p-3.5 ring-1 ring-lime/30">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-lime" />
                <div>
                  <strong className="text-lime">EduExpress Fee Guarantee:</strong>{' '}
                  <span className="text-white/90">{country.eduExpressFeeRule}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4">
            <Link
              href="/education-fit-assessment"
              className="ed-btn ed-btn-signal min-h-[44px] px-5 text-xs font-bold"
            >
              Get My Written Bank Solvency &amp; ClearCost Audit <ArrowRight size={15} />
            </Link>
            <Link
              href={country.visaGuideHref}
              className="ed-btn ed-btn-on-dark min-h-[44px] px-4 text-xs"
            >
              Read {country.name.split(' (')[0]} Visa Guide
            </Link>
            <Link
              href={country.costGuideHref}
              className="ed-btn ed-btn-on-dark min-h-[44px] px-4 text-xs"
            >
              Cost Breakdown
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

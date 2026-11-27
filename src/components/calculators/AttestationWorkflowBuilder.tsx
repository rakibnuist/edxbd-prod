'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  Landmark,
  ShieldCheck,
} from 'lucide-react';

type QualificationBg = 'ssc_hsc_board' | 'olevel_alevel' | 'bd_bachelor' | 'bteb_diploma';

type CountryAttestationFlow = {
  id: string;
  name: string;
  flag: string;
  timingBadge: string;
  apostilleOrLegalization: string;
  pccRule: string;
  medicalRule: string;
  translationRule: string;
  estimatedDays: string;
  visaGuideHref: string;
};

const COUNTRY_FLOWS: CountryAttestationFlow[] = [
  {
    id: 'china',
    name: 'China (X1 / X2 Visa & CSC)',
    flag: '🇨🇳',
    timingBadge: 'Apply with Color Scans + Notary First',
    apostilleOrLegalization:
      'Notary Public Dhaka for admission portal; original SSC/HSC/Bachelor certificates presented with JW202/DQ at Chinese Visa Center Dhaka.',
    pccRule: 'Mandatory Online Police Clearance Certificate (pcc.police.gov.bd) with MoFA QR code (valid ≤6 months).',
    medicalRule: 'Foreigner Physical Examination Form completed at approved diagnostic center in Dhaka.',
    translationRule: 'English certificates accepted directly across all Chinese universities and CVASC Dhaka.',
    estimatedDays: '7 – 12 Working Days (mostly for online Police Clearance)',
    visaGuideHref: '/china-student-visa-bangladesh',
  },
  {
    id: 'south-korea',
    name: 'South Korea (D-2 Visa & GKS)',
    flag: '🇰🇷',
    timingBadge: 'URGENT: Full MoFA + Consular / Apostille Required BEFORE Admission',
    apostilleOrLegalization:
      'Education Board / UGC → Ministry of Education (SHED) → MoFA Dhaka e-Apostille / Korean Embassy Dhaka Consular Legalization ($4/doc).',
    pccRule: 'MoFA-attested Police Clearance + MoFA-attested Family Relationship Certificate (FRC).',
    medicalRule: 'Mandatory TB Screening at Korean Embassy Dhaka designated hospitals (e.g., IOM, United, Apollo/Evercare).',
    translationRule: 'All Bangla documents (FRC, Birth Certificate, Trade License, Tax Returns) must be notarized in English.',
    estimatedDays: '15 – 25 Working Days (Start 1 month before university deadline)',
    visaGuideHref: '/south-korea-student-visa-bangladesh',
  },
  {
    id: 'uk',
    name: 'United Kingdom (UKVI Student Route)',
    flag: '🇬🇧',
    timingBadge: 'No MoFA Stamp Needed for Academic Certificates',
    apostilleOrLegalization:
      'UK universities and VFS Global Dhaka verify original SSC/HSC/Bachelor certificates directly via digital upload and issuing board checks.',
    pccRule: 'Not required for standard non-clinical student visa routes.',
    medicalRule: 'Mandatory UKVI Tuberculosis (TB) Certificate issued exclusively by IOM Migration Health Assessment Center (Dhaka/Sylhet).',
    translationRule: 'Official English translation required only if bank or sponsor documents are in Bengali.',
    estimatedDays: '3 – 5 Working Days (IOM TB appointment)',
    visaGuideHref: '/uk-student-visa-bangladesh',
  },
  {
    id: 'malaysia',
    name: 'Malaysia (EMGS eVAL & SEV)',
    flag: '🇲🇾',
    timingBadge: 'Apply with Color Scans · Attest Originals Before Travel',
    apostilleOrLegalization:
      'High-resolution color scans of original certificates for EMGS eVAL; Education Board & MoFA attestation recommended for public universities.',
    pccRule: 'Not required for standard EMGS student pass applications.',
    medicalRule: 'Pre-departure Health Declaration Form + mandatory post-arrival EMGS panel clinic screening within 7 days of landing.',
    translationRule: 'English transcripts accepted directly.',
    estimatedDays: '2 – 4 Working Days',
    visaGuideHref: '/malaysia-student-visa-bangladesh',
  },
  {
    id: 'hungary',
    name: 'Hungary (Schengen Type D & Stipendium)',
    flag: '🇭🇺',
    timingBadge: 'Apply with Color Scans · Full MoFA e-Apostille for Visa',
    apostilleOrLegalization:
      'Education Board / UGC → Ministry of Education → MoFA Dhaka e-Apostille (myGov QR verification) before VFS Global Dhaka filing.',
    pccRule: 'Recommended / required by several universities & dormitory authorities (MoFA-verified PCC).',
    medicalRule: 'Mandatory Medical Fitness Certificate (HIV, Hep B/C, Chest X-Ray) for Stipendium Hungaricum + EUR 30,000 Schengen Insurance.',
    translationRule: 'English documents accepted at VFS Global Dhaka.',
    estimatedDays: '12 – 18 Working Days',
    visaGuideHref: '/hungary-student-visa-bangladesh',
  },
  {
    id: 'finland',
    name: 'Finland (Migri Residence Permit)',
    flag: '🇫🇮',
    timingBadge: 'Original Certificates Verified in Person at VFS New Delhi',
    apostilleOrLegalization:
      'Upload original color scans on Studyinfo.fi & Enter Finland; present physical original certificates at VFS Finland (New Delhi).',
    pccRule: 'Not mandatory for initial student residence permit unless requested.',
    medicalRule: 'Mandatory Migri-compliant Private Health Insurance (EUR 40,000 coverage for ≥2-yr degree; EUR 120,000 for <2 yrs).',
    translationRule: 'English certificates accepted directly.',
    estimatedDays: '5 – 10 Working Days (plus Indian transit visa prep for Delhi biometrics)',
    visaGuideHref: '/finland-student-visa-bangladesh',
  },
  {
    id: 'cyprus',
    name: 'Republic of Cyprus (EU CRMD Entry Permit)',
    flag: '🇨🇾',
    timingBadge: 'URGENT: Full MoFA Attestation Couriered to Cyprus Early',
    apostilleOrLegalization:
      'Education Board / UGC → MoE → MoFA Dhaka attestation on all academic certificates, bank letters, and PCC, then DHL couriered to the university in Nicosia/Limassol for CRMD Blue Slip.',
    pccRule: 'Mandatory MoFA-attested Police Clearance Certificate (valid ≤6 months).',
    medicalRule: 'Mandatory MoFA-attested 4-Panel Medical Report (HIV, Hepatitis B, Hepatitis C, Syphilis/VDRL + Chest X-Ray).',
    translationRule: 'All documents must be in English and bear verifiable MoFA seals.',
    estimatedDays: '15 – 22 Working Days',
    visaGuideHref: '/cyprus-student-visa-bangladesh',
  },
  {
    id: 'georgia',
    name: 'Georgia (D3 Study Visa & NCEQE)',
    flag: '🇬🇪',
    timingBadge: 'Apply with Scans · e-Apostille & Georgian Translation for NCEQE/Visa',
    apostilleOrLegalization:
      'Education Board / UGC → MoE → MoFA e-Apostille + notarized Georgian language translation for NCEQE Ministry Recognition & D3 Visa.',
    pccRule: 'MoFA e-Apostille Police Clearance recommended for residence permit card in Tbilisi.',
    medicalRule: 'Travel & health insurance covering Georgia study period (+ BMDC Eligibility Certificate if studying 6-Yr MD!).',
    translationRule: 'Passport & academic certificates require certified Georgian translation during NCEQE EQE process.',
    estimatedDays: '14 – 20 Working Days',
    visaGuideHref: '/georgia-student-visa-bangladesh',
  },
  {
    id: 'croatia',
    name: 'Croatia (MUP Temporary Stay for Studies)',
    flag: '🇭🇷',
    timingBadge: 'Full MoFA e-Apostille + Sworn Translation for MUP Filing',
    apostilleOrLegalization:
      'Education Board / UGC → MoE → MoFA e-Apostille on transcripts, sponsorship affidavit, and Police Clearance for AZVO academic recognition and MUP residence permit.',
    pccRule: 'Mandatory MoFA e-Apostille Police Clearance Certificate (valid ≤6 months) with certified Croatian/English translation.',
    medicalRule: 'Schengen Travel Health Insurance (EUR 30,000 coverage) prior to HZZO registration.',
    translationRule: 'PCC and birth/sponsorship documents require certified translation for MUP.',
    estimatedDays: '15 – 22 Working Days',
    visaGuideHref: '/croatia-student-visa-bangladesh',
  },
  {
    id: 'malta',
    name: 'Malta (Identità Central Visa Unit)',
    flag: '🇲🇹',
    timingBadge: 'Apply with Scans · MoFA e-Apostille for VFS Submission',
    apostilleOrLegalization:
      'Education Board / UGC → MoE → MoFA e-Apostille on academic certificates and sponsor relationship documents.',
    pccRule: 'Recommended MoFA e-Apostille Police Clearance.',
    medicalRule: 'Full-duration EUR 30,000 medical insurance covering entire study stay.',
    translationRule: 'English documents accepted directly.',
    estimatedDays: '12 – 18 Working Days',
    visaGuideHref: '/malta-student-visa-bangladesh',
  },
  {
    id: 'greece',
    name: 'Greece (Schengen Type D National Visa)',
    flag: '🇬🇷',
    timingBadge: 'Full MoFA e-Apostille Required for Consular Interview',
    apostilleOrLegalization:
      'Education Board / UGC → MoE → MoFA e-Apostille on all academic certificates, Birth Certificate/FRC, and Police Clearance.',
    pccRule: 'Mandatory MoFA e-Apostille Police Clearance Certificate + Medical Fitness Certificate.',
    medicalRule: 'Official Medical Certificate confirming absence of infectious diseases + EUR 30,000 Schengen Insurance.',
    translationRule: 'Greek or English official translations per Embassy of Greece consular checklist.',
    estimatedDays: '15 – 22 Working Days',
    visaGuideHref: '/greece-student-visa-bangladesh',
  },
  {
    id: 'thailand',
    name: 'Thailand (Non-Immigrant ED Student Visa)',
    flag: '🇹🇭',
    timingBadge: 'Fast Track · Apply with Scans · MoFA PCC for Thai e-Visa',
    apostilleOrLegalization:
      'Notarized/Board-verified academic certificates + official MHESI/University letter uploaded to Royal Thai Embassy Dhaka e-Visa portal.',
    pccRule: 'Online Police Clearance Certificate (MoFA QR) required for Non-Immigrant ED visa submission.',
    medicalRule: 'Standard medical fitness certificate as requested by host Thai university.',
    translationRule: 'English documents accepted directly by Royal Thai Embassy Dhaka.',
    estimatedDays: '7 – 12 Working Days',
    visaGuideHref: '/thailand-student-visa-bangladesh',
  },
];

const BG_STEPS: Record<QualificationBg, { title: string; authority: string; detail: string }[]> = {
  ssc_hsc_board: [
    {
      title: 'Step 1: Education Board Verification (Dhaka / Regional / Madrasah Board)',
      authority: 'Intermediate & Secondary Education Board / myGov Portal',
      detail:
        'Submit SSC/Dakhil and HSC/Alim original certificates and academic transcripts for issuing board verification via myGov.bd.',
    },
    {
      title: 'Step 2: Ministry of Education (SHED) Countersignature',
      authority: 'Secondary & Higher Education Division (SHED), Bangladesh Secretariat',
      detail:
        'Integrated digitally via myGov: SHED verifies the Education Board record and forwards it electronically to MoFA.',
    },
  ],
  olevel_alevel: [
    {
      title: 'Step 1: British Council Bangladesh Verification Stamp',
      authority: 'British Council Dhaka (Fuller Road) / Pearson Edexcel & Cambridge',
      detail:
        'Obtain official certifying stamps on your Cambridge IGCSE/O-Level and A-Level certificates through British Council Dhaka.',
    },
    {
      title: 'Step 2: Ministry of Education / DGHS Equivalence (If Medical)',
      authority: 'Ministry of Education (or DGME Mohakhali for MBBS applicants)',
      detail:
        'For MBBS/MD abroad, convert O/A-Level grades into a DGME Equivalence Certificate before applying for a BMDC Eligibility Certificate.',
    },
  ],
  bd_bachelor: [
    {
      title: 'Step 1: University Registrar / Controller of Examinations Verification',
      authority: 'Issuing Bangladeshi Public or Private University',
      detail:
        'Have your original Provisional/Main Degree Certificate and Transcripts verified and sealed by your university Controller of Examinations.',
    },
    {
      title: 'Step 2: University Grants Commission (UGC) & Ministry of Education',
      authority: 'UGC Bangladesh (Agargaon, Dhaka) & SHED via myGov.bd',
      detail:
        'Upload your university-verified degree on myGov.bd for UGC and Ministry of Education digital verification prior to MoFA e-Apostille.',
    },
  ],
  bteb_diploma: [
    {
      title: 'Step 1: Bangladesh Technical Education Board (BTEB) Verification',
      authority: 'BTEB (Agargaon, Dhaka)',
      detail:
        'Verify your 4-Year Diploma-in-Engineering certificate and all 8 semester marksheets at BTEB Agargaon.',
    },
    {
      title: 'Step 2: Technical & Madrasah Education Division (TMED), Ministry of Education',
      authority: 'TMED, Ministry of Education via myGov.bd',
      detail:
        'Forward BTEB-verified transcripts through TMED on myGov.bd to unlock MoFA Dhaka e-Apostille attestation.',
    },
  ],
};

export default function AttestationWorkflowBuilder() {
  const [countryId, setCountryId] = useState<string>('china');
  const [bg, setBg] = useState<QualificationBg>('ssc_hsc_board');

  const flow = COUNTRY_FLOWS.find((c) => c.id === countryId) ?? COUNTRY_FLOWS[0];
  const preMofaSteps = BG_STEPS[bg];

  return (
    <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lime text-petrol-800">
            <FileCheck2 size={22} aria-hidden="true" />
          </span>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Interactive Legalization Roadmap · myGov &amp; MoFA Dhaka
            </span>
            <h3 className="text-xl font-bold text-petrol-800">
              Custom Document Attestation &amp; e-Apostille Workflow Builder
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
          Est. Timeline: {flow.estimatedDays}
        </span>
      </div>

      {/* Selectors */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="attestation-country-select"
            className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
          >
            1. Select Target Destination Country
          </label>
          <select
            id="attestation-country-select"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3.5 text-sm font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
          >
            {COUNTRY_FLOWS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="attestation-bg-select"
            className="block text-xs font-bold uppercase tracking-wider text-petrol-800"
          >
            2. Your Latest Academic Qualification in Bangladesh
          </label>
          <select
            id="attestation-bg-select"
            value={bg}
            onChange={(e) => setBg(e.target.value as QualificationBg)}
            className="mt-2 w-full rounded-2xl border border-petrol-800/20 bg-canvas-soft px-4 py-3.5 text-sm font-bold text-petrol-800 focus:border-petrol-800 focus:bg-white focus:outline-none"
          >
            <option value="ssc_hsc_board">SSC / Dakhil + HSC / Alim (Education Board)</option>
            <option value="olevel_alevel">Cambridge / Edexcel O-Level &amp; A-Level</option>
            <option value="bd_bachelor">4-Year Bachelor’s / Master’s (BD Public or Private Uni)</option>
            <option value="bteb_diploma">4-Year BTEB Polytechnic Diploma-in-Engineering</option>
          </select>
        </div>
      </div>

      {/* Step-by-Step Pipeline */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: 4-Stage Dhaka Attestation Sequence */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-petrol-800">
              Your Sequential Dhaka Legalization Chain
            </span>
            <span className="rounded-full bg-lime/40 px-3 py-0.5 text-[11px] font-bold text-petrol-800">
              {flow.timingBadge}
            </span>
          </div>

          {preMofaSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-petrol-800/12 bg-canvas-soft p-4"
            >
              <p className="text-xs font-extrabold text-petrol-800">{step.title}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-emerald-800">{step.authority}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">{step.detail}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-petrol-800/12 bg-canvas-soft p-4">
            <p className="text-xs font-extrabold text-petrol-800">
              Step 3: Ministry of Foreign Affairs (MoFA Dhaka) &amp; Consular Stage
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-800">
              MoFA Consular Wing (Segunbagicha / myGov e-Apostille)
            </p>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              {flow.apostilleOrLegalization}
            </p>
          </div>
        </div>

        {/* Right: Country-Specific PCC, Medical & Translation Card */}
        <div className="flex flex-col justify-between rounded-3xl bg-petrol-800 p-6 text-white sm:p-7">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lime">
                {flow.flag} {flow.name.split(' (')[0]} Mandatory Dossier Rules
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/80">
                <Clock size={13} className="text-lime" /> {flow.estimatedDays}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-2xl bg-white/[0.07] p-3.5">
                <strong className="text-lime">Police Clearance Certificate (PCC):</strong>
                <p className="mt-1 leading-5 text-white/85">{flow.pccRule}</p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] p-3.5">
                <strong className="text-lime">Medical &amp; Health Insurance Rule:</strong>
                <p className="mt-1 leading-5 text-white/85">{flow.medicalRule}</p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] p-3.5">
                <strong className="text-lime">Translation &amp; Name Consistency Check:</strong>
                <p className="mt-1 leading-5 text-white/85">
                  {flow.translationRule} Ensure your name and parents’ names match character-for-character across Passport, NID, and transcripts.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4">
            <Link
              href="/education-fit-assessment"
              className="ed-btn ed-btn-signal min-h-[44px] px-5 text-xs font-bold"
            >
              Get Free Document Pre-Check at Dhanmondi Desk <ArrowRight size={15} />
            </Link>
            <Link
              href={flow.visaGuideHref}
              className="ed-btn ed-btn-on-dark min-h-[44px] px-4 text-xs"
            >
              Read {flow.name.split(' (')[0]} Visa Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

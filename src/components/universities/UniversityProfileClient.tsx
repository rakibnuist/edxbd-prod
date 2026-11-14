'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck2,
  Globe2,
  GraduationCap,
  Landmark,
  Languages,
  MapPin,
  MessageCircle,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
} from 'lucide-react';
import { type UpdateCardData } from '@/components/updates/UpdateCard';
import { config } from '@/lib/config';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityRanking } from '@/lib/university-rankings';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import UniversityEnquiryForm from './UniversityEnquiryForm';
import UniversityDocuments from './UniversityDocuments';
import { UniversityProgramTable, UniversityFundingTable, UniversityEntrySummary } from './UniversityGuideTables';

type Panel = 'overview' | 'programs' | 'scholarships' | 'admission' | 'documents' | 'rankings' | 'questions';
const PANELS: { id: Panel; label: string }[] = [
  { id: 'overview', label: 'About University' },
  { id: 'programs', label: 'Programs & Fees' },
  { id: 'scholarships', label: 'Scholarships & Aid' },
  { id: 'admission', label: 'Entry Requirements' },
  { id: 'documents', label: 'Required Documents' },
  { id: 'rankings', label: 'Rankings & Accreditation' },
  { id: 'questions', label: 'FAQs' },
];

const LEVEL_LABELS: Record<ProgramLevel, string> = {
  Bachelor: 'Bachelor’s',
  Master: 'Master’s',
  PhD: 'PhD',
  Language: 'Language',
  Foundation: 'Foundation',
  Diploma: 'Diploma',
};

const titleClass = 'font-display text-[26px] font-black leading-tight tracking-[-0.01em] text-petrol-800 sm:text-[32px] lg:text-[36px]';
const mutedClass = 'text-sm leading-7 text-slate-500';
const selectClass = 'mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#12436b] focus:ring-2 focus:ring-[#12436b]/10';
const sheetClass = 'rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/90';
const applyClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-petrol-800 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-petrol-900 shadow-sm';

type Props = {
  faq: { question: string; answer: string }[];
  university: Pick<CleanUniversityRecord, 'name' | 'slug' | 'city' | 'country' | 'location' | 'logo' | 'scholarships'> & {
    officialUrl?: string;
    recognitionAuthority?: string;
    recognitionSourceUrl?: string;
    badges?: string[];
    rankings?: { country?: number; world?: number; national?: number };
    tuition?: string;
  };
  generalDetails: {
    majors: string[];
    degrees: string[];
    languages: string[];
    tuition: string;
    documents: string[];
    fees: { item: string; cost: string; notes?: string }[];
  };
  intakeMonths?: string[];
  shortName: string;
  displayName: string;
  scholarshipOptions: UniversityScholarshipOption[];
  overview: string;
  highlights: { title: string; description: string }[];
  campusImage?: { src: string; alt: string };
  programs: UniversityProgramDetail[];
  hasDetailedPrograms: boolean;
  rankings: Omit<UniversityRanking, 'sourceUrl'>[];
  servicePackages: { title: string; priceLabel: string; summary?: string }[];
  news?: UpdateCardData[];
  now?: number;
};

function PlainList({ items, empty = 'Details are not yet available for this program.' }: { items: string[]; empty?: string }) {
  if (!items.length) return <p className={mutedClass}>{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-1" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function UniversityProfileClient({
  faq,
  university,
  shortName,
  displayName,
  overview,
  highlights,
  intakeMonths = [],
  generalDetails,
  programs,
  scholarshipOptions,
  rankings,
}: Props) {
  const [panel, setPanel] = useState<Panel>('overview');
  const [selectedId, setSelectedId] = useState(programs[0]?.id || '');
  const [selectedDocLevel, setSelectedDocLevel] = useState<ProgramLevel | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [scholarshipScenario, setScholarshipScenario] = useState<UniversityScholarshipOption | null>(null);
  const id = useId();

  const isMalaysia = (university.country || '').toLowerCase() === 'malaysia';
  const isChina = (university.country || '').toLowerCase() === 'china';
  const countryFlag = isMalaysia ? '🇲🇾' : isChina ? '🇨🇳' : '🎓';

  const selected = programs.find((program) => program.id === selectedId) || programs[0];
  const availableLevels = PROGRAM_LEVELS.filter((item) =>
    programs.some((program) => normalizeProgramLevel(program.level) === item)
  );
  const languages = [...new Set(programs.flatMap((program) => program.languages).filter(Boolean))];
  const hasMedicalProgram = programs.some((program) =>
    /\bMBBS\b|clinical medicine|ophthalmological and optometric medicine/i.test(program.name)
  );

  const worldRanking = rankings.find((ranking) => ranking.scope === 'world');
  const nationalRanking = rankings.find((ranking) => ranking.scope === 'national');
  const subjectRanking = rankings.find((ranking) => ranking.scope === 'subject');
  const effectiveWorldRank = worldRanking?.rank || (university.rankings?.world ? String(university.rankings.world) : undefined);
  const effectiveCountryRank =
    nationalRanking?.rank ||
    (university.rankings?.country
      ? String(university.rankings.country)
      : university.rankings?.national
      ? String(university.rankings.national)
      : undefined);

  const recognitionLabel =
    university.recognitionAuthority ||
    (isMalaysia
      ? 'MQA & Ministry of Higher Education (MoHE) Malaysia'
      : isChina
      ? 'Ministry of Education (MoE), PR China'
      : 'Recognized Higher Education Institution');

  const feePreviews = availableLevels.flatMap((item) => {
    const fees = programs
      .filter((program) => normalizeProgramLevel(program.level) === item)
      .flatMap((program) =>
        program.fees.filter((fee) => fee.key === 'tuition' && !fee.optional && fee.amount !== undefined)
      );
    if (!fees.length || new Set(fees.map((fee) => fee.currency)).size !== 1 || new Set(fees.map((fee) => fee.period)).size !== 1)
      return [];
    const low = Math.min(...fees.map((fee) => fee.amount!));
    const high = Math.max(...fees.map((fee) => fee.amount!));
    return [
      {
        level: item,
        amount: `${fees[0].currency} ${low.toLocaleString('en-US')}${high > low ? `–${high.toLocaleString('en-US')}` : ''}`,
        period:
          ({
            year: 'per year',
            semester: 'per semester',
            programme: 'per program',
            month: 'per month',
            day: 'per day',
            oneoff: 'one-time',
          })[fees[0].period] || 'per year',
      },
    ];
  });

  const assessmentHref = '#university-enquiry';
  const activeScenario =
    selected && scholarshipScenario && scholarshipMatchesProgram(scholarshipScenario, selected)
      ? scholarshipScenario
      : null;
  const scholarshipHighlight =
    activeScenario || scholarshipOptions.find((option) => !selected || scholarshipMatchesProgram(option, selected));
  const scholarshipHighlightLabel =
    scholarshipHighlight && (scholarshipReductionLabel(scholarshipHighlight) || scholarshipHighlight.coverage[0]);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'fees') {
        setPanel('programs');
      } else if (PANELS.some((item) => item.id === hash)) {
        setPanel(hash as Panel);
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const openPanel = (next: Panel | 'fees') => {
    const target = next === 'fees' ? 'programs' : next;
    setPanel(target);
    window.history.replaceState(null, '', '#' + target);
    document.getElementById(target)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const chooseProgram = (value: string) => {
    setSelectedId(value);
    setSelectedDocLevel(null);
    setScholarshipScenario(null);
  };

  const activeDocLevel: ProgramLevel =
    selectedDocLevel && availableLevels.includes(selectedDocLevel)
      ? selectedDocLevel
      : selected
      ? normalizeProgramLevel(selected.level)
      : availableLevels[0] || 'Bachelor';

  const activeLevelPrograms = programs.filter(
    (program) => normalizeProgramLevel(program.level) === activeDocLevel
  );
  const activeLevelDocuments = [
    ...new Set(
      (activeLevelPrograms.length ? activeLevelPrograms : programs)
        .flatMap((program) => program.documents)
        .map((doc) => doc.trim())
        .filter(Boolean)
    ),
  ];

  const chooseScholarship = (option: UniversityScholarshipOption | null) => {
    setScholarshipScenario(option);
    if (!option) return;
    const program =
      selected && scholarshipMatchesProgram(option, selected)
        ? selected
        : programs.find((item) => scholarshipMatchesProgram(option, item));
    if (program) {
      setSelectedId(program.id);
    }
  };

  const estimateScholarship = (option: UniversityScholarshipOption) => {
    chooseScholarship(option);
    document.getElementById('university-enquiry')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const cleanGeneralTuition = /dated official fee|next-cycle|require confirmation|research below/i.test(generalDetails.tuition || '')
    ? 'Official fee per program'
    : generalDetails.tuition;

  const generalFeeTable = (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
      <h3 className="text-base font-bold text-slate-900">Published Institutional Fee Items</h3>
      <p className="mt-1 text-xs text-slate-500">Official university tuition and campus charges.</p>
      <dl className="mt-4 divide-y divide-slate-200/70">
        {[
          ...(cleanGeneralTuition ? [{ item: 'Tuition Range', cost: cleanGeneralTuition }] : []),
          ...generalDetails.fees,
        ].map((fee, index) => (
          <div key={`${fee.item}-${index}`} className="py-3 flex items-start justify-between gap-5 text-xs sm:text-sm">
            <dt className="font-medium text-slate-700">{fee.item}</dt>
            <dd className="text-right font-bold tabular-nums text-slate-900">{fee.cost}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  const panelProps = (name: Panel) => ({ id: name, 'aria-label': PANELS.find((item) => item.id === name)?.label });
  const tuitionHighlight = selected?.fees.find((fee) => fee.key === 'tuition' && !fee.optional);
  const rawTuitionText = university.tuition || generalDetails.tuition || (tuitionHighlight ? feeText(tuitionHighlight) : 'Itemized below');
  const cleanTuitionText =
    feePreviews.length > 0
      ? `${feePreviews[0].amount} ${feePreviews[0].period}`
      : /dated official fee|next-cycle|require confirmation|research below/i.test(rawTuitionText)
      ? 'View program fees below'
      : rawTuitionText.replace(/\s*\([^)]*guide[^)]*\)/gi, '');

  const cleanScholarshipTitle = (() => {
    const raw = scholarshipHighlightLabel || scholarshipHighlight?.title;
    if (!raw) return 'Merit & Entry Waivers';
    if (/full(?:y)? funded|100%|full tuition/i.test(raw)) return 'Up to 100% Tuition Waiver';
    if (/partial/i.test(raw) && /waiver|discount|scholarship/i.test(raw)) return 'Partial Merit Waiver';
    if (raw.length > 36) {
      if (/merit/i.test(raw)) return 'Merit-Based Scholarship';
      if (/waiver/i.test(raw)) return 'Tuition Fee Waiver';
      return raw.slice(0, 32) + '…';
    }
    return raw;
  })();

  const waHref = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Assalamu alaikum. I am interested in ${selected ? `${selected.name} (${selected.level}) at ` : ''}${university.name} in ${university.country}. Please check my eligibility.`
  )}`;

  const overviewParagraphs = overview
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Build supplemental student-focused SEO paragraphs if the base overview is short
  const supplementalParagraphs: string[] = [];
  if (overviewParagraphs.join(' ').length < 320) {
    const levelText = availableLevels.length
      ? availableLevels.map((l) => LEVEL_LABELS[l]).join(', ')
      : generalDetails.degrees.join(', ') || 'undergraduate and postgraduate';
    const langText = languages.length ? languages.join(' and ') : 'English';
    const intakeText = intakeMonths.length
      ? intakeMonths.join(' and ')
      : isChina
      ? 'September and March'
      : 'multiple annual intakes';

    supplementalParagraphs.push(
      `Located in ${university.city}, ${university.country}, ${displayName} offers ${programs.length || 'multiple'} documented academic programs across ${levelText} levels. International applicants from Bangladesh can apply to courses taught in ${langText}, with primary admission cycles in ${intakeText}.`
    );
    if (isChina) {
      supplementalParagraphs.push(
        `For Bangladeshi students and families, EduExpress International provides end-to-end admission support for ${shortName}—covering major selection, scholarship evaluation, document verification, and JW202 visa processing from Dhaka—under a strict BDT 0 Before Visa policy.`
      );
    } else if (isMalaysia) {
      supplementalParagraphs.push(
        `Bangladeshi students applying to ${shortName} through EduExpress International receive 100% free admission counseling and EMGS eVAL visa processing (BDT 0 agency service fee). All tuition and EMGS payments follow the university's official offer letter and invoice.`
      );
    }
  }

  const allOverviewParagraphs = [...overviewParagraphs, ...supplementalParagraphs];

  return (
    <article className="min-h-screen bg-[#f8fafc] pb-20 pt-[76px] text-ink xl:pt-[112px]">
      {/* Executive Hero Header */}
      <header className="relative overflow-hidden bg-petrol-800 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 size-[560px] rounded-full bg-lime/10 blur-3xl" />
        <div className="relative mx-auto max-w-[1280px] px-5 pt-8 pb-14 sm:px-8 lg:px-10 lg:pt-10 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[14px] font-semibold text-white/65">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={13} className="text-white/40" />
            <Link href="/universities" className="hover:text-white">
              Universities
            </Link>
            <ChevronRight size={13} className="text-white/40" />
            <Link href={`/universities?country=${encodeURIComponent(university.country)}`} className="hover:text-white text-white/80">
              {university.country}
            </Link>
            <ChevronRight size={13} className="text-white/40" />
            <span className="text-white">{shortName}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
            <div className="min-w-0">
              {/* Logo & Meta Row */}
              <div className="flex items-center gap-5">
                <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2.5 shadow-lg border border-white/20">
                  {university.logo && !logoFailed ? (
                    <Image
                      src={university.logo}
                      alt={`${university.name} official logo`}
                      width={86}
                      height={86}
                      className="h-full w-full object-contain"
                      unoptimized
                      onError={() => setLogoFailed(true)}
                    />
                  ) : (
                    <GraduationCap size={40} className="text-petrol-800" aria-hidden="true" />
                  )}
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-lime">
                    {countryFlag} Verified Institution · {university.country}
                  </span>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[15px] font-semibold text-white/85">
                    <MapPin size={16} className="text-lime shrink-0" aria-hidden="true" />
                    {university.location || `${university.city}, ${university.country}`}
                  </p>
                </div>
              </div>

              {/* Title & Badges */}
              <h1 className="mt-6 font-display text-[34px] font-black leading-tight sm:text-[46px] lg:text-[52px] text-white">
                {displayName}
              </h1>

              {/* Quick Student Highlight Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {effectiveWorldRank && (
                  <a
                    href="#rankings"
                    className="inline-flex items-center gap-1.5 rounded-full bg-lime/20 border border-lime/35 px-3.5 py-1 text-[12px] font-bold text-lime hover:bg-lime/30 transition-colors"
                  >
                    <Trophy size={13} className="text-lime shrink-0" />
                    World Rank #{String(effectiveWorldRank).replace(/^#/, '')}
                    {worldRanking?.publisher ? ` (${worldRanking.publisher})` : ''}
                  </a>
                )}
                {effectiveCountryRank && (
                  <a
                    href="#rankings"
                    className="inline-flex items-center gap-1.5 rounded-full bg-lime/20 border border-lime/35 px-3.5 py-1 text-[12px] font-bold text-lime hover:bg-lime/30 transition-colors"
                  >
                    <Trophy size={13} className="text-lime shrink-0" />
                    {university.country} Rank #{String(effectiveCountryRank).replace(/^#/, '')}
                    {nationalRanking?.publisher ? ` (${nationalRanking.publisher})` : ''}
                  </a>
                )}
                {!effectiveWorldRank && !effectiveCountryRank && subjectRanking && (
                  <a
                    href="#rankings"
                    className="inline-flex items-center gap-1.5 rounded-full bg-lime/20 border border-lime/35 px-3.5 py-1 text-[12px] font-bold text-lime hover:bg-lime/30 transition-colors"
                  >
                    <Trophy size={13} className="text-lime shrink-0" />
                    #{String(subjectRanking.rank).replace(/^#/, '')} in {subjectRanking.subject}
                  </a>
                )}
                {university.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-lime/20 border border-lime/30 px-3.5 py-1 text-[12px] font-bold text-lime"
                  >
                    ★ {badge}
                  </span>
                ))}
                {programs.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[12px] font-semibold text-white/90">
                    <GraduationCap size={14} className="text-lime" />
                    {programs.length} {programs.length === 1 ? 'Program' : 'Programs'} ({availableLevels.map((l) => LEVEL_LABELS[l]).join(', ')})
                  </span>
                )}
                {languages.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[12px] font-semibold text-white/90">
                    <Globe2 size={14} className="text-lime" />
                    {languages.join(' / ')} Medium
                  </span>
                )}
                {intakeMonths.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[12px] font-semibold text-white/90">
                    <CalendarCheck size={14} className="text-lime" />
                    Intakes: {intakeMonths.join(', ')}
                  </span>
                )}
              </div>

              {/* Accreditation / Recognition Callout */}
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm text-[13px] sm:text-[14px] text-white/90 border border-white/15">
                <ShieldCheck size={18} className="text-lime shrink-0" />
                <span>
                  <strong>Accreditation:</strong> {recognitionLabel}
                </span>
                {university.recognitionSourceUrl && (
                  <a
                    href={university.recognitionSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-lime hover:underline"
                  >
                    Verify Register <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <p className="mt-5 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-white/85">
                {allOverviewParagraphs[0]}
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[50px] px-7">
                  Check My Eligibility <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-btn ed-btn-on-dark min-h-[50px] px-7 inline-flex items-center gap-2"
                >
                  <MessageCircle size={17} /> Ask on WhatsApp
                </a>
                <a
                  href="#programs"
                  className="inline-flex min-h-[50px] items-center gap-1.5 px-3 text-[15px] font-bold text-white underline-offset-4 hover:underline"
                >
                  Explore Programs & Fees ({programs.length})
                </a>
              </div>

              {/* 4 Hero Stat Cards */}
              <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[116px]">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold text-white/65 uppercase tracking-wider">
                    <Trophy size={14} className="text-lime shrink-0" />
                    Ranking Standing
                  </dt>
                  <dd className="mt-2">
                    <a href="#rankings" className="font-display text-[22px] font-black text-lime leading-tight block hover:underline">
                      {effectiveWorldRank
                        ? `#${String(effectiveWorldRank).replace(/^#/, '')} World`
                        : effectiveCountryRank
                        ? `#${String(effectiveCountryRank).replace(/^#/, '')} in ${university.country}`
                        : subjectRanking
                        ? `#${String(subjectRanking.rank).replace(/^#/, '')} Subject`
                        : 'Recognized'}
                    </a>
                    <span className="mt-1 block text-[11px] text-white/70">
                      {effectiveWorldRank && effectiveCountryRank
                        ? `${university.country} Rank #${String(effectiveCountryRank).replace(/^#/, '')}`
                        : effectiveWorldRank && worldRanking
                        ? `${worldRanking.publisher} (${worldRanking.year})`
                        : effectiveCountryRank && nationalRanking
                        ? `${nationalRanking.publisher} (${nationalRanking.year})`
                        : subjectRanking
                        ? `${subjectRanking.publisher} · ${subjectRanking.subject}`
                        : isMalaysia
                        ? 'MQA & MoHE Accredited'
                        : isChina
                        ? 'MoE China Recognized'
                        : 'Official Public/Private Status'}
                    </span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[116px]">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold text-white/65 uppercase tracking-wider">
                    <Wallet size={14} className="text-lime shrink-0" />
                    Annual Tuition
                  </dt>
                  <dd className="mt-2">
                    <a href="#programs" className="text-[15px] font-bold text-white leading-snug block line-clamp-2 hover:text-lime">
                      {cleanTuitionText}
                    </a>
                    <span className="mt-1 block text-[11px] text-white/65">Before scholarship deduction</span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[116px]">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold text-white/65 uppercase tracking-wider">
                    <Sparkles size={14} className="text-lime shrink-0" />
                    Scholarship Route
                  </dt>
                  <dd className="mt-2">
                    <a href="#scholarships" className="text-[15px] font-bold text-white leading-snug block line-clamp-2 hover:text-lime">
                      {cleanScholarshipTitle}
                    </a>
                    <span className="mt-1 block text-[11px] text-white/65">
                      {scholarshipOptions.length > 0 ? `${scholarshipOptions.length} documented award route(s)` : 'Merit & freshman waivers'}
                    </span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[116px]">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold text-white/65 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-lime shrink-0" />
                    EduExpress Fee
                  </dt>
                  <dd className="mt-2">
                    <span className="font-display text-[20px] font-black text-lime leading-tight block">
                      {isMalaysia ? 'BDT 0 (Free)' : 'BDT 0 Pre-Visa'}
                    </span>
                    <span className="mt-1 block text-[11px] text-white/65">
                      {isMalaysia ? 'Zero agency charge for Malaysia' : 'Payable only after visa stamp'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Sidebar Lead Form */}
            <div className="w-full">
              <UniversityEnquiryForm
                university={university}
                programs={programs}
                selectedProgramId={selectedId}
                onProgram={chooseProgram}
                scholarship={scholarshipScenario?.title}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Sub-Navigation Bar */}
      <nav aria-label="On this university page" className="sticky top-[76px] z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs xl:top-[112px]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 flex-1 overflow-x-auto no-scrollbar">
            {PANELS.map((item) => (
              <a
                key={item.id}
                href={'#' + item.id}
                onClick={() => setPanel(item.id)}
                aria-current={panel === item.id ? 'location' : undefined}
                className={
                  'inline-flex min-h-14 shrink-0 items-center border-b-2 px-4 text-sm font-bold first:pl-0 transition-colors ' +
                  (panel === item.id ? 'border-lime text-petrol-800' : 'border-transparent text-slate-500 hover:text-petrol-800')
                }
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={assessmentHref}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-lime px-4 text-[13px] font-bold text-petrol-800 hover:brightness-105"
          >
            Check Eligibility <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] space-y-9 px-5 pt-9 sm:px-8 lg:px-10 [&>section]:scroll-mt-[148px] xl:[&>section]:scroll-mt-[184px]">
        {/* 1. Overview & Student Snapshot Section */}
        <section {...panelProps('overview')} className={sheetClass}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Institutional Profile & Student Guide
              </span>
              <h2 className={titleClass}>About {university.name}</h2>
              <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-slate-700">
                {allOverviewParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* At-a-Glance Student Snapshot Table */}
              <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50">
                <div className="border-b border-slate-200 bg-slate-100/70 px-5 py-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-petrol-800">
                    {shortName} Key Facts for Bangladeshi Students
                  </h3>
                </div>
                <dl className="divide-y divide-slate-200/70 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">Official Name</dt>
                    <dd className="font-bold text-slate-900">{displayName}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">City & Country</dt>
                    <dd className="font-bold text-slate-900">{university.location || `${university.city}, ${university.country}`}</dd>
                  </div>
                  {(effectiveWorldRank || effectiveCountryRank || subjectRanking) && (
                    <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                      <dt className="font-semibold text-slate-500">Published Ranking</dt>
                      <dd className="font-bold text-petrol-800">
                        {[
                          effectiveWorldRank ? `World #${String(effectiveWorldRank).replace(/^#/, '')}${worldRanking?.publisher ? ` (${worldRanking.publisher})` : ''}` : null,
                          effectiveCountryRank ? `${university.country} #${String(effectiveCountryRank).replace(/^#/, '')}${nationalRanking?.publisher ? ` (${nationalRanking.publisher})` : ''}` : null,
                          !effectiveWorldRank && !effectiveCountryRank && subjectRanking ? `#${String(subjectRanking.rank).replace(/^#/, '')} in ${subjectRanking.subject} (${subjectRanking.publisher})` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </dd>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">Accreditation Status</dt>
                    <dd className="font-bold text-emerald-800">{recognitionLabel}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">Degrees & Majors</dt>
                    <dd className="font-semibold text-slate-800">
                      {availableLevels.map((l) => LEVEL_LABELS[l]).join(', ') || 'Undergraduate & Postgraduate'} ({programs.length} listed majors)
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">Teaching Medium</dt>
                    <dd className="font-semibold text-slate-800">{languages.join(' / ') || 'English'}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[200px_1fr]">
                    <dt className="font-semibold text-slate-500">EduExpress Service Fee</dt>
                    <dd className="font-bold text-emerald-800">
                      {isMalaysia
                        ? 'BDT 0 (100% Free Application & EMGS Visa Processing)'
                        : 'BDT 0 Before Visa (Service fee payable only after visa approval)'}
                    </dd>
                  </div>
                </dl>
              </div>

              {highlights.length > 0 && (
                <div className="mt-7 grid gap-3.5 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:bg-white hover:border-emerald-300"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                        {highlight.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar: Quick Action & Verification Card */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50/90 p-6 border border-slate-200/90">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                  Quick Admission Summary
                </h3>
                <dl className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campus City</dt>
                    <dd className="mt-0.5 font-bold text-slate-800">{university.city}, {university.country}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Intake Windows</dt>
                    <dd className="mt-0.5 font-bold text-slate-800">
                      {intakeMonths.join(', ') || (isChina ? 'September & March' : 'Multiple intakes')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Indicative Tuition</dt>
                    <dd className="mt-0.5 font-bold text-slate-800">{cleanTuitionText}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Statutory Recognition</dt>
                    <dd className="mt-0.5 font-bold text-emerald-800">{recognitionLabel}</dd>
                  </div>
                </dl>
                <a
                  href="#university-enquiry"
                  className="mt-5 w-full ed-btn ed-btn-signal min-h-[42px] text-xs font-bold"
                >
                  Get Free Eligibility Check <ArrowRight size={13} />
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 w-full ed-btn ed-btn-outline min-h-[40px] text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} /> Chat with Counselor
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Programs, Tuition & Complete Course Dossier Section */}
        <section {...panelProps('programs')} className={sheetClass}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Academic Catalog & Fee Breakdown
              </span>
              <h2 className={titleClass}>{shortName} Programs & Tuition Fees</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Click any program below to inspect its itemized tuition, dormitory cost, entry requirements, and required documents.
              </p>
            </div>
            <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[42px] px-5 text-xs font-bold">
              Apply for Admission <ArrowRight size={14} />
            </a>
          </div>

          {feePreviews.length > 0 && (
            <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {feePreviews.map((fee) => (
                <div key={fee.level} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-xs">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {LEVEL_LABELS[fee.level]} Indicative Tuition
                  </p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">{fee.amount}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{fee.period} · official gross tuition</p>
                </div>
              ))}
            </div>
          )}

          {programs.length > 0 ? (
            <div className="mt-6">
              <UniversityProgramTable
                programs={programs}
                selectedId={selected?.id}
                onChoose={(value) => {
                  chooseProgram(value);
                }}
              />
            </div>
          ) : (
            <div className="mt-6">
              <PlainList items={generalDetails.majors} empty="Request program catalog for this institution." />
            </div>
          )}

          {/* 360° Selected Program Complete Dossier */}
          {selected && (
            <div className="mt-8 rounded-2xl border-2 border-emerald-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    Selected Program Dossier
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{selected.name}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-600">
                    <span>
                      Degree Level: <strong className="text-slate-900">{selected.level}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Duration: <strong className="text-slate-900">{selected.duration || '4 years'}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Teaching Medium: <strong className="text-slate-900">{selected.languages.join(' / ') || 'English'}</strong>
                    </span>
                    {selected.intake && (
                      <>
                        <span>·</span>
                        <span>
                          Intake: <strong className="text-slate-900">{selected.intake}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[42px] px-5 text-xs font-bold">
                    Apply for {selected.name} <ArrowRight size={13} />
                  </a>
                  <button
                    type="button"
                    onClick={() => openPanel('documents')}
                    className="ed-btn ed-btn-outline min-h-[42px] px-4 text-xs font-bold"
                  >
                    Document Checklist ({selected.documents.length})
                  </button>
                </div>
              </div>

              {/* 3-Column Student Decision Grid: Campus Fees, Departure Costs, Entry & Scholarships */}
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {/* Col 1: Tuition & On-Campus Living */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-5">
                  <h4 className="border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-petrol-800 flex items-center gap-1.5">
                    <Wallet size={14} className="text-emerald-700 shrink-0" />
                    {isChina ? 'In China (Tuition & Hostel)' : `In ${university.country} (Tuition & Living)`}
                  </h4>
                  <dl className="mt-2 divide-y divide-slate-200/60 text-xs">
                    {selected.fees
                      .filter((fee) => fee.stage === 'in_china')
                      .map((fee, index) => (
                        <div key={`${fee.key}-${index}`} className="py-2.5 flex items-start justify-between gap-3">
                          <dt className="text-slate-700 font-medium">
                            {fee.item}
                            {fee.optional && <span className="block text-[10px] text-slate-400">Optional / if applicable</span>}
                          </dt>
                          <dd className="text-right font-bold tabular-nums text-petrol-800 shrink-0">{feeText(fee)}</dd>
                        </div>
                      ))}
                    {selected.fees.filter((fee) => fee.stage === 'in_china').length === 0 && (
                      <p className="py-3 text-xs text-slate-500">Refer to published tuition range above.</p>
                    )}
                  </dl>
                </div>

                {/* Col 2: Before Departure & Payment Rule */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-petrol-800 flex items-center gap-1.5">
                      <PlaneTakeoff size={14} className="text-emerald-700 shrink-0" />
                      Before Departure from Bangladesh
                    </h4>
                    <dl className="mt-2 divide-y divide-slate-200/60 text-xs">
                      {selected.fees
                        .filter((fee) => fee.stage === 'before_china')
                        .map((fee, index) => (
                          <div key={`${fee.key}-${index}`} className="py-2.5 flex items-start justify-between gap-3">
                            <dt className="text-slate-700 font-medium">
                              {fee.item}
                              {fee.optional && <span className="block text-[10px] text-slate-400">If required by university</span>}
                            </dt>
                            <dd className="text-right font-bold tabular-nums text-petrol-800 shrink-0">{feeText(fee)}</dd>
                          </div>
                        ))}
                      <div className="py-2.5 flex items-start justify-between gap-3">
                        <dt className="text-slate-700 font-medium">EduExpress Service Fee</dt>
                        <dd className="text-right font-bold text-emerald-800">
                          {isMalaysia ? 'BDT 0 (Free)' : 'BDT 0 Pre-Visa'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-4 rounded-lg bg-emerald-50/80 border border-emerald-200/70 p-3 text-[11px] leading-relaxed text-emerald-950">
                    {isMalaysia
                      ? 'Malaysia Policy: EduExpress service is 100% free (BDT 0). You only pay official university & EMGS fees.'
                      : 'China Policy: BDT 0 EduExpress service fee before visa approval. Service fee is payable only after your student visa is issued.'}
                  </div>
                </div>

                {/* Col 3: Entry Criteria & Scholarships for Selected Program */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-petrol-800 flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-emerald-700 shrink-0" />
                      Entry & Language Criteria
                    </h4>
                    <ul className="mt-3 space-y-2 text-xs text-slate-700">
                      {[...selected.qualifications.slice(0, 2), ...selected.languageRequirements.slice(0, 2)].map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-5">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                      {selected.qualifications.length === 0 && selected.languageRequirements.length === 0 && (
                        <li className="text-slate-500">Standard {selected.level} academic transcripts and language proficiency apply.</li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 border-t border-slate-200/80 pt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openPanel('scholarships')}
                      className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                    >
                      <Sparkles size={13} /> View Scholarships ({scholarshipOptions.length || university.scholarships.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => openPanel('admission')}
                      className="text-xs font-bold text-petrol-800 hover:underline inline-flex items-center gap-1"
                    >
                      Full Criteria <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selected && generalFeeTable}
        </section>

        {/* 3. Scholarships & Financial Aid Section */}
        <section {...panelProps('scholarships')} className={sheetClass}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Scholarships & Tuition Waivers
              </span>
              <h2 className={titleClass}>{shortName} Scholarships for Bangladeshi Students</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Compare documented scholarship routes, tuition waivers, coverage scope, and annual renewal rules.
              </p>
            </div>
            <a href="#university-enquiry" className="ed-btn ed-btn-outline min-h-[42px] px-5 text-xs font-bold">
              Check Scholarship Eligibility <ArrowRight size={14} />
            </a>
          </div>

          {scholarshipOptions.length > 0 ? (
            <div className="mt-6">
              <UniversityFundingTable options={scholarshipOptions} onChoose={estimateScholarship} />
            </div>
          ) : university.scholarships.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {university.scholarships.map((scholarship, index) => (
                <article
                  key={`${scholarship.title}-${index}`}
                  className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-6"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <Sparkles size={14} /> {scholarship.type || 'Scholarship Route'}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-petrol-800">{scholarship.title}</h3>
                  {scholarship.amount && (
                    <p className="mt-1.5 text-sm font-bold text-emerald-800">{scholarship.amount}</p>
                  )}
                  {scholarship.coverage && <p className="mt-2 text-xs text-slate-700">{scholarship.coverage}</p>}
                  <div className="mt-3">
                    <PlainList items={scholarship.details} />
                  </div>
                  {scholarship.condition && (
                    <p className="mt-3 text-xs text-slate-600">
                      <strong className="font-semibold text-slate-800">Eligibility: </strong>
                      {scholarship.condition}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
              <p className="text-sm leading-relaxed text-slate-700">
                Specific scholarship tiers for {shortName} depend on intake quota and your academic GPA. Submit your transcripts in the form above so our counselors can check available university, provincial, or merit waivers for your intake.
              </p>
            </div>
          )}

          {/* Student Guidance on Scholarships */}
          <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-petrol-800">
              How Scholarships Work for Bangladeshi Applicants
            </h3>
            <div className="mt-2.5 grid gap-4 text-xs leading-relaxed text-slate-600 sm:grid-cols-3">
              <div>
                <strong className="block text-slate-900">1. Merit & Quota Based</strong>
                Scholarship selection is decided by the university admissions committee based on your HSC/Bachelor GPA, language score, and early application timing.
              </div>
              <div>
                <strong className="block text-slate-900">2. Tuition vs. Living Costs</strong>
                A tuition waiver reduces your annual tuition fee. Always budget separately for dormitory, insurance, medical checkup, and personal living expenses unless explicitly covered.
              </div>
              <div>
                <strong className="block text-slate-900">3. Annual Review</strong>
                Multi-year scholarships typically require maintaining good attendance (90%+), passing all modules without backlog, and abiding by campus regulations.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Entry Requirements & Eligibility Section */}
        <section {...panelProps('admission')} className={sheetClass}>
          <div className="border-b border-slate-200 pb-5">
            <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
              Eligibility & Prerequisites
            </span>
            <h2 className={titleClass}>{shortName} Entry Requirements</h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Academic qualification standards and English / language proficiency requirements by study level.
            </p>
          </div>

          <div className="mt-6">
            <UniversityEntrySummary programs={programs} selectedId={selected?.id || ''} />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Not sure if your SSC / HSC or Bachelor GPA qualifies?</h3>
              <p className="mt-0.5 text-xs text-slate-600">
                Our Dhaka admissions team will evaluate your mark sheets against {shortName}’s current faculty requirements.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#documents" className="ed-btn ed-btn-outline min-h-[42px] px-5 text-xs font-bold">
                View Document Checklist <ArrowRight size={13} />
              </a>
              <a href={assessmentHref} className="ed-btn ed-btn-signal min-h-[42px] px-5 text-xs font-bold">
                Free GPA Assessment <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* 5. Required Documents Checklist Section */}
        <section {...panelProps('documents')} className={sheetClass}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Application Dossier Checklist
              </span>
              <h2 className={titleClass}>{shortName} Required Documents</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Complete list of documents required from Bangladeshi students by study level (Bachelor’s, Master’s, PhD).
              </p>
            </div>
            {availableLevels.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter document checklist by degree level">
                {availableLevels.map((lvl) => {
                  const isActive = activeDocLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedDocLevel(lvl)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-petrol-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      {LEVEL_LABELS[lvl]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6">
            {!programs.length && (
              <PlainList items={generalDetails.documents} empty="Request admission document checklist." />
            )}
            {programs.length > 0 && (
              <UniversityDocuments
                documents={activeLevelDocuments}
                programName={`${LEVEL_LABELS[activeDocLevel]} Programs`}
                applyHref={assessmentHref}
              />
            )}
          </div>
        </section>

        {/* 6. Step-by-Step Application & Visa Roadmap from Bangladesh */}
        <section aria-label="How to apply from Bangladesh" className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Step-by-Step Admission Roadmap
          </span>
          <h2 className={titleClass}>How to Apply to {shortName} from Bangladesh</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            A clear 4-step process managed with our Dhanmondi, Dhaka counseling office.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: 'Step 01',
                title: 'Free Eligibility & Major Check',
                desc: `Share your SSC, HSC, or Bachelor transcripts. We verify your GPA and language readiness for ${shortName} at zero cost.`,
              },
              {
                step: 'Step 02',
                title: 'Dossier Formatting & Submission',
                desc: 'We verify your passport, academic scans, medical form, and study plan, then submit to the official university portal.',
              },
              {
                step: 'Step 03',
                title: isChina ? 'Admission Notice & JW202' : 'Offer Letter & EMGS eVAL',
                desc: isChina
                  ? 'Receive your official Pre-Admission/Admission Notice and Ministry JW202/JW201 visa form for X1/X2 student visa.'
                  : 'Receive your official Offer Letter and track EMGS Visa Approval Letter (eVAL) progression online.',
              },
              {
                step: 'Step 04',
                title: 'Visa Stamp & Campus Arrival',
                desc: isChina
                  ? 'Submit your X1/X2 visa application in Dhaka. Pay EduExpress service fee only after your visa is approved, then fly to China.'
                  : 'Complete Single Entry Visa (SEV), fly to Malaysia, and complete post-arrival medical and i-KAD registration.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5">
                <span className="inline-block rounded-lg bg-petrol-800 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-lime">
                  {item.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Rankings & Accreditation Section */}
        <section {...panelProps('rankings')} className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Global Standing & Statutory Recognition
          </span>
          <h2 className={titleClass}>{shortName} Rankings & Accreditation</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Independent global university rankings, national standing, and government accreditation records.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              {rankings.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th scope="col" className="px-5 py-3.5">Ranking Publisher & Scope</th>
                        <th scope="col" className="px-5 py-3.5 text-right">Listed Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {rankings.map((ranking, index) => (
                        <tr key={`${ranking.publisher}-${index}`}>
                          <th scope="row" className="px-5 py-4 font-bold text-petrol-800">
                            {ranking.publisher}
                            <span className="mt-0.5 block text-xs font-normal text-slate-500">
                              {ranking.rankingName}
                              {ranking.subject ? ` · ${ranking.subject}` : ''}
                            </span>
                          </th>
                          <td className="px-5 py-4 text-right font-black text-petrol-800 tabular-nums text-lg">
                            #{String(ranking.rank).replace(/^#/, '')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-xl bg-lime/25 text-petrol-800 shrink-0">
                      <Trophy size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-petrol-800">
                        {effectiveWorldRank
                          ? `World Ranking: #${String(effectiveWorldRank).replace(/^#/, '')}`
                          : `${university.name} Institutional Standing`}
                      </h3>
                      {effectiveCountryRank && (
                        <p className="text-sm font-semibold text-emerald-800">
                          {university.country} National Rank: #{effectiveCountryRank}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-600">
                        Recognized by: {recognitionLabel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <ShieldCheck size={16} className="text-emerald-700" />
                Degree Recognition Advice
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-700">
                <strong>Accrediting Authority:</strong> {recognitionLabel}.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Always evaluate university rankings alongside specific department laboratories, English-medium faculty strength, and total 4-year tuition & living budget.
              </p>
              {university.recognitionSourceUrl && (
                <a
                  href={university.recognitionSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-petrol-800 hover:underline"
                >
                  Inspect Official Recognition Register <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 8. FAQs Section */}
        <section {...panelProps('questions')} className={sheetClass}>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Student & Parent Questions
          </span>
          <h2 className={titleClass}>{shortName}: Frequently Asked Questions</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Direct answers on tuition fees, English-medium study, scholarships, and applying from Bangladesh.
          </p>
          <div className="mt-6 space-y-3">
            {faq.map((item, idx) => (
              <details
                key={item.question}
                open={idx < 3}
                className="group rounded-2xl border border-slate-200/90 bg-slate-50/60 px-5 py-4 transition-colors open:bg-white open:border-emerald-300"
              >
                <summary className="cursor-pointer font-bold text-slate-900 text-[15px] hover:text-emerald-800 flex items-center justify-between gap-4">
                  <span>{item.question}</span>
                  <ChevronRight size={16} className="shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Destination-Aware Related Guides */}
        {isChina && (
          <section aria-label="Related China study guides" className={sheetClass}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Destination Resources</span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Explore China Study Guides for Bangladeshi Students</h2>
            <p className="mt-1 text-xs text-slate-500">Official policies, CNY & BDT cost breakdowns, and X1/X2 student visa guides.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ...(hasMedicalProgram ? [{ href: '/mbbs-in-china-bangladesh', label: 'MBBS in China Guide' }] : []),
                { href: '/study-in-china-from-bangladesh', label: 'Study in China Overview' },
                { href: '/bn/study-in-china-cost-bangladesh', label: 'খরচ ও স্কলারশিপ গাইড (বাংলা)' },
                { href: '/bn/china-student-visa-bangladesh', label: 'স্টুডেন্ট ভিসা গাইড (বাংলা)' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
                >
                  {link.label}
                  <ArrowRight size={14} className="shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {isMalaysia && (
          <section aria-label="Related Malaysia study guides" className={sheetClass}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Destination Resources</span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Explore Malaysia Study Guides</h2>
            <p className="mt-1 text-xs text-slate-500">Affordable UK/AU degree pathways in Southeast Asia with BDT 0 agency fee.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/study-in-malaysia-from-bangladesh"
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
              >
                Study in Malaysia Overview <ArrowRight size={14} className="shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/malaysia-study-cost-bangladesh"
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
              >
                Malaysia Study Cost Guide <ArrowRight size={14} className="shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/malaysia-student-visa-bangladesh"
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
              >
                EMGS Visa & i-KAD Guide <ArrowRight size={14} className="shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/universities?country=Malaysia"
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
              >
                All 9 Malaysia Universities <ArrowRight size={14} className="shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>
        )}

        {/* Global Conversion CTA */}
        <section className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-petrol-800 p-8 sm:p-10 text-white">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Next Steps</span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Ready to apply to {shortName}?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
              Submit your academic transcripts and career goals. Our counselors in Dhanmondi, Dhaka will evaluate your eligibility, scholarship options, and admission timeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[50px] px-7 text-sm">
              Check My Eligibility <ArrowRight size={16} />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-btn ed-btn-on-dark min-h-[50px] px-6 text-sm inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> WhatsApp Counselor
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useId, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Landmark,
  MapPin,
  MessageCircle,
  PhoneCall,
  PlaneTakeoff,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Wallet,
} from 'lucide-react';
import UpdateCard, { type UpdateCardData } from '@/components/updates/UpdateCard';
import { config } from '@/lib/config';
import { deadlineBadge, openByDeadline } from '@/lib/update-deadlines';
import type { CleanUniversityRecord } from '@/lib/university-records';
import type { UniversityRanking } from '@/lib/university-rankings';
import { feeText, normalizeProgramLevel, PROGRAM_LEVELS, type ProgramLevel } from '@/lib/university-profile-view';
import type { UniversityProgramDetail } from '@/types/university-profile';
import type { UniversityScholarshipOption } from '@/types/university-scholarship';
import { scholarshipMatchesProgram, scholarshipReductionLabel } from '@/lib/university-scholarship-view';
import UniversityEnquiryForm from './UniversityEnquiryForm';
import UniversityDocuments from './UniversityDocuments';
import { UniversityProgramTable, UniversityFundingTable, UniversityEntrySummary } from './UniversityGuideTables';
import UniversityScholarships from './UniversityScholarships';

const UniversityPrograms = dynamic(() => import('./UniversityPrograms'), {
  loading: () => <p className="py-5 text-sm text-slate-500">Loading program filters…</p>,
});

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
const selectClass = 'mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-800 outline-none focus:border-[#12436b] focus:ring-2 focus:ring-[#12436b]/10';
const sheetClass = 'rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/90';
const textAction = 'inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-[#12436b] hover:text-emerald-700 hover:underline';
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
  campusImage,
  intakeMonths = [],
  generalDetails,
  programs,
  hasDetailedPrograms,
  scholarshipOptions,
  rankings,
  servicePackages,
  news = [],
  now = 0,
}: Props) {
  const [panel, setPanel] = useState<Panel>('overview');
  const [level, setLevel] = useState<ProgramLevel>(programs[0] ? normalizeProgramLevel(programs[0].level) : 'Bachelor');
  const [selectedId, setSelectedId] = useState(programs[0]?.id || '');
  const [query, setQuery] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [scholarshipScenario, setScholarshipScenario] = useState<UniversityScholarshipOption | null>(null);
  const id = useId();
  const [costOpen, setCostOpen] = useState(false);
  const [costMounted, setCostMounted] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);

  const isMalaysia = (university.country || '').toLowerCase() === 'malaysia';
  const isChina = (university.country || '').toLowerCase() === 'china';
  const countryFlag = isMalaysia ? '🇲🇾' : isChina ? '🇨🇳' : '🎓';

  const selected = programs.find((program) => program.id === selectedId);
  const availableLevels = PROGRAM_LEVELS.filter((item) =>
    programs.some((program) => normalizeProgramLevel(program.level) === item)
  );
  const languages = [...new Set(programs.flatMap((program) => program.languages))];
  const hasMedicalProgram = programs.some((program) =>
    /\bMBBS\b|clinical medicine|ophthalmological and optometric medicine/i.test(program.name)
  );

  const worldRanking = rankings.find((ranking) => ranking.scope === 'world');
  const effectiveWorldRank = worldRanking?.rank || (university.rankings?.world ? String(university.rankings.world) : undefined);
  const effectiveCountryRank = university.rankings?.country ? String(university.rankings.country) : undefined;

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

  const programScholarships =
    selected?.scholarships || selected?.notes.filter((note) => /scholarship|\baward\b|stipend/i.test(note)) || [];
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

  const chooseLevel = (next: ProgramLevel) => {
    setLevel(next);
    setQuery('');
    setScholarshipScenario(null);
    setSelectedId(programs.find((program) => normalizeProgramLevel(program.level) === next)?.id || '');
  };

  const chooseProgram = (value: string) => {
    setSelectedId(value);
    setScholarshipScenario(null);
    const program = programs.find((item) => item.id === value);
    if (program) setLevel(normalizeProgramLevel(program.level));
  };

  const chooseScholarship = (option: UniversityScholarshipOption | null) => {
    setScholarshipScenario(option);
    if (!option) return;
    const program =
      selected && scholarshipMatchesProgram(option, selected)
        ? selected
        : programs.find((item) => scholarshipMatchesProgram(option, item));
    if (program) {
      setSelectedId(program.id);
      setLevel(normalizeProgramLevel(program.level));
    }
  };

  const estimateScholarship = (option: UniversityScholarshipOption) => {
    chooseScholarship(option);
    openPanel('programs');
  };

  const programSelect = (context: string) => (
    <label htmlFor={`${id}-${context}-program`} className="mb-6 block text-sm font-semibold text-slate-700">
      Choose a program to calculate:
      <select
        id={`${id}-${context}-program`}
        value={selectedId}
        onChange={(event) => chooseProgram(event.target.value)}
        className={selectClass}
      >
        <option value="" disabled>
          Select an academic program
        </option>
        {programs.map((program) => (
          <option key={program.id} value={program.id}>
            {LEVEL_LABELS[normalizeProgramLevel(program.level)]} · {program.name} ({program.languages.join(' / ')})
          </option>
        ))}
      </select>
    </label>
  );

  const programPicker = (context: string) =>
    programs.length > 0 &&
    (programs.length <= 12 || openPicker === context ? (
      programSelect(context)
    ) : (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs">
        <p className="min-w-0 text-slate-700">
          Selected program:{' '}
          <strong className="font-bold text-petrol-800">
            {selected ? `${LEVEL_LABELS[normalizeProgramLevel(selected.level)]} · ${selected.name}` : 'None selected'}
          </strong>
        </p>
        <button type="button" onClick={() => setOpenPicker(context)} className={textAction}>
          Change program <ChevronRight size={14} />
        </button>
      </div>
    ));

  const cleanGeneralTuition = /dated official fee|next-cycle|require confirmation|research below/i.test(generalDetails.tuition || '')
    ? 'Official fee per program'
    : generalDetails.tuition;

  const generalFeeTable = (
    <div className={sheetClass}>
      <h3 className="text-lg font-bold text-slate-900">Itemized Fee Schedule</h3>
      <p className="mt-1 text-xs text-slate-500">Official university and third-party fee breakdown.</p>
      <dl className="mt-5 divide-y divide-slate-100">
        {[
          ...(cleanGeneralTuition ? [{ item: 'Tuition Range', cost: cleanGeneralTuition, notes: undefined }] : []),
          ...generalDetails.fees,
        ].map((fee, index) => (
          <div key={`${fee.item}-${index}`} className="py-3.5 flex items-start justify-between gap-5 text-xs">
            <dt className="font-medium text-slate-700">{fee.item}</dt>
            <dd className="text-right font-bold tabular-nums text-slate-900">{fee.cost}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  const noSelection = <p className={mutedClass}>Choose a listed program above to view exact requirements.</p>;
  const panelProps = (name: Panel) => ({ id: name, 'aria-label': PANELS.find((item) => item.id === name)?.label });
  const tuitionHighlight = selected?.fees.find((fee) => fee.key === 'tuition' && !fee.optional);
  const rawTuitionText = university.tuition || generalDetails.tuition || (tuitionHighlight ? feeText(tuitionHighlight) : 'Itemized below');
  const cleanTuitionText = /dated official fee|next-cycle|require confirmation|research below/i.test(rawTuitionText)
    ? 'View program fee schedule'
    : rawTuitionText;

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

  const nextDeadline = openByDeadline(news, now)[0];
  const nextBadge = nextDeadline ? deadlineBadge(nextDeadline.deadlineAt, now) : null;
  const waHref = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Assalamu alaikum. I am interested in ${university.name} in ${university.country}. Please check my eligibility.`
  )}`;

  const heroChips = [
    ...(availableLevels.length ? availableLevels.map((item) => LEVEL_LABELS[item]) : generalDetails.degrees),
    ...languages.map((item) => `${item}-taught`),
  ].slice(0, 6);

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
            <span className="text-white/80">{university.country}</span>
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
                  <p className="mt-1.5 flex items-center gap-1.5 text-[15px] font-semibold text-white/80">
                    <MapPin size={16} className="text-lime" aria-hidden="true" />
                    {university.location || `${university.city}, ${university.country}`}
                  </p>
                </div>
              </div>

              {/* Title & Badges */}
              <h1 className="mt-6 font-display text-[36px] font-black leading-tight sm:text-[48px] lg:text-[54px] text-white">
                {displayName}
              </h1>

              {/* Verified Badges */}
              {university.badges && university.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {university.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 rounded-full bg-lime/20 border border-lime/30 px-3.5 py-1 text-[13px] font-bold text-lime"
                    >
                      ★ {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Accreditation / Recognition Callout */}
              {university.recognitionAuthority && (
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm text-[14px] text-white/90 border border-white/15">
                  <ShieldCheck size={18} className="text-lime shrink-0" />
                  <span>
                    <strong>Accreditation:</strong> {university.recognitionAuthority}
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
              )}

              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/85">
                {overview.split(/\n\s*\n/)[0]}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                  Check My Eligibility <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-btn ed-btn-on-dark min-h-[52px] px-7 inline-flex items-center gap-2"
                >
                  <MessageCircle size={17} /> Ask on WhatsApp
                </a>
                <a
                  href="#programs"
                  className="inline-flex min-h-[52px] items-center gap-1.5 px-3 text-[15px] font-bold text-white underline-offset-4 hover:underline"
                >
                  View Programs ({programs.length})
                </a>
              </div>

              {/* 4 Hero Stat Cards */}
              <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15">
                  <dt className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 uppercase tracking-wide">
                    <Trophy size={14} className="text-lime" />
                    Ranking Standing
                  </dt>
                  <dd className="mt-2">
                    <a href="#rankings" className="font-display text-[26px] font-black text-lime leading-tight block">
                      {effectiveWorldRank ? `#${effectiveWorldRank}` : 'Top Accredited'}
                    </a>
                    <span className="mt-1 block text-[12px] text-white/70">
                      {effectiveCountryRank ? `${university.country} Rank #${effectiveCountryRank}` : 'MQA / MoHE recognized'}
                    </span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[118px]">
                  <dt className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 uppercase tracking-wide">
                    <Wallet size={14} className="text-lime shrink-0" />
                    Tuition Range
                  </dt>
                  <dd className="mt-2">
                    <a href="#programs" className="text-[14px] font-bold text-white leading-snug block line-clamp-2 hover:text-lime">
                      {cleanTuitionText}
                    </a>
                    <span className="mt-1 block text-[11px] text-white/60">Official gross tuition</span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[118px]">
                  <dt className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 uppercase tracking-wide">
                    <Sparkles size={14} className="text-lime shrink-0" />
                    Scholarship Award
                  </dt>
                  <dd className="mt-2">
                    <a href="#scholarships" className="text-[14px] font-bold text-white leading-snug block line-clamp-2 hover:text-lime">
                      {cleanScholarshipTitle}
                    </a>
                    <span className="mt-1 block text-[11px] text-white/60">Competitive merit discount</span>
                  </dd>
                </div>

                <div className="flex flex-col justify-between rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15 min-h-[118px]">
                  <dt className="flex items-center gap-1.5 text-[12px] font-medium text-white/65 uppercase tracking-wide">
                    <ShieldCheck size={14} className="text-lime shrink-0" />
                    EduExpress Fee
                  </dt>
                  <dd className="mt-2">
                    <span className="font-display text-[22px] font-black text-lime leading-tight block">
                      {isMalaysia ? 'BDT 0' : 'BDT 0 Before Visa'}
                    </span>
                    <span className="mt-1 block text-[11px] text-white/60">
                      {isMalaysia ? 'Free service for Malaysia' : 'Payable after visa approval'}
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

      {/* Sticky Tab Bar */}
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
        {/* Overview Section */}
        <section {...panelProps('overview')} className={sheetClass}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Institutional Profile
              </span>
              <h2 className={titleClass}>About {university.name}</h2>
              <div className="mt-4 space-y-3.5 text-[15px] leading-relaxed text-slate-700">
                {overview
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>

              {highlights.length > 0 && (
                <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
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

            {/* Quick Fact Card */}
            <div className="rounded-2xl bg-slate-50/80 p-6 border border-slate-200/80 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                Quick Facts & Verification
              </h3>
              <dl className="mt-4 space-y-3.5 text-xs">
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</dt>
                  <dd className="mt-0.5 font-bold text-slate-800">{university.city}, {university.country}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Intake Months</dt>
                  <dd className="mt-0.5 font-bold text-slate-800">{intakeMonths.join(', ') || 'Multiple year-round'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instruction Language</dt>
                  <dd className="mt-0.5 font-bold text-slate-800">{languages.join(' / ') || 'English'}</dd>
                </div>
                {university.recognitionAuthority && (
                  <div>
                    <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accreditation Body</dt>
                    <dd className="mt-0.5 font-bold text-emerald-800">{university.recognitionAuthority}</dd>
                  </div>
                )}
                {university.officialUrl && (
                  <div className="pt-2 border-t border-slate-200">
                    <a
                      href={university.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-petrol-800 hover:text-emerald-700 text-xs"
                    >
                      Official University Portal <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </dl>
              <a
                href="#university-enquiry"
                className="mt-5 w-full ed-btn ed-btn-outline min-h-[42px] text-xs font-bold"
              >
                Request Admission Guide
              </a>
            </div>
          </div>
        </section>

        {/* Programs & Fees Section */}
        <section {...panelProps('programs')} className={sheetClass}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
                Academic Catalog & Fees
              </span>
              <h2 className={titleClass}>{shortName} Programs, Tuition & Costs</h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Explore degree majors, standard durations, medium of instruction, and itemized annual tuition.
              </p>
            </div>
            <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[42px] px-5 text-xs font-bold">
              Check Admission Eligibility <ArrowRight size={14} />
            </a>
          </div>

          {feePreviews.length > 0 && (
            <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {feePreviews.map((fee) => (
                <div key={fee.level} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4.5 shadow-xs">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{LEVEL_LABELS[fee.level]} Indicative Tuition</p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">{fee.amount}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{fee.period} · gross published fee</p>
                </div>
              ))}
            </div>
          )}

          {programs.length > 0 ? (
            <div className="mt-6">
              <UniversityProgramTable
                programs={programs}
                onChoose={(value) => {
                  chooseProgram(value);
                }}
              />

              <details
                open={filtersOpen}
                onToggle={(event) => {
                  setFiltersOpen(event.currentTarget.open);
                  if (event.currentTarget.open) setFiltersMounted(true);
                }}
                className="mt-6 rounded-2xl border border-slate-200 p-5 bg-slate-50/70"
              >
                <summary className="cursor-pointer text-sm font-bold text-petrol-800">
                  Filter programs by degree level, subject, and medium of instruction
                </summary>
                {(filtersOpen || filtersMounted) && (
                  <UniversityPrograms
                    name={university.name}
                    programs={programs}
                    level={level}
                    query={query}
                    selectedId={selectedId}
                    onLevel={chooseLevel}
                    onQuery={setQuery}
                    onProgram={(value) => {
                      chooseProgram(value);
                    }}
                  />
                )}
              </details>
            </div>
          ) : (
            <div className="mt-6">
              <PlainList items={generalDetails.majors} empty="Request program catalog for this institution." />
            </div>
          )}

          {/* Selected Program Detailed Fee & Living Breakdown */}
          {selected && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    Selected Program Details
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">{selected.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 font-medium flex flex-wrap items-center gap-2">
                    <span>Degree: <strong>{selected.level}</strong></span>
                    <span>·</span>
                    <span>Duration: <strong>{selected.duration || 'Standard'}</strong></span>
                    <span>·</span>
                    <span>Language: <strong>{selected.languages.join(' / ') || 'English'}</strong></span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[40px] px-5 text-xs font-bold">
                    Apply for this Major <ArrowRight size={13} />
                  </a>
                  <button type="button" onClick={() => openPanel('documents')} className="ed-btn ed-btn-outline min-h-[40px] px-4 text-xs font-bold">
                    Required Documents
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-petrol-800">
                  Itemized Costs & Living Breakdown
                </h4>
                <div className="mt-3.5 grid gap-6 lg:grid-cols-2">
                  {(['before_china', 'in_china'] as const).map((stage) => {
                    const stageHeading =
                      stage === 'before_china'
                        ? isChina
                          ? 'Before Departure (Application & Visa)'
                          : 'Before Departure'
                        : isChina
                        ? 'In China (Direct to Campus)'
                        : `In ${university.country} (Direct to Campus)`;
                    return (
                      <div key={stage} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5">
                        <h5 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-wider text-petrol-800">
                          {stageHeading}
                        </h5>
                        <dl className="mt-2 divide-y divide-slate-200/60 text-xs">
                          {selected.fees
                            .filter((fee) => fee.stage === stage)
                            .map((fee, index) => (
                              <div key={`${fee.key}-${index}`} className="py-2.5 flex items-start justify-between gap-4">
                                <dt className="text-slate-700 font-medium">
                                  {fee.item}
                                  {fee.optional && <span className="mt-0.5 block text-[11px] text-slate-400">If applicable</span>}
                                </dt>
                                <dd className="text-right font-bold tabular-nums text-petrol-800">{feeText(fee)}</dd>
                              </div>
                            ))}
                          {selected.fees.filter((fee) => fee.stage === stage).length === 0 && (
                            <p className="py-3 text-xs text-slate-500">No extra fee items listed for this stage.</p>
                          )}
                        </dl>
                        {stage === 'before_china' && (
                          <p className="mt-3.5 border-t border-slate-200/70 pt-3 text-[11px] leading-relaxed text-slate-500">
                            {isMalaysia
                              ? 'For Malaysia, EduExpress service fee is BDT 0. No agency charge is required.'
                              : 'EduExpress service charge is payable only after your visa is successfully issued.'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!selected && generalFeeTable}
        </section>

        {/* Scholarships Section */}
        <section {...panelProps('scholarships')} className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Funding Opportunities
          </span>
          <h2 className={titleClass}>{shortName} Scholarships</h2>
          {scholarshipOptions.length > 0 ? (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Compare coverage, tuition reductions, eligibility, and renewal conditions for each available scholarship.
              </p>
              <div className="mt-6">
                <UniversityFundingTable options={scholarshipOptions} onChoose={estimateScholarship} />
              </div>
              <details className="mt-6 rounded-2xl border border-slate-200 p-5 bg-slate-50/70">
                <summary className="cursor-pointer text-sm font-bold text-petrol-800">
                  Scholarship eligibility criteria, renewal rules & application documents
                </summary>
                <div className="mt-4">
                  <UniversityScholarships
                    options={scholarshipOptions}
                    programs={programs}
                    onEstimate={estimateScholarship}
                    onDocuments={() => openPanel('documents')}
                  />
                </div>
              </details>
            </>
          ) : university.scholarships.length > 0 ? (
            <div className="mt-6 divide-y divide-rule">
              {university.scholarships.map((scholarship, index) => (
                <article key={`${scholarship.title}-${index}`} className="py-6 first:pt-0">
                  <h3 className="text-lg font-bold text-petrol-800">{scholarship.title}</h3>
                  {scholarship.amount && (
                    <p className="mt-2 text-base font-bold text-emerald-800">{scholarship.amount}</p>
                  )}
                  {scholarship.coverage && <p className="mt-2 text-sm text-slate-600">{scholarship.coverage}</p>}
                  <div className="mt-4">
                    <PlainList items={scholarship.details} />
                  </div>
                  {scholarship.condition && (
                    <p className="mt-3 text-xs text-slate-500">
                      <strong className="font-semibold text-slate-700">Eligibility: </strong>
                      {scholarship.condition}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className={`mt-5 ${mutedClass}`}>
              A scholarship amount has not been confirmed for this specific program. Budget with full tuition until a written award is confirmed.
            </p>
          )}
        </section>

        {/* Admission Requirements Section */}
        <section {...panelProps('admission')} className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Eligibility & Prerequisites
          </span>
          <h2 className={titleClass}>{shortName} Admission Requirements</h2>
          <p className="mt-2 text-sm text-slate-600">
            Compare academic minimum qualifications and language proficiency standards for your program.
          </p>

          <div className="mt-6">
            <UniversityEntrySummary programs={programs} selectedId={selectedId} />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#documents" className="ed-btn ed-btn-outline min-h-[46px] px-6 text-xs font-bold">
              Check Required Documents <ArrowRight size={14} />
            </a>
            <a href={assessmentHref} className={applyClass}>
              Apply with EduExpress International <ArrowRight size={15} />
            </a>
          </div>
        </section>

        {/* Documents Required Section */}
        <section {...panelProps('documents')} className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Application Checklist
          </span>
          <h2 className={titleClass}>{shortName} Documents Required</h2>
          <p className="mt-2 text-sm text-slate-600">
            Organize and prepare your official application dossier before submission.
          </p>

          <div className="mt-6">
            {programPicker('documents')}
            {!programs.length && (
              <PlainList items={generalDetails.documents} empty="Request admission document checklist." />
            )}
            {selected ? (
              <UniversityDocuments documents={selected.documents} programName={selected.name} applyHref={assessmentHref} />
            ) : (
              noSelection
            )}
          </div>
        </section>

        {/* Rankings & Accreditation Section */}
        <section {...panelProps('rankings')} className={sheetClass}>
          <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-800">
            Rankings & Recognition
          </span>
          <h2 className={titleClass}>{shortName} Rankings & Accreditation</h2>
          <p className="mt-2 text-sm text-slate-600">
            Independent global standing, national rankings, and statutory accreditation status.
          </p>

          <div className="mt-6">
            {rankings.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-rule text-xs font-bold text-slate-500 uppercase">
                    <th scope="col" className="pb-3 pr-4">Ranking & Scope</th>
                    <th scope="col" className="pb-3 text-right">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {rankings.map((ranking, index) => (
                    <tr key={`${ranking.publisher}-${index}`}>
                      <th scope="row" className="py-4 pr-5 font-bold text-petrol-800">
                        {ranking.publisher}
                        <span className="mt-0.5 block text-xs font-normal text-slate-500">
                          {ranking.rankingName}
                          {ranking.subject ? ` · ${ranking.subject}` : ''}
                        </span>
                      </th>
                      <td className="py-4 text-right font-black text-petrol-800 tabular-nums text-lg">
                        {ranking.rank}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <div className="flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-xl bg-lime/25 text-petrol-800 shrink-0">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-petrol-800">
                      {effectiveWorldRank ? `QS World Ranking: #${effectiveWorldRank}` : `${university.name} Recognition Standing`}
                    </h3>
                    {effectiveCountryRank && (
                      <p className="text-sm font-semibold text-emerald-800">
                        {university.country} Rank: #{effectiveCountryRank}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-600">
                      Accredited by: {university.recognitionAuthority || 'National Higher Education Authority'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <section {...panelProps('questions')} className={sheetClass}>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Frequently Asked Questions
          </span>
          <h2 className={titleClass}>{shortName}: Common Questions</h2>
          <div className="mt-6 divide-y divide-slate-100">
            {faq.map((item) => (
              <details key={item.question} className="py-4">
                <summary className="cursor-pointer font-bold text-slate-900 text-[15px] hover:text-emerald-800">
                  {item.question}
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Destination-Aware Related Guides */}
        {isChina && (
          <section aria-label="Related China study guides" className={sheetClass}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Destination Resources</span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Explore China Study Guides</h2>
            <p className="mt-1 text-xs text-slate-500">Official policies, cost sheets, and visa guidance for Bangladeshi families.</p>
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
                Malaysia Cost & Student File <ArrowRight size={14} className="shrink-0 text-slate-400" />
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
              Submit your academic transcripts and career goals. Our counselors will evaluate your eligibility and assist with direct institutional application.
            </p>
          </div>
          <a href="#university-enquiry" className="ed-btn ed-btn-signal min-h-[52px] px-8 text-sm">
            Check My Eligibility <ArrowRight size={16} />
          </a>
        </section>
      </div>
    </article>
  );
}

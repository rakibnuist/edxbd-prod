import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CalendarClock,
  Check,
  ClipboardCheck,
  Coins,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Languages,
  MapPin,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stamp,
  UserRoundCheck,
  WalletCards,
  CheckCircle2,
  ChevronRight,
  Info,
  Menu,
  FileText
} from 'lucide-react';

import type { CleanUniversityRecord } from '@/lib/university-records';
import { getIntakeStatus } from '@/lib/intake-status';
import CostCalculator from './CostCalculator';

type Props = { university: CleanUniversityRecord };

const relationshipLabels: Record<CleanUniversityRecord['relationshipType'], string> = {
  direct_partner: 'Direct relationship record',
  authorized_representative: 'Authorized representative record',
  network_access: 'Network access record',
  public_direct_application: 'Public direct application route',
  unverified: 'Relationship route confirmed before application',
};

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(value))
  : 'Confirmed during program review';

const externalUrls = (values: Array<string | undefined>) => Array.from(new Set(values.filter((value): value is string => Boolean(value && /^https:\/\//i.test(value)))));
const comparable = (value?: string) => (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

function SectionHeading({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) {
  return (
    <div className="mb-10 flex flex-col items-center text-center gap-3">
      {subtitle && <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">{subtitle}</span>}
      {Icon && <div className="grid size-12 place-items-center rounded-2xl bg-[#e9f7fd] text-[#174f7a] mb-2"><Icon size={24} strokeWidth={2} /></div>}
      <h2 className="font-serif text-3xl font-bold tracking-tight text-[#08263c] sm:text-4xl">{title}</h2>
      <div className="h-1 w-12 bg-[#64b5df] mt-2 rounded-full" />
    </div>
  );
}

function DataStatus({ verified }: { verified: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ring-1 ring-inset ${verified ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
      {verified ? <BadgeCheck size={14} className="text-emerald-500" /> : <SearchCheck size={14} className="text-amber-500" />}
      {verified ? 'Verified Source' : 'Review Required'}
    </span>
  );
}

export default function UniversityProfile({ university }: Props) {
  const isChina = university.country.toLowerCase() === 'china';
  const isMedical = university.degree.some(value => /mbbs|medicine/i.test(value))
    || university.details.majors.some(value => /mbbs|clinical medicine|dental|nursing/i.test(value));
  const isVerified = university.verificationStatus === 'verified' && university.sourceUrls.length > 0;
  const sourceLinks = externalUrls([
    university.officialUrl,
    university.recognitionSourceUrl,
    university.relationshipEvidenceUrl,
    ...university.sourceUrls,
  ]);
  const intakeStatus = getIntakeStatus({ verifiedUntil: university.verificationExpiresAt });
  const intakeStatusLabel = intakeStatus === 'Under Verification' ? 'Date check before application' : intakeStatus;
  const assessmentHref = isChina
    ? `/study-in-china-from-bangladesh?university=${encodeURIComponent(university.slug)}#china-fit-form`
    : `/contact?university=${encodeURIComponent(university.slug)}`;
  const location = [university.city, university.country].filter(Boolean).join(', ');
  const programs: CleanUniversityRecord['programs'] = university.programs.length ? university.programs : university.details.majors.map(name => ({
    level: university.degree[0] || 'Bachelor', name, languages: university.taught, intakes: university.intake,
    eligibility: [] as string[], status: 'active' as const, tuition: university.details.tuition,
  }));
  const groupedPrograms = programs.reduce<Record<string, typeof programs>>((groups, program) => {
    (groups[program.level] ||= []).push(program);
    return groups;
  }, {});
  const studyLevels = Array.from(new Set(programs.map(program => program.level))).join(', ') || university.degree.join(', ') || 'Flexible study options';
  const languages = Array.from(new Set(programs.flatMap(program => program.languages))).join(', ') || university.taught.join(', ') || 'Multiple teaching options';
  const intake = university.intake.length ? university.intake.join(', ') : university.deadlines.startDate;

  const additionalFees = university.fees.filter(fee => !/^tuition\s*(fee)?$/i.test(fee.item.trim()));

  return (
    <article className="bg-[#fcfdfd] min-h-screen text-slate-900 pb-32">
      
      {/* EDITORIAL HERO */}
      <header className="relative isolate pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-[#050b14] text-white print:hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(23,79,122,0.4),transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-20 bg-[radial-gradient(circle,rgba(100,181,223,0.8),transparent_70%)] blur-3xl" />
        
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            <nav className="mb-10 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/universities" className="hover:text-white transition-colors">Universities</Link>
              <ChevronRight size={12} />
              <span aria-current="page" className="text-[#64b5df]">{university.name}</span>
            </nav>

            <div className="mb-6 flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.15em] bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-xl">
                Bangladesh's Evidence-First Education Consultancy
              </span>
              <DataStatus verified={isVerified} />
            </div>

            {university.logo && (
              <div className="mb-10 rounded-3xl bg-white/5 p-6 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="bg-white rounded-2xl p-4">
                  <Image src={university.logo} alt={`${university.name} logo`} width={120} height={120} unoptimized className="object-contain" />
                </div>
              </div>
            )}

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[1.1] tracking-tight max-w-5xl text-balance">
              Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64b5df] to-teal-300">{university.name}</span>
            </h1>
            
            <p className="mt-8 flex items-center justify-center gap-2 text-xl font-medium text-slate-300 bg-white/5 py-2 px-6 rounded-full border border-white/10 backdrop-blur-md">
              <MapPin size={20} className="text-[#64b5df]" /> {university.location || location}
            </p>

            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-300 text-balance">
              Explore accredited programs, clear costs, scholarships, and admission readiness for students from Bangladesh.
            </p>

            {university.lastVerifiedAt && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                <span>Last verified: {formatDate(university.lastVerifiedAt)}</span>
                {university.verificationExpiresAt && (
                  <>
                    <span aria-hidden>•</span>
                    <span>Next review: {formatDate(university.verificationExpiresAt)}</span>
                  </>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400" size={18} /> Better Education</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400" size={18} /> Clear Costs</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-400" size={18} /> Written Proof</span>
            </div>
          </div>
        </div>
      </header>

      {/* STICKY BROCHURE NAVIGATION */}
      <div className="sticky top-[68px] min-[1200px]:top-[92px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm hidden md:block print:hidden">
        <div className="mx-auto max-w-[1200px] px-6">
          <ul className="flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide py-4">
            {['Overview', 'Programs', 'Costs', 'Scholarships', 'Admission'].map(item => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="hover:text-[#174f7a] transition-colors focus:outline-none">{item}</a>
              </li>
            ))}
            <li className="ml-auto">
              <Link href={assessmentHref} className="inline-flex items-center gap-2 rounded-full bg-[#174f7a] px-5 py-2 text-white hover:bg-[#08263c] transition-colors">
                Apply Now <ArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <main className="mx-auto max-w-[1000px] px-5 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* OVERVIEW (At a Glance) */}
        <section id="overview" className="scroll-mt-32 print:hidden">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [GraduationCap, 'Study Level', studyLevels],
              [Languages, 'Teaching', languages],
              [CalendarClock, 'Next Intake', intake],
              [WalletCards, 'Tuition', university.details.tuition],
            ].map(([Icon, label, value], i) => (
              <div key={String(label)} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="grid size-12 place-items-center rounded-full bg-[#f4f8fb] text-[#174f7a] mb-4">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{String(label)}</p>
                <p className="mt-2 text-sm font-bold text-[#08263c]">{String(value)}</p>
              </div>
            ))}
          </div>

          {isMedical && (
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-6">
              <Scale className="mt-1 shrink-0 text-rose-600" size={24} />
              <div>
                <strong className="block font-heading text-lg text-rose-900">Medical Recognition & Licensing</strong>
                <p className="mt-2 text-sm leading-relaxed text-rose-800">
                  This institution is reviewed for medical council recognition, clinical hours, and internship pathways suitable for students returning to practice in Bangladesh.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* PROGRAMS SECTION */}
        <section id="programs" className="scroll-mt-32 print:hidden">
          <SectionHeading title="Academic Programs" subtitle="Curriculum & Tuition" icon={BookOpenCheck} />
          
          <div className="space-y-12">
            {Object.entries(groupedPrograms).map(([level, levelPrograms]) => (
              <div key={level}>
                <h3 className="font-serif text-2xl font-bold text-[#08263c] mb-6 border-b border-slate-200 pb-2">{level} Degree Options</h3>
                
                <div className="grid gap-4">
                  {levelPrograms.map((program, idx) => (
                    <div key={idx} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#174f7a]/30 transition-all">
                      <div className="pr-6">
                        <h4 className="font-heading text-lg font-bold text-[#08263c]">{program.name}</h4>
                        {program.subject && <p className="text-xs font-medium uppercase tracking-wider text-[#174f7a] mt-1">{program.subject}</p>}
                        
                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5"><Languages size={14} className="text-slate-400" /> {program.languages.join(', ') || languages}</span>
                          <span className="flex items-center gap-1.5"><CalendarClock size={14} className="text-slate-400" /> {program.applicationDeadline || university.deadlines.application}</span>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 shrink-0 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                        <p className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-400">Est. Tuition</p>
                        <p className="mt-1 font-serif text-xl font-bold text-[#08263c]">{program.tuition || university.details.tuition}</p>
                        {program.tuitionAfterScholarship && (
                          <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                            After Scholarship: {program.tuitionAfterScholarship}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* SCHOLARSHIPS */}
        <section id="scholarships" className="scroll-mt-32 print:hidden">
          <SectionHeading title="Scholarships & Aid" subtitle="Financial Support" icon={Award} />
          
          {university.scholarships.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {university.scholarships.map((scholarship, index) => (
                <div key={index} className="group relative rounded-[2rem] bg-[#050b14] p-[1px] shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden">
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-[#174f7a] to-amber-200 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative h-full bg-[#050b14]/95 backdrop-blur-2xl rounded-[calc(2rem-1px)] p-8 overflow-hidden flex flex-col justify-between">
                    {/* Large glowing background orb */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-colors duration-500" />
                    
                    <div className="relative z-10 mb-8">
                      <div className="flex justify-between items-start mb-8">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                          <Award size={14} /> {scholarship.type || 'Grant'}
                        </span>
                        <div className="text-white/10 group-hover:text-amber-400/40 transition-colors duration-500 rotate-12 group-hover:rotate-0">
                          <Award size={48} />
                        </div>
                      </div>
                      
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3 text-balance leading-tight">{scholarship.title}</h3>
                      {scholarship.amount && (
                        <p className="font-mono text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-sm">
                          {scholarship.amount}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative z-10 space-y-4 pt-6 border-t border-white/10 mt-auto">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Coverage</span>
                        <span className="text-sm font-medium text-white text-right">{scholarship.coverage || 'Varies'}</span>
                      </div>
                      {scholarship.renewal && (
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Renewal</span>
                          <span className="text-sm font-medium text-white text-right text-balance">{scholarship.renewal}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Deadline</span>
                        <span className="text-sm font-medium text-amber-400 text-right">{scholarship.deadline || 'Aligned to intake'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="group relative rounded-[2rem] bg-[#050b14] p-[1px] shadow-2xl overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#64b5df] via-[#174f7a] to-teal-400 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#050b14]/95 backdrop-blur-2xl rounded-[calc(2rem-1px)] p-12 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#64b5df]/10 rounded-full blur-3xl group-hover:bg-[#64b5df]/20 transition-colors duration-500" />
                <Sparkles size={48} className="mx-auto text-[#64b5df] mb-6 relative z-10" />
                <h3 className="font-serif text-2xl font-bold text-white mb-3 relative z-10">Dynamic Profile Matching</h3>
                <p className="text-slate-400 font-medium max-w-lg mx-auto relative z-10">Scholarships are matched dynamically based on your academic profile, English proficiency, and timing during the fit assessment.</p>
              </div>
            </div>
          )}
        </section>

        {/* ADMISSIONS */}
        <section id="admission" className="scroll-mt-32 print:hidden">
          <SectionHeading title="Admission Guide" subtitle="Application Process" icon={ClipboardCheck} />
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-[#08263c] text-white p-8">
              <h3 className="font-serif text-2xl font-bold mb-6">Key Dates</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#64b5df]">University Deadline</p>
                  <p className="mt-1 text-2xl font-bold">{university.deadlines.application} <span className="text-sm font-normal text-slate-300 block mt-1">(Depends on Seats)</span></p>
                </div>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#64b5df]">Next Intake Action</p>
                  <p className="mt-1 text-lg font-bold text-white/90">{intakeStatusLabel}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="font-serif text-2xl font-bold mb-6 text-[#08263c]">Required Documents</h3>
              <ul className="space-y-3">
                {university.documents.length ? university.documents.map(item => (
                  <li key={item} className="flex gap-3 text-sm text-slate-700">
                    <FileCheck2 size={18} className="shrink-0 text-[#174f7a]" /> <span>{item}</span>
                  </li>
                )) : (
                  <li className="text-sm text-slate-500">Tailored checklist provided after assessment.</li>
                )}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Verified Sources</p>
                <div className="space-y-2">
                  {sourceLinks.map((url, i) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-xs font-bold text-slate-500 hover:text-[#174f7a] transition-colors bg-slate-50 p-2 rounded">
                      <span className="truncate max-w-[200px]">Source {i + 1}: {new URL(url).hostname}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-YEAR COSTING CALCULATION (MOVED TO BOTTOM) */}
        <section id="costs" className="scroll-mt-32">
          <div className="print:hidden">
            <SectionHeading title="4-Year Investment Plan" subtitle="Comprehensive Costing" icon={WalletCards} />
          </div>
          
          <CostCalculator 
            isChina={isChina} 
            defaultTuition={parseInt(university.details.tuition.replace(/\D/g, ''), 10) || (isChina ? 25000 : 5000)}
            universityName={university.name}
            studyLevel={studyLevels}
            teaching={languages}
            programs={programs}
            scholarships={university.scholarships}
            documents={university.documents}
          />
            
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6 print:hidden">
            <h4 className="text-sm font-bold text-[#08263c] mb-4 uppercase tracking-wider">Other Disclosed University Fees</h4>
            {additionalFees.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {additionalFees.map((fee, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div>
                      <strong className="text-slate-900 font-heading">{fee.item}</strong>
                      <p className="text-xs text-slate-500 mt-1">{fee.recipient ? `Recipient: ${fee.recipient}` : 'Official fee'}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#174f7a] bg-[#f4f8fb] px-3 py-1 rounded-lg self-start sm:self-auto mt-2 sm:mt-0">{fee.cost}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Coins size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">Application & Registration fees are currently bundled or variable for this institution. Check with your consultant.</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* MOBILE FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:hidden print:hidden">
        <Link href={assessmentHref} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#08263c] px-6 py-4 font-bold text-white shadow-xl shadow-[#08263c]/20 ring-1 ring-white/10">
          Apply Now <ArrowRight size={18} />
        </Link>
      </div>

    </article>
  );
}

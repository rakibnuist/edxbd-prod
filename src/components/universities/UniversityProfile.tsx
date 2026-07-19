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
} from 'lucide-react';

import type { CleanUniversityRecord } from '@/lib/university-records';
import { getIntakeStatus } from '@/lib/intake-status';

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

function NumberLabel({ number, label, inverted = false }: { number: string; label: string; inverted?: boolean }) {
  return <p className={`flex items-center gap-3 font-mono text-[9px] font-black uppercase tracking-[0.18em] ${inverted ? 'text-[#8ed0ee]' : 'text-[#174f7a]'}`}><span className={`grid size-7 place-items-center ${inverted ? 'bg-[#8ed0ee] text-[#08263c]' : 'bg-[#174f7a] text-white'}`}>{number}</span>{label}</p>;
}

function DataStatus({ verified }: { verified: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-2 font-mono text-[9px] font-black uppercase tracking-[0.14em] ${verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
      {verified ? <BadgeCheck size={14} /> : <SearchCheck size={14} />}
      {verified ? 'Current source record' : '2027 details confirmed before application'}
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
  const intakeStatusLabel = intakeStatus === 'Under Verification' ? '2027 date check before application' : intakeStatus;
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
  const scholarshipTypes = Array.from(new Set(university.scholarships.map(scholarship => scholarship.type).filter(Boolean)));
  const recordedEligibility = new Set(programs.flatMap(program => program.eligibility).map(comparable));
  const applicationNotes = university.notes.filter(note => !recordedEligibility.has(comparable(note)));
  const additionalTuitionNotes = university.details.tuitionDetails.filter(note => !programs.some(program => comparable(note).includes(comparable(program.name))));
  const additionalFees = university.fees.filter(fee => !/^tuition\s*(fee)?$/i.test(fee.item.trim()));
  const directAnswer = isMedical
    ? `Explore ${university.name} in ${location} for 2027 medical and health related study planning from Bangladesh. This university profile organizes recognition, clinical training, future licensing fit, program cost, scholarship and application timing into one clear decision route.`
    : `Explore ${university.name} in ${location} for 2027 study planning from Bangladesh. This university profile organizes its available programs, shared entry standard, program tuition, scholarship, additional costs and application timing into one clear decision page.`;

  const faq = [
    {
      question: `Can Bangladeshi students apply to ${university.name}?`,
      answer: `Bangladeshi students can complete an eligibility assessment for ${university.name}. The assessment aligns the selected program with academic results, language preparation, age criteria and the 2027 intake, then provides the applicable requirements in writing.`,
    },
    {
      question: `What is the tuition fee at ${university.name}?`,
      answer: 'Each tuition amount is listed beside its exact program in the Study options section. The ClearCost Sheet then adds scholarship adjusted tuition and every additional fee before the student proceeds.',
    },
    {
      question: `Does ${university.name} offer scholarships?`,
      answer: university.scholarships.length
        ? 'The Scholarship planner presents each recorded award once and matches its coverage, eligible programs, selection criteria and renewal terms to the student’s profile.'
        : 'Scholarship matching is completed after education fit, using the selected program, academic profile and current university options.',
    },
    {
      question: `What is the 2027 deadline for ${university.name}?`,
      answer: 'The Admission file shows the university deadline once. Seat availability and final submission timing are confirmed for the selected program before application.',
    },
  ];

  return (
    <article className="bg-[#f4f8fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#8ed0ee 1px, transparent 1px), linear-gradient(90deg, #8ed0ee 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute -right-48 -top-52 size-[38rem] rounded-full border-[5rem] border-[#64b5df]/10" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-9 sm:px-6 lg:py-14">
          <nav className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/45" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/universities">Find education</Link><span aria-hidden="true">/</span>
            {isChina ? <><Link href="/china-universities">China universities</Link><span aria-hidden="true">/</span></> : null}
            <span aria-current="page">{university.name}</span>
          </nav>

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3"><DataStatus verified={isVerified} /><span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#8ed0ee]">2027 university profile</span></div>
              <h1 className="mt-5 max-w-5xl text-balance font-heading text-4xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[66px]">
                Study at {university.name} from Bangladesh
              </h1>
              <p className="mt-5 flex items-center gap-2 text-sm font-bold text-white/60"><MapPin size={16} className="text-[#8ed0ee]" />{university.location || location}</p>
              <p className="mt-6 max-w-4xl text-base leading-8 text-white/72">{directAnswer}</p>
            </div>

            <div className="border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div className="grid grid-cols-[5.5rem_1fr] gap-5">
                <div className="grid aspect-square place-items-center bg-white p-3">
                  {university.logo ? <Image src={university.logo} alt={`${university.name} logo`} width={96} height={96} sizes="88px" priority unoptimized className="max-h-full max-w-full object-contain" /> : <span className="font-heading text-4xl font-bold text-[#174f7a]">{university.name.charAt(0)}</span>}
                </div>
                <div><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-white/40">Profile purpose</p><p className="mt-2 text-sm font-bold leading-6">Choose the program, align your profile and move forward with a clear plan.</p></div>
              </div>
              <Link href={assessmentHref} className="mt-5 flex min-h-14 items-center justify-between bg-[#64b5df] px-4 text-sm font-black text-[#08263c]">Check my education fit <ArrowRight size={17} /></Link>
            </div>
          </div>
        </div>
      </header>

      {isMedical ? (
        <section className="border-b border-rose-900/15 bg-[#fff2ef]">
          <div className="mx-auto flex max-w-[1440px] gap-4 px-4 py-5 sm:px-6"><Scale className="mt-1 shrink-0 text-rose-800" size={24} /><div><strong className="font-heading text-lg text-rose-950">Start with recognition and future licensing fit</strong><p className="mt-1 text-sm leading-6 text-rose-950/70">The medical route review aligns the institution, exact program, clinical training, internship pathway and current licensing requirements with the student’s intended country of practice before the cost decision.</p></div></div>
        </section>
      ) : null}

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[#174f7a]/15 lg:grid-cols-5">
          {[
            [GraduationCap, 'Study level', studyLevels],
            [Languages, 'Teaching', languages],
            [CalendarClock, 'Intake record', intake],
            [BookOpenCheck, 'Programs', `${programs.length} listed option${programs.length === 1 ? '' : 's'}`],
            [WalletCards, 'Tuition range', university.details.tuition],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="bg-white p-4 sm:p-5"><Icon size={18} className="text-[#174f7a]" /><p className="mt-4 font-mono text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">{String(label)}</p><p className="mt-2 text-xs font-black leading-5">{String(value)}</p></div>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-16">
        <main className="space-y-8">
          <section id="decision-brief" className="border border-[#174f7a]/15 bg-white p-5 sm:p-8">
            <NumberLabel number="01" label="Decision brief" />
            <h2 className="mt-5 max-w-3xl font-heading text-3xl font-bold leading-tight sm:text-4xl">How to assess {university.name} for your study plan</h2>
            <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600">Use the university record below to choose an exact program first, then align academic eligibility, scholarship coverage, additional costs and the application timeline around that one decision. Shared requirements appear once, while program specific differences stay beside the relevant program.</p>
            <div className="mt-7 grid gap-px bg-[#174f7a]/15 md:grid-cols-2">
              <div className="bg-[#e9f7fd] p-5"><UserRoundCheck className="text-[#174f7a]" size={22} /><h3 className="mt-4 font-heading text-lg font-bold">This university may fit your plan when</h3><ul className="mt-4 space-y-3 text-xs leading-6 text-slate-600">{[
                `Your target level is available across ${studyLevels}`,
                `You can prepare for study taught in ${languages}`,
                'You want to compare tuition, living cost and additional fees together',
                'You value written eligibility and cost confirmation before proceeding',
              ].map(item => <li key={item} className="flex gap-3"><Check size={15} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul></div>
              <div className="bg-[#fff7e8] p-5"><SearchCheck className="text-amber-800" size={22} /><h3 className="mt-4 font-heading text-lg font-bold">A strong shortlist also confirms</h3><ul className="mt-4 space-y-3 text-xs leading-6 text-slate-600">{[
                'Current program entry criteria and available seats',
                'Scholarship selection and renewal conditions',
                'Every university and third party payment item',
                'Recognition and licensing fit for regulated careers',
              ].map(item => <li key={item} className="flex gap-3"><Check size={15} className="mt-1 shrink-0 text-amber-800" />{item}</li>)}</ul></div>
            </div>
          </section>

          <section id="programs" className="border border-[#174f7a]/15 bg-white p-5 sm:p-8">
            <NumberLabel number="02" label="Study options" />
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><h2 className="font-heading text-3xl font-bold sm:text-4xl">{university.name} programs and 2027 tuition</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">Shared teaching, intake and entry facts appear once. Each exact program then shows only its own tuition and any criteria that differ.</p></div><div className="text-right"><span className="font-heading text-5xl font-bold text-[#174f7a]">{programs.length}</span><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Program options</span></div></div>
            <div className="mt-8 space-y-5">
              {Object.entries(groupedPrograms).map(([level, levelPrograms], groupIndex) => {
                const languageSets = levelPrograms.map(program => program.languages.join(', ') || languages);
                const durationSets = levelPrograms.map(program => program.duration || 'Confirmed for the selected program');
                const intakeSets = levelPrograms.map(program => program.intakes.join(', ') || intake);
                const deadlineSets = levelPrograms.map(program => program.applicationDeadline || university.deadlines.application);
                const sharedLanguages = new Set(languageSets).size === 1 ? languageSets[0] : '';
                const sharedDuration = new Set(durationSets).size === 1 ? durationSets[0] : '';
                const sharedIntake = new Set(intakeSets).size === 1 ? intakeSets[0] : '';
                const sharedDeadline = new Set(deadlineSets).size === 1 ? deadlineSets[0] : '';
                const sharedEligibility = levelPrograms[0]?.eligibility.filter(item => levelPrograms.every(program => program.eligibility.some(candidate => comparable(candidate) === comparable(item)))) || [];
                const sharedFacts = [
                  ...(sharedLanguages && comparable(sharedLanguages) !== comparable(languages) ? [['Teaching', sharedLanguages]] : []),
                  ...(sharedDuration ? [['Duration', sharedDuration]] : []),
                  ...(sharedIntake && comparable(sharedIntake) !== comparable(intake) ? [['2027 intake', sharedIntake]] : []),
                ];
                const programGroups = Array.from(levelPrograms.reduce<Map<string, typeof levelPrograms>>((groups, program) => {
                  const additionalCriteria = program.eligibility.filter(item => !sharedEligibility.some(shared => comparable(shared) === comparable(item)));
                  const signature = JSON.stringify({
                    tuition: program.tuition || university.details.tuition,
                    scholarshipTuition: program.tuitionAfterScholarship || '',
                    languages: sharedLanguages ? '' : program.languages,
                    duration: sharedDuration ? '' : program.duration,
                    intakes: sharedIntake ? '' : program.intakes,
                    deadline: sharedDeadline ? '' : program.applicationDeadline,
                    eligibility: additionalCriteria,
                  });
                  const group = groups.get(signature) || [];
                  group.push(program);
                  groups.set(signature, group);
                  return groups;
                }, new Map()).values());

                return <article key={level} className="overflow-hidden border border-[#174f7a]/15">
                  <header className="flex items-center justify-between bg-[#08263c] px-5 py-4 text-white"><div className="flex items-center gap-4"><span className="font-mono text-[9px] font-black text-[#8ed0ee]">{String(groupIndex + 1).padStart(2, '0')}</span><h3 className="font-heading text-2xl font-bold">{level} programs</h3></div><span className="bg-white/10 px-3 py-1.5 text-[10px] font-bold">{levelPrograms.length} option{levelPrograms.length === 1 ? '' : 's'}</span></header>
                  {sharedFacts.length ? <div className={`grid gap-px bg-[#174f7a]/15 ${sharedFacts.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>{sharedFacts.map(([label, value]) => <div key={label} className="bg-[#e9f7fd] p-4"><span className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#174f7a]">{label}</span><strong className="mt-2 block text-xs leading-5">{value}</strong></div>)}</div> : null}
                  {sharedEligibility.length ? <div className="border-b border-[#174f7a]/15 bg-white p-5"><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#174f7a]">Shared {level} admission standard</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{sharedEligibility.map(item => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><Check size={13} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul></div> : null}
                  <div className="grid gap-px bg-[#174f7a]/15 md:grid-cols-2">
                    {programGroups.map((programGroup, index) => {
                      const program = programGroup[0];
                      const additionalCriteria = program.eligibility.filter(item => !sharedEligibility.some(shared => comparable(shared) === comparable(item)));
                      return <div key={`${level}-${programGroup.map(item => item.name).join('-')}-${index}`} className="bg-[#f8fbfd] p-5">
                        <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-[#174f7a]">Tuition group {String(index + 1).padStart(2, '0')} · {programGroup.length} program{programGroup.length === 1 ? '' : 's'}</p><div className="mt-3 space-y-2">{programGroup.map((option, optionIndex) => <div key={option.name} className="flex items-start gap-3"><span className="mt-1 font-mono text-[8px] font-black text-[#64b5df]">{String(optionIndex + 1).padStart(2, '0')}</span><div><h4 className="font-heading text-xl font-bold">{option.name}</h4>{option.subject ? <p className="mt-1 text-[10px] font-bold text-slate-400">{option.subject}</p> : null}</div></div>)}</div></div><GraduationCap className="shrink-0 text-[#64b5df]" size={24} /></div>
                        <div className="mt-5 bg-white p-4"><span className="block font-mono text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Program tuition</span><strong className="mt-2 block text-lg text-[#174f7a]">{program.tuition || university.details.tuition}</strong></div>
                        {(!sharedLanguages || !sharedDuration || !sharedIntake || !sharedDeadline) ? <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">{!sharedLanguages ? <div className="bg-white p-3"><span className="block font-bold uppercase tracking-[0.12em] text-slate-400">Teaching</span><strong className="mt-1 block">{program.languages.join(', ') || languages}</strong></div> : null}{!sharedDuration ? <div className="bg-white p-3"><span className="block font-bold uppercase tracking-[0.12em] text-slate-400">Duration</span><strong className="mt-1 block">{program.duration || 'Confirmed for this program'}</strong></div> : null}{!sharedIntake ? <div className="bg-white p-3"><span className="block font-bold uppercase tracking-[0.12em] text-slate-400">2027 intake</span><strong className="mt-1 block">{program.intakes.join(', ') || intake}</strong></div> : null}{!sharedDeadline ? <div className="bg-white p-3"><span className="block font-bold uppercase tracking-[0.12em] text-slate-400">Deadline</span><strong className="mt-1 block">{program.applicationDeadline || university.deadlines.application}</strong></div> : null}</div> : null}
                        {program.tuitionAfterScholarship ? <p className="mt-3 bg-[#e9f7fd] p-3 text-xs font-bold text-[#174f7a]">Scholarship adjusted tuition: {program.tuitionAfterScholarship}</p> : null}
                        {additionalCriteria.length ? <div className="mt-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">Additional program criteria</p><ul className="mt-2 space-y-2">{additionalCriteria.map(item => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><Check size={13} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul></div> : null}
                      </div>;
                    })}
                  </div>
                </article>;
              })}
            </div>
          </section>

          <section id="costs" className="overflow-hidden border border-[#174f7a]/15 bg-white">
            <div className="grid lg:grid-cols-[.38fr_.62fr]">
              <div className="bg-[#08263c] p-5 text-white sm:p-8"><NumberLabel number="03" label="Cost ledger" inverted /><WalletCards className="mt-10 text-[#8ed0ee]" size={32} /><h2 className="mt-5 font-heading text-3xl font-bold">Additional study costs at {university.name}</h2><p className="mt-4 text-sm leading-7 text-white/60">The ClearCost Sheet connects the program tuition shown above with every university or third party payment required for that route.</p></div>
              <div className="p-5 sm:p-8">
                <div className="bg-[#e9f7fd] p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.16em] text-[#174f7a]">Tuition location</p><p className="mt-2 text-sm font-bold leading-6">Each exact tuition amount appears once beside its program in Study options.</p></div>
                {additionalTuitionNotes.length ? <ul className="mt-5 grid gap-2">{additionalTuitionNotes.map(item => <li key={item} className="flex gap-3 bg-[#f4f8fb] p-3 text-xs leading-6 text-slate-600"><Coins size={15} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul> : null}
                {additionalFees.length ? <div className="mt-7 overflow-x-auto"><table className="w-full min-w-[34rem] border-collapse text-left text-xs"><thead><tr className="border-b-2 border-[#08263c]"><th className="py-3 pr-4 font-mono text-[8px] uppercase tracking-[0.14em] text-slate-400">Additional cost</th><th className="py-3 pr-4 font-mono text-[8px] uppercase tracking-[0.14em] text-slate-400">2027 amount</th><th className="py-3 font-mono text-[8px] uppercase tracking-[0.14em] text-slate-400">Payment context</th></tr></thead><tbody>{additionalFees.map(fee => <tr key={`${fee.item}-${fee.cost}-${fee.notes || ''}`} className="border-b border-[#174f7a]/12"><th className="py-4 pr-4 font-bold">{fee.item}</th><td className="py-4 pr-4 font-black text-[#174f7a]">{fee.cost}</td><td className="py-4 leading-5 text-slate-500">{[fee.recipient ? `Paid to ${fee.recipient}` : '', fee.notes || '', fee.validFor || 'Included in the 2027 cost review'].filter(Boolean).join(' · ')}</td></tr>)}</tbody></table></div> : <p className="mt-5 text-sm leading-7 text-slate-600">The additional university and third party cost lines are prepared in the ClearCost Sheet for the selected program.</p>}
              </div>
            </div>
          </section>

          <section id="scholarships" className="overflow-hidden border border-[#174f7a]/15 bg-white">
            <div className="relative overflow-hidden bg-[#08263c] p-5 text-white sm:p-8">
              <div className="absolute -right-20 -top-28 size-72 rounded-full border-[3rem] border-[#64b5df]/10" />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end"><div><NumberLabel number="04" label="Scholarship planner" inverted /><h2 className="mt-5 max-w-3xl font-heading text-3xl font-bold sm:text-4xl">{university.name} scholarship planner</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-white/60">Compare coverage, eligible programs, selection conditions, renewal and the 2027 deadline together. Scholarship strengthens an affordable education plan after academic fit is clear.</p></div><div className="grid grid-cols-2 gap-px bg-white/15"><div className="bg-[#08263c] p-4"><span className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/40">Recorded options</span><strong className="mt-2 block font-heading text-4xl text-[#8ed0ee]">{university.scholarships.length}</strong></div><div className="bg-[#08263c] p-4"><span className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/40">Funding types</span><strong className="mt-2 block text-sm leading-5 text-[#8ed0ee]">{scholarshipTypes.join(', ') || 'Profile matched'}</strong></div></div></div>
            </div>
            <div className="grid gap-px bg-[#174f7a]/15 sm:grid-cols-4">
              {['Education fit', 'Eligible program', 'Coverage', 'Renewal'].map((step, index) => <div key={step} className="relative flex items-center gap-3 bg-[#e9f7fd] p-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#174f7a] font-mono text-[9px] font-black text-white">{index + 1}</span><strong className="text-[10px] uppercase tracking-[0.1em] text-[#174f7a]">{step}</strong>{index < 3 ? <ArrowRight className="absolute -right-2 z-10 hidden text-[#174f7a] sm:block" size={15} /> : null}</div>)}
            </div>
            {university.scholarships.length ? (
              <div className={`grid gap-px bg-[#174f7a]/15 ${university.scholarships.length > 1 ? 'lg:grid-cols-2' : ''}`}>
                {university.scholarships.map((scholarship, index) => (
                  <article key={`${scholarship.title}-${index}`} className="relative overflow-hidden bg-[#f8fbfd] p-5 sm:p-7">
                    <span className="pointer-events-none absolute -bottom-8 right-4 font-heading text-[8rem] font-bold leading-none text-[#174f7a]/[0.035]">{String(index + 1).padStart(2, '0')}</span>
                    <div className={`absolute inset-y-0 left-0 w-1.5 ${index % 3 === 0 ? 'bg-[#64b5df]' : index % 3 === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <div className="relative flex items-start justify-between gap-4"><div><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#174f7a]">Scholarship {String(index + 1).padStart(2, '0')} · {scholarship.status === 'closed' ? 'Next cycle planning' : scholarship.status === 'planned' ? '2027 planning' : '2027 option'}</p><h3 className="mt-3 font-heading text-2xl font-bold">{scholarship.title}</h3>{scholarship.type ? <span className="mt-3 inline-flex bg-[#08263c] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white">{scholarship.type} funding</span> : null}</div><span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e9f7fd] text-[#174f7a]"><Award size={23} /></span></div>
                    {scholarship.amount ? <p className="mt-5 font-heading text-3xl font-bold text-[#174f7a]">{scholarship.amount}</p> : null}
                    {scholarship.coverage ? <div className="mt-4 bg-white p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">Coverage</p><p className="mt-2 text-sm font-bold leading-6">{scholarship.coverage}</p></div> : null}
                    <div className="relative mt-4 grid grid-cols-2 gap-2 text-xs"><div className="bg-white p-3"><span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Eligible programs</span><strong className="mt-2 block leading-5">{scholarship.eligiblePrograms.length ? scholarship.eligiblePrograms.join(', ') : 'Matched during assessment'}</strong></div><div className="bg-white p-3"><span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Renewal</span><strong className="mt-2 block leading-5">{scholarship.renewal || 'Conditions confirmed in writing'}</strong></div><div className="bg-white p-3"><span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">2027 deadline</span><strong className="mt-2 block leading-5">{scholarship.deadline || 'Aligned to program deadline'}</strong></div><div className="bg-white p-3"><span className="block text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Selection</span><strong className="mt-2 block leading-5">Profile and seat based</strong></div></div>
                    {scholarship.details.filter(detail => !scholarship.amount || !comparable(detail).includes(comparable(scholarship.amount))).length ? <ul className="mt-5 space-y-2">{scholarship.details.filter(detail => !scholarship.amount || !comparable(detail).includes(comparable(scholarship.amount))).map(detail => <li key={detail} className="flex gap-3 text-xs leading-6 text-slate-600"><Check size={14} className="mt-1 shrink-0 text-[#174f7a]" />{detail}</li>)}</ul> : null}
                    {scholarship.condition ? <p className="mt-5 border-t border-[#174f7a]/15 pt-4 text-xs leading-6 text-slate-500"><strong className="text-[#08263c]">Eligibility focus:</strong> {scholarship.condition}</p> : null}
                    {scholarship.sourceUrl && /^https:\/\//i.test(scholarship.sourceUrl) ? <a href={scholarship.sourceUrl} target="_blank" rel="noreferrer" className="relative mt-5 flex items-center justify-between border-t border-[#174f7a]/15 pt-4 text-xs font-black text-[#174f7a]">Official scholarship source <ExternalLink size={14} /></a> : null}
                  </article>
                ))}
              </div>
            ) : <div className="p-6 sm:p-8"><div className="grid gap-5 bg-[#e9f7fd] p-6 sm:grid-cols-[auto_1fr] sm:items-center"><span className="grid size-14 place-items-center rounded-full bg-white text-[#174f7a]"><Sparkles size={25} /></span><div><h3 className="font-heading text-2xl font-bold">Scholarship matching is part of your education fit review</h3><p className="mt-2 text-sm leading-7 text-slate-600">Your selected program, academic profile and 2027 intake are used to identify suitable university, provincial or CSC options and prepare the applicable conditions in writing.</p></div></div></div>}
          </section>

          <section id="admission" className="border border-[#174f7a]/15 bg-white p-5 sm:p-8">
            <NumberLabel number="05" label="Admission file" />
            <div className="mt-5 grid gap-8 lg:grid-cols-2">
              <div><FileCheck2 className="text-[#174f7a]" size={25} /><h2 className="mt-4 font-heading text-3xl font-bold">Program aligned document checklist</h2><p className="mt-3 text-sm leading-7 text-slate-600">Your final checklist combines the selected program, academic history and 2027 application route.</p><ul className="mt-6 grid gap-2">{university.documents.length ? university.documents.map(item => <li key={item} className="flex gap-3 border-b border-[#174f7a]/12 py-3 text-xs font-bold leading-6"><ClipboardCheck size={15} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>) : <li className="bg-[#e9f7fd] p-4 text-sm text-slate-600">Your tailored checklist is prepared after the program and profile review.</li>}</ul></div>
              <div><CalendarClock className="text-[#174f7a]" size={25} /><h2 className="mt-4 font-heading text-3xl font-bold">2027 application timing</h2><div className="mt-6 grid gap-px bg-[#174f7a]/15"><div className="bg-[#f8fbfd] p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">University deadline</p><p className="mt-2 text-sm font-black">{university.deadlines.application}</p></div><div className="bg-[#e9f7fd] p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#174f7a]">Next action</p><p className="mt-2 text-sm font-black">{intakeStatusLabel}</p><p className="mt-2 text-xs leading-6 text-slate-600">Seat availability and final submission timing are confirmed for the selected program before the application file proceeds.</p></div></div>{applicationNotes.length ? <div className="mt-6"><h3 className="font-heading text-lg font-bold">Additional application notes</h3><ul className="mt-3 space-y-2">{applicationNotes.map(note => <li key={note} className="flex gap-3 text-xs leading-6 text-slate-600"><Check size={14} className="mt-1 shrink-0 text-[#174f7a]" />{note}</li>)}</ul></div> : null}</div>
            </div>
          </section>

          <section id="evidence" className="border border-[#174f7a]/15 bg-white p-5 sm:p-8">
            <NumberLabel number="06" label="Evidence and responsibility" />
            <h2 className="mt-5 font-heading text-3xl font-bold sm:text-4xl">Move forward with a clear evidence and responsibility record</h2>
            <div className="mt-7 grid gap-px bg-[#174f7a]/15 md:grid-cols-3">
              {[
                [Stamp, 'Recognition', university.recognitionAuthority ? `${university.recognitionAuthority}. Source shown below.` : 'Recognition and future licensing fit are confirmed for the selected program.'],
                [Building2, 'Relationship', university.relationshipEvidenceUrl ? relationshipLabels[university.relationshipType] : 'The applicable university access route is confirmed before application.'],
                [ShieldCheck, 'EduExpress role', 'EduExpress provides education guidance and application support, while universities, embassies and scholarship bodies issue the official decisions.'],
              ].map(([Icon, title, copy]) => <div key={String(title)} className="bg-[#f8fbfd] p-5"><Icon size={22} className="text-[#174f7a]" /><h3 className="mt-4 font-heading text-lg font-bold">{String(title)}</h3><p className="mt-3 text-xs leading-6 text-slate-600">{String(copy)}</p></div>)}
            </div>

            <div className="mt-7 border-t border-[#174f7a]/15 pt-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-heading text-2xl font-bold">Source register</h3><p className="mt-2 text-xs leading-6 text-slate-500">Only current official or directly relevant evidence links should appear here.</p></div><DataStatus verified={isVerified} /></div>
              {sourceLinks.length ? <ul className="mt-5 grid gap-2">{sourceLinks.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border border-[#174f7a]/15 bg-[#f8fbfd] p-4 text-xs font-bold text-[#174f7a]"><span className="truncate">Source {index + 1}: {new URL(url).hostname}</span><ExternalLink size={15} /></a></li>)}</ul> : <div className="mt-5 bg-[#e9f7fd] p-5"><p className="text-sm font-black text-[#08263c]">Current source confirmation is included in the program review</p><p className="mt-2 text-xs leading-6 text-slate-600">The selected program, fee, scholarship, recognition and 2027 deadline are matched to current official information before the application file proceeds.</p></div>}
              <div className="mt-5 grid gap-px bg-[#174f7a]/15 sm:grid-cols-3"><div className="bg-white p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">Source verification</p><p className="mt-2 text-xs font-bold">{formatDate(university.lastVerifiedAt)}</p></div><div className="bg-white p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">Database updated</p><p className="mt-2 text-xs font-bold">{formatDate(university.updatedAt)}</p></div><div className="bg-white p-4"><p className="font-mono text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">Publisher and reviewer</p><p className="mt-2 text-xs font-bold">EduExpress International</p></div></div>
            </div>
          </section>

          <section id="questions" className="border border-[#174f7a]/15 bg-white p-5 sm:p-8">
            <NumberLabel number="07" label="Questions students ask" />
            <h2 className="mt-5 font-heading text-3xl font-bold sm:text-4xl">{university.name} admission FAQ</h2>
            <div className="mt-7 divide-y divide-[#174f7a]/15 border-y border-[#174f7a]/15">{faq.map(item => <details key={item.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-heading text-lg font-bold"><span>{item.question}</span><span className="grid size-7 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a] group-open:rotate-45">+</span></summary><p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">{item.answer}</p></details>)}</div>
          </section>
        </main>

        <aside className="space-y-5">
          <div className="sticky top-32 space-y-5">
            <section className="border-t-4 border-[#64b5df] bg-[#08263c] p-5 text-white">
              <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#8ed0ee]">Your next useful step</p>
              <h2 className="mt-4 font-heading text-2xl font-bold">Check this university against your profile</h2>
              <p className="mt-3 text-xs leading-6 text-white/60">Share your results, study goal, budget and language preparation. The assessment builds a focused shortlist and a practical next step.</p>
              <Link href={assessmentHref} className="mt-5 flex min-h-14 items-center justify-between bg-[#64b5df] px-4 py-3 text-sm font-black text-[#08263c]">Get fit assessment <ArrowRight size={16} /></Link>
            </section>

            <nav className="border border-[#174f7a]/15 bg-white p-5" aria-label="University profile sections"><p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">Profile index</p><ol className="mt-4 space-y-1">{[
              ['Decision brief', '#decision-brief'], ['Programs', '#programs'], ['Costs', '#costs'], ['Scholarships', '#scholarships'], ['Admission file', '#admission'], ['Evidence', '#evidence'], ['FAQ', '#questions'],
            ].map(([label, href], index) => <li key={href}><a href={href} className="flex items-center justify-between border-b border-[#174f7a]/10 py-3 text-xs font-bold"><span>{String(index + 1).padStart(2, '0')} {label}</span><ArrowRight size={13} className="text-[#174f7a]" /></a></li>)}</ol></nav>

            {isChina ? <section className="border border-[#174f7a]/15 bg-[#e9f7fd] p-5"><BookOpenCheck className="text-[#174f7a]" size={23} /><h2 className="mt-4 font-heading text-xl font-bold">China service terms</h2><p className="mt-3 text-xs font-bold leading-6 text-[#0b2f4a]/75">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.</p><Link href="/china-visa-first-policy" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#174f7a]">Read the full policy <ArrowRight size={14} /></Link></section> : null}
          </div>
        </aside>
      </div>

      <section className="bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-4 py-12 sm:px-6 lg:grid-cols-[.7fr_.3fr] lg:items-center"><div><p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#8ed0ee]">Continue the comparison</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Build a balanced shortlist around education fit</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">Compare education quality, recognition, total cost, entry fit and career relevance across several suitable options.</p></div><Link href={isChina ? '/china-universities' : '/universities'} className="flex min-h-14 items-center justify-between bg-white px-5 text-sm font-black text-[#08263c]">Compare more universities <ArrowRight size={17} /></Link></div>
      </section>
    </article>
  );
}

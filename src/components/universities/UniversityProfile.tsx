import Link from 'next/link';
/* eslint-disable react/no-unescaped-entities -- The public copy uses natural contractions in JSX text. */
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Languages,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from 'lucide-react';
import type { CleanUniversityRecord } from '@/lib/university-records';
import { getIntakeStatus } from '@/lib/intake-status';
import { getPublicTrustRecords } from '@/lib/trust-records';
import UniversityClearCost from '@/components/universities/UniversityClearCost';

type Props = { university: CleanUniversityRecord };

const relationshipLabels: Record<CleanUniversityRecord['relationshipType'], string> = {
  direct_partner: 'Direct relationship record',
  authorized_representative: 'Authorized representative record',
  network_access: 'Network access record',
  public_direct_application: 'Public application route',
  unverified: 'Application route confirmed before proceeding',
};

const sourceUrls = (university: CleanUniversityRecord) => Array.from(new Set([
  university.officialUrl,
  university.recognitionSourceUrl,
  university.relationshipEvidenceUrl,
  ...university.sourceUrls,
].filter((value): value is string => Boolean(value && /^https?:\/\//i.test(value)))));

function tuitionSummary(university: CleanUniversityRecord) {
  if (university.details.tuition?.trim()) return university.details.tuition.trim();
  const values = Array.from(new Set(university.programs.map(program => program.tuition?.trim()).filter((value): value is string => Boolean(value))));
  if (values.length === 0) return 'Program specific';
  if (values.length === 1) return values[0];
  const parsed = values.map(value => ({ value, match: value.match(/^([\d,]+)\s+(.+)$/) })).filter(item => item.match);
  if (parsed.length === values.length && parsed.every(item => item.match?.[2] === parsed[0].match?.[2])) {
    parsed.sort((a, b) => Number(a.match?.[1].replaceAll(',', '')) - Number(b.match?.[1].replaceAll(',', '')));
    return `${parsed[0].match?.[1]} to ${parsed[parsed.length - 1].match?.[1]} ${parsed[0].match?.[2]}`;
  }
  return values.sort().join(' to ');
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default async function UniversityProfile({ university }: Props) {
  const isChina = university.country.toLowerCase() === 'china';
  const programs: CleanUniversityRecord['programs'] = university.programs.length ? university.programs : university.details.majors.map(name => ({
    level: university.degree[0] || 'Program',
    name,
    languages: university.taught,
    intakes: university.intake,
    eligibility: [] as string[],
    status: 'active' as const,
    tuition: university.details.tuition,
  }));
  const groupedPrograms = programs.reduce<Record<string, typeof programs>>((groups, program) => {
    (groups[program.level] ||= []).push(program);
    return groups;
  }, {});
  const levels = Array.from(new Set(programs.map(program => program.level))).filter(Boolean);
  const languages = Array.from(new Set(programs.flatMap(program => program.languages))).filter(Boolean);
  const intakes = Array.from(new Set(programs.flatMap(program => program.intakes))).filter(Boolean);
  const sources = sourceUrls(university);
  const recordedTuition = tuitionSummary(university);
  const verified = university.verificationStatus === 'verified' && sources.length > 0;
  const intakeStatus = getIntakeStatus({ verifiedUntil: university.verificationExpiresAt });
  const { team, offices } = await getPublicTrustRecords();
  const counselor = team.find(member => /China/.test(member.role)) || team.find(member => /Counselor/.test(member.role)) || team[0];
  const office = offices[0];
  const assessmentHref = isChina
    ? `/study-in-china-from-bangladesh?university=${encodeURIComponent(university.slug)}#china-fit-form`
    : `/education-fit-assessment?university=${encodeURIComponent(university.slug)}`;

  return (
    <article className="bg-[#f7fafc] pb-20 pt-[74px] text-[#08263c] xl:pt-[106px]">
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#174f7a]"><Link href="/">Home</Link><span className="text-slate-300">/</span><Link href="/universities">Universities</Link>{isChina && <><span className="text-slate-300">/</span><Link href="/china-universities">China</Link></>}<span className="text-slate-300">/</span><span className="text-slate-500">{university.name}</span></nav>
          <div className="mt-8 grid items-center gap-9 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[.13em] ${verified ? 'bg-emerald-50 text-emerald-700' : 'bg-[#e9f7fd] text-[#174f7a]'}`}>{verified ? 'Official sources linked' : 'Program aligned record'}</span><span className="rounded-full bg-[#f7fafc] px-3 py-1.5 text-[10px] font-black text-slate-500">2027 study options</span></div>
              <div className="mt-5 flex items-start gap-4">
                {university.logo && <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[#174f7a]/15 bg-white p-2"><Image src={university.logo} alt={`${university.name} logo`} width={54} height={54} className="max-h-full max-w-full object-contain" /></span>}
                <div><h1 className="font-heading text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-.035em]">{university.name}</h1><p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500"><MapPin size={16} className="text-[#174f7a]" />{university.city}, {university.country}</p></div>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">Compare the recorded programs, tuition, scholarships and admission requirements for {university.name}. EduExpress aligns every current detail to the program you select before application.</p>
              <div className="mt-7 flex flex-wrap gap-2">{['Programs', 'Costs', 'Scholarships', 'Admission'].map(item => <a key={item} href={`#${item.toLowerCase()}`} className="rounded-full border border-[#174f7a]/20 bg-[#f7fafc] px-3.5 py-2 text-xs font-black hover:bg-[#e9f7fd]">{item}</a>)}</div>
            </div>

            {counselor && <aside className="rounded-2xl bg-[#08263c] p-6 text-white">
              <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[#64b5df] font-heading font-bold text-[#08263c]">{initials(counselor.name)}</span><div><p className="text-[10px] font-black uppercase tracking-[.13em] text-[#8ed0ee]">Ask a real counselor</p><strong className="mt-1 block text-sm">{counselor.name}</strong></div></div>
              <p className="mt-5 text-sm leading-6 text-white/65">Share your results and target program. We will explain your fit, requirements and complete cost route.</p>
              <Link href={assessmentHref} className="mt-5 flex min-h-12 items-center justify-between rounded-xl bg-[#64b5df] px-4 text-sm font-black text-[#08263c]">Check my fit <ArrowRight size={15} /></Link>
              {office && <a href={`https://wa.me/${office.phonePrimary.replace('+', '')}?text=${encodeURIComponent(`Hello, I want to ask about ${university.name}.`)}`} className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 text-xs font-bold"><MessageCircle size={15} /> Ask on WhatsApp</a>}
            </aside>}
          </div>
        </div>
      </header>

      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [GraduationCap, 'Study levels', levels.join(', ') || 'Confirmed by program'],
            [Languages, 'Teaching', languages.join(', ') || 'Confirmed by program'],
            [CalendarDays, 'Intake', intakes.join(', ') || university.intake.join(', ') || 'Date check included'],
            [CircleDollarSign, 'Recorded tuition', recordedTuition],
          ].map(([Icon, label, value]) => <div key={String(label)} className="rounded-2xl border border-[#174f7a]/15 bg-white p-4"><span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.13em] text-[#174f7a]"><Icon size={15} />{String(label)}</span><strong className="mt-3 block text-sm leading-6">{String(value)}</strong></div>)}
        </div>
      </section>

      <UniversityClearCost university={{ name: university.name, slug: university.slug, city: university.city, country: university.country, logo: university.logo }} programs={programs} fees={university.fees} scholarships={university.scholarships} costPlans={university.costPlans} assessmentHref={assessmentHref} />

      <section id="programs" className="scroll-mt-28 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Choose a program, not only a university</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Study options</h2><p className="mt-3 text-sm leading-6 text-slate-500">Open a program to see its teaching language, tuition, intake and entry information.</p></div>
          <div className="mt-8 space-y-8">{Object.entries(groupedPrograms).map(([programLevel, levelPrograms]) => <div key={programLevel}><div className="mb-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#174f7a] text-xs font-black text-white">{levelPrograms.length}</span><h3 className="font-heading text-2xl font-bold">{programLevel} options</h3></div><div className="grid gap-3 lg:grid-cols-2">{levelPrograms.map(program => <details key={`${program.level}-${program.name}-${program.tuition || ''}`} className="group rounded-2xl border border-[#174f7a]/15 bg-white open:border-[#174f7a]/40"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5"><span><strong className="block text-lg">{program.name}</strong><span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500"><span>{program.languages.join(', ') || 'Language confirmed before application'}</span>{program.tuition && <span>{program.tuition}</span>}</span></span><ChevronDown size={19} className="shrink-0 text-[#174f7a] transition group-open:rotate-180" /></summary><div className="border-t border-[#174f7a]/10 px-5 pb-5 pt-4 text-sm leading-6 text-slate-600"><div className="grid gap-3 sm:grid-cols-2">{program.duration && <p><strong className="block text-xs text-[#08263c]">Duration</strong>{program.duration}</p>}<p><strong className="block text-xs text-[#08263c]">Intake</strong>{program.intakes.join(', ') || 'Confirmed for the selected cycle'}</p>{program.applicationDeadline && <p><strong className="block text-xs text-[#08263c]">Recorded deadline</strong>{program.applicationDeadline}</p>}<p><strong className="block text-xs text-[#08263c]">Tuition</strong>{program.tuition || university.details.tuition || 'Prepared in the program plan'}</p></div>{program.eligibility.length > 0 && <div className="mt-4 rounded-xl bg-[#f7fafc] p-4"><strong className="text-xs text-[#08263c]">Recorded entry information</strong><ul className="mt-2 space-y-1">{program.eligibility.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={14} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}</ul></div>}</div></details>)}</div></div>)}</div>
        </div>
      </section>

      <section className="border-y border-[#174f7a]/15 bg-white px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <div id="scholarships" className="scroll-mt-28"><div className="flex items-center gap-3"><Sparkles size={23} className="text-[#174f7a]" /><h2 className="font-heading text-3xl font-bold">Scholarship options</h2></div><p className="mt-3 text-sm leading-6 text-slate-500">Choose an available scholarship inside ClearCost to see its tuition effect beside the other first year costs.</p>{university.scholarships.length ? <div className="mt-6 grid gap-3 sm:grid-cols-2">{university.scholarships.map(scholarship => <details key={`${scholarship.title}-${scholarship.amount || ''}`} className="group rounded-2xl border border-[#174f7a]/15 bg-[#f7fafc]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4"><span><strong className="block">{scholarship.title}</strong><span className="mt-1 block text-xs font-bold text-[#174f7a]">{scholarship.amount || scholarship.coverage || 'Program specific coverage'}</span></span><ChevronDown size={17} className="transition group-open:rotate-180" /></summary><div className="border-t border-[#174f7a]/10 px-4 pb-4 pt-3 text-sm leading-6 text-slate-600">{scholarship.condition && <p><strong>Condition:</strong> {scholarship.condition}</p>}{scholarship.deadline && <p><strong>Application deadline:</strong> {scholarship.deadline}</p>}{scholarship.renewal && <p><strong>Renewal:</strong> {scholarship.renewal}</p>}</div></details>)}</div> : <div className="mt-6 rounded-2xl bg-[#f7fafc] p-5 text-sm leading-6 text-slate-600">Scholarship availability is shown with the selected program and the university's current award terms.</div>}</div>
        </div>
      </section>

      <section id="admission" className="scroll-mt-28 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Admission preparation</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">What happens next</h2><p className="mt-4 text-sm leading-7 text-slate-600">We confirm program fit first, then align the current documents, deadline, costs and scholarship conditions before any application action.</p><div className="mt-6 rounded-2xl bg-[#08263c] p-5 text-white"><span className="text-[10px] font-black uppercase tracking-[.13em] text-[#8ed0ee]">Current intake status</span><strong className="mt-2 block text-xl">{intakeStatus === 'Under Verification' ? 'Date check included before application' : intakeStatus}</strong><p className="mt-2 text-xs text-white/55">Recorded deadline: {university.deadlines.application || 'Confirmed with the selected program'}</p></div></div>
          <div className="rounded-2xl border border-[#174f7a]/15 bg-white p-5 sm:p-7"><h3 className="flex items-center gap-2 text-xl font-black"><FileCheck2 size={20} className="text-[#174f7a]" />Recorded document checklist</h3>{university.documents.length ? <ul className="mt-5 grid gap-3 sm:grid-cols-2">{university.documents.map(document => <li key={document} className="flex items-center gap-2 rounded-xl bg-[#f7fafc] px-3 py-3 text-sm font-semibold"><CheckCircle2 size={15} className="shrink-0 text-[#2f8f6b]" />{document}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-600">The current checklist is prepared for the selected level and applicant profile.</p>}</div>
        </div>
      </section>

      <section className="border-y border-[#174f7a]/15 bg-[#dff3fb] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex items-center gap-2"><ShieldCheck size={20} className="text-[#174f7a]" /><h2 className="font-heading text-2xl font-bold">Why this record is useful</h2></div><div className="mt-4 grid gap-2 text-xs leading-5 text-slate-600 sm:grid-cols-2"><p><strong className="text-[#08263c]">Relationship:</strong> {relationshipLabels[university.relationshipType]}</p><p><strong className="text-[#08263c]">Program alignment:</strong> Tuition, scholarship, intake and requirements stay attached to the selected program.</p><p><strong className="text-[#08263c]">Recognition:</strong> {university.recognitionAuthority || 'Recognition is matched to the selected program and intended career route'}</p><p><strong className="text-[#08263c]">Cost clarity:</strong> University, official and EduExpress amounts are separated.</p></div>{sources.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{sources.map((source, index) => <a key={source} href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-black text-[#174f7a]">Official source {index + 1}<ExternalLink size={11} /></a>)}</div>}</div><Link href={assessmentHref} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Ask if this fits me <UserRoundCheck size={17} /></Link></div>
      </section>
    </article>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, FileCheck2, GraduationCap, Plane, Search, ShieldCheck, Sparkles, WalletCards, type LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Your Complete Study Abroad Journey',
  description: 'See the seven-stage EduExpress journey from education fit and applications to visa readiness, departure, arrival and university registration.',
  alternates: { canonical: '/your-study-journey' },
  openGraph: {
    title: 'Your Complete Study Abroad Journey',
    description: 'See every stage from education fit and applications to visa readiness, departure and university registration.',
    url: '/your-study-journey',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — the complete study journey' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Complete Study Abroad Journey',
    description: 'See every stage from education fit and applications to visa readiness, departure and university registration.',
    images: ['/og-image.jpg'],
  },
};

type JourneyStage = {
  id: string;
  number: string;
  title: string;
  promise: string;
  work: string[];
  output: string;
  owner: string;
  icon: LucideIcon;
  image?: string;
};

const stages: JourneyStage[] = [
  {
    id: 'education-fit',
    number: '01',
    title: 'Open your education profile',
    promise: 'The journey begins with your academic reality, goals and family budget—not a pre-selected country.',
    work: ['Review level, results and study gaps', 'Understand subject and career direction', 'Record budget, intake and language readiness'],
    output: 'Education profile',
    owner: 'Student + EduExpress counselor',
    icon: Sparkles,
    image: '/images/office/counselling-office.webp',
  },
  {
    id: 'compare-options',
    number: '02',
    title: 'Compare suitable options',
    promise: 'Countries, universities and programs are compared against the same education-fit questions.',
    work: ['Check institution and program recognition', 'Compare entry requirements and curriculum fit', 'Identify risks, missing facts and alternatives'],
    output: 'EduFit comparison',
    owner: 'EduExpress research + counseling',
    icon: Search,
  },
  {
    id: 'clear-costs',
    number: '03',
    title: 'See the complete cost',
    promise: 'A scholarship or tuition figure is not the whole financial decision.',
    work: ['Separate university, official and EduExpress charges', 'Add living, travel and document-related costs', 'Record payment timing, recipient and known conditions'],
    output: 'ClearCost view',
    owner: 'EduExpress explains; family decides',
    icon: WalletCards,
  },
  {
    id: 'application-file',
    number: '04',
    title: 'Build and submit the application file',
    promise: 'Documents are prepared against the selected institution’s current requirements.',
    work: ['Create the document checklist', 'Check consistency, translations and required formats', 'Record submissions and outstanding conditions'],
    output: 'Application Proof Pack',
    owner: 'Student supplies originals; EduExpress supports preparation',
    icon: ClipboardCheck,
    image: '/images/office/admission-packets.webp',
  },
  {
    id: 'visa-to-registration',
    number: '05',
    title: 'Admission and visa readiness',
    promise: 'An offer is checked for conditions, then the visa file is prepared against official requirements.',
    work: ['Review offer conditions and next deadlines', 'Build the visa-readiness checklist', 'Explain evidence gaps and authority-controlled decisions'],
    output: 'Offer + visa checklist',
    owner: 'University and authority decide; EduExpress prepares',
    icon: ShieldCheck,
  },
  {
    id: 'departure',
    number: '06',
    title: 'Prepare to fly',
    promise: 'Departure is planned as a handover into student life, not the end of the service story.',
    work: ['Review travel and arrival documents', 'Prepare first-day essentials and contact plan', 'Confirm institution arrival instructions'],
    output: 'Departure and arrival plan',
    owner: 'Student + family + EduExpress',
    icon: Plane,
    image: '/images/students/departure-airport.webp',
  },
  {
    id: 'registration',
    number: '07',
    title: 'Arrive and register at university',
    promise: 'The visible journey closes when the student reaches campus and understands the registration steps.',
    work: ['Follow the institution arrival process', 'Complete required registration steps', 'Know where to seek campus and emergency support'],
    output: 'Registration completion check',
    owner: 'Student + university, with EduExpress guidance',
    icon: GraduationCap,
    image: '/images/students/campus-nuist.webp',
  },
];

export default function StudyJourneyPage() {
  return (
    <main className="min-h-screen bg-white text-[#08263c]">
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-16 pt-32 text-white sm:px-8 sm:pb-24 sm:pt-40 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(100,181,223,.22),transparent_28%)]" />
        <div className="relative mx-auto max-w-[1360px]">
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-white/60"><Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span> Your Study Journey</nav>
          <div className="mt-10 grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
            <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#8ed0ee]">File open → university registration</p><h1 className="mt-5 max-w-[11ch] text-[clamp(3.6rem,7vw,7.6rem)] font-black leading-[.86] tracking-[-.07em]">See your whole journey.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">Seven visible stages. A clear output from each. Written responsibilities throughout—so your family understands what happens next.</p><Link href="/education-fit-assessment" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-[#e34c43] px-7 text-sm font-black text-white">Start stage one free <ArrowRight size={17} /></Link></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">{stages.map(stage => <a key={stage.number} href={`#${stage.id}`} className="group rounded-2xl border border-white/15 bg-white/[.06] p-4 transition hover:bg-white/[.12]"><span className="text-[10px] font-black tracking-[.16em] text-[#8ed0ee]">{stage.number}</span><strong className="mt-2 block text-sm leading-5">{stage.title}</strong></a>)}</div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#174f7a]/12 bg-[#eaf7fc] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4"><p className="text-sm font-black">Every stage answers three questions: what happens, what you receive, who owns the decision.</p><Link href="/proof-library" className="inline-flex items-center gap-2 text-sm font-black text-[#17699a]">Inspect real work proof <ArrowRight size={15} /></Link></div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="space-y-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const reverse = index % 2 === 1;
              return (
                <article id={stage.id} key={stage.number} className="scroll-mt-32 overflow-hidden rounded-[32px] border border-[#174f7a]/12 bg-[#f8fbfd]">
                  <div className={`grid ${stage.image ? 'lg:grid-cols-2' : ''}`}>
                    {stage.image && <figure className={`relative min-h-[320px] ${reverse ? 'lg:order-2' : ''}`}><Image src={stage.image} alt={`${stage.title} in the EduExpress student journey`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#061c2d]/55 to-transparent" /><figcaption className="absolute bottom-5 left-5 rounded-full bg-[#08263c]/85 px-4 py-2 text-[10px] font-black uppercase tracking-[.14em] text-white backdrop-blur">Stage {stage.number}</figcaption></figure>}
                    <div className={`p-6 sm:p-9 lg:p-12 ${reverse && stage.image ? 'lg:order-1' : ''}`}>
                      <div className="flex items-start justify-between gap-6"><span className="grid size-12 place-items-center rounded-2xl bg-[#dff3fb] text-[#17699a]"><Icon size={24} /></span><span className="text-xs font-black tracking-[.18em] text-[#e34c43]">{stage.number} / 07</span></div>
                      <h2 className="mt-8 text-3xl font-black tracking-[-.04em] sm:text-4xl">{stage.title}</h2>
                      <p className="mt-4 text-base leading-7 text-slate-600">{stage.promise}</p>
                      <ul className="mt-6 grid gap-3">{stage.work.map(item => <li key={item} className="flex gap-3 text-sm font-bold text-[#23455d]"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#25865f]" />{item}</li>)}</ul>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white p-4"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#17699a]">What you receive</p><strong className="mt-2 block text-sm">{stage.output}</strong></div><div className="rounded-2xl bg-white p-4"><p className="text-[10px] font-black uppercase tracking-[.14em] text-[#17699a]">Responsibility</p><strong className="mt-2 block text-sm">{stage.owner}</strong></div></div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf7fc] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.08fr_.92fr]">
          <div className="rounded-[32px] bg-white p-7 sm:p-10"><span className="grid size-12 place-items-center rounded-2xl bg-[#eaf8f1] text-[#25865f]"><FileCheck2 size={23} /></span><h2 className="mt-6 text-4xl font-black tracking-[-.045em]">Proof travels with the journey.</h2><p className="mt-4 text-base leading-8 text-slate-600">EduExpress publishes privacy-safe examples of admission work, document records and institutional evidence. Your own file remains private.</p><Link href="/proof-library" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#17699a]">Open proof library <ArrowRight size={16} /></Link></div>
          <div className="rounded-[32px] bg-[#08263c] p-7 text-white sm:p-10"><p className="text-xs font-black uppercase tracking-[.16em] text-[#8ed0ee]">Important boundary</p><h2 className="mt-5 text-3xl font-black">Support is not a guarantee.</h2><p className="mt-4 text-sm leading-7 text-white/70">Universities decide admission and scholarships. Government authorities decide visas and permits. EduExpress can compare, prepare, check, explain and support—but cannot replace an official decision.</p><Link href="/better-education-standard" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#8ed0ee]">Read our standard <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12"><div className="mx-auto flex max-w-[1180px] flex-col items-center rounded-[36px] bg-[#e34c43] px-7 py-14 text-center text-white sm:px-12"><p className="text-xs font-black uppercase tracking-[.18em] text-white/70">Your next honest step</p><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.05em] sm:text-6xl">Open stage one with your real profile.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/80">The free assessment gives your counselor the context needed to compare education routes responsibly.</p><Link href="/education-fit-assessment" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#b73531]">Start my Education Fit Assessment <ArrowRight size={17} /></Link></div></section>
    </main>
  );
}

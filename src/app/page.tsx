import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  Landmark,
  ScanSearch,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import DestinationDecisionDesk from '@/components/home/DestinationDecisionDesk';
import ChinaFlagshipRecord from '@/components/home/ChinaFlagshipRecord';

export const metadata: Metadata = {
  title: { absolute: 'Education Consultancy in Bangladesh | EduExpress International' },
  description: 'Choose better education abroad with clear costs and written proof. Compare active study destinations, education quality, recognition and career fit before you commit.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Education Consultancy in Bangladesh | EduExpress International',
    description: 'Better Education. Clear Costs. Written Proof.',
    url: '/',
    type: 'website',
  },
};

const artifacts = [
  {
    number: '01',
    title: 'EduFit Decision Report',
    label: 'Options explained',
    copy: 'At least three suitable routes with a written reason to recommend, reconsider or reject each one.',
    icon: ScanSearch,
    link: '/better-education-standard',
  },
  {
    number: '02',
    title: 'ClearCost Sheet',
    label: 'Every recipient named',
    copy: 'University, embassy and other outside costs separated from EduExpress charges and refund terms.',
    icon: WalletCards,
    link: '/fees-and-transparency',
  },
  {
    number: '03',
    title: 'Application Proof Pack',
    label: 'Every step recorded',
    copy: 'Submission references, receipts, offer records, deadlines and the responsible team member.',
    icon: ClipboardCheck,
    link: '/how-we-verify-universities',
  },
  {
    number: '04',
    title: 'Visa Readiness Record',
    label: 'Gaps made visible',
    copy: 'A current document checklist, missing items, official references and the next responsibility recorded in writing.',
    icon: Fingerprint,
    link: '/services',
  },
];

const universalPromises = [
  { number: '01', title: 'Education fit comes first', copy: 'Program, entry and career logic before a recommendation.', icon: BookOpenCheck, link: '/better-education-standard' },
  { number: '02', title: 'Complete cost is made visible', copy: 'Tuition, living, official fees and our charges separated.', icon: WalletCards, link: '/fees-and-transparency' },
  { number: '03', title: 'Institutions are checked', copy: 'Recognition, program evidence and current information reviewed.', icon: Landmark, link: '/how-we-verify-universities' },
  { number: '04', title: 'Application work leaves proof', copy: 'References, receipts, offers and responsibilities recorded.', icon: ClipboardCheck, link: '/services' },
];

const standards = [
  { title: 'Recognition', copy: 'Registry and accreditor evidence', icon: Landmark },
  { title: 'Academic fit', copy: 'Entry and curriculum match', icon: BookOpenCheck },
  { title: 'Career value', copy: 'Realistic progression logic', icon: BriefcaseBusiness },
  { title: 'Financial reality', copy: 'Full education and living cost', icon: CircleDollarSign },
  { title: 'Visa readiness', copy: 'Current document gaps', icon: FileCheck2 },
  { title: 'Student support', copy: 'Safety, scope and responsibility', icon: ShieldCheck },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#f4f8fa] text-[#08263c]">
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-32 md:pt-40 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
            <span>EduExpress International Bangladesh</span>
            <span>Decision desk open in Dhanmondi</span>
            <span>Active destination network</span>
          </div>

          <div className="grid min-w-0 items-end gap-12 xl:grid-cols-[1.02fr_.98fr]">
            <div className="relative z-10 min-w-0">
              <p className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
                <Fingerprint className="mt-0.5 shrink-0 text-[#8ed0ee] sm:mt-0" size={16} />
                <span className="min-w-0 whitespace-normal">Bangladesh&apos;s Evidence First Education Consultancy</span>
              </p>
              <h1 className="mt-7 w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.022em]">
                Choose better education abroad <span className="relative mt-3 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">with clear costs</span> and written proof
              </h1>
              <p className="mt-8 max-w-2xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
                We compare education quality, cost, recognition and career fit before recommending an option. Scholarship options are assessed after education fit.
              </p>
              <div className="mt-9 flex min-w-0 flex-col gap-3 sm:flex-row">
                <Link href="/contact?service=education-fit-assessment" className="group inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-4 py-4 text-center text-sm font-black text-white hover:bg-[#174f7a] sm:w-auto sm:px-6 sm:text-base">
                  Get My Free Fit Assessment <ArrowUpRight className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={19} />
                </Link>
                <Link href="/study-in-china-from-bangladesh" className="inline-flex w-full items-center justify-center gap-3 border-2 border-[#08263c] bg-white/50 px-4 py-4 text-center text-sm font-black hover:bg-white sm:w-auto sm:px-6 sm:text-base">
                  Explore Study in China <ArrowRight className="shrink-0" size={19} />
                </Link>
              </div>
              <a href="#decision-desk" className="group mt-11 grid max-w-xl grid-cols-[auto_1fr_auto] items-center border-y border-[#174f7a]/35 bg-white/40 text-[#08263c] transition hover:bg-white">
                <span className="grid min-h-20 min-w-20 place-items-center border-r border-[#174f7a]/25 font-heading text-4xl font-bold text-[#174f7a]">10</span>
                <span className="px-4"><strong className="block font-heading text-lg">Open the destination navigator</strong><small className="mt-1 block text-xs font-semibold text-slate-500">Inspect active study routes before choosing one</small></span>
                <span className="mr-4 grid size-11 shrink-0 place-items-center rounded-full bg-[#08263c] text-white transition group-hover:translate-y-1 group-hover:bg-[#174f7a]"><ArrowDown size={17} /></span>
              </a>
            </div>

            <div id="decision-desk" className="min-w-0 max-w-full scroll-mt-32 xl:translate-y-10">
              <DestinationDecisionDesk />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="every-student-standard" className="border-y border-[#08263c] bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[.8fr_repeat(4,1fr)]">
          <div className="bg-[#64b5df] p-6 text-[#08263c] lg:p-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">For every destination</p>
            <h2 id="every-student-standard" className="mt-3 font-heading text-2xl font-bold leading-tight">One standard for every student</h2>
          </div>
          {universalPromises.map(({ number, title, copy, icon: Icon, link }) => (
            <Link key={title} href={link} className="group relative border-b border-white/15 p-5 hover:bg-white/5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-[#64b5df]">{number}</span><Icon size={19} className="text-[#64b5df]" /></div>
              <h3 className="mt-7 font-heading text-lg font-bold leading-6">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/50">{copy}</p>
              <ArrowUpRight size={14} className="absolute bottom-5 right-5 text-white/20 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#8ed0ee]" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Choosing an education consultancy in Bangladesh</p>
              <h2 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Good advice should leave a paper trail</h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">Students looking for the best education consultancy in Bangladesh should compare how institutions are verified, costs are separated and application work is recorded. We make those checks visible in four documents.</p>
              <Link href="/fees-and-transparency" className="mt-8 inline-flex items-center gap-2 font-black text-[#174f7a]">See our transparency system <ArrowRight size={18} /></Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {artifacts.map(({ number, title, label, copy, icon: Icon, link }, index) => (
                <Link
                  href={link}
                  key={title}
                  className={`group relative overflow-hidden border-2 border-[#08263c] p-6 transition hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#174f7a] sm:p-7 md:min-h-80 ${index === 0 ? 'bg-[#174f7a] text-white' : index === 3 ? 'bg-[#bde7f8]' : 'bg-[#f4f8fa]'}`}
                >
                  <div className="flex items-start justify-between"><span className="font-mono text-sm font-black">DOC {number}</span><Icon size={35} strokeWidth={1.6} /></div>
                  <div className="mt-8 md:mt-20">
                    <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? 'text-[#bde7f8]' : 'text-[#174f7a]'}`}>{label}</p>
                    <h3 className="mt-3 font-heading text-3xl font-bold tracking-tight">{title}</h3>
                    <p className={`mt-4 leading-7 ${index === 0 ? 'text-white/75' : 'text-slate-700'}`}>{copy}</p>
                  </div>
                  <ArrowUpRight className="absolute bottom-6 right-6 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08263c] px-5 py-16 text-white sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#64b5df]">The Better Education Standard</p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Six checks before one recommendation</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">The answer is not simply where you can go. The answer is where the education, money, recognition and future make sense together.</p>
            </div>
            <div className="grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-3">
              {standards.map(({ title, copy, icon: Icon }, index) => (
                <article key={title} className="border-b border-r border-white/20 p-5 sm:min-h-56 sm:p-6">
                  <span className="font-mono text-xs font-bold text-white/35">0{index + 1}</span>
                  <Icon className="mt-3 text-[#64b5df] sm:mt-8" size={28} strokeWidth={1.5} />
                  <h3 className="mt-4 font-heading text-xl font-bold">{title}</h3>
                  <p className="mt-2 leading-6 text-white/55">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChinaFlagshipRecord />

      <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Compare before you commit</p>
            <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Bring us your results, budget and ambition. Leave with a clearer decision.</h2>
          </div>
          <Link href="/contact?service=education-fit-assessment" className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-7 py-5 text-base font-black text-white hover:bg-[#174f7a] sm:text-lg lg:w-auto lg:min-w-64">Get my free fit assessment <ArrowUpRight size={20} /></Link>
          </div>
          <div className="mt-10 grid border-l border-t border-[#08263c]/35 sm:mt-12 sm:grid-cols-3">
            {[['01', 'Academic record', 'Your latest results and study background'], ['02', 'Subject direction', 'The program or career area you want to explore'], ['03', 'Budget reality', 'A practical range for tuition and living costs']].map(([number, title, copy]) => (
              <div key={number} className="border-b border-r border-[#08263c]/35 p-5 sm:p-6"><span className="font-mono text-[10px] font-black text-[#174f7a]">BRING {number}</span><h3 className="mt-3 font-heading text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#0b2f4a]/70">{copy}</p></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

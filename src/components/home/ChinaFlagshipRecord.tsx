import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  Check,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  Languages,
  MapPinCheck,
  Plane,
  PlaneTakeoff,
  ScanSearch,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

const guideLinks = [
  ['University comparison', '/china-universities'],
  ['Scholarship conditions', '/china-scholarships-bangladesh'],
  ['X1 and X2 visa guide', '/china-student-visa-bangladesh'],
  ['First year cost planner', '/study-in-china-cost-bangladesh'],
  ['English language options', '/study-in-china-without-ielts'],
  ['MBBS recognition checks', '/mbbs-in-china-bangladesh'],
  ['Intakes and deadlines', '/china-intakes-deadlines'],
  ['Student life in China', '/life-in-china-bangladeshi-students'],
];

const decisionPath = [
  { title: 'Compare fit', icon: ScanSearch },
  { title: 'See total cost', icon: CircleDollarSign },
  { title: 'Track the file', icon: FileCheck2 },
  { title: 'Prepare the visa', icon: ShieldCheck },
  { title: 'Plan departure', icon: PlaneTakeoff },
];

const chinaFitReasons = [
  {
    eyebrow: 'Scholarship opportunities',
    title: 'Up to 100% tuition coverage may be available',
    copy: 'Selected universities may offer awards covering up to the full tuition amount. Eligibility, coverage, availability and renewal conditions are checked before application.',
    link: '/china-scholarships-bangladesh',
    icon: Award,
    featured: true,
  },
  {
    eyebrow: 'University choice',
    title: 'Top ranked university options',
    copy: 'Compare named ranking sources with program strength, recognition and actual student fit.',
    link: '/china-universities',
    icon: Building2,
  },
  {
    eyebrow: 'Affordability',
    title: 'Competitive tuition and living costs',
    copy: 'See the complete first year cost, not tuition alone, with current assumptions made clear.',
    link: '/study-in-china-cost-bangladesh',
    icon: BadgeDollarSign,
  },
  {
    eyebrow: 'Medicine',
    title: 'MBBS with licensing checks first',
    copy: 'Recognition, eligibility and the pathway to practise are reviewed before price or promotion.',
    link: '/mbbs-in-china-bangladesh',
    icon: Stethoscope,
  },
  {
    eyebrow: 'Engineering',
    title: 'Aeronautical and aerospace pathways',
    copy: 'Compare curriculum, teaching language, laboratory access, recognition and entry requirements.',
    link: '/china-universities',
    icon: Plane,
  },
  {
    eyebrow: 'Teaching language',
    title: 'English taught program options',
    copy: 'Availability and English requirements are verified for the specific university and program.',
    link: '/study-in-china-without-ielts',
    icon: Languages,
  },
  {
    eyebrow: 'Visa record',
    title: '98% recorded success through 2025',
    copy: 'This company record through 2025 is paired with an individual visa readiness check for every student.',
    link: '/china-student-visa-bangladesh',
    icon: ShieldCheck,
  },
];

export default function ChinaFlagshipRecord() {
  return (
    <section className="relative overflow-hidden bg-[#061b2a] px-4 py-24 text-white md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(100,181,223,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(100,181,223,0.08)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="pointer-events-none absolute -right-52 top-6 size-[520px] rounded-full border-[76px] border-[#64b5df]/5" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 border-b border-white/20 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8ed0ee]"><span className="h-px w-10 bg-[#64b5df]" /> China flagship record</p>
            <h2 className="mt-5 max-w-5xl font-heading text-4xl font-bold leading-[1.06] tracking-[-0.02em] md:text-6xl lg:text-[4.6rem]">Our study in China record is built to be inspected</h2>
          </div>
          <Link href="/study-in-china-from-bangladesh" className="group inline-flex shrink-0 items-center gap-3 bg-[#64b5df] px-6 py-4 font-black text-[#08263c] hover:bg-white">Enter the China decision hub <ArrowUpRight size={19} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
        </div>

        <div className="mt-10">
          <div className="mb-6 grid gap-4 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">China fit spectrum</p>
              <h3 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">More than one reason to compare China</h3>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-white/60 lg:justify-self-end">For Bangladeshi students, the right reason may be program quality, a specialist subject, total cost, teaching language or an available scholarship. We compare those factors together instead of selling one headline.</p>
          </div>

          <div className="grid border-l border-t border-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {chinaFitReasons.map(({ eyebrow, title, copy, link, icon: Icon, featured }) => (
              <Link key={title} href={link} className={`group relative min-h-56 border-b border-r p-5 transition lg:p-6 ${featured ? 'border-[#08263c] bg-[#64b5df] text-[#08263c] sm:col-span-2' : 'border-white/20 bg-[#08263c]/75 hover:bg-[#0b2f4a]'}`}>
                <div className="flex items-start justify-between"><p className={`font-mono text-[9px] font-black uppercase tracking-[0.18em] ${featured ? 'text-[#174f7a]' : 'text-[#8ed0ee]'}`}>{eyebrow}</p><Icon size={22} className={featured ? 'text-[#174f7a]' : 'text-[#64b5df]'} /></div>
                <h4 className={`mt-9 max-w-xl font-heading font-bold leading-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{title}</h4>
                <p className={`mt-3 max-w-2xl text-xs leading-6 ${featured ? 'text-[#08263c]/75' : 'text-white/50'}`}>{copy}</p>
                <ArrowUpRight size={15} className={`absolute bottom-5 right-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 ${featured ? 'text-[#08263c]' : 'text-[#64b5df]'}`} />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[10px] leading-5 text-white/40">Scholarship and program availability can change by university, intake and applicant profile. Current coverage and conditions must be verified before application.</p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
          <article className="relative min-h-[650px] overflow-hidden border border-white/20 bg-[#174f7a] sm:min-h-[610px]">
            <Image src="/images/destinations/china.jpg" alt="China education destination record for Bangladeshi students" fill sizes="(max-width: 1280px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(6,27,42,0.98)_4%,rgba(8,38,60,0.94)_45%,rgba(8,38,60,0.25)_100%)]" />
            <div className="absolute right-5 top-5 flex size-28 rotate-6 flex-col items-center justify-center rounded-full border-2 border-[#8ed0ee]/70 bg-[#08263c]/65 text-center backdrop-blur sm:right-9 sm:top-9 sm:size-36">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#8ed0ee]">Operating</span>
              <strong className="font-heading text-3xl sm:text-5xl">2018</strong>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/60">to present</span>
            </div>

            <div className="relative flex min-h-[650px] max-w-[760px] flex-col justify-between p-6 sm:min-h-[610px] sm:p-10 lg:p-12">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.19em] text-[#8ed0ee]">Record CN 2018 2027</p>
                <h3 className="mt-5 max-w-xl font-heading text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl">Eight years of China service, shown with context</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/68 sm:text-base">The record connects university choice, scholarship conditions, full cost, visa readiness and arrival support. EduExpress is a guidance and application support company. No exclusive embassy authority is implied.</p>
              </div>

              <div>
                <div className="grid gap-px bg-white/20 sm:grid-cols-3">
                  <div className="bg-[#08263c]/90 p-5 backdrop-blur"><strong className="font-heading text-4xl text-[#8ed0ee] sm:text-5xl">2018</strong><span className="mt-2 block text-xs leading-5 text-white/60">China service operating since</span></div>
                  <div className="bg-[#08263c]/90 p-5 backdrop-blur"><strong className="font-heading text-4xl text-[#8ed0ee] sm:text-5xl">98%</strong><span className="mt-2 block text-xs leading-5 text-white/60">Recorded visa success rate through 2025</span></div>
                  <div className="bg-[#08263c]/90 p-5 backdrop-blur"><strong className="font-heading text-4xl text-[#8ed0ee] sm:text-5xl">2000+</strong><span className="mt-2 block text-xs leading-5 text-white/60">Students through B2C and B2B channels</span></div>
                </div>
                <p className="mt-4 max-w-2xl text-[10px] leading-5 text-white/45">Company records through 2025. The 2027 cycle is now in planning, with each university and authority issuing its own decision.</p>
              </div>
            </div>
          </article>

          <div className="grid gap-5">
            <article className="border border-[#64b5df]/55 bg-[#08263c] p-5 sm:p-7">
              <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-5">
                <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">China evidence library</p><h3 className="mt-2 font-heading text-3xl font-bold">Open the record you need</h3></div>
                <span className="font-mono text-[10px] text-white/35">08 guides</span>
              </div>
              <div className="mt-2 grid sm:grid-cols-2">
                {guideLinks.map(([title, href], index) => (
                  <Link href={href} key={href} className="group flex min-h-20 items-center justify-between gap-3 border-b border-white/15 px-2 py-3 sm:odd:border-r sm:odd:pr-4 sm:even:pl-4">
                    <span className="flex items-center gap-3"><span className="font-mono text-[9px] text-[#64b5df]">{String(index + 1).padStart(2, '0')}</span><span className="text-sm font-bold leading-5 text-white/80 group-hover:text-white">{title}</span></span>
                    <ArrowUpRight size={15} className="shrink-0 text-[#64b5df] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                ))}
              </div>
              <Link href="/success-stories/china" className="group mt-5 flex items-center justify-between bg-white/5 p-4 text-sm font-black hover:bg-white/10"><span className="flex items-center gap-3"><MapPinCheck size={18} className="text-[#64b5df]" /> View consent based China success stories</span><ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
            </article>

            <article className="relative overflow-hidden bg-[#64b5df] p-6 text-[#08263c] sm:p-8">
              <div className="absolute -right-6 -top-6 grid size-24 place-items-center rounded-full border-[14px] border-[#08263c]/10"><Check size={24} /></div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Visa first service rule</p>
              <h3 className="mt-3 max-w-xl font-heading text-3xl font-bold">Our charge and outside charges stay separate</h3>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7">No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third party fee required earlier must be itemized in writing before the student proceeds.</p>
              <Link href="/china-visa-first-policy" className="mt-5 inline-flex items-center gap-2 border-b-2 border-[#08263c] pb-1 text-sm font-black">Read the complete service terms <ArrowRight size={15} /></Link>
            </article>
          </div>
        </div>

        <div className="mt-5 border border-white/20 bg-[#08263c]/70 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[.3fr_.7fr] lg:items-center">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">One connected route</p>
              <h3 className="mt-2 font-heading text-2xl font-bold">From search to arrival</h3>
            </div>
            <ol className="grid gap-px bg-white/15 sm:grid-cols-5">
              {decisionPath.map(({ title, icon: Icon }, index) => (
                <li key={title} className="group relative flex items-center gap-3 bg-[#08263c] p-4 sm:min-h-24 sm:flex-col sm:items-start sm:justify-between">
                  <span className="flex items-center gap-2"><span className="font-mono text-[9px] text-[#64b5df]">0{index + 1}</span><Icon size={16} className="text-[#64b5df]" /></span>
                  <strong className="text-xs leading-5">{title}</strong>
                  {index < decisionPath.length - 1 && <ArrowRight size={13} className="absolute -right-2 top-1/2 z-10 hidden text-[#64b5df] sm:block" />}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-6 text-xs text-white/50">
          <p className="flex items-center gap-2"><GraduationCap size={16} className="text-[#64b5df]" /> Scholarships are assessed after education fit.</p>
          <p>Official sources and verification dates are stored for time sensitive facts.</p>
        </div>
      </div>
    </section>
  );
}

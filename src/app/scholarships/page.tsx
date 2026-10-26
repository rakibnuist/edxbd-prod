import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, CheckCircle2, CircleAlert, FileSearch, GraduationCap, WalletCards } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Scholarship Guidance for Bangladeshi Students',
  description: 'Understand scholarship eligibility, coverage, renewal conditions, remaining costs and application readiness before choosing an overseas education route.',
  alternates: { canonical: '/scholarships' },
  openGraph: {
    title: 'Scholarship Guidance for Bangladeshi Students',
    description: 'Understand eligibility, coverage, renewal conditions and the costs that remain after an award.',
    url: '/scholarships',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — scholarship guidance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarship Guidance for Bangladeshi Students',
    description: 'Understand eligibility, coverage, renewal conditions and the costs that remain after an award.',
    images: ['/og-image.jpg'],
  },
};

const checks = [
  { icon: GraduationCap, title: 'Education fit', copy: 'The program and university still need to fit your academic direction, recognition needs and career goal.' },
  { icon: BadgeDollarSign, title: 'Exact coverage', copy: 'Confirm whether the award covers tuition only or also accommodation, stipend, insurance or other items.' },
  { icon: FileSearch, title: 'Eligibility and evidence', copy: 'Check results, language, portfolio, tests, documents and any separate scholarship application.' },
  { icon: WalletCards, title: 'Remaining family cost', copy: 'Calculate what remains after the award, including living, travel, official and document-related costs.' },
];

export default function ScholarshipsPage() {
  return (
    <main className="min-h-screen bg-white text-[#08263c]">
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-32 text-white sm:px-8 sm:pt-40 lg:px-12">
        <div className="absolute right-[-7rem] top-20 size-[420px] rounded-full border-[5rem] border-[#64b5df]/10" />
        <div className="relative mx-auto max-w-[1260px]">
          <nav aria-label="Breadcrumb" className="text-xs font-bold text-white/60"><Link href="/">Home</Link> <span aria-hidden>/</span> Scholarships</nav>
          <p className="mt-10 text-xs font-black uppercase tracking-[.18em] text-[#8ed0ee]">Scholarship guidance</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3.5rem,7vw,7rem)] font-black leading-[.87] tracking-[-.07em]">Funding should improve a good decision—not create a bad one.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">We assess scholarships after education fit. The useful question is not only “how much?” It is also what the award covers, what keeps it active and what your family still needs to pay.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/education-fit-assessment" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#e34c43] px-7 text-sm font-black text-white">Check my education and funding fit <ArrowRight size={17} /></Link><Link href="/china-scholarships-bangladesh" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-sm font-black text-white">Explore China scholarships <ArrowRight size={17} /></Link></div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1260px]">
          <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#17699a]">Four checks before “apply”</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-6xl">Read past the scholarship headline.</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">{checks.map(({ icon: Icon, title, copy }, index) => <article key={title} className="rounded-[28px] border border-[#174f7a]/12 bg-[#f7fbfd] p-7 sm:p-8"><div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#dff3fb] text-[#17699a]"><Icon size={23} /></span><span className="text-xs font-black tracking-[.16em] text-[#e34c43]">0{index + 1}</span></div><h2 className="mt-7 text-2xl font-black">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#eaf7fc] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1160px] gap-8 lg:grid-cols-[.95fr_1.05fr]">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#17699a]">What a written comparison should show</p><h2 className="mt-4 text-4xl font-black tracking-[-.045em]">The award and the cost beside it.</h2><p className="mt-5 text-base leading-8 text-slate-600">A scholarship is only meaningful when the official conditions and the remaining financial responsibility are visible together.</p></div>
          <div className="grid gap-3">{['Official scholarship name and source', 'Eligible university, program and intake', 'Award amount or exact coverage', 'Renewal or academic conditions', 'Application and result timeline', 'Remaining first-year and total-program costs'].map(item => <p key={item} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-bold"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#25865f]" />{item}</p>)}</div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1160px] gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] bg-[#08263c] p-7 text-white sm:p-10"><CircleAlert size={28} className="text-[#8ed0ee]" /><h2 className="mt-6 text-3xl font-black">No scholarship guarantee.</h2><p className="mt-4 text-sm leading-7 text-white/70">Scholarship bodies and universities decide awards. Published criteria, deadlines and availability can change. EduExpress can help compare, prepare and verify the current route, but cannot guarantee an award.</p><Link href="/better-education-standard" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#8ed0ee]">See our evidence standard <ArrowRight size={16} /></Link></div>
          <div className="rounded-[30px] border border-[#174f7a]/12 bg-[#f7fbfd] p-7 sm:p-10"><p className="text-xs font-black uppercase tracking-[.16em] text-[#17699a]">Start with fit</p><h2 className="mt-5 text-3xl font-black">Bring your profile, not just a scholarship screenshot.</h2><p className="mt-4 text-sm leading-7 text-slate-600">Your results, subject, budget, intake and language readiness determine which opportunities are worth checking.</p><Link href="/education-fit-assessment" className="mt-7 inline-flex min-h-13 items-center gap-2 rounded-full bg-[#e34c43] px-6 text-sm font-black text-white">Start free assessment <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  );
}

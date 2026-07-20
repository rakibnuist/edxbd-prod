import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  Building2,
  AlertTriangle,
  CircleDollarSign,
  GraduationCap,
  Languages,
  CalendarClock,
  Check,
  X,
  BadgeCheck,
  FileCheck2,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

const canonicalUrl = 'https://eduexpressint.com/mbbs-in-china-bangladesh';
const verifiedDate = '2026-07-20';

export const metadata: Metadata = {
  title: { absolute: 'MBBS in China for Bangladeshi Students — Recognition, Licensing & 2026/27 Cost' },
  description:
    'MBBS in China for Bangladeshi students, explained recognition-first: MoE-approved English-medium medical universities, BMDC licensing reality, a full written cost breakdown, eligibility and intakes — verified before you apply.',
  alternates: { canonical: '/mbbs-in-china-bangladesh' },
  openGraph: {
    title: 'MBBS in China for Bangladeshi Students | EduExpress International',
    description: 'Recognition and BMDC licensing checked first, then the complete cost. MoE-approved English-medium universities, eligibility and intakes for Bangladeshi students.',
    url: '/mbbs-in-china-bangladesh',
    type: 'website',
  },
};

// Recognition / licensing leads (per the evidence-first MBBS rule).
const standards = [
  {
    icon: Building2,
    title: 'MoE-approved English-medium list',
    detail: "China's Ministry of Education publishes an annual list of universities authorised to enrol international students for English-taught undergraduate clinical medicine (MBBS). A university outside that list, or a program not on it, is a red flag we check first.",
  },
  {
    icon: BadgeCheck,
    title: 'WHO / WDOMS listing',
    detail: 'A medical school should appear in the World Directory of Medical Schools (WDOMS). Listing supports later licensing steps abroad — but listing alone is not a licence to practise anywhere.',
  },
  {
    icon: ShieldCheck,
    title: 'BMDC licensing reality',
    detail: 'To practise in Bangladesh, a foreign medical graduate must meet Bangladesh Medical & Dental Council (BMDC) eligibility and pass its registration examination. We confirm your eligibility BEFORE you apply, not after you graduate.',
  },
];

// Complete cost — current assumptions, confirmed per university during assessment.
const costRows: [string, string, string][] = [
  ['Tuition (English MBBS)', '$3,000 – $7,000 / year', 'Varies by university and city'],
  ['On-campus hostel', '$500 – $1,500 / year', 'Cheapest option for international students'],
  ['Living (food, transport, personal)', '$200 – $400 / month', '≈ $2,400 – $4,800 / year'],
  ['Medical insurance (mandatory)', '$100 – $200 / year', 'Required for the residence permit'],
  ['Visa & residence permit', '$100 – $200', 'Initial issuance and conversion'],
  ['Medical check, translation, courier', 'Itemised', 'Third-party, listed in writing before payment'],
  ['Return airfare', '$300 – $800', 'Depends on season and route'],
];

const eligibility = [
  'HSC (or equivalent) with Biology, Chemistry and Physics',
  'Competitive marks in 12th-grade science (many universities look for ~60%+)',
  'Age within the university and MoE range (commonly 17–25)',
  'For practice in Bangladesh: combined SSC + HSC GPA meeting BMDC guidance (check before applying)',
  'English evidence as required by the specific program (no universal IELTS exemption)',
];

const fits = [
  'Students who want a recognised medical route and will meet the licensing requirements to practise',
  'Applicants ready to verify the university, program and BMDC eligibility in writing before applying',
  'Families budgeting for the full six-year cost, not tuition alone',
];

const reconsider = [
  'Anyone promised a "guaranteed" seat, scholarship or visa — no one can guarantee those',
  'Students who cannot currently meet BMDC eligibility to practise in Bangladesh',
  'Applicants choosing purely on the lowest tuition without checking recognition and licensing',
];

const faqs = [
  {
    question: 'Is an MBBS from China recognised in Bangladesh?',
    answer: 'Recognition of the university — MoE-approved and WHO/WDOMS-listed — is the starting point, not the finish line. To practise in Bangladesh you must meet BMDC eligibility and pass its registration examination. We verify the specific university\'s standing and your BMDC eligibility before you apply.',
  },
  {
    question: 'How much does MBBS in China cost for a Bangladeshi student?',
    answer: 'Tuition is typically about $3,000–$7,000 per year. A realistic all-in estimate for the full programme — tuition, hostel, living, insurance and travel over roughly six years — is about $25,000–$50,000, depending on the university and city. We prepare a written ClearCost sheet with current figures for your shortlisted universities.',
  },
  {
    question: 'Can I study MBBS in China without IELTS?',
    answer: 'Some English-medium programmes accept other evidence of English ability, but this is decided program by program — there is no universal IELTS exemption. We confirm the exact rule for each university before recommending it.',
  },
  {
    question: 'How long is the MBBS programme?',
    answer: 'Usually six years: five years of academic and pre-clinical/clinical coursework plus one year of compulsory internship at affiliated university hospitals.',
  },
  {
    question: 'Is the programme taught in English?',
    answer: 'At MoE-designated universities the undergraduate clinical medicine programme is English-medium. Basic Chinese is still useful — and sometimes expected — for the hospital and clinical years, so it is worth planning for.',
  },
  {
    question: 'Can I practise in the US or UK after MBBS in China?',
    answer: 'Only after completing that country\'s own licensing route — for example USMLE and ECFMG certification for the United States, or PLAB and GMC registration for the United Kingdom. The degree\'s recognition and the licensing examination are separate steps.',
  },
  {
    question: 'When do MBBS intakes start?',
    answer: 'Most MBBS intakes begin in September; a few universities also run other intakes. Every deadline must be confirmed per university before it is treated as open.',
  },
  {
    question: 'Does EduExpress charge before the China visa is approved?',
    answer: 'No file-opening charge and no EduExpress service fee before your China visa is approved. Any university, embassy, medical, translation, courier or deposit fee required earlier is a third-party charge and is itemised in writing before you proceed.',
  },
];

const sources = [
  { label: 'Bangladesh Medical & Dental Council (BMDC)', href: 'https://www.bmdc.org.bd/' },
  { label: 'BMDC foreign-graduate requirements', href: 'https://www.bmdc.org.bd/forms-foreign' },
  { label: 'Campus China / Chinese Government Scholarship', href: 'https://www.campuschina.org/' },
  { label: 'World Directory of Medical Schools (WDOMS)', href: 'https://www.wdoms.org/' },
  { label: 'Chinese Embassy in Bangladesh', href: 'https://bd.china-embassy.gov.cn/eng/' },
];

const related = [
  { label: 'Compare China universities', href: '/china-universities' },
  { label: 'Full study cost planner', href: '/study-in-china-cost-bangladesh' },
  { label: 'Scholarships for Bangladeshi students', href: '/china-scholarships-bangladesh' },
  { label: 'X1 / X2 student visa guide', href: '/china-student-visa-bangladesh' },
  { label: 'How we verify universities', href: '/how-we-verify-universities' },
  { label: 'Study in China hub', href: '/study-in-china-from-bangladesh' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalWebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: 'MBBS in China for Bangladeshi Students',
      description: 'Recognition, BMDC licensing, complete cost, eligibility and intakes for studying MBBS in China from Bangladesh.',
      inLanguage: 'en-BD',
      dateModified: verifiedDate,
      reviewedBy: { '@id': 'https://eduexpressint.com/#organization' },
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
      isPartOf: { '@id': 'https://eduexpressint.com/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eduexpressint.com/' },
        { '@type': 'ListItem', position: 2, name: 'Study in China', item: 'https://eduexpressint.com/study-in-china-from-bangladesh' },
        { '@type': 'ListItem', position: 3, name: 'MBBS in China', item: canonicalUrl },
      ],
    },
  ],
};

export default function MbbsInChinaBangladeshPage() {
  return (
    <article className="bg-[#f4f8fa] text-[#08263c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-16 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="pointer-events-none absolute right-[-10rem] top-[-12rem] size-[34rem] rounded-full border-[5rem] border-[#64b5df]/10" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
            <Link href="/" className="hover:text-[#8ed0ee]">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-[#8ed0ee]">Study in China</Link> <span aria-hidden>/</span> MBBS in China
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-[#8ed0ee]/30 bg-[#174f7a]/40 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Stethoscope size={14} /> Recognition &amp; licensing checked first
            </div>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
              MBBS in China from Bangladesh — the recognised route, verified before you pay
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Most guides open with the cheapest tuition. We open with the question that decides your career: is the
              university recognised, and can you licence and practise afterwards? Then we show the complete, written cost.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] font-bold uppercase tracking-wider text-white/70">
              <span className="flex items-center gap-2"><Check size={14} className="text-[#64b5df]" /> MoE-approved list</span>
              <span className="flex items-center gap-2"><Check size={14} className="text-[#64b5df]" /> BMDC eligibility</span>
              <span className="flex items-center gap-2"><Check size={14} className="text-[#64b5df]" /> Full ClearCost sheet</span>
            </div>

            <a href="#mbbs-assessment" className="mt-8 inline-flex items-center gap-2 bg-[#64b5df] px-7 py-4 text-sm font-black text-[#08263c] transition hover:bg-white">
              Check My Medical Eligibility <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* RECOGNITION & LICENSING FIRST */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#174f7a]">Before price — recognition &amp; licensing</span>
          <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Three checks that decide whether the degree is worth it</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {standards.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="border border-[#174f7a]/15 bg-white p-7 shadow-sm">
                  <span className="grid size-11 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={22} /></span>
                  <h3 className="mt-5 font-heading text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{s.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-4 border border-amber-300 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
            <div>
              <strong>The honest caveat:</strong> a WHO-listed, MoE-approved university is necessary but not sufficient.
              Practising in Bangladesh still requires meeting BMDC eligibility and passing its registration examination;
              practising elsewhere requires that country&apos;s own licensing exams. We map this pathway for you before you apply.
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT FITS / RECONSIDER */}
      <section className="bg-white px-5 py-16 border-y border-[#174f7a]/15 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
          <div className="border-t-4 border-[#174f7a] bg-[#f6f9fb] p-7">
            <h2 className="font-heading text-2xl font-bold">A strong fit for this route</h2>
            <ul className="mt-5 grid gap-3">
              {fits.map((f) => (
                <li key={f} className="flex gap-3 text-sm leading-6 text-slate-700"><Check size={16} className="mt-0.5 shrink-0 text-[#174f7a]" />{f}</li>
              ))}
            </ul>
          </div>
          <div className="border-t-4 border-amber-500 bg-[#f6f9fb] p-7">
            <h2 className="font-heading text-2xl font-bold">Who should reconsider</h2>
            <ul className="mt-5 grid gap-3">
              {reconsider.map((f) => (
                <li key={f} className="flex gap-3 text-sm leading-6 text-slate-700"><X size={16} className="mt-0.5 shrink-0 text-amber-600" />{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMPLETE COST */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#174f7a]">The complete cost, in writing</span>
          <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">What six years actually costs — not tuition alone</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            These are current planning ranges, verified {verifiedDate}. Your ClearCost sheet confirms the exact figures for
            each shortlisted university, separates every third-party charge, and states what EduExpress charges and when.
          </p>

          <div className="mt-8 overflow-hidden border border-[#174f7a]/15 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#08263c] text-white">
                  <th className="p-4 font-heading font-bold">Cost item</th>
                  <th className="p-4 font-heading font-bold">Typical range</th>
                  <th className="hidden p-4 font-heading font-bold sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map(([item, range, note], i) => (
                  <tr key={item} className={i % 2 ? 'bg-[#f6f9fb]' : 'bg-white'}>
                    <td className="border-t border-[#174f7a]/10 p-4 font-semibold text-[#08263c]">{item}</td>
                    <td className="border-t border-[#174f7a]/10 p-4 font-bold text-[#174f7a]">{range}</td>
                    <td className="hidden border-t border-[#174f7a]/10 p-4 text-slate-600 sm:table-cell">{note}</td>
                  </tr>
                ))}
                <tr className="bg-[#e9f7fd]">
                  <td className="border-t-2 border-[#174f7a]/30 p-4 font-heading font-bold text-[#08263c]">Six-year all-in estimate</td>
                  <td className="border-t-2 border-[#174f7a]/30 p-4 font-heading font-bold text-[#08263c]">≈ $25,000 – $50,000</td>
                  <td className="hidden border-t-2 border-[#174f7a]/30 p-4 text-slate-600 sm:table-cell">Confirmed per university on your ClearCost sheet</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/study-in-china-cost-bangladesh" className="inline-flex items-center gap-2 border-2 border-[#08263c] px-6 py-3 text-sm font-black hover:bg-white">
              <CircleDollarSign size={16} /> Open the full cost planner
            </Link>
            <Link href="/china-scholarships-bangladesh" className="text-sm font-bold text-[#174f7a] hover:underline">
              Scholarships are assessed after education fit →
            </Link>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY + PROGRAM */}
      <section className="bg-white px-5 py-16 border-y border-[#174f7a]/15 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 text-[#174f7a]"><GraduationCap size={24} /><h2 className="font-heading text-2xl font-bold text-[#08263c]">Eligibility &amp; entry</h2></div>
            <ul className="mt-6 grid gap-3">
              {eligibility.map((e) => (
                <li key={e} className="flex gap-3 border border-[#174f7a]/12 bg-[#f6f9fb] p-4 text-sm leading-6 text-slate-700"><Check size={16} className="mt-0.5 shrink-0 text-[#174f7a]" />{e}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-5 content-start">
            <div className="border border-[#174f7a]/15 bg-[#f6f9fb] p-6">
              <div className="flex items-center gap-3 text-[#174f7a]"><CalendarClock size={22} /><h3 className="font-heading text-lg font-bold text-[#08263c]">Programme &amp; intake</h3></div>
              <p className="mt-3 text-sm leading-6 text-slate-700">Six years: five years of academic and clinical coursework plus one year of internship at affiliated hospitals. Most intakes begin in September — each deadline is verified per university before it is shown as open.</p>
            </div>
            <div className="border border-[#174f7a]/15 bg-[#f6f9fb] p-6">
              <div className="flex items-center gap-3 text-[#174f7a]"><Languages size={22} /><h3 className="font-heading text-lg font-bold text-[#08263c]">Language of study</h3></div>
              <p className="mt-3 text-sm leading-6 text-slate-700">The clinical medicine programme is English-medium at MoE-designated universities. Basic Chinese is valuable — sometimes expected — for the hospital years, so we build language planning into your route.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-mono text-[11px] font-black uppercase tracking-widest text-[#174f7a]">Questions before you apply</p>
          <h2 className="mt-3 text-center font-heading text-3xl font-bold sm:text-4xl">MBBS in China FAQ</h2>
          <div className="mt-9 grid gap-3">
            {faqs.map((item, index) => (
              <details key={item.question} className="group border border-[#174f7a]/15 bg-white p-5 open:shadow-[0_15px_45px_rgba(8,38,60,0.08)]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-heading text-base font-bold">
                  <span className="flex gap-4"><span className="font-mono text-[10px] text-[#174f7a]">{String(index + 1).padStart(2, '0')}</span>{item.question}</span>
                  <span className="grid size-7 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 pl-8 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* VISA-FIRST TERMS */}
      <section className="bg-[#08263c] px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={34} className="mx-auto text-[#64b5df]" />
          <h2 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">Our China visa-first service terms</h2>
          <p className="mt-4 leading-7 text-white/75">
            No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical,
            translation, courier, deposit or other third-party fee required earlier must be itemised in writing before the
            student proceeds.
          </p>
          <Link href="/china-visa-first-policy" className="mt-6 inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-sm font-black hover:bg-white/10">
            Read the complete service terms <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="mbbs-assessment" className="bg-[#e9f7fd] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>

      {/* SOURCES + RELATED */}
      <section className="border-t border-[#174f7a]/15 bg-[#f6f9fb] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#174f7a]"><ShieldCheck size={14} /> Official sources checked {verifiedDate}</p>
            <div className="mt-4 grid gap-2">
              {sources.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 border-b border-[#174f7a]/15 bg-white p-3 text-xs font-bold text-[#174f7a] hover:bg-[#e9f7fd]">{s.label}<ArrowRight size={14} /></a>
              ))}
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#174f7a]"><FileCheck2 size={14} /> Related China decisions</p>
            <div className="mt-4 grid gap-px bg-[#174f7a]/15 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="flex items-center justify-between gap-3 bg-white p-3 text-xs font-black hover:bg-[#e9f7fd]">{r.label}<ArrowRight size={14} className="text-[#174f7a]" /></Link>
              ))}
            </div>
          </div>
          <p className="lg:col-span-2 border-t border-[#174f7a]/15 pt-5 text-[10px] leading-5 text-slate-500">
            <strong className="text-[#08263c]">Prepared by:</strong> EduExpress China Admissions Desk · <strong className="text-[#08263c]">Reviewed by:</strong> EduExpress Content and Compliance · Last verified {verifiedDate}. Cost ranges are planning assumptions; university, program, recognition and licensing facts are confirmed in writing during your assessment.
          </p>
        </div>
      </section>
    </article>
  );
}

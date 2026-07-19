import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'Study in China Without IELTS from Bangladesh (2026 MOI Guide)' },
  description:
    'Complete guide for Bangladeshi students applying for English-taught Chinese university programs without IELTS using Medium of Instruction (MOI) certificates.',
  alternates: { canonical: '/study-in-china-without-ielts' },
  openGraph: {
    title: 'Study in China Without IELTS from Bangladesh | EduExpress International',
    description: 'Verified MOI rules, university acceptance conditions, and scholarship eligibility without IELTS.',
    url: '/study-in-china-without-ielts',
    type: 'website',
  },
};

const moiRules = [
  {
    title: 'What is an MOI Certificate?',
    detail: 'Medium of Instruction (MOI) certificate issued by your Bangladeshi school, college, or university confirming that your previous degree was taught entirely in English.',
  },
  {
    title: 'Which Universities Accept MOI?',
    detail: 'Many provincial key universities in China accept MOI for Bachelor’s and Master’s degrees in Engineering, Business, Computer Science, and Humanities.',
  },
  {
    title: 'When is IELTS Recommended or Mandatory?',
    detail: 'Top Double First Class universities (like Tsinghua, Peking, Zhejiang) or specific MBBS/Medical licensing programs require formal IELTS (5.5 – 6.5) or HSK scores.',
  },
];

export default function StudyInChinaWithoutIeltsPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> Without IELTS
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <BookOpen size={14} /> MOI Certificate Eligibility
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Study in China Without IELTS from Bangladesh
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Discover English-taught Bachelor’s and Master’s degree programs in China that accept your Medium of Instruction (MOI) certificate from Bangladesh without forcing an IELTS exam.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#moi-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Check Your MOI Acceptance <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MOI RULES */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Factual Verification</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">How MOI Admissions Work in China</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {moiRules.map((r) => (
              <div key={r.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#08263c]">{r.title}</h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6 flex items-start gap-4 text-amber-900 text-sm">
            <AlertCircle className="shrink-0 text-amber-600 mt-0.5" size={20} />
            <div>
              <strong>Honest Advice Notice:</strong> EduExpress International never promises universal IELTS exemption. Acceptance depends strictly on the official admission bylaws of each individual Chinese university.
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">Visa-First Guarantee</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We evaluate your MOI documents against university rules before file opening. No file opening charge, and no EduExpress service fee until your Chinese visa is approved.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="moi-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

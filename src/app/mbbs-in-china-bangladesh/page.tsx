import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Award,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'MBBS in China for Bangladeshi Students (2026/27 Fee & Recognition Guide)' },
  description:
    'Complete guide for MBBS in China for Bangladeshi students. MOE approved English medium medical universities, BMDC licensing eligibility, tuition fees, and admission criteria.',
  alternates: { canonical: '/mbbs-in-china-bangladesh' },
  openGraph: {
    title: 'MBBS in China for Bangladeshi Students | EduExpress International',
    description: 'MOE approved medical universities, BMDC licensing requirements, tuition fees, and admission guidance.',
    url: '/mbbs-in-china-bangladesh',
    type: 'website',
  },
};

const mbbsFacts = [
  {
    title: 'MOE Approved Universities',
    detail: 'Ministry of Education (MOE) China publishes an annual list of designated universities authorized to enroll international students for English-medium MBBS.',
  },
  {
    title: 'BMDC Licensing Caveat',
    detail: 'Bangladeshi medical graduates must meet BMDC (Bangladesh Medical & Dental Council) eligibility criteria (minimum SSC+HSC total GPA 9.0 with Biology) to sit for the BMDC qualifying examination upon return.',
  },
  {
    title: '6-Year Program Structure',
    detail: '5 years of academic medical coursework (anatomy, pathology, pharmacology, clinical medicine) + 1 year of compulsory clinical internship at affiliated university hospitals.',
  },
];

export default function MbbsInChinaBangladeshPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> MBBS in China
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Stethoscope size={14} /> English-Medium Medical Guide 2026
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              MBBS in China for Bangladeshi Students
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Study English-medium Clinical Medicine at MOE-approved Chinese medical universities with world-class hospital clinical training and BMDC licensing compliance.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#mbbs-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Evaluate Your Medical Eligibility <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Recognition & Licensing</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Key Medical Degree Standards</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {mbbsFacts.map((f) => (
              <div key={f.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#08263c]">{f.title}</h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-blue-50 border border-blue-200 p-6 flex items-start gap-4 text-blue-900 text-sm">
            <AlertTriangle className="shrink-0 text-[#174f7a] mt-0.5" size={20} />
            <div>
              <strong>BMDC Requirement:</strong> Ensure your combined SSC & HSC GPA meets BMDC guidelines (typically minimum total GPA 9.0 with Biology GPA &gt; 3.5) before starting your MBBS application.
            </div>
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">EduExpress Medical Application Terms</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            No file opening charge. No EduExpress service fee before your China student visa is approved. Itemized third-party cost sheets provided in writing before file submission.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="mbbs-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Building2,
  UserCheck,
  FileCheck2,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'China Student Success Stories | Verified Bangladeshi Student Offers' },
  description:
    'Verified consent-based Bangladeshi student success stories, CSC scholarship awards, university admission offers, and X1 visa approvals with EduExpress International.',
  alternates: { canonical: '/china-success-stories' },
  openGraph: {
    title: 'China Student Success Stories | EduExpress International',
    description: 'Real verified visa approvals, scholarship offers, and university placements for Bangladeshi students.',
    url: '/china-success-stories',
    type: 'website',
  },
};

const successCases = [
  {
    name: 'Tanvir Hossain',
    university: 'Changzhou University (CCZU)',
    program: 'B.Sc. Computer Science & Technology',
    scholarship: 'Full Tuition Waiver + Free Dormitory Accommodation',
    intake: 'September Intake',
    evidenceId: 'EDX-BD-2025-CCZU-014',
    story: 'Applied from Chattogram with HSC GPA 4.80. Selected CCZU after comparing tuition structures. Received full scholarship and X1 visa stamped within 5 days.',
  },
  {
    name: 'Rafiqul Islam',
    university: 'Nanjing University of Aeronautics & Astronautics (NUAA)',
    program: 'M.Sc. Aeronautical Engineering',
    scholarship: 'Chinese Government Scholarship (CSC Type B)',
    intake: 'September Intake',
    evidenceId: 'EDX-BD-2025-NUAA-009',
    story: 'Applied from Dhaka with Bachelor CGPA 3.45. Passed professor interview and secured CSC Type B stipend of 3,000 RMB/month.',
  },
  {
    name: 'Nusrat Jahan',
    university: 'Jiangsu University (JSU)',
    program: 'MBBS (Clinical Medicine)',
    scholarship: 'Presidential Scholarship Partial Waiver',
    intake: 'September Intake',
    evidenceId: 'EDX-BD-2025-JSU-022',
    story: 'Applied with SSC+HSC combined GPA 9.60. Enrolled in MOE-listed English medium MBBS program with full visa support.',
  },
];

export default function ChinaSuccessStoriesPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> Success Stories
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Award size={14} /> Verified Proof & Evidence
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              China Student Success Stories
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Real stories from Bangladeshi students who secured scholarships, official university offers, and Chinese student visas with zero upfront consultancy fees.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#success-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Start Your Success Story <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Student Outcomes</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Consent-Verified Student Cases</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {successCases.map((c) => (
              <div key={c.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#174f7a] bg-[#e9f7fd] px-3 py-1 rounded-full">
                    {c.evidenceId}
                  </span>
                  <span className="font-mono text-xs text-slate-500">{c.intake}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#08263c]">{c.name}</h3>
                <p className="mt-1 text-sm font-bold text-[#174f7a]">{c.university}</p>
                <p className="mt-1 text-xs text-slate-500">{c.program}</p>

                <div className="mt-4 rounded-xl bg-[#f4f8fa] p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  🏆 {c.scholarship}
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{c.story}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">Evidence-First Standard</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            All success stories featured by EduExpress International are published with explicit written student consent and verified internal offer documentation.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="success-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { chinaIntakes, CHINA_INTAKE_VERIFIED_ON, CHINA_INTAKE_NEXT_REVIEW } from '@/lib/china-intakes';
import { canApplyToIntake } from '@/lib/intake-status';
import type { IntakeStatus } from '@/lib/intake-status';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'China University Intakes & Deadlines 2026/27 for Bangladesh Students' },
  description:
    'March (Spring) and September (Autumn) intake deadlines for Chinese universities. Verified application calendar, document submission windows, and scholarship deadlines for Bangladeshi applicants.',
  alternates: { canonical: '/china-intakes-deadlines' },
  openGraph: {
    title: 'China University Intakes & Deadlines | EduExpress International',
    description: 'Verified calendar of March and September intake application windows and CSC scholarship deadlines.',
    url: '/china-intakes-deadlines',
    type: 'website',
  },
};

// 2027 windows follow each intake's typical admissions cycle (applications open
// the previous autumn; university deadlines as tracked with admissions offices).
// getIntakeStatus() derives Open/Closing/Next Intake automatically; if verification
// expires before a counselor re-checks the window, the card flips to
// "Under Verification" instead of showing a stale promise.
const VERIFIED_ON = CHINA_INTAKE_VERIFIED_ON;
const NEXT_SCHEDULED_REVIEW = CHINA_INTAKE_NEXT_REVIEW;

const intakes = chinaIntakes;

const statusStyles: Record<IntakeStatus, string> = {
  Open: 'bg-[#e5f2eb] text-[#17624f] border-[#b9d8c9]',
  Closing: 'bg-amber-50 text-[#8a5a00] border-amber-200',
  Closed: 'bg-slate-100 text-slate-500 border-slate-200',
  'Next Intake': 'bg-[#e9f7fd] text-[#174f7a] border-[#c3dcec]',
  'Under Verification': 'bg-slate-100 text-slate-600 border-slate-200',
};

const timelineSteps = [
  { step: '1. Fit Assessment & Document Prep', window: '4-6 Months Before Intake', detail: 'Gather SSC/HSC/Degree transcripts, passport, physical exam, and police clearance.' },
  { step: '2. University & CSC Portal Submission', window: '3-5 Months Before Intake', detail: 'Submit application to target universities and CSC portal with verified certificates.' },
  { step: '3. Admission Notice & JW201/JW202 Issuance', window: '2-3 Months Before Intake', detail: 'Receive official admission package and Chinese Ministry of Education JW form.' },
  { step: '4. Visa Application & Flight to China', window: '1 Month Before Intake', detail: 'Apply for X1 visa at Chinese Visa Center Dhaka and book pre-departure flights.' },
];

export default function ChinaIntakesDeadlinesPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> Intakes & Deadlines
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <Calendar size={14} /> Dynamic Intake Calendar 2026/27
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              China University Intakes & Application Deadlines
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Plan your application timeline for March and September intakes. Stay ahead of CSC scholarship deadlines, university admission rounds, and visa processing windows.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#intake-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Check Upcoming Intake Slots <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTAKE COMPARISON */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Intake Cycles</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">March vs September Intake Windows</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {intakes.map((i) => (
              <div key={i.name} className="rounded-3xl border-2 border-[#08263c] bg-white p-8 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-[#174f7a] px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    {i.badge}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyles[i.status]}`} data-intake-status={i.status}>
                    <Calendar size={12} aria-hidden="true" />
                    {i.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#08263c]">{i.name}</h3>
                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  <p><strong>Applications Open:</strong> {i.applicationsOpen}</p>
                  <p><strong>CSC Scholarship Deadline:</strong> {i.cscDeadline}</p>
                  <p><strong>University Deadline:</strong> {i.universityDeadline}</p>
                  <p><strong>Classes Start:</strong> {i.classesStart}</p>
                  <p className="border-t border-slate-200 pt-3 text-xs text-slate-600"><strong>Available Courses:</strong> {i.programs}</p>
                </div>
                {canApplyToIntake(i.status) && (
                  i.activeCampaignHref
                    ? <Link href={i.activeCampaignHref} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#f2b544] px-5 text-sm font-bold text-[#08263c] transition hover:bg-[#e9a92f]">See the March 2027 university shortlist <ArrowRight size={16} /></Link>
                    : <a href="#intake-assessment" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-[#174f7a] px-5 text-sm font-bold text-[#174f7a] transition hover:bg-[#e9f7fd]">Start your September 2027 plan <ArrowRight size={16} /></a>
                )}
                {i.status === 'Under Verification' && (
                  <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">We are re-verifying this application window with admissions offices. Ask a counsellor for the current deadline.</p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-slate-500">
            Window status checked on <strong>{VERIFIED_ON}</strong> against university admissions-office updates, re-checked {NEXT_SCHEDULED_REVIEW}.
            If a window is awaiting re-verification we label it &ldquo;Under Verification&rdquo; rather than show a stale deadline.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white px-5 py-20 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Step-By-Step Roadmap</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Recommended Application Roadmap</h2>
          </div>

          <div className="mt-12 space-y-6">
            {timelineSteps.map((t, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-[#f4f8fa] p-6 border border-slate-200 gap-4">
                <div>
                  <h3 className="font-bold text-lg text-[#08263c]">{t.step}</h3>
                  <p className="mt-1 text-sm text-slate-600">{t.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-xs font-extrabold uppercase tracking-wider bg-[#e9f7fd] text-[#174f7a] px-4 py-2 rounded-full border border-blue-200">
                  {t.window}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">Visa-First Service Terms</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            EduExpress International tracks intake windows directly with university admissions offices. No file opening charge, and no EduExpress service fee before your China visa approval. University, embassy and other third-party charges required earlier are itemised in writing before you proceed.
          </p>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="intake-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

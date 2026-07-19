import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Globe2,
  HelpCircle,
  Info,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'China Student Visa (X1 & X2) from Bangladesh | Requirements & Step-by-Step 2026' },
  description:
    'Complete guide to applying for a China Student Visa (X1 & X2) from Bangladesh. Updated 2026 requirements, JW201/JW202 forms, physical exam, embassy appointment, and visa-first fee terms.',
  alternates: { canonical: '/china-student-visa-bangladesh' },
  openGraph: {
    title: 'China Student Visa (X1 & X2) from Bangladesh | EduExpress International',
    description: 'Verified step-by-step guide for Bangladeshi students applying for X1 and X2 Chinese study visas.',
    url: '/china-student-visa-bangladesh',
    type: 'website',
  },
};

const visaTypes = [
  {
    type: 'X1 Visa (Long-Term Study)',
    duration: 'More than 180 Days (Degree & Diploma programs)',
    validity: 'Single entry, 30 days initial validity (Converted to Residence Permit within 30 days in China)',
    keyDoc: 'Original JW201 or JW202 Form + Official Admission Notice',
  },
  {
    type: 'X2 Visa (Short-Term Study)',
    duration: 'Less than 180 Days (Exchange & Language programs)',
    validity: 'Single or Double entry for the exact duration of the course',
    keyDoc: 'Official Admission Notice (JW form usually not required for <180 days)',
  },
];

const checklist = [
  'Original Passport (Valid for at least 6 months with blank visa pages)',
  'JW201 or JW202 Form (Issued by Chinese Ministry of Education / University)',
  'Official Admission Notice (Original letter from Chinese University)',
  'Completed COVA Online Visa Application Form & Photo (White background)',
  'Foreigner Physical Examination Form (Completed at recognized BD diagnostic center with lab reports)',
  'Bank Solvency Certificate & Statement (Showing minimum 3,000 - 5,000 USD / ~3.5 - 6 Lakh BDT equivalent)',
  'Police Clearance Certificate (Notarized by Ministry of Foreign Affairs Bangladesh)',
  'Highest Educational Certificates & Transcripts (SSC/HSC/Bachelor notarized copies)',
];

const faqs = [
  {
    q: 'How long does it take to process a China X1 student visa in Dhaka?',
    a: 'Standard processing at the Chinese Visa Application Center (Dhaka) takes 4 to 7 working days after physical document submission. Express processing options are available for 2-3 working days.',
  },
  {
    q: 'Do I need to convert my X1 visa after arriving in China?',
    a: 'Yes! The X1 visa is only valid for 30 days from entry. Within 30 days of arrival, your university international office will guide you to convert the X1 visa into a 1-to-4 year Foreigner Residence Permit at the local Exit-Entry Administration Bureau.',
  },
  {
    q: 'What is the difference between JW201 and JW202 forms?',
    a: 'JW201 is issued for Chinese Government Scholarship (CSC) recipients. JW202 is issued for self-funded, provincial, or university scholarship students.',
  },
  {
    q: 'What are EduExpress International’s service fee terms for China student visas?',
    a: 'No file opening charge. No EduExpress service fee before your China student visa approval. Any third-party fees (embassy visa fee, medical test, police clearance) are paid directly to third parties with itemized receipts.',
  },
];

export default function ChinaStudentVisaBangladeshPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'China Student Visa (X1 & X2) from Bangladesh',
    description: 'Complete step-by-step guide for Bangladeshi students applying for Chinese study visas.',
    url: 'https://eduexpressint.com/china-student-visa-bangladesh',
  };

  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> China Student Visa
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
              <FileCheck size={14} /> Embassy-Aligned Guide 2026
            </div>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              China Student Visa (X1 / X2) from Bangladesh
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
              Everything you need to know to secure your Chinese X1 or X2 study visa from Dhaka. Step-by-step guidance on JW201/JW202 forms, medical exams, bank solvency, and embassy appointments.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
              <a
                href="#visa-assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white"
              >
                Get Free Visa Readiness Check <ArrowRight size={16} />
              </a>
              <Link
                href="/china-visa-first-policy"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-white transition-all hover:bg-white/10"
              >
                Inspect Visa-First Policy <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VISA TYPES */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Visa Classification</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Understanding X1 vs X2 Visas</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {visaTypes.map((v) => (
              <div key={v.type} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-[#08263c]">{v.type}</h3>
                <p className="mt-2 text-sm font-semibold text-[#174f7a]">{v.duration}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p><strong>Validity:</strong> {v.validity}</p>
                  <p><strong>Required Document:</strong> {v.keyDoc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="bg-white px-5 py-20 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Document Prep</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">Mandatory Bangladesh Visa Document Checklist</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-2xl bg-[#f4f8fa] p-5 border border-slate-200 text-sm font-medium text-[#08263c]">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#174f7a]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">No Service Fee Until Visa Approval</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            At EduExpress International, we work on a 100% Visa-First Service Model. You pay zero consultancy service charge until your official Chinese student visa is stamped and approved.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-5 py-20 border-t border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <HelpCircle size={32} className="mx-auto text-[#174f7a]" />
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#08263c]">Visa FAQs for Bangladeshi Students</h2>
          </div>

          <div className="mt-10 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-[#f4f8fa] p-6">
                <h3 className="font-bold text-lg text-[#08263c]">{faq.q}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section id="visa-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

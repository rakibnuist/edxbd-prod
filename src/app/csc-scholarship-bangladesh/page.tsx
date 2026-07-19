import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  HelpCircle,
  Info,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'CSC Scholarship from Bangladesh (2026/27) | Complete Guide & Verification' },
  description:
    'Complete Bangladesh guide to Chinese Government Scholarships (CSC). Learn Type A & Type B eligibility, agency numbers, monthly stipends, document checklists, and application timelines with written evidence.',
  alternates: { canonical: '/csc-scholarship-bangladesh' },
  openGraph: {
    title: 'CSC Scholarship from Bangladesh (2026/27) | EduExpress International',
    description: 'Verified guide to CSC Chinese Government Scholarships for Bangladeshi students. Full tuition waivers, monthly stipends, and step-by-step application guidance.',
    url: '/csc-scholarship-bangladesh',
    type: 'website',
  },
};

const cscCoverage = [
  {
    title: 'Full Tuition Waiver',
    detail: '100% tuition fees covered directly by the Chinese Ministry of Education for the entire degree duration.',
    icon: GraduationCap,
  },
  {
    title: 'Free On-Campus Accommodation',
    detail: 'Free university dormitory accommodation (single or double room) or housing stipend.',
    icon: Building2,
  },
  {
    title: 'Monthly Living Stipend',
    detail: 'Undergraduate: CNY 2,500/mo (~40,000 BDT) | Master’s: CNY 3,000/mo (~48,000 BDT) | PhD: CNY 3,500/mo (~56,000 BDT).',
    icon: DollarSign,
  },
  {
    title: 'Comprehensive Insurance',
    detail: 'CNY 800/year medical insurance covered for emergency hospitalization and outpatient treatment in China.',
    icon: ShieldCheck,
  },
];

const cscTypes = [
  {
    type: 'Type A (Bilateral Program)',
    appliedThrough: 'Ministry of Education (MoE) Bangladesh / Chinese Embassy in Dhaka',
    bestFor: 'Students applying through Bangladesh government nomination rounds',
    deadline: 'December – February',
    keyNote: 'Requires MoE Bangladesh primary screening and embassy interview endorsement.',
  },
  {
    type: 'Type B (Chinese University Program)',
    appliedThrough: 'Directly through designated Chinese Universities (CSC Agency Code)',
    bestFor: 'Students applying directly for Bachelor’s, Master’s, or PhD at target universities',
    deadline: 'January – April',
    keyNote: 'Requires university pre-admission letter or professor acceptance letter for postgraduate applicants.',
  },
];

const requiredDocuments = [
  'CSC Online Application Form (downloaded from campuschina.org)',
  'Highest Diploma/Degree Certificate (Notarized by Ministry of Foreign Affairs Bangladesh)',
  'Academic Transcripts (Notarized SSC, HSC, or Bachelor transcripts)',
  'Study Plan or Research Proposal (Minimum 800 words for Master’s/PhD)',
  'Two Recommendation Letters from Associate Professors or Professors',
  'Foreigner Physical Examination Form (completed at recognized BD diagnostic center)',
  'Non-Criminal Record Certificate (Police Clearance Certificate from Bangladesh Police)',
  'Language Certificate (IELTS/TOEFL for English-taught, or HSK for Chinese-taught)',
  'Passport Copy (Valid for at least 12 months)',
];

const faqs = [
  {
    q: 'Can Bangladeshi students apply for CSC Scholarship without IELTS?',
    a: 'Yes, many Chinese universities accept Medium of Instruction (MOI) certificates from Bangladeshi schools/colleges where previous instruction was in English. However, top-tier Double First Class universities or specific medical/engineering programs may mandate IELTS (5.5+) or HSK.',
  },
  {
    q: 'What is the difference between CSC Type A and Type B for Bangladeshi applicants?',
    a: 'Type A is processed through the Bangladesh Ministry of Education (MoE) and the Chinese Embassy in Dhaka under bilateral quota. Type B is submitted directly to designated Chinese universities using their unique 5-digit Agency Number.',
  },
  {
    q: 'Is there any application fee for CSC Scholarship?',
    a: 'The official CSC application portal (campuschina.org) is free of charge. However, some individual Chinese universities charge an application processing fee (CNY 400 - 800 / ~6,500 - 13,000 BDT) directly payable to the university bank account.',
  },
  {
    q: 'What are the age limits for CSC Scholarship applicants from Bangladesh?',
    a: 'Undergraduate applicants must be under 25 years old; Master’s degree applicants must be under 35 years old; Doctoral (PhD) applicants must be under 40 years old.',
  },
];

export default function CscScholarshipBangladeshPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CSC Scholarship from Bangladesh (Chinese Government Scholarship 2026/27)',
    description: 'Complete guide for Bangladeshi students applying for CSC Chinese Government Scholarships.',
    url: 'https://eduexpressint.com/csc-scholarship-bangladesh',
    publisher: {
      '@type': 'Organization',
      name: 'EduExpress International',
      url: 'https://eduexpressint.com',
    },
  };

  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(100,181,223,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(100,181,223,0.07)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/study-in-china-from-bangladesh" className="hover:text-white">Study in China</Link> <span aria-hidden>/</span> CSC Scholarship
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8ed0ee]/30 bg-[#8ed0ee]/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#8ed0ee]">
                <Award size={14} /> Official 2026/27 Guide
              </div>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                CSC Scholarship from Bangladesh
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/80 md:text-xl">
                The Chinese Government Scholarship (CSC) offers 100% full tuition waivers, free university housing, and monthly stipends up to 56,000 BDT/month for Bangladeshi undergraduate and postgraduate students.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
                <a
                  href="#csc-assessment"
                  className="inline-flex items-center gap-2 rounded-full bg-[#64b5df] px-7 py-3.5 text-[#08263c] transition-all hover:bg-white hover:shadow-lg"
                >
                  Check Your CSC Eligibility <ArrowRight size={16} />
                </a>
                <a
                  href="https://www.campuschina.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-white transition-all hover:bg-white/10"
                >
                  Official Portal (campuschina.org) <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* QUICK STATS CARD */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="font-mono text-xs font-black uppercase tracking-widest text-[#8ed0ee]">At a Glance for BD Students</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#64b5df]" size={18} />
                  <span><strong>Tuition:</strong> 100% Free (Full Waiver)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#64b5df]" size={18} />
                  <span><strong>Stipend:</strong> 40,000 – 56,000 BDT / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#64b5df]" size={18} />
                  <span><strong>Housing:</strong> Free On-Campus Dormitory</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#64b5df]" size={18} />
                  <span><strong>EduExpress Terms:</strong> No service fee before visa approval</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE SECTION */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Financial Breakdown</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">What Does CSC Scholarship Cover?</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              CSC (China Scholarship Council) is one of the most generous fully-funded government scholarships available to students from Bangladesh.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cscCoverage.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="grid size-12 place-items-center rounded-xl bg-[#e9f7fd] text-[#174f7a] mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#08263c]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHOLARSHIP TYPES SECTION */}
      <section className="bg-white px-5 py-20 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Application Pathways</span>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl text-[#08263c]">CSC Type A vs Type B for Bangladeshi Students</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {cscTypes.map((t) => (
              <div key={t.type} className="rounded-3xl border-2 border-[#08263c] p-8 bg-[#f4f8fa]">
                <div className="inline-block rounded-full bg-[#174f7a] px-4 py-1 text-xs font-bold text-white uppercase tracking-wider mb-4">
                  {t.type}
                </div>
                <p className="text-[#08263c] font-bold text-lg">{t.appliedThrough}</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <p><strong>Target Group:</strong> {t.bestFor}</p>
                  <p><strong>Primary Window:</strong> {t.deadline}</p>
                  <p className="border-t border-slate-300 pt-3 text-xs text-slate-600 italic">💡 {t.keyNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENT CHECKLIST SECTION */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="rounded-3xl bg-[#08263c] p-8 text-white sm:p-12">
            <div className="flex items-center gap-3">
              <FileText size={28} className="text-[#64b5df]" />
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">Required Document Checklist for Bangladesh</h2>
            </div>
            <p className="mt-3 text-white/80 text-sm sm:text-base">
              All academic certificates and transcripts must be notarized and verified by the Ministry of Foreign Affairs (MOFA) Bangladesh before submitting to CSC.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 text-sm leading-6 text-white/90 backdrop-blur-sm">
                  <span className="font-mono text-xs font-bold text-[#8ed0ee] shrink-0">{idx + 1}.</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EDUEXPRESS REASSURANCE COMMERCIAL TERMS */}
      <section className="bg-white px-5 py-16 border-y border-slate-200 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1000px] text-center">
          <ShieldCheck size={36} className="mx-auto text-[#174f7a]" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#08263c]">EduExpress China Visa-First Guarantee</h2>
          <div className="mt-6 rounded-2xl bg-[#e9f7fd] p-6 text-base font-semibold leading-relaxed text-[#08263c] border border-blue-200">
            “No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.”
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <HelpCircle size={32} className="mx-auto text-[#174f7a]" />
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#08263c]">Frequently Asked Questions</h2>
          </div>

          <div className="mt-10 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-lg text-[#08263c]">{faq.q}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSESSMENT FORM INTEGRATION */}
      <section id="csc-assessment" className="px-5 py-20 bg-[#e9f7fd] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 text-center">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#174f7a]">Free Assessment</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#08263c]">Check Your CSC Scholarship Fit</h2>
            <p className="mt-2 text-sm text-slate-600">Share your GPA, major, and intake — our team will evaluate your chances for CSC Type A & Type B routes in writing.</p>
          </div>
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}

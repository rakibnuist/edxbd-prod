import { Metadata } from 'next';
import Link from 'next/link';
import ConsultationButton from '@/components/ConsultationButton';
import PageHeader from '@/components/PageHeader';
import { Briefcase, Fingerprint, Search, Wallet, ClipboardCheck, ArrowUpRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Study Abroad Services | University Selection, Visa & Scholarship Support',
  description: 'Evidence-first education guidance covering education fit, written cost comparison, application proof tracking and visa readiness.',
  keywords: [
    'study abroad services',
    'university selection',
    'visa assistance',
    'scholarship support',
    'career guidance',
    'study abroad consultancy',
    'international education',
    'student visa',
    'university application',
    'education consultant'
  ],
  openGraph: {
    title: 'Study Abroad Services | Expert Guidance for International Education',
    description: 'Compare education quality, recognition, costs and career fit with clear written evidence.',
    type: 'website',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  const mainServices = [
    {
      number: '01',
      docTag: 'DOC 01',
      title: 'EduFit Decision Report',
      label: 'University Selection & Entry Logic',
      copy: 'At least three suitable routes evaluated against your GPA, budget and career goals, explaining why each option is recommended or rejected.',
      icon: Search,
      features: [
        'Personalized university & program matching',
        'Academic entry requirements logic',
        'Written recommendation rationale',
        'Comparison of up to 3 institutions',
        'Rejection risk assessment'
      ],
      link: '/better-education-standard'
    },
    {
      number: '02',
      docTag: 'DOC 02',
      title: 'ClearCost Sheet',
      label: 'Financial Schedule & Fee Separation',
      copy: 'Itemized written cost schedule separating university tuition, hostel, embassy and third-party fees from EduExpress charges.',
      icon: Wallet,
      features: [
        'Scholarship eligibility & coverage check',
        'Tuition vs 3rd party fee separation',
        'Written refund terms',
        'Official fee payment recipients',
        'Zero hidden file-opening charges'
      ],
      link: '/fees-and-transparency'
    },
    {
      number: '03',
      docTag: 'DOC 03',
      title: 'Application Proof Pack',
      label: 'Timestamped Dossier & Receipt Tracking',
      copy: 'Timestamped submission references, official university fee receipts, offer records, and assigned counselor tracking.',
      icon: ClipboardCheck,
      features: [
        'Timestamped portal submission proof',
        'Official JW202 government form tracking',
        'Direct university Registrar follow-up',
        'Deadline monitoring',
        'Student retains full copy package'
      ],
      link: '/how-we-verify-universities'
    },
    {
      number: '04',
      docTag: 'DOC 04',
      title: 'Visa Readiness Record',
      label: 'Document Checklist & Embassy Protocol',
      copy: 'Comprehensive document gap analysis, official embassy checklist review, and written explanation of visa outcome responsibilities.',
      icon: Fingerprint,
      features: [
        'Embassy document checklist review',
        'Police clearance & medical check coaching',
        'Official interview preparation',
        'Escalation support',
        'Written outcome limits'
      ],
      link: '/china-student-visa-bangladesh'
    }
  ];

  const processSteps = [
    { step: '01', title: 'Education Fit Assessment', copy: 'Free evaluation of academic background, budget, language readiness, and career goals' },
    { step: '02', title: 'Decision Report', copy: 'Compare at least three suitable routes with written reasons to recommend or reject' },
    { step: '03', title: 'ClearCost Schedule', copy: 'Separates university, embassy, and third-party fees from EduExpress charges' },
    { step: '04', title: 'Application Proof Pack', copy: 'Submit applications with timestamped submission references and receipts' },
    { step: '05', title: 'Visa Readiness Record', copy: 'Document checklist and official embassy guidance review before departure' }
  ];

  return (
    <div className="overflow-hidden bg-[#f4f8fa] text-[#08263c] font-sans">
      {/* Homepage Hero Header Style */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pt-40 lg:px-12 border-b border-[#174f7a]/15">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
            <span>EduExpress International Bangladesh</span>
            <span>Productized Trust System</span>
            <span>Four Written Documents</span>
          </div>

          <div className="max-w-4xl">
            <p className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
              <Fingerprint className="mt-0.5 shrink-0 text-[#8ed0ee] sm:mt-0" size={16} />
              <span className="min-w-0 whitespace-normal">Evidence-First Guidance & Services</span>
            </p>

            <h1 className="mt-7 w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
              Our services leave <span className="relative mt-2 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">a visible paper trail</span> for every student
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              We provide four visible documents that record every recommendation, payment responsibility, application step, and visa preparation requirement.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/education-fit-assessment"
                className="group inline-flex items-center justify-center gap-3 bg-[#08263c] px-6 py-4 text-sm font-black text-white hover:bg-[#174f7a] shadow-[4px_4px_0_0_#174f7a]"
              >
                Get Free Fit Assessment <ArrowUpRight className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </Link>
              <Link
                href="/fees-and-transparency"
                className="inline-flex items-center justify-center gap-3 border-2 border-[#08263c] bg-white/70 px-6 py-4 text-sm font-black text-[#08263c] hover:bg-white"
              >
                Calculate Clear Costs <ArrowRight className="shrink-0" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Promise Dark Section */}
      <section aria-labelledby="services-promise-standard" className="border-y border-[#08263c] bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[.8fr_repeat(4,1fr)]">
          <div className="bg-[#64b5df] p-6 text-[#08263c] lg:p-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Four Written Proof Assets</p>
            <h2 id="services-promise-standard" className="mt-3 font-heading text-2xl font-bold leading-tight">Zero Unwritten Promises</h2>
          </div>
          {mainServices.map(({ number, title, copy, icon: Icon, link }) => (
            <Link key={title} href={link} className="group relative border-b border-white/15 p-5 hover:bg-white/5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-[#64b5df]">DOC {number}</span><Icon size={19} className="text-[#64b5df]" /></div>
              <h3 className="mt-7 font-heading text-lg font-bold leading-6">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/50">{copy}</p>
              <ArrowUpRight size={14} className="absolute bottom-5 right-5 text-white/20 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#8ed0ee]" />
            </Link>
          ))}
        </div>
      </section>

      {/* Core Service Documents Grid (DOC 01 to DOC 04) */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 md:py-32 lg:px-12 border-b border-[#174f7a]/15">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">The Four Productized Trust Assets</p>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#08263c] md:text-5xl">Every service documented in writing</h2>
            <p className="mt-4 text-base text-slate-600">Inspect the exact four documents delivered to every student before any payment or commitment.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {mainServices.map(({ number, title, label, copy, icon: Icon, features, link }, index) => (
              <article
                key={title}
                className={`group relative overflow-hidden border-2 border-[#08263c] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#174f7a] ${
                  index === 0 ? 'bg-[#174f7a] text-white' : index === 3 ? 'bg-[#bde7f8] text-[#08263c]' : 'bg-[#f4f8fa] text-[#08263c]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-black">DOC {number}</span>
                  <Icon size={35} strokeWidth={1.6} className={index === 0 ? 'text-[#64b5df]' : 'text-[#174f7a]'} />
                </div>

                <div className="mt-6">
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? 'text-[#bde7f8]' : 'text-[#174f7a]'}`}>{label}</p>
                  <h3 className="mt-2 font-heading text-3xl font-bold tracking-tight">{title}</h3>
                  <p className={`mt-3 leading-7 text-sm ${index === 0 ? 'text-white/80' : 'text-slate-700'}`}>{copy}</p>

                  <ul className="mt-6 space-y-2 border-t border-[#174f7a]/20 pt-4 bg-white/60 p-4 border border-[#08263c]/20">
                    {features.map((feature, fIdx) => (
                      <li key={fIdx} className={`flex items-center text-xs font-semibold ${index === 0 ? 'text-[#08263c]' : 'text-[#08263c]'}`}>
                        <span className="text-[#174f7a] font-bold mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link
                      href={link}
                      className={`inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider ${
                        index === 0 ? 'text-[#8ed0ee] hover:text-white' : 'text-[#174f7a] hover:text-[#08263c]'
                      }`}
                    >
                      Inspect Specimen <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Five-Step Process Section */}
      <section className="bg-[#08263c] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center mb-14">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#64b5df]">Five-Step Workflow</p>
            <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Our Evidence Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map(({ step, title, copy }) => (
              <div key={step} className="border border-white/20 bg-[#061b2a] p-6 text-left">
                <span className="font-mono text-2xl font-bold text-[#64b5df] mb-3 block">{step}</span>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-xs leading-5 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bring 01-03 CTA Banner */}
      <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Compare before you commit</p>
              <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Bring us your results, budget and ambition. Leave with a clearer decision.</h2>
            </div>
            <Link href="/education-fit-assessment" className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-7 py-5 text-base font-black text-white hover:bg-[#174f7a] sm:text-lg lg:w-auto lg:min-w-64">Get my free fit assessment <ArrowUpRight size={20} /></Link>
          </div>
          <div className="mt-10 grid border-l border-t border-[#08263c]/35 sm:mt-12 sm:grid-cols-3">
            {[
              ['01', 'Academic record', 'Your latest SSC/HSC or Bachelor transcripts'],
              ['02', 'Subject direction', 'The program or career area you want to explore'],
              ['03', 'Budget reality', 'A practical range for tuition and living costs']
            ].map(([number, title, copy]) => (
              <div key={number} className="border-b border-r border-[#08263c]/35 p-5 sm:p-6">
                <span className="font-mono text-[10px] font-black text-[#174f7a]">BRING {number}</span>
                <h3 className="mt-3 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#0b2f4a]/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

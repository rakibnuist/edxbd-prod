import { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ChinaServicePackages from '@/components/china/ChinaServicePackages';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getUniversityRecords } from '@/lib/university-records';
import { ArrowUpRight, Briefcase, ClipboardCheck, Fingerprint, Search, Wallet } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const universityCount = (await getUniversityRecords()).length;
  const description =
    universityCount > 0
      ? `Evidence-first education guidance covering education fit, written cost comparison and visa readiness, backed by ${universityCount}+ verified university records.`
      : 'Evidence-first education guidance covering education fit, written cost comparison, application proof tracking and visa readiness.';
  return {
    title: 'Study Abroad Services | University Selection, Visa & Scholarship Support',
    description,
    openGraph: {
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
      title: 'Study Abroad Services | Expert Guidance for International Education',
      description: 'Compare education quality, recognition, costs and career fit with clear written evidence.',
      type: 'website',
    },
    alternates: {
      canonical: '/services',
    },
  };
}

export default async function ServicesPage() {
  const { servicePackages } = await getPublicTrustRecords();
  const chinaPackages = servicePackages.filter(item => item.destination === 'China');

  const mainServices = [
    {
      number: '01',
      title: 'EduFit Decision Report',
      label: 'University selection and entry logic',
      copy: 'At least three suitable routes evaluated against your grades, budget and career goals, explaining why each option is recommended or rejected.',
      icon: Search,
      features: ['Personalised university and programme matching', 'Academic entry-requirement logic', 'Written recommendation rationale', 'Comparison of up to 3 institutions', 'Rejection-risk assessment'],
      link: '/better-education-standard',
    },
    {
      number: '02',
      title: 'ClearCost Sheet',
      label: 'Financial schedule and fee separation',
      copy: 'An itemised written cost schedule separating university tuition, hostel, embassy and third-party fees from EduExpress charges.',
      icon: Wallet,
      features: ['Scholarship eligibility and coverage check', 'Tuition vs third-party fee separation', 'Written refund terms', 'Official fee payment recipients', 'No hidden file-opening charges'],
      link: '/fees-and-transparency',
    },
    {
      number: '03',
      title: 'Application Proof Pack',
      label: 'Timestamped dossier and receipt tracking',
      copy: 'Timestamped submission references, official university fee receipts, offer records and assigned counsellor tracking.',
      icon: ClipboardCheck,
      features: ['Timestamped portal submission proof', 'Official JW202 form tracking', 'Registrar follow-up record', 'Deadline monitoring', 'Student keeps the full copy package'],
      link: '/how-we-verify-universities',
    },
    {
      number: '04',
      title: 'Visa Readiness Record',
      label: 'Document checklist and embassy protocol',
      copy: 'Document gap analysis, official embassy checklist review, and a written explanation of where the outcome responsibility sits.',
      icon: Fingerprint,
      features: ['Embassy document checklist review', 'Police clearance and medical coaching', 'Interview preparation', 'Escalation support', 'Written outcome limits'],
      link: '/china-student-visa-bangladesh',
    },
  ];

  const processSteps = [
    { step: '01', title: 'Education fit assessment', copy: 'Free evaluation of academic background, budget, language readiness and career goals' },
    { step: '02', title: 'Decision report', copy: 'Compare at least three suitable routes with written reasons to recommend or reject' },
    { step: '03', title: 'ClearCost schedule', copy: 'Separates university, embassy and third-party fees from EduExpress charges' },
    { step: '04', title: 'Application proof pack', copy: 'Submit applications with timestamped references and receipts' },
    { step: '05', title: 'Visa readiness record', copy: 'Document checklist and official embassy guidance reviewed before departure' },
  ];

  return (
    <div className="bg-chalk text-ink">
      <PageHeader
        title="Four documents."
        highlight="No spoken promises."
        description="Our services are defined by the paperwork you leave with: which universities were compared, what each payment covers, what was submitted, and what the visa file still needs."
        icon={<Briefcase />}
        badgeText="Services"
        breadcrumbLabel="Services"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-11">
            Get a free fit assessment <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-11">
            Read the fee policy
          </Link>
        </div>
      </PageHeader>

      {/* The four documents as a register, not four cards. */}
      <section aria-labelledby="service-documents" className="px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-col justify-between gap-3 border-b border-rule pb-3 sm:flex-row sm:items-baseline">
            <h2 id="service-documents" className="ed-home-display text-[22px] leading-tight text-ink">
              What every student receives
            </h2>
            <p className="text-[14px] text-ink-mute">Delivered before any payment or commitment</p>
          </div>

          <ul className="border-t border-rule">
            {mainServices.map(({ number, title, label, copy, icon: Icon, features, link }) => (
              <li key={title} className="border-b border-rule">
                <article className="grid gap-5 py-7 lg:grid-cols-[56px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                  <p className="ed-figure text-[15px] text-petrol-500">{number}</p>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Icon size={17} className="text-petrol-500" aria-hidden="true" />
                      <h3 className="ed-home-display text-[24px] leading-tight text-ink">{title}</h3>
                    </div>
                    <p className="mt-1 text-[14px] text-ink-mute">{label}</p>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-7 text-ink-soft">{copy}</p>
                    <Link href={link} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-petrol-600 underline-offset-4 hover:underline">
                      Inspect what this document contains <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                  <ul className="grid gap-1.5 self-start border-l border-rule pl-5 sm:grid-cols-2 lg:grid-cols-1">
                    {features.map(feature => (
                      <li key={feature} className="flex gap-2 text-[14px] leading-6 text-ink-soft">
                        <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 bg-jade" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {chinaPackages.length > 0 && <ChinaServicePackages packages={chinaPackages} />}

      {/* Process: a real sequence, so numbering is warranted. */}
      <section data-surface="dark" className="bg-petrol-900 px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-shell">
          <div className="flex flex-col justify-between gap-3 border-b border-white/15 pb-3 sm:flex-row sm:items-baseline">
            <p className="ed-label !text-mint-300">The working sequence</p>
            <p className="text-[14px] text-white/55">Five stages, each with a document attached</p>
          </div>

          <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map(({ step, title, copy }) => (
              <li key={step} className="border-t border-white/20 pt-4">
                <span className="ed-figure text-[14px] text-mint-300">{step}</span>
                <h3 className="mt-2 ed-home-display text-[18px] leading-tight text-white">{title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-white/65">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-shell">
          <div className="grid gap-8 border border-rule bg-white p-6 sm:p-9 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
            <div>
              <p className="ed-label">Compare before you commit</p>
              <h2 className="mt-4 max-w-[26ch] ed-home-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.05] text-ink">
                Bring your results, budget and ambition. Leave with a clearer decision.
              </h2>
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary mt-6 min-h-11">
                Get my free fit assessment <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <ol className="grid gap-4 border-t border-rule pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {[
                ['Academic record', 'Your latest SSC/HSC or bachelor transcripts'],
                ['Subject direction', 'The programme or career area you want to explore'],
                ['Budget reality', 'A practical range for tuition and living costs'],
              ].map(([title, copy], index) => (
                <li key={title} className="flex gap-4">
                  <span className="ed-figure text-[14px] text-petrol-500">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="ed-home-display text-[17px] leading-tight text-ink">{title}</h3>
                    <p className="mt-1 text-[14px] leading-6 text-ink-soft">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

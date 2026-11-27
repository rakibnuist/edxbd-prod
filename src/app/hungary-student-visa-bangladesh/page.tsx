import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Globe,
  IdCard,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/hungary-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const HUNGARY_VISA_SOURCES = [
  {
    label: 'National Directorate-General for Aliens Policing (NDGAP / OIF) — Residence Permit for Studies',
    href: 'http://oif.gov.hu/index.php?lang=en',
    note: 'Statutory Hungarian immigration authority overseeing study-purpose residence permits (Appendix 14), financial solvency verification, and biometric residence card issuance.',
  },
  {
    label: 'Embassy of Hungary in New Delhi & Consular Mission for Bangladesh',
    href: 'https://delhi.mfa.gov.hu/eng',
    note: 'Accredited Hungarian diplomatic mission handling D-type student entry visa interviews, document verification, and consular biometrics for Bangladeshi applicants.',
  },
  {
    label: 'Tempus Public Foundation — Stipendium Hungaricum Visa & Residence Privileges',
    href: 'https://stipendiumhungaricum.hu/',
    note: 'Official bilateral scholarship guidelines granting visa fee exemptions, Letter of Award financial proof, and Taj medical card privileges.',
  },
  {
    label: 'Enter Hungary — Electronic Immigration Filing Portal',
    href: 'https://enterhungary.gov.hu/',
    note: 'Official online portal of the Hungarian immigration service for residence permit extensions, address reporting, and student card updates after arrival.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for remitting tuition in EUR to Hungarian state universities via official Student Files.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Hungary Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Hungary Type D student visa guide for Bangladeshi students: NDGAP residence permit rules, New Delhi Embassy & VFS process, bank solvency, and work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('hungary', 'Hungary Student Visa from Bangladesh — EduExpress International'),
  });
}

const HUNGARY_VISA_FAQS = [
  {
    question: 'What type of visa do Bangladeshi students apply for to study in Hungary?',
    answer:
      'Bangladeshi degree students apply for a Residence Permit for the Purpose of Studies (coupled with a Single-Entry Type D Visa for collecting the residence permit). Once approved by the National Directorate-General for Aliens Policing (NDGAP), the Embassy issues a Type D entry visa valid for a 30-day stay window once you enter Hungary. Within those 30 days of landing in Budapest or your regional university city, you collect your physical biometric Hungarian Residence Permit card from the local NDGAP immigration office or your university international office.',
  },
  {
    question: 'How much bank balance is required for a self-funded Hungary student visa from Bangladesh?',
    answer:
      'For self-funded applicants, NDGAP and consular officers require verifiable proof that you can cover your living and accommodation expenses in Hungary for at least one full academic year, in addition to having paid your first semester or first year of university tuition. We recommend maintaining a liquid closing balance of EUR 6,500 to EUR 8,000 (~8.5 to 10.4 Lakh BDT) in a recognized Bangladeshi commercial bank account for 3 to 6 months, supported by your parent or sponsor’s notarized financial affidavit, employment or trade license proof, and income tax returns.',
  },
  {
    question: 'Do Stipendium Hungaricum scholarship winners need to show personal bank solvency?',
    answer:
      'Stipendium Hungaricum awardees receive an official Letter of Award from the Tempus Public Foundation confirming 100% tuition exemption, dormitory placement (or HUF 40,000/month housing contribution), health insurance, and a monthly stipend. This official Letter of Award satisfies the primary financial requirement, and Stipendium scholars are exempt from the visa application fee. However, we still recommend attaching a modest personal or parental bank statement (~3 to 5 Lakh BDT) to cover airfare and initial settling costs.',
  },
  {
    question: 'Where do Bangladeshi students attend their Hungary student visa biometrics and interview?',
    answer:
      'Consular jurisdiction for Hungary covers applicants through the Embassy of Hungary in New Delhi and designated consular/VFS submission arrangements in Dhaka depending on current seasonal bilateral appointment slots. Self-funded applicants generally undergo a structured consular academic and financial interview (in person or via video link), where officers verify your course module knowledge, English fluency, paid tuition SWIFT receipt (MT103), and genuine study intent.',
  },
  {
    question: 'Can Bangladeshi students work part-time and stay in Hungary after graduation?',
    answer:
      'Yes. Holders of a Hungarian Residence Permit for Studies may legally work up to 24 hours per week during academic terms and up to 66 working days (or full-time) outside term time, typically through registered student work cooperatives (Diákmunka). After graduating from a Hungarian university, you can apply for a 9-month Study-to-Work (Job Seeker / Entrepreneurship) residence permit to secure full-time employment or establish a business in Hungary.',
  },
  {
    question: 'What is EduExpress’s service charge for Hungary admission and visa guidance?',
    answer:
      'EduExpress charges BDT 0 for file opening. You pay zero upfront consultancy fees during university selection, entrance exam preparation, or visa documentation. Under our written European service agreement, our BDT 100,000 consultancy package is payable 100% after your Hungarian student visa is approved, while third-party costs (university application fee, tuition deposit via Student File, attestation, and consular fees) are paid directly to the official recipients.',
  },
];

export default async function HungaryStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Hungary', isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        tuition: true,
      },
      take: 8,
      orderBy: { name: 'asc' },
    });
  } catch {
    universities = [];
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Hungary Student Visa from Bangladesh 2027: NDGAP Residence Permit & Solvency Guide',
        description:
          'Hungary Type D student visa guide for Bangladeshi students: NDGAP residence permit rules, New Delhi Embassy & VFS process, bank solvency, and work.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/hungary.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(HUNGARY_VISA_SOURCES),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Destinations', path: '/destinations' },
          { name: 'Hungary', path: '/study-in-hungary-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="NDGAP Type D Residence Permit · Stipendium & Self-Funded Tracks · BDT 0 Upfront Fee"
        title="Hungary Student Visa from Bangladesh 2027."
        lead="A complete regulatory guide to securing the Hungarian Residence Permit for the Purpose of Studies: comparing Stipendium Hungaricum scholarship visa privileges against self-funded NDGAP bank solvency rules, tuition SWIFT transfers, and consular interview preparation."
        actions={
          <>
            <Link href="/apply?country=Hungary" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Hungary Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/hungary-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Hungary Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Hungary" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Hungary visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 130 BDT</strong> · <strong>1,000 HUF ≈ 330 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Permit Category
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Type D + Appendix 14</p>
              <p className="mt-1 text-xs text-slate-600">Single-entry D visa to collect your biometric study residence permit in Hungary.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Self-Funded Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€6,500 – €8,000</p>
              <p className="mt-1 text-xs text-slate-600">~8.5L to 10.4L BDT liquid balance + paid 1st-semester/year tuition receipt.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Stipendium Track
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€0 Visa Fee</p>
              <p className="mt-1 text-xs text-slate-600">Tempus Public Foundation Letter of Award waives visa fee &amp; tuition proof.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Work &amp; Post-Study
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">24 hrs/wk + 9-Mo PSW</p>
              <p className="mt-1 text-xs text-slate-600">Legal Diákmunka student work plus 9-month job-seeker permit after graduation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Stipendium Hungaricum vs Self-Funded Visa Track */}
      <Section
        id="visa-tracks"
        tone="white"
        title="Two distinct Hungarian student visa tracks for Bangladeshi applicants."
        intro="NDGAP assesses your residence permit differently depending on whether you hold a bilateral Stipendium Hungaricum government scholarship or a self-funded university offer."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">Track A · Bilateral Government Scholar</span>
            <h3 className={`mt-4 ${kit.h3}`}>Stipendium Hungaricum Visa Route</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Nomination &amp; Award Proof:</strong> Requires nomination by the Bangladesh Ministry of Education (SHED) and the official Letter of Award issued by the Tempus Public Foundation (TPF).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Financial &amp; Insurance Exemption:</strong> The TPF Letter of Award legally certifies 100% tuition waiver, dormitory bed (or HUF 40,000/mo rent grant), health coverage, and monthly stipend.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Consular Fee Waiver:</strong> Stipendium Hungaricum awardees are exempt from the standard EUR 110 residence permit fee and accelerated processing prioritizes September arrival.</span>
              </li>
            </ul>
          </div>

          <div className={kit.cardSage}>
            <span className="rounded-full bg-petrol-800 px-3 py-1 text-xs font-bold text-white">Track B · Direct University Admission</span>
            <h3 className={`mt-4 ${kit.h3}`}>Self-Funded Residence Permit Route</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Paid Tuition &amp; SWIFT MT103:</strong> You must pass the university’s online entrance exam/interview, remit 1st-year (or 1st-semester) tuition via a Bangladesh Bank Student File, and present the official university payment confirmation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>6-Month Bank Statement &amp; Solvency:</strong> Show EUR 6,500–8,000 (~8.5L–10.4L BDT) closing balance in a major Bangladeshi commercial bank with a notarized sponsor declaration, trade license/salary slips, and tax certificates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Accommodation &amp; Health Insurance:</strong> Provide a confirmed university dormitory contract or registered Hungarian lease agreement (with Property Sheet / Tulajdoni lap) plus Schengen travel medical insurance (EUR 30,000 coverage).</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 2: 6-Stage Visa Application Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="6-stage Hungary student visa &amp; NDGAP process from Bangladesh."
        intro="Plan at least 10 to 14 weeks ahead of your September or February intake so document attestation and consular booking do not delay your arrival."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'Entrance Interview & Tuition SWIFT Wire',
              timeline: '12–16 Weeks Before Intake',
              body: 'Clear the Hungarian university’s Skype/Zoom entrance examination. Open a Student File at an Authorized Dealer bank in Bangladesh and remit tuition in EUR (retaining the SWIFT MT103 copy).',
            },
            {
              step: 'Stage 02',
              title: 'Final Letter of Acceptance & Housing Contract',
              timeline: '10–12 Weeks Before Intake',
              body: 'Upon receiving the tuition wire, the Hungarian university issues your unconditional Final Letter of Acceptance and confirms your dormitory reservation or accommodation agreement.',
            },
            {
              step: 'Stage 03',
              title: 'Certificate Attestation & Sponsor File',
              timeline: '8–10 Weeks Before Intake',
              body: 'Attest SSC/HSC/Bachelor certificates through the Education Board, Ministry of Education, and MoFA Dhaka. Compile sponsor bank statements (6 months), tax returns (TIN/IT-10B), and notarized affidavit.',
            },
            {
              step: 'Stage 04',
              title: 'Consular Appointment, Biometrics & Interview',
              timeline: '6–8 Weeks Before Intake',
              body: 'Submit the NDGAP Residence Permit application (form + Appendix 14), travel insurance, and supporting documents at the designated consular/VFS submission center and complete the academic interview.',
            },
            {
              step: 'Stage 05',
              title: 'NDGAP Decision & Type D Entry Visa',
              timeline: '3–5 Weeks Processing Time',
              body: 'NDGAP in Hungary reviews your file. Once approved, a Single-Entry Type D Visa is stamped in your passport, valid for 30 days from your date of entry into Hungary.',
            },
            {
              step: 'Stage 06',
              title: 'Arrival in Hungary & Biometric Residence Card',
              timeline: 'Within 30 Days of Landing',
              body: 'Enroll at your university, finalize your Hungarian address card registration, and collect your plastic biometric Residence Permit for Studies from the regional NDGAP directorate.',
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">{item.step}</span>
                  <span className="text-xs font-semibold text-slate-500">{item.timeline}</span>
                </div>
                <h3 className="mt-4 text-[19px] font-bold text-petrol-800">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: Refusal Prevention & Interview Readiness */}
      <Section
        id="refusal-prevention"
        tone="white"
        title="How to pass the Hungarian consular interview and avoid NDGAP refusal."
        intro="Hungarian visa officers rigorously test whether an applicant’s true objective is academic study at a Hungarian university or unauthorized migration."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">Mandatory Consular Interview Preparation</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Know Your Exact Syllabus:</strong> Be prepared to name 4 to 6 core subjects from your 1st- and 2nd-year curriculum at Debrecen, Szeged, Pécs, BME, or Corvinus, and explain the ECTS credit system (180–240 ECTS for Bachelor’s, 120 ECTS for Master’s).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Explain Your City &amp; Campus Facts:</strong> Know the population, distance from Budapest, dormitory address, and realistic monthly living budget in HUF and EUR for your specific university city.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Sponsor Income Consistency:</strong> Ensure you can clearly explain your father’s or mother’s occupation, monthly net income, and how the bank deposits match their official tax assessment or business turnover.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical NDGAP Refusal Triggers to Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Sudden Lump-Sum Cash Deposits:</strong> Depositing 8–10 Lakh BDT in cash two weeks before visa filing without matching business or salary history is flagged immediately as borrowed "show money".</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Unverified Private Lease Contracts:</strong> Submitting fake Airbnb bookings or private rental contracts without the landlord’s official Hungarian land registry extract (Tulajdoni lap).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Education-First Mandate:</strong> Never frame a Hungarian study application around border mobility; your interview and motivation letter must center strictly on the academic quality of your Hungarian degree.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified Hungarian Universities */}
      {universities.length > 0 && (
        <Section
          id="hungary-universities"
          tone="sage"
          title="Verified Hungarian universities in the EduExpress directory."
          intro="Compare public state universities in Budapest, Debrecen, Szeged, and Pécs."
          action={
            <Link href="/universities?country=hungary" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Hungary universities <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-5 transition hover:border-petrol-800 hover:shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Hungary'}</span>
                  <h3 className="mt-1.5 text-[17px] font-bold text-petrol-800 group-hover:underline">{uni.name}</h3>
                  {uni.tuition && <p className="mt-2 text-xs text-slate-600">Tuition: {uni.tuition}</p>}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-petrol-800">
                  View profile &amp; fees <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Module 5: Written Service Terms Banner */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Written Cost Transparency</span>
            <h2 className="mt-1 font-display text-2xl font-black sm:text-4xl text-white">
              BDT 0 File-Opening Charge · Pay EduExpress Only After Visa Approval
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We charge BDT 0 upfront to open your Hungary file. Every third-party expense (university application fee, Student File tuition transfer, document attestation, and consular fee) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is due only after visa issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-hungary-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Hungary Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/hungary-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Hungary Tuition &amp; Living Cost Breakdown
              </Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Our Fee &amp; Transparency Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQs */}
      <FaqBlock
        items={HUNGARY_VISA_FAQS}
        title="Frequently asked questions about the Hungary student visa."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Hungarian immigration sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUNGARY_VISA_SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40"
            >
              <div>
                <span className="flex items-center justify-between gap-2 text-xs font-bold text-petrol-800">
                  <span>{source.label}</span>
                  <ExternalLink size={13} className="shrink-0" aria-hidden="true" />
                </span>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-600">{source.note}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-white p-5 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against National Directorate-General for Aliens Policing (NDGAP / OIF) statutory residence rules, Tempus Public Foundation guidelines, and Bangladesh Bank Student File regulations on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, Stipendium Hungaricum scholarship award, and residence permit/visa decisions rest solely with the respective Hungarian universities, Tempus Public Foundation, and official Hungarian immigration authorities.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">NDGAP Solvency &amp; Admission Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Hungary Visa &amp; Scholarship Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic CGPA, IELTS status, and budget. Our Dhanmondi team will evaluate your eligibility for Stipendium Hungaricum and self-funded Hungarian state universities within one working day.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-canvas-soft p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

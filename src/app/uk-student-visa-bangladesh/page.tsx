import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe,
  GraduationCap,
  Hospital,
  IdCard,
  Landmark,
  MapPin,
  Plane,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/uk-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const UK_VISA_SOURCES = [
  {
    label: 'UK Visas and Immigration (UKVI) — Official Student Visa Route Overview',
    href: 'https://www.gov.uk/student-visa',
    note: 'Statutory UK Home Office guidance on Student Route eligibility, Confirmation of Acceptance for Studies (CAS), application fees (£490), and entry permissions.',
  },
  {
    label: 'UKVI — Financial Evidence & 28-Day Maintenance Requirements',
    href: 'https://www.gov.uk/student-visa/money',
    note: 'Statutory maintenance funds: £1,483/month (up to 9 months = £13,347) in London vs £1,136/month (up to 9 months = £10,224) outside London, held continuously for 28 days.',
  },
  {
    label: 'UKVI — Immigration Health Surcharge (IHS) Statutory Fee Schedule',
    href: 'https://www.gov.uk/healthcare-immigration-application/how-much-pay',
    note: 'Mandatory National Health Service (NHS) surcharge of £776 per year of visa grant paid online during the UKVI visa application.',
  },
  {
    label: 'UKVI — Tuberculosis (TB) Testing in Bangladesh (IOM Dhaka)',
    href: 'https://www.gov.uk/tb-test-visa/countries-where-you-need-a-tb-test-to-enter-the-uk',
    note: 'Compulsory pre-application chest X-ray and TB clearance certificate issued exclusively by the International Organization for Migration (IOM) Health Assessment Centre in Dhaka or Sylhet.',
  },
  {
    label: 'VFS Global Bangladesh — UK Visa Application Centres (Dhaka, Sylhet & Chattogram)',
    href: 'https://visa.vfsglobal.com/bgd/en/gbr',
    note: 'Authorized biometric enrolment, document scanning, and passport submission centres in Bangladesh for UKVI Student Visa applicants.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File & CAS Deposit Remittance)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer (AD) commercial bank rules for opening a Student File and wiring university CAS deposits via SWIFT (Form TM).',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'UK Student Visa from Bangladesh 2027 | CAS & Process',
    description:
      'UK student visa guide for Bangladeshi students: CAS issuance, 28-day UKVI bank maintenance (£1,483/mo London vs £1,136), IOM Dhaka TB test, and VFS.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('uk', 'UK Student Visa from Bangladesh — EduExpress International'),
  });
}

const UK_VISA_FAQS = [
  {
    question: 'What are the exact financial maintenance funds required for a UK Student Visa from Bangladesh in 2027?',
    answer:
      'Under UK Visas and Immigration (UKVI) rules, you must demonstrate liquid funds covering your remaining first-year tuition fee (total first-year tuition minus any advance CAS deposit already paid to the university) PLUS 9 months of statutory living costs. The living maintenance rate is £1,483 per month for universities inside London (totalling £13,347 for 9 months, or ~20.7 Lakh BDT) and £1,136 per month for universities outside London (totalling £10,224 for 9 months, or ~15.85 Lakh BDT). These funds must remain continuously above the threshold for at least 28 consecutive days.',
  },
  {
    question: 'How does the UKVI 28-day bank statement rule work for Bangladeshi applicants?',
    answer:
      'The entire required sum (unpaid first-year tuition + 9-month maintenance) must sit undisturbed in an eligible Bangladeshi commercial bank account for a minimum of 28 consecutive calendar days. The balance cannot drop below the required GBP equivalent on any single day during those 28 days. Furthermore, the closing date of the bank statement or certificate must be no more than 31 days old on the exact day you submit and pay for your online UKVI visa application on GOV.UK.',
  },
  {
    question: 'Where do Bangladeshi students take the mandatory UK Tuberculosis (TB) medical test?',
    answer:
      'Because Bangladeshi students are applying for a UK stay longer than 6 months, a UKVI-approved Tuberculosis (TB) clearance certificate is mandatory before you can receive your CAS at many universities or submit your visa. Only the International Organization for Migration (IOM) Migration Health Assessment Centres in Dhaka ( Gulshan / Banani ) and Sylhet are authorized by the UK Home Office. General hospital or private diagnostic clinic X-rays are rejected. The certificate is valid for 6 months.',
  },
  {
    question: 'What happens during the UK Pre-CAS and UKVI Credibility Interview?',
    answer:
      'Bangladeshi applicants typically undergo two compliance checks: first, a Pre-CAS interview conducted by the UK university before issuing your Confirmation of Acceptance for Studies (CAS); second, a potential UKVI Credibility Interview conducted via video link at VFS Global or by phone/email after biometric submission. Caseworkers assess whether you are a genuine student by questioning your choice of specific course modules, why you chose that UK university over alternatives in Bangladesh or other countries, how the degree aligns with realistic career returns, and the verifiable income source behind your sponsor’s bank funds.',
  },
  {
    question: 'Can Bangladeshi students bring dependants (spouse or children) on a UK Student Visa in 2027?',
    answer:
      'Under UK immigration rules in force since January 2024 and continuing into 2027, international students enrolled in undergraduate Bachelor’s or taught Master’s (MA, MSc, MBA) programs cannot sponsor family dependants. Only students enrolled in postgraduate research programs (PhD, DPhil, or research-based Master’s such as MRes/MPhil at level 7 or 8) or scholars fully funded by a central government award for a course lasting over 6 months are permitted to bring a spouse and children.',
  },
  {
    question: 'What is EduExpress’s service charge and payment timing for UK admission and visa processing?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge for UK admission and visa counseling. You pay zero upfront agency fees during university shortlisting, offer processing, Pre-CAS interview preparation, and VFS visa filing. Our transparent European/UK service package (BDT 100,000) is payable 100% after visa approval under written service terms, while third-party official expenses (university CAS deposit, IOM TB test, IHS surcharge, and £490 UKVI fee) are paid directly by the student to the respective authorities.',
  },
];

export default async function UkStudentVisaPage() {
  let ukUnis: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    ukUnis = await prisma.university.findMany({
      where: {
        country: { in: ['UK', 'United Kingdom', 'uk'] },
        isActive: true,
      },
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
    ukUnis = [];
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
        name: 'UK Student Visa from Bangladesh 2027: CAS, 28-Day Funds & VFS Process | EduExpress',
        description:
          'UK student visa guide for Bangladeshi students: CAS issuance, 28-day UKVI bank maintenance (£1,483/mo London vs £1,136), IOM Dhaka TB test, and VFS.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/uk.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(UK_VISA_SOURCES),
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
          { name: 'United Kingdom', path: '/study-in-uk-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="UKVI Student Route · CAS & 28-Day Financial Rules · BDT 0 Upfront File Fee"
        title="UK Student Visa from Bangladesh 2027."
        lead="An evidence-first legal and financial roadmap for Bangladeshi students applying under the UKVI Student Route: passing your university Pre-CAS compliance interview, structuring 28-day bank maintenance funds in Bangladesh Bank-regulated accounts, IOM Dhaka TB screening, and VFS Global biometrics."
        actions={
          <>
            <Link href="/apply?country=UK" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free UK Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/uk-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare UK Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="UK" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="UK visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 GBP (£) ≈ 155 BDT</strong> (always verify OANDA / UKVI daily exchange rate before locking 28-day funds).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Sponsor Document
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">CAS Reference Number</p>
              <p className="mt-1 text-xs text-slate-600">70 points total: 50 points for CAS &amp; course + 10 funds + 10 English.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> 9-Month Maintenance
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">£13,347 / £10,224</p>
              <p className="mt-1 text-xs text-slate-600">London (£1,483/mo) vs Outside London (£1,136/mo) held 28 days.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Official Visa &amp; IHS Fees
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">£490 + £776/year</p>
              <p className="mt-1 text-xs text-slate-600">UKVI application fee plus annual NHS Immigration Health Surcharge.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Biometrics &amp; Medical
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">IOM + VFS Global BD</p>
              <p className="mt-1 text-xs text-slate-600">IOM TB clearance &amp; VFS centres in Dhaka, Sylhet, and Chattogram.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Who Fits the UK Visa Route — and Common Refusal Risks */}
      <Section
        id="visa-fit"
        tone="white"
        title="Who fits the UK Student Route — and why Bangladeshi applications get refused."
        intro="The UK Student Visa is a strict points-based system (70 points required). Understanding refusal triggers before paying a CAS deposit protects your family from financial loss."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <div className="flex items-center gap-3">
              <span className={kit.iconLime}><CheckCircle2 size={22} aria-hidden="true" /></span>
              <h3 className={kit.h3}>Strong UK Student Visa Profiles</h3>
            </div>
            <ul className="mt-5 space-y-3 text-[15px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Clear Academic Progression:</strong> Applicants moving logically from HSC/A-Levels to a UK Bachelor’s, or from a 4-year Bangladeshi Bachelor’s to a specialized 1-year UK Master’s or MRes/PhD.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Verifiable Bank Maturity:</strong> Liquid savings held in the student’s or parents’ personal account at a Bangladesh Bank-regulated commercial bank with zero dips below the 28-day minimum.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Documented Study Gaps:</strong> Any academic gap (up to 2–3 years for Bachelor’s, 5–8 years for Master’s) backed by verifiable employment certificates, salary bank trails, or tax returns.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Authentic Course Knowledge:</strong> Students who can clearly explain specific course modules, UK tuition ROI, and realistic post-study career plans during Pre-CAS and UKVI interviews.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={22} aria-hidden="true" />
              </span>
              <h3 className="text-[21px] font-semibold leading-[1.3] text-amber-950">Top UKVI Visa Refusal Triggers in Bangladesh</h3>
            </div>
            <ul className="mt-5 space-y-3 text-[15px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Exchange Rate Drop During 28 Days:</strong> Holding exact BDT without a 5%–10% buffer; if the BDT weakens against GBP on day 25, your account falls short under OANDA conversion rules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Unacceptable Sponsors or Accounts:</strong> Submitting statements from uncles, cousins, corporate company current accounts, cooperative credit unions, or unverified rural branches. Only student, parent, or legal guardian accounts are accepted.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Informal Hundi CAS Remittance:</strong> Paying the university CAS deposit via third-party foreign cards or informal Hundi channels instead of a formal Bangladesh Bank Student File.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Generic Credibility Interview Answers:</strong> Memorizing agency scripts without knowing your actual university campus location, accommodation cost, or specific curriculum credits.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 2: Step-by-Step 6-Stage UK Student Visa Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="6-stage UK student visa process from Bangladesh."
        intro="Every stage from receiving your unconditional admission offer to collecting your passport and activating your UKVI eVisa account."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'Unconditional Offer & Pre-CAS Interview',
              timeline: '8–12 Weeks Before Intake',
              body: 'Fulfill all academic and English (IELTS/PTE/MOI) conditions. Complete the university’s mandatory Pre-CAS compliance interview and financial document pre-check.',
            },
            {
              step: 'Stage 02',
              title: 'IOM Dhaka / Sylhet TB Screening',
              timeline: '6–10 Weeks Before Intake',
              body: 'Book your appointment with IOM Bangladesh (Dhaka or Sylhet). Complete the chest X-ray screening (~12,500 BDT) to obtain your 6-month UKVI TB Clearance Certificate.',
            },
            {
              step: 'Stage 03',
              title: 'CAS Deposit via Student File & 28-Day Lock',
              timeline: '4–8 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh to wire your CAS deposit (£2,000–£5,000). Maintain the remaining tuition + 9-month living funds untouched for 28 consecutive days.',
            },
            {
              step: 'Stage 04',
              title: 'CAS Statement Issuance & Verification',
              timeline: '4–6 Weeks Before Intake',
              body: 'Once your 28-day bank statement and TB certificate are verified, the university issues your unique 14-digit Confirmation of Acceptance for Studies (CAS) number.',
            },
            {
              step: 'Stage 05',
              title: 'GOV.UK Online Application & IHS Payment',
              timeline: 'Within 31 Days of Bank Statement',
              body: 'Submit the Student Visa form on GOV.UK before your bank statement exceeds 31 days of age. Pay the Immigration Health Surcharge (£776/year) and visa fee (£490) online.',
            },
            {
              step: 'Stage 06',
              title: 'VFS Biometrics, Credibility Check & eVisa',
              timeline: '3 Weeks Standard / 5 Days Priority',
              body: 'Attend biometrics at VFS Global (Dhaka, Sylhet, or Chattogram). Complete any UKVI credibility interview if requested, receive your entry vignette, and link your digital UKVI eVisa account.',
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

      {/* Module 3: 28-Day Financial Evidence Matrix */}
      <Section
        id="financial-rules"
        tone="white"
        title="UKVI 28-day financial evidence &amp; bank solvency calculation."
        intro="UKVI calculates required funds using a strict mathematical formula: (Remaining 1st-Year Tuition shown on CAS) + (9 Months Living Maintenance)."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">UKVI financial maintenance requirements for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Cost Component / Location</th>
                <th className="px-6 py-4 font-bold">Monthly Rate (GBP)</th>
                <th className="px-6 py-4 font-bold">9-Month Cap (GBP)</th>
                <th className="px-6 py-4 font-bold">BDT Equivalent (1 GBP ≈ 155 BDT)</th>
                <th className="px-6 py-4 font-bold">Statutory Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Inner &amp; Greater London Universities</td>
                <td className="px-6 py-4">£1,483 / month</td>
                <td className="px-6 py-4 font-bold text-petrol-800">£13,347</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~20,68,785 BDT</td>
                <td className="px-6 py-4">Covers City of London &amp; 32 London Boroughs</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">Outside London (Rest of UK)</td>
                <td className="px-6 py-4">£1,136 / month</td>
                <td className="px-6 py-4 font-bold text-petrol-800">£10,224</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~15,84,720 BDT</td>
                <td className="px-6 py-4">Manchester, Birmingham, Leeds, Scotland, Wales, NI</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Remaining First-Year Tuition</td>
                <td className="px-6 py-4">Varies by CAS</td>
                <td className="px-6 py-4 font-bold text-petrol-800">£10,000 – £20,000+</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~15.5L – 31.0L BDT</td>
                <td className="px-6 py-4">Gross 1st-year fee minus paid CAS deposit &amp; scholarship</td>
              </tr>
              <tr className="bg-lime-pale/60">
                <td className="px-6 py-4 font-bold text-petrol-800">Recommended Exchange Buffer</td>
                <td className="px-6 py-4">+5% to 8% extra</td>
                <td className="px-6 py-4 font-bold text-petrol-800">+£1,200 – £2,000</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">+2.0L – 3.1L BDT</td>
                <td className="px-6 py-4">Protects against OANDA GBP/BDT currency fluctuation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[18px] font-bold text-petrol-800">Eligible Account Holders &amp; Bank Formats</h3>
            <ul className="mt-3 space-y-2.5 text-[14.5px] leading-6 text-ink-soft">
              <li>• <strong>Acceptable Accounts:</strong> Personal savings accounts, current accounts, or Fixed Deposit Receipts (FDRs that can be encashed immediately without penalty) in the name of the student or biological/adoptive parents.</li>
              <li>• <strong>Parent Sponsorship Proof:</strong> If funds are in a parent’s account, you must provide an official English Birth Certificate naming both parents and a signed Letter of Financial Consent confirming the funds are available for your UK study.</li>
              <li>• <strong>Bank Verification Readiness:</strong> Use headquarters or major urban branches of Bangladesh Bank-regulated commercial banks (Standard Chartered, HSBC, EBL, City Bank, BRAC Bank, Prime Bank, MTB, Dhaka Bank) that respond promptly to UKVI email/phone verification queries.</li>
            </ul>
          </div>

          <div className={kit.cardSage}>
            <h3 className="text-[18px] font-bold text-petrol-800">Complete UK Visa Document Checklist</h3>
            <ul className="mt-3 space-y-2.5 text-[14.5px] leading-6 text-ink-soft">
              <li>• Valid Passport (minimum 6 months validity beyond planned arrival) and CAS Statement.</li>
              <li>• Original SSC, HSC, and Bachelor’s (for PG) certificates and transcripts listed on your CAS.</li>
              <li>• Approved SELT score report (IELTS UKVI/Academic, PTE Academic UKVI) or university MOI assessment recorded on CAS.</li>
              <li>• 28-Day Bank Statement &amp; Solvency Certificate (issued within 31 days of online application) + Birth Certificate &amp; Parent Consent Letter.</li>
              <li>• IOM Dhaka / Sylhet TB Clearance Certificate and ATAS Certificate (if studying sensitive postgraduate STEM research subjects).</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified UK Universities in Directory */}
      {ukUnis.length > 0 && (
        <Section
          id="uk-universities"
          tone="sage"
          title="Verified UK universities in the EduExpress directory."
          intro="Compare tuition, city locations, and admission pathways at licensed UK Student Sponsor universities."
          action={
            <Link href="/universities?country=uk" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all UK universities <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ukUnis.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-5 transition hover:border-petrol-800 hover:shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'United Kingdom'}</span>
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

      {/* Module 5: EduExpress Written Service Terms & Cross-Links */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Written Cost Transparency</span>
            <h2 className="mt-1 font-display text-2xl font-black sm:text-4xl text-white">
              BDT 0 File-Opening Charge · Pay EduExpress Only After Visa Approval
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We do not charge upfront file-opening fees for the UK. You receive a 1-page itemized <strong>ClearCost Sheet</strong> separating university CAS deposits, IOM medical fees, IHS surcharges, and UKVI visa fees from our BDT 100,000 service package (payable 100% after visa issuance).
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-uk-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                UK Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/uk-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                UK Tuition &amp; Living Cost Breakdown
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
        items={UK_VISA_FAQS}
        title="Frequently asked questions about the UK student visa."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official UKVI sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UK_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <strong>Abdullah Al Rakib</strong> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against UK Visas and Immigration (UKVI) Student Route caseworker guidance, IOM Bangladesh TB protocols, and Bangladesh Bank Foreign Exchange rules on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, CAS issuance, and visa decisions rest solely with the respective UK universities and UK Visas and Immigration (UKVI) authorities.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">28-Day Financial &amp; CAS Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your UK Student Visa &amp; CAS Readiness</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS/PTE status, and target intake. Our Dhanmondi counseling team will calculate your exact 28-day UKVI bank balance requirement within one working day.
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

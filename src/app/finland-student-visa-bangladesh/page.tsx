import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
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
const PATH = '/finland-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const FINLAND_VISA_SOURCES = [
  {
    label: 'Finnish Immigration Service (Migri) — Residence Permit for Studies',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Statutory Finnish immigration authority enforcing the EUR 800/month (EUR 9,600/year) personal bank account living fund requirement, health insurance thresholds, and Type A continuous residence permits.',
  },
  {
    label: 'Enter Finland — Official Online Residence Permit Application Service',
    href: 'https://enterfinland.fi/',
    note: 'Mandatory electronic portal of the Finnish Immigration Service for submitting student residence permit applications (EUR 450 online fee) and tracking Migri processing.',
  },
  {
    label: 'Ministry for Foreign Affairs of Finland & Embassy of Finland in New Delhi (VFS Global)',
    href: 'https://finlandabroad.fi/web/ind/mission',
    note: 'Accredited diplomatic mission and VFS Global biometric identification centre serving Bangladeshi residence permit applicants.',
  },
  {
    label: 'Studyinfo.fi (Opintopolku) — Finnish National Agency for Education (EDUFI)',
    href: 'https://opintopolku.fi/konfo/en/',
    note: 'National admissions portal verifying unconditional university study places at Finnish Research Universities and Universities of Applied Sciences (UAS).',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File & EUR 9,600 Living Fund Rules)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File, wiring early-bird Finnish tuition in EUR, and documenting legal source of funds.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Finland Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Finland student residence permit guide for Bangladeshi students: Enter Finland portal, Migri €9,600/yr personal bank funds, New Delhi VFS, and Type A.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('finland', 'Finland Student Visa from Bangladesh — EduExpress International'),
  });
}

const FINLAND_VISA_FAQS = [
  {
    question: 'What is the exact bank balance required by Migri for a Finland student residence permit in 2027?',
    answer:
      'The Finnish Immigration Service (Migri) mandates a statutory minimum of EUR 800 per month for living expenses, which equals EUR 9,600 for one full 12-month year (approximately 12.48 Lakh BDT at 1 EUR ≈ 130 BDT). Crucially, Migri requires this entire EUR 9,600 sum to be deposited in liquid cash inside the student’s own individual bank account (solely in the student’s name, not a joint account and not a parent’s bank statement). In addition, you must show proof that your first-year tuition fee has already been paid to the Finnish university via a Bangladesh Bank Student File (or show the equivalent unpaid tuition balance on top of the EUR 9,600). Any consultancy quoting the old EUR 560/month rate is citing obsolete rules abolished in November 2024.',
  },
  {
    question: 'Why does Migri reject parent bank statements that have not been transferred to the student’s own account?',
    answer:
      'Under Section 46 of the Finnish Aliens Act, a student must have the required EUR 9,600 living funds personally at their independent disposal. While parents or a spouse may sponsor the money, the sponsor must legally transfer the funds into the student’s personal bank account before the Enter Finland application is submitted. Furthermore, Migri caseworkers rigorously audit the origin of the transfer: you must attach a signed Deed of Gift / Sponsor Affidavit alongside 6 months of your sponsor’s bank statements, income tax returns (TIN/IT-10B), and business trade license or employment salary slips proving the funds were earned lawfully and are not borrowed "show money".',
  },
  {
    question: 'What type of health insurance is mandatory for Bangladeshi students applying to Finland?',
    answer:
      'Non-EU/EEA students must purchase Migri-compliant private health insurance before their residence permit can be granted. For degree programs lasting two years or longer (such as a 3.5–4 year UAS Bachelor’s or 2-year Master’s), students receive a home municipality (Kotikunta) in Finland, so your insurance needs to cover medical costs up to at least EUR 40,000 with a deductible no higher than EUR 300. For studies lasting less than two years, insurance must cover up to EUR 120,000. Migri explicitly accepts plans such as Swisscare (Plan P), SIP International Student Insurance, and AON Student Insurance.',
  },
  {
    question: 'Where do Bangladeshi students give biometrics for a Finnish Residence Permit?',
    answer:
      'Finland does not currently maintain a biometric residence permit counter in Dhaka. After submitting your online application and paying the EUR 450 fee on the Enter Finland portal, Bangladeshi applicants must book an in-person identification and fingerprint appointment at the VFS Global Finland Residence Permit Centre / Embassy of Finland in New Delhi, India. Students must therefore maintain a valid Indian visa (Double-Entry or Tourist/Transit visa) early in their admission timeline so they can travel to New Delhi with their original academic certificates and bank documents.',
  },
  {
    question: 'What is a Type A Continuous Residence Permit and how does it help Bangladeshi students?',
    answer:
      'Since April 2022, higher education degree students admitted to Finnish Universities and Universities of Applied Sciences (UAS) are granted a Continuous Residence Permit (Type A) valid for the entire duration of their degree (provided health insurance and passport validity are maintained), rather than a temporary Type B permit. Holding a Type A permit allows every year of your university study in Finland to count toward the continuous residence requirement for a Permanent Residence (PR) permit once you graduate and transition into employment, and grants a 2-year Post-Study Job Seeker Residence Permit.',
  },
  {
    question: 'What is EduExpress’s service charge for Finland admission and residence permit guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge. You pay zero upfront consultancy fees for Finnish university selection (Studyinfo.fi joint or separate application), scholarship guidance, or Enter Finland documentation preparation. Under our written European service agreement, our BDT 100,000 service package is payable 100% after your Finnish Residence Permit for Studies is approved by Migri, while third-party costs (tuition payment via Student File, Swisscare insurance, EUR 450 Enter Finland fee, and New Delhi VFS travel) are paid directly by the student.',
  },
];

export default async function FinlandStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Finland', isActive: true },
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
        name: 'Finland Student Visa from Bangladesh 2027: Migri €9,600 Rule & Enter Finland Guide',
        description:
          'Finland student residence permit guide for Bangladeshi students: Enter Finland portal, Migri €9,600/yr personal bank funds, New Delhi VFS, and Type A.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/finland.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(FINLAND_VISA_SOURCES),
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
          { name: 'Finland', path: '/study-in-finland-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Migri Type A Residence Permit · €9,600 Personal Account Rule · BDT 0 Upfront Fee"
        title="Finland Student Visa from Bangladesh 2027."
        lead="An evidence-first legal and financial roadmap for Bangladeshi students applying for the Finnish First Residence Permit for Studies via Enter Finland: structuring the mandatory EUR 9,600/year personal bank account balance, documenting sponsor provenance, Swisscare health insurance, and VFS New Delhi biometrics."
        actions={
          <>
            <Link href="/apply?country=Finland" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Finland Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/finland-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Finland Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Finland" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Finland residence permit statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 130 BDT</strong> (statutory Migri minimum: EUR 800/month = EUR 9,600/year).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Permit Class
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Type A Continuous</p>
              <p className="mt-1 text-xs text-slate-600">Granted for full degree duration; counts toward Finnish PR.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Personal Living Fund
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€9,600 / Year</p>
              <p className="mt-1 text-xs text-slate-600">€800/mo (~12.48L BDT) strictly in student’s own personal account.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Portal &amp; Biometrics
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Enter Finland + New Delhi</p>
              <p className="mt-1 text-xs text-slate-600">€450 electronic application + VFS New Delhi in-person identification.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Work &amp; Post-Study
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">30 hrs/wk + 2-Yr PSW</p>
              <p className="mt-1 text-xs text-slate-600">30 hrs/wk average work allowance plus 2-year Job Seeker Permit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Statutory Migri Financial & Insurance Matrix */}
      <Section
        id="migri-requirements"
        tone="white"
        title="Migri statutory financial &amp; health insurance rules for 2027."
        intro="The Finnish Immigration Service (Migri) audits financial self-sufficiency with forensic precision. Every euro in your personal account must have a documented legal origin."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Finnish Immigration Service Migri financial and insurance requirements</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Requirement Category</th>
                <th className="px-6 py-4 font-bold">Statutory Amount (EUR)</th>
                <th className="px-6 py-4 font-bold">BDT Equivalent (1 EUR ≈ 130 BDT)</th>
                <th className="px-6 py-4 font-bold">Strict Migri Compliance Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">12-Month Living Funds</td>
                <td className="px-6 py-4 font-bold text-petrol-800">€9,600 (€800 / mo)</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~12,48,000 BDT</td>
                <td className="px-6 py-4">Must be held in liquid cash in the student’s SOLE personal bank account</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">First-Year Tuition Proof</td>
                <td className="px-6 py-4">€6,000 – €15,000 (Net)</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~7.8L – 19.5L BDT</td>
                <td className="px-6 py-4">Pay upfront via Bangladesh Bank Student File (recommended for early-bird discount)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Health Insurance (Degree ≥ 2 Yrs)</td>
                <td className="px-6 py-4">€40,000 Coverage Cap</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">Premium: ~€200–€320/yr</td>
                <td className="px-6 py-4">Max deductible €300 (Swisscare / SIP / AON); active from arrival date</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">Enter Finland Application Fee</td>
                <td className="px-6 py-4 font-bold text-petrol-800">€450 (Online)</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">~58,500 BDT</td>
                <td className="px-6 py-4">Paid via international card on enterfinland.fi prior to VFS biometrics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: 6-Stage Residence Permit Process */}
      <Section
        id="visa-process"
        tone="sage"
        title="6-stage Finland student residence permit process from Bangladesh."
        intro="Coordinate your Bangladesh Bank Student File, personal account fund transfer, and Indian visa early so you can attend VFS New Delhi biometrics without delay."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'Studyinfo.fi Offer & Early-Bird Acceptance',
              timeline: 'March – May (for Aug/Sept Intake)',
              body: 'Receive your unconditional admission offer via Studyinfo.fi (Opintopolku) from a Finnish UAS or Research University and confirm your study place before the deadline.',
            },
            {
              step: 'Stage 02',
              title: 'Student File Tuition Wire & €9,600 Transfer',
              timeline: '12–16 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh to wire 1st-year tuition (capturing early-bird discounts). Transfer EUR 9,600 equivalent from parent to student’s personal bank account with a notarized Deed of Gift.',
            },
            {
              step: 'Stage 03',
              title: 'Swisscare / SIP Insurance & Sponsor Trail',
              timeline: '10–12 Weeks Before Intake',
              body: 'Purchase Migri-compliant student health insurance (€40,000 cover, ≤€300 deductible). Compile 6-month bank statements for both student and sponsor, plus sponsor TIN, IT-10B tax returns, and income proof.',
            },
            {
              step: 'Stage 04',
              title: 'Enter Finland Electronic Application',
              timeline: '8–10 Weeks Before Intake',
              body: 'Create your account on enterfinland.fi, upload color scans of original certificates, tuition receipt, insurance, and bank provenance documents, and pay the EUR 450 online processing fee.',
            },
            {
              step: 'Stage 05',
              title: 'VFS Global / Embassy New Delhi Biometrics',
              timeline: '6–8 Weeks Before Intake',
              body: 'Travel to New Delhi, India to verify your original passport, academic certificates, and bank statements in person and submit fingerprints at the VFS Finland Residence Permit Centre.',
            },
            {
              step: 'Stage 06',
              title: 'Type A Residence Card & DVV Registration',
              timeline: '2–6 Weeks After Biometrics',
              body: 'Once Migri grants a positive decision, your physical biometric Type A Residence Permit card is dispatched. Fly to Helsinki and register your municipality of residence (Kotikunta) at DVV.',
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

      {/* Module 3: Refusal Prevention & Source of Funds Audit */}
      <Section
        id="refusal-prevention"
        tone="white"
        title="How to pass Migri’s source-of-funds audit and avoid refusal."
        intro="Over 90% of Finnish student residence permit refusals from South Asia stem from unverified cash deposits or funds kept in the wrong account."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">Migri-Compliant Financial Provenance Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Sole Student Ownership:</strong> Ensure your Bangladeshi commercial bank account is an individual savings account solely in your name, enabled for international access or linked to your Student File.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Bank-to-Bank Sponsor Transfer:</strong> Transfer the ~13.0 Lakh BDT (EUR 9,600 + buffer) via electronic bank transfer (BEFTN/RTGS/Cheque) directly from your parent’s bank account into your personal account — never via over-the-counter cash deposit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Complete Sponsor Tax &amp; Income Trail:</strong> Attach your parent’s 6-month bank statement showing the outgoing transfer, notarized Deed of Gift, NBR tax returns (IT-10B), and employment salary slips or audited business statements.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Top Migri Refusal Triggers in Bangladesh</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Cash Deposits Without Provenance:</strong> Depositing large cash sums into the student’s account without a matching bank-to-bank withdrawal from a tax-paying parent’s account triggers immediate rejection under Migri anti-fraud guidelines.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Leaving Funds in Parent’s Account:</strong> Unlike UK or Hungary, Finland does NOT accept a parent’s bank account statement alone; the EUR 9,600 must sit inside the student’s personal account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Delayed Indian Visa Planning:</strong> Waiting until after Enter Finland submission to apply for an Indian visa can cause you to miss VFS New Delhi biometric deadlines.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified Finnish Universities */}
      {universities.length > 0 && (
        <Section
          id="finland-universities"
          tone="sage"
          title="Verified Finnish universities in the EduExpress directory."
          intro="Compare Finnish Research Universities and Universities of Applied Sciences (UAS)."
          action={
            <Link href="/universities?country=finland" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Finland universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Finland'}</span>
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
              We charge BDT 0 upfront to open your Finland file. Every third-party cost (Student File tuition transfer, Swisscare health insurance, EUR 450 Enter Finland fee, and New Delhi VFS biometrics) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is payable only after your residence permit is approved.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-finland-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Finland Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/finland-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Finland Tuition &amp; Living Cost Breakdown
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
        items={FINLAND_VISA_FAQS}
        title="Frequently asked questions about the Finland student residence permit."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Finnish immigration sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FINLAND_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Finnish Immigration Service (Migri) EUR 9,600 income thresholds, Enter Finland electronic portal rules, and Bangladesh Bank Foreign Exchange guidelines on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and residence-permit guidance under written service terms. Final admission, scholarship waiver, and residence permit decisions rest solely with the respective Finnish universities and the Finnish Immigration Service (Migri).
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Migri €9,600 Provenance Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Finland Residence Permit &amp; Admission Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS/PTE score, and sponsor profile. Our Dhanmondi team will structure your Studyinfo.fi application and Migri source-of-funds file within one working day.
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

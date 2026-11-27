import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Info,
  Landmark,
  Plane,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Train,
  Utensils,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/hungary-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const HUNGARY_COST_SOURCES = [
  {
    label: 'Tempus Public Foundation — Stipendium Hungaricum Bilateral Scholarship Regulations',
    href: 'https://stipendiumhungaricum.hu/',
    note: 'Statutory Hungarian government scholarship covering 100% tuition, free dormitory or HUF 40,000/mo accommodation support, health insurance, and monthly living stipends.',
  },
  {
    label: 'National Directorate-General for Aliens Policing (NDGAP / OIF) — Residence Permit for Studies',
    href: 'http://oif.gov.hu/index.php?lang=en',
    note: 'Statutory solvency requirements for self-funded students: proof of 1 year living maintenance (~EUR 6,000–7,200), paid tuition receipt, and health coverage.',
  },
  {
    label: 'Embassy of Hungary in New Delhi & VFS Global Consular Mission',
    href: 'https://delhi.mfa.gov.hu/eng',
    note: 'Official visa application, consular biometric verification, and D-visa issuance guidelines for Bangladeshi degree seekers.',
  },
  {
    label: 'Study in Hungary (Official National Higher Education Portal)',
    href: 'https://studyinhungary.hu/',
    note: 'National tuition benchmarks across Hungarian state research universities: EUR 3,000 to EUR 8,000/year for STEM, Business, and Humanities.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Guidelines & Student File Regulations',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for outward SWIFT tuition wires in EUR and foreign exchange allocations for Bangladeshi students in Hungary.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Hungary from Bangladesh 2027 | EduExpress',
    description:
      'Hungary study cost breakdown for Bangladeshi students: Stipendium Hungaricum vs self-funded tuition, living budgets in Budapest, and NDGAP visa solvency.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('hungary', 'Cost of Studying in Hungary from Bangladesh — EduExpress International'),
  });
}

const HUNGARY_COST_FAQS = [
  {
    question: 'How much does it cost to study in Hungary under the Stipendium Hungaricum scholarship?',
    answer:
      'If awarded the Stipendium Hungaricum scholarship (bilateral quota between Hungary and Bangladesh), the cost of studying is essentially zero for academic fees. The scholarship provides 100% tuition fee exemption, guaranteed free dormitory accommodation (or a HUF 40,000/month housing allowance ~13,200 BDT), comprehensive medical insurance, and a monthly living stipend of HUF 43,700/month (~14,400 BDT) for Bachelor’s/Master’s and HUF 140,000 to 180,000/month (~46,200–59,400 BDT) for PhD scholars. Self-funded personal expenses are limited to initial visa travel, flight tickets, and personal pocket expenses.',
  },
  {
    question: 'What is the annual tuition fee for self-funded Bangladeshi students in Hungary?',
    answer:
      'For self-funded students, Hungarian public universities (such as University of Debrecen, University of Szeged, University of Pécs, BME, and Corvinus) offer tuition rates substantially below Western European levels. Annual tuition for Engineering, Computer Science, and Information Technology ranges from EUR 3,200 to EUR 6,500 (~416,000 to 845,000 BDT). Business, Economics, and Social Sciences range from EUR 2,800 to EUR 5,000 (~364,000 to 650,000 BDT). General Medicine (MD) and Dentistry (DMD) programs cost EUR 14,000 to EUR 17,500/year (~1,820,000 to 2,275,000 BDT).',
  },
  {
    question: 'What bank balance and solvency proof does NDGAP require for a Hungarian student visa?',
    answer:
      'The National Directorate-General for Aliens Policing (NDGAP) and the Embassy of Hungary require self-funded applicants to demonstrate sufficient financial solvency to cover one full academic year of living costs. We recommend showing a liquid bank balance of at least EUR 6,500 to EUR 8,000 (~850,000 to 1,040,000 BDT) in a recognized Bangladeshi bank. Statements can be in the student’s name or sponsored by parents (with a signed affidavit of financial sponsorship, source of funds documentation, and recent tax returns). In addition, official proof of paid 1st-year tuition or deposit to the Hungarian university must be presented.',
  },
  {
    question: 'What is the real monthly living cost in Budapest vs regional Hungarian university cities?',
    answer:
      'Monthly living costs in Hungary depend on location. In Budapest (the capital), students spend approximately EUR 450 to EUR 700 per month (~58,500 to 91,000 BDT or HUF 180,000–280,000), with private room rentals costing EUR 250–EUR 400. In prominent regional university cities such as Debrecen, Szeged, Pécs, and Miskolc, monthly living expenses drop to EUR 350 to EUR 500 (~45,500 to 65,000 BDT or HUF 140,000–200,000), especially when staying in university dormitories costing EUR 100–EUR 180/month.',
  },
  {
    question: 'Can Bangladeshi students work part-time in Hungary to support their expenses?',
    answer:
      'Yes. International students holding a valid Hungarian Residence Permit for Study Purposes are legally authorized to work up to 24 hours per week during academic terms, and up to 66 working days (or full-time) during summer and winter breaks. Student employment in Hungary is typically organized through official student work cooperatives (Diákmunka, such as Mind-Diák and Meló-Diák), which ensures tax transparency and statutory student wages ranging from HUF 1,800 to HUF 2,600 per hour (~EUR 4.50–EUR 6.50 / ~585–845 BDT/hr). Working 20 hours per week generates EUR 360–EUR 520 monthly, which largely offsets regional living expenses.',
  },
  {
    question: 'How do students remit university tuition to Hungary from Bangladesh via Student File?',
    answer:
      'Under Bangladesh Bank foreign exchange rules, students take their unconditional admission letter and Hungarian university invoice to an Authorized Dealer (AD) commercial bank (e.g., Eastern Bank, Prime Bank, BRAC Bank, City Bank). The bank opens an official Student File and wires the tuition via SWIFT telegraphic transfer (MT103) in EUR directly to the university’s IBAN in Hungary. EduExpress assists students and parents with Student File documentation at zero consultancy charge.',
  },
];

export default async function HungaryStudyCostPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'Hungary', isActive: true },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
      scholarships: { where: { status: 'active' }, take: 2 },
    },
    orderBy: { name: 'asc' },
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Cost of Studying in Hungary from Bangladesh | Full BDT, EUR & HUF Breakdown (2027)',
        description:
          'Comprehensive tuition fee schedules, Stipendium Hungaricum vs self-funded cost comparison, NDGAP visa solvency requirements, and Bangladesh Bank Student File remittance for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/hungary.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(HUNGARY_COST_SOURCES),
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
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 EUR ≈ 130 BDT (1 HUF ≈ 0.33 BDT) · BDT 0 Upfront Fee"
        title="Cost of Studying in Hungary from Bangladesh."
        lead="A complete financial blueprint for Bangladeshi students and families: Stipendium Hungaricum bilateral scholarship funding vs self-funded tuition fees (EUR 3,000–8,000/yr), monthly living budgets in Budapest and regional cities (HUF & EUR), NDGAP embassy solvency proof, and Bangladesh Bank Student File wire transfers."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=Hungary" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check Hungary Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/hungary-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Hungary Student Visa Guide
            </Link>
            <Link href="/hungary-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Stipendium Scholarship Guide
            </Link>
            <a href="#stipendium-vs-self" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Stipendium vs Self-Funded
            </a>
          </>
        }
      />

      <TrustBar destination="Hungary" />

      {/* Currency Planning Baseline Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold text-sm">
              Ft
            </span>
            <span>
              Planning Assumption (Nov 2026): <strong>1 EUR ≈ 130 BDT</strong> &amp; <strong>100 HUF ≈ 33 BDT</strong>{' '}
              <span className="font-normal text-slate-500">
                (conservative planning rates — confirm live bank TT selling rates before remittance)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• Central European Schengen Member</span>
            <span>• Direct University &amp; Embassy Fees</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
              BDT 0 Upfront · 100% After Visa
            </span>
          </div>
        </div>
      </section>

      {/* Module 1: Pre-Departure Third-Party & Statutory Costs */}
      <Section
        id="pre-departure"
        title="Pre-Departure Third-Party &amp; Statutory Costs"
        intro="Itemized official expenses required before departing from Dhaka to Hungary. All charges are paid directly to designated statutory authorities, universities, and consular service centers."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Banknote className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">Exchange Rate Assumption</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-petrol-900">1 EUR ≈ 130 BDT</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Planning Assumption:</strong> Interbank foreign currency rates fluctuate. Conversions in this guide use 1 EUR = 130 BDT and 1 HUF = 0.33 BDT to establish a prudent financial ceiling for Bangladeshi families.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-amber-700" />
              <h3 className="text-base font-bold text-petrol-800">NDGAP Solvency Proof</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">EUR 6,500 – 8,000</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              For self-funded applicants, the National Directorate-General for Aliens Policing (NDGAP) requires proof of 1 full year’s living funds (~EUR 6,500–8,000 or 8.5L–10.4L BDT) held in liquid bank deposits.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">EduExpress Fee Guarantee</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-800">BDT 0 Upfront File Fee</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              EduExpress charges <strong>BDT 0 file-opening fees</strong> before visa issuance. Our European service fee of BDT 100,000 (1 Lakh Taka) is payable <strong>100% after your Hungarian study visa is approved</strong>.
            </p>
          </div>
        </div>

        {/* Pre-Departure Table */}
        <div className="mt-8 overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Official Fee Item</th>
                <th className="p-4">Statutory Fee (EUR / BDT)</th>
                <th className="p-4">Approx. BDT Equivalent (@ 130 BDT)</th>
                <th className="p-4">Payment Recipient &amp; Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Hungarian Type-D Residence Permit Fee</td>
                <td className="p-4 font-semibold">EUR 110</td>
                <td className="p-4">~14,300 BDT</td>
                <td className="p-4 text-slate-600">Embassy of Hungary / Consular Visa Section (Waived for Stipendium scholars)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">VFS Global Service &amp; Logistics Charge</td>
                <td className="p-4 font-semibold">EUR 30 – EUR 45</td>
                <td className="p-4">~3,900 – 5,850 BDT</td>
                <td className="p-4 text-slate-600">VFS Global Application Centre (Biometrics &amp; passport transmittal)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Academic &amp; Notary Legalization</td>
                <td className="p-4 font-semibold">3,000 – 6,000 BDT</td>
                <td className="p-4">3,000 – 6,000 BDT</td>
                <td className="p-4 text-slate-600">Education Board, MOE &amp; Ministry of Foreign Affairs (MOFA) Dhaka</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Police Clearance Certificate</td>
                <td className="p-4 font-semibold">500 BDT</td>
                <td className="p-4">500 BDT</td>
                <td className="p-4 text-slate-600">Bangladesh Police (Online verification portal)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Pre-Departure Medical Examination</td>
                <td className="p-4 font-semibold">4,000 – 7,000 BDT</td>
                <td className="p-4">4,000 – 7,000 BDT</td>
                <td className="p-4 text-slate-600">Authorized medical clinic (Hepatitis, HIV, Chest X-ray for university registration)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Travel &amp; Health Insurance (Initial 3 Months)</td>
                <td className="p-4 font-semibold">EUR 40 – EUR 70</td>
                <td className="p-4">~5,200 – 9,100 BDT</td>
                <td className="p-4 text-slate-600">International travel insurer (Valid until Hungarian national student health coverage is issued)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka to Budapest BUD)</td>
                <td className="p-4 font-semibold">EUR 450 – EUR 750</td>
                <td className="p-4">~58,500 – 97,500 BDT</td>
                <td className="p-4 text-slate-600">Airlines (Qatar Airways, Emirates, Turkish Airlines, Gulf Air)</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">EduExpress File-Opening &amp; Pre-Visa Charge</td>
                <td className="p-4 font-bold text-emerald-900">EUR 0</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0 Upfront (BDT 100,000 After Visa)</td>
                <td className="p-4 text-xs text-emerald-800">100% payable only after Hungary study visa approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Stipendium Hungaricum vs Self-Funded Cost Comparison */}
      <Section
        id="stipendium-vs-self"
        tone="sage"
        title="Stipendium Hungaricum vs Self-Funded: The Complete Financial Contrast"
        intro="Hungary offers two primary admission channels for Bangladeshi students: the prestigious bilateral government scholarship (Stipendium Hungaricum) and direct self-funded university enrollment."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pathway A: Stipendium Hungaricum */}
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-emerald-700" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Stipendium Hungaricum Scholarship</h3>
                <span className="text-xs font-semibold text-emerald-800">Fully Funded • Bilateral Government Quota</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Allocated under the bilateral agreement between Hungary and the Ministry of Education Bangladesh. Approximately 140+ Bangladeshi students receive this scholarship annually.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Tuition Coverage:</span>
                <strong className="text-emerald-800">100% Free Tuition for full degree</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Accommodation:</span>
                <strong>Free Dormitory OR HUF 40,000/mo allowance (~13,200 BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Monthly Living Stipend (BS/MS):</span>
                <strong>HUF 43,700 / month (~14,400 BDT / month)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Monthly Living Stipend (PhD):</span>
                <strong>HUF 140,000 (Y1-2) / HUF 180,000 (Y3-4) (~46k–59k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Health Insurance:</span>
                <strong>Full Hungarian National Health Coverage (TAJ)</strong>
              </div>
              <div className="flex justify-between">
                <span>Application Gate:</span>
                <span className="text-petrol-800 font-bold">DreamApply + MoE Bangladesh SHED Portal</span>
              </div>
            </div>
          </div>

          {/* Pathway B: Self-Funded Direct Admission */}
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Building className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Self-Funded Direct University Enrollment</h3>
                <span className="text-xs font-semibold text-slate-500">Accessible Admission • Affordable European Tuition</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Direct application to Hungarian public research universities. Offers higher acceptance rates and flexible admission intakes without government shortlisting quotas.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>STEM &amp; Business Tuition:</span>
                <strong>EUR 3,000 – EUR 6,500 / year (~3.9L – 8.45L BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Medical Programs (MD/DMD):</span>
                <strong>EUR 14,000 – EUR 17,500 / year (~18.2L – 22.7L BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Living Expenses (Regional):</span>
                <strong>EUR 350 – EUR 500 / month (~45k – 65k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Living Expenses (Budapest):</span>
                <strong>EUR 450 – EUR 700 / month (~58k – 91k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>NDGAP Solvency Requirement:</span>
                <strong className="text-amber-800">EUR 6,500 – 8,000 bank statement</strong>
              </div>
              <div className="flex justify-between">
                <span>Student File Wire:</span>
                <span className="text-petrol-800 font-bold">Legal SWIFT remittance via Bangladesh Bank AD bank</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 3: Annual Tuition Fees by Subject & Institution */}
      <Section
        id="tuition-breakdown"
        title="Annual Tuition Fees at Hungarian Public Universities"
        intro="Hungarian public universities charge standardized tuition fees published in Euros. Fees vary depending on whether the program is classroom-based or laboratory-intensive."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">Engineering &amp; Computer Science</h4>
            <span className="text-xs text-slate-500">Software, Electrical, Mechanical, Civil</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">€3,200 – €6,500 / yr</p>
            <p className="mt-1 text-xs text-slate-600">~416,000 – 845,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• BME (Budapest): €3,500–€4,500/semester</li>
              <li>• University of Debrecen: €6,000–€6,500/yr</li>
              <li>• University of Szeged: €3,500–€5,000/yr</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">Business, Finance &amp; Social Sciences</h4>
            <span className="text-xs text-slate-500">BBA, International Business, Management</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">€2,800 – €5,200 / yr</p>
            <p className="mt-1 text-xs text-slate-600">~364,000 – 676,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• Corvinus University: €3,800–€5,200/yr</li>
              <li>• University of Pécs: €3,000–€4,500/yr</li>
              <li>• University of Miskolc: €2,800–€3,800/yr</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">Medicine, Dentistry &amp; Pharmacy</h4>
            <span className="text-xs text-slate-500">General Medicine (6 Years), Dentistry (5 Years)</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">€9,500 – €17,500 / yr</p>
            <p className="mt-1 text-xs text-slate-600">~1,235,000 – 2,275,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• Semmelweis University: ~€16,500–€17,500/yr</li>
              <li>• University of Debrecen (Medicine): €16,900/yr</li>
              <li>• University of Szeged (Pharmacy): €9,500/yr</li>
            </ul>
          </div>
        </div>

        {/* Database University Sampling */}
        <div className="mt-8 rounded-3xl border border-rule bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-petrol-800">Verified Hungarian Partner Universities &amp; Tuition Rates</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
                <tr>
                  <th className="p-3">University</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">QS World Ranking Tier</th>
                  <th className="p-3">Annual Tuition (EUR)</th>
                  <th className="p-3">Annual Tuition (BDT Approx.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-slate-700">
                {universities.length > 0 ? (
                  universities.map((uni) => (
                    <tr key={uni.id}>
                      <td className="p-3 font-bold text-petrol-800">{uni.name}</td>
                      <td className="p-3">{uni.city || 'Hungary'}</td>
                      <td className="p-3 text-slate-500">Top 500–800 Global</td>
                      <td className="p-3 font-semibold">€3,500 – €7,000</td>
                      <td className="p-3 text-slate-600">~4.5L – 9.1L BDT</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">University of Debrecen</td>
                      <td className="p-3">Debrecen</td>
                      <td className="p-3 text-slate-500">QS #671-680</td>
                      <td className="p-3 font-semibold">€5,500 – €7,500</td>
                      <td className="p-3">~7.1L – 9.7L BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">University of Szeged</td>
                      <td className="p-3">Szeged</td>
                      <td className="p-3 text-slate-500">QS #570-580</td>
                      <td className="p-3 font-semibold">€3,800 – €6,000</td>
                      <td className="p-3">~4.9L – 7.8L BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">University of Pécs</td>
                      <td className="p-3">Pécs</td>
                      <td className="p-3 text-slate-500">QS #701-750</td>
                      <td className="p-3 font-semibold">€3,500 – €5,000</td>
                      <td className="p-3">~4.5L – 6.5L BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Budapest University of Technology and Economics (BME)</td>
                      <td className="p-3">Budapest</td>
                      <td className="p-3 text-slate-500">QS #741-750</td>
                      <td className="p-3 font-semibold">€6,400 – €8,000</td>
                      <td className="p-3">~8.3L – 10.4L BDT</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Module 4: Real Monthly Living Cost Breakdown in Hungary */}
      <Section
        id="living-costs"
        tone="sage"
        title="Real Monthly Living Expenses: Budapest vs Regional Cities"
        intro="Hungary offers some of the most affordable living costs in the European Union. Regional university cities feature significantly lower rent and grocery costs than Budapest."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Budapest (Capital City)</th>
                <th className="p-4">Regional Cities (Debrecen, Szeged, Pécs)</th>
                <th className="p-4">Cost in BDT (Approx.)</th>
                <th className="p-4">Optimization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Home className="size-4 text-petrol-800" />
                    <span>Accommodation (Dorm or Shared Room)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 250 – EUR 400 / mo (HUF 100k–160k)</td>
                <td className="p-4 font-semibold">EUR 120 – EUR 250 / mo (HUF 50k–100k)</td>
                <td className="p-4">~15,600 – 52,000 BDT</td>
                <td className="p-4 text-slate-500">Apply early for on-campus university dormitories (€100–180/mo)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-petrol-800" />
                    <span>Groceries &amp; Food Preparation</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 150 – EUR 220 / mo (HUF 60k–90k)</td>
                <td className="p-4 font-semibold">EUR 120 – EUR 180 / mo (HUF 50k–70k)</td>
                <td className="p-4">~15,600 – 28,600 BDT</td>
                <td className="p-4 text-slate-500">Shop at Lidl, Aldi, Penny Market, and local Hungarian markets (Piac)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Train className="size-4 text-petrol-800" />
                    <span>Public Transportation (BKK / Local)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 10 / mo (HUF 3,450 student monthly pass)</td>
                <td className="p-4 font-semibold">EUR 8 – EUR 12 / mo (HUF 3,000–4,500)</td>
                <td className="p-4">~1,040 – 1,560 BDT</td>
                <td className="p-4 text-slate-500">Subsidized national student monthly travel passes provide unlimited rides</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-petrol-800" />
                    <span>Mobile Unlimited Internet &amp; Utilities</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 25 – EUR 40 / mo (HUF 10k–16k)</td>
                <td className="p-4 font-semibold">EUR 20 – EUR 35 / mo (HUF 8k–14k)</td>
                <td className="p-4">~2,600 – 5,200 BDT</td>
                <td className="p-4 text-slate-500">Yettel, Telekom, or Vodafone student mobile SIM plans</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-petrol-800" />
                    <span>Personal Expenses &amp; Study Materials</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 50 – EUR 80 / mo (HUF 20k–32k)</td>
                <td className="p-4 font-semibold">EUR 40 – EUR 65 / mo (HUF 16k–26k)</td>
                <td className="p-4">~5,200 – 10,400 BDT</td>
                <td className="p-4 text-slate-500">University libraries, digital course materials, student discounts</td>
              </tr>
              <tr className="bg-canvas-soft font-bold">
                <td className="p-4 text-petrol-900">Total Monthly Realistic Living Budget</td>
                <td className="p-4 text-petrol-900">EUR 485 – EUR 750 / mo</td>
                <td className="p-4 text-petrol-900">EUR 308 – EUR 542 / mo</td>
                <td className="p-4 text-petrol-900">~40,040 – 97,500 BDT</td>
                <td className="p-4 font-normal text-emerald-800">One of Europe’s lowest cost-to-quality ratios</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: Bangladesh Bank Student File SWIFT Remittance */}
      <Section
        id="student-file"
        title="Bangladesh Bank Student File: Remitting Tuition to Hungary"
        intro="Step-by-step guidance for Bangladeshi families to legally remit tuition fees in Euros to Hungarian universities via authorized banking channels."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Landmark className="size-5" />
              <h4>Step 1: Authorized Dealer File Opening</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Open an official Student File at an Authorized Dealer (AD) bank (e.g., Eastern Bank, Prime Bank, BRAC Bank, City Bank). Submit your Hungarian university unconditional offer letter, official invoice with IBAN/SWIFT details, student passport copy, and academic certificates.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Receipt className="size-5" />
              <h4>Step 2: SWIFT Outward Wire Transfer</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The bank issues an official SWIFT wire transfer (MT103) in EUR directly to the Hungarian university’s bank account. This provides the mandatory proof of paid tuition certificate required by the Embassy of Hungary and NDGAP.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <CreditCard className="size-5" />
              <h4>Step 3: Student Card &amp; Living Expense Quota</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Upon visa issuance, the bank can endorse foreign exchange on an international student card or remit living maintenance funds directly to the student’s Hungarian bank account (e.g., OTP Bank, Erste Bank) in compliance with Bangladesh Bank circulars.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="size-5 text-amber-700" />
            <span>EduExpress Anti-Hundi Guarantee: Legal Bank Channels Only</span>
          </div>
          <p className="mt-1 leading-relaxed">
            EduExpress strictly prohibits and cautions against informal money transfer channels (hundi). The Hungarian immigration authority (NDGAP) and consular visa officers in New Delhi scrutinize the legitimacy of tuition payment receipts. Hungarian universities only confirm payment if funds arrive through registered international banking rails.
          </p>
        </div>
      </Section>

      {/* Module 6: Work Rights & Post-Study ROI */}
      <Section
        id="work-rights"
        tone="sage"
        title="Student Work Rights &amp; 9-Month Study-to-Work Residence Permit"
        intro="Hungary provides legal part-time employment rights for international students and a dedicated post-study transition permit to enter the European labor market."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">24 Hours / Week Part-Time Employment</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Under Hungarian law, international students holding a valid residence permit for studies can work up to <strong>24 hours per week</strong> during semesters, and full-time during vacations.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Hourly Student Wage:</span>
                <span className="text-petrol-800 font-bold">HUF 1,800 – HUF 2,600 / hour (~€4.50–€6.50)</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Income (20 hrs/week):</span>
                <span className="text-emerald-800 font-bold">HUF 144,000 – HUF 208,000 (~€360–€520 / 46k–67k BDT)</span>
              </div>
              <div className="flex justify-between">
                <span>Student Work Cooperatives:</span>
                <span className="text-petrol-800 font-bold">Meló-Diák, Mind-Diák (Tax-efficient student contracts)</span>
              </div>
              <div className="flex justify-between">
                <span>Common Student Jobs:</span>
                <span className="text-petrol-800 font-bold">Customer service, English tutoring, IT support, hospitality</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">9-Month Study-to-Work Residence Permit</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Graduates from Hungarian universities can apply for the <strong>Study-to-Work permit</strong> (Álláskeresési tartózkodási engedély), allowing 9 months of legal residence in Hungary to secure employment.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Work Transition Window:</span>
                <span className="text-petrol-800 font-bold">9 months post-graduation search visa</span>
              </div>
              <div className="flex justify-between">
                <span>Schengen Mobility:</span>
                <span className="text-petrol-800 font-bold">Visa-free travel across 29 European Schengen states</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion to Work Permit:</span>
                <span className="text-emerald-800 font-bold">Converts to Hungarian Work Permit or EU Blue Card</span>
              </div>
              <div className="flex justify-between">
                <span>Average Graduate Starting Salary:</span>
                <span className="text-emerald-800 font-bold">HUF 450,000 – HUF 750,000 / mo (~€1,150–€1,900)</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 7: FAQs */}
      <Section
        id="faqs"
        title="Frequently Asked Questions: Cost of Studying in Hungary"
        intro="Clear, verified answers to the most common financial, scholarship, and visa solvency questions from Bangladeshi parents and students."
      >
        <FaqBlock items={HUNGARY_COST_FAQS} />

        {/* Cross-linking to Hub & Related Destinations */}
        <div className="mt-12 rounded-3xl border border-rule bg-canvas-soft p-6">
          <h3 className="text-base font-bold text-petrol-800">Related Destination Hubs &amp; Cost Guides</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/study-in-hungary-from-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Hungary Flagship Country Hub <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/finland-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Finland Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/uk-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              UK Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/malaysia-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Malaysia Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/compare-costs" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Global Cost Comparison Matrix <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Module 8: Official Sources & Review Desk */}
      <Section id="sources" tone="sage" title="Official sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {HUNGARY_COST_SOURCES.map((src) => (
            <a
              key={src.href}
              href={src.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-white p-4 transition hover:border-petrol-800/40 hover:shadow-xs"
            >
              <div>
                <span className="flex items-center justify-between text-[14.5px] font-bold text-petrol-800">
                  {src.label} <ExternalLink size={14} className="text-slate-500" />
                </span>
                <p className="mt-1 text-[13px] leading-5 text-slate-600">{src.note}</p>
              </div>
              <span className="mt-3 text-[12px] font-semibold text-emerald-700">Inspect official guidance →</span>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-white p-4 text-[13px] text-slate-600">
          <p>
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against Tempus Public Foundation regulations, NDGAP immigration guidelines, and Bangladesh Bank foreign exchange circulars. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* Module 9: CTA & Education Fit Assessment */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Budget Estimation</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Personalized Hungarian Cost &amp; Scholarship Assessment</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your target subject, university preference, and budget. Our counselors calculate your exact tuition breakdown, assist with Stipendium Hungaricum nomination strategy, and guide your Student File wire transfers with BDT 0 upfront file-opening fees.
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

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
const PATH = '/finland-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const FINLAND_COST_SOURCES = [
  {
    label: 'Finnish Immigration Service (Migri) — Residence Permit for Studies Financial Requirements',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Statutory Migri maintenance rate: minimum EUR 800/month (EUR 9,600 for 12 months) held in liquid cash in student’s own bank account. Citing obsolete EUR 560/mo rates triggers visa refusal.',
  },
  {
    label: 'Studyinfo.fi (Opintopolku) — Official Higher Education Application & Tuition Regulations',
    href: 'https://opintopolku.fi/konfo/en/',
    note: 'Centralized government portal for Bachelor & Master programs, statutory tuition fee scales (€6,000–€18,000/yr), and 20%–100% university scholarship waivers.',
  },
  {
    label: 'Finnish National Agency for Education (EDUFI) — Finland Scholarship Scheme',
    href: 'https://www.studyinfinland.fi/scholarships',
    note: 'National Finland Scholarship covers 100% of first-year tuition plus a EUR 5,000 relocation allowance for admitted Master’s students.',
  },
  {
    label: 'Finnish Tax Administration (Vero Skatt) & Ministry of Economic Affairs and Employment',
    href: 'https://www.vero.fi/en/individuals/tax-cards-and-tax-returns/arriving_in_finland/work_in_finland/students/',
    note: 'Statutory 30 hours per week student work allowance, tax exemption threshold on student income, and 2-year post-study job seeker residence permit regulations.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Operations Department (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening Student Files, SWIFT tuition wire transfers to Finnish universities, and EUR 9,600 living fund remittance compliance.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Finland from Bangladesh 2027 | EduExpress',
    description:
      'Finland study cost breakdown for Bangladeshi students: Migri €9,600/yr living funds, UAS & university tuition, health insurance, and 30 hrs/wk work income.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('finland', 'Cost of Studying in Finland from Bangladesh — EduExpress International'),
  });
}

const FINLAND_COST_FAQS = [
  {
    question: 'What is the exact Migri living cost requirement for a Finnish residence permit in 2027?',
    answer:
      'The Finnish Immigration Service (Migri) mandates a statutory minimum of EUR 800 per month, which equals EUR 9,600 per year (approximately 1,248,000 BDT at 1 EUR ≈ 130 BDT). This money must be deposited in the student’s own personal bank account in liquid cash. Bank statements must be in the student’s name, dated within recent weeks of application. Statements under parents’ names without legal ownership transfer, or accounts containing borrowed shares/bonds, are rejected. Any agency claiming EUR 560/month is citing regulations abolished in 2024 and puts your visa at immediate risk.',
  },
  {
    question: 'How much is tuition at Finnish Universities of Applied Sciences (UAS) vs Research Universities?',
    answer:
      'For non-EU/EEA international students, tuition at Universities of Applied Sciences (Ammattikorkeakoulu — UAS, such as Metropolia, Haaga-Helia, and LAB) ranges from EUR 8,000 to EUR 11,500 per year (~1,040,000 to 1,495,000 BDT). Traditional Academic Research Universities (Yliopisto, such as University of Helsinki, Aalto, and Tampere University) charge between EUR 12,000 and EUR 18,000 per year (~1,560,000 to 2,340,000 BDT). Most universities offer early-bird tuition discounts (10%–20%) and performance-based scholarship waivers (50%–100%) for completing 55–60 ECTS credits annually.',
  },
  {
    question: 'How do Bangladeshi students open a Bangladesh Bank Student File for Finland?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, you take your formal unconditional offer letter and Finnish university invoice (or proof of tuition waiver) to an Authorized Dealer (AD) bank (e.g., Prime Bank, Eastern Bank, BRAC Bank, City Bank). The bank opens an official Student File, enabling direct SWIFT telegraphic transfers (EUR) for your first-year tuition. Once your residence permit is granted, the bank legally remits your living expenses up to the Migri statutory limit directly to your Finnish bank account (or pre-paid student card). EduExpress assists with Student File file compilation at BDT 0 consultancy cost.',
  },
  {
    question: 'Can Bangladeshi students realistically cover their living costs by working part-time in Finland?',
    answer:
      'Yes. Finland grants international students the right to work an average of up to 30 hours per week during term time, and unlimited hours during summer and Christmas holidays. Student wages range from EUR 11.00 to EUR 16.00 per hour across Helsinki, Tampere, and regional cities (cleaning, delivery, retail, restaurant, and software internships). Working 20–25 hours per week yields EUR 900–EUR 1,400 monthly gross income, comfortably covering student apartment rent (€280–€550/mo) and grocery expenses (€200–€300/mo). However, Migri requires the EUR 9,600 living fund upfront in your bank account prior to visa issuance.',
  },
  {
    question: 'What health insurance is required by Migri for Bangladeshi students?',
    answer:
      'Because Bangladeshi students are from outside the EU/EEA, Finnish law requires private health insurance before Migri grants a residence permit. If your studies last at least two years, your insurance deductible must not exceed EUR 300, and it must cover medical expenses up to EUR 40,000. For courses under two years, coverage must reach EUR 120,000. Recognized providers include Swisscare, SIP (Marsh), and AON Student Insurance. Annual premiums typically cost EUR 200–EUR 350 (~26,000–45,500 BDT).',
  },
  {
    question: 'What is the post-study work visa duration for Bangladeshi graduates in Finland?',
    answer:
      'Upon graduation from a Finnish UAS or Research University, you are entitled to a post-study residence permit for seeking work or starting a business (Job Seeker Permit) for up to 2 years. This permit can be taken in up to three parts within 5 years of graduation. Furthermore, time spent studying on a continuous residence permit (Type A) counts towards the continuous residence requirement for Finnish permanent residency (PR) and eventual citizenship.',
  },
];

export default async function FinlandStudyCostPage() {
  const universities = await prisma.university.findMany({
    where: { country: 'Finland', isActive: true },
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
        name: 'Cost of Studying in Finland from Bangladesh | Full BDT & EUR Breakdown (2027)',
        description:
          'Comprehensive tuition fee schedules, statutory Migri EUR 9,600 living fund proof, health insurance, and Bangladesh Bank Student File remittance for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/finland.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(FINLAND_COST_SOURCES),
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
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 EUR ≈ 130 BDT · BDT 0 Upfront File-Opening Fee"
        title="Cost of Studying in Finland from Bangladesh."
        lead="A complete, verified financial breakdown for Bangladeshi students and families: Migri EUR 9,600/year living maintenance rules, University vs UAS tuition scales, health insurance costs, Bangladesh Bank Student File procedures, and 30 hrs/week part-time work earnings."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=Finland" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Finland Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/finland-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Finland Residence Permit Guide
            </Link>
            <Link href="/finland-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Finland Scholarships Guide
            </Link>
            <a href="#migri-proof" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Migri EUR 9,600 Fund Rule
            </a>
          </>
        }
      />

      <TrustBar destination="Finland" />

      {/* Currency Planning Baseline Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold text-sm">
              €
            </span>
            <span>
              Planning Assumption (Nov 2026): <strong>1 EUR ≈ 130 BDT</strong>{' '}
              <span className="font-normal text-slate-500">
                (illustrative planning reference — confirm live Authorized Dealer bank TT selling rates before remittance)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• No Hidden Surcharges</span>
            <span>• Direct University &amp; Migri Payments</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
              BDT 0 Upfront · 100% After Visa
            </span>
          </div>
        </div>
      </section>

      {/* Module 1: Planning Assumption & Pre-Departure Statutory Costs */}
      <Section
        id="pre-departure"
        title="Pre-Departure Third-Party &amp; Statutory Costs"
        intro="Budgeting for higher education in Finland requires transparent accounting of embassy fees, biometric enrollment, international student health insurance, and living deposits before departure."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Banknote className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">Foreign Exchange Assumption</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-petrol-900">1 EUR ≈ 130 BDT</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Planning Assumption:</strong> Interbank foreign currency rates fluctuate. All conversions in this guide use a conservative planning rate of 1 EUR = 130 BDT to protect family finances from volatility during Student File SWIFT transfers.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-amber-700" />
              <h3 className="text-base font-bold text-petrol-800">Migri Statutory Minimum</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">EUR 800 / Month</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The Finnish Immigration Service (Migri) officially requires a minimum of <strong>EUR 800 per month (EUR 9,600 per year ≈ 1,248,000 BDT)</strong> in liquid funds. Statements citing older €560/month standards are obsolete and lead to automatic visa refusal.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">EduExpress Fee Guarantee</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-800">BDT 0 Upfront File Fee</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              EduExpress charges <strong>BDT 0 file-opening fees</strong> before visa issuance. Our European service fee of BDT 100,000 (1 Lakh Taka) is payable <strong>100% after your Finnish student residence permit is approved</strong>.
            </p>
          </div>
        </div>

        {/* Pre-Departure Table */}
        <div className="mt-8 overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Item</th>
                <th className="p-4">Recipient Authority</th>
                <th className="p-4">Cost (EUR)</th>
                <th className="p-4">Cost (BDT Approx.)</th>
                <th className="p-4">Mandatory Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Migri Electronic Application Fee</td>
                <td className="p-4">Finnish Immigration Service (Enter Finland)</td>
                <td className="p-4 font-semibold">EUR 370</td>
                <td className="p-4">~48,100 BDT</td>
                <td className="p-4 text-xs text-slate-500">Upon online submission</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">VFS Global Biometric Service Fee</td>
                <td className="p-4">VFS Global Application Centre</td>
                <td className="p-4 font-semibold">EUR 45–75</td>
                <td className="p-4">~6,000–9,750 BDT</td>
                <td className="p-4 text-xs text-slate-500">At biometric appointment</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Private Health Insurance (1 Year)</td>
                <td className="p-4">Swisscare / SIP / AON Student</td>
                <td className="p-4 font-semibold">EUR 200–350</td>
                <td className="p-4">~26,000–45,500 BDT</td>
                <td className="p-4 text-xs text-slate-500">Prior to Enter Finland submission</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Police Clearance Certificate</td>
                <td className="p-4">Bangladesh Police (DMP / Online)</td>
                <td className="p-4 font-semibold">—</td>
                <td className="p-4">500 BDT</td>
                <td className="p-4 text-xs text-slate-500">During document verification</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-way Airfare (DAC to HEL)</td>
                <td className="p-4">Commercial Airline (Qatar / Emirates / Turkish)</td>
                <td className="p-4 font-semibold">EUR 500–750</td>
                <td className="p-4">~65,000–97,500 BDT</td>
                <td className="p-4 text-xs text-slate-500">After residence permit card approval</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">EduExpress File-Opening &amp; Pre-Visa Charge</td>
                <td className="p-4 text-emerald-900">EduExpress International</td>
                <td className="p-4 font-bold text-emerald-900">EUR 0</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0 Upfront (BDT 100,000 After Visa)</td>
                <td className="p-4 text-xs text-emerald-800">100% payable only after residence permit approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Migri Proof of Funds (EUR 9,600 Rule) */}
      <Section
        id="migri-proof"
        tone="sage"
        title="Official Migri Financial Proof: The EUR 9,600 Solvency Standard"
        intro="The Finnish Immigration Service (Migri) enforces strict, non-negotiable proof of liquid funds. Understanding account ownership and holding periods is essential to avoid visa rejection."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-petrol-800">Statutory Migri Bank Account Rules</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-800" />
                <span>
                  <strong>Student’s Own Name:</strong> Funds must be deposited in a bank account held in the applicant’s individual name. Joint accounts with parents or sponsors are acceptable only if the student has independent withdrawal authority.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-800" />
                <span>
                  <strong>EUR 800 Monthly Minimum:</strong> For a 1-year residence permit, you must show at least <strong>EUR 9,600 (~1,248,000 BDT)</strong>. For a 2-year permit, you must prove EUR 19,200 (or prove sustainable income/sponsorship for year 2).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-800" />
                <span>
                  <strong>Liquid Cash Only:</strong> Migri accepts only bank account balance certificates and statements showing cash funds. Fixed deposit receipts (FDR) are accepted only if they can be liquidated instantly. Shares, real estate, gold, and mutual funds are not accepted.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-800" />
                <span>
                  <strong>Currency Flexibility:</strong> The account can be held in BDT in a recognized Bangladeshi bank (with an international bank solvency certificate showing the EUR equivalent) or in a foreign currency account (EUR/USD).
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-rose-800">Common Financial Mistakes Leading to Migri Rejection</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-5 shrink-0 text-rose-600" />
                <span>
                  <strong>Submitting Parents' Bank Statements Only:</strong> In Finland, an applicant is legally an independent adult. A bank statement in the father's or mother's name without transferring the funds into the student's name triggers a clarification request (supplementary inquiry) or visa refusal.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-5 shrink-0 text-rose-600" />
                <span>
                  <strong>Unexplained Large Sudden Deposits:</strong> Large sums deposited 2 days prior to issuing the bank statement without a legitimate paper trail (tax return, property sale, or documented family gift deed) can be viewed as temporary "show money".
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-5 shrink-0 text-rose-600" />
                <span>
                  <strong>Citing Obsolete EUR 560/mo Rate:</strong> Online forums and unethical agents often cite the abolished lower monthly rate. Applying with anything less than EUR 9,600 results in immediate statutory denial.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-5 shrink-0 text-rose-600" />
                <span>
                  <strong>Unpaid Tuition Proof:</strong> If you do not have a 100% scholarship waiver, you must attach the official receipt from your Finnish university confirming that the first-year tuition is paid in full.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 3: Annual Tuition Fees by University Tier */}
      <Section
        id="tuition-tiers"
        title="Annual Tuition Fees: Universities of Applied Sciences vs Research Universities"
        intro="Finland’s higher education system offers two distinct institutional tracks with different fee structures, degree lengths, and scholarship waiver opportunities."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Track 1: Universities of Applied Sciences */}
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Building className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Universities of Applied Sciences (UAS / AMK)</h3>
                <span className="text-xs font-semibold text-slate-500">Career-Focused • Practical • Mandatory Internships</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              UAS institutions (e.g., Metropolia, Haaga-Helia, LAB, Laurea, OAMK) focus on applied sciences, IT, engineering, nursing, and international business. Bachelor’s degrees take 3.5 to 4 years (210–240 ECTS).
            </p>
            <div className="mt-4 space-y-3 rounded-xl border border-rule bg-white p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Annual Tuition Range:</span>
                <strong className="text-petrol-800">EUR 8,000 – EUR 11,500 / year</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Equivalent in BDT:</span>
                <strong>~1,040,000 – 1,495,000 BDT / year</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Early Bird Discount:</span>
                <span className="text-emerald-800 font-bold">10% – 20% off Year 1 tuition</span>
              </div>
              <div className="flex justify-between">
                <span>Scholarship Waiver (Year 2+):</span>
                <span className="text-emerald-800 font-bold">20% – 50% waiver (55 ECTS completed)</span>
              </div>
            </div>
          </div>

          {/* Track 2: Academic Research Universities */}
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Academic Research Universities (Yliopisto)</h3>
                <span className="text-xs font-semibold text-slate-500">Theory • Research • Direct PhD Pathway</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Research universities (e.g., University of Helsinki, Aalto University, Tampere University, University of Turku) offer high-tier research, engineering, and data science degrees. Master’s programs take 2 years (120 ECTS).
            </p>
            <div className="mt-4 space-y-3 rounded-xl border border-rule bg-white p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Annual Tuition Range:</span>
                <strong className="text-petrol-800">EUR 12,000 – EUR 18,000 / year</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Equivalent in BDT:</span>
                <strong>~1,560,000 – 2,340,000 BDT / year</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Finland Scholarship:</span>
                <span className="text-emerald-800 font-bold">100% waiver + EUR 5,000 relocation stipend</span>
              </div>
              <div className="flex justify-between">
                <span>PhD Programs:</span>
                <span className="text-emerald-800 font-bold">100% Tuition-Free for all nationalities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real University Program Fees from Database */}
        <div className="mt-8 rounded-3xl border border-rule bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-petrol-800">Sample Finnish University Tuition Fees &amp; Program Options</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
                <tr>
                  <th className="p-3">Institution</th>
                  <th className="p-3">City / Campus</th>
                  <th className="p-3">Institution Type</th>
                  <th className="p-3">Annual Tuition (EUR)</th>
                  <th className="p-3">Annual Tuition (BDT Approx.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-slate-700">
                {universities.length > 0 ? (
                  universities.map((uni) => (
                    <tr key={uni.id}>
                      <td className="p-3 font-bold text-petrol-800">{uni.name}</td>
                      <td className="p-3">{uni.city || 'Finland'}</td>
                      <td className="p-3 text-slate-500">{uni.slug.includes('uas') ? 'UAS (AMK)' : 'University'}</td>
                      <td className="p-3 font-semibold">€8,500 – €13,000</td>
                      <td className="p-3 text-slate-600">~11.0 – 16.9 Lakh BDT</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Metropolia University of Applied Sciences</td>
                      <td className="p-3">Helsinki (Capital Region)</td>
                      <td className="p-3 text-slate-500">UAS (AMK)</td>
                      <td className="p-3 font-semibold">€10,000 – €12,000</td>
                      <td className="p-3">~13.0 – 15.6 Lakh BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Haaga-Helia University of Applied Sciences</td>
                      <td className="p-3">Helsinki / Porvoo</td>
                      <td className="p-3 text-slate-500">UAS (AMK)</td>
                      <td className="p-3 font-semibold">€8,500 – €9,500</td>
                      <td className="p-3">~11.0 – 12.3 Lakh BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Aalto University</td>
                      <td className="p-3">Espoo</td>
                      <td className="p-3 text-slate-500">Research University</td>
                      <td className="p-3 font-semibold">€12,000 – €15,000</td>
                      <td className="p-3">~15.6 – 19.5 Lakh BDT</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Tampere University</td>
                      <td className="p-3">Tampere</td>
                      <td className="p-3 text-slate-500">Research University</td>
                      <td className="p-3 font-semibold">€10,000 – €12,000</td>
                      <td className="p-3">~13.0 – 15.6 Lakh BDT</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Module 4: Real Monthly Living Cost Breakdown in Finland */}
      <Section
        id="living-costs"
        tone="sage"
        title="Real Monthly Living Expenses: Helsinki vs Regional Cities"
        intro="Finland’s student housing foundations (HOAS in Helsinki, TOAS in Tampere, PSOAS in Oulu) provide heavily subsidized apartments with heating, water, electricity, and internet included."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Helsinki Metropolitan Area (HOAS)</th>
                <th className="p-4">Regional Cities (Tampere, Oulu, Vaasa, Turku)</th>
                <th className="p-4">Cost in BDT (Approx.)</th>
                <th className="p-4">Optimization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Home className="size-4 text-petrol-800" />
                    <span>Student Housing (Furnished Room)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 380 – EUR 550 / mo</td>
                <td className="p-4 font-semibold">EUR 280 – EUR 420 / mo</td>
                <td className="p-4">~36,400 – 71,500 BDT</td>
                <td className="p-4 text-slate-500">Apply to HOAS / TOAS immediately upon admission offer</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-petrol-800" />
                    <span>Groceries &amp; Cooking</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 180 – EUR 250 / mo</td>
                <td className="p-4 font-semibold">EUR 150 – EUR 220 / mo</td>
                <td className="p-4">~19,500 – 32,500 BDT</td>
                <td className="p-4 text-slate-500">Lidl, Prisma, Asian specialty markets in Hakaniemi</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Train className="size-4 text-petrol-800" />
                    <span>Public Transportation (HSL / Nysse)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 36 – EUR 45 / mo</td>
                <td className="p-4 font-semibold">EUR 28 – EUR 38 / mo</td>
                <td className="p-4">~3,640 – 5,850 BDT</td>
                <td className="p-4 text-slate-500">45% student discount via Frank App / Student Card</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-petrol-800" />
                    <span>Mobile Unlimited 4G/5G &amp; Sim</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 20 – EUR 25 / mo</td>
                <td className="p-4 font-semibold">EUR 20 – EUR 25 / mo</td>
                <td className="p-4">~2,600 – 3,250 BDT</td>
                <td className="p-4 text-slate-500">DNA, Elisa, or Telia unlimited student packages</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-petrol-800" />
                    <span>Subsidized University Lunches (Kela)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">EUR 60 – EUR 80 / mo</td>
                <td className="p-4 font-semibold">EUR 60 – EUR 80 / mo</td>
                <td className="p-4">~7,800 – 10,400 BDT</td>
                <td className="p-4 text-slate-500">Government subsidizes warm meals to €2.95 per meal</td>
              </tr>
              <tr className="bg-canvas-soft font-bold">
                <td className="p-4 text-petrol-900">Total Monthly Realistic Living Budget</td>
                <td className="p-4 text-petrol-900">EUR 676 – EUR 950 / mo</td>
                <td className="p-4 text-petrol-900">EUR 538 – EUR 783 / mo</td>
                <td className="p-4 text-petrol-900">~69,940 – 123,500 BDT</td>
                <td className="p-4 font-normal text-emerald-800">Comfortably fits within Migri €800 requirement</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: Bangladesh Bank Student File SWIFT Remittance */}
      <Section
        id="student-file"
        title="Bangladesh Bank Student File: Remitting Funds to Finland Legally"
        intro="How to wire tuition fees to your Finnish university and transfer your EUR 9,600 living maintenance fund legally under Bangladesh Bank Foreign Exchange Guidelines."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Landmark className="size-5" />
              <h4>Step 1: Authorized Dealer Selection</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Open a dedicated Student File at an Authorized Dealer (AD) bank (such as Eastern Bank, Prime Bank, BRAC Bank, or City Bank). Submit your university unconditional admission letter, invoice with official Finnish IBAN/SWIFT code, academic transcripts, and passport copy.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Receipt className="size-5" />
              <h4>Step 2: SWIFT Tuition Wire Transfer</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The bank issues an official Foreign Exchange SWIFT remittance (MT103) in EUR directly to the Finnish university's bank account. This eliminates credit card transaction limits and provides the mandatory proof of paid tuition required by Migri.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <CreditCard className="size-5" />
              <h4>Step 3: Living Cost Remittance &amp; Card</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Once your Residence Permit card is issued, the AD bank can wire your living maintenance funds (up to the Migri quota of EUR 9,600/year) or issue an international student travel quota card endorsed on your passport for initial arrival expenses in Helsinki.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="size-5 text-amber-700" />
            <span>EduExpress Anti-Hundi Notice: 100% Documented Bank Transfers Only</span>
          </div>
          <p className="mt-1 leading-relaxed">
            EduExpress strictly mandates banking compliance. Under no circumstances should students use unauthorized money transfer agents or informal channels (hundi). Migri and Finnish commercial banks (Nordea, OP, Danske Bank) enforce strict anti-money laundering (AML) audits and demand official Bangladesh Bank SWIFT source documentation before unlocking Finnish bank accounts.
          </p>
        </div>
      </Section>

      {/* Module 6: Work Rights & Post-Study ROI */}
      <Section
        id="work-rights"
        tone="sage"
        title="Student Work Rights &amp; Post-Graduation Return on Investment (ROI)"
        intro="Finland offers one of Europe’s most generous student employment policies, allowing Bangladeshi students to support themselves while building a pathway to European residency."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">30 Hours / Week Part-Time Employment</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              In 2022, the Finnish Parliament increased student work rights from 25 to <strong>30 hours per week</strong> during semester periods, with <strong>unlimited hours</strong> during official university breaks.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Standard Hourly Wages:</span>
                <span className="text-petrol-800 font-bold">EUR 11.50 – EUR 16.50 / hour</span>
              </div>
              <div className="flex justify-between">
                <span>Evening &amp; Weekend Shift Premium:</span>
                <span className="text-petrol-800 font-bold">+20% to +100% (Sunday double pay)</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Gross (20 hrs/week):</span>
                <span className="text-emerald-800 font-bold">EUR 920 – EUR 1,320 (~120k–170k BDT)</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Gross (30 hrs/week):</span>
                <span className="text-emerald-800 font-bold">EUR 1,380 – EUR 1,980 (~180k–257k BDT)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">2-Year Post-Study Job Seeker Residence Permit</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Graduates from Finnish universities are granted a <strong>2-year job seeker residence permit</strong>. You do not need an immediate job offer upon graduation to remain in Finland.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Permit Flexibility:</span>
                <span className="text-petrol-800 font-bold">Can be split into 3 parts over 5 years</span>
              </div>
              <div className="flex justify-between">
                <span>Pathway to Permanent Residency (PR):</span>
                <span className="text-petrol-800 font-bold">4 years on Continuous (Type A) status</span>
              </div>
              <div className="flex justify-between">
                <span>Average Graduate Starting Salary:</span>
                <span className="text-emerald-800 font-bold">EUR 3,200 – EUR 4,500 / month</span>
              </div>
              <div className="flex justify-between">
                <span>High-Demand Sectors:</span>
                <span className="text-petrol-800 font-bold">ICT, Software, CleanTech, Nursing, Business</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 7: FAQs */}
      <Section
        id="faqs"
        title="Frequently Asked Questions: Cost of Studying in Finland"
        intro="Clear answers to the most common financial, visa solvency, and student employment questions from Bangladeshi parents and applicants."
      >
        <FaqBlock items={FINLAND_COST_FAQS} />

        {/* Cross-linking to Hub & Related Destinations */}
        <div className="mt-12 rounded-3xl border border-rule bg-canvas-soft p-6">
          <h3 className="text-base font-bold text-petrol-800">Related Destination Hubs &amp; Cost Guides</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/study-in-finland-from-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Finland Flagship Country Hub <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/uk-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              UK Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/malaysia-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Malaysia Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/study-in-hungary-from-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Study in Hungary Hub <ArrowRight size={14} aria-hidden="true" />
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
          {FINLAND_COST_SOURCES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against Finnish Immigration Service (Migri) financial requirements, Studyinfo.fi joint application regulations, and Bangladesh Bank foreign exchange rules. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* Module 9: CTA & Education Fit Assessment */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Budget Estimation</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Personalized Finnish Cost &amp; Scholarship Assessment</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your target degree (Bachelor’s or Master’s) and academic scores. Our counselors audit your eligibility for Finnish university tuition waivers, calculate your exact Migri bank deposit, and guide your Joint Application with BDT 0 upfront file-opening fees.
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

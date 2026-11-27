import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Briefcase,
  Building,
  Building2,
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
const PATH = '/malta-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const MALTA_COST_SOURCES = [
  {
    label: 'Identità Malta (Central Visa Unit — Non-EU Student Residence Regulations)',
    href: 'https://identita.gov.mt/expatriates-unit-student-visa-guidelines/',
    note: 'Statutory government agency governing National Type-D Student Visas, subsistence solvency benchmarks (€750–€800/mo), and e-Residence card issuance.',
  },
  {
    label: 'Malta Further & Higher Education Authority (MFHEA)',
    href: 'https://mfhea.mt/',
    note: 'National regulatory accreditation authority classifying accredited programs on the Malta Qualifications Framework (MQF Levels 5–8) and European Qualifications Framework (EQF).',
  },
  {
    label: 'Jobsplus (Malta National Employment Agency — Student Work Licences)',
    href: 'https://jobsplus.gov.mt/',
    note: 'Statutory employment authority issuing student work licences (up to 20 hours/week) under Legal Notice 229/2018 after the mandatory first 90 days of study.',
  },
  {
    label: 'Department of Industrial and Employment Relations (DIER) — National Minimum Wage',
    href: 'https://dier.gov.mt/',
    note: 'Statutory national wage benchmarks and employment conditions governing student employment in the Republic of Malta.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for outward telegraphic student file tuition wires in EUR and foreign exchange maintenance cards for Malta.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Malta from Bangladesh 2027 | EduExpress',
    description:
      'Malta study cost breakdown for Bangladeshi students: university tuition (€6,000–€14,000/yr), Identità bank solvency, living expenses, and Jobsplus work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malta', 'Cost of Studying in Malta from Bangladesh — EduExpress International'),
  });
}

const MALTA_COST_FAQS = [
  {
    question: 'What is the total estimated first-year cost to study in Malta from Bangladesh?',
    answer:
      'A realistic first-year total budget for a self-funded Bangladeshi student in Malta ranges from EUR 14,000 to EUR 22,000 (approximately 18.5 to 29.0 Lakh BDT at the Planning Assumption rate of 1 EUR ≈ 132 BDT). This incorporates first-year tuition (EUR 6,000–12,000 depending on university and degree), one year of living expenses (EUR 6,500–9,000 covering shared housing, food, and utilities), pre-departure expenses (visa fee €100, VFS logistics, medical check, airfare ~1.2 to 1.8 Lakh BDT), and initial Schengen student health insurance. Under EduExpress’s transparent European policy, you pay BDT 0 upfront file opening fees and only BDT 100,000 as our service fee after visa approval.',
  },
  {
    question: 'What is the Identità bank solvency requirement for a Malta student visa from Bangladesh?',
    answer:
      'Identità Malta (Central Visa Unit) mandates that non-EU/EEA applicants demonstrate sufficient financial means for subsistence throughout their study duration. The statutory standard is calculated at approximately 75% of Malta’s national minimum wage for each month of stay—translating to roughly EUR 650 to EUR 750 per month, or EUR 7,800 to EUR 9,000 for a 12-month academic year. To ensure strong visa credibility, EduExpress recommends presenting an official bank certificate and 6-month statement reflecting at least EUR 9,000 to EUR 10,000 (~11.8 to 13.2 Lakh BDT) in liquid funds. Funds can be in the student’s or sponsoring parents’ account, backed by a notarized sponsorship affidavit, proof of source of funds, and official income tax returns.',
  },
  {
    question: 'What is the mandatory 90-day work restriction for international students in Malta?',
    answer:
      'Under Maltese immigration law (Legal Notice 229/2018), non-EU students holding a Type-D student visa are legally restricted from working during their first 90 calendar days in Malta. You must complete 90 consecutive days of physical residence and full-time class attendance before becoming eligible to apply for an employment licence. Once eligible, your employer and you submit a joint application to Jobsplus (the national employment agency) for a student work licence (statutory fee €150). Students must therefore arrive with sufficient upfront funds to fully self-finance their first 3 to 4 months of housing and living expenses without relying on immediate employment.',
  },
  {
    question: 'How much are tuition fees at the University of Malta vs MCAST vs private institutes?',
    answer:
      'Tuition in Malta varies significantly by institutional category. At the public research flagship, the University of Malta (Msida), non-EU undergraduate tuition ranges from EUR 8,500 to EUR 10,800 per year (~11.2L–14.2L BDT) for Arts, Business, and Humanities, rising to EUR 10,000–14,000/year for STEM, Engineering, and Computing. At MCAST (Malta College of Arts, Science and Technology), vocational Higher National Diplomas (MQF Level 5) cost EUR 3,500 to EUR 6,000 per year (~4.6L–7.9L BDT), while applied Bachelor’s degrees cost EUR 8,500–10,000/year. MFHEA-accredited private higher education institutes (such as GBS Malta, Ascencia Malta, and LSC Malta) typically charge EUR 6,000 to EUR 8,500 per year (~7.9L–11.2L BDT) for Bachelor’s and Master’s (MBA / MSc) programs.',
  },
  {
    question: 'Can Bangladeshi students realistically cover their monthly living costs with part-time work in Malta?',
    answer:
      'Yes, once the mandatory 90-day waiting period has elapsed. Non-EU degree students holding an approved Jobsplus employment licence are permitted to work up to 20 hours per week during semester terms and up to 40 hours per week during scheduled institutional vacation periods. Average wages in Malta’s bustling tourism, hospitality, retail, and customer support sectors range from EUR 6.50 to EUR 9.00 per hour. Working 20 hours per week at an average rate of EUR 7.50/hour yields approximately EUR 600 gross per month (~79,200 BDT). Because basic student living costs in shared accommodation average EUR 550 to EUR 750 per month, part-time work can cover 80% to 100% of day-to-day maintenance expenses after month three.',
  },
  {
    question: 'How do students remit university tuition to Malta from Bangladesh via Student File?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, tuition fees to Maltese universities must be remitted through an authorized Student File opened at a licensed commercial bank (e.g., Eastern Bank, Prime Bank, BRAC Bank, City Bank). Students submit their formal unconditional Letter of Acceptance (LoA), the university tuition invoice with SWIFT BIC and IBAN coordinates, verified academic transcripts, and passport. The bank executes an outward SWIFT wire transfer (MT103) in EUR directly to the Maltese university’s designated institutional account. EduExpress assists students and parents with complete Student File paperwork at zero consultancy charge.',
  },
];

export default async function MaltaStudyCostPage() {
  const universities = await prisma.university.findMany({
    where: { country: { contains: 'Malta' }, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      tuition: true,
      rankingWorld: true,
      programs: {
        where: { status: 'active' },
        select: { id: true, name: true, level: true, duration: true, tuition: true },
        take: 3,
      },
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
        name: 'Cost of Studying in Malta from Bangladesh | Full BDT & EUR Breakdown (2027)',
        description:
          'Comprehensive tuition fee schedules across University of Malta, MCAST, and private institutes, Identità visa solvency requirements, monthly living budgets, and Jobsplus work rights for Bangladeshi students.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malta.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALTA_COST_SOURCES),
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
          { name: 'Malta', path: '/study-in-malta-from-bangladesh' },
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 EUR ≈ 132 BDT · BDT 0 Upfront Fee"
        title="Cost of Studying in Malta from Bangladesh."
        lead="A transparent, evidence-first financial blueprint for Bangladeshi students and families: university tuition fees (EUR 6,000–14,000/yr), Identità Malta / Central Visa Unit living fund solvency requirements (EUR 9,000–10,000 in liquid bank deposits), realistic monthly budgets in Msida and Paola, free nationwide bus travel on Tallinja Card, and statutory Jobsplus 20 hrs/week work rights after the mandatory 90-day moratorium."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=Malta" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check Malta Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#solvency-rules" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Identità Solvency Rules
            </a>
          </>
        }
      />

      <TrustBar destination="Malta" />

      {/* Currency Planning Baseline Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold text-sm">
              €
            </span>
            <span>
              Planning Assumption (Nov 2026): <strong>1 EUR ≈ 132 BDT</strong>{' '}
              <span className="font-normal text-slate-500">
                (conservative European financial planning rate — confirm live commercial bank TT selling rates before remittance)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• 100% English-Taught EU Degrees</span>
            <span>• Direct University &amp; VFS Fees</span>
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
        intro="Itemized official expenses required before departing from Dhaka to Malta. All fees are paid directly to statutory government agencies, designated medical clinics, VFS Global, and airlines."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Banknote className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">Exchange Rate Assumption</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-petrol-900">1 EUR ≈ 132 BDT</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Planning Assumption:</strong> Foreign exchange rates fluctuate with global markets. Calculations in this guide apply 1 EUR = 132 BDT to provide a safe, realistic financial ceiling for Bangladeshi families planning their academic budget.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-amber-700" />
              <h3 className="text-base font-bold text-petrol-800">Identità Solvency Benchmark</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">EUR 9,000 – 10,000</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Identità Malta (Central Visa Unit) requires proof of 75% of national minimum wage per month (~EUR 650–750/mo). EduExpress advises demonstrating EUR 9,000–10,000 (~11.8L–13.2L BDT) seasoned in an authorized bank account.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">EduExpress Fee Guarantee</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-800">BDT 0 Upfront</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              EduExpress charges <strong>BDT 0 file-opening fees</strong>. Our transparent service fee of BDT 100,000 (1 Lakh Taka) for European destinations is payable <strong>100% after visa approval</strong>. Zero financial risk on refusal.
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
                <th className="p-4">Approx. BDT Equivalent (@ 132 BDT)</th>
                <th className="p-4">Payment Recipient &amp; Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Malta National Type-D Student Visa Fee</td>
                <td className="p-4 font-semibold">EUR 100</td>
                <td className="p-4">~13,200 BDT</td>
                <td className="p-4 text-slate-600">Identità Malta / Consular Visa Section (Statutory non-refundable application fee)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">VFS Global Logistics &amp; Biometrics Charge</td>
                <td className="p-4 font-semibold">EUR 35 – EUR 60</td>
                <td className="p-4">~4,620 – 7,920 BDT</td>
                <td className="p-4 text-slate-600">VFS Global Application Centre (Biometric enrolment and secure consular courier)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Academic &amp; Notary Document Legalization</td>
                <td className="p-4 font-semibold">3,000 – 6,000 BDT</td>
                <td className="p-4">3,000 – 6,000 BDT</td>
                <td className="p-4 text-slate-600">Education Boards, Ministry of Education (MOE) &amp; Ministry of Foreign Affairs (MOFA) Dhaka</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Police Clearance Certificate</td>
                <td className="p-4 font-semibold">500 BDT</td>
                <td className="p-4">500 BDT</td>
                <td className="p-4 text-slate-600">Bangladesh Police (Online verification portal with QR code authentication)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Pre-Departure Medical Examination</td>
                <td className="p-4 font-semibold">4,000 – 7,500 BDT</td>
                <td className="p-4">4,000 – 7,500 BDT</td>
                <td className="p-4 text-slate-600">Authorized diagnostic center (Chest X-ray, Hepatitis B/C, HIV screening for residence file)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Initial Schengen Travel &amp; Health Insurance</td>
                <td className="p-4 font-semibold">EUR 120 – EUR 220</td>
                <td className="p-4">~15,840 – 29,040 BDT</td>
                <td className="p-4 text-slate-600">Schengen-compliant insurance covering €30,000 minimum until Malta e-Residence card issuance</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka to Malta MLA)</td>
                <td className="p-4 font-semibold">EUR 480 – EUR 720</td>
                <td className="p-4">~63,360 – 95,040 BDT</td>
                <td className="p-4 text-slate-600">Airlines (Turkish Airlines via Istanbul, Emirates/flydubai via Dubai)</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">EduExpress File Opening &amp; Counseling</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0 Upfront</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0</td>
                <td className="p-4 text-xs text-emerald-800">Zero file opening charge · BDT 100,000 service fee payable 100% after visa issuance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Currency & Banking Planning Assumptions */}
      <Section
        id="currency-banking"
        tone="sage"
        title="Currency &amp; Banking Planning Assumptions (EUR &amp; BDT)"
        intro="How exchange rate mechanics, Bangladesh Bank foreign exchange limits, and authorized Student File wire transfers impact your study abroad budget in Malta."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Scale className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">Conservative Planning vs Interbank Rates</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              While open-market interbank mid-rates may display lower figures, Bangladeshi commercial banks apply an official <strong>Telegraphic Transfer (TT) Selling Rate</strong> plus foreign exchange processing fees when remitting Euros abroad.
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Planning Baseline Rate:</span>
                <span className="font-bold text-petrol-800">1 EUR ≈ 132 BDT</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">First-Year Tuition (€8,500):</span>
                <span className="font-bold text-emerald-800">~11.22 Lakh BDT</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Identità Living Fund (€9,000):</span>
                <span className="font-bold text-petrol-800">~11.88 Lakh BDT</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              * Families are advised to budget with an additional 3–5% currency fluctuation margin when preparing financial solvency documentation.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Landmark className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">Bangladesh Bank Student File Guidelines</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Under Bangladesh Bank Foreign Exchange Guidelines, tuition fees to Maltese universities must be remitted legally through an authorized commercial bank via an official <strong>Student File</strong>:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Authorized Dealer (AD) Banks:</strong> Eastern Bank, Prime Bank, BRAC Bank, City Bank, Dhaka Bank, or Standard Chartered.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Required Dossier:</strong> Unconditional Letter of Acceptance (LoA), official Maltese university tuition invoice, verified academic certificates, and passport copy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>SWIFT Wire Transfer (MT103):</strong> Direct bank-to-bank electronic transfer in EUR to the university’s IBAN in Malta, providing an official transaction receipt for the visa file.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Tuition Fees Across Maltese Universities */}
      <Section
        id="tuition-fees"
        title="Tuition Fees by University &amp; Degree Level"
        intro="Annual tuition fee schedules across Malta’s public universities, vocational colleges, and MFHEA-accredited higher education institutions for non-EU international students."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Institution Name</th>
                <th className="p-4">Campus Location</th>
                <th className="p-4">Degree / Program Level</th>
                <th className="p-4">Annual Tuition (EUR)</th>
                <th className="p-4">Approx. Annual BDT (@ 132)</th>
                <th className="p-4">Accreditation &amp; Key Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Malta
                  </Link>
                </td>
                <td className="p-4">Msida</td>
                <td className="p-4">Bachelor’s (Arts / Business)</td>
                <td className="p-4 font-semibold">€8,500 – €10,800</td>
                <td className="p-4 font-bold text-petrol-800">11.2L – 14.2L BDT</td>
                <td className="p-4 text-slate-600">National public research university (founded 1592) · MQF Level 6</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Malta
                  </Link>
                </td>
                <td className="p-4">Msida</td>
                <td className="p-4">Bachelor’s / Master’s (STEM &amp; Computing)</td>
                <td className="p-4 font-semibold">€10,000 – €14,000</td>
                <td className="p-4 font-bold text-petrol-800">13.2L – 18.5L BDT</td>
                <td className="p-4 text-slate-600">Artificial Intelligence, Software Engineering, Data Science · MQF 7</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/mcast-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    MCAST
                  </Link>
                </td>
                <td className="p-4">Paola</td>
                <td className="p-4">Higher National Diploma (HND)</td>
                <td className="p-4 font-semibold">€3,500 – €6,000</td>
                <td className="p-4 font-bold text-petrol-800">4.6L – 7.9L BDT</td>
                <td className="p-4 text-slate-600">Vocational &amp; Technical Higher Education · MQF Level 5</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/mcast-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    MCAST
                  </Link>
                </td>
                <td className="p-4">Paola</td>
                <td className="p-4">Applied Bachelor’s Degree</td>
                <td className="p-4 font-semibold">€8,500 – €10,000</td>
                <td className="p-4 font-bold text-petrol-800">11.2L – 13.2L BDT</td>
                <td className="p-4 text-slate-600">Applied Engineering, Business Management, Creative Arts · MQF 6</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/institute-of-tourism-studies-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    Institute of Tourism Studies (ITS)
                  </Link>
                </td>
                <td className="p-4">Luqa</td>
                <td className="p-4">Diploma in Hospitality / Culinary</td>
                <td className="p-4 font-semibold">€4,300 – €4,950</td>
                <td className="p-4 font-bold text-petrol-800">5.7L – 6.5L BDT</td>
                <td className="p-4 text-slate-600">Affiliated with Emirates Academy of Hospitality Management · MQF 5</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/institute-of-tourism-studies-malta" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    Institute of Tourism Studies (ITS)
                  </Link>
                </td>
                <td className="p-4">Luqa</td>
                <td className="p-4">Bachelor’s / Master’s (Hospitality)</td>
                <td className="p-4 font-semibold">€7,900 – €8,500</td>
                <td className="p-4 font-bold text-petrol-800">10.4L – 11.2L BDT</td>
                <td className="p-4 text-slate-600">International Hospitality &amp; Tourism Leadership · MQF 6 &amp; 7</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Private Higher Education Institutes (GBS / Ascencia / LSC)</td>
                <td className="p-4">Valletta / Birkirkara / St. Julian&apos;s</td>
                <td className="p-4">Bachelor’s &amp; MBA Programs</td>
                <td className="p-4 font-semibold">€6,000 – €8,500</td>
                <td className="p-4 font-bold text-petrol-800">7.9L – 11.2L BDT</td>
                <td className="p-4 text-slate-600">MFHEA-licensed private institutions · Dual UK/French accredited awards</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-900 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="size-4 shrink-0 text-amber-700" />
            <span>Important MFHEA Accreditation Verification Notice</span>
          </div>
          <p className="mt-2">
            Always verify that private colleges in Malta hold full accreditation from the <strong>Malta Further &amp; Higher Education Authority (MFHEA)</strong> and award recognized qualifications on the Malta Qualifications Framework (MQF Levels 5–8). EduExpress verifies institutional licences against the official MFHEA register before recommending any program to students.
          </p>
        </div>
      </Section>

      {/* Module 4: Identità & Central Visa Unit Solvency Rules */}
      <Section
        id="solvency-rules"
        tone="sage"
        title="Identità / Central Visa Unit (CVU) Financial Solvency Rules"
        intro="Official visa financial requirements established by Identità Malta and the Central Visa Unit for non-EU/EEA degree students applying from Bangladesh."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Solvency Pillar 1: Living Fund Calculation */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Wallet className="size-6 text-emerald-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Statutory Subsistence Benchmark</h3>
                <span className="text-xs font-semibold text-emerald-800">Identità Non-EU Student Directive</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Identità Malta evaluates financial sustainability based on approximately <strong>75% of Malta’s national minimum wage</strong> per month of study. For a standard 12-month academic year, this establishes the following baseline:
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory Monthly Minimum:</span>
                <span className="font-bold text-petrol-800">€650 – €750 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">12-Month Official Baseline:</span>
                <span className="font-bold text-emerald-800">€7,800 – €9,000</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Recommended Liquid Balance:</span>
                <span className="font-bold text-petrol-800">€9,000 – €10,000 (~11.8L–13.2L BDT)</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              <strong>Buffer Advisory:</strong> Having €9,000–€10,000 ensures that unexpected exchange rate dips or accommodation cost adjustments do not jeopardize your consular assessment.
            </p>
          </div>

          {/* Solvency Pillar 2: Banking & Documentation Standards */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <FileCheck className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Bank Statement &amp; Seasoning Rules</h3>
                <span className="text-xs font-semibold text-petrol-800">Consular Admissibility Standards</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Central Visa Unit officers in Malta closely scrutinize bank statements for sudden unexplained deposits or borrowed funds:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Seasoned Balance:</strong> Funds should ideally be maintained in an Authorized Dealer bank for at least 3 to 6 months with clear transaction velocity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Sponsorship Affidavit:</strong> When funded by parents, submit a notarized Declaration of Financial Sponsorship accompanied by parent salary slips, trade licences, or land deeds.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Tax Returns (IT-10B):</strong> Submit the latest 2 years of income tax acknowledgment receipts and asset statements for the sponsor.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Advance Tuition Proof:</strong> Official university receipt and SWIFT transfer copy showing advance payment (minimum 50% to 100% of 1st year tuition).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Accommodation Requirement Alert */}
        <div className="mt-8 rounded-3xl border border-petrol-800/15 bg-white p-7 shadow-xs">
          <div className="flex items-start gap-3">
            <Home className="size-6 shrink-0 text-petrol-800 mt-1" />
            <div>
              <h4 className="text-base font-bold text-petrol-800">Mandatory Housing Lease Agreement (Housing Authority Malta)</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Identità Malta strictly enforces that all visa applicants submit authenticated proof of accommodation in Malta. This can be an official confirmation letter from a university residence (such as Campus Hub at the University of Malta) or a <strong>registered residential lease contract</strong> signed with a private landlord and endorsed with the <strong>Housing Authority of Malta</strong> registration code. Unregistered rental agreements or generic hotel reservations are grounds for visa refusal.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 5: Monthly Living Costs in Malta */}
      <Section
        id="living-costs"
        title="Monthly Living Costs Breakdown in Malta"
        intro="Realistic monthly expenditure for an international student residing in student hubs like Msida, Gzira, Paola, and Birkirkara."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Estimated Monthly (EUR)</th>
                <th className="p-4">Monthly BDT (@ 132 BDT)</th>
                <th className="p-4">Money-Saving Strategy for Bangladeshi Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Shared Apartment (Twin / 2-Bed Room)</td>
                <td className="p-4 font-semibold">€250 – €400</td>
                <td className="p-4 font-bold text-petrol-800">33,000 – 52,800 BDT</td>
                <td className="p-4 text-slate-600">Share flat with fellow students in Msida, Paola, or Qormi rather than prime tourist zones (Sliema/St. Julian&apos;s)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Groceries &amp; Cooking at Home</td>
                <td className="p-4 font-semibold">€180 – €260</td>
                <td className="p-4 font-bold text-petrol-800">23,760 – 34,320 BDT</td>
                <td className="p-4 text-slate-600">Shop at discount supermarkets (Lidl, Eurospin) and local fruit/vegetable vans; cook traditional meals at home</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">Public Transportation (Buses Nationwide)</td>
                <td className="p-4 font-bold text-emerald-900">€0 / month</td>
                <td className="p-4 font-bold text-emerald-900">0 BDT (Free!)</td>
                <td className="p-4 text-emerald-800">Public buses are 100% free across Malta and Gozo on a personalized Tallinja Card! Saves students €300+ annually</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Utilities (Water, Electricity, Gas, Waste)</td>
                <td className="p-4 font-semibold">€40 – €70</td>
                <td className="p-4 font-bold text-petrol-800">5,280 – 9,240 BDT</td>
                <td className="p-4 text-slate-600">Split evenly among apartment flatmates; monitor AC usage in hot summer months to control bills</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Mobile Internet &amp; Telecom (5G SIM)</td>
                <td className="p-4 font-semibold">€15 – €25</td>
                <td className="p-4 font-bold text-petrol-800">1,980 – 3,300 BDT</td>
                <td className="p-4 text-slate-600">Student prepaid monthly plans from Epic, GO, or Melita with unlimited social data and EU roaming</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Personal Care, Hygiene &amp; Miscellaneous</td>
                <td className="p-4 font-semibold">€60 – €100</td>
                <td className="p-4 font-bold text-petrol-800">7,920 – 13,200 BDT</td>
                <td className="p-4 text-slate-600">Gym memberships, personal toiletries, and occasional student social gatherings</td>
              </tr>
              <tr className="bg-canvas-soft font-bold text-petrol-900">
                <td className="p-4 text-sm">Total Monthly Student Living Budget</td>
                <td className="p-4 text-sm font-extrabold text-petrol-800">€545 – €855 / mo</td>
                <td className="p-4 text-sm font-extrabold text-petrol-800">~72,000 – 113,000 BDT</td>
                <td className="p-4 text-xs font-semibold text-slate-600">Highly affordable compared to UK (£1,136–£1,483) or Finland (€800)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tallinja Card Callout */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-600/20 bg-emerald-50/60 p-5 text-xs text-emerald-950">
          <div className="flex items-center gap-3">
            <Train className="size-6 text-emerald-700" />
            <div>
              <p className="font-bold text-emerald-900">Malta Tallinja Card: 100% Free Public Bus Transport</p>
              <p className="text-emerald-800">All registered residents and international students in Malta enjoy free nationwide bus transit on Malta Public Transport.</p>
            </div>
          </div>
          <span className="rounded-xl bg-white px-3 py-1.5 font-bold text-emerald-800 shadow-2xs">
            Annual Savings: ~€312 (41,000 BDT)
          </span>
        </div>
      </Section>

      {/* Module 6: Part-Time Work Rights & Jobsplus Regulations */}
      <Section
        id="work-rights"
        tone="sage"
        title="Part-Time Work Rights &amp; Jobsplus Regulations"
        intro="Maltese statutory employment framework for non-EU students: the critical 90-day moratorium, 20 hrs/week term limits, and realistic wage expectations."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card A: 90-Day Rule */}
          <div className="rounded-3xl border border-amber-300 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Clock className="size-6 text-amber-700" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">The Mandatory 90-Day Waiting Rule</h3>
                <span className="text-xs font-semibold text-amber-700">Legal Notice 229/2018 Statutory Caveat</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Unlike the UK or Finland where students can work from day one, <strong>Maltese immigration law prohibits non-EU students from taking up employment during their first 90 days</strong> in the country.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <ShieldAlert className="size-4 shrink-0 text-amber-700 mt-0.5" />
                <span><strong>First 90 Days:</strong> Strict focus on academic orientation and initial lectures. Working without an authorization licence results in immediate deportation and Schengen-wide ban.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>After Day 90:</strong> Once your e-Residence card is issued and 90 days have passed, you and your employer can apply to Jobsplus for an employment licence.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Licence Fee:</strong> A statutory fee of €150 applies for the student employment licence, valid for the duration of the academic year.</span>
              </li>
            </ul>
          </div>

          {/* Card B: Wage & Earning Potential */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-emerald-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Student Earnings vs Monthly Expenses</h3>
                <span className="text-xs font-semibold text-emerald-800">Jobsplus 20 Hours / Week Allocation</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              International students are permitted to work up to <strong>20 hours per week</strong> during the semester and up to <strong>40 hours per week</strong> during official semester breaks.
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Typical Hourly Wage:</span>
                <span className="font-bold text-petrol-800">€6.50 – €9.00 / hour</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Monthly Gross (20 hrs/wk @ €7.50):</span>
                <span className="font-bold text-emerald-800">~€600 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Approx. BDT Equivalent (@ 132):</span>
                <span className="font-bold text-petrol-800">~79,200 BDT / month</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              <strong>Coverage Analysis:</strong> At ~€600 monthly earnings, a student comfortably covers 80% to 100% of their day-to-day shared living costs (€545–€750), relieving family back in Bangladesh from ongoing monthly maintenance remittances.
            </p>
          </div>
        </div>

        {/* Sectors Table */}
        <div className="mt-8 rounded-3xl border border-rule bg-white p-6 shadow-xs">
          <h4 className="text-sm font-bold text-petrol-800">Top Employment Sectors for Bangladeshi Students in Malta</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs text-slate-700">
            <div className="rounded-2xl bg-canvas-soft p-4">
              <span className="font-bold text-petrol-800">Hospitality &amp; Catering</span>
              <p className="mt-1 text-slate-500">Waiters, baristas, kitchen helpers in St. Julian&apos;s, Sliema, and Valletta hotels.</p>
              <span className="mt-2 inline-block font-semibold text-emerald-800">€6.50 – €8.50/hr</span>
            </div>
            <div className="rounded-2xl bg-canvas-soft p-4">
              <span className="font-bold text-petrol-800">Retail &amp; Supermarkets</span>
              <p className="mt-1 text-slate-500">Cashiers, shelf stockers, inventory assistants at Lidl, Welbee&apos;s, and shopping malls.</p>
              <span className="mt-2 inline-block font-semibold text-emerald-800">€6.50 – €7.50/hr</span>
            </div>
            <div className="rounded-2xl bg-canvas-soft p-4">
              <span className="font-bold text-petrol-800">Customer Support &amp; BPO</span>
              <p className="mt-1 text-slate-500">English-speaking customer service and helpdesk representatives in Malta&apos;s tech hubs.</p>
              <span className="mt-2 inline-block font-semibold text-emerald-800">€8.00 – €11.00/hr</span>
            </div>
            <div className="rounded-2xl bg-canvas-soft p-4">
              <span className="font-bold text-petrol-800">Logistics &amp; Delivery</span>
              <p className="mt-1 text-slate-500">Food courier (Bolt / Wolt) and warehouse parcel sorting with flexible scheduling.</p>
              <span className="mt-2 inline-block font-semibold text-emerald-800">€7.00 – €9.50/hr</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 7: Post-Graduation Career Pathways */}
      <Section
        id="career-pathways"
        title="Post-Graduation Career Pathways (9-Month Job Seeker Permit)"
        intro="How international graduates transition from student status into professional employment and European Single Work Permits in Malta."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">9-Month Job Seeker Permit</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Graduates of accredited Bachelor’s (MQF Level 6) and Master’s (MQF Level 7) degrees in Malta are entitled to an extended <strong>9-month post-study residence permit</strong> to seek full-time employment or launch an approved enterprise.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <Building2 className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">European Single Work Permit</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Once an employer offers you a qualifying employment contract, you apply through Identità for the <strong>Single Permit</strong>, which combines work and residence authorization in a unified biometric European plastic card.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">Key Employee Initiative (KEI)</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Specialized graduates in Software Engineering, Cybersecurity, AI, and Financial Services earning €35,000+/year qualify for fast-track KEI processing, receiving work permits within <strong>5 working days</strong>.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 8: EduExpress Transparent 100% After Visa Fee Structure */}
      <Section
        id="fee-comparison"
        tone="sage"
        title="EduExpress Fee Policy vs Conventional Consultancies"
        intro="We operate with total transparency. EduExpress charges zero upfront file-opening fees, collecting our service charge only after your Malta student visa is approved."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Service Milestone</th>
                <th className="p-4">Conventional Consultancies</th>
                <th className="p-4 bg-emerald-50 text-emerald-950">EduExpress International Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">File Opening / Initial Consultation</td>
                <td className="p-4 text-red-700 font-semibold">BDT 20,000 – 50,000 (Non-refundable)</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-800">BDT 0 (100% Free Counseling)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">University Application &amp; Offer Processing</td>
                <td className="p-4 text-slate-600">Often bundled with undisclosed commissions</td>
                <td className="p-4 bg-emerald-50/50 text-emerald-900">Direct application to MFHEA-accredited universities</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Tuition Remittance Guidance (Student File)</td>
                <td className="p-4 text-slate-600">Frequently outsourced or charged extra fees</td>
                <td className="p-4 bg-emerald-50/50 text-emerald-900">End-to-end documentation for Bangladesh Bank AD banks</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Housing Lease Verification (Housing Authority)</td>
                <td className="p-4 text-slate-600">Risk of unverified private lease contracts</td>
                <td className="p-4 bg-emerald-50/50 text-emerald-900">Mandatory verification of registered lease endorsement code</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Consultancy Service Fee Payment Timing</td>
                <td className="p-4 text-red-700 font-semibold">Demanded upfront before visa submission</td>
                <td className="p-4 bg-emerald-50/50 font-extrabold text-emerald-800">
                  100% After Visa Approval (BDT 100,000)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Refusal Financial Protection</td>
                <td className="p-4 text-red-700">Agency retains upfront fees; student absorbs loss</td>
                <td className="p-4 bg-emerald-50/50 font-semibold text-emerald-900">Zero service fee owed if visa is refused</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 9: Comprehensive FAQ Section */}
      <Section
        id="faq"
        title="Frequently Asked Questions: Cost of Studying in Malta"
        intro="Clear, verified answers to common financial, visa solvency, and student work questions asked by Bangladeshi applicants."
      >
        <FaqBlock items={MALTA_COST_FAQS} />
      </Section>

      {/* Statutory Citations */}
      <section aria-label="Official statutory sources" className="border-t border-rule bg-canvas-soft py-10">
        <div className={kit.wrap}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Landmark size={14} aria-hidden="true" />
            <span>Official Regulatory &amp; Statutory Sources</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MALTA_COST_SOURCES.map((source) => (
              <a
                key={source.label}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-rule bg-white p-4 transition-all hover:border-petrol-800 hover:shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-petrol-800 group-hover:text-emerald-800">
                  <span>{source.label}</span>
                  <ExternalLink size={12} className="shrink-0 text-slate-400 group-hover:text-emerald-800" />
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{source.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Education Fit Assessment CTA */}
      <section id="assessment" className="border-t border-rule bg-white py-16">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free Profile Evaluation</span>
            <h2 className="mt-2 text-3xl font-extrabold text-petrol-800">Assess Your Education Fit for Malta</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Find out whether Malta’s 100% English degrees, MFHEA accreditation, and post-study career routes align with your academic background, budget, and long-term career aspirations. Receive a personalized recommendation in 1 working day.
            </p>
          </div>
          <div className="mt-8">
            <EducationFitAssessment />
          </div>
        </div>
      </section>
    </article>
  );
}

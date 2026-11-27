import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Bus,
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
  MapPin,
  Plane,
  Receipt,
  Scale,
  School,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Utensils,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/greece-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const GREECE_COST_SOURCES = [
  {
    label: 'Hellenic Authority for Higher Education (HAHE / ETHAAE)',
    href: 'https://www.ethaae.gr/en/',
    note: 'Independent statutory quality assurance agency for Greek higher education institutions; full member of ENQA and registered on EQAR certifying European Qualifications Framework (EQF) degree compliance.',
  },
  {
    label: 'Study in Greece — Official National Portal',
    href: 'https://studyingreece.edu.gr/',
    note: 'Official portal backed by the Hellenic Ministry of Foreign Affairs and Ministry of Education detailing English-taught degree tuition benchmarks and international student admissions.',
  },
  {
    label: 'Ministry of Migration and Asylum (Hellenic Republic)',
    href: 'https://migration.gov.gr/en/',
    note: 'Statutory government ministry administering National Long-Stay (Type D) Study Visa financial solvency regulations (€400–€500/month) and biometric Student Residence Permit (e-Permit) issuance.',
  },
  {
    label: 'Ministry of Education, Religious Affairs and Sports (Greece)',
    href: 'https://minedu.gov.gr/',
    note: 'Central governmental authority overseeing university degree charters, Bologna Process ECTS compliance, and non-EU institutional fee frameworks.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal SWIFT wire remittances (Form TM) to Greek university IBAN accounts and international Education Card quotas.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Greece from Bangladesh 2027 | EduExpress',
    description:
      'Greece study cost breakdown for Bangladeshi students: university tuition (€1,000–€3,500/yr), Type-D visa bank solvency, Athens budget, and student work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('greece', 'Cost of Studying in Greece from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'How much does it cost to study in Greece in Bangladeshi Taka (BDT)?',
    answer:
      'Greece is one of the most affordable higher education destinations in the European Union. Public university English-taught Master’s degrees range from €1,000 to €3,500 per year (approx. 1.3 lakh to 4.6 lakh BDT at 1 EUR ≈ 132 BDT), with specialized business and shipping Master’s at AUEB costing €4,200 to €7,600 total. International Bachelor’s programs range from €3,500 to €6,000 per year (~4.6 lakh to 7.9 lakh BDT). Monthly living expenses in Athens or Thessaloniki range from €480 to €780 (approx. 63,000 to 103,000 BDT), bringing the typical first-year total budget (tuition + 12 months living) to 9.5 lakh to 16.5 lakh BDT.',
  },
  {
    question: 'What is the National Type-D visa bank solvency requirement for Greece?',
    answer:
      'The Hellenic Ministry of Migration and Asylum requires non-EU students to prove financial solvency of at least €400 to €500 per month for the duration of their first year of study (€4,800 to €6,000 minimum, approx. 6.3 lakh to 7.9 lakh BDT). Funds must be held in a recognized Bangladeshi bank account for at least 3 to 6 months under the name of the student or legal parent sponsor, backed by an official bank solvency certificate, 6-month transaction statements, and a notarized affidavit of financial support.',
  },
  {
    question: 'Why must Bangladeshi students open a Student File for Greece?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, tuition fees to foreign universities cannot be remitted through personal credit cards or informal channels. Opening a formal Student File at an Authorized Dealer (AD) commercial bank in Bangladesh allows parents to transfer tuition directly to the Greek university’s verified IBAN account via SWIFT telegraphic transfer under Form TM. It also entitles the student to an international Education Card with an annual forex quota of up to USD 12,000 equivalent for living and accommodation expenses.',
  },
  {
    question: 'Are Bangladeshi students legally allowed to work part-time in Greece?',
    answer:
      'Yes. Under the Greek Migration Code (Law 4251/2014 & Law 5038/2023), international students holding a valid biometric Student Residence Permit (e-Permit) have the statutory right to work part-time up to 20 hours per week during academic semesters, and full-time (up to 40 hours per week) during official summer vacations. Students must obtain a Greek Tax Number (AFM) and Social Security Number (AMKA/EFKA). Typical student wages range from €5.50 to €8.00 per hour (approx. 725 to 1,050 BDT/hour), generating €440 to €640 per month during term-time.',
  },
  {
    question: 'How do living costs compare between Athens, Thessaloniki, and regional Greek cities?',
    answer:
      'Athens has the highest living costs due to rental pressure in central neighborhoods, with monthly student budgets averaging €520 to €820. Thessaloniki, Greece’s vibrant northern student capital, is roughly 15% to 20% cheaper, with monthly living costs of €440 to €700. Regional university cities like Patras, Heraklion (Crete), and Ioannina are even more economical, averaging €400 to €620 per month. Across all cities, students benefit from a 50% statutory discount on public transit passes (€15/month in Athens) and subsidized university cafeterias.',
  },
  {
    question: 'What is EduExpress’s service fee policy for Greek university admissions and visas?',
    answer:
      'EduExpress operates with a strict, transparent fee guarantee for Europe: BDT 0 upfront file-opening charge, and an EduExpress service fee of BDT 100,000 (1 Lakh Taka) payable 100% strictly after your National Type-D visa is approved. Students self-pay direct statutory costs (consular visa fee €90, biometric residence permit €150, health insurance, and university tuition) directly to the relevant authorities and institutions.',
  },
];

export default async function GreeceStudyCostPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Cost of Studying in Greece from Bangladesh 2027: Tuition, Solvency & Living | EduExpress',
        description:
          'Greece study cost breakdown for Bangladeshi students: university tuition (€1,000–€3,500/yr), Type-D visa bank solvency, Athens budget, and student work.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/greece.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GREECE_COST_SOURCES),
      },
    ],
  };

  // Fetch verified Greek partner universities from database
  let universities: { slug: string; name: string; location: string; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Greece', 'greece'] } },
      select: {
        slug: true,
        name: true,
        location: true,
        tuition: true,
      },
      take: 6,
      orderBy: { name: 'asc' },
    });
  } catch {
    universities = [];
  }

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Destinations', path: '/destinations' },
          { name: 'Greece', path: '/study-in-greece-from-bangladesh' },
          { name: 'Study Cost Guide' },
        ]}
        eyebrow="HAHE Accredited · European Union Degree · BDT 0 Upfront File-Opening Fee"
        title="Cost of Studying in Greece from Bangladesh 2027."
        lead="An itemized, evidence-first financial guide to studying in Greece: public university tuition from €1,000/year, National Type-D visa solvency (€400–€500/month), Athens versus Thessaloniki living expenses, and 20 hours/week student work rights."
        actions={
          <>
            <Link href="/apply?country=Greece" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Cost Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/greece-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Greece Type D Visa Guide
            </Link>
            <a href="#itemized-budget" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              View First-Year Budget
            </a>
          </>
        }
      />

      <TrustBar destination="Greece" />

      {/* Currency Planning Assumption & Key Metrics */}
      <section aria-label="Planning assumption and summary metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Rate
              </span>
              <p className="text-xs text-slate-500">
                Official Currency Baseline: <strong>1 EUR ≈ 132 BDT</strong> (Euro to Bangladeshi Taka).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> Transparent European Fee Standard
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> Public Master Tuition
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€1,000 – €3,500 / yr</p>
              <p className="mt-1 text-xs text-slate-600">Approx. 1.3L – 4.6L BDT/yr. Top European value.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Type D Solvency Proof
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€400 – €500 / mo</p>
              <p className="mt-1 text-xs text-slate-600">€4,800 – €6,000 (~6.3L–7.9L BDT) held in sponsor bank.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Home size={16} className="text-emerald-700" /> Monthly Living Budget
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€480 – €780 / mo</p>
              <p className="mt-1 text-xs text-slate-600">Athens & Thessaloniki: accommodation, food, transit.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Briefcase size={16} className="text-emerald-700" /> Legal Work Rights
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">20 Hours / Week</p>
              <p className="mt-1 text-xs text-slate-600">Statutory e-Permit right (€5.50–€8.00/hr minimum).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Complete Itemized First-Year Budget Table */}
      <Section
        id="itemized-budget"
        title="Complete Itemized First-Year Budget for Greece"
        intro="An evidence-first breakdown of all tuition, statutory immigration, pre-departure, and realistic living expenses for Bangladeshi students planning their first year in Greece."
      >
        <div className="overflow-hidden rounded-3xl border border-rule bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
                <tr>
                  <th className="p-4">Expense Category</th>
                  <th className="p-4">Annual Cost (EUR)</th>
                  <th className="p-4">Approximate BDT (1 EUR ≈ 132 BDT)</th>
                  <th className="p-4">Payment Recipient & Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Public University Tuition (English Master's)</td>
                  <td className="p-4">€1,500 – €3,500</td>
                  <td className="p-4 font-bold text-petrol-800">1.98 – 4.62 Lakh BDT</td>
                  <td className="p-4 text-slate-600">Paid to Greek University via bank Student File wire upon admission</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Student Accommodation (12 Months)</td>
                  <td className="p-4">€3,000 – €4,800</td>
                  <td className="p-4 font-bold text-petrol-800">3.96 – 6.34 Lakh BDT</td>
                  <td className="p-4 text-slate-600">Paid monthly to landlord (€250–€400/month shared apartment)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Food & Groceries (12 Months)</td>
                  <td className="p-4">€1,800 – €2,640</td>
                  <td className="p-4 font-bold text-petrol-800">2.38 – 3.48 Lakh BDT</td>
                  <td className="p-4 text-slate-600">Self-managed monthly grocery shopping (€150–€220/month)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Discounted Student Transit Pass (12 Months)</td>
                  <td className="p-4">€180 – €240</td>
                  <td className="p-4 font-bold text-petrol-800">23,760 – 31,680 BDT</td>
                  <td className="p-4 text-slate-600">OASA Athens / OASTH Thessaloniki 50% student card (€15–€20/mo)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">National Type-D Visa Application Fee</td>
                  <td className="p-4">€90</td>
                  <td className="p-4 font-bold text-petrol-800">11,880 BDT</td>
                  <td className="p-4 text-slate-600">Paid to Embassy of Greece / VFS Global at visa appointment</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Biometric Residence Permit (e-Permit Paravolo)</td>
                  <td className="p-4">€166</td>
                  <td className="p-4 font-bold text-petrol-800">21,912 BDT</td>
                  <td className="p-4 text-slate-600">€150 state fee + €16 card fee paid online to Ministry of Migration</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Mandatory International Health Insurance</td>
                  <td className="p-4">€150 – €280</td>
                  <td className="p-4 font-bold text-petrol-800">19,800 – 36,960 BDT</td>
                  <td className="p-4 text-slate-600">Comprehensive annual medical policy covering inpatient & outpatient care</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">Document Attestation & Police Clearance (Dhaka)</td>
                  <td className="p-4">€115 – €190</td>
                  <td className="p-4 font-bold text-petrol-800">15,000 – 25,000 BDT</td>
                  <td className="p-4 text-slate-600">Education Board, Ministry of Education, and MoFA Dhaka</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-petrol-800">One-Way Airfare (Dhaka to Athens / Thessaloniki)</td>
                  <td className="p-4">€400 – €650</td>
                  <td className="p-4 font-bold text-petrol-800">52,800 – 85,800 BDT</td>
                  <td className="p-4 text-slate-600">Airline booking (Qatar Airways, Emirates, Gulf Air, Turkish Airlines)</td>
                </tr>
                <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                  <td className="p-4">EduExpress Service Fee (Europe Policy)</td>
                  <td className="p-4">€758 (BDT 100,000)</td>
                  <td className="p-4 text-emerald-800">100,000 BDT (1 Lakh Taka)</td>
                  <td className="p-4 text-emerald-800">Strictly 100% AFTER Visa Approval (BDT 0 Upfront)</td>
                </tr>
                <tr className="bg-slate-100 font-bold text-slate-900 text-sm">
                  <td className="p-4">Total Estimated First-Year Budget</td>
                  <td className="p-4 text-emerald-800">€8,160 – €12,960</td>
                  <td className="p-4 text-petrol-800">10.77 – 17.10 Lakh BDT</td>
                  <td className="p-4 text-xs font-normal text-slate-600">Complete 12-month academic & living investment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Module 2: Tuition Fee Schedules by Institution Type & Study Level */}
      <Section
        id="tuition-schedules"
        tone="sage"
        title="Tuition Fee Schedules Across Greek Higher Education"
        intro="Under Article 16 of the Greek Constitution, public undergraduate education for EU citizens is tuition-free. However, public institutions charge competitive, accredited fees for English-taught Master's degrees and international undergraduate programs."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Public Master's */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <GraduationCap size={18} /> Public Research Universities (English MSc)
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-800">€1,000 – €3,500 / year (approx. 1.3L – 4.6L BDT)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Premier state institutions such as National Technical University of Athens (NTUA), Aristotle University of Thessaloniki (AUTH), and National and Kapodistrian University of Athens (NKUA) offer world-class Master’s degrees in Engineering, Data Science, AI, and Environmental Studies at benchmark low tuition.
            </p>
            <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700 space-y-1.5">
              <div><strong>NTUA Interdisciplinary Engineering MSc:</strong> €1,000 – €3,000 / year</div>
              <div><strong>AUTH Applied Informatics & Science MSc:</strong> €1,500 – €3,500 / year</div>
              <div><strong>NKUA Natural Sciences & Humanities MA:</strong> €2,000 – €4,000 / program</div>
            </div>
          </div>

          {/* Specialized Shipping & Business */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <Building size={18} /> Specialized Maritime, Shipping & Business (AUEB / Piraeus)
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-800">€4,200 – €7,600 / total program (approx. 5.5L – 10.0L BDT)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Greece controls over 20% of the world’s merchant fleet deadweight tonnage. Athens University of Economics and Business (AUEB) and University of Piraeus host globally renowned English-medium Master’s programs in International Shipping, Maritime Economics, Finance, and MBA.
            </p>
            <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700 space-y-1.5">
              <div><strong>AUEB MSc in Shipping Management:</strong> €7,600 total (1.5 years)</div>
              <div><strong>AUEB MSc in Financial Management:</strong> €6,800 total (1.5 years)</div>
              <div><strong>University of Piraeus Maritime Studies:</strong> €5,000 – €6,500 total</div>
            </div>
          </div>

          {/* English Undergraduate Programs */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <BookOpen size={18} /> English-Medium Undergraduate (BA / BSc)
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-800">€3,500 – €6,000 / year (approx. 4.6L – 7.9L BDT)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Specialized 4-year English bachelor programs designed specifically for international students, such as NKUA’s BA Program in the Archaeology, History, and Literature of Ancient Greece.
            </p>
            <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700 space-y-1.5">
              <div><strong>NKUA BA in Archaeology & History:</strong> €6,000 / year</div>
              <div><strong>AUTH English Bachelor of Medicine (MD):</strong> €12,000 / year (6 Years)</div>
              <div><strong>NKUA English Medical Degree (MD):</strong> €13,000 / year (6 Years)</div>
            </div>
          </div>

          {/* Private Accredited Colleges */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <School size={18} /> Private Colleges & UK Franchise Campuses
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-800">€5,500 – €9,500 / year (approx. 7.2L – 12.5L BDT)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Private institutions in Athens and Thessaloniki operating in franchise partnership with accredited UK universities (such as Metropolitan College, BCA College, and DEI College). Students earn British degrees while studying in Greece.
            </p>
            <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700 space-y-1.5">
              <div><strong>Business, Computing & Maritime UK Dual Degrees:</strong> €6,000 – €8,500 / year</div>
              <div><strong>Accreditation Body:</strong> UK QAA partner validation + HAHE oversight</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 3: National Long-Stay Type-D Visa Financial Solvency & Bank Requirements */}
      <Section
        id="visa-solvency"
        title="National Type-D Visa Financial Solvency & Bank Protocol"
        intro="The Hellenic Republic enforces clear statutory financial requirements to ensure non-EU international students can support themselves without recourse to state social assistance."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Statutory Solvency Rule */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Statutory Monthly Solvency Benchmark</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Under Greek Immigration Law (Joint Ministerial Decision and Migration Code), non-EU students applying for a National Long-Stay (Type D) Study Visa must demonstrate access to a minimum of <strong>€400 to €500 per month</strong> for living maintenance throughout their academic year:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Minimum Annual Solvency Sum:</span>
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  €4,800 – €6,000 (~6.3 Lakh – 7.9 Lakh BDT)
                </p>
                <p className="mt-1 text-slate-500 text-[11px]">
                  Recommended buffer: Maintaining 8.0 Lakh to 10.0 Lakh BDT in the sponsor account significantly strengthens the consular application.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Bank Account & Statement Criteria:</span>
                <ul className="mt-1.5 space-y-1 text-slate-600">
                  <li>• Held in an Authorized Dealer (AD) scheduled commercial bank in Bangladesh.</li>
                  <li>• Account must show continuous, healthy transaction history for <strong>3 to 6 months</strong> prior to visa submission.</li>
                  <li>• Sudden, unexplained lump-sum deposits without documented source of funds trigger consular scrutiny.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Sponsor Eligibility & Affidavits:</span>
                <p className="mt-1 text-slate-600">
                  Primary sponsors must be immediate family members (Parents or Legal Spouse). Requires notarized Affidavit of Financial Support, income tax returns (TIN & Tax Challans for past 2–3 years), and business trade licenses or salary certificates.
                </p>
              </div>
            </div>
          </div>

          {/* Bangladesh Bank Student File Protocol */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <CreditCard size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Bangladesh Bank Student File & SWIFT Remittance</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              All academic funds sent from Bangladesh to Greece must follow official foreign exchange channels established by Bangladesh Bank:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">1. Formal Student File Opening:</span>
                <p className="mt-1 text-slate-600">
                  Your parent/sponsor opens a dedicated Student File at an Authorized Dealer bank (e.g., City Bank, Eastern Bank, BRAC Bank, Dutch-Bangla Bank) using your unconditional Greek university offer letter, estimation invoice, and attested academic certificates.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">2. Direct University IBAN SWIFT Wire (Form TM):</span>
                <p className="mt-1 text-slate-600">
                  Tuition fees are wired directly via SWIFT telegraphic transfer from the Student File to the university’s verified Greek IBAN bank account under Bangladesh Bank Form TM. The bank issues an official SWIFT transaction slip (MT103) used as proof of tuition payment for visa processing.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">3. International Education Card Quota:</span>
                <p className="mt-1 text-slate-600">
                  Under FE Circular No. 37, banks issue an international debit/credit Education Card endorsed against the Student File with an annual quota up to USD 12,000 equivalent for living and accommodation expenses in Greece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 4: Monthly Living Cost Comparison — Athens vs Thessaloniki vs Regional */}
      <Section
        id="city-living-costs"
        tone="sage"
        title="Monthly Living Cost Comparison: Athens vs Thessaloniki vs Regional Towns"
        intro="Greece offers some of the most economical living costs in Western Europe. Accommodation is the primary variable between the capital, the northern metropolis, and university towns."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Living Expense Category</th>
                <th className="p-4">Athens (Capital Region)</th>
                <th className="p-4">Thessaloniki (Northern Hub)</th>
                <th className="p-4">Regional Towns (Patras, Crete)</th>
                <th className="p-4">Practical Bangladeshi Student Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Student Accommodation (Shared Apartment / Studio)</td>
                <td className="p-4 font-bold text-slate-800">€280 – €440 / mo</td>
                <td className="p-4 font-bold text-slate-800">€220 – €350 / mo</td>
                <td className="p-4 font-bold text-slate-800">€180 – €280 / mo</td>
                <td className="p-4 text-slate-600">Shared 2-bed apartment in Zografou/Kaisariani (Athens) or Rotonda/Ano Poli (Thessaloniki).</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food, Groceries & Weekly Farmers Market (Laiki)</td>
                <td className="p-4 font-bold text-slate-800">€160 – €230 / mo</td>
                <td className="p-4 font-bold text-slate-800">€140 – €200 / mo</td>
                <td className="p-4 font-bold text-slate-800">€130 – €180 / mo</td>
                <td className="p-4 text-slate-600">Fresh produce at weekly open-air neighborhood markets (Laiki agora); rice, lentils & halal poultry from local grocers.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Public Transit (50% Student Discount Card)</td>
                <td className="p-4 font-bold text-slate-800">€15 / mo</td>
                <td className="p-4 font-bold text-slate-800">€10 – €15 / mo</td>
                <td className="p-4 font-bold text-slate-800">€10 – €15 / mo</td>
                <td className="p-4 text-slate-600">OASA Athens unlimited metro/bus student card; OASTH Thessaloniki new metro & bus network.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Utilities (Electricity, Water, Heating & Fiber Wifi)</td>
                <td className="p-4 font-bold text-slate-800">€50 – €80 / mo</td>
                <td className="p-4 font-bold text-slate-800">€45 – €75 / mo</td>
                <td className="p-4 font-bold text-slate-800">€40 – €65 / mo</td>
                <td className="p-4 text-slate-600">Cost shared among flatmates. Natural gas/electricity bills fluctuate seasonally in winter.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Mobile Phone & Unlimited Data SIM</td>
                <td className="p-4 font-bold text-slate-800">€12 – €18 / mo</td>
                <td className="p-4 font-bold text-slate-800">€12 – €18 / mo</td>
                <td className="p-4 font-bold text-slate-800">€12 – €18 / mo</td>
                <td className="p-4 text-slate-600">Cosmote What's Up or Vodafone CU student plans with 25–40 GB monthly 5G data.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Personal Discretionary & Miscellaneous</td>
                <td className="p-4 font-bold text-slate-800">€40 – €80 / mo</td>
                <td className="p-4 font-bold text-slate-800">€35 – €70 / mo</td>
                <td className="p-4 font-bold text-slate-800">€30 – €60 / mo</td>
                <td className="p-4 text-slate-600">Course materials, laundry, personal toiletries, and occasional student café socializing.</td>
              </tr>
              <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                <td className="p-4">Total Estimated Monthly Living Budget</td>
                <td className="p-4 text-emerald-900">€557 – €863 / mo</td>
                <td className="p-4 text-emerald-900">€462 – €728 / mo</td>
                <td className="p-4 text-emerald-900">€402 – €618 / mo</td>
                <td className="p-4 text-emerald-900">Monthly budget in BDT: ~53,000 – 114,000 BDT/month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: Student Part-Time Work Regulations & Realistic Earnings */}
      <Section
        id="work-rights"
        title="Student Part-Time Work Rights & Realistic Earnings"
        intro="The Greek Migration Code grants international students lawful employment privileges. However, students must understand the regulatory rules, wage scales, and language realities."
      >
        <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
                <Briefcase size={18} /> Statutory Employment Privileges
              </div>
              <h3 className="mt-2 text-base font-bold text-petrol-800">20 Hours / Week (Academic Semester)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Under Law 4251/2014 and the updated Greek Immigration Code (Law 5038/2023), non-EU students who hold a valid Greek biometric Student Residence Permit (e-Permit) are entitled to work part-time up to <strong>20 hours per week</strong> during the academic semester, and full-time (up to 40 hours per week) during scheduled summer breaks.
              </p>

              <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700 space-y-2">
                <div><strong>Statutory Hourly Wage:</strong> €5.50 – €8.00 per hour (national gross minimum wage benchmark: €830/month full-time).</div>
                <div><strong>Typical Part-Time Monthly Earnings:</strong> €440 – €640 / month (approx. 58,000 – 84,500 BDT/month for 20 hrs/week).</div>
                <div><strong>Mandatory Legal Setup:</strong> Must obtain a Greek Tax Identification Number (AFM - Arithmos Forologikou Mitroou) and National Social Security Registration (AMKA / e-EFKA).</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800">
                <AlertTriangle size={18} /> Practical Language & Employment Realities
              </div>
              <h3 className="mt-2 text-base font-bold text-petrol-800">Language Barriers & Available Sectors</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                While work rights are legally guaranteed, local customer-facing positions in shops, retail, and traditional cafes almost universally require basic to intermediate conversational Greek (Ellinika).
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="rounded-xl border border-rule bg-white p-3">
                  <strong className="text-petrol-800">English-Accessible Employment Hubs:</strong>
                  <p className="mt-1 text-slate-600">
                    Summer tourism & resort hospitality on Greek islands (Crete, Rhodes, Santorini, Mykonos) during June–September breaks, international maritime logistics back-office internships in Piraeus, English-language customer support centers (Teleperformance, Webhelp), and remote digital freelance work.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950 font-medium">
                  <strong>Important Warning:</strong> Part-time income in Greece is sufficient to cover food and personal pocket expenses, but students must NOT rely on part-time wages to fund university tuition or base apartment rent.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 6: Initial Pre-Departure & Post-Arrival Statutory Fees */}
      <Section
        id="statutory-fees"
        tone="sage"
        title="Initial Pre-Departure & Post-Arrival Statutory Fee Checklist"
        intro="Mandatory administrative fees payable to consular, legal, and immigration authorities during the admission and arrival pipeline."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-rule bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Consular Visa Fee</span>
            <p className="mt-1 text-lg font-bold text-petrol-800">€90</p>
            <p className="text-[11px] text-slate-500">~11,880 BDT</p>
            <p className="mt-2 text-xs text-slate-600">Paid to the Embassy of Greece / VFS Global at visa appointment in Dhaka/New Delhi.</p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Residence Permit Paravolo</span>
            <p className="mt-1 text-lg font-bold text-petrol-800">€166</p>
            <p className="text-[11px] text-slate-500">~21,912 BDT</p>
            <p className="mt-2 text-xs text-slate-600">€150 state fee + €16 card fee paid online to Hellenic Ministry of Migration.</p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Student Health Insurance</span>
            <p className="mt-1 text-lg font-bold text-petrol-800">€150 – €280</p>
            <p className="text-[11px] text-slate-500">~19,800 – 36,960 BDT</p>
            <p className="mt-2 text-xs text-slate-600">Annual policy covering emergency hospital inpatient care and outpatient medical services in Greece.</p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-5 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500">Legal Translations</span>
            <p className="mt-1 text-lg font-bold text-petrol-800">€60 – €120</p>
            <p className="text-[11px] text-slate-500">~7,900 – 15,800 BDT</p>
            <p className="mt-2 text-xs text-slate-600">Official Greek MFA Translation Service or certified Hellenic lawyer translation of certificates.</p>
          </div>
        </div>
      </Section>

      {/* Module 7: Verified Greek Universities for Bangladeshi Students */}
      {universities.length > 0 && (
        <Section
          id="universities"
          title="Verified Greek Higher Education Institutions"
          intro="Accredited Greek public universities certified by the Hellenic Authority for Higher Education (HAHE) offering English-taught degrees."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {universities.map((uni) => (
              <div key={uni.slug} className="flex flex-col justify-between rounded-3xl border border-rule bg-white p-6 shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MapPin size={14} /> {uni.location}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      HAHE Certified
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-petrol-800">{uni.name}</h3>
                  {uni.tuition && (
                    <div className="mt-3 rounded-xl bg-canvas-soft p-3 text-xs text-slate-700">
                      <strong>Tuition Schedule:</strong> {uni.tuition}
                    </div>
                  )}
                </div>
                <div className="mt-5 border-t border-rule pt-4">
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                  >
                    View Institution Profile & Programs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/study-in-greece-from-bangladesh" className="ed-btn ed-btn-signal min-h-[44px] px-6">
              Explore Greece Study Hub <ArrowRight size={14} />
            </Link>
            <Link href="/compare-costs" className="ed-btn ed-btn-outline min-h-[44px] px-6">
              Compare All European Country Costs
            </Link>
          </div>
        </Section>
      )}

      {/* Module 8: EduExpress Written Fee Guarantee & ClearCost Commitment */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Europe Service Guarantee</span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">BDT 0 File-Opening Fee · BDT 100,000 After Visa</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              EduExpress operates under a strictly written, zero-risk European service agreement. We charge zero file-opening fees. Our full agency service fee for Greece is BDT 100,000 (1 Lakh Taka), payable 100% strictly after your National Type-D visa is stamped.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">BDT 0 Upfront</span>
                <p className="mt-1 text-xs text-white/75">Zero file-opening charge, zero assessment fee, zero advance counseling billings.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">100% After Visa</span>
                <p className="mt-1 text-xs text-white/75">Our BDT 100,000 service fee is payable only when your passport is stamped with your Greek Type-D visa.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">ClearCost Sheet</span>
                <p className="mt-1 text-xs text-white/75">Itemized 1-page breakdown listing every euro, recipient, and official due date in writing.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/apply?country=Greece" className="ed-btn ed-btn-signal min-h-[48px] px-8 text-sm">
                Apply for Greece Admission & Visa <ArrowRight size={16} />
              </Link>
              <Link href="/study-in-greece-from-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-8 text-sm">
                Greece Study Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 9: FAQs */}
      <Section id="faq" tone="sage" title="Frequently Asked Questions" intro="Clear answers on Greek tuition fees, embassy solvency, living costs, and part-time work regulations.">
        <FaqBlock items={faqs} />
      </Section>

      {/* Module 10: Editorial Reviewer Card, Statutory Citations & Assessment */}
      <section className="border-t border-canvas-soft bg-white py-12">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Reviewer Card */}
            <div className="rounded-3xl border border-rule bg-canvas-soft p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Editorial & Financial Reviewer</span>
                  <p className="mt-1 text-base font-bold text-petrol-800">Abdullah Al Rakib</p>
                  <p className="text-xs text-slate-500">Founder & CEO, EduExpress International · European Admissions Counselor</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Last Verified Date: </span>
                  <time dateTime="2026-11-27" className="font-bold text-petrol-800">November 27, 2026</time>
                  <span className="block text-[11px] text-slate-400">Baseline review: 2026-11-27</span>
                </div>
              </div>

              <div className="mt-4 text-xs leading-relaxed text-slate-600">
                <p>
                  This guide reflects statutory higher education fee benchmarks certified by the Hellenic Authority for Higher Education (HAHE), the Hellenic Ministry of Migration and Asylum (Type D financial solvency criteria), and Bangladesh Bank Foreign Exchange Guidelines. All euro currency conversions use the established planning assumption (1 EUR ≈ 132 BDT).
                </p>
              </div>
            </div>

            {/* Statutory Sources Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Official Regulatory Authorities & Statutory Sources</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {GREECE_COST_SOURCES.map((source) => (
                  <li key={source.href} className="rounded-2xl border border-rule bg-white p-4 shadow-sm">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-petrol-800 hover:text-emerald-700"
                    >
                      <span>{source.label}</span>
                      <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                    </a>
                    {source.note && <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{source.note}</p>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Standard Disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
              <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission offers, tuition rates, and visa issuance decisions rest solely with the respective Greek universities and official Hellenic consular and immigration authorities.
            </div>
          </div>
        </div>
      </section>

      {/* Free Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Eligibility & Cost Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Greek Admission & Budget Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Submit your academic credentials and preferred field of study. Our European admissions team in Dhanmondi, Dhaka will evaluate your university eligibility, tuition estimate, and visa timeline within 1 working day.
              </p>
            </div>
            <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm sm:p-10">
              <EducationFitAssessment />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

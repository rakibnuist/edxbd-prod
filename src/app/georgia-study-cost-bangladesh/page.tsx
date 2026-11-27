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
  Stethoscope,
  Utensils,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/georgia-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const GEORGIA_COST_SOURCES = [
  {
    label: 'National Center for Educational Quality Enhancement (NCEQE Georgia)',
    href: 'https://eqe.ge/en',
    note: 'Statutory national accreditation agency under the Ministry of Education and Science of Georgia; recognized by the World Federation for Medical Education (WFME) and full member of ENQA.',
  },
  {
    label: 'Ministry of Education, Science and Youth of Georgia',
    href: 'https://mes.gov.ge/',
    note: 'Issues the official Ministerial Order for international student enrollment recognition required for Georgia National D3 Study Visa issuance.',
  },
  {
    label: 'Ministry of Foreign Affairs of Georgia (Consular Portal)',
    href: 'https://www.geoconsul.gov.ge/en',
    note: 'Statutory authority governing immigration protocols, D3 National Study Visa issuance, and consular processing rules.',
  },
  {
    label: 'World Directory of Medical Schools (WDOMS)',
    href: 'https://www.wdoms.org/',
    note: 'Global public directory of medical schools; mandatory listing verification for international licensing examinations (USMLE, PLAB/UKMLA, and BMDC RQE).',
  },
  {
    label: 'Bangladesh Medical and Dental Council (BMDC)',
    href: 'https://bmdc.org.bd/',
    note: 'Statutory body governing foreign medical qualifications, mandatory pre-departure Eligibility Certificates, and the Registration Qualifying Examination (RQE).',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal SWIFT wire remittances (Form TM) to Georgian university IBAN accounts and international Education Card quotas.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Georgia from Bangladesh 2027 | EduExpress',
    description:
      'Complete cost breakdown for studying in Georgia from Bangladesh: English MD/MBBS tuition ($5,300–$8,000/yr), D3 Visa bank solvency ($3,500–$5,000), Tbilisi living costs, and BMDC licensing rules.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('georgia', 'Cost of Studying in Georgia from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'How much does it cost to study medicine (MD) in Georgia in Bangladeshi Taka (BDT)?',
    answer:
      'A 6-year European single-cycle Medical Doctor (MD / MBBS equivalent) degree in Georgia costs between USD 5,300 and USD 8,000 per academic year at premier WFME-accredited universities like Tbilisi State Medical University (TSMU), Ilia State University, and The University of Georgia (UG). At the planning assumption of 1 USD ≈ 122 BDT, this equals approximately 6.5 lakh to 9.8 lakh BDT per year. Non-medical programs in Computer Science and Business are even more economical at USD 3,500 to USD 4,500 per year (~4.3 lakh to 5.5 lakh BDT). Combined with modest living costs in Tbilisi (USD 350–$600/month ≈ 42,000–73,000 BDT), the total first-year outlay for a medical student ranges from 12.4 lakh to 18.0 lakh BDT.',
  },
  {
    question: 'Is a Georgian MD degree recognized as MBBS by the Bangladesh Medical and Dental Council (BMDC)?',
    answer:
      'Yes, provided the student follows statutory protocols. The European single-cycle MD program is a 6-year, 360 ECTS credit qualification identical in clinical scope to an MBBS. All partner institutions (TSMU, TSU, Iliauni, UG) are accredited by NCEQE under WFME standards and listed in WDOMS. Under BMDC foreign medical rules, Bangladeshi students must obtain a formal BMDC Eligibility Certificate prior to departure (requiring SSC+HSC combined GPA 7.00+ with minimum 3.00 in each, and HSC Biology GPA 3.50+). Upon graduating from Georgia, students must pass the BMDC Registration Qualifying Examination (RQE) and complete a clinical internship in Bangladesh to obtain their full practicing license.',
  },
  {
    question: 'What is the National D3 Study Visa bank solvency requirement for Georgia?',
    answer:
      'The Georgian Ministry of Foreign Affairs requires international students to demonstrate sufficient financial funds to cover living expenses in Georgia. For Bangladeshi applicants, maintaining a liquid balance of USD 3,500 to USD 5,000 (approx. 4.3 lakh to 6.1 lakh BDT) in an Authorized Dealer bank account in Bangladesh for at least 3 to 6 months is standard. The account statement must be accompanied by an official bank solvency certificate, a notarized Affidavit of Financial Support from the sponsor (parents), and tax proof (TIN/Challans).',
  },
  {
    question: 'How do Bangladeshi families legally transfer university fees to Georgia?',
    answer:
      'All educational payments must be remitted legally through an Authorized Dealer (AD) scheduled commercial bank in Bangladesh by opening a dedicated Student File under Bangladesh Bank Foreign Exchange Guidelines. Using your official university acceptance letter, NCEQE recognition order, and attested educational certificates, the bank executes a SWIFT telegraphic transfer (Form TM) directly to the Georgian university’s official IBAN account. The bank also issues an international Education Card with an annual forex quota of up to USD 12,000 equivalent for accommodation and living expenses in Tbilisi.',
  },
  {
    question: 'Can international students work part-time in Georgia to pay their tuition?',
    answer:
      'No. While international students holding a valid Georgian Temporary Residence Card (TRC) have the statutory right to work under Georgian law, students must never rely on local employment to fund tuition fees. Most local customer-facing jobs require fluency in Georgian (Kartuli). English-language part-time opportunities in Tbilisi are limited to international call centers, remote IT support, and digital freelancing, paying approximately USD 2.50 to USD 5.00 per hour (GEL 7–14/hr). Families must fully pre-fund all educational and living costs before departure.',
  },
  {
    question: 'What is EduExpress’s service fee policy for Georgian university admissions and visas?',
    answer:
      'EduExpress operates with an uncompromising zero-risk fee guarantee for Europe: BDT 0 upfront file-opening fee, and a transparent service charge of BDT 100,000 (1 Lakh Taka) payable 100% strictly after your Georgia National D3 Visa is approved. All direct third-party statutory fees (NCEQE recognition, consular visa fee, certified translations, airfare, and university tuition) are paid directly by the student to the official recipients with itemized receipts.',
  },
];

export default async function GeorgiaStudyCostPage() {
  const georgiaUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Georgia', 'georgia'] },
      isActive: true,
    },
    include: {
      programs: { where: { status: 'active' }, take: 4 },
      fees: true,
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
        name: 'Cost of Studying in Georgia from Bangladesh 2027 | MD Tuition & Living Breakdown',
        description:
          'Evidence-first cost guide for Bangladeshi students: English MD/MBBS tuition ($5,300–$8,000/yr), D3 Visa bank solvency ($3,500–$5,000), Tbilisi living costs, and BMDC licensing rules.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/georgia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GEORGIA_COST_SOURCES),
      },
    ],
  };

  return (
    <article lang="en" className="bg-canvas text-ink">
      <JsonLd data={schema} />

      {/* Hero */}
      <PageHero
        path={PATH}
        trail={[
          { name: 'Destinations', path: '/destinations' },
          { name: 'Georgia', path: '/study-in-georgia-from-bangladesh' },
          { name: 'Cost Guide' },
        ]}
        eyebrow="Evidence-First Tuition & Living Analysis · Planning Assumption: 1 USD ≈ 122 BDT · 1 GEL ≈ 44 BDT"
        title="Cost of Studying in Georgia from Bangladesh (2027 Guide)"
        lead="Comprehensive financial breakdown for European higher education in Tbilisi: WFME-accredited 6-year English MD tuition (USD 5,300–$8,000/yr), Computer Science & Business fees (USD 3,500–$4,500/yr), National D3 Visa bank solvency, realistic Tbilisi living budgets, and mandatory BMDC licensing guidelines."
        reviewed="November 27, 2026"
        actions={
          <>
            <Link href="/apply?country=Georgia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Georgia Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/study-in-georgia-from-bangladesh"
              className="ed-btn ed-btn-outline min-h-[52px] px-6"
            >
              Explore Georgia Country Pillar
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Module 1: Quick Facts & Planning Assumption */}
      <Section
        id="quick-facts"
        tone="white"
        title="Georgia Study Cost at a Glance (2027 Planning Assumption)"
        intro="Planning Assumption: All currency conversions utilize 1 USD ≈ 122 BDT and 1 GEL (Georgian Lari) ≈ 44 BDT. Academic fees are billed semiannually directly by accredited universities in US Dollars."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Stethoscope size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              English MD / MBBS Tuition
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              $5,300 – $8,000 <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              ~6.5L – 9.8L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              TSMU, TSU, Ilia State &amp; UG (US MD track at TSMU reaches $13,500/yr). 6-year single-cycle 360 ECTS.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <Building2 size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              CS &amp; Business Tuition
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              $3,500 – $4,500 <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-petrol-800">
              ~4.3L – 5.5L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              BSc Informatics, Computer Engineering, and BBA tracks taught completely in English.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Home size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Monthly Living Budget
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              $350 – $600 <span className="text-xs font-normal text-slate-500">/ mo</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-900">
              ~42,700 – 73,200 BDT / mo
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Tbilisi shared apartment ($200–$350), groceries ($120–$180), subsidized metro ($10–$15), and utilities.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              D3 Visa Bank Solvency
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              $3,500 – $5,000
            </p>
            <p className="mt-1 text-xs font-semibold text-blue-900">
              ~4.2L – 6.1L BDT in BD Bank
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Maintained 3–6 months in sponsor AD bank account with official solvency certificate and tax proofs.
            </p>
          </div>
        </div>

        {/* Currency Callout Box */}
        <div className="mt-6 rounded-2xl border border-rule bg-canvas-soft p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-petrol-800" />
            <div className="text-xs leading-relaxed text-slate-700">
              <strong className="text-petrol-800">Official Currency &amp; Invoicing Standard:</strong> While Georgia&apos;s domestic currency is the Georgian Lari (GEL), universities issue international tuition invoices strictly in <strong>US Dollars (USD)</strong>. All educational wires are transmitted via Bangladesh Bank Student Files in USD. In Tbilisi, local daily living expenses are transacted in Georgian Lari (1 GEL ≈ 44 BDT / 1 USD ≈ 2.75 GEL).
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Complete First-Year Comprehensive Budget Breakdown */}
      <Section
        id="first-year-budget"
        tone="sage"
        title="Complete First-Year Itemized Budget (Pre-Departure to Tbilisi Arrival)"
        intro="A transparent, line-by-line financial roadmap detailing every mandatory outlay for a medical or engineering student entering Georgia in the 2026/27 academic cycle."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Cost Category</th>
                <th className="p-4">Item &amp; Statutory Purpose</th>
                <th className="p-4">Estimated Range (USD / GEL)</th>
                <th className="p-4">Equivalent in BDT</th>
                <th className="p-4">Payable To &amp; Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {/* Pre-Departure Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 1: Pre-Departure Documentation, Attestation &amp; Visa
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Certificate Attestation</td>
                <td className="p-4">Education Board, Ministry of Education &amp; MOFA Dhaka attestation</td>
                <td className="p-4">USD 40 – USD 60</td>
                <td className="p-4">5,000 – 7,500 BDT</td>
                <td className="p-4 text-slate-500">Government treasury challans (Direct)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Georgian Legal Translation</td>
                <td className="p-4">Notarized translation of academic records &amp; police clearance into Georgian</td>
                <td className="p-4">USD 120 – USD 180</td>
                <td className="p-4">15,000 – 22,000 BDT</td>
                <td className="p-4 text-slate-500">Certified translation agency / NCEQE rep</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">NCEQE Recognition Fee</td>
                <td className="p-4">National Center for Educational Quality Enhancement ministerial review</td>
                <td className="p-4">USD 150 – USD 250</td>
                <td className="p-4">18,300 – 30,500 BDT</td>
                <td className="p-4 text-slate-500">NCEQE state service portal (Official fee)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">BMDC Eligibility Certificate</td>
                <td className="p-4">Mandatory pre-departure eligibility clearance for medical applicants</td>
                <td className="p-4">BDT 2,000 (Govt fee)</td>
                <td className="p-4">2,000 BDT</td>
                <td className="p-4 text-slate-500">Bangladesh Medical &amp; Dental Council</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">D3 Consular Visa Fee</td>
                <td className="p-4">National D3 Immigration Study Visa application fee</td>
                <td className="p-4">USD 20 – USD 50</td>
                <td className="p-4">2,500 – 6,000 BDT</td>
                <td className="p-4 text-slate-500">Georgian Consular / E-Visa portal</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Airfare (One-Way)</td>
                <td className="p-4">Dhaka to Tbilisi (DAC &rarr; TBS via Sharjah, Doha, or Istanbul)</td>
                <td className="p-4">USD 450 – USD 650</td>
                <td className="p-4">55,000 – 79,000 BDT</td>
                <td className="p-4 text-slate-500">Airlines (Air Arabia, Qatar Airways, Turkish)</td>
              </tr>

              {/* Institutional Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 2: First-Year Academic Tuition Fees (Remitted via Student File)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-emerald-800">Medical Doctor (MD) Tuition</td>
                <td className="p-4">Premier WFME-accredited universities (TSMU, Ilia, UG, TSU)</td>
                <td className="p-4 font-bold text-emerald-800">USD 5,300 – USD 8,000 / yr</td>
                <td className="p-4 font-bold text-petrol-800">6.46 – 9.76 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university IBAN via SWIFT Form TM</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">CS / Business Tuition</td>
                <td className="p-4">BSc Informatics, Computer Engineering &amp; BBA international tracks</td>
                <td className="p-4 font-bold text-petrol-800">USD 3,500 – USD 4,500 / yr</td>
                <td className="p-4 font-bold text-petrol-800">4.27 – 5.49 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university IBAN via SWIFT Form TM</td>
              </tr>

              {/* On-Arrival & Residence Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 3: Tbilisi On-Arrival Statutory &amp; Living Maintenance (12 Months)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Temporary Residence Card (TRC)</td>
                <td className="p-4">Biometric plastic residence permit at Tbilisi Public Service Hall</td>
                <td className="p-4">GEL 210 – GEL 350 (~$75–$125)</td>
                <td className="p-4">9,200 – 15,400 BDT</td>
                <td className="p-4 text-slate-500">Public Service Hall Tbilisi (Within 45 days)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Annual Medical Insurance</td>
                <td className="p-4">Local Georgian health insurance policy meeting TRC regulations</td>
                <td className="p-4">USD 100 – USD 180 / yr</td>
                <td className="p-4">12,200 – 22,000 BDT</td>
                <td className="p-4 text-slate-500">Georgian insurance provider (GPI, Imedi L)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Accommodation (12 Months)</td>
                <td className="p-4">Shared 2-bedroom student flat near Metro (USD 200–$350/mo)</td>
                <td className="p-4">USD 2,400 – USD 4,200</td>
                <td className="p-4">2.93 – 5.12 Lakh BDT</td>
                <td className="p-4 text-slate-500">Private apartment landlord / Dormitory</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food &amp; Groceries (12 Months)</td>
                <td className="p-4">Self-cooking, halal chicken/beef, rice, fresh produce (USD 120–$180/mo)</td>
                <td className="p-4">USD 1,440 – USD 2,160</td>
                <td className="p-4">1.75 – 2.63 Lakh BDT</td>
                <td className="p-4 text-slate-500">Supermarkets (Carrefour, Spar, 2 Nabiji)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Metro, Utilities &amp; 4G SIM</td>
                <td className="p-4">Subsidized student metro card + winter heating + fiber internet</td>
                <td className="p-4">USD 480 – USD 720</td>
                <td className="p-4">58,500 – 87,800 BDT</td>
                <td className="p-4 text-slate-500">Tbilisi Transport Co, Magti / Silknet</td>
              </tr>

              {/* EduExpress Fee Policy */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 4: EduExpress European Advisory &amp; Processing Guarantee
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">EduExpress Service Fee</td>
                <td className="p-4">
                  Full admission, NCEQE guidance, BMDC compliance audit &amp; D3 Visa processing.
                  <span className="block font-bold text-emerald-800">BDT 0 Upfront · 100% After Visa Approval</span>
                </td>
                <td className="p-4 font-bold text-petrol-800">BDT 100,000</td>
                <td className="p-4 font-bold text-emerald-800">1.00 Lakh BDT</td>
                <td className="p-4 text-emerald-800 font-bold">Strictly After Visa Approval</td>
              </tr>

              {/* Grand Totals */}
              <tr className="bg-petrol-900 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year Medical (MD) Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">USD 10,700 – USD 16,500</td>
                <td className="p-4 text-sm text-sand-100">13.0 – 20.0 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Includes 12 full months living in Tbilisi</td>
              </tr>
              <tr className="bg-petrol-800 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year CS / Business Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">USD 8,900 – USD 13,000</td>
                <td className="p-4 text-sm text-sand-100">10.8 – 15.8 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Includes 12 full months living in Tbilisi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 3: University-by-University Tuition Matrix */}
      <Section
        id="universities-tuition"
        tone="white"
        title="Tuition Matrix: Verified Georgian Universities (2026/27 Intake)"
        intro="Official annual tuition schedules for English-taught Medical, Engineering, and Business programs across verified public and private Georgian institutions."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {georgiaUnis.map((uni) => (
            <div
              key={uni.slug}
              className="flex flex-col justify-between rounded-3xl border border-rule bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                      <ShieldCheck size={13} /> NCEQE &amp; WFME Accredited
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={13} /> {uni.city || 'Tbilisi'}, Georgia
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-canvas-soft p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tuition Range Benchmark
                  </span>
                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {uni.tuition || 'USD 3,500 – USD 8,000 / year'}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-bold text-petrol-800">Premier English Programs:</span>
                  <ul className="mt-2 space-y-2 text-xs text-slate-700">
                    {uni.programs && uni.programs.length > 0 ? (
                      uni.programs.map((prog, idx) => (
                        <li key={idx} className="flex items-start justify-between gap-2 border-b border-rule/50 pb-1.5">
                          <div>
                            <span className="font-semibold text-slate-800">{prog.name}</span>
                            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                              {prog.level}
                            </span>
                          </div>
                          <span className="shrink-0 font-bold text-emerald-800">{prog.tuition}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Programs updated dynamically per semester</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs">
                <span className="text-slate-500">WDOMS Listed · Bologna ECTS</span>
                <Link
                  href={`/universities/${uni.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-petrol-800 hover:underline"
                >
                  View Full Profile <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 4: Crucial Medical Education & BMDC Licensing Guardrail */}
      <Section
        id="medical-guardrails"
        tone="sage"
        title="Medical Degree Recognition: WFME, WDOMS &amp; BMDC Licensing Rules"
        intro="Practicing medicine in Bangladesh after graduating abroad requires compliance with strict statutory criteria. Review our mandatory advisory before committing to medical studies in Georgia."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Degree Structure & Recognition */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Stethoscope size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              The 6-Year European Single-Cycle MD Degree (360 ECTS)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              In Georgia and the European Higher Education Area (EHEA), medicine is awarded as a continuous 6-year single-cycle <strong>Medical Doctor (MD)</strong> degree comprising 360 European Credit Transfer System (ECTS) credits:
            </p>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Equivalent to MBBS:</strong> The curriculum integrates preclinical science, clinical pathophysiology, and hands-on clinical rotations equivalent to the British-pattern MBBS.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>WFME Accreditation:</strong> Georgia&apos;s National Center for Educational Quality Enhancement (NCEQE) holds full recognition from the World Federation for Medical Education (WFME).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>WDOMS Directory Listing:</strong> TSMU, TSU, Iliauni, and UG are indexed in the World Directory of Medical Schools, qualifying graduates for the USMLE (USA), PLAB/UKMLA (UK), and AMC (Australia).
                </span>
              </li>
            </ul>
          </div>

          {/* Mandatory BMDC Licensing Criteria */}
          <div className="rounded-3xl border-2 border-petrol-800 bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <Scale size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Mandatory BMDC Prerequisites for Bangladeshi Students
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              To practice medicine in Bangladesh upon return, students must strictly satisfy the <strong>Bangladesh Medical and Dental Council (BMDC)</strong> foreign medical eligibility criteria:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">1. SSC &amp; HSC Academic Results (Science):</strong>
                <p className="mt-1 text-slate-600">
                  Combined GPA of <strong>7.00 or higher</strong> across SSC and HSC (with no individual GPA below 3.00), and a minimum GPA of <strong>3.50 in Biology</strong> at the HSC level.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">2. BMDC Pre-Departure Eligibility Certificate:</strong>
                <p className="mt-1 text-slate-600">
                  You must obtain a formal BMDC Eligibility Certificate before traveling to Georgia. BMDC will not register graduates who depart without this statutory clearance.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-3.5">
                <strong className="text-petrol-800">3. Post-Graduation Registration Exam (RQE):</strong>
                <p className="mt-1 text-slate-600">
                  After completing the 6-year MD program in Georgia, students must return to Bangladesh, pass the BMDC Registration Qualifying Examination (RQE), and complete a 1-year clinical internship at an accredited hospital in Bangladesh for full registration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 5: National D3 Study Visa & Bank Solvency Protocols */}
      <Section
        id="visa-solvency"
        tone="white"
        title="Georgia National D3 Study Visa: Bank Solvency &amp; Remittance Rules"
        intro="The Georgian immigration framework requires clear documentation of financial sustainability and ministerial student recognition prior to visa clearance."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Statutory Solvency Benchmark */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Statutory Bank Solvency Benchmark</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              To obtain the National D3 Immigration Visa, applicants must demonstrate sufficient financial funds to cover living and maintenance expenses in Georgia:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Recommended Bank Balance:</span>
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  USD 3,500 – USD 5,000 (~4.2 Lakh – 6.1 Lakh BDT)
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Funds should be seasoned for 3 to 6 months in a recognized scheduled commercial bank in Bangladesh.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Documentary Requirements:</span>
                <ul className="mt-1.5 space-y-1 text-slate-600">
                  <li>• Official Bank Solvency Certificate and 6-month certified bank statements.</li>
                  <li>• Notarized Affidavit of Financial Support from legal parent sponsor.</li>
                  <li>• Sponsor&apos;s TIN certificate and past 2 years of tax payment receipts (Challans).</li>
                  <li>• Clean police clearance certificate attested by MOFA Dhaka.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">NCEQE Ministerial Recognition Order:</span>
                <p className="mt-1 text-slate-600">
                  Prior to visa issuance, the university submits your translated records to NCEQE. The Ministry of Education of Georgia issues an official Ministerial Order confirming your legal enrollment.
                </p>
              </div>
            </div>
          </div>

          {/* Bangladesh Bank Student File Protocol */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <CreditCard size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Bangladesh Bank Student File &amp; SWIFT Wire</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              All tuition remittances to Georgia must comply with Bangladesh Bank foreign exchange guidelines:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">1. Formal Student File Opening:</strong>
                <p className="mt-1 text-slate-600">
                  Your parent opens a Student File at an Authorized Dealer (AD) bank (e.g., City Bank, Eastern Bank, BRAC Bank) using your unconditional offer letter, NCEQE order, and attested certificates.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">2. SWIFT Wire via Form TM:</strong>
                <p className="mt-1 text-slate-600">
                  Tuition is wired directly to the university&apos;s official bank IBAN in Georgia. The bank generates an official SWIFT confirmation slip (MT103), serving as verifiable tuition payment proof for consular officers.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">3. International Education Card Quota:</strong>
                <p className="mt-1 text-slate-600">
                  Under FE Circular No. 37, banks issue an international debit/credit card with an annual foreign exchange entitlement of up to USD 12,000 equivalent for living and accommodation expenses in Tbilisi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 6: Monthly Living Expenses in Tbilisi */}
      <Section
        id="living-costs"
        tone="sage"
        title="Monthly Living Cost Breakdown in Tbilisi (Realistic Student Budget)"
        intro="Tbilisi remains one of the most affordable capital cities in the European educational zone. Here is a realistic monthly budget breakdown for an international student."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Monthly Cost (USD)</th>
                <th className="p-4">Monthly Cost (GEL)</th>
                <th className="p-4">Equivalent in BDT</th>
                <th className="p-4">Practical Counselor Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Shared Apartment (2-Bedroom)</td>
                <td className="p-4 font-bold text-petrol-800">$200 – $350</td>
                <td className="p-4">550 – 960 GEL</td>
                <td className="p-4">24,400 – 42,700 BDT</td>
                <td className="p-4 text-slate-600">
                  Sharing a modern furnished flat near Saburtalo, Didube, or Vake metro lines with fellow Bangladeshi students.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food &amp; Groceries</td>
                <td className="p-4 font-bold text-petrol-800">$120 – $180</td>
                <td className="p-4">330 – 500 GEL</td>
                <td className="p-4">14,600 – 22,000 BDT</td>
                <td className="p-4 text-slate-600">
                  Self-cooking local poultry, beef, eggs, rice, lentils, and fresh Georgian produce from Carrefour or Dezerter Bazaar.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Public Transit (Metro &amp; Bus)</td>
                <td className="p-4 font-bold text-petrol-800">$10 – $15</td>
                <td className="p-4">25 – 40 GEL</td>
                <td className="p-4">1,200 – 1,800 BDT</td>
                <td className="p-4 text-slate-600">
                  Student Metromart card provides heavily subsidized transit across Tbilisi metro, bus, and Rike cableway lines.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Heating &amp; Utilities</td>
                <td className="p-4 font-bold text-petrol-800">$25 – $40</td>
                <td className="p-4">70 – 110 GEL</td>
                <td className="p-4">3,000 – 4,900 BDT</td>
                <td className="p-4 text-slate-600">
                  Central gas heating during winter months (Nov–Feb), electricity, water, and building maintenance.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">High-Speed Fiber &amp; 4G SIM</td>
                <td className="p-4 font-bold text-petrol-800">$10 – $15</td>
                <td className="p-4">25 – 40 GEL</td>
                <td className="p-4">1,200 – 1,800 BDT</td>
                <td className="p-4 text-slate-600">
                  Unlimited 4G data package from MagtiCom or Silknet plus split home optical fiber internet.
                </td>
              </tr>
              <tr className="bg-sand-50/60 font-bold text-petrol-800">
                <td className="p-4">Total Monthly Living Budget</td>
                <td className="p-4 text-emerald-800">$365 – $600 / mo</td>
                <td className="p-4">1,000 – 1,650 GEL</td>
                <td className="p-4 text-petrol-800">44,400 – 73,200 BDT / mo</td>
                <td className="p-4 text-slate-600 font-normal">
                  Comfortable, independent student lifestyle in Tbilisi without extravagant expenditure.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 7: Part-Time Employment Realities */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-Time Work Realities &amp; Language Barriers"
        intro="Honest counselor guidance on working in Georgia during your studies. Understand the statutory legal rights versus practical market constraints."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Briefcase size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Statutory Legal Work Rights</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Under Georgian Law on the Legal Status of Aliens and Stateless Persons, international students holding a valid biometric <strong>Temporary Residence Card (TRC)</strong> are legally permitted to engage in employment in Georgia without requiring a separate work permit.
            </p>
            <div className="mt-4 rounded-2xl border border-rule bg-canvas-soft p-4 text-xs text-slate-700">
              <strong className="text-petrol-800">Available English-Language Roles:</strong>
              <ul className="mt-1.5 space-y-1 text-slate-600">
                <li>• Remote tech support &amp; software QA for international startups.</li>
                <li>• Multilingual customer care and international call centers in Tbilisi.</li>
                <li>• Online English tutoring, academic writing, and digital freelancing.</li>
                <li>• Typical wages: USD 2.50 to USD 5.00 per hour (GEL 7–14/hr).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-50/30 p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-bold text-amber-950">Critical Counselor Warning: Never Rely on Work for Tuition</h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-900">
              Local retail, hospitality, pharmacy, and hospital clinical roles in Georgia strictly require fluency in the <strong>Georgian language (Kartuli)</strong>. English-only positions are competitive and limited in number.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-white/80 p-4 text-xs text-slate-700">
              <strong className="text-amber-950">Strict EduExpress Recommendation:</strong>
              <p className="mt-1 text-slate-600">
                Medical studies demand 35–45 hours per week of rigorous lectures, labs, and clinical hospital rotations. Attempting to work excessive hours will jeopardize your academic standing. <strong>Families must fully pre-fund university tuition and living expenses.</strong>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 8: EduExpress Europe Fee Policy & Written Guarantees */}
      <Section
        id="eduexpress-policy"
        tone="sage"
        title="The EduExpress Europe Fee Guarantee: Zero Risk, 100% Written Transparency"
        intro="We reject predatory consultancy practices. Our written fee structure guarantees that you never pay an advisory service charge until your visa is issued."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
              <Receipt size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 0 File-Opening Charge</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              We charge zero upfront file-opening fees, evaluation fees, or registration deposits. Your initial profile and BMDC eligibility evaluation is 100% free.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-petrol-100 text-petrol-900">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 100,000 Service Fee (After Visa)</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Our complete Europe processing fee is BDT 100,000 (1 Lakh Taka), payable strictly and only <strong>100% after your Georgia D3 Study Visa is approved</strong>.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
              <FileCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Three Written Guarantees</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Every applicant receives an Official Recognition Check, a 1-page itemized ClearCost Sheet, and a complete Application Proof Pack documenting direct submissions.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 9: FAQs */}
      <Section
        id="faqs"
        tone="white"
        title="Frequently Asked Questions: Cost of Studying in Georgia"
        intro="Direct, counselor-verified answers to common financial and regulatory questions from Bangladeshi students and parents."
      >
        <FaqBlock items={faqs} />
      </Section>

      {/* Editorial Card */}
      <Section tone="white" className="pt-0">
        <div className="rounded-3xl border border-rule bg-canvas-soft p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-petrol-800 text-white font-bold">
                AR
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reviewed &amp; Verified By
                </p>
                <h4 className="font-display text-base font-bold text-petrol-800">
                  Abdullah Al Rakib
                </h4>
                <p className="text-xs text-slate-600">
                  Founder &amp; CEO, EduExpress International · Updated November 27, 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/study-in-georgia-from-bangladesh"
                className="ed-btn ed-btn-outline text-xs min-h-[40px] px-4"
              >
                Georgia Country Pillar
              </Link>
              <Link
                href="/apply?country=Georgia"
                className="ed-btn ed-btn-signal text-xs min-h-[40px] px-4"
              >
                Apply for Georgia
              </Link>
            </div>
          </div>
          <div className="mt-5 border-t border-rule/60 pt-4 text-[11px] leading-relaxed text-slate-500">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and visa issuance decisions rest solely with the respective universities and official embassy authorities.
          </div>
        </div>
      </Section>

      {/* Assessment Funnel */}
      <Section tone="sage" className="pb-16">
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment />
        </div>
      </Section>
    </article>
  );
}

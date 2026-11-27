import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
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
  Plane,
  Receipt,
  Scale,
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
const PATH = '/cyprus-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const CYPRUS_COST_SOURCES = [
  {
    label: 'Civil Registry and Migration Department (CRMD — Republic of Cyprus)',
    href: 'https://www.moi.gov.cy/crmd',
    note: 'Statutory government department administering international student Entry Permits (M-Visas), financial solvency requirements (€7,000–€8,000), bank guarantee deposits, and Temporary Residence Cards (Pink Slip).',
  },
  {
    label: 'Cyprus Agency of Quality Assurance and Accreditation in Higher Education (CYQAA / DIPAE)',
    href: 'https://www.dipae.ac.cy/index.php/en/',
    note: 'Statutory national accreditation agency certifying European Qualifications Framework (EQF Levels 5–8) and Bologna Process ECTS compliance for public and private universities.',
  },
  {
    label: 'Ministry of Education, Sport and Youth (Republic of Cyprus)',
    href: 'https://www.moec.gov.cy/en/',
    note: 'Statutory authority governing university degree approval, international student quota allocations, and institutional tuition fee benchmarks.',
  },
  {
    label: 'Department of Labour (Ministry of Labour and Social Insurance)',
    href: 'https://www.mlsi.gov.cy/dl',
    note: 'Statutory authority regulating 20 hours/week student part-time employment rights, designated economic sectors, and minimum wage compliance following the mandatory 6-month study period.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening Student Files, SWIFT telegraphic transfers (EUR) to accredited Cypriot universities, and legitimate living cost remittances.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Cyprus from Bangladesh 2027 | EduExpress',
    description:
      'Cyprus study cost breakdown for Bangladeshi students: university tuition (€3,500–€10,000/yr), CRMD bank solvency, living costs, and 20 hrs/week work rights.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('cyprus', 'Cost of Studying in Cyprus from Bangladesh — EduExpress International'),
  });
}

const CYPRUS_COST_FAQS = [
  {
    question: 'What is the total estimated first-year cost to study in the Republic of Cyprus from Bangladesh?',
    answer:
      'A realistic first-year total budget for a self-funded Bangladeshi student in the Republic of Cyprus ranges between EUR 11,000 and EUR 18,000 (approximately 14.5 to 23.8 Lakh BDT at the Planning Assumption rate of 1 EUR ≈ 132 BDT). This incorporates first-year tuition (EUR 3,500–6,834 at colleges and public universities, or EUR 8,000–10,000 at private universities), 12 months of living expenses (EUR 6,700–8,500 covering shared housing, food, and utilities), pre-departure costs (CRMD Entry Permit fee, attested documents, medical screening, flight ticket ~1.2 to 1.7 Lakh BDT), and initial health insurance. Under EduExpress’s transparent European fee structure, you pay BDT 0 upfront file opening fees and only BDT 100,000 after your visa/Entry Permit is approved.',
  },
  {
    question: 'What is the CRMD bank solvency requirement for a Cyprus student visa from Bangladesh?',
    answer:
      'The Civil Registry and Migration Department (CRMD) of the Republic of Cyprus requires non-EU degree applicants to submit proof of sufficient financial subsistence. You must submit an official bank certificate and 3 to 6-month bank statement from an Authorized Dealer commercial bank in Bangladesh showing a minimum liquid balance of EUR 7,000 to EUR 8,000 (~9.2 to 10.5 Lakh BDT). The account can be in the student’s or sponsoring parent’s name, supported by a notarized sponsorship affidavit, proof of family relationship, and source of funds documentation (tax acknowledgment receipts, salary certificates, or business trade licences). In addition, universities often lodge a statutory bank guarantee of EUR 300 to EUR 850 with CRMD.',
  },
  {
    question: 'Why does EduExpress strictly process for the Republic of Cyprus and NOT Northern Cyprus?',
    answer:
      'The Republic of Cyprus is a recognized sovereign European Union (EU) member state, part of the Eurozone, and a signatory to the Bologna Process. Degrees awarded by CYQAA-accredited universities in the Republic of Cyprus are European qualifications recognized across all 27 EU nations and worldwide. In contrast, Northern Cyprus (the self-declared "TRNC") is unrecognized by the international community (recognized solely by Turkey), sits outside the EU legal and banking frameworks, and does not provide EU residence rights or recognized European degrees. Many dishonest agencies exploit Bangladeshi students by promising "guaranteed Europe visas" to Northern Cyprus, which leaves students stranded in an isolated, unrecognized territory. EduExpress exclusively represents CYQAA-accredited institutions in the Republic of Cyprus.',
  },
  {
    question: 'Can Bangladeshi students work part-time in Cyprus, and what is the 6-month waiting rule?',
    answer:
      'Yes, but with statutory restrictions. Under Cypriot immigration and labour regulations, full-time non-EU degree students in the Republic of Cyprus are legally entitled to work up to 20 hours per week during academic semesters and up to 38 hours per week during institutional vacation breaks. However, by law, this work entitlement activates strictly AFTER completing your first six consecutive months of physical residence and full-time studies in Cyprus. Furthermore, student employment is restricted to designated economic sectors specified by the Ministry of Labour—principally food services, restaurants, bars, fast food delivery, hotel housekeeping, retail distribution, and gas stations. Wages typically range from EUR 5.00 to EUR 7.00 per hour (~EUR 450–600/month for 20 hrs/week).',
  },
  {
    question: 'How do tuition fees compare between public and private universities in Cyprus?',
    answer:
      'In the Republic of Cyprus, public research universities charge standardized government-regulated tuition for non-EU students: the University of Cyprus (Nicosia) and Cyprus University of Technology (CUT, Limassol) charge EUR 6,834 per year (~9.0 Lakh BDT) for undergraduate degrees, while Master’s programs cost between EUR 4,100 and EUR 10,250 for the entire degree. Private CYQAA-accredited institutions—such as the University of Nicosia (UNIC) and European University Cyprus (EUC)—charge EUR 8,500 to EUR 11,820 per year (~11.2L–15.6L BDT) for Bachelor’s degrees and EUR 8,000 to EUR 10,000 for Master’s programs (medical MD programs cost EUR 23,000–24,000/yr). Private vocational colleges offer Higher National Diplomas and Bachelor’s pathways from EUR 3,500 to EUR 5,500/year (~4.6L–7.3L BDT).',
  },
  {
    question: 'How do students remit tuition to Cypriot universities from Bangladesh via Student File?',
    answer:
      'Under Bangladesh Bank foreign exchange rules, university tuition to the Republic of Cyprus must be remitted through an authorized Student File opened at a commercial bank (e.g., Eastern Bank, Prime Bank, BRAC Bank, City Bank). Students present their unconditional Letter of Acceptance (LoA), the university tuition deposit invoice containing institutional IBAN and SWIFT BIC coordinates, attested academic documents, and passport. The bank processes an outward telegraphic transfer (SWIFT MT103) in EUR directly to the university’s institutional account in Cyprus. EduExpress provides comprehensive Student File compilation and verification at zero consultancy fee.',
  },
];

export default async function CyprusStudyCostPage() {
  const universities = await prisma.university.findMany({
    where: {
      country: { in: ['Cyprus', 'cyprus'] },
      isActive: true,
    },
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
        name: 'Cost of Studying in Cyprus from Bangladesh | Full BDT & EUR Breakdown (2027)',
        description:
          'Comprehensive tuition fee schedules across University of Cyprus, CUT, UNIC, and EUC, CRMD Entry Permit solvency requirements, monthly living expenses, and part-time work rights in the Republic of Cyprus.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/cyprus.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CYPRUS_COST_SOURCES),
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
          { name: 'Cyprus', path: '/study-in-cyprus-from-bangladesh' },
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 EUR ≈ 132 BDT · BDT 0 Upfront Fee"
        title="Cost of Studying in Cyprus from Bangladesh."
        lead="A comprehensive, evidence-first financial guide for studying in the Republic of Cyprus (European Union): tuition fee schedules across CYQAA-accredited public and private universities (EUR 3,500–10,000/yr), Civil Registry and Migration Department (CRMD) solvency requirements (EUR 7,000–8,000 in liquid bank deposits), monthly living budgets in Nicosia and Limassol (EUR & BDT), 20 hrs/week student work rights after 6 months, and essential legal distinctions between the EU Republic of Cyprus and Northern Cyprus."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=Cyprus" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check Cyprus Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/cyprus-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Cyprus Student Visa Guide
            </Link>
            <a href="#solvency-rules" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              CRMD Solvency Rules
            </a>
          </>
        }
      />

      <TrustBar destination="Cyprus" />

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
            <span>• European Union (EU) Republic of Cyprus</span>
            <span>• CYQAA Bologna Accredited Degrees</span>
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
        intro="Itemized official expenses required before departing from Dhaka to the Republic of Cyprus. All fees are paid directly to statutory authorities, designated diagnostic centers, and airlines."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Banknote className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">Exchange Rate Assumption</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-petrol-900">1 EUR ≈ 132 BDT</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Planning Assumption:</strong> Interbank foreign currency rates fluctuate daily. This guide applies 1 EUR = 132 BDT to provide a safe, transparent financial ceiling for Bangladeshi families planning their budget.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-amber-700" />
              <h3 className="text-base font-bold text-petrol-800">CRMD Solvency Benchmark</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">EUR 7,000 – 8,000</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The Civil Registry and Migration Department (CRMD) in Nicosia requires proof of EUR 7,000–8,000 (~9.2L–10.5L BDT) seasoned for 3–6 months in an Authorized Dealer bank account, backed by a sponsor affidavit.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">EduExpress Fee Guarantee</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-800">BDT 0 Upfront</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              EduExpress charges <strong>BDT 0 file-opening fees</strong>. Our standard European consultancy fee of BDT 100,000 (1 Lakh Taka) is payable <strong>100% after visa / Entry Permit issuance</strong>. Zero financial loss on refusal.
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
                <td className="p-4 font-bold text-petrol-800">CRMD Student Entry Permit (M-Visa) Fee</td>
                <td className="p-4 font-semibold">EUR 70 – EUR 140</td>
                <td className="p-4">~9,240 – 18,480 BDT</td>
                <td className="p-4 text-slate-600">Civil Registry and Migration Department (Lodged by Cypriot university on student’s behalf)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Statutory Migration Bank Guarantee (Repatriation Deposit)</td>
                <td className="p-4 font-semibold">EUR 300 – EUR 850</td>
                <td className="p-4">~39,600 – 112,200 BDT</td>
                <td className="p-4 text-slate-600">Mandatory security deposit required by CRMD; refundable upon graduation/departure</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Academic &amp; Notary Document Legalization (Dhaka)</td>
                <td className="p-4 font-semibold">3,000 – 6,000 BDT</td>
                <td className="p-4">3,000 – 6,000 BDT</td>
                <td className="p-4 text-slate-600">Education Boards, Ministry of Education (MOE) &amp; Ministry of Foreign Affairs (MOFA) Dhaka</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Police Clearance Certificate</td>
                <td className="p-4 font-semibold">500 BDT</td>
                <td className="p-4">500 BDT</td>
                <td className="p-4 text-slate-600">Bangladesh Police (Online verification portal with MOFA attestation)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Pre-Departure Medical Screening (Dhaka)</td>
                <td className="p-4 font-semibold">5,000 – 8,000 BDT</td>
                <td className="p-4">5,000 – 8,000 BDT</td>
                <td className="p-4 text-slate-600">Authorized clinic: Hepatitis B/C, HIV, Syphilis blood tests &amp; Chest X-ray for Tuberculosis</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Initial Travel &amp; Health Insurance</td>
                <td className="p-4 font-semibold">EUR 100 – EUR 180</td>
                <td className="p-4">~13,200 – 23,760 BDT</td>
                <td className="p-4 text-slate-600">International travel health policy valid until arrival registration and Cypriot student health enrollment</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka DAC to Larnaca LCA)</td>
                <td className="p-4 font-semibold">EUR 450 – EUR 700</td>
                <td className="p-4">~59,400 – 92,400 BDT</td>
                <td className="p-4 text-slate-600">Airlines (Emirates, Qatar Airways, Gulf Air, Jazeera Airways via Gulf hubs)</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">EduExpress File Opening &amp; Counseling</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0 Upfront</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0</td>
                <td className="p-4 text-xs text-emerald-800">Zero file opening charge · BDT 100,000 service fee payable 100% after visa approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: The Critical Jurisdiction Warning (Republic vs Northern Cyprus) */}
      <Section
        id="jurisdiction-warning"
        tone="sage"
        title="Critical Warning: Republic of Cyprus (EU) vs Northern Cyprus"
        intro="One of the most widespread scams in Bangladesh's study abroad market involves confusing the internationally recognized Republic of Cyprus with the unrecognized territory of Northern Cyprus."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card A: Republic of Cyprus */}
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-700" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Republic of Cyprus (South)</h3>
                <span className="text-xs font-semibold text-emerald-800">European Union Member State (Since 2004)</span>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Sovereign International Recognition:</strong> Full member state of the United Nations, European Union, and Council of Europe. Official currency is the Euro (EUR).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>CYQAA / Bologna ECTS Accreditation:</strong> Degrees strictly follow the European Higher Education Area (EHEA) standards, enabling transfer to Germany, Sweden, UK, or Canada.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>Legal EU Residence Card (Pink Slip):</strong> Issued by the Civil Registry and Migration Department (CRMD), providing legal EU resident status and Schengen mobility pathways.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓</span>
                <span><strong>EduExpress Representation:</strong> We exclusively represent and process admissions for CYQAA-accredited institutions in the Republic of Cyprus.</span>
              </li>
            </ul>
          </div>

          {/* Card B: Northern Cyprus */}
          <div className="rounded-3xl border border-red-200 bg-red-50/40 p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-red-700" />
              <div>
                <h3 className="text-lg font-bold text-red-950">Northern Cyprus (&quot;TRNC&quot;)</h3>
                <span className="text-xs font-semibold text-red-700">Unrecognized Territory • Non-EU</span>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-700">✕</span>
                <span><strong>Zero International Recognition:</strong> Not recognized by the UN or EU (recognized only by Turkey). Currency is the Turkish Lira (TRY); banking sits outside SWIFT.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-700">✕</span>
                <span><strong>No EU Legal Status:</strong> A student permit in Northern Cyprus is NOT an EU residence permit. It grants zero right to travel to EU countries or cross the UN Green Line into the Republic.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-700">✕</span>
                <span><strong>Severe Degree Transfer Barriers:</strong> Degrees from unaccredited colleges in the North are frequently rejected by European credential bodies (WES, ZAB, UK ENIC).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-700">✕</span>
                <span><strong>EduExpress Policy:</strong> We strictly DO NOT process applications for Northern Cyprus. We protect students from deceptive &quot;no-embassy easy Europe&quot; agent promises.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Currency & Banking Planning Assumptions */}
      <Section
        id="currency-banking"
        title="Currency &amp; Banking Planning Assumptions (EUR &amp; BDT)"
        intro="Understanding commercial bank Telegraphic Transfer (TT) selling rates, Bangladesh Bank Student File regulations, and foreign exchange remitting limits."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Scale className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">Conservative Planning vs Interbank Rates</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              While open-market online converters display interbank mid-rates, commercial banks in Bangladesh execute foreign remittance at the official <strong>Telegraphic Transfer (TT) Selling Rate</strong> plus foreign exchange transaction duties.
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Planning Baseline Rate:</span>
                <span className="font-bold text-petrol-800">1 EUR ≈ 132 BDT</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Public University Tuition (€6,834):</span>
                <span className="font-bold text-emerald-800">~9.02 Lakh BDT</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">CRMD Living Solvency (€7,500):</span>
                <span className="font-bold text-petrol-800">~9.90 Lakh BDT</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              * EduExpress recommends maintaining an additional 3–5% currency cushion in your sponsor account to absorb foreign exchange rate fluctuations during visa review.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Landmark className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">Bangladesh Bank Student File Guidelines</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Under Bangladesh Bank Foreign Exchange Guidelines, university tuition to accredited institutions in Cyprus must be remitted legally through an Authorized Dealer commercial bank:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Authorized Dealer (AD) Banks:</strong> Eastern Bank, Prime Bank, BRAC Bank, City Bank, Dhaka Bank, or Standard Chartered.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Required Dossier:</strong> Unconditional Letter of Acceptance (LoA), official Cypriot university tuition invoice, verified academic certificates, and student passport copy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>SWIFT Wire Transfer (MT103):</strong> Electronic wire in EUR directly to the institution’s official bank account in Cyprus. Bank provides an authenticated SWIFT copy for CRMD visa filing.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Tuition Fees Across Cypriot Universities */}
      <Section
        id="tuition-fees"
        tone="sage"
        title="Tuition Fees by University &amp; Degree Level"
        intro="Annual tuition fee schedules across public research universities, prestigious private institutions, and vocational colleges in the Republic of Cyprus."
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
                <th className="p-4">Accreditation &amp; Highlights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-cyprus" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Cyprus (UCY)
                  </Link>
                </td>
                <td className="p-4">Nicosia</td>
                <td className="p-4">Bachelor’s (Non-EU UG)</td>
                <td className="p-4 font-semibold">€6,834 / year</td>
                <td className="p-4 font-bold text-petrol-800">~9.02 Lakh BDT</td>
                <td className="p-4 text-slate-600">Top-ranked public research university · QS #450 · CYQAA Accredited</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-cyprus" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Cyprus (UCY)
                  </Link>
                </td>
                <td className="p-4">Nicosia</td>
                <td className="p-4">Master’s (MSc / MA)</td>
                <td className="p-4 font-semibold">€4,100 – €10,250 total</td>
                <td className="p-4 font-bold text-petrol-800">~5.41L – 13.53L BDT (total)</td>
                <td className="p-4 text-slate-600">Computer Science, Civil Engineering, MBA, Finance · 90–120 ECTS</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/cyprus-university-of-technology" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    Cyprus University of Technology (CUT)
                  </Link>
                </td>
                <td className="p-4">Limassol</td>
                <td className="p-4">Bachelor’s (STEM / Tech)</td>
                <td className="p-4 font-semibold">€6,834 / year</td>
                <td className="p-4 font-bold text-petrol-800">~9.02 Lakh BDT</td>
                <td className="p-4 text-slate-600">Public technological flagship · Leading maritime, AI &amp; engineering labs</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/cyprus-university-of-technology" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    Cyprus University of Technology (CUT)
                  </Link>
                </td>
                <td className="p-4">Limassol</td>
                <td className="p-4">Master’s Degrees</td>
                <td className="p-4 font-semibold">€5,125 total</td>
                <td className="p-4 font-bold text-petrol-800">~6.76 Lakh BDT (total)</td>
                <td className="p-4 text-slate-600">Highly cost-effective European Master’s degree schedule</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-nicosia" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Nicosia (UNIC)
                  </Link>
                </td>
                <td className="p-4">Nicosia</td>
                <td className="p-4">Bachelor’s (Business / Tech)</td>
                <td className="p-4 font-semibold">€9,000 – €11,820 / year</td>
                <td className="p-4 font-bold text-petrol-800">~11.88L – 15.60L BDT</td>
                <td className="p-4 text-slate-600">Largest university in Cyprus · Global leader in Blockchain &amp; Digital Currency</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/university-of-nicosia" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    University of Nicosia (UNIC)
                  </Link>
                </td>
                <td className="p-4">Nicosia</td>
                <td className="p-4">Doctor of Medicine (MD)</td>
                <td className="p-4 font-semibold">€24,000 / year</td>
                <td className="p-4 font-bold text-petrol-800">~31.68 Lakh BDT</td>
                <td className="p-4 text-slate-600">6-year EU medical degree · Affiliated with St George’s, University of London</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <Link href="/universities/european-university-cyprus" className="text-petrol-800 hover:text-emerald-800 hover:underline">
                    European University Cyprus (EUC)
                  </Link>
                </td>
                <td className="p-4">Nicosia</td>
                <td className="p-4">Bachelor’s / Master’s</td>
                <td className="p-4 font-semibold">€8,910 – €9,240 / year</td>
                <td className="p-4 font-bold text-petrol-800">~11.76L – 12.20L BDT</td>
                <td className="p-4 text-slate-600">Part of Galileo Global Education · QS 5-Star institution · CYQAA Accredited</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">CYQAA-Accredited Private Colleges</td>
                <td className="p-4">Nicosia / Larnaca / Paphos</td>
                <td className="p-4">Higher Diplomas &amp; Bachelor’s</td>
                <td className="p-4 font-semibold">€3,500 – €5,500 / year</td>
                <td className="p-4 font-bold text-petrol-800">~4.62L – 7.26L BDT</td>
                <td className="p-4 text-slate-600">Vocational Hospitality, Business Administration, Culinary Arts · MQF 5/6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: CRMD & Migration Solvency Rules */}
      <Section
        id="solvency-rules"
        title="CRMD (Civil Registry &amp; Migration Department) Solvency Rules"
        intro="Statutory financial maintenance benchmarks and mandatory bank guarantee protocols required for non-EU student Entry Permits."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Solvency Pillar 1: Maintenance Funds */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Wallet className="size-6 text-emerald-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Statutory Subsistence Benchmark</h3>
                <span className="text-xs font-semibold text-emerald-800">CRMD Non-EU Student Directive</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              The Migration Department requires international students to show adequate personal or family financial liquidity to support living costs without resorting to illegal employment:
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory Living Baseline:</span>
                <span className="font-bold text-petrol-800">€600 – €700 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">12-Month Solvency Threshold:</span>
                <span className="font-bold text-emerald-800">€7,000 – €8,000</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Approx. BDT Equivalent (@ 132):</span>
                <span className="font-bold text-petrol-800">~9.24L – 10.56L BDT</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              <strong>Account Requirements:</strong> Funds should be maintained in an Authorized Dealer bank in Bangladesh for at least 3 to 6 months with clear transaction consistency.
            </p>
          </div>

          {/* Solvency Pillar 2: Migration Bank Guarantee */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <FileCheck className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Mandatory Bank Guarantee &amp; Attestations</h3>
                <span className="text-xs font-semibold text-petrol-800">Cypriot Institutional Entry Process</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              In Cyprus, the university itself files your visa dossier directly to the Migration Department in Nicosia. Key compliance mandates include:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Migration Bank Guarantee:</strong> A security deposit of €300 to €850 deposited with CRMD (often collected by the university and refunded upon departure or completion).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>MOFA Attestation:</strong> Original educational certificates, police clearance, and medical test reports must be authenticated by the Ministry of Foreign Affairs (MOFA) Dhaka.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Parental Sponsorship Affidavit:</strong> Notarized declaration of financial sponsorship with sponsor tax returns, salary certificates, or business trade licences.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Advance Tuition Payment:</strong> Minimum 50% to 100% of 1st-year tuition wired via Student File before the Entry Permit is issued.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 6: Monthly Living Costs in Cyprus */}
      <Section
        id="living-costs"
        tone="sage"
        title="Monthly Living Costs Breakdown in Cyprus"
        intro="Realistic monthly living expenditure for international students in Nicosia, Limassol, Larnaca, and Paphos."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Estimated Monthly (EUR)</th>
                <th className="p-4">Monthly BDT (@ 132 BDT)</th>
                <th className="p-4">Practical Guidance for Bangladeshi Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Shared Apartment / Student Room</td>
                <td className="p-4 font-semibold">€250 – €400</td>
                <td className="p-4 font-bold text-petrol-800">33,000 – 52,800 BDT</td>
                <td className="p-4 text-slate-600">Share a 2- or 3-bedroom flat in Nicosia or Larnaca; Limassol rentals run 25–40% higher due to international tech demand</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Groceries &amp; Cooking at Home</td>
                <td className="p-4 font-semibold">€180 – €260</td>
                <td className="p-4 font-bold text-petrol-800">23,760 – 34,320 BDT</td>
                <td className="p-4 text-slate-600">Shop at discount supermarkets (Lidl, AlfaMega, Metro) and weekend municipal fruit/vegetable farmers&apos; markets</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Public Transportation (Bus Pass)</td>
                <td className="p-4 font-semibold">€15 – €20</td>
                <td className="p-4 font-bold text-petrol-800">1,980 – 2,640 BDT</td>
                <td className="p-4 text-slate-600">Cyprus Public Transport offers a 50% student discount; monthly student bus pass in Nicosia/Larnaca is only €15–€20</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Utilities (Electricity, Water, Garbage)</td>
                <td className="p-4 font-semibold">€50 – €80</td>
                <td className="p-4 font-bold text-petrol-800">6,600 – 10,560 BDT</td>
                <td className="p-4 text-slate-600">Split among flatmates; electricity costs rise during hot summer months (July–August) due to air conditioning</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Mobile Internet &amp; Telecom (5G SIM)</td>
                <td className="p-4 font-semibold">€15 – €25</td>
                <td className="p-4 font-bold text-petrol-800">1,980 – 3,300 BDT</td>
                <td className="p-4 text-slate-600">Prepaid student mobile plans from Cyta, Epic, or Primetel with 30GB+ high-speed data and EU roaming</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Personal Care &amp; Miscellaneous</td>
                <td className="p-4 font-semibold">€50 – €90</td>
                <td className="p-4 font-bold text-petrol-800">6,600 – 11,880 BDT</td>
                <td className="p-4 text-slate-600">Gym memberships, academic supplies, personal toiletries, and occasional student social activities</td>
              </tr>
              <tr className="bg-canvas-soft font-bold text-petrol-900">
                <td className="p-4 text-sm">Total Monthly Student Living Budget</td>
                <td className="p-4 text-sm font-extrabold text-petrol-800">€560 – €875 / mo</td>
                <td className="p-4 text-sm font-extrabold text-petrol-800">~74,000 – 115,500 BDT</td>
                <td className="p-4 text-xs font-semibold text-slate-600">Significantly lower than UK (£1,136–£1,483) or Netherlands (€900–€1,200)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 7: Part-Time Work Rights & Labour Regulations */}
      <Section
        id="work-rights"
        title="Part-Time Work Rights &amp; Department of Labour Regulations"
        intro="Legal framework for student employment in the Republic of Cyprus: the critical 6-month waiting period, designated job sectors, and earning expectations."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card A: The 6-Month Moratorium */}
          <div className="rounded-3xl border border-amber-300 bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Clock className="size-6 text-amber-700" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">The Mandatory 6-Month Waiting Period</h3>
                <span className="text-xs font-semibold text-amber-700">Department of Labour Statutory Rule</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Unlike the UK where students can work immediately, <strong>Cypriot law strictly prohibits non-EU students from working during their first six consecutive months of study</strong> in the country.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <ShieldAlert className="size-4 shrink-0 text-amber-700 mt-0.5" />
                <span><strong>First 6 Months:</strong> Full-time academic attendance required. Working without statutory authorization risks immediate cancellation of your Pink Slip and deportation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>After Month 6:</strong> Once 6 months of verified full-time study are completed, students can sign a standardized student employment contract certified by the District Labour Office.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Permitted Hours:</strong> Maximum 20 hours per week during academic semesters; up to 38 hours per week during official semester holidays.</span>
              </li>
            </ul>
          </div>

          {/* Card B: Wage & Sector Reality */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-xs">
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-emerald-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Designated Sectors &amp; Earning Potential</h3>
                <span className="text-xs font-semibold text-emerald-800">Ministry of Labour Approved Categories</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Non-EU student employment is legally restricted to specific designated sectors where labour shortages exist:
            </p>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory Hourly Wage:</span>
                <span className="font-bold text-petrol-800">€5.00 – €7.00 / hour</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Monthly Gross (20 hrs/wk @ €6.00):</span>
                <span className="font-bold text-emerald-800">~€480 – €560 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Approx. BDT Equivalent (@ 132):</span>
                <span className="font-bold text-petrol-800">~63,360 – 73,920 BDT / month</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              <strong>Approved Sectors:</strong> Food service (waiters, kitchen helpers), food delivery (Wolt / Foody riders), hotel housekeeping, retail logistics, gas stations, and agricultural processing.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 8: EduExpress Transparent 100% After Visa Fee Structure */}
      <Section
        id="fee-comparison"
        tone="sage"
        title="EduExpress Fee Policy vs Conventional Consultancies"
        intro="We operate with total transparency. EduExpress charges zero upfront file-opening fees, collecting our European consultancy service charge only after your Cyprus Entry Permit is approved."
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
                <td className="p-4 font-bold text-petrol-800">File Opening / Initial Assessment</td>
                <td className="p-4 text-red-700 font-semibold">BDT 20,000 – 50,000 (Non-refundable)</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-800">BDT 0 (100% Free Counseling)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Jurisdiction Verification (EU vs North)</td>
                <td className="p-4 text-red-700">Frequently route students to unrecognized Northern Cyprus</td>
                <td className="p-4 bg-emerald-50/50 font-bold text-emerald-900">Exclusively CYQAA-accredited EU Republic of Cyprus</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Tuition Remittance Guidance (Student File)</td>
                <td className="p-4 text-slate-600">Often pushed through unsafe informal hundi channels</td>
                <td className="p-4 bg-emerald-50/50 text-emerald-900">Legal SWIFT MT103 wire transfers via Bangladesh Bank AD banks</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">CRMD Visa Dossier Compilation</td>
                <td className="p-4 text-slate-600">Generic document lists with high refusal risks</td>
                <td className="p-4 bg-emerald-50/50 text-emerald-900">Full audit of MOFA attestations, medical checks, and bank guarantees</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Service Fee Payment Timing</td>
                <td className="p-4 text-red-700 font-semibold">100% demanded upfront before visa submission</td>
                <td className="p-4 bg-emerald-50/50 font-extrabold text-emerald-800">
                  100% After Visa Approval (BDT 100,000)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Financial Protection on Refusal</td>
                <td className="p-4 text-red-700">Agency keeps all upfront fees; student absorbs loss</td>
                <td className="p-4 bg-emerald-50/50 font-semibold text-emerald-900">Zero service fee owed if Entry Permit is refused</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 9: Comprehensive FAQ Section */}
      <Section
        id="faq"
        title="Frequently Asked Questions: Cost of Studying in Cyprus"
        intro="Clear, verified answers to common financial, visa solvency, and student work questions asked by Bangladeshi applicants."
      >
        <FaqBlock items={CYPRUS_COST_FAQS} />
      </Section>

      {/* Statutory Citations */}
      <section aria-label="Official statutory sources" className="border-t border-rule bg-canvas-soft py-10">
        <div className={kit.wrap}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Landmark size={14} aria-hidden="true" />
            <span>Official Regulatory &amp; Statutory Sources</span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CYPRUS_COST_SOURCES.map((source) => (
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
            <h2 className="mt-2 text-3xl font-extrabold text-petrol-800">Assess Your Education Fit for Cyprus</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Find out whether the Republic of Cyprus’s European Union degrees, CYQAA accreditation, and affordable tuition fee structure align with your academic profile and family budget. Receive a personalized recommendation in 1 working day.
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

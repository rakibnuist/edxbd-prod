import Link from 'next/link';
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  Award,
  Banknote,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Bus,
  CheckCircle2,
  Clock,
  Compass,
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
import { FaqBlock, JsonLd, PageHero, Section, TrustBar } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/thailand-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const THAILAND_COST_SOURCES = [
  {
    label: 'Ministry of Higher Education, Science, Research and Innovation (MHESI Thailand)',
    href: 'https://www.mhesi.go.th/',
    note: 'Statutory governmental authority governing university charters, academic accreditation standards, and international degree recognition across Thailand.',
  },
  {
    label: 'Royal Thai Embassy, Dhaka — Consular & Visa Section',
    href: 'https://dhaka.thaiembassy.org/',
    note: 'Official diplomatic mission issuing Non-Immigrant ED Study Visas for Bangladeshi students admitted to recognized Thai universities.',
  },
  {
    label: 'Immigration Bureau of Thailand (สำนักงานตรวจคนเข้าเมือง)',
    href: 'https://www.immigration.go.th/',
    note: 'Statutory immigration authority overseeing 90-day residence reporting (TM.47), study stay extensions (TM.7), and legal student residency compliance.',
  },
  {
    label: 'Office of the Civil Service Commission (OCSC Thailand)',
    href: 'https://www.ocsc.go.th/',
    note: 'State authority establishing national degree equivalence, public curriculum benchmarking, and civil service academic recognitions.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal SWIFT wire remittances (Form TM) to Thai university bank accounts and international Education Card quotas.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Thailand from Bangladesh 2027 | EduExpress',
    description:
      'Thailand study cost breakdown for Bangladeshi students: university tuition (THB 110k–350k/yr), ED visa financial proof, living costs, and fellowships.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('thailand', 'Cost of Studying in Thailand from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'How much does it cost to study in Thailand in Bangladeshi Taka (BDT)?',
    answer:
      'Tuition in Thailand is billed in Thai Baht (THB) and represents exceptional value within Southeast Asia. English-taught Bachelor programs at top public universities (Chulalongkorn, Mahidol, Thammasat) range from THB 110,000 to THB 250,000 per year (approximately 4.07 lakh to 9.25 lakh BDT at 1 THB ≈ 3.7 BDT). International Master’s and PhD programs range from THB 200,000 to THB 384,000 per year (~7.4 lakh to 14.2 lakh BDT), before lucrative research fellowships. Monthly living costs in Bangkok average THB 12,000 to THB 20,000 (approx. 44,400 to 74,000 BDT), bringing the typical first-year undergraduate total budget (tuition + 12 months comprehensive living) to 11.5 lakh to 17.5 lakh BDT.',
  },
  {
    question: 'What is the Non-Immigrant ED Visa bank solvency requirement for Thailand?',
    answer:
      'The Royal Thai Embassy in Dhaka requires non-immigrant student visa applicants to demonstrate verifiable financial solvency. Families must provide an official Bank Solvency Certificate and 6 months of certified bank statements showing a consistent closing balance of at least 5.0 lakh to 8.0 lakh BDT (or THB 150,000 to THB 200,000 equivalent) under the name of the student or legal parent sponsor. Accounts must show healthy transaction history without unexplained sudden deposits, accompanied by an Affidavit of Financial Support and sponsor tax returns (TIN & Challans).',
  },
  {
    question: 'How do Bangladeshi families legally transfer tuition fees to Thailand?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, educational remittances to Thai universities must be conducted through an Authorized Dealer (AD) scheduled commercial bank by opening an official Student File. Using the university unconditional acceptance certificate, fee invoice, and attested certificates, the bank executes a SWIFT telegraphic transfer (Form TM) directly to the Thai university’s verified bank account. The bank also issues an international Education Card with an annual forex entitlement up to USD 12,000 equivalent for accommodation and living expenses in Bangkok.',
  },
  {
    question: 'Can international students work part-time in Thailand on a student visa?',
    answer:
      'Under Thai immigration regulations, international students holding a Non-Immigrant ED Visa are legally prohibited from working off-campus in commercial or retail jobs. However, universities actively employ postgraduate students for on-campus Graduate Assistantships, Research Assistantships (RA), and Teaching Assistantships (TA), which offer monthly stipends of THB 6,000 to THB 12,000 alongside partial or full tuition waivers. Students are also permitted to undertake formal academic internships required by their degree curriculum.',
  },
  {
    question: 'Are full scholarships available for Bangladeshi students in Thailand?',
    answer:
      'Yes. Thailand offers prestigious, highly funded fellowship programs. Most prominent is the Chulalongkorn University Graduate Scholarship for Non-ASEAN Countries, which covers 100% of tuition, a monthly living stipend of THB 16,000, accommodation allowance, and round-trip airfare from Dhaka. The Asian Institute of Technology (AIT) offers competitive AIT Fellowships and the Bangabandhu Chair Fellowship for Bangladeshi postgraduate engineers, while Thammasat University’s SIIT provides the Excellent Foreign Students (EFS) scholarship covering full or half tuition.',
  },
  {
    question: 'What is EduExpress’s service fee guarantee for Thailand admissions and visas?',
    answer:
      'EduExpress operates with an evidence-first, zero-risk fee guarantee: BDT 0 upfront file-opening fee, and an EduExpress service fee of BDT 100,000 (1 Lakh Taka) payable 100% strictly after your Thai Non-Immigrant ED Visa is approved. All third-party statutory fees (consular visa fee, medical test, university application/tuition charges, and airfare) are paid directly by the student to the official recipients with documented receipts.',
  },
];

export default async function ThailandStudyCostPage() {
  const thailandUnis = await prisma.university.findMany({
    where: {
      country: { in: ['Thailand', 'thailand'] },
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
        name: 'Cost of Studying in Thailand from Bangladesh 2027 | Bangkok Tuition & Living Breakdown',
        description:
          'Evidence-first cost analysis for Bangladeshi students: Bangkok public university tuition (THB 110k–350k/yr), Non-Immigrant ED visa proof, living costs, and AIT/Chula fellowships.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/thailand.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(THAILAND_COST_SOURCES),
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
          { name: 'Thailand', path: '/study-in-thailand-from-bangladesh' },
          { name: 'Cost Guide' },
        ]}
        eyebrow="Evidence-First Tuition & Living Analysis · Planning Assumption: 1 THB ≈ 3.7 BDT · ASEAN Education Hub"
        title="Cost of Studying in Thailand from Bangladesh (2027 Guide)"
        lead="Comprehensive financial breakdown for world-class higher education in Bangkok: MHESI-accredited public university tuition (THB 110,000–350,000/yr for Business & STEM), Royal Thai Embassy Non-Immigrant ED Visa solvency rules, Bangkok vs Rangsit living budgets, and fully funded fellowship pathways at Chulalongkorn, Mahidol, and AIT."
        reviewed="November 27, 2026"
        actions={
          <>
            <Link href="/apply?country=Thailand" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Thailand Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/thailand-student-visa-bangladesh"
              className="ed-btn ed-btn-outline min-h-[52px] px-6"
            >
              Thailand ED Visa Guide
            </Link>
            <Link
              href="/study-in-thailand-from-bangladesh"
              className="ed-btn ed-btn-outline min-h-[52px] px-6"
            >
              Explore Thailand Country Pillar
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Module 1: Quick Facts & Planning Assumption */}
      <Section
        id="quick-facts"
        tone="white"
        title="Thailand Study Cost at a Glance (2027 Planning Assumption)"
        intro="Planning Assumption: All currency conversions utilize 1 THB (Thai Baht) ≈ 3.7 BDT (and 1 USD ≈ 33–35 THB). Academic fees are billed semester-wise by accredited universities in Thai Baht."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <Building2 size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Undergraduate Tuition
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              THB 110k – 250k <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              ~4.1L – 9.3L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              International Bachelor tracks in BBA, AI, Robotics &amp; Computer Engineering at Chula, Mahidol &amp; Thammasat.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <GraduationCap size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Postgraduate Tuition
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              THB 200k – 384k <span className="text-xs font-normal text-slate-500">/ yr</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-800">
              ~7.4L – 14.2L BDT / year
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              AIT, Chulalongkorn &amp; SIIT Master/PhD tracks. Substantially offset by institutional research fellowships.
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
              THB 12k – 20k <span className="text-xs font-normal text-slate-500">/ mo</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-900">
              ~44,400 – 74,000 BDT / mo
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Student condo/dorm (THB 5k–9k), delicious food courts (THB 4.5k–7k), student BTS/MRT pass &amp; SIM.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ED Visa Bank Solvency
            </span>
            <p className="mt-1 font-display text-xl font-bold text-petrol-800">
              5.0L – 8.0L BDT
            </p>
            <p className="mt-1 text-xs font-semibold text-blue-900">
              ~THB 150,000 – 200,000
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Maintained 3–6 months in sponsor bank account in Bangladesh with certified statements and tax challans.
            </p>
          </div>
        </div>

        {/* Proximity & Currency Callout */}
        <div className="mt-6 rounded-2xl border border-rule bg-canvas-soft p-5">
          <div className="flex items-start gap-3">
            <Compass className="mt-0.5 size-5 shrink-0 text-petrol-800" />
            <div className="text-xs leading-relaxed text-slate-700">
              <strong className="text-petrol-800">Geographical Proximity &amp; Regional Advantage:</strong> Bangkok is located just 2.5 hours by direct flight from Dhaka (DAC &rarr; BKK/DMK via Biman Bangladesh, US-Bangla, or Thai Airways). This proximity makes Thailand exceptionally convenient for family visits and emergencies compared to long-haul western destinations, while maintaining strict European- and American-accredited academic curricula.
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Complete First-Year Comprehensive Budget Breakdown */}
      <Section
        id="first-year-budget"
        tone="sage"
        title="Complete First-Year Itemized Budget (Pre-Departure to Bangkok Arrival)"
        intro="A transparent, line-by-line financial roadmap detailing every mandatory outlay for a Bangladeshi student beginning undergraduate or postgraduate studies in Thailand."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Cost Category</th>
                <th className="p-4">Item &amp; Statutory Purpose</th>
                <th className="p-4">Estimated Range in THB</th>
                <th className="p-4">Equivalent in BDT</th>
                <th className="p-4">Payable To &amp; Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {/* Pre-Departure Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 1: Pre-Departure Documentation, Attestation &amp; Royal Thai Embassy Visa
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Academic Attestation</td>
                <td className="p-4">Education Board, Ministry of Education &amp; MOFA Dhaka attestation</td>
                <td className="p-4">THB 1,200 – THB 1,800</td>
                <td className="p-4">4,500 – 6,600 BDT</td>
                <td className="p-4 text-slate-500">Bangladesh Government challans (Direct)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Medical Fitness &amp; Police Clearance</td>
                <td className="p-4">Standard medical certificate (syphilis, TB, hepatitis screening) &amp; police clearance</td>
                <td className="p-4">THB 1,500 – THB 2,500</td>
                <td className="p-4">5,500 – 9,200 BDT</td>
                <td className="p-4 text-slate-500">Diagnostic center &amp; Bangladesh Police</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Non-Immigrant ED Visa Fee</td>
                <td className="p-4">Single-Entry Non-Immigrant ED Study Visa fee</td>
                <td className="p-4">THB 2,200 (approx. BDT 8,000)</td>
                <td className="p-4">8,000 BDT</td>
                <td className="p-4 text-slate-500">Royal Thai Embassy Dhaka / VFS Thai Visa Centre</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Airfare (One-Way)</td>
                <td className="p-4">Direct flight Dhaka to Bangkok (DAC &rarr; BKK/DMK, 2.5 hrs)</td>
                <td className="p-4">THB 8,000 – THB 12,000</td>
                <td className="p-4">29,600 – 44,400 BDT</td>
                <td className="p-4 text-slate-500">Airlines (Biman, US-Bangla, Thai Airways)</td>
              </tr>

              {/* Institutional Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 2: First-Year Academic Tuition Fees (Remitted via Student File)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Undergraduate Tuition (Year 1)</td>
                <td className="p-4">International BBA, AI, Robotics, Engineering (Chula, Mahidol, Thammasat)</td>
                <td className="p-4 font-bold text-petrol-800">THB 150,000 – THB 220,000 / yr</td>
                <td className="p-4 font-bold text-petrol-800">5.55 – 8.14 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university account via SWIFT Form TM</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-emerald-800">Postgraduate Tuition (Year 1)</td>
                <td className="p-4">AIT / Chula / SIIT Master &amp; PhD international graduate faculties</td>
                <td className="p-4 font-bold text-emerald-800">THB 200,000 – THB 384,000 / yr</td>
                <td className="p-4 font-bold text-emerald-800">7.40 – 14.20 Lakh BDT</td>
                <td className="p-4 text-slate-500">Direct university account via SWIFT Form TM</td>
              </tr>

              {/* On-Arrival & Residence Outlays */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 3: Bangkok On-Arrival Statutory &amp; Living Maintenance (12 Months)
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Visa Extension (TM.7)</td>
                <td className="p-4">Annual study permit extension at Chaengwattana Immigration Bureau</td>
                <td className="p-4">THB 1,900 (Statutory state fee)</td>
                <td className="p-4">7,030 BDT</td>
                <td className="p-4 text-slate-500">Immigration Bureau of Thailand</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Mandatory Health Insurance</td>
                <td className="p-4">Annual university group health insurance plan meeting immigration rules</td>
                <td className="p-4">THB 3,500 – THB 6,000 / yr</td>
                <td className="p-4">12,950 – 22,200 BDT</td>
                <td className="p-4 text-slate-500">University health service / Thai insurer</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Accommodation (12 Months)</td>
                <td className="p-4">Furnished student condo/dorm with AC (THB 5,000–8,500/mo)</td>
                <td className="p-4">THB 60,000 – THB 102,000</td>
                <td className="p-4">2.22 – 3.77 Lakh BDT</td>
                <td className="p-4 text-slate-500">Condo landlord / University dormitory</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food &amp; Canteen Meals (12 Months)</td>
                <td className="p-4">Campus dining canteens, street food, groceries (THB 5,000–8,000/mo)</td>
                <td className="p-4">THB 60,000 – THB 96,000</td>
                <td className="p-4">2.22 – 3.55 Lakh BDT</td>
                <td className="p-4 text-slate-500">University canteens (THB 40–70/meal), 7-Eleven, Big C</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">BTS/MRT, Utilities &amp; 4G SIM</td>
                <td className="p-4">Student Rabbit Card transit pass + room AC electricity + unlimited 5G SIM</td>
                <td className="p-4">THB 24,000 – THB 42,000</td>
                <td className="p-4">88,800 – 155,400 BDT</td>
                <td className="p-4 text-slate-500">BTS/MRT transit, PEA electricity, AIS / True</td>
              </tr>

              {/* EduExpress Fee Policy */}
              <tr className="bg-sand-50/50">
                <td colSpan={5} className="p-3 font-bold text-petrol-900">
                  Phase 4: EduExpress Advisory &amp; Visa Guarantee
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">EduExpress Service Fee</td>
                <td className="p-4">
                  Full admission shortlisting, scholarship nomination &amp; Non-Immigrant ED Visa guidance.
                  <span className="block font-bold text-emerald-800">BDT 0 Upfront · 100% After Visa Approval</span>
                </td>
                <td className="p-4 font-bold text-petrol-800">BDT 100,000</td>
                <td className="p-4 font-bold text-emerald-800">1.00 Lakh BDT</td>
                <td className="p-4 text-emerald-800 font-bold">Strictly After Visa Approval</td>
              </tr>

              {/* Grand Totals */}
              <tr className="bg-petrol-800 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year Undergraduate Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">THB 310,000 – THB 480,000</td>
                <td className="p-4 text-sm text-sand-100">11.5 – 17.8 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Includes 12 full months living in Bangkok</td>
              </tr>
              <tr className="bg-petrol-900 font-bold text-white">
                <td className="p-4 text-sm" colSpan={2}>
                  Total First-Year Postgraduate Budget (Tuition + 12 Months Living + Statutory Fees)
                </td>
                <td className="p-4 text-sm text-emerald-300">THB 380,000 – THB 640,000</td>
                <td className="p-4 text-sm text-sand-100">14.0 – 23.7 Lakh BDT</td>
                <td className="p-4 text-xs font-normal text-sand-200">Before Chula / AIT / SIIT fellowship reductions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 3: University-by-University Tuition Matrix */}
      <Section
        id="universities-tuition"
        tone="white"
        title="Tuition Matrix: Premier Thai Public &amp; Chartered Universities (2026/27 Intake)"
        intro="Official tuition schedules for international English-medium undergraduate and graduate programs across verified Thai research institutions."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {thailandUnis.map((uni) => (
            <div
              key={uni.slug}
              className="flex flex-col justify-between rounded-3xl border border-rule bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-900">
                      <ShieldCheck size={13} /> MHESI Chartered &amp; Accredited
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={13} /> {uni.city || 'Bangkok'}, Thailand
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-canvas-soft p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tuition Range Benchmark
                  </span>
                  <p className="mt-1 text-sm font-bold text-emerald-800">
                    {uni.tuition || 'THB 110,000 – THB 350,000 / year'}
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
                      <li className="text-slate-500">Programs updated dynamically per academic cycle</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-rule pt-4 text-xs">
                <span className="text-slate-500">UGC Recognized · Global Rankings</span>
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

      {/* Module 4: High-Value Fellowships & Scholarships */}
      <Section
        id="scholarships"
        tone="sage"
        title="High-Value Scholarships &amp; Fellowships for Bangladeshi Students"
        intro="Thailand features some of Asia’s most generous international fellowships, significantly lowering or entirely eliminating degree costs for qualified scholars."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Chulalongkorn Graduate Scholarship for Non-ASEAN
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Flagship fully funded scholarship offered by Thailand’s #1 ranked university for outstanding international postgraduate students:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• <strong>100% Tuition Waiver:</strong> Covers all university and faculty tuition fees.</li>
              <li>• <strong>Monthly Living Allowance:</strong> THB 16,000/month stipend (~59,000 BDT/mo).</li>
              <li>• <strong>Accommodation:</strong> Subsidized international student housing.</li>
              <li>• <strong>Airfare:</strong> Direct return economy flight Dhaka &harr; Bangkok.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-petrol-100 text-petrol-900">
              <GraduationCap size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              AIT Fellowships &amp; Bangabandhu Chair
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Asian Institute of Technology (AIT) maintains a special historic endowment partnership with Bangladesh:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• <strong>AIT Merit Fellowships:</strong> Subsidizes 25% to 75% of tuition for qualified Master and PhD applicants.</li>
              <li>• <strong>Bangabandhu Chair Fellowship:</strong> Full doctoral scholarship established by the Government of Bangladesh for energy/climate research.</li>
              <li>• <strong>Research Assistantships:</strong> Faculty research grants funding living stipends.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              SIIT Excellent Foreign Students (EFS) Scholarship
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Offered by the Sirindhorn International Institute of Technology at Thammasat University for STEM fields:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• <strong>Full Tuition Coverage:</strong> 100% tuition and educational support fees waiver.</li>
              <li>• <strong>Living Allowance:</strong> THB 10,000/month living stipend for Master/PhD.</li>
              <li>• <strong>Health Insurance:</strong> Comprehensive medical insurance coverage.</li>
              <li>• <strong>Eligible Fields:</strong> AI, Computer Engineering, Data Science, Civil &amp; Mechanical.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 5: Non-Immigrant ED Visa & Bank Solvency Protocols */}
      <Section
        id="visa-solvency"
        tone="white"
        title="Thailand Non-Immigrant ED Visa: Bank Solvency &amp; Remittance Rules"
        intro="The Royal Thai Embassy in Dhaka enforces clear documentation of financial sustainability and ministerial acceptance before issuing student visas."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Statutory Solvency Benchmark */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-900">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Statutory Bank Solvency Benchmark</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              To obtain the Single-Entry Non-Immigrant ED Visa from the Royal Thai Embassy in Dhaka, applicants must satisfy consular financial verification:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Minimum Solvency Balance:</span>
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  5.0 Lakh – 8.0 Lakh BDT (~THB 150,000 – 200,000)
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Maintained in a scheduled commercial bank account in Bangladesh for at least 3 to 6 months prior to application.
                </p>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Documentary Requirements:</span>
                <ul className="mt-1.5 space-y-1 text-slate-600">
                  <li>• Official Bank Solvency Certificate and 6-month certified account statements.</li>
                  <li>• Notarized Affidavit of Financial Support from legal parent sponsor.</li>
                  <li>• Sponsor&apos;s TIN certificates and last 2 years of tax payment challans.</li>
                  <li>• Clean police clearance certificate attested by MOFA Dhaka.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-rule bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">Immigration Extension (TM.7) &amp; 90-Day Report (TM.47):</span>
                <p className="mt-1 text-slate-600">
                  Upon landing on the 90-day ED Visa, students apply for a 1-year study extension (TM.7, THB 1,900 fee) at Chaengwattana Immigration Bureau, Bangkok. Every 90 days, students file the free TM.47 residence notification.
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
              All tuition remittances to Thailand must comply with Bangladesh Bank foreign exchange circulars:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">1. Formal Student File Opening:</strong>
                <p className="mt-1 text-slate-600">
                  Your parent opens an official Student File at an Authorized Dealer (AD) bank (e.g., City Bank, Eastern Bank, BRAC Bank) using your unconditional Thai acceptance letter and fee invoice.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">2. SWIFT Telegraphic Transfer (Form TM):</strong>
                <p className="mt-1 text-slate-600">
                  Tuition is wired directly to the Thai university&apos;s verified bank account via SWIFT telegraphic transfer under Form TM. The bank issues a SWIFT MT103 confirmation slip required for consular visa processing.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <strong className="text-petrol-800">3. International Education Card Quota:</strong>
                <p className="mt-1 text-slate-600">
                  Under FE Circular No. 37, banks issue an international debit/credit card with an annual foreign exchange quota up to USD 12,000 equivalent for accommodation and living expenses in Bangkok.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 6: Monthly Living Cost Breakdown in Bangkok Metropolitan Area */}
      <Section
        id="living-costs"
        tone="sage"
        title="Monthly Living Cost Breakdown in Bangkok Metropolitan Area"
        intro="Living costs in Thailand are among the most economical in Asia. Learn how campus location impacts your monthly budget."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft font-bold uppercase tracking-wider text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Central Bangkok (Chulalongkorn)</th>
                <th className="p-4">Salaya Hub (Mahidol)</th>
                <th className="p-4">Rangsit Hub (Thammasat / AIT)</th>
                <th className="p-4">Practical Student Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Studio Condo / Dorm (AC)</td>
                <td className="p-4 font-bold text-petrol-800">THB 7,000 – 10,000 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 4,500 – 7,000 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 4,000 – 6,500 / mo</td>
                <td className="p-4 text-slate-600">
                  Modern furnished studio with swimming pool, gym, 24/7 security. Sharing with a roommate cuts rent in half.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Food &amp; Campus Meals</td>
                <td className="p-4 font-bold text-petrol-800">THB 5,500 – 8,000 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 4,500 – 6,500 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 4,500 – 6,500 / mo</td>
                <td className="p-4 text-slate-600">
                  University food courts are heavily subsidized, offering nutritious Thai, halal, and vegetarian dishes at THB 40–70/meal.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Transit (BTS, MRT, Shuttle)</td>
                <td className="p-4 font-bold text-petrol-800">THB 1,500 – 2,200 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 800 – 1,200 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 600 – 1,000 / mo</td>
                <td className="p-4 text-slate-600">
                  Student Rabbit Card provides discounts on BTS SkyTrain. AIT and Mahidol operate free on-campus tram shuttles.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">Electricity (AC) &amp; Water</td>
                <td className="p-4 font-bold text-petrol-800">THB 1,200 – 1,800 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 1,000 – 1,500 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 1,000 – 1,500 / mo</td>
                <td className="p-4 text-slate-600">
                  AC electricity during hot summer months represents the primary utility variable. Government rates (PEA) apply.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-petrol-800">High-Speed Fiber &amp; 5G SIM</td>
                <td className="p-4 font-bold text-petrol-800">THB 500 – 800 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 500 – 800 / mo</td>
                <td className="p-4 font-bold text-petrol-800">THB 500 – 800 / mo</td>
                <td className="p-4 text-slate-600">
                  Unlimited 5G mobile data package from AIS, True, or dtac. Fast campus WiFi is free across all university buildings.
                </td>
              </tr>
              <tr className="bg-sand-50/60 font-bold text-petrol-800">
                <td className="p-4">Total Monthly Living Budget</td>
                <td className="p-4 text-emerald-800">THB 15,700 – 22,800 / mo</td>
                <td className="p-4 text-emerald-800">THB 11,300 – 17,000 / mo</td>
                <td className="p-4 text-emerald-800">THB 10,600 – 16,300 / mo</td>
                <td className="p-4 text-slate-600 font-normal">
                  ~40,000 – 84,000 BDT/month depending on city center vs suburban campus location.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 7: Work Rights Realities & Graduate Assistantships */}
      <Section
        id="work-rights"
        tone="white"
        title="Part-Time Employment Realities &amp; On-Campus Assistantships"
        intro="Honest counselor guidance on working in Thailand. Understand the strict statutory prohibition on off-campus commercial jobs versus on-campus research appointments."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Statutory Off-Campus Prohibition */}
          <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-50/30 p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-bold text-amber-950">
              Strict Immigration Rule: Off-Campus Work is Prohibited
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-900">
              Under Thai immigration law, international students holding a <strong>Non-Immigrant ED Visa are legally barred from working off-campus</strong> in commercial retail, restaurants, hotels, or corporate offices. Working without a formal work permit (Non-Immigrant B visa) carries severe penalties including visa revocation and deportation.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-white/80 p-4 text-xs text-slate-700">
              <strong className="text-amber-950">Strict EduExpress Recommendation:</strong>
              <p className="mt-1 text-slate-600">
                Bangladeshi families must fully pre-fund both university tuition fees and living expenses through an Authorized Dealer bank Student File before travel. Never plan your budget assuming you can work in Thailand to cover tuition.
              </p>
            </div>
          </div>

          {/* Permitted Academic Appointments */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Briefcase size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">
              Permitted On-Campus Graduate Assistantships (RA / TA)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              While commercial work is illegal, Thai research universities offer institutional appointments directly tied to postgraduate studies:
            </p>
            <div className="mt-4 rounded-2xl border border-rule bg-canvas-soft p-4 text-xs text-slate-700">
              <strong className="text-petrol-800">Authorized Academic Positions:</strong>
              <ul className="mt-1.5 space-y-1 text-slate-600">
                <li>• <strong>Graduate Research Assistantships (RA):</strong> Funded by faculty research grants; provides monthly stipends of THB 6,000 to THB 12,000.</li>
                <li>• <strong>Teaching Assistantships (TA):</strong> Assisting professors in undergraduate labs and tutorials; often bundled with partial tuition discounts.</li>
                <li>• <strong>Required Academic Internships:</strong> Practicums mandated by degree curricula are fully legal under ED visa status.</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 8: EduExpress Asia Fee Policy & Written Guarantees */}
      <Section
        id="eduexpress-policy"
        tone="sage"
        title="The EduExpress Asia Fee Guarantee: Zero Risk, 100% Written Transparency"
        intro="We reject predatory agency markups. Our written service agreement ensures that you pay zero advisory fees until your Thai student visa is approved."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
              <Receipt size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 0 File-Opening Charge</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Zero upfront file-opening fee, assessment charge, or hidden retainer. Your initial academic profile audit and scholarship evaluation are 100% free.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-petrol-100 text-petrol-900">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">BDT 100,000 Service Fee (After Visa)</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Our complete advisory fee is BDT 100,000 (1 Lakh Taka), payable strictly and only <strong>100% after your Thai Non-Immigrant ED Visa is approved</strong>.
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
        title="Frequently Asked Questions: Cost of Studying in Thailand"
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
                href="/study-in-thailand-from-bangladesh"
                className="ed-btn ed-btn-outline text-xs min-h-[40px] px-4"
              >
                Thailand Country Pillar
              </Link>
              <Link
                href="/apply?country=Thailand"
                className="ed-btn ed-btn-signal text-xs min-h-[40px] px-4"
              >
                Apply for Thailand
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

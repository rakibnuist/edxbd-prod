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
const PATH = '/south-korea-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const KOREA_COST_SOURCES = [
  {
    label: 'Study in Korea (National Institute for International Education — NIIED)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Statutory portal under the Korean Ministry of Education for Global Korea Scholarship (GKS) regulations, tuition benchmarks, and official TOPIK score verification.',
  },
  {
    label: 'Embassy of the Republic of Korea in Dhaka, Bangladesh',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Consular visa authority for D-2 Student Visa issuance, consular document legalization, and mandatory 14 approved commercial bank solvency guidelines in Dhaka.',
  },
  {
    label: 'HiKorea (Korea Immigration Service — Ministry of Justice)',
    href: 'https://www.hikorea.go.kr/',
    note: 'Statutory rules for Alien Registration Card (ARC), statutory student part-time work permits (S-3), and 2-year D-10 Job Seeker visa regulations.',
  },
  {
    label: 'Minimum Wage Commission of the Republic of Korea (MOEL)',
    href: 'https://www.minimumwage.go.kr/',
    note: 'Statutory national minimum wage standard (KRW 10,030/hour for 2025/2026) applicable to legally authorized international student part-time work.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Remittance)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank guidelines for outward telegraphic student file tuition transfers and foreign currency living cost cards for South Korea.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in South Korea from Bangladesh 2027 | EduExpress',
    description:
      'Complete cost breakdown for studying in South Korea from Bangladesh: GKS scholarship vs self-funded tuition, KRW living budgets, Korean Embassy solvency rules, and student work rights.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('south-korea', 'Cost of Studying in South Korea from Bangladesh — EduExpress International'),
  });
}

const KOREA_COST_FAQS = [
  {
    question: 'How much does it cost to study in South Korea under the Global Korea Scholarship (GKS)?',
    answer:
      'If selected for the Global Korea Scholarship (GKS, funded by NIIED under the Ministry of Education), your academic cost is 100% free. GKS covers complete university tuition for the entire degree duration (4 years for Bachelor’s, 2 years for Master’s, 3 years for PhD), provides 1 full year of funded Korean language training, round-trip economy flights between Dhaka and Seoul, a monthly living stipend of KRW 1,000,000/month (~90,000 BDT) for undergraduates and KRW 1,000,000 to KRW 1,500,000/month (~90,000–135,000 BDT) for graduate scholars, settlement allowances (KRW 200,000), and full National Health Insurance (NHIS). Personal expenses are limited to initial passport and medical checks before departure.',
  },
  {
    question: 'What is the annual tuition fee for self-funded Bangladeshi students in South Korea?',
    answer:
      'Tuition fees in South Korea are structured per semester (two semesters per academic year). At National and Public Universities (such as Seoul National University and regional flagships like Pusan National or Kyungpook National), undergraduate tuition ranges from KRW 2,400,000 to KRW 5,000,000 per semester (~KRW 4.8M to KRW 10M per year or ~432,000 to 900,000 BDT/year). At prestigious Private Universities (such as Yonsei, Korea University, SKKU, and Hanyang), STEM and Engineering programs range from KRW 5,200,000 to KRW 7,000,000 per semester (~KRW 10.4M to KRW 14M per year or ~936,000 to 1,260,000 BDT/year). Specialized English-taught international colleges (like Yonsei UIC) cost approximately KRW 8.3M per semester (~1.5M BDT/year). However, most universities offer 30% to 70% merit fee reductions from the 2nd semester based on academic GPA.',
  },
  {
    question: 'What is the bank solvency requirement for a South Korean D-2 student visa in Dhaka?',
    answer:
      'For self-funded applicants, the Embassy of the Republic of Korea in Dhaka enforces strict financial solvency benchmarks. For universities located in the Seoul Metropolitan Area (Seoul, Incheon, Gyeonggi-do), you must submit an official bank certificate and 6-month statement showing a minimum balance equivalent to USD 20,000 (~24.4 Lakh BDT). For regional universities outside the capital metropolitan area (such as KAIST in Daejeon or universities in Daegu/Busan), the required threshold is USD 16,000 to USD 18,000 (~19.5L to 22.0L BDT). Crucially, the Embassy strictly requires these funds to be held in one of its 14 designated commercial banks in Bangladesh (such as Eastern Bank, Prime Bank, BRAC Bank, Standard Chartered, HSBC, Dhaka Bank, or City Bank) and maintained consistently for 30 to 90 days. For full GKS scholars, this bank solvency certificate is completely waived.',
  },
  {
    question: 'What is the realistic monthly living cost for a student in Seoul vs regional Korean cities?',
    answer:
      'In Seoul, an international student typically spends KRW 850,000 to KRW 1,300,000 per month (~76,500 to 117,000 BDT), with university dormitories costing KRW 300,000–500,000/month and off-campus studio rooms (Gosiwon) costing KRW 350,000–550,000/month. In prominent regional technology and university hubs like Daejeon, Daegu, and Busan, living expenses drop to KRW 650,000 to KRW 900,000 per month (~58,500 to 81,000 BDT), largely due to significantly lower campus dormitory fees (KRW 200,000–350,000/month) and cheaper dining. Subsidized campus cafeterias (Hakshik) across Korea offer nutritious hot meals for only KRW 4,500 to KRW 6,500 (~400–585 BDT).',
  },
  {
    question: 'Can Bangladeshi students work part-time in South Korea and how much can they earn?',
    answer:
      'Yes. International students holding a D-2 student visa can legally work part-time after obtaining a Part-Time Work Permit (S-3) from the immigration office via HiKorea. Work eligibility is closely linked to your Korean language proficiency (TOPIK). Undergraduate students holding TOPIK Level 3 or higher can work up to 20 to 25 hours per week during semester terms and unlimited hours during semester vacations (July–August and January–February). Students without TOPIK Level 3 are restricted to a maximum of 10 hours per week. Under Korea’s statutory minimum wage of KRW 10,030 per hour (~900 BDT/hour), working 20 hours per week yields approximately KRW 800,000 to KRW 900,000 per month (~72,000–81,000 BDT), which covers 80% to 100% of monthly living expenses in regional cities and around 70% to 80% in Seoul.',
  },
  {
    question: 'How do students remit tuition to Korean universities from Bangladesh via Student File?',
    answer:
      'Under Bangladesh Bank foreign exchange regulations, tuition to South Korea must be remitted through an authorized Student File opened at a licensed commercial bank (e.g., Eastern Bank, Prime Bank, BRAC Bank, City Bank). Students present their unconditional Certificate of Admission (CoA), university tuition invoice with SWIFT/IBAN coordinates, and passport. The bank processes a SWIFT wire transfer (MT103) in USD or EUR directly to the Korean university’s institutional account. EduExpress assists students and parents with comprehensive Student File documentation at zero consultancy charge.',
  },
];

export default async function SouthKoreaStudyCostPage() {
  const universities = await prisma.university.findMany({
    where: { country: { contains: 'Korea' }, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      tuition: true,
      rankingWorld: true,
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
        name: 'Cost of Studying in South Korea from Bangladesh | Full BDT, KRW & USD Breakdown (2027)',
        description:
          'Comprehensive tuition fee schedules, Global Korea Scholarship (GKS) full coverage vs self-funded costs, Korean Embassy D-2 visa bank solvency rules, and student work earnings.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/south-korea.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(KOREA_COST_SOURCES),
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
          { name: 'South Korea', path: '/study-in-south-korea-from-bangladesh' },
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 KRW ≈ 0.090 BDT (1 USD ≈ 122 BDT) · BDT 0 EduExpress Fee"
        title="Cost of Studying in South Korea from Bangladesh."
        lead="A comprehensive, transparent financial guide for Bangladeshi students and families: Global Korea Scholarship (GKS) full funding vs self-funded tuition (KRW 3.5M–8M/semester), monthly living budgets in Seoul and regional tech hubs (KRW & BDT), Korean Embassy D-2 visa bank solvency rules (USD 20,000 / USD 16k–18k across 14 approved banks), and student work rights under TOPIK thresholds."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=South%20Korea" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check Korea Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#gks-vs-self" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              GKS vs Self-Funded
            </a>
          </>
        }
      />

      <TrustBar destination="South Korea" />

      {/* Currency Planning Baseline Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold text-sm">
              ₩
            </span>
            <span>
              Planning Assumption (Nov 2026): <strong>1 KRW ≈ 0.090 BDT</strong> &amp; <strong>1 USD ≈ 122 BDT</strong>{' '}
              <span className="font-normal text-slate-500">
                (1,000 KRW ≈ 90 BDT · conservative planning rates — confirm live bank TT selling rates before remittance)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• Global High-Tech &amp; R&amp;D Leader</span>
            <span>• Direct University &amp; Embassy Fees</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
              EduExpress Fee: BDT 0
            </span>
          </div>
        </div>
      </section>

      {/* Module 1: Pre-Departure Third-Party & Statutory Costs */}
      <Section
        id="pre-departure"
        title="Pre-Departure Third-Party &amp; Statutory Costs"
        intro="Itemized official expenses required before departing from Dhaka to South Korea. All fees are paid directly to statutory authorities, designated medical centers, and consular sections."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <Banknote className="size-6 text-petrol-800" />
              <h3 className="text-base font-bold text-petrol-800">Exchange Rate Assumption</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-petrol-900">1 KRW ≈ 0.090 BDT</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Planning Assumption:</strong> Interbank exchange rates fluctuate daily. Conversions in this guide use 1 KRW = 0.090 BDT (10,000 KRW = 900 BDT) and 1 USD = 122 BDT to set a reliable financial ceiling for Bangladeshi families.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="size-6 text-amber-700" />
              <h3 className="text-base font-bold text-petrol-800">Embassy Solvency Benchmark</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-amber-700">USD 16,000 – 20,000</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              For self-funded D-2 student visas, the Korean Embassy in Dhaka mandates USD 20,000 (~24.4L BDT) for Seoul universities and USD 16k–18k (~19.5L–22L BDT) for regional universities, held across 14 approved commercial banks for 30–90 days.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-800" />
              <h3 className="text-base font-bold text-petrol-800">EduExpress Fee Guarantee</h3>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-emerald-800">BDT 0 Service Charge</p>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              EduExpress International provides <strong>100% free counseling</strong> for both Global Korea Scholarship (GKS) applications and direct university admissions. Zero file opening charges, zero hidden commissions.
            </p>
          </div>
        </div>

        {/* Pre-Departure Table */}
        <div className="mt-8 overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Official Fee Item</th>
                <th className="p-4">Statutory Fee (USD / KRW / BDT)</th>
                <th className="p-4">Approx. BDT Equivalent (@ 122 BDT/USD)</th>
                <th className="p-4">Payment Recipient &amp; Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Korean D-2 Student Visa Fee (Single Entry)</td>
                <td className="p-4 font-semibold">USD 60</td>
                <td className="p-4">~7,320 BDT</td>
                <td className="p-4 text-slate-600">Embassy of the Republic of Korea in Dhaka (Waived for full GKS scholars)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Embassy Consular Legalization (Per Document)</td>
                <td className="p-4 font-semibold">USD 4 / document</td>
                <td className="p-4">~500 BDT per doc</td>
                <td className="p-4 text-slate-600">Korean Embassy Consular Section (Graduation certificate, transcripts, birth certificate)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Academic &amp; Notary Attestation (Dhaka)</td>
                <td className="p-4 font-semibold">3,000 – 6,000 BDT</td>
                <td className="p-4">3,000 – 6,000 BDT</td>
                <td className="p-4 text-slate-600">Education Boards, Ministry of Education (MOE) &amp; Ministry of Foreign Affairs (MOFA)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Police Clearance Certificate</td>
                <td className="p-4 font-semibold">500 BDT</td>
                <td className="p-4">500 BDT</td>
                <td className="p-4 text-slate-600">Bangladesh Police (Online verification portal)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Mandatory Tuberculosis (TB) Screening</td>
                <td className="p-4 font-semibold">4,500 – 7,000 BDT</td>
                <td className="p-4">4,500 – 7,000 BDT</td>
                <td className="p-4 text-slate-600">Embassy-designated clinic in Dhaka (IOM Migration Health Assessment Center, Green Crescent)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Initial Travel &amp; Transit Health Insurance</td>
                <td className="p-4 font-semibold">USD 40 – USD 60</td>
                <td className="p-4">~4,880 – 7,320 BDT</td>
                <td className="p-4 text-slate-600">Valid until mandatory Korean National Health Insurance (NHIS) kicks in upon arrival</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka to Seoul Incheon ICN)</td>
                <td className="p-4 font-semibold">USD 370 – USD 615</td>
                <td className="p-4">~45,000 – 75,000 BDT</td>
                <td className="p-4 text-slate-600">Airlines (Thai Airways, Singapore Airlines, Malaysia Airlines, China Southern)</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-4 font-bold text-emerald-900">EduExpress Processing &amp; File Guidance</td>
                <td className="p-4 font-bold text-emerald-900">USD 0</td>
                <td className="p-4 font-bold text-emerald-900">BDT 0</td>
                <td className="p-4 text-xs text-emerald-800">100% Free Transparent Study Abroad Consultancy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Global Korea Scholarship (GKS) vs Self-Funded Comparison */}
      <Section
        id="gks-vs-self"
        tone="sage"
        title="Global Korea Scholarship (GKS) vs Self-Funded: Complete Financial Contrast"
        intro="South Korea provides two distinct admission routes for Bangladeshi students: the prestigious, fully funded Global Korea Scholarship (GKS) and direct self-funded university enrollment."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pathway A: Global Korea Scholarship */}
          <div className="rounded-3xl border border-emerald-700/20 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-emerald-700" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Global Korea Scholarship (GKS)</h3>
                <span className="text-xs font-semibold text-emerald-800">Fully Funded • Ministry of Education &amp; NIIED Quota</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Administered by the National Institute for International Education (NIIED). Highly competitive bilateral scholarship awarded via Embassy Track (Korean Embassy Dhaka) and University Track.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Tuition Coverage:</span>
                <strong className="text-emerald-800">100% Free Tuition for full degree duration</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Korean Language Program:</span>
                <strong>1 full year of 100% funded language training</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Monthly Living Allowance (UG):</span>
                <strong>KRW 1,000,000 / month (~90,000 BDT / month)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Monthly Living Allowance (Grad):</span>
                <strong>KRW 1,000,000 – 1,500,000 / month (~90k–135k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Airfare &amp; Settlement:</span>
                <strong>Round-trip flights + KRW 200,000 settlement grant</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>National Health Insurance (NHIS):</span>
                <strong>100% Covered by NIIED</strong>
              </div>
              <div className="flex justify-between">
                <span>Bank Solvency Requirement:</span>
                <span className="text-emerald-800 font-bold">Completely Waived (No bank statement needed)</span>
              </div>
            </div>
          </div>

          {/* Pathway B: Self-Funded Direct Admission */}
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="size-6 text-petrol-800" />
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Self-Funded Direct University Enrollment</h3>
                <span className="text-xs font-semibold text-slate-500">Accessible Admission • High-Tech Labs &amp; Merit Waivers</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              Direct application to Korean national and private research universities. Students with solid academic records (GPA 3.5+ / IELTS 6.0+) qualify for substantial merit waivers.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-medium text-slate-700">
              <div className="flex justify-between border-b border-rule pb-2">
                <span>National Public Tuition:</span>
                <strong>KRW 4.8M – 10M / year (~4.3L – 9.0L BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Private University Tuition:</span>
                <strong>KRW 9.1M – 16M / year (~8.2L – 14.4L BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Subsequent Semester Merit Waivers:</span>
                <strong className="text-emerald-800">30% to 70% tuition fee reduction (GPA-based)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Living Expenses (Regional Hubs):</span>
                <strong>KRW 650,000 – 900,000 / mo (~58.5k – 81k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Living Expenses (Seoul):</span>
                <strong>KRW 850,000 – 1,300,000 / mo (~76.5k – 117k BDT)</strong>
              </div>
              <div className="flex justify-between border-b border-rule pb-2">
                <span>Embassy Solvency Proof:</span>
                <strong className="text-amber-800">USD 20,000 (Seoul) / USD 16k–18k (Regional)</strong>
              </div>
              <div className="flex justify-between">
                <span>Student File Wire:</span>
                <span className="text-petrol-800 font-bold">Legal SWIFT wire via Bangladesh Bank AD banks</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 3: Annual Tuition Fees by University Tier & Discipline */}
      <Section
        id="tuition-breakdown"
        title="Annual Tuition Fees at Korean Universities"
        intro="Tuition fees in South Korea are charged semiannually. Costs vary significantly between state-subsidized national institutions and private research powerhouses."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">National &amp; Public Research Flagships</h4>
            <span className="text-xs text-slate-500">SNU, KAIST, Pusan National, Kyungpook</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">₩4.8M – ₩10M / yr</p>
            <p className="mt-1 text-xs text-slate-600">~432,000 – 900,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• Seoul National University: ₩2.4M–₩5M/sem</li>
              <li>• KAIST: Full scholarship common for admitted STEM students</li>
              <li>• Pusan National: ₩2.2M–₩3.8M/sem</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">Elite Private STEM &amp; Business</h4>
            <span className="text-xs text-slate-500">Yonsei, Korea University, SKKU, Hanyang</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">₩9.1M – ₩15.6M / yr</p>
            <p className="mt-1 text-xs text-slate-600">~819,000 – 1,404,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• Korea University: ₩5.2M–₩7.8M/sem</li>
              <li>• Sungkyunkwan (SKKU): ₩5.2M–₩8.1M/sem</li>
              <li>• Hanyang University: ₩4.7M–₩7.1M/sem</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <h4 className="font-bold text-petrol-800">Dedicated English International Colleges</h4>
            <span className="text-xs text-slate-500">Yonsei UIC, Korea Univ DIS, SolBridge BBA</span>
            <p className="mt-3 text-xl font-extrabold text-petrol-900">₩14M – ₩17M / yr</p>
            <p className="mt-1 text-xs text-slate-600">~1,260,000 – 1,530,000 BDT / year</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li>• Yonsei Underwood (UIC): ~₩8.3M/semester</li>
              <li>• SolBridge International Business: ~₩5.5M/sem</li>
              <li>• 100% English medium instruction, global faculty</li>
            </ul>
          </div>
        </div>

        {/* Database University Sampling */}
        <div className="mt-8 rounded-3xl border border-rule bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-petrol-800">Verified South Korean Partner Universities &amp; Published Tuition Rates</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
                <tr>
                  <th className="p-3">University</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Published Annual Tuition (KRW)</th>
                  <th className="p-3">Approx. BDT Equivalent (@ 0.090)</th>
                  <th className="p-3">Scholarship &amp; Funding Dynamics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-slate-700">
                {universities.length > 0 ? (
                  universities.map((uni) => (
                    <tr key={uni.id}>
                      <td className="p-3 font-bold text-petrol-800">
                        <Link href={`/universities/${uni.slug}`} className="hover:underline">
                          {uni.name}
                        </Link>
                      </td>
                      <td className="p-3">{uni.city || 'South Korea'}</td>
                      <td className="p-3 font-semibold text-slate-800">{uni.tuition || '₩5,000,000 – ₩10,000,000 / yr'}</td>
                      <td className="p-3 text-slate-600">~4.5L – 14.5L BDT/yr</td>
                      <td className="p-3 text-emerald-800 font-medium">GKS, University Merit (30%–70%), Professor RA</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Seoul National University (SNU)</td>
                      <td className="p-3">Seoul</td>
                      <td className="p-3 font-semibold">₩4,800,000 – ₩10,000,000</td>
                      <td className="p-3">~4.3L – 9.0L BDT</td>
                      <td className="p-3 text-emerald-800">SNU Global Scholarship, GKS</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">KAIST</td>
                      <td className="p-3">Daejeon</td>
                      <td className="p-3 font-semibold">₩6,900,000 – ₩7,400,000</td>
                      <td className="p-3">Full waiver common</td>
                      <td className="p-3 text-emerald-800">Full KAIST Scholarship + Monthly Stipend</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Yonsei University</td>
                      <td className="p-3">Seoul</td>
                      <td className="p-3 font-semibold">₩9,100,000 – ₩16,800,000</td>
                      <td className="p-3">~8.2L – 15.1L BDT</td>
                      <td className="p-3 text-emerald-800">Yonsei International Scholarship (30%–100%)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Korea University</td>
                      <td className="p-3">Seoul</td>
                      <td className="p-3 font-semibold">₩10,474,000 – ₩15,600,000</td>
                      <td className="p-3">~9.4L – 14.0L BDT</td>
                      <td className="p-3 text-emerald-800">Global Leader Scholarship, 30%–50% GPA waiver</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Sungkyunkwan University (SKKU)</td>
                      <td className="p-3">Seoul / Suwon</td>
                      <td className="p-3 font-semibold">₩10,400,000 – ₩16,200,000</td>
                      <td className="p-3">~9.4L – 14.6L BDT</td>
                      <td className="p-3 text-emerald-800">Samsung Global Scholarship, 30%–70% merit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-petrol-800">Hanyang University</td>
                      <td className="p-3">Seoul / ERICA</td>
                      <td className="p-3 font-semibold">₩9,400,000 – ₩14,200,000</td>
                      <td className="p-3">~8.5L – 12.8L BDT</td>
                      <td className="p-3 text-emerald-800">Hanyang International Excellence Award (30%–100%)</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Module 4: Real Monthly Living Cost Breakdown in South Korea */}
      <Section
        id="living-costs"
        tone="sage"
        title="Real Monthly Living Expenses: Seoul vs Regional University Cities"
        intro="While Seoul offers unmatched corporate headquarters and research institutes, regional technology cities (Daejeon, Daegu, Busan) feature substantially lower living expenses and affordable campus housing."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Expense Category</th>
                <th className="p-4">Seoul Metropolitan Area</th>
                <th className="p-4">Regional Cities (Daejeon, Busan, Daegu)</th>
                <th className="p-4">Cost in BDT (Approx.)</th>
                <th className="p-4">Optimization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Home className="size-4 text-petrol-800" />
                    <span>Accommodation (Dorm or Gosiwon)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩350,000 – ₩550,000 / mo</td>
                <td className="p-4 font-semibold">₩200,000 – ₩350,000 / mo</td>
                <td className="p-4">~18,000 – 49,500 BDT</td>
                <td className="p-4 text-slate-500">Apply early for on-campus dorms; select Gosiwon off-campus to avoid large key-money deposits</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Utensils className="size-4 text-petrol-800" />
                    <span>Food &amp; Subsidized Cafeterias</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩350,000 – ₩500,000 / mo</td>
                <td className="p-4 font-semibold">₩280,000 – ₩400,000 / mo</td>
                <td className="p-4">~25,200 – 45,000 BDT</td>
                <td className="p-4 text-slate-500">Dine at subsidized university cafeterias (Hakshik ₩4,500–₩6,500/meal) and buy groceries at local marts</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Train className="size-4 text-petrol-800" />
                    <span>Public Transit (T-Money Subway / Bus)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩65,000 – ₩90,000 / mo</td>
                <td className="p-4 font-semibold">₩50,000 – ₩75,000 / mo</td>
                <td className="p-4">~4,500 – 8,100 BDT</td>
                <td className="p-4 text-slate-500">Rechargeable T-Money card provides automatic free transit transfers between buses and subways within 30 min</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-petrol-800" />
                    <span>National Health Insurance (NHIS)</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩75,000 – ₩85,000 / mo</td>
                <td className="p-4 font-semibold">₩75,000 – ₩85,000 / mo</td>
                <td className="p-4">~6,750 – 7,650 BDT</td>
                <td className="p-4 text-slate-500">Mandatory statutory government health insurance with automatic international student discount</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-petrol-800" />
                    <span>Mobile High-Speed Internet &amp; SIM</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩35,000 – ₩50,000 / mo</td>
                <td className="p-4 font-semibold">₩30,000 – ₩45,000 / mo</td>
                <td className="p-4">~2,700 – 4,500 BDT</td>
                <td className="p-4 text-slate-500">Budget MVNO carriers (Woori Mobile, Chingu Mobile, KT M Mobile) provide generous student data quotas</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-petrol-800" />
                    <span>Personal Expenses &amp; Study Supplies</span>
                  </div>
                </td>
                <td className="p-4 font-semibold">₩60,000 – ₩100,000 / mo</td>
                <td className="p-4 font-semibold">₩50,000 – ₩80,000 / mo</td>
                <td className="p-4">~4,500 – 9,000 BDT</td>
                <td className="p-4 text-slate-500">Daiso stationery, campus digital book libraries, student discounts on museum and cultural entries</td>
              </tr>
              <tr className="bg-canvas-soft font-bold">
                <td className="p-4 text-petrol-900">Total Monthly Realistic Living Budget</td>
                <td className="p-4 text-petrol-900">₩850,000 – ₩1,300,000 / mo</td>
                <td className="p-4 text-petrol-900">₩650,000 – ₩900,000 / mo</td>
                <td className="p-4 text-petrol-900">~58,500 – 117,000 BDT</td>
                <td className="p-4 font-normal text-emerald-800">Offset by legal part-time work earnings of ₩800k–900k/month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: Korean Embassy in Dhaka D-2 Visa Bank Solvency & Approved Banks */}
      <Section
        id="bank-solvency"
        title="Embassy of Korea in Dhaka: D-2 Visa Bank Solvency Guidelines"
        intro="The Korean Embassy enforces strict financial verification standards for self-funded applicants. Review the required deposit amounts, seasoning rules, and the 14 approved commercial banks."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Landmark className="size-5" />
              <h4>Solvency Thresholds</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              <strong>Seoul Metropolitan Area:</strong> USD 20,000 (~24.4L BDT).<br />
              <strong>Regional Universities:</strong> USD 16,000 – USD 18,000 (~19.5L–22L BDT).<br />
              Funds must be held continuously for at least 30 to 90 days prior to consular submission.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Building className="size-5" />
              <h4>14 Approved Commercial Banks</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              The Embassy in Dhaka strictly requires statements from designated commercial banks: Eastern Bank, Prime Bank, BRAC Bank, Standard Chartered, HSBC, Dhaka Bank, City Bank, Mutual Trust Bank, Trust Bank, Commercial Bank of Ceylon, Bank Asia, Southeast Bank, UCBL, or Dutch-Bangla Bank.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-canvas-soft p-6">
            <div className="flex items-center gap-2 font-bold text-petrol-800">
              <Receipt className="size-5" />
              <h4>Student File SWIFT Remittance</h4>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Tuition payments must be remitted via an official Student File opened at an Authorized Dealer (AD) bank under Bangladesh Bank guidelines. SWIFT wire transfer confirmations (MT103) serve as primary payment evidence for visa processing.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="size-5 text-amber-700" />
            <span>EduExpress Anti-Hundi Notice: Strict Official Banking Rails Only</span>
          </div>
          <p className="mt-1 leading-relaxed">
            EduExpress strictly mandates authorized banking rails. The Embassy of the Republic of Korea in Dhaka and Korean Immigration authorities cross-verify bank balance certificates with designated bank headquarters. Informal fund transfers (hundi) or fabricated balance certificates lead to immediate D-2 visa refusal and multi-year Korean immigration blacklisting.
          </p>
        </div>
      </Section>

      {/* Module 6: Student Work Rights & Post-Study D-10 ROI */}
      <Section
        id="work-rights"
        tone="sage"
        title="Student Work Rights (TOPIK Tiers) &amp; 2-Year D-10 Job Seeker Visa"
        intro="South Korea provides clear legal part-time employment authorization for international students and a structured points-based post-study job seeker visa."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">Part-Time Work Rights (S-3 Permit)</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              International students with a D-2 visa can work legally after registering an S-3 permit via HiKorea. Permitted hours are governed by your TOPIK Korean language score.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Statutory Minimum Wage:</span>
                <span className="text-petrol-800 font-bold">₩10,030 / hour (~900 BDT/hr or ~$7.50/hr)</span>
              </div>
              <div className="flex justify-between">
                <span>Undergrad with TOPIK 3+:</span>
                <span className="text-emerald-800 font-bold">20–25 hrs/week (Unlimited during vacations)</span>
              </div>
              <div className="flex justify-between">
                <span>Undergrad without TOPIK 3:</span>
                <span className="text-amber-800 font-bold">Restricted to 10 hrs/week maximum</span>
              </div>
              <div className="flex justify-between">
                <span>Graduate Scholars (TOPIK 4+):</span>
                <span className="text-emerald-800 font-bold">30–35 hrs/week + Graduate Lab RA/TA stipends</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Income (20 hrs/week):</span>
                <span className="text-emerald-800 font-bold">₩800,000 – ₩900,000 (~72,000 – 81,000 BDT)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <GraduationCap className="size-6 text-petrol-800" />
              <h3 className="text-lg font-bold text-petrol-800">2-Year D-10 Job Seeker Residence Visa</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Graduates from accredited Korean universities qualify for the <strong>D-10 Job Seeker Visa</strong>, allowing up to 2 years of legal stay in 6-month increments to secure professional employment.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-canvas-soft p-4 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span>Points-Based Requirement:</span>
                <span className="text-petrol-800 font-bold">Min. 60 points out of 190 (Korean degree + TOPIK)</span>
              </div>
              <div className="flex justify-between">
                <span>Transition to E-7 Visa:</span>
                <span className="text-emerald-800 font-bold">Direct conversion upon securing high-tech or professional job</span>
              </div>
              <div className="flex justify-between">
                <span>High-Growth Employment Sectors:</span>
                <span className="text-petrol-800 font-bold">Semiconductors, AI, Automotive, Battery tech, IT</span>
              </div>
              <div className="flex justify-between">
                <span>Average Graduate Starting Salary:</span>
                <span className="text-emerald-800 font-bold">₩36,000,000 – ₩48,000,000 / yr (~32L – 43L BDT)</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 7: FAQs */}
      <Section
        id="faqs"
        title="Frequently Asked Questions: Cost of Studying in South Korea"
        intro="Clear, verified answers to common tuition, GKS scholarship, and embassy bank solvency questions from Bangladeshi students and parents."
      >
        <FaqBlock items={KOREA_COST_FAQS} />

        {/* Cross-linking to Hub & Related Destinations */}
        <div className="mt-12 rounded-3xl border border-rule bg-canvas-soft p-6">
          <h3 className="text-base font-bold text-petrol-800">Related Destination Hubs &amp; Cost Guides</h3>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
            <Link href="/study-in-south-korea-from-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              South Korea Flagship Country Hub <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/hungary-study-cost-bangladesh" className="inline-flex items-center gap-1.5 text-petrol-800 hover:underline">
              Hungary Study Cost Guide (2027) <ArrowRight size={14} aria-hidden="true" />
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
          {KOREA_COST_SOURCES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against NIIED guidelines, Embassy of the Republic of Korea in Dhaka visa circulars, and Bangladesh Bank foreign exchange directives. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* Module 9: CTA & Education Fit Assessment */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Financial Planning</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your South Korea Cost &amp; GKS Feasibility Assessment</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic background, target major, and budget. Our senior counselors evaluate your GKS scholarship eligibility, verify your bank solvency profile against Embassy rules, and help you apply with BDT 0 consultancy fees.
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

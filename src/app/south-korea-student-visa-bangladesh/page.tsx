import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileCheck2,
  FileSearch,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  Hospital,
  IdCard,
  Info,
  Landmark,
  MapPin,
  Plane,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/south-korea-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const KOREA_VISA_SOURCES = [
  {
    label: 'Embassy of the Republic of Korea in Dhaka, Bangladesh — Consular & Visa Section',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Diplomatic mission in Baridhara Diplomatic Zone, Dhaka responsible for D-2 and D-4 visa issuance, consular document legalization, and designated TB hospital accreditations.',
  },
  {
    label: 'Korea Visa Portal — Ministry of Justice, Republic of Korea',
    href: 'https://www.visa.go.kr/',
    note: 'Statutory government portal for visa status tracking, Visa Issuance Confirmation (VIC) verification, and official e-Form applications.',
  },
  {
    label: 'HiKorea (Korea Immigration Service — Ministry of Justice)',
    href: 'https://www.hikorea.go.kr/',
    note: 'Official e-Government portal for foreign residents: Alien Registration Card (ARC) appointments, S-3 part-time work authorization, and D-10 job seeker extensions.',
  },
  {
    label: 'Study in Korea (National Institute for International Education — NIIED)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Statutory body under the Ministry of Education overseeing IEQAS university certifications, Global Korea Scholarship (GKS) visas, and standard Certificate of Admission benchmarks.',
  },
  {
    label: 'International Organization for Migration (IOM) — Migration Health Assessment Clinic, Dhaka',
    href: 'https://bangladesh.iom.int/',
    note: 'Korean Embassy designated medical screening clinic in Gulshan-2, Dhaka conducting mandatory Tuberculosis (TB) testing for long-term visa applicants.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal outward foreign exchange remittances via SWIFT (Form TM) for tuition fees and international living allowances under FE Circulars.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'South Korea Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Complete South Korea student visa guide for Bangladeshi students: D-2 vs D-4 visa rules, Dhaka Embassy submission, $10k–$20k bank solvency, TB test & ARC card.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('south-korea', 'South Korea Student Visa from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'What is the difference between a D-2 Degree Visa and a D-4 Language Visa for South Korea?',
    answer:
      'The D-2 visa is designated for regular degree-seeking students admitted to Associate (D-2-1), Bachelor’s (D-2-2), Master’s (D-2-3), or Doctoral (D-2-4) programs at accredited Korean colleges and universities. It grants multi-year stay, formal part-time work rights (S-3 permit), and direct transition to the D-10 post-study job seeker visa. The D-4-1 visa is granted for short-term Korean language trainees enrolled in university-affiliated language institutes (typically 6 to 12 months). D-4 holders must study for at least 6 months before becoming eligible for part-time work, and it cannot directly convert to a work visa without first progressing into a full degree program.',
  },
  {
    question: 'What is a Visa Issuance Confirmation (VIC) and why does it fast-track embassy approval?',
    answer:
      'A Visa Issuance Confirmation (VIC / 사증발급인정서) is an electronic pre-visa authorization issued directly by the Korea Immigration Service (under the Ministry of Justice) in South Korea. When you are admitted to an IEQAS (International Education Quality Assurance System) certified university or Top 1% accredited institution, the university applies for the VIC on your behalf. Once approved, the immigration office generates an official Visa Confirmation Number. Bangladeshi students then submit only this confirmation number, their passport, photos, and basic visa form to the Embassy in Dhaka, with visa issuance typically completed in 5 to 7 working days with minimal document scrutiny.',
  },
  {
    question: 'How much bank balance is required for a South Korean student visa at the Dhaka Embassy?',
    answer:
      'Under Ministry of Justice and Korean Embassy in Dhaka regulations, applicants must demonstrate funds held in a recognized commercial bank under the student’s or parent’s name for at least 30 consecutive days prior to issuing the balance certificate: (1) For universities in the Seoul Metropolitan Area (Seoul, Incheon, Gyeonggi Province), the financial solvency requirement is USD 20,000 (approximately BDT 24.5 Lakh). (2) For regional non-metropolitan universities, the requirement is USD 16,000 to USD 18,000 (approximately BDT 19.5 to 22 Lakh). (3) For D-4 language programs, the balance requirement is USD 10,000 (approximately BDT 12.2 Lakh). The balance certificate must be submitted alongside a 6-month transaction statement and bank manager verification details.',
  },
  {
    question: 'Can parents sponsor a student’s financial solvency, and what documents are required?',
    answer:
      'Yes. If the bank account is held in the name of the student’s father or mother, the applicant must submit: (1) An official Family Certificate or English-translated, notarized Birth Certificate attested by the Ministry of Foreign Affairs (MOFA) proving parent-child relationship. (2) Parents’ National ID cards. (3) An Affidavit of Financial Sponsorship executed on non-judicial stamp paper. (4) Documented evidence of legitimate income generation, such as Income Tax Return assessment receipts (TIN), Trade License (if business owners), or Salary Certificate with salary bank statements (if employed). Unexplained recent bulk deposits without documentary paper trails are a primary cause of embassy refusal.',
  },
  {
    question: 'Where must Bangladeshi students complete the mandatory Tuberculosis (TB) screening?',
    answer:
      'Under Korean consular rules, all Bangladeshi nationals applying for long-term Korean visas (staying over 91 days) must undergo a comprehensive Tuberculosis (TB) screening exclusively at medical centers officially designated by the Embassy of the Republic of Korea in Dhaka. The premier designated facility is the International Organization for Migration (IOM) Migration Health Assessment Clinic in Gulshan-2, Dhaka. The medical certificate includes a chest X-ray and clinical examination report, remains valid for 3 months from issuance, and must be submitted in original sealed or verifiable format.',
  },
  {
    question: 'What is the attestation sequence for Bangladeshi academic certificates before visa lodgement?',
    answer:
      'All original academic certificates and marksheets (SSC, HSC, Bachelor’s, or Master’s) must be authenticated in the following mandatory legal sequence: (1) Respective Education Board or Autonomous University Registrar verification. (2) Ministry of Education (MOE), Government of Bangladesh (Secretariat, Dhaka). (3) Ministry of Foreign Affairs (MOFA), Consular Section (Segunbagicha, Dhaka). (4) Consular legalization or notary verification as specified by the Korean Embassy in Dhaka. Submitting documents without MOFA authentication leads to immediate dossier rejection.',
  },
  {
    question: 'Are Bangladeshi students permitted to work part-time in South Korea on a D-2 visa?',
    answer:
      'Yes. Under Article 20 of the Korean Immigration Control Act, international degree students on a D-2 visa can work legally after completing one full semester (6 months) and obtaining an S-3 Part-Time Work Permit from their university’s international student office and the local Immigration Office via HiKorea. Undergraduate students holding TOPIK Level 3 or higher (or equivalent English test scores in English-taught tracks) are permitted to work up to 20 to 25 hours per week during term time, and unlimited hours during summer and winter vacations. The statutory national minimum wage in South Korea is KRW 10,030 per hour (approximately USD 7.50 to 8.00 / ~BDT 900–1,000/hr).',
  },
  {
    question: 'What post-arrival formalities must be completed within 90 days of arriving in South Korea?',
    answer:
      'Within 90 days of landing at Incheon International Airport (ICN), all international students must visit their regional Korea Immigration Office to apply for the Alien Registration Card (ARC / 외국인등록증). The ARC is your biometric legal identity card in Korea containing your registration number, residency address, and visa expiration. Additionally, degree students are automatically enrolled in South Korea’s National Health Insurance Service (NHIS), which provides comprehensive medical, prescription, and hospitalization coverage across all national clinics and hospitals with a subsidized student premium of approximately KRW 70,000 to KRW 80,000 per month.',
  },
  {
    question: 'What is EduExpress’s fee policy for South Korean admission and student visa processing?',
    answer:
      'EduExpress operates with complete fee transparency: we charge BDT 0 file-opening fees. Our full consultancy and visa service fee for South Korea is BDT 100,000 (1 Lakh Taka), payable 100% strictly after your visa is approved and issued. If your visa is not granted, you owe EduExpress zero agency fees. Students self-pay only direct official fees: the Korean Embassy visa fee ($60), the designated IOM TB medical checkup, government attestations, and university tuition directly to institutional bank accounts.',
  },
];

export default async function SouthKoreaStudentVisaPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'South Korea Student Visa from Bangladesh 2027 | EduExpress',
        description:
          'Complete South Korea student visa guide for Bangladeshi students: D-2 vs D-4 visa rules, Dhaka Embassy submission, $10k–$20k bank solvency, TB test & ARC card.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/south-korea.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(KOREA_VISA_SOURCES),
      },
    ],
  };

  // Fetch verified South Korean partner universities from database
  let universities: { slug: string; name: string; location: string; rankingWorld: number | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'South Korea' },
      select: {
        slug: true,
        name: true,
        location: true,
        rankingWorld: true,
        tuition: true,
      },
      take: 6,
      orderBy: [{ name: 'asc' }],
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
          { name: 'South Korea', path: '/study-in-south-korea-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Embassy of the Republic of Korea, Dhaka · D-2 Degree & D-4 Language Visa · BDT 100k Post-Visa Fee"
        title="South Korea Student Visa from Bangladesh 2027."
        lead="An evidence-first, step-by-step roadmap for Bangladeshi scholars applying for South Korean D-2 (degree) and D-4 (language) student visas: navigating Certificate of Admission (CoA) vs Visa Issuance Confirmation (VIC), meeting Dhaka Embassy USD 10,000–$20,000 bank solvency rules, completing TB screening and MOFA attestation, and securing your post-arrival Alien Registration Card (ARC)."
        actions={
          <>
            <Link href="/apply?country=South+Korea" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#korea-visa-steps" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              View 5-Step Process
            </a>
          </>
        }
      />

      <TrustBar destination="South Korea" feeNote="100% After Visa Approval · BDT 0 File Opening" />

      {/* Planning Assumption & Key Visa Summary Grid */}
      <section aria-label="Visa planning metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Rate
              </span>
              <p className="text-xs text-slate-500">
                Official Currency Baseline: <strong>1 KRW ≈ 0.088 BDT</strong> | <strong>1 USD ≈ 122 BDT ≈ 1,380 KRW</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 100,000 Fee — 100% Payable After Visa Approval
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Statutory Categories
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">D-2 Degree &amp; D-4 Language</p>
              <p className="mt-1 text-xs text-slate-600">D-2 for Bachelor’s/Master’s/PhD; D-4 for university language centers.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Banknote size={16} className="text-emerald-700" /> Financial Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">USD 10,000 – $20,000</p>
              <p className="mt-1 text-xs text-slate-600">Held 30+ days in approved schedule commercial bank under student/parents.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Dhaka Mission
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Embassy of Korea, Dhaka</p>
              <p className="mt-1 text-xs text-slate-600">4 Madani Avenue, Baridhara Diplomatic Zone. Consular visa fee: $60.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Legal Resident Card
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Alien Registration (ARC)</p>
              <p className="mt-1 text-xs text-slate-600">Issued by local Immigration within 90 days. Unlocks S-3 work permits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Visa Categories (D-2 vs D-4) */}
      <Section
        id="visa-categories"
        title="Selecting the Right South Korean Student Visa: D-2 vs. D-4."
        intro="South Korea’s Ministry of Justice strictly categorizes international educational stays into degree-seeking (D-2) and training (D-4) streams. Selecting the appropriate category determines your allowable work hours, stay validity, and pathway toward professional post-study employment."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-emerald-700/20 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <GraduationCap size={14} /> Degree Seeking
              </span>
              <span className="text-xs font-bold text-slate-400">Code: D-2</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-petrol-900">D-2 Visa: Associate, Bachelor’s, Master’s &amp; PhD</h3>
            <p className="mt-2 text-sm text-slate-600">
              For Bangladeshi scholars admitted to formal higher education degree programs at accredited Korean national, public, or private universities.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                <span><strong>D-2-1:</strong> Associate Degree at Junior Colleges (2–3 years).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                <span><strong>D-2-2:</strong> Bachelor’s Degree at 4-year Universities (4 years).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                <span><strong>D-2-3:</strong> Master’s Degree Programs at Graduate Schools (2 years).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                <span><strong>D-2-4:</strong> Doctoral (PhD) Research Programs (3–4 years).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                <span><strong>D-2-6:</strong> Exchange Students under Bilateral University Partnerships.</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-slate-700">
              <p className="font-bold text-emerald-900">Key Privileges &amp; Progression:</p>
              <p className="mt-1">
                Eligible for S-3 Part-Time Work Permit (up to 20–25 hrs/wk in semester, unlimited in breaks) after 6 months. Upon degree completion, graduates seamlessly transition to the <strong>2-year D-10 Job Seeker Visa</strong>, which converts into an E-7 Professional Employment Visa or F-2-7 Resident Visa.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                <Globe size={14} /> Language Training
              </span>
              <span className="text-xs font-bold text-slate-400">Code: D-4-1</span>
            </div>
            <h3 className="mt-4 text-xl font-bold text-petrol-900">D-4-1 Visa: Korean Language Trainee</h3>
            <p className="mt-2 text-sm text-slate-600">
              For students enrolled in intensive Korean language programs (10 to 40 weeks) at university-affiliated language education centers before starting their degrees.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-slate-500" />
                <span><strong>Program Structure:</strong> 4 terms per year (Spring, Summer, Fall, Winter), 200 hours per 10-week term.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-slate-500" />
                <span><strong>Stay Duration:</strong> Issued in 6-month renewable blocks up to a strict maximum of 2 years.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-slate-500" />
                <span><strong>Bank Solvency:</strong> Minimum USD 10,000 (approx. BDT 12.2 Lakh) held for 30+ days.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-slate-500" />
                <span><strong>Attendance Requirement:</strong> Mandatory 90%+ class attendance; falling below 70% cancels the visa immediately.</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-slate-700">
              <p className="font-bold text-amber-900">Critical D-4 Boundaries &amp; Limitations:</p>
              <p className="mt-1">
                D-4 language students are strictly barred from working any part-time job during their first 6 months in Korea. D-4 visas cannot transition into work visas directly—you must attain TOPIK Level 3 or 4 and convert into a D-2 degree program in Korea.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: Two Issuance Routes (CoA vs VIC) */}
      <Section
        id="issuance-routes"
        tone="sage"
        title="Standard CoA vs. Visa Issuance Confirmation (VIC): Why University Accreditation Matters."
        intro="South Korea operates a two-tier visa issuance system. Understanding whether your institution processes a Standard Certificate of Admission (CoA) or an electronic Visa Issuance Confirmation (VIC) directly determines your embassy interview requirement and approval speed."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Sparkles size={16} /> Route 1 (Fast-Track) · IEQAS Top 1% Universities
            </div>
            <h3 className="mt-2 text-lg font-bold text-petrol-900">Visa Issuance Confirmation (VIC / 사증발급인정서)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              When admitted to an officially certified university under South Korea’s <strong>International Education Quality Assurance System (IEQAS)</strong>—including prestigious SKY universities (Seoul National, Korea, Yonsei), KAIST, SKKU, and Hanyang—the university applies directly to the local Korea Immigration Service on your behalf.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">1. University Submits Online in Korea:</p>
                <p className="mt-0.5 text-slate-600">The university submits your academic qualifications and financial verification directly to the Korean immigration office.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">2. Immigration Issues Electronic Confirmation Number:</p>
                <p className="mt-0.5 text-slate-600">Once immigration validates your file, an official Visa Issuance Confirmation Number is generated and emailed to you.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">3. Expedited Lodgement at Dhaka Embassy:</p>
                <p className="mt-0.5 text-slate-600">You submit only your original passport, photo, application form containing the confirmation number, and TB certificate. No repeated financial or academic document audit is required. Visa issued in <strong>5 to 7 working days</strong>.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-7">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <FileSearch size={16} /> Route 2 (Standard Consular Review)
            </div>
            <h3 className="mt-2 text-lg font-bold text-petrol-900">Standard Certificate of Admission (CoA / 표준입학허가서)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              For universities that do not process VIC, the institution issues a signed Standard Certificate of Admission (CoA) alongside their Certificate of Business Registration. The student must lodge a complete, verified physical dossier directly at the Embassy of Korea in Dhaka.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">1. Full Physical Document Dossier Required:</p>
                <p className="mt-0.5 text-slate-600">You must present original attested academic certificates, 6-month bank statements, bank solvency, and sponsorship affidavits.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">2. Consular Scrutiny &amp; Verification Calls:</p>
                <p className="mt-0.5 text-slate-600">Embassy consular officers verify the genuineness of bank balances with Bangladeshi bank managers and verify academic records.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-canvas-soft p-3.5 text-xs text-slate-700">
                <p className="font-bold text-petrol-800">3. Mandatory Consular Interview:</p>
                <p className="mt-0.5 text-slate-600">Applicants are called for an in-person interview in Baridhara to verify language proficiency, study motivation, and return intentions. Processing takes <strong>2 to 4 weeks</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Document Checklist & Bank Solvency */}
      <Section
        id="document-checklist"
        title="Comprehensive South Korea Student Visa Checklist."
        intro="Every document submitted to the Korean Embassy in Dhaka must be rigorously prepared, translated into English, notarized, and attested by the statutory ministries of Bangladesh."
      >
        <div className="overflow-hidden rounded-2xl border border-rule bg-white shadow-sm">
          <div className="border-b border-rule bg-canvas-soft p-5">
            <h3 className="text-base font-bold text-petrol-900">Mandatory Dossier Checklist for Bangladeshi Scholars</h3>
            <p className="mt-1 text-xs text-slate-600">Applicable for D-2 Degree &amp; D-4 Language Visa lodgement at Baridhara Diplomatic Zone, Dhaka.</p>
          </div>

          <div className="divide-y divide-rule text-xs">
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                1. Passport &amp; Application Form
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• Original Passport valid for at least 6 months beyond the intended stay duration with minimum 2 blank visa pages.</p>
                <p>• Completed Visa Application Form (e-Form from Korea Visa Portal) with 1 recent passport-sized color photograph (3.5cm x 4.5cm, white background, taken within last 6 months, matte finish).</p>
                <p>• Photocopy of passport biographical pages and previous international visas.</p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                2. Official University Admission Documents
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• Original Standard Certificate of Admission (표준입학허가서 - CoA) issued by the university president (indicating tuition fee status, intake date, and degree level).</p>
                <p>• Official Visa Issuance Confirmation (VIC) printout (if university processed immigration approval in Korea).</p>
                <p>• Copy of the Korean University’s Certificate of Business Registration (사업자등록증 / 고유번호증).</p>
                <p>• Tuition Fee Payment Receipt or official Scholarship Award Certificate (e.g. GKS Award, University Tuition Waiver letter).</p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                3. Attested Academic Credentials
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• All original Academic Certificates and Marksheets (SSC, HSC, Bachelor’s, or Master’s).</p>
                <p>• <strong>Strict Legal Attestation Sequence:</strong></p>
                <p className="pl-3 text-slate-600">1. Respective Education Board / Autonomous University Controller verification.</p>
                <p className="pl-3 text-slate-600">2. Ministry of Education (MOE), Bangladesh Secretariat, Dhaka.</p>
                <p className="pl-3 text-slate-600">3. Ministry of Foreign Affairs (MOFA), Consular Section, Segunbagicha, Dhaka.</p>
                <p className="pl-3 text-slate-600">4. Consular legalization or notary verification as required by the Korean Embassy.</p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                4. Financial Solvency &amp; Bank Documentation
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• <strong>Balance Thresholds:</strong></p>
                <p className="pl-3 text-slate-600">• Seoul Metropolitan Area (Seoul/Incheon/Gyeonggi): Minimum <strong>USD 20,000</strong> (approx. BDT 24.5 Lakh).</p>
                <p className="pl-3 text-slate-600">• Non-Metropolitan Provincial Universities: Minimum <strong>USD 16,000 – $18,000</strong> (approx. BDT 19.5 – 22 Lakh).</p>
                <p className="pl-3 text-slate-600">• D-4 Language Training: Minimum <strong>USD 10,000</strong> (approx. BDT 12.2 Lakh).</p>
                <p>• Original Bank Solvency Certificate + 6-month Bank Account Statement with official bank seal, manager contact details, and branch QR verification.</p>
                <p>• <strong>30-Day Rule:</strong> Funds must be maintained for at least 30 consecutive days prior to issuing the balance certificate.</p>
                <p>• <strong>If Sponsored by Parents:</strong></p>
                <p className="pl-3 text-slate-600">• Family Relationship Certificate or English-translated Birth Certificate attested by MOFA.</p>
                <p className="pl-3 text-slate-600">• Affidavit of Financial Support on non-judicial stamp paper (notarized).</p>
                <p className="pl-3 text-slate-600">• Parents’ National ID Cards, Tax Return (TIN) receipts, and Trade License or Salary Certificate.</p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                5. Designated TB Medical Certificate
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• Certificate of Tuberculosis (TB) Screening issued within 3 months of visa lodgement.</p>
                <p>• <strong>Mandatory Designated Clinic:</strong> International Organization for Migration (IOM) Migration Health Assessment Clinic, Gulshan-2, Dhaka (or other embassy-authorized clinics).</p>
                <p>• Must include official Chest X-ray evaluation, sputum smear test (if indicated), and physician clinical assessment.</p>
              </div>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="font-bold text-petrol-800">
                6. Police Clearance &amp; Study Motivation
              </div>
              <div className="sm:col-span-2 text-slate-700 space-y-1">
                <p>• Police Clearance Certificate (PCC) issued by Bangladesh Police, attested by MOFA Consular Section (valid for 3–6 months).</p>
                <p>• Detailed Study Plan &amp; Personal Statement (in English or Korean): articulating academic background, reasons for choosing South Korea, specific departmental research interests, financial plan, and post-graduation career trajectory.</p>
                <p>• Valid Language Proficiency Score Card (IELTS/TOEFL for English-taught programs; TOPIK Level 3+ for Korean-taught programs).</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: 5-Step Process */}
      <Section
        id="korea-visa-steps"
        tone="sage"
        title="The 5-Step South Korea Student Visa Application Process."
        intro="A predictable, transparent application chronology designed to eliminate delays, prevent document discrepancies, and ensure successful visa lodgement at the Embassy in Dhaka."
      >
        <div className="relative border-l-2 border-emerald-700/30 pl-6 sm:pl-8 ml-3 sm:ml-4 space-y-10">
          <div className="relative">
            <span className="absolute -left-[35px] sm:-left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-4 ring-white">
              1
            </span>
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-800">Step 1 · Weeks 1–3</span>
              <h3 className="mt-1 text-base font-bold text-petrol-900">University Admission, Tuition Payment &amp; CoA/VIC Issuance</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Submit your certified academic dossier, portfolio, and statement of purpose to your shortlisted Korean universities. Upon acceptance, remit the required 1st-semester tuition fee or registration deposit via authorized SWIFT telegraphic transfer (Student File) from a Bangladeshi commercial bank. The university processes your official Standard Certificate of Admission (CoA) or files for a Visa Issuance Confirmation (VIC) with Korean immigration.
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[35px] sm:-left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-4 ring-white">
              2
            </span>
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-800">Step 2 · Weeks 3–4</span>
              <h3 className="mt-1 text-base font-bold text-petrol-900">Government Attestations (Board, MOE &amp; MOFA Bangladesh)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Have all original educational certificates and marksheets verified by your respective Education Board or University Registrar, authenticated by the Ministry of Education (MOE) at the Bangladesh Secretariat, and attested by the Ministry of Foreign Affairs (MOFA) Consular Section in Segunbagicha, Dhaka. Obtain your Police Clearance Certificate (PCC) and have it attested by MOFA simultaneously.
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[35px] sm:-left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-4 ring-white">
              3
            </span>
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-800">Step 3 · Weeks 5–6</span>
              <h3 className="mt-1 text-base font-bold text-petrol-900">Designated TB Medical Checkup &amp; Bank Solvency Finalization</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Schedule and complete your mandatory Tuberculosis (TB) screening at the Korean Embassy-designated IOM Migration Health Assessment Clinic in Gulshan-2, Dhaka. Simultaneously, ensure your or your parents’ bank balance (USD 10,000–$20,000 equivalent) has completed the mandatory 30-day maintenance period, and request your formal Bank Solvency Certificate and 6-month statement with official bank seals.
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[35px] sm:-left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-4 ring-white">
              4
            </span>
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-800">Step 4 · Weeks 6–8</span>
              <h3 className="mt-1 text-base font-bold text-petrol-900">Visa Dossier Lodgement &amp; Consular Interview in Dhaka</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Submit your complete visa dossier and pay the consular visa fee ($60) at the Embassy of the Republic of Korea in Baridhara, Dhaka (or authorized application center). If applying via CoA route, prepare for an in-person interview covering your study plan, financial stability, and reasons for returning to Bangladesh. Track your real-time application status online via the Korea Visa Portal.
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-[35px] sm:-left-[43px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white ring-4 ring-white">
              5
            </span>
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <span className="text-xs font-bold uppercase text-emerald-800">Step 5 · Weeks 8–10</span>
              <h3 className="mt-1 text-base font-bold text-petrol-900">Visa Issuance, Incheon Flight &amp; Post-Arrival ARC Registration</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Collect your passport containing the Korean visa sticker or download the official Visa Grant Notice. Attend EduExpress’s pre-departure orientation in Dhanmondi, book your flight to Incheon International Airport (ICN), and register for your Alien Registration Card (ARC) and National Health Insurance (NHIS) at the local Korea Immigration Office within 90 days of arrival.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: Transparent Cost Breakdown */}
      <Section
        id="visa-costs"
        title="South Korea Student Visa Costs: Itemized Breakdown."
        intro="EduExpress operates with strict fee transparency. Every cost item, recipient, and payment timing is set out in writing before you start."
      >
        <div className="overflow-hidden rounded-2xl border border-rule bg-white shadow-sm">
          <div className="border-b border-rule bg-canvas-soft p-5">
            <h3 className="text-base font-bold text-petrol-900">South Korea Student Visa Expense Breakdown</h3>
            <p className="mt-1 text-xs text-slate-600">Assumptions: 1 USD ≈ 122 BDT | 1 KRW ≈ 0.088 BDT. Figures verified for 2026/2027 admissions.</p>
          </div>

          <div className="divide-y divide-rule text-xs">
            <div className="grid grid-cols-12 gap-2 bg-canvas-soft/80 p-3.5 font-bold text-slate-600">
              <div className="col-span-4 sm:col-span-3">Item / Service</div>
              <div className="col-span-3 sm:col-span-3">Cost (Foreign / BDT)</div>
              <div className="col-span-3 sm:col-span-3">Payable To</div>
              <div className="col-span-2 sm:col-span-3">Payment Timing</div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center">
              <div className="col-span-4 sm:col-span-3 font-semibold text-petrol-900">
                Korean Embassy Visa Fee
              </div>
              <div className="col-span-3 sm:col-span-3">
                USD 60 (~BDT 7,320)
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                Embassy of Korea, Dhaka
              </div>
              <div className="col-span-2 sm:col-span-3 text-slate-600">
                At visa submission
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center">
              <div className="col-span-4 sm:col-span-3 font-semibold text-petrol-900">
                Designated TB Medical Test
              </div>
              <div className="col-span-3 sm:col-span-3">
                ~BDT 6,500 – 8,000
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                IOM Dhaka / Panel Clinic
              </div>
              <div className="col-span-2 sm:col-span-3 text-slate-600">
                At medical examination
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center">
              <div className="col-span-4 sm:col-span-3 font-semibold text-petrol-900">
                Board, MOE &amp; MOFA Attestation
              </div>
              <div className="col-span-3 sm:col-span-3">
                ~BDT 3,000 – 5,000
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                Respective ministries/boards
              </div>
              <div className="col-span-2 sm:col-span-3 text-slate-600">
                During document verification
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center">
              <div className="col-span-4 sm:col-span-3 font-semibold text-petrol-900">
                Police Clearance Certificate
              </div>
              <div className="col-span-3 sm:col-span-3">
                BDT 500
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                Bangladesh Police Portal
              </div>
              <div className="col-span-2 sm:col-span-3 text-slate-600">
                Online application
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center bg-emerald-50/50">
              <div className="col-span-4 sm:col-span-3 font-bold text-emerald-950">
                EduExpress File Opening
              </div>
              <div className="col-span-3 sm:col-span-3 font-bold text-emerald-800">
                BDT 0 (Completely Free)
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                EduExpress International
              </div>
              <div className="col-span-2 sm:col-span-3 font-semibold text-emerald-800">
                Zero upfront charge
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center bg-emerald-50/80">
              <div className="col-span-4 sm:col-span-3 font-bold text-emerald-950">
                EduExpress Full Service Fee
              </div>
              <div className="col-span-3 sm:col-span-3 font-bold text-emerald-800">
                BDT 100,000 (1 Lakh Taka)
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                EduExpress International
              </div>
              <div className="col-span-2 sm:col-span-3 font-bold text-emerald-900">
                100% AFTER Visa Approval
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 p-4 text-slate-700 items-center">
              <div className="col-span-4 sm:col-span-3 font-semibold text-petrol-900">
                Alien Registration (ARC) in Korea
              </div>
              <div className="col-span-3 sm:col-span-3">
                KRW 30,000 (~BDT 2,640)
              </div>
              <div className="col-span-3 sm:col-span-3 text-slate-600">
                Korea Immigration Office
              </div>
              <div className="col-span-2 sm:col-span-3 text-slate-600">
                Within 90 days in Korea
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 6: Refusal Risks & Common Pitfalls */}
      <Section
        id="refusal-risks"
        tone="sage"
        title="Why South Korea Student Visas Get Refused &amp; How to Protect Your Application."
        intro="Consular officers at the Embassy of Korea in Dhaka evaluate applications with high rigor. Understanding the most frequent refusal causes ensures your submission is bulletproof."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700">
              <ShieldAlert size={16} /> Refusal Risk #1
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-900">Sudden Lump-Sum Bank Deposits (&ldquo;Fresh Money&rdquo;)</h3>
            <p className="mt-2 text-xs text-slate-600">
              Depositing USD 15,000–$20,000 into a bank account just days before printing the solvency certificate without a credible, documented source of funds triggers immediate suspicion of borrowed money.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-canvas-soft p-3 text-xs text-slate-700">
              <p className="font-bold text-emerald-800">The EduExpress Fix:</p>
              <p className="mt-0.5">We insist on maintaining funds across 30 to 90 consecutive days supported by legitimate salary transfers, documented business profits, or asset sales backed by verifiable tax returns.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700">
              <ShieldAlert size={16} /> Refusal Risk #2
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-900">Inability to Communicate During Consular Interview</h3>
            <p className="mt-2 text-xs text-slate-600">
              If applying for an English-taught degree but struggling to articulate your study plan in basic English, or applying for a Korean-taught degree without basic conversational Korean, consular officers issue 26-1 refusals for lack of study intention.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-canvas-soft p-3 text-xs text-slate-700">
              <p className="font-bold text-emerald-800">The EduExpress Fix:</p>
              <p className="mt-0.5">Every student undergoes 3 structured mock interview sessions in Dhanmondi, rehearsing professors’ names, curriculum subjects, lab research goals, and career objectives.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700">
              <ShieldAlert size={16} /> Refusal Risk #3
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-900">Choosing Non-Certified or Restricted Universities</h3>
            <p className="mt-2 text-xs text-slate-600">
              South Korea’s Ministry of Justice publishes an annual list of universities restricted from issuing student visas due to high illegal stay rates (over 10%). Unscrupulous agents often steer students toward these vulnerable regional colleges.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-canvas-soft p-3 text-xs text-slate-700">
              <p className="font-bold text-emerald-800">The EduExpress Fix:</p>
              <p className="mt-0.5">We shortlist exclusively from IEQAS-certified institutions and Top 1% universities that possess official electronic Visa Issuance Confirmation (VIC) authority.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700">
              <ShieldAlert size={16} /> Refusal Risk #4
            </div>
            <h3 className="mt-2 text-base font-bold text-petrol-900">Submitting Unverified or Inconsistent Documents</h3>
            <p className="mt-2 text-xs text-slate-600">
              Discrepancies in father’s or mother’s name spelling between the passport, National ID, birth certificate, and academic marksheets, or missing official ministry attestation seals, cause immediate return of files.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-canvas-soft p-3 text-xs text-slate-700">
              <p className="font-bold text-emerald-800">The EduExpress Fix:</p>
              <p className="mt-0.5">Our compliance officers conduct a 6-point forensic audit of every character across all certificates, birth records, and bank vouchers before ministry submission.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 7: Post-Arrival Formalities (ARC & NHIS) */}
      <Section
        id="post-arrival-rules"
        title="Alien Registration Card (ARC), Health Insurance &amp; Part-Time Work Rights."
        intro="Landing at Incheon Airport is just the first step. To maintain valid legal residency, open Korean bank accounts, and work legally, you must complete standard post-arrival formalities."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <IdCard size={18} /> Alien Registration Card (ARC)
            </div>
            <h3 className="mt-3 text-base font-bold text-petrol-900">Biometric ARC Registration</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Within 90 days of arrival, reserve an appointment via HiKorea at your local immigration office. Submit your passport, university enrollment certificate, lease contract (dorm or one-room), 3.5x4.5cm photo, and KRW 30,000 fee for fingerprinting. Your ARC serves as your official national identity card in Korea.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <Hospital size={18} /> National Health Insurance
            </div>
            <h3 className="mt-3 text-base font-bold text-petrol-900">Mandatory NHIS Enrollment</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              All international students residing in South Korea under D-2 and D-4 visas are automatically enrolled in the statutory National Health Insurance Service (NHIS) upon ARC issuance. You receive comprehensive dental, clinical, and hospital coverage across Korea for a subsidized rate of ~KRW 70,000–80,000/month.
            </p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-800">
              <Briefcase size={18} /> Part-Time Employment (S-3)
            </div>
            <h3 className="mt-3 text-base font-bold text-petrol-900">S-3 Work Permit Regulations</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              After 1 semester, obtain your university international advisor’s signature and report your employment contract on HiKorea. Undergraduates with TOPIK Level 3+ can work 20–25 hours/week during term-time and unlimited hours in vacations at the national minimum wage of KRW 10,030/hr (~BDT 900–1,000/hr).
            </p>
          </div>
        </div>
      </Section>

      {/* Section 8: Verified Universities in South Korea */}
      {universities.length > 0 && (
        <Section
          id="korea-universities"
          tone="sage"
          title="Top South Korean Partner Universities for Bangladeshi Scholars."
          intro="Explore top-tier national research institutes and prestigious private universities in South Korea offering English-taught degrees, high scholarship accessibility, and streamlined visa processing."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <div key={uni.slug} className="rounded-2xl border border-rule bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <BadgeCheck size={14} /> IEQAS Certified
                  </span>
                  {uni.rankingWorld && (
                    <span className="text-[11px] font-bold text-slate-400">QS #{uni.rankingWorld}</span>
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold text-petrol-900">{uni.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={13} /> {uni.location}
                </p>
                {uni.tuition && (
                  <div className="mt-3 rounded-lg border border-slate-100 bg-canvas-soft p-2.5 text-xs text-slate-700">
                    <span className="font-semibold text-slate-500">Tuition Range:</span>
                    <p className="mt-0.5 font-bold text-petrol-800">{uni.tuition}</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View University Profile <ArrowRight size={13} />
                  </Link>
                  <Link
                    href={`/apply?university=${encodeURIComponent(uni.name)}&country=South+Korea`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Check Eligibility
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-rule bg-canvas-soft p-4 text-xs text-slate-600">
            <span>Looking for detailed fee comparisons and semester living costs across Seoul vs provincial cities?</span>
            <Link
              href="/south-korea-study-cost-bangladesh"
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
            >
              Read South Korea Study Cost Guide <ArrowRight size={14} />
            </Link>
          </div>
        </Section>
      )}

      {/* Section 9: FAQs */}
      <Section
        id="korea-visa-faqs"
        title="Frequently Asked Questions: South Korea Student Visa."
        intro="Straightforward answers to the most common questions asked by Bangladeshi students and parents regarding Korean student visa procedures, bank statements, and interview preparation."
      >
        <FaqBlock items={faqs} />
      </Section>

      {/* Section 10: Sources, Reviewer & Accountability */}
      <section aria-label="Sources and Editorial Review" className="border-t border-rule bg-canvas-soft py-10">
        <div className={kit.wrap}>
          <div className="rounded-2xl border border-rule bg-white p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Verified Government Sources &amp; Editorial Governance
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              This guide is prepared and maintained under EduExpress International’s Evidence-First Content Standard. Information is cross-checked against official Korean consular decrees, Korea Immigration Service regulations, and Bangladesh Bank foreign exchange circulars.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 text-xs">
              {KOREA_VISA_SOURCES.map((s, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-canvas-soft/60 p-3">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-petrol-800 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    {s.label} <ExternalLink size={12} />
                  </a>
                  <p className="mt-1 text-[11px] text-slate-500">{s.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4 text-xs text-slate-500">
              <div>
                <strong>Author:</strong> Abdullah Al Rakib (Founder &amp; CEO, EduExpress International) · <strong>Reviewer:</strong> Sakib Al Jubaer (Managing Director)
              </div>
              <div>
                <strong>Last Verified:</strong> November 2026 · <strong>Next Scheduled Audit:</strong> February 2027
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Conversion Lead Assessment */}
      <Section
        id="visa-assessment"
        tone="sage"
        title="Get Your Free South Korea Profile &amp; Visa Assessment."
        intro="Find out if your academic background, IELTS/TOPIK score, and financial sponsorship qualify for South Korean degree admissions and embassy visa approval within 1 working day."
      >
        <div className="mx-auto max-w-2xl rounded-3xl border border-rule bg-white p-6 sm:p-8 shadow-sm">
          <EducationFitAssessment />
        </div>
      </Section>
    </article>
  );
}

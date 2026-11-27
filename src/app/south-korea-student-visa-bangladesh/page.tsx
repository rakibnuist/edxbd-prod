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
const PATH = '/south-korea-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const KOREA_VISA_SOURCES = [
  {
    label: 'Embassy of the Republic of Korea in Dhaka — Consular & D-2/D-4 Student Visa Guidelines',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Statutory consular mission in Baridhara Diplomatic Enclave, Dhaka governing D-2/D-4 visa checklists, TB screening hospitals, and the 14 designated commercial banks for solvency certificates.',
  },
  {
    label: 'HiKorea (Korea Immigration Service — Ministry of Justice)',
    href: 'https://www.hikorea.go.kr/',
    note: 'Official Korean Immigration portal for e-Visa verification, Alien Registration Card (ARC) biometrics within 90 days, S-3 part-time work permits, and D-10 Job Seeker visas.',
  },
  {
    label: 'Study in Korea (National Institute for International Education — NIIED)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Korean Ministry of Education portal administering Global Korea Scholarship (GKS) visa invitations, IEQAS-certified university status, and TOPIK verification.',
  },
  {
    label: 'Republic of Korea Visa Portal (e-Visa & Certificate of Visa Issuance Confirmation)',
    href: 'https://www.visa.go.kr/',
    note: 'Official Ministry of Justice system for downloading the Visa Grant Notice and tracking Visa Issuance Numbers (VIN).',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and remitting semester tuition to Korean universities before Certificate of Admission (CoA) issuance.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'South Korea Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'South Korea D-2 & D-4 student visa guide for Bangladeshi students: Dhaka Korean Embassy rules, 14 approved banks ($16k–$20k solvency), CoA, and ARC.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('south-korea', 'South Korea Student Visa from Bangladesh — EduExpress International'),
  });
}

const KOREA_VISA_FAQS = [
  {
    question: 'What is the difference between the South Korea D-2 and D-4 student visa categories?',
    answer:
      'The D-2 Visa is issued to full-time academic degree students enrolled in Korean universities: D-2-1 (Associate Degree), D-2-2 (Bachelor’s Degree), D-2-3 (Master’s Degree), and D-2-4 (PhD/Doctoral Degree). The D-4-1 Visa is issued specifically to students enrolled in non-degree Korean language training programs at a university-affiliated Korean Language Institute (KLI). Bangladeshi applicants targeting English-taught or Korean-taught bachelor’s and master’s programs apply directly under the D-2 category.',
  },
  {
    question: 'Why does the Korean Embassy in Dhaka only accept bank statements from 14 designated banks?',
    answer:
      'To combat fraudulent financial statements, the Embassy of the Republic of Korea in Dhaka enforces a strict rule requiring self-funded D-2 and D-4 visa applicants to submit bank solvency certificates and 6-month transaction statements exclusively from its list of 14 designated commercial banks operating in Bangladesh (including Standard Chartered, HSBC, Eastern Bank PLC, The City Bank, BRAC Bank, Prime Bank, Dhaka Bank, Mutual Trust Bank, Dutch-Bangla Bank, and others specified in the current Embassy notice). Statements from non-listed banks or cooperative societies are automatically rejected.',
  },
  {
    question: 'How much bank balance is required for a South Korean D-2 student visa from Bangladesh?',
    answer:
      'For self-funded degree students, the financial solvency threshold depends on university region: approximately USD 20,000 (~24.4 Lakh BDT) for universities in the Seoul Capital Area (Seoul, Incheon, Gyeonggi-do) and USD 16,000 to USD 18,000 (~19.5 to 22.0 Lakh BDT) for regional universities outside the capital metropolitan area (such as KAIST in Daejeon, Kyungpook National in Daegu, or Pusan National in Busan). Funds must be held in the student’s or biological parents’ account at one of the 14 Embassy-designated banks for at least 30 to 90 days. Full Global Korea Scholarship (GKS) scholars are exempt from this bank balance requirement.',
  },
  {
    question: 'What is a Certificate of Admission (CoA) and how is it issued by a Korean university?',
    answer:
      'The Certificate of Admission (CoA — 표준입학허가서) is the statutory immigration sponsorship document issued by a Korean university’s International Office after you pass academic screening and remit your first-semester tuition invoice via a Bangladesh Bank Student File. Every CoA carries an official Korean Ministry of Justice barcode and serial number, which is mandatory to lodge your D-2 visa application at the Korean Embassy in Dhaka.',
  },
  {
    question: 'Where do Bangladeshi students complete the mandatory Tuberculosis (TB) test for a Korean student visa?',
    answer:
      'All Bangladeshi citizens applying for a long-term Korean visa (staying over 90 days) must submit a Tuberculosis (TB) clearance certificate issued strictly by one of the Korean Embassy Dhaka’s designated panel hospitals/clinics (such as United Hospital, Evercare Hospital, Square Hospital, or ICDDR,B / IOM designated diagnostics per the Embassy’s active circular). The chest X-ray and sputum/blood check certificate is valid for 3 months from the date of issue.',
  },
  {
    question: 'What are the part-time work (S-3) and post-study work (D-10) rules in South Korea?',
    answer:
      'D-2 degree students can apply via HiKorea for an S-3 Part-Time Work Permit from the Korean Immigration Service. Students meeting the required TOPIK (Korean proficiency) or English-track criteria may work 20 to 25 hours per week during semester terms and unlimited hours during official vacations at Korea’s statutory minimum wage (KRW 10,030/hour). After graduating with a Bachelor’s, Master’s, or PhD, you can switch to the D-10-1 Job Seeker Visa for up to 2 years to transition into a full-time E-7 Professional Employment Visa.',
  },
];

export default async function SouthKoreaStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { contains: 'Korea' }, isActive: true },
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
        name: 'South Korea Student Visa from Bangladesh 2027: D-2 Visa, 14 Banks & CoA Guide',
        description:
          'South Korea D-2 & D-4 student visa guide for Bangladeshi students: Dhaka Korean Embassy rules, 14 approved banks ($16k–$20k solvency), CoA, and ARC.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/south-korea.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(KOREA_VISA_SOURCES),
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
          { name: 'Student Visa' },
        ]}
        eyebrow="D-2 Degree & GKS Visa Guide · Dhaka Korean Embassy Rules · BDT 0 Upfront Fee"
        title="South Korea Student Visa from Bangladesh 2027."
        lead="A complete consular and financial guide for Bangladeshi students applying for the South Korean D-2 Student Visa at the Embassy of the Republic of Korea in Dhaka: securing your Certificate of Admission (CoA), meeting the 14-designated-bank solvency rules, consular legalization, and post-arrival ARC registration."
        actions={
          <>
            <Link href="/apply?country=South%20Korea" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Korea Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare South Korea Tuition &amp; Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="South Korea" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="South Korea visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 USD ≈ 122 BDT</strong> · <strong>1,000 KRW ≈ 90 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Written ClearCost Sheet
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Visa Categories
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">D-2-2 / D-2-3 / D-2-4</p>
              <p className="mt-1 text-xs text-slate-600">Bachelor (D-2-2), Master (D-2-3), PhD (D-2-4) &amp; Language (D-4-1).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Bank Solvency (Dhaka)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">USD 16,000 – 20,000</p>
              <p className="mt-1 text-xs text-slate-600">Held in one of the Korean Embassy Dhaka’s 14 designated banks.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Consular Authority
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Korean Embassy Dhaka</p>
              <p className="mt-1 text-xs text-slate-600">Baridhara Diplomatic Enclave; e-Visa Grant Notice via visa.go.kr.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Post-Arrival &amp; Work
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">ARC + 2-Yr D-10 PSW</p>
              <p className="mt-1 text-xs text-slate-600">90-day Alien Registration Card, S-3 work permit, and D-10 job visa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Visa Categories & Solvency Table */}
      <Section
        id="visa-categories"
        tone="white"
        title="South Korean student visa categories &amp; Dhaka Embassy solvency matrix."
        intro="The Embassy of the Republic of Korea in Dhaka evaluates your visa sub-class based on degree level, IEQAS university accreditation, and bank solvency."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">South Korea D-2 and D-4 student visa categories and financial requirements</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Visa Code &amp; Track</th>
                <th className="px-6 py-4 font-bold">Target Program</th>
                <th className="px-6 py-4 font-bold">Required Solvency (USD / BDT)</th>
                <th className="px-6 py-4 font-bold">Language &amp; Key Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">D-2-2 (Undergraduate)</td>
                <td className="px-6 py-4">4-Year Bachelor’s Degree</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">$20,000 Seoul (~24.4L BDT) / $16k–$18k Regional</td>
                <td className="px-6 py-4">IELTS 5.5–6.5 (English track) or TOPIK 3+ (Korean track)</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">D-2-3 (Master’s) &amp; D-2-4 (PhD)</td>
                <td className="px-6 py-4">Graduate &amp; Research Degrees</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">$20,000 Seoul (~24.4L BDT) / $16k–$18k Regional</td>
                <td className="px-6 py-4">IELTS 6.0+ / TOPIK 4+ or Professor Lab Acceptance + Tuition Waiver</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">D-2 (GKS Government Scholar)</td>
                <td className="px-6 py-4">Bachelor’s, Master’s, PhD (+1 Yr Korean)</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">$0 Bank Solvency (Waived by NIIED Invitation)</td>
                <td className="px-6 py-4">Official NIIED GKS Final Invitation Letter; Visa fee waived</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">D-4-1 (Language Trainee)</td>
                <td className="px-6 py-4">University Korean Language Institute</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">$10,000+ (~12.2L BDT) frozen/held per Embassy rules</td>
                <td className="px-6 py-4">Strict scrutiny at Dhaka Embassy; IEQAS-certified university required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: 6-Stage D-2 Visa Roadmap */}
      <Section
        id="visa-process"
        tone="sage"
        title="6-stage South Korea D-2 student visa process in Dhaka."
        intro="Korea enforces two distinct intakes — March (Spring, primary) and September (Autumn). Start document legalization at least 3 months before your semester begins."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'University Admission & Tuition Invoice',
              timeline: '12–16 Weeks Before Intake',
              body: 'Pass the Korean university’s document evaluation and department interview. Receive your conditional acceptance and 1st-semester tuition invoice (after merit scholarship deduction).',
            },
            {
              step: 'Stage 02',
              title: 'Student File SWIFT & CoA Issuance',
              timeline: '8–12 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh to wire 1st-semester tuition. The university then issues your barcoded Certificate of Admission (CoA — 표준입학허가서).',
            },
            {
              step: 'Stage 03',
              title: 'MoFA & Korean Embassy Document Legalization',
              timeline: '6–10 Weeks Before Intake',
              body: 'Attest original academic certificates and transcripts via Education Board, Ministry of Education, MoFA Dhaka, and obtain consular legalization / Apostille verification.',
            },
            {
              step: 'Stage 04',
              title: '14-Bank Solvency & Designated Hospital TB Test',
              timeline: '4–6 Weeks Before Intake',
              body: 'Obtain the official 6-month bank statement and solvency certificate from one of the Korean Embassy’s 14 designated banks, plus your TB clearance from an Embassy-approved hospital in Dhaka.',
            },
            {
              step: 'Stage 05',
              title: 'Dhaka Korean Embassy Submission & Interview',
              timeline: '4–5 Weeks Before Intake',
              body: 'Submit your CoA, legalized certificates, family relation proof, sponsor tax returns (TIN/IT-10B), and bank documents to the Embassy of the Republic of Korea in Baridhara, Dhaka.',
            },
            {
              step: 'Stage 06',
              title: 'e-Visa Grant Notice & 90-Day ARC Card',
              timeline: '2–3 Weeks Visa Processing',
              body: 'Download your electronic Visa Grant Notice from visa.go.kr, fly to Incheon (ICN), and complete biometrics at the local HiKorea immigration office within 90 days to receive your Alien Registration Card (ARC).',
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

      {/* Module 3: Dhaka Embassy Compliance & Refusal Prevention */}
      <Section
        id="compliance"
        tone="white"
        title="Korean Embassy Dhaka financial verification &amp; refusal prevention."
        intro="The Consular Section in Baridhara conducts direct bank verification and academic credibility screening on every D-2 application."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">Mandatory Sponsor &amp; Family Documentation</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Strict Parent-Only Sponsorship:</strong> The Korean Embassy in Dhaka generally requires the financial sponsor to be the student’s biological parents (or self/spouse). Third-party or distant relative sponsors face high refusal rates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Family Relation Certificate (FRC):</strong> Submit an official English Family Relation Certificate issued by your City Corporation / Union Parishad and attested by MoFA, matching parent names across your NID, passport, and SSC/HSC certificates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Verifiable Parent Income Trail:</strong> Include your parent’s latest 3 years of National Board of Revenue (NBR) Income Tax acknowledgment receipts, IT-10B wealth statement, trade license (for business owners), or employer salary certificate.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Top D-2 Visa Refusal Triggers in Dhaka</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Non-Listed Bank Statements:</strong> Submitting solvency from a bank outside the Korean Embassy’s 14 designated commercial banks, or failing to respond when the Embassy phones the branch manager.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Applying to Non-IEQAS / Restricted Universities:</strong> Choosing low-tier colleges placed under visa restriction by the Korean Ministry of Justice due to high international student dropout rates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Name Spelling Discrepancies:</strong> Mismatched parent name spellings between your Birth Certificate, Family Relation Certificate, and your father’s tax/bank records.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified South Korean Universities */}
      {universities.length > 0 && (
        <Section
          id="korea-universities"
          tone="sage"
          title="Verified South Korean universities in the EduExpress directory."
          intro="Compare IEQAS-certified Korean research and national universities offering English-track degrees and merit scholarships."
          action={
            <Link href="/universities?country=south-korea" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all South Korea universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'South Korea'}</span>
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
              BDT 0 File-Opening Charge · ClearCost Breakdown in Writing
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We charge zero upfront file-opening fees for South Korea. Every university application fee, Student File tuition transfer, document legalization cost, and hospital TB screening fee is itemized in writing on your <strong>ClearCost Sheet</strong> before you proceed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-south-korea-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                South Korea Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                South Korea Tuition &amp; Living Cost Breakdown
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
        items={KOREA_VISA_FAQS}
        title="Frequently asked questions about the South Korea student visa."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Korean immigration sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KOREA_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Embassy of the Republic of Korea in Dhaka D-2 consular notices, HiKorea Ministry of Justice regulations, and NIIED Study in Korea guidelines on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, GKS or university scholarship award, CoA issuance, and D-2/D-4 visa decisions rest solely with the respective Korean universities, NIIED, and the Embassy of the Republic of Korea in Dhaka.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">D-2 Eligibility &amp; 14-Bank Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your South Korea Student Visa &amp; Scholarship Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic GPA, IELTS/TOPIK status, and target intake (March or September). Our Dhanmondi team will review your IEQAS university options and 14-bank solvency plan within one working day.
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

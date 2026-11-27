import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/student-visa-bank-solvency-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const SOLVENCY_SOURCES = [
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy Department (FE Circular No. 37 & Student File Rules)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Statutory central bank regulations governing Authorized Dealer (AD) Student Files, Form TM tuition SWIFT wire transfers, and international Education Cards.',
  },
  {
    label: 'Chinese Embassy in Dhaka & Chinese Visa Application Service Center',
    href: 'https://visaforchina.cn/DAC3_EN',
    note: 'X1/X2 student visa financial support evidence (~USD 2,500+ minimum baseline or scholarship award coverage).',
  },
  {
    label: 'UK Visas and Immigration (UKVI) — Student Route Financial Evidence Guidance',
    href: 'https://www.gov.uk/student-visa/money',
    note: 'Statutory 28-day consecutive bank balance rule: unpaid 1st-year tuition + £13,347 (London) or £10,224 (Outside London).',
  },
  {
    label: 'Finnish Immigration Service (Migri) — Income Requirement for Students',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Statutory EUR 800/month (EUR 9,600/year) liquid balance required strictly inside the student’s sole personal bank account.',
  },
  {
    label: 'Embassy of the Republic of Korea in Dhaka — 14 Designated Commercial Banks Circular',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Mandatory USD 16,000–20,000 bank solvency certificate issued strictly by one of the Korean Embassy Dhaka’s 14 approved banks.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Student Visa Bank Solvency Guide for Bangladesh 2027',
    description:
      'Compare student visa bank balance, maturity rules, and Bangladesh Bank Student File (FE Circular 37) guidelines across China, UK, Finland, Korea & Europe.',
    path: PATH,
    locale: 'en_BD',
    image: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Student Visa Bank Solvency & Bangladesh Bank Student File Guide — EduExpress International',
    },
  });
}

const SOLVENCY_FAQS = [
  {
    question: 'Which countries require the lowest bank balance for a student visa from Bangladesh?',
    answer:
      'China and Malaysia require the lowest financial solvency thresholds among major destinations. For China (X1/X2 student visa in Dhaka), applicants typically show a closing bank balance equivalent to at least USD 2,500 to USD 5,000 (~3.1 to 6.2 Lakh BDT) for scholarship or low-tuition tracks (or 1 year of uncovered tuition + living costs for self-funded tracks) in the student’s or parents’ account. For Malaysia, once your first-semester fees and EMGS charges are remitted via a Bangladesh Bank Student File, the High Commission in Dhaka requires only standard parent/student bank statements without a heavy frozen balance.',
  },
  {
    question: 'What is the difference between UK, Finland, and South Korea bank solvency rules?',
    answer:
      'Each of these three destinations enforces a unique statutory rule: (1) The UK requires (Unpaid 1st-Year Tuition + £13,347 London / £10,224 Outside London) held without a single day’s dip for 28 consecutive days in a student or parent savings/FDR account, dated within 31 days of application. (2) Finland (Migri) requires EUR 9,600 (~12.48 Lakh BDT) held strictly in the STUDENT’S OWN personal bank account (parent statements alone are rejected unless transferred to the student’s account with a Deed of Gift and tax trail). (3) South Korea requires USD 16,000–20,000 (~19.5L–24.4L BDT) held exclusively in one of the Korean Embassy Dhaka’s 14 designated commercial banks (waived for full GKS scholars).',
  },
  {
    question: 'Who is legally allowed to be a financial sponsor for a Bangladeshi student visa?',
    answer:
      'For the highest visa approval rate across all embassies, your financial sponsor should be your biological parents (father and/or mother) or yourself. Notice the strict rules by destination: UKVI accepts only the student, biological/adoptive parents, or a legal guardian (uncles, aunts, siblings, or cousins are strictly prohibited by UKVI). Finland requires the living funds to sit in the student’s personal account. Schengen embassies (Hungary, Malta, Greece, Croatia) and China strongly prefer parents, though close blood relatives may be considered only with a MoFA-attested Family Relation Certificate (FRC), notarized Affidavit of Sponsorship, and strong NBR tax returns.',
  },
  {
    question: 'Why do "bank loan show-money" schemes from local agencies cause visa rejections?',
    answer:
      'Some unethical consultancies offer to arrange temporary "show money" or backdated FDRs in exchange for interest payments. Modern consular anti-fraud units (UKVI Sheffield/New Delhi, Migri Finland, NDGAP Hungary, and the Korean Embassy Dhaka) verify funds in three ways: (1) auditing the 6-month transaction history to check if the deposit came from a sudden unexplained cash drop; (2) cross-checking the sponsor’s National Board of Revenue (NBR) IT-10B wealth statement and tax return acknowledgment; and (3) directly phoning or emailing the issuing bank’s Head Office compliance unit. Fraudulent bank certificates trigger a 5-to-10-year immigration ban.',
  },
  {
    question: 'How do I open a Bangladesh Bank "Student File" to remit university tuition legally?',
    answer:
      'Under Bangladesh Bank Foreign Exchange Guidelines, you visit an Authorized Dealer (AD) commercial bank branch (such as Eastern Bank PLC, The City Bank, BRAC Bank, Prime Bank, Standard Chartered, HSBC, MTB, or Dhaka Bank) with: (1) your valid Passport and NID; (2) original SSC, HSC, and Bachelor certificates; (3) the foreign university’s unconditional Offer Letter; and (4) the official Tuition Invoice showing the university’s IBAN and SWIFT code. The bank opens a Student File and remits your tuition via SWIFT MT103 (Form TM), which is mandatory legal proof for your embassy visa interview.',
  },
  {
    question: 'Does EduExpress charge any fee for Student File and bank solvency structuring?',
    answer:
      'No. EduExpress charges BDT 0 for file opening and provides complete bank solvency auditing, sponsor affidavit formatting, and Bangladesh Bank Student File documentation guidance as part of our transparent counseling process.',
  },
];

export default async function StudentVisaBankSolvencyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Student Visa Bank Solvency & Bangladesh Bank Student File Guide (2027) | EduExpress',
        description:
          'Compare student visa bank balance, maturity rules, and Bangladesh Bank Student File (FE Circular 37) guidelines across China, UK, Finland, Korea & Europe.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og-image.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(SOLVENCY_SOURCES),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Fees and Transparency', path: '/fees-and-transparency' },
          { name: 'Student Visa Bank Solvency Guide' },
        ]}
        eyebrow="12-Country Visa Solvency Matrix · Sponsor Rules · Bangladesh Bank Student File (FE Circular 37)"
        title="Student Visa Bank Solvency Guide for Bangladesh 2027."
        lead="Compare exact liquid bank balance requirements, account maturity holding periods, eligible family sponsors, and Bangladesh Bank Student File SWIFT remittance rules across China, the UK, Finland, Hungary, South Korea, Malaysia, and Europe — verified against official embassy regulations."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Audit My Family’s Visa Budget <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-gap-acceptable-countries-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare 12-Country Study Gap Rules
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Module 1: 12-Country Bank Solvency & Sponsor Comparison Table */}
      <Section
        id="solvency-matrix"
        tone="white"
        title="12-country student visa bank solvency &amp; maturity comparison (2027)."
        intro="Every embassy enforces its own rules on minimum closing balance, whose name the bank account must be under, and how many days or months the funds must be seasoned."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
            <caption className="sr-only">12-country student visa bank balance and sponsor rules for Bangladeshi applicants</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Destination &amp; Visa</th>
                <th className="px-5 py-4 font-bold">Required Closing Balance</th>
                <th className="px-5 py-4 font-bold">Approx. BDT Equivalent</th>
                <th className="px-5 py-4 font-bold">Eligible Account Holder</th>
                <th className="px-5 py-4 font-bold">Holding / Maturity Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/china-student-visa-bangladesh" className="hover:underline">China (X1 / X2 Visa)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">USD 2,500 – 5,000+</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~3.1L – 6.2L+ BDT</td>
                <td className="px-5 py-4">Student or Parents (or blood sponsor)</td>
                <td className="px-5 py-4">3–6 month statement; covers 1st-yr uncovered cost</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/malaysia-student-visa-bangladesh" className="hover:underline">Malaysia (EMGS eVAL)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">MYR 15,000 – 25,000</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~4.0L – 6.8L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">3–6 month statement for Dhaka SEV stamping</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/uk-student-visa-bangladesh" className="hover:underline">UK (Student Route)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">Unpaid Fee + £13,347 / £10,224</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~25L – 45L BDT (Total)</td>
                <td className="px-5 py-4">Strictly Student or Parents ONLY</td>
                <td className="px-5 py-4">28 consecutive days untouched; statement ≤31 days old</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/finland-student-visa-bangladesh" className="hover:underline">Finland (Migri Type A)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 9,600 (+ Paid Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~12,48,000 BDT (+ Tuition)</td>
                <td className="px-5 py-4 font-bold text-petrol-800">SOLE Student Personal Account</td>
                <td className="px-5 py-4">Bank-to-bank parent gift transfer + 6-mo sponsor tax trail</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/hungary-student-visa-bangladesh" className="hover:underline">Hungary (NDGAP Type D)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 6,500 – 8,000 (+ Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~8.5L – 10.4L BDT</td>
                <td className="px-5 py-4">Student or Parents (Waived for Stipendium)</td>
                <td className="px-5 py-4">6-month active bank statement + paid tuition SWIFT MT103</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/south-korea-student-visa-bangladesh" className="hover:underline">South Korea (D-2 Visa)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">USD 20,000 (Seoul) / $16k–$18k</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~20.0L – 24.4L BDT</td>
                <td className="px-5 py-4">Student or Parents (14 Approved Banks)</td>
                <td className="px-5 py-4">Held in Korean Embassy’s 14 designated banks (Waived for GKS)</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/malta-student-visa-bangladesh" className="hover:underline">Malta (Identità Study)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 7,500 – 10,000 (+ Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~9.8L – 13.0L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">75% daily living benchmark + 6-month bank &amp; tax history</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/cyprus-student-visa-bangladesh" className="hover:underline">Cyprus (EU CRMD)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 7,000 – 8,500 (+ Deposit)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~9.1L – 11.0L BDT</td>
                <td className="px-5 py-4">Parents or Student</td>
                <td className="px-5 py-4">6-month bank statement attested by bank &amp; MoFA Dhaka</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/georgia-student-visa-bangladesh" className="hover:underline">Georgia (D3 Study Visa)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">USD 3,500 – 5,000 (+ Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~4.3L – 6.1L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">6-month statement + sponsor affidavit</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/greece-student-visa-bangladesh" className="hover:underline">Greece (Type D National)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 6,000 – 7,800 (+ Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~7.8L – 10.1L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">EUR 400–650/mo living proof + 6-month bank trail</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/croatia-student-visa-bangladesh" className="hover:underline">Croatia (MUP Study)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">EUR 6,000 – 7,500 (+ Tuition)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~7.8L – 9.8L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">6-month bank statement + paid 1st-year tuition receipt</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/thailand-student-visa-bangladesh" className="hover:underline">Thailand (Non-Immigrant ED)</Link>
                </td>
                <td className="px-5 py-4 font-bold text-petrol-800">USD 4,000 – 6,000</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">~4.9L – 7.3L BDT</td>
                <td className="px-5 py-4">Student or Parents</td>
                <td className="px-5 py-4">3–6 month statement for Royal Thai Embassy Dhaka</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: How to Build an Embassy-Proof Financial File */}
      <Section
        id="sponsor-documents"
        tone="sage"
        title="The 5 pillars of an embassy-proof financial sponsor file in Bangladesh."
        intro="A bank balance certificate alone is never enough for European, Korean, or UK visas. Consular officers evaluate the entire financial ecosystem behind the account."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Pillar 01',
              title: 'Recognized Commercial Bank Selection',
              body: 'Maintain your funds at an Authorized Dealer commercial bank in Bangladesh with an international verification desk (Standard Chartered, HSBC, EBL, City Bank, BRAC Bank, Prime Bank, MTB, Dhaka Bank). Avoid rural cooperative societies.',
            },
            {
              step: 'Pillar 02',
              title: 'Gradual Deposit & 6-Month Transaction Flow',
              body: 'Embassies inspect 6 months of bank statements. Funds should accumulate organically from salary credits, business revenue, land sale deeds, or matured FDR encashments — never a sudden unexplained cash drop 3 days before printing.',
            },
            {
              step: 'Pillar 03',
              title: 'NBR Income Tax Returns (TIN & IT-10B)',
              body: 'Include your sponsor’s e-TIN certificate, latest 2–3 years of Income Tax Acknowledgment Receipts, and the IT-10B Statement of Assets and Liabilities showing declared wealth matching the bank balance.',
            },
            {
              step: 'Pillar 04',
              title: 'Occupation & Source-of-Income Proof',
              body: 'For salaried sponsors: Employment certificate, 6 months pay slips, and salary bank trail. For business owners: Updated Trade License, Memorandum of Articles (if Ltd), and company bank statement.',
            },
            {
              step: 'Pillar 05',
              title: 'Family Relation & Affidavit of Sponsorship',
              body: 'Notarized Affidavit of Financial Sponsorship on stamp paper + Birth Certificate / MoFA-attested Family Relation Certificate (FRC) proving exact parent-child spelling parity across all passports and NIDs.',
            },
            {
              step: 'Pillar 06',
              title: 'Bangladesh Bank Student File (SWIFT MT103)',
              body: 'Wire university tuition or CAS deposits strictly through an official Student File opened at an AD bank (Form TM), retaining the SWIFT MT103 telegraphic receipt for your visa interview.',
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-xs">
              <div>
                <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-petrol-800">{item.step}</span>
                <h3 className="mt-4 text-[19px] font-bold text-petrol-800">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: FAQs */}
      <FaqBlock
        items={SOLVENCY_FAQS}
        title="Frequently asked questions about student visa bank solvency."
        tone="white"
      />

      {/* Module 4: Official Sources & Disclaimer */}
      <Section id="sources" tone="sage" title="Official central bank &amp; immigration sources.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLVENCY_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and visa issuance decisions rest solely with the respective universities and official embassy authorities.
          </p>
        </div>
      </Section>

      {/* Module 5: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free Bank File &amp; Budget Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Which Countries Match Your Family’s Bank Solvency</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results and comfortable budget range. Our Dhanmondi team will prepare your itemized 1-page ClearCost Sheet and bank maturity schedule within one working day.
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

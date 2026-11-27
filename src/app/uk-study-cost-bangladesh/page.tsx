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
const PATH = '/uk-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const UK_COST_SOURCES = [
  {
    label: 'UK Visas and Immigration (UKVI) — Student Visa Financial Evidence & Maintenance Rates',
    href: 'https://www.gov.uk/student-visa/money',
    note: 'Statutory UKVI maintenance rules: £1,483/month in London vs £1,136/month outside London for up to 9 months, subject to the strict 28-day holding rule.',
  },
  {
    label: 'UKVI — Immigration Health Surcharge (IHS) Regulations',
    href: 'https://www.gov.uk/healthcare-immigration-application/how-much-pay',
    note: 'Official National Health Service (NHS) access fee for international students: £776 per year of visa duration.',
  },
  {
    label: 'International Organization for Migration (IOM) Dhaka — UK TB Screening',
    href: 'https://www.iom.int/',
    note: 'Mandatory pre-departure tuberculosis (TB) detection certificate issued exclusively by IOM Migration Health Assessment Center in Dhaka.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Guidelines & Student File Remittance (FE Circular 37)',
    href: 'https://www.bb.org.bd/',
    note: 'Regulations governing outward educational SWIFT wires and international Education Card quotas via Authorized Dealer (AD) banks.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in the UK from Bangladesh 2027 | EduExpress',
    description:
      'UK study cost breakdown for Bangladeshi students: tuition in GBP & BDT, UKVI maintenance (£1,483/mo London vs £1,136), CAS deposit, IHS, and bank file.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('uk', 'Cost of Studying in the UK from Bangladesh — EduExpress International'),
  });
}

const UK_COST_FAQS = [
  {
    question: 'How much does it cost to study in the UK from Bangladesh in BDT?',
    answer:
      'Total first-year costs depend on whether the university is located inside or outside London and the degree tier. Tuition at modern career-focused universities averages £15,000 to £20,500/year (~23.2 to 31.8 Lakh BDT), while Russell Group research universities range from £22,000 to £38,000/year (~34.1 to 58.9 Lakh BDT). Statutory 9-month living maintenance required by UKVI is £10,224 outside London (~15.8 Lakh BDT) and £13,347 inside London (~20.7 Lakh BDT). Taught 1-Year Master’s programs reduce the total maintenance expense to a single year.',
  },
  {
    question: 'What is the UKVI 28-day bank statement rule for Bangladeshi applicants?',
    answer:
      'UKVI mandates that the total required funds — calculated as (Unpaid First-Year Tuition after CAS deposit) + (9 Months of Living Maintenance) — must be held consecutively in a recognized bank account for at least 28 continuous days. The bank statement closing balance must not fall below the required threshold for even a single day during that 28-day period, and the statement must be dated within 31 days prior to your visa application date.',
  },
  {
    question: 'Which banks in Bangladesh are accepted for UKVI student visa financial evidence?',
    answer:
      'UKVI requires financial statements from financial institutions regulated by Bangladesh Bank that allow direct verification. Commonly utilized banks with reliable international verification departments include Standard Chartered Bangladesh, HSBC Bangladesh, Eastern Bank PLC (EBL), The City Bank PLC, BRAC Bank PLC, Dhaka Bank, Mutual Trust Bank (MTB), and Prime Bank. Cash deposits, unverified cooperative societies, or post office savings accounts are not accepted.',
  },
  {
    question: 'How much is the CAS deposit and how is it paid from Bangladesh?',
    answer:
      'Most UK universities require an advance CAS deposit ranging from £2,000 to £5,000 (approximately 3.1 to 7.75 Lakh BDT) to confirm your unconditional offer and generate your CAS statement. This deposit is deducted directly from your gross tuition invoice. It must be remitted legally through an Authorized Dealer commercial bank in Bangladesh via an official Student File.',
  },
  {
    question: 'What are the pre-departure costs before flying to the UK?',
    answer:
      'Compulsory pre-departure expenses paid directly to official bodies include: the mandatory IOM Dhaka TB medical screening (~12,500 BDT), the UKVI Student Visa application fee of £490 (~76,000 BDT), the Immigration Health Surcharge (IHS) of £776 per year (~120,000 BDT/year), academic certificate attestations, and a one-way flight from Dhaka to London/Manchester (~60,000 to 95,000 BDT). EduExpress charges BDT 0 for admission and visa guidance.',
  },
  {
    question: 'What is the updated UK Graduate Route policy for 2027?',
    answer:
      'Under current UK immigration policy, international graduates completing an eligible undergraduate or master’s degree can apply for the Graduate route for post-study work authorization. The standard duration is 2 years for applications submitted on or before 31 December 2026, transitioning to 18 months for most non-PhD applications from 1 January 2027 onwards (doctoral graduates retain 3 years). Taught postgraduate students cannot sponsor dependants unless enrolled in research degrees.',
  },
];

export default async function UkStudyCostPage() {
  const ukUnis = await prisma.university.findMany({
    where: {
      country: { in: ['UK', 'United Kingdom', 'uk'] },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      tuition: true,
      officialUrl: true,
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
        name: 'Cost of Studying in the UK from Bangladesh | Full BDT & GBP Breakdown (2027)',
        description:
          'Complete financial guide for Bangladeshi students: tuition in GBP and BDT, UKVI maintenance (£1,483/mo London vs £1,136 outside), CAS deposit, IHS, and bank Student File remittance.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/uk.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(UK_COST_SOURCES),
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
          { name: 'United Kingdom', path: '/study-in-uk-from-bangladesh' },
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · Planning Assumption: 1 GBP ≈ 155 BDT · BDT 0 EduExpress Fee"
        title="Cost of Studying in the UK from Bangladesh."
        lead="A comprehensive financial planning guide for Bangladeshi students and families. Granular breakdown of tuition fees, official UKVI living maintenance rules (£1,483/mo London vs £1,136 outside), CAS deposits, IHS healthcare surcharges, and Bangladesh Bank Student File remittance."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/apply?country=UK" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My UK Costs & Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/uk-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              UK Student Visa &amp; CAS Guide
            </Link>
            <a href="#student-file" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Bank Student File Guide
            </a>
          </>
        }
      />

      <TrustBar destination="United Kingdom" />

      {/* Currency Planning Baseline Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold text-sm">
              £
            </span>
            <span>
              Planning Assumption (Nov 2026): <strong>1 GBP ≈ 155 BDT</strong>{' '}
              <span className="font-normal text-slate-500">
                (illustrative planning reference — confirm live Authorized Dealer bank TT selling rates before remittance)
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• No Hidden Surcharges</span>
            <span>• Direct University & UKVI Payments</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
              EduExpress Fee: BDT 0
            </span>
          </div>
        </div>
      </section>

      {/* Module 1: Pre-Departure Third-Party & Visa Costs */}
      <Section
        id="pre-departure"
        title="Pre-Departure Third-Party &amp; Visa Costs"
        intro="Itemized official expenses required before departing from Hazrat Shahjalal International Airport (Dhaka) to the UK. All charges are paid directly to designated statutory authorities."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Official Fee Item</th>
                <th className="p-4">Statutory Fee (GBP / BDT)</th>
                <th className="p-4">Approx. BDT Equivalent (@ 155 BDT)</th>
                <th className="p-4">Payment Recipient &amp; Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">IOM TB Medical Screening (Dhaka)</td>
                <td className="p-4 font-semibold">12,500 BDT</td>
                <td className="p-4">12,500 BDT</td>
                <td className="p-4 text-slate-600">IOM Migration Health Assessment Center (Mandatory for UKVI)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">UKVI Student Visa Application Fee</td>
                <td className="p-4 font-semibold">£490</td>
                <td className="p-4">~75,950 BDT</td>
                <td className="p-4 text-slate-600">UK Visas &amp; Immigration (Paid online during visa submission)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Immigration Health Surcharge (IHS)</td>
                <td className="p-4 font-semibold">£776 / year</td>
                <td className="p-4">~120,280 BDT / yr</td>
                <td className="p-4 text-slate-600">UK National Health Service (NHS) access fee for full visa duration</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">University CAS Deposit</td>
                <td className="p-4 font-semibold">£2,000 – £5,000</td>
                <td className="p-4">~3.10L – 7.75L BDT</td>
                <td className="p-4 text-slate-600">Direct to University (Deducted from gross 1st year tuition)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Academic &amp; Police Attestation</td>
                <td className="p-4 font-semibold">2,000 – 4,000 BDT</td>
                <td className="p-4">2,000 – 4,000 BDT</td>
                <td className="p-4 text-slate-600">Education Board, MOE &amp; MOFA Dhaka attestation fees</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka to UK)</td>
                <td className="p-4 font-semibold">£380 – £650</td>
                <td className="p-4">~58,900 – 100,750 BDT</td>
                <td className="p-4 text-slate-600">Airlines (Biman, Emirates, Qatar, Saudia, Turkish Airlines)</td>
              </tr>
              <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                <td className="p-4">EduExpress Student Counseling Charge</td>
                <td className="p-4">£0</td>
                <td className="p-4">BDT 0 (Free Service)</td>
                <td className="p-4">Free admission counseling &amp; CAS compliance review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: UKVI Official Maintenance Funds Proof (The 28-Day Bank Rule) */}
      <Section
        id="ukvi-funds"
        tone="sage"
        title="UKVI Official Maintenance Requirement &amp; The 28-Day Bank Rule"
        intro="The UK Visas and Immigration (UKVI) financial requirement is non-negotiable. Applicants must prove exact statutory living funds in a recognized bank account held consecutively for 28 days."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-7 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">London Campuses</span>
            <h3 className="mt-2 text-xl font-bold text-petrol-800">Inside Greater London</h3>
            <p className="mt-1 text-xs text-slate-500">Applicable to all universities within the Greater London Area</p>

            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Statutory Rate:</span>
                <span className="font-bold text-petrol-800">£1,483 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">9-Month Maximum Requirement:</span>
                <span className="font-bold text-emerald-800">£13,347 total</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Approx. BDT Equivalent (@ 155):</span>
                <span className="font-bold text-petrol-800">~20.69 Lakh BDT</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Inner &amp; Outer London boroughs are subject to the higher £1,483/month rate to reflect elevated accommodation and transport (Oyster Zones 1–4) costs.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-7 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Regional Campuses</span>
            <h3 className="mt-2 text-xl font-bold text-petrol-800">Outside Greater London</h3>
            <p className="mt-1 text-xs text-slate-500">Manchester, Birmingham, Leeds, Sheffield, Bristol, Coventry, Glasgow</p>

            <div className="mt-5 space-y-3 rounded-2xl bg-sand-50/80 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Statutory Rate:</span>
                <span className="font-bold text-petrol-800">£1,136 / month</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">9-Month Maximum Requirement:</span>
                <span className="font-bold text-emerald-800">£10,224 total</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2.5">
                <span className="text-slate-600">Approx. BDT Equivalent (@ 155):</span>
                <span className="font-bold text-petrol-800">~15.85 Lakh BDT</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Studying outside London reduces the statutory visa solvency requirement by over £3,120 (~4.84 Lakh BDT) while offering lower average private housing rents.
            </p>
          </div>
        </div>

        {/* The Exact Visa Solvency Calculation Formula */}
        <div className="mt-8 rounded-2xl border-2 border-petrol-800 bg-petrol-900 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-xl bg-petrol-800 p-2.5 text-emerald-400">
              <Scale className="size-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Official UKVI Visa Solvency Formula:
              </h4>
              <p className="mt-2 font-mono text-sm text-sand-100 bg-petrol-950/60 p-3 rounded-xl border border-emerald-500/20">
                Required Bank Balance = (Gross 1st-Year Tuition − CAS Deposit Paid) + (9 Months UKVI Maintenance)
              </p>
              <p className="mt-3 text-xs leading-relaxed text-sand-200">
                <strong>Example Calculation:</strong> If your university tuition is £17,000 outside London and you paid a £3,000 CAS deposit, your unpaid tuition balance is £14,000. Your maintenance is £10,224. Your bank statement must show at least <strong>£24,224 (~37.55 Lakh BDT)</strong> held continuously for 28 consecutive days prior to visa submission.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 3: Annual Tuition Fees by University Tier */}
      <Section
        id="tuition"
        tone="white"
        title="Annual Tuition Fees by University Category"
        intro="Tuition fees in the UK vary based on academic prestige, laboratory/clinical intensity, and program level. Explore typical international fee bands."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tier 1 · Research Intensive</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">Russell Group Universities</h3>
            <p className="mt-1 text-xs text-slate-500">Manchester, Birmingham, Leeds, Glasgow, Sheffield, Cardiff</p>

            <div className="mt-4 space-y-2 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Undergraduate (UG):</span>
                <span className="font-bold text-petrol-800">£22,000 – £34,000 / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Postgraduate (PGT):</span>
                <span className="font-bold text-petrol-800">£24,000 – £38,000 / yr</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">BDT Equivalent (@ 155):</span>
                <span className="font-bold text-emerald-800">~34L – 59L BDT/yr</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              World top 100 rankings, world-leading research facilities, and high employer recognition globally. Some universities (Leeds, Sheffield) offer fixed tuition guarantees.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tier 2 · Career-Focused</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">Modern Public Universities</h3>
            <p className="mt-1 text-xs text-slate-500">Coventry University, UWE Bristol, Teesside, Hertfordshire</p>

            <div className="mt-4 space-y-2 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Undergraduate (UG):</span>
                <span className="font-bold text-petrol-800">£16,000 – £20,500 / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Postgraduate (PGT):</span>
                <span className="font-bold text-petrol-800">£17,000 – £22,000 / yr</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">BDT Equivalent (@ 155):</span>
                <span className="font-bold text-emerald-800">~24.8L – 34L BDT/yr</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              High practical employability, optional 1-year industrial placements, and accessible academic entry bars. Generous merit scholarships (£1,500–£4,000) readily available.
            </p>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tier 3 · Fast-Track Value</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">1-Year Taught Master’s (MSc / MBA)</h3>
            <p className="mt-1 text-xs text-slate-500">Completed in 12 consecutive months (180 credits)</p>

            <div className="mt-4 space-y-2 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Degree Tuition:</span>
                <span className="font-bold text-petrol-800">£16,500 – £28,000 total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Maintenance:</span>
                <span className="font-bold text-petrol-800">Only 1 Year Required</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">Total Budget (Tuition+Living):</span>
                <span className="font-bold text-emerald-800">~41L – 64L BDT Total</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Completing a Master’s degree in 1 year halves total accommodation and maintenance costs compared to 2-year programs in the USA, Canada, or Australia.
            </p>
          </div>
        </div>

        {/* Verified UK Universities List */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-sand-50/50 p-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-petrol-800 text-sm">Verified UK Higher Education Institutions on EduExpress</h4>
            <Link href="/study-in-uk-from-bangladesh#universities" className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1">
              View All 8 Universities <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {ukUnis.map((u) => (
              <div key={u.id} className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
                <p className="text-xs font-bold text-petrol-800 truncate">{u.name}</p>
                <p className="text-[11px] text-slate-500">{u.city}, UK</p>
                <p className="mt-1 text-[11px] font-semibold text-emerald-800 truncate">{u.tuition}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Module 4: Real Monthly Living Cost Breakdown in the UK */}
      <Section
        id="living-costs"
        tone="sage"
        title="Realistic Monthly Living Expenses (London vs Regional)"
        intro="Actual student expenditure breakdown based on typical international student lifestyles in student halls or shared private flats."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Living Expenditure</th>
                <th className="p-4">Outside London (Monthly)</th>
                <th className="p-4">Inside London (Monthly)</th>
                <th className="p-4">Budget Saving Tips for Bangladeshi Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">Student Accommodation (Rent + Bills)</td>
                <td className="p-4">£450 – £700 / mo</td>
                <td className="p-4">£750 – £1,150 / mo</td>
                <td className="p-4 text-slate-600">Shared student flat outside zone 2; utility bills included in halls</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Food, Groceries &amp; Halal Meat</td>
                <td className="p-4">£150 – £220 / mo</td>
                <td className="p-4">£180 – £260 / mo</td>
                <td className="p-4 text-slate-600">Shop at budget supermarkets (Aldi, Lidl, Asda) &amp; local Bengali/Asian bazaars</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Local Public Transportation</td>
                <td className="p-4">£45 – £70 / mo</td>
                <td className="p-4">£90 – £160 / mo</td>
                <td className="p-4 text-slate-600">Use 18+ Student Oyster (30% discount) in London or student bus passes</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Mobile SIM, Internet &amp; Personal Care</td>
                <td className="p-4">£30 – £50 / mo</td>
                <td className="p-4">£35 – £55 / mo</td>
                <td className="p-4 text-slate-600">SIM-only contracts (giffgaff, VOXI, Smarty) with unlimited data for £10–15</td>
              </tr>
              <tr className="bg-sand-50/80 font-bold text-petrol-800">
                <td className="p-4">Total Real Monthly Expenditure</td>
                <td className="p-4 text-emerald-800">£675 – £1,040 / month (~1.05L – 1.61L BDT)</td>
                <td className="p-4 text-emerald-800">£1,055 – £1,625 / month (~1.64L – 2.52L BDT)</td>
                <td className="p-4 text-[11px] font-normal text-slate-600">Living outside London saves approx. £400–£600 monthly in pure living costs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 5: Step-by-Step Bangladesh Bank Student File Remittance Guide */}
      <Section
        id="student-file"
        tone="white"
        title="Bangladesh Bank Student File &amp; SWIFT Remittance Guide"
        intro="Under Bangladesh Bank foreign exchange regulations, university tuition and living expenses must be remitted legally through an Authorized Dealer (AD) bank. Here is the exact legal procedure."
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              01
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Unconditional Offer &amp; CAS</h4>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">
              Receive your formal Unconditional Offer Letter and CAS document from the UK university containing official bank account details, course fee, and student reference number.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              02
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Open Student File at AD Bank</h4>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">
              Visit an Authorized Dealer bank (e.g. City Bank, EBL, BRAC Bank, Standard Chartered). Submit student passport, National ID, verified academic certificates, offer letter, and sponsor TIN.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              03
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">Direct SWIFT Outward Wire</h4>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">
              Remit the CAS deposit and first-semester tuition directly to the university’s official UK bank account via SWIFT. The bank issues official Form A and remittance certificates.
            </p>
          </div>

          <div className="rounded-2xl border border-petrol-800/15 bg-white p-5 shadow-xs">
            <span className="flex size-7 items-center justify-center rounded-lg bg-petrol-800 text-[12px] font-bold text-white">
              04
            </span>
            <h4 className="mt-3 font-display text-[16px] font-bold text-petrol-800">International Education Card</h4>
            <p className="mt-2 text-[13px] leading-5 text-slate-600">
              Under Bangladesh Bank FE Circular No. 37, obtain an international student debit card with an annual quota of up to USD 12,000 equivalent for initial living allowances upon arrival in the UK.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-600/20 bg-amber-50/50 p-4 text-xs text-amber-950">
          <p>
            <strong>Caution Against Informal Transfers (Hundi):</strong> Sending educational funds or CAS deposits through unauthorized informal channels (Hundi) is illegal under the Foreign Exchange Regulation Act and can lead to immediate visa refusal under UKVI fraud verification rules. EduExpress guides families strictly on legitimate banking procedures.
          </p>
        </div>
      </Section>

      {/* Module 6: Part-Time Work Rights & Graduate Route Rules */}
      <Section
        id="work-rights"
        tone="sage"
        title="Student Work Rights &amp; Post-Study Career Economics"
        intro="Understand the legal limits of part-time employment during your studies and the statutory policy for the UK Graduate Visa route."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Clock className="size-6 text-petrol-800" />
              <span>Part-Time Work During Term Time</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>20 Hours/Week Limit:</strong> Degree-level students at UK higher education institutions with a track record of compliance are legally permitted to work up to 20 hours per week during term time, and full-time during official vacations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>UK National Living Wage:</strong> The UK National Living Wage is £11.44+ per hour for adults aged 21 and over. Working 20 hours per week yields approximately £800 to £950 per month after basic deductions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Realistic Living Coverage:</strong> Part-time earnings are sufficient to cover monthly groceries, transport, and personal living costs outside London, but cannot replace primary tuition funding.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Prohibited Employment:</strong> Student visa holders cannot be self-employed, engage in professional sports, or take permanent full-time employment during academic terms.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/15 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-petrol-800 text-[18px]">
              <Briefcase className="size-6 text-petrol-800" />
              <span>Graduate Route (Post-Study Work) Reality</span>
            </div>
            <ul className="mt-4 space-y-3 text-[14px] leading-6 text-slate-800">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Unsponsored Work Permission:</strong> The Graduate route allows bachelor’s and master’s graduates to work in any role without requiring a sponsor or meeting minimum salary thresholds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Statutory Policy Timeline:</strong> The visa runs for 2 years for applications submitted on or before 31 December 2026, and 18 months for most non-PhD applications from 1 January 2027 onwards (3 years for PhDs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Pathway to Skilled Worker:</strong> During the Graduate visa period, graduates can gain UK experience and transition to a Skilled Worker Visa if sponsored by an employer meeting UK Home Office salary thresholds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-emerald-700">•</span>
                <span><strong>Dependant Restrictions:</strong> Under current policy, dependants can only accompany international students enrolled in postgraduate research (PhD/Doctoral) degrees or government-sponsored programs.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 7: FAQ Section */}
      <Section id="faqs" tone="white" title="Frequently asked questions about UK study costs.">
        <FaqBlock items={UK_COST_FAQS} />
      </Section>

      {/* Module 8: Official Sources & Review Desk */}
      <Section id="sources" tone="sage" title="Official sources &amp; editorial review ownership.">
        <div className="grid gap-4 sm:grid-cols-2">
          {UK_COST_SOURCES.map((src) => (
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
            <strong>Editorial &amp; Review Ownership:</strong> Senior Counseling Desk, EduExpress International (Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209). Content audited against UK Visas &amp; Immigration (UKVI) financial requirements, Home Office Student Sponsor guidance, and Bangladesh Bank foreign exchange rules. Last verified on 27 November 2026. Next scheduled review: 27 February 2027.
          </p>
        </div>
      </Section>

      {/* Module 9: CTA & Education Fit Assessment */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Budget Estimation</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Personalized UK Cost &amp; Visa Financial Assessment</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your target subject, university preference, and budget. Our counselors calculate your exact 28-day UKVI maintenance sum, CAS deposit schedule, and Student File remittance plan with BDT 0 service fees.
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

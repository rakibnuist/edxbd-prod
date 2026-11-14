import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Building,
  CheckCircle2,
  CreditCard,
  FileCheck,
  FileText,
  HelpCircle,
  Home,
  Info,
  Plane,
  Receipt,
  Scale,
  ShieldCheck,
  Smartphone,
  Train,
  Utensils,
  Wallet,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/malaysia-study-cost-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cost of Studying in Malaysia from Bangladesh 2027 | EduExpress',
    description:
      'Complete cost of studying in Malaysia for Bangladeshi students: tuition in MYR and BDT, monthly living expenses, EMGS fees, and bank Student File remittance.',
    path: PATH,
    locale: 'en_GB',
    image: ogImage('malaysia', 'Cost of Studying in Malaysia from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'How much does it cost to study in Malaysia in Bangladeshi Taka (BDT)?',
    answer:
      'Tuition fees at premier Malaysian private universities range from RM 24,000 to RM 42,000 per year (approx. 6.5 lakh to 11.3 lakh BDT). Foreign branch campuses like Monash and Nottingham range from RM 38,000 to RM 58,000 per year (~10.2 lakh to 15.6 lakh BDT), while public universities like UM and UTM average RM 14,000 to RM 24,000 (~3.8 lakh to 6.5 lakh BDT). Monthly living costs average RM 1,200 to RM 2,000 (~32,000 to 54,000 BDT).',
  },
  {
    question: 'Why do Bangladeshi students need to open a Student File for Malaysia?',
    answer:
      'Under Bangladesh Bank foreign exchange regulations, tuition fees and maintenance funds must be remitted legally through an Authorized Dealer (AD) bank. Opening a Student File allows parents to wire tuition directly to the Malaysian university’s bank account via SWIFT and obtain an international Education Card (under FE Circular No. 37) with an annual quota of up to USD 12,000 equivalent for living expenses.',
  },
  {
    question: 'What are the compulsory EMGS visa fees before arriving in Malaysia?',
    answer:
      'Education Malaysia Global Services (EMGS) charges an international student visa processing fee of RM 1,500 to RM 2,000, an Immigration eVAL fee of RM 250 to RM 400, and compulsory pre-paid annual medical insurance of RM 500 to RM 800. These are official Malaysian government and agency charges paid directly.',
  },
  {
    question: 'Are halal food and accommodation affordable in Malaysia?',
    answer:
      'Yes, Malaysia is a Muslim-majority country where 100% halal food is universally available and very affordable. Campus and off-campus shared accommodations range from RM 500 to RM 900 per month (~13,500 to 24,000 BDT), while campus dining and local restaurants average RM 20 to RM 35 per day (~550 to 950 BDT).',
  },
  {
    question: 'Does EduExpress charge any service fee for Malaysian admissions?',
    answer:
      'No. EduExpress charges BDT 0 for Malaysian university guidance, admissions, document attestation advice, and EMGS visa support. Students pay all institutional application fees, visa charges, and tuition directly to the universities and official Malaysian authorities.',
  },
  {
    question: 'Can students get scholarships in Malaysia to reduce their costs?',
    answer:
      'Yes. Premier private universities like Sunway, Taylor’s, APU, and UCSI provide generous international merit scholarships ranging from 15% to 75% tuition fee waivers based on HSC, A-Level, or Bachelor’s CGPA. Sibling discounts and sports bursaries are also widely available.',
  },
];

export default async function MalaysiaStudyCostPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: 'Cost of Studying in Malaysia from Bangladesh | Full BDT & MYR Breakdown',
        description:
          'Complete financial planning guide for Bangladeshi students: tuition in MYR and BDT, living costs, EMGS visa fees, and Bangladesh Bank Student File remittance.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
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
          { name: 'Malaysia', path: '/study-in-malaysia-from-bangladesh' },
          { name: 'Study Costs' },
        ]}
        eyebrow="Transparent Cost Planning · 1 MYR ≈ 27 BDT · BDT 0 EduExpress Fee"
        title="Cost of Studying in Malaysia from Bangladesh."
        lead="A comprehensive financial guide for Bangladeshi families. Granular breakdown of tuition fees, EMGS visa expenses, monthly accommodation and food, plus step-by-step Bangladesh Bank Student File remittance."
        actions={
          <>
            <Link href="/apply?country=Malaysia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Eligibility & Costs <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#student-file" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Bank Student File Guide
            </a>
          </>
        }
      />

      <TrustBar />

      {/* Conversion Banner */}
      <section aria-label="Currency baseline" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime text-petrol-800 font-bold">
              RM
            </span>
            <span>
              Official Planning Baseline: <strong>1 Malaysian Ringgit (MYR) ≈ 27 Bangladeshi Taka (BDT)</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-petrol-800">
            <span>• No Hidden Consultancy Surcharges</span>
            <span>• Direct University & EMGS Payments</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800">
              EduExpress Fee: BDT 0
            </span>
          </div>
        </div>
      </section>

      {/* Module 1: Pre-Departure Expenses */}
      <Section
        id="pre-departure"
        title="Pre-Departure Third-Party & Visa Costs"
        intro="Itemized official third-party expenses required before boarding your flight from Dhaka to Kuala Lumpur. All fees are paid directly to the respective authorities."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-rule bg-canvas-soft font-bold text-petrol-800">
              <tr>
                <th className="p-4">Fee Item</th>
                <th className="p-4">Official Amount (MYR)</th>
                <th className="p-4">Estimated Amount (BDT)</th>
                <th className="p-4">Payment Recipient & Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule text-slate-700">
              <tr>
                <td className="p-4 font-bold text-petrol-800">University Application & Registration</td>
                <td className="p-4">RM 500 – RM 1,000</td>
                <td className="p-4">~13,500 – 27,000 BDT</td>
                <td className="p-4">Direct to University (Upon admission submission)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">EMGS Visa Processing Fee</td>
                <td className="p-4">RM 1,500 – RM 2,000</td>
                <td className="p-4">~40,500 – 54,000 BDT</td>
                <td className="p-4">Direct to EMGS Malaysia (Online portal)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Malaysian Immigration eVAL Fee</td>
                <td className="p-4">RM 250 – RM 400</td>
                <td className="p-4">~6,750 – 10,800 BDT</td>
                <td className="p-4">Included in EMGS invoice / Malaysian Immigration</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Compulsory Medical Insurance (Year 1)</td>
                <td className="p-4">RM 500 – RM 800</td>
                <td className="p-4">~13,500 – 21,600 BDT</td>
                <td className="p-4">EMGS-appointed panel insurer</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">Single Entry Visa (SEV) at Dhaka High Commission</td>
                <td className="p-4">—</td>
                <td className="p-4">~8,000 – 12,000 BDT</td>
                <td className="p-4">High Commission of Malaysia in Dhaka or eVISA</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-petrol-800">One-Way Airfare (Dhaka to Kuala Lumpur)</td>
                <td className="p-4">RM 900 – RM 1,400</td>
                <td className="p-4">~25,000 – 38,000 BDT</td>
                <td className="p-4">Airline (Biman, AirAsia, US-Bangla, Malaysia Airlines)</td>
              </tr>
              <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                <td className="p-4">EduExpress Service Charge</td>
                <td className="p-4">RM 0</td>
                <td className="p-4">BDT 0 (Free Service)</td>
                <td className="p-4">100% Free counseling & visa guidance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Annual Tuition Fees by University Tier */}
      <Section
        id="tuition"
        tone="sage"
        title="Annual Tuition Fees by University Tier"
        intro="Malaysia offers three distinct higher education tiers. Compare public research universities, premier private institutions with UK dual awards, and direct foreign branch campuses."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="text-xs font-black uppercase text-emerald-800">Tier 1 · Public Research</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">Top Public Universities</h3>
            <p className="mt-1 text-xs text-slate-500">Universiti Malaya (UM), UTM Johor Bahru</p>

            <div className="mt-5 space-y-3 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (MYR):</span>
                <span className="font-bold text-petrol-800">RM 14,000 – 24,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (BDT):</span>
                <span className="font-bold text-emerald-800">~3.8L – 6.5L BDT/yr</span>
              </div>
              <div className="flex justify-between border-t border-rule pt-2">
                <span className="text-slate-600">Degrees Offered:</span>
                <span className="font-bold text-petrol-800">Bachelor’s, Master’s, PhD</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Extremely high global rankings (UM #60 world) with highly competitive entry requirements (HSC GPA 4.80+ or strong A-Levels).
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="text-xs font-black uppercase text-emerald-800">Tier 2 · UK Dual Degree</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">Premier Private Universities</h3>
            <p className="mt-1 text-xs text-slate-500">Sunway, Taylor’s, APU, UCSI</p>

            <div className="mt-5 space-y-3 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (MYR):</span>
                <span className="font-bold text-petrol-800">RM 24,000 – 42,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (BDT):</span>
                <span className="font-bold text-emerald-800">~6.5L – 11.3L BDT/yr</span>
              </div>
              <div className="flex justify-between border-t border-rule pt-2">
                <span className="text-slate-600">Degrees Offered:</span>
                <span className="font-bold text-petrol-800">Dual Awards (UK + Malaysia)</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Students graduate with two degrees (e.g. Lancaster UK + Sunway; UWE Bristol + Taylor’s; De Montfort UK + APU) with generous merit scholarships.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <span className="text-xs font-black uppercase text-emerald-800">Tier 3 · Foreign Campuses</span>
            <h3 className="mt-2 text-lg font-bold text-petrol-800">UK / Australian Branch Campuses</h3>
            <p className="mt-1 text-xs text-slate-500">Monash Malaysia, Nottingham, Heriot-Watt</p>

            <div className="mt-5 space-y-3 rounded-2xl bg-canvas-soft p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (MYR):</span>
                <span className="font-bold text-petrol-800">RM 38,000 – 58,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Annual Tuition (BDT):</span>
                <span className="font-bold text-emerald-800">~10.2L – 15.6L BDT/yr</span>
              </div>
              <div className="flex justify-between border-t border-rule pt-2">
                <span className="text-slate-600">Degrees Offered:</span>
                <span className="font-bold text-petrol-800">Direct UK / Australian Parchment</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Identical curriculum, exams, and degree certificate issued directly by Melbourne or the UK, at 65% less than Australian or British campus fees.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 3: Monthly Living Expenses Breakdown */}
      <Section
        id="living-costs"
        title="Monthly Living Expenses in Malaysia"
        intro="What does day-to-day student life cost in Greater Kuala Lumpur, Selangor, and other educational hubs? Here is an itemized monthly budget."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl border border-rule bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-canvas-soft text-emerald-700">
              <Home size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Accommodation</h4>
            <span className="mt-1 block text-xs font-bold text-emerald-800">RM 500 – RM 1,200</span>
            <span className="text-[11px] text-slate-500">~13,500 – 32,400 BDT/mo</span>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Shared room in on-campus hostel or off-campus condo with swimming pool and gym.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-canvas-soft text-emerald-700">
              <Utensils size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Food & Halal Meals</h4>
            <span className="mt-1 block text-xs font-bold text-emerald-800">RM 600 – RM 900</span>
            <span className="text-[11px] text-slate-500">~16,200 – 24,300 BDT/mo</span>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Campus cafeterias and Mamak stalls (Nasi Lemak, Roti Canai, Biryani) cost RM 8–15 per meal.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-canvas-soft text-emerald-700">
              <Train size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Public Transit</h4>
            <span className="mt-1 block text-xs font-bold text-emerald-800">RM 50 – RM 100</span>
            <span className="text-[11px] text-slate-500">~1,350 – 2,700 BDT/mo</span>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              RapidKL LRT, MRT, Monorail and BRT buses with 50% MyRapid international student concession pass.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-canvas-soft text-emerald-700">
              <Smartphone size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Mobile & Data</h4>
            <span className="mt-1 block text-xs font-bold text-emerald-800">RM 35 – RM 60</span>
            <span className="text-[11px] text-slate-500">~950 – 1,620 BDT/mo</span>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              High-speed 5G prepaid unlimited data plans via Maxis, CelcomDigi, or U Mobile.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-canvas-soft text-emerald-700">
              <Wallet size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Utilities & Personal</h4>
            <span className="mt-1 block text-xs font-bold text-emerald-800">RM 100 – RM 200</span>
            <span className="text-[11px] text-slate-500">~2,700 – 5,400 BDT/mo</span>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              Electricity, water, room air-conditioning usage, and laundry facilities.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-petrol-800 p-6 text-white text-center">
          <p className="text-xs uppercase tracking-wider text-lime font-bold">Total Estimated Monthly Living Cost</p>
          <p className="mt-1 text-2xl font-black sm:text-3xl">
            RM 1,200 – RM 2,200 / month <span className="text-base font-normal text-white/80">(approx. BDT 32,000 – 60,000/month)</span>
          </p>
        </div>
      </Section>

      {/* Module 4: 5-Step Bangladesh Bank Student File Guide */}
      <Section
        id="student-file"
        tone="sage"
        title="Bangladesh Bank Student File Guide for Malaysia"
        intro="Unlike China’s full scholarship model, studying in Malaysia requires establishing an Authorized Dealer (AD) Bank Student File to legally wire tuition fees and living funds."
      >
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 mb-8 text-amber-950 text-xs leading-relaxed flex items-start gap-4">
          <AlertTriangle size={24} className="shrink-0 text-amber-700 mt-0.5" />
          <div>
            <strong className="block font-bold text-sm text-amber-900 mb-1">Guardian Regulatory Notice</strong>
            Transferring student funds via unauthorized curb-market channels (Hundi) violates the Bangladesh Foreign Exchange Regulation Act (FERA 1947). Without a verified AD Bank Student File, parents cannot justify foreign remittances in their annual IT-10B tax returns, and students cannot demonstrate legitimate funds to Malaysian Immigration.
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Selecting an Authorized Dealer (AD) Bank Branch',
              desc: 'Choose an authorized foreign exchange branch of a reputed bank in Dhaka or major cities (e.g. City Bank, Eastern Bank, BRAC Bank, Dutch-Bangla Bank, Dhaka Bank, Standard Chartered). Ensure the branch has a dedicated foreign remittance desk.',
            },
            {
              step: '2',
              title: 'Compiling University Acceptance & Demand Documents',
              desc: 'Collect your unconditional Offer Letter from the Malaysian institution, the EMGS eVAL approval document, and the official Demand Note/Invoice showing the exact tuition fee schedule and institution SWIFT/IBAN banking details.',
            },
            {
              step: '3',
              title: 'Guardian KYC & Tax Transparency Documentation',
              desc: 'Provide sponsor (parent/guardian) National ID (NID), e-TIN Certificate, recent income tax assessment order (acknowledgement receipt with IT-10B statement), and verified 6-month bank statement demonstrating clean source of funds.',
            },
            {
              step: '4',
              title: 'Completing Form TM & Outward SWIFT Remittance',
              desc: 'Fill out Bangladesh Bank Form TM (Application for Transfer of Foreign Currency). The AD bank verifies documents, deducts statutory charges, and transmits the semester tuition directly to the Malaysian university’s official account via telegraphic transfer (SWIFT).',
            },
            {
              step: '5',
              title: 'Issuance of Bangladesh Bank Education Card (FE Circular No. 37)',
              desc: 'Under Bangladesh Bank guidelines, the AD bank issues an international debit/credit Education Card loaded with an annual quota of up to USD 12,000 (or equivalent in MYR). The student uses this card for hostel fees, meals, textbooks, and daily campus expenses.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800">
                {item.step}
              </span>
              <div>
                <h3 className="text-base font-bold text-petrol-800">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 5: Scholarships & Waivers */}
      <Section
        id="scholarships"
        title="Scholarships & Tuition Waivers in Malaysia"
        intro="How international students from Bangladesh can reduce their gross tuition through merit awards, sibling discounts, and early bird grants."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Academic Merit Scholarships</h3>
            <span className="mt-1 block text-xs font-bold text-emerald-800">20% to 75% Tuition Fee Waiver</span>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Awarded based on high school results (HSC GPA 4.50+ or A-Level grades ABB+). Premier awards like the Jeffrey Cheah Entrance Scholarship at Sunway University offer up to 75% tuition discounts.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Sibling & Alumni Discounts</h3>
            <span className="mt-1 block text-xs font-bold text-emerald-800">10% to 20% Fee Deduction</span>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Available at institutions like Taylor’s, APU, and UCSI when two siblings study simultaneously or when an applicant’s immediate family member previously graduated from the institution.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Postgraduate Research Fellowships</h3>
            <span className="mt-1 block text-xs font-bold text-emerald-800">Partial to Full Waivers + Stipends</span>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Universiti Malaya (UM) and UTM offer Graduate Research Assistantships (GRA) for Master’s by Research and PhD scholars in engineering, computing, and biotechnology.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 6: FAQs */}
      <Section id="faq" tone="sage" title="Frequently Asked Questions" intro="Clear, evidence-backed answers on tuition, remittances, and living expenses in Malaysia.">
        <FaqBlock items={faqs} />
      </Section>

      {/* Module 7: Free Eligibility Assessment CTA */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Budget Estimation</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Personalized Malaysian Cost Sheet</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your target subject and budget. Our counselors will provide an itemized fee comparison across Malaysia’s top universities with zero service fee.
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

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
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
const PATH = '/malta-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const MALTA_VISA_SOURCES = [
  {
    label: 'Identità Malta (Central Visa Unit & Expatriates Unit — Student Visa Guidelines)',
    href: 'https://identita.gov.mt/expatriates-unit-student-visa-guidelines/',
    note: 'Statutory Maltese immigration authority governing National Long-Stay (Type D) Student Visas, subsistence solvency benchmarks (75% of national minimum wage), and biometric e-Residence cards.',
  },
  {
    label: 'Malta Further & Higher Education Authority (MFHEA)',
    href: 'https://mfhea.mt/',
    note: 'National accreditation regulator licensing higher education institutions on the Malta Qualifications Framework (MQF Levels 5–8) required for student visa eligibility.',
  },
  {
    label: 'Jobsplus (Malta National Employment Agency — Student Employment Licences)',
    href: 'https://jobsplus.gov.mt/',
    note: 'Statutory authority administering the mandatory 90-day post-arrival work restriction under Legal Notice 229/2018 and issuing 20 hr/week student employment licences.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and wiring tuition in EUR to MFHEA-accredited Maltese institutions.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Malta Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Malta Type D student visa guide for Bangladeshi students: Identità Central Visa Unit rules, €7,800–€10,000 bank solvency, 90-day work rule, and VFS.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malta', 'Malta Student Visa from Bangladesh — EduExpress International'),
  });
}

const MALTA_VISA_FAQS = [
  {
    question: 'What type of visa do Bangladeshi students need for higher education in Malta?',
    answer:
      'Bangladeshi students admitted to full-time degree or MQF Level 5–8 higher diploma programs (exceeding 90 days) apply for a Maltese National Long-Stay Visa (Type D Student Visa) processed through Identità Malta (Central Visa Unit — CVU). Once you arrive in Malta on your Type D entry visa and complete institutional enrollment, you apply through the Identità Expatriates Unit for your annual biometric Student e-Residence Card.',
  },
  {
    question: 'How much bank balance is required by Identità Malta for a student visa from Bangladesh?',
    answer:
      'Identità Malta mandates that non-EU student applicants prove financial self-sufficiency equal to at least 75% of Malta’s national minimum wage for every month of their academic year—which equals approximately EUR 650 to EUR 750 per month, or EUR 7,800 to EUR 9,000 for 12 months (in addition to paid tuition or accommodation coverage). To ensure strong visa credibility, EduExpress recommends maintaining a liquid closing balance of EUR 9,000 to EUR 10,000 (~11.8 to 13.2 Lakh BDT) in a recognized Bangladeshi commercial bank account for 3 to 6 months, supported by sponsor tax returns (TIN/IT-10B) and a notarized Affidavit of Financial Support.',
  },
  {
    question: 'How does the VFS Extended Service and Identità visa interview process work for Bangladeshi applicants?',
    answer:
      'Because Malta does not maintain a resident embassy in Dhaka, Bangladeshi student visa applications are coordinated through Identità Malta’s authorized VFS Global Extended Service submission channels (linked via your admitting Maltese institution’s international office and VFS biometric centers). After biometric capture and document submission, applicants typically attend a live online video interview conducted by consular officers from the Central Visa Unit in Malta to assess English proficiency, knowledge of MQF course modules, accommodation verification, and financial sponsor credibility.',
  },
  {
    question: 'What is the mandatory 90-day work rule for international students in Malta?',
    answer:
      'Under Maltese law (Subsidiary Legislation 217.22 / Legal Notice 229 of 2018), non-EU students holding a Type D student visa are strictly prohibited from working during their first 90 calendar days in Malta. Only after completing 90 days of study and holding a valid visa/residence receipt can you and a prospective Maltese employer submit a joint application to Jobsplus for a student employment licence (statutory fee EUR 150), authorizing up to 20 hours of legal work per week.',
  },
  {
    question: 'What accommodation proof is required by Identità Malta for student visa approval?',
    answer:
      'Identità Malta strictly scrutinizes student accommodation. If you are leasing a private shared apartment in Malta (such as in Msida, Gżira, Sliema, or St. Julian’s), you must provide a formal Housing Authority-registered lease agreement, the Identità Declaration of Proof of Accommodation form signed by the landlord, and a copy of the landlord’s Maltese ID card — or an official university residence confirmation for at least the initial period required by CVU guidelines.',
  },
  {
    question: 'What is EduExpress’s service charge for Malta admission and student visa guidance?',
    answer:
      'EduExpress charges BDT 0 for file opening. You pay zero upfront consultancy fees during MFHEA university verification, offer processing, or Identità visa filing. Under our written European service agreement, our BDT 100,000 service package is payable 100% after your Malta Type D student visa is approved, while third-party costs (tuition payment via Student File, VFS/Identità visa fees, health insurance, and flight) are paid directly by the student.',
  },
];

export default async function MaltaStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { contains: 'Malta' }, isActive: true },
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
        name: 'Malta Student Visa from Bangladesh 2027: Identità Type D Visa & Solvency Guide',
        description:
          'Malta Type D student visa guide for Bangladeshi students: Identità Central Visa Unit rules, €7,800–€10,000 bank solvency, 90-day work rule, and VFS.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malta.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALTA_VISA_SOURCES),
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
          { name: 'Malta', path: '/study-in-malta-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Identità Central Visa Unit · MFHEA MQF Levels 5–8 · BDT 0 Upfront File Fee"
        title="Malta Student Visa from Bangladesh 2027."
        lead="A complete regulatory and financial guide to securing the Maltese National Type D Student Visa from Bangladesh: verifying MFHEA institutional accreditation, structuring EUR 7,800–10,000 Identità bank solvency, Housing Authority lease registration, VFS biometrics, and Jobsplus 90-day work compliance."
        actions={
          <>
            <Link href="/apply?country=Malta" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Malta Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/malta-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Malta Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Malta" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Malta visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 132 BDT</strong> (Eurozone &amp; English-Speaking EU Member State).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Visa Authority
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Identità Malta (CVU)</p>
              <p className="mt-1 text-xs text-slate-600">National Type D entry visa transitioning to biometric e-Residence Card.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Subsistence Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€7,800 – €10,000</p>
              <p className="mt-1 text-xs text-slate-600">~10.3L–13.2L BDT liquid balance + paid tuition SWIFT MT103 receipt.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Accreditation Gate
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">MFHEA (MQF 5–8)</p>
              <p className="mt-1 text-xs text-slate-600">University of Malta, MCAST &amp; licensed Higher Education Institutions.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Clock size={16} className="text-emerald-700" /> Jobsplus Work Rule
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">20 hrs/wk After Day 90</p>
              <p className="mt-1 text-xs text-slate-600">Mandatory 90-day study period before applying for Jobsplus work permit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage Malta Student Visa Process */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Malta Type D student visa process from Bangladesh."
        intro="Identità Malta coordinates student visa slot allocation directly with MFHEA-licensed universities and colleges. Start 12 to 16 weeks before your intake."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'MFHEA Program Admission & Tuition SWIFT',
              timeline: '12–16 Weeks Before Intake',
              body: 'Pass the academic admission interview at an MFHEA-accredited Maltese institution. Open a Student File at an Authorized Dealer bank in Bangladesh and wire your tuition deposit in EUR.',
            },
            {
              step: 'Stage 02',
              title: 'Unconditional LoA & CVU Slot Registration',
              timeline: '10–12 Weeks Before Intake',
              body: 'The Maltese university issues your unconditional Letter of Acceptance (LoA) with MQF level and ECTS credits, and registers your passport details with Identità Central Visa Unit (CVU) for a VFS appointment slot.',
            },
            {
              step: 'Stage 03',
              title: 'Housing Lease, Insurance & 6-Mo Bank File',
              timeline: '8–10 Weeks Before Intake',
              body: 'Secure verified Maltese student accommodation (with Landlord ID & Declaration Form), purchase EUR 30,000 full-duration medical insurance, and prepare 6-month bank statements (€9k–€10k) + sponsor tax returns.',
            },
            {
              step: 'Stage 04',
              title: 'VFS Extended Service Biometrics & Submission',
              timeline: '6–8 Weeks Before Intake',
              body: 'Attend your scheduled VFS appointment to submit your physical passport, attested academic certificates, SWIFT MT103 tuition receipt, and biometric fingerprints.',
            },
            {
              step: 'Stage 05',
              title: 'Identità Consular Video Interview & Decision',
              timeline: '3–6 Weeks Processing',
              body: 'Complete the online credibility interview with Identità Malta visa officers. Upon approval, your passport is returned with the National Type D Student Visa sticker.',
            },
            {
              step: 'Stage 06',
              title: 'Arrival in Malta, e-Residence & Jobsplus (Day 90+)',
              timeline: 'Post-Arrival in Malta',
              body: 'Attend campus classes (maintaining ≥80% attendance), lodge your biometric e-Residence Card application with Identità in Msida, and apply for a 20 hr/wk Jobsplus work licence after 90 days.',
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-xs">
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

      {/* Module 2: Financial Solvency & Refusal Prevention */}
      <Section
        id="refusal-prevention"
        tone="sage"
        title="How to pass Identità Malta’s financial &amp; interview scrutiny."
        intro="Identità Malta rejects applications that use unverified hotel bookings, sudden cash deposits, or vague course explanations."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">Identità Malta Document &amp; Interview Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Know Your MQF Level &amp; ECTS Credits:</strong> In the video interview, state clearly whether your program is MQF Level 6 (Bachelor’s, 180 ECTS) or MQF Level 7 (Master’s, 90 ECTS) and name your core semester modules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Landlord ID &amp; Declaration Form:</strong> Ensure your Maltese accommodation contract includes the official Identità Declaration of Proof of Accommodation signed by the property owner alongside a readable copy of their Maltese ID card.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Verifiable Sponsor Bank Card / Access:</strong> Provide a bank confirmation letter or international debit/credit card showing how you will access your EUR 7,800–10,000 living funds while residing in Malta.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Top Malta Visa Refusal Triggers to Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Cancellable Booking.com Reservations:</strong> Submitting unpaid 14-day hotel reservations without a registered long-term lease or dormitory contract leads to refusal under Identità accommodation rules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Claiming Immediate Part-Time Work Plans:</strong> Telling the visa interviewer you plan to pay your first-semester rent by working immediately violates the mandatory 90-day non-work period under Legal Notice 229/2018.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Expired Medical Insurance Window:</strong> Travel and health insurance must cover the entire duration of the requested Type D visa / course year (minimum EUR 30,000 coverage across Schengen).</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Maltese Universities */}
      {universities.length > 0 && (
        <Section
          id="malta-universities"
          tone="white"
          title="Verified Maltese institutions in the EduExpress directory."
          intro="Compare MFHEA-accredited public universities and higher education colleges in Malta."
          action={
            <Link href="/universities?country=malta" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Malta universities <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-canvas-soft p-5 transition hover:border-petrol-800 hover:shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Malta'}</span>
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

      {/* Module 4: Written Service Terms Banner */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Written Cost Transparency</span>
            <h2 className="mt-1 font-display text-2xl font-black sm:text-4xl text-white">
              BDT 0 File-Opening Charge · Pay EduExpress Only After Visa Approval
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We charge BDT 0 upfront to open your Malta file. Every third-party expense (Student File tuition transfer, Identità/VFS visa fees, health insurance, and housing deposit) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is due only after visa issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-malta-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Malta Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/malta-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Malta Tuition &amp; Living Cost Breakdown
              </Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Our Fee &amp; Transparency Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: FAQs */}
      <FaqBlock
        items={MALTA_VISA_FAQS}
        title="Frequently asked questions about the Malta student visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Maltese immigration sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {MALTA_VISA_SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between rounded-2xl border border-petrol-800/15 bg-canvas-soft p-4 transition hover:border-petrol-800/40"
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

        <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-canvas-soft p-5 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Identità Malta Central Visa Unit guidelines, MFHEA MQF register standards, and Jobsplus student employment regulations on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and Type D visa or e-Residence decisions rest solely with the respective Maltese institutions and Identità Malta authorities.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Identità Solvency &amp; MQF Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Malta Student Visa &amp; University Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS/MOI status, and target intake. Our Dhanmondi team will verify your MFHEA options and Identità financial file within one working day.
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

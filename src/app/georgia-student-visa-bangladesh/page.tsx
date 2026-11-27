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
  Stethoscope,
  Wallet,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/georgia-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const GEORGIA_VISA_SOURCES = [
  {
    label: 'Ministry of Foreign Affairs of Georgia — Geoconsul E-Application & D3 Study Visa Portal',
    href: 'https://www.geoconsul.gov.ge/en',
    note: 'Statutory consular authority governing National Category D3 Study Visa applications, financial solvency requirements ($3,500–$5,000), and consular processing via New Delhi.',
  },
  {
    label: 'National Center for Educational Quality Enhancement (NCEQE / EQE Georgia)',
    href: 'https://eqe.ge/en',
    note: 'WFME-recognized statutory quality agency issuing mandatory foreign secondary/higher education qualification recognition prior to Ministry of Education enrollment orders.',
  },
  {
    label: 'Ministry of Education, Science and Youth of Georgia (MES)',
    href: 'https://mes.gov.ge/',
    note: 'Issues the statutory Ministerial Enrollment Order (Rector’s Decree authorization) required for every international student before lodging a D3 Study Visa.',
  },
  {
    label: 'Bangladesh Medical and Dental Council (BMDC) — Foreign MBBS/MD Eligibility & RQE Rules',
    href: 'https://bmdc.org.bd/',
    note: 'Statutory medical council in Dhaka requiring a pre-departure Eligibility Certificate (SSC+HSC GPA 7.00+, Biology 3.50+, 1–2 yr HSC gap limit) and post-graduation RQE licensing exam.',
  },
  {
    label: 'Public Service Development Agency (House of Justice / Public Service Hall — Georgia)',
    href: 'https://psh.gov.ge/',
    note: 'Statutory Georgian civil registry issuing the biometric Temporary Residence Card (TRC) for study purposes after arrival in Tbilisi.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Georgia Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Georgia D3 student visa guide for Bangladeshi students: NCEQE & Ministry of Education order, $3,500–$5,000 bank solvency, BMDC rules, and Tbilisi TRC.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('georgia', 'Georgia Student Visa from Bangladesh — EduExpress International'),
  });
}

const GEORGIA_VISA_FAQS = [
  {
    question: 'What is the Georgia D3 Study Visa and how do Bangladeshi students obtain it?',
    answer:
      'The Category D3 Visa is the statutory long-stay National Study Visa issued by the Ministry of Foreign Affairs of Georgia (via the Geoconsul portal and the Embassy of Georgia in New Delhi / VFS channels) to international students enrolled in accredited Georgian higher education institutions. Unlike quick tourist visas, a D3 Study Visa cannot be lodged until your admitting university secures both your NCEQE academic credential recognition and your official Ministerial Enrollment Order from the Ministry of Education, Science and Youth of Georgia (MES).',
  },
  {
    question: 'Why are NCEQE recognition and the Ministry of Education Order mandatory before applying for a visa?',
    answer:
      'Under Georgian higher education law, a university offer letter alone does not legally enroll an international student. First, your notarized Georgian-translated SSC/HSC (or Bachelor) transcripts and passport are submitted to the National Center for Educational Quality Enhancement (NCEQE / EQE) in Tbilisi to verify your qualification authenticity. Second, the Ministry of Education, Science and Youth issues an official Ministerial Order authorizing your enrollment without unified national exams. Only after the Rector signs the enrollment decree based on that Ministerial Order can you submit your D3 visa application.',
  },
  {
    question: 'How much bank balance is required for a Georgia D3 student visa from Bangladesh?',
    answer:
      'The Georgian consular authority requires proof of sufficient financial funds to support your stay and study in Georgia. Bangladeshi applicants should present an official 6-month Bank Statement and Solvency Certificate from an Authorized Dealer commercial bank in Bangladesh showing a closing balance of at least USD 3,500 to USD 5,000 (~4.3 to 6.1 Lakh BDT), alongside your Bangladesh Bank Student File SWIFT MT103 receipt proving payment of your first-semester or first-year tuition fee.',
  },
  {
    question: 'What BMDC rules must Bangladeshi medical (MD/MBBS) students complete before flying to Georgia?',
    answer:
      'If you are enrolling in a 6-year English-taught Medical Doctor (MD — equivalent to MBBS) program at a WFME/WDOMS-listed Georgian university (such as Tbilisi State Medical University, Tbilisi State University, Ilia State University, or The University of Georgia) and intend to return to Bangladesh to practice medicine, you MUST obtain a pre-departure Foreign Medical Eligibility Certificate from the Bangladesh Medical & Dental Council (BMDC) in Dhaka. BMDC requires a minimum combined SSC+HSC GPA of 7.00 (at least 3.00 in each), HSC Biology GPA of at least 3.50 (B grade), and an HSC passing year within the current or immediate preceding 1–2 academic years.',
  },
  {
    question: 'What happens after arriving in Tbilisi on a D3 Study Visa?',
    answer:
      'Your D3 entry visa grants initial legal entry (typically valid for 90 days). At least 40 days before your D3 visa expires, you must visit the Public Service Hall (House of Justice) in Tbilisi with your university enrollment certificate, Georgian address proof, and local bank solvency certificate to obtain your biometric Temporary Residence Card (TRC) for study purposes.',
  },
  {
    question: 'What is EduExpress’s service charge for Georgia admission, NCEQE recognition, and D3 visa guidance?',
    answer:
      'EduExpress charges BDT 0 for file opening. You pay zero upfront consultancy fees during university selection, NCEQE submission, or D3 visa processing. Under our written European service agreement, our BDT 100,000 service package is payable 100% after your Georgia D3 student visa is approved, while third-party statutory charges (NCEQE recognition fee, tuition transfer via Student File, Georgian translation/notarization, and consular visa fee) are paid directly by the student.',
  },
];

export default async function GeorgiaStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Georgia', 'georgia'] }, isActive: true },
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
        name: 'Georgia Student Visa from Bangladesh 2027: D3 Study Visa, NCEQE & BMDC Guide',
        description:
          'Georgia D3 student visa guide for Bangladeshi students: NCEQE & Ministry of Education order, $3,500–$5,000 bank solvency, BMDC rules, and Tbilisi TRC.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/georgia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GEORGIA_VISA_SOURCES),
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
          { name: 'Georgia', path: '/study-in-georgia-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="National Category D3 Study Visa · NCEQE & MES Ministerial Order · BMDC MD/MBBS Compliance"
        title="Georgia Student Visa from Bangladesh 2027."
        lead="A complete regulatory roadmap to obtaining the Georgian Category D3 Study Visa from Bangladesh: securing NCEQE academic recognition and the Ministry of Education Enrollment Order in Tbilisi, BMDC pre-departure medical eligibility certification, USD 3,500–5,000 bank solvency, and Public Service Hall TRC issuance."
        actions={
          <>
            <Link href="/apply?country=Georgia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Georgia Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/georgia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Georgia MD &amp; STEM Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Georgia" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Georgia visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 USD ≈ 122 BDT</strong> · <strong>1 GEL ≈ 45 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Visa Category
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Category D3 Immigration</p>
              <p className="mt-1 text-xs text-slate-600">Geoconsul e-Application transitioning to Tbilisi Temporary Residence Card.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Pre-Visa Statutory Gate
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">NCEQE + MES Order</p>
              <p className="mt-1 text-xs text-slate-600">Mandatory Ministry of Education decree before D3 visa submission.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Bank Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">USD 3,500 – 5,000</p>
              <p className="mt-1 text-xs text-slate-600">~4.3L–6.1L BDT 6-month statement + paid tuition SWIFT MT103.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Stethoscope size={16} className="text-emerald-700" /> Medical Guardrail
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">WFME + BMDC RQE</p>
              <p className="mt-1 text-xs text-slate-600">Pre-departure BMDC Eligibility Certificate required for MD students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage Georgia D3 Visa & NCEQE Process */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Georgia D3 student visa &amp; NCEQE recognition process."
        intro="Allow 10 to 14 weeks for the complete cycle from university interview to Ministry of Education decree and D3 consular stamping."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'University Interview & Georgian Translation',
              timeline: '12–14 Weeks Before Intake',
              body: 'Pass the recorded Zoom English & Science (Biology/Chemistry for MD) interview. Translate and notarize your passport and SSC/HSC transcripts into the Georgian language.',
            },
            {
              step: 'Stage 02',
              title: 'NCEQE Recognition & MES Ministerial Order',
              timeline: '8–11 Weeks Before Intake',
              body: 'The university submits your file to NCEQE (EQE) for qualification recognition and obtains your official Enrollment Order from the Ministry of Education, Science and Youth of Georgia.',
            },
            {
              step: 'Stage 03',
              title: 'BMDC Certificate & Student File SWIFT Wire',
              timeline: '6–9 Weeks Before Intake',
              body: 'Medical students obtain their BMDC Eligibility Certificate in Dhaka. Open a Student File at an Authorized Dealer bank in Bangladesh and wire 1st-semester/year tuition in USD.',
            },
            {
              step: 'Stage 04',
              title: 'Geoconsul D3 E-Application & Document File',
              timeline: '5–7 Weeks Before Intake',
              body: 'Complete the electronic D3 visa application on geoconsul.gov.ge. Attach the Rector’s Enrollment Decree, SWIFT MT103 receipt, accommodation contract, health insurance, and $3,500–$5,000 bank statement.',
            },
            {
              step: 'Stage 05',
              title: 'Consular / VFS Submission & D3 Issuance',
              timeline: '3–5 Weeks Processing',
              body: 'Submit your physical dossier through the designated consular submission channel for the Embassy of Georgia in New Delhi and receive your Category D3 Study Visa.',
            },
            {
              step: 'Stage 06',
              title: 'Tbilisi Arrival & Public Service Hall TRC',
              timeline: 'At Least 40 Days Before D3 Expiry',
              body: 'Fly to Tbilisi International Airport (TBS), complete campus registration, and apply at the Tbilisi Public Service Hall (House of Justice) for your biometric Temporary Residence Card (TRC).',
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

      {/* Module 2: Medical Licensing & Immigration Guardrails */}
      <Section
        id="medical-guardrails"
        tone="sage"
        title="BMDC medical licensing &amp; Georgian border compliance guardrails."
        intro="Over 75% of Bangladeshi students choosing Georgia enroll in 6-year English-taught MD (MBBS) programs. Verify these statutory rules before paying tuition."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">BMDC, WFME &amp; USMLE/PLAB Recognition Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>WFME &amp; WDOMS Verification:</strong> Georgia’s NCEQE holds full World Federation for Medical Education (WFME) recognition, making graduates of WDOMS-listed universities (TSMU, TSU, Iliauni, UG) eligible to sit for USMLE (USA), UKMLA/PLAB (UK), and BMDC RQE (Bangladesh).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Mandatory Pre-Departure BMDC Eligibility Certificate:</strong> Under Bangladesh Medical &amp; Dental Council law, you must secure your BMDC Eligibility Certificate BEFORE departing Dhaka (requires SSC+HSC GPA ≥ 7.00, Biology GPA ≥ 3.50, and ≤1–2 year HSC gap).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Compare With China MOE Medical Universities:</strong> Before committing to Georgia ($5,300–$8,000/yr tuition), compare our <Link href="/mbbs-in-china-bangladesh" className="font-bold text-petrol-800 underline">45 Chinese MOE Public Medical Universities</Link> ($3,500–$6,000/yr with massive teaching hospitals).</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical Georgia Visa &amp; Financial Warnings</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Never Travel on an e-Tourist Visa for Degree Study:</strong> An electronic C-category tourist visa cannot be legally converted into a student Temporary Residence Card (TRC) inside Georgia; degree students must enter on a Category D3 Study Visa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Do Not Rely on Part-Time Work in Tbilisi:</strong> Local service jobs in Georgia require Georgian (Kartuli) language fluency and pay modest GEL wages. Families must be able to fund tuition and USD 350–550/month living costs directly.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>40-Day TRC Application Deadline:</strong> Under Georgian immigration law, your first Temporary Residence Card application must be lodged at the Public Service Hall at least 40 calendar days before your D3 visa expires.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Georgian Universities */}
      {universities.length > 0 && (
        <Section
          id="georgia-universities"
          tone="white"
          title="Verified Georgian universities in the EduExpress directory."
          intro="Compare NCEQE-accredited medical and comprehensive universities in Tbilisi."
          action={
            <Link href="/universities?country=georgia" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Georgia universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Tbilisi, Georgia'}</span>
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
              BDT 0 File-Opening Charge · Pay EduExpress Only After D3 Visa Approval
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We charge BDT 0 upfront to open your Georgia file. Every third-party expense (NCEQE recognition fee, Georgian translation, Student File tuition transfer, and consular visa fee) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is due only after D3 visa issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-georgia-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Georgia Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/georgia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Georgia Tuition &amp; Living Cost Breakdown
              </Link>
              <Link href="/bmdc-recognized-medical-colleges-abroad" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                BMDC Recognized Medical Colleges Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: FAQs */}
      <FaqBlock
        items={GEORGIA_VISA_FAQS}
        title="Frequently asked questions about the Georgia D3 student visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Georgian &amp; BMDC regulatory sources.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GEORGIA_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Ministry of Foreign Affairs of Georgia (Geoconsul) D3 rules, NCEQE accreditation standards, and BMDC foreign medical regulations on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final NCEQE recognition, Ministerial Enrollment Orders, BMDC eligibility certification, and D3 visa or TRC decisions rest solely with the respective Georgian and Bangladeshi statutory authorities.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">BMDC &amp; NCEQE Eligibility Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Georgia D3 Visa &amp; Medical/STEM Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your SSC/HSC GPA, Biology grade, and passing year. Our Dhanmondi team will verify your BMDC eligibility and compare Georgia vs China medical/STEM options within one working day.
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

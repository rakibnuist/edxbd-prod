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
const PATH = '/greece-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const GREECE_VISA_SOURCES = [
  {
    label: 'Ministry of Migration and Asylum (Hellenic Republic — Student Residence Permits)',
    href: 'https://migration.gov.gr/en/',
    note: 'Statutory Greek ministry governing National Long-Stay (Type D) Study Visas under Law 5038/2023, financial subsistence criteria (€400–€500/mo), and biometric Student e-Permits.',
  },
  {
    label: 'Hellenic Authority for Higher Education (HAHE / ETHAAE)',
    href: 'https://www.ethaae.gr/en/',
    note: 'Statutory national accreditation body certifying European Qualifications Framework (EQF) and Bologna ECTS degree programs at Greek public universities.',
  },
  {
    label: 'Study in Greece — Official National Higher Education Portal',
    href: 'https://studyingreece.edu.gr/',
    note: 'Official state-supported platform detailing English-taught undergraduate and postgraduate programs and international student visa procedures.',
  },
  {
    label: 'Ministry of Foreign Affairs of the Hellenic Republic & Embassy of Greece in New Delhi',
    href: 'https://www.mfa.gr/india/en/',
    note: 'Diplomatic mission and VFS Global consular jurisdiction handling Type D student visa interviews, document verification, and criminal record checks for Bangladeshi applicants.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and wiring tuition in EUR to Greek public university IBAN accounts.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Greece Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Greece Type D student visa guide for Bangladeshi students: Hellenic Ministry of Migration rules, €4,800–€6,000 bank solvency, e-Permit, and 20hr work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('greece', 'Greece Student Visa from Bangladesh — EduExpress International'),
  });
}

const GREECE_VISA_FAQS = [
  {
    question: 'What type of visa do Bangladeshi students need to study in Greece?',
    answer:
      'Bangladeshi students admitted to full-time English-taught Bachelor’s, Master’s, or PhD programs at Greek universities apply for a Greek National Long-Stay Study Visa (Type D) under the Greek Migration Code (Law 5038/2023). The Type D visa is processed through the Embassy of Greece in New Delhi and designated VFS Global consular channels. Within 40 days of arriving in Athens, Thessaloniki, or your regional Greek university city, you apply electronically via the Ministry of Migration and Asylum portal for your biometric Student Residence Permit (e-Permit).',
  },
  {
    question: 'How much bank solvency is required for a Greece Type D student visa from Bangladesh?',
    answer:
      'The Hellenic Ministry of Migration and Asylum sets the statutory financial subsistence minimum for international students at EUR 400 to EUR 500 per month (EUR 4,800 to EUR 6,000 per year, or ~6.3 to 7.9 Lakh BDT), in addition to proof of paid first-year/first-semester university tuition. To present a strong consular file, EduExpress recommends maintaining a closing balance of EUR 6,000 to EUR 7,800 (~7.9 to 10.3 Lakh BDT) in a recognized Bangladeshi commercial bank account for 3 to 6 months, supported by your parent sponsor’s notarized financial affidavit and NBR tax returns.',
  },
  {
    question: 'What medical, criminal, and academic documents are required by the Greek Embassy?',
    answer:
      'A complete Greek Type D student visa file requires: (1) the unconditional admission certificate from a recognized Greek higher education institution (HAHE-accredited public university or licensed college) plus the SWIFT MT103 tuition payment receipt; (2) SSC, HSC, and Bachelor certificates attested by the Education Board, MoE, and MoFA Dhaka; (3) a Police Clearance Certificate attested by MoFA confirming a clean criminal record; (4) an official Medical Certificate confirming the applicant is free from infectious diseases threatening public health; and (5) travel/medical insurance covering at least EUR 30,000.',
  },
  {
    question: 'How do Bangladeshi students obtain a Greek Tax Number (AFM) and Social Security (AMKA) after arrival?',
    answer:
      'Once you arrive in Greece, enroll at your university, and sign your Greek apartment lease or dormitory contract, your university’s international student office assists you in registering with the local tax authority (AADE) to receive your Greek Tax Identification Number (AFM) and registering for your Social Security Number (AMKA / PAAYPA). Both numbers are required to open a Greek bank account and to work legally part-time.',
  },
  {
    question: 'Are Bangladeshi students legally allowed to work part-time in Greece?',
    answer:
      'Yes. Under the Greek Migration Code (Law 5038/2023), non-EU university students holding a valid biometric Student Residence Permit (e-Permit) are legally authorized to work part-time up to 20 hours per week during academic semesters and full-time (up to 40 hours/week) during official university vacation periods. Typical student jobs in Athens, Thessaloniki, and Crete (hospitality, tourism, customer support, and retail) pay EUR 5.50 to EUR 8.00 per hour (~EUR 440–640/month for 20 hrs/week).',
  },
  {
    question: 'What is EduExpress’s service charge for Greece admission and Type D visa guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge. You pay zero upfront consultancy fees during Greek university shortlisting, offer processing, or Type D visa preparation. Under our written European service agreement, our BDT 100,000 service package is payable 100% after your Greece National Type D student visa is approved, while third-party statutory charges (university tuition via Student File, €90 consular visa fee, €150 biometric e-Permit fee, attestation, and New Delhi VFS logistics) are paid directly by the student.',
  },
];

export default async function GreeceStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Greece', 'greece'] }, isActive: true },
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
        name: 'Greece Student Visa from Bangladesh 2027: Type D Visa, Solvency & e-Permit Guide',
        description:
          'Greece Type D student visa guide for Bangladeshi students: Hellenic Ministry of Migration rules, €4,800–€6,000 bank solvency, e-Permit, and 20hr work.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/greece.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(GREECE_VISA_SOURCES),
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
          { name: 'Greece', path: '/study-in-greece-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Hellenic National Type D Visa (Law 5038/2023) · HAHE Public Universities · BDT 0 Upfront Fee"
        title="Greece Student Visa from Bangladesh 2027."
        lead="A complete regulatory and financial guide for Bangladeshi students applying for the Greek National Long-Stay (Type D) Study Visa: verifying HAHE public university admission, structuring EUR 4,800–6,000+ bank solvency, consular interview preparation, and post-arrival e-Permit and AFM registration."
        actions={
          <>
            <Link href="/apply?country=Greece" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Greece Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/greece-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Greece Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Greece" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Greece visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 132 BDT</strong> (European Union &amp; Eurozone Member State).
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
              <p className="mt-2 text-base font-bold text-petrol-800">National Type D + e-Permit</p>
              <p className="mt-1 text-xs text-slate-600">€90 consular D-visa transitioning to €150 biometric Greek e-Permit.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Subsistence Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€6,000 – €7,800</p>
              <p className="mt-1 text-xs text-slate-600">~7.9L–10.3L BDT recommended 6-mo balance + paid tuition SWIFT MT103.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Accreditation Body
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">HAHE (ETHAAE)</p>
              <p className="mt-1 text-xs text-slate-600">Public universities in Athens (NKUA, AUEB, NTUA), Thessaloniki &amp; Crete.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Work Entitlement
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">20 hrs/wk (e-Permit)</p>
              <p className="mt-1 text-xs text-slate-600">Legal part-time work during semesters + 40 hrs/wk in summer with AFM.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage Greece Type D Student Visa Roadmap */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Greece National Type D student visa process from Bangladesh."
        intro="Greek public universities offer some of the lowest tuition fees in the European Union (€1,000–€3,500/yr for many Master’s), making early consular preparation essential."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'HAHE University Admission & Interview',
              timeline: '12–16 Weeks Before Intake',
              body: 'Apply to an English-taught Bachelor’s or Master’s program at a Greek public university (such as NKUA, AUEB, AUTh, or University of Crete) and clear the faculty academic interview.',
            },
            {
              step: 'Stage 02',
              title: 'Student File Tuition Wire (SWIFT MT103)',
              timeline: '10–12 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh and remit your first-year (or first-semester) tuition in EUR directly to the Greek university’s institutional IBAN.',
            },
            {
              step: 'Stage 03',
              title: 'Attestation, Police Clearance & Health Certificate',
              timeline: '8–10 Weeks Before Intake',
              body: 'Attest academic certificates, Police Clearance Certificate, and infectious-disease-free Medical Certificate via MoFA Dhaka, and compile your sponsor’s 6-month bank statement (€6,000–€7,800) + tax returns.',
            },
            {
              step: 'Stage 04',
              title: 'Consular / VFS Appointment & Interview',
              timeline: '6–8 Weeks Before Intake',
              body: 'Submit your physical Type D visa application, EUR 30,000 medical insurance, and biometrics via the Embassy of Greece in New Delhi / VFS Global channel and attend the consular interview.',
            },
            {
              step: 'Stage 05',
              title: 'National Type D Study Visa Issuance',
              timeline: '3–5 Weeks Processing',
              body: 'Once the Greek consular authority verifies your university enrollment and financial solvency, your passport is stamped with the National Long-Stay Type D Study Visa.',
            },
            {
              step: 'Stage 06',
              title: 'Athens/Thessaloniki Arrival, e-Permit & AFM',
              timeline: 'Within 40 Days of Landing',
              body: 'Complete campus registration, lodge your online Student Residence Permit (e-Permit, €150 fee) on migration.gov.gr, and obtain your AFM tax number and 50% discounted student transit pass.',
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

      {/* Module 2: Consular Interview & Refusal Prevention */}
      <Section
        id="refusal-prevention"
        tone="sage"
        title="How to pass the Greek consular interview and avoid refusal."
        intro="Greek consular officers focus heavily on academic fit, verified accommodation, and clean police/medical certificates."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">Greece Type D Consular Readiness Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Public University Charter Knowledge:</strong> Know the exact department, ECTS credit structure, and syllabus of your English-taught program at NKUA, AUEB, AUTh, or your admitting institution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Valid Police &amp; Medical Validity Window:</strong> Ensure both your MoFA-attested Police Clearance Certificate and Official Medical Certificate are issued within 90 days of your consular appointment date.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Indian Transit Visa Planning:</strong> Apply for your Indian visa early in the admission timeline so you can attend biometrics or consular interviews in New Delhi without missing your semester start.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Top Greek Visa Refusal Triggers to Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Unlicensed Vocational Workshops:</strong> Enrolling in non-accredited private language workshops instead of HAHE-accredited Greek public universities or Ministry-licensed colleges leads to automatic Type D refusal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Unexplained Last-Minute Bank Deposits:</strong> Depositing 7–10 Lakh BDT in cash right before printing the bank statement without matching sponsor tax returns (IT-10B) or salary slips.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Education-First Focus:</strong> Frame your interview strictly around the academic and career merit of your Greek university curriculum rather than part-time jobs or regional travel.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Greek Universities */}
      {universities.length > 0 && (
        <Section
          id="greece-universities"
          tone="white"
          title="Verified Greek universities in the EduExpress directory."
          intro="Compare HAHE-accredited Greek public universities in Athens, Thessaloniki, and Crete."
          action={
            <Link href="/universities?country=greece" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Greece universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Greece'}</span>
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
              We charge BDT 0 upfront to open your Greece file. Every third-party expense (Student File tuition wire, document attestation, €90 consular visa fee, and €150 biometric e-Permit fee) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is due only after Type D visa issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-greece-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Greece Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/greece-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Greece Tuition &amp; Living Cost Breakdown
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
        items={GREECE_VISA_FAQS}
        title="Frequently asked questions about the Greece student visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Hellenic regulatory sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GREECE_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Hellenic Ministry of Migration and Asylum (Law 5038/2023), HAHE accreditation standards, and Study in Greece statutory guidelines on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and Type D visa or e-Permit decisions rest solely with the respective Greek universities and Hellenic consular/immigration authorities.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">HAHE &amp; Type D Visa Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Greece Public University &amp; Visa Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS score, and budget. Our Dhanmondi team will match you with low-tuition Greek public universities and audit your Type D visa file within one working day.
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

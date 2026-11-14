import Link from 'next/link';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileSearch,
  FileText,
  HelpCircle,
  Hospital,
  IdCard,
  MapPin,
  Plane,
  PlaneTakeoff,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/malaysia-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'Malaysia Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Complete Malaysia student visa guide for Bangladeshi students: EMGS eVAL approval steps, Dhaka SEV application checklist, post-arrival medical, and i-KAD.',
    path: PATH,
    locale: 'en_GB',
    image: ogImage('malaysia', 'Malaysia Student Visa from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'What is an eVAL and why is it needed for Malaysia?',
    answer:
      'The electronic Visa Approval Letter (eVAL) is the official pre-visa clearance issued by the Malaysian Immigration Department via Education Malaysia Global Services (EMGS). It confirms that your academic credentials, medical declaration, and university admission are verified. You cannot apply for a Single Entry Visa (SEV) or board a flight to Malaysia without a valid eVAL.',
  },
  {
    question: 'How long does it take to receive the eVAL from EMGS?',
    answer:
      'The standard processing time is 3 to 6 weeks from the date your application and payment are acknowledged on the EMGS portal. You can track your file’s progress live from 0% through 15%, 32%, and up to the 70% yellow approval status, when the eVAL is ready for download.',
  },
  {
    question: 'How do Bangladeshi students apply for the Single Entry Visa (SEV)?',
    answer:
      'Once your eVAL reaches 70% approval, you can apply for your SEV either through the official Malaysia eVISA portal (Student category) or by submitting your original passport, eVAL printout, offer letter, and photos to the High Commission of Malaysia in Dhaka via its authorized processing center in Baridhara Diplomatic Zone. Processing typically takes 3 to 5 working days.',
  },
  {
    question: 'Why must a university representative meet students at Kuala Lumpur Airport (KLIA)?',
    answer:
      'Under Malaysian Immigration regulations, international students are not permitted to pass through immigration border control alone. An authorized representative from your university’s International Student Office must meet you at the airport immigration hold area to sign off on your arrival documents and guide you through border clearance.',
  },
  {
    question: 'What happens during the post-arrival medical examination in Malaysia?',
    answer:
      'Within 7 days of landing in Malaysia, you must attend an EMGS-registered panel clinic for a comprehensive health screening. This includes blood tests (for infectious diseases including Hepatitis B and HIV), a urine test (drug screening), and a chest X-ray (tuberculosis). Passing this check is mandatory for the endorsement of your Student Pass sticker and the issuance of your i-KAD.',
  },
  {
    question: 'What is an i-KAD and how is it used?',
    answer:
      'The i-KAD is an official biometric identity card issued by the Immigration Department of Malaysia to registered international students. It contains your photo, passport details, university name, and Student Pass validity. It serves as your primary legal identification in Malaysia, allowing you to leave your original passport in safe custody at your campus.',
  },
  {
    question: 'What is EduExpress’s fee for Malaysian visa assistance?',
    answer:
      'EduExpress charges BDT 0 for Malaysian visa and admission guidance. We provide complete document vetting, EMGS portal tracking, and Dhaka SEV submission instructions completely free of charge. Students pay only official government and institutional fees directly to EMGS and the university.',
  },
];

export default async function MalaysiaStudentVisaPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: 'Malaysia Student Visa from Bangladesh | EMGS eVAL, SEV & Embassy Checklist',
        description:
          'Step-by-step Malaysia student visa and pass guide for Bangladeshi students: EMGS portal tracking, Dhaka High Commission checklist, post-arrival medical, and i-KAD.',
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
          { name: 'Student Visa' },
        ]}
        eyebrow="EMGS Centralized System · 100% Transparent Process · BDT 0 Agency Fee"
        title="Malaysia Student Visa from Bangladesh."
        lead="A complete roadmap to the Malaysian student pass: EMGS electronic Visa Approval Letter (eVAL), Single Entry Visa (SEV) at the Dhaka High Commission, airport border protocol, and i-KAD issuance."
        actions={
          <>
            <Link href="/apply?country=Malaysia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#emgs-steps" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              View 5-Step Process
            </a>
          </>
        }
      />

      <TrustBar />

      {/* Progress Phases Strip */}
      <section aria-label="Visa process phases" className="border-b border-canvas-soft bg-white py-6">
        <div className={`${kit.wrap} flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700`}>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              1
            </span>
            <span>Offer Letter</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              2
            </span>
            <span>EMGS eVAL Approval</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              3
            </span>
            <span>SEV Visa in Dhaka</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              4
            </span>
            <span>KLIA Airport Clearance</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              5
            </span>
            <span>Medical Check & i-KAD</span>
          </div>
        </div>
      </section>

      {/* Module 1: The 5-Step Official Roadmap */}
      <Section
        id="emgs-steps"
        title="The 5-Step Official Malaysia Student Pass Pathway"
        intro="The Malaysian student pass system is fully managed by Education Malaysia Global Services (EMGS) and the Malaysian Immigration Department. Follow each phase step-by-step."
      >
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                01
              </span>
              <div>
                <h3 className="text-lg font-bold text-petrol-800">University Offer Letter & Initial Fee Deposit</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  After reviewing your academic transcripts (HSC/A-Level or Bachelor’s CGPA), the university issues an official Offer Letter. To initiate the visa process, you remit the university application/registration fee and the EMGS visa processing fee (RM 1,500 – RM 2,000) directly to the institution or EMGS portal.
                </p>
                <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700">
                  <strong>Required at this stage:</strong> Valid passport scan (minimum 18 months validity), academic marksheets & certificates, health declaration form, passport photos (white & blue backgrounds).
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                02
              </span>
              <div>
                <h3 className="text-lg font-bold text-petrol-800">EMGS eVAL Processing & Live Tracking</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Your university uploads your documents to the EMGS portal. The application progresses through an automated tracking system. Once Malaysian Immigration conducts security and background vetting, your electronic Visa Approval Letter (eVAL) is issued at 70% approval.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-4 text-center text-xs">
                  <div className="rounded-xl border border-rule bg-canvas-soft p-2.5">
                    <span className="block font-bold text-petrol-800">0% – 15%</span>
                    <span className="text-[11px] text-slate-500">Document Review</span>
                  </div>
                  <div className="rounded-xl border border-rule bg-canvas-soft p-2.5">
                    <span className="block font-bold text-petrol-800">15% – 32%</span>
                    <span className="text-[11px] text-slate-500">EMGS Verification</span>
                  </div>
                  <div className="rounded-xl border border-rule bg-canvas-soft p-2.5">
                    <span className="block font-bold text-petrol-800">32% – 70%</span>
                    <span className="text-[11px] text-slate-500">Immigration Vetting</span>
                  </div>
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 font-bold text-emerald-900">
                    <span className="block">70% Approved</span>
                    <span className="text-[11px] text-emerald-700">eVAL Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                03
              </span>
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Single Entry Visa (SEV) Stamping in Dhaka</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  With your downloaded eVAL and University Offer Letter, you apply for a Single Entry Visa (SEV). Bangladeshi passport holders can obtain the SEV via the official Malaysia eVISA portal or submit their physical passport through the authorized Visa Application Center in Baridhara Diplomatic Zone, Dhaka.
                </p>
                <div className="mt-4 rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700">
                  <strong>Dhaka Embassy Checklist:</strong> Original passport, printed color eVAL, university offer letter, confirmed flight itinerary, 2 recent passport-size photos, and visa stamping fee (~8,000 – 12,000 BDT).
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                04
              </span>
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Flight Booking & Mandatory Airport Border Clearance</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Book your flight to Kuala Lumpur International Airport (KLIA Terminal 1 or Terminal 2). Notify your university’s International Student Office at least 7 days before departure with your flight details. Under Malaysian law, an authorized university representative must receive you at airport immigration border control to validate entry.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                05
              </span>
              <div>
                <h3 className="text-lg font-bold text-petrol-800">Post-Arrival 7-Day Medical Screening & i-KAD Endorsement</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Within 7 days of landing in Malaysia, you undergo a mandatory post-arrival health screening at an EMGS-panel clinic (chest X-ray, blood test, urine test). Following medical clearance, the university submits your passport to State Immigration for the physical Student Pass sticker and official i-KAD biometric card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Dhaka Embassy & Submission Checklist */}
      <Section
        id="embassy-checklist"
        tone="sage"
        title="Dhaka High Commission Document Checklist"
        intro="Everything Bangladeshi students must prepare for a flawless Single Entry Visa (SEV) application in Dhaka."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Essential Travel & Visa Documents</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Original Passport:</strong> Minimum 18 months remaining validity with at least 3 blank pages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Electronic Visa Approval Letter (eVAL):</strong> High-resolution color printout of the 70% approval letter issued by EMGS.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>University Offer Letter:</strong> Official unconditional letter of acceptance signed by the institution registrar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Confirmed Flight Ticket:</strong> Flight itinerary to Kuala Lumpur (KLIA/KLIA2) aligned with university registration dates.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Photos & Academic Records</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Passport Photographs:</strong> 2 recent studio photos (35mm x 45mm, matte finish, white background, no eyeglasses).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Attested Academic Certificates:</strong> SSC/HSC or Bachelor’s certificates with Education Board & MoFA attestation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>EMGS Health Declaration Form:</strong> Signed copy confirming zero disqualifying medical conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>SEV Processing Fee:</strong> Payment slip for consular stamping fee (~8,000 – 12,000 BDT).</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Grounds for Refusal & How to Avoid Them */}
      <Section
        id="refusals"
        title="Visa Refusal Grounds & Risk Prevention"
        intro="Malaysian student pass approval rates are extremely high when documentation is authentic and complete. Here are the common pitfalls to avoid."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <AlertTriangle size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Academic Discrepancies</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Unverified certificates or inconsistent subject marks will cause immediate EMGS rejection. Every certificate must match your official Board and University records.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Hospital size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Medical Screening Failure</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Active Hepatitis B, untreated pulmonary tuberculosis, or drug traces result in immediate Student Pass cancellation and repatriation. Conduct a pre-screening health check in Dhaka first.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Clock size={20} />
            </div>
            <h4 className="text-sm font-bold text-petrol-800">Short Passport Validity</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Malaysian Immigration rejects applications with less than 18 months remaining passport validity. Always renew your passport before applying if it has under 2 years remaining.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 4: FAQs */}
      <Section id="faq" tone="sage" title="Frequently Asked Questions" intro="Clear guidance on the Malaysian visa process, eVAL timelines, and border protocols.">
        <FaqBlock items={faqs} />
      </Section>

      {/* Module 5: EduExpress Free Visa Guidance */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">100% Free Visa Assistance</span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">BDT 0 EduExpress Service Charge</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Our Dhanmondi, Dhaka office assists with full document auditing, EMGS portal tracking, and Dhaka High Commission submission checklists at absolutely zero charge.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/apply?country=Malaysia" className="ed-btn ed-btn-signal min-h-[48px] px-8 text-sm">
                Apply for Malaysia Admission & Visa <ArrowRight size={16} />
              </Link>
              <Link href="/malaysia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-8 text-sm">
                Review Full Cost Breakdown
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: Free Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Eligibility Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Admission & eVAL Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic credentials and target study intake. Our senior counselors will confirm your university eligibility and visa timeline within 24 hours.
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

import Link from 'next/link';
import {
  AlertOctagon,
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
  PlaneTakeoff,
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
const PATH = '/malaysia-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const MALAYSIA_VISA_SOURCES = [
  {
    label: 'Education Malaysia Global Services (EMGS) — Official Visa & eVAL Portal',
    href: 'https://educationmalaysia.gov.my/',
    note: 'Statutory government agency managing international student applications, academic credential verification, health screening, and eVAL processing.',
  },
  {
    label: 'Immigration Department of Malaysia (Jabatan Imigresen Malaysia - JIM)',
    href: 'https://www.imi.gov.my/index.php/en/main-services/pass/student-pass/',
    note: 'Statutory government department responsible for issuing the Electronic Visa Approval Letter (eVAL), Student Pass sticker endorsements, and biometric i-KAD cards.',
  },
  {
    label: 'High Commission of Malaysia in Dhaka — Consular & Visa Section',
    href: 'https://www.kln.gov.my/web/bgd_dhaka/home',
    note: 'Diplomatic mission in Baridhara Diplomatic Enclave, Dhaka responsible for Single Entry Visa (SEV) passport stamping and consular services for Bangladeshi citizens.',
  },
  {
    label: 'Malaysian Qualifications Agency (MQA) — Malaysian Qualifications Register (MQR)',
    href: 'https://www2.mqa.gov.my/mqr/',
    note: 'Statutory quality assurance agency accrediting academic degree and diploma programs across public and private higher education institutions in Malaysia.',
  },
  {
    label: 'Ministry of Higher Education Malaysia (MOHE)',
    href: 'https://www.mohe.gov.my/',
    note: 'Federal ministry overseeing university licensing, international student policy benchmarks, and university institutional compliance.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File Guidelines)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations governing legal foreign exchange remittances via SWIFT (Form TM) and international Education Cards under FE Circular No. 37.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Malaysia Student Visa from Bangladesh 2027: Documents & Process | EduExpress',
    description:
      'Complete Malaysia student visa guide for Bangladeshi students: EMGS eVAL status tracker (0% to 100%), Dhaka High Commission SEV checklist, KLIA airport clearance, and i-KAD.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malaysia', 'Malaysia Student Visa from Bangladesh — EduExpress International'),
  });
}

const faqs = [
  {
    question: 'What is an eVAL and why is it mandatory for studying in Malaysia?',
    answer:
      'The Electronic Visa Approval Letter (eVAL) is the official pre-visa clearance issued by the Immigration Department of Malaysia (Jabatan Imigresen Malaysia) through Education Malaysia Global Services (EMGS). It confirms that your academic background, institution admission, and health declaration have been verified. Under Malaysian law, no airline will allow you to board a flight to Malaysia, and the High Commission in Dhaka will not issue a Single Entry Visa (SEV), without a verified eVAL.',
  },
  {
    question: 'How long does it take to receive the eVAL from EMGS for Bangladeshi students?',
    answer:
      'Standard eVAL processing takes 3 to 6 weeks from the date the university submits your complete documentation and remits the EMGS processing fee. Bangladeshi students can track progress online from 0% through 15%, 32%, and up to the 70% yellow approval status, at which point the eVAL is officially generated for download.',
  },
  {
    question: 'How do Bangladeshi students apply for the Single Entry Visa (SEV) in Dhaka?',
    answer:
      'Once your eVAL reaches 70% approval, you can apply for your Single Entry Visa (SEV) either through the official Malaysian eVISA portal (Student category) or by physically submitting your passport, color eVAL printout, university offer letter, photos, and attested certificates to the authorized visa application center for the High Commission of Malaysia in Dhaka (Baridhara Diplomatic Enclave). Consular processing typically takes 3 to 5 working days.',
  },
  {
    question: 'Why is it mandatory for a university representative to meet students at KLIA Airport?',
    answer:
      'Under Section 15 of the Malaysian Immigration Act 1959/63, international students holding an SEV and eVAL are not permitted to clear immigration border control independently. An authorized representative from your university’s International Student Office must be physically present at the airport immigration hold area (KLIA Terminal 1 or 2) to sign off on your arrival documents and escort you through customs. Traveling without formal 7-day advance airport notification can lead to temporary immigration detention or entry refusal.',
  },
  {
    question: 'What happens during the post-arrival 7-day medical examination in Malaysia?',
    answer:
      'Within 7 days of arriving in Malaysia, you must attend an EMGS-registered panel clinic for a comprehensive medical screening. This includes a chest X-ray (testing for tuberculosis), blood tests (for Hepatitis B, HIV, VDRL, and malaria), and a urine toxicology screening. Passing this screening is mandatory for State Immigration to endorse the Student Pass sticker into your passport and issue your biometric i-KAD.',
  },
  {
    question: 'What is an i-KAD and what legal rights does it grant in Malaysia?',
    answer:
      'The i-KAD is a biometric foreign student identity card issued by the Immigration Department of Malaysia. It includes your photo, passport number, biometric chip, institution name, and pass validity. In Malaysia, it serves as a legally recognized substitute for your original passport for domestic identity checks, banking, and domestic flights between Peninsular Malaysia and Sabah/Sarawak, allowing your passport to remain safely deposited with your university visa office.',
  },
  {
    question: 'Are Bangladeshi students permitted to work part-time while studying in Malaysia?',
    answer:
      'Under Malaysian Immigration regulations (Pekeliling Imigresen No. 1/2003), international students are permitted to work a maximum of 20 hours per week ONLY during semester breaks or official holidays exceeding 7 consecutive days. Employment is strictly restricted to four designated sectors: restaurants, petrol kiosks, mini markets, and hotels. Work during regular academic term-time is strictly prohibited, and students are barred from working as cashiers, singers, musicians, or guest relations officers.',
  },
  {
    question: 'What academic requirements must be maintained to renew the Malaysian Student Pass?',
    answer:
      'Malaysian Student Passes are issued for 12 months at a time and must be renewed annually through your university. Renewal requires maintaining a minimum cumulative grade point average (CGPA) of 2.00 and an official class attendance record of at least 80%. Falling below these thresholds causes EMGS to deny the renewal endorsement, leading to Student Pass cancellation and mandatory repatriation.',
  },
  {
    question: 'What is EduExpress’s fee for Malaysian admission and visa processing?',
    answer:
      'EduExpress operates with a strict BDT 0 service charge guarantee for Malaysia. We charge zero file-opening fees and zero consultancy charges. Our team assists with university program selection, document auditing, EMGS portal tracking, Dhaka High Commission submission checklists, and pre-departure briefings completely free. Students pay only direct official government fees (EMGS fee, SEV stamping fee, health screening, insurance) and university tuition directly.',
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
        mainEntityOfPage: canonical,
        dateModified: '2026-11-15',
        name: 'Malaysia Student Visa from Bangladesh 2027: Documents & Process | EduExpress',
        description:
          'Complete Malaysia student visa guide for Bangladeshi students: EMGS eVAL approval tracker (0% to 100%), Dhaka High Commission SEV checklist, KLIA airport clearance, and i-KAD.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malaysia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALAYSIA_VISA_SOURCES),
      },
    ],
  };

  // Fetch verified Malaysian partner universities from database
  let universities: { slug: string; name: string; location: string; rankingWorld: number | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Malaysia' },
      select: {
        slug: true,
        name: true,
        location: true,
        rankingWorld: true,
        tuition: true,
      },
      take: 8,
      orderBy: [{ rankingWorld: 'asc' }, { name: 'asc' }],
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
          { name: 'Malaysia', path: '/study-in-malaysia-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="EMGS Centralized System · Step-by-Step eVAL & SEV Guide · BDT 0 Agency Fee"
        title="Malaysia Student Visa from Bangladesh 2027."
        lead="A complete, evidence-first roadmap to obtaining the Malaysian Student Pass: tracking your EMGS electronic Visa Approval Letter (eVAL) from 0% to 100%, securing the Single Entry Visa (SEV) at the High Commission in Dhaka, KLIA border entry protocols, and post-arrival biometric i-KAD issuance."
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

      <TrustBar destination="Malaysia" />

      {/* Planning Assumption & Key Visa Summary Grid */}
      <section aria-label="Visa planning metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Rate
              </span>
              <p className="text-xs text-slate-500">
                Official Currency Baseline: <strong>1 MYR ≈ 27 BDT</strong> (Malaysian Ringgit to Bangladeshi Taka).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> Zero Agency Fee Guarantee (BDT 0)
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Statutory System
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">EMGS + Immigration (JIM)</p>
              <p className="mt-1 text-xs text-slate-600">Centralized online application, screening & tracking portal.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Pre-Visa Clearance
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">eVAL (70% Status)</p>
              <p className="mt-1 text-xs text-slate-600">Valid for 6 months. Required before boarding & visa stamping.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Dhaka Mission
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">High Commission Dhaka</p>
              <p className="mt-1 text-xs text-slate-600">Baridhara Enclave or eVISA portal for Single Entry Visa (SEV).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Legal Resident ID
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">i-KAD Smart Card</p>
              <p className="mt-1 text-xs text-slate-600">Issued after passing 7-day post-arrival health screening.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Phases Strip */}
      <section aria-label="Visa process phases" className="border-b border-canvas-soft bg-canvas-soft/40 py-6">
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
            <span>EMGS eVAL (70%)</span>
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
            <span>KLIA Border Escort</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800">
              5
            </span>
            <span>Clinic Check & i-KAD</span>
          </div>
        </div>
      </section>

      {/* Module 1: The 5-Step Official Roadmap */}
      <Section
        id="emgs-steps"
        title="The 5-Step Official Malaysia Student Pass Pathway"
        intro="The Malaysian student visa process operates through a centralized digital pipeline overseen by Education Malaysia Global Services (EMGS) and the Malaysian Immigration Department (Jabatan Imigresen Malaysia). Here is the full chronological sequence from initial acceptance to legal residence."
      >
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
                01
              </span>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-petrol-800">University Offer Letter & EMGS Fee Remittance</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Following evaluation of your academic certificates (HSC / A-Level or Bachelor’s CGPA), your chosen Malaysian institution issues an unconditional Letter of Offer. To initiate statutory processing, you remit the university registration charge and the official EMGS visa processing fee (RM 1,500 – RM 2,500, covering medical insurance, immigration levy, and student pass endorsement fees) directly to the university or via the EMGS portal.
                </p>
                <div className="rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700">
                  <strong>Required documents at this stage:</strong> Complete passport scan (all pages including blank pages, minimum 18 months remaining validity), attested academic certificates and transcripts, signed EMGS Health Declaration form, and studio passport photographs (white background and light blue background, 35mm x 45mm).
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
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-petrol-800">EMGS eVAL Processing & Live Percentage Tracking</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  The institution uploads your verified dossier to the EMGS portal. Your application is reviewed by EMGS document specialists before being transmitted to the Immigration Department of Malaysia (Jabatan Imigresen Malaysia) for national security clearance and immigration vetting. When your file hits 70% approval (yellow status), your official Electronic Visa Approval Letter (eVAL) is issued and ready for PDF download.
                </p>
                <div className="grid gap-3 sm:grid-cols-4 text-center text-xs">
                  <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                    <span className="block font-bold text-petrol-800">0% – 15%</span>
                    <span className="text-[11px] text-slate-500">Document Upload & Audit</span>
                  </div>
                  <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                    <span className="block font-bold text-petrol-800">15% – 32%</span>
                    <span className="text-[11px] text-slate-500">EMGS Medical & Academic Check</span>
                  </div>
                  <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                    <span className="block font-bold text-petrol-800">32% – 70%</span>
                    <span className="text-[11px] text-slate-500">Immigration Security Clearance</span>
                  </div>
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 font-bold text-emerald-900">
                    <span className="block">70% Status</span>
                    <span className="text-[11px] text-emerald-700">eVAL Issued & Downloadable</span>
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
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-petrol-800">Single Entry Visa (SEV) Stamping in Dhaka</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Armed with your 70% eVAL PDF and university offer letter, you apply for a Single Entry Visa (SEV). Bangladeshi passport holders can obtain an SEV via the official Malaysian eVISA portal (Student category) or submit their physical passport through the authorized Visa Application Center accredited by the High Commission of Malaysia in Dhaka (located in the Baridhara Diplomatic Enclave). Processing takes 3 to 5 business days.
                </p>
                <div className="rounded-2xl bg-canvas-soft p-4 text-xs text-slate-700">
                  <strong>Consular checklist:</strong> Original passport, color printout of eVAL, university acceptance letter, confirmed flight itinerary, 2 recent studio photos, and consular fee (~8,000 – 12,000 BDT).
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
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-petrol-800">Flight Booking & Mandatory Airport Border Clearance</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Book your flight to Kuala Lumpur International Airport (KLIA Terminal 1 or Terminal 2). Notify your university’s International Student Support Office at least 7 days before departure with your flight confirmation. Under Section 15 of the Malaysian Immigration Act, an authorized university representative must receive you at airport immigration border control to co-sign your entry clearance. You cannot clear Malaysian immigration unaccompanied.
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
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-petrol-800">Post-Arrival 7-Day Medical Check & Biometric i-KAD Endorsement</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Within 7 days of landing in Malaysia, you undergo a mandatory post-arrival health screening at an EMGS-panel clinic (chest X-ray, infectious blood tests, urine toxicology). Once health clearance is transmitted to EMGS, the university submits your passport to State Immigration for the physical Student Pass sticker endorsement and the issuance of your official biometric i-KAD smart identity card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Complete EMGS eVAL Tracking & Percentage Milestone Breakdown */}
      <Section
        id="eval-breakdown"
        tone="sage"
        title="Complete EMGS eVAL Percentage Milestone Guide"
        intro="The EMGS online portal provides a live tracking percentage for every application. Understanding exactly what happens at each percentage stage prevents unnecessary panic and identifies potential document bottlenecks early."
      >
        <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-rule bg-canvas-soft text-petrol-800 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Percentage Stage</th>
                <th className="p-4">Responsible Body</th>
                <th className="p-4">Operational Activity</th>
                <th className="p-4">Expected Duration</th>
                <th className="p-4">Action Required by Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              <tr>
                <td className="p-4 font-bold text-slate-800">0% – 15%</td>
                <td className="p-4">Institution / EMGS</td>
                <td className="p-4 leading-relaxed">University submits digital application dossier; EMGS verifies receipt of processing fee and validates file completeness.</td>
                <td className="p-4">2 – 4 working days</td>
                <td className="p-4">Ensure passport scan is high-resolution with all pages visible and valid for at least 18 months.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">15% – 32%</td>
                <td className="p-4">EMGS Document Specialists</td>
                <td className="p-4 leading-relaxed">Detailed verification of academic transcripts against MQA accreditation standards and signed health declaration form.</td>
                <td className="p-4">5 – 8 working days</td>
                <td className="p-4">Respond immediately if EMGS requests clearer certificate scans or additional marksheets.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">32% – 70%</td>
                <td className="p-4">Immigration Department (JIM)</td>
                <td className="p-4 leading-relaxed">State and federal immigration security check, national blacklist verification, and student clearance vetting.</td>
                <td className="p-4">10 – 15 working days</td>
                <td className="p-4">No action required. File is actively reviewed by Malaysian Immigration officers.</td>
              </tr>
              <tr className="bg-emerald-50/70 font-semibold text-emerald-950">
                <td className="p-4 font-bold text-emerald-900">70% (Yellow Status)</td>
                <td className="p-4">Immigration Department (JIM)</td>
                <td className="p-4 leading-relaxed">Electronic Visa Approval Letter (eVAL) formally approved and issued. Download link generated on EMGS portal.</td>
                <td className="p-4">Milestone Reached</td>
                <td className="p-4">Download PDF, print high-resolution color copies, and submit for Single Entry Visa (SEV).</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">70% – 80%</td>
                <td className="p-4">Student & High Commission</td>
                <td className="p-4 leading-relaxed">Single Entry Visa (SEV) application and stamping at High Commission in Dhaka or online eVISA portal; flight to KLIA.</td>
                <td className="p-4">3 – 5 working days</td>
                <td className="p-4">Notify university international office 7 days before departure with flight details.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">80% – 100%</td>
                <td className="p-4">Panel Clinic & State Immigration</td>
                <td className="p-4 leading-relaxed">Post-arrival medical check passed; passport submitted to immigration; Student Pass sticker affixed; i-KAD dispatched.</td>
                <td className="p-4">10 – 14 days after arrival</td>
                <td className="p-4">Attend clinic within 7 days of landing; collect endorsed passport and physical i-KAD from campus.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 3: Dhaka High Commission Document Checklist & Submission Protocols */}
      <Section
        id="dhaka-checklist"
        title="High Commission of Malaysia (Dhaka) Document Checklist"
        intro="Bangladeshi students must obtain a Single Entry Visa (SEV) before boarding any flight to Malaysia. Submissions are processed either via the official Malaysian eVISA portal or through authorized consular service desks in Dhaka."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <FileCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Primary Identification & Visa Clearances</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Original Passport:</strong> Minimum 18 months remaining validity from expected entry date, with at least 3 completely blank visa pages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Color eVAL Printout:</strong> Official 70% approval letter issued by EMGS and Malaysian Immigration Department (high-res color print).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Official University Offer Letter:</strong> Unconditional Acceptance Letter signed by the university registrar detailing program name, duration, and intake.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Confirmed Air Ticket / Itinerary:</strong> Flight confirmation to Kuala Lumpur International Airport (KLIA/KLIA2) aligned with university reporting date.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <FileText size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Academic Records, Photos & Health Certification</h3>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Attested Academic Credentials:</strong> SSC / HSC certificates and marksheets (or Bachelor’s degree for postgrad) attested by Education Board, Ministry of Education, and Ministry of Foreign Affairs (MoFA) Dhaka.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>Standardized Studio Photographs:</strong> 2 copies (35mm x 45mm, matte finish, pure white background for SEV, blue background for EMGS, no spectacles).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>EMGS Health Declaration Form:</strong> Signed declaration confirming absence of communicable diseases or chronic conditions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-700 mt-0.5" />
                <span><strong>SEV Processing Fee Slip:</strong> Proof of consular fee payment (~8,000 – 12,000 BDT depending on physical submission or digital eVISA channel).</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Statutory Fees, Payment Schedules & Bangladesh Bank Student File */}
      <Section
        id="statutory-fees"
        tone="sage"
        title="Statutory Visa Fees & Bangladesh Bank Student File Protocol"
        intro="Studying in Malaysia requires strictly legitimate, traceable fee remittances. Unlike European destinations, Malaysia does not require locked bank accounts, but all tuition and living expenses must move through legal banking channels."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Fee Schedule */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Itemized Visa & Statutory Fee Schedule</h3>
            <p className="mt-1 text-xs text-slate-500">
              Planning Assumption: 1 MYR ≈ 27 BDT. All government fees paid directly to statutory bodies.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-rule">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas-soft font-bold text-petrol-800">
                  <tr>
                    <th className="p-3">Fee Component</th>
                    <th className="p-3">Cost in MYR</th>
                    <th className="p-3">Approx. BDT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">EMGS Visa Processing Fee</td>
                    <td className="p-3">RM 1,500 – RM 2,500</td>
                    <td className="p-3 font-bold text-petrol-800">40,500 – 67,500 BDT</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Dhaka Single Entry Visa (SEV) Fee</td>
                    <td className="p-3">RM 20 + Consular Service</td>
                    <td className="p-3 font-bold text-petrol-800">8,000 – 12,000 BDT</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Post-Arrival Clinic Screening (EMGS Panel)</td>
                    <td className="p-3">Included in EMGS / RM 250</td>
                    <td className="p-3 font-bold text-petrol-800">~6,750 BDT</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">i-KAD Smart Card Issuance</td>
                    <td className="p-3">RM 50 (standard)</td>
                    <td className="p-3 font-bold text-petrol-800">~1,350 BDT</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Annual Student Pass Renewal (Years 2–4)</td>
                    <td className="p-3">RM 60 / yr + admin levy</td>
                    <td className="p-3 font-bold text-petrol-800">~18,000 – 30,000 BDT/yr</td>
                  </tr>
                  <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                    <td className="p-3">EduExpress Agency Service Fee</td>
                    <td className="p-3">BDT 0</td>
                    <td className="p-3 text-emerald-800">BDT 0 (100% Free)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Student File Protocol */}
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <h3 className="text-base font-bold text-petrol-800">Bangladesh Bank Student File Regulations</h3>
            <p className="mt-1 text-xs text-slate-500">
              Foreign Exchange Regulation Act & FE Circular No. 37 compliance.
            </p>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">1. Opening the Student File:</span>
                <p className="mt-1 text-slate-600">
                  Once your university offer letter and eVAL are ready, your sponsor visits any Authorized Dealer (AD) bank in Bangladesh (e.g., City Bank, Eastern Bank, BRAC Bank) with your passport, attested certificates, and university bank invoices to establish a formal Student File.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">2. SWIFT Wire Transfers (Form TM):</span>
                <p className="mt-1 text-slate-600">
                  Tuition fees are wired directly to the university’s Malaysian bank account via SWIFT telegraphic transfer under Bangladesh Bank Form TM. This creates documented proof of legitimate educational expenditure.
                </p>
              </div>

              <div className="rounded-2xl bg-canvas-soft p-4">
                <span className="font-bold text-petrol-800">3. International Education Card Quota:</span>
                <p className="mt-1 text-slate-600">
                  Under FE Circular No. 37, banks issue an international credit/debit Education Card endorsed against your Student File with an annual quota up to USD 12,000 equivalent for living and accommodation expenses in Malaysia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 5: Mandatory KLIA Airport Clearance Protocol (Section 15 Immigration Act) */}
      <Section
        id="klia-protocol"
        title="Mandatory KLIA Airport Clearance Protocol (Section 15)"
        intro="Entering Malaysia on a student visa is strictly regulated. Unlike tourists, international students are legally required to be received by their university at border control before entering the country."
      >
        <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-sm font-bold text-petrol-800">The Legal Mandate</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Under Section 15 of the Malaysian Immigration Act 1959/63, an arriving international student holding a Single Entry Visa cannot be cleared into the country alone. An authorized representative from your university must physically counter-sign your entry document at the immigration desk.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <Clock size={20} />
              </div>
              <h3 className="text-sm font-bold text-petrol-800">7-Day Flight Notification</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                You must send your confirmed flight ticket, arrival date, arrival time, and terminal (KLIA Terminal 1 or Terminal 2) to your university’s International Student Support office at least 7 working days prior to departure. The university will issue an official Airport Pickup Confirmation letter.
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-bold text-petrol-800">Immigration Hold Area</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Upon landing at KLIA, follow signs to the International Arrivals Immigration Hall. You will wait in the designated Student Arrival Lounge. Your university representative will arrive with institutional identification, complete the border sign-off with immigration officers, and escort you through customs to campus transit.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Warning for Unscheduled Arrivals:</strong> If you fly to Malaysia without prior university airport coordination, immigration officers will not allow you to exit border control. You will be held in the airline transit room until your university dispatches an authorized officer. Always confirm airport pickup in writing before boarding.
          </div>
        </div>
      </Section>

      {/* Module 6: Post-Arrival 7-Day Medical Screening & Biometric i-KAD Endorsement */}
      <Section
        id="post-arrival-medical"
        tone="sage"
        title="Post-Arrival 7-Day Medical Screening & Biometric i-KAD"
        intro="Passing the statutory post-arrival medical check is the absolute prerequisite for securing your 1-year Student Pass sticker and biometric i-KAD identity card."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Stethoscope size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Mandatory Screening Protocol (Within 7 Days)</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Within 7 calendar days of your arrival date, your university will transport you to an EMGS-registered panel clinic. The screening is standardized across all Malaysian states:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Chest X-Ray:</strong> Strict examination for active or untreated pulmonary tuberculosis (TB) and lung lesions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Blood Testing:</strong> Screening for Hepatitis B surface antigen (HBsAg), HIV, Hepatitis C, Syphilis (VDRL), and Malaria parasites.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Urine Toxicology:</strong> Comprehensive screening for illicit substances including opiates, cannabis, and amphetamines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>General Physical Exam:</strong> Blood pressure, vision, heart/lung auscultation, and clinical history review.</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl bg-canvas-soft p-3 text-[11px] text-slate-600">
              <strong>Medical Failure Clause:</strong> If a student tests positive for Hepatitis B or active TB, EMGS regulations mandate immediate visa denial and scheduled repatriation to Bangladesh. Conduct a thorough health check in Dhaka prior to applying.
            </div>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <IdCard size={20} />
            </div>
            <h3 className="text-base font-bold text-petrol-800">Biometric i-KAD: Your Legal Resident ID</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Once clinic screening results are uploaded and approved by EMGS, the university submits your physical passport to State Immigration. Immigration endorses the Student Pass sticker and produces your biometric i-KAD card.
            </p>
            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                <strong className="text-petrol-800">What is on the i-KAD?</strong>
                <p className="mt-1 text-slate-600">
                  Your color portrait, passport number, nationality, university code, Student Pass validity dates, and a machine-readable barcode registered with Jabatan Imigresen Malaysia.
                </p>
              </div>
              <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                <strong className="text-petrol-800">Domestic Legal Protection:</strong>
                <p className="mt-1 text-slate-600">
                  Under Malaysian Law (Section 6(1) of the Immigration Act), carrying your valid i-KAD protects you from detention during immigration checks without needing to carry your original passport around daily.
                </p>
              </div>
              <div className="rounded-xl border border-rule bg-canvas-soft p-3">
                <strong className="text-petrol-800">Travel Between West & East Malaysia:</strong>
                <p className="mt-1 text-slate-600">
                  Enables smooth boarding for domestic flights between Peninsular Malaysia (Kuala Lumpur) and the Borneo states of Sabah and Sarawak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 7: Student Pass Validity, Academic Criteria & Annual Renewal Rules */}
      <Section
        id="pass-renewal"
        title="Student Pass Validity & Annual Renewal Regulations"
        intro="The Malaysian Student Pass is not a permanent visa — it is granted for 12 months at a time and requires annual renewal based on verified academic standing and classroom attendance."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Calendar size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">80% Class Attendance Rule</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Malaysian Immigration strictly requires universities to submit official student biometric attendance logs. Students falling below an 80% aggregate attendance rate will have their renewal applications rejected by EMGS.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <GraduationCap size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">Minimum CGPA 2.00 Requirement</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              To renew your Student Pass, you must maintain satisfactory academic progression with a minimum cumulative CGPA of 2.00 on a 4.00 scale. Academic probation or repeated course failures jeopardize visa extension.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
              <Clock size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">2–3 Month Renewal Window</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              You must submit your passport and renewal paperwork to your university’s International Visa Office at least 60 to 90 days before your current Student Pass expires to avoid unlawful overstay penalties.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 8: Part-Time Work Regulations & Realistic Boundaries */}
      <Section
        id="work-regulations"
        tone="sage"
        title="Part-Time Work Regulations & Realistic Boundaries"
        intro="Bangladeshi students must clearly understand Malaysian labor restrictions under Pekeliling Imigresen No. 1/2003. Working outside statutory boundaries leads to arrest, pass cancellation, and immediate deportation."
      >
        <div className="rounded-3xl border border-rule bg-white p-7 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-base font-bold text-petrol-800">Statutory Work Rights (The Rules)</h3>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Max 20 Hours per Week:</strong> Permitted strictly during semester breaks or official holidays exceeding 7 consecutive days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Designated Sectors Only:</strong> Limited exclusively to Restaurants, Petrol Kiosks, Mini Markets, and Hotels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>University Authorization:</strong> Requires written recommendation from the Vice-Chancellor / Dean and formal endorsement from Immigration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Wage Expectations:</strong> Typical earnings range from RM 7 to RM 12 per hour (approx. 190 – 320 BDT/hour), generating RM 600 – RM 960/month during allowable breaks.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-rose-800">Strict Legal Prohibitions</h3>
              <ul className="mt-3 space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Term-Time Work Banned:</strong> Working during normal semesters while classes are in session is strictly illegal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Prohibited Positions:</strong> Students are legally barred from working as cashiers, musicians, singers, masseurs, or guest relations officers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>No Tuition Self-Funding:</strong> Part-time earnings in Malaysia cannot cover university tuition fees or full accommodation expenses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertOctagon size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Deportation Risk:</strong> Engaging in unauthorized off-campus labor results in instant passport blacklisting by Malaysian Immigration.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 9: Visa Refusal Grounds & Risk Prevention */}
      <Section
        id="refusals"
        title="Visa Refusal Grounds & Risk Prevention"
        intro="Malaysian student visa approval rates through EMGS exceed 95% when documentation is genuine and compliant. Understanding the specific refusal triggers ensures your file proceeds smoothly."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">Academic & Document Inconsistencies</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Mismatch between names on passport and academic marksheets, unverified fake certificates, or unexplained multi-year study gaps without working experience cause immediate rejection by EMGS document examiners.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Hospital size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">Health Screening Failures</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Testing positive for Hepatitis B surface antigen, active pulmonary TB, HIV, or traces of cannabis/opiates results in immediate student pass cancellation upon arrival. EduExpress recommends pre-screening in Dhaka before submitting your file.
            </p>
          </div>

          <div className="rounded-3xl border border-rule bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
              <Clock size={20} />
            </div>
            <h3 className="text-sm font-bold text-petrol-800">Short Passport Validity</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Malaysian Immigration strictly requires minimum 18 months remaining validity. Passports expiring within 18 months are returned without processing. Renew your passport to ensure at least 2 to 3 years remaining.
            </p>
          </div>
        </div>
      </Section>

      {/* Module 10: Top Verified Malaysian Institutions & Pathways */}
      {universities.length > 0 && (
        <Section
          id="universities"
          tone="sage"
          title="Verified Malaysian Universities for Bangladeshi Students"
          intro="Accredited Malaysian institutions recognized by the Malaysian Qualifications Agency (MQA), Ministry of Higher Education (MOHE), and international credential evaluation services."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {universities.map((uni) => (
              <div key={uni.slug} className="flex flex-col justify-between rounded-2xl border border-rule bg-white p-5 shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MapPin size={13} /> {uni.location.split(',')[0]}
                    </span>
                    {uni.rankingWorld && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        QS #{uni.rankingWorld}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-petrol-800">{uni.name}</h3>
                  {uni.tuition && (
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                      <strong>Tuition:</strong> {uni.tuition}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-rule">
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                  >
                    View University Profile <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-signal min-h-[44px] px-6">
              Explore Malaysia Study Hub <ArrowRight size={14} />
            </Link>
            <Link href="/malaysia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] px-6">
              Review Full Malaysia Cost Breakdown
            </Link>
            <Link href="/study-in-malaysia-after-o-level" className="ed-btn ed-btn-outline min-h-[44px] px-6">
              Malaysia After O-Level Guide
            </Link>
          </div>
        </Section>
      )}

      {/* Module 11: EduExpress BDT 0 Transparent Support & Guarantees */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Zero Agency Fee Visa Assistance</span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">BDT 0 EduExpress Service Charge for Malaysia</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Unlike traditional agencies charging hefty consultancy fees, EduExpress operates with a strict <strong>BDT 0 service fee</strong> policy for Malaysia. We assist with document audits, EMGS portal tracking, and Dhaka High Commission checklists completely free. Students pay only direct official government and university fees.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">BDT 0 Service Fee</span>
                <p className="mt-1 text-xs text-white/75">Zero file-opening charges, zero commission surcharges, zero hidden costs.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">EMGS Portal Tracking</span>
                <p className="mt-1 text-xs text-white/75">Live tracking from 0% submission to 70% eVAL approval with direct student access.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <span className="font-bold text-lime">ClearCost Guarantee</span>
                <p className="mt-1 text-xs text-white/75">1-page itemized schedule separating tuition, visa levies, medical screening, and flights.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/apply?country=Malaysia" className="ed-btn ed-btn-signal min-h-[48px] px-8 text-sm">
                Apply for Malaysia Admission & Visa <ArrowRight size={16} />
              </Link>
              <Link href="/malaysia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-8 text-sm">
                Review Full Cost Breakdown
              </Link>
              <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-8 text-sm">
                Malaysia Study Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 12: FAQs */}
      <Section id="faq" tone="sage" title="Frequently Asked Questions" intro="Clear guidance on the Malaysian student pass process, eVAL timelines, and border protocols for Bangladeshi students.">
        <FaqBlock items={faqs} />
      </Section>

      {/* Module 13: Editorial Governance, Reviewer Card & Statutory Regulatory Sources */}
      <section className="border-t border-canvas-soft bg-white py-12">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Reviewer Card */}
            <div className="rounded-3xl border border-rule bg-canvas-soft p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Editorial & Visa Reviewer</span>
                  <p className="mt-1 text-base font-bold text-petrol-800">Abdullah Al Rakib</p>
                  <p className="text-xs text-slate-500">Founder & CEO, EduExpress International · Study Abroad Counselor</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Last Verified Date: </span>
                  <time dateTime="2026-11-27" className="font-bold text-petrol-800">November 27, 2026</time>
                  <span className="block text-[11px] text-slate-400">Baseline review: 2026-11-15</span>
                </div>
              </div>

              <div className="mt-4 text-xs leading-relaxed text-slate-600">
                <p>
                  This guide reflects current statutory immigration regulations established by the Immigration Department of Malaysia (Jabatan Imigresen Malaysia), Education Malaysia Global Services (EMGS), the High Commission of Malaysia in Dhaka, and Bangladesh Bank foreign exchange rules. Tuition fee ranges and visa processing timelines are audited against verified university partner agreements.
                </p>
              </div>
            </div>

            {/* Regulatory Sources Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Official Regulatory Authorities & Statutory Sources</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MALAYSIA_VISA_SOURCES.map((source) => (
                  <li key={source.href} className="rounded-2xl border border-rule bg-white p-4 shadow-sm">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-petrol-800 hover:text-emerald-700"
                    >
                      <span>{source.label}</span>
                      <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                    </a>
                    {source.note && <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{source.note}</p>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Standard Disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
              <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and student visa guidance under written service terms. Final admission offers, eVAL approvals, Single Entry Visa issuance, and entry clearance decisions rest solely with the respective Malaysian universities and official Malaysian Immigration authorities.
            </div>
          </div>
        </div>
      </section>

      {/* Module 14: Free Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Eligibility Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Admission & eVAL Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic credentials and target intake. Our senior counseling team in Dhanmondi, Dhaka will evaluate your university eligibility, scholarship opportunities, and eVAL timeline within 24 hours.
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

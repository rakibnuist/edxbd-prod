import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Landmark,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import AttestationWorkflowBuilder from '@/components/calculators/AttestationWorkflowBuilder';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/document-attestation-apostille-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const ATTESTATION_SOURCES = [
  {
    label: 'Ministry of Foreign Affairs (MoFA Bangladesh) — Consular & e-Apostille Service (myGov Portal)',
    href: 'https://www.mygov.bd/',
    note: 'Official Government of Bangladesh digital platform for online document verification, Ministry of Education / UGC forwarding, and MoFA e-Apostille / consular attestation in Dhaka.',
  },
  {
    label: 'University Grants Commission of Bangladesh (UGC) — Foreign Higher Education Degree Verification',
    href: 'https://ugc.gov.bd/',
    note: 'Statutory higher education regulator in Agargaon, Dhaka verifying Bangladeshi public and private university Bachelor’s and Master’s degrees prior to MoFA attestation.',
  },
  {
    label: 'Secondary and Higher Education Division (SHED), Ministry of Education, Bangladesh',
    href: 'https://shed.gov.bd/',
    note: 'Verifies Education Board SSC, HSC, and BTEB Polytechnic Diploma certificates at Bangladesh Secretariat / myGov prior to MoFA legalization.',
  },
  {
    label: 'Bangladesh Police — Online Police Clearance Certificate Portal',
    href: 'https://pcc.police.gov.bd/',
    note: 'Official Bangladesh Police portal for issuing machine-readable Police Clearance Certificates (automatically forwarded for MoFA verification) required for China, Korea, and European student visas.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Student Visa Document Attestation & Apostille in BD 2027',
    description:
      'Step-by-step guide to SSC, HSC & Bachelor certificate attestation, myGov e-Apostille, UGC, MoFA Dhaka & Embassy legalization across 12 study destinations.',
    path: PATH,
    locale: 'en_BD',
    image: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Student Visa Document Attestation & Apostille Guide in Bangladesh — EduExpress International',
    },
  });
}

const ATTESTATION_FAQS = [
  {
    question: 'What is the correct chain of attestation for SSC, HSC, and Bachelor certificates in Bangladesh?',
    answer:
      'In Bangladesh, foreign embassies and the Ministry of Foreign Affairs (MoFA Dhaka) will NOT attest an academic certificate unless it has first been verified by its issuing educational authority: (1) For SSC, HSC, Dakhil, and Alim certificates/transcripts, you first verify them through your respective Education Board (or Madrasah/Technical Board) and the Ministry of Education (SHED) via the integrated myGov portal; (2) For Bachelor’s and Master’s degrees from Bangladeshi public or private universities, your documents must first be attested by your university Controller of Examinations/Registrar, followed by the University Grants Commission (UGC) and Ministry of Education; and (3) Only after Board/UGC and Ministry of Education verification does the Ministry of Foreign Affairs (MoFA, Segunbagicha, Dhaka) issue its Consular Attestation or e-Apostille stamp.',
  },
  {
    question: 'What is the difference between an e-Apostille and traditional Embassy Consular Legalization in Bangladesh?',
    answer:
      'Following Bangladesh’s accession to the 1961 Hague Apostille Convention (implemented via the myGov e-Apostille system), documents bearing an official MoFA QR-coded e-Apostille are legally recognized across accepting Hague Convention member states without needing a second physical stamp at a foreign embassy. However, for countries that require bilateral consular legalization or specific national recognition procedures (such as specific embassy verification steps for South Korea D-2/GKS, Cyprus CRMD, or translated NCEQE/AZVO dossiers for Georgia and Croatia), applicants must still follow the exact consular legalization protocol specified by that embassy.',
  },
  {
    question: 'Which study destinations require full MoFA attestation before university admission vs before visa filing?',
    answer:
      'Knowing the timing saves months: (1) For China (X1/X2 Visa & CSC) and the UK (Student Route) and Malaysia (EMGS), you can apply for university admission using clear color scans of your original SSC/HSC/Bachelor certificates and Notary Public verification; Police Clearance (for China) and formal attestations are completed while your JW202/CAS/eVAL is processing. (2) For South Korea (GKS & D-2 Visa) and the Republic of Cyprus (CRMD Blue Slip), your academic transcripts, Family Relation Certificate, and Police Clearance MUST be attested by MoFA Dhaka and legalized BEFORE the application/CRMD dossier is submitted!',
  },
  {
    question: 'How do Bangladeshi students obtain a MoFA-verified Police Clearance Certificate for a student visa?',
    answer:
      'You apply online at the official Bangladesh Police portal (pcc.police.gov.bd) using your valid Passport number and permanent/present address, and pay the statutory BDT 500 Treasury Challan via Sonali Bank online. After local Thana verification and SP/DMP Police Commissioner approval, the digital certificate is automatically routed to the Ministry of Foreign Affairs (MoFA) system and issued with a verifiable QR code. Most embassies (China, South Korea, Hungary, Croatia, Greece, Cyprus) require a Police Clearance Certificate issued within the last 3 to 6 months.',
  },
  {
    question: 'What happens if my name or my parents’ names are spelled differently on my Passport, NID, and SSC/HSC certificates?',
    answer:
      'Name spelling mismatches (such as "Md" vs "Mohammad" or "Akter" vs "Akhter" between your SSC certificate, Birth Certificate, and your father’s bank account or tax return) are a major cause of MoFA rejection and embassy financial sponsorship delays. While minor parent spelling variations can be bridged for visa purposes with a First-Class Magistrate Affidavit and a City Corporation/Union Parishad Family Relation Certificate (FRC), your OWN name and date of birth on your Passport must match your SSC and HSC certificates character-for-character.',
  },
  {
    question: 'Does EduExpress assist students with myGov, MoFA, and embassy document preparation checklists?',
    answer:
      'Yes. Every student who opens a file with EduExpress (at BDT 0 file-opening charge) receives a destination-specific Document Legalization & Attestation Checklist mapping out which documents need Notary Public certification, Education Board/UGC verification, MoFA e-Apostille, or sworn language translation (e.g., Georgian or Croatian court translation).',
  },
];

export default function DocumentAttestationApostilleBangladeshPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: '2026-11-27',
        name: 'Student Visa Document Attestation, e-Apostille & MoFA Legalization Guide in Bangladesh (2027)',
        description:
          'Step-by-step guide to SSC, HSC & Bachelor certificate attestation, myGov e-Apostille, UGC, MoFA Dhaka & Embassy legalization across 12 study destinations.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og-image.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(ATTESTATION_SOURCES),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Your Study Journey', path: '/your-study-journey' },
          { name: 'Document Attestation & Apostille Guide' },
        ]}
        eyebrow="Education Board · UGC · MoFA Dhaka e-Apostille (myGov) · 12-Country Legalization Matrix"
        title="Student Visa Document Attestation & Apostille Guide in Bangladesh 2027."
        lead="A complete procedural manual for Bangladeshi students and families: verifying SSC, HSC, Diploma, and Bachelor certificates through the Education Board, UGC, Ministry of Education, and Ministry of Foreign Affairs (MoFA Dhaka myGov e-Apostille), obtaining QR-coded Police Clearance, and meeting country-specific consular legalization rules."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get My Country Document Checklist <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/student-visa-bank-solvency-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              12-Country Bank Solvency Guide
            </Link>
          </>
        }
      />

      <TrustBar />

      {/* Interactive Attestation & e-Apostille Workflow Builder */}
      <Section
        id="attestation-workflow-builder"
        tone="sage"
        title="Build your custom Dhaka document attestation &amp; e-Apostille checklist."
        intro="Choose your target study destination and your Bangladeshi academic qualification (Education Board SSC/HSC, O/A-Levels, Bachelor’s degree, or BTEB Diploma) to generate your sequential legalization roadmap and timeline."
      >
        <AttestationWorkflowBuilder />
      </Section>

      {/* Module 1: 12-Country Attestation & Translation Requirements Matrix */}
      <Section
        id="country-attestation-matrix"
        tone="white"
        title="12-country document attestation, Apostille &amp; translation matrix (2027)."
        intro="Not every destination requires costly consular legalization before you apply. Check exactly what is required at the University Offer stage versus the Embassy Visa stage."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
            <caption className="sr-only">12-country academic document attestation and Police Clearance requirements for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Destination</th>
                <th className="px-5 py-4 font-bold">University Application Stage</th>
                <th className="px-5 py-4 font-bold">Visa / Consular Stage Attestation</th>
                <th className="px-5 py-4 font-bold">Police Clearance (PCC) &amp; Medical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/china-student-visa-bangladesh" className="hover:underline">China (Flagship)</Link>
                </td>
                <td className="px-5 py-4">Original Color Scans / Notary Public</td>
                <td className="px-5 py-4">Original Certificates + JW202/DQ at Dhaka Visa Center</td>
                <td className="px-5 py-4">Online Police Clearance (MoFA QR) + Foreigner Physical Exam Form</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/malaysia-student-visa-bangladesh" className="hover:underline">Malaysia</Link>
                </td>
                <td className="px-5 py-4">Clear Color Scans of Original Transcripts</td>
                <td className="px-5 py-4">Original Certificates for EMGS &amp; Dhaka High Commission SEV</td>
                <td className="px-5 py-4">Pre-arrival Health Declaration + 7-day post-arrival EMGS clinic test</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/uk-student-visa-bangladesh" className="hover:underline">United Kingdom</Link>
                </td>
                <td className="px-5 py-4">Original Color Scans of Certificates</td>
                <td className="px-5 py-4">Originals scanned at VFS Global BD (No MoFA stamp needed)</td>
                <td className="px-5 py-4">Mandatory IOM Dhaka / Sylhet TB Clearance Certificate</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/south-korea-student-visa-bangladesh" className="hover:underline">South Korea</Link>
                </td>
                <td className="px-5 py-4 font-bold text-amber-900">MoFA + Consular / Apostille Required Early</td>
                <td className="px-5 py-4">Board/UGC → MoE → MoFA → Korean Embassy Legalization</td>
                <td className="px-5 py-4">Designated Dhaka Hospital TB Certificate + MoFA-attested FRC</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/hungary-student-visa-bangladesh" className="hover:underline">Hungary</Link>
                </td>
                <td className="px-5 py-4">Original Color Scans for Entrance Exam</td>
                <td className="px-5 py-4">Board/UGC → MoE → MoFA Attestation / e-Apostille</td>
                <td className="px-5 py-4">Medical Certificate (for Stipendium) + EUR 30,000 Travel Insurance</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/finland-student-visa-bangladesh" className="hover:underline">Finland</Link>
                </td>
                <td className="px-5 py-4">Official Transcripts on Studyinfo.fi</td>
                <td className="px-5 py-4">Original Certificates verified in person at VFS New Delhi</td>
                <td className="px-5 py-4">Swisscare / SIP Migri-compliant Health Insurance (€40k/€120k)</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/cyprus-student-visa-bangladesh" className="hover:underline">Cyprus (EU Republic)</Link>
                </td>
                <td className="px-5 py-4">Color Scans for Admission Interview</td>
                <td className="px-5 py-4 font-bold text-amber-900">Full MoFA &amp; Consular Attestation Couriered to Nicosia</td>
                <td className="px-5 py-4">MoFA-attested PCC + 4-Panel Medical (HIV, Hep B/C, VDRL, X-Ray)</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/malta-student-visa-bangladesh" className="hover:underline">Malta</Link>
                </td>
                <td className="px-5 py-4">Original Color Scans for MFHEA Offer</td>
                <td className="px-5 py-4">Board/UGC → MoE → MoFA e-Apostille + VFS Biometrics</td>
                <td className="px-5 py-4">Full-duration EUR 30,000 Health Insurance + Landlord ID Form</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/georgia-student-visa-bangladesh" className="hover:underline">Georgia (MD/STEM)</Link>
                </td>
                <td className="px-5 py-4">Notarized Georgian Translation for NCEQE</td>
                <td className="px-5 py-4">NCEQE Order + MES Ministerial Decree + MoFA Attestation</td>
                <td className="px-5 py-4">Pre-departure BMDC Eligibility Certificate (mandatory for MD/MBBS)</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/greece-student-visa-bangladesh" className="hover:underline">Greece</Link>
                </td>
                <td className="px-5 py-4">Attested Transcripts for HAHE Faculty</td>
                <td className="px-5 py-4">Board/UGC → MoE → MoFA e-Apostille / Legalization</td>
                <td className="px-5 py-4">MoFA-attested Police Clearance + Infectious-Disease Medical Cert</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/croatia-student-visa-bangladesh" className="hover:underline">Croatia</Link>
                </td>
                <td className="px-5 py-4">Attested Transcripts for AZVO Recognition</td>
                <td className="px-5 py-4">MoFA Legalized Academic &amp; PCC + Certified Croatian Translation</td>
                <td className="px-5 py-4">MoFA-attested Police Clearance (&lt;6 mos old) for MUP Form 1a</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">
                  <Link href="/thailand-student-visa-bangladesh" className="hover:underline">Thailand</Link>
                </td>
                <td className="px-5 py-4">Original Color Scans for Offer</td>
                <td className="px-5 py-4">MoFA Attested Certificates + University Visa Request Letter</td>
                <td className="px-5 py-4">Police Clearance + Medical Certificate for Royal Thai Embassy Dhaka</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: 5-Step Bangladesh Attestation Workflow */}
      <Section
        id="attestation-steps"
        tone="sage"
        title="5-step academic &amp; consular attestation workflow in Dhaka."
        intro="Follow the exact statutory sequence so your documents are never rejected at the Ministry of Foreign Affairs (MoFA)."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Step 01',
              title: 'Issuing Board or University Registrar Verification',
              body: 'For SSC/HSC: verify through your Education Board (Dhaka, Cumilla, Rajshahi, etc. or Madrasah/BTEB). For Bachelor’s/Master’s: obtain official sealed verification from your university Controller of Examinations / Registrar.',
            },
            {
              step: 'Step 02',
              title: 'Ministry of Education (SHED) & UGC Endorsement',
              body: 'Submit your board certificates for Ministry of Education (SHED) verification, and your private/public university degree certificates for University Grants Commission (UGC, Agargaon) endorsement via the myGov system.',
            },
            {
              step: 'Step 03',
              title: 'Online Police Clearance (pcc.police.gov.bd)',
              body: 'Apply online with your valid Passport and BDT 500 Sonali Bank e-Challan. Once approved by your local Thana and Police Superintendent / DMP, it is automatically routed for MoFA digital verification.',
            },
            {
              step: 'Step 04',
              title: 'Family Relation Certificate (FRC) & Name Audit',
              body: 'Obtain an English Family Relation Certificate from your City Corporation / Municipality / Union Parishad confirming exact parent-child name spellings matching your Passport, Birth Certificate, and sponsor tax returns.',
            },
            {
              step: 'Step 05',
              title: 'MoFA Dhaka e-Apostille & Embassy Legalization',
              body: 'Complete the Ministry of Foreign Affairs (MoFA, Segunbagicha / myGov) attestation to receive your QR-coded e-Apostille or consular stamp, followed by target Embassy legalization where required (e.g., South Korea).',
            },
            {
              step: 'Step 06',
              title: 'BMDC Eligibility Certificate (For Medical Students)',
              body: 'If studying MBBS/MD in China, Georgia, or Europe, submit your SSC & HSC certificates (Biology ≥ 3.50) at the BMDC Office in Bijoy Nagar, Dhaka to obtain your pre-departure Foreign Medical Eligibility Certificate.',
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
        items={ATTESTATION_FAQS}
        title="Frequently asked questions about document attestation &amp; Apostille in Bangladesh."
        tone="white"
      />

      {/* Module 4: Official Sources & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Government of Bangladesh verification portals.">
        <div className="grid gap-4 sm:grid-cols-2">
          {ATTESTATION_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by{' '}
            <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">
              Abdullah Al Rakib
            </Link>{' '}
            (Founder &amp; CEO, EduExpress International) and <strong>Md Taj Ahmmed</strong> (Files &amp; Visa Processing Executive) at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides document preparation and visa-application guidance under written service terms. Official certificate verification, Apostille issuance, and consular legalization rest solely with the respective Education Boards, UGC, Ministry of Education, Ministry of Foreign Affairs (MoFA), and foreign diplomatic missions.
          </p>
        </div>
      </Section>

      {/* Module 5: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Free Document &amp; Spelling Parity Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Get Your Custom Document Attestation &amp; Visa Checklist</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your target country and academic qualifications. Our Dhanmondi processing desk will provide your exact document attestation sequence with BDT 0 file-opening charges.
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

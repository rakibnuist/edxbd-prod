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
const PATH = '/cyprus-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const CYPRUS_VISA_SOURCES = [
  {
    label: 'Civil Registry and Migration Department (CRMD — Republic of Cyprus)',
    href: 'https://www.moi.gov.cy/crmd',
    note: 'Statutory EU government department issuing international student Entry Permits (Blue Slip), verifying EUR 7,000–8,000 solvency, and issuing Temporary Residence Permits (Pink Slip).',
  },
  {
    label: 'Cyprus Agency of Quality Assurance and Accreditation in Higher Education (CYQAA / DIPAE)',
    href: 'https://www.dipae.ac.cy/index.php/en/',
    note: 'Statutory national accreditation agency of the Republic of Cyprus certifying Bologna Process ECTS and European Qualifications Framework (EQF) degrees.',
  },
  {
    label: 'Ministry of Education, Sport and Youth (Republic of Cyprus)',
    href: 'https://www.moec.gov.cy/en/',
    note: 'Central government authority governing non-EU international student admission rules, English proficiency thresholds, and institutional quotas.',
  },
  {
    label: 'Department of Labour (Ministry of Labour and Social Insurance — Cyprus)',
    href: 'https://www.mlsi.gov.cy/dl',
    note: 'Statutory regulator enforcing the mandatory 6-month study period before international students can work up to 20 hours/week in approved economic sectors.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and wiring tuition in EUR to CYQAA-accredited universities in the Republic of Cyprus.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Cyprus Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Republic of Cyprus (EU) student Entry Permit guide for Bangladeshi students: CRMD €7,000–€8,000 solvency, MoFA attestation, Pink Slip, and 6-mo work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('cyprus', 'Cyprus Student Visa from Bangladesh — EduExpress International'),
  });
}

const CYPRUS_VISA_FAQS = [
  {
    question: 'How is the Cyprus student visa (Entry Permit / Blue Slip) issued for Bangladeshi students?',
    answer:
      'In the Republic of Cyprus (EU), student entry clearance is centrally processed through the Civil Registry and Migration Department (CRMD) in Nicosia via your admitting university or college. After you pass your university admission interview, remit your first-year tuition deposit via a Bangladesh Bank Student File, and courier your MoFA/consular-attested academic, police, medical, and bank solvency documents to Cyprus, the university lodges your file directly with CRMD. Once approved, CRMD issues your official Student Entry Permit (Blue Slip), allowing you to fly to Larnaca International Airport (LCA) and obtain your biometric Temporary Residence Permit (Pink Slip).',
  },
  {
    question: 'Why must Bangladeshi families strictly distinguish the Republic of Cyprus (EU) from Northern Cyprus?',
    answer:
      'The Republic of Cyprus (South Cyprus — cities such as Nicosia, Limassol, Larnaca, and Paphos) is a sovereign member state of the European Union (EU) and Eurozone, where degrees accredited by CYQAA carry full European Qualifications Framework (EQF) recognition. In contrast, Northern Cyprus (the self-declared "TRNC") is unrecognized internationally outside Turkey, has no EU membership or European residence status, and attempting to cross from Northern Cyprus into the EU Republic of Cyprus is treated as an illegal border entry. EduExpress processes strictly for CYQAA-accredited institutions in the sovereign Republic of Cyprus (EU).',
  },
  {
    question: 'What is the CRMD bank solvency requirement for a Cyprus student visa from Bangladesh?',
    answer:
      'The Civil Registry and Migration Department (CRMD) requires non-EU degree applicants to submit an official Bank Solvency Certificate and a 3 to 6-month bank statement from an Authorized Dealer commercial bank in Bangladesh showing a liquid closing balance of at least EUR 7,000 to EUR 8,000 (~9.2 to 10.5 Lakh BDT), alongside proof of paid first-year/first-semester tuition via SWIFT MT103. The bank statement, parent Sponsor Affidavit, and Family Relation Certificate must be attested by the issuing bank and the Ministry of Foreign Affairs (MoFA) in Dhaka.',
  },
  {
    question: 'What medical tests and document attestations are mandatory before applying to CRMD?',
    answer:
      'CRMD mandates four specific medical laboratory blood and radiology clearances issued by a recognized hospital in Bangladesh and attested by the Ministry of Health / MoFA Dhaka: (1) HIV / AIDS negative report, (2) Hepatitis B and Hepatitis C negative report, (3) VDRL / Syphilis negative report, and (4) a normal Chest X-Ray report confirming absence of Tuberculosis (TB). Because you must re-take these same medical tests upon landing in Cyprus for your Pink Slip residence card, pre-departure medical accuracy is critical.',
  },
  {
    question: 'When can Bangladeshi students legally start part-time work in the Republic of Cyprus?',
    answer:
      'Under Cyprus Ministry of Labour and Social Insurance decrees, international students enrolled in recognized full-time programs may work up to 20 hours per week during academic semesters (and up to 38 hours/week during holidays) strictly AFTER completing their first 6 months of physical study and residence in Cyprus. Students must register a formal employment contract with the District Labour Office in approved sectors (hospitality, food delivery, restaurant service, retail logistics, or agriculture).',
  },
  {
    question: 'What is EduExpress’s service charge for Republic of Cyprus admission and Entry Permit processing?',
    answer:
      'EduExpress operates with a BDT 0 file-opening charge. You pay zero upfront consultancy fees during university selection, admission interview preparation, or CRMD file compilation. Under our written European service terms, our BDT 100,000 service fee is payable 100% after your official CRMD Student Entry Permit is approved, while third-party costs (tuition payment via Student File, MoFA/consular document attestation, medical tests, and CRMD permit fees) are paid directly by the student.',
  },
];

export default async function CyprusStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Cyprus', 'cyprus'] }, isActive: true },
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
        name: 'Cyprus Student Visa from Bangladesh 2027: Republic of Cyprus (EU) CRMD Entry Permit Guide',
        description:
          'Republic of Cyprus (EU) student Entry Permit guide for Bangladeshi students: CRMD €7,000–€8,000 solvency, MoFA attestation, Pink Slip, and 6-mo work.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/cyprus.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CYPRUS_VISA_SOURCES),
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
          { name: 'Cyprus', path: '/study-in-cyprus-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Republic of Cyprus (EU) · CRMD Entry Permit & Pink Slip · BDT 0 Upfront File Fee"
        title="Cyprus Student Visa from Bangladesh 2027."
        lead="An evidence-first guide to obtaining the Republic of Cyprus (European Union) Student Entry Permit from Bangladesh: verifying CYQAA institutional accreditation, MoFA & consular document attestation, EUR 7,000–8,000 CRMD bank solvency, Larnaca Airport clearance, and post-arrival Pink Slip issuance."
        actions={
          <>
            <Link href="/apply?country=Cyprus" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Cyprus Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/cyprus-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Cyprus Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Cyprus" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Cyprus visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 132 BDT</strong> · Jurisdiction: <strong>Sovereign Republic of Cyprus (EU Member State)</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Statutory Authority
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">CRMD Nicosia (EU)</p>
              <p className="mt-1 text-xs text-slate-600">Entry Permit (Blue Slip) issued in Cyprus, followed by Pink Slip card.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> CRMD Bank Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€7,000 – €8,000</p>
              <p className="mt-1 text-xs text-slate-600">~9.2L–10.5L BDT attested 6-mo statement + paid tuition SWIFT MT103.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Quality Assurance
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">CYQAA (DIPAE) Only</p>
              <p className="mt-1 text-xs text-slate-600">Bologna ECTS accredited EU universities in Nicosia, Limassol &amp; Larnaca.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Clock size={16} className="text-emerald-700" /> Labour Dept Rule
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">20 hrs/wk After 6 Mos</p>
              <p className="mt-1 text-xs text-slate-600">Mandatory 6-month initial study period before part-time work rights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage CRMD Entry Permit Process */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Republic of Cyprus (EU) student visa process from Bangladesh."
        intro="Unlike embassy-sticker visas, the Cypriot Student Entry Permit is lodged directly with the Civil Registry and Migration Department (CRMD) in Nicosia by your admitting university."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'CYQAA Admission & Pre-Visa Interview',
              timeline: '12–16 Weeks Before Intake',
              body: 'Apply to a CYQAA-accredited public or private university in the Republic of Cyprus (minimum IELTS 5.5+ for Bachelor/Master). Pass the university’s online academic compliance interview.',
            },
            {
              step: 'Stage 02',
              title: 'MoFA & Consular Attestation of 4 Core Files',
              timeline: '10–12 Weeks Before Intake',
              body: 'Attest your SSC/HSC/Bachelor certificates, Police Clearance Certificate, 4-panel Medical Report (HIV, Hep B/C, VDRL, Chest X-Ray), and 6-month Bank Solvency through MoFA Dhaka and consular legalization.',
            },
            {
              step: 'Stage 03',
              title: 'Student File Tuition Wire (SWIFT MT103)',
              timeline: '8–10 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh and wire your first-year tuition deposit and CRMD migration fee in EUR directly to the university’s Cypriot IBAN.',
            },
            {
              step: 'Stage 04',
              title: 'Courier Original Attested Dossier to Nicosia',
              timeline: '6–8 Weeks Before Intake',
              body: 'Dispatch your attested physical documents via DHL/FedEx to the university’s International Visa Office in Cyprus, which submits the file directly to CRMD in Nicosia.',
            },
            {
              step: 'Stage 05',
              title: 'CRMD Entry Permit (Blue Slip) Issuance',
              timeline: '3–5 Weeks CRMD Processing',
              body: 'CRMD audits your academic, financial, and security records. Once approved, the official Student Entry Permit (Blue Slip) is issued and sent to you for flight boarding to Larnaca (LCA).',
            },
            {
              step: 'Stage 06',
              title: 'Larnaca Arrival, Medical Re-Test & Pink Slip',
              timeline: 'Within 7–14 Days of Landing',
              body: 'Arrive at Larnaca Airport carrying EUR 1,500–2,000 pocket cash and your Blue Slip. Complete the mandatory Cypriot medical re-check and biometrics to receive your annual Temporary Residence Card (Pink Slip).',
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

      {/* Module 2: Republic of Cyprus (EU) vs Northern Cyprus Warning & Compliance */}
      <Section
        id="jurisdiction-guardrail"
        tone="sage"
        title="Jurisdiction guardrail: Republic of Cyprus (EU) vs Northern Cyprus."
        intro="Protecting Bangladeshi families from deceptive 'easy Europe visa' claims requires complete clarity on Cypriot legal jurisdiction."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">Sovereign Republic of Cyprus (EU Member State)</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Full European Union Member Since 2004:</strong> Governed from Nicosia, using the Euro (€), with degrees accredited by CYQAA (DIPAE) recognized across all 27 EU member states under the Bologna Process.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Official Entry Points:</strong> International students enter legally exclusively via <strong>Larnaca International Airport (LCA)</strong> or <strong>Paphos International Airport (PFO)</strong> holding a CRMD Entry Permit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Verified Institutions:</strong> Includes University of Cyprus (UCY), Cyprus University of Technology (CUT), University of Nicosia (UNIC), European University Cyprus (EUC), and UCLan Cyprus.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical Warning Against Northern Cyprus ("TRNC") Traps</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Not Part of the European Union:</strong> Northern Cyprus (accessed via Ercan Airport through Turkey without IELTS) is not recognized by the UN, the EU, or Bangladesh, and grants zero European Union residence rights.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Illegal Green-Line Crossing Risk:</strong> Agencies that tell students they can fly to Northern Cyprus and "walk across the border into South Cyprus (EU)" are promoting an illegal immigration offense that leads to arrest and deportation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Larnaca Airport Cash &amp; Receipt Check:</strong> Even with an authentic Republic of Cyprus (EU) CRMD Blue Slip, arriving at Larnaca Airport without your original tuition receipt and EUR 1,500–2,000 travel cash can result in border refusal.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Cypriot Universities */}
      {universities.length > 0 && (
        <Section
          id="cyprus-universities"
          tone="white"
          title="Verified Republic of Cyprus (EU) universities in our directory."
          intro="Compare CYQAA-accredited public and private universities in Nicosia, Limassol, and Larnaca."
          action={
            <Link href="/universities?country=cyprus" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Cyprus universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Republic of Cyprus'}</span>
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
              BDT 0 File-Opening Charge · Pay EduExpress Only After Entry Permit Approval
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We charge BDT 0 upfront to open your Republic of Cyprus file. Every third-party cost (Student File tuition wire, MoFA/consular document attestation, medical tests, and CRMD permit fees) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is payable only after CRMD Entry Permit issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-cyprus-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Cyprus Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/cyprus-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Cyprus Tuition &amp; Living Cost Breakdown
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
        items={CYPRUS_VISA_FAQS}
        title="Frequently asked questions about the Cyprus student visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Cypriot regulatory sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CYPRUS_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Republic of Cyprus Civil Registry and Migration Department (CRMD) rules, CYQAA accreditation registers, and Bangladesh Bank Foreign Exchange rules on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, scholarship award, and CRMD Entry Permit / Pink Slip decisions rest solely with the respective Cypriot institutions and the Civil Registry and Migration Department of the Republic of Cyprus.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">CYQAA &amp; CRMD Eligibility Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Republic of Cyprus (EU) Admission &amp; Visa Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS score, and budget. Our Dhanmondi team will prepare your CYQAA university comparison and CRMD document checklist within one working day.
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

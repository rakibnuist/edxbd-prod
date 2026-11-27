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
const PATH = '/croatia-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const CROATIA_VISA_SOURCES = [
  {
    label: 'Ministry of the Interior of the Republic of Croatia (MUP — Temporary Stay for Studies)',
    href: 'https://mup.gov.hr/',
    note: 'Statutory Croatian immigration authority administering First Temporary Stay Permits for the Purpose of Studies (privremeni boravak u svrhu studiranja), National Type D entry visas, and biometric stay cards.',
  },
  {
    label: 'Agency for Science and Higher Education (ASHE / AZVO Croatia)',
    href: 'https://www.azvo.hr/en/',
    note: 'Statutory national quality assurance and ENIC/NARIC recognition agency verifying foreign secondary and higher education qualifications for admission to Croatian universities.',
  },
  {
    label: 'Study in Croatia — Official National Higher Education Portal',
    href: 'https://www.studyincroatia.hr/',
    note: 'Official state portal detailing English-taught degree admissions, OIB tax number registration, health insurance rules, and Student Centre (Studentski centar) employment rights.',
  },
  {
    label: 'Ministry of Foreign and European Affairs of the Republic of Croatia (Consular & VFS Portal)',
    href: 'https://mvep.gov.hr/en',
    note: 'Diplomatic authority overseeing National Long-Stay (Type D) entry visa applications and VFS Global biometric submissions via the Embassy of Croatia in New Delhi.',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and wiring tuition in EUR to Croatian university IBAN accounts.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Croatia Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Croatia Type D student visa & MUP Temporary Stay Permit guide for Bangladeshi students: AZVO recognition, €4,800–€6,600 bank solvency, and Zagreb work.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('croatia', 'Croatia Student Visa from Bangladesh — EduExpress International'),
  });
}

const CROATIA_VISA_FAQS = [
  {
    question: 'How do the Croatian Temporary Stay Permit (MUP) and National Type D Visa work together?',
    answer:
      'To study a full-time degree in Croatia for longer than 90 days, Bangladeshi students apply simultaneously or sequentially for two statutory approvals under the Croatian Aliens Act: (1) a First Temporary Stay Permit for the Purpose of Studies (privremeni boravak u svrhu studiranja) evaluated by the Ministry of the Interior (MUP — local police administration in Zagreb, Split, Rijeka, or Osijek), and (2) a National Long-Stay Visa (Type D) issued via the Embassy of Croatia in New Delhi / VFS Global that allows you to enter Croatia and collect your physical biometric Temporary Stay Card (Boravišna iskaznica).',
  },
  {
    question: 'What is AZVO academic qualification recognition and why is it mandatory before visa filing?',
    answer:
      'Before a Croatian public or private university can issue your final unconditional enrollment confirmation for MUP residence processing, your Bangladeshi SSC/HSC certificates (for Bachelor’s/MD) or Bachelor’s degree (for Master’s) must undergo official foreign qualification recognition through Croatia’s Agency for Science and Higher Education (ASHE / AZVO ENIC/NARIC office) or the university’s dedicated academic recognition committee. Starting AZVO verification 3 to 4 months before semester start is essential.',
  },
  {
    question: 'How much bank balance is required by MUP Croatia for a student residence permit from Bangladesh?',
    answer:
      'The Ministry of the Interior (MUP) requires non-EU students to prove regular monthly subsistence funds of at least EUR 400 to EUR 550 per month for a 12-month academic year (minimum EUR 4,800 to EUR 6,600, or ~6.3 to 8.7 Lakh BDT), on top of having paid your first-year or first-semester university tuition via a Bangladesh Bank Student File. EduExpress recommends maintaining a liquid closing balance of EUR 6,500 to EUR 7,500 (~8.5 to 10.0 Lakh BDT) in a recognized Bangladeshi commercial bank account for 3 to 6 months, supported by sponsor tax returns (TIN/IT-10B) and a notarized Affidavit of Financial Support.',
  },
  {
    question: 'What police clearance and apostille/legalization rules apply to Croatian student permits?',
    answer:
      'Every first-time Temporary Stay Permit applicant over age 14 must submit an official Police Clearance Certificate from Bangladesh confirming no criminal convictions, issued within the last 6 months prior to application. Both your Police Clearance Certificate and your academic transcripts must be attested by the Ministry of Foreign Affairs (MoFA) in Dhaka, translated by a certified court translator into Croatian (or English where accepted by the consular mission), and legalized per Croatian diplomatic requirements.',
  },
  {
    question: 'How do Bangladeshi students work part-time in Croatia through the Student Centre (Studentski centar)?',
    answer:
      'Once you arrive in Croatia, obtain your Croatian Personal Identification Number (OIB) from the Tax Administration, and collect your biometric MUP Temporary Stay Card, you can register at your university city’s Student Centre (Studentski centar — SC Zagreb, SC Split, SC Rijeka). Under the Croatian Student Work Act, full-time international students work via an official Student Contract (Studentski ugovor) at a government-mandated minimum student wage (approximately EUR 5.25 to EUR 5.60/hour net), earning EUR 420–650/month during term-time.',
  },
  {
    question: 'What is EduExpress’s service charge for Croatia admission, AZVO recognition, and MUP visa guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge. You pay zero upfront consultancy fees during university selection, AZVO academic recognition preparation, or MUP/VFS filing. Under our written European service terms, our BDT 100,000 service package is payable 100% after your Croatian Type D visa / MUP stay approval is granted, while third-party statutory charges (AZVO fee, tuition transfer via Student File, court translation, and VFS/MUP fees) are paid directly by the student.',
  },
];

export default async function CroatiaStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Croatia', 'croatia'] }, isActive: true },
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
        name: 'Croatia Student Visa from Bangladesh 2027: MUP Temporary Stay Permit & AZVO Guide',
        description:
          'Croatia Type D student visa & MUP Temporary Stay Permit guide for Bangladeshi students: AZVO recognition, €4,800–€6,600 bank solvency, and Zagreb work.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/croatia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CROATIA_VISA_SOURCES),
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
          { name: 'Croatia', path: '/study-in-croatia-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="MUP Temporary Stay Permit · AZVO Academic Recognition · BDT 0 Upfront File Fee"
        title="Croatia Student Visa from Bangladesh 2027."
        lead="An evidence-first regulatory guide for Bangladeshi students applying for the Croatian First Temporary Stay Permit for the Purpose of Studies (MUP) and National Type D Entry Visa: completing AZVO qualification recognition, structuring EUR 4,800–6,600+ bank solvency, police clearance legalization, and OIB & Student Centre registration."
        actions={
          <>
            <Link href="/apply?country=Croatia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Croatia Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/croatia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Croatia MD &amp; STEM Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Croatia" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Croatia visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 132 BDT</strong> (European Union &amp; Eurozone Higher Education System).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Service Fee 100% After Visa
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Globe size={16} className="text-emerald-700" /> Permit Structure
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">MUP Stay + Type D</p>
              <p className="mt-1 text-xs text-slate-600">Temporary Stay for Studies (privremeni boravak) + Type D entry visa.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <FileCheck2 size={16} className="text-emerald-700" /> Academic Gate
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">AZVO (ASHE) Check</p>
              <p className="mt-1 text-xs text-slate-600">Mandatory ENIC/NARIC academic recognition of BD certificates.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> MUP Bank Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€6,000 – €7,500</p>
              <p className="mt-1 text-xs text-slate-600">~7.9L–10.0L BDT recommended 6-mo balance + paid tuition SWIFT MT103.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <IdCard size={16} className="text-emerald-700" /> Student Centre Work
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Studentski Centar</p>
              <p className="mt-1 text-xs text-slate-600">Statutory €5.25–€5.60/hr minimum student wage via OIB &amp; SC contract.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage Croatia MUP & Type D Visa Process */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Croatia student visa &amp; MUP Temporary Stay process."
        intro="Because AZVO foreign qualification recognition and MUP police administration review take 10 to 16 weeks combined, start your file early."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'AZVO Recognition & Entrance Exam',
              timeline: '14–18 Weeks Before Intake',
              body: 'Submit attested SSC/HSC or Bachelor transcripts for AZVO / university academic recognition and pass the English & subject entrance interview (Zagreb, Split, Rijeka, or Algebra).',
            },
            {
              step: 'Stage 02',
              title: 'Student File Tuition Wire (SWIFT MT103)',
              timeline: '10–14 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh and remit your first-year tuition in EUR directly to the Croatian university’s institutional IBAN.',
            },
            {
              step: 'Stage 03',
              title: 'Police Clearance, Translation & Housing',
              timeline: '8–11 Weeks Before Intake',
              body: 'Obtain your MoFA-attested Police Clearance Certificate (valid <6 months), certified Croatian translations, confirmed Zagreb/Split dormitory or lease agreement, and 6-month bank statement (€6,000–€7,500).',
            },
            {
              step: 'Stage 04',
              title: 'VFS / Consular Submission (Form 1a & Type D)',
              timeline: '6–9 Weeks Before Intake',
              body: 'Submit your MUP Temporary Stay application (Form 1a), National Type D Visa application, travel health insurance, and biometrics via the VFS Global / Embassy of Croatia New Delhi channel.',
            },
            {
              step: 'Stage 05',
              title: 'MUP Police Approval & Type D Visa Stamp',
              timeline: '4–6 Weeks Processing',
              body: 'The local MUP Police Directorate in your Croatian university city approves your Temporary Stay for Studies, and the Embassy issues your National Type D Entry Visa.',
            },
            {
              step: 'Stage 06',
              title: 'Arrival in Croatia, OIB, Biometric Card & X-ica',
              timeline: 'Within 3–30 Days of Landing',
              body: 'Register your Croatian residential address with MUP within 3 days, collect your OIB tax number and biometric Temporary Stay Card (Boravišna iskaznica), and activate your subsidized X-ica student card.',
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

      {/* Module 2: Education-First Compliance & MUP Refusal Prevention */}
      <Section
        id="refusal-prevention"
        tone="sage"
        title="How to pass MUP Croatia scrutiny and avoid refusal."
        intro="Croatian immigration officers verify that every applicant is a genuine degree student with authentic academic qualifications and clean financial provenance."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">MUP &amp; Consular Compliance Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Official OIB &amp; University Enrollment Contract:</strong> Ensure your admission package includes the official Croatian-language confirmation of full-time student status (Potvrda o upisu) alongside your English acceptance letter.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Notarized Lease or Dormitory Proof:</strong> If renting privately in Zagreb, Split, or Rijeka, MUP requires a solemnized/notarized rental contract and proof of the landlord’s property ownership from the Croatian Land Registry.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>HZZO Mandatory Health Insurance Note:</strong> Be aware that non-EU students on a Temporary Stay Permit in Croatia must register with the Croatian Health Insurance Fund (HZZO) after arrival and pay the statutory monthly contribution.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Top Croatian Visa Refusal Triggers to Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Strict Education-First Standard:</strong> Never apply to Croatia with the objective of border transit or non-academic migration. MUP revokes permits immediately if a student fails to attend university lectures or register for semester exams.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Expired or Un-Legalized Police Clearance:</strong> Submitting a Bangladeshi Police Clearance Certificate older than 6 months or lacking MoFA/consular legalization stalls MUP Form 1a processing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Unverified Cash Deposits:</strong> Sudden lump-sum deposits in a sponsor account without NBR tax returns (IT-10B) or verifiable business/salary trails lead to financial refusal.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Croatian Universities */}
      {universities.length > 0 && (
        <Section
          id="croatia-universities"
          tone="white"
          title="Verified Croatian universities in the EduExpress directory."
          intro="Compare AZVO-accredited universities in Zagreb, Split, and Rijeka."
          action={
            <Link href="/universities?country=croatia" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Croatia universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Croatia'}</span>
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
              We charge BDT 0 upfront to open your Croatia file. Every third-party cost (AZVO recognition fee, Student File tuition transfer, court translation, and MUP/VFS fees) is itemized in writing on your <strong>ClearCost Sheet</strong>, and our BDT 100,000 service fee is due only after Type D visa issuance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-croatia-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Croatia Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/croatia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Croatia Tuition &amp; Living Cost Breakdown
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
        items={CROATIA_VISA_FAQS}
        title="Frequently asked questions about the Croatia student visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Croatian regulatory sources &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CROATIA_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Ministry of the Interior of the Republic of Croatia (MUP) Temporary Stay regulations, AZVO ENIC/NARIC guidelines, and Study in Croatia statutory rules on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final AZVO recognition, admission, and MUP Temporary Stay or Type D visa decisions rest solely with the respective Croatian universities and official Croatian authorities.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">AZVO &amp; MUP Eligibility Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Croatia University &amp; Study Permit Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS status, and target field (MD Medicine, STEM, or Business). Our Dhanmondi team will prepare your AZVO and MUP roadmap within one working day.
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

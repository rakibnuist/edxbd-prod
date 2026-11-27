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
const PATH = '/thailand-student-visa-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const THAILAND_VISA_SOURCES = [
  {
    label: 'Royal Thai Embassy, Dhaka — Non-Immigrant ED (Education) Visa Requirements',
    href: 'https://dhaka.thaiembassy.org/',
    note: 'Accredited Thai diplomatic mission in Baridhara/Gulshan, Dhaka governing Non-Immigrant Category "ED" student visa checklists, Thai e-Visa submissions, and bank solvency verification.',
  },
  {
    label: 'Thai E-Visa Official Portal (Ministry of Foreign Affairs of the Kingdom of Thailand)',
    href: 'https://www.thaievisa.go.th/',
    note: 'Official online portal for submitting Non-Immigrant ED student visa applications and downloading approved electronic visa grants.',
  },
  {
    label: 'Immigration Bureau of Thailand — 1-Year Study Extension (TM.7) & 90-Day Reporting (TM.47)',
    href: 'https://www.immigration.go.th/',
    note: 'Statutory immigration authority governing post-arrival 1-year study extensions (THB 1,900), 90-day address notifications (TM.47), and Re-Entry Permits (TM.8).',
  },
  {
    label: 'Ministry of Higher Education, Science, Research and Innovation (MHESI Thailand)',
    href: 'https://www.mhesi.go.th/',
    note: 'Central government ministry accrediting Thai public and international universities (Chulalongkorn, Mahidol, Thammasat SIIT, AIT, Assumption, KMITL).',
  },
  {
    label: 'Bangladesh Bank — Foreign Exchange Policy (Student File SWIFT Transfers)',
    href: 'https://www.bb.org.bd/en/index.php/fepd/fepdguideline',
    note: 'Authorized Dealer bank regulations for opening a Student File and wiring semester tuition to Thai universities.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Thailand Student Visa from Bangladesh 2027 | EduExpress',
    description:
      'Thailand Non-Immigrant ED student visa guide for Bangladeshi students: Royal Thai Embassy Dhaka e-Visa process, 5L–8L BDT solvency, MHESI, and TM.47.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('thailand', 'Thailand Student Visa from Bangladesh — EduExpress International'),
  });
}

const THAILAND_VISA_FAQS = [
  {
    question: 'What is the Thailand Non-Immigrant ED Visa and how does it work for Bangladeshi students?',
    answer:
      'The Non-Immigrant Category "ED" (Education) Visa is the official student entry visa issued by the Royal Thai Embassy in Dhaka to Bangladeshi citizens enrolled in full-time degree or academic exchange programs at MHESI-accredited Thai universities (such as Chulalongkorn University, Mahidol University, Thammasat SIIT, Asian Institute of Technology — AIT, or Assumption University). The initial Non-ED visa grants a 90-day stay upon arrival at Suvarnabhumi Airport (BKK), which your university’s International Student Office then extends to a 1-year study permit (Form TM.7, fee THB 1,900) at the Thai Immigration Bureau.',
  },
  {
    question: 'What specific university documents does the Royal Thai Embassy in Dhaka require for an ED visa?',
    answer:
      'In addition to your standard Admission Offer Letter, the Royal Thai Embassy in Dhaka requires an official Visa Request Letter signed by an authorized dean or registrar of the Thai university and addressed specifically to the Ambassador / Consular Section of the Royal Thai Embassy in Dhaka. For private universities, you must also attach copies of the institution’s MHESI license, the authorized signatory’s specimen signature letter, and your official tuition fee receipt.',
  },
  {
    question: 'How much bank balance is required for a Thailand Non-Immigrant ED visa in Dhaka?',
    answer:
      'For self-funded degree applicants, the Royal Thai Embassy in Dhaka requires an official Bank Solvency Certificate and 6 months of certified bank statements from a recognized Bangladeshi commercial bank showing a steady closing balance of at least 5.0 Lakh to 8.0 Lakh BDT (~THB 150,000 to THB 220,000 or USD 4,000–6,500). The account must be held by the student or biological parents (backed by a notarized Sponsorship Letter, Family Relation proof, and sponsor TIN/tax returns or trade license). Full scholarship awardees (such as Chulalongkorn Non-ASEAN or AIT Fellowship winners) submit their official fellowship award letter.',
  },
  {
    question: 'What are the mandatory post-arrival TM.30, TM.47 (90-Day Report), and TM.8 Re-Entry rules in Thailand?',
    answer:
      'Thai immigration enforces three strict compliance rules after you land in Bangkok: (1) TM.30 Landlord Notification: within 24 hours of moving into your dormitory or condo, your landlord must register your address with Thai Immigration; (2) TM.47 90-Day Reporting: every 90 consecutive days you remain in Thailand, you must report your current residential address (free of charge, online or in person); and (3) TM.8 Re-Entry Permit: before flying home to Bangladesh for semester holidays, you MUST obtain a Single (THB 1,000) or Multiple (THB 3,800) Re-Entry Permit — leaving Thailand without a Re-Entry Permit automatically cancels your 1-year Non-ED study extension!',
  },
  {
    question: 'Can Bangladeshi students work off-campus on a Thailand Non-Immigrant ED student visa?',
    answer:
      'No. Under Thai labour and immigration law, holders of a Non-Immigrant ED student visa are strictly prohibited from taking off-campus commercial, restaurant, or retail employment without a separate Ministry of Labour work permit. However, postgraduate and top undergraduate students can legally earn stipends through on-campus Research Assistantships (RA), Teaching Assistantships (TA), lab fellowships (paying THB 6,000–16,000/month), and curriculum-mandated credit internships arranged by their faculty.',
  },
  {
    question: 'What is EduExpress’s service charge for Thailand admission and Non-Immigrant ED visa processing?',
    answer:
      'EduExpress charges BDT 0 for file opening. You pay zero upfront consultancy fees during university selection, scholarship/fellowship application, or Royal Thai Embassy Dhaka e-Visa preparation. Under our written service terms, our BDT 100,000 consultancy package is payable 100% after your Thai Non-Immigrant ED Visa is approved, while third-party costs (tuition payment via Student File, MoFA attestation, and official visa/immigration fees) are paid directly by the student.',
  },
];

export default async function ThailandStudentVisaPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { in: ['Thailand', 'thailand'] }, isActive: true },
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
        name: 'Thailand Student Visa from Bangladesh 2027: Non-Immigrant ED Visa & Dhaka Embassy Guide',
        description:
          'Thailand Non-Immigrant ED student visa guide for Bangladeshi students: Royal Thai Embassy Dhaka e-Visa process, 5L–8L BDT solvency, MHESI, and TM.47.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/thailand.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(THAILAND_VISA_SOURCES),
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
          { name: 'Thailand', path: '/study-in-thailand-from-bangladesh' },
          { name: 'Student Visa' },
        ]}
        eyebrow="Non-Immigrant Category ED Visa · Royal Thai Embassy Dhaka · BDT 0 Upfront File Fee"
        title="Thailand Student Visa from Bangladesh 2027."
        lead="A complete consular and financial guide for Bangladeshi students applying for the Thai Non-Immigrant Category 'ED' Student Visa in Dhaka: securing your university Visa Request Letter, structuring 5.0–8.0 Lakh BDT bank solvency, MoFA document attestation, and post-arrival TM.7 1-year extension & TM.47 90-day reporting."
        actions={
          <>
            <Link href="/apply?country=Thailand" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start Free Thailand Visa Assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/thailand-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Thailand Tuition &amp; Living Costs
            </Link>
          </>
        }
      />

      <TrustBar destination="Thailand" />

      {/* Key Statutory Visa Metrics */}
      <section aria-label="Thailand visa statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 THB (฿) ≈ 3.7 BDT</strong> · <strong>1 USD ≈ 122 BDT</strong>.
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
              <p className="mt-2 text-base font-bold text-petrol-800">Non-Immigrant &ldquo;ED&rdquo;</p>
              <p className="mt-1 text-xs text-slate-600">90-day initial entry extended annually via Form TM.7 (THB 1,900).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Building2 size={16} className="text-emerald-700" /> Dhaka Mission
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Royal Thai Embassy</p>
              <p className="mt-1 text-xs text-slate-600">Processed in Dhaka / thaievisa.go.th with fast regional turnaround.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Wallet size={16} className="text-emerald-700" /> Dhaka Bank Solvency
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">5.0L – 8.0L BDT</p>
              <p className="mt-1 text-xs text-slate-600">~THB 150k–220k 6-month bank statement + paid semester tuition receipt.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Clock size={16} className="text-emerald-700" /> Post-Arrival Rules
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">TM.30 · TM.47 · TM.8</p>
              <p className="mt-1 text-xs text-slate-600">24-hr address registration, 90-day reporting &amp; mandatory Re-Entry Permit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 6-Stage Thailand Non-Immigrant ED Visa Process */}
      <Section
        id="visa-process"
        tone="white"
        title="6-stage Thailand Non-Immigrant ED student visa process in Dhaka."
        intro="With a resident embassy in Dhaka and short 3.5-hour direct flights to Bangkok, Thailand offers one of the most predictable visa timelines for Bangladeshi students."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'MHESI University Admission & Fellowship Check',
              timeline: '8–12 Weeks Before Intake',
              body: 'Receive your admission offer from an MHESI-accredited Thai university (Chulalongkorn, Mahidol, Thammasat SIIT, AIT, Assumption, or KMITL) and confirm any EFS/AIT/Chula scholarship.',
            },
            {
              step: 'Stage 02',
              title: 'Student File Tuition Wire (SWIFT MT103)',
              timeline: '6–8 Weeks Before Intake',
              body: 'Open a Student File at an Authorized Dealer bank in Bangladesh and remit your 1st-semester tuition fee in THB or USD directly to the Thai university’s institutional account.',
            },
            {
              step: 'Stage 03',
              title: 'University Visa Request Letter to Dhaka Embassy',
              timeline: '4–6 Weeks Before Intake',
              body: 'The Thai university issues its official Visa Request Letter addressed to the Royal Thai Embassy in Dhaka alongside its MHESI registration and authorized signatory specimen documents.',
            },
            {
              step: 'Stage 04',
              title: 'MoFA Attestation, Police Clearance & 6-Mo Bank File',
              timeline: '3–5 Weeks Before Intake',
              body: 'Attest your academic certificates and Police Clearance via MoFA Dhaka. Prepare your 6-month bank statement (5.0L–8.0L BDT), Bank Solvency Certificate, and notarized Parent Sponsorship Letter.',
            },
            {
              step: 'Stage 05',
              title: 'Royal Thai Embassy Dhaka / e-Visa Submission',
              timeline: '2–4 Weeks Before Intake',
              body: 'Submit your Non-Immigrant ED application via the Royal Thai Embassy Dhaka / thaievisa.go.th portal with confirmed flight itinerary and accommodation booking.',
            },
            {
              step: 'Stage 06',
              title: 'Bangkok Arrival, TM.30 & 1-Year TM.7 Extension',
              timeline: 'Within 90 Days of Landing',
              body: 'Arrive at Suvarnabhumi Airport (BKK) on your 90-day Non-ED visa, complete TM.30 housing notification within 24 hours, and extend your stay to 1 full year (Form TM.7, THB 1,900) at Chaengwattana Immigration.',
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

      {/* Module 2: Thai Immigration Compliance & Refusal Prevention */}
      <Section
        id="compliance"
        tone="sage"
        title="Thai Immigration compliance &amp; Non-ED visa refusal prevention."
        intro="Understand the rules that keep your Non-Immigrant ED visa valid throughout your degree in Bangkok or Pathum Thani."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">Royal Thai Embassy Dhaka Document Checklist</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Addressed Visa Request Letter:</strong> Verify that your university’s Visa Request Letter explicitly names the Royal Thai Embassy in Dhaka and matches your passport number and exact program title.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Sponsor Bank Verification Letter:</strong> Include a bank manager contact email and phone number on your Solvency Certificate so the Embassy in Dhaka can verify the 5–8 Lakh BDT balance without delay.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Mandatory TM.8 Re-Entry Permit Rule:</strong> Whenever you fly back to Dhaka for Eid or semester holidays, always stamp a TM.8 Re-Entry Permit at Thai Immigration (or Suvarnabhumi Airport) before passing departure control.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical Thailand Visa &amp; Work Warnings</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Off-Campus Commercial Work Prohibition:</strong> Never work illegally in off-campus restaurants or shops on a Non-ED student visa; only on-campus university RA/TA fellowships and credit internships are legal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Avoid Short-Term Language School Visa Traps:</strong> The Royal Thai Embassy closely scrutinizes non-university language courses; always apply through MHESI-accredited degree-granting universities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>90-Day Reporting (TM.47) Fine:</strong> Missing your 90-day address report deadline at Thai Immigration incurs a statutory fine of THB 2,000 (up to THB 5,000) and complicates annual visa renewal.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Thai Universities */}
      {universities.length > 0 && (
        <Section
          id="thailand-universities"
          tone="white"
          title="Verified Thai universities in the EduExpress directory."
          intro="Compare MHESI-accredited public and international universities in Bangkok and Pathum Thani."
          action={
            <Link href="/universities?country=thailand" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Thailand universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Bangkok, Thailand'}</span>
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
              We charge BDT 0 upfront to open your Thailand file. Every third-party cost (university application fee, Student File tuition transfer, MoFA attestation, and Royal Thai Embassy visa fee) is itemized in writing on your <strong>ClearCost Sheet</strong> before you proceed.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-thailand-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Thailand Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/thailand-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Thailand Tuition &amp; Living Cost Breakdown
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
        items={THAILAND_VISA_FAQS}
        title="Frequently asked questions about the Thailand Non-Immigrant ED visa."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Thai diplomatic &amp; immigration sources.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THAILAND_VISA_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Royal Thai Embassy Dhaka Non-Immigrant ED rules, Thai Immigration Bureau TM.7/TM.47 regulations, and MHESI accreditation standards on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and visa-application guidance under written service terms. Final admission, fellowship award, and Non-Immigrant ED visa or stay extension decisions rest solely with the respective Thai universities, the Royal Thai Embassy in Dhaka, and the Immigration Bureau of Thailand.
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">AIT, Chula, Mahidol &amp; ED Visa Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Thailand University &amp; Non-ED Visa Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your academic results, IELTS status, and target program. Our Dhanmondi team will evaluate your Thai university fellowship options and Dhaka Embassy visa checklist within one working day.
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

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
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
const PATH = '/hungary-scholarships-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const HUNGARY_SCHOLARSHIP_SOURCES = [
  {
    label: 'Tempus Public Foundation — Stipendium Hungaricum Official Application & Operational Regulations',
    href: 'https://stipendiumhungaricum.hu/',
    note: 'Statutory Hungarian government body administering the Stipendium Hungaricum scholarship, DreamApply portal submissions, Letter of Award issuance, and 36-credit annual renewal rules.',
  },
  {
    label: 'Secondary and Higher Education Division (SHED), Ministry of Education, Bangladesh',
    href: 'https://shed.gov.bd/',
    note: 'Official Sending Partner authority in Dhaka responsible for shortlisting and nominating Bangladeshi applicants (shed.portal.gov.bd) under the Hungary–Bangladesh bilateral educational quota.',
  },
  {
    label: 'Study in Hungary — Institutional & Bilateral Scholarship Directory',
    href: 'https://studyinhungary.hu/',
    note: 'Official Hungarian higher education portal listing state-funded and partial university merit awards at Debrecen, Szeged, Pécs, BME, ELTE, and Corvinus.',
  },
  {
    label: 'Hungarian Diaspora & Bilateral State Scholarships Framework (Ministry of Foreign Affairs and Trade)',
    href: 'https://kormany.hu/kulgazdasagi-es-kulugyminiszterium',
    note: 'Hungarian Ministry overseeing international bilateral scholarship quotas, TAJ national health card benefits, and student visa fee exemptions.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Hungary Scholarships from Bangladesh 2027 | Stipendium Guide',
    description:
      'Stipendium Hungaricum & Hungarian university scholarships for Bangladeshi students: SHED MoE nomination, 100% tuition waiver, HUF stipends, and steps.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('hungary', 'Hungary Scholarships for Bangladeshi Students — EduExpress International'),
  });
}

const HUNGARY_SCHOLARSHIP_FAQS = [
  {
    question: 'Why must Bangladeshi Stipendium Hungaricum applicants apply on TWO separate portals?',
    answer:
      'Because Stipendium Hungaricum is a bilateral government-to-government scholarship, Bangladeshi applicants must submit their application on two independent portals by the mid-January deadline: (1) the Tempus Public Foundation international portal (apply.stipendiumhungaricum.hu) AND (2) the Bangladesh Ministry of Education Secondary and Higher Education Division (SHED) online scholarship portal. If you apply only on the Hungarian DreamApply portal without submitting to the Bangladesh Ministry of Education (SHED), you cannot be included on the official Bangladeshi Sending Partner nomination list, and your application is automatically disqualified.',
  },
  {
    question: 'What does the Stipendium Hungaricum scholarship actually cover for Bangladeshi students?',
    answer:
      'Stipendium Hungaricum covers: (1) 100% tuition fee exemption for the entire degree duration; (2) a free dormitory place at the host university or a HUF 40,000/month (~13,200 BDT) housing contribution toward private rent; (3) full health care coverage via the Hungarian National Health Insurance Card (TAJ card) plus supplementary private medical insurance up to HUF 65,000/year; and (4) a monthly living stipend of HUF 43,700/month (~14,400 BDT) for Bachelor’s and Master’s students, or HUF 140,000/month in the first 4 semesters and HUF 180,000/month in the second 4 semesters (~46,200–59,400 BDT) for PhD students.',
  },
  {
    question: 'Is the Stipendium Hungaricum monthly stipend enough to cover all living costs in Hungary?',
    answer:
      'For Bachelor’s and Master’s students, the HUF 43,700/month stipend plus the HUF 40,000/month housing grant covers dormitory housing and basic student utilities, but does NOT cover full monthly food and personal expenses in cities like Budapest (where total living costs average EUR 450–700/month). Tempus Public Foundation explicitly states that the stipend is a contribution toward living costs, and students should supplement it with family savings or legal part-time student work (up to 24 hours/week via Hungarian Diákmunka student cooperatives). For PhD scholars, the higher HUF 140,000–180,000 stipend plus free dormitory covers most regional living costs.',
  },
  {
    question: 'What are the academic renewal requirements to keep Stipendium Hungaricum every year?',
    answer:
      'Under the Stipendium Hungaricum Operational Regulations, scholarship holders must earn a minimum of 36 ECTS credits across every two consecutive active semesters (an average of 18 ECTS per semester where a full semester workload is 30 ECTS). Failing to accumulate 36 ECTS credits within the academic year results in mandatory termination of scholarship status, requiring the student to either switch to self-funded tuition payment or withdraw.',
  },
  {
    question: 'What alternative scholarships or tuition discounts exist if I am not nominated by SHED for Stipendium Hungaricum?',
    answer:
      'Since Bangladesh receives roughly 100 to 140 Stipendium Hungaricum quota seats annually against thousands of applicants, self-funded admission with partial university merit waivers is the primary backup route. Universities such as the University of Debrecen (UD International Scholarship offering 20%–30% tuition reduction from Year 2), University of Pécs, University of Szeged, and Corvinus University offer merit discounts and Erasmus+/Pannonia semester exchange grants while keeping annual self-funded STEM and business tuition affordable at EUR 3,000 to EUR 6,500/year.',
  },
  {
    question: 'Can any consultancy guarantee a Stipendium Hungaricum nomination from Bangladesh?',
    answer:
      'No. Nomination is decided exclusively by the Secondary and Higher Education Division (SHED) of the Bangladesh Ministry of Education based on academic merit rules, and final award decisions rest with the Hungarian host universities and Tempus Public Foundation. EduExpress never sells or guarantees government scholarships; we help students prepare compliant dual-portal applications alongside realistic self-funded backup admissions with BDT 0 file-opening fees.',
  },
];

export default async function HungaryScholarshipsPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Hungary', isActive: true },
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
        name: 'Hungary Scholarships for Bangladeshi Students 2027: Stipendium Hungaricum & University Awards',
        description:
          'Stipendium Hungaricum & Hungarian university scholarships for Bangladeshi students: SHED MoE nomination, 100% tuition waiver, HUF stipends, and steps.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/hungary.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(HUNGARY_SCHOLARSHIP_SOURCES),
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
          { name: 'Hungary', path: '/study-in-hungary-from-bangladesh' },
          { name: 'Scholarships' },
        ]}
        eyebrow="Stipendium Hungaricum Bilateral Quota · SHED MoE Nomination · University Merit Awards"
        title="Hungary Scholarships for Bangladeshi Students 2027."
        lead="An evidence-first breakdown of Hungarian higher education funding for Bangladeshi students: navigating the dual-portal Stipendium Hungaricum application (Tempus Public Foundation + Bangladesh Ministry of Education SHED), exact HUF stipend coverage, 36-ECTS renewal rules, and self-funded university merit alternatives."
        actions={
          <>
            <Link href="/apply?country=Hungary" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Hungary Scholarship Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/hungary-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Hungary Study Costs
            </Link>
            <Link href="/hungary-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Hungary Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar destination="Hungary" />

      {/* Key Statutory Scholarship Metrics */}
      <section aria-label="Hungary scholarship statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 130 BDT</strong> · <strong>1,000 HUF ≈ 330 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> Evidence-First Funding · No Scholarship Sales Myths
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Award size={16} className="text-emerald-700" /> Primary Bilateral Award
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Stipendium Hungaricum</p>
              <p className="mt-1 text-xs text-slate-600">100% tuition waiver + dorm/housing grant + TAJ health card + stipend.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Sending Partner (BD)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">SHED · Ministry of Ed.</p>
              <p className="mt-1 text-xs text-slate-600">Mandatory dual submission on apply.stipendiumhungaricum.hu &amp; shed.gov.bd.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Calendar size={16} className="text-emerald-700" /> Annual Application Window
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Nov 15 – Jan 15</p>
              <p className="mt-1 text-xs text-slate-600">Fixed annual window for September intake across Bachelor, Master &amp; PhD.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> Renewal Rule
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">36 ECTS / Academic Year</p>
              <p className="mt-1 text-xs text-slate-600">Must complete at least 36 ECTS credits across every two active semesters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: Exact Stipendium Hungaricum Coverage Matrix */}
      <Section
        id="stipendium-coverage"
        tone="white"
        title="What Stipendium Hungaricum covers — and what your family still pays."
        intro="Before applying, compare the exact statutory HUF entitlements against real monthly student expenses in Budapest and regional university cities."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Stipendium Hungaricum coverage vs remaining student expenses</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Study Level / Benefit</th>
                <th className="px-6 py-4 font-bold">Tuition &amp; Medical</th>
                <th className="px-6 py-4 font-bold">Monthly Living Stipend</th>
                <th className="px-6 py-4 font-bold">Accommodation Benefit</th>
                <th className="px-6 py-4 font-bold">Remaining Family Outlay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Bachelor’s (BA / BSc)</td>
                <td className="px-6 py-4">100% Free + TAJ Card</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">HUF 43,700 / mo (~14,400 BDT)</td>
                <td className="px-6 py-4">Free Dorm Bed or HUF 40,000/mo</td>
                <td className="px-6 py-4">Flights + ~€200–€350/mo food &amp; rent gap</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">Master’s (MA / MSc) &amp; One-Tier</td>
                <td className="px-6 py-4">100% Free + TAJ Card</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">HUF 43,700 / mo (~14,400 BDT)</td>
                <td className="px-6 py-4">Free Dorm Bed or HUF 40,000/mo</td>
                <td className="px-6 py-4">Flights + ~€200–€350/mo food &amp; rent gap</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Doctoral (PhD — Semesters 1–4)</td>
                <td className="px-6 py-4">100% Free + TAJ Card</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">HUF 140,000 / mo (~46,200 BDT)</td>
                <td className="px-6 py-4">Free Dorm Bed or HUF 40,000/mo</td>
                <td className="px-6 py-4">Flights + minimal personal top-up in regional cities</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">Doctoral (PhD — Semesters 5–8)</td>
                <td className="px-6 py-4">100% Free + TAJ Card</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">HUF 180,000 / mo (~59,400 BDT)</td>
                <td className="px-6 py-4">Free Dorm Bed or HUF 40,000/mo</td>
                <td className="px-6 py-4">Largely self-sustaining with research &amp; dorm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: 6-Stage Dual-Portal Application Timeline */}
      <Section
        id="application-steps"
        tone="sage"
        title="6-stage Stipendium Hungaricum &amp; SHED application timeline from Bangladesh."
        intro="Missing the Bangladesh Ministry of Education (SHED) portal submission is the #1 reason high-scoring Bangladeshi applicants are disqualified."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'Select 2 Programs & Prepare Research/Motivation',
              timeline: 'October – Mid-November',
              body: 'Choose up to two prioritized degree programs on apply.stipendiumhungaricum.hu. Draft a program-specific Motivation Letter (and Research Plan + Supervisor Acceptance for PhD).',
            },
            {
              step: 'Stage 02',
              title: 'Dual-Portal Submission (DreamApply + SHED BD)',
              timeline: 'Nov 15 – Jan 15 (Strict Deadline)',
              body: 'Submit your online file on the Hungarian DreamApply portal AND submit the official Bangladeshi Sending Partner application on the SHED Ministry of Education portal (shed.gov.bd).',
            },
            {
              step: 'Stage 03',
              title: 'SHED Bangladesh Nomination Shortlist',
              timeline: 'February',
              body: 'The Bangladesh Ministry of Education reviews academic transcripts, IELTS scores, and age limits, forwarding the official Primary and Reserve Nomination List to Tempus Public Foundation.',
            },
            {
              step: 'Stage 04',
              title: 'Hungarian University Entrance Exams',
              timeline: 'March – May',
              body: 'Nominated candidates sit written online tests (Mathematics, Physics, Biology, or Engineering) and live Skype/Zoom faculty oral interviews with their 1st- and 2nd-choice Hungarian universities.',
            },
            {
              step: 'Stage 05',
              title: 'Mandatory Medical Certificate & TPF Award',
              timeline: 'April – June',
              body: 'Upload the mandatory Medical Certificate (covering HIV, Hepatitis A/B/C, chest X-ray, and vaccinations). Tempus Public Foundation announces final scholarship awards in mid-to-late June.',
            },
            {
              step: 'Stage 06',
              title: 'Letter of Award & Type D Free Visa Filing',
              timeline: 'July – August (Sept Arrival)',
              body: 'Download your official Letter of Award and Letter of Acceptance, apply for your fee-exempt Type D study residence permit, and arrive in Hungary for September orientation.',
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-xs">
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

      {/* Module 3: Self-Funded University Merit & Backup Strategy */}
      <Section
        id="alternative-scholarships"
        tone="white"
        title="University merit scholarships &amp; self-funded backup strategy."
        intro="Because bilateral government quota seats are fiercely competitive, smart applicants pair their Stipendium application with an affordable self-funded or partial-scholarship Hungarian admission."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">Institutional Merit &amp; Exchange Grants</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>University of Debrecen International Scholarship:</strong> Offers 20% to 30% tuition reduction for high-GPA international students from the second year of undergraduate or graduate study.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Pannonia &amp; Erasmus+ Mobility Grants:</strong> Self-funded students enrolled at Hungarian state universities can apply for funded 1-to-2 semester study or internship exchanges across European partner institutions (EUR 600–850/month grant).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Affordable Base Tuition + 24 Hr/Wk Work:</strong> Even without a scholarship, self-funded STEM and business degrees at Pécs, Szeged, and Debrecen cost EUR 3,000–5,500/year (~3.9L–7.15L BDT), while Diákmunka student jobs generate EUR 360–520/month toward living expenses.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Eligibility &amp; Disqualification Rules to Know</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Minimum Age Requirement:</strong> Applicants for Stipendium Hungaricum must turn at least 18 years old by 31 August of the intake year (except for dance study programs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>IELTS vs MOI Reality in SHED:</strong> While some Hungarian universities accept English Medium of Instruction (MOI) for self-funded admission, SHED shortlisting in Dhaka heavily prioritizes candidates holding a valid IELTS (6.0–6.5+) or TOEFL score.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Medicine &amp; Dentistry Quota Check:</strong> Always check the current year’s SHED Bangladesh bilateral circular before selecting One-Tier Master’s in General Medicine (MD) or Dentistry, as sending partner subject quotas can exclude clinical medicine in certain cycles.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified Hungarian Universities */}
      {universities.length > 0 && (
        <Section
          id="hungary-universities"
          tone="sage"
          title="Verified Hungarian universities in the EduExpress directory."
          intro="Explore Stipendium Hungaricum host institutions and affordable self-funded public universities in Hungary."
          action={
            <Link href="/universities?country=hungary" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Hungary universities <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-5 transition hover:border-petrol-800 hover:shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Hungary'}</span>
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

      {/* Module 5: Written Service Terms Banner */}
      <section className="bg-petrol-800 py-14 text-white">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-4xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Evidence-First Scholarship Policy</span>
            <h2 className="mt-1 font-display text-2xl font-black sm:text-4xl text-white">
              BDT 0 File-Opening Charge · Compare Stipendium &amp; Self-Funded Options
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We assess scholarships after education fit. Receive a written <strong>EduFit Decision Report</strong> comparing your Stipendium Hungaricum chances against affordable self-funded Hungarian and Chinese university alternatives with BDT 0 upfront file fees.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-hungary-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Hungary Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/hungary-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Hungary Cost Breakdown
              </Link>
              <Link href="/hungary-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Hungary Student Visa Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQs */}
      <FaqBlock
        items={HUNGARY_SCHOLARSHIP_FAQS}
        title="Frequently asked questions about Hungary scholarships."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official scholarship authorities &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {HUNGARY_SCHOLARSHIP_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Tempus Public Foundation Operational Regulations and Bangladesh Ministry of Education (SHED) nomination circulars on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and scholarship-application guidance under written service terms. Final nomination, admission, scholarship award, and visa issuance decisions rest solely with the Bangladesh Ministry of Education (SHED), Tempus Public Foundation, Hungarian universities, and official embassy authorities.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Stipendium &amp; University Merit Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Hungary Scholarship &amp; Admission Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your GPA, IELTS score, and preferred degree level. Our Dhanmondi team will evaluate your Stipendium Hungaricum profile and self-funded backup options within one working day.
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

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
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
const PATH = '/uk-scholarships-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const UK_SCHOLARSHIP_SOURCES = [
  {
    label: 'Chevening Scholarships (UK Foreign, Commonwealth & Development Office — Bangladesh)',
    href: 'https://www.chevening.org/scholarship/bangladesh/',
    note: 'UK government flagship fully funded 1-year Master’s scholarship covering 100% tuition, monthly stipend, return flights from Dhaka, and visa fees (requires 2,800 hours work experience).',
  },
  {
    label: 'Commonwealth Scholarship Commission in the UK (CSC UK) & UGC Bangladesh',
    href: 'https://cscuk.fcdo.gov.uk/',
    note: 'Statutory UK international development scholarships for Master’s and PhD scholars from Commonwealth nations, nominated via the University Grants Commission of Bangladesh (ugc.gov.bd) or Shared University Track.',
  },
  {
    label: 'British Council Bangladesh — GREAT Scholarships (£10,000 Master’s Tuition Awards)',
    href: 'https://www.britishcouncil.org.bd/en/study-uk/scholarships',
    note: 'Jointly funded by the UK Government GREAT Britain Campaign and British Council offering minimum £10,000 tuition awards to Bangladeshi postgraduate students.',
  },
  {
    label: 'UK Visas and Immigration (UKVI) — How Official Scholarships Reduce 28-Day CAS Funds',
    href: 'https://www.gov.uk/student-visa/money',
    note: 'Statutory UKVI rule confirming that any scholarship discount recorded directly on your CAS statement is deducted pound-for-pound from your required 28-day bank balance.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'UK Scholarships for Bangladeshi Students 2027 | EduExpress',
    description:
      'UK scholarships for Bangladeshi students 2027: Chevening, Commonwealth, GREAT £10,000 awards, and £2,000–£8,000 automatic university tuition discounts.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('uk', 'UK Scholarships for Bangladeshi Students — EduExpress International'),
  });
}

const UK_SCHOLARSHIP_FAQS = [
  {
    question: 'What are the realistic UK scholarship options for Bangladeshi students in 2027?',
    answer:
      'UK funding for Bangladeshi students falls into four realistic tiers: (1) Fully Funded UK Government Awards for 1-year Master’s and PhD (Chevening Scholarships and Commonwealth Master’s/Shared/PhD Scholarships, which cover 100% tuition, flights, visa, and monthly living stipends); (2) British Council GREAT Scholarships for Bangladesh, which provide a £10,000 (~15.5 Lakh BDT) tuition reduction at partner UK universities; (3) Automatic Vice-Chancellor & International Merit Bursaries (£2,000 to £8,000 per year, or ~3.1 to 12.4 Lakh BDT) granted automatically with your offer letter based on your HSC or Bachelor CGPA; and (4) Funded PhD Doctoral Studentships covering tuition plus a tax-free UKRI stipend (~£19,237+/year).',
  },
  {
    question: 'How does a UK university scholarship reduce my 28-day UKVI bank balance requirement?',
    answer:
      'Under UK Visas and Immigration (UKVI) rules, when a UK university awards you an automatic merit bursary or GREAT scholarship (for example, £4,000 off an £18,000 annual tuition fee) and records the net fee (£14,000) directly on your Confirmation of Acceptance for Studies (CAS), your required 28-day bank statement balance drops pound-for-pound by £4,000 (~6.2 Lakh BDT). Combined with your paid CAS deposit, this significantly lowers the liquid funds your family must hold in Bangladesh.',
  },
  {
    question: 'What is the difference between Chevening and Commonwealth Scholarships for Bangladeshi applicants?',
    answer:
      'Both are fully funded UK government awards (FCDO), but their eligibility criteria differ: Chevening is strictly for 1-year taught Master’s degrees and requires at least 2 years (2,800 hours) of work experience after graduation, leadership potential, and applications to 3 eligible UK courses between August and November. Commonwealth Scholarships cover both Master’s and PhD degrees, focus on development impact and academic merit, do not strictly mandate 2,800 hours of work experience, and are applied for either via the University Grants Commission of Bangladesh (UGC Dhaka national nomination track) or directly through UK universities under the Commonwealth Shared Scholarship scheme.',
  },
  {
    question: 'Do I need a separate application for £2,000–£6,000 UK university merit scholarships?',
    answer:
      'In most cases, no. The majority of career-focused and modern UK universities assess Bangladeshi applicants automatically for Regional South Asia / International Merit Bursaries (£2,000 to £5,000) at the time of admission based on your HSC GPA (4.00–5.00) or Bachelor CGPA (2.80–3.50+). Additionally, many universities offer an extra £500 to £1,500 Early-Bird or Full-Payment discount if you pass your Pre-CAS interview and wire your CAS deposit via a Bangladesh Bank Student File ahead of the early deadline.',
  },
  {
    question: 'Are full 100% undergraduate (Bachelor’s) scholarships common in the UK for Bangladeshi students?',
    answer:
      'Full 100% tuition-plus-living scholarships at the undergraduate (Bachelor’s) level are extremely rare in the UK because Chevening, Commonwealth, and GREAT awards are restricted to postgraduate (Master’s and PhD) study. Most undergraduate awards in the UK are partial tuition discounts of £2,000 to £6,000 per year. Bangladeshi HSC students seeking 100% tuition-free undergraduate scholarships with free dormitory accommodation should compare our China CSC / University Scholarship or Hungary Stipendium Hungaricum pathways.',
  },
  {
    question: 'What is EduExpress’s service charge for UK scholarship and university admission guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge and BDT 0 consultancy service fee for the UK. We never charge agency fees to assess your UK scholarship eligibility, apply for automatic university merit bursaries, review your CAS financial plan, or guide your VFS visa application.',
  },
];

export default async function UkScholarshipsPage() {
  let ukUnis: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    ukUnis = await prisma.university.findMany({
      where: {
        country: { in: ['UK', 'United Kingdom', 'uk'] },
        isActive: true,
      },
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
    ukUnis = [];
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
        name: 'UK Scholarships for Bangladeshi Students 2027: Chevening, Commonwealth, GREAT & Merit Bursaries',
        description:
          'UK scholarships for Bangladeshi students 2027: Chevening, Commonwealth, GREAT £10,000 awards, and £2,000–£8,000 automatic university tuition discounts.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/uk.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(UK_SCHOLARSHIP_SOURCES),
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
          { name: 'United Kingdom', path: '/study-in-uk-from-bangladesh' },
          { name: 'Scholarships' },
        ]}
        eyebrow="Chevening & Commonwealth · GREAT £10,000 Awards · £2,000–£8,000 Automatic Merit Bursaries"
        title="UK Scholarships for Bangladeshi Students 2027."
        lead="An evidence-first breakdown of UK higher education scholarships for Bangladeshi students: comparing fully funded UK government awards (Chevening and Commonwealth via UGC Dhaka), British Council GREAT £10,000 awards, and automatic £2,000–£8,000 university tuition discounts that directly lower your 28-day UKVI bank balance."
        actions={
          <>
            <Link href="/apply?country=UK" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My UK Scholarship Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/uk-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare UK Tuition &amp; Costs
            </Link>
            <Link href="/uk-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              UK Student Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar destination="UK" />

      {/* Key Statutory Scholarship Metrics */}
      <section aria-label="UK scholarship statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 GBP (£) ≈ 155 BDT</strong> (scholarships recorded on CAS directly reduce your 28-day UKVI bank requirement).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Written ClearCost Deduction
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Award size={16} className="text-emerald-700" /> UK Government Full
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Chevening &amp; CSC UK</p>
              <p className="mt-1 text-xs text-slate-600">100% tuition + monthly stipend + return flights + IHS &amp; visa fee.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> British Council BD
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">GREAT (£10,000)</p>
              <p className="mt-1 text-xs text-slate-600">£10,000 (~15.5L BDT) Master’s tuition award for Bangladesh passport holders.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> Automatic University
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">£2,000 – £8,000 / Yr</p>
              <p className="mt-1 text-xs text-slate-600">Granted with offer letter on HSC/Bachelor GPA; deducted on CAS.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Calendar size={16} className="text-emerald-700" /> Intakes Covered
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Sept &amp; Jan Intakes</p>
              <p className="mt-1 text-xs text-slate-600">Full government awards for Sept; automatic university bursaries for Sept &amp; Jan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 4 UK Scholarship Tiers Compared */}
      <Section
        id="scholarship-tiers"
        tone="white"
        title="Four UK scholarship tiers for Bangladeshi students compared."
        intro="Compare exact financial coverage, eligibility thresholds, application deadlines, and what your family still needs to pay across all four UK funding categories."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[740px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Comparison of UK scholarship categories for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Scholarship Category</th>
                <th className="px-5 py-4 font-bold">Study Level</th>
                <th className="px-5 py-4 font-bold">Award Value (GBP / BDT)</th>
                <th className="px-5 py-4 font-bold">Core Eligibility &amp; Window</th>
                <th className="px-5 py-4 font-bold">Remaining Family Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">Chevening Scholarship (FCDO)</td>
                <td className="px-5 py-4">1-Year Taught Master’s</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition + ~£1,378–£1,690/mo + Flights</td>
                <td className="px-5 py-4">Bachelor + 2,800 hrs work exp; Aug–Nov window</td>
                <td className="px-5 py-4">£0 (2-yr mandatory return to BD after degree)</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">Commonwealth (UGC BD &amp; Shared)</td>
                <td className="px-5 py-4">1-Yr Master’s &amp; 3-Yr PhD</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition + Monthly Stipend + Airfare</td>
                <td className="px-5 py-4">CGPA 3.50+ recommended; Sept–Dec (UGC/Uni)</td>
                <td className="px-5 py-4">£0 (Official government sponsor letter waives 28-day bank rule)</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">British Council GREAT Bangladesh</td>
                <td className="px-5 py-4">1-Year Taught Master’s</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">£10,000 Tuition Fee Reduction (~15.5L BDT)</td>
                <td className="px-5 py-4">Unconditional offer at partner uni; Mar–May deadline</td>
                <td className="px-5 py-4">Remaining tuition (~£6k–£12k) + 9-mo UKVI maintenance</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">Automatic University Merit Bursary</td>
                <td className="px-5 py-4">Bachelor’s &amp; Master’s</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">£2,000 – £8,000 / year (~3.1L–12.4L BDT)</td>
                <td className="px-5 py-4">Automatic with offer (Sept &amp; Jan intakes)</td>
                <td className="px-5 py-4">Net tuition + £13,347 (London) / £10,224 (Outside) maintenance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: How Scholarships Lower Your 28-Day UKVI Bank Requirement */}
      <Section
        id="cas-financial-impact"
        tone="sage"
        title="How automatic UK scholarships reduce your 28-day visa bank balance."
        intro="For self-funded Bangladeshi families, the biggest financial benefit of a UK university bursary is how it lowers your statutory 28-day UKVI bank maturity threshold."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: 'Step 01',
              title: 'Scholarship Recorded on Offer Letter',
              body: 'When you apply to an eligible UK university with HSC GPA 4.25+ or Bachelor CGPA 3.00+, the admissions office issues your Conditional Offer stating your gross tuition (e.g., £17,500) and your automatic South Asia Merit Scholarship (e.g., £4,500).',
            },
            {
              step: 'Step 02',
              title: 'CAS Deposit Deducted via Student File',
              body: 'After passing your Pre-CAS interview, you open a Bangladesh Bank Student File and wire the required CAS deposit (e.g., £4,000). Your remaining first-year tuition balance drops to £9,000 (£17,500 − £4,500 scholarship − £4,000 deposit).',
            },
            {
              step: 'Step 03',
              title: 'Lower 28-Day Bank Statement Lock',
              body: 'The university prints £9,000 net remaining tuition on your CAS statement. For an outside-London campus (+£10,224 maintenance), you only need to hold £19,224 (~29.8L BDT) for 28 days instead of £27,724 (~43.0L BDT).',
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

      {/* Module 3: Strategic Advice & Reality Check */}
      <Section
        id="scholarship-reality"
        tone="white"
        title="Realistic UK funding advice vs agency myths in Bangladesh."
        intro="Know where your profile stands before paying application fees or locking bank funds."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">How to Maximize Your UK Scholarship Award</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Apply 5–6 Months Before Intake for GREAT &amp; VC Awards:</strong> High-value £5,000–£10,000 Vice-Chancellor and GREAT scholarships require holding an unconditional offer by March–May for September intake.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Target Regional UK Campuses for Better Net ROI:</strong> Combining a £4,000–£6,000 automatic merit scholarship with an outside-London campus reduces both tuition and your 9-month UKVI maintenance requirement by over 11 Lakh BDT.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Compare With Full-Scholarship Countries if Budget Is Tight:</strong> If your family cannot comfortably fund £12,000–£16,000 net UK first-year costs, compare <Link href="/china-scholarships-bangladesh" className="font-bold text-petrol-800 underline">China CSC &amp; University Scholarships</Link> or <Link href="/hungary-scholarships-bangladesh" className="font-bold text-petrol-800 underline">Hungary Stipendium Hungaricum</Link>.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">3 UK Scholarship Myths to Avoid</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Myth 1 — "100% Free UK Bachelor’s Without IELTS":</strong> No legitimate UK university awards a 100% tuition-free undergraduate scholarship without IELTS. Ads claiming otherwise are bait-and-switch traps.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Myth 2 — "Pay Remaining UK Tuition From Part-Time Work":</strong> UK Student Visa holders are strictly capped at 20 hours/week during term-time. Part-time income (~£800–£950/mo) covers monthly food and shared rent outside London, not £14,000+ tuition invoices.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Myth 3 — "Unconditional Scholarship Means Automatic Visa":</strong> Even with a £6,000 university scholarship, UKVI will refuse your visa if your 28-day bank statement drops below the required balance for even a single day.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified UK Universities */}
      {ukUnis.length > 0 && (
        <Section
          id="uk-universities"
          tone="sage"
          title="Verified UK universities in the EduExpress directory."
          intro="Compare UK universities offering automatic international merit bursaries and GREAT scholarships."
          action={
            <Link href="/universities?country=uk" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all UK universities <ArrowRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ukUnis.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-5 transition hover:border-petrol-800 hover:shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'United Kingdom'}</span>
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
              BDT 0 File-Opening Charge · Written ClearCost Net Tuition Sheet
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We calculate your exact net UK tuition after automatic merit bursaries, your CAS deposit requirement, and your 28-day UKVI bank balance in writing on a 1-page <strong>ClearCost Sheet</strong> before you commit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-uk-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                UK Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/uk-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                UK Cost Breakdown
              </Link>
              <Link href="/uk-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                UK Student Visa Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQs */}
      <FaqBlock
        items={UK_SCHOLARSHIP_FAQS}
        title="Frequently asked questions about UK scholarships for Bangladeshi students."
        tone="white"
      />

      {/* Module 7: Official Sources & Disclaimer */}
      <Section id="sources" tone="sage" title="Official UK scholarship authorities &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {UK_SCHOLARSHIP_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Chevening FCDO, Commonwealth Scholarship Commission (CSC UK), British Council GREAT Bangladesh, and UKVI Student Route financial rules on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and scholarship-application guidance under written service terms. Final admission, scholarship or bursary award, CAS issuance, and visa decisions rest solely with the respective UK universities, scholarship commissions, and UKVI authorities.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Merit Bursary &amp; 28-Day CAS Calculator</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your UK Scholarship &amp; Net Tuition Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your HSC/Bachelor GPA, IELTS/MOI status, and target intake. Our Dhanmondi team will calculate your automatic UK university bursary and net 28-day bank requirement within one working day.
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

import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Landmark,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/finland-scholarships-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const FINLAND_SCHOLARSHIP_SOURCES = [
  {
    label: 'Study in Finland (Finnish National Agency for Education — EDUFI) — National Finland Scholarship',
    href: 'https://www.studyinfinland.fi/scholarships',
    note: 'Statutory national scholarship program funded by the Finnish Ministry of Education and Culture covering 100% of first-year Master’s tuition plus a EUR 5,000 relocation grant.',
  },
  {
    label: 'Studyinfo.fi (Opintopolku) — Joint Application & Institutional Tuition Waiver Rules',
    href: 'https://opintopolku.fi/konfo/en/',
    note: 'Official government admission portal administering Master’s Finland Scholarships, UAS Early-Bird discounts (10%–50%), and 55–60 ECTS credit-based renewal rules.',
  },
  {
    label: 'Finnish Immigration Service (Migri) — How Scholarships Affect the €9,600 Income Requirement',
    href: 'https://migri.fi/en/residence-permit-for-studies',
    note: 'Statutory Migri rule confirming that tuition waivers eliminate tuition proof while official living-cost grants (such as the €5,000 Finland Scholarship grant) reduce the €9,600 Year-1 bank requirement dollar-for-euro.',
  },
  {
    label: 'EDUFI Fellowship & Salaried Doctoral Researcher Positions in Finland',
    href: 'https://www.oph.fi/en/development/edufi-fellowship',
    note: 'Official framework for tuition-free Doctoral (PhD) study and salaried Doctoral Researcher contracts (€2,500–€3,200/month) at Finnish research universities.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Finland Scholarships from Bangladesh 2027 | Waivers & EDUFI',
    description:
      'Finland scholarships for Bangladeshi students 2027: Finland Scholarship (100% + €5,000), 20%–50% early-bird UAS waivers, and 55–60 ECTS renewal rules.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('finland', 'Finland Scholarships for Bangladeshi Students — EduExpress International'),
  });
}

const FINLAND_SCHOLARSHIP_FAQS = [
  {
    question: 'What is the National "Finland Scholarship" and who qualifies for it?',
    answer:
      'The Finland Scholarship is a prestigious national funding scheme financed by the Finnish Ministry of Education and Culture (OKM) and awarded directly by Finnish Research Universities (such as University of Helsinki, Aalto University, Tampere University, University of Oulu, University of Turku, LUT University, University of Jyväskylä, and Åbo Akademi) to top non-EU/EEA Master’s applicants. It covers 100% of your first-year tuition fee PLUS a minimum EUR 5,000 (~6.5 Lakh BDT) relocation and living grant paid into your Finnish bank account after arrival. Many research universities also extend a 100% Year-2 tuition waiver if you complete at least 55 to 60 ECTS credits during Year 1.',
  },
  {
    question: 'How do scholarships and early-bird waivers work at Finnish Universities of Applied Sciences (UAS)?',
    answer:
      'Universities of Applied Sciences (Ammattikorkeakoulu — UAS, such as Metropolia, Centria, LAB, Haaga-Helia, SAMK, and SeAMK) primarily offer two structured discounts for Bachelor’s and Master’s students: (1) First-Year Early-Bird Discounts of 10% to 50% (typically EUR 1,500 to EUR 4,000 off) if you accept your Studyinfo.fi study place and wire your first-year tuition via a Bangladesh Bank Student File within 7 to 21 days of offer notifications; and (2) Second-to-Fourth Year Academic & Finnish Language Scholarships (25% to 50%+ tuition waiver) if you earn at least 55 to 60 ECTS credits per academic year and pass required Finnish language proficiency milestones (CEFR A2/B1).',
  },
  {
    question: 'Do I still need to show EUR 9,600 in my personal bank account if I win a 100% Finland tuition scholarship?',
    answer:
      'Yes, with one important exception. Under Finnish Immigration Service (Migri) regulations, a 100% tuition fee waiver exempts you from paying or showing tuition funds, but you must STILL show EUR 9,600 (EUR 800/month × 12 months, ~12.48 Lakh BDT) for living expenses in your sole personal bank account. However, if you win the national Finland Scholarship that includes the official EUR 5,000 living/relocation grant written on your admission certificate, Migri deducts that EUR 5,000 directly from the EUR 9,600 threshold — meaning you only need to hold EUR 4,600 (~6.0 Lakh BDT) in your personal bank account for Year 1!',
  },
  {
    question: 'How do Bangladeshi students apply for the Finland Scholarship on Studyinfo.fi?',
    answer:
      'There is no separate external portal for the Finland Scholarship. You apply for the scholarship simultaneously inside your online admission form on Studyinfo.fi (Opintopolku) during the annual January Joint Application window (early-to-mid January for August/September intake). Simply select the checkbox indicating you wish to apply for the Finland Scholarship / University Tuition Waiver and upload your targeted Scholarship Motivation statement along with your Bachelor transcripts and IELTS/PTE/TOEFL score.',
  },
  {
    question: 'Are PhD (Doctoral) programs in Finland tuition-free for Bangladeshi students?',
    answer:
      'Yes! Under the Finnish Universities Act, Doctoral (PhD) education at all Finnish universities is 100% tuition-free for both EU and non-EU citizens (including Bangladeshi students). Furthermore, rather than studying unpaid, many admitted PhD candidates apply for salaried Doctoral Researcher employment contracts with their faculty or foundation grants (such as EDUFI Fellowships, Kela/Finnish Cultural Foundation, or Academy of Finland project funding) paying EUR 2,400 to EUR 3,200/month.',
  },
  {
    question: 'What is EduExpress’s service charge for Finland scholarship and Studyinfo.fi admission guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge. You pay zero upfront consultancy fees for Studyinfo.fi program selection, Finland Scholarship application review, or Migri source-of-funds auditing. Under our written European service agreement, our BDT 100,000 service package is payable 100% after your Finnish Residence Permit for Studies is approved by Migri.',
  },
];

export default async function FinlandScholarshipsPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Finland', isActive: true },
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
        name: 'Finland Scholarships for Bangladeshi Students 2027: Finland Scholarship, UAS Waivers & PhD Guide',
        description:
          'Finland scholarships for Bangladeshi students 2027: Finland Scholarship (100% + €5,000), 20%–50% early-bird UAS waivers, and 55–60 ECTS renewal rules.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/finland.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(FINLAND_SCHOLARSHIP_SOURCES),
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
          { name: 'Finland', path: '/study-in-finland-from-bangladesh' },
          { name: 'Scholarships' },
        ]}
        eyebrow="National Finland Scholarship (100% + €5,000) · UAS Early-Bird & 55-ECTS Waivers · Tuition-Free PhD"
        title="Finland Scholarships for Bangladeshi Students 2027."
        lead="An evidence-first breakdown of Finnish higher education scholarships and tuition waivers for Bangladeshi students: applying for the Ministry-funded Finland Scholarship (100% tuition + EUR 5,000 relocation grant) via Studyinfo.fi, UAS early-bird and 55–60 ECTS credit reductions, and how official grants impact your Migri EUR 9,600 bank requirement."
        actions={
          <>
            <Link href="/apply?country=Finland" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Finland Scholarship Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/finland-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Finland Study Costs
            </Link>
            <Link href="/finland-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Finland Residence Permit Guide
            </Link>
          </>
        }
      />

      <TrustBar destination="Finland" />

      {/* Key Statutory Scholarship Metrics */}
      <section aria-label="Finland scholarship statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 EUR (€) ≈ 130 BDT</strong> (Migri statutory living baseline: EUR 800/mo = EUR 9,600/yr).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Written Renewal Conditions
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Award size={16} className="text-emerald-700" /> Master’s Flagship
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Finland Scholarship</p>
              <p className="mt-1 text-xs text-slate-600">100% Year-1 tuition waiver + €5,000 (~6.5L BDT) relocation grant.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> UAS Bachelor/Master
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">10% – 50% Waivers</p>
              <p className="mt-1 text-xs text-slate-600">Early-Bird Year-1 discounts + Year 2–4 ECTS &amp; Finnish language waivers.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Doctoral (PhD)
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">€0 Tuition + Salary</p>
              <p className="mt-1 text-xs text-slate-600">100% tuition-free by law; salaried Doctoral Researcher roles (€2.5k–€3.2k/mo).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Calendar size={16} className="text-emerald-700" /> Joint Application
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Early – Mid January</p>
              <p className="mt-1 text-xs text-slate-600">Applied inside the Studyinfo.fi form for August/September intake.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 4 Finland Funding Tiers Compared */}
      <Section
        id="scholarship-tiers"
        tone="white"
        title="Four Finnish scholarship &amp; waiver tiers compared for Bangladeshi students."
        intro="Understand the exact difference between Research University Master’s fellowships, UAS Applied Science discounts, and tuition-free Doctoral tracks."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[740px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Comparison of Finland scholarship and tuition waiver tiers</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Scholarship / Waiver Type</th>
                <th className="px-5 py-4 font-bold">Institution &amp; Level</th>
                <th className="px-5 py-4 font-bold">Year 1 Coverage</th>
                <th className="px-5 py-4 font-bold">Year 2+ Renewal Condition</th>
                <th className="px-5 py-4 font-bold">Migri Personal Bank Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">National Finland Scholarship</td>
                <td className="px-5 py-4">Research Universities (Master’s)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition + €5,000 Grant</td>
                <td className="px-5 py-4">55–60 ECTS completed in Year 1 (at most unis)</td>
                <td className="px-5 py-4">Reduced to €4,600 (~6.0L BDT) for Year 1</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">University Tuition Waiver (50%–100%)</td>
                <td className="px-5 py-4">Research Unis (Bachelor/Master)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">50% or 100% Tuition Waiver</td>
                <td className="px-5 py-4">Minimum 55 ECTS credits per academic year</td>
                <td className="px-5 py-4">Full €9,600 (~12.48L BDT) in student account</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">UAS Early-Bird &amp; Proficiency Waiver</td>
                <td className="px-5 py-4">UAS (Bachelor’s &amp; Master’s)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">10%–50% Early-Bird Discount</td>
                <td className="px-5 py-4">55–60 ECTS/yr + Finnish language test (A2/B1)</td>
                <td className="px-5 py-4">Paid net tuition + €9,600 in student account</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">Doctoral (PhD) Statutory Exemption</td>
                <td className="px-5 py-4">All Research Universities (PhD)</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition-Free by Law</td>
                <td className="px-5 py-4">Active doctoral research &amp; supervisor progress</td>
                <td className="px-5 py-4">Waived if holding salaried researcher contract</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: How to Win & Maintain Finnish Scholarships */}
      <Section
        id="renewal-rules"
        tone="sage"
        title="How Bangladeshi students win and keep Finnish scholarships."
        intro="In Finland, getting a first-year discount is only half the equation; keeping it for Years 2 to 4 requires disciplined credit completion."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-petrol-800">Winning Strategies for Studyinfo.fi January Call</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Prepare IELTS 6.5+ (or PTE 62+) by December:</strong> Because the Finland Joint Application closes in mid-January, having your English test score and Bachelor transcripts ready before January 1 is mandatory.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Apply to Up to 6 Programs in One Joint Form:</strong> Studyinfo.fi allows you to apply to up to 6 degree programs across different Finnish universities in a single Joint Application form, multiplying your Finland Scholarship chances.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Ready Your Student File for Early-Bird Windows:</strong> To lock in a 20%–50% UAS Early-Bird discount (saving €1,500–€3,500), have your Bangladesh Bank Student File documents ready to wire tuition within 14 days of admission results.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical Renewal &amp; Solvency Warnings</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>The 55–60 ECTS Credit Rule vs Part-Time Work:</strong> A full academic year in Finland is 60 ECTS credits. Students who work excessive hours and complete only 40 ECTS lose their Year-2 scholarship and must pay full tuition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Finnish Language Requirement at UAS:</strong> Several Universities of Applied Sciences now tie Year-2 and Year-3 tuition waivers to passing internal Finnish language courses (CEFR A2/B1). Always check the exact renewal clause in writing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Personal Account Rule Still Applies:</strong> Never leave your EUR 9,600 (or EUR 4,600 for Finland Scholarship winners) in a parent’s account — Migri requires the living balance in the student’s sole personal account.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 3: Verified Finnish Universities */}
      {universities.length > 0 && (
        <Section
          id="finland-universities"
          tone="white"
          title="Verified Finnish universities in the EduExpress directory."
          intro="Compare Finnish Research Universities and Universities of Applied Sciences (UAS)."
          action={
            <Link href="/universities?country=finland" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Finland universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Finland'}</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Evidence-First Scholarship Policy</span>
            <h2 className="mt-1 font-display text-2xl font-black sm:text-4xl text-white">
              BDT 0 File-Opening Charge · Written ClearCost &amp; Renewal Schedule
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We verify your exact Year-1 net tuition, Year-2 ECTS/language renewal conditions, and Migri EUR 9,600 source-of-funds plan in writing on a 1-page <strong>ClearCost Sheet</strong> with BDT 0 upfront file fees.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-finland-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                Finland Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/finland-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Finland Cost Breakdown
              </Link>
              <Link href="/finland-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                Finland Residence Permit Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: FAQs */}
      <FaqBlock
        items={FINLAND_SCHOLARSHIP_FAQS}
        title="Frequently asked questions about Finland scholarships."
        tone="sage"
      />

      {/* Module 6: Official Sources & Disclaimer */}
      <Section id="sources" tone="white" title="Official Finnish scholarship authorities &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {FINLAND_SCHOLARSHIP_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <Link href="/author/abdullah-al-rakib" className="font-bold text-petrol-800 underline underline-offset-4 hover:text-emerald-700">Abdullah Al Rakib</Link> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against Finnish National Agency for Education (EDUFI) Finland Scholarship guidelines, Studyinfo.fi rules, and Migri income thresholds on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and scholarship-application guidance under written service terms. Final admission, scholarship or early-bird waiver award, and residence permit decisions rest solely with the respective Finnish universities and the Finnish Immigration Service (Migri).
          </p>
        </div>
      </Section>

      {/* Module 7: Assessment Form */}
      <section className="bg-canvas-soft py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Studyinfo.fi Joint Call &amp; Waiver Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Finland Scholarship &amp; UAS Waiver Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your GPA, IELTS/PTE score, and target field. Our Dhanmondi team will shortlist your 6 optimal Studyinfo.fi programs and calculate your net first-year budget within one working day.
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

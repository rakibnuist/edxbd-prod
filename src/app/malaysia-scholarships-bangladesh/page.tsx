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
const PATH = '/malaysia-scholarships-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const MALAYSIA_SCHOLARSHIP_SOURCES = [
  {
    label: 'Ministry of Higher Education Malaysia (MOHE) — Malaysia International Scholarship (MIS)',
    href: 'https://biasiswa.mohe.gov.my/INTER/',
    note: 'Statutory Malaysian federal government postgraduate scholarship covering Master’s and PhD tuition fees and a monthly living allowance of MYR 1,500.',
  },
  {
    label: 'Ministry of Foreign Affairs Malaysia — Malaysian Technical Cooperation Programme (MTCP)',
    href: 'https://mtcp.kln.gov.my/',
    note: 'Malaysian government full Master’s scholarship for developing nations (including Bangladesh) covering 100% tuition, MYR 3,500/month living allowance, and return economy airfare.',
  },
  {
    label: 'Education Malaysia Global Services (EMGS) — Institutional & Branch Campus Funding',
    href: 'https://educationmalaysia.gov.my/',
    note: 'Statutory student pass portal listing public research universities (UM, UPM, UKM, USM, UTM) and private/branch universities offering merit waivers.',
  },
  {
    label: 'Malaysian Qualifications Agency (MQA) — Accredited Higher Education Directory',
    href: 'https://www2.mqa.gov.my/mqr/',
    note: 'National quality register verifying degree accreditation across public, private, and foreign branch campuses in Malaysia.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'Malaysia Scholarships for Bangladeshi Students 2027 | MIS',
    description:
      'Malaysia scholarships for Bangladeshi students 2027: MIS & MTCP government awards, 20%–50% private & UK/AU branch campus merit waivers, and BDT 0 agency fee.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('malaysia', 'Malaysia Scholarships for Bangladeshi Students — EduExpress International'),
  });
}

const MALAYSIA_SCHOLARSHIP_FAQS = [
  {
    question: 'What government scholarships does Malaysia offer to Bangladeshi students in 2027?',
    answer:
      'Malaysia offers two primary federal government scholarships for Bangladeshi postgraduate applicants: (1) the Malaysia International Scholarship (MIS), administered by the Ministry of Higher Education (MOHE) for full-time Master’s and PhD studies at Malaysian public and select private universities (covering 100% tuition fees plus a MYR 1,500/month living stipend); and (2) the Malaysian Technical Cooperation Programme (MTCP) Scholarship, administered by the Ministry of Foreign Affairs for 1-to-2 year Master’s programs (covering 100% tuition, a generous MYR 3,500/month living allowance, and round-trip economy flights from Dhaka to Kuala Lumpur). Both require a strong Bachelor CGPA (typically 3.50+/4.00) and IELTS 6.0+ or TOEFL equivalent.',
  },
  {
    question: 'What merit scholarships are available for undergraduate (Bachelor’s & Foundation) Bangladeshi students in Malaysia?',
    answer:
      'While Malaysian government awards (MIS/MTCP) are strictly for Master’s and PhD study, leading Malaysian private universities (such as Taylor’s University, Sunway University, Asia Pacific University — APU, UCSI University, SEGi, and INTI) and foreign branch campuses (Monash University Malaysia, University of Nottingham Malaysia, Curtin, and Swinburne Sarawak) offer automatic Undergraduate & Foundation Merit Scholarships ranging from 15% to 50% (and up to 100% for elite A-Level / HSC GPA 5.00 distinction holders) off annual tuition fees.',
  },
  {
    question: 'How do Graduate Research Assistantships (GRA) work at Malaysian public universities (UM, UPM, UKM, USM, UTM)?',
    answer:
      'At Malaysia’s top five public research universities (Universiti Malaya, Universiti Putra Malaysia, Universiti Kebangsaan Malaysia, Universiti Sains Malaysia, and Universiti Teknologi Malaysia), Master’s-by-Research and PhD students can apply directly to faculty supervisors holding FRGS or industry grants for a Graduate Research Assistantship (GRA). A GRA appointment typically pays a monthly research stipend of MYR 1,500 to MYR 2,800 (~40,500–75,600 BDT) while public university graduate tuition remains naturally low (MYR 8,000–16,000/year).',
  },
  {
    question: 'What CGPA is required every semester to keep a Malaysian private university merit scholarship?',
    answer:
      'Automatic merit tuition waivers at Malaysian private and branch-campus universities (e.g., a 30% tuition discount at APU, Taylor’s, Sunway, or UCSI) are conditional upon maintaining a minimum semester CGPA—typically CGPA 3.00 to 3.30 out of 4.00 for a 20%–30% award, and CGPA 3.50 to 3.70+ for a 50%+ award—with zero failed modules. Always check the written scholarship renewal clause on your offer letter before paying your initial deposit.',
  },
  {
    question: 'Does winning a partial Malaysian tuition scholarship waive the EMGS visa and medical fee?',
    answer:
      'No. Even when a Malaysian university grants you a 30% to 50% tuition waiver, every international student must still pay the statutory Education Malaysia Global Services (EMGS) visa processing, health screening, and insurance package (~MYR 2,500 to MYR 3,800 depending on institution category) to obtain the Electronic Visa Approval Letter (eVAL).',
  },
  {
    question: 'What is EduExpress’s service charge for Malaysia scholarship and university admission processing?',
    answer:
      'EduExpress operates with a strict BDT 0 service charge for Malaysia. We charge zero file-opening fees and zero consultancy fees for university admission, automatic merit scholarship application, EMGS eVAL tracking, and Bangladesh Bank Student File guidance.',
  },
];

export default async function MalaysiaScholarshipsPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: 'Malaysia', isActive: true },
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
        name: 'Malaysia Scholarships for Bangladeshi Students 2027: MIS, MTCP & University Merit Waivers',
        description:
          'Malaysia scholarships for Bangladeshi students 2027: MIS & MTCP government awards, 20%–50% private & UK/AU branch campus merit waivers, and BDT 0 agency fee.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/author/abdullah-al-rakib#person` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malaysia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALAYSIA_SCHOLARSHIP_SOURCES),
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
          { name: 'Scholarships' },
        ]}
        eyebrow="MIS & MTCP Government Awards · 15%–50% Private & Branch Campus Merit Waivers · BDT 0 Agency Fee"
        title="Malaysia Scholarships for Bangladeshi Students 2027."
        lead="An evidence-first guide to higher education funding in Malaysia for Bangladeshi students: comparing federal MIS and MTCP postgraduate scholarships, public research university GRA fellowships (UM, UPM, UKM, USM, UTM), and automatic 15%–50% undergraduate tuition waivers at top private and UK/Australian branch campuses."
        actions={
          <>
            <Link href="/apply?country=Malaysia" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Malaysia Scholarship Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/malaysia-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Malaysia Study Costs
            </Link>
            <Link href="/malaysia-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Malaysia EMGS Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar destination="Malaysia" />

      {/* Key Statutory Scholarship Metrics */}
      <section aria-label="Malaysia scholarship statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1 MYR (RM) ≈ 27 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 EduExpress Service Fee for Malaysia
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Award size={16} className="text-emerald-700" /> Federal PG Awards
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">MIS &amp; MTCP</p>
              <p className="mt-1 text-xs text-slate-600">100% Master’s/PhD tuition + RM 1,500–3,500/mo stipend (MTCP adds flights).</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> Private &amp; Branch Unis
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">15% – 50% Waivers</p>
              <p className="mt-1 text-xs text-slate-600">Automatic HSC/A-Level merit bursaries at APU, Taylor’s, Sunway, Monash &amp; UCSI.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Public Research Unis
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">GRA Lab Stipends</p>
              <p className="mt-1 text-xs text-slate-600">RM 1,500–2,800/mo Graduate Research Assistantships at UM, UPM, UTM &amp; USM.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Calendar size={16} className="text-emerald-700" /> Intake Flexibility
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">3–4 Intakes / Year</p>
              <p className="mt-1 text-xs text-slate-600">Private merit bursaries open for Jan/Mar, May/July &amp; Sept/Oct intakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 4 Malaysia Scholarship Tiers Compared */}
      <Section
        id="scholarship-tiers"
        tone="white"
        title="Four Malaysia scholarship pathways compared for Bangladeshi students."
        intro="Compare exact financial coverage, GPA requirements, renewal rules, and remaining family expenses across Malaysia’s four funding tiers."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[740px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Comparison of Malaysia scholarship categories for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-5 py-4 font-bold">Scholarship Route</th>
                <th className="px-5 py-4 font-bold">Study Level</th>
                <th className="px-5 py-4 font-bold">Award Coverage (MYR / BDT)</th>
                <th className="px-5 py-4 font-bold">Eligibility &amp; Renewal</th>
                <th className="px-5 py-4 font-bold">Remaining Family Outlay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">MTCP Scholarship (Ministry of Foreign Affairs)</td>
                <td className="px-5 py-4">Full-Time Master’s</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition + RM 3,500/mo (~94.5k BDT) + Flights</td>
                <td className="px-5 py-4">Age ≤ 45 · CGPA 3.50+ · IELTS 6.0+ (May–June window)</td>
                <td className="px-5 py-4">EMGS medical check &amp; personal pocket money only</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">Malaysia International Scholarship (MIS - MOHE)</td>
                <td className="px-5 py-4">Master’s &amp; PhD</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">100% Tuition + RM 1,500/mo (~40.5k BDT)</td>
                <td className="px-5 py-4">Age ≤ 40 (MS) / ≤ 45 (PhD) · CGPA 3.50+ (Apr–Jun)</td>
                <td className="px-5 py-4">Airfare, EMGS visa fee &amp; minor living top-up in KL</td>
              </tr>
              <tr>
                <td className="px-5 py-4 font-bold text-petrol-800">Public University GRA (UM, UPM, UKM, USM, UTM)</td>
                <td className="px-5 py-4">Master’s (Research) &amp; PhD</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">RM 1,500 – 2,800/mo Lab Stipend</td>
                <td className="px-5 py-4">Supervisor grant acceptance + research publications</td>
                <td className="px-5 py-4">Low public tuition (RM 8k–15k/yr) + EMGS fee</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-5 py-4 font-bold text-petrol-800">Private &amp; Branch Campus Merit Waiver</td>
                <td className="px-5 py-4">Foundation, Bachelor’s &amp; Master’s</td>
                <td className="px-5 py-4 font-semibold text-emerald-800">15% to 50% Tuition Reduction (RM 5k–20k/yr saved)</td>
                <td className="px-5 py-4">HSC GPA 4.25–5.00; maintain CGPA 3.00–3.50/yr</td>
                <td className="px-5 py-4">Net tuition + EMGS fee + RM 1,500–2,200/mo living</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: Verified Malaysian Universities */}
      {universities.length > 0 && (
        <Section
          id="malaysia-universities"
          tone="sage"
          title="Verified Malaysian universities in the EduExpress directory."
          intro="Compare public research flagships, private universities, and UK/Australian branch campuses in Kuala Lumpur and Selangor."
          action={
            <Link href="/universities?country=malaysia" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all Malaysia universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'Malaysia'}</span>
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

      {/* Module 3: FAQs */}
      <FaqBlock
        items={MALAYSIA_SCHOLARSHIP_FAQS}
        title="Frequently asked questions about Malaysia scholarships."
        tone="white"
      />

      {/* Module 4: Official Sources & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Malaysian scholarship authorities &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {MALAYSIA_SCHOLARSHIP_SOURCES.map((source) => (
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
            (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209 on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and scholarship-application guidance under written service terms (at BDT 0 service charge for Malaysia). Final admission, scholarship award, and EMGS eVAL/visa decisions rest solely with the respective Malaysian universities and official Malaysian government authorities.
          </p>
        </div>
      </Section>

      {/* Module 5: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">BDT 0 Consultancy · Free Merit Waiver Check</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your Malaysia Scholarship &amp; University Fit</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your SSC/HSC or Bachelor GPA and target intake. Our Dhanmondi team will calculate your automatic Malaysian university tuition discount and net MYR/BDT cost sheet within one working day.
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

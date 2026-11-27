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
const PATH = '/south-korea-scholarships-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const KOREA_SCHOLARSHIP_SOURCES = [
  {
    label: 'Study in Korea (National Institute for International Education — NIIED) — Global Korea Scholarship (GKS)',
    href: 'https://www.studyinkorea.go.kr/',
    note: 'Statutory Korean Ministry of Education agency administering Global Korea Scholarship (GKS-U and GKS-G) quotas, 1-year Korean language training, tuition coverage, and monthly KRW stipends.',
  },
  {
    label: 'Embassy of the Republic of Korea in Dhaka — GKS Embassy Track Nomination Notices',
    href: 'https://overseas.mofa.go.kr/bd-en/index.do',
    note: 'Diplomatic mission in Baridhara, Dhaka conducting Round 1 document screening and interviews for Bangladeshi GKS Embassy Track applicants.',
  },
  {
    label: 'National Research Foundation of Korea (NRF) — Brain Korea 21 (BK21 Four) Graduate Fellowships',
    href: 'https://www.nrf.re.kr/eng/index',
    note: 'National government R&D funding enabling Korean university professors to fund Master’s and PhD lab researchers with monthly living stipends and tuition waivers.',
  },
  {
    label: 'Test of Proficiency in Korean (TOPIK) — Official NIIED Examination Portal',
    href: 'https://www.topik.go.kr/',
    note: 'Official Korean proficiency benchmark governing 10% GKS point bonuses, KRW 100,000/month GKS TOPIK grants, and 30%–100% university merit tuition waivers.',
  },
];

export async function generateMetadata() {
  return pageMetadata({
    title: 'South Korea Scholarships from Bangladesh 2027 | GKS & Merit',
    description:
      'Global Korea Scholarship (GKS) & university waivers for Bangladeshi students: Embassy vs University track, KRW 1M–1.5M stipends, and BK21 STEM funding.',
    path: PATH,
    locale: 'en_BD',
    image: ogImage('south-korea', 'South Korea Scholarships for Bangladeshi Students — EduExpress International'),
  });
}

const KOREA_SCHOLARSHIP_FAQS = [
  {
    question: 'What is the difference between the GKS Embassy Track and the GKS University Track for Bangladeshi students?',
    answer:
      'The Global Korea Scholarship (GKS, formerly KGSP) offers two application channels, and applicants may choose only ONE per intake cycle: (1) Under the Embassy Track, you submit your file to the Embassy of the Republic of Korea in Dhaka and list up to 3 Korean universities (including at least one Type B regional university). If you pass Dhaka Embassy Round 1 and NIIED Round 2, you apply to all 3 universities in Round 3. (2) Under the University Track, you apply directly to ONE specific Korean university (frequently advantageous for regional STEM and R&D applicants where university quotas are larger than Dhaka Embassy seats).',
  },
  {
    question: 'What does the Global Korea Scholarship (GKS) cover in 2027?',
    answer:
      'GKS is one of Asia’s most comprehensive fully funded awards: it covers (1) 100% of university tuition fees for the entire degree (4 years Bachelor’s, 2 years Master’s, 3 years PhD); (2) 1 full year of intensive Korean language training at a designated KLI before starting your degree (unless you already hold TOPIK Level 5 or 6); (3) round-trip economy airfare between Dhaka and Incheon; (4) a monthly living allowance of approximately KRW 1,000,000 to KRW 1,500,000 (~90,000–135,000 BDT) including language-year and degree-year rates; (5) an extra KRW 100,000/month TOPIK proficiency grant for scholars holding TOPIK 5/6; (6) KRW 200,000 arrival settlement allowance; and (7) National Health Insurance (NHIS) coverage.',
  },
  {
    question: 'What are the CGPA and age limits for Bangladeshi GKS applicants?',
    answer:
      'Applicants must hold a cumulative GPA in the top 20% of their class or at least 80% on a 100-point scale (minimum CGPA 2.64/4.00, 2.80/4.30, or 2.91/4.50 — though competitive shortlisted candidates from Bangladesh typically hold HSC GPA 5.00 or Bachelor CGPA 3.40+). For GKS Undergraduate (GKS-U), applicants must be under 25 years of age at the time of application. For GKS Graduate (GKS-G Master’s and PhD), applicants must be under 40 years of age (or under 45 for official academic professors from ODA countries).',
  },
  {
    question: 'How do Professor Lab Scholarships (BK21 / Research Assistantships) work for Master’s and PhD students in Korea?',
    answer:
      'For Bangladeshi STEM, Computer Science, AI, Electronics, and Engineering graduates, direct Professor Lab Admission is often far higher-probability than GKS. By emailing a Korean research professor whose lab holds Brain Korea 21 (BK21) or National Research Foundation (NRF) grants and securing a Lab Acceptance Letter, the university waives 50% to 100% of tuition while the professor pays a monthly Research Assistant (RA) stipend of KRW 700,000 to KRW 1,500,000/month (~63,000–135,000 BDT) directly from lab project funds.',
  },
  {
    question: 'What university admission scholarships are available for self-funded Undergraduate and Master’s students?',
    answer:
      'Almost every IEQAS-certified Korean national and private university (such as Kyungpook National, Pusan National, Chonnam National, Hanyang, SKKU, Inha, and Sejong University) offers automatic first-semester admission tuition waivers of 30% to 100% based on your IELTS score (e.g., IELTS 6.5 gives 50%, IELTS 7.0+ gives 70%–100%) or TOPIK level (TOPIK 3–6). From the second semester onward, renewal is determined strictly by your previous semester’s university GPA (typically requiring a 3.0 to 3.5/4.5 GPA).',
  },
  {
    question: 'Does EduExpress charge upfront fees for South Korea scholarship or admission guidance?',
    answer:
      'EduExpress operates with a strict BDT 0 file-opening charge. We never sell or promise guaranteed GKS seats. Instead, we evaluate your academic profile against both GKS University Track quotas and high-probability Korean university merit/professor-lab scholarships, providing a complete written ClearCost Sheet before you commit to any application.',
  },
];

export default async function SouthKoreaScholarshipsPage() {
  let universities: { id: string; name: string; slug: string; city: string | null; tuition: string | null }[] = [];
  try {
    universities = await prisma.university.findMany({
      where: { country: { contains: 'Korea' }, isActive: true },
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
        name: 'South Korea Scholarships for Bangladeshi Students 2027: GKS, BK21 & University Waivers',
        description:
          'Global Korea Scholarship (GKS) & university waivers for Bangladeshi students: Embassy vs University track, KRW 1M–1.5M stipends, and BK21 STEM funding.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/south-korea.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(KOREA_SCHOLARSHIP_SOURCES),
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
          { name: 'South Korea', path: '/study-in-south-korea-from-bangladesh' },
          { name: 'Scholarships' },
        ]}
        eyebrow="Global Korea Scholarship (GKS) · BK21 Professor Lab Funding · 30%–100% University Merit Waivers"
        title="South Korea Scholarships for Bangladeshi Students 2027."
        lead="A complete, evidence-first guide to funding higher education in South Korea from Bangladesh: comparing the NIIED Global Korea Scholarship (GKS Embassy vs University Track), professor-funded STEM research lab fellowships (BK21/NRF), and automatic IELTS/TOPIK university tuition waivers."
        actions={
          <>
            <Link href="/apply?country=South%20Korea" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My Korea Scholarship Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Compare Korea Study Costs
            </Link>
            <Link href="/south-korea-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Korea D-2 Visa Guide
            </Link>
          </>
        }
      />

      <TrustBar destination="South Korea" />

      {/* Key Statutory Scholarship Metrics */}
      <section aria-label="South Korea scholarship statutory metrics" className="border-b border-canvas-soft bg-white py-10">
        <div className={kit.wrap}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Planning Assumption · November 2026 Baseline
              </span>
              <p className="text-xs text-slate-500">
                Exchange Rate Baseline: <strong>1,000 KRW (₩) ≈ 90 BDT</strong> · <strong>1 USD ≈ 122 BDT</strong>.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
              <ShieldCheck size={16} /> BDT 0 File-Opening Fee · Written Coverage Verification
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Award size={16} className="text-emerald-700" /> Government Award
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">GKS (NIIED)</p>
              <p className="mt-1 text-xs text-slate-600">100% tuition + 1-yr Korean + flights + KRW 1.0M–1.5M/mo stipend.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Landmark size={16} className="text-emerald-700" /> Graduate STEM Track
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Professor Lab (BK21)</p>
              <p className="mt-1 text-xs text-slate-600">50%–100% tuition waiver + KRW 700k–1.5M/mo RA lab stipend.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <GraduationCap size={16} className="text-emerald-700" /> University Merit
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">30% – 100% Waiver</p>
              <p className="mt-1 text-xs text-slate-600">Awarded on IELTS (6.0–7.5+) or TOPIK (Level 3–6) &amp; renewed by GPA.</p>
            </div>

            <div className="rounded-2xl border border-rule bg-canvas-soft p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                <Calendar size={16} className="text-emerald-700" /> Annual GKS Windows
              </div>
              <p className="mt-2 text-base font-bold text-petrol-800">Sept (UG) · Feb (PG)</p>
              <p className="mt-1 text-xs text-slate-600">GKS-U opens Sept–Oct (March intake); GKS-G opens Feb–March (Sept intake).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1: 3 Korean Scholarship Pathways Compared */}
      <Section
        id="scholarship-tracks"
        tone="white"
        title="Three distinct scholarship routes in South Korea for Bangladeshi students."
        intro="Compare coverage, competition intensity, bank solvency impact, and renewal conditions across Korea’s three funding tiers."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/15 bg-white shadow-xs">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14.5px]">
            <caption className="sr-only">Comparison of South Korean scholarship pathways for Bangladeshi students</caption>
            <thead className="bg-petrol-800 text-white">
              <tr>
                <th className="px-6 py-4 font-bold">Scholarship Route</th>
                <th className="px-6 py-4 font-bold">Tuition Coverage</th>
                <th className="px-6 py-4 font-bold">Monthly Living Stipend</th>
                <th className="px-6 py-4 font-bold">Visa Bank Solvency Rule</th>
                <th className="px-6 py-4 font-bold">Renewal Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">Global Korea Scholarship (GKS-U &amp; GKS-G)</td>
                <td className="px-6 py-4">100% Full Degree + 1-Yr Korean</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">KRW 1,000,000 – 1,500,000 / mo + Airfare</td>
                <td className="px-6 py-4">Waived ($0 Bank Certificate needed)</td>
                <td className="px-6 py-4">Pass TOPIK 3 within 1 yr + maintain 70%–80% GPA</td>
              </tr>
              <tr className="bg-canvas-soft/50">
                <td className="px-6 py-4 font-bold text-petrol-800">Professor Lab Fellowship (BK21 / NRF STEM)</td>
                <td className="px-6 py-4">50% to 100% Tuition Waiver</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">KRW 700,000 – 1,500,000 / mo (Lab RA)</td>
                <td className="px-6 py-4">Reduced or offset by official Professor Financial Guarantee</td>
                <td className="px-6 py-4">Active lab research output &amp; graduate GPA ≥ 3.5/4.5</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-petrol-800">University IELTS / TOPIK Entrance Waiver</td>
                <td className="px-6 py-4">30% to 100% (1st Semester)</td>
                <td className="px-6 py-4 font-semibold text-emerald-800">None (Supplement via S-3 part-time work)</td>
                <td className="px-6 py-4">Standard $16k–$20k in 14 Dhaka Embassy banks required</td>
                <td className="px-6 py-4">Semester GPA rank (typically ≥ 3.0 to 3.7 / 4.5)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 2: GKS Embassy Track vs University Track & Application Timeline */}
      <Section
        id="gks-process"
        tone="sage"
        title="6-stage GKS &amp; Korean university scholarship process from Bangladesh."
        intro="Whether applying for GKS or direct university merit funding, Apostille/consular document legalization and language test scores must be completed ahead of deadline."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 'Stage 01',
              title: 'Choose Embassy Track vs University Track',
              timeline: '3 Months Before Call Opens',
              body: 'Decide strategically between the Dhaka Korean Embassy Track (3 university choices, broad national quota) and the Direct University Track (1 university choice, dedicated regional STEM/R&D quota).',
            },
            {
              step: 'Stage 02',
              title: 'Apostille / Consular Legalization of Certificates',
              timeline: '6–8 Weeks Before Deadline',
              body: 'NIIED strictly rejects unverified photocopies. Attest original SSC, HSC, Bachelor transcripts, and Family Relation Certificate via Education Board, MoE, MoFA Dhaka, and consular legalization.',
            },
            {
              step: 'Stage 03',
              title: 'IELTS / TOPIK Bonus & Professor Outreach',
              timeline: '4–8 Weeks Before Deadline',
              body: 'Holders of TOPIK Level 3–6 or high IELTS/TOEFL receive additional evaluation points. For Master’s/PhD STEM applicants, contact target Korean lab professors to secure pre-review support.',
            },
            {
              step: 'Stage 04',
              title: 'Round 1 Screening & Interview (Embassy or Uni)',
              timeline: 'Sept–Oct (UG) / Feb–Mar (PG)',
              body: 'Submit your physical dossier before the strict cut-off. Shortlisted applicants attend the Round 1 interview at the Korean Embassy in Baridhara or via video call with the Korean university faculty.',
            },
            {
              step: 'Stage 05',
              title: 'NIIED Round 2 Evaluation & Medical Check',
              timeline: 'Nov–Dec (UG) / Apr–May (PG)',
              body: 'Round 1 nominees are evaluated by the NIIED central committee in Korea. Selected candidates submit their official medical assessment and await Round 3 university placement.',
            },
            {
              step: 'Stage 06',
              title: 'Final NIIED Invitation / CoA & D-2 Visa',
              timeline: 'Jan (UG) / June–July (PG)',
              body: 'Receive your Final GKS Invitation Letter (or university merit CoA), lodge your D-2 student visa at the Korean Embassy in Dhaka, and depart for Incheon.',
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

      {/* Module 3: Strategic Advice & Pitfalls */}
      <Section
        id="scholarship-strategy"
        tone="white"
        title="How Bangladeshi students maximize Korean scholarship acceptance."
        intro="Avoid the common errors that eliminate 70% of Bangladeshi GKS and university scholarship applications in the first round."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={kit.cardSage}>
            <h3 className="text-[19px] font-bold text-petrol-800">High-Probability Winning Strategies</h3>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-ink-soft">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Leverage Regional Type-B Flagships (R-GKS):</strong> Regional National Universities (such as Kyungpook National in Daegu, Pusan National in Busan, and Chonnam National in Gwangju) hold dedicated GKS regional STEM quotas with far better acceptance ratios than Seoul SKY universities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Combine IELTS 6.5+ with Direct University Merit Track:</strong> A Bangladeshi student with IELTS 6.5–7.0 and CGPA 3.30+ can secure an immediate 50%–100% first-semester tuition waiver at top private and national universities without waiting a full year for GKS cycles.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-700" />
                <span><strong>Convert CGPA to 100-Point Scale Officially:</strong> Obtain an official CGPA-to-Percentage conversion certificate from your Bangladeshi university Controller of Examinations, as NIIED requires an official 80%+ verification sheet.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className="text-[19px] font-bold text-amber-950">Critical Disqualification &amp; Cost Warnings</h3>
            </div>
            <ul className="mt-4 space-y-3 text-[14.5px] leading-6 text-amber-950/90">
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Applying to Both Embassy &amp; University Track:</strong> Submitting GKS applications to both the Dhaka Embassy and a Korean university in the same intake triggers automatic NIIED blacklisting across both tracks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>Partial Waiver Still Requires $16k–$20k Solvency:</strong> Remember that if you win a 50% university merit tuition discount (non-GKS), the Korean Embassy in Dhaka still requires the full USD 16,000–20,000 bank solvency certificate in one of its 14 designated banks for your D-2 visa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="mt-1 shrink-0 text-amber-700" />
                <span><strong>1-Year Korean Language Gate for GKS:</strong> GKS scholars who fail to achieve at least TOPIK Level 3 after their 1-year Korean language program cannot progress to their degree program and forfeit the award.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Module 4: Verified South Korean Universities */}
      {universities.length > 0 && (
        <Section
          id="korea-universities"
          tone="sage"
          title="Verified South Korean universities in the EduExpress directory."
          intro="Compare GKS partner universities and IEQAS-accredited Korean institutions offering generous merit tuition waivers."
          action={
            <Link href="/universities?country=south-korea" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse all South Korea universities <ArrowRight size={16} />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">{uni.city || 'South Korea'}</span>
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
              BDT 0 File-Opening Charge · Written Coverage &amp; Renewal Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              We never sell fake scholarship guarantees. You receive an itemized <strong>ClearCost Sheet</strong> and <strong>EduFit Decision Report</strong> comparing your GKS, BK21 Professor Lab, and university merit tuition waiver options with BDT 0 upfront file-opening fees.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/study-in-south-korea-from-bangladesh" className="ed-btn ed-btn-signal min-h-[48px] px-7 text-sm">
                South Korea Study Pillar Guide <ArrowRight size={16} />
              </Link>
              <Link href="/south-korea-study-cost-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                South Korea Cost Breakdown
              </Link>
              <Link href="/south-korea-student-visa-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] border-white text-white hover:bg-white/10 px-7 text-sm">
                South Korea D-2 Visa Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: FAQs */}
      <FaqBlock
        items={KOREA_SCHOLARSHIP_FAQS}
        title="Frequently asked questions about South Korea scholarships."
        tone="white"
      />

      {/* Module 7: Official Sources, Reviewer & Disclaimer */}
      <Section id="sources" tone="sage" title="Official Korean scholarship authorities &amp; editorial review.">
        <div className="grid gap-4 sm:grid-cols-2">
          {KOREA_SCHOLARSHIP_SOURCES.map((source) => (
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
            <strong>Editorial &amp; Compliance Review:</strong> Reviewed by <strong>Abdullah Al Rakib</strong> (Founder &amp; CEO, EduExpress International) and the Senior Counseling Desk at Evergreen Latif, House 12/1, Road 4/A, Dhanmondi, Dhaka 1209. Verified against NIIED Global Korea Scholarship (GKS) application guidelines, National Research Foundation (BK21) rules, and Korean Embassy Dhaka notices on <time dateTime="2026-11-27" className="font-bold text-petrol-800">27 November 2026</time>.
          </p>
          <p className="mt-2 text-amber-900">
            <strong>Mandatory Standard Disclaimer:</strong> EduExpress International provides admission and scholarship-application guidance under written service terms. Final nomination, admission, GKS or university scholarship award, and D-2 visa decisions rest solely with NIIED, the respective Korean universities, and the Embassy of the Republic of Korea in Dhaka.
          </p>
        </div>
      </Section>

      {/* Module 8: Assessment Form */}
      <section className="bg-white py-14">
        <div className={kit.wrap}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">GKS, BK21 &amp; Merit Waiver Audit</span>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-petrol-800">Check Your South Korea Scholarship Eligibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your GPA, IELTS/TOPIK status, and target field. Our Dhanmondi team will evaluate your GKS University Track, BK21 lab, and merit waiver eligibility within one working day.
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

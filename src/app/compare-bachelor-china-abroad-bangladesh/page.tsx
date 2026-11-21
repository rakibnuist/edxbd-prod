import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Building2, Cpu, Globe2 } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import {
  FitVsReconsiderGrid,
  LivingCostSeparationNotice,
  PathwayCrossLinks,
  PathwayGovernanceSection,
} from '@/components/pathways/PathwaySharedBlocks';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import {
  BANGLADESH_PRIVATE_UNIVERSITIES,
  COMPARISON_HUB_SOURCES,
  PATHWAY_LAST_UPDATED_ISO,
  PATHWAY_LAST_UPDATED_LABEL,
  UNIFIED_BACHELOR_WIN_MATRIX,
  WESTERN_BENCHMARKS,
  getTopChinaScholarshipUniversities,
} from '@/lib/pathway-comparison';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/compare-bachelor-china-abroad-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'China Bachelor vs UK, USA, Australia & Dhaka | EduExpress',
    description:
      'Compare top-ranked Chinese universities and university scholarships against UK, USA, Australia, New Zealand, and Dhaka Category-A private universities.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china', 'Compare China Bachelor degrees against UK, USA, Australia, and Dhaka private universities'),
  });
}

const CHINA_ADVANTAGES = [
  {
    icon: Award,
    title: 'Top Global & Engineering Rankings',
    body: 'China hosts global top-100 to top-650 research universities (Times Higher Education, QS, and ShanghaiRanking) backed by national Double First-Class, Project 985, and Project 211 funding.',
  },
  {
    icon: Building2,
    title: 'Modern Residential Campus Facilities',
    body: 'Comprehensive campuses include smart engineering labs, supercomputing centers, university libraries, sports complexes, and purpose-built international dormitories within walkable university cities.',
  },
  {
    icon: Cpu,
    title: 'Strength in Technology, Engineering & Business',
    body: 'English-taught undergraduate tracks focus on AI, Computer Science, Integrated Circuits, Mechanical/Civil Engineering, Robotics, and International Trade—inside one of the world’s largest tech and supply-chain economies.',
  },
  {
    icon: Globe2,
    title: 'Global Master’s & Career Mobility After Graduation',
    body: 'Graduates holding an MoE-accredited 4-year Chinese Bachelor’s degree remain eligible to apply for Master’s or PhD programs in the UK, USA, Australia, New Zealand, or Europe—or pursue STEM/industry roles.',
  },
] as const;

const faqs = [
  {
    question: 'Why does this guide highlight University Scholarships in China instead of CSC Type A?',
    answer:
      'For English-taught Bachelor’s programs in China, bilateral CSC Type A seats are limited and highly competitive. By contrast, dozens of top-ranked Chinese public universities offer University Entrance Scholarships, Presidential Awards, Belt & Road Scholarships, and Provincial/Municipal waivers directly through university admissions—often covering 50% to 100% of tuition in Year 1 or across four years based on high school/A-Level performance and annual GPA review.',
  },
  {
    question: 'How do top Chinese universities compare with Category-A private universities in Dhaka like NSU, EWU, or AIUB?',
    answer:
      'In Dhaka, a 4-year BBA or CSE degree at NSU, EWU, or AIUB costs roughly BDT 9.17 lakh to BDT 14.30 lakh in tuition and institutional fees alone. For comparable or lower net tuition under university scholarships, qualified Bangladeshi A-Level and HSC graduates can study at globally ranked Chinese universities (many placed in ShanghaiRanking/QS World top 100–650) with full residential campuses, national research laboratories, and international peer cohorts.',
  },
  {
    question: 'Are living expenses included inside the tuition comparison tables on this page?',
    answer:
      'No. In line with transparent financial planning, tuition and institutional fees are separated strictly from monthly living costs (food, transit, personal expenses) in every comparison. That prevents high overseas living costs or personal Dhaka expenses from distorting pure educational cost comparisons.',
  },
  {
    question: 'Can a student who completes a Bachelor’s degree in China study Master’s in the UK, USA, Australia, or New Zealand later?',
    answer:
      'Yes. Accredited 4-year Bachelor’s degrees from MoE-recognized Chinese universities are accepted globally for postgraduate admission. Many graduates use China for an affordable, top-ranked undergraduate STEM or business foundation and then apply to the UK, USA, Australia, New Zealand, or Europe for Master’s or PhD study.',
  },
  {
    question: 'Does EduExpress process direct Bachelor applications for the USA, Australia, and New Zealand?',
    answer:
      'EduExpress actively provides counseling and application support for China, Malaysia, the UK, and our listed European destinations. Figures for the USA, Australia, and New Zealand are included as verified cost benchmarks—and as targets for Malaysia 1+2 / 2+1 credit-transfer routes or post-Bachelor Master’s applications.',
  },
  {
    question: 'What are EduExpress’s service terms for Chinese Bachelor admissions?',
    answer:
      'No file opening charge. No EduExpress service fee before China visa approval. Any university application fee, CSCA entrance test fee, medical checkup, notarization, embassy visa fee, or university deposit required earlier is itemized in writing before you proceed.',
  },
];

export default async function CompareBachelorChinaAbroadPage() {
  const topChinaUniversities = await getTopChinaScholarshipUniversities(10);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: PATHWAY_LAST_UPDATED_ISO,
        name: 'China Top-Ranked Bachelor vs UK, USA, Australia, New Zealand & Dhaka Private Universities',
        description:
          'Side-by-side comparison of education quality, rankings, campus facilities, and university-scholarship tuition in China versus Western destinations and Bangladesh Category-A private universities.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(COMPARISON_HUB_SOURCES),
      },
      ...(topChinaUniversities.length
        ? [
            {
              '@type': 'ItemList',
              '@id': `${canonical}#ranked-china-universities`,
              name: 'Top-Ranked Chinese Universities with English-Taught Bachelor Programs & University Scholarships',
              numberOfItems: topChinaUniversities.length,
              itemListElement: topChinaUniversities.map((uni, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: uni.name,
                url: `${SITE}/universities/${uni.slug}`,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Find Education', path: '/find-education' },
          { name: 'Compare Bachelor Pathways' },
        ]}
        eyebrow="Post-A-Level & O-Level Decision Hub · Quality, Rankings & University Scholarships"
        title="Compare top-ranked China Bachelors vs. UK, USA, Australia & Dhaka."
        lead="For Bangladeshi A-Level and HSC graduates comparing direct Western tuition, local Category-A private universities, and globally ranked Chinese campuses with university scholarships—evaluated by education quality, facilities, and separated costs."
        reviewed={PATHWAY_LAST_UPDATED_LABEL}
        actions={
          <>
            <Link href="#compare-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get My Side-by-Side Cost Sheet <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore China Hub
            </Link>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/destinations/china-hero.webp"
                alt="Top-ranked Chinese university research campus for Bangladeshi Bachelor applicants"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4 text-[13px] font-semibold text-petrol-800">
              <span>Live Rankings &amp; University Scholarships Dataset</span>
              <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                Living costs separated
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar
        destination="China"
        universities={topChinaUniversities.length || undefined}
        feeNote="BDT 0 service fee before China visa approval"
      />

      {/* Direct Answer + Unified 4-Way "Why You Win" Matrix */}
      <Section
        id="why-you-win"
        title="The Verdict: Why Students Win With Top-Ranked China & Malaysia Pathways"
        intro="Bangladeshi A-Level and HSC graduates often feel forced to choose between paying BDT 54 lakh–3.2+ crore in Western tuition (UK, USA, Australia, New Zealand) or paying BDT 9.17–14.30 lakh at a local Dhaka private commuter campus. Comparing global rankings, campus facilities, separated academic tuition, and post-Bachelor Master’s mobility side by side proves how students win in both education quality and capital preserved."
      >
        <LivingCostSeparationNotice
          summary="Every comparison table on this page keeps Tuition & Institutional Fees strictly separated from Personal Living Expenses (food, transit, personal spending). Chinese university fees remain in CNY/RMB without assuming a fixed BDT exchange rate."
        />

        <div className="mt-8 overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[920px] text-left text-[13.5px] leading-6">
            <caption className="sr-only">
              Four-way comparison proving how China and Malaysia outperform Dhaka private universities and expensive Western tuition
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Decision Criterion</th>
                <th scope="col" className="p-4 font-bold text-lime">China Top-Ranked + University Scholarship</th>
                <th scope="col" className="p-4 font-bold">Malaysia Branch / Dual Degree</th>
                <th scope="col" className="p-4 font-bold">Dhaka Category-A Private (NSU, EWU, AIUB)</th>
                <th scope="col" className="p-4 font-bold">Direct UK / USA / Australia / NZ</th>
                <th scope="col" className="p-4 font-bold">Why Students Win</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {UNIFIED_BACHELOR_WIN_MATRIX.map(row => (
                <tr key={row.factor}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.factor}</th>
                  <td className="bg-lime-pale/30 p-4 align-top font-semibold text-emerald-950">{row.chinaTrack}</td>
                  <td className="p-4 align-top">{row.malaysiaTrack}</td>
                  <td className="p-4 align-top">{row.dhakaPrivateTrack}</td>
                  <td className="p-4 align-top">{row.westernTrack}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.winnerVerdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Priority 1: Quality, Rankings, Facilities & 2-Step Capital-Preservation Win */}
      <Section
        id="quality-and-facilities"
        tone="sage"
        title="Priority #1: University Rankings, Campus Facilities & Post-Bachelor Strategy"
        intro="Before looking at discounts, families should verify institutional ranking, laboratory quality, residential life, and where the Bachelor degree can take a graduate next."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHINA_ADVANTAGES.map(card => (
            <div key={card.title} className={kit.card}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-canvas-soft text-petrol-800">
                <card.icon size={22} className="text-petrol-800" aria-hidden="true" />
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{card.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
            <span className={kit.badge}>Win Proof #1 · Campus Scale</span>
            <h3 className="mt-3 text-[18px] font-bold text-petrol-800">Research Town vs. Commuter Building</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              National Project 985, Project 211, and Double First-Class campuses provide dedicated robotics/AI/engineering labs, libraries, sports facilities, and gated international dorms (CNY 1,300–11,000/yr)—facilities urban Dhaka private campuses cannot match at comparable tuition.
            </p>
          </div>
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
            <span className={kit.badge}>Win Proof #2 · Direct University Awards</span>
            <h3 className="mt-3 text-[18px] font-bold text-petrol-800">University Scholarships Without CSC Type A Bottlenecks</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">
              Instead of relying on scarce CSC Type A bilateral quotas for English-taught Bachelors, applicants use Entrance, Presidential, Belt &amp; Road, and Provincial university scholarships directly—lowering annual tuition to CNY 0–25,000/yr where awarded.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-700/20 bg-petrol-800 p-6 text-white shadow-sm">
            <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[12px] font-bold text-petrol-800">
              Win Proof #3 · 2-Step Global Masterplan
            </span>
            <h3 className="mt-3 text-[18px] font-bold text-lime">China Bachelor → Western Master’s</h3>
            <p className="mt-2 text-[14.5px] leading-6 text-white/90">
              Save BDT 50 lakh–2+ crore on undergraduate tuition by completing an accredited English-taught Bachelor in China, then apply to a 1-year UK Master’s or US/Australian/New Zealand Master’s—graduating with both credentials for far less than a Western Bachelor alone.
            </p>
          </div>
        </div>
      </Section>

      {/* Live Dataset Showcase: Top Ranked Chinese Universities with University Scholarships */}
      <Section
        id="china-university-scholarships"
        tone="white"
        title="Top-Ranked Chinese Universities with University Scholarships (Live Catalog)"
        intro="Pulled directly from EduExpress’s verified university dataset: English-taught Bachelor options paired with University, Entrance, Belt & Road, or Provincial scholarships—no CSC Type A reliance required."
        action={
          <Link href="/programs" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Browse All China Programs <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        {topChinaUniversities.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <table className="w-full min-w-[820px] text-left text-[14px] leading-6">
              <caption className="sr-only">
                Top-ranked Chinese universities with English-taught Bachelor programs and university scholarships
              </caption>
              <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
                <tr>
                  <th scope="col" className="p-4 font-bold">University &amp; City</th>
                  <th scope="col" className="p-4 font-bold">Verified Global / National Rank</th>
                  <th scope="col" className="p-4 font-bold">English Bachelor Majors (Sample)</th>
                  <th scope="col" className="p-4 font-bold">Recorded Tuition (CNY)</th>
                  <th scope="col" className="p-4 font-bold">University / Regional Scholarship</th>
                  <th scope="col" className="p-4 font-bold">Hostel Fee (No Living)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft text-ink-soft">
                {topChinaUniversities.map(uni => (
                  <tr key={uni.slug}>
                    <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                      <Link href={`/universities/${uni.slug}`} className="hover:underline">
                        {uni.name}
                      </Link>
                      <span className="mt-0.5 block text-[12.5px] font-medium text-ink-soft">{uni.city}, China</span>
                    </th>
                    <td className="p-4 align-top font-semibold text-emerald-900">
                      {uni.worldRankLabel && <span className="block">{uni.worldRankLabel}</span>}
                      {uni.nationalRankLabel && (
                        <span className="block text-[12.5px] text-petrol-800">{uni.nationalRankLabel}</span>
                      )}
                    </td>
                    <td className="p-4 align-top">{uni.englishPrograms.join(' · ')}</td>
                    <td className="p-4 align-top font-semibold text-petrol-800">{uni.bachelorTuition}</td>
                    <td className="p-4 align-top">{uni.universityScholarship}</td>
                    <td className="p-4 align-top">{uni.hostelFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={kit.card}>
            <p className={kit.body}>
              Explore our complete verified Chinese university directory and university-level scholarship catalog on{' '}
              <Link href="/china-universities" className={kit.link}>
                /china-universities
              </Link>
              .
            </p>
          </div>
        )}
        <p className="mt-4 text-[13.5px] leading-6 text-ink-soft">
          *Scholarship awards depend on academic profile, quota availability, and annual renewal rules set by each university. Click any university name to inspect exact program fees, required documents, and primary official sources.
        </p>
      </Section>

      {/* Module 2: Comparison vs Bangladesh Category-A Private Universities */}
      <Section
        id="dhaka-private-comparison"
        tone="sage"
        title="China Top-Ranked Universities vs. Bangladesh Category-A Private Universities"
        intro="Many Bangladeshi A-Level graduates remain in Dhaka and enroll in Category-A private universities. Here is how 4-year academic tuition compares—keeping living expenses outside the total."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">
              Four-year tuition and institutional cost comparison for Bangladesh Category-A private universities
            </caption>
            <thead className="border-b border-canvas-soft bg-canvas-soft text-petrol-800">
              <tr>
                <th scope="col" className="p-4 font-bold">Dhaka Category-A Private University</th>
                <th scope="col" className="p-4 font-bold">4-Year BBA Academic Total (No Living)</th>
                <th scope="col" className="p-4 font-bold">4-Year CSE Academic Total (No Living)</th>
                <th scope="col" className="p-4 font-bold">Standing &amp; Living Separation Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {BANGLADESH_PRIVATE_UNIVERSITIES.map(uni => (
                <tr key={uni.name}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    {uni.name}
                    <span className="mt-0.5 block text-[12.5px] font-medium text-ink-soft">{uni.category}</span>
                  </th>
                  <td className="p-4 align-top font-semibold text-petrol-800">{uni.bbaAcademicTotal}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{uni.cseAcademicTotal}</td>
                  <td className="p-4 align-top">
                    <span className="block">{uni.recognitionNote}</span>
                    <span className="mt-1 block text-[13px] text-ink-soft">{uni.livingNote}</span>
                  </td>
                </tr>
              ))}
              <tr className="bg-lime-pale/45">
                <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                  China Ranked University (University Scholarship Track)
                  <span className="mt-0.5 block text-[12.5px] font-medium text-emerald-900">
                    e.g. Sichuan, HIT, SCUT, Xidian, JUST, HBUT
                  </span>
                </th>
                <td colSpan={2} className="p-4 align-top font-semibold text-emerald-900">
                  Tuition ranges from CNY 0 (100% entrance/merit waiver where awarded) to CNY 4,250 – 25,000/yr before or after partial university awards; hostel typically CNY 1,300 – 11,000/yr (separate from food/living).
                </td>
                <td className="p-4 align-top">
                  MoE-recognized public research universities ranked in ShanghaiRanking, QS, and THE top global brackets—with full residential campuses and dedicated labs.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 3: Comparison vs UK, USA, Australia & New Zealand */}
      <Section
        id="western-destinations"
        tone="white"
        title="China & Malaysia vs. Direct UK, USA, Australia & New Zealand"
        intro="Compare direct annual tuition against separated annual living budgets across popular post-A-Level destinations. Note which destinations EduExpress actively services vs. benchmarks."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-[14px] leading-6">
            <caption className="sr-only">
              Annual undergraduate tuition separated from living costs across UK, USA, Australia, and New Zealand
            </caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Destination &amp; Service Scope</th>
                <th scope="col" className="p-4 font-bold">Bachelor Duration</th>
                <th scope="col" className="p-4 font-bold">Annual Tuition Only (No Living)</th>
                <th scope="col" className="p-4 font-bold">Full-Degree Tuition Range</th>
                <th scope="col" className="p-4 font-bold">Annual Living Cost (Separated)</th>
                <th scope="col" className="p-4 font-bold">Entry &amp; Pathway Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {WESTERN_BENCHMARKS.map(row => (
                <tr key={row.country}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    {row.country}
                    <span className="mt-1 inline-block rounded-full bg-canvas-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-petrol-800">
                      {row.eduExpressStatus}
                    </span>
                  </th>
                  <td className="p-4 align-top">{row.degreeDuration}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.annualTuitionOnly}</td>
                  <td className="p-4 align-top">{row.fourOrThreeYearTuition}</td>
                  <td className="p-4 align-top font-medium text-amber-900">{row.annualLivingSeparated}</td>
                  <td className="p-4 align-top">{row.entryNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
            <h3 className={kit.h3}>Malaysia Branch Campus &amp; Transfer Alternative</h3>
            <p className={`mt-2 ${kit.body}`}>
              Students wanting a UK or Australian degree after O-Level or A-Level can study at Monash University Malaysia, University of Nottingham Malaysia, or Heriot-Watt University Malaysia—or take a UK dual degree at Sunway, Taylor’s, or APU—at roughly one-third of Western tuition (with BDT 0 EduExpress fee).
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/study-in-malaysia-from-bangladesh" className={kit.link}>
                Explore Malaysia Hub <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/study-in-malaysia-after-o-level" className={kit.link}>
                After O-Level Malaysia Guide <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
            <h3 className={kit.h3}>Bachelor in China → Master’s Anywhere</h3>
            <p className={`mt-2 ${kit.body}`}>
              Completing a top-ranked English-taught Bachelor’s degree in China preserves family capital during undergraduate study, positioning graduates to pursue competitive Master’s or PhD scholarships in the UK, USA, Australia, New Zealand, or Europe—or STEM careers under schemes like China’s K-Visa.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/updates/china-k-visa" className={kit.link}>
                Read China K-Visa Update <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/study-in-uk-from-bangladesh" className={kit.link}>
                Explore UK Options <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 4: Fit vs Reconsider */}
      <Section
        id="decision-matrix"
        tone="sage"
        title="How to Decide Between These Four Bachelor Tracks"
        intro="Use verified academic fit, institutional facilities, and separated cost schedules rather than hearsay."
      >
        <FitVsReconsiderGrid
          fitTitle="When a Top-Ranked China Bachelor Fits Best"
          fitItems={[
            {
              label: 'A-Level / HSC students seeking global top-500 STEM or Business education',
              detail: 'Strong fit when you want global rankings, major engineering labs, and international campus life without BDT 1.2–3.0 crore Western tuition bills.',
            },
            {
              label: 'Families comparing NSU / EWU / AIUB fees against international exposure',
              detail: 'With university merit scholarships, annual net tuition in China can sit at or below Dhaka private-university credit totals while offering global degree mobility.',
            },
            {
              label: 'Graduates planning Western Master’s study later',
              detail: 'Saving undergraduate tuition capital makes funding or winning scholarships for a 1-year UK or 2-year Western Master’s far more realistic.',
            },
          ]}
          reconsiderTitle="When Another Option Fits Better"
          reconsiderItems={[
            {
              label: 'Immediate post-study migration priority without employer sponsorship',
              detail: 'China does not offer automatic PR after Bachelor graduation; students prioritizing Western post-study work routes should evaluate the UK Graduate Route or Western destinations directly.',
            },
            {
              label: 'Students expecting full part-time wages to fund tuition',
              detail: 'China and Malaysia both restrict student term-time employment; tuition and separated living costs must be budgeted realistically in advance.',
            },
            {
              label: 'O-Level graduates skipping A-Levels',
              detail: 'Start with our O-Level pathway pages for Malaysia (1-yr Foundation / 2-yr Diploma) or China (3+2 Diploma-to-Bachelor) rather than direct 4-year Bachelor admission.',
            },
          ]}
        />
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={faqs} tone="white" title="Frequently Asked Questions: Comparing Global Bachelor Pathways" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="sage"
        extraLinks={[
          { label: '1-on-1: Bangladesh vs. China Study', href: '/bangladesh-vs-china-bachelor-study' },
          { label: '1-on-1: Bangladesh vs. Abroad Countries', href: '/bangladesh-vs-study-abroad-countries' },
          { label: 'China Study Data & Cost Report', href: '/china-study-report-bangladesh' },
          { label: 'Compare China Programs Side by Side', href: '/compare-costs' },
          { label: 'Compare All 12 EduExpress Destinations', href: '/compare-study-destinations' },
          { label: 'Guide for Parents in Bangladesh', href: '/for-parents' },
        ]}
      />

      {/* Governance & Sources */}
      <PathwayGovernanceSection
        tone="white"
        authorName="Md Tauhidul Islam Nur"
        authorRole="Country Manager, China (University Programs & Rankings)"
        lastVerified="21 November 2026"
        nextReview="21 February 2027"
        whatMayChange={[
          'Chinese university scholarship quotas, freshman waiver cutoffs, and annual GPA renewal thresholds update each admission cycle.',
          'NSU, EWU, and AIUB per-credit tuition rates and semester activity fees are updated periodically by each university.',
          'UK Graduate Route duration (moving to 18 months for most non-PhD applicants from January 2027), Australian AUD 29,710 living threshold, and FX rates change by regulation and market.',
          'University ranking editions (Times Higher Education, QS, ShanghaiRanking) refresh annually; check each profile’s source URL.',
        ]}
        sources={COMPARISON_HUB_SOURCES}
      />

      {/* Assessment CTA */}
      <Section
        id="compare-assessment"
        tone="sage"
        title="Get a Personalized China vs. Malaysia vs. UK Written Comparison"
        intro="Share your A-Level, HSC, or O-Level results and preferred major. An EduExpress counselor prepares an itemized EduFit comparison and ClearCost Sheet within one working day."
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm sm:p-10">
          <EducationFitAssessment />
        </div>
      </Section>

      <CtaBand
        title="Compare before you commit."
        text="Bring your O-Level, A-Level, or HSC transcripts to our Dhanmondi office—or book a free online review with written university and scholarship proof."
        assessmentHref="#compare-assessment"
      />
    </article>
  );
}

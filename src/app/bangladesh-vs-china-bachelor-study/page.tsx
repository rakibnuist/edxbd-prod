import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Building2, Cpu, Globe2, ShieldCheck } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import {
  BookletDownloadBanner,
  FitVsReconsiderGrid,
  LivingCostSeparationNotice,
  PathwayCrossLinks,
  PathwayGovernanceSection,
  WinningAdvantageGrid,
} from '@/components/pathways/PathwaySharedBlocks';
import BachelorComparisonInteractiveWorkbench from '@/components/pathways/BachelorComparisonInteractiveWorkbench';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import {
  BANGLADESH_PRIVATE_UNIVERSITIES,
  BD_VS_CHINA_PROOF_ROWS,
  BD_VS_CHINA_WIN_CARDS,
  COMPARISON_HUB_SOURCES,
  PATHWAY_LAST_UPDATED_ISO,
  PATHWAY_LAST_UPDATED_LABEL,
  getTopChinaScholarshipUniversities,
} from '@/lib/pathway-comparison';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bangladesh-vs-china-bachelor-study';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const VISA_FIRST_TERMS =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

export async function generateMetadata() {
  return pageMetadata({
    title: 'Bangladesh vs China University Study 2027 | EduExpress',
    description:
      'Compare Dhaka Category-A private universities (NSU, EWU, AIUB) against top-ranked Chinese universities with university scholarships and separated living costs.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('china', 'Bangladesh private universities vs top-ranked Chinese universities — EduExpress International'),
  });
}

const CHINA_CAMPUS_PILLARS = [
  {
    icon: Award,
    title: 'Global Rankings vs. Local Recognition',
    body: 'Instead of domestic-only private rankings, top Chinese public universities sit in Times Higher Education, QS, and ShanghaiRanking global top 100–650 brackets.',
  },
  {
    icon: Building2,
    title: 'University Towns & Dormitories',
    body: 'Full residential campuses with national laboratories, libraries, and international dorms (CNY 1,300–11,000/yr) eliminate daily Dhaka traffic and commuter fatigue.',
  },
  {
    icon: Cpu,
    title: 'Tech, Engineering & Business Edge',
    body: 'English-taught AI, Software, Integrated Circuits, Civil/Mechanical Engineering, and International Business programs place students directly inside global tech supply chains.',
  },
  {
    icon: Globe2,
    title: 'Global Master’s After Graduation',
    body: 'An MoE-accredited 4-year Chinese Bachelor’s degree qualifies graduates for Master’s or PhD admission across the UK, USA, Australia, New Zealand, and Europe.',
  },
] as const;

const faqs = [
  {
    question: 'Why compare Dhaka Category-A private universities like NSU, EWU, and AIUB against China?',
    answer:
      'Thousands of Bangladeshi A-Level and HSC graduates pay BDT 9.17 lakh to BDT 14.30 lakh in tuition and institutional fees at Category-A private universities in Dhaka (such as EWU, NSU, or AIUB) for a 4-year BBA or CSE degree. At comparable or lower net academic tuition under Chinese university scholarships, qualified students can attend globally ranked public research universities in China with residential campuses and international research labs.',
  },
  {
    question: 'Are living expenses included inside the tuition comparison?',
    answer:
      'No. In every table on this page, Tuition and Mandatory Academic Fees are separated strictly from Personal Living Expenses (meals, transit, personal spending). Chinese university charges remain in CNY/RMB so families can convert at live bank rates without hidden assumptions.',
  },
  {
    question: 'Why are University Scholarships prioritized here over CSC Type A?',
    answer:
      'Bilateral CSC Type A seats for English-taught Bachelor’s degrees are scarce and highly competitive. By contrast, top Chinese public universities offer University Entrance, Presidential, Belt & Road, and Provincial scholarships directly—cutting Bachelor tuition by 50% to 100% (or to CNY 4,250–18,000/yr) subject to academic profile and annual GPA review.',
  },
  {
    question: 'What campus facilities do Chinese universities offer compared with Dhaka private universities?',
    answer:
      'Major Chinese public universities operate self-contained university towns featuring multi-story research libraries, national key engineering and AI laboratories, indoor sports complexes, campus canteens (often with halal options), and purpose-built international student dormitories.',
  },
  {
    question: 'Can a graduate with a Chinese Bachelor’s degree move to the UK, USA, Australia, or Europe for a Master’s?',
    answer:
      'Yes. Degrees from MoE-recognized Chinese universities are recognized internationally for postgraduate admission. Saving substantial tuition during undergraduate study makes funding a 1-year UK Master’s or Western postgraduate program much more achievable.',
  },
  {
    question: 'What does EduExpress charge for Chinese Bachelor’s admissions?',
    answer:
      'No file opening charge. No EduExpress service fee before China visa approval. University application fees, CSCA entrance exam fees (if applicable), medical checkups, notarization, embassy visa fees, or refundable deposits are itemized separately in writing before you proceed.',
  },
];

export default async function BangladeshVsChinaBachelorPage() {
  const topChinaUniversities = await getTopChinaScholarshipUniversities(10);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        headline: 'Bangladesh vs China Bachelor Study 2027: Dhaka Private Universities vs Ranked China',
        name: 'Study in Bangladesh vs China: Rankings, Campus Facilities & University Scholarships',
        description:
          'One-to-one comparison of Dhaka Category-A private universities (NSU, EWU, AIUB) against top-ranked Chinese universities with University Scholarships.',
        image: `${SITE}/og/china.jpg`,
        primaryImageOfPage: primaryImageOfPageSchema('/og/china.jpg'),
        datePublished: `${PATHWAY_LAST_UPDATED_ISO}T00:00:00Z`,
        dateModified: `${PATHWAY_LAST_UPDATED_ISO}T00:00:00Z`,
        inLanguage: 'en-BD',
        author: { '@type': 'Person', name: 'Afsana Meme', jobTitle: 'Senior Consultant — China Admissions & Scholarships' },
        reviewedBy: { '@type': 'Person', name: 'Abdullah Al Rakib', jobTitle: 'Founder and CEO' },
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(COMPARISON_HUB_SOURCES),
      },
      ...(topChinaUniversities.length
        ? [
            {
              '@type': 'ItemList',
              '@id': `${canonical}#china-vs-bd-universities`,
              name: 'Top-Ranked Chinese Universities With University Scholarships',
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
          { name: 'Study in China', path: '/study-in-china-from-bangladesh' },
          { name: 'Bangladesh vs China' },
        ]}
        eyebrow="1-on-1 Comparison · Dhaka Private vs. China Top-Ranked · Visa-First Policy"
        title="Bangladesh vs. China for a Bachelor’s degree."
        lead="For HSC, Alim, and A-Level graduates: why settle for a local commuter degree when the same or lower academic tuition can earn a Bachelor’s degree at a globally ranked Chinese research university—with university scholarships, residential labs, and global Master’s mobility."
        reviewed={PATHWAY_LAST_UPDATED_LABEL}
        actions={
          <>
            <Link href="#bd-china-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Compare My Profile in China <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore China Hub
            </Link>
          </>
        }
        aside={
          <figure className="anim-rise relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-petrol-800">
            <Image
              src="/images/destinations/china-hero.webp"
              alt="Top-ranked Chinese university campus for Bangladeshi Bachelor applicants comparing Dhaka vs China"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 480px"
              className="object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-petrol-800 backdrop-blur-sm">
              <span>NSU / EWU / AIUB vs. Top-Ranked China</span>
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

      {/* Direct Answer */}
      <Section
        id="direct-answer"
        title="How Bangladeshi students win by choosing China over a Dhaka private university"
        intro="For an A-Level, HSC, or Alim graduate in Bangladesh, four years of BBA or CSE tuition and institutional fees at Category-A private universities like NSU, EWU, or AIUB already cost BDT 9.17 lakh to BDT 14.30 lakh—without international campus housing or global top-500 rankings. Through University, Entrance, Belt & Road, and Provincial scholarships at Chinese public research universities, qualified students gain global top-100 to top-650 rankings, modern residential engineering and AI labs, and equal or lower tuition—while keeping Western Master’s doors wide open."
      >
        <LivingCostSeparationNotice
          summary="All comparisons below strictly separate Academic Tuition & Institutional Fees from Personal Living Expenses (meals, local transit, personal allowance). Chinese fees are kept in CNY/RMB so families convert at live bank TT rates."
        />
        <div className="mt-8">
          <BachelorComparisonInteractiveWorkbench mode="bd-vs-china" assessmentHref="#bd-china-assessment" />
        </div>
        <div className="mt-6">
          <BookletDownloadBanner
            tone="white"
            contextNote="Share a printable 10-page September 2027 Pathway Booklet with your family—comparing NSU/EWU/AIUB against QS World 2027 Chinese & Malaysian universities."
          />
        </div>
      </Section>

      {/* Win Scorecard */}
      <WinningAdvantageGrid
        id="why-you-win"
        tone="sage"
        title="Three Ways Students Win in China vs. Local Dhaka Universities"
        intro="Evaluate ranking mobility, separated 4-year academic tuition, and residential research infrastructure side by side."
        cards={BD_VS_CHINA_WIN_CARDS}
      />

      {/* 1-on-1 Proof Table */}
      <Section
        id="one-on-one-proof"
        title="Head-to-Head Proof: Bangladesh Category-A Private vs. Ranked China"
        intro="Direct point-by-point evidence showing where the educational and financial advantages lie."
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft bg-white">
          <table className="w-full min-w-[780px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">One-to-one comparison between Dhaka Category-A private universities and China ranked universities</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Comparison Dimension</th>
                <th scope="col" className="p-4 font-bold">Bangladesh Category-A Private (NSU, EWU, AIUB)</th>
                <th scope="col" className="p-4 font-bold text-lime">China Top-Ranked + University Scholarship</th>
                <th scope="col" className="p-4 font-bold">Why the Student Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {BD_VS_CHINA_PROOF_ROWS.map(row => (
                <tr key={row.criterion}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.criterion}</th>
                  <td className="p-4 align-top">{row.bangladeshPrivate}</td>
                  <td className="bg-lime-pale/30 p-4 align-top font-semibold text-lime-deep">{row.chinaRanked}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.winReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div data-anim="stagger" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHINA_CAMPUS_PILLARS.map(card => (
            <div key={card.title} className={kit.cardSage}>
              <span className={kit.icon}>
                <card.icon size={22} aria-hidden="true" />
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{card.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Dhaka Private Fee Baseline + Live Ranked China Universities */}
      <Section
        id="fee-and-ranking-data"
        tone="sage"
        title="Recorded Fees: Dhaka Category-A Private vs. Ranked Chinese Universities"
        intro="Inspect verified 4-year Dhaka private university fee schedules alongside live Chinese university rankings and non-CSC university scholarships from our catalog."
      >
        <div className="space-y-8">
          <div className="overflow-x-auto rounded-3xl bg-white">
            <table className="w-full min-w-[740px] text-left text-[14.5px] leading-6">
              <caption className="sr-only">Dhaka Category-A private university four-year tuition and fee totals</caption>
              <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
                <tr>
                  <th scope="col" className="p-4 font-bold">Dhaka Private University</th>
                  <th scope="col" className="p-4 font-bold">4-Year BBA Academic Total (No Living)</th>
                  <th scope="col" className="p-4 font-bold">4-Year CSE Academic Total (No Living)</th>
                  <th scope="col" className="p-4 font-bold">Living &amp; Structure Note</th>
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
                    <td className="p-4 align-top">{uni.livingNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topChinaUniversities.length > 0 && (
            <div className="overflow-x-auto rounded-3xl bg-white">
              <table className="w-full min-w-[820px] text-left text-[14px] leading-6">
                <caption className="sr-only">Top-ranked Chinese universities with University Scholarships from EduExpress catalog</caption>
                <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
                  <tr>
                    <th scope="col" className="p-4 font-bold">Chinese University &amp; City</th>
                    <th scope="col" className="p-4 font-bold">Verified Global / National Rank</th>
                    <th scope="col" className="p-4 font-bold">English Bachelor Majors</th>
                    <th scope="col" className="p-4 font-bold">Recorded Tuition (CNY)</th>
                    <th scope="col" className="p-4 font-bold text-lime">University / Regional Scholarship</th>
                    <th scope="col" className="p-4 font-bold">Campus Hostel (No Living)</th>
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
                      <td className="p-4 align-top font-semibold text-lime-deep">
                        {uni.worldRankLabel && <span className="block">{uni.worldRankLabel}</span>}
                        {uni.nationalRankLabel && (
                          <span className="block text-[12.5px] text-petrol-800">{uni.nationalRankLabel}</span>
                        )}
                      </td>
                      <td className="p-4 align-top">{uni.englishPrograms.join(' · ')}</td>
                      <td className="p-4 align-top font-semibold text-petrol-800">{uni.bachelorTuition}</td>
                      <td className="bg-lime-pale/30 p-4 align-top">{uni.universityScholarship}</td>
                      <td className="p-4 align-top">{uni.hostelFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={`mt-8 ${kit.cardDark} sm:p-8`}>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="flex items-start gap-2.5 text-[15.5px] leading-7 text-white/95">
                <ShieldCheck size={22} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                <span>{VISA_FIRST_TERMS}</span>
              </p>
            </div>
            <Link href="/china-visa-first-policy" className="ed-btn ed-btn-signal shrink-0 min-h-[48px] px-6">
              Read Visa-First Terms <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Fit vs Reconsider */}
      <Section
        id="fit-check"
        title="Who Wins Most From Choosing China Over Local Dhaka Study"
        intro="Objective guidance helps families choose the right academic fit."
      >
        <FitVsReconsiderGrid
          fitTitle="Ideal Fit for a Ranked Chinese Bachelor"
          fitItems={[
            {
              label: 'A-Level, HSC & Alim students comparing BDT 9–14L+ Dhaka fees',
              detail: 'Strong fit when you want global top-100–650 rankings, residential engineering labs, and international campus life instead of commuting in Dhaka.',
            },
            {
              label: 'STEM, AI, Robotics & International Trade candidates',
              detail: 'China’s tech and manufacturing ecosystem provides relevant laboratory scale, industrial exposure, and post-study STEM pathways like the K-Visa.',
            },
            {
              label: 'Graduates targeting UK, USA, Australia, or EU Master’s later',
              detail: 'An accredited Chinese Bachelor preserves family funds and builds an international transcript for top global Master’s admissions.',
            },
          ]}
          reconsiderTitle="When Staying in Dhaka May Fit Better"
          reconsiderItems={[
            {
              label: 'Students requiring full-time family care or local employment in Dhaka',
              detail: 'If living at home or immediately entering a Dhaka family business during classes is essential, a Dhaka campus offers physical proximity.',
            },
            {
              label: 'Applicants relying on off-campus jobs to pay daily bills',
              detail: 'Chinese X1 student visas restrict term-time paid employment; separated living budgets (~CNY 800–1,400+/month depending on city) must be planned ahead.',
            },
            {
              label: 'Students who have only finished SSC, Dakhil, or O-Level',
              detail: 'Start with our China 3+2 Diploma-to-Bachelor pathway (/study-in-china-after-o-level-ssc) rather than direct 4-year Bachelor admission.',
            },
          ]}
        />
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={faqs} tone="sage" title="Frequently Asked Questions: Bangladesh vs. China Study" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="white"
        extraLinks={[
          { label: 'Computer Science & AI in China Guide', href: '/updates/study-cs-ai-in-china-bangladesh' },
          { label: 'Business, Finance & Economics in China Guide', href: '/updates/study-business-finance-in-china-bangladesh' },
          { label: 'Polytechnic Diploma to Bachelor Transfer Guide', href: '/updates/china-diploma-to-bachelor-transfer-bangladesh' },
          { label: 'Engineering, Automation & Robotics in China Guide', href: '/updates/study-engineering-in-china-bangladesh' },
          { label: "Master's & PhD CSC Research Application Guide", href: '/updates/china-postgraduate-csc-scholarship-guide-bangladesh' },
          { label: 'Study in Bangladesh vs. Abroad (All Destinations)', href: '/bangladesh-vs-study-abroad-countries' },
          { label: 'China vs. UK, USA, Australia & Dhaka Hub', href: '/compare-bachelor-china-abroad-bangladesh' },
          { label: 'Bangladesh–China Study Data Report', href: '/china-study-report-bangladesh' },
          { label: 'China K-Visa for STEM Graduates', href: '/updates/china-k-visa' },
        ]}
      />

      {/* Governance */}
      <PathwayGovernanceSection
        tone="sage"
        authorName="Afsana Meme"
        authorRole="Senior Consultant (China Admissions & Scholarships)"
        lastVerified="25 November 2026"
        nextReview="25 February 2027"
        whatMayChange={[
          'Chinese university entrance and merit scholarship amounts depend on annual seat quotas and academic GPA renewal rules.',
          'NSU, EWU, and AIUB per-credit rates and semester fees are set independently by each university.',
          'CSCA undergraduate entrance requirements apply to designated Chinese scholarship and degree programs; verify per university.',
          'Living costs and exchange rates fluctuate by city and bank TT selling rates.',
        ]}
        sources={COMPARISON_HUB_SOURCES}
      />

      {/* Embedded Assessment */}
      <Section
        id="bd-china-assessment"
        title="Compare Your Dhaka Options Against Ranked Chinese Universities"
        intro="Share your A-Level, HSC, Alim, SSC, Dakhil, or O-Level results and intended major. Our counselors return an itemized shortlist of ranked Chinese universities and available University Scholarships within one working day."
      >
        <div className="mx-auto max-w-3xl">
          <EducationFitAssessment initialContext={{ country: 'china' }} />
        </div>
      </Section>

      <CtaBand
        title="Compare before you commit to a 4-year Dhaka fee."
        text="Bring your transcripts to our Dhanmondi desk or book online for a written comparison of Dhaka private tuition versus ranked Chinese universities."
        assessmentHref="#bd-china-assessment"
      />
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Clock, Globe2, GraduationCap } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import {
  FitVsReconsiderGrid,
  LivingCostSeparationNotice,
  PathwayCrossLinks,
  PathwayGovernanceSection,
  WinningAdvantageGrid,
} from '@/components/pathways/PathwaySharedBlocks';
import { citationJsonLd, primaryImageOfPageSchema } from '@/lib/json-ld';
import {
  BANGLADESH_A_LEVEL_TRACKS,
  MALAYSIA_O_LEVEL_SOURCES,
  MALAYSIA_O_LEVEL_WIN_CARDS,
  MALAYSIA_VS_A_LEVEL_WIN_ROWS,
  PATHWAY_LAST_UPDATED_ISO,
  PATHWAY_LAST_UPDATED_LABEL,
  getMalaysiaPathwayRecords,
} from '@/lib/pathway-comparison';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-malaysia-after-o-level';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Malaysia After O-Level 2027 | EduExpress',
    description:
      'Skip 2 years of A-Levels in Bangladesh: start a 1-year Foundation or 2-year Diploma in Malaysia after O-Level with MQA clarity and BDT 0 agency fee.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('malaysia', 'Study in Malaysia after O-Level from Bangladesh — EduExpress International'),
  });
}

const ENTRY_PATHS = [
  {
    level: '1-Year Foundation Program',
    oLevelRequirement: 'Minimum 5 Credits (Grade C / 4 or above) in O-Level or IGCSE',
    subjectRules: 'Business/Arts require Math & English; Science/Engineering/Computing require Math, English & relevant Sciences',
    tuitionStandard: 'RM 15,000 – RM 22,000 total (~BDT 4.05L – 5.94L)',
    tuitionBranch: 'RM 25,000 – RM 36,000 total (~BDT 6.75L – 9.72L) at Sunway, Taylor’s, Monash, or Nottingham',
    progression: 'Direct Year 1 Bachelor entry in Malaysia or progression into UK/Australian branch-campus degrees',
  },
  {
    level: '2 – 2.5 Year Diploma Program',
    oLevelRequirement: 'Minimum 3 Credits (Grade C / 4 or above) in O-Level or IGCSE',
    subjectRules: 'Includes Mathematics and relevant technical/commerce subjects depending on major',
    tuitionStandard: 'RM 18,000 – RM 35,000 / year (~BDT 4.86L – 9.45L / yr)',
    tuitionBranch: 'Total 2–2.5 yr Diploma tuition: ~RM 40,000 – RM 85,000 (~BDT 10.8L – 23.0L) depending on institution',
    progression: 'Industry-ready qualification OR credit transfer directly into Year 2 of a related Bachelor’s degree',
  },
] as const;

const GLOBAL_PROGRESSION_ROUTES = [
  {
    icon: Award,
    title: 'UK & Australian Branch Campuses in Malaysia',
    body: 'Monash University Malaysia (Australian Group of Eight), University of Nottingham Malaysia (UK Russell Group), and Heriot-Watt University Malaysia award the exact same graduation parchment as their home campuses at roughly one-third of mainland tuition.',
  },
  {
    icon: GraduationCap,
    title: 'UK Dual-Award Private Universities',
    body: 'Sunway University (dual degree with Lancaster University UK), Taylor’s University (UWE Bristol UK), and APU (De Montfort University UK) allow O-Level entrants to move from Foundation straight into dual-award British honours programs.',
  },
  {
    icon: Globe2,
    title: '1+2 & 2+1 Credit Transfers (UK, Australia, USA & NZ)',
    body: 'Students targeting a Western campus later can finish Foundation plus Year 1 or Year 2 in Malaysia under formal articulation agreements, then transfer credits to partner universities in the UK, Australia, New Zealand, or the USA.',
  },
] as const;

const faqs = [
  {
    question: 'Can Bangladeshi students really skip A-Levels and study in Malaysia right after O-Levels?',
    answer:
      'Yes. Under Malaysian Qualifications Agency (MQA) entry standards, Bangladeshi students who complete O-Level or IGCSE with at least 5 Credits (Grade C or above) can enter a 1-year Foundation program directly, and students with 3 Credits can enter a 2- to 2.5-year Diploma. Passing the Foundation or Diploma leads directly into a Malaysian, UK dual-award, or Australian branch-campus Bachelor’s degree without taking A-Levels in Bangladesh.',
  },
  {
    question: 'How much money and time does skipping A-Levels in Bangladesh save?',
    answer:
      'Completing A-Levels in Bangladesh requires 2 full years before university. Private/coaching candidates taking 3 subjects typically spend BDT 480,000 to BDT 735,000 in coaching, science practical labs, mocks, and British Council CAIE or Edexcel exam fees (inclusive of 15% VAT), while full-time Dhaka English-medium school students often spend BDT 750,000 to BDT 1,500,000+ in school tuition, admission, and exam fees. Starting a 1-year Foundation in Malaysia redirects those 2 years and A-Level fees directly toward a university pathway.',
  },
  {
    question: 'Are living costs included in the Malaysian Foundation and Diploma tuition figures?',
    answer:
      'No. Tuition totals on this page show academic tuition only. Monthly living costs in Malaysia (shared student housing, halal meals, local rail/bus transit, and SIM) are budgeted separately at RM 1,200 to RM 2,000 per month (~BDT 32,400 to BDT 54,000/month at 1 MYR ≈ 27 BDT), alongside official EMGS visa, medical insurance, and airfare charges.',
  },
  {
    question: 'What if a student is under 18 when arriving in Malaysia after O-Levels?',
    answer:
      'Many O-Level graduates apply at age 16 or 17. EMGS processes Student Passes for minors admitted to MQA-accredited Foundation or Diploma programs, and universities typically require a parent-signed under-18 consent form plus approved on-campus or university-managed accommodation until the student turns 18. EduExpress verifies each campus’s under-18 hostel and guardian policy in writing before application.',
  },
  {
    question: 'Can an O-Level student transfer to the UK, Australia, or USA after starting in Malaysia?',
    answer:
      'Yes, through structured credit-transfer or branch-campus pathways. Students at universities with formal articulation agreements (such as 1+2 or 2+1 twinning programs, or American Degree Transfer Programs) can transfer credits to partner campuses in the UK, Australia, New Zealand, or the USA, subject to meeting target GPA and destination visa requirements.',
  },
  {
    question: 'Does EduExpress charge a consultancy fee for Malaysia after O-Level?',
    answer:
      'No. EduExpress charges BDT 0 consultancy or file-opening service fee for partner Malaysian university counseling, offer letter follow-up, EMGS eVAL guidance, and Bangladesh Bank Student File documentation support. Official university registration fees, EMGS charges, and tuition are paid directly by the family.',
  },
];

export default async function StudyInMalaysiaAfterOLevelPage() {
  const malaysiaRecords = await getMalaysiaPathwayRecords();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: PATHWAY_LAST_UPDATED_ISO,
        name: 'Study in Malaysia After O-Level from Bangladesh: Foundation & Diploma Guide',
        description:
          'How Bangladeshi O-Level graduates start a 1-year Foundation or 2-year Diploma in Malaysia instead of spending 2 years on A-Levels.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/malaysia.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(MALAYSIA_O_LEVEL_SOURCES),
      },
      ...(malaysiaRecords.length
        ? [
            {
              '@type': 'ItemList',
              '@id': `${canonical}#universities`,
              name: 'Verified Malaysian Universities Accepting O-Level Pathways',
              numberOfItems: malaysiaRecords.length,
              itemListElement: malaysiaRecords.map((uni, index) => ({
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
          { name: 'Destinations', path: '/destinations' },
          { name: 'Malaysia', path: '/study-in-malaysia-from-bangladesh' },
          { name: 'After O-Level Pathway' },
        ]}
        eyebrow="After O-Level / IGCSE · Skip 2 Years of A-Levels · BDT 0 EduExpress Fee"
        title="Study in Malaysia right after O-Level."
        lead="Instead of spending two extra years and lakhs of taka on A-Level tuition and British Council exam fees in Bangladesh, O-Level graduates can start a 1-year Foundation or 2-year Diploma in Malaysia and progress straight to a globally recognized Bachelor’s degree."
        reviewed={PATHWAY_LAST_UPDATED_LABEL}
        actions={
          <>
            <Link href="#o-level-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check My O-Level Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore Full Malaysia Hub
            </Link>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/destinations/malaysia-hero.webp"
                alt="University campus skyline in Kuala Lumpur, Malaysia for Bangladeshi O-Level pathway students"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4 text-[13px] font-semibold text-petrol-800">
              <span>Direct MQA Foundation (5 Credits) &amp; Diploma (3 Credits)</span>
              <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                Planning assumption: 1 MYR ≈ 27 BDT
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar
        destination="Malaysia"
        universities={malaysiaRecords.length || 9}
        feeNote="BDT 0 EduExpress service fee for Malaysia admissions"
      />

      {/* Direct Answer Block (E-E-A-T first 100 words) */}
      <Section
        id="direct-answer"
        title="How O-Level graduates win by starting in Malaysia instead of A-Levels"
        intro="Staying in Bangladesh for GCE A-Levels locks a student into two pre-university years plus BDT 4.8–15+ lakh in school/coaching and British Council exam fees before Bachelor’s study even starts. Under Malaysia’s MQA rules, 5 O-Level Credits unlock a 1-year Foundation (or 3 Credits unlock a 2-year Diploma), moving you straight onto the university track—graduating 1 to 2 years earlier with a Malaysian, UK dual-award, or Australian branch-campus Bachelor’s degree."
      >
        <LivingCostSeparationNotice
          summary="All academic comparisons on this page keep Tuition & Exam Fees strictly separate from Monthly Living Expenses (housing, food, local transit). That lets parents compare real educational investment cleanly against Bangladesh A-Level school or coaching costs."
        />
      </Section>

      <WinningAdvantageGrid
        id="why-you-win"
        tone="sage"
        title="Three Concrete Ways O-Level Students Win in Malaysia"
        intro="Instead of comparing options passively, look at the measurable time, fee, and degree gains when you transition right after O-Levels."
        cards={MALAYSIA_O_LEVEL_WIN_CARDS}
      />

      {/* Side-by-Side Win Proof Table */}
      <Section
        id="win-proof"
        title="Direct Proof: Staying for A-Levels vs. Starting Malaysia After O-Level"
        intro="Every row below compares educational time, pre-university academic spend (excluding living costs), and the resulting university milestone."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">Side-by-side proof showing how O-Level students win in Malaysia compared with A-Levels</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Comparison Factor</th>
                <th scope="col" className="p-4 font-bold">Stay in Bangladesh for A-Levels</th>
                <th scope="col" className="p-4 font-bold">Start Malaysia After O-Level</th>
                <th scope="col" className="p-4 font-bold">How the Student Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {MALAYSIA_VS_A_LEVEL_WIN_ROWS.map(row => (
                <tr key={row.criterion}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.criterion}</th>
                  <td className="p-4 align-top">{row.stayForALevel}</td>
                  <td className="p-4 align-top font-semibold text-emerald-900">{row.malaysiaPath}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.studentWin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 1: 2-Year Bangladesh A-Level Cost vs. Malaysia O-Level Entry */}
      <Section
        id="cost-comparison"
        tone="sage"
        title="Granular Academic Fee Breakdown: Bangladesh A-Levels vs. Malaysia Entry"
        intro="Inspect the underlying Bangladesh A-Level coaching, school, and British Council fees alongside Malaysia Foundation and Diploma tuition (living costs kept separate)."
      >
        <div className="space-y-8">
          <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-[14.5px] leading-6">
              <caption className="sr-only">Two-year A-Level academic and exam cost in Bangladesh</caption>
              <thead className="border-b border-canvas-soft bg-canvas-soft text-petrol-800">
                <tr>
                  <th scope="col" className="p-4 font-bold">Bangladesh A-Level Route (2 Years)</th>
                  <th scope="col" className="p-4 font-bold">Tuition / Coaching Fees</th>
                  <th scope="col" className="p-4 font-bold">Labs, Books &amp; Mocks</th>
                  <th scope="col" className="p-4 font-bold">British Council Exam Fees</th>
                  <th scope="col" className="p-4 font-bold">2-Year Academic Total (No Living)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft text-ink-soft">
                {BANGLADESH_A_LEVEL_TRACKS.map(row => (
                  <tr key={row.route}>
                    <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                      {row.route}
                      <span className="mt-1 block text-[12.5px] font-medium text-emerald-800">
                        <Clock size={12} className="mr-1 inline" aria-hidden="true" />
                        {row.timeBeforeBachelor}
                      </span>
                    </th>
                    <td className="p-4 align-top">{row.tuitionAndCoaching}</td>
                    <td className="p-4 align-top">{row.labsAndMocks}</td>
                    <td className="p-4 align-top">{row.boardExams}</td>
                    <td className="p-4 align-top font-bold text-petrol-800">{row.academicTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-left text-[14.5px] leading-6">
              <caption className="sr-only">Malaysia Foundation and Diploma entry and tuition after O-Level</caption>
              <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
                <tr>
                  <th scope="col" className="p-4 font-bold">Malaysia Post-O-Level Program</th>
                  <th scope="col" className="p-4 font-bold">Minimum O-Level Entry</th>
                  <th scope="col" className="p-4 font-bold">Standard Private Tuition (No Living)</th>
                  <th scope="col" className="p-4 font-bold">Top Private / Branch Tuition (No Living)</th>
                  <th scope="col" className="p-4 font-bold">Next Degree Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft text-ink-soft">
                {ENTRY_PATHS.map(row => (
                  <tr key={row.level}>
                    <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                      {row.level}
                      <span className="mt-1 block text-[12.5px] font-normal text-ink-soft">{row.subjectRules}</span>
                    </th>
                    <td className="p-4 align-top font-semibold text-petrol-800">{row.oLevelRequirement}</td>
                    <td className="p-4 align-top font-semibold text-emerald-800">{row.tuitionStandard}</td>
                    <td className="p-4 align-top">{row.tuitionBranch}</td>
                    <td className="p-4 align-top">{row.progression}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Separate Living & Official Third-Party Costs Block */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
              <h3 className={kit.h3}>Separated Monthly Living Budget in Malaysia</h3>
              <p className={`mt-2 ${kit.body}`}>
                Living expenses are kept completely outside tuition totals so families can plan realistically by campus city and housing type:
              </p>
              <ul className="mt-4 space-y-2 text-[14.5px] leading-6 text-ink-soft">
                <li>• <strong className="text-petrol-800">Student Housing / Hostel:</strong> RM 500 – RM 900 / month (~BDT 13,500 – 24,300)</li>
                <li>• <strong className="text-petrol-800">Halal Meals, Transit &amp; Personal:</strong> RM 700 – RM 1,100 / month (~BDT 18,900 – 29,700)</li>
                <li>• <strong className="text-petrol-800">Combined Living Reference:</strong> RM 1,200 – RM 2,000 / month (~BDT 32,400 – 54,000/mo)</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
              <h3 className={kit.h3}>Official Pre-Departure &amp; Visa Charges (Separate)</h3>
              <p className={`mt-2 ${kit.body}`}>
                All third-party fees are paid directly to the university, EMGS, or embassy; EduExpress charges <strong className="text-petrol-800">BDT 0 service fee</strong>:
              </p>
              <ul className="mt-4 space-y-2 text-[14.5px] leading-6 text-ink-soft">
                <li>• <strong className="text-petrol-800">University Application / Registration:</strong> RM 500 – RM 1,000 (one-time)</li>
                <li>• <strong className="text-petrol-800">EMGS Processing, eVAL &amp; Year 1 Insurance:</strong> RM 2,250 – RM 3,200</li>
                <li>• <strong className="text-petrol-800">Dhaka SEV / eVISA &amp; Dhaka–KL Airfare:</strong> ~BDT 8,000 – 12,000 SEV + ~BDT 25,000 – 38,000 flight</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Global Degree & Credit-Transfer Progression */}
      <Section
        id="progression"
        title="Where an O-Level Malaysian Pathway Leads Next"
        intro="Starting Foundation or Diploma in Malaysia does not lock a student out of Western degrees—it often lowers the total multi-year cost of reaching them."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {GLOBAL_PROGRESSION_ROUTES.map(card => (
            <div key={card.title} className={kit.cardSage}>
              <span className={kit.icon}>
                <card.icon size={22} className="text-emerald-800" aria-hidden="true" />
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{card.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: Live Verified Malaysian Universities in Catalog */}
      {malaysiaRecords.length > 0 && (
        <Section
          id="verified-universities"
          tone="sage"
          title="Verified Malaysian Universities in the EduExpress Catalog"
          intro="Compare recorded tuition ranges, scholarships, and degree routes across our active Malaysian institutions."
          action={
            <Link href="/universities?country=Malaysia" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Browse Full Malaysia Directory <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {malaysiaRecords.map(uni => {
              const firstAward = uni.scholarships[0];
              return (
                <div key={uni.slug} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-lime-pale px-3 py-1 text-[12px] font-bold text-lime-deep">
                        {uni.city}
                      </span>
                      <span className="text-[12px] font-semibold text-emerald-800">BDT 0 EduExpress Fee</span>
                    </div>
                    <h3 className="mt-3 text-[18px] font-bold text-petrol-800">{uni.name}</h3>
                    <p className="mt-2 text-[14px] leading-6 text-ink-soft">
                      <strong className="text-petrol-800">Recorded tuition:</strong> {uni.details.tuition}
                    </p>
                    {firstAward && (
                      <p className="mt-1.5 text-[13.5px] leading-5 text-emerald-900">
                        <strong>Merit option:</strong> {firstAward.title}
                        {firstAward.amount ? ` (${firstAward.amount})` : ''}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 border-t border-canvas-soft pt-3.5">
                    <Link
                      href={`/universities/${uni.slug}`}
                      className="inline-flex items-center gap-1.5 text-[14px] font-bold text-petrol-800 hover:underline"
                    >
                      View fees &amp; programs <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Module 4: Fit vs. Reconsider + Under-18 & Work Rules */}
      <Section
        id="who-it-fits"
        title="Who This Pathway Fits — And Who Should Reconsider"
        intro="An evidence-first recommendation states clear eligibility boundaries, age policies, and financial realities upfront."
      >
        <FitVsReconsiderGrid
          fitTitle="Ideal Fit After O-Levels"
          fitItems={[
            {
              label: 'O-Level / IGCSE graduates with 5+ Credits (or 3+ Credits for Diploma)',
              detail: 'Ready for English-medium university Foundation or Diploma coursework without repeating two years of A-Levels.',
            },
            {
              label: 'Students targeting UK or Australian degrees on a realistic budget',
              detail: 'Branch campuses and UK dual degrees deliver international curricula at substantially lower tuition than London or Sydney.',
            },
            {
              label: 'Families requiring legal bank remittance',
              detail: 'Offer letter and EMGS eVAL allow opening a Bangladesh Bank Authorized Dealer Student File for direct tuition wire transfers.',
            },
          ]}
          reconsiderTitle="Who Should Reconsider"
          reconsiderItems={[
            {
              label: 'Students expecting to fund tuition through part-time jobs',
              detail: 'Malaysian immigration strictly limits Student Pass holders to 20 hours/week during semester breaks exceeding 7 days in approved service sectors only.',
            },
            {
              label: 'Applicants targeting full 100% government-funded tuition & stipends',
              detail: 'Malaysian merit scholarships are partial waivers (typically 15%–50%, up to 75% at select campuses), unlike full-tuition scholarship tiers in China.',
            },
            {
              label: 'Applicants under 18 without approved campus accommodation',
              detail: 'Under-18 students require parent-signed consent and university-approved housing until age 18.',
            },
          ]}
        />
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={faqs} tone="sage" title="Frequently Asked Questions: Malaysia After O-Level" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="white"
        extraLinks={[
          { label: 'Study in Malaysia Hub', href: '/study-in-malaysia-from-bangladesh' },
          { label: 'Malaysia Study Costs & Student File', href: '/malaysia-study-cost-bangladesh' },
          { label: 'Malaysia Student Visa (EMGS & eVAL)', href: '/malaysia-student-visa-bangladesh' },
        ]}
      />

      {/* Governance & Official Sources */}
      <PathwayGovernanceSection
        tone="sage"
        authorName="Mukta Rahaman"
        authorRole="Senior Consultant (Education Fit & Cost Planning)"
        lastVerified="21 November 2026"
        nextReview="21 February 2027"
        whatMayChange={[
          'British Council Bangladesh CAIE/Edexcel per-subject and per-unit exam fees adjust per exam series and VAT/FX updates.',
          'Malaysian university tuition schedules and entrance merit discounts update per intake (February, May/July, September).',
          'MYR-to-BDT conversion fluctuates with Bangladesh Bank Authorised Dealer TT selling rates (1 MYR ≈ 27 BDT is an illustrative reference).',
          'EMGS visa processing fees and mandatory annual medical insurance rates are governed by Malaysian authorities.',
        ]}
        sources={MALAYSIA_O_LEVEL_SOURCES}
      />

      {/* Embedded Free Assessment */}
      <Section
        id="o-level-assessment"
        title="Check Your O-Level to Malaysia Eligibility"
        intro="Share your O-Level / IGCSE subjects, grades, and preferred field. An EduExpress counselor prepares a written shortlist and separate tuition/living sheet within one working day—at BDT 0 service fee."
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-sm sm:p-10">
          <EducationFitAssessment initialContext={{ country: 'malaysia' }} />
        </div>
      </Section>

      <CtaBand
        title="Ready to compare O-Level pathways?"
        text="Bring your O-Level grades to our Dhanmondi desk or start online. We compare Malaysia Foundation/Diploma options alongside China’s 3+2 Diploma route in writing."
        assessmentHref="#o-level-assessment"
      />
    </article>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Clock, FileCheck2, ShieldAlert, ShieldCheck, Wrench } from 'lucide-react';
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
  CHINA_3_PLUS_2_WIN_CARDS,
  CHINA_5_YEAR_WIN_ROWS,
  CHINA_DIPLOMA_SCHOLARSHIP_TIERS,
  CHINA_O_LEVEL_SOURCES,
  PATHWAY_LAST_UPDATED_ISO,
  PATHWAY_LAST_UPDATED_LABEL,
} from '@/lib/pathway-comparison';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-china-after-o-level-ssc';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

const VISA_FIRST_TERMS =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in China After O-Level or SSC 2027 | EduExpress',
    description:
      'Complete a 3-year Diploma + 2-year top-up Bachelor in China in 5 years after SSC or O-Level. Compare scholarship tiers, hostel fees, and guardian rules.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    languages: {
      'en-BD': PATH,
      'bn-BD': '/bn/study-in-china-after-ssc-dakhil',
      'x-default': PATH,
    },
    image: ogImage('china-guide', 'Study in China after O-Level or SSC from Bangladesh — EduExpress International'),
  });
}

const PATHWAY_TIMELINE = [
  {
    step: 'Years 1–3',
    title: '3-Year Higher Vocational Diploma',
    detail:
      'Enter an accredited Chinese Higher Vocational & Technical College directly after SSC or O-Level (many tracks include an integrated Chinese language foundation alongside practical engineering, robotics, IT, or e-commerce training).',
  },
  {
    step: 'Years 4–5',
    title: '2-Year Top-Up Bachelor Upgrade',
    detail:
      'After completing the 3-year Diploma and required HSK/GPA criteria, progress into a 2-year Bachelor upgrade program (articulated 3+2 route) at a partner or host university.',
  },
  {
    step: 'Total: 5 Years',
    title: 'Bachelor’s Degree 1 Year Earlier',
    detail:
      'Graduates earn a recognized Bachelor’s degree in 5 years post-SSC/O-Level—saving 1 full year compared with the 6-year traditional track (2 years HSC/A-Level + 4 years Bachelor).',
  },
] as const;

const TECHNICAL_MAJORS = [
  {
    icon: Wrench,
    title: 'Mechatronics, CNC & Robotics',
    examples: 'Industrial Automation, Mechanical Manufacturing, Smart Robotics, Electrical Equipment Maintenance',
    exampleLink: '/updates/yunnan-provincial-government-scholarship-vocational-diploma-2027',
    exampleLabel: 'See YVCMET Diploma Scholarship Example',
  },
  {
    icon: Building2,
    title: 'Computing, Software & E-Commerce',
    examples: 'Computer Application Technology, Cross-Border E-Commerce, Software Engineering, Digital Media & Logistics',
    exampleLink: '/programs',
    exampleLabel: 'Browse Recorded China Programs',
  },
  {
    icon: FileCheck2,
    title: 'Hospitality, Rail & Civil Infrastructure',
    examples: 'High-Speed Rail Operations, Civil Construction Engineering, Tourism & Aviation Services',
    exampleLink: '/china-universities',
    exampleLabel: 'Explore Chinese Institutions',
  },
] as const;

const faqs = [
  {
    question: 'How does a Bangladeshi student get a Bachelor’s degree in 5 years after SSC or O-Level in China?',
    answer:
      'Instead of spending 2 years in HSC or A-Levels followed by a 4-year Bachelor’s degree (6 years total), qualified SSC or O-Level graduates enter a 3-year Higher Vocational Diploma program in China and then advance into a 2-year Top-Up Bachelor program (3+2 pathway). The exact bachelor upgrade partner, HSK threshold, and credit-transfer terms are verified in writing for the specific college before admission.',
  },
  {
    question: 'What are the three scholarship tiers for 3-year Diploma programs in China?',
    answer:
      'Eligible students typically qualify across three institutional funding tiers depending on grades, quota, and intake: (1) Full Scholarship — Tuition CNY 0 and Hostel CNY 0; (2) Class B / Tuition-Free Scholarship — Tuition CNY 0 with hostel fees around CNY 1,200 to CNY 3,000 per year; and (3) Partial Scholarship — combined Tuition and Hostel costing roughly CNY 5,000 to CNY 8,000 per year. All scholarship renewals depend on meeting annual attendance and academic standards.',
  },
  {
    question: 'Why are monthly living expenses excluded from the scholarship total?',
    answer:
      'Tuition and hostel fees are fixed institutional charges, whereas monthly meals, local transport, mobile SIM, and personal spending vary by city and lifestyle (commonly CNY 800 to CNY 1,400/month). Keeping living expenses separate gives families an honest comparison of academic and accommodation commitments without mixing personal spending into tuition.',
  },
  {
    question: 'Can a 16- or 17-year-old student travel to China right after SSC or O-Levels?',
    answer:
      'Under China’s Ministry of Education Order No. 42 (Article 38), international students under age 18 whose parents do not reside in China must appoint a legally notarized guardian residing in China until turning 18. Not every college provides guardianship internally, so EduExpress verifies age eligibility and notarized guardian arrangements for each college before submitting any application.',
  },
  {
    question: 'Are Chinese 3-year Diploma programs taught in English or Chinese?',
    answer:
      'Most vocational and technical diplomas in China are taught primarily in Chinese (often beginning with 1 semester to 1 year of preparatory Chinese language training to reach HSK 3–4), while select bilingual or English-assisted tracks exist. Confirm the exact instruction language and graduation HSK level before enrolling.',
  },
  {
    question: 'What is EduExpress’s payment policy for China Diploma applications?',
    answer:
      'No file opening charge. No EduExpress service fee before China visa approval. Any university application fee, medical checkup, document notarization, embassy visa fee, or refundable/deposit charge required earlier is itemized in writing before you proceed.',
  },
];

export default function StudyInChinaAfterOLevelSscPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: PATHWAY_LAST_UPDATED_ISO,
        name: 'Study in China After O-Level or SSC: 3-Year Diploma + 2-Year Bachelor Guide',
        description:
          'Complete a 3-year Diploma + 2-year top-up Bachelor in China in 5 years after SSC or O-Level with clear tuition/hostel scholarship tiers.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/china-guide.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(CHINA_O_LEVEL_SOURCES),
      },
    ],
  };

  return (
    <article lang="en">
      <JsonLd data={schema} />

      <PageHero
        path={PATH}
        trail={[
          { name: 'Study in China', path: '/study-in-china-from-bangladesh' },
          { name: 'After O-Level or SSC (3+2 Pathway)' },
        ]}
        eyebrow="After SSC / O-Level · 3-Yr Diploma + 2-Yr Bachelor = 5 Yrs · Visa-First Policy"
        title="Study in China after O-Level or SSC."
        lead="Turn SSC or O-Level into a Bachelor’s degree in five years total through China’s 3-year Higher Vocational Diploma plus 2-year Top-Up Bachelor track—with tuition-free and low-cost hostel scholarship tiers and BDT 0 EduExpress service fee before China visa approval."
        reviewed={PATHWAY_LAST_UPDATED_LABEL}
        actions={
          <>
            <Link href="#china-diploma-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check Diploma Eligibility <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore Full China Hub
            </Link>
            <Link href="/bn/study-in-china-after-ssc-dakhil" hrefLang="bn-BD" className="ed-btn ed-btn-outline min-h-[52px] px-6">
              <span lang="bn">বাংলায় পড়ুন (SSC ও দাখিল)</span>
            </Link>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/destinations/china-study-guide.webp"
                alt="Chinese university campus and engineering training pathway for Bangladeshi students after SSC and O-Level"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4 text-[13px] font-semibold text-petrol-800">
              <span>3-Year Diploma + 2-Year Top-Up Bachelor (5 Years Total)</span>
              <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                All amounts in CNY / RMB
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar destination="China" feeNote="BDT 0 before China visa approval" />

      {/* Direct Answer Block */}
      <Section
        id="direct-answer"
        title="How the 5-year post-SSC / post-O-Level route in China works"
        intro="Bangladeshi students who finish SSC or GCE O-Levels normally spend two years in HSC or A-Levels and four more years in an undergraduate degree—six years in total. China’s vocational-to-bachelor (3+2) route lets eligible SSC and O-Level graduates start a 3-year Higher Vocational Diploma immediately, followed by a 2-year Top-Up Bachelor program, reaching a full Bachelor’s qualification in five years while keeping tuition and dorm costs heavily subsidized under institutional scholarships."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {PATHWAY_TIMELINE.map(item => (
            <div key={item.step} className={kit.cardSage}>
              <span className={kit.badge}>
                <Clock size={14} aria-hidden="true" />
                {item.step}
              </span>
              <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <LivingCostSeparationNotice
            tone="sage"
            summary="University Tuition and Hostel figures below are kept strictly separate from Monthly Living Expenses (food, local transit, SIM, personal spending) and third-party visa/travel charges. University figures remain in CNY/RMB so you can convert using your bank’s live rate."
          />
        </div>
      </Section>

      <WinningAdvantageGrid
        id="why-you-win"
        tone="sage"
        title="How SSC & O-Level Students Win With China’s 3+2 Pathway"
        intro="Instead of two passive high-school years before entering university, students save a full year, gain practical technical training early, and access heavily subsidized institutional tiers."
        cards={CHINA_3_PLUS_2_WIN_CARDS}
      />

      {/* Direct 5-Year vs. 6-Year Cumulative Proof */}
      <Section
        id="five-year-proof"
        title="5-Year China 3+2 Proof vs. 6-Year Local HSC/A-Level + Dhaka Bachelor"
        intro="Compare total duration and institutional academic fees side by side—keeping monthly living costs separated from tuition and dorm totals."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">Five-year China 3+2 Diploma-to-Bachelor proof vs six-year local track</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Comparison Criterion</th>
                <th scope="col" className="p-4 font-bold">Bangladesh 6-Year Track (HSC/A-Level + Private Bachelor)</th>
                <th scope="col" className="p-4 font-bold">China 5-Year 3+2 Track (Diploma + Top-Up Bachelor)</th>
                <th scope="col" className="p-4 font-bold">Why the Student Wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {CHINA_5_YEAR_WIN_ROWS.map(row => (
                <tr key={row.criterion}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.criterion}</th>
                  <td className="p-4 align-top">{row.bangladeshLocal6Yr}</td>
                  <td className="p-4 align-top font-semibold text-emerald-900">{row.china3Plus2}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.studentWin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Module 1: Three China Diploma Scholarship Tiers */}
      <Section
        id="diploma-scholarships"
        tone="sage"
        title="China Diploma Scholarship Tiers (Tuition & Hostel Only)"
        intro="Across participating Chinese vocational and technical colleges, diploma scholarships fall into three structured institutional fee tiers—without mixing personal living expenses into the total."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left text-[14.5px] leading-6">
            <caption className="sr-only">China 3-year diploma scholarship tiers for tuition and hostel</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Scholarship Tier</th>
                <th scope="col" className="p-4 font-bold">Annual Tuition</th>
                <th scope="col" className="p-4 font-bold">Annual Campus Hostel</th>
                <th scope="col" className="p-4 font-bold">Institutional Total (No Living)</th>
                <th scope="col" className="p-4 font-bold">Eligibility &amp; Renewal Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {CHINA_DIPLOMA_SCHOLARSHIP_TIERS.map(row => (
                <tr key={row.tier}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">{row.tier}</th>
                  <td className="p-4 align-top font-semibold text-emerald-800">{row.tuitionFee}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.hostelFee}</td>
                  <td className="p-4 align-top font-bold text-petrol-800">{row.institutionalTotal}</td>
                  <td className="p-4 align-top">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
            <h3 className={kit.h3}>Separated Monthly Living &amp; Official Campus Costs</h3>
            <ul className="mt-4 space-y-2.5 text-[14.5px] leading-6 text-ink-soft">
              <li>• <strong className="text-petrol-800">Monthly Food &amp; Personal Living (Separate):</strong> Typically CNY 800 – 1,400 / month depending on campus canteen meals and city.</li>
              <li>• <strong className="text-petrol-800">Compulsory Comprehensive Insurance:</strong> ~CNY 800 / year (paid directly per MoE rules).</li>
              <li>• <strong className="text-petrol-800">Pre-Departure / Arrival Third-Party Costs:</strong> Medical exam, residence permit (~CNY 400–800/yr), passport/notary attestation, embassy visa fee, and flight.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-petrol-800/10 bg-petrol-800 p-6 text-white shadow-sm">
            <h3 className="text-[20px] font-bold text-lime">EduExpress China Visa-First Terms</h3>
            <p className="mt-3 text-[15px] leading-7 text-white/90">{VISA_FIRST_TERMS}</p>
            <div className="mt-5">
              <Link href="/china-visa-first-policy" className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-lime hover:underline">
                Read full China Visa-First Policy <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Module 2: Technical Fields & Verified Examples */}
      <Section
        id="fields"
        title="Popular 3-Year Diploma Fields & Catalog Examples"
        intro="Chinese vocational colleges prioritize applied engineering, intelligent manufacturing, digital commerce, and infrastructure fields linked to industrial training centers."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {TECHNICAL_MAJORS.map(item => (
            <div key={item.title} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-sm">
              <div>
                <span className={kit.icon}>
                  <item.icon size={22} className="text-petrol-800" aria-hidden="true" />
                </span>
                <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{item.examples}</p>
              </div>
              <div className="mt-5 border-t border-petrol-800/10 pt-4">
                <Link href={item.exampleLink} className={kit.link}>
                  {item.exampleLabel} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Module 3: Mandatory Age, Guardian & Articulation Safeguards */}
      <Section
        id="safeguards"
        tone="sage"
        title="Mandatory Eligibility, Minor Guardian & Articulation Checks"
        intro="Before a post-SSC or post-O-Level family commits to a 3+2 route, EduExpress checks four regulatory requirements in writing."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-900">
                <ShieldAlert size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>Under-18 Legal Guardian Rule (MoE Order No. 42)</h3>
            </div>
            <p className={`mt-3 ${kit.body}`}>
              Students starting after SSC or O-Levels are often 16 or 17 years old. Under Chinese Ministry of Education regulations, applicants under 18 whose parents do not live in China must submit a notarized legal guardianship guarantee naming an eligible guardian residing in China until the student’s 18th birthday. We confirm in writing whether your target college accepts under-18 applicants and what guardian documentation is mandatory.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                <ShieldCheck size={20} aria-hidden="true" />
              </span>
              <h3 className={kit.h3}>Written 3+2 Top-Up &amp; Language Verification</h3>
            </div>
            <p className={`mt-3 ${kit.body}`}>
              International diploma students do not take the domestic Chinese <em>Gaokao</em> upgrade exam; instead, progression into Years 4–5 relies on institutional articulation or transfer admission plus HSK language proficiency (commonly HSK 4). EduExpress verifies the college’s language track, HSK prep duration, and written bachelor-upgrade route before you apply.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <FitVsReconsiderGrid
            fitTitle="Who This 3+2 China Route Fits"
            fitItems={[
              {
                label: 'SSC or O-Level graduates aiming for practical engineering & tech',
                detail: 'Students who prefer hands-on lab/workshop training in robotics, CNC, IT, or e-commerce instead of two more years of theoretical HSC/A-Levels.',
              },
              {
                label: 'Budget-focused families seeking low institutional totals',
                detail: 'Scholarship tiers reduce annual tuition + hostel to CNY 0 (Tier 1), CNY 1,200–3,000 (Tier 2), or CNY 5,000–8,000 (Tier 3), subject to selection.',
              },
              {
                label: 'Students willing to build Chinese proficiency alongside technical study',
                detail: 'Adding HSK proficiency opens technical internships and smooth progression into Chinese top-up Bachelor programs.',
              },
            ]}
            reconsiderTitle="Who This Route Is Not Suitable For"
            reconsiderItems={[
              {
                label: 'Future MBBS / Clinical Medicine doctors',
                detail: 'BMDC-eligible Clinical Medicine requires 12th-grade HSC/A-Level Biology, Chemistry, and Physics—never a vocational diploma.',
              },
              {
                label: 'Students unwilling to learn Chinese',
                detail: 'Most 3-year vocational diplomas require Chinese language progression (HSK 3–4); consider Malaysia’s English-medium Foundation/Diploma instead.',
              },
              {
                label: 'Applicants relying on off-campus jobs for living expenses',
                detail: 'China X1 student visas restrict paid employment; families must budget separated monthly living costs.',
              },
            ]}
          />
        </div>
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={faqs} tone="white" title="Frequently Asked Questions: China After O-Level or SSC" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="sage"
        extraLinks={[
          { label: 'Study in China Hub', href: '/study-in-china-from-bangladesh' },
          { label: 'China Study Cost Guide', href: '/study-in-china-cost-bangladesh' },
          { label: 'China Study Data Report', href: '/china-study-report-bangladesh' },
          { label: 'China Visa-First Payment Policy', href: '/china-visa-first-policy' },
        ]}
      />

      {/* Governance & Sources */}
      <PathwayGovernanceSection
        tone="white"
        authorName="Md Tauhidul Islam Nur"
        authorRole="Country Manager, China (Programs & Intakes)"
        lastVerified="21 November 2026"
        nextReview="21 February 2027"
        whatMayChange={[
          'Diploma scholarship quotas across Tier 1, Class B, and Partial packages are set annually by each college and provincial authority.',
          'Under-18 age thresholds and guardianship acceptance vary strictly by college and local Entry-Exit Bureau.',
          'Top-up Bachelor (Years 4–5) GPA, HSK, and tuition rules are governed by the receiving Chinese university at the time of graduation.',
          'CNY-to-BDT conversion fluctuates daily; check your bank’s live TT/card rate when budgeting separated living funds.',
        ]}
        sources={CHINA_O_LEVEL_SOURCES}
      />

      {/* Assessment CTA */}
      <Section
        id="china-diploma-assessment"
        tone="sage"
        title="Check Your SSC / O-Level to China Diploma Options"
        intro="Share your SSC or O-Level subjects, age, and field of interest. Our China desk confirms age/guardian eligibility, scholarship tiers, and written costs—at BDT 0 file opening charge."
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm sm:p-10">
          <EducationFitAssessment initialContext={{ country: 'china' }} />
        </div>
      </Section>

      <CtaBand
        title="Compare Malaysia vs. China after O-Levels"
        text="Not sure whether an English-medium Malaysian Foundation or a scholarship-backed China 3+2 Diploma fits better? Let our Dhanmondi counselors compare both options side by side in writing."
        assessmentHref="#china-diploma-assessment"
      />
    </article>
  );
}

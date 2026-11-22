import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Compass, Globe2, GraduationCap, ShieldCheck } from 'lucide-react';
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
  BD_VS_ABROAD_DESTINATION_ROWS,
  BD_VS_ABROAD_WIN_CARDS,
  COMPARISON_HUB_SOURCES,
  PATHWAY_LAST_UPDATED_ISO,
  PATHWAY_LAST_UPDATED_LABEL,
} from '@/lib/pathway-comparison';
import { ogImage, pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/bangladesh-vs-study-abroad-countries';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  return pageMetadata({
    title: 'Study in Bangladesh vs Abroad 2027 Guide | EduExpress',
    description:
      'Compare studying in Bangladesh (A-Levels and NSU, EWU, AIUB) against Malaysia, UK, Europe, USA, Australia, and New Zealand with separated tuition and living.',
    path: PATH,
    type: 'article',
    locale: 'en_BD',
    image: ogImage('destinations', 'Study in Bangladesh vs Abroad comparison across Malaysia, UK, China, Europe, and Western destinations'),
  });
}

const WINNING_STRATEGIES = [
  {
    icon: GraduationCap,
    title: 'Win #1 · Skip 2 Extra Years After O-Levels',
    body: 'Instead of 2 years of A-Levels plus 4 years in a Dhaka private university (6 years total), start Foundation + 3-year Bachelor in Malaysia (4 years total) or China’s 3+2 Diploma-to-Bachelor (5 years total).',
    href: '/study-in-malaysia-after-o-level',
    cta: 'See O-Level to Malaysia Route',
  },
  {
    icon: Compass,
    title: 'Win #2 · UK / Australian Degree at 1/3 Cost',
    body: 'Rather than paying £12,000–£38,000/yr or AUD 25,000–50,000/yr directly abroad, study at Monash, Nottingham, or Heriot-Watt in Malaysia—or transfer 1+2 / 2+1 to the UK, Australia, or USA later.',
    href: '/study-in-malaysia-from-bangladesh',
    cta: 'Explore Malaysia Branch Campuses',
  },
  {
    icon: Globe2,
    title: 'Win #3 · European Public & Global Research Value',
    body: 'Active EduExpress routes in Hungary (€3k–€6k/yr or Stipendium Hungaricum), Finland (€6k–€12k/yr with waivers), South Korea, Cyprus, Georgia, and China keep tuition a fraction of US/UK/AU rates.',
    href: '/destinations',
    cta: 'Browse All 12 EduExpress Destinations',
  },
] as const;

const ACTIVE_DESTINATION_LINKS = [
  { label: 'Study in China (Flagship)', href: '/study-in-china-from-bangladesh' },
  { label: 'Study in Malaysia (BDT 0 Fee)', href: '/study-in-malaysia-from-bangladesh' },
  { label: 'Study in UK', href: '/study-in-uk-from-bangladesh' },
  { label: 'Study in Hungary', href: '/study-in-hungary-from-bangladesh' },
  { label: 'Study in Finland', href: '/study-in-finland-from-bangladesh' },
  { label: 'Study in South Korea', href: '/study-in-south-korea-from-bangladesh' },
  { label: 'Study in Georgia (MBBS)', href: '/study-in-georgia-from-bangladesh' },
] as const;

const faqs = [
  {
    question: 'When does studying abroad win over staying in Bangladesh for university?',
    answer:
      'Studying abroad wins when you gain faster degree completion (saving 1–2 years after O-Levels or SSC), higher global university rankings, international research labs, or direct UK/Australian/European credentials at controlled academic tuition—particularly in China, Malaysia, Hungary, or Finland, rather than overpaying BDT 1–3+ crore upfront.',
  },
  {
    question: 'Why are tuition and living costs shown in separate columns?',
    answer:
      'Mixing daily food and rent into tuition hides the true academic price of a degree. By separating Tuition & Institutional Fees from Living Expenses (such as RM 1,200–2,000/month in Malaysia, €800/month in Finland, or AUD 29,710/year benchmark in Australia), families can compare pure education cost fairly against staying in Bangladesh.',
  },
  {
    question: 'Which abroad destinations does EduExpress actively support versus benchmark?',
    answer:
      'EduExpress actively provides counseling and application support for China (flagship), Malaysia (BDT 0 service charge), the United Kingdom, Hungary, South Korea, Finland, Malta, Cyprus, Georgia, Greece, Croatia, and Thailand. The USA, Australia, and New Zealand are presented here as transparent cost benchmarks—and as targets for Malaysia 1+2 / 2+1 credit transfers or post-Bachelor Master’s degrees.',
  },
  {
    question: 'How does staying in Bangladesh compare financially with going abroad right after O-Levels?',
    answer:
      'Staying for 2 years of A-Levels in Bangladesh costs roughly BDT 4.8–7.35 lakh (private/coaching + British Council exam fees) or BDT 7.5–15+ lakh (Dhaka English-medium schools), followed by BDT 9.17–14.30 lakh at Category-A private universities like EWU, NSU, or AIUB. Starting a 1-year Malaysian Foundation (~BDT 4.05–5.94 lakh standard tuition) or China’s 3+2 scholarship track lets students enter higher education immediately instead of paying for two pre-university years.',
  },
  {
    question: 'What if a student wants a Western degree (UK, USA, Australia, New Zealand) without paying full Western tuition?',
    answer:
      'Two proven pathways bridge this gap: (1) completing a Foundation or 1+2 / 2+1 transfer or branch-campus degree in Malaysia (Monash, Nottingham, Heriot-Watt, or Sunway/Taylor’s dual degrees), or (2) finishing an accredited, scholarship-backed Bachelor’s degree in China and then pursuing a 1-year UK or Western Master’s.',
  },
];

export default function BangladeshVsStudyAbroadPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        mainEntityOfPage: canonical,
        dateModified: PATHWAY_LAST_UPDATED_ISO,
        name: 'Study in Bangladesh vs Abroad 2027: Malaysia, UK, China, Europe & Western Benchmarks',
        description:
          'Compare staying in Bangladesh for A-Levels and Dhaka private universities against studying abroad across Malaysia, UK, China, Europe, USA, Australia, and New Zealand.',
        inLanguage: 'en-BD',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        primaryImageOfPage: primaryImageOfPageSchema('/og/destinations.jpg'),
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        ...citationJsonLd(COMPARISON_HUB_SOURCES),
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
          { name: 'Bangladesh vs. Study Abroad' },
        ]}
        eyebrow="Bangladesh vs. Global Destinations · Time, Tuition & Credential ROI"
        title="Studying in Bangladesh vs. studying abroad."
        lead="Compare staying in Bangladesh for A-Levels and Category-A private universities against global study pathways in Malaysia, China, the UK, Europe, and Western benchmarks—proving where students win on time, rankings, and separated tuition."
        reviewed={PATHWAY_LAST_UPDATED_LABEL}
        actions={
          <>
            <Link href="#bd-abroad-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Compare My Destination Fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/bangladesh-vs-china-bachelor-study" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Focus: Bangladesh vs. China
            </Link>
          </>
        }
        aside={
          <figure className="overflow-hidden rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/destinations/united-kingdom-hero.webp"
                alt="International university campus comparison for Bangladeshi students evaluating study abroad vs staying local"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4 text-[13px] font-semibold text-petrol-800">
              <span>Local Dhaka Track vs. 12+ Global Study Routes</span>
              <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[12px] text-lime-deep">
                Living costs separated
              </span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar feeNote="Transparent destination & cost comparison" />

      {/* Direct Answer */}
      <Section
        id="direct-answer"
        title="When studying abroad delivers a measurable win over staying in Bangladesh"
        intro="Choosing between staying in Bangladesh and going abroad is not just a currency comparison—it is a time, ranking, and degree-mobility decision. Staying for 2 years of A-Levels plus 4 years at a local private university (NSU, EWU, AIUB) takes 6 years and BDT 14–29+ lakh in academic fees combined, yielding a domestic degree. Choosing the right abroad tier—such as Malaysia after O-Levels, ranked Chinese universities with scholarships, or targeted European public routes—cuts timeline waste, upgrades global recognition, and avoids BDT 1–3 crore Western undergraduate debt."
      >
        <LivingCostSeparationNotice
          summary="All destination tables below separate Tuition & Institutional Fees cleanly from Monthly or Annual Living Expenses. EduExpress actively services China, Malaysia, the UK, and listed European/Asian destinations; USA, Australia, and New Zealand are displayed as transparent benchmarks and transfer/Master’s targets."
        />
      </Section>

      {/* Win Scorecard */}
      <WinningAdvantageGrid
        id="why-students-win"
        tone="sage"
        title="Three Strategic Ways Students Win Abroad vs. Staying Local"
        intro="Match your academic stage (O-Level/SSC or A-Level/HSC) and budget to the route with the strongest educational return."
        cards={BD_VS_ABROAD_WIN_CARDS}
      />

      {/* Full Destination Comparison Matrix */}
      <Section
        id="destination-matrix"
        title="Bangladesh vs. Abroad Destinations: Tuition, Living & Strategic Verdict"
        intro="Compare every major pathway side by side with living budgets shown in their own column."
      >
        <div className="overflow-x-auto rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
          <table className="w-full min-w-[920px] text-left text-[14px] leading-6">
            <caption className="sr-only">Study in Bangladesh compared against abroad study destinations</caption>
            <thead className="border-b border-canvas-soft bg-petrol-800 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">Destination &amp; Service Scope</th>
                <th scope="col" className="p-4 font-bold">Typical Timeline</th>
                <th scope="col" className="p-4 font-bold">Tuition / Academic Fees (No Living)</th>
                <th scope="col" className="p-4 font-bold">Living Cost (Strictly Separated)</th>
                <th scope="col" className="p-4 font-bold">How the Student Wins (or Tradeoff)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft text-ink-soft">
              {BD_VS_ABROAD_DESTINATION_ROWS.map((row, index) => (
                <tr key={row.destination} className={index === 1 || index === 2 ? 'bg-lime-pale/25' : undefined}>
                  <th scope="row" className="p-4 align-top font-bold text-petrol-800">
                    {row.destination}
                    <span className="mt-1 block text-[12px] font-medium text-emerald-900">{row.serviceNote}</span>
                  </th>
                  <td className="p-4 align-top font-medium text-petrol-800">{row.duration}</td>
                  <td className="p-4 align-top font-semibold text-petrol-800">{row.tuitionOnly}</td>
                  <td className="p-4 align-top text-amber-900">{row.livingSeparated}</td>
                  <td className="p-4 align-top font-medium text-petrol-800">{row.winOrTradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Strategic Winning Routes + Active Country Links */}
      <Section
        id="winning-routes"
        tone="sage"
        title="Choosing the Right Abroad Tier for Maximum Advantage"
        intro="Do not compare abroad destinations as one flat price—use smart pathways to secure top degrees without overspending."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {WINNING_STRATEGIES.map(card => (
            <div key={card.title} className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm sm:p-7">
              <div>
                <span className={kit.iconLime}>
                  <card.icon size={22} aria-hidden="true" />
                </span>
                <h3 className={`mt-4 ${kit.h3}`}>{card.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{card.body}</p>
              </div>
              <div className="mt-5 border-t border-canvas-soft pt-4">
                <Link href={card.href} className={kit.link}>
                  {card.cta} <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-petrol-800">
            <ShieldCheck size={20} className="text-emerald-700" aria-hidden="true" />
            <h3 className="text-[17px] font-bold">Explore Active EduExpress Destination Hubs</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {ACTIVE_DESTINATION_LINKS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-canvas-soft px-4 py-1.5 text-[13.5px] font-semibold text-petrol-800 hover:bg-lime-pale"
              >
                {item.label} <ArrowRight size={13} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Fit vs Reconsider */}
      <Section
        id="fit-check"
        title="Should You Stay in Bangladesh or Study Abroad?"
        intro="Use verified academic goals, family budget, and visa readiness to make a clear decision."
      >
        <FitVsReconsiderGrid
          fitTitle="When Studying Abroad Clearly Wins"
          fitItems={[
            {
              label: 'O-Level / SSC students wanting to save 1–2 academic years',
              detail: 'Start Foundation/Diploma in Malaysia (BDT 0 service fee) or China’s 3+2 track instead of repeating two pre-university years at home.',
            },
            {
              label: 'A-Level / HSC students seeking global top-500 STEM or Business degrees',
              detail: 'Ranked Chinese universities, Malaysian UK/AU branch campuses, and European public universities offer superior international lab scale and degree portability.',
            },
            {
              label: 'Families preserving capital for a Western Master’s degree',
              detail: 'Complete an affordable ranked Bachelor abroad first, then fund a 1-year UK or Western postgraduate degree with the savings.',
            },
          ]}
          reconsiderTitle="When Staying Locally Makes More Sense"
          reconsiderItems={[
            {
              label: 'Unable to budget separated monthly living costs abroad',
              detail: 'Even when tuition is waived or discounted, students must cover separated housing/meals/insurance abroad (unless full stipends apply), as part-time work is restricted or capped.',
            },
            {
              label: 'Local professional licensing tied strictly to Bangladesh boards',
              detail: 'Always check Bangladesh bar, medical (BMDC), or domestic civil-service equivalency requirements before choosing an overseas curriculum.',
            },
            {
              label: 'Unverified financial solvency or visa documentation gaps',
              detail: 'Destinations like the UK (28-day bank rule), Finland (€9,600/yr Migri funds), and Malaysia (Student File) require clean, verifiable sponsorship records.',
            },
          ]}
        />
      </Section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-24">
        <FaqBlock items={faqs} tone="sage" title="Frequently Asked Questions: Bangladesh vs. Abroad Study" />
      </div>

      {/* Cross Links */}
      <PathwayCrossLinks
        currentPath={PATH}
        tone="white"
        extraLinks={[
          { label: 'Focus: Bangladesh vs. China Bachelor Study', href: '/bangladesh-vs-china-bachelor-study' },
          { label: 'All-in-One China vs. Western & Dhaka Hub', href: '/compare-bachelor-china-abroad-bangladesh' },
          { label: 'Compare All 12 EduExpress Destinations', href: '/compare-study-destinations' },
          { label: 'Check Country Service Status', href: '/country-status' },
        ]}
      />

      {/* Governance */}
      <PathwayGovernanceSection
        tone="sage"
        authorName="Mukta Rahaman"
        authorRole="Senior Consultant (Education Fit & Cost Planning)"
        lastVerified="21 November 2026"
        nextReview="21 February 2027"
        whatMayChange={[
          'Tuition ranges and scholarship quotas in China, Malaysia, Europe, and Western countries update each intake year.',
          'UK Graduate Route post-study rules (18 months for most non-PhD applicants from Jan 2027) and Finnish Migri living benchmarks (€800/mo) follow government notices.',
          'Dhaka private university per-credit fees (NSU, EWU, AIUB) and British Council A-Level fees adjust periodically.',
          'Exchange rates across BDT, MYR, CNY, EUR, GBP, USD, AUD, and NZD fluctuate daily; confirm bank TT quotes before remittance.',
        ]}
        sources={COMPARISON_HUB_SOURCES}
      />

      {/* Assessment */}
      <Section
        id="bd-abroad-assessment"
        title="Get Your Personalized Bangladesh vs. Abroad Recommendation"
        intro="Share your current academic results, target field, and comfortable budget. An EduExpress counselor prepares an itemized EduFit comparison across your best-fit destinations within one working day."
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-petrol-800/10 bg-canvas-soft p-6 shadow-sm sm:p-10">
          <EducationFitAssessment />
        </div>
      </Section>

      <CtaBand
        title="Compare local and global options in writing."
        text="Visit our Dhanmondi office or request an assessment online—with zero obligation and every tuition and separated living figure listed clearly."
        assessmentHref="#bd-abroad-assessment"
      />
    </article>
  );
}

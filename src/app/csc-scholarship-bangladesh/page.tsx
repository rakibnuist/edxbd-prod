import Link from 'next/link';
import { ArrowRight, Building2, Check, ExternalLink, FileText, GraduationCap, ShieldCheck, Wallet } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';

const SITE = 'https://eduexpressint.com';
const PATH = '/csc-scholarship-bangladesh';

export const metadata = pageMetadata({
  title: 'CSC Scholarship from Bangladesh: Full Guide | EduExpress',
  description:
    'Chinese Government (CSC) Scholarship guide for Bangladeshi students: Type A and Type B routes, what a full award covers, stipends, age limits and documents.',
  path: PATH,
});

const visaFirstTerms = 'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

// University and CSC amounts are quoted in CNY only: no fixed BDT exchange rate is assumed.
const cscCoverage = [
  {
    title: 'Full tuition waiver',
    detail: 'Tuition is covered by the Chinese Government Scholarship for awarded scholars, subject to the annual CSC review and the university’s programme terms.',
    icon: GraduationCap,
  },
  {
    title: 'On-campus accommodation',
    detail: 'Free university dormitory accommodation (single or double room) or housing stipend.',
    icon: Building2,
  },
  {
    title: 'Monthly living stipend',
    detail: 'Undergraduate: CNY 2,500 a month. Master’s: CNY 3,000 a month. PhD: CNY 3,500 a month.',
    icon: Wallet,
  },
  {
    title: 'Comprehensive insurance',
    detail: 'CNY 800/year medical insurance covered for emergency hospitalization and outpatient treatment in China.',
    icon: ShieldCheck,
  },
];

const cscTypes = [
  {
    type: 'Type A · bilateral programme',
    appliedThrough: 'Ministry of Education (MoE) Bangladesh / Chinese Embassy in Dhaka',
    bestFor: 'Students applying through Bangladesh government nomination rounds',
    deadline: 'December – February',
    keyNote: 'Requires MoE Bangladesh primary screening and embassy interview endorsement.',
  },
  {
    type: 'Type B · Chinese university programme',
    appliedThrough: 'Directly through designated Chinese universities (CSC agency code)',
    bestFor: 'Students applying directly for Bachelor’s, Master’s, or PhD at target universities',
    deadline: 'January – April',
    keyNote: 'Requires university pre-admission letter or professor acceptance letter for postgraduate applicants.',
  },
];

const requiredDocuments = [
  'CSC Online Application Form (downloaded from campuschina.org)',
  'Highest Diploma/Degree Certificate (Notarized by Ministry of Foreign Affairs Bangladesh)',
  'Academic Transcripts (Notarized SSC, HSC, or Bachelor transcripts)',
  'Study Plan or Research Proposal (Minimum 800 words for Master’s/PhD)',
  'Two Recommendation Letters from Associate Professors or Professors',
  'Foreigner Physical Examination Form (completed at recognized BD diagnostic center)',
  'Non-Criminal Record Certificate (Police Clearance Certificate from Bangladesh Police)',
  'Language Certificate (IELTS/TOEFL for English-taught, or HSK for Chinese-taught)',
  'Passport Copy (Valid for at least 12 months)',
];

const faqs = [
  {
    question: 'Can Bangladeshi students apply for CSC Scholarship without IELTS?',
    answer: 'Yes, many Chinese universities accept Medium of Instruction (MOI) certificates from Bangladeshi schools/colleges where previous instruction was in English. However, top-tier Double First Class universities or specific medical/engineering programs may mandate IELTS (5.5+) or HSK.',
  },
  {
    question: 'What is the difference between CSC Type A and Type B for Bangladeshi applicants?',
    answer: 'Type A is processed through the Bangladesh Ministry of Education (MoE) and the Chinese Embassy in Dhaka under bilateral quota. Type B is submitted directly to designated Chinese universities using their unique 5-digit Agency Number.',
  },
  {
    question: 'Is there any application fee for CSC Scholarship?',
    answer: 'The official CSC application portal (campuschina.org) is free of charge. However, some individual Chinese universities charge an application processing fee (CNY 400 - 800) directly payable to the university bank account.',
  },
  {
    question: 'What are the age limits for CSC Scholarship applicants from Bangladesh?',
    answer: 'Undergraduate applicants must be under 25 years old; Master’s degree applicants must be under 35 years old; Doctoral (PhD) applicants must be under 40 years old.',
  },
];

const related = [
  { label: 'China scholarships: every route compared', href: '/china-scholarships-bangladesh' },
  { label: 'China intakes and deadlines', href: '/china-intakes-deadlines' },
  { label: 'China admission requirements', href: '/china-admission-requirements' },
  { label: 'Study in China without IELTS', href: '/study-in-china-without-ielts' },
  { label: 'Study costs and ClearCost', href: '/study-in-china-cost-bangladesh' },
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE}${PATH}#page`,
  url: `${SITE}${PATH}`,
  name: 'CSC Scholarship from Bangladesh (Chinese Government Scholarship)',
  description: 'Guide for Bangladeshi students applying for CSC Chinese Government Scholarships.',
  inLanguage: 'en-BD',
  isPartOf: { '@id': `${SITE}/#website` },
  publisher: { '@id': `${SITE}/#organization` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
};

export default function CscScholarshipBangladeshPage() {
  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: 'CSC scholarship' }]}
        eyebrow="Chinese Government Scholarship guide"
        title="CSC scholarship from Bangladesh."
        lead="For awarded scholars, the Chinese Government Scholarship (CSC) covers tuition and university housing and provides a monthly stipend of CNY 2,500 to 3,500 for Bangladeshi undergraduate and postgraduate students. Awards are renewed through the annual CSC review."
        actions={
          <>
            <a href="#csc-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">Check your CSC eligibility <ArrowRight size={18} aria-hidden="true" /></a>
            <a href="https://www.campuschina.org/" target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Official portal: campuschina.org <ExternalLink size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[21px] font-semibold leading-[1.3] text-lime">A full CSC award at a glance</p>
            <dl className="mt-4 divide-y divide-white/15">
              {[
                ['Tuition', 'Full waiver'],
                ['Stipend', 'CNY 2,500–3,500 / month'],
                ['Housing', 'University dormitory or housing stipend'],
                ['EduExpress terms', 'No service fee before visa approval'],
              ].map(([term, value]) => (
                <div key={term} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5">
                  <dt className="text-[15px] text-white/75">{term}</dt>
                  <dd className="text-[17px] font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-white/15 pt-4 text-[15px] leading-6 text-white/80">
              Scholarships are competitive. Meeting the age or qualification criteria makes you eligible to apply; it does not secure an award.
            </p>
          </div>
        }
      />

      <TrustBar />

      <Section
        title="What does a CSC scholarship cover?"
        intro="CSC (China Scholarship Council) is one of the most generous fully-funded government scholarships available to students from Bangladesh."
        action={<Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">Compare every scholarship route <ArrowRight size={16} aria-hidden="true" /></Link>}
      >
        <div data-anim="stagger" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cscCoverage.map(item => (
            <div key={item.title} className={kit.cardSage}>
              <span className={kit.icon}><item.icon size={22} aria-hidden="true" /></span>
              <h3 className={`mt-5 ${kit.h3}`}>{item.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-ink-soft">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className={`mt-5 ${kit.cardLime}`}>
          <h3 className={kit.h3}>Know the coverage limits</h3>
          <ul className="mt-3 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
            {[
              'A partial scholarship can fund only some of these items. Read the written coverage of your specific award.',
              'Airfare is included only where your specific award expressly covers it.',
              'Continued funding can depend on an annual review of academic progress, attendance and conduct.',
              'Keep CNY and BDT separate until a rate is supplied, and plan the cash you need before the first stipend arrives.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-[16px] leading-7 text-ink-soft">
                <Check size={17} className="mt-1.5 shrink-0 text-petrol-800" aria-hidden="true" />{item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        tone="sage"
        title="CSC Type A vs Type B for Bangladeshi students."
        intro="These labels identify application routes. Type A is not a synonym for full funding, and Type B does not mean partial funding."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          {cscTypes.map(item => (
            <article key={item.type} className={kit.card}>
              <span className={kit.badge}>{item.type}</span>
              <h3 className={`mt-4 ${kit.h3}`}>{item.appliedThrough}</h3>
              <dl className="mt-4 divide-y divide-canvas-soft border-y border-canvas-soft text-[16px]">
                <div className="py-3"><dt className="text-[14px] font-semibold text-ink-soft">Target group</dt><dd className="mt-1 text-petrol-800">{item.bestFor}</dd></div>
                <div className="py-3"><dt className="text-[14px] font-semibold text-ink-soft">Typical window</dt><dd className="mt-1 font-semibold text-petrol-800">{item.deadline}</dd></div>
              </dl>
              <p className="mt-4 text-[15px] leading-6 text-ink-soft">{item.keyNote}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[16px] leading-7 text-ink-soft">
          Windows vary by year and by university. Check the current notice for your route, and see{' '}
          <Link href="/china-intakes-deadlines" className="font-semibold text-petrol-800 underline underline-offset-4">China intakes and deadlines</Link> for the March and September 2027 windows.
        </p>
      </Section>

      <Section
        title="Required document checklist for Bangladesh."
        intro="All academic certificates and transcripts must be notarized and verified by the Ministry of Foreign Affairs (MOFA) Bangladesh before submitting to CSC."
      >
        <ol data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requiredDocuments.map((doc, index) => (
            <li key={doc} className={`flex items-start gap-3.5 ${kit.cardSage} !p-5`}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lime font-display text-[16px] font-black text-petrol-800" aria-hidden="true">{index + 1}</span>
              <span className="text-[16px] leading-6 text-petrol-800">{doc}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex items-start gap-2.5 text-[15px] leading-6 text-ink-soft">
          <FileText size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
          The receiving university or authority sets the final checklist. Your admission documents support both self-funded and scholarship applications.
        </p>
      </Section>

      <Section tone="navy" title="EduExpress China visa-first policy." intro={visaFirstTerms}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/china-visa-first-policy" className="ed-btn ed-btn-signal min-h-[52px] px-7">Read the visa-first policy <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">How we handle fees</Link>
        </div>
      </Section>

      <FaqBlock items={faqs} tone="sage" />

      <Section id="csc-assessment" title="Check your CSC scholarship fit." intro="Share your GPA, major, and intake. Our team will evaluate your chances for CSC Type A & Type B routes in writing.">
        <EducationFitAssessment />
      </Section>

      <Section tone="sage" title="Keep planning your scholarship.">
        <nav aria-label="Related China guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-[64px] items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">
                  {item.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <CtaBand title="Find your scholarship route." text="Share your qualifications, intended major and budget. A counsellor replies within one working day with suitable CSC and university scholarship routes and the costs that remain." />
    </>
  );
}

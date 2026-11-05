import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, Fingerprint, Search, Wallet } from 'lucide-react';
import ChinaServicePackages from '@/components/china/ChinaServicePackages';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getUniversityRecords } from '@/lib/university-records';

const PATH = '/services';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export async function generateMetadata() {
  // The production image is built without a database; fall back to a count-free description.
  const universityCount = await getUniversityRecords().then(records => records.length, () => 0);
  return pageMetadata({
    title: 'Study Abroad Services: Admission, Costs & Visa | EduExpress',
    description:
      universityCount > 0
        ? `Evidence-first education guidance covering education fit, written cost comparison and visa readiness, backed by ${universityCount}+ verified university records.`
        : 'Evidence-first education guidance covering education fit, written cost comparison, application proof tracking and visa readiness.',
    path: PATH,
  });
}

const mainServices = [
  {
    id: 'edufit-decision-report',
    number: '01',
    title: 'EduFit Decision Report',
    label: 'University selection and entry logic',
    copy: 'At least three suitable routes evaluated against your grades, budget and career goals, explaining why each option is recommended or rejected.',
    icon: Search,
    features: ['Personalised university and programme matching', 'Academic entry-requirement logic', 'Written recommendation rationale', 'Comparison of up to 3 institutions', 'Rejection-risk assessment'],
    link: '/better-education-standard',
    tone: kit.cardSage,
  },
  {
    id: 'clearcost-sheet',
    number: '02',
    title: 'ClearCost Sheet',
    label: 'Financial schedule and fee separation',
    copy: 'An itemised written cost schedule separating university tuition, hostel, embassy and third-party fees from EduExpress charges.',
    icon: Wallet,
    features: ['Scholarship eligibility and coverage check', 'Tuition vs third-party fee separation', 'Written refund terms', 'Official fee payment recipients', 'No hidden file-opening charges'],
    link: '/fees-and-transparency',
    tone: kit.cardLime,
  },
  {
    id: 'application-proof-pack',
    number: '03',
    title: 'Application Proof Pack',
    label: 'Timestamped dossier and receipt tracking',
    copy: 'Timestamped submission references, official university fee receipts, offer records and assigned counsellor tracking.',
    icon: ClipboardCheck,
    features: ['Timestamped portal submission proof', 'Official JW202 form tracking', 'Registrar follow-up record', 'Deadline monitoring', 'Student keeps the full copy package'],
    link: '/how-we-verify-universities',
    tone: kit.cardSage,
  },
  {
    id: 'visa-readiness-record',
    number: '04',
    title: 'Visa Readiness Record',
    label: 'Document checklist and embassy protocol',
    copy: 'Document gap analysis, official embassy checklist review, and a written explanation of where the outcome responsibility sits.',
    icon: Fingerprint,
    features: ['Embassy document checklist review', 'Police clearance and medical coaching', 'Interview preparation', 'Escalation support', 'Written outcome limits'],
    link: '/china-student-visa-bangladesh',
    tone: kit.cardDark,
  },
];

const processSteps = [
  { step: '01', title: 'Education fit assessment', copy: 'Free evaluation of academic background, budget, language readiness and career goals' },
  { step: '02', title: 'Decision report', copy: 'Compare at least three suitable routes with written reasons to recommend or reject' },
  { step: '03', title: 'ClearCost schedule', copy: 'Separates university, embassy and third-party fees from EduExpress charges' },
  { step: '04', title: 'Application proof pack', copy: 'Submit applications with timestamped references and receipts' },
  { step: '05', title: 'Visa readiness record', copy: 'Document checklist and official embassy guidance reviewed before departure' },
];

const bringList = [
  ['Academic record', 'Your latest SSC/HSC or bachelor transcripts'],
  ['Subject direction', 'The programme or career area you want to explore'],
  ['Budget reality', 'A practical range for tuition and living costs'],
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Study abroad services',
      inLanguage: 'en-BD',
      about: { '@id': 'https://eduexpressint.com/#organization' },
      isPartOf: { '@id': 'https://eduexpressint.com/#website' },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      mainEntity: { '@id': `${PAGE_URL}#services` },
    },
    {
      '@type': 'ItemList',
      '@id': `${PAGE_URL}#services`,
      name: 'The four documents every EduExpress student receives',
      numberOfItems: mainServices.length,
      itemListElement: mainServices.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.copy,
          url: `${PAGE_URL}#${service.id}`,
          provider: { '@id': 'https://eduexpressint.com/#organization' },
        },
      })),
    },
  ],
};

export default async function ServicesPage() {
  const { servicePackages } = await getPublicTrustRecords();
  const chinaPackages = servicePackages.filter(item => item.destination === 'China');

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Services' }]}
        eyebrow="Study abroad services"
        title="Four documents. No spoken promises."
        lead="Our services are defined by the paperwork you leave with: which universities were compared, what each payment covers, what was submitted, and what the visa file still needs."
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get a free fit assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[52px] px-7">Read the fee policy</Link>
          </>
        }
        aside={
          <nav aria-label="The four service documents" className={kit.cardDark}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white/70">What you leave with</p>
            <ol className="mt-5 divide-y divide-white/15">
              {mainServices.map(service => (
                <li key={service.id}>
                  <a href={`#${service.id}`} className="group flex min-h-[64px] items-center gap-4 py-3">
                    <span className="font-display text-[26px] font-black leading-none text-lime">{service.number}</span>
                    <span className="flex-1">
                      <span className="block text-[18px] font-semibold text-white">{service.title}</span>
                      <span className="block text-[14px] text-white/70">{service.label}</span>
                    </span>
                    <ArrowRight size={18} className="shrink-0 text-lime transition group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        }
      />

      <TrustBar />

      <Section title="What every student receives." intro="Delivered before any payment or commitment.">
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          {mainServices.map(({ id, number, title, label, copy, icon: Icon, features, link, tone }) => {
            const dark = tone === kit.cardDark;
            return (
              <article key={id} id={id} className={`${tone} scroll-mt-28 flex flex-col`}>
                <div className="flex items-center justify-between">
                  <span className={dark ? kit.iconLime : kit.icon}><Icon size={22} aria-hidden="true" /></span>
                  <span className={`font-display text-[28px] font-black leading-none ${dark ? 'text-white/30' : 'text-petrol-800/25'}`} aria-hidden="true">{number}</span>
                </div>
                <h3 className={`mt-6 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>{title}</h3>
                <p className={`mt-1 text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{label}</p>
                <p className={`mt-3 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{copy}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {features.map(feature => (
                    <li key={feature} className={`flex gap-2.5 text-[15px] leading-6 ${dark ? 'text-white/85' : 'text-petrol-800'}`}>
                      <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${dark ? 'text-lime' : 'text-petrol-800'}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={link}
                  className={`mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-6 text-[16px] font-semibold underline-offset-4 hover:underline ${dark ? 'text-white' : 'text-petrol-800'}`}
                >
                  Inspect what this document contains <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </Section>

      {chinaPackages.length > 0 && <ChinaServicePackages packages={chinaPackages} />}

      <Section tone="navy" title="The working sequence." intro="Five stages, each with a document attached. Universities decide admission and scholarships; authorities decide visas.">
        <ol data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map(({ step, title, copy }) => (
            <li key={step} className="rounded-3xl border border-white/15 p-6">
              <span className="font-display text-[30px] font-black leading-none text-lime">{step}</span>
              <h3 className="mt-4 text-[19px] font-semibold leading-snug text-white">{title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-white/75">{copy}</p>
            </li>
          ))}
        </ol>
        <Link href="/your-study-journey" className="ed-btn ed-btn-on-dark mt-10 min-h-[52px] px-7">See the full seven-stage journey <ArrowRight size={18} aria-hidden="true" /></Link>
      </Section>

      <Section tone="sage">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-14">
          <div data-anim="up">
            <p className={kit.badge}>Compare before you commit</p>
            <h2 className={`mt-5 ${kit.h2}`}>Bring your results, budget and ambition. Leave with a clearer decision.</h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Get my free fit assessment <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="ed-btn ed-btn-outline min-h-[52px] px-7">Visit the Dhanmondi office</Link>
            </div>
          </div>
          <ol data-anim="stagger" className="grid gap-4">
            {bringList.map(([title, copy], index) => (
              <li key={title} className={`${kit.card} flex gap-5`}>
                <span className="font-display text-[28px] font-black leading-none text-petrol-800/30" aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3 className={kit.h3}>{title}</h3>
                  <p className="mt-1 text-[16px] leading-7 text-ink-soft">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand title="Start with stage one." text="The free fit assessment is the first step. Share your results, budget and preferred country, and a counsellor explains realistic options, the complete cost and the documents to prepare." />
    </>
  );
}

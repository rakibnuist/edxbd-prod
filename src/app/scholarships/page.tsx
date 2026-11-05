import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeDollarSign, CheckCircle2, CircleAlert, FileSearch, GraduationCap, WalletCards } from 'lucide-react';

import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const PATH = '/scholarships';
const canonical = absoluteUrl(PATH);
const LAST_REVIEWED = '2026-11-04';

export const metadata = pageMetadata({
  title: 'Scholarship Guidance for Bangladeshi Students | EduExpress',
  description:
    'Scholarship guidance for Bangladeshi students: check eligibility, exact coverage, renewal rules and what your family still pays before you apply abroad.',
  path: PATH,
  image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — scholarship guidance for Bangladeshi students' },
});

const checks = [
  {
    icon: GraduationCap,
    title: 'Education fit first',
    copy: 'The program and university must fit your academic direction, recognition needs and career goals before chasing an award.',
    tone: kit.cardSage,
  },
  {
    icon: BadgeDollarSign,
    title: 'Exact coverage',
    copy: 'Confirm whether tuition, accommodation, stipend, insurance, fees or deposits are covered, and get it in writing.',
    tone: kit.cardLime,
  },
  {
    icon: FileSearch,
    title: 'Eligibility and evidence',
    copy: 'Check grades, language, tests, portfolio, documents and whether a separate scholarship application is required.',
    tone: kit.cardSage,
  },
  {
    icon: WalletCards,
    title: 'Remaining family cost',
    copy: 'Calculate living, travel, visa, medical, translation and any uncovered costs for the full program duration.',
    tone: kit.cardDark,
  },
];

const comparisonItems = [
  'Official scholarship name, provider and source URL',
  'Eligible university, program and intake',
  'Award amount or exact coverage (itemised)',
  'Renewal conditions, GPA requirements and terms',
  'Application deadline, result timeline and process',
  'Remaining first-year and estimated total program costs',
];

const guides = [
  { label: 'China scholarships explained', text: 'CSC, provincial and university awards', href: '/china-scholarships-bangladesh' },
  { label: 'CSC scholarship from Bangladesh', text: 'Chinese Government Scholarship routes', href: '/csc-scholarship-bangladesh' },
  { label: 'Cost of studying in China', text: 'Tuition, hostel, insurance, visa and travel', href: '/study-in-china-cost-bangladesh' },
  { label: 'University and program finder', text: 'Scholarships on file, per university', href: '/universities' },
];

const faqs = [
  {
    question: 'Can EduExpress guarantee a scholarship?',
    answer:
      'No. Scholarship decisions are made by universities and awarding bodies. We help you identify realistic opportunities, check eligibility, prepare a complete file and verify coverage in writing, but we cannot guarantee an award.',
  },
  {
    question: 'What does a "full scholarship" actually cover?',
    answer:
      'It varies. Some cover tuition only; others cover tuition, accommodation, monthly stipend, insurance and airfare. Always ask for an itemised breakdown in writing and confirm what remains payable.',
  },
  {
    question: 'Should I apply for scholarships before choosing a university?',
    answer:
      'Start with education fit first. Shortlist universities and programs that are realistic for your profile, then check which scholarships apply to those options for your intake. This avoids applying to awards you cannot actually use.',
  },
  {
    question: 'Are there scholarships for Bangladeshi students with moderate grades?',
    answer:
      'Yes, though competition is high. Many opportunities consider the full profile (academics, motivation, fit). We focus on realistic options based on published criteria for your intake, not just headline amounts.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Scholarship guidance for Bangladeshi students',
      description:
        'Understand scholarship eligibility, exact coverage, renewal conditions, remaining costs and application readiness before applying for overseas education.',
      inLanguage: 'en-BD',
      dateModified: LAST_REVIEWED,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl('/images/home/consultation-family.webp') },
    },
    {
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: 'Scholarship guidance and comparison',
      serviceType: 'Education consultancy',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      description: 'Compare scholarships by exact coverage, eligibility, renewal conditions and remaining costs across study destinations.',
    },
  ],
};

export default function ScholarshipsPage() {
  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Scholarships' }]}
        eyebrow="Scholarship guidance · evidence first"
        title="Funding should improve a good decision, not create a bad one."
        lead={
          <>
            We assess scholarships after education fit. The useful question isn&apos;t just &ldquo;how much?&rdquo; It&apos;s what the
            award covers, what keeps it active, and what your family still needs to pay.
          </>
        }
        reviewed="November 2026"
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Check my education and funding fit <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore China scholarships <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/consultation-family.webp"
                alt="A counsellor meeting a student and a family member at the EduExpress office"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-4 py-3">
              <span className="block text-[14px] font-semibold text-ink-soft">Read past the headline</span>
              <span className="mt-0.5 block text-[16px] font-semibold leading-6 text-petrol-800">Coverage · Conditions · Remaining costs · Fit</span>
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <Section
        title="Read past the scholarship headline."
        intro="Four checks before you apply. A realistic shortlist starts with fit, then checks exact coverage and what your family still needs to pay."
        action={
          <Link href="/find-education" className="ed-btn ed-btn-outline min-h-[52px] px-7">
            Research destinations and universities <ArrowRight size={18} aria-hidden="true" />
          </Link>
        }
      >
        <ol data-anim="stagger" className="grid gap-5 sm:grid-cols-2">
          {checks.map(({ icon: Icon, title, copy, tone }, index) => {
            const dark = tone === kit.cardDark;
            return (
              <li key={title} className={tone}>
                <span className="flex items-center justify-between gap-4">
                  <span className={dark ? kit.iconLime : kit.icon}><Icon size={22} aria-hidden="true" /></span>
                  <span className={`font-display text-[15px] font-black tracking-[0.08em] ${dark ? 'text-white/75' : 'text-ink-soft'}`}>CHECK 0{index + 1}</span>
                </span>
                <h3 className={`mt-6 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>{title}</h3>
                <p className={`mt-2 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{copy}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section tone="sage">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <h2 data-anim="up" className={kit.h2}>The award and the cost beside it.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              A scholarship is only meaningful when the official conditions and your remaining financial responsibility are visible
              together, side by side. This is what a written comparison should show.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Get a written comparison <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[52px] px-7">How we handle fees</Link>
            </div>
          </div>
          <ul data-anim="stagger" className="grid gap-3">
            {comparisonItems.map(item => (
              <li key={item} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4">
                <CheckCircle2 size={20} className="shrink-0 text-[#2ead4b]" aria-hidden="true" />
                <span className="text-[16px] font-semibold leading-6 text-petrol-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/85">
              <CircleAlert size={18} className="text-lime" aria-hidden="true" /> Important
            </p>
            <h2 data-anim="pop" className={`mt-4 ${kit.h2OnDark}`}>No scholarship guarantee.</h2>
            <p className="mt-5 max-w-2xl text-[18px] leading-[1.6] text-white/85">
              Scholarship bodies and universities decide awards. Published criteria, deadlines and availability can change. We help
              compare, prepare and verify the current route, but cannot guarantee an award.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <Link href="/better-education-standard" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              See our evidence standard <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/how-we-verify-universities" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">How we verify records</Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
          <div>
            <h2 data-anim="up" className={kit.h2}>Bring your profile, not just a scholarship screenshot.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              Your results, subject, budget, intake and language readiness determine which opportunities are worth checking. Get a
              written read on realistic routes before applying.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Start free assessment <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/destinations" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                Explore destinations <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className={kit.h3}>Scholarship and cost guides</h3>
            <ul data-anim="stagger" className="mt-5 grid gap-3">
              {guides.map(guide => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="group flex min-h-[72px] items-center justify-between gap-4 rounded-2xl bg-canvas-soft px-5 py-4 transition-colors hover:bg-lime-pale"
                  >
                    <span>
                      <span className="block text-[17px] font-semibold text-petrol-800">{guide.label}</span>
                      <span className="mt-0.5 block text-[15px] text-ink-soft">{guide.text}</span>
                    </span>
                    <ArrowUpRight size={18} className="shrink-0 text-petrol-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <FaqBlock items={faqs} title="Scholarship questions, answered." />

      <CtaBand
        title="Check your funding fit."
        text="Share your results, subject, budget and intake. A counsellor replies with realistic routes, the scholarships worth checking and what your family would still pay, in writing."
      />
    </>
  );
}

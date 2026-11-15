import Link from 'next/link';
import { ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { getChinaIntakes, CHINA_INTAKE_VERIFIED_ON, CHINA_INTAKE_NEXT_REVIEW } from '@/lib/china-intakes';
import { CHINA_REPORT_OFFICIAL_AUTHORITIES } from '@/lib/china-benchmark';
import { citationJsonLd } from '@/lib/json-ld';
import { canApplyToIntake } from '@/lib/intake-status';
import type { IntakeStatus } from '@/lib/intake-status';
import { ogImage, pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

const SITE = 'https://eduexpressint.com';
const PATH = '/china-intakes-deadlines';

export const metadata = pageMetadata({
  title: 'China University Intakes & Deadlines 2027 | EduExpress',
  description:
    'March 2027 and September 2027 China intake windows for Bangladeshi students: applications, CSC and university deadlines, checked with admissions offices.',
  path: PATH,
  type: 'article',
  locale: 'en_BD',
  image: ogImage('china', 'A student at the I love NUIST sign on campus in Nanjing'),
});

// 2027 windows follow each intake's typical admissions cycle (applications open
// the previous autumn; university deadlines as tracked with admissions offices).
// getIntakeStatus() derives Open/Closing/Next Intake automatically; if verification
// expires before a counselor re-checks the window, the card flips to
// "Under Verification" instead of showing a stale promise.
const VERIFIED_ON = CHINA_INTAKE_VERIFIED_ON;
const NEXT_SCHEDULED_REVIEW = CHINA_INTAKE_NEXT_REVIEW;
// "26 October 2026" -> "October 2026" for the hero's last-updated line.
const VERIFIED_MONTH = VERIFIED_ON.split(' ').slice(-2).join(' ');

const statusStyles: Record<IntakeStatus, string> = {
  Open: 'bg-lime-pale text-lime-deep',
  Closing: 'bg-lime text-petrol-800',
  Closed: 'bg-canvas-soft text-ink-soft',
  'Next Intake': 'bg-canvas-soft text-petrol-800',
  'Under Verification': 'bg-canvas-soft text-ink-soft',
};

const timelineSteps = [
  { step: 'Fit assessment & document prep', window: '4–6 months before intake', detail: 'Gather SSC/HSC/Degree transcripts, passport, physical exam, and police clearance.' },
  { step: 'University & CSC portal submission', window: '3–5 months before intake', detail: 'Submit application to target universities and CSC portal with verified certificates.' },
  { step: 'Admission notice & JW201/JW202 issuance', window: '2–3 months before intake', detail: 'Receive official admission package and Chinese Ministry of Education JW form.' },
  { step: 'Visa filing via CVASC Dhaka', window: 'Before departure', detail: 'Submit your X1/X2 student visa application via Chinese Visa Center Dhaka and avoid non-refundable tickets until approval.' },
];

const guides = [
  { label: 'March 2027 university shortlist', href: '/china-march-2027-intake' },
  { label: 'China scholarships for Bangladeshi students', href: '/china-scholarships-bangladesh' },
  { label: 'CSC scholarship guide', href: '/csc-scholarship-bangladesh' },
  { label: 'MBBS in China & BMDC guide', href: '/mbbs-in-china-bangladesh' },
  { label: 'China admission requirements', href: '/china-admission-requirements' },
  { label: 'China student visa from Bangladesh', href: '/china-student-visa-bangladesh' },
  { label: 'CSCA entrance exam guide', href: '/updates/csca-guide-study-in-china' },
  { label: 'China K-Visa STEM graduate route', href: '/updates/china-k-visa' },
  { label: 'Bangladesh-China cost benchmark', href: '/china-study-report-bangladesh' },
  { label: 'Program & tuition finder', href: '/programs' },
  { label: 'Study in China from Bangladesh', href: '/study-in-china-from-bangladesh' },
];

const intakeFaqs = [
  {
    question: 'Should Bangladeshi students aim for March or September intake in China?',
    answer:
      'September (Autumn) is the primary intake in China: nearly all English-taught Bachelor’s, Master’s, PhD and MBBS degrees open, and the widest Chinese Government (CSC) and provincial scholarship quotas target September. March (Spring) offers faster entry without waiting another year, mainly for Chinese language, preparatory tracks and selected engineering/business programmes.',
  },
  {
    question: 'When do CSC scholarships close for the September intake?',
    answer:
      'Most CSC Type A and Type B windows close between December and March ahead of the September term, while university self-funded or partial-award deadlines often continue through April to June depending on seat availability.',
  },
  {
    question: 'Can I apply before my final HSC or Bachelor transcript is published?',
    answer:
      'Some Chinese universities accept an official expected-graduation or pre-graduation letter during early rounds, subject to submitting the final notarised certificate and transcript before registration or JW201/JW202 issuance. Confirm your exact university rule before paying any application fee.',
  },
  {
    question: 'Does EduExpress submit student visas through a special Embassy quota?',
    answer:
      'No. As publicly notified by the Chinese Embassy in Bangladesh, China does not appoint exclusive or special visa agencies, and visa applications go through CVASC Dhaka. Admission, scholarships and visas remain independent decisions, and EduExpress charges zero service fee before China visa approval.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE}${PATH}#page`,
  url: `${SITE}${PATH}`,
  name: 'China University Intakes & Deadlines 2027',
  description: 'March 2027 and September 2027 China intake windows, CSC and university deadlines for Bangladeshi applicants.',
  inLanguage: 'en-BD',
  mainEntityOfPage: `${SITE}${PATH}`,
  dateModified: '2026-10-26T00:00:00Z',
  author: { '@id': `${SITE}/#organization` },
  reviewedBy: { '@id': `${SITE}/#organization` },
  isPartOf: { '@id': `${SITE}/#website` },
  publisher: { '@id': `${SITE}/#organization` },
  breadcrumb: { '@id': `${SITE}${PATH}#breadcrumb` },
  ...citationJsonLd([...CHINA_REPORT_OFFICIAL_AUTHORITIES]),
};

export default function ChinaIntakesDeadlinesPage() {
  const intakes = getChinaIntakes();
  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: 'Intakes & deadlines' }]}
        eyebrow="Intake calendar · March & September 2027"
        title="China university intakes and deadlines."
        lead="Plan your application timeline for March and September intakes. Stay ahead of CSC scholarship deadlines, university admission rounds, and visa processing windows."
        reviewed={VERIFIED_MONTH}
        actions={
          <>
            <a href="#intake-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">Check upcoming intake slots <ArrowRight size={18} aria-hidden="true" /></a>
            <Link href="/china-march-2027-intake" className="ed-btn ed-btn-outline min-h-[52px] px-7">March 2027 shortlist</Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-white/70">Upcoming China intakes</p>
            <ul className="mt-2 divide-y divide-white/15">
              {intakes.map(intake => (
                <li key={intake.name} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[18px] font-semibold text-white">{intake.name.split(' — ')[0]}</p>
                    <span className={`rounded-full px-3 py-1 text-[14px] font-semibold ${statusStyles[intake.status]}`}>{intake.status}</span>
                  </div>
                  <p className="mt-1 text-[15px] leading-6 text-white/80">Applications open {intake.opensLabel} · university deadline <span className="font-semibold text-lime">{intake.deadlineLabel}</span></p>
                </li>
              ))}
            </ul>
            <p className="mt-2 flex items-start gap-2 border-t border-white/15 pt-4 text-[14px] leading-6 text-white/75">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />Window status checked on {VERIFIED_ON}.
            </p>
          </div>
        }
      />

      <TrustBar />

      <Section title="March vs September intake windows." intro="Two intakes a year. September is the main intake for degree programmes; March is the secondary intake with a narrower choice of programmes.">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          {intakes.map(intake => (
            <article key={intake.name} className={kit.cardOutline}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={kit.badge}>{intake.badge}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] font-semibold ${statusStyles[intake.status]}`} data-intake-status={intake.status}>
                  <Calendar size={14} aria-hidden="true" />{intake.status}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[28px] font-black leading-[1.05] text-petrol-800">{intake.name}</h3>
              <dl className="mt-5 divide-y divide-canvas-soft border-y border-canvas-soft text-[16px]">
                {[
                  ['Applications open', intake.applicationsOpen],
                  ['CSC scholarship deadline', intake.cscDeadline],
                  ['University deadline', intake.universityDeadline],
                  ['Classes start', intake.classesStart],
                ].map(([term, value]) => (
                  <div key={term} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3">
                    <dt className="text-ink-soft">{term}</dt>
                    <dd className="font-semibold text-petrol-800">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-[15px] leading-6 text-ink-soft"><strong className="text-petrol-800">Available courses:</strong> {intake.programs}</p>
              {canApplyToIntake(intake.status) && (
                intake.activeCampaignHref
                  ? <Link href={intake.activeCampaignHref} className="ed-btn ed-btn-signal mt-6 min-h-[50px] px-6">See the March 2027 university shortlist <ArrowRight size={17} aria-hidden="true" /></Link>
                  : <a href="#intake-assessment" className="ed-btn ed-btn-outline mt-6 min-h-[50px] px-6">Start your September 2027 plan <ArrowRight size={17} aria-hidden="true" /></a>
              )}
              {intake.status === 'Under Verification' && (
                <p className="mt-6 rounded-2xl bg-canvas-soft p-4 text-[15px] leading-6 text-ink-soft">We are re-verifying this application window with admissions offices. Ask a counsellor for the current deadline.</p>
              )}
            </article>
          ))}
        </div>

        <p className="mt-8 flex max-w-4xl items-start gap-3 text-[15px] leading-6 text-ink-soft">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
          <span>
            Window status checked on <strong className="text-petrol-800">{VERIFIED_ON}</strong> against university admissions-office updates. Next check scheduled for {NEXT_SCHEDULED_REVIEW}.
            If a window is awaiting re-verification we label it &ldquo;Under Verification&rdquo; rather than show a stale deadline.
          </span>
        </p>
      </Section>

      <Section tone="sage" title="Recommended application roadmap." intro="Work back from your intake. Each step depends on the one before it, so start your documents early.">
        <ol data-anim="stagger" className="grid gap-4 md:grid-cols-2">
          {timelineSteps.map((item, index) => (
            <li key={item.step} className={kit.card}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-lime font-display text-[18px] font-black text-petrol-800" aria-hidden="true">{index + 1}</span>
                <span className="rounded-full bg-canvas-soft px-3.5 py-1.5 text-[14px] font-semibold text-petrol-800">{item.window}</span>
              </div>
              <h3 className={`mt-4 ${kit.h3}`}>{item.step}</h3>
              <p className={`mt-2 ${kit.body}`}>{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy" title="Visa-first service terms." intro="EduExpress International tracks intake windows directly with university admissions offices. No file opening charge, and no EduExpress service fee before your China visa approval. University, embassy and other third-party charges required earlier are itemised in writing before you proceed.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/china-visa-first-policy" className="ed-btn ed-btn-signal min-h-[52px] px-7">Read the visa-first policy <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">How we handle fees</Link>
        </div>
      </Section>

      <Section title="Plan around your intake.">
        <nav aria-label="Related China guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-[64px] items-center justify-between gap-4 rounded-3xl bg-canvas-soft px-5 py-4 text-[16px] font-semibold text-petrol-800 transition-colors hover:bg-lime-pale">
                  {item.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <div id="intake-faq" className="scroll-mt-28">
        <FaqBlock items={intakeFaqs} title="China intake & deadline FAQs." tone="sage" />
      </div>

      <Section id="intake-assessment" title="Check your intake fit." intro="Share your results, subject and preferred intake. A counsellor reviews which March or September 2027 routes suit you.">
        <EducationFitAssessment />
      </Section>

      <CtaBand title="Do not miss your intake." text="Tell us which intake you are aiming for. A counsellor replies within one working day with the deadlines, documents and costs for your route, in writing." />
    </>
  );
}

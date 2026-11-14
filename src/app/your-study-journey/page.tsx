import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { ogImage, pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const PATH = '/your-study-journey';
const canonical = absoluteUrl(PATH);

export const metadata = pageMetadata({
  title: 'Your Study Abroad Journey in 7 Stages | EduExpress',
  description:
    'See the seven-stage EduExpress journey from education fit and applications to visa readiness, departure and university registration, each with a clear output.',
  path: PATH,
  locale: 'en_BD',
  image: ogImage('journey', 'A Bangladeshi family seeing a student off at Dhaka airport'),
});

type JourneyStage = {
  id: string;
  number: string;
  title: string;
  promise: string;
  work: string[];
  output: string;
  owner: string;
  icon: LucideIcon;
  image?: string;
  /** Photo description; falls back to the stage title. */
  alt?: string;
};

const stages: JourneyStage[] = [
  {
    id: 'education-fit',
    number: '01',
    title: 'Open your education profile',
    promise: 'The journey begins with your academic reality, goals and family budget—not a pre-selected country.',
    work: ['Review level, results and study gaps', 'Understand subject and career direction', 'Record budget, intake and language readiness'],
    output: 'Education profile',
    owner: 'Student + EduExpress counselor',
    icon: Sparkles,
    image: '/images/office/counselor-office.webp',
    alt: 'EduExpress counselor at the decision desk',
  },
  {
    id: 'compare-options',
    number: '02',
    title: 'Compare suitable options',
    promise: 'Countries, universities and programs are compared against the same education-fit questions.',
    work: ['Check institution and program recognition', 'Compare entry requirements and curriculum fit', 'Identify risks, missing facts and alternatives'],
    output: 'EduFit comparison',
    owner: 'EduExpress research + counseling',
    icon: Search,
  },
  {
    id: 'clear-costs',
    number: '03',
    title: 'See the complete cost',
    promise: 'A scholarship or tuition figure is not the whole financial decision.',
    work: ['Separate university, official and EduExpress charges', 'Add living, travel and document-related costs', 'Record payment timing, recipient and known conditions'],
    output: 'Itemised fee schedule',
    owner: 'EduExpress explains; family decides',
    icon: WalletCards,
  },
  {
    id: 'application-file',
    number: '04',
    title: 'Build and submit the application file',
    promise: 'Documents are prepared against the selected institution’s current requirements.',
    work: ['Create the document checklist', 'Check consistency, translations and required formats', 'Record submissions and outstanding conditions'],
    output: 'Application Proof Pack',
    owner: 'Student supplies originals; EduExpress supports preparation',
    icon: ClipboardCheck,
    image: '/images/office/admission-packets.webp',
    alt: 'Admission envelopes from Nanjing University of Information Science and Technology with EduExpress file notes',
  },
  {
    id: 'visa-to-registration',
    number: '05',
    title: 'Admission and visa readiness',
    promise: 'An offer is checked for conditions, then the visa file is prepared against official requirements.',
    work: ['Review offer conditions and next deadlines', 'Build the visa-readiness checklist', 'Explain evidence gaps and authority-controlled decisions'],
    output: 'Offer + visa checklist',
    owner: 'University and authority decide; EduExpress prepares',
    icon: ShieldCheck,
  },
  {
    id: 'departure',
    number: '06',
    title: 'Prepare to fly',
    promise: 'Departure is planned as a handover into student life, not the end of the service story.',
    work: ['Review travel and arrival documents', 'Prepare first-day essentials and contact plan', 'Confirm institution arrival instructions'],
    output: 'Departure and arrival plan',
    owner: 'Student + family + EduExpress',
    icon: Plane,
    image: '/images/students/departure-airport.webp',
  },
  {
    id: 'registration',
    number: '07',
    title: 'Arrive and register at university',
    promise: 'The visible journey closes when the student reaches campus and understands the registration steps.',
    work: ['Follow the institution arrival process', 'Complete required registration steps', 'Know where to seek campus and emergency support'],
    output: 'Registration completion check',
    owner: 'Student + university, with EduExpress guidance',
    icon: GraduationCap,
    image: '/images/students/campus-nuist.webp',
    alt: 'A student at the I love NUIST sign on campus in Nanjing',
  },
];

export default function StudyJourneyPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Your complete study abroad journey',
        description:
          'Seven visible stages from education fit and applications to visa readiness, departure, arrival and university registration.',
        inLanguage: 'en-BD',
        dateModified: '2026-11-04',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#stages`,
        name: 'The seven stages of the EduExpress study journey',
        numberOfItems: stages.length,
        itemListElement: stages.map((stage) => ({
          '@type': 'ListItem',
          position: Number(stage.number),
          name: stage.title,
          url: `${canonical}#${stage.id}`,
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Your study journey' }]}
        eyebrow="File open → university registration"
        title="See your whole journey."
        lead="Seven visible stages. A clear output from each. Written responsibilities throughout, so your family understands what happens next."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start stage one free <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-[52px] px-7">Inspect the proof library</Link>
          </>
        }
        aside={
          <nav aria-label="Journey stages" className="rounded-3xl bg-white p-3">
            <ol className="grid gap-1">
              {stages.map((stage) => (
                <li key={stage.number}>
                  <a href={`#${stage.id}`} className="group flex min-h-[52px] items-center gap-4 rounded-2xl px-4 py-2.5 transition hover:bg-canvas-soft">
                    <span className="font-display text-[22px] font-black leading-none text-petrol-800/35 group-hover:text-petrol-800">{stage.number}</span>
                    <span className="flex-1 text-[16px] font-semibold leading-5 text-petrol-800">{stage.title}</span>
                    <ArrowRight size={16} className="shrink-0 text-petrol-800 transition group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        }
      />

      <TrustBar />

      <Section
        title="One file, seven visible handovers."
        intro="Each stage has a document you can keep and a named owner for the decision. Nothing moves forward on a spoken promise."
      >
        <p data-anim="up" className="mb-8 inline-block rounded-2xl bg-lime-pale px-4 py-3 text-[15px] font-semibold leading-6 text-lime-deep">Every stage answers three questions: what happens, what you receive, who owns the decision.</p>
        <div className="space-y-5">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const reverse = index % 2 === 1;
            const head = (
              <>
                <div className="flex items-start justify-between gap-6">
                  <span className={kit.icon}><Icon size={22} aria-hidden="true" /></span>
                  <span className="font-display text-[22px] font-black leading-none text-petrol-800/30">{stage.number} / 07</span>
                </div>
                <h3 className="mt-6 font-display text-[30px] font-black leading-[1] tracking-[-0.01em] text-petrol-800 sm:text-[36px]">{stage.title}</h3>
                <p className={`mt-3 ${kit.body}`}>{stage.promise}</p>
              </>
            );
            const body = (
              <>
                <ul className="grid gap-2.5">
                  {stage.work.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[16px] leading-6 text-petrol-800">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4">
                    <dt className="text-[14px] font-semibold text-ink-soft">What you receive</dt>
                    <dd className="mt-1 text-[16px] font-semibold text-petrol-800">{stage.output}</dd>
                  </div>
                  <div className="rounded-2xl bg-lime-pale p-4">
                    <dt className="text-[14px] font-semibold text-lime-deep">Responsibility</dt>
                    <dd className="mt-1 text-[16px] font-semibold text-petrol-800">{stage.owner}</dd>
                  </div>
                </dl>
              </>
            );
            return (
              <article id={stage.id} key={stage.number} data-anim="up" className="scroll-mt-28 overflow-hidden rounded-3xl bg-canvas-soft">
                {stage.image ? (
                  <div className="grid lg:grid-cols-2">
                    <figure className={`relative min-h-[280px] ${reverse ? 'lg:order-2' : ''}`}>
                      <Image
                        src={stage.image}
                        alt={stage.alt ?? `${stage.title} in the EduExpress student journey`}
                        fill
                        sizes="(max-width:1024px) 100vw, 600px"
                        className="object-cover"
                      />
                      <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
                        Stage {stage.number}
                      </figcaption>
                    </figure>
                    <div className="p-6 sm:p-8 lg:p-10">
                      {head}
                      <div className="mt-6">{body}</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
                    <div>{head}</div>
                    <div className="lg:pt-[72px]">{body}</div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="sage" title="Proof, and its limits.">
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          <article className={`${kit.card} flex flex-col`}>
            <span className={kit.iconLime}><FileCheck2 size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Proof travels with the journey</h3>
            <p className={`mt-2 ${kit.body}`}>
              EduExpress publishes privacy-safe examples of admission work, document records and institutional evidence. Your own file remains private.
            </p>
            <Link href="/proof-library" className="ed-btn ed-btn-soft mt-auto min-h-[48px] self-start px-6">
              Open proof library <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </article>
          <article className={`${kit.cardDark} flex flex-col`}>
            <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
            <h3 className="mt-6 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">Support is not a guarantee</h3>
            <p className="mt-2 text-[16px] leading-7 text-white/80">
              Universities decide admission and scholarships. Government authorities decide visas and permits. EduExpress can compare, prepare, check, explain and support, but cannot replace an official decision.
            </p>
            <div className="mt-6 flex flex-col gap-3 pt-0 sm:flex-row">
              <Link href="/better-education-standard" className="ed-btn ed-btn-signal min-h-[48px] px-6">Read our standard <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-on-dark min-h-[48px] px-6">How fees work</Link>
            </div>
          </article>
        </div>
      </Section>

      <CtaBand
        title="Open stage one with your real profile."
        text="The free assessment gives your counsellor the context needed to compare education routes responsibly."
      />
    </>
  );
}

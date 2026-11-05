import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle } from 'lucide-react';

import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';
import { FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';

const PATH = '/education-fit-assessment';
const canonical = absoluteUrl(PATH);
const LAST_REVIEWED = '2026-11-04';

export const metadata = pageMetadata({
  title: 'Free Education Fit Assessment for Study Abroad | EduExpress',
  description:
    'Free, written education fit assessment for Bangladeshi students. Compare study abroad routes, recognition, total costs and risks before you apply.',
  path: PATH,
  image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — free education fit assessment' },
});

const promises = [
  'We compare at least three suitable routes and explain why each is recommended or set aside.',
  'We separate university, embassy and third-party costs from EduExpress charges, in writing.',
  'No file-opening charge, and no EduExpress service fee before China visa approval.',
];

const whatYouGet = [
  'A written shortlist of realistic routes based on your profile',
  'Recognition, entry requirements and language fit for each option',
  'Itemised costs: tuition, living, fees and what remains payable',
  'Risks, timelines and documents still needed',
  'Clear next steps: apply only when fit and costs are clear',
];

const faqs = [
  {
    question: 'Is the education fit assessment really free?',
    answer:
      'Yes. The initial assessment is free. There is no obligation to proceed. For the China visa-first package, no EduExpress service fee is due before China visa approval; any third-party fees are itemised in writing if required earlier.',
  },
  {
    question: 'What should I prepare before taking the assessment?',
    answer:
      'Have your latest academic results/transcripts, passport details, budget range, preferred intake and subject/career goal ready. If you have test scores (IELTS/other), include them. Parents can join the conversation.',
  },
  {
    question: 'Do you guarantee admission, scholarship or visa?',
    answer:
      'No. Admission, funding and visa decisions belong to universities, scholarship bodies and embassies. We assess fit, prepare files properly, check against published rules and explain risks, but we cannot guarantee outcomes.',
  },
  {
    question: 'How long does it take to get the written assessment?',
    answer:
      'After you submit the form, a counsellor reviews your profile and shares a written response with suitable routes and next steps. Timing depends on completeness of information, but we aim to respond promptly during working hours.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: 'Free Education Fit Assessment',
      description: 'Free, written education fit assessment comparing suitable study-abroad routes, costs, risks and next steps before you commit.',
      inLanguage: 'en-BD',
      dateModified: LAST_REVIEWED,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl('/images/home/consultation-student-parent.webp') },
    },
    {
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: 'Free Education Fit Assessment',
      serviceType: 'Education counselling',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'Bangladesh' },
      description: 'Written comparison of suitable study routes with recognition, total costs, risks and missing information before applying.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT', availability: 'https://schema.org/InStock' },
    },
  ],
};

export default function EducationFitAssessmentPage() {
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Assalamu alaikum. I would like help with the education fit assessment.')}`;

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Education Fit Assessment' }]}
        eyebrow="Free · Written · No obligation"
        title="Free education fit assessment, in writing."
        lead="Compare before you commit. Share a few details about your results, budget, intake and goals. We return the suitable routes for you, the risks to weigh, and the information we still need, before any money or application is involved."
        reviewed="November 2026"
        actions={
          <>
            <a href="#assessment-form" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start my assessment <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/find-education" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Research destinations and universities <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/consultation-student-parent.webp"
                alt="A counsellor reviewing study options with a student and parent at the EduExpress office"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-4 py-3">
              <span className="block text-[14px] font-semibold text-ink-soft">Written before you commit</span>
              <span className="mt-0.5 block text-[16px] font-semibold leading-6 text-petrol-800">Routes · Risks · Costs · Next steps</span>
            </figcaption>
          </figure>
        }
      />

      <section aria-label="Our promises" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 md:grid-cols-3`}>
          {promises.map(promise => (
            <li key={promise} className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                <CheckCircle2 size={20} aria-hidden="true" />
              </span>
              <span className="text-[16px] font-semibold leading-6 text-petrol-800">{promise}</span>
            </li>
          ))}
        </ul>
      </section>

      <Section
        tone="sage"
        id="assessment-form"
        title="Share your profile to get your written assessment."
        intro="Takes a few minutes. No payment details required. We'll review and respond with suitable routes and next steps."
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <EducationFitAssessment />

          <aside className="grid gap-5">
            <div className={kit.card}>
              <h3 className={kit.h3}>What you get</h3>
              <ul className="mt-4 grid gap-3">
                {whatYouGet.map(item => (
                  <li key={item} className="flex gap-3 text-[16px] leading-6 text-ink-soft">
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-[#2ead4b]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={kit.cardDark}>
              <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">What it costs</h3>
              <p className="mt-2 text-[16px] leading-7 text-white/85">
                The assessment is free. No file-opening charge, and no EduExpress service fee before China visa approval. Genuine
                university and third-party costs are itemised in writing before you proceed.
              </p>
              <Link href="/fees-and-transparency" className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[16px] font-semibold text-white underline underline-offset-4">
                Read our fee policy <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <h2 data-anim="up" className={kit.h2}>A clear, written read on your fit.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              We don&apos;t just suggest countries. We compare realistic options against your profile and show the tradeoffs in
              writing, checked against published rules.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/better-education-standard" className="ed-btn ed-btn-outline min-h-[52px] px-7">
                See our evidence standard <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/how-we-verify-universities" className="ed-btn ed-btn-soft min-h-[52px] px-7">How we verify</Link>
            </div>
          </div>
          <ol data-anim="stagger" className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['01', 'Profile review', 'Results, goals, budget and preferred intake.'],
              ['02', 'Written comparison', 'Recognition, costs, risks and realistic options.'],
              ['03', 'Clear next steps', 'Apply only when the fit and the cost are clear.'],
            ].map(([number, title, copy]) => (
              <li key={number} className={`${kit.cardSage} flex gap-5`}>
                <span className="font-display text-[34px] font-black leading-none text-petrol-800">{number}</span>
                <span>
                  <strong className="block text-[18px] font-semibold text-petrol-800">{title}</strong>
                  <span className="mt-1 block text-[16px] leading-6 text-ink-soft">{copy}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <FaqBlock items={faqs} title="Common questions about the assessment." />

      <Section tone="navy" title="Prefer to talk to a person first?" intro="If you need clarification before submitting, we're happy to talk. Visit the Dhanmondi office or message a counsellor.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#assessment-form" className="ed-btn ed-btn-signal min-h-[54px] px-7">
            Start my assessment <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp a counsellor
          </a>
          <Link href="/contact" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">Contact EduExpress</Link>
        </div>
      </Section>
    </>
  );
}

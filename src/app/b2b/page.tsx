import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import B2BInquiryForm from '@/components/b2b/B2BInquiryForm';
import { FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { getB2BServiceCatalog } from '@/lib/b2b-service';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const PATH = '/b2b';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'B2B Study Abroad Services for Agencies | EduExpress',
  description:
    'Dedicated B2B admissions desk for education agencies and sub-agents: China & Malaysia processing, written SOPs, non-poaching protection, and custom MOU terms.',
  path: PATH,
  image: ogImage('about', 'EduExpress International B2B partner desk in Dhanmondi, Dhaka'),
});

export default async function B2BPage() {
  const catalog = await getB2BServiceCatalog();
  const phone = catalog.partnerDesk.phone;
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        mainEntityOfPage: PAGE_URL,
        datePublished: '2026-11-20',
        dateModified: '2026-11-20',
        name: 'B2B Study Abroad Services & Partner Admissions Desk',
        description:
          'Dedicated B2B file processing, SOP governance, non-poaching protection, and bilateral MOU cooperation for education agencies and sub-agents.',
        inLanguage: 'en-BD',
        about: { '@id': 'https://eduexpressint.com/#organization' },
        publisher: { '@id': 'https://eduexpressint.com/#organization' },
        isPartOf: { '@id': 'https://eduexpressint.com/#website' },
        primaryImageOfPage: primaryImageOfPageSchema('/og/about.jpg'),
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        mainEntity: { '@id': `${PAGE_URL}#service` },
      },
      {
        '@type': 'Service',
        '@id': `${PAGE_URL}#service`,
        name: 'EduExpress B2B Partner Admissions & Processing Service',
        serviceType: 'B2B Study Abroad Admissions Support',
        url: PAGE_URL,
        description:
          'Structured B2B admissions processing, eligibility verification, portal submission tracking, and visa readiness support for education agencies across China, Malaysia, and 10 active destinations under custom bilateral MOU terms.',
        provider: { '@id': 'https://eduexpressint.com/#organization' },
        areaServed: [
          { '@type': 'Country', name: 'Bangladesh' },
          { '@type': 'AdministrativeArea', name: 'International' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'B2B Partner Service Tracks',
          itemListElement: catalog.tracks.map((track) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: track.title,
              description: track.summary,
              url: `${PAGE_URL}#${track.id}`,
            },
          })),
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Services', path: '/services' }, { name: 'B2B Partner Desk' }]}
        eyebrow="B2B Partner Services · CBCA Founding Member (#08) & FACD-CAB (FCM-452) · Dhaka"
        title="A B2B admissions desk built on written terms."
        lead={`Dedicated student file processing for education agencies, sub-agents, and institutional partners across China, Malaysia, and ${catalog.activeDestinationCount - 2} other active destinations — backed by 24–48h file audits, non-poaching protection, and custom bilateral MOU terms.`}
        reviewed="November 2026"
        actions={
          <>
            <a href="#b2b-inquiry" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Request B2B onboarding <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#b2b-services" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Explore B2B services
            </a>
            <Link href="/partnership" className="ed-btn ed-btn-soft min-h-[52px] px-6">
              Global Partner Overview
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/education-partners-meeting.webp"
                alt="EduExpress representatives collaborating with education and university partners"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-canvas-soft bg-white px-5 py-3.5 text-[14px] font-semibold text-petrol-800">
              <span>Partner &amp; institutional desk · Dhaka</span>
              <span className="rounded-full bg-lime-pale px-3 py-0.5 text-[13px] text-lime-deep">
                Custom MOU
              </span>
            </figcaption>
          </figure>
        }
      />

      {/* B2B Service Level Commitments */}
      <section aria-label="B2B service standards" className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {catalog.slas.map((item) => (
            <li key={item.label} className="rounded-2xl border border-rule bg-chalk-100 p-4">
              <p className="font-display text-[22px] font-black leading-tight text-petrol-800">{item.metric}</p>
              <p className="mt-1 text-[16px] font-bold text-petrol-800">{item.label}</p>
              <p className="mt-1 text-[14.5px] leading-6 text-ink-soft">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Four Dedicated B2B Service Tracks */}
      <Section
        id="b2b-services"
        title="Dedicated B2B service lines."
        intro="Choose the desk that matches how your agency works — from high-volume China scholarship & admission files to Malaysia EMGS processing and bilateral university representation."
        action={
          <Link href="/universities" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            <GraduationCap size={18} aria-hidden="true" /> Inspect university directory
          </Link>
        }
      >
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          {catalog.tracks.map((track) => {
            const dark = Boolean(track.featured);
            return (
              <article
                key={track.id}
                id={track.id}
                className={`${dark ? kit.cardDark : kit.cardSage} scroll-mt-28 flex flex-col`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3.5 py-1 text-[13.5px] font-semibold ${
                      dark ? 'bg-white/10 text-lime' : 'bg-white text-petrol-800'
                    }`}
                  >
                    Track {track.number} · {track.turnaround}
                  </span>
                  <span className={`text-[14px] font-semibold ${dark ? 'text-white/75' : 'text-ink-soft'}`}>
                    {track.audience}
                  </span>
                </div>

                <h3
                  className={`mt-5 ${
                    dark
                      ? 'font-display text-[24px] font-black leading-[1.15] text-lime'
                      : 'font-display text-[24px] font-black leading-[1.15] text-petrol-800'
                  }`}
                >
                  {track.title}
                </h3>

                <p className={`mt-3 text-[16px] leading-7 ${dark ? 'text-white/85' : 'text-ink-soft'}`}>
                  {track.summary}
                </p>

                <ul className="mt-5 grid gap-2.5 border-t border-current/10 pt-5">
                  {track.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className={`flex items-start gap-2.5 text-[15px] leading-6 ${
                        dark ? 'text-white/90' : 'text-petrol-800'
                      }`}
                    >
                      <CheckCircle2
                        size={17}
                        className={`mt-1 shrink-0 ${dark ? 'text-lime' : 'text-jade'}`}
                        aria-hidden="true"
                      />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-auto pt-6 ${
                    dark ? 'text-white/80' : 'text-ink-soft'
                  }`}
                >
                  <p
                    className={`rounded-2xl px-4 py-3 text-[14.5px] font-semibold ${
                      dark ? 'bg-white/[0.08] text-white' : 'bg-white text-petrol-800'
                    }`}
                  >
                    {track.commercialModel}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Commercial Terms & Non-Poaching Governance */}
      <Section
        id="partner-protection"
        tone="navy"
        title="Partner protection & custom MOU terms."
        intro="Sub-agent and agency networks lose money when terms are vague. Our B2B service is built on the same written-proof discipline we give Bangladeshi families."
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div data-anim="up" className="rounded-3xl border border-white/15 bg-white/[0.05] p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1 text-[13px] font-bold text-petrol-800">
              <FileCheck2 size={15} aria-hidden="true" /> Custom Commercial Terms
            </p>
            <h3 className="mt-4 font-display text-[28px] font-black leading-[1.08] text-white sm:text-[32px]">
              Confirmed in writing before your first file moves.
            </h3>
            <p className="mt-4 text-[16px] leading-7 text-white/80">
              {catalog.commercialPolicy.summary}
            </p>
            <ul className="mt-6 space-y-3 border-t border-white/15 pt-5 text-[15px] leading-6 text-white/85">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                <span>No generic public rate sheet — terms reflect destination, scholarship tier &amp; monthly volume</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                <span>University deposits, embassy &amp; EMGS charges itemised separately from B2B fees</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                <span>Clear payout / settlement triggers &amp; refund conditions signed by both offices</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#b2b-inquiry" className="ed-btn ed-btn-signal min-h-[48px] px-6">
                Request custom MOU terms <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link href="/fees-and-transparency" className="ed-btn ed-btn-on-dark min-h-[48px] px-6">
                Student fee policy
              </Link>
            </div>
          </div>

          <div data-anim="stagger" className="grid gap-4 sm:grid-cols-2">
            {catalog.protections.map((item) => (
              <article key={item.title} className="rounded-3xl border border-white/15 bg-white p-6 text-petrol-800">
                <span className="grid size-10 place-items-center rounded-full bg-lime-pale text-lime-deep">
                  <Lock size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[18px] font-bold leading-snug text-petrol-800">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* 5-Stage B2B Operational SOP */}
      <Section
        id="b2b-sop"
        tone="sage"
        title="The 5-stage B2B processing SOP."
        intro="Every partner file follows one predictable workflow with named milestones and written records."
      >
        <ol data-anim="stagger" className="grid gap-5 md:grid-cols-5">
          {catalog.sopStages.map((stage) => (
            <li key={stage.step} className={`${kit.card} flex flex-col`}>
              <span className="font-display text-[30px] font-black leading-none text-lime-deep">
                {stage.step}
              </span>
              <h3 className="mt-4 text-[18px] font-bold leading-snug text-petrol-800">{stage.title}</h3>
              <p className="mt-2 text-[14.5px] leading-6 text-ink-soft">{stage.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:px-8">
          <div>
            <p className="text-[16px] font-bold text-petrol-800">
              Need verification standards or live China benchmark figures for your partner counsellors?
            </p>
            <p className="mt-1 text-[14.5px] text-ink-soft">
              All partner offices can cite our live public directory, university verification records, and open China tuition dataset.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/how-we-verify-universities" className="ed-btn ed-btn-outline min-h-[44px] px-5 text-[14.5px]">
              Verification rules
            </Link>
            <Link href="/china-study-report-bangladesh" className="ed-btn ed-btn-soft min-h-[44px] px-5 text-[14.5px]">
              China study benchmark
            </Link>
          </div>
        </div>
      </Section>

      {/* B2B Onboarding Intake Form */}
      <Section id="b2b-inquiry">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-14">
          <div data-anim="up">
            <p className={kit.badge}>
              <Building2 size={15} aria-hidden="true" /> Dedicated B2B Desk
            </p>
            <h2 className={`mt-5 ${kit.h2}`}>Start B2B onboarding.</h2>
            <p className={`mt-4 ${kit.lead}`}>
              Tell us which destinations, student volume, and B2B service track you need. Our partner desk reviews applications within 1–2 working days.
            </p>

            <div className="mt-7 space-y-4 rounded-3xl bg-canvas-soft p-6">
              <p className="text-[15px] font-bold text-petrol-800">{catalog.partnerDesk.name}</p>
              <ul className="space-y-3 text-[15px] leading-6 text-ink-soft">
                <li className="flex items-start gap-2.5">
                  <MapPin size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                  <span>{catalog.partnerDesk.address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock3 size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                  <span>{catalog.partnerDesk.hours}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={17} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                  <a href={telHref} className="font-semibold text-petrol-800 hover:underline">
                    {formatBangladeshPhone(phone)}
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={catalog.partnerDesk.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ed-btn ed-btn-outline min-h-[50px] px-6"
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp the B2B Desk
              </a>
              <Link href="/education-consultant-dhaka" className="ed-btn ed-btn-soft min-h-[48px] px-6">
                Visit our Dhanmondi office
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-canvas-soft p-2 sm:p-3">
            <B2BInquiryForm whatsappHref={catalog.partnerDesk.whatsappUrl} />
          </div>
        </div>
      </Section>

      {/* B2B FAQs + FAQPage JSON-LD */}
      <FaqBlock items={catalog.faqs} title="B2B partnership questions, answered." tone="sage" />

      {/* Closing CTA */}
      <section data-cta-band className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 data-anim="pop" className="font-display text-[40px] font-black leading-[0.95] tracking-[-0.02em] text-lime sm:text-[54px]">
              Build a B2B pipeline your students can verify.
            </h2>
            <p className="mt-5 text-[18px] leading-[1.6] text-white/85">
              Speak directly with our Dhanmondi B2B desk or submit your onboarding form to review destinations, SLAs, and custom MOU terms.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href="#b2b-inquiry" className="ed-btn ed-btn-signal min-h-[54px] px-7">
              Request B2B onboarding <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={catalog.partnerDesk.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-btn ed-btn-on-dark min-h-[54px] px-7"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp B2B Desk
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

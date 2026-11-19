import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Handshake,
  Lock,
  MessageCircle,
  Shield,
  Users,
} from 'lucide-react';
import PartnershipForm from '@/components/PartnershipForm';
import { FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { countries } from '@/lib/countries';
import { primaryImageOfPageSchema } from '@/lib/json-ld';
import { ogImage, pageMetadata } from '@/lib/seo';

const PATH = '/partnership';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export const metadata = pageMetadata({
  title: 'B2B Education Agency Partnership in Bangladesh | EduExpress',
  description:
    'Partner with EduExpress as a B2B education agency, China processing partner, or referral desk—with written MOU terms, USD fee schedule, and 48h file audits.',
  path: PATH,
  image: ogImage('about', 'EduExpress International B2B education agency partnership desk in Dhaka'),
});

const partnershipTypes = [
  {
    number: '01',
    title: 'Regional Agency Partner',
    label: 'Territory-based cooperation',
    description:
      'Build a documented regional cooperation arrangement with training, file audits, and responsibilities confirmed in your written agreement.',
    features: [
      'Territory and scope confirmed in writing',
      'Onboarding and 6-point SOP training',
      'Approved university & cost-sheet materials',
      'Placement terms defined by destination',
      'Named B2B desk coordinator in Dhaka',
    ],
    icon: Shield,
  },
  {
    number: '02',
    title: 'China Strategic Partner',
    label: 'Flagship China B2B route',
    description:
      'Support China applicants through a transparent USD service-charge schedule, verified university routes, and timestamped portal tracking.',
    features: [
      'Governed China university & CSC route records',
      'Written Type-A, Type-B & Type-C fee schedule',
      'Scholarship options matched by student GPA & profile',
      'JW201 / JW202 & X1/X2 visa-readiness review',
      'Strict non-poaching & partner file attribution',
    ],
    icon: Handshake,
  },
  {
    number: '03',
    title: 'Referral & Sub-Agent Partner',
    label: 'Student referral cooperation',
    description:
      'Refer suitable students across China, Malaysia, and active destinations through a straightforward written arrangement with clear payout milestones.',
    features: [
      'Simple student handover with attribution log',
      'Zero partner onboarding or setup charge',
      'Written referral & privacy responsibilities',
      'Defined settlement & invoice triggers',
      'Regular portal & offer status updates',
    ],
    icon: Users,
  },
];

const pricingTable = [
  {
    type: 'Type-A',
    coverage: 'Full Funded Scholarship',
    detail: 'Full tuition, campus accommodation & monthly stipend (as stated in the official university award)',
    price: '$800',
    numericPrice: 800,
  },
  {
    type: 'Type-B',
    coverage: 'Tuition Fee Free',
    detail: '100% tuition fee waiver (hostel and living expenses remain payable per official university schedule)',
    price: '$600',
    numericPrice: 600,
  },
  {
    type: 'Type-C',
    coverage: 'Partial Scholarship',
    detail: 'Partial tuition fee reduction confirmed in the university admission & scholarship notice',
    price: '$500',
    numericPrice: 500,
  },
  {
    type: 'Add-On Service',
    coverage: 'Airport Pickup — Per Student (Optional)',
    detail: 'Arrival reception and campus transfer coordination in China (optional add-on)',
    price: '$150',
    numericPrice: 150,
  },
];

const steps = [
  { number: '01', label: 'Choose a model', href: '#partnership-models' },
  { number: '02', label: 'China USD schedule', href: '#china-partner-terms' },
  { number: '03', label: 'Apply for partnership', href: '#partnership-form' },
];

const partnerSafeguards = [
  {
    icon: Lock,
    title: 'Written Non-Poaching & Student Ownership',
    text: 'Every submitted applicant remains attributed exclusively to your agency or sub-agent code. Our desk never contacts a partner’s student directly without written partner permission.',
  },
  {
    icon: FileCheck2,
    title: 'Separated Official & Consultancy Payments',
    text: 'University application fees, tuition deposits, EMGS charges, medical exams, and embassy fees stay separate from partner service charges on an itemised written sheet.',
  },
];

const partnerFaqs = [
  {
    question: 'What are the updated China B2B partner service fees by scholarship tier?',
    answer:
      'EduExpress International publishes a four-line USD partner service schedule for China admissions: Type-A (Full Funded Scholarship) at $800, Type-B (Tuition Fee Free) at $600, Type-C (Partial Scholarship) at $500, and optional Add-On Airport Pickup at $150 per student. Exact university deposits, embassy fees, and payment stages are confirmed in writing before filing.',
  },
  {
    question: 'Do the China partner fees include university application fees, deposits, or airfare?',
    answer:
      'No. University application fees, seat or tuition deposits, medical examination, translation, courier, embassy visa fees, and international airfare are separate third-party expenses paid per the official notice and listed in writing on each case cost sheet.',
  },
  {
    question: 'How does EduExpress protect sub-agent and regional agency student files?',
    answer:
      'Every vetted partner signs a bilateral MOU containing a non-poaching and attribution clause. Portal references, university offer notices, and JW202 / eVAL status updates are shared directly with your agency contact rather than bypassing your desk.',
  },
  {
    question: 'Can agencies also submit files for Malaysia or other destinations under custom MOU terms?',
    answer:
      'Yes. Beyond the published China USD schedule, agencies and sub-agents can work with our dedicated B2B desk for Malaysia (EMGS & branch campuses) and our active European/Asian destinations under custom bilateral MOU terms tailored to destination and volume.',
  },
  {
    question: 'How quickly does the partner desk review a new agency application or student file?',
    answer:
      'New partnership applications are reviewed within 2–3 business days. Once onboarded, new student dossiers undergo an initial academic, recognition, and document-gap audit within 24–48 business hours.',
  },
  {
    question: 'Does EduExpress guarantee university admission, scholarships, or visas for partner files?',
    answer:
      'No. Universities, scholarship committees, and embassies retain sole decision authority. EduExpress provides verified eligibility screening, timestamped portal submission tracking, and document-readiness audits in writing.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      mainEntityOfPage: PAGE_URL,
      datePublished: '2026-11-15',
      dateModified: '2026-11-20',
      name: 'B2B Education Agency Partnership Programme | EduExpress International',
      description:
        'Documented B2B cooperation models for education agencies, China strategic partners, and referral sub-agents in Bangladesh, with a published China partner USD schedule.',
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
      name: 'EduExpress B2B Education Agency Partnership & China Admissions Schedule',
      serviceType: 'B2B Education Agency Partnership',
      url: PAGE_URL,
      description:
        'B2B admissions processing, China scholarship placement tiers, and referral cooperation for study-abroad agencies and sub-agents under written MOU terms.',
      provider: { '@id': 'https://eduexpressint.com/#organization' },
      areaServed: [
        { '@type': 'Country', name: 'Bangladesh' },
        { '@type': 'AdministrativeArea', name: 'Global' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'China Partner Service Schedule (USD)',
        itemListElement: pricingTable.map((row) => ({
          '@type': 'Offer',
          name: `${row.type} — ${row.coverage}`,
          description: row.detail,
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: row.numericPrice,
            priceCurrency: 'USD',
          },
        })),
      },
    },
  ],
};

export default function PartnershipPage() {
  const destinationCount = countries.filter((country) => country.isActive).length;
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    "Hello, I'm interested in the EduExpress International B2B Education Agency Partnership Programme.",
  )}`;

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'B2B Partner Desk', path: '/b2b' }, { name: 'Partnership Programme' }]}
        eyebrow="Global Partner Programme 2027"
        title="Expand your consultancy with written proof."
        lead={`Choose a documented cooperation model for ${destinationCount} active destinations, China plus ${destinationCount - 1} side destinations, or the flagship China route with verified university links. Responsibilities and commercial terms are confirmed before work begins.`}
        reviewed="November 2026"
        actions={
          <>
            <a href="#partnership-form" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Apply for partnership <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/b2b" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Dedicated B2B Services &amp; SOP
            </Link>
            <Link href="/universities" className="ed-btn ed-btn-soft min-h-[52px] px-6">
              Explore university records <GraduationCap size={18} aria-hidden="true" />
            </Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/home/education-partners-meeting.webp"
                alt="EduExpress representatives meeting university staff at an international education event"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              Meeting university representatives
            </figcaption>
          </figure>
        }
      />

      <nav aria-label="Partnership page sections" className="border-b border-canvas-soft bg-white py-6">
        <ol className={`${kit.wrap} grid gap-3 sm:grid-cols-3`}>
          {steps.map((step) => (
            <li key={step.href}>
              <a href={step.href} className="group flex min-h-[60px] items-center gap-4 rounded-2xl px-4 transition hover:bg-canvas-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime font-display text-[16px] font-black text-petrol-800">
                  {step.number}
                </span>
                <span className="flex-1 text-[17px] font-semibold text-petrol-800">{step.label}</span>
                <ArrowRight size={16} className="shrink-0 text-petrol-800 transition group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section
        id="partnership-models"
        title="Choose the cooperation route that fits your work."
        intro="Each route begins with a suitability review. Territory, responsibilities, payments and student-data handling are documented in the final agreement."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          {partnershipTypes.map(({ number, title, label, description, icon: Icon, features }, index) => {
            const dark = index === 1;
            return (
              <article key={title} className={`${dark ? kit.cardDark : kit.cardSage} flex flex-col`}>
                <div className="flex items-start justify-between">
                  <span className={dark ? kit.iconLime : kit.icon}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className={`text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>Model {number}</span>
                </div>
                <p className={`mt-6 text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{label}</p>
                <h3 className={`mt-1 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>
                  {title}
                </h3>
                <p className={`mt-2 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{description}</p>
                <ul className={`mt-6 space-y-2.5 border-t pt-5 ${dark ? 'border-white/15' : 'border-petrol-800/10'}`}>
                  {features.map((feature) => (
                    <li key={feature} className={`flex gap-2.5 text-[15px] leading-6 ${dark ? 'text-white/85' : 'text-petrol-800'}`}>
                      <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${dark ? 'text-lime' : 'text-petrol-800'}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <Section
        tone="sage"
        id="china-partner-terms"
        title="China partner service schedule."
        intro="China B2B cooperation uses a written USD service schedule separate from custom multi-destination MOU agreements. The scholarship tier, coverage scope, and payment trigger are confirmed on the partner cost sheet before any student proceeds."
      >
        <div data-anim="up" className="overflow-hidden rounded-3xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <caption className="sr-only">China B2B partner service fees by scholarship tier and add-on service, in US dollars</caption>
              <thead>
                <tr className="bg-petrol-800 text-[14px] font-semibold text-white">
                  <th scope="col" className="px-6 py-4">Scholarship / Service Tier</th>
                  <th scope="col" className="px-6 py-4">Coverage &amp; Scope</th>
                  <th scope="col" className="px-6 py-4 text-right">Fee (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft">
                {pricingTable.map((row) => (
                  <tr key={row.type} className="transition-colors hover:bg-chalk-100">
                    <th scope="row" className="px-6 py-4 align-top font-normal">
                      <span className="inline-block rounded-full bg-lime-pale px-3 py-1 text-[14px] font-semibold text-lime-deep">
                        {row.type}
                      </span>
                    </th>
                    <td className="px-6 py-4">
                      <span className="block text-[16px] font-semibold text-petrol-800">{row.coverage}</span>
                      <span className="mt-0.5 block text-[14px] leading-6 text-ink-soft">{row.detail}</span>
                    </td>
                    <td className="px-6 py-4 text-right align-top font-display text-[24px] font-black text-petrol-800">
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-canvas-soft bg-lime-pale px-6 py-4 text-[15px] leading-6 text-petrol-800">
            <strong className="font-semibold">Written confirmation:</strong> Third-party university application fees, tuition deposits, medical, translation, and embassy fees remain separate and are itemised on the student cost sheet. University and authority decisions remain independent.
          </p>
        </div>

        <div data-anim="stagger" className="mt-6 grid gap-5 md:grid-cols-2">
          {partnerSafeguards.map(({ icon: Icon, title, text }) => (
            <article key={title} className={kit.card}>
              <div className="flex items-start gap-4">
                <span className={kit.iconLime}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className={kit.h3}>{title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-ink-soft">{text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="partnership-form">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div data-anim="up">
            <p className={kit.badge}>Step 03 · Cooperation request</p>
            <h2 className={`mt-5 ${kit.h2}`}>Apply for partnership.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              Tell us who you are and which route interests you. Our team reviews every application and contacts you within 2-3 business days.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Two short steps, no documents to upload',
                'Terms confirmed in writing before work begins',
                'Your details handled as described in our privacy policy',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] text-ink-soft">
              Partner Desk Hotline:{' '}
              <a
                href={`tel:${config.contact.phone.replace(/[^\d+]/g, '')}`}
                className="font-semibold text-petrol-800 underline-offset-4 hover:underline"
              >
                {formatBangladeshPhone(config.contact.phone)}
              </a>
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-soft min-h-[52px] px-7">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp the partner desk
              </a>
              <Link href="/b2b" className="ed-btn ed-btn-outline min-h-[50px] px-6">
                Open B2B Services &amp; Multi-Destination Desk <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-canvas-soft p-2 sm:p-3">
            <PartnershipForm />
          </div>
        </div>
      </Section>

      <Section
        id="institutional-cooperation"
        tone="sage"
        title="Universities, Bangladeshi schools &amp; media verification desk."
        intro="Alongside consultancy agreements, our Dhanmondi office works directly with Chinese university international offices, Bangladeshi colleges and education journalists on verified information."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          <article className={kit.card}>
            <h3 className={kit.h3}>Chinese university offices</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Update official tuition, scholarship seats or Bangladesh admissions representative listings. Relationship records are published only when written authorization is on file.
            </p>
            <Link href="/how-we-verify-universities" className={`mt-4 ${kit.link}`}>
              How we verify records <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className={kit.card}>
            <h3 className={kit.h3}>Bangladeshi schools &amp; colleges</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Host evidence-first seminars for HSC students and parents covering realistic China costs, CSC scholarship competition, X1/X2 visa rules and BMDC awareness.
            </p>
            <Link href="/education-consultant-dhaka" className={`mt-4 ${kit.link}`}>
              Dhanmondi consultation desk <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
          <article className={kit.card}>
            <h3 className={kit.h3}>Media &amp; researchers</h3>
            <p className="mt-2 text-[15px] leading-7 text-ink-soft">
              Cite live explicit CNY tuition quartiles, first-year non-tuition ranges and primary regulatory links directly from our open benchmark and JSON feed.
            </p>
            <Link href="/china-study-report-bangladesh" className={`mt-4 ${kit.link}`}>
              China study benchmark <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Study in China guide
          </Link>
          <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            China scholarships
          </Link>
          <Link href="/study-in-malaysia-from-bangladesh" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Study in Malaysia guide
          </Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[44px] bg-white px-5 text-[14.5px]">
            Fees &amp; transparency
          </Link>
        </div>
      </Section>

      <FaqBlock items={partnerFaqs} title="Education agency partnership questions" tone="white" />

      <section data-cta-band className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 data-anim="pop" className="font-display text-[40px] font-black leading-[0.95] tracking-[-0.02em] text-lime sm:text-[56px]">
              Expand your placement business with clear terms.
            </h2>
            <p className="mt-5 text-[18px] leading-[1.6] text-white/85">
              Talk to the partner desk on WhatsApp, or send the two-step application and we will review your route with you.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-signal min-h-[54px] px-7">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp partner desk
            </a>
            <a href="#partnership-form" className="ed-btn ed-btn-on-dark min-h-[54px] px-7">
              Apply for partnership <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

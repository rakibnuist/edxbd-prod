import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, GraduationCap, Handshake, MessageCircle, Shield, Users } from 'lucide-react';
import PartnershipForm from '@/components/PartnershipForm';
import { JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { countries } from '@/lib/countries';
import { pageMetadata } from '@/lib/seo';

const PATH = '/partnership';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export const metadata = pageMetadata({
  title: 'Education Agency Partnership Programme | EduExpress',
  description:
    'Partner with EduExpress as a regional agency, China strategic or referral partner, with written terms, a published China service schedule and a named contact.',
  path: PATH,
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: 'EduExpress Global Partner Programme',
  description: 'Documented cooperation models for education agencies and referral partners, with a published China partner service schedule.',
  inLanguage: 'en-BD',
  about: { '@id': 'https://eduexpressint.com/#organization' },
  isPartOf: { '@id': 'https://eduexpressint.com/#website' },
  breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
};

const partnershipTypes = [
  {
    number: '01',
    title: 'Regional Agency Partner',
    label: 'Territory-based cooperation',
    description: 'Build a documented regional cooperation arrangement with training, support and responsibilities confirmed in the final agreement.',
    features: ['Territory and scope confirmed in writing', 'Onboarding and process training', 'Approved information and campaign materials', 'Placement terms defined by destination', 'Named support contact'],
    icon: Shield,
  },
  {
    number: '02',
    title: 'China Strategic Partner',
    label: 'Flagship China cooperation',
    description: 'Support China applicants through a written service-charge structure, collaborating university routes and documented application tracking.',
    features: ['Governed China university route records', 'Itemized service-charge structure', 'Scholarship options matched by profile', 'Application and visa-readiness support', 'Dedicated partner contact'],
    icon: Handshake,
  },
  {
    number: '03',
    title: 'Referral Partner',
    label: 'Student referral cooperation',
    description: 'Refer suitable students through a simple written arrangement with clear ownership, updates and payment terms.',
    features: ['Simple student handover process', 'No partner setup charge', 'Written referral responsibilities', 'Defined referral payment terms', 'Application status updates'],
    icon: Users,
  },
];

const pricingTable = [
  { type: 'Type-A', coverage: 'Full Tuition · Hostel · Monthly Stipend', price: '$500' },
  { type: 'Type-B', coverage: 'Full Tuition · Hostel Free', price: '$450' },
  { type: 'Type-C', coverage: 'Tuition Waiver Only', price: '$400' },
  { type: 'Type-D', coverage: 'Partial Scholarship (50–80% Off)', price: '$300' },
  { type: 'Add-On', coverage: 'Airport Pickup — Per Student (Optional)', price: '$150' },
];

const steps = [
  { number: '01', label: 'Choose a model', href: '#partnership-models' },
  { number: '02', label: 'Review China terms', href: '#china-partner-terms' },
  { number: '03', label: 'Apply for review', href: '#partnership-form' },
];

export default function PartnershipPage() {
  const destinationCount = countries.filter(country => country.isActive).length;
  const whatsapp = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hello, I'm interested in the EduExpress International Global Partner Programme.")}`;

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Partnership' }]}
        eyebrow="Global Partner Programme 2027"
        title="Expand your consultancy with written proof."
        lead={`Choose a documented cooperation model for ${destinationCount} active destinations, China plus ${destinationCount - 1} side destinations, or the flagship China route with direct university links. Responsibilities and commercial terms are confirmed before work begins.`}
        actions={
          <>
            <a href="#partnership-form" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Apply for partnership <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link href="/universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">
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
          {steps.map(step => (
            <li key={step.href}>
              <a href={step.href} className="group flex min-h-[60px] items-center gap-4 rounded-2xl px-4 transition hover:bg-canvas-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime font-display text-[16px] font-black text-petrol-800">{step.number}</span>
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
                  <span className={dark ? kit.iconLime : kit.icon}><Icon size={22} aria-hidden="true" /></span>
                  <span className={`text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>Model {number}</span>
                </div>
                <p className={`mt-6 text-[14px] font-semibold ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{label}</p>
                <h3 className={`mt-1 ${dark ? 'text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime' : kit.h3}`}>{title}</h3>
                <p className={`mt-2 text-[16px] leading-7 ${dark ? 'text-white/80' : 'text-ink-soft'}`}>{description}</p>
                <ul className={`mt-6 space-y-2.5 border-t pt-5 ${dark ? 'border-white/15' : 'border-petrol-800/10'}`}>
                  {features.map(feature => (
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
        intro="China cooperation uses a written service schedule separate from destination commission arrangements. The selected scholarship coverage, included support and payment trigger are confirmed on the partner cost sheet before a student proceeds."
      >
        <div data-anim="up" className="overflow-hidden rounded-3xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <caption className="sr-only">China partner service fees by scholarship type, in US dollars</caption>
              <thead>
                <tr className="bg-petrol-800 text-[14px] font-semibold text-white">
                  <th scope="col" className="px-6 py-4">Scholarship type</th>
                  <th scope="col" className="px-6 py-4">Coverage</th>
                  <th scope="col" className="px-6 py-4 text-right">Fee (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-soft">
                {pricingTable.map(row => (
                  <tr key={row.type} className="transition-colors hover:bg-chalk-100">
                    <th scope="row" className="px-6 py-4 font-normal">
                      <span className="inline-block rounded-full bg-lime-pale px-3 py-1 text-[14px] font-semibold text-lime-deep">{row.type}</span>
                    </th>
                    <td className="px-6 py-4 text-[16px] font-semibold text-petrol-800">{row.coverage}</td>
                    <td className="px-6 py-4 text-right font-display text-[24px] font-black text-petrol-800">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-canvas-soft bg-lime-pale px-6 py-4 text-[15px] leading-6 text-petrol-800">
            <strong className="font-semibold">Written confirmation:</strong> The applicable coverage, university record, student responsibility and payment stage are confirmed in the case document. University and authority decisions remain independent.
          </p>
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
              {['Two short steps, no documents to upload', 'Terms confirmed in writing before work begins', 'Your details handled as described in our privacy policy'].map(item => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-soft mt-8 min-h-[52px] px-7">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp the partner desk
            </a>
          </div>
          <div className="rounded-3xl bg-canvas-soft p-2 sm:p-3">
            <PartnershipForm />
          </div>
        </div>
      </Section>

      <section className="bg-petrol-800 py-16 text-white lg:py-20">
        <div className={`${kit.wrap} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 data-anim="pop" className="font-display text-[40px] font-black leading-[0.95] tracking-[-0.02em] text-lime sm:text-[56px]">Expand your placement business with clear terms.</h2>
            <p className="mt-5 text-[18px] leading-[1.6] text-white/85">Talk to the partner desk on WhatsApp, or send the two-step application and we will review your route with you.</p>
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

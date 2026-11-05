import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Eye, Lock, Mail, MapPin, Phone, Shield, Users } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { LegalDocument, LegalList, type LegalSection } from './LegalDocument';

const PATH = '/privacy';
const POLICY_VERSION = '2026-07-19';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

const privacyPillars = [
  {
    title: 'Secure data storage',
    icon: Lock,
    copy: 'Student transcripts, passport copies, and personal records are encrypted in transit and stored securely on protected database infrastructure.',
  },
  {
    title: 'Explicit consent',
    icon: Eye,
    copy: 'We collect personal information strictly to prepare your Education Fit Assessment, ClearCost schedule, and university applications.',
  },
  {
    title: 'Student control & deletion',
    icon: Users,
    copy: 'You retain full rights to inspect, update, export, or request deletion of your personal records from our system.',
  },
  {
    title: 'No data monetization',
    icon: Shield,
    copy: 'EduExpress International never sells, rents, or monetizes student information to third-party advertisers.',
  },
];

/** Privacy policy page body (server component). */
export default function PrivacyClient() {
  const { email, phone, address } = config.contact;
  const officeAddress = `${address.street}, ${address.city} ${address.postalCode}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Privacy policy',
    description: 'How EduExpress International collects, uses and protects student data and documents.',
    inLanguage: 'en-BD',
    dateModified: POLICY_VERSION,
    isPartOf: { '@id': 'https://eduexpressint.com/#website' },
    about: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
  };

  const sections: LegalSection[] = [
    {
      id: 'privacy-standards',
      title: 'Our four privacy standards',
      content: (
        <ul className="grid gap-4 sm:grid-cols-2">
          {privacyPillars.map(({ title, copy, icon: Icon }) => (
            <li key={title} className={kit.cardSage}>
              <span className={kit.icon}><Icon size={22} aria-hidden="true" /></span>
              <h3 className={`mt-5 ${kit.h3}`}>{title}</h3>
              <p className="mt-2 text-[16px] leading-7 text-ink-soft">{copy}</p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'scope',
      title: '1. Scope of this policy',
      content: (
        <p>
          This policy applies to all personal information, academic transcripts, passport copies, and contact information collected
          through eduexpressint.com or at our Dhanmondi decision desk in Dhaka.
        </p>
      ),
    },
    {
      id: 'data-collected',
      title: '2. Data collected and purpose',
      content: (
        <>
          <p>
            We collect, process, and retain student information strictly to fulfil your educational evaluation and university
            application dossier. That includes:
          </p>
          <LegalList
            items={[
              'Student name, email, WhatsApp number, and residential address',
              'SSC/HSC transcripts, GPA/CGPA, and language proficiency scores',
              'Target destination preferences, budget availability, and program choice',
            ]}
          />
        </>
      ),
    },
    {
      id: 'your-rights',
      title: '3. Your data rights',
      content: (
        <>
          <p>
            You have the right to request a complete copy of your stored records or ask us to delete your personal information by
            contacting our Dhanmondi office at{' '}
            <a href={`mailto:${email}`} className="font-semibold text-petrol-800 underline underline-offset-4">{email}</a>.
          </p>
          <p>
            Our <Link href="/student-data-privacy" className="font-semibold text-petrol-800 underline underline-offset-4">student data and document privacy standard</Link>{' '}
            explains how consent, sensitive documents, staff access and retention are handled.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: 'Data protection contact',
      content: (
        <div className="grid gap-5 sm:grid-cols-[1fr_200px] sm:items-start">
          <ul className="grid gap-3 text-[16px] leading-7">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
              <span>EduExpress International — {officeAddress}</span>
            </li>
            <li className="flex gap-3">
              <Mail size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
              <a href={`mailto:${email}`} className="font-semibold text-petrol-800 underline underline-offset-4">{email}</a>
            </li>
            <li className="flex gap-3">
              <Phone size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-petrol-800 underline underline-offset-4">{phone}</a>
            </li>
            <li>
              <Link href="/contact" className={kit.link}>
                Contact the decision desk <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </li>
          </ul>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/office/dhanmondi-reception.webp"
              alt="Reception area of the EduExpress office in Dhanmondi, Dhaka"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Privacy policy' }]}
        eyebrow="Written data governance"
        title="Privacy policy."
        lead="How we protect student data and personal records. Under our evidence-first standard, we collect, process, and retain student information strictly to fulfil your educational evaluation and university application dossier."
        reviewed="July 2026"
        aside={
          <div className={kit.cardDark}>
            <p className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">At a glance</p>
            <dl className="mt-5 grid gap-4 text-[16px] leading-7">
              <div>
                <dt className="text-[14px] text-white/70">Policy version</dt>
                <dd className="font-semibold text-white">{POLICY_VERSION}</dd>
              </div>
              <div>
                <dt className="text-[14px] text-white/70">Applies to</dt>
                <dd className="font-semibold text-white">eduexpressint.com and our Dhanmondi decision desk</dd>
              </div>
              <div>
                <dt className="text-[14px] text-white/70">Copy or deletion requests</dt>
                <dd>
                  <a href={`mailto:${email}`} className="font-semibold text-white underline underline-offset-4">{email}</a>
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <LegalDocument
        sections={sections}
        version={POLICY_VERSION}
        related={[
          { href: '/student-data-privacy', label: 'Student data privacy standard' },
          { href: '/terms', label: 'Terms of service' },
          { href: '/complaints-and-resolution', label: 'Complaints and resolution' },
          { href: '/fees-and-transparency', label: 'Fees and transparency' },
        ]}
      />

      <CtaBand
        title="Questions about how we handle your documents?"
        text="Speak to our team at the Dhanmondi office, by email or on WhatsApp. A counsellor replies within one working day."
      />
    </>
  );
}

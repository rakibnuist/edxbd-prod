import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle, Mail, MapPin, Phone, Scale, Shield } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { LegalDocument, LegalList, type LegalSection } from '../privacy/LegalDocument';

const PATH = '/terms';
const POLICY_VERSION = '2026-07-19';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

const termsPillars = [
  {
    title: 'Written proof standard',
    icon: CheckCircle,
    copy: 'Every cost schedule, decision report, and document checklist is provided in writing before you proceed.',
  },
  {
    title: 'Explicit fee separation',
    icon: Scale,
    copy: 'Unambiguous separation of host university tuition, third-party government fees, and EduExpress service charges.',
  },
  {
    title: 'China visa-first fee timing',
    icon: Shield,
    copy: 'No EduExpress service fee collected for China placements prior to official student visa issuance.',
  },
  {
    title: 'Outcome responsibility limits',
    icon: AlertTriangle,
    copy: 'Admissions and visa decisions rest exclusively with host universities and relevant government embassies.',
  },
];

/** Terms of service page body (server component). */
export default function TermsClient() {
  const { email, phone, address } = config.contact;
  const officeAddress = `${address.street}, ${address.city} ${address.postalCode}`;
  const link = 'font-semibold text-petrol-800 underline underline-offset-4';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: 'Terms of service',
    description: 'The written terms governing EduExpress International student evaluations, fee schedules and application support.',
    inLanguage: 'en-BD',
    dateModified: POLICY_VERSION,
    isPartOf: { '@id': 'https://eduexpressint.com/#website' },
    about: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
  };

  const sections: LegalSection[] = [
    {
      id: 'operational-clauses',
      title: 'Four operational clauses',
      content: (
        <ul className="grid gap-4 sm:grid-cols-2">
          {termsPillars.map(({ title, copy, icon: Icon }) => (
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
      title: '1. Scope of consultation',
      content: (
        <p>
          EduExpress International provides educational evaluation, university matching, scholarship assessment, document preparation,
          and visa readiness coaching under written evidence standards.
        </p>
      ),
    },
    {
      id: 'fees',
      title: '2. Fee schedule and payment policy',
      content: (
        <>
          <LegalList
            items={[
              'Initial EduFit evaluation and document review: free, with no file opening fee',
              'China placement service fee: payable only after the student visa is approved',
              'Official third-party fees (JW202, embassy visa and medicals): itemised in advance, with receipts',
            ]}
          />
          <p>
            The full China payment terms are set out in our{' '}
            <Link href="/china-visa-first-policy" className={link}>China visa-first service policy</Link>, and how EduExpress charges are
            kept separate from third-party costs is explained on{' '}
            <Link href="/fees-and-transparency" className={link}>fees and transparency</Link>.
          </p>
        </>
      ),
    },
    {
      id: 'outcomes',
      title: '3. Outcome disclaimers',
      content: (
        <div className={`${kit.cardOutline} space-y-4 text-[16px] leading-7`}>
          <p>
            <strong className="text-petrol-800">Admissions:</strong> Official admission offers and JW202 government forms are issued solely by
            host university registrars and Chinese ministry departments.
          </p>
          <p>
            <strong className="text-petrol-800">Visas:</strong> Visa issuance decisions rest exclusively with the relevant embassy consular
            section.
          </p>
        </div>
      ),
    },
    {
      id: 'operating-entity',
      title: 'Licensed operating entity',
      content: (
        <ul className="grid gap-3 text-[16px] leading-7">
          <li className="flex gap-3">
            <MapPin size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
            <span>EduExpress International — {officeAddress} (DSCC Trade Licence TRAD/005430/2023)</span>
          </li>
          <li className="flex gap-3">
            <Mail size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
            <a href={`mailto:${email}`} className={link}>{email}</a>
          </li>
          <li className="flex gap-3">
            <Phone size={20} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={link}>{phone}</a>
          </li>
          <li>
            <Link href="/contact" className={kit.link}>
              Contact the decision desk <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Terms of service' }]}
        eyebrow="Evidence-first terms of service"
        title="Terms of service."
        lead="Written operational terms governing your consultation. These terms govern all student evaluations, written fee schedules, and university application dossiers managed by EduExpress International from Dhanmondi, Dhaka."
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
                <dt className="text-[14px] text-white/70">File opening fee</dt>
                <dd className="font-semibold text-white">None — initial evaluation and document review are free</dd>
              </div>
              <div>
                <dt className="text-[14px] text-white/70">China service fee</dt>
                <dd className="font-semibold text-white">Only after the student visa is approved</dd>
              </div>
            </dl>
          </div>
        }
      />

      <LegalDocument
        sections={sections}
        version={POLICY_VERSION}
        related={[
          { href: '/china-visa-first-policy', label: 'China visa-first policy' },
          { href: '/fees-and-transparency', label: 'Fees and transparency' },
          { href: '/complaints-and-resolution', label: 'Complaints and resolution' },
          { href: '/privacy', label: 'Privacy policy' },
        ]}
      />

      <CtaBand
        title="Questions about our written terms?"
        text="Speak to our Dhanmondi desk in person, by email or on WhatsApp, or start the free assessment and receive your costs in writing."
      />
    </>
  );
}

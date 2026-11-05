import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import DestinationsClient from './DestinationsClient';
import { DESTINATION_PHOTOS } from '@/components/destinations/DestinationCover';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { activeCountries } from '@/lib/countries';
import { ogImage, pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';

const PATH = '/destinations';
const canonical = absoluteUrl(PATH);
const LAST_REVIEWED = '2026-11-04';

export const metadata = pageMetadata({
  title: 'Study Abroad Destinations from Bangladesh | EduExpress',
  description: `Compare ${activeCountries.length} study abroad destinations for Bangladeshi students: recognition, tuition, living costs, scholarships, intakes and visa steps, all in writing.`,
  path: PATH,
  image: ogImage('destinations', 'The Great Wall of China across autumn hills'),
});

const mosaic = [
  { slug: 'china', label: 'China' },
  { slug: 'uk', label: 'United Kingdom' },
  { slug: 'south-korea', label: 'South Korea' },
  { slug: 'malaysia', label: 'Malaysia' },
].filter(item => DESTINATION_PHOTOS[item.slug] && activeCountries.some(country => country.slug === item.slug));

const researchLinks = [
  { label: 'Compare destinations side by side', text: 'Cost and entry side by side', href: '/compare-study-destinations' },
  { label: 'Research universities and scholarships', text: 'Programs, tuition and intakes by destination', href: '/find-education' },
  { label: 'Fees and transparency', text: 'What you pay us, when, and what is refundable', href: '/fees-and-transparency' },
  { label: 'Guidance for parents and sponsors', text: 'Costs, safety and responsibilities', href: '/for-parents' },
];

export default function DestinationsPage() {
  const { address } = config.contact;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Study abroad destinations for Bangladeshi students',
        description: 'Compare active study destination services with education fit, institution checks, recognition, clear costs and visa readiness.',
        inLanguage: 'en-BD',
        dateModified: LAST_REVIEWED,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#destinations`,
        name: 'Study destinations supported by EduExpress International',
        numberOfItems: activeCountries.length,
        itemListElement: activeCountries.map((country, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `Study in ${country.name} from Bangladesh`,
          url: absoluteUrl(destinationPath(country.slug)),
        })),
      },
      {
        '@type': 'EducationalOrganization',
        '@id': `${SITE_URL}/#organization`,
        name: 'EduExpress International',
        url: SITE_URL,
        logo: absoluteUrl('/logo.png'),
        description: 'Evidence-first education consultancy helping Bangladeshi students compare overseas study options with written proof.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          addressLocality: address.city,
          postalCode: address.postalCode,
          addressCountry: address.country,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: config.contact.phone,
          contactType: 'customer service',
          email: config.contact.email,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Destinations' }]}
        eyebrow={`${activeCountries.length} active destination services · Asia and Europe`}
        title="Study abroad destinations for Bangladeshi students."
        lead="Compare recognition, tuition, living costs, scholarships, intakes and visa readiness across our active routes. China carries the deepest published evidence base; every route is reviewed against official sources."
        reviewed="November 2026"
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Start free fit assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/find-education" className="ed-btn ed-btn-outline min-h-[52px] px-7">
              Research universities <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </>
        }
        aside={
          mosaic.length === 4 ? (
            <ul className="grid grid-cols-2 gap-3">
              {mosaic.map((item, index) => (
                <li key={item.slug} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image
                    src={DESTINATION_PHOTOS[item.slug]}
                    alt=""
                    fill
                    priority={index < 2}
                    sizes="(max-width:1024px) 50vw, 240px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[14px] font-semibold text-petrol-800">{item.label}</span>
                </li>
              ))}
            </ul>
          ) : undefined
        }
      />

      <TrustBar />

      <DestinationsClient />

      <Section title="Need help choosing?" intro="Compare destinations with a written education fit review. Share your results, budget, intake and goals; we compare realistic options, explain recognition and total costs, and tell you what is missing before you apply.">
        <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2">
          {researchLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex min-h-[76px] items-center justify-between gap-4 rounded-2xl bg-canvas-soft px-5 py-4 transition-colors hover:bg-lime-pale"
              >
                <span>
                  <span className="block text-[17px] font-semibold text-petrol-800">{link.label}</span>
                  <span className="mt-0.5 block text-[15px] text-ink-soft">{link.text}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-petrol-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className={`mt-8 max-w-3xl ${kit.body}`}>
          Admission, scholarship and visa decisions are made by universities, awarding bodies and embassies. We check fit and costs in
          writing, but no consultancy can guarantee an outcome.
        </p>
      </Section>

      <CtaBand
        title="Not sure which country fits?"
        text="Compare education quality, recognition, affordability and entry requirements side by side, then get a written shortlist based on your profile."
      />
    </>
  );
}

import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import DestinationsClient from './DestinationsClient';
import { activeCountries } from '@/lib/countries';
import { SITE_URL, absoluteUrl, destinationPath } from '@/lib/site-urls';

const canonical = absoluteUrl('/destinations');
const LAST_REVIEWED = '2026-11-04';

export const metadata: Metadata = {
  title: { absolute: 'Study Abroad Destinations for Bangladeshi Students | EduExpress' },
  description:
    'Compare 12 active study destinations for Bangladeshi students. Review education fit, recognition, tuition, living costs, scholarships, intakes and visa readiness with evidence-based guidance.',
  alternates: { canonical },
  openGraph: {
    title: 'Study Abroad Destinations for Bangladeshi Students | EduExpress International',
    description:
      'Compare destinations on recognition, total cost, scholarships, intakes and visa readiness. Start with an education fit assessment for realistic options.',
    url: canonical,
    type: 'website',
    siteName: 'EduExpress International',
    locale: 'en_BD',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduExpress International — study abroad destinations for Bangladeshi students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Abroad Destinations for Bangladeshi Students | EduExpress International',
    description:
      'Compare destinations on recognition, total cost, scholarships, intakes and visa readiness. Evidence-based guidance for Bangladeshi students.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function DestinationsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Study abroad destinations for Bangladeshi students',
        description:
          'Compare active study destination services with education fit, institution checks, recognition, clear costs and visa readiness.',
        inLanguage: 'en-BD',
        dateModified: LAST_REVIEWED,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Destinations', item: canonical },
        ],
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
          streetAddress: 'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi',
          addressLocality: 'Dhaka',
          postalCode: '1209',
          addressCountry: 'BD',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+880 1983-333566',
          contactType: 'customer service',
          email: 'info@eduexpressint.com',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <DestinationsClient />
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-shell rounded-[28px] border border-rule bg-white p-6 shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)] sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-[62ch]">
            <p className="ed-label">Need help choosing?</p>
            <h2 className="ed-display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-ink">
              Compare destinations with a written education fit review
            </h2>
            <p className="mt-3 text-[14px] leading-7 text-ink-soft">
              Share your results, budget, intake and goals. We&apos;ll compare realistic options, explain recognition and total costs, and tell you what&apos;s missing before you apply.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-primary min-h-11">
              Start free assessment <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/find-education" className="ed-btn ed-btn-outline min-h-11">
              Research universities & scholarships
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

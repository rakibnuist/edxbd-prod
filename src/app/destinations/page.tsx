import { Metadata } from 'next';
import DestinationsClient from './DestinationsClient';
import { activeCountries } from '@/lib/countries';


export const metadata: Metadata = {
  title: 'Study Abroad Destinations for Bangladeshi Students',
  description: 'Compare active EduExpress destination services for China, Malta, Hungary, Cyprus, South Korea, the United Kingdom, Georgia, Greece, Malaysia and Thailand.',
  keywords: [
    'study abroad destinations',
    'international universities',
    'scholarship opportunities',
    'UK universities',
    'China universities',
    'South Korea education',
    'Hungary study',
    'Cyprus universities',
    'Georgia universities',
    'Malta education',
    'Greece education',
    'Malaysia education',
    'Thailand education',
    'study abroad programs',
    'international education',
    'student visa assistance',
    'education consultancy',
    'overseas education'
  ],
  openGraph: {
    title: 'Study Abroad Destinations for Bangladeshi Students',
    description: 'Compare ten active destination services with education fit, clear costs and visa readiness.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/study-abroad-destinations.jpg',
        width: 1200,
        height: 630,
        alt: 'Study Abroad Destinations - Top Universities & Scholarship Opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Abroad Destinations for Bangladeshi Students',
    description: 'Compare ten active destination services with education fit, clear costs and visa readiness.',
    images: ['/images/study-abroad-destinations.jpg'],
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
  alternates: {
    canonical: '/destinations',
  },
};

export default function DestinationsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Compare active study destination services with education fit, institution checks, clear costs and visa readiness.",
    "url": "https://eduexpressint.com/destinations",
    "logo": "https://eduexpressint.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House 12/1, Ground Floor, Road 4/A, Dhanmondi",
      "addressLocality": "Dhaka",
      "postalCode": "1209",
      "addressCountry": "BD"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+880 1983-333566",
      "contactType": "customer service",
      "email": "info@eduexpressint.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Study Abroad Destinations",
      "itemListElement": activeCountries.map((country) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": `Study in ${country.name} from Bangladesh`,
          "description": country.description,
          "url": `https://eduexpressint.com/destinations/${country.slug}`
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <DestinationsClient />
    </>
  );
}

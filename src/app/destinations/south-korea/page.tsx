import { Metadata } from 'next';
import SouthKoreaClient from './SouthKoreaClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in South Korea - World-Class Technology Education & K-Culture Immersion',
  description: 'Study in South Korea with world-class technology education at top universities like SNU, KAIST, Yonsei. From $3,000 per year with Korean Government Scholarship (KGSP) opportunities and K-culture immersion.',
  keywords: [
    'study in South Korea',
    'South Korea universities',
    'KAIST',
    'Seoul National University',
    'Yonsei University',
    'Korean Government Scholarship',
    'KGSP',
    'Global Korea Scholarship',
    'GKS',
    'South Korea student visa',
    'Korean language programs',
    'K-culture',
    'technology education',
    'study abroad South Korea',
    'South Korea scholarships',
    'South Korea international students',
    'South Korea education system',
    'South Korea visa requirements',
    'study in Seoul',
    'South Korea medical programs',
    'South Korea business programs'
  ],
  openGraph: {
    title: 'Study in South Korea - World-Class Technology Education & K-Culture Immersion',
    description: 'Study in South Korea with world-class technology education at top universities like SNU, KAIST, Yonsei. From $3,000 per year with Korean Government Scholarship (KGSP) opportunities.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/south-korea-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in South Korea - World-Class Technology Education & K-Culture Immersion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in South Korea - World-Class Technology Education & K-Culture Immersion',
    description: 'Study in South Korea with world-class technology education at top universities like SNU, KAIST, Yonsei. From $3,000 per year with Korean Government Scholarship (KGSP) opportunities.',
    images: ['/images/south-korea-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/south-korea',
  },
};

export default function SouthKoreaPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('South Korea', {
      page: 'destinations/south-korea',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in South Korea with world-class technology education at top universities like SNU, KAIST, Yonsei. From $3,000 per year with Korean Government Scholarship (KGSP) opportunities and K-culture immersion.",
    "url": "https://www.eduexpressint.com/destinations/south-korea",
    "logo": "https://www.eduexpressint.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12/1, Ground Floor, Road: 4/A, Dhanmondi",
      "addressLocality": "Dhaka",
      "postalCode": "1209",
      "addressCountry": "BD"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+880-1983-333566",
      "contactType": "customer service",
      "email": "info@eduexpressint.com"
    },
    "offers": {
      "@type": "Offer",
      "name": "Study in South Korea Program",
      "description": "Study in South Korea with world-class technology education at top universities from $3,000 per year",
      "price": "3000",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* GTM Tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track page view for South Korea
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in South Korea',
                page_location: window.location.href,
                content_group1: 'South Korea'
              });
            }
          `
        }}
      />

      <SouthKoreaClient />
    </>
  );
}

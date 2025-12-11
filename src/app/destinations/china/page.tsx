import { Metadata } from 'next';
import ChinaClient from './ChinaClient';

export const metadata: Metadata = {
  title: 'Study in China - Top Universities, Scholarships & Programs | 100% Free Education',
  description: 'Study in China with world-class universities like Tsinghua & Peking. Get 100% free education with full scholarships, learn Chinese culture, and access affordable education. Free consultation available.',
  keywords: [
    'study in china',
    'china universities',
    'chinese government scholarship',
    'tsinghua university',
    'peking university',
    'fudan university',
    'study abroad china',
    'china education',
    'international students china',
    'chinese language programs',
    'free education china',
    'csc scholarship',
    'china student visa',
    'chinese universities ranking',
    'study in china cost',
    'china education system'
  ],
  openGraph: {
    title: 'Study in China - Top Universities, Scholarships & Programs | 100% Free Education',
    description: 'Study in China with world-class universities like Tsinghua & Peking. Get 100% free education with full scholarships, learn Chinese culture, and access affordable education.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/china-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in China - Top Universities, Scholarships & Programs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in China - Top Universities, Scholarships & Programs | 100% Free Education',
    description: 'Study in China with world-class universities like Tsinghua & Peking. Get 100% free education with full scholarships.',
    images: ['/images/china-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/china',
  },
};

export default function ChinaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in China with world-class universities like Tsinghua & Peking. Get 100% free education with full scholarships, learn Chinese culture, and access affordable education.",
    "url": "https://www.eduexpressint.com/destinations/china",
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
      "name": "Study in China Program",
      "description": "Study in China with 100% free education through full scholarships",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "China Study Programs",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Engineering Programs",
            "description": "Engineering programs at top Chinese universities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Business Programs",
            "description": "Business and management programs in China"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Medical Programs",
            "description": "Medical and health science programs in China"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* GTM Tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track page view for China
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in China',
                page_location: window.location.href,
                content_group1: 'China'
              });
            }
          `
        }}
      />
      <ChinaClient />
    </>
  );
}

import { Metadata } from 'next';
import DestinationsClient from './DestinationsClient';


export const metadata: Metadata = {
  title: 'Study Abroad Destinations - Top Universities & Scholarship Opportunities',
  description: 'Explore top study abroad destinations with scholarship opportunities. Study in UK, China, South Korea, Hungary, Cyprus, Croatia, Georgia, Finland, Netherlands and more. Get expert guidance and visa assistance.',
  keywords: [
    'study abroad destinations',
    'international universities',
    'scholarship opportunities',
    'UK universities',
    'China universities',
    'South Korea education',
    'Hungary study',
    'Cyprus universities',
    'Croatia education',
    'Georgia universities',
    'Finland education',
    'Netherlands universities',
    'study abroad programs',
    'international education',
    'student visa assistance',
    'education consultancy',
    'overseas education'
  ],
  openGraph: {
    title: 'Study Abroad Destinations - Top Universities & Scholarship Opportunities',
    description: 'Explore top study abroad destinations with scholarship opportunities. Study in UK, China, South Korea, Hungary, Cyprus, Croatia, Georgia, Finland, Netherlands and more.',
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
    title: 'Study Abroad Destinations - Top Universities & Scholarship Opportunities',
    description: 'Explore top study abroad destinations with scholarship opportunities. Study in UK, China, South Korea, Hungary, Cyprus, Croatia, Georgia, Finland, Netherlands and more.',
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
    canonical: 'https://www.eduexpressint.com/destinations',
  },
};

export default function DestinationsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Explore top study abroad destinations with scholarship opportunities. Study in UK, China, South Korea, Hungary, Cyprus, Croatia, Georgia, Finland, Netherlands and more.",
    "url": "https://www.eduexpressint.com/destinations",
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
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Study Abroad Destinations",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Study in China",
            "description": "Study in China with world-class universities and scholarship opportunities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Study in UK",
            "description": "Study in UK with Russell Group universities and world-class education"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Study in Netherlands",
            "description": "Study in Netherlands with innovation excellence and EU work rights"
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
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study Abroad Destinations',
                page_location: window.location.href,
                content_group1: 'Destinations'
              });
            }
            
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="destinations"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Destinations Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <DestinationsClient />
    </>
  );
}

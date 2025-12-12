import { Metadata } from 'next';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';
import CroatiaClient from './CroatiaClient';

export const metadata: Metadata = {
  title: 'Study in Croatia - Affordable EU Education & Stunning Adriatic Coastline',
  description: 'Study in Croatia with affordable EU education at top universities like Zagreb, Split, Rijeka. From €2,000 per year with Croatian Government Scholarship opportunities and EU work rights.',
  keywords: [
    'study in Croatia',
    'Croatia universities',
    'University of Zagreb',
    'University of Split',
    'University of Rijeka',
    'Croatian Government Scholarship',
    'Erasmus+ Program',
    'Croatia student visa',
    'EU education',
    'study abroad Croatia',
    'Croatia scholarships',
    'Croatia international students',
    'Croatia education system',
    'Croatia visa requirements',
    'study in Zagreb',
    'Croatia medical programs',
    'Croatia business programs',
    'Adriatic coastline',
    'EU work rights',
    'affordable EU education'
  ],
  openGraph: {
    title: 'Study in Croatia - Affordable EU Education & Stunning Adriatic Coastline',
    description: 'Study in Croatia with affordable EU education at top universities like Zagreb, Split, Rijeka. From €2,000 per year with Croatian Government Scholarship opportunities.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/croatia-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in Croatia - Affordable EU Education & Stunning Adriatic Coastline',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Croatia - Affordable EU Education & Stunning Adriatic Coastline',
    description: 'Study in Croatia with affordable EU education at top universities like Zagreb, Split, Rijeka. From €2,000 per year with Croatian Government Scholarship opportunities.',
    images: ['/images/croatia-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/croatia',
  },
};

export default function CroatiaPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('Croatia', {
      page: 'destinations/croatia',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in Croatia with affordable EU education at top universities like Zagreb, Split, Rijeka. From €2,000 per year with Croatian Government Scholarship opportunities and EU work rights.",
    "url": "https://www.eduexpressint.com/destinations/croatia",
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
      "name": "Study in Croatia Program",
      "description": "Study in Croatia with affordable EU education at top universities from €2,000 per year",
      "price": "2000",
      "priceCurrency": "EUR",
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
            // Track page view for Croatia
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in Croatia',
                page_location: window.location.href,
                content_group1: 'Croatia'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="croatia"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Croatia Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <CroatiaClient />
    </>
  );
}

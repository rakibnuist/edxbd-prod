import { Metadata } from 'next';
import UkClient from './UkClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in the United Kingdom - World-Class Education & Russell Group Universities',
  description: 'Study in the UK with world-class education at Russell Group universities. From £15,000 per year with excellent scholarship opportunities, Chevening & Commonwealth scholarships, and 2-year post-study work visa.',
  keywords: [
    'study in UK',
    'UK universities',
    'Russell Group universities',
    'UK education',
    'Chevening scholarships',
    'Commonwealth scholarships',
    'UK student visa',
    'graduate route visa',
    'UK tuition fees',
    'study abroad UK',
    'Oxford Cambridge',
    'Imperial College London',
    'UK scholarships',
    'UK international students',
    'UK education system',
    'UK visa requirements',
    'study in London',
    'UK medical programs',
    'UK business programs'
  ],
  openGraph: {
    title: 'Study in the United Kingdom - World-Class Education & Russell Group Universities',
    description: 'Study in the UK with world-class education at Russell Group universities. From £15,000 per year with excellent scholarship opportunities, Chevening & Commonwealth scholarships.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/uk-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in the United Kingdom - World-Class Education & Russell Group Universities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in the United Kingdom - World-Class Education & Russell Group Universities',
    description: 'Study in the UK with world-class education at Russell Group universities. From £15,000 per year with excellent scholarship opportunities.',
    images: ['/images/uk-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/uk',
  },
};

export default function UKPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('UK', {
      page: 'destinations/uk',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in the UK with world-class education at Russell Group universities. From £15,000 per year with excellent scholarship opportunities, Chevening & Commonwealth scholarships, and 2-year post-study work visa.",
    "url": "https://www.eduexpressint.com/destinations/uk",
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
      "name": "Study in UK Program",
      "description": "Study in the UK with world-class education at Russell Group universities from £15,000 per year",
      "price": "15000",
      "priceCurrency": "GBP",
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
            // Track page view for UK
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in UK',
                page_location: window.location.href,
                content_group1: 'UK'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="uk"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'UK Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <UkClient />
    </>
  );
}

import { Metadata } from 'next';
import FinlandClient from './FinlandClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in Finland - World\'s Happiest Country | €8,000 Per Year | 500+ English Programs',
  description: 'Study in Finland - the world\'s happiest country! From €8,000 per year with free tuition for EU students. 500+ English programs, no language barrier, €700 monthly living costs. Innovation hub with tech & research excellence.',
  keywords: [
    'study in Finland',
    'Finland universities',
    'world\'s happiest country',
    'Finland education',
    'free tuition EU students',
    'English programs Finland',
    'Finland student visa',
    'innovation hub Finland',
    'Finland tuition fees',
    'study abroad Finland',
    'University of Helsinki',
    'Aalto University',
    'Finland scholarships',
    'EU work rights Finland',
    'Finland living costs',
    'Finland international students',
    'Finland education system',
    'Finland visa requirements',
    'study in Helsinki',
    'Finland technology programs'
  ],
  openGraph: {
    title: 'Study in Finland - World\'s Happiest Country | €8,000 Per Year | 500+ English Programs',
    description: 'Study in Finland - the world\'s happiest country! From €8,000 per year with free tuition for EU students. 500+ English programs, no language barrier.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/finland-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in Finland - World\'s Happiest Country',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Finland - World\'s Happiest Country | €8,000 Per Year | 500+ English Programs',
    description: 'Study in Finland - the world\'s happiest country! From €8,000 per year with free tuition for EU students.',
    images: ['/images/finland-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/finland',
  },
};

export default function FinlandPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('Finland', {
      page: 'destinations/finland',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in Finland - the world's happiest country! From €8,000 per year with free tuition for EU students. 500+ English programs, no language barrier.",
    "url": "https://www.eduexpressint.com/destinations/finland",
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
      "name": "Study in Finland Program",
      "description": "Study in Finland with 500+ English programs from €8,000 per year",
      "price": "8000",
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
            // Track page view for Finland
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in Finland',
                page_location: window.location.href,
                content_group1: 'Finland'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="finland"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Finland Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <FinlandClient />
    </>
  );
}

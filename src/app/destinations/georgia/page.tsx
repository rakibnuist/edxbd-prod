import { Metadata } from 'next';
import GeorgiaClient from './GeorgiaClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in Georgia - Medicine, Business & Tech | Bachelors & Masters',
  description: 'Study in Georgia: WHO-recognized MBBS, plus accredited Bachelor\'s & Master\'s in Business, IT, and Engineering. Affordable fees starting $3,000/year.',
  keywords: [
    'study in Georgia',
    'Georgia universities',
    'MBBS in Georgia',
    'BBA in Georgia',
    'MBA in Georgia',
    'Computer Science Georgia',
    'Engineering in Georgia',
    'Georgia student visa',
    'affordable education Europe',
    'English medium programs'
  ],
  openGraph: {
    title: 'Study in Georgia - Medicine, Business & Tech | Bachelors & Masters',
    description: 'Pursue WHO-recognized Medical degrees or accredited Bachelor\'s & Master\'s in Business and Technology. Affordable tuition from $3,000/year.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/georgia-medical-education.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in Georgia - Medical Education',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Georgia - World-Class Medical Education from $3,000 Per Year',
    description: 'Experience affordable world-class education with English-medium programs and WHO-recognized medical degrees in the heart of Europe.',
    images: ['/images/georgia-medical-education.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/georgia',
  },
};

export default function GeorgiaPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('Georgia', {
      page: 'destinations/georgia',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in Georgia with world-class medical education from $3,000 per year. WHO-recognized medical degrees, 100% English medium programs, European standards, and affordable living costs.",
    "url": "https://www.eduexpressint.com/destinations/georgia",
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
      "name": "Study in Georgia Program",
      "description": "Study in Georgia with world-class medical education from $3,000 per year",
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
            // Track page view for Georgia
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in Georgia',
                page_location: window.location.href,
                content_group1: 'Georgia'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="georgia"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Georgia Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <GeorgiaClient />
    </>
  );
}

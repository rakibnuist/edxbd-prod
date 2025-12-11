import { Metadata } from 'next';
import HungaryClient from './HungaryClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in Hungary - EU Degree Recognition & Affordable Education from €3,000',
  description: 'Study in Hungary with EU degree recognition and affordable tuition fees from €3,000 per year. 65+ universities, 95% success rate, English programs, and multiple scholarship opportunities.',
  keywords: [
    'study in Hungary',
    'Hungary universities',
    'EU degree recognition',
    'Hungary education',
    'Stipendium Hungaricum',
    'Hungary student visa',
    'Hungary tuition fees',
    'study abroad Hungary',
    'Budapest universities',
    'Semmelweis University',
    'Hungary scholarships',
    'English programs Hungary',
    'affordable education Hungary',
    'Central European education',
    'Hungary international students',
    'Hungary education system',
    'Hungary visa requirements',
    'study in Budapest',
    'Hungary medical programs'
  ],
  openGraph: {
    title: 'Study in Hungary - EU Degree Recognition & Affordable Education',
    description: 'Experience world-class education with EU degree recognition and affordable tuition fees in Hungary\'s leading universities. From €3,000 per year with scholarships available.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/hungary-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in Hungary - EU Degree Recognition & Affordable Education',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Hungary - EU Degree Recognition & Affordable Education',
    description: 'Experience world-class education with EU degree recognition and affordable tuition fees in Hungary\'s leading universities.',
    images: ['/images/hungary-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/hungary',
  },
};

export default function HungaryPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('Hungary', {
      page: 'destinations/hungary',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in Hungary with EU degree recognition and affordable tuition fees from €3,000 per year. 65+ universities, 95% success rate, English programs, and multiple scholarship opportunities.",
    "url": "https://www.eduexpressint.com/destinations/hungary",
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
      "name": "Study in Hungary Program",
      "description": "Study in Hungary with EU degree recognition from €3,000 per year",
      "price": "3000",
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
            // Track page view for Hungary
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in Hungary',
                page_location: window.location.href,
                content_group1: 'Hungary'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="hungary"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Hungary Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <HungaryClient />
    </>
  );
}

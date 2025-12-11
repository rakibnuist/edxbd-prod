import { Metadata } from 'next';
import CyprusClient from './CyprusClient';
import { trackDestinationInterest, getUserDevice } from '@/lib/vercel-analytics';

export const metadata: Metadata = {
  title: 'Study in Cyprus - Earn While You Study | Up to €18,000 Per Year with Paid Internships',
  description: 'Study in Cyprus with paid internships at luxury hotels. Earn up to €18,000 per year while studying. Get both Cyprus & UK degrees with 100% visa success rate and 4+4 year work permit.',
  keywords: [
    'study in Cyprus',
    'Cyprus universities',
    'earn while studying',
    'paid internships Cyprus',
    'Cyprus student visa',
    'Cyprus education',
    'double degrees Cyprus UK',
    'Cyprus work permit',
    'study abroad Cyprus',
    'Cyprus scholarships',
    'Cyprus tuition fees',
    'Cyprus living costs',
    'Cyprus student life',
    'Cyprus hospitality programs',
    'Cyprus business programs',
    'Cyprus international students',
    'Cyprus education system',
    'Cyprus visa requirements'
  ],
  openGraph: {
    title: 'Study in Cyprus - Earn While You Study | Up to €18,000 Per Year with Paid Internships',
    description: 'Study in Cyprus with paid internships at luxury hotels. Earn up to €18,000 per year while studying. Get both Cyprus & UK degrees with 100% visa success rate.',
    type: 'website',
    locale: 'en_US',
    siteName: 'EduExpress International',
    images: [
      {
        url: '/images/cyprus-study-abroad.jpg',
        width: 1200,
        height: 630,
        alt: 'Study in Cyprus - Earn While You Study',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Cyprus - Earn While You Study | Up to €18,000 Per Year with Paid Internships',
    description: 'Study in Cyprus with paid internships at luxury hotels. Earn up to €18,000 per year while studying.',
    images: ['/images/cyprus-study-abroad.jpg'],
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
    canonical: 'https://www.eduexpressint.com/destinations/cyprus',
  },
};

export default function CyprusPage() {
  // Track destination page view
  if (typeof window !== 'undefined') {
    trackDestinationInterest('Cyprus', {
      page: 'destinations/cyprus',
      source: 'page_load',
      device: getUserDevice()
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduExpress International",
    "description": "Study in Cyprus with paid internships at luxury hotels. Earn up to €18,000 per year while studying. Get both Cyprus & UK degrees with 100% visa success rate.",
    "url": "https://www.eduexpressint.com/destinations/cyprus",
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
      "name": "Study in Cyprus Program",
      "description": "Study in Cyprus with paid internships earning up to €18,000 per year",
      "price": "18000",
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
            // Track page view for Cyprus
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in Cyprus',
                page_location: window.location.href,
                content_group1: 'Cyprus'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="cyprus"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: 'Cyprus Page',
                    value: 1
                  });
                }
              }
            });
          `
        }}
      />

      <CyprusClient />
    </>
  );
}

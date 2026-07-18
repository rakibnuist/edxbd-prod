import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { countries } from '@/lib/countries';
import DestinationTracking from '@/components/DestinationTracking';

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return countries.map((country) => ({
    country: country.slug,
  }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country) {
    return {
      title: 'Country Not Found',
    };
  }

  return {
    title: `Study in ${country.name} | EduExpress International`,
    description: `Study abroad in ${country.name} with expert guidance. FREE scholarship assistance, university applications, and visa support. 98% success rate.`,
    keywords: `study in ${country.name}, ${country.name} universities, ${country.name} education, study abroad ${country.name}, ${country.name} scholarships`,
    openGraph: {
      title: `Study in ${country.name} | EduExpress International`,
      description: `Transform your education journey in ${country.name}. FREE scholarship assistance with 98% success rate.`,
      images: [
        {
          url: `/images/destinations/${country.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `Study in ${country.name}`,
        },
      ],
    },
  };
}

import DestinationDetailClient from './DestinationDetailClient';
import FAQSection from '@/components/FAQSection';

export default async function CountryPage({ params }: CountryPageProps) {
  try {
    const { country: countrySlug } = await params;

    // Validate the country slug
    if (!countrySlug || typeof countrySlug !== 'string') {
      console.error('Invalid country slug:', countrySlug);
      notFound();
    }

    const country = countries.find((c) => c.slug === countrySlug);

    if (!country) {
      console.error('Country not found for slug:', countrySlug);
      notFound();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": `Study in ${country.name}`,
      "description": `Expert study abroad consultancy for ${country.name}`,
      "url": `https://eduexpressint.com/destinations/${country.slug}`,
      "logo": "https://eduexpressint.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+880-1983-333566",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"]
      },
      "offers": {
        "@type": "Offer",
        "name": `Study Abroad Consultation - ${country.name}`,
        "description": `Free consultation for studying in ${country.name}`,
        "price": "0",
        "priceCurrency": "BDT",
        "availability": "https://schema.org/InStock"
      }
    };

    const faqSchema = country.faqs && country.faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": country.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    } : null;

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        {/* Destination Tracking */}
        <DestinationTracking countryName={country.name} />

        {/* GTM Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Track page view for ${country.name}
            if (typeof gtag !== 'undefined') {
              gtag('event', 'page_view', {
                page_title: 'Study in ${country.name}',
                page_location: window.location.href,
                content_group1: '${country.name}'
              });
            }
            
            // Track consultation button clicks
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-source*="${countrySlug}"]')) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'generate_lead', {
                    event_category: 'Consultation',
                    event_label: '${country.name} Page',
                    value: 1
                  });
                }
              }
            });
          `
          }}
        />

        <DestinationDetailClient country={country} />
        
        {country.faqs && country.faqs.length > 0 && (
          <div className="bg-gray-50/50 w-full pb-12">
            <FAQSection faqs={country.faqs} />
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('Error in CountryPage:', error);
    notFound();
  }
}
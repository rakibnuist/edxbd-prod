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
    description: `Study abroad in ${country.name} with expert guidance. FREE scholarship assistance, university applications, and visa support. 97% success rate.`,
    keywords: `study in ${country.name}, ${country.name} universities, ${country.name} education, study abroad ${country.name}, ${country.name} scholarships`,
    openGraph: {
      title: `Study in ${country.name} | EduExpress International`,
      description: `Transform your education journey in ${country.name}. FREE scholarship assistance with 97% success rate.`,
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

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Study in {country.name}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Transform your education journey with expert guidance and FREE scholarship assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  data-source={`${countrySlug}_hero`}
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Get FREE Consultation
                </button>
                <button 
                  data-source={`${countrySlug}_hero_whatsapp`}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  WhatsApp Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Country Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why Choose {country.name} for Your Education?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">World-Class Education</h3>
                  <p className="text-gray-600">
                    {country.name} offers internationally recognized degrees with modern facilities and experienced faculty.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Scholarship Opportunities</h3>
                  <p className="text-gray-600">
                    Access to various scholarship programs and financial aid options for international students.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Career Prospects</h3>
                  <p className="text-gray-600">
                    Excellent job opportunities and career growth potential in {country.name}.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Cultural Experience</h3>
                  <p className="text-gray-600">
                    Rich cultural heritage and diverse international student community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Journey in {country.name}?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get expert guidance and FREE scholarship assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                data-source={`${countrySlug}_cta`}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Application
              </button>
              <button 
                data-source={`${countrySlug}_cta_whatsapp`}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                WhatsApp Consultation
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
  } catch (error) {
    console.error('Error in CountryPage:', error);
    notFound();
  }
}
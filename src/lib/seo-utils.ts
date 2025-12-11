// SEO utilities for EduExpress International

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
}

export interface CountryData {
  slug: string;
  countryCode?: string;
  [key: string]: unknown;
}

export interface UpdateData {
  title: string;
  metaDescription?: string;
  excerpt?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

// Generate SEO data for different page types
export const generateSEOData = {
  // Homepage SEO
  homepage: (): SEOData => ({
    title: "Study Abroad Consultancy | Free Scholarship Assistance | EduExpress International",
    description: "Transform your education journey with EduExpress International. Expert study abroad consultancy with FREE scholarship assistance. 97% success rate. Study in UK, China, South Korea, Hungary & more. Free consultation available.",
    keywords: [
      "study abroad",
      "education consultancy",
      "scholarship assistance",
      "UK universities",
      "China universities",
      "South Korea education",
      "Hungary study",
      "visa assistance",
      "international education",
      "Bangladesh students",
      "free consultation",
      "study abroad Bangladesh",
      "overseas education",
      "university admission",
      "student visa",
      "education consultant"
    ],
    canonical: "/",
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "EduExpress International",
      "alternateName": ["EduExpress", "EduExpress International Consultancy"],
      "description": "Leading study abroad consultancy in Bangladesh providing expert guidance and FREE scholarship assistance for international education. 97% success rate with 3000+ students helped since 2018.",
      "url": "https://www.eduexpressint.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.eduexpressint.com/logo.png",
        "width": 200,
        "height": 200
      },
      "image": [
        "https://www.eduexpressint.com/og-image.jpg",
        "https://www.eduexpressint.com/logo.png"
      ],
      "foundingDate": "2018",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House: 12/1, Ground Floor, Road: 4/A",
        "addressLocality": "Dhanmondi",
        "addressRegion": "Dhaka",
        "postalCode": "1209",
        "addressCountry": "BD"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+880-1983-333566",
          "contactType": "customer service",
          "availableLanguage": ["English", "Bengali"],
          "areaServed": "BD",
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        }
      ],
      "email": "info@eduexpressint.com",
      "sameAs": [
        "https://www.facebook.com/eduexpressint",
        "https://www.linkedin.com/company/eduexpress-international",
        "https://www.instagram.com/eduexpressint",
        "https://twitter.com/eduexpressint"
      ],
      "serviceArea": {
        "@type": "Country",
        "name": "Bangladesh"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Study Abroad Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Study Abroad Consultation",
              "description": "Free consultation for study abroad opportunities"
            },
            "price": "0",
            "priceCurrency": "BDT"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Scholarship Assistance",
              "description": "Free scholarship application assistance"
            },
            "price": "0",
            "priceCurrency": "BDT"
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3000",
        "bestRating": "5",
        "worstRating": "1"
      },
      "priceRange": "Free consultation available"
    }
  }),

  // Country destination pages
  country: (countryName: string, countryData: CountryData): SEOData => ({
    title: `Study in ${countryName} | ${countryName} Universities | EduExpress International`,
    description: `Study in ${countryName} with EduExpress International. Expert guidance for ${countryName} universities, scholarships, and visa assistance. Free consultation available for ${countryName} study programs.`,
    keywords: [
      `study in ${countryName}`,
      `${countryName} universities`,
      `${countryName} education`,
      `${countryName} student visa`,
      `${countryName} scholarships`,
      `${countryName} study abroad`,
      `${countryName} universities for international students`,
      `${countryName} education system`,
      `${countryName} admission requirements`,
      `${countryName} tuition fees`,
      `${countryName} living costs`,
      `${countryName} student life`,
      "study abroad",
      "education consultancy",
      "scholarship assistance",
      "visa assistance",
      "international education"
    ],
    canonical: `/destinations/${countryData.slug}`,
    ogType: "website",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": `Study in ${countryName} - EduExpress International`,
      "description": `Expert guidance for studying in ${countryName}. University applications, scholarships, and visa assistance.`,
      "url": `https://www.eduexpressint.com/destinations/${countryData.slug}`,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countryData.countryCode || "BD"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${countryName} Study Services`,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${countryName} University Applications`,
              "description": `Complete assistance for ${countryName} university applications`
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": `${countryName} Student Visa`,
              "description": `Expert guidance for ${countryName} student visa applications`
            }
          }
        ]
      }
    }
  }),

  // Service pages
  service: (serviceName: string, serviceDescription: string): SEOData => ({
    title: `${serviceName} | Study Abroad Services | EduExpress International`,
    description: `${serviceDescription} with EduExpress International. Expert study abroad services including ${serviceName.toLowerCase()}. Free consultation available.`,
    keywords: [
      serviceName.toLowerCase(),
      "study abroad services",
      "education consultancy",
      "scholarship assistance",
      "visa assistance",
      "university application",
      "international education",
      "study abroad Bangladesh",
      "education consultant"
    ],
    canonical: `/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
    ogType: "website"
  }),

  // About page
  about: (): SEOData => ({
    title: "About Us | EduExpress International | Study Abroad Consultancy",
    description: "Learn about EduExpress International - Bangladesh's leading study abroad consultancy. 3000+ students helped since 2018 with 97% success rate. Expert guidance for international education.",
    keywords: [
      "about eduexpress international",
      "study abroad consultancy Bangladesh",
      "education consultant team",
      "study abroad success stories",
      "international education experts",
      "Bangladesh education consultancy",
      "study abroad experience",
      "education guidance"
    ],
    canonical: "/about",
    ogType: "website"
  }),

  // Contact page
  contact: (): SEOData => ({
    title: "Contact Us | Free Study Abroad Consultation | EduExpress International",
    description: "Contact EduExpress International for free study abroad consultation. Expert guidance for international education, scholarships, and visa assistance. Get in touch today!",
    keywords: [
      "contact eduexpress international",
      "free study abroad consultation",
      "study abroad contact",
      "education consultancy contact",
      "study abroad help",
      "international education support",
      "study abroad inquiry",
      "education consultant contact"
    ],
    canonical: "/contact",
    ogType: "website"
  }),

  // Updates/Blog posts
  update: (updateData: UpdateData): SEOData => ({
    title: `${updateData.title} | Study Abroad Updates | EduExpress International`,
    description: updateData.metaDescription || updateData.excerpt || `Latest study abroad updates from EduExpress International. ${updateData.title} - Expert insights on international education.`,
    keywords: [
      "study abroad updates",
      "international education news",
      "study abroad information",
      "education updates",
      "study abroad insights",
      "international education trends",
      "study abroad guidance",
      "education news"
    ],
    canonical: `/updates/${updateData.slug}`,
    ogType: "article",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": updateData.title,
      "description": updateData.metaDescription || updateData.excerpt,
      "author": {
        "@type": "Organization",
        "name": "EduExpress International"
      },
      "publisher": {
        "@type": "Organization",
        "name": "EduExpress International",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.eduexpressint.com/logo.png"
        }
      },
      "datePublished": updateData.createdAt,
      "dateModified": updateData.updatedAt,
      "url": `https://www.eduexpressint.com/updates/${updateData.slug}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.eduexpressint.com/updates/${updateData.slug}`
      }
    }
  }),

  // Partnership page
  partnership: (): SEOData => ({
    title: "Partnership | Study Abroad Partners | EduExpress International",
    description: "Partner with EduExpress International for study abroad opportunities. Join our network of education partners and help students achieve their international education dreams.",
    keywords: [
      "study abroad partnership",
      "education partnership",
      "university partnership",
      "study abroad network",
      "education collaboration",
      "international education partnership",
      "study abroad partners",
      "education alliance"
    ],
    canonical: "/partnership",
    ogType: "website"
  })
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://www.eduexpressint.com${crumb.url}`
  }))
});

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Generate review structured data
export const generateReviewStructuredData = (reviews: Array<{
  name: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EduExpress International",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": reviews.length.toString(),
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": reviews.map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished
  }))
});

// Generate local business structured data
export const generateLocalBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "EduExpress International",
  "description": "Leading study abroad consultancy in Bangladesh",
  "url": "https://www.eduexpressint.com",
  "telephone": "+880-1983-333566",
  "email": "info@eduexpressint.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "House: 12/1, Ground Floor, Road: 4/A",
    "addressLocality": "Dhanmondi",
    "addressRegion": "Dhaka",
    "postalCode": "1209",
    "addressCountry": "BD"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "23.8103",
    "longitude": "90.4125"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "Free consultation available",
  "currenciesAccepted": "BDT",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer"
});

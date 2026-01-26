// Configuration file for tracking and SEO

export const config = {
  // Site Information
  site: {
    name: 'EduExpress International',
    url: 'https://www.eduexpressint.com',
    description: 'Expert study abroad consultancy with FREE scholarship assistance. 97% success rate.',
  },

  // Tracking IDs (replace with your actual IDs)
  tracking: {
    gtm: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX',
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890',
    metaAccessToken: process.env.META_ACCESS_TOKEN || '',
    ga4: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },

  // SEO Configuration
  seo: {
    googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your_google_verification_code',
    yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'your_yandex_verification_code',
    yahooVerification: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION || 'your_yahoo_verification_code',
  },

  // Contact Information
  contact: {
    phone: '+880-1983-333566',
    phoneSecondary: '+880 1329-663505',
    email: 'info@eduexpressint.com',
    address: {
      street: 'House: 12/1, Ground Floor, Road: 4/A',
      city: 'Dhanmondi',
      region: 'Dhaka',
      postalCode: '1209',
      country: 'BD',
    },
  },

  // Social Media
  social: {
    facebook: 'https://www.facebook.com/eduexpressint',
    linkedin: 'https://www.linkedin.com/company/eduexpress-international',
    instagram: 'https://www.instagram.com/eduexpressint',
    twitter: 'https://twitter.com/eduexpressint',
  },

  // Business Information
  business: {
    founded: '2005',
    rating: '4.9',
    reviewCount: '1250',
    successRate: '97%',
    studentsHelped: '10000+',
  },
};

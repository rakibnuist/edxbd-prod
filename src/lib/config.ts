// Configuration file for tracking and SEO

export const config = {
  // Site Information
  site: {
    name: 'EduExpress International',
    url: 'https://eduexpressint.com',
    description: "Bangladesh's Evidence First Education Consultancy. Better Education. Clear Costs. Written Proof.",
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
    phone: '01983 333566',
    alternatePhone: '01329 663505',
    whatsapp: '+8801983333566',
    email: 'info@eduexpressint.com',
    address: {
      street: 'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi',
      city: 'Dhaka',
      region: 'Dhaka',
      postalCode: '1209',
      country: 'BD',
    },
  },

  // Social Media
  social: {
    facebook: 'https://www.facebook.com/eduexpressint',
    linkedin: 'https://www.linkedin.com/company/eduexpress',
    instagram: 'https://www.instagram.com/eduexpressint/',
    youtube: 'https://www.youtube.com/@EduExpressInt',
    twitter: 'https://twitter.com/eduexpressint',
  },

  // Company performance claims remain unpublished until their definitions,
  // evidence, approval and review dates are stored in the governed CMS.
  business: {
    founded: null,
    rating: null,
    reviewCount: null,
    successRate: null,
    studentsHelped: null,
  },
};

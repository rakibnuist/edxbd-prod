import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import EnhancedAnalytics from "@/components/EnhancedAnalytics";

import Footer from "@/components/Footer";
import QuickContactForm from "@/components/QuickContactForm";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalMain from "@/components/ConditionalMain";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import EducationTracking from "@/components/EducationTracking";

import WhatsAppWrapper from "@/components/WhatsAppWrapper";

import "./globals.css";

// Primary font for body text and UI elements
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Elegant serif font for headings and special text
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://www.eduexpressint.com'),
  title: {
    default: "EduExpress International - Study Abroad Consultancy | Free Scholarship Assistance",
    template: "%s | EduExpress International"
  },
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
    "EduExpress International",
    "free consultation",
    "study abroad Bangladesh",
    "overseas education",
    "university admission",
    "student visa",
    "education consultant",
    "study abroad consultant",
    "scholarship consultant",
    "international student advisor",
    "study visa consultant",
    "education abroad",
    "foreign education",
    "study overseas",
    "university application",
    "student visa application",
    "education migration",
    "study permit",
    "student visa help",
    "education guidance"
  ],
  authors: [{ name: "EduExpress International", url: "https://www.eduexpressint.com" }],
  creator: "EduExpress International",
  publisher: "EduExpress International",
  applicationName: "EduExpress International",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.eduexpressint.com",
    siteName: "EduExpress International",
    title: "EduExpress International - Study Abroad Consultancy | Free Scholarship Assistance",
    description: "Transform your education journey with expert study abroad consultancy. FREE scholarship assistance with 97% success rate. Study in UK, China, South Korea, Hungary & more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduExpress International - Study Abroad Consultancy with Free Scholarship Assistance",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduExpress International - Study Abroad Consultancy | Free Scholarship Assistance",
    description: "Transform your education journey with expert study abroad consultancy. FREE scholarship assistance with 97% success rate.",
    images: ["/og-image.jpg"],
    creator: "@eduexpressint",
    site: "@eduexpressint",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  alternates: {
    canonical: "https://www.eduexpressint.com",
    languages: {
      'en-US': 'https://www.eduexpressint.com',
      'bn-BD': 'https://www.eduexpressint.com/bn',
    },
  },
  category: 'education',
  classification: 'Education Services',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'EduExpress International',
    'application-name': 'EduExpress International',
    'msapplication-TileColor': '#1e40af',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#1e40af',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
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
      },
      {
        "@type": "ContactPoint",
        "telephone": "+880-1329-6663505",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"],
        "areaServed": "BD"
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
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Visa Application Support",
            "description": "Complete visa application guidance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "University Application Support",
            "description": "Complete university application assistance"
          }
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
    "priceRange": "Free consultation available",
    "knowsAbout": [
      "Study Abroad",
      "Scholarship Applications",
      "Visa Processing",
      "University Applications",
      "International Education",
      "Student Visa",
      "Education Consultancy"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Free Study Abroad Consultation",
        "description": "Complimentary consultation for study abroad opportunities",
        "price": "0",
        "priceCurrency": "BDT"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://www.eduexpressint.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduExpress International" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />




      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
        style={{ marginTop: 0 }}
      >
        <EnhancedAnalytics />
        <EducationTracking
          whatsappSource="floating_widget"
          phoneSource="header_contact"
        />
        <ConditionalHeader />
        <ConditionalMain>
          <PageTransition>
            {children}
          </PageTransition>
        </ConditionalMain>
        <Footer />
        <QuickContactForm />
        <ScrollToTop />
        <WhatsAppWrapper
          phoneNumber="+8801983333566"
          message="Hi! I'm interested in studying abroad. Can you help me with information about universities and scholarships?"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}

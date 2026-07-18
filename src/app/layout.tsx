import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LazyMotion, domAnimation } from "framer-motion";

import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalMain from "@/components/ConditionalMain";
import PageTransition from "@/components/PageTransition";
import EducationTracking from "@/components/EducationTracking";
import DeferredComponents from "@/components/DeferredComponents";

import WhatsAppWrapper from "@/components/WhatsAppWrapper";
import CookieConsent from "@/components/CookieConsent";
import { Preconnect } from "@/components/Preconnect";

import "./globals.css";

// Primary font for body text and UI elements
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // Prevent Flash of Invisible Text (FOIT)
});

// Elegant serif font for headings and special text
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap", // Prevent Flash of Invisible Text (FOIT)
});

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://eduexpressint.com'),
  title: {
    default: "EduExpress International - Study Abroad Consultancy | Free Scholarship Assistance",
    template: "%s | EduExpress International"
  },
  description: "Transform your education journey with EduExpress International. Expert study abroad consultancy with FREE scholarship assistance. 98% success rate. Study in UK, China, South Korea, Hungary & more. Free consultation available.",
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
  authors: [{ name: "EduExpress International", url: "https://eduexpressint.com" }],
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
    url: "https://eduexpressint.com",
    siteName: "EduExpress International",
    title: "EduExpress International - Study Abroad Consultancy | Free Scholarship Assistance",
    description: "Transform your education journey with expert study abroad consultancy. FREE scholarship assistance with 98% success rate. Study in UK, China, South Korea, Hungary & more.",
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
    description: "Transform your education journey with expert study abroad consultancy. FREE scholarship assistance with 98% success rate.",
    images: ["/og-image.jpg"],
    creator: "@eduexpressint",
    site: "@eduexpressint",
  },
  category: 'education',
  classification: 'Education Services',
  other: {
    'msapplication-TileColor': '#1e40af',
    'msapplication-config': '/browserconfig.xml',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduExpress International",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: "/site.webmanifest",
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
    "description": "Leading study abroad consultancy in Bangladesh providing expert guidance and FREE scholarship assistance for international education. 98% success rate with 3,000+ students helped since 2018.",
    "url": "https://eduexpressint.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eduexpressint.com/logo.png",
      "width": 200,
      "height": 200
    },
    "image": [
      "https://eduexpressint.com/og-image.jpg",
      "https://eduexpressint.com/logo.png"
    ],
    "foundingDate": "2018",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi-1209",
      "addressLocality": "Dhaka",
      "addressRegion": "Dhaka",
      "postalCode": "1209",
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.7461,
      "longitude": 90.3742
    },
    "telephone": "+880 1983-333566",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+880 1983-333566",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"],
        "areaServed": "BD",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+880 1329-663505",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"],
        "areaServed": "BD"
      }
    ],
    "email": "info@eduexpressint.com",
    "sameAs": [
      "https://www.facebook.com/EduExpressIntBD",
      "https://www.linkedin.com/company/eduexpress/",
      "https://www.instagram.com/eduexpressint",
      "https://www.youtube.com/@EduExpressInt"
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
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
        style={{ marginTop: 0 }}
      >
        <LazyMotion features={domAnimation}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
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
          <Preconnect />
          <WhatsAppWrapper
            phoneNumber="+8801983333566"
            message="Hi! I'm interested in studying abroad. Can you help me with information about universities and scholarships?"
          />
          <CookieConsent />
          <DeferredComponents />
          <SpeedInsights />
        </LazyMotion>
      </body>
    </html>
  );
}


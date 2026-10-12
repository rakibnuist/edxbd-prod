import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import ConditionalHeader from "@/components/ConditionalHeader";
import EducationTracking from "@/components/EducationTracking";
import Footer from "@/components/Footer";
import ConditionalFooter from "@/components/ConditionalFooter";

import WhatsAppWrapper from "@/components/WhatsAppWrapper";
import CookieConsent from "@/components/CookieConsent";
import MetaPixel from "@/components/MetaPixel";
import GoogleTags from "@/components/GoogleTags";

import "./globals.css";
import { getPublicTrustRecords } from '@/lib/trust-records';

export const viewport: Viewport = {
  themeColor: "#174f7a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://eduexpressint.com'),
  title: {
    default: "EduExpress International | Evidence First Education Consultancy",
    template: "%s | EduExpress International"
  },
  description: "Bangladesh's Evidence First Education Consultancy. Compare education quality, recognition, total costs and career fit with written proof.",
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
    title: "EduExpress International | Evidence First Education Consultancy",
    description: "Better Education. Clear Costs. Written Proof. Compare suitable overseas education routes before you commit.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduExpress International education consultancy",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduExpress International | Evidence First Education Consultancy",
    description: "Better Education. Clear Costs. Written Proof.",
    images: ["/og-image.jpg"],
    creator: "@eduexpressint",
    site: "@eduexpressint",
  },
  category: 'education',
  classification: 'Education Services',
  other: {
    'msapplication-TileColor': '#174f7a',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { offices } = await getPublicTrustRecords();
  const office = offices[0];
  const enableProductionTracking = process.env.NODE_ENV === 'production';
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
    {
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://eduexpressint.com/#organization",
    "name": "EduExpress International",
    "alternateName": ["EduExpress", "EduExpress International Consultancy"],
    "description": "Bangladesh's Evidence First Education Consultancy, comparing education quality, costs, recognition and career fit with written proof.",
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
    "address": {
      "@type": "PostalAddress",
      "streetAddress": office?.address,
      "addressLocality": office?.city,
      "addressRegion": "Dhaka",
      "postalCode": office?.postalCode,
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.7401435,
      "longitude": 90.3713009
    },
    "telephone": [office?.phonePrimary, office?.phoneSecondary].filter(Boolean),
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": office?.phonePrimary,
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
        "telephone": office?.phoneSecondary,
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"],
        "areaServed": "BD"
      }
    ],
    "email": office?.email,
    "sameAs": [
      "https://www.facebook.com/eduexpressint",
      "https://www.linkedin.com/company/eduexpress",
      "https://www.instagram.com/eduexpressint/",
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
            "name": "Education Funding Guidance",
            "description": "Funding options assessed after education fit; availability and terms depend on the responsible institution."
          }
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
    "priceRange": "Written cost breakdown provided",
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
    }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased"
        style={{ marginTop: 0 }}
      >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          {enableProductionTracking && (
            <>
              <EducationTracking
                whatsappSource="floating_widget"
                phoneSource="header_contact"
              />
              <MetaPixel />
              <GoogleTags />
            </>
          )}
          {/*
            Scroll-reveal blocks are server-rendered with opacity:0 and are
            brought in by Framer Motion once they enter the viewport. If scripts
            never run, that opacity would strand real content invisible — so
            force every reveal target visible when JavaScript is unavailable.
          */}
          <noscript>
            <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
          </noscript>

          {/* WCAG 2.4.1 Bypass Blocks. Visually hidden until focused, so keyboard
              and screen-reader users can skip the header on every page. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[#08263c] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#174f7a] focus:ring-offset-2"
          >
            Skip to content
          </a>
          <ConditionalHeader office={office ? { phonePrimary: office.phonePrimary, hours: office.hours } : undefined} />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <WhatsAppWrapper
            phoneNumber={office?.phonePrimary || '+8801983333566'}
            message="Hi, I would like an Education Fit Assessment. Please help me compare suitable universities, complete costs, recognition and scholarship availability."
          />
          <CookieConsent />
          <ConditionalFooter><Footer /></ConditionalFooter>
          {enableProductionTracking && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
      </body>
    </html>
  );
}

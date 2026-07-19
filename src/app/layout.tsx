import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Noto_Sans_Bengali } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import ConditionalHeader from "@/components/ConditionalHeader";
import EducationTracking from "@/components/EducationTracking";
import ConditionalFooter from "@/components/ConditionalFooter";

import WhatsAppWrapper from "@/components/WhatsAppWrapper";
import CookieConsent from "@/components/CookieConsent";
import MetaPixel from "@/components/MetaPixel";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      "streetAddress": "House 12/1, Ground Floor, Road 4/A, Dhanmondi",
      "addressLocality": "Dhaka",
      "addressRegion": "Dhaka",
      "postalCode": "1209",
      "addressCountry": "BD"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.7401435,
      "longitude": 90.3713009
    },
    "telephone": ["+880 1983-333566", "+880 1329-663505"],
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
          "opens": "11:00",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${notoSansBengali.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased"
        style={{ marginTop: 0 }}
      >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <EducationTracking
            whatsappSource="floating_widget"
            phoneSource="header_contact"
          />
          <MetaPixel />
          <ConditionalHeader />
          <main>{children}</main>
          <WhatsAppWrapper
            phoneNumber="+8801983333566"
            message="Hi, I would like an Education Fit Assessment. Please help me compare suitable universities, complete costs, recognition and scholarship availability."
          />
          <CookieConsent />
          <ConditionalFooter />
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
  );
}

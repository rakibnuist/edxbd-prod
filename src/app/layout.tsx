import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import ConditionalHeader from "@/components/ConditionalHeader";
import EducationTracking from "@/components/EducationTracking";
import Footer from "@/components/Footer";
import ConditionalFooter from "@/components/ConditionalFooter";
import MobileLeadBar from "@/components/MobileLeadBar";

import StickyDishaChat from "@/components/chat/StickyDishaChat";
import CookieConsent from "@/components/CookieConsent";
import RevealObserver from "@/components/motion/RevealObserver";
import MetaPixel from "@/components/MetaPixel";
import GoogleTags from "@/components/GoogleTags";

import "./globals.css";
import { getPublicTrustRecords } from '@/lib/trust-records';

export const viewport: Viewport = {
  themeColor: "#f1f5f9",
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
    locale: "en_BD",
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
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
      ? {
          other: {
            ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : {}),
            ...(process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION ? { 'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION } : {}),
          },
        }
      : {}),
  },
  other: {
    'msapplication-TileColor': '#12436b',
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
  alternates: { types: { 'application/rss+xml': [{ url: '/updates/feed.xml', title: 'EduExpress education updates' }] } },
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
    "disambiguatingDescription": "Independent Bangladeshi study abroad consultancy founded in Dhaka in 2018 (Dhanmondi, Dhaka 1209); unaffiliated with unrelated companies sharing a similar name outside Bangladesh.",
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
    "foundingDate": "2018-03-08",
    "founder": { "@type": "Person", "name": "Abdullah Al Rakib", "jobTitle": "Founder and CEO" },
    "slogan": "Better Education. Clear Costs. Written Proof.",
    "publishingPrinciples": "https://eduexpressint.com/how-we-verify-universities",
    "actionableFeedbackPolicy": "https://eduexpressint.com/complaints-and-resolution",
    "areaServed": { "@type": "Country", "name": "Bangladesh" },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "11:00",
      "closes": "18:00"
    },
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
          "opens": "11:00",
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
      "https://www.youtube.com/@EduExpressInt",
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
      "Study in China from Bangladesh",
      "Chinese Government Scholarship (CSC)",
      "Study in Malaysia from Bangladesh",
      "EMGS Student Pass and VAL",
      "Bangladesh Bank Student File",
      "China X1 and X2 Student Visa",
      "BMDC Recognized MBBS in China",
      "Study Abroad Total Cost Comparison",
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
    },
    {
      "@type": "WebSite",
      "@id": "https://eduexpressint.com/#website",
      "url": "https://eduexpressint.com/",
      "name": "EduExpress International",
      "inLanguage": ["en-BD", "bn-BD"],
      "publisher": { "@id": "https://eduexpressint.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://eduexpressint.com/universities?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
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
          {/* Raw CSS guard so LightningCSS browserslist pruning never strips -webkit-appearance on selects */}
          <style
            id="ed-select-appearance"
            dangerouslySetInnerHTML={{
              __html:
                'select.ed-field,.ed-select,select.appearance-none{-webkit-appearance:none!important;-moz-appearance:none!important;appearance:none!important;}select.ed-field::picker-icon,.ed-select::picker-icon,select.appearance-none::picker-icon{display:none!important;content:none!important;opacity:0!important;}',
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
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
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[#12436b] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#12436b] focus:ring-offset-2"
          >
            Skip to content
          </a>
          <ConditionalHeader office={office ? { phonePrimary: office.phonePrimary, phoneSecondary: office.phoneSecondary, hours: office.hours } : undefined} />
          <main id="main-content" tabIndex={-1} className="pb-[calc(76px+env(safe-area-inset-bottom,0px))] lg:pb-0">{children}</main>
          <StickyDishaChat phoneNumber={office?.phonePrimary || '+8801983333566'} />
          <MobileLeadBar />
          <CookieConsent />
          <RevealObserver />
          <ConditionalFooter><Footer /></ConditionalFooter>
          {enableProductionTracking && process.env.VERCEL === '1' && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
      </body>
    </html>
  );
}

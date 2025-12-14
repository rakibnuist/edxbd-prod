'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GTM_ID, GA4_MEASUREMENT_ID, META_PIXEL_ID, trackPageView } from '@/lib/analytics';
import {
  debugMetaParameters,
  initializeFacebookLogin,
  setUserId
} from '@/lib/meta-event-quality';

const EnhancedAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Track PageView on route change (including initial load)
    trackPageView(document.title || 'EduExpress International', 'general');
  }, [pathname]);

  useEffect(() => {
    // Initialize Facebook Login SDK for Event Quality - Deferred to reduce TBT
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          initializeFacebookLogin();
        }, { timeout: 10000 });
      } else {
        initializeFacebookLogin();
      }
    }, 8000); // 8s delay

    // Debug Meta parameters in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => debugMetaParameters(), 8000);
    }

    // Set up user ID tracking for external_id
    const existingUserId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    if (!existingUserId) {
      // Generate a temporary user ID for anonymous users
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(tempUserId, false); // Store in session, not persistent
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Vercel Analytics */}
      <VercelAnalytics />

      {/* Google Tag Manager */}
      {GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && (
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      )}

      {/* Google Analytics 4 (GA4) - Direct Loading */}
      {GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script
            id="ga4-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel (Facebook Pixel) - Direct Loading */}
      {META_PIXEL_ID && META_PIXEL_ID !== '1234567890' && (
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* Meta Pixel Noscript Fallback */}
      {META_PIXEL_ID && META_PIXEL_ID !== '1234567890' && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
};

export default EnhancedAnalytics;

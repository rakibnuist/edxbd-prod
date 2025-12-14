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

      {/* Google Tag Manager - Handles GA4 and Meta Pixel */}
      {GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && (
        <>
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
        </>
      )}
    </>
  );
};

export default EnhancedAnalytics;

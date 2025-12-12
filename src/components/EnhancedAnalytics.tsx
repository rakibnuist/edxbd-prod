'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GTM_ID, GA4_MEASUREMENT_ID, META_PIXEL_ID } from '@/lib/analytics';
import {
  debugMetaParameters,
  initializeFacebookLogin,
  setUserId
} from '@/lib/meta-event-quality';

const EnhancedAnalytics = () => {
  useEffect(() => {
    // Initialize Facebook Login SDK for Event Quality
    initializeFacebookLogin();

    // Debug Meta parameters in development
    if (process.env.NODE_ENV === 'development') {
      debugMetaParameters();
    }

    // Set up user ID tracking for external_id
    const existingUserId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id');
    if (!existingUserId) {
      // Generate a temporary user ID for anonymous users
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(tempUserId, false); // Store in session, not persistent
    }
  }, []);

  return (
    <>
      {/* Vercel Analytics */}
      <VercelAnalytics />

      {/* Google Tag Manager - Deferred */}
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

      {/* Enhanced Meta Pixel - Deferred */}
      {META_PIXEL_ID && META_PIXEL_ID !== '1234567890' && (
        <>
          <Script
            id="enhanced-meta-pixel"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                if (window.location.protocol === 'https:') {
                  // Load Meta Pixel
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  
                  fbq('init', '${META_PIXEL_ID}');
                  
                  // Enhanced PageView tracking
                  function trackEnhancedPageView() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const fbc = urlParams.get('fbclid');
                    
                    function getCookie(name) {
                      const value = '; ' + document.cookie;
                      const parts = value.split('; ' + name + '=');
                      if (parts.length === 2) return parts.pop().split(';').shift();
                      return null;
                    }
                    const fbp = getCookie('_fbp');
                    
                    const externalId = localStorage.getItem('user_id') || 
                                      sessionStorage.getItem('user_id');
                    
                    const pageViewEventId = 'pageview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    
                    const eventData = {
                      content_name: document.title,
                      content_category: 'general',
                      page_title: document.title,
                      page_category: 'general'
                    };
                    
                    if (fbc) eventData.fbc = fbc;
                    if (fbp) eventData.fbp = fbp;
                    if (externalId) eventData.external_id = externalId;
                    
                    fbq('track', 'PageView', eventData, { eventID: pageViewEventId });
                    
                    // Server-side tracking skipped for brevity in client-side deferral optimization
                    // Ideally, keep it if critical, but simplified here for performance
                  }
                  
                  trackEnhancedPageView();
                  
                  // Global tracking functions
                  window.trackEnhancedMetaEvent = function(eventName, parameters = {}, userData = {}) {
                     // Simplified for performance - mostly pass-through to fbq
                     fbq('track', eventName, parameters);
                  };
                  
                } else {
                  console.log('Meta Pixel skipped (localhost)');
                  window.trackEnhancedMetaEvent = function() {};
                }
              `,
            }}
          />
        </>
      )}

      {/* Google Analytics 4 - Deferred */}
      {GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="lazyOnload"
          />
          <Script
            id="ga4-config"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}');
              `,
            }}
          />
        </>
      )}
    </>
  );
};

export default EnhancedAnalytics;

'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { GTM_ID, GA4_MEASUREMENT_ID, META_PIXEL_ID } from '@/lib/analytics';
import {
  getMetaParameters,
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

      {/* Google Tag Manager */}
      {GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
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
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Enhanced Meta Pixel with Event Quality Parameters */}
      {META_PIXEL_ID && META_PIXEL_ID !== '1234567890' && (
        <>
          <Script
            id="enhanced-meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if (window.location.protocol === 'https:') {
                  console.log('Enhanced Meta Pixel script starting...');
                  
                  // Load Meta Pixel
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  
                  console.log('Meta Pixel script loaded, initializing...');
                  fbq('init', '${META_PIXEL_ID}');
                  console.log('Meta Pixel initialized');
                  
                  // Enhanced PageView tracking with Event Quality parameters
                  function trackEnhancedPageView() {
                    // Get Event Quality parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    const fbc = urlParams.get('fbclid');
                    
                    // Get fbp cookie
                    function getCookie(name) {
                      const value = '; ' + document.cookie;
                      const parts = value.split('; ' + name + '=');
                      if (parts.length === 2) return parts.pop().split(';').shift();
                      return null;
                    }
                    const fbp = getCookie('_fbp');
                    
                    // Get external_id
                    const externalId = localStorage.getItem('user_id') || 
                                      sessionStorage.getItem('user_id') || 
                                      sessionStorage.getItem('temp_user_id');
                    
                    // Generate unique event ID for deduplication
                    const pageViewEventId = 'pageview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    console.log('Enhanced PageView Event ID:', pageViewEventId);
                    
                    // Prepare enhanced event data
                    const eventData = {
                      content_name: document.title,
                      content_category: 'general',
                      page_title: document.title,
                      page_category: 'general'
                    };
                    
                    // Add Event Quality parameters
                    if (fbc) eventData.fbc = fbc;
                    if (fbp) eventData.fbp = fbp;
                    if (externalId) eventData.external_id = externalId;
                    
                    console.log('Enhanced PageView data:', eventData);
                    
                    // Track with Meta Pixel
                    fbq('track', 'PageView', eventData, { eventID: pageViewEventId });
                    console.log('Enhanced PageView tracked');
                    
                    // Store event ID for server-side deduplication
                    window.pageViewEventId = pageViewEventId;
                    
                    // Send to server-side Conversions API with Event Quality parameters
                    fetch('/api/meta-conversion', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        eventType: 'page_view',
                        data: {
                          pageName: document.title,
                          pageCategory: 'general',
                          eventId: pageViewEventId,
                          // Event Quality parameters
                          fbc: fbc,
                          fbp: fbp,
                          external_id: externalId
                        },
                        source: 'client_side_enhanced'
                      })
                    }).then(response => {
                      console.log('Enhanced server PageView response:', response.status);
                      return response.json();
                    }).then(data => {
                      console.log('Enhanced server PageView data:', data);
                    }).catch(err => {
                      console.log('Enhanced PageView server tracking failed:', err);
                    });
                  }
                  
                  // Track enhanced PageView
                  trackEnhancedPageView();
                  
                  // Make enhanced tracking functions globally available
                  window.trackEnhancedMetaEvent = function(eventName, parameters = {}, userData = {}) {
                    // Get Event Quality parameters
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
                                      sessionStorage.getItem('user_id') || 
                                      sessionStorage.getItem('temp_user_id');
                    
                    /* const getMetaParameters = () => {
    return {
      // implementation details
    };
  }; */                // Combine all parameters
                    const eventData = {
                      ...parameters,
                      ...(fbc && { fbc: fbc }),
                      ...(fbp && { fbp: fbp }),
                      ...(externalId && { external_id: externalId }),
                      ...(userData.email && { email: userData.email }),
                      ...(userData.phone && { phone_number: userData.phone }),
                      ...(userData.firstName && { first_name: userData.firstName }),
                      ...(userData.lastName && { last_name: userData.lastName }),
                      ...(userData.city && { city: userData.city }),
                      ...(userData.state && { state: userData.state }),
                      ...(userData.country && { country: userData.country }),
                      ...(userData.zipCode && { zip_code: userData.zipCode })
                    };
                    
                    // Generate unique event ID
                    const eventId = eventName + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    
                    console.log('Tracking enhanced Meta event:', eventName, eventData);
                    
                    // Track with Meta Pixel
                    fbq('track', eventName, eventData, { eventID: eventId });
                    
                    // Send to server-side API
                    fetch('/api/meta-conversion', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        eventType: eventName.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase(),
                        data: {
                          ...eventData,
                          eventId: eventId
                        },
                        source: 'client_side_enhanced'
                      })
                    }).catch(err => {
                      console.log('Enhanced server tracking failed:', err);
                    });
                  };
                  
                  // Make specific tracking functions available
                  window.trackEnhancedLead = function(userData, source = 'website') {
                    window.trackEnhancedMetaEvent('Lead', {
                      content_name: 'Study Abroad Lead',
                      content_category: 'Education Lead Generation',
                      source: source,
                      value: 0,
                      currency: 'BDT'
                    }, userData);
                  };
                  
                  window.trackEnhancedContact = function(contactMethod, userData) {
                    window.trackEnhancedMetaEvent('Contact', {
                      content_name: contactMethod + ' Contact',
                      content_category: 'Contact',
                      contact_method: contactMethod,
                      value: 0,
                      currency: 'BDT'
                    }, userData);
                  };
                  
                  window.trackEnhancedWhatsApp = function(source = 'website', userData) {
                    window.trackEnhancedMetaEvent('Contact', {
                      content_name: 'WhatsApp Contact',
                      content_category: 'Communication',
                      contact_method: 'whatsapp',
                      source: source,
                      value: 0,
                      currency: 'BDT'
                    }, userData);
                  };
                  
                  window.trackEnhancedPhone = function(source = 'website', userData) {
                    window.trackEnhancedMetaEvent('Contact', {
                      content_name: 'Phone Call',
                      content_category: 'Communication',
                      contact_method: 'phone',
                      source: source,
                      value: 0,
                      currency: 'BDT'
                    }, userData);
                  };
                  
                  console.log('Enhanced Meta Pixel tracking functions loaded');
                } else {
                  console.log('Enhanced Meta Pixel skipped on non-HTTPS (localhost)');
                  // Dummy functions to prevent errors
                  window.trackEnhancedMetaEvent = function() {};
                  window.trackEnhancedLead = function() {};
                  window.trackEnhancedContact = function() {};
                  window.trackEnhancedWhatsApp = function() {};
                  window.trackEnhancedPhone = function() {};
                }
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Analytics 4 */}
      {GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-config"
            strategy="afterInteractive"
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

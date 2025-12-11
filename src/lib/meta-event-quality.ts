// Meta Event Quality Enhancement Utilities
// This file contains utilities to implement Meta's Event Quality recommendations

// Types for Meta Event Quality parameters
export interface MetaEventQualityParams {
  fbc?: string; // Facebook Click ID
  fbp?: string; // Facebook Browser ID
  external_id?: string; // External user ID
  fb_login_id?: string; // Facebook Login ID
}

interface FacebookLoginStatusResponse {
  status: string;
  authResponse: {
    userID: string;
    accessToken: string;
    expiresIn: number;
    signedRequest: string;
  };
}

export interface EnhancedUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  userId?: string; // For external_id
  program?: string; // Program of interest
}

// Utility functions for client-side parameter extraction
export const getMetaParameters = (): MetaEventQualityParams => {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    fbc: getUrlParameter('fbclid'),
    fbp: getCookie('_fbp'),
    external_id: getExternalId(),
    fb_login_id: getFacebookLoginId()
  };
};

// Get Facebook Click ID from URL parameter
export const getUrlParameter = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || undefined;
};

// Get Facebook Browser ID from cookie
export const getCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || undefined;
  }
  return undefined;
};

// Get external ID (your internal user ID)
export const getExternalId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  // Try to get from localStorage first
  const storedUserId = localStorage.getItem('user_id');
  if (storedUserId) return storedUserId;

  // Try to get from sessionStorage
  const sessionUserId = sessionStorage.getItem('user_id');
  if (sessionUserId) return sessionUserId;

  // Generate a temporary ID for anonymous users
  const tempId = sessionStorage.getItem('temp_user_id');
  if (tempId) return tempId;

  // Create and store a new temporary ID
  const newTempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('temp_user_id', newTempId);
  return newTempId;
};

// Get Facebook Login ID (requires Facebook Login SDK)
export const getFacebookLoginId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  // Check if Facebook SDK is loaded and user is logged in
  if (window.FB?.getLoginStatus) {
    // This would need to be called asynchronously
    // For now, we'll return undefined and handle it in the tracking functions
    return undefined;
  }

  return undefined;
};

// Enhanced event tracking function with Event Quality parameters
export const trackMetaEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {},
  userData: EnhancedUserData = {}
): void => {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Meta Pixel not loaded');
    return;
  }

  const metaParams = getMetaParameters();

  // Combine all parameters
  const eventData = {
    ...parameters,
    ...metaParams,
    // Add user data if available
    ...(userData.email && { email: userData.email }),
    ...(userData.phone && { phone_number: userData.phone }),
    ...(userData.firstName && { first_name: userData.firstName }),
    ...(userData.lastName && { last_name: userData.lastName }),
    ...(userData.city && { city: userData.city }),
    ...(userData.state && { state: userData.state }),
    ...(userData.country && { country: userData.country }),
    ...(userData.zipCode && { zip_code: userData.zipCode }),
  };

  // Generate unique event ID for deduplication
  const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`Tracking Meta event: ${eventName}`, eventData);

  // Track with Meta Pixel
  window.fbq('track', eventName, eventData, { eventID: eventId });

  // Also send to server-side Conversions API for better tracking
  sendToServerSideAPI(eventName, eventData, eventId);
};

// Send event to server-side API for Conversions API
export const sendToServerSideAPI = async (
  eventName: string,
  eventData: Record<string, unknown>,
  eventId: string
): Promise<void> => {
  try {
    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: mapEventNameToType(eventName),
        data: {
          ...eventData,
          eventId: eventId
        },
        source: 'client_side_enhanced'
      })
    });

    if (!response.ok) {
      console.warn('Server-side tracking failed:', response.status);
    }
  } catch (error) {
    console.warn('Server-side tracking error:', error);
  }
};

// Map Meta event names to our API event types
const mapEventNameToType = (eventName: string): string => {
  const mapping: Record<string, string> = {
    'Lead': 'study_abroad_lead',
    'PageView': 'page_view',
    'ViewContent': 'view_content',
    'Contact': 'contact',
    'CompleteRegistration': 'complete_registration',
    'AddToCart': 'add_to_cart',
    'InitiateCheckout': 'initiate_checkout',
    'Purchase': 'purchase',
    'Search': 'search',
    'Schedule': 'schedule',
    'Subscribe': 'subscribe',
    'SubmitApplication': 'submit_application'
  };

  return mapping[eventName] || 'study_abroad_lead';
};

// Specific tracking functions for common events
export const trackLead = (userData: EnhancedUserData, source: string = 'website'): void => {
  trackMetaEvent('Lead', {
    content_name: 'Study Abroad Lead',
    content_category: 'Education Lead Generation',
    source: source,
    value: 0,
    currency: 'BDT'
  }, userData);
};

export const trackPageView = (pageName: string, pageCategory: string = 'general'): void => {
  trackMetaEvent('PageView', {
    content_name: pageName,
    content_category: pageCategory,
    page_title: pageName
  });
};

export const trackViewContent = (contentName: string, contentCategory: string, userData?: EnhancedUserData): void => {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackContact = (contactMethod: string, userData?: EnhancedUserData): void => {
  trackMetaEvent('Contact', {
    content_name: `${contactMethod} Contact`,
    content_category: 'Contact',
    contact_method: contactMethod,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackWhatsAppClick = (source: string = 'website', userData?: EnhancedUserData): void => {
  trackMetaEvent('Contact', {
    content_name: 'WhatsApp Contact',
    content_category: 'Communication',
    contact_method: 'whatsapp',
    source: source,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackPhoneClick = (source: string = 'website', userData?: EnhancedUserData): void => {
  trackMetaEvent('Contact', {
    content_name: 'Phone Call',
    content_category: 'Communication',
    contact_method: 'phone',
    source: source,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackDestinationView = (countryName: string, userData?: EnhancedUserData): void => {
  trackMetaEvent('ViewContent', {
    content_name: `Study in ${countryName}`,
    content_category: 'Destination Interest',
    destination_country: countryName,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackScholarshipInquiry = (userData: EnhancedUserData): void => {
  trackMetaEvent('Lead', {
    content_name: 'Scholarship Inquiry',
    content_category: 'Scholarship Interest',
    study_destination: userData.country || 'not_specified',
    value: 0,
    currency: 'BDT'
  }, userData);
};

export const trackConsultationRequest = (source: string = 'website', userData?: EnhancedUserData): void => {
  trackMetaEvent('Lead', {
    content_name: 'Free Consultation Request',
    content_category: 'Lead Generation',
    source: source,
    value: 0,
    currency: 'BDT'
  }, userData || {});
};

export const trackApplicationSubmission = (userData: EnhancedUserData, university?: string, program?: string): void => {
  trackMetaEvent('SubmitApplication', {
    content_name: 'University Application Submitted',
    content_category: 'Application Process',
    university_name: university || 'not_specified',
    study_destination: userData.country || 'not_specified',
    program_interest: program || 'not_specified',
    value: 0,
    currency: 'BDT'
  }, userData);
};

export const trackAdmissionReceived = (userData: EnhancedUserData, university?: string, program?: string): void => {
  trackMetaEvent('Purchase', {
    content_name: 'University Admission Received',
    content_category: 'Admission Success',
    university_name: university || 'not_specified',
    study_destination: userData.country || 'not_specified',
    program_interest: program || 'not_specified',
    value: 1000,
    currency: 'BDT'
  }, userData);
};

export const trackVisaApproval = (userData: EnhancedUserData, university?: string, program?: string): void => {
  trackMetaEvent('Purchase', {
    content_name: 'Student Visa Approved',
    content_category: 'Visa Success',
    university_name: university || 'not_specified',
    study_destination: userData.country || 'not_specified',
    program_interest: program || 'not_specified',
    value: 2000,
    currency: 'BDT'
  }, userData);
};

export const trackEnrollmentCompletion = (userData: EnhancedUserData, university?: string, program?: string): void => {
  trackMetaEvent('Purchase', {
    content_name: 'Student Enrollment Complete',
    content_category: 'Enrollment Success',
    university_name: university || 'not_specified',
    study_destination: userData.country || 'not_specified',
    program_interest: program || 'not_specified',
    value: 5000,
    currency: 'BDT'
  }, userData);
};

// Facebook Login integration
export const initializeFacebookLogin = (): void => {
  if (typeof window === 'undefined') return;

  // Facebook Login requires HTTPS
  if (window.location.protocol !== 'https:') {
    console.log('Facebook Login SDK skipped on non-HTTPS (localhost)');
    return;
  }

  // Load Facebook SDK if not already loaded
  if (!window.FB) {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = () => {
      window.FB?.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };
  }
};

// Get Facebook Login status and ID
export const getFacebookLoginStatus = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.FB || window.location.protocol !== 'https:') {
      resolve(undefined);
      return;
    }

    window.FB?.getLoginStatus((response: unknown) => {
      const fbResponse = response as FacebookLoginStatusResponse;
      if (fbResponse.status === 'connected') {
        resolve(fbResponse.authResponse.userID);
      } else {
        resolve(undefined);
      }
    });
  });
};

// Enhanced tracking with Facebook Login ID
export const trackMetaEventWithFacebookLogin = async (
  eventName: string,
  parameters: Record<string, unknown> = {},
  userData: EnhancedUserData = {}
): Promise<void> => {
  const fbLoginId = await getFacebookLoginStatus();

  const enhancedUserData = {
    ...userData,
    fb_login_id: fbLoginId
  };

  trackMetaEvent(eventName, parameters, enhancedUserData);
};

// Utility to set user ID for external_id tracking
export const setUserId = (userId: string, persistent: boolean = true): void => {
  if (typeof window === 'undefined') return;

  if (persistent) {
    localStorage.setItem('user_id', userId);
  } else {
    sessionStorage.setItem('user_id', userId);
  }
};

// Utility to clear user ID
export const clearUserId = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('user_id');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('temp_user_id');
};

// Debug function to check current Meta parameters
export const debugMetaParameters = (): void => {
  if (typeof window === 'undefined') return;

  const params = getMetaParameters();
  console.log('Meta Event Quality Parameters:', params);
  console.log('Current URL:', window.location.href);
  console.log('All cookies:', document.cookie);
};

// Global type declarations are handled in src/types/global.d.ts

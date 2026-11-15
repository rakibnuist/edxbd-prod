// Analytics and tracking utilities for EduExpress International
import { getMetaParameters } from './meta-event-quality';
import { isAnalyticsConsentAccepted } from './tracking-consent';

// Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890';



// Generate unique event ID for deduplication
const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Define UserData interface
export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fbp?: string;
  fbc?: string;
  external_id?: string;
  fb_login_id?: string;
}

// Meta Pixel standard events mapping per Meta specifications
// (https://eventsmanager.facebook.com/business/help/402791146561655?id=1205376682832142)
const META_STANDARD_EVENTS: Record<string, string> = {
  // Direct Standard Event Names
  Lead: 'Lead',
  Contact: 'Contact',
  PageView: 'PageView',
  ViewContent: 'ViewContent',
  Subscribe: 'Subscribe',
  CompleteRegistration: 'CompleteRegistration',
  InitiateCheckout: 'InitiateCheckout',
  Schedule: 'Schedule',
  SubmitApplication: 'SubmitApplication',
  Search: 'Search',
  CustomizeProduct: 'CustomizeProduct',
  Donate: 'Donate',
  FindLocation: 'FindLocation',
  StartTrial: 'StartTrial',

  // Custom or lowercase mappings
  lead: 'Lead',
  study_abroad_lead: 'Lead',
  assessment_submit: 'Lead',
  consultation_request: 'Lead',
  scholarship_inquiry: 'Lead',
  partnership_inquiry: 'Lead',

  contact: 'Contact',
  whatsapp_click: 'Contact',
  phone_click: 'Contact',
  email_click: 'Contact',

  page_view: 'PageView',

  view_content: 'ViewContent',
  country_view: 'ViewContent',
  university_view: 'ViewContent',
  destination_view: 'ViewContent',
  program_view: 'ViewContent',
  document_download: 'ViewContent',

  subscribe: 'Subscribe',
  email_subscription: 'Subscribe',

  complete_registration: 'CompleteRegistration',

  assessment_start: 'InitiateCheckout',
  initiate_checkout: 'InitiateCheckout',
  form_start: 'InitiateCheckout',

  schedule: 'Schedule',
  appointment_booked: 'Schedule',

  application_start: 'SubmitApplication',
  application_started: 'SubmitApplication',
  submit_application: 'SubmitApplication',

  search: 'Search',
};

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>, _userData?: UserData) => {
  const eventId = (parameters?.event_id as string) || generateEventId();
  if (!isAnalyticsConsentAccepted()) return eventId;

  // GTM / GA4 tracking (supports runtime tag IDs configured via /admin/settings
  // and loaded by GoogleTags, not just build-time NEXT_PUBLIC_GTM_ID).
  if (typeof window !== 'undefined') {
    const gaPayload = {
      event_category: 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      event_id: eventId,
      ...parameters,
    };

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...gaPayload });
    } catch {
      // Silent error handling
    }

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, gaPayload);
      } catch {
        // Silent error handling
      }
    }
  }

  // Meta Pixel tracking per Meta specifications
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps && typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      const standardEvent = META_STANDARD_EVENTS[eventName];
      const metaPayload = {
        content_name: parameters?.content_name || eventName,
        content_category: parameters?.content_category || 'Education',
        value: parameters?.value ?? 0,
        currency: (parameters?.currency as string) || 'BDT',
        ...parameters,
      };
      if (standardEvent) {
        window.fbq('track', standardEvent, metaPayload, { eventID: eventId });
      } else {
        window.fbq('trackCustom', eventName, metaPayload, { eventID: eventId });
      }
    } catch {
      // Silent error handling
    }
  }

  return eventId;
};

// Education-specific tracking functions
export const trackConsultationRequest = (source: string = 'website') => {
  trackEvent('Lead', {
    event_category: 'consultation',
    event_label: 'consultation_request',
    source: source,
    content_name: 'Free Consultation',
    content_category: 'Lead Generation'
  });
};

export const trackFormSubmission = (formType: string, formData?: Record<string, unknown>) => {
  trackEvent('CompleteRegistration', {
    event_category: 'form',
    event_label: `${formType}_submission`,
    content_name: `${formType} Form`,
    content_category: 'Form Submission',
    ...formData
  });
};


export const trackEmailClick = (email: string) => {
  trackEvent('Contact', {
    event_category: 'contact',
    event_label: 'email_click',
    content_name: 'Email Contact',
    email: email
  });
};



export const trackPageView = async (pageName: string, pageCategory?: string) => {
  const eventId = trackEvent('PageView', {
    page_title: pageName,
    page_category: pageCategory || 'general',
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });

  // Send to CAPI only after consent
  if (typeof window !== 'undefined' && isAnalyticsConsentAccepted()) {
    const metaParams = getMetaParameters();
    const userData: UserData = {
      fbp: metaParams.fbp,
      fbc: metaParams.fbc,
      external_id: metaParams.external_id,
      fb_login_id: metaParams.fb_login_id
    };

    // Fire and forget CAPI
    // Fix: Send 'page_view' as expected by route.ts and include pageName
    sendConversionAPIEvent('page_view', userData, {
      pageName: pageName, // Required by route.ts
      page_title: pageName,
      page_category: pageCategory || 'general',
      page_location: window.location.href
    }, eventId).catch(err => {
      if (process.env.NODE_ENV === 'development') {
        console.error('CAPI PageView failed:', err);
      }
    });
  }
};

export const trackCountryInterest = (country: string) => {
  trackEvent('ViewContent', {
    event_category: 'interest',
    event_label: 'country_view',
    content_name: `Study in ${country}`,
    content_category: 'Country Interest',
    custom_parameter_1: country
  });
};

// Meta Conversion API Functions (Client-side wrapper)
export const sendConversionAPIEvent = async (
  eventName: string,
  userData: UserData,
  customData?: Record<string, unknown>,
  eventId?: string
) => {
  if (!isAnalyticsConsentAccepted()) return null;
  try {
    const response = await fetch('/api/meta-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Fix: Send event type exactly as passed, avoiding broken transformation
        eventType: eventName,
        data: {
          userData,
          ...customData
        },
        source: 'client_side',
        eventId,
        trackingConsent: true,
      }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Meta Conversion API warning: ${response.status}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Meta Conversion API error:', error);
    throw error;
  }
};



// Enhanced lead tracking with Conversion API
export const trackStudyAbroadLead = async (
  formData: {
    name: string;
    email: string;
    phone: string;
    country: string;
    program?: string;
    message?: string;
  },
  source: string = 'website_contact_form'
) => {
  if (typeof window === 'undefined' || !isAnalyticsConsentAccepted()) return;

  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = formData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';

  // Get Meta Event Quality Parameters (fbp, fbc, etc.)
  const metaParams = getMetaParameters();

  const userData: UserData = {
    email: formData.email,
    phone: formData.phone,
    firstName: firstName,
    lastName: lastName,
    country: formData.country,
    // Add Enhanced Match Quality Parameters
    fbp: metaParams.fbp,
    fbc: metaParams.fbc,
    external_id: metaParams.external_id,
    fb_login_id: metaParams.fb_login_id
  };

  const customData = {
    content_name: 'Study Abroad Consultation Form',
    content_category: 'Education Lead Generation',
    source: source,
    study_destination: formData.country,
    program_interest: formData.program || 'not_specified',
    has_message: !!formData.message
  };

  // Track with GTM
  trackEvent('study_abroad_lead', {
    event_category: 'conversion',
    event_label: 'lead_generated',
    event_id: eventId,
    ...customData
  });

  // Track with Meta Pixel
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps && typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', 'Lead', {
        event_id: eventId,
        ...customData
      }, {
        eventID: eventId // Pass eventID to Pixel for deduplication
      });
    } catch {
      // Silent error handling
    }
  }

  // Track with Conversion API
  // Fix: Send 'study_abroad_lead' and include all formData fields
  await sendConversionAPIEvent('study_abroad_lead', userData, {
    ...formData, // Pass original formData for server processing (name, etc.)
    ...customData
  }, eventId);
};

// Additional analytics functions for admin dashboard
export const trackDashboardView = (dashboardType: string) => {
  trackEvent('dashboard_view', {
    event_category: 'admin',
    event_label: 'dashboard_view',
    dashboard_type: dashboardType
  });
};

// Enhanced tracking functions for education consultancy
export const trackWhatsAppClick = (source: string = 'website', userData?: UserData) => {
  trackEvent('Contact', {
    event_category: 'communication',
    event_label: 'whatsapp_click',
    contact_method: 'whatsapp',
    content_name: 'WhatsApp Contact',
    content_category: 'Admissions Inquiry',
    value: 0,
    currency: 'BDT',
    source: source
  }, userData);
};

export const trackPhoneClick = (source: string = 'website', userData?: UserData) => {
  trackEvent('Contact', {
    event_category: 'communication',
    event_label: 'phone_click',
    contact_method: 'phone',
    content_name: 'Phone Call',
    content_category: 'Admissions Hotline',
    value: 0,
    currency: 'BDT',
    source: source
  }, userData);
};

export const trackDestinationView = (countryName: string, userData?: UserData) => {
  trackEvent('ViewContent', {
    event_category: 'destination_interest',
    event_label: `study_in_${countryName.toLowerCase().replace(/\s+/g, '_')}`,
    destination_country: countryName,
    content_name: `Study in ${countryName}`,
    content_category: 'Destination Guide',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackScholarshipInquiry = (country?: string, program?: string, userData?: UserData) => {
  trackEvent('Lead', {
    event_category: 'scholarship_interest',
    event_label: 'scholarship_inquiry',
    study_destination: country || 'not_specified',
    program_interest: program || 'not_specified',
    content_name: 'Scholarship Inquiry',
    content_category: 'Lead Generation',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackUniversityInterest = (universityName: string, country: string, userData?: UserData) => {
  trackEvent('ViewContent', {
    event_category: 'university_research',
    event_label: `university_${universityName.toLowerCase().replace(/\s+/g, '_')}`,
    university_name: universityName,
    destination_country: country,
    content_name: `University Interest: ${universityName}`,
    content_category: 'University Profile',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackProgramInterest = (programName: string, country: string, userData?: UserData) => {
  trackEvent('ViewContent', {
    event_category: 'program_research',
    event_label: `program_${programName.toLowerCase().replace(/\s+/g, '_')}`,
    program_name: programName,
    destination_country: country,
    content_name: `Program Interest: ${programName}`,
    content_category: 'Degree Program',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackDocumentDownload = (documentName: string, documentType: string, userData?: UserData) => {
  trackEvent('ViewContent', {
    event_category: 'document_download',
    event_label: `download_${documentName.toLowerCase().replace(/\s+/g, '_')}`,
    document_type: documentType,
    content_name: `Download: ${documentName}`,
    content_category: 'Resource Download',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackEmailSubscription = (email: string, userData?: UserData) => {
  const finalUserData = { ...userData, email };
  trackEvent('Subscribe', {
    event_category: 'newsletter_signup',
    event_label: 'email_subscription',
    content_name: 'Email Subscription',
    content_category: 'Newsletter',
    value: 0,
    currency: 'BDT',
    email: email
  }, finalUserData);
};

export const trackPartnershipInquiry = (companyName?: string, userData?: UserData) => {
  trackEvent('Lead', {
    event_category: 'business_partnership',
    event_label: 'partnership_inquiry',
    company_name: companyName || 'not_specified',
    content_name: 'Partnership Inquiry',
    content_category: 'B2B Lead Generation',
    value: 0,
    currency: 'BDT',
  }, userData);
};

export const trackDashboardAction = (action: string, parameters?: Record<string, unknown>) => {
  trackEvent('dashboard_action', {
    event_category: 'admin',
    event_label: 'dashboard_action',
    action: action,
    ...parameters
  });
};

export const trackDatabaseOperation = (operation: string, success: boolean, parameters?: Record<string, unknown>) => {
  trackEvent('database_operation', {
    event_category: 'admin',
    event_label: 'database_operation',
    operation: operation,
    success: success,
    ...parameters
  });
};

export const trackAdminEngagement = (engagementType: string, parameters?: Record<string, unknown>) => {
  trackEvent('admin_engagement', {
    event_category: 'admin',
    event_label: 'admin_engagement',
    engagement_type: engagementType,
    ...parameters
  });
};

// Form tracking functions
export const trackFormStart = (formType: string) => {
  trackEvent('InitiateCheckout', {
    event_category: 'form',
    event_label: 'form_start',
    form_type: formType,
    content_name: `${formType} Assessment Started`,
    content_category: 'Assessment Funnel',
    value: 0,
    currency: 'BDT',
  });
};

export const trackAssessmentSubmit = (parameters?: Record<string, unknown>) => {
  trackEvent('Lead', {
    event_category: 'conversion',
    event_label: 'education_fit_assessment',
    content_name: 'Education Fit Assessment Submission',
    content_category: 'Lead Generation',
    value: 0,
    currency: 'BDT',
    ...parameters,
  });
};

export const trackFormFieldFocus = (fieldName: string, formType: string) => {
  trackEvent('form_field_focus', {
    event_category: 'form',
    event_label: 'form_field_focus',
    field_name: fieldName,
    form_type: formType
  });
};

export const trackFormFieldComplete = (fieldName: string, formType: string) => {
  trackEvent('form_field_complete', {
    event_category: 'form',
    event_label: 'form_field_complete',
    field_name: fieldName,
    form_type: formType
  });
};

export const trackFormAbandonment = (formType: string, fieldsCompleted: number) => {
  trackEvent('form_abandonment', {
    event_category: 'form',
    event_label: 'form_abandonment',
    form_type: formType,
    fields_completed: fieldsCompleted
  });
};

export const trackStudyAbroadFormSubmission = (formData: Record<string, unknown>) => {
  trackEvent('study_abroad_form_submission', {
    event_category: 'conversion',
    event_label: 'study_abroad_form_submission',
    ...formData
  });
};

export const trackFormValidationError = (fieldName: string, errorType: string, formType: string) => {
  trackEvent('form_validation_error', {
    event_category: 'form',
    event_label: 'form_validation_error',
    field_name: fieldName,
    error_type: errorType,
    form_type: formType
  });
};

// Content management tracking function
export const trackContentManagement = (action: string, parameters?: Record<string, unknown>) => {
  trackEvent('content_management', {
    event_category: 'admin',
    event_label: 'content_management',
    action: action,
    ...parameters
  });
};

// Application start tracking function
export const trackApplicationStart = (source: string = 'homepage') => {
  trackEvent('SubmitApplication', {
    event_category: 'conversion',
    event_label: 'application_start',
    source: source,
    content_name: 'Study Abroad Application',
    content_category: 'Application Start',
    value: 0,
    currency: 'BDT',
  });
};

// Lead management tracking function
export const trackLeadManagement = (action: string, parameters?: Record<string, unknown>) => {
  trackEvent('lead_management', {
    event_category: 'admin',
    event_label: 'lead_management',
    action: action,
    ...parameters
  });
};

// Testimonial management tracking function
export const trackTestimonialManagement = (action: string, parameters?: Record<string, unknown>) => {
  trackEvent('testimonial_management', {
    event_category: 'admin',
    event_label: 'testimonial_management',
    action: action,
    ...parameters
  });
};

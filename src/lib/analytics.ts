// Analytics and tracking utilities for EduExpress International

// Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890';
export const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';

// Initialize GTM
export const initGTM = () => {
  if (typeof window !== 'undefined' && GTM_ID !== 'GTM-XXXXXXX') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GTM_ID);
  }
};

// Initialize GA4
export const initGA4 = () => {
  if (typeof window !== 'undefined' && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID);
  }
};

// Initialize Meta Pixel
export const initMetaPixel = () => {
  if (typeof window !== 'undefined' && META_PIXEL_ID && META_PIXEL_ID !== '1234567890') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    
    w.fbq = w.fbq || function(...args: unknown[]) {
      if (w.fbq.callMethod) {
        w.fbq.callMethod(...args);
      } else {
        w.fbq.queue = w.fbq.queue || [];
        w.fbq.queue.push(args);
      }
    };
    
    w.fbq.queue = w.fbq.queue || [];
    
    if (!w.fbq.loaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      w.fbq.loaded = true;
    }
    
    w.fbq('init', META_PIXEL_ID);
    w.fbq('track', 'PageView');
  }
};

// Generate unique event ID for deduplication
const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  const eventId = generateEventId();
  const eventData = {
    event_id: eventId,
    ...parameters
  };

  // GTM tracking
  if (typeof window !== 'undefined' && window.gtag && GTM_ID !== 'GTM-XXXXXXX') {
    try {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters?.label || '',
        value: parameters?.value || 0,
        event_id: eventId,
        ...parameters
      });
    } catch (error) {
      // Silent error handling
    }
  }

  // Meta Pixel tracking
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID && META_PIXEL_ID !== '1234567890') {
    try {
      window.fbq('track', eventName, eventData);
    } catch (error) {
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


export const trackPageView = (pageName: string, pageCategory?: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_category: pageCategory || 'general',
    page_location: typeof window !== 'undefined' ? window.location.href : ''
  });
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
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  customData?: Record<string, unknown>,
  eventId?: string
) => {
  try {
    const response = await fetch('/api/meta-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: eventName.toLowerCase().replace(/([A-Z])/g, '_$1'),
        data: {
          userData,
          ...customData
        },
        source: 'client_side'
      }),
    });

    if (!response.ok) {
      throw new Error(`Meta Conversion API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Meta Conversion API error:', error);
    throw error;
  }
};

// Hash data for Meta Conversion API
const hashData = async (data: string): Promise<string> => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback for environments without Web Crypto API
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
};

// Get client IP address
const getClientIP = async (): Promise<string> => {
  // Skip IP detection during build to prevent DNS issues
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
    return '0.0.0.0';
  }
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get client IP, using fallback:', error instanceof Error ? error.message : 'Unknown error');
    return '0.0.0.0';
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
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = formData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: formData.email,
    phone: formData.phone,
    firstName: firstName,
    lastName: lastName,
    country: formData.country
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
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID && META_PIXEL_ID !== '1234567890') {
    try {
      window.fbq('track', 'Lead', {
        event_id: eventId,
        ...customData
      });
    } catch (error) {
      // Silent error handling
    }
  }

  // Track with Conversion API
  await sendConversionAPIEvent('Lead', userData, customData, eventId);
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
export const trackWhatsAppClick = (source: string = 'website') => {
  trackEvent('contact', {
    event_category: 'communication',
    event_label: 'whatsapp_click',
    contact_method: 'whatsapp',
    source: source
  });
};

export const trackPhoneClick = (source: string = 'website') => {
  trackEvent('contact', {
    event_category: 'communication',
    event_label: 'phone_click',
    contact_method: 'phone',
    source: source
  });
};

export const trackDestinationView = (countryName: string) => {
  trackEvent('view_content', {
    event_category: 'destination_interest',
    event_label: `study_in_${countryName.toLowerCase().replace(/\s+/g, '_')}`,
    destination_country: countryName,
    content_name: `Study in ${countryName}`
  });
};

export const trackScholarshipInquiry = (country?: string, program?: string) => {
  trackEvent('lead', {
    event_category: 'scholarship_interest',
    event_label: 'scholarship_inquiry',
    study_destination: country || 'not_specified',
    program_interest: program || 'not_specified'
  });
};

export const trackUniversityInterest = (universityName: string, country: string) => {
  trackEvent('view_content', {
    event_category: 'university_research',
    event_label: `university_${universityName.toLowerCase().replace(/\s+/g, '_')}`,
    university_name: universityName,
    destination_country: country,
    content_name: `University Interest: ${universityName}`
  });
};

export const trackProgramInterest = (programName: string, country: string) => {
  trackEvent('view_content', {
    event_category: 'program_research',
    event_label: `program_${programName.toLowerCase().replace(/\s+/g, '_')}`,
    program_name: programName,
    destination_country: country,
    content_name: `Program Interest: ${programName}`
  });
};

export const trackDocumentDownload = (documentName: string, documentType: string) => {
  trackEvent('view_content', {
    event_category: 'document_download',
    event_label: `download_${documentName.toLowerCase().replace(/\s+/g, '_')}`,
    document_type: documentType,
    content_name: `Download: ${documentName}`
  });
};

export const trackEmailSubscription = (email: string) => {
  trackEvent('subscribe', {
    event_category: 'newsletter_signup',
    event_label: 'email_subscription',
    content_name: 'Email Subscription'
  });
};

export const trackPartnershipInquiry = (companyName?: string) => {
  trackEvent('lead', {
    event_category: 'business_partnership',
    event_label: 'partnership_inquiry',
    company_name: companyName || 'not_specified',
    content_name: 'Partnership Inquiry'
  });
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
  trackEvent('form_start', {
    event_category: 'form',
    event_label: 'form_start',
    form_type: formType
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
  trackEvent('application_start', {
    event_category: 'conversion',
    event_label: 'application_start',
    source: source,
    content_name: 'Study Abroad Application',
    content_category: 'Application Start'
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
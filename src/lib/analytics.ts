// Analytics and tracking utilities for EduExpress International

// Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1234567890';
export const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';



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
}

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>, _userData?: UserData) => {
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
    } catch {
      // Silent error handling
    }
  }

  // Meta Pixel tracking
  // FB.getLoginStatus and other methods require HTTPS
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps && typeof window !== 'undefined' && window.fbq && META_PIXEL_ID && META_PIXEL_ID !== '1234567890') {
    try {
      window.fbq('track', eventName, eventData);
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
        source: 'client_side',
        eventId
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
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps && typeof window !== 'undefined' && window.fbq && META_PIXEL_ID && META_PIXEL_ID !== '1234567890') {
    try {
      window.fbq('track', 'Lead', {
        event_id: eventId,
        ...customData
      });
    } catch {
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
export const trackWhatsAppClick = (source: string = 'website', userData?: UserData) => {
  trackEvent('contact', {
    event_category: 'communication',
    event_label: 'whatsapp_click',
    contact_method: 'whatsapp',
    source: source
  }, userData);
};

export const trackPhoneClick = (source: string = 'website', userData?: UserData) => {
  trackEvent('contact', {
    event_category: 'communication',
    event_label: 'phone_click',
    contact_method: 'phone',
    source: source
  }, userData);
};

export const trackDestinationView = (countryName: string, userData?: UserData) => {
  trackEvent('view_content', {
    event_category: 'destination_interest',
    event_label: `study_in_${countryName.toLowerCase().replace(/\s+/g, '_')}`,
    destination_country: countryName,
    content_name: `Study in ${countryName}`
  }, userData);
};

export const trackScholarshipInquiry = (country?: string, program?: string, userData?: UserData) => {
  trackEvent('lead', {
    event_category: 'scholarship_interest',
    event_label: 'scholarship_inquiry',
    study_destination: country || 'not_specified',
    program_interest: program || 'not_specified'
  }, userData);
};

export const trackUniversityInterest = (universityName: string, country: string, userData?: UserData) => {
  trackEvent('view_content', {
    event_category: 'university_research',
    event_label: `university_${universityName.toLowerCase().replace(/\s+/g, '_')}`,
    university_name: universityName,
    destination_country: country,
    content_name: `University Interest: ${universityName}`
  }, userData);
};

export const trackProgramInterest = (programName: string, country: string, userData?: UserData) => {
  trackEvent('view_content', {
    event_category: 'program_research',
    event_label: `program_${programName.toLowerCase().replace(/\s+/g, '_')}`,
    program_name: programName,
    destination_country: country,
    content_name: `Program Interest: ${programName}`
  }, userData);
};

export const trackDocumentDownload = (documentName: string, documentType: string, userData?: UserData) => {
  trackEvent('view_content', {
    event_category: 'document_download',
    event_label: `download_${documentName.toLowerCase().replace(/\s+/g, '_')}`,
    document_type: documentType,
    content_name: `Download: ${documentName}`
  }, userData);
};

export const trackEmailSubscription = (email: string, userData?: UserData) => {
  const finalUserData = { ...userData, email };
  trackEvent('subscribe', {
    event_category: 'newsletter_signup',
    event_label: 'email_subscription',
    content_name: 'Email Subscription',
    email: email
  }, finalUserData);
};

export const trackPartnershipInquiry = (companyName?: string, userData?: UserData) => {
  trackEvent('lead', {
    event_category: 'business_partnership',
    event_label: 'partnership_inquiry',
    company_name: companyName || 'not_specified',
    content_name: 'Partnership Inquiry'
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
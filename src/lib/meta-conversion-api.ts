// Meta Conversion API implementation for EduExpress International
import crypto from 'crypto';

// Configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const META_API_VERSION = 'v18.0';

// Hash data for Meta Conversion API (server-side)
export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

// Get client IP from request headers
export const getClientIP = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return '0.0.0.0';
};

// Extract Event Quality parameters from request
export const extractEventQualityParams = (request: Request): {
  fbc?: string;
  fbp?: string;
  external_id?: string;
  fb_login_id?: string;
} => {
  const url = new URL(request.url);
  const fbc = url.searchParams.get('fbclid') || undefined;
  
  // Note: fbp, external_id, and fb_login_id should be passed from client-side
  // as they're not available in server-side requests
  return {
    fbc,
    // These will be passed from the client-side tracking
    fbp: undefined,
    external_id: undefined,
    fb_login_id: undefined
  };
};

// Generate unique event ID for deduplication
export const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate PageView event ID that can be shared between client and server
export const generatePageViewEventId = (): string => {
  return `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Send event to Meta Conversion API with Event Quality parameters
export const sendConversionAPIEvent = async (
  eventName: string,
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    // Event Quality parameters
    fbc?: string;
    fbp?: string;
    external_id?: string;
    fb_login_id?: string;
  },
  customData?: Record<string, unknown>,
  eventId?: string,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
    return {
      success: false,
      eventId: eventId || generateEventId(),
      error: 'Missing Meta access token or pixel ID'
    };
  }

  try {
    const finalEventId = eventId || generateEventId();
    
    // Prepare user data with hashed values
    const hashedUserData: Record<string, string[] | string> = {};
    
    if (userData.email) {
      hashedUserData.em = [hashData(userData.email)];
    }
    if (userData.phone) {
      hashedUserData.ph = [hashData(userData.phone)];
    }
    if (userData.firstName) {
      hashedUserData.fn = [hashData(userData.firstName)];
    }
    if (userData.lastName) {
      hashedUserData.ln = [hashData(userData.lastName)];
    }
    if (userData.city) {
      hashedUserData.ct = [hashData(userData.city)];
    }
    if (userData.state) {
      hashedUserData.st = [hashData(userData.state)];
    }
    if (userData.country) {
      hashedUserData.country = [hashData(userData.country)];
    }
    if (userData.zipCode) {
      hashedUserData.zp = [hashData(userData.zipCode)];
    }

    // Add Event Quality parameters (these should NOT be hashed)
    if (userData.fbc) {
      hashedUserData.fbc = userData.fbc;
    }
    if (userData.fbp) {
      hashedUserData.fbp = userData.fbp;
    }
    if (userData.external_id) {
      hashedUserData.external_id = userData.external_id;
    }
    if (userData.fb_login_id) {
      hashedUserData.fb_login_id = userData.fb_login_id;
    }

    // Get client IP and user agent
    const clientIP = request ? getClientIP(request) : '0.0.0.0';
    const userAgent = request ? request.headers.get('user-agent') || '' : '';

    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: finalEventId,
          user_data: {
            ...hashedUserData,
            client_ip_address: clientIP,
            client_user_agent: userAgent,
          },
          custom_data: customData || {},
          event_source_url: request ? new URL(request.url).href : '',
          action_source: 'website',
        },
      ],
      access_token: META_ACCESS_TOKEN,
    };

    const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Meta Conversion API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      eventId: finalEventId,
    };
  } catch (error) {
    console.error('Meta Conversion API error:', error);
    return {
      success: false,
      eventId: eventId || generateEventId(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Education-specific conversion events
export const trackStudyAbroadLead = async (
  formData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    message?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  },
  source: string = 'website_contact_form',
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = formData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: formData.email,
    phone: formData.phone,
    firstName: firstName,
    lastName: lastName,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    zipCode: formData.zipCode,
  };

  const customData = {
    content_name: 'Study Abroad Consultation Form',
    content_category: 'Education Lead Generation',
    source: source,
    study_destination: formData.country || 'not_specified',
    program_interest: formData.program || 'not_specified',
    has_message: !!formData.message,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('Lead', userData, customData, eventId, request);
};

export const trackConsultationRequest = async (
  source: string = 'website',
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'Free Consultation Request',
    content_category: 'Lead Generation',
    source: source,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('Lead', userData || {}, customData, eventId, request);
};

export const trackPageView = async (
  pageName: string,
  pageCategory?: string,
  request?: Request,
  eventId?: string
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const finalEventId = eventId || generatePageViewEventId();
  
  const customData = {
    content_name: pageName,
    content_category: pageCategory || 'general',
    page_title: pageName,
    page_category: pageCategory || 'general',
  };

  return await sendConversionAPIEvent('PageView', {}, customData, finalEventId, request);
};

export const trackViewContent = async (
  contentName: string,
  contentCategory: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: contentName,
    content_category: contentCategory,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('ViewContent', userData || {}, customData, eventId, request);
};

export const trackCompleteRegistration = async (
  formType: string,
  userData: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `${formType} Registration`,
    content_category: 'Form Submission',
    registration_method: formType,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('CompleteRegistration', userData, customData, eventId, request);
};

export const trackContact = async (
  contactMethod: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `${contactMethod} Contact`,
    content_category: 'Contact',
    contact_method: contactMethod,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('Contact', userData || {}, customData, eventId, request);
};

// Education Consultancy Lead Status Tracking
export const trackLeadStatusChange = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    previousStatus?: string;
    newStatus: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  // Map status to appropriate Meta event and custom data
  const statusEventMapping = {
    'new': { event: 'Lead', value: 0, category: 'Initial Inquiry' },
    'contacted': { event: 'Contact', value: 0, category: 'First Contact' },
    'consultation_scheduled': { event: 'Schedule', value: 0, category: 'Consultation Scheduled' },
    'consultation_completed': { event: 'ViewContent', value: 0, category: 'Consultation Completed' },
    'qualified': { event: 'ViewContent', value: 0, category: 'Lead Qualified' },
    'application_started': { event: 'InitiateCheckout', value: 0, category: 'Application Started' },
    'application_submitted': { event: 'AddToCart', value: 0, category: 'Application Submitted' },
    'admission_received': { event: 'Purchase', value: 1000, category: 'Admission Received' },
    'visa_applied': { event: 'Purchase', value: 1500, category: 'Visa Application' },
    'visa_approved': { event: 'Purchase', value: 2000, category: 'Visa Approved' },
    'enrolled': { event: 'Purchase', value: 5000, category: 'Student Enrolled' },
    'converted': { event: 'Purchase', value: 5000, category: 'Conversion Complete' },
    'not_interested': { event: 'Contact', value: 0, category: 'Not Interested' },
    'closed': { event: 'Contact', value: 0, category: 'Lead Closed' }
  };

  const mapping = statusEventMapping[leadData.newStatus as keyof typeof statusEventMapping] || 
                  { event: 'Contact', value: 0, category: 'Status Update' };

  const customData = {
    content_name: `Lead Status: ${leadData.newStatus.replace('_', ' ').toUpperCase()}`,
    content_category: mapping.category,
    lead_status: leadData.newStatus,
    previous_status: leadData.previousStatus || 'unknown',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    value: mapping.value,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent(mapping.event, userData, customData, eventId, request);
};

// Track consultation booking
export const trackConsultationBooking = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    consultationType?: string;
    scheduledDate?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  const customData = {
    content_name: 'Consultation Booking',
    content_category: 'Education Consultation',
    consultation_type: leadData.consultationType || 'general',
    scheduled_date: leadData.scheduledDate || 'not_specified',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Schedule', userData, customData, eventId, request);
};

// Track application submission
export const trackApplicationSubmission = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    university?: string;
    applicationFee?: number;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  const customData = {
    content_name: 'University Application Submitted',
    content_category: 'Application Process',
    university_name: leadData.university || 'not_specified',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    application_fee: leadData.applicationFee || 0,
    value: leadData.applicationFee || 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('AddToCart', userData, customData, eventId, request);
};

// Track admission received
export const trackAdmissionReceived = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    university?: string;
    admissionValue?: number;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  const customData = {
    content_name: 'University Admission Received',
    content_category: 'Admission Success',
    university_name: leadData.university || 'not_specified',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    admission_value: leadData.admissionValue || 1000,
    value: leadData.admissionValue || 1000,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Purchase', userData, customData, eventId, request);
};

// Track visa approval
export const trackVisaApproval = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    university?: string;
    visaValue?: number;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  const customData = {
    content_name: 'Student Visa Approved',
    content_category: 'Visa Success',
    university_name: leadData.university || 'not_specified',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    visa_value: leadData.visaValue || 2000,
    value: leadData.visaValue || 2000,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Purchase', userData, customData, eventId, request);
};

// Track enrollment completion
export const trackEnrollmentCompletion = async (
  leadData: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    program?: string;
    university?: string;
    enrollmentValue?: number;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = leadData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const userData = {
    email: leadData.email,
    phone: leadData.phone,
    firstName: firstName,
    lastName: lastName,
    country: leadData.country,
  };

  const customData = {
    content_name: 'Student Enrollment Complete',
    content_category: 'Enrollment Success',
    university_name: leadData.university || 'not_specified',
    study_destination: leadData.country || 'not_specified',
    program_interest: leadData.program || 'not_specified',
    enrollment_value: leadData.enrollmentValue || 5000,
    value: leadData.enrollmentValue || 5000,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Purchase', userData, customData, eventId, request);
};

// Track WhatsApp interactions
export const trackWhatsAppClick = async (
  source: string = 'website',
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'WhatsApp Contact',
    content_category: 'Communication',
    contact_method: 'whatsapp',
    source: source,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Contact', userData || {}, customData, eventId, request);
};

// Track phone call interactions
export const trackPhoneClick = async (
  source: string = 'website',
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'Phone Call',
    content_category: 'Communication',
    contact_method: 'phone',
    source: source,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Contact', userData || {}, customData, eventId, request);
};

// Track destination page views with country interest
export const trackDestinationView = async (
  countryName: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `Study in ${countryName}`,
    content_category: 'Destination Interest',
    destination_country: countryName,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('ViewContent', userData || {}, customData, eventId, request);
};

// Track scholarship inquiry
export const trackScholarshipInquiry = async (
  userData: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    program?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'Scholarship Inquiry',
    content_category: 'Scholarship Interest',
    study_destination: userData.country || 'not_specified',
    program_interest: userData.program || 'not_specified',
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Lead', userData, customData, eventId, request);
};

// Track university interest
export const trackUniversityInterest = async (
  universityName: string,
  country: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `University Interest: ${universityName}`,
    content_category: 'University Research',
    university_name: universityName,
    destination_country: country,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('ViewContent', userData || {}, customData, eventId, request);
};

// Track program interest
export const trackProgramInterest = async (
  programName: string,
  country: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `Program Interest: ${programName}`,
    content_category: 'Program Research',
    program_name: programName,
    destination_country: country,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('ViewContent', userData || {}, customData, eventId, request);
};

// Track document download
export const trackDocumentDownload = async (
  documentName: string,
  documentType: string,
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: `Download: ${documentName}`,
    content_category: 'Document Download',
    document_type: documentType,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('ViewContent', userData || {}, customData, eventId, request);
};

// Track email subscription
export const trackEmailSubscription = async (
  userData: {
    email: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'Email Subscription',
    content_category: 'Newsletter Signup',
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Subscribe', userData, customData, eventId, request);
};

// Track partnership inquiry
export const trackPartnershipInquiry = async (
  userData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
  },
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  const [firstName, ...lastNameParts] = userData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  
  const customData = {
    content_name: 'Partnership Inquiry',
    content_category: 'Business Partnership',
    company_name: userData.company || 'not_specified',
    has_message: !!userData.message,
    value: 0,
    currency: 'BDT',
    education_consultancy_event: true,
  };

  return await sendConversionAPIEvent('Lead', {
    email: userData.email,
    phone: userData.phone,
    firstName: firstName,
    lastName: lastName,
  }, customData, eventId, request);
};

// Test event for debugging
export const testConversionAPI = async (
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: 'Test Event',
    content_category: 'Testing',
    test_event: true,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('PageView', {}, customData, eventId, request);
};

// New Meta Events from the implementation guide

// Add to Cart - for application forms
export const trackAddToCart = async (
  value: number,
  currency: string,
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    value,
    currency,
    content_name: contentName,
    content_category: contentCategory,
    content_ids: [contentName],
    contents: [{
      id: contentName,
      quantity: 1,
      item_price: value
    }]
  };

  return await sendConversionAPIEvent('AddToCart', userData, customData, eventId, request);
};

// Add to Wishlist - for saved programs
export const trackAddToWishlist = async (
  value: number,
  currency: string,
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    value,
    currency,
    content_name: contentName,
    content_category: contentCategory,
    content_ids: [contentName],
    contents: [{
      id: contentName,
      quantity: 1,
      item_price: value
    }]
  };

  return await sendConversionAPIEvent('AddToWishlist', userData, customData, eventId, request);
};

// Initiate Checkout - for application process
export const trackInitiateCheckout = async (
  value: number,
  currency: string,
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    value,
    currency,
    content_name: contentName,
    content_category: contentCategory,
    content_ids: [contentName],
    contents: [{
      id: contentName,
      quantity: 1,
      item_price: value
    }],
    num_items: 1
  };

  return await sendConversionAPIEvent('InitiateCheckout', userData, customData, eventId, request);
};

// Purchase - for paid services/applications
export const trackPurchase = async (
  value: number,
  currency: string,
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    value,
    currency,
    content_name: contentName,
    content_category: contentCategory,
    content_ids: [contentName],
    contents: [{
      id: contentName,
      quantity: 1,
      item_price: value
    }],
    num_items: 1
  };

  return await sendConversionAPIEvent('Purchase', userData, customData, eventId, request);
};

// Search - for program searches
export const trackSearch = async (
  searchString: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    search_string: searchString
  };

  return await sendConversionAPIEvent('Search', userData, customData, eventId, request);
};

// Find Location - for office visits
export const trackFindLocation = async (
  searchString: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    search_string: searchString
  };

  return await sendConversionAPIEvent('FindLocation', userData, customData, eventId, request);
};

// Schedule - for consultation bookings
export const trackSchedule = async (
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: contentName,
    content_category: contentCategory
  };

  return await sendConversionAPIEvent('Schedule', userData, customData, eventId, request);
};

// Submit Application - perfect for education!
export const trackSubmitApplication = async (
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: contentName,
    content_category: contentCategory
  };

  return await sendConversionAPIEvent('SubmitApplication', userData, customData, eventId, request);
};

// Subscribe - for newsletter signups
export const trackSubscribe = async (
  contentName: string,
  contentCategory: string,
  userData: any,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();
  
  const customData = {
    content_name: contentName,
    content_category: contentCategory
  };

  return await sendConversionAPIEvent('Subscribe', userData, customData, eventId, request);
};

// Meta Conversion API implementation for EduExpress International
// NOTE: server-only module (imports the DB layer). Client code must call the
// /api/meta-conversion route instead of importing from here.
import crypto from 'crypto';
import { extractClientIp } from './client-ip';
import { getMetaConfig } from '@/lib/settings';
import { sendMetaEvents } from '@/lib/meta-api';
import { resolveCanonicalEventSourceUrl } from '@/lib/meta-capi-policy';
import { recordMetaDelivery } from '@/lib/meta-health';
import {
  buildServerMetaParams,
  PII_DATA_TYPE,
  sanitizeMetaExternalId,
  sanitizeMetaParamValue,
  type CookieSettings,
} from '@/lib/meta-param-builder-server';

// Optional explicit credentials; when omitted the DB config is used.
export type MetaConfigOverride = { pixelId?: string | null; accessToken?: string | null };

// Configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';


// Hash data for Meta Conversion API (server-side)
export const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Customer Information Normalization Helpers per Meta Specifications
// https://developers.facebook.com/documentation/ads-commerce/conversions-api/parameters/customer-information-parameters

export const normalizeEmail = (email: string | undefined): string | undefined => {
  if (!email) return undefined;
  return email.trim().toLowerCase();
};

export const normalizePhone = (phone: string | undefined): string | undefined => {
  if (!phone) return undefined;
  // Digits only: remove all +, -, spaces, parentheses, dots
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  // If Bangladesh local number starting with 01..., prepend 880
  if (digits.startsWith('01') && digits.length === 11) {
    digits = `880${digits.slice(1)}`;
  } else if (!digits.startsWith('880') && digits.length === 10 && digits.startsWith('1')) {
    digits = `880${digits}`;
  }
  return digits;
};

const COUNTRY_CODE_MAP: Record<string, string> = {
  bangladesh: 'bd',
  china: 'cn',
  uk: 'gb',
  'united kingdom': 'gb',
  malaysia: 'my',
  hungary: 'hu',
  'south korea': 'kr',
  korea: 'kr',
  finland: 'fi',
  malta: 'mt',
  cyprus: 'cy',
  georgia: 'ge',
  greece: 'gr',
  croatia: 'hr',
  thailand: 'th',
  usa: 'us',
  'united states': 'us',
  canada: 'ca',
  australia: 'au',
};

export const normalizeCountry = (country: string | undefined): string | undefined => {
  if (!country) return undefined;
  const clean = country.trim().toLowerCase();
  if (clean.length === 2) return clean;
  return COUNTRY_CODE_MAP[clean] || clean.slice(0, 2);
};

export const normalizeText = (text: string | undefined): string | undefined => {
  if (!text) return undefined;
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
};

// Get client IP from request headers
export const getClientIP = (request: Request): string => {
  return extractClientIp((name) => request.headers.get(name)) ?? '0.0.0.0';
};

export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  fbc?: string;
  fbp?: string;
  external_id?: string;
  fb_login_id?: string;
  eventSourceUrl?: string;
}

export const extractCookie = (request: Request, name: string): string | undefined => {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

// Extract Event Quality parameters from request using Meta Parameter Builder
export const extractEventQualityParams = (request: Request): {
  fbc?: string;
  fbp?: string;
  external_id?: string;
  fb_login_id?: string;
} => {
  const serverParams = buildServerMetaParams(request);

  return {
    fbc: serverParams.fbc,
    fbp: serverParams.fbp,
    external_id: serverParams.externalId,
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
  userData: MetaUserData,
  customData?: Record<string, unknown>,
  eventId?: string,
  request?: Request,
  metaConfig?: MetaConfigOverride
): Promise<{
  success: boolean;
  eventId: string;
  cookiesToSet?: CookieSettings[];
  fbc?: string;
  fbp?: string;
  error?: string;
}> => {
  // Skip Meta API calls during build to prevent DNS issues
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && !request) {
    return {
      success: true,
      eventId: eventId || generateEventId(),
    };
  }

  // Resolve credentials: explicit override → DB settings → env fallback.
  const cfg = metaConfig ?? (await getMetaConfig());
  const activePixelId = cfg.pixelId || META_PIXEL_ID;
  const activeAccessToken = cfg.accessToken || META_ACCESS_TOKEN;

  if (!activeAccessToken || !activePixelId) {
    return {
      success: false,
      eventId: eventId || generateEventId(),
      error: 'Missing Meta access token or pixel ID'
    };
  }

  try {
    const finalEventId = eventId || generateEventId();
    const serverMetaParams = buildServerMetaParams(request, {
      fbc: userData.fbc,
      fbp: userData.fbp,
      externalId: userData.external_id,
      eventSourceUrl: userData.eventSourceUrl,
    });

    // Prepare user data with Parameter Builder normalized/hashed PII + fallback SHA-256
    const hashedUserData: Record<string, string[] | string> = {};

    const cleanEmail = normalizeEmail(userData.email);
    if (cleanEmail) {
      const hashed = serverMetaParams.hashPii(cleanEmail, PII_DATA_TYPE.EMAIL) ?? hashData(cleanEmail);
      hashedUserData.em = [hashed];
    }

    const cleanPhone = normalizePhone(userData.phone);
    if (cleanPhone) {
      const hashed = serverMetaParams.hashPii(cleanPhone, PII_DATA_TYPE.PHONE) ?? hashData(cleanPhone);
      hashedUserData.ph = [hashed];
    }

    const cleanFn = normalizeText(userData.firstName);
    if (cleanFn) {
      const hashed = serverMetaParams.hashPii(cleanFn, PII_DATA_TYPE.FIRST_NAME) ?? hashData(cleanFn);
      hashedUserData.fn = [hashed];
    }

    const cleanLn = normalizeText(userData.lastName);
    if (cleanLn) {
      const hashed = serverMetaParams.hashPii(cleanLn, PII_DATA_TYPE.LAST_NAME) ?? hashData(cleanLn);
      hashedUserData.ln = [hashed];
    }

    const cleanCity = normalizeText(userData.city);
    if (cleanCity) {
      const hashed = serverMetaParams.hashPii(cleanCity, PII_DATA_TYPE.CITY) ?? hashData(cleanCity);
      hashedUserData.ct = [hashed];
    }

    const cleanState = normalizeText(userData.state);
    if (cleanState) {
      const hashed = serverMetaParams.hashPii(cleanState, PII_DATA_TYPE.STATE) ?? hashData(cleanState);
      hashedUserData.st = [hashed];
    }

    const cleanCountry = normalizeCountry(userData.country);
    if (cleanCountry) {
      const hashed = serverMetaParams.hashPii(cleanCountry, PII_DATA_TYPE.COUNTRY) ?? hashData(cleanCountry);
      hashedUserData.country = [hashed];
    }

    if (userData.zipCode) {
      const cleanZip = userData.zipCode.replace(/\s+/g, '').toLowerCase();
      const hashed = serverMetaParams.hashPii(cleanZip, PII_DATA_TYPE.ZIP_CODE) ?? hashData(cleanZip);
      hashedUserData.zp = [hashed];
    }

    // Add Event Quality parameters via Meta Parameter Builder
    const finalFbc = serverMetaParams.fbc ?? sanitizeMetaParamValue(userData.fbc);
    const finalFbp = serverMetaParams.fbp ?? sanitizeMetaParamValue(userData.fbp);
    const rawExtId = sanitizeMetaExternalId(userData.external_id) ?? serverMetaParams.externalId;
    const finalExtId = rawExtId
      ? (serverMetaParams.hashPii(rawExtId, PII_DATA_TYPE.EXTERNAL_ID) ?? hashData(rawExtId))
      : undefined;

    if (finalFbc) {
      hashedUserData.fbc = finalFbc;
    }
    if (finalFbp) {
      hashedUserData.fbp = finalFbp;
    }
    if (finalExtId) {
      hashedUserData.external_id = finalExtId;
    }
    if (userData.fb_login_id) {
      hashedUserData.fb_login_id = userData.fb_login_id;
    }

    // Get trusted client IP (Parameter Builder preferred, with extractClientIp fallback) and user agent
    const trustedIp = request ? extractClientIp((name) => request.headers.get(name)) : null;
    const clientIP = serverMetaParams.clientIpAddress ?? trustedIp ?? undefined;
    const userAgent = request ? request.headers.get('user-agent') || undefined : undefined;

    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: finalEventId,
          user_data: {
            ...hashedUserData,
            ...(clientIP ? { client_ip_address: clientIP } : {}),
            ...(userAgent ? { client_user_agent: userAgent } : {}),
          },
          custom_data: customData || {},
          event_source_url: serverMetaParams.eventSourceUrl || resolveCanonicalEventSourceUrl(
            userData.eventSourceUrl || request?.headers.get('referer') || request?.url,
          ),
          action_source: 'website',
        },
      ],
      access_token: activeAccessToken,
    };

    const activeConfig = { pixelId: activePixelId, accessToken: activeAccessToken };
    const delivery = await sendMetaEvents(activeConfig, eventData.data);
    await recordMetaDelivery(activeConfig, delivery);
    if (!delivery.ok) {
      return {
        success: false,
        eventId: finalEventId,
        cookiesToSet: serverMetaParams.cookiesToSet,
        fbc: finalFbc,
        fbp: finalFbp,
        error: delivery.error,
      };
    }

    return {
      success: true,
      eventId: finalEventId,
      cookiesToSet: serverMetaParams.cookiesToSet,
      fbc: finalFbc,
      fbp: finalFbp,
    };
  } catch (error) {
    console.error('Meta Conversion API delivery failed.');
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
    fbc?: string;
    fbp?: string;
    externalId?: string;
    eventSourceUrl?: string;
  },
  source: string = 'website_contact_form',
  request?: Request,
  metaConfig?: MetaConfigOverride,
  sharedEventId?: string
): Promise<{
  success: boolean;
  eventId: string;
  cookiesToSet?: CookieSettings[];
  fbc?: string;
  fbp?: string;
  error?: string;
}> => {
  const eventId = sharedEventId || generateEventId();
  const [firstName, ...lastNameParts] = formData.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';

  const userData: MetaUserData = {
    email: formData.email,
    phone: formData.phone,
    firstName: firstName,
    lastName: lastName,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    zipCode: formData.zipCode,
    fbc: formData.fbc,
    fbp: formData.fbp,
    external_id: formData.externalId,
    eventSourceUrl: formData.eventSourceUrl,
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

  return await sendConversionAPIEvent('Lead', userData, customData, eventId, request, metaConfig);
};

export const trackConsultationRequest = async (
  source: string = 'website',
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
  request?: Request,
  metaConfig?: MetaConfigOverride
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();

  const customData = {
    content_name: 'Free Consultation Request',
    content_category: 'Lead Generation',
    source: source,
    value: 0,
    currency: 'BDT',
  };

  return await sendConversionAPIEvent('Lead', userData || {}, customData, eventId, request, metaConfig);
};

export const trackPageView = async (
  pageName: string,
  pageCategory?: string,
  request?: Request,
  eventId?: string,
  metaConfig?: MetaConfigOverride
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const finalEventId = eventId || generatePageViewEventId();

  const customData = {
    content_name: pageName,
    content_category: pageCategory || 'general',
    page_title: pageName,
    page_category: pageCategory || 'general',
  };

  return await sendConversionAPIEvent('PageView', {}, customData, finalEventId, request, metaConfig);
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
  request?: Request,
  metaConfig?: MetaConfigOverride
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

  return await sendConversionAPIEvent(mapping.event, userData, customData, eventId, request, metaConfig);
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
    fbc?: string;
    fbp?: string;
    externalId?: string;
    eventSourceUrl?: string;
  },
  request?: Request
): Promise<{
  success: boolean;
  eventId: string;
  cookiesToSet?: CookieSettings[];
  fbc?: string;
  fbp?: string;
  error?: string;
}> => {
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
    fbc: userData.fbc,
    fbp: userData.fbp,
    external_id: userData.externalId,
    eventSourceUrl: userData.eventSourceUrl,
  }, customData, eventId, request);
};

// Test event for debugging
export const testConversionAPI = async (
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();

  const customData = {
    content_name: 'Connection Verification',
    content_category: 'Admin Test',
    test_event: true,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
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
  userData: MetaUserData,
  request?: Request
): Promise<{ success: boolean; eventId: string; error?: string }> => {
  const eventId = generateEventId();

  const customData = {
    content_name: contentName,
    content_category: contentCategory
  };

  return await sendConversionAPIEvent('Subscribe', userData, customData, eventId, request);
};

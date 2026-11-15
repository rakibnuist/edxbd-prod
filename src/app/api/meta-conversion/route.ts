import { NextRequest, NextResponse } from 'next/server';
import {
  trackStudyAbroadLead,
  trackConsultationRequest,
  trackPageView,
  trackViewContent,
  trackCompleteRegistration,
  trackContact,
  trackLeadStatusChange,
  trackConsultationBooking,
  trackApplicationSubmission,
  trackAdmissionReceived,
  trackVisaApproval,
  trackEnrollmentCompletion,
  trackWhatsAppClick,
  trackPhoneClick,
  trackDestinationView,
  trackScholarshipInquiry,
  trackUniversityInterest,
  trackProgramInterest,
  trackDocumentDownload,
  trackEmailSubscription,
  trackPartnershipInquiry,
  trackAddToCart,
  trackAddToWishlist,
  trackInitiateCheckout,
  trackPurchase,
  trackSearch,
  trackFindLocation,
  trackSchedule,
  trackSubmitApplication,
  trackSubscribe,
  testConversionAPI
} from '@/lib/meta-conversion-api';
import {
  applyMetaParamCookies,
  buildServerMetaParams,
  extractMetaParamOverridesFromBody,
} from '@/lib/meta-param-builder-server';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { classifyRequestOrigin, resolveAllowedOriginHosts } from '@/lib/meta-capi-policy';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

const ADMIN_ONLY_EVENTS = new Set([
  'lead_status_change',
  'consultation_booking',
  'application_submission',
  'admission_received',
  'visa_approval',
  'enrollment_completion',
  'purchase',
  'submit_application',
  'test',
]);

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'meta-conversion',
    maxRequests: 60,
    windowMs: 60 * 1000,
    persistent: false,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  const origin = classifyRequestOrigin(
    request.headers,
    resolveAllowedOriginHosts(request.headers.get('host')),
  );
  if (origin === 'cross-site') {
    return NextResponse.json({ error: 'Cross-site conversion events are not accepted' }, { status: 403 });
  }

  try {
    const body = await readLimitedJson(request, 32 * 1024);
    const { eventType, data, source, trackingConsent } = body;

    if (typeof eventType !== 'string' || !data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }

    const requiresAdminCheck = ADMIN_ONLY_EVENTS.has(eventType) || origin === 'unknown';
    const isAdmin = requiresAdminCheck ? Boolean(await verifyLiveAdminUser(request)) : false;
    if (ADMIN_ONLY_EVENTS.has(eventType) && !isAdmin) {
      return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
    }
    if (origin === 'unknown' && !isAdmin) {
      return NextResponse.json({ error: 'Conversion events must come from the site.' }, { status: 403 });
    }
    if (!ADMIN_ONLY_EVENTS.has(eventType) && trackingConsent !== true) {
      return NextResponse.json({ error: 'Advertising consent required.' }, { status: 403 });
    }

    // Build Event Quality parameters via Meta Parameter Builder when visitor tracking consent is active
    const nestedUserData =
      data.userData && typeof data.userData === 'object' && !Array.isArray(data.userData)
        ? (data.userData as Record<string, unknown>)
        : undefined;
    const overrides = extractMetaParamOverridesFromBody(
      data as Record<string, unknown>,
      nestedUserData,
    );
    const serverMetaParams =
      trackingConsent === true
        ? buildServerMetaParams(request, overrides)
        : null;

    if (serverMetaParams) {
      if (serverMetaParams.fbc) data.fbc = serverMetaParams.fbc;
      if (serverMetaParams.fbp) data.fbp = serverMetaParams.fbp;
      if (serverMetaParams.externalId) data.externalId = serverMetaParams.externalId;
      data.eventSourceUrl = serverMetaParams.eventSourceUrl;

      if (data.userData) {
        data.userData = {
          ...data.userData,
          ...(serverMetaParams.fbc ? { fbc: serverMetaParams.fbc } : {}),
          ...(serverMetaParams.fbp ? { fbp: serverMetaParams.fbp } : {}),
          ...(serverMetaParams.externalId ? { external_id: serverMetaParams.externalId } : {}),
          eventSourceUrl: serverMetaParams.eventSourceUrl,
          fb_login_id: data.fb_login_id ?? nestedUserData?.fb_login_id,
        };
      }
    } else if (data.userData) {
      data.userData = {
        ...data.userData,
        ...(overrides.fbc ? { fbc: overrides.fbc } : {}),
        ...(overrides.fbp ? { fbp: overrides.fbp } : {}),
        ...(overrides.externalId ? { external_id: overrides.externalId } : {}),
        ...(overrides.eventSourceUrl ? { eventSourceUrl: overrides.eventSourceUrl } : {}),
        fb_login_id: data.fb_login_id ?? nestedUserData?.fb_login_id,
      };
    }

    let result;

    switch (eventType) {
      case 'study_abroad_lead':
        result = await trackStudyAbroadLead(data, source, request);
        break;

      case 'consultation_request':
        result = await trackConsultationRequest(source, data, request);
        break;

      case 'page_view':
        result = await trackPageView(data.pageName, data.pageCategory, request, data.eventId);
        break;

      case 'view_content':
        result = await trackViewContent(data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'complete_registration':
        result = await trackCompleteRegistration(data.formType, data.userData, request);
        break;

      case 'contact':
        result = await trackContact(data.contactMethod, data.userData, request);
        break;

      case 'lead_status_change':
        result = await trackLeadStatusChange(data.leadData, request);
        break;

      case 'consultation_booking':
        result = await trackConsultationBooking(data.leadData, request);
        break;

      case 'application_submission':
        result = await trackApplicationSubmission(data.leadData, request);
        break;

      case 'admission_received':
        result = await trackAdmissionReceived(data.leadData, request);
        break;

      case 'visa_approval':
        result = await trackVisaApproval(data.leadData, request);
        break;

      case 'enrollment_completion':
        result = await trackEnrollmentCompletion(data.leadData, request);
        break;

      case 'whatsapp_click':
        result = await trackWhatsAppClick(source, data.userData, request);
        break;

      case 'phone_click':
        result = await trackPhoneClick(source, data.userData, request);
        break;

      case 'destination_view':
        result = await trackDestinationView(data.countryName, data.userData, request);
        break;

      case 'scholarship_inquiry':
        result = await trackScholarshipInquiry(data.userData, request);
        break;

      case 'university_interest':
        result = await trackUniversityInterest(data.universityName, data.country, data.userData, request);
        break;

      case 'program_interest':
        result = await trackProgramInterest(data.programName, data.country, data.userData, request);
        break;

      case 'document_download':
        result = await trackDocumentDownload(data.documentName, data.documentType, data.userData, request);
        break;

      case 'email_subscription':
        result = await trackEmailSubscription(data.userData, request);
        break;

      case 'partnership_inquiry':
        result = await trackPartnershipInquiry(data.userData, request);
        break;

      // New Meta Events from the guide
      case 'add_to_cart':
        result = await trackAddToCart(data.value, data.currency, data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'add_to_wishlist':
        result = await trackAddToWishlist(data.value, data.currency, data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'initiate_checkout':
        result = await trackInitiateCheckout(data.value, data.currency, data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'purchase':
        result = await trackPurchase(data.value, data.currency, data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'search':
        result = await trackSearch(data.searchString, data.userData, request);
        break;

      case 'find_location':
        result = await trackFindLocation(data.searchString, data.userData, request);
        break;

      case 'schedule':
        result = await trackSchedule(data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'submit_application':
        result = await trackSubmitApplication(data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'subscribe':
        result = await trackSubscribe(data.contentName, data.contentCategory, data.userData, request);
        break;

      case 'test':
        result = await testConversionAPI(request);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    const response = NextResponse.json(result);
    return serverMetaParams
      ? applyMetaParamCookies(response, request, serverMetaParams.cookiesToSet)
      : response;
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Meta Conversion API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Meta Conversion API endpoint is active',
    supportedEvents: [
      'study_abroad_lead',
      'consultation_request',
      'page_view',
      'view_content',
      'complete_registration',
      'contact',
      'lead_status_change',
      'consultation_booking',
      'application_submission',
      'admission_received',
      'visa_approval',
      'enrollment_completion',
      'whatsapp_click',
      'phone_click',
      'destination_view',
      'scholarship_inquiry',
      'university_interest',
      'program_interest',
      'document_download',
      'email_subscription',
      'partnership_inquiry',
      'add_to_cart',
      'add_to_wishlist',
      'initiate_checkout',
      'purchase',
      'search',
      'find_location',
      'schedule',
      'submit_application',
      'subscribe',
      'test'
    ]
  });
}

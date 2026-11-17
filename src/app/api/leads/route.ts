import { NextRequest, NextResponse, after } from 'next/server';
import { sendCrmStage } from '@/lib/meta-crm-events';
import prisma from '@/lib/prisma';
import { routeLead } from '@/lib/lead-routing';
import { trackStudyAbroadLead } from '@/lib/meta-conversion-api';
import {
  applyMetaParamCookies,
  buildServerMetaParams,
  extractMetaParamOverridesFromBody,
} from '@/lib/meta-param-builder-server';
import { validateLeadAssessmentInput } from '@/lib/payload-validation';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import {
  getOptionalString,
  getRequiredDate,
  getRequiredString,
  getSafeUtm,
  getValidatedPhone,
  jsonBodyErrorResponse,
  readLimitedJson,
} from '@/lib/request-body';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'lead-form',
    maxRequests: 60,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 48 * 1024);
    if (getOptionalString(body, 'companyWebsite', 200)) {
      return NextResponse.json({ message: 'Lead submitted successfully' }, { status: 201 });
    }
    const name = getRequiredString(body, 'name', 120);
    const rawEmail = getOptionalString(body, 'email', 254);
    const phone = getValidatedPhone(body);
    const country = getRequiredString(body, 'country', 120);
    const program = getOptionalString(body, 'program', 200);
    const message = getOptionalString(body, 'message', 4000);
    const source = getOptionalString(body, 'source', 100) || 'website';
    const leadType = getOptionalString(body, 'leadType', 50) || 'contact';
    const notes = getOptionalString(body, 'notes', 2000);
    const consentPolicyVersion = getRequiredString(body, 'consentPolicyVersion', 100);
    const consentTimestamp = getRequiredDate(body, 'consentTimestamp');
    const landingPage = getOptionalString(body, 'landingPage', 2048);
    
    // Validate required fields
    if (body.consent !== true) {
      return NextResponse.json(
        { error: 'Name, email, phone, country and recorded privacy consent are required' },
        { status: 400 }
      );
    }

    // Validate email format when provided; synthesize deterministic fallback for phone-only campaign leads
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rawEmail && !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const phoneDigits = phone.replace(/\D/g, '');
    const normalizedEmail = rawEmail
      ? rawEmail.trim().toLowerCase()
      : `no-email+${phoneDigits}@leads.eduexpressint.com`;
    const duplicate = await prisma.lead.findFirst({
      where: { email: normalizedEmail, phone, createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ message: 'Lead already received', leadId: duplicate.id, duplicate: true }, { status: 200 });
    }

    const safeUtm = getSafeUtm(body.utm);
    const bodyOverrides = extractMetaParamOverridesFromBody(body);
    const hasMetaSignal =
      /^(meta|facebook|fb|instagram|ig|msg|messenger|an|threads|fb_ads|meta_ads|facebook_ads|instagram_ads|ig_ads)$/i.test(
        safeUtm?.utm_source || '',
      ) ||
      /\b(meta|facebook|instagram|paid|weblead)\b/i.test(safeUtm?.utm_source || '') ||
      /^(paid|paid_social|paidsocial|cpc|ppc|meta_paid|social_paid)$/i.test(safeUtm?.utm_medium || '') ||
      /\b(meta|facebook|instagram|fb|ig|weblead|instantform)\b/i.test(safeUtm?.utm_campaign || '') ||
      Boolean(safeUtm?.fbclid) ||
      Boolean(bodyOverrides.fbc) ||
      /[?&]fbclid=[^&#]+/i.test(request.headers.get('referer') || '') ||
      /[?&]fbclid=[^&#]+/i.test(getOptionalString(body, 'metaEventSourceUrl', 2048) || '') ||
      /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(request.headers.get('user-agent') || '');
    // Derive and persist Meta click/browser parameters on explicit cookie consent or consented Meta campaign submissions.
    const adTrackingConsent = Boolean(body.trackingConsent === true || (body.consent === true && hasMetaSignal));
    const serverMetaParams = adTrackingConsent
      ? buildServerMetaParams(request, bodyOverrides)
      : null;
    const metaFbc = serverMetaParams?.fbc ?? null;
    const metaFbp = serverMetaParams?.fbp ?? null;

    const isMarchLanding =
      landingPage === '/china-march-2027-intake' ||
      source === 'china_march_2027_landing' ||
      source === 'meta_china_march_2027';
    const isChinaPillarLanding =
      landingPage === '/study-in-china-from-bangladesh' ||
      source === 'china_study_landing' ||
      source === 'meta_china_study_page';
    const resolvedSource =
      isMarchLanding && hasMetaSignal
        ? 'meta_china_march_2027'
        : isChinaPillarLanding && hasMetaSignal
          ? 'meta_china_study_page'
          : source;

    const assessmentCheck = validateLeadAssessmentInput(body);
    if (assessmentCheck.error) {
      return NextResponse.json({ error: assessmentCheck.error }, { status: 400 });
    }
    const metaEventId = getOptionalString(body, 'metaEventId', 120);

    // Apply plan lead-routing rules server-side.
    const routing = routeLead({
      destinationInterest: assessmentCheck.routeDestinationInterest,
      country,
      program,
      subject: assessmentCheck.assessment.subject,
      careerGoal: assessmentCheck.assessment.careerGoal,
      source: resolvedSource,
      budget: assessmentCheck.assessment.budget,
    });

    // Create new lead using Prisma
    const lead = await prisma.lead.create({
      data: {
        name,
        email: normalizedEmail,
        phone,
        country,
        program,
        message,
        source: resolvedSource,
        status: 'new',
        leadType,
        destinationInterest: assessmentCheck.destinationInterest,
        assignedTeam: routing.assignedTeam,
        riskFlag: routing.riskFlag,
        medicalProgram: routing.medicalProgram,
        notes: [notes, routing.routingNote].filter(Boolean).join(' | '),
        consentTimestamp,
        consentPolicyVersion,
        landingPage,
        utm: safeUtm ? JSON.stringify(safeUtm) : null,
        adTrackingConsent,
        metaFbc,
        metaFbp,
        assessAcademicLevel: assessmentCheck.assessment.academicLevel,
        assessAcademicResults: assessmentCheck.assessment.academicResults,
        assessSubject: assessmentCheck.assessment.subject,
        assessBudget: assessmentCheck.assessment.budget,
        assessIntake: assessmentCheck.assessment.intake,
        assessLanguage: assessmentCheck.assessment.language,
        assessCareerGoal: assessmentCheck.assessment.careerGoal,
        assessPreferredCountries: assessmentCheck.assessment.preferredCountriesJson,
      }
    });

    // First CRM stage for Meta's CRM integration, after the response is sent.
    if (adTrackingConsent) after(() => sendCrmStage(lead, 'new'));

    // Server-side CAPI lead tracking runs asynchronously after the response when adTrackingConsent is enabled.
    if (adTrackingConsent) {
      after(() =>
        trackStudyAbroadLead(
          {
            name,
            email: normalizedEmail,
            phone,
            country,
            program: program || 'Not specified',
            message: message || '',
            fbc: metaFbc ?? undefined,
            fbp: metaFbp ?? undefined,
            externalId: serverMetaParams?.externalId,
            eventSourceUrl: serverMetaParams?.eventSourceUrl,
          },
          resolvedSource,
          request,
          undefined,
          metaEventId,
        ).catch((trackingError) => {
          console.error('Meta Conversion API tracking error:', trackingError);
        }),
      );
    }

    // Return success response and persist Parameter Builder cookies only on explicit browser cookie consent
    const response = NextResponse.json(
      { 
        message: 'Lead submitted successfully',
        leadId: lead.id 
      },
      { status: 201 }
    );
    return body.trackingConsent === true && serverMetaParams
      ? applyMetaParamCookies(response, request, serverMetaParams.cookiesToSet)
      : response;
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Lead submission error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A lead with this email already exists' },
          { status: 409 }
        );
      }
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid data provided' },
          { status: 400 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}

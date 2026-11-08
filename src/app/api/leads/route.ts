import { NextRequest, NextResponse, after } from 'next/server';
import { sendCrmStage } from '@/lib/meta-crm-events';
import prisma from '@/lib/prisma';
import { routeLead } from '@/lib/lead-routing';
import { trackStudyAbroadLead } from '@/lib/meta-conversion-api';
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
  const rateLimit = checkRateLimit(request, {
    name: 'lead-form',
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 48 * 1024);
    if (getOptionalString(body, 'companyWebsite', 200)) {
      return NextResponse.json({ message: 'Lead submitted successfully' }, { status: 201 });
    }
    const name = getRequiredString(body, 'name', 120);
    const email = getRequiredString(body, 'email', 254);
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = await prisma.lead.findFirst({
      where: { email: normalizedEmail, phone, createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ message: 'Lead already received', leadId: duplicate.id, duplicate: true }, { status: 200 });
    }

    const safeUtm = getSafeUtm(body.utm);
    // Meta click/browser IDs (set by the Pixel only after cookie consent), kept for CRM matching.
    const adTrackingConsent = body.trackingConsent === true;
    const cookieId = (name: string) => {
      const value = request.cookies.get(name)?.value?.trim();
      return value && /^fb\.\d\.\d+\.[\w.-]{4,240}$/.test(value) ? value : null;
    };
    const metaFbc = adTrackingConsent ? cookieId('_fbc') : null;
    const metaFbp = adTrackingConsent ? cookieId('_fbp') : null;

    // Apply plan lead-routing rules server-side.
    const routing = routeLead({
      destinationInterest: body.destinationInterest,
      country,
      program,
      subject: body.assessment?.subject,
      careerGoal: body.assessment?.careerGoal,
      source,
      budget: body.assessment?.budget,
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
        source,
        status: 'new',
        leadType,
        destinationInterest: body.destinationInterest ? JSON.stringify(body.destinationInterest) : null,
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
        assessAcademicLevel: body.assessment?.academicLevel,
        assessAcademicResults: body.assessment?.academicResults,
        assessSubject: body.assessment?.subject,
        assessBudget: body.assessment?.budget,
        assessIntake: body.assessment?.intake,
        assessLanguage: body.assessment?.language,
        assessCareerGoal: body.assessment?.careerGoal,
        assessPreferredCountries: body.assessment?.preferredCountries ? JSON.stringify(body.assessment.preferredCountries) : null,
      }
    });

    // First CRM stage for Meta's CRM integration, after the response is sent.
    if (adTrackingConsent) after(() => sendCrmStage(lead, 'new'));

    // Advertising consent is separate from permission to contact the lead.
    // Only send hashed lead data to Meta when the visitor explicitly accepted.
    if (body.trackingConsent === true) {
      try {
        await trackStudyAbroadLead({
          name,
          email,
          phone,
          country,
          program: program || 'Not specified',
          message: message || ''
        }, source, request, undefined, body.metaEventId);
      } catch (trackingError) {
        console.error('Meta Conversion API tracking error:', trackingError);
        // Don't fail the request if tracking fails
      }
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Lead submitted successfully',
        leadId: lead.id 
      },
      { status: 201 }
    );
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

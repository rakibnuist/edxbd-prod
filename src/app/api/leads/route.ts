import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { routeLead } from '@/lib/lead-routing';
import { trackStudyAbroadLead } from '@/lib/meta-conversion-api';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import {
  getOptionalString,
  getRequiredDate,
  getRequiredString,
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
    const name = getRequiredString(body, 'name', 120);
    const email = getRequiredString(body, 'email', 254);
    const phone = getRequiredString(body, 'phone', 40);
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
        email: email.toLowerCase(),
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
        utm: body.utm ? JSON.stringify(body.utm) : null,
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

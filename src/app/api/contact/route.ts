import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
    name: 'contact-form',
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 32 * 1024);
    if (getOptionalString(body, 'companyWebsite', 200)) {
      return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
    }
    
    // Handle both name formats (single name field or firstName/lastName)
    let fullName: string;
    let firstName: string;
    let lastName: string;
    
    const submittedName = getOptionalString(body, 'name', 120);
    const submittedFirstName = getOptionalString(body, 'firstName', 60);
    const submittedLastName = getOptionalString(body, 'lastName', 60);

    if (submittedName) {
      // Single name field format
      fullName = submittedName;
      const nameParts = fullName.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    } else if (submittedFirstName && submittedLastName) {
      // Separate firstName/lastName format
      firstName = submittedFirstName;
      lastName = submittedLastName;
      fullName = `${firstName} ${lastName}`;
    } else {
      return NextResponse.json(
        { error: 'Missing required fields: name (or firstName and lastName), email, and phone are required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const email = getRequiredString(body, 'email', 254);
    const phone = getValidatedPhone(body);
    const message = getOptionalString(body, 'message', 4000);
    const country = getOptionalString(body, 'country', 120) || 'Not specified';
    const program = getOptionalString(body, 'program', 200) || 'Contact Form Inquiry';
    const source = getOptionalString(body, 'source', 100) || 'contact_form';
    const consentPolicyVersion = getRequiredString(body, 'consentPolicyVersion', 100);
    const consentTimestamp = getRequiredDate(body, 'consentTimestamp');
    const landingPage = getOptionalString(body, 'landingPage', 2048);
    
    if (!email || !phone || body.consent !== true || !body.consentTimestamp || !body.consentPolicyVersion) {
      return NextResponse.json(
        { error: 'Email, phone and recorded privacy consent are required' },
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
      where: {
        email: normalizedEmail,
        phone,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ message: 'Message already received', leadId: duplicate.id, duplicate: true }, { status: 200 });
    }

    const safeUtm = getSafeUtm(body.utm);

    // Create new lead from contact form using Prisma
    const lead = await prisma.lead.create({
      data: {
        name: fullName,
        email: normalizedEmail,
        phone,
        country,
        program,
        message: message || 'Consultation request from ' + country,
        source,
        status: 'new',
        consentTimestamp,
        consentPolicyVersion,
        landingPage,
        utm: safeUtm ? JSON.stringify(safeUtm) : null
      }
    });

    // Contact consent does not automatically authorize advertising tracking.
    if (body.trackingConsent === true) {
      try {
        trackStudyAbroadLead({
          name: fullName,
          email: normalizedEmail,
          phone,
          country,
          program,
          message: message || 'Consultation request from ' + country
        }, source, request, undefined, body.metaEventId).catch(trackingError => {
          console.error('Meta Conversion API tracking error (non-blocking):', trackingError);
        });
      } catch (trackingError) {
        console.error('Meta Conversion API tracking error:', trackingError);
        // Don't fail the request if tracking fails
      }
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        leadId: lead.id 
      },
      { status: 201 }
    );
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

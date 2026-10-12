import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trackPartnershipInquiry } from '@/lib/meta-conversion-api';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import {
  getOptionalString,
  getRequiredString,
  jsonBodyErrorResponse,
  readLimitedJson,
} from '@/lib/request-body';

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    name: 'partnership-form',
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 128 * 1024);
    const {
      // Company Information
      businessType,
      businessRegistrationNumber,
      businessLicense,
      website,
      yearsInBusiness,

      // Contact Information

      // Business Details
      partnershipType,
      targetCountries,
      currentClients,
      monthlyTarget,
      experience,
      currentPartners,

      // Financial Information
      annualRevenue,
      investmentCapacity,
      expectedCommission,

      // Marketing & Network
      marketingChannels,
      socialMediaPresence,
      localNetwork,
      referralSources,

      // Documents
      documents,

      // Additional Information
    } = body;

    const companyName = getOptionalString(body, 'companyName', 200);
    const contactPerson = getRequiredString(body, 'contactPerson', 120);
    const email = getRequiredString(body, 'email', 254).toLowerCase();
    const phone = getRequiredString(body, 'phone', 40);
    const alternatePhone = getOptionalString(body, 'alternatePhone', 40);
    const address = getRequiredString(body, 'address', 500);
    const city = getRequiredString(body, 'city', 100);
    const state = getRequiredString(body, 'state', 100);
    const country = getRequiredString(body, 'country', 100);
    const postalCode = getRequiredString(body, 'postalCode', 32);
    const motivation = getRequiredString(body, 'motivation', 4000);
    const expectations = getRequiredString(body, 'expectations', 4000);
    const additionalInfo = getOptionalString(body, 'additionalInfo', 4000);
    const source = getOptionalString(body, 'source', 100) || 'website';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = [
      'businessType', 'yearsInBusiness',
      'contactPerson', 'email', 'phone', 'address', 'city', 'state', 'country', 'postalCode',
      'partnershipType', 'targetCountries', 'currentClients', 'monthlyTarget', 'experience',
      'investmentCapacity', 'expectedCommission', 'marketingChannels', 'localNetwork',
      'referralSources', 'motivation', 'expectations'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create new partnership application using Prisma
    const partnership = await prisma.partnership.create({
      data: {
        // Company Information
        companyName,
        businessType,
        businessRegistrationNumber,
        businessLicense,
        website,
        yearsInBusiness: Number(yearsInBusiness),

        // Contact Information
        contactPerson,
        email,
        phone,
        alternatePhone,
        address,
        city,
        state,
        country,
        postalCode,

        // Business Details
        partnershipType,
        targetCountries: Array.isArray(targetCountries) ? JSON.stringify(targetCountries) : JSON.stringify([targetCountries].filter(Boolean)),
        currentClients: Number(currentClients),
        monthlyTarget: Number(monthlyTarget),
        experience,
        currentPartners: Array.isArray(currentPartners) ? JSON.stringify(currentPartners) : currentPartners ? JSON.stringify([currentPartners]) : null,

        // Financial Information
        annualRevenue,
        investmentCapacity,
        expectedCommission,

        // Marketing & Network
        marketingChannels: Array.isArray(marketingChannels) ? JSON.stringify(marketingChannels) : JSON.stringify([marketingChannels].filter(Boolean)),
        socialMediaPresence: typeof socialMediaPresence === 'object' ? JSON.stringify(socialMediaPresence) : socialMediaPresence,
        localNetwork,
        referralSources,

        // Documents
        documents: Array.isArray(documents) ? JSON.stringify(documents) : JSON.stringify([documents].filter(Boolean)),

        // Additional Information
        motivation,
        expectations,
        additionalInfo,

        // System Fields
        source,
        ipAddress,
        userAgent
      }
    });

    // Track partnership inquiry with Meta Conversion API
    try {
      await trackPartnershipInquiry({
        name: contactPerson,
        email: email,
        phone: phone,
        company: companyName,
        message: motivation
      }, request);
    } catch (trackingError) {
      console.error('Meta Conversion API tracking error:', trackingError);
      // Don't fail the request if tracking fails
    }

    // Send confirmation email (you can implement this later)
    // await sendPartnershipConfirmationEmail(partnership);

    return NextResponse.json(
      {
        message: 'Partnership application submitted successfully',
        id: partnership.id
      },
      { status: 201 }
    );

  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Partnership submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit partnership application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This is the public application-submission endpoint. Partnership records
  // contain personal, financial and operational data and must never be read
  // from here. Authenticated staff use /api/admin/partnerships instead.
  return NextResponse.json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        Allow: 'POST',
        'Cache-Control': 'no-store',
      },
    }
  );
}

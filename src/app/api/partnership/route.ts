import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trackPartnershipInquiry } from '@/lib/meta-conversion-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Company Information
      companyName,
      businessType,
      businessRegistrationNumber,
      businessLicense,
      website,
      yearsInBusiness,

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
      motivation,
      expectations,
      additionalInfo,

      // System Fields
      source = 'website'
    } = body;

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
    console.error('Partnership submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit partnership application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const partnershipType = searchParams.get('partnershipType');
    const country = searchParams.get('country');

    // Build filter object
    const where: any = {};
    if (status) where.status = status;
    if (partnershipType) where.partnershipType = partnershipType;
    if (country) where.country = country;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get partnerships with pagination
    const partnerships = await prisma.partnership.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Get total count
    const totalCount = await prisma.partnership.count({ where });

    return NextResponse.json({
      partnerships,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching partnerships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partnerships' },
      { status: 500 }
    );
  }
}

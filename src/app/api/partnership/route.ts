import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Partnership from '@/models/Partnership';
import { trackPartnershipInquiry } from '@/lib/meta-conversion-api';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    // Create new partnership application
    const partnership = new Partnership({
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
      source,
      ipAddress,
      userAgent
    });

    await partnership.save();

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
        id: partnership._id
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
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const partnershipType = searchParams.get('partnershipType');
    const country = searchParams.get('country');

    // Build filter object
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (partnershipType) filter.partnershipType = partnershipType;
    if (country) filter.country = country;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get partnerships with pagination
    const partnerships = await Partnership.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalCount = await Partnership.countDocuments(filter);

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

import { NextRequest, NextResponse, after } from 'next/server';
import { notifyB2BPartnerAlert } from '@/lib/alerts';
import { formatPartnershipTypeLabel } from '@/lib/b2b-catalog';
import prisma from '@/lib/prisma';
import { trackPartnershipInquiry } from '@/lib/meta-conversion-api';
import {
  applyMetaParamCookies,
  buildServerMetaParams,
  extractMetaParamOverridesFromBody,
} from '@/lib/meta-param-builder-server';
import {
  extractSanitizedClientIp,
  normalizeFlatRecord,
  normalizeSafeHttpUrl,
  normalizeStringList,
} from '@/lib/payload-validation';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import {
  getOptionalString,
  getRequiredDate,
  getRequiredString,
  jsonBodyErrorResponse,
  readLimitedJson,
} from '@/lib/request-body';

// Int columns: free-text answers like "5+" or "" become NaN with Number(), which
// Prisma rejects with a 500. Keep the leading whole number, else 0.
function toCount(value: unknown): number {
  const firstNumber = /\d+/.exec(String(value ?? ''))?.[0];
  return firstNumber ? Math.min(Number.parseInt(firstNumber, 10), 1_000_000) : 0;
}

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'partnership-form',
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 128 * 1024);

    // Numeric required counts (0 is valid and not empty)
    for (const countField of ['yearsInBusiness', 'currentClients', 'monthlyTarget'] as const) {
      if (body[countField] === undefined || body[countField] === null || body[countField] === '') {
        return NextResponse.json({ error: `Missing required field: ${countField}` }, { status: 400 });
      }
    }

    const companyName = getOptionalString(body, 'companyName', 200);
    const businessType = getRequiredString(body, 'businessType', 100);
    const businessRegistrationNumber = getOptionalString(body, 'businessRegistrationNumber', 100);
    const businessLicense = getOptionalString(body, 'businessLicense', 200);
    const websiteRes = normalizeSafeHttpUrl(body.website, 500);
    if (websiteRes.error) {
      return NextResponse.json({ error: websiteRes.error }, { status: 400 });
    }
    const yearsInBusiness = toCount(body.yearsInBusiness);

    const contactPerson = getRequiredString(body, 'contactPerson', 120);
    const email = getRequiredString(body, 'email', 254).toLowerCase();
    const phone = getRequiredString(body, 'phone', 40);
    const alternatePhone = getOptionalString(body, 'alternatePhone', 40);
    const address = getRequiredString(body, 'address', 500);
    const city = getRequiredString(body, 'city', 100);
    const state = getRequiredString(body, 'state', 100);
    const country = getRequiredString(body, 'country', 100);
    const postalCode = getRequiredString(body, 'postalCode', 32);

    const partnershipType = getRequiredString(body, 'partnershipType', 100);
    const currentClients = toCount(body.currentClients);
    const monthlyTarget = toCount(body.monthlyTarget);
    const experience = getRequiredString(body, 'experience', 2000);
    const annualRevenue = getOptionalString(body, 'annualRevenue', 100);
    const investmentCapacity = getRequiredString(body, 'investmentCapacity', 100);
    const expectedCommission = getRequiredString(body, 'expectedCommission', 100);
    const localNetwork = getRequiredString(body, 'localNetwork', 1000);

    const targetCountriesRes = normalizeStringList(body.targetCountries, 'targetCountries', 30, 100);
    if (targetCountriesRes.error || !targetCountriesRes.list?.length) {
      return NextResponse.json(
        { error: targetCountriesRes.error || 'Missing required field: targetCountries' },
        { status: 400 }
      );
    }

    const currentPartnersRes = normalizeStringList(body.currentPartners, 'currentPartners', 30, 120);
    if (currentPartnersRes.error) {
      return NextResponse.json({ error: currentPartnersRes.error }, { status: 400 });
    }

    const marketingChannelsRes = normalizeStringList(body.marketingChannels, 'marketingChannels', 30, 100);
    if (marketingChannelsRes.error || !marketingChannelsRes.list?.length) {
      return NextResponse.json(
        { error: marketingChannelsRes.error || 'Missing required field: marketingChannels' },
        { status: 400 }
      );
    }

    const socialMediaRes = normalizeFlatRecord(body.socialMediaPresence, 'socialMediaPresence', 10, 300);
    if (socialMediaRes.error) {
      return NextResponse.json({ error: socialMediaRes.error }, { status: 400 });
    }

    const referralSourcesRes = normalizeStringList(body.referralSources, 'referralSources', 30, 100);
    if (referralSourcesRes.error || !referralSourcesRes.list?.length) {
      return NextResponse.json(
        { error: referralSourcesRes.error || 'Missing required field: referralSources' },
        { status: 400 }
      );
    }

    const documentsRes = normalizeFlatRecord(body.documents, 'documents', 20, 500);
    if (documentsRes.error) {
      return NextResponse.json({ error: documentsRes.error }, { status: 400 });
    }

    const motivation = getRequiredString(body, 'motivation', 4000);
    const expectations = getRequiredString(body, 'expectations', 4000);
    const additionalInfo = getOptionalString(body, 'additionalInfo', 4000);
    const source = getOptionalString(body, 'source', 100) || 'website';
    const consentTimestamp = getRequiredDate(body, 'consentTimestamp');
    const consentPolicyVersion = getRequiredString(body, 'consentPolicyVersion', 100);

    if (body.consent !== true) {
      return NextResponse.json({ error: 'Recorded privacy consent is required' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const ipAddress = extractSanitizedClientIp((name) => request.headers.get(name));
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 500);

    // Create new partnership application using Prisma
    const partnership = await prisma.partnership.create({
      data: {
        // Company Information
        companyName,
        businessType,
        businessRegistrationNumber,
        businessLicense,
        website: websiteRes.url,
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
        targetCountries: JSON.stringify(targetCountriesRes.list),
        currentClients,
        monthlyTarget,
        experience,
        currentPartners: currentPartnersRes.list?.length ? JSON.stringify(currentPartnersRes.list) : null,

        // Financial Information
        annualRevenue,
        investmentCapacity,
        expectedCommission,

        // Marketing & Network
        marketingChannels: JSON.stringify(marketingChannelsRes.list),
        socialMediaPresence: socialMediaRes.json,
        localNetwork,
        referralSources: JSON.stringify(referralSourcesRes.list),

        // Documents
        documents: documentsRes.json,

        // Additional Information
        motivation,
        expectations,
        additionalInfo,

        // System Fields
        source,
        ipAddress,
        userAgent,
        consentTimestamp,
        consentPolicyVersion
      }
    });

    after(() =>
      notifyB2BPartnerAlert({
        id: partnership.id,
        companyName: companyName || contactPerson,
        contactPerson,
        phone,
        email,
        city,
        country,
        serviceTrackLabel: formatPartnershipTypeLabel(partnershipType),
        targetCountries: targetCountriesRes.list || [],
        monthlyTarget,
        priority: 'medium',
      }),
    );

    // Track partnership inquiry with Meta Conversion API only after explicit tracking consent
    const serverMetaParams =
      body.trackingConsent === true
        ? buildServerMetaParams(request, extractMetaParamOverridesFromBody(body))
        : null;

    if (serverMetaParams) {
      try {
        await trackPartnershipInquiry({
          name: contactPerson,
          email,
          phone,
          company: companyName,
          message: motivation,
          fbc: serverMetaParams.fbc,
          fbp: serverMetaParams.fbp,
          externalId: serverMetaParams.externalId,
          eventSourceUrl: serverMetaParams.eventSourceUrl,
        }, request);
      } catch (trackingError) {
        console.error('Meta Conversion API tracking error:', trackingError);
        // Don't fail the request if tracking fails
      }
    }

    // Send confirmation email (you can implement this later)
    // await sendPartnershipConfirmationEmail(partnership);

    const response = NextResponse.json(
      {
        message: 'Partnership application submitted successfully',
        id: partnership.id
      },
      { status: 201 }
    );
    return serverMetaParams
      ? applyMetaParamCookies(response, request, serverMetaParams.cookiesToSet)
      : response;

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

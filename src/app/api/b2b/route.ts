import { NextRequest, NextResponse, after } from 'next/server';
import { validateB2BInquiryInput } from '@/lib/b2b-catalog';
import {
  createB2BPartnerInquiry,
  getB2BServiceCatalog,
  recordB2BPartnerEffects,
} from '@/lib/b2b-service';
import { trackPartnershipInquiry } from '@/lib/meta-conversion-api';
import {
  applyMetaParamCookies,
  buildServerMetaParams,
  extractMetaParamOverridesFromBody,
} from '@/lib/meta-param-builder-server';
import { extractSanitizedClientIp } from '@/lib/payload-validation';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function GET() {
  const catalog = await getB2BServiceCatalog();
  return NextResponse.json(
    {
      service: 'eduexpress-b2b-partner-desk',
      catalog,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'b2b-inquiry',
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 64 * 1024);
    const validation = validateB2BInquiryInput(body);

    if (validation.isHoneypot) {
      return NextResponse.json(
        { message: 'B2B partner inquiry submitted successfully' },
        { status: 201 },
      );
    }

    if (!validation.data) {
      return NextResponse.json(
        { error: validation.error || 'Invalid B2B inquiry payload.' },
        { status: 400 },
      );
    }

    const inquiry = validation.data;
    const ipAddress = extractSanitizedClientIp((name) => request.headers.get(name));
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 500);

    const saved = await createB2BPartnerInquiry(inquiry, { ipAddress, userAgent });

    const serverMetaParams = inquiry.trackingConsent
      ? buildServerMetaParams(request, extractMetaParamOverridesFromBody(body))
      : null;

    if (saved.created) {
      after(() =>
        recordB2BPartnerEffects({
          id: saved.id,
          inquiry,
        }),
      );

      if (serverMetaParams) {
        after(() =>
          trackPartnershipInquiry(
            {
              name: inquiry.contactPerson,
              email: inquiry.email,
              phone: inquiry.phone,
              company: inquiry.companyName,
              message: inquiry.motivation,
              fbc: serverMetaParams.fbc,
              fbp: serverMetaParams.fbp,
              externalId: serverMetaParams.externalId,
              eventSourceUrl: serverMetaParams.eventSourceUrl,
            },
            request,
          ).catch((trackingError) => {
            console.error('Meta Conversion API B2B tracking error:', trackingError);
          }),
        );
      }
    }

    const response = NextResponse.json(
      {
        message: saved.created
          ? 'B2B partner inquiry submitted successfully'
          : 'B2B partner inquiry already received',
        id: saved.id,
        referenceCode: saved.referenceCode,
        priority: saved.priority,
        duplicate: !saved.created,
      },
      { status: saved.created ? 201 : 200 },
    );

    return inquiry.trackingConsent && serverMetaParams
      ? applyMetaParamCookies(response, request, serverMetaParams.cookiesToSet)
      : response;
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('B2B inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit B2B partner inquiry. Please try again.' },
      { status: 500 },
    );
  }
}

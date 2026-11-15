import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMetaConfig } from '@/lib/settings';
import { sendMetaEvents } from '@/lib/meta-api';
import { recordMetaDelivery } from '@/lib/meta-health';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { extractClientIp } from '@/lib/client-ip';
import {
    hashData,
    normalizeCountry,
    normalizeEmail,
    normalizePhone,
    normalizeText,
} from '@/lib/meta-conversion-api';
import {
    applyMetaParamCookies,
    buildServerMetaParams,
    extractMetaParamOverridesFromBody,
    PII_DATA_TYPE,
} from '@/lib/meta-param-builder-server';
import {
    classifyRequestOrigin,
    pickCustomData,
    resolveAllowedOriginHosts,
    resolveCanonicalEventSourceUrl,
    resolveCapiEvent,
} from '@/lib/meta-capi-policy';
import {
    getOptionalString,
    getRequiredString,
    jsonBodyErrorResponse,
    readLimitedJson,
} from '@/lib/request-body';

interface ConversionsAPIEvent {
    event_name: string;
    event_time: number;
    event_id: string;
    event_source_url: string;
    action_source: string;
    user_data: {
        client_ip_address?: string;
        client_user_agent?: string;
        fbp?: string;
        fbc?: string;
        external_id?: string;
        em?: string; // hashed email
        ph?: string; // hashed phone
        fn?: string; // hashed first name
        ln?: string; // hashed last name
        ct?: string; // hashed city
        st?: string; // hashed state
        zp?: string; // hashed zip
        country?: string; // hashed country
    };
    custom_data?: Record<string, string | number | boolean>;
}

export async function POST(request: NextRequest) {
    const rateLimit = await checkRateLimit(request, {
        name: 'meta-capi',
        maxRequests: 60,
        windowMs: 60 * 1000,
        persistent: false,
    });
    if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

    try {
        const body = await readLimitedJson(request, 32 * 1024);
        const eventNameInput = getRequiredString(body, body.event_name ? 'event_name' : 'eventType', 64);
        const event = resolveCapiEvent(eventNameInput);
        if (!event) {
            return NextResponse.json(
                { error: 'Unsupported conversion event' },
                { status: 400 }
            );
        }

        // Only pages on this site may report visitor events; value and
        // outcome events need an admin session/token (as /api/meta-conversion).
        const origin = classifyRequestOrigin(
            request.headers,
            resolveAllowedOriginHosts(request.headers.get('host')),
        );
        if (origin === 'cross-site') {
            return NextResponse.json({ error: 'Cross-site conversion events are not accepted' }, { status: 403 });
        }
        const isAdmin = Boolean(await verifyLiveAdminUser(request));
        if (event.access === 'admin' && !isAdmin) {
            return NextResponse.json({ error: 'Admin access is required for this event' }, { status: 403 });
        }
        if (origin === 'unknown' && !isAdmin) {
            return NextResponse.json({ error: 'Conversion events must come from the site' }, { status: 403 });
        }

        if (body.trackingConsent !== true) {
            return NextResponse.json({ error: 'Advertising consent required' }, { status: 403 });
        }

        const eventId = getOptionalString(body, body.event_id ? 'event_id' : 'eventId', 200) ||
            `server_${Date.now()}_${crypto.randomUUID()}`;
        const nestedData = body.data && typeof body.data === 'object' && !Array.isArray(body.data) ? body.data : null;
        const eventSourceUrl = body.event_source_url || nestedData?.event_source_url || nestedData?.page_location;
        const directUserData = body.user_data;
        const nestedUserData = nestedData?.userData;
        const userData = directUserData && typeof directUserData === 'object' && !Array.isArray(directUserData)
            ? directUserData
            : nestedUserData && typeof nestedUserData === 'object' && !Array.isArray(nestedUserData)
                ? nestedUserData
                : {};
        const customData = pickCustomData(
            body.custom_data && typeof body.custom_data === 'object' && !Array.isArray(body.custom_data)
                ? body.custom_data
                : nestedData,
            event.access,
        );

        // DB-configured values take precedence over env (admin can set without a rebuild).
        const { pixelId, accessToken } = await getMetaConfig();

        if (!pixelId || !accessToken) {
            console.error('Meta Pixel ID or Access Token not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get client IP and user agent from headers
        const clientIp = extractClientIp((name) => request.headers.get(name)) ?? undefined;
        const userAgent = request.headers.get('user-agent') || undefined;

        const bodyOverrides = extractMetaParamOverridesFromBody(
            body as Record<string, unknown>,
            userData as Record<string, unknown>,
        );
        const serverMetaParams = buildServerMetaParams(request, {
            ...bodyOverrides,
            ...(typeof eventSourceUrl === 'string' && eventSourceUrl.trim()
                ? { eventSourceUrl: eventSourceUrl.trim() }
                : {}),
        });

        const cleanEmail = normalizeEmail(getOptionalString(userData, 'email', 254));
        const cleanPhone = normalizePhone(getOptionalString(userData, 'phone', 40));
        const cleanFn = normalizeText(getOptionalString(userData, 'firstName', 100));
        const cleanLn = normalizeText(getOptionalString(userData, 'lastName', 100));
        const cleanCt = normalizeText(getOptionalString(userData, 'city', 100));
        const cleanSt = normalizeText(getOptionalString(userData, 'state', 100));
        const cleanZp = getOptionalString(userData, 'zipCode', 32)?.replace(/\s+/g, '').toLowerCase();
        const cleanCountry = normalizeCountry(getOptionalString(userData, 'country', 100));

        // Build the event payload with Parameter Builder normalized & hashed PII
        const eventPayload: ConversionsAPIEvent = {
            event_name: event.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: resolveCanonicalEventSourceUrl(eventSourceUrl || serverMetaParams.eventSourceUrl),
            action_source: 'website', // Required parameter
            user_data: {
                client_ip_address: serverMetaParams.clientIpAddress ?? clientIp,
                client_user_agent: userAgent,
                fbp: serverMetaParams.fbp,
                fbc: serverMetaParams.fbc,
                external_id: serverMetaParams.externalId
                    ? (serverMetaParams.hashPii(serverMetaParams.externalId, PII_DATA_TYPE.EXTERNAL_ID) ??
                        hashData(serverMetaParams.externalId))
                    : undefined,
                // Hash PII data per Meta's Customer Information Parameters requirements
                em: cleanEmail
                    ? (serverMetaParams.hashPii(cleanEmail, PII_DATA_TYPE.EMAIL) ?? hashData(cleanEmail))
                    : undefined,
                ph: cleanPhone
                    ? (serverMetaParams.hashPii(cleanPhone, PII_DATA_TYPE.PHONE) ?? hashData(cleanPhone))
                    : undefined,
                fn: cleanFn
                    ? (serverMetaParams.hashPii(cleanFn, PII_DATA_TYPE.FIRST_NAME) ?? hashData(cleanFn))
                    : undefined,
                ln: cleanLn
                    ? (serverMetaParams.hashPii(cleanLn, PII_DATA_TYPE.LAST_NAME) ?? hashData(cleanLn))
                    : undefined,
                ct: cleanCt
                    ? (serverMetaParams.hashPii(cleanCt, PII_DATA_TYPE.CITY) ?? hashData(cleanCt))
                    : undefined,
                st: cleanSt
                    ? (serverMetaParams.hashPii(cleanSt, PII_DATA_TYPE.STATE) ?? hashData(cleanSt))
                    : undefined,
                zp: cleanZp
                    ? (serverMetaParams.hashPii(cleanZp, PII_DATA_TYPE.ZIP_CODE) ?? hashData(cleanZp))
                    : undefined,
                country: cleanCountry
                    ? (serverMetaParams.hashPii(cleanCountry, PII_DATA_TYPE.COUNTRY) ?? hashData(cleanCountry))
                    : undefined,
            },
            custom_data: customData,
        };

        const config = { pixelId, accessToken };
        const result = await sendMetaEvents(config, [eventPayload]);
        await recordMetaDelivery(config, result);
        if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
        const response = NextResponse.json({
            success: true,
            event_id: eventId,
            meta_response: { events_received: result.eventsReceived },
        });
        return applyMetaParamCookies(response, request, serverMetaParams.cookiesToSet);

    } catch (error) {
        const bodyError = jsonBodyErrorResponse(error);
        if (bodyError) return bodyError;
        console.error('Conversions API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

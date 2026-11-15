import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMetaConfig } from '@/lib/settings';
import { sendMetaEvents } from '@/lib/meta-api';
import { recordMetaDelivery } from '@/lib/meta-health';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { extractClientIp } from '@/lib/client-ip';
import {
    classifyRequestOrigin,
    pickCustomData,
    resolveAllowedOriginHosts,
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

// SHA256 hashing function for PII
function hashData(data: string | undefined): string | undefined {
    if (!data) return undefined;
    return crypto.createHash('sha256').update(data).digest('hex');
}

function hashEmail(email: string | undefined): string | undefined {
    if (!email) return undefined;
    return hashData(email.trim().toLowerCase());
}

function hashPhone(phone: string | undefined): string | undefined {
    if (!phone) return undefined;
    let digits = phone.replace(/\D/g, '');
    if (!digits) return undefined;
    if (digits.startsWith('01') && digits.length === 11) {
        digits = `880${digits.slice(1)}`;
    } else if (!digits.startsWith('880') && digits.length === 10 && digits.startsWith('1')) {
        digits = `880${digits}`;
    }
    return hashData(digits);
}

const COUNTRY_CODE_MAP: Record<string, string> = {
    bangladesh: 'bd',
    china: 'cn',
    uk: 'gb',
    'united kingdom': 'gb',
    malaysia: 'my',
    hungary: 'hu',
    'south korea': 'kr',
    korea: 'kr',
    finland: 'fi',
    malta: 'mt',
    cyprus: 'cy',
    georgia: 'ge',
    greece: 'gr',
    croatia: 'hr',
    thailand: 'th',
    usa: 'us',
    'united states': 'us',
    canada: 'ca',
    australia: 'au',
};

function hashCountry(country: string | undefined): string | undefined {
    if (!country) return undefined;
    const clean = country.trim().toLowerCase();
    const code = clean.length === 2 ? clean : (COUNTRY_CODE_MAP[clean] || clean.slice(0, 2));
    return hashData(code);
}

function hashText(text: string | undefined): string | undefined {
    if (!text) return undefined;
    const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    return hashData(normalized);
}

function trustedEventSource(value: unknown): string {
    if (typeof value !== 'string' || value.length > 2048) return 'https://eduexpressint.com';
    try {
        const url = new URL(value);
        if (url.protocol === 'https:' && ['eduexpressint.com', 'www.eduexpressint.com'].includes(url.hostname)) {
            return url.toString();
        }
    } catch {
        // Fall back to the canonical site URL for malformed or untrusted sources.
    }
    return 'https://eduexpressint.com';
}

function extractCookieFromHeader(cookieHeader: string | null, name: string): string | undefined {
    if (!cookieHeader) return undefined;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
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

        const cookieHeader = request.headers.get('cookie');
        const fbp = getOptionalString(userData, 'fbp', 255) || extractCookieFromHeader(cookieHeader, '_fbp');
        let fbc = getOptionalString(userData, 'fbc', 255) || extractCookieFromHeader(cookieHeader, '_fbc');
        if (!fbc) {
            try {
                const url = new URL(request.url);
                const fbclid = url.searchParams.get('fbclid');
                if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
            } catch {
                /* ignore */
            }
        }
        const externalId = getOptionalString(userData, 'external_id', 255) || extractCookieFromHeader(cookieHeader, 'ee_uid');

        // Build the event payload with hashed PII
        const eventPayload: ConversionsAPIEvent = {
            event_name: event.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: trustedEventSource(eventSourceUrl),
            action_source: 'website', // Required parameter
            user_data: {
                client_ip_address: clientIp,
                client_user_agent: userAgent,
                fbp: fbp,
                fbc: fbc,
                external_id: externalId ? hashData(externalId) : undefined,
                // Hash PII data per Meta's Customer Information Parameters requirements
                em: hashEmail(getOptionalString(userData, 'email', 254)),
                ph: hashPhone(getOptionalString(userData, 'phone', 40)),
                fn: hashText(getOptionalString(userData, 'firstName', 100)),
                ln: hashText(getOptionalString(userData, 'lastName', 100)),
                ct: hashText(getOptionalString(userData, 'city', 100)),
                st: hashText(getOptionalString(userData, 'state', 100)),
                zp: hashData(getOptionalString(userData, 'zipCode', 32)?.replace(/\s+/g, '').toLowerCase()),
                country: hashCountry(getOptionalString(userData, 'country', 100)),
            },
            custom_data: customData,
        };

        const config = { pixelId, accessToken };
        const result = await sendMetaEvents(config, [eventPayload]);
        await recordMetaDelivery(config, result);
        if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
        return NextResponse.json({ success: true, event_id: eventId, meta_response: { events_received: result.eventsReceived } });

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

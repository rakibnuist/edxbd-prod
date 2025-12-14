import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
    custom_data?: Record<string, any>;
}

// SHA256 hashing function for PII
function hashData(data: string | undefined): string | undefined {
    if (!data) return undefined;
    // Normalize: lowercase and trim
    const normalized = data.toLowerCase().trim();
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event_name, event_id, event_source_url, user_data, custom_data } = body;

        // Validate required fields
        if (!event_name || !event_id) {
            return NextResponse.json(
                { error: 'Missing required fields: event_name, event_id' },
                { status: 400 }
            );
        }

        const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
        const accessToken = process.env.META_ACCESS_TOKEN;

        if (!pixelId || !accessToken) {
            console.error('Meta Pixel ID or Access Token not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Get client IP and user agent from headers
        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            undefined;
        const userAgent = request.headers.get('user-agent') || undefined;

        // Build the event payload with hashed PII
        const eventPayload: ConversionsAPIEvent = {
            event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id,
            event_source_url: event_source_url || 'https://eduexpressint.com',
            action_source: 'website', // Required parameter
            user_data: {
                client_ip_address: clientIp,
                client_user_agent: userAgent,
                fbp: user_data?.fbp,
                fbc: user_data?.fbc,
                external_id: user_data?.external_id,
                // Hash PII data per Meta's requirements
                em: hashData(user_data?.email),
                ph: hashData(user_data?.phone),
                fn: hashData(user_data?.firstName),
                ln: hashData(user_data?.lastName),
                ct: hashData(user_data?.city),
                st: hashData(user_data?.state),
                zp: hashData(user_data?.zipCode),
                country: hashData(user_data?.country),
            },
            custom_data: custom_data || {},
        };

        // Send to Meta Conversions API
        const metaApiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`;

        const metaResponse = await fetch(metaApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: [eventPayload],
                test_event_code: process.env.NODE_ENV === 'development' ? 'TEST12345' : undefined,
            }),
        });

        const metaData = await metaResponse.json();

        if (!metaResponse.ok) {
            console.error('Meta API Error:', metaData);
            return NextResponse.json(
                { error: 'Failed to send event to Meta', details: metaData },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            event_id,
            meta_response: metaData,
        });

    } catch (error) {
        console.error('Conversions API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

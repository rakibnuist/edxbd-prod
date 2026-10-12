import { NextRequest, NextResponse } from 'next/server';
import { getMetaConfig } from '@/lib/settings';
import { isAdminRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { error: 'Admin access is required.' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    // DB-configured values (from the admin Settings page) take precedence,
    // with environment variables as the fallback.
    const { pixelId, accessToken } = await getMetaConfig();

    const pixelActive = !!pixelId;
    const conversionApiActive = !!accessToken;

    return NextResponse.json({
      pixelId,
      accessTokenConfigured: !!accessToken,
      pixelActive,
      conversionApiActive,
      eventsTracked: 0, // This would need to be fetched from Meta API in a real implementation
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking Meta status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check Meta status',
        pixelId: null,
        accessTokenConfigured: false,
        pixelActive: false,
        conversionApiActive: false,
        eventsTracked: 0
      },
      { status: 500 }
    );
  }
}

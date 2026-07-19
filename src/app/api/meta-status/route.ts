import { NextResponse } from 'next/server';
import { getMetaConfig } from '@/lib/settings';

export async function GET() {
  try {
    // DB-configured values (from the admin Settings page) take precedence,
    // with environment variables as the fallback.
    const { pixelId, accessToken } = await getMetaConfig();

    const pixelActive = !!pixelId;
    const conversionApiActive = !!accessToken;

    return NextResponse.json({
      pixelId,
      accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null, // Show partial token for security
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
        accessToken: null,
        pixelActive: false,
        conversionApiActive: false,
        eventsTracked: 0
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getPublicTagConfig } from '@/lib/settings';

// Public, non-sensitive tag IDs (Meta Pixel, GTM, GA4). Consumed by the
// client-side tag loaders so the admin can change them without a rebuild.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getPublicTagConfig();
    return NextResponse.json(config, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' },
    });
  } catch {
    return NextResponse.json({ metaPixelId: null, gtmId: null, ga4Id: null });
  }
}

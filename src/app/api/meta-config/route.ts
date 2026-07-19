import { NextResponse } from 'next/server';
import { getMetaConfig } from '@/lib/settings';

// Public endpoint: exposes ONLY the Meta Pixel ID (which is public by design —
// it appears in the browser pixel script anyway). The access token is never
// returned here. Consumed by the client-side pixel loader at runtime so the
// admin can change the Pixel ID without a rebuild.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { pixelId } = await getMetaConfig();
    const valid = pixelId && pixelId !== '1234567890' ? pixelId : null;
    return NextResponse.json(
      { pixelId: valid },
      { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } }
    );
  } catch {
    return NextResponse.json({ pixelId: null });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import { getAllSettings, saveSettings } from '@/lib/settings';

const MASK = '••••••••';

// Mask secrets before sending to the client; expose a boolean "isSet" instead.
function presentForClient(settings: Record<string, string>) {
  const accessToken = settings.metaAccessToken || '';
  return {
    ...settings,
    metaAccessToken: accessToken ? MASK : '',
    metaAccessTokenSet: !!accessToken,
    metaPixelIdSet: !!settings.metaPixelId,
  };
}

export async function GET(request: NextRequest) {
  const decoded = verifyTokenFromRequest(request);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
  }
  try {
    const settings = await getAllSettings();
    return NextResponse.json(presentForClient(settings));
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const decoded = verifyTokenFromRequest(request);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
  }
  try {
    const body = await request.json();
    // Never overwrite the token when the client sent back the mask (unchanged field).
    if (body.metaAccessToken === MASK || body.metaAccessToken === '') {
      delete body.metaAccessToken;
    }
    await saveSettings(body);
    const settings = await getAllSettings();
    return NextResponse.json({ ok: true, settings: presentForClient(settings) });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

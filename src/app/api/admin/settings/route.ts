import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyTokenFromRequest } from '@/lib/auth';
import { DEFAULT_META_PIXEL_ID, getAllSettings, saveSettings, validateSettings } from '@/lib/settings';

const MASK = '••••••••';

// Mask secrets before sending to the client; expose a boolean "isSet" instead.
function presentForClient(settings: Record<string, string>) {
  const accessToken = settings.metaAccessToken || process.env.META_ACCESS_TOKEN || '';
  const environmentPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
  const effectivePixelId = settings.metaPixelId || environmentPixelId || DEFAULT_META_PIXEL_ID;
  return {
    ...settings,
    metaAccessToken: accessToken ? MASK : '',
    metaAccessTokenSet: !!accessToken,
    metaPixelIdSet: !!effectivePixelId,
    metaPixelIdSource: settings.metaPixelId ? 'settings' : environmentPixelId ? 'environment' : 'default',
  };
}

const isAdmin = (role?: string) => role === 'admin' || role === 'super_admin';

export async function GET(request: NextRequest) {
  const decoded = verifyTokenFromRequest(request);
  if (!decoded || !isAdmin(decoded.role)) {
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
  if (!decoded || !isAdmin(decoded.role)) {
    return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
  }
  try {
    const body = await request.json();
    // Never overwrite the token when the client sent back the mask (unchanged field).
    if (body.metaAccessToken === MASK || body.metaAccessToken === '') {
      delete body.metaAccessToken;
    }
    const validated = validateSettings(body);
    if (!validated.values) {
      return NextResponse.json({ error: validated.error || 'Invalid settings.' }, { status: 400 });
    }
    await saveSettings(validated.values);
    revalidatePath('/');
    const settings = await getAllSettings();
    return NextResponse.json({ ok: true, settings: presentForClient(settings) });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { getMetaConfig } from '@/lib/settings';
import { getMetaHealth, recordMetaConnection } from '@/lib/meta-health';
import { verifyMetaDataset } from '@/lib/meta-api';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';

const headers = { 'Cache-Control': 'no-store, private' };
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Admin access is required.' }, { status: 403, headers });
  try { return NextResponse.json(await getMetaHealth(), { headers }); }
  catch { return NextResponse.json({ error: 'Could not load Meta connection status. Please retry.' }, { status: 503, headers }); }
}
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Admin access is required.' }, { status: 403, headers });
  const limit = checkRateLimit(request, { name: 'meta-connection-check', maxRequests: 6, windowMs: 60000 });
  if (!limit.allowed) return rateLimitExceeded(limit);
  try {
    const config = await getMetaConfig();
    const result = await verifyMetaDataset(config);
    if (config.accessToken && config.pixelId) await recordMetaConnection(config, result);
    return NextResponse.json({ ...await getMetaHealth(), check: result }, { headers });
  } catch { return NextResponse.json({ error: 'Could not check Meta. Please retry.' }, { status: 503, headers }); }
}

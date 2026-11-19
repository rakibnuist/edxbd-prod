import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { distributeUnassignedLeads } from '@/lib/crm-operations';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 8 * 1024).catch(() => ({} as Record<string, unknown>));
    const scope = body.scope === 'all_active' ? 'all_active' : 'new';

    const result = await distributeUnassignedLeads({
      scope,
      actorName: decoded.email,
      actorUserId: decoded.userId,
    });

    return NextResponse.json(
      { ok: true, scope, ...result },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to auto-assign leads.' }, { status: 500 });
  }
}

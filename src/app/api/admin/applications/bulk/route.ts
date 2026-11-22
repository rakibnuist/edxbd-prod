import { NextRequest, NextResponse } from 'next/server';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { ALLOWED_TRACKER_STAGE_KEYS, deriveLeadStatusFromStage } from '@/lib/application-tracker';
import prisma from '@/lib/prisma';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, private' };

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const action = typeof body.action === 'string' ? body.action.trim() : '';
    const rawIds = Array.isArray(body.ids) ? body.ids : [];
    const ids = Array.from(
      new Set(
        rawIds
          .filter((v): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= 64)
          .map((v) => v.trim()),
      ),
    ).slice(0, 100);

    if (ids.length === 0) {
      return NextResponse.json({ error: 'Select at least one application.' }, { status: 400, headers: NO_STORE_HEADERS });
    }

    if (action === 'delete') {
      const result = await prisma.lead.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ ok: true, deleted: result.count }, { headers: NO_STORE_HEADERS });
    }

    if (action === 'set_stage') {
      const stage = typeof body.stage === 'string' ? body.stage.trim().toLowerCase() : '';
      if (!ALLOWED_TRACKER_STAGE_KEYS.has(stage)) {
        return NextResponse.json({ error: `Unsupported stage "${stage}".` }, { status: 400, headers: NO_STORE_HEADERS });
      }
      const nextStatus = deriveLeadStatusFromStage(stage);
      const result = await prisma.lead.updateMany({
        where: { id: { in: ids } },
        data: {
          applicationStage: stage,
          status: nextStatus,
          isApplication: true,
        },
      });
      return NextResponse.json({ ok: true, updated: result.count, stage }, { headers: NO_STORE_HEADERS });
    }

    if (action === 'set_embassy') {
      const embassyStatus = typeof body.embassyStatus === 'string' ? body.embassyStatus.trim().slice(0, 40) : '';
      if (!embassyStatus) {
        return NextResponse.json({ error: 'Embassy status is required.' }, { status: 400, headers: NO_STORE_HEADERS });
      }
      const result = await prisma.lead.updateMany({
        where: { id: { in: ids } },
        data: { embassyStatus },
      });
      return NextResponse.json({ ok: true, updated: result.count, embassyStatus }, { headers: NO_STORE_HEADERS });
    }

    return NextResponse.json({ error: 'Unsupported bulk action.' }, { status: 400, headers: NO_STORE_HEADERS });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('[applications/bulk POST]', error);
    return NextResponse.json(
      { error: 'Bulk operation failed.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

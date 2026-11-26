import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { toSafeExternalUrl } from '@/lib/safe-url';

export const dynamic = 'force-dynamic';

const JSON_HEADERS = { 'Cache-Control': 'no-store' };
const VALID_ENTITY_TYPES = new Set(['university', 'program', 'scholarship', 'fee', 'country_policy']);
const VALID_STATUSES = new Set(['active', 'changed_needs_review', 'broken_link', 'paused']);

/**
 * Admin-only Private Source Watch API (Tier-2 Hidden Sources).
 * Strictly gated behind live admin session authentication and `Cache-Control: no-store`.
 */
export async function GET(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.trim() || '';
    const entityType = searchParams.get('entityType')?.trim() || '';
    const country = searchParams.get('country')?.trim() || '';
    const q = searchParams.get('q')?.trim() || '';
    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit') || 150) || 150));

    const where: Record<string, unknown> = {};
    if (status && VALID_STATUSES.has(status)) where.status = status;
    if (entityType && VALID_ENTITY_TYPES.has(entityType)) where.entityType = entityType;
    if (country) where.country = { contains: country };
    if (q) {
      where.OR = [
        { entityLabel: { contains: q } },
        { watchKey: { contains: q } },
        { authorityLabel: { contains: q } },
        { sourceUrl: { contains: q } },
        { country: { contains: q } },
      ];
    }

    const [items, counts, entityCounts, totalMatched] = await Promise.all([
      prisma.internalSourceWatch.findMany({
        where,
        orderBy: [{ status: 'asc' }, { lastChangedAt: 'desc' }, { updatedAt: 'desc' }],
        take: limit,
      }),
      prisma.internalSourceWatch.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.internalSourceWatch.groupBy({
        by: ['entityType'],
        _count: { _all: true },
      }),
      prisma.internalSourceWatch.count({ where }),
    ]);

    const summary = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
    const byEntityType = Object.fromEntries(entityCounts.map((c) => [c.entityType, c._count._all]));
    const totalAll = counts.reduce((acc, c) => acc + c._count._all, 0);
    return NextResponse.json(
      { summary, byEntityType, totalAll, totalMatched, totalReturned: items.length, items },
      { headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error('Failed to list InternalSourceWatch:', error);
    return NextResponse.json(
      { error: 'Failed to load private source watches.' },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

export async function POST(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const body = await readLimitedJson(request, 64 * 1024);
    const watchKey = typeof body.watchKey === 'string' ? body.watchKey.trim().slice(0, 180) : '';
    const entityType = typeof body.entityType === 'string' ? body.entityType.trim() : '';
    const entityId = typeof body.entityId === 'string' ? body.entityId.trim().slice(0, 120) : '';
    const entityLabel = typeof body.entityLabel === 'string' ? body.entityLabel.trim().slice(0, 240) : '';
    const authorityLabel = typeof body.authorityLabel === 'string' ? body.authorityLabel.trim().slice(0, 160) : 'Official Institutional Notice';
    const safeUrl = toSafeExternalUrl(typeof body.sourceUrl === 'string' ? body.sourceUrl : '');
    const country = typeof body.country === 'string' && body.country.trim() ? body.country.trim().slice(0, 80) : null;
    const checkIntervalDays = Math.min(365, Math.max(1, Number(body.checkIntervalDays || 30) || 30));
    const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 1000) : null;

    if (!watchKey || !VALID_ENTITY_TYPES.has(entityType) || !entityId || !entityLabel || !safeUrl) {
      return NextResponse.json(
        { error: 'watchKey, valid entityType, entityId, entityLabel, and a valid https:// sourceUrl are required.' },
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const record = await prisma.internalSourceWatch.upsert({
      where: { watchKey },
      create: {
        watchKey,
        entityType,
        entityId,
        entityLabel,
        country,
        sourceUrl: safeUrl,
        authorityLabel,
        checkIntervalDays,
        notes,
        status: 'active',
      },
      update: {
        entityType,
        entityId,
        entityLabel,
        country,
        sourceUrl: safeUrl,
        authorityLabel,
        checkIntervalDays,
        notes,
      },
    });

    return NextResponse.json({ ok: true, item: record }, { status: 201, headers: JSON_HEADERS });
  } catch (error) {
    const jsonErr = jsonBodyErrorResponse(error);
    if (jsonErr) return jsonErr;
    console.error('Failed to upsert InternalSourceWatch:', error);
    return NextResponse.json({ error: 'Failed to save source watch.' }, { status: 500, headers: JSON_HEADERS });
  }
}

export async function PATCH(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const body = await readLimitedJson(request, 64 * 1024);
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400, headers: JSON_HEADERS });
    }

    const existing = await prisma.internalSourceWatch.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Source watch not found.' }, { status: 404, headers: JSON_HEADERS });
    }

    const data: Record<string, unknown> = {};
    if (body.action === 'mark_reviewed') {
      data.status = 'active';
      data.reviewedAt = new Date();
      data.reviewedBy = decoded.email || 'admin';
      data.diffSummary = null;
    } else {
      if (typeof body.status === 'string' && VALID_STATUSES.has(body.status)) {
        data.status = body.status;
      }
      if (typeof body.sourceUrl === 'string') {
        const safeUrl = toSafeExternalUrl(body.sourceUrl);
        if (!safeUrl) {
          return NextResponse.json({ error: 'Invalid sourceUrl.' }, { status: 400, headers: JSON_HEADERS });
        }
        data.sourceUrl = safeUrl;
      }
      if (typeof body.checkIntervalDays === 'number' && Number.isFinite(body.checkIntervalDays)) {
        data.checkIntervalDays = Math.min(365, Math.max(1, Math.round(body.checkIntervalDays)));
      }
      if (typeof body.notes === 'string') {
        data.notes = body.notes.trim().slice(0, 1000) || null;
      }
    }

    const updated = await prisma.internalSourceWatch.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item: updated }, { headers: JSON_HEADERS });
  } catch (error) {
    const jsonErr = jsonBodyErrorResponse(error);
    if (jsonErr) return jsonErr;
    console.error('Failed to update InternalSourceWatch:', error);
    return NextResponse.json({ error: 'Failed to update source watch.' }, { status: 500, headers: JSON_HEADERS });
  }
}

import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function authorised(provided: string | null) {
  const expected = process.env.REVALIDATE_SECRET || process.env.JWT_SECRET || '';
  if (!expected || !provided) return false;
  const given = Buffer.from(provided);
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/**
 * Marks every prerendered page stale so it re-renders from the live database.
 * The production image is built without a database, so docker-entrypoint.sh
 * calls this once the server is up (see docker-warm-cache.mjs).
 */
export async function POST(request: Request) {
  if (!authorised(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true }, { headers: { 'Cache-Control': 'no-store' } });
}

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { isAuthorizedRevalidateSecret } from '@/lib/revalidate-secret';

export const dynamic = 'force-dynamic';

/**
 * Marks every prerendered page stale so it re-renders from the live database.
 * The production image is built without a database, so docker-entrypoint.sh
 * calls this once the server is up (see docker-warm-cache.mjs).
 */
export async function POST(request: Request) {
  if (!isAuthorizedRevalidateSecret(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true }, { headers: { 'Cache-Control': 'no-store' } });
}

import { NextResponse } from 'next/server';
import { buildPublicUniversityDetail } from '@/lib/calculator-public';
import { getUniversityRoute } from '@/lib/university-records';

export const revalidate = 3600;

/**
 * Public Zero-Leak University Cost & Scholarship Endpoint for the Embeddable Calculator.
 * Scales seamlessly to 1,000+ universities without inflating initial iframe HTML.
 * Strictly omits all private deep source URLs (2-Tier Hybrid Model).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const cleanSlug = (slug || '').trim().toLowerCase();
  if (!cleanSlug || cleanSlug.length > 140 || !/^[a-z0-9-]+$/.test(cleanSlug)) {
    return NextResponse.json({ error: 'Invalid university slug.' }, { status: 400 });
  }

  try {
    const resolved = await getUniversityRoute(cleanSlug);
    if (!resolved?.record || !resolved.record.isActive) {
      return NextResponse.json({ error: 'University not found.' }, { status: 404 });
    }

    const detail = buildPublicUniversityDetail(resolved.record, new Date());
    return NextResponse.json(detail, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('calculator-university API error:', error);
    return NextResponse.json({ error: 'Unable to load university cost details.' }, { status: 500 });
  }
}

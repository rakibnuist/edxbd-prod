import { NextRequest, NextResponse } from 'next/server';
import { normalizeFitProfileInput } from '@/lib/fit-matcher';
import { generateGroundedFitPreview } from '@/lib/gemini-fit';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-fit-preview',
    maxRequests: 25,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const body = await readLimitedJson(request, 16 * 1024);
    const validated = normalizeFitProfileInput(body);
    if (!validated.data) {
      return NextResponse.json(
        { error: validated.error || 'Invalid assessment profile.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const preview = await generateGroundedFitPreview(validated.data);
    return NextResponse.json(preview, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;

    console.error('Fit preview error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Unable to prepare your route preview right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

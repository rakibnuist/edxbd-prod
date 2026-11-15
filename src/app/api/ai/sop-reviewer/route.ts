import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { readLimitedJson } from '@/lib/request-body';
import { normalizeSopReviewRequest } from '@/lib/sop-reviewer';
import { evaluateSopWithGemini } from '@/lib/gemini-sop-reviewer';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-sop-reviewer',
    maxRequests: 25,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const rawBody = await readLimitedJson(request, 32 * 1024);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body: expected JSON object.' }, { status: 400 });
    }

    const reviewRequest = normalizeSopReviewRequest(rawBody);
    const result = await evaluateSopWithGemini(reviewRequest);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, private',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to evaluate statement of purpose.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

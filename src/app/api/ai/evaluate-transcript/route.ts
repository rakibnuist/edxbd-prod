import { NextRequest, NextResponse } from 'next/server';
import { evaluateTranscriptImage } from '@/lib/gemini-transcript';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-transcript-eval',
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please upload an image file of your academic transcript or marksheet.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Please upload a JPG, PNG, or WebP marksheet image.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Image size exceeds the 8 MB limit.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const targetLevel = String(formData.get('targetLevel') || '');
    const targetSubject = String(formData.get('targetSubject') || '');
    const language = formData.get('language') === 'bn' ? 'bn' : 'en';

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await evaluateTranscriptImage(buffer, file.type, {
      targetLevel: targetLevel || undefined,
      targetSubject: targetSubject || undefined,
      language,
    });

    return NextResponse.json(
      { success: true, result },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error(
      'Transcript evaluation route error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Unable to evaluate transcript right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

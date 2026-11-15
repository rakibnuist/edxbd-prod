import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { readLimitedJson } from '@/lib/request-body';
import { normalizeRoadmapRequest } from '@/lib/roadmap-generator';
import { generateRoadmapSummary } from '@/lib/gemini-roadmap';
import { buildStudyRoadmapPdf } from '@/lib/pdf-roadmap';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-roadmap-pdf',
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const rawBody = await readLimitedJson(request, 16 * 1024);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body: expected JSON object.' }, { status: 400 });
    }

    const roadmapReq = normalizeRoadmapRequest(rawBody);
    const summary = await generateRoadmapSummary(roadmapReq);
    const pdfBytes = await buildStudyRoadmapPdf(summary);

    const safeName = roadmapReq.studentName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'Scholar';
    const filename = `EduExpress_Study_Roadmap_${safeName}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, private',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate Study Abroad Roadmap PDF.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

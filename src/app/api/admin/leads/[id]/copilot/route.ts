import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { cleanText, type FitResponseLanguage } from '@/lib/fit-matcher';
import { generateLeadCopilotForLead } from '@/lib/gemini-lead-copilot';
import prisma from '@/lib/prisma';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403, headers: { 'Cache-Control': 'no-store, private' } },
      );
    }

    const rateLimit = await checkRateLimit(request, {
      name: 'admin-lead-copilot',
      maxRequests: 60,
      windowMs: 60 * 60 * 1000,
      persistent: true,
    });
    if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

    const { id } = await params;

    let language: FitResponseLanguage = 'en';
    let focus: string | undefined;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const rawBody = await readLimitedJson(request, 8 * 1024);
      if (rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)) {
        const body = rawBody as Record<string, unknown>;
        if (body.language === 'bn') language = 'bn';
        const rawFocus = cleanText(body.focus, 300);
        if (rawFocus) focus = rawFocus;
      }
    }

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store, private' } },
      );
    }

    const result = await generateLeadCopilotForLead(lead, { language, focus });

    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, private' },
    });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;

    console.error(
      'Admin lead copilot error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    return NextResponse.json(
      { error: 'Unable to generate counselor co-pilot brief right now.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, private' } },
    );
  }
}

import { NextRequest, NextResponse, after } from 'next/server';
import { notifyPortalActivityAlert } from '@/lib/alerts';
import { logActivityEvent } from '@/lib/crm-operations';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const TOKEN_REGEX = /^[a-zA-Z0-9_-]{8,80}$/;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const rateLimit = await checkRateLimit(request, {
    name: 'public-track-message',
    maxRequests: 20,
    windowMs: 15 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const { token } = await params;
    const cleanToken = (token || '').trim();
    if (!TOKEN_REGEX.test(cleanToken)) {
      return NextResponse.json({ error: 'Invalid tracking token.' }, { status: 400 });
    }

    const lead = await prisma.lead.findFirst({
      where: { publicToken: cleanToken, publicEnabled: true },
      select: { id: true, name: true, country: true, assignedTo: true, assignedEmployeeId: true },
    });
    if (!lead) return NextResponse.json({ error: 'Portal not found.' }, { status: 404 });

    const body = await readLimitedJson(request, 8 * 1024);
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    if (!message) {
      return NextResponse.json({ error: 'Please write a message first.' }, { status: 400 });
    }

    await logActivityEvent({
      type: 'student_message',
      actorName: lead.name,
      employeeId: lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      details: message,
    });
    after(() => notifyPortalActivityAlert({
      kind: 'student_message',
      leadId: lead.id,
      leadName: lead.name,
      country: lead.country,
      assignedTo: lead.assignedTo,
      detail: message,
    }));

    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  acknowledgeExternalGbpPublish,
  getGbpAutomationConfig,
  runDueGbpAutoPost,
} from '@/lib/gbp-scheduler';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export const dynamic = 'force-dynamic';

const JSON_HEADERS = { 'Cache-Control': 'no-store' };

const GBP_CRON_RATE_LIMIT = {
  name: 'gbp_cron_endpoint',
  maxRequests: 30,
  windowMs: 60_000,
};

function getAllowedCronSecrets(): string[] {
  return [
    process.env.GBP_CRON_SECRET,
    process.env.REVALIDATE_SECRET,
    process.env.SCHOLARSHIP_WEBHOOK_SECRET,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);
}

function safeSecretEqual(candidate: string, expected: string): boolean {
  const candidateBuf = Buffer.from(candidate);
  const expectedBuf = Buffer.from(expected);
  if (candidateBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(candidateBuf, expectedBuf);
}

function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secrets = getAllowedCronSecrets();
  if (secrets.length === 0) {
    return false;
  }

  const headerSecret =
    request.headers.get('x-cron-secret')?.trim() ||
    request.headers.get('x-webhook-secret')?.trim() ||
    '';

  const authHeader = request.headers.get('authorization')?.trim() || '';
  const bearerSecret = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';

  const provided = headerSecret || bearerSecret;
  if (!provided) {
    return false;
  }

  return secrets.some((expected) => safeSecretEqual(provided, expected));
}

export async function GET(request: NextRequest) {
  const rateResult = await checkRateLimit(request, GBP_CRON_RATE_LIMIT);
  if (!rateResult.allowed) {
    return rateLimitExceeded(rateResult);
  }

  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: JSON_HEADERS });
  }

  try {
    const config = await getGbpAutomationConfig();
    const preview = await runDueGbpAutoPost({
      dryRun: true,
      triggerSource: 'cron_preview',
    });

    return NextResponse.json(
      {
        ok: true,
        enabled: config.enabled,
        mode: config.mode,
        cadenceDays: config.cadenceDays,
        isReadyToPublish: config.isReadyToPublish,
        isDue: config.enabled && config.schedule.isDue,
        schedule: config.schedule,
        nextPost: preview.post || null,
        googleLocalPostPayload: preview.payload || null,
        webhookPayload: preview.webhookPayload || null,
      },
      { headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error('GBP cron GET preview failed:', error);
    return NextResponse.json({ error: 'Failed to check GBP schedule.' }, { status: 500, headers: JSON_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  const rateResult = await checkRateLimit(request, GBP_CRON_RATE_LIMIT);
  if (!rateResult.allowed) {
    return rateLimitExceeded(rateResult);
  }

  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: JSON_HEADERS });
  }

  try {
    let body: Record<string, unknown> = {};
    const contentType = request.headers.get('content-type')?.toLowerCase() || '';
    if (contentType.includes('application/json')) {
      body = await readLimitedJson(request, 64 * 1024);
    }

    if (body.action === 'ack' && typeof body.postId === 'string' && body.postId.trim()) {
      const ackResult = await acknowledgeExternalGbpPublish({
        postId: body.postId.trim(),
        externalPostId: typeof body.externalPostId === 'string' ? body.externalPostId.trim() : null,
        triggerSource: typeof body.source === 'string' ? body.source.trim().slice(0, 40) : 'n8n_workflow',
      });
      return NextResponse.json({ ok: ackResult.executed, ...ackResult }, { headers: JSON_HEADERS });
    }

    const result = await runDueGbpAutoPost({
      force: body.force === true,
      dryRun: body.dryRun === true,
      postId: typeof body.postId === 'string' ? body.postId : undefined,
      triggerSource: typeof body.source === 'string' ? body.source.trim().slice(0, 40) : 'vps_cron',
    });

    return NextResponse.json({ ok: true, ...result }, { headers: JSON_HEADERS });
  } catch (error) {
    const jsonErr = jsonBodyErrorResponse(error);
    if (jsonErr) return jsonErr;
    console.error('GBP cron POST execution failed:', error);
    return NextResponse.json({ error: 'GBP auto-post execution failed.' }, { status: 500, headers: JSON_HEADERS });
  }
}

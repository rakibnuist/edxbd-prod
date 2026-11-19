import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse, after } from 'next/server';
import { notifyScholarshipNoticeAlert } from '@/lib/alerts';
import { logActivityEvent } from '@/lib/crm-operations';
import prisma from '@/lib/prisma';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { parseScholarshipNoticePayload } from '@/lib/scholarship-notice';

function getScholarshipWebhookSecrets(): string[] {
  return Array.from(
    new Set(
      [
        process.env.SCHOLARSHIP_WEBHOOK_SECRET,
        process.env.META_WEBHOOK_VERIFY_TOKEN,
        process.env.REVALIDATE_SECRET,
      ]
        .map((v) => (v || '').trim())
        .filter(Boolean),
    ),
  );
}

function safeSecretEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function isAuthorizedScholarshipWebhook(request: NextRequest, candidates: string[]): boolean {
  if (candidates.length === 0) return false;
  const headerSecret = request.headers.get('x-webhook-secret')?.trim() || '';
  const authHeader = request.headers.get('authorization')?.trim() || '';
  const bearerSecret = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';

  return candidates.some(
    (expected) =>
      (headerSecret && safeSecretEqual(headerSecret, expected)) ||
      (bearerSecret && safeSecretEqual(bearerSecret, expected)),
  );
}

async function matchChinaUniversity(universityName: string) {
  const needle = universityName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!needle) return null;

  const chinaUnis = await prisma.university.findMany({
    where: { country: 'China' },
    select: { id: true, name: true, slug: true, aliases: true },
  });

  for (const uni of chinaUnis) {
    const cleanName = uni.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName === needle || cleanName.includes(needle) || needle.includes(cleanName)) {
      return uni;
    }
    try {
      const aliases = JSON.parse(uni.aliases || '[]') as unknown[];
      for (const alias of aliases) {
        if (typeof alias !== 'string') continue;
        const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanAlias && (cleanAlias === needle || cleanAlias.includes(needle))) {
          return uni;
        }
      }
    } catch {
      // ignore malformed alias JSON
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'scholarship-notice-webhook',
    maxRequests: 60,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  const secrets = getScholarshipWebhookSecrets();
  if (secrets.length === 0) {
    return NextResponse.json(
      { error: 'Scholarship webhook secret is not configured.' },
      { status: 503 },
    );
  }

  if (!isAuthorizedScholarshipWebhook(request, secrets)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await readLimitedJson(request, 64 * 1024);
    const parsed = parseScholarshipNoticePayload(rawBody);
    if (!parsed.ok) {
      if (parsed.skipped) {
        return NextResponse.json({ ok: true, skipped: true, reason: parsed.error }, { status: 200 });
      }
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const notice = parsed.data;
    const now = new Date();
    const sourceUrlsJson = JSON.stringify(notice.sourceUrl ? [notice.sourceUrl] : []);
    const tagsJson = JSON.stringify(notice.tags);
    const matchedUniversity = await matchChinaUniversity(notice.universityName);

    const existingPrimary = await prisma.content.findUnique({
      where: { slug: notice.slug },
      select: { id: true, slug: true, isPublished: true },
    });

    let action: 'created_draft' | 'updated_draft' | 'created_refresh_draft';
    let savedId: string;
    let savedSlug: string;

    if (!existingPrimary) {
      const created = await prisma.content.create({
        data: {
          title: notice.title,
          slug: notice.slug,
          content: notice.htmlContent,
          excerpt: notice.excerpt,
          type: 'update',
          category: 'Scholarships',
          categories: JSON.stringify(['Scholarships', 'China']),
          tags: tagsJson,
          isPublished: false,
          isFeatured: false,
          author: 'EduExpress Admissions Desk',
          sourceUrls: sourceUrlsJson,
          lastVerifiedAt: now,
          ...(notice.deadlineAt ? { deadlineAt: notice.deadlineAt } : {}),
        },
        select: { id: true, slug: true },
      });
      action = 'created_draft';
      savedId = created.id;
      savedSlug = created.slug;
    } else if (!existingPrimary.isPublished) {
      const updated = await prisma.content.update({
        where: { id: existingPrimary.id },
        data: {
          title: notice.title,
          content: notice.htmlContent,
          excerpt: notice.excerpt,
          tags: tagsJson,
          sourceUrls: sourceUrlsJson,
          lastVerifiedAt: now,
          ...(notice.deadlineAt ? { deadlineAt: notice.deadlineAt } : {}),
        },
        select: { id: true, slug: true },
      });
      action = 'updated_draft';
      savedId = updated.id;
      savedSlug = updated.slug;
    } else {
      const refreshSlug = `${notice.slug.slice(0, 86)}-refresh-draft`;
      const upserted = await prisma.content.upsert({
        where: { slug: refreshSlug },
        update: {
          title: `[Refresh Review] ${notice.title}`.slice(0, 180),
          content: notice.htmlContent,
          excerpt: notice.excerpt,
          tags: tagsJson,
          sourceUrls: sourceUrlsJson,
          lastVerifiedAt: now,
          isPublished: false,
          ...(notice.deadlineAt ? { deadlineAt: notice.deadlineAt } : {}),
        },
        create: {
          title: `[Refresh Review] ${notice.title}`.slice(0, 180),
          slug: refreshSlug,
          content: notice.htmlContent,
          excerpt: notice.excerpt,
          type: 'update',
          category: 'Scholarships',
          categories: JSON.stringify(['Scholarships', 'China']),
          tags: tagsJson,
          isPublished: false,
          isFeatured: false,
          author: 'EduExpress Admissions Desk',
          sourceUrls: sourceUrlsJson,
          lastVerifiedAt: now,
          ...(notice.deadlineAt ? { deadlineAt: notice.deadlineAt } : {}),
        },
        select: { id: true, slug: true },
      });
      action = 'created_refresh_draft';
      savedId = upserted.id;
      savedSlug = upserted.slug;
    }

    after(async () => {
      await logActivityEvent({
        type: 'scholarship_notice_synced',
        actorName: 'China Scholarship Monitor',
        toValue: notice.universityName,
        details: `${action} (${savedSlug}) · Deadline: ${notice.applicationDeadline}${matchedUniversity ? ` · Matched directory: ${matchedUniversity.slug}` : ''}`,
      });
      await notifyScholarshipNoticeAlert({
        universityName: notice.universityName,
        deadline: notice.applicationDeadline,
        sourceUrl: notice.sourceUrl,
        action,
      });
    });

    return NextResponse.json(
      {
        ok: true,
        action,
        contentId: savedId,
        slug: savedSlug,
        isPublished: false,
        matchedUniversity: matchedUniversity ? { id: matchedUniversity.id, slug: matchedUniversity.slug } : null,
      },
      { status: action === 'updated_draft' ? 200 : 201 },
    );
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    console.error('[webhooks/scholarship-notice] Error:', error);
    return NextResponse.json({ error: 'Failed to ingest scholarship notice draft' }, { status: 500 });
  }
}

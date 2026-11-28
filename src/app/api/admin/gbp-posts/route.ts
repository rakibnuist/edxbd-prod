import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { normalizeTargetChannels, validateGbpPostInput } from '@/lib/gbp-posts';
import {
  acknowledgeExternalGbpPublish,
  getGbpAutomationConfig,
  runDueGbpAutoPost,
  saveGbpAutomationConfig,
} from '@/lib/gbp-scheduler';
import prisma from '@/lib/prisma';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export const dynamic = 'force-dynamic';

const JSON_HEADERS = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const [config, posts] = await Promise.all([
      getGbpAutomationConfig(),
      prisma.gbpScheduledPost.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    return NextResponse.json({ config, posts }, { headers: JSON_HEADERS });
  } catch (error) {
    console.error('Failed to load GBP auto-post manager:', error);
    return NextResponse.json(
      { error: 'Failed to load GBP auto-posts.' },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

export async function POST(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const body = await readLimitedJson(request, 256 * 1024);

    if (body.action === 'preview_next') {
      const preview = await runDueGbpAutoPost({
        dryRun: true,
        postId: typeof body.postId === 'string' ? body.postId : undefined,
        triggerSource: decoded.email || 'admin_preview',
      });
      return NextResponse.json(preview, { headers: JSON_HEADERS });
    }

    if (body.action === 'run_now') {
      const result = await runDueGbpAutoPost({
        force: true,
        dryRun: Boolean(body.dryRun),
        postId: typeof body.postId === 'string' ? body.postId : undefined,
        channel: typeof body.channel === 'string' ? normalizeTargetChannels(body.channel) : 'both',
        triggerSource: decoded.email || 'admin_manual',
      });
      const config = await getGbpAutomationConfig();
      const posts = await prisma.gbpScheduledPost.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      return NextResponse.json({ result, config, posts }, { headers: JSON_HEADERS });
    }

    if (body.action === 'ack_manual' && typeof body.postId === 'string' && body.postId.trim()) {
      const result = await acknowledgeExternalGbpPublish({
        postId: body.postId.trim(),
        channel: typeof body.channel === 'string' ? normalizeTargetChannels(body.channel) : 'both',
        externalPostId: typeof body.externalPostId === 'string' ? body.externalPostId.trim() : null,
        linkedinExternalPostId:
          typeof body.linkedinExternalPostId === 'string' ? body.linkedinExternalPostId.trim() : null,
        triggerSource: decoded.email || 'admin_manual_ack',
      });
      const config = await getGbpAutomationConfig();
      const posts = await prisma.gbpScheduledPost.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      return NextResponse.json({ result, config, posts }, { headers: JSON_HEADERS });
    }

    const validated = validateGbpPostInput({
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      topicType: typeof body.topicType === 'string' ? body.topicType : undefined,
      title: typeof body.title === 'string' ? body.title : null,
      summary: typeof body.summary === 'string' ? body.summary : '',
      callToAction: typeof body.callToAction === 'string' ? body.callToAction : undefined,
      ctaUrl: typeof body.ctaUrl === 'string' ? body.ctaUrl : '',
      mediaUrl: typeof body.mediaUrl === 'string' ? body.mediaUrl : null,
      offerCouponCode: typeof body.offerCouponCode === 'string' ? body.offerCouponCode : null,
      offerRedeemUrl: typeof body.offerRedeemUrl === 'string' ? body.offerRedeemUrl : null,
      offerTerms: typeof body.offerTerms === 'string' ? body.offerTerms : null,
      startDate: typeof body.startDate === 'string' ? body.startDate : null,
      endDate: typeof body.endDate === 'string' ? body.endDate : null,
      language: typeof body.language === 'string' ? body.language : undefined,
      category: typeof body.category === 'string' ? body.category : undefined,
      targetChannels: typeof body.targetChannels === 'string' ? body.targetChannels : 'both',
      linkedinCopy: typeof body.linkedinCopy === 'string' ? body.linkedinCopy : null,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : Number(body.sortOrder ?? 100),
      status: typeof body.status === 'string' ? body.status : 'queued',
      isRecurring: typeof body.isRecurring === 'boolean' ? body.isRecurring : true,
    });

    if (validated.error || !validated.value) {
      return NextResponse.json(
        { error: validated.error || 'Invalid GBP post payload.' },
        { status: 400, headers: JSON_HEADERS },
      );
    }

    let finalSlug = validated.value.slug;
    const collision = await prisma.gbpScheduledPost.findUnique({ where: { slug: finalSlug } });
    if (collision) {
      finalSlug = `${finalSlug.slice(0, 68)}-${Date.now().toString(36)}`;
    }

    const created = await prisma.gbpScheduledPost.create({
      data: {
        ...validated.value,
        slug: finalSlug,
      },
    });

    return NextResponse.json({ ok: true, post: created }, { status: 201, headers: JSON_HEADERS });
  } catch (error) {
    const jsonErr = jsonBodyErrorResponse(error);
    if (jsonErr) return jsonErr;
    console.error('Admin GBP POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process GBP post action.' },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const body = await readLimitedJson(request, 256 * 1024);

    if (body.action === 'save_config') {
      const cfg = (body.config && typeof body.config === 'object' ? body.config : body) as Record<string, unknown>;
      const updated = await saveGbpAutomationConfig({
        enabled: typeof cfg.enabled === 'boolean' ? cfg.enabled : undefined,
        cadenceDays: cfg.cadenceDays !== undefined ? Number(cfg.cadenceDays) : undefined,
        mode: typeof cfg.mode === 'string' ? cfg.mode : undefined,
        accountId: typeof cfg.accountId === 'string' ? cfg.accountId : undefined,
        locationId: typeof cfg.locationId === 'string' ? cfg.locationId : undefined,
        clientId: typeof cfg.clientId === 'string' ? cfg.clientId : undefined,
        clientSecret: typeof cfg.clientSecret === 'string' ? cfg.clientSecret : undefined,
        refreshToken: typeof cfg.refreshToken === 'string' ? cfg.refreshToken : undefined,
        webhookUrl: typeof cfg.webhookUrl === 'string' ? cfg.webhookUrl : undefined,
        webhookSecret: typeof cfg.webhookSecret === 'string' ? cfg.webhookSecret : undefined,
        telegramNotify: typeof cfg.telegramNotify === 'boolean' ? cfg.telegramNotify : undefined,
        clearSecrets: cfg.clearSecrets === true,
        linkedinEnabled: typeof cfg.linkedinEnabled === 'boolean' ? cfg.linkedinEnabled : undefined,
        linkedinMode: typeof cfg.linkedinMode === 'string' ? cfg.linkedinMode : undefined,
        linkedinOrganizationId:
          typeof cfg.linkedinOrganizationId === 'string' ? cfg.linkedinOrganizationId : undefined,
        linkedinApiVersion: typeof cfg.linkedinApiVersion === 'string' ? cfg.linkedinApiVersion : undefined,
        linkedinAccessToken: typeof cfg.linkedinAccessToken === 'string' ? cfg.linkedinAccessToken : undefined,
        linkedinWebhookUrl: typeof cfg.linkedinWebhookUrl === 'string' ? cfg.linkedinWebhookUrl : undefined,
        linkedinWebhookSecret:
          typeof cfg.linkedinWebhookSecret === 'string' ? cfg.linkedinWebhookSecret : undefined,
      });
      return NextResponse.json({ ok: true, config: updated }, { headers: JSON_HEADERS });
    }

    const postId = typeof body.id === 'string' ? body.id.trim() : '';
    if (!postId) {
      return NextResponse.json({ error: 'Post id is required.' }, { status: 400, headers: JSON_HEADERS });
    }

    const existing = await prisma.gbpScheduledPost.findUnique({ where: { id: postId } });
    if (!existing) {
      return NextResponse.json({ error: 'GBP post not found.' }, { status: 404, headers: JSON_HEADERS });
    }

    // Quick status / order / recurring toggle without rewriting full body
    if (body.quickToggle === true) {
      const nextStatus =
        typeof body.status === 'string' && ['queued', 'paused', 'published', 'failed'].includes(body.status)
          ? body.status
          : existing.status;
      const nextSortOrder =
        typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder)
          ? Math.min(9999, Math.max(0, Math.round(body.sortOrder)))
          : existing.sortOrder;
      const nextRecurring =
        typeof body.isRecurring === 'boolean' ? body.isRecurring : existing.isRecurring;

      const updated = await prisma.gbpScheduledPost.update({
        where: { id: postId },
        data: { status: nextStatus, sortOrder: nextSortOrder, isRecurring: nextRecurring },
      });
      return NextResponse.json({ ok: true, post: updated }, { headers: JSON_HEADERS });
    }

    const validated = validateGbpPostInput({
      slug: typeof body.slug === 'string' ? body.slug : existing.slug,
      topicType: typeof body.topicType === 'string' ? body.topicType : existing.topicType,
      title: body.title !== undefined ? (typeof body.title === 'string' ? body.title : null) : existing.title,
      summary: typeof body.summary === 'string' ? body.summary : existing.summary,
      callToAction: typeof body.callToAction === 'string' ? body.callToAction : existing.callToAction,
      ctaUrl: typeof body.ctaUrl === 'string' ? body.ctaUrl : existing.ctaUrl,
      mediaUrl: body.mediaUrl !== undefined ? (typeof body.mediaUrl === 'string' ? body.mediaUrl : null) : existing.mediaUrl,
      offerCouponCode:
        body.offerCouponCode !== undefined
          ? typeof body.offerCouponCode === 'string'
            ? body.offerCouponCode
            : null
          : existing.offerCouponCode,
      offerRedeemUrl:
        body.offerRedeemUrl !== undefined
          ? typeof body.offerRedeemUrl === 'string'
            ? body.offerRedeemUrl
            : null
          : existing.offerRedeemUrl,
      offerTerms:
        body.offerTerms !== undefined
          ? typeof body.offerTerms === 'string'
            ? body.offerTerms
            : null
          : existing.offerTerms,
      startDate: body.startDate !== undefined ? body.startDate : existing.startDate,
      endDate: body.endDate !== undefined ? body.endDate : existing.endDate,
      language: typeof body.language === 'string' ? body.language : existing.language,
      category: typeof body.category === 'string' ? body.category : existing.category,
      targetChannels:
        typeof body.targetChannels === 'string' ? body.targetChannels : existing.targetChannels,
      linkedinCopy:
        body.linkedinCopy !== undefined
          ? typeof body.linkedinCopy === 'string'
            ? body.linkedinCopy
            : null
          : existing.linkedinCopy,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
      status: typeof body.status === 'string' ? body.status : existing.status,
      isRecurring: typeof body.isRecurring === 'boolean' ? body.isRecurring : existing.isRecurring,
    });

    if (validated.error || !validated.value) {
      return NextResponse.json(
        { error: validated.error || 'Invalid post fields.' },
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const updated = await prisma.gbpScheduledPost.update({
      where: { id: postId },
      data: {
        ...validated.value,
        slug: existing.slug, // Keep existing slug stable across edits
      },
    });

    return NextResponse.json({ ok: true, post: updated }, { headers: JSON_HEADERS });
  } catch (error) {
    const jsonErr = jsonBodyErrorResponse(error);
    if (jsonErr) return jsonErr;
    const message = error instanceof Error ? error.message : 'Failed to update GBP configuration or post.';
    return NextResponse.json({ error: message }, { status: 400, headers: JSON_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  const decoded = await verifyLiveAdminUser(request);
  if (!decoded || !isAdminRole(decoded.role)) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403, headers: JSON_HEADERS },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get('id');
    const id = idFromQuery?.trim() || '';
    if (!id) {
      return NextResponse.json({ error: 'Query parameter ?id=... is required.' }, { status: 400, headers: JSON_HEADERS });
    }

    await prisma.gbpScheduledPost.delete({ where: { id } });
    return NextResponse.json({ ok: true, deletedId: id }, { headers: JSON_HEADERS });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'GBP scheduled post not found.' }, { status: 404, headers: JSON_HEADERS });
    }
    console.error('Admin GBP DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete GBP scheduled post.' },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

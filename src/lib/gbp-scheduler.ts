import 'server-only';

import prisma from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/alerts';
import { logActivityEvent } from '@/lib/crm-operations';
import {
  buildGbpWebhookPayload,
  buildGoogleLocalPostPayload,
  computeGbpScheduleState,
  GBP_SETTING_KEYS,
  normalizeCadenceDays,
  normalizePublishMode,
  selectNextGbpPost,
  type GbpCadenceDays,
  type GbpPostCandidate,
  type GbpPublishMode,
  type GbpScheduleState,
} from '@/lib/gbp-posts';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { decryptSecret, encryptSecret } from '@/lib/secret-box';
import { escapeTelegramHtml } from '@/lib/telegram';

export interface GbpAutomationConfigPublic {
  enabled: boolean;
  cadenceDays: GbpCadenceDays;
  mode: GbpPublishMode;
  accountId: string;
  locationId: string;
  clientId: string;
  clientSecretSet: boolean;
  refreshTokenSet: boolean;
  webhookUrlSet: boolean;
  webhookHostPreview: string;
  webhookSecretSet: boolean;
  telegramNotify: boolean;
  googleApiConfigured: boolean;
  webhookConfigured: boolean;
  isReadyToPublish: boolean;
  lastRunAt: string | null;
  lastStatus: string | null;
  lastError: string | null;
  lastPostId: string | null;
  schedule: GbpScheduleState;
}

interface GbpAutomationConfigInternal extends GbpAutomationConfigPublic {
  clientSecret: string;
  refreshToken: string;
  webhookUrl: string;
  webhookSecret: string;
}

export interface GbpAutoPostRunResult {
  executed: boolean;
  dryRun?: boolean;
  skippedReason?: string;
  transport?: GbpPublishMode | 'external_ack';
  externalPostId?: string | null;
  error?: string;
  post?: {
    id: string;
    slug: string;
    topicType: string;
    title: string | null;
    ctaUrl: string;
  };
  payload?: Record<string, unknown>;
  webhookPayload?: Record<string, unknown>;
  schedule: GbpScheduleState;
}

function safeWebhookPreview(rawUrl: string): string {
  const safe = toSafeExternalUrl(rawUrl, 500);
  if (!safe) return '';
  try {
    const parsed = new URL(safe);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const first = segments[0] ? `/${segments[0]}` : '';
    return `${parsed.origin}${first}${segments.length > 1 ? '/••••' : ''}`;
  } catch {
    return '';
  }
}

async function upsertSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function deleteSetting(key: string): Promise<void> {
  await prisma.setting.deleteMany({ where: { key } });
}

async function loadGbpConfigInternal(now: Date = new Date()): Promise<GbpAutomationConfigInternal> {
  const keys = Object.values(GBP_SETTING_KEYS);
  const rows = await prisma.setting.findMany({
    where: { key: { in: keys } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const readSecret = (key: string, envName: string): string => {
    const stored = map.get(key);
    const decrypted = stored ? decryptSecret(stored) : '';
    return (decrypted || process.env[envName] || '').trim();
  };

  const readPlain = (key: string, envName?: string): string => {
    const stored = map.get(key);
    if (stored !== undefined && stored !== '') return stored.trim();
    return envName ? (process.env[envName] || '').trim() : '';
  };

  const enabledRaw = map.get(GBP_SETTING_KEYS.enabled);
  const enabled = enabledRaw === undefined ? true : enabledRaw === 'true';
  const cadenceDays = normalizeCadenceDays(map.get(GBP_SETTING_KEYS.cadenceDays) || process.env.GBP_AUTOPOST_CADENCE_DAYS || 7);
  const mode = normalizePublishMode(map.get(GBP_SETTING_KEYS.mode) || process.env.GBP_AUTOPOST_MODE || 'google_api');

  const accountId = readPlain(GBP_SETTING_KEYS.accountId, 'GBP_ACCOUNT_ID');
  const locationId = readPlain(GBP_SETTING_KEYS.locationId, 'GBP_LOCATION_ID');
  const clientId = readPlain(GBP_SETTING_KEYS.clientId, 'GBP_CLIENT_ID');
  const clientSecret = readSecret(GBP_SETTING_KEYS.clientSecret, 'GBP_CLIENT_SECRET');
  const refreshToken = readSecret(GBP_SETTING_KEYS.refreshToken, 'GBP_REFRESH_TOKEN');
  const webhookUrl = readSecret(GBP_SETTING_KEYS.webhookUrl, 'GBP_WEBHOOK_URL');
  const webhookSecret = readSecret(GBP_SETTING_KEYS.webhookSecret, 'GBP_WEBHOOK_SECRET');
  const telegramNotifyRaw = map.get(GBP_SETTING_KEYS.telegramNotify);
  const telegramNotify = telegramNotifyRaw === undefined ? true : telegramNotifyRaw === 'true';

  const lastRunStr = readPlain(GBP_SETTING_KEYS.lastRunAt);
  const parsedLastRun = lastRunStr ? new Date(lastRunStr) : null;
  const lastRunAtDate = parsedLastRun && !Number.isNaN(parsedLastRun.getTime()) ? parsedLastRun : null;

  const googleApiConfigured = Boolean(accountId && locationId && clientId && clientSecret && refreshToken);
  const webhookConfigured = Boolean(toSafeExternalUrl(webhookUrl, 500));
  const isReadyToPublish = mode === 'webhook' ? webhookConfigured : googleApiConfigured;

  return {
    enabled,
    cadenceDays,
    mode,
    accountId,
    locationId,
    clientId,
    clientSecret,
    refreshToken,
    webhookUrl,
    webhookSecret,
    clientSecretSet: Boolean(clientSecret),
    refreshTokenSet: Boolean(refreshToken),
    webhookUrlSet: Boolean(webhookUrl),
    webhookHostPreview: safeWebhookPreview(webhookUrl),
    webhookSecretSet: Boolean(webhookSecret),
    telegramNotify,
    googleApiConfigured,
    webhookConfigured,
    isReadyToPublish,
    lastRunAt: lastRunAtDate ? lastRunAtDate.toISOString() : null,
    lastStatus: readPlain(GBP_SETTING_KEYS.lastStatus) || null,
    lastError: readPlain(GBP_SETTING_KEYS.lastError) || null,
    lastPostId: readPlain(GBP_SETTING_KEYS.lastPostId) || null,
    schedule: computeGbpScheduleState(cadenceDays, lastRunAtDate, now),
  };
}

export async function getGbpAutomationConfig(now: Date = new Date()): Promise<GbpAutomationConfigPublic> {
  const internal = await loadGbpConfigInternal(now);
  const { clientSecret: _cs, refreshToken: _rt, webhookUrl: _wu, webhookSecret: _ws, ...pub } = internal;
  void _cs;
  void _rt;
  void _wu;
  void _ws;
  return pub;
}

export interface SaveGbpConfigInput {
  enabled?: boolean;
  cadenceDays?: number;
  mode?: string;
  accountId?: string;
  locationId?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  telegramNotify?: boolean;
  clearSecrets?: boolean;
}

export async function saveGbpAutomationConfig(input: SaveGbpConfigInput): Promise<GbpAutomationConfigPublic> {
  const tasks: Promise<void>[] = [];

  if (typeof input.enabled === 'boolean') {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.enabled, input.enabled ? 'true' : 'false'));
  }
  if (input.cadenceDays !== undefined) {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.cadenceDays, String(normalizeCadenceDays(input.cadenceDays))));
  }
  if (input.mode !== undefined) {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.mode, normalizePublishMode(input.mode)));
  }
  if (typeof input.telegramNotify === 'boolean') {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.telegramNotify, input.telegramNotify ? 'true' : 'false'));
  }

  const cleanNumericOrId = (val: unknown, maxLen: number): string =>
    typeof val === 'string' ? val.trim().slice(0, maxLen) : '';

  if (typeof input.accountId === 'string') {
    const val = cleanNumericOrId(input.accountId, 80).replace(/^accounts\//i, '');
    tasks.push(val ? upsertSetting(GBP_SETTING_KEYS.accountId, val) : deleteSetting(GBP_SETTING_KEYS.accountId));
  }
  if (typeof input.locationId === 'string') {
    const val = cleanNumericOrId(input.locationId, 80).replace(/^locations\//i, '');
    tasks.push(val ? upsertSetting(GBP_SETTING_KEYS.locationId, val) : deleteSetting(GBP_SETTING_KEYS.locationId));
  }
  if (typeof input.clientId === 'string') {
    const val = cleanNumericOrId(input.clientId, 200);
    tasks.push(val ? upsertSetting(GBP_SETTING_KEYS.clientId, val) : deleteSetting(GBP_SETTING_KEYS.clientId));
  }

  if (input.clearSecrets) {
    tasks.push(
      deleteSetting(GBP_SETTING_KEYS.clientSecret),
      deleteSetting(GBP_SETTING_KEYS.refreshToken),
      deleteSetting(GBP_SETTING_KEYS.webhookUrl),
      deleteSetting(GBP_SETTING_KEYS.webhookSecret),
    );
  } else {
    if (typeof input.clientSecret === 'string' && input.clientSecret.trim() && !input.clientSecret.includes('••••')) {
      tasks.push(upsertSetting(GBP_SETTING_KEYS.clientSecret, encryptSecret(input.clientSecret.trim())));
    }
    if (typeof input.refreshToken === 'string' && input.refreshToken.trim() && !input.refreshToken.includes('••••')) {
      tasks.push(upsertSetting(GBP_SETTING_KEYS.refreshToken, encryptSecret(input.refreshToken.trim())));
    }
    if (typeof input.webhookUrl === 'string' && input.webhookUrl.trim() && !input.webhookUrl.includes('••••')) {
      const safe = toSafeExternalUrl(input.webhookUrl.trim(), 500);
      if (!safe) {
        throw new Error('Webhook URL must be a valid https:// or http:// endpoint.');
      }
      tasks.push(upsertSetting(GBP_SETTING_KEYS.webhookUrl, encryptSecret(safe)));
    }
    if (typeof input.webhookSecret === 'string' && input.webhookSecret.trim() && !input.webhookSecret.includes('••••')) {
      tasks.push(upsertSetting(GBP_SETTING_KEYS.webhookSecret, encryptSecret(input.webhookSecret.trim())));
    }
  }

  await Promise.all(tasks);
  return getGbpAutomationConfig();
}

async function fetchGoogleAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(12_000),
  });

  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || `Google OAuth refresh failed (HTTP ${res.status})`);
  }
  return data.access_token;
}

async function publishViaGoogleApi(
  config: GbpAutomationConfigInternal,
  payload: Record<string, unknown>,
): Promise<{ externalPostId: string | null }> {
  const accessToken = await fetchGoogleAccessToken(config.clientId, config.clientSecret, config.refreshToken);
  const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(config.accountId)}/locations/${encodeURIComponent(config.locationId)}/localPosts`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  const data = (await res.json().catch(() => ({}))) as { name?: string; error?: { message?: string } };
  if (!res.ok) {
    throw new Error(data.error?.message || `Google GBP localPosts API error (HTTP ${res.status})`);
  }

  return { externalPostId: typeof data.name === 'string' ? data.name : null };
}

async function publishViaWebhook(
  config: GbpAutomationConfigInternal,
  webhookPayload: Record<string, unknown>,
): Promise<{ externalPostId: string | null }> {
  const safeUrl = toSafeExternalUrl(config.webhookUrl, 500);
  if (!safeUrl) {
    throw new Error('GBP Webhook URL is missing or invalid.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'EduExpress-GBP-Scheduler/1.0',
  };
  if (config.webhookSecret) {
    headers['X-GBP-Webhook-Secret'] = config.webhookSecret;
  }

  const res = await fetch(safeUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(webhookPayload),
    signal: AbortSignal.timeout(15_000),
  });

  const data = (await res.json().catch(() => ({}))) as { externalPostId?: string; id?: string; error?: string; message?: string };
  if (!res.ok) {
    throw new Error(data.error || data.message || `Webhook dispatch failed (HTTP ${res.status})`);
  }

  const externalPostId =
    typeof data.externalPostId === 'string'
      ? data.externalPostId
      : typeof data.id === 'string'
        ? data.id
        : `webhook_${Date.now()}`;
  return { externalPostId };
}

async function markPostPublished(
  post: GbpPostCandidate,
  externalPostId: string | null,
  transport: GbpPublishMode | 'external_ack',
  config: GbpAutomationConfigPublic,
  now: Date,
  triggerSource: string,
): Promise<void> {
  const nextStatus = post.isRecurring ? 'queued' : 'published';
  await prisma.gbpScheduledPost.update({
    where: { id: post.id },
    data: {
      publishedCount: { increment: 1 },
      lastPublishedAt: now,
      lastExternalId: externalPostId,
      lastError: null,
      status: nextStatus,
    },
  });

  await Promise.all([
    upsertSetting(GBP_SETTING_KEYS.lastRunAt, now.toISOString()),
    upsertSetting(GBP_SETTING_KEYS.lastStatus, 'published'),
    upsertSetting(GBP_SETTING_KEYS.lastError, ''),
    upsertSetting(GBP_SETTING_KEYS.lastPostId, post.id),
  ]);

  await logActivityEvent({
    type: 'gbp_autopost_published',
    actorName: triggerSource,
    details: JSON.stringify({
      slug: post.slug,
      topicType: post.topicType,
      transport,
      cadenceDays: config.cadenceDays,
      externalPostId,
    }),
  });

  if (config.telegramNotify) {
    const label = escapeTelegramHtml(post.title || post.slug);
    const cta = escapeTelegramHtml(post.ctaUrl);
    const msg =
      `<b>GBP Auto-Post Published</b>\n` +
      `Post: ${label} (${escapeTelegramHtml(post.topicType)})\n` +
      `Mode: ${escapeTelegramHtml(transport)} | Cadence: Every ${config.cadenceDays} days\n` +
      `CTA: ${cta}`;
    await sendTelegramAlert(msg).catch(() => {});
  }
}

export async function runDueGbpAutoPost(options?: {
  force?: boolean;
  dryRun?: boolean;
  postId?: string;
  triggerSource?: string;
  now?: Date;
}): Promise<GbpAutoPostRunResult> {
  const now = options?.now ?? new Date();
  const force = Boolean(options?.force);
  const dryRun = Boolean(options?.dryRun);
  const triggerSource = options?.triggerSource || 'gbp_scheduler';

  const config = await loadGbpConfigInternal(now);
  const { clientSecret: _cs, refreshToken: _rt, webhookUrl: _wu, webhookSecret: _ws, ...publicConfig } = config;
  void _cs;
  void _rt;
  void _wu;
  void _ws;

  if (!force && !dryRun && !config.enabled) {
    return {
      executed: false,
      skippedReason: 'automation_disabled',
      schedule: config.schedule,
    };
  }

  if (!force && !dryRun && !config.schedule.isDue) {
    return {
      executed: false,
      skippedReason: 'not_due_yet',
      schedule: config.schedule,
    };
  }

  let selectedPost: GbpPostCandidate | null = null;
  if (options?.postId) {
    selectedPost = await prisma.gbpScheduledPost.findUnique({ where: { id: options.postId } });
  } else {
    const candidates = await prisma.gbpScheduledPost.findMany({
      where: { status: 'queued' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    selectedPost = selectNextGbpPost(candidates, now);
  }

  if (!selectedPost) {
    return {
      executed: false,
      skippedReason: 'no_eligible_post',
      schedule: config.schedule,
    };
  }

  const googlePayload = buildGoogleLocalPostPayload(selectedPost, now);
  const webhookPayload = buildGbpWebhookPayload(selectedPost, {
    cadenceDays: config.cadenceDays,
    accountId: config.accountId,
    locationId: config.locationId,
    now,
  });

  if (dryRun) {
    return {
      executed: false,
      dryRun: true,
      transport: config.mode,
      post: {
        id: selectedPost.id,
        slug: selectedPost.slug,
        topicType: selectedPost.topicType,
        title: selectedPost.title,
        ctaUrl: selectedPost.ctaUrl,
      },
      payload: googlePayload,
      webhookPayload,
      schedule: config.schedule,
    };
  }

  if (!config.isReadyToPublish) {
    const reason =
      config.mode === 'webhook'
        ? 'Webhook URL is not configured yet. Add your n8n / webhook endpoint in Admin -> GBP Auto-Posts.'
        : 'Google GBP OAuth credentials (Account ID, Location ID, Client ID/Secret, Refresh Token) are not connected yet.';
    await Promise.all([
      upsertSetting(GBP_SETTING_KEYS.lastStatus, 'needs_credentials'),
      upsertSetting(GBP_SETTING_KEYS.lastError, reason),
    ]);
    return {
      executed: false,
      skippedReason: 'credentials_missing',
      error: reason,
      post: {
        id: selectedPost.id,
        slug: selectedPost.slug,
        topicType: selectedPost.topicType,
        title: selectedPost.title,
        ctaUrl: selectedPost.ctaUrl,
      },
      payload: googlePayload,
      schedule: config.schedule,
    };
  }

  try {
    const result =
      config.mode === 'webhook'
        ? await publishViaWebhook(config, webhookPayload)
        : await publishViaGoogleApi(config, googlePayload);

    await markPostPublished(selectedPost, result.externalPostId, config.mode, publicConfig, now, triggerSource);
    const updatedSchedule = computeGbpScheduleState(config.cadenceDays, now, now);

    return {
      executed: true,
      transport: config.mode,
      externalPostId: result.externalPostId,
      post: {
        id: selectedPost.id,
        slug: selectedPost.slug,
        topicType: selectedPost.topicType,
        title: selectedPost.title,
        ctaUrl: selectedPost.ctaUrl,
      },
      schedule: updatedSchedule,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown GBP publishing error';
    await Promise.all([
      prisma.gbpScheduledPost.update({
        where: { id: selectedPost.id },
        data: { lastError: message.slice(0, 500) },
      }),
      upsertSetting(GBP_SETTING_KEYS.lastStatus, 'failed'),
      upsertSetting(GBP_SETTING_KEYS.lastError, message.slice(0, 500)),
    ]);

    return {
      executed: false,
      transport: config.mode,
      error: message,
      post: {
        id: selectedPost.id,
        slug: selectedPost.slug,
        topicType: selectedPost.topicType,
        title: selectedPost.title,
        ctaUrl: selectedPost.ctaUrl,
      },
      schedule: config.schedule,
    };
  }
}

export async function acknowledgeExternalGbpPublish(input: {
  postId: string;
  externalPostId?: string | null;
  triggerSource?: string;
  now?: Date;
}): Promise<GbpAutoPostRunResult> {
  const now = input.now ?? new Date();
  const post = await prisma.gbpScheduledPost.findUnique({ where: { id: input.postId } });
  const config = await getGbpAutomationConfig(now);
  if (!post) {
    return {
      executed: false,
      skippedReason: 'post_not_found',
      schedule: config.schedule,
    };
  }

  await markPostPublished(
    post,
    input.externalPostId || `external_${Date.now()}`,
    'external_ack',
    config,
    now,
    input.triggerSource || 'n8n_external',
  );

  return {
    executed: true,
    transport: 'external_ack',
    externalPostId: input.externalPostId || null,
    post: {
      id: post.id,
      slug: post.slug,
      topicType: post.topicType,
      title: post.title,
      ctaUrl: post.ctaUrl,
    },
    schedule: computeGbpScheduleState(config.cadenceDays, now, now),
  };
}

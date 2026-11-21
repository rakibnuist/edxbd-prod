import 'server-only';

import prisma from '@/lib/prisma';
import { sendTelegramAlert } from '@/lib/alerts';
import { logActivityEvent } from '@/lib/crm-operations';
import {
  buildGbpWebhookPayload,
  buildGoogleLocalPostPayload,
  buildLinkedInCommentary,
  buildLinkedInRestPostPayload,
  computeGbpScheduleState,
  DEFAULT_LINKEDIN_API_VERSION,
  DEFAULT_LINKEDIN_ORGANIZATION_ID,
  GBP_SETTING_KEYS,
  normalizeCadenceDays,
  normalizeLinkedInPublishMode,
  normalizePublishMode,
  normalizeTargetChannels,
  selectNextGbpPost,
  type GbpCadenceDays,
  type GbpPostCandidate,
  type GbpPublishMode,
  type GbpScheduleState,
  type LinkedInPublishMode,
  type PostTargetChannels,
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
  // LinkedIn Company Page auto-poster (aligned with GBP cadence & queue)
  linkedinEnabled: boolean;
  linkedinMode: LinkedInPublishMode;
  linkedinOrganizationId: string;
  linkedinApiVersion: string;
  linkedinAccessTokenSet: boolean;
  linkedinWebhookUrlSet: boolean;
  linkedinWebhookHostPreview: string;
  linkedinWebhookSecretSet: boolean;
  linkedinApiConfigured: boolean;
  linkedinWebhookConfigured: boolean;
  linkedinReadyToPublish: boolean;
  linkedinLastRunAt: string | null;
  linkedinLastStatus: string | null;
  linkedinLastError: string | null;
  anyChannelReady: boolean;
  schedule: GbpScheduleState;
}

interface GbpAutomationConfigInternal extends GbpAutomationConfigPublic {
  clientSecret: string;
  refreshToken: string;
  webhookUrl: string;
  webhookSecret: string;
  linkedinAccessToken: string;
  linkedinWebhookUrl: string;
  linkedinWebhookSecret: string;
}

export interface ChannelPublishOutcome {
  attempted: boolean;
  executed: boolean;
  transport?: string;
  externalPostId?: string | null;
  skippedReason?: string;
  error?: string;
}

export interface GbpAutoPostRunResult {
  executed: boolean;
  dryRun?: boolean;
  skippedReason?: string;
  transport?: GbpPublishMode | LinkedInPublishMode | 'dual_channel' | 'external_ack';
  externalPostId?: string | null;
  linkedinExternalPostId?: string | null;
  error?: string;
  channels?: {
    gbp: ChannelPublishOutcome;
    linkedin: ChannelPublishOutcome;
  };
  post?: {
    id: string;
    slug: string;
    topicType: string;
    title: string | null;
    ctaUrl: string;
    targetChannels: PostTargetChannels;
  };
  payload?: Record<string, unknown>;
  linkedinPayload?: Record<string, unknown>;
  linkedinCommentary?: string;
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

function stripInternalSecrets(internal: GbpAutomationConfigInternal): GbpAutomationConfigPublic {
  const {
    clientSecret: _cs,
    refreshToken: _rt,
    webhookUrl: _wu,
    webhookSecret: _ws,
    linkedinAccessToken: _lat,
    linkedinWebhookUrl: _lwu,
    linkedinWebhookSecret: _lws,
    ...pub
  } = internal;
  void _cs;
  void _rt;
  void _wu;
  void _ws;
  void _lat;
  void _lwu;
  void _lws;
  return pub;
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

  // LinkedIn settings
  const linkedinEnabledRaw = map.get(GBP_SETTING_KEYS.linkedinEnabled);
  const linkedinEnabled = linkedinEnabledRaw === undefined ? true : linkedinEnabledRaw === 'true';
  const linkedinMode = normalizeLinkedInPublishMode(
    map.get(GBP_SETTING_KEYS.linkedinMode) || process.env.LINKEDIN_AUTOPOST_MODE || 'linkedin_api',
  );
  const linkedinOrganizationId =
    readPlain(GBP_SETTING_KEYS.linkedinOrganizationId, 'LINKEDIN_ORGANIZATION_ID') || DEFAULT_LINKEDIN_ORGANIZATION_ID;
  const linkedinApiVersion =
    readPlain(GBP_SETTING_KEYS.linkedinApiVersion, 'LINKEDIN_API_VERSION') || DEFAULT_LINKEDIN_API_VERSION;
  const linkedinAccessToken = readSecret(GBP_SETTING_KEYS.linkedinAccessToken, 'LINKEDIN_ACCESS_TOKEN');
  const linkedinWebhookUrl = readSecret(GBP_SETTING_KEYS.linkedinWebhookUrl, 'LINKEDIN_WEBHOOK_URL');
  const linkedinWebhookSecret = readSecret(GBP_SETTING_KEYS.linkedinWebhookSecret, 'LINKEDIN_WEBHOOK_SECRET');

  const lastRunStr = readPlain(GBP_SETTING_KEYS.lastRunAt);
  const parsedLastRun = lastRunStr ? new Date(lastRunStr) : null;
  const lastRunAtDate = parsedLastRun && !Number.isNaN(parsedLastRun.getTime()) ? parsedLastRun : null;

  const linkedinLastRunStr = readPlain(GBP_SETTING_KEYS.linkedinLastRunAt);
  const parsedLinkedinLastRun = linkedinLastRunStr ? new Date(linkedinLastRunStr) : null;
  const linkedinLastRunAtDate =
    parsedLinkedinLastRun && !Number.isNaN(parsedLinkedinLastRun.getTime()) ? parsedLinkedinLastRun : null;

  const googleApiConfigured = Boolean(accountId && locationId && clientId && clientSecret && refreshToken);
  const webhookConfigured = Boolean(toSafeExternalUrl(webhookUrl, 500));
  const isReadyToPublish = mode === 'webhook' ? webhookConfigured : googleApiConfigured;

  const linkedinApiConfigured = Boolean(linkedinOrganizationId && linkedinAccessToken);
  const linkedinWebhookConfigured = Boolean(toSafeExternalUrl(linkedinWebhookUrl || webhookUrl, 500));
  const linkedinReadyToPublish =
    linkedinMode === 'webhook' ? linkedinWebhookConfigured : linkedinApiConfigured;

  const anyChannelReady =
    (enabled && isReadyToPublish) || (linkedinEnabled && linkedinReadyToPublish);

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
    linkedinEnabled,
    linkedinMode,
    linkedinOrganizationId,
    linkedinApiVersion,
    linkedinAccessToken,
    linkedinWebhookUrl,
    linkedinWebhookSecret,
    linkedinAccessTokenSet: Boolean(linkedinAccessToken),
    linkedinWebhookUrlSet: Boolean(linkedinWebhookUrl),
    linkedinWebhookHostPreview: safeWebhookPreview(linkedinWebhookUrl),
    linkedinWebhookSecretSet: Boolean(linkedinWebhookSecret),
    linkedinApiConfigured,
    linkedinWebhookConfigured,
    linkedinReadyToPublish,
    linkedinLastRunAt: linkedinLastRunAtDate ? linkedinLastRunAtDate.toISOString() : null,
    linkedinLastStatus: readPlain(GBP_SETTING_KEYS.linkedinLastStatus) || null,
    linkedinLastError: readPlain(GBP_SETTING_KEYS.linkedinLastError) || null,
    anyChannelReady,
    schedule: computeGbpScheduleState(cadenceDays, lastRunAtDate, now),
  };
}

export async function getGbpAutomationConfig(now: Date = new Date()): Promise<GbpAutomationConfigPublic> {
  const internal = await loadGbpConfigInternal(now);
  return stripInternalSecrets(internal);
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
  // LinkedIn config fields
  linkedinEnabled?: boolean;
  linkedinMode?: string;
  linkedinOrganizationId?: string;
  linkedinApiVersion?: string;
  linkedinAccessToken?: string;
  linkedinWebhookUrl?: string;
  linkedinWebhookSecret?: string;
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
  if (typeof input.linkedinEnabled === 'boolean') {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.linkedinEnabled, input.linkedinEnabled ? 'true' : 'false'));
  }
  if (input.linkedinMode !== undefined) {
    tasks.push(upsertSetting(GBP_SETTING_KEYS.linkedinMode, normalizeLinkedInPublishMode(input.linkedinMode)));
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
  if (typeof input.linkedinOrganizationId === 'string') {
    const val = cleanNumericOrId(input.linkedinOrganizationId, 80).replace(/^urn:li:organization:/i, '');
    tasks.push(
      val
        ? upsertSetting(GBP_SETTING_KEYS.linkedinOrganizationId, val)
        : upsertSetting(GBP_SETTING_KEYS.linkedinOrganizationId, DEFAULT_LINKEDIN_ORGANIZATION_ID),
    );
  }
  if (typeof input.linkedinApiVersion === 'string') {
    const val = cleanNumericOrId(input.linkedinApiVersion, 12).replace(/[^0-9]/g, '');
    tasks.push(
      val.length === 6
        ? upsertSetting(GBP_SETTING_KEYS.linkedinApiVersion, val)
        : upsertSetting(GBP_SETTING_KEYS.linkedinApiVersion, DEFAULT_LINKEDIN_API_VERSION),
    );
  }

  if (input.clearSecrets) {
    tasks.push(
      deleteSetting(GBP_SETTING_KEYS.clientSecret),
      deleteSetting(GBP_SETTING_KEYS.refreshToken),
      deleteSetting(GBP_SETTING_KEYS.webhookUrl),
      deleteSetting(GBP_SETTING_KEYS.webhookSecret),
      deleteSetting(GBP_SETTING_KEYS.linkedinAccessToken),
      deleteSetting(GBP_SETTING_KEYS.linkedinWebhookUrl),
      deleteSetting(GBP_SETTING_KEYS.linkedinWebhookSecret),
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
        throw new Error('GBP Webhook URL must be a valid https:// or http:// endpoint.');
      }
      tasks.push(upsertSetting(GBP_SETTING_KEYS.webhookUrl, encryptSecret(safe)));
    }
    if (typeof input.webhookSecret === 'string' && input.webhookSecret.trim() && !input.webhookSecret.includes('••••')) {
      tasks.push(upsertSetting(GBP_SETTING_KEYS.webhookSecret, encryptSecret(input.webhookSecret.trim())));
    }
    if (
      typeof input.linkedinAccessToken === 'string' &&
      input.linkedinAccessToken.trim() &&
      !input.linkedinAccessToken.includes('••••')
    ) {
      tasks.push(upsertSetting(GBP_SETTING_KEYS.linkedinAccessToken, encryptSecret(input.linkedinAccessToken.trim())));
    }
    if (
      typeof input.linkedinWebhookUrl === 'string' &&
      input.linkedinWebhookUrl.trim() &&
      !input.linkedinWebhookUrl.includes('••••')
    ) {
      const safe = toSafeExternalUrl(input.linkedinWebhookUrl.trim(), 500);
      if (!safe) {
        throw new Error('LinkedIn Webhook URL must be a valid https:// or http:// endpoint.');
      }
      tasks.push(upsertSetting(GBP_SETTING_KEYS.linkedinWebhookUrl, encryptSecret(safe)));
    }
    if (
      typeof input.linkedinWebhookSecret === 'string' &&
      input.linkedinWebhookSecret.trim() &&
      !input.linkedinWebhookSecret.includes('••••')
    ) {
      tasks.push(
        upsertSetting(GBP_SETTING_KEYS.linkedinWebhookSecret, encryptSecret(input.linkedinWebhookSecret.trim())),
      );
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

async function publishViaLinkedInApi(
  config: GbpAutomationConfigInternal,
  payload: Record<string, unknown>,
): Promise<{ externalPostId: string | null }> {
  if (!config.linkedinAccessToken) {
    throw new Error('LinkedIn OAuth access token (w_organization_social) is missing.');
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.linkedinAccessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'Linkedin-Version': config.linkedinApiVersion || DEFAULT_LINKEDIN_API_VERSION,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  const restliId = res.headers.get('x-restli-id')?.trim() || null;
  const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string; errorDetails?: unknown };

  if (!res.ok) {
    throw new Error(data.message || `LinkedIn REST Posts API error (HTTP ${res.status})`);
  }

  return {
    externalPostId: restliId || (typeof data.id === 'string' ? data.id : `linkedin_${Date.now()}`),
  };
}

async function dispatchWebhook(
  targetUrl: string,
  secret: string,
  webhookPayload: Record<string, unknown>,
  channelLabel: string,
): Promise<{ externalPostId: string | null }> {
  const safeUrl = toSafeExternalUrl(targetUrl, 500);
  if (!safeUrl) {
    throw new Error(`${channelLabel} Webhook URL is missing or invalid.`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'EduExpress-Social-Scheduler/2.0',
  };
  if (secret) {
    headers['X-GBP-Webhook-Secret'] = secret;
    headers['X-Social-Webhook-Secret'] = secret;
  }

  const res = await fetch(safeUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(webhookPayload),
    signal: AbortSignal.timeout(15_000),
  });

  const data = (await res.json().catch(() => ({}))) as {
    externalPostId?: string;
    linkedinExternalPostId?: string;
    id?: string;
    error?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.error || data.message || `${channelLabel} webhook dispatch failed (HTTP ${res.status})`);
  }

  const externalPostId =
    typeof data.externalPostId === 'string'
      ? data.externalPostId
      : typeof data.linkedinExternalPostId === 'string'
        ? data.linkedinExternalPostId
        : typeof data.id === 'string'
          ? data.id
          : `webhook_${Date.now()}`;
  return { externalPostId };
}

async function recordPublishSuccess(
  post: GbpPostCandidate,
  channels: { gbp: ChannelPublishOutcome; linkedin: ChannelPublishOutcome },
  config: GbpAutomationConfigPublic,
  now: Date,
  triggerSource: string,
): Promise<void> {
  const nextStatus = post.isRecurring ? 'queued' : 'published';
  const updateData: Record<string, unknown> = {
    publishedCount: { increment: 1 },
    lastPublishedAt: now,
    status: nextStatus,
  };

  if (channels.gbp.executed) {
    updateData.lastExternalId = channels.gbp.externalPostId || null;
    updateData.lastError = null;
  } else if (channels.gbp.error) {
    updateData.lastError = channels.gbp.error.slice(0, 500);
  }

  if (channels.linkedin.executed) {
    updateData.lastLinkedinPublishedAt = now;
    updateData.lastLinkedinExternalId = channels.linkedin.externalPostId || null;
    updateData.lastLinkedinError = null;
  } else if (channels.linkedin.error) {
    updateData.lastLinkedinError = channels.linkedin.error.slice(0, 500);
  }

  await prisma.gbpScheduledPost.update({
    where: { id: post.id },
    data: updateData,
  });

  const settingUpdates: Promise<void>[] = [
    upsertSetting(GBP_SETTING_KEYS.lastRunAt, now.toISOString()),
    upsertSetting(GBP_SETTING_KEYS.lastPostId, post.id),
  ];

  if (channels.gbp.executed) {
    settingUpdates.push(
      upsertSetting(GBP_SETTING_KEYS.lastStatus, 'published'),
      upsertSetting(GBP_SETTING_KEYS.lastError, ''),
    );
  } else if (channels.gbp.error) {
    settingUpdates.push(
      upsertSetting(GBP_SETTING_KEYS.lastStatus, 'failed'),
      upsertSetting(GBP_SETTING_KEYS.lastError, channels.gbp.error.slice(0, 500)),
    );
  }

  if (channels.linkedin.executed) {
    settingUpdates.push(
      upsertSetting(GBP_SETTING_KEYS.linkedinLastRunAt, now.toISOString()),
      upsertSetting(GBP_SETTING_KEYS.linkedinLastStatus, 'published'),
      upsertSetting(GBP_SETTING_KEYS.linkedinLastError, ''),
    );
  } else if (channels.linkedin.error) {
    settingUpdates.push(
      upsertSetting(GBP_SETTING_KEYS.linkedinLastStatus, 'failed'),
      upsertSetting(GBP_SETTING_KEYS.linkedinLastError, channels.linkedin.error.slice(0, 500)),
    );
  }

  await Promise.all(settingUpdates);

  await logActivityEvent({
    type: 'gbp_autopost_published',
    actorName: triggerSource,
    details: JSON.stringify({
      slug: post.slug,
      topicType: post.topicType,
      cadenceDays: config.cadenceDays,
      gbp: channels.gbp,
      linkedin: channels.linkedin,
    }),
  });

  if (config.telegramNotify) {
    const label = escapeTelegramHtml(post.title || post.slug);
    const cta = escapeTelegramHtml(post.ctaUrl);
    const gbpLine = channels.gbp.executed
      ? `GBP: Published (${escapeTelegramHtml(channels.gbp.transport || 'gbp')})`
      : `GBP: ${escapeTelegramHtml(channels.gbp.error || channels.gbp.skippedReason || 'skipped')}`;
    const liLine = channels.linkedin.executed
      ? `LinkedIn: Published (${escapeTelegramHtml(channels.linkedin.transport || 'linkedin')})`
      : `LinkedIn: ${escapeTelegramHtml(channels.linkedin.error || channels.linkedin.skippedReason || 'skipped')}`;
    const msg =
      `<b>Weekly GBP &amp; LinkedIn Auto-Post</b>\n` +
      `Post: ${label} (${escapeTelegramHtml(post.topicType)})\n` +
      `${gbpLine}\n` +
      `${liLine}\n` +
      `Cadence: Every ${config.cadenceDays} days | CTA: ${cta}`;
    await sendTelegramAlert(msg).catch(() => {});
  }
}

export async function runDueGbpAutoPost(options?: {
  force?: boolean;
  dryRun?: boolean;
  postId?: string;
  channel?: PostTargetChannels;
  triggerSource?: string;
  now?: Date;
}): Promise<GbpAutoPostRunResult> {
  const now = options?.now ?? new Date();
  const force = Boolean(options?.force);
  const dryRun = Boolean(options?.dryRun);
  const requestedChannel = normalizeTargetChannels(options?.channel || 'both');
  const triggerSource = options?.triggerSource || 'gbp_scheduler';

  const config = await loadGbpConfigInternal(now);
  const publicConfig = stripInternalSecrets(config);

  const anyEnabled = config.enabled || config.linkedinEnabled;
  if (!force && !dryRun && !anyEnabled) {
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

  const postChannels = normalizeTargetChannels(selectedPost.targetChannels);
  const googlePayload = buildGoogleLocalPostPayload(selectedPost, now);
  const linkedinPayload = buildLinkedInRestPostPayload(selectedPost, {
    organizationId: config.linkedinOrganizationId,
  });
  const linkedinCommentary = buildLinkedInCommentary(selectedPost);
  const webhookPayload = buildGbpWebhookPayload(selectedPost, {
    cadenceDays: config.cadenceDays,
    accountId: config.accountId,
    locationId: config.locationId,
    linkedinOrganizationId: config.linkedinOrganizationId,
    now,
  });

  const postSummaryObj = {
    id: selectedPost.id,
    slug: selectedPost.slug,
    topicType: selectedPost.topicType,
    title: selectedPost.title,
    ctaUrl: selectedPost.ctaUrl,
    targetChannels: postChannels,
  };

  if (dryRun) {
    return {
      executed: false,
      dryRun: true,
      transport: config.enabled && config.linkedinEnabled ? 'dual_channel' : config.mode,
      post: postSummaryObj,
      payload: googlePayload,
      linkedinPayload,
      linkedinCommentary,
      webhookPayload,
      schedule: config.schedule,
    };
  }

  const shouldRunGbp =
    (requestedChannel === 'both' || requestedChannel === 'gbp') &&
    (postChannels === 'both' || postChannels === 'gbp') &&
    (force ? requestedChannel === 'gbp' || config.enabled : config.enabled);

  const shouldRunLinkedin =
    (requestedChannel === 'both' || requestedChannel === 'linkedin') &&
    (postChannels === 'both' || postChannels === 'linkedin') &&
    (force ? requestedChannel === 'linkedin' || config.linkedinEnabled : config.linkedinEnabled);

  const gbpOutcome: ChannelPublishOutcome = { attempted: false, executed: false };
  const linkedinOutcome: ChannelPublishOutcome = { attempted: false, executed: false };

  // Avoid double-sending to the exact same shared webhook URL if both GBP and LinkedIn use webhook mode with the same URL
  const sharedUnifiedWebhook =
    shouldRunGbp &&
    shouldRunLinkedin &&
    config.mode === 'webhook' &&
    config.linkedinMode === 'webhook' &&
    config.webhookConfigured &&
    (!config.linkedinWebhookUrl || config.linkedinWebhookUrl === config.webhookUrl);

  if (sharedUnifiedWebhook) {
    gbpOutcome.attempted = true;
    linkedinOutcome.attempted = true;
    try {
      const res = await dispatchWebhook(config.webhookUrl, config.webhookSecret, webhookPayload, 'Unified GBP+LinkedIn');
      gbpOutcome.executed = true;
      gbpOutcome.transport = 'webhook';
      gbpOutcome.externalPostId = res.externalPostId;
      linkedinOutcome.executed = true;
      linkedinOutcome.transport = 'webhook';
      linkedinOutcome.externalPostId = res.externalPostId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unified webhook dispatch failed';
      gbpOutcome.error = msg;
      linkedinOutcome.error = msg;
    }
  } else {
    // 1. Execute GBP channel
    if (!shouldRunGbp) {
      gbpOutcome.skippedReason = 'channel_disabled_or_excluded';
    } else if (!config.isReadyToPublish) {
      gbpOutcome.skippedReason = 'credentials_missing';
      gbpOutcome.error =
        config.mode === 'webhook'
          ? 'GBP Webhook URL is not configured yet.'
          : 'Google GBP OAuth credentials (Account ID, Location ID, Client ID/Secret, Refresh Token) are not connected yet.';
    } else {
      gbpOutcome.attempted = true;
      gbpOutcome.transport = config.mode;
      try {
        const res =
          config.mode === 'webhook'
            ? await dispatchWebhook(config.webhookUrl, config.webhookSecret, { ...webhookPayload, channel: 'gbp' }, 'GBP')
            : await publishViaGoogleApi(config, googlePayload);
        gbpOutcome.executed = true;
        gbpOutcome.externalPostId = res.externalPostId;
      } catch (err) {
        gbpOutcome.error = err instanceof Error ? err.message : 'Unknown GBP publishing error';
      }
    }

    // 2. Execute LinkedIn channel
    if (!shouldRunLinkedin) {
      linkedinOutcome.skippedReason = 'channel_disabled_or_excluded';
    } else if (!config.linkedinReadyToPublish) {
      linkedinOutcome.skippedReason = 'credentials_missing';
      linkedinOutcome.error =
        config.linkedinMode === 'webhook'
          ? 'LinkedIn Webhook URL is not configured yet.'
          : 'LinkedIn OAuth Access Token (w_organization_social) is not connected yet.';
    } else {
      linkedinOutcome.attempted = true;
      linkedinOutcome.transport = config.linkedinMode;
      try {
        const res =
          config.linkedinMode === 'webhook'
            ? await dispatchWebhook(
                config.linkedinWebhookUrl || config.webhookUrl,
                config.linkedinWebhookSecret || config.webhookSecret,
                { ...webhookPayload, channel: 'linkedin' },
                'LinkedIn',
              )
            : await publishViaLinkedInApi(config, linkedinPayload);
        linkedinOutcome.executed = true;
        linkedinOutcome.externalPostId = res.externalPostId;
      } catch (err) {
        linkedinOutcome.error = err instanceof Error ? err.message : 'Unknown LinkedIn publishing error';
      }
    }
  }

  const anyExecuted = gbpOutcome.executed || linkedinOutcome.executed;

  if (!anyExecuted) {
    const missingOnly =
      (!gbpOutcome.attempted && gbpOutcome.skippedReason === 'credentials_missing') ||
      (!linkedinOutcome.attempted && linkedinOutcome.skippedReason === 'credentials_missing');
    const combinedError = [gbpOutcome.error, linkedinOutcome.error].filter(Boolean).join(' | ');

    const errUpdates: Promise<void>[] = [];
    if (gbpOutcome.error) {
      errUpdates.push(
        upsertSetting(GBP_SETTING_KEYS.lastStatus, gbpOutcome.skippedReason === 'credentials_missing' ? 'needs_credentials' : 'failed'),
        upsertSetting(GBP_SETTING_KEYS.lastError, gbpOutcome.error.slice(0, 500)),
      );
    }
    if (linkedinOutcome.error) {
      errUpdates.push(
        upsertSetting(
          GBP_SETTING_KEYS.linkedinLastStatus,
          linkedinOutcome.skippedReason === 'credentials_missing' ? 'needs_credentials' : 'failed',
        ),
        upsertSetting(GBP_SETTING_KEYS.linkedinLastError, linkedinOutcome.error.slice(0, 500)),
      );
    }
    if (gbpOutcome.attempted || linkedinOutcome.attempted) {
      errUpdates.push(
        prisma.gbpScheduledPost
          .update({
            where: { id: selectedPost.id },
            data: {
              ...(gbpOutcome.error ? { lastError: gbpOutcome.error.slice(0, 500) } : {}),
              ...(linkedinOutcome.error ? { lastLinkedinError: linkedinOutcome.error.slice(0, 500) } : {}),
            },
          })
          .then(() => undefined),
      );
    }
    await Promise.all(errUpdates);

    return {
      executed: false,
      skippedReason: missingOnly && !gbpOutcome.attempted && !linkedinOutcome.attempted ? 'credentials_missing' : undefined,
      transport: shouldRunGbp && shouldRunLinkedin ? 'dual_channel' : shouldRunLinkedin ? config.linkedinMode : config.mode,
      error: combinedError || 'No target channel was enabled or ready to publish.',
      channels: { gbp: gbpOutcome, linkedin: linkedinOutcome },
      post: postSummaryObj,
      payload: googlePayload,
      linkedinPayload,
      linkedinCommentary,
      schedule: config.schedule,
    };
  }

  await recordPublishSuccess(selectedPost, { gbp: gbpOutcome, linkedin: linkedinOutcome }, publicConfig, now, triggerSource);
  const updatedSchedule = computeGbpScheduleState(config.cadenceDays, now, now);

  const combinedErrors = [gbpOutcome.error, linkedinOutcome.error].filter(Boolean).join(' | ');
  return {
    executed: true,
    transport:
      gbpOutcome.executed && linkedinOutcome.executed
        ? 'dual_channel'
        : gbpOutcome.executed
          ? config.mode
          : config.linkedinMode,
    externalPostId: gbpOutcome.externalPostId || linkedinOutcome.externalPostId || null,
    linkedinExternalPostId: linkedinOutcome.externalPostId || null,
    ...(combinedErrors ? { error: combinedErrors } : {}),
    channels: { gbp: gbpOutcome, linkedin: linkedinOutcome },
    post: postSummaryObj,
    schedule: updatedSchedule,
  };
}

export async function acknowledgeExternalGbpPublish(input: {
  postId: string;
  channel?: PostTargetChannels;
  externalPostId?: string | null;
  linkedinExternalPostId?: string | null;
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

  const channel = normalizeTargetChannels(input.channel || 'both');
  const gbpOutcome: ChannelPublishOutcome =
    channel === 'both' || channel === 'gbp'
      ? {
          attempted: true,
          executed: true,
          transport: 'external_ack',
          externalPostId: input.externalPostId || `external_gbp_${Date.now()}`,
        }
      : { attempted: false, executed: false, skippedReason: 'not_in_ack_scope' };

  const linkedinOutcome: ChannelPublishOutcome =
    channel === 'both' || channel === 'linkedin'
      ? {
          attempted: true,
          executed: true,
          transport: 'external_ack',
          externalPostId: input.linkedinExternalPostId || `external_linkedin_${Date.now()}`,
        }
      : { attempted: false, executed: false, skippedReason: 'not_in_ack_scope' };

  await recordPublishSuccess(
    post,
    { gbp: gbpOutcome, linkedin: linkedinOutcome },
    config,
    now,
    input.triggerSource || 'external_sync',
  );

  return {
    executed: true,
    transport: 'external_ack',
    externalPostId: gbpOutcome.externalPostId || null,
    linkedinExternalPostId: linkedinOutcome.externalPostId || null,
    channels: { gbp: gbpOutcome, linkedin: linkedinOutcome },
    post: {
      id: post.id,
      slug: post.slug,
      topicType: post.topicType,
      title: post.title,
      ctaUrl: post.ctaUrl,
      targetChannels: normalizeTargetChannels(post.targetChannels),
    },
    schedule: computeGbpScheduleState(config.cadenceDays, now, now),
  };
}

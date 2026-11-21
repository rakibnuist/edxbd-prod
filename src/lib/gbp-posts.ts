import { toSafeExternalUrl, toSafeSitePathOrUrl } from './safe-url';

export const GBP_CADENCE_OPTIONS = [7, 15] as const;
export type GbpCadenceDays = (typeof GBP_CADENCE_OPTIONS)[number];

export const GBP_PUBLISH_MODES = ['google_api', 'webhook'] as const;
export type GbpPublishMode = (typeof GBP_PUBLISH_MODES)[number];

export const GBP_TOPIC_TYPES = ['STANDARD', 'OFFER', 'EVENT'] as const;
export type GbpTopicType = (typeof GBP_TOPIC_TYPES)[number];

export const GBP_CTA_TYPES = ['LEARN_MORE', 'BOOK', 'SIGN_UP', 'ORDER', 'SHOP'] as const;
export type GbpCallToActionType = (typeof GBP_CTA_TYPES)[number];

export const GBP_LANGUAGES = ['en', 'bn', 'bilingual'] as const;
export type GbpLanguage = (typeof GBP_LANGUAGES)[number];

export const GBP_POST_STATUSES = ['queued', 'paused', 'published', 'failed'] as const;
export type GbpPostStatus = (typeof GBP_POST_STATUSES)[number];

export const GBP_SETTING_KEYS = {
  enabled: 'gbp_autopost_enabled',
  cadenceDays: 'gbp_autopost_cadence_days',
  mode: 'gbp_autopost_mode',
  accountId: 'gbp_account_id',
  locationId: 'gbp_location_id',
  clientId: 'gbp_client_id',
  clientSecret: 'gbp_client_secret',
  refreshToken: 'gbp_refresh_token',
  webhookUrl: 'gbp_webhook_url',
  webhookSecret: 'gbp_webhook_secret',
  telegramNotify: 'gbp_telegram_notify',
  lastRunAt: 'gbp_last_run_at',
  lastStatus: 'gbp_last_status',
  lastError: 'gbp_last_error',
  lastPostId: 'gbp_last_post_id',
} as const;

export const SITE_ORIGIN = 'https://eduexpressint.com';

const CADENCE_GRACE_MS = 2 * 60 * 60 * 1000; // 2h grace so a daily cron fires cleanly on day 7 / day 15 without drift
const MAX_SUMMARY_CHARS = 1500;
const MAX_OFFER_TITLE_CHARS = 58;
const MAX_STANDARD_TITLE_CHARS = 120;

const PHONE_PATTERNS: RegExp[] = [
  /(?:\+?880[\s-]?)?0?1[3-9]\d{2}[\s-]?\d{6}\b/,
  /\b0\d{2,4}[\s-]?\d{6,8}\b/,
  /\+\d{1,3}[\s-]?\d{4,}[\s-]?\d{3,}/,
  /\b\d{8,}\b/,
];

const BANNED_GUARANTEE_PATTERNS: RegExp[] = [
  /100%\s*visa/i,
  /visa\s*guarante/i,
  /guarante\w*\s*visa/i,
  /guarante\w*\s*admission/i,
  /100%\s*admission/i,
  /100%\s*scholarship/i,
  /শতভাগ\s*ভিসা/,
  /ভিসা\s*গ্যারান্টি/,
  /গ্যারান্টেড\s*ভিসা/,
  /ভর্তির\s*গ্যারান্টি/,
  /১০০%\s*ভিসা/,
];

export interface GbpPostInput {
  slug?: string;
  topicType?: string;
  title?: string | null;
  summary: string;
  callToAction?: string;
  ctaUrl: string;
  mediaUrl?: string | null;
  offerCouponCode?: string | null;
  offerRedeemUrl?: string | null;
  offerTerms?: string | null;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  language?: string;
  category?: string;
  sortOrder?: number;
  status?: string;
  isRecurring?: boolean;
}

export interface ValidatedGbpPostInput {
  slug: string;
  topicType: GbpTopicType;
  title: string | null;
  summary: string;
  callToAction: GbpCallToActionType;
  ctaUrl: string;
  mediaUrl: string | null;
  offerCouponCode: string | null;
  offerRedeemUrl: string | null;
  offerTerms: string | null;
  startDate: Date | null;
  endDate: Date | null;
  language: GbpLanguage;
  category: string;
  sortOrder: number;
  status: GbpPostStatus;
  isRecurring: boolean;
}

export interface GbpPostCandidate {
  id: string;
  slug: string;
  topicType: string;
  title: string | null;
  summary: string;
  callToAction: string;
  ctaUrl: string;
  mediaUrl: string | null;
  offerCouponCode: string | null;
  offerRedeemUrl: string | null;
  offerTerms: string | null;
  startDate: Date | null;
  endDate: Date | null;
  language: string;
  category: string;
  sortOrder: number;
  status: string;
  isRecurring: boolean;
  publishedCount: number;
  lastPublishedAt: Date | null;
  createdAt: Date;
}

export interface GbpScheduleState {
  cadenceDays: GbpCadenceDays;
  lastRunAt: Date | null;
  nextDueAt: Date | null;
  isDue: boolean;
  remainingMs: number;
}

export function normalizeCadenceDays(value: unknown): GbpCadenceDays {
  const num = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  return num === 15 ? 15 : 7;
}

export function normalizePublishMode(value: unknown): GbpPublishMode {
  return value === 'webhook' ? 'webhook' : 'google_api';
}

export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function containsPhoneNumber(text: string): boolean {
  return PHONE_PATTERNS.some((pattern) => pattern.test(text));
}

export function containsBannedGuarantee(text: string): boolean {
  return BANNED_GUARANTEE_PATTERNS.some((pattern) => pattern.test(text));
}

function parseOptionalDate(value: string | Date | null | undefined): { date: Date | null; error?: string } {
  if (value === undefined || value === null || value === '') {
    return { date: null };
  }
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: null, error: 'Invalid date value provided.' };
  }
  return { date: parsed };
}

export function validateGbpPostInput(
  raw: GbpPostInput,
): { value: ValidatedGbpPostInput; error?: undefined } | { value?: undefined; error: string } {
  const topicType = (typeof raw.topicType === 'string' ? raw.topicType.trim().toUpperCase() : 'STANDARD') as GbpTopicType;
  if (!GBP_TOPIC_TYPES.includes(topicType)) {
    return { error: 'Topic type must be STANDARD, OFFER, or EVENT.' };
  }

  const callToAction = (typeof raw.callToAction === 'string' ? raw.callToAction.trim().toUpperCase() : 'LEARN_MORE') as GbpCallToActionType;
  if (!GBP_CTA_TYPES.includes(callToAction)) {
    return { error: 'Invalid Google Business Profile call-to-action type.' };
  }

  const language = (typeof raw.language === 'string' ? raw.language.trim().toLowerCase() : 'en') as GbpLanguage;
  if (!GBP_LANGUAGES.includes(language)) {
    return { error: 'Language must be en, bn, or bilingual.' };
  }

  const status = (typeof raw.status === 'string' ? raw.status.trim().toLowerCase() : 'queued') as GbpPostStatus;
  if (!GBP_POST_STATUSES.includes(status)) {
    return { error: 'Invalid post status.' };
  }

  const summary = typeof raw.summary === 'string' ? raw.summary.trim() : '';
  if (summary.length < 20 || summary.length > MAX_SUMMARY_CHARS) {
    return { error: `Post summary must be between 20 and ${MAX_SUMMARY_CHARS} characters.` };
  }
  if (containsPhoneNumber(summary)) {
    return { error: 'Google Business Profile post body cannot contain phone numbers (causes automatic GBP rejection).' };
  }
  if (containsBannedGuarantee(summary)) {
    return { error: 'Post summary violates EduExpress honesty standards (no 100% visa or admission guarantees).' };
  }

  const rawTitle = typeof raw.title === 'string' ? raw.title.trim() : '';
  if ((topicType === 'OFFER' || topicType === 'EVENT') && rawTitle.length < 3) {
    return { error: `${topicType} posts require a title (3-${MAX_OFFER_TITLE_CHARS} characters).` };
  }
  const maxTitleLen = topicType === 'STANDARD' ? MAX_STANDARD_TITLE_CHARS : MAX_OFFER_TITLE_CHARS;
  if (rawTitle.length > maxTitleLen) {
    return { error: `Title cannot exceed ${maxTitleLen} characters for ${topicType} posts.` };
  }
  if (rawTitle && (containsPhoneNumber(rawTitle) || containsBannedGuarantee(rawTitle))) {
    return { error: 'Post title cannot contain phone numbers or guarantee claims.' };
  }

  const ctaUrl = toSafeExternalUrl(raw.ctaUrl, 500);
  if (!ctaUrl) {
    return { error: 'CTA link must be a valid https:// or http:// URL.' };
  }

  let mediaUrl: string | null = null;
  if (typeof raw.mediaUrl === 'string' && raw.mediaUrl.trim()) {
    const safeMedia = toSafeSitePathOrUrl(raw.mediaUrl.trim(), 500);
    if (!safeMedia) {
      return { error: 'Media URL must be a valid site path (/images/...) or https:// URL.' };
    }
    mediaUrl = safeMedia;
  }

  let offerRedeemUrl: string | null = null;
  if (typeof raw.offerRedeemUrl === 'string' && raw.offerRedeemUrl.trim()) {
    const safeRedeem = toSafeExternalUrl(raw.offerRedeemUrl.trim(), 500);
    if (!safeRedeem) {
      return { error: 'Offer redeem URL must be a valid https:// or http:// URL.' };
    }
    offerRedeemUrl = safeRedeem;
  }

  const startParsed = parseOptionalDate(raw.startDate);
  if (startParsed.error) return { error: startParsed.error };
  const endParsed = parseOptionalDate(raw.endDate);
  if (endParsed.error) return { error: endParsed.error };
  if (startParsed.date && endParsed.date && endParsed.date.getTime() < startParsed.date.getTime()) {
    return { error: 'End date must be on or after start date.' };
  }

  const slugSource = typeof raw.slug === 'string' && raw.slug.trim() ? raw.slug : rawTitle || summary.slice(0, 48);
  const slug = normalizeSlug(slugSource);
  if (slug.length < 3) {
    return { error: 'Slug could not be derived cleanly; provide a longer title or slug.' };
  }

  const category =
    typeof raw.category === 'string' && raw.category.trim()
      ? raw.category.trim().toLowerCase().slice(0, 40)
      : 'general';

  const sortOrder =
    typeof raw.sortOrder === 'number' && Number.isFinite(raw.sortOrder)
      ? Math.min(9999, Math.max(0, Math.round(raw.sortOrder)))
      : 100;

  return {
    value: {
      slug,
      topicType,
      title: rawTitle || null,
      summary,
      callToAction,
      ctaUrl,
      mediaUrl,
      offerCouponCode: typeof raw.offerCouponCode === 'string' && raw.offerCouponCode.trim() ? raw.offerCouponCode.trim().slice(0, 40) : null,
      offerRedeemUrl,
      offerTerms: typeof raw.offerTerms === 'string' && raw.offerTerms.trim() ? raw.offerTerms.trim().slice(0, 500) : null,
      startDate: startParsed.date,
      endDate: endParsed.date,
      language,
      category,
      sortOrder,
      status,
      isRecurring: typeof raw.isRecurring === 'boolean' ? raw.isRecurring : true,
    },
  };
}

export function computeGbpScheduleState(
  cadenceDaysInput: unknown,
  lastRunAt: Date | null,
  now: Date = new Date(),
): GbpScheduleState {
  const cadenceDays = normalizeCadenceDays(cadenceDaysInput);
  if (!lastRunAt || Number.isNaN(lastRunAt.getTime())) {
    return {
      cadenceDays,
      lastRunAt: null,
      nextDueAt: now,
      isDue: true,
      remainingMs: 0,
    };
  }

  const intervalMs = cadenceDays * 24 * 60 * 60 * 1000;
  const dueThresholdMs = Math.max(0, intervalMs - CADENCE_GRACE_MS);
  const elapsedMs = now.getTime() - lastRunAt.getTime();
  const nextDueAt = new Date(lastRunAt.getTime() + intervalMs);
  const remainingMs = Math.max(0, nextDueAt.getTime() - now.getTime());

  return {
    cadenceDays,
    lastRunAt,
    nextDueAt,
    isDue: elapsedMs >= dueThresholdMs,
    remainingMs,
  };
}

export function selectNextGbpPost<T extends GbpPostCandidate>(posts: T[], now: Date = new Date()): T | null {
  const nowMs = now.getTime();
  const eligible = posts.filter((post) => {
    if (post.status !== 'queued') return false;
    if (post.startDate && post.startDate.getTime() > nowMs) return false;
    if (post.endDate && post.endDate.getTime() < nowMs) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  return [...eligible].sort((a, b) => {
    const aNever = a.lastPublishedAt === null;
    const bNever = b.lastPublishedAt === null;
    if (aNever !== bNever) return aNever ? -1 : 1;

    if (!aNever && !bNever && a.lastPublishedAt && b.lastPublishedAt) {
      const diff = a.lastPublishedAt.getTime() - b.lastPublishedAt.getTime();
      if (diff !== 0) return diff;
    }

    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.createdAt.getTime() - b.createdAt.getTime();
  })[0];
}

export function resolveAbsoluteMediaUrl(mediaUrl: string | null | undefined, origin: string = SITE_ORIGIN): string | null {
  if (!mediaUrl) return null;
  const trimmed = mediaUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/')) {
    return `${origin.replace(/\/+$/, '')}${trimmed}`;
  }
  return toSafeExternalUrl(trimmed, 500);
}

function toDhakaDateParts(date: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [year, month, day] = formatter.format(date).split('-').map(Number);
  return { year, month, day };
}

export function buildGoogleLocalPostPayload(
  post: Pick<
    GbpPostCandidate,
    | 'topicType'
    | 'title'
    | 'summary'
    | 'callToAction'
    | 'ctaUrl'
    | 'mediaUrl'
    | 'offerCouponCode'
    | 'offerRedeemUrl'
    | 'offerTerms'
    | 'startDate'
    | 'endDate'
    | 'language'
  >,
  now: Date = new Date(),
  origin: string = SITE_ORIGIN,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    languageCode: post.language === 'bn' ? 'bn' : 'en',
    summary: post.summary,
    topicType: post.topicType,
    callToAction: {
      actionType: post.callToAction || 'LEARN_MORE',
      url: post.ctaUrl,
    },
  };

  const absoluteMedia = resolveAbsoluteMediaUrl(post.mediaUrl, origin);
  if (absoluteMedia) {
    payload.media = [
      {
        mediaFormat: 'PHOTO',
        sourceUrl: absoluteMedia,
      },
    ];
  }

  if (post.topicType === 'OFFER' || post.topicType === 'EVENT') {
    const start = post.startDate || now;
    const end = post.endDate || new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    payload.event = {
      title: (post.title || 'EduExpress Study Abroad Update').slice(0, MAX_OFFER_TITLE_CHARS),
      schedule: {
        startDate: toDhakaDateParts(start),
        startTime: { hours: 0, minutes: 0, seconds: 0, nanos: 0 },
        endDate: toDhakaDateParts(end),
        endTime: { hours: 23, minutes: 59, seconds: 0, nanos: 0 },
      },
    };
  }

  if (post.topicType === 'OFFER') {
    const offer: Record<string, string> = {};
    if (post.offerCouponCode) offer.couponCode = post.offerCouponCode;
    if (post.offerRedeemUrl) offer.redeemOnlineUrl = post.offerRedeemUrl;
    if (post.offerTerms) offer.termsConditions = post.offerTerms;
    if (Object.keys(offer).length > 0) {
      payload.offer = offer;
    }
  }

  return payload;
}

export function buildGbpWebhookPayload(
  post: GbpPostCandidate,
  options: { cadenceDays: GbpCadenceDays; accountId: string; locationId: string; now?: Date },
): Record<string, unknown> {
  const now = options.now ?? new Date();
  return {
    event: 'gbp.post.due',
    source: 'eduexpress-autopost',
    triggeredAt: now.toISOString(),
    cadenceDays: options.cadenceDays,
    gbp: {
      accountId: options.accountId || null,
      locationId: options.locationId || null,
    },
    post: {
      id: post.id,
      slug: post.slug,
      topicType: post.topicType,
      title: post.title,
      summary: post.summary,
      callToAction: post.callToAction,
      ctaUrl: post.ctaUrl,
      mediaUrl: resolveAbsoluteMediaUrl(post.mediaUrl),
      language: post.language,
      category: post.category,
    },
    googleLocalPostPayload: buildGoogleLocalPostPayload(post, now),
  };
}

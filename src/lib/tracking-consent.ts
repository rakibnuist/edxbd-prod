export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const TRACKING_USER_ID_KEY = 'user_id';
export const TRACKING_TEMP_USER_ID_KEY = 'temp_user_id';
export const LEGACY_PII_STORAGE_KEYS = ['user_email', 'user_phone'] as const;
export const TRACKING_COOKIE_NAMES = ['ee_uid', '_fbc'] as const;

const TRACKING_MAX_ID_LENGTH = 255;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface TrackingBrowserEnv {
  localStorage?: StorageLike | null;
  sessionStorage?: StorageLike | null;
  document?: { cookie: string } | null;
  location?: { protocol?: string } | null;
}

function resolveEnv(env?: TrackingBrowserEnv): TrackingBrowserEnv {
  if (env !== undefined) return env;
  if (typeof window === 'undefined') return {};
  return {
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    document: window.document,
    location: window.location,
  };
}

function safeGetItem(storage: StorageLike | null | undefined, key: string): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(storage: StorageLike | null | undefined, key: string, value: string): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(storage: StorageLike | null | undefined, key: string): void {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Single client-side check for whether the visitor accepted non-essential
 * analytics & advertising cookies/identifiers.
 */
export function isAnalyticsConsentAccepted(env?: TrackingBrowserEnv): boolean {
  const { localStorage } = resolveEnv(env);
  return safeGetItem(localStorage, CONSENT_STORAGE_KEY) === 'accepted';
}

export function isHttpsProtocol(env?: TrackingBrowserEnv): boolean {
  const { location } = resolveEnv(env);
  return location?.protocol === 'https:';
}

/**
 * Format a first-party tracking cookie string with SameSite=Lax and Secure on HTTPS.
 */
export function buildTrackingCookieString(
  name: string,
  value: string,
  maxAgeSeconds: number,
  isHttps: boolean,
): string {
  const safeMaxAge = Math.max(0, Math.floor(maxAgeSeconds));
  const secureFlag = isHttps ? ';Secure' : '';
  return `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=/;max-age=${safeMaxAge};SameSite=Lax${secureFlag}`;
}

export function readCookieValue(name: string, env?: TrackingBrowserEnv): string | undefined {
  const { document: doc } = resolveEnv(env);
  if (!doc || typeof doc.cookie !== 'string' || !doc.cookie) return undefined;

  const encodedName = encodeURIComponent(name);
  for (const part of doc.cookie.split(';')) {
    const eqIndex = part.indexOf('=');
    if (eqIndex <= 0) continue;
    const rawKey = part.slice(0, eqIndex).trim();
    if (rawKey !== name && rawKey !== encodedName) continue;
    const rawVal = part.slice(eqIndex + 1).trim();
    if (!rawVal) return undefined;
    try {
      return decodeURIComponent(rawVal);
    } catch {
      return rawVal;
    }
  }
  return undefined;
}

/**
 * Persist a first-party tracking cookie strictly after analytics consent is granted,
 * adding `;Secure` whenever running on an HTTPS origin.
 */
export function setTrackingCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
  env?: TrackingBrowserEnv,
): boolean {
  const resolved = resolveEnv(env);
  if (!isAnalyticsConsentAccepted(resolved) || !resolved.document) return false;
  try {
    resolved.document.cookie = buildTrackingCookieString(
      name,
      value,
      maxAgeSeconds,
      isHttpsProtocol(resolved),
    );
    return true;
  } catch {
    return false;
  }
}

function expireTrackingCookie(name: string, resolved: TrackingBrowserEnv): void {
  if (!resolved.document) return;
  try {
    resolved.document.cookie = buildTrackingCookieString(
      name,
      '',
      0,
      isHttpsProtocol(resolved),
    );
  } catch {
    /* ignore */
  }
}

/**
 * Remove any legacy raw student PII keys (`user_email`, `user_phone`) from browser storage.
 */
export function scrubLegacyTrackingPii(env?: TrackingBrowserEnv): void {
  const resolved = resolveEnv(env);
  for (const key of LEGACY_PII_STORAGE_KEYS) {
    safeRemoveItem(resolved.localStorage, key);
    safeRemoveItem(resolved.sessionStorage, key);
  }
}

/**
 * Purge tracking identifiers, legacy PII keys, and first-party tracking cookies
 * (used when consent is absent, declined, or revoked).
 */
export function clearTrackingState(env?: TrackingBrowserEnv): void {
  const resolved = resolveEnv(env);
  scrubLegacyTrackingPii(resolved);
  for (const key of [TRACKING_USER_ID_KEY, TRACKING_TEMP_USER_ID_KEY]) {
    safeRemoveItem(resolved.localStorage, key);
    safeRemoveItem(resolved.sessionStorage, key);
  }
  for (const cookieName of TRACKING_COOKIE_NAMES) {
    expireTrackingCookie(cookieName, resolved);
  }
}

/**
 * Persist an opaque lead ID (`user_id` / `ee_uid`) strictly when analytics consent
 * is accepted. Never writes raw student email or phone to browser storage.
 */
export function persistTrackingLeadId(
  leadId: string | null | undefined,
  env?: TrackingBrowserEnv,
): boolean {
  const resolved = resolveEnv(env);
  scrubLegacyTrackingPii(resolved);

  if (!isAnalyticsConsentAccepted(resolved)) return false;

  const trimmed = typeof leadId === 'string' ? leadId.trim() : '';
  if (!trimmed || trimmed.length > TRACKING_MAX_ID_LENGTH) return false;

  safeSetItem(resolved.localStorage, TRACKING_USER_ID_KEY, trimmed);
  setTrackingCookie('ee_uid', trimmed, 365 * 86400, resolved);
  return true;
}

/**
 * Look up an opaque `external_id` strictly after consent without minting a new ID.
 */
export function getConsentedExternalId(env?: TrackingBrowserEnv): string | undefined {
  const resolved = resolveEnv(env);
  scrubLegacyTrackingPii(resolved);
  if (!isAnalyticsConsentAccepted(resolved)) return undefined;

  const storedUserId = safeGetItem(resolved.localStorage, TRACKING_USER_ID_KEY);
  if (storedUserId) return storedUserId;

  const cookieUid = readCookieValue('ee_uid', resolved);
  if (cookieUid) {
    safeSetItem(resolved.localStorage, TRACKING_USER_ID_KEY, cookieUid);
    return cookieUid;
  }

  const sessionUserId = safeGetItem(resolved.sessionStorage, TRACKING_USER_ID_KEY);
  if (sessionUserId) return sessionUserId;

  const tempId = safeGetItem(resolved.sessionStorage, TRACKING_TEMP_USER_ID_KEY);
  return tempId || undefined;
}

/**
 * Return an opaque consented `external_id` or generate a session temporary ID +
 * `ee_uid` cookie when analytics consent has been granted.
 */
export function getOrCreateConsentedExternalId(env?: TrackingBrowserEnv): string | undefined {
  const resolved = resolveEnv(env);
  const existing = getConsentedExternalId(resolved);
  if (existing) return existing;
  if (!isAnalyticsConsentAccepted(resolved)) return undefined;

  const newTempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  safeSetItem(resolved.sessionStorage, TRACKING_TEMP_USER_ID_KEY, newTempId);
  setTrackingCookie('ee_uid', newTempId, 365 * 86400, resolved);
  return newTempId;
}

/**
 * Build Meta Pixel advanced matching parameters strictly behind consent using only
 * an opaque `external_id` (never reading or sending raw PII from localStorage).
 */
export function buildMetaAdvancedMatching(env?: TrackingBrowserEnv): Record<string, string> {
  const resolved = resolveEnv(env);
  scrubLegacyTrackingPii(resolved);
  if (!isAnalyticsConsentAccepted(resolved)) return {};

  const externalId = getConsentedExternalId(resolved);
  return externalId ? { external_id: externalId } : {};
}

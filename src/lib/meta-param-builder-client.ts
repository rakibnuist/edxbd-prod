'use client';

import type { ClientParamBuilderApi } from 'meta-capi-param-builder-clientjs';
import {
  captureLandingFbclid,
  getCapturedLandingUrlWithFbclid,
  getOrCreateConsentedExternalId,
  isAnalyticsConsentAccepted,
  readCookieValue,
} from './tracking-consent';

const META_PARAM_COOKIE_REGEX = /^fb\.\d+\.\d+\.[^\s;]{4,460}$/;

export interface ConsentedSubmissionMetaParams {
  metaFbc?: string;
  metaFbp?: string;
  metaExternalId?: string;
  metaEventSourceUrl?: string;
}

interface CachedClientParams {
  fbc?: string;
  fbp?: string;
}

let loadedBuilderPromise: Promise<ClientParamBuilderApi | null> | null = null;
let lastCollectedUrl: string | null = null;
let inFlightCollect: { url: string; promise: Promise<CachedClientParams> } | null = null;
let cachedParams: CachedClientParams = {};

function sanitizeMetaParamCookie(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return undefined;
  return META_PARAM_COOKIE_REGEX.test(trimmed) ? trimmed : undefined;
}

async function loadClientParamBuilder(): Promise<ClientParamBuilderApi | null> {
  if (typeof window === 'undefined' || !isAnalyticsConsentAccepted()) {
    return null;
  }
  if (!loadedBuilderPromise) {
    loadedBuilderPromise = import('meta-capi-param-builder-clientjs')
      .then((mod) => {
        const modObj = mod as {
          default?: ClientParamBuilderApi;
          clientParamBuilder?: ClientParamBuilderApi;
        };
        const candidate =
          (typeof modObj.default?.processAndCollectAllParams === 'function' ? modObj.default : null) ??
          (typeof modObj.clientParamBuilder?.processAndCollectAllParams === 'function' ? modObj.clientParamBuilder : null) ??
          mod;
        if (candidate && typeof candidate.processAndCollectAllParams === 'function') {
          return candidate as ClientParamBuilderApi;
        }
        return null;
      })
      .catch(() => {
        loadedBuilderPromise = null;
        return null;
      });
  }
  return loadedBuilderPromise;
}

function resolveCollectionUrl(explicitUrl?: string): string | null {
  if (typeof window === 'undefined') return explicitUrl ?? null;
  const currentUrl = explicitUrl || window.location.href;
  captureLandingFbclid(currentUrl);
  try {
    const parsed = new URL(currentUrl);
    if (parsed.searchParams.get('fbclid')?.trim()) {
      return currentUrl;
    }
  } catch {
    /* ignore */
  }
  // If soft navigation dropped ?fbclid before consent was granted and _fbc isn't set yet,
  // pass the in-memory landing URL captured on arrival so Meta's SDK builds _fbc accurately.
  if (!readCookieValue('_fbc') && !cachedParams.fbc) {
    const captured = getCapturedLandingUrlWithFbclid();
    if (captured) return captured;
  }
  return currentUrl;
}

/**
 * Ensures Meta's official client-side Parameter Builder runs (when consent is accepted)
 * to populate `_fbp` and `_fbc` cookies locally even if `fbevents.js` is blocked or slow.
 */
export async function ensureClientMetaParams(explicitUrl?: string): Promise<CachedClientParams> {
  if (typeof window === 'undefined' || !isAnalyticsConsentAccepted()) {
    cachedParams = {};
    lastCollectedUrl = null;
    inFlightCollect = null;
    return {};
  }

  const targetUrl = resolveCollectionUrl(explicitUrl) || '';
  if (
    lastCollectedUrl === targetUrl &&
    (readCookieValue('_fbp') || cachedParams.fbp)
  ) {
    return getClientMetaParamsSync();
  }

  if (inFlightCollect && inFlightCollect.url === targetUrl) {
    return inFlightCollect.promise;
  }

  const execute = async (): Promise<CachedClientParams> => {
    const builder = await loadClientParamBuilder();
    if (!builder || !isAnalyticsConsentAccepted()) {
      return getClientMetaParamsSync();
    }

    try {
      // Omit external IP lookup functions so everything remains 100% first-party & CSP compliant;
      // the server derives trusted client IP from headers via src/lib/client-ip.ts.
      const collected = await builder.processAndCollectAllParams(targetUrl);
      if (!isAnalyticsConsentAccepted()) {
        return {};
      }
      lastCollectedUrl = targetUrl;
      const fbc =
        sanitizeMetaParamCookie(readCookieValue('_fbc')) ??
        sanitizeMetaParamCookie(builder.getFbc?.()) ??
        sanitizeMetaParamCookie(collected?._fbc) ??
        cachedParams.fbc;
      const fbp =
        sanitizeMetaParamCookie(readCookieValue('_fbp')) ??
        sanitizeMetaParamCookie(builder.getFbp?.()) ??
        sanitizeMetaParamCookie(collected?._fbp) ??
        cachedParams.fbp;
      cachedParams = { fbc, fbp };
      return cachedParams;
    } catch {
      return getClientMetaParamsSync();
    } finally {
      if (inFlightCollect?.url === targetUrl) {
        inFlightCollect = null;
      }
    }
  };

  const run = execute();
  inFlightCollect = { url: targetUrl, promise: run };
  return run;
}

export function getClientMetaParamsSync(): CachedClientParams {
  if (typeof window === 'undefined' || !isAnalyticsConsentAccepted()) {
    cachedParams = {};
    lastCollectedUrl = null;
    return {};
  }
  const fbc = sanitizeMetaParamCookie(readCookieValue('_fbc')) ?? cachedParams.fbc;
  const fbp = sanitizeMetaParamCookie(readCookieValue('_fbp')) ?? cachedParams.fbp;
  if (fbc || fbp) {
    cachedParams = { fbc, fbp };
  }
  return { fbc, fbp };
}

export function getCleanClientEventSourceUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const parsed = new URL(window.location.href);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }
    return `${parsed.origin}${parsed.pathname}${parsed.search}`.slice(0, 2000);
  } catch {
    return undefined;
  }
}

/**
 * Collects consented Meta matching parameters (`metaFbc`, `metaFbp`, `metaExternalId`, `metaEventSourceUrl`)
 * right before form submission so server Conversions API requests always receive fresh parameters.
 */
export async function getConsentedSubmissionMetaParams(
  timeoutMs = 350,
): Promise<ConsentedSubmissionMetaParams> {
  if (typeof window === 'undefined' || !isAnalyticsConsentAccepted()) {
    cachedParams = {};
    return {};
  }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      ensureClientMetaParams(),
      new Promise<void>((resolve) => {
        timeoutHandle = setTimeout(resolve, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle !== undefined) {
      clearTimeout(timeoutHandle);
    }
  }

  if (!isAnalyticsConsentAccepted()) {
    cachedParams = {};
    return {};
  }

  const { fbc, fbp } = getClientMetaParamsSync();
  const metaExternalId = getOrCreateConsentedExternalId() || undefined;
  const metaEventSourceUrl = getCleanClientEventSourceUrl();

  return {
    ...(fbc ? { metaFbc: fbc } : {}),
    ...(fbp ? { metaFbp: fbp } : {}),
    ...(metaExternalId ? { metaExternalId } : {}),
    ...(metaEventSourceUrl ? { metaEventSourceUrl } : {}),
  };
}

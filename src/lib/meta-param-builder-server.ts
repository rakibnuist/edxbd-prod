import {
  ParamBuilder,
  PII_DATA_TYPE,
  type CookieSettings,
  type PiiDataType,
} from 'capi-param-builder-nodejs';
import type { NextResponse } from 'next/server';
import { extractClientIp } from './client-ip';
import {
  resolveAllowedOriginHosts,
  resolveCanonicalEventSourceUrl,
} from './meta-capi-policy';

export { PII_DATA_TYPE, type CookieSettings, type PiiDataType };

const DEFAULT_META_DOMAINS = ['eduexpressint.com'] as const;
const META_PARAM_ID_REGEX = /^fb\.\d+\.\d+\.[A-Za-z0-9._-]{4,460}$/;
const META_FBI_REGEX = /^[A-Za-z0-9.:_=-]{4,500}$/;
const META_PARAM_MAX_AGE_SECONDS = 7_776_000; // 90 days

export interface ServerMetaParamOverrides {
  fbc?: string | null;
  fbp?: string | null;
  externalId?: string | null;
  eventSourceUrl?: string | null;
}

export interface ServerMetaParamResult {
  fbc?: string;
  fbp?: string;
  clientIpAddress?: string;
  externalId?: string;
  cookiesToSet: CookieSettings[];
  eventSourceUrl: string;
  hashPii: (value: string | undefined | null, dataType: PiiDataType) => string | undefined;
}

export function sanitizeMetaParamValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return undefined;
  return META_PARAM_ID_REGEX.test(trimmed) ? trimmed : undefined;
}

function sanitizeFbiValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return undefined;
  return META_FBI_REGEX.test(trimmed) ? trimmed : undefined;
}

export function sanitizeMetaExternalId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 255 || /[\r\n\0]/.test(trimmed)) return undefined;
  return trimmed;
}

function readOptionalMetaString(
  obj: Record<string, unknown> | null | undefined,
  keys: string[],
  maxLength: number,
): string | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed && trimmed.length <= maxLength && !/[\r\n\0]/.test(trimmed)) {
        return trimmed;
      }
    }
  }
  return undefined;
}

/**
 * Extracts sanitized optional Parameter Builder overrides forwarded in form/API JSON payloads.
 */
export function extractMetaParamOverridesFromBody(
  body: Record<string, unknown> | null | undefined,
  nestedUserData?: Record<string, unknown> | null,
): ServerMetaParamOverrides {
  return {
    fbc:
      sanitizeMetaParamValue(readOptionalMetaString(body, ['metaFbc', 'fbc'], 500)) ??
      sanitizeMetaParamValue(readOptionalMetaString(nestedUserData, ['metaFbc', 'fbc'], 500)),
    fbp:
      sanitizeMetaParamValue(readOptionalMetaString(body, ['metaFbp', 'fbp'], 500)) ??
      sanitizeMetaParamValue(readOptionalMetaString(nestedUserData, ['metaFbp', 'fbp'], 500)),
    externalId:
      sanitizeMetaExternalId(
        readOptionalMetaString(body, ['metaExternalId', 'external_id', 'externalId'], 255),
      ) ??
      sanitizeMetaExternalId(
        readOptionalMetaString(nestedUserData, ['metaExternalId', 'external_id', 'externalId'], 255),
      ),
    eventSourceUrl:
      readOptionalMetaString(body, ['metaEventSourceUrl', 'event_source_url', 'eventSourceUrl', 'page_location'], 2048) ??
      readOptionalMetaString(nestedUserData, ['metaEventSourceUrl', 'event_source_url', 'eventSourceUrl'], 2048),
  };
}

export function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const name = trimmed.slice(0, eqIdx).trim();
    const rawValue = trimmed.slice(eqIdx + 1).trim();
    if (!name || !rawValue) continue;
    try {
      cookies[name] = decodeURIComponent(rawValue);
    } catch {
      cookies[name] = rawValue;
    }
  }
  return cookies;
}

function isIpOrLocalhost(host: string): boolean {
  const clean = host.toLowerCase().replace(/^\[|\]$/g, '');
  return (
    !clean ||
    clean === 'localhost' ||
    !clean.includes('.') ||
    /^\d+(?:\.\d+)+$/.test(clean) ||
    clean.includes(':')
  );
}

function resolveBuilderDomains(): { domains: string[]; allowedHosts: Set<string> } {
  const allowedHosts = new Set(
    resolveAllowedOriginHosts(null).map((host) => host.toLowerCase()),
  );
  const apexDomains = new Set<string>(DEFAULT_META_DOMAINS);

  for (const host of allowedHosts) {
    const hostname = host.split(':')[0]?.toLowerCase() || '';
    if (isIpOrLocalhost(hostname)) continue;
    const normalized = hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    if (normalized) apexDomains.add(normalized);
  }

  return {
    domains: Array.from(apexDomains),
    allowedHosts,
  };
}

function resolveSafeRequestHost(
  request: Request | undefined,
  canonicalEventSourceUrl: string,
  allowedHosts: Set<string>,
): string {
  const fallbackHost = (() => {
    try {
      return new URL(canonicalEventSourceUrl).host;
    } catch {
      return DEFAULT_META_DOMAINS[0];
    }
  })();

  if (!request) return fallbackHost;

  const candidate =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host')?.trim() ||
    '';
  const normalizedCandidate = candidate.toLowerCase();
  const candidateHostOnly = normalizedCandidate.split(':')[0] || '';

  if (allowedHosts.has(normalizedCandidate) || allowedHosts.has(candidateHostOnly)) {
    return normalizedCandidate;
  }
  return fallbackHost;
}

function collectQueries(
  request: Request | undefined,
  referer: string | null,
  eventSourceUrlOverride: string | null | undefined,
): Record<string, string> {
  const queries: Record<string, string> = {};
  const appendFromUrl = (rawUrl: string | null | undefined) => {
    if (!rawUrl) return;
    try {
      const parsed = rawUrl.startsWith('/')
        ? new URL(rawUrl, `https://${DEFAULT_META_DOMAINS[0]}`)
        : new URL(rawUrl);
      for (const [key, value] of parsed.searchParams.entries()) {
        if (value) {
          queries[key] = value;
        }
      }
    } catch {
      /* ignore invalid URL */
    }
  };

  // Precedence: HTTP Referer -> client eventSourceUrl override -> incoming API request URL
  appendFromUrl(referer);
  appendFromUrl(eventSourceUrlOverride);
  appendFromUrl(request?.url);
  return queries;
}

/**
 * Runs Meta's official server-side Parameter Builder (`capi-param-builder-nodejs`) for a request.
 * Only call when the visitor has granted analytics/tracking consent (or for consented lead records).
 */
export function buildServerMetaParams(
  request?: Request,
  overrides?: ServerMetaParamOverrides,
): ServerMetaParamResult {
  const { domains, allowedHosts } = resolveBuilderDomains();
  const paramBuilder = new ParamBuilder(domains);
  const rawEventSourceCandidate =
    overrides?.eventSourceUrl || request?.headers.get('referer') || request?.url;
  const eventSourceUrl = resolveCanonicalEventSourceUrl(rawEventSourceCandidate);

  const hashPii = (
    value: string | undefined | null,
    dataType: PiiDataType,
  ): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    // If a value already includes a Meta Parameter Builder appendix, keep as-is
    if (/^[a-f0-9]{64}\.[A-Za-z0-9+/=_-]+$/i.test(trimmed)) {
      return trimmed;
    }
    return paramBuilder.getNormalizedAndHashedPII(trimmed, dataType) ?? undefined;
  };

  const parsedCookies = parseCookieHeader(request?.headers.get('cookie'));
  const requestFbc = sanitizeMetaParamValue(parsedCookies._fbc);
  const requestFbp = sanitizeMetaParamValue(parsedCookies._fbp);
  const requestFbi = sanitizeFbiValue(parsedCookies._fbi);

  const overrideFbc = sanitizeMetaParamValue(overrides?.fbc);
  const overrideFbp = sanitizeMetaParamValue(overrides?.fbp);
  const externalId =
    sanitizeMetaExternalId(overrides?.externalId) ??
    sanitizeMetaExternalId(parsedCookies.ee_uid);

  const builderCookies: Record<string, string> = {};
  if (requestFbc) {
    builderCookies._fbc = requestFbc;
  } else if (overrideFbc) {
    builderCookies._fbc = overrideFbc;
  }
  if (requestFbp) {
    builderCookies._fbp = requestFbp;
  } else if (overrideFbp) {
    builderCookies._fbp = overrideFbp;
  }
  if (requestFbi) {
    builderCookies._fbi = requestFbi;
  }

  const referer = request?.headers.get('referer')?.trim() || null;
  const shouldProcess =
    Boolean(request) ||
    Boolean(overrideFbc) ||
    Boolean(overrideFbp) ||
    Boolean(overrides?.eventSourceUrl);

  let cookiesToSet: CookieSettings[] = [];
  if (shouldProcess) {
    const safeHost = resolveSafeRequestHost(request, eventSourceUrl, allowedHosts);
    const queries = collectQueries(request, referer, overrides?.eventSourceUrl);
    // Security (M-2): only pass validated IP derived from extractClientIp, never raw XFF headers.
    const trustedIp = request
      ? extractClientIp((name) => request.headers.get(name))
      : null;

    cookiesToSet = paramBuilder.processRequest(
      safeHost,
      queries,
      builderCookies,
      referer || overrides?.eventSourceUrl || null,
      trustedIp,
      trustedIp,
    );
  }

  const fbc =
    sanitizeMetaParamValue(paramBuilder.getFbc()) ?? requestFbc ?? overrideFbc;
  const fbp =
    sanitizeMetaParamValue(paramBuilder.getFbp()) ?? requestFbp ?? overrideFbp;
  const clientIpAddress = paramBuilder.getClientIpAddress() ?? undefined;

  if (request) {
    const defaultCookieDomain = (() => {
      const firstProdDomain = domains.find((d) => !isIpOrLocalhost(d));
      return firstProdDomain ?? '';
    })();
    if (fbc && !requestFbc && !cookiesToSet.some((c) => c.name === '_fbc')) {
      cookiesToSet.push({
        name: '_fbc',
        value: fbc,
        maxAge: META_PARAM_MAX_AGE_SECONDS,
        domain: defaultCookieDomain,
      });
    }
    if (fbp && !requestFbp && !cookiesToSet.some((c) => c.name === '_fbp')) {
      cookiesToSet.push({
        name: '_fbp',
        value: fbp,
        maxAge: META_PARAM_MAX_AGE_SECONDS,
        domain: defaultCookieDomain,
      });
    }
  }

  return {
    fbc,
    fbp,
    clientIpAddress,
    externalId,
    cookiesToSet,
    eventSourceUrl,
    hashPii,
  };
}

function resolveSetCookieDomain(
  candidateDomain: string | undefined,
  request: Request,
  allowedHosts: Set<string>,
): string | undefined {
  if (!candidateDomain) return undefined;
  const cleanDomain = candidateDomain.trim().replace(/^\.+/, '').toLowerCase();
  if (isIpOrLocalhost(cleanDomain)) return undefined;

  const requestHostHeader =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host')?.trim() ||
    '';
  const requestHostname = (
    requestHostHeader.split(':')[0] ||
    (() => {
      try {
        return new URL(request.url).hostname;
      } catch {
        return '';
      }
    })()
  ).toLowerCase();

  // Only emit Domain=<domain> when the incoming request actually serves that domain or its subdomain;
  // otherwise (e.g. localhost or preview hosts) fall back to host-only cookies so browsers accept them.
  if (
    requestHostname &&
    requestHostname !== cleanDomain &&
    !requestHostname.endsWith(`.${cleanDomain}`)
  ) {
    return undefined;
  }

  const isAllowlisted = Array.from(allowedHosts).some((allowed) => {
    const allowedHostname = allowed.split(':')[0]?.toLowerCase() || '';
    return allowedHostname === cleanDomain || allowedHostname.endsWith(`.${cleanDomain}`);
  });
  return isAllowlisted ? cleanDomain : undefined;
}

/**
 * Attaches `Set-Cookie` headers generated by Meta's Parameter Builder onto a `NextResponse`.
 * Keeps `httpOnly: false` so client-side `fbevents.js` and `clientParamBuilder` read matching values.
 */
export function applyMetaParamCookies<T extends NextResponse>(
  response: T,
  request: Request,
  cookiesToSet: CookieSettings[],
): T {
  if (!cookiesToSet || cookiesToSet.length === 0) return response;

  const allowedHosts = new Set(
    resolveAllowedOriginHosts(null).map((host) => host.toLowerCase()),
  );
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
    .toLowerCase();
  const hostHeader = (
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.headers.get('host')?.trim() ||
    ''
  ).toLowerCase();
  const hostname = hostHeader.split(':')[0] || '';
  const isLocalRequest = isIpOrLocalhost(hostname);
  const isHttps =
    forwardedProto === 'https' ||
    request.url.startsWith('https://') ||
    (!isLocalRequest && process.env.NODE_ENV === 'production');

  for (const cookie of cookiesToSet) {
    if (!cookie?.name || !cookie?.value) continue;
    const domain = resolveSetCookieDomain(cookie.domain, request, allowedHosts);
    response.cookies.set(cookie.name, cookie.value, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: isHttps,
      maxAge:
        typeof cookie.maxAge === 'number' && cookie.maxAge > 0
          ? cookie.maxAge
          : META_PARAM_MAX_AGE_SECONDS,
      ...(domain ? { domain } : {}),
    });
  }

  return response;
}

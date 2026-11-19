import { SITE_URL } from './site-urls';

const CANONICAL_ORIGIN = new URL(SITE_URL).origin;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '0:0:0:0:0:0:0:1']);
const REDIRECT_TO_CANONICAL_HOSTS = new Set([
  'www.eduexpressint.com',
  'eduexpress.info',
  'www.eduexpress.info',
]);
const CRM_LEGACY_HOSTS = new Set([
  'crm.eduexpressint.com',
  'www.crm.eduexpressint.com',
]);

export interface ProxyRedirectInput {
  hostHeader: string | null | undefined;
  forwardedProtoHeader: string | null | undefined;
  pathname: string;
  search: string;
}

/**
 * Normalize a raw HTTP `Host` header into a lowercase hostname without port.
 * Returns empty string for malformed headers (e.g. userinfo `@`, whitespace, paths, multiple hosts)
 * so attacker-crafted values can never match local bypass rules.
 */
export function normalizeHostHeader(hostHeader: string | null | undefined): string {
  const trimmed = (hostHeader || '').trim();
  if (!trimmed) return '';

  if (trimmed === '::1' || trimmed === '0:0:0:0:0:0:0:1') {
    return trimmed;
  }

  const ipv6Match = trimmed.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (ipv6Match) {
    const addr = ipv6Match[1].toLowerCase();
    return /^[0-9a-f:]+$/.test(addr) ? addr : '';
  }

  if (!/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(trimmed)) {
    return '';
  }

  return trimmed
    .replace(/:\d+$/, '')
    .replace(/\.$/, '')
    .toLowerCase();
}

export function isLocalHostname(normalizedHostname: string): boolean {
  if (!normalizedHostname) return false;
  return LOCAL_HOSTS.has(normalizedHostname) || normalizedHostname.endsWith('.localhost');
}

function buildCanonicalTargetUrl(pathname: string, search: string): string {
  const target = new URL(CANONICAL_ORIGIN);
  // Collapse leading slashes/backslashes so paths like //evil.com cannot form protocol-relative ambiguity.
  const strippedLeading = pathname.replace(/^[\\/]+/, '');
  target.pathname = `/${strippedLeading}`;
  if (search) {
    target.search = search.startsWith('?') ? search : `?${search}`;
  }
  if (target.origin !== CANONICAL_ORIGIN) {
    return CANONICAL_ORIGIN;
  }
  return target.toString();
}

function buildLegacyCrmTargetUrl(pathname: string): string {
  const cleanPath = pathname.replace(/^[\\/]+/, '');
  const trackMatch = cleanPath.match(/^(?:s|track)\/([^/?#]+)/i);
  if (trackMatch?.[1]) {
    let decoded = trackMatch[1];
    try {
      decoded = decodeURIComponent(trackMatch[1]);
    } catch {
      // Keep raw token segment on malformed percent encoding
    }
    return `${CANONICAL_ORIGIN}/track/${encodeURIComponent(decoded)}`;
  }
  return `${CANONICAL_ORIGIN}/admin/leads`;
}

/**
 * Compute an immutable-origin canonical redirect URL when HTTP upgrade or legacy/staging
 * host consolidation applies. Never interpolates request `Host` or `X-Forwarded-Host` into Location.
 */
export function resolveProxyRedirect(input: ProxyRedirectInput): string | null {
  const normalizedHost = normalizeHostHeader(input.hostHeader);
  const local = isLocalHostname(normalizedHost);
  const forwardedProto = (input.forwardedProtoHeader || '').split(',')[0].trim().toLowerCase();

  if (normalizedHost && CRM_LEGACY_HOSTS.has(normalizedHost)) {
    return buildLegacyCrmTargetUrl(input.pathname);
  }

  const needsHttpsUpgrade = !local && forwardedProto === 'http';
  const isSecondaryOrPreviewHost =
    Boolean(normalizedHost) &&
    (REDIRECT_TO_CANONICAL_HOSTS.has(normalizedHost) || normalizedHost.endsWith('.vercel.app'));

  if (needsHttpsUpgrade || isSecondaryOrPreviewHost) {
    return buildCanonicalTargetUrl(input.pathname, input.search);
  }

  return null;
}

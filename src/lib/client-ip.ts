import { isIP } from 'net';

export interface ExtractClientIpOptions {
  /**
   * Trust `CF-Connecting-IP` ahead of `X-Real-IP` only when the deployment sits
   * behind Cloudflare and `TRUST_CF_CONNECTING_IP=true` is explicitly configured.
   */
  trustCfConnectingIp?: boolean;
}

/**
 * Parse a single proxy/IP token (supporting optional `[ipv6]:port` or `ipv4:port`)
 * and validate it via Node's `net.isIP`. Returns canonical lowercase IP or null.
 */
export function parseValidatedIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const token = raw.trim();
  if (!token || token.length > 64) return null;

  let candidate = token;
  const bracketedIpv6 = token.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketedIpv6) {
    candidate = bracketedIpv6[1];
  } else {
    const ipv4WithPort = token.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
    if (ipv4WithPort) {
      candidate = ipv4WithPort[1];
    }
  }

  return isIP(candidate) !== 0 ? candidate.toLowerCase() : null;
}

function isPrivateIpv4(ipv4: string): boolean {
  const parts = ipv4.split('.').map(Number);
  if (parts.length !== 4 || parts.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return false;
  }
  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

/**
 * Identify loopback / RFC1918 / link-local / ULA addresses typically appended by
 * internal reverse proxies or Docker bridges.
 */
export function isPrivateOrLoopbackIp(ip: string): boolean {
  const lower = ip.trim().toLowerCase();
  if (!lower) return false;

  if (lower.startsWith('::ffff:')) {
    const mapped = lower.slice('::ffff:'.length);
    if (isIP(mapped) === 4) {
      return isPrivateIpv4(mapped);
    }
    // Hex-encoded IPv4-mapped IPv6 form (e.g. ::ffff:0a00:0001 or ::ffff:7f00:1)
    const hexMatch = mapped.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hexMatch) {
      const hi = Number.parseInt(hexMatch[1], 16);
      const lo = Number.parseInt(hexMatch[2], 16);
      const a = (hi >> 8) & 0xff;
      const b = hi & 0xff;
      const c = (lo >> 8) & 0xff;
      const d = lo & 0xff;
      return isPrivateIpv4(`${a}.${b}.${c}.${d}`);
    }
  }

  if (isIP(lower) === 4) {
    return isPrivateIpv4(lower);
  }

  if (lower === '::1' || lower === '::' || lower === '0:0:0:0:0:0:0:1') {
    return true;
  }

  // Unique local IPv6 (fc00::/7) and link-local (fe80::/10)
  return /^(?:fc|fd)[0-9a-f]{2}:/.test(lower) || /^fe[89ab][0-9a-f]:/.test(lower);
}

function extractRightmostTrustedXffIp(rawXff: string | null | undefined): string | null {
  if (!rawXff) return null;
  const hops = rawXff
    .split(',')
    .map((entry) => parseValidatedIp(entry))
    .filter((ip): ip is string => Boolean(ip));

  if (hops.length === 0) return null;

  // Walk right-to-left (proxy-appended side first) skipping internal proxy hops so
  // client-prepended leftmost X-Forwarded-For values cannot spoof the caller IP.
  for (let i = hops.length - 1; i >= 0; i -= 1) {
    if (!isPrivateOrLoopbackIp(hops[i])) {
      return hops[i];
    }
  }

  return hops[hops.length - 1];
}

/**
 * Extract the best-available validated client IP without trusting leftmost XFF spoofing
 * or unconfigured CDN headers.
 */
export function extractClientIp(
  getHeader: (name: string) => string | null | undefined,
  options?: ExtractClientIpOptions,
): string | null {
  const trustCf = options?.trustCfConnectingIp ?? process.env.TRUST_CF_CONNECTING_IP === 'true';

  if (trustCf) {
    const cfIp = parseValidatedIp(getHeader('cf-connecting-ip'));
    if (cfIp) return cfIp;
  }

  // Traefik sets/overwrites X-Real-IP with the peer IP of the TCP connection.
  const realIp = parseValidatedIp(getHeader('x-real-ip'));
  if (realIp) return realIp;

  const xffIp = extractRightmostTrustedXffIp(getHeader('x-forwarded-for'));
  if (xffIp) return xffIp;

  // Fall back to CF-Connecting-IP only when no Traefik/XFF IP was supplied.
  return parseValidatedIp(getHeader('cf-connecting-ip'));
}

export function extractSanitizedClientIp(getHeader: (name: string) => string | null): string {
  return extractClientIp(getHeader) ?? 'unknown';
}

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const SITE_ORIGIN = 'https://eduexpressint.com';

/**
 * Parse and allowlist external web links (`http:` and `https:` only).
 * Rejects `javascript:`, `data:`, `vbscript:`, protocol-relative URLs,
 * control characters, embedded credentials, and non-URL strings.
 */
export function toSafeExternalUrl(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength || CONTROL_CHARS.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    if (!parsed.hostname || parsed.username || parsed.password) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Allow either a safe single-slash site-relative path (`/uploads/...`) or a valid
 * `http:` / `https:` external URL. Rejects protocol-relative `//evil.com` and `/\evil.com`.
 */
export function toSafeSitePathOrUrl(value: unknown, maxLength = 2000): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength || CONTROL_CHARS.test(trimmed)) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
      return null;
    }
    try {
      const resolved = new URL(trimmed, SITE_ORIGIN);
      return resolved.origin === SITE_ORIGIN ? trimmed : null;
    } catch {
      return null;
    }
  }

  return toSafeExternalUrl(trimmed, maxLength);
}

/** Filter and deduplicate an array of candidate external URLs, keeping only `http(s):` links. */
export function toSafeExternalUrlList(values: unknown, maxItems = 50, maxLength = 2000): string[] {
  if (!Array.isArray(values)) return [];
  const result: string[] = [];
  const seen = new Set<string>();
  for (const item of values) {
    const safe = toSafeExternalUrl(item, maxLength);
    if (!safe || seen.has(safe)) continue;
    seen.add(safe);
    result.push(safe);
    if (result.length >= maxItems) break;
  }
  return result;
}

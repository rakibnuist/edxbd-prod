/**
 * Who may send which Meta Conversions API events through /api/meta-capi.
 *
 * The route signs events with the server's access token, so Meta treats them
 * as first-party server data. Anonymous browsers may only report what a
 * visitor can actually do on the site (view a page or content, start a contact
 * or submit an enquiry). Business-outcome and value events (Purchase,
 * SubmitApplication, CompleteRegistration, …) need an admin session or token,
 * matching /api/meta-conversion. Custom data is rebuilt from an allowlist so a
 * caller cannot attach arbitrary values, currencies or raw form fields.
 *
 * Pure functions with no framework imports so node:test can exercise them.
 */

export type CapiAccess = 'public' | 'admin';

export interface ResolvedCapiEvent {
  eventName: string;
  access: CapiAccess;
}

/** Events an anonymous visitor's browser legitimately sends (input name → Meta name). */
const PUBLIC_EVENTS: Record<string, string> = {
  page_view: 'PageView',
  PageView: 'PageView',
  ViewContent: 'ViewContent',
  Contact: 'Contact',
  study_abroad_lead: 'Lead',
  Lead: 'Lead',
};

/** Events that state a business outcome or carry a value: admin only. */
const ADMIN_EVENTS: Record<string, string> = {
  CompleteRegistration: 'CompleteRegistration',
  Schedule: 'Schedule',
  AddToCart: 'AddToCart',
  Purchase: 'Purchase',
  Subscribe: 'Subscribe',
  AddToWishlist: 'AddToWishlist',
  InitiateCheckout: 'InitiateCheckout',
  Search: 'Search',
  FindLocation: 'FindLocation',
  SubmitApplication: 'SubmitApplication',
};

const has = (record: Record<string, string>, key: string) => Object.prototype.hasOwnProperty.call(record, key);

export function resolveCapiEvent(input: unknown): ResolvedCapiEvent | null {
  if (typeof input !== 'string') return null;
  if (has(PUBLIC_EVENTS, input)) return { eventName: PUBLIC_EVENTS[input], access: 'public' };
  if (has(ADMIN_EVENTS, input)) return { eventName: ADMIN_EVENTS[input], access: 'admin' };
  return null;
}

/** Descriptive, non-personal labels the site's tracking calls attach. */
const TEXT_KEYS = [
  'content_name',
  'content_category',
  'content_type',
  'page_title',
  'page_category',
  'source',
  'study_destination',
  'program_interest',
  'contact_method',
  'destination_country',
  'university_name',
] as const;
const BOOLEAN_KEYS = ['has_message'] as const;
const MAX_TEXT = 200;
const MAX_VALUE = 10_000_000;

/**
 * Rebuild custom_data from known keys only. Free-text form fields (name,
 * email, phone, message, …) are dropped: personal data belongs in user_data,
 * where it is hashed. `value`/`currency` are accepted only for admin events.
 */
export function pickCustomData(raw: unknown, access: CapiAccess): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const input = raw as Record<string, unknown>;

  for (const key of TEXT_KEYS) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) out[key] = value.trim().slice(0, MAX_TEXT);
  }
  for (const key of BOOLEAN_KEYS) {
    if (typeof input[key] === 'boolean') out[key] = input[key] as boolean;
  }

  if (access === 'admin') {
    const value = typeof input.value === 'string' && input.value.trim() !== '' ? Number(input.value) : input.value;
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_VALUE) out.value = value;
    if (typeof input.currency === 'string' && /^[A-Za-z]{3}$/.test(input.currency.trim())) {
      out.currency = input.currency.trim().toUpperCase();
    }
  }

  return out;
}

export type OriginVerdict = 'same-origin' | 'cross-site' | 'unknown';

/**
 * Classify where a request came from using the headers browsers set and page
 * scripts cannot override (`Origin`, `Sec-Fetch-Site`).
 *
 * - `cross-site`: a browser on another site (or an opaque origin) sent it.
 * - `same-origin`: a page on one of `allowedHosts` sent it.
 * - `unknown`: no browser provenance at all (curl, server-to-server).
 *
 * Non-browser clients can forge these headers, so this is a CSRF / drive-by
 * guard, not authentication; the admin check is what protects value events.
 */
export function classifyRequestOrigin(headers: Headers, allowedHosts: Iterable<string>): OriginVerdict {
  const allowed = new Set([...allowedHosts].filter(Boolean).map(host => host.trim().toLowerCase()));
  const fetchSite = headers.get('sec-fetch-site')?.trim().toLowerCase();
  if (fetchSite && fetchSite !== 'same-origin') return 'cross-site';

  const origin = headers.get('origin')?.trim();
  if (origin && origin !== 'null') {
    try {
      const url = new URL(origin);
      if ((url.protocol === 'https:' || url.protocol === 'http:') && allowed.has(url.host.toLowerCase())) return 'same-origin';
    } catch {
      // Malformed Origin header: treat as foreign.
    }
    return 'cross-site';
  }

  // Origin is absent or "null" (e.g. a no-referrer policy): only Fetch
  // Metadata can vouch for the request.
  if (fetchSite === 'same-origin') return 'same-origin';
  return origin === 'null' ? 'cross-site' : 'unknown';
}

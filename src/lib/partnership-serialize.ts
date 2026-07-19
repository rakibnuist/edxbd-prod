// Partnership stores several list-type fields as JSON strings in SQLite.
// The admin UI expects arrays (it calls .map on them), so parse on read.

const JSON_ARRAY_FIELDS = [
  'targetCountries',
  'currentPartners',
  'marketingChannels',
  'socialMediaPresence',
  'referralSources',
  'documents',
] as const;

const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
};

export function serializePartnership<T extends Record<string, unknown>>(p: T): T {
  const out: Record<string, unknown> = { ...p };
  for (const f of JSON_ARRAY_FIELDS) out[f] = toArray(p[f]);
  return out as T;
}

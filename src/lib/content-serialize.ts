// Content stores tags/categories/sourceUrls as JSON strings in SQLite,
// but the admin UI works with arrays. These helpers convert between the two.

// Relative import keeps this helper loadable by the node:test scripts.
import { normalizeContentAuthor } from './content-author';
import { sanitizeUpdateHtml } from './content-html';
import { toSafeExternalUrl, toSafeExternalUrlList, toSafeSitePathOrUrl } from './safe-url';

const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
};

export const serializeContent = (c: Record<string, unknown>): Record<string, unknown> => ({
  ...c,
  tags: toArray(c.tags),
  categories: toArray(c.categories),
  sourceUrls: toArray(c.sourceUrls),
});

// Validate URLs submitted to admin content APIs before persisting.
export const validateContentUrls = (body: Record<string, unknown>): string | null => {
  if ('sourceUrls' in body && body.sourceUrls !== undefined && body.sourceUrls !== null) {
    for (const item of toArray(body.sourceUrls)) {
      if (typeof item !== 'string') return 'Every source URL must be a string.';
      if (item.trim() && !toSafeExternalUrl(item)) {
        return 'Every source URL must be a valid http:// or https:// URL.';
      }
    }
  }
  if ('featuredImage' in body && body.featuredImage !== undefined && body.featuredImage !== null) {
    if (typeof body.featuredImage !== 'string') return 'Featured image URL must be a string.';
    if (body.featuredImage.trim() && !toSafeSitePathOrUrl(body.featuredImage)) {
      return 'Featured image URL must be a safe site path (/...) or an http(s) URL.';
    }
  }
  return null;
};

// Build a clean Prisma payload from client input (arrays -> JSON strings).
export const toContentData = (body: Record<string, unknown>, partial = false) => {
  const s = (v: unknown) => JSON.stringify(toArray(v));
  const safeSources = (v: unknown) => JSON.stringify(toSafeExternalUrlList(toArray(v)));
  const date = (value: unknown) => value ? new Date(String(value)) : null;
  const all: Record<string, unknown> = {
    title: body.title,
    slug: body.slug,
    // Article bodies are rendered as HTML for every visitor: store only the
    // allowlisted markup (render paths sanitise again for older rows).
    content: typeof body.content === 'string' ? sanitizeUpdateHtml(body.content) : body.content,
    excerpt: body.excerpt ?? null,
    type: body.type || 'update',
    category: body.category ?? null,
    tags: s(body.tags),
    categories: s(body.categories),
    featuredImage: toSafeSitePathOrUrl(body.featuredImage) ?? null,
    isPublished: body.isPublished ?? false,
    isFeatured: body.isFeatured ?? false,
    metaTitle: body.metaTitle ?? null,
    metaDescription: body.metaDescription ?? null,
    author: normalizeContentAuthor(body.author),
    reviewer: body.reviewer ?? null,
    sourceUrls: safeSources(body.sourceUrls),
    lastVerifiedAt: date(body.lastVerifiedAt),
    nextReviewAt: date(body.nextReviewAt),
    expiresAt: date(body.expiresAt),
    deadlineAt: date(body.deadlineAt),
    complianceApprovedAt: date(body.complianceApprovedAt),
    seoApprovedAt: date(body.seoApprovedAt),
  };
  if (!partial) return all;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(all)) {
    if (key in body) out[key] = all[key];
  }
  return out;
};

// Content stores tags/categories/sourceUrls as JSON strings in SQLite,
// but the admin UI works with arrays. These helpers convert between the two.

const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string' && v.trim()) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
};

export const serializeContent = (c: Record<string, unknown>) => ({
  ...c,
  tags: toArray(c.tags),
  categories: toArray(c.categories),
  sourceUrls: toArray(c.sourceUrls),
});

// Build a clean Prisma payload from client input (arrays -> JSON strings).
export const toContentData = (body: Record<string, unknown>, partial = false) => {
  const s = (v: unknown) => JSON.stringify(toArray(v));
  const all: Record<string, unknown> = {
    title: body.title,
    slug: body.slug,
    content: body.content,
    excerpt: body.excerpt ?? null,
    type: body.type || 'post',
    category: body.category ?? null,
    tags: s(body.tags),
    categories: s(body.categories),
    featuredImage: body.featuredImage ?? null,
    isPublished: body.isPublished ?? false,
    isFeatured: body.isFeatured ?? false,
    metaTitle: body.metaTitle ?? null,
    metaDescription: body.metaDescription ?? null,
    author: body.author || 'Admin',
    reviewer: body.reviewer ?? null,
    sourceUrls: s(body.sourceUrls),
  };
  if (!partial) return all;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(all)) {
    if (key in body) out[key] = all[key];
  }
  return out;
};

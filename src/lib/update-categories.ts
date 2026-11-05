// Category labels live on content records as free strings ("Announcement",
// "Student guide", …). Category archive URLs need a stable slug for each
// label, and every consumer (list cards, archive pages, sitemap) must agree
// on the same convention, so the helpers live here.
//
// Records carry the list in two shapes depending on the caller: Prisma rows
// hold a JSON string, serialized Update objects hold an array. The extraction
// helper accepts both, mirroring toList() in content-governance.ts.

export const categorySlug = (label: string) => {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // Merge the announcements/announcement spelling variants onto one archive
  return slug === 'announcements' ? 'announcement' : slug || 'general';
};

export const categoryLabelList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).map(item => item.trim()).filter(Boolean);
    } catch {
      return value.split('\n').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
};

export const categoriesFromUpdate = (
  update: { category?: string | null; categories?: unknown },
): string[] => [
  update.category,
  ...categoryLabelList(update.categories),
].filter((value): value is string => Boolean(value?.trim()));

export const categoryHref = (label: string) => `/updates/category/${categorySlug(label)}`;

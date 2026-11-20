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

const UPPERCASE_CATEGORY_TOKENS = new Set(['csc', 'csca', 'mbbs', 'stem', 'emgs', 'hsk', 'ielts', 'uk', 'phd', 'b2b']);

export const formatUpdateCategoryLabel = (raw?: string | null): string => {
  const cleaned = String(raw || '').trim();
  if (!cleaned) return 'Update';
  const slug = cleaned.toLowerCase();
  if (slug === 'announcements' || slug === 'announcement') return 'Announcement';
  if (UPPERCASE_CATEGORY_TOKENS.has(slug)) return slug.toUpperCase();
  return cleaned
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (UPPERCASE_CATEGORY_TOKENS.has(lower)) return lower.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const categoriesFromUpdate = (
  update: { category?: string | null; categories?: unknown },
): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [update.category, ...categoryLabelList(update.categories)]) {
    if (!raw?.trim()) continue;
    const label = formatUpdateCategoryLabel(raw);
    const key = categorySlug(label);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
};

export const categoryHref = (label: string) => `/updates/category/${categorySlug(label)}`;

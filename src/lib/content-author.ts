const GENERIC_AUTHOR = /^(admin|administrator|eduexpress)$/i;

const LEGACY_AUTHOR_MAP: Array<[RegExp, string]> = [
  [/^(?:md\.?\s+)?tauhidul\s+islam(?:\s+nur)?$/i, 'Afsana Meme'],
  [/^jannatun\s+ema$/i, 'Shamoyla Narmin'],
  [/^(?:md\.?\s+)?abdullah\s+al\s+razib$/i, 'Abdullah Al Rakib'],
  [/^(?:md\.?\s+)?taj\s+ahmed$/i, 'Md Taj Ahmmed'],
  [/^mim$/i, 'Shamoyla Narmin'],
];

/** Replace blank, generic admin, or legacy staff bylines with canonical team or organization identity. */
export const normalizeContentAuthor = (author?: unknown): string => {
  const trimmed = typeof author === 'string' ? author.trim() : '';
  if (!trimmed || GENERIC_AUTHOR.test(trimmed)) {
    return 'EduExpress International';
  }
  for (const [pattern, canonical] of LEGACY_AUTHOR_MAP) {
    if (pattern.test(trimmed)) return canonical;
  }
  return trimmed;
};

/** True when a content byline refers to the organization rather than a named individual. */
export const isOrganizationContentAuthor = (author?: unknown): boolean => {
  const normalized = normalizeContentAuthor(author);
  return normalized.toLowerCase().includes('eduexpress') || /^editorial$/i.test(normalized);
};

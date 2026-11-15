const GENERIC_AUTHOR = /^(admin|administrator|eduexpress)$/i;

/** Replace blank or generic admin bylines with the organization name for E-E-A-T consistency. */
export const normalizeContentAuthor = (author?: unknown): string => {
  const trimmed = typeof author === 'string' ? author.trim() : '';
  if (!trimmed || GENERIC_AUTHOR.test(trimmed)) {
    return 'EduExpress International';
  }
  return trimmed;
};

/** True when a content byline refers to the organization rather than a named individual. */
export const isOrganizationContentAuthor = (author?: unknown): boolean => {
  const normalized = normalizeContentAuthor(author);
  return normalized.toLowerCase().includes('eduexpress') || /^editorial$/i.test(normalized);
};

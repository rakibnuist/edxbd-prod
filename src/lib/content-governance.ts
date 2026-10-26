import type { Content } from '@prisma/client';

const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).map(item => item.trim()).filter(Boolean);
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).map(item => item.trim()).filter(Boolean) : [];
  } catch {
    return value.split('\n').map(item => item.trim()).filter(Boolean);
  }
};

const validDate = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export type ContentCandidate = Partial<Content> & {
  sourceUrls?: unknown;
  isPublished?: boolean;
};

export function contentPublicationErrors(candidate: ContentCandidate, now = new Date()): string[] {
  if (candidate.isPublished !== true) return [];

  const errors: string[] = [];
  const sources = toList(candidate.sourceUrls);
  const checkedAt = validDate(candidate.lastVerifiedAt);
  const nextReviewAt = validDate(candidate.nextReviewAt);
  const expiresAt = validDate(candidate.expiresAt);

  if (!String(candidate.reviewer || '').trim()) errors.push('Add the named reviewer.');
  if (!sources.some(source => /^https?:\/\//i.test(source))) errors.push('Add at least one official source URL.');
  if (!checkedAt) errors.push('Add the information checked date.');
  if (!nextReviewAt) errors.push('Add the next review date.');
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  if (nextReviewAt && nextReviewAt.getTime() < today.getTime()) errors.push('The next review date must be today or later.');
  if (expiresAt && expiresAt.getTime() < today.getTime()) errors.push('Expired content cannot be published as current.');
  if (!candidate.complianceApprovedAt) errors.push('Management compliance approval is required.');
  if (!candidate.seoApprovedAt) errors.push('SEO approval is required.');

  return errors;
}

export const currentVerifiedContentWhere = (now = new Date()) => {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  return ({
  isPublished: true,
  reviewer: { not: null },
  lastVerifiedAt: { not: null },
  nextReviewAt: { gte: today },
  complianceApprovedAt: { not: null },
  seoApprovedAt: { not: null },
  AND: [
    { sourceUrls: { not: null } },
    { sourceUrls: { not: '[]' } },
    {
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: today } },
      ],
    },
  ],
  });
};

// Publication policy (owner decision, 26 Oct 2026): everything published and
// unexpired is publicly visible. The strict set above is used for CTA-only
// decisions that need full verification; public surfaces query this relaxed
// set and the UI shows a truthful "editorial review in progress" note on
// records without complete verification data. The admin publication gate
// (contentPublicationErrors) is unchanged — new content still needs full data.
export const currentVisibleContentWhere = (now = new Date()) => {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  return ({
    isPublished: true,
    AND: [
      {
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: today } },
        ],
      },
    ],
  });
};

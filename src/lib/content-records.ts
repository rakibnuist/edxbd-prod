import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import type { Update } from '@/lib/types';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { sanitizeUpdateHtml } from '@/lib/content-html';

const parseList = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
};

export const serializeUpdate = (record: Awaited<ReturnType<typeof prisma.content.findFirst>>): Update | null => {
  if (!record) return null;
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    type: record.type,
    content: sanitizeUpdateHtml(record.content),
    excerpt: record.excerpt || undefined,
    metaDescription: record.metaDescription || undefined,
    category: record.category || undefined,
    categories: parseList(record.categories),
    tags: parseList(record.tags),
    sourceUrls: parseList(record.sourceUrls),
    featuredImage: record.featuredImage || undefined,
    isFeatured: record.isFeatured,
    author: record.author,
    reviewer: record.reviewer || undefined,
    publishedAt: record.publishedAt?.toISOString(),
    archived: Boolean(record.archivedAt),
    lastVerifiedAt: record.lastVerifiedAt?.toISOString(),
    nextReviewAt: record.nextReviewAt?.toISOString(),
    expiresAt: record.expiresAt?.toISOString(),
    complianceApprovedAt: record.complianceApprovedAt?.toISOString(),
    seoApprovedAt: record.seoApprovedAt?.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    views: record.views,
  };
};

export const getPublishedUpdates = cache(async (take?: number, prioritizeFeatured = true): Promise<Update[]> => {
  const records = await prisma.content.findMany({
    where: { type: { in: ['update', 'article'] }, ...currentVisibleContentWhere() },
    orderBy: prioritizeFeatured
      ? [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }]
      : [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    ...(take ? { take } : {}),
  });

  return records.map(record => serializeUpdate(record)).filter((record): record is Update => Boolean(record));
});

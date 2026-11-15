import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import type { Update } from '@/lib/types';
import { normalizeContentAuthor } from '@/lib/content-author';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { sanitizeUpdateHtml } from '@/lib/content-html';
import { categoriesFromUpdate, categorySlug } from '@/lib/update-categories';
import { CGS_2027_TYPE_A_SLUG, CGS_2027_TYPE_A_DATA } from '@/data/cgsTypeAGuide2027';

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
    author: normalizeContentAuthor(record.author),
    reviewer: record.reviewer || undefined,
    publishedAt: record.publishedAt?.toISOString(),
    archived: Boolean(record.archivedAt),
    lastVerifiedAt: record.lastVerifiedAt?.toISOString(),
    nextReviewAt: record.nextReviewAt?.toISOString(),
    expiresAt: record.expiresAt?.toISOString(),
    deadlineAt: record.deadlineAt?.toISOString(),
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

  const serialized = records.map(record => serializeUpdate(record)).filter((record): record is Update => Boolean(record));
  if (!serialized.some(u => u.slug === CGS_2027_TYPE_A_SLUG)) {
    const fallback = serializeUpdate(CGS_2027_TYPE_A_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  return take ? serialized.slice(0, take) : serialized;
});

/** Unarchived indexable updates and derived category archive slugs shared by sitemaps. */
export const getIndexableUpdatesForSitemap = cache(async () => {
  const updates = await prisma.content.findMany({
    where: { type: { in: ['update', 'article'] }, archivedAt: null, ...currentVisibleContentWhere() },
    select: { slug: true, updatedAt: true, publishedAt: true, category: true, categories: true },
  });
  if (!updates.some(u => u.slug === CGS_2027_TYPE_A_SLUG)) {
    updates.unshift({
      slug: CGS_2027_TYPE_A_DATA.slug,
      updatedAt: CGS_2027_TYPE_A_DATA.updatedAt,
      publishedAt: CGS_2027_TYPE_A_DATA.publishedAt,
      category: CGS_2027_TYPE_A_DATA.category,
      categories: CGS_2027_TYPE_A_DATA.categories,
    });
  }
  const categorySlugs = Array.from(
    new Set(updates.flatMap(post => categoriesFromUpdate(post)).map(label => categorySlug(label))),
  );
  return { updates, categorySlugs };
});

import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import type { Update } from '@/lib/types';
import { normalizeContentAuthor } from '@/lib/content-author';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { sanitizeUpdateHtml } from '@/lib/content-html';
import { categoriesFromUpdate, categorySlug } from '@/lib/update-categories';
import { CGS_2027_TYPE_A_SLUG, CGS_2027_TYPE_A_DATA } from '@/data/cgsTypeAGuide2027';
import { CMU_2027_SLUG, CMU_2027_DATA } from '@/data/cmuGuide2027';
import { SDJU_2027_SLUG, SDJU_2027_DATA } from '@/data/sdjuLanguageGuide2027';
import { NJUST_2027_SLUG, NJUST_2027_DATA } from '@/data/njustGuide2027';
import { NEW_GUIDES_2027_DATA } from '@/data/newGuides2027';
import { TOP_MS_CS_AI_2027_SLUG, TOP_MS_CS_AI_2027_DATA } from '@/data/topMsCsAiChina2027Guide';
import { OPEN_UNIVERSITIES_2027_SLUG, OPEN_UNIVERSITIES_2027_DATA } from '@/data/chinaUniversitiesOpen2027Guide';

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
  if (!serialized.some(u => u.slug === NJUST_2027_SLUG)) {
    const fallback = serializeUpdate(NJUST_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  for (const [slug, data] of Object.entries(NEW_GUIDES_2027_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  if (!serialized.some(u => u.slug === SDJU_2027_SLUG)) {
    const fallback = serializeUpdate(SDJU_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CMU_2027_SLUG)) {
    const fallback = serializeUpdate(CMU_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CGS_2027_TYPE_A_SLUG)) {
    const fallback = serializeUpdate(CGS_2027_TYPE_A_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === TOP_MS_CS_AI_2027_SLUG)) {
    const fallback = serializeUpdate(TOP_MS_CS_AI_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === OPEN_UNIVERSITIES_2027_SLUG)) {
    const fallback = serializeUpdate(OPEN_UNIVERSITIES_2027_DATA);
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
  if (!updates.some(u => u.slug === NJUST_2027_SLUG)) {
    updates.unshift({
      slug: NJUST_2027_DATA.slug,
      updatedAt: NJUST_2027_DATA.updatedAt,
      publishedAt: NJUST_2027_DATA.publishedAt,
      category: NJUST_2027_DATA.category,
      categories: NJUST_2027_DATA.categories,
    });
  }
  for (const [slug, data] of Object.entries(NEW_GUIDES_2027_DATA)) {
    if (!updates.some(u => u.slug === slug)) {
      updates.unshift({
        slug: data.slug,
        updatedAt: data.updatedAt,
        publishedAt: data.publishedAt,
        category: data.category,
        categories: data.categories,
      });
    }
  }
  if (!updates.some(u => u.slug === SDJU_2027_SLUG)) {
    updates.unshift({
      slug: SDJU_2027_DATA.slug,
      updatedAt: SDJU_2027_DATA.updatedAt,
      publishedAt: SDJU_2027_DATA.publishedAt,
      category: SDJU_2027_DATA.category,
      categories: SDJU_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CMU_2027_SLUG)) {
    updates.unshift({
      slug: CMU_2027_DATA.slug,
      updatedAt: CMU_2027_DATA.updatedAt,
      publishedAt: CMU_2027_DATA.publishedAt,
      category: CMU_2027_DATA.category,
      categories: CMU_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CGS_2027_TYPE_A_SLUG)) {
    updates.unshift({
      slug: CGS_2027_TYPE_A_DATA.slug,
      updatedAt: CGS_2027_TYPE_A_DATA.updatedAt,
      publishedAt: CGS_2027_TYPE_A_DATA.publishedAt,
      category: CGS_2027_TYPE_A_DATA.category,
      categories: CGS_2027_TYPE_A_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === TOP_MS_CS_AI_2027_SLUG)) {
    updates.unshift({
      slug: TOP_MS_CS_AI_2027_DATA.slug,
      updatedAt: TOP_MS_CS_AI_2027_DATA.updatedAt,
      publishedAt: TOP_MS_CS_AI_2027_DATA.publishedAt,
      category: TOP_MS_CS_AI_2027_DATA.category,
      categories: TOP_MS_CS_AI_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === OPEN_UNIVERSITIES_2027_SLUG)) {
    updates.unshift({
      slug: OPEN_UNIVERSITIES_2027_DATA.slug,
      updatedAt: OPEN_UNIVERSITIES_2027_DATA.updatedAt,
      publishedAt: OPEN_UNIVERSITIES_2027_DATA.publishedAt,
      category: OPEN_UNIVERSITIES_2027_DATA.category,
      categories: OPEN_UNIVERSITIES_2027_DATA.categories,
    });
  }
  const categorySlugs = Array.from(
    new Set(updates.flatMap(post => categoriesFromUpdate(post)).map(label => categorySlug(label))),
  );
  return { updates, categorySlugs };
});

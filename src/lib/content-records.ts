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
import { WECHAT_15_GUIDES_DATA } from '@/data/newWechatGuides2027';
import { WECHAT_BATCH2_18_GUIDES_DATA } from '@/data/newWechatBatch2Guides2027';
import { WECHAT_BATCH3_25_GUIDES_DATA } from '@/data/newWechatBatch3Guides2027';
import { WECHAT_BATCH4_9_GUIDES_DATA } from '@/data/newWechatBatch4Guides2027';
import { WECHAT_BATCH5_7_GUIDES_DATA } from '@/data/newWechatBatch5Guides2027';
import { WECHAT_BATCH6_5_GUIDES_DATA } from '@/data/newWechatBatch6Guides2027';
import { SHENYANG_CITY_UNIVERSITY_GUIDE_DATA } from '@/data/shenyangCityUniversityGuide2027';
import { TOP_MS_CS_AI_2027_SLUG, TOP_MS_CS_AI_2027_DATA } from '@/data/topMsCsAiChina2027Guide';
import { OPEN_UNIVERSITIES_2027_SLUG, OPEN_UNIVERSITIES_2027_DATA } from '@/data/chinaUniversitiesOpen2027Guide';
import { CSC_UNIVERSITY_LIST_2027_SLUG, CSC_UNIVERSITY_LIST_2027_DATA } from '@/data/cscUniversityList2027Guide';
import { CONFUCIUS_SCHOLARSHIP_2027_SLUG, CONFUCIUS_SCHOLARSHIP_2027_DATA } from '@/data/confuciusInstituteScholarship2027Guide';
import { FOUNDATION_SCHOLARSHIPS_SLUG, FOUNDATION_SCHOLARSHIPS_DATA } from '@/data/foundationYearScholarshipsGuide';
import { MALAYSIA_UNIVERSITIES_2027_SLUG, MALAYSIA_UNIVERSITIES_2027_DATA } from '@/data/malaysiaUniversities2027Guide';
import { GKS_SCHOLARSHIP_2027_SLUG, GKS_SCHOLARSHIP_2027_DATA } from '@/data/gksScholarship2027Guide';
import { CHINA_BACHELOR_SCHOLARSHIPS_2027_SLUG, CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA } from '@/data/chinaBachelorDegreeScholarships2027Guide';
import { GEORGIA_MBBS_FEES_2027_SLUG, GEORGIA_MBBS_FEES_2027_DATA } from '@/data/georgiaMbbsFees2027Guide';
import { CUHK_PROGRAMS_2027_SLUG, CUHK_PROGRAMS_2027_DATA } from '@/data/cuhkProgramsGuide2027';
import { UK_RED_BRICK_2027_SLUG, UK_RED_BRICK_2027_DATA } from '@/data/ukRedBrickUniversitiesGuide2027';
import { CHINA_MBBS_ADMISSION_2027_SLUG, CHINA_MBBS_ADMISSION_2027_DATA } from '@/data/chinaMbbsAdmissionGuide2027';
import { CHINA_CS_AI_ADMISSION_2027_SLUG, CHINA_CS_AI_ADMISSION_2027_DATA } from '@/data/chinaCsAiAdmissionGuide2027';
import { CHINA_MARCH_2027_LANGUAGE_GUIDE_SLUG, CHINA_MARCH_2027_LANGUAGE_DATA } from '@/data/chinaMarch2027LanguageFoundationGuide';
import { CHINA_BUSINESS_FINANCE_2027_SLUG, CHINA_BUSINESS_FINANCE_2027_DATA } from '@/data/chinaBusinessFinanceAdmissionGuide2027';
import { CHINA_DIPLOMA_TO_BACHELOR_2027_SLUG, CHINA_DIPLOMA_TO_BACHELOR_2027_DATA } from '@/data/chinaDiplomaToBachelorTransferGuide2027';
import { CHINA_ENGINEERING_ROBOTICS_2027_SLUG, CHINA_ENGINEERING_ROBOTICS_2027_DATA } from '@/data/chinaEngineeringRoboticsAdmissionGuide2027';

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
  for (const [slug, data] of Object.entries(WECHAT_15_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  for (const [slug, data] of Object.entries(WECHAT_BATCH2_18_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  for (const [slug, data] of Object.entries(WECHAT_BATCH3_25_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  for (const [slug, data] of Object.entries(WECHAT_BATCH4_9_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  for (const [slug, data] of Object.entries(WECHAT_BATCH5_7_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  for (const [slug, data] of Object.entries(WECHAT_BATCH6_5_GUIDES_DATA)) {
    if (!serialized.some(u => u.slug === slug)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fallback = serializeUpdate(data as any);
      if (fallback) serialized.unshift(fallback);
    }
  }
  if (!serialized.some(u => u.slug === SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.slug)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fallback = serializeUpdate(SHENYANG_CITY_UNIVERSITY_GUIDE_DATA as any);
    if (fallback) serialized.unshift(fallback);
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
  if (!serialized.some(u => u.slug === CSC_UNIVERSITY_LIST_2027_SLUG)) {
    const fallback = serializeUpdate(CSC_UNIVERSITY_LIST_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CONFUCIUS_SCHOLARSHIP_2027_SLUG)) {
    const fallback = serializeUpdate(CONFUCIUS_SCHOLARSHIP_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === FOUNDATION_SCHOLARSHIPS_SLUG)) {
    const fallback = serializeUpdate(FOUNDATION_SCHOLARSHIPS_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === MALAYSIA_UNIVERSITIES_2027_SLUG)) {
    const fallback = serializeUpdate(MALAYSIA_UNIVERSITIES_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === GKS_SCHOLARSHIP_2027_SLUG)) {
    const fallback = serializeUpdate(GKS_SCHOLARSHIP_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_BACHELOR_SCHOLARSHIPS_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === GEORGIA_MBBS_FEES_2027_SLUG)) {
    const fallback = serializeUpdate(GEORGIA_MBBS_FEES_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CUHK_PROGRAMS_2027_SLUG)) {
    const fallback = serializeUpdate(CUHK_PROGRAMS_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === UK_RED_BRICK_2027_SLUG)) {
    const fallback = serializeUpdate(UK_RED_BRICK_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_MBBS_ADMISSION_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_MBBS_ADMISSION_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_CS_AI_ADMISSION_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_CS_AI_ADMISSION_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_MARCH_2027_LANGUAGE_GUIDE_SLUG)) {
    const fallback = serializeUpdate(CHINA_MARCH_2027_LANGUAGE_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_BUSINESS_FINANCE_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_BUSINESS_FINANCE_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_DIPLOMA_TO_BACHELOR_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_DIPLOMA_TO_BACHELOR_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  if (!serialized.some(u => u.slug === CHINA_ENGINEERING_ROBOTICS_2027_SLUG)) {
    const fallback = serializeUpdate(CHINA_ENGINEERING_ROBOTICS_2027_DATA);
    if (fallback) serialized.unshift(fallback);
  }
  // Fallbacks are unshifted above; re-sort so the newest posts (DB or fallback) lead the feed.
  const ts = (u: Update) => new Date(u.publishedAt ?? u.createdAt ?? 0).getTime() || 0;
  serialized.sort((a, b) =>
    (prioritizeFeatured ? Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) : 0) || ts(b) - ts(a),
  );
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
  for (const [slug, data] of Object.entries(WECHAT_15_GUIDES_DATA)) {
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
  for (const [slug, data] of Object.entries(WECHAT_BATCH2_18_GUIDES_DATA)) {
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
  for (const [slug, data] of Object.entries(WECHAT_BATCH3_25_GUIDES_DATA)) {
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
  for (const [slug, data] of Object.entries(WECHAT_BATCH4_9_GUIDES_DATA)) {
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
  for (const [slug, data] of Object.entries(WECHAT_BATCH5_7_GUIDES_DATA)) {
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
  for (const [slug, data] of Object.entries(WECHAT_BATCH6_5_GUIDES_DATA)) {
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
  if (!updates.some(u => u.slug === SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.slug)) {
    updates.unshift({
      slug: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.slug,
      updatedAt: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.updatedAt,
      publishedAt: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.publishedAt,
      category: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.category,
      categories: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.categories,
    });
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
  if (!updates.some(u => u.slug === CSC_UNIVERSITY_LIST_2027_SLUG)) {
    updates.unshift({
      slug: CSC_UNIVERSITY_LIST_2027_DATA.slug,
      updatedAt: CSC_UNIVERSITY_LIST_2027_DATA.updatedAt,
      publishedAt: CSC_UNIVERSITY_LIST_2027_DATA.publishedAt,
      category: CSC_UNIVERSITY_LIST_2027_DATA.category,
      categories: CSC_UNIVERSITY_LIST_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CONFUCIUS_SCHOLARSHIP_2027_SLUG)) {
    updates.unshift({
      slug: CONFUCIUS_SCHOLARSHIP_2027_DATA.slug,
      updatedAt: CONFUCIUS_SCHOLARSHIP_2027_DATA.updatedAt,
      publishedAt: CONFUCIUS_SCHOLARSHIP_2027_DATA.publishedAt,
      category: CONFUCIUS_SCHOLARSHIP_2027_DATA.category,
      categories: CONFUCIUS_SCHOLARSHIP_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === FOUNDATION_SCHOLARSHIPS_SLUG)) {
    updates.unshift({
      slug: FOUNDATION_SCHOLARSHIPS_DATA.slug,
      updatedAt: FOUNDATION_SCHOLARSHIPS_DATA.updatedAt,
      publishedAt: FOUNDATION_SCHOLARSHIPS_DATA.publishedAt,
      category: FOUNDATION_SCHOLARSHIPS_DATA.category,
      categories: FOUNDATION_SCHOLARSHIPS_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === MALAYSIA_UNIVERSITIES_2027_SLUG)) {
    updates.unshift({
      slug: MALAYSIA_UNIVERSITIES_2027_DATA.slug,
      updatedAt: MALAYSIA_UNIVERSITIES_2027_DATA.updatedAt,
      publishedAt: MALAYSIA_UNIVERSITIES_2027_DATA.publishedAt,
      category: MALAYSIA_UNIVERSITIES_2027_DATA.category,
      categories: MALAYSIA_UNIVERSITIES_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === GKS_SCHOLARSHIP_2027_SLUG)) {
    updates.unshift({
      slug: GKS_SCHOLARSHIP_2027_DATA.slug,
      updatedAt: GKS_SCHOLARSHIP_2027_DATA.updatedAt,
      publishedAt: GKS_SCHOLARSHIP_2027_DATA.publishedAt,
      category: GKS_SCHOLARSHIP_2027_DATA.category,
      categories: GKS_SCHOLARSHIP_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_BACHELOR_SCHOLARSHIPS_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA.slug,
      updatedAt: CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA.updatedAt,
      publishedAt: CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA.publishedAt,
      category: CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA.category,
      categories: CHINA_BACHELOR_SCHOLARSHIPS_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === GEORGIA_MBBS_FEES_2027_SLUG)) {
    updates.unshift({
      slug: GEORGIA_MBBS_FEES_2027_DATA.slug,
      updatedAt: GEORGIA_MBBS_FEES_2027_DATA.updatedAt,
      publishedAt: GEORGIA_MBBS_FEES_2027_DATA.publishedAt,
      category: GEORGIA_MBBS_FEES_2027_DATA.category,
      categories: GEORGIA_MBBS_FEES_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CUHK_PROGRAMS_2027_SLUG)) {
    updates.unshift({
      slug: CUHK_PROGRAMS_2027_DATA.slug,
      updatedAt: CUHK_PROGRAMS_2027_DATA.updatedAt,
      publishedAt: CUHK_PROGRAMS_2027_DATA.publishedAt,
      category: CUHK_PROGRAMS_2027_DATA.category,
      categories: CUHK_PROGRAMS_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === UK_RED_BRICK_2027_SLUG)) {
    updates.unshift({
      slug: UK_RED_BRICK_2027_DATA.slug,
      updatedAt: UK_RED_BRICK_2027_DATA.updatedAt,
      publishedAt: UK_RED_BRICK_2027_DATA.publishedAt,
      category: UK_RED_BRICK_2027_DATA.category,
      categories: UK_RED_BRICK_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_MBBS_ADMISSION_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_MBBS_ADMISSION_2027_DATA.slug,
      updatedAt: CHINA_MBBS_ADMISSION_2027_DATA.updatedAt,
      publishedAt: CHINA_MBBS_ADMISSION_2027_DATA.publishedAt,
      category: CHINA_MBBS_ADMISSION_2027_DATA.category,
      categories: CHINA_MBBS_ADMISSION_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_CS_AI_ADMISSION_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_CS_AI_ADMISSION_2027_DATA.slug,
      updatedAt: CHINA_CS_AI_ADMISSION_2027_DATA.updatedAt,
      publishedAt: CHINA_CS_AI_ADMISSION_2027_DATA.publishedAt,
      category: CHINA_CS_AI_ADMISSION_2027_DATA.category,
      categories: CHINA_CS_AI_ADMISSION_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_MARCH_2027_LANGUAGE_GUIDE_SLUG)) {
    updates.unshift({
      slug: CHINA_MARCH_2027_LANGUAGE_DATA.slug,
      updatedAt: CHINA_MARCH_2027_LANGUAGE_DATA.updatedAt,
      publishedAt: CHINA_MARCH_2027_LANGUAGE_DATA.publishedAt,
      category: CHINA_MARCH_2027_LANGUAGE_DATA.category,
      categories: CHINA_MARCH_2027_LANGUAGE_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_BUSINESS_FINANCE_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_BUSINESS_FINANCE_2027_DATA.slug,
      updatedAt: CHINA_BUSINESS_FINANCE_2027_DATA.updatedAt,
      publishedAt: CHINA_BUSINESS_FINANCE_2027_DATA.publishedAt,
      category: CHINA_BUSINESS_FINANCE_2027_DATA.category,
      categories: CHINA_BUSINESS_FINANCE_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_DIPLOMA_TO_BACHELOR_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_DIPLOMA_TO_BACHELOR_2027_DATA.slug,
      updatedAt: CHINA_DIPLOMA_TO_BACHELOR_2027_DATA.updatedAt,
      publishedAt: CHINA_DIPLOMA_TO_BACHELOR_2027_DATA.publishedAt,
      category: CHINA_DIPLOMA_TO_BACHELOR_2027_DATA.category,
      categories: CHINA_DIPLOMA_TO_BACHELOR_2027_DATA.categories,
    });
  }
  if (!updates.some(u => u.slug === CHINA_ENGINEERING_ROBOTICS_2027_SLUG)) {
    updates.unshift({
      slug: CHINA_ENGINEERING_ROBOTICS_2027_DATA.slug,
      updatedAt: CHINA_ENGINEERING_ROBOTICS_2027_DATA.updatedAt,
      publishedAt: CHINA_ENGINEERING_ROBOTICS_2027_DATA.publishedAt,
      category: CHINA_ENGINEERING_ROBOTICS_2027_DATA.category,
      categories: CHINA_ENGINEERING_ROBOTICS_2027_DATA.categories,
    });
  }
  const categorySlugs = Array.from(
    new Set(updates.flatMap(post => categoriesFromUpdate(post)).map(label => categorySlug(label))),
  );
  return { updates, categorySlugs };
});

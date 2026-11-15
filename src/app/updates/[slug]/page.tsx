import { breadcrumbJsonLd, citationJsonLd, faqJsonLd, safeJsonLdImageUrl, serializeJsonLd } from '@/lib/json-ld';
import { RSS_FEED } from '@/lib/seo';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import UpdateClient from './UpdateClient';
import type { Update } from '@/lib/types';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { teamMembers } from '@/data/teamMembers';
import { getPublishedUpdates, serializeUpdate } from '@/lib/content-records';
import { isOrganizationContentAuthor, normalizeContentAuthor } from '@/lib/content-author';
import { categorySlug } from '@/lib/update-categories';
import { chinaIntakeOverview } from '@/lib/china-intakes';
import { htmlToText, sanitizeUpdateHtml } from '@/lib/content-html';
import { extractFaqsFromHtml } from '@/lib/content-faq';
import { getUniversityRecords, getUniversityRouteSlugs } from '@/lib/university-records';
import { getIndexableUniversitySitemapRecords } from '@/lib/university-guide-publication';
import { CSC_DIRECTORY_SLUG, buildCscDirectoryEnrichment, linkCscDirectoryUniversities, type CscDirectoryEnrichment } from '@/lib/csc-directory-enrichment';
import { repairUpdateInternalLinks } from '@/lib/content-links';
import { CGS_2027_TYPE_A_SLUG, CGS_2027_TYPE_A_DATA } from '@/data/cgsTypeAGuide2027';

interface UpdatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Stale-intake helper (kept at module scope: render bodies must not call
// impure clock functions directly — this plain helper owns them).
const isStalePost = (iso: Date | string | null | undefined) => {
  if (!iso) return false;
  const time = iso instanceof Date ? iso.getTime() : new Date(iso).getTime();
  return !Number.isNaN(time) && Date.now() - time > 365 * 24 * 60 * 60 * 1000;
};

const parseJsonCategories = (value: string | null): string[] => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

const clampMetaText = (text: string, maxLen: number) => {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLen) return normalized;
  const cut = normalized.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut}…`;
};

const teamPersonSchema = (name: string | null | undefined) => {
  const cleaned = name?.trim();
  if (!cleaned) return null;
  const member = teamMembers.find(item => item.name.toLowerCase() === cleaned.toLowerCase());
  if (!member) return null;
  return {
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    worksFor: { '@type': 'Organization', '@id': 'https://eduexpressint.com/#organization' },
  };
};

// Posts interlink through shared categories so the library never strands a
// reader on a dead end; when too few share categories, the freshest published
// pool fills the remaining slots.
const getRelated = cache(async (current: NonNullable<Awaited<ReturnType<typeof getUpdate>>>, limit = 3): Promise<Update[]> => {
  const pool = await prisma.content.findMany({
    where: {
      id: { not: current.id },
      type: { in: ['update', 'article'] },
      archivedAt: null,
      ...currentVisibleContentWhere(),
    },
    orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
    take: 30,
  });
  if (pool.length === 0) return [];

  const currentSlugs = new Set([
    current.category,
    ...parseJsonCategories(current.categories),
  ].filter((label): label is string => Boolean(label?.trim())).map(label => categorySlug(label)));

  const shared = currentSlugs.size === 0 ? [] : pool.filter(post =>
    [post.category, ...parseJsonCategories(post.categories)].some(label => label?.trim() && currentSlugs.has(categorySlug(label))),
  );

  const seenIds = new Set<string>();
  const unique = [...shared, ...pool].filter((record) => {
    if (seenIds.has(record.id)) return false;
    seenIds.add(record.id);
    return true;
  });

  return unique
    .slice(0, limit)
    .map(record => serializeUpdate(record))
    .filter((record): record is Update => Boolean(record));
});

const getUpdate = cache(async (slug: string) => {
  const fromDb = await prisma.content.findFirst({
    where: { slug, type: { in: ['update', 'article'] }, ...currentVisibleContentWhere() },
  });
  if (fromDb) return fromDb;
  if (slug === CGS_2027_TYPE_A_SLUG) {
    return CGS_2027_TYPE_A_DATA;
  }
  return null;
});

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const update = await getUpdate(slug);

    if (!update) {
      return {
        title: 'Update Not Found',
        description: 'The requested update could not be found.',
        robots: { index: false, follow: true },
      };
    }

    const tags = update.tags ? JSON.parse(update.tags) : [];
    const plainBody = htmlToText(update.content, 300);

    // Search results show about 60 characters: keyword-first meta title plus a
    // short brand once only, falling back to the headline when it fits.
    const base = (update.metaTitle || update.title).trim();
    const title = /eduexpress/i.test(base)
      ? clampMetaText(base, 62)
      : `${base} | EduExpress`.length <= 62
        ? `${base} | EduExpress`
        : clampMetaText(base, 62);
    const metaDescription = clampMetaText(update.metaDescription || update.excerpt || plainBody, 160);
    const image = update.featuredImage
      ? { url: update.featuredImage, width: 1200, height: 630, alt: update.title }
      : { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' };

    return {
      title: { absolute: title },
      description: metaDescription,
      alternates: { canonical: `/updates/${slug}`, types: RSS_FEED },
      // Closed intakes stay reachable for transparency and backlinks, but they
      // must not compete in search with the current intake pages.
      robots: { index: !update.archivedAt, follow: true },
      openGraph: {
        images: [image],
        url: `/updates/${slug}`,
        locale: 'en_BD',
        title,
        description: metaDescription,
        type: 'article',
        publishedTime: update.publishedAt?.toISOString(),
        modifiedTime: update.updatedAt.toISOString(),
        authors: [normalizeContentAuthor(update.author)],
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: metaDescription,
        images: [image.url],
      }
    };
  } catch {
    return {
      title: 'Update Not Found',
      description: 'The requested update could not be found.'
    };
  }
}

export default async function UpdatePage({ params }: UpdatePageProps) {
    const { slug } = await params;
    const update = await getUpdate(slug);

    if (!update) {
      notFound();
    }

    const related = await getRelated(update);

    // Stale-intake routing (server-computed): posts older than a year point
    // readers at the live verified intake calendar.
    const stalePost = isStalePost(update.publishedAt || update.createdAt);
    const archived = Boolean(update.archivedAt);
    const stale = stalePost || archived
      ? { enabled: true, archived, windows: chinaIntakeOverview() }
      : { enabled: false, archived: false };

    const tags = update.tags ? JSON.parse(update.tags) : [];
    const categories = update.categories ? JSON.parse(update.categories) : [];
    const parsedSourceUrls = update.sourceUrls ? JSON.parse(update.sourceUrls) : [];
    const isCscDirectory = update.slug === CSC_DIRECTORY_SLUG;
    const rawFeatured = update.featuredImage?.trim();
    const effectiveFeaturedImage =
      isCscDirectory && (!rawFeatured || !rawFeatured.startsWith('/'))
        ? '/og/china.jpg'
        : update.featuredImage || undefined;
    const sourceUrls = isCscDirectory
      ? Array.from(
          new Set([
            'https://www.campuschina.org/',
            'https://eduexpressint.com/csc-scholarship-bangladesh',
            'https://eduexpressint.com/china-universities',
            ...(Array.isArray(parsedSourceUrls) ? parsedSourceUrls : []),
          ]),
        )
      : parsedSourceUrls;

    const updateData: Update = {
      id: update.id,
      title: update.title,
      slug: update.slug,
      type: update.type,
      content: sanitizeUpdateHtml(update.content),
      excerpt: update.excerpt || undefined,
      metaDescription: update.metaDescription || undefined,
      category: update.category || undefined,
      categories: categories,
      tags: tags,
      sourceUrls,
      featuredImage: effectiveFeaturedImage,
      isFeatured: update.isFeatured,
      author: normalizeContentAuthor(update.author),
      reviewer: update.reviewer || undefined,
      publishedAt: update.publishedAt?.toISOString(),
      lastVerifiedAt: update.lastVerifiedAt?.toISOString(),
      nextReviewAt: update.nextReviewAt?.toISOString(),
      expiresAt: update.expiresAt?.toISOString(),
      deadlineAt: update.deadlineAt?.toISOString(),
      complianceApprovedAt: update.complianceApprovedAt?.toISOString(),
      seoApprovedAt: update.seoApprovedAt?.toISOString(),
      createdAt: update.createdAt.toISOString(),
      updatedAt: update.updatedAt.toISOString(),
      archived,
      views: update.views
    };

    let cscDirectory: CscDirectoryEnrichment | undefined;
    if (isCscDirectory) {
      const [chinaUniversities, indexableRecords, publishedUpdates] = await Promise.all([
        getUniversityRecords('China'),
        getIndexableUniversitySitemapRecords(),
        getPublishedUpdates(undefined, false),
      ]);
      const indexableSlugs = new Set(indexableRecords.map((record) => record.slug));
      const indexableChinaUniversities = chinaUniversities.filter((u) => indexableSlugs.has(u.slug));
      const linked = linkCscDirectoryUniversities(updateData.content, indexableChinaUniversities);
      updateData.content = linked.html;
      cscDirectory = buildCscDirectoryEnrichment(
        indexableChinaUniversities,
        publishedUpdates,
        linked.matchedSlugs,
      );
    }

    const universitySlugs = new Set(await getUniversityRouteSlugs());
    updateData.content = repairUpdateInternalLinks(updateData.content, universitySlugs);

    const canonical = `https://eduexpressint.com/updates/${update.slug}`;
    // E-E-A-T: posts signed by a listed team member get a Person author with
    // their verified role; anonymous or generic admin bylines stay attributed to the organization.
    const authorName = normalizeContentAuthor(update.author);
    const authorSchema =
      teamPersonSchema(authorName) ??
      (isOrganizationContentAuthor(authorName)
        ? { '@id': 'https://eduexpressint.com/#organization' }
        : { '@type': 'Organization', name: authorName, url: 'https://eduexpressint.com' });
    const reviewerSchema =
      teamPersonSchema(update.reviewer) ?? { '@id': 'https://eduexpressint.com/#organization' };
    const primaryImage =
      safeJsonLdImageUrl(effectiveFeaturedImage) || 'https://eduexpressint.com/og-image.jpg';
    const schemaDescription = clampMetaText(
      update.metaDescription || update.excerpt || htmlToText(update.content, 300),
      160,
    );
    const datePublished = update.publishedAt?.toISOString() || update.createdAt.toISOString();
    const dateModified = update.updatedAt.toISOString();
    const pageFaqs = cscDirectory?.faqs.length
      ? cscDirectory.faqs
      : extractFaqsFromHtml(update.content);
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          mainEntityOfPage: canonical,
          name: update.title,
          description: schemaDescription,
          inLanguage: 'en-BD',
          datePublished,
          dateModified,
          primaryImageOfPage: { '@type': 'ImageObject', url: primaryImage },
          isPartOf: { '@id': 'https://eduexpressint.com/#website' },
          about: { '@id': 'https://eduexpressint.com/#organization' },
          publisher: { '@id': 'https://eduexpressint.com/#organization' },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
          mainEntity: { '@id': `${canonical}#article` },
        },
        {
          '@type': 'BlogPosting',
          '@id': `${canonical}#article`,
          headline: update.title,
          description: schemaDescription,
          image: [primaryImage],
          datePublished,
          dateModified,
          author: authorSchema,
          publisher: { '@id': 'https://eduexpressint.com/#organization' },
          reviewedBy: reviewerSchema,
          isPartOf: { '@id': 'https://eduexpressint.com/#website' },
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
          inLanguage: 'en-BD',
          keywords: tags.join(', ') || undefined,
          articleSection: categories[0] || update.category || undefined,
          ...citationJsonLd(
            Array.isArray(sourceUrls)
              ? sourceUrls
                  .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
                  .map((href) => ({ label: href, href }))
              : [],
          ),
        },
        ...(pageFaqs.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${canonical}#faq`,
                isPartOf: { '@id': `${canonical}#webpage` },
                mainEntity: faqJsonLd(pageFaqs).mainEntity,
              },
            ]
          : []),
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd([{ name: 'Updates', path: '/updates' }, { name: update.title }], `/updates/${update.slug}`)) }} />
        <UpdateClient update={updateData} related={related} stale={stale} cscDirectory={cscDirectory} />
      </>
    );
}

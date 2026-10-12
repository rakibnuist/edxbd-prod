import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import UpdateClient from './UpdateClient';
import type { Update } from '@/lib/types';
import { currentPublishedContentWhere } from '@/lib/content-governance';

interface UpdatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getUpdate = cache((slug: string) => prisma.content.findFirst({
  where: { slug, type: 'update', ...currentPublishedContentWhere() },
}));

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

    return {
      title: update.metaTitle || update.title,
      description: update.metaDescription || update.excerpt || update.content.substring(0, 160),
      keywords: tags.join(', '),
      alternates: { canonical: `/updates/${slug}` },
      openGraph: {
        title: update.title,
        description: update.excerpt || update.content.substring(0, 160),
        type: 'article',
        publishedTime: update.publishedAt?.toISOString(),
        authors: update.author ? [update.author] : undefined,
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: update.title,
        description: update.excerpt || update.content.substring(0, 160),
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

    const tags = update.tags ? JSON.parse(update.tags) : [];
    const categories = update.categories ? JSON.parse(update.categories) : [];
    const sourceUrls = update.sourceUrls ? JSON.parse(update.sourceUrls) : [];

    const updateData: Update = {
      id: update.id,
      title: update.title,
      slug: update.slug,
      type: update.type,
      content: update.content,
      excerpt: update.excerpt || undefined,
      metaDescription: update.metaDescription || undefined,
      category: update.category || undefined,
      categories: categories,
      tags: tags,
      sourceUrls,
      featuredImage: update.featuredImage || undefined,
      isFeatured: update.isFeatured,
      author: update.author || 'EduExpress',
      reviewer: update.reviewer || undefined,
      publishedAt: update.publishedAt?.toISOString(),
      lastVerifiedAt: update.lastVerifiedAt?.toISOString(),
      nextReviewAt: update.nextReviewAt?.toISOString(),
      expiresAt: update.expiresAt?.toISOString(),
      complianceApprovedAt: update.complianceApprovedAt?.toISOString(),
      seoApprovedAt: update.seoApprovedAt?.toISOString(),
      createdAt: update.createdAt.toISOString(),
      updatedAt: update.updatedAt.toISOString(),
      views: update.views
    };

    const canonical = `https://eduexpressint.com/updates/${update.slug}`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      headline: update.title,
      description: update.excerpt || update.content.substring(0, 160),
      image: update.featuredImage ? [update.featuredImage] : ['https://eduexpressint.com/og-image.jpg'],
      datePublished: update.publishedAt?.toISOString() || update.createdAt.toISOString(),
      dateModified: update.updatedAt.toISOString(),
      author: { '@type': 'Organization', name: update.author || 'EduExpress International', url: 'https://eduexpressint.com' },
      publisher: { '@id': 'https://eduexpressint.com/#organization' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      inLanguage: 'en-BD',
      keywords: tags.join(', ') || undefined,
      articleSection: categories[0] || update.category || undefined,
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <UpdateClient update={updateData} />
      </>
    );
}

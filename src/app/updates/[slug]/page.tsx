import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import UpdateClient from './UpdateClient';

interface UpdatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const update = await prisma.content.findUnique({ 
      where: { 
        slug: slug, 
        type: 'update', 
        isPublished: true 
      }
    });

    if (!update) {
      return {
        title: 'Update Not Found',
        description: 'The requested update could not be found.'
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
  try {
    const { slug } = await params;
    const update = await prisma.content.findUnique({ 
      where: { 
        slug: slug, 
        type: 'update', 
        isPublished: true 
      }
    });

    if (!update) {
      notFound();
    }

    // Increment view count
    await prisma.content.update({ 
      where: { id: update.id },
      data: { views: { increment: 1 } }
    });

    const tags = update.tags ? JSON.parse(update.tags) : [];
    const categories = update.categories ? JSON.parse(update.categories) : [];

    // Convert Prisma document to plain object for client component
    const updateData = {
      id: update.id,
      title: update.title,
      slug: update.slug,
      content: update.content,
      excerpt: update.excerpt || undefined,
      category: update.category || undefined,
      categories: categories,
      tags: tags,
      featuredImage: update.featuredImage || undefined,
      isFeatured: update.isFeatured,
      author: update.author || 'EduExpress',
      publishedAt: update.publishedAt?.toISOString() || null,
      createdAt: update.createdAt.toISOString(),
      updatedAt: update.updatedAt.toISOString(),
      views: update.views + 1
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
        <UpdateClient update={updateData as any} />
      </>
    );
  } catch (error) {
    console.error('Error fetching update:', error);
    notFound();
  }
}

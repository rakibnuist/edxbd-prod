import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';
import UpdateClient from './UpdateClient';

interface UpdatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    await connectDB();
    const update = await Content.findOne({ 
      slug: slug, 
      type: 'update', 
      isPublished: true 
    });

    if (!update) {
      return {
        title: 'Update Not Found',
        description: 'The requested update could not be found.'
      };
    }

    return {
      title: update.metaTitle || update.title,
      description: update.metaDescription || update.excerpt || update.content.substring(0, 160),
      keywords: update.tags?.join(', '),
      openGraph: {
        title: update.title,
        description: update.excerpt || update.content.substring(0, 160),
        type: 'article',
        publishedTime: update.publishedAt?.toISOString(),
        authors: [update.author],
        tags: update.tags,
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
    await connectDB();
    const update = await Content.findOne({ 
      slug: slug, 
      type: 'update', 
      isPublished: true 
    });

    if (!update) {
      notFound();
    }

    // Increment view count
    await Content.findByIdAndUpdate(update._id, { 
      $inc: { views: 1 } 
    });

    // Convert Mongoose document to plain object for client component
    const updateData = {
      _id: update._id.toString(),
      title: update.title,
      slug: update.slug,
      content: update.content,
      excerpt: update.excerpt,
      category: update.category,
      categories: update.categories,
      tags: update.tags,
      featuredImage: update.featuredImage,
      isFeatured: update.isFeatured,
      author: update.author,
      publishedAt: update.publishedAt,
      createdAt: update.createdAt,
      updatedAt: update.updatedAt,
      views: update.views
    };

    return <UpdateClient update={updateData} />;
  } catch (error) {
    console.error('Error fetching update:', error);
    notFound();
  }
}

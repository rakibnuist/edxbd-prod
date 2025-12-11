import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Build query
    const query: Record<string, unknown> = { 
      type: 'update', 
      isPublished: true 
    };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Build sort criteria
    const sort = { isFeatured: -1 as const, publishedAt: -1 as const, createdAt: -1 as const };

    // Execute query
    let updatesQuery = Content.find(query).sort(sort);
    
    // Add pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      if (!isNaN(pageNum) && !isNaN(limitNum) && pageNum > 0 && limitNum > 0) {
        const skip = (pageNum - 1) * limitNum;
        updatesQuery = updatesQuery.skip(skip).limit(limitNum);
      }
    } else if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        updatesQuery = updatesQuery.limit(limitNum);
      }
    }

    const updates = await updatesQuery.exec();

    // Get total count for pagination
    const totalCount = await Content.countDocuments(query);

    // Get unique categories (single + multi) and authors for filters
    const [singleCategories, multiCategories, authors] = await Promise.all([
      Content.distinct('category', { 
        type: 'update', 
        isPublished: true,
        category: { $exists: true, $ne: null }
      }),
      Content.distinct('categories', { 
        type: 'update', 
        isPublished: true,
        categories: { $exists: true, $ne: null }
      }),
      Content.distinct('author', { 
        type: 'update', 
        isPublished: true,
        author: { $exists: true, $ne: null }
      })
    ]);

    const normalizeList = (values: unknown[]) => Array.from(
      new Set(
        values
          .filter((value): value is string => typeof value === 'string')
          .map(value => value.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    const normalizedCategories = normalizeList([
      ...singleCategories,
      ...multiCategories
    ]);

    const normalizedAuthors = normalizeList(authors);

    return NextResponse.json({
      updates,
      totalCount,
      categories: ['All', ...normalizedCategories],
      authors: ['All', ...normalizedAuthors],
      pagination: {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : updates.length,
        totalPages: limit ? Math.ceil(totalCount / parseInt(limit)) : 1
      }
    });
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}

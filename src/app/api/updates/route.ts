import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Build query
    const where: any = { 
      type: 'update', 
      isPublished: true 
    };
    
    // Add search functionality
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } }
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      where.category = category; // Note: if filtering by the 'categories' JSON string array, this gets complex in SQLite. Assuming 'category' field for now.
    }

    // Add featured filter
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Add pagination
    let skip = undefined;
    let take = undefined;

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      if (!isNaN(pageNum) && !isNaN(limitNum) && pageNum > 0 && limitNum > 0) {
        skip = (pageNum - 1) * limitNum;
        take = limitNum;
      }
    } else if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        take = limitNum;
      }
    }

    const updates = await prisma.content.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take
    });

    // Get total count for pagination
    const totalCount = await prisma.content.count({ where });

    // Get unique categories and authors for filters (since SQLite doesn't have distinct for multiple fields, we fetch all unique from matching or all published)
    // To be efficient, just fetching the fields we need across all published updates.
    const allPublished = await prisma.content.findMany({
      where: { type: 'update', isPublished: true },
      select: { category: true, categories: true, author: true }
    });

    const singleCategories = allPublished.map(i => i.category);
    const multiCategories = allPublished.map(i => i.categories ? JSON.parse(i.categories) : []).flat();
    const authors = allPublished.map(i => i.author);

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

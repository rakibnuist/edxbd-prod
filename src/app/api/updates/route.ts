import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { serializeContent } from '@/lib/content-serialize';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { sanitizeUpdateHtml } from '@/lib/content-html';
import { parsePagination } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Build query — serve both updates (news) and articles (guides/blog posts)
    const where: Prisma.ContentWhereInput = {
      type: { in: ['update', 'article'] },
      ...currentVisibleContentWhere(),
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

    // Bound pagination to safe defaults so clients cannot request unbounded page sizes
    const {
      page: clampedPage,
      limit: clampedLimit,
      skip,
    } = parsePagination(page, limit, { defaultLimit: 50, maxLimit: 100 });
    const take = clampedLimit;

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
      where: { type: { in: ['update', 'article'] }, ...currentVisibleContentWhere() },
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
      updates: updates.map(update => {
        const serialized = serializeContent(update as unknown as Record<string, unknown>);
        return { ...serialized, content: sanitizeUpdateHtml(String(serialized.content ?? '')) };
      }),
      totalCount,
      categories: ['All', ...normalizedCategories],
      authors: ['All', ...normalizedAuthors],
      pagination: {
        page: clampedPage,
        limit: clampedLimit,
        totalPages: Math.max(1, Math.ceil(totalCount / clampedLimit))
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

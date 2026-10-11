import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializeContent, toContentData } from '@/lib/content-serialize';
import { contentPublicationErrors } from '@/lib/content-governance';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const contents = await prisma.content.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(contents.map((c) => serializeContent(c as Record<string, unknown>)));
  } catch (error) {
    console.error('Fetch contents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    console.log('Creating content with data:', body);
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.author) {
      console.error('Missing required fields:', { 
        title: !!body.title, 
        slug: !!body.slug, 
        content: !!body.content, 
        author: !!body.author 
      });
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, and author are required' },
        { status: 400 }
      );
    }

    const existingContent = await prisma.content.findUnique({ where: { slug: body.slug } });
    if (existingContent) {
      console.error('Slug already exists:', body.slug);
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a different slug.' },
        { status: 400 }
      );
    }

    const data = toContentData(body) as Record<string, unknown>;
    const publicationErrors = contentPublicationErrors(data);
    if (publicationErrors.length) {
      return NextResponse.json({ error: 'This content is not ready to publish.', details: publicationErrors }, { status: 400 });
    }
    if (body.isPublished === true) data.publishedAt = new Date();
    const savedContent = await prisma.content.create({ data: data as never });
    revalidatePath('/updates');
    revalidatePath('/');
    revalidatePath(`/updates/${savedContent.slug}`);
    console.log('Content created successfully:', savedContent.id);

    return NextResponse.json(serializeContent(savedContent as Record<string, unknown>), { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { serializeContent, toContentData } from '@/lib/content-serialize';
import { contentPublicationErrors } from '@/lib/content-governance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const content = await prisma.content.findUnique({ where: { id } });
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeContent(content as Record<string, unknown>));
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const body = await request.json();
    const existing = await prisma.content.findUnique({ where: { id } });
    const data = toContentData(body, true) as Record<string, unknown>;
    const publicationErrors = contentPublicationErrors({ ...(existing || {}), ...data });
    if (publicationErrors.length) {
      return NextResponse.json({ error: 'This content is not ready to publish.', details: publicationErrors }, { status: 400 });
    }
    if (body.isPublished === true && !existing?.publishedAt) data.publishedAt = new Date();
    const content = await prisma.content.update({
      where: { id },
      data: data as never
    }).catch(() => null);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    revalidatePath('/updates');
    revalidatePath('/');
    revalidatePath(`/updates/${content.slug}`);
    if (existing?.slug && existing.slug !== content.slug) revalidatePath(`/updates/${existing.slug}`);
    return NextResponse.json(serializeContent(content as Record<string, unknown>));
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const content = await prisma.content.delete({ where: { id } }).catch(() => null);
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    revalidatePath('/updates');
    revalidatePath('/');
    revalidatePath(`/updates/${content.slug}`);

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}

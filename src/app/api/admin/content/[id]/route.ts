import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { serializeContent, toContentData, validateContentUrls } from '@/lib/content-serialize';
import { contentPublicationErrors, withPublicationDefaults } from '@/lib/content-governance';
import { announcePublishedUpdate } from '@/lib/indexnow';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
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
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const body = await readLimitedJson(request, 1024 * 1024);
    const urlError = validateContentUrls(body);
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 });
    }
    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    const data = withPublicationDefaults(toContentData(body, true) as Record<string, unknown>, existing as Record<string, unknown>);
    const publicationErrors = contentPublicationErrors({ ...existing, ...data });
    if (publicationErrors.length) {
      return NextResponse.json({ error: 'This content is not ready to publish.', details: publicationErrors }, { status: 400 });
    }
    if (body.isPublished === true && !existing.publishedAt) data.publishedAt = new Date();
    const content = await prisma.content.update({
      where: { id },
      data: data as never
    });

    revalidatePath('/updates');
    revalidatePath('/');
    revalidatePath(`/updates/${content.slug}`);
    if (existing.slug && existing.slug !== content.slug) revalidatePath(`/updates/${existing.slug}`);
    if (content.isPublished) announcePublishedUpdate(content.slug);
    return NextResponse.json(serializeContent(content as Record<string, unknown>));
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    const code = (error as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'Another content item already uses this slug.' },
        { status: 409 }
      );
    }
    if (code === 'P2025') {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
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
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
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

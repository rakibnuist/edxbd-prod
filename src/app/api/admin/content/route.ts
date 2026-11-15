import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { serializeContent, toContentData, validateContentUrls } from '@/lib/content-serialize';
import { contentPublicationErrors, withPublicationDefaults } from '@/lib/content-governance';
import { announcePublishedUpdate } from '@/lib/indexnow';
import { logAndFormatServerError } from '@/lib/api-error';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
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
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 1024 * 1024);

    // Validate required fields
    if (typeof body.title !== 'string' || !body.title.trim() || typeof body.slug !== 'string' || !body.slug.trim() || typeof body.content !== 'string' || !body.content.trim() || typeof body.author !== 'string' || !body.author.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, and author are required' },
        { status: 400 }
      );
    }

    const urlError = validateContentUrls(body);
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 });
    }

    const existingContent = await prisma.content.findUnique({ where: { slug: body.slug } });
    if (existingContent) {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a different slug.' },
        { status: 400 }
      );
    }

    const data = withPublicationDefaults(toContentData(body) as Record<string, unknown>);
    const publicationErrors = contentPublicationErrors(data);
    if (publicationErrors.length) {
      return NextResponse.json({ error: 'This content is not ready to publish.', details: publicationErrors }, { status: 400 });
    }
    if (body.isPublished === true) data.publishedAt = new Date();
    const savedContent = await prisma.content.create({ data: data as never });
    revalidatePath('/updates');
    revalidatePath('/');
    revalidatePath(`/updates/${savedContent.slug}`);
    if (savedContent.isPublished) announcePublishedUpdate(savedContent.slug);

    return NextResponse.json(serializeContent(savedContent as Record<string, unknown>), { status: 201 });
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    return NextResponse.json(
      logAndFormatServerError('Create content error', error, 'Failed to create content'),
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { toSafeSitePathOrUrl } from '@/lib/safe-url';

const NO_STORE = { 'Cache-Control': 'no-store, private' };
const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403, headers: NO_STORE });

const optional = (value: unknown) => String(value || '').trim() || null;
const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const refreshTestimonials = () => {
  revalidatePath('/');
  revalidatePath('/success-stories');
  revalidatePath('/proof-library');
};

async function updateTestimonial(request: NextRequest, id: string) {
  const body = await readLimitedJson(request, 64 * 1024);
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Testimonial not found' }, { status: 404, headers: NO_STORE });
  const studentName = body.name || body.studentName || body.displayName;
  const content = body.quote || body.content;

  const updateData: Record<string, unknown> = {};
  if (studentName) updateData.studentName = String(studentName).trim();
  if (content) updateData.content = String(content).trim();
  for (const field of ['displayName', 'location', 'university', 'program', 'country', 'academicProfile', 'decisionFactors', 'applicationTimeline', 'serviceProvided', 'studentPaid', 'currentUpdate', 'consentEvidenceId'] as const) {
    if (body[field] !== undefined) updateData[field] = optional(body[field]);
  }
  if (body.image !== undefined) {
    const rawImage = optional(body.image);
    const safeImage = rawImage ? toSafeSitePathOrUrl(rawImage) : null;
    if (rawImage && !safeImage) {
      return NextResponse.json(
        { error: 'Photo must be a safe site path (/...) or an http(s) URL.' },
        { status: 400, headers: NO_STORE },
      );
    }
    updateData.image = safeImage;
  }
  for (const field of ['consentRecordedAt', 'consentExpiresAt', 'consentRevokedAt'] as const) {
    if (body[field] !== undefined) updateData[field] = dateOrNull(body[field]);
  }
  if (body.rating !== undefined) updateData.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  if (body.featured !== undefined) updateData.featured = body.featured === true;
  if (body.consentVerified !== undefined) updateData.consentVerified = body.consentVerified === true;
  if (body.consentImageApproved !== undefined) updateData.consentImageApproved = body.consentImageApproved === true;

  const merged = { ...existing, ...updateData };
  const requestedPublish = (body.isActive ?? body.isPublished) === undefined ? existing.isPublished : (body.isActive ?? body.isPublished) === true;
  const consentCurrent = !merged.consentExpiresAt || new Date(merged.consentExpiresAt) >= new Date();
  // A story can go live once it has a photo, a name and the story text.
  const ready = Boolean(merged.image && merged.studentName && merged.content && !merged.consentRevokedAt && consentCurrent);
  if (requestedPublish && !ready) {
    return NextResponse.json(
      { error: 'Add a real student photo, name, and story (without revoked or expired consent) before publishing.' },
      { status: 400, headers: NO_STORE },
    );
  }
  updateData.isPublished = requestedPublish && ready;

  const testimonial = await prisma.testimonial.update({ where: { id }, data: updateData });
  refreshTestimonials();
  return NextResponse.json(
    {
      ...testimonial,
      name: testimonial.studentName,
      displayName: testimonial.displayName || testimonial.studentName,
      quote: testimonial.content,
      isActive: testimonial.isPublished,
    },
    { headers: NO_STORE },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;

    const t = await prisma.testimonial.findUnique({ where: { id } });
    if (!t) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const formatted = {
      ...t,
      name: t.studentName || 'Student',
      displayName: t.displayName || t.studentName || 'Student',
      quote: t.content || '',
      isActive: t.isPublished ?? true,
    };

    return NextResponse.json(formatted);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;
    return await updateTestimonial(request, id);
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;
    return await updateTestimonial(request, id);
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    return NextResponse.json({ error: 'Failed to update testimonial status' }, { status: 500, headers: NO_STORE });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    refreshTestimonials();

    return NextResponse.json({ message: 'Testimonial deleted successfully' }, { headers: NO_STORE });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404, headers: NO_STORE });
    }
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500, headers: NO_STORE }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

const optional = (value: unknown) => String(value || '').trim() || null;
const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

const refreshTestimonials = () => {
  revalidatePath('/');
  revalidatePath('/success-stories');
};

async function updateTestimonial(request: NextRequest, id: string) {
  const body = await request.json() as Record<string, unknown>;
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
  const studentName = body.name || body.studentName || body.displayName;
  const content = body.quote || body.content;

  const updateData: Record<string, unknown> = {};
  if (studentName) updateData.studentName = String(studentName).trim();
  if (content) updateData.content = String(content).trim();
  for (const field of ['displayName', 'location', 'university', 'program', 'country', 'image', 'academicProfile', 'decisionFactors', 'applicationTimeline', 'serviceProvided', 'studentPaid', 'currentUpdate', 'consentEvidenceId'] as const) {
    if (body[field] !== undefined) updateData[field] = optional(body[field]);
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
  const ready = Boolean(merged.image && merged.consentVerified && merged.consentImageApproved && merged.consentEvidenceId && merged.consentRecordedAt && !merged.consentRevokedAt && consentCurrent);
  if (requestedPublish && !ready) return NextResponse.json({ error: 'Add the real photo, written-consent evidence, consent date and photo approval before publishing.' }, { status: 400 });
  updateData.isPublished = requestedPublish && ready;

  const testimonial = await prisma.testimonial.update({ where: { id }, data: updateData });
  refreshTestimonials();
  return NextResponse.json({
    ...testimonial,
    name: testimonial.studentName,
    displayName: testimonial.displayName || testimonial.studentName,
    quote: testimonial.content,
    isActive: testimonial.isPublished,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const { id } = await params;
    return updateTestimonial(request, id);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return updateTestimonial(request, id);
  } catch {
    return NextResponse.json({ error: 'Failed to update testimonial status' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } }).catch(() => null);
    refreshTestimonials();

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

const forbidden = () => NextResponse.json({ error: 'Admin access required' }, { status: 403 });

const optional = (value: unknown) => String(value || '').trim() || null;
const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};
const publicReady = (body: Record<string, unknown>) => Boolean(
  optional(body.image) && body.consentVerified === true && body.consentImageApproved === true &&
  optional(body.consentEvidenceId) && dateOrNull(body.consentRecordedAt) && !dateOrNull(body.consentRevokedAt)
);
const testimonialData = (body: Record<string, unknown>) => ({
  studentName: String(body.name || body.studentName || body.displayName || 'Student').trim(),
  displayName: optional(body.displayName),
  content: String(body.quote || body.content || '').trim(),
  location: optional(body.location),
  university: optional(body.university),
  program: optional(body.program),
  country: optional(body.country),
  image: optional(body.image),
  rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
  featured: body.featured === true,
  academicProfile: optional(body.academicProfile),
  decisionFactors: optional(body.decisionFactors),
  applicationTimeline: optional(body.applicationTimeline),
  serviceProvided: optional(body.serviceProvided),
  studentPaid: optional(body.studentPaid),
  currentUpdate: optional(body.currentUpdate),
  consentVerified: body.consentVerified === true,
  consentEvidenceId: optional(body.consentEvidenceId),
  consentRecordedAt: dateOrNull(body.consentRecordedAt),
  consentExpiresAt: dateOrNull(body.consentExpiresAt),
  consentRevokedAt: dateOrNull(body.consentRevokedAt),
  consentImageApproved: body.consentImageApproved === true,
  isPublished: (body.isActive ?? body.isPublished) === true && publicReady(body),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const raw = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const testimonials = raw.map((t) => ({
      ...t,
      name: t.studentName || 'Student',
      displayName: t.displayName || t.studentName || 'Student',
      quote: t.content || '',
      isActive: t.isPublished ?? true,
    }));

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return forbidden();
    const body = await request.json() as Record<string, unknown>;
    if ((body.isActive ?? body.isPublished) === true && !publicReady(body)) {
      return NextResponse.json({ error: 'Add the real photo, written-consent evidence, consent date and photo approval before publishing.' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: testimonialData(body),
    });

    const formatted = {
      ...testimonial,
      name: testimonial.studentName,
      displayName: testimonial.displayName || testimonial.studentName,
      quote: testimonial.content,
      isActive: testimonial.isPublished,
    };

    revalidatePath('/');
    revalidatePath('/success-stories');
    revalidatePath('/proof-library');

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

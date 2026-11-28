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
// A story can go live once it has a valid photo, name, story text, and active (non-revoked, non-expired) consent.
const publicReady = (body: Record<string, unknown>, safeImage: string | null) => {
  const expiresAt = dateOrNull(body.consentExpiresAt);
  const consentCurrent = !expiresAt || expiresAt >= new Date();
  return Boolean(
    safeImage &&
      optional(body.name || body.studentName || body.displayName) &&
      optional(body.quote || body.content) &&
      !dateOrNull(body.consentRevokedAt) &&
      consentCurrent,
  );
};
const testimonialData = (body: Record<string, unknown>, safeImage: string | null) => ({
  studentName: String(body.name || body.studentName || body.displayName || 'Student').trim(),
  displayName: optional(body.displayName),
  content: String(body.quote || body.content || '').trim(),
  location: optional(body.location),
  university: optional(body.university),
  program: optional(body.program),
  country: optional(body.country),
  image: safeImage,
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
  isPublished: (body.isActive ?? body.isPublished) === true && publicReady(body, safeImage),
});

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
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

    return NextResponse.json(testimonials, { headers: NO_STORE });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500, headers: NO_STORE }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyLiveAdminUser(request))) return forbidden();
    const body = await readLimitedJson(request, 64 * 1024);
    const rawImage = optional(body.image);
    const safeImage = rawImage ? toSafeSitePathOrUrl(rawImage) : null;
    if (rawImage && !safeImage) {
      return NextResponse.json(
        { error: 'Photo must be a safe site path (/...) or an http(s) URL.' },
        { status: 400, headers: NO_STORE },
      );
    }
    if ((body.isActive ?? body.isPublished) === true && !publicReady(body, safeImage)) {
      return NextResponse.json(
        { error: 'Add a real student photo, name, and story (without revoked or expired consent) before publishing.' },
        { status: 400, headers: NO_STORE },
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: testimonialData(body, safeImage),
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

    return NextResponse.json(formatted, { status: 201, headers: NO_STORE });
  } catch (error) {
    const bodyErr = jsonBodyErrorResponse(error);
    if (bodyErr) return bodyErr;
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500, headers: NO_STORE }
    );
  }
}

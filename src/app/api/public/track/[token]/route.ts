import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { portalProgressPct, resolvePortalMilestoneStep } from '@/lib/student-portal';
import { buildWhatsAppUrl, parseNumericGpa } from '@/lib/wa-templates';
import prisma from '@/lib/prisma';

const TOKEN_REGEX = /^[a-zA-Z0-9_-]{8,80}$/;
const PUBLIC_EVENT_TYPES = new Set([
  'application_stage_changed',
  'uni_app_status',
  'document_updated',
  'student_doc_upload',
  'student_message',
  'reply_to_student',
  'lead_status_changed',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const rateLimit = await checkRateLimit(request, {
    name: 'public-track-portal',
    maxRequests: 120,
    windowMs: 15 * 60 * 1000,
    persistent: false,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const { token } = await params;
    const cleanToken = (token || '').trim();
    if (!TOKEN_REGEX.test(cleanToken)) {
      return NextResponse.json({ error: 'Invalid tracking link.' }, { status: 404 });
    }

    const lead = await prisma.lead.findFirst({
      where: { publicToken: cleanToken, publicEnabled: true },
      select: {
        id: true,
        name: true,
        country: true,
        program: true,
        university: true,
        degree: true,
        gpa: true,
        assessAcademicLevel: true,
        assessAcademicResults: true,
        status: true,
        applicationStage: true,
        visaDeadline: true,
        departureDate: true,
        assignedTo: true,
        assignedEmployee: {
          select: { name: true, role: true, phone: true },
        },
        universityApps: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            university: true,
            program: true,
            status: true,
            applicationId: true,
            submittedOn: true,
            decisionOn: true,
            updatedAt: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            docType: true,
            status: true,
            notes: true,
            studentUploadedUrl: true,
            studentUploadedAt: true,
            updatedAt: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 40,
          select: {
            id: true,
            type: true,
            actorName: true,
            fromValue: true,
            toValue: true,
            details: true,
            createdAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Tracking portal not found or disabled.' }, { status: 404 });
    }

    const milestoneStep = resolvePortalMilestoneStep(
      lead.applicationStage,
      lead.status,
      lead.universityApps,
    );
    const progressPct = portalProgressPct(milestoneStep);

    const counselorName = lead.assignedEmployee?.name || lead.assignedTo || 'EduExpress Admissions Desk';
    const counselorPhone = lead.assignedEmployee?.phone || '+8801983333566';
    const counselorWhatsappUrl = buildWhatsAppUrl(
      counselorPhone,
      `আসসালামু আলাইকুম, আমি ${lead.name} আমার অ্যাপ্লিকেশন ট্র্যাকিং পোর্টাল থেকে যোগাযোগ করছি।`,
    );

    const updates = lead.activities
      .filter((a) => PUBLIC_EVENT_TYPES.has(a.type))
      .slice(0, 25);

    return NextResponse.json(
      {
        student: {
          name: lead.name,
          country: lead.country || 'China',
          program: lead.program || 'Scholarship & Admission',
          university: lead.university || lead.universityApps[0]?.university || null,
          degree: lead.degree || lead.assessAcademicLevel || null,
          gpa: parseNumericGpa(lead.gpa, lead.assessAcademicResults),
          status: lead.status,
          applicationStage: lead.applicationStage,
          visaDeadline: lead.visaDeadline,
          departureDate: lead.departureDate,
          milestoneStep,
          progressPct,
          updatedAt: lead.updatedAt,
        },
        counselor: {
          name: counselorName,
          role: lead.assignedEmployee?.role || 'Admissions Counselor',
          phone: counselorPhone,
          whatsappUrl: counselorWhatsappUrl,
        },
        universityApps: lead.universityApps,
        documents: lead.documents,
        updates,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to load tracking portal.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { canAccessLeadScope, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { generatePublicToken, logActivityEvent } from '@/lib/crm-operations';
import { DEFAULT_CHINA_DOCUMENTS } from '@/lib/student-portal';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { toSafeExternalUrl } from '@/lib/safe-url';
import prisma from '@/lib/prisma';

const ALLOWED_UNI_STATUSES = new Set(['documents', 'ready', 'submitted', 'admitted', 'returned', 'rejected']);
const ALLOWED_DOC_STATUSES = new Set(['pending', 'received', 'verified', 'rejected', 'not_required']);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        publicToken: true,
        publicEnabled: true,
        applicationStage: true,
        university: true,
        degree: true,
        gpa: true,
        visaDeadline: true,
        departureDate: true,
        nextFollowup: true,
        driveLink: true,
        assignedTo: true,
        assignedEmployeeId: true,
        riskFlag: true,
        medicalProgram: true,
        assessIntake: true,
        assessBudget: true,
      },
    });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead assigned to another counselor' }, { status: 403 });
    }

    const [universityApps, documents, activities] = await Promise.all([
      prisma.leadUniversityApp.findMany({ where: { leadId: id }, orderBy: { createdAt: 'desc' } }),
      prisma.leadDocument.findMany({ where: { leadId: id }, orderBy: { createdAt: 'asc' } }),
      prisma.activityEvent.findMany({
        where: { leadId: id },
        orderBy: { createdAt: 'desc' },
        take: 40,
      }),
    ]);

    return NextResponse.json(
      { lead, universityApps, documents, activities },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to load student portal details' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const decoded = admin || staff;
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true, name: true, publicToken: true, assignedTo: true, assignedEmployeeId: true },
    });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    if (!canAccessLeadScope({ role: decoded.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead assigned to another counselor' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const action = typeof body.action === 'string' ? body.action.trim() : '';

    if (action === 'ensure_token' || action === 'regenerate_token') {
      const nextToken = action === 'regenerate_token' || !lead.publicToken
        ? generatePublicToken()
        : lead.publicToken;
      await prisma.lead.update({
        where: { id },
        data: { publicToken: nextToken, publicEnabled: true },
      });
      const existingDocsCount = await prisma.leadDocument.count({ where: { leadId: id } });
      if (existingDocsCount === 0) {
        await prisma.leadDocument.createMany({
          data: DEFAULT_CHINA_DOCUMENTS.map((docType) => ({
            leadId: id,
            docType,
            status: 'pending',
            updatedBy: decoded.email,
          })),
        });
      }
      return NextResponse.json(
        { publicToken: nextToken, publicEnabled: true },
        { headers: { 'Cache-Control': 'no-store, private' } },
      );
    }

    if (action === 'seed_documents') {
      const existingDocs = await prisma.leadDocument.findMany({
        where: { leadId: id },
        select: { docType: true },
      });
      const existingSet = new Set(existingDocs.map((d) => d.docType.toLowerCase()));
      const missing = DEFAULT_CHINA_DOCUMENTS.filter((doc) => !existingSet.has(doc.toLowerCase()));
      if (missing.length) {
        await prisma.leadDocument.createMany({
          data: missing.map((docType) => ({
            leadId: id,
            docType,
            status: 'pending',
            updatedBy: decoded.email,
          })),
        });
      }
      const docs = await prisma.leadDocument.findMany({ where: { leadId: id }, orderBy: { createdAt: 'asc' } });
      return NextResponse.json({ documents: docs }, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    if (action === 'add_university') {
      const university = typeof body.university === 'string' ? body.university.trim().slice(0, 180) : '';
      if (!university) return NextResponse.json({ error: 'University name is required.' }, { status: 400 });
      const status = typeof body.status === 'string' && ALLOWED_UNI_STATUSES.has(body.status)
        ? body.status
        : 'documents';
      const created = await prisma.leadUniversityApp.create({
        data: {
          leadId: id,
          university,
          program: typeof body.program === 'string' ? body.program.trim().slice(0, 160) || null : null,
          status,
          applicationId: typeof body.applicationId === 'string' ? body.applicationId.trim().slice(0, 80) || null : null,
          notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 500) || null : null,
          updatedBy: decoded.email,
        },
      });
      void logActivityEvent({
        type: 'uni_app_status',
        actorName: decoded.email,
        actorUserId: decoded.userId,
        employeeId: lead.assignedEmployeeId,
        leadId: id,
        leadName: lead.name,
        toValue: `${university} (${status})`,
      });
      return NextResponse.json(created, { status: 201, headers: { 'Cache-Control': 'no-store, private' } });
    }

    if (action === 'add_document') {
      const docType = typeof body.docType === 'string' ? body.docType.trim().slice(0, 160) : '';
      if (!docType) return NextResponse.json({ error: 'Document name is required.' }, { status: 400 });
      const created = await prisma.leadDocument.create({
        data: {
          leadId: id,
          docType,
          status: typeof body.status === 'string' && ALLOWED_DOC_STATUSES.has(body.status) ? body.status : 'pending',
          notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 500) || null : null,
          updatedBy: decoded.email,
        },
      });
      return NextResponse.json(created, { status: 201, headers: { 'Cache-Control': 'no-store, private' } });
    }

    if (action === 'reply_student') {
      const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1500) : '';
      if (!message) return NextResponse.json({ error: 'Message text is required.' }, { status: 400 });
      await logActivityEvent({
        type: 'reply_to_student',
        actorName: decoded.email,
        actorUserId: decoded.userId,
        employeeId: lead.assignedEmployeeId,
        leadId: id,
        leadName: lead.name,
        details: message,
      });
      return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    return NextResponse.json({ error: 'Unsupported portal action.' }, { status: 400 });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to update portal record' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const decoded = admin || staff;
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }
    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      select: { id: true, name: true, assignedTo: true, assignedEmployeeId: true },
    });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    if (!canAccessLeadScope({ role: decoded.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead assigned to another counselor' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const kind = typeof body.kind === 'string' ? body.kind : '';
    const itemId = typeof body.itemId === 'string' ? body.itemId : '';
    if (!itemId) return NextResponse.json({ error: 'itemId is required.' }, { status: 400 });

    if (kind === 'university') {
      const existing = await prisma.leadUniversityApp.findFirst({ where: { id: itemId, leadId: id } });
      if (!existing) return NextResponse.json({ error: 'University application not found.' }, { status: 404 });
      const status = typeof body.status === 'string' && ALLOWED_UNI_STATUSES.has(body.status)
        ? body.status
        : existing.status;
      const updated = await prisma.leadUniversityApp.update({
        where: { id: itemId },
        data: {
          status,
          ...(typeof body.applicationId === 'string' ? { applicationId: body.applicationId.trim().slice(0, 80) || null } : {}),
          ...(typeof body.notes === 'string' ? { notes: body.notes.trim().slice(0, 500) || null } : {}),
          updatedBy: decoded.email,
        },
      });
      if (status !== existing.status) {
        void logActivityEvent({
          type: 'uni_app_status',
          actorName: decoded.email,
          actorUserId: decoded.userId,
          employeeId: lead.assignedEmployeeId,
          leadId: id,
          leadName: lead.name,
          fromValue: `${existing.university}: ${existing.status}`,
          toValue: `${existing.university}: ${status}`,
        });
      }
      return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    if (kind === 'document') {
      const existing = await prisma.leadDocument.findFirst({ where: { id: itemId, leadId: id } });
      if (!existing) return NextResponse.json({ error: 'Document item not found.' }, { status: 404 });
      const status = typeof body.status === 'string' && ALLOWED_DOC_STATUSES.has(body.status)
        ? body.status
        : existing.status;
      const fileUrl = body.fileUrl === null
        ? null
        : typeof body.fileUrl === 'string' && body.fileUrl.trim()
          ? toSafeExternalUrl(body.fileUrl, 1000)
          : undefined;
      if (typeof body.fileUrl === 'string' && body.fileUrl.trim() && !fileUrl) {
        return NextResponse.json({ error: 'Document link must be a valid http(s) URL.' }, { status: 400 });
      }
      const updated = await prisma.leadDocument.update({
        where: { id: itemId },
        data: {
          status,
          ...(fileUrl !== undefined ? { fileUrl } : {}),
          ...(typeof body.notes === 'string' ? { notes: body.notes.trim().slice(0, 500) || null } : {}),
          updatedBy: decoded.email,
        },
      });
      void logActivityEvent({
        type: 'document_updated',
        actorName: decoded.email,
        actorUserId: decoded.userId,
        employeeId: lead.assignedEmployeeId,
        leadId: id,
        leadName: lead.name,
        fromValue: `${existing.docType}: ${existing.status}`,
        toValue: `${existing.docType}: ${status}`,
      });
      return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    return NextResponse.json({ error: 'Invalid kind.' }, { status: 400 });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

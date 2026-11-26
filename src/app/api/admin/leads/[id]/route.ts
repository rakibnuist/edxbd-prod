import { NextRequest, NextResponse, after } from 'next/server';
import { sendCrmStage } from '@/lib/meta-crm-events';
import { canAccessFinanceRole, isAdminRole } from '@/lib/auth';
import { canAccessLeadScope, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { generatePublicToken, logActivityEvent } from '@/lib/crm-operations';
import { generateNextLeadRef, getDocsTemplateForDestination } from '@/lib/application-tracker';
import { parseNumericGpa } from '@/lib/wa-templates';
import prisma from '@/lib/prisma';
import { validateLeadUpdate } from '@/lib/lead-workflow';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;

    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }

    if (!canAccessFinanceRole(actor.role)) {
      const { serviceFee: _sf, paidAmount: _pa, deposit: _dep, ...redactedLead } = lead;
      return NextResponse.json(redactedLead, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    return NextResponse.json(lead, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    console.error('Fetch lead error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

async function applyLeadUpdateAndLog(
  id: string,
  validatedData: NonNullable<ReturnType<typeof validateLeadUpdate>['data']>,
  actor: { userId: string; email: string; role: string; employee?: { id: string; empId: string; name: string; team: string; email: string | null } | null },
): Promise<{ status: 'not_found' } | { status: 'forbidden' } | { status: 'ok'; lead: NonNullable<Awaited<ReturnType<typeof prisma.lead.update>>> }> {
  const before = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      country: true,
      status: true,
      isApplication: true,
      leadRef: true,
      publicToken: true,
      applicationStage: true,
      assignedTo: true,
      assignedEmployeeId: true,
      notes: true,
    },
  });
  if (!before) return { status: 'not_found' };

  if (!canAccessLeadScope(actor, before)) {
    return { status: 'forbidden' };
  }

  const updatePayload: Record<string, unknown> = { ...validatedData };

  // If a lead opens file or status moves to application pipeline, ensure isApplication: true and tracker setup
  const isOpeningFile =
    updatePayload.isApplication === true ||
    ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(
      String(updatePayload.status || ''),
    );

  if (isOpeningFile) {
    updatePayload.isApplication = true;
    if (!before.leadRef && !updatePayload.leadRef) {
      const refs = await prisma.lead.findMany({ where: { leadRef: { not: null } }, select: { leadRef: true } });
      updatePayload.leadRef = generateNextLeadRef(refs.map((r) => r.leadRef));
    }
    if (!before.publicToken && !updatePayload.publicToken) {
      updatePayload.publicToken = generatePublicToken();
      updatePayload.publicEnabled = true;
    }
    if (!updatePayload.applicationStage && (!before.applicationStage || before.applicationStage === 'documents')) {
      updatePayload.applicationStage = 'documents';
    }
  }
  // Counselors cannot transfer leads to other counselors (they can only claim unassigned leads for themselves)
  if (!isAdminRole(actor.role)) {
    if ('assignedEmployeeId' in updatePayload || 'assignedTo' in updatePayload) {
      if (actor.employee) {
        updatePayload.assignedEmployeeId = actor.employee.id;
        updatePayload.assignedTo = actor.employee.name;
      } else {
        delete updatePayload.assignedEmployeeId;
        delete updatePayload.assignedTo;
      }
    }
  } else if (typeof updatePayload.assignedEmployeeId === 'string' && updatePayload.assignedEmployeeId && !('assignedTo' in updatePayload)) {
    const emp = await prisma.employee.findUnique({
      where: { id: updatePayload.assignedEmployeeId },
      select: { name: true },
    });
    if (emp) updatePayload.assignedTo = emp.name;
  }
  if ('assessAcademicResults' in updatePayload && !('gpa' in updatePayload)) {
    const parsedGpa = parseNumericGpa(
      null,
      typeof updatePayload.assessAcademicResults === 'string' ? updatePayload.assessAcademicResults : null,
    );
    if (parsedGpa !== null) updatePayload.gpa = parsedGpa;
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: updatePayload,
  }).catch(() => null);
  if (!lead) return { status: 'not_found' };

  const actorDisplay = actor.employee?.name || actor.email;

  if (isOpeningFile && !before.isApplication) {
    const docCount = await prisma.leadDocument.count({ where: { leadId: lead.id } });
    if (docCount === 0) {
      const templateDocs = getDocsTemplateForDestination(lead.country);
      await prisma.leadDocument.createMany({
        data: templateDocs.map((docType) => ({
          leadId: lead.id,
          docType,
          status: 'pending',
          updatedBy: actor.email,
        })),
      }).catch(() => {});
    }
    after(() => logActivityEvent({
      type: 'application_opened',
      actorName: actorDisplay,
      actorUserId: actor.userId,
      employeeId: actor.employee?.id || lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      toValue: `${lead.leadRef || ''} · ${lead.country} (${lead.applicationStage || 'documents'})`,
    }));
  }

  if (lead.status !== before.status) {
    after(() => sendCrmStage(lead, lead.status));
    after(() => logActivityEvent({
      type: 'lead_status_changed',
      actorName: actorDisplay,
      actorUserId: actor.userId,
      employeeId: actor.employee?.id || lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.status,
      toValue: lead.status,
    }));
  }
  if (lead.applicationStage !== before.applicationStage) {
    after(() => logActivityEvent({
      type: 'application_stage_changed',
      actorName: actorDisplay,
      actorUserId: actor.userId,
      employeeId: actor.employee?.id || lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.applicationStage,
      toValue: lead.applicationStage,
    }));
  }
  if (lead.assignedTo !== before.assignedTo || lead.assignedEmployeeId !== before.assignedEmployeeId) {
    after(() => logActivityEvent({
      type: 'lead_assigned',
      actorName: actorDisplay,
      actorUserId: actor.userId,
      employeeId: actor.employee?.id || lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.assignedTo || 'Unassigned',
      toValue: lead.assignedTo || 'Unassigned',
    }));
  }
  if ('notes' in updatePayload && updatePayload.notes !== before.notes) {
    after(() => logActivityEvent({
      type: 'note',
      actorName: actorDisplay,
      actorUserId: actor.userId,
      employeeId: actor.employee?.id || lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      details: typeof updatePayload.notes === 'string' ? updatePayload.notes.slice(0, 300) : null,
    }));
  }

  return { status: 'ok', lead };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;

    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const { id } = await params;

    const body = await readLimitedJson(request, 64 * 1024);
    const validated = validateLeadUpdate(body);
    if (!validated.data) return NextResponse.json({ error: validated.error }, { status: 400 });

    const res = await applyLeadUpdateAndLog(id, validated.data, {
      ...actor,
      employee: staff?.employee,
    });
    if (res.status === 'forbidden') {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }
    if (res.status === 'not_found') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!canAccessFinanceRole(actor.role)) {
      const { serviceFee: _sf, paidAmount: _pa, deposit: _dep, ...redactedLead } = res.lead;
      return NextResponse.json(redactedLead, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    return NextResponse.json(res.lead, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Lead update failed.');
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;

    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const { id } = await params;

    const body = await readLimitedJson(request, 64 * 1024);
    const validated = validateLeadUpdate(body);
    if (!validated.data) return NextResponse.json({ error: validated.error }, { status: 400 });

    const res = await applyLeadUpdateAndLog(id, validated.data, {
      ...actor,
      employee: staff?.employee,
    });
    if (res.status === 'forbidden') {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }
    if (res.status === 'not_found') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!canAccessFinanceRole(actor.role)) {
      const { serviceFee: _sf, paidAmount: _pa, deposit: _dep, ...redactedLead } = res.lead;
      return NextResponse.json(redactedLead, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    return NextResponse.json(res.lead, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Lead update failed.');
    return NextResponse.json(
      { error: 'Failed to update lead' },
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

    const lead = await prisma.lead.delete({ where: { id } }).catch(() => null);
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

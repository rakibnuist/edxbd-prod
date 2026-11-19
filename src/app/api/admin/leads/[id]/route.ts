import { NextRequest, NextResponse, after } from 'next/server';
import { sendCrmStage } from '@/lib/meta-crm-events';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { parseNumericGpa } from '@/lib/wa-templates';
import prisma from '@/lib/prisma';
import { validateLeadUpdate } from '@/lib/lead-workflow';
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

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
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
  actor: { userId: string; email: string },
) {
  const before = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
      applicationStage: true,
      assignedTo: true,
      assignedEmployeeId: true,
      notes: true,
    },
  });
  if (!before) return null;

  const updatePayload = { ...validatedData };
  if (updatePayload.assignedEmployeeId && !('assignedTo' in updatePayload)) {
    const emp = await prisma.employee.findUnique({
      where: { id: updatePayload.assignedEmployeeId },
      select: { name: true },
    });
    if (emp) updatePayload.assignedTo = emp.name;
  }
  if ('assessAcademicResults' in updatePayload && !('gpa' in updatePayload)) {
    const parsedGpa = parseNumericGpa(null, updatePayload.assessAcademicResults);
    if (parsedGpa !== null) updatePayload.gpa = parsedGpa;
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: updatePayload,
  }).catch(() => null);
  if (!lead) return null;

  if (lead.status !== before.status) {
    after(() => sendCrmStage(lead, lead.status));
    after(() => logActivityEvent({
      type: 'lead_status_changed',
      actorName: actor.email,
      actorUserId: actor.userId,
      employeeId: lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.status,
      toValue: lead.status,
    }));
  }
  if (lead.applicationStage !== before.applicationStage) {
    after(() => logActivityEvent({
      type: 'application_stage_changed',
      actorName: actor.email,
      actorUserId: actor.userId,
      employeeId: lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.applicationStage,
      toValue: lead.applicationStage,
    }));
  }
  if (lead.assignedTo !== before.assignedTo || lead.assignedEmployeeId !== before.assignedEmployeeId) {
    after(() => logActivityEvent({
      type: 'lead_assigned',
      actorName: actor.email,
      actorUserId: actor.userId,
      employeeId: lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      fromValue: before.assignedTo || 'Unassigned',
      toValue: lead.assignedTo || 'Unassigned',
    }));
  }
  if ('notes' in updatePayload && updatePayload.notes !== before.notes) {
    after(() => logActivityEvent({
      type: 'note',
      actorName: actor.email,
      actorUserId: actor.userId,
      employeeId: lead.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      details: updatePayload.notes?.slice(0, 300) || null,
    }));
  }

  return lead;
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

    const body = await readLimitedJson(request, 64 * 1024);
    const validated = validateLeadUpdate(body);
    if (!validated.data) return NextResponse.json({ error: validated.error }, { status: 400 });

    const lead = await applyLeadUpdateAndLog(id, validated.data, decoded);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, { headers: { 'Cache-Control': 'no-store, private' } });
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
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    const body = await readLimitedJson(request, 64 * 1024);
    const validated = validateLeadUpdate(body);
    if (!validated.data) return NextResponse.json({ error: validated.error }, { status: 400 });

    const lead = await applyLeadUpdateAndLog(id, validated.data, decoded);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, { headers: { 'Cache-Control': 'no-store, private' } });
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

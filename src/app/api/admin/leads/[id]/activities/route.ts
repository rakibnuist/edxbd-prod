import { NextRequest, NextResponse } from 'next/server';
import { canAccessLeadScope, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { dhakaTimeNow, dhakaTodayIso } from '@/lib/kpi-workflow';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

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
        assignedTo: true,
        assignedEmployeeId: true,
        leadMarket: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }

    const activities = await prisma.activityEvent.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        actorName: true,
        employeeId: true,
        toValue: true,
        fromValue: true,
        details: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ activities }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    console.error('Fetch lead activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead activities' }, { status: 500 });
  }
}

export async function POST(
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
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const outcome = typeof body.outcome === 'string' ? body.outcome.trim() : 'Call Completed';
    const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
    const nextFollowup = typeof body.nextFollowup === 'string' && body.nextFollowup.trim() ? body.nextFollowup.trim() : null;
    const newStatus = typeof body.newStatus === 'string' && body.newStatus.trim() ? body.newStatus.trim() : null;
    const channel = typeof body.channel === 'string' ? body.channel.trim() : 'Phone Call';

    const actorDisplay = staff?.employee?.name || actor.email.split('@')[0];
    const today = dhakaTodayIso();
    const timeNow = dhakaTimeNow();

    const timestampPrefix = `[${today} ${timeNow} | ${actorDisplay} (${channel} - ${outcome})]`;
    const formattedNote = summary ? `${timestampPrefix} ${summary}` : `${timestampPrefix} Status updated.`;

    const updatedNotes = lead.notes
      ? `${formattedNote}\n---\n${lead.notes}`
      : formattedNote;

    const leadUpdateData: Record<string, unknown> = {
      notes: updatedNotes.slice(0, 15000),
      updatedAt: new Date(),
    };

    if (nextFollowup) {
      leadUpdateData.nextFollowup = nextFollowup;
    }

    if (newStatus && newStatus !== lead.status) {
      leadUpdateData.status = newStatus;
    }

    const [updatedLead, activity] = await prisma.$transaction([
      prisma.lead.update({
        where: { id },
        data: leadUpdateData,
      }),
      prisma.activityEvent.create({
        data: {
          type: 'call_logged',
          actorName: actorDisplay,
          actorUserId: actor.userId,
          employeeId: staff?.employee?.id || lead.assignedEmployeeId || null,
          leadId: lead.id,
          leadName: lead.name,
          toValue: outcome,
          fromValue: channel,
          details: summary || `Call logged: ${outcome}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      activity,
      lead: updatedLead,
    }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Failed to log lead interaction:', error);
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}

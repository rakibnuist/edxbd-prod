import { NextRequest, NextResponse, after } from 'next/server';
import { FINANCE_ACTIVITY_TYPES, canAccessFinanceRole } from '@/lib/auth';
import { canAccessLeadScope, verifyLiveStaffUser } from '@/lib/auth-user';
import { generatePublicToken } from '@/lib/crm-operations';
import { generateNextLeadRef, getDocsTemplateForDestination } from '@/lib/application-tracker';
import { dhakaTimeNow, dhakaTodayIso } from '@/lib/kpi-workflow';
import { isLeadStatus } from '@/lib/lead-workflow';
import { sendCrmStage } from '@/lib/meta-crm-events';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const actor = await verifyLiveStaffUser(request);

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

    if (!canAccessLeadScope(actor, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }

    const canSeeFinance = canAccessFinanceRole(actor.role);
    const activities = await prisma.activityEvent.findMany({
      where: {
        leadId: id,
        ...(canSeeFinance ? {} : { type: { notIn: [...FINANCE_ACTIVITY_TYPES] } }),
      },
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
    const actor = await verifyLiveStaffUser(request);

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

    if (!canAccessLeadScope(actor, lead)) {
      return NextResponse.json({ message: 'Unauthorized - Lead is assigned to another counselor' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const outcome = typeof body.outcome === 'string' && body.outcome.trim()
      ? body.outcome.trim().slice(0, 120)
      : 'Call Completed';
    const summary = typeof body.summary === 'string' ? body.summary.trim().slice(0, 2000) : '';
    const rawFollowup = typeof body.nextFollowup === 'string' ? body.nextFollowup.trim() : '';
    let nextFollowup: string | null = null;
    if (rawFollowup) {
      const normalized = rawFollowup.replace(' ', 'T');
      if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/.test(normalized)) {
        return NextResponse.json({ error: 'nextFollowup must be YYYY-MM-DD or YYYY-MM-DDTHH:mm.' }, { status: 400 });
      }
      nextFollowup = normalized.slice(0, 16);
    }

    const rawStatus = typeof body.newStatus === 'string' && body.newStatus.trim() ? body.newStatus.trim() : null;
    if (rawStatus && !isLeadStatus(rawStatus)) {
      return NextResponse.json({ error: 'Choose a supported lead status.' }, { status: 400 });
    }
    const newStatus = rawStatus;
    const channel = typeof body.channel === 'string' && body.channel.trim()
      ? body.channel.trim().slice(0, 60)
      : 'Phone Call';

    const actorDisplay = actor.employee?.name || actor.name || actor.email.split('@')[0];
    const today = dhakaTodayIso();
    const timeNow = dhakaTimeNow();

    const timestampPrefix = `[${today} ${timeNow} | ${actorDisplay} (${channel} - ${outcome})]`;
    const formattedNote = summary ? `${timestampPrefix} ${summary}` : `${timestampPrefix} Status updated.`;

    const updatedNotes = lead.notes
      ? `${formattedNote}\n---\n${lead.notes}`
      : formattedNote;

    const leadUpdateData: Record<string, unknown> = {
      notes: updatedNotes.slice(0, 12000),
      updatedAt: new Date(),
    };

    if (nextFollowup) {
      leadUpdateData.nextFollowup = nextFollowup;
    }

    // Do not downgrade an active Application Tracker file back to a pre-application lead status
    const isAppPromotion =
      newStatus &&
      ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'].includes(
        newStatus,
      );

    if (newStatus && newStatus !== lead.status && (!lead.isApplication || isAppPromotion)) {
      leadUpdateData.status = newStatus;
      if (isAppPromotion && !lead.isApplication) {
        leadUpdateData.isApplication = true;
        if (!lead.leadRef) {
          const refs = await prisma.lead.findMany({ where: { leadRef: { not: null } }, select: { leadRef: true } });
          leadUpdateData.leadRef = generateNextLeadRef(refs.map((r) => r.leadRef));
        }
        if (!lead.publicToken) {
          leadUpdateData.publicToken = generatePublicToken();
          leadUpdateData.publicEnabled = true;
        }
        if (!lead.applicationStage || lead.applicationStage === 'documents') {
          leadUpdateData.applicationStage = 'documents';
        }
      }
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
          employeeId: actor.employee?.id || null,
          leadId: lead.id,
          leadName: lead.name,
          toValue: outcome,
          fromValue: channel,
          details: summary || `Call logged: ${outcome}`,
        },
      }),
    ]);

    if (leadUpdateData.isApplication === true && !lead.isApplication) {
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
    }

    if (updatedLead.status !== lead.status) {
      after(() => sendCrmStage(updatedLead, updatedLead.status));
    }

    const safeLead = canAccessFinanceRole(actor.role)
      ? updatedLead
      : (({ serviceFee: _sf, paidAmount: _pa, deposit: _dep, ...rest }) => rest)(updatedLead);

    return NextResponse.json({
      success: true,
      activity,
      lead: safeLead,
    }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Failed to log lead interaction:', error);
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}

import { NextRequest, NextResponse, after } from 'next/server';
import { canAccessFinanceRole, isAdminRole } from '@/lib/auth';
import { buildCounselorLeadWhere, verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { isLeadStatus } from '@/lib/lead-workflow';
import { sendCrmStage } from '@/lib/meta-crm-events';
import { syncMetaInstantFormLeads } from '@/lib/meta-leads-sync';
import { validateAdminLeadCreate } from '@/lib/payload-validation';
import { generatePublicToken, logActivityEvent, resolveAutoAssignment } from '@/lib/crm-operations';
import { parseNumericGpa } from '@/lib/wa-templates';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;

    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const isAdmin = isAdminRole(actor.role);
    const { searchParams } = new URL(request.url);
    if (isAdmin) {
      await syncMetaInstantFormLeads({
        force: searchParams.get('sync') === '1',
        onLeadCreated: (lead) => {
          after(() => sendCrmStage(lead, 'new'));
        },
      }).catch(() => {});
    }

    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const country = searchParams.get('country');

    const filterWhere: Record<string, unknown> = {};
    if (status && status !== 'all') filterWhere.status = status;
    if (source && source !== 'all') filterWhere.source = source;
    if (country && country !== 'all') filterWhere.country = country;

    const where = isAdmin
      ? filterWhere
      : { AND: [buildCounselorLeadWhere(staff?.employee || null), filterWhere] };

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const canSeeFinance = canAccessFinanceRole(actor.role);
    const payload = canSeeFinance
      ? leads
      : leads.map(({ serviceFee: _sf, paidAmount: _pa, deposit: _dep, ...rest }) => rest);

    return NextResponse.json(payload, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    // Error fetching leads
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 512 * 1024);

    if (Array.isArray(body.leads)) {
      if (body.leads.length === 0) {
        return NextResponse.json({ error: 'Provide at least one lead to import.' }, { status: 400 });
      }
      if (body.leads.length > 500) {
        return NextResponse.json({ error: 'Batch import is limited to 500 leads per request.' }, { status: 400 });
      }

      const existing = await prisma.lead.findMany({ select: { phone: true } });
      const existingPhones = new Set(
        existing.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
      );

      const created: Awaited<ReturnType<typeof prisma.lead.create>>[] = [];
      let skippedCount = 0;
      let invalidCount = 0;

      for (const item of body.leads) {
        const validated = validateAdminLeadCreate(item, isLeadStatus);
        if (!validated.data) {
          invalidCount++;
          continue;
        }
        const key10 = validated.data.phone.replace(/\D/g, '').slice(-10);
        if (key10 && existingPhones.has(key10)) {
          skippedCount++;
          continue;
        }
        const autoAssigned = await resolveAutoAssignment({
          assignedTeam: validated.data.assignedTeam,
          country: validated.data.country,
        });
        const lead = await prisma.lead.create({
          data: {
            ...validated.data,
            publicToken: generatePublicToken(),
            publicEnabled: true,
            gpa: parseNumericGpa(null, validated.data.assessAcademicResults),
            degree: validated.data.assessAcademicLevel || null,
            assignedTo: autoAssigned.assignedTo,
            assignedEmployeeId: autoAssigned.assignedEmployeeId,
            ...(validated.data.source.startsWith('meta_') ? { adTrackingConsent: true } : {}),
          },
        });
        void logActivityEvent({
          type: 'lead_created',
          actorName: decoded.email,
          actorUserId: decoded.userId,
          employeeId: autoAssigned.assignedEmployeeId,
          leadId: lead.id,
          leadName: lead.name,
          toValue: autoAssigned.assignedTo || lead.assignedTeam,
          details: `Batch import (${lead.source})`,
        });
        created.push(lead);
        if (key10) existingPhones.add(key10);
      }

      if (created.length === 0 && skippedCount === 0 && invalidCount > 0) {
        return NextResponse.json({ error: 'No valid lead rows in import batch.' }, { status: 400 });
      }

      return NextResponse.json(
        { created, importedCount: created.length, skippedCount, invalidCount },
        { status: 201 }
      );
    }

    const validated = validateAdminLeadCreate(body, isLeadStatus);
    if (!validated.data) {
      return NextResponse.json({ error: validated.error || 'Invalid lead payload' }, { status: 400 });
    }

    const autoAssigned = await resolveAutoAssignment({
      assignedTeam: validated.data.assignedTeam,
      country: validated.data.country,
    });
    const lead = await prisma.lead.create({
      data: {
        ...validated.data,
        publicToken: generatePublicToken(),
        publicEnabled: true,
        gpa: parseNumericGpa(null, validated.data.assessAcademicResults),
        degree: validated.data.assessAcademicLevel || null,
        assignedTo: autoAssigned.assignedTo,
        assignedEmployeeId: autoAssigned.assignedEmployeeId,
      },
    });
    void logActivityEvent({
      type: 'lead_created',
      actorName: decoded.email,
      actorUserId: decoded.userId,
      employeeId: autoAssigned.assignedEmployeeId,
      leadId: lead.id,
      leadName: lead.name,
      toValue: autoAssigned.assignedTo || lead.assignedTeam,
      details: `Created in Admin (${lead.country})`,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const deletedLead = await prisma.lead.delete({
      where: { id: leadId }
    }).catch(() => null);

    if (!deletedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted successfully', deletedLead });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

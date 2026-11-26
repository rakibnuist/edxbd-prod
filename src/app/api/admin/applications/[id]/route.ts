import { NextRequest, NextResponse } from 'next/server';
import { FINANCE_ACTIVITY_TYPES, canAccessFinanceRole } from '@/lib/auth';
import {
  canAccessLeadScope,
  verifyLiveAdminUser,
  verifyLiveStaffUser,
} from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import {
  deriveLeadStatusFromStage,
  normalizeTrackerStage,
  validateApplicationPatchPayload,
  type ApplicationRowDto,
} from '@/lib/application-tracker';
import prisma from '@/lib/prisma';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, private' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json(
        { message: 'Unauthorized - Staff access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const isAdmin = Boolean(admin);
    const canSeeFinance = canAccessFinanceRole(actor.role);
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedEmployee: { select: { id: true, name: true, empId: true } },
        universityApps: { orderBy: { createdAt: 'desc' } },
        documents: { orderBy: { createdAt: 'asc' } },
        activities: {
          where: canSeeFinance ? undefined : { type: { notIn: [...FINANCE_ACTIVITY_TYPES] } },
          orderBy: { createdAt: 'desc' },
          take: 60,
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404, headers: NO_STORE_HEADERS });
    }
    if (!isAdmin && lead.leadMarket === 'China') {
      return NextResponse.json(
        { error: 'Access denied to China market applications.' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }
    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, lead)) {
      return NextResponse.json(
        { message: 'Unauthorized - Application assigned to another counselor' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    let financeIncomes: Array<{
      id: string;
      date: string;
      month: string;
      category: string | null;
      amount: number;
      reference: string | null;
      notes: string | null;
      excludeFromCash: boolean;
    }> = [];
    let financeExpenses: Array<{
      id: string;
      date: string;
      month: string;
      category: string | null;
      paidTo: string | null;
      amount: number;
      reference: string | null;
      notes: string | null;
    }> = [];

    if (canSeeFinance) {
      const matchOr = [
        { leadId: lead.id },
        ...(lead.leadRef ? [{ leadRef: lead.leadRef }] : []),
      ];
      [financeIncomes, financeExpenses] = await Promise.all([
        prisma.financeIncome.findMany({
          where: { OR: matchOr },
          select: {
            id: true,
            date: true,
            month: true,
            category: true,
            amount: true,
            reference: true,
            notes: true,
            excludeFromCash: true,
          },
          orderBy: { date: 'desc' },
        }),
        prisma.financeExpense.findMany({
          where: { OR: matchOr },
          select: {
            id: true,
            date: true,
            month: true,
            category: true,
            paidTo: true,
            amount: true,
            reference: true,
            notes: true,
          },
          orderBy: { date: 'desc' },
        }),
      ]);
    }

    const financeReceivedTotal = canSeeFinance
      ? financeIncomes.filter((i) => !i.excludeFromCash).reduce((s, r) => s + (Number(r.amount) || 0), 0)
      : null;
    const financeSpentTotal = canSeeFinance
      ? financeExpenses.reduce((s, r) => s + (Number(r.amount) || 0), 0)
      : null;

    const docsTotal = lead.documents.length;
    const docsReceived = lead.documents.filter((d) => d.status === 'received' || d.status === 'verified').length;
    const uniTotal = lead.universityApps.length;
    const uniAdmitted = lead.universityApps.filter((u) => u.status === 'admitted').length;
    const uniList = lead.universityApps.map((u) => u.university).filter(Boolean).join(', ');

    const application: ApplicationRowDto = {
      id: lead.id,
      legacyCrmId: lead.legacyCrmId,
      leadRef: lead.leadRef,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      leadMarket: lead.leadMarket || 'Bangladesh',
      channelType: lead.channelType || 'B2C',
      source: lead.source,
      referrer: lead.referrer,
      nationality: lead.nationality,
      passport: lead.passport,
      assessIntake: lead.assessIntake,
      degree: lead.degree,
      program: lead.program,
      university: lead.university,
      gpa: lead.gpa,
      assessAcademicLevel: lead.assessAcademicLevel,
      assessAcademicResults: lead.assessAcademicResults,
      assessLanguage: lead.assessLanguage,
      status: lead.status,
      applicationStage: normalizeTrackerStage(lead.applicationStage),
      embassyStatus: lead.embassyStatus,
      embassyDate: lead.embassyDate,
      hardcopyStatus: lead.hardcopyStatus,
      visaDeadline: lead.visaDeadline,
      departureDate: lead.departureDate,
      nextFollowup: lead.nextFollowup,
      driveLink: lead.driveLink,
      serviceFee: canSeeFinance ? lead.serviceFee || 0 : 0,
      paidAmount: canSeeFinance ? lead.paidAmount || 0 : 0,
      deposit: canSeeFinance ? lead.deposit || 0 : 0,
      applicationNotes: lead.applicationNotes,
      notes: lead.notes,
      bloodGroup: lead.bloodGroup,
      dateOfBirth: lead.dateOfBirth,
      emergencyContact: lead.emergencyContact,
      medicalNotes: lead.medicalNotes,
      publicToken: lead.publicToken,
      publicEnabled: lead.publicEnabled,
      assignedTo: lead.assignedTo,
      assignedEmployeeId: lead.assignedEmployeeId,
      employeeName: lead.assignedEmployee?.name || lead.assignedTo || null,
      docsTotal,
      docsReceived,
      uniTotal,
      uniAdmitted,
      uniList,
      financeReceivedTotal,
      financeSpentTotal,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    };

    return NextResponse.json(
      {
        isAdmin,
        canAccessFinance: canSeeFinance,
        application,
        universityApps: lead.universityApps,
        documents: lead.documents,
        activities: lead.activities,
        finance: canSeeFinance
          ? {
              receivedTotal: financeReceivedTotal || 0,
              spentTotal: financeSpentTotal || 0,
              netTotal: (financeReceivedTotal || 0) - (financeSpentTotal || 0),
              incomes: financeIncomes,
              expenses: financeExpenses,
            }
          : null,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (err) {
    console.error('[applications/[id] GET]', err);
    return NextResponse.json(
      { error: 'Failed to load application details.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json(
        { message: 'Unauthorized - Staff access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const isAdmin = Boolean(admin);
    const canSeeFinance = canAccessFinanceRole(actor.role);
    const { id } = await params;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404, headers: NO_STORE_HEADERS });
    }
    if (!isAdmin && existing.leadMarket === 'China') {
      return NextResponse.json(
        { error: 'Access denied to China market applications.' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }
    if (!canAccessLeadScope({ role: actor.role, employee: staff?.employee }, existing)) {
      return NextResponse.json(
        { message: 'Unauthorized - Application assigned to another counselor' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const body = await readLimitedJson(request, 32 * 1024);
    const validated = validateApplicationPatchPayload(body);
    if (validated.error) {
      return NextResponse.json({ error: validated.error }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const data = { ...(validated.data || {}) };

    // Non-finance roles must never view or overwrite student financial fields
    if (!canSeeFinance) {
      delete data.serviceFee;
      delete data.paidAmount;
      delete data.deposit;
    }

    // Enforce RBAC rules for counselors
    if (!isAdmin) {
      if (data.leadMarket === 'China') {
        return NextResponse.json(
          { error: 'Counselor accounts cannot move files into China market.' },
          { status: 403, headers: NO_STORE_HEADERS },
        );
      }
      if ('assignedEmployeeId' in data || 'assignedTo' in data) {
        const myEmpId = staff?.employee?.id ?? null;
        const myEmpName = staff?.employee?.name?.trim().toLowerCase() ?? null;
        const targetEmpId = data.assignedEmployeeId as string | null | undefined;
        const targetName = typeof data.assignedTo === 'string' ? data.assignedTo.trim().toLowerCase() : null;
        const changingToOtherEmp = targetEmpId !== undefined && targetEmpId !== myEmpId && targetEmpId !== existing.assignedEmployeeId;
        const changingToOtherName = targetName !== null && targetName !== myEmpName && targetName !== (existing.assignedTo || '').trim().toLowerCase();
        if (changingToOtherEmp || changingToOtherName) {
          return NextResponse.json(
            { error: 'Only administrators can reassign applications to another counselor.' },
            { status: 403, headers: NO_STORE_HEADERS },
          );
        }
      }
      delete data.isApplication;
    }

    // Sync assignedTo when assignedEmployeeId is provided
    if ('assignedEmployeeId' in data) {
      const empId = data.assignedEmployeeId as string | null;
      if (empId) {
        const emp = await prisma.employee.findUnique({ where: { id: empId }, select: { name: true } });
        if (emp) data.assignedTo = emp.name;
      } else {
        data.assignedTo = null;
      }
    }

    // Sync Lead.status when applicationStage changes
    const prevStage = normalizeTrackerStage(existing.applicationStage);
    const nextStage = typeof data.applicationStage === 'string' ? data.applicationStage : prevStage;
    if ('applicationStage' in data && nextStage !== prevStage) {
      data.status = deriveLeadStatusFromStage(nextStage, existing.status);
    }

    const updated = await prisma.lead.update({
      where: { id },
      data,
    });

    if (nextStage !== prevStage) {
      void logActivityEvent({
        type: 'application_stage_changed',
        actorName: actor.email,
        actorUserId: actor.userId,
        employeeId: updated.assignedEmployeeId,
        leadId: updated.id,
        leadName: updated.name,
        fromValue: prevStage,
        toValue: nextStage,
      });
    } else if ('embassyStatus' in data && data.embassyStatus !== existing.embassyStatus) {
      void logActivityEvent({
        type: 'embassy_status_changed',
        actorName: actor.email,
        actorUserId: actor.userId,
        employeeId: updated.assignedEmployeeId,
        leadId: updated.id,
        leadName: updated.name,
        fromValue: existing.embassyStatus || 'Pending',
        toValue: String(data.embassyStatus || 'Pending'),
      });
    }

    return NextResponse.json(
      { ok: true, id: updated.id, applicationStage: updated.applicationStage, status: updated.status },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('[applications/[id] PATCH]', error);
    return NextResponse.json(
      { error: 'Failed to update application.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const { id } = await params;
    const existing = await prisma.lead.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404, headers: NO_STORE_HEADERS });
    }

    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id }, { headers: NO_STORE_HEADERS });
  } catch (err) {
    console.error('[applications/[id] DELETE]', err);
    return NextResponse.json(
      { error: 'Failed to delete application.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

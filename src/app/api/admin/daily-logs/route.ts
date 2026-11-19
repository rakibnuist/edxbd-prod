import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { dhakaTodayIso } from '@/lib/kpi-workflow';
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

    const { searchParams } = new URL(request.url);
    const isAdmin = isAdminRole(actor.role);
    const employeeId = isAdmin ? searchParams.get('employeeId') : (staff?.employee?.id || '__none__');
    const date = searchParams.get('date');

    const logs = await prisma.dailyLog.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(date ? { date } : {}),
      },
      orderBy: [{ date: 'desc' }, { updatedAt: 'desc' }],
      take: 60,
      include: {
        employee: { select: { empId: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ logs }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch daily logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const decoded = admin || staff;
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const isAdmin = isAdminRole(decoded.role);
    const body = await readLimitedJson(request, 32 * 1024);
    const requestedEmployeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';

    if (!isAdmin) {
      if (!staff?.employee) {
        return NextResponse.json({ error: 'Your user login is not linked to an employee profile.' }, { status: 403 });
      }
      if (requestedEmployeeId && requestedEmployeeId !== staff.employee.id && requestedEmployeeId !== staff.employee.empId) {
        return NextResponse.json({ error: 'Unauthorized - You can only submit your own daily log.' }, { status: 403 });
      }
    }

    const employeeId = isAdmin ? requestedEmployeeId : (staff?.employee?.id || '');
    const employee = employeeId
      ? await prisma.employee.findFirst({ where: { OR: [{ id: employeeId }, { empId: employeeId }] } })
      : null;
    if (!employee) {
      return NextResponse.json({ error: 'Valid employee is required.' }, { status: 400 });
    }

    const accomplishments = typeof body.accomplishments === 'string' ? body.accomplishments.trim().slice(0, 4000) : '';
    if (!accomplishments) {
      return NextResponse.json({ error: 'Accomplishments summary is required.' }, { status: 400 });
    }

    const date = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : dhakaTodayIso();
    const existing = await prisma.dailyLog.findUnique({
      where: { empId_date: { empId: employee.empId, date } },
    });

    const saved = await prisma.dailyLog.upsert({
      where: { empId_date: { empId: employee.empId, date } },
      update: {
        employeeId: employee.id,
        accomplishments,
        challenges: typeof body.challenges === 'string' ? body.challenges.trim().slice(0, 2000) || null : null,
        tomorrowPlan: typeof body.tomorrowPlan === 'string' ? body.tomorrowPlan.trim().slice(0, 2000) || null : null,
        metricsJson: typeof body.metricsJson === 'string' ? body.metricsJson.slice(0, 1000) : null,
      },
      create: {
        employeeId: employee.id,
        empId: employee.empId,
        date,
        accomplishments,
        challenges: typeof body.challenges === 'string' ? body.challenges.trim().slice(0, 2000) || null : null,
        tomorrowPlan: typeof body.tomorrowPlan === 'string' ? body.tomorrowPlan.trim().slice(0, 2000) || null : null,
        metricsJson: typeof body.metricsJson === 'string' ? body.metricsJson.slice(0, 1000) : null,
      },
    });

    void logActivityEvent({
      type: existing ? 'daily_log_updated' : 'daily_log_submitted',
      actorName: employee.name,
      actorUserId: decoded.userId,
      employeeId: employee.id,
      toValue: date,
      details: accomplishments.slice(0, 240),
    });

    return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to submit daily log' }, { status: 500 });
  }
}

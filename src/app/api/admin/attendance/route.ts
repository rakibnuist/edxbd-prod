import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { computeHoursWorked, dhakaTimeNow, dhakaTodayIso } from '@/lib/kpi-workflow';
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
    const date = searchParams.get('date') || dhakaTodayIso();
    const records = await prisma.attendance.findMany({
      where: isAdminRole(actor.role)
        ? { date }
        : { date, employeeId: staff?.employee?.id || '__none__' },
      orderBy: { empId: 'asc' },
    });
    return NextResponse.json({ date, records }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Failed to load attendance' }, { status: 500 });
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
    const body = await readLimitedJson(request, 16 * 1024);
    const requestedEmployeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';

    if (!isAdmin) {
      if (!staff?.employee) {
        return NextResponse.json({ error: 'Your user login is not linked to an employee profile.' }, { status: 403 });
      }
      if (requestedEmployeeId && requestedEmployeeId !== staff.employee.id && requestedEmployeeId !== staff.employee.empId) {
        return NextResponse.json({ error: 'Unauthorized - You can only record your own attendance.' }, { status: 403 });
      }
    }

    const employeeId = isAdmin ? requestedEmployeeId : (staff?.employee?.id || '');
    const employee = employeeId
      ? await prisma.employee.findFirst({ where: { OR: [{ id: employeeId }, { empId: employeeId }] } })
      : null;
    if (!employee) {
      return NextResponse.json({ error: 'Valid employee is required.' }, { status: 400 });
    }

    const date = isAdmin && typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
      ? body.date
      : dhakaTodayIso();
    const mode = typeof body.mode === 'string' ? body.mode : 'checkin';
    const existing = await prisma.attendance.findUnique({
      where: { empId_date: { empId: employee.empId, date } },
    });

    const nowTime = dhakaTimeNow();
    let checkIn = isAdmin && typeof body.checkIn === 'string' ? body.checkIn.trim().slice(0, 10) : existing?.checkIn || null;
    let checkOut = isAdmin && typeof body.checkOut === 'string' ? body.checkOut.trim().slice(0, 10) : existing?.checkOut || null;
    let status = isAdmin && typeof body.status === 'string' ? body.status.trim().slice(0, 30) : existing?.status || 'Present';

    if (mode === 'checkin' && !checkIn) {
      checkIn = nowTime;
      status = nowTime > '10:20' ? 'Late' : 'Present';
    } else if (mode === 'checkout') {
      if (!checkIn) checkIn = nowTime;
      checkOut = nowTime;
    }

    const hoursWorked = computeHoursWorked(checkIn, checkOut);
    const saved = await prisma.attendance.upsert({
      where: { empId_date: { empId: employee.empId, date } },
      update: {
        employeeId: employee.id,
        name: employee.name,
        checkIn,
        checkOut,
        hoursWorked,
        status,
        notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 300) || null : existing?.notes || null,
      },
      create: {
        employeeId: employee.id,
        empId: employee.empId,
        name: employee.name,
        date,
        checkIn,
        checkOut,
        hoursWorked,
        status,
        source: mode === 'manual' ? 'manual' : 'workspace',
        notes: typeof body.notes === 'string' ? body.notes.trim().slice(0, 300) || null : null,
      },
    });

    if (!existing) {
      void logActivityEvent({
        type: 'attendance_in',
        actorName: employee.name,
        actorUserId: decoded.userId,
        employeeId: employee.id,
        toValue: `${status} (${checkIn || date})`,
      });
    }

    return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { computeEmployeeKpiReport, normalizeMonthParam, shiftIsoDays } from '@/lib/kpi-workflow';
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
    const selfEmpId = staff?.employee?.id || '__none__';

    const { searchParams } = new URL(request.url);
    const month = normalizeMonthParam(searchParams.get('month'));
    const [y, m] = month.split('-').map(Number);
    const start = `${month}-01`;
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const end = `${month}-${String(daysInMonth).padStart(2, '0')}`;
    const winStartDate = new Date(`${shiftIsoDays(start, -1)}T00:00:00.000Z`);
    const winEndDate = new Date(`${shiftIsoDays(end, 1)}T23:59:59.999Z`);

    const [employees, attendances, dailyLogs, targets, tasks, leads, activities] = await Promise.all([
      prisma.employee.findMany({
        where: isAdmin ? { active: true } : { active: true, id: selfEmpId },
        orderBy: { empId: 'asc' },
        select: {
          id: true, empId: true, name: true, role: true, email: true,
          phone: true, team: true, specialization: true, active: true, userId: true,
        },
      }),
      prisma.attendance.findMany({
        where: isAdmin
          ? { date: { gte: start, lte: end } }
          : { employeeId: selfEmpId, date: { gte: start, lte: end } },
        select: { id: true, employeeId: true, empId: true, date: true, checkIn: true, checkOut: true, hoursWorked: true, status: true },
      }),
      prisma.dailyLog.findMany({
        where: isAdmin
          ? { date: { gte: start, lte: end } }
          : { employeeId: selfEmpId, date: { gte: start, lte: end } },
        select: { id: true, employeeId: true, empId: true, date: true, accomplishments: true, challenges: true, tomorrowPlan: true, metricsJson: true, submittedAt: true },
      }),
      prisma.kpiTarget.findMany({
        where: isAdmin ? { month } : { month, employeeId: selfEmpId },
        select: { employeeId: true, consultant: true, month: true, targetLeads: true, targetEnrolled: true, targetRevenue: true, targetDailyActions: true, targetFollowups: true, maxSlaHours: true },
      }),
      prisma.taskDirective.findMany({
        where: isAdmin
          ? { status: { not: 'cancelled' } }
          : { status: { not: 'cancelled' }, employeeId: selfEmpId },
        select: { id: true, title: true, details: true, assignedTo: true, employeeId: true, assignedBy: true, dueDate: true, priority: true, status: true, category: true, leadId: true, completedAt: true, createdAt: true, updatedAt: true },
      }),
      prisma.lead.findMany({
        where: isAdmin ? undefined : { assignedEmployeeId: selfEmpId },
        select: { id: true, name: true, phone: true, country: true, status: true, applicationStage: true, assignedTo: true, assignedEmployeeId: true, nextFollowup: true, gpa: true, assessAcademicResults: true, createdAt: true, updatedAt: true },
      }),
      prisma.activityEvent.findMany({
        where: isAdmin
          ? { createdAt: { gte: winStartDate, lte: winEndDate } }
          : { employeeId: selfEmpId, createdAt: { gte: winStartDate, lte: winEndDate } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, type: true, actorName: true, actorUserId: true, employeeId: true, leadId: true, leadName: true, fromValue: true, toValue: true, details: true, createdAt: true },
      }),
    ]);

    const report = computeEmployeeKpiReport({
      month,
      employees,
      attendances,
      dailyLogs,
      targets,
      tasks,
      leads,
      activities,
    });

    return NextResponse.json(
      {
        ...report,
        recentDailyLogs: dailyLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20),
        openTasks: tasks.filter((t) => t.status !== 'done').slice(0, 60),
        recentActivities: activities.slice(0, 40),
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    console.error('KPI report error:', err);
    return NextResponse.json({ error: 'Failed to compute KPI report' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const employeeId = typeof body.employeeId === 'string' && body.employeeId.trim() ? body.employeeId.trim() : null;
    let consultant = typeof body.consultant === 'string' ? body.consultant.trim() : '';

    if (!consultant && employeeId) {
      const emp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { name: true } });
      if (emp) consultant = emp.name;
    }
    if (!consultant) {
      return NextResponse.json({ error: 'Employee or consultant name is required.' }, { status: 400 });
    }

    const month = normalizeMonthParam(typeof body.month === 'string' ? body.month : null);
    const toInt = (val: unknown, def: number, min: number, max: number) => {
      const n = Number(val);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def;
    };

    const targetDailyActions = toInt(body.targetDailyActions, 12, 1, 200);
    const targetFollowups = toInt(body.targetFollowups, 10, 0, 200);
    const maxSlaHours = toInt(body.maxSlaHours, 24, 1, 168);
    const targetLeads = toInt(body.targetLeads, 30, 0, 2000);
    const targetEnrolled = toInt(body.targetEnrolled, 5, 0, 500);

    const saved = await prisma.kpiTarget.upsert({
      where: { consultant_month: { consultant, month } },
      update: {
        employeeId,
        targetDailyActions,
        targetFollowups,
        maxSlaHours,
        targetLeads,
        targetEnrolled,
      },
      create: {
        employeeId,
        consultant,
        month,
        targetDailyActions,
        targetFollowups,
        maxSlaHours,
        targetLeads,
        targetEnrolled,
      },
    });

    return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to save KPI target' }, { status: 500 });
  }
}

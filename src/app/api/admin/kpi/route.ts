import { NextRequest, NextResponse } from 'next/server';
import { FINANCE_ACTIVITY_TYPES, canAccessFinanceRole, isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { seedDefaultMonthlyTargets } from '@/lib/crm-operations';
import { computeEmployeeKpiReport, dhakaTodayIso, normalizeMonthParam, shiftIsoDays } from '@/lib/kpi-workflow';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { getMetaConfig } from '@/lib/settings';
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
    const canSeeFinance = canAccessFinanceRole(actor.role);
    const selfEmp = staff?.employee || null;
    const selfEmpId = selfEmp?.id || '__none__';

    const { searchParams } = new URL(request.url);
    const month = normalizeMonthParam(searchParams.get('month'));
    const todayIso = dhakaTodayIso();
    const [y, m] = month.split('-').map(Number);
    const start = `${month}-01`;
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const end = `${month}-${String(daysInMonth).padStart(2, '0')}`;
    const winStartDate = new Date(`${shiftIsoDays(start, -1)}T00:00:00.000Z`);
    const winEndDate = new Date(`${shiftIsoDays(end, 1)}T23:59:59.999Z`);
    const dateRangeOrToday = { OR: [{ date: { gte: start, lte: end } }, { date: todayIso }] };

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
          ? dateRangeOrToday
          : { AND: [dateRangeOrToday, { employeeId: selfEmpId }] },
        select: { id: true, employeeId: true, empId: true, date: true, checkIn: true, checkOut: true, hoursWorked: true, status: true, source: true, notes: true },
      }),
      prisma.dailyLog.findMany({
        where: isAdmin
          ? dateRangeOrToday
          : { AND: [dateRangeOrToday, { employeeId: selfEmpId }] },
        select: { id: true, employeeId: true, empId: true, date: true, accomplishments: true, challenges: true, tomorrowPlan: true, metricsJson: true, submittedAt: true },
      }),
      prisma.kpiTarget.findMany({
        where: isAdmin
          ? { month }
          : {
              month,
              OR: [
                { employeeId: selfEmpId },
                ...(selfEmp ? [{ employeeId: null, consultant: selfEmp.name }] : []),
              ],
            },
        select: { employeeId: true, consultant: true, month: true, targetLeads: true, targetEnrolled: true, targetRevenue: true, targetDailyActions: true, targetFollowups: true, maxSlaHours: true },
      }),
      prisma.taskDirective.findMany({
        where: isAdmin
          ? { status: { not: 'cancelled' } }
          : {
              status: { not: 'cancelled' },
              OR: [
                { employeeId: selfEmpId },
                ...(selfEmp ? [{ employeeId: null, assignedTo: selfEmp.name }] : []),
              ],
            },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        select: { id: true, title: true, details: true, assignedTo: true, employeeId: true, assignedBy: true, dueDate: true, priority: true, status: true, category: true, leadId: true, completedAt: true, createdAt: true, updatedAt: true },
      }),
      prisma.lead.findMany({
        where: isAdmin
          ? undefined
          : {
              OR: [
                { assignedEmployeeId: selfEmpId },
                ...(selfEmp
                  ? [
                      { assignedEmployeeId: null, assignedTo: selfEmp.name },
                      {
                        isApplication: true,
                        assignedEmployeeId: null,
                        assignedTo: null,
                        referrer: { contains: selfEmp.name },
                      },
                    ]
                  : []),
              ],
            },
        select: {
          id: true,
          name: true,
          phone: true,
          country: true,
          source: true,
          utm: true,
          message: true,
          channelType: true,
          status: true,
          isApplication: true,
          referrer: true,
          applicationStage: true,
          assignedTo: true,
          assignedEmployeeId: true,
          nextFollowup: true,
          gpa: true,
          assessAcademicResults: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.activityEvent.findMany({
        where: {
          createdAt: { gte: winStartDate, lte: winEndDate },
          ...(isAdmin
            ? {}
            : {
                OR: [
                  { employeeId: selfEmpId },
                  { employeeId: null, actorUserId: actor.userId },
                  ...(selfEmp ? [{ employeeId: null, actorName: selfEmp.name }] : []),
                ],
              }),
          ...(canSeeFinance ? {} : { type: { notIn: [...FINANCE_ACTIVITY_TYPES] } }),
        },
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

    const safeTargets = canSeeFinance
      ? targets
      : targets.map(({ targetRevenue: _tr, ...rest }) => ({ ...rest, targetRevenue: 0 }));

    const openTasksSorted = tasks
      .filter((t) => t.status !== 'done')
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

    const metaConfig = isAdmin ? await getMetaConfig().catch(() => ({ pixelId: '', accessToken: '' })) : null;

    return NextResponse.json(
      {
        ...report,
        targets: safeTargets,
        recentDailyLogs: dailyLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30),
        openTasks: openTasksSorted.slice(0, 150),
        recentActivities: activities.slice(0, 40),
        ...(metaConfig
          ? {
              metaConnection: {
                configured: Boolean(
                  metaConfig.accessToken ||
                    process.env.META_LEAD_ACCESS_TOKEN ||
                    process.env.META_ACCESS_TOKEN,
                ),
                pixelId: metaConfig.pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || null,
              },
            }
          : {}),
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
    const month = normalizeMonthParam(typeof body.month === 'string' ? body.month : null);

    if (body.action === 'seed_defaults') {
      const result = await seedDefaultMonthlyTargets(month);
      return NextResponse.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    const employeeId = typeof body.employeeId === 'string' && body.employeeId.trim() ? body.employeeId.trim() : null;
    let consultant = typeof body.consultant === 'string' ? body.consultant.trim() : '';

    if (!consultant && employeeId) {
      const emp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { name: true } });
      if (emp) consultant = emp.name;
    }
    if (!consultant) {
      return NextResponse.json({ error: 'Employee or consultant name is required.' }, { status: 400 });
    }

    const toInt = (val: unknown, def: number, min: number, max: number) => {
      const n = Number(val);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def;
    };

    const targetDailyActions = toInt(body.targetDailyActions, 12, 1, 200);
    const targetFollowups = toInt(body.targetFollowups, 10, 0, 200);
    const maxSlaHours = toInt(body.maxSlaHours, 24, 1, 168);
    const hasTargetLeads = body.targetLeads !== undefined && body.targetLeads !== null && body.targetLeads !== '';
    const targetLeads = toInt(body.targetLeads, 30, 0, 2000);
    const targetEnrolled = toInt(body.targetEnrolled, 5, 0, 500);

    const saved = await prisma.kpiTarget.upsert({
      where: { consultant_month: { consultant, month } },
      update: {
        employeeId,
        targetDailyActions,
        targetFollowups,
        maxSlaHours,
        ...(hasTargetLeads ? { targetLeads } : {}),
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

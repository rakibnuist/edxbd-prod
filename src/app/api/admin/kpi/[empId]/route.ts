import { NextRequest, NextResponse } from 'next/server';
import { FINANCE_ACTIVITY_TYPES, canAccessFinanceRole, isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { computeEmployeeKpiReport, normalizeMonthParam, shiftIsoDays } from '@/lib/kpi-workflow';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ empId: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }
    const { empId } = await params;

    if (!isAdminRole(actor.role)) {
      const ownEmp = staff?.employee;
      if (!ownEmp || (ownEmp.id !== empId && ownEmp.empId !== empId)) {
        return NextResponse.json({ message: 'Unauthorized - Cannot view another employee workflow' }, { status: 403 });
      }
    }
    const { searchParams } = new URL(request.url);
    const month = normalizeMonthParam(searchParams.get('month'));
    const [y, m] = month.split('-').map(Number);
    const start = `${month}-01`;
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const end = `${month}-${String(daysInMonth).padStart(2, '0')}`;
    const winStartDate = new Date(`${shiftIsoDays(start, -1)}T00:00:00.000Z`);
    const winEndDate = new Date(`${shiftIsoDays(end, 1)}T23:59:59.999Z`);

    const employee = await prisma.employee.findFirst({
      where: { OR: [{ id: empId }, { empId }] },
      select: {
        id: true, empId: true, name: true, role: true, email: true,
        phone: true, team: true, specialization: true, active: true, userId: true, joinDate: true,
      },
    });
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const [attendances, dailyLogs, targets, tasks, leads, activities] = await Promise.all([
      prisma.attendance.findMany({
        where: { employeeId: employee.id, date: { gte: start, lte: end } },
        orderBy: { date: 'desc' },
      }),
      prisma.dailyLog.findMany({
        where: { employeeId: employee.id, date: { gte: start, lte: end } },
        orderBy: { date: 'desc' },
      }),
      prisma.kpiTarget.findMany({ where: { month } }),
      prisma.taskDirective.findMany({
        where: {
          status: { not: 'cancelled' },
          OR: [{ employeeId: employee.id }, { employeeId: null, assignedTo: employee.name }],
        },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.lead.findMany({
        where: {
          OR: [
            { assignedEmployeeId: employee.id },
            { assignedEmployeeId: null, assignedTo: employee.name },
            {
              AND: [
                { isApplication: true },
                { assignedEmployeeId: null },
                { assignedTo: null },
                { referrer: { contains: employee.name } },
              ],
            },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          country: true,
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
          ...(canAccessFinanceRole(actor.role) ? {} : { type: { notIn: [...FINANCE_ACTIVITY_TYPES] } }),
          OR: [
            { employeeId: employee.id },
            { employeeId: null, actorName: employee.name },
            ...(employee.userId ? [{ employeeId: null, actorUserId: employee.userId }] : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const report = computeEmployeeKpiReport({
      month,
      employees: [employee],
      attendances,
      dailyLogs,
      targets,
      tasks,
      leads,
      activities,
    });

    return NextResponse.json(
      {
        kpi: report.employees[0] || null,
        month,
        today: report.today,
        employee,
        attendances,
        dailyLogs,
        tasks,
        leads: leads.slice(0, 60),
        activities: activities.slice(0, 60),
        slaBottlenecks: report.slaBottlenecks,
      },
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch {
    return NextResponse.json({ error: 'Failed to load employee workflow trace' }, { status: 500 });
  }
}

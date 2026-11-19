import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { computeEmployeeKpiReport, normalizeMonthParam, shiftIsoDays } from '@/lib/kpi-workflow';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ empId: string }> },
) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    const { empId } = await params;
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
          OR: [{ employeeId: employee.id }, { assignedTo: employee.name }],
        },
        orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
      }),
      prisma.lead.findMany({
        where: { OR: [{ assignedEmployeeId: employee.id }, { assignedTo: employee.name }] },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, name: true, phone: true, country: true, status: true, applicationStage: true, assignedTo: true, assignedEmployeeId: true, nextFollowup: true, gpa: true, assessAcademicResults: true, createdAt: true, updatedAt: true },
      }),
      prisma.activityEvent.findMany({
        where: {
          createdAt: { gte: winStartDate, lte: winEndDate },
          OR: [
            { employeeId: employee.id },
            { actorName: employee.name },
            ...(employee.userId ? [{ actorUserId: employee.userId }] : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 150,
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

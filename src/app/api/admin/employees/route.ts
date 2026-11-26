import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole, isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

function stripSalary<T extends { salary?: unknown }>(row: T): Omit<T, 'salary'> {
  const { salary: _salary, ...rest } = row;
  return rest;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const actor = admin || staff;
    if (!actor) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    if (!isAdminRole(actor.role)) {
      const employees = await prisma.employee.findMany({
        where: { active: true },
        orderBy: [{ empId: 'asc' }],
        select: { id: true, empId: true, name: true, role: true, team: true, active: true },
      });
      return NextResponse.json({ employees }, { headers: { 'Cache-Control': 'no-store, private' } });
    }

    const employees = await prisma.employee.findMany({
      orderBy: [{ active: 'desc' }, { empId: 'asc' }],
      include: {
        _count: {
          select: {
            leads: true,
            tasks: { where: { status: { notIn: ['done', 'cancelled'] } } },
          },
        },
      },
    });

    const canSeeFinance = canAccessFinanceRole(actor.role);
    const payload = canSeeFinance ? employees : employees.map(stripSalary);
    return NextResponse.json({ employees: payload }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Failed to load employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    if (!name) return NextResponse.json({ error: 'Employee name is required.' }, { status: 400 });

    let empId = typeof body.empId === 'string' ? body.empId.trim().toUpperCase().slice(0, 24) : '';
    if (!empId) {
      const existingIds = await prisma.employee.findMany({ select: { empId: true } });
      let maxNum = 0;
      for (const row of existingIds) {
        const m = /^E-(\d+)$/i.exec(row.empId.trim());
        if (m) maxNum = Math.max(maxNum, Number(m[1]));
      }
      empId = `E-${String(Math.max(maxNum, existingIds.length) + 1).padStart(2, '0')}`;
    }

    const existing = await prisma.employee.findUnique({ where: { empId } });
    if (existing) {
      return NextResponse.json({ error: `Employee ID ${empId} already exists.` }, { status: 409 });
    }

    const canSeeFinance = canAccessFinanceRole(decoded.role);
    const created = await prisma.employee.create({
      data: {
        empId,
        name,
        role: typeof body.role === 'string' && body.role.trim() ? body.role.trim().slice(0, 80) : 'Counselor',
        email: typeof body.email === 'string' && body.email.trim() ? body.email.trim().toLowerCase().slice(0, 200) : null,
        phone: typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim().slice(0, 40) : null,
        team: typeof body.team === 'string' && body.team.trim() ? body.team.trim().toLowerCase().slice(0, 40) : 'china',
        specialization: typeof body.specialization === 'string' ? body.specialization.trim().slice(0, 160) || null : null,
        salary:
          canSeeFinance && typeof body.salary === 'number' && Number.isFinite(body.salary) && body.salary >= 0
            ? body.salary
            : 0,
        active: typeof body.active === 'boolean' ? body.active : true,
        joinDate: typeof body.joinDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.joinDate) ? body.joinDate : null,
      },
    });

    return NextResponse.json(
      canSeeFinance ? created : stripSalary(created),
      { status: 201, headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) return NextResponse.json({ error: 'Employee id is required.' }, { status: 400 });

    const existing = await prisma.employee.findUnique({
      where: { id },
      select: { id: true, empId: true, userId: true },
    });
    if (!existing) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (typeof body.empId === 'string' && body.empId.trim()) {
      const nextEmpId = body.empId.trim().toUpperCase().slice(0, 24);
      if (nextEmpId !== existing.empId) {
        const conflict = await prisma.employee.findUnique({ where: { empId: nextEmpId }, select: { id: true } });
        if (conflict) {
          return NextResponse.json({ error: `Employee ID ${nextEmpId} already exists.` }, { status: 409 });
        }
        data.empId = nextEmpId;
      }
    }
    if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim().slice(0, 120);
    if (typeof body.role === 'string' && body.role.trim()) data.role = body.role.trim().slice(0, 80);
    if (typeof body.team === 'string' && body.team.trim()) data.team = body.team.trim().toLowerCase().slice(0, 40);
    if (typeof body.phone === 'string') data.phone = body.phone.trim().slice(0, 40) || null;
    if (typeof body.email === 'string') data.email = body.email.trim().toLowerCase().slice(0, 200) || null;
    if (typeof body.specialization === 'string') data.specialization = body.specialization.trim().slice(0, 160) || null;
    const canSeeFinance = canAccessFinanceRole(decoded.role);
    if (canSeeFinance && body.salary !== undefined && body.salary !== null) {
      const parsedSalary = Number(body.salary);
      if (Number.isFinite(parsedSalary) && parsedSalary >= 0 && parsedSalary <= 100000000) {
        data.salary = parsedSalary;
      }
    }
    if (typeof body.active === 'boolean') data.active = body.active;

    const updated = await prisma.employee.update({ where: { id }, data }).catch(() => null);
    if (!updated) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });

    if (typeof data.name === 'string' && existing.userId) {
      await prisma.user
        .update({ where: { id: existing.userId }, data: { name: data.name } })
        .catch(() => null);
    }

    if (typeof data.name === 'string' || typeof data.empId === 'string' || data.salary !== undefined) {
      const currentMonth = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 7);
      await prisma.payrollRecord.updateMany({
        where: {
          OR: [{ employeeId: id }, { empId: existing.empId }],
          month: currentMonth,
          status: 'pending',
        },
        data: {
          ...(typeof data.name === 'string' ? { name: data.name } : {}),
          ...(typeof data.empId === 'string' ? { empId: String(data.empId) } : {}),
          ...(data.salary !== undefined ? { baseSalary: Number(data.salary), netPay: Number(data.salary) } : {}),
        },
      }).catch(() => {});
    }

    return NextResponse.json(
      canSeeFinance ? updated : stripSalary(updated),
      { headers: { 'Cache-Control': 'no-store, private' } },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    let id = request.nextUrl.searchParams.get('id')?.trim() || '';
    if (!id) {
      const body = await readLimitedJson(request, 8 * 1024).catch(() => ({} as Record<string, unknown>));
      id = typeof body.id === 'string' ? body.id.trim() : '';
    }
    if (!id) {
      return NextResponse.json({ error: 'Employee id is required.' }, { status: 400 });
    }

    const existing = await prisma.employee.findUnique({
      where: { id },
      select: { id: true, empId: true, name: true, userId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }
    if (existing.userId && existing.userId === decoded.userId) {
      return NextResponse.json({ error: 'Cannot delete your own staff profile.' }, { status: 400 });
    }
    if (existing.userId && decoded.role !== 'super_admin') {
      const linkedUser = await prisma.user.findUnique({
        where: { id: existing.userId },
        select: { role: true },
      });
      if (linkedUser && isAdminRole(linkedUser.role)) {
        return NextResponse.json(
          { error: 'Only a super admin can remove another administrator staff profile.' },
          { status: 403 },
        );
      }
    }

    await prisma.payrollRecord.deleteMany({
      where: {
        OR: [{ employeeId: id }, { empId: existing.empId }],
        status: 'pending',
      },
    }).catch(() => {});
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ deleted: true, id: existing.id, empId: existing.empId }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}

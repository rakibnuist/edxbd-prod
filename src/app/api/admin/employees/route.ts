import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
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

    return NextResponse.json({ employees }, { headers: { 'Cache-Control': 'no-store, private' } });
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
      const count = await prisma.employee.count();
      empId = `E-${String(count + 1).padStart(2, '0')}`;
    }

    const existing = await prisma.employee.findUnique({ where: { empId } });
    if (existing) {
      return NextResponse.json({ error: `Employee ID ${empId} already exists.` }, { status: 409 });
    }

    const created = await prisma.employee.create({
      data: {
        empId,
        name,
        role: typeof body.role === 'string' && body.role.trim() ? body.role.trim().slice(0, 80) : 'Counselor',
        email: typeof body.email === 'string' && body.email.trim() ? body.email.trim().toLowerCase().slice(0, 200) : null,
        phone: typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim().slice(0, 40) : null,
        team: typeof body.team === 'string' && body.team.trim() ? body.team.trim().toLowerCase().slice(0, 40) : 'china',
        specialization: typeof body.specialization === 'string' ? body.specialization.trim().slice(0, 160) || null : null,
        active: typeof body.active === 'boolean' ? body.active : true,
        joinDate: typeof body.joinDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.joinDate) ? body.joinDate : null,
      },
    });

    return NextResponse.json(created, { status: 201, headers: { 'Cache-Control': 'no-store, private' } });
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

    const data: Record<string, unknown> = {};
    if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim().slice(0, 120);
    if (typeof body.role === 'string' && body.role.trim()) data.role = body.role.trim().slice(0, 80);
    if (typeof body.team === 'string' && body.team.trim()) data.team = body.team.trim().toLowerCase().slice(0, 40);
    if (typeof body.phone === 'string') data.phone = body.phone.trim().slice(0, 40) || null;
    if (typeof body.email === 'string') data.email = body.email.trim().toLowerCase().slice(0, 200) || null;
    if (typeof body.specialization === 'string') data.specialization = body.specialization.trim().slice(0, 160) || null;
    if (typeof body.active === 'boolean') data.active = body.active;

    const updated = await prisma.employee.update({ where: { id }, data }).catch(() => null);
    if (!updated) return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });

    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

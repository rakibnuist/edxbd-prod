import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser, verifyLiveStaffUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const ALLOWED_STATUSES = new Set(['open', 'in_progress', 'blocked', 'done', 'cancelled']);
const ALLOWED_PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);

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
    const status = searchParams.get('status');

    const tasks = await prisma.taskDirective.findMany({
      where: {
        ...(employeeId ? { employeeId } : {}),
        ...(status && ALLOWED_STATUSES.has(status) ? { status } : { status: { not: 'cancelled' } }),
      },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
      take: 150,
    });

    return NextResponse.json({ tasks }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : '';
    if (!title) return NextResponse.json({ error: 'Task title is required.' }, { status: 400 });

    const employeeId = typeof body.employeeId === 'string' && body.employeeId.trim() ? body.employeeId.trim() : null;
    let assignedTo = typeof body.assignedTo === 'string' ? body.assignedTo.trim().slice(0, 120) || null : null;
    if (employeeId && !assignedTo) {
      const emp = await prisma.employee.findUnique({ where: { id: employeeId }, select: { name: true } });
      if (emp) assignedTo = emp.name;
    }

    const priority = typeof body.priority === 'string' && ALLOWED_PRIORITIES.has(body.priority)
      ? body.priority
      : 'normal';

    const created = await prisma.taskDirective.create({
      data: {
        title,
        details: typeof body.details === 'string' ? body.details.trim().slice(0, 2000) || null : null,
        employeeId,
        assignedTo,
        assignedBy: decoded.email,
        dueDate: typeof body.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) ? body.dueDate : null,
        priority,
        status: 'open',
        category: typeof body.category === 'string' ? body.category.trim().slice(0, 60) || 'operations' : 'operations',
        leadId: typeof body.leadId === 'string' && body.leadId.trim() ? body.leadId.trim() : null,
      },
    });

    return NextResponse.json(created, { status: 201, headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    const staff = admin ? null : await verifyLiveStaffUser(request);
    const decoded = admin || staff;
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized - Staff access required' }, { status: 403 });
    }

    const isAdmin = isAdminRole(decoded.role);
    const body = await readLimitedJson(request, 16 * 1024);
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (!id) return NextResponse.json({ error: 'Task id is required.' }, { status: 400 });

    const before = await prisma.taskDirective.findUnique({ where: { id } });
    if (!before) return NextResponse.json({ error: 'Task not found.' }, { status: 404 });

    if (!isAdmin) {
      if (!staff?.employee || before.employeeId !== staff.employee.id) {
        return NextResponse.json({ error: 'Unauthorized - Task assigned to another team member.' }, { status: 403 });
      }
    }

    const data: Record<string, unknown> = {};
    if (typeof body.status === 'string' && ALLOWED_STATUSES.has(body.status)) {
      data.status = body.status;
      if (body.status === 'done' && before.status !== 'done') {
        data.completedAt = new Date();
      } else if (body.status !== 'done') {
        data.completedAt = null;
      }
    }
    if (isAdmin) {
      if (typeof body.priority === 'string' && ALLOWED_PRIORITIES.has(body.priority)) {
        data.priority = body.priority;
      }
      if (typeof body.title === 'string' && body.title.trim()) data.title = body.title.trim().slice(0, 200);
      if (typeof body.details === 'string') data.details = body.details.trim().slice(0, 2000) || null;
      if (typeof body.dueDate === 'string') {
        data.dueDate = /^\d{4}-\d{2}-\d{2}$/.test(body.dueDate) ? body.dueDate : null;
      }
    }

    const updated = await prisma.taskDirective.update({ where: { id }, data });

    if (data.status === 'done' && before.status !== 'done') {
      void logActivityEvent({
        type: 'task_completed',
        actorName: updated.assignedTo || decoded.email,
        actorUserId: decoded.userId,
        employeeId: updated.employeeId,
        leadId: updated.leadId,
        toValue: updated.title,
      });
    }

    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Task id is required.' }, { status: 400 });

    const deleted = await prisma.taskDirective.delete({ where: { id } }).catch(() => null);
    if (!deleted) return NextResponse.json({ error: 'Task not found.' }, { status: 404 });

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

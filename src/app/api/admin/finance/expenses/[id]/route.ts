import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { validateExpensePayload } from '@/lib/finance-logic';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const { id } = await params;
    const existing = await prisma.financeExpense.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Expense entry not found' }, { status: 404, headers: NO_STORE });
    }

    const body = await readLimitedJson(request, 24 * 1024);
    const parsed = validateExpensePayload(body);
    if (parsed.error || !parsed.data) {
      return NextResponse.json({ error: parsed.error || 'Invalid expense payload' }, { status: 400, headers: NO_STORE });
    }

    const data = { ...parsed.data };
    if (data.employeeId) {
      const emp = await prisma.employee.findUnique({ where: { id: data.employeeId }, select: { id: true } });
      if (!emp) data.employeeId = null;
    }
    if (data.leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: data.leadId }, select: { id: true } });
      if (!lead) data.leadId = null;
    }

    const updated = await prisma.financeExpense.update({
      where: { id },
      data,
      include: { employee: { select: { name: true } } },
    });

    return NextResponse.json(
      { ...updated, employeeName: updated.employee?.name ?? null },
      { headers: NO_STORE },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    console.error('Finance expenses PUT error:', err);
    return NextResponse.json({ error: 'Failed to update expense entry' }, { status: 500, headers: NO_STORE });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const { id } = await params;
    const deleted = await prisma.financeExpense.delete({ where: { id } }).catch(() => null);
    if (!deleted) {
      return NextResponse.json({ error: 'Expense entry not found' }, { status: 404, headers: NO_STORE });
    }

    return NextResponse.json({ ok: true, id }, { headers: NO_STORE });
  } catch (err) {
    console.error('Finance expenses DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete expense entry' }, { status: 500, headers: NO_STORE });
  }
}

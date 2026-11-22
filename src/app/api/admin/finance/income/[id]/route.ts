import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { validateIncomePayload } from '@/lib/finance-logic';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
    }

    const { id } = await params;
    const existing = await prisma.financeIncome.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Income entry not found' }, { status: 404, headers: NO_STORE });
    }

    const body = await readLimitedJson(request, 24 * 1024);
    const parsed = validateIncomePayload(body);
    if (parsed.error || !parsed.data) {
      return NextResponse.json({ error: parsed.error || 'Invalid income payload' }, { status: 400, headers: NO_STORE });
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

    const updated = await prisma.financeIncome.update({
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
    console.error('Finance income PUT error:', err);
    return NextResponse.json({ error: 'Failed to update income entry' }, { status: 500, headers: NO_STORE });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
    }

    const { id } = await params;
    const deleted = await prisma.financeIncome.delete({ where: { id } }).catch(() => null);
    if (!deleted) {
      return NextResponse.json({ error: 'Income entry not found' }, { status: 404, headers: NO_STORE });
    }

    return NextResponse.json({ ok: true, id }, { headers: NO_STORE });
  } catch (err) {
    console.error('Finance income DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete income entry' }, { status: 500, headers: NO_STORE });
  }
}

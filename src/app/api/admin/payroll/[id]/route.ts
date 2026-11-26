import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { dhakaCurrentDate, validatePayrollUpdatePayload } from '@/lib/finance-logic';
import { syncPayrollExpense } from '@/lib/finance-service';
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
    const current = await prisma.payrollRecord.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: 'Payroll record not found' }, { status: 404, headers: NO_STORE });
    }

    const body = await readLimitedJson(request, 16 * 1024);
    const parsed = validatePayrollUpdatePayload(body, current, dhakaCurrentDate());
    if (parsed.error || !parsed.data) {
      return NextResponse.json({ error: parsed.error || 'Invalid payroll update' }, { status: 400, headers: NO_STORE });
    }

    const updated = await prisma.payrollRecord.update({
      where: { id },
      data: parsed.data,
    });

    // If base salary changed and record is linked to an employee, keep employee base salary synced when requested
    if (body.syncEmployeeSalary === true && updated.employeeId) {
      await prisma.employee
        .update({ where: { id: updated.employeeId }, data: { salary: updated.baseSalary } })
        .catch(() => null);
    }

    await syncPayrollExpense(updated, admin);
    return NextResponse.json(updated, { headers: NO_STORE });
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    console.error('Payroll PUT error:', err);
    return NextResponse.json({ error: 'Failed to update payroll record' }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const { id } = await params;
    const current = await prisma.payrollRecord.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: 'Payroll record not found' }, { status: 404, headers: NO_STORE });
    }

    const paidOn = current.paidOn || dhakaCurrentDate();
    const updated = await prisma.payrollRecord.update({
      where: { id },
      data: {
        status: 'paid',
        paidOn,
      },
    });

    await syncPayrollExpense(updated, admin);
    return NextResponse.json(updated, { headers: NO_STORE });
  } catch (err) {
    console.error('Payroll mark-paid POST error:', err);
    return NextResponse.json({ error: 'Failed to mark payroll paid' }, { status: 500, headers: NO_STORE });
  }
}

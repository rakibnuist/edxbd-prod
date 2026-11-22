import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { logActivityEvent } from '@/lib/crm-operations';
import { isValidMonth, validateIncomePayload } from '@/lib/finance-logic';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
    }

    const { searchParams } = new URL(request.url);
    const rawMonth = (searchParams.get('month') || '').trim();
    const includeExcluded = searchParams.get('includeExcluded') === '1';
    const month = rawMonth && isValidMonth(rawMonth) ? rawMonth : null;

    const where = {
      ...(month ? { month } : {}),
      ...(includeExcluded ? {} : { excludeFromCash: false }),
    };

    const rows = await prisma.financeIncome.findMany({
      where,
      include: { employee: { select: { name: true } } },
      orderBy: [{ date: 'desc' }, { legacyCrmId: 'desc' }, { createdAt: 'desc' }],
    });

    const mapped = rows.map((r) => ({
      id: r.id,
      legacyCrmId: r.legacyCrmId,
      date: r.date,
      month: r.month,
      category: r.category,
      leadRef: r.leadRef,
      leadId: r.leadId,
      clientName: r.clientName,
      studentName: r.studentName,
      reference: r.reference,
      amount: r.amount,
      notes: r.notes,
      excludeFromCash: r.excludeFromCash,
      employeeId: r.employeeId,
      employeeName: r.employee?.name ?? null,
    }));

    const sum = mapped.reduce((s, r) => s + (r.amount || 0), 0);
    return NextResponse.json({ rows: mapped, total: mapped.length, sum }, { headers: NO_STORE });
  } catch (err) {
    console.error('Finance income GET error:', err);
    return NextResponse.json({ error: 'Failed to load income ledger' }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403, headers: NO_STORE });
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

    const created = await prisma.financeIncome.create({
      data,
      include: { employee: { select: { name: true } } },
    });

    await logActivityEvent({
      type: 'payment_recorded',
      actorName: admin.email,
      actorUserId: admin.userId,
      employeeId: created.employeeId,
      leadId: created.leadId,
      leadName: created.studentName || created.clientName,
      toValue: `৳${Math.round(created.amount).toLocaleString()}`,
      details: [created.category, created.clientName, created.reference].filter(Boolean).join(' · ') || null,
    });

    return NextResponse.json(
      {
        ...created,
        employeeName: created.employee?.name ?? null,
      },
      { status: 201, headers: NO_STORE },
    );
  } catch (err) {
    const bodyError = jsonBodyErrorResponse(err);
    if (bodyError) return bodyError;
    console.error('Finance income POST error:', err);
    return NextResponse.json({ error: 'Failed to create income entry' }, { status: 500, headers: NO_STORE });
  }
}

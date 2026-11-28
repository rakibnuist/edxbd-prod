import { NextRequest, NextResponse } from 'next/server';
import { canAccessFinanceRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import {
  dhakaCurrentMonth,
  isValidMonth,
  shiftMonth,
} from '@/lib/finance-logic';
import {
  getDynamicFinanceCategories,
  getFinanceCashInitial,
  getFinanceStudentsPickerList,
  getMonthlyCashflowData,
  getPnlSeriesData,
} from '@/lib/finance-service';
import prisma from '@/lib/prisma';

const NO_STORE = { 'Cache-Control': 'no-store, private' };

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyLiveAdminUser(request);
    if (!admin || !canAccessFinanceRole(admin.role)) {
      return NextResponse.json({ message: 'Unauthorized - Financial access required' }, { status: 403, headers: NO_STORE });
    }

    const { searchParams } = new URL(request.url);
    const rawMonth = (searchParams.get('month') || '').trim();
    const includeExcluded = searchParams.get('includeExcluded') === '1';
    const isAllTime = rawMonth === '' || rawMonth === 'all';
    const filterMonth = !isAllTime && isValidMonth(rawMonth) ? rawMonth : null;
    const activeCashflowMonth = filterMonth || dhakaCurrentMonth();

    const incomeWhere = {
      ...(filterMonth ? { month: filterMonth } : {}),
      ...(includeExcluded ? {} : { excludeFromCash: false }),
    };
    const expenseWhere = filterMonth ? { month: filterMonth } : {};

    const [
      incomeRows,
      expenseRows,
      pnl,
      cashflow,
      cashInitial,
      categories,
      employees,
      students,
      allTimeCashIn,
      allTimeOut,
      investorAgg,
      pendingPayrollAgg,
    ] = await Promise.all([
      prisma.financeIncome.findMany({
        where: incomeWhere,
        include: { employee: { select: { name: true } } },
        orderBy: [{ date: 'desc' }, { legacyCrmId: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.financeExpense.findMany({
        where: expenseWhere,
        include: { employee: { select: { name: true } } },
        orderBy: [{ date: 'desc' }, { legacyCrmId: 'desc' }, { createdAt: 'desc' }],
      }),
      getPnlSeriesData(),
      getMonthlyCashflowData(activeCashflowMonth),
      getFinanceCashInitial(),
      getDynamicFinanceCategories(),
      prisma.employee.findMany({
        where: { active: true },
        orderBy: [{ empId: 'asc' }, { name: 'asc' }],
        select: { id: true, empId: true, name: true, role: true, salary: true, active: true },
      }),
      getFinanceStudentsPickerList(),
      prisma.financeIncome.aggregate({
        where: { excludeFromCash: false },
        _sum: { amount: true },
      }),
      prisma.financeExpense.aggregate({
        _sum: { amount: true },
      }),
      prisma.financeIncome.aggregate({
        where: { category: 'Investment' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.payrollRecord.aggregate({
        where: { status: 'pending', netPay: { gt: 0 }, month: { lte: dhakaCurrentMonth() } },
        _sum: { netPay: true },
        _count: { id: true },
      }),
    ]);

    const mappedIncome = incomeRows.map((r) => ({
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

    const mappedExpenses = expenseRows.map((r) => ({
      id: r.id,
      legacyCrmId: r.legacyCrmId,
      date: r.date,
      month: r.month,
      category: r.category,
      paidTo: r.paidTo,
      leadRef: r.leadRef,
      leadId: r.leadId,
      studentName: r.studentName,
      reference: r.reference,
      amount: r.amount,
      notes: r.notes,
      employeeId: r.employeeId,
      employeeName: r.employee?.name ?? null,
    }));

    const incomeSum = mappedIncome
      .filter((r) => !r.excludeFromCash)
      .reduce((s, r) => s + (r.amount || 0), 0);
    const expenseSum = mappedExpenses.reduce((s, r) => s + (r.amount || 0), 0);
    const liveBalance = cashInitial + (allTimeCashIn._sum.amount || 0) - (allTimeOut._sum.amount || 0);

    const prevMonthKey = shiftMonth(activeCashflowMonth, -1);
    const prevRow = pnl.find((r) => r.month === prevMonthKey);
    const curRow = pnl.find((r) => r.month === activeCashflowMonth);
    const latestEntryDate = [mappedIncome[0]?.date, mappedExpenses[0]?.date]
      .filter((d): d is string => Boolean(d))
      .sort()
      .pop() || null;

    return NextResponse.json(
      {
        month: filterMonth || '',
        activeCashflowMonth,
        cashInitial,
        liveBalance,
        allTimeCashIncome: allTimeCashIn._sum.amount || 0,
        allTimeExpenses: allTimeOut._sum.amount || 0,
        investorTotal: investorAgg._sum.amount || 0,
        investorCount: investorAgg._count.id,
        payrollPendingCount: pendingPayrollAgg._count.id,
        payrollPendingAmount: pendingPayrollAgg._sum.netPay || 0,
        latestEntryDate,
        cashflowClosing: cashflow.totals.closing,
        income: { rows: mappedIncome, total: mappedIncome.length, sum: incomeSum },
        expenses: { rows: mappedExpenses, total: mappedExpenses.length, sum: expenseSum },
        pnl,
        prevMonthDelta: {
          income: prevRow ? (curRow?.income || 0) - prevRow.income : 0,
          expenses: prevRow ? (curRow?.expense || 0) - prevRow.expense : 0,
          profit: prevRow ? (curRow?.profit || 0) - prevRow.profit : 0,
        },
        categories,
        employees,
        students,
      },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('Finance summary GET error:', err);
    return NextResponse.json({ error: 'Failed to load financial overview' }, { status: 500, headers: NO_STORE });
  }
}

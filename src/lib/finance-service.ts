import 'server-only';
import prisma from '@/lib/prisma';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  FINANCE_CASH_INITIAL_KEY,
  buildCategoryBreakdown,
  buildReferenceBreakdown,
  computeInvestorsFromRows,
  computePnlFromRows,
  computeRunningLedger,
  computeYearSeriesFromRows,
  dhakaCurrentDate,
  dhakaCurrentMonth,
  isValidMonth,
  workingDaysInMonth,
  type FinanceDashboardSnapshot,
  type FinanceExpenseDto,
  type FinanceIncomeDto,
  type PayrollRecordDto,
} from '@/lib/finance-logic';
import { logActivityEvent } from '@/lib/crm-operations';

function mapIncomeRow(row: {
  id: string;
  legacyCrmId: number | null;
  date: string;
  month: string;
  category: string | null;
  leadRef: string | null;
  leadId: string | null;
  clientName: string | null;
  studentName: string | null;
  reference: string | null;
  amount: number;
  notes: string | null;
  excludeFromCash: boolean;
  employeeId: string | null;
  employee?: { name: string } | null;
}): FinanceIncomeDto {
  return {
    id: row.id,
    legacyCrmId: row.legacyCrmId,
    date: row.date,
    month: row.month,
    category: row.category,
    leadRef: row.leadRef,
    leadId: row.leadId,
    clientName: row.clientName,
    studentName: row.studentName,
    reference: row.reference,
    amount: row.amount,
    notes: row.notes,
    excludeFromCash: row.excludeFromCash,
    employeeId: row.employeeId,
    employeeName: row.employee?.name ?? null,
  };
}

function mapExpenseRow(row: {
  id: string;
  legacyCrmId: number | null;
  date: string;
  month: string;
  category: string | null;
  paidTo: string | null;
  leadRef: string | null;
  leadId: string | null;
  studentName: string | null;
  reference: string | null;
  amount: number;
  notes: string | null;
  employeeId: string | null;
  employee?: { name: string } | null;
}): FinanceExpenseDto {
  return {
    id: row.id,
    legacyCrmId: row.legacyCrmId,
    date: row.date,
    month: row.month,
    category: row.category,
    paidTo: row.paidTo,
    leadRef: row.leadRef,
    leadId: row.leadId,
    studentName: row.studentName,
    reference: row.reference,
    amount: row.amount,
    notes: row.notes,
    employeeId: row.employeeId,
    employeeName: row.employee?.name ?? null,
  };
}

export async function getFinanceCashInitial(): Promise<number> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: FINANCE_CASH_INITIAL_KEY } });
    const n = Number(row?.value ?? 0);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function setFinanceCashInitial(amount: number): Promise<number> {
  await prisma.setting.upsert({
    where: { key: FINANCE_CASH_INITIAL_KEY },
    update: { value: String(amount) },
    create: { key: FINANCE_CASH_INITIAL_KEY, value: String(amount) },
  });
  return amount;
}

export async function getDynamicFinanceCategories(): Promise<{ income: string[]; expense: string[] }> {
  const [incCats, expCats] = await Promise.all([
    prisma.financeIncome.findMany({ distinct: ['category'], select: { category: true } }),
    prisma.financeExpense.findMany({ distinct: ['category'], select: { category: true } }),
  ]);

  const incomeSet = new Set<string>(DEFAULT_INCOME_CATEGORIES);
  for (const r of incCats) {
    const c = r.category?.trim();
    if (c) incomeSet.add(c);
  }
  const expenseSet = new Set<string>(DEFAULT_EXPENSE_CATEGORIES);
  for (const r of expCats) {
    const c = r.category?.trim();
    if (c) expenseSet.add(c);
  }

  return {
    income: Array.from(incomeSet),
    expense: Array.from(expenseSet),
  };
}

export async function computeOpeningBalance(month?: string | null): Promise<number> {
  const initial = await getFinanceCashInitial();
  if (!month || !isValidMonth(month)) return initial;

  const [priorIn, priorOut] = await Promise.all([
    prisma.financeIncome.aggregate({
      where: { month: { lt: month }, excludeFromCash: false },
      _sum: { amount: true },
    }),
    prisma.financeExpense.aggregate({
      where: { month: { lt: month } },
      _sum: { amount: true },
    }),
  ]);

  return initial + (priorIn._sum.amount || 0) - (priorOut._sum.amount || 0);
}

export async function getMonthlyCashflowData(monthInput?: string | null) {
  const month = monthInput && isValidMonth(monthInput) ? monthInput : dhakaCurrentMonth();

  const [opening, incRows, expRows] = await Promise.all([
    computeOpeningBalance(month),
    prisma.financeIncome.findMany({
      where: { month, excludeFromCash: false },
      include: { employee: { select: { name: true } } },
      orderBy: [{ date: 'asc' }, { legacyCrmId: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.financeExpense.findMany({
      where: { month },
      include: { employee: { select: { name: true } } },
      orderBy: [{ date: 'asc' }, { legacyCrmId: 'asc' }, { createdAt: 'asc' }],
    }),
  ]);

  const mappedIn = incRows.map(mapIncomeRow);
  const mappedOut = expRows.map(mapExpenseRow);
  const ledger = computeRunningLedger(opening, mappedIn, mappedOut);

  return {
    month,
    opening,
    income: ledger.income,
    expense: ledger.expense,
    totals: ledger.totals,
    byCategory: {
      income: buildCategoryBreakdown(mappedIn),
      expense: buildCategoryBreakdown(mappedOut),
    },
    incomeByReference: buildReferenceBreakdown(mappedIn),
  };
}

export async function getPnlSeriesData() {
  const [incomes, expenses] = await Promise.all([
    prisma.financeIncome.findMany({
      where: { excludeFromCash: false },
      select: { month: true, amount: true, excludeFromCash: true },
    }),
    prisma.financeExpense.findMany({
      select: { month: true, amount: true },
    }),
  ]);
  return computePnlFromRows(incomes, expenses);
}

export async function getYearCashflowData(yearInput?: number | string | null) {
  const parsedYear = Number(yearInput);
  const fallbackYear = Number(dhakaCurrentMonth().slice(0, 4));
  const year = Number.isInteger(parsedYear) && parsedYear >= 2020 && parsedYear <= 2040 ? parsedYear : fallbackYear;

  const [cashInitial, incomes, expenses] = await Promise.all([
    getFinanceCashInitial(),
    prisma.financeIncome.findMany({
      where: { excludeFromCash: false },
      select: { month: true, amount: true, excludeFromCash: true },
    }),
    prisma.financeExpense.findMany({
      select: { month: true, amount: true },
    }),
  ]);

  return computeYearSeriesFromRows(year, cashInitial, incomes, expenses);
}

export async function getInvestorsData() {
  const rows = await prisma.financeIncome.findMany({
    where: { category: 'Investment' },
    include: { employee: { select: { name: true } } },
    orderBy: [{ date: 'asc' }, { legacyCrmId: 'asc' }],
  });
  return computeInvestorsFromRows(rows.map(mapIncomeRow));
}

export async function getStudentFinancialHistory(rawQuery: string) {
  const q = rawQuery.trim();
  if (!q) {
    return {
      student: null,
      transactions: [],
      totals: { income: 0, expense: 0, net: 0, count: 0 },
    };
  }

  const qLower = q.toLowerCase();
  const [allIncome, allExpenses, matchingLead] = await Promise.all([
    prisma.financeIncome.findMany({
      include: { employee: { select: { name: true } } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.financeExpense.findMany({
      include: { employee: { select: { name: true } } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.lead.findFirst({
      where: {
        OR: [
          { name: { contains: q } },
          { phone: { contains: q } },
          { email: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        country: true,
        university: true,
        program: true,
        status: true,
        applicationStage: true,
      },
    }),
  ]);

  const matchesText = (...vals: Array<string | null | undefined>) =>
    vals.some((v) => v && v.toLowerCase().includes(qLower));

  const incomeMatches = allIncome
    .filter((r) => matchesText(r.studentName, r.clientName, r.leadRef, r.reference, r.notes) || (matchingLead && r.leadId === matchingLead.id))
    .map((r) => ({ ...mapIncomeRow(r), kind: 'income' as const }));

  const expenseMatches = allExpenses
    .filter((r) => matchesText(r.studentName, r.paidTo, r.leadRef, r.reference, r.notes) || (matchingLead && r.leadId === matchingLead.id))
    .map((r) => ({ ...mapExpenseRow(r), kind: 'expense' as const }));

  const transactions = [...incomeMatches, ...expenseMatches].sort((a, b) =>
    (b.date || '').localeCompare(a.date || ''),
  );

  const totalIn = incomeMatches.reduce((s, r) => s + (r.amount || 0), 0);
  const totalOut = expenseMatches.reduce((s, r) => s + (r.amount || 0), 0);

  return {
    student: matchingLead,
    transactions,
    totals: {
      income: totalIn,
      expense: totalOut,
      net: totalIn - totalOut,
      count: transactions.length,
    },
  };
}

export async function getFinanceStudentsPickerList() {
  const [leads, distinctIn, distinctOut] = await Promise.all([
    prisma.lead.findMany({
      where: {
        NOT: [{ name: '' }, { name: 'Messenger User' }, { name: 'no name' }],
      },
      orderBy: [{ updatedAt: 'desc' }],
      take: 400,
      select: {
        id: true,
        name: true,
        phone: true,
        country: true,
        university: true,
        status: true,
        applicationStage: true,
      },
    }),
    prisma.financeIncome.findMany({
      where: { OR: [{ studentName: { not: null } }, { leadRef: { not: null } }] },
      select: { studentName: true, clientName: true, leadRef: true, leadId: true },
      distinct: ['studentName', 'leadRef'],
    }),
    prisma.financeExpense.findMany({
      where: { OR: [{ studentName: { not: null } }, { leadRef: { not: null } }] },
      select: { studentName: true, leadRef: true, leadId: true },
      distinct: ['studentName', 'leadRef'],
    }),
  ]);

  // Attach known legacy leadRef to matching lead if available
  const refByLeadId = new Map<string, string>();
  const refByNameLower = new Map<string, string>();
  for (const r of [...distinctIn, ...distinctOut]) {
    if (r.leadId && r.leadRef && !refByLeadId.has(r.leadId)) {
      refByLeadId.set(r.leadId, r.leadRef);
    }
    const nameKey = (r.studentName || '').trim().toLowerCase();
    if (nameKey && r.leadRef && !refByNameLower.has(nameKey)) {
      refByNameLower.set(nameKey, r.leadRef);
    }
  }

  return leads.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    country: l.country,
    university: l.university,
    status: l.status,
    applicationStage: l.applicationStage,
    leadRef: refByLeadId.get(l.id) || refByNameLower.get(l.name.trim().toLowerCase()) || null,
  }));
}

export async function getFinanceDashboardSnapshot(monthInput?: string): Promise<FinanceDashboardSnapshot> {
  const currentMonth = monthInput && isValidMonth(monthInput) ? monthInput : dhakaCurrentMonth();

  const [
    cashInitial,
    allCashIn,
    allExp,
    monthCashIn,
    monthExp,
    investorSum,
    latestIn,
    latestExp,
    pendingPayroll,
  ] = await Promise.all([
    getFinanceCashInitial(),
    prisma.financeIncome.aggregate({
      where: { excludeFromCash: false },
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.financeExpense.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.financeIncome.aggregate({
      where: { month: currentMonth, excludeFromCash: false },
      _sum: { amount: true },
    }),
    prisma.financeExpense.aggregate({
      where: { month: currentMonth },
      _sum: { amount: true },
    }),
    prisma.financeIncome.aggregate({
      where: { category: 'Investment' },
      _sum: { amount: true },
    }),
    prisma.financeIncome.findFirst({ orderBy: { date: 'desc' }, select: { date: true } }),
    prisma.financeExpense.findFirst({ orderBy: { date: 'desc' }, select: { date: true } }),
    prisma.payrollRecord.aggregate({
      where: { status: 'pending', netPay: { gt: 0 } },
      _sum: { netPay: true },
      _count: { id: true },
    }),
  ]);

  const allTimeIncome = allCashIn._sum.amount || 0;
  const allTimeExpenses = allExp._sum.amount || 0;
  const monthIncome = monthCashIn._sum.amount || 0;
  const monthExpenses = monthExp._sum.amount || 0;

  const latestDates = [latestIn?.date, latestExp?.date].filter((d): d is string => Boolean(d)).sort();

  return {
    currentMonth,
    allTimeIncome,
    allTimeExpenses,
    allTimeNetProfit: allTimeIncome - allTimeExpenses,
    cashPosition: cashInitial + allTimeIncome - allTimeExpenses,
    monthIncome,
    monthExpenses,
    monthNetProfit: monthIncome - monthExpenses,
    totalInvestorCapital: investorSum._sum.amount || 0,
    incomeEntryCount: allCashIn._count.id,
    expenseEntryCount: allExp._count.id,
    payrollPendingCount: pendingPayroll._count.id,
    payrollPendingAmount: pendingPayroll._sum.netPay || 0,
    latestEntryDate: latestDates.length > 0 ? latestDates[latestDates.length - 1] : null,
  };
}

export async function syncPayrollExpense(
  record: {
    id: string;
    month: string;
    name: string;
    employeeId: string | null;
    netPay: number;
    paidOn: string | null;
    status: string;
    notes: string | null;
  },
  actor?: { email: string; userId: string },
) {
  const reference = `Salary - ${record.month}`;
  if (record.status !== 'paid') {
    await prisma.financeExpense.deleteMany({
      where: { category: 'Salary', paidTo: record.name, reference },
    });
    return;
  }

  const date = record.paidOn || dhakaCurrentDate();
  const expenseMonth = date.slice(0, 7);
  const existing = await prisma.financeExpense.findFirst({
    where: { category: 'Salary', paidTo: record.name, reference },
    select: { id: true },
  });

  if (existing) {
    await prisma.financeExpense.update({
      where: { id: existing.id },
      data: {
        date,
        month: expenseMonth,
        amount: record.netPay || 0,
        notes: record.notes || `Salary payment for ${record.month}`,
        employeeId: record.employeeId,
      },
    });
  } else {
    await prisma.financeExpense.create({
      data: {
        date,
        month: expenseMonth,
        category: 'Salary',
        paidTo: record.name,
        reference,
        amount: record.netPay || 0,
        notes: record.notes || `Salary payment for ${record.month}`,
        employeeId: record.employeeId,
      },
    });
  }

  await logActivityEvent({
    type: 'expense_recorded',
    actorName: actor?.email || 'Payroll System',
    actorUserId: actor?.userId || null,
    employeeId: record.employeeId,
    toValue: `${record.name} · ৳${Math.round(record.netPay || 0).toLocaleString()}`,
    details: `Auto-synced salary expense for ${record.month}`,
  });
}

export async function getOrGenerateMonthlyPayroll(monthInput?: string | null) {
  const month = monthInput && isValidMonth(monthInput) ? monthInput : dhakaCurrentMonth();
  const workingDays = workingDaysInMonth(month);

  const activeEmployees = await prisma.employee.findMany({
    where: { active: true },
    orderBy: [{ empId: 'asc' }, { name: 'asc' }],
    select: { id: true, empId: true, name: true, role: true, salary: true },
  });

  // Sync attendance days for the month
  const monthAttendances = await prisma.attendance.findMany({
    where: {
      date: { startsWith: `${month}-` },
      status: { in: ['Present', 'Late'] },
    },
    select: { empId: true },
  });
  const presentCountByEmpId = new Map<string, number>();
  for (const a of monthAttendances) {
    presentCountByEmpId.set(a.empId, (presentCountByEmpId.get(a.empId) || 0) + 1);
  }

  const activeEmpIds = new Set(activeEmployees.map((e) => e.id));
  const activeEmpCodes = new Set(activeEmployees.map((e) => e.empId));

  // Fetch all existing records for this month
  const existingRecords = await prisma.payrollRecord.findMany({
    where: { month },
  });

  for (const emp of activeEmployees) {
    const daysWorked = presentCountByEmpId.get(emp.empId) || 0;

    // Find all records that match this employee: by employeeId first, then by empId, then by name
    const matches = existingRecords.filter(
      (r) =>
        r.employeeId === emp.id ||
        r.empId === emp.empId ||
        r.name.trim().toLowerCase() === emp.name.trim().toLowerCase(),
    );

    if (matches.length === 0) {
      await prisma.payrollRecord.create({
        data: {
          month,
          empId: emp.empId,
          employeeId: emp.id,
          name: emp.name,
          baseSalary: emp.salary || 0,
          daysWorked,
          workingDays,
          bonus: 0,
          deductions: 0,
          netPay: emp.salary || 0,
          status: 'pending',
        },
      });
    } else {
      // Sort matches: paid records first, then newest
      matches.sort((a, b) => {
        if (a.status === 'paid' && b.status !== 'paid') return -1;
        if (b.status === 'paid' && a.status !== 'paid') return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      const primary = matches[0];
      const duplicates = matches.slice(1);

      // Clean up duplicate pending records for this employee
      for (const dup of duplicates) {
        if (dup.status !== 'paid') {
          await prisma.payrollRecord.delete({ where: { id: dup.id } }).catch(() => {});
        }
      }

      const updateData: Record<string, unknown> = {
        daysWorked,
        workingDays,
        employeeId: emp.id,
        empId: emp.empId,
        name: emp.name,
      };

      if (primary.status === 'pending' && primary.baseSalary === 0 && (emp.salary || 0) > 0) {
        updateData.baseSalary = emp.salary;
        updateData.netPay = (emp.salary || 0) + primary.bonus - primary.deductions;
      }

      await prisma.payrollRecord.update({
        where: { id: primary.id },
        data: updateData,
      }).catch(() => {});
    }
  }

  // Remove stale pending records whose employee is no longer active or was deleted
  await prisma.payrollRecord.deleteMany({
    where: {
      month,
      status: 'pending',
      AND: [
        { employeeId: { notIn: Array.from(activeEmpIds) } },
        { empId: { notIn: Array.from(activeEmpCodes) } },
      ],
    },
  }).catch(() => {});

  const allMonthRows = await prisma.payrollRecord.findMany({
    where: {
      month,
      OR: [
        { employeeId: { in: Array.from(activeEmpIds) } },
        { empId: { in: Array.from(activeEmpCodes) } },
        { status: 'paid' },
      ],
    },
    orderBy: [{ empId: 'asc' }, { name: 'asc' }],
  });

  const rows: PayrollRecordDto[] = allMonthRows.map((r) => ({
    id: r.id,
    month: r.month,
    empId: r.empId,
    employeeId: r.employeeId,
    name: r.name,
    baseSalary: r.baseSalary,
    daysWorked: r.daysWorked,
    workingDays: r.workingDays,
    bonus: r.bonus,
    deductions: r.deductions,
    netPay: r.netPay,
    paidOn: r.paidOn,
    status: r.status,
    notes: r.notes,
  }));

  const totals = rows.reduce(
    (acc, r) => ({
      base: acc.base + (r.baseSalary || 0),
      bonus: acc.bonus + (r.bonus || 0),
      deductions: acc.deductions + (r.deductions || 0),
      net: acc.net + (r.netPay || 0),
      paid: acc.paid + (r.status === 'paid' ? r.netPay || 0 : 0),
      pending: acc.pending + (r.status !== 'paid' ? r.netPay || 0 : 0),
    }),
    { base: 0, bonus: 0, deductions: 0, net: 0, paid: 0, pending: 0 },
  );

  return { month, workingDays, rows, totals };
}

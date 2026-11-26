import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const {
  computeInvestorsFromRows,
  computePnlFromRows,
  computeRunningLedger,
  computeYearSeriesFromRows,
  formatBdt,
  shiftMonth,
  validateExpensePayload,
  validateIncomePayload,
  validatePayrollUpdatePayload,
  workingDaysInMonth,
} = await import('../src/lib/finance-logic.ts');

test('Finance formatting and month helpers behave consistently', () => {
  assert.equal(formatBdt(632727), '৳632,727');
  assert.equal(formatBdt(-15000), '-৳15,000');
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(workingDaysInMonth('2026-10'), 21);
});

test('Income, expense, and payroll validators enforce dates, bounds, and defaults', () => {
  const okInc = validateIncomePayload({
    date: '2026-10-28',
    amount: 170000,
    category: 'Service Charge',
    clientName: 'Fahmida Khan',
    leadRef: 'L-00075',
  });
  assert.equal(okInc.error, undefined);
  assert.equal(okInc.data?.month, '2026-10');
  assert.equal(okInc.data?.amount, 170000);
  assert.equal(okInc.data?.excludeFromCash, false);

  assert.ok(validateIncomePayload({ date: 'invalid', amount: 100 }).error);
  assert.ok(validateIncomePayload({ date: '2026-10-28', amount: -50 }).error);

  const okExp = validateExpensePayload({
    date: '2026-11-19',
    amount: 3930,
    category: 'Airport Pickup',
    paidTo: 'Airport Pickup - Tanjila',
    studentName: 'Tanjila Akter',
    leadRef: 'L-00079',
  });
  assert.equal(okExp.error, undefined);
  assert.equal(okExp.data?.month, '2026-11');

  const okPay = validatePayrollUpdatePayload(
    { bonus: 2000, deductions: 500, status: 'paid' },
    { baseSalary: 14000, bonus: 0, deductions: 0, status: 'pending', paidOn: null, notes: null },
    '2026-11-22',
  );
  assert.equal(okPay.error, undefined);
  assert.equal(okPay.data?.netPay, 15500);
  assert.equal(okPay.data?.paidOn, '2026-11-22');
});

test('P&L, running cashflow ledger, year view, and investors exclude pre-data capital from cash correctly', () => {
  const incomes = [
    {
      id: 'i1', legacyCrmId: 16, date: '2024-09-01', month: '2024-09', category: 'Investment',
      leadRef: null, leadId: null, clientName: 'Abdullah Al Rakib', studentName: null,
      reference: 'Cap 2024', amount: 281800, notes: null, excludeFromCash: true, employeeId: null,
    },
    {
      id: 'i2', legacyCrmId: 20, date: '2026-03-10', month: '2026-03', category: 'Service Charge',
      leadRef: 'L-1', leadId: null, clientName: 'Student A', studentName: 'Student A',
      reference: 'Mukta', amount: 200000, notes: null, excludeFromCash: false, employeeId: null,
    },
    {
      id: 'i3', legacyCrmId: 25, date: '2026-04-05', month: '2026-04', category: 'Investment',
      leadRef: null, leadId: null, clientName: 'Sakib Al Jubaer', studentName: null,
      reference: 'Bank', amount: 100000, notes: null, excludeFromCash: false, employeeId: null,
    },
  ];

  const expenses = [
    {
      id: 'e1', legacyCrmId: 1, date: '2026-03-15', month: '2026-03', category: 'Office Rent',
      paidTo: 'Landlord', leadRef: null, leadId: null, studentName: null,
      reference: null, amount: 50000, notes: null, employeeId: null,
    },
    {
      id: 'e2', legacyCrmId: 2, date: '2026-04-10', month: '2026-04', category: 'Salary',
      paidTo: 'Staff', leadRef: null, leadId: null, studentName: null,
      reference: 'Salary - 2026-04', amount: 30000, notes: null, employeeId: null,
    },
  ];

  // P&L excludes excludeFromCash rows
  const pnl = computePnlFromRows(incomes, expenses);
  assert.equal(pnl.length, 2);
  assert.equal(pnl[0].month, '2026-03');
  assert.equal(pnl[0].profit, 150000);
  assert.equal(pnl[1].month, '2026-04');
  assert.equal(pnl[1].profit, 70000);
  assert.equal(pnl[1].cumulative, 220000);

  // Running cashflow ledger for 2026-04 starts with opening 150,000
  const cashflow = computeRunningLedger(150000, [incomes[2]], [expenses[1]]);
  assert.equal(cashflow.income[0].running, 250000);
  assert.equal(cashflow.expense[0].running, 220000);
  assert.equal(cashflow.totals.closing, 220000);

  // Year view rolls balances cleanly
  const year2026 = computeYearSeriesFromRows(2026, 0, incomes, expenses);
  assert.equal(year2026.opening, 0);
  assert.equal(year2026.closing, 220000);
  assert.equal(year2026.rows[2].closing, 150000); // March
  assert.equal(year2026.rows[3].closing, 220000); // April

  // Investors includes BOTH pre-data and cash investments
  const inv = computeInvestorsFromRows(incomes);
  assert.equal(inv.total, 381800);
  assert.equal(inv.byPerson.length, 2);
  assert.equal(inv.byPerson[0].name, 'Abdullah Al Rakib');
  assert.equal(inv.byPerson[0].pctShare, 45);
});

test('Finance & Payroll API routes strictly require verifyLiveAdminUser + canAccessFinanceRole and exclude counselors & operations_admin', async () => {
  const {
    canAccessFinanceRole,
    isAdminRole,
    isStaffRole,
    generateToken,
    verifyToken,
  } = await import('../src/lib/auth.ts');

  const prevSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = '0123456789abcdef0123456789abcdef';
  try {
    assert.equal(isAdminRole('super_admin'), true);
    assert.equal(isAdminRole('admin'), true);
    assert.equal(isAdminRole('operations_admin'), true);
    assert.equal(isAdminRole('counselor'), false);
    assert.equal(isStaffRole('operations_admin'), true);

    assert.equal(canAccessFinanceRole('super_admin'), true);
    assert.equal(canAccessFinanceRole('admin'), true);
    assert.equal(canAccessFinanceRole('operations_admin'), false);
    assert.equal(canAccessFinanceRole('counselor'), false);
    assert.equal(canAccessFinanceRole('user'), false);

    const opsToken = generateToken({
      userId: 'ops-1',
      email: 'mhtamal04@gmail.com',
      role: 'operations_admin',
    });
    const decodedOps = verifyToken(opsToken);
    assert.equal(decodedOps?.role, 'operations_admin');
    assert.equal(canAccessFinanceRole(decodedOps?.role), false);
  } finally {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  }

  const routes = [
    'src/app/api/admin/finance/summary/route.ts',
    'src/app/api/admin/finance/income/route.ts',
    'src/app/api/admin/finance/income/[id]/route.ts',
    'src/app/api/admin/finance/expenses/route.ts',
    'src/app/api/admin/finance/expenses/[id]/route.ts',
    'src/app/api/admin/finance/cashflow/route.ts',
    'src/app/api/admin/finance/year/route.ts',
    'src/app/api/admin/finance/investors/route.ts',
    'src/app/api/admin/finance/student-transactions/route.ts',
    'src/app/api/admin/payroll/route.ts',
    'src/app/api/admin/payroll/[id]/route.ts',
  ];

  for (const r of routes) {
    const src = fs.readFileSync(r, 'utf8');
    assert.match(src, /verifyLiveAdminUser/, `${r} must enforce verifyLiveAdminUser`);
    assert.match(src, /canAccessFinanceRole/, `${r} must enforce canAccessFinanceRole`);
    assert.doesNotMatch(src, /verifyLiveStaffUser/, `${r} must not allow non-admin counselors`);
  }

  // Operational routes that carry financial fields/events must redact them via canAccessFinanceRole
  for (const r of [
    'src/app/api/admin/dashboard/route.ts',
    'src/app/api/admin/applications/route.ts',
    'src/app/api/admin/applications/[id]/route.ts',
    'src/app/api/admin/leads/route.ts',
    'src/app/api/admin/leads/[id]/route.ts',
    'src/app/api/admin/leads/[id]/portal/route.ts',
    'src/app/api/admin/employees/route.ts',
    'src/app/api/admin/kpi/route.ts',
    'src/app/api/admin/kpi/[empId]/route.ts',
  ]) {
    const src = fs.readFileSync(r, 'utf8');
    assert.match(src, /canAccessFinanceRole/, `${r} must gate financial fields/events with canAccessFinanceRole`);
  }

  const layoutSrc = fs.readFileSync('src/app/admin/AdminLayoutClient.tsx', 'utf8');
  assert.match(layoutSrc, /href:\s*'\/admin\/finance'/);
  assert.match(layoutSrc, /canAccessFinanceRole/);
  const counselorPrefixMatch = layoutSrc.match(/COUNSELOR_ALLOWED_PREFIXES\s*=\s*\[([^\]]+)\]/);
  assert.ok(counselorPrefixMatch, 'COUNSELOR_ALLOWED_PREFIXES must exist');
  assert.doesNotMatch(counselorPrefixMatch[1], /finance|payroll/i, 'Counselors must not be allowed on /admin/finance');

  const financeUiSrc = fs.readFileSync('src/components/admin/FinanceWorkspaceClient.tsx', 'utf8');
  assert.match(financeUiSrc, /canAccessFinanceRole/);
});

test('getOrGenerateMonthlyPayroll aligns with active Employee roster and deduplicates stale records', async () => {
  const { getOrGenerateMonthlyPayroll } = await import('../src/lib/finance-service.ts');
  const result = await getOrGenerateMonthlyPayroll('2026-11');
  assert.equal(result.month, '2026-11');
  assert.ok(Array.isArray(result.rows));

  // No duplicate empIds in the returned rows
  const empIds = result.rows.map(r => r.empId);
  const uniqueEmpIds = new Set(empIds);
  assert.equal(empIds.length, uniqueEmpIds.size, 'Each employee must appear exactly once without duplicates');

  // Verify sorted order
  const sortedEmpIds = [...empIds].sort();
  assert.deepEqual(empIds, sortedEmpIds, 'Payroll rows must be ordered by empId');
});

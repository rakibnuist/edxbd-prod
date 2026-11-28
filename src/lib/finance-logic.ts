export const FINANCE_CASH_INITIAL_KEY = 'financeCashInitial';

export const DEFAULT_INCOME_CATEGORIES = [
  'Service Charge',
  'File Opening',
  'Application Deposit',
  'Investment',
  'Marketing',
  'Refund',
  'Previous Cash',
  'App Fee',
  'Other Income',
] as const;

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Salary',
  'Office Rent',
  'Air Ticket',
  'Medical',
  'App Fee',
  'Meta Marketing',
  'Marketing',
  'Client Hospitality',
  'Visa Fee',
  'Translation Fee',
  'Airport Pickup',
  'Office Supplies',
  'Utilities',
  'Travel',
  'Mata Support',
  'Refund Out',
  'Student Referral',
  'Other Expense',
] as const;

export const STUDENT_FINANCE_KEYWORDS = [
  'visa',
  'application fee',
  'app fee',
  'air ticket',
  'ticket',
  'medical',
  'service charge',
  'file opening',
  'application deposit',
  'tuition fee',
  'student referral',
  'referral',
  'airport pickup',
  'airport pick up',
] as const;

export interface ProfitShareConfig {
  name: string;
  short: string;
  pct: number;
  tone: 'blue' | 'violet' | 'amber';
}

export const PROFIT_SHARES: readonly ProfitShareConfig[] = [
  { name: 'Abdullah Al Rakib', short: 'Rakib', pct: 45, tone: 'blue' },
  { name: 'Tahmid Imam', short: 'Tahmid', pct: 30, tone: 'violet' },
  { name: 'Sakib Al Jubaer', short: 'Sakib', pct: 25, tone: 'amber' },
] as const;

export interface FinanceIncomeDto {
  id: string;
  legacyCrmId?: number | null;
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
  employeeName?: string | null;
  running?: number;
}

export interface FinanceExpenseDto {
  id: string;
  legacyCrmId?: number | null;
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
  employeeName?: string | null;
  running?: number;
}

export interface PayrollRecordDto {
  id: string;
  month: string;
  empId: string;
  employeeId: string | null;
  name: string;
  baseSalary: number;
  daysWorked: number;
  workingDays: number;
  bonus: number;
  deductions: number;
  netPay: number;
  paidOn: string | null;
  status: string;
  notes: string | null;
}

export interface CategoryAmountRow {
  name: string;
  amount: number;
  count: number;
}

export interface PnlMonthRow {
  month: string;
  income: number;
  expense: number;
  profit: number;
  margin: number;
  cumulative: number;
}

export interface YearMonthRow {
  month: string;
  opening: number;
  income: number;
  expense: number;
  net: number;
  closing: number;
}

export interface FinanceDashboardSnapshot {
  currentMonth: string;
  allTimeIncome: number;
  allTimeExpenses: number;
  allTimeNetProfit: number;
  cashPosition: number;
  monthIncome: number;
  monthExpenses: number;
  monthNetProfit: number;
  totalInvestorCapital: number;
  incomeEntryCount: number;
  expenseEntryCount: number;
  payrollPendingCount: number;
  payrollPendingAmount: number;
  latestEntryDate: string | null;
}

export function formatBdt(amount: number | null | undefined): string {
  const num = Number(amount || 0);
  const rounded = Math.round(Number.isFinite(num) ? num : 0);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}৳${Math.abs(rounded).toLocaleString('en-US')}`;
}

export function dhakaCurrentMonth(nowMs = Date.now()): string {
  return new Date(nowMs + 6 * 3600 * 1000).toISOString().slice(0, 7);
}

export function dhakaCurrentDate(nowMs = Date.now()): string {
  return new Date(nowMs + 6 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidMonth(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return false;
  return true;
}

export function normalizeFinanceMonth(raw: string | null | undefined, fallback?: string): string {
  if (raw && isValidMonth(raw.trim())) return raw.trim();
  return fallback || dhakaCurrentMonth();
}

export function shiftMonth(month: string, delta: number): string {
  if (!isValidMonth(month)) return dhakaCurrentMonth();
  const [y, mo] = month.split('-').map(Number);
  const totalMonths = y * 12 + (mo - 1) + delta;
  const newY = Math.floor(totalMonths / 12);
  const newMo = ((totalMonths % 12) + 12) % 12 + 1;
  return `${newY}-${String(newMo).padStart(2, '0')}`;
}

export function formatMonthLabel(month: string): string {
  if (!isValidMonth(month)) return month || 'All Time';
  const [y, mo] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, mo - 1, 15));
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function workingDaysInMonth(month: string): number {
  if (!isValidMonth(month)) return 26;
  const [y, m] = month.split('-').map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let wd = 0;
  for (let d = 1; d <= days; d++) {
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    // EduExpress Dhaka HQ operates Saturday–Thursday; Friday (5) is the weekly off day
    if (dow !== 5) wd++;
  }
  return wd;
}

function cleanOptionalText(value: unknown, maxLen: number): string | null {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text.slice(0, maxLen) : null;
}

export function validateIncomePayload(body: Record<string, unknown>): {
  data?: {
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
  };
  error?: string;
} {
  const dateRaw = typeof body.date === 'string' ? body.date.trim().slice(0, 10) : '';
  if (!isValidIsoDate(dateRaw)) {
    return { error: 'A valid date (YYYY-MM-DD) is required.' };
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) {
    return { error: 'Amount must be a valid non-negative number.' };
  }

  const studentName = cleanOptionalText(body.studentName ?? body.student_name, 160);
  const clientName = cleanOptionalText(body.clientName ?? body.client_name, 160) || studentName;

  return {
    data: {
      date: dateRaw,
      month: dateRaw.slice(0, 7),
      category: cleanOptionalText(body.category, 80),
      leadRef: cleanOptionalText(body.leadRef ?? body.lead_id, 60),
      leadId: cleanOptionalText(body.leadId, 60),
      clientName,
      studentName,
      reference: cleanOptionalText(body.reference, 160),
      amount,
      notes: cleanOptionalText(body.notes, 2000),
      excludeFromCash: Boolean(body.excludeFromCash ?? body.exclude_from_cash),
      employeeId: cleanOptionalText(body.employeeId ?? body.employee_id, 60),
    },
  };
}

export function validateExpensePayload(body: Record<string, unknown>): {
  data?: {
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
  };
  error?: string;
} {
  const dateRaw = typeof body.date === 'string' ? body.date.trim().slice(0, 10) : '';
  if (!isValidIsoDate(dateRaw)) {
    return { error: 'A valid date (YYYY-MM-DD) is required.' };
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000_000) {
    return { error: 'Amount must be a valid non-negative number.' };
  }

  const studentName = cleanOptionalText(body.studentName ?? body.student_name, 160);
  const paidTo = cleanOptionalText(body.paidTo ?? body.paid_to ?? body.clientName ?? body.client_name, 160);

  return {
    data: {
      date: dateRaw,
      month: dateRaw.slice(0, 7),
      category: cleanOptionalText(body.category, 80),
      paidTo,
      leadRef: cleanOptionalText(body.leadRef ?? body.lead_id, 60),
      leadId: cleanOptionalText(body.leadId, 60),
      studentName,
      reference: cleanOptionalText(body.reference, 160),
      amount,
      notes: cleanOptionalText(body.notes, 2000),
      employeeId: cleanOptionalText(body.employeeId ?? body.employee_id, 60),
    },
  };
}

export function validatePayrollUpdatePayload(
  body: Record<string, unknown>,
  current: { baseSalary: number; bonus: number; deductions: number; status: string; paidOn: string | null; notes: string | null },
  todayIso: string,
): {
  data?: {
    baseSalary: number;
    bonus: number;
    deductions: number;
    netPay: number;
    status: 'pending' | 'paid';
    paidOn: string | null;
    notes: string | null;
  };
  error?: string;
} {
  const parseNum = (raw: unknown, fallback: number, label: string) => {
    if (raw === undefined || raw === null || raw === '') return { value: fallback };
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > 100_000_000) {
      return { error: `${label} must be a valid non-negative number.` };
    }
    return { value: n };
  };

  const baseRes = parseNum(body.baseSalary ?? body.base_salary, current.baseSalary, 'Base salary');
  if (baseRes.error) return { error: baseRes.error };

  const bonusRes = parseNum(body.bonus, current.bonus, 'Bonus');
  if (bonusRes.error) return { error: bonusRes.error };

  const dedRes = parseNum(body.deductions, current.deductions, 'Deductions');
  if (dedRes.error) return { error: dedRes.error };

  const rawStatus = body.status !== undefined ? String(body.status).trim().toLowerCase() : current.status;
  if (rawStatus !== 'pending' && rawStatus !== 'paid') {
    return { error: 'Status must be pending or paid.' };
  }

  let paidOn: string | null = null;
  if (rawStatus === 'paid') {
    const rawPaidOn = body.paidOn ?? body.paid_on;
    if (typeof rawPaidOn === 'string' && rawPaidOn.trim()) {
      if (!isValidIsoDate(rawPaidOn.trim())) {
        return { error: 'Paid date must be YYYY-MM-DD.' };
      }
      paidOn = rawPaidOn.trim();
    } else {
      paidOn = current.paidOn || todayIso;
    }
  }

  const baseSalary = baseRes.value!;
  const bonus = bonusRes.value!;
  const deductions = dedRes.value!;
  const netPay = Math.max(0, baseSalary + bonus - deductions);
  const notes = body.notes !== undefined ? cleanOptionalText(body.notes, 1000) : current.notes;

  return {
    data: {
      baseSalary,
      bonus,
      deductions,
      netPay,
      status: rawStatus,
      paidOn,
      notes,
    },
  };
}

export function buildCategoryBreakdown(rows: Array<{ category: string | null; amount: number }>): CategoryAmountRow[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const r of rows) {
    const key = (r.category || '').trim() || 'Uncategorised';
    const prev = map.get(key) || { amount: 0, count: 0 };
    prev.amount += Number(r.amount) || 0;
    prev.count += 1;
    map.set(key, prev);
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, amount: v.amount, count: v.count }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildReferenceBreakdown(rows: Array<{ reference: string | null; amount: number }>): CategoryAmountRow[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const r of rows) {
    const key = (r.reference || '').trim() || 'Direct';
    const prev = map.get(key) || { amount: 0, count: 0 };
    prev.amount += Number(r.amount) || 0;
    prev.count += 1;
    map.set(key, prev);
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, amount: v.amount, count: v.count }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeRunningLedger(
  opening: number,
  incomes: FinanceIncomeDto[],
  expenses: FinanceExpenseDto[],
): {
  income: FinanceIncomeDto[];
  expense: FinanceExpenseDto[];
  totals: { in: number; out: number; net: number; closing: number };
} {
  type Event = { kind: 'in' | 'out'; id: string; amount: number; sortKey: string; running: number };
  const events: Event[] = [
    ...incomes.map((r) => ({
      kind: 'in' as const,
      id: r.id,
      amount: Number(r.amount) || 0,
      sortKey: `${r.date}-0-${String(r.legacyCrmId ?? 999999999).padStart(9, '0')}-${r.id}`,
      running: 0,
    })),
    ...expenses.map((r) => ({
      kind: 'out' as const,
      id: r.id,
      amount: Number(r.amount) || 0,
      sortKey: `${r.date}-1-${String(r.legacyCrmId ?? 999999999).padStart(9, '0')}-${r.id}`,
      running: 0,
    })),
  ].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  let running = opening;
  const runMap = new Map<string, number>();
  for (const e of events) {
    running += e.kind === 'in' ? e.amount : -e.amount;
    e.running = running;
    runMap.set(`${e.kind}:${e.id}`, running);
  }

  const totalIn = incomes.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalOut = expenses.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return {
    income: incomes.map((r) => ({ ...r, running: runMap.get(`in:${r.id}`) ?? opening })),
    expense: expenses.map((r) => ({ ...r, running: runMap.get(`out:${r.id}`) ?? opening })),
    totals: {
      in: totalIn,
      out: totalOut,
      net: totalIn - totalOut,
      closing: opening + totalIn - totalOut,
    },
  };
}

export function computePnlFromRows(
  incomes: Array<{ month: string; amount: number; excludeFromCash?: boolean }>,
  expenses: Array<{ month: string; amount: number }>,
): PnlMonthRow[] {
  const monthMap = new Map<string, { income: number; expense: number }>();

  for (const r of incomes) {
    if (r.excludeFromCash || !r.month) continue;
    const prev = monthMap.get(r.month) || { income: 0, expense: 0 };
    prev.income += Number(r.amount) || 0;
    monthMap.set(r.month, prev);
  }
  for (const r of expenses) {
    if (!r.month) continue;
    const prev = monthMap.get(r.month) || { income: 0, expense: 0 };
    prev.expense += Number(r.amount) || 0;
    monthMap.set(r.month, prev);
  }

  const months = Array.from(monthMap.keys()).sort((a, b) => a.localeCompare(b));
  let cumulative = 0;

  return months.map((month) => {
    const { income, expense } = monthMap.get(month)!;
    const profit = income - expense;
    cumulative += profit;
    const margin = income > 0 ? Number(((profit / income) * 100).toFixed(1)) : 0;
    return { month, income, expense, profit, margin, cumulative };
  });
}

export function computeYearSeriesFromRows(
  year: number,
  cashInitial: number,
  incomes: Array<{ month: string; amount: number; excludeFromCash?: boolean }>,
  expenses: Array<{ month: string; amount: number }>,
): { year: number; opening: number; closing: number; rows: YearMonthRow[] } {
  const yearPrefix = `${year}-01`;
  let priorIn = 0;
  let priorOut = 0;
  const inByMonth = new Map<string, number>();
  const outByMonth = new Map<string, number>();

  for (const r of incomes) {
    if (r.excludeFromCash || !r.month) continue;
    const amt = Number(r.amount) || 0;
    if (r.month < yearPrefix) priorIn += amt;
    else if (r.month.startsWith(`${year}-`)) {
      inByMonth.set(r.month, (inByMonth.get(r.month) || 0) + amt);
    }
  }
  for (const r of expenses) {
    if (!r.month) continue;
    const amt = Number(r.amount) || 0;
    if (r.month < yearPrefix) priorOut += amt;
    else if (r.month.startsWith(`${year}-`)) {
      outByMonth.set(r.month, (outByMonth.get(r.month) || 0) + amt);
    }
  }

  let running = cashInitial + priorIn - priorOut;
  const rows: YearMonthRow[] = [];
  for (let i = 1; i <= 12; i++) {
    const month = `${year}-${String(i).padStart(2, '0')}`;
    const income = inByMonth.get(month) || 0;
    const expense = outByMonth.get(month) || 0;
    const opening = running;
    const net = income - expense;
    const closing = opening + net;
    running = closing;
    rows.push({ month, opening, income, expense, net, closing });
  }

  return {
    year,
    opening: rows[0]?.opening ?? cashInitial,
    closing: rows[11]?.closing ?? cashInitial,
    rows,
  };
}

export function computeInvestorsFromRows(incomes: FinanceIncomeDto[]): {
  total: number;
  contributions: FinanceIncomeDto[];
  byPerson: Array<{ name: string; amount: number; count: number; pctShare: number | null }>;
} {
  const contributions = incomes
    .filter((r) => (r.category || '').trim() === 'Investment')
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const map = new Map<string, { amount: number; count: number }>();
  for (const r of contributions) {
    const name = (r.clientName || '').trim() || 'Unknown';
    const prev = map.get(name) || { amount: 0, count: 0 };
    prev.amount += Number(r.amount) || 0;
    prev.count += 1;
    map.set(name, prev);
  }

  const shareMap = new Map(PROFIT_SHARES.map((p) => [p.name.toLowerCase(), p.pct]));
  const byPerson = Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      amount: v.amount,
      count: v.count,
      pctShare: shareMap.get(name.toLowerCase()) ?? null,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    total: contributions.reduce((s, r) => s + (Number(r.amount) || 0), 0),
    contributions,
    byPerson,
  };
}

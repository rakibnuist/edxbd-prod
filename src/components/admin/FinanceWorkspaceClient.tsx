'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  ListOrdered,
  Pencil,
  PiggyBank,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFinanceRole } from '@/lib/roles';
import {
  PROFIT_SHARES,
  buildCategoryBreakdown,
  dhakaCurrentDate,
  dhakaCurrentMonth,
  formatBdt,
  formatMonthLabel,
  shiftMonth,
  type CategoryAmountRow,
  type FinanceExpenseDto,
  type FinanceIncomeDto,
  type PayrollRecordDto,
  type PnlMonthRow,
  type YearMonthRow,
} from '@/lib/finance-logic';
import {
  CumulativeProfitChart,
  DonutBreakdownCard,
  HorizontalShareCard,
  MonthlyIncomeExpenseChart,
  MonthlyNetDivergingChart,
  YearCashTrendChart,
} from '@/components/admin/FinanceCharts';
import {
  FinanceEntryModal,
  InvestmentEntryModal,
  OpeningCashModal,
  PayslipModal,
  type FinanceEmployeeOption,
  type FinanceStudentOption,
} from '@/components/admin/FinanceEntryModal';

type FinanceTab =
  | 'overview'
  | 'cashflow'
  | 'income'
  | 'expenses'
  | 'student'
  | 'year'
  | 'investors'
  | 'payroll';

type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

interface SummaryResponse {
  month: string;
  activeCashflowMonth: string;
  cashInitial: number;
  liveBalance: number;
  allTimeCashIncome?: number;
  allTimeExpenses?: number;
  investorTotal?: number;
  investorCount?: number;
  payrollPendingCount?: number;
  payrollPendingAmount?: number;
  latestEntryDate?: string | null;
  cashflowClosing: number;
  income: { rows: FinanceIncomeDto[]; total: number; sum: number };
  expenses: { rows: FinanceExpenseDto[]; total: number; sum: number };
  pnl: PnlMonthRow[];
  prevMonthDelta: { income: number; expenses: number; profit: number };
  categories: { income: string[]; expense: string[] };
  employees: FinanceEmployeeOption[];
  students: FinanceStudentOption[];
}

interface CashflowResponse {
  month: string;
  opening: number;
  income: FinanceIncomeDto[];
  expense: FinanceExpenseDto[];
  totals: { in: number; out: number; net: number; closing: number };
  byCategory: { income: CategoryAmountRow[]; expense: CategoryAmountRow[] };
  incomeByReference: CategoryAmountRow[];
  cashInitial: number;
}

interface YearResponse {
  year: number;
  opening: number;
  closing: number;
  rows: YearMonthRow[];
}

interface InvestorsResponse {
  total: number;
  contributions: FinanceIncomeDto[];
  byPerson: Array<{ name: string; amount: number; count: number; pctShare: number | null }>;
}

interface StudentTxResponse {
  student: {
    id: string;
    name: string;
    phone: string;
    email: string;
    country: string;
    university: string | null;
    program: string | null;
    status: string;
    applicationStage: string;
  } | null;
  transactions: Array<
    (FinanceIncomeDto & { kind: 'income' }) | (FinanceExpenseDto & { kind: 'expense' })
  >;
  totals: { income: number; expense: number; net: number; count: number };
}

interface PayrollResponse {
  month: string;
  workingDays: number;
  rows: PayrollRecordDto[];
  totals: {
    base: number;
    bonus: number;
    deductions: number;
    net: number;
    paid: number;
    pending: number;
  };
}

function escapeCsvCell(val: unknown): string {
  const str = String(val ?? '');
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, headers: string[], rows: Array<Array<unknown>>) {
  const lines = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function categoryBadgeTone(category: string | null | undefined, kind: 'income' | 'expense'): string {
  const c = (category || '').toLowerCase();
  if (kind === 'income') {
    if (c.includes('invest')) return 'border-violet-200 bg-violet-50 text-violet-800';
    if (c.includes('service')) return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    if (c.includes('deposit') || c.includes('file')) return 'border-sky-200 bg-sky-50 text-sky-800';
    return 'border-slate-200 bg-slate-50 text-slate-700';
  }
  if (c.includes('salary')) return 'border-blue-200 bg-blue-50 text-blue-800';
  if (c.includes('ticket') || c.includes('pickup') || c.includes('pick up')) return 'border-amber-200 bg-amber-50 text-amber-800';
  if (c.includes('rent') || c.includes('utilit')) return 'border-slate-300 bg-slate-100 text-slate-700';
  if (c.includes('visa') || c.includes('app fee') || c.includes('medical')) return 'border-indigo-200 bg-indigo-50 text-indigo-800';
  if (c.includes('market') || c.includes('referral')) return 'border-purple-200 bg-purple-50 text-purple-800';
  if (c.includes('refund')) return 'border-rose-200 bg-rose-50 text-rose-800';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'EE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function sortLedgerRows<T extends { date: string; amount: number }>(rows: T[], sort: SortOption): T[] {
  const copy = [...rows];
  switch (sort) {
    case 'date_asc':
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case 'amount_desc':
      return copy.sort((a, b) => b.amount - a.amount || b.date.localeCompare(a.date));
    case 'amount_asc':
      return copy.sort((a, b) => a.amount - b.amount || b.date.localeCompare(a.date));
    case 'date_desc':
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date));
  }
}

export default function FinanceWorkspaceClient() {
  const { user, isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [tab, setTab] = useState<FinanceTab>('overview');

  const [monthFilter, setMonthFilter] = useState<string>('');
  const [includeExcluded, setIncludeExcluded] = useState<boolean>(false);

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // Cashflow sub-tab
  const [cashflowMonth, setCashflowMonth] = useState<string>(() => dhakaCurrentMonth());
  const [cashflowView, setCashflowView] = useState<'statement' | 'split'>('statement');
  const [cashflowData, setCashflowData] = useState<CashflowResponse | null>(null);

  // Year sub-tab
  const [yearVal, setYearVal] = useState<number>(() => Number(dhakaCurrentMonth().slice(0, 4)));
  const [yearData, setYearData] = useState<YearResponse | null>(null);

  // Investors sub-tab
  const [investorsData, setInvestorsData] = useState<InvestorsResponse | null>(null);

  // Student lookup sub-tab
  const [studentQuery, setStudentQuery] = useState('');
  const [studentResult, setStudentResult] = useState<StudentTxResponse | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // Payroll sub-tab
  const [payrollMonth, setPayrollMonth] = useState<string>(() => dhakaCurrentMonth());
  const [payrollData, setPayrollData] = useState<PayrollResponse | null>(null);
  const [payrollEdits, setPayrollEdits] = useState<
    Record<string, { baseSalary?: string; bonus?: string; deductions?: string; notes?: string }>
  >({});
  const [payrollBusyId, setPayrollBusyId] = useState<string | null>(null);
  const [payrollSyncing, setPayrollSyncing] = useState(false);
  const [payslipRecord, setPayslipRecord] = useState<PayrollRecordDto | null>(null);

  // Ledger filters, sort, & display density
  const [incomeSearch, setIncomeSearch] = useState('');
  const [incomeCatFilter, setIncomeCatFilter] = useState('');
  const [incomeSort, setIncomeSort] = useState<SortOption>('date_desc');
  const [incomeLimit, setIncomeLimit] = useState<number>(30);

  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCatFilter, setExpenseCatFilter] = useState('');
  const [expenseSort, setExpenseSort] = useState<SortOption>('date_desc');
  const [expenseLimit, setExpenseLimit] = useState<number>(30);

  // Modals
  const [entryModal, setEntryModal] = useState<{
    kind: 'income' | 'expense';
    record?: FinanceIncomeDto | FinanceExpenseDto | null;
    defaultDate?: string;
  } | null>(null);
  const [openingModalOpen, setOpeningModalOpen] = useState(false);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);

  const showNotice = useCallback((tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => {
      setNotice((cur) => (cur?.text === text ? null : cur));
    }, 4500);
  }, []);

  const loadSummary = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (monthFilter) params.set('month', monthFilter);
        if (includeExcluded) params.set('includeExcluded', '1');
        const res = await authenticatedFetch(`/api/admin/finance/summary?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || `Request failed (${res.status})`);
        }
        setSummary(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load financial data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authenticatedFetch, monthFilter, includeExcluded],
  );

  const loadCashflow = useCallback(
    async (targetMonth = cashflowMonth) => {
      const res = await authenticatedFetch(
        `/api/admin/finance/cashflow?month=${encodeURIComponent(targetMonth)}`,
      );
      if (res.ok) setCashflowData(await res.json());
    },
    [authenticatedFetch, cashflowMonth],
  );

  const loadYear = useCallback(
    async (targetYear = yearVal) => {
      const res = await authenticatedFetch(`/api/admin/finance/year?year=${targetYear}`);
      if (res.ok) setYearData(await res.json());
    },
    [authenticatedFetch, yearVal],
  );

  const loadInvestors = useCallback(async () => {
    const res = await authenticatedFetch('/api/admin/finance/investors');
    if (res.ok) setInvestorsData(await res.json());
  }, [authenticatedFetch]);

  const loadPayroll = useCallback(
    async (targetMonth = payrollMonth) => {
      setPayrollSyncing(true);
      try {
        const res = await authenticatedFetch(
          `/api/admin/payroll?month=${encodeURIComponent(targetMonth)}`,
        );
        if (res.ok) {
          setPayrollData(await res.json());
          setPayrollEdits({});
        }
      } finally {
        setPayrollSyncing(false);
      }
    },
    [authenticatedFetch, payrollMonth],
  );

  const searchStudentLedger = useCallback(
    async (override?: string) => {
      const q = (override !== undefined ? override : studentQuery).trim();
      if (!q) {
        setStudentResult(null);
        return;
      }
      setStudentLoading(true);
      try {
        const res = await authenticatedFetch(
          `/api/admin/finance/student-transactions?q=${encodeURIComponent(q)}`,
        );
        if (res.ok) setStudentResult(await res.json());
      } finally {
        setStudentLoading(false);
      }
    },
    [authenticatedFetch, studentQuery],
  );

  const refreshActiveViews = useCallback(async () => {
    await loadSummary(true);
    if (tab === 'cashflow') await loadCashflow();
    if (tab === 'year') await loadYear();
    if (tab === 'investors') await loadInvestors();
    if (tab === 'payroll') await loadPayroll();
    if (tab === 'student' && studentQuery.trim()) await searchStudentLedger();
  }, [tab, loadSummary, loadCashflow, loadYear, loadInvestors, loadPayroll, searchStudentLedger, studentQuery]);

  useEffect(() => {
    if (!isAuthenticated || authLoading || !canAccessFinanceRole(user?.role)) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (monthFilter) params.set('month', monthFilter);
    if (includeExcluded) params.set('includeExcluded', '1');

    authenticatedFetch(`/api/admin/finance/summary?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || `Request failed (${res.status})`);
        }
        return res.json() as Promise<SummaryResponse>;
      })
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load financial data.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, user?.role, authenticatedFetch, monthFilter, includeExcluded]);

  useEffect(() => {
    if (!isAuthenticated || authLoading || !canAccessFinanceRole(user?.role)) return;
    let cancelled = false;

    if (tab === 'cashflow') {
      authenticatedFetch(`/api/admin/finance/cashflow?month=${encodeURIComponent(cashflowMonth)}`)
        .then((res) => (res.ok ? (res.json() as Promise<CashflowResponse>) : null))
        .then((data) => {
          if (!cancelled && data) setCashflowData(data);
        })
        .catch(() => {});
    } else if (tab === 'year') {
      authenticatedFetch(`/api/admin/finance/year?year=${yearVal}`)
        .then((res) => (res.ok ? (res.json() as Promise<YearResponse>) : null))
        .then((data) => {
          if (!cancelled && data) setYearData(data);
        })
        .catch(() => {});
    } else if (tab === 'investors') {
      authenticatedFetch('/api/admin/finance/investors')
        .then((res) => (res.ok ? (res.json() as Promise<InvestorsResponse>) : null))
        .then((data) => {
          if (!cancelled && data) setInvestorsData(data);
        })
        .catch(() => {});
    } else if (tab === 'payroll') {
      authenticatedFetch(`/api/admin/payroll?month=${encodeURIComponent(payrollMonth)}`)
        .then((res) => (res.ok ? (res.json() as Promise<PayrollResponse>) : null))
        .then((data) => {
          if (!cancelled && data) {
            setPayrollData(data);
            setPayrollEdits({});
          }
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [tab, isAuthenticated, authLoading, user?.role, authenticatedFetch, cashflowMonth, yearVal, payrollMonth]);

  const handleSaveEntry = async (payload: Record<string, unknown>, id?: string) => {
    if (!entryModal) return;
    const base = entryModal.kind === 'income' ? '/api/admin/finance/income' : '/api/admin/finance/expenses';
    const res = await authenticatedFetch(id ? `${base}/${id}` : base, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Could not save entry.');
    }
    setEntryModal(null);
    showNotice('ok', id ? 'Ledger entry updated.' : `${entryModal.kind === 'income' ? 'Income' : 'Expense'} recorded.`);
    await refreshActiveViews();
  };

  const handleDeleteEntry = async (kind: 'income' | 'expense', id: string) => {
    const base = kind === 'income' ? '/api/admin/finance/income' : '/api/admin/finance/expenses';
    const res = await authenticatedFetch(`${base}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Could not delete entry.');
    }
    setEntryModal(null);
    showNotice('ok', 'Ledger entry deleted.');
    await refreshActiveViews();
  };

  const handleSaveOpeningCash = async (amount: number) => {
    const res = await authenticatedFetch('/api/admin/finance/cashflow', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Could not update opening cash.');
    }
    setOpeningModalOpen(false);
    showNotice('ok', 'Baseline opening cash updated.');
    await refreshActiveViews();
  };

  const handleSaveInvestment = async (payload: Record<string, unknown>) => {
    const res = await authenticatedFetch('/api/admin/finance/income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'Could not record investment.');
    }
    setInvestmentModalOpen(false);
    showNotice('ok', 'Partner capital contribution recorded.');
    await refreshActiveViews();
  };

  const handleSavePayrollRow = async (row: PayrollRecordDto) => {
    const edit = payrollEdits[row.id];
    if (!edit) return;
    setPayrollBusyId(row.id);
    try {
      const res = await authenticatedFetch(`/api/admin/payroll/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseSalary: edit.baseSalary !== undefined ? Number(edit.baseSalary) : row.baseSalary,
          bonus: edit.bonus !== undefined ? Number(edit.bonus) : row.bonus,
          deductions: edit.deductions !== undefined ? Number(edit.deductions) : row.deductions,
          notes: edit.notes !== undefined ? edit.notes : row.notes,
          syncEmployeeSalary: edit.baseSalary !== undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to save payroll');
      }
      showNotice('ok', `Payroll updated for ${row.name}.`);
      await loadPayroll();
      await loadSummary(true);
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Payroll update failed.');
    } finally {
      setPayrollBusyId(null);
    }
  };

  const handleTogglePayrollPaid = async (row: PayrollRecordDto) => {
    const nextStatus = row.status === 'paid' ? 'pending' : 'paid';
    const pendingEdit = payrollEdits[row.id];
    const effectiveBase =
      pendingEdit?.baseSalary !== undefined && pendingEdit.baseSalary !== ''
        ? Number(pendingEdit.baseSalary)
        : row.baseSalary;
    const effectiveBonus =
      pendingEdit?.bonus !== undefined && pendingEdit.bonus !== ''
        ? Number(pendingEdit.bonus)
        : row.bonus;
    const effectiveDeductions =
      pendingEdit?.deductions !== undefined && pendingEdit.deductions !== ''
        ? Number(pendingEdit.deductions)
        : row.deductions;
    const effectiveNetPay = Math.max(
      0,
      (Number.isFinite(effectiveBase) ? effectiveBase : row.baseSalary) +
        (Number.isFinite(effectiveBonus) ? effectiveBonus : row.bonus) -
        (Number.isFinite(effectiveDeductions) ? effectiveDeductions : row.deductions),
    );
    const confirmMsg =
      nextStatus === 'paid'
        ? `Mark ${row.name}'s ${formatMonthLabel(row.month)} salary (${formatBdt(effectiveNetPay)}) as PAID? This automatically logs a Salary expense in the ledger.`
        : `Revert ${row.name}'s ${formatMonthLabel(row.month)} salary to PENDING and remove the linked Salary expense?`;
    if (!window.confirm(confirmMsg)) return;

    setPayrollBusyId(row.id);
    try {
      const res =
        nextStatus === 'paid'
          ? pendingEdit
            ? await authenticatedFetch(`/api/admin/payroll/${row.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  baseSalary: Number.isFinite(effectiveBase) ? effectiveBase : row.baseSalary,
                  bonus: Number.isFinite(effectiveBonus) ? effectiveBonus : row.bonus,
                  deductions: Number.isFinite(effectiveDeductions) ? effectiveDeductions : row.deductions,
                  notes: pendingEdit.notes !== undefined ? pendingEdit.notes : row.notes,
                  syncEmployeeSalary: pendingEdit.baseSalary !== undefined,
                  status: 'paid',
                }),
              })
            : await authenticatedFetch(`/api/admin/payroll/${row.id}`, { method: 'POST' })
          : await authenticatedFetch(`/api/admin/payroll/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'pending' }),
            });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to update payroll status');
      }
      showNotice(
        'ok',
        nextStatus === 'paid'
          ? `${row.name} marked paid and synced to Expense Ledger.`
          : `${row.name} reverted to pending.`,
      );
      await loadPayroll();
      await loadSummary(true);
    } catch (err) {
      showNotice('err', err instanceof Error ? err.message : 'Could not update payroll status.');
    } finally {
      setPayrollBusyId(null);
    }
  };

  const incomeRows = useMemo(() => summary?.income.rows ?? [], [summary]);
  const expenseRows = useMemo(() => summary?.expenses.rows ?? [], [summary]);
  const pnlRows = useMemo(() => summary?.pnl ?? [], [summary]);
  const sortedPnlDesc = useMemo(() => [...pnlRows].sort((a, b) => b.month.localeCompare(a.month)), [pnlRows]);

  const incomeByCategory = useMemo(() => buildCategoryBreakdown(incomeRows), [incomeRows]);
  const expenseByCategory = useMemo(() => buildCategoryBreakdown(expenseRows), [expenseRows]);

  const filteredIncome = useMemo(() => {
    const q = incomeSearch.trim().toLowerCase();
    const list = incomeRows.filter((r) => {
      if (incomeCatFilter && (r.category || 'Uncategorised') !== incomeCatFilter) return false;
      if (!q) return true;
      return [r.date, r.category, r.clientName, r.studentName, r.leadRef, r.reference, r.employeeName, r.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
    return sortLedgerRows(list, incomeSort);
  }, [incomeRows, incomeSearch, incomeCatFilter, incomeSort]);

  const filteredExpenses = useMemo(() => {
    const q = expenseSearch.trim().toLowerCase();
    const list = expenseRows.filter((r) => {
      if (expenseCatFilter && (r.category || 'Uncategorised') !== expenseCatFilter) return false;
      if (!q) return true;
      return [r.date, r.category, r.paidTo, r.studentName, r.leadRef, r.reference, r.employeeName, r.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
    return sortLedgerRows(list, expenseSort);
  }, [expenseRows, expenseSearch, expenseCatFilter, expenseSort]);

  const unifiedStatementRows = useMemo(() => {
    if (!cashflowData) return [];
    type StmtRow = {
      key: string;
      kind: 'income' | 'expense';
      date: string;
      category: string | null;
      party: string | null;
      studentName: string | null;
      leadRef: string | null;
      reference: string | null;
      employeeName: string | null;
      notes: string | null;
      credit: number;
      debit: number;
      running: number;
      sortKey: string;
      raw: FinanceIncomeDto | FinanceExpenseDto;
    };
    const rows: StmtRow[] = [
      ...cashflowData.income.map((r) => ({
        key: `in-${r.id}`,
        kind: 'income' as const,
        date: r.date,
        category: r.category,
        party: r.clientName || r.studentName,
        studentName: r.studentName,
        leadRef: r.leadRef,
        reference: r.reference,
        employeeName: r.employeeName ?? null,
        notes: r.notes,
        credit: r.amount,
        debit: 0,
        running: r.running ?? cashflowData.opening,
        sortKey: `${r.date}-0-${String(r.legacyCrmId ?? 999999999).padStart(9, '0')}-${r.id}`,
        raw: r,
      })),
      ...cashflowData.expense.map((r) => ({
        key: `out-${r.id}`,
        kind: 'expense' as const,
        date: r.date,
        category: r.category,
        party: r.paidTo || r.studentName,
        studentName: r.studentName,
        leadRef: r.leadRef,
        reference: r.reference,
        employeeName: r.employeeName ?? null,
        notes: r.notes,
        credit: 0,
        debit: r.amount,
        running: r.running ?? cashflowData.opening,
        sortKey: `${r.date}-1-${String(r.legacyCrmId ?? 999999999).padStart(9, '0')}-${r.id}`,
        raw: r,
      })),
    ];
    return rows.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [cashflowData]);

  const quickStudents = useMemo(() => {
    const all = summary?.students ?? [];
    const q = studentQuery.trim().toLowerCase();
    if (!q) return all.slice(0, 10);
    return all
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.leadRef || '').toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [summary?.students, studentQuery]);

  const handleExportCsv = (mode: 'all' | 'income' | 'expense' = 'all') => {
    if (!summary) return;
    if (mode === 'income') {
      downloadCsv(
        `eduexpress-income-${monthFilter || 'all-time'}.csv`,
        ['Date', 'Month', 'Category', 'Client', 'Student', 'Lead Ref', 'Reference', 'Handled By', 'Amount (BDT)', 'Cash Status', 'Notes'],
        filteredIncome.map((r) => [
          r.date, r.month, r.category || '', r.clientName || '', r.studentName || '', r.leadRef || '',
          r.reference || '', r.employeeName || '', r.amount, r.excludeFromCash ? 'Pre-Data Capital' : 'Cash', r.notes || '',
        ]),
      );
      return;
    }
    if (mode === 'expense') {
      downloadCsv(
        `eduexpress-expenses-${monthFilter || 'all-time'}.csv`,
        ['Date', 'Month', 'Category', 'Paid To', 'Student', 'Lead Ref', 'Reference', 'Handled By', 'Amount (BDT)', 'Notes'],
        filteredExpenses.map((r) => [
          r.date, r.month, r.category || '', r.paidTo || '', r.studentName || '', r.leadRef || '',
          r.reference || '', r.employeeName || '', r.amount, r.notes || '',
        ]),
      );
      return;
    }
    const rows: Array<Array<unknown>> = [
      ...incomeRows.map((r) => [
        'CREDIT', r.date, r.month, r.category || '', r.clientName || '', r.studentName || '',
        r.leadRef || '', r.reference || '', r.employeeName || '', r.amount, r.excludeFromCash ? 'Pre-Data' : 'Cash', r.notes || '',
      ]),
      ...expenseRows.map((r) => [
        'DEBIT', r.date, r.month, r.category || '', r.paidTo || '', r.studentName || '',
        r.leadRef || '', r.reference || '', r.employeeName || '', -r.amount, 'Cash', r.notes || '',
      ]),
    ].sort((a, b) => String(b[1]).localeCompare(String(a[1])));

    downloadCsv(
      `eduexpress-ledger-${monthFilter || 'all-time'}.csv`,
      ['Type', 'Date', 'Month', 'Category', 'Counterparty', 'Student', 'Lead Ref', 'Reference', 'Handled By', 'Amount (BDT)', 'Book', 'Notes'],
      rows,
    );
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (isAuthenticated && !canAccessFinanceRole(user?.role)) {
    return (
      <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
          <Landmark size={22} />
        </div>
        <h2 className="font-heading text-lg font-bold text-slate-900">Financial Details Restricted</h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Only full-control financial administrators can access the Treasury Ledger, Investor Equity, and Payroll workspace.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-16">
        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
          <Landmark size={22} />
        </div>
        <h2 className="font-heading text-lg font-bold text-slate-900">Unable to load Treasury Ledger</h2>
        <p className="mt-1.5 text-sm text-slate-500">{error || 'Financial service did not respond.'}</p>
        <button
          onClick={() => loadSummary()}
          className="mt-5 rounded-xl bg-[#0f3a5c] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#12436b]"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const netProfit = summary.income.sum - summary.expenses.sum;
  const profitMarginNum = summary.income.sum > 0 ? (netProfit / summary.income.sum) * 100 : 0;
  const expenseRatioNum = summary.income.sum > 0 ? (summary.expenses.sum / summary.income.sum) * 100 : 0;
  const periodLabel = monthFilter ? formatMonthLabel(monthFilter) : 'All Time';
  const activeMonths = Math.max(pnlRows.length, 1);
  const avgMonthlyIn = (summary.allTimeCashIncome ?? summary.income.sum) / activeMonths;
  const avgMonthlyOut = (summary.allTimeExpenses ?? summary.expenses.sum) / activeMonths;

  const pnlTotalIn = pnlRows.reduce((s, r) => s + r.income, 0);
  const pnlTotalOut = pnlRows.reduce((s, r) => s + r.expense, 0);
  const pnlTotalNet = pnlTotalIn - pnlTotalOut;
  const pnlOverallMargin = pnlTotalIn > 0 ? ((pnlTotalNet / pnlTotalIn) * 100).toFixed(1) : '0.0';

  const TABS: Array<{ id: FinanceTab; label: string; count?: number; icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Cashflow Statement', icon: Receipt },
    { id: 'income', label: 'Income Ledger', count: summary.income.total, icon: ArrowDownLeft },
    { id: 'expenses', label: 'Expense Ledger', count: summary.expenses.total, icon: ArrowUpRight },
    { id: 'student', label: 'Student Ledger', icon: GraduationCap },
    { id: 'year', label: 'Annual View', icon: Calendar },
    { id: 'investors', label: 'Investors & Equity', count: summary.investorCount, icon: PiggyBank },
    { id: 'payroll', label: 'Payroll', count: summary.payrollPendingCount || undefined, icon: Banknote },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Print-Only Institutional Letterhead */}
      <div className="hidden border-b-2 border-[#0f3a5c] pb-4 print:block">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0f3a5c]">EduExpress International</p>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Financial Control &amp; Ledger Statement</h1>
            <p className="text-xs text-slate-600">Dhanmondi HQ, Dhaka 1209 · Reporting Scope: {periodLabel}</p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="font-bold text-slate-900">Generated: {dhakaCurrentDate()}</p>
            <p>Currency: Bangladeshi Taka (BDT ৳)</p>
          </div>
        </div>
      </div>

      {/* ────────────────── EXECUTIVE HEADER BAR ────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] print:hidden">
        <div className="h-1 w-full bg-gradient-to-r from-[#071c2e] via-[#0f3a5c] to-[#0b7a53]" />
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#071c2e] text-white shadow-sm">
              <Landmark size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0f3a5c]">
                  Treasury &amp; Accounting · Dhaka HQ
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-[#0b7a53]" />
                  Reconciled · BDT (৳)
                </span>
              </div>
              <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900">
                Financial Control Center
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Scope: <strong className="text-slate-700">{periodLabel}</strong>
                {' · '}
                {summary.income.total} cash receipts &amp; {summary.expenses.total} disbursements
                {summary.latestEntryDate ? ` · Latest entry ${summary.latestEntryDate}` : ''}
              </p>
            </div>
          </div>

          {/* Right Controls: Period + Clean Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Segmented Period Control */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1">
              <button
                type="button"
                onClick={() => setMonthFilter('')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  monthFilter === ''
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setMonthFilter(dhakaCurrentMonth())}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  monthFilter === dhakaCurrentMonth()
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
              <div className="mx-1 h-4 w-px bg-slate-200" />
              <button
                type="button"
                onClick={() => setMonthFilter(shiftMonth(monthFilter || dhakaCurrentMonth(), -1))}
                className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-900"
                aria-label="Previous month"
              >
                <ChevronLeft size={14} />
              </button>
              <input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                aria-label="Filter by month"
                className="w-[116px] cursor-pointer bg-transparent px-1 py-0.5 text-xs font-bold text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => setMonthFilter(shiftMonth(monthFilter || dhakaCurrentMonth(), 1))}
                className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-900"
                aria-label="Next month"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Primary Actions */}
            <button
              type="button"
              onClick={() => setEntryModal({ kind: 'income' })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b7a53] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#096845]"
            >
              <Plus size={14} /> Add Income
            </button>
            <button
              type="button"
              onClick={() => setEntryModal({ kind: 'expense' })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2 text-xs font-bold text-rose-800 transition hover:bg-rose-100/80"
            >
              <Plus size={14} /> Add Expense
            </button>

            {/* Utility Controls */}
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpeningModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                title="Set baseline opening cash"
              >
                <Settings size={13} />
                <span className="hidden xl:inline">Opening Cash</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportCsv('all')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                title="Export CSV"
              >
                <Download size={13} />
                <span className="hidden xl:inline">CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                title="Print or save PDF statement"
              >
                <Printer size={13} />
                <span className="hidden xl:inline">Print</span>
              </button>
              <button
                type="button"
                onClick={() => refreshActiveViews()}
                disabled={refreshing}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                title="Refresh data"
                aria-label="Refresh financial data"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {notice && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold shadow-sm print:hidden ${
            notice.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            {notice.text}
          </span>
          <button type="button" onClick={() => setNotice(null)} className="rounded p-0.5 hover:bg-black/5">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ────────────────── 4 EXECUTIVE KPI CARDS ────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Live Cash Position */}
        <div className="relative overflow-hidden rounded-2xl border border-[#0f3a5c]/20 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Cash Position</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                summary.liveBalance >= 0
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
            >
              <span className={`size-1.5 rounded-full ${summary.liveBalance >= 0 ? 'bg-[#0b7a53]' : 'bg-rose-600'}`} />
              {summary.liveBalance >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
          <p className="mt-2.5 font-heading text-[28px] font-bold leading-none tracking-tight tabular-nums text-[#071c2e]">
            {formatBdt(summary.liveBalance)}
          </p>
          <p className="mt-3 text-[11px] text-slate-500 tabular-nums">
            Baseline {formatBdt(summary.cashInitial)} · All-time cashbook balance
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
            <span className="text-slate-400">Net of 6 pre-data capital entries</span>
            <button
              type="button"
              onClick={() => setOpeningModalOpen(true)}
              className="font-bold text-[#0f3a5c] hover:underline print:hidden"
            >
              Adjust
            </button>
          </div>
        </div>

        {/* 2. Total Cash Inflow */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cash Inflow · {periodLabel}
            </span>
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-[#0b7a53]">
              <ArrowDownLeft size={15} />
            </span>
          </div>
          <p className="mt-2.5 font-heading text-[28px] font-bold leading-none tracking-tight tabular-nums text-slate-900">
            {formatBdt(summary.income.sum)}
          </p>
          <p className="mt-3 text-[11px] text-slate-500 tabular-nums">
            {summary.income.total} entries · Avg{' '}
            <strong className="text-slate-700">
              {formatBdt(summary.income.total > 0 ? summary.income.sum / summary.income.total : 0)}
            </strong>{' '}
            / receipt
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
            <span className="text-slate-500">Top: {incomeByCategory[0]?.name || '—'}</span>
            <button
              type="button"
              onClick={() => setTab('income')}
              className="font-bold text-[#0b7a53] hover:underline print:hidden"
            >
              Ledger →
            </button>
          </div>
        </div>

        {/* 3. Total Disbursements */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Disbursements · {periodLabel}
            </span>
            <span className="grid size-7 place-items-center rounded-lg bg-rose-50 text-rose-600">
              <ArrowUpRight size={15} />
            </span>
          </div>
          <p className="mt-2.5 font-heading text-[28px] font-bold leading-none tracking-tight tabular-nums text-slate-900">
            {formatBdt(summary.expenses.sum)}
          </p>
          <p className="mt-3 text-[11px] text-slate-500 tabular-nums">
            {summary.expenses.total} entries ·{' '}
            <strong className="text-slate-700">{expenseRatioNum.toFixed(1)}%</strong> of inflow
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
            <span className="text-slate-500">Top: {expenseByCategory[0]?.name || '—'}</span>
            <button
              type="button"
              onClick={() => setTab('expenses')}
              className="font-bold text-rose-700 hover:underline print:hidden"
            >
              Ledger →
            </button>
          </div>
        </div>

        {/* 4. Net Operating Surplus */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Net Surplus · {periodLabel}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                profitMarginNum >= 0
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
            >
              {profitMarginNum.toFixed(1)}% margin
            </span>
          </div>
          <p
            className={`mt-2.5 font-heading text-[28px] font-bold leading-none tracking-tight tabular-nums ${
              netProfit >= 0 ? 'text-[#0b7a53]' : 'text-rose-700'
            }`}
          >
            {netProfit >= 0 ? '+' : ''}
            {formatBdt(netProfit)}
          </p>
          <p className="mt-3 text-[11px] text-slate-500 tabular-nums">
            Avg monthly run-rate: <strong className="text-slate-700">{formatBdt(avgMonthlyIn)}</strong> in /{' '}
            <strong className="text-slate-700">{formatBdt(avgMonthlyOut)}</strong> out
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
            <span className="text-slate-500">Investor pool: {formatBdt(summary.investorTotal ?? 0)}</span>
            <button
              type="button"
              onClick={() => setTab('investors')}
              className="font-bold text-[#0f3a5c] hover:underline print:hidden"
            >
              Equity →
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────── COMPACT HEALTH & OPERATIONS STRIP ────────────────── */}
      <section className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:grid-cols-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
            <TrendingUp size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operating Margin</p>
            <p className="text-sm font-bold tabular-nums text-slate-900">{profitMarginNum.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
            <Building2 size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Months Tracked</p>
            <p className="text-sm font-bold tabular-nums text-slate-900">{pnlRows.length} months</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setTab('investors')}
          className="flex items-center gap-3 rounded-xl px-1.5 py-0.5 text-left transition hover:bg-slate-50"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
            <PiggyBank size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Partner Capital Pool</p>
            <p className="text-sm font-bold tabular-nums text-slate-900">
              {formatBdt(summary.investorTotal ?? 0)}{' '}
              <span className="text-[11px] font-medium text-slate-400">({summary.investorCount ?? 0} entries)</span>
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setTab('payroll')}
          className="flex items-center gap-3 rounded-xl px-1.5 py-0.5 text-left transition hover:bg-slate-50"
        >
          <div
            className={`grid size-8 shrink-0 place-items-center rounded-lg ${
              (summary.payrollPendingCount ?? 0) > 0
                ? 'bg-amber-50 text-amber-700'
                : 'bg-emerald-50 text-[#0b7a53]'
            }`}
          >
            <Banknote size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payroll Status</p>
            <p className="truncate text-sm font-bold tabular-nums text-slate-900">
              {(summary.payrollPendingCount ?? 0) > 0
                ? `${summary.payrollPendingCount} pending · ${formatBdt(summary.payrollPendingAmount)}`
                : 'All settled'}
            </p>
          </div>
        </button>
      </section>

      {/* ────────────────── INSTITUTIONAL UNDERLINE TAB BAR ────────────────── */}
      <div className="-mx-3.5 border-b border-slate-200 px-3.5 sm:mx-0 sm:px-0 print:hidden">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Finance sections">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-bold transition ${
                  active
                    ? 'border-[#0f3a5c] text-[#0f3a5c]'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                <Icon size={14} className={active ? 'text-[#0f3a5c]' : 'text-slate-400 group-hover:text-slate-600'} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      active ? 'bg-[#0f3a5c]/10 text-[#0f3a5c]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ══════════════════ 1. OVERVIEW TAB ══════════════════ */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Monthly Cash Inflow vs. Outflow</h2>
                  <p className="text-xs text-slate-500">Click any month column to drill into its statement</p>
                </div>
              </div>
              <MonthlyIncomeExpenseChart
                rows={pnlRows}
                onSelectMonth={(m) => {
                  setCashflowMonth(m);
                  setTab('cashflow');
                }}
              />
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="mb-3">
                <h2 className="text-sm font-bold text-slate-900">Cumulative Cash Reserve Trajectory</h2>
                <p className="text-xs text-slate-500">Rolling cumulative surplus alongside monthly net result</p>
              </div>
              <CumulativeProfitChart rows={pnlRows} />
            </div>
          </div>

          {/* Diverging Net Variance */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <MonthlyNetDivergingChart rows={pnlRows.map((r) => ({ month: r.month, net: r.profit }))} />
          </div>

          {/* Interactive Donut Breakdowns */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DonutBreakdownCard
              title="Revenue Mix by Category"
              subtitle={`Breakdown for ${periodLabel}`}
              total={summary.income.sum}
              rows={incomeByCategory}
              tone="emerald"
            />
            <DonutBreakdownCard
              title="Expense Allocation by Category"
              subtitle={`Breakdown for ${periodLabel}`}
              total={summary.expenses.sum}
              rows={expenseByCategory}
              tone="rose"
            />
          </div>

          {/* Audited Monthly P&L Statement */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Monthly Profit &amp; Loss Statement</h2>
                <p className="text-xs text-slate-500">
                  Cash-basis operating income vs. expenditure across {sortedPnlDesc.length} accounting periods
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 tabular-nums">
                Overall Margin: {pnlOverallMargin}%
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Accounting Period</th>
                    <th className="px-4 py-3 text-right">Cash Inflow</th>
                    <th className="px-4 py-3 text-right">Disbursements</th>
                    <th className="px-4 py-3 text-right">Net Surplus / Deficit</th>
                    <th className="px-4 py-3 text-right">Margin</th>
                    <th className="px-4 py-3 text-right">Cumulative Reserve</th>
                    <th className="px-5 py-3 text-right print:hidden">Statement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPnlDesc.map((r) => (
                    <tr key={r.month} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {formatMonthLabel(r.month)}
                        <span className="ml-2 font-mono text-[10px] font-normal text-slate-400">{r.month}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#0b7a53]">
                        {formatBdt(r.income)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-rose-700">
                        {formatBdt(r.expense)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold tabular-nums ${
                          r.profit >= 0 ? 'text-[#0f3a5c]' : 'text-rose-700'
                        }`}
                      >
                        {r.profit >= 0 ? '+' : ''}
                        {formatBdt(r.profit)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            r.margin >= 20
                              ? 'bg-emerald-50 text-emerald-800'
                              : r.margin >= 0
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {r.margin}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                        {formatBdt(r.cumulative)}
                      </td>
                      <td className="px-5 py-3 text-right print:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setCashflowMonth(r.month);
                            setTab('cashflow');
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#0f3a5c] transition hover:border-[#0f3a5c]/30 hover:bg-blue-50"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {sortedPnlDesc.length > 0 && (
                  <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                    <tr>
                      <td className="px-5 py-3.5 text-[11px] uppercase tracking-wider text-slate-600">
                        All-Time Total ({sortedPnlDesc.length} months)
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-[#0b7a53]">{formatBdt(pnlTotalIn)}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-rose-700">{formatBdt(pnlTotalOut)}</td>
                      <td
                        className={`px-4 py-3.5 text-right tabular-nums ${
                          pnlTotalNet >= 0 ? 'text-[#0f3a5c]' : 'text-rose-700'
                        }`}
                      >
                        {pnlTotalNet >= 0 ? '+' : ''}
                        {formatBdt(pnlTotalNet)}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-slate-700">{pnlOverallMargin}%</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-slate-900">
                        <div>{formatBdt(pnlTotalNet)}</div>
                        {summary.cashInitial !== 0 && (
                          <div className="text-[10px] font-medium text-slate-500">
                            Cash: {formatBdt(summary.liveBalance)}
                          </div>
                        )}
                      </td>
                      <td className="print:hidden" />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ 2. CASHFLOW STATEMENT TAB ══════════════════ */}
      {tab === 'cashflow' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setCashflowMonth((m) => shiftMonth(m, -1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft size={15} />
              </button>
              <input
                type="month"
                value={cashflowMonth}
                onChange={(e) => e.target.value && setCashflowMonth(e.target.value)}
                className="cursor-pointer bg-transparent px-2 py-1 text-xs font-bold text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setCashflowMonth((m) => shiftMonth(m, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight size={15} />
              </button>
              <span className="border-l border-slate-200 pl-2.5 pr-2 text-xs font-semibold text-slate-600">
                {formatMonthLabel(cashflowMonth)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1">
                <button
                  type="button"
                  onClick={() => setCashflowView('statement')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    cashflowView === 'statement' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ListOrdered size={13} /> Bank Statement
                </button>
                <button
                  type="button"
                  onClick={() => setCashflowView('split')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    cashflowView === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Columns2 size={13} /> Side-by-Side
                </button>
              </div>
              <button
                type="button"
                onClick={() => setEntryModal({ kind: 'income', defaultDate: `${cashflowMonth}-01` })}
                className="inline-flex items-center gap-1 rounded-xl bg-[#0b7a53] px-3 py-2 text-xs font-bold text-white hover:bg-[#096845]"
              >
                <Plus size={13} /> Credit
              </button>
              <button
                type="button"
                onClick={() => setEntryModal({ kind: 'expense', defaultDate: `${cashflowMonth}-01` })}
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100"
              >
                <Plus size={13} /> Debit
              </button>
            </div>
          </div>

          {!cashflowData ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Loading cashflow statement...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <StatCard icon={<Wallet size={15} />} label="Opening Balance" value={formatBdt(cashflowData.opening)} tone="slate" />
                <StatCard
                  icon={<ArrowDownLeft size={15} />}
                  label="Total Credits (In)"
                  value={formatBdt(cashflowData.totals.in)}
                  sub={`${cashflowData.income.length} receipts`}
                  tone="emerald"
                />
                <StatCard
                  icon={<ArrowUpRight size={15} />}
                  label="Total Debits (Out)"
                  value={formatBdt(cashflowData.totals.out)}
                  sub={`${cashflowData.expense.length} payouts`}
                  tone="rose"
                />
                <StatCard
                  icon={<Activity size={15} />}
                  label="Net Movement"
                  value={`${cashflowData.totals.net >= 0 ? '+' : ''}${formatBdt(cashflowData.totals.net)}`}
                  tone={cashflowData.totals.net >= 0 ? 'navy' : 'rose'}
                />
                <StatCard
                  icon={<PiggyBank size={15} />}
                  label="Closing Balance"
                  value={formatBdt(cashflowData.totals.closing)}
                  tone={cashflowData.totals.closing >= 0 ? 'emerald' : 'rose'}
                />
              </div>

              {cashflowView === 'statement' ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Cashbook Statement — {formatMonthLabel(cashflowData.month)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Chronological bank-style statement · Click any transaction row to edit
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {unifiedStatementRows.length} transactions
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-3 py-3 text-left">Category</th>
                          <th className="px-3 py-3 text-left">Particulars / Counterparty</th>
                          <th className="px-3 py-3 text-left">Reference</th>
                          <th className="px-3 py-3 text-right">Debit (Out)</th>
                          <th className="px-3 py-3 text-right">Credit (In)</th>
                          <th className="px-4 py-3 text-right">Running Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Opening Balance Row */}
                        <tr className="bg-slate-50/70 font-semibold text-slate-600">
                          <td className="px-4 py-2.5 font-mono text-[11px]">{cashflowData.month}-01</td>
                          <td className="px-3 py-2.5">
                            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Opening B/F
                            </span>
                          </td>
                          <td className="px-3 py-2.5 italic">Balance brought forward from prior periods</td>
                          <td className="px-3 py-2.5">—</td>
                          <td className="px-3 py-2.5 text-right">—</td>
                          <td className="px-3 py-2.5 text-right">—</td>
                          <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                            {formatBdt(cashflowData.opening)}
                          </td>
                        </tr>

                        {unifiedStatementRows.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No cashbook movements recorded in {formatMonthLabel(cashflowData.month)}.
                            </td>
                          </tr>
                        ) : (
                          unifiedStatementRows.map((row) => (
                            <tr
                              key={row.key}
                              onClick={() => setEntryModal({ kind: row.kind, record: row.raw })}
                              className="cursor-pointer transition hover:bg-blue-50/40"
                            >
                              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-500">
                                {row.date}
                              </td>
                              <td className="px-3 py-2.5">
                                <span
                                  className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${categoryBadgeTone(
                                    row.category,
                                    row.kind,
                                  )}`}
                                >
                                  {row.category || 'Uncategorised'}
                                </span>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="font-semibold text-slate-900">{row.party || '—'}</div>
                                {(row.studentName || row.leadRef || row.notes) && (
                                  <div className="mt-0.5 max-w-[300px] truncate text-[11px] text-slate-500">
                                    {row.studentName ? `${row.studentName}` : ''}
                                    {row.leadRef ? ` (${row.leadRef})` : ''}
                                    {row.notes ? ` · ${row.notes}` : ''}
                                  </div>
                                )}
                              </td>
                              <td className="max-w-[130px] truncate px-3 py-2.5 text-slate-500">
                                {row.reference || row.employeeName || '—'}
                              </td>
                              <td className="px-3 py-2.5 text-right font-bold tabular-nums text-rose-700">
                                {row.debit > 0 ? formatBdt(row.debit) : <span className="font-normal text-slate-300">—</span>}
                              </td>
                              <td className="px-3 py-2.5 text-right font-bold tabular-nums text-[#0b7a53]">
                                {row.credit > 0 ? formatBdt(row.credit) : <span className="font-normal text-slate-300">—</span>}
                              </td>
                              <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                                {formatBdt(row.running)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-slate-600">
                            Closing Balance ({formatMonthLabel(cashflowData.month)})
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums text-rose-700">
                            {formatBdt(cashflowData.totals.out)}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums text-[#0b7a53]">
                            {formatBdt(cashflowData.totals.in)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-[#071c2e]">
                            {formatBdt(cashflowData.totals.closing)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {/* Side-by-side Credit Card */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/70 px-4 py-3">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                        <ArrowDownLeft size={15} /> Cash Inflow · {cashflowData.income.length}
                      </span>
                      <span className="font-heading text-sm font-bold tabular-nums text-[#0b7a53]">
                        {formatBdt(cashflowData.totals.in)}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                          <tr>
                            <th className="px-3 py-2.5 text-left">Date</th>
                            <th className="px-3 py-2.5 text-left">Category</th>
                            <th className="px-3 py-2.5 text-left">Client</th>
                            <th className="px-3 py-2.5 text-right">Amount</th>
                            <th className="px-3 py-2.5 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cashflowData.income.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-10 text-center italic text-slate-400">
                                No inflow entries
                              </td>
                            </tr>
                          ) : (
                            cashflowData.income.map((r) => (
                              <tr
                                key={r.id}
                                onClick={() => setEntryModal({ kind: 'income', record: r })}
                                className="cursor-pointer hover:bg-slate-50"
                              >
                                <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-500">{r.date}</td>
                                <td className="px-3 py-2 font-semibold text-slate-800">{r.category || '—'}</td>
                                <td className="max-w-[140px] truncate px-3 py-2 text-slate-600">{r.clientName || '—'}</td>
                                <td className="px-3 py-2 text-right font-bold tabular-nums text-[#0b7a53]">
                                  {formatBdt(r.amount)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                                  {formatBdt(r.running)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Side-by-side Debit Card */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/70 px-4 py-3">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-900">
                        <ArrowUpRight size={15} /> Disbursements · {cashflowData.expense.length}
                      </span>
                      <span className="font-heading text-sm font-bold tabular-nums text-rose-700">
                        {formatBdt(cashflowData.totals.out)}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                          <tr>
                            <th className="px-3 py-2.5 text-left">Date</th>
                            <th className="px-3 py-2.5 text-left">Category</th>
                            <th className="px-3 py-2.5 text-left">Paid To</th>
                            <th className="px-3 py-2.5 text-right">Amount</th>
                            <th className="px-3 py-2.5 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cashflowData.expense.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-10 text-center italic text-slate-400">
                                No disbursements
                              </td>
                            </tr>
                          ) : (
                            cashflowData.expense.map((r) => (
                              <tr
                                key={r.id}
                                onClick={() => setEntryModal({ kind: 'expense', record: r })}
                                className="cursor-pointer hover:bg-slate-50"
                              >
                                <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-500">{r.date}</td>
                                <td className="px-3 py-2 font-semibold text-slate-800">{r.category || '—'}</td>
                                <td className="max-w-[140px] truncate px-3 py-2 text-slate-600">{r.paidTo || '—'}</td>
                                <td className="px-3 py-2 text-right font-bold tabular-nums text-rose-700">
                                  {formatBdt(r.amount)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                                  {formatBdt(r.running)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <DonutBreakdownCard
                  title="Inflow Breakdown"
                  total={cashflowData.totals.in}
                  rows={cashflowData.byCategory.income}
                  tone="emerald"
                />
                <DonutBreakdownCard
                  title="Spend Breakdown"
                  total={cashflowData.totals.out}
                  rows={cashflowData.byCategory.expense}
                  tone="rose"
                />
                <HorizontalShareCard
                  title="Inflow by Reference"
                  total={cashflowData.totals.in}
                  rows={cashflowData.incomeByReference}
                  tone="navy"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════ 3. INCOME LEDGER TAB ══════════════════ */}
      {tab === 'income' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <DonutBreakdownCard
                title="Income by Category"
                subtitle={`${periodLabel} · ${summary.income.total} receipts`}
                total={summary.income.sum}
                rows={incomeByCategory}
                tone="emerald"
              />
            </div>

            <div className="space-y-3 xl:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={incomeSearch}
                      onChange={(e) => setIncomeSearch(e.target.value)}
                      placeholder="Search client, student, ref..."
                      className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium outline-none focus:border-[#0f3a5c] focus:bg-white"
                    />
                  </div>
                  <select
                    value={incomeCatFilter}
                    onChange={(e) => setIncomeCatFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#0f3a5c] focus:bg-white"
                  >
                    <option value="">All Categories</option>
                    {incomeByCategory.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                  <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs">
                    <SlidersHorizontal size={12} className="text-slate-400" />
                    <select
                      value={incomeSort}
                      onChange={(e) => setIncomeSort(e.target.value as SortOption)}
                      className="bg-transparent font-semibold text-slate-700 outline-none"
                    >
                      <option value="date_desc">Date: Newest</option>
                      <option value="date_asc">Date: Oldest</option>
                      <option value="amount_desc">Amount: High → Low</option>
                      <option value="amount_asc">Amount: Low → High</option>
                    </select>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={includeExcluded}
                      onChange={(e) => setIncludeExcluded(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Include pre-data capital
                  </label>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleExportCsv('income')}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <FileSpreadsheet size={13} /> CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryModal({ kind: 'income' })}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#0b7a53] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#096845]"
                  >
                    <Plus size={13} /> Add Income
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Client / Student</th>
                        <th className="px-3 py-3 text-left">Reference</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIncome.slice(0, incomeLimit).map((r) => (
                        <tr key={r.id} className="transition hover:bg-slate-50/80">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-500">{r.date}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${categoryBadgeTone(
                                r.category,
                                'income',
                              )}`}
                            >
                              {r.category || 'Uncategorised'}
                            </span>
                            {r.excludeFromCash && (
                              <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-700">
                                PRE-DATA
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-semibold text-slate-900">{r.clientName || '—'}</div>
                            {(r.studentName || r.leadRef) && (
                              <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#0f3a5c]">
                                <GraduationCap size={11} />
                                {r.studentName}
                                {r.leadRef ? ` · ${r.leadRef}` : ''}
                              </div>
                            )}
                            {r.notes && <p className="mt-0.5 max-w-[240px] truncate text-[10px] text-slate-400">{r.notes}</p>}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            <div className="max-w-[130px] truncate">{r.reference || '—'}</div>
                            {r.employeeName && <div className="text-[10px] text-slate-400">{r.employeeName}</div>}
                          </td>
                          <td className="px-3 py-3 text-right font-bold tabular-nums text-[#0b7a53]">
                            {formatBdt(r.amount)}
                          </td>
                          <td className="px-4 py-3 text-right print:hidden">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEntryModal({ kind: 'income', record: r })}
                                className="rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-[#0f3a5c]"
                                title="Edit entry"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Delete this income entry?')) {
                                    void handleDeleteEntry('income', r.id).catch((err) =>
                                      showNotice('err', err instanceof Error ? err.message : 'Could not delete entry.'),
                                    );
                                  }
                                }}
                                className="rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete entry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredIncome.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No income entries match your current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-slate-600">
                          Total ({filteredIncome.length} matching entries)
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-[#0b7a53]">
                          {formatBdt(filteredIncome.reduce((s, r) => s + (r.amount || 0), 0))}
                        </td>
                        <td className="print:hidden" />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {filteredIncome.length > incomeLimit && (
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs print:hidden">
                    <span className="text-slate-500">
                      Showing {incomeLimit} of {filteredIncome.length} entries
                    </span>
                    <button
                      type="button"
                      onClick={() => setIncomeLimit(filteredIncome.length)}
                      className="font-bold text-[#0f3a5c] hover:underline"
                    >
                      Show all {filteredIncome.length} entries
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ 4. EXPENSE LEDGER TAB ══════════════════ */}
      {tab === 'expenses' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <DonutBreakdownCard
                title="Expenses by Category"
                subtitle={`${periodLabel} · ${summary.expenses.total} disbursements`}
                total={summary.expenses.sum}
                rows={expenseByCategory}
                tone="rose"
              />
            </div>

            <div className="space-y-3 xl:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      placeholder="Search payee, student, ref..."
                      className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium outline-none focus:border-[#0f3a5c] focus:bg-white"
                    />
                  </div>
                  <select
                    value={expenseCatFilter}
                    onChange={(e) => setExpenseCatFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#0f3a5c] focus:bg-white"
                  >
                    <option value="">All Categories</option>
                    {expenseByCategory.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.count})
                      </option>
                    ))}
                  </select>
                  <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs">
                    <SlidersHorizontal size={12} className="text-slate-400" />
                    <select
                      value={expenseSort}
                      onChange={(e) => setExpenseSort(e.target.value as SortOption)}
                      className="bg-transparent font-semibold text-slate-700 outline-none"
                    >
                      <option value="date_desc">Date: Newest</option>
                      <option value="date_asc">Date: Oldest</option>
                      <option value="amount_desc">Amount: High → Low</option>
                      <option value="amount_asc">Amount: Low → High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleExportCsv('expense')}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <FileSpreadsheet size={13} /> CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryModal({ kind: 'expense' })}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100"
                  >
                    <Plus size={13} /> Add Expense
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Payee / Student</th>
                        <th className="px-3 py-3 text-left">Reference</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredExpenses.slice(0, expenseLimit).map((r) => (
                        <tr key={r.id} className="transition hover:bg-slate-50/80">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-500">{r.date}</td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${categoryBadgeTone(
                                r.category,
                                'expense',
                              )}`}
                            >
                              {r.category || 'Uncategorised'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-semibold text-slate-900">{r.paidTo || '—'}</div>
                            {r.studentName && (
                              <span className="mt-0.5 inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#0f3a5c]">
                                <GraduationCap size={10} />
                                {r.studentName}
                                {r.leadRef ? ` · ${r.leadRef}` : ''}
                              </span>
                            )}
                            {r.notes && <p className="mt-0.5 max-w-[240px] truncate text-[10px] text-slate-400">{r.notes}</p>}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            <div className="max-w-[130px] truncate">{r.reference || '—'}</div>
                            {r.employeeName && <div className="text-[10px] text-slate-400">{r.employeeName}</div>}
                          </td>
                          <td className="px-3 py-3 text-right font-bold tabular-nums text-rose-700">
                            {formatBdt(r.amount)}
                          </td>
                          <td className="px-4 py-3 text-right print:hidden">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEntryModal({ kind: 'expense', record: r })}
                                className="rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-[#0f3a5c]"
                                title="Edit entry"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Delete this expense entry?')) {
                                    void handleDeleteEntry('expense', r.id).catch((err) =>
                                      showNotice('err', err instanceof Error ? err.message : 'Could not delete entry.'),
                                    );
                                  }
                                }}
                                className="rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete entry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredExpenses.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No expense entries match your current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right text-[11px] uppercase tracking-wider text-slate-600">
                          Total ({filteredExpenses.length} matching entries)
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-rose-700">
                          {formatBdt(filteredExpenses.reduce((s, r) => s + (r.amount || 0), 0))}
                        </td>
                        <td className="print:hidden" />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {filteredExpenses.length > expenseLimit && (
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs print:hidden">
                    <span className="text-slate-500">
                      Showing {expenseLimit} of {filteredExpenses.length} disbursements
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setExpenseLimit((n) => n + 50)}
                        className="font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Load +50
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpenseLimit(filteredExpenses.length)}
                        className="font-bold text-[#0f3a5c] hover:underline"
                      >
                        Show all {filteredExpenses.length}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ 5. STUDENT FINANCIAL LEDGER TAB ══════════════════ */}
      {tab === 'student' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#0f3a5c]">
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-slate-900">Student Account &amp; File Ledger</h2>
                <p className="text-xs text-slate-500">
                  Audit every service charge, file opening fee, air ticket, visa fee, and referral payout per student
                </p>
              </div>
            </div>

            <div className="relative mt-4 max-w-2xl">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void searchStudentLedger();
                }}
                placeholder="Search by student name, Lead ID (e.g. L-00075, LEAD-0417), or phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-28 text-sm font-medium text-slate-900 outline-none focus:border-[#0f3a5c] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {studentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentQuery('');
                    setStudentResult(null);
                  }}
                  className="absolute right-24 top-2.5 rounded p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => searchStudentLedger()}
                disabled={studentLoading}
                className="absolute right-1.5 top-1.5 rounded-lg bg-[#0f3a5c] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#12436b]"
              >
                {studentLoading ? 'Searching...' : 'Lookup'}
              </button>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent Files:</span>
              {quickStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStudentQuery(s.name);
                    void searchStudentLedger(s.name);
                  }}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-[#0f3a5c]/30 hover:bg-blue-50 hover:text-[#0f3a5c]"
                >
                  {s.name}
                  {s.leadRef ? ` · ${s.leadRef}` : ''}
                </button>
              ))}
            </div>
          </div>

          {studentResult ? (
            <div className="space-y-4">
              {studentResult.student && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="grid size-11 place-items-center rounded-xl bg-[#071c2e] font-heading text-sm font-bold text-white">
                      {initialsOf(studentResult.student.name)}
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-slate-900">{studentResult.student.name}</h3>
                      <p className="text-xs text-slate-500">
                        {studentResult.student.country}
                        {studentResult.student.university ? ` · ${studentResult.student.university}` : ''}
                        {studentResult.student.phone ? ` · ${studentResult.student.phone}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-[#0f3a5c]">
                    Stage: {studentResult.student.applicationStage.replace(/_/g, ' ')}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard icon={<ArrowDownLeft size={15} />} label="Total Received" value={formatBdt(studentResult.totals.income)} tone="emerald" />
                <StatCard icon={<ArrowUpRight size={15} />} label="Total Disbursed" value={formatBdt(studentResult.totals.expense)} tone="rose" />
                <StatCard
                  icon={<Activity size={15} />}
                  label="Net File Margin"
                  value={`${studentResult.totals.net >= 0 ? '+' : ''}${formatBdt(studentResult.totals.net)}`}
                  tone={studentResult.totals.net >= 0 ? 'navy' : 'rose'}
                />
                <StatCard icon={<Receipt size={15} />} label="Ledger Entries" value={String(studentResult.totals.count)} tone="slate" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Type</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Counterparty</th>
                        <th className="px-3 py-3 text-left">Ref / Lead ID</th>
                        <th className="px-3 py-3 text-left">Handled By</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-right">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentResult.transactions.map((t) => (
                        <tr key={`${t.kind}-${t.id}`} className="hover:bg-slate-50/80">
                          <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-slate-500">{t.date}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                t.kind === 'income'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                  : 'border-rose-200 bg-rose-50 text-rose-800'
                              }`}
                            >
                              {t.kind === 'income' ? 'CREDIT' : 'DEBIT'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-slate-800">{t.category || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-700">
                            {t.kind === 'income' ? t.clientName || '—' : t.paidTo || '—'}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500">{t.leadRef || t.reference || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-600">{t.employeeName || '—'}</td>
                          <td
                            className={`px-3 py-2.5 text-right font-bold tabular-nums ${
                              t.kind === 'income' ? 'text-[#0b7a53]' : 'text-rose-700'
                            }`}
                          >
                            {t.kind === 'income' ? '+' : '-'}
                            {formatBdt(t.amount)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => setEntryModal({ kind: t.kind, record: t })}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#0f3a5c]"
                            >
                              <Pencil size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {studentResult.transactions.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            No financial transactions matched &quot;{studentQuery}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Search size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Enter a student name or Lead ID to audit their ledger</p>
              <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
                Try searching by legacy CRM Lead Ref (e.g. L-00075, LEAD-0417) or pick any recent student above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ 6. ANNUAL VIEW TAB ══════════════════ */}
      {tab === 'year' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setYearVal((y) => y - 1)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-1 font-heading text-sm font-bold text-slate-900">{yearVal} Fiscal Calendar</span>
              <button
                type="button"
                onClick={() => setYearVal((y) => y + 1)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {!yearData ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Loading {yearVal} annual statement...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard icon={<Wallet size={15} />} label="Opening Liquidity" value={formatBdt(yearData.opening)} tone="slate" />
                <StatCard
                  icon={<ArrowDownLeft size={15} />}
                  label={`${yearData.year} Cash In`}
                  value={formatBdt(yearData.rows.reduce((s, r) => s + r.income, 0))}
                  tone="emerald"
                />
                <StatCard
                  icon={<ArrowUpRight size={15} />}
                  label={`${yearData.year} Cash Out`}
                  value={formatBdt(yearData.rows.reduce((s, r) => s + r.expense, 0))}
                  tone="rose"
                />
                <StatCard
                  icon={<PiggyBank size={15} />}
                  label="Year-End Closing"
                  value={formatBdt(yearData.closing)}
                  tone={yearData.closing >= yearData.opening ? 'emerald' : 'amber'}
                />
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <YearCashTrendChart rows={yearData.rows} />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3 text-left">Month</th>
                        <th className="px-4 py-3 text-right">Opening</th>
                        <th className="px-4 py-3 text-right">Cash In</th>
                        <th className="px-4 py-3 text-right">Cash Out</th>
                        <th className="px-4 py-3 text-right">Net Movement</th>
                        <th className="px-5 py-3 text-right">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {yearData.rows.map((r) => (
                        <tr
                          key={r.month}
                          onClick={() => {
                            setCashflowMonth(r.month);
                            setTab('cashflow');
                          }}
                          className="cursor-pointer transition hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-2.5 font-semibold text-slate-900">{formatMonthLabel(r.month)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">{formatBdt(r.opening)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-[#0b7a53]">
                            {r.income ? formatBdt(r.income) : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-rose-700">
                            {r.expense ? formatBdt(r.expense) : <span className="text-slate-300">—</span>}
                          </td>
                          <td
                            className={`px-4 py-2.5 text-right font-bold tabular-nums ${
                              r.net > 0 ? 'text-[#0b7a53]' : r.net < 0 ? 'text-rose-700' : 'text-slate-400'
                            }`}
                          >
                            {r.net !== 0 ? `${r.net > 0 ? '+' : ''}${formatBdt(r.net)}` : '—'}
                          </td>
                          <td className="px-5 py-2.5 text-right font-bold tabular-nums text-slate-900">
                            {formatBdt(r.closing)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                      <tr>
                        <td className="px-5 py-3 text-[11px] uppercase tracking-wider text-slate-600">
                          {yearData.year} Totals
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-600">{formatBdt(yearData.opening)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#0b7a53]">
                          {formatBdt(yearData.rows.reduce((s, r) => s + r.income, 0))}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-rose-700">
                          {formatBdt(yearData.rows.reduce((s, r) => s + r.expense, 0))}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#0f3a5c]">
                          {formatBdt(yearData.closing - yearData.opening)}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-[#071c2e]">{formatBdt(yearData.closing)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════ 7. INVESTORS & EQUITY TAB ══════════════════ */}
      {tab === 'investors' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-700">
                <PiggyBank size={22} />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">Partner Equity &amp; Capital Ledger</h2>
                <p className="text-xs text-slate-500">
                  Total contributed capital, historical pre-ledger injections, and annual September profit distribution split
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInvestmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#12436b]"
            >
              <Plus size={14} /> Record Investment
            </button>
          </div>

          {!investorsData ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Loading partner capital ledger...
            </div>
          ) : (
            <>
              {/* Partner Equity Cards with Live Surplus Share Projection */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {PROFIT_SHARES.map((partner) => {
                  const personRow = investorsData.byPerson.find(
                    (p) => p.name.toLowerCase() === partner.name.toLowerCase(),
                  );
                  const contributed = personRow?.amount ?? 0;
                  const shareOfCapital = investorsData.total > 0 ? (contributed / investorsData.total) * 100 : 0;
                  const projectedShare = Math.max(0, summary.liveBalance) * (partner.pct / 100);
                  const accentBar =
                    partner.tone === 'blue'
                      ? 'bg-[#0f3a5c]'
                      : partner.tone === 'violet'
                        ? 'bg-violet-600'
                        : 'bg-amber-500';
                  const pillCls =
                    partner.tone === 'blue'
                      ? 'bg-blue-50 text-[#0f3a5c] border-blue-200'
                      : partner.tone === 'violet'
                        ? 'bg-violet-50 text-violet-800 border-violet-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200';

                  return (
                    <div
                      key={partner.name}
                      className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                    >
                      <div className={`h-1 w-full ${accentBar}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-xs font-bold text-slate-800">
                              {initialsOf(partner.name)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">{partner.name}</h3>
                              <p className="text-[11px] text-slate-500">
                                {personRow?.count ?? 0} capital entries
                              </p>
                            </div>
                          </div>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${pillCls}`}>
                            {partner.pct}% Equity
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capital In</p>
                            <p className="mt-0.5 font-heading text-base font-bold tabular-nums text-slate-900">
                              {formatBdt(contributed)}
                            </p>
                            <p className="text-[10px] text-slate-500">{shareOfCapital.toFixed(1)}% of pool</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cash Surplus Share</p>
                            <p className="mt-0.5 font-heading text-base font-bold tabular-nums text-[#0b7a53]">
                              {formatBdt(projectedShare)}
                            </p>
                            <p className="text-[10px] text-slate-500">At current cash book</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Capital Contribution Register</h3>
                    <p className="text-xs text-slate-500">
                      Combined partner equity injected: <strong className="text-slate-900">{formatBdt(investorsData.total)}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {investorsData.contributions.length} verified entries
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Partner / Investor</th>
                        <th className="px-3 py-3 text-left">Reference</th>
                        <th className="px-3 py-3 text-left">Accounting Book</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-3 py-3 text-left">Notes</th>
                        <th className="px-5 py-3 text-right print:hidden">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {investorsData.contributions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="whitespace-nowrap px-5 py-3 font-mono text-[11px] text-slate-500">{c.date}</td>
                          <td className="px-3 py-3 font-semibold text-slate-900">{c.clientName || '—'}</td>
                          <td className="px-3 py-3 text-slate-600">{c.reference || '—'}</td>
                          <td className="px-3 py-3">
                            {c.excludeFromCash ? (
                              <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                Pre-Ledger Historical
                              </span>
                            ) : (
                              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                Active Cashbook
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right font-bold tabular-nums text-violet-700">
                            {formatBdt(c.amount)}
                          </td>
                          <td className="max-w-[240px] truncate px-3 py-3 text-slate-500">{c.notes || '—'}</td>
                          <td className="px-5 py-3 text-right print:hidden">
                            <button
                              type="button"
                              onClick={() => setEntryModal({ kind: 'income', record: c })}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-[#0f3a5c]"
                              title="Edit contribution"
                            >
                              <Pencil size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={4} className="px-5 py-3 text-right text-[11px] uppercase tracking-wider text-slate-600">
                          Total Capital Pool
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-violet-800">
                          {formatBdt(investorsData.total)}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════ 8. PAYROLL TAB ══════════════════ */}
      {tab === 'payroll' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setPayrollMonth((m) => shiftMonth(m, -1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="month"
                value={payrollMonth}
                onChange={(e) => e.target.value && setPayrollMonth(e.target.value)}
                className="cursor-pointer bg-transparent px-2 py-1 text-xs font-bold text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setPayrollMonth((m) => shiftMonth(m, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight size={16} />
              </button>
              <span className="border-l border-slate-200 pl-2.5 pr-2 text-xs font-semibold text-slate-600">
                {formatMonthLabel(payrollMonth)}
              </span>
            </div>

            {payrollData && (
              <span className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
                Standard working days: <strong className="text-slate-900">{payrollData.workingDays} days</strong>
              </span>
            )}
          </div>

          {!payrollData ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
              Loading monthly payroll register...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard icon={<Users size={15} />} label="Base Salaries" value={formatBdt(payrollData.totals.base)} tone="slate" />
                <StatCard icon={<Banknote size={15} />} label="Total Net Payable" value={formatBdt(payrollData.totals.net)} tone="navy" />
                <StatCard icon={<CheckCircle2 size={15} />} label="Disbursed (Paid)" value={formatBdt(payrollData.totals.paid)} tone="emerald" />
                <StatCard icon={<TrendingDown size={15} />} label="Remaining Pending" value={formatBdt(payrollData.totals.pending)} tone="amber" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-3.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Payroll Register — {formatMonthLabel(payrollData.month)}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synchronized with active Employee roster. Marking an employee as Paid disburses salary to the Expense Ledger.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={payrollSyncing}
                    onClick={() => loadPayroll(payrollMonth)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
                    title="Re-sync payroll register with active Employee roster and attendance"
                  >
                    <RefreshCw size={12} className={payrollSyncing ? 'animate-spin' : ''} />
                    Sync with Employees
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Employee</th>
                        <th className="px-3 py-3 text-center">Attendance</th>
                        <th className="px-3 py-3 text-right">Base Salary</th>
                        <th className="px-3 py-3 text-right">Bonus</th>
                        <th className="px-3 py-3 text-right">Deductions</th>
                        <th className="px-3 py-3 text-right">Net Payable</th>
                        <th className="px-3 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payrollData.rows.map((row) => {
                        const edit = payrollEdits[row.id] || {};
                        const baseVal = edit.baseSalary !== undefined ? edit.baseSalary : String(row.baseSalary);
                        const bonusVal = edit.bonus !== undefined ? edit.bonus : String(row.bonus);
                        const dedVal = edit.deductions !== undefined ? edit.deductions : String(row.deductions);
                        const computedNet = Math.max(
                          0,
                          (Number(baseVal) || 0) + (Number(bonusVal) || 0) - (Number(dedVal) || 0),
                        );
                        const isDirty = Boolean(payrollEdits[row.id]);
                        const busy = payrollBusyId === row.id;

                        return (
                          <tr key={row.id} className="hover:bg-slate-50/80">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700">
                                  {initialsOf(row.name)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{row.name}</div>
                                  <div className="font-mono text-[10px] text-slate-400">{row.empId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                                {row.daysWorked}/{row.workingDays}d
                              </span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <input
                                type="number"
                                min="0"
                                value={baseVal}
                                onChange={(e) =>
                                  setPayrollEdits((prev) => ({
                                    ...prev,
                                    [row.id]: { ...prev[row.id], baseSalary: e.target.value },
                                  }))
                                }
                                className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-[#0f3a5c] focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <input
                                type="number"
                                min="0"
                                value={bonusVal}
                                onChange={(e) =>
                                  setPayrollEdits((prev) => ({
                                    ...prev,
                                    [row.id]: { ...prev[row.id], bonus: e.target.value },
                                  }))
                                }
                                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-[#0f3a5c] focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <input
                                type="number"
                                min="0"
                                value={dedVal}
                                onChange={(e) =>
                                  setPayrollEdits((prev) => ({
                                    ...prev,
                                    [row.id]: { ...prev[row.id], deductions: e.target.value },
                                  }))
                                }
                                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-[#0f3a5c] focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-3 text-right font-bold tabular-nums text-slate-900">
                              {formatBdt(computedNet)}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  row.status === 'paid'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                                }`}
                              >
                                {row.status}
                              </span>
                              {row.paidOn && <div className="mt-0.5 font-mono text-[10px] text-slate-400">{row.paidOn}</div>}
                            </td>
                            <td className="px-4 py-3 text-right print:hidden">
                              <div className="inline-flex items-center gap-1.5">
                                {isDirty && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSavePayrollRow(row)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-[#0f3a5c] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#12436b] disabled:opacity-50"
                                  >
                                    <Save size={11} /> Save
                                  </button>
                                )}
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handleTogglePayrollPaid(row)}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition disabled:opacity-50 ${
                                    row.status === 'paid'
                                      ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                                      : 'bg-[#0b7a53] text-white hover:bg-[#096845]'
                                  }`}
                                >
                                  {row.status === 'paid' ? 'Revert' : 'Mark Paid'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPayslipRecord(row)}
                                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                  title="View printable payslip"
                                >
                                  <Printer size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {entryModal && (
        <FinanceEntryModal
          kind={entryModal.kind}
          record={entryModal.record}
          defaultDate={entryModal.defaultDate}
          categories={entryModal.kind === 'income' ? summary.categories.income : summary.categories.expense}
          employees={summary.employees}
          students={summary.students}
          onClose={() => setEntryModal(null)}
          onSave={handleSaveEntry}
          onDelete={entryModal.record ? (id) => handleDeleteEntry(entryModal.kind, id) : undefined}
        />
      )}

      {openingModalOpen && (
        <OpeningCashModal
          currentBaseline={summary.cashInitial}
          currentLiveBalance={summary.liveBalance}
          onClose={() => setOpeningModalOpen(false)}
          onSave={handleSaveOpeningCash}
        />
      )}

      {investmentModalOpen && (
        <InvestmentEntryModal
          onClose={() => setInvestmentModalOpen(false)}
          onSave={handleSaveInvestment}
        />
      )}

      {payslipRecord && <PayslipModal record={payslipRecord} onClose={() => setPayslipRecord(null)} />}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone: 'slate' | 'emerald' | 'rose' | 'amber' | 'navy';
}) {
  const iconCls = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-50 text-[#0b7a53]',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    navy: 'bg-blue-50 text-[#0f3a5c]',
  }[tone];

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${iconCls}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-0.5 truncate font-heading text-lg font-bold tabular-nums text-slate-900">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

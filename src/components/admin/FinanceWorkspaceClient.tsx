'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Pencil,
  PiggyBank,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  PROFIT_SHARES,
  buildCategoryBreakdown,
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
  CategoryBreakdownCard,
  CumulativeProfitChart,
  MonthlyIncomeExpenseChart,
  YearCashTrendChart,
} from '@/components/admin/FinanceCharts';
import {
  FinanceEntryModal,
  InvestmentEntryModal,
  OpeningCashModal,
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

interface SummaryResponse {
  month: string;
  activeCashflowMonth: string;
  cashInitial: number;
  liveBalance: number;
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

export default function FinanceWorkspaceClient() {
  const { user, isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [tab, setTab] = useState<FinanceTab>('overview');

  // Empty string means All Time (shows all recovered historical records immediately)
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [includeExcluded, setIncludeExcluded] = useState<boolean>(false);

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // Sub-tab states
  const [cashflowMonth, setCashflowMonth] = useState<string>(() => dhakaCurrentMonth());
  const [cashflowData, setCashflowData] = useState<CashflowResponse | null>(null);
  const [cashflowLoading, setCashflowLoading] = useState(false);

  const [yearVal, setYearVal] = useState<number>(() => Number(dhakaCurrentMonth().slice(0, 4)));
  const [yearData, setYearData] = useState<YearResponse | null>(null);
  const [yearLoading, setYearLoading] = useState(false);

  const [investorsData, setInvestorsData] = useState<InvestorsResponse | null>(null);
  const [investorsLoading, setInvestorsLoading] = useState(false);

  const [studentQuery, setStudentQuery] = useState('');
  const [studentResult, setStudentResult] = useState<StudentTxResponse | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);

  const [payrollMonth, setPayrollMonth] = useState<string>(() => dhakaCurrentMonth());
  const [payrollData, setPayrollData] = useState<PayrollResponse | null>(null);
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [payrollEdits, setPayrollEdits] = useState<
    Record<string, { baseSalary?: string; bonus?: string; deductions?: string; notes?: string }>
  >({});
  const [payrollBusyId, setPayrollBusyId] = useState<string | null>(null);

  // Filters inside Income & Expense tabs
  const [incomeSearch, setIncomeSearch] = useState('');
  const [incomeCatFilter, setIncomeCatFilter] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCatFilter, setExpenseCatFilter] = useState('');

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
        const data: SummaryResponse = await res.json();
        setSummary(data);
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
      setCashflowLoading(true);
      try {
        const res = await authenticatedFetch(
          `/api/admin/finance/cashflow?month=${encodeURIComponent(targetMonth)}`,
        );
        if (res.ok) {
          setCashflowData(await res.json());
        }
      } finally {
        setCashflowLoading(false);
      }
    },
    [authenticatedFetch, cashflowMonth],
  );

  const loadYear = useCallback(
    async (targetYear = yearVal) => {
      setYearLoading(true);
      try {
        const res = await authenticatedFetch(`/api/admin/finance/year?year=${targetYear}`);
        if (res.ok) setYearData(await res.json());
      } finally {
        setYearLoading(false);
      }
    },
    [authenticatedFetch, yearVal],
  );

  const loadInvestors = useCallback(async () => {
    setInvestorsLoading(true);
    try {
      const res = await authenticatedFetch('/api/admin/finance/investors');
      if (res.ok) setInvestorsData(await res.json());
    } finally {
      setInvestorsLoading(false);
    }
  }, [authenticatedFetch]);

  const loadPayroll = useCallback(
    async (targetMonth = payrollMonth) => {
      setPayrollLoading(true);
      try {
        const res = await authenticatedFetch(
          `/api/admin/payroll?month=${encodeURIComponent(targetMonth)}`,
        );
        if (res.ok) {
          setPayrollData(await res.json());
          setPayrollEdits({});
        }
      } finally {
        setPayrollLoading(false);
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
        if (res.ok) {
          setStudentResult(await res.json());
        }
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
    if (!isAuthenticated || authLoading || user?.role === 'counselor') return;
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
    if (!isAuthenticated || authLoading || user?.role === 'counselor') return;
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
    showNotice('ok', id ? 'Financial entry updated.' : `${entryModal.kind === 'income' ? 'Income' : 'Expense'} recorded.`);
    await refreshActiveViews();
  };

  const handleDeleteEntry = async (kind: 'income' | 'expense', id: string) => {
    const base = kind === 'income' ? '/api/admin/finance/income' : '/api/admin/finance/expenses';
    const res = await authenticatedFetch(`${base}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Could not delete entry.');
    }
    setEntryModal(null);
    showNotice('ok', 'Financial entry deleted.');
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
      throw new Error(err.error || 'Could not update opening cash.');
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
      throw new Error(err.error || 'Could not record investment.');
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
        throw new Error(err.error || 'Failed to save payroll');
      }
      showNotice('ok', `Saved payroll for ${row.name}.`);
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
    const confirmMsg =
      nextStatus === 'paid'
        ? `Mark ${row.name}'s ${row.month} salary (${formatBdt(row.netPay)}) as PAID? This will automatically record a Salary expense in Finance.`
        : `Revert ${row.name}'s ${row.month} salary to PENDING and remove the linked Salary expense?`;
    if (!window.confirm(confirmMsg)) return;

    setPayrollBusyId(row.id);
    try {
      const res =
        nextStatus === 'paid'
          ? await authenticatedFetch(`/api/admin/payroll/${row.id}`, { method: 'POST' })
          : await authenticatedFetch(`/api/admin/payroll/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'pending' }),
            });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update payroll status');
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
    return incomeRows.filter((r) => {
      if (incomeCatFilter && (r.category || '') !== incomeCatFilter) return false;
      if (!q) return true;
      return [r.date, r.category, r.clientName, r.studentName, r.leadRef, r.reference, r.employeeName, r.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [incomeRows, incomeSearch, incomeCatFilter]);

  const filteredExpenses = useMemo(() => {
    const q = expenseSearch.trim().toLowerCase();
    return expenseRows.filter((r) => {
      if (expenseCatFilter && (r.category || '') !== expenseCatFilter) return false;
      if (!q) return true;
      return [r.date, r.category, r.paidTo, r.studentName, r.leadRef, r.reference, r.employeeName, r.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [expenseRows, expenseSearch, expenseCatFilter]);

  const quickStudents = useMemo(() => {
    const all = summary?.students ?? [];
    const q = studentQuery.trim().toLowerCase();
    if (!q) return all.slice(0, 12);
    return all
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.leadRef || '').toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [summary?.students, studentQuery]);

  const handleExportLedgerCsv = () => {
    if (!summary) return;
    const rows: Array<Array<unknown>> = [
      ...incomeRows.map((r) => [
        'INCOME',
        r.date,
        r.month,
        r.category || '',
        r.clientName || '',
        r.studentName || '',
        r.leadRef || '',
        r.reference || '',
        r.employeeName || '',
        r.amount,
        r.excludeFromCash ? 'Excluded (Pre-Data)' : 'Cash',
        r.notes || '',
      ]),
      ...expenseRows.map((r) => [
        'EXPENSE',
        r.date,
        r.month,
        r.category || '',
        r.paidTo || '',
        r.studentName || '',
        r.leadRef || '',
        r.reference || '',
        r.employeeName || '',
        -r.amount,
        'Cash',
        r.notes || '',
      ]),
    ].sort((a, b) => String(b[1]).localeCompare(String(a[1])));

    downloadCsv(
      `eduexpress-finance-${monthFilter || 'all-time'}.csv`,
      ['Type', 'Date', 'Month', 'Category', 'Client / Paid To', 'Student', 'Lead Ref', 'Reference', 'Handled By', 'Amount (BDT)', 'Cash Status', 'Notes'],
      rows,
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCw className="size-8 animate-spin text-[#0f3a5c]" />
          <p className="text-sm font-medium text-slate-600">Loading Financial Control Center...</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
        <h2 className="text-lg font-bold">Finance Ledger Unavailable</h2>
        <p className="mt-2 text-sm">{error || 'Unable to load financial data.'}</p>
        <button
          onClick={() => loadSummary()}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const netProfit = summary.income.sum - summary.expenses.sum;
  const profitMargin = summary.income.sum > 0 ? ((netProfit / summary.income.sum) * 100).toFixed(1) : '0.0';
  const periodLabel = monthFilter ? formatMonthLabel(monthFilter) : 'All Time';

  const TABS: Array<{ id: FinanceTab; label: string; icon: typeof LayoutDashboard }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Cashflow', icon: Receipt },
    { id: 'income', label: `Income (${summary.income.total})`, icon: ArrowDownCircle },
    { id: 'expenses', label: `Expenses (${summary.expenses.total})`, icon: ArrowUpCircle },
    { id: 'student', label: 'Student Ledger', icon: GraduationCap },
    { id: 'year', label: 'Year View', icon: Calendar },
    { id: 'investors', label: 'Investors', icon: PiggyBank },
    { id: 'payroll', label: 'Payroll', icon: Banknote },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Strategic Dark Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#081c2e] via-[#0f3a5c] to-[#0b2f45] p-6 text-white shadow-lg sm:p-7">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 size-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 -mb-16 -ml-16 size-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-2xl border border-white/15 bg-white/10">
                <Landmark size={22} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  Financial Control Center
                </h1>
                <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">
                  {summary.income.total} income entries · {summary.expenses.total} expense entries · Scope:{' '}
                  <strong className="text-white">{periodLabel}</strong>
                </p>
              </div>
            </div>

            {/* Period Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMonthFilter('')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  monthFilter === ''
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'border border-white/15 bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setMonthFilter(dhakaCurrentMonth())}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  monthFilter === dhakaCurrentMonth()
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'border border-white/15 bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                This Month
              </button>

              <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1">
                <button
                  type="button"
                  onClick={() => setMonthFilter(shiftMonth(monthFilter || dhakaCurrentMonth(), -1))}
                  className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={15} />
                </button>
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="cursor-pointer bg-transparent px-1.5 py-0.5 text-xs font-bold text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMonthFilter(shiftMonth(monthFilter || dhakaCurrentMonth(), 1))}
                  className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label="Next month"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => refreshActiveViews()}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-60"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Header 4-KPI Strip */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                <ArrowDownCircle size={13} className="text-emerald-400" />
                Total Income ({periodLabel})
              </div>
              <p className="mt-1.5 font-heading text-2xl font-bold tabular-nums">{formatBdt(summary.income.sum)}</p>
              <p className="mt-0.5 text-[11px] text-slate-300">{summary.income.total} cash entries</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                <ArrowUpCircle size={13} className="text-rose-400" />
                Total Expenses ({periodLabel})
              </div>
              <p className="mt-1.5 font-heading text-2xl font-bold tabular-nums">{formatBdt(summary.expenses.sum)}</p>
              <p className="mt-0.5 text-[11px] text-slate-300">{summary.expenses.total} expense entries</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                <TrendingUp size={13} className="text-cyan-300" />
                Net Profit ({periodLabel})
              </div>
              <p
                className={`mt-1.5 font-heading text-2xl font-bold tabular-nums ${
                  netProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {netProfit >= 0 ? '+' : ''}
                {formatBdt(netProfit)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-300">Operating margin {profitMargin}%</p>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                <Wallet size={13} className="text-amber-300" />
                Live Cash Position
              </div>
              <p className="mt-1.5 font-heading text-2xl font-bold tabular-nums text-white">
                {formatBdt(summary.liveBalance)}
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-200">
                Baseline opening: {formatBdt(summary.cashInitial)} · {summary.liveBalance >= 0 ? 'Healthy' : 'Deficit'}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEntryModal({ kind: 'income' })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-emerald-400"
            >
              <Plus size={14} /> Add Income
            </button>
            <button
              type="button"
              onClick={() => setEntryModal({ kind: 'expense' })}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-400"
            >
              <Plus size={14} /> Add Expense
            </button>
            <button
              type="button"
              onClick={() => setOpeningModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Settings size={14} /> Set Opening Cash
            </button>
            <button
              type="button"
              onClick={handleExportLedgerCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Toast Notice */}
      {notice && (
        <div
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs font-bold shadow-sm ${
            notice.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="rounded p-0.5 hover:bg-black/5">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                active
                  ? 'bg-[#0f3a5c] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ────────────────── OVERVIEW TAB ────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Income vs Expenses
              </h2>
              <MonthlyIncomeExpenseChart rows={pnlRows} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Cumulative Net &amp; Monthly Profit
              </h2>
              <CumulativeProfitChart rows={pnlRows} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <CategoryBreakdownCard
              title={`Income Categories (${periodLabel})`}
              total={summary.income.sum}
              rows={incomeByCategory}
              tone="emerald"
            />
            <CategoryBreakdownCard
              title={`Expense Categories (${periodLabel})`}
              total={summary.expenses.sum}
              rows={expenseByCategory}
              tone="rose"
            />
          </div>

          {/* Monthly P&L Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly P&amp;L Statement</h2>
                <p className="text-[11px] text-slate-400">Cash-basis income vs operating expenses by month</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                {sortedPnlDesc.length} months
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-right">Income</th>
                    <th className="px-4 py-3 text-right">Expense</th>
                    <th className="px-4 py-3 text-right">Net Balance</th>
                    <th className="px-4 py-3 text-right">Margin</th>
                    <th className="px-4 py-3 text-right">Cumulative</th>
                    <th className="px-4 py-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPnlDesc.map((r) => (
                    <tr key={r.month} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5 font-semibold text-slate-900">
                        {formatMonthLabel(r.month)}{' '}
                        <span className="text-[11px] font-normal text-slate-400">({r.month})</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-emerald-700">
                        {formatBdt(r.income)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-rose-600">
                        {formatBdt(r.expense)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-bold tabular-nums ${
                          r.profit >= 0 ? 'text-blue-700' : 'text-rose-700'
                        }`}
                      >
                        {r.profit >= 0 ? '+' : ''}
                        {formatBdt(r.profit)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums">
                        {r.margin}%
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold tabular-nums text-indigo-700">
                        {formatBdt(r.cumulative)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setCashflowMonth(r.month);
                            setTab('cashflow');
                          }}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-[#0f3a5c] hover:bg-blue-50"
                        >
                          Cashflow →
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sortedPnlDesc.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No P&amp;L entries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── CASHFLOW TAB ────────────────── */}
      {tab === 'cashflow' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setCashflowMonth((m) => shiftMonth(m, -1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                type="month"
                value={cashflowMonth}
                onChange={(e) => e.target.value && setCashflowMonth(e.target.value)}
                className="cursor-pointer bg-transparent px-2 py-1 text-sm font-bold text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => setCashflowMonth((m) => shiftMonth(m, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight size={16} />
              </button>
              <span className="px-2 text-xs font-semibold text-slate-500">{formatMonthLabel(cashflowMonth)}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpeningModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Settings size={14} /> Set Opening Cash
            </button>
          </div>

          {cashflowLoading || !cashflowData ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading monthly cashflow...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <MiniKpi icon={<Wallet size={16} />} label="Opening Cash" value={formatBdt(cashflowData.opening)} tone="slate" />
                <MiniKpi
                  icon={<ArrowDownCircle size={16} />}
                  label="Money In"
                  value={formatBdt(cashflowData.totals.in)}
                  sub={`${cashflowData.income.length} entries`}
                  tone="emerald"
                />
                <MiniKpi
                  icon={<ArrowUpCircle size={16} />}
                  label="Money Out"
                  value={formatBdt(cashflowData.totals.out)}
                  sub={`${cashflowData.expense.length} entries`}
                  tone="rose"
                />
                <MiniKpi
                  icon={<Activity size={16} />}
                  label="Net for Month"
                  value={formatBdt(cashflowData.totals.net)}
                  tone={cashflowData.totals.net >= 0 ? 'blue' : 'rose'}
                />
                <MiniKpi
                  icon={<PiggyBank size={16} />}
                  label="Closing Cash"
                  value={formatBdt(cashflowData.totals.closing)}
                  tone={cashflowData.totals.closing >= 0 ? 'emerald' : 'rose'}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* Side-by-side Income */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/80 px-4 py-3 text-emerald-900">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <ArrowDownCircle size={16} /> Income · {cashflowData.income.length} entries
                    </div>
                    <button
                      type="button"
                      onClick={() => setEntryModal({ kind: 'income', defaultDate: `${cashflowMonth}-01` })}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-3 py-2 text-left">Date</th>
                          <th className="px-3 py-2 text-left">Category</th>
                          <th className="px-3 py-2 text-left">Client</th>
                          <th className="px-3 py-2 text-left">Ref</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cashflowData.income.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center italic text-slate-400">
                              No income entries in {formatMonthLabel(cashflowMonth)}
                            </td>
                          </tr>
                        ) : (
                          cashflowData.income.map((r) => (
                            <tr
                              key={r.id}
                              onClick={() => setEntryModal({ kind: 'income', record: r })}
                              className="cursor-pointer transition hover:bg-slate-50"
                            >
                              <td className="whitespace-nowrap px-3 py-2 text-slate-500">{r.date}</td>
                              <td className="px-3 py-2 font-semibold text-slate-800">{r.category || '—'}</td>
                              <td className="max-w-[140px] truncate px-3 py-2 text-slate-700">{r.clientName || '—'}</td>
                              <td className="max-w-[100px] truncate px-3 py-2 text-slate-500">{r.reference || '—'}</td>
                              <td className="px-3 py-2 text-right font-bold tabular-nums text-emerald-700">
                                {formatBdt(r.amount)}
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                                {formatBdt(r.running)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={4} className="px-3 py-2.5 text-right text-[11px] uppercase text-slate-500">
                            Total In
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-emerald-700">
                            {formatBdt(cashflowData.totals.in)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Side-by-side Spend */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/80 px-4 py-3 text-rose-900">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <ArrowUpCircle size={16} /> Spend · {cashflowData.expense.length} entries
                    </div>
                    <button
                      type="button"
                      onClick={() => setEntryModal({ kind: 'expense', defaultDate: `${cashflowMonth}-01` })}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-bold text-rose-800 hover:bg-rose-50"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-3 py-2 text-left">Date</th>
                          <th className="px-3 py-2 text-left">Category</th>
                          <th className="px-3 py-2 text-left">Paid To</th>
                          <th className="px-3 py-2 text-left">Ref</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cashflowData.expense.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center italic text-slate-400">
                              No expenses in {formatMonthLabel(cashflowMonth)}
                            </td>
                          </tr>
                        ) : (
                          cashflowData.expense.map((r) => (
                            <tr
                              key={r.id}
                              onClick={() => setEntryModal({ kind: 'expense', record: r })}
                              className="cursor-pointer transition hover:bg-slate-50"
                            >
                              <td className="whitespace-nowrap px-3 py-2 text-slate-500">{r.date}</td>
                              <td className="px-3 py-2 font-semibold text-slate-800">{r.category || '—'}</td>
                              <td className="max-w-[140px] truncate px-3 py-2 text-slate-700">{r.paidTo || '—'}</td>
                              <td className="max-w-[100px] truncate px-3 py-2 text-slate-500">{r.reference || '—'}</td>
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
                      <tfoot className="bg-slate-50 font-bold">
                        <tr>
                          <td colSpan={4} className="px-3 py-2.5 text-right text-[11px] uppercase text-slate-500">
                            Total Out
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-rose-700">
                            {formatBdt(cashflowData.totals.out)}
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <CategoryBreakdownCard
                  title="Income Breakdown"
                  total={cashflowData.totals.in}
                  rows={cashflowData.byCategory.income}
                  tone="emerald"
                />
                <CategoryBreakdownCard
                  title="Expense Breakdown"
                  total={cashflowData.totals.out}
                  rows={cashflowData.byCategory.expense}
                  tone="rose"
                />
                <CategoryBreakdownCard
                  title="Income by Reference"
                  total={cashflowData.totals.in}
                  rows={cashflowData.incomeByReference}
                  tone="blue"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ────────────────── INCOME LEDGER TAB ────────────────── */}
      {tab === 'income' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MiniKpi icon={<ArrowDownCircle size={16} />} label="Total Income" value={formatBdt(summary.income.sum)} tone="emerald" />
            <MiniKpi icon={<Receipt size={16} />} label="Records" value={String(summary.income.total)} sub={periodLabel} tone="slate" />
            <MiniKpi
              icon={<BarChart3 size={16} />}
              label="Avg per Entry"
              value={formatBdt(summary.income.total > 0 ? summary.income.sum / summary.income.total : 0)}
              tone="blue"
            />
            <MiniKpi
              icon={<TrendingUp size={16} />}
              label="Top Category"
              value={incomeByCategory[0]?.name || '—'}
              tone="indigo"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <CategoryBreakdownCard
                title="Income by Category"
                total={summary.income.sum}
                rows={incomeByCategory}
                tone="emerald"
              />
            </div>

            <div className="space-y-3 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={incomeSearch}
                      onChange={(e) => setIncomeSearch(e.target.value)}
                      placeholder="Search client, student, ref..."
                      className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={incomeCatFilter}
                    onChange={(e) => setIncomeCatFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {incomeByCategory.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={includeExcluded}
                      onChange={(e) => setIncludeExcluded(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Include pre-data capital
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setEntryModal({ kind: 'income' })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                >
                  <Plus size={14} /> Add Income
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Client / Student</th>
                        <th className="px-3 py-3 text-left">Ref</th>
                        <th className="px-3 py-3 text-left">Handled By</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIncome.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70">
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{r.date}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-800">
                            {r.category || '—'}
                            {r.excludeFromCash && (
                              <span className="ml-1.5 rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
                                PRE-DATA
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-slate-700">
                            <div className="font-medium">{r.clientName || '—'}</div>
                            {(r.studentName || r.leadRef) && (
                              <div className="mt-0.5 text-[10px] text-blue-700">
                                {r.studentName} {r.leadRef ? `(${r.leadRef})` : ''}
                              </div>
                            )}
                          </td>
                          <td className="max-w-[120px] truncate px-3 py-2.5 text-slate-500">{r.reference || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-600">{r.employeeName || '—'}</td>
                          <td className="px-3 py-2.5 text-right font-bold tabular-nums text-emerald-700">
                            {formatBdt(r.amount)}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEntryModal({ kind: 'income', record: r })}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Delete this income entry?')) {
                                    void handleDeleteEntry('income', r.id);
                                  }
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredIncome.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No matching income records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t border-slate-100 bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={5} className="px-3 py-3 text-right text-[11px] uppercase text-slate-500">
                          Filtered Total ({filteredIncome.length})
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-emerald-700">
                          {formatBdt(filteredIncome.reduce((s, r) => s + (r.amount || 0), 0))}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── EXPENSE LEDGER TAB ────────────────── */}
      {tab === 'expenses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MiniKpi icon={<ArrowUpCircle size={16} />} label="Total Expenses" value={formatBdt(summary.expenses.sum)} tone="rose" />
            <MiniKpi icon={<Receipt size={16} />} label="Records" value={String(summary.expenses.total)} sub={periodLabel} tone="slate" />
            <MiniKpi
              icon={<BarChart3 size={16} />}
              label="Avg per Entry"
              value={formatBdt(summary.expenses.total > 0 ? summary.expenses.sum / summary.expenses.total : 0)}
              tone="blue"
            />
            <MiniKpi
              icon={<TrendingDown size={16} />}
              label="Top Category"
              value={expenseByCategory[0]?.name || '—'}
              tone="indigo"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <CategoryBreakdownCard
                title="Expenses by Category"
                total={summary.expenses.sum}
                rows={expenseByCategory}
                tone="rose"
              />
            </div>

            <div className="space-y-3 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      placeholder="Search paid to, student, ref..."
                      className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs font-medium outline-none focus:border-rose-500"
                    />
                  </div>
                  <select
                    value={expenseCatFilter}
                    onChange={(e) => setExpenseCatFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-rose-500"
                  >
                    <option value="">All Categories</option>
                    {expenseByCategory.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setEntryModal({ kind: 'expense' })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
                >
                  <Plus size={14} /> Add Expense
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Paid To / Student</th>
                        <th className="px-3 py-3 text-left">Ref</th>
                        <th className="px-3 py-3 text-left">Handled By</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredExpenses.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70">
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{r.date}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-800">{r.category || 'Uncategorised'}</td>
                          <td className="px-3 py-2.5 text-slate-700">
                            <div className="font-medium">{r.paidTo || '—'}</div>
                            {r.studentName && (
                              <span className="mt-0.5 inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                <GraduationCap size={10} />
                                {r.studentName} {r.leadRef ? `(${r.leadRef})` : ''}
                              </span>
                            )}
                          </td>
                          <td className="max-w-[120px] truncate px-3 py-2.5 text-slate-500">{r.reference || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-600">{r.employeeName || '—'}</td>
                          <td className="px-3 py-2.5 text-right font-bold tabular-nums text-rose-700">
                            {formatBdt(r.amount)}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setEntryModal({ kind: 'expense', record: r })}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Delete this expense entry?')) {
                                    void handleDeleteEntry('expense', r.id);
                                  }
                                }}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredExpenses.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No matching expense records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="border-t border-slate-100 bg-slate-50 font-bold">
                      <tr>
                        <td colSpan={5} className="px-3 py-3 text-right text-[11px] uppercase text-slate-500">
                          Filtered Total ({filteredExpenses.length})
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-rose-700">
                          {formatBdt(filteredExpenses.reduce((s, r) => s + (r.amount || 0), 0))}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── STUDENT LEDGER TAB ────────────────── */}
      {tab === 'student' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold">Student Financial Ledger Lookup</h2>
                <p className="text-xs text-slate-400">
                  Search all fee receipts, deposits, air tickets, visa fees, and referral payouts for any student
                </p>
              </div>
            </div>

            <div className="relative mt-4 max-w-2xl">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void searchStudentLedger();
                }}
                placeholder="Search student name, Lead Ref (e.g. L-00075, LEAD-0417), or phone..."
                className="w-full rounded-xl bg-white py-2.5 pl-10 pr-28 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-400"
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
                className="absolute right-1.5 top-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                {studentLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Select:</span>
              {quickStudents.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setStudentQuery(s.name);
                    void searchStudentLedger(s.name);
                  }}
                  className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/20"
                >
                  {s.name} {s.leadRef ? `(${s.leadRef})` : ''}
                </button>
              ))}
            </div>
          </div>

          {studentResult ? (
            <div className="space-y-4">
              {studentResult.student && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900">{studentResult.student.name}</h3>
                    <p className="text-xs text-slate-500">
                      {studentResult.student.country}
                      {studentResult.student.university ? ` · ${studentResult.student.university}` : ''}
                      {studentResult.student.phone ? ` · ${studentResult.student.phone}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-blue-800">
                    Stage: {studentResult.student.applicationStage}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MiniKpi icon={<ArrowDownCircle size={16} />} label="Total Received" value={formatBdt(studentResult.totals.income)} tone="emerald" />
                <MiniKpi icon={<ArrowUpCircle size={16} />} label="Total Spent" value={formatBdt(studentResult.totals.expense)} tone="rose" />
                <MiniKpi
                  icon={<Activity size={16} />}
                  label="Net Balance"
                  value={formatBdt(studentResult.totals.net)}
                  tone={studentResult.totals.net >= 0 ? 'blue' : 'rose'}
                />
                <MiniKpi icon={<Receipt size={16} />} label="Transactions" value={String(studentResult.totals.count)} tone="slate" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-3 text-left">Date</th>
                        <th className="px-3 py-3 text-left">Kind</th>
                        <th className="px-3 py-3 text-left">Category</th>
                        <th className="px-3 py-3 text-left">Client / Paid To</th>
                        <th className="px-3 py-3 text-left">Ref / Lead ID</th>
                        <th className="px-3 py-3 text-left">Handled By</th>
                        <th className="px-3 py-3 text-right">Amount</th>
                        <th className="px-3 py-3 text-right">Edit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentResult.transactions.map((t) => (
                        <tr key={`${t.kind}-${t.id}`} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{t.date}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                                t.kind === 'income'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-rose-200 bg-rose-50 text-rose-700'
                              }`}
                            >
                              {t.kind === 'income' ? 'INCOME' : 'EXPENSE'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-slate-800">{t.category || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-700">
                            {t.kind === 'income' ? t.clientName || '—' : t.paidTo || '—'}
                          </td>
                          <td className="px-3 py-2.5 text-slate-500">{t.leadRef || t.reference || '—'}</td>
                          <td className="px-3 py-2.5 text-slate-600">
                            {t.employeeName ? (
                              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
                                <Users size={10} /> {t.employeeName}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td
                            className={`px-3 py-2.5 text-right font-bold tabular-nums ${
                              t.kind === 'income' ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {t.kind === 'income' ? '+' : '-'}
                            {formatBdt(t.amount)}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => setEntryModal({ kind: t.kind, record: t })}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {studentResult.transactions.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-slate-400">
                            No transactions matched &quot;{studentQuery}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Search size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Search Student Financial History</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                Enter any student name or CRM Lead ID (such as L-00075 or LEAD-0417) to inspect every payment and expense linked to that file.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ────────────────── YEAR VIEW TAB ────────────────── */}
      {tab === 'year' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setYearVal((y) => y - 1)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-1 text-sm font-bold text-slate-900">{yearVal}</span>
              <button
                type="button"
                onClick={() => setYearVal((y) => y + 1)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {yearLoading || !yearData ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading yearly ledger...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MiniKpi icon={<Wallet size={16} />} label="Year Opening" value={formatBdt(yearData.opening)} tone="slate" />
                <MiniKpi
                  icon={<ArrowDownCircle size={16} />}
                  label="Year Income"
                  value={formatBdt(yearData.rows.reduce((s, r) => s + r.income, 0))}
                  tone="emerald"
                />
                <MiniKpi
                  icon={<ArrowUpCircle size={16} />}
                  label="Year Expenses"
                  value={formatBdt(yearData.rows.reduce((s, r) => s + r.expense, 0))}
                  tone="rose"
                />
                <MiniKpi
                  icon={<PiggyBank size={16} />}
                  label="Year Closing"
                  value={formatBdt(yearData.closing)}
                  tone={yearData.closing >= yearData.opening ? 'emerald' : 'amber'}
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Month</th>
                        <th className="px-4 py-3 text-right">Opening</th>
                        <th className="px-4 py-3 text-right">In</th>
                        <th className="px-4 py-3 text-right">Out</th>
                        <th className="px-4 py-3 text-right">Net</th>
                        <th className="px-4 py-3 text-right">Closing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {yearData.rows.map((r) => (
                        <tr key={r.month} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2.5 font-semibold text-slate-800">{formatMonthLabel(r.month)}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">{formatBdt(r.opening)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-emerald-700">
                            {r.income ? formatBdt(r.income) : <span className="text-slate-300">—</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-rose-700">
                            {r.expense ? formatBdt(r.expense) : <span className="text-slate-300">—</span>}
                          </td>
                          <td
                            className={`px-4 py-2.5 text-right font-bold tabular-nums ${
                              r.net >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {r.net >= 0 ? '+' : ''}
                            {formatBdt(r.net)}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                            {formatBdt(r.closing)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <YearCashTrendChart rows={yearData.rows} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ────────────────── INVESTORS TAB ────────────────── */}
      {tab === 'investors' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-violet-500/20 text-violet-300">
                <PiggyBank size={20} />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold">Investor Capital &amp; Profit Sharing</h2>
                <p className="text-xs text-slate-400">
                  Partner capital injections (including historical pre-ledger injections) &amp; annual equity splits
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInvestmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-violet-500"
            >
              <Plus size={14} /> Add Investment
            </button>
          </div>

          {investorsLoading || !investorsData ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading investor ledger...</div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Capital Injected</p>
                <p className="mt-1 font-heading text-3xl font-bold tabular-nums text-slate-900">
                  {formatBdt(investorsData.total)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Across {investorsData.byPerson.length} partners · {investorsData.contributions.length} contributions
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold text-slate-800">Capital Contributions by Partner</h3>
                  <div className="space-y-3.5">
                    {investorsData.byPerson.map((p) => {
                      const maxAmt = Math.max(...investorsData.byPerson.map((x) => x.amount), 1);
                      const shareCfg = PROFIT_SHARES.find((s) => s.name.toLowerCase() === p.name.toLowerCase());
                      const barCls =
                        shareCfg?.tone === 'blue'
                          ? 'bg-blue-500'
                          : shareCfg?.tone === 'violet'
                            ? 'bg-violet-500'
                            : shareCfg?.tone === 'amber'
                              ? 'bg-amber-500'
                              : 'bg-slate-400';
                      return (
                        <div key={p.name}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                              {p.name}
                              {p.pctShare !== null && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                  {p.pctShare}% Share
                                </span>
                              )}
                            </span>
                            <span className="font-bold tabular-nums text-slate-900">{formatBdt(p.amount)}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${barCls}`} style={{ width: `${(p.amount / maxAmt) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800">Partnership Profit Sharing</h3>
                  <p className="mb-3 mt-0.5 text-xs text-slate-500">
                    Official distribution schedule computed annually on net cash balances.
                  </p>
                  <div className="space-y-2.5">
                    {PROFIT_SHARES.map((p) => {
                      const dotCls =
                        p.tone === 'blue' ? 'bg-blue-500' : p.tone === 'violet' ? 'bg-violet-500' : 'bg-amber-500';
                      return (
                        <div
                          key={p.name}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`size-2.5 rounded-full ${dotCls}`} />
                            <span className="text-xs font-bold text-slate-800">{p.name}</span>
                          </div>
                          <span className="text-sm font-extrabold text-slate-900">{p.pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  All Capital Contributions
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Date</th>
                        <th className="px-4 py-2.5 text-left">Investor</th>
                        <th className="px-4 py-2.5 text-left">Reference</th>
                        <th className="px-4 py-2.5 text-left">Type</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                        <th className="px-4 py-2.5 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {investorsData.contributions.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2.5 text-slate-500">{c.date}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-900">{c.clientName || '—'}</td>
                          <td className="px-4 py-2.5 text-slate-600">{c.reference || '—'}</td>
                          <td className="px-4 py-2.5">
                            {c.excludeFromCash ? (
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                Pre-Data Capital
                              </span>
                            ) : (
                              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                Cashbook Injected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold tabular-nums text-violet-700">
                            {formatBdt(c.amount)}
                          </td>
                          <td className="max-w-[260px] truncate px-4 py-2.5 text-slate-500">{c.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ────────────────── PAYROLL TAB ────────────────── */}
      {tab === 'payroll' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
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
                className="cursor-pointer bg-transparent px-2 py-1 text-sm font-bold text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => setPayrollMonth((m) => shiftMonth(m, 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <ChevronRight size={16} />
              </button>
              <span className="px-2 text-xs font-semibold text-slate-500">{formatMonthLabel(payrollMonth)}</span>
            </div>
            {payrollData && (
              <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                Working days: <strong className="text-slate-900">{payrollData.workingDays}</strong>
              </span>
            )}
          </div>

          {payrollLoading || !payrollData ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading monthly payroll...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <MiniKpi icon={<Users size={16} />} label="Base Salaries" value={formatBdt(payrollData.totals.base)} tone="slate" />
                <MiniKpi icon={<Banknote size={16} />} label="Net Payroll" value={formatBdt(payrollData.totals.net)} tone="blue" />
                <MiniKpi icon={<CheckCircle2 size={16} />} label="Paid" value={formatBdt(payrollData.totals.paid)} tone="emerald" />
                <MiniKpi icon={<Wallet size={16} />} label="Pending" value={formatBdt(payrollData.totals.pending)} tone="amber" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-3 py-3 text-left">Employee</th>
                        <th className="px-3 py-3 text-center">Attendance</th>
                        <th className="px-3 py-3 text-right">Base Salary</th>
                        <th className="px-3 py-3 text-right">Bonus</th>
                        <th className="px-3 py-3 text-right">Deductions</th>
                        <th className="px-3 py-3 text-right">Net Pay</th>
                        <th className="px-3 py-3 text-center">Status</th>
                        <th className="px-3 py-3 text-right">Actions</th>
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
                          <tr key={row.id} className="hover:bg-slate-50/70">
                            <td className="px-3 py-2.5">
                              <div className="font-bold text-slate-900">{row.name}</div>
                              <div className="text-[10px] text-slate-400">{row.empId}</div>
                            </td>
                            <td className="px-3 py-2.5 text-center font-semibold text-slate-600 tabular-nums">
                              {row.daysWorked} / {row.workingDays}d
                            </td>
                            <td className="px-3 py-2.5 text-right">
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
                                className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-blue-500 focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right">
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
                                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-blue-500 focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right">
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
                                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-right font-semibold tabular-nums outline-none focus:border-blue-500 focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold tabular-nums text-slate-900">
                              {formatBdt(computedNet)}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  row.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {row.status}
                              </span>
                              {row.paidOn && <div className="mt-0.5 text-[10px] text-slate-400">{row.paidOn}</div>}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {isDirty && (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => handleSavePayrollRow(row)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-50"
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
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {row.status === 'paid' ? 'Unmark' : 'Mark Paid'}
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
    </div>
  );
}

function MiniKpi({
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
  tone: 'slate' | 'emerald' | 'rose' | 'amber' | 'blue' | 'indigo';
}) {
  const toneCls = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  }[tone];

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`rounded-xl p-2 ${toneCls}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="truncate font-heading text-lg font-bold tabular-nums text-slate-900">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

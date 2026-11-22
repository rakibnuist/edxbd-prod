'use client';

import { useMemo, useState } from 'react';
import { GraduationCap, Printer, Save, Search, Trash2, X } from 'lucide-react';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  PROFIT_SHARES,
  STUDENT_FINANCE_KEYWORDS,
  dhakaCurrentDate,
  formatBdt,
  formatMonthLabel,
  type FinanceExpenseDto,
  type FinanceIncomeDto,
  type PayrollRecordDto,
} from '@/lib/finance-logic';

export interface FinanceEmployeeOption {
  id: string;
  empId: string;
  name: string;
  role: string;
  salary: number;
}

export interface FinanceStudentOption {
  id: string;
  name: string;
  phone: string;
  country: string;
  university: string | null;
  status: string;
  applicationStage: string;
  leadRef: string | null;
}

export function FinanceEntryModal({
  kind,
  record,
  defaultDate,
  categories,
  employees,
  students,
  onClose,
  onSave,
  onDelete,
}: {
  kind: 'income' | 'expense';
  record?: FinanceIncomeDto | FinanceExpenseDto | null;
  defaultDate?: string;
  categories: string[];
  employees: FinanceEmployeeOption[];
  students: FinanceStudentOption[];
  onClose: () => void;
  onSave: (payload: Record<string, unknown>, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const incRec = kind === 'income' ? (record as FinanceIncomeDto | null | undefined) : null;
  const expRec = kind === 'expense' ? (record as FinanceExpenseDto | null | undefined) : null;

  const [date, setDate] = useState(record?.date || defaultDate || dhakaCurrentDate());
  const [amount, setAmount] = useState(record?.amount !== undefined ? String(record.amount) : '');
  const [category, setCategory] = useState(record?.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [clientOrPaidTo, setClientOrPaidTo] = useState(
    kind === 'income'
      ? incRec?.clientName || incRec?.studentName || ''
      : expRec?.paidTo || expRec?.studentName || '',
  );
  const [studentName, setStudentName] = useState(record?.studentName || '');
  const [leadRef, setLeadRef] = useState(record?.leadRef || '');
  const [leadId, setLeadId] = useState(record?.leadId || '');
  const [reference, setReference] = useState(record?.reference || '');
  const [employeeId, setEmployeeId] = useState(record?.employeeId || '');
  const [notes, setNotes] = useState(record?.notes || '');
  const [excludeFromCash, setExcludeFromCash] = useState(Boolean(incRec?.excludeFromCash));
  const [studentSearch, setStudentSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordCategory = record?.category ?? null;
  const categoryOptions = useMemo(() => {
    const base = kind === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
    const merged = new Set<string>([...base, ...categories]);
    if (recordCategory) merged.add(recordCategory);
    return Array.from(merged);
  }, [categories, kind, recordCategory]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return students.slice(0, 80);
    return students
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.leadRef || '').toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q),
      )
      .slice(0, 80);
  }, [students, studentSearch]);

  const activeCategory = category === '__custom__' ? customCategory.trim() : category;
  const isStudentRelated = STUDENT_FINANCE_KEYWORDS.some((kw) => activeCategory.toLowerCase().includes(kw));

  const handleStudentSelect = (selectedId: string) => {
    setLeadId(selectedId);
    if (!selectedId) return;
    const found = students.find((s) => s.id === selectedId);
    if (!found) return;
    setStudentName(found.name);
    if (found.leadRef) setLeadRef(found.leadRef);
    if (kind === 'income' && !clientOrPaidTo) {
      setClientOrPaidTo(found.name);
    }
    if (kind === 'expense' && !clientOrPaidTo && activeCategory) {
      setClientOrPaidTo(`${activeCategory} - ${found.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedAmount = Number(amount);
    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setError('Please enter a valid amount in BDT.');
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        date,
        amount: parsedAmount,
        category: activeCategory || null,
        studentName: studentName.trim() || null,
        leadRef: leadRef.trim() || null,
        leadId: leadId || null,
        reference: reference.trim() || null,
        employeeId: employeeId || null,
        notes: notes.trim() || null,
        ...(kind === 'income'
          ? { clientName: clientOrPaidTo.trim() || studentName.trim() || null, excludeFromCash }
          : { paidTo: clientOrPaidTo.trim() || studentName.trim() || null }),
      };
      await onSave(payload, record?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!record?.id || !onDelete) return;
    if (!window.confirm('Delete this financial entry permanently?')) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete(record.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete entry.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-slate-50/95 px-5 py-4 backdrop-blur">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">
              {record ? 'Edit' : 'Add'} {kind === 'income' ? 'Income Entry' : 'Expense Entry'}
            </h3>
            <p className="text-xs text-slate-500">
              {kind === 'income' ? 'Record student payments, deposits, or investments' : 'Record operating costs, salaries, visa/app fees, or refunds'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Amount (BDT) *</label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold tabular-nums text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="">— Select Category —</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">+ Custom Category...</option>
            </select>
            {category === '__custom__' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type custom category name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>

          {/* Student / Lead Linker */}
          <div
            className={`rounded-xl border p-3 transition ${
              isStudentRelated ? 'border-blue-200 bg-blue-50/70' : 'border-slate-200/80 bg-slate-50/70'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <GraduationCap size={14} className="text-blue-600" /> Student / Lead Link (Optional)
              </span>
              {isStudentRelated && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  Student-linked category
                </span>
              )}
            </div>

            <div className="relative mb-2">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student by name, Lead Ref, or phone..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={leadId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="">— Link existing student record —</option>
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.leadRef ? `(${s.leadRef})` : ''} · {s.country}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Fahmida Khan"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lead / App Ref
                </label>
                <input
                  type="text"
                  value={leadRef}
                  onChange={(e) => setLeadRef(e.target.value)}
                  placeholder="e.g. L-00075"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {kind === 'income' ? 'Client / Source' : 'Paid To'}
            </label>
            <input
              type="text"
              value={clientOrPaidTo}
              onChange={(e) => setClientOrPaidTo(e.target.value)}
              placeholder={kind === 'income' ? 'e.g. Fahmida Khan or Partner Name' : 'e.g. Chinese Visa Center, Office Landlord'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Mukta, Bank, Cash"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Handled By</label>
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="">— Unassigned —</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.empId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional receipt details or remarks"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {kind === 'income' && (
            <label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={excludeFromCash}
                onChange={(e) => setExcludeFromCash(e.target.checked)}
                className="mt-0.5 rounded border-slate-300"
              />
              <span>
                <strong>Exclude from live cashflow</strong> (use only for historical pre-ledger capital injections tracked in Investors)
              </span>
            </label>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            {record?.id && onDelete ? (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={deleting || saving}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete Entry'}
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || deleting}
                className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-60 ${
                  kind === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function OpeningCashModal({
  currentBaseline,
  currentLiveBalance,
  onClose,
  onSave,
}: {
  currentBaseline: number;
  currentLiveBalance: number;
  onClose: () => void;
  onSave: (amount: number) => Promise<void>;
}) {
  const [value, setValue] = useState(String(currentBaseline || 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    if (!Number.isFinite(num)) {
      setError('Enter a valid BDT amount.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(num);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update opening cash.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 rounded-t-2xl">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">Baseline Opening Cash</h3>
            <p className="text-xs text-slate-500">Starting cash before recorded income &amp; expense entries</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/70">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-5">
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
          <p className="text-xs text-slate-600">
            Current live cash position: <strong className="text-slate-900 tabular-nums">{formatBdt(currentLiveBalance)}</strong>
          </p>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Baseline Opening Cash (BDT)
            </label>
            <input
              type="number"
              step="any"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-lg font-bold tabular-nums text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0f3a5c] px-5 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Baseline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InvestmentEntryModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [date, setDate] = useState(dhakaCurrentDate());
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [excludeFromCash, setExcludeFromCash] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!clientName.trim() || !Number.isFinite(num) || num <= 0) {
      setError('Partner name and positive BDT amount are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        date,
        clientName: clientName.trim(),
        amount: num,
        category: 'Investment',
        reference: reference.trim() || `Investment - ${date}`,
        notes: notes.trim() || null,
        excludeFromCash,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record investment.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 rounded-t-2xl">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900">Record Partner Investment</h3>
            <p className="text-xs text-slate-500">Logged under Income category &quot;Investment&quot;</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/70">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-5">
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Investor / Partner *
            </label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {PROFIT_SHARES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setClientName(p.name)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition ${
                    clientName === p.name
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Or type investor name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Amount (BDT) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold tabular-nums text-slate-900 outline-none focus:border-violet-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Bank transfer ref, cheque no."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:bg-white"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={excludeFromCash}
              onChange={(e) => setExcludeFromCash(e.target.checked)}
              className="rounded border-slate-300"
            />
            Historical capital injection (exclude from live cashbook)
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0f3a5c] px-5 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-60"
            >
              {saving ? 'Recording...' : 'Record Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PayslipModal({
  record,
  onClose,
}: {
  record: PayrollRecordDto;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 rounded-t-2xl print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Salary Statement Preview</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#12436b]"
            >
              <Printer size={13} /> Print / PDF
            </button>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f3a5c]">
                EduExpress International
              </p>
              <h3 className="mt-0.5 font-heading text-xl font-bold text-slate-900">Employee Salary Slip</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                House 12/1, Road 4/A, Dhanmondi, Dhaka 1209
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                  record.status === 'paid'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}
              >
                {record.status}
              </span>
              <p className="mt-1.5 text-xs font-bold text-slate-900">{formatMonthLabel(record.month)}</p>
              {record.paidOn && <p className="text-[11px] text-slate-500">Paid: {record.paidOn}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee Name</p>
              <p className="mt-0.5 font-bold text-slate-900">{record.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee ID</p>
              <p className="mt-0.5 font-mono font-bold text-slate-900">{record.empId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pay Period</p>
              <p className="mt-0.5 font-semibold text-slate-700">{record.month}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance Recorded</p>
              <p className="mt-0.5 font-semibold tabular-nums text-slate-700">
                {record.daysWorked} / {record.workingDays} working days
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Base Monthly Salary</span>
              <span className="font-semibold tabular-nums text-slate-900">{formatBdt(record.baseSalary)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Performance Bonus / Allowance</span>
              <span className="font-semibold tabular-nums text-emerald-700">+{formatBdt(record.bonus)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Deductions / Adjustments</span>
              <span className="font-semibold tabular-nums text-rose-700">-{formatBdt(record.deductions)}</span>
            </div>
            <div className="flex items-center justify-between bg-[#071c2e] px-4 py-3 text-white rounded-b-xl">
              <span className="font-bold uppercase tracking-wider text-[11px]">Net Payable (BDT)</span>
              <span className="font-heading text-lg font-bold tabular-nums">{formatBdt(record.netPay)}</span>
            </div>
          </div>

          {record.notes && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Remarks:</span> {record.notes}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            <span>Generated via EduExpress Treasury Console</span>
            <span>Currency: Bangladeshi Taka (BDT)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

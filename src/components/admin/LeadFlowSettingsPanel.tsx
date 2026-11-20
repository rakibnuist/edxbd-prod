'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Globe2, RefreshCw, Shuffle, UserCheck, Users2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  CounselorCountryScope,
  CounselorFlowRule,
  LeadFlowAttendanceFilter,
  LeadFlowMode,
} from '@/lib/lead-flow';

interface LeadFlowEmployeeRow {
  id: string;
  empId: string;
  name: string;
  role: string;
  team: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  userId: string | null;
  rule: CounselorFlowRule;
  checkedInToday: boolean;
  activeLeadsCount: number;
  untouchedLeadsCount: number;
  todayAssignedCount: number;
}

interface LeadFlowSnapshot {
  config: {
    mode: LeadFlowMode;
    attendanceFilter: LeadFlowAttendanceFilter;
    onlyDistributeUntouched: boolean;
    rulesByEmpId: Record<string, CounselorFlowRule>;
  };
  employees: LeadFlowEmployeeRow[];
  backlog: {
    untouchedUnassignedTotal: number;
    untouchedUnassignedChina: number;
    untouchedUnassignedOther: number;
    untouchedOnIneligibleTotal: number;
    untouchedPoolTotal: number;
    untouchedAllTotal: number;
    untouchedAllChina: number;
    untouchedAllOther: number;
  };
}

export default function LeadFlowSettingsPanel() {
  const { isAuthenticated, authenticatedFetch } = useAuth();
  const [snapshot, setSnapshot] = useState<LeadFlowSnapshot | null>(null);
  const [mode, setMode] = useState<LeadFlowMode>('auto_balanced');
  const [attendanceFilter, setAttendanceFilter] = useState<LeadFlowAttendanceFilter>('all_eligible');
  const [rulesByEmpId, setRulesByEmpId] = useState<Record<string, CounselorFlowRule>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmRebalance, setConfirmRebalance] = useState(false);

  const applySnapshot = useCallback((data: LeadFlowSnapshot) => {
    setSnapshot(data);
    setMode(data.config.mode);
    setAttendanceFilter(data.config.attendanceFilter);
    const merged: Record<string, CounselorFlowRule> = {};
    for (const emp of data.employees) {
      merged[emp.empId.toUpperCase()] = { ...emp.rule };
    }
    setRulesByEmpId(merged);
  }, []);

  const loadSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authenticatedFetch('/api/admin/lead-flow');
      if (!res.ok) throw new Error('Could not load lead flow configuration.');
      const data = (await res.json()) as LeadFlowSnapshot;
      applySnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lead flow settings.');
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch, applySnapshot]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = window.setTimeout(() => void loadSnapshot(), 0);
    return () => window.clearTimeout(id);
  }, [isAuthenticated, loadSnapshot]);

  const persistFlowSettings = async (
    nextMode: LeadFlowMode = mode,
    nextAtt: LeadFlowAttendanceFilter = attendanceFilter,
    nextRules: Record<string, CounselorFlowRule> = rulesByEmpId,
    successText = 'Lead flow rules saved.',
  ) => {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadFlowMode: nextMode,
          leadFlowAttendanceFilter: nextAtt,
          leadFlowOnlyUntouched: 'true',
          leadFlowRulesJson: JSON.stringify(nextRules),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not save lead flow rules.');
      setNotice(successText);
      await loadSnapshot();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead flow rules.');
    } finally {
      setBusy(false);
    }
  };

  const handleApplyThreeCounselorPreset = async () => {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/lead-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_3_counselors_preset' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not apply office counselor preset.');
      applySnapshot(data);
      setNotice(
        '3-Counselor office routing configured: Mukta Rahaman (All Countries), Afsana Meme (China Only), Mim (China Only). Now click a Distribute Untouched Leads button below if you want to assign existing untouched leads.',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply counselor preset.');
    } finally {
      setBusy(false);
    }
  };

  const handleDistribute = async (scope: 'new' | 'untouched_pool' | 'untouched_rebalance') => {
    setBusy(true);
    setNotice(null);
    setError(null);
    setConfirmRebalance(false);
    try {
      const res = await authenticatedFetch('/api/admin/leads/auto-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Lead distribution failed.');
      const parts = Object.entries((data.breakdown || {}) as Record<string, number>)
        .map(([name, count]) => `${name}: ${count}`)
        .join(' · ');
      setNotice(
        data.assignedCount > 0
          ? `Distributed ${data.assignedCount} untouched leads (${parts || 'done'}).`
          : 'No untouched leads matched the selected distribution pool and active counselor rules.',
      );
      await loadSnapshot();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to distribute leads.');
    } finally {
      setBusy(false);
    }
  };

  const updateRule = (empId: string, patch: Partial<CounselorFlowRule>) => {
    const key = empId.toUpperCase();
    setRulesByEmpId((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { eligible: false, countryScope: 'china_only', dailyCap: 0 }),
        ...patch,
      },
    }));
  };

  const eligibleEmployees = (snapshot?.employees || []).filter(
    (emp) => emp.active && rulesByEmpId[emp.empId.toUpperCase()]?.eligible,
  );

  return (
    <section
      id="lead-flow"
      className="mt-8 scroll-mt-6 space-y-5 rounded-2xl bg-white p-6 shadow ring-1 ring-gray-100"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800">
              <Shuffle size={12} />
              Lead Flow &amp; Counselor Distribution Control
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {eligibleEmployees.length} active receiving counselor{eligibleEmployees.length === 1 ? '' : 's'}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-[#0f3a5c]">
            Lead Flow Control · Counselor Specialization &amp; Untouched Lead Distribution
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Control which counselors receive new enquiries, restrict counselors by destination (All Countries vs China Only), choose rotation vs workload balancing, or hold leads in a manual queue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy || loading}
            onClick={handleApplyThreeCounselorPreset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            Apply 3-Counselor Preset (Mukta: All · Afsana &amp; Mim: China)
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void loadSnapshot()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-900">
          {error}
        </div>
      )}

      {/* Flow Mode + Check-in Filter */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">1. Automatic Intake Flow Mode</p>
          <div className="space-y-2">
            {(
              [
                [
                  'auto_balanced',
                  'Smart Balanced (Recommended)',
                  'Assigns incoming leads to matching destination counselors with the fewest open leads.',
                ],
                [
                  'round_robin',
                  'Equal Daily Round-Robin',
                  'Rotates new leads equally 1-by-1 in turn order regardless of older active backlogs.',
                ],
                [
                  'manual_queue',
                  'Manual Queue Only (Pause Auto-Assign)',
                  'Keeps incoming enquiries unassigned until you distribute or assign manually.',
                ],
              ] as const
            ).map(([key, title, desc]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition ${
                  mode === key
                    ? 'border-[#0f3a5c] bg-white shadow-xs'
                    : 'border-slate-200 bg-white/60 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="leadFlowMode"
                  checked={mode === key}
                  onChange={() => setMode(key)}
                  className="mt-0.5 text-[#0f3a5c]"
                />
                <span>
                  <strong className="block font-bold text-slate-900">{title}</strong>
                  <span className="text-slate-500">{desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">2. Attendance Check-In Filter</p>
            <div className="space-y-2">
              {(
                [
                  [
                    'all_eligible',
                    'All Eligible Counselors',
                    'Assign across all enabled counselors whether checked in yet or not.',
                  ],
                  [
                    'prefer_checked_in',
                    'Prefer Checked-In Counselors Today',
                    'Route to counselors who checked in today first; fallback to all eligible before/after hours.',
                  ],
                  [
                    'strict_checked_in',
                    'Only Checked-In Counselors Today',
                    'Never assign to absent or non-checked-in counselors (holds unassigned until check-in).',
                  ],
                ] as const
              ).map(([key, title, desc]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 text-xs transition ${
                    attendanceFilter === key
                      ? 'border-[#0f3a5c] bg-white shadow-xs'
                      : 'border-slate-200 bg-white/60 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="leadFlowAttendanceFilter"
                    checked={attendanceFilter === key}
                    onChange={() => setAttendanceFilter(key)}
                    className="mt-0.5 text-[#0f3a5c]"
                  />
                  <span>
                    <strong className="block font-bold text-slate-900">{title}</strong>
                    <span className="text-slate-500">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
            <p className="text-[11px] text-slate-500">
              Non-China enquiries strictly skip China-only counselors automatically.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void persistFlowSettings()}
              className="rounded-lg bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-50"
            >
              {busy ? 'Saving...' : 'Save Flow Rules'}
            </button>
          </div>
        </div>
      </div>

      {/* Counselor Country Scope & Eligibility Matrix */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <Users2 size={16} className="text-[#0f3a5c]" />
              3. Counselor Eligibility, Destination Scope &amp; Daily Caps
            </h3>
            <p className="text-[11px] text-slate-500">
              Uncheck &ldquo;Receive Leads&rdquo; for owners/investors/inactive staff. Set a login password for any new counselor on{' '}
              <Link href="/admin/users" className="font-bold text-[#0f3a5c] hover:underline">
                Staff Logins &amp; Users →
              </Link>
            </p>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#0f3a5c] hover:bg-slate-50"
          >
            Manage Staff, Phones &amp; Logins →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Staff Member</th>
                <th className="px-4 py-2.5">Status / Today</th>
                <th className="px-4 py-2.5">Current Leads</th>
                <th className="px-4 py-2.5">Receive Leads</th>
                <th className="px-4 py-2.5">Country Access</th>
                <th className="px-4 py-2.5">Daily Cap (0 = ∞)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(snapshot?.employees || []).map((emp) => {
                const key = emp.empId.toUpperCase();
                const rule = rulesByEmpId[key] || emp.rule;
                return (
                  <tr key={emp.id} className={!emp.active ? 'bg-slate-50/80 opacity-60' : ''}>
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {emp.empId} · {emp.role}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            emp.checkedInToday
                              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {emp.checkedInToday ? 'Checked In' : 'Not Checked In'}
                        </span>
                        {!emp.userId && rule.eligible && (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                            No Login Linked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">
                      <span className="font-bold text-slate-900">{emp.untouchedLeadsCount} new</span> ·{' '}
                      {emp.activeLeadsCount} open · {emp.todayAssignedCount} today
                    </td>
                    <td className="px-4 py-2.5">
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          disabled={!emp.active}
                          checked={rule.eligible}
                          onChange={(e) => updateRule(emp.empId, { eligible: e.target.checked })}
                          className="size-4 rounded border-slate-300 text-[#0f3a5c]"
                        />
                        <span className={rule.eligible ? 'font-bold text-emerald-700' : 'text-slate-500'}>
                          {rule.eligible ? 'Enabled' : 'Excluded'}
                        </span>
                      </label>
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        disabled={!rule.eligible}
                        value={rule.countryScope}
                        onChange={(e) =>
                          updateRule(emp.empId, {
                            countryScope: e.target.value as CounselorCountryScope,
                          })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold disabled:bg-slate-100"
                      >
                        <option value="all">All Countries (China + Global)</option>
                        <option value="china_only">China Only</option>
                        <option value="non_china_only">Non-China Only</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        max={500}
                        disabled={!rule.eligible}
                        value={rule.dailyCap}
                        onChange={(e) =>
                          updateRule(emp.empId, {
                            dailyCap: Math.max(0, Math.min(500, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-20 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-mono disabled:bg-slate-100"
                      />
                    </td>
                  </tr>
                );
              })}
              {!snapshot?.employees.length && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-slate-500">
                    No staff members found yet. Click &ldquo;Apply 3-Counselor Preset&rdquo; or &ldquo;+ Add Counselor&rdquo; above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Untouched Leads Distribution Actions */}
      <div className="space-y-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <Globe2 size={16} className="text-cyan-700" />
              4. Distribute Untouched Leads Only (<code className="rounded bg-white px-1 py-0.5 text-[11px]">status = new</code>)
            </h3>
            <p className="text-[11px] text-slate-600">
              Never alters leads already contacted, in progress, qualified, or enrolled. Remember to click <strong>Save Flow Rules</strong> if you changed counselor scopes above before distributing.
            </p>
          </div>
          {snapshot && (
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="rounded-full bg-white px-2.5 py-1 text-slate-800 ring-1 ring-slate-200">
                Unassigned Untouched: {snapshot.backlog.untouchedUnassignedTotal} ({snapshot.backlog.untouchedUnassignedChina} China · {snapshot.backlog.untouchedUnassignedOther} Other)
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-slate-800 ring-1 ring-slate-200">
                On Non-Counselors / Old Staff: {snapshot.backlog.untouchedOnIneligibleTotal}
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-slate-800 ring-1 ring-slate-200">
                All Untouched: {snapshot.backlog.untouchedAllTotal}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={busy || !snapshot?.backlog.untouchedUnassignedTotal}
            onClick={() => void handleDistribute('new')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-50"
          >
            <UserCheck size={14} />
            Distribute Unassigned Untouched ({snapshot?.backlog.untouchedUnassignedTotal ?? 0})
          </button>

          <button
            type="button"
            disabled={busy || !snapshot?.backlog.untouchedPoolTotal}
            onClick={() => void handleDistribute('untouched_pool')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-100 disabled:opacity-50"
          >
            Pull &amp; Assign Unassigned + Non-Counselor Untouched ({snapshot?.backlog.untouchedPoolTotal ?? 0})
          </button>

          {!confirmRebalance ? (
            <button
              type="button"
              disabled={busy || !snapshot?.backlog.untouchedAllTotal}
              onClick={() => setConfirmRebalance(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            >
              Rebalance ALL {snapshot?.backlog.untouchedAllTotal ?? 0} Untouched Leads Across Active Counselors…
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-amber-950">
                Re-split all {snapshot?.backlog.untouchedAllTotal ?? 0} untouched (&ldquo;new&rdquo;) leads evenly?
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDistribute('untouched_rebalance')}
                className="rounded bg-amber-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-amber-700"
              >
                Confirm Rebalance
              </button>
              <button
                type="button"
                onClick={() => setConfirmRebalance(false)}
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

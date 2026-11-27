'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity, AlertTriangle, Award, BarChart3, Calendar, CheckCircle2, ChevronDown, ChevronUp, Clock,
  Download, ExternalLink, FileText, Flame, FolderCheck, HelpCircle, ListChecks, LogIn, LogOut,
  MapPin, Navigation, PhoneCall, Plus, RefreshCw, Smartphone, Target, Trash2, TrendingUp, Users, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type {
  ComputedEmployeeKpi,
  KpiReportResult,
  WorkflowStageKey,
} from '@/lib/kpi-workflow';
import { buildWhatsAppUrl } from '@/lib/wa-templates';
import { formatFriendlySource } from '@/lib/lead-sources';

type DailyLogItem = {
  id: string;
  employeeId: string;
  empId: string;
  date: string;
  accomplishments: string | null;
  challenges: string | null;
  tomorrowPlan: string | null;
  submittedAt: string;
};

type TaskItem = {
  id: string;
  title: string;
  details: string | null;
  assignedTo: string | null;
  employeeId: string | null;
  assignedBy: string | null;
  dueDate: string | null;
  priority: string;
  status: string;
  category: string | null;
  leadId: string | null;
};

type RecentActivity = {
  id: string;
  type: string;
  actorName: string | null;
  leadId: string | null;
  leadName: string | null;
  fromValue: string | null;
  toValue: string | null;
  details: string | null;
  createdAt: string;
};

type ApiKpiPayload = KpiReportResult & {
  targets?: Array<{
    employeeId: string | null;
    consultant: string;
    month: string;
    targetDailyActions: number;
    targetFollowups: number;
    targetEnrolled: number;
    maxSlaHours: number;
  }>;
  recentDailyLogs: DailyLogItem[];
  openTasks: TaskItem[];
  recentActivities: RecentActivity[];
};

type TraceDetailPayload = {
  kpi: ComputedEmployeeKpi | null;
  employee: {
    id: string;
    empId: string;
    name: string;
    role: string;
    email: string | null;
    phone: string | null;
    team: string;
    specialization: string | null;
  };
  attendances: Array<{
    id: string;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    hoursWorked: number;
    status: string;
  }>;
  dailyLogs: DailyLogItem[];
  tasks: TaskItem[];
  activities: RecentActivity[];
};

const WORKFLOW_BADGES: Record<WorkflowStageKey, { label: string; cls: string }> = {
  on_track: { label: 'On Track', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  needs_attention: { label: 'SLA Attention', cls: 'bg-red-50 text-red-800 border-red-200' },
  not_checked_in: { label: 'Not Checked In', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  idle: { label: 'Quiet Today', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  weekend: { label: 'Weekend / Off', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
};

function currentMonthIso(): string {
  return new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 7);
}

async function captureBrowserLocation(): Promise<{
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  locationError?: 'denied' | 'timeout' | 'unavailable' | 'unsupported';
  sourceAccuracy?: 'high' | 'network';
}> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return { locationError: 'unsupported' };
  }

  // Strategy 1: Attempt High Accuracy (GPS hardware satellite lock, 7s timeout, allows 30s cached fix)
  const tryHighAccuracy = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 7000,
        maximumAge: 30000,
      });
    });

  // Strategy 2: Fallback to Low Accuracy (Wi-Fi access points + Cellular triangulation, 12s timeout, allows 3min cached fix)
  // This works 100% reliably indoors and on phones where satellite lock is weak or slow.
  const tryLowAccuracy = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 180000,
      });
    });

  try {
    let pos: GeolocationPosition;
    let source: 'high' | 'network' = 'high';

    try {
      pos = await tryHighAccuracy();
    } catch (err: unknown) {
      const geoErr = err as GeolocationPositionError;
      // If user explicitly denied permission, do not retry, return 'denied' immediately
      if (geoErr && typeof geoErr.code === 'number' && geoErr.code === 1) {
        return { locationError: 'denied' };
      }
      // If timed out (common indoors) or position unavailable, fall back to cellular/Wi-Fi triangulation
      source = 'network';
      pos = await tryLowAccuracy();
    }

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracyMeters: Math.round(pos.coords.accuracy || 0),
      sourceAccuracy: source,
    };
  } catch (err: unknown) {
    const geoErr = err as GeolocationPositionError;
    if (geoErr && typeof geoErr.code === 'number' && geoErr.code === 1) {
      return { locationError: 'denied' };
    }
    if (geoErr && typeof geoErr.code === 'number' && geoErr.code === 3) {
      return { locationError: 'timeout' };
    }
    return { locationError: 'unavailable' };
  }
}

export default function KpiWorkflowClient() {
  const { user, authenticatedFetch } = useAuth();
  const isCounselor = user?.role === 'counselor';
  const [tab, setTab] = useState<'overview' | 'analytics' | 'workspace' | 'manage'>('overview');
  const effectiveTab = isCounselor && (tab === 'manage' || tab === 'analytics') ? 'overview' : tab;
  const [month, setMonth] = useState<string>(currentMonthIso);
  const [report, setReport] = useState<ApiKpiPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selected employee in My Workspace tab
  const [activeEmpId, setActiveEmpId] = useState<string>('');
  const [accomplishments, setAccomplishments] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');

  // GPS verification state
  const [testingGps, setTestingGps] = useState(false);
  const [gpsTroubleshootOpen, setGpsTroubleshootOpen] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState<{
    type: 'ok' | 'warn';
    title: string;
    message: string;
  } | null>(null);

  // Task creation state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('normal');
  const [taskCategory, setTaskCategory] = useState('counseling');

  // Target editor state
  const [targetEmpId, setTargetEmpId] = useState('');
  const [targetDailyActions, setTargetDailyActions] = useState('12');
  const [targetFollowups, setTargetFollowups] = useState('10');
  const [targetEnrolled, setTargetEnrolled] = useState('5');
  const [maxSlaHours, setMaxSlaHours] = useState('24');

  // Trace drawer
  const [traceEmpId, setTraceEmpId] = useState<string | null>(null);
  const [traceData, setTraceData] = useState<TraceDetailPayload | null>(null);
  const [traceLoading, setTraceLoading] = useState(false);

  const [refreshTick, setRefreshTick] = useState(0);
  const userEmail = user?.email?.toLowerCase() || '';

  const triggerReload = useCallback((showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setRefreshTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    authenticatedFetch(`/api/admin/kpi?month=${encodeURIComponent(month)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load KPI report');
        setReport(data);
        setError(null);
        const list: ComputedEmployeeKpi[] = Array.isArray(data.employees) ? data.employees : [];
        if (list.length > 0) {
          const selfMatch = list.find((e) => e.employee.email?.toLowerCase() === userEmail) || list[0];
          setActiveEmpId((prev) => prev || selfMatch.employee.id);
          setTargetEmpId((prev) => prev || selfMatch.employee.id);
          setTaskAssigneeId((prev) => prev || selfMatch.employee.id);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load KPI report');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [authenticatedFetch, month, refreshTick, userEmail]);

  const loadReport = async () => triggerReload(false);

  const openTraceDrawer = async (empId: string) => {
    setTraceEmpId(empId);
    setTraceLoading(true);
    try {
      const res = await authenticatedFetch(`/api/admin/kpi/${encodeURIComponent(empId)}?month=${encodeURIComponent(month)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        setTraceData(await res.json());
      }
    } finally {
      setTraceLoading(false);
    }
  };

  const activeKpi = useMemo(
    () => report?.employees.find((e) => e.employee.id === activeEmpId) || report?.employees[0] || null,
    [report, activeEmpId],
  );

  // Aggregate daily chart bars across entire team
  const teamDailyBars = useMemo(() => {
    if (!report?.employees.length) return [];
    const map = new Map<string, { date: string; total: number; isWeekend: boolean }>();
    for (const row of report.employees) {
      for (const pt of row.dailySeries) {
        const cur = map.get(pt.date) || { date: pt.date, total: 0, isWeekend: pt.isWeekend };
        cur.total += pt.actions;
        map.set(pt.date, cur);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [report]);

  const maxDailyTotal = Math.max(1, ...teamDailyBars.map((b) => b.total));

  const handleAttendanceAction = async (mode: 'checkin' | 'checkout') => {
    if (!activeKpi) return;
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      let locationPayload: Record<string, unknown> = {};
      if (mode === 'checkin') {
        setLocating(true);
        locationPayload = await captureBrowserLocation();
        setLocating(false);
        if (locationPayload.locationError === 'denied') {
          setGpsTroubleshootOpen(true);
        }
      }
      const res = await authenticatedFetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: activeKpi.employee.id, mode, ...locationPayload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Attendance update failed');
      const locLabel = data.locationStatus?.locationLabel ? ` · ${data.locationStatus.locationLabel}` : '';
      setNotice(
        mode === 'checkin'
          ? `${activeKpi.employee.name} checked in at ${data.checkIn} (${data.status})${locLabel}.`
          : `${activeKpi.employee.name} checked out at ${data.checkOut} (${data.hoursWorked}h logged).`,
      );
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Attendance error');
    } finally {
      setLocating(false);
      setBusy(false);
    }
  };

  const handleTestGps = async () => {
    setTestingGps(true);
    setGpsFeedback(null);
    try {
      const loc = await captureBrowserLocation();
      if (loc.locationError === 'denied') {
        setGpsFeedback({
          type: 'warn',
          title: 'Location Permission Denied',
          message: 'Your browser or device has blocked location access. Tap the guide below to enable location permission in 2 taps.',
        });
        setGpsTroubleshootOpen(true);
      } else if (loc.latitude && loc.longitude) {
        setGpsFeedback({
          type: 'ok',
          title: 'GPS Signal Ready',
          message: `Coordinates detected (${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}) with ±${loc.accuracyMeters}m accuracy via ${loc.sourceAccuracy === 'high' ? 'GPS satellite lock' : 'cellular/Wi-Fi triangulation'}. Location services are working properly!`,
        });
      } else if (loc.locationError === 'timeout') {
        setGpsFeedback({
          type: 'warn',
          title: 'Location Timed Out',
          message: 'Could not get an accurate fix in time. Ensure mobile data/Wi-Fi is active and try again.',
        });
      } else {
        setGpsFeedback({
          type: 'warn',
          title: 'Location Unavailable',
          message: 'Could not obtain coordinates. Make sure Location / GPS is turned ON in your phone settings or pull-down menu.',
        });
      }
    } catch {
      setGpsFeedback({
        type: 'warn',
        title: 'Location Detection Error',
        message: 'Browser could not access location. Please check device settings.',
      });
    } finally {
      setTestingGps(false);
    }
  };

  const handleSubmitDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKpi || !accomplishments.trim()) return;
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: activeKpi.employee.id,
          accomplishments: accomplishments.trim(),
          challenges: challenges.trim(),
          tomorrowPlan: tomorrowPlan.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit daily log');
      setNotice(`Daily EOD reflection logged for ${activeKpi.employee.name}.`);
      setAccomplishments('');
      setChallenges('');
      setTomorrowPlan('');
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Daily log error');
    } finally {
      setBusy(false);
    }
  };

  const handleExportAnalyticsCsv = () => {
    if (!report) return;
    const lines: string[] = [];
    lines.push('--- COUNSELOR OUTREACH & CONVERSION LEADERBOARD ---');
    lines.push(['Rank', 'Counselor Name', 'Role', 'Team', 'Calls Logged', 'Students Contacted', 'Assigned Leads', 'Files Opened', 'Conversion Rate %', 'KPI Score'].join(','));
    const sortedCounselors = [...report.employees].sort(
      (a, b) =>
        (b.funnel.filesOpened || 0) - (a.funnel.filesOpened || 0) ||
        (b.funnel.conversionRatePct || 0) - (a.funnel.conversionRatePct || 0) ||
        b.score - a.score,
    );
    sortedCounselors.forEach((emp, idx) => {
      lines.push([
        idx + 1,
        `"${emp.employee.name}"`,
        `"${emp.employee.role}"`,
        `"${emp.employee.team}"`,
        emp.funnel.callsLogged || 0,
        emp.activity.touchedLeadsMonth,
        emp.funnel.totalAssigned,
        emp.funnel.filesOpened || 0,
        `${emp.funnel.conversionRatePct || 0}%`,
        emp.score,
      ].join(','));
    });

    lines.push('');
    lines.push('--- AD CAMPAIGN & ACQUISITION PERFORMANCE ---');
    lines.push(['Acquisition Source', 'Category', 'Total Inbound Leads', 'Contacted Leads', 'Files Opened', 'Conversion Rate %', 'Verdict'].join(','));
    (report.sourceMetrics || []).forEach((src) => {
      const verdict = src.filesOpened >= 5 ? 'Top Performing Ad' : src.filesOpened > 0 ? 'Converting' : src.totalLeads > 10 ? 'High Inbound / Review Lead Quality' : 'Low Volume';
      lines.push([
        `"${formatFriendlySource(src.source)}"`,
        `"${src.categoryLabel}"`,
        src.totalLeads,
        src.contactedLeads,
        src.filesOpened,
        `${src.conversionRatePct}%`,
        `"${verdict}"`,
      ].join(','));
    });

    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduexpress-counselor-campaign-analytics-${report.month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle.trim(),
          employeeId: taskAssigneeId || null,
          dueDate: taskDueDate || null,
          priority: taskPriority,
          category: taskCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to assign task');
      setTaskTitle('');
      setNotice('Task directive assigned cleanly.');
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Task creation failed');
    } finally {
      setBusy(false);
    }
  };

  const handleTaskStatus = async (id: string, status: string) => {
    setBusy(true);
    try {
      const res = await authenticatedFetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) await loadReport();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setBusy(true);
    try {
      const res = await authenticatedFetch(`/api/admin/tasks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) await loadReport();
    } finally {
      setBusy(false);
    }
  };

  const handleSaveTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmpId) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await authenticatedFetch('/api/admin/kpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: targetEmpId,
          month,
          targetDailyActions: Number(targetDailyActions),
          targetFollowups: Number(targetFollowups),
          targetEnrolled: Number(targetEnrolled),
          maxSlaHours: Number(maxSlaHours),
        }),
      });
      if (!res.ok) throw new Error('Could not save KPI targets');
      setNotice('KPI & SLA targets updated for selected counselor.');
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save targets');
    } finally {
      setBusy(false);
    }
  };

  const handleSeedDefaultTargets = async () => {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/kpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_defaults', month }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not seed default targets');
      setNotice(`Seeded default ${month} KPI targets (${data.createdCount} added).`);
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed targets');
    } finally {
      setBusy(false);
    }
  };

  const handleAutoAssignBacklog = async (scope: 'new' | 'all_active') => {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const res = await authenticatedFetch('/api/admin/leads/auto-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auto-assignment failed');
      setNotice(`Auto-assigned ${data.assignedCount} unassigned leads evenly across counselors.`);
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auto-assignment failed');
    } finally {
      setBusy(false);
    }
  };

  const openTasks = report?.openTasks || [];

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <Activity className="text-blue-600" size={24} />
            Employee KPI & Workflow Tracer
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            4-Pillar Composite KPI (Attendance 25 + Daily Log 15 + CRM Activity 35 + SLA & Tasks 25) & Live Dhaka Operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none"
            />
          </label>
          <button
            type="button"
            onClick={loadReport}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Quick Attendance & GPS Check-In Dock */}
      {report && activeKpi && (
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#0f3a5c] text-white">
                  <MapPin size={15} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Quick Daily Attendance</span>
                    <span className="text-[11px] font-medium text-slate-500">· Dhaka (GMT+6)</span>
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    Staff: <span className="font-semibold text-slate-800">{activeKpi.employee.name}</span> ({activeKpi.employee.empId})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  activeKpi.attendance.todayCheckIn
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                <span className={`size-2 rounded-full ${activeKpi.attendance.todayCheckIn ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                {activeKpi.attendance.todayCheckIn
                  ? `In: ${activeKpi.attendance.todayCheckIn} (${activeKpi.attendance.todayStatus || 'Present'})`
                  : 'Not Checked In Yet'}
              </span>

              {activeKpi.attendance.todayCheckOut && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  Out: {activeKpi.attendance.todayCheckOut}
                </span>
              )}

              {activeKpi.attendance.todayLocationLabel && activeKpi.attendance.todayCheckIn && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    activeKpi.attendance.todayLocationType === 'office_location'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : activeKpi.attendance.todayLocationType === 'remote_location'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <MapPin size={11} />
                  {activeKpi.attendance.todayLocationLabel}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Full touch targets for mobile */}
          <div className="mt-4 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={busy || Boolean(activeKpi.attendance.todayCheckIn)}
              onClick={() => handleAttendanceAction('checkin')}
              className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogIn size={15} className={locating ? 'animate-spin' : ''} />
              {locating ? 'Acquiring GPS / Network Lock...' : activeKpi.attendance.todayCheckIn ? 'Checked In Today' : '1-Tap Check In'}
            </button>

            <button
              type="button"
              disabled={busy || !activeKpi.attendance.todayCheckIn || Boolean(activeKpi.attendance.todayCheckOut)}
              onClick={() => handleAttendanceAction('checkout')}
              className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-2 rounded-xl bg-[#0f3a5c] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#12436b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={15} />
              {activeKpi.attendance.todayCheckOut ? 'Checked Out' : 'Check Out'}
            </button>

            <button
              type="button"
              disabled={testingGps || busy}
              onClick={handleTestGps}
              className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
            >
              <Navigation size={14} className={testingGps ? 'animate-spin text-blue-600' : 'text-slate-500'} />
              {testingGps ? 'Testing GPS...' : 'Test Location & Signal'}
            </button>

            <button
              type="button"
              onClick={() => setGpsTroubleshootOpen((v) => !v)}
              className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <HelpCircle size={14} className="text-amber-600" />
              <span>{gpsTroubleshootOpen ? 'Hide GPS Guide' : 'GPS Not Working?'}</span>
              {gpsTroubleshootOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* GPS Feedback Pill */}
          {gpsFeedback && (
            <div
              className={`mt-3 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
                gpsFeedback.type === 'ok'
                  ? 'border border-emerald-200 bg-emerald-50/90 text-emerald-900'
                  : 'border border-amber-200 bg-amber-50/90 text-amber-900'
              }`}
            >
              {gpsFeedback.type === 'ok' ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="font-bold">{gpsFeedback.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed">{gpsFeedback.message}</p>
              </div>
            </div>
          )}

          {/* Expandable Device-Specific GPS Troubleshooting */}
          {gpsTroubleshootOpen && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Smartphone size={14} className="text-blue-600" />
                  Fix GPS / Location on Phone or Laptop in 2 Steps
                </h3>
                <button
                  type="button"
                  onClick={() => setGpsTroubleshootOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Android Chrome */}
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Android (Chrome / Browser)
                  </p>
                  <ol className="mt-2 list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
                    <li>Tap the <strong>tune/lock icon</strong> 🔒 or 🎛️ in the URL bar (left of eduexpressint.com).</li>
                    <li>Tap <strong>Permissions</strong> &gt; <strong>Location</strong> &gt; switch to <strong>Allow</strong>.</li>
                    <li>Swipe down your phone&apos;s notification bar and make sure <strong>Location / GPS is ON</strong>.</li>
                    <li>Tap <strong>Test Location &amp; Signal</strong> above.</li>
                  </ol>
                </div>

                {/* iPhone Safari */}
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-blue-500" />
                    iPhone (Safari / iOS)
                  </p>
                  <ol className="mt-2 list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
                    <li>Tap the <strong>aA</strong> icon in the address bar &gt; <strong>Website Settings</strong> &gt; <strong>Location: Allow</strong>.</li>
                    <li>Or open iPhone <strong>Settings &gt; Privacy &amp; Security &gt; Location Services</strong> (make sure ON).</li>
                    <li>Scroll to <strong>Safari Websites</strong> &gt; select <strong>While Using the App</strong>.</li>
                    <li>Refresh this page and tap <strong>Check In</strong>.</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50/70 p-2.5 text-[11px] text-blue-900 flex items-start gap-1.5">
                <CheckCircle2 size={13} className="shrink-0 text-blue-600 mt-0.5" />
                <span>
                  <strong>Indoor Office Fallback Active:</strong> When inside Dhanmondi office building where satellite GPS is blocked, the system automatically uses Wi-Fi and mobile network triangulation.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-px">
        {[
          { id: 'overview' as const, label: isCounselor ? 'My KPI & SLA Overview' : 'Team KPI & Live Workflow', icon: Award },
          ...(!isCounselor ? [{ id: 'analytics' as const, label: 'Leaderboard & Ad ROI', icon: BarChart3 }] : []),
          { id: 'workspace' as const, label: 'My Check-In & Daily Logs', icon: Flame },
          ...(!isCounselor ? [{ id: 'manage' as const, label: 'Tasks & KPI Targets', icon: ListChecks }] : []),
        ].map((t) => {
          const Icon = t.icon;
          const active = effectiveTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? 'border-[#0f3a5c] text-[#0f3a5c]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {isCounselor && !loading && report && report.employees.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
          Your account is not linked to an active Employee profile yet. Please ask an administrator to link your user account under Staff &amp; Access.
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {notice}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
          {error}
        </div>
      )}

      {/* KPI Summary Cards */}
      {report && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { label: 'Team Avg KPI', value: `${report.summary.avgScore}/100`, tone: 'text-[#0f3a5c]' },
            { label: 'Checked In Today', value: `${report.summary.checkedInToday}/${report.summary.activeEmployees}`, tone: 'text-emerald-700' },
            { label: 'Logs Today', value: `${report.summary.logsSubmittedToday}/${report.summary.activeEmployees}`, tone: 'text-blue-700' },
            { label: 'CRM Actions (Mo)', value: String(report.summary.totalEventsMonth), tone: 'text-indigo-700' },
            { label: 'Untouched SLA', value: String(report.summary.totalUntouchedOverdue), tone: report.summary.totalUntouchedOverdue > 0 ? 'text-red-700' : 'text-slate-900' },
            { label: 'Overdue Follow-ups', value: String(report.summary.totalOverdueFollowups), tone: report.summary.totalOverdueFollowups > 0 ? 'text-amber-700' : 'text-slate-900' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-extrabold tabular-nums ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {effectiveTab === 'overview' && report && (
        <div className="space-y-6">
          {/* Team Daily Output Chart */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Daily Team Workflow Throughput ({month})</h2>
                <p className="text-xs text-slate-500">Tracked CRM actions, follow-up updates, logs, and attendance events per Dhaka calendar day</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                Eff. working days: {report.effWorkingDays}/{report.workingDays}
              </span>
            </div>
            <div className="flex h-32 items-end gap-1 pt-2">
              {teamDailyBars.map((bar) => {
                const heightPct = Math.max(bar.total > 0 ? 12 : 4, Math.round((bar.total / maxDailyTotal) * 100));
                return (
                  <div key={bar.date} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                    <div
                      title={`${bar.date}: ${bar.total} CRM actions`}
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all ${
                        bar.isWeekend
                          ? 'bg-slate-200'
                          : bar.total > 0
                            ? 'bg-gradient-to-t from-[#0f3a5c] to-blue-500 group-hover:from-blue-700 group-hover:to-cyan-500'
                            : 'bg-slate-100'
                      }`}
                    />
                    <span className="mt-1 hidden text-[9px] text-slate-400 md:block tabular-nums">
                      {bar.date.slice(8)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee KPI & Live Matrix */}
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-slate-900">Counselor & Staff KPI Scorecard</h2>
              <p className="text-xs text-slate-500">Click any row to open Deep Workflow Trace & Activity Timeline.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-3 py-3">Live Status</th>
                    <th className="px-3 py-3">Composite Score</th>
                    <th className="px-3 py-3">Pillars (A/D/C/S)</th>
                    <th className="px-3 py-3">Today Actions</th>
                    <th className="px-3 py-3">Leads & SLA</th>
                    <th className="px-3 py-3">Tasks / Streak</th>
                    <th className="px-4 py-3 text-right">Trace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.employees.map((row) => {
                    const wf = WORKFLOW_BADGES[row.workflowStage];
                    return (
                      <tr key={row.employee.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{row.employee.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {row.employee.empId} · {row.employee.role} · <span className="uppercase">{row.employee.team}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${wf.cls}`}>
                            {wf.label}
                          </span>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                            <span>{row.attendance.todayCheckIn ? `In: ${row.attendance.todayCheckIn}` : 'No check-in'}</span>
                            {row.attendance.todayLocationType === 'office_location' && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-700 ring-1 ring-emerald-200">
                                {row.attendance.todayLocationLabel || 'Office Zone'}
                              </span>
                            )}
                            {row.attendance.todayLocationType === 'remote_location' && (
                              <span className="rounded bg-amber-50 px-1.5 py-0.5 font-bold text-amber-800 ring-1 ring-amber-200">
                                {row.attendance.todayLocationLabel || 'Remote'}
                              </span>
                            )}
                            {(row.attendance.todayLocationType === 'location_denied' ||
                              row.attendance.todayLocationType === 'location_unavailable') && (
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 font-bold text-rose-700 ring-1 ring-rose-200">
                                {row.attendance.todayLocationLabel}
                              </span>
                            )}
                            {row.attendance.todayMapsUrl && (
                              <a
                                href={row.attendance.todayMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 font-bold text-[#0f3a5c] hover:underline"
                              >
                                <MapPin size={10} /> Map
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-extrabold tabular-nums ${
                              row.score >= 80 ? 'text-emerald-700' : row.score >= 55 ? 'text-blue-700' : 'text-amber-700'
                            }`}>
                              {row.score}
                            </span>
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                style={{ width: `${Math.min(100, row.score)}%` }}
                                className={`h-full rounded-full ${
                                  row.score >= 80 ? 'bg-emerald-500' : row.score >= 55 ? 'bg-blue-600' : 'bg-amber-500'
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-700">
                          {row.pillars.attendance}/25 · {row.pillars.discipline}/15 · {row.pillars.activity}/35 · {row.pillars.execution}/25
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-slate-900 tabular-nums">{row.activity.todayEvents} today</div>
                          <div className="text-[10px] text-slate-500">{row.activity.totalEvents} month (avg {row.activity.dailyAvg}/d)</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-slate-800">{row.funnel.activeLeads} active / {row.funnel.enrolledCount} won</div>
                          <div className={`text-[10px] font-bold ${row.sla.uncontactedOverdue + row.sla.followupsOverdue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                            {row.sla.compliancePct}% SLA ({row.sla.uncontactedOverdue} new, {row.sla.followupsOverdue} due)
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-slate-800">{row.tasks.open + row.tasks.inProgress} open / {row.tasks.doneMonth} done</div>
                          <div className="text-[10px] text-slate-500">Log streak: {row.discipline.streak}d</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openTraceDrawer(row.employee.id)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#0f3a5c] hover:bg-slate-50"
                          >
                            Deep Trace
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {report.employees.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                        No active employees found yet. Add team members under &ldquo;Tasks, SLA Targets & Roster&rdquo;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SLA Bottleneck Queue */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <AlertTriangle size={15} className="text-red-600" />
                  Live SLA Bottleneck Queue ({report.slaBottlenecks.length})
                </h2>
                <p className="text-xs text-slate-500">
                  New leads waiting &gt; SLA threshold without contact or overdue follow-up dates.
                </p>
              </div>
              <Link href="/admin/leads" className="text-xs font-bold text-[#0f3a5c] hover:underline">
                Open Leads Workspace →
              </Link>
            </div>
            {report.slaBottlenecks.length === 0 ? (
              <div className="rounded-lg bg-emerald-50 p-4 text-center text-xs font-semibold text-emerald-800">
                Zero SLA bottlenecks right now — all active leads contacted on time.
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {report.slaBottlenecks.slice(0, 12).map((b) => {
                  const waUrl = buildWhatsAppUrl(b.phone);
                  return (
                    <div key={`${b.id}-${b.issueType}`} className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 p-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/leads?lead=${encodeURIComponent(b.id)}`}
                          className="truncate block text-xs font-bold text-slate-900 hover:text-blue-700 hover:underline"
                        >
                          {b.name}
                        </Link>
                        <p className="text-[11px] text-slate-500">{b.country} · {b.assignedTo || 'Unassigned'}</p>
                        <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          b.issueType === 'followup_overdue'
                            ? 'bg-red-50 text-red-700'
                            : b.issueType === 'untouched_sla'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-blue-50 text-blue-700'
                        }`}>
                          {b.issueType === 'followup_overdue'
                            ? `Overdue (${b.nextFollowup})`
                            : b.issueType === 'untouched_sla'
                              ? `Untouched ${b.ageHours}h (SLA ${b.maxSlaHours}h)`
                              : 'Follow-up Today'}
                        </span>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100"
                          >
                            WA
                          </a>
                        )}
                        <Link
                          href={`/admin/leads?lead=${encodeURIComponent(b.id)}`}
                          className="rounded border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {effectiveTab === 'analytics' && report && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Counselor Outreach Leaderboard &amp; Ad Campaign Performance
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Month: {report.month} · Real-time Conversion Funnel &amp; Acquisition Quality
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportAnalyticsCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <Download size={14} /> Export CSV Report
            </button>
          </div>

          {/* Section 1: Counselor Performance Leaderboard */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Award size={16} className="text-amber-500" />
                Counselor Conversion &amp; Outreach Leaderboard
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by files opened, conversion rate and logged calls.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Counselor</th>
                    <th className="py-2.5 px-3 text-center">Calls Logged</th>
                    <th className="py-2.5 px-3 text-center">Students Touched</th>
                    <th className="py-2.5 px-3 text-center">Assigned Leads</th>
                    <th className="py-2.5 px-3 text-center">Files Opened</th>
                    <th className="py-2.5 px-3 text-center">Conversion %</th>
                    <th className="py-2.5 px-3 text-center">SLA Compliance</th>
                    <th className="py-2.5 px-3 text-right">KPI Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...report.employees]
                    .sort(
                      (a, b) =>
                        (b.funnel.filesOpened || 0) - (a.funnel.filesOpened || 0) ||
                        (b.funnel.conversionRatePct || 0) - (a.funnel.conversionRatePct || 0) ||
                        b.score - a.score,
                    )
                    .map((emp, idx) => {
                      const medal =
                        idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                      return (
                        <tr key={emp.employee.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 font-bold text-slate-700">{medal}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{emp.employee.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {emp.employee.role} · {emp.employee.team}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                            {emp.funnel.callsLogged || 0}
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-indigo-700">
                            {emp.activity.touchedLeadsMonth}
                          </td>
                          <td className="py-3 px-3 text-center font-medium tabular-nums text-slate-600">
                            {emp.funnel.totalAssigned}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 tabular-nums">
                              <FolderCheck size={11} /> {emp.funnel.filesOpened || 0}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-[#0f3a5c]">
                            {emp.funnel.conversionRatePct || 0}%
                          </td>
                          <td className="py-3 px-3 text-center font-medium tabular-nums">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                emp.sla.compliancePct >= 80
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {emp.sla.compliancePct}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold tabular-nums text-[#0f3a5c]">
                            {emp.score}/100
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Ad Campaign & Acquisition Quality (ROI Tracker) */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <TrendingUp size={16} className="text-purple-600" />
                Ad Campaign &amp; Lead Source Quality (ROI Analysis)
              </h3>
              <p className="text-xs text-slate-500">
                Compare which Meta ad campaign, organic page, or WhatsApp channel produces actual student applications.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Acquisition Source</th>
                    <th className="py-2.5 px-3">Channel Type</th>
                    <th className="py-2.5 px-3 text-center">Total Inbound</th>
                    <th className="py-2.5 px-3 text-center">Contacted</th>
                    <th className="py-2.5 px-3 text-center">Files Opened</th>
                    <th className="py-2.5 px-3 text-center">Lead to File %</th>
                    <th className="py-2.5 px-3 text-right">Campaign Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!report.sourceMetrics || report.sourceMetrics.length === 0) ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No acquisition source data recorded for this month.
                      </td>
                    </tr>
                  ) : (
                    report.sourceMetrics.map((src) => {
                      const isHighYield = src.filesOpened >= 5;
                      const isConverting = src.filesOpened > 0;
                      return (
                        <tr key={src.source} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">
                              {formatFriendlySource(src.source)}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">{src.source}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {src.categoryLabel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-slate-800">
                            {src.totalLeads}
                          </td>
                          <td className="py-3 px-3 text-center tabular-nums text-slate-600">
                            {src.contactedLeads} (
                            {src.totalLeads > 0
                              ? Math.round((src.contactedLeads / src.totalLeads) * 100)
                              : 0}
                            %)
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 tabular-nums">
                              {src.filesOpened}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold tabular-nums text-[#0f3a5c]">
                            {src.conversionRatePct}%
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                isHighYield
                                  ? 'border border-purple-200 bg-purple-100 text-purple-800'
                                  : isConverting
                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                    : src.totalLeads > 15
                                      ? 'border border-amber-200 bg-amber-100 text-amber-800'
                                      : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isHighYield
                                ? '⭐ Top Performing Ad'
                                : isConverting
                                  ? '✓ Converting'
                                  : src.totalLeads > 15
                                    ? '⚠️ Check Ad Quality'
                                    : 'Growing'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {effectiveTab === 'workspace' && report && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Check-in + Reflection Form */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Employee Daily Check-In & EOD Log</h2>
                  <p className="text-xs text-slate-500">Dhaka Time (GMT+6) · Date: {report.today}</p>
                </div>
                <select
                  value={activeEmpId || activeKpi?.employee.id || ''}
                  disabled={isCounselor}
                  onChange={(e) => setActiveEmpId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {report.employees.map((e) => (
                    <option key={e.employee.id} value={e.employee.id}>
                      {e.employee.name} ({e.employee.empId})
                    </option>
                  ))}
                </select>
              </div>

              {activeKpi && (
                <div className="mt-4 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Today&apos;s Attendance Status</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-base font-bold text-slate-900">
                        <span>
                          {activeKpi.attendance.todayCheckIn
                            ? `Checked in at ${activeKpi.attendance.todayCheckIn} (${activeKpi.attendance.todayStatus})`
                            : 'Not checked in yet today'}
                          {activeKpi.attendance.todayCheckOut ? ` · Out: ${activeKpi.attendance.todayCheckOut}` : ''}
                        </span>
                        {activeKpi.attendance.todayLocationLabel && activeKpi.attendance.todayCheckIn && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              activeKpi.attendance.todayLocationType === 'office_location'
                                ? 'bg-emerald-100 text-emerald-800'
                                : activeKpi.attendance.todayLocationType === 'remote_location'
                                  ? 'bg-amber-100 text-amber-800'
                                  : activeKpi.attendance.todayLocationType === 'location_denied' ||
                                      activeKpi.attendance.todayLocationType === 'location_unavailable'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <MapPin size={11} />
                            {activeKpi.attendance.todayLocationLabel}
                          </span>
                        )}
                        {activeKpi.attendance.todayMapsUrl && activeKpi.attendance.todayCheckIn && (
                          <a
                            href={activeKpi.attendance.todayMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f3a5c] hover:underline"
                          >
                            View Map ↗
                          </a>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Monthly Attendance: {activeKpi.attendance.pct}% · EOD Streak: {activeKpi.discipline.streak} days · Score: {activeKpi.score}/100
                      </p>
                    </div>
                    <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        disabled={busy || Boolean(activeKpi.attendance.todayCheckIn)}
                        onClick={() => handleAttendanceAction('checkin')}
                        className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <LogIn size={15} /> {locating ? 'Capturing GPS...' : activeKpi.attendance.todayCheckIn ? 'Checked In Today' : 'Check In'}
                      </button>
                      <button
                        type="button"
                        disabled={busy || !activeKpi.attendance.todayCheckIn || Boolean(activeKpi.attendance.todayCheckOut)}
                        onClick={() => handleAttendanceAction('checkout')}
                        className="inline-flex w-full sm:w-auto min-h-[44px] sm:min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#12436b] disabled:opacity-50"
                      >
                        <LogOut size={15} /> {activeKpi.attendance.todayCheckOut ? 'Checked Out' : 'Check Out'}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitDailyLog} className="space-y-3">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <FileText size={14} /> Submit Daily Work Reflection Log
                    </h3>
                    <label className="block text-xs font-semibold text-slate-700">
                      Key Accomplishments Today *
                      <textarea
                        required
                        rows={3}
                        value={accomplishments}
                        onChange={(e) => setAccomplishments(e.target.value)}
                        placeholder="Called 15 China leads, sent 6 WhatsApp templates, updated 2 JW202 stages…"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Challenges / Blockers
                        <textarea
                          rows={2}
                          value={challenges}
                          onChange={(e) => setChallenges(e.target.value)}
                          placeholder="Students missing passport scans…"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                        />
                      </label>
                      <label className="block text-xs font-semibold text-slate-700">
                        Tomorrow&apos;s Priority Plan
                        <textarea
                          rows={2}
                          value={tomorrowPlan}
                          onChange={(e) => setTomorrowPlan(e.target.value)}
                          placeholder="Follow up with high GPA China leads…"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={busy || !accomplishments.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#12436b] disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      {activeKpi.discipline.todayLogSubmitted ? 'Update Today\'s Daily Log' : 'Submit Daily Log'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Personal Open Tasks & Recent Team Daily Logs */}
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Active Tasks</h3>
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {openTasks.filter((t) => !activeKpi || !t.employeeId || t.employeeId === activeKpi.employee.id).map((t) => (
                  <div key={t.id} className="rounded-lg border border-slate-200 p-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' || t.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>{t.priority}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {t.assignedTo || 'Unassigned'}{t.dueDate ? ` · Due ${t.dueDate}` : ''}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      {t.status !== 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => handleTaskStatus(t.id, 'in_progress')}
                          className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700"
                        >
                          Start
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTaskStatus(t.id, 'done')}
                        className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                      >
                        Mark Done
                      </button>
                    </div>
                  </div>
                ))}
                {openTasks.length === 0 && <p className="text-xs text-slate-400">All clear — no pending tasks.</p>}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">Recent Daily Logs</h3>
              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {report.recentDailyLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{log.empId}</span>
                      <span className="text-slate-500">{log.date}</span>
                    </div>
                    <p className="mt-1 text-slate-700 line-clamp-3">{log.accomplishments}</p>
                  </div>
                ))}
                {report.recentDailyLogs.length === 0 && (
                  <p className="text-xs text-slate-400">No daily logs submitted yet this month.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {effectiveTab === 'manage' && !isCounselor && report && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Task Directives Manager */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <ListChecks size={16} className="text-blue-600" />
              Assign Task Directive
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Call all GPA >= 4.0 China leads from yesterday…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <select
                  value={taskAssigneeId}
                  onChange={(e) => setTaskAssigneeId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
                >
                  <option value="">Any assignee</option>
                  {report.employees.map((e) => (
                    <option key={e.employee.id} value={e.employee.id}>{e.employee.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-2 text-xs"
                />
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
                >
                  <option value="counseling">Counseling</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="documents">Documents</option>
                  <option value="visa">Visa Desk</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={busy || !taskTitle.trim()}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0f3a5c] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#12436b] disabled:opacity-50"
              >
                <Plus size={14} /> Create Task
              </button>
            </form>

            <div className="space-y-2 border-t border-slate-100 pt-3 max-h-64 overflow-y-auto">
              {openTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {t.assignedTo || 'Unassigned'} · {t.status} {t.dueDate ? `· Due ${t.dueDate}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTaskStatus(t.id, 'done')}
                      className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(t.id)}
                      className="rounded p-1 text-slate-400 hover:text-red-600"
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI & SLA Target Setter + Team Roster */}
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Target size={16} className="text-indigo-600" />
                  Monthly KPI & SLA Targets ({month})
                </h2>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleSeedDefaultTargets}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
                >
                  Apply Recommended Targets (All)
                </button>
              </div>
              <form onSubmit={handleSaveTargets} className="space-y-3">
                <select
                  value={targetEmpId}
                  onChange={(e) => setTargetEmpId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
                >
                  {report.employees.map((e) => (
                    <option key={e.employee.id} value={e.employee.id}>
                      {e.employee.name} ({e.employee.empId})
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Daily Actions
                    <input
                      type="number"
                      min={1}
                      value={targetDailyActions}
                      onChange={(e) => setTargetDailyActions(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                  <label className="text-[11px] font-semibold text-slate-600">
                    Monthly Enrolled
                    <input
                      type="number"
                      min={0}
                      value={targetEnrolled}
                      onChange={(e) => setTargetEnrolled(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                  <label className="text-[11px] font-semibold text-slate-600">
                    Daily Follow-ups
                    <input
                      type="number"
                      min={0}
                      value={targetFollowups}
                      onChange={(e) => setTargetFollowups(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                  <label className="text-[11px] font-semibold text-slate-600">
                    Max SLA (Hours)
                    <input
                      type="number"
                      min={1}
                      value={maxSlaHours}
                      onChange={(e) => setMaxSlaHours(e.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    disabled={busy || !targetEmpId}
                    className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Save KPI Target
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleAutoAssignBacklog('new')}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-50"
                  >
                    Auto-Assign New Leads
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleAutoAssignBacklog('all_active')}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Auto-Assign Active Backlog
                  </button>
                </div>
              </form>

              {report.targets && report.targets.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Active {month} Targets ({report.targets.length})
                  </p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {report.targets.map((t) => (
                      <div key={`${t.consultant}-${t.month}`} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]">
                        <span className="font-bold text-slate-800 truncate">{t.consultant}</span>
                        <span className="text-slate-600 font-mono">
                          {t.targetDailyActions}/d · SLA {t.maxSlaHours}h · Goal {t.targetEnrolled}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Unified Office Staff & Lead Flow Links */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Users size={16} className="text-blue-600" />
                  Office Counselors &amp; Lead Flow ({report.employees.length} active)
                </h2>
                <Link
                  href="/admin/users"
                  className="rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#12436b]"
                >
                  Manage Staff, WhatsApp &amp; Logins →
                </Link>
              </div>
              <p className="text-xs text-slate-600">
                All staff edits, counselor additions, WhatsApp numbers, and login accounts are organized under{' '}
                <Link href="/admin/users" className="font-bold text-[#0f3a5c] hover:underline">
                  Staff &amp; Access (/admin/users)
                </Link>
                , and country assignment rules live in{' '}
                <Link href="/admin/settings#lead-flow" className="font-bold text-[#0f3a5c] hover:underline">
                  Lead Flow Control
                </Link>
                .
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {report.employees.map(({ employee }) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {employee.name} <span className="text-[11px] font-normal text-slate-500">({employee.empId})</span>
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {employee.role} · Scope: {employee.team}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                        employee.phone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {employee.phone ? 'WA Ready' : 'No WA Phone'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Workflow Trace Slide-over Drawer */}
      {traceEmpId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Deep Workflow Trace</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {traceData?.employee?.name || 'Loading…'}
                </h2>
                {traceData?.employee && (
                  <p className="text-xs text-slate-500">
                    {traceData.employee.empId} · {traceData.employee.role} · Team: {traceData.employee.team}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setTraceEmpId(null);
                  setTraceData(null);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {traceLoading || !traceData ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading employee activity stream…</div>
            ) : (
              <div className="mt-5 space-y-6">
                {traceData.kpi && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Total Score</p>
                      <p className="text-xl font-extrabold text-[#0f3a5c]">{traceData.kpi.score}/100</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">Attendance</p>
                      <p className="text-xl font-extrabold text-emerald-700">{traceData.kpi.pillars.attendance}/25</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">CRM Activity</p>
                      <p className="text-xl font-extrabold text-blue-700">{traceData.kpi.pillars.activity}/35</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] text-slate-500">SLA & Execution</p>
                      <p className="text-xl font-extrabold text-indigo-700">{traceData.kpi.pillars.execution}/25</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Clock size={13} /> Recent Activity Timeline ({traceData.activities.length})
                  </h3>
                  <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
                    {traceData.activities.map((act) => (
                      <div key={act.id} className="rounded-lg border border-slate-200 p-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{act.type.replaceAll('_', ' ')}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(act.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })}
                          </span>
                        </div>
                        {act.leadName && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="font-semibold text-blue-700">{act.leadName}</span>
                            {act.leadId && (
                              <Link
                                href={`/admin/leads?lead=${encodeURIComponent(act.leadId)}`}
                                className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 hover:underline"
                              >
                                <ExternalLink size={10} /> Open
                              </Link>
                            )}
                          </div>
                        )}
                        {(act.fromValue || act.toValue) && (
                          <p className="mt-1 text-slate-600">
                            {act.fromValue ? `${act.fromValue} → ` : ''}{act.toValue}
                          </p>
                        )}
                        {act.details && <p className="mt-1 text-slate-700">{act.details}</p>}
                      </div>
                    ))}
                    {traceData.activities.length === 0 && (
                      <p className="text-xs text-slate-400">No tracked CRM actions in {month}.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

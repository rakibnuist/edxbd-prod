'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  EyeOff,
  FileSpreadsheet,
  FilterX,
  FolderKanban,
  FolderOpen,
  Globe2,
  Kanban,
  Landmark,
  Loader2,
  Plane,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Table2,
  Trash2,
  Users2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatBdt } from '@/lib/finance-logic';
import { toSafeExternalUrl } from '@/lib/safe-url';
import {
  APPLICATION_TRACKER_STAGES,
  EMBASSY_STATUSES,
  getStageBucket,
  getStageDef,
  type ApplicationRowDto,
  type ApplicationStageDef,
} from '@/lib/application-tracker';
import NewApplicationModal, {
  type PromotableLeadOption,
  type TrackerEmployeeOption,
} from '@/components/admin/NewApplicationModal';
import ApplicationDetailDrawer from '@/components/admin/ApplicationDetailDrawer';

interface ApplicationsApiResponse {
  isAdmin: boolean;
  stages: ApplicationStageDef[];
  rows: ApplicationRowDto[];
  meta: {
    employees: TrackerEmployeeOption[];
    destinations: string[];
    intakes: string[];
    universities: string[];
    referrers: string[];
    degrees: string[];
    promotableLeads: PromotableLeadOption[];
  };
}

type BucketFilter = 'all' | 'docs' | 'submitted' | 'admitted' | 'visa' | 'flight' | 'withdrawn';

const STAGE_BADGE_CLASSES: Record<ApplicationStageDef['tone'], string> = {
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  violet: 'border-violet-200 bg-violet-50 text-violet-800',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  teal: 'border-teal-200 bg-teal-50 text-teal-800',
  orange: 'border-orange-200 bg-orange-50 text-orange-800',
  green: 'border-green-200 bg-green-50 text-green-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
};

function csvEscapeCell(val: unknown): string {
  const s = val === null || val === undefined ? '' : String(val);
  // Neutralize Excel formula injection
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

export default function ApplicationTrackerClient() {
  const { user, isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [data, setData] = useState<ApplicationsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // View & filters
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [marketFilter, setMarketFilter] = useState<'all' | 'bangladesh' | 'china'>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'office' | 'b2b'>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [intakeFilter, setIntakeFilter] = useState<string>('all');
  const [embassyFilter, setEmbassyFilter] = useState<string>('all');
  const [degreeFilter, setDegreeFilter] = useState<string>('all');
  const [consultantFilter, setConsultantFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideWithdrawn, setHideWithdrawn] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);

  // Selection & bulk actions (admin)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStage, setBulkStage] = useState('submitted');
  const [bulkBusy, setBulkBusy] = useState(false);

  // Modals & Drawers
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inlineBusyId, setInlineBusyId] = useState<string | null>(null);

  const isAdmin = data ? data.isAdmin : user?.role !== 'counselor';

  const flashNotice = useCallback((tone: 'ok' | 'err', text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => {
      setNotice((cur) => (cur?.text === text ? null : cur));
    }, 3600);
  }, []);

  const loadApplications = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await authenticatedFetch('/api/admin/applications');
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || json.message || `Request failed (${res.status})`);
        }
        setData(json as ApplicationsApiResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load Application Tracker.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [authenticatedFetch],
  );

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    let cancelled = false;
    authenticatedFetch('/api/admin/applications')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || json.message || `Request failed (${res.status})`);
        return json as ApplicationsApiResponse;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load Application Tracker.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading, authenticatedFetch]);

  const allRows = useMemo(() => data?.rows ?? [], [data]);

  // Step 1 filter: Market + Channel + Destination (used to drive KPI bucket counts accurately)
  const scopedRows = useMemo(() => {
    return allRows.filter((row) => {
      if (marketFilter === 'china' && row.leadMarket !== 'China') return false;
      if (marketFilter === 'bangladesh' && row.leadMarket === 'China') return false;
      if (channelFilter === 'office' && (row.channelType === 'B2B' || row.source === 'B2B' || row.source === 'Agent')) {
        return false;
      }
      if (channelFilter === 'b2b' && row.channelType !== 'B2B' && row.source !== 'B2B' && row.source !== 'Agent') {
        return false;
      }
      if (destinationFilter !== 'all' && row.country !== destinationFilter) return false;
      return true;
    });
  }, [allRows, marketFilter, channelFilter, destinationFilter]);

  // Destination chip counts (within active market + channel)
  const destinationCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of allRows) {
      if (marketFilter === 'china' && row.leadMarket !== 'China') continue;
      if (marketFilter === 'bangladesh' && row.leadMarket === 'China') continue;
      if (channelFilter === 'office' && (row.channelType === 'B2B' || row.source === 'B2B' || row.source === 'Agent')) {
        continue;
      }
      if (channelFilter === 'b2b' && row.channelType !== 'B2B' && row.source !== 'B2B' && row.source !== 'Agent') {
        continue;
      }
      const key = row.country || 'Unknown';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allRows, marketFilter, channelFilter]);

  // Pipeline bucket KPI counts
  const bucketCounts = useMemo(() => {
    const counts = {
      total: scopedRows.length,
      active: 0,
      docs: 0,
      submitted: 0,
      admitted: 0,
      visa: 0,
      flight: 0,
      withdrawn: 0,
      financeReceived: 0,
    };
    for (const r of scopedRows) {
      const b = getStageBucket(r.applicationStage);
      counts[b] += 1;
      if (b !== 'withdrawn') counts.active += 1;
      if (r.financeReceivedTotal) counts.financeReceived += r.financeReceivedTotal;
    }
    return counts;
  }, [scopedRows]);

  // Full filtered rows
  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scopedRows.filter((row) => {
      const bucket = getStageBucket(row.applicationStage);
      if (hideWithdrawn && bucket === 'withdrawn' && bucketFilter !== 'withdrawn') return false;
      if (bucketFilter !== 'all' && bucket !== bucketFilter) return false;
      if (stageFilter !== 'all' && row.applicationStage !== stageFilter) return false;
      if (intakeFilter !== 'all' && (row.assessIntake || 'Unset') !== intakeFilter) return false;
      if (embassyFilter !== 'all' && (row.embassyStatus || 'Pending') !== embassyFilter) return false;
      if (degreeFilter !== 'all' && (row.degree || '') !== degreeFilter) return false;
      if (consultantFilter !== 'all') {
        const matchesEmp = row.assignedEmployeeId === consultantFilter || row.employeeName === consultantFilter;
        if (consultantFilter === '__unassigned__') {
          if (row.assignedEmployeeId || row.employeeName) return false;
        } else if (!matchesEmp) {
          return false;
        }
      }
      if (q) {
        const hit = [
          row.name,
          row.leadRef,
          row.phone,
          row.email,
          row.passport,
          row.university,
          row.uniList,
          row.program,
          row.country,
          row.assessIntake,
          row.referrer,
          row.employeeName,
          row.nationality,
        ].some((val) => val && val.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [
    scopedRows,
    hideWithdrawn,
    bucketFilter,
    stageFilter,
    intakeFilter,
    embassyFilter,
    degreeFilter,
    consultantFilter,
    searchQuery,
  ]);

  const totalPages = pageSize >= 9999 ? 1 : Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    if (pageSize >= 9999) return filteredRows;
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePage]);

  const hasActiveFilters =
    marketFilter !== 'all' ||
    channelFilter !== 'all' ||
    destinationFilter !== 'all' ||
    bucketFilter !== 'all' ||
    stageFilter !== 'all' ||
    intakeFilter !== 'all' ||
    embassyFilter !== 'all' ||
    degreeFilter !== 'all' ||
    consultantFilter !== 'all' ||
    searchQuery.trim().length > 0 ||
    hideWithdrawn;

  const resetFilters = () => {
    setMarketFilter('all');
    setChannelFilter('all');
    setDestinationFilter('all');
    setBucketFilter('all');
    setStageFilter('all');
    setIntakeFilter('all');
    setEmbassyFilter('all');
    setDegreeFilter('all');
    setConsultantFilter('all');
    setSearchQuery('');
    setHideWithdrawn(false);
    setPage(1);
  };

  const handleInlinePatch = async (
    rowId: string,
    patch: { applicationStage?: string; embassyStatus?: string },
    label: string,
  ) => {
    setInlineBusyId(rowId);
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
      };
    });

    try {
      const res = await authenticatedFetch(`/api/admin/applications/${rowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Update failed');
      }
      flashNotice('ok', label);
    } catch (err) {
      flashNotice('err', err instanceof Error ? err.message : 'Inline update failed.');
      void loadApplications(true);
    } finally {
      setInlineBusyId(null);
    }
  };

  const handleBulkAction = async (action: 'set_stage' | 'delete') => {
    if (!isAdmin || selectedIds.size === 0) return;
    if (action === 'delete') {
      const ok = window.confirm(
        `Delete ${selectedIds.size} selected application file(s) permanently? Finance ledger entries will remain preserved.`,
      );
      if (!ok) return;
    }
    setBulkBusy(true);
    try {
      const res = await authenticatedFetch('/api/admin/applications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ids: Array.from(selectedIds),
          ...(action === 'set_stage' ? { stage: bulkStage } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Bulk operation failed.');
      setSelectedIds(new Set());
      flashNotice(
        'ok',
        action === 'delete'
          ? `Deleted ${json.deleted} application file(s).`
          : `Updated ${json.updated} file(s) to ${getStageDef(bulkStage).label}.`,
      );
      await loadApplications(true);
    } catch (err) {
      flashNotice('err', err instanceof Error ? err.message : 'Bulk action failed.');
    } finally {
      setBulkBusy(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Ref ID',
      'Student Name',
      'Market',
      'Channel',
      'Destination',
      'Intake',
      'Degree',
      'Major / Program',
      'Primary University',
      'All Universities',
      'Stage',
      'Embassy Status',
      'Hardcopy Status',
      'Passport',
      'Phone',
      'Email',
      'Nationality',
      'Docs Received',
      'Docs Total',
      'Consultant',
      'Referrer',
      'Visa Deadline',
      'Departure Date',
      ...(isAdmin ? ['Deposit (BDT)', 'Finance Paid (BDT)'] : []),
      'Drive Link',
      'Notes',
    ];

    const lines = [headers.map(csvEscapeCell).join(',')];
    for (const r of filteredRows) {
      const cols = [
        r.leadRef || '',
        r.name,
        r.leadMarket,
        r.channelType,
        r.country,
        r.assessIntake || '',
        r.degree || '',
        r.program || '',
        r.university || '',
        r.uniList || '',
        getStageDef(r.applicationStage).label,
        r.embassyStatus || 'Pending',
        r.hardcopyStatus || 'Pending',
        r.passport || '',
        r.phone,
        r.email,
        r.nationality || '',
        r.docsReceived,
        r.docsTotal,
        r.employeeName || '',
        r.referrer || '',
        r.visaDeadline || '',
        r.departureDate || '',
        ...(isAdmin ? [r.deposit || 0, r.financeReceivedTotal || 0] : []),
        r.driveLink || '',
        r.applicationNotes || '',
      ];
      lines.push(cols.map(csvEscapeCell).join(','));
    }

    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduexpress-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyPortal = (row: ApplicationRowDto) => {
    if (!row.publicToken) return;
    const url = `${window.location.origin}/track/${row.publicToken}`;
    void navigator.clipboard.writeText(url);
    setCopiedId(row.id);
    setTimeout(() => setCopiedId((cur) => (cur === row.id ? null : cur)), 2000);
  };

  const toggleSelectAllPage = () => {
    const pageIds = paginatedRows.map((r) => r.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  };

  const toggleRowSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-[#0f3a5c]" />
          <p className="text-sm font-semibold text-slate-600">Loading Application Tracker...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
        <h2 className="text-lg font-bold">Application Tracker unavailable</h2>
        <p className="mt-2 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => loadApplications()}
          className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const boardColumns: Array<{
    key: ApplicationStageDef['bucket'];
    title: string;
    subtitle: string;
    accent: string;
  }> = [
    { key: 'docs', title: 'Docs & Ready', subtitle: 'Collection & file prep', accent: 'border-t-slate-500' },
    { key: 'submitted', title: 'Submitted & Review', subtitle: 'Applied, interview, deposit', accent: 'border-t-violet-600' },
    { key: 'admitted', title: 'Admitted & JW202', subtitle: 'Offers & DQ forms', accent: 'border-t-emerald-600' },
    { key: 'visa', title: 'Visa Stage', subtitle: 'Embassy & approval', accent: 'border-t-orange-500' },
    { key: 'flight', title: 'Ticket & Flown', subtitle: 'Payment, ticket, arrived', accent: 'border-t-[#0f3a5c]' },
    { key: 'withdrawn', title: 'Withdrawn', subtitle: 'Docs / App withdraw', accent: 'border-t-rose-500' },
  ];

  const uniqueIntakesInScope = Array.from(
    new Set(allRows.map((r) => r.assessIntake || 'Unset')),
  ).sort();

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 pb-16">
      {/* Print-Only Header */}
      <div className="hidden border-b border-slate-300 pb-3 print:block">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">EduExpress International — Application Tracker Roster</h1>
            <p className="text-xs text-slate-600">
              Printed {new Date().toISOString().slice(0, 10)} · {filteredRows.length} student file(s)
              {intakeFilter !== 'all' ? ` · Intake: ${intakeFilter}` : ''}
              {marketFilter !== 'all' ? ` · Market: ${marketFilter}` : ''}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">eduexpressint.com/admin/applications</span>
        </div>
      </div>

      {/* Executive Institutional Header */}
      <section className="rounded-2xl border border-slate-200/90 bg-white px-5 py-5 shadow-xs print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0f3a5c]">
              <FolderKanban size={13} className="text-[#0b7a53]" />
              <span>Admissions &amp; Visa Operations · Dhaka HQ</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-normal text-emerald-800">
                {isAdmin ? 'Full Admin Access' : 'Counselor Scope (Bangladesh)'}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#071c2e] sm:text-[26px]">
              Application Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Excel-grade student admissions register, 17-stage visa pipeline, document checklists &amp; live{' '}
              <span className="font-mono text-slate-700">/track</span> portal sync — replacing external spreadsheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'table'
                    ? 'bg-white text-[#071c2e] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table2 size={13} />
                Excel Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'board'
                    ? 'bg-white text-[#071c2e] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban size={13} />
                Pipeline Board
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={14} />
              CSV
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              type="button"
              onClick={() => loadApplications(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setNewModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#071c2e]"
            >
              <Plus size={15} />
              New Application
            </button>
          </div>
        </div>

        {/* Source Market, Channel & Destination Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Market Switcher (China strictly admin-only) */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMarketFilter('all');
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1 font-bold transition ${
                  marketFilter === 'all' ? 'bg-[#071c2e] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Markets
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarketFilter('bangladesh');
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1 font-bold transition ${
                  marketFilter === 'bangladesh' ? 'bg-[#0b7a53] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bangladesh
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMarketFilter('china');
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1 font-bold transition ${
                    marketFilter === 'china' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  China (Admin)
                </button>
              )}
            </div>

            {/* Channel Switcher */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs">
              {[
                { key: 'all' as const, label: 'All Channels' },
                { key: 'office' as const, label: 'Office (B2C)' },
                { key: 'b2b' as const, label: 'B2B / Agent' },
              ].map((ch) => (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => {
                    setChannelFilter(ch.key);
                    setPage(1);
                  }}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    channelFilter === ch.key ? 'bg-white text-[#071c2e] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setDestinationFilter('all');
                setPage(1);
              }}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
                destinationFilter === 'all'
                  ? 'border-[#0f3a5c] bg-[#0f3a5c] text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe2 size={11} />
              All Dest. ({allRows.length})
            </button>
            {destinationCounts.slice(0, 6).map(([dest, count]) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  setDestinationFilter(dest);
                  setPage(1);
                }}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
                  destinationFilter === dest
                    ? 'border-[#0f3a5c] bg-[#0f3a5c]/10 text-[#071c2e]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {dest} <span className="tabular-nums opacity-70">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {notice && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-bold shadow-xs print:hidden ${
            notice.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            {notice.text}
          </span>
          <button type="button" onClick={() => setNotice(null)} className="text-[11px] underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 6 Clickable Pipeline KPI Buckets */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 print:hidden">
        {[
          {
            key: 'all' as const,
            label: 'Total Files',
            value: bucketCounts.total,
            sub: `${bucketCounts.active} active · ${bucketCounts.withdrawn} withdrawn`,
            icon: FileSpreadsheet,
            accent: 'text-[#071c2e]',
            ring: 'border-[#0f3a5c] bg-[#0f3a5c]/5',
          },
          {
            key: 'docs' as const,
            label: 'Docs & Ready',
            value: bucketCounts.docs,
            sub: 'Collection & file prep',
            icon: FolderOpen,
            accent: 'text-blue-700',
            ring: 'border-blue-400 bg-blue-50/70',
          },
          {
            key: 'submitted' as const,
            label: 'Submitted / Review',
            value: bucketCounts.submitted,
            sub: 'Applied, interview, deposit',
            icon: Building2,
            accent: 'text-violet-700',
            ring: 'border-violet-400 bg-violet-50/70',
          },
          {
            key: 'admitted' as const,
            label: 'Admitted & JW202',
            value: bucketCounts.admitted,
            sub: 'Offers & DQ received',
            icon: ShieldCheck,
            accent: 'text-[#0b7a53]',
            ring: 'border-emerald-400 bg-emerald-50/70',
          },
          {
            key: 'visa' as const,
            label: 'Visa Stage',
            value: bucketCounts.visa,
            sub: 'Embassy & stamped',
            icon: Landmark,
            accent: 'text-orange-700',
            ring: 'border-orange-400 bg-orange-50/70',
          },
          {
            key: 'flight' as const,
            label: 'Ticket / Flown',
            value: bucketCounts.flight,
            sub: 'Air ticket & arrived',
            icon: Plane,
            accent: 'text-emerald-800',
            ring: 'border-emerald-500 bg-emerald-50',
          },
        ].map((card) => {
          const Icon = card.icon;
          const active = bucketFilter === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                setBucketFilter(active && card.key !== 'all' ? 'all' : card.key);
                setStageFilter('all');
                setPage(1);
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? `${card.ring} shadow-xs`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <Icon size={15} className={card.accent} />
              </div>
              <div className={`mt-2 font-heading text-2xl font-bold tabular-nums ${card.accent}`}>
                {card.value}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">{card.sub}</p>
            </button>
          );
        })}
      </section>

      {/* Filter Toolbar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs print:hidden">
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-12">
          {/* Search */}
          <div className="relative md:col-span-4">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search student, Ref ID, passport, phone, university..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Intake Filter */}
          <div className="md:col-span-2">
            <select
              value={intakeFilter}
              onChange={(e) => {
                setIntakeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="all">All Intakes</option>
              {uniqueIntakesInScope.map((intake) => (
                <option key={intake} value={intake}>{intake}</option>
              ))}
            </select>
          </div>

          {/* Exact Stage Filter */}
          <div className="md:col-span-2">
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setBucketFilter('all');
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="all">All 17 Stages</option>
              {APPLICATION_TRACKER_STAGES.map((st) => (
                <option key={st.key} value={st.key}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Embassy Status */}
          <div className="md:col-span-2">
            <select
              value={embassyFilter}
              onChange={(e) => {
                setEmbassyFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="all">Embassy: All</option>
              {EMBASSY_STATUSES.map((st) => (
                <option key={st} value={st}>Embassy: {st}</option>
              ))}
            </select>
          </div>

          {/* Degree / Consultant */}
          <div className="md:col-span-2">
            {isAdmin ? (
              <select
                value={consultantFilter}
                onChange={(e) => {
                  setConsultantFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
              >
                <option value="all">All Counselors</option>
                <option value="__unassigned__">Unassigned</option>
                {(data?.meta.employees ?? []).map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            ) : (
              <select
                value={degreeFilter}
                onChange={(e) => {
                  setDegreeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
              >
                <option value="all">All Degrees</option>
                {(data?.meta.degrees ?? []).map((deg) => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Secondary Filter Strip */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={hideWithdrawn}
                onChange={(e) => {
                  setHideWithdrawn(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-slate-300 text-[#0f3a5c] focus:ring-[#0f3a5c]"
              />
              <EyeOff size={13} className="text-slate-400" />
              Hide Withdrawn ({bucketCounts.withdrawn})
            </label>

            <button
              type="button"
              onClick={() => {
                setBucketFilter(bucketFilter === 'withdrawn' ? 'all' : 'withdrawn');
                setHideWithdrawn(false);
                setPage(1);
              }}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition ${
                bucketFilter === 'withdrawn'
                  ? 'border-rose-400 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              Withdrawn Only ({bucketCounts.withdrawn})
            </button>

            {isAdmin && (
              <select
                value={degreeFilter}
                onChange={(e) => {
                  setDegreeFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">Degree: All</option>
                {(data?.meta.degrees ?? []).map((deg) => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && bucketCounts.financeReceived > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-emerald-900">
                Linked Cash In: {formatBdt(bucketCounts.financeReceived)}
              </span>
            )}
            <span className="font-semibold text-slate-500">
              Showing <strong className="text-slate-900 tabular-nums">{filteredRows.length}</strong> of{' '}
              <span className="tabular-nums">{allRows.length}</span> files
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-bold text-rose-700 hover:underline"
              >
                <FilterX size={13} /> Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Admin Bulk Actions Bar */}
      {isAdmin && selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0f3a5c]/30 bg-[#071c2e] px-4 py-3 text-xs text-white shadow-sm print:hidden">
          <div className="flex items-center gap-2 font-bold">
            <Users2 size={15} className="text-emerald-300" />
            <span>{selectedIds.size} application file(s) selected</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={bulkStage}
              onChange={(e) => setBulkStage(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none"
            >
              {APPLICATION_TRACKER_STAGES.map((st) => (
                <option key={st.key} value={st.key} className="text-slate-900">
                  {st.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction('set_stage')}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Apply Stage
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => handleBulkAction('delete')}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-500 disabled:opacity-50"
            >
              <Trash2 size={13} /> Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg px-2 py-1 text-slate-300 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: EXCEL-GRADE ROSTER TABLE */}
      {viewMode === 'table' ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {isAdmin && (
                    <th className="w-9 px-3 py-3 print:hidden">
                      <input
                        type="checkbox"
                        checked={
                          paginatedRows.length > 0 &&
                          paginatedRows.every((r) => selectedIds.has(r.id))
                        }
                        onChange={toggleSelectAllPage}
                        aria-label="Select all on page"
                        className="rounded border-slate-300 text-[#0f3a5c]"
                      />
                    </th>
                  )}
                  <th className="px-3 py-3">Ref / Student</th>
                  <th className="px-3 py-3">Intake &amp; Dest.</th>
                  <th className="px-3 py-3">University &amp; Program</th>
                  <th className="px-3 py-3">Pipeline Stage</th>
                  <th className="px-3 py-3">Embassy / Visa</th>
                  <th className="px-3 py-3">Docs</th>
                  <th className="px-3 py-3">Counselor / Ref.</th>
                  {isAdmin && <th className="px-3 py-3 text-right">Paid (৳)</th>}
                  <th className="px-3 py-3 text-right print:hidden">File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 10 : 8} className="px-6 py-14 text-center text-slate-500">
                      <p className="font-bold text-slate-700">No application files match the current filters.</p>
                      <p className="mt-1 text-xs">
                        Adjust your search or click <strong>+ New Application</strong> to open a student file.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const stageDef = getStageDef(row.applicationStage);
                    const badgeCls = STAGE_BADGE_CLASSES[stageDef.tone];
                    const docsPct = row.docsTotal > 0 ? Math.round((row.docsReceived / row.docsTotal) * 100) : 0;
                    const safeDrive = toSafeExternalUrl(row.driveLink);
                    const isBusy = inlineBusyId === row.id;

                    return (
                      <tr
                        key={row.id}
                        className="group transition hover:bg-slate-50/80"
                      >
                        {isAdmin && (
                          <td className="px-3 py-3 align-top print:hidden">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(row.id)}
                              onChange={() => toggleRowSelect(row.id)}
                              aria-label={`Select ${row.name}`}
                              className="mt-0.5 rounded border-slate-300 text-[#0f3a5c]"
                            />
                          </td>
                        )}

                        {/* Ref / Student */}
                        <td className="px-3 py-3 align-top">
                          <button
                            type="button"
                            onClick={() => setActiveDrawerId(row.id)}
                            className="text-left"
                          >
                            <div className="flex flex-wrap items-center gap-1.5">
                              {row.leadRef && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0f3a5c]">
                                  {row.leadRef}
                                </span>
                              )}
                              {row.leadMarket === 'China' && (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-900">
                                  CN
                                </span>
                              )}
                              {row.channelType === 'B2B' && (
                                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-indigo-800">
                                  B2B
                                </span>
                              )}
                            </div>
                            <div className="mt-1 font-bold text-slate-900 group-hover:text-[#0f3a5c] group-hover:underline">
                              {row.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {row.phone}
                              {row.passport ? ` · PP ${row.passport}` : ''}
                            </div>
                          </button>
                        </td>

                        {/* Intake & Destination */}
                        <td className="px-3 py-3 align-top">
                          <div className="font-bold text-slate-900">{row.country}</div>
                          <div className="mt-0.5 inline-block rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-[#0f3a5c]">
                            {row.assessIntake || 'Intake TBD'}
                          </div>
                          {row.degree && (
                            <div className="mt-0.5 text-[11px] text-slate-500">{row.degree}</div>
                          )}
                        </td>

                        {/* University & Program */}
                        <td className="max-w-[230px] px-3 py-3 align-top">
                          <div className="truncate font-semibold text-slate-800" title={row.university || row.uniList || ''}>
                            {row.university || row.uniList || <span className="text-slate-400">Not assigned</span>}
                          </div>
                          {row.program && (
                            <div className="mt-0.5 truncate text-[11px] text-slate-500" title={row.program}>
                              {row.program}
                            </div>
                          )}
                          {row.uniTotal > 0 && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-600">
                                {row.uniTotal} uni{row.uniTotal > 1 ? 's' : ''}
                              </span>
                              {row.uniAdmitted > 0 && (
                                <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-800">
                                  {row.uniAdmitted} admitted
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Inline Stage Dropdown */}
                        <td className="px-3 py-3 align-top">
                          <select
                            disabled={isBusy}
                            value={stageDef.key}
                            onChange={(e) =>
                              handleInlinePatch(
                                row.id,
                                { applicationStage: e.target.value },
                                `${row.name} moved to ${getStageDef(e.target.value).label}`,
                              )
                            }
                            className={`w-full max-w-[170px] rounded-lg border px-2 py-1 text-[11px] font-bold focus:outline-none print:border-0 print:bg-transparent ${badgeCls}`}
                          >
                            {APPLICATION_TRACKER_STAGES.map((st) => (
                              <option key={st.key} value={st.key} className="bg-white text-slate-900">
                                {st.shortLabel}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Inline Embassy Dropdown */}
                        <td className="px-3 py-3 align-top">
                          <select
                            disabled={isBusy}
                            value={row.embassyStatus || 'Pending'}
                            onChange={(e) =>
                              handleInlinePatch(
                                row.id,
                                { embassyStatus: e.target.value },
                                `${row.name} embassy status: ${e.target.value}`,
                              )
                            }
                            className={`rounded-lg border px-2 py-1 text-[11px] font-bold focus:outline-none ${
                              row.embassyStatus === 'Done'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : row.embassyStatus === 'Submitted' || row.embassyStatus === 'Processing'
                                  ? 'border-blue-200 bg-blue-50 text-blue-800'
                                  : row.embassyStatus === 'Rejected'
                                    ? 'border-rose-200 bg-rose-50 text-rose-800'
                                    : 'border-slate-200 bg-white text-slate-600'
                            }`}
                          >
                            {EMBASSY_STATUSES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                          {row.visaDeadline && (
                            <div className="mt-1 font-mono text-[10px] text-slate-500">
                              Visa: {row.visaDeadline}
                            </div>
                          )}
                        </td>

                        {/* Docs Ratio */}
                        <td className="px-3 py-3 align-top">
                          <div className="w-20">
                            <div className="flex items-center justify-between text-[11px] font-bold tabular-nums text-slate-700">
                              <span>
                                {row.docsReceived}/{row.docsTotal}
                              </span>
                              <span className="text-[10px] text-slate-400">{docsPct}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full rounded-full ${
                                  docsPct >= 100 ? 'bg-[#0b7a53]' : docsPct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                                }`}
                                style={{ width: `${docsPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Consultant / Referrer */}
                        <td className="px-3 py-3 align-top">
                          <div className="font-semibold text-slate-800">
                            {row.employeeName || <span className="text-slate-400">Unassigned</span>}
                          </div>
                          {row.referrer && (
                            <div className="mt-0.5 text-[11px] text-slate-500">Ref: {row.referrer}</div>
                          )}
                        </td>

                        {/* Admin-Only Finance Column */}
                        {isAdmin && (
                          <td className="px-3 py-3 text-right align-top tabular-nums">
                            {row.financeReceivedTotal && row.financeReceivedTotal > 0 ? (
                              <div className="font-bold text-[#0b7a53]">
                                {formatBdt(row.financeReceivedTotal)}
                              </div>
                            ) : row.deposit > 0 ? (
                              <div className="font-semibold text-slate-700">
                                {formatBdt(row.deposit)}
                                <span className="block text-[10px] font-normal text-slate-400">Deposit</span>
                              </div>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        )}

                        {/* Row Quick Actions */}
                        <td className="px-3 py-3 text-right align-top print:hidden">
                          <div className="inline-flex items-center justify-end gap-1">
                            {safeDrive && (
                              <a
                                href={safeDrive}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-emerald-700 hover:bg-emerald-50"
                                title="Open Google Drive folder"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            {row.publicToken && (
                              <button
                                type="button"
                                onClick={() => handleCopyPortal(row)}
                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
                                title="Copy student live /track/ portal link"
                              >
                                {copiedId === row.id ? (
                                  <Check size={13} className="text-emerald-600" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setActiveDrawerId(row.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#0f3a5c]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#071c2e] transition hover:bg-[#0f3a5c] hover:text-white"
                            >
                              Open <ArrowRight size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-xs print:hidden">
            <div className="flex items-center gap-2 text-slate-600">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-bold text-slate-800 focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={9999}>All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-slate-600">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* VIEW 2: PIPELINE KANBAN BOARD */
        <section className="flex gap-4 overflow-x-auto pb-4">
          {boardColumns.map((col) => {
            const items = filteredRows.filter((r) => getStageBucket(r.applicationStage) === col.key);
            if (col.key === 'withdrawn' && hideWithdrawn && items.length === 0) return null;
            return (
              <div
                key={col.key}
                className={`flex w-72 shrink-0 flex-col rounded-2xl border border-slate-200 border-t-4 bg-slate-50/70 ${col.accent}`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-3 rounded-t-xl">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#071c2e]">{col.title}</h3>
                    <p className="text-[10px] text-slate-500">{col.subtitle}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold tabular-nums text-slate-700">
                    {items.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5 p-2.5 max-h-[68vh] overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="py-8 text-center text-[11px] text-slate-400">No files</p>
                  ) : (
                    items.map((row) => {
                      const stageDef = getStageDef(row.applicationStage);
                      const badgeCls = STAGE_BADGE_CLASSES[stageDef.tone];
                      return (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() => setActiveDrawerId(row.id)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-2xs transition hover:border-[#0f3a5c]/50 hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[10px] font-bold text-[#0f3a5c]">
                              {row.leadRef || 'FILE'}
                            </span>
                            <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${badgeCls}`}>
                              {stageDef.shortLabel}
                            </span>
                          </div>
                          <div className="mt-1.5 text-xs font-bold text-slate-900">{row.name}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.country} · {row.assessIntake || 'Intake TBD'}
                          </div>
                          {row.university && (
                            <div className="mt-1 truncate text-[11px] font-medium text-slate-700">
                              {row.university}
                            </div>
                          )}
                          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                            <span className="tabular-nums font-semibold">
                              Docs {row.docsReceived}/{row.docsTotal}
                            </span>
                            <span>{row.employeeName || 'Unassigned'}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* New / Promote Application Modal */}
      <NewApplicationModal
        open={newModalOpen}
        isAdmin={isAdmin}
        employees={data?.meta.employees ?? []}
        intakes={data?.meta.intakes ?? []}
        destinations={data?.meta.destinations ?? []}
        universities={data?.meta.universities ?? []}
        referrers={data?.meta.referrers ?? []}
        promotableLeads={data?.meta.promotableLeads ?? []}
        onClose={() => setNewModalOpen(false)}
        onCreated={(createdId) => {
          flashNotice('ok', 'Application file opened and synced with document checklist.');
          void loadApplications(true);
          setActiveDrawerId(createdId);
        }}
      />

      {/* Slide-Over Student Dossier Drawer */}
      <ApplicationDetailDrawer
        applicationId={activeDrawerId}
        isAdmin={isAdmin}
        employees={data?.meta.employees ?? []}
        onClose={() => setActiveDrawerId(null)}
        onMutated={() => void loadApplications(true)}
      />
    </div>
  );
}

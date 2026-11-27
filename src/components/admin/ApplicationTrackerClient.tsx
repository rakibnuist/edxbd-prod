'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
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
  Handshake,
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
  UserCheck,
  Users2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatBdt } from '@/lib/finance-logic';
import { canAccessFinanceRole } from '@/lib/roles';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { categorizeLeadSource, formatFriendlySource, getSourceCategoryDef } from '@/lib/lead-sources';
import {
  APPLICATION_TRACKER_STAGES,
  EMBASSY_STATUSES,
  INTAKE_SESSION_OPTIONS,
  extractIntakeSession,
  extractIntakeYear,
  getIntakeSortValue,
  getStageBucket,
  getStageDef,
  type ApplicationRowDto,
  type ApplicationStageDef,
  type IntakeSessionKey,
} from '@/lib/application-tracker';
import NewApplicationModal, {
  type PromotableLeadOption,
  type TrackerEmployeeOption,
} from '@/components/admin/NewApplicationModal';
import ApplicationDetailDrawer from '@/components/admin/ApplicationDetailDrawer';

interface ApplicationsApiResponse {
  isAdmin: boolean;
  canAccessFinance?: boolean;
  stages: ApplicationStageDef[];
  rows: ApplicationRowDto[];
  meta: {
    employees: TrackerEmployeeOption[];
    destinations: string[];
    intakes: string[];
    universities: string[];
    programs?: string[];
    catalogUniversities?: Array<{ name: string; country: string; majors: string[] }>;
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
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function isB2BRow(row: ApplicationRowDto): boolean {
  return row.channelType === 'B2B' || row.source === 'B2B' || row.source === 'Agent';
}

export default function ApplicationTrackerClient() {
  const { user, isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [data, setData] = useState<ApplicationsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // Executive view controls
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Primary Multi-Dimensional Filters: Year, Intake Session, Channel (B2C/B2B), Counselor, Destination
  const [yearFilter, setYearFilter] = useState<string>('2027');
  const [sessionFilter, setSessionFilter] = useState<'all' | IntakeSessionKey>('all');
  const [exactIntakeFilter, setExactIntakeFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<'all' | 'b2c' | 'b2b' | 'paid' | 'organic' | 'whatsapp' | 'in_house'>('all');
  const [counselorFilter, setCounselorFilter] = useState<string>('all');
  const [referrerFilter, setReferrerFilter] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  // Pipeline & Secondary Filters
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [embassyFilter, setEmbassyFilter] = useState<string>('all');
  const [degreeFilter, setDegreeFilter] = useState<string>('all');
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
  const canAccessFinance = data ? Boolean(data.canAccessFinance) : canAccessFinanceRole(user?.role);

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

  const allRows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data]);
  const employees = useMemo(
    () => (Array.isArray(data?.meta?.employees) ? data.meta.employees : []),
    [data],
  );

  // 1. Academic Year counts across all records
  const yearBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of allRows) {
      const yr = extractIntakeYear(r.assessIntake);
      map.set(yr, (map.get(yr) || 0) + 1);
    }
    const order = ['2027', '2026', '2028', 'Unscheduled'];
    return Array.from(map.entries()).sort((a, b) => {
      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [allRows]);

  // 2. Intake Session counts (within active Year filter)
  const sessionCounts = useMemo(() => {
    const counts: Record<IntakeSessionKey, number> = {
      March: 0,
      September: 0,
      January: 0,
      Other: 0,
    };
    for (const r of allRows) {
      if (yearFilter !== 'all' && extractIntakeYear(r.assessIntake) !== yearFilter) continue;
      const sess = extractIntakeSession(r.assessIntake);
      counts[sess] = (counts[sess] || 0) + 1;
    }
    return counts;
  }, [allRows, yearFilter]);

  // 3. Exact Year+Session Cohort pills (sorted chronologically descending)
  const cohortBreakdown = useMemo(() => {
    const map = new Map<
      string,
      { term: string; year: string; session: IntakeSessionKey; total: number; active: number; withdrawn: number }
    >();
    for (const r of allRows) {
      const term = r.assessIntake || 'Unscheduled';
      const cur = map.get(term) || {
        term,
        year: extractIntakeYear(r.assessIntake),
        session: extractIntakeSession(r.assessIntake),
        total: 0,
        active: 0,
        withdrawn: 0,
      };
      cur.total += 1;
      if (getStageBucket(r.applicationStage) === 'withdrawn') cur.withdrawn += 1;
      else cur.active += 1;
      map.set(term, cur);
    }
    return Array.from(map.values()).sort((a, b) => getIntakeSortValue(b.term) - getIntakeSortValue(a.term));
  }, [allRows]);

  // 4. Rows scoped by Year + Session + Exact Intake (used to compute Channel & Counselor counts)
  const timeScopedRows = useMemo(() => {
    return allRows.filter((r) => {
      if (yearFilter !== 'all' && extractIntakeYear(r.assessIntake) !== yearFilter) return false;
      if (sessionFilter !== 'all' && extractIntakeSession(r.assessIntake) !== sessionFilter) return false;
      if (exactIntakeFilter !== 'all' && (r.assessIntake || 'Unscheduled') !== exactIntakeFilter) return false;
      return true;
    });
  }, [allRows, yearFilter, sessionFilter, exactIntakeFilter]);

  // 5. Channel (B2C Direct vs B2B Partner) breakdown within active time scope
  const channelCounts = useMemo(() => {
    let b2c = 0;
    let b2b = 0;
    const partnerMap = new Map<string, number>();
    for (const r of timeScopedRows) {
      if (isB2BRow(r)) {
        b2b += 1;
        const pName = (r.referrer || 'Partner Agent').trim();
        partnerMap.set(pName, (partnerMap.get(pName) || 0) + 1);
      } else {
        b2c += 1;
      }
    }
    const topPartners = Array.from(partnerMap.entries()).sort((a, b) => b[1] - a[1]);
    return { total: timeScopedRows.length, b2c, b2b, topPartners };
  }, [timeScopedRows]);

  // 6. Counselor Desk breakdown within active Year/Intake + Channel scope
  const counselorBreakdown = useMemo(() => {
    const byId = new Map<
      string,
      {
        id: string;
        name: string;
        total: number;
        active: number;
        submittedOrAdmitted: number;
        flown: number;
      }
    >();

    for (const emp of employees) {
      byId.set(emp.id, {
        id: emp.id,
        name: emp.name,
        total: 0,
        active: 0,
        submittedOrAdmitted: 0,
        flown: 0,
      });
    }

    let unassignedTotal = 0;
    let unassignedActive = 0;

    for (const r of timeScopedRows) {
      if (channelFilter === 'b2c' && isB2BRow(r)) continue;
      if (channelFilter === 'b2b' && !isB2BRow(r)) continue;
      if (['paid', 'organic', 'whatsapp', 'in_house'].includes(channelFilter)) {
        const cat = categorizeLeadSource(r.source, null, r.channelType);
        if (cat !== channelFilter) continue;
      }

      const bucket = getStageBucket(r.applicationStage);
      const isWithdrawn = bucket === 'withdrawn';
      const isOfferOrSub = bucket === 'submitted' || bucket === 'admitted' || bucket === 'visa';
      const isFlown = bucket === 'flight';

      const entry = r.assignedEmployeeId ? byId.get(r.assignedEmployeeId) : null;
      if (entry) {
        entry.total += 1;
        if (!isWithdrawn) entry.active += 1;
        if (isOfferOrSub) entry.submittedOrAdmitted += 1;
        if (isFlown) entry.flown += 1;
      } else {
        unassignedTotal += 1;
        if (!isWithdrawn) unassignedActive += 1;
      }
    }

    const list = Array.from(byId.values())
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    return { list, unassignedTotal, unassignedActive };
  }, [timeScopedRows, employees, channelFilter]);

  // 7. Scoped rows (Year + Session + Exact Intake + Channel + Counselor + Referrer + Destination) -> drives 6 Stage KPI buckets
  const scopedRows = useMemo(() => {
    return timeScopedRows.filter((row) => {
      if (channelFilter === 'b2c' && isB2BRow(row)) return false;
      if (channelFilter === 'b2b' && !isB2BRow(row)) return false;
      if (['paid', 'organic', 'whatsapp', 'in_house'].includes(channelFilter)) {
        const cat = categorizeLeadSource(row.source, null, row.channelType);
        if (cat !== channelFilter) return false;
      }
      if (counselorFilter !== 'all') {
        if (counselorFilter === '__unassigned__') {
          if (row.assignedEmployeeId || row.employeeName) return false;
        } else if (row.assignedEmployeeId !== counselorFilter && row.employeeName !== counselorFilter) {
          return false;
        }
      }
      if (referrerFilter !== 'all' && (row.referrer || '') !== referrerFilter) return false;
      if (destinationFilter !== 'all' && row.country !== destinationFilter) return false;
      return true;
    });
  }, [timeScopedRows, channelFilter, counselorFilter, referrerFilter, destinationFilter]);

  // Destination chip counts (within active Year/Intake + Channel + Counselor)
  const destinationCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of timeScopedRows) {
      if (channelFilter === 'b2c' && isB2BRow(row)) continue;
      if (channelFilter === 'b2b' && !isB2BRow(row)) continue;
      if (counselorFilter !== 'all') {
        if (counselorFilter === '__unassigned__') {
          if (row.assignedEmployeeId || row.employeeName) continue;
        } else if (row.assignedEmployeeId !== counselorFilter && row.employeeName !== counselorFilter) {
          continue;
        }
      }
      const key = row.country || 'Unknown';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [timeScopedRows, channelFilter, counselorFilter]);

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

  // Full filtered rows for Table & Kanban Board
  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scopedRows.filter((row) => {
      const bucket = getStageBucket(row.applicationStage);
      if (hideWithdrawn && bucket === 'withdrawn' && bucketFilter !== 'withdrawn') return false;
      if (bucketFilter !== 'all' && bucket !== bucketFilter) return false;
      if (stageFilter !== 'all' && row.applicationStage !== stageFilter) return false;
      if (embassyFilter !== 'all' && (row.embassyStatus || 'Pending') !== embassyFilter) return false;
      if (degreeFilter !== 'all' && (row.degree || '') !== degreeFilter) return false;
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
    embassyFilter,
    degreeFilter,
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
    yearFilter !== '2027' ||
    sessionFilter !== 'all' ||
    exactIntakeFilter !== 'all' ||
    channelFilter !== 'all' ||
    counselorFilter !== 'all' ||
    referrerFilter !== 'all' ||
    destinationFilter !== 'all' ||
    bucketFilter !== 'all' ||
    stageFilter !== 'all' ||
    embassyFilter !== 'all' ||
    degreeFilter !== 'all' ||
    searchQuery.trim().length > 0 ||
    hideWithdrawn;

  const resetFilters = () => {
    setYearFilter('2027');
    setSessionFilter('all');
    setExactIntakeFilter('all');
    setChannelFilter('all');
    setCounselorFilter('all');
    setReferrerFilter('all');
    setDestinationFilter('all');
    setBucketFilter('all');
    setStageFilter('all');
    setEmbassyFilter('all');
    setDegreeFilter('all');
    setSearchQuery('');
    setHideWithdrawn(false);
    setPage(1);
  };

  const handleInlinePatch = async (
    rowId: string,
    patch: { applicationStage?: string; embassyStatus?: string; assignedEmployeeId?: string | null; channelType?: string },
    label: string,
  ) => {
    setInlineBusyId(rowId);
    const matchedEmp =
      patch.assignedEmployeeId !== undefined
        ? employees.find((e) => e.id === patch.assignedEmployeeId) || null
        : undefined;

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) =>
          r.id === rowId
            ? {
                ...r,
                ...patch,
                ...(matchedEmp !== undefined
                  ? {
                      assignedEmployeeId: matchedEmp?.id || null,
                      assignedTo: matchedEmp?.name || null,
                      employeeName: matchedEmp?.name || null,
                    }
                  : {}),
              }
            : r,
        ),
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
      'Intake Year',
      'Intake Session',
      'Full Intake',
      'Channel (B2C/B2B)',
      'Source Channel',
      'Acquisition Source',
      'Counselor',
      'Partner / Reference',
      'Destination',
      'Degree',
      'Major / Program',
      'Primary University',
      'All Universities',
      'Pipeline Stage',
      'Embassy Status',
      'Hardcopy Status',
      'Passport',
      'Phone',
      'Email',
      'Nationality',
      'Docs Received',
      'Docs Total',
      'Visa Deadline',
      'Departure Date',
      ...(canAccessFinance ? ['Deposit (BDT)', 'Finance Paid (BDT)'] : []),
      'Drive Link',
      'Notes',
    ];

    const lines = [headers.map(csvEscapeCell).join(',')];
    for (const r of filteredRows) {
      const cols = [
        r.leadRef || '',
        r.name,
        extractIntakeYear(r.assessIntake),
        extractIntakeSession(r.assessIntake),
        r.assessIntake || '',
        isB2BRow(r) ? 'B2B Partner' : 'B2C Direct',
        getSourceCategoryDef(categorizeLeadSource(r.source, null, r.channelType)).label,
        r.source || 'In-House',
        r.employeeName || 'Unassigned',
        r.referrer || '',
        r.country,
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
        r.visaDeadline || '',
        r.departureDate || '',
        ...(canAccessFinance ? [r.deposit || 0, r.financeReceivedTotal || 0] : []),
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
          <p className="text-sm font-semibold text-slate-600">Loading EduExpress Application Tracker...</p>
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

  const b2cPct = channelCounts.total > 0 ? Math.round((channelCounts.b2c / channelCounts.total) * 100) : 0;
  const b2bPct = channelCounts.total > 0 ? 100 - b2cPct : 0;

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 pb-16">
      {/* Print-Only Institutional Header */}
      <div className="hidden border-b border-slate-300 pb-3 print:block">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">EduExpress International — Admissions &amp; Visa Register</h1>
            <p className="text-xs text-slate-600">
              Printed {new Date().toISOString().slice(0, 10)} · {filteredRows.length} student file(s)
              {yearFilter !== 'all' ? ` · Year: ${yearFilter}` : ''}
              {sessionFilter !== 'all' ? ` · Intake: ${sessionFilter}` : ''}
              {channelFilter !== 'all' ? ` · Channel: ${channelFilter.toUpperCase()}` : ''}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">eduexpressint.com/admin/applications</span>
        </div>
      </div>

      {/* Executive Institutional Command Bar */}
      <section className="rounded-2xl border border-slate-200/90 bg-white px-5 py-5 shadow-xs print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0f3a5c]">
              <FolderKanban size={13} className="text-[#0b7a53]" />
              <span>EduExpress International · Dhaka HQ Operations</span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-normal text-emerald-800">
                {allRows.length} Active Files · 2026–2027 Cohorts
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#071c2e] sm:text-[26px]">
              Application &amp; Visa Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Segmented by <strong>Academic Year</strong>, <strong>Intake Session</strong>,{' '}
              <strong>Channel (B2C Direct vs B2B Partner)</strong> &amp; <strong>Counselor Desk</strong> — synced with live{' '}
              <span className="font-mono text-slate-700">/track</span> student portals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAnalytics((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                showAnalytics
                  ? 'border-[#0f3a5c]/30 bg-[#0f3a5c]/8 text-[#071c2e]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 size={14} className="text-[#0f3a5c]" />
              {showAnalytics ? 'Hide Insights' : 'Cohort Insights'}
            </button>

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
                Excel Register
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

        {/* EXECUTIVE DROPDOWN MENU SYSTEM */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {/* 1. Academic Cohort Dropdown */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <Calendar size={11} className="text-[#0f3a5c]" /> Cohort / Year
              </label>
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setExactIntakeFilter('all');
                  setPage(1);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-bold transition focus:border-[#0f3a5c] focus:outline-none ${
                  yearFilter === '2027'
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-extrabold'
                    : yearFilter === '2026'
                      ? 'border-sky-300 bg-sky-50/70 text-[#0f3a5c]'
                      : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <option value="2027">
                  2027 Admissions (Active Cohort · {yearBreakdown.find(([y]) => y === '2027')?.[1] || 0})
                </option>
                <option value="2026">
                  2026 Admissions (Historical Archive · {yearBreakdown.find(([y]) => y === '2026')?.[1] || 0})
                </option>
                <option value="all">All Admissions (Full History · {allRows.length})</option>
                {yearBreakdown
                  .filter(([y]) => y !== '2027' && y !== '2026' && y !== 'Unscheduled')
                  .map(([yr, count]) => (
                    <option key={yr} value={yr}>
                      {yr} Admissions ({count})
                    </option>
                  ))}
              </select>
            </div>

            {/* 2. Intake Session Dropdown */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Intake Session
              </label>
              <select
                value={sessionFilter}
                onChange={(e) => {
                  setSessionFilter(e.target.value as 'all' | IntakeSessionKey);
                  setExactIntakeFilter('all');
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0f3a5c] focus:outline-none"
              >
                <option value="all">All {yearFilter === 'all' ? '' : yearFilter + ' '}Intakes (General View)</option>
                {INTAKE_SESSION_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label} ({sessionCounts[opt.key] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Channel (B2C Direct vs B2B Partner) */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <Handshake size={11} className="text-[#0b7a53]" /> Channel
              </label>
              <select
                value={channelFilter}
                onChange={(e) => {
                  const nextChannel = e.target.value as any;
                  setChannelFilter(nextChannel);
                  if (nextChannel !== 'b2b') setReferrerFilter('all');
                  setPage(1);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold transition focus:border-[#0f3a5c] focus:outline-none ${
                  channelFilter === 'b2c'
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 font-bold'
                    : channelFilter === 'b2b'
                      ? 'border-indigo-300 bg-indigo-50/70 text-indigo-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <option value="all">All Channels &amp; Sources ({channelCounts.total})</option>
                <optgroup label="Main Channels">
                  <option value="b2c">EduExpress Direct · B2C ({channelCounts.b2c})</option>
                  <option value="b2b">Partner Network · B2B ({channelCounts.b2b})</option>
                </optgroup>
                <optgroup label="Acquisition Source">
                  <option value="paid">🟣 Paid Ads (Meta / PPC)</option>
                  <option value="organic">🟢 Organic (Website / SEO)</option>
                  <option value="whatsapp">💬 WhatsApp Inbound</option>
                  <option value="in_house">🏢 Office Walk-in / In-House</option>
                </optgroup>
              </select>
            </div>

            {/* 4. B2B Partner Agent (Sub-Filter) */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <Building2 size={11} className="text-indigo-600" /> B2B Partner Agent
              </label>
              <select
                value={referrerFilter}
                onChange={(e) => {
                  setReferrerFilter(e.target.value);
                  if (e.target.value !== 'all') setChannelFilter('b2b');
                  setPage(1);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:border-[#0f3a5c] focus:outline-none ${
                  referrerFilter !== 'all'
                    ? 'border-indigo-400 bg-indigo-50 font-bold text-indigo-950'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <option value="all">All Partner Agents ({channelCounts.topPartners.length})</option>
                {channelCounts.topPartners.map(([partner, count]) => (
                  <option key={partner} value={partner}>
                    {partner} ({count} files)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Counselor Desk */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <UserCheck size={11} className="text-[#0f3a5c]" /> Counselor Desk
              </label>
              <select
                value={counselorFilter}
                onChange={(e) => {
                  setCounselorFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:border-[#0f3a5c] focus:outline-none ${
                  counselorFilter !== 'all'
                    ? 'border-[#0f3a5c] bg-[#0f3a5c]/8 font-bold text-[#071c2e]'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <option value="all">All Counselors ({counselorBreakdown.list.length})</option>
                {counselorBreakdown.list.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.total} files · {c.active} active)
                  </option>
                ))}
                {counselorBreakdown.unassignedTotal > 0 && (
                  <option value="__unassigned__">
                    Partner / Unassigned Desk ({counselorBreakdown.unassignedTotal})
                  </option>
                )}
              </select>
            </div>

            {/* 6. Destination Corridor */}
            <div>
              <label className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                <Globe2 size={11} className="text-[#0b7a53]" /> Destination Corridor
              </label>
              <select
                value={destinationFilter}
                onChange={(e) => {
                  setDestinationFilter(e.target.value);
                  setPage(1);
                }}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:border-[#0f3a5c] focus:outline-none ${
                  destinationFilter !== 'all'
                    ? 'border-[#0b7a53] bg-emerald-50 font-bold text-emerald-950'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                <option value="all">All Destinations ({destinationCounts.length})</option>
                {destinationCounts.map(([dest, count]) => (
                  <option key={dest} value={dest}>
                    {dest} ({count} files)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE COHORT, CHANNEL & COUNSELOR INTELLIGENCE BOARD */}
      {showAnalytics && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 print:hidden">
          {/* Card 1: Intake & Year Cohort Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#071c2e]">
                  Intake &amp; Year Cohorts
                </h2>
                <p className="text-[11px] text-slate-500">Click any semester cohort to isolate roster</p>
              </div>
              <Calendar size={15} className="text-[#0f3a5c]" />
            </div>
            <div className="mt-3 space-y-2">
              {cohortBreakdown.map((c) => {
                if (c.total <= 0) return null;
                const isSelected =
                  exactIntakeFilter === c.term ||
                  (yearFilter === c.year && sessionFilter === c.session && c.session !== 'Other');
                const pct = allRows.length > 0 ? Math.round((c.total / allRows.length) * 100) : 0;
                return (
                  <button
                    key={c.term}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setExactIntakeFilter('all');
                        setYearFilter('all');
                        setSessionFilter('all');
                      } else {
                        setExactIntakeFilter(c.term);
                        setYearFilter(c.year);
                        setSessionFilter(c.session !== 'Other' ? c.session : 'all');
                      }
                      setPage(1);
                    }}
                    className={`w-full rounded-xl border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-[#0f3a5c] bg-[#0f3a5c]/5 ring-1 ring-[#0f3a5c]'
                        : 'border-slate-100 bg-slate-50/70 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-extrabold ${
                            c.year === '2027'
                              ? 'bg-emerald-100 text-emerald-900'
                              : c.year === '2026'
                                ? 'bg-sky-100 text-[#0f3a5c]'
                                : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {c.year}
                        </span>
                        <span className="font-bold text-slate-900">{c.term}</span>
                      </div>
                      <span className="font-bold tabular-nums text-slate-800">
                        {c.total} <span className="text-[10px] font-normal text-slate-500">({c.active} active)</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${c.year === '2027' ? 'bg-[#0b7a53]' : 'bg-[#0f3a5c]'}`}
                        style={{ width: `${Math.max(6, pct)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: B2C Direct vs B2B Partner Network */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#071c2e]">
                  B2C Direct vs B2B Partner Split
                </h2>
                <p className="text-[11px] text-slate-500">
                  In-house Dhaka desk vs external sub-agent network
                </p>
              </div>
              <Handshake size={15} className="text-[#0b7a53]" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setChannelFilter(channelFilter === 'b2c' ? 'all' : 'b2c');
                  setPage(1);
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  channelFilter === 'b2c'
                    ? 'border-[#0b7a53] bg-emerald-50/80 ring-1 ring-[#0b7a53]'
                    : 'border-slate-200 bg-slate-50/60 hover:border-emerald-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0b7a53]">
                  EduExpress Direct (B2C)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-heading text-xl font-bold tabular-nums text-slate-900">
                    {channelCounts.b2c}
                  </span>
                  <span className="text-xs font-bold tabular-nums text-[#0b7a53]">{b2cPct}%</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setChannelFilter(channelFilter === 'b2b' ? 'all' : 'b2b');
                  setPage(1);
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  channelFilter === 'b2b'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                  Partner Agents (B2B)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-heading text-xl font-bold tabular-nums text-slate-900">
                    {channelCounts.b2b}
                  </span>
                  <span className="text-xs font-bold tabular-nums text-indigo-700">{b2bPct}%</span>
                </div>
              </button>
            </div>

            {/* Split Bar */}
            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="bg-[#0b7a53] transition-all" style={{ width: `${b2cPct}%` }} />
              <div className="bg-indigo-600 transition-all" style={{ width: `${b2bPct}%` }} />
            </div>

            {/* Top B2B Partners */}
            <div className="mt-3.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Active B2B Partners &amp; Referrers (Click to Filter)
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {channelCounts.topPartners.length === 0 ? (
                  <span className="text-[11px] text-slate-400">No B2B partners in current scope</span>
                ) : (
                  channelCounts.topPartners.map(([partner, count]) => {
                    const active = referrerFilter === partner;
                    return (
                      <button
                        key={partner}
                        type="button"
                        onClick={() => {
                          setReferrerFilter(active ? 'all' : partner);
                          setChannelFilter(active ? 'all' : 'b2b');
                          setPage(1);
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition ${
                          active
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {partner} <span className="tabular-nums opacity-75">({count})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Counselor Desk Workload & Conversion */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#071c2e]">
                  Counselor Desk Caseload
                </h2>
                <p className="text-[11px] text-slate-500">
                  Click any counselor to inspect their assigned student files
                </p>
              </div>
              <UserCheck size={15} className="text-[#0f3a5c]" />
            </div>

            <div className="mt-3 space-y-2">
              {counselorBreakdown.list.map((c) => {
                const active = counselorFilter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCounselorFilter(active ? 'all' : c.id);
                      setPage(1);
                    }}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      active
                        ? 'border-[#0f3a5c] bg-[#0f3a5c]/5 ring-1 ring-[#0f3a5c]'
                        : 'border-slate-100 bg-slate-50/70 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="font-bold tabular-nums text-[#0f3a5c]">{c.total} files</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                      <span className="text-emerald-700">{c.active} active</span>
                      <span>·</span>
                      <span className="text-violet-700">{c.submittedOrAdmitted} applied/offer</span>
                      {c.flown > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-[#0b7a53]">{c.flown} flown/ticket</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}

              {counselorBreakdown.unassignedTotal > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setCounselorFilter(counselorFilter === '__unassigned__' ? 'all' : '__unassigned__');
                    setPage(1);
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                    counselorFilter === '__unassigned__'
                      ? 'border-amber-600 bg-amber-50/80 ring-1 ring-amber-600'
                      : 'border-dashed border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">B2B Partner / Unassigned Desk</span>
                    <span className="font-bold tabular-nums text-amber-800">
                      {counselorBreakdown.unassignedTotal} files
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {counselorBreakdown.unassignedActive} active files — assign a counselor inline in the table below
                  </p>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

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
            label: 'Total in Scope',
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

      {/* Search & Granular Filter Toolbar */}
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
              placeholder="Search student, Ref ID, passport, university, partner..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Exact Stage Filter */}
          <div className="md:col-span-3">
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setBucketFilter('all');
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="all">Stage: All 17 Milestones</option>
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

          {/* Degree */}
          <div className="md:col-span-3">
            <select
              value={degreeFilter}
              onChange={(e) => {
                setDegreeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="all">Degree Level: All</option>
              {(data?.meta.degrees ?? []).map((deg) => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>
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
          </div>

          <div className="flex items-center gap-3">
            {canAccessFinance && bucketCounts.financeReceived > 0 && (
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
                <FilterX size={13} /> Reset All Filters
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

      {/* VIEW 1: EXCEL-GRADE ROSTER TABLE & MOBILE ADAPTIVE CARDS */}
      {viewMode === 'table' ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          {/* Mobile Adaptive Cards (Screens < 768px) */}
          <div className="divide-y divide-slate-100 md:hidden print:hidden">
            {paginatedRows.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-500">
                <p className="font-bold text-slate-700">No application files match the current filters.</p>
                <p className="mt-1 text-xs">Reset filters or tap + New Application.</p>
              </div>
            ) : (
              paginatedRows.map((row) => {
                const stageDef = getStageDef(row.applicationStage);
                const badgeCls = STAGE_BADGE_CLASSES[stageDef.tone];
                const docsPct = row.docsTotal > 0 ? Math.round((row.docsReceived / row.docsTotal) * 100) : 0;
                const safeDrive = toSafeExternalUrl(row.driveLink);
                const isBusy = inlineBusyId === row.id;
                const b2b = isB2BRow(row);

                return (
                  <div key={`m-${row.id}`} className="space-y-2.5 p-3.5 transition hover:bg-slate-50/60">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                            {row.leadRef || 'FILE'}
                          </span>
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            {row.country || 'Target'}
                          </span>
                          {b2b && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800">
                              B2B
                            </span>
                          )}
                          {row.source && (() => {
                            const cat = categorizeLeadSource(row.source, null, row.channelType);
                            const def = getSourceCategoryDef(cat);
                            return (
                              <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${def.badgeClass}`}>
                                {def.shortLabel}
                              </span>
                            );
                          })()}
                        </div>
                        <h4 className="mt-1 text-sm font-bold text-slate-900">{row.name}</h4>
                        {row.phone && (
                          <a href={`tel:${row.phone}`} className="text-xs text-slate-600 hover:text-[#0f3a5c]">
                            {row.phone}
                          </a>
                        )}
                      </div>
                      <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${badgeCls}`}>
                        {stageDef.label}
                      </span>
                    </div>

                    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50/70 p-2 text-xs">
                      <p className="truncate font-semibold text-slate-800">
                        {row.university || row.uniList || 'University to confirm'}
                      </p>
                      <p className="truncate text-[11px] text-slate-600">
                        {row.program || 'Degree track'} · {row.assessIntake || 'Intake to set'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex-1">
                        <div className="mb-0.5 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Docs: {row.docsReceived}/{row.docsTotal}</span>
                          <span>{docsPct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${docsPct >= 100 ? 'bg-[#0b7a53]' : docsPct >= 50 ? 'bg-blue-600' : 'bg-amber-500'}`}
                            style={{ width: `${docsPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="shrink-0">
                        <select
                          value={row.embassyStatus || 'Pending'}
                          disabled={isBusy}
                          onChange={(e) =>
                            handleInlinePatch(
                              row.id,
                              { embassyStatus: e.target.value },
                              `${row.name} embassy status: ${e.target.value}`,
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          {EMBASSY_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1">
                      <div className="flex items-center gap-1.5">
                        {safeDrive && (
                          <a
                            href={safeDrive}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700"
                          >
                            Drive ↗
                          </a>
                        )}
                        {row.publicToken && (
                          <button
                            type="button"
                            onClick={() => handleCopyPortal(row)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                          >
                            {copiedId === row.id ? 'Copied!' : 'Portal ↗'}
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveDrawerId(row.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#12436b]"
                      >
                        Open Dossier <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop & Tablet Table (Screens >= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left text-xs">
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
                  <th className="px-3 py-3">Ref / Student &amp; Passport</th>
                  <th className="px-3 py-3">Year · Intake &amp; Corridor</th>
                  <th className="px-3 py-3">University &amp; Program</th>
                  <th className="px-3 py-3">Channel &amp; Counselor</th>
                  <th className="px-3 py-3">Pipeline Stage</th>
                  <th className="px-3 py-3">Embassy / Visa</th>
                  <th className="px-3 py-3">Docs</th>
                  {canAccessFinance && <th className="px-3 py-3 text-right">Paid (৳)</th>}
                  <th className="px-3 py-3 text-right print:hidden">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8 + (isAdmin ? 1 : 0) + (canAccessFinance ? 1 : 0)} className="px-6 py-14 text-center text-slate-500">
                      <p className="font-bold text-slate-700">No application files match the current filters.</p>
                      <p className="mt-1 text-xs">
                        Reset filters or click <strong>+ New Application</strong> to open a student file.
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
                    const rowYear = extractIntakeYear(row.assessIntake);
                    const rowSession = extractIntakeSession(row.assessIntake);
                    const b2b = isB2BRow(row);

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

                        {/* Ref / Student & Passport */}
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
                              {row.passport && (
                                <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                                  PP: {row.passport}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 font-bold text-slate-900 group-hover:text-[#0f3a5c] group-hover:underline">
                              {row.name}
                            </div>
                            {row.phone && row.phone !== '—' && (
                              <div className="mt-0.5 text-[11px] text-slate-500">{row.phone}</div>
                            )}
                          </button>
                        </td>

                        {/* Year · Intake & Corridor */}
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-wrap items-center gap-1">
                            <span
                              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-extrabold ${
                                rowYear === '2027'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : rowYear === '2026'
                                    ? 'bg-sky-100 text-[#0f3a5c]'
                                    : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {rowYear}
                            </span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-800">
                              {rowSession !== 'Other' ? rowSession : row.assessIntake || 'TBD'}
                            </span>
                          </div>
                          <div className="mt-1 font-bold text-slate-900">{row.country}</div>
                          {row.degree && (
                            <div className="mt-0.5 text-[11px] font-medium text-slate-500">{row.degree}</div>
                          )}
                        </td>

                        {/* University & Program */}
                        <td className="max-w-[230px] px-3 py-3 align-top">
                          <div className="truncate font-semibold text-slate-800" title={row.university || row.uniList || ''}>
                            {row.university || row.uniList || <span className="text-slate-400">University TBD</span>}
                          </div>
                          {row.program && (
                            <div className="mt-0.5 truncate text-[11px] text-slate-500" title={row.program}>
                              {row.program}
                            </div>
                          )}
                          {row.applicationNotes && (
                            <div
                              className="mt-0.5 truncate text-[10px] text-slate-400"
                              title={row.applicationNotes}
                            >
                              {row.applicationNotes}
                            </div>
                          )}
                        </td>

                        {/* Channel (B2C / B2B) & Inline Counselor Assignment */}
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${
                                b2b
                                  ? 'border border-indigo-200 bg-indigo-50 text-indigo-800'
                                  : 'border border-emerald-200 bg-emerald-50 text-[#0b7a53]'
                              }`}
                            >
                              {b2b ? (
                                <>
                                  <Handshake size={10} />
                                  <span>{row.referrer ? `B2B · ${row.referrer}` : 'B2B Partner'}</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={10} />
                                  <span>EduExpress Direct</span>
                                </>
                              )}
                            </span>
                            {row.source && (() => {
                              const cat = categorizeLeadSource(row.source, null, row.channelType);
                              const def = getSourceCategoryDef(cat);
                              return (
                                <span
                                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${def.badgeClass}`}
                                  title={`Acquisition: ${row.source}`}
                                >
                                  <span className="size-1.5 rounded-full" style={{ backgroundColor: def.dotColor }} />
                                  {def.shortLabel}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="mt-1.5">
                            {isAdmin ? (
                              <select
                                disabled={isBusy}
                                value={row.assignedEmployeeId || ''}
                                onChange={(e) =>
                                  handleInlinePatch(
                                    row.id,
                                    { assignedEmployeeId: e.target.value || null },
                                    `${row.name} counselor updated`,
                                  )
                                }
                                className="w-full max-w-[155px] rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-[11px] font-semibold text-slate-800 focus:border-[#0f3a5c] focus:bg-white focus:outline-none"
                              >
                                <option value="">Unassigned Desk</option>
                                {employees.map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-800">
                                {row.employeeName || 'Unassigned'}
                              </span>
                            )}
                          </div>
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
                            className={`w-full max-w-[165px] rounded-lg border px-2 py-1 text-[11px] font-bold focus:outline-none print:border-0 print:bg-transparent ${badgeCls}`}
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

                        {/* Finance-Admin-Only Column */}
                        {canAccessFinance && (
                          <td className="px-3 py-3 text-right align-top tabular-nums">
                            {row.financeReceivedTotal && row.financeReceivedTotal > 0 ? (
                              <div className="font-bold text-[#0b7a53]">
                                {formatBdt(row.financeReceivedTotal)}
                              </div>
                            ) : Number(row.paidAmount || 0) > 0 ? (
                              <div className="font-bold text-[#0b7a53]">
                                {formatBdt(Number(row.paidAmount))}
                              </div>
                            ) : Number(row.deposit || 0) > 0 ? (
                              <div className="font-semibold text-slate-700">
                                {formatBdt(Number(row.deposit))}
                                <span className="block text-[10px] font-normal text-slate-400">Deposit</span>
                              </div>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                            {Number(row.serviceFee || 0) > 0 && (
                              <div className="mt-0.5 text-[10px] text-slate-500">
                                Fee: {formatBdt(Number(row.serviceFee))}
                              </div>
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
                                className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                title="Open Google Drive Student Folder"
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
                <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-white px-3.5 py-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#071c2e]">{col.title}</h3>
                    <p className="text-[10px] text-slate-500">{col.subtitle}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold tabular-nums text-slate-700">
                    {items.length}
                  </span>
                </div>

                <div className="max-h-[68vh] flex-1 space-y-2.5 overflow-y-auto p-2.5">
                  {items.length === 0 ? (
                    <p className="py-8 text-center text-[11px] text-slate-400">No files</p>
                  ) : (
                    items.map((row) => {
                      const stageDef = getStageDef(row.applicationStage);
                      const badgeCls = STAGE_BADGE_CLASSES[stageDef.tone];
                      const b2b = isB2BRow(row);
                      return (
                        <button
                          key={row.id}
                          type="button"
                          onClick={() => setActiveDrawerId(row.id)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-2xs transition hover:border-[#0f3a5c]/50 hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[10px] font-bold text-[#0f3a5c]">
                                {row.leadRef || 'FILE'}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                                  b2b ? 'bg-indigo-50 text-indigo-800' : 'bg-emerald-50 text-[#0b7a53]'
                                }`}
                              >
                                {b2b ? 'B2B' : 'B2C'}
                              </span>
                            </div>
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
                            <span className="font-semibold tabular-nums">
                              Docs {row.docsReceived}/{row.docsTotal}
                            </span>
                            <span>{row.employeeName || row.referrer || 'Unassigned'}</span>
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
        canAccessFinance={canAccessFinance}
        employees={employees}
        intakes={data?.meta.intakes ?? []}
        destinations={data?.meta.destinations ?? []}
        universities={data?.meta.universities ?? []}
        programs={data?.meta.programs ?? []}
        catalogUniversities={data?.meta.catalogUniversities ?? []}
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
        canAccessFinance={canAccessFinance}
        employees={employees}
        universities={data?.meta.universities ?? []}
        programs={data?.meta.programs ?? []}
        catalogUniversities={data?.meta.catalogUniversities ?? []}
        onClose={() => setActiveDrawerId(null)}
        onMutated={() => void loadApplications(true)}
      />
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  ExternalLink,
  FileCheck2,
  Flame,
  FolderCheck,
  FolderKanban,
  FolderPlus,
  Globe2,
  GraduationCap,
  Handshake,
  Landmark,
  Layers,
  MapPin,
  MessageCircle,
  MessageSquareQuote,
  Phone,
  PiggyBank,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserCog,
  Users2,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFinanceRole } from '@/lib/roles';
import AdminTeamManagerPanel from '@/components/admin/AdminTeamManagerPanel';
import MetaConnectionPanel from '@/components/admin/MetaConnectionPanel';
import type { ConsultancyExecutiveSnapshot } from '@/lib/consultancy-analytics';
import { formatBdt, type FinanceDashboardSnapshot } from '@/lib/finance-logic';
import type {
  CounselorDeskSummary,
  OfficePulseActivityItem,
  OfficePulseStaffRow,
  OwnerOfficePulsePayload,
} from '@/lib/office-pulse';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  inProgressLeads: number;
  noResponseLeads: number;
  closedLeads: number;
  metaLeads: number;
  websiteLeads: number;
  todayLeads: number;
  chinaLeads: number;
  totalApplications?: number;
  visasOrEnrolled?: number;
  totalUniversities: number;
  expiringUniversities?: number;
  totalTeam: number;
  publishedTeam: number;
  totalTestimonials: number;
  totalCountries: number;
  totalPartnerships: number;
  newPartnerships: number;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    program: string;
    status: string;
    source: string;
    isApplication?: boolean;
    leadRef?: string | null;
    assessAcademicLevel?: string | null;
    assessAcademicResults?: string | null;
    assessLanguage?: string | null;
    createdAt: string;
  }>;
  recentPartnerships: Array<{
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    country: string;
    partnershipType: string;
    status: string;
    createdAt: string;
  }>;
  metaSync?: {
    pixelConfigured: boolean;
    pixelId: string | null;
    tokenConfigured: boolean;
    lastCheckOk: boolean | null;
    lastCheckMessage: string | null;
    lastDeliveryAt: string | null;
    lastDeliveryError: string | null;
    leadFlowMode: string;
  };
  officePulse?: OwnerOfficePulsePayload | null;
  counselorDesk?: CounselorDeskSummary | null;
  consultancy?: ConsultancyExecutiveSnapshot | null;
  financeSnapshot?: FinanceDashboardSnapshot | null;
}

const statusTones: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-amber-50 text-amber-900 border-amber-200', text: 'text-amber-700', label: 'New Enquiry' },
  contacted: { bg: 'bg-blue-50 text-blue-900 border-blue-200', text: 'text-blue-700', label: 'Contacted' },
  in_progress: { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', text: 'text-indigo-700', label: 'In Progress' },
  qualified: { bg: 'bg-cyan-50 text-cyan-900 border-cyan-200', text: 'text-cyan-700', label: 'Qualified' },
  no_response: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-600', label: 'No Response' },
  application_started: { bg: 'bg-violet-50 text-violet-900 border-violet-200', text: 'text-violet-700', label: 'File Opened' },
  application_submitted: { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', text: 'text-indigo-700', label: 'Submitted' },
  admission_received: { bg: 'bg-teal-50 text-teal-900 border-teal-200', text: 'text-teal-700', label: 'Admitted' },
  visa_applied: { bg: 'bg-amber-50 text-amber-900 border-amber-200', text: 'text-amber-700', label: 'Visa Applied' },
  visa_approved: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Visa Approved' },
  closed: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-600', label: 'Closed' },
  converted: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Enrolled' },
  enrolled: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Enrolled' },
  not_interested: { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'text-gray-600', label: 'Not Interested' },
};

function formatDhakaDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    }
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Dhaka',
    }).format(d);
  } catch {
    return isoString.slice(0, 10);
  }
}

function cleanDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const isCounselor = user?.role === 'counselor';
  const canSeeFinance = canAccessFinanceRole(user?.role);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simplified Tabs & Actions
  const [activeTab, setActiveTab] = useState<'enquiries' | 'pipeline' | 'finance' | 'pulse'>('enquiries');
  const [leadSearch, setLeadSearch] = useState('');
  const [openingFileId, setOpeningFileId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    leadRef?: string;
    leadName?: string;
  } | null>(null);

  const fetchDashboard = async (background = false) => {
    try {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await authenticatedFetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error(`Dashboard request failed (${response.status})`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSyncMetaLeads = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const res = await authenticatedFetch('/api/admin/leads?sync=1');
      if (res.ok) {
        setSyncMessage('Meta Graph API synced successfully!');
        await fetchDashboard(true);
      } else {
        setSyncMessage('Sync request completed.');
      }
    } catch {
      setSyncMessage('Sync call dispatched.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  const handleOpenFile = async (leadId: string, leadName: string) => {
    try {
      setOpeningFileId(leadId);
      setActionFeedback(null);
      const res = await authenticatedFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ existingLeadId: leadId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionFeedback({
          type: 'error',
          message: data.error || data.message || 'Could not open file for this lead.',
        });
        return;
      }

      const assignedRef = data.application?.leadRef || data.leadRef || 'APP-FILE';

      // Update local state immediately
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalApplications: (prev.totalApplications || 0) + 1,
          recentLeads: prev.recentLeads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  isApplication: true,
                  leadRef: assignedRef,
                  status: 'application_started',
                }
              : l,
          ),
        };
      });

      setActionFeedback({
        type: 'success',
        leadName,
        leadRef: assignedRef,
        message: `File opened for ${leadName}! Moved to Application Tracker (${assignedRef}).`,
      });
    } catch {
      setActionFeedback({
        type: 'error',
        message: 'Network error while opening file.',
      });
    } finally {
      setOpeningFileId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCw className="size-8 animate-spin text-[#0f3a5c]" />
          <p className="text-sm font-medium text-slate-600">Loading admissions intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900">
        <h2 className="text-lg font-bold">Dashboard unavailable</h2>
        <p className="mt-2 text-sm">{error || 'Unable to retrieve dashboard metrics.'}</p>
        <button
          onClick={() => fetchDashboard()}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metaPct = stats.totalLeads > 0 ? Math.round((stats.metaLeads / stats.totalLeads) * 100) : 0;
  const webPct = Math.max(0, 100 - metaPct);

  const filteredRecentLeads = (stats.recentLeads || []).filter((lead) => {
    if (!leadSearch.trim()) return true;
    const q = leadSearch.trim().toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      (lead.email || '').toLowerCase().includes(q) ||
      (lead.phone || '').toLowerCase().includes(q) ||
      (lead.country || '').toLowerCase().includes(q) ||
      (lead.program || '').toLowerCase().includes(q) ||
      (lead.leadRef || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Streamlined Executive Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2540] via-[#0f3a5c] to-[#124b7a] p-6 text-white shadow-lg sm:p-7">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Dhaka Office Active · GMT+6 Live Desk
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {isCounselor ? 'Counselor Admissions Desk' : 'Admissions Command Center'}
            </h1>
            <p className="text-xs leading-relaxed text-slate-200 sm:text-sm">
              Manage incoming student leads, open application files into the Application Tracker, and monitor student visa progression.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/applications"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-sky-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-sm transition hover:bg-sky-300"
            >
              <FolderKanban size={15} />
              Application Tracker ({stats.totalApplications ?? stats.inProgressLeads})
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Users2 size={14} />
              Leads ({stats.totalLeads})
            </Link>
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-wait"
              title="Refresh dashboard metrics"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            {!isCounselor && (
              <button
                type="button"
                onClick={handleSyncMetaLeads}
                disabled={syncing}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-3 py-2 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/30 disabled:cursor-wait"
                title="Sync leads from Meta Graph API"
              >
                <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Syncing...' : 'Sync Meta'}
              </button>
            )}
          </div>
        </div>

        {syncMessage && (
          <div className="relative z-10 mt-3 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-100">
            {syncMessage}
          </div>
        )}
      </section>

      {/* 4 Clean Primary Key Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Enquiries */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Users2 size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
              +{stats.todayLeads} Today
            </span>
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">Student Enquiries</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-slate-900">{stats.totalLeads}</span>
            <span className="text-xs text-slate-500">total leads</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>{stats.metaLeads} Meta · {stats.websiteLeads} Web</span>
            <Link href="/admin/leads" className="font-bold text-blue-700 hover:underline">
              View all →
            </Link>
          </div>
        </div>

        {/* Active Application Files (Tracker) */}
        <div className="group relative overflow-hidden rounded-2xl border border-sky-300 bg-gradient-to-br from-sky-50/60 via-white to-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-[#0f3a5c]">
              <FolderKanban size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-[#071c2e]">
              In Tracker
            </span>
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-600">Active Applications</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-[#071c2e]">
              {stats.totalApplications ?? stats.inProgressLeads}
            </span>
            <span className="text-xs font-medium text-slate-500">open files</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600">Files undergoing processing</span>
            <Link href="/admin/applications" className="font-bold text-[#0f3a5c] hover:underline">
              Open Tracker →
            </Link>
          </div>
        </div>

        {/* Visas & Enrolled */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
              <FolderCheck size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
              Successful
            </span>
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">Visas &amp; Enrolled</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-emerald-950">
              {stats.visasOrEnrolled ?? stats.closedLeads}
            </span>
            <span className="text-xs font-semibold text-emerald-800">students won</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Visas approved &amp; flown</span>
            <Link href="/admin/applications?stage=visa_approved" className="font-bold text-emerald-800 hover:underline">
              View list →
            </Link>
          </div>
        </div>

        {/* Untouched New Enquiries */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <Flame size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
              Needs Contact
            </span>
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">New Untouched Leads</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-amber-950">{stats.newLeads}</span>
            <span className="text-xs font-semibold text-amber-800">pending</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600">{stats.noResponseLeads} no-response</span>
            <Link href="/admin/leads?queue=new" className="font-bold text-amber-800 hover:underline">
              Start calling →
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Tabs (Simplify Everything into Clear Workspaces) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'enquiries'
                ? 'bg-[#0f3a5c] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Users2 size={15} />
            Recent Enquiries
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === 'enquiries' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {stats.recentLeads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'pipeline'
                ? 'bg-[#0f3a5c] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers size={15} />
            Pipeline &amp; Demand
          </button>

          {canSeeFinance && stats.financeSnapshot && (
            <button
              type="button"
              onClick={() => setActiveTab('finance')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'finance'
                  ? 'bg-[#0f3a5c] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Landmark size={15} />
              Financial Snapshot
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('pulse')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'pulse'
                ? 'bg-[#0f3a5c] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Activity size={15} />
            {isCounselor ? 'Today Desk' : 'Office & Staff Pulse'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-900 transition hover:bg-sky-100"
          >
            <FolderKanban size={13} className="text-[#0f3a5c]" />
            Full Tracker ({stats.totalApplications ?? stats.inProgressLeads}) →
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            All Leads ({stats.totalLeads}) →
          </Link>
        </div>
      </div>

      {/* TAB 1: RECENT ENQUIRIES (FRONTLINE ACTION HUB) */}
      {activeTab === 'enquiries' && (
        <section className="space-y-4">
          {actionFeedback && (
            <div
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-medium transition ${
                actionFeedback.type === 'success'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : 'border-rose-300 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid size-6 place-items-center rounded-full ${
                    actionFeedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {actionFeedback.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
                </span>
                <p className="font-semibold">{actionFeedback.message}</p>
              </div>
              <div className="flex items-center gap-2">
                {actionFeedback.type === 'success' && actionFeedback.leadRef && (
                  <Link
                    href={`/admin/applications?search=${encodeURIComponent(actionFeedback.leadRef)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-emerald-800"
                  >
                    <FolderKanban size={13} />
                    View in Application Tracker →
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setActionFeedback(null)}
                  className="rounded p-1 text-slate-500 hover:text-slate-800"
                  title="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <h2 className="font-heading text-lg font-bold text-slate-900">Recent Student Enquiries</h2>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {filteredRecentLeads.length} shown
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Click <strong>WhatsApp</strong> to reach out immediately, or <strong>Open File</strong> to move lead to Application Tracker.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search recent enquiries..."
                    className="w-48 sm:w-60 rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0f3a5c] focus:bg-white focus:outline-none"
                  />
                </div>
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  View All {stats.totalLeads} Leads <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {filteredRecentLeads.length > 0 ? (
                filteredRecentLeads.map((lead) => {
                  const tone = statusTones[lead.status] || statusTones.new;
                  const digits = cleanDigits(lead.phone || '');
                  const waUrl = digits
                    ? `https://wa.me/${digits}?text=${encodeURIComponent(
                        `Hello ${lead.name}, thank you for contacting EduExpress regarding your study in China plans!`
                      )}`
                    : null;

                  return (
                    <div
                      key={lead.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4 transition hover:bg-slate-50/60 sm:px-2"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 font-heading text-sm font-bold text-slate-700">
                          {lead.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${tone.bg}`}
                            >
                              {tone.label}
                            </span>
                            {lead.isApplication ? (
                              <span className="inline-flex items-center gap-1 rounded-md border border-sky-300 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-900">
                                <FolderCheck size={11} className="text-sky-700" /> File Active
                              </span>
                            ) : null}
                            {lead.source?.includes('meta') ? (
                              <span className="inline-flex rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                Meta Form
                              </span>
                            ) : (
                              <span className="inline-flex rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
                                Website
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{lead.country || 'China'}</span>
                            <span>·</span>
                            <span>{lead.program || 'Admissions Enquiry'}</span>
                            {lead.assessAcademicLevel && (
                              <>
                                <span>·</span>
                                <span className="font-medium text-slate-700">
                                  {lead.assessAcademicLevel}
                                  {lead.assessAcademicResults ? ` (${lead.assessAcademicResults})` : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="mr-2 text-right text-xs text-slate-500">
                          <div className="flex items-center justify-end gap-1">
                            <Clock size={12} />
                            <span>{formatDhakaDate(lead.createdAt)}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {lead.phone || <span className="hidden sm:inline">{lead.email}</span>}
                          </span>
                        </div>

                        {waUrl && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={14} className="text-emerald-700" />
                            WhatsApp
                          </a>
                        )}

                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                            title="Call student"
                          >
                            <Phone size={13} className="text-slate-600" />
                            Call
                          </a>
                        )}

                        {/* OPEN FILE ACTION -> MOVES LEAD TO APPLICATION TRACKER */}
                        {lead.isApplication ? (
                          <Link
                            href={`/admin/applications?search=${encodeURIComponent(lead.leadRef || lead.name)}`}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 px-3 text-xs font-bold text-sky-900 shadow-sm transition hover:bg-sky-100"
                            title="Student file is active in Application Tracker"
                          >
                            <FolderKanban size={13} className="text-sky-700" />
                            In Tracker ({lead.leadRef || 'APP'}) →
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenFile(lead.id, lead.name)}
                            disabled={openingFileId === lead.id}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                            title="Open student file and move to Application Tracker"
                          >
                            <FolderPlus size={13} />
                            {openingFileId === lead.id ? 'Opening...' : 'Open File'}
                          </button>
                        )}

                        <Link
                          href={`/admin/leads?search=${encodeURIComponent(lead.name)}`}
                          className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                          title="Open in Leads Workspace"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  {leadSearch.trim() ? `No enquiries matching "${leadSearch}".` : 'No student enquiries recorded yet.'}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: PIPELINE & DEMAND */}
      {activeTab === 'pipeline' && (
        <section className="space-y-6">
          {/* 6-Stage Admissions Pipeline Funnel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">Admissions Pipeline Funnel</h2>
                <p className="text-xs text-slate-500">
                  6-milestone progression across all {stats.totalLeads} student files
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {stats.consultancy && (
                  <>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800">
                      Offer Yield: {stats.consultancy.stageFunnel.offerRatePercent}%
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      Enrolled Yield: {stats.consultancy.stageFunnel.enrollmentRatePercent}%
                    </span>
                  </>
                )}
                <Link href="/admin/applications" className="ml-1 text-xs font-bold text-[#0f3a5c] hover:underline">
                  Open Tracker →
                </Link>
              </div>
            </div>

            {stats.consultancy ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  {[
                    {
                      step: '1. New',
                      count: stats.consultancy.stageFunnel.newLeads,
                      sub: 'Untouched',
                      cls: 'border-amber-200 bg-amber-50/70 text-amber-900',
                      href: '/admin/leads?queue=new',
                    },
                    {
                      step: '2. Counseling',
                      count: stats.consultancy.stageFunnel.counselingQualified,
                      sub: 'Qualified / Call',
                      cls: 'border-sky-200 bg-sky-50/70 text-sky-900',
                      href: '/admin/leads?queue=in_progress',
                    },
                    {
                      step: '3. Applied',
                      count: stats.consultancy.stageFunnel.universityApplied,
                      sub: 'Uni Submitted',
                      cls: 'border-indigo-200 bg-indigo-50/70 text-indigo-900',
                      href: '/admin/applications',
                    },
                    {
                      step: '4. Admitted',
                      count: stats.consultancy.stageFunnel.offerAdmitted,
                      sub: 'Offer / JW202',
                      cls: 'border-violet-200 bg-violet-50/70 text-violet-900',
                      href: '/admin/applications?stage=admitted',
                    },
                    {
                      step: '5. Visa',
                      count: stats.consultancy.stageFunnel.visaStage,
                      sub: 'Embassy / Stamped',
                      cls: 'border-blue-200 bg-blue-50/70 text-blue-900',
                      href: '/admin/applications?stage=visa_approved',
                    },
                    {
                      step: '6. Enrolled',
                      count: stats.consultancy.stageFunnel.enrolledConverted,
                      sub: 'Arrived / Won',
                      cls: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
                      href: '/admin/applications?stage=fly',
                    },
                  ].map((stage) => (
                    <Link
                      key={stage.step}
                      href={stage.href}
                      className={`rounded-2xl border p-3.5 text-center transition hover:shadow-sm ${stage.cls}`}
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">{stage.step}</p>
                      <p className="mt-1 font-heading text-2xl font-bold">{stage.count}</p>
                      <p className="mt-0.5 text-[11px] opacity-75">{stage.sub}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-700">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span>
                      <strong className="text-slate-900">{stats.consultancy.consultancyOps.activeUniApps}</strong> Active Uni Apps
                    </span>
                    <span>
                      <strong className="text-emerald-700">{stats.consultancy.consultancyOps.offersReceivedCount}</strong> Offers Issued
                    </span>
                    <span>
                      <strong className="text-amber-700">{stats.consultancy.consultancyOps.docsPendingReviewCount}</strong> Docs Pending Verify
                    </span>
                    {stats.consultancy.consultancyOps.medicalTrackCount > 0 && (
                      <span>
                        <strong className="text-teal-700">{stats.consultancy.consultancyOps.medicalTrackCount}</strong> MBBS Files
                      </span>
                    )}
                  </div>
                  <Link
                    href="/admin/leads?queue=no_response"
                    className="font-semibold text-amber-800 hover:underline"
                  >
                    {stats.consultancy.stageFunnel.noResponse} No-Response Follow-ups →
                  </Link>
                </div>
              </>
            ) : null}
          </div>

          {/* Lead Channels & Source Distribution */}
          {!isCounselor && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700">
                    <Layers size={20} />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-slate-900">Lead Channels &amp; Routing Engine</h2>
                    <p className="text-xs text-slate-500">Live enquiry breakdown across Meta Instant Forms and Website assessments</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                    stats.metaSync?.tokenConfigured && stats.metaSync?.pixelConfigured
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-amber-200 bg-amber-50 text-amber-800'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  {stats.metaSync?.tokenConfigured && stats.metaSync?.pixelConfigured
                    ? 'Pixel + CAPI Configured'
                    : 'Check Meta Token in Settings'}
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Lead Source Distribution</span>
                  <span>
                    {stats.metaLeads} Meta ({metaPct}%) · {stats.websiteLeads} Website ({webPct}%)
                  </span>
                </div>
                <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div style={{ width: `${metaPct}%` }} className="bg-gradient-to-r from-blue-600 to-indigo-600" />
                  <div style={{ width: `${webPct}%` }} className="bg-gradient-to-r from-cyan-400 to-teal-500" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-blue-600" /> Meta Instant Forms &amp; Paid Social
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-cyan-400" /> Website Assessment &amp; Direct Forms
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Destination Demand & Deadlines */}
          {stats.consultancy && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900">Destination Country Demand</h3>
                    <p className="text-xs text-slate-500">China flagship vs side study corridors</p>
                  </div>
                  <Globe2 size={18} className="text-[#0f3a5c]" />
                </div>
                <div className="mt-4 space-y-3">
                  {stats.consultancy.countryDemand.length === 0 ? (
                    <p className="text-xs text-slate-500">No destination demand data recorded yet.</p>
                  ) : (
                    stats.consultancy.countryDemand.map((item) => {
                      const pct = stats.totalLeads > 0 ? Math.max(4, Math.round((item.total / stats.totalLeads) * 100)) : 0;
                      const isChina = item.country === 'China';
                      return (
                        <div key={item.country} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{item.country}</span>
                            <span className="text-slate-600">
                              <strong className="text-slate-900">{item.total}</strong> files · {item.active} active
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${isChina ? 'bg-[#0f3a5c]' : 'bg-cyan-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900">Visa &amp; Departure Deadlines</h3>
                    <p className="text-xs text-slate-500">Upcoming milestones within 120 days</p>
                  </div>
                  <Clock size={18} className="text-amber-600" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {stats.consultancy.urgentDeadlines.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                      No upcoming visa or departure cutoffs within 120 days.
                    </div>
                  ) : (
                    stats.consultancy.urgentDeadlines.slice(0, 5).map((item) => {
                      const urgentBadge =
                        item.daysUntil < 0
                          ? `Overdue ${Math.abs(item.daysUntil)}d`
                          : item.daysUntil === 0
                            ? 'Today'
                            : `${item.daysUntil}d left`;
                      const badgeTone =
                        item.daysUntil <= 3
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : item.daysUntil <= 14
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-sky-100 text-sky-800 border-sky-200';
                      return (
                        <Link
                          key={item.id}
                          href={`/admin/applications?search=${encodeURIComponent(item.name)}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-slate-200 hover:bg-white"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-xs font-bold text-slate-900">{item.name}</span>
                              <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                                {item.country}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-slate-500">
                              {item.deadlineType === 'visa' ? 'Visa cutoff' : 'Flight'}: {item.deadlineDate}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badgeTone}`}>
                            {urgentBadge}
                          </span>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: FINANCIAL SNAPSHOT (FINANCE ADMIN ONLY) */}
      {activeTab === 'finance' && canSeeFinance && stats.financeSnapshot && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                <Landmark size={20} />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">Financial Control Snapshot</h2>
                <p className="text-xs text-slate-500">
                  Live cash ledger · {stats.financeSnapshot.incomeEntryCount} cash income &amp; {stats.financeSnapshot.expenseEntryCount} expense entries
                </p>
              </div>
            </div>
            <Link
              href="/admin/finance"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#124b7a]"
            >
              Open Full Finance Console
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Cash Position</span>
                <Wallet size={16} className="text-emerald-700" />
              </div>
              <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-emerald-950">
                {formatBdt(stats.financeSnapshot.cashPosition)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-800">
                Net profit: {formatBdt(stats.financeSnapshot.allTimeNetProfit)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All-Time Collections</span>
              <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-slate-900">
                {formatBdt(stats.financeSnapshot.allTimeIncome)}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {stats.financeSnapshot.currentMonth}: {formatBdt(stats.financeSnapshot.monthIncome)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All-Time Expenses</span>
              <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-rose-700">
                {formatBdt(stats.financeSnapshot.allTimeExpenses)}
              </p>
              <p className="mt-1 text-[11px] text-slate-600">
                {stats.financeSnapshot.currentMonth}: {formatBdt(stats.financeSnapshot.monthExpenses)}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-800">Investor Capital</span>
                <PiggyBank size={16} className="text-violet-700" />
              </div>
              <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-violet-950">
                {formatBdt(stats.financeSnapshot.totalInvestorCapital)}
              </p>
              <p className="mt-1 text-[11px] text-violet-800">
                {stats.financeSnapshot.payrollPendingCount > 0
                  ? `${stats.financeSnapshot.payrollPendingCount} pending payroll`
                  : 'Payroll up to date'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: OFFICE & STAFF PULSE */}
      {activeTab === 'pulse' && (
        <section className="space-y-6">
          {!isCounselor && stats.officePulse && (
            <RemoteOfficePulseSection
              pulse={stats.officePulse}
              onRefresh={() => fetchDashboard(true)}
              refreshing={refreshing}
            />
          )}

          {isCounselor && stats.counselorDesk && (
            <CounselorDeskSection
              desk={stats.counselorDesk}
              onRefresh={() => fetchDashboard(true)}
              refreshing={refreshing}
            />
          )}

          {!isCounselor && <AdminTeamManagerPanel compact onChanged={() => void fetchDashboard()} />}
        </section>
      )}
    </div>
  );
}

const ATTENDANCE_BADGE_TONES: Record<string, string> = {
  present: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  on_time: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  late: 'border-amber-200 bg-amber-50 text-amber-800',
  half_day: 'border-orange-200 bg-orange-50 text-orange-800',
  leave: 'border-sky-200 bg-sky-50 text-sky-800',
  absent: 'border-rose-200 bg-rose-50 text-rose-800',
  not_checked_in: 'border-slate-200 bg-slate-100 text-slate-600',
};

function renderLocationBadge(locationType: string, locationLabel: string) {
  if (locationType === 'office_location') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
        <MapPin size={12} />
        {locationLabel}
      </span>
    );
  }
  if (locationType === 'remote_location') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
        <MapPin size={12} />
        {locationLabel}
      </span>
    );
  }
  if (locationType === 'location_denied' || locationType === 'location_unavailable') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-800">
        <AlertTriangle size={12} />
        {locationLabel}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
      {locationLabel}
    </span>
  );
}

function formatAttendanceStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function formatActivityDescription(item: OfficePulseActivityItem): string {
  const actor = item.actorName || 'System';
  const action = item.type.replace(/_/g, ' ');
  const lead = item.leadName ? ` on ${item.leadName}` : '';
  const transition =
    item.fromValue && item.toValue
      ? ` (${item.fromValue} → ${item.toValue})`
      : item.toValue
        ? ` (${item.toValue})`
        : '';
  return `${actor} · ${action}${lead}${transition}`;
}

function RemoteOfficePulseSection({
  pulse,
  onRefresh,
  refreshing,
}: {
  pulse: OwnerOfficePulsePayload;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const [staffFilter, setStaffFilter] = useState<'all' | 'checked_in' | 'missing' | 'attention'>('all');

  const filteredStaff = pulse.staffStatus.filter((row) => {
    if (staffFilter === 'checked_in') return Boolean(row.checkIn);
    if (staffFilter === 'missing') return !row.checkIn;
    if (staffFilter === 'attention') {
      return (
        !row.checkIn ||
        row.overdueLeads > 0 ||
        row.overdueTasks > 0 ||
        row.locationType === 'remote_location' ||
        row.locationType === 'location_denied' ||
        row.locationType === 'location_unavailable'
      );
    }
    return true;
  });

  const overdueTotal = pulse.summary.overdueLeadsCount + pulse.summary.overdueTasksCount;

  return (
    <section
      id="remote-office-pulse"
      className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500" />
              Dhaka: {pulse.dhakaDate} · {pulse.dhakaTime} BST
            </span>
            <Link
              href="/admin/settings#office-location"
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800 hover:bg-cyan-100"
            >
              <MapPin size={12} />
              GPS Geofence: {pulse.geofenceRadiusMeters}m ({pulse.officeLocationStrict ? 'Strict GPS' : 'Flag Mode'}) · Configure
            </Link>
            {pulse.officeMapsUrl && (
              <a
                href={pulse.officeMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                Office Pin <ExternalLink size={10} />
              </a>
            )}
          </div>
          <h2 className="mt-2 font-heading text-xl font-bold text-slate-900">
            Remote Office Pulse · Staff Check-Ins &amp; GPS Location Activity
          </h2>
          <p className="text-xs text-slate-500">
            Verify Dhanmondi office GPS presence vs remote check-ins, SLA alerts, daily EOD reports, and live CRM updates from anywhere.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-wait"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Pulse'}
          </button>
          <Link
            href="/admin/kpi"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#124b7a]"
          >
            Full Team KPI →
          </Link>
        </div>
      </div>

      {/* 5 Summary Pulse Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Checked In</p>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
            {pulse.summary.checkedInCount} / {pulse.summary.totalStaff}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            {pulse.summary.onTimeCount} on time · {pulse.summary.lateCount} late
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">Office GPS vs Remote</p>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
            {pulse.summary.officeLocationCount} Office · {pulse.summary.remoteLocationCount} Remote
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            {pulse.summary.locationMissingCount} GPS missing · {pulse.summary.notCheckedInCount} pending
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Actions Today</p>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">{pulse.summary.todayActionsTotal}</p>
          <p className="mt-1 text-[11px] text-slate-600">CRM stage updates &amp; logs</p>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            overdueTotal > 0 ? 'border-rose-200 bg-rose-50/60' : 'border-emerald-200 bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${
                overdueTotal > 0 ? 'text-rose-800' : 'text-emerald-800'
              }`}
            >
              Overdue SLA / Tasks
            </p>
            <AlertTriangle size={14} className={overdueTotal > 0 ? 'text-rose-600' : 'text-emerald-600'} />
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">{overdueTotal}</p>
          <p className="mt-1 text-[11px] text-slate-600">
            {pulse.summary.overdueLeadsCount} leads · {pulse.summary.overdueTasksCount} tasks
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">EOD Reports</p>
            <ClipboardList size={14} className="text-emerald-700" />
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
            {pulse.summary.eodSubmittedCount} / {pulse.summary.totalStaff}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">{pulse.summary.openTasksCount} open tasks today</p>
        </div>
      </div>

      {/* Staff Filter Strip + Presence Table */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-800">Staff Presence &amp; Desk Execution</h3>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['all', `All (${pulse.staffStatus.length})`],
                ['checked_in', `Checked In (${pulse.summary.checkedInCount})`],
                ['missing', `Not Checked In (${pulse.summary.notCheckedInCount})`],
                ['attention', 'Needs Attention'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStaffFilter(key)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  staffFilter === key
                    ? 'bg-[#0f3a5c] text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[640px] divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Location / GPS</th>
                <th className="px-4 py-3">Today Actions</th>
                <th className="px-4 py-3">Active / Overdue</th>
                <th className="px-4 py-3">EOD Log</th>
                <th className="px-4 py-3 text-right">KPI Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((row: OfficePulseStaffRow) => {
                  const statusTone =
                    ATTENDANCE_BADGE_TONES[row.status.toLowerCase().replace(/\s+/g, '_')] ||
                    ATTENDANCE_BADGE_TONES.not_checked_in;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{row.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {row.empId} · {row.role} · {row.team}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusTone}`}>
                          {formatAttendanceStatusLabel(row.status)}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {row.checkIn ? `In ${row.checkIn}` : 'No check-in'}
                          {row.checkOut ? ` · Out ${row.checkOut}` : ''}
                          {row.hoursWorked > 0 ? ` (${row.hoursWorked}h)` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {renderLocationBadge(row.locationType, row.locationLabel)}
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                          {row.mapsUrl && (
                            <a
                              href={row.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 font-bold text-[#0f3a5c] hover:underline"
                            >
                              Open Map <ExternalLink size={10} />
                            </a>
                          )}
                          {row.accuracyMeters !== null && (
                            <span className="text-slate-400">±{row.accuracyMeters}m</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{row.todayActions} actions</p>
                        <p className="text-[11px] text-slate-500">
                          {row.lastActionAt ? `Last ${formatDhakaDate(row.lastActionAt)}` : 'No actions yet'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {row.activeLeads} active · {row.openTasks} tasks
                        </p>
                        {row.overdueLeads > 0 || row.overdueTasks > 0 ? (
                          <p className="mt-0.5 text-[11px] font-bold text-rose-700">
                            {row.overdueLeads} overdue leads · {row.overdueTasks} overdue tasks
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] text-emerald-700">On track</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.eodSubmitted ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                            <FileCheck2 size={12} />
                            Submitted
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href="/admin/kpi"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[#0f3a5c] hover:bg-slate-100"
                        >
                          View KPI →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-xs text-slate-500">
                    {pulse.staffStatus.length === 0
                      ? 'No active staff profiles found in the Employee directory yet.'
                      : 'No staff members match the selected filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Office Activity Feed */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#0f3a5c]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Live Office Activity Feed</h3>
          </div>
          <span className="text-[11px] text-slate-500">Latest {Math.min(pulse.recentFeed.length, 8)} events</span>
        </div>
        {pulse.recentFeed.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {pulse.recentFeed.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{formatActivityDescription(item)}</p>
                  {item.summary && <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.summary}</p>}
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">{formatDhakaDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-slate-500">No office CRM activity logged yet today.</p>
        )}
      </div>
    </section>
  );
}

function CounselorDeskSection({
  desk,
  onRefresh,
  refreshing,
}: {
  desk: CounselorDeskSummary;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const attendanceTone =
    ATTENDANCE_BADGE_TONES[desk.attendanceStatus.toLowerCase().replace(/\s+/g, '_')] ||
    ATTENDANCE_BADGE_TONES.not_checked_in;

  return (
    <section
      id="counselor-today-desk"
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500" />
              Dhaka: {desk.dhakaDate} · {desk.dhakaTime} BST
            </span>
            {desk.empId && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                {desk.empId} · {desk.team || 'Admissions'}
              </span>
            )}
          </div>
          <h2 className="mt-2 font-heading text-xl font-bold text-slate-900">
            My Today Desk {desk.employeeName ? `· ${desk.employeeName}` : ''}
          </h2>
          <p className="text-xs text-slate-500">
            Daily check-in status, GPS location verification, pending follow-ups, and evening EOD reflection status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-wait"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            href="/admin/kpi"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#124b7a]"
          >
            <FileCheck2 size={14} />
            Open Attendance &amp; EOD Log →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Today Attendance</p>
          <div className="mt-2">
            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${attendanceTone}`}>
              {formatAttendanceStatusLabel(desk.attendanceStatus)}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {desk.checkIn ? `Checked in at ${desk.checkIn}` : 'Not checked in yet'}
            {desk.checkOut ? ` · Out ${desk.checkOut}` : ''}
            {desk.hoursWorked > 0 ? ` (${desk.hoursWorked}h)` : ''}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">GPS Location Check</p>
          <div className="mt-2">{renderLocationBadge(desk.locationType, desk.locationLabel)}</div>
          <p className="mt-2 text-xs text-slate-600">
            {desk.locationType === 'office_location'
              ? 'Verified inside Dhanmondi office zone.'
              : desk.locationType === 'remote_location'
                ? 'Checked in outside the office zone.'
                : desk.locationType === 'location_denied' || desk.locationType === 'location_unavailable'
                  ? 'Browser GPS was not shared at check-in.'
                  : 'Allow GPS Location on KPI & Workspace when checking in.'}
          </p>
          {desk.mapsUrl && (
            <a
              href={desk.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#0f3a5c] hover:underline"
            >
              View Check-In Pin <ExternalLink size={10} />
            </a>
          )}
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            desk.overdueLeads > 0 || desk.overdueTasks > 0
              ? 'border-amber-200 bg-amber-50/60'
              : 'border-indigo-200 bg-indigo-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Today CRM &amp; Tasks</p>
            <Activity size={14} className="text-indigo-700" />
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">{desk.todayActions} actions</p>
          <p className="mt-1 text-xs text-slate-600">
            {desk.overdueLeads} overdue follow-ups · {desk.openTasks} open tasks ({desk.overdueTasks} overdue)
          </p>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            desk.eodSubmitted ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Daily EOD Reflection</p>
            {desk.eodSubmitted ? (
              <FileCheck2 size={14} className="text-emerald-700" />
            ) : (
              <ClipboardList size={14} className="text-slate-600" />
            )}
          </div>
          <p className="mt-1 font-heading text-2xl font-bold text-slate-900">
            {desk.eodSubmitted ? 'Submitted' : 'Pending Today'}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {desk.eodSubmitted ? 'End-of-day log recorded for today.' : 'Submit your EOD reflection before sign-out.'}
          </p>
        </div>
      </div>
    </section>
  );
}

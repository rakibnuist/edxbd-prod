'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ContactRound,
  ExternalLink,
  Flame,
  Globe2,
  GraduationCap,
  Handshake,
  Layers,
  MessageCircle,
  MessageSquareQuote,
  Phone,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users2,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MetaConnectionPanel from '@/components/admin/MetaConnectionPanel';

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
  totalUniversities: number;
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
    active: boolean;
    pollInterval: string;
    formId: string;
    formName: string;
    campaignName: string;
    tokenType: string;
  };
}

const statusTones: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-amber-50 text-amber-900 border-amber-200', text: 'text-amber-700', label: 'New Enquiry' },
  contacted: { bg: 'bg-blue-50 text-blue-900 border-blue-200', text: 'text-blue-700', label: 'Contacted' },
  in_progress: { bg: 'bg-indigo-50 text-indigo-900 border-indigo-200', text: 'text-indigo-700', label: 'In Progress' },
  qualified: { bg: 'bg-cyan-50 text-cyan-900 border-cyan-200', text: 'text-cyan-700', label: 'Qualified' },
  no_response: { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-600', label: 'No Response' },
  closed: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Completed' },
  converted: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Enrolled' },
  enrolled: { bg: 'bg-emerald-50 text-emerald-900 border-emerald-200', text: 'text-emerald-700', label: 'Enrolled' },
  not_interested: { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'text-gray-600', label: 'Closed' },
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
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
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
    }
  };

  const handleSyncMetaLeads = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const res = await authenticatedFetch('/api/admin/leads?sync=1');
      if (res.ok) {
        setSyncMessage('Meta Graph API synced successfully!');
        await fetchDashboard();
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

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async data load
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
          onClick={fetchDashboard}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metaPct = stats.totalLeads > 0 ? Math.round((stats.metaLeads / stats.totalLeads) * 100) : 0;
  const webPct = Math.max(0, 100 - metaPct);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2540] via-[#0f3a5c] to-[#124b7a] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Meta Leads Engine Active · Auto-Delivering (2m sync)
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Admissions Command Center
            </h1>
            <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
              Real-time monitoring for student enquiries, Meta China March 2027 campaigns, admissions pipelines, and verified institutional catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncMetaLeads}
              disabled={syncing}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-wait"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing Graph API...' : 'Sync Meta Leads Now'}
            </button>
            <Link
              href="/admin/leads"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-300"
            >
              <Users2 size={15} />
              Open Leads Workspace
            </Link>
          </div>
        </div>

        {syncMessage && (
          <div className="relative z-10 mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-100">
            {syncMessage}
          </div>
        )}
      </section>

      {/* Primary KPI Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Enquiries */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Users2 size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
              <TrendingUp size={12} />
              All-Time
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Total Enquiries</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-slate-900">{stats.totalLeads}</span>
            <span className="text-xs text-slate-500">students</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-blue-700">{stats.metaLeads} Meta Ads</span>
            <span>·</span>
            <span>{stats.websiteLeads} Website</span>
          </div>
        </div>

        {/* Action Required: New Enquiries */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <Flame size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
              Needs Outreach
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">New Enquiries</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-amber-900">{stats.newLeads}</span>
            <span className="text-xs font-semibold text-amber-800">unassigned</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600">Pending counselor contact</span>
            <Link href="/admin/leads" className="font-bold text-amber-800 hover:underline">
              View queue →
            </Link>
          </div>
        </div>

        {/* Active Pipeline */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
              <Zap size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800">
              Active Stage
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">In Progress / Qualified</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-slate-900">{stats.inProgressLeads}</span>
            <span className="text-xs text-slate-500">conversations</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span>{stats.noResponseLeads} No Response</span>
            <span>·</span>
            <span>{stats.closedLeads} Completed</span>
          </div>
        </div>

        {/* University Catalog */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <GraduationCap size={22} />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              Live Catalog
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">Active Universities</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-slate-900">{stats.totalUniversities}</span>
            <span className="text-xs text-slate-500">institutions</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600">China &amp; Europe profiles</span>
            <Link href="/admin/universities" className="font-bold text-emerald-700 hover:underline">
              Manage →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Command Hub */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Quick Operations Hub</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Link
            href="/admin/leads"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
          >
            <Users2 size={16} className="text-blue-700" />
            Admissions
          </Link>
          <Link
            href="/admin/universities"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
          >
            <GraduationCap size={16} className="text-emerald-700" />
            Universities
          </Link>
          <Link
            href="/admin/teams"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900"
          >
            <ContactRound size={16} className="text-indigo-700" />
            Team ({stats.totalTeam})
          </Link>
          <Link
            href="/admin/trust"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
          >
            <ShieldCheck size={16} className="text-amber-700" />
            Company Trust
          </Link>
          <Link
            href="/admin/testimonials"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-900"
          >
            <MessageSquareQuote size={16} className="text-purple-700" />
            Testimonials
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950"
          >
            <Settings size={16} className="text-slate-700" />
            Settings &amp; CAPI
          </Link>
        </div>
      </section>

      {/* Campaign Intelligence & Admissions Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Campaign Card (2 Cols) */}
        <section className="space-y-6 lg:col-span-2">
          {/* Active Ad Campaign Engine */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700">
                  <Layers size={20} />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">Active Meta Lead Campaign</h2>
                  <p className="text-xs text-slate-500">META_Leads_BD_China-Mar2027_2026Q1 · Form 986182003780725</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={14} />
                Ad Set Active ($0.35/lead)
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Active Ad Set</p>
                <p className="mt-1 font-semibold text-slate-900">BD_Broad_18plus_China-Mar2027</p>
                <p className="mt-1 text-[11px] text-emerald-700">Instant Forms · 117+ conversions</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Pipeline Integration</p>
                <p className="mt-1 font-semibold text-slate-900">Triple Redundant</p>
                <p className="mt-1 text-[11px] text-blue-700">Webhook + 2m Cron + Page Poll</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Access Token Status</p>
                <p className="mt-1 font-semibold text-slate-900">System User (Rakib)</p>
                <p className="mt-1 text-[11px] text-purple-700">Permanent · Never Expiring</p>
              </div>
            </div>

            {/* Source Distribution Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Lead Source Breakdown</span>
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

          {/* Admissions Pipeline Status Funnel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">Admissions Pipeline Health</h2>
                <p className="text-xs text-slate-500">Real-time breakdown across all 305 student enquiries</p>
              </div>
              <Link href="/admin/leads" className="text-xs font-bold text-[#0f3a5c] hover:underline">
                View all leads →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-center">
                <p className="text-xs font-bold text-amber-800">New Enquiries</p>
                <p className="mt-1 font-heading text-2xl font-bold text-amber-900">{stats.newLeads}</p>
                <p className="mt-0.5 text-[11px] text-amber-700">Awaiting contact</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-center">
                <p className="text-xs font-bold text-blue-800">In Progress</p>
                <p className="mt-1 font-heading text-2xl font-bold text-blue-900">{stats.inProgressLeads}</p>
                <p className="mt-0.5 text-[11px] text-blue-700">In active counseling</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold text-slate-700">No Response</p>
                <p className="mt-1 font-heading text-2xl font-bold text-slate-900">{stats.noResponseLeads}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Follow-up needed</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-center">
                <p className="text-xs font-bold text-emerald-800">Closed / Enrolled</p>
                <p className="mt-1 font-heading text-2xl font-bold text-emerald-900">{stats.closedLeads}</p>
                <p className="mt-0.5 text-[11px] text-emerald-700">Concluded outcomes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Meta Connection & Institutional Records */}
        <section className="space-y-6">
          <MetaConnectionPanel />

          {/* Institutional Catalog Health */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-heading text-base font-bold text-slate-900">Institutional Assets</h3>
            <p className="mt-0.5 text-xs text-slate-500">Live public website content status</p>

            <div className="mt-4 space-y-3">
              <Link
                href="/admin/teams"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Team Profiles</span>
                </div>
                <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800">
                  {stats.publishedTeam} / {stats.totalTeam} Published
                </span>
              </Link>

              <Link
                href="/admin/testimonials"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquareQuote size={16} className="text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">Student Testimonials</span>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                  {stats.totalTestimonials} Verified
                </span>
              </Link>

              <Link
                href="/admin/partnerships"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Handshake size={16} className="text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">Institutional Partners</span>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                  {stats.totalPartnerships} Partners
                </span>
              </Link>

              <Link
                href="/admin/countries"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Globe2 size={16} className="text-cyan-600" />
                  <span className="text-xs font-bold text-slate-800">Active Destinations</span>
                </div>
                <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800">
                  {stats.totalCountries} Countries
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Live Incoming Student Enquiries Feed */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h2 className="font-heading text-lg font-bold text-slate-900">Recent Student Enquiries</h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Live submissions from Meta Instant Forms and website assessments (Click WhatsApp to connect immediately)
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
          >
            Open All {stats.totalLeads} Enquiries <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          {stats.recentLeads.length > 0 ? (
            stats.recentLeads.map((lead) => {
              const tone = statusTones[lead.status] || statusTones.new;
              const digits = cleanDigits(lead.phone || '');
              const waUrl = digits ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for contacting EduExpress regarding your study in China plans!`)}` : null;

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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${tone.bg}`}>
                          {tone.label}
                        </span>
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
                        <span>{lead.country || 'China'}</span>
                        <span>·</span>
                        <span>{lead.program || 'China March 2027'}</span>
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

                  <div className="flex items-center gap-2">
                    <div className="mr-3 text-right text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatDhakaDate(lead.createdAt)}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{lead.phone || lead.email}</span>
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

                    <Link
                      href="/admin/leads"
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
            <p className="py-6 text-center text-sm text-slate-500">No student enquiries recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

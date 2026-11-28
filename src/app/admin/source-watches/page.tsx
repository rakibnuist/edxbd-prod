'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  EyeOff,
  ExternalLink,
  Loader2,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Terminal,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SourceWatchRow {
  id: string;
  watchKey: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  country: string | null;
  sourceUrl: string;
  authorityLabel: string;
  checkIntervalDays: number;
  lastCheckedAt: string | null;
  lastChangedAt: string | null;
  lastHttpStatus: number | null;
  status: string;
  diffSummary: string | null;
  notes: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  updatedAt: string;
}

interface SourceWatchResponse {
  summary: Record<string, number>;
  byEntityType?: Record<string, number>;
  totalAll?: number;
  totalMatched?: number;
  totalReturned: number;
  items: SourceWatchRow[];
}

const ENTITY_OPTIONS = [
  { value: '', label: 'All Entity Types' },
  { value: 'country_policy', label: 'Country Visa & Policy' },
  { value: 'university', label: 'University Portal' },
  { value: 'program', label: 'Program Tuition' },
  { value: 'scholarship', label: 'Scholarship Notice' },
  { value: 'fee', label: 'Non-Tuition Fee' },
];

const STATUS_META: Record<
  string,
  { label: string; badgeClass: string; cardAccent: string }
> = {
  changed_needs_review: {
    label: 'Changed · Needs Review',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    cardAccent: 'border-amber-200 bg-amber-50/70 text-amber-950',
  },
  broken_link: {
    label: 'Broken Link',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    cardAccent: 'border-rose-200 bg-rose-50/70 text-rose-950',
  },
  active: {
    label: 'Active',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    cardAccent: 'border-emerald-200 bg-emerald-50/70 text-emerald-950',
  },
  paused: {
    label: 'Paused',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    cardAccent: 'border-slate-200 bg-slate-50 text-slate-800',
  },
};

const CRON_COMMAND = 'node scripts/check-hidden-sources.mjs --limit 40 --notify';

function formatShortDate(iso: string | null): string {
  if (!iso) return 'Never';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return 'Never';
  return dt.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminSourceWatchesPage() {
  const { authenticatedFetch } = useAuth();
  const [data, setData] = useState<SourceWatchResponse>({
    summary: {},
    byEntityType: {},
    totalAll: 0,
    totalMatched: 0,
    totalReturned: 0,
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newWatch, setNewWatch] = useState({
    watchKey: '',
    entityType: 'country_policy',
    entityId: '',
    entityLabel: '',
    country: 'China',
    authorityLabel: 'Official Institutional Notice',
    sourceUrl: '',
    checkIntervalDays: 30,
    notes: '',
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadWatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (statusFilter) params.set('status', statusFilter);
      if (entityFilter) params.set('entityType', entityFilter);
      if (debouncedQuery) params.set('q', debouncedQuery);
      const res = await authenticatedFetch(`/api/admin/source-watches?${params.toString()}`);
      if (res.ok) {
        const json = (await res.json()) as SourceWatchResponse;
        setData(json);
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback(err.error || err.message || 'Could not load private source watches.');
      }
    } catch {
      setFeedback('Network error while loading private source watches.');
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch, statusFilter, entityFilter, debouncedQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadWatches(), 0);
    return () => window.clearTimeout(timer);
  }, [loadWatches]);

  const handlePatch = async (
    id: string,
    payload: Record<string, unknown>,
    successMsg: string,
  ) => {
    setBusyId(id);
    setFeedback('');
    try {
      const res = await authenticatedFetch('/api/admin/source-watches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      });
      if (res.ok) {
        setFeedback(successMsg);
        await loadWatches();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback(err.error || err.message || 'Failed to update source watch.');
      }
    } catch {
      setFeedback('Network error while updating source watch.');
    } finally {
      setBusyId('');
    }
  };

  const handleAddWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyId('add-new');
    setFeedback('');
    try {
      const normalizedKey =
        newWatch.watchKey.trim() ||
        `${newWatch.entityType}:${newWatch.entityId.trim() || 'custom'}:${Date.now()}`;
      const res = await authenticatedFetch('/api/admin/source-watches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newWatch,
          watchKey: normalizedKey,
          entityId: newWatch.entityId.trim() || normalizedKey,
          checkIntervalDays: Number(newWatch.checkIntervalDays) || 30,
        }),
      });
      if (res.ok) {
        setFeedback('Private hidden source watch saved to the vault.');
        setShowAddForm(false);
        setNewWatch({
          watchKey: '',
          entityType: 'country_policy',
          entityId: '',
          entityLabel: '',
          country: 'China',
          authorityLabel: 'Official Institutional Notice',
          sourceUrl: '',
          checkIntervalDays: 30,
          notes: '',
        });
        await loadWatches();
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedback(err.error || err.message || 'Could not save source watch. Ensure URL starts with https://.');
      }
    } catch {
      setFeedback('Network error while saving source watch.');
    } finally {
      setBusyId('');
    }
  };

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedKey(key);
          window.setTimeout(() => setCopiedKey(''), 1800);
        })
        .catch(() => setFeedback('Clipboard copy was blocked by the browser.'));
    }
  };

  const summary = data.summary || {};
  const byType = data.byEntityType || {};
  const totalAll =
    data.totalAll ??
    Object.values(summary).reduce((acc, n) => acc + (typeof n === 'number' ? n : 0), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      {/* Header */}
      <header className="rounded-3xl bg-[#0f3a5c] p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#a9d6ee]">
              <EyeOff size={13} /> Tier-2 Private Vault · Never Shown Publicly
            </p>
            <h1 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
              Hidden Source Monitoring Vault
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Deep institutional fee sheets, scholarship notices, and embassy solvency URLs tracked
              privately for automatic change detection. Public pages, widgets, and CC BY 4.0 CSVs
              expose only Tier-1 root domains and regulatory authority names.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadWatches()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#a3e635] px-4 py-2.5 text-xs font-black text-[#0f3a5c] hover:bg-[#bef264]"
            >
              {showAddForm ? <X size={15} /> : <Plus size={15} />}
              {showAddForm ? 'Close Form' : 'Add Hidden URL'}
            </button>
          </div>
        </div>

        {/* Entity Breakdown Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4 text-xs">
          <span className="font-bold text-white/75">Total Vault ({totalAll.toLocaleString()}):</span>
          {Object.entries(byType).map(([typeKey, count]) => (
            <button
              key={typeKey}
              type="button"
              onClick={() => setEntityFilter((prev) => (prev === typeKey ? '' : typeKey))}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                entityFilter === typeKey
                  ? 'bg-[#a3e635] text-[#0f3a5c]'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              {typeKey}: {count.toLocaleString()}
            </button>
          ))}
        </div>
      </header>

      {/* KPI Status Filter Cards */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ['changed_needs_review', 'Changed · Needs Review', AlertTriangle],
            ['broken_link', 'Broken Link', ShieldAlert],
            ['active', 'Active Monitoring', CheckCircle2],
            ['paused', 'Paused', PauseCircle],
          ] as const
        ).map(([statusKey, label, Icon]) => {
          const count = summary[statusKey] || 0;
          const selected = statusFilter === statusKey;
          const meta = STATUS_META[statusKey];
          return (
            <button
              key={statusKey}
              type="button"
              onClick={() => setStatusFilter((prev) => (prev === statusKey ? '' : statusKey))}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? 'ring-2 ring-[#0f3a5c] ring-offset-2 ' + meta.cardAccent
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {label}
                </span>
                <Icon size={17} className="text-slate-500" />
              </div>
              <p className="mt-2 font-heading text-3xl font-bold text-slate-900">
                {count.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                {selected ? 'Filtered (click to show all)' : 'Click to filter'}
              </p>
            </button>
          );
        })}
      </section>

      {/* Automated Polling Cron Helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-xs text-slate-200">
        <div className="flex items-center gap-2.5">
          <Terminal size={16} className="shrink-0 text-[#a3e635]" />
          <div>
            <span className="font-bold text-white">Weekly Automated Diff &amp; Telegram Digest:</span>{' '}
            <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-[#bef264]">
              {CRON_COMMAND}
            </code>
          </div>
        </div>
        <button
          type="button"
          onClick={() => copyText('cron', CRON_COMMAND)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 font-bold text-white hover:bg-white/20"
        >
          <Copy size={13} />
          {copiedKey === 'cron' ? 'Copied' : 'Copy Command'}
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">
          {feedback}
        </div>
      )}

      {/* Add New Hidden Source Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddWatch}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
        >
          <h2 className="font-heading text-lg font-bold text-slate-900">
            Add Private Source Watch URL
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Stored strictly in SQLite `InternalSourceWatch`. Never exposed in widgets or public CSVs.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Entity Type</span>
              <select
                value={newWatch.entityType}
                onChange={(e) => setNewWatch((p) => ({ ...p, entityType: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {ENTITY_OPTIONS.filter((o) => o.value).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Label *</span>
              <input
                required
                value={newWatch.entityLabel}
                onChange={(e) => setNewWatch((p) => ({ ...p, entityLabel: e.target.value }))}
                placeholder="e.g. Germany Sperrkonto 2027 Requirement"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Country</span>
              <input
                value={newWatch.country}
                onChange={(e) => setNewWatch((p) => ({ ...p, country: e.target.value }))}
                placeholder="China / Germany / Canada"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-bold text-slate-600">
                Private Deep Source URL (https://) *
              </span>
              <input
                required
                type="url"
                value={newWatch.sourceUrl}
                onChange={(e) => setNewWatch((p) => ({ ...p, sourceUrl: e.target.value }))}
                placeholder="https://admission.example.edu.cn/en/fees/2027"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Authority Label</span>
              <input
                value={newWatch.authorityLabel}
                onChange={(e) => setNewWatch((p) => ({ ...p, authorityLabel: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">
                Entity Slug / ID
              </span>
              <input
                value={newWatch.entityId}
                onChange={(e) => setNewWatch((p) => ({ ...p, entityId: e.target.value }))}
                placeholder="e.g. germany or tsinghua-university"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">
                Check Interval (days)
              </span>
              <input
                type="number"
                min={1}
                max={365}
                value={newWatch.checkIntervalDays}
                onChange={(e) =>
                  setNewWatch((p) => ({ ...p, checkIntervalDays: Number(e.target.value) || 30 }))
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-slate-600">Internal Notes</span>
              <input
                value={newWatch.notes}
                onChange={(e) => setNewWatch((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional editorial watch note"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busyId === 'add-new'}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#0b2a44] disabled:opacity-50"
            >
              {busyId === 'add-new' && <Loader2 size={14} className="animate-spin" />}
              Save to Private Vault
            </button>
          </div>
        </form>
      )}

      {/* Search & Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search university, country, authority, or hidden URL..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0f3a5c] focus:bg-white"
            />
          </div>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
          >
            {ENTITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="changed_needs_review">Changed · Needs Review</option>
            <option value="broken_link">Broken Link</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <p className="mt-2.5 text-xs text-slate-500">
          Showing <strong>{data.items.length}</strong> of{' '}
          <strong>{(data.totalMatched ?? data.items.length).toLocaleString()}</strong> matching
          private watches (capped at 200 per view — refine with search or filters).
        </p>
      </section>

      {/* Watch List */}
      <section className="space-y-3">
        {loading ? (
          <div className="grid min-h-48 place-items-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="animate-spin text-[#0f3a5c]" />
          </div>
        ) : data.items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No private source watches match the current filters.
          </div>
        ) : (
          data.items.map((item) => {
            const meta = STATUS_META[item.status] || STATUS_META.active;
            const isBusy = busyId === item.id;
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {item.entityType}
                      </span>
                      {item.country && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
                          {item.country}
                        </span>
                      )}
                      {item.lastHttpStatus !== null && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${
                            item.lastHttpStatus >= 200 && item.lastHttpStatus < 400
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          HTTP {item.lastHttpStatus}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{item.entityLabel}</h3>
                    <p className="text-xs text-slate-500">
                      Authority: <strong className="text-slate-700">{item.authorityLabel}</strong> ·
                      Every {item.checkIntervalDays}d · Checked {formatShortDate(item.lastCheckedAt)}
                      {item.reviewedAt && ` · Reviewed ${formatShortDate(item.reviewedAt)}`}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-[#0f3a5c] hover:bg-slate-100 hover:underline"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="truncate">{item.sourceUrl}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => copyText(item.id, item.sourceUrl)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Copy size={11} />
                        {copiedKey === item.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {item.diffSummary && (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 font-mono text-[11px] whitespace-pre-wrap text-amber-950">
                        {item.diffSummary}
                      </div>
                    )}
                    {item.notes && (
                      <p className="pt-1 text-xs italic text-slate-500">Note: {item.notes}</p>
                    )}
                  </div>

                  {/* Row Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {(item.status === 'changed_needs_review' || item.status === 'broken_link') && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          void handlePatch(
                            item.id,
                            { action: 'mark_reviewed' },
                            `Marked "${item.entityLabel}" as reviewed & active.`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Mark Reviewed
                      </button>
                    )}
                    {item.status !== 'paused' ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          void handlePatch(
                            item.id,
                            { status: 'paused' },
                            `Paused monitoring for "${item.entityLabel}".`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        <PauseCircle size={13} /> Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          void handlePatch(
                            item.id,
                            { status: 'active' },
                            `Resumed monitoring for "${item.entityLabel}".`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <PlayCircle size={13} /> Resume
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { MetaHealth } from '@/lib/meta-health';

const labels: Record<string, string> = {
  missing_pixel: 'Setup required', missing_token: 'Access token needed', configured: 'Ready to check',
  connected: 'Connected', active: 'Delivering events', attention: 'Needs attention',
};
export default function MetaConnectionPanel({ refreshKey = 0, pendingChanges = false }: { refreshKey?: number; pendingChanges?: boolean }) {
  const { authenticatedFetch, isAuthenticated, loading: authLoading } = useAuth();
  const [health, setHealth] = useState<MetaHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const controller = new AbortController();
    authenticatedFetch('/api/meta-status', { signal: controller.signal, cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error('Could not load the Meta connection status.'); return response.json(); })
      .then(data => setHealth(data))
      .catch(error => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, isAuthenticated, refreshKey, retry, authenticatedFetch]);
  const check = async () => {
    setChecking(true); setError(null); setCheckFeedback(null);
    try {
      const response = await authenticatedFetch('/api/meta-status', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The connection check could not finish. Please retry.');
      setHealth(data); setCheckFeedback(data.check?.message || null);
    } catch (error) { setError(error instanceof Error ? error.message : 'Connection check failed.'); }
    finally { setChecking(false); }
  };
  const healthy = health && ['active', 'connected'].includes(health.state);
  return <section aria-labelledby="meta-connection-title" className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="meta-connection-title" className="text-base font-semibold">Meta tracking</h2><p className="mt-1 text-xs text-gray-600">Website Pixel and server-side Conversions API.</p></div>
      <Link href="/admin/settings#meta-tracking" className="min-h-9 text-sm font-medium text-[#174f7a] hover:underline">Manage settings</Link></div>
    <dl className="mt-5 grid gap-4 sm:grid-cols-3"><div><dt className="text-xs text-gray-600">Meta Pixel</dt><dd className="mt-2 text-sm font-medium">{loading && !health ? 'Checking…' : health?.pixelActive ? 'Configured' : health ? 'Not configured' : 'Status unavailable'}</dd><dd className="mt-1 break-all text-xs text-gray-600">{health?.pixelId ? `Dataset ${health.pixelId}` : 'No dataset selected'}</dd></div>
      <div><dt className="text-xs text-gray-600">Conversions API</dt><dd className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs font-medium ${healthy ? 'bg-emerald-50 text-emerald-900' : health?.state === 'attention' ? 'bg-red-50 text-red-900' : 'bg-gray-100 text-gray-700'}`}>{loading && !health ? 'Checking…' : health ? labels[health.state] || 'Status unavailable' : 'Status unavailable'}</dd></div>
      <div><dt className="text-xs text-gray-600">Last accepted server event</dt><dd className="mt-2 text-sm">{health?.lastAcceptedAt ? new Date(health.lastAcceptedAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) : 'No delivery recorded yet'}</dd><dd className="mt-1 text-xs text-gray-600">A saved token alone does not confirm delivery.</dd></div></dl>
    {health && <p className="mt-5 text-sm leading-6 text-gray-700">{health.message}</p>}
    {checkFeedback && <p role="status" className="mt-3 text-sm text-gray-700">{checkFeedback}</p>}
    {pendingChanges && <p className="mt-3 text-sm text-amber-900">Save your new credentials before checking the connection.</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-800">{error} <button onClick={() => { setLoading(true); setError(null); setRetry(value => value + 1); }} className="font-semibold underline">Retry</button></p>}
    <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={check} disabled={checking || loading || !health?.accessTokenConfigured || pendingChanges} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#174f7a] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"><RefreshCw size={14} className={checking ? 'animate-spin' : ''} />{checking ? 'Checking connection…' : 'Check connection'}</button>
      <span className="text-xs text-gray-600">Checks dataset access without sending conversion events.</span></div>
  </section>;
}

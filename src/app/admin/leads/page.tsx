'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LeadWorkspace from '@/components/admin/LeadWorkspace';
import type { LeadRecord } from '@/lib/lead-workflow';

export default function LeadsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const controller = new AbortController();
    authenticatedFetch('/api/admin/leads', { signal: controller.signal, cache: 'no-store' })
      .then(async response => { if (!response.ok) throw new Error('Could not load enquiries. Please try again.'); return response.json(); })
      .then(data => { if (!Array.isArray(data)) throw new Error('Invalid enquiry response.'); setLeads(data); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, isAuthenticated, refresh, authenticatedFetch]);
  const update = async (id: string, data: { status?: string; notes?: string }) => {
    setSavingId(id); setError(null); setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be updated. Please retry.');
      setLeads(previous => previous.map(lead => lead.id === id ? result : lead));
      setNotice(data.notes !== undefined ? 'Counselor notes saved.' : 'Lead status updated.');
      return true;
    } catch (error) { setError(error instanceof Error ? error.message : 'Update failed.'); return false; }
    finally { setSavingId(null); }
  };
  const remove = async (id: string) => {
    setError(null); setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('The enquiry could not be deleted. Please retry.');
      setLeads(previous => previous.filter(lead => lead.id !== id)); setNotice('Lead deleted.'); return true;
    } catch (error) { setError(error instanceof Error ? error.message : 'Delete failed.'); return false; }
  };
  return <LeadWorkspace leads={leads} loading={loading || authLoading} error={error} notice={notice} savingId={savingId} onRefresh={() => { setLoading(true); setError(null); setRefresh(value => value + 1); }} onUpdate={update} onDelete={remove} />;
}

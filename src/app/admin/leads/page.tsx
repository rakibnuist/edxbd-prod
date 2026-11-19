'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LeadWorkspace from '@/components/admin/LeadWorkspace';
import type { EmployeeOption } from '@/components/admin/LeadPortalDrawerSection';
import { parseMetaLeadsCsv, type LeadRecord } from '@/lib/lead-workflow';

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const initialLeadId = searchParams.get('lead');
  const { isAuthenticated, loading: authLoading, authenticatedFetch, user } = useAuth();
  const isCounselor = user?.role === 'counselor';
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [syncingMeta, setSyncingMeta] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const controller = new AbortController();

    authenticatedFetch('/api/admin/leads', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load enquiries. Please try again.');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Invalid enquiry response.');
        setLeads(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    authenticatedFetch('/api/admin/employees', { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.employees)) {
          setEmployees(data.employees.filter((e: { active?: boolean }) => e.active !== false));
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [authLoading, isAuthenticated, refresh, authenticatedFetch]);

  const syncMeta = async () => {
    setSyncingMeta(true);
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch('/api/admin/leads?sync=1', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to sync with Meta Graph API.');
      if (Array.isArray(result)) {
        setLeads(result);
        setNotice(`Meta Graph API synced successfully! Loaded ${result.length} enquiries.`);
      } else {
        setRefresh((v) => v + 1);
        setNotice('Meta Graph API sync complete.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Meta sync failed.');
    } finally {
      setSyncingMeta(false);
    }
  };

  const update = async (id: string, data: Record<string, unknown>) => {
    setSavingId(id);
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be updated. Please retry.');
      setLeads((previous) => previous.map((lead) => (lead.id === id ? result : lead)));
      setNotice(data.notes !== undefined ? 'Counselor notes saved.' : 'Lead updated.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
      return false;
    } finally {
      setSavingId(null);
    }
  };

  const ensureToken = async (id: string): Promise<string | null> => {
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ensure_token' }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.publicToken) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, publicToken: data.publicToken, publicEnabled: true } : l)),
        );
        return data.publicToken;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleTokenChanged = (id: string, token: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, publicToken: token, publicEnabled: true } : l)));
  };

  const remove = async (id: string) => {
    setError(null);
    setNotice(null);
    try {
      const response = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('The enquiry could not be deleted. Please retry.');
      setLeads((previous) => previous.filter((lead) => lead.id !== id));
      setNotice('Lead deleted.');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
      return false;
    }
  };

  const copilot = async (id: string, options: { language: 'en' | 'bn'; focus?: string }) => {
    try {
      const response = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(id)}/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      const result = await response.json();
      if (!response.ok) {
        return { error: result.error || result.message || 'Could not generate counselor co-pilot brief.' };
      }
      return { data: result };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unable to reach counselor co-pilot service.' };
    }
  };

  const importCsv = async (file: File) => {
    setImporting(true);
    setError(null);
    setNotice(null);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const isUtf16Le = bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe;
      const text = new TextDecoder(isUtf16Le ? 'utf-16le' : 'utf-8').decode(buffer);
      const rows = parseMetaLeadsCsv(text);
      if (!rows.length) {
        setError('No valid lead rows found in the selected CSV file.');
        return;
      }

      const response = await authenticatedFetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: rows }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || result?.message || 'CSV import failed.');
      }

      const createdLeads: LeadRecord[] = Array.isArray(result?.created) ? result.created : [];
      const importedCount = typeof result?.importedCount === 'number' ? result.importedCount : createdLeads.length;
      const skippedCount = typeof result?.skippedCount === 'number' ? result.skippedCount : 0;

      if (createdLeads.length) {
        setLeads((prev) => [...createdLeads.slice().reverse(), ...prev]);
      }
      setNotice(
        `Imported ${importedCount} Meta ${importedCount === 1 ? 'lead' : 'leads'}${skippedCount ? ` (${skippedCount} existing skipped)` : ''}.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSV import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <LeadWorkspace
      leads={leads}
      employees={employees}
      initialLeadId={initialLeadId}
      loading={loading || authLoading}
      importing={importing}
      syncingMeta={syncingMeta}
      error={error}
      notice={notice}
      savingId={savingId}
      onRefresh={() => {
        setLoading(true);
        setError(null);
        setRefresh((value) => value + 1);
      }}
      isCounselor={isCounselor}
      onAutoAssign={isCounselor ? undefined : async (scope) => {
        setError(null);
        setNotice(null);
        try {
          const res = await authenticatedFetch('/api/admin/leads/auto-assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scope }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Auto-assignment failed.');
          setRefresh((v) => v + 1);
          setNotice(`Auto-assigned ${result.assignedCount} unassigned leads cleanly across counselors.`);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Auto-assignment failed.');
        }
      }}
      onSyncMeta={isCounselor ? undefined : syncMeta}
      onUpdate={update}
      onDelete={isCounselor ? undefined : remove}
      onEnsureToken={ensureToken}
      onTokenChanged={handleTokenChanged}
      onCopilot={copilot}
      onImportCsv={isCounselor ? undefined : importCsv}
    />
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading leads…</div>}>
      <LeadsPageContent />
    </Suspense>
  );
}

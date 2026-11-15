'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LeadWorkspace from '@/components/admin/LeadWorkspace';
import { parseMetaLeadsCsv, type LeadRecord } from '@/lib/lead-workflow';

export default function LeadsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
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
      const existingPhones = new Set(
        leads.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
      );
      let importedCount = 0;
      let skippedCount = 0;
      const createdLeads: LeadRecord[] = [];
      for (const row of rows) {
        const key10 = row.phone.replace(/\D/g, '').slice(-10);
        if (key10 && existingPhones.has(key10)) {
          skippedCount++;
          continue;
        }
        const response = await authenticatedFetch('/api/admin/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        });
        if (response.ok) {
          const created: LeadRecord = await response.json();
          createdLeads.push(created);
          importedCount++;
          if (key10) existingPhones.add(key10);
        }
      }
      if (createdLeads.length) {
        setLeads((prev) => [...createdLeads.reverse(), ...prev]);
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
  return <LeadWorkspace leads={leads} loading={loading || authLoading} importing={importing} error={error} notice={notice} savingId={savingId} onRefresh={() => { setLoading(true); setError(null); setRefresh(value => value + 1); }} onUpdate={update} onDelete={remove} onCopilot={copilot} onImportCsv={importCsv} />;
}

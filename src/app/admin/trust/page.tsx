'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BadgeDollarSign, Building2, Loader2, Plus, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Dynamic admin records share one editor surface and are validated again by the API.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordRow = Record<string, any>;
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={className}><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>{children}</label>;
}

export default function TrustAdminPage() {
  const { authenticatedFetch } = useAuth();
  const [data, setData] = useState<{ metrics: RecordRow[]; offices: RecordRow[]; packages: RecordRow[] }>({
    metrics: [],
    offices: [],
    packages: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const response = await authenticatedFetch('/api/admin/trust');
    if (response.ok) setData(await response.json());
    setLoading(false);
  }, [authenticatedFetch]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const update = (collection: 'metrics' | 'offices' | 'packages', id: string, field: string, value: unknown) => {
    setData(previous => ({ ...previous, [collection]: previous[collection].map(record => record.id === id ? { ...record, [field]: value } : record) }));
  };

  const save = async (kind: string, record: RecordRow) => {
    setSaving(record.id);
    setMessage('');
    const response = await authenticatedFetch('/api/admin/trust', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...record, kind }) });
    setMessage(response.ok ? 'Saved to the central trust database.' : (await response.json().catch(() => ({}))).error || 'Could not save this record.');
    setSaving('');
    if (response.ok) await load();
  };

  const addOffice = async () => {
    setSaving('new-office');
    setMessage('');
    const response = await authenticatedFetch('/api/admin/trust', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'office' }) });
    setMessage(response.ok ? 'Canonical Dhanmondi office record created.' : (await response.json().catch(() => ({}))).error || 'Could not create the office record.');
    setSaving('');
    if (response.ok) await load();
  };

  if (loading) return <div className="grid min-h-60 place-items-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return <div className="mx-auto max-w-7xl space-y-8 pb-16">
    <header className="rounded-3xl bg-[#0f3a5c] p-7 text-white"><p className="text-xs font-black uppercase tracking-[.16em] text-[#a9d6ee]">Company Records &amp; Transparency</p><h1 className="mt-3 font-heading text-3xl font-bold">Proof Metrics, Office Details &amp; Service Packages</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">Canonical source of truth for homepage metrics, Dhanmondi office address/phones/hours, and written service package terms.</p></header>

    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs text-slate-700 shadow-xs">
      <span><strong>Organized Records:</strong> Public team bios live under Team &amp; Users, and uploaded proof samples live in Evidence Library.</span>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/users?tab=public" className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-[#0f3a5c] hover:bg-slate-100">
          Team &amp; Users (/about Bios) →
        </Link>
        <Link href="/admin/evidence" className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-bold text-[#0f3a5c] hover:bg-slate-100">
          Evidence Library →
        </Link>
      </div>
    </div>

    {message && <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">{message}</p>}

    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><ShieldCheck className="text-blue-700" /><div><h2 className="font-heading text-2xl font-bold">Company proof metrics</h2><p className="text-sm text-slate-500">These values power the homepage and proof library.</p></div></div><div className="mt-6 grid gap-5 lg:grid-cols-2">{data.metrics.map(metric => <article key={metric.id} className="rounded-2xl bg-slate-50 p-5"><div className="grid gap-4 sm:grid-cols-[120px_1fr]"><Field label="Value"><input className={inputClass} value={metric.value} onChange={event => update('metrics', metric.id, 'value', event.target.value)} /></Field><Field label="Public label"><input className={inputClass} value={metric.label} onChange={event => update('metrics', metric.id, 'label', event.target.value)} /></Field></div><Field label="Exact definition" className="mt-4 block"><textarea className={`${inputClass} min-h-20`} value={metric.definition} onChange={event => update('metrics', metric.id, 'definition', event.target.value)} /></Field><Field label="Evidence note" className="mt-4 block"><textarea className={`${inputClass} min-h-16`} value={metric.evidenceNote || ''} onChange={event => update('metrics', metric.id, 'evidenceNote', event.target.value)} /></Field><div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={metric.isPublished} onChange={event => update('metrics', metric.id, 'isPublished', event.target.checked)} /> Show publicly</label><button onClick={() => save('metric', metric)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{saving === metric.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save</button></div></article>)}</div></section>

    <section id="office-records" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><Building2 className="text-blue-700" /><div><h2 className="font-heading text-2xl font-bold">Real offices</h2><p className="text-sm text-slate-500">One office record feeds local SEO, contact and structured data.</p></div></div>{data.offices.length === 0 && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-bold text-amber-900">No editable office record exists yet. The public site is using the approved Dhanmondi fallback.</p><button onClick={addOffice} disabled={saving === 'new-office'} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0f3a5c] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving === 'new-office' ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Create Dhanmondi office record</button></div>}<div className="mt-6 space-y-5">{data.offices.map(office => <article key={office.id} className="rounded-2xl bg-slate-50 p-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Office name"><input className={inputClass} value={office.name} onChange={event => update('offices', office.id, 'name', event.target.value)} /></Field><Field label="Address"><input className={inputClass} value={office.address} onChange={event => update('offices', office.id, 'address', event.target.value)} /></Field><Field label="Primary phone"><input className={inputClass} value={office.phonePrimary} onChange={event => update('offices', office.id, 'phonePrimary', event.target.value)} /></Field><Field label="Secondary phone"><input className={inputClass} value={office.phoneSecondary || ''} onChange={event => update('offices', office.id, 'phoneSecondary', event.target.value)} /></Field><Field label="Email"><input className={inputClass} value={office.email || ''} onChange={event => update('offices', office.id, 'email', event.target.value)} /></Field><Field label="Opening hours"><input className={inputClass} value={office.hours} onChange={event => update('offices', office.id, 'hours', event.target.value)} /></Field><Field label="Office photo URL" className="md:col-span-2"><input className={inputClass} value={office.photoUrl || ''} onChange={event => update('offices', office.id, 'photoUrl', event.target.value)} placeholder="/uploads/dhanmondi-office.webp" /></Field></div><div className="mt-4 flex justify-end"><button onClick={() => save('office', office)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{saving === office.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save office</button></div></article>)}</div></section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-center gap-3"><BadgeDollarSign className="text-blue-700" /><div><h2 className="font-heading text-2xl font-bold">China service packages</h2><p className="text-sm text-slate-500">These records power the public package and payment terms. Edit here instead of changing page code.</p></div></div><div className="mt-6 grid gap-5 xl:grid-cols-2">{data.packages.map(servicePackage => <article key={servicePackage.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Package title"><input className={inputClass} value={servicePackage.title} onChange={event => update('packages', servicePackage.id, 'title', event.target.value)} /></Field><Field label="Public price"><input className={inputClass} value={servicePackage.priceLabel} onChange={event => update('packages', servicePackage.id, 'priceLabel', event.target.value)} /></Field></div><Field label="Short description" className="mt-4 block"><textarea className={`${inputClass} min-h-16`} value={servicePackage.summary} onChange={event => update('packages', servicePackage.id, 'summary', event.target.value)} /></Field><Field label="Scholarship or cost scope" className="mt-4 block"><textarea className={`${inputClass} min-h-20`} value={servicePackage.outcomeScope} onChange={event => update('packages', servicePackage.id, 'outcomeScope', event.target.value)} /></Field><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Included items, one per line"><textarea className={`${inputClass} min-h-40`} value={(servicePackage.includedItems || []).join('\n')} onChange={event => update('packages', servicePackage.id, 'includedItems', event.target.value.split('\n'))} /></Field><Field label="Excluded items, one per line"><textarea className={`${inputClass} min-h-40`} value={(servicePackage.excludedItems || []).join('\n')} onChange={event => update('packages', servicePackage.id, 'excludedItems', event.target.value.split('\n'))} /></Field></div><Field label="Payment terms" className="mt-4 block"><textarea className={`${inputClass} min-h-20`} value={servicePackage.paymentTerms} onChange={event => update('packages', servicePackage.id, 'paymentTerms', event.target.value)} /></Field><Field label="Return or refund terms" className="mt-4 block"><textarea className={`${inputClass} min-h-20`} value={servicePackage.refundTerms} onChange={event => update('packages', servicePackage.id, 'refundTerms', event.target.value)} /></Field><Field label="Security arrangements, one per line" className="mt-4 block"><textarea className={`${inputClass} min-h-28`} value={(servicePackage.securityOptions || []).join('\n')} onChange={event => update('packages', servicePackage.id, 'securityOptions', event.target.value.split('\n'))} /></Field><Field label="Authority and outcome note" className="mt-4 block"><textarea className={`${inputClass} min-h-20`} value={servicePackage.complianceNote} onChange={event => update('packages', servicePackage.id, 'complianceNote', event.target.value)} /></Field><div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={servicePackage.isPublished} onChange={event => update('packages', servicePackage.id, 'isPublished', event.target.checked)} /> Show publicly</label><button onClick={() => save('package', servicePackage)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{saving === servicePackage.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save package</button></div></article>)}</div></section>
  </div>;
}

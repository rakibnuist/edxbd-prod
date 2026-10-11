'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Archive,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

type EvidenceRecord = {
  id: string;
  type: string;
  title: string;
  summary?: string | null;
  organization?: string | null;
  country?: string | null;
  universityId?: string | null;
  referenceLabel?: string | null;
  thumbnailUrl?: string | null;
  sourceUrl?: string | null;
  issuedAt?: string | null;
  validUntil?: string | null;
  lastVerifiedAt?: string | null;
  privacyStatus: string;
  isPublished: boolean;
  displayOrder: number;
};

type UniversityOption = { id: string; name: string };
type EvidenceGroup = 'authorization' | 'admission' | 'jw202';

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

const blankEvidence = () => ({
  kind: 'evidence',
  type: 'authorization_current',
  title: '',
  summary: '',
  organization: '',
  country: 'China',
  universityId: '',
  referenceLabel: '',
  thumbnailUrl: '',
  sourceUrl: '',
  issuedAt: '',
  validUntil: '',
  lastVerifiedAt: new Date().toISOString().slice(0, 10),
  privacyStatus: 'redacted',
  isPublished: true,
  displayOrder: 0,
});

const dateValue = (value?: string | null) => value ? value.slice(0, 10) : '';
const isArchive = (type: string) => type.includes('archive');
const evidenceGroup = (type: string): EvidenceGroup => {
  if (/jw20/i.test(type)) return 'jw202';
  if (/admission/i.test(type)) return 'admission';
  return 'authorization';
};
const defaultTypeForGroup: Record<EvidenceGroup, string> = {
  authorization: 'authorization_current',
  admission: 'admission_notice',
  jw202: 'jw202_record',
};

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={className}><span className="block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</span>{children}</label>;
}

function Preview({ record }: { record: Pick<EvidenceRecord, 'thumbnailUrl' | 'title'> }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {record.thumbnailUrl ? (
        <Image src={record.thumbnailUrl} alt={`Preview of ${record.title || 'evidence record'}`} fill sizes="260px" className="object-contain p-3" unoptimized />
      ) : (
        <div className="grid h-full place-items-center text-center text-slate-400"><div><ImagePlus className="mx-auto" /><p className="mt-2 text-xs font-bold">Upload a safe preview</p></div></div>
      )}
    </div>
  );
}

export default function EvidenceAdminPage() {
  const { authenticatedFetch } = useAuth();
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [draft, setDraft] = useState(blankEvidence());
  const [redactionConfirmed, setRedactionConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<EvidenceGroup>('authorization');

  const load = useCallback(async () => {
    const response = await authenticatedFetch('/api/admin/trust');
    if (response.ok) {
      const data = await response.json();
      setRecords(data.evidence || []);
      setUniversities(data.universities || []);
    }
    setLoading(false);
  }, [authenticatedFetch]);

  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => ({
    public: records.filter(record => record.isPublished).length,
    authorizations: records.filter(record => evidenceGroup(record.type) === 'authorization').length,
    admissions: records.filter(record => evidenceGroup(record.type) === 'admission').length,
    jw202: records.filter(record => evidenceGroup(record.type) === 'jw202').length,
  }), [records]);
  const visibleRecords = useMemo(() => records.filter(record => evidenceGroup(record.type) === selectedGroup), [records, selectedGroup]);

  const chooseGroup = (group: EvidenceGroup) => {
    setSelectedGroup(group);
    setDraft(previous => ({ ...previous, type: defaultTypeForGroup[group] }));
  };

  const uploadPreview = async (file: File, recordId: string | 'new') => {
    setBusy(`upload-${recordId}`);
    setMessage(null);
    const body = new FormData();
    body.append('image', file);
    body.append('folder', 'evidence');
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` },
      body,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage({ tone: 'error', text: result.error || 'The preview could not be uploaded.' });
    } else if (recordId === 'new') {
      setDraft(previous => ({ ...previous, thumbnailUrl: result.imageUrl }));
      setMessage({ tone: 'success', text: 'Preview prepared. Confirm the privacy check before publishing.' });
    } else {
      setRecords(previous => previous.map(record => record.id === recordId ? { ...record, thumbnailUrl: result.imageUrl } : record));
      setMessage({ tone: 'success', text: 'New preview uploaded. Save the record to publish the change.' });
    }
    setBusy('');
  };

  const createRecord = async () => {
    if (!draft.thumbnailUrl || !redactionConfirmed) {
      setMessage({ tone: 'error', text: 'Upload a privacy-safe preview and confirm the redaction check.' });
      return;
    }
    setBusy('create');
    const response = await authenticatedFetch('/api/admin/trust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok
      ? { tone: 'success', text: 'Evidence saved to the database and added to the public showcase.' }
      : { tone: 'error', text: result.error || 'The evidence record could not be created.' });
    if (response.ok) {
      setDraft(blankEvidence());
      setRedactionConfirmed(false);
      await load();
    }
    setBusy('');
  };

  const updateRecord = (id: string, field: keyof EvidenceRecord, value: unknown) => {
    setRecords(previous => previous.map(record => record.id === id ? { ...record, [field]: value } : record));
  };

  const saveRecord = async (record: EvidenceRecord) => {
    setBusy(`save-${record.id}`);
    const response = await authenticatedFetch('/api/admin/trust', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...record, kind: 'evidence' }),
    });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok
      ? { tone: 'success', text: 'Evidence record updated.' }
      : { tone: 'error', text: result.error || 'The evidence record could not be saved.' });
    if (response.ok) await load();
    setBusy('');
  };

  const deleteRecord = async (record: EvidenceRecord) => {
    if (!window.confirm(`Delete “${record.title}” from the evidence database?`)) return;
    setBusy(`delete-${record.id}`);
    const response = await authenticatedFetch(`/api/admin/trust?kind=evidence&id=${encodeURIComponent(record.id)}`, { method: 'DELETE' });
    setMessage(response.ok
      ? { tone: 'success', text: 'Evidence record deleted.' }
      : { tone: 'error', text: 'The evidence record could not be deleted.' });
    if (response.ok) await load();
    setBusy('');
  };

  if (loading) return <div className="grid min-h-72 place-items-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  const uploadInput = (id: string | 'new') => (
    <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-800 transition hover:bg-blue-100">
      {busy === `upload-${id}` ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
      Upload redacted preview
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy === `upload-${id}`} onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) uploadPreview(file, id);
        event.target.value = '';
      }} />
    </label>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-16">
      <header className="overflow-hidden rounded-3xl bg-[#08263c] p-7 text-white sm:p-9">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8ed0ee]">Public evidence portal</p><h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Admission outcomes and authorization letters</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">Add one approved preview, connect it to the university or organization, then control whether it appears on the homepage and proof library.</p></div>
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-2xl bg-white/15 text-center">
            {[['Public', counts.public], ['Letters', counts.authorizations], ['Admission', counts.admissions], ['JW202', counts.jw202]].map(([label, value]) => <div key={label} className="min-w-20 bg-[#08263c] p-3"><strong className="block text-xl text-[#8ed0ee]">{value}</strong><span className="mt-1 block text-[10px] text-white/55">{label}</span></div>)}
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><ShieldCheck className="text-emerald-700" /><strong className="mt-3 block text-sm">Safe preview only</strong><p className="mt-2 text-xs leading-5 text-emerald-900/70">Hide names, passport numbers, dates of birth, barcodes, QR codes, application numbers, addresses and signatures when relevant.</p></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><FileCheck2 className="text-blue-700" /><strong className="mt-3 block text-sm">Keep the source private</strong><p className="mt-2 text-xs leading-5 text-blue-900/70">Store the Drive source link for internal reference. The public website receives only the approved preview.</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><Archive className="text-amber-700" /><strong className="mt-3 block text-sm">Archive expired letters</strong><p className="mt-2 text-xs leading-5 text-amber-900/70">Historic authorizations remain evidence of past work, but they must be labelled as archive records.</p></div>
      </div>

      {message && <div className={`rounded-2xl border p-4 text-sm font-bold ${message.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>{message.text}</div>}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><Plus /></span><div><h2 className="font-heading text-2xl font-bold">Add a new public record</h2><p className="text-sm text-slate-500">This form is ready for updated admission notices, JW202 outcomes and authorization letters.</p></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {([
            ['authorization', 'Authorization Letter', 'University or institutional authority'],
            ['admission', 'Admission Notice', 'Student admission outcome preview'],
            ['jw202', 'JW202', 'Privacy safe JW202 outcome preview'],
          ] as const).map(([group, label, description]) => (
            <button key={group} type="button" onClick={() => chooseGroup(group)} className={`rounded-2xl border p-4 text-left transition ${selectedGroup === group ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
              <strong className="block text-sm text-slate-950">{label}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
            </button>
          ))}
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-[230px_1fr]">
          <div><Preview record={draft} />{uploadInput('new')}</div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Record type"><select className={fieldClass} value={draft.type} onChange={event => setDraft({ ...draft, type: event.target.value })}><option value="authorization_current">Current authorization</option><option value="representation_current">Current representation</option><option value="authorization_record">Authorization record</option><option value="authorization_archive">Archived authorization</option><option value="pre_admission_notice">Pre admission notice</option><option value="admission_notice">Admission notice</option><option value="admission_notice_archive">Archived admission notice</option><option value="jw202_record">JW202 record</option><option value="jw202">JW202 outcome</option><option value="jw202_archive">Archived JW202 outcome</option></select></Field>
            <Field label="Public title" className="md:col-span-2"><input className={fieldClass} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="University name and record type" /></Field>
            <Field label="Organization"><input className={fieldClass} value={draft.organization} onChange={event => setDraft({ ...draft, organization: event.target.value })} placeholder="University or institution" /></Field>
            <Field label="Country"><input className={fieldClass} value={draft.country} onChange={event => setDraft({ ...draft, country: event.target.value })} /></Field>
            <Field label="Connected university"><select className={fieldClass} value={draft.universityId} onChange={event => setDraft({ ...draft, universityId: event.target.value })}><option value="">Company level record</option>{universities.map(university => <option key={university.id} value={university.id}>{university.name}</option>)}</select></Field>
            <Field label="Public summary" className="md:col-span-2 xl:col-span-3"><textarea className={`${fieldClass} min-h-20`} value={draft.summary} onChange={event => setDraft({ ...draft, summary: event.target.value })} placeholder="Explain what this record demonstrates without exposing private student data." /></Field>
            <Field label="Private Drive source" className="md:col-span-2"><input type="url" className={fieldClass} value={draft.sourceUrl} onChange={event => setDraft({ ...draft, sourceUrl: event.target.value })} placeholder="https://drive.google.com/..." /></Field>
            <Field label="Internal reference"><input className={fieldClass} value={draft.referenceLabel} onChange={event => setDraft({ ...draft, referenceLabel: event.target.value })} placeholder="AUTH 2027 001" /></Field>
            <Field label="Issued date"><input type="date" className={fieldClass} value={draft.issuedAt} onChange={event => setDraft({ ...draft, issuedAt: event.target.value })} /></Field>
            <Field label="Valid until"><input type="date" className={fieldClass} value={draft.validUntil} onChange={event => setDraft({ ...draft, validUntil: event.target.value })} /></Field>
            <Field label="Checked on"><input type="date" className={fieldClass} value={draft.lastVerifiedAt} onChange={event => setDraft({ ...draft, lastVerifiedAt: event.target.value })} /></Field>
            <Field label="Homepage order"><input type="number" className={fieldClass} value={draft.displayOrder} onChange={event => setDraft({ ...draft, displayOrder: Number(event.target.value) })} /></Field>
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:col-span-2">
              <label className="flex items-start gap-3 text-sm font-bold text-slate-800"><input type="checkbox" className="mt-1" checked={redactionConfirmed} onChange={event => setRedactionConfirmed(event.target.checked)} /><span>I checked this public preview and removed private student, identity, payment and document identifiers.</span></label>
              <label className="mt-3 flex items-center gap-3 text-sm font-bold text-slate-800"><input type="checkbox" checked={draft.isPublished} onChange={event => setDraft({ ...draft, isPublished: event.target.checked })} />Show on the homepage and proof library</label>
            </div>
            <button type="button" onClick={createRecord} disabled={!draft.title || !draft.thumbnailUrl || !redactionConfirmed || busy === 'create'} className="inline-flex min-h-12 items-center justify-center gap-2 self-end rounded-xl bg-[#08263c] px-5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy === 'create' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Save record</button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-blue-700">Central evidence database</p><h2 className="mt-2 font-heading text-3xl font-bold">Manage published records</h2></div><span className="text-sm font-bold text-slate-500">{records.length} records</span></div>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Evidence record groups">
          {([
            ['authorization', `Authorization letters (${counts.authorizations})`],
            ['admission', `Admission notices (${counts.admissions})`],
            ['jw202', `JW202 (${counts.jw202})`],
          ] as const).map(([group, label]) => <button key={group} type="button" onClick={() => setSelectedGroup(group)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${selectedGroup === group ? 'bg-[#08263c] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{label}</button>)}
        </div>
        <div className="mt-6 space-y-5">
          {visibleRecords.map(record => (
            <article key={record.id} className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[190px_1fr] sm:p-6">
              <div><Preview record={record} />{uploadInput(record.id)}</div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-blue-800">{record.type.replaceAll('_', ' ')}</span>{record.isPublished ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-800">Public</span> : <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-600">Hidden</span>}{isArchive(record.type) && <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-800">Archive</span>}</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Public title" className="md:col-span-2"><input className={fieldClass} value={record.title} onChange={event => updateRecord(record.id, 'title', event.target.value)} /></Field>
                  <Field label="Record type"><select className={fieldClass} value={record.type} onChange={event => updateRecord(record.id, 'type', event.target.value)}><option value="authorization_current">Current authorization</option><option value="representation_current">Current representation</option><option value="authorization_record">Authorization record</option><option value="authorization_archive">Archived authorization</option><option value="pre_admission_notice">Pre admission notice</option><option value="admission_notice">Admission notice</option><option value="admission_notice_archive">Archived admission notice</option><option value="jw202_record">JW202 record</option><option value="jw202">JW202 outcome</option><option value="jw202_archive">Archived JW202 outcome</option></select></Field>
                  <Field label="Organization"><input className={fieldClass} value={record.organization || ''} onChange={event => updateRecord(record.id, 'organization', event.target.value)} /></Field>
                  <Field label="Country"><input className={fieldClass} value={record.country || ''} onChange={event => updateRecord(record.id, 'country', event.target.value)} /></Field>
                  <Field label="University"><select className={fieldClass} value={record.universityId || ''} onChange={event => updateRecord(record.id, 'universityId', event.target.value)}><option value="">Company level record</option>{universities.map(university => <option key={university.id} value={university.id}>{university.name}</option>)}</select></Field>
                  <Field label="Summary" className="md:col-span-2 xl:col-span-3"><textarea className={`${fieldClass} min-h-20`} value={record.summary || ''} onChange={event => updateRecord(record.id, 'summary', event.target.value)} /></Field>
                  <Field label="Private Drive source" className="md:col-span-2"><input type="url" className={fieldClass} value={record.sourceUrl || ''} onChange={event => updateRecord(record.id, 'sourceUrl', event.target.value)} /></Field>
                  <Field label="Internal reference"><input className={fieldClass} value={record.referenceLabel || ''} onChange={event => updateRecord(record.id, 'referenceLabel', event.target.value)} /></Field>
                  <Field label="Issued date"><input type="date" className={fieldClass} value={dateValue(record.issuedAt)} onChange={event => updateRecord(record.id, 'issuedAt', event.target.value)} /></Field>
                  <Field label="Valid until"><input type="date" className={fieldClass} value={dateValue(record.validUntil)} onChange={event => updateRecord(record.id, 'validUntil', event.target.value)} /></Field>
                  <Field label="Checked on"><input type="date" className={fieldClass} value={dateValue(record.lastVerifiedAt)} onChange={event => updateRecord(record.id, 'lastVerifiedAt', event.target.value)} /></Field>
                  <Field label="Privacy status"><select className={fieldClass} value={record.privacyStatus} onChange={event => updateRecord(record.id, 'privacyStatus', event.target.value)}><option value="redacted">Checked and safe</option><option value="pending">Needs review</option><option value="restricted">Restricted</option></select></Field>
                  <Field label="Homepage order"><input type="number" className={fieldClass} value={record.displayOrder} onChange={event => updateRecord(record.id, 'displayOrder', Number(event.target.value))} /></Field>
                  <label className="flex min-h-12 items-center gap-3 self-end rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"><input type="checkbox" checked={record.isPublished} disabled={record.privacyStatus !== 'redacted' || !record.thumbnailUrl} onChange={event => updateRecord(record.id, 'isPublished', event.target.checked)} />Show publicly</label>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><span className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"><CalendarDays size={14} />Public updates appear on the next page refresh.</span><div className="flex gap-2"><button type="button" onClick={() => deleteRecord(record)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-700">{busy === `delete-${record.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Delete</button><button type="button" onClick={() => saveRecord(record)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white">{busy === `save-${record.id}` ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save</button></div></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

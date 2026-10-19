'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Mail, MessageCircle, Phone, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { filterLeads, leadContactLinks, leadCounts, leadStatusLabel, leadStatusTone, LEAD_STATUSES, type LeadQueue, type LeadRecord } from '@/lib/lead-workflow';

type Props = {
  leads: LeadRecord[]; loading: boolean; error: string | null; notice: string | null; savingId: string | null;
  onRefresh: () => void; onUpdate: (id: string, data: { status?: string; notes?: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};
const control = 'min-h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#174f7a] disabled:cursor-wait disabled:opacity-60';
const quietButton = `${control} inline-flex items-center justify-center gap-2 hover:bg-gray-50 disabled:cursor-not-allowed`;
const date = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(value));
const queues: { id: LeadQueue; label: string }[] = [
  { id: 'all', label: 'All leads' }, { id: 'new', label: 'New enquiries' }, { id: 'no_response', label: 'No Response' },
  { id: 'in_progress', label: 'In progress' }, { id: 'closed', label: 'Completed / closed' },
];

function StatusSelect({ lead, saving, update }: { lead: LeadRecord; saving: boolean; update: Props['onUpdate'] }) {
  const [failed, setFailed] = useState(false);
  return <div><div className="flex items-center gap-2"><select aria-label={`Status for ${lead.name}`} value={lead.status} disabled={saving}
    onChange={async event => { setFailed(false); setFailed(!await update(lead.id, { status: event.target.value })); }}
    className={`${control} max-w-full md:w-44 ${leadStatusTone(lead.status)}`}>
    {!LEAD_STATUSES.some(([status]) => status === lead.status) && <option value={lead.status}>{leadStatusLabel(lead.status)}</option>}
    {LEAD_STATUSES.map(([status, label]) => <option value={status} key={status}>{label}</option>)}
  </select>{saving && <RefreshCw size={14} className="animate-spin text-gray-500" aria-label="Saving" />}</div>{failed && <p role="alert" className="mt-2 text-xs text-red-800">Status could not be saved. Please retry.</p>}</div>;
}

function Detail({ lead, saving, onClose, onUpdate, onDelete }: { lead: LeadRecord; saving: boolean; onClose: () => void; onUpdate: Props['onUpdate']; onDelete: Props['onDelete'] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState(lead.notes || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noteError, setNoteError] = useState(false);
  const links = leadContactLinks(lead);
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close(); }, []);
  const fields = [
    ['Destination', lead.country || lead.destinationInterest], ['Program / interest', lead.program || lead.assessSubject],
    ['Assigned team', lead.assignedTeam?.replaceAll('_', ' ')], ['Assigned counselor', lead.assignedTo],
    ['Enquiry source', lead.source], ['Received', date(lead.createdAt)], ['Last activity', date(lead.updatedAt)],
  ];
  const assessment = [['Academic level', lead.assessAcademicLevel], ['Academic results', lead.assessAcademicResults],
    ['Subject', lead.assessSubject], ['Budget', lead.assessBudget], ['Preferred intake', lead.assessIntake],
    ['Language', lead.assessLanguage], ['Career goal', lead.assessCareerGoal]].filter(([, value]) => value);
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="lead-detail-title" className="fixed inset-y-0 left-auto right-0 m-0 h-[100svh] max-h-none w-full max-w-xl overflow-y-auto border-0 bg-white p-0 text-gray-900 shadow-xl backdrop:bg-black/30">
    <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
      <div><p className="text-xs text-gray-600">Enquiry details</p><h2 id="lead-detail-title" className="mt-1 text-xl font-semibold">{lead.name}</h2></div>
      <button onClick={onClose} aria-label="Close lead details" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#174f7a]"><X size={20} /></button>
    </div>
    <div className="space-y-6 p-6">
      <div className="space-y-2 break-words text-sm text-gray-700"><p>{lead.email || 'Email not provided'}</p><p>{lead.phone || 'Phone not provided'}</p>
        <div className="flex flex-wrap gap-2 pt-2">{links.call && <a className={quietButton} href={links.call}><Phone size={15} />Call</a>}
          {links.whatsapp && <a className={quietButton} href={links.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} />WhatsApp</a>}
          {links.email && <a className={quietButton} href={links.email}><Mail size={15} />Email</a>}</div>
      </div>
      <section><h3 className="mb-2 text-sm font-semibold">Lead status</h3><StatusSelect lead={lead} saving={saving} update={onUpdate} />
        {lead.status === 'no_response' && <p className="mt-2 text-sm text-gray-600">Contact attempted; waiting for the student to respond.</p>}</section>
      {(lead.riskFlag || lead.medicalProgram) && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{lead.medicalProgram ? 'Medical program: recognition and licensing review required.' : 'Flagged for senior counselor review.'}</p>}
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4">{fields.map(([label, value]) => <div key={label}><dt className="text-xs text-gray-600">{label}</dt><dd className="mt-1 break-words text-sm">{value || '—'}</dd></div>)}</dl>
      {lead.message && <section><h3 className="text-sm font-semibold">Student’s message</h3><p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm leading-6">{lead.message}</p></section>}
      {assessment.length > 0 && <section><h3 className="mb-3 text-sm font-semibold">Assessment details</h3><dl className="space-y-3">{assessment.map(([label, value]) => <div key={label}><dt className="text-xs text-gray-600">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{value}</dd></div>)}</dl></section>}
      <section><label htmlFor="counselor-notes" className="text-sm font-semibold">Counselor notes</label><p className="mt-1 text-xs text-gray-600">Internal follow-up notes for your admissions team.</p>
        <textarea id="counselor-notes" value={notes} maxLength={12000} onChange={event => setNotes(event.target.value)} rows={5} className={`${control} mt-3 w-full py-3`} placeholder="Record the last conversation and next action…" />
        <div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs text-gray-600">{notes.trim() === (lead.notes || '') ? 'No unsaved changes' : 'Unsaved changes'}</span>
          <button disabled={saving || notes.trim() === (lead.notes || '')} className="min-h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-600" onClick={async () => { setNoteError(false); setNoteError(!await onUpdate(lead.id, { notes })); }}>{saving ? 'Saving…' : 'Save notes'}</button></div>
        {noteError && <p role="alert" className="mt-2 text-sm text-red-800">Notes could not be saved. Your draft is still here; please retry.</p>}</section>
      <section className="border-t border-gray-200 pt-5">{!confirmDelete ? <button onClick={() => setConfirmDelete(true)} className="min-h-10 text-sm text-red-800 hover:underline">Delete this lead</button> :
        <div className="rounded-lg bg-red-50 p-4"><h3 className="text-sm font-semibold text-red-900">Delete {lead.name}?</h3><p className="mt-1 text-sm text-red-900">This permanently removes this lead and its notes.</p><div className="mt-3 flex gap-3"><button onClick={() => setConfirmDelete(false)} disabled={deleting} className={quietButton}>Cancel</button><button disabled={deleting} className="min-h-10 rounded-lg bg-red-800 px-4 text-sm text-white" onClick={async () => { setDeleting(true); if (await onDelete(lead.id)) onClose(); else setDeleting(false); }}>{deleting ? 'Deleting…' : 'Permanently delete'}</button></div></div>}</section>
    </div>
  </dialog>;
}

export default function LeadWorkspace({ leads, loading, error, notice, savingId, onRefresh, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState<LeadQueue>('all');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [source, setSource] = useState('all');
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const counts = useMemo(() => leadCounts(leads), [leads]);
  const filtered = useMemo(() => filterLeads(leads, { search, queue, status, country, source, sort }), [leads, search, queue, status, country, source, sort]);
  const countries = [...new Set(leads.map(lead => lead.country).filter(Boolean))].sort();
  const sources = [...new Set(leads.map(lead => lead.source).filter(Boolean))].sort();
  const size = 15;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pages);
  const rows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const selected = leads.find(lead => lead.id === selectedId);
  const hasFilters = Boolean(search || status !== 'all' || country !== 'all' || source !== 'all' || queue !== 'all');
  const reset = () => { setSearch(''); setQueue('all'); setStatus('all'); setCountry('all'); setSource('all'); setPage(1); };
  return <div data-ui className="space-y-6 text-gray-900">
    <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Leads</h1><p className="mt-1 text-sm text-gray-600">Your admissions queue. Find the next student to follow up with.</p></div>
      <button className={quietButton} onClick={onRefresh} disabled={loading}><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /><span className="hidden sm:inline">Refresh</span></button></div>
    <dl className="grid grid-cols-2 gap-y-5 rounded-lg bg-gray-50 p-4 sm:grid-cols-4 sm:divide-x sm:divide-gray-200">{[
      ['Total enquiries', counts.all], ['New enquiries', counts.new], ['No Response', counts.no_response], ['In progress', counts.in_progress],
    ].map(([label, value], index) => <div key={label} className={index ? 'sm:px-5' : 'sm:pr-5'}><dt className="text-xs text-gray-600">{label}</dt><dd className={`mt-1 text-2xl font-semibold tabular-nums ${label === 'New enquiries' && value ? 'text-[#174f7a]' : ''}`}>{loading && !leads.length ? '—' : value}</dd></div>)}</dl>
    <div><div aria-label="Lead queues" className="flex gap-6 overflow-x-auto border-b border-gray-200">{queues.map(item => <button key={item.id} aria-pressed={queue === item.id} className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-0 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#174f7a] ${queue === item.id ? 'border-[#174f7a] font-semibold text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`} onClick={() => { setQueue(item.id); setStatus('all'); setPage(1); }}>
      {item.label}<span className="text-xs tabular-nums text-gray-600">{loading && !leads.length ? '—' : counts[item.id]}</span></button>)}</div>
      <div className="flex flex-wrap items-center gap-3 py-4"><label className="relative min-w-0 flex-1 sm:max-w-sm"><span className="sr-only">Search leads</span><Search className="pointer-events-none absolute left-3 top-3 text-gray-500" size={16} /><input type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, phone, email…" className={`${control} w-full pl-10`} /></label>
        <button aria-expanded={filtersOpen} aria-controls="lead-filters" onClick={() => setFiltersOpen(value => !value)} className={quietButton}><SlidersHorizontal size={15} />Filters{[status, country, source].filter(value => value !== 'all').length > 0 && <span className="tabular-nums">({[status, country, source].filter(value => value !== 'all').length})</span>}</button>
        <label className="ml-auto flex items-center gap-2 text-sm text-gray-600"><ArrowDownUp size={14} /><span className="sr-only">Sort leads</span><select className={`${control} max-w-40`} value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="updated">Recently updated</option></select></label></div>
      {filtersOpen && <div id="lead-filters" className="mb-4 grid gap-3 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">{[
        { label: 'Status', value: status, set: setStatus, options: LEAD_STATUSES.map(([value, label]) => ({ value, label })) },
        { label: 'Destination', value: country, set: setCountry, options: countries.map(value => ({ value, label: value })) },
        { label: 'Source', value: source, set: setSource, options: sources.map(value => ({ value, label: value })) },
      ].map(filter => <label key={filter.label} className="space-y-2 text-xs text-gray-700"><span>{filter.label}</span><select className={`${control} w-full`} value={filter.value} onChange={event => { filter.set(event.target.value); if (filter.label === 'Status') setQueue('all'); setPage(1); }}><option value="all">All {filter.label === 'Destination' ? 'destinations' : filter.label === 'Status' ? 'statuses' : 'sources'}</option>{filter.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>)}</div>}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600"><span role="status">{loading && !leads.length ? 'Loading enquiries…' : `${filtered.length} ${filtered.length === 1 ? 'lead' : 'leads'}${hasFilters ? ' match your filters' : ' in this queue'}`}</span>{hasFilters && <button onClick={reset} className="min-h-8 font-medium text-[#174f7a] hover:underline">Clear filters</button>}</div>
      {error && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-900"><span>{error}</span><button className="font-semibold underline" onClick={onRefresh}>Retry</button></div>}
      {notice && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p>}
      <div aria-busy={loading}><table className="w-full table-fixed border-collapse text-left text-sm"><thead className="hidden md:table-header-group"><tr className="text-xs font-normal text-gray-600"><th className="w-[29%] py-3 pr-4 font-normal">Student / contact</th><th className="w-[24%] py-3 pr-4 font-normal">Study interest</th><th className="w-[23%] py-3 pr-4 font-normal">Status</th><th className="w-[15%] py-3 pr-4 font-normal">Received</th><th className="w-[9%] py-3 text-right font-normal"><span className="sr-only">Open enquiry</span></th></tr></thead>
        <tbody className="block md:table-row-group">{rows.map(lead => { const links = leadContactLinks(lead); return <tr key={lead.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 border-t border-gray-100 py-4 align-top hover:bg-gray-50/70 md:table-row md:py-0">
          <td className="min-w-0 md:py-4 md:pr-4"><button onClick={() => setSelectedId(lead.id)} className="max-w-full break-words text-left font-semibold hover:text-[#174f7a] hover:underline">{lead.name}</button><p className="mt-1 break-all text-xs leading-5 text-gray-600">{lead.email || 'Email not provided'}</p>{links.call && <a href={links.call} className="mt-1 inline-block text-xs leading-5 text-gray-600 hover:text-[#174f7a] hover:underline">{lead.phone}</a>}</td>
          <td className="col-start-1 row-start-2 min-w-0 md:py-4 md:pr-4"><p className="break-words">{lead.country || 'Destination to discuss'}</p><p className="mt-1 break-words text-xs leading-5 text-gray-600">{lead.program || lead.assessSubject || 'Program to discuss'}</p><p className="mt-1 break-words text-xs leading-5 text-gray-600">{lead.source || 'Source not provided'}</p></td>
          <td className="col-span-2 row-start-3 md:py-4 md:pr-4"><StatusSelect lead={lead} saving={savingId === lead.id} update={onUpdate} /></td>
          <td className="col-start-2 row-start-2 text-right text-xs leading-5 tabular-nums text-gray-600 md:py-4 md:pr-4 md:text-left">{date(lead.createdAt)}</td>
          <td className="col-start-2 row-start-1 text-right md:py-4"><button aria-label={`Open details for ${lead.name}`} onClick={() => setSelectedId(lead.id)} className="min-h-10 px-1 text-sm font-medium text-[#174f7a] hover:underline">Open</button></td>
        </tr>; })}</tbody></table>
        {loading && !leads.length && <div className="space-y-4 py-6" aria-label="Loading leads">{[0, 1, 2, 3].map(row => <div key={row} className="h-14 rounded bg-gray-100" />)}</div>}
        {!loading && !rows.length && <div className="py-12 text-center"><h2 className="text-base font-semibold">{leads.length ? 'No matching enquiries' : 'Your lead queue is clear'}</h2><p className="mt-2 text-sm text-gray-600">{leads.length ? 'Try another search or clear your filters.' : 'New student enquiries will appear here when received.'}</p>{hasFilters && <button className={`${quietButton} mt-4`} onClick={reset}>Clear filters</button>}</div>}
      </div>
      {filtered.length > 0 && <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-600"><span className="tabular-nums">{(currentPage - 1) * size + 1}–{Math.min(currentPage * size, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-3"><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className={quietButton}><ChevronLeft size={16} /></button><span className="tabular-nums">{currentPage} / {pages}</span><button aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} className={quietButton}><ChevronRight size={16} /></button></div></div>}
    </div>
    {selected && <Detail key={selected.id} lead={selected} saving={savingId === selected.id} onClose={() => setSelectedId(null)} onUpdate={onUpdate} onDelete={onDelete} />}
  </div>;
}

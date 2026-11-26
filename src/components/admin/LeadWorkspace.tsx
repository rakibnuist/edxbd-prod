'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle, ArrowDownUp, ChevronLeft, ChevronRight, Columns3, Download, ExternalLink,
  Flame, FolderCheck, FolderKanban, FolderPlus, GraduationCap, LayoutList, Mail, Phone, RefreshCw, Search,
  SlidersHorizontal, Upload, UserCheck, X, Clock, CalendarClock,
} from 'lucide-react';
import FollowupScheduler from '@/components/admin/FollowupScheduler';
import LeadCopilotPanel from '@/components/admin/LeadCopilotPanel';
import LeadPortalDrawerSection, { type EmployeeOption } from '@/components/admin/LeadPortalDrawerSection';
import WaTemplateButton from '@/components/admin/WaTemplateButton';
import type { FitResponseLanguage } from '@/lib/fit-matcher';
import type { LeadCopilotResult } from '@/lib/lead-copilot';
import {
  filterLeads, formatFollowupDisplay, getFollowupClassification, leadContactLinks, leadCounts, leadStatusLabel, leadStatusTone,
  LEAD_STATUSES, type LeadQueue, type LeadQuickPreset, type LeadRecord,
} from '@/lib/lead-workflow';
import { portalProgressPct, resolvePortalMilestoneStep } from '@/lib/student-portal';
import { parseNumericGpa } from '@/lib/wa-templates';

type Props = {
  leads: LeadRecord[];
  employees?: EmployeeOption[];
  initialLeadId?: string | null;
  loading: boolean;
  importing?: boolean;
  syncingMeta?: boolean;
  error: string | null;
  notice: string | null;
  savingId: string | null;
  onRefresh: () => void;
  onSyncMeta?: () => Promise<void>;
  onAutoAssign?: (scope: 'new' | 'untouched_pool' | 'untouched_rebalance' | 'all_active') => Promise<void>;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  onDelete?: (id: string) => Promise<boolean>;
  isCounselor?: boolean;
  onEnsureToken?: (id: string) => Promise<string | null>;
  onTokenChanged?: (id: string, token: string) => void;
  onCopilot?: (id: string, options: { language: FitResponseLanguage; focus?: string }) => Promise<{ data?: LeadCopilotResult; error?: string }>;
  onImportCsv?: (file: File) => void;
};

const control = 'min-h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#12436b] disabled:cursor-wait disabled:opacity-60';
const quietButton = `${control} inline-flex items-center justify-center gap-2 hover:bg-gray-50 disabled:cursor-not-allowed`;
const date = (value: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' }).format(new Date(value));
const queues: { id: LeadQueue; label: string }[] = [
  { id: 'all', label: 'All leads' },
  { id: 'new', label: 'New enquiries' },
  { id: 'follow_up', label: 'Follow-ups' },
  { id: 'no_response', label: 'No Response' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'closed', label: 'Completed / closed' },
];

const KANBAN_COLUMNS: Array<{
  id: string;
  targetStatus: string;
  label: string;
  accent: string;
  statuses: string[];
}> = [
  { id: 'new', targetStatus: 'new', label: 'New Enquiries', accent: 'border-t-sky-500', statuses: ['new'] },
  { id: 'contacted', targetStatus: 'contacted', label: 'Contacted', accent: 'border-t-blue-500', statuses: ['contacted'] },
  { id: 'no_response', targetStatus: 'no_response', label: 'No Response', accent: 'border-t-amber-500', statuses: ['no_response'] },
  {
    id: 'consultation',
    targetStatus: 'consultation_scheduled',
    label: 'Consultation & Qualified',
    accent: 'border-t-indigo-500',
    statuses: ['consultation_scheduled', 'consultation_completed', 'qualified'],
  },
  {
    id: 'application',
    targetStatus: 'application_started',
    label: 'Application & Visa',
    accent: 'border-t-violet-500',
    statuses: ['application_started', 'application_submitted', 'admission_received', 'visa_applied', 'visa_approved'],
  },
  { id: 'enrolled', targetStatus: 'enrolled', label: 'Enrolled / Won', accent: 'border-t-emerald-500', statuses: ['enrolled', 'converted'] },
  { id: 'closed', targetStatus: 'closed', label: 'Closed / Not Interested', accent: 'border-t-slate-400', statuses: ['closed', 'not_interested'] },
];

function GpaPill({ lead }: { lead: LeadRecord }) {
  const num = parseNumericGpa(lead.gpa, lead.assessAcademicResults);
  const raw = lead.assessAcademicResults?.trim();
  if (num == null && !raw && !lead.assessAcademicLevel && !lead.assessLanguage) return null;

  const gpaTone = num == null
    ? 'bg-slate-100 text-slate-700 border-slate-200'
    : num >= 4.0
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : num >= 3.5
        ? 'bg-blue-50 text-blue-800 border-blue-200'
        : 'bg-amber-50 text-amber-800 border-amber-200';

  return (
    <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
      {lead.assessAcademicLevel && (
        <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold text-slate-700">
          <GraduationCap size={10} />
          {lead.assessAcademicLevel}
        </span>
      )}
      {(num != null || raw) && (
        <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-bold tabular-nums ${gpaTone}`}>
          GPA: {num != null ? num.toFixed(2) : raw}
        </span>
      )}
      {lead.assessLanguage && (
        <span className="inline-flex items-center rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-semibold text-violet-800">
          Eng: {lead.assessLanguage}
        </span>
      )}
    </div>
  );
}

function StatusSelect({ lead, saving, update }: { lead: LeadRecord; saving: boolean; update: Props['onUpdate'] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2">
        <select
          aria-label={`Status for ${lead.name}`}
          value={lead.status}
          disabled={saving}
          onChange={async (event) => {
            setFailed(false);
            setFailed(!(await update(lead.id, { status: event.target.value })));
          }}
          className={`${control} max-w-full md:w-44 ${leadStatusTone(lead.status)}`}
        >
          {!LEAD_STATUSES.some(([status]) => status === lead.status) && (
            <option value={lead.status}>{leadStatusLabel(lead.status)}</option>
          )}
          {LEAD_STATUSES.map(([status, label]) => (
            <option value={status} key={status}>{label}</option>
          ))}
        </select>
        {saving && <RefreshCw size={14} className="animate-spin text-gray-500" aria-label="Saving" />}
      </div>
      {failed && <p role="alert" className="mt-2 text-xs text-red-800">Status could not be saved. Please retry.</p>}
    </div>
  );
}

function Detail({
  lead,
  employees,
  saving,
  onClose,
  onUpdate,
  onDelete,
  onEnsureToken,
  onTokenChanged,
  onCopilot,
}: {
  lead: LeadRecord;
  employees: EmployeeOption[];
  saving: boolean;
  onClose: () => void;
  onUpdate: Props['onUpdate'];
  onDelete?: Props['onDelete'];
  onEnsureToken?: Props['onEnsureToken'];
  onTokenChanged?: Props['onTokenChanged'];
  onCopilot?: Props['onCopilot'];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [notes, setNotes] = useState(lead.notes || '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noteError, setNoteError] = useState(false);
  const links = leadContactLinks(lead);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  const fields = [
    ['Destination', lead.country || lead.destinationInterest],
    ['Program / interest', lead.program || lead.assessSubject],
    ['Assigned team', lead.assignedTeam?.replaceAll('_', ' ')],
    ['Assigned counselor', lead.assignedTo],
    ['Enquiry source', lead.source],
    ['Received', date(lead.createdAt)],
    ['Last activity', date(lead.updatedAt)],
  ];
  const assessment = [
    ['Academic level', lead.assessAcademicLevel || lead.degree],
    ['Academic results / GPA', lead.gpa != null ? String(lead.gpa) : lead.assessAcademicResults],
    ['Subject', lead.assessSubject],
    ['Budget', lead.assessBudget],
    ['Preferred intake', lead.assessIntake],
    ['Language', lead.assessLanguage],
    ['Career goal', lead.assessCareerGoal],
  ].filter(([, value]) => value);

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      aria-labelledby="lead-detail-title"
      className="fixed inset-y-0 left-auto right-0 m-0 h-[100svh] max-h-none w-full max-w-2xl overflow-y-auto border-0 bg-white p-0 text-gray-900 shadow-xl backdrop:bg-black/30"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
        <div>
          <p className="text-xs text-gray-600">Enquiry & Student Tracking Details</p>
          <h2 id="lead-detail-title" className="mt-1 text-xl font-semibold">{lead.name}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close lead details"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#12436b]"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div className="space-y-2 break-words text-sm text-gray-700">
          <p>{lead.email || 'Email not provided'}</p>
          <p>{lead.phone || 'Phone not provided'}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {links.call && (
              <a className={quietButton} href={links.call}>
                <Phone size={15} /> Call
              </a>
            )}
            <WaTemplateButton lead={lead} onEnsureToken={onEnsureToken} />
            {links.email && (
              <a className={quietButton} href={links.email}>
                <Mail size={15} /> Email
              </a>
            )}
          </div>
        </div>

        {lead.isApplication ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-3.5 text-xs text-sky-950">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-sky-100 text-[#0f3a5c]">
                <FolderKanban size={18} />
              </span>
              <div>
                <p className="font-bold">Active in Application Tracker</p>
                <p className="text-[11px] text-sky-700">Ref: {lead.leadRef || 'APP-FILE'}</p>
              </div>
            </div>
            <Link
              href={`/admin/applications?search=${encodeURIComponent(lead.leadRef || lead.name)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-3.5 py-2 font-bold text-white shadow-sm hover:bg-[#124b7a]"
            >
              Open in Tracker →
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950">
            <div>
              <p className="font-bold">Student ready to open file?</p>
              <p className="text-[11px] text-emerald-800">
                Move student into Application Tracker to initialize document checklist and application workflow.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                await onUpdate(lead.id, { isApplication: true, status: 'application_started' });
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
            >
              <FolderPlus size={14} /> Open File
            </button>
          </div>
        )}

        <section>
          <h3 className="mb-2 text-sm font-semibold">Lead status</h3>
          <StatusSelect lead={lead} saving={saving} update={onUpdate} />
          {lead.status === 'no_response' && (
            <p className="mt-2 text-sm text-gray-600">Contact attempted; waiting for the student to respond.</p>
          )}
        </section>

        <section className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CalendarClock size={16} className="text-[#12436b]" />
              Follow-up & Re-contact Scheduling
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Never miss reaching a client</span>
          </div>
          <FollowupScheduler
            lead={lead}
            saving={saving}
            onUpdate={onUpdate}
          />
        </section>

        {(lead.riskFlag || lead.medicalProgram) && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            {lead.medicalProgram
              ? 'Medical program: recognition and licensing review required.'
              : 'Flagged for senior counselor review.'}
          </p>
        )}

        <LeadPortalDrawerSection
          lead={lead}
          employees={employees}
          saving={saving}
          onUpdateLead={onUpdate}
          onTokenChanged={onTokenChanged}
        />

        <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-gray-600">{label}</dt>
              <dd className="mt-1 break-words text-sm">{value || '—'}</dd>
            </div>
          ))}
        </dl>

        {lead.message && (
          <section>
            <h3 className="text-sm font-semibold">Student’s message</h3>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm leading-6">
              {lead.message}
            </p>
          </section>
        )}

        {assessment.length > 0 && (
          <section>
            <h3 className="mb-3 text-sm font-semibold">Assessment details</h3>
            <dl className="grid grid-cols-2 gap-3">
              {assessment.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-2.5">
                  <dt className="text-xs text-gray-600">{label}</dt>
                  <dd className="mt-0.5 break-words text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {onCopilot && (
          <LeadCopilotPanel
            lead={lead}
            onGenerate={onCopilot}
            onAppendNotes={(snippet) => {
              setNotes((previous) => {
                const trimmed = previous.trim();
                const combined = trimmed ? `${trimmed}\n\n${snippet}` : snippet;
                return combined.slice(0, 12000);
              });
            }}
          />
        )}

        <section>
          <label htmlFor="counselor-notes" className="text-sm font-semibold">Counselor notes</label>
          <p className="mt-1 text-xs text-gray-600">Internal follow-up notes for your admissions team.</p>
          <textarea
            id="counselor-notes"
            value={notes}
            maxLength={12000}
            onChange={(event) => setNotes(event.target.value)}
            rows={5}
            className={`${control} mt-3 w-full py-3`}
            placeholder="Record the last conversation and next action…"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-600">
              {notes.trim() === (lead.notes || '') ? 'No unsaved changes' : 'Unsaved changes'}
            </span>
            <button
              disabled={saving || notes.trim() === (lead.notes || '')}
              className="min-h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
              onClick={async () => {
                setNoteError(false);
                setNoteError(!(await onUpdate(lead.id, { notes })));
              }}
            >
              {saving ? 'Saving…' : 'Save notes'}
            </button>
          </div>
          {noteError && (
            <p role="alert" className="mt-2 text-sm text-red-800">
              Notes could not be saved. Your draft is still here; please retry.
            </p>
          )}
        </section>

        {onDelete && (
          <section className="border-t border-gray-200 pt-5">
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="min-h-10 text-sm text-red-800 hover:underline">
                Delete this lead
              </button>
            ) : (
              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="text-sm font-semibold text-red-900">Delete {lead.name}?</h3>
                <p className="mt-1 text-sm text-red-900">This permanently removes this lead and its notes.</p>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => setConfirmDelete(false)} disabled={deleting} className={quietButton}>
                    Cancel
                  </button>
                  <button
                    disabled={deleting}
                    className="min-h-10 rounded-lg bg-red-800 px-4 text-sm text-white"
                    onClick={async () => {
                      setDeleting(true);
                      if (await onDelete(lead.id)) onClose();
                      else setDeleting(false);
                    }}
                  >
                    {deleting ? 'Deleting…' : 'Permanently delete'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </dialog>
  );
}

export default function LeadWorkspace({
  leads,
  employees = [],
  initialLeadId = null,
  loading,
  importing,
  syncingMeta,
  error,
  notice,
  savingId,
  onRefresh,
  onSyncMeta,
  onAutoAssign,
  onUpdate,
  onDelete,
  onEnsureToken,
  onTokenChanged,
  onCopilot,
  onImportCsv,
  isCounselor = false,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [queue, setQueue] = useState<LeadQueue>('all');
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [source, setSource] = useState('all');
  const [assignedTo, setAssignedTo] = useState('all');
  const [gpaMin, setGpaMin] = useState<string>('all');
  const [quickPreset, setQuickPreset] = useState<LeadQuickPreset>('all');
  const [sort, setSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(initialLeadId);
  const [schedulingLead, setSchedulingLead] = useState<LeadRecord | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const counts = useMemo(() => leadCounts(leads), [leads]);
  const numericGpaMin = gpaMin === 'all' ? null : Number.parseFloat(gpaMin);
  const filtered = useMemo(
    () =>
      filterLeads(leads, {
        search,
        queue,
        status,
        country,
        source,
        sort,
        assignedTo,
        gpaMin: Number.isFinite(numericGpaMin as number) ? numericGpaMin : null,
        quickPreset,
      }),
    [leads, search, queue, status, country, source, sort, assignedTo, numericGpaMin, quickPreset],
  );

  const countries = [...new Set(leads.map((lead) => lead.country).filter(Boolean))].sort();
  const sources = [...new Set(leads.map((lead) => lead.source).filter(Boolean))].sort();
  const counselors = [
    ...new Set([
      ...employees.map((e) => e.name),
      ...leads.map((l) => l.assignedTo).filter((v): v is string => Boolean(v)),
    ]),
  ].sort();

  const size = 15;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pages);
  const rows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const selected = leads.find((lead) => lead.id === selectedId);
  const currentSchedulingLead = schedulingLead
    ? leads.find((l) => l.id === schedulingLead.id) || schedulingLead
    : null;
  const activeFilterCount =
    [status, country, source, assignedTo, gpaMin].filter((v) => v !== 'all').length;
  const hasFilters = Boolean(search || activeFilterCount > 0 || queue !== 'all' || quickPreset !== 'all');
  const reset = () => {
    setSearch('');
    setQueue('all');
    setStatus('all');
    setCountry('all');
    setSource('all');
    setAssignedTo('all');
    setGpaMin('all');
    setQuickPreset('all');
    setPage(1);
  };

  const handleExportCsv = () => {
    const headers = [
      'Lead ID', 'Received Date', 'Student Name', 'Phone', 'Email',
      'Country / Destination', 'Program / Track', 'Academic Level',
      'Result / GPA', 'Budget', 'Intake', 'Language', 'Status',
      'Stage', 'Assigned Counselor', 'Source', 'Tracking URL', 'Counselor Notes',
    ];
    const escapeCsv = (val: string | number | null | undefined) => {
      if (val === null || val === undefined || val === '') return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eduexpressint.com';
    const csvRows = filtered.map((l) => [
      escapeCsv(l.id),
      escapeCsv(new Date(l.createdAt).toISOString().split('T')[0]),
      escapeCsv(l.name),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.country || l.destinationInterest),
      escapeCsv(l.program || l.assessSubject),
      escapeCsv(l.assessAcademicLevel || l.degree),
      escapeCsv(l.gpa != null ? l.gpa : l.assessAcademicResults),
      escapeCsv(l.assessBudget),
      escapeCsv(l.assessIntake),
      escapeCsv(l.assessLanguage),
      escapeCsv(l.status),
      escapeCsv(l.applicationStage),
      escapeCsv(l.assignedTo),
      escapeCsv(l.source),
      escapeCsv(l.publicToken ? `${origin}/track/${l.publicToken}` : ''),
      escapeCsv(l.notes),
    ]);
    const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eduexpress-leads-${queue}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div data-ui className="space-y-6 text-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads & Admissions Pipeline</h1>
            {isCounselor && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                My Assigned + Unassigned Queue
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            GPA/degree qualification, 1-click Bengali WhatsApp outreach, Kanban stage control, and Live Tracking Portals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Table vs Kanban Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-[#0f3a5c] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutList size={14} /> Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
                viewMode === 'kanban' ? 'bg-[#0f3a5c] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Columns3 size={14} /> Kanban Board
            </button>
          </div>

          {onAutoAssign && (
            <>
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-bold text-indigo-800 hover:bg-indigo-100 disabled:opacity-60 transition"
                onClick={() => onAutoAssign('untouched_pool')}
                disabled={loading || syncingMeta || importing}
                title="Pull unassigned or non-counselor untouched (new) leads and distribute across active counselors by country scope"
              >
                <UserCheck size={14} />
                <span>Distribute Untouched Leads</span>
              </button>
              <Link
                href="/admin/settings#lead-flow"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                title="Control who receives leads, All Countries vs China Only, and intake flow mode"
              >
                Flow Rules
              </Link>
            </>
          )}
          {onSyncMeta && (
            <button
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-60 transition"
              onClick={onSyncMeta}
              disabled={loading || syncingMeta || importing}
              title="Fetch all new leads directly from Meta Graph API"
            >
              <RefreshCw size={14} className={syncingMeta ? 'animate-spin' : ''} />
              <span>{syncingMeta ? 'Syncing Meta…' : 'Sync Meta Leads'}</span>
            </button>
          )}
          <button
            className={quietButton}
            onClick={handleExportCsv}
            disabled={loading || !filtered.length}
            title={`Export ${filtered.length} leads to CSV for Excel`}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          {onImportCsv && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,text/csv,text/tab-separated-values"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onImportCsv(file);
                  event.target.value = '';
                }}
              />
              <button
                className={quietButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || importing}
              >
                <Upload size={15} />
                <span>{importing ? 'Importing…' : 'Import CSV'}</span>
              </button>
            </>
          )}
          <button className={quietButton} onClick={onRefresh} disabled={loading || importing}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <dl className="grid grid-cols-2 gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:grid-cols-5 sm:gap-y-5 sm:p-4 sm:divide-x sm:divide-gray-200">
        {[
          ['Total enquiries', counts.all],
          ['New enquiries', counts.new],
          ['Follow-ups', counts.follow_up],
          ['No Response', counts.no_response],
          ['In progress', counts.in_progress],
        ].map(([label, value], index) => (
          <div key={label} className={`${index === 4 ? 'col-span-2 sm:col-span-1' : ''} ${index ? 'sm:px-5' : 'sm:pr-5'}`}>
            <dt className="text-xs font-medium text-gray-500">{label}</dt>
            <dd className={`mt-1 text-2xl font-bold tabular-nums ${label === 'Follow-ups' && value ? 'text-amber-700' : label === 'New enquiries' && value ? 'text-[#12436b]' : 'text-slate-900'}`}>
              {loading && !leads.length ? '—' : value}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        {/* Queue Tabs */}
        <div aria-label="Lead queues" className="-mx-3.5 flex gap-4 overflow-x-auto border-b border-gray-200 px-3.5 sm:mx-0 sm:gap-6 sm:px-0">
          {queues.map((item) => (
            <button
              key={item.id}
              aria-pressed={queue === item.id}
              className={`flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-1 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#12436b] ${
                queue === item.id
                  ? 'border-[#12436b] font-semibold text-gray-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => {
                setQueue(item.id);
                setStatus('all');
                setPage(1);
              }}
            >
              {item.label}
              <span className="text-xs tabular-nums text-gray-600">
                {loading && !leads.length ? '—' : counts[item.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Priority Filter Pills */}
        <div className="-mx-3.5 mt-3 flex items-center gap-1.5 overflow-x-auto px-3.5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick focus:</span>
          {[
            { id: 'all' as LeadQuickPreset, label: 'All Enquiries', icon: null },
            { id: 'followup_due' as LeadQuickPreset, label: 'Follow-ups Due Today', icon: CalendarClock },
            { id: 'followup_overdue' as LeadQuickPreset, label: 'Overdue Follow-ups', icon: AlertCircle },
            { id: 'followup_upcoming' as LeadQuickPreset, label: 'Upcoming Follow-ups', icon: Clock },
            { id: 'china_hot' as LeadQuickPreset, label: 'China Hot (GPA >= 3.5)', icon: Flame },
            { id: 'sla_risk' as LeadQuickPreset, label: 'Untouched > 2h (SLA)', icon: Clock },
          ].map((preset) => {
            const Icon = preset.icon;
            const active = quickPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setQuickPreset(preset.id);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                  active
                    ? 'border-[#0f3a5c] bg-[#0f3a5c] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon size={12} />}
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 py-4">
          <label className="relative min-w-0 flex-1 sm:max-w-sm">
            <span className="sr-only">Search leads</span>
            <Search className="pointer-events-none absolute left-3 top-3 text-gray-500" size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, phone, GPA, counselor…"
              className={`${control} w-full pl-10`}
            />
          </label>
          <button
            aria-expanded={filtersOpen}
            aria-controls="lead-filters"
            onClick={() => setFiltersOpen((value) => !value)}
            className={quietButton}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && <span className="tabular-nums">({activeFilterCount})</span>}
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <ArrowDownUp size={14} />
            <span className="sr-only">Sort leads</span>
            <select
              className={`${control} max-w-44`}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest first</option>
              <option value="followup_soonest">Follow-up: Soonest first</option>
              <option value="followup_latest">Follow-up: Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="gpa_desc">Highest GPA first</option>
            </select>
          </label>
        </div>

        {filtersOpen && (
          <div id="lead-filters" className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3 lg:grid-cols-5">
            <label className="space-y-1.5 text-xs text-gray-700">
              <span>Status</span>
              <select
                className={`${control} w-full`}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setQueue('all');
                  setPage(1);
                }}
              >
                <option value="all">All statuses</option>
                {LEAD_STATUSES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-gray-700">
              <span>Destination</span>
              <select
                className={`${control} w-full`}
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All destinations</option>
                {countries.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-gray-700">
              <span>Source</span>
              <select
                className={`${control} w-full`}
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All sources</option>
                {sources.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-gray-700">
              <span>Minimum GPA</span>
              <select
                className={`${control} w-full`}
                value={gpaMin}
                onChange={(e) => {
                  setGpaMin(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Any GPA</option>
                <option value="3.5">GPA &gt;= 3.50</option>
                <option value="4.0">GPA &gt;= 4.00</option>
                <option value="4.5">GPA &gt;= 4.50</option>
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-gray-700">
              <span>Assigned Counselor</span>
              <select
                className={`${control} w-full`}
                value={assignedTo}
                onChange={(e) => {
                  setAssignedTo(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All counselors</option>
                <option value="__unassigned__">Unassigned only</option>
                {counselors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <span role="status">
            {loading && !leads.length
              ? 'Loading enquiries…'
              : `${filtered.length} ${filtered.length === 1 ? 'lead' : 'leads'}${hasFilters ? ' match your filters' : ' in this queue'}`}
          </span>
          {hasFilters && (
            <button onClick={reset} className="min-h-8 font-medium text-[#12436b] hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-900">
            <span>{error}</span>
            <button className="font-semibold underline" onClick={onRefresh}>Retry</button>
          </div>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {notice}
          </p>
        )}

        {viewMode === 'kanban' ? (
          /* Kanban Pipeline Board */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colLeads = filtered.filter((l) => col.statuses.includes(l.status));
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const droppedId = draggingId || e.dataTransfer.getData('text/plain');
                    setDraggingId(null);
                    if (droppedId) {
                      const targetLead = leads.find((x) => x.id === droppedId);
                      if (targetLead && !col.statuses.includes(targetLead.status)) {
                        const payload: Record<string, unknown> = { status: col.targetStatus };
                        if (col.id === 'application') payload.isApplication = true;
                        await onUpdate(droppedId, payload);
                      }
                    }
                  }}
                  className={`flex w-72 shrink-0 flex-col rounded-xl border border-slate-200 border-t-4 ${col.accent} bg-slate-100/70 p-3`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-slate-700">{col.label}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-sm tabular-nums">
                      {colLeads.length}
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-[68vh] overflow-y-auto pr-0.5">
                    {colLeads.slice(0, 60).map((lead) => {
                      const step = resolvePortalMilestoneStep(lead.applicationStage, lead.status);
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => {
                            setDraggingId(lead.id);
                            e.dataTransfer.setData('text/plain', lead.id);
                          }}
                          className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-300 transition active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedId(lead.id)}
                              className="text-left text-sm font-bold text-slate-900 hover:text-[#12436b] hover:underline"
                            >
                              {lead.name}
                            </button>
                            <span className="shrink-0 text-[10px] font-semibold text-slate-400 tabular-nums">
                              {date(lead.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs font-medium text-slate-600">
                            {lead.country} · {lead.program || lead.assessSubject || 'Admission'}
                          </p>
                          <GpaPill lead={lead} />

                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {lead.isApplication ? (
                              <Link
                                href={`/admin/applications?search=${encodeURIComponent(lead.leadRef || lead.name)}`}
                                className="inline-flex items-center gap-1 rounded bg-sky-50 border border-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-900 hover:bg-sky-100"
                                title="Open in Application Tracker"
                              >
                                <FolderCheck size={10} className="text-sky-700" /> In Tracker ({lead.leadRef || 'APP'})
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onUpdate(lead.id, { isApplication: true, status: 'application_started' })}
                                className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100"
                                title="Open file and move to Application Tracker"
                              >
                                <FolderPlus size={10} /> Open File
                              </button>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-1">
                            {lead.nextFollowup ? (
                              <button
                                type="button"
                                onClick={() => setSchedulingLead(lead)}
                                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold transition hover:shadow-xs ${getFollowupClassification(lead.nextFollowup).badgeClass}`}
                                title="Reschedule or view follow-up"
                              >
                                <CalendarClock size={10} className="shrink-0" />
                                {formatFollowupDisplay(lead.nextFollowup)}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSchedulingLead(lead)}
                                className="inline-flex items-center gap-1 rounded border border-dashed border-slate-300 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 hover:border-slate-400 hover:text-slate-800 transition"
                                title="Schedule follow-up"
                              >
                                <Clock size={10} className="shrink-0 text-slate-400" />
                                + Follow-up
                              </button>
                            )}
                          </div>

                          <div className="mt-2.5 flex items-center justify-between gap-1.5 border-t border-slate-100 pt-2">
                            <div className="flex items-center gap-1.5">
                              <WaTemplateButton lead={lead} compact onEnsureToken={onEnsureToken} />
                              {lead.publicToken && (
                                <a
                                  href={`/track/${lead.publicToken}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open Student Tracking Portal"
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-100"
                                >
                                  <ExternalLink size={10} /> {step}/6
                                </a>
                              )}
                            </div>
                            <span className="truncate text-[10px] font-semibold text-slate-500">
                              {lead.assignedTo || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {colLeads.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-xs text-slate-400">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div aria-busy={loading} className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white px-4 shadow-sm">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead className="hidden md:table-header-group">
                <tr className="text-xs font-normal text-gray-500">
                  <th className="w-[31%] py-3.5 pr-4 font-semibold">Student / Contact & Academics</th>
                  <th className="w-[23%] py-3.5 pr-4 font-semibold">Study Interest & Owner</th>
                  <th className="w-[22%] py-3.5 pr-4 font-semibold">Status & Portal</th>
                  <th className="w-[15%] py-3.5 pr-4 font-semibold">Received / Follow-up</th>
                  <th className="w-[9%] py-3.5 text-right font-semibold"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {rows.map((lead) => {
                  const links = leadContactLinks(lead);
                  const step = resolvePortalMilestoneStep(lead.applicationStage, lead.status);
                  const pct = portalProgressPct(step);
                  return (
                    <tr
                      key={lead.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3 border-t border-gray-100 py-4 align-top hover:bg-gray-50/70 md:table-row md:py-0"
                    >
                      <td className="min-w-0 md:py-4 md:pr-4">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedId(lead.id)}
                            className="max-w-full break-words text-left font-bold text-slate-900 hover:text-[#12436b] hover:underline"
                          >
                            {lead.name}
                          </button>
                          <WaTemplateButton lead={lead} compact onEnsureToken={onEnsureToken} />
                        </div>
                        <p className="mt-1 break-all text-xs leading-5 text-gray-500">
                          {lead.email || 'Email not provided'}
                        </p>
                        {links.call && (
                          <a
                            href={links.call}
                            className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium leading-5 text-gray-700 hover:text-[#12436b] hover:underline"
                          >
                            <Phone size={11} className="text-slate-400" />
                            {lead.phone}
                          </a>
                        )}
                        <GpaPill lead={lead} />
                      </td>

                      <td className="col-start-1 row-start-2 min-w-0 md:py-4 md:pr-4">
                        <p className="font-semibold text-slate-900">{lead.country || 'Destination to discuss'}</p>
                        <p className="mt-0.5 break-words text-xs leading-5 text-gray-600">
                          {lead.university || lead.program || lead.assessSubject || 'Program to discuss'}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {lead.source?.includes('meta') ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-blue-200/60 bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-700">
                              <span className="size-1.5 rounded-full bg-blue-600" /> Meta Form
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700">
                              <span className="size-1.5 rounded-full bg-slate-500" /> Website
                            </span>
                          )}
                          {lead.assignedTo && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                              <UserCheck size={10} /> {lead.assignedTo}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="col-span-2 row-start-3 md:py-4 md:pr-4">
                        <StatusSelect lead={lead} saving={savingId === lead.id} update={onUpdate} />
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {lead.isApplication ? (
                            <Link
                              href={`/admin/applications?search=${encodeURIComponent(lead.leadRef || lead.name)}`}
                              className="inline-flex items-center gap-1 rounded border border-sky-300 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-900 hover:bg-sky-100"
                              title="Open in Application Tracker"
                            >
                              <FolderKanban size={11} className="text-sky-700" /> In Tracker ({lead.leadRef || 'APP'}) →
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onUpdate(lead.id, { isApplication: true, status: 'application_started' })}
                              className="inline-flex items-center gap-1 rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100"
                              title="Open file and move to Application Tracker"
                            >
                              <FolderPlus size={11} /> Open File
                            </button>
                          )}
                          {lead.publicToken && (
                            <a
                              href={`/track/${lead.publicToken}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline"
                            >
                              <ExternalLink size={10} /> Step {step}/6 ({pct}%)
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="col-start-2 row-start-2 text-right text-xs leading-5 tabular-nums text-gray-600 md:py-4 md:pr-4 md:text-left">
                        <div>{date(lead.createdAt)}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {lead.nextFollowup ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSchedulingLead(lead);
                              }}
                              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold transition hover:shadow-xs ${getFollowupClassification(lead.nextFollowup).badgeClass}`}
                              title="Click to reschedule or view follow-up"
                            >
                              <CalendarClock size={11} className="shrink-0" />
                              {getFollowupClassification(lead.nextFollowup).label}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSchedulingLead(lead);
                              }}
                              className="inline-flex items-center gap-1 rounded border border-dashed border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800 transition"
                              title="Schedule re-contact time for this student"
                            >
                              <Clock size={11} className="shrink-0 text-slate-400" />
                              + Follow-up
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="col-start-2 row-start-1 text-right md:py-4">
                        <button
                          aria-label={`Open details for ${lead.name}`}
                          onClick={() => setSelectedId(lead.id)}
                          className="min-h-10 px-2 text-sm font-semibold text-[#12436b] hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {loading && !leads.length && (
              <div className="space-y-4 py-6" aria-label="Loading leads">
                {[0, 1, 2, 3].map((row) => <div key={row} className="h-14 rounded bg-gray-100" />)}
              </div>
            )}

            {!loading && !rows.length && (
              <div className="py-12 text-center">
                <h2 className="text-base font-semibold">
                  {leads.length ? 'No matching enquiries' : 'Your lead queue is clear'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {leads.length ? 'Try another search or clear your filters.' : 'New student enquiries will appear here when received.'}
                </p>
                {hasFilters && (
                  <button className={`${quietButton} mt-4`} onClick={reset}>Clear filters</button>
                )}
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && filtered.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-600">
            <span className="tabular-nums">
              {(currentPage - 1) * size + 1}–{Math.min(currentPage * size, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className={quietButton}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tabular-nums">{currentPage} / {pages}</span>
              <button
                aria-label="Next page"
                disabled={currentPage === pages}
                onClick={() => setPage(currentPage + 1)}
                className={quietButton}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <Detail
          key={selected.id}
          lead={selected}
          employees={employees}
          saving={savingId === selected.id}
          onClose={() => setSelectedId(null)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEnsureToken={onEnsureToken}
          onTokenChanged={onTokenChanged}
          onCopilot={onCopilot}
        />
      )}

      {currentSchedulingLead && (
        <dialog
          open
          onCancel={() => setSchedulingLead(null)}
          aria-labelledby="quick-followup-modal-title"
          className="fixed inset-0 z-50 m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl backdrop:bg-black/50 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-[#12436b]">
                <CalendarClock size={18} />
              </span>
              <div>
                <h3 id="quick-followup-modal-title" className="text-sm font-bold text-slate-900">
                  Schedule Re-contact
                </h3>
                <p className="text-xs text-slate-500">
                  {currentSchedulingLead.name} · {currentSchedulingLead.phone || currentSchedulingLead.country}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSchedulingLead(null)}
              aria-label="Close scheduling modal"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4">
            <FollowupScheduler
              lead={currentSchedulingLead}
              saving={savingId === currentSchedulingLead.id}
              onUpdate={async (id, data) => {
                const ok = await onUpdate(id, data);
                if (ok) setSchedulingLead(null);
                return ok;
              }}
              onClose={() => setSchedulingLead(null)}
            />
          </div>
        </dialog>
      )}
    </div>
  );
}

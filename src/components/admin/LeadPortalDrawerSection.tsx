'use client';

import { useEffect, useState } from 'react';
import {
  Check, Copy, ExternalLink, FileCheck2, GraduationCap, Link2, Loader2,
  MessageSquare, Plus, QrCode, RefreshCw, Send, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { LeadRecord } from '@/lib/lead-workflow';
import { toSafeExternalUrl } from '@/lib/safe-url';
import { APPLICATION_STAGE_OPTIONS, portalProgressPct, resolvePortalMilestoneStep } from '@/lib/student-portal';
import { buildWhatsAppUrl, formatWaTemplateMessage } from '@/lib/wa-templates';

export type EmployeeOption = {
  id: string;
  empId: string;
  name: string;
  role: string;
  team: string;
};

type UniAppRecord = {
  id: string;
  university: string;
  program: string | null;
  status: string;
  applicationId: string | null;
};

type LeadDocRecord = {
  id: string;
  docType: string;
  status: string;
  studentUploadedUrl: string | null;
  notes: string | null;
};

type ActivityItem = {
  id: string;
  type: string;
  actorName: string | null;
  fromValue: string | null;
  toValue: string | null;
  details: string | null;
  createdAt: string;
};

type Props = {
  lead: LeadRecord;
  employees: EmployeeOption[];
  saving: boolean;
  onUpdateLead: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  onTokenChanged?: (leadId: string, token: string) => void;
};

export default function LeadPortalDrawerSection({
  lead,
  employees,
  saving,
  onUpdateLead,
  onTokenChanged,
}: Props) {
  const { authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(lead.publicToken || null);
  const [publicEnabled, setPublicEnabled] = useState<boolean>(lead.publicEnabled ?? true);
  const [uniApps, setUniApps] = useState<UniAppRecord[]>([]);
  const [docs, setDocs] = useState<LeadDocRecord[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Editable CRM fields
  const [stage, setStage] = useState(lead.applicationStage || 'documents');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(lead.assignedEmployeeId || '');
  const [university, setUniversity] = useState(lead.university || '');
  const [gpa, setGpa] = useState(lead.gpa != null ? String(lead.gpa) : (lead.assessAcademicResults || ''));
  const [nextFollowup, setNextFollowup] = useState(lead.nextFollowup || '');
  const [visaDeadline, setVisaDeadline] = useState(lead.visaDeadline || '');

  // Quick-add university & message reply
  const [newUniName, setNewUniName] = useState('');
  const [newUniProgram, setNewUniProgram] = useState(lead.program || '');
  const [replyText, setReplyText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eduexpressint.com';
  const portalUrl = token ? `${origin}/track/${token}` : null;
  const milestoneStep = resolvePortalMilestoneStep(stage, lead.status, uniApps);
  const progressPct = portalProgressPct(milestoneStep);

  const [refreshTick, setRefreshTick] = useState(0);

  const loadPortalDetails = async () => {
    setRefreshTick((t) => t + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || controller.signal.aborted) return;
        setToken(data.lead?.publicToken || null);
        setPublicEnabled(data.lead?.publicEnabled ?? true);
        setUniApps(Array.isArray(data.universityApps) ? data.universityApps : []);
        setDocs(Array.isArray(data.documents) ? data.documents : []);
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [authenticatedFetch, lead.id, refreshTick]);

  const handleEnsureToken = async (regenerate = false) => {
    setBusyAction('token');
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: regenerate ? 'regenerate_token' : 'ensure_token' }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.publicToken);
        setPublicEnabled(true);
        onTokenChanged?.(lead.id, data.publicToken);
        await loadPortalDetails();
        setFeedback(regenerate ? 'New tracking token generated.' : 'Student portal link activated.');
      }
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveCrmMeta = async () => {
    setBusyAction('meta');
    setFeedback(null);
    const chosenEmp = employees.find((e) => e.id === assignedEmployeeId);
    const numericGpa = Number.parseFloat(gpa);
    const payload: Record<string, unknown> = {
      applicationStage: stage,
      assignedEmployeeId: assignedEmployeeId || null,
      assignedTo: chosenEmp ? chosenEmp.name : (lead.assignedTo || null),
      university: university.trim() || null,
      gpa: Number.isFinite(numericGpa) && numericGpa > 0 && numericGpa <= 5.5 ? numericGpa : null,
      nextFollowup: nextFollowup || null,
      visaDeadline: visaDeadline || null,
      publicEnabled,
    };
    const ok = await onUpdateLead(lead.id, payload);
    setBusyAction(null);
    if (ok) {
      setFeedback('Pipeline stage, GPA & counselor assignment saved.');
      void loadPortalDetails();
    }
  };

  const handleAddUni = async () => {
    if (!newUniName.trim()) return;
    setBusyAction('uni');
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_university',
          university: newUniName.trim(),
          program: newUniProgram.trim() || null,
        }),
      });
      if (res.ok) {
        setNewUniName('');
        await loadPortalDetails();
      }
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdateUniStatus = async (itemId: string, status: string) => {
    setBusyAction(`uni-${itemId}`);
    try {
      await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'university', itemId, status }),
      });
      await loadPortalDetails();
    } finally {
      setBusyAction(null);
    }
  };

  const handleSeedDocs = async () => {
    setBusyAction('docs');
    try {
      await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_documents' }),
      });
      await loadPortalDetails();
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdateDocStatus = async (itemId: string, status: string) => {
    setBusyAction(`doc-${itemId}`);
    try {
      await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'document', itemId, status }),
      });
      await loadPortalDetails();
    } finally {
      setBusyAction(null);
    }
  };

  const handleSendStudentReply = async () => {
    if (!replyText.trim()) return;
    setBusyAction('reply');
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply_student', message: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText('');
        await loadPortalDetails();
      }
    } finally {
      setBusyAction(null);
    }
  };

  const waInviteUrl = portalUrl
    ? buildWhatsAppUrl(lead.phone, formatWaTemplateMessage('portal_invite', lead, portalUrl))
    : null;

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
            Student Journey & Live Tracking Portal
          </p>
          <p className="text-xs text-slate-600">
            Step {milestoneStep}/6 ({progressPct}% complete) · Assigned: <strong className="text-slate-900">{lead.assignedTo || 'Unassigned'}</strong>
          </p>
        </div>
        {token ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <a
              href={`/track/${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-[#0f3a5c] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[#12436b]"
            >
              <ExternalLink size={12} /> Open Portal
            </a>
            <button
              type="button"
              onClick={async () => {
                if (!portalUrl) return;
                await navigator.clipboard.writeText(portalUrl);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 1800);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              {copiedUrl ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copiedUrl ? 'Copied' : 'Copy Link'}
            </button>
            {waInviteUrl && (
              <a
                href={waInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
              >
                <Send size={12} /> Send on WA
              </a>
            )}
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              title="Toggle QR Code"
            >
              <QrCode size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={busyAction === 'token'}
            onClick={() => handleEnsureToken(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {busyAction === 'token' ? <Loader2 size={13} className="animate-spin" /> : <Link2 size={13} />}
            Generate Tracking Link
          </button>
        )}
      </div>

      {showQr && portalUrl && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(portalUrl)}`}
            alt="Student portal QR code"
            width={160}
            height={160}
            className="rounded border border-slate-100"
          />
          <p className="break-all text-[11px] text-slate-500">{portalUrl}</p>
          <button
            type="button"
            disabled={busyAction === 'token'}
            onClick={() => handleEnsureToken(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
          >
            <RefreshCw size={11} /> Rotate token
          </button>
        </div>
      )}

      {/* Counselor assignment + 6-stage milestone + follow-up editor */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-slate-700">
          Application Milestone (1-6)
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-900"
          >
            {APPLICATION_STAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Assigned Counselor
          <select
            value={assignedEmployeeId}
            onChange={(e) => setAssignedEmployeeId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-900"
          >
            <option value="">-- Select counselor --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.empId} · {emp.team})
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Target / Admitted University
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="e.g. NUAA / ZJU / Jiangsu Univ"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-slate-700">
            GPA
            <input
              type="text"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              placeholder="4.50"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Next Follow-up
            <input
              type="date"
              value={nextFollowup}
              onChange={(e) => setNextFollowup(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900"
            />
          </label>
        </div>

        <label className="text-xs font-semibold text-slate-700">
          Visa Deadline
          <input
            type="date"
            value={visaDeadline}
            onChange={(e) => setVisaDeadline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
          />
        </label>

        <div className="flex items-end justify-between gap-2">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 pb-2">
            <input
              type="checkbox"
              checked={publicEnabled}
              onChange={(e) => setPublicEnabled(e.target.checked)}
              className="size-4 rounded border-slate-300 text-blue-600"
            />
            Portal Visible
          </label>
          <button
            type="button"
            disabled={saving || busyAction === 'meta'}
            onClick={handleSaveCrmMeta}
            className="rounded-lg bg-[#0f3a5c] px-3 py-2 text-xs font-bold text-white hover:bg-[#12436b] disabled:opacity-60"
          >
            {busyAction === 'meta' ? 'Saving…' : 'Save Workflow Details'}
          </button>
        </div>
      </div>

      {feedback && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {feedback}
        </p>
      )}

      {/* University Applications */}
      <div className="border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <GraduationCap size={14} className="text-blue-600" />
            University Applications ({uniApps.length})
          </h4>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newUniName}
            onChange={(e) => setNewUniName(e.target.value)}
            placeholder="University name…"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
          />
          <input
            type="text"
            value={newUniProgram}
            onChange={(e) => setNewUniProgram(e.target.value)}
            placeholder="Program…"
            className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
          />
          <button
            type="button"
            disabled={busyAction === 'uni' || !newUniName.trim()}
            onClick={handleAddUni}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Plus size={13} /> Add
          </button>
        </div>
        {uniApps.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {uniApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{app.university}</p>
                  {app.program && <p className="truncate text-[11px] text-slate-500">{app.program}</p>}
                </div>
                <select
                  value={app.status}
                  onChange={(e) => handleUpdateUniStatus(app.id, e.target.value)}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-800"
                >
                  <option value="documents">Documents</option>
                  <option value="ready">Ready</option>
                  <option value="submitted">Submitted</option>
                  <option value="admitted">Admitted</option>
                  <option value="returned">Returned</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Checklist */}
      <div className="border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <FileCheck2 size={14} className="text-emerald-600" />
            Document Checklist ({docs.filter((d) => d.status === 'verified').length}/{docs.length} verified)
          </h4>
          {docs.length === 0 && (
            <button
              type="button"
              disabled={busyAction === 'docs'}
              onClick={handleSeedDocs}
              className="text-[11px] font-bold text-blue-700 hover:underline"
            >
              + Load China Checklist
            </button>
          )}
        </div>
        {loading ? (
          <p className="mt-2 text-xs text-slate-400">Loading documents…</p>
        ) : docs.length > 0 && (
          <div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto pr-1">
            {docs.map((doc) => {
              const safeStudentLink = toSafeExternalUrl(doc.studentUploadedUrl);
              return (
                <div key={doc.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{doc.docType}</p>
                    {safeStudentLink && (
                      <a
                        href={safeStudentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:underline"
                      >
                        Student Drive Upload <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <select
                    value={doc.status}
                    onChange={(e) => handleUpdateDocStatus(doc.id, e.target.value)}
                    className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
                      doc.status === 'verified'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : doc.status === 'received'
                          ? 'border-blue-200 bg-blue-50 text-blue-800'
                          : doc.status === 'rejected'
                            ? 'border-red-200 bg-red-50 text-red-800'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Needs Fix</option>
                    <option value="not_required">Optional</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Direct Student Portal Reply + Timeline */}
      <div className="border-t border-slate-200 pt-3">
        <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <MessageSquare size={14} className="text-indigo-600" />
          Student Portal Updates & Messages
        </h4>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Post status update or reply visible on student portal…"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
          />
          <button
            type="button"
            disabled={busyAction === 'reply' || !replyText.trim()}
            onClick={handleSendStudentReply}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <ShieldCheck size={12} /> Post
          </button>
        </div>
        {activities.length > 0 && (
          <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
            {activities.slice(0, 8).map((act) => (
              <div key={act.id} className="rounded bg-white px-2.5 py-1.5 text-[11px] text-slate-700 border border-slate-100">
                <span className="font-bold text-slate-900">{act.type.replaceAll('_', ' ')}</span>
                {act.actorName && <span className="text-slate-400"> · {act.actorName}</span>}
                {act.toValue && <span className="text-blue-700"> → {act.toValue}</span>}
                {act.details && <p className="mt-0.5 text-slate-600 line-clamp-2">{act.details}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

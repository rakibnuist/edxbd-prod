'use client';

import { useEffect, useState } from 'react';
import {
  Check, Copy, ExternalLink, FileCheck2, GraduationCap, Link2, Loader2,
  MessageSquare, Plus, QrCode, RefreshCw, Send, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TRACKER_UNI_STATUSES } from '@/lib/application-tracker';
import { parseNumericGpa } from '@/lib/wa-templates';
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
  const { user, authenticatedFetch } = useAuth();
  const isCounselor = user?.role === 'counselor';
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
  const [degree, setDegree] = useState(lead.degree || '');
  const [gpa, setGpa] = useState(lead.gpa != null ? String(lead.gpa) : (lead.assessAcademicResults || ''));
  const [nextFollowup, setNextFollowup] = useState(lead.nextFollowup || '');
  const [visaDeadline, setVisaDeadline] = useState(lead.visaDeadline || '');
  const [departureDate, setDepartureDate] = useState(lead.departureDate || '');
  const [driveLink, setDriveLink] = useState(lead.driveLink || '');
  const [riskFlag, setRiskFlag] = useState(Boolean(lead.riskFlag));
  const [medicalProgram, setMedicalProgram] = useState(Boolean(lead.medicalProgram));

  // Quick-add university & message reply
  const [newUniName, setNewUniName] = useState('');
  const [newUniProgram, setNewUniProgram] = useState(lead.program || '');
  const [replyText, setReplyText] = useState('');
  const [feedback, setFeedback] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [assignmentDirty, setAssignmentDirty] = useState(false);

  // Keep follow-up synced if FollowupScheduler or QuickInteractionLogger updates lead.nextFollowup
  const incomingFollowup = lead.nextFollowup || '';
  const [prevLeadFollowup, setPrevLeadFollowup] = useState(incomingFollowup);
  if (incomingFollowup !== prevLeadFollowup) {
    setPrevLeadFollowup(incomingFollowup);
    setNextFollowup(incomingFollowup);
  }

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
        if (data.lead) {
          setStage(data.lead.applicationStage || 'documents');
          setAssignedEmployeeId(data.lead.assignedEmployeeId || '');
          setAssignmentDirty(false);
          setUniversity(data.lead.university || '');
          setDegree(data.lead.degree || '');
          setGpa(
            data.lead.gpa != null
              ? String(data.lead.gpa)
              : (data.lead.assessAcademicResults || ''),
          );
          setNextFollowup(data.lead.nextFollowup || '');
          setVisaDeadline(data.lead.visaDeadline || '');
          setDepartureDate(data.lead.departureDate || '');
          setDriveLink(data.lead.driveLink || '');
          setRiskFlag(Boolean(data.lead.riskFlag));
          setMedicalProgram(Boolean(data.lead.medicalProgram));
        }
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
    setFeedback(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: regenerate ? 'regenerate_token' : 'ensure_token' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setToken(data.publicToken);
        setPublicEnabled(true);
        onTokenChanged?.(lead.id, data.publicToken);
        await loadPortalDetails();
        setFeedback({ tone: 'ok', text: regenerate ? 'New tracking token generated.' : 'Student portal link activated.' });
      } else {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not update tracking link.' });
      }
    } catch {
      setFeedback({ tone: 'err', text: 'Network error updating tracking link.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveCrmMeta = async () => {
    setBusyAction('meta');
    setFeedback(null);
    const parsedGpa = parseNumericGpa(null, gpa);
    const payload: Record<string, unknown> = {
      applicationStage: stage,
      university: university.trim() || null,
      degree: degree.trim() || null,
      gpa: parsedGpa,
      nextFollowup: nextFollowup || null,
      visaDeadline: visaDeadline || null,
      departureDate: departureDate || null,
      driveLink: driveLink.trim() || null,
      riskFlag,
      medicalProgram,
      publicEnabled,
    };
    // Only send counselor assignment when an admin explicitly changed the dropdown (prevents wiping legacy/inactive assignees or counselor auto-claim)
    if (!isCounselor && assignmentDirty) {
      const chosenEmp = employees.find((e) => e.id === assignedEmployeeId);
      payload.assignedEmployeeId = assignedEmployeeId || null;
      payload.assignedTo = chosenEmp ? chosenEmp.name : null;
    }
    const ok = await onUpdateLead(lead.id, payload);
    setBusyAction(null);
    if (ok) {
      setAssignmentDirty(false);
      setFeedback({ tone: 'ok', text: 'Pipeline stage, dossier dates & counselor assignment saved.' });
      void loadPortalDetails();
    } else {
      setFeedback({ tone: 'err', text: 'Could not save workflow details. Check fields above and retry.' });
    }
  };

  const handleAddUni = async () => {
    if (!newUniName.trim()) return;
    setBusyAction('uni');
    setFeedback(null);
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
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNewUniName('');
        await loadPortalDetails();
      } else {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not add university.' });
      }
    } catch {
      setFeedback({ tone: 'err', text: 'Network error adding university.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdateUniStatus = async (itemId: string, status: string) => {
    setBusyAction(`uni-${itemId}`);
    setFeedback(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'university', itemId, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not update university status.' });
      }
      await loadPortalDetails();
    } catch {
      setFeedback({ tone: 'err', text: 'Network error updating university status.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSeedDocs = async () => {
    setBusyAction('docs');
    setFeedback(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_documents' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not initialize document checklist.' });
      }
      await loadPortalDetails();
    } catch {
      setFeedback({ tone: 'err', text: 'Network error initializing documents.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleUpdateDocStatus = async (itemId: string, status: string) => {
    setBusyAction(`doc-${itemId}`);
    setFeedback(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'document', itemId, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not update document status.' });
      }
      await loadPortalDetails();
    } catch {
      setFeedback({ tone: 'err', text: 'Network error updating document status.' });
    } finally {
      setBusyAction(null);
    }
  };

  const handleSendStudentReply = async () => {
    if (!replyText.trim()) return;
    setBusyAction('reply');
    setFeedback(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(lead.id)}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply_student', message: replyText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setReplyText('');
        await loadPortalDetails();
      } else {
        setFeedback({ tone: 'err', text: data.error || data.message || 'Could not send reply to student.' });
      }
    } catch {
      setFeedback({ tone: 'err', text: 'Network error sending reply.' });
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
                try {
                  await navigator.clipboard.writeText(portalUrl);
                  setCopiedUrl(true);
                  setTimeout(() => setCopiedUrl(false), 1800);
                } catch {
                  setFeedback({ tone: 'err', text: 'Clipboard access blocked. Copy the portal URL manually.' });
                }
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

      {/* Student consultancy qualification tags */}
      {(lead.assessIntake || lead.assessBudget || medicalProgram || riskFlag) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {lead.assessIntake && (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              Intake: {lead.assessIntake}
            </span>
          )}
          {lead.assessBudget && (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              Budget: {lead.assessBudget}
            </span>
          )}
          {medicalProgram && (
            <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              MBBS / Clinical Track
            </span>
          )}
          {riskFlag && (
            <span className="inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-900">
              Senior Escalation Flagged
            </span>
          )}
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
            {!APPLICATION_STAGE_OPTIONS.some((opt) => opt.value === stage) && (
              <option value={stage}>{stage.replaceAll('_', ' ')}</option>
            )}
            {APPLICATION_STAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>

        <label className="text-xs font-semibold text-slate-700">
          Assigned Counselor
          <select
            value={assignedEmployeeId}
            disabled={isCounselor}
            onChange={(e) => {
              setAssignedEmployeeId(e.target.value);
              setAssignmentDirty(true);
            }}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">{lead.assignedTo && !assignedEmployeeId ? `${lead.assignedTo} (Legacy)` : '-- Unassigned --'}</option>
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
            Degree Level
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Bachelor's / MBBS / Master's"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
            />
          </label>
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
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-slate-700">
            Next Follow-up
            <input
              type="date"
              value={nextFollowup ? nextFollowup.slice(0, 10) : ''}
              onChange={(e) => setNextFollowup(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900"
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Visa Deadline
            <input
              type="date"
              value={visaDeadline}
              onChange={(e) => setVisaDeadline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-900"
            />
          </label>
        </div>

        <label className="text-xs font-semibold text-slate-700">
          Target Departure / Flight Date
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
          />
        </label>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`drive-${lead.id}`} className="text-xs font-semibold text-slate-700">
              Google Drive / Case Dossier Folder URL
            </label>
            {toSafeExternalUrl(driveLink) && (
              <a
                href={toSafeExternalUrl(driveLink)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
              >
                Open Folder <ExternalLink size={11} />
              </a>
            )}
          </div>
          <input
            id={`drive-${lead.id}`}
            type="url"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={publicEnabled}
                onChange={(e) => setPublicEnabled(e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600"
              />
              Portal Visible
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <input
                type="checkbox"
                checked={medicalProgram}
                onChange={(e) => setMedicalProgram(e.target.checked)}
                className="size-4 rounded border-slate-300 text-emerald-600"
              />
              MBBS / Medical Track
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <input
                type="checkbox"
                checked={riskFlag}
                onChange={(e) => setRiskFlag(e.target.checked)}
                className="size-4 rounded border-slate-300 text-amber-600"
              />
              Senior Review Flag
            </label>
          </div>
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
        <p
          className={`rounded-lg px-3 py-2 text-xs font-semibold ${
            feedback.tone === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          {feedback.text}
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
                  {TRACKER_UNI_STATUSES.map((st) => (
                    <option key={st.key} value={st.key}>{st.label}</option>
                  ))}
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

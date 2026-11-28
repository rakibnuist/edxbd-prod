'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  FileText,
  FolderOpen,
  Landmark,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Send,
  Shield,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatBdt } from '@/lib/finance-logic';
import { toSafeExternalUrl } from '@/lib/safe-url';
import QuickInteractionLogger from '@/components/admin/QuickInteractionLogger';
import { categorizeLeadSource, formatFriendlySource, getSourceCategoryDef } from '@/lib/lead-sources';
import {
  APPLICATION_TRACKER_STAGES,
  DEGREE_OPTIONS,
  DESTINATION_OPTIONS,
  EMBASSY_STATUSES,
  INTAKE_SESSION_OPTIONS,
  INTAKE_YEAR_OPTIONS,
  TRACKER_DOC_STATUSES,
  TRACKER_UNI_STATUSES,
  composeIntakeTerm,
  extractIntakeSession,
  extractIntakeYear,
  getStageDef,
  type ApplicationRowDto,
} from '@/lib/application-tracker';
import type { TrackerEmployeeOption } from '@/components/admin/NewApplicationModal';

interface UniAppItem {
  id: string;
  university: string;
  program: string | null;
  status: string;
  applicationId: string | null;
  notes: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

interface DocItem {
  id: string;
  docType: string;
  status: string;
  notes: string | null;
  fileUrl: string | null;
  studentUploadedUrl: string | null;
  studentUploadedAt: string | null;
  updatedBy: string | null;
}

interface ActivityItem {
  id: string;
  type: string;
  actorName: string | null;
  fromValue: string | null;
  toValue: string | null;
  details: string | null;
  createdAt: string;
}

interface FinanceBundle {
  receivedTotal: number;
  spentTotal: number;
  netTotal: number;
  incomes: Array<{
    id: string;
    date: string;
    category: string | null;
    amount: number;
    reference: string | null;
    notes: string | null;
    excludeFromCash: boolean;
  }>;
  expenses: Array<{
    id: string;
    date: string;
    category: string | null;
    paidTo: string | null;
    amount: number;
    reference: string | null;
    notes: string | null;
  }>;
}

interface DetailResponse {
  isAdmin: boolean;
  canAccessFinance?: boolean;
  application: ApplicationRowDto;
  universityApps: UniAppItem[];
  documents: DocItem[];
  activities: ActivityItem[];
  finance: FinanceBundle | null;
}

type DrawerTab = 'overview' | 'universities' | 'documents' | 'finance' | 'timeline';

export interface CatalogUniversityOption {
  name: string;
  country: string;
  majors: string[];
}

interface ApplicationDetailDrawerProps {
  applicationId: string | null;
  isAdmin: boolean;
  canAccessFinance?: boolean;
  employees: TrackerEmployeeOption[];
  universities?: string[];
  programs?: string[];
  catalogUniversities?: CatalogUniversityOption[];
  onClose: () => void;
  onMutated: () => void;
}

function formatDhakaStamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 16);
  }
}

export default function ApplicationDetailDrawer({
  applicationId,
  isAdmin,
  canAccessFinance,
  employees,
  universities = [],
  programs = [],
  catalogUniversities = [],
  onClose,
  onMutated,
}: ApplicationDetailDrawerProps) {
  const { authenticatedFetch } = useAuth();
  const [tab, setTab] = useState<DrawerTab>('overview');
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [reloadTick, setReloadTick] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedPortal, setCopiedPortal] = useState(false);

  // Editable overview form state
  const [form, setForm] = useState<Record<string, string>>({});

  // Sub-forms
  const [newUniName, setNewUniName] = useState('');
  const [newUniProgram, setNewUniProgram] = useState('');
  const [newUniStatus, setNewUniStatus] = useState('documents');
  const [newUniAppId, setNewUniAppId] = useState('');
  const [addingUni, setAddingUni] = useState(false);

  const [newDocName, setNewDocName] = useState('');
  const [addingDoc, setAddingDoc] = useState(false);
  const [seedingDocs, setSeedingDocs] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [noteMode, setNoteMode] = useState<'add_note' | 'reply_student'>('add_note');
  const [sendingNote, setSendingNote] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    let cancelled = false;
    authenticatedFetch(`/api/admin/applications/${applicationId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || json.message || 'Failed to load dossier');
        return json as DetailResponse;
      })
      .then((json) => {
        if (cancelled) return;
        setDetail(json);
        setError(null);
        const a = json.application;
        setForm({
          leadRef: a.leadRef || '',
          name: a.name || '',
          phone: a.phone || '',
          email: a.email || '',
          nationality: a.nationality || '',
          passport: a.passport || '',
          dateOfBirth: a.dateOfBirth || '',
          bloodGroup: a.bloodGroup || '',
          emergencyContact: a.emergencyContact || '',
          country: a.country || 'China',
          assessIntake: a.assessIntake || '',
          intakeSession: extractIntakeSession(a.assessIntake) !== 'Other' ? extractIntakeSession(a.assessIntake) : 'March',
          intakeYear: extractIntakeYear(a.assessIntake) !== 'Unscheduled' ? extractIntakeYear(a.assessIntake) : '2027',
          degree: a.degree || '',
          program: a.program || '',
          university: a.university || '',
          gpa: a.gpa !== null && a.gpa !== undefined ? String(a.gpa) : '',
          assessAcademicLevel: a.assessAcademicLevel || '',
          assessAcademicResults: a.assessAcademicResults || '',
          assessLanguage: a.assessLanguage || '',
          embassyStatus: a.embassyStatus || 'Pending',
          embassyDate: a.embassyDate || '',
          hardcopyStatus: a.hardcopyStatus || 'Pending',
          visaDeadline: a.visaDeadline || '',
          departureDate: a.departureDate || '',
          nextFollowup: a.nextFollowup || '',
          driveLink: a.driveLink || '',
          leadMarket: a.leadMarket || 'Bangladesh',
          channelType: a.channelType || 'B2C',
          source: a.source || 'In-House',
          referrer: a.referrer || '',
          assignedEmployeeId: a.assignedEmployeeId || '',
          deposit: a.deposit ? String(a.deposit) : '0',
          serviceFee: a.serviceFee ? String(a.serviceFee) : '0',
          paidAmount: a.paidAmount ? String(a.paidAmount) : '0',
          applicationNotes: a.applicationNotes || '',
          medicalNotes: a.medicalNotes || '',
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load application.');
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId, reloadTick, authenticatedFetch]);

  const matchedUniForOverview = useMemo(() => {
    const q = (form.university || '').trim().toLowerCase();
    if (!q || !Array.isArray(catalogUniversities)) return null;
    return (
      catalogUniversities.find(
        (u) =>
          typeof u?.name === 'string' &&
          (u.name.toLowerCase() === q ||
            u.name.toLowerCase().startsWith(q) ||
            u.name.toLowerCase().includes(q)),
      ) || null
    );
  }, [form.university, catalogUniversities]);

  const uniMatchesForOverview = useMemo(() => {
    const q = (form.university || '').trim().toLowerCase();
    if (q.length < 2 || !Array.isArray(catalogUniversities)) return [];
    const exact = catalogUniversities.some(
      (u) => typeof u?.name === 'string' && u.name.toLowerCase() === q,
    );
    if (exact) return [];
    return catalogUniversities
      .filter((u) => typeof u?.name === 'string' && u.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [form.university, catalogUniversities]);

  const overviewSuggestedMajors = useMemo(() => {
    const basePrograms = Array.isArray(programs) ? programs : [];
    const uniMajors = Array.isArray(matchedUniForOverview?.majors)
      ? matchedUniForOverview.majors
      : [];
    if (uniMajors.length > 0) {
      return Array.from(new Set([...uniMajors, ...basePrograms]));
    }
    return basePrograms;
  }, [matchedUniForOverview, programs]);

  const matchedUniForAdd = useMemo(() => {
    const q = newUniName.trim().toLowerCase();
    if (!q || !Array.isArray(catalogUniversities)) return null;
    return (
      catalogUniversities.find(
        (u) =>
          typeof u?.name === 'string' &&
          (u.name.toLowerCase() === q ||
            u.name.toLowerCase().startsWith(q) ||
            u.name.toLowerCase().includes(q)),
      ) || null
    );
  }, [newUniName, catalogUniversities]);

  const uniMatchesForAdd = useMemo(() => {
    const q = newUniName.trim().toLowerCase();
    if (q.length < 2 || !Array.isArray(catalogUniversities)) return [];
    const exact = catalogUniversities.some(
      (u) => typeof u?.name === 'string' && u.name.toLowerCase() === q,
    );
    if (exact) return [];
    return catalogUniversities
      .filter((u) => typeof u?.name === 'string' && u.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [newUniName, catalogUniversities]);

  const addUniSuggestedMajors = useMemo(() => {
    const basePrograms = Array.isArray(programs) ? programs : [];
    const uniMajors = Array.isArray(matchedUniForAdd?.majors)
      ? matchedUniForAdd.majors
      : [];
    if (uniMajors.length > 0) {
      return Array.from(new Set([...uniMajors, ...basePrograms]));
    }
    return basePrograms;
  }, [matchedUniForAdd, programs]);

  if (!applicationId) return null;

  const loading = !error && (!detail || detail.application.id !== applicationId);

  const flashToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((cur) => (cur === msg ? null : cur)), 3200);
  };

  const refreshDetail = () => {
    setReloadTick((t) => t + 1);
    onMutated();
  };

  const app = detail?.application || null;
  const canSeeFinance = canAccessFinance ?? Boolean(detail?.canAccessFinance);
  const currentStageDef = getStageDef(app?.applicationStage);
  const currentStageIndex = APPLICATION_TRACKER_STAGES.findIndex((s) => s.key === currentStageDef.key);
  const nextStageDef =
    currentStageIndex >= 0 && currentStageIndex < 14
      ? APPLICATION_TRACKER_STAGES[currentStageIndex + 1]
      : null;

  const safeDriveHref = toSafeExternalUrl(form.driveLink);

  const handleStageChange = async (stageKey: string) => {
    if (!app) return;
    try {
      setSaving(true);
      const res = await authenticatedFetch(`/api/admin/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStage: stageKey }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || json.message || 'Could not update stage.');
        return;
      }
      flashToast(`Stage updated to ${getStageDef(stageKey).label}`);
      refreshDetail();
    } catch {
      setError('Failed to update application stage.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app) return;
    setError(null);
    try {
      setSaving(true);
      const payload: Record<string, unknown> = {
        leadRef: form.leadRef || null,
        name: form.name,
        phone: form.phone,
        email: form.email,
        nationality: form.nationality || null,
        passport: form.passport || null,
        dateOfBirth: form.dateOfBirth || null,
        bloodGroup: form.bloodGroup || null,
        emergencyContact: form.emergencyContact || null,
        country: form.country,
        assessIntake: form.assessIntake || null,
        degree: form.degree || null,
        program: form.program || null,
        university: form.university || null,
        gpa: form.gpa ? Number(form.gpa) : null,
        assessAcademicLevel: form.assessAcademicLevel || null,
        assessAcademicResults: form.assessAcademicResults || null,
        assessLanguage: form.assessLanguage || null,
        embassyStatus: form.embassyStatus || null,
        embassyDate: form.embassyDate || null,
        hardcopyStatus: form.hardcopyStatus || null,
        visaDeadline: form.visaDeadline || null,
        departureDate: form.departureDate || null,
        nextFollowup: form.nextFollowup || null,
        driveLink: form.driveLink || null,
        channelType: form.channelType,
        source: form.source,
        referrer: form.referrer || null,
        ...(canSeeFinance
          ? {
              deposit: form.deposit ? Number(form.deposit) : 0,
              serviceFee: form.serviceFee ? Number(form.serviceFee) : 0,
              paidAmount: form.paidAmount ? Number(form.paidAmount) : 0,
            }
          : {}),
        applicationNotes: form.applicationNotes || null,
        medicalNotes: form.medicalNotes || null,
        ...(isAdmin
          ? {
              leadMarket: form.leadMarket,
              assignedEmployeeId: form.assignedEmployeeId || null,
            }
          : {}),
      };

      const res = await authenticatedFetch(`/api/admin/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || json.message || 'Could not save changes.');
        return;
      }
      flashToast('Application dossier saved.');
      refreshDetail();
    } catch {
      setError('Network error while saving dossier.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnsurePortalToken = async (regenerate = false) => {
    if (!app) return;
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: regenerate ? 'regenerate_token' : 'ensure_token' }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        flashToast(regenerate ? 'Student tracking link regenerated.' : 'Student live portal enabled.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not update student portal link.');
      }
    } catch {
      setError('Network error updating student portal link.');
    }
  };

  const handleCopyPortalLink = async () => {
    if (!app?.publicToken) return;
    const url = `${window.location.origin}/track/${app.publicToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPortal(true);
      setTimeout(() => setCopiedPortal(false), 2000);
    } catch {
      setError('Clipboard access blocked. Please copy the portal URL manually.');
    }
  };

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !newUniName.trim()) return;
    setAddingUni(true);
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_university',
          university: newUniName.trim(),
          program: newUniProgram.trim() || null,
          status: newUniStatus,
          applicationId: newUniAppId.trim() || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setNewUniName('');
        setNewUniProgram('');
        setNewUniAppId('');
        flashToast('University application added.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not add university application.');
      }
    } catch {
      setError('Network error adding university application.');
    } finally {
      setAddingUni(false);
    }
  };

  const handleUpdateUniStatus = async (itemId: string, status: string) => {
    if (!app) return;
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'university', itemId, status }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        flashToast('University status updated.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not update university status.');
      }
    } catch {
      setError('Network error updating university status.');
    }
  };

  const handleDeletePortalItem = async (kind: 'university' | 'document', itemId: string) => {
    if (!app) return;
    setError(null);
    try {
      const res = await authenticatedFetch(
        `/api/admin/leads/${app.id}/portal?kind=${kind}&itemId=${encodeURIComponent(itemId)}`,
        { method: 'DELETE' },
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        flashToast(kind === 'university' ? 'University removed.' : 'Document removed.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not remove item.');
      }
    } catch {
      setError('Network error removing item.');
    }
  };

  const handleSeedDocs = async () => {
    if (!app) return;
    setSeedingDocs(true);
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_documents' }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        flashToast('Destination document checklist synced.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not sync document checklist.');
      }
    } catch {
      setError('Network error syncing document checklist.');
    } finally {
      setSeedingDocs(false);
    }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !newDocName.trim()) return;
    setAddingDoc(true);
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_document',
          docType: newDocName.trim(),
          status: 'pending',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setNewDocName('');
        flashToast('Document item added.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not add document item.');
      }
    } catch {
      setError('Network error adding document item.');
    } finally {
      setAddingDoc(false);
    }
  };

  const handleUpdateDocStatus = async (itemId: string, status: string) => {
    if (!app) return;
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'document', itemId, status }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not update document status.');
      }
    } catch {
      setError('Network error updating document status.');
    }
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app || !noteText.trim()) return;
    setSendingNote(true);
    setError(null);
    try {
      const res = await authenticatedFetch(`/api/admin/leads/${app.id}/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: noteMode, message: noteText.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setNoteText('');
        flashToast(noteMode === 'reply_student' ? 'Message posted to student portal.' : 'Internal note logged.');
        refreshDetail();
      } else {
        setError(json.error || json.message || 'Could not post update.');
      }
    } catch {
      setError('Network error posting update.');
    } finally {
      setSendingNote(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!app || !isAdmin) return;
    const confirmed = window.confirm(
      `Permanently delete ${app.name} (${app.leadRef || app.id}) from the Application Tracker and CRM? Finance ledger rows will remain preserved.`,
    );
    if (!confirmed) return;
    const res = await authenticatedFetch(`/api/admin/applications/${app.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      onMutated();
      onClose();
    } else {
      setError('Could not delete application.');
    }
  };

  const docsPct = app && app.docsTotal > 0 ? Math.round((app.docsReceived / app.docsTotal) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-[1px] print:hidden">
      <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
        {/* Top Institutional Dossier Bar */}
        <div className="border-b border-slate-200 bg-[#071c2e] px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {app?.leadRef && (
                  <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-200">
                    {app.leadRef}
                  </span>
                )}
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    app?.channelType === 'B2B'
                      ? 'bg-indigo-500/25 text-indigo-200'
                      : 'bg-emerald-500/20 text-emerald-200'
                  }`}
                >
                  {app?.channelType === 'B2B' ? 'Partner Agent · B2B' : 'EduExpress Direct · B2C'}
                </span>
                {app?.source && (() => {
                  const cat = categorizeLeadSource(app.source, null, app.channelType);
                  const def = getSourceCategoryDef(cat);
                  return (
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${def.badgeClass}`}>
                      {def.shortLabel}: {formatFriendlySource(app.source)}
                    </span>
                  );
                })()}
                {app?.employeeName && (
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-200">
                    Counselor: {app.employeeName}
                  </span>
                )}
                <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                  {currentStageDef.label}
                </span>
              </div>
              <h2 className="mt-1.5 truncate font-heading text-lg font-bold tracking-tight">
                {app?.name || 'Loading Student Dossier...'}
              </h2>
              {app && (
                <p className="mt-0.5 text-xs text-slate-300">
                  {app.country} · {app.assessIntake || 'Intake TBD'}
                  {app.degree ? ` · ${app.degree}` : ''}
                  {app.passport ? ` · Passport ${app.passport}` : ''}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {nextStageDef && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleStageChange(nextStageDef.key)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  <span>Advance: {nextStageDef.shortLabel}</span>
                  <ArrowRight size={13} />
                </button>
              )}
              {isAdmin && app && (
                <button
                  type="button"
                  onClick={handleDeleteApplication}
                  className="rounded-lg border border-rose-400/30 bg-rose-500/15 p-1.5 text-rose-200 transition hover:bg-rose-500/30"
                  title="Delete application file"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close dossier"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 17-Stage Interactive Pipeline Stepper */}
          {app && (
            <div className="mt-3.5 flex flex-wrap gap-1">
              {APPLICATION_TRACKER_STAGES.map((st) => {
                const isActive = st.key === currentStageDef.key;
                const isPassed = st.order < currentStageDef.order && st.bucket !== 'withdrawn' && currentStageDef.bucket !== 'withdrawn';
                const isWithdrawn = st.bucket === 'withdrawn';
                return (
                  <button
                    key={st.key}
                    type="button"
                    disabled={saving}
                    onClick={() => handleStageChange(st.key)}
                    className={`rounded-md px-2 py-1 text-[10px] font-bold transition ${
                      isActive
                        ? isWithdrawn
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white text-[#071c2e] shadow-xs'
                        : isPassed
                          ? 'bg-emerald-500/25 text-emerald-100 hover:bg-emerald-500/40'
                          : isWithdrawn
                            ? 'bg-rose-500/10 text-rose-200/80 hover:bg-rose-500/25'
                            : 'bg-white/8 text-slate-300 hover:bg-white/15'
                    }`}
                    title={`Move to ${st.label}`}
                  >
                    {st.shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        {(toast || error) && (
          <div className="border-b border-slate-200 px-5 py-2">
            {toast && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
                <CheckCircle2 size={14} className="text-emerald-600" />
                {toast}
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Drawer Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-5 pt-2.5">
          {[
            { id: 'overview' as const, label: 'Excel File & Visa', icon: FileText },
            { id: 'universities' as const, label: `Universities (${detail?.universityApps?.length ?? 0})`, icon: Building2 },
            { id: 'documents' as const, label: `Documents (${app?.docsReceived ?? 0}/${app?.docsTotal ?? 0})`, icon: ClipboardCheck },
            ...(canSeeFinance
              ? [{ id: 'finance' as const, label: 'Finance Ledger', icon: Landmark }]
              : []),
            { id: 'timeline' as const, label: `Timeline (${detail?.activities?.length ?? 0})`, icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 pb-2.5 text-xs font-bold transition ${
                  active
                    ? 'border-[#0f3a5c] text-[#071c2e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-56 items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <Loader2 size={18} className="animate-spin text-[#0f3a5c]" />
              Loading application dossier...
            </div>
          ) : !app ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800">
              Unable to load application file.
            </div>
          ) : (
            <>
              {/* Live Student Portal Strip (Always handy on Overview) */}
              {tab === 'overview' && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-[#0f3a5c]/10 text-[#0f3a5c]">
                      <Shield size={15} />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Student Live Tracking Portal</div>
                      <div className="text-[11px] text-slate-500">
                        {app.publicToken
                          ? `/track/${app.publicToken.slice(0, 14)}… (${app.publicEnabled ? 'Active' : 'Paused'})`
                          : 'No portal link generated yet'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {app.publicToken ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCopyPortalLink}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          {copiedPortal ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          {copiedPortal ? 'Copied' : 'Copy Link'}
                        </button>
                        <a
                          href={`/track/${app.publicToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#0f3a5c] hover:bg-slate-100"
                        >
                          Open <ExternalLink size={11} />
                        </a>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEnsurePortalToken(false)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#071c2e]"
                      >
                        <Sparkles size={12} /> Enable Student Portal
                      </button>
                    )}
                    {safeDriveHref && (
                      <a
                        href={safeDriveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                      >
                        <FolderOpen size={12} /> Drive Folder
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: Overview & Excel Fields */}
              {tab === 'overview' && (
                <form onSubmit={handleSaveOverview} className="space-y-5">
                  {/* Section A: Student Identity */}
                  <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Student Identity &amp; Passport
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Full Name</label>
                        <input
                          type="text"
                          required
                          value={form.name || ''}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">File Ref ID</label>
                        <input
                          type="text"
                          value={form.leadRef || ''}
                          onChange={(e) => setForm({ ...form, leadRef: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={form.phone || ''}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Email</label>
                        <input
                          type="email"
                          value={form.email || ''}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Passport No.</label>
                        <input
                          type="text"
                          value={form.passport || ''}
                          onChange={(e) => setForm({ ...form, passport: e.target.value.toUpperCase() })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Nationality</label>
                        <input
                          type="text"
                          value={form.nationality || ''}
                          onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Date of Birth</label>
                        <input
                          type="date"
                          value={form.dateOfBirth || ''}
                          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Blood Group</label>
                        <select
                          value={form.bloodGroup || ''}
                          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          <option value="">—</option>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Emergency Contact</label>
                        <input
                          type="text"
                          value={form.emergencyContact || ''}
                          onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                          placeholder="Guardian name & phone"
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section B: Program & Academic */}
                  <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Destination, Intake &amp; Academic Profile
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Destination</label>
                        <select
                          value={form.country || 'China'}
                          onChange={(e) => setForm({ ...form, country: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          {Array.from(new Set([...DESTINATION_OPTIONS, form.country || 'China'])).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Intake Session</label>
                        <select
                          value={form.intakeSession || 'March'}
                          onChange={(e) => {
                            const nextSession = e.target.value;
                            const nextTerm = composeIntakeTerm(nextSession, form.intakeYear || '2027') || '';
                            setForm({ ...form, intakeSession: nextSession, assessIntake: nextTerm });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          {INTAKE_SESSION_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Intake Year</label>
                        <select
                          value={form.intakeYear || '2027'}
                          onChange={(e) => {
                            const nextYear = e.target.value;
                            const nextTerm = composeIntakeTerm(form.intakeSession || 'March', nextYear) || '';
                            setForm({ ...form, intakeYear: nextYear, assessIntake: nextTerm });
                          }}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold tabular-nums text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          {INTAKE_YEAR_OPTIONS.map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Degree</label>
                        <select
                          value={form.degree || ''}
                          onChange={(e) => setForm({ ...form, degree: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          <option value="">Select degree</option>
                          {Array.from(new Set([...DEGREE_OPTIONS, ...(form.degree ? [form.degree] : [])])).map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Primary University</label>
                        <input
                          type="text"
                          list="drawer-uni-list"
                          value={form.university || ''}
                          onChange={(e) => setForm({ ...form, university: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Major / Program</label>
                        <input
                          type="text"
                          list="drawer-overview-program-list"
                          value={form.program || ''}
                          onChange={(e) => setForm({ ...form, program: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>

                      {uniMatchesForOverview.length > 0 && (
                        <div className="sm:col-span-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 p-2 text-[11px] text-[#071c2e]">
                          <span className="font-bold">Select Database University:</span>
                          {uniMatchesForOverview.map((u) => (
                            <button
                              key={u.name}
                              type="button"
                              onClick={() => setForm({ ...form, university: u.name })}
                              className="rounded border border-sky-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0f3a5c] transition hover:bg-sky-100"
                            >
                              {u.name} ({u.country})
                            </button>
                          ))}
                        </div>
                      )}

                      {matchedUniForOverview && Array.isArray(matchedUniForOverview.majors) && matchedUniForOverview.majors.length > 0 && (
                        <div className="sm:col-span-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2 text-[11px] text-emerald-950">
                          <span className="font-bold flex items-center gap-1">
                            <Sparkles size={12} className="text-[#0b7a53]" /> Database Majors for {matchedUniForOverview.name}:
                          </span>
                          {matchedUniForOverview.majors.map((m: string) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setForm({ ...form, program: m })}
                              className="rounded border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-900 transition hover:bg-emerald-100"
                            >
                              + {m}
                            </button>
                          ))}
                        </div>
                      )}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Last Education</label>
                        <input
                          type="text"
                          value={form.assessAcademicLevel || ''}
                          onChange={(e) => setForm({ ...form, assessAcademicLevel: e.target.value })}
                          placeholder="HSC Science / Bachelor"
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">GPA / Results</label>
                        <input
                          type="text"
                          value={form.assessAcademicResults || ''}
                          onChange={(e) => setForm({ ...form, assessAcademicResults: e.target.value })}
                          placeholder="HSC 4.80 / SSC 5.00"
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">English / IELTS</label>
                        <input
                          type="text"
                          value={form.assessLanguage || ''}
                          onChange={(e) => setForm({ ...form, assessLanguage: e.target.value })}
                          placeholder="IELTS 6.0 / MOI"
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section C: Embassy, Visa & Logistics */}
                  <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Embassy, Visa, Hardcopy &amp; Flight Dates
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Embassy Status</label>
                        <select
                          value={form.embassyStatus || 'Pending'}
                          onChange={(e) => setForm({ ...form, embassyStatus: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          {EMBASSY_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Embassy Date</label>
                        <input
                          type="date"
                          value={form.embassyDate || ''}
                          onChange={(e) => setForm({ ...form, embassyDate: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Hardcopy Docs</label>
                        <select
                          value={form.hardcopyStatus || 'Pending'}
                          onChange={(e) => setForm({ ...form, hardcopyStatus: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Received">Received</option>
                          <option value="Verified">Verified</option>
                          <option value="Returned">Returned</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Visa Deadline</label>
                        <input
                          type="date"
                          value={form.visaDeadline || ''}
                          onChange={(e) => setForm({ ...form, visaDeadline: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Departure / Flight Date</label>
                        <input
                          type="date"
                          value={form.departureDate || ''}
                          onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Next Follow-Up</label>
                        <input
                          type="date"
                          value={(form.nextFollowup || '').slice(0, 10)}
                          onChange={(e) => setForm({ ...form, nextFollowup: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Google Drive Link</label>
                        <input
                          type="text"
                          value={form.driveLink || ''}
                          onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section D: Operations, Commercial & Notes */}
                  <section className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Channel (B2C / B2B), Counselor Assignment &amp; Processing Notes
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Channel (B2C / B2B)</label>
                        <select
                          value={form.channelType || 'B2C'}
                          onChange={(e) => setForm({ ...form, channelType: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          <option value="B2C">EduExpress Direct (B2C)</option>
                          <option value="B2B">Partner Agent (B2B)</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Source Acquisition</label>
                        <select
                          value={form.source || 'In-House'}
                          onChange={(e) => setForm({ ...form, source: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        >
                          <option value="office_walkin">🏢 Office Walk-in</option>
                          <option value="whatsapp_direct">💬 WhatsApp Inbound</option>
                          <option value="website_organic">🟢 Website (Organic / SEO)</option>
                          <option value="meta_ads">🟣 Meta Ads (Facebook / Instagram)</option>
                          <option value="b2b_agent">🤝 Partner Agent (B2B)</option>
                          <option value="referral">👥 Personal Referral</option>
                          <option value="In-House">🏢 In-House Direct</option>
                          <option value="B2B">🤝 B2B</option>
                        </select>
                      </div>
                      {isAdmin && (
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">Assigned Counselor</label>
                          <select
                            value={form.assignedEmployeeId || ''}
                            onChange={(e) => setForm({ ...form, assignedEmployeeId: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                          >
                            <option value="">Unassigned</option>
                            {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.empId})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Partner Agency / Reference</label>
                        <input
                          type="text"
                          value={form.referrer || ''}
                          onChange={(e) => setForm({ ...form, referrer: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      {canSeeFinance && (
                        <>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Deposit (৳)</label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={form.deposit || '0'}
                              onChange={(e) => setForm({ ...form, deposit: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs tabular-nums text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-slate-600">Agreed Service Fee (৳)</label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={form.serviceFee || '0'}
                              onChange={(e) => setForm({ ...form, serviceFee: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs tabular-nums text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                            />
                          </div>
                        </>
                      )}
                      <div className="sm:col-span-3">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Application Notes</label>
                        <textarea
                          rows={3}
                          value={form.applicationNotes || ''}
                          onChange={(e) => setForm({ ...form, applicationNotes: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="mb-1 block text-[11px] font-semibold text-slate-600">Medical / Travel Notes</label>
                        <textarea
                          rows={2}
                          value={form.medicalNotes || ''}
                          onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 py-3 backdrop-blur-xs">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f3a5c] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#071c2e] disabled:opacity-60"
                    >
                      <Save size={14} />
                      {saving ? 'Saving...' : 'Save Application File'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Multi-University Applications */}
              {tab === 'universities' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleAddUniversity}
                    className="grid grid-cols-1 gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-6"
                  >
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        required
                        list="drawer-uni-list"
                        value={newUniName}
                        onChange={(e) => setNewUniName(e.target.value)}
                        placeholder="University Name *"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        list="drawer-add-program-list"
                        value={newUniProgram}
                        onChange={(e) => setNewUniProgram(e.target.value)}
                        placeholder="Program / Major"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                      />
                    </div>

                    {uniMatchesForAdd.length > 0 && (
                      <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 p-2.5 text-[11px] text-[#071c2e]">
                        <span className="font-bold">Select Database University:</span>
                        {uniMatchesForAdd.map((u) => (
                          <button
                            key={u.name}
                            type="button"
                            onClick={() => setNewUniName(u.name)}
                            className="rounded border border-sky-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0f3a5c] transition hover:bg-sky-100"
                          >
                            {u.name} ({u.country})
                          </button>
                        ))}
                      </div>
                    )}

                    {matchedUniForAdd && Array.isArray(matchedUniForAdd.majors) && matchedUniForAdd.majors.length > 0 && (
                      <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-[11px] text-emerald-950">
                        <span className="font-bold flex items-center gap-1">
                          <Sparkles size={12} className="text-[#0b7a53]" /> Database Majors for {matchedUniForAdd.name}:
                        </span>
                        {matchedUniForAdd.majors.map((m: string) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setNewUniProgram(m)}
                            className="rounded border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-900 transition hover:bg-emerald-100"
                          >
                            + {m}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newUniAppId}
                        onChange={(e) => setNewUniAppId(e.target.value)}
                        placeholder="Portal Application ID"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <select
                        value={newUniStatus}
                        onChange={(e) => setNewUniStatus(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                      >
                        {TRACKER_UNI_STATUSES.map((st) => (
                          <option key={st.key} value={st.key}>{st.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={addingUni}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#071c2e] disabled:opacity-60"
                      >
                        <Plus size={14} /> Add University
                      </button>
                    </div>
                  </form>

                  {(detail?.universityApps?.length ?? 0) === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                      No per-university submissions recorded yet. Add one above to track individual offers, returns, or rejections.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {(detail?.universityApps ?? []).map((u) => (
                        <div
                          key={u.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 text-xs">{u.university}</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {u.program || 'Program not specified'}
                              {u.applicationId ? ` · ID: ${u.applicationId}` : ''}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={u.status}
                              onChange={(e) => handleUpdateUniStatus(u.id, e.target.value)}
                              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-[#0f3a5c] focus:outline-none"
                            >
                              {TRACKER_UNI_STATUSES.map((st) => (
                                <option key={st.key} value={st.key}>{st.label}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleDeletePortalItem('university', u.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Remove university application"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Document Checklist */}
              {tab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Document Readiness ({app.country})</span>
                        <span className="tabular-nums text-[#0b7a53]">
                          {app.docsReceived} / {app.docsTotal} ({docsPct}%)
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#0b7a53] transition-all"
                          style={{ width: `${docsPct}%` }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={seedingDocs}
                      onClick={handleSeedDocs}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0f3a5c] hover:bg-slate-100 disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={seedingDocs ? 'animate-spin' : ''} />
                      Seed {app.country} Checklist
                    </button>
                  </div>

                  <form onSubmit={handleAddDoc} className="flex gap-2">
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="Add custom required document (e.g. Non-Criminal Certificate, JW202 Form)..."
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={addingDoc || !newDocName.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#071c2e] disabled:opacity-50"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </form>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                    {(detail?.documents?.length ?? 0) === 0 ? (
                      <p className="p-6 text-center text-xs text-slate-500">
                        No documents listed. Click &ldquo;Seed {app.country} Checklist&rdquo; above.
                      </p>
                    ) : (
                      (detail?.documents ?? []).map((doc) => {
                        const safeUpload = toSafeExternalUrl(doc.studentUploadedUrl || doc.fileUrl);
                        return (
                          <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-900">{doc.docType}</span>
                                {safeUpload && (
                                  <a
                                    href={safeUpload}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 hover:underline"
                                  >
                                    File <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                              {doc.notes && <p className="text-[11px] text-slate-500">{doc.notes}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={doc.status}
                                onChange={(e) => handleUpdateDocStatus(doc.id, e.target.value)}
                                className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold focus:outline-none ${
                                  doc.status === 'verified'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : doc.status === 'received'
                                      ? 'border-blue-200 bg-blue-50 text-blue-800'
                                      : doc.status === 'rejected'
                                        ? 'border-rose-200 bg-rose-50 text-rose-800'
                                        : 'border-slate-200 bg-slate-50 text-slate-700'
                                }`}
                              >
                                {TRACKER_DOC_STATUSES.map((s) => (
                                  <option key={s.key} value={s.key}>{s.label}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => handleDeletePortalItem('document', doc.id)}
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                title="Delete document item"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Finance-Admin-Only Linked Finance Ledger */}
              {tab === 'finance' && canSeeFinance && detail?.finance && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Cash Received</p>
                      <p className="mt-1 font-heading text-lg font-bold tabular-nums text-emerald-950">
                        {formatBdt(detail.finance.receivedTotal)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">Direct Expenses</p>
                      <p className="mt-1 font-heading text-lg font-bold tabular-nums text-rose-950">
                        {formatBdt(detail.finance.spentTotal)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">Net File Margin</p>
                      <p className="mt-1 font-heading text-lg font-bold tabular-nums text-slate-900">
                        {formatBdt(detail.finance.netTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      Linked Ledger Entries ({detail.finance.incomes.length} income · {detail.finance.expenses.length} expense)
                    </h3>
                    <Link
                      href="/admin/finance"
                      className="text-xs font-bold text-[#0f3a5c] hover:underline"
                    >
                      Open Finance Console →
                    </Link>
                  </div>

                  {detail.finance.incomes.length === 0 && detail.finance.expenses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                      No cash transactions linked to {app.leadRef || app.name} yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full min-w-[420px] text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                          <tr>
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Category / Notes</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detail.finance.incomes.map((inc) => (
                            <tr key={`in-${inc.id}`}>
                              <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{inc.date}</td>
                              <td className="px-3 py-2">
                                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                  IN
                                </span>
                              </td>
                              <td className="px-3 py-2 text-slate-800">
                                <div className="font-semibold">{inc.category || 'Student Fee'}</div>
                                {inc.notes && <div className="text-[11px] text-slate-500">{inc.notes}</div>}
                              </td>
                              <td className="px-3 py-2 text-right font-bold tabular-nums text-emerald-700">
                                +{formatBdt(inc.amount)}
                              </td>
                            </tr>
                          ))}
                          {detail.finance.expenses.map((exp) => (
                            <tr key={`ex-${exp.id}`}>
                              <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{exp.date}</td>
                              <td className="px-3 py-2">
                                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                                  OUT
                                </span>
                              </td>
                              <td className="px-3 py-2 text-slate-800">
                                <div className="font-semibold">{exp.category || 'Expense'}</div>
                                {(exp.paidTo || exp.notes) && (
                                  <div className="text-[11px] text-slate-500">
                                    {[exp.paidTo, exp.notes].filter(Boolean).join(' · ')}
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right font-bold tabular-nums text-rose-700">
                                -{formatBdt(exp.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Activity Timeline & Notes */}
              {tab === 'timeline' && (
                <div className="space-y-4">
                  {app && (
                    <QuickInteractionLogger
                      leadId={app.id}
                      leadName={app.name}
                      phone={app.phone}
                      currentStatus={app.status}
                      currentFollowup={app.nextFollowup}
                      isApplication
                      onLeadUpdated={() => {
                        refreshDetail();
                      }}
                    />
                  )}

                  <form onSubmit={handlePostNote} className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNoteMode('add_note')}
                        className={`rounded-lg px-3 py-1 text-[11px] font-bold ${
                          noteMode === 'add_note'
                            ? 'bg-[#0f3a5c] text-white'
                            : 'border border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Internal Team Note
                      </button>
                      <button
                        type="button"
                        onClick={() => setNoteMode('reply_student')}
                        className={`rounded-lg px-3 py-1 text-[11px] font-bold ${
                          noteMode === 'reply_student'
                            ? 'bg-emerald-700 text-white'
                            : 'border border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Visible Student Update
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder={
                        noteMode === 'reply_student'
                          ? 'Write an update visible on the student live /track/ portal...'
                          : 'Log internal processing note, embassy call outcome, or agent follow-up...'
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingNote || !noteText.trim()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#071c2e] disabled:opacity-50"
                      >
                        <Send size={12} /> {sendingNote ? 'Posting...' : 'Post Entry'}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {(detail?.activities?.length ?? 0) === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-500">No activity events recorded yet.</p>
                    ) : (
                      (detail?.activities ?? []).map((ev) => (
                        <div key={ev.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold capitalize text-slate-900">
                              {ev.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">{formatDhakaStamp(ev.createdAt)}</span>
                          </div>
                          {(ev.fromValue || ev.toValue) && (
                            <p className="mt-1 text-[11px] text-slate-600">
                              {ev.fromValue ? `${ev.fromValue} → ` : ''}
                              <strong className="text-slate-800">{ev.toValue}</strong>
                            </p>
                          )}
                          {ev.details && <p className="mt-1 whitespace-pre-wrap text-slate-700">{ev.details}</p>}
                          {ev.actorName && (
                            <p className="mt-1 text-[10px] font-medium text-slate-400">By {ev.actorName}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <datalist id="drawer-uni-list">
        {universities.map((u: string) => (
          <option key={u} value={u} />
        ))}
      </datalist>
      <datalist id="drawer-overview-program-list">
        {overviewSuggestedMajors.map((p: string) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="drawer-add-program-list">
        {addUniSuggestedMajors.map((p: string) => (
          <option key={p} value={p} />
        ))}
      </datalist>
    </div>
  );
}

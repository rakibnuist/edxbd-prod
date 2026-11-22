'use client';

import { useMemo, useState } from 'react';
import {
  FilePlus2,
  FolderOpen,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  APPLICATION_TRACKER_STAGES,
  DEGREE_OPTIONS,
  DESTINATION_OPTIONS,
  EMBASSY_STATUSES,
  INTAKE_SESSION_OPTIONS,
  INTAKE_YEAR_OPTIONS,
  composeIntakeTerm,
  extractIntakeSession,
  extractIntakeYear,
} from '@/lib/application-tracker';

export interface TrackerEmployeeOption {
  id: string;
  empId: string;
  name: string;
  team: string;
}

export interface PromotableLeadOption {
  id: string;
  leadRef: string | null;
  name: string;
  phone: string;
  email: string;
  country: string;
  assessIntake: string | null;
  university: string | null;
  degree: string | null;
  program: string | null;
  assignedTo: string | null;
  status: string;
  leadMarket: string;
}

interface NewApplicationModalProps {
  open: boolean;
  isAdmin: boolean;
  employees: TrackerEmployeeOption[];
  intakes: string[];
  destinations: string[];
  universities: string[];
  referrers: string[];
  promotableLeads: PromotableLeadOption[];
  onClose: () => void;
  onCreated: (createdId: string) => void;
}

export default function NewApplicationModal({
  open,
  isAdmin,
  employees,
  destinations,
  universities,
  referrers,
  promotableLeads,
  onClose,
  onCreated,
}: NewApplicationModalProps) {
  const { authenticatedFetch } = useAuth();
  const [mode, setMode] = useState<'new' | 'promote'>('new');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Promote existing lead state
  const [leadQuery, setLeadQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');

  // Shared / New student fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationality, setNationality] = useState('Bangladesh');
  const [passport, setPassport] = useState('');
  const [country, setCountry] = useState('China');
  const [intakeSession, setIntakeSession] = useState<string>('March');
  const [intakeYear, setIntakeYear] = useState<string>('2027');
  const [degree, setDegree] = useState('Bachelor');
  const [program, setProgram] = useState('');
  const [university, setUniversity] = useState('');
  const [applicationStage, setApplicationStage] = useState('documents');
  const [embassyStatus, setEmbassyStatus] = useState('Pending');
  const [channelType, setChannelType] = useState('B2C');
  const [referrer, setReferrer] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');
  const [deposit, setDeposit] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [applicationNotes, setApplicationNotes] = useState('');

  const filteredPromotable = useMemo(() => {
    const q = leadQuery.trim().toLowerCase();
    if (!q) return promotableLeads.slice(0, 30);
    return promotableLeads
      .filter((l) =>
        [l.name, l.phone, l.email, l.country, l.leadRef, l.university].some(
          (v) => v && v.toLowerCase().includes(q),
        ),
      )
      .slice(0, 30);
  }, [promotableLeads, leadQuery]);

  const selectedLead = useMemo(
    () => promotableLeads.find((l) => l.id === selectedLeadId) || null,
    [promotableLeads, selectedLeadId],
  );

  if (!open) return null;

  const destinationList = Array.from(new Set([...DESTINATION_OPTIONS, ...destinations]));

  const handleSelectLead = (lead: PromotableLeadOption) => {
    setSelectedLeadId(lead.id);
    if (lead.country) setCountry(lead.country);
    if (lead.assessIntake) {
      const parsedYear = extractIntakeYear(lead.assessIntake);
      const parsedSession = extractIntakeSession(lead.assessIntake);
      if (parsedYear !== 'Unscheduled') setIntakeYear(parsedYear);
      if (parsedSession !== 'Other') setIntakeSession(parsedSession);
    }
    if (lead.degree) setDegree(lead.degree);
    if (lead.program) setProgram(lead.program);
    if (lead.university) setUniversity(lead.university);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'promote' && !selectedLeadId) {
      setError('Select a student lead to open an application file.');
      return;
    }
    if (mode === 'new' && !name.trim()) {
      setError('Student full name is required.');
      return;
    }

    const composedIntake = composeIntakeTerm(intakeSession, intakeYear);

    try {
      setSubmitting(true);
      const payload: Record<string, unknown> =
        mode === 'promote'
          ? {
              existingLeadId: selectedLeadId,
              country,
              assessIntake: composedIntake,
              degree: degree.trim() || null,
              program: program.trim() || null,
              university: university.trim() || null,
              passport: passport.trim() || null,
              nationality: nationality.trim() || null,
              applicationStage,
              embassyStatus,
              channelType,
              referrer: referrer.trim() || null,
              deposit: deposit ? Number(deposit) : 0,
              driveLink: driveLink.trim() || null,
              applicationNotes: applicationNotes.trim() || null,
              ...(isAdmin && assignedEmployeeId ? { assignedEmployeeId } : {}),
            }
          : {
              name: name.trim(),
              phone: phone.trim() || '—',
              email: email.trim() || undefined,
              nationality: nationality.trim() || 'Bangladesh',
              passport: passport.trim() || null,
              country,
              assessIntake: composedIntake,
              degree: degree.trim() || null,
              program: program.trim() || null,
              university: university.trim() || null,
              applicationStage,
              embassyStatus,
              leadMarket: 'Bangladesh',
              channelType,
              source: channelType === 'B2B' ? 'B2B' : 'In-House',
              referrer: referrer.trim() || null,
              assignedEmployeeId: isAdmin && assignedEmployeeId ? assignedEmployeeId : undefined,
              deposit: deposit ? Number(deposit) : 0,
              driveLink: driveLink.trim() || null,
              applicationNotes: applicationNotes.trim() || null,
            };

      const res = await authenticatedFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || json.message || 'Could not create application file.');
        return;
      }

      onCreated(json.id);
      onClose();
    } catch {
      setError('Network error while creating application file.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#071c2e] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-emerald-300">
              <FilePlus2 size={18} />
            </span>
            <div>
              <h2 className="font-heading text-base font-bold tracking-tight">Open Student Application File</h2>
              <p className="text-[11px] text-slate-300">
                Register a direct (B2C) or partner agent (B2B) application file with separate Intake &amp; Year tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setMode('new');
              setError(null);
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 pb-2.5 text-xs font-bold transition ${
              mode === 'new'
                ? 'border-[#0f3a5c] text-[#071c2e]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus size={14} />
            New Student File
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('promote');
              setError(null);
            }}
            className={`inline-flex items-center gap-2 border-b-2 px-4 pb-2.5 text-xs font-bold transition ${
              mode === 'promote'
                ? 'border-[#0f3a5c] text-[#071c2e]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen size={14} />
            Promote Existing CRM Lead ({promotableLeads.length})
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
              {error}
            </div>
          )}

          {mode === 'promote' ? (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={leadQuery}
                  onChange={(e) => setLeadQuery(e.target.value)}
                  placeholder="Search CRM leads by student name, phone, email, country..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
              <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {filteredPromotable.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">No matching CRM leads found.</p>
                ) : (
                  filteredPromotable.map((lead) => {
                    const active = selectedLeadId === lead.id;
                    return (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => handleSelectLead(lead)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition ${
                          active
                            ? 'border-[#0f3a5c] bg-[#0f3a5c]/5 ring-1 ring-[#0f3a5c]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate font-bold text-slate-900">{lead.name}</div>
                          <div className="truncate text-[11px] text-slate-500">
                            {lead.phone} · {lead.country} {lead.assessIntake ? `· ${lead.assessIntake}` : ''}
                          </div>
                        </div>
                        <span className="ml-2 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                          {lead.status.replace(/_/g, ' ')}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              {selectedLead && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-900">
                  Selected: <strong>{selectedLead.name}</strong> ({selectedLead.phone}) — confirm intake session, year, channel &amp; counselor below.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MD Tanvir Rahman"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+88017..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@email.com (optional)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value.toUpperCase())}
                  placeholder="A01234567"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Nationality
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Bangladesh"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Academic & Pipeline Details (Separate Intake Session + Intake Year!) */}
          <div className="grid grid-cols-1 gap-3.5 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Destination *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {destinationList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Intake Session *
              </label>
              <select
                value={intakeSession}
                onChange={(e) => setIntakeSession(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {INTAKE_SESSION_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Intake Year *
              </label>
              <select
                value={intakeYear}
                onChange={(e) => setIntakeYear(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold tabular-nums text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {INTAKE_YEAR_OPTIONS.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Degree Level
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {DEGREE_OPTIONS.map((deg) => (
                  <option key={deg} value={deg}>{deg}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Major / Program
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="Computer Science / Accounting & Finance / MBBS"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Primary University
              </label>
              <input
                list="tracker-uni-list"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. NJIT / HIT / Changchun University of Science and Technology"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
              <datalist id="tracker-uni-list">
                {universities.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Channel (B2C / B2B) *
              </label>
              <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                <option value="B2C">EduExpress Direct (B2C)</option>
                <option value="B2B">Partner Agent (B2B)</option>
              </select>
            </div>

            {isAdmin && (
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned Counselor
                </label>
                <select
                  value={assignedEmployeeId}
                  onChange={(e) => setAssignedEmployeeId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
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
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Partner Agency / Reference
              </label>
              <input
                list="tracker-referrer-list"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
                placeholder="BheUni / Taufiq / Direct"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
              <datalist id="tracker-referrer-list">
                {referrers.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Initial Pipeline Stage
              </label>
              <select
                value={applicationStage}
                onChange={(e) => setApplicationStage(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {APPLICATION_TRACKER_STAGES.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Embassy Status
              </label>
              <select
                value={embassyStatus}
                onChange={(e) => setEmbassyStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              >
                {EMBASSY_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Deposit (৳ BDT)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs tabular-nums text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Google Drive Folder Link
              </label>
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Internal Processing Notes
              </label>
              <textarea
                rows={2}
                value={applicationNotes}
                onChange={(e) => setApplicationNotes(e.target.value)}
                placeholder="Scholarship target, pending documents, embassy instructions..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f3a5c] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#071c2e] disabled:opacity-60"
            >
              <FilePlus2 size={14} />
              {submitting
                ? 'Creating...'
                : mode === 'promote'
                  ? 'Promote to Application Tracker'
                  : 'Create Application File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

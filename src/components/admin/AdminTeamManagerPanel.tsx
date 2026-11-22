'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  UserCheck,
  Users2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { teamMembers as canonicalTeamDefaults } from '@/data/teamMembers';

interface AdminEmployeeRow {
  id: string;
  empId: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  team: string;
  specialization: string | null;
  salary?: number | null;
  active: boolean;
  userId?: string | null;
  _count?: { leads: number; tasks: number };
}

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  employee?: { id: string; empId: string; name: string; role: string; team: string } | null;
}

interface PublicTeamMemberRow {
  id: string;
  slug: string;
  name: string;
  role: string;
  shortRole?: string | null;
  bio?: string | null;
  specialties: string[];
  photoUrl?: string | null;
  consentConfirmedAt?: string | null;
  isPublished: boolean;
  displayOrder: number;
}

interface UnifiedTeamMember {
  key: string;
  employee: AdminEmployeeRow | null;
  user: AdminUserRow | null;
  publicProfile: PublicTeamMemberRow | null;
  name: string;
  empId: string;
  designation: string;
  team: string;
  phone: string;
  workEmail: string;
  loginEmail: string;
  loginRole: string;
  photoUrl: string;
  isPublished: boolean;
  active: boolean;
}

interface EditorFormState {
  mode: 'create' | 'edit';
  employeeId?: string;
  userId?: string;
  publicId?: string;
  name: string;
  empId: string;
  designation: string;
  team: string;
  phone: string;
  workEmail: string;
  active: boolean;
  // CRM access
  enableLogin: boolean;
  loginEmail: string;
  loginRole: 'counselor' | 'admin' | 'super_admin';
  loginPassword: string;
  // Public Website bio & photo
  syncPublicProfile: boolean;
  isPublished: boolean;
  slug: string;
  shortRole: string;
  bio: string;
  specialtiesText: string;
  photoUrl: string;
  consentConfirmedAt: string;
  displayOrder: number;
}

const DESIGNATION_SUGGESTIONS = [
  'Founder & CEO',
  'Managing Director',
  'Business Development Manager',
  'Senior Consultant',
  'Consultant',
  'Files & Visa Processing Executive',
  'Creative Designer & Video Editor',
];

const STUDIO_PORTRAIT_PRESETS = canonicalTeamDefaults.map((m) => ({
  label: m.name,
  url: m.image,
}));

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const todayIso = () => new Date().toISOString().slice(0, 10);

const normalizeKey = (value?: string | null) =>
  (value || '').trim().toLowerCase().replace(/\s+/g, ' ');

function findDefaultProfile(name: string, email?: string | null) {
  const n = normalizeKey(name);
  const e = normalizeKey(email);
  return (
    canonicalTeamDefaults.find(
      (item) => normalizeKey(item.name) === n || (e && normalizeKey(item.email) === e),
    ) || null
  );
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] || ''}${parts.at(-1)?.[0] || ''}`.toUpperCase() || '?';
}

export default function AdminTeamManagerPanel({
  onChanged,
  compact = false,
}: {
  onChanged?: () => void;
  compact?: boolean;
}) {
  const { user: currentUser, authenticatedFetch } = useAuth();
  const [employees, setEmployees] = useState<AdminEmployeeRow[]>([]);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [publicProfiles, setPublicProfiles] = useState<PublicTeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [editor, setEditor] = useState<EditorFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    member: UnifiedTeamMember;
    removeLogin: boolean;
    removePublic: boolean;
  } | null>(null);

  const applyRosterFetch = useCallback(async () => {
    const [empRes, userRes, trustRes] = await Promise.all([
      authenticatedFetch('/api/admin/employees'),
      authenticatedFetch('/api/admin/users'),
      authenticatedFetch('/api/admin/trust'),
    ]);
    return {
      employees: empRes.ok ? ((await empRes.json()).employees ?? []) : null,
      users: userRes.ok ? ((await userRes.json()).users ?? []) : null,
      team: trustRes.ok ? ((await trustRes.json()).team ?? []) : null,
    };
  }, [authenticatedFetch]);

  const loadRoster = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applyRosterFetch();
      if (Array.isArray(data.employees)) setEmployees(data.employees);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.team)) setPublicProfiles(data.team);
    } catch {
      setBanner({ tone: 'error', text: 'Failed to load unified team roster.' });
    } finally {
      setLoading(false);
    }
  }, [applyRosterFetch]);

  useEffect(() => {
    let active = true;
    applyRosterFetch()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data.employees)) setEmployees(data.employees);
        if (Array.isArray(data.users)) setUsers(data.users);
        if (Array.isArray(data.team)) setPublicProfiles(data.team);
      })
      .catch(() => {
        if (active) setBanner({ tone: 'error', text: 'Failed to load unified team roster.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applyRosterFetch]);

  const unifiedTeam = useMemo<UnifiedTeamMember[]>(() => {
    const matchedUserIds = new Set<string>();
    const matchedPublicIds = new Set<string>();

    const rows: UnifiedTeamMember[] = employees.map((emp) => {
      const linkedUser =
        users.find(
          (u) =>
            u.employee?.id === emp.id ||
            (emp.userId && u.id === emp.userId) ||
            normalizeKey(u.name) === normalizeKey(emp.name) ||
            (emp.email && normalizeKey(u.email) === normalizeKey(emp.email)),
        ) || null;
      if (linkedUser) matchedUserIds.add(linkedUser.id);

      const empSlug = slugify(emp.name);
      const linkedPublic =
        publicProfiles.find(
          (p) =>
            p.slug === empSlug ||
            normalizeKey(p.name) === normalizeKey(emp.name),
        ) || null;
      if (linkedPublic) matchedPublicIds.add(linkedPublic.id);

      const fallback = findDefaultProfile(emp.name, emp.email);

      return {
        key: `emp:${emp.id}`,
        employee: emp,
        user: linkedUser,
        publicProfile: linkedPublic,
        name: emp.name,
        empId: emp.empId,
        designation: emp.role || linkedPublic?.role || 'Consultant',
        team: emp.team || 'china',
        phone: emp.phone || fallback?.phone || '',
        workEmail: emp.email || fallback?.email || linkedUser?.email || '',
        loginEmail: linkedUser?.email || '',
        loginRole: linkedUser?.role || '',
        photoUrl: linkedPublic?.photoUrl || fallback?.image || '',
        isPublished: Boolean(linkedPublic?.isPublished),
        active: emp.active !== false,
      };
    });

    // Include any standalone public profiles not yet matched to an employee row
    for (const pub of publicProfiles) {
      if (matchedPublicIds.has(pub.id)) continue;
      const linkedUser =
        users.find(
          (u) => !matchedUserIds.has(u.id) && normalizeKey(u.name) === normalizeKey(pub.name),
        ) || null;
      if (linkedUser) matchedUserIds.add(linkedUser.id);

      const fallback = findDefaultProfile(pub.name, linkedUser?.email);
      rows.push({
        key: `pub:${pub.id}`,
        employee: null,
        user: linkedUser,
        publicProfile: pub,
        name: pub.name,
        empId: fallback?.empId || 'PUB',
        designation: pub.role,
        team: fallback?.team || 'general',
        phone: fallback?.phone || '',
        workEmail: fallback?.email || linkedUser?.email || '',
        loginEmail: linkedUser?.email || '',
        loginRole: linkedUser?.role || '',
        photoUrl: pub.photoUrl || fallback?.image || '',
        isPublished: pub.isPublished,
        active: true,
      });
    }

    return rows.sort((a, b) => {
      const aOrder = a.publicProfile?.displayOrder ?? 99;
      const bOrder = b.publicProfile?.displayOrder ?? 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.empId.localeCompare(b.empId);
    });
  }, [employees, users, publicProfiles]);

  const openCreateModal = () => {
    setBanner(null);
    setEditor({
      mode: 'create',
      name: '',
      empId: '',
      designation: 'Consultant',
      team: 'china',
      phone: '+8801',
      workEmail: '',
      active: true,
      enableLogin: true,
      loginEmail: '',
      loginRole: 'counselor',
      loginPassword: '',
      syncPublicProfile: true,
      isPublished: true,
      slug: '',
      shortRole: '',
      bio: '',
      specialtiesText: 'Admissions Counseling\nUniversity Shortlisting',
      photoUrl: '',
      consentConfirmedAt: todayIso(),
      displayOrder: unifiedTeam.length + 1,
    });
  };

  const openEditModal = (member: UnifiedTeamMember) => {
    setBanner(null);
    const fallback = findDefaultProfile(member.name, member.workEmail);
    const pub = member.publicProfile;
    const roleChoice = (member.loginRole || 'counselor') as 'counselor' | 'admin' | 'super_admin';

    setEditor({
      mode: 'edit',
      employeeId: member.employee?.id,
      userId: member.user?.id,
      publicId: pub?.id,
      name: member.name,
      empId: member.employee?.empId || member.empId,
      designation: member.designation,
      team: member.team,
      phone: member.phone,
      workEmail: member.workEmail,
      active: member.active,
      enableLogin: Boolean(member.user),
      loginEmail: member.user?.email || member.workEmail,
      loginRole: ['counselor', 'admin', 'super_admin'].includes(roleChoice) ? roleChoice : 'counselor',
      loginPassword: '',
      syncPublicProfile: Boolean(pub),
      isPublished: pub?.isPublished ?? true,
      slug: pub?.slug || slugify(member.name),
      shortRole: pub?.shortRole || fallback?.shortRole || '',
      bio: pub?.bio || fallback?.bio || '',
      specialtiesText: (pub?.specialties?.length ? pub.specialties : fallback?.specialties || []).join('\n'),
      photoUrl: pub?.photoUrl || fallback?.image || '',
      consentConfirmedAt: pub?.consentConfirmedAt ? pub.consentConfirmedAt.slice(0, 10) : todayIso(),
      displayOrder: pub?.displayOrder ?? unifiedTeam.indexOf(member) + 1,
    });
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editor) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'team');
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBanner({ tone: 'error', text: data.error || 'Photo upload failed.' });
        return;
      }
      setEditor((prev) =>
        prev
          ? {
              ...prev,
              photoUrl: data.imageUrl || prev.photoUrl,
              syncPublicProfile: true,
              consentConfirmedAt: prev.consentConfirmedAt || todayIso(),
            }
          : null,
      );
    } catch {
      setBanner({ tone: 'error', text: 'Network error uploading portrait photo.' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    const trimmedName = editor.name.trim();
    const trimmedDesignation = editor.designation.trim();
    if (!trimmedName || !trimmedDesignation) {
      setBanner({ tone: 'error', text: 'Full name and designation are required.' });
      return;
    }

    if (editor.enableLogin) {
      const targetEmail = editor.loginEmail.trim();
      if (!targetEmail) {
        setBanner({ tone: 'error', text: 'CRM login email is required when CRM login is enabled.' });
        return;
      }
      if (!editor.userId && editor.loginPassword.length < 12) {
        setBanner({
          tone: 'error',
          text: 'Initial CRM password must be at least 12 characters long when creating a new login.',
        });
        return;
      }
      if (editor.userId && editor.loginPassword.length > 0 && editor.loginPassword.length < 12) {
        setBanner({
          tone: 'error',
          text: 'New CRM password must be at least 12 characters long.',
        });
        return;
      }
    }

    setSaving(true);
    setBanner(null);

    try {
      let savedEmployeeId = editor.employeeId;

      // 1. Save / Create Employee roster record
      if (savedEmployeeId) {
        const empRes = await authenticatedFetch('/api/admin/employees', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: savedEmployeeId,
            empId: editor.empId.trim() || undefined,
            name: trimmedName,
            role: trimmedDesignation,
            team: editor.team,
            phone: editor.phone.trim(),
            email: editor.workEmail.trim().toLowerCase(),
            active: editor.active,
          }),
        });
        const empData = await empRes.json().catch(() => ({}));
        if (!empRes.ok) throw new Error(empData.error || 'Could not update staff record.');
      } else {
        const empRes = await authenticatedFetch('/api/admin/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            empId: editor.empId.trim() || undefined,
            name: trimmedName,
            role: trimmedDesignation,
            team: editor.team,
            phone: editor.phone.trim() || undefined,
            email: editor.workEmail.trim().toLowerCase() || undefined,
            active: editor.active,
          }),
        });
        const empData = await empRes.json().catch(() => ({}));
        if (!empRes.ok) throw new Error(empData.error || 'Could not create staff record.');
        savedEmployeeId = empData.id;
      }

      // 2. Sync CRM Login account if enabled
      if (editor.enableLogin) {
        const targetEmail = editor.loginEmail.trim().toLowerCase();
        if (editor.userId) {
          const payload: Record<string, unknown> = {
            name: trimmedName,
            email: targetEmail,
            employeeId: savedEmployeeId || null,
          };
          if (currentUser?.role === 'super_admin' || editor.loginRole !== 'super_admin') {
            payload.role = editor.loginRole;
          }
          if (editor.loginPassword.trim()) {
            payload.password = editor.loginPassword.trim();
          }
          const userRes = await authenticatedFetch(`/api/admin/users/${editor.userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const userData = await userRes.json().catch(() => ({}));
          if (!userRes.ok) {
            throw new Error(userData.message || 'Staff saved, but CRM login update failed.');
          }
        } else {
          const userRes = await authenticatedFetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: trimmedName,
              email: targetEmail,
              password: editor.loginPassword.trim(),
              role: editor.loginRole === 'super_admin' ? 'admin' : editor.loginRole,
              employeeId: savedEmployeeId,
            }),
          });
          const userData = await userRes.json().catch(() => ({}));
          if (!userRes.ok) {
            throw new Error(userData.message || 'Staff saved, but CRM login creation failed.');
          }
        }
      }

      // 3. Sync Public Website profile (/about & /education-consultant-dhaka)
      if (editor.syncPublicProfile) {
        const finalSlug = slugify(editor.slug || trimmedName) || slugify(`${trimmedName}-${Date.now()}`);
        const specialtiesList = editor.specialtiesText
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter(Boolean);
        const trustPayload = {
          kind: 'team',
          id: editor.publicId,
          slug: finalSlug,
          name: trimmedName,
          role: trimmedDesignation,
          shortRole: editor.shortRole.trim(),
          bio: editor.bio.trim(),
          specialties: specialtiesList,
          photoUrl: editor.photoUrl.trim(),
          consentConfirmedAt: editor.isPublished
            ? editor.consentConfirmedAt || todayIso()
            : editor.consentConfirmedAt || null,
          isPublished: editor.isPublished,
          displayOrder: Number(editor.displayOrder) || 0,
        };

        const trustRes = await authenticatedFetch('/api/admin/trust', {
          method: editor.publicId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trustPayload),
        });
        const trustData = await trustRes.json().catch(() => ({}));
        if (!trustRes.ok) {
          throw new Error(trustData.error || 'Staff saved, but public profile sync failed.');
        }
      }

      setEditor(null);
      setBanner({
        tone: 'success',
        text: `${trimmedName} synced cleanly across Staff Roster${editor.enableLogin ? ', CRM Access' : ''}${editor.syncPublicProfile ? ', and Public Website' : ''}.`,
      });
      await loadRoster();
      onChanged?.();
    } catch (err) {
      setBanner({
        tone: 'error',
        text: err instanceof Error ? err.message : 'Failed to save team member.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { member, removeLogin, removePublic } = deleteTarget;

    if (member.user?.id && member.user.id === currentUser?.id) {
      setBanner({ tone: 'error', text: 'Cannot delete your own active admin account.' });
      setDeleteTarget(null);
      return;
    }

    setDeletingKey(member.key);
    setBanner(null);

    try {
      if (member.employee?.id) {
        const empRes = await authenticatedFetch(
          `/api/admin/employees?id=${encodeURIComponent(member.employee.id)}`,
          { method: 'DELETE' },
        );
        const empData = await empRes.json().catch(() => ({}));
        if (!empRes.ok) throw new Error(empData.error || 'Could not remove employee record.');
      }

      if (removeLogin && member.user?.id) {
        const userRes = await authenticatedFetch(`/api/admin/users/${member.user.id}`, {
          method: 'DELETE',
        });
        if (!userRes.ok) {
          const userData = await userRes.json().catch(() => ({}));
          throw new Error(userData.message || 'Employee deleted, but CRM user could not be deleted.');
        }
      }

      if (removePublic && member.publicProfile?.id) {
        const pubRes = await authenticatedFetch(
          `/api/admin/trust?kind=team&id=${encodeURIComponent(member.publicProfile.id)}`,
          { method: 'DELETE' },
        );
        if (!pubRes.ok) {
          throw new Error('Staff deleted, but public team bio could not be deleted.');
        }
      }

      setDeleteTarget(null);
      setBanner({ tone: 'success', text: `Removed ${member.name} cleanly.` });
      await loadRoster();
      onChanged?.();
    } catch (err) {
      setBanner({
        tone: 'error',
        text: err instanceof Error ? err.message : 'Delete failed.',
      });
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users2 size={18} className="text-[#0f3a5c]" />
            <h2 className="font-heading text-lg font-bold text-slate-900">
              EduExpress Team Directory &amp; Public Sync
            </h2>
            <span className="rounded-full bg-[#0f3a5c]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0f3a5c]">
              {unifiedTeam.length} Members
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Single source for Public Website profiles, CRM logins, and Counselor KPI / Application routing. Add, edit portraits, or remove members directly here.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void loadRoster()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href="/about#team"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Public Team <ExternalLink size={12} />
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
          >
            <UserCheck size={13} /> Full Users &amp; Passwords
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#124b7a]"
          >
            <Plus size={14} /> Add Team Member
          </button>
        </div>
      </div>

      {banner && (
        <div
          className={`mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold ${
            banner.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={15} />
            {banner.text}
          </span>
          <button type="button" onClick={() => setBanner(null)} aria-label="Dismiss notice">
            <X size={14} />
          </button>
        </div>
      )}

      {loading && unifiedTeam.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-xs font-semibold text-slate-500">
          <Loader2 size={16} className="mr-2 animate-spin" /> Loading team directory...
        </div>
      ) : (
        <div
          className={`mt-5 grid gap-3.5 ${
            compact ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {unifiedTeam.map((member) => {
            const isSelf = Boolean(member.user?.id && member.user.id === currentUser?.id);
            return (
              <article
                key={member.key}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition hover:shadow-sm ${
                  member.active
                    ? 'border-slate-200 bg-slate-50/60'
                    : 'border-slate-200/70 bg-slate-100/60 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-[#0f3a5c] ring-1 ring-slate-200">
                      {member.photoUrl ? (
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          fill
                          unoptimized={member.photoUrl.startsWith('http')}
                          className="object-cover object-top"
                          sizes="64px"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center font-heading text-sm font-bold text-[#a9d6ee]">
                          {initialsOf(member.name)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {member.empId} · {member.team.toUpperCase()}
                        </span>
                        {member.isPublished ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Eye size={10} /> Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            <EyeOff size={10} /> Hidden
                          </span>
                        )}
                      </div>
                      <h3 className="mt-0.5 truncate text-sm font-bold text-slate-900" title={member.name}>
                        {member.name}
                      </h3>
                      <p className="truncate text-[11px] font-semibold text-[#0f3a5c]" title={member.designation}>
                        {member.designation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                    {member.phone && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Phone size={11} className="shrink-0 text-slate-400" />
                        <span className="font-mono">{member.phone}</span>
                      </p>
                    )}
                    {member.workEmail && (
                      <p className="flex items-center gap-1.5 truncate" title={member.workEmail}>
                        <Mail size={11} className="shrink-0 text-slate-400" />
                        <span className="truncate">{member.workEmail}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 truncate">
                      <Shield size={11} className="shrink-0 text-slate-400" />
                      {member.user ? (
                        <span className="truncate font-semibold text-emerald-700" title={member.user.email}>
                          CRM: {member.user.role.replace('_', ' ')} ({member.user.email})
                        </span>
                      ) : (
                        <span className="text-amber-700">No CRM login linked</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-200/80 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-800 transition hover:bg-slate-100"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  {!isSelf && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          member,
                          removeLogin: Boolean(member.user),
                          removePublic: Boolean(member.publicProfile),
                        })
                      }
                      disabled={deletingKey === member.key}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                      title="Delete team member"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Unified Add / Edit Modal */}
      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEditor}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#0f3a5c]">
                  {editor.mode === 'create' ? 'Add New Team Member' : `Edit ${editor.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Changes sync across Staff Roster, CRM access, and Public Website team cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[180px_1fr]">
              {/* Portrait Column */}
              <div className="space-y-3">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#0f3a5c]">
                  {editor.photoUrl ? (
                    <Image
                      src={editor.photoUrl}
                      alt={editor.name || 'Portrait preview'}
                      fill
                      unoptimized={editor.photoUrl.startsWith('http')}
                      className="object-cover object-top"
                      sizes="180px"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-heading text-3xl font-bold text-[#a9d6ee]">
                      {initialsOf(editor.name || 'New')}
                    </span>
                  )}
                </div>
                <label className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100">
                  {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                  {uploadingPhoto ? 'Uploading...' : 'Upload Portrait'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Studio Preset / URL
                  </label>
                  <select
                    value={STUDIO_PORTRAIT_PRESETS.some((p) => p.url === editor.photoUrl) ? editor.photoUrl : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setEditor((prev) =>
                          prev
                            ? {
                                ...prev,
                                photoUrl: e.target.value,
                                consentConfirmedAt: prev.consentConfirmedAt || todayIso(),
                              }
                            : null,
                        );
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px]"
                  >
                    <option value="">Choose studio portrait...</option>
                    {STUDIO_PORTRAIT_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editor.photoUrl}
                    onChange={(e) => setEditor({ ...editor, photoUrl: e.target.value })}
                    placeholder="/images/team/..."
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-[11px]"
                  />
                </div>
              </div>

              {/* Details Column */}
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editor.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditor((prev) =>
                          prev
                            ? {
                                ...prev,
                                name: val,
                                slug: prev.mode === 'create' ? slugify(val) : prev.slug,
                              }
                            : null,
                        );
                      }}
                      placeholder="e.g. Shamoyla Narmin"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Staff ID (optional on add)</label>
                    <input
                      type="text"
                      value={editor.empId}
                      onChange={(e) => setEditor({ ...editor, empId: e.target.value.toUpperCase() })}
                      placeholder="Auto (e.g. E-10)"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Designation *</label>
                    <input
                      type="text"
                      required
                      value={editor.designation}
                      onChange={(e) => setEditor({ ...editor, designation: e.target.value })}
                      placeholder="e.g. Senior Consultant"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {DESIGNATION_SUGGESTIONS.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setEditor({ ...editor, designation: sug })}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${
                            editor.designation === sug
                              ? 'bg-[#0f3a5c] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">WhatsApp / Phone</label>
                    <input
                      type="text"
                      value={editor.phone}
                      onChange={(e) => setEditor({ ...editor, phone: e.target.value })}
                      placeholder="+8801..."
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      value={editor.workEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditor((prev) =>
                          prev
                            ? {
                                ...prev,
                                workEmail: val,
                                loginEmail: prev.mode === 'create' || !prev.userId ? val : prev.loginEmail,
                              }
                            : null,
                        );
                      }}
                      placeholder="name@domain.com"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Destination Team</label>
                    <select
                      value={editor.team}
                      onChange={(e) => setEditor({ ...editor, team: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                    >
                      <option value="all">all (All Countries)</option>
                      <option value="china">china</option>
                      <option value="europe">europe</option>
                      <option value="malaysia">malaysia</option>
                      <option value="general">general (Management / Media)</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={editor.active}
                        onChange={(e) => setEditor({ ...editor, active: e.target.checked })}
                      />
                      Active on Staff &amp; KPI Roster
                    </label>
                  </div>
                </div>

                {/* CRM Login Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-900">
                    <input
                      type="checkbox"
                      checked={editor.enableLogin}
                      disabled={Boolean(editor.userId)}
                      onChange={(e) => setEditor({ ...editor, enableLogin: e.target.checked })}
                    />
                    {editor.userId ? 'CRM Login Account Linked' : 'Create CRM Login Account'}
                  </label>
                  {editor.enableLogin && (
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Login Email *</label>
                        <input
                          type="email"
                          required={editor.enableLogin}
                          value={editor.loginEmail}
                          onChange={(e) => setEditor({ ...editor, loginEmail: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">CRM Role</label>
                        <select
                          value={editor.loginRole}
                          disabled={
                            editor.userId === currentUser?.id ||
                            (editor.loginRole === 'super_admin' && currentUser?.role !== 'super_admin')
                          }
                          onChange={(e) =>
                            setEditor({
                              ...editor,
                              loginRole: e.target.value as 'counselor' | 'admin' | 'super_admin',
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                        >
                          <option value="counselor">Counselor / Staff</option>
                          <option value="admin">Admin</option>
                          {(currentUser?.role === 'super_admin' || editor.loginRole === 'super_admin') && (
                            <option value="super_admin">Super Admin</option>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">
                          {editor.userId ? 'Reset Password (optional)' : 'Password (min 12 chars) *'}
                        </label>
                        <input
                          type="password"
                          minLength={editor.userId && !editor.loginPassword ? undefined : 12}
                          required={!editor.userId && editor.enableLogin}
                          value={editor.loginPassword}
                          onChange={(e) => setEditor({ ...editor, loginPassword: e.target.value })}
                          placeholder={editor.userId ? 'Leave blank to keep' : 'Min 12 characters'}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Public Website Bio Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-900">
                      <input
                        type="checkbox"
                        checked={editor.syncPublicProfile}
                        onChange={(e) => setEditor({ ...editor, syncPublicProfile: e.target.checked })}
                      />
                      Sync Public Website Profile (/about &amp; /education-consultant-dhaka)
                    </label>
                    {editor.syncPublicProfile && (
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <input
                          type="checkbox"
                          checked={editor.isPublished}
                          onChange={(e) =>
                            setEditor({
                              ...editor,
                              isPublished: e.target.checked,
                              consentConfirmedAt:
                                e.target.checked && !editor.consentConfirmedAt ? todayIso() : editor.consentConfirmedAt,
                            })
                          }
                        />
                        Published Publicly
                      </label>
                    )}
                  </div>

                  {editor.syncPublicProfile && (
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Short Focus Badge</label>
                        <input
                          type="text"
                          value={editor.shortRole}
                          onChange={(e) => setEditor({ ...editor, shortRole: e.target.value })}
                          placeholder="e.g. China Admissions & Scholarships"
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Order</label>
                          <input
                            type="number"
                            value={editor.displayOrder}
                            onChange={(e) => setEditor({ ...editor, displayOrder: Number(e.target.value) })}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Photo Consent</label>
                          <input
                            type="date"
                            value={editor.consentConfirmedAt}
                            onChange={(e) => setEditor({ ...editor, consentConfirmedAt: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600">Public Bio</label>
                        <textarea
                          rows={2}
                          value={editor.bio}
                          onChange={(e) => setEditor({ ...editor, bio: e.target.value })}
                          placeholder="Professional public bio displayed on About & Dhaka pages..."
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600">
                          Specialties (one per line or comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editor.specialtiesText.replace(/\n+/g, ', ')}
                          onChange={(e) => setEditor({ ...editor, specialtiesText: e.target.value })}
                          placeholder="China Admissions, CSC Scholarships, ClearCost Schedules"
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f3a5c] px-5 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editor.mode === 'create' ? 'Add & Sync Team Member' : 'Save Team Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-rose-800">
              Remove {deleteTarget.member.name}?
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
              Existing historical student leads, expenses, and KPI logs remain safely preserved in the database. Select which linked records to remove:
            </p>

            <div className="mt-4 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
              {deleteTarget.member.employee && (
                <div className="font-bold text-slate-800">
                  ✓ Staff Roster record ({deleteTarget.member.employee.empId}) will be removed.
                </div>
              )}
              {deleteTarget.member.user && (
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={deleteTarget.removeLogin}
                    onChange={(e) =>
                      setDeleteTarget({ ...deleteTarget, removeLogin: e.target.checked })
                    }
                  />
                  Also delete CRM login ({deleteTarget.member.user.email})
                </label>
              )}
              {deleteTarget.member.publicProfile && (
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={deleteTarget.removePublic}
                    onChange={(e) =>
                      setDeleteTarget({ ...deleteTarget, removePublic: e.target.checked })
                    }
                  />
                  Also remove Public Website card (/about &amp; /education-consultant-dhaka)
                </label>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingKey === deleteTarget.member.key}
                onClick={() => void handleConfirmDelete()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deletingKey === deleteTarget.member.key && <Loader2 size={13} className="animate-spin" />}
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

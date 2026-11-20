'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, useCallback } from 'react';
import PublicAboutTeamPanel from '@/components/admin/PublicAboutTeamPanel';
import { useAuth } from '@/contexts/AuthContext';

interface LinkedEmployee {
  id: string;
  empId: string;
  name: string;
  team: string;
  role?: string;
  email?: string | null;
  phone?: string | null;
  active?: boolean;
  userId?: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'counselor' | 'user';
  employee?: LinkedEmployee | null;
  createdAt: string;
  updatedAt: string;
}

interface SentMessage {
  id: string;
  toName: string;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: string;
}

function UsersPageContent() {
  const { user: currentUser, authenticatedFetch } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') === 'public' ? 'public' : 'office';
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<LinkedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'counselor' as 'super_admin' | 'admin' | 'counselor' | 'user',
    employeeId: '',
  });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messagingUser, setMessagingUser] = useState<User | null>(null);
  const [messageForm, setMessageForm] = useState({ subject: '', body: '' });
  const [messageSending, setMessageSending] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState('');
  const [showSentMessagesModal, setShowSentMessagesModal] = useState(false);
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [staffNotice, setStaffNotice] = useState('');
  const [staffBusy, setStaffBusy] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    empId: '',
    role: 'Counselor',
    team: 'china',
    phone: '',
    email: '',
  });
  const [staffDrafts, setStaffDrafts] = useState<
    Record<string, { role?: string; team?: string; phone?: string; email?: string; active?: boolean }>
  >({});

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'admin';
  const canMessage = isSuperAdmin || isAdmin;

  const fetchSentMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await authenticatedFetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        setSentMessages(data.messages || []);
      } else {
        setError('Failed to fetch sent messages');
      }
    } catch {
      setError('Failed to fetch sent messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setEmployees(Array.isArray(data.employees) ? data.employees : []);
      } else {
        setError('Failed to fetch users');
      }
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
      const timeoutId = window.setTimeout(() => void fetchUsers(), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [currentUser?.role, fetchUsers]);

  // Check if current user is admin or super_admin
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', role: 'counselor', employeeId: '' });
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create user');
      }
    } catch {
      setError('Failed to create user');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await authenticatedFetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'counselor', employeeId: '' });
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update user');
      }
    } catch {
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    }
  };

  const handleSaveStaffMember = async (emp: LinkedEmployee) => {
    const draft = staffDrafts[emp.id] || {};
    setStaffBusy(true);
    setError('');
    setStaffNotice('');
    try {
      const res = await authenticatedFetch('/api/admin/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: emp.id,
          role: draft.role ?? emp.role ?? 'Counselor',
          team: draft.team ?? emp.team,
          phone: draft.phone ?? emp.phone ?? '',
          email: draft.email ?? emp.email ?? '',
          active: draft.active ?? (emp.active !== false),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not update staff member');
      setStaffNotice(`Saved profile for ${emp.name} (${emp.empId}).`);
      setStaffDrafts((prev) => {
        const copy = { ...prev };
        delete copy[emp.id];
        return copy;
      });
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update staff member');
    } finally {
      setStaffBusy(false);
    }
  };

  const handleCreateStaffMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim()) return;
    setStaffBusy(true);
    setError('');
    setStaffNotice('');
    try {
      const res = await authenticatedFetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStaffForm.name.trim(),
          empId: newStaffForm.empId.trim() || undefined,
          role: newStaffForm.role.trim() || 'Counselor',
          team: newStaffForm.team,
          phone: newStaffForm.phone.trim() || undefined,
          email: newStaffForm.email.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not add staff member');
      setShowAddStaffModal(false);
      setNewStaffForm({ name: '', empId: '', role: 'Counselor', team: 'china', phone: '', email: '' });
      setStaffNotice(`Added ${data.name} (${data.empId}) to Office Staff Roster.`);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff member');
    } finally {
      setStaffBusy(false);
    }
  };

  const handleApplyThreeCounselorPreset = async () => {
    setStaffBusy(true);
    setError('');
    setStaffNotice('');
    try {
      const res = await authenticatedFetch('/api/admin/lead-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_3_counselors_preset' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not apply counselor preset');
      setStaffNotice(
        '3-Counselor office preset applied: Mukta Rahaman (All Countries), Afsana Meme (China Only), Mim (China Only). Create a login below for anyone missing one.',
      );
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply preset');
    } finally {
      setStaffBusy(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      employeeId: user.employee?.id || '',
    });
    setShowEditModal(true);
  };

  const linkedEmpIds = new Set(users.map((u) => u.employee?.id).filter(Boolean));
  const unlinkedEmployees = employees.filter((emp) => !emp.userId && !linkedEmpIds.has(emp.id));

  const openQuickCreateForEmployee = (emp: LinkedEmployee) => {
    const looksAdmin = Boolean(emp.role && /\b(admin|director|investor|head|ceo)\b/i.test(emp.role));
    setFormData({
      name: emp.name,
      email: emp.email || '',
      password: '',
      role: isSuperAdmin && looksAdmin ? 'admin' : 'counselor',
      employeeId: emp.id,
    });
    setError('');
    setShowCreateModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowMessageModal(false);
    setShowSentMessagesModal(false);
    setEditingUser(null);
    setMessagingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'counselor', employeeId: '' });
    setMessageForm({ subject: '', body: '' });
    setError('');
    setMessageSuccess('');
  };

  const openMessageModal = (user: User) => {
    setMessagingUser(user);
    setMessageForm({ subject: '', body: '' });
    setMessageSuccess('');
    setShowMessageModal(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingUser) return;
    setMessageSending(true);
    try {
      const response = await authenticatedFetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: messagingUser.id,
          toEmail: messagingUser.email,
          toName: messagingUser.name,
          subject: messageForm.subject,
          body: messageForm.body,
        }),
      });
      if (response.ok) {
        setMessageSuccess('Message sent successfully!');
        setMessageForm({ subject: '', body: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send message');
      }
    } catch {
      setError('Failed to send message');
    } finally {
      setMessageSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const officeCounselorTargets = [
    { key: 'mukta', label: 'Mukta Rahaman', scope: 'All Countries', match: /\bmukta\b/i },
    { key: 'afsana', label: 'Afsana Meme', scope: 'China Only', match: /\bafsana\b/i },
    { key: 'mim', label: 'Mim', scope: 'China Only', match: /\bmim\b/i },
  ].map((target) => {
    const emp = employees.find((e) => target.match.test(e.name) && e.active !== false) || null;
    const linked = emp
      ? users.find((u) => u.employee?.id === emp.id || (emp.userId && u.id === emp.userId)) || null
      : null;
    return { ...target, emp, linked };
  });

  const anyCounselorMissing = officeCounselorTargets.some((c) => !c.emp);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl space-y-6 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f3a5c] sm:text-3xl">
              Team &amp; Users
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Single place for office counselors, WhatsApp portals, CRM logins, and public website bios.{' '}
              <Link href="/admin/settings#lead-flow" className="font-bold text-[#0f3a5c] hover:underline">
                Lead Flow Control →
              </Link>
            </p>
          </div>
          {activeTab === 'office' && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={staffBusy}
                onClick={handleApplyThreeCounselorPreset}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
              >
                {anyCounselorMissing ? 'Add Missing Counselors & Apply Preset' : 'Apply 3-Counselor Preset'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                + Add Staff / Counselor
              </button>
              {canMessage && (
                <button
                  onClick={() => {
                    fetchSentMessages();
                    setShowSentMessagesModal(true);
                  }}
                  className="flex items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
                >
                  Sent Messages
                </button>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center rounded-lg bg-[#0f3a5c] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#124b7a]"
              >
                + Create Login
              </button>
            </div>
          )}
        </div>

        {/* Unified Single-Point Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'office'
                ? 'border-[#0f3a5c] text-[#0f3a5c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Office Counselors &amp; CRM Logins ({employees.length})
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/users?tab=public')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === 'public'
                ? 'border-[#0f3a5c] text-[#0f3a5c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Public About Page Bios (/about)
          </button>
        </div>

        {activeTab === 'public' ? (
          <PublicAboutTeamPanel />
        ) : (
          <>
            {/* 3-Counselor Office Verification Strip */}
            <div
              className={`rounded-2xl border p-4 ${
                anyCounselorMissing
                  ? 'border-amber-200 bg-amber-50/80'
                  : 'border-emerald-200 bg-emerald-50/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Active Office Counselors Roster Check (3-Counselor Setup)
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {anyCounselorMissing
                      ? 'One or more office counselors (such as Mim) are not in the roster yet. Click Apply Preset to create missing counselor profiles and route untouched leads cleanly.'
                      : 'All 3 office counselors are active in the CRM roster.'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={staffBusy}
                  onClick={handleApplyThreeCounselorPreset}
                  className="rounded-lg bg-[#0f3a5c] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-50"
                >
                  {staffBusy ? 'Applying...' : 'Sync 3 Counselors (Mukta · Afsana · Mim)'}
                </button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {officeCounselorTargets.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.scope}
                        {item.emp ? ` · ${item.emp.empId}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {!item.emp ? (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                          Missing
                        </span>
                      ) : !item.linked ? (
                        <button
                          type="button"
                          onClick={() => openQuickCreateForEmployee(item.emp!)}
                          className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-blue-700"
                        >
                          + Login
                        </button>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {staffNotice && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900">
                {staffNotice}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-900">
                {error}
              </div>
            )}

            {/* Section 1: Unified Office Staff & Counselors Roster */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. Office Staff &amp; Counselors Roster ({employees.length})
              </h2>
              <p className="text-xs text-slate-500">
                Edit counselor roles, destination teams, WhatsApp numbers, active status, or create linked CRM login accounts.
              </p>
            </div>
            <Link
              href="/admin/settings#lead-flow"
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
            >
              Control Lead Flow &amp; Untouched Distribution →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Staff / ID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Destination Team</th>
                  <th className="px-4 py-3">WhatsApp Phone</th>
                  <th className="px-4 py-3">Work Email</th>
                  <th className="px-4 py-3">Login Account</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {employees.map((emp) => {
                  const draft = staffDrafts[emp.id] || {};
                  const roleVal = draft.role ?? emp.role ?? 'Counselor';
                  const teamVal = draft.team ?? emp.team;
                  const phoneVal = draft.phone ?? emp.phone ?? '';
                  const emailVal = draft.email ?? emp.email ?? '';
                  const activeVal = draft.active ?? (emp.active !== false);
                  const linkedUser = users.find(
                    (u) => u.employee?.id === emp.id || (emp.userId && u.id === emp.userId),
                  );
                  return (
                    <tr key={emp.id} className={!activeVal ? 'bg-slate-50/80 opacity-65' : ''}>
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-slate-900">{emp.name}</p>
                        <p className="font-mono text-[11px] text-slate-500">{emp.empId}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          value={roleVal}
                          onChange={(e) =>
                            setStaffDrafts((prev) => ({
                              ...prev,
                              [emp.id]: { ...prev[emp.id], role: e.target.value },
                            }))
                          }
                          className="w-40 rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <select
                          value={teamVal}
                          onChange={(e) =>
                            setStaffDrafts((prev) => ({
                              ...prev,
                              [emp.id]: { ...prev[emp.id], team: e.target.value },
                            }))
                          }
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold"
                        >
                          <option value="all">all (All Countries)</option>
                          <option value="china">china</option>
                          <option value="europe">europe</option>
                          <option value="malaysia">malaysia</option>
                          <option value="general">general</option>
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="text"
                          value={phoneVal}
                          placeholder="+8801..."
                          onChange={(e) =>
                            setStaffDrafts((prev) => ({
                              ...prev,
                              [emp.id]: { ...prev[emp.id], phone: e.target.value },
                            }))
                          }
                          className="w-36 rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          type="email"
                          value={emailVal}
                          placeholder="name@eduexpressint.com"
                          onChange={(e) =>
                            setStaffDrafts((prev) => ({
                              ...prev,
                              [emp.id]: { ...prev[emp.id], email: e.target.value },
                            }))
                          }
                          className="w-44 rounded border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        {linkedUser ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-200">
                            {linkedUser.email}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openQuickCreateForEmployee(emp)}
                            className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                          >
                            + Create Login
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <label className="inline-flex cursor-pointer items-center gap-1.5 font-semibold">
                          <input
                            type="checkbox"
                            checked={activeVal}
                            onChange={(e) =>
                              setStaffDrafts((prev) => ({
                                ...prev,
                                [emp.id]: { ...prev[emp.id], active: e.target.checked },
                              }))
                            }
                            className="size-4 rounded border-slate-300 text-[#0f3a5c]"
                          />
                          <span>{activeVal ? 'Active' : 'Inactive'}</span>
                        </label>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          disabled={staffBusy}
                          onClick={() => void handleSaveStaffMember(emp)}
                          className="rounded-lg bg-[#0f3a5c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#124b7a] disabled:opacity-50"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-xs text-slate-500">
                      No staff members added yet. Click &ldquo;Apply 3-Counselor Preset&rdquo; or &ldquo;+ Add Staff / Counselor&rdquo; above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {unlinkedEmployees.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Active Staff Without a Login Password ({unlinkedEmployees.length})
                </h3>
                <p className="text-[11px] text-slate-600">
                  Click <strong>Create Login</strong> to give a counselor desk sign-in credentials.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {unlinkedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {emp.empId} · {emp.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {emp.team} {emp.email ? `· ${emp.email}` : '· Enter work email'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuickCreateForEmployee(emp)}
                    className="shrink-0 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Create Login
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-base font-bold text-slate-900">2. CRM Login Accounts ({users.length})</h2>
            <p className="text-xs text-slate-500">Password credentials, permission roles, and employee profile links.</p>
          </div>
          <ul className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <li key={user.id || `user-${index}`} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          {user.employee && (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              {user.employee.empId} · {user.employee.team}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'counselor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : user.role === 'counselor' ? 'Counselor (Scoped)' : user.role}
                      </span>
                      <div className="flex space-x-2">
                        {canMessage && user.id !== currentUser?.id && (
                          <button
                            onClick={() => openMessageModal(user)}
                            title="Send Message"
                            aria-label={`Send message to ${user.name}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(user)}
                          title={`Edit ${user.name}`}
                          aria-label={`Edit ${user.name}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === currentUser?.id}
                          title={user.id === currentUser?.id ? 'You cannot delete your own account' : `Delete ${user.name}`}
                          aria-label={`Delete ${user.name}`}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          </>
        )}
      </div>

      {/* Add Staff / Counselor Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-slate-900/50">
          <div className="relative top-20 mx-auto w-96 rounded-xl border bg-white p-5 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Add Staff / Counselor</h3>
            <form onSubmit={handleCreateStaffMember} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  placeholder="e.g. Mim"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Staff ID (optional)</label>
                  <input
                    type="text"
                    value={newStaffForm.empId}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, empId: e.target.value })}
                    placeholder="Auto (E-08)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Role</label>
                  <input
                    type="text"
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    placeholder="Counselor"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Destination Team Scope</label>
                <select
                  value={newStaffForm.team}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, team: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="china">China Only (china)</option>
                  <option value="all">All Countries (all)</option>
                  <option value="europe">Europe / Non-China (europe)</option>
                  <option value="malaysia">Malaysia / Non-China (malaysia)</option>
                  <option value="general">General / Operations (general)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">WhatsApp Phone</label>
                <input
                  type="text"
                  value={newStaffForm.phone}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                  placeholder="+8801..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Work Email</label>
                <input
                  type="email"
                  value={newStaffForm.email}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                  placeholder="counselor@eduexpressint.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffBusy || !newStaffForm.name.trim()}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {staffBusy ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
              <form onSubmit={handleCreateUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password (minimum 12 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={12}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Employee Profile (for KPI &amp; Leads)</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => {
                      const emp = employees.find((item) => item.id === e.target.value);
                      setFormData({
                        ...formData,
                        employeeId: e.target.value,
                        name: !formData.name && emp ? emp.name : formData.name,
                        email: !formData.email && emp?.email ? emp.email : formData.email,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Optional: Select employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.empId} — {emp.name} ({emp.team}){emp.userId ? ' [Linked]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'super_admin' | 'admin' | 'counselor' | 'user' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="counselor">Counselor (Scoped: Leads + KPI Desk)</option>
                    <option value="user">User (Public only)</option>
                    {isSuperAdmin && <option value="admin">Admin</option>}
                    {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal - Admin & Super Admin */}
      {showMessageModal && messagingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[480px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Send Message</h3>
                  <p className="text-sm text-gray-500">To: {messagingUser.name} ({messagingUser.email})</p>
                </div>
              </div>

              {messageSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-medium">{messageSuccess}</p>
                  <button
                    onClick={closeModals}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage}>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={messageForm.subject}
                      onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter message subject"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={messageForm.body}
                      onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={messageSending}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {messageSending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <form onSubmit={handleEditUser}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New password (minimum 12 characters; leave blank to keep current)</label>
                  <input
                    type="password"
                    minLength={12}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Linked Employee Profile</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Unlinked --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.empId} — {emp.name} ({emp.team})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'super_admin' | 'admin' | 'counselor' | 'user' })}
                    disabled={editingUser.id === currentUser?.id}
                    aria-describedby={editingUser.id === currentUser?.id ? 'own-role-help' : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="counselor">Counselor (Scoped: Leads + KPI Desk)</option>
                    <option value="user">User (Public only)</option>
                    {(isSuperAdmin || formData.role === 'admin') && <option value="admin">Admin</option>}
                    {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                  </select>
                  {editingUser.id === currentUser?.id && (
                    <p id="own-role-help" className="mt-1 text-xs text-gray-500">Your own role cannot be changed.</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sent Messages History Modal */}
      {showSentMessagesModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Sent Messages History
                </h3>
                <button
                  onClick={() => setShowSentMessagesModal(false)}
                  aria-label="Close sent messages history"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : sentMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No sent messages found.
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                  {sentMessages.map((msg, index) => (
                    <div key={msg.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">To: {msg.toName} ({msg.toEmail})</p>
                          <p className="text-xs text-gray-500">Sent on: {new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <p className="text-sm font-bold text-gray-900 mb-1">Subject: {msg.subject}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowSentMessagesModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading Team &amp; Users…</div>}>
      <UsersPageContent />
    </Suspense>
  );
}

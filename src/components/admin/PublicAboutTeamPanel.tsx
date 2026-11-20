'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
  Users2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type TeamMember = {
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
};

const blankMember = () => ({
  kind: 'team',
  slug: '',
  name: '',
  role: '',
  shortRole: '',
  bio: '',
  specialties: '',
  photoUrl: '',
  consentConfirmedAt: '',
  isPublished: false,
  displayOrder: 0,
});

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const dateValue = (value?: string | null) => (value ? value.slice(0, 10) : '');

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default function PublicAboutTeamPanel() {
  const { authenticatedFetch } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [draft, setDraft] = useState(blankMember());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    const response = await authenticatedFetch('/api/admin/trust');
    if (response.ok) {
      const data = await response.json();
      setMembers(data.team || []);
    }
    setLoading(false);
  }, [authenticatedFetch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() resolves state through async data fetch
    load();
  }, [load]);

  const uploadPhoto = async (file: File, id: string | 'new') => {
    setBusy(`upload-${id}`);
    const body = new FormData();
    body.append('image', file);
    body.append('folder', 'team');
    const response = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body,
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      if (id === 'new') setDraft((previous) => ({ ...previous, photoUrl: result.imageUrl }));
      else
        setMembers((previous) =>
          previous.map((member) => (member.id === id ? { ...member, photoUrl: result.imageUrl } : member)),
        );
      setMessage({
        tone: 'success',
        text:
          id === 'new'
            ? 'Photo uploaded. Save the profile when ready.'
            : 'Photo uploaded. Click Save Profile to publish the change.',
      });
    } else setMessage({ tone: 'error', text: result.error || 'Photo upload failed.' });
    setBusy('');
  };

  const uploadControl = (id: string | 'new') => (
    <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-800 hover:bg-blue-100">
      {busy === `upload-${id}` ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Upload photo
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) uploadPhoto(file, id);
          event.target.value = '';
        }}
      />
    </label>
  );

  const createMember = async () => {
    setBusy('create');
    const response = await authenticatedFetch('/api/admin/trust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const result = await response.json().catch(() => ({}));
    setMessage(
      response.ok
        ? { tone: 'success', text: 'Public team profile created.' }
        : { tone: 'error', text: result.error || 'Team member could not be added.' },
    );
    if (response.ok) {
      setDraft(blankMember());
      setShowAddForm(false);
      await load();
    }
    setBusy('');
  };

  const updateMember = (id: string, field: keyof TeamMember, value: unknown) =>
    setMembers((previous) =>
      previous.map((member) => (member.id === id ? { ...member, [field]: value } : member)),
    );

  const saveMember = async (member: TeamMember) => {
    setBusy(`save-${member.id}`);
    const response = await authenticatedFetch('/api/admin/trust', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...member, kind: 'team' }),
    });
    const result = await response.json().catch(() => ({}));
    setMessage(
      response.ok
        ? { tone: 'success', text: `${member.name} public profile saved.` }
        : { tone: 'error', text: result.error || 'Profile could not be saved.' },
    );
    if (response.ok) await load();
    setBusy('');
  };

  const deleteMember = async (member: TeamMember) => {
    if (!window.confirm(`Delete ${member.name} from the public /about team directory?`)) return;
    setBusy(`delete-${member.id}`);
    const response = await authenticatedFetch(
      `/api/admin/trust?kind=team&id=${encodeURIComponent(member.id)}`,
      { method: 'DELETE' },
    );
    setMessage(
      response.ok
        ? { tone: 'success', text: 'Public team profile deleted.' }
        : { tone: 'error', text: 'Profile could not be deleted.' },
    );
    if (response.ok) await load();
    setBusy('');
  };

  const publishedCount = useMemo(() => members.filter((m) => m.isPublished).length, [members]);
  const draftCount = members.length - publishedCount;

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter === 'published' && !m.isPublished) return false;
      if (statusFilter === 'draft' && m.isPublished) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.shortRole && m.shortRole.toLowerCase().includes(q)) ||
        m.slug.toLowerCase().includes(q)
      );
    });
  }, [members, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div className="grid min-h-60 place-items-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0f3a5c]">
            Public Website Team Profiles (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/about#team</code>)
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Controls public website bios and photos only ({publishedCount} published · {draftCount} draft). Requires photo consent date to display publicly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/about#team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            <span>Preview /about</span>
            <ExternalLink size={13} />
          </Link>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-4 text-xs font-bold text-white hover:bg-[#124b7a]"
          >
            <Plus size={15} />
            {showAddForm ? 'Close Form' : 'Add Public Profile'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center justify-between rounded-xl border p-3.5 text-xs font-bold ${
            message.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="p-1 hover:opacity-75">
            <X size={15} />
          </button>
        </div>
      )}

      {showAddForm && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Add Public Website Team Profile</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[160px_1fr]">
            <div>
              <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                {draft.photoUrl ? (
                  <Image
                    src={draft.photoUrl}
                    alt="New team member preview"
                    fill
                    sizes="160px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <UserRound size={36} />
                )}
              </div>
              {uploadControl('new')}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Full name">
                <input
                  className={inputClass}
                  value={draft.name}
                  placeholder="e.g. Mukta Rahaman"
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      name: event.target.value,
                      slug: draft.slug || slugify(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Profile slug">
                <input
                  className={inputClass}
                  value={draft.slug}
                  placeholder="e.g. mukta-rahaman"
                  onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })}
                />
              </Field>
              <Field label="Role">
                <input
                  className={inputClass}
                  value={draft.role}
                  placeholder="e.g. Senior Counselor"
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                />
              </Field>
              <Field label="Short role">
                <input
                  className={inputClass}
                  value={draft.shortRole}
                  placeholder="e.g. All Countries Admissions"
                  onChange={(event) => setDraft({ ...draft, shortRole: event.target.value })}
                />
              </Field>
              <Field label="Display order">
                <input
                  type="number"
                  className={inputClass}
                  value={draft.displayOrder}
                  onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) })}
                />
              </Field>
              <Field label="Photo consent date">
                <input
                  type="date"
                  className={inputClass}
                  value={draft.consentConfirmedAt}
                  onChange={(event) => setDraft({ ...draft, consentConfirmedAt: event.target.value })}
                />
              </Field>
              <Field label="Short biography" className="md:col-span-2">
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={draft.bio}
                  placeholder="Brief credentials and guidance experience..."
                  onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                />
              </Field>
              <Field label="Specialties, one per line">
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={draft.specialties}
                  placeholder="China Admissions&#10;Scholarship Guidance"
                  onChange={(event) => setDraft({ ...draft, specialties: event.target.value })}
                />
              </Field>
              <div className="flex items-end gap-3 md:col-span-2 xl:col-span-3">
                <label className="flex min-h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={draft.isPublished}
                    onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
                  />
                  Publish profile on website
                </label>
                <button
                  type="button"
                  onClick={createMember}
                  disabled={!draft.name || !draft.role || !draft.slug || busy === 'create'}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-40"
                >
                  {busy === 'create' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  Add Public Profile
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === 'all' ? 'bg-[#0f3a5c] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({members.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === 'published' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === 'draft' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        <div className="relative min-w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search public profile..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredMembers.map((member) => (
          <article
            key={member.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-4">
                <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <UserRound size={26} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    className={inputClass}
                    value={member.name}
                    onChange={(event) => updateMember(member.id, 'name', event.target.value)}
                    aria-label="Team member name"
                  />
                  {uploadControl(member.id)}
                </div>
              </div>

              <div>
                {member.isPublished ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <Eye size={11} />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    <EyeOff size={11} />
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Role">
                <input
                  className={inputClass}
                  value={member.role}
                  onChange={(event) => updateMember(member.id, 'role', event.target.value)}
                />
              </Field>
              <Field label="Short role">
                <input
                  className={inputClass}
                  value={member.shortRole || ''}
                  onChange={(event) => updateMember(member.id, 'shortRole', event.target.value)}
                />
              </Field>
              <Field label="Profile slug">
                <input
                  className={inputClass}
                  value={member.slug}
                  onChange={(event) => updateMember(member.id, 'slug', slugify(event.target.value))}
                />
              </Field>
              <Field label="Photo consent date">
                <input
                  type="date"
                  className={inputClass}
                  value={dateValue(member.consentConfirmedAt)}
                  onChange={(event) => updateMember(member.id, 'consentConfirmedAt', event.target.value)}
                />
              </Field>
              <Field label="Biography" className="sm:col-span-2">
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={member.bio || ''}
                  onChange={(event) => updateMember(member.id, 'bio', event.target.value)}
                />
              </Field>
              <Field label="Specialties, one per line">
                <textarea
                  className={`${inputClass} min-h-20`}
                  value={member.specialties.join('\n')}
                  onChange={(event) =>
                    updateMember(
                      member.id,
                      'specialties',
                      event.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
              <div className="grid gap-2.5">
                <Field label="Display order">
                  <input
                    type="number"
                    className={inputClass}
                    value={member.displayOrder}
                    onChange={(event) => updateMember(member.id, 'displayOrder', Number(event.target.value))}
                  />
                </Field>
                <label className="flex min-h-10 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={member.isPublished}
                    onChange={(event) => updateMember(member.id, 'isPublished', event.target.checked)}
                  />
                  Show publicly on website
                </label>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => deleteMember(member)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 text-xs font-bold text-rose-700 hover:bg-rose-50"
              >
                {busy === `delete-${member.id}` ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete
              </button>
              <button
                type="button"
                onClick={() => saveMember(member)}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 text-xs font-bold text-white hover:bg-[#0c2f4a]"
              >
                {busy === `save-${member.id}` ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save Profile
              </button>
            </div>
          </article>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            <Users2 size={28} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm font-semibold">No public profiles match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

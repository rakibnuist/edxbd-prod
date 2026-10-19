'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { CheckCircle2, ImagePlus, Loader2, Plus, Save, Trash2, UserRound } from 'lucide-react';

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

const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dateValue = (value?: string | null) => value ? value.slice(0, 10) : '';

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={className}><span className="block text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</span>{children}</label>;
}

export default function TeamsAdminPage() {
  const { authenticatedFetch } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [draft, setDraft] = useState(blankMember());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    const response = await authenticatedFetch('/api/admin/trust');
    if (response.ok) {
      const data = await response.json();
      setMembers(data.team || []);
    }
    setLoading(false);
  }, [authenticatedFetch]);

  useEffect(() => { load(); }, [load]);

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
      if (id === 'new') setDraft(previous => ({ ...previous, photoUrl: result.imageUrl }));
      else setMembers(previous => previous.map(member => member.id === id ? { ...member, photoUrl: result.imageUrl } : member));
      setMessage({ tone: 'success', text: id === 'new' ? 'Photo uploaded. Save the team member when ready.' : 'Photo uploaded. Save the profile to publish the change.' });
    } else setMessage({ tone: 'error', text: result.error || 'Photo upload failed.' });
    setBusy('');
  };

  const uploadControl = (id: string | 'new') => (
    <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-800 hover:bg-blue-100">
      {busy === `upload-${id}` ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Upload photo
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) uploadPhoto(file, id);
        event.target.value = '';
      }} />
    </label>
  );

  const createMember = async () => {
    setBusy('create');
    const response = await authenticatedFetch('/api/admin/trust', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? { tone: 'success', text: 'Team member added.' } : { tone: 'error', text: result.error || 'Team member could not be added.' });
    if (response.ok) { setDraft(blankMember()); await load(); }
    setBusy('');
  };

  const updateMember = (id: string, field: keyof TeamMember, value: unknown) => setMembers(previous => previous.map(member => member.id === id ? { ...member, [field]: value } : member));

  const saveMember = async (member: TeamMember) => {
    setBusy(`save-${member.id}`);
    const response = await authenticatedFetch('/api/admin/trust', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...member, kind: 'team' }) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? { tone: 'success', text: `${member.name} updated.` } : { tone: 'error', text: result.error || 'Team member could not be saved.' });
    if (response.ok) await load();
    setBusy('');
  };

  const deleteMember = async (member: TeamMember) => {
    if (!window.confirm(`Delete ${member.name} from the team database?`)) return;
    setBusy(`delete-${member.id}`);
    const response = await authenticatedFetch(`/api/admin/trust?kind=team&id=${encodeURIComponent(member.id)}`, { method: 'DELETE' });
    setMessage(response.ok ? { tone: 'success', text: 'Team member deleted.' } : { tone: 'error', text: 'Team member could not be deleted.' });
    if (response.ok) await load();
    setBusy('');
  };

  if (loading) return <div className="grid min-h-72 place-items-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-16">
      <header className="rounded-3xl bg-[#08263c] p-7 text-white sm:p-9">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8ed0ee]">People and expertise</p>
        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Team profiles</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">Manage the real people shown on the homepage and About page. Publish only approved names, roles, bios and photos.</p>
      </header>

      {message && <div className={`rounded-2xl border p-4 text-sm font-bold ${message.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'}`}>{message.text}</div>}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-blue-700"><Plus /></span><div><h2 className="font-heading text-2xl font-bold">Add team member</h2><p className="text-sm text-slate-500">A profile remains hidden until you deliberately publish it.</p></div></div>
        <div className="mt-7 grid gap-6 lg:grid-cols-[170px_1fr]">
          <div>
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">{draft.photoUrl ? <Image src={draft.photoUrl} alt="New team member preview" fill sizes="170px" unoptimized className="object-cover" /> : <UserRound size={40} />}</div>
            {uploadControl('new')}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Full name"><input className={inputClass} value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value, slug: draft.slug || slugify(event.target.value) })} /></Field>
            <Field label="Profile slug"><input className={inputClass} value={draft.slug} onChange={event => setDraft({ ...draft, slug: slugify(event.target.value) })} /></Field>
            <Field label="Role"><input className={inputClass} value={draft.role} onChange={event => setDraft({ ...draft, role: event.target.value })} /></Field>
            <Field label="Short role"><input className={inputClass} value={draft.shortRole} onChange={event => setDraft({ ...draft, shortRole: event.target.value })} /></Field>
            <Field label="Display order"><input type="number" className={inputClass} value={draft.displayOrder} onChange={event => setDraft({ ...draft, displayOrder: Number(event.target.value) })} /></Field>
            <Field label="Photo consent date"><input type="date" className={inputClass} value={draft.consentConfirmedAt} onChange={event => setDraft({ ...draft, consentConfirmedAt: event.target.value })} /></Field>
            <Field label="Short biography" className="md:col-span-2"><textarea className={`${inputClass} min-h-24`} value={draft.bio} onChange={event => setDraft({ ...draft, bio: event.target.value })} /></Field>
            <Field label="Specialties, one per line"><textarea className={`${inputClass} min-h-24`} value={draft.specialties} onChange={event => setDraft({ ...draft, specialties: event.target.value })} /></Field>
            <div className="flex items-end gap-4"><label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"><input type="checkbox" checked={draft.isPublished} onChange={event => setDraft({ ...draft, isPublished: event.target.checked })} />Publish profile</label><button type="button" onClick={createMember} disabled={!draft.name || !draft.role || !draft.slug || busy === 'create'} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white disabled:opacity-40">{busy === 'create' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}Add</button></div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-blue-700">Current team</p><h2 className="mt-2 font-heading text-3xl font-bold">Manage profiles</h2></div><span className="text-sm font-bold text-slate-500">{members.length} people</span></div>
        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {members.map(member => (
            <article key={member.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex gap-4">
                <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">{member.photoUrl ? <Image src={member.photoUrl} alt={member.name} fill sizes="80px" unoptimized className="object-cover" /> : <UserRound size={28} />}</div>
                <div className="min-w-0 flex-1"><input className={inputClass} value={member.name} onChange={event => updateMember(member.id, 'name', event.target.value)} aria-label="Team member name" />{uploadControl(member.id)}</div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Role"><input className={inputClass} value={member.role} onChange={event => updateMember(member.id, 'role', event.target.value)} /></Field>
                <Field label="Short role"><input className={inputClass} value={member.shortRole || ''} onChange={event => updateMember(member.id, 'shortRole', event.target.value)} /></Field>
                <Field label="Profile slug"><input className={inputClass} value={member.slug} onChange={event => updateMember(member.id, 'slug', slugify(event.target.value))} /></Field>
                <Field label="Photo consent date"><input type="date" className={inputClass} value={dateValue(member.consentConfirmedAt)} onChange={event => updateMember(member.id, 'consentConfirmedAt', event.target.value)} /></Field>
                <Field label="Biography" className="sm:col-span-2"><textarea className={`${inputClass} min-h-24`} value={member.bio || ''} onChange={event => updateMember(member.id, 'bio', event.target.value)} /></Field>
                <Field label="Specialties, one per line"><textarea className={`${inputClass} min-h-24`} value={member.specialties.join('\n')} onChange={event => updateMember(member.id, 'specialties', event.target.value.split('\n').map(item => item.trim()).filter(Boolean))} /></Field>
                <div className="grid gap-3"><Field label="Display order"><input type="number" className={inputClass} value={member.displayOrder} onChange={event => updateMember(member.id, 'displayOrder', Number(event.target.value))} /></Field><label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"><input type="checkbox" checked={member.isPublished} onChange={event => updateMember(member.id, 'isPublished', event.target.checked)} />Show publicly</label></div>
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-5"><button type="button" onClick={() => deleteMember(member)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-700">{busy === `delete-${member.id}` ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}Delete</button><button type="button" onClick={() => saveMember(member)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#08263c] px-5 text-sm font-bold text-white">{busy === `save-${member.id}` ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}Save</button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

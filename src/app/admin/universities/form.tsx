'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpenCheck, Building2, Coins, FileCheck2, GraduationCap, Loader2, Plus, Save, Sparkles, Trash2, ShieldCheck, Trophy } from 'lucide-react';

import type { IUniversity, IUniversityFee, IUniversityProgram, IUniversityScholarship } from '@/types/university';

interface UniversityFormProps {
  initialData?: IUniversity;
  isNew?: boolean;
}

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const labelClass = 'block text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500';

const splitComma = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);
const splitLines = (value: string) => value.split('\n').map(item => item.trim()).filter(Boolean);
const unique = (values: string[]) => Array.from(new Set(values.map(value => value.trim()).filter(Boolean)));

const blankProgram = (): IUniversityProgram => ({
  level: 'Bachelor',
  name: '',
  subject: '',
  languages: ['English'],
  duration: '',
  intakes: ['September Intake'],
  tuition: '',
  tuitionAfterScholarship: '',
  applicationDeadline: '',
  eligibility: [],
  sourceUrl: '',
  status: 'active',
});

const blankFee = (): IUniversityFee => ({ item: '', cost: '', notes: '', recipient: '', refundable: '', validFor: 'Current Intake', sourceUrl: '' });

const blankScholarship = (): IUniversityScholarship => ({
  title: '',
  type: '',
  amount: '',
  coverage: '',
  eligiblePrograms: [],
  renewal: '',
  deadline: '',
  condition: '',
  details: [],
  sourceUrl: '',
  status: 'active',
});

function EditorSection({ icon, title, description, action, children }: { icon: ReactNode; title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">{icon}</span><div><h2 className="font-heading text-xl font-bold text-slate-950">{title}</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">{description}</p></div></div>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <label className={className}><span className={labelClass}>{label}</span>{children}</label>;
}

export default function UniversityForm({ initialData, isNew = false }: UniversityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<IUniversity>>({
    name: '', slug: '', location: '', country: 'China', city: '', intake: ['September Intake'], degree: [], taught: ['English'],
    rankings: {}, details: { majors: [], tuition: '', tuitionDetails: [] }, programs: [], fees: [], scholarships: [], documents: [],
    deadlines: { application: '', startDate: 'September Intake' }, notes: [], badges: [], logo: '', isActive: true,
    officialUrl: '', aliases: [], relationshipType: 'unverified', relationshipEvidenceUrl: '', recognitionAuthority: '', recognitionSourceUrl: '',
    sourceUrls: [], verificationStatus: 'under_verification',
  });

  useEffect(() => {
    if (initialData) setFormData({ ...initialData, programs: initialData.programs || [] });
  }, [initialData]);

  const programSummary = useMemo(() => {
    const programs = formData.programs || [];
    return {
      levels: unique(programs.map(program => program.level)),
      names: unique(programs.map(program => program.name)),
      languages: unique(programs.flatMap(program => program.languages || [])),
      intakes: unique(programs.flatMap(program => program.intakes || [])),
    };
  }, [formData.programs]);

  const setTopLevel = (field: keyof IUniversity, value: unknown) => setFormData(previous => ({ ...previous, [field]: value }));

  const handleNestedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const [parent, child] = name.split('.');
    setFormData(previous => ({ ...previous, [parent]: { ...((previous as Record<string, unknown>)[parent] as object || {}), [child]: value } }));
  };

  const updateProgram = (index: number, field: keyof IUniversityProgram, value: unknown) => {
    setFormData(previous => {
      const programs = [...(previous.programs || [])];
      programs[index] = { ...programs[index], [field]: value };
      return { ...previous, programs };
    });
  };

  const updateFee = (index: number, field: keyof IUniversityFee, value: string) => {
    setFormData(previous => {
      const fees = [...(previous.fees || [])];
      fees[index] = { ...fees[index], [field]: value };
      return { ...previous, fees };
    });
  };

  const updateScholarship = (index: number, field: keyof IUniversityScholarship, value: unknown) => {
    setFormData(previous => {
      const scholarships = [...(previous.scholarships || [])];
      scholarships[index] = { ...scholarships[index], [field]: value };
      return { ...previous, scholarships };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const programs = (formData.programs || []).filter(program => program.name.trim());
    const synchronized = programs.length ? {
      ...formData,
      programs,
      degree: unique(programs.map(program => program.level)),
      intake: unique(programs.flatMap(program => program.intakes || [])),
      taught: unique(programs.flatMap(program => program.languages || [])),
      details: {
        ...(formData.details || { majors: [], tuition: '', tuitionDetails: [] }),
        majors: unique(programs.map(program => program.name)),
        tuition: formData.details?.tuition || programs.find(program => program.tuition)?.tuition || 'Current tuition confirmed in the ClearCost Sheet',
      },
    } : formData;

    try {
      const url = isNew ? '/api/admin/universities' : `/api/admin/universities/${formData.id || formData.slug}`;
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` },
        body: JSON.stringify(synchronized),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'The university record could not be saved.');
      }
      router.push('/admin/universities');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The university record could not be saved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7 pb-28">
      <div className="rounded-2xl bg-[#08263c] p-5 text-white sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8ed0ee]">Central university editor</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="font-heading text-3xl font-bold">{isNew ? 'Create university record' : `Edit ${formData.name || 'university'}`}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">One university can contain many program records. Add each Bachelor, Master’s, MBBS, PhD, foundation, diploma or language option separately so its tuition, intake and eligibility stay aligned.</p></div><div className="grid grid-cols-4 gap-px bg-white/15 text-center"><div className="bg-[#08263c] p-3"><strong className="text-xl text-[#8ed0ee]">{formData.programs?.length || 0}</strong><span className="block text-[9px] text-white/45">Programs</span></div><div className="bg-[#08263c] p-3"><strong className="text-xl text-[#8ed0ee]">{formData.fees?.length || 0}</strong><span className="block text-[9px] text-white/45">Fees</span></div><div className="bg-[#08263c] p-3"><strong className="text-xl text-[#8ed0ee]">{formData.scholarships?.length || 0}</strong><span className="block text-[9px] text-white/45">Awards</span></div><div className="bg-[#08263c] p-3"><strong className="text-xl text-[#8ed0ee]">{programSummary.levels.length}</strong><span className="block text-[9px] text-white/45">Levels</span></div></div></div>
      </div>

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</div> : null}

      <EditorSection icon={<Building2 size={20} />} title="University identity" description="Core public information and the official university source.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Official university name"><input className={fieldClass} value={formData.name || ''} onChange={event => setTopLevel('name', event.target.value)} required /></Field>
          <Field label="Profile URL slug"><input className={fieldClass} value={formData.slug || ''} onChange={event => setTopLevel('slug', event.target.value)} required disabled={!isNew} /></Field>
          <Field label="Country"><input className={fieldClass} value={formData.country || ''} onChange={event => setTopLevel('country', event.target.value)} required /></Field>
          <Field label="City"><input className={fieldClass} value={formData.city || ''} onChange={event => setTopLevel('city', event.target.value)} required /></Field>
          <Field label="Location display"><input className={fieldClass} value={formData.location || ''} onChange={event => setTopLevel('location', event.target.value)} placeholder="Chengdu, Sichuan Province, China" required /></Field>
          <Field label="Official university website"><input type="url" className={fieldClass} value={formData.officialUrl || ''} onChange={event => setTopLevel('officialUrl', event.target.value)} placeholder="https://..." /></Field>
          <Field label="Aliases and abbreviations"><input className={fieldClass} value={formData.aliases?.join(', ') || ''} onChange={event => setTopLevel('aliases', splitComma(event.target.value))} placeholder="SCU, Sichuan Uni" /></Field>
          <Field label="University logo URL"><input type="url" className={fieldClass} value={formData.logo || ''} onChange={event => setTopLevel('logo', event.target.value)} placeholder="https://..." /></Field>
        </div>
        {formData.logo ? <div className="mt-5 grid size-24 place-items-center rounded-xl border border-slate-200 bg-white p-2"><Image src={formData.logo} alt="University logo preview" width={80} height={80} unoptimized className="max-h-full object-contain" /></div> : null}
      </EditorSection>

      <EditorSection
        icon={<GraduationCap size={20} />}
        title="Program catalogue"
        description="Create one record for each exact course. Program level drives the Bachelor, Master’s, MBBS and other groupings on the public profile."
        action={<button type="button" onClick={() => setTopLevel('programs', [...(formData.programs || []), blankProgram()])} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add program</button>}
      >
        <div className="space-y-5">
          {(formData.programs || []).map((program, index) => (
            <article key={program.id || index} className="relative rounded-2xl border border-blue-100 bg-blue-50/35 p-4 sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-700">Program {String(index + 1).padStart(2, '0')}</p><h3 className="mt-1 font-heading text-lg font-bold text-slate-950">{program.name || 'New program option'}</h3></div><button type="button" onClick={() => setTopLevel('programs', (formData.programs || []).filter((_, itemIndex) => itemIndex !== index))} className="grid size-9 place-items-center rounded-lg bg-white text-rose-600 shadow-sm" aria-label={`Remove program ${index + 1}`}><Trash2 size={17} /></button></div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Study level"><select className={fieldClass} value={program.level} onChange={event => updateProgram(index, 'level', event.target.value)}>{['Language', 'Foundation', 'Diploma', 'Bachelor', 'MBBS', "Master's", 'PhD'].map(level => <option key={level}>{level}</option>)}</select></Field>
                <Field label="Exact program name" className="lg:col-span-2"><input className={fieldClass} value={program.name} onChange={event => updateProgram(index, 'name', event.target.value)} placeholder="Software Engineering" /></Field>
                <Field label="Subject area"><input className={fieldClass} value={program.subject || ''} onChange={event => updateProgram(index, 'subject', event.target.value)} placeholder="Computing" /></Field>
                <Field label="Teaching languages"><input className={fieldClass} value={program.languages?.join(', ') || ''} onChange={event => updateProgram(index, 'languages', splitComma(event.target.value))} placeholder="English, Chinese" /></Field>
                <Field label="Duration"><input className={fieldClass} value={program.duration || ''} onChange={event => updateProgram(index, 'duration', event.target.value)} placeholder="4 years" /></Field>
                <Field label="Intakes"><input className={fieldClass} value={program.intakes?.join(', ') || ''} onChange={event => updateProgram(index, 'intakes', splitComma(event.target.value))} placeholder="March, September" /></Field>
                <Field label="Original tuition"><input className={fieldClass} value={program.tuition || ''} onChange={event => updateProgram(index, 'tuition', event.target.value)} placeholder="22,000 CNY/Year" /></Field>
                <Field label="After scholarship tuition"><input className={fieldClass} value={program.tuitionAfterScholarship || ''} onChange={event => updateProgram(index, 'tuitionAfterScholarship', event.target.value)} placeholder="12,000 CNY/Year" /></Field>
                <Field label="Application deadline"><input className={fieldClass} value={program.applicationDeadline || ''} onChange={event => updateProgram(index, 'applicationDeadline', event.target.value)} placeholder="30 May" /></Field>
                <Field label="Program status"><select className={fieldClass} value={program.status} onChange={event => updateProgram(index, 'status', event.target.value)}><option value="active">Active option</option><option value="planned">Planned option</option><option value="paused">Paused option</option></select></Field>
                <Field label="Eligibility, one item per line" className="md:col-span-2"><textarea className={`${fieldClass} min-h-24`} value={program.eligibility?.join('\n') || ''} onChange={event => updateProgram(index, 'eligibility', splitLines(event.target.value))} placeholder={'HSC GPA 4.00+\nIELTS 5.5 or accepted alternative'} /></Field>
                <Field label="Official program source" className="lg:col-span-3"><input type="url" className={fieldClass} value={program.sourceUrl || ''} onChange={event => updateProgram(index, 'sourceUrl', event.target.value)} placeholder="https://university.edu/program" /></Field>
              </div>
            </article>
          ))}
          {!formData.programs?.length ? <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-8 text-center"><GraduationCap className="mx-auto text-blue-600" /><h3 className="mt-3 font-heading text-xl font-bold">Build the program catalogue</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Add each course once. The public profile will group it automatically under Bachelor, Master’s, MBBS or another selected level.</p></div> : null}
        </div>
      </EditorSection>

      <EditorSection
        icon={<Coins size={20} />}
        title="University fee ledger"
        description="Keep university and other third party amounts itemized with recipient, refund position, valid period and source."
        action={<button type="button" onClick={() => setTopLevel('fees', [...(formData.fees || []), blankFee()])} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add fee</button>}
      >
        <div className="space-y-4">{(formData.fees || []).map((fee, index) => <article key={`${fee.item}-${index}`} className="rounded-2xl border border-slate-200 p-4"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Field label="Fee item"><input className={fieldClass} value={fee.item} onChange={event => updateFee(index, 'item', event.target.value)} placeholder="Application fee" /></Field><Field label="Amount"><input className={fieldClass} value={fee.cost} onChange={event => updateFee(index, 'cost', event.target.value)} placeholder="600 CNY" /></Field><Field label="Paid to"><input className={fieldClass} value={fee.recipient || ''} onChange={event => updateFee(index, 'recipient', event.target.value)} placeholder="University" /></Field><Field label="Refund position"><select className={fieldClass} value={fee.refundable || ''} onChange={event => updateFee(index, 'refundable', event.target.value)}><option value="">Select</option><option value="yes">Refundable</option><option value="no">Non refundable</option><option value="conditional">Conditional</option></select></Field><Field label="Valid for"><input className={fieldClass} value={fee.validFor || ''} onChange={event => updateFee(index, 'validFor', event.target.value)} placeholder="Current intake" /></Field><Field label="Notes" className="lg:col-span-2"><input className={fieldClass} value={fee.notes || ''} onChange={event => updateFee(index, 'notes', event.target.value)} /></Field><Field label="Official source"><input type="url" className={fieldClass} value={fee.sourceUrl || ''} onChange={event => updateFee(index, 'sourceUrl', event.target.value)} placeholder="https://..." /></Field></div><button type="button" onClick={() => setTopLevel('fees', (formData.fees || []).filter((_, itemIndex) => itemIndex !== index))} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-rose-600"><Trash2 size={14} /> Remove fee</button></article>)}</div>
      </EditorSection>

      <EditorSection
        icon={<Sparkles size={20} />}
        title="China scholarship studio"
        description="Add coverage, eligible programs, renewal, deadline and source so the public scholarship section can show a complete, visual comparison."
        action={<button type="button" onClick={() => setTopLevel('scholarships', [...(formData.scholarships || []), blankScholarship()])} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add scholarship</button>}
      >
        <div className="grid gap-5 xl:grid-cols-2">{(formData.scholarships || []).map((scholarship, index) => <article key={`${scholarship.title}-${index}`} className="relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-[#08263c] to-[#174f7a] p-5 text-white"><div className="absolute -right-10 -top-10 size-32 rounded-full border-[1.5rem] border-white/5" /><div className="relative"><div className="flex items-start justify-between"><div><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#8ed0ee]">Scholarship {String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 font-heading text-xl font-bold">{scholarship.title || 'New scholarship option'}</h3></div><button type="button" onClick={() => setTopLevel('scholarships', (formData.scholarships || []).filter((_, itemIndex) => itemIndex !== index))} className="grid size-9 place-items-center rounded-lg bg-white/10 text-white" aria-label={`Remove scholarship ${index + 1}`}><Trash2 size={16} /></button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Scholarship title"><input className={fieldClass} value={scholarship.title} onChange={event => updateScholarship(index, 'title', event.target.value)} /></Field><Field label="Type"><input className={fieldClass} value={scholarship.type || ''} onChange={event => updateScholarship(index, 'type', event.target.value)} placeholder="Full, partial, tiered" /></Field><Field label="Headline amount"><input className={fieldClass} value={scholarship.amount || ''} onChange={event => updateScholarship(index, 'amount', event.target.value)} placeholder="Up to 100% tuition" /></Field><Field label="Coverage"><input className={fieldClass} value={scholarship.coverage || ''} onChange={event => updateScholarship(index, 'coverage', event.target.value)} placeholder="Tuition, hostel, stipend" /></Field><Field label="Eligible programs" className="md:col-span-2"><input className={fieldClass} value={scholarship.eligiblePrograms?.join(', ') || ''} onChange={event => updateScholarship(index, 'eligiblePrograms', splitComma(event.target.value))} placeholder="Software Engineering, Civil Engineering" /></Field><Field label="Renewal"><input className={fieldClass} value={scholarship.renewal || ''} onChange={event => updateScholarship(index, 'renewal', event.target.value)} placeholder="Annual academic review" /></Field><Field label="Deadline"><input className={fieldClass} value={scholarship.deadline || ''} onChange={event => updateScholarship(index, 'deadline', event.target.value)} placeholder="30 May" /></Field><Field label="Eligibility and conditions" className="md:col-span-2"><textarea className={`${fieldClass} min-h-20`} value={scholarship.condition || ''} onChange={event => updateScholarship(index, 'condition', event.target.value)} /></Field><Field label="Benefits, one item per line" className="md:col-span-2"><textarea className={`${fieldClass} min-h-24`} value={scholarship.details?.join('\n') || ''} onChange={event => updateScholarship(index, 'details', splitLines(event.target.value))} /></Field><Field label="Official scholarship source" className="md:col-span-2"><input type="url" className={fieldClass} value={scholarship.sourceUrl || ''} onChange={event => updateScholarship(index, 'sourceUrl', event.target.value)} placeholder="https://..." /></Field><Field label="Status"><select className={fieldClass} value={scholarship.status || 'active'} onChange={event => updateScholarship(index, 'status', event.target.value)}><option value="active">Active option</option><option value="planned">Planned option</option><option value="closed">Closed option</option></select></Field></div></div></article>)}</div>
      </EditorSection>

      <EditorSection icon={<FileCheck2 size={20} />} title="Admission and evidence" description="Maintain the admissions timeline, document checklist, recognition source and relationship evidence.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="University deadline summary"><input name="deadlines.application" className={fieldClass} value={formData.deadlines?.application || ''} onChange={handleNestedChange} placeholder="30 May" /></Field>
          <Field label="Start date summary"><input name="deadlines.startDate" className={fieldClass} value={formData.deadlines?.startDate || ''} onChange={handleNestedChange} placeholder="September Intake" /></Field>
          <Field label="Required documents, one per line"><textarea className={`${fieldClass} min-h-36`} value={formData.documents?.join('\n') || ''} onChange={event => setTopLevel('documents', splitLines(event.target.value))} /></Field>
          <Field label="Student notes, one per line"><textarea className={`${fieldClass} min-h-36`} value={formData.notes?.join('\n') || ''} onChange={event => setTopLevel('notes', splitLines(event.target.value))} /></Field>
          <Field label="Recognition authority"><input className={fieldClass} value={formData.recognitionAuthority || ''} onChange={event => setTopLevel('recognitionAuthority', event.target.value)} placeholder="Relevant authority or registry" /></Field>
          <Field label="Recognition source"><input type="url" className={fieldClass} value={formData.recognitionSourceUrl || ''} onChange={event => setTopLevel('recognitionSourceUrl', event.target.value)} placeholder="https://..." /></Field>
          <Field label="Relationship type"><select className={fieldClass} value={formData.relationshipType || 'unverified'} onChange={event => setTopLevel('relationshipType', event.target.value)}><option value="unverified">Confirm before application</option><option value="direct_partner">Direct partner</option><option value="authorized_representative">Authorized representative</option><option value="network_access">Network access</option><option value="public_direct_application">Public direct application</option></select></Field>
          <Field label="Relationship evidence"><input type="url" className={fieldClass} value={formData.relationshipEvidenceUrl || ''} onChange={event => setTopLevel('relationshipEvidenceUrl', event.target.value)} placeholder="https://..." /></Field>
          <Field label="Additional source URLs" className="md:col-span-2"><textarea className={`${fieldClass} min-h-24`} value={formData.sourceUrls?.join('\n') || ''} onChange={event => setTopLevel('sourceUrls', splitLines(event.target.value))} placeholder="One official URL per line" /></Field>
        </div>
      </EditorSection>

      <EditorSection icon={<Trophy size={20} />} title="Rankings and reputation" description="Provide evidence-backed ranking data. Never use a naked 'World #' without publisher attribution.">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="World Ranking (Value)"><input type="number" className={fieldClass} value={formData.rankings?.world || ''} onChange={event => setFormData(previous => ({ ...previous, rankings: { ...previous.rankings, world: parseInt(event.target.value) || undefined } }))} placeholder="e.g. 150" /></Field>
          <Field label="National Ranking (Value)"><input type="number" className={fieldClass} value={formData.rankings?.national || ''} onChange={event => setFormData(previous => ({ ...previous, rankings: { ...previous.rankings, national: parseInt(event.target.value) || undefined } }))} placeholder="e.g. 12" /></Field>
          <Field label="Country Ranking (Value)"><input type="number" className={fieldClass} value={formData.rankings?.country || ''} onChange={event => setFormData(previous => ({ ...previous, rankings: { ...previous.rankings, country: parseInt(event.target.value) || undefined } }))} placeholder="e.g. 15" /></Field>
        </div>
      </EditorSection>

      <EditorSection icon={<ShieldCheck size={20} />} title="Governance & Verification" description="Track editorial status to ensure compliance with the Better Education Standard.">
        <div className="grid gap-4 md:grid-cols-3 border-t-4 border-t-emerald-500 pt-2">
          <Field label="Verification Status">
            <select className={fieldClass} value={formData.verificationStatus || 'under_verification'} onChange={event => setTopLevel('verificationStatus', event.target.value)}>
              <option value="verified">Verified (Accurate)</option>
              <option value="under_verification">Under Verification (Pending)</option>
              <option value="expired">Expired (Needs Update)</option>
            </select>
          </Field>
          <Field label="Last Verified Date">
            <input type="date" className={fieldClass} value={formData.lastVerifiedAt ? new Date(formData.lastVerifiedAt).toISOString().split('T')[0] : ''} onChange={event => setTopLevel('lastVerifiedAt', event.target.value ? new Date(event.target.value) : undefined)} />
          </Field>
          <Field label="Verification Expiry">
            <input type="date" className={fieldClass} value={formData.verificationExpiresAt ? new Date(formData.verificationExpiresAt).toISOString().split('T')[0] : ''} onChange={event => setTopLevel('verificationExpiresAt', event.target.value ? new Date(event.target.value) : undefined)} />
          </Field>
        </div>
      </EditorSection>

      <EditorSection icon={<BookOpenCheck size={20} />} title="Legacy summary and publishing" description="Program records automatically update these summary fields when saved. Use them while completing the full catalogue.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Summary tuition"><input className={fieldClass} value={formData.details?.tuition || ''} onChange={event => setFormData(previous => ({ ...previous, details: { ...(previous.details || { majors: [], tuitionDetails: [] }), tuition: event.target.value } }))} placeholder="17,500 – 22,000 CNY/Year" /></Field>
          <Field label="Summary tuition details"><textarea className={`${fieldClass} min-h-24`} value={formData.details?.tuitionDetails?.join('\n') || ''} onChange={event => setFormData(previous => ({ ...previous, details: { ...(previous.details || { majors: [], tuition: '' }), tuitionDetails: splitLines(event.target.value) } }))} /></Field>
          <div className="rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-600"><strong className="text-slate-950">Levels:</strong> {programSummary.levels.join(', ') || formData.degree?.join(', ') || 'Add program records'}<br /><strong className="text-slate-950">Programs:</strong> {programSummary.names.join(', ') || formData.details?.majors?.join(', ') || 'Add program records'}<br /><strong className="text-slate-950">Languages:</strong> {programSummary.languages.join(', ') || formData.taught?.join(', ') || 'Add program records'}<br /><strong className="text-slate-950">Intakes:</strong> {programSummary.intakes.join(', ') || formData.intake?.join(', ') || 'Add program records'}</div>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700"><input type="checkbox" checked={formData.isActive !== false} onChange={event => setTopLevel('isActive', event.target.checked)} className="size-5" /> Publish this university profile</label>
        </div>
      </EditorSection>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,.08)] backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><p className="hidden text-xs text-slate-500 sm:block">Programs, fees and scholarships are synchronized into one university record.</p><div className="ml-auto flex gap-3"><button type="button" onClick={() => router.back()} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700">Cancel</button><button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />} Save university</button></div></div></div>
    </form>
  );
}

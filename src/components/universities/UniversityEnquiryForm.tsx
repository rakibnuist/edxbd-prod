'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { captureUtmParameters, getUtmParameters, trackAssessmentStart, trackAssessmentSubmit } from '@/lib/conversion-events';
import { universityEnquiryPayload, validateUniversityEnquiry, type UniversityEnquiryFields, type UniversityEnquiryErrors } from '@/lib/university-enquiry';

type Props = {
  university: { name: string; country: string; slug: string };
  programs: { id: string; name: string; level: string }[];
  selectedProgramId: string;
  onProgram: (id: string) => void;
  scholarship?: string;
};
const controlClass = 'mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-[#08263c] outline-none transition focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/15';
const emptyFields: UniversityEnquiryFields = { name: '', phone: '', email: '', consent: false };

export default function UniversityEnquiryForm({ university, programs, selectedProgramId, onProgram, scholarship }: Props) {
  const id = useId();
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState<UniversityEnquiryErrors>({});
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [requestError, setRequestError] = useState('');
  const started = useRef(false);
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const selected = programs.find(program => program.id === selectedProgramId);
  useEffect(() => { captureUtmParameters(); setReady(true); }, []);
  const start = () => {
    if (started.current) return;
    started.current = true;
    trackAssessmentStart({ destination: university.country, label: 'university_profile_enquiry', university_slug: university.slug });
  };
  const update = <K extends keyof UniversityEnquiryFields>(key: K, value: UniversityEnquiryFields[K]) => {
    start(); setFields(current => ({ ...current, [key]: value }));
    if (errors[key]) setErrors(current => ({ ...current, [key]: undefined }));
  };
  const validateField = (key: keyof UniversityEnquiryFields) => setErrors(current => ({ ...current, [key]: validateUniversityEnquiry(fields)[key] }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready || submitting.current) return;
    const nextErrors = validateUniversityEnquiry(fields);
    setErrors(nextErrors); setRequestError('');
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { (formRef.current?.elements.namedItem(firstError) as HTMLElement | null)?.focus(); return; }
    submitting.current = true; setStatus('pending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...universityEnquiryPayload(fields, { university: university.name, country: university.country, program: selected?.name, level: selected?.level, scholarship }, new Date().toISOString()), landingPage: window.location.pathname, utm: getUtmParameters() }),
      });
      if (!response.ok) throw new Error('We couldn’t send your enquiry. Your details are saved here; please try again.');
      trackAssessmentSubmit({ destination: university.country, label: 'university_profile_enquiry', university_slug: university.slug });
      setStatus('success');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Please try sending your enquiry again.');
      setStatus('idle');
    } finally { submitting.current = false; }
  };
  return <section id="university-enquiry" aria-labelledby={`${id}-title`} className="scroll-mt-36 overflow-hidden rounded-2xl border border-[#c8d8e4] bg-white shadow-[0_12px_40px_rgba(8,38,60,0.08)]">
    <div className="border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6"><p className="flex items-center gap-2 text-xs font-semibold text-[#17624f]"><MessageCircle size={15} />Personal guidance from EduExpress</p><h2 id={`${id}-title`} className="mt-2 text-2xl font-bold tracking-tight text-[#08263c]">Get your university plan</h2><p className="mt-2 text-sm leading-6 text-slate-500">Eligibility, scholarship options and study costs, matched to you.</p></div>
    {status === 'success' ? <div role="status" className="px-6 py-8"><CheckCircle2 size={36} className="text-[#17624f]" /><h3 className="mt-4 text-xl font-bold text-[#08263c]">Your enquiry is with our team.</h3><p className="mt-3 text-sm leading-7 text-slate-600">A counselor will review your interest in {university.name} and contact you by phone or email about your program, funding options and next steps.</p><p className="mt-4 rounded-lg bg-[#edf6f1] p-4 text-sm leading-6 text-[#17624f]">Keep exploring the programs and fees below while we review your enquiry.</p></div> : <form ref={formRef} onSubmit={submit} method="post" action="/api/leads" noValidate autoComplete="on" className="flex flex-col gap-3.5 p-5 sm:p-6">
      <noscript><p className="text-sm leading-6 text-slate-600">Enable JavaScript to send this form, or <Link href="/contact" className="font-semibold text-[#174f7a] underline">contact EduExpress</Link>.</p></noscript>
      {(['name', 'phone', 'email'] as const).map(key => <div key={key}><label htmlFor={`${id}-${key}`} className="text-xs font-semibold text-slate-600">{{name: 'Full name', phone: 'WhatsApp / phone number', email: 'Email address'}[key]} <span aria-hidden="true">*</span></label><input id={`${id}-${key}`} name={key} type={key === 'name' ? 'text' : key === 'phone' ? 'tel' : 'email'} autoComplete={key === 'phone' ? 'tel' : key} inputMode={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'} required maxLength={key === 'name' ? 120 : key === 'email' ? 254 : 30} value={fields[key]} onChange={event => update(key, event.target.value)} onBlur={() => validateField(key)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${id}-${key}-error` : undefined} className={`${controlClass} ${errors[key] ? 'border-red-500' : ''}`} />{errors[key] && <p id={`${id}-${key}-error`} className="mt-1 text-xs leading-5 text-red-700">{errors[key]}</p>}</div>)}
      {programs.length > 0 && <div><label htmlFor={`${id}-program`} className="text-xs font-semibold text-slate-600">Program interest</label><select id={`${id}-program`} name="program" value={selectedProgramId} onChange={event => { start(); onProgram(event.target.value); }} className={controlClass}><option value="">Help me choose</option>{[...new Set(programs.map(program => program.level))].map(level => <optgroup key={level} label={level}>{programs.filter(program => program.level === level).map(program => <option key={program.id} value={program.id}>{program.level} · {program.name}</option>)}</optgroup>)}</select></div>}
      <div><label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-500"><input name="consent" type="checkbox" required checked={fields.consent} onChange={event => update('consent', event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? `${id}-consent-error` : undefined} className="mt-1 size-4 shrink-0 accent-[#174f7a]" /><span>I agree to the <Link href="/privacy" className="font-semibold text-[#174f7a] underline underline-offset-2">privacy policy</Link> and contact about this enquiry.</span></label>{errors.consent && <p id={`${id}-consent-error`} className="mt-1 text-xs text-red-700">{errors.consent}</p>}</div>
      {requestError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700">{requestError}</p>}
      <button type="submit" disabled={!ready || status === 'pending'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#efa93d] px-4 py-3 text-sm font-bold text-[#08263c] transition hover:bg-[#e39a2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174f7a] disabled:cursor-wait disabled:opacity-70">{status === 'pending' ? <><Loader2 size={17} className="animate-spin" />Sending your enquiry…</> : <>Get my university plan<ArrowRight size={17} /></>}</button>
      <p className="text-center text-xs leading-5 text-slate-500">An enquiry with EduExpress International. No payment or documents required here.</p>
    </form>}
  </section>;
}

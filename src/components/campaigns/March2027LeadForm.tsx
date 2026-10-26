'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, LockKeyhole, MessageCircle, X } from 'lucide-react';
import { analyticsAllowed, captureUtmParameters, createConversionEventId, getUtmParameters, trackAssessmentStart, trackAssessmentSubmit, trackConversion, trackWhatsAppClick } from '@/lib/conversion-events';
import { emptyMarchEnquiry, marchAcademicLevels, marchEnquiryPayload, marchStudyRoutes, validateMarchEnquiry, type MarchEnquiryErrors, type MarchEnquiryFields } from '@/lib/march-campaign-enquiry';

type Selection = { university: string; program: string } | null;
type Props = { whatsappNumber: string; route: string; onRoute: (route: string) => void; selection: Selection; onClearSelection: () => void };
const inputClass = 'mt-1.5 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-[#0b2f4a] outline-none transition focus:border-[#174f7a] focus:ring-2 focus:ring-[#174f7a]/20';
const context = () => ({ destination: 'china', label: 'china_march_2027_landing', page_location: window.location.origin + window.location.pathname });

export default function March2027LeadForm({ whatsappNumber, route, onRoute, selection, onClearSelection }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<MarchEnquiryFields>(emptyMarchEnquiry);
  const [errors, setErrors] = useState<MarchEnquiryErrors>({});
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
  const [requestError, setRequestError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const started = useRef(false);
  const currentFields = { ...fields, route };
  useEffect(() => {
    captureUtmParameters();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gate submission until after hydration
    setReady(true);
  }, []);
  useEffect(() => { if (status === 'done') headingRef.current?.focus(); }, [status]);
  const start = () => { if (!started.current) { started.current = true; trackAssessmentStart(context()); } };
  const update = <K extends keyof MarchEnquiryFields>(key: K, value: MarchEnquiryFields[K]) => {
    start(); setFields(old => ({ ...old, [key]: value })); setErrors(old => ({ ...old, [key]: undefined })); setRequestError('');
  };
  const validateField = (key: keyof MarchEnquiryFields) => setErrors(old => ({ ...old, [key]: validateMarchEnquiry(currentFields)[key] }));
  const firstErrorFocus = (next: MarchEnquiryErrors) => (formRef.current?.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready || busy.current) return;
    const allErrors = validateMarchEnquiry(currentFields);
    if (step === 1) {
      const next = Object.fromEntries(Object.entries(allErrors).filter(([key]) => ['academicLevel', 'result', 'route'].includes(key))) as MarchEnquiryErrors;
      setErrors(next);
      if (Object.keys(next).length) { firstErrorFocus(next); return; }
      trackConversion('assessment_step_completed', { ...context(), step: 'academic_profile' });
      setStep(2); requestAnimationFrame(() => (formRef.current?.elements.namedItem('name') as HTMLElement | null)?.focus()); return;
    }
    setErrors(allErrors); setRequestError('');
    if (Object.keys(allErrors).length) {
      if (allErrors.academicLevel || allErrors.result || allErrors.route) setStep(1);
      requestAnimationFrame(() => firstErrorFocus(allErrors)); return;
    }
    busy.current = true; setStatus('pending');
    const eventId = createConversionEventId('march_2027_lead');
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(marchEnquiryPayload(currentFields, { university: selection?.university, program: selection?.program, consentTimestamp: new Date().toISOString(), utm: getUtmParameters(), trackingConsent: process.env.NODE_ENV === 'production' && analyticsAllowed(), eventId })) });
      if (!response.ok) throw new Error('We couldn’t send your request. Your details are still here. Please try again or call us.');
      trackAssessmentSubmit({ ...context(), route, eventId }); setStatus('done');
    } catch (error) { setRequestError(error instanceof Error ? error.message : 'We couldn’t send your request. Please try again.'); setStatus('idle'); }
    finally { busy.current = false; }
  };
  const errorFor = (key: keyof MarchEnquiryFields) => errors[key] && <p id={`march-${key}-error`} className="mt-1 text-xs leading-5 text-red-700">{errors[key]}</p>;
  const ariaFor = (key: keyof MarchEnquiryFields) => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `march-${key}-error` : undefined });
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I would like to speak with a counsellor about a China March 2027 study plan.')}`;

  return <section id="march-2027-assessment" aria-labelledby="march-form-title" className="scroll-mt-5 overflow-hidden rounded-2xl border border-[#d5e1e9] bg-white shadow-[0_16px_48px_rgba(11,47,74,.12)]">
    <div className="bg-[#0b2f4a] px-5 py-5 text-white sm:px-7">
      <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-[#b4d9ef]">Personal guidance from EduExpress</p>{status !== 'done' && <span className="text-xs text-white/75">Step {step} / 2</span>}</div>
      <h2 id="march-form-title" className="mt-2 text-[1.45rem] font-bold leading-snug text-white">Get my free study plan</h2>
      <p className="mt-2 text-sm leading-6 text-white/80">Your university options, funding eligibility and study costs, matched to you.</p>
    </div>
    {status === 'done' ? <div className="px-5 py-6 sm:px-7" role="status"><CheckCircle2 className="text-[#17624f]" size={34}/><h3 ref={headingRef} tabIndex={-1} className="mt-4 text-xl font-bold outline-none">Your request is with our team.</h3><p className="mt-3 text-sm leading-7 text-slate-600">Our China admissions team will review your profile and contact you by phone or email{selection ? `. Your selected option: ${selection.university} — ${selection.program}` : '.'}</p><div className="mt-5 rounded-xl bg-[#f0f6fa] p-4"><h4 className="text-sm font-bold">Get ready for your consultation</h4><ul className="mt-2 space-y-2 text-sm text-slate-600">{['Your academic certificates and transcripts', 'Your preferred subject and study budget', 'Your passport and language-test status'].map(item => <li key={item} className="flex gap-2"><Check size={15} className="mt-1 shrink-0 text-[#17624f]"/>{item}</li>)}</ul></div><a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ ...context(), label: 'march_2027_success_whatsapp' })} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#b9d8c9] bg-[#eef7f2] px-4 text-sm font-bold text-[#17624f]"><MessageCircle size={18}/> Talk to a counsellor</a></div> : <form ref={formRef} method="post" action="/api/leads" noValidate autoComplete="on" onSubmit={submit} onFocus={start} className="p-5 sm:p-7">
      <noscript><p>Enable JavaScript to send this form, or <Link href="/contact" className="underline">contact us</Link>.</p></noscript>
      <div className="mb-5 flex items-center gap-2 text-xs font-semibold"><span className={`flex size-6 items-center justify-center rounded-full ${step === 1 ? 'bg-[#174f7a] text-white' : 'bg-[#e5f2eb] text-[#17624f]'}`}>{step === 2 ? <Check size={13}/> : '1'}</span><span>Your studies</span><span className="h-px flex-1 bg-slate-200"/><span className={`flex size-6 items-center justify-center rounded-full ${step === 2 ? 'bg-[#174f7a] text-white' : 'bg-slate-100 text-slate-500'}`}>2</span><span className={step === 2 ? '' : 'text-slate-500'}>Contact</span></div>
      {selection && <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#f0f6fa] p-3 text-xs leading-5"><p className="flex-1"><strong>{selection.university}</strong><br/>{selection.program}</p><button type="button" aria-label="Remove selected university" disabled={status === 'pending'} onClick={onClearSelection} className="grid size-9 shrink-0 place-items-center rounded-md hover:bg-white"><X size={15}/></button></div>}
      <fieldset disabled={status === 'pending'} className="space-y-4">
        <legend className="sr-only">{step === 1 ? 'Your academic profile' : 'Your contact details'}</legend>
        {step === 1 ? <>
          <div><label htmlFor="march-academicLevel" className="text-sm font-semibold">Current qualification <span aria-hidden="true">*</span></label><select id="march-academicLevel" name="academicLevel" required value={fields.academicLevel} onChange={e => update('academicLevel', e.target.value)} onBlur={() => validateField('academicLevel')} {...ariaFor('academicLevel')} className={inputClass}><option value="">Select qualification</option>{marchAcademicLevels.map(item => <option key={item}>{item}</option>)}</select>{errorFor('academicLevel')}</div>
          <div><label htmlFor="march-result" className="text-sm font-semibold">Latest result / GPA <span aria-hidden="true">*</span></label><input id="march-result" name="result" required maxLength={120} value={fields.result} onChange={e => update('result', e.target.value)} onBlur={() => validateField('result')} placeholder="e.g. HSC GPA 4.50" {...ariaFor('result')} className={inputClass}/>{errorFor('result')}</div>
          <div><label htmlFor="march-route" className="text-sm font-semibold">What would you like to study? <span aria-hidden="true">*</span></label><select id="march-route" name="route" required value={route} onChange={e => { start(); onRoute(e.target.value); setErrors(old => ({ ...old, route: undefined })); }} onBlur={() => validateField('route')} {...ariaFor('route')} className={inputClass}><option value="">Select a study route</option>{marchStudyRoutes.map(item => <option key={item}>{item}</option>)}</select>{errorFor('route')}</div>
        </> : <>
          <div className="flex items-start justify-between gap-3 rounded-lg bg-[#f0f6fa] p-3 text-xs leading-5"><p>{fields.academicLevel}<br/><strong>{route}</strong></p><button type="button" onClick={() => { setStep(1); setErrors({}); }} className="min-h-9 px-2 font-semibold text-[#174f7a] underline">Edit</button></div>
          {(['name', 'phone', 'email'] as const).map(key => <div key={key}><label htmlFor={`march-${key}`} className="text-sm font-semibold">{{ name: 'Full name', phone: 'Phone / WhatsApp number', email: 'Email address' }[key]} <span aria-hidden="true">*</span></label><input id={`march-${key}`} name={key} type={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'} inputMode={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'} autoComplete={key === 'phone' ? 'tel' : key} required maxLength={key === 'name' ? 120 : key === 'phone' ? 30 : 254} value={fields[key]} onChange={e => update(key, e.target.value)} onBlur={() => validateField(key)} placeholder={{ name: 'Full name', phone: '01XXXXXXXXX', email: 'name@example.com' }[key]} {...ariaFor(key)} className={inputClass}/>{errorFor(key)}</div>)}
          <div><label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600"><input name="consent" type="checkbox" required checked={fields.consent} onChange={e => update('consent', e.target.checked)} {...ariaFor('consent')} className="mt-1 size-4 shrink-0 accent-[#174f7a]"/><span>I agree to be contacted about this enquiry and have read the <Link href="/privacy" className="font-semibold text-[#174f7a] underline">privacy policy</Link>.</span></label>{errorFor('consent')}</div>
        </>}
      </fieldset>
      {requestError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700">{requestError}</p>}
      <div className="mt-5 flex gap-2">{step === 2 && <button type="button" disabled={status === 'pending'} onClick={() => { setStep(1); setErrors({}); }} aria-label="Go to the previous step" className="grid min-h-12 w-12 shrink-0 place-items-center rounded-lg border border-slate-300"><ArrowLeft size={17}/></button>}<button type="submit" disabled={!ready || status === 'pending'} className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-lg bg-[#f2b544] px-4 py-3 text-sm font-bold text-[#0b2f4a] transition hover:bg-[#e9a92f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174f7a] disabled:cursor-wait disabled:opacity-60">{status === 'pending' ? <><Loader2 size={17} className="animate-spin"/> Sending your request…</> : <>{step === 1 ? 'Continue to contact details' : 'Get my free study plan'}<ArrowRight size={17}/></>}</button></div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs leading-5 text-slate-500"><LockKeyhole size={13} className="shrink-0"/>No payment or document upload required.</p>
    </form>}
  </section>;
}

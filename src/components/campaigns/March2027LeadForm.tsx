'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, Loader2, LockKeyhole, MessageCircle, ShieldCheck, Sparkles, X } from 'lucide-react';
import { analyticsAllowed, captureUtmParameters, createConversionEventId, getUtmParameters, trackAssessmentStart, trackAssessmentSubmit, trackConversion, trackWhatsAppClick } from '@/lib/conversion-events';
import { emptyMarchEnquiry, marchAcademicLevels, marchEnquiryPayload, marchStudyRoutes, validateMarchEnquiry, type MarchEnquiryErrors, type MarchEnquiryFields } from '@/lib/march-campaign-enquiry';

type Selection = { university: string; program: string } | null;
type Props = { whatsappNumber: string; route: string; onRoute: (route: string) => void; selection: Selection; onClearSelection: () => void };

const inputClass =
  'mt-1.5 h-12 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 text-sm font-medium text-[#0b2b45] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#12436b] focus:bg-white focus:ring-3 focus:ring-[#12436b]/15';

const context = () => ({
  destination: 'china',
  label: 'china_march_2027_landing',
  page_location: window.location.origin + window.location.pathname,
});

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

  useEffect(() => {
    if (status === 'done') headingRef.current?.focus();
  }, [status]);

  const start = () => {
    if (!started.current) {
      started.current = true;
      trackAssessmentStart(context());
    }
  };

  const update = <K extends keyof MarchEnquiryFields>(key: K, value: MarchEnquiryFields[K]) => {
    start();
    setFields(old => ({ ...old, [key]: value }));
    setErrors(old => ({ ...old, [key]: undefined }));
    setRequestError('');
  };

  const validateField = (key: keyof MarchEnquiryFields) =>
    setErrors(old => ({ ...old, [key]: validateMarchEnquiry(currentFields)[key] }));

  const firstErrorFocus = (next: MarchEnquiryErrors) =>
    (formRef.current?.elements.namedItem(Object.keys(next)[0]) as HTMLElement | null)?.focus();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready || busy.current) return;
    const allErrors = validateMarchEnquiry(currentFields);
    if (step === 1) {
      const next = Object.fromEntries(
        Object.entries(allErrors).filter(([key]) => ['academicLevel', 'result', 'route'].includes(key))
      ) as MarchEnquiryErrors;
      setErrors(next);
      if (Object.keys(next).length) {
        firstErrorFocus(next);
        return;
      }
      trackConversion('assessment_step_completed', { ...context(), step: 'academic_profile' });
      setStep(2);
      requestAnimationFrame(() => (formRef.current?.elements.namedItem('name') as HTMLElement | null)?.focus());
      return;
    }
    setErrors(allErrors);
    setRequestError('');
    if (Object.keys(allErrors).length) {
      if (allErrors.academicLevel || allErrors.result || allErrors.route) setStep(1);
      requestAnimationFrame(() => firstErrorFocus(allErrors));
      return;
    }
    busy.current = true;
    setStatus('pending');
    const eventId = createConversionEventId('march_2027_lead');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          marchEnquiryPayload(currentFields, {
            university: selection?.university,
            program: selection?.program,
            consentTimestamp: new Date().toISOString(),
            utm: getUtmParameters(),
            trackingConsent: process.env.NODE_ENV === 'production' && analyticsAllowed(),
            eventId,
          })
        ),
      });
      if (!response.ok)
        throw new Error('We couldn’t send your request. Your details are still here. Please try again or call us.');
      trackAssessmentSubmit({ ...context(), route, eventId });
      setStatus('done');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'We couldn’t send your request. Please try again.');
      setStatus('idle');
    } finally {
      busy.current = false;
    }
  };

  const errorFor = (key: keyof MarchEnquiryFields) =>
    errors[key] && (
      <p id={`march-${key}-error`} className="mt-1.5 text-xs font-medium leading-5 text-red-700">
        {errors[key]}
      </p>
    );

  const ariaFor = (key: keyof MarchEnquiryFields) => ({
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `march-${key}-error` : undefined,
  });

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hello, I would like to speak with a counsellor about a China March 2027 study plan.'
  )}`;

  return (
    <section
      id="march-2027-assessment"
      aria-labelledby="march-form-title"
      className="scroll-mt-20 overflow-hidden rounded-3xl border border-white/20 bg-white text-[#0b2b45] shadow-[0_24px_64px_rgba(7,30,48,0.28)]"
    >
      {/* Form Header */}
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#071f33] via-[#0b2b45] to-[#12436b] px-6 py-5 text-white sm:px-7 sm:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-lime/15 blur-2xl"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-lime">
            <Sparkles size={12} aria-hidden="true" />
            Personalised Study Plan
          </span>
          {status !== 'done' && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
              Step {step} / 2
            </span>
          )}
        </div>
        <h2 id="march-form-title" className="mt-3 font-display text-[1.55rem] font-black leading-tight text-white sm:text-[1.7rem]">
          Get my free study plan
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-white/80">
          Your university options, scholarship eligibility and written cost plan, matched to your profile.
        </p>
      </div>

      {status === 'done' ? (
        <div className="px-6 py-7 sm:px-7" role="status">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={28} />
          </div>
          <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-xl font-bold text-[#0b2b45] outline-none">
            Your request is with our team.
          </h3>
          <p className="mt-2.5 text-sm leading-7 text-slate-600">
            Our China admissions team will review your profile and contact you by phone or WhatsApp
            {selection ? `. Your selected option: ${selection.university} — ${selection.program}` : '.'}
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
            <h4 className="text-sm font-bold text-[#0b2b45]">Get ready for your consultation</h4>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-600">
              {[
                'Your academic certificates and transcripts',
                'Your preferred subject and study budget',
                'Your passport and language-test status',
              ].map(item => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ ...context(), label: 'march_2027_success_whatsapp' })}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
          >
            <MessageCircle size={18} /> Talk to a counsellor on WhatsApp
          </a>
        </div>
      ) : (
        <form
          ref={formRef}
          method="post"
          action="/api/leads"
          noValidate
          autoComplete="on"
          onSubmit={submit}
          onFocus={start}
          className="p-6 sm:p-7"
        >
          <noscript>
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              Enable JavaScript to send this form, or{' '}
              <Link href="/contact" className="font-semibold underline">
                contact us
              </Link>
              .
            </p>
          </noscript>

          {/* Progress Stepper */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 text-xs font-bold">
            <div
              className={`flex items-center justify-center gap-2 rounded-xl py-2 transition ${
                step === 1
                  ? 'bg-white text-[#0b2b45] shadow-xs'
                  : 'text-emerald-800'
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                  step === 1 ? 'bg-[#12436b] text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {step === 2 ? <Check size={12} strokeWidth={3} /> : '1'}
              </span>
              <span>Your studies</span>
            </div>
            <div
              className={`flex items-center justify-center gap-2 rounded-xl py-2 transition ${
                step === 2
                  ? 'bg-white text-[#0b2b45] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                  step === 2 ? 'bg-[#12436b] text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                2
              </span>
              <span>Contact details</span>
            </div>
          </div>

          {selection && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#cfe7f5] bg-[#f0f7fc] p-3.5 text-xs leading-5">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-[#12436b] text-white">
                <Building2 size={15} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2c6a97]">
                  Selected University Option
                </span>
                <p className="mt-0.5 font-bold text-[#0b2b45]">{selection.university}</p>
                <p className="text-slate-600">{selection.program}</p>
              </div>
              <button
                type="button"
                aria-label="Remove selected university"
                disabled={status === 'pending'}
                onClick={onClearSelection}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-800"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <fieldset disabled={status === 'pending'} className="space-y-4">
            <legend className="sr-only">{step === 1 ? 'Your academic profile' : 'Your contact details'}</legend>
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="march-academicLevel" className="block text-sm font-bold text-[#0b2b45]">
                    Current qualification <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <select
                    id="march-academicLevel"
                    name="academicLevel"
                    required
                    value={fields.academicLevel}
                    onChange={e => update('academicLevel', e.target.value)}
                    onBlur={() => validateField('academicLevel')}
                    {...ariaFor('academicLevel')}
                    className={inputClass}
                  >
                    <option value="">Select qualification</option>
                    {marchAcademicLevels.map(item => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  {errorFor('academicLevel')}
                </div>

                <div>
                  <label htmlFor="march-result" className="block text-sm font-bold text-[#0b2b45]">
                    Latest result / GPA <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id="march-result"
                    name="result"
                    required
                    maxLength={120}
                    value={fields.result}
                    onChange={e => update('result', e.target.value)}
                    onBlur={() => validateField('result')}
                    placeholder="e.g. HSC GPA 4.50 or CGPA 3.40"
                    {...ariaFor('result')}
                    className={inputClass}
                  />
                  {errorFor('result')}
                </div>

                <div>
                  <label htmlFor="march-route" className="block text-sm font-bold text-[#0b2b45]">
                    What would you like to study? <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <select
                    id="march-route"
                    name="route"
                    required
                    value={route}
                    onChange={e => {
                      start();
                      onRoute(e.target.value);
                      setErrors(old => ({ ...old, route: undefined }));
                    }}
                    onBlur={() => validateField('route')}
                    {...ariaFor('route')}
                    className={inputClass}
                  >
                    <option value="">Select a study route</option>
                    {marchStudyRoutes.map(item => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  {errorFor('route')}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-xs leading-5">
                  <div>
                    <span className="font-medium text-slate-500">{fields.academicLevel} · {fields.result}</span>
                    <p className="font-bold text-[#0b2b45]">{route}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrors({});
                    }}
                    className="rounded-lg bg-white px-3 py-1.5 font-bold text-[#12436b] shadow-2xs ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </div>

                {(['name', 'phone', 'email'] as const).map(key => (
                  <div key={key}>
                    <label htmlFor={`march-${key}`} className="block text-sm font-bold text-[#0b2b45]">
                      {{ name: 'Full name', phone: 'Phone / WhatsApp number', email: 'Email address' }[key]}{' '}
                      <span aria-hidden="true" className="text-red-600">*</span>
                    </label>
                    <input
                      id={`march-${key}`}
                      name={key}
                      type={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'}
                      inputMode={key === 'phone' ? 'tel' : key === 'email' ? 'email' : 'text'}
                      autoComplete={key === 'phone' ? 'tel' : key}
                      required
                      maxLength={key === 'name' ? 120 : key === 'phone' ? 30 : 254}
                      value={fields[key]}
                      onChange={e => update(key, e.target.value)}
                      onBlur={() => validateField(key)}
                      placeholder={{ name: 'Your full name', phone: '01XXXXXXXXX', email: 'name@example.com' }[key]}
                      {...ariaFor(key)}
                      className={inputClass}
                    />
                    {errorFor(key)}
                  </div>
                ))}

                <div>
                  <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    <input
                      name="consent"
                      type="checkbox"
                      required
                      checked={fields.consent}
                      onChange={e => update('consent', e.target.checked)}
                      {...ariaFor('consent')}
                      className="mt-0.5 size-4 shrink-0 accent-[#12436b]"
                    />
                    <span>
                      I agree to be contacted about this enquiry and have read the{' '}
                      <Link href="/privacy" className="font-semibold text-[#12436b] underline">
                        privacy policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errorFor('consent')}
                </div>
              </>
            )}
          </fieldset>

          {requestError && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium leading-6 text-red-700">
              {requestError}
            </p>
          )}

          <div className="mt-5 flex gap-2.5">
            {step === 2 && (
              <button
                type="button"
                disabled={status === 'pending'}
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
                aria-label="Go to the previous step"
                className="grid min-h-[3.25rem] w-12 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <button
              type="submit"
              disabled={!ready || status === 'pending'}
              className="ed-btn ed-btn-signal inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold text-petrol-800 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#12436b] disabled:cursor-wait disabled:opacity-60"
            >
              {status === 'pending' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending your request…
                </>
              ) : (
                <>
                  {step === 1 ? 'Continue to contact details' : 'Get my free study plan'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3.5 text-center text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole size={13} className="shrink-0 text-petrol-700" />
              No payment or document upload required
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
              <ShieldCheck size={14} className="shrink-0 text-emerald-600" />
              BDT 0 service fee before visa
            </span>
          </div>
        </form>
      )}
    </section>
  );
}

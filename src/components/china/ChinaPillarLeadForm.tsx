'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  chinaAcademicLevels,
  chinaPillarEnquiryPayload,
  chinaStudyRoutes,
  chinaTargetIntakes,
  emptyChinaEnquiry,
  validateChinaEnquiry,
  type ChinaEnquiryErrors,
  type ChinaEnquiryFields,
} from '@/lib/china-pillar-enquiry';
import { formatBangladeshPhone } from '@/lib/contact-format';
import {
  analyticsAllowed,
  captureUtmParameters,
  createConversionEventId,
  getUtmParameters,
  trackAssessmentStart,
  trackAssessmentSubmit,
  trackConversion,
  trackPhoneClick,
  trackWhatsAppClick,
} from '@/lib/conversion-events';
import { getConsentedSubmissionMetaParams } from '@/lib/meta-param-builder-client';
import { captureLandingFbclid, persistTrackingLeadId } from '@/lib/tracking-consent';
import { CHINA_SELECT_EVENT, type ChinaSelectDetail } from './ChinaSelectAction';

type Selection = { university: string; program?: string } | null;

type Props = {
  sectionId?: string;
  headingAs?: 'h2' | 'h3';
  phoneNumber: string;
  whatsappNumber: string;
  selectedRoute?: string;
  onRouteChange?: (route: string) => void;
};

const inputClass =
  'mt-1.5 h-12 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/70 px-3.5 text-[15px] font-medium text-[#0b2b45] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#12436b] focus:bg-white focus:ring-2 focus:ring-[#12436b]/15 sm:text-sm';

const ROUTE_ALIASES: Record<string, string> = {
  bachelor: 'Bachelor’s Degree',
  "bachelor's": 'Bachelor’s Degree',
  'bachelor’s': 'Bachelor’s Degree',
  'bachelor’s degree': 'Bachelor’s Degree',
  foundation: 'Foundation → Bachelor',
  'foundation -> bachelor': 'Foundation → Bachelor',
  'foundation → bachelor': 'Foundation → Bachelor',
  mbbs: 'MBBS in China',
  'mbbs in china': 'MBBS in China',
  medical: 'MBBS in China',
  master: 'Master’s Degree',
  masters: 'Master’s Degree',
  "master's": 'Master’s Degree',
  'master’s degree': 'Master’s Degree',
  phd: 'PhD',
  language: 'Chinese Language',
  'chinese language': 'Chinese Language',
  scholarship: 'Scholarship Assessment',
  'scholarship assessment': 'Scholarship Assessment',
  csc: 'Scholarship Assessment',
};

export default function ChinaPillarLeadForm({
  sectionId = 'china-fit-form',
  headingAs = 'h2',
  phoneNumber,
  whatsappNumber,
  selectedRoute,
  onRouteChange,
}: Props) {
  const uid = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [fields, setFields] = useState<ChinaEnquiryFields>(emptyChinaEnquiry);
  const [selection, setSelection] = useState<Selection>(null);
  const [errors, setErrors] = useState<ChinaEnquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'pending' | 'done'>('idle');
  const [requestError, setRequestError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const started = useRef(false);

  const activeRoute = selectedRoute !== undefined ? selectedRoute : fields.route;
  const currentFields: ChinaEnquiryFields = { ...fields, route: activeRoute };

  useEffect(() => {
    captureLandingFbclid();
    captureUtmParameters();

    try {
      const params = new URLSearchParams(window.location.search);
      const rawRoute = params.get('route')?.trim();
      const rawUni = params.get('university')?.trim();
      const rawIntake = params.get('intake')?.trim();
      const resolvedRoute = rawRoute
        ? ROUTE_ALIASES[rawRoute.toLowerCase()] ||
          (chinaStudyRoutes.includes(rawRoute as (typeof chinaStudyRoutes)[number]) ? rawRoute : undefined)
        : undefined;

      if (resolvedRoute || rawUni || rawIntake) {
        queueMicrotask(() => {
          if (resolvedRoute) {
            onRouteChange?.(resolvedRoute);
            setFields(old => ({ ...old, route: resolvedRoute }));
          }
          if (rawUni) setSelection({ university: rawUni.slice(0, 120) });
          if (rawIntake && chinaTargetIntakes.includes(rawIntake as (typeof chinaTargetIntakes)[number])) {
            setFields(old => ({ ...old, intake: rawIntake }));
          }
        });
      }
    } catch {
      // Ignore query-string parse issues
    }
  }, [onRouteChange]);

  useEffect(() => {
    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<ChinaSelectDetail>).detail;
      if (!detail) return;
      if (detail.route) {
        const resolved =
          ROUTE_ALIASES[detail.route.toLowerCase()] ||
          (chinaStudyRoutes.includes(detail.route as (typeof chinaStudyRoutes)[number])
            ? detail.route
            : detail.route);
        onRouteChange?.(resolved);
        setFields(old => ({ ...old, route: resolved }));
        setErrors(old => ({ ...old, route: undefined }));
      }
      if (detail.intake) {
        setFields(old => ({ ...old, intake: detail.intake! }));
      }
      if (detail.university) {
        setSelection({ university: detail.university, program: detail.program });
      }
      if (status === 'done') {
        setStatus('idle');
        setStep(1);
      }
    };

    window.addEventListener(CHINA_SELECT_EVENT, handleSelect);
    return () => window.removeEventListener(CHINA_SELECT_EVENT, handleSelect);
  }, [onRouteChange, status]);

  useEffect(() => {
    if (status === 'done') headingRef.current?.focus();
  }, [status]);

  const context = () => ({
    destination: 'china',
    label: `china_study_landing_${sectionId}`,
    page_location: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '',
  });

  const start = () => {
    if (!started.current) {
      started.current = true;
      trackAssessmentStart(context());
    }
  };

  const update = <K extends keyof ChinaEnquiryFields>(key: K, value: ChinaEnquiryFields[K]) => {
    start();
    if (key === 'route') onRouteChange?.(String(value));
    setFields(old => ({ ...old, [key]: value }));
    setErrors(old => ({ ...old, [key]: undefined }));
    setRequestError('');
  };

  const validateField = (key: keyof ChinaEnquiryFields) => {
    const val = currentFields[key];
    const hasValue = typeof val === 'boolean' ? val : String(val ?? '').trim().length > 0;
    if (!hasValue && !errors[key]) return;
    setErrors(old => ({ ...old, [key]: validateChinaEnquiry(currentFields)[key] }));
  };

  const firstErrorFocus = (next: ChinaEnquiryErrors) => {
    const firstKey = Object.keys(next)[0];
    if (!firstKey) return;
    (formRef.current?.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
  };

  const continueToStep2 = () => {
    if (busy.current) return;
    start();
    const allErrors = validateChinaEnquiry(currentFields);
    const next = Object.fromEntries(
      Object.entries(allErrors).filter(([key]) => ['academicLevel', 'result', 'route'].includes(key)),
    ) as ChinaEnquiryErrors;
    setErrors(next);
    setRequestError('');
    if (Object.keys(next).length) {
      firstErrorFocus(next);
      return;
    }
    trackConversion('assessment_step_completed', { ...context(), step: 'academic_profile' });
    setErrors({});
    setStep(2);
    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    if (step === 1) {
      continueToStep2();
      return;
    }

    const honeypot = (formRef.current?.elements.namedItem('companyWebsite') as HTMLInputElement | null)?.value;
    if (honeypot) {
      setStatus('done');
      return;
    }

    const allErrors = validateChinaEnquiry(currentFields);
    setErrors(allErrors);
    setRequestError('');
    if (Object.keys(allErrors).length) {
      if (allErrors.academicLevel || allErrors.result || allErrors.route) setStep(1);
      requestAnimationFrame(() => firstErrorFocus(allErrors));
      return;
    }

    busy.current = true;
    setStatus('pending');
    const eventId = createConversionEventId('china_lead');

    try {
      const allowTracking = analyticsAllowed();
      const metaParams = allowTracking ? await getConsentedSubmissionMetaParams().catch(() => ({})) : {};
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          chinaPillarEnquiryPayload(currentFields, {
            university: selection?.university,
            program: selection?.program,
            consentTimestamp: new Date().toISOString(),
            utm: getUtmParameters(),
            trackingConsent: allowTracking,
            eventId,
            ...metaParams,
          }),
        ),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          typeof data?.error === 'string' && data.error.trim()
            ? data.error
            : 'We could not send your request. Your details are still here. Please try again or call us.',
        );
      }

      if (typeof data?.leadId === 'string') {
        persistTrackingLeadId(data.leadId);
      }

      trackAssessmentSubmit({ ...context(), route: activeRoute, eventId });
      setStatus('done');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'We could not send your request. Please try again.');
      setStatus('idle');
    } finally {
      busy.current = false;
    }
  };

  const resetForm = () => {
    setFields(emptyChinaEnquiry);
    onRouteChange?.('');
    setSelection(null);
    setErrors({});
    setRequestError('');
    setStep(1);
    setStatus('idle');
    started.current = false;
  };

  const errorFor = (key: keyof ChinaEnquiryFields) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="mt-1.5 text-xs font-medium leading-5 text-red-700" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const ariaFor = (key: keyof ChinaEnquiryFields) => ({
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });

  const cleanDigits = whatsappNumber.replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(
    `Assalamu alaikum. I would like a free Study in China plan${activeRoute ? ` (${activeRoute})` : ''}${selection ? ` — ${selection.university}` : ''}.`,
  )}`;
  const telHref = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
  const HeadingTag = headingAs;

  return (
    <section
      id={sectionId}
      aria-labelledby={`${uid}-form-title`}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-[#0b2b45] shadow-[0_24px_64px_rgba(7,30,48,0.22)]"
    >
      {/* Form Header */}
      <div className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#071f33] via-[#0b2b45] to-[#12436b] px-6 py-5 text-white sm:px-7 sm:py-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-lime/15 blur-2xl" />
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-lime">
            <Sparkles size={12} aria-hidden="true" />
            Free China Study Plan
          </span>
          {status !== 'done' && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
              Step {step} / 2 · 2 min
            </span>
          )}
        </div>
        <HeadingTag id={`${uid}-form-title`} className="mt-3 font-display text-[1.5rem] font-black leading-tight text-white sm:text-[1.68rem]">
          Check your university &amp; scholarship fit
        </HeadingTag>
        <p className="mt-1.5 text-sm leading-6 text-white/80">
          Get matched universities, CSC or tuition-waiver options, and an itemised written cost sheet.
        </p>
      </div>

      {status === 'done' ? (
        <div className="px-6 py-7 sm:px-7" role="status">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={28} aria-hidden="true" />
          </div>
          <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-xl font-bold text-[#0b2b45] outline-none">
            Your China study plan request is received.
          </h3>
          <p className="mt-2.5 text-sm leading-7 text-slate-600">
            A China admissions counsellor at our Dhanmondi office will review your profile and reach out within one working day
            {selection ? ` regarding ${selection.university}` : ''}.
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
            <p className="text-sm font-bold text-[#0b2b45]">Keep ready for your call</p>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-600">
              {[
                'SSC, HSC or Bachelor certificates and mark sheets',
                'Target subject, teaching language and yearly family budget',
                'Passport or IELTS / MOI status (if available)',
              ].map(item => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 grid gap-2.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ ...context(), label: 'china_form_success_whatsapp' })}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 text-sm font-bold text-[#06251a] transition hover:brightness-95"
            >
              <MessageCircle size={18} aria-hidden="true" /> Continue on WhatsApp now
            </a>
            <Link href="/china-universities" className="ed-btn ed-btn-outline min-h-11">
              Browse Chinese universities <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <button type="button" onClick={resetForm} className="mt-4 block w-full text-center text-sm font-semibold text-slate-500 underline underline-offset-4 hover:text-[#0b2b45]">
            Submit another profile
          </button>
        </div>
      ) : (
        <form ref={formRef} method="post" action="/api/leads" noValidate autoComplete="on" onSubmit={submit} onFocus={start} className="p-6 sm:p-7">
          <noscript>
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              Enable JavaScript to submit online, or call us directly at {formatBangladeshPhone(phoneNumber)}.
            </p>
          </noscript>

          {/* 2-Step Progress Stepper */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 text-xs font-bold">
            <div className={`flex items-center justify-center gap-2 rounded-xl py-2 transition ${step === 1 ? 'bg-white text-[#0b2b45] shadow-sm' : 'text-emerald-800'}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-[11px] ${step === 1 ? 'bg-[#12436b] text-white' : 'bg-emerald-600 text-white'}`}>
                {step === 2 ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : '1'}
              </span>
              <span>Academic profile</span>
            </div>
            <div className={`flex items-center justify-center gap-2 rounded-xl py-2 transition ${step === 2 ? 'bg-white text-[#0b2b45] shadow-sm' : 'text-slate-500'}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-[11px] ${step === 2 ? 'bg-[#12436b] text-white' : 'bg-slate-300 text-slate-700'}`}>
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2c6a97]">Selected University</span>
                <p className="mt-0.5 font-bold text-[#0b2b45]">{selection.university}</p>
                {selection.program && <p className="text-slate-600">{selection.program}</p>}
              </div>
              <button
                type="button"
                aria-label="Remove selected university"
                disabled={status === 'pending'}
                onClick={() => setSelection(null)}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-800"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <fieldset disabled={status === 'pending'} className="space-y-4">
            <legend className="sr-only">{step === 1 ? 'Academic profile' : 'Contact details'}</legend>
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor={`${uid}-route`} className="block text-sm font-bold text-[#0b2b45]">
                    What would you like to study in China? <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <select
                    id={`${uid}-route`}
                    name="route"
                    required
                    value={activeRoute}
                    onChange={event => update('route', event.target.value)}
                    onBlur={() => validateField('route')}
                    {...ariaFor('route')}
                    className={`ed-select ${inputClass}`}
                  >
                    <option value="">Select study route</option>
                    {chinaStudyRoutes.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errorFor('route')}
                </div>

                <div>
                  <label htmlFor={`${uid}-academicLevel`} className="block text-sm font-bold text-[#0b2b45]">
                    Current qualification <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <select
                    id={`${uid}-academicLevel`}
                    name="academicLevel"
                    required
                    value={fields.academicLevel}
                    onChange={event => update('academicLevel', event.target.value)}
                    onBlur={() => validateField('academicLevel')}
                    {...ariaFor('academicLevel')}
                    className={`ed-select ${inputClass}`}
                  >
                    <option value="">Select qualification</option>
                    {chinaAcademicLevels.map(item => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {errorFor('academicLevel')}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-result`} className="block text-sm font-bold text-[#0b2b45]">
                      Latest GPA / CGPA <span aria-hidden="true" className="text-red-600">*</span>
                    </label>
                    <input
                      id={`${uid}-result`}
                      name="result"
                      required
                      maxLength={120}
                      value={fields.result}
                      onChange={event => update('result', event.target.value)}
                      onBlur={() => validateField('result')}
                      placeholder="e.g. HSC GPA 4.50"
                      {...ariaFor('result')}
                      className={inputClass}
                    />
                    {errorFor('result')}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-intake`} className="block text-sm font-bold text-[#0b2b45]">
                      Target intake
                    </label>
                    <select
                      id={`${uid}-intake`}
                      name="intake"
                      value={fields.intake}
                      onChange={event => update('intake', event.target.value)}
                      className={`ed-select ${inputClass}`}
                    >
                      {chinaTargetIntakes.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-xs leading-5">
                  <div className="min-w-0">
                    <span className="block truncate font-medium text-slate-500">
                      {fields.academicLevel} · {fields.result}
                    </span>
                    <p className="truncate font-bold text-[#0b2b45]">
                      {activeRoute} · {fields.intake}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrors({});
                    }}
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 font-bold text-[#12436b] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label htmlFor={`${uid}-name`} className="block text-sm font-bold text-[#0b2b45]">
                    Full name <span aria-hidden="true" className="text-red-600">*</span>
                  </label>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={fields.name}
                    onChange={event => update('name', event.target.value)}
                    onBlur={() => validateField('name')}
                    placeholder="Your full name"
                    {...ariaFor('name')}
                    className={inputClass}
                  />
                  {errorFor('name')}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-phone`} className="block text-sm font-bold text-[#0b2b45]">
                      WhatsApp / phone <span aria-hidden="true" className="text-red-600">*</span>
                    </label>
                    <input
                      id={`${uid}-phone`}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      maxLength={30}
                      value={fields.phone}
                      onChange={event => update('phone', event.target.value)}
                      onBlur={() => validateField('phone')}
                      placeholder="01XXXXXXXXX"
                      {...ariaFor('phone')}
                      className={inputClass}
                    />
                    {errorFor('phone')}
                  </div>

                  <div>
                    <label htmlFor={`${uid}-email`} className="block text-sm font-bold text-[#0b2b45]">
                      Email address <span aria-hidden="true" className="text-red-600">*</span>
                    </label>
                    <input
                      id={`${uid}-email`}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={fields.email}
                      onChange={event => update('email', event.target.value)}
                      onBlur={() => validateField('email')}
                      placeholder="you@example.com"
                      {...ariaFor('email')}
                      className={inputClass}
                    />
                    {errorFor('email')}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    <input
                      id={`${uid}-consent`}
                      name="consent"
                      type="checkbox"
                      required
                      checked={fields.consent}
                      onChange={event => update('consent', event.target.checked)}
                      {...ariaFor('consent')}
                      className="mt-0.5 size-4 shrink-0 accent-[#12436b]"
                    />
                    <span>
                      I agree that EduExpress may contact me about this China assessment and have read the{' '}
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

          <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {requestError && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium leading-6 text-red-700">
              {requestError}
            </p>
          )}

          <div className="mt-5 flex gap-2.5">
            {step === 1 ? (
              <button
                type="button"
                disabled={status === 'pending'}
                onClick={continueToStep2}
                className="ed-btn ed-btn-signal inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold text-petrol-800 shadow-sm"
              >
                Continue to get my free plan
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={status === 'pending'}
                  onClick={() => {
                    setStep(1);
                    setErrors({});
                  }}
                  aria-label="Go back to academic profile"
                  className="grid min-h-[3.25rem] w-12 shrink-0 place-items-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="submit"
                  disabled={status === 'pending'}
                  className="ed-btn ed-btn-signal inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-bold text-petrol-800 shadow-sm disabled:cursor-wait disabled:opacity-70"
                >
                  {status === 'pending' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending your profile…
                    </>
                  ) : (
                    <>
                      Get my free China plan
                      <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3.5 text-center text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole size={13} className="shrink-0 text-petrol-700" aria-hidden="true" />
              No file opening charge
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
              <ShieldCheck size={14} className="shrink-0 text-emerald-600" aria-hidden="true" />
              BDT 0 service fee before visa
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[13.5px] text-slate-600">
            <span className="font-semibold text-[#0b2b45]">Prefer to talk?</span>
            <a
              href={telHref}
              onClick={() => trackPhoneClick({ ...context(), label: 'china_form_phone' })}
              className="inline-flex items-center gap-1.5 font-semibold text-[#12436b] hover:underline"
            >
              <Phone size={13} aria-hidden="true" /> {formatBangladeshPhone(phoneNumber)}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ ...context(), label: 'china_form_whatsapp' })}
              className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 hover:underline"
            >
              <MessageCircle size={13} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </form>
      )}
    </section>
  );
}

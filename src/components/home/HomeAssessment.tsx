'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  MessageCircle,
} from 'lucide-react';
import {
  captureUtmParameters,
  createConversionEventId,
  getUtmParameters,
  analyticsAllowed,
  trackAssessmentStart,
  trackAssessmentSubmit,
} from '@/lib/conversion-events';

const levels = ['SSC / O Level', 'HSC / A Level', 'Diploma', "Bachelor's", "Master's"];

const destinations = [
  { value: 'china', label: 'China' },
  { value: 'not-sure', label: 'Not sure — help me compare' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'hungary', label: 'Hungary' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'finland', label: 'Finland' },
  { value: 'cyprus', label: 'Cyprus' },
  { value: 'other', label: 'Another destination' },
];

type Step = 1 | 2 | 'done';

type FormState = {
  academicLevel: string;
  destination: string;
  subject: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

const initialForm: FormState = {
  academicLevel: '',
  destination: 'china',
  subject: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
};

const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1767a0] focus:ring-4 focus:ring-[#1767a0]/10';

function destinationLabel(value: string) {
  return destinations.find(item => item.value === value)?.label ?? 'Not sure';
}

export default function HomeAssessment({ whatsappNumber }: { whatsappNumber: string }) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    captureUtmParameters();
  }, []);

  const update = (patch: Partial<FormState>) => {
    if (!started.current) {
      started.current = true;
      trackAssessmentStart({ destination: form.destination, label: 'homepage_quick_assessment' });
    }
    setError('');
    setForm(previous => ({ ...previous, ...patch }));
  };

  const continueToContact = () => {
    if (!form.academicLevel || !form.destination) {
      setError('Choose your current study level and preferred destination.');
      return;
    }
    setError('');
    setStep(2);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('Add your name, WhatsApp number and email so a counsellor can contact you.');
      return;
    }
    if (!form.consent) {
      setError('Please agree to the privacy notice before sending your assessment.');
      return;
    }

    setSubmitting(true);
    try {
      const metaEventId = createConversionEventId('lead');
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: destinationLabel(form.destination),
          program: form.subject.trim() || 'Not specified',
          source: 'homepage_quick_assessment',
          leadType: 'assessment',
          destinationInterest: form.destination,
          assessment: {
            academicLevel: form.academicLevel,
            subject: form.subject.trim(),
            preferredCountries: [form.destination],
          },
          consent: true,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: '2026-10-11',
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
          trackingConsent: analyticsAllowed(),
          metaEventId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'We could not send your assessment. Please try again.');
      }

      trackAssessmentSubmit({ destination: form.destination, label: 'homepage_quick_assessment', eventId: metaEventId });
      setStep('done');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free profile assessment for studying abroad.',
  )}`;

  return (
    <div id="assessment" className="scroll-mt-32 rounded-[1.5rem] bg-white p-5 shadow-[0_24px_70px_rgba(15,55,87,.16)] sm:p-7">
      {step !== 'done' && (
        <>
          <div className="flex items-start justify-between gap-5">
            <div>
              <span className="inline-flex rounded-full bg-[#fff4df] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#9a5a00]">
                Free profile assessment
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-[-.03em] text-[#102a43]">Tell us where you want to go</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Two short steps. A real counsellor reviews the result.</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e9f5fc] px-3 py-1.5 text-xs font-bold text-[#1767a0]">
              Step {step} of 2
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2" aria-hidden="true">
            <span className="h-1.5 rounded-full bg-[#1767a0]" />
            <span className={`h-1.5 rounded-full ${step === 2 ? 'bg-[#1767a0]' : 'bg-slate-200'}`} />
          </div>
        </>
      )}

      {step === 1 && (
        <div className="mt-6">
          <label className="block text-sm font-semibold text-[#102a43]">
            Current study level
            <select
              value={form.academicLevel}
              onChange={event => update({ academicLevel: event.target.value })}
              className={inputClass}
            >
              <option value="">Choose your level</option>
              {levels.map(level => <option key={level}>{level}</option>)}
            </select>
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#102a43]">
            Preferred destination
            <select
              value={form.destination}
              onChange={event => update({ destination: event.target.value })}
              className={inputClass}
            >
              {destinations.map(destination => (
                <option key={destination.value} value={destination.value}>{destination.label}</option>
              ))}
            </select>
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#102a43]">
            Subject or program <span className="font-normal text-slate-400">(optional)</span>
            <input
              value={form.subject}
              onChange={event => update({ subject: event.target.value })}
              className={inputClass}
              placeholder="Example: Computer Science"
              autoComplete="off"
            />
          </label>

          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="button"
            onClick={continueToContact}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-5 text-sm font-extrabold text-[#102a43] transition hover:bg-[#ffb33f]"
          >
            Continue — takes 30 seconds <ArrowRight size={17} />
          </button>
          <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole size={13} /> No payment and no document upload required.
          </p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="mt-6">
          <label className="block text-sm font-semibold text-[#102a43]">
            Your name
            <input
              value={form.name}
              onChange={event => update({ name: event.target.value })}
              className={inputClass}
              placeholder="Full name"
              autoComplete="name"
            />
          </label>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#102a43]">
              WhatsApp number
              <input
                value={form.phone}
                onChange={event => update({ phone: event.target.value })}
                className={inputClass}
                placeholder="01XXXXXXXXX"
                inputMode="tel"
                autoComplete="tel"
              />
            </label>
            <label className="block text-sm font-semibold text-[#102a43]">
              Email
              <input
                type="email"
                value={form.email}
                onChange={event => update({ email: event.target.value })}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
          </div>

          <label className="mt-4 flex items-start gap-3 rounded-xl bg-[#f5f9fc] p-3.5 text-xs leading-5 text-slate-600">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={event => update({ consent: event.target.checked })}
              className="mt-0.5 size-4 shrink-0 accent-[#1767a0]"
            />
            <span>
              EduExpress may contact me about this assessment. I have read the{' '}
              <Link href="/privacy" className="font-bold text-[#1767a0] underline">privacy policy</Link>.
            </span>
          </label>

          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => { setError(''); setStep(1); }}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
              aria-label="Return to step one"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-5 text-sm font-extrabold text-[#102a43] transition hover:bg-[#ffb33f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <><Loader2 size={17} className="animate-spin" /> Sending</> : <>Get My Free Assessment <ArrowRight size={17} /></>}
            </button>
          </div>
        </form>
      )}

      {step === 'done' && (
        <div className="py-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={27} />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-[-.03em] text-[#102a43]">Your profile is with our counselling team</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            A counsellor will review your study level, destination and subject, then contact you during office hours.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-extrabold text-[#07301a]"
          >
            <MessageCircle size={18} /> Continue on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

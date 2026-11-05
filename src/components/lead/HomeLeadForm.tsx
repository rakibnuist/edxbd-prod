'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, MessageCircle, Phone } from 'lucide-react';

import { formatBangladeshPhone } from '@/lib/contact-format';
import {
  analyticsAllowed,
  createConversionEventId,
  getUtmParameters,
  trackAssessmentSubmit,
  trackPhoneClick,
  trackWhatsAppClick,
} from '@/lib/conversion-events';

const PRIVACY_VERSION = '2026-07-19';

const LEVELS = ["HSC / A Level", "Bachelor's", "Master's", 'PhD', 'MBBS', 'Other'];

const DESTINATIONS = [
  'China',
  'United Kingdom',
  'Malaysia',
  'South Korea',
  'Hungary',
  'Finland',
  'Not sure yet',
];

type Status = 'idle' | 'submitting' | 'done';

export default function HomeLeadForm({ whatsappHref, embedded = false }: { whatsappHref: string; embedded?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState('');
  const [destination, setDestination] = useState('China');
  const [consent, setConsent] = useState(false);

  const reset = () => {
    setStatus('idle');
    setError('');
    setName('');
    setPhone('');
    setEmail('');
    setLevel('');
    setDestination('China');
    setConsent(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!consent) {
      setError('Please accept the privacy terms so a counsellor can contact you.');
      return;
    }

    setStatus('submitting');
    const eventId = createConversionEventId('lead');
    const country = destination === 'Not sure yet' ? 'Not specified' : destination;

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          country,
          program: level || 'Not specified',
          message: `Homepage assessment request. Study level: ${level || 'not provided'}. Destination: ${country}.`,
          source: 'homepage_lead_form',
          leadType: 'assessment',
          destinationInterest: destination === 'Not sure yet' ? [] : [destination],
          assessment: {
            academicLevel: level || 'Not specified',
            preferredCountries: destination === 'Not sure yet' ? [] : [destination],
          },
          consent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_VERSION,
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
          trackingConsent: analyticsAllowed(),
          metaEventId: eventId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'We could not send your request. Please try again.');
      }

      trackAssessmentSubmit({ destination, label: 'homepage_lead_form', eventId });
      setStatus('done');
    } catch (submitError) {
      setStatus('idle');
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'done') {
    return (
      <div className={embedded ? 'p-0 text-center' : 'rounded-[26px] border border-rule bg-white p-6 text-center shadow-[0_26px_60px_-42px_rgba(15,53,87,0.4)] sm:p-8'}>
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-mint-100 text-jade">
          <CheckCircle2 size={26} aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-[27px] font-semibold leading-tight text-ink">Request received.</h2>
        <p className="mt-2 text-[14px] leading-6 text-ink-soft">
          A counsellor will review your profile and contact you within one working day.
        </p>
        <div className="mt-6 grid gap-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ label: 'home_form_success_whatsapp' })}
            className="ed-btn min-h-11 bg-[#25d366] text-[#06251a]"
          >
            <MessageCircle size={16} aria-hidden="true" /> Continue on WhatsApp
          </a>
          <Link href="/universities" className="ed-btn ed-btn-outline min-h-11">
            Browse universities <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <button type="button" onClick={reset} className="mt-4 text-[12px] font-semibold text-ink-mute underline underline-offset-4">
          Submit another profile
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={embedded ? 'p-0' : 'rounded-[26px] border border-rule bg-white p-5 shadow-[0_26px_60px_-42px_rgba(15,53,87,0.4)] sm:p-6'}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-petrol-600">Free profile assessment</p>
          <h2 className="mt-1.5 font-heading text-[27px] font-semibold leading-tight text-ink">Start with your profile.</h2>
        </div>
        <span className="shrink-0 rounded-full bg-mint-100 px-3 py-1.5 text-[10.5px] font-bold text-petrol-700">2 min</span>
      </div>

      <p className="mt-2 text-[13px] leading-6 text-ink-soft">
        Tell us where you are and where you want to go. A counsellor will call you within one working day.
      </p>

      <div className="mt-5 grid gap-3.5">
        <div>
          <label htmlFor="lead-name" className="block text-[12px] font-semibold text-ink">
            Full name
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={event => setName(event.target.value)}
            className="ed-field mt-1.5"
            placeholder="Your full name"
          />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-phone" className="block text-[12px] font-semibold text-ink">
              Phone / WhatsApp
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              className="ed-field mt-1.5"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
          <div>
            <label htmlFor="lead-email" className="block text-[12px] font-semibold text-ink">
              Email
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="ed-field mt-1.5"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-level" className="block text-[12px] font-semibold text-ink">
              Current study level
            </label>
            <select
              id="lead-level"
              name="level"
              required
              value={level}
              onChange={event => setLevel(event.target.value)}
              className="ed-field mt-1.5"
            >
              <option value="">Select level</option>
              {LEVELS.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lead-destination" className="block text-[12px] font-semibold text-ink">
              Preferred destination
            </label>
            <select
              id="lead-destination"
              name="destination"
              value={destination}
              onChange={event => setDestination(event.target.value)}
              className="ed-field mt-1.5"
            >
              {DESTINATIONS.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-[11.5px] leading-5 text-ink-soft">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={event => setConsent(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[#12436b]"
          />
          <span>
            I agree to be contacted about my enquiry and accept the{' '}
            <Link href="/privacy" className="font-semibold text-petrol-700 underline underline-offset-2">
              privacy policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-clay/25 bg-clay/5 px-3.5 py-2.5 text-[12px] leading-5 text-clay">
            <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
          </p>
        )}

        <button type="submit" disabled={status === 'submitting'} className="ed-btn ed-btn-signal min-h-12 w-full text-[14px] disabled:cursor-not-allowed disabled:opacity-70">
          {status === 'submitting' ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending request…
            </>
          ) : (
            <>
              Get my free assessment <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center text-[10.5px] leading-5 text-ink-mute">
          No obligation. No service fee before China visa approval.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-rule pt-4 text-[11.5px] text-ink-soft">
        <span className="font-semibold text-ink">Prefer to talk?</span>
        <a
          href="tel:+8801983333566"
          onClick={() => trackPhoneClick({ label: 'home_form_phone' })}
          className="inline-flex items-center gap-1.5 font-semibold text-petrol-700 hover:underline"
        >
          <Phone size={13} aria-hidden="true" /> {formatBangladeshPhone('+8801983333566')}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick({ label: 'home_form_whatsapp' })}
          className="inline-flex items-center gap-1.5 font-semibold text-jade hover:underline"
        >
          <MessageCircle size={13} aria-hidden="true" /> WhatsApp
        </a>
      </div>

      <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
    </form>
  );
}

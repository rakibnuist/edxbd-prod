'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  B2B_DESTINATION_OPTIONS,
  B2B_MONTHLY_VOLUMES,
  B2B_ORGANIZATION_TYPES,
  B2B_PRIVACY_POLICY_VERSION,
  B2B_SERVICE_TRACKS,
  type B2BOrganizationType,
  type B2BServiceTrackId,
} from '@/lib/b2b-catalog';
import {
  analyticsAllowed,
  createConversionEventId,
  trackB2BInquirySubmit,
  trackWhatsAppClick,
} from '@/lib/conversion-events';
import { getConsentedSubmissionMetaParams } from '@/lib/meta-param-builder-client';
import { trackFormSubmission, getUserDevice } from '@/lib/vercel-analytics';

type B2BInquiryFormProps = {
  whatsappHref: string;
};

type FormState = {
  organizationType: B2BOrganizationType;
  serviceTrack: B2BServiceTrackId;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  monthlyVolume: string;
  yearsInBusiness: string;
  businessRegistrationNumber: string;
  website: string;
  targetCountries: string[];
  motivation: string;
  consent: boolean;
  companyWebsite: string;
};

const INITIAL_STATE: FormState = {
  organizationType: 'consultancy',
  serviceTrack: 'b2b_china_desk',
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  country: 'Bangladesh',
  monthlyVolume: '4-10',
  yearsInBusiness: '2',
  businessRegistrationNumber: '',
  website: '',
  targetCountries: ['China', 'Malaysia'],
  motivation: '',
  consent: false,
  companyWebsite: '',
};

export default function B2BInquiryForm({ whatsappHref }: B2BInquiryFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<{ referenceCode: string; companyName: string } | null>(null);

  const requiresOrgName = form.organizationType === 'consultancy' || form.organizationType === 'institution';

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (submitError) setSubmitError('');
  };

  const toggleDestination = (country: string) => {
    setForm((prev) => {
      const exists = prev.targetCountries.includes(country);
      const next = exists
        ? prev.targetCountries.filter((c) => c !== country)
        : [...prev.targetCountries, country];
      return { ...prev, targetCountries: next };
    });
    if (errors.targetCountries) {
      setErrors((prev) => ({ ...prev, targetCountries: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (requiresOrgName && form.companyName.trim().length < 2) {
      nextErrors.companyName = 'Agency or institution name is required';
    }
    if (form.contactPerson.trim().length < 2) {
      nextErrors.contactPerson = 'Contact person name is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid work email address';
    }
    if (form.phone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Enter a valid phone or WhatsApp number with country code';
    }
    if (form.city.trim().length < 2) {
      nextErrors.city = 'City is required';
    }
    if (form.country.trim().length < 2) {
      nextErrors.country = 'Country is required';
    }
    if (form.targetCountries.length === 0) {
      nextErrors.targetCountries = 'Select at least one target destination';
    }
    if (form.motivation.trim().length < 20) {
      nextErrors.motivation = 'Please describe your student pipeline and cooperation needs (at least 20 characters)';
    }
    if (form.website.trim()) {
      try {
        const parsed = new URL(form.website.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          nextErrors.website = 'Website must begin with https:// or http://';
        }
      } catch {
        nextErrors.website = 'Enter a valid URL starting with https:// or http://';
      }
    }
    if (!form.consent) {
      nextErrors.consent = 'Please accept the privacy terms so our B2B desk can respond';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    const eventId = createConversionEventId('b2b');

    try {
      const metaParams = await getConsentedSubmissionMetaParams();
      const response = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metaParams,
          organizationType: form.organizationType,
          serviceTrack: form.serviceTrack,
          companyName: form.companyName.trim(),
          contactPerson: form.contactPerson.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          monthlyVolume: form.monthlyVolume,
          yearsInBusiness: form.yearsInBusiness ? Number.parseInt(form.yearsInBusiness, 10) : 1,
          businessRegistrationNumber: form.businessRegistrationNumber.trim(),
          website: form.website.trim(),
          targetCountries: form.targetCountries,
          motivation: form.motivation.trim(),
          source: 'b2b_page',
          consent: form.consent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: B2B_PRIVACY_POLICY_VERSION,
          trackingConsent: analyticsAllowed(),
          companyWebsite: form.companyWebsite,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || 'Could not submit your B2B inquiry. Please try again.');
      }

      trackB2BInquirySubmit({
        destination: form.targetCountries[0] || 'china',
        label: form.serviceTrack,
        eventId,
      });
      trackFormSubmission('partnership', {
        page: 'b2b_page',
        source: 'b2b_page',
        device: getUserDevice(),
        partnership_type: form.serviceTrack,
        country: form.country.trim(),
      });

      setSubmittedRef({
        referenceCode: payload.referenceCode || 'B2B-ONBOARD',
        companyName: form.companyName.trim() || form.contactPerson.trim(),
      });
      setForm(INITIAL_STATE);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-rule bg-white px-6 py-12 text-center shadow-sm sm:px-10"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-lime text-petrol-800">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-canvas-soft px-4 py-1.5 text-[13.5px] font-bold text-petrol-800">
          Reference: {submittedRef.referenceCode}
        </p>
        <h3 className="mt-4 font-display text-[30px] font-black leading-[1.05] text-petrol-800">
          B2B inquiry received.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[16px] leading-7 text-ink-soft">
          Thank you, <strong className="text-petrol-800">{submittedRef.companyName}</strong>. Our Dhanmondi partner desk will review your target destinations and reply within 1–2 working days to schedule a scope call and bilateral MOU review.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ label: 'b2b_form_success_whatsapp' })}
            className="ed-btn ed-btn-signal min-h-[48px] px-6"
          >
            <MessageCircle size={17} aria-hidden="true" /> Message the B2B Desk on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setSubmittedRef(null)}
            className="ed-btn ed-btn-outline min-h-[48px] px-6"
          >
            Submit another inquiry
          </button>
        </div>
      </div>
    );
  }

  const labelClass = 'mb-1.5 block text-[14px] font-semibold text-petrol-800';
  const fieldClass = (hasError?: string) =>
    `ed-field min-h-[48px] ${hasError ? 'border-clay bg-red-50/40' : ''}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-rule bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-canvas-soft pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
            <Building2 size={20} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[20px] font-bold leading-snug text-petrol-800">
              B2B Onboarding &amp; MOU Request
            </h3>
            <p className="text-[14px] text-ink-soft">
              Custom commercial schedule issued after partner vetting
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-pale px-3.5 py-1 text-[13px] font-semibold text-lime-deep">
          <ShieldCheck size={15} aria-hidden="true" /> Non-poaching protected
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <fieldset>
          <legend className={labelClass}>Organization type *</legend>
          <div className="mt-1 grid gap-2.5 sm:grid-cols-2">
            {B2B_ORGANIZATION_TYPES.map((item) => {
              const selected = form.organizationType === item.value;
              return (
                <label
                  key={item.value}
                  className={`flex cursor-pointer flex-col rounded-2xl border-2 p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-petrol-800 ${
                    selected
                      ? 'border-petrol-800 bg-lime-pale/70'
                      : 'border-rule bg-chalk-100 hover:border-rule-strong'
                  }`}
                >
                  <input
                    type="radio"
                    name="organizationType"
                    value={item.value}
                    checked={selected}
                    onChange={() => setField('organizationType', item.value)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold text-petrol-800">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`grid size-4 shrink-0 place-items-center rounded-full border-2 ${
                        selected ? 'border-petrol-800 bg-petrol-800' : 'border-rule-strong'
                      }`}
                    >
                      {selected && <span className="size-1.5 rounded-full bg-lime" />}
                    </span>
                  </span>
                  <span className="mt-1 text-[13.5px] leading-5 text-ink-soft">{item.description}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b2b-serviceTrack" className={labelClass}>
              Primary B2B service track *
            </label>
            <select
              id="b2b-serviceTrack"
              value={form.serviceTrack}
              onChange={(e) => setField('serviceTrack', e.target.value as B2BServiceTrackId)}
              className="ed-field min-h-[48px]"
            >
              {B2B_SERVICE_TRACKS.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="b2b-monthlyVolume" className={labelClass}>
              Expected monthly student volume *
            </label>
            <select
              id="b2b-monthlyVolume"
              value={form.monthlyVolume}
              onChange={(e) => setField('monthlyVolume', e.target.value)}
              className="ed-field min-h-[48px]"
            >
              {B2B_MONTHLY_VOLUMES.map((vol) => (
                <option key={vol.value} value={vol.value}>
                  {vol.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b2b-companyName" className={labelClass}>
              Agency / Organization name {requiresOrgName ? '*' : '(optional)'}
            </label>
            <input
              id="b2b-companyName"
              type="text"
              autoComplete="organization"
              value={form.companyName}
              onChange={(e) => setField('companyName', e.target.value)}
              aria-invalid={Boolean(errors.companyName)}
              aria-describedby={errors.companyName ? 'b2b-companyName-error' : undefined}
              placeholder="e.g. Dhaka Overseas Education"
              className={fieldClass(errors.companyName)}
            />
            {errors.companyName && (
              <p id="b2b-companyName-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.companyName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="b2b-contactPerson" className={labelClass}>
              Contact person *
            </label>
            <input
              id="b2b-contactPerson"
              type="text"
              autoComplete="name"
              value={form.contactPerson}
              onChange={(e) => setField('contactPerson', e.target.value)}
              aria-invalid={Boolean(errors.contactPerson)}
              aria-describedby={errors.contactPerson ? 'b2b-contactPerson-error' : undefined}
              placeholder="Full name & role"
              className={fieldClass(errors.contactPerson)}
            />
            {errors.contactPerson && (
              <p id="b2b-contactPerson-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.contactPerson}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b2b-email" className={labelClass}>
              Work email *
            </label>
            <input
              id="b2b-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'b2b-email-error' : undefined}
              placeholder="partner@agency.com"
              className={fieldClass(errors.email)}
            />
            {errors.email && (
              <p id="b2b-email-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="b2b-phone" className={labelClass}>
              Phone / WhatsApp *
            </label>
            <input
              id="b2b-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'b2b-phone-error' : undefined}
              placeholder="+880 1XXX-XXXXXX"
              className={fieldClass(errors.phone)}
            />
            {errors.phone && (
              <p id="b2b-phone-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="b2b-city" className={labelClass}>
              City *
            </label>
            <input
              id="b2b-city"
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'b2b-city-error' : undefined}
              placeholder="Dhaka, Chattogram..."
              className={fieldClass(errors.city)}
            />
            {errors.city && (
              <p id="b2b-city-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="b2b-country" className={labelClass}>
              Country *
            </label>
            <input
              id="b2b-country"
              type="text"
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => setField('country', e.target.value)}
              aria-invalid={Boolean(errors.country)}
              aria-describedby={errors.country ? 'b2b-country-error' : undefined}
              placeholder="Bangladesh"
              className={fieldClass(errors.country)}
            />
            {errors.country && (
              <p id="b2b-country-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.country}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="b2b-years" className={labelClass}>
              Years operating
            </label>
            <input
              id="b2b-years"
              type="number"
              min={0}
              max={100}
              value={form.yearsInBusiness}
              onChange={(e) => setField('yearsInBusiness', e.target.value)}
              className="ed-field min-h-[48px]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b2b-website" className={labelClass}>
              Website or Facebook page <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <input
              id="b2b-website"
              type="url"
              value={form.website}
              onChange={(e) => setField('website', e.target.value)}
              aria-invalid={Boolean(errors.website)}
              aria-describedby={errors.website ? 'b2b-website-error' : undefined}
              placeholder="https://..."
              className={fieldClass(errors.website)}
            />
            {errors.website && (
              <p id="b2b-website-error" className="mt-1 text-[13.5px] font-semibold text-clay">
                {errors.website}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="b2b-reg" className={labelClass}>
              Trade license / reg. no. <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <input
              id="b2b-reg"
              type="text"
              value={form.businessRegistrationNumber}
              onChange={(e) => setField('businessRegistrationNumber', e.target.value)}
              placeholder="Optional for initial vetting"
              className="ed-field min-h-[48px]"
            />
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Target student destinations *</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {B2B_DESTINATION_OPTIONS.map((country) => {
              const selected = form.targetCountries.includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleDestination(country)}
                  className={`min-h-[40px] rounded-full border px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${
                    selected
                      ? 'border-petrol-800 bg-petrol-800 text-lime'
                      : 'border-rule bg-chalk-100 text-petrol-800 hover:border-petrol-800/40'
                  }`}
                >
                  {country}
                </button>
              );
            })}
          </div>
          {errors.targetCountries && (
            <p className="mt-1.5 text-[13.5px] font-semibold text-clay">{errors.targetCountries}</p>
          )}
        </fieldset>

        <div>
          <label htmlFor="b2b-motivation" className={labelClass}>
            Student pipeline &amp; commercial support needed *
          </label>
          <textarea
            id="b2b-motivation"
            rows={4}
            value={form.motivation}
            onChange={(e) => setField('motivation', e.target.value)}
            aria-invalid={Boolean(errors.motivation)}
            aria-describedby={errors.motivation ? 'b2b-motivation-error' : undefined}
            placeholder="Share the intakes, degree levels (Bachelor/Master/MBBS/Language), or university processing help you need..."
            className={`${fieldClass(errors.motivation)} resize-y py-3`}
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            {errors.motivation ? (
              <p id="b2b-motivation-error" className="text-[13.5px] font-semibold text-clay">
                {errors.motivation}
              </p>
            ) : (
              <p className="text-[13.5px] text-ink-soft">
                {form.motivation.trim().length < 20
                  ? `Minimum 20 characters (${form.motivation.trim().length}/20)`
                  : 'Ready to review'}
              </p>
            )}
            <span className="shrink-0 text-[13.5px] text-ink-mute">
              {form.motivation.length} chars
            </span>
          </div>
        </div>

        <div>
          <label className="flex items-start gap-3 rounded-2xl bg-canvas-soft p-4 text-[14px] leading-6 text-ink-soft">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setField('consent', e.target.checked)}
              className="mt-1 size-5 shrink-0 accent-petrol-800"
            />
            <span>
              I agree that EduExpress International may review these details to discuss a B2B cooperation agreement and commercial terms, as described in our{' '}
              <Link href="/privacy" target="_blank" className="font-semibold text-petrol-800 underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1.5 text-[13.5px] font-semibold text-clay">{errors.consent}</p>
          )}
        </div>

        {submitError && (
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-clay/30 bg-red-50 px-4 py-3 text-[14.5px] font-semibold text-clay"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{submitError}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="ed-btn ed-btn-signal min-h-[52px] w-full text-[16px] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Submitting inquiry…
            </>
          ) : (
            <>
              Request B2B onboarding &amp; MOU <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>

        <input
          type="text"
          name="companyWebsite"
          value={form.companyWebsite}
          onChange={(e) => setField('companyWebsite', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      </div>
    </form>
  );
}

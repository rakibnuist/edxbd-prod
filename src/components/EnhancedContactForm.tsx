'use client';

import { useState, useEffect } from 'react';
import CountryCodePhoneInput from './CountryCodePhoneInput';
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { trackFormStart, trackFormFieldFocus } from '@/lib/analytics';
import {
  analyticsAllowed,
  createConversionEventId,
  getUtmParameters,
  trackAssessmentSubmit,
} from '@/lib/conversion-events';
import Link from 'next/link';
import { destinationLinks } from '@/data/siteNavigation';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  program: string;
  message: string;
  city: string;
  state: string;
  zipCode: string;
  consent: boolean;
}

interface EnhancedContactFormProps {
  formType?: 'contact' | 'consultation' | 'application' | 'scholarship' | 'partnership';
  source?: string;
  title?: string;
  description?: string;
  showCountry?: boolean;
  showProgram?: boolean;
  showMessage?: boolean;
  showLocation?: boolean;
  className?: string;
  onSubmit?: () => void; // Callback for form submission
  autoHide?: boolean; // Whether to auto-hide form after successful submission
  autoHideDelay?: number; // Delay in milliseconds before auto-hiding (default: 3000)
  onAutoHide?: () => void; // Callback when form auto-hides
}

const EnhancedContactForm: React.FC<EnhancedContactFormProps> = ({
  formType = 'contact',
  source = 'website',
  title = 'Get Free Consultation',
  description = 'Fill out the form below and our experts will contact you within 24 hours.',
  showCountry = true,
  showProgram = true,
  showMessage = true,
   
  showLocation: _showLocation = true,
  className = '',
  onSubmit,
  autoHide = false,
  autoHideDelay = 3000,
  onAutoHide
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    program: '',
    message: '',
    city: '',
    state: '',
    zipCode: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [isHidden, setIsHidden] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Track form start on first interaction
  const handleInteraction = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackFormStart(formType);
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    handleInteraction();
    trackFormFieldFocus(fieldName, formType);
  };

  // Auto-hide functionality
  useEffect(() => {
    if (isSubmitted && autoHide) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsHidden(true);
            if (onAutoHide) setTimeout(onAutoHide, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isSubmitted, autoHide, autoHideDelay, onAutoHide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    handleInteraction();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const now = Date.now();
    if (now - lastSubmissionTime < 2000) return;
    setLastSubmissionTime(now);

    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone || !formData.consent) {
        throw new Error('Enter your name, email and phone number, then accept the privacy notice.');
      }
      if (showCountry && !formData.country) {
        throw new Error('Select your preferred study destination.');
      }
      if (showProgram && !formData.program) {
        throw new Error('Select the program level you are interested in.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const metaEventId = createConversionEventId('lead');
      const submitData = {
        ...formData,
        message: formData.message || 'Consultation request from ' + formData.country,
        formType,
        source,
        consentTimestamp: new Date().toISOString(),
        consentPolicyVersion: '2026-07-19',
        landingPage: window.location.pathname,
        utm: getUtmParameters(),
        companyWebsite,
        trackingConsent: analyticsAllowed(),
        metaEventId,
      };

      // API Request
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit form');
      }

      if (autoHide) setCountdown(Math.ceil(autoHideDelay / 1000));
      setIsSubmitted(true);
      trackAssessmentSubmit({
        destination: formData.country || 'not_specified',
        label: source,
        eventId: metaEventId,
      });

      if (onSubmit) onSubmit();

    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHidden) return null;

  // Callers that embed the form in their own surface (e.g. the quick-contact
  // modal) pass className; otherwise the form sits on a white kit card.
  const surface = className || 'rounded-3xl bg-white p-6 sm:p-8';
  const labelClass = 'mb-1.5 block text-[14px] font-semibold text-petrol-800';
  const fieldClass =
    'w-full min-h-[50px] rounded-xl border-2 border-rule bg-chalk-100 px-4 text-[16px] text-petrol-800 placeholder:text-ink-mute transition-colors focus:border-petrol-800 focus:bg-white focus:outline-none';
  const required = <span className="text-red-700" aria-hidden="true">*</span>;

  if (isSubmitted) {
    return (
      <div className={`${surface} text-center animate-in fade-in zoom-in-95`} role="status">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-lime text-petrol-800">
          <CheckCircle className="size-7" aria-hidden="true" />
        </span>
        <h3 className="font-display text-[28px] font-black leading-none text-petrol-800">Submission Received!</h3>
        <p className="mx-auto mt-3 max-w-sm text-[16px] leading-7 text-ink-soft">
          Thank you, {formData.name.split(' ')[0]}! Our Dhanmondi decision desk will review your details and respond within 24 hours.
        </p>

        {autoHide && countdown > 0 ? (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-canvas-soft px-4 py-2 text-[14px] font-semibold text-petrol-800">
            <span className="size-2 animate-pulse rounded-full bg-petrol-800" aria-hidden="true" />
            Closing in {countdown}s...
          </p>
        ) : (
          <button onClick={() => setIsSubmitted(false)} className="ed-btn ed-btn-outline mt-6 min-h-[48px] px-6">
            Submit another request
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={surface}>
      {(title || description) && (
        <div className="mb-7">
          {title && (
            <h2 className="font-display text-[30px] font-black leading-[1] tracking-[-0.01em] text-petrol-800 sm:text-[34px]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-3 text-[16px] leading-7 text-ink-soft">
              {description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`${formType}-company-website`}>Company website</label>
          <input
            id={`${formType}-company-website`}
            name="companyWebsite"
            type="text"
            value={companyWebsite}
            onChange={(event) => setCompanyWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name {required}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('name')}
            required
            className={fieldClass}
            autoComplete="name"
            placeholder="e.g. Tahmid Rahman"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address {required}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('email')}
            required
            className={fieldClass}
            autoComplete="email"
            placeholder="e.g. yourname@gmail.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number {required}
          </label>
          <CountryCodePhoneInput
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, phone: value }));
              handleInteraction();
            }}
            placeholder="1712-345678"
            required
            error={error && formData.phone === '' ? 'Required' : undefined}
          />
        </div>

        {/* Country */}
        {showCountry && (
          <div>
            <label htmlFor="country" className={labelClass}>
              Preferred destination {required}
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('country')}
                required
                className={`${fieldClass} cursor-pointer appearance-none pr-11`}
              >
                <option value="">Select a country...</option>
                {destinationLinks.map(destination => (
                  <option key={destination.href} value={destination.name}>
                    {destination.name}{destination.name === 'China' ? ' (Flagship)' : ''}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-petrol-800" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Program */}
        {showProgram && (
          <div>
            <label htmlFor="program" className={labelClass}>
              Program level {required}
            </label>
            <div className="relative">
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('program')}
                required
                className={`${fieldClass} cursor-pointer appearance-none pr-11`}
              >
                <option value="">Select level...</option>
                <option value="Bachelor">Bachelor&apos;s Degree</option>
                <option value="Master">Master&apos;s Degree</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
                <option value="Language Course">Language Course</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-petrol-800" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Message */}
        {showMessage && (
          <div>
            <label htmlFor="message" className={labelClass}>
              Message <span className="font-normal text-ink-soft">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('message')}
              rows={3}
              className={`${fieldClass} resize-none py-3`}
              placeholder="Any specific questions or academic requirements?"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-[14px] font-semibold leading-6 text-red-700">
            {error}
          </p>
        )}

        <label className="flex items-start gap-3 rounded-2xl bg-canvas-soft p-4 text-[14px] leading-6 text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={(event) => setFormData((current) => ({ ...current, consent: event.target.checked }))}
            required
            className="mt-1 size-5 shrink-0 accent-petrol-800"
          />
          <span>I consent to EduExpress using these details to respond to my assessment request under the <Link className="font-semibold text-petrol-800 underline underline-offset-2" href="/student-data-privacy">student data privacy policy</Link>.</span>
        </label>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="ed-btn ed-btn-signal min-h-[54px] w-full px-6 text-[17px] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-petrol-800/30 border-t-petrol-800" aria-hidden="true" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Get Free Fit Assessment</span>
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnhancedContactForm;

'use client';

import { useState, useEffect } from 'react';
import { useMetaTracking } from '@/hooks/useMetaTracking';
import CountryCodePhoneInput from './CountryCodePhoneInput';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { trackStudyAbroadLead, trackFormStart, trackFormFieldFocus, trackAssessmentSubmit } from '@/lib/analytics';
import Link from 'next/link';

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

  const { trackButtonClick } = useMetaTracking();

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
      setCountdown(Math.ceil(autoHideDelay / 1000));
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
      if (!formData.name || !formData.email || !formData.phone || !formData.consent) {
        throw new Error('Please fill in all required fields (Name, Email, Phone)');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const submitData = {
        ...formData,
        message: formData.message || 'Consultation request from ' + formData.country,
        formType,
        source,
        consentTimestamp: new Date().toISOString(),
        consentPolicyVersion: '2026-07-19',
        landingPage: window.location.pathname,
        utm: Object.fromEntries(new URLSearchParams(window.location.search))
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

      setIsSubmitted(true);
      trackAssessmentSubmit({ destination: formData.country || 'not_specified', source });

      // --- CRITICAL TRACKING ---
      trackStudyAbroadLead(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          program: formData.program,
          message: formData.message
        },
        source
      );

      trackButtonClick('consultation_submit', source);

      if (onSubmit) onSubmit();

    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHidden) return null;

  if (isSubmitted) {
    return (
      <div className={`bg-[#f4f8fa] border-2 border-[#08263c] p-6 text-center ${className} animate-in fade-in zoom-in-95`}>
        <div className="w-12 h-12 bg-[#e9f7fd] border border-[#174f7a]/20 text-[#174f7a] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#174f7a] mx-auto" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Submission Received!</h3>
        <p className="text-slate-700 mb-4 font-medium text-xs max-w-sm mx-auto">
          Thank you, {formData.name.split(' ')[0]}! Our Dhanmondi decision desk will review your details and respond within 24 hours.
        </p>

        {autoHide && countdown > 0 ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#174f7a]/20">
            <div className="w-1.5 h-1.5 bg-[#174f7a] animate-pulse"></div>
            <p className="font-mono text-xs text-[#174f7a] font-bold">
              Closing in {countdown}s...
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-[#174f7a] font-bold hover:underline text-xs"
          >
            Submit another request
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 border-[#08263c] p-6 sm:p-8 ${className}`}>
      {(title || description) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="font-heading text-2xl font-bold text-[#08263c] mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-slate-600 font-medium text-xs leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('name')}
            required
            className="w-full px-4 py-2.5 text-xs border-2 border-[#08263c]/30 focus:border-[#08263c] focus:outline-none bg-[#f4f8fa] text-[#08263c] placeholder:text-slate-400 font-semibold"
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('email')}
            required
            className="w-full px-4 py-2.5 text-xs border-2 border-[#08263c]/30 focus:border-[#08263c] focus:outline-none bg-[#f4f8fa] text-[#08263c] placeholder:text-slate-400 font-semibold"
            placeholder="e.g. john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <CountryCodePhoneInput
            value={formData.phone}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, phone: value }));
              handleInteraction();
            }}
            placeholder="123 456 7890"
            required
            error={error && formData.phone === '' ? 'Required' : undefined}
          />
        </div>

        {/* Country */}
        {showCountry && (
          <div>
            <label htmlFor="country" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
              Preferred Destination <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('country')}
                required
                className="w-full px-4 py-2.5 text-xs border-2 border-[#08263c]/30 focus:border-[#08263c] focus:outline-none bg-[#f4f8fa] text-[#08263c] font-semibold appearance-none cursor-pointer"
              >
                <option value="">Select a country...</option>
                <option value="China">🇨🇳 China (Flagship)</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="South Korea">🇰🇷 South Korea</option>
                <option value="Hungary">🇭🇺 Hungary</option>
                <option value="Netherlands">🇳🇱 Netherlands</option>
                <option value="Finland">🇫🇮 Finland</option>
                <option value="Cyprus">🇨🇾 Cyprus</option>
                <option value="Georgia">🇬🇪 Georgia</option>
                <option value="Other">🌍 Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#174f7a]">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* Program */}
        {showProgram && (
          <div>
            <label htmlFor="program" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
              Program Level <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('program')}
                className="w-full px-4 py-2.5 text-xs border-2 border-[#08263c]/30 focus:border-[#08263c] focus:outline-none bg-[#f4f8fa] text-[#08263c] font-semibold appearance-none cursor-pointer"
              >
                <option value="">Select level...</option>
                <option value="Bachelor">🎓 Bachelor&apos;s Degree</option>
                <option value="Master">📜 Master&apos;s Degree</option>
                <option value="PhD">🔬 PhD</option>
                <option value="Diploma">📄 Diploma</option>
                <option value="Certificate">🔖 Certificate</option>
                <option value="Language Course">🗣 Language Course</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#174f7a]">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {showMessage && (
          <div>
            <label htmlFor="message" className="block font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('message')}
              rows={2}
              className="w-full px-4 py-2.5 text-xs border-2 border-[#08263c]/30 focus:border-[#08263c] focus:outline-none bg-[#f4f8fa] text-[#08263c] font-medium resize-none placeholder:text-slate-400"
              placeholder="Any specific questions or academic requirements?"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 shrink-0" />
            <p className="text-red-700 text-xs font-bold">{error}</p>
          </div>
        )}

        <label className="flex items-start gap-3 border border-[#174f7a]/20 bg-[#f4f8fa] p-3 text-[11px] leading-4 text-slate-700">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={(event) => setFormData((current) => ({ ...current, consent: event.target.checked }))}
            required
            className="mt-0.5 accent-[#08263c]"
          />
          <span>I consent to EduExpress using these details to respond to my assessment request under the <Link className="font-bold text-[#174f7a] underline" href="/student-data-privacy">student data privacy policy</Link>.</span>
        </label>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#64b5df] hover:bg-[#08263c] hover:text-white text-[#08263c] py-4 px-6 font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-[4px_4px_0_0_#174f7a] flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#08263c]/30 border-t-[#08263c] rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Get Free Fit Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnhancedContactForm;

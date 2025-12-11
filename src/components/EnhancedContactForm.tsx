'use client';

import { useState, useEffect } from 'react';
import { useMetaTracking } from '@/hooks/useMetaTracking';
import CountryCodePhoneInput from './CountryCodePhoneInput';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { trackStudyAbroadLead, trackFormStart, trackFormFieldFocus } from '@/lib/analytics';

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
  showLocation = false,
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
    zipCode: ''
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
      if (!formData.name || !formData.email || !formData.phone) {
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
        source
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
      <div className={`bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-center ${className} animate-in fade-in zoom-in-95`}>
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-black text-blue-900 mb-2">Submission Successful!</h3>
        <p className="text-slate-600 mb-4 font-medium text-sm max-w-sm mx-auto">
          Thanks for reaching out, {formData.name.split(' ')[0]}! We will get back to you within 24 hours.
        </p>

        {autoHide && countdown > 0 ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-blue-100 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <p className="text-xs text-blue-600 font-bold">
              Closing in {countdown}s...
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-blue-600 font-bold hover:underline text-sm"
          >
            Send another request
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl ${className}`}>
      {(title || description) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
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
            className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 text-slate-900 placeholder:text-slate-400 font-semibold"
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
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
            className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 text-slate-900 placeholder:text-slate-400 font-semibold"
            placeholder="e.g. john@example.com"
          />
        </div>

        {/* Phone - UNIFIED COMPONENT */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          {/* No wrapper needed, component is self-contained pill */}
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
            <label htmlFor="country" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
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
                className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 text-slate-900 font-semibold appearance-none cursor-pointer hover:bg-slate-100"
              >
                <option value="">Select a country...</option>
                <option value="China">🇨🇳 China</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="South Korea">🇰🇷 South Korea</option>
                <option value="Hungary">🇭🇺 Hungary</option>
                <option value="Netherlands">🇳🇱 Netherlands</option>
                <option value="Finland">🇫🇮 Finland</option>
                <option value="Cyprus">🇨🇾 Cyprus</option>
                <option value="Georgia">🇬🇪 Georgia</option>
                <option value="Other">🌍 Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* Program */}
        {showProgram && (
          <div>
            <label htmlFor="program" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
              Program Level <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                onFocus={() => handleFieldFocus('program')}
                className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 text-slate-900 font-semibold appearance-none cursor-pointer hover:bg-slate-100"
              >
                <option value="">Select level...</option>
                <option value="Bachelor">🎓 Bachelor&apos;s Degree</option>
                <option value="Master">📜 Master&apos;s Degree</option>
                <option value="PhD">🔬 PhD</option>
                <option value="Diploma">📄 Diploma</option>
                <option value="Certificate">🔖 Certificate</option>
                <option value="Language Course">🗣 Language Course</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {showMessage && (
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1 ml-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => handleFieldFocus('message')}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all bg-slate-50 text-slate-900 font-medium resize-none placeholder:text-slate-400"
              placeholder="Any specific questions?"
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-red-700 text-xs font-bold">{error}</p>
          </div>
        )}

        {/* Enhanced Submit button - CRYSTAL BLUE */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-3.5 px-6 rounded-xl font-black text-base shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 ring-4 ring-transparent hover:ring-blue-100 mt-2"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>

          <div className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Get Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default EnhancedContactForm;

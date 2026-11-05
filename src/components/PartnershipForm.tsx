'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Handshake
} from 'lucide-react';
import { trackFormSubmission, getUserDevice } from '@/lib/vercel-analytics';
import { analyticsAllowed } from '@/lib/conversion-events';
import Link from 'next/link';

const PRIVACY_POLICY_VERSION = '2026-10-11';

interface PartnershipFormData {
  // Essential Information Only
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  partnershipType: string;
  motivation: string;
  privacyConsent: boolean;
}

const initialFormData: PartnershipFormData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  partnershipType: '',
  motivation: '',
  privacyConsent: false
};

const partnershipTypes = [
  { value: 'individual_agent', label: 'Individual Agent', description: 'Perfect for individual consultants and freelancers' },
  { value: 'company', label: 'Company', description: 'Ideal for education consultancies and agencies' }
];

const PartnershipForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PartnershipFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 2;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        else if (formData.contactPerson.trim().length < 2) newErrors.contactPerson = 'Name must be at least 2 characters';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (formData.phone.trim().length < 10) newErrors.phone = 'Please enter a valid phone number';

        if (!formData.city.trim()) newErrors.city = 'City is required';
        else if (formData.city.trim().length < 2) newErrors.city = 'Please enter a valid city name';

        if (!formData.country.trim()) newErrors.country = 'Country is required';
        else if (formData.country.trim().length < 2) newErrors.country = 'Please enter a valid country name';
        break;

      case 2: // Partnership Details
        if (!formData.partnershipType) newErrors.partnershipType = 'Please select a partnership type';
        if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us why you want to partner with us';
        else if (formData.motivation.trim().length < 20) newErrors.motivation = 'Please provide more details (at least 20 characters)';
        if (!formData.privacyConsent) newErrors.privacyConsent = 'Please accept the privacy policy to submit';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Essential fields from form
          companyName: formData.companyName || `${formData.contactPerson} - ${formData.partnershipType === 'individual_agent' ? 'Individual Agent' : 'Company'}`,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          partnershipType: formData.partnershipType,
          motivation: formData.motivation,

          // Required fields with defaults
          businessType: formData.partnershipType === 'individual_agent' ? 'individual' : 'consultancy',
          yearsInBusiness: 1,
          businessRegistrationNumber: '',
          businessLicense: '',
          website: '',
          alternatePhone: '',
          address: `${formData.city}, ${formData.country}`,
          state: formData.country, // Use country as state if not provided
          postalCode: '00000', // Default postal code
          targetCountries: ['United Kingdom', 'Australia', 'Canada'],
          currentClients: 0,
          monthlyTarget: formData.partnershipType === 'individual_agent' ? 3 : 10,
          experience: formData.partnershipType === 'individual_agent' ? 'Individual education consultancy experience' : 'Company education consultancy experience',
          currentPartners: '',
          annualRevenue: '',
          investmentCapacity: 'under-5k',
          expectedCommission: 'negotiable',
          marketingChannels: ['Other'],
          socialMediaPresence: {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: '',
            youtube: ''
          },
          localNetwork: 'Local education network',
          referralSources: ['Direct'],
          documents: {},
          expectations: 'Looking forward to a successful partnership',
          additionalInfo: '',
          source: 'partnership_page',
          consent: formData.privacyConsent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_POLICY_VERSION,
          trackingConsent: analyticsAllowed()
        }),
      });

      if (response.ok) {
        // Track successful partnership form submission
        trackFormSubmission('partnership', {
          page: 'partnership_form',
          source: 'partnership_page',
          user_type: 'new',
          device: getUserDevice(),
          partnership_type: formData.partnershipType,
          country: formData.country
        });

        setSubmitStatus('success');
        setFormData(initialFormData);
        setCurrentStep(1);
      } else {
        try {
          const errorData = await response.json();
          console.error('Submission error:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          console.error('Response status:', response.status, response.statusText);
        }
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = 'mb-1.5 block text-[14px] font-semibold text-petrol-800';
  const fieldClass = (field: keyof PartnershipFormData) =>
    `w-full min-h-[50px] rounded-xl border-2 px-4 text-[16px] text-petrol-800 placeholder:text-ink-mute transition-colors focus:border-petrol-800 focus:bg-white focus:outline-none ${
      errors[field] ? 'border-red-600 bg-red-50' : 'border-rule bg-chalk-100 hover:border-rule-strong'
    }`;
  const errorText = (field: keyof PartnershipFormData) =>
    errors[field] ? <p id={`partner-${field}-error`} className="mt-1.5 text-[14px] font-semibold text-red-700">{errors[field]}</p> : null;
  const describedBy = (field: keyof PartnershipFormData) => (errors[field] ? `partner-${field}-error` : undefined);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Building2 size={20} aria-hidden="true" /></span>
              <div>
                <h3 className="text-[19px] font-semibold text-petrol-800">Basic information</h3>
                <p className="text-[14px] text-ink-soft">Tell us about your company and contact details</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="partner-companyName" className={labelClass}>
                  Company name <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <input
                  id="partner-companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className={fieldClass('companyName')}
                  autoComplete="organization"
                  placeholder="Your company name (optional)"
                />
              </div>

              <div>
                <label htmlFor="partner-contactPerson" className={labelClass}>
                  Contact person *
                </label>
                <input
                  id="partner-contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  className={fieldClass('contactPerson')}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.contactPerson)}
                  aria-describedby={describedBy('contactPerson')}
                  placeholder="Your full name"
                />
                {errorText('contactPerson')}
              </div>

              <div>
                <label htmlFor="partner-email" className={labelClass}>
                  Email address *
                </label>
                <input
                  id="partner-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={fieldClass('email')}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy('email')}
                  placeholder="your@email.com"
                />
                {errorText('email')}
              </div>

              <div>
                <label htmlFor="partner-phone" className={labelClass}>
                  Phone number *
                </label>
                <input
                  id="partner-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={fieldClass('phone')}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy('phone')}
                  placeholder="+1 (555) 123-4567"
                />
                {errorText('phone')}
              </div>

              <div>
                <label htmlFor="partner-city" className={labelClass}>
                  City *
                </label>
                <input
                  id="partner-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={fieldClass('city')}
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={describedBy('city')}
                  placeholder="Your city"
                />
                {errorText('city')}
              </div>

              <div>
                <label htmlFor="partner-country" className={labelClass}>
                  Country *
                </label>
                <input
                  id="partner-country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className={fieldClass('country')}
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={describedBy('country')}
                  placeholder="Your country"
                />
                {errorText('country')}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Briefcase size={20} aria-hidden="true" /></span>
              <div>
                <h3 className="text-[19px] font-semibold text-petrol-800">Partnership details</h3>
                <p className="text-[14px] text-ink-soft">Tell us about your partnership goals</p>
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Partnership type *</legend>
              <div className="mt-1 grid grid-cols-1 gap-3 md:grid-cols-2">
                {partnershipTypes.map(type => {
                  const selected = formData.partnershipType === type.value;
                  return (
                    <label
                      key={type.value}
                      className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-petrol-800 ${
                        selected ? 'border-petrol-800 bg-lime-pale' : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <input
                        type="radio"
                        name="partnershipType"
                        value={type.value}
                        checked={selected}
                        onChange={(e) => updateFormData('partnershipType', e.target.value)}
                        className="sr-only"
                      />
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[16px] font-semibold text-petrol-800">{type.label}</span>
                        <span className={`grid size-5 place-items-center rounded-full border-2 ${selected ? 'border-petrol-800 bg-petrol-800' : 'border-rule-strong'}`} aria-hidden="true">
                          {selected && <span className="size-2 rounded-full bg-lime" />}
                        </span>
                      </span>
                      <span className="mt-1.5 text-[14px] leading-6 text-ink-soft">{type.description}</span>
                    </label>
                  );
                })}
              </div>
              {errorText('partnershipType')}
            </fieldset>

            <div>
              <label htmlFor="partner-motivation" className={labelClass}>
                Why do you want to partner with us? *
              </label>
              <textarea
                id="partner-motivation"
                value={formData.motivation}
                onChange={(e) => updateFormData('motivation', e.target.value)}
                className={`${fieldClass('motivation')} resize-none py-3`}
                rows={4}
                aria-invalid={Boolean(errors.motivation)}
                aria-describedby={describedBy('motivation')}
                placeholder="Briefly explain your motivation for partnering with EduExpress International..."
              />
              <div className="mt-1.5 flex items-center justify-between gap-3">
                {errors.motivation ? (
                  errorText('motivation')
                ) : (
                  <p className="text-[14px] text-ink-soft">
                    {formData.motivation.length < 20
                      ? `Minimum 20 characters (${formData.motivation.length}/20)`
                      : 'Great! You\'ve provided enough detail.'
                    }
                  </p>
                )}
                <span className="shrink-0 text-[14px] text-ink-mute">
                  {formData.motivation.length} characters
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 rounded-2xl bg-canvas-soft p-4 text-[14px] leading-6 text-ink-soft">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(event) => {
                    setFormData((previous) => ({ ...previous, privacyConsent: event.target.checked }));
                    if (errors.privacyConsent) {
                      setErrors((previous) => ({ ...previous, privacyConsent: '' }));
                    }
                  }}
                  className="mt-1 size-5 shrink-0 accent-petrol-800"
                />
                <span>
                  I agree that EduExpress International may use my details to review and respond to this partnership application, as described in the{' '}
                  <Link href="/privacy" className="font-semibold text-petrol-800 underline underline-offset-2" target="_blank">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {errorText('privacyConsent')}
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl bg-white px-6 py-12 text-center sm:px-10"
        role="status"
      >
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-lime text-petrol-800">
          <CheckCircle className="size-8" aria-hidden="true" />
        </span>
        <h3 className="font-display text-[30px] font-black leading-none text-petrol-800">Application Submitted Successfully!</h3>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-7 text-ink-soft">
          Thank you for your interest in partnering with EduExpress International.
          We have received your application and will review it carefully.
          Our team will contact you within 2-3 business days.
        </p>
        <button
          onClick={() => {
            setSubmitStatus('idle');
            setFormData(initialFormData);
            setCurrentStep(1);
          }}
          className="ed-btn ed-btn-outline mt-8 min-h-[48px] px-6"
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white">
      {/* Progress */}
      <div className="border-b border-canvas-soft px-6 py-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-petrol-800 text-[15px] font-bold text-lime">{currentStep}</span>
            <div>
              <span className="block text-[14px] font-semibold text-petrol-800">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="block text-[14px] text-ink-soft">
                {currentStep === 1 ? 'Basic Information' : 'Partnership Details'}
              </span>
            </div>
          </div>
          <span className="text-[14px] font-semibold text-petrol-800">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-canvas-soft">
          <motion.div
            className="h-2 rounded-full bg-lime"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-canvas-soft pt-5">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="ed-btn ed-btn-soft min-h-[48px] px-5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Previous</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="ed-btn ed-btn-signal min-h-[48px] px-6"
            >
              <span>Next</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ed-btn ed-btn-signal min-h-[48px] px-6 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-petrol-800/30 border-t-petrol-800" aria-hidden="true" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Handshake className="size-4" aria-hidden="true" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mt-5 flex items-center gap-3 rounded-2xl bg-red-50 p-4"
          >
            <AlertCircle className="size-5 shrink-0 text-red-700" aria-hidden="true" />
            <span className="text-[15px] font-semibold text-red-700">
              Failed to submit application. Please try again or contact support.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PartnershipForm;

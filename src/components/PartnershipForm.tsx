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
}

const initialFormData: PartnershipFormData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  partnershipType: '',
  motivation: ''
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
          source: 'partnership_page'
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
              <p className="text-gray-600 text-xs">Tell us about your company and contact details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors hover:border-gray-400"
                  placeholder="Your company name (optional)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => updateFormData('contactPerson', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${errors.contactPerson
                    ? 'border-red-500 bg-red-50'
                    : formData.contactPerson
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Your full name"
                />
                {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${errors.email
                    ? 'border-red-500 bg-red-50'
                    : formData.email
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${errors.phone
                    ? 'border-red-500 bg-red-50'
                    : formData.phone
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${errors.city
                    ? 'border-red-500 bg-red-50'
                    : formData.city
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Your city"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${errors.country
                    ? 'border-red-500 bg-red-50'
                    : formData.country
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Your country"
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-900">Partnership Details</h3>
              <p className="text-gray-600 text-xs">Tell us about your partnership goals</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Partnership Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partnershipTypes.map(type => (
                    <label key={type.value} className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.partnershipType === type.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      <input
                        type="radio"
                        name="partnershipType"
                        value={type.value}
                        checked={formData.partnershipType === type.value}
                        onChange={(e) => updateFormData('partnershipType', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900 text-sm">{type.label}</div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.partnershipType === type.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                          }`}>
                          {formData.partnershipType === type.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 leading-relaxed">{type.description}</div>
                    </label>
                  ))}
                </div>
                {errors.partnershipType && <p className="text-red-500 text-xs mt-2">{errors.partnershipType}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Why do you want to partner with us? *
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => updateFormData('motivation', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors resize-none ${errors.motivation
                    ? 'border-red-500 bg-red-50'
                    : formData.motivation
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  rows={4}
                  placeholder="Briefly explain your motivation for partnering with EduExpress International..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.motivation ? (
                    <p className="text-red-500 text-xs">{errors.motivation}</p>
                  ) : (
                    <p className="text-gray-500 text-xs">
                      {formData.motivation.length < 20
                        ? `Minimum 20 characters (${formData.motivation.length}/20)`
                        : 'Great! You\'ve provided enough detail.'
                      }
                    </p>
                  )}
                  <span className="text-xs text-gray-400">
                    {formData.motivation.length} characters
                  </span>
                </div>
              </div>
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
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h3>
        <p className="text-gray-600 mb-8">
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
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Application
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Compact Progress Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{currentStep}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-900">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="text-xs text-gray-600">
                {currentStep === 1 ? 'Basic Information' : 'Partnership Details'}
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4">
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
        <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors text-xs ${currentStep === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
              }`}
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Previous</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Handshake className="w-3 h-3" />
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
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">
              Failed to submit application. Please try again or contact support.
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PartnershipForm;

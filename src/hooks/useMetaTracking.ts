'use client';

import { useCallback } from 'react';
import {
  trackMetaEvent,
  trackLead,
  trackContact,
  trackWhatsAppClick,
  trackPhoneClick,
  trackDestinationView,
  trackScholarshipInquiry,
  trackConsultationRequest,
  trackApplicationSubmission,
  trackAdmissionReceived,
  trackVisaApproval,
  trackEnrollmentCompletion,
  trackMetaEventWithFacebookLogin,
  setUserId,
  clearUserId,
  EnhancedUserData
} from '@/lib/meta-event-quality';

// React hook for Meta event tracking with Event Quality parameters
export const useMetaTracking = () => {
  // Generic event tracking
  const trackEvent = useCallback((
    eventName: string,
    parameters: Record<string, unknown> = {},
    userData: EnhancedUserData = {}
  ) => {
    trackMetaEvent(eventName, parameters, userData);
  }, []);

  // Enhanced event tracking with Facebook Login ID
  const trackEventWithFacebookLogin = useCallback(async (
    eventName: string,
    parameters: Record<string, unknown> = {},
    userData: EnhancedUserData = {}
  ) => {
    await trackMetaEventWithFacebookLogin(eventName, parameters, userData);
  }, []);

  // Specific tracking functions
  const trackLeadEvent = useCallback((userData: EnhancedUserData, source: string = 'website') => {
    trackLead(userData, source);
  }, []);

  const trackContactEvent = useCallback((contactMethod: string, userData?: EnhancedUserData) => {
    trackContact(contactMethod, userData);
  }, []);

  const trackWhatsAppEvent = useCallback((source: string = 'website', userData?: EnhancedUserData) => {
    trackWhatsAppClick(source, userData);
  }, []);

  const trackPhoneEvent = useCallback((source: string = 'website', userData?: EnhancedUserData) => {
    trackPhoneClick(source, userData);
  }, []);

  const trackDestinationEvent = useCallback((countryName: string, userData?: EnhancedUserData) => {
    trackDestinationView(countryName, userData);
  }, []);

  const trackScholarshipEvent = useCallback((userData: EnhancedUserData) => {
    trackScholarshipInquiry(userData);
  }, []);

  const trackConsultationEvent = useCallback((source: string = 'website', userData?: EnhancedUserData) => {
    trackConsultationRequest(source, userData);
  }, []);

  const trackApplicationEvent = useCallback((
    userData: EnhancedUserData,
    university?: string,
    program?: string
  ) => {
    trackApplicationSubmission(userData, university, program);
  }, []);

  const trackAdmissionEvent = useCallback((
    userData: EnhancedUserData,
    university?: string,
    program?: string
  ) => {
    trackAdmissionReceived(userData, university, program);
  }, []);

  const trackVisaEvent = useCallback((
    userData: EnhancedUserData,
    university?: string,
    program?: string
  ) => {
    trackVisaApproval(userData, university, program);
  }, []);

  const trackEnrollmentEvent = useCallback((
    userData: EnhancedUserData,
    university?: string,
    program?: string
  ) => {
    trackEnrollmentCompletion(userData, university, program);
  }, []);

  // User management functions
  const setUser = useCallback((userId: string, persistent: boolean = true) => {
    setUserId(userId, persistent);
  }, []);

  const clearUser = useCallback(() => {
    clearUserId();
  }, []);

  // Form submission tracking
  const trackFormSubmission = useCallback((
    formType: 'contact' | 'consultation' | 'application' | 'scholarship' | 'partnership',
    formData: {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
      program?: string;
      message?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      company?: string;
      university?: string;
    },
    source: string = 'website'
  ) => {
    const [firstName, ...lastNameParts] = (formData.name || '').split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const userData: EnhancedUserData = {
      email: formData.email,
      phone: formData.phone,
      firstName: firstName,
      lastName: lastName,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,
      userId: formData.email // Use email as user ID if no specific ID
    };

    switch (formType) {
      case 'contact':
        trackContactEvent('contact_form', userData);
        break;
      case 'consultation':
        trackConsultationEvent(source, userData);
        break;
      case 'application':
        trackApplicationEvent(userData, formData.university, formData.program);
        break;
      case 'scholarship':
        trackScholarshipEvent(userData);
        break;
      case 'partnership':
        trackEvent('Lead', {
          content_name: 'Partnership Inquiry',
          content_category: 'Business Partnership',
          company_name: formData.company || 'not_specified',
          has_message: !!formData.message,
          value: 0,
          currency: 'BDT'
        }, userData);
        break;
      default:
        trackLeadEvent(userData, source);
    }
  }, [trackContactEvent, trackConsultationEvent, trackApplicationEvent, trackScholarshipEvent, trackLeadEvent, trackEvent]);

  // Button click tracking
  const trackButtonClick = useCallback((
    buttonType: 'whatsapp' | 'phone' | 'email' | 'consultation' | 'application',
    source: string = 'website',
    userData?: EnhancedUserData
  ) => {
    switch (buttonType) {
      case 'whatsapp':
        trackWhatsAppEvent(source, userData);
        break;
      case 'phone':
        trackPhoneEvent(source, userData);
        break;
      case 'email':
        trackContactEvent('email', userData);
        break;
      case 'consultation':
        trackConsultationEvent(source, userData);
        break;
      case 'application':
        trackEvent('InitiateCheckout', {
          content_name: 'Application Process Started',
          content_category: 'Application Process',
          value: 0,
          currency: 'BDT'
        }, userData);
        break;
    }
  }, [trackWhatsAppEvent, trackPhoneEvent, trackContactEvent, trackConsultationEvent, trackEvent]);

  // Page view tracking
  const trackPageView = useCallback((pageName: string, pageCategory: string = 'general') => {
    trackEvent('PageView', {
      content_name: pageName,
      content_category: pageCategory,
      page_title: pageName
    });
  }, [trackEvent]);

  // Content view tracking
  const trackContentView = useCallback((
    contentName: string,
    contentCategory: string,
    userData?: EnhancedUserData
  ) => {
    trackEvent('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      value: 0,
      currency: 'BDT'
    }, userData || {});
  }, [trackEvent]);

  return {
    // Generic tracking
    trackEvent,
    trackEventWithFacebookLogin,

    // Specific event tracking
    trackLeadEvent,
    trackContactEvent,
    trackWhatsAppEvent,
    trackPhoneEvent,
    trackDestinationEvent,
    trackScholarshipEvent,
    trackConsultationEvent,
    trackApplicationEvent,
    trackAdmissionEvent,
    trackVisaEvent,
    trackEnrollmentEvent,

    // Form and interaction tracking
    trackFormSubmission,
    trackButtonClick,
    trackPageView,
    trackContentView,

    // User management
    setUser,
    clearUser
  };
};

export default useMetaTracking;

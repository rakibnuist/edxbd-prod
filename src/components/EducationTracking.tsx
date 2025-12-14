'use client';

import { useEffect } from 'react';
import {
  trackWhatsAppClick,
  trackPhoneClick,
  trackScholarshipInquiry,
  trackUniversityInterest,
  trackProgramInterest,
  trackDocumentDownload,
  trackEmailSubscription,
  trackPartnershipInquiry
} from '@/lib/analytics';

interface EducationTrackingProps {
  // WhatsApp tracking
  whatsappSource?: string;

  // Phone tracking
  phoneSource?: string;

  // Scholarship tracking
  scholarshipCountry?: string;
  scholarshipProgram?: string;

  // University tracking
  universityName?: string;
  universityCountry?: string;

  // Program tracking
  programName?: string;
  programCountry?: string;

  // Document tracking
  documentName?: string;
  documentType?: string;

  // Email subscription
  emailAddress?: string;

  // Partnership tracking
  companyName?: string;
}

export default function EducationTracking({
  whatsappSource,
  phoneSource,
  scholarshipCountry,
  scholarshipProgram,
  universityName,
  universityCountry,
  programName,
  programCountry,
  documentName,
  documentType,
  emailAddress,
  companyName
}: EducationTrackingProps) {

  // Centralized Event Delegation for Performance - Deferred
  useEffect(() => {
    // Defer initialization to reduce TBT
    const timer = setTimeout(() => {
      // Only run on client
      if (typeof window === 'undefined') return;

      const handleGlobalDataTracking = (event: Event) => {
        const target = event.target as HTMLElement;

        // Handle Click Events
        if (event.type === 'click') {
          const trackingElement = target.closest('[data-tracking-type]');
          if (!trackingElement) return;

          const trackingType = trackingElement.getAttribute('data-tracking-type');
          const userData = { email: emailAddress };

          switch (trackingType) {
            case 'whatsapp':
              if (whatsappSource) trackWhatsAppClick(whatsappSource, userData);
              break;
            case 'phone':
              if (phoneSource) trackPhoneClick(phoneSource, userData);
              break;
            case 'scholarship':
              if (scholarshipCountry || scholarshipProgram) {
                trackScholarshipInquiry(scholarshipCountry || '', scholarshipProgram || '', userData);
              }
              break;
            case 'university':
              if (universityName && universityCountry) {
                trackUniversityInterest(universityName, universityCountry, userData);
              }
              break;
            case 'program':
              if (programName && programCountry) {
                trackProgramInterest(programName, programCountry, userData);
              }
              break;
            case 'document':
              if (documentName && documentType) {
                trackDocumentDownload(documentName, documentType, userData);
              }
              break;
            case 'partnership':
              if (companyName) {
                trackPartnershipInquiry(companyName, userData);
              }
              break;
          }
        }

        // Handle Submit Events (for Email Subscription)
        if (event.type === 'submit') {
          const trackingForm = target.closest('[data-email-subscription-tracking]');
          if (trackingForm && emailAddress) {
            trackEmailSubscription(emailAddress, { email: emailAddress });
          }
        }
      };

      // Attach listeners
      document.addEventListener('click', handleGlobalDataTracking, { passive: true });
      document.addEventListener('submit', handleGlobalDataTracking, { passive: true });

      // Return cleanup function
      return () => {
        document.removeEventListener('click', handleGlobalDataTracking);
        document.removeEventListener('submit', handleGlobalDataTracking);
      };
    }, 5000); // 5s delay - optimized for TBT

    return () => clearTimeout(timer);
  }, [whatsappSource, phoneSource, scholarshipCountry, scholarshipProgram, universityName, universityCountry, programName, programCountry, documentName, documentType, companyName, emailAddress]);

  return null;
}

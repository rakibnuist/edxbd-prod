'use client';

/**
 * EduExpress conversion event layer (Evidence-First Plan, Section 16).
 *
 * A single GA4-first tracking surface for the plan's named conversion events.
 * Every event automatically carries UTM parameters, the landing page and the
 * destination context so leads can be attributed in GA4 and reconciled in the CRM.
 *
 * Events are pushed to:
 *   - GA4 via gtag() / dataLayer (primary — quality conversions + attribution)
 *   - Meta Pixel via fbq() where a standard event mapping exists (secondary)
 *
 * The plan's 13 events:
 *   assessment_start, assessment_submit, whatsapp_click, phone_click,
 *   appointment_booked, compare_started, compare_completed,
 *   cost_sheet_downloaded, university_view, success_story_view,
 *   application_started, offer_received, visa_outcome
 */

export type ConversionEvent =
  | 'assessment_start'
  | 'assessment_submit'
  | 'whatsapp_click'
  | 'phone_click'
  | 'appointment_booked'
  | 'compare_started'
  | 'compare_completed'
  | 'cost_sheet_downloaded'
  | 'university_view'
  | 'success_story_view'
  | 'application_started'
  | 'offer_received'
  | 'visa_outcome';

export interface ConversionContext {
  destination?: string; // e.g. 'china', 'uk', 'hungary'
  counselor?: string;
  value?: number;
  label?: string;
  [key: string]: unknown;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_STORAGE_KEY = 'ee_utm';
const CONSENT_KEY = 'cookie-consent';

// GA4 standard-event mapping to Meta Pixel standard events (for the ones that map cleanly)
const META_EVENT_MAP: Partial<Record<ConversionEvent, string>> = {
  assessment_start: 'InitiateCheckout',
  assessment_submit: 'Lead',
  appointment_booked: 'Schedule',
  application_started: 'SubmitApplication',
  offer_received: 'CompleteRegistration',
};

/** Capture UTM parameters from the URL and persist them for the session. */
export function captureUtmParameters(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) found[key] = v;
    }
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
      return found;
    }
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Read persisted UTM parameters (falls back to a fresh capture). */
export function getUtmParameters(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Record<string, string>;
  } catch {
    /* ignore */
  }
  return captureUtmParameters();
}

/** Respect the cookie banner: only fire to third parties when analytics is accepted. */
function analyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // CookieConsent stores 'accepted' | 'declined' under 'cookie-consent'.
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Fire a conversion event to GA4 (and Meta where mapped).
 * Safe to call anywhere — no-ops on the server and before consent.
 */
export function trackConversion(event: ConversionEvent, context: ConversionContext = {}): void {
  if (typeof window === 'undefined') return;

  const payload: Record<string, unknown> = {
    ...getUtmParameters(),
    landing_page: window.location.pathname,
    page_location: window.location.href,
    ...context,
  };

  // Always populate dataLayer so GTM / server-side tagging can consume it even
  // if gtag() has not initialised yet.
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
  } catch {
    /* ignore */
  }

  if (!analyticsAllowed()) return;

  // GA4
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
    }
  } catch {
    /* ignore */
  }

  // Meta Pixel (only for cleanly-mapped standard events, HTTPS only)
  try {
    const metaEvent = META_EVENT_MAP[event];
    const isHttps = window.location.protocol === 'https:';
    if (metaEvent && isHttps && typeof window.fbq === 'function') {
      window.fbq('track', metaEvent, {
        content_name: event,
        content_category: (context.destination as string) || 'general',
        value: context.value ?? 0,
        currency: 'BDT',
      });
    }
  } catch {
    /* ignore */
  }
}

/* Convenience helpers for the most common call sites ---------------------- */

export const trackAssessmentStart = (ctx?: ConversionContext) => trackConversion('assessment_start', ctx);
export const trackAssessmentSubmit = (ctx?: ConversionContext) => trackConversion('assessment_submit', ctx);
export const trackWhatsAppClick = (ctx?: ConversionContext) => trackConversion('whatsapp_click', ctx);
export const trackPhoneClick = (ctx?: ConversionContext) => trackConversion('phone_click', ctx);
export const trackAppointmentBooked = (ctx?: ConversionContext) => trackConversion('appointment_booked', ctx);
export const trackCompareStarted = (ctx?: ConversionContext) => trackConversion('compare_started', ctx);
export const trackCompareCompleted = (ctx?: ConversionContext) => trackConversion('compare_completed', ctx);
export const trackCostSheetDownloaded = (ctx?: ConversionContext) => trackConversion('cost_sheet_downloaded', ctx);
export const trackUniversityView = (ctx?: ConversionContext) => trackConversion('university_view', ctx);
export const trackSuccessStoryView = (ctx?: ConversionContext) => trackConversion('success_story_view', ctx);
export const trackApplicationStarted = (ctx?: ConversionContext) => trackConversion('application_started', ctx);
export const trackOfferReceived = (ctx?: ConversionContext) => trackConversion('offer_received', ctx);
export const trackVisaOutcome = (ctx?: ConversionContext & { outcome: 'approved' | 'refused' }) =>
  trackConversion('visa_outcome', ctx);

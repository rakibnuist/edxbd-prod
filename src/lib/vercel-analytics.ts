import { track } from '@vercel/analytics';

/**
 * Vercel Analytics Event Tracking Utilities
 * 
 * This file provides utility functions for tracking custom events
 * using Vercel Analytics throughout your application.
 */

// Event types for better type safety
export type VercelEventName =
  | 'page_view'
  | 'contact_form_submit'
  | 'partnership_form_submit'
  | 'consultation_request'
  | 'whatsapp_click'
  | 'phone_click'
  | 'destination_page_view'
  | 'scholarship_interest'
  | 'university_interest'
  | 'download_brochure'
  | 'video_play'
  | 'page_scroll_50'
  | 'page_scroll_100'
  | 'time_on_page_30s'
  | 'time_on_page_60s'
  | 'time_on_page_120s';

// Event properties interface
export interface VercelEventProperties {
  page?: string;
  section?: string;
  country?: string;
  university?: string;
  program?: string;
  source?: string;
  user_type?: 'new' | 'returning';
  device?: 'mobile' | 'desktop' | 'tablet';
  timestamp?: string;
  scroll_percent?: number;
  time_spent?: number;
  phone_number?: string;
  partnership_type?: string;
  button_text?: string;
  interest_type?: string;
  details?: string;
  video_title?: string;
  file_name?: string;
  file_type?: string;
  engagement_metric?: string;
  form_type?: string;
  contact_method?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track a custom event with Vercel Analytics
 * 
 * @param name - The event name
 * @param properties - Optional event properties
 * 
 * @example
 * trackEvent('contact_form_submit', {
 *   page: 'contact',
 *   source: 'header_button',
 *   user_type: 'new'
 * });
 */
export const trackEvent = (name: VercelEventName, properties?: VercelEventProperties) => {
  try {
    // Filter out undefined values to match Vercel Analytics requirements
    const cleanProperties = properties ? Object.fromEntries(
      Object.entries(properties).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number | boolean> : undefined;

    track(name, cleanProperties);
    console.log(`Vercel Analytics: Tracked event "${name}"`, cleanProperties);
  } catch (error) {
    console.error('Vercel Analytics tracking error:', error);
  }
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formType: 'contact' | 'partnership' | 'consultation', properties?: VercelEventProperties) => {
  const eventName = `${formType}_form_submit` as VercelEventName;
  trackEvent(eventName, {
    ...properties,
    form_type: formType,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user interactions with contact methods
 */
export const trackContactInteraction = (method: 'whatsapp' | 'phone' | 'email', properties?: VercelEventProperties) => {
  const eventName = `${method}_click` as VercelEventName;
  trackEvent(eventName, {
    ...properties,
    contact_method: method,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track destination page interactions
 */
export const trackDestinationInterest = (country: string, properties?: VercelEventProperties) => {
  trackEvent('destination_page_view', {
    ...properties,
    country,
    page: `destinations/${country.toLowerCase()}`
  });
};

/**
 * Track scholarship and university interests
 */
export const trackEducationInterest = (type: 'scholarship' | 'university', details: string, properties?: VercelEventProperties) => {
  const eventName = `${type}_interest` as VercelEventName;
  trackEvent(eventName, {
    ...properties,
    interest_type: type,
    details,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user engagement metrics
 */
export const trackEngagement = (metric: 'scroll_50' | 'scroll_100' | 'time_30s' | 'time_60s' | 'time_120s', properties?: VercelEventProperties) => {
  const eventName = `page_${metric}` as VercelEventName;
  trackEvent(eventName, {
    ...properties,
    engagement_metric: metric,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track video interactions
 */
export const trackVideoInteraction = (action: 'play' | 'pause' | 'complete', videoTitle: string, properties?: VercelEventProperties) => {
  if (action === 'play') {
    trackEvent('video_play', {
      ...properties,
      video_title: videoTitle,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Track download events
 */
export const trackDownload = (fileName: string, fileType: string, properties?: VercelEventProperties) => {
  trackEvent('download_brochure', {
    ...properties,
    file_name: fileName,
    file_type: fileType,
    timestamp: new Date().toISOString()
  });
};

/**
 * Get user device type for tracking
 */
export const getUserDevice = (): 'mobile' | 'desktop' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Track page view with additional context
 */
export const trackPageView = (pageName: string, properties?: VercelEventProperties) => {
  trackEvent('page_view' as VercelEventName, {
    ...properties,
    page: pageName,
    device: getUserDevice(),
    timestamp: new Date().toISOString()
  });
};

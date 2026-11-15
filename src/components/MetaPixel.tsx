'use client';

import {
  ensureClientMetaParams,
  getClientMetaParamsSync,
} from '@/lib/meta-param-builder-client';
import { captureLandingFbclid } from '@/lib/tracking-consent';

if (typeof window !== 'undefined') {
  captureLandingFbclid(window.location.href);
}

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGE_EVENT } from '@/components/CookieConsent';
import {
  buildMetaAdvancedMatching,
  clearTrackingState,
  getOrCreateConsentedExternalId,
  isAnalyticsConsentAccepted,
  readCookieValue,
} from '@/lib/tracking-consent';

type MetaWindow = Window & {
  __metaPixelLoaded?: boolean;
  __metaPixelInitializing?: boolean;
  __metaPixelId?: string;
  __metaPixelLastPath?: string;
};

// Internal tools set no marketing cookies or ad-tracking events.
const EXCLUDED_ROUTE = /^\/(admin|dashboard|login)(\/|$)/;

function createPageViewEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `pv_${crypto.randomUUID()}`;
  }
  return `pv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function dispatchServerPageView(eventId: string, pageUrl: string, pageTitle: string): void {
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') return;
  if (!isAnalyticsConsentAccepted()) return;

  const externalId = getOrCreateConsentedExternalId();
  const { fbc: clientFbc, fbp: clientFbp } = getClientMetaParamsSync();
  const fbp = readCookieValue('_fbp') || clientFbp;
  const fbc = readCookieValue('_fbc') || clientFbc;

  void fetch('/api/meta-capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: 'PageView',
      event_id: eventId,
      event_source_url: pageUrl,
      user_data: {
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
        ...(externalId ? { external_id: externalId } : {}),
      },
      custom_data: {
        ...(pageTitle ? { page_title: pageTitle } : {}),
      },
      trackingConsent: true,
    }),
  }).catch(() => undefined);
}

// Loads the Meta (Facebook) Pixel at runtime using the Pixel ID stored in the
// admin Settings (DB) or environment, and sends a deduplicated server-side
// PageView via /api/meta-capi once the visitor grants consent.
export default function MetaPixel() {
  const pathname = usePathname();

  const initialiseOrTrackPage = useCallback(async () => {
      if (typeof window === 'undefined') return;
      if (window.location.protocol !== 'https:') return;
      if (!isAnalyticsConsentAccepted()) {
        clearTrackingState();
        (window as MetaWindow).__metaPixelLastPath = undefined;
        return;
      }
      if (EXCLUDED_ROUTE.test(pathname ?? '')) return;

      const metaWindow = window as MetaWindow;
      if (metaWindow.__metaPixelLoaded) {
        window.fbq?.('consent', 'grant');
        if (metaWindow.__metaPixelLastPath !== pathname) {
          metaWindow.__metaPixelLastPath = pathname;
          const eventId = createPageViewEventId();
          const currentHref = window.location.href;
          const currentTitle = document.title;
          window.fbq?.('track', 'PageView', {}, { eventID: eventId });
          void ensureClientMetaParams(currentHref).finally(() => {
            dispatchServerPageView(eventId, currentHref, currentTitle);
          });
        }
        return;
      }
      if (metaWindow.__metaPixelInitializing) return;
      metaWindow.__metaPixelInitializing = true;

      try {
        const res = await fetch('/api/public-config');
        if (!res.ok) return;
        const { metaPixelId: pixelId } = await res.json();
        if (!pixelId || !isAnalyticsConsentAccepted() || EXCLUDED_ROUTE.test(pathname ?? '')) return;

        metaWindow.__metaPixelLoaded = true;
        metaWindow.__metaPixelId = pixelId;
        metaWindow.__metaPixelLastPath = pathname;

        /* eslint-disable */
        // Standard Meta Pixel bootstrap.
        let scriptEl: HTMLScriptElement | null = null;
        (function (f: any, b: any, e: any, v: any) {
          if (f.fbq) return;
          const n: any = (f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          });
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          const t = b.createElement(e);
          t.async = true;
          t.src = v;
          scriptEl = t;
          const s = b.getElementsByTagName(e)[0];
          if (s?.parentNode) s.parentNode.insertBefore(t, s);
          else b.head?.appendChild(t);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        // Advanced Matching parameters for Meta Pixel (strictly consent-gated, opaque ID only)
        const advancedMatching = buildMetaAdvancedMatching();
        const eventId = createPageViewEventId();
        const pageUrl = window.location.href;
        const pageTitle = document.title;

        window.fbq?.('consent', 'grant');
        if (Object.keys(advancedMatching).length > 0) {
          window.fbq?.('init', pixelId, advancedMatching);
        } else {
          window.fbq?.('init', pixelId);
        }
        window.fbq?.('track', 'PageView', {}, { eventID: eventId });

        // Wait briefly for fbevents.js to write `_fbp` before firing server CAPI,
        // while ensuring Meta Parameter Builder populates `_fbp`/`_fbc` locally even if fbevents.js is blocked.
        const paramsPromise = ensureClientMetaParams(pageUrl);
        let dispatched = false;
        const flushServerPageView = () => {
          if (dispatched) return;
          dispatched = true;
          window.clearTimeout(fallbackTimer);
          void paramsPromise.finally(() => {
            dispatchServerPageView(eventId, pageUrl, pageTitle);
          });
        };
        const fallbackTimer = window.setTimeout(flushServerPageView, 700);
        const injectedScript = scriptEl as HTMLScriptElement | null;
        if (injectedScript) {
          injectedScript.addEventListener('load', flushServerPageView, { once: true });
          injectedScript.addEventListener('error', flushServerPageView, { once: true });
        } else {
          flushServerPageView();
        }
      } catch {
        /* silent — analytics must never break the page */
      } finally {
        metaWindow.__metaPixelInitializing = false;
      }
  }, [pathname]);

  useEffect(() => {
    void initialiseOrTrackPage();
  }, [initialiseOrTrackPage]);

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const accepted = (event as CustomEvent<{ accepted?: boolean }>).detail?.accepted === true;
      if (accepted) {
        void initialiseOrTrackPage();
      } else {
        clearTrackingState();
        (window as MetaWindow).__metaPixelLastPath = undefined;
        window.fbq?.('consent', 'revoke');
      }
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    };
  }, [initialiseOrTrackPage]);

  return null;
}

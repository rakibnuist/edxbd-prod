'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CONSENT_STORAGE_KEY,
  clearTrackingState,
  isAnalyticsConsentAccepted,
} from '@/lib/tracking-consent';

export { CONSENT_STORAGE_KEY };
export const CONSENT_CHANGE_EVENT = 'eduexpress:consent-change';
const OPEN_SETTINGS_EVENT = 'eduexpress:open-cookie-settings';

// Internal tools set no marketing cookies; the banner only gets in the way there.
const HIDDEN_ROUTE = /^\/(admin|dashboard|login)(\/|$)/;

/** Footer link that reopens the banner so a visitor can change an earlier choice. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      Cookie settings
    </button>
  );
}

function announceConsent(accepted: boolean) {
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { accepted } }));
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const open = () => setIsVisible(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isAnalyticsConsentAccepted()) {
      clearTrackingState();
    }
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    announceConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    clearTrackingState();
    announceConsent(false);
    setIsVisible(false);
  };

  if (!isVisible || HIDDEN_ROUTE.test(pathname ?? '')) return null;

  return (
    <div
      data-cookie-banner="open"
      className="fixed inset-x-3 bottom-3 z-[45] animate-[cookie-in_.25s_ease-out] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[360px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-rule bg-chalk/95 shadow-deep backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 border-b border-rule/80 bg-canvas-soft/70 px-3.5 py-2">
          <p className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-petrol-800">
            <Cookie className="size-3.5 text-petrol-600" aria-hidden="true" /> Cookies &amp; analytics
          </p>
          <button
            type="button"
            onClick={handleDecline}
            className="rounded-full p-1 text-ink-mute transition-colors hover:bg-white hover:text-ink"
            aria-label="Dismiss cookie notice"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="px-3.5 py-2.5 sm:py-3">
          <p className="text-[12.5px] leading-5 text-ink-soft">
            Optional cookies measure site performance.{' '}
            <Link href="/privacy" className="font-semibold text-petrol-700 underline underline-offset-2 hover:text-petrol-900">
              Privacy policy
            </Link>
            .
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button type="button" onClick={handleAccept} className="ed-btn ed-btn-signal min-h-9 flex-1 px-3 py-1.5 text-[13px]">
              Accept all
            </button>
            <button type="button" onClick={handleDecline} className="ed-btn ed-btn-outline min-h-9 flex-1 bg-white px-3 py-1.5 text-[13px]">
              Essential only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

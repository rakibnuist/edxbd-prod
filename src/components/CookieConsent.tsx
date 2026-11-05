'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const CONSENT_STORAGE_KEY = 'cookie-consent';
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
    announceConsent(false);
    setIsVisible(false);
  };

  if (!isVisible || HIDDEN_ROUTE.test(pathname ?? '')) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[65] animate-[cookie-in_.3s_ease-out] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[380px]">
      <div className="relative overflow-hidden border border-rule bg-chalk shadow-deep">
        <div className="flex items-start justify-between gap-3 border-b border-rule bg-chalk-100 px-4 py-2.5">
          <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-petrol-700">
            <Cookie className="size-3.5" aria-hidden="true" /> Cookies and measurement
          </p>
          <button type="button" onClick={handleDecline} className="text-ink-mute transition-colors hover:text-ink" aria-label="Dismiss cookie notice">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 py-3.5">
          <p className="text-[14px] leading-6 text-ink-soft">
            We use cookies to measure traffic and advertising performance. Nothing non-essential loads until you accept. Read the{' '}
            <Link href="/privacy" className="font-semibold text-petrol-600 underline underline-offset-2 hover:text-petrol-800">
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={handleAccept} className="ed-btn ed-btn-primary min-h-9 flex-1 px-3 text-[14px]">
              Accept all
            </button>
            <button type="button" onClick={handleDecline} className="ed-btn ed-btn-outline min-h-9 flex-1 px-3 text-[14px]">
              Essential only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

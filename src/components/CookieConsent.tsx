'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export const CONSENT_STORAGE_KEY = 'cookie-consent';
export const CONSENT_CHANGE_EVENT = 'eduexpress:consent-change';

function announceConsent(accepted: boolean) {
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { accepted } }));
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented or declined
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
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

  if (!isVisible) return null;

  return (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-[cookie-in_.35s_ease-out] font-sans md:left-6 md:right-auto md:max-w-md">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-6 rounded-[2rem] flex flex-col gap-4 relative overflow-hidden">
            {/* Ambient Background decoration */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                <Cookie className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-none">Cookie Preferences</h3>
                  <button
                    onClick={handleDecline}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50 md:hidden"
                    aria-label="Dismiss cookie notice"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We use cookies to personalize content, customize ads, and analyze traffic. By clicking{" "}
                  <strong className="text-slate-900 font-semibold">&quot;Accept All&quot;</strong>, you consent to our use of cookies.
                  Learn more in our{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleAccept}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-500/10 active:scale-95 text-center"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all duration-200 active:scale-95 text-center"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
  );
}

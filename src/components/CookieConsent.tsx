'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented or declined
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-50 font-sans"
        >
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
                  <strong className="text-slate-900 font-semibold">"Accept All"</strong>, you consent to our use of cookies.
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

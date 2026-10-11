'use client';

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGE_EVENT, CONSENT_STORAGE_KEY } from '@/components/CookieConsent';

type MetaWindow = Window & {
  __metaPixelLoaded?: boolean;
  __metaPixelId?: string;
  __metaPixelLastPath?: string;
};

// Loads the Meta (Facebook) Pixel at runtime using the Pixel ID stored in the
// admin Settings (DB) or environment. Because the ID is fetched on the client
// after load, changing it in /admin/settings takes effect on next page load —
// no rebuild required. Once fbq is initialised, all fbq('track', ...) calls
// elsewhere route to this pixel automatically.
export default function MetaPixel() {
  const pathname = usePathname();

  const initialiseOrTrackPage = useCallback(async () => {
      if (typeof window === 'undefined') return;
      if (window.location.protocol !== 'https:') return;
      if (localStorage.getItem(CONSENT_STORAGE_KEY) !== 'accepted') return;

      const metaWindow = window as MetaWindow;
      if (metaWindow.__metaPixelLoaded) {
        window.fbq?.('consent', 'grant');
        if (metaWindow.__metaPixelLastPath !== pathname) {
          window.fbq?.('track', 'PageView');
          metaWindow.__metaPixelLastPath = pathname;
        }
        return;
      }

      try {
        const res = await fetch('/api/public-config');
        if (!res.ok) return;
        const { metaPixelId: pixelId } = await res.json();
        if (!pixelId || localStorage.getItem(CONSENT_STORAGE_KEY) !== 'accepted') return;

        metaWindow.__metaPixelLoaded = true;

        /* eslint-disable */
        // Standard Meta Pixel bootstrap.
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
          const s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        window.fbq?.('consent', 'grant');
        window.fbq?.('init', pixelId);
        window.fbq?.('track', 'PageView');

        // Expose for any code that wants to check configuration at runtime.
        metaWindow.__metaPixelId = pixelId;
        metaWindow.__metaPixelLastPath = pathname;
      } catch {
        /* silent — analytics must never break the page */
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

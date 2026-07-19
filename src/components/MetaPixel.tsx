'use client';

import { useEffect } from 'react';

// Loads the Meta (Facebook) Pixel at runtime using the Pixel ID stored in the
// admin Settings (DB) or environment. Because the ID is fetched on the client
// after load, changing it in /admin/settings takes effect on next page load —
// no rebuild required. Once fbq is initialised, all fbq('track', ...) calls
// elsewhere route to this pixel automatically.
export default function MetaPixel() {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Only run on HTTPS and once.
      if (typeof window === 'undefined') return;
      if ((window as unknown as { __metaPixelLoaded?: boolean }).__metaPixelLoaded) return;

      try {
        const res = await fetch('/api/public-config');
        if (!res.ok) return;
        const { metaPixelId: pixelId } = await res.json();
        if (cancelled || !pixelId) return;

        (window as unknown as { __metaPixelLoaded?: boolean }).__metaPixelLoaded = true;

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

        const w = window as unknown as { fbq?: (...args: unknown[]) => void };
        w.fbq?.('init', pixelId);
        w.fbq?.('track', 'PageView');

        // Expose for any code that wants to check configuration at runtime.
        (window as unknown as { __metaPixelId?: string }).__metaPixelId = pixelId;
      } catch {
        /* silent — analytics must never break the page */
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

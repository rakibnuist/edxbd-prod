'use client';

import { useEffect } from 'react';

// Loads Google Tag Manager and/or GA4 at runtime using IDs from admin Settings
// (DB) or environment. Changing them in /admin/settings takes effect on next
// page load — no rebuild required.
export default function GoogleTags() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const flag = window as unknown as { __googleTagsLoaded?: boolean };
    if (flag.__googleTagsLoaded) return;

    const load = async () => {
      try {
        const res = await fetch('/api/public-config');
        if (!res.ok) return;
        const { gtmId, ga4Id } = await res.json();
        if (!gtmId && !ga4Id) return;
        flag.__googleTagsLoaded = true;

        // Google Tag Manager
        if (gtmId) {
          const w = window as unknown as { dataLayer?: unknown[] };
          w.dataLayer = w.dataLayer || [];
          w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
          const s = document.createElement('script');
          s.async = true;
          s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
          document.head.appendChild(s);

          const noscript = document.createElement('noscript');
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`;
          iframe.height = '0';
          iframe.width = '0';
          iframe.style.display = 'none';
          iframe.style.visibility = 'hidden';
          noscript.appendChild(iframe);
          document.body.prepend(noscript);
        }

        // GA4 (gtag.js) — only if GTM isn't already managing GA4
        if (ga4Id && !gtmId) {
          const s = document.createElement('script');
          s.async = true;
          s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
          document.head.appendChild(s);
          const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
          w.dataLayer = w.dataLayer || [];
          w.gtag = function gtag() { w.dataLayer!.push(arguments); };
          w.gtag('js', new Date());
          w.gtag('config', ga4Id);
        }
      } catch {
        /* analytics must never break the page */
      }
    };

    load();
  }, []);

  return null;
}

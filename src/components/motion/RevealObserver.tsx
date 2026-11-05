'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One IntersectionObserver for every `[data-anim]` element on the page.
 *
 * Content is visible by default: without JavaScript, before hydration, and for
 * visitors who prefer reduced motion nothing is ever hidden. On mount, only
 * elements that start below the fold are marked `data-anim-state="out"`; when
 * they approach the viewport they flip to `"in"` and a one-shot CSS keyframe
 * (transform + opacity only) plays. Elements already on screen are left alone,
 * so the first view never flashes.
 *
 * `[data-pause-offscreen]` elements get `data-offscreen` while out of view so
 * continuous CSS animations (the university logo ticker) stop running.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const pauseObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
    });
    document.querySelectorAll('[data-pause-offscreen]').forEach(el => pauseObserver.observe(el));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => pauseObserver.disconnect();
    }

    // Read every position first, then write: no interleaved layout reads/writes.
    // Elements already marked `out` (e.g. by a previous mount) are observed again.
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]:not([data-anim-state="in"])'));
    const fold = window.innerHeight * 0.92;
    const belowFold = targets.filter(el => el.dataset.animState === 'out' || el.getBoundingClientRect().top > fold);
    belowFold.forEach(el => {
      el.dataset.animState = 'out';
    });

    const revealObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.animState = 'in';
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
    );
    belowFold.forEach(el => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      pauseObserver.disconnect();
      // Never leave content hidden once nothing is watching it.
      belowFold.forEach(el => {
        if (el.dataset.animState === 'out') delete el.dataset.animState;
      });
    };
  }, [pathname]);

  return null;
}

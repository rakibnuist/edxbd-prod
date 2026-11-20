'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One IntersectionObserver for every `[data-anim]` element on the page.
 *
 * Content is visible by default: without JavaScript, before hydration, and for
 * visitors who prefer reduced motion nothing is ever hidden. On mount, only
 * elements well below the initial viewport are marked `data-anim-state="out"`;
 * as they approach the viewport they flip to `"in"` cleanly so fast scrolls,
 * hash jumps, and tall mobile grids never remain faded or blank.
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

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]:not([data-anim-state="in"])'));
    const preloadThreshold = () => Math.max(window.innerHeight * 1.15, 760);
    const fold = preloadThreshold();
    const belowFold = targets.filter(el => el.dataset.animState === 'out' || el.getBoundingClientRect().top > fold);
    belowFold.forEach(el => {
      el.dataset.animState = 'out';
    });

    if (belowFold.length === 0) {
      return () => pauseObserver.disconnect();
    }

    const pending = new Set<HTMLElement>(belowFold);
    const revealElement = (el: HTMLElement) => {
      el.dataset.animState = 'in';
      pending.delete(el);
      revealObserver.unobserve(el);
    };

    const revealObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight * 1.1) {
            revealElement(el);
          }
        }
      },
      { rootMargin: '120px 0px 180px 0px', threshold: 0 },
    );

    pending.forEach(el => revealObserver.observe(el));

    let rafId = 0;
    const sweepVisible = () => {
      rafId = 0;
      const limit = window.innerHeight * 1.12;
      pending.forEach(el => {
        if (el.getBoundingClientRect().top <= limit) {
          revealElement(el);
        }
      });
      if (pending.size === 0) {
        window.removeEventListener('scroll', scheduleSweep);
        window.removeEventListener('resize', scheduleSweep);
      }
    };

    const scheduleSweep = () => {
      if (!rafId && pending.size > 0) {
        rafId = window.requestAnimationFrame(sweepVisible);
      }
    };

    window.addEventListener('scroll', scheduleSweep, { passive: true });
    window.addEventListener('resize', scheduleSweep, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleSweep);
      window.removeEventListener('resize', scheduleSweep);
      revealObserver.disconnect();
      pauseObserver.disconnect();
      belowFold.forEach(el => {
        if (el.dataset.animState === 'out') delete el.dataset.animState;
      });
    };
  }, [pathname]);

  return null;
}

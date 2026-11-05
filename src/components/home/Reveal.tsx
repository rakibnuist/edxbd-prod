'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Fades and lifts its children into place the first time they approach the
 * viewport. Content is visible by default (no-JS safe, and never hides the
 * first screen or the LCP element); only blocks that start below the fold are
 * armed. Users who prefer reduced motion, or browsers without
 * IntersectionObserver, simply get the static content.
 */
type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in ms for grids. */
  delay?: number;
};

export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Anything already on screen at mount stays visible (no flash, no LCP risk).
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setState('hidden');
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('shown');
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state === 'idle' ? undefined : state}
      style={delay > 0 ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts a metric up when it scrolls into view.
 *
 * Values arrive from the CMS as display strings ("2000+", "134+", "2018"), so
 * the numeric part is animated and any prefix/suffix is preserved verbatim —
 * the published figure must never render as something other than what was
 * approved. Years are left alone: watching "2018" spin up reads as a bug.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const numeric = match ? Number(match[2].replaceAll(',', '')) : NaN;
  const prefix = match?.[1] ?? '';
  const suffix = match?.[3] ?? '';

  // A 4-digit number with no suffix is a year — don't animate it.
  const isYear = !suffix && numeric >= 1900 && numeric <= 2999;
  const animatable = Boolean(match) && Number.isFinite(numeric) && !isYear && !reduced;

  const [display, setDisplay] = useState(() => (animatable ? `${prefix}0${suffix}` : value));

  useEffect(() => {
    if (!animatable || !inView) return;
    const controls = animate(0, numeric, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: latest => setDisplay(`${prefix}${Math.round(latest).toLocaleString('en-US')}${suffix}`),
    });
    return () => controls.stop();
  }, [animatable, inView, numeric, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {animatable ? display : value}
    </span>
  );
}

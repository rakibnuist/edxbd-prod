'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin reading/scroll indicator pinned under the fixed header. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-[74px] z-40 h-[2px] origin-left bg-marigold lg:top-[108px]"
    />
  );
}

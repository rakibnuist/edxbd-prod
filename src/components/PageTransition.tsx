'use client';

import { m, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { pageVariants } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="w-full"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

export default PageTransition;

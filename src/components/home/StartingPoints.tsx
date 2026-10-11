'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export type StartingPoint = {
  title: string;
  href: string;
  image: string;
  alt: string;
  caption: string;
};

/**
 * Four ways in. Hovering or focusing a row swaps the image beside it, so the
 * picture carries the explanation the descriptive paragraph used to.
 */
export default function StartingPoints({ items }: { items: StartingPoint[] }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = items[active];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
      <ul>
        {items.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className="ed-index-row group relative block px-1 py-6 sm:px-3"
            >
              <span className="flex items-center gap-5 sm:gap-7">
                <span className="ed-label w-6 shrink-0 text-[#2f7fbf]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={`ed-display flex-1 text-[1.6rem] transition-colors duration-200 sm:text-[2rem] ${
                    active === index ? 'text-[#2f7fbf]' : 'text-[#0a1f33]'
                  }`}
                >
                  {item.title}
                </span>
                <ArrowUpRight
                  size={22}
                  className={`shrink-0 transition-all duration-200 ${
                    active === index ? 'translate-x-1 text-[#2f7fbf]' : 'text-[#9aa8b8]'
                  }`}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:block">
        <div className="ed-plate relative aspect-[4/5]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.image}
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image src={current.image} alt={current.alt} fill sizes="32vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 min-h-[3.5rem] border-t border-[#e2e7ee] pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.caption}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="text-sm leading-6 text-[#55677a]"
            >
              {current.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

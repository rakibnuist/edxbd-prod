'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export type DestinationRow = {
  slug: string;
  name: string;
  flag: string;
  status: string;
  href: string;
  established: boolean;
};

/**
 * The destination register. Rows lift and reveal their status on hover, so the
 * list stays scannable at rest and explains itself on interaction instead of
 * carrying a paragraph underneath.
 */
export default function DestinationRegister({ rows }: { rows: DestinationRow[] }) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <ul>
      {rows.map((row, index) => {
        const isActive = active === row.slug;
        return (
          <motion.li
            data-reveal
            key={row.slug}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.45, delay: reduced ? 0 : index * 0.045, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={row.href}
              onMouseEnter={() => setActive(row.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(row.slug)}
              onBlur={() => setActive(null)}
              className="ed-index-row group block px-1 py-5 sm:px-3"
            >
              <span className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[1fr_8rem_1.5rem] sm:gap-6">
                <span className="flex items-center gap-4">
                  <motion.span
                    className="text-2xl"
                    aria-hidden="true"
                    animate={reduced ? {} : { scale: isActive ? 1.18 : 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {row.flag}
                  </motion.span>
                  <span
                    className={`ed-display text-xl transition-colors duration-200 sm:text-[1.6rem] ${
                      isActive ? 'text-[#2c6a97]' : 'text-[#14212e]'
                    }`}
                  >
                    {row.name}
                  </span>
                </span>
                <span
                  className={`ed-label justify-self-start rounded-full border px-2.5 py-1 transition-colors duration-200 ${
                    row.established
                      ? isActive
                        ? 'border-[#2c6a97] text-[#2c6a97]'
                        : 'border-[#475569]/35 text-[#475569]'
                      : 'border-[#4a9cc8] bg-[#f1f5f9] text-[#256994]'
                  }`}
                >
                  {row.status}
                </span>
                <ArrowUpRight
                  size={20}
                  className={`hidden transition-all duration-200 sm:block ${
                    isActive ? 'translate-x-1 text-[#2c6a97]' : 'text-[#cfe7f5]'
                  }`}
                />
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

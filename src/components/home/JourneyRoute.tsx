'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plane } from 'lucide-react';

type Stage = {
  title: string;
  copy: string;
};

const stages: Stage[] = [
  {
    title: 'Share your profile',
    copy: 'Study level, subject, results, budget and preferred intake.',
  },
  {
    title: 'Compare options',
    copy: 'A shortlist where recognition, cost and fit are checked together.',
  },
  {
    title: 'Full cost in writing',
    copy: 'University, third-party and EduExpress charges separated on one schedule.',
  },
  {
    title: 'Complete application',
    copy: 'Documents, submission and admission notice — tracked in your record.',
  },
  {
    title: 'Prepare for the visa',
    copy: 'Your file checked against the current official requirements.',
  },
  {
    title: 'Travel with support',
    copy: 'Air ticket, airport pickup and arrival guidance per the signed package.',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function JourneyRoute() {
  const reduced = useReducedMotion();

  return (
    <section data-surface="dark" className="relative overflow-hidden bg-petrol-900 px-5 py-section text-white sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(169,214,238,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(169,214,238,.14) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="relative mx-auto max-w-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[58ch]">
            <p className="ed-label !text-mint-300">How it runs</p>
            <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,3.2rem)] leading-[1.04] text-white">
              Six stages. Each one has a name and a document.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-7 text-white/65">
              Each stage has a named owner and a document you keep. No step depends on remembering a phone call.
            </p>
          </div>
          <Link href="/your-study-journey" className="ed-btn ed-btn-on-dark min-h-11 shrink-0">
            See the complete journey <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute inset-x-0 top-[23px] hidden lg:block" aria-hidden="true">
            <div className="relative h-px w-full">
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left border-t border-dashed border-mint-300/35"
                initial={{ scaleX: reduced ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.3, ease: EASE }}
              />
              <motion.span
                className="absolute -top-[13px] right-[-4px] grid size-6 place-items-center rounded-full bg-marigold text-petrol-900"
                initial={{ opacity: 0, x: reduced ? 0 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: EASE, delay: 1.1 }}
              >
                <Plane size={12} className="rotate-45" />
              </motion.span>
            </div>
          </div>

          <ol className="relative grid gap-0 border-l border-dashed border-mint-300/25 pl-9 lg:grid-cols-6 lg:gap-6 lg:border-l-0 lg:pl-0">
            {stages.map((stage, index) => (
              <motion.li
                key={stage.title}
                className="relative pb-9 last:pb-0 lg:pb-0 lg:pr-2"
                initial={reduced ? false : { y: 18 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
              >
                <span className="absolute -left-[46px] top-0 grid size-[38px] place-items-center rounded-full border border-mint-300/40 bg-petrol-900 font-heading text-[14px] text-marigold lg:static lg:mb-6">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="font-heading text-[20px] leading-snug text-white">{stage.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-white/60">{stage.copy}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <p className="mt-10 border-t border-white/12 pt-5 text-[13px] leading-6 text-white/50">
          No consultancy controls an embassy decision. The final decision belongs to the relevant university and authority.
        </p>
      </div>
    </section>
  );
}

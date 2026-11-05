import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, kit } from '@/components/page/PageKit';

/**
 * Readable layout for the legal pages (/privacy, /terms): a contents list that
 * stays in view on desktop, numbered sections at 17px, and related policies.
 * Server component; shared by both legal routes.
 */

export type LegalSection = { id: string; title: string; content: ReactNode };

export const legalText = 'text-[17px] leading-8 text-ink-soft';

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 rounded-2xl bg-canvas-soft px-5 py-4 text-[16px] font-semibold leading-7 text-petrol-800">
          <span className="mt-[11px] inline-block size-2 shrink-0 rounded-full bg-lime-deep" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalDocument({
  sections,
  version,
  related,
}: {
  sections: LegalSection[];
  /** The version string the policy already states. */
  version: string;
  related: { href: string; label: string }[];
}) {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
          <div className={kit.cardSage}>
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Contents</p>
            <ol className="mt-4 grid gap-1">
              {sections.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-[44px] items-center rounded-xl px-2 py-2 text-[15px] font-semibold leading-6 text-petrol-800 hover:bg-white"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-petrol-800/10 pt-4 text-[14px] text-ink-soft">Policy version {version}</p>
          </div>
        </nav>

        <div className="min-w-0 max-w-[72ch]">
          {sections.map(section => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-28 border-t border-canvas-soft py-10 first:border-t-0 first:pt-0"
            >
              <h2 id={`${section.id}-title`} className="font-display text-[28px] font-black leading-[1.08] tracking-[-0.01em] text-petrol-800 sm:text-[32px]">
                {section.title}
              </h2>
              <div className={`mt-5 space-y-5 ${legalText}`}>{section.content}</div>
            </section>
          ))}

          <aside aria-label="Related policies" className={`mt-4 ${kit.cardLime}`}>
            <p className="text-[17px] font-semibold text-petrol-800">Related policies</p>
            <ul className="mt-3 grid gap-1 sm:grid-cols-2">
              {related.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={`${kit.link} min-h-[44px]`}>
                    {item.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Section>
  );
}

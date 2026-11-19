'use client';

import type { ReactNode } from 'react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';

type PartnershipContactLinkProps = {
  href: string;
  kind: 'whatsapp' | 'phone';
  label: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export default function PartnershipContactLink({
  href,
  kind,
  label,
  className,
  ariaLabel,
  children,
}: PartnershipContactLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={kind === 'whatsapp' ? '_blank' : undefined}
      rel={kind === 'whatsapp' ? 'noopener noreferrer' : undefined}
      data-tracking-type={kind}
      onClick={() => {
        const ctx = {
          destination: 'china',
          label: `partnership_${label}`,
        };
        if (kind === 'whatsapp') trackWhatsAppClick(ctx);
        else trackPhoneClick(ctx);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

'use client';

import type { ReactNode } from 'react';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';

export default function March2027ContactLink({ href, kind, className, children }: { href: string; kind: 'phone' | 'whatsapp'; className?: string; children: ReactNode }) {
  return <a href={href} className={className} target={kind === 'whatsapp' ? '_blank' : undefined} rel={kind === 'whatsapp' ? 'noopener noreferrer' : undefined} onClick={() => {
    const context = { destination: 'china', label: `march_2027_${kind}`, page_location: window.location.origin + window.location.pathname };
    if (kind === 'whatsapp') trackWhatsAppClick(context); else trackPhoneClick(context);
  }}>{children}</a>;
}

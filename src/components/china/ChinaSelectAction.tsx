'use client';

import type { ReactNode } from 'react';
import { trackConversion } from '@/lib/conversion-events';

export const CHINA_SELECT_EVENT = 'eduexpress:china-select';

export type ChinaSelectDetail = {
  route?: string;
  intake?: string;
  university?: string;
  program?: string;
  scroll?: boolean;
};

export function dispatchChinaSelect(detail: ChinaSelectDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ChinaSelectDetail>(CHINA_SELECT_EVENT, { detail }));
  if (detail.scroll !== false) {
    requestAnimationFrame(() => {
      const form = document.getElementById('china-fit-form');
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstControl = form?.querySelector('select, input') as HTMLElement | null;
      firstControl?.focus({ preventScroll: true });
    });
  }
}

export default function ChinaSelectAction({
  route,
  intake,
  university,
  program,
  label,
  className = '',
  children,
}: {
  route?: string;
  intake?: string;
  university?: string;
  program?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = () => {
    trackConversion('assessment_start', {
      destination: 'china',
      label: label || university || route || 'china_select_action',
    });
    dispatchChinaSelect({ route, intake, university, program, scroll: true });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

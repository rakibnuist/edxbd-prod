'use client';

import { useEffect, useRef } from 'react';
import {
  trackSuccessStoryView,
  trackUniversityView,
  type ConversionContext,
} from '@/lib/conversion-events';

type Props = {
  event: 'university_view' | 'success_story_view';
  context?: ConversionContext;
};

/** Fires a single consent-gated GA4/Meta view conversion once per page load. */
export default function PageConversionBeacon({ event, context }: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    if (event === 'university_view') {
      trackUniversityView(context);
      return;
    }
    trackSuccessStoryView(context);
  }, [event, context]);

  return null;
}

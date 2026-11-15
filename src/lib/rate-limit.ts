import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  clearInMemoryRateLimits,
  getClientFingerprint,
  rateLimitHeaders,
} from './rate-limit-core';
import type {
  RateLimitOptions,
  RateLimitPolicy,
  RateLimitResult,
} from './rate-limit-core';

export {
  checkRateLimit,
  clearInMemoryRateLimits,
  getClientFingerprint,
  rateLimitHeaders,
};
export type { RateLimitOptions, RateLimitPolicy, RateLimitResult };

export function rateLimitExceeded(result: RateLimitResult) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: rateLimitHeaders(result),
    },
  );
}

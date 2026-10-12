import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RateLimitPolicy {
  name: string;
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

const MAX_BUCKETS = 10_000;

const globalRateLimit = globalThis as typeof globalThis & {
  __eduexpressRateLimitBuckets?: Map<string, RateLimitBucket>;
  __eduexpressRateLimitOperations?: number;
};

const buckets = globalRateLimit.__eduexpressRateLimitBuckets ?? new Map<string, RateLimitBucket>();
globalRateLimit.__eduexpressRateLimitBuckets = buckets;

function getClientFingerprint(request: Request): string {
  // Traefik sets x-real-ip for the connecting client. Fall back to the first
  // x-forwarded-for entry for local and alternate reverse-proxy deployments.
  const address = request.headers.get('x-real-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown-client';

  return createHash('sha256').update(address).digest('hex');
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  // Keep memory bounded even if a large number of unique addresses arrive
  // inside one rate-limit window.
  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      removed += 1;
      if (removed >= excess) break;
    }
  }
}

export function checkRateLimit(request: Request, policy: RateLimitPolicy): RateLimitResult {
  const now = Date.now();
  const operations = (globalRateLimit.__eduexpressRateLimitOperations ?? 0) + 1;
  globalRateLimit.__eduexpressRateLimitOperations = operations;

  if (operations % 250 === 0 || buckets.size > MAX_BUCKETS) {
    pruneExpiredBuckets(now);
  }

  const key = `${policy.name}:${getClientFingerprint(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + policy.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit: policy.maxRequests,
      remaining: Math.max(0, policy.maxRequests - 1),
      resetAt,
      retryAfterSeconds: Math.ceil(policy.windowMs / 1000),
    };
  }

  if (current.count >= policy.maxRequests) {
    return {
      allowed: false,
      limit: policy.maxRequests,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    limit: policy.maxRequests,
    remaining: Math.max(0, policy.maxRequests - current.count),
    resetAt: current.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function rateLimitExceeded(result: RateLimitResult) {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Cache-Control': 'no-store',
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
      },
    },
  );
}

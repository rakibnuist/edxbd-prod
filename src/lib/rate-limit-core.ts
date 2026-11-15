import { createHash } from 'crypto';
import { extractClientIp } from './client-ip';
import prisma from './prisma';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitPolicy {
  name: string;
  maxRequests: number;
  windowMs: number;
  persistent?: boolean;
  protectActiveBuckets?: boolean;
}

export interface RateLimitOptions {
  now?: number;
  maxBucketsPerPolicy?: number;
  trustCfConnectingIp?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

const DEFAULT_MAX_BUCKETS_PER_POLICY = 10_000;

const globalRateLimit = globalThis as typeof globalThis & {
  __eduexpressRateLimitPolicyBuckets?: Map<string, Map<string, RateLimitBucket>>;
  __eduexpressRateLimitOperations?: number;
};

const policyBucketsMap =
  globalRateLimit.__eduexpressRateLimitPolicyBuckets ??
  new Map<string, Map<string, RateLimitBucket>>();
globalRateLimit.__eduexpressRateLimitPolicyBuckets = policyBucketsMap;

function getPolicyBuckets(policyName: string): Map<string, RateLimitBucket> {
  let buckets = policyBucketsMap.get(policyName);
  if (!buckets) {
    buckets = new Map<string, RateLimitBucket>();
    policyBucketsMap.set(policyName, buckets);
  }
  return buckets;
}

export function clearInMemoryRateLimits(policyName?: string): void {
  if (policyName) {
    policyBucketsMap.delete(policyName);
    return;
  }
  policyBucketsMap.clear();
}

export function getClientFingerprint(
  request: Request,
  options?: Pick<RateLimitOptions, 'trustCfConnectingIp'>,
): string {
  const address =
    extractClientIp((name) => request.headers.get(name), {
      trustCfConnectingIp: options?.trustCfConnectingIp,
    }) ?? 'unknown-client';

  return createHash('sha256').update(address).digest('hex');
}

function prunePolicyBuckets(
  buckets: Map<string, RateLimitBucket>,
  now: number,
  policy: RateLimitPolicy,
  maxBuckets: number,
): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  if (buckets.size <= maxBuckets) return;

  let excess = buckets.size - maxBuckets;
  for (const [key, bucket] of buckets) {
    if (excess <= 0) break;
    // Never let traffic floods evict active locked/exhausted buckets.
    if (bucket.resetAt > now && bucket.count >= policy.maxRequests) continue;

    buckets.delete(key);
    excess -= 1;
  }
}

function toRateLimitResult(
  count: number,
  resetAt: number,
  policy: RateLimitPolicy,
  now: number,
): RateLimitResult {
  const allowed = count <= policy.maxRequests;
  return {
    allowed,
    limit: policy.maxRequests,
    remaining: allowed ? Math.max(0, policy.maxRequests - count) : 0,
    resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

function consumeInMemoryBucket(
  key: string,
  policy: RateLimitPolicy,
  now: number,
  maxBuckets: number,
): RateLimitBucket {
  const buckets = getPolicyBuckets(policy.name);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const fresh: RateLimitBucket = { count: 1, resetAt: now + policy.windowMs };
    buckets.set(key, fresh);
    if (buckets.size > maxBuckets) {
      prunePolicyBuckets(buckets, now, policy, maxBuckets);
    }
    return fresh;
  }

  if (current.count <= policy.maxRequests) {
    current.count += 1;
  }

  buckets.delete(key);
  buckets.set(key, current);
  return current;
}

async function consumePersistentBucket(
  key: string,
  policy: RateLimitPolicy,
  now: number,
): Promise<RateLimitBucket> {
  const newResetAtMs = BigInt(now + policy.windowMs);
  const nowMs = BigInt(now);

  const rows = await prisma.$queryRaw<Array<{ count: number | bigint; resetAtMs: number | bigint }>>`
    INSERT INTO "RateLimitBucket" ("key", "policy", "count", "resetAtMs")
    VALUES (${key}, ${policy.name}, 1, ${newResetAtMs})
    ON CONFLICT("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAtMs" <= ${nowMs} THEN 1
        WHEN "RateLimitBucket"."count" <= ${policy.maxRequests} THEN "RateLimitBucket"."count" + 1
        ELSE "RateLimitBucket"."count"
      END,
      "resetAtMs" = CASE
        WHEN "RateLimitBucket"."resetAtMs" <= ${nowMs} THEN ${newResetAtMs}
        ELSE "RateLimitBucket"."resetAtMs"
      END
    RETURNING "count", "resetAtMs"
  `;

  const row = rows[0];
  if (!row) {
    throw new Error('Persistent rate-limit upsert returned no row');
  }

  return {
    count: Number(row.count),
    resetAt: Number(row.resetAtMs),
  };
}

export async function checkRateLimit(
  request: Request,
  policy: RateLimitPolicy,
  options?: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = options?.now ?? Date.now();
  const maxBuckets = options?.maxBucketsPerPolicy ?? DEFAULT_MAX_BUCKETS_PER_POLICY;
  const operations = (globalRateLimit.__eduexpressRateLimitOperations ?? 0) + 1;
  globalRateLimit.__eduexpressRateLimitOperations = operations;

  const key = `${policy.name}:${getClientFingerprint(request, options)}`;
  const shouldPersist = policy.persistent ?? policy.name === 'admin-login';

  if (shouldPersist) {
    try {
      if (operations % 100 === 0) {
        await prisma.$executeRaw`DELETE FROM "RateLimitBucket" WHERE "resetAtMs" <= ${BigInt(now)}`.catch(() => 0);
      }
      const bucket = await consumePersistentBucket(key, policy, now);
      return toRateLimitResult(bucket.count, bucket.resetAt, policy, now);
    } catch (error) {
      console.warn('Persistent rate-limit store unavailable; falling back to isolated in-memory buckets.', error);
    }
  }

  if (operations % 250 === 0) {
    const buckets = getPolicyBuckets(policy.name);
    if (buckets.size > 0) prunePolicyBuckets(buckets, now, policy, maxBuckets);
  }

  const bucket = consumeInMemoryBucket(key, policy, now, maxBuckets);
  return toRateLimitResult(bucket.count, bucket.resetAt, policy, now);
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'Cache-Control': 'no-store',
    'Retry-After': String(result.retryAfterSeconds),
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': '0',
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}

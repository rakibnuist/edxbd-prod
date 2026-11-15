import { timingSafeEqual } from 'node:crypto';

export const MIN_REVALIDATE_SECRET_LENGTH = 32;

/**
 * Authorize cache revalidation requests against a dedicated 32+ char REVALIDATE_SECRET.
 * Never falls back to JWT_SECRET and rejects matching JWT_SECRET so key reuse is impossible.
 */
export function isAuthorizedRevalidateSecret(
  provided: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const expected = (env.REVALIDATE_SECRET || '').trim();
  const jwtSecret = (env.JWT_SECRET || '').trim();
  const candidate = (provided || '').trim();

  if (expected.length < MIN_REVALIDATE_SECRET_LENGTH || !candidate) {
    return false;
  }
  if (jwtSecret && expected === jwtSecret) {
    return false;
  }

  const given = Buffer.from(candidate);
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

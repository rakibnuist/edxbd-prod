import type { Prisma } from '@prisma/client';

/**
 * The single rule for showing a student story in public (pages, sitemaps,
 * API): it is published and has not been taken down. A revoked date or a
 * passed expiry date, when an admin sets one, hides the story everywhere.
 * The admin publish gate (api/admin/testimonials) requires a photo, a name
 * and the story text.
 */
export function publicTestimonialWhere(now: Date = new Date()): Prisma.TestimonialWhereInput {
  return {
    isPublished: true,
    consentRevokedAt: null,
    OR: [{ consentExpiresAt: null }, { consentExpiresAt: { gte: now } }],
  };
}

/** Combine the public rule with a caller's own filter without clobbering either. */
export function withPublicTestimonials(where: Prisma.TestimonialWhereInput = {}): Prisma.TestimonialWhereInput {
  return { AND: [where, publicTestimonialWhere()] };
}

import type { Prisma } from '@prisma/client';

/**
 * The single rule for showing a student story in public (pages, sitemaps,
 * API). It mirrors the admin publish gate in api/admin/testimonials: a story
 * appears only while it is published AND its written consent is verified,
 * evidenced, dated, not revoked and not expired. `isPublished` defaults to
 * true in the schema, so checking it alone would let a story stay visible
 * after consent lapses or is withdrawn.
 */
export function publicTestimonialWhere(now: Date = new Date()): Prisma.TestimonialWhereInput {
  return {
    isPublished: true,
    consentVerified: true,
    consentEvidenceId: { not: null },
    consentRecordedAt: { not: null },
    consentRevokedAt: null,
    OR: [{ consentExpiresAt: null }, { consentExpiresAt: { gte: now } }],
  };
}

/** Combine the public rule with a caller's own filter without clobbering either. */
export function withPublicTestimonials(where: Prisma.TestimonialWhereInput = {}): Prisma.TestimonialWhereInput {
  return { AND: [where, publicTestimonialWhere()] };
}

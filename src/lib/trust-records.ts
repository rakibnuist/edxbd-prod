import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';

const parseList = (value: string) => {
  try { return JSON.parse(value) as string[]; } catch { return []; }
};

export const getPublicTrustRecords = cache(async () => {
  const [metrics, evidence, offices, team, servicePackages, testimonials] = await Promise.all([
    prisma.trustMetric.findMany({ where: { isPublished: true }, orderBy: [{ displayOrder: 'asc' }, { updatedAt: 'desc' }] }),
    prisma.evidenceAsset.findMany({
      where: { isPublished: true, privacyStatus: 'redacted' },
      orderBy: [{ displayOrder: 'asc' }, { issuedAt: 'desc' }],
      select: {
        id: true,
        type: true,
        title: true,
        summary: true,
        organization: true,
        country: true,
        thumbnailUrl: true,
        issuedAt: true,
        validUntil: true,
        university: { select: { name: true, slug: true } },
      },
    }),
    prisma.office.findMany({ where: { isPublished: true }, orderBy: [{ isHeadOffice: 'desc' }, { name: 'asc' }] }),
    prisma.teamMember.findMany({ where: { isPublished: true, consentConfirmedAt: { not: null } }, orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] }),
    prisma.servicePackage.findMany({ where: { isPublished: true }, orderBy: [{ displayOrder: 'asc' }, { title: 'asc' }] }),
    prisma.testimonial.findMany({
      where: {
        isPublished: true,
        content: { not: '' },
        image: { not: null },
        consentVerified: true,
        consentImageApproved: true,
        consentEvidenceId: { not: null },
        consentRecordedAt: { not: null },
        consentRevokedAt: null,
        OR: [{ consentExpiresAt: null }, { consentExpiresAt: { gte: new Date() } }],
      },
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
      take: 6,
      select: { id: true, studentName: true, displayName: true, content: true, university: true, country: true, image: true, rating: true },
    }),
  ]);

  return {
    metrics,
    evidence,
    offices,
    team: team.map(member => ({ ...member, specialties: parseList(member.specialties) })),
    servicePackages: servicePackages.map(item => ({
      ...item,
      includedItems: parseList(item.includedItems),
      excludedItems: parseList(item.excludedItems),
      securityOptions: parseList(item.securityOptions),
    })),
    testimonials: testimonials.filter(testimonial => Boolean(testimonial.image?.trim())),
  };
});

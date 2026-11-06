import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import { withPublicTestimonials } from '@/lib/testimonial-visibility';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';

const parseList = (value: string) => {
  try { return JSON.parse(value) as string[]; } catch { return []; }
};

type TrustQueries = Awaited<ReturnType<typeof queryTrustRecords>>;

const queryTrustRecords = () =>
  Promise.all([
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
      where: withPublicTestimonials({ content: { not: '' } }),
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
      take: 16,
      select: { id: true, studentName: true, displayName: true, content: true, university: true, program: true, location: true, country: true, image: true, rating: true },
    }),
    prisma.testimonial.count({ where: withPublicTestimonials({ content: { not: '' } }) }),
  ]);

/**
 * Public trust records for every page (the root layout reads the office).
 * The production image is built without a database, so a failed read must
 * not fail the build: it falls back to the canonical office record and empty
 * lists, and the server re-renders pages with real data once it is running.
 */
export const getPublicTrustRecords = cache(async () => {
  let rows: TrustQueries;
  try {
    rows = await queryTrustRecords();
  } catch (error) {
    console.warn('Trust records unavailable; using the default office record.', error instanceof Error ? error.message.split('\n').filter(Boolean).pop() : error);
    rows = [[], [], [], [], [], [], 0];
  }
  const [metrics, evidence, offices, team, servicePackages, testimonials, storyCount] = rows;

  const publicOffices = offices.length > 0 ? offices : [{
    id: 'default-dhanmondi-office',
    ...DEFAULT_OFFICE_RECORD,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }];

  return {
    metrics,
    evidence,
    offices: publicOffices,
    team: team.map(member => ({ ...member, specialties: parseList(member.specialties) })),
    servicePackages: servicePackages.map(item => ({
      ...item,
      includedItems: parseList(item.includedItems),
      excludedItems: parseList(item.excludedItems),
      securityOptions: parseList(item.securityOptions),
    })),
    testimonials,
    storyCount,
  };
});

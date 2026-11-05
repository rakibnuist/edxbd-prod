import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import researchedLanding from '../../data/research/china-march-2027-landing.json';
import {
  chinaMarch2027Routes,
  march2027Faqs,
  march2027RequiredDocuments,
  type March2027RouteGroup,
} from '@/data/chinaMarch2027Campaign';

export type ChinaMarch2027Campaign = {
  routes: March2027RouteGroup[];
  requiredDocuments: string[];
  faqs: { question: string; answer: string }[];
  sourceLabel: string;
  verificationStatus: string;
  lastReviewedAt: Date;
  nextReviewAt: Date | null;
  fromDatabase: boolean;
};

const fallbackCampaign: ChinaMarch2027Campaign = {
  routes: chinaMarch2027Routes,
  requiredDocuments: march2027RequiredDocuments,
  faqs: march2027Faqs,
  sourceLabel: 'Owner-supplied “2027 Projects” planning sheet',
  verificationStatus: 'preliminary',
  lastReviewedAt: new Date('2026-10-11T00:00:00+06:00'),
  nextReviewAt: new Date('2026-11-15T00:00:00+06:00'),
  fromDatabase: false,
};

function isCampaignContent(value: unknown): value is Pick<ChinaMarch2027Campaign, 'routes' | 'requiredDocuments' | 'faqs'> {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return Array.isArray(candidate.routes)
    && Array.isArray(candidate.requiredDocuments)
    && Array.isArray(candidate.faqs);
}

export const getChinaMarch2027Campaign = cache(async (): Promise<ChinaMarch2027Campaign> => {
  try {
    const record = await prisma.intakeCampaign.findUnique({
      where: { slug: 'china-march-2027-intake' },
    });

    if (!record?.isPublished) return fallbackCampaign;
    const parsed: unknown = JSON.parse(record.contentJson);
    if (!isCampaignContent(parsed)) return fallbackCampaign;

    return {
      routes: parsed.routes,
      requiredDocuments: parsed.requiredDocuments,
      faqs: parsed.faqs,
      sourceLabel: record.sourceLabel,
      verificationStatus: record.verificationStatus,
      lastReviewedAt: record.lastReviewedAt ?? fallbackCampaign.lastReviewedAt,
      nextReviewAt: record.nextReviewAt,
      fromDatabase: true,
    };
  } catch {
    return fallbackCampaign;
  }
});

export type MarchCampaignExample = typeof researchedLanding.examples[number];
export type MarchCampaignUniversity = typeof researchedLanding.universities[number];
export const getChinaMarch2027Landing = cache(async () => {
  try {
    const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-march-2027-intake' } });
    if (record?.isPublished) {
      const content = JSON.parse(record.contentJson).researchedLanding as typeof researchedLanding | undefined;
      if (content?.version === 1 && Array.isArray(content.examples) && content.examples.length > 0
        && content.examples.every(item => typeof item.id === 'string' && typeof item.university === 'string' && typeof item.tuition === 'string')
        && Array.isArray(content.faqs) && Array.isArray(content.universities) && content.universities.length > 0) return content;
    }
  } catch { /* Keep the researched fallback available if the CMS is temporarily unavailable. */ }
  return researchedLanding;
});

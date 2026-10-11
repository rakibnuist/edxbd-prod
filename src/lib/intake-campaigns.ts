import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
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

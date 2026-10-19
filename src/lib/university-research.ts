import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';

export type UniversityResearch = {
  slug: string; name: string; city: string; province: string; officialUrl: string;
  cycle: string; overview: string; facts: [string, string][]; fees: [string, string][];
  sources: { label: string; url: string }[]; checks: string[];
  checkedAt: string; nextReviewAt: string;
};

const validPairs = (value: unknown): value is [string, string][] => Array.isArray(value) && value.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(item => typeof item === 'string'));
const validResearch = (value: unknown): value is UniversityResearch => {
  if (!value || typeof value !== 'object') return false;
  const item = value as UniversityResearch;
  return ['slug', 'name', 'city', 'province', 'officialUrl', 'cycle', 'overview', 'checkedAt', 'nextReviewAt'].every(key => typeof item[key as keyof UniversityResearch] === 'string')
    && validPairs(item.facts) && validPairs(item.fees)
    && Array.isArray(item.checks) && item.checks.every(check => typeof check === 'string')
    && Array.isArray(item.sources) && item.sources.every(source => typeof source.label === 'string' && /^https:\/\//.test(source.url));
};

export const getUniversityResearch = cache(async (): Promise<UniversityResearch[]> => {
  try {
    const campaign = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-university-research' } });
    if (!campaign?.isPublished) return [];
    const parsed: unknown = JSON.parse(campaign.contentJson);
    if (!parsed || typeof parsed !== 'object' || !('universities' in parsed) || !Array.isArray(parsed.universities)) return [];
    return parsed.universities.filter(validResearch);
  } catch (error) {
    console.warn('University research unavailable:', error instanceof Error ? error.name : 'Unknown error');
    return [];
  }
});

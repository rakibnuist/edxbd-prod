import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';

export type UniversityRanking = {
  publisher: string;
  rankingName: string;
  year: number;
  rank: string;
  scope: 'world' | 'subject' | 'national';
  subject?: string;
  sourceUrl: string;
  note?: string;
};

const publisherHosts: Record<string, string> = {
  'Times Higher Education': 'www.timeshighereducation.com',
  'ShanghaiRanking': 'www.shanghairanking.com',
  'QS': 'www.topuniversities.com',
};

function isRanking(value: unknown): value is UniversityRanking {
  if (!value || typeof value !== 'object') return false;
  const item = value as UniversityRanking;
  if (!['publisher', 'rankingName', 'rank', 'sourceUrl'].every(key => typeof item[key as keyof UniversityRanking] === 'string')) return false;
  if (!['world', 'subject', 'national'].includes(item.scope) || !Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) return false;
  if (!/^=?\d+(?:[–-]\d+|\+)?$/.test(item.rank)) return false;
  if (item.subject !== undefined && typeof item.subject !== 'string') return false;
  if (item.note !== undefined && typeof item.note !== 'string') return false;
  if (item.scope === 'subject' && !item.subject?.trim()) return false;
  try {
    const source = new URL(item.sourceUrl);
    return source.protocol === 'https:' && source.hostname === publisherHosts[item.publisher];
  } catch {
    return false;
  }
}

const getRankingProfiles = cache(async (): Promise<{ slug: string; rankings: UniversityRanking[] }[]> => {
  try {
    const campaign = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-rankings' } });
    if (!campaign?.isPublished) return [];
    const payload: unknown = JSON.parse(campaign.contentJson);
    if (!payload || typeof payload !== 'object' || !('universities' in payload) || !Array.isArray(payload.universities)) return [];
    return payload.universities.flatMap(profile => {
      if (!profile || typeof profile !== 'object' || typeof profile.slug !== 'string' || !Array.isArray(profile.rankings)) return [];
      return [{ slug: profile.slug, rankings: profile.rankings.filter(isRanking).map((ranking: UniversityRanking) => ({
        publisher: ranking.publisher, rankingName: ranking.rankingName, year: ranking.year,
        rank: ranking.rank, scope: ranking.scope, sourceUrl: ranking.sourceUrl,
        ...(ranking.subject ? { subject: ranking.subject } : {}), ...(ranking.note ? { note: ranking.note } : {}),
      })) }];
    });
  } catch (error) {
    console.warn('University rankings unavailable:', error instanceof Error ? error.name : 'Unknown error');
    return [];
  }
});

export const getUniversityRankings = cache(async (slug: string): Promise<UniversityRanking[]> => {
  const profiles = await getRankingProfiles();
  return profiles.find(profile => profile.slug === slug)?.rankings ?? [];
});

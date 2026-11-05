import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import fallback from '@/data/chinaMbbsGuide.json';

export type ChinaMbbsGuide = typeof fallback;
export const getChinaMbbsGuide = cache(async (): Promise<ChinaMbbsGuide> => {
  try {
    const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-study-research' } });
    const guide = record?.isPublished ? JSON.parse(record.contentJson).mbbs : null;
    if (guide?.version === 1 && typeof guide.metaTitle === 'string' && typeof guide.description === 'string'
      && Array.isArray(guide.universities) && guide.universities.length
      && guide.universities.every((item: ChinaMbbsGuide['universities'][number]) => typeof item.name === 'string' && Number.isFinite(item.tuition) && item.tuition > 0 && typeof item.admission === 'string')
      && Array.isArray(guide.faqs) && guide.faqs.length) return guide as ChinaMbbsGuide;
  } catch { /* Keep the researched guide available if the CMS cannot be reached. */ }
  return fallback;
});

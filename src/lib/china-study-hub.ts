import 'server-only';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import fallback from '@/data/chinaStudyHub.json';

export type ChinaStudyHub = typeof fallback;

export const getChinaStudyHub = cache(async (): Promise<ChinaStudyHub> => {
  try {
    const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-study-research' } });
    const content = record?.isPublished ? JSON.parse(record.contentJson).hub : null;
    // Require the complete content shape; partial CMS edits retain the researched fallback.
    if (content?.version === 1 && typeof content.intro === 'string' && typeof content.metaTitle === 'string'
      && ['quality', 'rankings', 'fundingRoutes', 'stipends', 'qualifications', 'documents', 'costExamples', 'life', 'steps', 'guides', 'faqs'].every(key => Array.isArray(content[key]) && content[key].length)
      && Array.isArray(content.mbbs?.points) && typeof content.photos?.hero?.src === 'string' && typeof content.photos?.life?.src === 'string' && typeof content.photos?.support?.src === 'string') return content as ChinaStudyHub;
  } catch { /* The versioned evergreen hub remains available without a CMS connection. */ }
  return fallback;
});

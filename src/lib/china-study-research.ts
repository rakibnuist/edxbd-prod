import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';

type ResearchCard = { title: string; body: string; sourceIds: string[] };
export type ChinaStudyResearch = {
  version: number;
  checkedAt: string;
  nextReviewAt: string;
  editorialNote: string;
  intro: string;
  eligibility: (ResearchCard & { action: string })[];
  language: ResearchCard[];
  scholarships: { name: string; coverage: string; conditions: string; sourceIds: string[] }[];
  examples: {
    slug: string; name: string; cycle: string;
    facts: { label: string; value: string }[];
    takeaway: string; sourceIds: string[];
  }[];
  costChecklist: { item: string; include: string; evidence: string }[];
  preparation: { stage: string; task: string; deliverable: string }[];
  visa: { body: string; checklist: string[]; sourceIds: string[] };
  life: ResearchCard[];
  risks: ResearchCard[];
  faqs: { question: string; answer: string; sourceIds: string[] }[];
  sources: { id: string; title: string; publisher: string; scope: string; url: string; checkedAt: string }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function hasStrings<K extends string>(value: unknown, keys: K[]): value is Record<K, string> & Record<string, unknown> {
  return isRecord(value) && keys.every(key => typeof value[key] === 'string');
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function hasSources(value: unknown): boolean {
  return isRecord(value) && isStringList(value.sourceIds);
}

function isCard(value: unknown): boolean {
  return hasStrings(value, ['title', 'body']) && hasSources(value);
}

function isList(value: unknown, validate: (item: unknown) => boolean): boolean {
  return Array.isArray(value) && value.every(validate);
}

function isResearch(value: unknown): value is ChinaStudyResearch {
  if (!isRecord(value) || value.version !== 1) return false;
  if (!hasStrings(value, ['checkedAt', 'nextReviewAt', 'editorialNote', 'intro'])) return false;
  if (![value.checkedAt, value.nextReviewAt].every(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)))) return false;
  if (!isList(value.eligibility, item => isCard(item) && hasStrings(item, ['action']))) return false;
  if (!isList(value.language, isCard) || !isList(value.life, isCard) || !isList(value.risks, isCard)) return false;
  if (!isList(value.scholarships, item => hasStrings(item, ['name', 'coverage', 'conditions']) && hasSources(item))) return false;
  if (!isList(value.costChecklist, item => hasStrings(item, ['item', 'include', 'evidence']))) return false;
  if (!isList(value.preparation, item => hasStrings(item, ['stage', 'task', 'deliverable']))) return false;
  if (!isList(value.faqs, item => hasStrings(item, ['question', 'answer']) && hasSources(item))) return false;
  if (!hasStrings(value.visa, ['body']) || !hasSources(value.visa) || !isStringList(value.visa.checklist)) return false;
  if (!isList(value.examples, item => hasStrings(item, ['slug', 'name', 'cycle', 'takeaway'])
    && hasSources(item) && isList(item.facts, fact => hasStrings(fact, ['label', 'value'])))) return false;
  if (!isList(value.sources, source => hasStrings(source, ['id', 'title', 'publisher', 'scope', 'url', 'checkedAt'])
    && /^https?:\/\//.test(source.url) && Number.isFinite(Date.parse(source.checkedAt)))) return false;
  return true;
}

// Import seeds never replace an unpublished or missing CMS campaign.
export const getChinaStudyResearch = cache(async (): Promise<ChinaStudyResearch | null> => {
  try {
    const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'china-study-research' } });
    if (!record?.isPublished) return null;
    const parsed: unknown = JSON.parse(record.contentJson);
    return isResearch(parsed) ? parsed : null;
  } catch {
    return null;
  }
});

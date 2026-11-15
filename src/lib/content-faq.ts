import { htmlToText } from './content-html';

export type ContentFaqItem = {
  question: string;
  answer: string;
};

const DETAILS_BLOCK_RE = /<details\b[^>]*>([\s\S]*?)<\/details>/gi;
const SUMMARY_TAG_RE = /<summary\b[^>]*>([\s\S]*?)<\/summary>/i;
const FAQ_SECTION_HEADING_RE = /<h2\b[^>]*>[\s\S]*?(?:frequently\s+asked\s+questions|faq)[\s\S]*?<\/h2>/i;
const H2_OPEN_RE = /<h2\b[^>]*>/i;
const H3_PAIR_RE = /<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3\b|$)/gi;

function addFaqItem(
  items: ContentFaqItem[],
  seen: Set<string>,
  rawQuestion: string,
  rawAnswer: string,
  limit: number,
): void {
  if (items.length >= limit) return;
  const question = htmlToText(rawQuestion, 300).trim();
  const answer = htmlToText(rawAnswer, 1200).trim();
  if (question.length < 8 || answer.length < 12) return;
  const key = question.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  items.push({ question, answer });
}

/**
 * Extracts visible FAQ question/answer pairs from sanitized update HTML
 * (`<details><summary>` accordions first, falling back to `<h3>` pairs
 * inside a "Frequently asked questions" section) for FAQPage JSON-LD.
 */
export function extractFaqsFromHtml(
  html: string | null | undefined,
  limit = 10,
): ContentFaqItem[] {
  if (!html || limit <= 0) return [];

  const source = String(html);
  const items: ContentFaqItem[] = [];
  const seen = new Set<string>();

  DETAILS_BLOCK_RE.lastIndex = 0;
  for (const match of source.matchAll(DETAILS_BLOCK_RE)) {
    const inner = match[1] ?? '';
    const summaryMatch = SUMMARY_TAG_RE.exec(inner);
    if (!summaryMatch) continue;
    const answerHtml = inner.replace(summaryMatch[0], '');
    addFaqItem(items, seen, summaryMatch[1] ?? '', answerHtml, limit);
    if (items.length >= limit) return items;
  }

  if (items.length > 0) return items;

  const headingMatch = FAQ_SECTION_HEADING_RE.exec(source);
  if (!headingMatch) return items;

  const afterHeading = source.slice(headingMatch.index + headingMatch[0].length);
  const nextH2 = H2_OPEN_RE.exec(afterHeading);
  const faqSectionHtml = nextH2 ? afterHeading.slice(0, nextH2.index) : afterHeading;

  H3_PAIR_RE.lastIndex = 0;
  for (const match of faqSectionHtml.matchAll(H3_PAIR_RE)) {
    addFaqItem(items, seen, match[1] ?? '', match[2] ?? '', limit);
    if (items.length >= limit) break;
  }

  return items;
}

export const CSC_DIRECTORY_SLUG = 'complete-csc-universities-list-2027';

export interface CscDirectoryUniversityInput {
  name: string;
  slug: string;
  aliases?: string[];
  city?: string;
  details?: { tuition?: string };
  scholarships?: { title: string; type?: string; amount?: string; status?: string }[];
  verificationStatus?: string;
}

export interface CscDirectoryUpdateInput {
  title: string;
  slug: string;
  archived?: boolean;
  publishedAt?: string | null;
}

export interface CscFeaturedUniversityRow {
  name: string;
  slug: string;
  city: string;
  tuitionSummary: string;
  scholarshipSummary: string;
  guideSlug?: string;
  guideTitle?: string;
}

export interface CscDirectoryGuideLink {
  title: string;
  slug: string;
}

export interface CscDirectoryFaq {
  question: string;
  answer: string;
}

export interface CscDirectoryEnrichment {
  matchedListCount: number;
  featuredUniversities: CscFeaturedUniversityRow[];
  cscGuides: CscDirectoryGuideLink[];
  faqs: CscDirectoryFaq[];
}

const SAFE_SLUG_RE = /^[a-z0-9-]+$/;

const CSC_DIRECTORY_FAQS: CscDirectoryFaq[] = [
  {
    question:
      'Where can I verify the official 2027 CSC designated university list, 5-digit Agency Number, and updated admissions email?',
    answer:
      'Official designated university participation (306 Chinese universities), 5-digit Type B Agency Numbers, degree catalogs, and current international admissions emails are published on the China Scholarship Council portal (campuschina.org) and each university international office notice. EduExpress links verified university profiles and 2027 CSC guides on this page so Bangladeshi applicants can cross-check live entry details without relying on outdated email spreadsheets.',
  },
  {
    question:
      'What is the difference between CSC Type A and CSC Type B scholarships for Bangladeshi applicants?',
    answer:
      'CSC Type A covers bilateral and embassy-nominated routes through government channels such as the Ministry of Education Bangladesh and the Chinese Embassy in Dhaka. CSC Type B covers direct university-nominated Master’s and PhD tracks applied straight to a designated Chinese university admissions system along with the CSC portal using that university’s 5-digit Agency Number.',
  },
  {
    question:
      'Which Chinese universities offer MSc Artificial Intelligence, Computer Science, Engineering, and MBBS under the 2027 intake?',
    answer:
      'Leading CSC-designated Chinese universities offering English-taught MSc/PhD programs in Artificial Intelligence, Computer Science, and Engineering include Nanjing University (NJU), Nanchang University, Peking University, Zhejiang University, Shanghai Jiao Tong University, Harbin Institute of Technology, Beihang University, and NUIST. Each linked university profile on EduExpress lists 2027 entry requirements, annual tuition in CNY, language proof rules (IELTS, TOEFL, or English MOI), and scholarship options.',
  },
  {
    question:
      'How do students verify tuition waivers, English-taught majors, and CSCA or IELTS requirements across CSC universities?',
    answer:
      'Scholarship quotas, English-taught degree availability (such as Engineering, AI and Computer Science, MBBS, and Business), accommodation rules, and entrance or CSCA/IELTS screening vary by university and annual call. Review the linked EduExpress university profile and current 2027 CSC Type B notice before submitting or paying any official application fee.',
  },
];

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&rsquo;|&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"');
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

function normalizeNameKey(raw: string): string {
  return decodeHtmlEntities(stripTags(raw))
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripParentheticalKey(raw: string): string {
  return normalizeNameKey(raw.replace(/\([^)]*\)/g, ' '));
}

interface LookupMaps {
  exact: Map<string, string>;
  uniqueBase: Map<string, string>;
}

function buildUniversityLookup(universities: readonly CscDirectoryUniversityInput[]): LookupMaps {
  const exact = new Map<string, string>();
  const baseCandidates = new Map<string, Set<string>>();

  for (const uni of universities) {
    if (!SAFE_SLUG_RE.test(uni.slug)) continue;

    const names = [uni.name, ...(uni.aliases ?? [])].filter(
      (n): n is string => typeof n === 'string' && n.trim().length > 0,
    );

    for (const candidateName of names) {
      const exactKey = normalizeNameKey(candidateName);
      if (exactKey && !exact.has(exactKey)) {
        exact.set(exactKey, uni.slug);
      }

      const baseKey = stripParentheticalKey(candidateName);
      if (baseKey) {
        let bucket = baseCandidates.get(baseKey);
        if (!bucket) {
          bucket = new Set<string>();
          baseCandidates.set(baseKey, bucket);
        }
        bucket.add(uni.slug);
      }
    }
  }

  const uniqueBase = new Map<string, string>();
  for (const [baseKey, slugs] of baseCandidates) {
    if (slugs.size === 1) {
      const [onlySlug] = slugs;
      if (onlySlug) uniqueBase.set(baseKey, onlySlug);
    }
  }

  return { exact, uniqueBase };
}

/**
 * Links matching `<span class="en-name">...</span>` entries inside the CSC
 * university directory HTML to their canonical `/universities/[slug]` profiles
 * while leaving unmatched items untouched and avoiding nested anchor tags.
 */
export function linkCscDirectoryUniversities(
  html: string,
  universities: readonly CscDirectoryUniversityInput[],
): { html: string; matchedSlugs: string[] } {
  if (!html || universities.length === 0) {
    return { html, matchedSlugs: [] };
  }

  const { exact, uniqueBase } = buildUniversityLookup(universities);
  const matchedSet = new Set<string>();
  const matchedOrder: string[] = [];

  const linkedHtml = html.replace(
    /<span class="en-name">([\s\S]*?)<\/span>/gi,
    (fullMatch, innerHtml: string) => {
      if (/<a\b/i.test(innerHtml)) {
        return fullMatch;
      }

      const exactKey = normalizeNameKey(innerHtml);
      const slug =
        (exactKey ? exact.get(exactKey) : undefined) ??
        uniqueBase.get(stripParentheticalKey(innerHtml));

      if (!slug || !SAFE_SLUG_RE.test(slug)) {
        return fullMatch;
      }

      if (!matchedSet.has(slug)) {
        matchedSet.add(slug);
        matchedOrder.push(slug);
      }

      return `<span class="en-name"><a href="/universities/${slug}" class="csc-university-link underline decoration-teal-500/50 underline-offset-2 hover:text-petrol-700 hover:decoration-teal-700 transition-colors">${innerHtml}</a></span>`;
    },
  );

  return { html: linkedHtml, matchedSlugs: matchedOrder };
}

function summarizeScholarships(uni: CscDirectoryUniversityInput): string {
  const active = (uni.scholarships ?? []).filter((s) => s.status !== 'closed' && s.title?.trim());
  if (active.length === 0) {
    return 'Verify CSC & university quota on profile';
  }
  const cscFirst =
    active.find((s) => /csc|chinese government/i.test(`${s.title} ${s.type ?? ''}`)) ?? active[0];
  const primaryTitle = cscFirst.title.trim();
  return active.length > 1 ? `${primaryTitle} (+${active.length - 1} more)` : primaryTitle;
}

function findGuideForUniversity(
  uni: CscDirectoryUniversityInput,
  guides: readonly CscDirectoryGuideLink[],
): CscDirectoryGuideLink | undefined {
  const candidates = [uni.name, ...(uni.aliases ?? [])]
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n.length >= 6)
    .sort((a, b) => b.length - a.length);

  for (const nameLower of candidates) {
    const match = guides.find((g) => g.title.toLowerCase().includes(nameLower));
    if (match) return match;
  }
  return undefined;
}

/**
 * Builds DB-grounded CSC table rows, active CSC guide links, and factual FAQs
 * for the flagship CSC university list update page without fabricating any
 * unverified 5-digit agency codes, admissions emails, or award claims.
 */
export function buildCscDirectoryEnrichment(
  universities: readonly CscDirectoryUniversityInput[],
  updates: readonly CscDirectoryUpdateInput[],
  matchedSlugs: readonly string[],
): CscDirectoryEnrichment {
  const cscGuides: CscDirectoryGuideLink[] = updates
    .filter(
      (post) =>
        !post.archived &&
        SAFE_SLUG_RE.test(post.slug) &&
        post.slug !== CSC_DIRECTORY_SLUG &&
        (/csc/i.test(post.slug) || /\bcsc\b/i.test(post.title)),
    )
    .sort((a, b) => {
      const aYear = /2027/.test(a.title + a.slug) ? 1 : 0;
      const bYear = /2027/.test(b.title + b.slug) ? 1 : 0;
      if (aYear !== bYear) return bYear - aYear;
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) || 0 : 0;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) || 0 : 0;
      return bTime - aTime;
    })
    .slice(0, 24)
    .map(({ title, slug }) => ({ title, slug }));

  const matchedSet = new Set(matchedSlugs);

  const scored = universities
    .filter((uni) => SAFE_SLUG_RE.test(uni.slug))
    .map((uni) => {
      const guide = findGuideForUniversity(uni, cscGuides);
      const isMatched = matchedSet.has(uni.slug);
      const hasCscScholarship = (uni.scholarships ?? []).some(
        (s) => s.status !== 'closed' && /csc|chinese government|scholarship/i.test(`${s.title} ${s.type ?? ''}`),
      );

      let score = 0;
      if (guide) score += 4;
      if (isMatched) score += 3;
      if (uni.verificationStatus === 'verified') score += 2;
      if (hasCscScholarship) score += 1;

      return { uni, guide, isMatched, score };
    })
    .filter((item) => item.isMatched || item.guide || item.score >= 3)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.uni.name.localeCompare(b.uni.name);
    })
    .slice(0, 32);

  const featuredUniversities: CscFeaturedUniversityRow[] = scored.map(({ uni, guide }) => ({
    name: uni.name,
    slug: uni.slug,
    city: uni.city?.trim() || 'China',
    tuitionSummary: uni.details?.tuition?.trim() || 'See university profile',
    scholarshipSummary: summarizeScholarships(uni),
    ...(guide ? { guideSlug: guide.slug, guideTitle: guide.title } : {}),
  }));

  return {
    matchedListCount: matchedSet.size,
    featuredUniversities,
    cscGuides,
    faqs: CSC_DIRECTORY_FAQS,
  };
}

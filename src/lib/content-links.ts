export const UNIVERSITY_SLUG_ALIASES: Record<string, string> = {
  'zhengzhou-university': 'zzu',
  'northwestern-polytechnical-university': 'npu',
  'jiangsu-normal-university': 'jsnu',
  'nanjing-university-of-posts-and-telecommunications': 'njupt',
};

const ASSESSMENT_HREF_RE =
  /href=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/assessment\/?([?#][^"']*)?\1/gi;

const UNIVERSITY_ANCHOR_RE =
  /<a\b([^>]*?)\bhref=(["'])(?:https?:\/\/(?:www\.)?eduexpressint\.com)?\/universities\/([a-z0-9-]+)\/?((?:\/clear-cost)?(?:[?#][^"']*)?)\2([^>]*)>([\s\S]*?)<\/a>/gi;

/**
 * Rewrites legacy internal hrefs (/assessment and known full-name university slug aliases)
 * and unwraps internal /universities/<slug> anchors whose target does not exist in the active
 * university catalogue so rendered update pages never emit broken 404 internal links.
 */
export function repairUpdateInternalLinks(
  html: string,
  validUniversitySlugs: ReadonlySet<string>,
): string {
  if (!html) return '';

  const withAssessment = html.replace(
    ASSESSMENT_HREF_RE,
    (_match, quote: string, suffix = '') => `href=${quote}/education-fit-assessment${suffix}${quote}`,
  );

  return withAssessment.replace(
    UNIVERSITY_ANCHOR_RE,
    (
      _match,
      before: string,
      quote: string,
      rawSlug: string,
      suffix = '',
      after: string,
      innerHtml: string,
    ) => {
      const slug = rawSlug.toLowerCase();
      const canonicalSlug = UNIVERSITY_SLUG_ALIASES[slug] ?? slug;
      if (validUniversitySlugs.has(canonicalSlug)) {
        return `<a${before}href=${quote}/universities/${canonicalSlug}${suffix}${quote}${after}>${innerHtml}</a>`;
      }
      return innerHtml;
    },
  );
}

/**
 * Serialize structured data for a `<script type="application/ld+json">` tag.
 * Escapes "<" so a CMS value containing "</script>" cannot close the tag early
 * and inject markup. JSON parsers read < back as "<", so the data is unchanged.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export type Crumb = { name: string; path?: string };

/** BreadcrumbList for a page trail (Home is added automatically). */
export function breadcrumbJsonLd(trail: Crumb[], pagePath: string) {
  const site = 'https://eduexpressint.com';
  const items = [{ name: 'Home', path: '/' }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${site}${pagePath}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      // The current page (last item) may omit its URL per Google's guidance.
      ...(item.path || index < items.length - 1 ? { item: `${site}${item.path ?? pagePath}` } : {}),
    })),
  };
}

/** FAQPage built from the same items the page renders visibly. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

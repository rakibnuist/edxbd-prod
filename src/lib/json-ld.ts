import { toSafeExternalUrl } from './safe-url';

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

/** Schema.org `citation` list built from verified http(s) primary sources. */
export function citationJsonLd(sources: { label: string; href: string }[]) {
  const items = sources
    .map(source => {
      const safe = toSafeExternalUrl(source.href);
      return safe ? { '@type': 'CreativeWork', name: source.label, url: safe } : null;
    })
    .filter((item): item is { '@type': 'CreativeWork'; name: string; url: string } => item !== null);
  return items.length ? { citation: items } : {};
}

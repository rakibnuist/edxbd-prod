/**
 * Serialize structured data for a `<script type="application/ld+json">` tag.
 * Escapes "<" so a CMS value containing "</script>" cannot close the tag early
 * and inject markup. JSON parsers read < back as "<", so the data is unchanged.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Public-content HTML normaliser.
 *
 * Update/article bodies were historically authored (and imported) as standalone
 * HTML documents: they include <!DOCTYPE>, <html>, <head>, <body>, <style>
 * blocks and their own <h1>. Rendering them with dangerouslySetInnerHTML put a
 * second document inside the page, leaked `:root`/`body`/`*` CSS into the whole
 * site and produced duplicate H1s.
 *
 * This module normalises content at the rendering/serialisation boundary so the
 * app is safe even if an editor pastes another full document later. The stored
 * rows are also migrated once by scripts/normalize-update-content.mjs.
 *
 * Deliberately dependency-free: it runs in server components and route handlers
 * without jsdom, and only keeps a conservative subset of HTML.
 */

const COMMENT = /<!--[\s\S]*?-->/g;
const DOCTYPE = /<!doctype[^>]*>/gi;
const HEAD = /<head\b[^>]*>[\s\S]*?<\/head>/gi;
const SCRIPT = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const STYLE = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const TITLE = /<title\b[^>]*>[\s\S]*?<\/title>/gi;
const META_LINK_BASE = /<(?:meta|link|base)\b[^>]*\/?>/gi;
const HTML_BODY_WRAPPER = /<\/?(?:html|body)\b[^>]*>/gi;
// Keep the body copy but never allow embedded applications/documents.
const DANGEROUS_ELEMENTS = /<(?:iframe|object|embed|frame|frameset|form|input|button|select|textarea|noscript)\b[^>]*>[\s\S]*?<\/(?:iframe|object|embed|frame|frameset|form|button|select|textarea|noscript)>/gi;
const DANGEROUS_VOID = /<(?:iframe|object|embed|frame|input|base|link|meta)\b[^>]*\/?>/gi;
// Event handlers and javascript:/data:text/html URLs.
const EVENT_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URL = /\s+(?:href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi;
const INLINE_STYLE = /\s+style\s*=\s*(?:"[^"]*"|'[^']*')/gi;

function extractBody(html: string): string {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];
  // Unclosed or malformed body: everything after the opening tag.
  const open = html.search(/<body\b[^>]*>/i);
  if (open >= 0) return html.replace(/^[\s\S]*?<body\b[^>]*>/i, '');
  return html;
}

/** Remove document chrome, styles and scripts; keep readable article HTML. */
export function sanitizeUpdateHtml(input: string | null | undefined): string {
  if (!input) return '';

  let html = String(input);

  // If a full document was pasted, take only its body content.
  if (/<body\b/i.test(html)) html = extractBody(html);

  html = html
    .replace(COMMENT, '')
    .replace(DOCTYPE, '')
    .replace(HEAD, '')
    .replace(SCRIPT, '')
    .replace(STYLE, '')
    .replace(TITLE, '')
    .replace(META_LINK_BASE, '')
    .replace(DANGEROUS_ELEMENTS, '')
    .replace(DANGEROUS_VOID, '')
    .replace(HTML_BODY_WRAPPER, '')
    .replace(EVENT_ATTR, '')
    .replace(JS_URL, '')
    .replace(INLINE_STYLE, '')
    // A post page already renders the title as H1; demote duplicate H1s.
    .replace(/<h1\b([^>]*)>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
    .trim();

  return html;
}

const ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
};

/** Plain text for meta descriptions, RSS and structured data. */
export function htmlToText(input: string | null | undefined, maxLength?: number): string {
  if (!input) return '';

  let text = String(input)
    .replace(COMMENT, '')
    .replace(HEAD, '')
    .replace(SCRIPT, '')
    .replace(STYLE, '')
    .replace(TITLE, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote|section|article|table)>/gi, ' ')
    .replace(/<\/t[dh]>/gi, ' · ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, entity => ENTITY_MAP[entity.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Collapse the separators produced by table cells.
  text = text.replace(/(?:\s*·\s*)+/g, ' · ').replace(/\s+([.,;:!?])/g, '$1');

  if (maxLength && text.length > maxLength) {
    const sliced = text.slice(0, maxLength);
    const lastSpace = sliced.lastIndexOf(' ');
    text = `${(lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced).replace(/[.,;:·\s]+$/, '')}…`;
  }

  return text;
}

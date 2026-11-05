/**
 * Public-content HTML sanitiser.
 *
 * Update/article bodies were historically authored (and imported) as standalone
 * HTML documents: they include <!DOCTYPE>, <html>, <head>, <body>, <style>
 * blocks and their own <h1>. Rendering them with dangerouslySetInnerHTML put a
 * second document inside the page, leaked `:root`/`body`/`*` CSS into the whole
 * site and produced duplicate H1s.
 *
 * The body is rendered with dangerouslySetInnerHTML for every visitor, so it is
 * run through an allowlist sanitiser (sanitize-html, a real HTML parser) rather
 * than regexes: anything not listed below is dropped, attribute values are
 * entity-decoded before URL schemes are checked, and the output is
 * re-serialised from parsed tokens. It runs on save (admin content API), on
 * every render/serialisation path and in the admin preview.
 *
 * Plain JS with no Node or DOM globals: it works in server components, route
 * handlers, client components and `node --experimental-strip-types` scripts.
 */
import sanitizeHtml from 'sanitize-html';

const COMMENT = /<!--[\s\S]*?-->/g;
const HEAD = /<head\b[^>]*>[\s\S]*?<\/head>/gi;
const SCRIPT = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const STYLE = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const TITLE = /<title\b[^>]*>[\s\S]*?<\/title>/gi;

/** Formatting an article body may use. Everything else is removed. */
export const ALLOWED_CONTENT_TAGS = [
  // Text blocks and headings (a page already owns the H1, so h1 becomes h2).
  'p', 'br', 'hr', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'address',
  'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'details', 'summary',
  // Inline formatting.
  'a', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
  'q', 'cite', 'abbr', 'code', 'kbd', 'samp', 'var', 'time',
  // Lists.
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  // Media.
  'img', 'figure', 'figcaption',
  // Tables.
  'table', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
] as const;

/**
 * Elements dropped together with everything inside them (not just the tag):
 * document chrome, scripts/styles, embedded documents, forms and foreign
 * (SVG/MathML) content, which is where parser-differential tricks live.
 */
const DROP_WITH_CONTENT = [
  'head', 'title', 'script', 'style', 'noscript', 'template', 'textarea', 'option', 'select',
  'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'noembed', 'noframes',
  'xmp', 'plaintext', 'svg', 'math', 'form', 'button', 'canvas', 'audio', 'video',
];

// Element ids are kept for in-page anchors, but only simple lowercase slugs so
// stored content cannot clobber page globals through named window properties
// (e.g. id="dataLayer", id="__next_f") or duplicate the layout's own landmarks.
const SAFE_ID = /^[a-z][a-z0-9-]{0,63}$/;
const RESERVED_IDS = new Set(['fbq', 'gtag', 'ga', 'main-content', 'site-footer']);

const transformAll: sanitizeHtml.Transformer = (tagName, attribs) => {
  const next: sanitizeHtml.Attributes = { ...attribs };

  if (next.id !== undefined) {
    const id = String(next.id).trim();
    if (SAFE_ID.test(id) && !RESERVED_IDS.has(id)) next.id = id;
    else delete next.id;
  }

  if (tagName === 'a') {
    const target = String(next.target ?? '').trim().toLowerCase();
    if (target === '_blank') {
      const rel = new Set(String(next.rel ?? '').toLowerCase().split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      next.target = '_blank';
      next.rel = [...rel].join(' ');
    } else {
      delete next.target;
    }
  }

  return { tagName, attribs: next };
};

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...ALLOWED_CONTENT_TAGS],
  allowedAttributes: {
    '*': ['class', 'id', 'title', 'lang', 'dir'],
    a: ['href', 'target', 'rel', 'hreflang'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
    blockquote: ['cite'],
    q: ['cite'],
    del: ['cite', 'datetime'],
    ins: ['cite', 'datetime'],
    time: ['datetime'],
    ol: ['start', 'reversed', 'type'],
    li: ['value'],
    col: ['span'],
    colgroup: ['span'],
    th: ['colspan', 'rowspan', 'scope', 'abbr'],
    td: ['colspan', 'rowspan', 'headers'],
  },
  // Links may point at web pages, email and phone numbers; images only at
  // web URLs or inline data. Relative URLs stay allowed; `//host` does not.
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: false,
  allowedStyles: {},
  parseStyleAttributes: false,
  disallowedTagsMode: 'discard',
  nonTextTags: DROP_WITH_CONTENT,
  transformTags: {
    h1: sanitizeHtml.simpleTransform('h2', {}, true),
    '*': transformAll,
  },
};

function extractBody(html: string): string {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];
  // Unclosed or malformed body: everything after the opening tag.
  const open = html.search(/<body\b[^>]*>/i);
  if (open >= 0) return html.replace(/^[\s\S]*?<body\b[^>]*>/i, '');
  return html;
}

/**
 * Allowlist-sanitise article HTML: removes document chrome, scripts, styles,
 * event handlers, unsafe URLs and anything else not explicitly allowed, while
 * keeping headings, lists, links, images, tables and inline formatting.
 */
export function sanitizeUpdateHtml(input: string | null | undefined): string {
  if (!input) return '';

  let html = String(input);

  // If a full document was pasted, take only its body content.
  if (/<body\b/i.test(html)) html = extractBody(html);

  return sanitizeHtml(html, SANITIZE_OPTIONS).trim();
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

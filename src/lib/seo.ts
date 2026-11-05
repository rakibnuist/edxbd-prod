import type { Metadata } from 'next';

export const SITE_URL = 'https://eduexpressint.com';
export const SITE_NAME = 'EduExpress International';

const DEFAULT_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'EduExpress International — study abroad from Bangladesh with every cost in writing',
};

export type PageSeo = {
  /** Full browser title, brand included, ideally 50–60 characters. */
  title: string;
  /** 120–160 characters: who it is for, what they get, one concrete fact. */
  description: string;
  /** Site-relative path, e.g. "/contact". */
  path: string;
  image?: { url: string; width?: number; height?: number; alt: string };
  type?: 'website' | 'article';
  /** Open Graph locale, e.g. "bn_BD". Defaults to en_US-compatible output. */
  locale?: string;
  /** hreflang alternates keyed by language tag. */
  languages?: Record<string, string>;
  noindex?: boolean;
};

/**
 * One source for a static page's search and social metadata, so every page
 * ships the same complete set: title, description, canonical, Open Graph
 * (with og:url and image) and a matching Twitter card. Development builds warn
 * when the title or description falls outside the lengths search engines show.
 */
/** Advertised on every page so feed readers and crawlers find new updates. */
export const RSS_FEED = { 'application/rss+xml': [{ url: '/updates/feed.xml', title: 'EduExpress education updates' }] };

export function pageMetadata(seo: PageSeo): Metadata {
  if (process.env.NODE_ENV !== 'production') {
    if (seo.title.length > 62) console.warn(`[seo] Title over 62 chars (${seo.title.length}) on ${seo.path}: ${seo.title}`);
    if (seo.description.length < 110 || seo.description.length > 165) {
      console.warn(`[seo] Description ${seo.description.length} chars on ${seo.path} (aim for 120–160).`);
    }
  }
  const image = { ...DEFAULT_IMAGE, ...seo.image };
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.path, ...(seo.languages ? { languages: seo.languages } : {}), types: RSS_FEED },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.path,
      siteName: SITE_NAME,
      type: seo.type ?? 'website',
      ...(seo.locale ? { locale: seo.locale } : {}),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [image.url],
    },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * A 1200×630 JPEG share card cut from a real site photo (generated into
 * public/og/). JPEG rather than WebP so every chat app and social network
 * renders the preview.
 */
export const ogImage = (name: string, alt: string) => ({ url: `/og/${name}.jpg`, width: 1200, height: 630, alt });

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;

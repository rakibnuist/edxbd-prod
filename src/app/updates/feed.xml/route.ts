import prisma from '@/lib/prisma';
import { currentVisibleContentWhere } from '@/lib/content-governance';
import { categoriesFromUpdate } from '@/lib/update-categories';
import { htmlToText } from '@/lib/content-html';

// RSS 2.0 feed for the /updates library (updates + articles). Every entry has
// already passed the publication gate (reviewer, official sources,
// verification dates), so nothing shows here that the site would not render.
export const dynamic = 'force-dynamic';

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, character => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[character] || character));

const SITE_URL = 'https://eduexpressint.com';

export async function GET() {
  try {
    const posts = await prisma.content.findMany({
      where: { type: { in: ['update', 'article'] }, ...currentVisibleContentWhere() },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
      take: 30,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        categories: true,
        category: true,
        author: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    const items = posts.map(post => {
      const link = `${SITE_URL}/updates/${post.slug}`;
      const pubDate = (post.publishedAt || post.updatedAt).toUTCString();
      const description = post.excerpt || htmlToText(post.content, 280);
      const categories = Array.from(new Set(categoriesFromUpdate(post)));
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        `      <author>${escapeXml(post.author || 'EduExpress International')}</author>`,
        ...categories.map(category => `      <category>${escapeXml(category)}</category>`),
        '    </item>',
      ].join('\n');
    }).join('\n');

    const lastBuildDate = posts[0]
      ? (posts[0].publishedAt || posts[0].updatedAt).toUTCString()
      : new Date().toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EduExpress International — Updates &amp; Guides</title>
    <link>${SITE_URL}/updates</link>
    <atom:link href="${SITE_URL}/updates/feed.xml" rel="self" type="application/rss+xml" />
    <description>Verified study-abroad updates, guides and university announcements for Bangladeshi students.</description>
    <language>en-bd</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>EduExpress International — Updates &amp; Guides</title>
      <link>${SITE_URL}/updates</link>
    </image>
${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error building updates RSS feed:', error);
    return new Response('Failed to build feed', { status: 500 });
  }
}

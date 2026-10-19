import assert from 'node:assert/strict';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));
const { chinaGuidePages } = await import('../src/data/chinaGuidePages.ts');

const args = process.argv.slice(2);
const baseAt = args.indexOf('--base-url');
const base = new URL(baseAt >= 0 ? args[baseAt + 1] : process.env.CHINA_GUIDE_BASE_URL || 'http://127.0.0.1:3000');
const isLocalPreview = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
const origin = 'https://eduexpressint.com';
const hub = 'study-in-china-from-bangladesh';
const topics = ['study-in-china-cost-bangladesh', 'china-scholarships-bangladesh', 'china-student-visa-bangladesh', 'study-in-china-without-ielts', 'life-in-china-bangladeshi-students', 'china-admission-requirements'];

const decode = value => value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, entity => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ' }[entity]));
const plain = value => decode(value.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
const hasType = (node, type) => Array.isArray(node['@type']) ? node['@type'].includes(type) : node['@type'] === type;
const schemaNodes = html => [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => attributes(match[1]).type === 'application/ld+json').flatMap(match => {
  const parsed = JSON.parse(match[2]);
  return Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];
});

async function fetchText(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(45000), redirect: 'manual' });
  assert.equal(response.status, 200, `${path}: HTTP 200 required, received ${response.status}`);
  // Local/staging protection is separate from a page's production metadata.
  // Retain a development server's noindex header while checking its page tags.
  if (!isLocalPreview) assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex/i, `${path}: production response must not block indexing`);
  return response.text();
}

async function checkPage(slug) {
  const path = `/${slug}`;
  const html = await fetchText(path);
  const text = plain(html);
  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map(match => plain(match[1]));
  assert.equal(titles.length, 1, `${path}: one title in initial HTML`);
  assert.equal((titles[0].match(/EduExpress International/g) || []).length, 1, `${path}: brand appears once in title`);
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => plain(match[1]));
  assert.equal(h1.length, 1, `${path}: one visible H1`);
  const canonical = tags(html, 'link').filter(link => link.rel === 'canonical');
  assert.equal(canonical.length, 1, `${path}: one canonical`);
  assert.equal(canonical[0].href, `${origin}${path}`, `${path}: self-canonical on preferred host`);
  const metas = tags(html, 'meta');
  const description = metas.find(meta => meta.name === 'description')?.content;
  assert.ok(description && description.length > 70, `${path}: substantive meta description`);
  assert.equal(metas.find(meta => meta.property === 'og:url')?.content, `${origin}${path}`, `${path}: social URL agrees with canonical`);
  for (const meta of metas.filter(meta => ['robots', 'googlebot', 'bingbot'].includes(meta.name))) assert.doesNotMatch(meta.content, /noindex|none/i, `${path}: no unintended crawler block`);
  assert.doesNotMatch(text, /Sources checked|Next review|Last verified|Review recorded|\/Users\/|\/private\/|closed admission cycle/i, `${path}: no public editorial records or closed cycle labels`);

  const hrefs = tags(html, 'a').map(anchor => anchor.href).filter(Boolean);
  const internal = hrefs.map(href => new URL(href, base)).filter(url => url.origin === base.origin || url.origin === origin).map(url => url.pathname);
  assert.ok(internal.includes('/apply') || internal.includes('/education-fit-assessment'), `${path}: functional application or assessment link`);
  const nodes = schemaNodes(html);
  const pageNode = nodes.find(node => hasType(node, 'WebPage') && node.url === `${origin}${path}`);
  assert.ok(pageNode, `${path}: WebPage schema follows canonical`);
  assert.ok(nodes.some(node => hasType(node, 'BreadcrumbList')), `${path}: breadcrumb schema`);
  assert.equal('dateModified' in pageNode, false, `${path}: no invented maintenance date`);
  assert.equal('reviewedBy' in pageNode, false, `${path}: no fabricated reviewer`);
  const faqNodes = nodes.filter(node => hasType(node, 'FAQPage'));
  assert.ok(faqNodes.length <= 1, `${path}: FAQ schema is not duplicated`);
  for (const faqNode of faqNodes) {
    for (const faq of faqNode.mainEntity) {
      assert.ok(text.includes(plain(faq.name)), `${path}: schema question is readable without JavaScript`);
      assert.ok(text.includes(plain(faq.acceptedAnswer.text)), `${path}: full schema answer is visible in initial HTML`);
    }
  }

  if (slug === hub) {
    for (const topic of topics) assert.ok(internal.includes(`/${topic}`), `${path}: crawlable link to ${topic}`);
    assert.equal(tags(html, 'link').some(link => link.hreflang), false, `${path}: incomplete Bengali page is not claimed as a language equivalent`);
  } else {
    const guide = chinaGuidePages[slug];
    assert.equal(h1[0], guide.title, `${path}: H1 matches guide subject`);
    assert.ok(text.includes(plain(guide.directAnswer)), `${path}: direct answer SSR`);
    for (const section of guide.sections) {
      assert.ok(text.includes(plain(section.heading)), `${path}: section heading SSR: ${section.heading}`);
      assert.ok(text.includes(plain(section.summary)), `${path}: section content SSR: ${section.heading}`);
      for (const item of section.items || []) assert.ok(text.includes(plain(item)), `${path}: complete section facts`);
      for (const cell of section.table?.rows.flat() || []) assert.ok(text.includes(plain(cell)), `${path}: complete table facts`);
      for (const entry of [...(section.cards || []), ...(section.steps || []), ...(section.disclosures || [])]) assert.ok(text.includes(plain(entry.body)), `${path}: complete structured explanation`);
    }
    assert.ok(internal.includes(`/${hub}`), `${path}: crawlable hub link`);
    assert.ok(topics.filter(topic => topic !== slug && internal.includes(`/${topic}`)).length >= 3, `${path}: useful peer navigation`);
    assert.equal(faqNodes.length, guide.faqs.length ? 1 : 0, `${path}: FAQ schema follows visible FAQ data`);
    assert.deepEqual(faqNodes.flatMap(node => node.mainEntity.map(faq => ({ question: faq.name, answer: faq.acceptedAnswer.text }))), guide.faqs, `${path}: schema contains exactly the visible questions and answers`);
    for (const source of guide.sources) assert.equal(hrefs.includes(source.href), false, `${path}: source records stay internal`);
  }

  return { slug, title: titles[0], description, faqCount: faqNodes[0]?.mainEntity.length || 0 };
}

const results = await Promise.allSettled([hub, ...topics].map(checkPage));
const passed = [];
for (let index = 0; index < results.length; index++) {
  const result = results[index];
  if (result.status === 'fulfilled') { passed.push(result.value); console.log(`PASS /${result.value.slug}: SSR, canonical, links, metadata and ${result.value.faqCount} visible FAQs`); }
  else console.error(`FAIL /${[hub, ...topics][index]}: ${result.reason.message}`);
}
assert.equal(passed.length, results.length, 'All China hub and guide pages must pass');
assert.equal(new Set(passed.map(page => page.title)).size, passed.length, 'Search titles must be unique across hub and guides');
assert.equal(new Set(passed.map(page => page.description)).size, passed.length, 'Search descriptions must be unique across hub and guides');

const [mainSitemap, guidesSitemap, robots] = await Promise.all([fetchText('/sitemap.xml'), fetchText('/sitemaps/guides.xml'), fetchText('/robots.txt')]);
for (const [name, xml] of [['main', mainSitemap], ['guides', guidesSitemap]]) {
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
  assert.equal(new Set(locs).size, locs.length, `${name} sitemap contains no duplicate URLs`);
  for (const topic of topics) assert.equal(locs.filter(loc => loc === `${origin}/${topic}`).length, 1, `${name} sitemap lists ${topic} once`);
}
assert.ok(robots.includes(`Sitemap: ${origin}/sitemaps/guides.xml`), 'robots.txt advertises guide sitemap');
for (const topic of [hub, ...topics]) assert.ok(!new RegExp(`Disallow:\\s*/${topic}(?:\\s|$)`).test(robots), `robots.txt permits ${topic}`);
console.log('PASS discovery: both sitemaps, unique URLs and crawl permissions');

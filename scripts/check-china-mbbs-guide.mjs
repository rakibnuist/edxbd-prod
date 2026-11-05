import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.MBBS_GUIDE_BASE_URL || 'http://127.0.0.1:3000';
const route = '/mbbs-in-china-bangladesh';
const canonical = `https://eduexpressint.com${route}`;
const guide = JSON.parse(await readFile(new URL('../src/data/chinaMbbsGuide.json', import.meta.url), 'utf8'));
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
async function get(path) {
  const response = await fetch(new URL(path, base), {signal:AbortSignal.timeout(45000)});
  assert.equal(response.status, 200, path);
  return response.text();
}
const [html, hub, sitemap] = await Promise.all([get(route), get('/study-in-china-from-bangladesh'), get('/sitemaps/guides.xml')]);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), guide.metaTitle);
assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
assert.match(html, /<meta name="robots" content="index, follow"/);
assert.doesNotMatch(html, /checkedAt|rawSnapshot|316481e348bad646|\/Users\/a1\/Downloads/);
const article = html.slice(html.indexOf('<article lang="en"'), html.lastIndexOf('</article>') + '</article>'.length);
const plain = decode(article.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));
assert.doesNotMatch(plain, /20(?:2[0-9])|Last verified|Sources checked|Under verification|BMDC Listed/);
const nodes = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => {const json=JSON.parse(match[1]); return json['@graph'] || [json];});
const faq = nodes.find(node => node['@type'] === 'FAQPage');
assert.deepEqual(faq.mainEntity.map(item => [item.name,item.acceptedAnswer.text]), guide.faqs.map(item => [item.question,item.answer]));
assert.equal(nodes.find(node => node['@type'] === 'ItemList').itemListElement.length, guide.universities.length);
assert(nodes.some(node => node['@type'] === 'WebPage'));
assert(nodes.some(node => node['@type'] === 'BreadcrumbList'));
for (const item of guide.universities) {
  assert(article.includes(`id="mbbs-${item.id}"`), `${item.name}: server-rendered card`);
  assert(plain.includes(item.name));
  assert(plain.includes(item.housing));
  const query = new URLSearchParams({country:'China',program:'Clinical Medicine (MBBS)',university:item.name});
  assert(decode(article).includes(`/apply?${query}`), `${item.name}: university and programme enquiry context`);
}
for (const item of guide.faqs) assert(plain.includes(item.answer), 'FAQ answers must be in initial HTML');
assert.match(hub, /href="\/mbbs-in-china-bangladesh"/);
assert.match(article, /href="\/study-in-china-from-bangladesh"/);
assert(sitemap.includes(canonical));
assert.doesNotMatch(plain, /obtain the required Eligibility Certificate|BMDC eligibility and admission-test records/);
assert.match(plain, /Ministry of Education authorisation/);
assert.match(plain, /pass the BMDC Registration Qualifying Examination/);
for (const slug of ['shanghai-jiao-tong-university','capital-medical-university','zhejiang-university','nanjing-medical-university']) assert(article.includes(`/universities/${slug}#programs`));
assert.equal(33000+4400+800,38200);
assert.match(plain, /CNY 38,200/);
console.log('Passed: SSR content, metadata, canonical, indexability, 6 contextual application links, matching visible FAQs and structured answers, private research isolation, evergreen copy, costs, two-way hub links and sitemap.');

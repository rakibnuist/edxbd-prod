import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));
const { chinaGuideMetadata, chinaGuidePages } = await import('../src/data/chinaGuidePages.ts');
const { staticRouteGuides, staticRouteSlugs, sitemapStaticRouteSlugs } = await import('../src/data/staticRoutePages.ts');

const slugs = ['study-in-china-cost-bangladesh', 'china-scholarships-bangladesh', 'china-student-visa-bangladesh', 'study-in-china-without-ielts', 'life-in-china-bangladeshi-students', 'china-admission-requirements'];
const origin = 'https://eduexpressint.com';
const publicContent = guide => [guide.title, guide.description, guide.eyebrow, guide.directAnswer, ...guide.facts.flatMap(fact => [fact.value, fact.label, fact.note]), ...guide.sections.flatMap(section => [section.heading, section.summary, ...(section.items || []), ...(section.table?.columns || []), ...(section.table?.rows.flat() || []), ...(section.cards || []).flatMap(card => [card.title, card.body]), ...(section.steps || []).flatMap(step => [step.title, step.body]), ...(section.disclosures || []).flatMap(entry => [entry.title, entry.body])]), ...guide.faqs.flatMap(faq => [faq.question, faq.answer]), guide.ctaTitle, guide.ctaText].filter(Boolean).join(' ');

test('the six China topics own distinct canonical URLs, titles and descriptions', () => {
  const titles = new Set();
  const descriptions = new Set();
  const canonicals = new Set();
  for (const slug of slugs) {
    const guide = chinaGuidePages[slug];
    assert.ok(guide, `${slug}: guide exists`);
    assert.equal(guide.slug, slug);
    const metadata = chinaGuideMetadata(slug);
    assert.equal(typeof metadata.title?.absolute, 'string', `${slug}: absolute title prevents duplicated brand suffixes`);
    const title = metadata.title.absolute;
    assert.equal((title.match(/EduExpress International/g) || []).length, 1, `${slug}: brand appears once`);
    const canonical = new URL(String(metadata.alternates?.canonical), origin).href;
    assert.equal(canonical, `${origin}/${slug}`);
    assert.equal(new URL(String(metadata.openGraph?.url), origin).href, canonical);
    assert.equal(metadata.description, guide.description);
    assert.ok(guide.description.length > 70, `${slug}: useful search description`);
    assert.equal(titles.has(title), false, `${slug}: unique search title`);
    assert.equal(descriptions.has(metadata.description), false, `${slug}: unique search description`);
    assert.equal(canonicals.has(canonical), false, `${slug}: unique canonical`);
    titles.add(title); descriptions.add(metadata.description); canonicals.add(canonical);
    assert.doesNotMatch(`${title} ${metadata.description}`, /\b20\d{2}\b|closed admission|Sources checked|Next review/i);
    assert.notEqual(metadata.robots?.index, false, `${slug}: no unintended index block`);
  }
});

test('static topic routes are registered once while the scholarship guide has one dynamic owner', async () => {
  const dynamic = 'china-scholarships-bangladesh';
  assert.equal(staticRouteSlugs.includes(dynamic), false);
  for (const slug of slugs.filter(slug => slug !== dynamic)) {
    await access(new URL(`../src/app/${slug}/page.tsx`, import.meta.url));
    assert.ok(slug in staticRouteGuides, `${slug}: registered static guide`);
    assert.equal(sitemapStaticRouteSlugs.filter(value => value === slug).length, 1, `${slug}: one sitemap catalog entry`);
  }
});

test('new admissions route does not invent a content review date for sitemap lastmod', () => {
  assert.ok('china-admission-requirements' in staticRouteGuides);
  assert.equal(staticRouteGuides['china-admission-requirements'], undefined);
});

test('each topic delivers substantive topic-specific content and complete unique FAQ answers', () => {
  for (const slug of slugs) {
    const guide = chinaGuidePages[slug];
    assert.ok(guide.directAnswer.length > 100, `${slug}: direct answer`);
    assert.ok(guide.sections.length >= 4, `${slug}: substantive body`);
    assert.ok(publicContent(guide).split(/\s+/).length >= 150, `${slug}: guide is not a title-only landing page`);
    const questions = new Set();
    for (const faq of guide.faqs) {
      assert.ok(faq.question.trim() && faq.answer.trim(), `${slug}: complete FAQ pair`);
      assert.ok(faq.answer.length > 40, `${slug}: answer explains the subject`);
      assert.equal(questions.has(faq.question), false, `${slug}: no repeated questions`);
      questions.add(faq.question);
    }
    assert.ok(questions.size >= 3, `${slug}: useful FAQ coverage`);
  }
});

test('public guide content is evergreen and does not expose editorial or private source records', () => {
  for (const slug of slugs) {
    const text = publicContent(chinaGuidePages[slug]);
    assert.doesNotMatch(text, /Sources checked|Next review|Last verified|Review recorded|\/Users\/|\/private\/|sourceFile|lastVerifiedAt|closed admission cycle/i, slug);
    assert.doesNotMatch(text, /\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Spring|Autumn)\s+(?:19|20)\d{2}\b|\b(?:19|20)\d{2}\s+(?:admission|intake|cycle|brochure)/i, slug);
  }
});

test('every guide has a crawlable route back to the China hub and another useful guide', () => {
  for (const slug of slugs) {
    const related = chinaGuidePages[slug].related;
    assert.ok(related.some(link => link.href === '/study-in-china-from-bangladesh'), `${slug}: hub link`);
    assert.ok(related.some(link => link.href !== `/${slug}` && slugs.some(other => link.href === `/${other}`)), `${slug}: peer guide link`);
    assert.ok(related.every(link => link.label.trim() && link.href.startsWith('/')), `${slug}: descriptive internal links`);
  }
});

test('CSC financial guidance preserves the published stipend categories and insurance scope', () => {
  const guide = chinaGuidePages['china-scholarships-bangladesh'];
  const coverage = guide.sections.find(section => section.heading === 'What a full CSC award covers');
  assert.deepEqual(coverage.table.rows, [
    ['Bachelor’s', 'CNY 2,500 / month'], ['Master’s', 'CNY 3,000 / month'],
    ['PhD', 'CNY 3,500 / month'], ['General scholar', 'CNY 3,000 / month'],
    ['Senior scholar', 'CNY 3,500 / month'],
  ]);
  const insurance = coverage.cards.find(card => card.title === 'Medical insurance').body;
  assert.match(insurance, /CNY 800 per person per year/);
  assert.match(insurance, /CNY 400 for programmes shorter than 6 months/);
  assert.match(insurance, /not an extra cash stipend/);
  const examples = guide.sections.find(section => section.heading === 'Other funding and university examples');
  assert.equal(examples.table.rows.length, 6);
  assert.ok(examples.table.rows.some(([title, coverage]) => title.includes('PhD, class 1') && coverage.includes('CNY 2,500 monthly')));
  assert.match(examples.items.join(' '), /university PhD allowance can differ from the CSC PhD stipend/);
});

test('degree and scholar eligibility retain their distinct age boundaries', () => {
  const guide = chinaGuidePages['china-scholarships-bangladesh'];
  const eligibility = guide.sections.find(section => section.heading === 'CSC eligibility by study level');
  assert.deepEqual(eligibility.table.rows.map(([category, , age]) => [category, age]), [
    ['Bachelor’s', 'Under 25'], ['Master’s', 'Under 35'], ['PhD', 'Under 40'],
    ['General scholar', 'Under 45'], ['Senior scholar', 'Under 50'],
  ]);
  assert.match(eligibility.summary, /university or specialist scheme can add conditions/);
});

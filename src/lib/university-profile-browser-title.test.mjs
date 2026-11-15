import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

const srcRoot = new URL('../', import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  const mapped = specifier.startsWith('@/') ? ${JSON.stringify(srcRoot)} + specifier.slice(2) : specifier;
  try {
    return await nextResolve(mapped, context);
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND' && !/\\.[a-z]+$/i.test(mapped)) {
      return nextResolve(mapped + '.ts', context);
    }
    throw error;
  }
}`;
register(`data:text/javascript,${encodeURIComponent(loader)}`);

const { universityProfileBrowserTitle, universityProfileSeo } = await import('./university-profile-seo.ts');

test('universityProfileBrowserTitle keeps long university names <= 64 chars while preserving universityProfileSeo.title', () => {
  const nuist = {
    slug: 'nuist',
    name: 'Nanjing University of Information Science and Technology',
    aliases: ['NUIST'],
    city: 'Nanjing',
    country: 'China',
  };

  // Preserve universityProfileSeo.title contract
  assert.equal(
    universityProfileSeo(nuist, []).title,
    'Nanjing University of Information Science and Technology (NUIST): Fees & Scholarships',
  );

  const browserTitle = universityProfileBrowserTitle(nuist, []);
  assert.ok(browserTitle.length <= 64, `Expected <= 64 chars, got ${browserTitle.length}: ${browserTitle}`);
  assert.equal(browserTitle, 'Nanjing University of Information Science and Technology: Fees');
});

test('universityProfileBrowserTitle preserves MBBS indicator and single brand for medium/short names', () => {
  const qdu = {
    slug: 'qingdao-university',
    name: 'Qingdao University',
    aliases: ['QDU'],
    city: 'Qingdao',
    country: 'China',
  };
  const qduTitle = universityProfileBrowserTitle(qdu, [{ name: 'MBBS (Clinical Medicine)' }]);
  assert.ok(qduTitle.length <= 64, `Got ${qduTitle.length}: ${qduTitle}`);
  assert.match(qduTitle, /MBBS/);
  assert.equal((qduTitle.match(/EduExpress/gi) || []).length, 1);

  const bnu = {
    slug: 'bnu',
    name: 'BNU',
    aliases: [],
    city: 'Beijing',
    country: 'China',
  };
  const bnuTitle = universityProfileBrowserTitle(bnu, []);
  assert.ok(bnuTitle.length <= 64, `Got ${bnuTitle.length}: ${bnuTitle}`);
  assert.equal(bnuTitle, 'BNU: Fees & Scholarships | EduExpress International');
});

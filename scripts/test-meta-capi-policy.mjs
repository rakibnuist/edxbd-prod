// Access policy for the public Meta Conversions API route (/api/meta-capi).
// Run: node --test scripts/test-meta-capi-policy.mjs
import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyRequestOrigin, pickCustomData, resolveCapiEvent } from '../src/lib/meta-capi-policy.ts';

test('anonymous visitors can only report page, content, contact and lead events', () => {
  for (const [input, eventName] of [['page_view', 'PageView'], ['PageView', 'PageView'], ['ViewContent', 'ViewContent'], ['Contact', 'Contact'], ['study_abroad_lead', 'Lead'], ['Lead', 'Lead']]) {
    assert.deepEqual(resolveCapiEvent(input), { eventName, access: 'public' }, input);
  }
});

test('value and outcome events need admin access', () => {
  for (const input of ['Purchase', 'SubmitApplication', 'CompleteRegistration', 'Schedule', 'AddToCart', 'Subscribe', 'AddToWishlist', 'InitiateCheckout', 'Search', 'FindLocation']) {
    assert.deepEqual(resolveCapiEvent(input), { eventName: input, access: 'admin' }, input);
  }
});

test('unknown or prototype event names are rejected', () => {
  for (const input of ['purchase', 'Donate', '', 'constructor', '__proto__', 'toString', null, 42, {}]) {
    assert.equal(resolveCapiEvent(input), null, String(input));
  }
});

test('custom_data keeps descriptive labels and drops raw form fields', () => {
  const picked = pickCustomData({
    content_name: 'Study Abroad Consultation Form',
    content_category: 'Education Lead Generation',
    source: 'website_contact_form',
    study_destination: 'China',
    program_interest: 'MBBS',
    has_message: true,
    page_title: 'Home',
    // Raw personal data from the lead form must never reach Meta unhashed.
    name: 'Jane Doe', email: 'jane@example.com', phone: '+8801700000000', message: 'private',
    pageName: 'Home', page_location: 'https://eduexpressint.com/',
    userData: { email: 'jane@example.com' },
    nested: { a: 1 }, list: [1, 2],
  }, 'public');
  assert.deepEqual(picked, {
    content_name: 'Study Abroad Consultation Form',
    content_category: 'Education Lead Generation',
    page_title: 'Home',
    source: 'website_contact_form',
    study_destination: 'China',
    program_interest: 'MBBS',
    has_message: true,
  });
});

test('public events cannot carry a value or currency', () => {
  assert.deepEqual(pickCustomData({ value: 999999, currency: 'USD', content_name: 'x' }, 'public'), { content_name: 'x' });
});

test('admin events keep a bounded value and an ISO currency', () => {
  assert.deepEqual(pickCustomData({ value: 2000, currency: 'bdt' }, 'admin'), { value: 2000, currency: 'BDT' });
  assert.deepEqual(pickCustomData({ value: '1500' }, 'admin'), { value: 1500 });
  for (const value of [-1, Infinity, NaN, 1e12, 'lots', null, {}]) {
    assert.ok(!('value' in pickCustomData({ value }, 'admin')), String(value));
  }
  for (const currency of ['US', 'DOLLARS', '12$', 5]) {
    assert.ok(!('currency' in pickCustomData({ currency }, 'admin')), String(currency));
  }
});

test('labels are trimmed, length-capped and type-checked', () => {
  const picked = pickCustomData({ content_name: `  ${'x'.repeat(500)}  `, source: 42, has_message: 'yes', content_category: '   ' }, 'public');
  assert.equal(picked.content_name.length, 200);
  assert.deepEqual(Object.keys(picked), ['content_name']);
  assert.deepEqual(pickCustomData(null, 'public'), {});
  assert.deepEqual(pickCustomData(['a'], 'admin'), {});
});

const hosts = ['localhost:3000', 'eduexpressint.com', 'www.eduexpressint.com'];
const headers = values => new Headers(values);

test('same-origin browser requests are recognised', () => {
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://eduexpressint.com', 'sec-fetch-site': 'same-origin' }), hosts), 'same-origin');
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://www.eduexpressint.com' }), hosts), 'same-origin');
  assert.equal(classifyRequestOrigin(headers({ origin: 'http://localhost:3000', 'sec-fetch-site': 'same-origin' }), hosts), 'same-origin');
  // A no-referrer policy can make browsers send `Origin: null`; Fetch Metadata still vouches.
  assert.equal(classifyRequestOrigin(headers({ origin: 'null', 'sec-fetch-site': 'same-origin' }), hosts), 'same-origin');
  assert.equal(classifyRequestOrigin(headers({ 'sec-fetch-site': 'same-origin' }), hosts), 'same-origin');
});

test('cross-site and opaque origins are rejected', () => {
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://evil.example' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://eduexpressint.com.evil.example' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'http://localhost:4000' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ 'sec-fetch-site': 'same-site' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'https://eduexpressint.com', 'sec-fetch-site': 'cross-site' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'null' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'not a url' }), hosts), 'cross-site');
  assert.equal(classifyRequestOrigin(headers({ origin: 'ftp://eduexpressint.com' }), hosts), 'cross-site');
});

test('requests without browser provenance are unknown', () => {
  assert.equal(classifyRequestOrigin(headers({}), hosts), 'unknown');
  assert.equal(classifyRequestOrigin(headers({ 'user-agent': 'curl/8' }), hosts), 'unknown');
});

import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const { GTM_ID, trackEvent } = await import('./analytics.ts');

function withMockBrowser(consentValue, fn) {
  const prevWindow = globalThis.window;
  const gtagCalls = [];
  const fbqCalls = [];
  const dataLayer = [];
  const storage = new Map(consentValue ? [['cookie-consent', consentValue]] : []);

  globalThis.window = {
    localStorage: {
      getItem: (k) => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: (k) => storage.delete(k),
    },
    location: { protocol: 'https:' },
    dataLayer,
    gtag: (...args) => gtagCalls.push(args),
    fbq: (...args) => fbqCalls.push(args),
  };

  try {
    return fn({ dataLayer, gtagCalls, fbqCalls });
  } finally {
    if (prevWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = prevWindow;
    }
  }
}

test('trackEvent stays silent before analytics consent is accepted', () => {
  withMockBrowser(null, ({ dataLayer, gtagCalls, fbqCalls }) => {
    trackEvent('Lead', { label: 'hero_cta', value: 1 });
    assert.equal(dataLayer.length, 0);
    assert.equal(gtagCalls.length, 0);
    assert.equal(fbqCalls.length, 0);
  });
});

test('trackEvent dispatches to runtime dataLayer, gtag, and fbq even when build-time GTM_ID is placeholder', () => {
  assert.equal(GTM_ID, 'GTM-XXXXXXX');

  withMockBrowser('accepted', ({ dataLayer, gtagCalls, fbqCalls }) => {
    const eventId = trackEvent('Lead', { label: 'china_assessment', value: 100 });
    assert.ok(eventId.startsWith('event_'));

    assert.equal(dataLayer.length, 1);
    assert.equal(dataLayer[0].event, 'Lead');
    assert.equal(dataLayer[0].event_label, 'china_assessment');
    assert.equal(dataLayer[0].event_id, eventId);

    assert.equal(gtagCalls.length, 1);
    assert.equal(gtagCalls[0][0], 'event');
    assert.equal(gtagCalls[0][1], 'Lead');
    assert.equal(gtagCalls[0][2].event_id, eventId);

    assert.equal(fbqCalls.length, 1);
    assert.equal(fbqCalls[0][0], 'track');
    assert.equal(fbqCalls[0][1], 'Lead');
    assert.deepEqual(fbqCalls[0][3], { eventID: eventId });
  });
});

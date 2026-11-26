import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const {
  trackConversion,
  trackAssessmentStart,
  trackAssessmentSubmit,
  trackEfaStart,
  trackEfaFinish,
  trackPackageView,
  trackWhatsAppClick,
  trackPhoneClick,
} = await import('./conversion-events.ts');

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
    location: {
      protocol: 'https:',
      pathname: '/test-page',
      href: 'https://eduexpressint.com/test-page',
      search: '',
    },
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

test('conversion-events: stays silent when analytics consent is withheld', () => {
  withMockBrowser(null, ({ dataLayer, gtagCalls, fbqCalls }) => {
    trackAssessmentStart({ destination: 'china' });
    trackWhatsAppClick({ label: 'hero' });
    assert.equal(dataLayer.length, 0);
    assert.equal(gtagCalls.length, 0);
    assert.equal(fbqCalls.length, 0);
  });
});

test('conversion-events: EFA start / submit dispatches with standard event parity', () => {
  withMockBrowser('accepted', ({ dataLayer, gtagCalls, fbqCalls }) => {
    trackAssessmentStart({ destination: 'china', label: 'efa_step_1' });
    assert.equal(dataLayer.length, 1);
    assert.equal(dataLayer[0].event, 'assessment_start');
    assert.equal(gtagCalls[0][1], 'assessment_start');
    assert.equal(fbqCalls[0][1], 'InitiateCheckout');

    trackAssessmentSubmit({ destination: 'china', label: 'efa_completed', eventId: 'test_evt_123' });
    assert.equal(dataLayer.length, 2);
    assert.equal(dataLayer[1].event, 'assessment_submit');
    assert.equal(gtagCalls[1][1], 'assessment_submit');
    assert.equal(fbqCalls[1][1], 'Lead');
    assert.deepEqual(fbqCalls[1][3], { eventID: 'test_evt_123' });

    // Verify aliases
    trackEfaStart({ destination: 'malaysia' });
    assert.equal(dataLayer[2].event, 'assessment_start');
    trackEfaFinish({ destination: 'malaysia' });
    assert.equal(dataLayer[3].event, 'assessment_submit');
  });
});

test('conversion-events: whatsapp_click and phone_click map cleanly to Contact with correct parameters', () => {
  withMockBrowser('accepted', ({ dataLayer, gtagCalls, fbqCalls }) => {
    trackWhatsAppClick({ label: 'sticky_chat' });
    assert.equal(dataLayer[0].event, 'whatsapp_click');
    assert.equal(gtagCalls[0][1], 'whatsapp_click');
    assert.equal(fbqCalls[0][1], 'Contact');
    assert.equal(fbqCalls[0][2].content_name, 'whatsapp_click');

    trackPhoneClick({ label: 'header_call' });
    assert.equal(dataLayer[1].event, 'phone_click');
    assert.equal(gtagCalls[1][1], 'phone_click');
    assert.equal(fbqCalls[1][1], 'Contact');
    assert.equal(fbqCalls[1][2].content_name, 'phone_click');
  });
});

test('conversion-events: package_view maps to ViewContent with full payload', () => {
  withMockBrowser('accepted', ({ dataLayer, gtagCalls, fbqCalls }) => {
    trackPackageView({ destination: 'china', label: 'china_complete_support_package' });
    assert.equal(dataLayer[0].event, 'package_view');
    assert.equal(gtagCalls[0][1], 'package_view');
    assert.equal(fbqCalls[0][1], 'ViewContent');
    assert.equal(fbqCalls[0][2].content_name, 'package_view');
    assert.equal(fbqCalls[0][2].content_category, 'china');
  });
});

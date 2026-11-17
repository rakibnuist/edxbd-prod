import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { register } from 'node:module';
import nextServer from 'next/server.js';
const { NextResponse } = nextServer;

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const {
  captureLandingFbclid,
  clearTrackingState,
  getCapturedLandingUrlWithFbclid,
  TRACKING_COOKIE_NAMES,
} = await import('../src/lib/tracking-consent.ts');

const {
  applyMetaParamCookies,
  buildServerMetaParams,
  extractMetaParamOverridesFromBody,
  PII_DATA_TYPE,
  sanitizeMetaParamValue,
} = await import('../src/lib/meta-param-builder-server.ts');

const {
  ensureClientMetaParams,
  getConsentedSubmissionMetaParams,
} = await import('../src/lib/meta-param-builder-client.ts');

function createStorageMock() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

test('tracking-consent captures fbclid strictly in memory and revokes _fbp/_fbc/_fbi domain cookies', () => {
  const localStorage = createStorageMock();
  const sessionStorage = createStorageMock();
  const cookieWrites = [];
  const doc = {
    get cookie() {
      return '';
    },
    set cookie(val) {
      cookieWrites.push(val);
    },
  };

  assert.ok(TRACKING_COOKIE_NAMES.includes('_fbc'));
  assert.ok(TRACKING_COOKIE_NAMES.includes('_fbp'));
  assert.ok(TRACKING_COOKIE_NAMES.includes('_fbi'));

  const captured = captureLandingFbclid(
    'https://eduexpressint.com/study-in-china?fbclid=IwAR_TEST_CLICK_123&utm_source=meta#form',
  );
  assert.equal(
    captured,
    'https://eduexpressint.com/study-in-china?fbclid=IwAR_TEST_CLICK_123&utm_source=meta',
  );
  assert.equal(
    getCapturedLandingUrlWithFbclid(),
    'https://eduexpressint.com/study-in-china?fbclid=IwAR_TEST_CLICK_123&utm_source=meta',
  );
  assert.equal(cookieWrites.length, 0);

  clearTrackingState({
    localStorage,
    sessionStorage,
    document: doc,
    location: { protocol: 'https:', hostname: 'www.eduexpressint.com' },
  });

  assert.ok(cookieWrites.some((c) => /^_fbp=;path=\/;max-age=0;SameSite=Lax;Secure$/.test(c)));
  assert.ok(cookieWrites.some((c) => /^_fbp=;path=\/;max-age=0;SameSite=Lax;Secure;domain=\.eduexpressint\.com$/.test(c)));
  assert.ok(cookieWrites.some((c) => /^_fbc=;path=\/;max-age=0;SameSite=Lax;Secure;domain=\.eduexpressint\.com$/.test(c)));

  // Clear module in-memory landing URL by simulating production browser reset (no env)
  clearTrackingState();
  assert.equal(getCapturedLandingUrlWithFbclid(), null);
});

test('server Parameter Builder builds fbc/fbp with appendices from Referer or client overrides and emits cookies', () => {
  const req = new Request('https://eduexpressint.com/api/leads', {
    method: 'POST',
    headers: {
      host: 'eduexpressint.com',
      referer: 'https://eduexpressint.com/study-in-china?fbclid=IwAR_SERVER_REFERER_999',
      'x-forwarded-proto': 'https',
    },
  });

  const built = buildServerMetaParams(req);
  assert.match(built.fbc ?? '', /^fb\.1\.\d+\.IwAR_SERVER_REFERER_999\.[A-Za-z0-9+/=_-]+$/);
  assert.match(built.fbp ?? '', /^fb\.1\.\d+\.\d+\.[A-Za-z0-9+/=_-]+$/);
  assert.equal(built.eventSourceUrl, 'https://eduexpressint.com/study-in-china?fbclid=IwAR_SERVER_REFERER_999');
  assert.ok(built.cookiesToSet.some((c) => c.name === '_fbp' && c.value === built.fbp));
  assert.ok(built.cookiesToSet.some((c) => c.name === '_fbc' && c.value === built.fbc));

  // Client override recovery when HTTP Cookie header lacked _fbc/_fbp
  const reqNoCookies = new Request('https://eduexpressint.com/api/contact', {
    method: 'POST',
    headers: {
      'x-forwarded-host': 'www.eduexpressint.com',
      'x-forwarded-proto': 'https',
    },
  });
  const overrides = extractMetaParamOverridesFromBody({
    metaFbc: 'fb.1.1700000000000.IwAR_CLIENT_OVERRIDE',
    metaFbp: 'fb.1.1700000000000.987654321',
    metaExternalId: 'ee_consent_1234',
    metaEventSourceUrl: 'https://www.eduexpressint.com/contact',
  });
  const rebuilt = buildServerMetaParams(reqNoCookies, overrides);
  assert.ok(rebuilt.fbc?.startsWith('fb.1.1700000000000.IwAR_CLIENT_OVERRIDE'));
  assert.ok(rebuilt.fbp?.startsWith('fb.1.1700000000000.987654321'));
  assert.equal(rebuilt.externalId, 'ee_consent_1234');
  assert.ok(rebuilt.cookiesToSet.some((c) => c.name === '_fbp'));
  assert.ok(rebuilt.cookiesToSet.some((c) => c.name === '_fbc'));

  const response = applyMetaParamCookies(
    NextResponse.json({ ok: true }),
    reqNoCookies,
    rebuilt.cookiesToSet,
  );
  const setCookieHeader = response.headers.getSetCookie();
  assert.ok(
    setCookieHeader.some(
      (c) =>
        c.startsWith('_fbp=') &&
        c.toLowerCase().includes('samesite=lax') &&
        c.includes('Domain=eduexpressint.com') &&
        c.includes('Secure'),
    ),
  );
  assert.ok(setCookieHeader.some((c) => c.startsWith('_fbc=') && !c.includes('HttpOnly')));
});

test('server Parameter Builder sanitizes malicious values, resists Host spoofing, and preserves Bangladeshi SHA-256 phone hashes', () => {
  assert.equal(sanitizeMetaParamValue('fb.1.1700.abc;bad=1'), undefined);
  assert.equal(sanitizeMetaParamValue('not_a_meta_cookie'), undefined);
  assert.equal(sanitizeMetaParamValue('fb.1.1700000000000.IwAR1234.AQQCAQMC'), 'fb.1.1700000000000.IwAR1234.AQQCAQMC');

  const spoofedReq = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: {
      host: 'evil-attacker.example',
      'x-forwarded-host': 'evil-attacker.example',
      'x-forwarded-for': '203.0.113.55',
    },
  });

  const built = buildServerMetaParams(spoofedReq);
  const res = applyMetaParamCookies(NextResponse.json({ ok: true }), spoofedReq, built.cookiesToSet);
  const cookies = res.headers.getSetCookie();
  for (const cookie of cookies) {
    assert.equal(cookie.toLowerCase().includes('evil-attacker'), false);
    assert.equal(cookie.toLowerCase().includes('domain=eduexpressint.com'), false);
  }

  const expectedBdSha = crypto.createHash('sha256').update('8801712345678').digest('hex');
  const hashedBdPhone = built.hashPii('8801712345678', PII_DATA_TYPE.PHONE);
  assert.ok(hashedBdPhone?.startsWith(`${expectedBdSha}.`));
});

test('client Parameter Builder gates strictly on analytics consent and generates _fbp/_fbc in-browser', async () => {
  const prevWindow = globalThis.window;
  const prevSelf = globalThis.self;
  const prevDocument = globalThis.document;
  const prevLocalStorage = globalThis.localStorage;

  const store = new Map();
  let cookieJar = {};
  const mockLocalStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
  const mockDocument = {
    domain: 'eduexpressint.com',
    referrer: '',
    get cookie() {
      return Object.entries(cookieJar)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');
    },
    set cookie(assignment) {
      const str = String(assignment);
      // Simulate browser Public Suffix List rejection of bare TLD cookies like domain=.com
      if (/;\s*domain=\.[^.;]+(?:;|$)/i.test(str)) {
        return;
      }
      const [pair] = str.split(';');
      const eq = pair.indexOf('=');
      if (eq > 0) {
        const k = pair.slice(0, eq).trim();
        const v = pair.slice(eq + 1).trim();
        if (str.includes('max-age=0')) {
          delete cookieJar[k];
        } else {
          cookieJar[k] = v;
        }
      }
    },
  };
  const mockWindow = {
    location: new URL('https://eduexpressint.com/contact'),
    localStorage: mockLocalStorage,
    document: mockDocument,
    navigator: { vendor: '', userAgent: 'Mozilla/5.0' },
  };

  try {
    globalThis.window = mockWindow;
    globalThis.self = mockWindow;
    globalThis.document = mockDocument;
    globalThis.localStorage = mockLocalStorage;

    // 1) Landing on an ad URL BEFORE consent is granted captures fbclid in memory with zero cookies
    captureLandingFbclid('https://eduexpressint.com/study-in-china?fbclid=IwAR_PRECONSENT_CLIENT');
    const withoutConsent = await getConsentedSubmissionMetaParams(300);
    assert.deepEqual(withoutConsent, {});
    assert.deepEqual(cookieJar, {});

    // 2) After navigating to /contact and accepting consent, ParamBuilder populates _fbp and _fbc
    mockLocalStorage.setItem('cookie-consent', 'accepted');
    const collected = await ensureClientMetaParams();
    assert.match(collected.fbp ?? '', /^fb\.\d+\.\d+\./);
    assert.match(collected.fbc ?? '', /^fb\.\d+\.\d+\.IwAR_PRECONSENT_CLIENT/);

    const withConsent = await getConsentedSubmissionMetaParams(300);
    assert.equal(withConsent.metaFbp, collected.fbp);
    assert.equal(withConsent.metaFbc, collected.fbc);
    assert.ok(
      typeof withConsent.metaExternalId === 'string' && withConsent.metaExternalId.length >= 8,
    );
    assert.equal(withConsent.metaExternalId, cookieJar.ee_uid);
    assert.equal(withConsent.metaEventSourceUrl, 'https://eduexpressint.com/contact');

    // 3) Rejecting consent wipes in-memory cache and cookies
    mockLocalStorage.setItem('cookie-consent', 'rejected');
    clearTrackingState();
    const afterReject = await getConsentedSubmissionMetaParams(300);
    assert.deepEqual(afterReject, {});
  } finally {
    globalThis.window = prevWindow;
    globalThis.self = prevSelf;
    globalThis.document = prevDocument;
    globalThis.localStorage = prevLocalStorage;
    clearTrackingState();
  }
});

test('all lead/contact forms and CAPI routes wire Parameter Builder without M-5 regressions', () => {
  const formFiles = [
    'src/components/lead/HomeLeadForm.tsx',
    'src/components/home/HomeAssessment.tsx',
    'src/components/home/DecisionLab.tsx',
    'src/components/assessment/EducationFitAssessment.tsx',
    'src/components/universities/UniversityEnquiryForm.tsx',
    'src/components/campaigns/March2027LeadForm.tsx',
    'src/components/china/ChinaPillarLeadForm.tsx',
    'src/components/EnhancedContactForm.tsx',
    'src/components/china/ChinaCampaignLeadForm.tsx',
    'src/components/PartnershipForm.tsx',
  ];
  for (const file of formFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.match(content, /getConsentedSubmissionMetaParams/, `${file} must attach consented Meta parameters`);
  }

  for (const routeFile of [
    'src/app/api/leads/route.ts',
    'src/app/api/contact/route.ts',
    'src/app/api/partnership/route.ts',
    'src/app/api/meta-capi/route.ts',
    'src/app/api/meta-conversion/route.ts',
  ]) {
    const content = fs.readFileSync(routeFile, 'utf8');
    assert.match(content, /buildServerMetaParams/, `${routeFile} must run server Parameter Builder`);
    assert.match(content, /applyMetaParamCookies/, `${routeFile} must attach Set-Cookie headers cleanly`);
  }

  for (const cleanFile of [
    'src/components/MetaPixel.tsx',
    'src/lib/meta-param-builder-client.ts',
  ]) {
    const content = fs.readFileSync(cleanFile, 'utf8');
    assert.equal(/\bdocument\.cookie\s*=/.test(content), false, `${cleanFile} must not write document.cookie directly`);
  }
});

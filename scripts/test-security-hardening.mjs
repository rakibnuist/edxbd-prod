import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire, register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { encryptSecret, decryptSecret, isEncryptedSecret } = await import('../src/lib/secret-box.ts');
const { generateToken, verifyToken, isAdminRole } = await import('../src/lib/auth.ts');
const {
  extractSanitizedClientIp,
  normalizeFlatRecord,
  normalizeSafeHttpUrl,
  normalizeStringList,
  validateAdminLeadCreate,
  validateAdminPartnershipCreate,
  validateAdminPartnershipUpdate,
  validateLeadAssessmentInput,
} = await import('../src/lib/payload-validation.ts');
const {
  toSafeExternalUrl,
  toSafeExternalUrlList,
  toSafeSitePathOrUrl,
} = await import('../src/lib/safe-url.ts');
const { toContentData, validateContentUrls } = await import('../src/lib/content-serialize.ts');

const require = createRequire(import.meta.url);
const {
  normalizeAndValidateEmail,
  validateAdminPassword,
  parseSeedArgs,
} = require('./seed-admin.js');

test('C-1: login route never auto-provisions admin accounts from env vars', () => {
  const loginSource = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
  assert.doesNotMatch(loginSource, /ADMIN_PASSWORD/);
  assert.doesNotMatch(loginSource, /ADMIN_EMAIL/);
  assert.doesNotMatch(loginSource, /prisma\.user\.create/);
  assert.match(loginSource, /DUMMY_BCRYPT_HASH/);
});

test('C-1: docker-compose runtime does not pass ADMIN_PASSWORD to app container', () => {
  const compose = fs.readFileSync('docker-compose.yml', 'utf8');
  assert.doesNotMatch(compose, /ADMIN_PASSWORD/);
  assert.doesNotMatch(compose, /ADMIN_EMAIL/);
});

test('C-1: seed-admin CLI rejects weak, short, or predictable brand passwords', () => {
  for (const weak of ['short1!A', 'alllowercase1234', 'EduExpressTest@2026', 'MyPassword!2026', 'Admin123456789!']) {
    assert.throws(() => validateAdminPassword(weak), /Password/);
  }
  assert.doesNotThrow(() => validateAdminPassword('K9#vQ2!mLp7$zRx4@'));
  assert.doesNotThrow(() => validateAdminPassword('correct horse battery 2026'));
  assert.equal(normalizeAndValidateEmail('  Admin@EduExpressInt.com '), 'admin@eduexpressint.com');
  assert.throws(() => normalizeAndValidateEmail('not-an-email'), /valid admin email/);
  assert.deepEqual(
    parseSeedArgs(['--email=staff@eduexpressint.com', '--super-admin']),
    { email: 'staff@eduexpressint.com', name: process.env.ADMIN_NAME || 'Admin', role: 'super_admin' }
  );
});

test('C-2: secret-box encrypts, decrypts, rejects tampered envelopes, and reads legacy plaintext', () => {
  const prevJwt = process.env.JWT_SECRET;
  const prevSettingsKey = process.env.SETTINGS_ENCRYPTION_KEY;
  try {
    process.env.SETTINGS_ENCRYPTION_KEY = 'A'.repeat(48);
    const sample = 'EAAB_test_token_value_12345';
    const sealed = encryptSecret(sample);
    assert.ok(isEncryptedSecret(sealed));
    assert.notEqual(sealed, sample);
    assert.equal(decryptSecret(sealed), sample);

    // Tampering ciphertext / tag returns empty string instead of corrupt token
    const broken = sealed.slice(0, -4) + 'AAAA';
    assert.equal(decryptSecret(broken), '');

    // Wrong key returns empty string
    process.env.SETTINGS_ENCRYPTION_KEY = 'B'.repeat(48);
    assert.equal(decryptSecret(sealed), '');

    // Legacy plaintext rows remain readable until next save
    assert.equal(decryptSecret('legacy-plaintext-value'), 'legacy-plaintext-value');
    assert.equal(encryptSecret('   '), '');
  } finally {
    if (prevJwt === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevJwt;
    if (prevSettingsKey === undefined) delete process.env.SETTINGS_ENCRYPTION_KEY;
    else process.env.SETTINGS_ENCRYPTION_KEY = prevSettingsKey;
  }
});

test('C-2: settings.ts encrypts secrets on write and decrypts on read/resolveMetaConfig', () => {
  const settingsSource = fs.readFileSync('src/lib/settings.ts', 'utf8');
  assert.match(settingsSource, /ENCRYPTED_SETTING_KEYS\s*=\s*new Set<SettingKey>\(\['metaAccessToken'\]\)/);
  assert.match(settingsSource, /decryptSecret\(r\.value\)/);
  assert.match(settingsSource, /encryptSecret\(stringValue\)/);
  assert.match(settingsSource, /decryptSecret\(settings\.metaAccessToken\)/);
});

test('H-1: verifyToken preserves super_admin role and rejects non-admin or malformed payloads', () => {
  const prevSecret = process.env.JWT_SECRET;
  try {
    process.env.JWT_SECRET = 'C'.repeat(48);
    const superToken = generateToken({ userId: 'u1', email: 'super@example.test', role: 'super_admin' });
    const adminToken = generateToken({ userId: 'u2', email: 'admin@example.test', role: 'admin' });

    assert.equal(verifyToken(superToken)?.role, 'super_admin');
    assert.equal(verifyToken(adminToken)?.role, 'admin');
    assert.equal(isAdminRole('super_admin'), true);
    assert.equal(isAdminRole('admin'), true);
    assert.equal(isAdminRole('user'), false);
  } finally {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  }
});

test('H-1: admin user route normalizes email prior to findUnique lookup', () => {
  const usersRoute = fs.readFileSync('src/app/api/admin/users/route.ts', 'utf8');
  const normIdx = usersRoute.indexOf('const normalizedEmail = email.toLowerCase().trim()');
  const lookupIdx = usersRoute.indexOf('prisma.user.findUnique({ where: { email: normalizedEmail } })');
  assert.ok(normIdx > 0 && lookupIdx > normIdx);
});

test('H-2: admin lead & partnership validators reject mass assignment, bad URLs, and protected fields', () => {
  const leadRes = validateAdminLeadCreate({
    name: 'Test Student',
    email: 'Student@Example.com',
    phone: '+8801712345678',
    country: 'China',
    id: 'override-id',
    adTrackingConsent: true,
    extraField: 'ignored',
  });
  assert.ok(leadRes.data);
  assert.equal(leadRes.data.email, 'student@example.com');
  assert.equal('id' in leadRes.data, false);
  assert.equal('adTrackingConsent' in leadRes.data, false);
  assert.equal('extraField' in leadRes.data, false);

  const badUpdate = validateAdminPartnershipUpdate({ status: 'approved', ipAddress: '1.2.3.4' });
  assert.ok(badUpdate.error);

  const badUrl = validateAdminPartnershipUpdate({ website: 'javascript:alert(1)' });
  assert.ok(badUrl.error);

  const goodUpdate = validateAdminPartnershipUpdate({ status: 'approved', website: 'https://partner.example.com' });
  assert.deepEqual(goodUpdate.data, { status: 'approved', website: 'https://partner.example.com/' });

  const created = validateAdminPartnershipCreate({
    companyName: 'Global Edu',
    contactPerson: 'Jane Doe',
    email: 'Partner@Example.org',
    phone: '+8801911111111',
  });
  assert.equal(created.data?.source, 'admin_created');
  assert.equal(created.data?.email, 'partner@example.org');
});

test('H-2: public lead & partnership validators sanitize lists, objects, URLs, and client IPs', () => {
  assert.ok(normalizeSafeHttpUrl('javascript:alert(1)').error);
  assert.equal(normalizeSafeHttpUrl('  ').url, undefined);
  assert.ok(normalizeStringList([123], 'targetCountries').error);
  assert.equal(normalizeFlatRecord({ facebook: 'https://fb.com/x' }, 'social').json, '{"facebook":"https://fb.com/x"}');

  const assessOk = validateLeadAssessmentInput({
    destinationInterest: 'china',
    assessment: { academicLevel: 'HSC', preferredCountries: ['China', 'Malaysia'] },
  });
  assert.equal(assessOk.error, undefined);
  assert.equal(assessOk.assessment.preferredCountriesJson, '["China","Malaysia"]');

  const assessBad = validateLeadAssessmentInput({
    assessment: { academicLevel: { nested: 'object' } },
  });
  assert.ok(assessBad.error);

  const ip = extractSanitizedClientIp((name) =>
    name === 'x-forwarded-for' ? '203.0.113.5, 10.0.0.1' : null
  );
  assert.equal(ip, '203.0.113.5');
  assert.equal(extractSanitizedClientIp(() => 'not an ip header!'), 'unknown');
});

test('H-3: safe-url allowlists only http/https external URLs and safe site paths', () => {
  for (const dangerous of [
    'javascript:alert(1)',
    '  JaVaScRiPt:alert(document.cookie)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'ftp://files.example.com/a',
    '//evil.example/phish',
    '/\\evil.example/phish',
    'internal-research',
    '/relative-only-for-external',
    'https://user:pass@example.com/phish',
    '',
    null,
    123,
  ]) {
    assert.equal(toSafeExternalUrl(dangerous), null, `expected rejection for ${String(dangerous)}`);
  }

  assert.equal(toSafeExternalUrl(' https://www.nuist.edu.cn/en '), 'https://www.nuist.edu.cn/en');
  assert.equal(toSafeExternalUrl('http://gjy.nuist.edu.cn/info'), 'http://gjy.nuist.edu.cn/info');

  assert.equal(toSafeSitePathOrUrl('/uploads/doc.webp'), '/uploads/doc.webp');
  assert.equal(toSafeSitePathOrUrl('//evil.example/a.png'), null);
  assert.equal(toSafeSitePathOrUrl('/\\evil.example/a.png'), null);
  assert.equal(toSafeSitePathOrUrl('javascript:alert(1)'), null);
  assert.equal(toSafeSitePathOrUrl('https://cdn.example.com/a.webp'), 'https://cdn.example.com/a.webp');

  assert.deepEqual(
    toSafeExternalUrlList(['javascript:alert(1)', 'https://csc.edu.cn', '//evil.com', 'https://csc.edu.cn']),
    ['https://csc.edu.cn/'],
  );
});

test('H-3: content serialization and admin/public UI components enforce safe URLs', () => {
  assert.ok(validateContentUrls({ sourceUrls: ['javascript:alert(1)'] }));
  assert.ok(validateContentUrls({ featuredImage: '//evil.com/x.png' }));
  assert.equal(validateContentUrls({ sourceUrls: ['https://www.csc.edu.cn/'], featuredImage: '/logo.png' }), null);

  const sanitizedContent = toContentData({
    title: 'Update',
    slug: 'update-1',
    author: 'Desk',
    content: '<p>Safe</p>',
    sourceUrls: ['javascript:alert(1)', 'https://www.csc.edu.cn/'],
    featuredImage: 'javascript:alert(1)',
  });
  assert.equal(sanitizedContent.sourceUrls, '["https://www.csc.edu.cn/"]');
  assert.equal(sanitizedContent.featuredImage, null);

  for (const componentPath of [
    'src/app/admin/partnerships/page.tsx',
    'src/components/universities/UniversityProfileClient.tsx',
    'src/components/universities/UniversityRankings.tsx',
    'src/components/finders/ProgramFinder.tsx',
    'src/components/finders/ScholarshipFinder.tsx',
    'src/components/finders/CostCompare.tsx',
    'src/app/updates/[slug]/UpdateClient.tsx',
    'src/components/universities/UniversityResearch.tsx',
    'src/components/china/ChinaResearch.tsx',
    'src/components/china/ChinaGuidePage.tsx',
    'src/app/mbbs-in-china-bangladesh/page.tsx',
    'src/app/[slug]/page.tsx',
  ]) {
    const src = fs.readFileSync(componentPath, 'utf8');
    assert.match(src, /toSafeExternalUrl/, `${componentPath} must import and apply toSafeExternalUrl`);
  }
});

test('H-4: verifyToken pins HS256 and enforces positive integer tokenVersion', async () => {
  const jwt = require('jsonwebtoken');
  const { generateToken, verifyToken } = await import('../src/lib/auth.ts');
  const prevSecret = process.env.JWT_SECRET;
  const secret = prevSecret || 'test-jwt-secret-that-is-long-enough-for-hs256-32bytes';
  process.env.JWT_SECRET = secret;

  try {
    const validToken = generateToken({
      userId: 'user-1',
      email: 'admin@eduexpressint.com',
      role: 'admin',
      tokenVersion: 3,
    });
    const rawDecoded = jwt.verify(validToken, secret, { algorithms: ['HS256'] });
    assert.equal(rawDecoded.tokenVersion, 3);

    const verified = verifyToken(validToken);
    assert.equal(verified?.userId, 'user-1');
    assert.equal(verified?.email, 'admin@eduexpressint.com');
    assert.equal(verified?.role, 'admin');
    assert.equal(verified?.tokenVersion, 3);

    const defaultVersionToken = generateToken({
      userId: 'user-2',
      email: 'super@eduexpressint.com',
      role: 'super_admin',
    });
    assert.equal(verifyToken(defaultVersionToken)?.tokenVersion, 1);

    const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const noneToken = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({
      userId: 'user-1',
      email: 'admin@eduexpressint.com',
      role: 'admin',
      tokenVersion: 1,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })}.`;
    assert.equal(verifyToken(noneToken), null);

    const hs384Token = jwt.sign(
      { userId: 'user-1', email: 'admin@eduexpressint.com', role: 'admin', tokenVersion: 1 },
      secret,
      { algorithm: 'HS384', expiresIn: '1h' },
    );
    assert.equal(verifyToken(hs384Token), null);

    const missingVersionToken = jwt.sign(
      { userId: 'user-1', email: 'admin@eduexpressint.com', role: 'admin' },
      secret,
      { algorithm: 'HS256', expiresIn: '1h' },
    );
    assert.equal(verifyToken(missingVersionToken), null);

    for (const badVersion of [0, -1, 1.5, '1', null]) {
      const badToken = jwt.sign(
        { userId: 'user-1', email: 'admin@eduexpressint.com', role: 'admin', tokenVersion: badVersion },
        secret,
        { algorithm: 'HS256', expiresIn: '1h' },
      );
      assert.equal(verifyToken(badToken), null, `expected rejection for tokenVersion=${String(badVersion)}`);
    }
  } finally {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  }
});

test('H-4: session revocation and live DB tokenVersion checks are enforced across auth and admin APIs', () => {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  assert.match(schema, /tokenVersion\s+Int\s+@default\(1\)/);

  const authSource = fs.readFileSync('src/lib/auth.ts', 'utf8');
  assert.match(authSource, /algorithm:\s*'HS256'/);
  assert.match(authSource, /algorithms:\s*\['HS256'\]/);

  const authUserSource = fs.readFileSync('src/lib/auth-user.ts', 'utf8');
  assert.match(authUserSource, /tokenVersion:\s*true/);
  assert.match(authUserSource, /user\.tokenVersion\s*!==\s*decoded\.tokenVersion/);

  const loginSource = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
  assert.match(loginSource, /tokenVersion:\s*user\.tokenVersion/);

  const logoutSource = fs.readFileSync('src/app/api/auth/logout/route.ts', 'utf8');
  assert.match(logoutSource, /tokenVersion:\s*\{\s*increment:\s*1\s*\}/);

  const adminUsersIdSource = fs.readFileSync('src/app/api/admin/users/[id]/route.ts', 'utf8');
  assert.match(adminUsersIdSource, /tokenVersion\s*=\s*\{\s*increment:\s*1\s*\}/);

  const guardedRoutes = [
    'src/app/api/auth/me/route.ts',
    'src/app/api/upload/route.ts',
    'src/app/api/indexnow/route.ts',
    'src/app/api/meta-status/route.ts',
    'src/app/api/meta-conversion/route.ts',
    'src/app/api/meta-capi/route.ts',
    'src/app/api/analytics/performance/route.ts',
    'src/app/api/admin/dashboard/route.ts',
    'src/app/api/admin/settings/route.ts',
    'src/app/api/admin/trust/route.ts',
    'src/app/api/admin/leads/route.ts',
    'src/app/api/admin/leads/[id]/route.ts',
    'src/app/api/admin/leads/[id]/portal/route.ts',
    'src/app/api/admin/kpi/route.ts',
    'src/app/api/admin/kpi/[empId]/route.ts',
    'src/app/api/admin/employees/route.ts',
    'src/app/api/admin/attendance/route.ts',
    'src/app/api/admin/daily-logs/route.ts',
    'src/app/api/admin/tasks/route.ts',
    'src/app/api/admin/partnerships/route.ts',
    'src/app/api/admin/partnerships/[id]/route.ts',
    'src/app/api/admin/content/route.ts',
    'src/app/api/admin/content/[id]/route.ts',
    'src/app/api/admin/universities/route.ts',
    'src/app/api/admin/universities/[id]/route.ts',
    'src/app/api/admin/countries/route.ts',
    'src/app/api/admin/countries/[id]/route.ts',
    'src/app/api/admin/testimonials/route.ts',
    'src/app/api/admin/testimonials/[id]/route.ts',
    'src/app/api/admin/users/route.ts',
    'src/app/api/admin/users/[id]/route.ts',
  ];

  for (const routePath of guardedRoutes) {
    const src = fs.readFileSync(routePath, 'utf8');
    assert.match(src, /verifyLiveAdminUser/, `${routePath} must enforce verifyLiveAdminUser`);
    assert.doesNotMatch(src, /\bisAdminRequest\b/, `${routePath} must not use stateless isAdminRequest`);
    assert.doesNotMatch(src, /\bverifyTokenFromRequest\b/, `${routePath} must not use stateless verifyTokenFromRequest`);
  }
});

test('M-1: proxy redirect never reflects untrusted Host headers or allows open redirects', async () => {
  const { normalizeHostHeader, resolveProxyRedirect } = await import('../src/lib/proxy-redirect.ts');

  assert.equal(normalizeHostHeader('eduexpressint.com@evil.com'), '');
  assert.equal(normalizeHostHeader('localhost, evil.com'), '');
  assert.equal(normalizeHostHeader('[::1]:3000'), '::1');
  assert.equal(normalizeHostHeader('::1'), '::1');
  assert.equal(normalizeHostHeader('EDUEXPRESSINT.COM.:443'), 'eduexpressint.com');
  assert.equal(normalizeHostHeader('EDUEXPRESSINT.COM:443.'), '');

  for (const badHost of [
    'evil.example',
    'evil.example:8443',
    'eduexpressint.com@evil.example',
    'localhost@evil.example',
    'localhost.evil.example',
    '127.0.0.1.evil.example',
    '',
    null,
  ]) {
    const target = resolveProxyRedirect({
      hostHeader: badHost,
      forwardedProtoHeader: 'http',
      pathname: '/login',
      search: '?next=/admin',
    });
    assert.equal(target, 'https://eduexpressint.com/login?next=/admin', `Host=${String(badHost)} must redirect only to canonical origin`);
  }

  for (const trickyPath of ['//evil.example/phish', '/\\evil.example/phish', '///evil.example']) {
    const target = resolveProxyRedirect({
      hostHeader: 'eduexpressint.com',
      forwardedProtoHeader: 'HTTP, https',
      pathname: trickyPath,
      search: '?a=1',
    });
    assert.ok(target);
    assert.equal(new URL(target).origin, 'https://eduexpressint.com');
    assert.equal(target, 'https://eduexpressint.com/evil.example/phish?a=1'.replace('/phish', trickyPath.includes('/phish') ? '/phish' : ''));
  }

  for (const legacyHost of ['www.eduexpressint.com', 'eduexpress.info', 'www.eduexpress.info', 'preview.vercel.app']) {
    const target = resolveProxyRedirect({
      hostHeader: legacyHost,
      forwardedProtoHeader: 'https',
      pathname: '/study-in-china-from-bangladesh',
      search: '?intake=september',
    });
    assert.equal(target, 'https://eduexpressint.com/study-in-china-from-bangladesh?intake=september');
  }

  assert.equal(
    resolveProxyRedirect({
      hostHeader: 'eduexpressint.com',
      forwardedProtoHeader: 'https',
      pathname: '/',
      search: '',
    }),
    null,
  );
  assert.equal(
    resolveProxyRedirect({
      hostHeader: 'notvercel.app',
      forwardedProtoHeader: 'https',
      pathname: '/',
      search: '',
    }),
    null,
  );
  assert.equal(
    resolveProxyRedirect({
      hostHeader: 'a1b2c3d4:3000',
      forwardedProtoHeader: 'https',
      pathname: '/universities',
      search: '',
    }),
    null,
  );
  for (const localHost of ['localhost:3000', '127.0.0.1:3000', '[::1]:3000', '::1', 'portal.localhost:3000']) {
    assert.equal(
      resolveProxyRedirect({
        hostHeader: localHost,
        forwardedProtoHeader: 'http',
        pathname: '/',
        search: '',
      }),
      null,
      `local host ${localHost} must not redirect`,
    );
  }

  const proxySource = fs.readFileSync('src/proxy.ts', 'utf8');
  assert.match(proxySource, /resolveProxyRedirect/);
  assert.doesNotMatch(proxySource, /`https:\/\/\$\{/);
});

test('M-2: client-ip prevents leftmost XFF and unconfigured CF header spoofing', async () => {
  const { extractClientIp, parseValidatedIp } = await import('../src/lib/client-ip.ts');

  assert.equal(parseValidatedIp('999.999.999.999'), null);
  assert.equal(parseValidatedIp('1.2.3.4; drop table'), null);
  assert.equal(parseValidatedIp('203.0.113.9:54321'), '203.0.113.9');
  assert.equal(parseValidatedIp('[2001:db8::1]:443'), '2001:db8::1');

  // Spoofed leftmost XFF entry is ignored when a downstream proxy appends real client IP
  assert.equal(
    extractClientIp((name) => (name === 'x-forwarded-for' ? '1.2.3.4, 203.0.113.99' : null)),
    '203.0.113.99',
  );
  // Private/loopback proxy hops on the right are skipped to find the external client
  assert.equal(
    extractClientIp((name) => (name === 'x-forwarded-for' ? '1.2.3.4, 203.0.113.5, 172.18.0.2, ::ffff:192.168.1.5' : null)),
    '203.0.113.5',
  );
  // Untrusted CF-Connecting-IP cannot override Traefik X-Real-IP unless opted in
  const spoofCfHeaders = { 'cf-connecting-ip': '9.9.9.9', 'x-real-ip': '203.0.113.10' };
  assert.equal(
    extractClientIp((name) => spoofCfHeaders[name] ?? null, { trustCfConnectingIp: false }),
    '203.0.113.10',
  );
  assert.equal(
    extractClientIp((name) => spoofCfHeaders[name] ?? null, { trustCfConnectingIp: true }),
    '9.9.9.9',
  );

  for (const ipConsumer of ['src/lib/meta-conversion-api.ts', 'src/app/api/meta-capi/route.ts']) {
    const src = fs.readFileSync(ipConsumer, 'utf8');
    assert.match(src, /extractClientIp/);
  }
});

test('M-2: rate limiter isolates policies, preserves locked buckets under floods, and persists to SQLite', async () => {
  const { checkRateLimit, clearInMemoryRateLimits } = await import('../src/lib/rate-limit-core.ts');
  const prismaModule = await import('../src/lib/prisma.ts');
  const prisma = prismaModule.default;

  const makeReq = (ip) => new Request('https://eduexpressint.com/api/auth/login', { headers: { 'x-real-ip': ip } });

  clearInMemoryRateLimits();
  const baseNow = Date.now();
  const memPolicy = {
    name: 'admin-login',
    maxRequests: 5,
    windowMs: 60_000,
    persistent: false,
    protectActiveBuckets: true,
  };

  for (let i = 0; i < 5; i += 1) {
    const res = await checkRateLimit(makeReq('198.51.100.10'), memPolicy, { now: baseNow + i, maxBucketsPerPolicy: 4 });
    assert.equal(res.allowed, true);
  }
  assert.equal(
    (await checkRateLimit(makeReq('198.51.100.10'), memPolicy, { now: baseNow + 10, maxBucketsPerPolicy: 4 })).allowed,
    false,
  );

  // Flood both unrelated policies and unlocked admin-login attempts past maxBucketsPerPolicy=4
  for (let i = 1; i <= 10; i += 1) {
    await checkRateLimit(makeReq(`198.51.100.${100 + i}`), memPolicy, { now: baseNow + 20 + i, maxBucketsPerPolicy: 4 });
    await checkRateLimit(
      makeReq(`192.0.2.${i}`),
      { name: 'lead-form', maxRequests: 10, windowMs: 60_000, persistent: false },
      { now: baseNow + 20 + i, maxBucketsPerPolicy: 4 },
    );
  }

  // Locked IP must still be blocked
  const afterFlood = await checkRateLimit(makeReq('198.51.100.10'), memPolicy, { now: baseNow + 50, maxBucketsPerPolicy: 4 });
  assert.equal(afterFlood.allowed, false);
  clearInMemoryRateLimits();

  // Persistent SQLite enforcement across simulated restarts
  const persistPolicyName = `test-m2-persist-${Date.now()}`;
  const persistPolicy = { name: persistPolicyName, maxRequests: 3, windowMs: 60_000, persistent: true };
  try {
    for (let i = 0; i < 3; i += 1) {
      const res = await checkRateLimit(makeReq('203.0.113.77'), persistPolicy, { now: baseNow + i });
      assert.equal(res.allowed, true);
      assert.equal(res.remaining, 2 - i);
    }

    clearInMemoryRateLimits();
    const blocked = await checkRateLimit(makeReq('203.0.113.77'), persistPolicy, { now: baseNow + 1000 });
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);

    const dbCount = await prisma.rateLimitBucket.count({ where: { policy: persistPolicyName } });
    assert.equal(dbCount, 1);

    // Resets cleanly after window expires
    const afterExpiry = await checkRateLimit(makeReq('203.0.113.77'), persistPolicy, { now: baseNow + 60_001 });
    assert.equal(afterExpiry.allowed, true);
    assert.equal(afterExpiry.remaining, 2);
  } finally {
    await prisma.rateLimitBucket.deleteMany({ where: { policy: persistPolicyName } });
  }
});

test('M-3: security headers configure CSP, Permissions-Policy, Referrer-Policy and explicit image hosts', async () => {
  const {
    buildContentSecurityPolicy,
    buildGlobalSecurityHeaders,
    IMAGE_REMOTE_PATTERNS,
  } = await import('../src/lib/security-headers.ts');

  const prodCsp = buildContentSecurityPolicy({ isProduction: true });
  assert.match(prodCsp, /\bdefault-src 'self'/);
  assert.match(prodCsp, /\bobject-src 'none'/);
  assert.match(prodCsp, /\bframe-ancestors 'none'/);
  assert.match(prodCsp, /\bbase-uri 'self'/);
  assert.match(prodCsp, /\bform-action 'self'/);
  assert.match(prodCsp, /\bupgrade-insecure-requests\b/);
  assert.doesNotMatch(prodCsp, /'unsafe-eval'/);
  assert.match(prodCsp, /https:\/\/connect\.facebook\.net/);
  assert.match(prodCsp, /https:\/\/\*\.analytics\.google\.com/);
  assert.match(prodCsp, /frame-src[^;]*https:\/\/www\.facebook\.com/);
  assert.match(prodCsp, /https:\/\/www\.googletagmanager\.com/);

  const devCsp = buildContentSecurityPolicy({ isProduction: false });
  assert.match(devCsp, /'unsafe-eval'/);
  assert.doesNotMatch(devCsp, /upgrade-insecure-requests/);

  const globalHeaders = Object.fromEntries(
    buildGlobalSecurityHeaders({ isProduction: true }).map((entry) => [entry.key, entry.value]),
  );
  assert.equal(globalHeaders['X-Frame-Options'], 'DENY');
  assert.equal(globalHeaders['X-Content-Type-Options'], 'nosniff');
  assert.equal(globalHeaders['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.match(globalHeaders['Permissions-Policy'], /camera=\(\)/);
  assert.match(globalHeaders['Permissions-Policy'], /microphone=\(\)/);
  assert.match(globalHeaders['Permissions-Policy'], /geolocation=\(\)/);
  assert.equal(globalHeaders['Content-Security-Policy'], prodCsp);

  for (const pattern of IMAGE_REMOTE_PATTERNS) {
    assert.notEqual(pattern.hostname, '**');
    assert.notEqual(pattern.hostname, '*');
  }

  const nextConfigSource = fs.readFileSync('next.config.ts', 'utf8');
  assert.match(nextConfigSource, /buildGlobalSecurityHeaders/);
  assert.match(nextConfigSource, /IMAGE_REMOTE_PATTERNS/);
  assert.doesNotMatch(nextConfigSource, /hostname:\s*['"]\*\*['"]/);
});

test('M-3: meta-conversion and meta-capi enforce strict origin allowlists', async () => {
  const { classifyRequestOrigin, resolveAllowedOriginHosts } = await import('../src/lib/meta-capi-policy.ts');

  assert.deepEqual(resolveAllowedOriginHosts('evil.example'), ['eduexpressint.com', 'www.eduexpressint.com']);
  assert.ok(resolveAllowedOriginHosts('localhost:3000').includes('localhost:3000'));

  assert.equal(
    classifyRequestOrigin(
      new Headers({ origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }),
      resolveAllowedOriginHosts('evil.example'),
    ),
    'cross-site',
  );
  assert.equal(
    classifyRequestOrigin(
      new Headers({ origin: 'https://eduexpressint.com', 'sec-fetch-site': 'same-origin' }),
      resolveAllowedOriginHosts('eduexpressint.com'),
    ),
    'same-origin',
  );

  for (const routeFile of ['src/app/api/meta-conversion/route.ts', 'src/app/api/meta-capi/route.ts']) {
    const src = fs.readFileSync(routeFile, 'utf8');
    assert.match(src, /classifyRequestOrigin/);
    assert.match(src, /resolveAllowedOriginHosts/);
    assert.match(src, /origin === 'cross-site'/);
    assert.match(src, /origin === 'unknown'/);
  }
});

test('M-4: revalidation uses a dedicated secret and client-shared modules omit server secrets', async () => {
  const { isAuthorizedRevalidateSecret } = await import('../src/lib/revalidate-secret.ts');
  const jwtSecret = 'jwt-signing-secret-that-is-over-32-characters-long';
  const revalSecret = 'independent-revalidate-secret-over-32-characters-long';

  assert.equal(isAuthorizedRevalidateSecret(jwtSecret, { JWT_SECRET: jwtSecret }), false);
  assert.equal(
    isAuthorizedRevalidateSecret(jwtSecret, { REVALIDATE_SECRET: jwtSecret, JWT_SECRET: jwtSecret }),
    false,
  );
  assert.equal(
    isAuthorizedRevalidateSecret('too-short-secret', { REVALIDATE_SECRET: 'too-short-secret', JWT_SECRET: jwtSecret }),
    false,
  );
  assert.equal(
    isAuthorizedRevalidateSecret('wrong-secret-of-different-or-same-length-123456', {
      REVALIDATE_SECRET: revalSecret,
      JWT_SECRET: jwtSecret,
    }),
    false,
  );
  assert.equal(
    isAuthorizedRevalidateSecret(revalSecret, { REVALIDATE_SECRET: revalSecret, JWT_SECRET: jwtSecret }),
    true,
  );

  const revalidateSrc = fs.readFileSync('src/app/api/revalidate/route.ts', 'utf8');
  assert.doesNotMatch(revalidateSrc, /JWT_SECRET/);
  assert.match(revalidateSrc, /isAuthorizedRevalidateSecret/);

  const warmSrc = fs.readFileSync('docker-warm-cache.mjs', 'utf8');
  assert.doesNotMatch(warmSrc, /JWT_SECRET/);
  assert.match(warmSrc, /REVALIDATE_SECRET/);

  const entrypointSrc = fs.readFileSync('docker-entrypoint.sh', 'utf8');
  assert.match(entrypointSrc, /export REVALIDATE_SECRET=/);

  for (const sharedPath of ['src/lib/analytics.ts', 'src/lib/config.ts']) {
    const src = fs.readFileSync(sharedPath, 'utf8');
    assert.doesNotMatch(src, /META_ACCESS_TOKEN/);
  }
});

test('M-5: tracking persistence omits raw PII, enforces consent, and adds Secure cookies on HTTPS', async () => {
  const {
    buildMetaAdvancedMatching,
    buildTrackingCookieString,
    clearTrackingState,
    getConsentedExternalId,
    getOrCreateConsentedExternalId,
    isAnalyticsConsentAccepted,
    persistTrackingLeadId,
    setTrackingCookie,
  } = await import('../src/lib/tracking-consent.ts');

  const makeStorage = (initial = {}) => {
    const map = new Map(Object.entries(initial));
    return {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => map.set(k, String(v)),
      removeItem: (k) => map.delete(k),
      dump: () => Object.fromEntries(map.entries()),
    };
  };

  const makeDoc = (initialCookie = '') => {
    const writes = [];
    return {
      writes,
      doc: {
        _cookie: initialCookie,
        get cookie() {
          return this._cookie;
        },
        set cookie(val) {
          writes.push(val);
          this._cookie = val;
        },
      },
    };
  };

  // Unconsented state: blocks persistence, blocks cookies/IDs, and scrubs legacy PII.
  {
    const localStorage = makeStorage({
      'cookie-consent': 'declined',
      user_email: 'student@example.com',
      user_phone: '+8801700000000',
      user_id: 'legacy_lead',
    });
    const sessionStorage = makeStorage();
    const { doc, writes } = makeDoc();
    const env = { localStorage, sessionStorage, document: doc, location: { protocol: 'https:' } };

    assert.equal(isAnalyticsConsentAccepted(env), false);
    assert.equal(persistTrackingLeadId('lead_123', env), false);
    assert.equal(setTrackingCookie('_fbc', 'fb.1.123.abc', 90 * 86400, env), false);
    assert.equal(getConsentedExternalId(env), undefined);
    assert.equal(getOrCreateConsentedExternalId(env), undefined);
    assert.deepEqual(buildMetaAdvancedMatching(env), {});
    assert.equal(writes.length, 0);
    assert.equal(localStorage.getItem('user_email'), null);
    assert.equal(localStorage.getItem('user_phone'), null);
  }

  // Consented HTTPS state: allows opaque lead ID only (no raw email/phone) + Secure cookies.
  {
    const localStorage = makeStorage({
      'cookie-consent': 'accepted',
      user_email: 'stale@example.com',
      user_phone: '01700000000',
    });
    const sessionStorage = makeStorage();
    const { doc, writes } = makeDoc();
    const env = { localStorage, sessionStorage, document: doc, location: { protocol: 'https:' } };

    assert.equal(isAnalyticsConsentAccepted(env), true);
    assert.equal(persistTrackingLeadId('lead_xyz', env), true);
    assert.equal(localStorage.getItem('user_id'), 'lead_xyz');
    assert.equal(localStorage.getItem('user_email'), null);
    assert.equal(localStorage.getItem('user_phone'), null);
    assert.equal(writes.length, 1);
    assert.match(writes[0], /^ee_uid=lead_xyz;path=\/;max-age=31536000;SameSite=Lax;Secure$/);

    assert.equal(setTrackingCookie('_fbc', 'fb.1.1700000000.test', 90 * 86400, env), true);
    assert.match(writes[1], /^_fbc=fb\.1\.1700000000\.test;path=\/;max-age=7776000;SameSite=Lax;Secure$/);

    assert.deepEqual(buildMetaAdvancedMatching(env), { external_id: 'lead_xyz' });

    clearTrackingState(env);
    assert.equal(localStorage.getItem('user_id'), null);
    assert.equal(sessionStorage.getItem('temp_user_id'), null);
    assert.ok(writes.some((w) => w.startsWith('ee_uid=;path=/;max-age=0;SameSite=Lax;Secure')));
    assert.ok(writes.some((w) => w.startsWith('_fbc=;path=/;max-age=0;SameSite=Lax;Secure')));
  }

  // HTTP localhost omits Secure while HTTPS includes Secure.
  assert.doesNotMatch(buildTrackingCookieString('ee_uid', 'v1', 60, false), /;Secure/);
  assert.match(buildTrackingCookieString('ee_uid', 'v1', 60, true), /;Secure$/);

  for (const formPath of [
    'src/components/lead/HomeLeadForm.tsx',
    'src/components/EnhancedContactForm.tsx',
  ]) {
    const src = fs.readFileSync(formPath, 'utf8');
    assert.doesNotMatch(src, /user_email|user_phone/);
    assert.match(src, /persistTrackingLeadId/);
  }

  const pixelSrc = fs.readFileSync('src/components/MetaPixel.tsx', 'utf8');
  assert.doesNotMatch(pixelSrc, /user_email|user_phone/);
  assert.match(pixelSrc, /buildMetaAdvancedMatching/);
  assert.match(pixelSrc, /clearTrackingState/);

  const qualitySrc = fs.readFileSync('src/lib/meta-event-quality.ts', 'utf8');
  assert.doesNotMatch(qualitySrc, /document\.cookie\s*=/);
  assert.match(qualitySrc, /setTrackingCookie/);
  assert.match(qualitySrc, /isAnalyticsConsentAccepted/);
});

test('M-6: errors use opaque correlation IDs, endpoint list & data: img URIs are removed, and server-dev.js is gone', async () => {
  const { logAndFormatServerError } = await import('../src/lib/api-error.ts');
  const { sanitizeUpdateHtml } = await import('../src/lib/content-html.ts');

  const originalError = console.error;
  const logged = [];
  console.error = (...args) => logged.push(args);
  try {
    const payload = logAndFormatServerError('TestContext', new Error('SQLITE_CANTOPEN /secret/path'), 'Generic error');
    assert.equal(payload.error, 'Generic error');
    assert.match(payload.errorId, /^err_[0-9a-f]{12}$/);
    assert.equal('details' in payload, false);
    assert.doesNotMatch(JSON.stringify(payload), /SQLITE_CANTOPEN|secret\/path/);
    assert.equal(logged.length, 1);
    assert.match(String(logged[0][0]), new RegExp(payload.errorId));
  } finally {
    console.error = originalError;
  }

  for (const routeFile of [
    'src/app/api/admin/dashboard/route.ts',
    'src/app/api/indexnow/route.ts',
    'src/app/api/admin/content/route.ts',
    'src/lib/api-utils.ts',
  ]) {
    const src = fs.readFileSync(routeFile, 'utf8');
    assert.match(src, /logAndFormatServerError/);
    assert.doesNotMatch(src, /error instanceof Error \? error\.message/);
  }

  const dashboardSrc = fs.readFileSync('src/app/api/admin/dashboard/route.ts', 'utf8');
  assert.doesNotMatch(dashboardSrc, /connection_error|database_error|details:/);

  const errorRouteSrc = fs.readFileSync('src/app/api/error.ts', 'utf8');
  assert.doesNotMatch(errorRouteSrc, /availableEndpoints|\/api\/admin\/\*/);

  assert.equal(
    sanitizeUpdateHtml('<img src="data:image/svg+xml;base64,PHN2Zz4=" alt="x" /><img src="/uploads/a.png" alt="ok" />'),
    '<img alt="x" /><img src="/uploads/a.png" alt="ok" />',
  );

  assert.equal(fs.existsSync('server-dev.js'), false);
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal('local:dev' in (pkg.scripts || {}), false);

  const rootServerSrc = fs.readFileSync('server.js', 'utf8');
  assert.doesNotMatch(rootServerSrc, /Access-Control-Allow-Origin/);
  assert.match(rootServerSrc, /path\.sep/);
  assert.match(rootServerSrc, /escapeHtml/);
});

test('L-1: container config uses local build context, persistent uploads volume, healthcheck, and least privilege', () => {
  const composeSrc = fs.readFileSync('docker-compose.yml', 'utf8');
  assert.doesNotMatch(composeSrc, /github\.com\/.*\.git#main/);
  assert.match(composeSrc, /context:\s*\./);
  assert.match(composeSrc, /uploads_data:\/app\/public\/uploads/);
  assert.match(composeSrc, /cap_drop:\s*\n\s*-\s*ALL/);
  assert.match(composeSrc, /no-new-privileges:true/);
  assert.match(composeSrc, /pids_limit:\s*\d+/);
  assert.match(composeSrc, /limits:\s*\n\s*cpus:/);
  assert.match(composeSrc, /\/api\/health/);

  const dockerfileSrc = fs.readFileSync('Dockerfile', 'utf8');
  assert.match(dockerfileSrc, /chown -R nextjs:nodejs \/app\/prisma \/app\/public\/uploads/);
  assert.match(dockerfileSrc, /USER nextjs/);
  assert.match(dockerfileSrc, /HEALTHCHECK .*\/api\/health/s);
});

test('L-2: JWT_SECRET required in all environments, bounded pagination, and dead code removed', async () => {
  const authSrc = fs.readFileSync('src/lib/auth.ts', 'utf8');
  assert.doesNotMatch(authSrc, /DEV_SECRET|dev-only-insecure-secret/);
  assert.doesNotMatch(authSrc, /NODE_ENV === ['"]production['"]/);

  const { generateToken, verifyToken } = await import('../src/lib/auth.ts');
  const prevSecret = process.env.JWT_SECRET;
  const prevNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;
    assert.throws(
      () => generateToken({ userId: 'user-1', email: 'admin@example.com', role: 'admin' }),
      /JWT_SECRET/,
    );
    assert.equal(verifyToken('header.payload.signature'), null);

    process.env.JWT_SECRET = 'short-secret';
    assert.throws(
      () => generateToken({ userId: 'user-1', email: 'admin@example.com', role: 'admin' }),
      /JWT_SECRET/,
    );
    assert.equal(verifyToken('header.payload.signature'), null);

    process.env.JWT_SECRET = 'a'.repeat(32);
    const token = generateToken({ userId: 'user-1', email: 'admin@example.com', role: 'admin' });
    assert.equal(verifyToken(token)?.email, 'admin@example.com');
  } finally {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
    if (prevNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNodeEnv;
  }

  const { parsePagination } = await import('../src/lib/pagination.ts');
  assert.deepEqual(parsePagination(null, null), { page: 1, limit: 10, skip: 0 });
  assert.deepEqual(
    parsePagination('-5', '9999999', { defaultLimit: 10, maxLimit: 50 }),
    { page: 1, limit: 50, skip: 0 },
  );
  assert.deepEqual(
    parsePagination('0', '0', { defaultLimit: 20, maxLimit: 100 }),
    { page: 1, limit: 1, skip: 0 },
  );
  assert.deepEqual(
    parsePagination('invalid', 'NaN', { defaultLimit: 20, maxLimit: 100 }),
    { page: 1, limit: 20, skip: 0 },
  );
  assert.deepEqual(
    parsePagination('3', '25', { defaultLimit: 10, maxLimit: 100 }),
    { page: 3, limit: 25, skip: 50 },
  );

  for (const filePath of [
    'src/app/api/admin/partnerships/route.ts',
    'src/app/api/admin/universities/route.ts',
    'src/app/api/updates/route.ts',
    'src/lib/api-utils.ts',
  ]) {
    assert.match(fs.readFileSync(filePath, 'utf8'), /parsePagination/);
  }
  assert.match(
    fs.readFileSync('src/app/api/updates/route.ts', 'utf8'),
    /Math\.max\(1,\s*Math\.ceil\(totalCount \/ clampedLimit\)\)/,
  );

  assert.equal(fs.existsSync('src/components/EnhancedAnalytics.tsx'), false);
  assert.equal(fs.existsSync('src/types/html2pdf.d.ts'), false);
  assert.doesNotMatch(fs.readFileSync('src/lib/meta-event-quality.ts', 'utf8'), /debugMetaParameters/);

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(pkg.dependencies.dompurify, undefined);
  assert.equal(pkg.dependencies['html2pdf.js'], undefined);
});

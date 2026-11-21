import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEmbedSecurityHeaders,
  buildGlobalSecurityHeaders,
} from './security-headers.ts';

test('global security headers lock down framing while embed headers allow iframe embedding with noindex, follow', () => {
  const globalHeaders = buildGlobalSecurityHeaders({ isProduction: true });
  const globalMap = Object.fromEntries(globalHeaders.map((h) => [h.key, h.value]));

  assert.equal(globalMap['X-Frame-Options'], 'DENY');
  assert.match(globalMap['Content-Security-Policy'], /frame-ancestors 'none'/);

  const embedHeaders = buildEmbedSecurityHeaders({ isProduction: true });
  const embedMap = Object.fromEntries(embedHeaders.map((h) => [h.key, h.value]));

  assert.equal(embedMap['X-Frame-Options'], undefined);
  assert.equal(embedMap['X-Robots-Tag'], 'noindex, follow');
  assert.match(embedMap['Content-Security-Policy'], /frame-ancestors \*/);
});

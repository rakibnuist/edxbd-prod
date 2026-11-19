import assert from 'node:assert/strict';
import { register } from 'node:module';
import test from 'node:test';

register(new URL('../../scripts/lib/typescript-source-resolver.mjs', import.meta.url));

const { syncLeadToCrm } = await import('./crm-sync.ts');

test('syncLeadToCrm returns false when secret is missing', async () => {
  const origSecret = process.env.CRM_WEBHOOK_SECRET;
  const origWebSecret = process.env.WEBSITE_WEBHOOK_SECRET;
  delete process.env.CRM_WEBHOOK_SECRET;
  delete process.env.WEBSITE_WEBHOOK_SECRET;

  try {
    const ok = await syncLeadToCrm({
      name: 'Test Student',
      phone: '+8801700000000',
    });
    assert.equal(ok, false);
  } finally {
    if (origSecret) process.env.CRM_WEBHOOK_SECRET = origSecret;
    if (origWebSecret) process.env.WEBSITE_WEBHOOK_SECRET = origWebSecret;
  }
});

test('syncLeadToCrm formats payload and sends secret header to configured endpoint', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedHeaders = {};
  let capturedBody = {};

  process.env.CRM_WEBHOOK_URL = 'https://crm.example.com/api/webhook/website-lead';
  process.env.CRM_WEBHOOK_SECRET = 'test-secret-123';

  globalThis.fetch = async (url, options) => {
    capturedUrl = String(url);
    capturedHeaders = options.headers;
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true, lead_id: 'TEST1234' }),
    };
  };

  try {
    const ok = await syncLeadToCrm({
      name: 'Rahim Uddin',
      phone: '+8801812345678',
      email: 'rahim@example.com',
      destination: 'China',
      program: 'Bachelor in Computer Science',
      source: 'china_study_landing',
      gpa: 4.85,
      last_education: 'HSC',
    });

    assert.equal(ok, true);
    assert.equal(capturedUrl, 'https://crm.example.com/api/webhook/website-lead');
    assert.equal(capturedHeaders['x-webhook-secret'], 'test-secret-123');
    assert.equal(capturedHeaders['Content-Type'], 'application/json');
    assert.equal(capturedBody.name, 'Rahim Uddin');
    assert.equal(capturedBody.phone, '+8801812345678');
    assert.equal(capturedBody.destination, 'China');
    assert.equal(capturedBody.gpa, 4.85);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.CRM_WEBHOOK_URL;
    delete process.env.CRM_WEBHOOK_SECRET;
  }
});

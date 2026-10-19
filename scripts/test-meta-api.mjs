import test from 'node:test';
import assert from 'node:assert/strict';
import { META_API_VERSION, metaFingerprint, verifyMetaDataset, sendMetaEvents } from '../src/lib/meta-api.ts';
const config = { pixelId: '1234567890123456', accessToken: 'test-only-secret' };
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
test('missing credentials do not call Meta or pretend to be connected', async () => {
  const noNetwork = () => { throw new Error('Must not call Meta'); };
  assert.equal((await verifyMetaDataset({ pixelId: config.pixelId, accessToken: null }, noNetwork)).ok, false);
  assert.equal((await sendMetaEvents({ pixelId: null, accessToken: null }, [{}], noNetwork)).ok, false);
});
test('dataset check uses a supported API with secrets only in the authorization header', async () => {
  const result = await verifyMetaDataset(config, async (url, options) => {
    assert.ok(url.includes(`/${META_API_VERSION}/`)); assert.ok(!url.includes(config.accessToken));
    assert.equal(options.headers.Authorization, `Bearer ${config.accessToken}`); assert.equal(options.method, undefined);
    return response({ id: config.pixelId });
  });
  assert.equal(result.ok, true);
});
test('wrong dataset, expired token and permission rejection stay disconnected', async () => {
  assert.equal((await verifyMetaDataset(config, async () => response({ id: 'wrong' }))).ok, false);
  const rejected = await verifyMetaDataset(config, async () => response({ error: { code: 190, message: 'secret' } }, 400));
  assert.equal(rejected.ok, false); assert.ok(rejected.message.includes('expired')); assert.ok(!rejected.message.includes('secret'));
});
test('only positive Meta acknowledgements count as delivered', async () => {
  assert.equal((await sendMetaEvents(config, [{}], async () => response({ events_received: 1 }))).ok, true);
  for (const result of [{ events_received: 0 }, { events_received: '1' }, {}]) assert.equal((await sendMetaEvents(config, [{}], async () => response(result))).ok, false);
});
test('delivery preserves event IDs for deduplication and keeps tokens out of bodies', async () => {
  const event = { event_name: 'Lead', event_id: 'deduplicate-me' };
  await sendMetaEvents(config, [event], async (url, options) => {
    assert.deepEqual(JSON.parse(options.body), { data: [event] }); assert.ok(!options.body.includes(config.accessToken));
    return response({ events_received: 1 });
  });
});
test('network errors are explicit and never reflect private error text', async () => {
  const fail = async () => { throw new Error('private token or personal data'); };
  const checked = await verifyMetaDataset(config, fail); const sent = await sendMetaEvents(config, [{}], fail);
  assert.equal(checked.ok, false); assert.equal(sent.ok, false); assert.ok(!JSON.stringify({ checked, sent }).includes('personal data'));
});
test('credential changes invalidate earlier connection evidence', () => {
  assert.notEqual(metaFingerprint(config), metaFingerprint({ ...config, accessToken: 'replacement' }));
  assert.notEqual(metaFingerprint(config), metaFingerprint({ ...config, pixelId: '9999999999999999' }));
});

import prisma from '@/lib/prisma';
import { resolveMetaConfig } from '@/lib/settings';
import { META_API_VERSION, metaFingerprint, type MetaCheck, type MetaCredentials, type MetaDelivery } from '@/lib/meta-api';

type Connection = MetaCheck & { fingerprint: string };
type Delivery = { fingerprint: string; attemptedAt: string; acceptedAt?: string; eventsReceived: number; error?: string };
function parse<T>(value?: string): T | null { try { return value ? JSON.parse(value) as T : null; } catch { return null; } }
export async function recordMetaConnection(config: MetaCredentials, check: MetaCheck) {
  const value = JSON.stringify({ ...check, fingerprint: metaFingerprint(config) });
  await prisma.setting.upsert({ where: { key: 'metaConnectionCheck' }, create: { key: 'metaConnectionCheck', value }, update: { value } });
}
export async function recordMetaDelivery(config: MetaCredentials, result: MetaDelivery) {
  // Diagnostics must never prevent a student enquiry from being saved.
  try {
    const previous = await prisma.setting.findUnique({ where: { key: 'metaDeliveryHealth' } });
    const prior = parse<Delivery>(previous?.value);
    const fingerprint = metaFingerprint(config);
    const attemptedAt = new Date().toISOString();
    const value = JSON.stringify({ fingerprint, attemptedAt, eventsReceived: result.eventsReceived,
      acceptedAt: result.ok ? attemptedAt : prior?.fingerprint === fingerprint ? prior.acceptedAt : undefined,
      error: result.ok ? undefined : result.error });
    await prisma.setting.upsert({ where: { key: 'metaDeliveryHealth' }, create: { key: 'metaDeliveryHealth', value }, update: { value } });
  } catch { console.warn('Meta delivery diagnostics could not be recorded.'); }
}
export async function getMetaHealth() {
  // A database outage must surface as unavailable, not as an empty token.
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map(row => [row.key, row.value]));
  const config = resolveMetaConfig(settings);
  const fingerprint = metaFingerprint(config);
  const rawConnection = parse<Connection>(settings.metaConnectionCheck);
  const rawDelivery = parse<Delivery>(settings.metaDeliveryHealth);
  const connection = rawConnection?.fingerprint === fingerprint ? rawConnection : null;
  const delivery = rawDelivery?.fingerprint === fingerprint ? rawDelivery : null;
  const state = !config.pixelId ? 'missing_pixel' : !config.accessToken ? 'missing_token'
    : delivery?.error ? 'attention' : delivery?.acceptedAt ? 'active'
      : connection?.ok ? 'connected' : connection ? 'attention' : 'configured';
  const message = !config.pixelId ? 'Save the website’s Pixel / dataset ID in Settings.'
    : !config.accessToken ? 'The Conversions API access token is missing. Add it in Settings to enable server-side delivery.'
      : state === 'active' ? 'Meta accepted a server event from these credentials. Continue monitoring delivery in Meta Events Manager.'
        : delivery?.error || connection?.message || 'Credentials are saved. Check the dataset connection to verify access.';
  return {
    pixelId: config.pixelId, pixelActive: Boolean(config.pixelId), accessTokenConfigured: Boolean(config.accessToken),
    conversionApiActive: state === 'active' || state === 'connected', state, message,
    lastCheckedAt: connection?.checkedAt || null, lastAcceptedAt: delivery?.acceptedAt || null,
    lastBatchEvents: delivery?.eventsReceived ?? null, apiVersion: META_API_VERSION,
  };
}
export type MetaHealth = Awaited<ReturnType<typeof getMetaHealth>>;

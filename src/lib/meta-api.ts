import { createHash } from 'node:crypto';

// Kept aligned with Meta's official Node Business SDK (26.0.2).
export const META_API_VERSION = 'v26.0';
export type MetaCredentials = { pixelId: string | null; accessToken: string | null };
export type MetaCheck = { ok: boolean; message: string; checkedAt: string };
export type MetaDelivery = { ok: boolean; eventsReceived: number; error?: string };
export function metaFingerprint(config: MetaCredentials) {
  return createHash('sha256').update(`${config.pixelId || ''}:${config.accessToken || ''}`).digest('hex');
}
function metaFailure(code?: number) {
  if (code === 190) return 'Meta rejected the access token. Replace an expired or invalid token in Settings.';
  if (code === 10 || code === 200) return 'The token does not have permission for this dataset. Check its assigned data source in Meta.';
  if (code === 100) return 'Meta could not access this dataset. Check the Pixel / dataset ID and token permissions.';
  return 'Meta did not accept the request. Check the dataset and token permissions, then retry.';
}
export async function verifyMetaDataset(config: MetaCredentials, request: typeof fetch = fetch): Promise<MetaCheck> {
  const checkedAt = new Date().toISOString();
  if (!config.pixelId || !config.accessToken) return { ok: false, checkedAt, message: 'Save the Pixel / dataset ID and access token in Settings first.' };
  try {
    const response = await request(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(config.pixelId)}?fields=id`, {
      headers: { Authorization: `Bearer ${config.accessToken}` }, cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok || result.error || String(result.id) !== config.pixelId) return { ok: false, checkedAt, message: metaFailure(result.error?.code) };
    return { ok: true, checkedAt, message: 'Dataset connection verified. This check does not send a conversion event.' };
  } catch {
    return { ok: false, checkedAt, message: 'The server could not reach Meta. Please retry the connection check.' };
  }
}
export async function sendMetaEvents(config: MetaCredentials, events: unknown[], request: typeof fetch = fetch): Promise<MetaDelivery> {
  if (!config.pixelId || !config.accessToken) return { ok: false, eventsReceived: 0, error: 'Meta access token or Pixel / dataset ID is missing.' };
  try {
    const response = await request(`https://graph.facebook.com/${META_API_VERSION}/${encodeURIComponent(config.pixelId)}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.accessToken}` },
      body: JSON.stringify({ data: events }), signal: AbortSignal.timeout(10000), cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok || result.error) return { ok: false, eventsReceived: 0, error: metaFailure(result.error?.code) };
    const received = result.events_received;
    if (!Number.isInteger(received) || received < 1) return { ok: false, eventsReceived: 0, error: 'Meta returned no accepted events for this request.' };
    return { ok: true, eventsReceived: received };
  } catch {
    return { ok: false, eventsReceived: 0, error: 'The server could not deliver the event to Meta. Please check the connection.' };
  }
}

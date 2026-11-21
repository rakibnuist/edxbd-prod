#!/usr/bin/env node
/**
 * Daily cron runner invoked inside `edxbd_web` (or locally) to trigger
 * `/api/cron/gbp-posts`. The server itself enforces `enabled`, `cadenceDays`
 * (7 or 15 days), and queue rotation without leaking secrets in logs.
 *
 * Flags:
 *   --force    Publish next queued post immediately (bypass 7/15-day timer)
 *   --dry-run  Return next due payload without publishing
 */
const args = process.argv.slice(2);
const argSet = new Set(args);
const force = argSet.has('--force');
const dryRun = argSet.has('--dry-run');
const channelArg = args.find((a) => a.startsWith('--channel='))?.split('=')[1] || 'both';

const baseUrl = (process.env.GBP_CRON_BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const secret = (
  process.env.GBP_CRON_SECRET ||
  process.env.REVALIDATE_SECRET ||
  process.env.SCHOLARSHIP_WEBHOOK_SECRET ||
  ''
).trim();

if (!secret) {
  console.error('GBP cron skipped: no GBP_CRON_SECRET / REVALIDATE_SECRET / SCHOLARSHIP_WEBHOOK_SECRET set.');
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/cron/gbp-posts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-cron-secret': secret,
  },
  body: JSON.stringify({
    force,
    dryRun,
    channel: channelArg,
    source: 'vps_cron',
  }),
  signal: AbortSignal.timeout(25_000),
});

const text = await response.text();
let data;
try {
  data = JSON.parse(text);
} catch {
  console.error(`GBP cron unexpected non-JSON response (HTTP ${response.status}): ${text.slice(0, 200)}`);
  process.exit(1);
}

if (!response.ok) {
  console.error(`GBP cron HTTP ${response.status}: ${data.error || 'Unknown error'}`);
  process.exit(1);
}

console.log(
  JSON.stringify({
    executed: Boolean(data.executed),
    dryRun: Boolean(data.dryRun),
    skippedReason: data.skippedReason || null,
    transport: data.transport || null,
    postSlug: data.post?.slug || null,
    externalPostId: data.externalPostId || null,
    linkedinExternalPostId: data.linkedinExternalPostId || null,
    channels: data.channels || null,
    cadenceDays: data.schedule?.cadenceDays || null,
    nextDueAt: data.schedule?.nextDueAt || null,
    error: data.error || null,
  }),
);

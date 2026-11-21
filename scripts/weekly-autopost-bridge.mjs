#!/usr/bin/env node
/**
 * Safe local CLI bridge for the EduExpress Weekly GBP & LinkedIn Auto-Poster.
 * Reads due post status or acknowledges completed publishes against production
 * `/api/cron/gbp-posts` inside `edxbd_web` over SSH without storing secrets locally.
 *
 * Usage:
 *   node scripts/weekly-autopost-bridge.mjs status
 *   node scripts/weekly-autopost-bridge.mjs ack --post-id=<id> --channel=both --gbp-id=<id> --linkedin-id=<urn>
 */
import { execFileSync } from 'node:child_process';

const VPS_HOST = process.env.EDUEXPRESS_VPS_HOST || 'root@147.93.107.210';
const CONTAINER = process.env.EDUEXPRESS_WEB_CONTAINER || 'edxbd_web';

function getFlag(name, fallback = '') {
  const prefix = `--${name}=`;
  const hit = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return hit ? hit.slice(prefix.length).trim() : fallback;
}

function runRemoteNode(scriptSource, envPayload = {}) {
  const b64Script = Buffer.from(scriptSource, 'utf8').toString('base64');
  const b64Payload = Buffer.from(JSON.stringify(envPayload), 'utf8').toString('base64');
  const remoteCmd = `docker exec -e BRIDGE_PAYLOAD_B64=${b64Payload} ${CONTAINER} node --no-warnings -e "eval(Buffer.from('${b64Script}','base64').toString('utf8'))"`;
  const out = execFileSync('ssh', ['-o', 'BatchMode=yes', VPS_HOST, remoteCmd], {
    encoding: 'utf8',
    timeout: 25_000,
  });
  return out.trim();
}

const subcommand = (process.argv[2] || 'status').trim().toLowerCase();

if (subcommand === 'status') {
  const remoteScript = `
    (async () => {
      const secret = (process.env.GBP_CRON_SECRET || process.env.REVALIDATE_SECRET || process.env.SCHOLARSHIP_WEBHOOK_SECRET || '').trim();
      if (!secret) throw new Error('Missing cron secret in container');
      const res = await fetch('http://127.0.0.1:3000/api/cron/gbp-posts', {
        headers: { 'x-cron-secret': secret },
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
      console.log(JSON.stringify({
        enabled: data.enabled,
        linkedinEnabled: data.linkedinEnabled,
        cadenceDays: data.cadenceDays,
        isDue: data.schedule?.isDue ?? false,
        lastRunAt: data.schedule?.lastRunAt ?? null,
        nextDueAt: data.schedule?.nextDueAt ?? null,
        gbpMode: data.mode,
        gbpReadyToPublish: Boolean(data.gbpReadyToPublish ?? data.readyToPublish),
        linkedinMode: data.linkedinMode,
        linkedinReadyToPublish: Boolean(data.linkedinReadyToPublish),
        gbpLocationId: '16688138993497254676',
        linkedinOrganizationId: '30919158',
        nextPost: data.nextPost ? {
          id: data.nextPost.id,
          slug: data.nextPost.slug,
          topicType: data.nextPost.topicType,
          title: data.nextPost.title,
          summary: data.googleLocalPostPayload?.summary || null,
          callToAction: data.googleLocalPostPayload?.callToAction?.actionType || 'LEARN_MORE',
          ctaUrl: data.nextPost.ctaUrl,
          mediaUrl: data.googleLocalPostPayload?.media?.[0]?.sourceUrl || null,
          targetChannels: data.nextPost.targetChannels || 'both',
        } : null,
        linkedinCommentary: data.linkedinCommentary || null,
      }, null, 2));
    })().catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
  `;
  process.stdout.write(runRemoteNode(remoteScript) + '\n');
} else if (subcommand === 'ack') {
  const postId = getFlag('post-id');
  const channel = getFlag('channel', 'both');
  const externalPostId = getFlag('gbp-id') || undefined;
  const linkedinExternalPostId = getFlag('linkedin-id') || undefined;
  if (!postId) {
    console.error('Usage: weekly-autopost-bridge.mjs ack --post-id=<id> [--channel=both|gbp|linkedin] [--gbp-id=<id>] [--linkedin-id=<urn>]');
    process.exit(1);
  }
  const remoteScript = `
    (async () => {
      const payload = JSON.parse(Buffer.from(process.env.BRIDGE_PAYLOAD_B64 || '', 'base64').toString('utf8'));
      const secret = (process.env.GBP_CRON_SECRET || process.env.REVALIDATE_SECRET || process.env.SCHOLARSHIP_WEBHOOK_SECRET || '').trim();
      if (!secret) throw new Error('Missing cron secret in container');
      const res = await fetch('http://127.0.0.1:3000/api/cron/gbp-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': secret },
        body: JSON.stringify({
          action: 'ack',
          postId: payload.postId,
          channel: payload.channel,
          externalPostId: payload.externalPostId,
          linkedinExternalPostId: payload.linkedinExternalPostId,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
      console.log(JSON.stringify(data, null, 2));
    })().catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
  `;
  process.stdout.write(
    runRemoteNode(remoteScript, { postId, channel, externalPostId, linkedinExternalPostId }) + '\n',
  );
} else {
  console.error(`Unknown subcommand "${subcommand}". Use "status" or "ack".`);
  process.exit(1);
}

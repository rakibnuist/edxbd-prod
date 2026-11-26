#!/usr/bin/env node
/**
 * Automated Private Source Monitor (Tier-2 Hidden Source Watcher).
 *
 * Polls due URLs in `InternalSourceWatch`, strips noisy HTML boilerplate, extracts
 * currency/date/policy text + SHA-256 fingerprint, flags changes (`changed_needs_review`)
 * or broken links (`broken_link`), and optionally sends a private Telegram digest to
 * EduExpress admins.
 *
 * Usage:
 *   node scripts/check-hidden-sources.mjs --limit 25
 *   node scripts/check-hidden-sources.mjs --entity country_policy --force --notify
 *   node scripts/check-hidden-sources.mjs --country China --limit 20 --dry-run
 */

import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseArgs(argv) {
  const args = {
    limit: 30,
    entity: '',
    country: '',
    force: false,
    notify: false,
    dryRun: false,
    timeoutMs: 18000,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--limit' && argv[i + 1]) args.limit = Math.max(1, Math.min(500, Number(argv[++i]) || 30));
    else if (a === '--entity' && argv[i + 1]) args.entity = argv[++i].trim();
    else if (a === '--country' && argv[i + 1]) args.country = argv[++i].trim();
    else if (a === '--timeout' && argv[i + 1]) args.timeoutMs = Math.max(3000, Number(argv[++i]) || 12000);
    else if (a === '--force') args.force = true;
    else if (a === '--notify') args.notify = true;
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

function normalizeHtmlToCoreText(rawBody, contentType = '') {
  if (/pdf/i.test(contentType)) {
    return rawBody.slice(0, 60000);
  }
  return rawBody
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<(?:nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/(?:nav|header|footer|aside)>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Extract high-signal lines mentioning currencies, tuition, stipends, living proof, or deadlines
 * so hashing ignores random banner/timestamp jitter.
 */
function extractSignalSnippet(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length >= 10 && l.length <= 260);
  const signalRe =
    /\b(?:CNY|RMB|USD|EUR|GBP|CAD|AUD|NZD|JPY|SEK|NOK|DKK|MYR|PLN|SGD|AED|SAR|INR|THB|tuition|scholarship|stipend|deadline|maintenance|subsistence|blocked\s+account|sperrkonto|living\s+cost|dormitory|accommodation|insurance|2026|2027|2028)\b|[¥€£$]\s*\d/i;
  const matched = lines.filter((l) => signalRe.test(l)).slice(0, 40);
  const chosen = matched.length >= 3 ? matched : lines.slice(0, 25);
  return chosen.join('\n').slice(0, 3500);
}

function summarizeDiff(oldSnippet, newSnippet) {
  const oldSet = new Set((oldSnippet || '').split('\n').map((s) => s.trim()).filter(Boolean));
  const newLines = (newSnippet || '').split('\n').map((s) => s.trim()).filter(Boolean);
  const added = newLines.filter((l) => !oldSet.has(l)).slice(0, 5);
  const removed = [...oldSet].filter((l) => !newLines.includes(l)).slice(0, 5);
  const parts = [];
  if (added.length) parts.push(`+ ${added.join(' | ')}`);
  if (removed.length) parts.push(`- ${removed.join(' | ')}`);
  return parts.join('\n').slice(0, 1200) || 'Content fingerprint changed.';
}

function decryptStoredSecret(stored) {
  if (!stored) return '';
  const trimmed = String(stored).trim();
  if (!trimmed.startsWith('enc:v1:')) return trimmed;
  const parts = trimmed.slice('enc:v1:'.length).split(':');
  if (parts.length !== 3) return '';
  const dedicatedKey = process.env.SETTINGS_ENCRYPTION_KEY?.trim();
  const jwtSecret = process.env.JWT_SECRET?.trim();
  let keyMaterial = 'dev-only-insecure-settings-key-do-not-use-in-production';
  if (dedicatedKey && dedicatedKey.length >= 32) keyMaterial = `edxbd:settings-key:v1:${dedicatedKey}`;
  else if (jwtSecret && jwtSecret.length >= 32) keyMaterial = `edxbd:settings:v1:${jwtSecret}`;
  try {
    const key = crypto.createHash('sha256').update(keyMaterial).digest();
    const iv = Buffer.from(parts[0], 'base64');
    const tag = Buffer.from(parts[1], 'base64');
    const data = Buffer.from(parts[2], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return '';
  }
}

function escapeHtml(text) {
  return String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendTelegramDigest(changedItems, brokenItems) {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ['alert_telegram_bot_token', 'alert_telegram_chat_id'] } },
  });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const botToken = decryptStoredSecret(map.get('alert_telegram_bot_token')) || (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (map.get('alert_telegram_chat_id') || process.env.TELEGRAM_CHAT_ID || '').trim();
  if (!botToken || !chatId) {
    console.log('Telegram credentials not configured; skipping Telegram digest.');
    return;
  }

  const lines = ['🔔 <b>EduExpress Private Source Monitor Digest</b>'];
  if (changedItems.length) {
    lines.push(`\n🟡 <b>Changed Sources (${changedItems.length}):</b>`);
    for (const item of changedItems.slice(0, 12)) {
      lines.push(`• <b>${escapeHtml(item.entityLabel)}</b> (${escapeHtml(item.country || 'Global')}) — <a href="${escapeHtml(item.sourceUrl)}">Check private source</a>`);
    }
  }
  if (brokenItems.length) {
    lines.push(`\n🔴 <b>Broken / Unreachable (${brokenItems.length}):</b>`);
    for (const item of brokenItems.slice(0, 10)) {
      lines.push(`• <b>${escapeHtml(item.entityLabel)}</b> (HTTP ${item.httpStatus ?? 'ERR'})`);
    }
  }
  lines.push('\nReview & approve updates in Admin → Private Source Vault before publishing the next CC BY 4.0 release.');

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(8000),
  });
  console.log(`Telegram digest sent: HTTP ${res.status}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();

  const where = { status: { not: 'paused' } };
  if (args.entity) where.entityType = args.entity;
  if (args.country) where.country = { contains: args.country };

  const allMatching = await prisma.internalSourceWatch.findMany({
    where,
    orderBy: [{ lastCheckedAt: 'asc' }],
  });

  const due = allMatching
    .filter((row) => {
      if (args.force || !row.lastCheckedAt) return true;
      const ageDays = (now.getTime() - new Date(row.lastCheckedAt).getTime()) / (1000 * 60 * 60 * 24);
      return ageDays >= (row.checkIntervalDays || 30);
    })
    .slice(0, args.limit);

  console.log(`Checking ${due.length} private source watches (out of ${allMatching.length} active)...`);

  const changedItems = [];
  const brokenItems = [];
  let unchangedCount = 0;
  let wafProtectedCount = 0;

  for (const watch of due) {
    const headers = {
      'User-Agent': 'EduExpress-Verification-Bot/1.0 (+https://eduexpressint.com/how-we-verify-universities)',
      Accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
    };
    if (watch.etag) headers['If-None-Match'] = watch.etag;
    if (watch.lastModifiedHdr) headers['If-Modified-Since'] = watch.lastModifiedHdr;

    try {
      const res = await fetch(watch.sourceUrl, {
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(args.timeoutMs),
      });

      if (res.status === 304) {
        unchangedCount += 1;
        if (!args.dryRun) {
          await prisma.internalSourceWatch.update({
            where: { id: watch.id },
            data: { lastCheckedAt: now, lastHttpStatus: 304 },
          });
        }
        continue;
      }

      // Government WAF / bot-gated responses (403/412/429) are not dead 404 links;
      // record status cleanly for manual periodic checks without false broken-link spam.
      if (res.status === 403 || res.status === 412 || res.status === 429) {
        wafProtectedCount += 1;
        if (!args.dryRun) {
          await prisma.internalSourceWatch.update({
            where: { id: watch.id },
            data: {
              lastCheckedAt: now,
              lastHttpStatus: res.status,
              status: watch.status === 'broken_link' ? 'active' : watch.status,
              notes: `WAF/bot-protected (HTTP ${res.status}) — automated fetch blocked; verify manually in browser.`,
            },
          });
        }
        continue;
      }

      if (!res.ok) {
        brokenItems.push({ ...watch, httpStatus: res.status });
        if (!args.dryRun) {
          await prisma.internalSourceWatch.update({
            where: { id: watch.id },
            data: {
              lastCheckedAt: now,
              lastHttpStatus: res.status,
              status: 'broken_link',
            },
          });
        }
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      const rawText = await res.text();
      const normalized = normalizeHtmlToCoreText(rawText, contentType);
      const snippet = extractSignalSnippet(normalized);
      const hash = crypto.createHash('sha256').update(snippet || normalized.slice(0, 12000)).digest('hex');

      const hadPrevious = Boolean(watch.lastContentHash);
      const changed = hadPrevious && watch.lastContentHash !== hash;

      if (changed) {
        const diffSummary = summarizeDiff(watch.lastSnippet, snippet);
        changedItems.push({ ...watch, diffSummary });
        if (!args.dryRun) {
          await prisma.internalSourceWatch.update({
            where: { id: watch.id },
            data: {
              lastCheckedAt: now,
              lastChangedAt: now,
              lastHttpStatus: res.status,
              etag: res.headers.get('etag') || watch.etag,
              lastModifiedHdr: res.headers.get('last-modified') || watch.lastModifiedHdr,
              lastContentHash: hash,
              lastSnippet: snippet,
              diffSummary,
              status: 'changed_needs_review',
            },
          });
        }
      } else {
        unchangedCount += 1;
        if (!args.dryRun) {
          await prisma.internalSourceWatch.update({
            where: { id: watch.id },
            data: {
              lastCheckedAt: now,
              lastHttpStatus: res.status,
              etag: res.headers.get('etag') || watch.etag,
              lastModifiedHdr: res.headers.get('last-modified') || watch.lastModifiedHdr,
              lastContentHash: hash,
              lastSnippet: snippet,
              status: watch.status === 'broken_link' ? 'active' : watch.status,
            },
          });
        }
      }
    } catch (err) {
      brokenItems.push({ ...watch, httpStatus: 0, error: err instanceof Error ? err.message : 'Network error' });
      if (!args.dryRun) {
        await prisma.internalSourceWatch.update({
          where: { id: watch.id },
          data: {
            lastCheckedAt: now,
            lastHttpStatus: 0,
            status: 'broken_link',
            notes: `Last fetch error: ${err instanceof Error ? err.message : 'Network error'}`.slice(0, 500),
          },
        });
      }
    }
  }

  console.log(`Done: ${unchangedCount} unchanged/baselined, ${changedItems.length} changed, ${wafProtectedCount} WAF-protected (manual check), ${brokenItems.length} broken/unreachable.`);
  if (args.notify && !args.dryRun && (changedItems.length > 0 || brokenItems.length > 0)) {
    await sendTelegramDigest(changedItems, brokenItems);
  }
}

main()
  .catch((err) => {
    console.error('check-hidden-sources failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

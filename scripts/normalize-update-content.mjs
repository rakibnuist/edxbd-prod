#!/usr/bin/env node
/**
 * One-off migration: normalise stored update/article HTML.
 *
 * - unwraps <!DOCTYPE>/<html>/<head>/<body>
 * - removes <style>, <script>, <meta>, <link>, <title> and embedded iframes/forms
 * - demotes the body's own <h1> to <h2> (the page renders the title H1)
 * - strips inline event handlers, javascript: URLs and inline style attributes
 *
 * Usage:
 *   node --experimental-strip-types scripts/normalize-update-content.mjs --dry-run
 *   node --experimental-strip-types scripts/normalize-update-content.mjs
 *
 * A SQLite backup and a JSON snapshot are written before any update.
 */
import { PrismaClient } from '@prisma/client';
import { sanitizeUpdateHtml } from '../src/lib/content-html.ts';
import fs from 'node:fs';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const prisma = new PrismaClient();
const root = process.cwd();
const stamp = new Date().toISOString().replace(/[:.]/g, '-');

function backupDatabase() {
  const dbPath = path.join(root, 'prisma', 'data', 'edxbd.db');
  if (!fs.existsSync(dbPath)) return null;
  const target = path.join(root, 'prisma', 'data', `edxbd.backup-${stamp}.db`);
  fs.copyFileSync(dbPath, target);
  return target;
}

async function main() {
  const rows = await prisma.content.findMany({
    where: { type: { in: ['update', 'article'] } },
    select: { id: true, slug: true, title: true, content: true },
    orderBy: { createdAt: 'asc' },
  });

  const changes = [];
  for (const row of rows) {
    const clean = sanitizeUpdateHtml(row.content);
    if (clean !== row.content) {
      changes.push({
        id: row.id,
        slug: row.slug,
        before: row.content.length,
        after: clean.length,
        removedDoctype: /<!doctype/i.test(row.content),
        removedStyle: /<style/i.test(row.content),
        removedH1: /<h1/i.test(row.content),
        clean,
      });
    }
  }

  console.log(JSON.stringify({
    dryRun,
    scanned: rows.length,
    changed: changes.length,
    details: changes.map(({ clean, ...meta }) => meta),
  }, null, 2));

  if (dryRun || changes.length === 0) return;

  const dbBackup = backupDatabase();
  const backupDir = path.join(root, 'data', 'research', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const jsonBackup = path.join(backupDir, `update-content-${stamp}.json`);
  fs.writeFileSync(jsonBackup, JSON.stringify(changes.map(({ clean, ...meta }) => meta), null, 2));

  for (const change of changes) {
    await prisma.content.update({ where: { id: change.id }, data: { content: change.clean } });
  }

  console.log(JSON.stringify({ updated: changes.length, dbBackup, jsonBackup }, null, 2));
}

main()
  .catch(error => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

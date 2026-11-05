#!/usr/bin/env node
/**
 * Adds the default OG/Twitter image to page metadata blocks that define
 * openGraph/twitter but no images. Next.js replaces nested metadata objects, so
 * a page-level `openGraph` drops the layout's default image unless it declares
 * one itself.
 *
 * Usage:
 *   node scripts/add-default-og-images.mjs --dry-run
 *   node scripts/add-default-og-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const ROOT = 'src/app';
const IMAGE = `{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }`;

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'page.tsx') files.push(full);
  }
})(ROOT);

function blockEnd(text, braceIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = braceIndex; i < text.length; i += 1) {
    const char = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue; }
    if (char === '/' && text[i + 1] === '/') { const nl = text.indexOf('\n', i); i = nl < 0 ? text.length : nl; continue; }
    if (char === '/' && text[i + 1] === '*') { const close = text.indexOf('*/', i + 2); i = close < 0 ? text.length : close + 1; continue; }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function addImage(text, field, snippet) {
  const needle = `${field}: {`;
  let index = 0;
  let changed = false;
  let result = text;
  while (true) {
    const at = result.indexOf(needle, index);
    if (at < 0) break;
    const brace = at + needle.length - 1;
    const end = blockEnd(result, brace);
    if (end < 0) break;
    const block = result.slice(brace, end + 1);
    if (!/\bimages\s*:/.test(block)) {
      result = result.slice(0, brace + 1) + '\n    ' + snippet + result.slice(brace + 1);
      changed = true;
      index = brace + 1 + snippet.length;
    } else {
      index = end + 1;
    }
  }
  return { result, changed };
}

const changes = [];
for (const file of files) {
  if (file.includes('/admin/') || file.endsWith('/login/page.tsx')) continue;
  const original = fs.readFileSync(file, 'utf8');
  if (!original.includes('openGraph: {')) continue;

  let next = original;
  const og = addImage(next, 'openGraph', `images: [${IMAGE}],`);
  next = og.result;
  const tw = addImage(next, 'twitter', `images: ['/og-image.jpg'],`);

  if (next !== original) {
    changes.push({ file, openGraph: og.changed, twitter: tw.changed });
    if (!dryRun) fs.writeFileSync(file, next);
  }
}

console.log(JSON.stringify({ dryRun, scanned: files.length, changed: changes.length, changes }, null, 2));

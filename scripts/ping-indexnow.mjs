#!/usr/bin/env node
/**
 * Repeatable CLI script to submit all live EduExpress International sitemap URLs,
 * /press, open JSON datasets, and /llms.txt to IndexNow (Bing, ChatGPT Search,
 * Yandex, Naver, Seznam, Yep).
 *
 * Usage: node scripts/ping-indexnow.mjs
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';

const BASE_URL = 'https://eduexpressint.com';
const KEY = '9303d37873c94ab5a25637e6d1ad9ece';
const KEY_URL = `${BASE_URL}/${KEY}.txt`;

const SITEMAPS = [
  `${BASE_URL}/sitemap.xml`,
  `${BASE_URL}/sitemaps/pages.xml`,
  `${BASE_URL}/sitemaps/countries.xml`,
  `${BASE_URL}/sitemaps/guides.xml`,
  `${BASE_URL}/sitemaps/universities.xml`,
  `${BASE_URL}/sitemaps/success-stories.xml`,
];

const EXTRA_PRIORITY_URLS = [
  `${BASE_URL}/press`,
  `${BASE_URL}/china-study-report-bangladesh`,
  `${BASE_URL}/china-study-report.json`,
  `${BASE_URL}/bangladesh-study-abroad-market`,
  `${BASE_URL}/bangladesh-study-abroad-market.json`,
  `${BASE_URL}/bn/bangladesh-study-abroad-market`,
  `${BASE_URL}/llms.txt`,
  `${BASE_URL}/llms-full.txt`,
];

const keyFile = execSync(`curl --connect-timeout 15 -m 30 -sSL "${KEY_URL}"`, { encoding: 'utf8' }).trim();
if (keyFile !== KEY) {
  throw new Error(`IndexNow key verification mismatch at ${KEY_URL}: got "${keyFile}"`);
}

const urlSet = new Set(EXTRA_PRIORITY_URLS);
for (const sm of SITEMAPS) {
  const xml = execSync(`curl --connect-timeout 15 -m 30 -sSL "${sm}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  for (const match of xml.matchAll(/<loc>(https:\/\/eduexpressint\.com[^<]*)<\/loc>/g)) {
    if (!match[1].includes('/sitemaps/')) {
      urlSet.add(match[1]);
    }
  }
}

const urlList = [...urlSet];
const payload = JSON.stringify({
  host: 'eduexpressint.com',
  key: KEY,
  keyLocation: KEY_URL,
  urlList,
});

console.log(`Submitting ${urlList.length} verified URLs to IndexNow endpoints...`);
for (const endpoint of ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow']) {
  const tmpFile = '/tmp/edxbd_indexnow_response.txt';
  const status = execSync(
    `curl --connect-timeout 15 -m 45 -sS -o "${tmpFile}" -w "%{http_code}" -X POST "${endpoint}" -H "Content-Type: application/json; charset=utf-8" --data-binary @-`,
    { input: payload, encoding: 'utf8' },
  );
  const body = fs.existsSync(tmpFile) ? fs.readFileSync(tmpFile, 'utf8').trim() : '';
  console.log(`  ${endpoint} -> HTTP ${status}${body ? ` (${body.slice(0, 160)})` : ''}`);
  if (status !== '200' && status !== '202') {
    process.exitCode = 1;
  }
}

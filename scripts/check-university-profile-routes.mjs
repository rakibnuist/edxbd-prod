/** Read-only local preview check; no external network destinations or database writes. */
import { readFile } from 'node:fs/promises';
const audit = JSON.parse(await readFile('data/research/university-content-audit.json', 'utf8'));
const pending = [...audit.universities];
const failures = [];
let passed = 0;
async function worker() {
  while (pending.length) {
    const item = pending.shift();
    try {
      const res = await fetch(`http://127.0.0.1:3000/universities/${encodeURIComponent(item.slug)}`);
      const html = await res.text();
      if (res.status !== 200 || !/<h1\b/.test(html) || !html.includes('Fees &amp; ClearCost') || !html.includes('Documents required') || !html.includes('Get your university plan') || !/<form\b/.test(html)) failures.push({ slug: item.slug, status: res.status, reason: 'Missing profile content' });
      else passed++;
    } catch (error) { failures.push({ slug: item.slug, reason: error.message }); }
  }
}
await Promise.all([worker(), worker(), worker()]);
console.log(JSON.stringify({ checked: audit.universities.length, passed, failures }, null, 2));
if (failures.length) process.exitCode = 1;

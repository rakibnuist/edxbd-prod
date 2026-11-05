// Runs in the background right after the container starts (docker-entrypoint.sh).
// The image is built without a database, so prerendered pages hold empty data.
// Once the server answers: mark every page stale, then request each sitemap
// URL so it re-renders from the live database before visitors arrive.
const port = process.env.PORT || '3000';
// Next binds to $HOSTNAME (Docker sets it to the container id), not always localhost.
const base = `http://${process.env.HOSTNAME || '127.0.0.1'}:${port}`;
// The proxy upgrades plain-HTTP requests on public hosts; this call is internal.
const headers = { 'x-forwarded-proto': 'https' };
const secret = process.env.REVALIDATE_SECRET || process.env.JWT_SECRET || '';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function ready() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(`${base}/api/health`, { headers })).ok) return true;
    } catch {}
    await wait(2000);
  }
  return false;
}

try {
  if (!(await ready())) throw new Error('server did not answer within 2 minutes');
  if (!secret) throw new Error('no REVALIDATE_SECRET or JWT_SECRET set');
  const revalidate = await fetch(`${base}/api/revalidate`, { method: 'POST', headers: { ...headers, 'x-revalidate-secret': secret } });
  if (!revalidate.ok) throw new Error(`revalidate returned ${revalidate.status}`);

  const sitemap = await (await fetch(`${base}/sitemap.xml`, { headers })).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  let fresh = 0;
  for (const path of paths) {
    try {
      if ((await fetch(`${base}${path}`, { headers, redirect: 'manual' })).status < 400) fresh += 1;
    } catch {}
  }
  console.log(`Cache warm-up: ${fresh}/${paths.length} pages re-rendered from the live database.`);
} catch (error) {
  console.warn(`Cache warm-up skipped: ${error instanceof Error ? error.message : error}. Pages refresh within an hour.`);
}

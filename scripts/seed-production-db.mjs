import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

console.log('--- PRODUCTION DATABASE SYNC START ---');
const dbPath = process.env.DATABASE_URL?.replace(/^file:/, '') || 'prisma/data/edxbd.db';
console.log('Target database path:', dbPath);

// 1. Create a timestamped backup before syncing (owner-only mode, retain last 5).
if (fs.existsSync(dbPath)) {
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  fs.mkdirSync(backupDir, { recursive: true, mode: 0o700 });
  fs.chmodSync(backupDir, 0o700);
  const backupPath = path.join(backupDir, `prod-backup-${Date.now()}.db`);
  fs.copyFileSync(dbPath, backupPath);
  fs.chmodSync(backupPath, 0o600);
  const oldBackups = fs
    .readdirSync(backupDir)
    .filter((name) => name.startsWith('prod-backup-') && name.endsWith('.db'))
    .sort()
    .reverse()
    .slice(5);
  for (const stale of oldBackups) {
    fs.rmSync(path.join(backupDir, stale), { force: true });
  }
  console.log(`Backup created at: ${backupPath}`);
}

// 2. Run seed scripts
try {
  console.log('Running import-full-catalog-bundle.mjs...');
  execSync('node scripts/import-full-catalog-bundle.mjs', { stdio: 'inherit' });

  console.log('Running seed-no-csca-universities.mjs...');
  execSync('node scripts/seed-no-csca-universities.mjs', { stdio: 'inherit' });

  console.log('Running seed-wuzhou-university.mjs...');
  execSync('node scripts/seed-wuzhou-university.mjs', { stdio: 'inherit' });

  console.log('Running seed-march-2027-new-universities.mjs...');
  execSync('node scripts/seed-march-2027-new-universities.mjs', { stdio: 'inherit' });

  console.log('Running complete-student-testimonials.mjs...');
  execSync('node scripts/complete-student-testimonials.mjs', { stdio: 'inherit' });

  console.log('Running seed-march-2027-campaign.mjs...');
  execSync('node --experimental-strip-types scripts/seed-march-2027-campaign.mjs', { stdio: 'inherit' });

  console.log('Running seed-trust-records.js...');
  execSync('node scripts/seed-trust-records.js', { stdio: 'inherit' });

  console.log('Running archive-expired-intake-posts.mjs...');
  execSync('node scripts/archive-expired-intake-posts.mjs', { stdio: 'inherit' });

  console.log('Running sync-seo-content-hygiene.mjs...');
  execSync('node scripts/sync-seo-content-hygiene.mjs', { stdio: 'inherit' });

  console.log('Running complete-all-universities-data.mjs...');
  execSync('node scripts/complete-all-universities-data.mjs', { stdio: 'inherit' });

  console.log('Running seed-meta-weblead-campaign.mjs...');
  execSync('node scripts/seed-meta-weblead-campaign.mjs', { stdio: 'inherit' });

  console.log('Running seed-gbp-posts.mjs...');
  execSync('node scripts/seed-gbp-posts.mjs', { stdio: 'inherit' });

  console.log('Running Phase 2 China Batch A backfill (languages + scholarships)...');
  execSync('node scripts/backfill-china-batch-a.mjs', { stdio: 'inherit' });

  console.log('Running Phase 2 China CSC 306-university Waves 1-5...');
  execSync('node scripts/seed-china-csc-batch-b1.mjs', { stdio: 'inherit' });
  execSync('node scripts/seed-china-csc-batch-b2.mjs', { stdio: 'inherit' });
  execSync('node scripts/seed-china-csc-batch-b3.mjs', { stdio: 'inherit' });
  execSync('node scripts/seed-china-csc-batch-b4.mjs', { stdio: 'inherit' });
  execSync('node scripts/seed-china-csc-batch-b5.mjs', { stdio: 'inherit' });

  console.log('Syncing 306/306 CSC-designated flags across China universities...');
  execSync('node scripts/sync-china-csc-flags.mjs', { stdio: 'inherit' });

  console.log('Running Phase 4 active-destination universities expansion (11 non-China destinations)...');
  execSync('node scripts/seed-active-destinations-universities.mjs', { stdio: 'inherit' });

  console.log('Syncing private Tier-2 InternalSourceWatch vault...');
  execSync('node scripts/seed-hidden-sources.mjs', { stdio: 'inherit' });

  console.log('--- PRODUCTION DATABASE SYNC COMPLETED SUCCESSFULLY ---');
} catch (err) {
  console.error('Error during production database sync:', err);
  process.exit(1);
}

import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

console.log('--- PRODUCTION DATABASE SYNC START ---');
const dbPath = process.env.DATABASE_URL?.replace(/^file:/, '') || 'prisma/data/edxbd.db';
console.log('Target database path:', dbPath);

// 1. Create a timestamped backup before syncing
if (fs.existsSync(dbPath)) {
  const backupDir = path.join(path.dirname(dbPath), 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `prod-backup-${Date.now()}.db`);
  fs.copyFileSync(dbPath, backupPath);
  console.log(`Backup created at: ${backupPath}`);
}

// 2. Run seed scripts
try {
  console.log('Running import-full-catalog-bundle.mjs...');
  execSync('node scripts/import-full-catalog-bundle.mjs', { stdio: 'inherit' });

  console.log('Running complete-all-universities-data.mjs...');
  execSync('node scripts/complete-all-universities-data.mjs', { stdio: 'inherit' });

  console.log('Running complete-student-testimonials.mjs...');
  execSync('node scripts/complete-student-testimonials.mjs', { stdio: 'inherit' });

  console.log('Running seed-march-2027-campaign.mjs...');
  execSync('node scripts/seed-march-2027-campaign.mjs', { stdio: 'inherit' });

  console.log('--- PRODUCTION DATABASE SYNC COMPLETED SUCCESSFULLY ---');
} catch (err) {
  console.error('Error during production database sync:', err);
  process.exit(1);
}

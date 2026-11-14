import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = process.cwd();
const bundlePath = path.join(rootDir, 'data/research/full-university-catalog-bundle.json');

const targetDbPath = process.env.DATABASE_URL?.replace(/^file:/, '') || 'prisma/data/edxbd.db';

if (!fs.existsSync(bundlePath)) {
  console.error(`Bundle file not found: ${bundlePath}`);
  process.exit(1);
}

if (!fs.existsSync(targetDbPath)) {
  console.error(`Target database not found: ${targetDbPath}`);
  process.exit(1);
}

console.log(`Importing full catalog bundle into ${targetDbPath}...`);

// Create backup
const backupDir = path.join(path.dirname(targetDbPath), 'backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `prod-backup-pre-bundle-${Date.now()}.db`);
fs.copyFileSync(targetDbPath, backupPath);
console.log(`Backup created at: ${backupPath}`);

const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
const targetDb = new DatabaseSync(targetDbPath);

targetDb.exec('PRAGMA foreign_keys = OFF;');

const tableMap = {
  unis: 'University',
  programs: 'Program',
  fees: 'Fee',
  scholarships: 'Scholarship',
  costPlans: 'CostPlan',
  campaigns: 'IntakeCampaign',
  testimonials: 'Testimonial',
};

for (const [key, tableName] of Object.entries(tableMap)) {
  const rows = bundle[key];
  if (!rows || rows.length === 0) continue;

  targetDb.prepare(`DELETE FROM "${tableName}"`).run();

  const sample = rows[0];
  const columns = Object.keys(sample);
  const placeholders = columns.map(() => '?').join(', ');
  const insertStmt = targetDb.prepare(
    `INSERT INTO "${tableName}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${placeholders})`
  );

  for (const row of rows) {
    const values = columns.map((c) => row[c]);
    insertStmt.run(...values);
  }

  console.log(`✓ Synced ${tableName}: ${rows.length} rows`);
}

targetDb.exec('PRAGMA foreign_keys = ON;');

console.log('\n--- TARGET DB VERIFICATION ---');
for (const table of ['University', 'Program', 'Fee', 'Scholarship', 'IntakeCampaign', 'Testimonial', 'Lead', 'User', 'Setting']) {
  try {
    const count = targetDb.prepare(`SELECT count(*) as c FROM "${table}"`).get().c;
    console.log(`${table}: ${count} rows`);
  } catch (e) {
    console.log(`${table}: error reading (${e.message})`);
  }
}

targetDb.close();
console.log('\nBundle import completed successfully!');

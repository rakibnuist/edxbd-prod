import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const srcPath = process.argv[2] || 'prisma/data/edxbd.db';
const targetPath = process.argv[3];

if (!targetPath) {
  console.error('Usage: node scripts/sync-data-to-db.mjs <srcDb> <targetDb>');
  process.exit(1);
}

if (!fs.existsSync(srcPath)) {
  console.error(`Source db not found: ${srcPath}`);
  process.exit(1);
}

if (!fs.existsSync(targetPath)) {
  console.error(`Target db not found: ${targetPath}`);
  process.exit(1);
}

console.log(`Syncing reference catalog & campaign data from ${srcPath} -> ${targetPath}...`);

const srcDb = new DatabaseSync(srcPath, { readOnly: true });
const targetDb = new DatabaseSync(targetPath);

const SYNC_TABLES = [
  'University',
  'Program',
  'Fee',
  'Scholarship',
  'CostPlan',
  'IntakeCampaign',
  'Testimonial',
  'Country',
  'Office',
  'TeamMember',
  'EvidenceAsset',
  'TrustMetric',
  'ServicePackage',
  'Partnership'
];

targetDb.exec('PRAGMA foreign_keys = OFF;');

for (const table of SYNC_TABLES) {
  const tableExistsInTarget = targetDb.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
  ).get(table);
  
  const tableExistsInSrc = srcDb.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
  ).get(table);

  if (!tableExistsInTarget || !tableExistsInSrc) {
    console.log(`Skipping ${table} (not present in both)`);
    continue;
  }

  const rows = srcDb.prepare(`SELECT * FROM "${table}"`).all();
  if (rows.length === 0) {
    console.log(`No rows in source for ${table}, leaving target as is.`);
    continue;
  }

  targetDb.prepare(`DELETE FROM "${table}"`).run();

  const sample = rows[0];
  const columns = Object.keys(sample);
  const placeholders = columns.map(() => '?').join(', ');
  const insertStmt = targetDb.prepare(
    `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`
  );

  for (const row of rows) {
    const values = columns.map(c => row[c]);
    insertStmt.run(...values);
  }

  console.log(`✓ Synced ${table}: ${rows.length} rows`);
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

srcDb.close();
targetDb.close();
console.log('\nSync completed successfully!');

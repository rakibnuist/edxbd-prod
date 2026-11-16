import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const dbPath = process.env.DATABASE_URL?.replace(/^file:/, '') || 'prisma/data/edxbd.db';
const bundlePath = path.join(rootDir, 'data/research/full-university-catalog-bundle.json');

console.log(`Exporting full catalog bundle from ${dbPath} to ${bundlePath}...`);
const db = new DatabaseSync(dbPath);

const tableMap = {
  unis: 'University',
  programs: 'Program',
  fees: 'Fee',
  scholarships: 'Scholarship',
  costPlans: 'CostPlan',
  campaigns: 'IntakeCampaign',
  testimonials: 'Testimonial',
};

const bundle = {};

for (const [key, tableName] of Object.entries(tableMap)) {
  try {
    const rows = db.prepare(`SELECT * FROM "${tableName}"`).all();
    bundle[key] = rows;
    console.log(`✓ Exported ${tableName}: ${rows.length} rows`);
  } catch (err) {
    console.warn(`! Could not export table ${tableName}: ${err.message}`);
    bundle[key] = [];
  }
}

// Backup existing bundle file
if (fs.existsSync(bundlePath)) {
  const backupDir = path.join(path.dirname(bundlePath), 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(bundlePath, path.join(backupDir, `bundle-backup-${Date.now()}.json`));
}

fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf8');
console.log(`Bundle export completed successfully! Output: ${bundlePath}`);

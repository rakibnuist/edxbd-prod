// Pull production records from a VPS database snapshot into the local
// database without touching locally-owned tables.
//
// Usage:
//   node scripts/import-prod-snapshot.mjs [options]
//     --tables  Comma-separated list (default: Content,Testimonial,Partnership,Setting,Country,Lead)
//     --source  Snapshot path (default: data/vps-snapshot/prod-snapshot.db)
//
// Semantics:
//   - "Restore" is id-conservative: rows that already exist locally (by id,
//     by `key` for the Setting table) are skipped, never overwritten — local
//     work such as the curated university directory stays authoritative.
//   - The snapshot file is gitignored; nothing here copies customer data
//     into the repository.
import { PrismaClient } from '@prisma/client';
import path from 'node:path';

const rootDir = process.cwd();

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const tablesArg = flag('--tables', 'Content,Testimonial,Partnership,Setting,Country,Lead');
const defaultSnapshot = path.resolve(rootDir, 'data/vps-snapshot/prod-snapshot.db');
const sourcePath = path.resolve(rootDir, flag('--source', defaultSnapshot));

// Fill-in restore targets. Setting uses a natural `key` instead of an id.
const RESTORE_TABLES = {
  Content: { name: 'content', key: (row) => ({ id: row.id }) },
  Testimonial: { name: 'testimonial', key: (row) => ({ id: row.id }) },
  Partnership: { name: 'partnership', key: (row) => ({ id: row.id }) },
  Setting: { name: 'setting', key: (row) => ({ key: row.key }) },
  Country: { name: 'country', key: (row) => ({ id: row.id }) },
  Lead: { name: 'lead', key: (row) => ({ id: row.id }) },
};

const tableNames = tablesArg.split(',').map(name => name.trim()).filter(Boolean);

async function main() {
  const sourceUrl = `file:${sourcePath}`;
  const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
  const target = new PrismaClient();

  try {
    const targets = tableNames.map(name => {
      const model = RESTORE_TABLES[name];
      if (!model) throw new Error(`Unknown table "${name}". Known: ${Object.keys(RESTORE_TABLES).join(', ')}`);
      return [name, model];
    });

    for (const [name, model] of targets) {
      const sourceClient = source;
      const rows = await sourceClient[model.name].findMany();
      let inserted = 0;
      let skipped = 0;
      for (const row of rows) {
        const existing = await target[model.name].findUnique({ where: model.key(row) });
        if (existing) { skipped += 1; continue; }
        await target[model.name].create({ data: row });
        inserted += 1;
      }
      console.log(`${name}: restored ${inserted}, skipped ${skipped} (existing ${rows.length - inserted})`);
    }
    console.log('Import complete. Nothing was overwritten locally.');
  } finally {
    await source.$disconnect().catch(() => {});
    await target.$disconnect().catch(() => {});
  }
}

main().catch(error => {
  console.error('Import failed:', error.message);
  process.exitCode = 1;
});

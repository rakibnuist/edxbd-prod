#!/usr/bin/env node
import fs from 'node:fs';
import { register } from 'node:module';

register(new URL('./lib/typescript-source-resolver.mjs', import.meta.url));

const { parseMetaLeadsCsv } = await import('../src/lib/lead-workflow.ts');
const prismaModule = await import('../src/lib/prisma.ts');
const prisma = prismaModule.default;

const csvPath = process.argv[2];
if (!csvPath || !fs.existsSync(csvPath)) {
  console.error('Usage: node scripts/import-meta-leads-csv.mjs <path-to-leads.csv>');
  process.exit(1);
}

const buf = fs.readFileSync(csvPath);
const isUtf16Le = buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe;
const text = isUtf16Le ? buf.toString('utf16le') : buf.toString('utf8');
const rows = parseMetaLeadsCsv(text);

const existing = await prisma.lead.findMany({ select: { phone: true } });
const existingPhones = new Set(
  existing.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
);

let imported = 0;
let skipped = 0;
for (const row of rows) {
  const key10 = row.phone.replace(/\D/g, '').slice(-10);
  if (key10 && existingPhones.has(key10)) {
    skipped += 1;
    continue;
  }
  await prisma.lead.create({
    data: {
      ...row,
      consentTimestamp: new Date(row.consentTimestamp),
    },
  });
  imported += 1;
  if (key10) existingPhones.add(key10);
}

console.log(`Imported ${imported} Meta leads (${skipped} already existed).`);

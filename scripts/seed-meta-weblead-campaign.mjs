import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const rootDir = process.cwd();
const dataPath = path.join(rootDir, 'data/research/meta-weblead-campaign-leads.json');
const rawDbUrl = process.env.DATABASE_URL || 'file:prisma/data/edxbd.db';
const targetDbPath = rawDbUrl.replace(/^file:/, '').split('?')[0] || 'prisma/data/edxbd.db';

if (!fs.existsSync(dataPath)) {
  console.error(`Campaign leads bundle not found: ${dataPath}`);
  process.exit(1);
}

if (!fs.existsSync(targetDbPath)) {
  console.error(`Target database not found: ${targetDbPath}`);
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(rows) || rows.length === 0) {
  console.log('No campaign leads to seed.');
  process.exit(0);
}

const db = new DatabaseSync(targetDbPath);
db.exec('PRAGMA busy_timeout = 60000;');
db.exec('PRAGMA journal_mode = WAL;');

const existingRows = db.prepare('SELECT id, phone, email FROM "Lead"').all();
const existingByKey10 = new Map();
const normalizePhoneStmt = db.prepare('UPDATE "Lead" SET "phone" = ? WHERE "id" = ?');
const backfillPartialStmt = db.prepare(
  'UPDATE "Lead" SET "createdAt" = ?, "consentTimestamp" = ?, "assignedTeam" = ? WHERE "id" = ?',
);

const insertStmt = db.prepare(`
  INSERT INTO "Lead" (
    "id",
    "name",
    "email",
    "phone",
    "country",
    "program",
    "message",
    "status",
    "source",
    "leadType",
    "destinationInterest",
    "assignedTeam",
    "riskFlag",
    "medicalProgram",
    "consentTimestamp",
    "consentPolicyVersion",
    "landingPage",
    "adTrackingConsent",
    "createdAt",
    "updatedAt"
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, 1, ?, ?)
`);

let normalizedPhones = 0;
let backfilled = 0;
let imported = 0;
let skipped = 0;

db.exec('BEGIN IMMEDIATE;');
try {
  for (const existing of existingRows) {
    let phone = String(existing.phone || '').trim();
    if (/^\+?88001[3-9]\d{8}$/.test(phone)) {
      phone = `+880${phone.replace(/^\+?8800/, '')}`;
      normalizePhoneStmt.run(phone, existing.id);
      normalizedPhones += 1;
    }
    const key10 = phone.replace(/\D/g, '').slice(-10);
    if (key10 && !existingByKey10.has(key10)) {
      existingByKey10.set(key10, {
        id: existing.id,
        email: String(existing.email || '').trim().toLowerCase(),
      });
    }
  }

  db.prepare('UPDATE "Lead" SET "adTrackingConsent" = 1 WHERE "source" LIKE \'meta_%\' AND "adTrackingConsent" = 0').run();
  for (const row of rows) {
    const phone = String(row.phone || '').trim();
    const key10 = phone.replace(/\D/g, '').slice(-10);
    if (!key10) continue;

    const parsedTs = Date.parse(String(row.consentTimestamp || ''));
    const tsMs = Number.isFinite(parsedTs) && parsedTs > 0 ? parsedTs : Date.now();

    const existing = existingByKey10.get(key10);
    if (existing) {
      if (existing.email.startsWith('no-email+') || existing.email.endsWith('@meta-lead.eduexpressint.com')) {
        backfillPartialStmt.run(tsMs, tsMs, 'china', existing.id);
        backfilled += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    const id = `cml${crypto.randomBytes(11).toString('hex')}`;

    insertStmt.run(
      id,
      String(row.name || 'Student').slice(0, 120),
      String(row.email || `no-email+${phone.replace(/\D/g, '')}@leads.eduexpressint.com`),
      phone,
      String(row.country || 'China'),
      String(row.program || 'China March 2027 Intake'),
      String(row.message || 'Meta Instant Form (WebLead&InstantForm_18_4_2026)'),
      String(row.status || 'new'),
      String(row.source || 'meta_china_march_2027'),
      String(row.leadType || 'assessment'),
      String(row.destinationInterest || 'china'),
      String(row.assignedTeam || 'china'),
      tsMs,
      String(row.consentPolicyVersion || '2026-04-privacy-v1'),
      String(row.landingPage || '/china-march-2027-intake'),
      tsMs,
      tsMs,
    );

    imported += 1;
    existingByKey10.set(key10, { id, email: String(row.email || '').toLowerCase() });
  }
  db.exec('COMMIT;');
} catch (err) {
  db.exec('ROLLBACK;');
  throw err;
} finally {
  db.close();
}

console.log(
  `Seeded ${imported} WebLead campaign leads into ${targetDbPath} (${backfilled} backfilled, ${skipped} skipped, ${normalizedPhones} phones normalized).`,
);

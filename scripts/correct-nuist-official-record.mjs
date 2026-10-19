import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const correctionPath = path.join(root, 'data/research/nuist-official-record-corrections.json');
const correction = JSON.parse(await readFile(correctionPath, 'utf8'));
const db = new PrismaClient();
const apply = process.argv.includes('--apply');
const restoreIndex = process.argv.indexOf('--restore');
const universityFields = ['intake', 'tuition', 'deadlineApplication', 'deadlineStartDate', 'notes', 'badges', 'sourceUrls'];
const programmeFields = ['name', 'subject', 'languages', 'duration', 'intakes', 'tuition', 'applicationDeadline', 'eligibility', 'sourceUrl', 'status'];
const feeFields = ['cost', 'refundable', 'notes', 'recipient', 'validFor', 'sourceUrl'];
const scholarshipFields = ['title', 'amount', 'coverage', 'condition', 'renewal', 'deadline', 'details', 'eligiblePrograms', 'sourceUrl', 'status'];
const pick = (record, fields) => Object.fromEntries(fields.map(field => [field, record[field]]));

try {
  if (restoreIndex !== -1) {
    const filename = process.argv[restoreIndex + 1];
    if (!filename) throw new Error('Provide the backup JSON path after --restore.');
    const snapshot = JSON.parse(await readFile(path.resolve(root, filename), 'utf8'));
    if (snapshot.slug !== correction.slug) throw new Error('Backup is for a different university.');
    await db.$transaction(async tx => {
      await tx.university.update({ where: { id: snapshot.university.id }, data: snapshot.university.data });
      for (const record of snapshot.programmes) await tx.program.update({ where: { id: record.id }, data: record.data });
      for (const record of snapshot.fees) await tx.fee.update({ where: { id: record.id }, data: record.data });
      for (const record of snapshot.scholarships) await tx.scholarship.update({ where: { id: record.id }, data: record.data });
    });
    console.log(`Restored ${snapshot.slug} fields from ${filename}.`);
  } else {
    const university = await db.university.findUnique({ where: { slug: correction.slug }, include: { programs: true, fees: true, scholarships: true } });
    if (!university) throw new Error(`University ${correction.slug} was not found.`);
    const programmePairs = correction.programmes.map(item => {
      const record = university.programs.find(programme => [item.existingName, item.name].includes(programme.name));
      if (!record) throw new Error(`Programme ${item.existingName} was not found.`);
      return { item, record };
    });
    const feePairs = correction.fees.map(item => {
      const record = university.fees.find(fee => fee.item === item.existingItem);
      if (!record) throw new Error(`Fee ${item.existingItem} was not found.`);
      return { item, record };
    });
    const scholarship = university.scholarships.find(item => [correction.scholarship.existingTitle, correction.scholarship.title].includes(item.title));
    if (!scholarship) throw new Error('Expected NUIST scholarship was not found.');
    const snapshot = {
      slug: university.slug,
      capturedAt: new Date().toISOString(),
      university: { id: university.id, data: pick(university, universityFields) },
      programmes: programmePairs.map(({ record }) => ({ id: record.id, data: pick(record, programmeFields) })),
      fees: feePairs.map(({ record }) => ({ id: record.id, data: pick(record, feeFields) })),
      scholarships: [{ id: scholarship.id, data: pick(scholarship, scholarshipFields) }],
    };
    const summary = {
      slug: university.slug, programmes: programmePairs.length, fees: feePairs.length, scholarships: 1,
      verificationStatus: university.verificationStatus,
      verificationStatusChanges: false,
      programmeStatusAfter: 'planned',
      action: apply ? 'apply' : 'dry run; pass --apply to save with a backup',
    };
    if (apply) {
      const backupDirectory = path.join(root, 'data/research/backups');
      await mkdir(backupDirectory, { recursive: true });
      const backupPath = path.join(backupDirectory, `nuist-before-official-corrections-${Date.now()}.json`);
      await writeFile(backupPath, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' });
      const sourceUrls = [...new Set([...JSON.parse(university.sourceUrls || '[]'), ...Object.values(correction.sources)])];
      await db.$transaction(async tx => {
        await tx.university.update({ where: { id: university.id }, data: {
          ...correction.university, notes: JSON.stringify(correction.university.notes),
          badges: JSON.stringify(correction.university.badges), sourceUrls: JSON.stringify(sourceUrls),
        } });
        for (const { item, record } of programmePairs) await tx.program.update({ where: { id: record.id }, data: {
          name: item.name, subject: item.subject, languages: 'English', duration: '4 years', intakes: 'September',
          tuition: correction.university.tuition, applicationDeadline: 'Current-cycle deadline to be confirmed',
          eligibility: JSON.stringify([`Official CSCA subjects for this field: ${item.csca}.`, 'High-school graduate under 25; English proficiency certificate required. See linked official requirements.', 'Programme listed by the university; current intake availability requires confirmation.']),
          sourceUrl: correction.sources.programmes, status: 'planned',
        } });
        for (const { item, record } of feePairs) await tx.fee.update({ where: { id: record.id }, data: {
          cost: item.cost, refundable: item.refundable, notes: item.notes, recipient: null,
          validFor: 'Published schedule; selected intake to be confirmed', sourceUrl: correction.sources.fees,
        } });
        const { existingTitle: _existingTitle, ...scholarshipData } = correction.scholarship;
        await tx.scholarship.update({ where: { id: scholarship.id }, data: {
          ...scholarshipData, details: JSON.stringify(scholarshipData.details),
          eligiblePrograms: JSON.stringify(correction.programmes.map(item => item.name)), sourceUrl: correction.sources.programmes,
        } });
      });
      summary.backup = path.relative(root, backupPath);
    }
    console.log(JSON.stringify(summary, null, 2));
  }
} finally {
  await db.$disconnect();
}

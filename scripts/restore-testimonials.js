const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const seedDataDir = process.env.SEED_DATA_DIR;

if (!seedDataDir) {
  throw new Error('SEED_DATA_DIR must point to a local, untracked directory containing sanitized seed JSON.');
}

async function main() {
  const sourcePath = path.resolve(seedDataDir, 'testimonials.json');
  const records = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  let restored = 0;

  for (const record of records) {
    const id = record._id?.$oid || record._id;
    if (!id || !record.name || !record.quote) continue;
    const image = String(record.image || '').trim() || null;
    const consentVerified = record.consentVerified === true;
    const consentImageApproved = record.consentImageApproved === true;
    const consentEvidenceId = String(record.consentEvidenceId || '').trim() || null;
    const publishable = record.isActive === true && Boolean(image && consentVerified && consentImageApproved && consentEvidenceId && record.consentRecordedAt && !record.consentRevokedAt);
    const data = {
      studentName: record.name,
      displayName: record.displayName || null,
      content: record.quote,
      location: record.location || null,
      university: record.university || null,
      program: record.program || null,
      country: record.country || null,
      image,
      rating: Number(record.rating) || 5,
      featured: record.featured === true,
      academicProfile: record.academicProfile || null,
      decisionFactors: record.decisionFactors || null,
      applicationTimeline: record.applicationTimeline || null,
      serviceProvided: record.serviceProvided || null,
      studentPaid: record.studentPaid || null,
      currentUpdate: record.currentUpdate || null,
      consentVerified,
      consentEvidenceId,
      consentRecordedAt: record.consentRecordedAt ? new Date(record.consentRecordedAt) : null,
      consentExpiresAt: record.consentExpiresAt ? new Date(record.consentExpiresAt) : null,
      consentRevokedAt: record.consentRevokedAt ? new Date(record.consentRevokedAt) : null,
      consentImageApproved,
      isPublished: publishable,
    };
    await prisma.testimonial.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
    restored += 1;
  }

  console.log(`Restored ${restored} existing testimonial records.`);
}

main().finally(() => prisma.$disconnect());

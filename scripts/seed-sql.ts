import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const prisma = new PrismaClient();

async function readJson(filename: string) {
  const filePath = path.join(process.cwd(), 'db-dump', filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Could not read ${filename}`);
    return [];
  }
}

async function seed() {
  console.log('Starting seed...');

  // 1. Countries
  const countries = await readJson('countries.json');
  for (const c of countries) {
    await prisma.country.upsert({
      where: { name: c.name },
      update: {},
      create: {
        id: c._id?.$oid || c._id || undefined,
        name: c.name,
        slug: c.slug || c.name.toLowerCase(),
        description: c.description || null,
        isActive: c.isActive ?? true,
        createdAt: c.createdAt?.$date ? new Date(c.createdAt.$date) : undefined,
        updatedAt: c.updatedAt?.$date ? new Date(c.updatedAt.$date) : undefined,
      }
    });
  }
  console.log(`Seeded ${countries.length} countries`);

  // 2. Universities
  const universities = await readJson('universities.json');
  for (const u of universities) {
    // Basic arrays to CSV strings
    const intake = Array.isArray(u.intake) ? u.intake.join(',') : '';
    const degree = Array.isArray(u.degree) ? u.degree.join(',') : '';
    const taught = Array.isArray(u.taught) ? u.taught.join(',') : '';
    
    // JSON strings
    const tuitionDetails = JSON.stringify(u.details?.tuitionDetails || []);
    const documents = JSON.stringify(u.documents || []);
    const notes = JSON.stringify(u.notes || []);
    const badges = JSON.stringify(u.badges || []);
    const aliases = JSON.stringify(u.aliases || []);
    const legacySlugs = JSON.stringify(u.legacySlugs || []);
    const sourceUrls = JSON.stringify(u.sourceUrls || []);

    const createdU = await prisma.university.upsert({
      where: { slug: u.slug },
      update: {},
      create: {
        id: u._id?.$oid || u._id || undefined,
        slug: u.slug,
        name: u.name,
        location: u.location,
        country: u.country,
        city: u.city,
        intake,
        degree,
        taught,
        rankingCountry: u.rankings?.country || null,
        rankingWorld: u.rankings?.world || null,
        rankingNational: u.rankings?.national || null,
        majors: Array.isArray(u.details?.majors) ? u.details.majors.join(',') : '',
        tuition: u.details?.tuition || '0',
        tuitionDetails,
        documents,
        deadlineApplication: u.deadlines?.application || null,
        deadlineStartDate: u.deadlines?.startDate || null,
        notes,
        badges,
        logo: u.logo || null,
        isActive: u.isActive ?? true,
        officialUrl: u.officialUrl || null,
        aliases,
        legacySlugs,
        relationshipType: u.relationshipType || 'unverified',
        relationshipEvidenceUrl: u.relationshipEvidenceUrl || null,
        recognitionAuthority: u.recognitionAuthority || null,
        recognitionSourceUrl: u.recognitionSourceUrl || null,
        sourceUrls,
        lastVerifiedAt: u.lastVerifiedAt?.$date ? new Date(u.lastVerifiedAt.$date) : null,
        verificationExpiresAt: u.verificationExpiresAt?.$date ? new Date(u.verificationExpiresAt.$date) : null,
        verificationStatus: u.verificationStatus || 'under_verification',
        createdAt: u.createdAt?.$date ? new Date(u.createdAt.$date) : undefined,
        updatedAt: u.updatedAt?.$date ? new Date(u.updatedAt.$date) : undefined,
      }
    });

    // Sub-records for this university
    if (u.programs) {
      for (const p of u.programs) {
        await prisma.program.create({
          data: {
            universityId: createdU.id,
            level: p.level || 'Bachelor',
            name: p.name,
            subject: p.subject || null,
            languages: Array.isArray(p.languages) ? p.languages.join(',') : '',
            duration: p.duration || null,
            intakes: Array.isArray(p.intakes) ? p.intakes.join(',') : '',
            tuition: p.tuition || null,
            tuitionAfterScholarship: p.tuitionAfterScholarship || null,
            applicationDeadline: p.applicationDeadline || null,
            eligibility: JSON.stringify(p.eligibility || []),
            sourceUrl: p.sourceUrl || null,
            status: p.status || 'active',
          }
        });
      }
    }

    if (u.fees) {
      for (const f of u.fees) {
        await prisma.fee.create({
          data: {
            universityId: createdU.id,
            item: f.item,
            cost: f.cost,
            notes: f.notes || null,
            recipient: f.recipient || null,
            refundable: f.refundable || '',
            validFor: f.validFor || null,
            sourceUrl: f.sourceUrl || null,
          }
        });
      }
    }

    if (u.scholarships) {
      for (const s of u.scholarships) {
        await prisma.scholarship.create({
          data: {
            universityId: createdU.id,
            title: s.title,
            type: s.type || null,
            details: JSON.stringify(s.details || []),
            amount: s.amount || null,
            condition: s.condition || null,
            eligiblePrograms: JSON.stringify(s.eligiblePrograms || []),
            coverage: s.coverage || null,
            renewal: s.renewal || null,
            deadline: s.deadline || null,
            sourceUrl: s.sourceUrl || null,
            status: s.status || 'active',
          }
        });
      }
    }
  }
  console.log(`Seeded ${universities.length} universities with their programs, fees, and scholarships`);

  // Similar loops for leads, contents, partnerships, users, testimonials can be added if needed,
  // but let's stick to the core first to ensure it works.

  console.log('Seeding finished.');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

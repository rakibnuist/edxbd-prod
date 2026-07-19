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
  console.log('Starting full database seed...');

  // 1. Countries
  const countries = await readJson('countries.json');
  for (const c of countries) {
    const id = c._id?.$oid || (typeof c._id === 'string' ? c._id : undefined);
    await prisma.country.upsert({
      where: { name: c.name },
      update: {
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        description: c.description || null,
        isActive: c.isActive ?? true,
      },
      create: {
        id,
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        description: c.description || null,
        isActive: c.isActive ?? true,
        createdAt: c.createdAt?.$date ? new Date(c.createdAt.$date) : undefined,
        updatedAt: c.updatedAt?.$date ? new Date(c.updatedAt.$date) : undefined,
      }
    });
  }
  console.log(`✅ Seeded ${countries.length} countries`);

  // 2. Users
  const users = await readJson('users.json');
  for (const u of users) {
    const id = u._id?.$oid || (typeof u._id === 'string' ? u._id : undefined);
    const email = (u.email || '').toLowerCase().trim();
    if (!email) continue;
    const pwd = email === 'admin@eduexpressint.com'
      ? '$2b$10$gup.2VSpY7w3dYHjJyKBIebhR3PhFuvm8Z6dd9RwKfFkW7rq4YJBm' // admin123
      : u.password;

    await prisma.user.upsert({
      where: { email },
      update: {
        name: u.name || 'User',
        password: pwd,
        role: email === 'admin@eduexpressint.com' ? 'admin' : (u.role || 'user'),
      },
      create: {
        id,
        name: u.name || 'User',
        email,
        password: pwd,
        role: email === 'admin@eduexpressint.com' ? 'admin' : (u.role || 'user'),
        createdAt: u.createdAt?.$date ? new Date(u.createdAt.$date) : (u.createdAt ? new Date(u.createdAt) : undefined),
        updatedAt: u.updatedAt?.$date ? new Date(u.updatedAt.$date) : (u.updatedAt ? new Date(u.updatedAt) : undefined),
      }
    });
  }
  // Guarantee admin user exists even if users.json is empty
  await prisma.user.upsert({
    where: { email: 'admin@eduexpressint.com' },
    update: {
      password: '$2b$10$gup.2VSpY7w3dYHjJyKBIebhR3PhFuvm8Z6dd9RwKfFkW7rq4YJBm',
      role: 'admin',
    },
    create: {
      name: 'Admin',
      email: 'admin@eduexpressint.com',
      password: '$2b$10$gup.2VSpY7w3dYHjJyKBIebhR3PhFuvm8Z6dd9RwKfFkW7rq4YJBm',
      role: 'admin',
    }
  });
  console.log(`✅ Seeded ${users.length} users and verified admin account`);

  // 3. Universities & Programs, Fees, Scholarships
  const universities = await readJson('universities.json');
  for (const u of universities) {
    const id = u._id?.$oid || (typeof u._id === 'string' ? u._id : undefined);
    const intake = Array.isArray(u.intake) ? u.intake.join(',') : (u.intake || '');
    const degree = Array.isArray(u.degree) ? u.degree.join(',') : (u.degree || '');
    const taught = Array.isArray(u.taught) ? u.taught.join(',') : (u.taught || '');
    const majors = Array.isArray(u.majors) ? u.majors.join(',') : (u.majors || '');

    const tuitionDetails = JSON.stringify(u.details?.tuitionDetails || []);
    const documents = JSON.stringify(u.documents || []);
    const notes = JSON.stringify(u.notes || []);
    const badges = JSON.stringify(u.badges || []);
    const aliases = JSON.stringify(u.aliases || []);
    const legacySlugs = JSON.stringify(u.legacySlugs || []);
    const sourceUrls = JSON.stringify(u.sourceUrls || []);

    const createdU = await prisma.university.upsert({
      where: { slug: u.slug },
      update: {
        name: u.name,
        location: u.location || '',
        country: u.country || '',
        city: u.city || '',
        intake,
        degree,
        taught,
        rankingCountry: u.ranking?.country || u.rankingCountry || null,
        rankingWorld: u.ranking?.world || u.rankingWorld || null,
        rankingNational: u.ranking?.national || u.rankingNational || null,
        majors,
        tuition: u.tuition || '',
        tuitionDetails,
        documents,
        deadlineApplication: u.deadlines?.application || u.deadlineApplication || null,
        deadlineStartDate: u.deadlines?.startDate || u.deadlineStartDate || null,
        notes,
        badges,
        logo: u.logo || null,
        isActive: u.isActive ?? true,
        officialUrl: u.officialUrl || null,
        aliases,
        legacySlugs,
        sourceUrls,
      },
      create: {
        id,
        slug: u.slug,
        name: u.name,
        location: u.location || '',
        country: u.country || '',
        city: u.city || '',
        intake,
        degree,
        taught,
        rankingCountry: u.ranking?.country || u.rankingCountry || null,
        rankingWorld: u.ranking?.world || u.rankingWorld || null,
        rankingNational: u.ranking?.national || u.rankingNational || null,
        majors,
        tuition: u.tuition || '',
        tuitionDetails,
        documents,
        deadlineApplication: u.deadlines?.application || u.deadlineApplication || null,
        deadlineStartDate: u.deadlines?.startDate || u.deadlineStartDate || null,
        notes,
        badges,
        logo: u.logo || null,
        isActive: u.isActive ?? true,
        officialUrl: u.officialUrl || null,
        aliases,
        legacySlugs,
        sourceUrls,
        createdAt: u.createdAt?.$date ? new Date(u.createdAt.$date) : undefined,
        updatedAt: u.updatedAt?.$date ? new Date(u.updatedAt.$date) : undefined,
      }
    });

    if (u.programs) {
      for (const p of u.programs) {
        const languages = Array.isArray(p.languages) ? p.languages.join(',') : (p.languages || '');
        const pIntakes = Array.isArray(p.intakes) ? p.intakes.join(',') : (p.intakes || '');
        const eligibility = JSON.stringify(p.eligibility || []);

        await prisma.program.create({
          data: {
            universityId: createdU.id,
            level: p.level || 'Bachelor',
            name: p.name,
            subject: p.subject || null,
            languages,
            duration: p.duration || null,
            intakes: pIntakes,
            tuition: p.tuition || null,
            tuitionAfterScholarship: p.tuitionAfterScholarship || null,
            applicationDeadline: p.applicationDeadline || null,
            eligibility,
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
  console.log(`✅ Seeded ${universities.length} universities`);

  // 4. Leads
  const leads = await readJson('leads.json');
  for (const l of leads) {
    const id = l._id?.$oid || (typeof l._id === 'string' ? l._id : undefined);
    if (!l.email || !l.name) continue;

    await prisma.lead.upsert({
      where: { id: id || 'lead-placeholder' },
      update: {},
      create: {
        id,
        name: l.name,
        email: l.email,
        phone: l.phone || '',
        country: l.country || 'Not specified',
        program: l.program || null,
        message: l.message || null,
        status: l.status || 'new',
        source: l.source || 'website',
        leadType: l.leadType || 'contact',
        destinationInterest: l.destinationInterest || null,
        assignedTeam: l.assignedTeam || 'general',
        assignedTo: l.assignedTo || null,
        riskFlag: l.riskFlag ?? false,
        medicalProgram: l.medicalProgram ?? false,
        assessAcademicLevel: l.assessment?.academicLevel || l.assessAcademicLevel || null,
        assessAcademicResults: l.assessment?.academicResults || l.assessAcademicResults || null,
        assessSubject: l.assessment?.subject || l.assessSubject || null,
        assessBudget: l.assessment?.budget || l.assessBudget || null,
        assessIntake: l.assessment?.intake || l.assessIntake || null,
        assessLanguage: l.assessment?.language || l.assessLanguage || null,
        assessCareerGoal: l.assessment?.careerGoal || l.assessCareerGoal || null,
        assessPreferredCountries: JSON.stringify(l.assessment?.preferredCountries || []),
        notes: l.notes || null,
        consentTimestamp: l.consentTimestamp?.$date ? new Date(l.consentTimestamp.$date) : (l.consentTimestamp ? new Date(l.consentTimestamp) : new Date()),
        consentPolicyVersion: l.consentPolicyVersion || '2026-07-19',
        landingPage: l.landingPage || null,
        utm: JSON.stringify(l.utm || {}),
        createdAt: l.createdAt?.$date ? new Date(l.createdAt.$date) : (l.createdAt ? new Date(l.createdAt) : undefined),
        updatedAt: l.updatedAt?.$date ? new Date(l.updatedAt.$date) : (l.updatedAt ? new Date(l.updatedAt) : undefined),
      }
    });
  }
  console.log(`✅ Seeded ${leads.length} leads`);

  // 5. Testimonials
  const testimonials = await readJson('testimonials.json');
  for (const t of testimonials) {
    const id = t._id?.$oid || (typeof t._id === 'string' ? t._id : undefined);
    if (!t.studentName || !t.content) continue;

    await prisma.testimonial.upsert({
      where: { id: id || 'testimonial-placeholder' },
      update: {},
      create: {
        id,
        studentName: t.studentName,
        content: t.content,
        university: t.university || null,
        country: t.country || null,
        rating: t.rating ?? 5,
        isPublished: t.isPublished ?? true,
        createdAt: t.createdAt?.$date ? new Date(t.createdAt.$date) : (t.createdAt ? new Date(t.createdAt) : undefined),
        updatedAt: t.updatedAt?.$date ? new Date(t.updatedAt.$date) : (t.updatedAt ? new Date(t.updatedAt) : undefined),
      }
    });
  }
  console.log(`✅ Seeded ${testimonials.length} testimonials`);

  // 6. Partnerships
  const partnerships = await readJson('partnerships.json');
  for (const p of partnerships) {
    const id = p._id?.$oid || (typeof p._id === 'string' ? p._id : undefined);
    await prisma.partnership.upsert({
      where: { id: id || 'partnership-placeholder' },
      update: {},
      create: {
        id,
        companyName: p.companyName || null,
        businessType: p.businessType || 'other',
        businessRegistrationNumber: p.businessRegistrationNumber || null,
        businessLicense: p.businessLicense || null,
        website: p.website || null,
        yearsInBusiness: p.yearsInBusiness ?? 0,
        contactPerson: p.contactPerson || 'Unknown',
        email: p.email || 'unknown@example.com',
        phone: p.phone || '0000000000',
        alternatePhone: p.alternatePhone || null,
        address: p.address || null,
        city: p.city || null,
        state: p.state || null,
        country: p.country || null,
        postalCode: p.postalCode || null,
        partnershipType: p.partnershipType || 'company',
        targetCountries: JSON.stringify(p.targetCountries || []),
        currentClients: p.currentClients ?? 0,
        monthlyTarget: p.monthlyTarget ?? 0,
        experience: p.experience || null,
        currentPartners: JSON.stringify(p.currentPartners || []),
        annualRevenue: p.annualRevenue || null,
        investmentCapacity: p.investmentCapacity || null,
        expectedCommission: p.expectedCommission || null,
        marketingChannels: JSON.stringify(p.marketingChannels || []),
        socialMediaPresence: JSON.stringify(p.socialMediaPresence || []),
        localNetwork: p.localNetwork || null,
        referralSources: JSON.stringify(p.referralSources || []),
        documents: JSON.stringify(p.documents || []),
        motivation: p.motivation || null,
        expectations: p.expectations || null,
        additionalInfo: p.additionalInfo || null,
        status: p.status || 'pending',
        priority: p.priority || 'medium',
        assignedTo: p.assignedTo || null,
        reviewNotes: p.reviewNotes || null,
        source: p.source || 'website',
        ipAddress: p.ipAddress || null,
        userAgent: p.userAgent || null,
        createdAt: p.createdAt?.$date ? new Date(p.createdAt.$date) : (p.createdAt ? new Date(p.createdAt) : undefined),
        updatedAt: p.updatedAt?.$date ? new Date(p.updatedAt.$date) : (p.updatedAt ? new Date(p.updatedAt) : undefined),
      }
    });
  }
  console.log(`✅ Seeded ${partnerships.length} partnerships`);

  // 7. Contents
  const contents = await readJson('contents.json');
  for (const cnt of contents) {
    const id = cnt._id?.$oid || (typeof cnt._id === 'string' ? cnt._id : undefined);
    if (!cnt.title || !cnt.slug) continue;

    await prisma.content.upsert({
      where: { slug: cnt.slug },
      update: {},
      create: {
        id,
        title: cnt.title,
        slug: cnt.slug,
        content: cnt.content || '',
        excerpt: cnt.excerpt || null,
        type: cnt.type || 'post',
        category: cnt.category || null,
        tags: JSON.stringify(cnt.tags || []),
        categories: JSON.stringify(cnt.categories || []),
        featuredImage: cnt.featuredImage || null,
        isPublished: cnt.isPublished ?? false,
        isFeatured: cnt.isFeatured ?? false,
        metaTitle: cnt.metaTitle || null,
        metaDescription: cnt.metaDescription || null,
        author: cnt.author || 'Admin',
        reviewer: cnt.reviewer || null,
        sourceUrls: JSON.stringify(cnt.sourceUrls || []),
        lastVerifiedAt: cnt.lastVerifiedAt?.$date ? new Date(cnt.lastVerifiedAt.$date) : (cnt.lastVerifiedAt ? new Date(cnt.lastVerifiedAt) : undefined),
        nextReviewAt: cnt.nextReviewAt?.$date ? new Date(cnt.nextReviewAt.$date) : (cnt.nextReviewAt ? new Date(cnt.nextReviewAt) : undefined),
        complianceApprovedAt: cnt.complianceApprovedAt?.$date ? new Date(cnt.complianceApprovedAt.$date) : (cnt.complianceApprovedAt ? new Date(cnt.complianceApprovedAt) : undefined),
        seoApprovedAt: cnt.seoApprovedAt?.$date ? new Date(cnt.seoApprovedAt.$date) : (cnt.seoApprovedAt ? new Date(cnt.seoApprovedAt) : undefined),
        publishedAt: cnt.publishedAt?.$date ? new Date(cnt.publishedAt.$date) : (cnt.publishedAt ? new Date(cnt.publishedAt) : undefined),
        views: cnt.views ?? 0,
        createdAt: cnt.createdAt?.$date ? new Date(cnt.createdAt.$date) : (cnt.createdAt ? new Date(cnt.createdAt) : undefined),
        updatedAt: cnt.updatedAt?.$date ? new Date(cnt.updatedAt.$date) : (cnt.updatedAt ? new Date(cnt.updatedAt) : undefined),
      }
    });
  }
  console.log(`✅ Seeded ${contents.length} contents`);

  console.log('🎉 Full database seeding complete.');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

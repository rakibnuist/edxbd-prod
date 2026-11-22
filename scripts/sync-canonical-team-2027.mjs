#!/usr/bin/env node
/**
 * Sync the canonical 8-person EduExpress International team across:
 * 1. Employee (CRM Staff & KPI Roster)
 * 2. User (CRM Logins — preserving Abdullah Al Rakib's existing login & password)
 * 3. TeamMember (Public Website /about and /education-consultant-dhaka with WebP portraits)
 *
 * Requires TEAM_DEFAULT_PASSWORD env var (>= 12 chars) for all non-Rakib CRM accounts.
 */

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

const LEGACY_TEAM_SLUGS = [
  'jannatun-ema',
  'md-tauhidul-islam-nur',
  'md-abdullah-al-razib',
  'md-taj-ahmed',
  'mim',
];

const CANONICAL_TEAM = [
  {
    empId: 'E-01',
    slug: 'abdullah-al-rakib',
    name: 'Abdullah Al Rakib',
    role: 'Founder & CEO',
    shortRole: 'Executive Strategy & China Partnerships',
    bio: 'Founded EduExpress in 2018 with hands-on experience in Chinese higher education, university partner governance, and visa-first admissions transparency across Bangladesh and international corridors.',
    specialties: ['China Strategy', 'Institutional Partnerships', 'Cost Governance'],
    photoUrl: '/images/team/abdullah-al-rakib.webp',
    phone: '+8618550629808',
    email: 'rakib.nuist@gmail.com',
    team: 'general',
    userRole: 'super_admin',
    preserveLogin: true,
    matchUserPatterns: [/^admin@eduexpressint\.com$/i, /^rakib\.nuist@gmail\.com$/i, /rakib/i],
    displayOrder: 1,
  },
  {
    empId: 'E-02',
    slug: 'sakib-al-jubaer',
    name: 'Sakib Al Jubaer',
    role: 'Managing Director',
    shortRole: 'Operations & Partner Relations',
    bio: 'Oversees Dhaka HQ operations, compliance standards, and B2B partner coordination so every student application progresses through verified milestones cleanly and on schedule.',
    specialties: ['Operations Leadership', 'B2B Partner Desk', 'Quality Assurance'],
    photoUrl: '/images/team/sakib-al-jubaer.webp',
    phone: '+8801843433699',
    email: 'sjubaer015@gmail.com',
    team: 'general',
    userRole: 'admin',
    preserveLogin: false,
    matchUserPatterns: [/^sjubaer015@gmail\.com$/i, /sakib|jubaer/i],
    displayOrder: 2,
  },
  {
    empId: 'E-06',
    slug: 'mahmudul-hasan-tamal',
    name: 'Mahmudul Hasan Tamal',
    role: 'Business Development Manager',
    shortRole: 'University Outreach & Partnerships',
    bio: 'Leads university relations, institutional outreach, and partner network expansion while guiding applicants on international scholarships and program pathways.',
    specialties: ['Business Development', 'Agency Partnerships', 'University Relations'],
    photoUrl: '/images/team/mahmudul-hasan-tamal.webp',
    phone: '+8801798631827',
    email: 'mhtamal04@gmail.com',
    team: 'china',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^mhtamal04@gmail\.com$/i, /tamal/i],
    displayOrder: 3,
  },
  {
    empId: 'E-07',
    slug: 'mukta-rahaman',
    name: 'Mukta Rahaman',
    role: 'Senior Consultant',
    shortRole: 'All Destinations & ClearCost Planning',
    bio: 'Leads academic fit reviews, parent consultations, and multi-destination cost schedules across China, Malaysia, Europe, and the UK with written cost transparency.',
    specialties: ['Senior Consultation', 'Multi-Destination Fit', 'ClearCost Schedules'],
    photoUrl: '/images/team/mukta-rahaman.webp',
    phone: '+8801329663505',
    email: 'muktarehman909@gmail.com',
    team: 'all',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^muktarehman909@gmail\.com$/i, /^mukta@/i, /mukta/i],
    displayOrder: 4,
  },
  {
    empId: 'E-04',
    slug: 'afsana-meme',
    name: 'Afsana Meme',
    role: 'Senior Consultant',
    shortRole: 'China Admissions & Scholarships',
    bio: 'Specializes in Chinese university admissions, CSC and provincial scholarship guidance, and document readiness for Bachelor, MBBS, and graduate applicants.',
    specialties: ['China Admissions', 'CSC Scholarships', 'MBBS Guidance'],
    photoUrl: '/images/team/afsana-meme.webp',
    phone: '+8801577300731',
    email: 'afsanarahman727@gmail.com',
    team: 'china',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^afsanarahman727@gmail\.com$/i, /^afsana@/i, /afsana/i],
    displayOrder: 5,
  },
  {
    empId: 'E-08',
    slug: 'shamoyla-narmin',
    name: 'Shamoyla Narmin',
    role: 'Consultant',
    shortRole: 'Admissions Counseling',
    bio: 'Supports prospective students from initial academic screening through university shortlisting, scholarship matching, and ongoing applicant follow-up.',
    specialties: ['Student Counseling', 'University Shortlisting', 'Applicant Follow-Up'],
    photoUrl: '/images/team/shamoyla-narmin.webp',
    phone: '+8801835903872',
    email: 'shamoylanarmin.mim2001@gmail.com',
    team: 'china',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^shamoylanarmin\.mim2001@gmail\.com$/i, /shamoyla|\bmim\b/i],
    displayOrder: 6,
  },
  {
    empId: 'E-05',
    slug: 'md-taj-ahmmed',
    name: 'Md Taj Ahmmed',
    role: 'Files & Visa Processing Executive',
    shortRole: 'Application & Visa Filing',
    bio: 'Manages portal submissions, document verification, JW202/DQ tracking, and embassy visa file preparation so every deadline and proof record stays accurate.',
    specialties: ['Application Filing', 'JW202 & Embassy Docs', 'Deadline Compliance'],
    photoUrl: '/images/team/md-taj-ahmmed.webp',
    phone: '+8801341226195',
    email: 'tajahmmed2@gmail.com',
    team: 'china',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^tajahmmed2@gmail\.com$/i, /taj/i],
    displayOrder: 7,
  },
  {
    empId: 'E-09',
    slug: 'md-manjurul-islam',
    name: 'Md Manjurul Islam',
    role: 'Creative Designer & Video Editor',
    shortRole: 'Brand Design & Video Media',
    bio: 'Produces official educational explainers, student testimonial stories, campus guides, and institutional visual assets across EduExpress public channels.',
    specialties: ['Video Production', 'Visual Design', 'Educational Media'],
    photoUrl: '/images/team/md-manjurul-islam.webp',
    phone: '+8801767980780',
    email: 'contact@mmanjurul.com',
    team: 'general',
    userRole: 'counselor',
    preserveLogin: false,
    matchUserPatterns: [/^contact@mmanjurul\.com$/i, /manjurul/i],
    displayOrder: 8,
  },
];

async function removeObsoleteE03IfSafe() {
  const emp = await prisma.employee.findUnique({
    where: { empId: 'E-03' },
    include: {
      _count: {
        select: {
          leads: true,
          financeExpenses: true,
          financeIncomes: true,
          payrolls: true,
          dailyLogs: true,
          attendances: true,
          tasks: true,
          activities: true,
        },
      },
    },
  });
  if (!emp) return;

  const busyCount =
    emp._count.leads +
    emp._count.financeExpenses +
    emp._count.financeIncomes +
    emp._count.payrolls +
    emp._count.dailyLogs +
    emp._count.attendances +
    emp._count.tasks +
    emp._count.activities;

  if (busyCount > 0) {
    await prisma.employee.update({
      where: { id: emp.id },
      data: { active: false },
    });
    console.warn(`Marked non-canonical E-03 (${emp.name}) inactive (preserved ${busyCount} historical records).`);
    return;
  }

  await prisma.kpiTarget.deleteMany({ where: { employeeId: emp.id } });
  await prisma.employee.delete({ where: { id: emp.id } });
  console.log(`Removed unused legacy employee E-03 (${emp.name}).`);
}

async function main() {
  const defaultPassword = (process.env.TEAM_DEFAULT_PASSWORD || '').trim();
  if (defaultPassword.length < 12) {
    throw new Error('TEAM_DEFAULT_PASSWORD env var (>= 12 chars) is required.');
  }
  const hashedDefaultPassword = await bcrypt.hash(defaultPassword, BCRYPT_ROUNDS);

  await removeObsoleteE03IfSafe();

  const existingUsers = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  const claimedUserIds = new Set();
  const consentDate = new Date('2026-11-22T00:00:00.000Z');

  for (const member of CANONICAL_TEAM) {
    const existingEmp = await prisma.employee.findUnique({ where: { empId: member.empId } });

    // Match user by exact target email first, then linked userId, then legacy email/name pattern
    let matchedUser =
      existingUsers.find(
        (u) => !claimedUserIds.has(u.id) && u.email.toLowerCase() === member.email.toLowerCase(),
      ) ||
      (existingEmp?.userId
        ? existingUsers.find((u) => u.id === existingEmp.userId && !claimedUserIds.has(u.id))
        : null) ||
      existingUsers.find(
        (u) =>
          !claimedUserIds.has(u.id) &&
          member.matchUserPatterns.some((re) => re.test(u.email) || re.test(u.name)),
      ) ||
      null;

    if (member.preserveLogin) {
      // Rakib: keep admin@eduexpressint.com and password untouched!
      if (!matchedUser) {
        matchedUser = existingUsers.find((u) => u.role === 'super_admin') || null;
      }
      if (matchedUser) {
        claimedUserIds.add(matchedUser.id);
        await prisma.user.update({
          where: { id: matchedUser.id },
          data: { name: member.name },
        });
      }
    } else if (matchedUser) {
      claimedUserIds.add(matchedUser.id);
      await prisma.user.update({
        where: { id: matchedUser.id },
        data: {
          name: member.name,
          email: member.email.toLowerCase(),
          role: member.userRole,
          password: hashedDefaultPassword,
        },
      });
    } else {
      matchedUser = await prisma.user.create({
        data: {
          name: member.name,
          email: member.email.toLowerCase(),
          role: member.userRole,
          password: hashedDefaultPassword,
        },
      });
      claimedUserIds.add(matchedUser.id);
    }

    const savedEmp = await prisma.employee.upsert({
      where: { empId: member.empId },
      update: {
        name: member.name,
        role: member.role,
        phone: member.phone,
        email: member.email.toLowerCase(),
        team: member.team,
        active: true,
        userId: matchedUser?.id ?? undefined,
      },
      create: {
        empId: member.empId,
        name: member.name,
        role: member.role,
        phone: member.phone,
        email: member.email.toLowerCase(),
        team: member.team,
        active: true,
        userId: matchedUser?.id ?? null,
      },
    });

    if (member.empId === 'E-08') {
      const leadRes = await prisma.lead.updateMany({
        where: { assignedTo: { in: ['Mim', 'mim', 'MIM'] } },
        data: { assignedTo: member.name, assignedEmployeeId: savedEmp.id },
      });
      const kpiRes = await prisma.kpiTarget.updateMany({
        where: { consultant: { in: ['Mim', 'mim', 'MIM'] } },
        data: { consultant: member.name, employeeId: savedEmp.id },
      });
      if (leadRes.count || kpiRes.count) {
        console.log(`Reassigned legacy 'Mim' records -> ${member.name}: ${leadRes.count} leads, ${kpiRes.count} KPI targets.`);
      }
    }

    if (member.empId === 'E-05') {
      const leadRes = await prisma.lead.updateMany({
        where: { assignedTo: { in: ['Md Taj Ahmed', 'Taj Ahmed', 'Taj'] } },
        data: { assignedTo: member.name, assignedEmployeeId: savedEmp.id },
      });
      const kpiRes = await prisma.kpiTarget.updateMany({
        where: { consultant: { in: ['Md Taj Ahmed', 'Taj Ahmed', 'Taj'] } },
        data: { consultant: member.name, employeeId: savedEmp.id },
      });
      if (leadRes.count || kpiRes.count) {
        console.log(`Normalized legacy Taj spelling -> ${member.name}: ${leadRes.count} leads, ${kpiRes.count} KPI targets.`);
      }
    }

    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: {
        name: member.name,
        role: member.role,
        shortRole: member.shortRole,
        bio: member.bio,
        specialties: JSON.stringify(member.specialties),
        photoUrl: member.photoUrl,
        consentConfirmedAt: consentDate,
        displayOrder: member.displayOrder,
        isPublished: true,
      },
      create: {
        slug: member.slug,
        name: member.name,
        role: member.role,
        shortRole: member.shortRole,
        bio: member.bio,
        specialties: JSON.stringify(member.specialties),
        photoUrl: member.photoUrl,
        consentConfirmedAt: consentDate,
        displayOrder: member.displayOrder,
        isPublished: true,
      },
    });
  }

  // Delete legacy public website team profiles replaced by the canonical roster
  const removedPublic = await prisma.teamMember.deleteMany({
    where: { slug: { in: LEGACY_TEAM_SLUGS } },
  });
  if (removedPublic.count > 0) {
    console.log(`Removed ${removedPublic.count} legacy TeamMember public profiles.`);
  }

  const finalUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { email: 'asc' },
  });
  const finalEmps = await prisma.employee.findMany({
    select: { empId: true, name: true, role: true, team: true, email: true, userId: true },
    orderBy: { empId: 'asc' },
  });
  const finalPublic = await prisma.teamMember.findMany({
    select: { slug: true, name: true, role: true, photoUrl: true, isPublished: true, consentConfirmedAt: true },
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`\nSynced Employees (${finalEmps.length}):`);
  console.table(finalEmps);
  console.log(`\nCRM Users (${finalUsers.length}):`);
  console.table(finalUsers.map(({ name, email, role }) => ({ name, email, role })));
  console.log(`\nPublic TeamMember Profiles (${finalPublic.length}):`);
  console.table(
    finalPublic.map(({ slug, name, role, photoUrl, isPublished }) => ({ slug, name, role, photoUrl, isPublished })),
  );
}

main()
  .catch((error) => {
    console.error('Team sync failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

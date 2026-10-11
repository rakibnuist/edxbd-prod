import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const campaignData = await import('../src/data/chinaMarch2027Campaign.ts');
  const contentJson = JSON.stringify({
    routes: campaignData.chinaMarch2027Routes,
    requiredDocuments: campaignData.march2027RequiredDocuments,
    faqs: campaignData.march2027Faqs,
  });

  await prisma.intakeCampaign.upsert({
    where: { slug: 'china-march-2027-intake' },
    update: {
      title: 'China March 2027 Intake',
      destination: 'China',
      intake: 'March 2027',
      contentJson,
      sourceLabel: 'Owner-supplied “2027 Projects” planning sheet',
      verificationStatus: 'preliminary',
      lastReviewedAt: new Date('2026-10-11T00:00:00+06:00'),
      nextReviewAt: new Date('2026-11-15T00:00:00+06:00'),
      isPublished: true,
    },
    create: {
      slug: 'china-march-2027-intake',
      title: 'China March 2027 Intake',
      destination: 'China',
      intake: 'March 2027',
      contentJson,
      sourceLabel: 'Owner-supplied “2027 Projects” planning sheet',
      verificationStatus: 'preliminary',
      lastReviewedAt: new Date('2026-10-11T00:00:00+06:00'),
      nextReviewAt: new Date('2026-11-15T00:00:00+06:00'),
      isPublished: true,
    },
  });

  console.log('Seeded China March 2027 intake campaign.');
}

main()
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

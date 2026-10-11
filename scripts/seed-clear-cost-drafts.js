const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const parseList = (value) => { try { return JSON.parse(value || '[]'); } catch { return []; } };
const amountCurrency = (value) => ['CNY', 'USD', 'EUR', 'GBP', 'BDT'].find(currency => String(value || '').toUpperCase().includes(currency)) || 'CNY';

async function main() {
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    include: { programs: true, fees: true, scholarships: true, costPlans: true },
  });

  let created = 0;
  for (const university of universities) {
    for (const program of university.programs) {
      const intake = program.intakes.split(',').map(value => value.trim()).filter(Boolean)[0] || university.intake.split(',')[0]?.trim() || 'Current intake';
      const existing = university.costPlans.some(plan => plan.programName === program.name && plan.intake === intake);
      if (existing) continue;

      const scholarship = university.scholarships.find(item => {
        const eligible = parseList(item.eligiblePrograms);
        return item.status === 'active' && (eligible.length === 0 || eligible.some(value => value.toLowerCase() === program.name.toLowerCase()));
      });
      const fee = (pattern) => university.fees.find(item => pattern.test(item.item));
      const mappedIds = new Set([
        fee(/application/i)?.id, fee(/hostel|accommodation/i)?.id, fee(/insurance/i)?.id,
        fee(/medical|health check/i)?.id, fee(/visa|residence permit/i)?.id, fee(/service.*edu|eduexpress/i)?.id,
      ].filter(Boolean));
      const otherCosts = university.fees.filter(item => !mappedIds.has(item.id)).map(item => `${item.item}: ${item.cost}`);

      await prisma.costPlan.create({
        data: {
          universityId: university.id,
          title: `${program.name} ${intake} ClearCost plan`,
          programName: program.name,
          scholarshipTitle: scholarship?.title || null,
          intake,
          currency: amountCurrency(program.tuition),
          tuitionBeforeScholarship: program.tuition,
          scholarshipValue: scholarship?.amount || scholarship?.coverage || null,
          tuitionAfterScholarship: program.tuitionAfterScholarship,
          applicationFee: fee(/application/i)?.cost || null,
          hostel: fee(/hostel|accommodation/i)?.cost || null,
          insurance: fee(/insurance/i)?.cost || null,
          medical: fee(/medical|health check/i)?.cost || null,
          visa: fee(/visa|residence permit/i)?.cost || null,
          serviceFee: fee(/service.*edu|eduexpress/i)?.cost || null,
          otherCosts: JSON.stringify(otherCosts),
          notes: JSON.stringify([
            'Draft generated from the existing central university record.',
            'Verify every amount, scholarship condition, source URL and review date before publishing.',
            'University and other third party fees remain separate from EduExpress service charges.',
          ]),
          isPublished: false,
        },
      });
      created += 1;
    }
  }

  console.log(`Created ${created} unpublished ClearCost drafts.`);
}

main().finally(() => prisma.$disconnect());

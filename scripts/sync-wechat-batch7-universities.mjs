import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncBatch7() {
  console.log('--- SYNCING WECHAT BATCH 7 UNIVERSITIES & PROGRAMS ---');

  // 1. Hebei University of Technology (HEBUT)
  const hebut = await prisma.university.findUnique({
    where: { slug: 'hebei-university-of-technology' },
  });

  if (hebut) {
    await prisma.university.update({
      where: { id: hebut.id },
      data: {
        chineseName: '河北工业大学',
        cscAgencyNumber: '10080',
        isCscDesignated: true,
        city: 'Tianjin',
        province: 'Hebei / Tianjin',
        location: 'Tianjin, China',
      },
    });

    // Upsert 2027 Undergraduate Programs
    const hebutPrograms = [
      {
        name: 'Electronic Science and Technology (BSc)',
        level: 'Bachelor',
        languages: 'English',
        duration: '4 years',
        intakes: 'September',
        subject: 'Engineering',
        tuition: 'CNY 16,000 / year',
        applicationDeadline: '2027-06-10',
        eligibility: JSON.stringify({
          academic: 'High school diploma or equivalent, under 22 years old',
          language: 'IELTS 6.0 / TOEFL 85 or equivalent English proficiency',
          csca: 'Mandatory CSCA exam score transcript required',
        }),
        sourceUrl: 'https://mp.weixin.qq.com/s/kSSs7OcPA_jzYCDgPtwVpw',
      },
      {
        name: 'Civil Engineering (BEng)',
        level: 'Bachelor',
        languages: 'English',
        duration: '4 years',
        intakes: 'September',
        subject: 'Engineering',
        tuition: 'CNY 16,000 / year',
        applicationDeadline: '2027-06-10',
        eligibility: JSON.stringify({
          academic: 'High school diploma or equivalent, under 22 years old',
          language: 'IELTS 6.0 / TOEFL 85 or equivalent English proficiency',
          csca: 'Mandatory CSCA exam score transcript required',
        }),
        sourceUrl: 'https://mp.weixin.qq.com/s/kSSs7OcPA_jzYCDgPtwVpw',
      },
      {
        name: 'Architecture (BArch)',
        level: 'Bachelor',
        languages: 'English',
        duration: '5 years',
        intakes: 'September',
        subject: 'Architecture',
        tuition: 'CNY 16,000 / year',
        applicationDeadline: '2027-06-10',
        eligibility: JSON.stringify({
          academic: 'High school diploma or equivalent, under 22 years old',
          language: 'IELTS 6.0 / TOEFL 85 or equivalent English proficiency',
          csca: 'Mandatory CSCA exam score transcript required',
        }),
        sourceUrl: 'https://mp.weixin.qq.com/s/kSSs7OcPA_jzYCDgPtwVpw',
      },
      {
        name: 'Business Administration (BBA)',
        level: 'Bachelor',
        languages: 'Chinese',
        duration: '4 years',
        intakes: 'September',
        subject: 'Business',
        tuition: 'CNY 14,000 / year',
        applicationDeadline: '2027-06-10',
        eligibility: JSON.stringify({
          academic: 'High school diploma or equivalent, under 22 years old',
          language: 'HSK Level 4 with score not lower than 210',
          csca: 'Mandatory CSCA exam score transcript required',
        }),
        sourceUrl: 'https://mp.weixin.qq.com/s/kSSs7OcPA_jzYCDgPtwVpw',
      },
      {
        name: 'International Chinese Language Education (BA)',
        level: 'Bachelor',
        languages: 'Chinese',
        duration: '4 years',
        intakes: 'September',
        subject: 'Education',
        tuition: 'CNY 14,000 / year',
        applicationDeadline: '2027-06-10',
        eligibility: JSON.stringify({
          academic: 'High school diploma or equivalent, under 22 years old',
          language: 'HSK Level 4 with score not lower than 210',
          csca: 'Mandatory CSCA exam score transcript required',
        }),
        sourceUrl: 'https://mp.weixin.qq.com/s/kSSs7OcPA_jzYCDgPtwVpw',
      },
    ];

    for (const prog of hebutPrograms) {
      const existing = await prisma.program.findFirst({
        where: { universityId: hebut.id, name: prog.name },
      });
      if (existing) {
        await prisma.program.update({
          where: { id: existing.id },
          data: prog,
        });
      } else {
        await prisma.program.create({
          data: {
            ...prog,
            universityId: hebut.id,
          },
        });
      }
    }

    // Upsert Scholarships
    const hebutScholarships = [
      {
        title: 'Hebei Provincial Government - HEBUT Scholarship',
        type: 'Provincial / University',
        coverage: 'First-Class (Full tuition + accommodation + stipend), Second-Class (Full tuition waiver), Third-Class (Partial tuition waiver)',
        amount: '14,000–30,000 CNY/year',
        condition: 'High academic merit, CSCA examination results, clean disciplinary record, and successful annual review.',
        deadline: '10 June 2027',
        eligiblePrograms: JSON.stringify(['Undergraduate']),
        details: JSON.stringify({
          tiers: [
            { tier: 'First Class', benefit: 'Full tuition waiver + on-campus accommodation + monthly stipend' },
            { tier: 'Second Class', benefit: 'Full tuition waiver' },
            { tier: 'Third Class', benefit: 'Partial tuition waiver' },
          ],
          portal: 'hebut.studyinchina.top',
        }),
      },
      {
        title: 'Chinese Government Scholarship (CSC Type B)',
        type: 'Chinese Government Scholarship',
        coverage: 'Full tuition waiver, free on-campus accommodation, comprehensive medical insurance, monthly living stipend',
        amount: 'Full Scholarship (Stipend: 2,500 CNY/mo Bachelor, 3,000 CNY/mo Master, 3,500 CNY/mo PhD)',
        condition: 'Undergraduate under 22, Master under 35, PhD under 40. High academic ranking and merit review.',
        deadline: '15 February 2027',
        eligiblePrograms: JSON.stringify(['Undergraduate', 'Master', 'Doctoral']),
        details: JSON.stringify({
          agencyNumber: '10080',
          programCategory: 'Type B',
        }),
      },
    ];

    for (const sch of hebutScholarships) {
      const existing = await prisma.scholarship.findFirst({
        where: { universityId: hebut.id, title: sch.title },
      });
      if (existing) {
        await prisma.scholarship.update({
          where: { id: existing.id },
          data: sch,
        });
      } else {
        await prisma.scholarship.create({
          data: {
            ...sch,
            universityId: hebut.id,
          },
        });
      }
    }

    // Upsert Fees
    const hebutFees = [
      { item: 'Application Fee', cost: '600 CNY', recipient: 'Hebei University of Technology', refundable: 'Non-refundable', notes: 'Paid online via hebut.studyinchina.top portal' },
      { item: 'Tuition (English-Taught Bachelor)', cost: '16,000 CNY / academic year', recipient: 'Hebei University of Technology', refundable: 'Per university policy', notes: 'Electronic Science & Technology, Civil Engineering, Architecture' },
      { item: 'Tuition (Chinese-Taught Bachelor)', cost: '14,000 CNY / academic year', recipient: 'Hebei University of Technology', refundable: 'Per university policy', notes: 'Business Administration, International Chinese Language Education' },
      { item: 'Accommodation (Double Room)', cost: '7,200 CNY / year', recipient: 'Hebei University of Technology', refundable: 'Per semester policy', notes: '600 CNY/bed/month or 25 CNY/day' },
      { item: 'Accommodation (Quad Room)', cost: '3,600 CNY / year', recipient: 'Hebei University of Technology', refundable: 'Per semester policy', notes: '300 CNY/bed/month or 15 CNY/day' },
      { item: 'Comprehensive Medical Insurance', cost: '800 CNY / year', recipient: 'Insurance Company', refundable: 'Non-refundable', notes: 'Mandatory for all international students in China' },
    ];

    for (const fee of hebutFees) {
      const existing = await prisma.fee.findFirst({
        where: { universityId: hebut.id, item: fee.item },
      });
      if (existing) {
        await prisma.fee.update({
          where: { id: existing.id },
          data: fee,
        });
      } else {
        await prisma.fee.create({
          data: {
            ...fee,
            universityId: hebut.id,
          },
        });
      }
    }

    console.log('✓ Updated Hebei University of Technology (HEBUT)');
  }

  // 2. Southwestern University of Finance and Economics (SWUFE)
  const swufe = await prisma.university.findUnique({
    where: { slug: 'southwestern-university-of-finance-and-economics' },
  });

  if (swufe) {
    await prisma.university.update({
      where: { id: swufe.id },
      data: {
        chineseName: '西南财经大学',
        cscAgencyNumber: '10651',
        isCscDesignated: true,
        city: 'Chengdu',
        province: 'Sichuan',
        location: 'Chengdu, Sichuan Province, China',
      },
    });

    const swufeScholarships = [
      {
        title: 'Chinese Government Scholarship – High-Level Postgraduate Program (CSC Type B)',
        type: 'Chinese Government Scholarship',
        coverage: 'Full tuition waiver, campus accommodation, comprehensive medical insurance, monthly living stipend (Master: 3,000 RMB/month, PhD: 3,500 RMB/month)',
        amount: 'Full Funding (3,000–3,500 RMB/mo stipend + tuition + accommodation waiver)',
        condition: 'Master applicants under 35; PhD applicants under 40. English-taught requires IELTS 7.0 / TOEFL 90 / Duolingo 120; Chinese-taught requires HSK 5.',
        deadline: '20 February 2027',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        details: JSON.stringify({
          agencyNumber: '10651',
          programCategory: 'Type B',
          portals: ['http://studyinchina.csc.edu.cn', 'http://swufe.17gz.org'],
          applicationFee: '600 RMB',
        }),
      },
    ];

    for (const sch of swufeScholarships) {
      const existing = await prisma.scholarship.findFirst({
        where: { universityId: swufe.id, title: sch.title },
      });
      if (existing) {
        await prisma.scholarship.update({
          where: { id: existing.id },
          data: sch,
        });
      } else {
        await prisma.scholarship.create({
          data: {
            ...sch,
            universityId: swufe.id,
          },
        });
      }
    }

    const swufeFees = [
      { item: 'Application Fee', cost: '600 RMB', recipient: 'SWUFE', refundable: 'Non-refundable', notes: 'Paid online via SWUFE International Students Service System (swufe.17gz.org)' },
      { item: 'Comprehensive Medical Insurance', cost: '800 RMB / year', recipient: 'Insurance Company', refundable: 'Non-refundable', notes: 'Covered under CSC Type B award' },
    ];

    for (const fee of swufeFees) {
      const existing = await prisma.fee.findFirst({
        where: { universityId: swufe.id, item: fee.item },
      });
      if (existing) {
        await prisma.fee.update({
          where: { id: existing.id },
          data: fee,
        });
      } else {
        await prisma.fee.create({
          data: {
            ...fee,
            universityId: swufe.id,
          },
        });
      }
    }

    console.log('✓ Updated Southwestern University of Finance and Economics (SWUFE)');
  }

  // 3. Nanjing University of Science and Technology (NJUST)
  const njust = await prisma.university.findUnique({
    where: { slug: 'nanjing-university-of-science-and-technology' },
  });

  if (njust) {
    await prisma.university.update({
      where: { id: njust.id },
      data: {
        chineseName: '南京理工大学',
        cscAgencyNumber: '10288',
        isCscDesignated: true,
        city: 'Nanjing',
        province: 'Jiangsu',
        location: 'Nanjing, Jiangsu Province, China',
      },
    });

    // Upsert Chinese Language Program
    const langProg = {
      name: 'Chinese Language Program (Preparatory & General)',
      level: 'Language',
      languages: 'Chinese',
      duration: '1 semester or 1 academic year',
      intakes: 'September',
      subject: 'Chinese Language',
      tuition: 'CNY 16,000 / year',
      applicationDeadline: '2027-06-15',
      eligibility: JSON.stringify({
        academic: 'High school diploma or certification of equivalent education, age 18+',
        health: 'Foreigner Physical Examination Form valid within 6 months',
        conduct: 'Non-criminal Record Report valid within 6 months',
        admission: 'Online interview in June',
      }),
      sourceUrl: 'https://mp.weixin.qq.com/s/c8toMgVqnE6OxQM5Azk5sw',
    };

    const existingLang = await prisma.program.findFirst({
      where: { universityId: njust.id, name: langProg.name },
    });
    if (existingLang) {
      await prisma.program.update({
        where: { id: existingLang.id },
        data: langProg,
      });
    } else {
      await prisma.program.create({
        data: {
          ...langProg,
          universityId: njust.id,
        },
      });
    }

    // Upsert Scholarships (CSC Type B + Lanshan Scholarship)
    const njustScholarships = [
      {
        title: 'Chinese Government Scholarship – High-Level Postgraduate Program (CSC Type B)',
        type: 'Chinese Government Scholarship',
        coverage: 'Full tuition waiver, on-campus accommodation (or allowance), comprehensive medical insurance, monthly living stipend (Master: 3,000 RMB/month, PhD: 3,500 RMB/month)',
        amount: 'Full Funding (3,000–3,500 RMB/mo stipend + tuition + accommodation waiver)',
        condition: 'Master under 35; PhD under 40. English-taught requires valid IELTS/TOEFL or English medium degree; Chinese-taught requires HSK 5.',
        deadline: '5 March 2027',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        details: JSON.stringify({
          agencyNumber: '10288',
          programCategory: 'Type B',
          portals: ['https://studyinchina.csc.edu.cn', 'http://admission.njust.edu.cn', 'https://njust.17gz.org'],
          applicationFee: '500 CNY',
        }),
      },
      {
        title: 'NJUST Lanshan Scholarship Program (兰杉奖学金)',
        type: 'Institutional University Scholarship',
        coverage: 'Undergraduate (A+: Tuition + Dorm + 1,000 CNY/mo; A: Full tuition; B: 50% tuition; C: Full dorm). Master: Full tuition + dorm + 1,500 CNY/mo. PhD: A (Tuition + dorm + 3,500 CNY/mo), B (Tuition + dorm + 2,500 CNY/mo), C (Tuition + dorm + 1,500 CNY/mo).',
        amount: 'Up to Full Tuition, Dorm + 3,500 CNY/mo stipend',
        condition: 'Undergraduates must submit CSCA score report (Math, Physics/Chemistry per major). Age 18-25 for Undergrad; Master under 35; PhD under 40.',
        deadline: '15 May 2027',
        eligiblePrograms: JSON.stringify(['Undergraduate', 'Master', 'Doctoral']),
        details: JSON.stringify({
          portals: ['https://njust.17gz.org'],
          applicationFee: '500 CNY',
          undergraduateCscaWeight: 'Academic/CSCA 30%, Language 20%, Comprehensive/Interview 50%',
        }),
      },
    ];

    for (const sch of njustScholarships) {
      const existing = await prisma.scholarship.findFirst({
        where: { universityId: njust.id, title: sch.title },
      });
      if (existing) {
        await prisma.scholarship.update({
          where: { id: existing.id },
          data: sch,
        });
      } else {
        await prisma.scholarship.create({
          data: {
            ...sch,
            universityId: njust.id,
          },
        });
      }
    }

    // Upsert Fees
    const njustFees = [
      { item: 'Application Fee', cost: '500 CNY', recipient: 'NJUST', refundable: 'Non-refundable', notes: 'Paid online via njust.17gz.org' },
      { item: 'Chinese Language Tuition', cost: '16,000 CNY / academic year', recipient: 'NJUST', refundable: 'Full refund within 1 month of start date upon official withdrawal', notes: 'Or 8,000 CNY / semester' },
      { item: 'Language Program Textbooks', cost: '300 CNY', recipient: 'Bookstore / NJUST', refundable: 'Non-refundable', notes: 'Approximate textbook fee' },
      { item: 'Comprehensive Medical Insurance', cost: '800 CNY / year', recipient: 'Insurance Company', refundable: 'Non-refundable', notes: 'Mandatory health insurance' },
      { item: 'Visa / Residence Permit Fee', cost: '400 CNY / year', recipient: 'Entry-Exit Administration', refundable: 'Non-refundable', notes: 'Residence permit extension' },
    ];

    for (const fee of njustFees) {
      const existing = await prisma.fee.findFirst({
        where: { universityId: njust.id, item: fee.item },
      });
      if (existing) {
        await prisma.fee.update({
          where: { id: existing.id },
          data: fee,
        });
      } else {
        await prisma.fee.create({
          data: {
            ...fee,
            universityId: njust.id,
          },
        });
      }
    }

    console.log('✓ Updated Nanjing University of Science and Technology (NJUST)');
  }

  await prisma.$disconnect();
  console.log('--- ALL BATCH 7 UNIVERSITIES SYNCED SUCCESSFULLY ---');
}

syncBatch7().catch((err) => {
  console.error(err);
  process.exit(1);
});

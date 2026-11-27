import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Batch 6 University Database Sync ---');

  // 1. SIAT (Shenzhen Institute of Advanced Technology, CAS)
  console.log('Syncing SIAT...');
  const existingSiat = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'siat' },
        { slug: 'shenzhen-institute-of-advanced-technology' }
      ]
    }
  });

  const siatData = {
    slug: 'siat',
    name: 'Shenzhen Institute of Advanced Technology, Chinese Academy of Sciences',
    chineseName: '中国科学院深圳先进技术研究院',
    location: 'Shenzhen, Guangdong Province, China',
    country: 'China',
    city: 'Shenzhen',
    province: 'Guangdong',
    cscAgencyNumber: '80001',
    isCscDesignated: true,
    isMoeMbbsListed: false,
    intake: 'September',
    degree: 'Master, PhD',
    taught: 'English, Chinese',
    rankingCountry: 18,
    rankingWorld: 120,
    rankingNational: 18,
    majors: 'Chemistry (Physical, Polymers, Chemical Biology), Biology (Microbiology, Neurobiology, Biochemistry & Molecular Biology), Control Science & Intelligent Systems, Computer Science & Applied Technology, Optical Engineering, Biomedical Engineering',
    tuition: 'Master: CNY 30,000 / year; PhD: CNY 40,000 / year (100% Waived with Scholarship)',
    tuitionDetails: JSON.stringify([
      { level: 'Master', amount: 'CNY 30,000/year (100% Free on CSC/ANSO/UCAS scholarship)' },
      { level: 'PhD', amount: 'CNY 40,000/year (100% Free on CSC/ANSO/UCAS scholarship)' }
    ]),
    documents: JSON.stringify([
      'Valid Foreign Passport (min 1 year validity)',
      'Digital White Background Photograph',
      'Highest Diploma / Degree Certificate (Notarized English or Chinese)',
      'Official Academic Transcripts (Undergraduate & Master as applicable)',
      'Curriculum Vitae (CV) & Detailed Research Proposal / Study Plan',
      'Two Letters of Recommendation from Professors or Associate Professors',
      'SIAT Supervisor Provisional Acceptance Form (Attachment 2)',
      'Foreigner Physical Examination Form (Valid 6 months)',
      'Certificate of Non-Criminal Record / Police Clearance (Valid 6 months)',
      'English Language Proficiency Certificate or HSK Level 5 (180+) for Chinese medium',
      'Financial Guarantee Letter (Self-funded only; waived for scholarship applicants)'
    ]),
    deadlineApplication: 'Scholarship: February 28, 2027; Self-funded: April 15, 2027',
    deadlineStartDate: 'September 2027',
    notes: JSON.stringify([
      'Master applicant age limit: under 35 years; Undergraduate GPA >= 3.0/4.0 or 80/100',
      'Doctoral applicant age limit: under 40 years; Master & Bachelor GPA >= 3.0/4.0 or 80/100',
      'Degrees officially conferred by the University of Chinese Academy of Sciences (UCAS)',
      'All admitted CSC, ANSO, and UCAS scholars receive tuition waiver + generous monthly stipends up to 7,000 RMB/month',
      'Applicants strongly advised to secure SIAT supervisor provisional acceptance prior to official submission'
    ]),
    badges: JSON.stringify([
      'Double First Class / CAS Elite Institute',
      'Full CSC & ANSO Fellowships',
      'UCAS Degree Conferral',
      'Leading Greater Bay Area Hub'
    ]),
    logo: '/images/universities/logos/siat.webp',
    isActive: true,
    officialUrl: 'https://www.siat.ac.cn',
    aliases: JSON.stringify([
      'SIAT',
      'Shenzhen Institute of Advanced Technology',
      'Shenzhen Institutes of Advanced Technology',
      '中国科学院深圳先进技术研究院',
      'CAS SIAT'
    ]),
    legacySlugs: JSON.stringify(['shenzhen-institute-of-advanced-technology']),
    relationshipType: 'public_direct_application',
    relationshipEvidenceUrl: 'https://english.siat.ac.cn',
    recognitionAuthority: 'Ministry of Education (MoE), PR China & Chinese Academy of Sciences',
    recognitionSourceUrl: 'http://www.moe.gov.cn/',
    sourceUrls: JSON.stringify([
      'https://www.siat.ac.cn',
      'https://english.siat.ac.cn',
      'https://english.ucas.ac.cn'
    ]),
    lastVerifiedAt: new Date(),
    verificationExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    verificationStatus: 'verified'
  };

  let siatId;
  if (existingSiat) {
    const updated = await prisma.university.update({
      where: { id: existingSiat.id },
      data: siatData
    });
    siatId = updated.id;
    console.log(`Updated SIAT (${siatId})`);
  } else {
    const created = await prisma.university.create({
      data: siatData
    });
    siatId = created.id;
    console.log(`Created SIAT (${siatId})`);
  }

  // Clear existing programs/fees/scholarships for SIAT to avoid duplicates
  await prisma.program.deleteMany({ where: { universityId: siatId } });
  await prisma.fee.deleteMany({ where: { universityId: siatId } });
  await prisma.scholarship.deleteMany({ where: { universityId: siatId } });

  // Add SIAT Programs
  const siatMajorsMaster = [
    'Physical Chemistry',
    'Chemistry and Physics of Polymers',
    'Chemical Biology',
    'Biochemistry and Molecular Biology',
    'Pattern Recognition and Intelligent Systems',
    'Computer Applied Technology',
    'Optical Engineering',
    'Biomedical Engineering'
  ];
  for (const m of siatMajorsMaster) {
    await prisma.program.create({
      data: {
        universityId: siatId,
        level: 'Master',
        name: m,
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 30,000 / year (100% Free with Scholarship)',
        applicationDeadline: 'Scholarship: February 28, 2027; Self-funded: April 15, 2027',
        eligibility: JSON.stringify([
          'Bachelor degree equivalent',
          'GPA >= 3.0/4.0 or 80/100',
          'Age under 35',
          'English proficiency or HSK 5 (180+) for Chinese medium'
        ]),
        sourceUrl: 'https://is.ucas.ac.cn/',
        status: 'active'
      }
    });
  }

  const siatMajorsPhD = [
    'Physical Chemistry',
    'Chemistry and Physics of Polymers',
    'Chemical Biology',
    'Microbiology',
    'Neurobiology',
    'Biochemistry and Molecular Biology',
    'Pattern Recognition and Intelligent Systems',
    'Computer Applied Technology',
    'Optical Engineering',
    'Biomedical Engineering'
  ];
  for (const m of siatMajorsPhD) {
    await prisma.program.create({
      data: {
        universityId: siatId,
        level: 'Doctoral',
        name: m,
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 40,000 / year (100% Free with Scholarship)',
        applicationDeadline: 'Scholarship: February 28, 2027; Self-funded: April 15, 2027',
        eligibility: JSON.stringify([
          'Master degree equivalent',
          'Bachelor & Master GPA >= 3.0/4.0 or 80/100',
          'Age under 40',
          'English proficiency or HSK 5 (180+) for Chinese medium'
        ]),
        sourceUrl: 'https://is.ucas.ac.cn/',
        status: 'active'
      }
    });
  }

  // SIAT Fees
  await prisma.fee.createMany({
    data: [
      {
        universityId: siatId,
        item: 'Application Fee',
        cost: '600 CNY (Waived for CSC, ANSO & UCAS scholarship applicants)',
        refundable: 'No',
        validFor: '2027 intake',
        sourceUrl: 'https://is.ucas.ac.cn/'
      },
      {
        universityId: siatId,
        item: 'Tuition Fee (Master)',
        cost: '30,000 CNY / year (100% waived on scholarship)',
        refundable: '',
        validFor: '2027 intake',
        sourceUrl: 'https://is.ucas.ac.cn/'
      },
      {
        universityId: siatId,
        item: 'Tuition Fee (PhD)',
        cost: '40,000 CNY / year (100% waived on scholarship)',
        refundable: '',
        validFor: '2027 intake',
        sourceUrl: 'https://is.ucas.ac.cn/'
      },
      {
        universityId: siatId,
        item: 'SIAT Campus Accommodation',
        cost: '500 CNY / person / month (double/triple with private bath)',
        refundable: '',
        validFor: '2027 intake',
        sourceUrl: 'https://is.ucas.ac.cn/'
      },
      {
        universityId: siatId,
        item: 'Comprehensive Medical Insurance',
        cost: '800 CNY / year (Included in scholarships)',
        refundable: '',
        validFor: '2027 intake',
        sourceUrl: 'https://is.ucas.ac.cn/'
      }
    ]
  });

  // SIAT Scholarships
  await prisma.scholarship.createMany({
    data: [
      {
        universityId: siatId,
        title: 'Chinese Government Scholarship (CSC Type B / Agency 80001)',
        type: 'Full',
        details: JSON.stringify([
          '100% Tuition Exemption',
          'Free On-Campus Accommodation or Housing Subsidy',
          'Monthly Living Stipend: Master 3,500 RMB/month, PhD 5,000 RMB/month',
          'Comprehensive Medical Insurance'
        ]),
        amount: 'Full Scholarship + Monthly Stipend',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        deadline: 'February 28, 2027',
        sourceUrl: 'https://is.ucas.ac.cn/',
        status: 'active'
      },
      {
        universityId: siatId,
        title: 'CAS-ANSO Scholarship for International Students',
        type: 'Full',
        details: JSON.stringify([
          '100% Tuition Exemption',
          'Free Accommodation at SIAT',
          'Monthly Living Stipend: Master 4,000 RMB/month, PhD 6,000–7,000 RMB/month',
          'Comprehensive Medical Insurance & International Travel Allowance (qualifying candidates)'
        ]),
        amount: 'Up to 7,000 RMB/month + Tuition + Dorm',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        deadline: 'February 28, 2027',
        sourceUrl: 'https://is.ucas.ac.cn/',
        status: 'active'
      },
      {
        universityId: siatId,
        title: 'UCAS International Student Scholarship & SIAT Research Fellowship',
        type: 'Full',
        details: JSON.stringify([
          'Full Tuition Waiver',
          'Monthly Living Allowance: Master 3,000 RMB/month, PhD 3,500 RMB/month (plus SIAT lab top-up)',
          'Comprehensive Medical Insurance'
        ]),
        amount: 'Tuition Waiver + Monthly Stipend',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        deadline: 'February 28, 2027',
        sourceUrl: 'https://is.ucas.ac.cn/',
        status: 'active'
      }
    ]
  });

  // 2. JSNU (Jiangsu Normal University)
  console.log('Syncing JSNU...');
  await prisma.university.update({
    where: { slug: 'jsnu' },
    data: {
      cscAgencyNumber: '10320',
      isCscDesignated: true,
      aliases: JSON.stringify(['JSNU', 'Jiangsu Normal University', '江苏师范大学', 'JSU Xuzhou']),
      legacySlugs: JSON.stringify(['jiangsu-normal-university']),
      lastVerifiedAt: new Date()
    }
  });

  // Add JSNU CSC High-Level Scholarship if not already present
  const jsnuUni = await prisma.university.findUnique({ where: { slug: 'jsnu' } });
  const existingJsnuCsc = await prisma.scholarship.findFirst({
    where: { universityId: jsnuUni.id, title: { contains: 'Chinese Government Scholarship' } }
  });
  if (!existingJsnuCsc) {
    await prisma.scholarship.create({
      data: {
        universityId: jsnuUni.id,
        title: 'Chinese Government Scholarship (CSC High-Level Postgraduate Program - Type B)',
        type: 'Full',
        details: JSON.stringify([
          'Agency Number: 10320 (Type B)',
          '100% Full Tuition Exemption',
          'Free On-Campus University Dormitory',
          'Monthly Living Allowance: Master 3,000 RMB/month, PhD 3,500 RMB/month',
          'Comprehensive Medical Insurance for International Students'
        ]),
        amount: '100% Tuition + Free Housing + 3,000–3,500 RMB/mo Stipend',
        eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
        deadline: 'Early 2027 (Pre-admission required via jsnu.17gz.org prior to CSC submission)',
        sourceUrl: 'https://jsnu.17gz.org/',
        status: 'active'
      }
    });
    console.log('Added JSNU CSC Scholarship');
  }

  // 3. NEFU (Northeast Forestry University)
  console.log('Syncing NEFU...');
  const nefuUni = await prisma.university.findUnique({ where: { slug: 'northeast-forestry-university' } });
  if (nefuUni) {
    await prisma.university.update({
      where: { id: nefuUni.id },
      data: {
        cscAgencyNumber: '10225',
        isCscDesignated: true,
        aliases: JSON.stringify(['NEFU', 'Northeast Forestry University', '东北林业大学']),
        legacySlugs: JSON.stringify(['nefu']),
        lastVerifiedAt: new Date()
      }
    });

    // Check if NEFU CSC High-Level Scholarship exists
    const existingNefuCsc = await prisma.scholarship.findFirst({
      where: { universityId: nefuUni.id, title: { contains: 'Chinese Government Scholarship' } }
    });
    if (!existingNefuCsc) {
      await prisma.scholarship.create({
        data: {
          universityId: nefuUni.id,
          title: 'Chinese Government Scholarship (CSC High-Level Doctoral Program - Type B)',
          type: 'Full',
          details: JSON.stringify([
            'Agency Number: 10225 (Type B)',
            'Full Tuition Waiver (CNY 32,000–38,000/year covered)',
            'Free On-Campus Housing',
            'Monthly Living Allowance: Doctoral 3,500 CNY/month',
            'Comprehensive Medical Insurance (CNY 800/year covered)'
          ]),
          amount: 'Full Tuition + Dorm + 3,500 CNY/month Stipend',
          eligiblePrograms: JSON.stringify(['Doctoral']),
          deadline: 'February 15, 2027 (Dual submission via studyinchina.csc.edu.cn & istudy.nefu.edu.cn)',
          sourceUrl: 'https://istudy.nefu.edu.cn/',
          status: 'active'
        }
      });
      console.log('Added NEFU CSC Scholarship');
    }

    // Add NEFU Doctoral English/Chinese Programs
    const nefuDocMajors = [
      { name: 'Forestry (Tree Genetics, Silviculture, Protection, Wildlife Conservation)', lang: 'English, Chinese', tuition: 'CNY 38,000/year' },
      { name: 'Biomass Energy and Materials (Forestry Engineering)', lang: 'English, Chinese', tuition: 'CNY 38,000/year' },
      { name: 'Biology (Microbiology, Developmental Biology, Cell Biology, Biochemistry & Molecular Biology)', lang: 'English, Chinese', tuition: 'CNY 38,000/year' },
      { name: 'Ecology (Ecosystem Ecology & Restoration Ecology)', lang: 'English, Chinese', tuition: 'CNY 38,000/year' },
      { name: 'Mechanical Engineering (Automation, Mechatronics, Vehicle)', lang: 'Chinese', tuition: 'CNY 32,000/year' },
      { name: 'Low-Altitude Technology and Engineering (Disaster Prevention, Remote Sensing)', lang: 'Chinese', tuition: 'CNY 32,000/year' }
    ];

    for (const prog of nefuDocMajors) {
      const exists = await prisma.program.findFirst({
        where: { universityId: nefuUni.id, level: 'Doctoral', name: prog.name }
      });
      if (!exists) {
        await prisma.program.create({
          data: {
            universityId: nefuUni.id,
            level: 'Doctoral',
            name: prog.name,
            languages: prog.lang,
            duration: '4 years',
            intakes: 'September',
            tuition: prog.tuition,
            applicationDeadline: 'CSC: February 15, 2027; Self-funded: June 30, 2027',
            eligibility: JSON.stringify([
              'Master degree or equivalent',
              'Age under 40',
              'English IELTS 6.5+ or TOEFL 95+ (for English taught) or HSK 4/5 180+ (for Chinese taught)',
              'Research plan >= 1,000 words & Two Professor Recommendation Letters'
            ]),
            sourceUrl: 'https://istudy.nefu.edu.cn/',
            status: 'active'
          }
        });
      }
    }
  }

  // 4. XSYU (Xi'an Shiyou University)
  console.log('Syncing XSYU...');
  const xsyuUni = await prisma.university.findUnique({ where: { slug: 'xsyu' } });
  if (xsyuUni) {
    await prisma.university.update({
      where: { id: xsyuUni.id },
      data: {
        cscAgencyNumber: '10705',
        isCscDesignated: true,
        legacySlugs: JSON.stringify(['xian-shiyou-university']),
        lastVerifiedAt: new Date()
      }
    });

    // Check if XSYU CSC Scholarship exists
    const existingXsyuCsc = await prisma.scholarship.findFirst({
      where: { universityId: xsyuUni.id, title: { contains: 'Chinese Government Scholarship' } }
    });
    if (!existingXsyuCsc) {
      await prisma.scholarship.create({
        data: {
          universityId: xsyuUni.id,
          title: 'Chinese Government Scholarship (CSC High-Level Postgraduate Program - Type B)',
          type: 'Full',
          details: JSON.stringify([
            'Agency Code: 10705 (Type B)',
            'Full Tuition Exemption',
            'On-Campus Assigned Accommodation',
            'Monthly Living Allowance: Master 3,000 RMB/month, PhD 3,500 RMB/month',
            'Comprehensive Medical Insurance for International Students'
          ]),
          amount: 'Full Tuition + Dorm + 3,000–3,500 RMB/mo Stipend',
          eligiblePrograms: JSON.stringify(['Master', 'Doctoral']),
          deadline: 'January 15, 2027 (Strict Deadline)',
          sourceUrl: 'https://xsyu.at0086.cn/student',
          status: 'active'
        }
      });
      console.log('Added XSYU CSC Scholarship');
    }

    // Add Postgraduate Petroleum & Geology Programs for XSYU
    const xsyuPgMajors = [
      { level: 'Master', name: 'Petroleum and Natural Gas Engineering', lang: 'English, Chinese', duration: '3 years' },
      { level: 'Master', name: 'Geology', lang: 'English, Chinese', duration: '3 years' },
      { level: 'Master', name: 'Geological Resources and Geological Engineering', lang: 'English, Chinese', duration: '3 years' },
      { level: 'Doctoral', name: 'Petroleum and Natural Gas Engineering', lang: 'English, Chinese', duration: '4 years' }
    ];

    for (const prog of xsyuPgMajors) {
      const exists = await prisma.program.findFirst({
        where: { universityId: xsyuUni.id, level: prog.level, name: prog.name }
      });
      if (!exists) {
        await prisma.program.create({
          data: {
            universityId: xsyuUni.id,
            level: prog.level,
            name: prog.name,
            languages: prog.lang,
            duration: prog.duration,
            intakes: 'September',
            tuition: prog.level === 'Doctoral' ? '25,000 CNY/Year (100% Covered on CSC)' : '20,000 CNY/Year (100% Covered on CSC)',
            applicationDeadline: 'January 15, 2027',
            eligibility: JSON.stringify([
              prog.level === 'Doctoral' ? 'Master degree in relevant discipline; Age under 40' : 'Bachelor degree; Age under 35',
              'English: IELTS 6.0 / TOEFL 75 / Duolingo 100 / English Medium Certificate',
              'Chinese: HSK 4 (180+) for Chinese-taught programs',
              'Mandatory XSYU Supervisor Acceptance Letter'
            ]),
            sourceUrl: 'https://xsyu.at0086.cn/student',
            status: 'active'
          }
        });
      }
    }
  }

  // 5. NMU (Nanjing Medical University)
  console.log('Syncing NMU...');
  const nmuUni = await prisma.university.findUnique({ where: { slug: 'nanjing-medical-university' } });
  if (nmuUni) {
    await prisma.university.update({
      where: { id: nmuUni.id },
      data: {
        isMoeMbbsListed: true,
        legacySlugs: JSON.stringify(['nmu']),
        aliases: JSON.stringify(['NMU', 'Nanjing Medical University', '南京医科大学']),
        lastVerifiedAt: new Date()
      }
    });

    // Update MBBS program with exact 2027 details
    const mbbsProg = await prisma.program.findFirst({
      where: { universityId: nmuUni.id, name: { contains: 'MBBS' } }
    });
    if (mbbsProg) {
      await prisma.program.update({
        where: { id: mbbsProg.id },
        data: {
          name: 'Bachelor of Medicine & Bachelor of Surgery (MBBS / Clinical Medicine)',
          duration: '6 Years (5 Years Academic + 1 Year Clinical Internship)',
          languages: 'English',
          tuition: 'CNY 34,000 / year',
          applicationDeadline: 'January 1, 2027 – June 30, 2027',
          eligibility: JSON.stringify([
            'High School Diploma / Grade 12 with strong Biology, Chemistry, Physics & Mathematics',
            'Age: 18 to 25 years (under 18 requires notarized guardianship)',
            'Mandatory China Scholastic Competency Assessment (CSCA) in Mathematics & Chemistry',
            'Online Interview with NMU Admissions Committee',
            'Pre-admission Deposit: CNY 13,000 (Non-refundable, credited to tuition upon arrival)'
          ]),
          sourceUrl: 'http://admission.njmu.edu.cn/'
        }
      });
      console.log('Updated NMU MBBS Program details');
    }

    // Ensure NMU fees
    const feesData = [
      { item: 'Registration Fee', cost: '500 CNY', refundable: 'No', validFor: '2027 intake', sourceUrl: 'http://admission.njmu.edu.cn/' },
      { item: 'Tuition Fee (MBBS)', cost: '34,000 CNY / year', refundable: '', validFor: '2027 intake', sourceUrl: 'http://admission.njmu.edu.cn/' },
      { item: 'Accommodation (Jiangning Campus)', cost: '6,000 CNY / year (Double room)', refundable: '', validFor: '2027 intake', sourceUrl: 'http://admission.njmu.edu.cn/' },
      { item: 'Accommodation (Wutai Campus)', cost: '6,000 – 8,000 CNY / year (Quad/Triple/Double room)', refundable: '', validFor: '2027 intake', sourceUrl: 'http://admission.njmu.edu.cn/' },
      { item: 'Pre-Admission Deposit', cost: '13,000 CNY (Credited toward tuition upon arrival)', refundable: 'No', validFor: '2027 intake', sourceUrl: 'http://admission.njmu.edu.cn/' }
    ];

    for (const f of feesData) {
      const exists = await prisma.fee.findFirst({
        where: { universityId: nmuUni.id, item: f.item }
      });
      if (!exists) {
        await prisma.fee.create({
          data: {
            universityId: nmuUni.id,
            item: f.item,
            cost: f.cost,
            refundable: f.refundable,
            validFor: f.validFor,
            sourceUrl: f.sourceUrl
          }
        });
      }
    }
  }

  console.log('--- Batch 6 University Database Sync Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

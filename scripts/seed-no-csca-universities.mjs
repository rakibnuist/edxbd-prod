import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting No-CSCA Universities & Exemption Update ---');

  // 1. Update Shenyang City University programs
  const sycu = await prisma.university.findFirst({
    where: { slug: 'shenyang-city-university' },
    include: { programs: true },
  });

  if (sycu) {
    console.log(`Updating Shenyang City University (${sycu.programs.length} programs)...`);
    for (const prog of sycu.programs) {
      let elig = [];
      try {
        elig = JSON.parse(prog.eligibility || '[]');
      } catch {
        elig = [];
      }
      if (!elig.some(e => /CSCA/i.test(e))) {
        elig.unshift('CSCA exam is not required.');
        await prisma.program.update({
          where: { id: prog.id },
          data: {
            eligibility: JSON.stringify(elig),
            sourceUrl: prog.sourceUrl || 'https://www.shenyangcu.edu.cn',
          },
        });
        console.log(`  ✓ Updated program: ${prog.name}`);
      }
    }
  }

  // 2. Update Guangzhou City Construction College (gzccc) language programs
  const gzccc = await prisma.university.findFirst({
    where: { slug: 'gzccc' },
    include: { programs: true },
  });

  if (gzccc) {
    console.log(`Updating GZCCC (${gzccc.programs.length} programs)...`);
    for (const prog of gzccc.programs) {
      let elig = [];
      try {
        elig = JSON.parse(prog.eligibility || '[]');
      } catch {
        elig = [];
      }
      if (!elig.some(e => /CSCA/i.test(e))) {
        elig.unshift('CSCA exam is not required.');
        await prisma.program.update({
          where: { id: prog.id },
          data: {
            eligibility: JSON.stringify(elig),
            sourceUrl: prog.sourceUrl || 'https://www.gzccc.edu.cn',
          },
        });
        console.log(`  ✓ Updated program: ${prog.name}`);
      }
    }
  }

  // 3. Upsert Panzhihua University
  console.log('Upserting Panzhihua University...');
  const pzu = await prisma.university.upsert({
    where: { slug: 'panzhihua-university' },
    update: {
      name: 'Panzhihua University',
      location: 'Panzhihua, Sichuan, China',
      country: 'China',
      city: 'Panzhihua',
      intake: 'March, September',
      degree: 'Bachelor',
      taught: 'English, Chinese',
      rankingCountry: 394,
      rankingNational: 394,
      rankingWorld: 1600,
      majors: 'Computer Science and Technology, International Economics and Trade',
      tuition: 'CNY 6,000 / year (After CNY 3,000 President Scholarship; Original CNY 9,000)',
      tuitionDetails: JSON.stringify([
        'Undergraduate Programs: CNY 9,000 / year (Net CNY 6,000 / year after President Scholarship)',
        'Hostel: CNY 3,000 / year',
        'Registration: CNY 500 / year',
        'Medical Insurance: CNY 1,000 / year',
        'Residence Permit: CNY 400 / year',
      ]),
      documents: JSON.stringify([
        'Valid International Passport Scan',
        'High School Diploma (certified translation)',
        'Academic Transcripts',
        'Foreigner Physical Examination Form',
        'Certificate of Non-Criminal Record (Police Clearance)',
        'English proficiency certificate or MOI certificate',
      ]),
      deadlineApplication: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
      deadlineStartDate: 'March 2027 / September 2027',
      notes: JSON.stringify([
        'Panzhihua University (PZHU) is an accredited public university in Panzhihua, Sichuan, approved by the Ministry of Education.',
        'English-taught Bachelor programs in Computer Science and International Economics & Trade.',
        'No CSCA exam required for international student admission.',
        'Substantial President Scholarship reduces annual tuition to CNY 6,000/year.',
        'Official Admissions: www.pzhu.edu.cn | International Office: gjc.pzhu.edu.cn',
      ]),
      badges: JSON.stringify(['President Scholarship', 'English Taught', 'March Intake', 'Engineering & Tech', 'No CSCA Exam']),
      logo: '/images/campaigns/march-2027/panzhihua-university.png',
      isActive: true,
      officialUrl: 'https://www.pzhu.edu.cn',
      aliases: JSON.stringify(['PZHU', 'Panzhihua University', 'Panzihua', 'Panzihua University', '攀枝花学院', 'Panzhihua']),
      legacySlugs: JSON.stringify(['pzhu', 'pzu']),
      relationshipType: 'authorized_representative',
      verificationStatus: 'verified',
      recognitionAuthority: 'Sichuan Provincial Department of Education & Ministry of Education',
      recognitionSourceUrl: 'https://www.moe.gov.cn/',
      sourceUrls: JSON.stringify([
        'https://www.pzhu.edu.cn',
        'https://gjc.pzhu.edu.cn/',
        'https://www.shanghairanking.com/universities/panzhihua-university',
      ]),
      lastVerifiedAt: new Date(),
    },
    create: {
      slug: 'panzhihua-university',
      name: 'Panzhihua University',
      location: 'Panzhihua, Sichuan, China',
      country: 'China',
      city: 'Panzhihua',
      intake: 'March, September',
      degree: 'Bachelor',
      taught: 'English, Chinese',
      rankingCountry: 394,
      rankingNational: 394,
      rankingWorld: 1600,
      majors: 'Computer Science and Technology, International Economics and Trade',
      tuition: 'CNY 6,000 / year (After CNY 3,000 President Scholarship; Original CNY 9,000)',
      tuitionDetails: JSON.stringify([
        'Undergraduate Programs: CNY 9,000 / year (Net CNY 6,000 / year after President Scholarship)',
        'Hostel: CNY 3,000 / year',
        'Registration: CNY 500 / year',
        'Medical Insurance: CNY 1,000 / year',
        'Residence Permit: CNY 400 / year',
      ]),
      documents: JSON.stringify([
        'Valid International Passport Scan',
        'High School Diploma (certified translation)',
        'Academic Transcripts',
        'Foreigner Physical Examination Form',
        'Certificate of Non-Criminal Record (Police Clearance)',
        'English proficiency certificate or MOI certificate',
      ]),
      deadlineApplication: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
      deadlineStartDate: 'March 2027 / September 2027',
      notes: JSON.stringify([
        'Panzhihua University (PZHU) is an accredited public university in Panzhihua, Sichuan, approved by the Ministry of Education.',
        'English-taught Bachelor programs in Computer Science and International Economics & Trade.',
        'No CSCA exam required for international student admission.',
        'Substantial President Scholarship reduces annual tuition to CNY 6,000/year.',
        'Official Admissions: www.pzhu.edu.cn | International Office: gjc.pzhu.edu.cn',
      ]),
      badges: JSON.stringify(['President Scholarship', 'English Taught', 'March Intake', 'Engineering & Tech', 'No CSCA Exam']),
      logo: '/images/campaigns/march-2027/panzhihua-university.png',
      isActive: true,
      officialUrl: 'https://www.pzhu.edu.cn',
      aliases: JSON.stringify(['PZHU', 'Panzhihua University', 'Panzihua', 'Panzihua University', '攀枝花学院', 'Panzhihua']),
      legacySlugs: JSON.stringify(['pzhu', 'pzu']),
      relationshipType: 'authorized_representative',
      verificationStatus: 'verified',
      recognitionAuthority: 'Sichuan Provincial Department of Education & Ministry of Education',
      recognitionSourceUrl: 'https://www.moe.gov.cn/',
      sourceUrls: JSON.stringify([
        'https://www.pzhu.edu.cn',
        'https://gjc.pzhu.edu.cn/',
        'https://www.shanghairanking.com/universities/panzhihua-university',
      ]),
      lastVerifiedAt: new Date(),
    },
  });

  // Clean existing programs, fees, scholarships for Panzhihua to prevent dupes
  await prisma.program.deleteMany({ where: { universityId: pzu.id } });
  await prisma.fee.deleteMany({ where: { universityId: pzu.id } });
  await prisma.scholarship.deleteMany({ where: { universityId: pzu.id } });

  await prisma.program.createMany({
    data: [
      {
        universityId: pzu.id,
        name: 'Computer Science and Technology',
        level: 'Bachelor',
        subject: 'Computer Science & Engineering',
        languages: 'English',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '9,000 CNY/Year',
        tuitionAfterScholarship: '6,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
        eligibility: JSON.stringify([
          'High school diploma with Mathematics & Science background (GPA >= 60%)',
          'Age 18–25',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal record, and foreigner physical examination form',
        ]),
        sourceUrl: 'https://www.pzhu.edu.cn',
        status: 'active',
      },
      {
        universityId: pzu.id,
        name: 'International Economics and Trade',
        level: 'Bachelor',
        subject: 'Business & International Trade',
        languages: 'English',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '9,000 CNY/Year',
        tuitionAfterScholarship: '6,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
        eligibility: JSON.stringify([
          'High school diploma with Mathematics & Commerce/Arts background (GPA >= 60%)',
          'Age 18–25',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal record, and foreigner physical examination form',
        ]),
        sourceUrl: 'https://www.pzhu.edu.cn',
        status: 'active',
      },
    ],
  });

  await prisma.scholarship.create({
    data: {
      universityId: pzu.id,
      title: 'Panzhihua University President Scholarship',
      type: 'Partial (Tuition Reduction)',
      details: JSON.stringify([
        'Annual tuition reduction of CNY 3,000/year for eligible international students',
        'Net tuition payable: CNY 6,000 / year (approx $830 USD)',
        'Applicable to English-taught bachelor programs',
        'Renewable annually based on satisfactory academic performance and attendance',
      ]),
      amount: 'CNY 3,000 / year Tuition Waiver (Net Tuition: CNY 6,000 / year)',
      condition: 'High school graduate, age 18-25, clean criminal background. Minimum 60% academic average.',
      eligiblePrograms: JSON.stringify(['Computer Science and Technology', 'International Economics and Trade']),
      coverage: 'Annual CNY 3,000 tuition discount directly applied to student invoice',
      deadline: '20 February 2027 (March Intake) / 30 June 2027 (September Intake)',
      sourceUrl: 'https://www.pzhu.edu.cn',
      status: 'active',
    },
  });

  await prisma.fee.createMany({
    data: [
      {
        universityId: pzu.id,
        item: 'Undergraduate Tuition (Net after President Scholarship)',
        cost: '6,000 CNY/Year',
        notes: 'English-medium bachelor programs; original tuition CNY 9,000/year',
        sourceUrl: 'https://www.pzhu.edu.cn',
      },
      {
        universityId: pzu.id,
        item: 'On-Campus Accommodation',
        cost: '3,000 CNY/Year',
        notes: 'Standard international student residence',
        sourceUrl: 'https://www.pzhu.edu.cn',
      },
      {
        universityId: pzu.id,
        item: 'Registration Fee',
        cost: '500 CNY/Year',
        sourceUrl: 'https://www.pzhu.edu.cn',
      },
      {
        universityId: pzu.id,
        item: 'Comprehensive Medical Insurance',
        cost: '1,000 CNY/Year',
        sourceUrl: 'https://www.pzhu.edu.cn',
      },
      {
        universityId: pzu.id,
        item: 'Residence Permit',
        cost: '400 CNY/Year',
        sourceUrl: 'https://www.pzhu.edu.cn',
      },
    ],
  });
  console.log('✓ Panzhihua University created/updated with programs and fees.');

  // 4. Upsert Changchun Sci-Tech University
  console.log('Upserting Changchun Sci-Tech University...');
  const cstu = await prisma.university.upsert({
    where: { slug: 'changchun-sci-tech-university' },
    update: {
      name: 'Changchun Sci-Tech University',
      location: 'Changchun, Jilin, China',
      country: 'China',
      city: 'Changchun',
      intake: 'March, September',
      degree: 'Bachelor, Foundation',
      taught: 'English, Chinese',
      rankingCountry: 30,
      rankingNational: 30,
      rankingWorld: 1900,
      majors: 'Artificial Intelligence, Computer Science and Technology, Mechanical Design Manufacturing and Automation, Architecture, Business Administration, Bioengineering',
      tuition: 'CNY 10,000 / year (Tuition + Hostel Package after scholarship; Preparation semester CNY 5,000)',
      tuitionDetails: JSON.stringify([
        'Preparation Semester (March): CNY 5,000 (tuition)',
        'Bachelor Degree Programs (Tuition + Hostel Package): CNY 10,000 / year after scholarship',
        'Medical Insurance: CNY 800 / year',
        'Residence Permit: CNY 400 / year',
      ]),
      documents: JSON.stringify([
        'Valid International Passport Scan',
        'High School Diploma (certified English translation)',
        'Complete Academic Transcripts',
        'Foreigner Physical Examination Form',
        'Certificate of Non-Criminal Record',
        'Financial Sponsor Letter / Bank Statement',
      ]),
      deadlineApplication: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
      deadlineStartDate: 'March 2027 / September 2027',
      notes: JSON.stringify([
        'Changchun Sci-Tech University (CSTU) is a premier applied university in Changchun, Jilin Province, ranked #30 in China Best Non-government Universities by ShanghaiRanking.',
        'March intake offers 0.5-year preparation semester (CNY 5,000) leading directly to 4-year Bachelor degree from September.',
        'Direct Bachelor entry package: tuition + accommodation bundled at CNY 10,000/year after scholarship.',
        'CSCA exam is not required for international admission.',
        'Official website: www.cstu.edu.cn',
      ]),
      badges: JSON.stringify(['Top 30 Private China', 'Degree + Hostel Package', 'March Preparation', 'No CSCA Exam', 'STEM & Applied Tech']),
      logo: '/images/campaigns/march-2027/changchun-sci-tech-university.gif',
      isActive: true,
      officialUrl: 'https://www.cstu.edu.cn',
      aliases: JSON.stringify(['CSTU', 'Changchun Sci-Tech University', 'Changcuan', 'Changcuan Sci-Tech', 'Changchun Sci Tech', '长春科技学院', 'Changchun Sci-Tech']),
      legacySlugs: JSON.stringify(['cstu']),
      relationshipType: 'authorized_representative',
      verificationStatus: 'verified',
      recognitionAuthority: 'Jilin Provincial Department of Education & Ministry of Education',
      recognitionSourceUrl: 'https://www.moe.gov.cn/',
      sourceUrls: JSON.stringify([
        'https://www.cstu.edu.cn',
        'https://www.shanghairanking.com/universities/changchun-sci-tech-university',
      ]),
      lastVerifiedAt: new Date(),
    },
    create: {
      slug: 'changchun-sci-tech-university',
      name: 'Changchun Sci-Tech University',
      location: 'Changchun, Jilin, China',
      country: 'China',
      city: 'Changchun',
      intake: 'March, September',
      degree: 'Bachelor, Foundation',
      taught: 'English, Chinese',
      rankingCountry: 30,
      rankingNational: 30,
      rankingWorld: 1900,
      majors: 'Artificial Intelligence, Computer Science and Technology, Mechanical Design Manufacturing and Automation, Architecture, Business Administration, Bioengineering',
      tuition: 'CNY 10,000 / year (Tuition + Hostel Package after scholarship; Preparation semester CNY 5,000)',
      tuitionDetails: JSON.stringify([
        'Preparation Semester (March): CNY 5,000 (tuition)',
        'Bachelor Degree Programs (Tuition + Hostel Package): CNY 10,000 / year after scholarship',
        'Medical Insurance: CNY 800 / year',
        'Residence Permit: CNY 400 / year',
      ]),
      documents: JSON.stringify([
        'Valid International Passport Scan',
        'High School Diploma (certified English translation)',
        'Complete Academic Transcripts',
        'Foreigner Physical Examination Form',
        'Certificate of Non-Criminal Record',
        'Financial Sponsor Letter / Bank Statement',
      ]),
      deadlineApplication: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
      deadlineStartDate: 'March 2027 / September 2027',
      notes: JSON.stringify([
        'Changchun Sci-Tech University (CSTU) is a premier applied university in Changchun, Jilin Province, ranked #30 in China Best Non-government Universities by ShanghaiRanking.',
        'March intake offers 0.5-year preparation semester (CNY 5,000) leading directly to 4-year Bachelor degree from September.',
        'Direct Bachelor entry package: tuition + accommodation bundled at CNY 10,000/year after scholarship.',
        'CSCA exam is not required for international admission.',
        'Official website: www.cstu.edu.cn',
      ]),
      badges: JSON.stringify(['Top 30 Private China', 'Degree + Hostel Package', 'March Preparation', 'No CSCA Exam', 'STEM & Applied Tech']),
      logo: '/images/campaigns/march-2027/changchun-sci-tech-university.gif',
      isActive: true,
      officialUrl: 'https://www.cstu.edu.cn',
      aliases: JSON.stringify(['CSTU', 'Changchun Sci-Tech University', 'Changcuan', 'Changcuan Sci-Tech', 'Changchun Sci Tech', '长春科技学院', 'Changchun Sci-Tech']),
      legacySlugs: JSON.stringify(['cstu']),
      relationshipType: 'authorized_representative',
      verificationStatus: 'verified',
      recognitionAuthority: 'Jilin Provincial Department of Education & Ministry of Education',
      recognitionSourceUrl: 'https://www.moe.gov.cn/',
      sourceUrls: JSON.stringify([
        'https://www.cstu.edu.cn',
        'https://www.shanghairanking.com/universities/changchun-sci-tech-university',
      ]),
      lastVerifiedAt: new Date(),
    },
  });

  // Clean existing programs, fees, scholarships for CSTU
  await prisma.program.deleteMany({ where: { universityId: cstu.id } });
  await prisma.fee.deleteMany({ where: { universityId: cstu.id } });
  await prisma.scholarship.deleteMany({ where: { universityId: cstu.id } });

  await prisma.program.createMany({
    data: [
      {
        universityId: cstu.id,
        name: 'Preparation to Bachelor Pathway',
        level: 'Foundation',
        subject: 'Preparatory & Foundation',
        languages: 'Chinese, English',
        duration: '0.5 Year Preparation + 4-Year Bachelor',
        intakes: 'March',
        tuition: '5,000 CNY/Semester',
        tuitionAfterScholarship: '5,000 CNY/Semester',
        applicationDeadline: '20 February 2027',
        eligibility: JSON.stringify([
          'High school diploma or Grade 12 completion',
          'Age 18–28',
          'CSCA exam is not required.',
          'Basic English or willingness to learn Chinese foundation',
          'Valid passport, physical examination form, and police clearance',
        ]),
        sourceUrl: 'https://www.cstu.edu.cn',
        status: 'active',
      },
      {
        universityId: cstu.id,
        name: 'Computer Science and Technology',
        level: 'Bachelor',
        subject: 'Computer Science & IT',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '15,000 CNY/Year',
        tuitionAfterScholarship: '10,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
        eligibility: JSON.stringify([
          'High school diploma with Mathematics background',
          'Age 18–28',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal background, and physical examination form',
        ]),
        sourceUrl: 'https://www.cstu.edu.cn',
        status: 'active',
      },
      {
        universityId: cstu.id,
        name: 'Artificial Intelligence',
        level: 'Bachelor',
        subject: 'Computer Science & AI',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '15,000 CNY/Year',
        tuitionAfterScholarship: '10,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
        eligibility: JSON.stringify([
          'High school diploma with Mathematics & Science background',
          'Age 18–28',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal background, and physical examination form',
        ]),
        sourceUrl: 'https://www.cstu.edu.cn',
        status: 'active',
      },
      {
        universityId: cstu.id,
        name: 'Business Administration',
        level: 'Bachelor',
        subject: 'Business & Management',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '14,000 CNY/Year',
        tuitionAfterScholarship: '10,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
        eligibility: JSON.stringify([
          'High school diploma with passing grades',
          'Age 18–28',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal background, and physical examination form',
        ]),
        sourceUrl: 'https://www.cstu.edu.cn',
        status: 'active',
      },
      {
        universityId: cstu.id,
        name: 'Mechanical Design, Manufacturing and Automation',
        level: 'Bachelor',
        subject: 'Engineering',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'March, September',
        tuition: '15,000 CNY/Year',
        tuitionAfterScholarship: '10,000 CNY/Year',
        applicationDeadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
        eligibility: JSON.stringify([
          'High school diploma with Physics and Mathematics background',
          'Age 18–28',
          'CSCA exam is not required.',
          'English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate',
          'Valid passport, clean criminal background, and physical examination form',
        ]),
        sourceUrl: 'https://www.cstu.edu.cn',
        status: 'active',
      },
    ],
  });

  await prisma.scholarship.create({
    data: {
      universityId: cstu.id,
      title: 'Changchun Sci-Tech University Degree Tuition & Hostel Package Scholarship',
      type: 'Partial (Tuition & Hostel Waiver)',
      details: JSON.stringify([
        'Tuition and on-campus hostel bundled package at CNY 10,000/year after scholarship',
        'Includes 4-year degree tuition and standard student dormitory',
        'Guaranteed upon admission meeting standard high school qualifications',
      ]),
      amount: 'Tuition + Hostel Package: CNY 10,000 / year',
      condition: 'High school completion or equivalent, age 18-28, clean criminal background.',
      eligiblePrograms: JSON.stringify([
        'Computer Science and Technology',
        'Artificial Intelligence',
        'Business Administration',
        'Mechanical Design, Manufacturing and Automation',
      ]),
      coverage: 'Tuition and hostel reduction directly applied to annual university invoice',
      deadline: '20 February 2027 (March Intake) / 30 June 2027 (September Intake)',
      sourceUrl: 'https://www.cstu.edu.cn',
      status: 'active',
    },
  });

  await prisma.fee.createMany({
    data: [
      {
        universityId: cstu.id,
        item: 'Preparation Semester Tuition (March Intake)',
        cost: '5,000 CNY/Semester',
        notes: '0.5-year preparatory foundation leading to 4-year degree in September',
        sourceUrl: 'https://www.cstu.edu.cn',
      },
      {
        universityId: cstu.id,
        item: 'Bachelor Degree Tuition + Hostel Package (Net after Scholarship)',
        cost: '10,000 CNY/Year',
        notes: 'All-inclusive annual package covering degree tuition and on-campus accommodation',
        sourceUrl: 'https://www.cstu.edu.cn',
      },
      {
        universityId: cstu.id,
        item: 'Comprehensive Medical Insurance',
        cost: '800 CNY/Year',
        sourceUrl: 'https://www.cstu.edu.cn',
      },
      {
        universityId: cstu.id,
        item: 'Residence Permit',
        cost: '400 CNY/Year',
        sourceUrl: 'https://www.cstu.edu.cn',
      },
    ],
  });
  console.log('✓ Changchun Sci-Tech University created/updated with programs and fees.');

  // 5. Update IntakeCampaign "university-profile-details"
  console.log('Updating university-profile-details in IntakeCampaign...');
  const campaignRecord = await prisma.intakeCampaign.findUnique({
    where: { slug: 'university-profile-details' },
  });

  if (campaignRecord) {
    const parsed = JSON.parse(campaignRecord.contentJson);
    const universities = parsed.universities || [];

    // Update Shenyang City University profile details
    const sycuProfile = universities.find(u => u.slug === 'shenyang-city-university');
    if (sycuProfile) {
      for (const p of sycuProfile.programs || []) {
        if (!p.qualifications) p.qualifications = [];
        if (!p.qualifications.some(q => /CSCA/i.test(q))) {
          p.qualifications.unshift('CSCA exam is not required.');
        }
      }
      console.log('  ✓ Updated Shenyang City University in profile details.');
    }

    // Update GZCCC profile details
    const gzcccProfile = universities.find(u => u.slug === 'gzccc');
    if (gzcccProfile) {
      for (const p of gzcccProfile.programs || []) {
        if (!p.qualifications) p.qualifications = [];
        if (!p.qualifications.some(q => /CSCA/i.test(q))) {
          p.qualifications.unshift('CSCA exam is not required.');
        }
      }
      console.log('  ✓ Updated GZCCC in profile details.');
    }

    // Panzhihua Profile
    let pzuProfile = universities.find(u => u.slug === 'panzhihua-university');
    const pzuProfileData = {
      slug: 'panzhihua-university',
      overview: 'Panzhihua University is a recognized public university located in Panzhihua, Sichuan, ranked #394 in China by ShanghaiRanking. Welcoming international students with accredited English-taught bachelor degrees in Computer Science and International Trade, no CSCA exam requirement, and generous President Scholarship awards.',
      highlights: [
        {
          title: 'Ranking & Statutory Recognition',
          description: 'Ranked #394 in China by ShanghaiRanking and accredited under Sichuan Provincial Department of Education & Ministry of Education.',
        },
        {
          title: 'No CSCA Exam Required',
          description: 'Direct admission based on high school transcript evaluation; CSCA standardized test is not required.',
        },
        {
          title: 'President Scholarship',
          description: 'Annual CNY 3,000 President Scholarship reducing bachelor tuition to CNY 6,000 / year.',
        },
      ],
      programs: [
        {
          id: 'panzhihua-prog-cs',
          name: 'Computer Science and Technology',
          level: 'Bachelor',
          languages: ['English'],
          duration: '4 years',
          intake: 'March, September',
          deadline: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
          qualifications: [
            'CSCA exam is not required.',
            'High school diploma with Mathematics & Science background (GPA >= 60%)',
            'Age 18–25',
          ],
          languageRequirements: ['English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate'],
          documents: [
            'Valid International Passport Scan',
            'High School Diploma (certified translation)',
            'Academic Transcripts',
            'Foreigner Physical Examination Form',
            'Police Clearance Certificate',
          ],
          notes: ['English-medium instruction throughout 4 years'],
          fees: [
            {
              key: 'tuition',
              item: 'Tuition',
              amount: 9000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 6,000 / year (after President Scholarship)',
            },
            {
              key: 'housing',
              item: 'On-Campus Dormitory',
              amount: 3000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 3,000 / year',
            },
          ],
        },
        {
          id: 'panzhihua-prog-econ',
          name: 'International Economics and Trade',
          level: 'Bachelor',
          languages: ['English'],
          duration: '4 years',
          intake: 'March, September',
          deadline: '20 February 2027 (March Intake) / 30 June 2027 (Sept Intake)',
          qualifications: [
            'CSCA exam is not required.',
            'High school diploma with Mathematics & Commerce/Arts background (GPA >= 60%)',
            'Age 18–25',
          ],
          languageRequirements: ['English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate'],
          documents: [
            'Valid International Passport Scan',
            'High School Diploma (certified translation)',
            'Academic Transcripts',
            'Foreigner Physical Examination Form',
            'Police Clearance Certificate',
          ],
          notes: ['English-medium instruction throughout 4 years'],
          fees: [
            {
              key: 'tuition',
              item: 'Tuition',
              amount: 9000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 6,000 / year (after President Scholarship)',
            },
            {
              key: 'housing',
              item: 'On-Campus Dormitory',
              amount: 3000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 3,000 / year',
            },
          ],
        },
      ],
      scholarshipOptions: [
        {
          id: 'panzhihua-schol-president',
          title: 'Panzhihua University President Scholarship',
          type: 'Partial (Tuition Reduction)',
          levels: ['Bachelor'],
          coverage: ['Annual CNY 3,000 tuition discount directly applied to student invoice (Tuition: CNY 6,000 / year)'],
          conditions: ['High school graduate, age 18-25, clean criminal background. Minimum 60% academic average.'],
          renewal: ['Subject to annual academic review and 85%+ attendance.'],
          documents: ['Valid Passport Scan', 'High School Diploma & Transcripts', 'Physical Examination Form', 'Police Clearance'],
          applicationSteps: [
            'Submit transcripts and passport for free evaluation with EduExpress Dhaka.',
            'Complete online admission application alongside scholarship nomination.',
            'Receive official Admission Notice and Scholarship Confirmation.',
          ],
          status: 'open',
          notes: ['Guaranteed upon admission meeting standard requirements.'],
          tuitionReduction: {
            type: 'fixed',
            value: 3000,
            currency: 'CNY',
            period: 'year',
          },
        },
      ],
    };

    if (pzuProfile) {
      Object.assign(pzuProfile, pzuProfileData);
    } else {
      universities.push(pzuProfileData);
    }
    console.log('  ✓ Added/Updated Panzhihua University in profile details.');

    // Changchun Sci-Tech Profile
    let cstuProfile = universities.find(u => u.slug === 'changchun-sci-tech-university');
    const cstuProfileData = {
      slug: 'changchun-sci-tech-university',
      overview: 'Changchun Sci-Tech University (CSTU) is a premier non-government university in Changchun, Jilin Province, ranked #30 nationally by ShanghaiRanking. CSTU provides a unique Preparation + Bachelor pathway and bundled Degree + Hostel scholarship packages at CNY 10,000/year, with no CSCA exam requirement.',
      highlights: [
        {
          title: 'Ranking & Recognition',
          description: 'Ranked #30 Best Non-government University in China by ShanghaiRanking and accredited under Jilin Provincial Department of Education.',
        },
        {
          title: 'No CSCA Exam Required',
          description: 'Applicants are evaluated on academic merit; CSCA standardized examination is completely waived.',
        },
        {
          title: 'Degree + Hostel Package',
          description: 'Four-year bachelor degrees with bundled tuition and on-campus hostel capped at CNY 10,000 / year after scholarship.',
        },
      ],
      programs: [
        {
          id: 'cstu-prog-prep',
          name: 'Preparation to Bachelor Pathway',
          level: 'Foundation',
          languages: ['Chinese', 'English'],
          duration: '0.5 Year Preparation + 4-Year Bachelor',
          intake: 'March',
          deadline: '20 February 2027',
          qualifications: [
            'CSCA exam is not required.',
            'High school diploma or Grade 12 completion',
            'Age 18–28',
          ],
          languageRequirements: ['Basic English or willingness to learn Chinese foundation'],
          documents: ['Passport Scan', 'High School Diploma & Transcripts', 'Physical Examination Form', 'Police Clearance'],
          notes: ['Direct seamless progression to Bachelor degree in September 2027'],
          fees: [
            {
              key: 'tuition',
              item: 'Preparation Tuition',
              amount: 5000,
              currency: 'CNY',
              period: 'semester',
              stage: 'in_china',
              displayAmount: 'CNY 5,000 / semester',
            },
          ],
        },
        {
          id: 'cstu-prog-cs',
          name: 'Computer Science and Technology',
          level: 'Bachelor',
          languages: ['English', 'Chinese'],
          duration: '4 years',
          intake: 'March, September',
          deadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
          qualifications: [
            'CSCA exam is not required.',
            'High school diploma with Mathematics background',
            'Age 18–28',
          ],
          languageRequirements: ['English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate'],
          documents: ['Passport Scan', 'High School Diploma & Transcripts', 'Physical Examination Form', 'Police Clearance'],
          notes: ['Tuition + Hostel Package: CNY 10,000 / year'],
          fees: [
            {
              key: 'tuition',
              item: 'Tuition + Hostel Package',
              amount: 10000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 10,000 / year (all-inclusive)',
            },
          ],
        },
        {
          id: 'cstu-prog-ai',
          name: 'Artificial Intelligence',
          level: 'Bachelor',
          languages: ['English', 'Chinese'],
          duration: '4 years',
          intake: 'March, September',
          deadline: '20 February 2027 (March) / 30 June 2027 (Sept)',
          qualifications: [
            'CSCA exam is not required.',
            'High school diploma with Mathematics & Science background',
            'Age 18–28',
          ],
          languageRequirements: ['English proficiency: IELTS 5.5+, Duolingo 90+, or official English MOI certificate'],
          documents: ['Passport Scan', 'High School Diploma & Transcripts', 'Physical Examination Form', 'Police Clearance'],
          notes: ['Tuition + Hostel Package: CNY 10,000 / year'],
          fees: [
            {
              key: 'tuition',
              item: 'Tuition + Hostel Package',
              amount: 10000,
              currency: 'CNY',
              period: 'year',
              stage: 'in_china',
              displayAmount: 'CNY 10,000 / year (all-inclusive)',
            },
          ],
        },
      ],
      scholarshipOptions: [
        {
          id: 'cstu-schol-package',
          title: 'Changchun Sci-Tech University Degree Tuition & Hostel Package Scholarship',
          type: 'Partial (Tuition & Hostel Waiver)',
          levels: ['Bachelor'],
          coverage: ['Combined tuition and on-campus hostel capped at CNY 10,000/year for selected degree routes'],
          conditions: ['High school completion, age 18-28, clean criminal background.'],
          renewal: ['Subject to standard academic progression and attendance.'],
          documents: ['Passport Scan', 'High School Diploma & Transcripts', 'Physical Examination Form', 'Police Clearance'],
          applicationSteps: [
            'Submit transcripts and passport for free evaluation with EduExpress Dhaka.',
            'Complete online admission application alongside scholarship nomination.',
            'Receive official Admission Notice and Scholarship Confirmation.',
          ],
          status: 'open',
          notes: ['Guaranteed upon admission meeting standard requirements.'],
          tuitionReduction: {
            type: 'fixed',
            value: 5000,
            currency: 'CNY',
            period: 'year',
          },
        },
      ],
    };

    if (cstuProfile) {
      Object.assign(cstuProfile, cstuProfileData);
    } else {
      universities.push(cstuProfileData);
    }
    console.log('  ✓ Added/Updated Changchun Sci-Tech University in profile details.');

    await prisma.intakeCampaign.update({
      where: { slug: 'university-profile-details' },
      data: { contentJson: JSON.stringify(parsed) },
    });
    console.log('✓ Successfully saved updated IntakeCampaign.');
  }

  console.log('--- All database updates completed successfully ---');
}

main()
  .catch(e => {
    console.error('Error during execution:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

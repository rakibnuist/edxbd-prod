/**
 * Database synchronization and entity management for 18 WeChat-sourced 2027 Batch 2 updates & universities.
 * Zero competitor names (no GUANJUNLAIHUA, no STUDY IN CHINA).
 * Completely tailored for an international audience worldwide.
 */

import { WECHAT_BATCH2_18_GUIDES_DATA } from '../../src/data/newWechatBatch2Guides2027.ts';

export const WECHAT_BATCH2_18_GUIDE_SPECS = Object.values(WECHAT_BATCH2_18_GUIDES_DATA).map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  metaTitle: guide.metaTitle,
  metaDescription: guide.metaDescription,
  excerpt: guide.excerpt,
  category: guide.category,
  categories: guide.categories,
  tags: guide.tags,
  author: guide.author,
  reviewer: guide.reviewer,
  featuredImage: guide.featuredImage,
  sourceUrls: guide.sourceUrls,
  deadlineAt: guide.deadlineAt,
  content: guide.content,
}));

export async function upsert18WechatBatch2Universities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. Nanjing University (NJU) - New Record
  // ==========================================
  let nju = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'nanjing-university' },
        { aliases: { contains: 'Nanjing University' } },
        { legacySlugs: { contains: 'nju' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!nju) {
    nju = await prisma.university.create({
      data: {
        slug: 'nanjing-university',
        name: 'Nanjing University',
        location: 'Nanjing, Jiangsu, China',
        country: 'China',
        city: 'Nanjing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 5,
        rankingWorld: 95,
        rankingNational: 5,
        majors: 'Computer Science, Artificial Intelligence, Mathematics, Physics, Chemistry, Astronomy, Atmospheric Sciences, Economics, Business Administration, Chinese Language & Literature',
        tuition: 'CNY 21,000–35,000 / year (Covered under CSC Type A & Jiangsu Jasmine Scholarships)',
        tuitionDetails: JSON.stringify([
          'Undergraduate Programs (Liberal Arts): CNY 21,000 / academic year',
          'Undergraduate Programs (Science & Engineering): CNY 24,000 / academic year',
          'International Master Programs: CNY 28,000 / academic year',
          'Doctoral Programs: CNY 35,000 / academic year (100% Covered under CSC & NJU Scholarships)',
        ]),
        documents: JSON.stringify([
          'International Passport (Valid for at least 12 months)',
          'Senior High School Diploma & Official Transcripts (or Bachelor/Master Degree for Graduate)',
          'Foreigner Physical Examination Record',
          'Certificate of Non-Criminal Record',
          'Language Proficiency Certificate (HSK 5 score ≥ 210 or IELTS 6.5+ / TOEFL 90+)',
          'Personal Statement & Two Academic Recommendation Letters',
          'Financial Guarantee Statement',
        ]),
        deadlineApplication: '31 March 2027 (Undergraduate & CSC) / 15 April 2027 (Postgraduate)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'C9 League Founding Member · National Double First-Class Initiative',
          'Nature Index Global Top 10 in Physical and Chemical Sciences',
          'Historic Campuses: Xianlin (Modern Academic City) & Gulou (Downtown Cultural Center)',
          'Comprehensive Scholarship Options: CSC Type A (Agency 10284), Jiangsu Jasmine Scholarship, NJU President Scholarship',
          'Official Admissions Portal: hwxy.nju.edu.cn | Email: issd@nju.edu.cn',
        ]),
        badges: JSON.stringify(['C9 League', 'Double First-Class', 'QS Top 100', 'English Taught']),
        logo: '/images/universities/logos/nanjing-university.webp',
        isActive: true,
        officialUrl: 'https://www.nju.edu.cn',
        aliases: JSON.stringify(['NJU', 'Nanjing University', '南京大学']),
        legacySlugs: JSON.stringify(['nju']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.nju.edu.cn',
          'https://hwxy.nju.edu.cn',
          'https://studyinchina.csc.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // NJU Programs
  const njuPrograms = [
    {
      level: 'Bachelor',
      name: 'Computer Science and Technology (B.Eng.)',
      subject: 'Computer Science',
      languages: 'Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '24,000 CNY/Year',
      applicationDeadline: '31 March 2027',
      eligibility: JSON.stringify(['High school diploma with strong Math/Science', 'HSK 5 >= 210']),
      sourceUrl: 'https://hwxy.nju.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'Artificial Intelligence & Data Science (B.Eng.)',
      subject: 'Artificial Intelligence',
      languages: 'Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '24,000 CNY/Year',
      applicationDeadline: '31 March 2027',
      eligibility: JSON.stringify(['High school diploma with strong Math/Science', 'HSK 5 >= 210']),
      sourceUrl: 'https://hwxy.nju.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'International Economics and Trade (B.A.)',
      subject: 'Economics',
      languages: 'Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '21,000 CNY/Year',
      applicationDeadline: '31 March 2027',
      eligibility: JSON.stringify(['High school diploma', 'HSK 5 >= 210']),
      sourceUrl: 'https://hwxy.nju.edu.cn/',
      status: 'active',
    },
    {
      level: 'PhD',
      name: 'Atmospheric Sciences (Ph.D.)',
      subject: 'Atmospheric Sciences',
      languages: 'English',
      duration: '4 years',
      intakes: 'September',
      tuition: '35,000 CNY/Year (Waived under CSC)',
      applicationDeadline: '15 April 2027',
      eligibility: JSON.stringify(['Master degree in related STEM field', 'IELTS >= 6.5 / TOEFL >= 90']),
      sourceUrl: 'https://hwxy.nju.edu.cn/',
      status: 'active',
    },
  ];

  const existingNjuProgNames = new Set((nju.programs || []).map((p) => p.name.trim().toLowerCase()));
  for (const prog of njuPrograms) {
    if (!existingNjuProgNames.has(prog.name.trim().toLowerCase())) {
      await prisma.program.create({
        data: { universityId: nju.id, ...prog },
      });
      changes++;
    }
  }

  // NJU Fee & Scholarship
  const existingNjuFeeItems = new Set((nju.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingNjuFeeItems.has('application fee (nju portal)')) {
    await prisma.fee.create({
      data: {
        universityId: nju.id,
        item: 'Application Fee (NJU Portal)',
        cost: '600 CNY',
        notes: 'Non-refundable institutional processing fee',
        validFor: '2027 Intake',
        sourceUrl: 'https://hwxy.nju.edu.cn/',
      },
    });
    changes++;
  }

  const existingNjuSchols = new Set((nju.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingNjuSchols.has('chinese government scholarship (type a — agency 10284)')) {
    await prisma.scholarship.create({
      data: {
        universityId: nju.id,
        title: 'Chinese Government Scholarship (Type A — Agency 10284)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10284 (Nanjing University)',
          'Category: Type A Bilateral Embassy Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly stipend (UG: CNY 2,500 / Master: CNY 3,000 / PhD: CNY 3,500), Medical insurance',
          'Deadline: 31 March 2027 via studyinchina.csc.edu.cn',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Apply through home country Chinese Embassy or dispatching authority.',
        eligiblePrograms: JSON.stringify(['Bachelor Programs', 'Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '31 March 2027',
        sourceUrl: 'https://hwxy.nju.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 2. Southern University of Science and Technology (SUSTech) - New Record
  // ==========================================
  let sustech = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'southern-university-of-science-and-technology' },
        { aliases: { contains: 'SUSTech' } },
        { legacySlugs: { contains: 'sustech' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sustech) {
    sustech = await prisma.university.create({
      data: {
        slug: 'southern-university-of-science-and-technology',
        name: 'Southern University of Science and Technology',
        location: 'Nanshan District, Shenzhen, Guangdong, China',
        country: 'China',
        city: 'Shenzhen',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English',
        rankingCountry: 12,
        rankingWorld: 160,
        rankingNational: 12,
        majors: 'Computer Science, Artificial Intelligence, Robotics Engineering, Data Science, Materials Science, Physics, Chemistry, Biomedical Engineering, Financial Mathematics',
        tuition: 'CNY 30,000 / year (100% Covered under SUSTech Presidential Fellowship)',
        tuitionDetails: JSON.stringify([
          'Bachelor of Science & Engineering (100% English Taught): CNY 30,000 / year (100% Covered by Presidential Fellowship)',
          'Master of Science / Engineering: CNY 35,000 / year (Full Fellowship Available)',
          'Doctoral Programs: CNY 40,000 / year (Full Fellowship Available)',
        ]),
        documents: JSON.stringify([
          'Valid International Passport',
          'High School Graduation Certificate & Transcripts (with strong Math/Physics/Chemistry grades)',
          'Standardized Test Scores (SAT, ACT, IB, A-Levels, AP or national examinations)',
          'Personal Statement & Two Teacher Recommendation Letters',
          'Foreigner Physical Examination Record & Police Clearance',
        ]),
        deadlineApplication: 'Round 1: 31 Dec 2026 / Round 2: 28 Feb 2027 / Round 3: 30 Apr 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'National Double First-Class Initiative · 100% English Medium of Instruction',
          'Located in Shenzhen (China Innovation & Technology Capital, home of Huawei, DJI, Tencent)',
          'Presidential Fellowship: 100% Tuition Waiver + Up to CNY 40,000/year Cash Living Stipend',
          'Flexible Major Declaration: Undeclared major in Year 1; choose specialized department in Year 2',
          'Official Portal: intl.sustech.edu.cn | Email: admissions@sustech.edu.cn',
        ]),
        badges: JSON.stringify(['100% English', 'Double First-Class', 'Full Fellowship', 'Shenzhen Tech Hub']),
        logo: '/images/universities/logos/southern-university-of-science-and-technology.webp',
        isActive: true,
        officialUrl: 'https://www.sustech.edu.cn',
        aliases: JSON.stringify(['SUSTech', 'Southern University of Science and Technology', '南方科技大学']),
        legacySlugs: JSON.stringify(['sustech']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.sustech.edu.cn',
          'https://intl.sustech.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // SUSTech Programs
  const sustechPrograms = [
    {
      level: 'Bachelor',
      name: 'Computer Science and Technology (B.Eng. - 100% English)',
      subject: 'Computer Science',
      languages: 'English',
      duration: '4 years',
      intakes: 'September',
      tuition: '30,000 CNY/Year (Covered by Fellowship)',
      applicationDeadline: '30 April 2027',
      eligibility: JSON.stringify(['High school diploma with top STEM grades', 'IELTS >= 6.0 / TOEFL >= 80']),
      sourceUrl: 'https://intl.sustech.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'Robotics Engineering (B.Eng. - 100% English)',
      subject: 'Robotics',
      languages: 'English',
      duration: '4 years',
      intakes: 'September',
      tuition: '30,000 CNY/Year (Covered by Fellowship)',
      applicationDeadline: '30 April 2027',
      eligibility: JSON.stringify(['High school diploma with strong Math/Physics', 'IELTS >= 6.0 / TOEFL >= 80']),
      sourceUrl: 'https://intl.sustech.edu.cn/',
      status: 'active',
    },
  ];

  const existingSustechProgNames = new Set((sustech.programs || []).map((p) => p.name.trim().toLowerCase()));
  for (const prog of sustechPrograms) {
    if (!existingSustechProgNames.has(prog.name.trim().toLowerCase())) {
      await prisma.program.create({
        data: { universityId: sustech.id, ...prog },
      });
      changes++;
    }
  }

  // SUSTech Scholarship
  const existingSustechSchols = new Set((sustech.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingSustechSchols.has('sustech presidential fellowship (first class)')) {
    await prisma.scholarship.create({
      data: {
        universityId: sustech.id,
        title: 'SUSTech Presidential Fellowship (First Class)',
        type: 'Full (University)',
        details: JSON.stringify([
          '100% Tuition Waiver (CNY 30,000/year value)',
          'Free On-Campus International Student Dormitory',
          'Annual Living Allowance of CNY 36,000–40,000 for 4 years',
          'Available across all 100% English-taught Bachelor programs',
        ]),
        amount: '100% Tuition Waiver + Free Dormitory + Annual Living Allowance of CNY 36,000–40,000',
        condition: 'High school graduation with top STEM grades and strong interview performance.',
        eligiblePrograms: JSON.stringify(['Bachelor Programs (100% English)']),
        coverage: 'Full tuition, room, and cash living allowance.',
        deadline: '30 April 2027',
        sourceUrl: 'https://intl.sustech.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 3. Central China Normal University (CCNU) - New Record
  // ==========================================
  let ccnu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'central-china-normal-university' },
        { aliases: { contains: 'CCNU' } },
        { legacySlugs: { contains: 'ccnu' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!ccnu) {
    ccnu = await prisma.university.create({
      data: {
        slug: 'central-china-normal-university',
        name: 'Central China Normal University',
        location: 'Wuhan, Hubei, China',
        country: 'China',
        city: 'Wuhan',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 38,
        rankingWorld: 500,
        rankingNational: 38,
        majors: 'Education, Psychology, Educational Technology, Chinese Language & Literature, Chemistry, Politics, English, Computer Science',
        tuition: 'CNY 18,000–30,000 / year (Covered under CSC Type B Agency 10511)',
        tuitionDetails: JSON.stringify([
          'Bachelor Degree Programs: CNY 18,000 / year',
          'Master Degree Programs: CNY 22,000 – 26,000 / year (100% Covered by CSC)',
          'Doctoral Programs: CNY 30,000 / year (100% Covered by CSC)',
        ]),
        documents: JSON.stringify([
          'Passport Copy',
          'Graduation Certificate & Transcripts',
          'Research Proposal (minimum 800 words)',
          'Two Recommendation Letters',
          'Foreigner Physical Examination Form & Police Clearance',
          'Language Certificate (HSK 5 for Chinese; IELTS 6.0+ / TOEFL 80+ for English)',
        ]),
        deadlineApplication: '5 March 2027 (CSC Type B) / 15 June 2027 (Self-Funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'National Double First-Class & Project 211 Institution in Wuhan',
          'Top 3 Nationally in Education, Psychology, and E-Learning Engineering',
          'CSC Agency Code: 10511 (High-Level Graduate Program Type B)',
          'Full Scholarship includes free campus accommodation and monthly stipend (Master CNY 3,000/mo, PhD CNY 3,500/mo)',
          'Official Portal: cice.ccnu.edu.cn | Email: cice@ccnu.edu.cn',
        ]),
        badges: JSON.stringify(['Double First-Class', 'Project 211', 'CSC Agency 10511', 'Top Education']),
        logo: '/images/universities/logos/central-china-normal-university.webp',
        isActive: true,
        officialUrl: 'http://www.ccnu.edu.cn',
        aliases: JSON.stringify(['CCNU', 'Central China Normal University', '华中师范大学']),
        legacySlugs: JSON.stringify(['ccnu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'http://www.ccnu.edu.cn',
          'http://cice.ccnu.edu.cn',
          'https://studyinchina.csc.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 4. Tianjin University of Finance and Economics (TUFE) - New Record
  // ==========================================
  let tufe = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'tianjin-university-of-finance-and-economics' },
        { aliases: { contains: 'TUFE' } },
        { legacySlugs: { contains: 'tufe' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!tufe) {
    tufe = await prisma.university.create({
      data: {
        slug: 'tianjin-university-of-finance-and-economics',
        name: 'Tianjin University of Finance and Economics',
        location: 'Hexi District, Tianjin, China',
        country: 'China',
        city: 'Tianjin',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 140,
        rankingWorld: 1000,
        rankingNational: 140,
        majors: 'Applied Economics, Finance, Statistics, Accounting, Business Administration, International Trade, Management Science',
        tuition: 'CNY 16,000–26,000 / year (Covered under CSC Agency 10070)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 16,000 / year',
          'Master Programs: CNY 20,000 – 22,000 / year (100% Covered by CSC)',
          'Doctoral Programs: CNY 26,000 / year (100% Covered by CSC)',
        ]),
        documents: JSON.stringify([
          'Passport Copy',
          'Degree Certificate & Academic Transcripts',
          'Study Plan / Research Proposal',
          'Two Recommendation Letters',
          'Language Proficiency Certificate',
          'Health Certificate & Police Clearance',
        ]),
        deadlineApplication: '28 February 2027 (CSC Type B) / 30 June 2027 (Self-Funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Key Municipal University of Finance & Economics in Northern China (30 mins to Beijing)',
          'CSC Agency Code: 10070 (High-Level Graduate Program Type B)',
          'Full CSC Funding includes 100% tuition, free dorm, and stipend (Master CNY 3,000/mo, PhD CNY 3,500/mo)',
          'Official Portal: iec.tjufe.edu.cn',
        ]),
        badges: JSON.stringify(['CSC Agency 10070', 'Top Finance', 'Tianjin Metropole']),
        logo: '/images/universities/logos/tianjin-university-of-finance-and-economics.webp',
        isActive: true,
        officialUrl: 'https://www.tjufe.edu.cn',
        aliases: JSON.stringify(['TUFE', 'Tianjin University of Finance and Economics', '天津财经大学']),
        legacySlugs: JSON.stringify(['tufe']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.tjufe.edu.cn',
          'https://iec.tjufe.edu.cn',
          'https://studyinchina.csc.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 5. Shanxi University of Chinese Medicine (SXUCM) - New Record
  // ==========================================
  let sxucm = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'shanxi-university-of-chinese-medicine' },
        { aliases: { contains: 'SXUCM' } },
        { legacySlugs: { contains: 'sxucm' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sxucm) {
    sxucm = await prisma.university.create({
      data: {
        slug: 'shanxi-university-of-chinese-medicine',
        name: 'Shanxi University of Chinese Medicine',
        location: 'Taiyuan / Jinzhong, Shanxi, China',
        country: 'China',
        city: 'Taiyuan',
        intake: 'March, September',
        degree: 'Bachelor, Master, Non-Degree Language',
        taught: 'Chinese, Bilingual',
        rankingCountry: 280,
        rankingWorld: 1200,
        rankingNational: 280,
        majors: 'Traditional Chinese Medicine (TCM), Acupuncture-Moxibustion & Tuina, Clinical Medicine, Nursing, Chinese Materia Medica, Pharmacy',
        tuition: 'CNY 18,000–28,000 / year (Covered under Shanxi Provincial Government Scholarships)',
        tuitionDetails: JSON.stringify([
          'Bachelor of TCM / Acupuncture (5 Years): CNY 20,000 – 24,000 / year',
          'Master of Medicine / TCM (3 Years): CNY 24,000 – 28,000 / year',
          'Chinese Language Pre-sessional: CNY 12,000 / academic year (CNY 6,000 / semester)',
        ]),
        documents: JSON.stringify([
          'Passport Copy',
          'High School Diploma (for UG) / Bachelor Degree (for Master)',
          'Academic Transcripts',
          'Foreigner Physical Examination Record',
          'Police Clearance Certificate',
        ]),
        deadlineApplication: '15 January 2027 (Spring Language) / 30 June 2027 (Autumn Degree)',
        deadlineStartDate: 'March 2027 (Language) / September 2027 (Degree)',
        notes: JSON.stringify([
          'Authorized Higher Institution for Chinese Government Scholarship Recipients',
          '4 Directly Affiliated Grade-3A Hospitals with Extensive Clinical Clerkships',
          'Specialized Strengths in Acupuncture, Moxibustion, Tuina, and Herbal Pharmacology',
          'Official Portal: gjjyxy.sxtcm.edu.cn',
        ]),
        badges: JSON.stringify(['TCM Specialized', 'Acupuncture Hub', 'Affordable Clinical']),
        logo: '/images/universities/logos/shanxi-university-of-chinese-medicine.webp',
        isActive: true,
        officialUrl: 'https://www.sxtcm.edu.cn',
        aliases: JSON.stringify(['SXUCM', 'Shanxi University of Chinese Medicine', '山西中医药大学']),
        legacySlugs: JSON.stringify(['sxucm']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.sxtcm.edu.cn',
          'https://gjjyxy.sxtcm.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 6. Yunnan Minzu University (YMU) - New Record
  // ==========================================
  let ymu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'yunnan-minzu-university' },
        { aliases: { contains: 'YMU' } },
        { legacySlugs: { contains: 'ymu' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!ymu) {
    ymu = await prisma.university.create({
      data: {
        slug: 'yunnan-minzu-university',
        name: 'Yunnan Minzu University',
        location: 'Chenggong District, Kunming, Yunnan, China',
        country: 'China',
        city: 'Kunming',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 165,
        rankingWorld: 1100,
        rankingNational: 165,
        majors: 'International Economics & Trade, Tourism Management, Computer Science, Chinese Language & Literature, Southeast Asian Languages, MTCSOL',
        tuition: 'CNY 14,000–24,000 / year (Covered under Yunnan Provincial Government Scholarship)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 14,000 – 18,000 / year',
          'Master Programs: CNY 18,000 – 22,000 / year',
          'Doctoral Programs: CNY 22,000 – 24,000 / year',
          'Chinese Language Study: CNY 12,000 / year',
        ]),
        documents: JSON.stringify([
          'Passport Copy',
          'Highest Academic Diploma & Official Transcripts',
          'Study Plan / Research Proposal',
          'Two Recommendation Letters',
          'Language Certificate (HSK or English)',
          'Physical Examination Form & Non-Criminal Record',
        ]),
        deadlineApplication: '30 April 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Co-founded by Ministry of Education, State Ethnic Affairs Commission, and Yunnan Province',
          'Strategic International Education Gateway for South and Southeast Asia',
          'Yunnan Provincial Government Scholarship: Full tuition + Dormitory + Monthly stipend (UG CNY 1,400/mo, Master CNY 1,700/mo, PhD CNY 2,000/mo)',
          'Agency Code: 10691 | Official Portal: gjxy.ymu.edu.cn',
        ]),
        badges: JSON.stringify(['Provincial Scholarship', 'Kunming Gateway', 'Commerce & Language']),
        logo: '/images/universities/logos/yunnan-minzu-university.webp',
        isActive: true,
        officialUrl: 'https://www.ymu.edu.cn',
        aliases: JSON.stringify(['YMU', 'Yunnan Minzu University', '云南民族大学']),
        legacySlugs: JSON.stringify(['ymu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.ymu.edu.cn',
          'https://gjxy.ymu.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 7. Yunnan Vocational College of Mechanical & Electrical Tech - New Record
  // ==========================================
  let yvcmet = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'yunnan-vocational-college-of-mechanical-and-electrical-technology' },
        { aliases: { contains: 'YVCMET' } },
        { legacySlugs: { contains: 'yvcmet' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!yvcmet) {
    yvcmet = await prisma.university.create({
      data: {
        slug: 'yunnan-vocational-college-of-mechanical-and-electrical-technology',
        name: 'Yunnan Vocational College of Mechanical and Electrical Technology',
        location: 'Panlong District, Kunming, Yunnan, China',
        country: 'China',
        city: 'Kunming',
        intake: 'September',
        degree: 'Higher Vocational Diploma (3 Years)',
        taught: 'Chinese with 1-Year Language Pre-sessional',
        rankingCountry: 15,
        rankingWorld: null,
        rankingNational: 15,
        majors: 'Mechatronics Technology, Industrial Robotics, CNC Technology, Electrical Automation, Renewable Energy Vehicle Technology',
        tuition: 'CNY 8,000–12,000 / year (100% Covered under Yunnan Provincial Government Scholarship)',
        tuitionDetails: JSON.stringify([
          'Higher Vocational Technical Diploma (3 Years): CNY 8,000 – 12,000 / year (100% Covered by Provincial Scholarship)',
          'Preparatory Chinese Language Program: CNY 8,000 / year (Covered by Scholarship)',
        ]),
        documents: JSON.stringify([
          'Passport Copy',
          'High School Graduation Certificate & Transcripts',
          'Physical Examination Report',
          'Police Clearance Certificate',
        ]),
        deadlineApplication: '30 May 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'National Demonstrative Backbone Higher Vocational College · National Double High Plan',
          'Yunnan Provincial Government Scholarship provides 100% Free Tuition + Free Campus Dormitory + Monthly Stipend CNY 1,400/month',
          'Industry-Aligned Engineering Laboratories in CNC, Robotics, Automation, and EV Technology',
          'Official Portal: ynmec.edu.cn',
        ]),
        badges: JSON.stringify(['Polytechnic Diploma', 'Double High Plan', 'Full Provincial Scholarship']),
        logo: '/images/universities/logos/yunnan-vocational-college-of-mechanical-and-electrical-technology.webp',
        isActive: true,
        officialUrl: 'https://www.ynmec.edu.cn',
        aliases: JSON.stringify(['YVCMET', 'Yunnan Vocational College of Mechanical and Electrical Technology', '云南机电职业技术学院']),
        legacySlugs: JSON.stringify(['yvcmet']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.ynmec.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  return changes;
}

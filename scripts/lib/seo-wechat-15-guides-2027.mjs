/**
 * Database synchronization and entity management for 15 WeChat-sourced 2027 updates & universities.
 * Zero competitor names (no GUANJUNLAIHUA, no STUDY IN CHINA).
 * Completely tailored for an international audience worldwide.
 */

import { WECHAT_15_GUIDES_DATA } from '../../src/data/newWechatGuides2027.ts';

export const WECHAT_15_GUIDE_SPECS = Object.values(WECHAT_15_GUIDES_DATA).map((guide) => ({
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

export async function upsert15WechatUniversities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. Peking University (PKU) - New Record
  // ==========================================
  let pku = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'peking-university' },
        { legacySlugs: { contains: 'pku' } },
        { aliases: { contains: 'Peking University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!pku) {
    pku = await prisma.university.create({
      data: {
        slug: 'peking-university',
        name: 'Peking University',
        location: 'Haidian District, Beijing, China',
        country: 'China',
        city: 'Beijing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 1,
        rankingWorld: 14,
        rankingNational: 1,
        majors:
          'Chinese Language and Literature, International Relations, Economics, Management, Computer Science, Mathematics, Physics, Chemistry, Law, Philosophy',
        tuition: 'CNY 26,000–50,000 / year (Covered under CSC & Beijing Govt Scholarships)',
        tuitionDetails: JSON.stringify([
          'Undergraduate Programs: CNY 26,000–30,000 / year',
          'Master Degree Programs: CNY 29,000–40,000 / year (Waived under CSC Type B & Beijing Govt)',
          'Doctoral Degree Programs: CNY 32,000–50,000 / year (Waived under CSC Type B & PKU Fellowship)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
          'Official academic transcripts stamped by previous institutions',
          'Language proficiency: HSK 6 for Chinese-taught; IELTS >= 7.0 / TOEFL >= 100 for English-taught',
          'Research proposal or study plan (>=1,500 words for graduate programs)',
          'Two academic recommendation letters from full professors',
          'Application fee voucher (CNY 800 per choice paid in PKU portal)',
          'Certificate of No Criminal Record / Police Clearance (valid within 6 months)',
          'Foreigner Physical Examination Form with laboratory test reports',
        ]),
        deadlineApplication: 'Early January 2027 (CSC Type B Agency 10001) / March 2027 (Regular)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 5 Yiheyuan Road, Haidian District, Beijing, China.',
          'Ranked #14 globally in QS World University Rankings; National #1 institution in China.',
          'Graduate selection operates under the "Application–Evaluation" system (申请—考核制).',
          'Chinese Government Scholarship (CSC Type B): Agency No. 10001.',
          'Application fee: CNY 800 per choice (up to two choices allowed).',
          'Official International Portal: isd.pku.edu.cn',
        ]),
        badges: JSON.stringify([
          'C9 League',
          'Global Top 15',
          'National #1',
          'Double First-Class',
          'CSC Agency 10001',
          'English Taught',
        ]),
        logo: '/images/universities/logos/peking-university.webp',
        isActive: true,
        officialUrl: 'https://www.pku.edu.cn/',
        aliases: JSON.stringify(['PKU', 'Peking University', '北京大学', 'Beida', 'pku']),
        legacySlugs: JSON.stringify(['pku', 'peking-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'https://www.pku.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.pku.edu.cn/',
          'https://www.isd.pku.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // PKU Programs
  const pkuPrograms = [
    {
      level: 'Master',
      name: 'International Relations (MSc)',
      subject: 'Political Science & International Affairs',
      languages: 'English, Chinese',
      duration: '2 years',
      intakes: 'September',
      tuition: '35,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: 'Early January 2027',
      eligibility: JSON.stringify(['Bachelor degree with high GPA under 35', 'IELTS >= 7.0 / TOEFL >= 100']),
      sourceUrl: 'https://www.isd.pku.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Computer Science and Technology (MSc)',
      subject: 'Computer Science',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '33,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: 'Early January 2027',
      eligibility: JSON.stringify(['Bachelor in CS/Math/EE under 35', 'Strong academic portfolio']),
      sourceUrl: 'https://www.isd.pku.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Economics (PhD)',
      subject: 'Economics & Finance',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '40,000 CNY/Year (Waived under CSC Type B & PKU Fellowship)',
      applicationDeadline: 'Early January 2027',
      eligibility: JSON.stringify(['Master degree under 40', 'Research publications advised']),
      sourceUrl: 'https://www.isd.pku.edu.cn/',
      status: 'active',
    },
  ];
  const existingPkuProgKeys = new Set(
    (pku.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of pkuPrograms) {
    if (!existingPkuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: pku.id, ...prog },
      });
      changes++;
    }
  }

  // PKU Scholarships
  const existingPkuScholTitles = new Set((pku.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingPkuScholTitles.has('chinese government scholarship (csc type b — agency 10001)')) {
    await prisma.scholarship.create({
      data: {
        universityId: pku.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10001)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10001 (Peking University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: CNY 3,000 / PhD: CNY 3,500), Comprehensive medical insurance',
          'Selection: Application–Evaluation system via PKU international portal',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Apply via studyinchina.csc.edu.cn and isd.pku.edu.cn.',
        eligiblePrograms: JSON.stringify(['Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: 'Early January 2027',
        sourceUrl: 'https://www.isd.pku.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // PKU Fees
  const existingPkuFeeItems = new Set((pku.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingPkuFeeItems.has('application fee (pku portal)')) {
    await prisma.fee.create({
      data: {
        universityId: pku.id,
        item: 'Application Fee (PKU Portal)',
        cost: '800 CNY',
        notes: 'Payable per program choice (up to 2 choices allowed)',
        validFor: '2027 Intake',
        sourceUrl: 'https://www.isd.pku.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 2. Guangzhou University of Chinese Medicine (GUCM) - New Record
  // ==========================================
  let gucm = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'guangzhou-university-of-chinese-medicine' },
        { legacySlugs: { contains: 'gucm' } },
        { aliases: { contains: 'GUCM' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!gucm) {
    gucm = await prisma.university.create({
      data: {
        slug: 'guangzhou-university-of-chinese-medicine',
        name: 'Guangzhou University of Chinese Medicine',
        location: 'Guangzhou, Guangdong Province, China',
        country: 'China',
        city: 'Guangzhou',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 110,
        rankingWorld: 800,
        rankingNational: 110,
        majors:
          'Traditional Chinese Medicine, Acupuncture-Moxibustion and Tuina, Integrated Chinese and Western Clinical Medicine, Pharmacy, Chinese Materia Medica',
        tuition: 'CNY 23,000–38,000 / year (Covered under CSC Silk Road & High-Level Programs)',
        tuitionDetails: JSON.stringify([
          'Medical Bachelor (5-Year): CNY 23,000–28,000 / year',
          'Master Degree: CNY 28,000–32,000 / year (Waived under CSC Type B)',
          'Doctoral Degree (PhD): CNY 34,000–38,000 / year (Waived under CSC Type B)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest degree certificate and transcripts',
          'CSCA score report (mandatory for Bachelor applicants: Professional Chinese + Mathematics)',
          'Language proficiency: HSK 4 >= 180 for Bachelor; HSK 5 for Graduate',
          'Study plan or research proposal (>=1,000 words)',
          'Two academic recommendation letters from professors',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance (valid within 6 months)',
        ]),
        deadlineApplication: '31 March 2027 (CSC Type B Agency 10572) / 30 April 2027 (Self-funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: Guangzhou Higher Education Mega Center, Panyu District, Guangzhou, Guangdong, China.',
          'National Double First-Class University; one of China’s first four TCM universities (est. 1956).',
          'Chinese Government Scholarship (CSC Type B): Agency No. 10572.',
          'Undergraduate applicants must sit for the CSCA (Chinese + Math).',
          'Official International Portal: iec.gzucm.edu.cn',
        ]),
        badges: JSON.stringify([
          'Double First-Class',
          'Top 4 TCM Universities',
          'CSC Agency 10572',
          'Greater Bay Area',
          'Silk Road Scholarship',
        ]),
        logo: '/images/universities/logos/guangzhou-university-of-chinese-medicine.webp',
        isActive: true,
        officialUrl: 'https://www.gzucm.edu.cn/',
        aliases: JSON.stringify(['GUCM', 'Guangzhou University of Chinese Medicine', '广州中医药大学', 'gucm']),
        legacySlugs: JSON.stringify(['gucm', 'guangzhou-university-of-chinese-medicine']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & National Administration of Traditional Chinese Medicine",
        recognitionSourceUrl: 'https://www.gzucm.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.gzucm.edu.cn/',
          'https://iec.gzucm.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // GUCM Programs
  const gucmPrograms = [
    {
      level: 'Bachelor',
      name: 'Traditional Chinese Medicine (TCM — 5-Year)',
      subject: 'Chinese Medicine',
      languages: 'Chinese',
      duration: '5 years',
      intakes: 'September',
      tuition: '25,000 CNY/Year (Covered under Silk Road CSC)',
      applicationDeadline: '30 April 2027',
      eligibility: JSON.stringify(['High school diploma under 25', 'CSCA score mandatory (Chinese + Math)', 'HSK 4 >= 180']),
      sourceUrl: 'https://iec.gzucm.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'Acupuncture, Moxibustion & Tuina (5-Year)',
      subject: 'Acupuncture & Clinical Medicine',
      languages: 'Chinese',
      duration: '5 years',
      intakes: 'September',
      tuition: '25,000 CNY/Year',
      applicationDeadline: '30 April 2027',
      eligibility: JSON.stringify(['High school diploma under 25', 'CSCA score mandatory', 'HSK 4 >= 180']),
      sourceUrl: 'https://iec.gzucm.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Clinical Chinese Medicine (MSc)',
      subject: 'Clinical Medicine',
      languages: 'Chinese, English',
      duration: '3 years',
      intakes: 'September',
      tuition: '30,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '31 March 2027',
      eligibility: JSON.stringify(['Bachelor degree in Medicine/TCM under 35', 'HSK 5 >= 180']),
      sourceUrl: 'https://iec.gzucm.edu.cn/',
      status: 'active',
    },
  ];
  const existingGucmProgKeys = new Set(
    (gucm.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of gucmPrograms) {
    if (!existingGucmProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: gucm.id, ...prog },
      });
      changes++;
    }
  }

  // GUCM Scholarships
  const existingGucmScholTitles = new Set((gucm.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingGucmScholTitles.has('chinese government scholarship (csc type b — agency 10572)')) {
    await prisma.scholarship.create({
      data: {
        universityId: gucm.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10572)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10572 (Guangzhou University of Chinese Medicine)',
          'Category: Type B High-Level Postgraduate & Silk Road Programs',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly stipend (Master CNY 3,000 / PhD CNY 3,500), Medical insurance',
          'Deadline: 31 March 2027',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. CSCA required for Bachelor; HSK 4/5 proficiency.',
        eligiblePrograms: JSON.stringify(['TCM', 'Acupuncture-Tuina', 'Clinical Medicine', 'Pharmacy']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '31 March 2027',
        sourceUrl: 'https://iec.gzucm.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 3. Hainan Medical University - New Record
  // ==========================================
  let hainmc = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'hainan-medical-university' },
        { legacySlugs: { contains: 'hainmc' } },
        { aliases: { contains: 'Hainan Medical University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!hainmc) {
    hainmc = await prisma.university.create({
      data: {
        slug: 'hainan-medical-university',
        name: 'Hainan Medical University',
        location: 'Haikou, Hainan Province, China',
        country: 'China',
        city: 'Haikou',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 220,
        rankingWorld: 1200,
        rankingNational: 220,
        majors: 'Clinical Medicine (MBBS), Stomatology, Pharmacy, Nursing, Preventive Medicine, Public Health',
        tuition: 'CNY 24,000–35,000 / year',
        tuitionDetails: JSON.stringify([
          'Clinical Medicine (MBBS, 6 Years English-taught): CNY 28,000 / year',
          'Pharmacy / Allied Health Sciences: CNY 22,000 / year',
          'Postgraduate Programs (Master/PhD): CNY 30,000–35,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Certified high school diploma / Grade 12 / A-Levels (strong grades in Biology, Chemistry, Physics)',
          'Academic transcripts stamped by secondary school',
          'English proficiency certificate (IELTS >= 6.0 / TOEFL >= 80 or Medium of Instruction certificate)',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 3 Xueyuan Road, Longhua District, Haikou, Hainan, China.',
          'Listed in WDOMS; recognized by ECFMG, GMC, AMC, and national medical councils.',
          'Situated in the tropical Hainan Free Trade Port.',
          'Affiliated Grade-A tertiary teaching hospitals with modern clinical facilities.',
          'Official Portal: gjjy.hainmc.edu.cn',
        ]),
        badges: JSON.stringify([
          'WDOMS Listed',
          'English-Medium MBBS',
          'Hainan Free Trade Port',
          'Provincial Scholarships',
        ]),
        logo: '/images/universities/logos/hainan-medical-university.webp',
        isActive: true,
        officialUrl: 'https://www.hainmc.edu.cn/',
        aliases: JSON.stringify(['HainMC', 'Hainan Medical University', '海南医科大学', 'Hainan Medical College', 'hainmc']),
        legacySlugs: JSON.stringify(['hainmc', 'hainan-medical-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Hainan Provincial People's Government",
        recognitionSourceUrl: 'https://www.hainmc.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.hainmc.edu.cn/',
          'https://gjjy.hainmc.edu.cn/',
          'https://www.wdoms.org/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // Hainan Medical Programs
  const hainmcPrograms = [
    {
      level: 'Bachelor',
      name: 'Clinical Medicine (MBBS — 6 Years English-Medium)',
      subject: 'Clinical Medicine',
      languages: 'English',
      duration: '6 years',
      intakes: 'September',
      tuition: '28,000 CNY/Year',
      applicationDeadline: '30 June 2027',
      eligibility: JSON.stringify(['High school diploma under 25 with strong PCB marks', 'English proficiency: IELTS >= 6.0 or MOI']),
      sourceUrl: 'https://gjjy.hainmc.edu.cn/',
      status: 'active',
    },
    {
      level: 'Bachelor',
      name: 'Pharmacy (BSc)',
      subject: 'Pharmacy',
      languages: 'Chinese, English',
      duration: '4 years',
      intakes: 'September',
      tuition: '22,000 CNY/Year',
      applicationDeadline: '30 June 2027',
      eligibility: JSON.stringify(['High school diploma under 25']),
      sourceUrl: 'https://gjjy.hainmc.edu.cn/',
      status: 'active',
    },
  ];
  const existingHainmcProgKeys = new Set(
    (hainmc.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of hainmcPrograms) {
    if (!existingHainmcProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: hainmc.id, ...prog },
      });
      changes++;
    }
  }

  // ==========================================
  // 4. Henan Medical University (Xinxiang Medical University) - New Record
  // ==========================================
  let xxmu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'xinxiang-medical-university' },
        { slug: 'henan-medical-university' },
        { aliases: { contains: 'Xinxiang Medical University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!xxmu) {
    xxmu = await prisma.university.create({
      data: {
        slug: 'xinxiang-medical-university',
        name: 'Henan Medical University (Xinxiang Medical University)',
        location: 'Xinxiang, Henan Province, China',
        country: 'China',
        city: 'Xinxiang',
        intake: 'September',
        degree: 'Bachelor, Master',
        taught: 'English, Chinese',
        rankingCountry: 230,
        rankingWorld: 1300,
        rankingNational: 230,
        majors: 'Clinical Medicine (MBBS), Stomatology, Medical Imaging, Nursing, Pharmacy',
        tuition: 'CNY 24,000–28,000 / year',
        tuitionDetails: JSON.stringify([
          'Clinical Medicine (MBBS, 6-Year English-Medium): CNY 24,000 / year (highly cost-effective)',
          'Pharmacy & Nursing: CNY 20,000 / year',
          'Hostel Accommodation: CNY 3,600–4,800 / year (Double room)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Certified secondary school certificate (Grade 12 / HSC / A-Levels)',
          'Academic transcripts stamped by school',
          'English proficiency certificate (IELTS >= 6.0 or Medium of Instruction certificate)',
          'Foreigner Physical Examination Form (issued within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 601 Jinsui Avenue, Xinxiang, Henan Province, China.',
          'The only independent western medical university in Henan Province.',
          'MOE authorized for English-medium Clinical Medicine (MBBS); WDOMS listed.',
          'Over 15,000 hospital beds across 5 directly affiliated hospitals.',
          'Official Portal: sie.xxmu.edu.cn',
        ]),
        badges: JSON.stringify([
          'WDOMS Listed',
          'MOE English MBBS',
          'Affordable Medical Tuition',
          'Grade-A Hospitals',
        ]),
        logo: '/images/universities/logos/xinxiang-medical-university.webp',
        isActive: true,
        officialUrl: 'https://www.xxmu.edu.cn/',
        aliases: JSON.stringify([
          'XXMU',
          'Xinxiang Medical University',
          'Henan Medical University',
          '新乡医学院',
          '河南医药大学',
          'xxmu',
        ]),
        legacySlugs: JSON.stringify(['xxmu', 'xinxiang-medical-university', 'henan-medical-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Henan Provincial People's Government",
        recognitionSourceUrl: 'https://www.xxmu.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.xxmu.edu.cn/',
          'https://sie.xxmu.edu.cn/',
          'https://www.wdoms.org/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // XXMU Programs
  const xxmuPrograms = [
    {
      level: 'Bachelor',
      name: 'Clinical Medicine (MBBS — 6 Years English-Medium)',
      subject: 'Clinical Medicine',
      languages: 'English',
      duration: '6 years',
      intakes: 'September',
      tuition: '24,000 CNY/Year',
      applicationDeadline: '30 June 2027',
      eligibility: JSON.stringify(['Grade 12 / HSC / A-Levels under 25 with strong Science grades', 'English proficiency: IELTS >= 6.0 or MOI']),
      sourceUrl: 'https://sie.xxmu.edu.cn/',
      status: 'active',
    },
  ];
  const existingXxmuProgKeys = new Set(
    (xxmu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of xxmuPrograms) {
    if (!existingXxmuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: xxmu.id, ...prog },
      });
      changes++;
    }
  }

  // ==========================================
  // 5. Xinjiang University of Finance and Economics - New Record
  // ==========================================
  let xjufe = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'xinjiang-university-of-finance-and-economics' },
        { legacySlugs: { contains: 'xjufe' } },
        { aliases: { contains: 'Xinjiang University of Finance' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!xjufe) {
    xjufe = await prisma.university.create({
      data: {
        slug: 'xinjiang-university-of-finance-and-economics',
        name: 'Xinjiang University of Finance and Economics',
        location: 'Urumqi, Xinjiang Uyghur Autonomous Region, China',
        country: 'China',
        city: 'Urumqi',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 250,
        rankingWorld: 1400,
        rankingNational: 250,
        majors: 'International Economics and Trade, Finance, Accounting, Business Administration, Logistics Management',
        tuition: 'CNY 12,000–22,000 / year (Covered under Silk Road Scholarships)',
        tuitionDetails: JSON.stringify([
          'Bachelor Degree: CNY 12,000–16,000 / year',
          'Master Degree: CNY 18,000–22,000 / year',
          'Hostel Accommodation: CNY 2,000–4,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest diploma and academic transcripts',
          'Language proficiency certificate (HSK or English MOI)',
          'Foreigner Physical Examination Form (issued within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '31 May 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 449 Beijing Middle Road, Urumqi, Xinjiang, China.',
          'Key business and financial university on the Silk Road Economic Belt.',
          'Chinese Government Scholarship (Silk Road Program): Agency No. 10763.',
          'Official Portal: sie.xjufe.edu.cn',
        ]),
        badges: JSON.stringify([
          'Silk Road Economic Belt',
          'CSC Agency 10763',
          'Finance & Business Key',
          'Low Cost of Living',
        ]),
        logo: '/images/universities/logos/xinjiang-university-of-finance-and-economics.webp',
        isActive: true,
        officialUrl: 'https://www.xjufe.edu.cn/',
        aliases: JSON.stringify([
          'XJUFE',
          'Xinjiang University of Finance and Economics',
          '新疆财经大学',
          'xjufe',
        ]),
        legacySlugs: JSON.stringify(['xjufe', 'xinjiang-university-of-finance-and-economics']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China & Xinjiang Regional Government',
        recognitionSourceUrl: 'https://www.xjufe.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.xjufe.edu.cn/',
          'https://sie.xjufe.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 6. Northeast Normal University (NENU) - New Record
  // ==========================================
  let nenu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'northeast-normal-university' },
        { legacySlugs: { contains: 'nenu' } },
        { aliases: { contains: 'Northeast Normal University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!nenu) {
    nenu = await prisma.university.create({
      data: {
        slug: 'northeast-normal-university',
        name: 'Northeast Normal University',
        location: 'Changchun, Jilin Province, China',
        country: 'China',
        city: 'Changchun',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 45,
        rankingWorld: 500,
        rankingNational: 45,
        majors:
          'Education, World History, Chemistry, Biology, Materials Science and Engineering, Environmental Science, Computer Science, Psychology',
        tuition: 'CNY 18,000–32,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 18,000–22,000 / year',
          'Master Degree: CNY 24,000–26,000 / year (100% Waived under CSC Type B)',
          'Doctoral Degree (PhD): CNY 28,000–32,000 / year (100% Waived under CSC Type B)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest degree certificate and transcripts',
          'Study plan or research proposal (>=1,000 words)',
          'Two academic recommendation letters from professors',
          'Language proficiency: IELTS >= 6.0 / TOEFL >= 80 or HSK 5',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '28 February 2027 (CSC Type B Agency 10200)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 5268 Renmin Street, Changchun, Jilin Province, China.',
          'National Key University directly under the Ministry of Education; Project 211 and Double First-Class.',
          'CSC High-Level Postgraduate Program (Type B): Agency No. 10200 · Deadline 28 February 2027.',
          'Official Portal: iso.nenu.edu.cn',
        ]),
        badges: JSON.stringify([
          'Project 211',
          'Double First-Class',
          'MOE Direct University',
          'CSC Agency 10200',
          'English Taught',
        ]),
        logo: '/images/universities/logos/northeast-normal-university.webp',
        isActive: true,
        officialUrl: 'https://www.nenu.edu.cn/',
        aliases: JSON.stringify(['NENU', 'Northeast Normal University', '东北师范大学', 'nenu']),
        legacySlugs: JSON.stringify(['nenu', 'northeast-normal-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'https://www.nenu.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.nenu.edu.cn/',
          'https://iso.nenu.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // NENU Scholarships
  const existingNenuScholTitles = new Set((nenu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingNenuScholTitles.has('chinese government scholarship (csc type b — agency 10200)')) {
    await prisma.scholarship.create({
      data: {
        universityId: nenu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10200)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10200 (Northeast Normal University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly stipend (Master CNY 3,000 / PhD CNY 3,500), Medical insurance',
          'Deadline: 28 February 2027 via studyinchina.csc.edu.cn and iso.nenu.edu.cn',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40.',
        eligiblePrograms: JSON.stringify(['Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '28 February 2027',
        sourceUrl: 'https://iso.nenu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 7. Nanjing Forestry University (NFU) - New Record
  // ==========================================
  let njfu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'nanjing-forestry-university' },
        { legacySlugs: { contains: 'njfu' } },
        { aliases: { contains: 'Nanjing Forestry University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!njfu) {
    njfu = await prisma.university.create({
      data: {
        slug: 'nanjing-forestry-university',
        name: 'Nanjing Forestry University',
        location: 'Nanjing, Jiangsu Province, China',
        country: 'China',
        city: 'Nanjing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 90,
        rankingWorld: 750,
        rankingNational: 90,
        majors:
          'Forestry Engineering, Ecology, Environmental Science, Landscape Architecture, Civil Engineering, International Economics and Trade',
        tuition: 'CNY 16,000–30,000 / year (Covered under CSC Type B & Jasmine Scholarships)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 16,000–20,000 / year',
          'Master Degree: CNY 22,000–26,000 / year (Waived under CSC Type B)',
          'Doctoral Degree (PhD): CNY 26,000–30,000 / year (Waived under CSC Type B)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest degree certificate and transcripts',
          'Study plan or research proposal (>=1,000 words)',
          'Two academic recommendation letters from professors',
          'Language proficiency: IELTS >= 6.0 / TOEFL >= 80 or HSK 5',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '15 March 2027 (CSC Type B Agency 10298) / 30 June 2027 (Regular)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 159 Longpan Road, Xuanwu District, Nanjing, Jiangsu Province, China.',
          'National Double First-Class University; Forestry Engineering ranks among the global top.',
          'CSC High-Level Postgraduate Program (Type B): Agency No. 10298.',
          'Jiangsu Jasmine Scholarship recipient university.',
          'Official Portal: iec.njfu.edu.cn',
        ]),
        badges: JSON.stringify([
          'Double First-Class',
          'Forestry Engineering Global Leader',
          'CSC Agency 10298',
          'Jasmine Scholarship',
          'English Taught',
        ]),
        logo: '/images/universities/logos/nanjing-forestry-university.webp',
        isActive: true,
        officialUrl: 'https://www.njfu.edu.cn/',
        aliases: JSON.stringify(['NFU', 'Nanjing Forestry University', '南京林业大学', 'njfu']),
        legacySlugs: JSON.stringify(['njfu', 'nanjing-forestry-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China & Jiangsu Provincial Government',
        recognitionSourceUrl: 'https://www.njfu.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.njfu.edu.cn/',
          'https://iec.njfu.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // NFU Scholarships
  const existingNjfuScholTitles = new Set((njfu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingNjfuScholTitles.has('chinese government scholarship (csc type b — agency 10298)')) {
    await prisma.scholarship.create({
      data: {
        universityId: njfu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10298)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10298 (Nanjing Forestry University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly stipend (Master CNY 3,000 / PhD CNY 3,500), Medical insurance',
          'Deadline: 15 March 2027',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40.',
        eligiblePrograms: JSON.stringify(['Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '15 March 2027',
        sourceUrl: 'https://iec.njfu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 8. Southwest University (SWU) - New Record
  // ==========================================
  let swu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'southwest-university' },
        { legacySlugs: { contains: 'swu' } },
        { aliases: { contains: 'Southwest University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!swu) {
    swu = await prisma.university.create({
      data: {
        slug: 'southwest-university',
        name: 'Southwest University',
        location: 'Beibei District, Chongqing Municipality, China',
        country: 'China',
        city: 'Chongqing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 40,
        rankingWorld: 450,
        rankingNational: 40,
        majors:
          'Education, Psychology, Agronomy, Plant and Animal Science, Chemistry, Biology, Pharmaceutical Sciences, Veterinary Medicine, Economics',
        tuition: 'CNY 16,000–32,000 / year (100% Waived under CSC Type B & Mayor Scholarships)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 16,000–20,000 / year',
          'Master Degree: CNY 22,000–26,000 / year (Waived under CSC Type B)',
          'Doctoral Degree (PhD): CNY 28,000–32,000 / year (Waived under CSC Type B)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'Notarized highest degree certificate and transcripts',
          'Study plan or research proposal (>=1,000 words)',
          'Two academic recommendation letters from professors',
          'Language proficiency: IELTS >= 6.0 / TOEFL >= 80 or HSK 5',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '28 February 2027 (CSC Type B Agency 10635) / 15 June 2027 (Mayor Award)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 2 Tiansheng Road, Beibei District, Chongqing, China.',
          'National Key University under the Ministry of Education; Project 211 and Double First-Class.',
          'CSC High-Level Postgraduate Program (Type B): Agency No. 10635.',
          'Chongqing Municipal Government Mayor Scholarship host institution.',
          'Official Portal: gjxy.swu.edu.cn',
        ]),
        badges: JSON.stringify([
          'Project 211',
          'Double First-Class',
          'MOE Direct University',
          'CSC Agency 10635',
          'Chongqing Mayor Scholarship',
          'English Taught',
        ]),
        logo: '/images/universities/logos/southwest-university.webp',
        isActive: true,
        officialUrl: 'https://www.swu.edu.cn/',
        aliases: JSON.stringify(['SWU', 'Southwest University', '西南大学', 'swu']),
        legacySlugs: JSON.stringify(['swu', 'southwest-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'https://www.swu.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.swu.edu.cn/',
          'https://gjxy.swu.edu.cn/',
          'https://studyinchina.csc.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // SWU Scholarships
  const existingSwuScholTitles = new Set((swu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingSwuScholTitles.has('chinese government scholarship (csc type b — agency 10635)')) {
    await prisma.scholarship.create({
      data: {
        universityId: swu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10635)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10635 (Southwest University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly stipend (Master CNY 3,000 / PhD CNY 3,500), Medical insurance',
          'Deadline: 28 February 2027',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40.',
        eligiblePrograms: JSON.stringify(['Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '28 February 2027',
        sourceUrl: 'https://gjxy.swu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // ==========================================
  // 9. Sichuan Tourism University - New Record
  // ==========================================
  let sctu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'sichuan-tourism-university' },
        { legacySlugs: { contains: 'sctu' } },
        { aliases: { contains: 'Sichuan Tourism University' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sctu) {
    sctu = await prisma.university.create({
      data: {
        slug: 'sichuan-tourism-university',
        name: 'Sichuan Tourism University',
        location: 'Longquanyi District, Chengdu, Sichuan Province, China',
        country: 'China',
        city: 'Chengdu',
        intake: 'September',
        degree: 'Bachelor',
        taught: 'Chinese, English',
        rankingCountry: 380,
        rankingWorld: 1800,
        rankingNational: 380,
        majors: 'Culinary Arts and Nutrition, Western Culinary Arts, Hotel Management, Tourism Management, Food Science and Engineering',
        tuition: 'CNY 14,000–18,000 / year',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 14,000–18,000 / year',
          'Dormitory: CNY 1,800 / year (4-person shared room in international residence)',
        ]),
        documents: JSON.stringify([
          'Valid foreign passport identification page',
          'High school graduation certificate and transcripts',
          'Language proficiency proof or Chinese language readiness',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record / Police Clearance',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Location: No. 459 Hongling Road, Longquanyi District, Chengdu, Sichuan, China.',
          'China’s first public undergraduate tourism and culinary university.',
          'Zero application fee (CNY 0).',
          'Subsidized international dorms from CNY 1,800/year.',
          'Official Portal: gjxy.sctu.edu.cn',
        ]),
        badges: JSON.stringify([
          'Culinary & Hospitality Pioneer',
          'Zero Application Fee',
          'Chengdu Gastronomy Hub',
          'Provincial Scholarships',
        ]),
        logo: '/images/universities/logos/sichuan-tourism-university.webp',
        isActive: true,
        officialUrl: 'https://www.sctu.edu.cn/',
        aliases: JSON.stringify([
          'SCTU',
          'Sichuan Tourism University',
          '四川旅游学院',
          'sctu',
        ]),
        legacySlugs: JSON.stringify(['sctu', 'sichuan-tourism-university']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Sichuan Provincial People's Government",
        recognitionSourceUrl: 'https://www.sctu.edu.cn/',
        sourceUrls: JSON.stringify([
          'https://www.sctu.edu.cn/',
          'https://gjxy.sctu.edu.cn/',
        ]),
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 10. Fudan University - Update Existing Record
  // ==========================================
  const fudan = await prisma.university.findFirst({
    where: {
      OR: [{ slug: 'fudan-university' }, { aliases: { contains: 'Fudan' } }],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (fudan) {
    const fudanSpringPrograms = [
      {
        level: 'Non-Degree',
        name: 'Chinese Language Study Program (Spring 2027)',
        subject: 'Chinese Language & Linguistics',
        languages: 'Chinese, English',
        duration: '1 semester / 1 year',
        intakes: 'February, September',
        tuition: '10,500 CNY/Semester (21,000 CNY/Year)',
        applicationDeadline: '15 December 2026',
        eligibility: JSON.stringify(['Age 18–60 with high school diploma or above', 'All proficiency levels from beginner to advanced']),
        sourceUrl: 'https://ices.fudan.edu.cn/',
        status: 'active',
      },
      {
        level: 'Non-Degree',
        name: 'Chinese Economy & Business Program (Spring 2027)',
        subject: 'Business & Economics',
        languages: 'English, Chinese',
        duration: '1 semester / 1 year',
        intakes: 'February, September',
        tuition: '12,500 CNY/Semester (25,000 CNY/Year)',
        applicationDeadline: '15 December 2026',
        eligibility: JSON.stringify(['High school diploma or university enrollment', 'Upper-intermediate language readiness']),
        sourceUrl: 'https://ices.fudan.edu.cn/',
        status: 'active',
      },
      {
        level: 'Non-Degree',
        name: 'Chinese Culture & Society Program (CCSP — Spring 2027)',
        subject: 'Humanities & Culture',
        languages: 'Chinese',
        duration: '1 semester / 1 year',
        intakes: 'February, September',
        tuition: '12,500 CNY/Semester (25,000 CNY/Year)',
        applicationDeadline: '10 December 2026',
        eligibility: JSON.stringify(['HSK Level 5 >= 180 or equivalent', 'High school diploma or university enrollment']),
        sourceUrl: 'https://ices.fudan.edu.cn/',
        status: 'active',
      },
    ];

    const existingFudanProgKeys = new Set(
      (fudan.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
    );
    for (const prog of fudanSpringPrograms) {
      if (!existingFudanProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
        await prisma.program.create({
          data: { universityId: fudan.id, ...prog },
        });
        changes++;
      }
    }
  }

  // ==========================================
  // 11. Xi'an Jiaotong University - Update Existing Record
  // ==========================================
  const xjtu = await prisma.university.findFirst({
    where: {
      OR: [{ slug: 'xian-jiaotong-university' }, { aliases: { contains: 'XJTU' } }],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (xjtu) {
    const existingXjtuScholTitles = new Set((xjtu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
    if (!existingXjtuScholTitles.has('chinese government scholarship (csc type b — agency 10698)')) {
      await prisma.scholarship.create({
        data: {
          universityId: xjtu.id,
          title: 'Chinese Government Scholarship (CSC Type B — Agency 10698)',
          type: 'Full (CSC)',
          details: JSON.stringify([
            'CSC Agency Number: 10698 (Xi’an Jiaotong University)',
            'Category: Type B High-Level Postgraduate Program',
            'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: CNY 3,000 / PhD: CNY 3,500), Medical insurance',
            'Deadline: 15 February 2027 via studyinchina.csc.edu.cn and sie.xjtu.edu.cn',
          ]),
          amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
          condition: 'Non-Chinese citizen. Master under 35, PhD under 40.',
          eligiblePrograms: JSON.stringify(['Mechanical Engineering', 'Energy & Power', 'AI', 'Electrical Engineering']),
          coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
          deadline: '15 February 2027',
          sourceUrl: 'https://sie.xjtu.edu.cn/',
          status: 'active',
        },
      });
      changes++;
    }
  }

  // ==========================================
  // 12. Fujian Medical University - Update Existing Record
  // ==========================================
  const fjmu = await prisma.university.findFirst({
    where: {
      OR: [{ slug: 'fujian-medical-university' }, { aliases: { contains: 'FJMU' } }],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (fjmu) {
    const fjmuPrograms = [
      {
        level: 'Non-Degree',
        name: 'International Medical Foundation (Pre-Med Spring 2027)',
        subject: 'Medical Sciences Foundation',
        languages: 'English, Chinese',
        duration: '1 semester (March–July 2027)',
        intakes: 'March 2027',
        tuition: '9,000 CNY/Semester (Term fixed cost: CNY 11,300 with dorm & insurance)',
        applicationDeadline: '18 January 2027',
        eligibility: JSON.stringify(['High school diploma under 25 with PCB courses', 'Direct track to MBBS for successful candidates']),
        sourceUrl: 'https://oec.fjmu.edu.cn/',
        status: 'active',
      },
    ];

    const existingFjmuProgKeys = new Set(
      (fjmu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
    );
    for (const prog of fjmuPrograms) {
      if (!existingFjmuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
        await prisma.program.create({
          data: { universityId: fjmu.id, ...prog },
        });
        changes++;
      }
    }
  }

  return changes;
}

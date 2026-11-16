/**
 * Data definitions and upsert operations for 7 new China 2027 guides & universities:
 * 1. Liaoning University (LNU) - CSC Type B (Agency 10140, Master/PhD, deadline 3 Feb 2027)
 * 2. Changchun University of Science and Technology (CUST) - CSC Type B (Agency 10186, deadline 28 Feb 2027)
 * 3. 2027 HSK 3.0 Examination Calendar - Test dates, registration deadlines, score release
 * 4. Shenyang Jianzhu University (SJZU) - CSC Type B (Agency 10153, deadline 1 Mar 2027)
 * 5. Yunnan Normal University (YNNU) - CSC Type B (Agency 10681, deadline 28 Feb 2027)
 * 6. Henan University (HENU) - CSC Type B (Agency 10475, deadline 17 Jan 2027)
 * 7. Nanjing University of Posts & Telecommunications (NJUPT) - CSC Type B (Agency 10293, 2-Yr English Master's, deadline 28 Feb 2027)
 */

import { NEW_GUIDES_2027_DATA } from '../../src/data/newGuides2027.ts';

export const NEW_7_GUIDE_SPECS = Object.values(NEW_GUIDES_2027_DATA).map((guide) => ({
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

export async function upsert7NewUniversities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. Liaoning University (LNU) - New Record
  // ==========================================
  const lnuSources = JSON.stringify([
    'https://www.lnu.edu.cn/',
    'https://lnu.17gz.org/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const lnuTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 18,000–22,000 / year',
    'Master Degree Programs (English & Chinese): CNY 24,000–26,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (PhD): CNY 28,000–32,000 / year (100% Waived under CSC Type B)',
  ]);
  const lnuDocuments = JSON.stringify([
    'Passport identification page (valid >= 12 months)',
    'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
    'Official academic transcripts stamped by previous institutions',
    'Language proficiency certificate (IELTS >= 6.0 / TOEFL >= 80 or HSK 5/6)',
    'Study plan or research proposal (>=1,000 words in English or Chinese)',
    'Two academic recommendation letters from professors or associate professors',
    'Supervisor acceptance letter (recommended for PhD candidates)',
    'Foreigner Physical Examination Form (issued within 6 months with lab reports)',
    'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
  ]);
  const lnuNotes = JSON.stringify([
    'Location: No. 66 Chongshan Middle Road, Shenyang, Liaoning Province, China.',
    'National Project 211 and Double First-Class University.',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10140 · Deadline 3 February 2027.',
    'Dual-system application: studyinchina.csc.edu.cn & lnu.17gz.org.',
    'No separate university application fee charged for CSC Type B candidates.',
    'Official Portal: lnu.edu.cn / lnu.17gz.org',
  ]);

  let lnu = await prisma.university.findFirst({
    where: {
      OR: [{ slug: 'liaoning-university' }, { legacySlugs: { contains: 'lnu' } }, { aliases: { contains: 'LNU' } }],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!lnu) {
    lnu = await prisma.university.create({
      data: {
        slug: 'liaoning-university',
        name: 'Liaoning University',
        location: 'Shenyang, Liaoning Province, China',
        country: 'China',
        city: 'Shenyang',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 95,
        rankingWorld: 850,
        rankingNational: 95,
        majors:
          'Economics, World Economy, Finance, International Trade, Law, Asian Studies, Business Administration, Environmental Science, Computer Science and Technology',
        tuition: 'CNY 18,000–32,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: lnuTuitionDetails,
        documents: lnuDocuments,
        deadlineApplication: '3 February 2027 (CSC Type B Agency 10140)',
        deadlineStartDate: 'September 2027',
        notes: lnuNotes,
        badges: JSON.stringify([
          'Project 211',
          'Double First-Class',
          'CSC Agency 10140',
          'Economics & Law Powerhouse',
          'English Taught',
        ]),
        logo: '/images/universities/logos/lnu.webp',
        isActive: true,
        officialUrl: 'https://www.lnu.edu.cn/',
        aliases: JSON.stringify(['LNU', 'Liaoning University', '辽宁大学', 'lnu']),
        legacySlugs: JSON.stringify(['lnu']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Liaoning Provincial People's Government",
        recognitionSourceUrl: 'https://www.lnu.edu.cn/',
        sourceUrls: lnuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // LNU Programs
  const lnuPrograms = [
    {
      level: 'Master',
      name: 'World Economy (MSc)',
      subject: 'Economics & Trade',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '3 February 2027',
      eligibility: JSON.stringify(['Bachelor degree under 35', 'IELTS >= 6.0 / TOEFL >= 80 or HSK 5']),
      sourceUrl: 'https://www.lnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Finance & International Trade (MSc)',
      subject: 'Finance',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '3 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in related discipline under 35']),
      sourceUrl: 'https://www.lnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'International Law (LLM)',
      subject: 'Law',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '24,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '3 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in Law or Humanities under 35']),
      sourceUrl: 'https://www.lnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'World Economy (PhD)',
      subject: 'Economics',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '32,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '3 February 2027',
      eligibility: JSON.stringify(['Master degree in Economics under 40', 'Supervisor letter recommended']),
      sourceUrl: 'https://www.lnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Economic Law (PhD)',
      subject: 'Law',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '30,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '3 February 2027',
      eligibility: JSON.stringify(['Master degree in Law under 40']),
      sourceUrl: 'https://www.lnu.edu.cn/',
      status: 'active',
    },
  ];
  const existingLnuProgKeys = new Set(
    (lnu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of lnuPrograms) {
    if (!existingLnuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: lnu.id, ...prog },
      });
      changes++;
    }
  }

  // LNU Scholarships
  const existingLnuScholTitles = new Set((lnu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingLnuScholTitles.has('chinese government scholarship (csc type b — high-level postgraduate program)')) {
    await prisma.scholarship.create({
      data: {
        universityId: lnu.id,
        title: 'Chinese Government Scholarship (CSC Type B — High-Level Postgraduate Program)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10140 (Liaoning University)',
          'Category: Type B High-Level Postgraduate',
          'Degrees: Master (under 35) & PhD (under 40)',
          'Application Deadline: 3 February 2027',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Comprehensive medical insurance',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Apply via studyinchina.csc.edu.cn and lnu.17gz.org.',
        eligiblePrograms: JSON.stringify(['Master Programs', 'Doctoral Programs']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '3 February 2027',
        sourceUrl: 'https://www.lnu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // LNU Fees
  const existingLnuFeeItems = new Set((lnu.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingLnuFeeItems.has('application fee (csc type b)')) {
    await prisma.fee.create({
      data: {
        universityId: lnu.id,
        item: 'Application Fee (CSC Type B)',
        cost: '0 CNY (Waived for CSC)',
        notes: 'Liaoning University waives application fee for CSC Type B candidates',
        validFor: '2027 Intake',
        sourceUrl: 'https://www.lnu.edu.cn/',
      },
    });
    changes++;
  }
  if (!existingLnuFeeItems.has('comprehensive medical insurance')) {
    await prisma.fee.create({
      data: {
        universityId: lnu.id,
        item: 'Comprehensive Medical Insurance',
        cost: '800 CNY/Year',
        notes: 'Covered uniformly by CSC scholarship',
        validFor: '2027 Intake',
        sourceUrl: 'https://www.lnu.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 2. Changchun University of Science and Technology (CUST) - New Record
  // ==========================================
  const custSources = JSON.stringify([
    'https://www.cust.edu.cn/',
    'https://ieec.cust.edu.cn/',
    'https://cust.17gz.org/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const custTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 18,000–24,000 / year',
    'Master Degree Programs (English & Chinese): CNY 26,000–28,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (PhD): CNY 30,000–35,000 / year (100% Waived under CSC Type B)',
  ]);
  const custDocuments = JSON.stringify([
    'Passport identification page (valid >= 12 months)',
    'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
    'Official academic transcripts stamped by previous institutions',
    'Language proficiency certificate (IELTS >= 6.0 / TOEFL >= 80 or HSK 4/5)',
    'Study plan or research proposal (>=1,000 words)',
    'Two academic recommendation letters from professors or associate professors',
    'Supervisor acceptance letter (recommended)',
    'Foreigner Physical Examination Form (issued within 6 months)',
    'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
    'Application fee payment voucher (CNY 800 paid in CUST system)',
  ]);
  const custNotes = JSON.stringify([
    'Location: No. 7089 Weixing Road, Changchun, Jilin Province, China.',
    'Renowned as the "Cradle of China’s Optical Science and Technology".',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10186 · Deadline 28 February 2027.',
    'Dual-system application: studyinchina.csc.edu.cn & cust.17gz.org.',
    'Application fee: CNY 800 payable inside the CUST online portal.',
    'Official Portal: ieec.cust.edu.cn / cust.17gz.org',
  ]);

  let cust = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'changchun-university-of-science-and-technology' },
        { legacySlugs: { contains: 'cust' } },
        { aliases: { contains: 'CUST' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!cust) {
    cust = await prisma.university.create({
      data: {
        slug: 'changchun-university-of-science-and-technology',
        name: 'Changchun University of Science and Technology',
        location: 'Changchun, Jilin Province, China',
        country: 'China',
        city: 'Changchun',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 135,
        rankingWorld: 900,
        rankingNational: 135,
        majors:
          'Optical Engineering, Mechanical Engineering, Computer Science and Technology, Electronic Science and Technology, Materials Science and Engineering, Optoelectronic Information Engineering',
        tuition: 'CNY 18,000–35,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: custTuitionDetails,
        documents: custDocuments,
        deadlineApplication: '28 February 2027 (CSC Type B Agency 10186)',
        deadlineStartDate: 'September 2027',
        notes: custNotes,
        badges: JSON.stringify([
          'Optics Engineering Pioneer',
          'National Defense Key University',
          'CSC Agency 10186',
          'English Taught',
        ]),
        logo: '/images/universities/logos/cust.webp',
        isActive: true,
        officialUrl: 'https://www.cust.edu.cn/',
        aliases: JSON.stringify([
          'CUST',
          'Changchun University of Science and Technology',
          '长春理工大学',
          'cust',
        ]),
        legacySlugs: JSON.stringify(['cust']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Jilin Provincial People's Government",
        recognitionSourceUrl: 'https://ieec.cust.edu.cn/',
        sourceUrls: custSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // CUST Programs
  const custPrograms = [
    {
      level: 'Master',
      name: 'Optical Engineering (MSc)',
      subject: 'Optics & Photonics',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '28,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in STEM under 35', 'IELTS >= 6.0 / TOEFL >= 80']),
      sourceUrl: 'https://ieec.cust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Computer Science and Technology (MSc)',
      subject: 'Computer Science',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in CS/IT under 35']),
      sourceUrl: 'https://ieec.cust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Mechanical Engineering (MSc)',
      subject: 'Mechanical Engineering',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in Mechanical/Mechatronics under 35']),
      sourceUrl: 'https://ieec.cust.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Optical Engineering (PhD)',
      subject: 'Optics & Photonics',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '35,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Master degree in Optics/Physics/EE under 40']),
      sourceUrl: 'https://ieec.cust.edu.cn/',
      status: 'active',
    },
  ];
  const existingCustProgKeys = new Set(
    (cust.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of custPrograms) {
    if (!existingCustProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: cust.id, ...prog },
      });
      changes++;
    }
  }

  // CUST Scholarships
  const existingCustScholTitles = new Set((cust.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingCustScholTitles.has('chinese government scholarship (csc type b — agency 10186)')) {
    await prisma.scholarship.create({
      data: {
        universityId: cust.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10186)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10186 (Changchun University of Science and Technology)',
          'Category: Type B High-Level Postgraduate Program',
          'Coverage: 100% Tuition waiver, On-campus accommodation, Monthly stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Medical insurance',
          'Deadline: 28 February 2027 via studyinchina.csc.edu.cn and cust.17gz.org',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Application fee CNY 800.',
        eligiblePrograms: JSON.stringify(['Optical Engineering', 'Computer Science', 'Mechanical Engineering']),
        coverage: 'Full tuition, dorm, insurance, and monthly living allowance.',
        deadline: '28 February 2027',
        sourceUrl: 'https://ieec.cust.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // CUST Fees
  const existingCustFeeItems = new Set((cust.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingCustFeeItems.has('application fee (cust portal)')) {
    await prisma.fee.create({
      data: {
        universityId: cust.id,
        item: 'Application Fee (CUST Portal)',
        cost: '800 CNY',
        notes: 'Payable directly inside cust.17gz.org application system',
        validFor: '2027 Intake',
        sourceUrl: 'https://ieec.cust.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 3. Shenyang Jianzhu University (SJZU) - New Record
  // ==========================================
  const sjzuSources = JSON.stringify([
    'https://www.sjzu.edu.cn/',
    'https://sie.sjzu.edu.cn/',
    'https://sjzu.17gz.org/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const sjzuTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 16,000–20,000 / year',
    'Master Degree Programs (English & Chinese): CNY 22,000–26,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (PhD): CNY 26,000–30,000 / year (100% Waived under CSC Type B)',
  ]);
  const sjzuDocuments = JSON.stringify([
    'Passport identification page (valid >= 12 months)',
    'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
    'Official academic transcripts stamped by previous institutions',
    'Language proficiency certificate (IELTS >= 6.0 / TOEFL >= 80 or HSK 4/5)',
    'Study plan or research proposal (>=1,000 words)',
    'Two academic recommendation letters from professors or associate professors',
    'Portfolio of architectural/design works (for Architecture / Urban Planning applicants)',
    'Foreigner Physical Examination Form (issued within 6 months)',
    'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
    'Application fee payment voucher (CNY 800 paid in SJZU system)',
  ]);
  const sjzuNotes = JSON.stringify([
    'Location: No. 9 Hunnan East Road, Hunnan District, Shenyang, Liaoning Province, China.',
    'Co-developed by the Ministry of Housing and Urban-Rural Development (MoHURD) and Liaoning Province.',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10153 · Deadline 1 March 2027.',
    'Dual-system application: studyinchina.csc.edu.cn & sjzu.17gz.org.',
    'Application fee: CNY 800 inside the SJZU portal.',
    'Official Portal: sie.sjzu.edu.cn / sjzu.17gz.org',
  ]);

  let sjzu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'shenyang-jianzhu-university' },
        { legacySlugs: { contains: 'sjzu' } },
        { aliases: { contains: 'SJZU' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sjzu) {
    sjzu = await prisma.university.create({
      data: {
        slug: 'shenyang-jianzhu-university',
        name: 'Shenyang Jianzhu University',
        location: 'Shenyang, Liaoning Province, China',
        country: 'China',
        city: 'Shenyang',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 180,
        rankingWorld: 1100,
        rankingNational: 180,
        majors:
          'Civil Engineering, Architecture, Urban and Rural Planning, Mechanical Engineering, Computer Science and Technology, Environmental Engineering, Structural Engineering',
        tuition: 'CNY 16,000–30,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: sjzuTuitionDetails,
        documents: sjzuDocuments,
        deadlineApplication: '1 March 2027 (CSC Type B Agency 10153)',
        deadlineStartDate: 'September 2027',
        notes: sjzuNotes,
        badges: JSON.stringify([
          'MoHURD Co-constructed',
          'Civil Engineering Key',
          'Architecture Top Ranking',
          'CSC Agency 10153',
          'English Taught',
        ]),
        logo: '/images/universities/logos/sjzu.webp',
        isActive: true,
        officialUrl: 'https://www.sjzu.edu.cn/',
        aliases: JSON.stringify([
          'SJZU',
          'Shenyang Jianzhu University',
          '沈阳建筑大学',
          'sjzu',
        ]),
        legacySlugs: JSON.stringify(['sjzu']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Housing and Urban-Rural Development (MoHURD) & Ministry of Education (MoE), PR China",
        recognitionSourceUrl: 'https://sie.sjzu.edu.cn/',
        sourceUrls: sjzuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // SJZU Programs
  const sjzuPrograms = [
    {
      level: 'Master',
      name: 'Civil Engineering (MSc)',
      subject: 'Civil & Structural Engineering',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '1 March 2027',
      eligibility: JSON.stringify(['Bachelor degree in Civil Engineering under 35']),
      sourceUrl: 'https://sie.sjzu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Architecture (MArch)',
      subject: 'Architecture',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '1 March 2027',
      eligibility: JSON.stringify(['Bachelor degree in Architecture with design portfolio under 35']),
      sourceUrl: 'https://sie.sjzu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Civil Engineering (PhD)',
      subject: 'Civil Engineering',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '30,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '1 March 2027',
      eligibility: JSON.stringify(['Master degree in Civil/Structural Engineering under 40']),
      sourceUrl: 'https://sie.sjzu.edu.cn/',
      status: 'active',
    },
  ];
  const existingSjzuProgKeys = new Set(
    (sjzu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of sjzuPrograms) {
    if (!existingSjzuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: sjzu.id, ...prog },
      });
      changes++;
    }
  }

  // SJZU Scholarships
  const existingSjzuScholTitles = new Set((sjzu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingSjzuScholTitles.has('chinese government scholarship (csc type b — agency 10153)')) {
    await prisma.scholarship.create({
      data: {
        universityId: sjzu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10153)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10153 (Shenyang Jianzhu University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Medical insurance',
          'Deadline: 1 March 2027 via studyinchina.csc.edu.cn and sjzu.17gz.org',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Application fee CNY 800.',
        eligiblePrograms: JSON.stringify(['Civil Engineering', 'Architecture', 'Mechanical Engineering']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '1 March 2027',
        sourceUrl: 'https://sie.sjzu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // SJZU Fees
  const existingSjzuFeeItems = new Set((sjzu.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingSjzuFeeItems.has('application fee (sjzu portal)')) {
    await prisma.fee.create({
      data: {
        universityId: sjzu.id,
        item: 'Application Fee (SJZU Portal)',
        cost: '800 CNY',
        notes: 'Payable directly inside sjzu.17gz.org application system',
        validFor: '2027 Intake',
        sourceUrl: 'https://sie.sjzu.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 4. Yunnan Normal University (YNNU) - New Record
  // ==========================================
  const ynnuSources = JSON.stringify([
    'https://www.ynnu.edu.cn/',
    'https://lx.ynnu.edu.cn/',
    'https://ynnu.17gz.org/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const ynnuTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 15,000–18,000 / year',
    'Master Degree Programs (English & Chinese): CNY 20,000–24,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (PhD): CNY 24,000–28,000 / year (100% Waived under CSC Type B)',
  ]);
  const ynnuDocuments = JSON.stringify([
    'Passport identification page (valid >= 12 months)',
    'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
    'Official academic transcripts stamped by previous institutions',
    'Language proficiency certificate (HSK 5 for Chinese-taught, IELTS >= 6.0 for English-taught)',
    'Study plan or research proposal (>=1,000 words)',
    'Two academic recommendation letters from professors or associate professors',
    'Foreigner Physical Examination Form (issued within 6 months)',
    'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
    'Application fee payment voucher (CNY 600 paid in YNNU system)',
  ]);
  const ynnuNotes = JSON.stringify([
    'Location: No. 1 Juxian Street, Chenggong District, Kunming, Yunnan Province, China.',
    'Key Provincial Normal University in Kunming ("Spring City"); National Demonstration Base for International Chinese Education.',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10681 · Deadline 28 February 2027.',
    'Dual-system application: studyinchina.csc.edu.cn & ynnu.17gz.org.',
    'Application fee: CNY 600 payable in the YNNU portal.',
    'Official Portal: lx.ynnu.edu.cn / ynnu.17gz.org',
  ]);

  let ynnu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'yunnan-normal-university' },
        { legacySlugs: { contains: 'ynnu' } },
        { aliases: { contains: 'YNNU' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!ynnu) {
    ynnu = await prisma.university.create({
      data: {
        slug: 'yunnan-normal-university',
        name: 'Yunnan Normal University',
        location: 'Kunming, Yunnan Province, China',
        country: 'China',
        city: 'Kunming',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 140,
        rankingWorld: 950,
        rankingNational: 140,
        majors:
          'International Chinese Language Education (MTCSOL), Education, Geographic Information Science, Environmental Science, Tourism Management, Chinese Language and Literature, Renewable Energy Engineering',
        tuition: 'CNY 15,000–28,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: ynnuTuitionDetails,
        documents: ynnuDocuments,
        deadlineApplication: '28 February 2027 (CSC Type B Agency 10681)',
        deadlineStartDate: 'September 2027',
        notes: ynnuNotes,
        badges: JSON.stringify([
          'Demonstration Base for Chinese Education',
          'National Southwest Associated University Heritage',
          'CSC Agency 10681',
          'Kunming Spring City',
        ]),
        logo: '/images/universities/logos/ynnu.webp',
        isActive: true,
        officialUrl: 'https://www.ynnu.edu.cn/',
        aliases: JSON.stringify([
          'YNNU',
          'Yunnan Normal University',
          '云南师范大学',
          'ynnu',
        ]),
        legacySlugs: JSON.stringify(['ynnu']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Yunnan Provincial People's Government",
        recognitionSourceUrl: 'https://lx.ynnu.edu.cn/',
        sourceUrls: ynnuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // YNNU Programs
  const ynnuPrograms = [
    {
      level: 'Master',
      name: 'International Chinese Language Education (MTCSOL)',
      subject: 'Chinese Language & Pedagogy',
      languages: 'Chinese, English',
      duration: '2-3 years',
      intakes: 'September',
      tuition: '22,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Bachelor degree under 35', 'HSK 5 >= 210 points']),
      sourceUrl: 'https://lx.ynnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Geographic Information Science (MSc)',
      subject: 'Geography & GIS',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '24,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Bachelor degree in Geography/GIS/CS under 35']),
      sourceUrl: 'https://lx.ynnu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Education Principles (PhD)',
      subject: 'Education',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '28,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '28 February 2027',
      eligibility: JSON.stringify(['Master degree in Education under 40']),
      sourceUrl: 'https://lx.ynnu.edu.cn/',
      status: 'active',
    },
  ];
  const existingYnnuProgKeys = new Set(
    (ynnu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of ynnuPrograms) {
    if (!existingYnnuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: ynnu.id, ...prog },
      });
      changes++;
    }
  }

  // YNNU Scholarships
  const existingYnnuScholTitles = new Set((ynnu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingYnnuScholTitles.has('chinese government scholarship (csc type b — agency 10681)')) {
    await prisma.scholarship.create({
      data: {
        universityId: ynnu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10681)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10681 (Yunnan Normal University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Medical insurance',
          'Deadline: 28 February 2027 via studyinchina.csc.edu.cn and ynnu.17gz.org',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Application fee CNY 600.',
        eligiblePrograms: JSON.stringify(['MTCSOL', 'Education', 'GIS', 'Environmental Science']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '28 February 2027',
        sourceUrl: 'https://lx.ynnu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // YNNU Fees
  const existingYnnuFeeItems = new Set((ynnu.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingYnnuFeeItems.has('application fee (ynnu portal)')) {
    await prisma.fee.create({
      data: {
        universityId: ynnu.id,
        item: 'Application Fee (YNNU Portal)',
        cost: '600 CNY',
        notes: 'Payable directly inside ynnu.17gz.org application system',
        validFor: '2027 Intake',
        sourceUrl: 'https://lx.ynnu.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 5. Henan University (HENU) - New Record
  // ==========================================
  const henuSources = JSON.stringify([
    'https://www.henu.edu.cn/',
    'https://dflc.henu.edu.cn/',
    'https://henu.17gz.org/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const henuTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 16,000–20,000 / year',
    'Master Degree Programs (English & Chinese): CNY 22,000–26,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (PhD): CNY 26,000–32,000 / year (100% Waived under CSC Type B)',
  ]);
  const henuDocuments = JSON.stringify([
    'Passport identification page (valid >= 12 months)',
    'Notarized highest degree certificate (Bachelor for Master, Master for PhD)',
    'Official academic transcripts stamped by previous institutions',
    'Language proficiency certificate (IELTS >= 6.0 / TOEFL >= 80 or HSK 5)',
    'Study plan or research proposal (>=1,000 words)',
    'Two academic recommendation letters from professors or associate professors',
    'Supervisor acceptance letter (recommended)',
    'Foreigner Physical Examination Form (issued within 6 months)',
    'Certificate of No Criminal Record / Police Clearance (issued within 6 months)',
    'Application fee payment voucher (CNY 600 paid in HENU system)',
  ]);
  const henuNotes = JSON.stringify([
    'Location: Kaifeng (Minglun / Jinming Campuses) & Zhengzhou (Longzi Lake Campus), Henan Province, China.',
    'National "Double First-Class" construction university with over 110 years of history (est. 1912).',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10475 · Early Deadline 17 January 2027.',
    'Dual-system application: studyinchina.csc.edu.cn & henu.17gz.org.',
    'Application fee: CNY 600 payable in the HENU portal.',
    'Official Portal: dflc.henu.edu.cn / henu.17gz.org',
  ]);

  let henu = await prisma.university.findFirst({
    where: {
      OR: [{ slug: 'henan-university' }, { legacySlugs: { contains: 'henu' } }, { aliases: { contains: 'HENU' } }],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!henu) {
    henu = await prisma.university.create({
      data: {
        slug: 'henan-university',
        name: 'Henan University',
        location: 'Kaifeng / Zhengzhou, Henan Province, China',
        country: 'China',
        city: 'Kaifeng',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 65,
        rankingWorld: 550,
        rankingNational: 65,
        majors:
          'Biology, Ecology, Chemistry, Chemical Engineering, Physics, Microelectronics, Economics, International Trade, Education, History, Geographic Science',
        tuition: 'CNY 16,000–32,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: henuTuitionDetails,
        documents: henuDocuments,
        deadlineApplication: '17 January 2027 (CSC Type B Agency 10475)',
        deadlineStartDate: 'September 2027',
        notes: henuNotes,
        badges: JSON.stringify([
          'National Double First-Class',
          'Century-Old Prestigious University',
          'CSC Agency 10475',
          'Biology & Chemistry Top ESI',
        ]),
        logo: '/images/universities/logos/henu.webp',
        isActive: true,
        officialUrl: 'https://www.henu.edu.cn/',
        aliases: JSON.stringify(['HENU', 'Henan University', '河南大学', 'henu']),
        legacySlugs: JSON.stringify(['henu']),
        relationshipType: 'public_direct_application',
        recognitionAuthority: "Ministry of Education (MoE), PR China & Henan Provincial People's Government",
        recognitionSourceUrl: 'https://dflc.henu.edu.cn/',
        sourceUrls: henuSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // HENU Programs
  const henuPrograms = [
    {
      level: 'Master',
      name: 'Biology & Ecology (MSc)',
      subject: 'Biological Sciences',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '17 January 2027',
      eligibility: JSON.stringify(['Bachelor degree in Biology/Life Sciences under 35']),
      sourceUrl: 'https://dflc.henu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Master',
      name: 'Chemistry and Chemical Engineering (MSc)',
      subject: 'Chemistry',
      languages: 'English, Chinese',
      duration: '3 years',
      intakes: 'September',
      tuition: '26,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '17 January 2027',
      eligibility: JSON.stringify(['Bachelor degree in Chemistry/Chemical Tech under 35']),
      sourceUrl: 'https://dflc.henu.edu.cn/',
      status: 'active',
    },
    {
      level: 'Doctoral',
      name: 'Biology (PhD)',
      subject: 'Biological Sciences',
      languages: 'English, Chinese',
      duration: '4 years',
      intakes: 'September',
      tuition: '32,000 CNY/Year (Waived under CSC Type B)',
      applicationDeadline: '17 January 2027',
      eligibility: JSON.stringify(['Master degree in Biology/Bioengineering under 40']),
      sourceUrl: 'https://dflc.henu.edu.cn/',
      status: 'active',
    },
  ];
  const existingHenuProgKeys = new Set(
    (henu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );
  for (const prog of henuPrograms) {
    if (!existingHenuProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
      await prisma.program.create({
        data: { universityId: henu.id, ...prog },
      });
      changes++;
    }
  }

  // HENU Scholarships
  const existingHenuScholTitles = new Set((henu.scholarships || []).map((s) => s.title.trim().toLowerCase()));
  if (!existingHenuScholTitles.has('chinese government scholarship (csc type b — agency 10475)')) {
    await prisma.scholarship.create({
      data: {
        universityId: henu.id,
        title: 'Chinese Government Scholarship (CSC Type B — Agency 10475)',
        type: 'Full (CSC)',
        details: JSON.stringify([
          'CSC Agency Number: 10475 (Henan University)',
          'Category: Type B High-Level Postgraduate Program',
          'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Medical insurance',
          'Deadline: Early deadline 17 January 2027 via studyinchina.csc.edu.cn and henu.17gz.org',
        ]),
        amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
        condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Early application mandatory.',
        eligiblePrograms: JSON.stringify(['Biology', 'Chemistry', 'Economics', 'Education', 'History']),
        coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
        deadline: '17 January 2027',
        sourceUrl: 'https://dflc.henu.edu.cn/',
        status: 'active',
      },
    });
    changes++;
  }

  // HENU Fees
  const existingHenuFeeItems = new Set((henu.fees || []).map((f) => f.item.trim().toLowerCase()));
  if (!existingHenuFeeItems.has('application fee (henu portal)')) {
    await prisma.fee.create({
      data: {
        universityId: henu.id,
        item: 'Application Fee (HENU Portal)',
        cost: '600 CNY',
        notes: 'Payable directly inside henu.17gz.org application system',
        validFor: '2027 Intake',
        sourceUrl: 'https://dflc.henu.edu.cn/',
      },
    });
    changes++;
  }

  // ==========================================
  // 6. Nanjing University of Posts & Telecommunications (NJUPT) - Update Existing
  // ==========================================
  const njuptSources = JSON.stringify([
    'https://www.njupt.edu.cn/',
    'http://admission.njupt.edu.cn/',
    'https://studyinchina.csc.edu.cn/',
    'https://www.campuschina.org/',
  ]);
  const njuptTuitionDetails = JSON.stringify([
    'Bachelor Degree Programs: CNY 18,000–22,000 / year',
    'Master Degree Programs (2-Year Fast-Track English-Taught): CNY 26,000 / year (100% Waived under CSC Type B)',
    'Doctoral Degree Programs (4-Year PhD): CNY 34,000 / year (100% Waived under CSC Type B)',
  ]);
  const njuptNotes = JSON.stringify([
    'Location: No. 9 Wenyuan Road, Xianlin University City, Nanjing, Jiangsu Province, China.',
    'National "Double First-Class" Key University under the Ministry of Education and Jiangsu Province.',
    'Chinese Government Scholarship (CSC Type B): Agency No. 10293 · Deadline 28 February 2027.',
    'Fast-track 2-Year English Master’s in Electronic Information, Computer Technology, AI, and MBA.',
    'Application fee: CNY 800 payable directly inside the NJUPT portal (admission.njupt.edu.cn).',
    'Official Portal: admission.njupt.edu.cn',
  ]);

  const njupt = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'njupt' },
        { slug: 'nanjing-university-of-posts-and-telecommunications' },
        { aliases: { contains: 'NJUPT' } },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (njupt) {
    let existingAliases = [];
    try {
      existingAliases = JSON.parse(njupt.aliases || '[]');
      if (!Array.isArray(existingAliases)) existingAliases = [];
    } catch {
      existingAliases = [];
    }
    const nextAliases = JSON.stringify(
      Array.from(new Set([...existingAliases, 'NJUPT', 'Nanjing University of Posts and Telecommunications', '南京邮电大学', 'njupt'])),
    );

    await prisma.university.update({
      where: { id: njupt.id },
      data: {
        location: 'Nanjing, Jiangsu Province, China',
        city: 'Nanjing',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 80,
        rankingWorld: 600,
        rankingNational: 80,
        majors:
          'Electronic Information, Computer Technology, Artificial Intelligence, Business Administration (MBA), Information and Communication Engineering, Electronic Science and Technology, Cyberspace Security, Optical Engineering',
        tuition: 'CNY 18,000–34,000 / year (100% Waived under CSC Type B)',
        tuitionDetails: njuptTuitionDetails,
        deadlineApplication: '28 February 2027 (CSC Type B Agency 10293)',
        deadlineStartDate: 'September 2027',
        notes: njuptNotes,
        badges: JSON.stringify([
          'National Double First-Class',
          'CSC Agency 10293',
          'Top 1% ESI Engineering & CS',
          '2-Year Fast-Track Masters',
          'English Taught',
        ]),
        officialUrl: 'http://admission.njupt.edu.cn/',
        aliases: nextAliases,
        sourceUrls: njuptSources,
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified',
      },
    });
    changes++;

    // NJUPT Graduate Programs
    const njuptGradPrograms = [
      {
        level: 'Master',
        name: 'Electronic Information (MSc — 2-Year Fast-Track)',
        subject: 'Electronics & Information',
        languages: 'English',
        duration: '2 years',
        intakes: 'September',
        tuition: '26,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Bachelor degree in STEM under 35', 'IELTS >= 6.0 / TOEFL >= 80']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Computer Technology (MSc — 2-Year Fast-Track)',
        subject: 'Computer Science',
        languages: 'English',
        duration: '2 years',
        intakes: 'September',
        tuition: '26,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Bachelor degree in CS/Software under 35', 'IELTS >= 6.0 / TOEFL >= 80']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Artificial Intelligence (MSc — 2-Year Fast-Track)',
        subject: 'Artificial Intelligence',
        languages: 'English',
        duration: '2 years',
        intakes: 'September',
        tuition: '26,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Bachelor degree in AI/Data/CS under 35', 'IELTS >= 6.0 / TOEFL >= 80']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Business Administration (MBA — 2-Year Fast-Track)',
        subject: 'Business Administration',
        languages: 'English',
        duration: '2 years',
        intakes: 'September',
        tuition: '26,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Bachelor degree under 35', 'IELTS >= 6.0 / TOEFL >= 80']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
      {
        level: 'Doctoral',
        name: 'Information and Communication Engineering (PhD)',
        subject: 'Telecommunications',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: '34,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Master degree in Communications/EE under 40']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
      {
        level: 'Doctoral',
        name: 'Electronic Science and Technology (PhD)',
        subject: 'Electronics & Microelectronics',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: '34,000 CNY/Year (Waived under CSC Type B)',
        applicationDeadline: '28 February 2027',
        eligibility: JSON.stringify(['Master degree in Electronics/Physics under 40']),
        sourceUrl: 'http://admission.njupt.edu.cn/',
        status: 'active',
      },
    ];
    const existingNjuptProgKeys = new Set(
      (njupt.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
    );
    for (const prog of njuptGradPrograms) {
      if (!existingNjuptProgKeys.has(`${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`)) {
        await prisma.program.create({
          data: { universityId: njupt.id, ...prog },
        });
        changes++;
      }
    }

    // NJUPT Scholarships
    const existingNjuptScholTitles = new Set((njupt.scholarships || []).map((s) => s.title.trim().toLowerCase()));
    if (!existingNjuptScholTitles.has('chinese government scholarship (csc type b — agency 10293)')) {
      await prisma.scholarship.create({
        data: {
          universityId: njupt.id,
          title: 'Chinese Government Scholarship (CSC Type B — Agency 10293)',
          type: 'Full (CSC)',
          details: JSON.stringify([
            'CSC Agency Number: 10293 (Nanjing University of Posts and Telecommunications)',
            'Category: Type B High-Level Postgraduate Program',
            'Eligible Levels: Master (2-Year Fast-Track) & PhD (4 Years)',
            'Benefits: 100% Tuition waiver, On-campus accommodation, Monthly living stipend (Master: 3,000 CNY/mo, PhD: 3,500 CNY/mo), Comprehensive medical insurance',
            'Deadline: 28 February 2027 via studyinchina.csc.edu.cn and admission.njupt.edu.cn',
          ]),
          amount: '100% Tuition Waiver + Free Campus Accommodation + Monthly Stipend + Comprehensive Medical Insurance',
          condition: 'Non-Chinese citizen. Master under 35, PhD under 40. Application fee CNY 800.',
          eligiblePrograms: JSON.stringify(['Electronic Information', 'Computer Technology', 'AI', 'MBA', 'PhD Tracks']),
          coverage: 'Full tuition, room, medical insurance, monthly living allowance.',
          deadline: '28 February 2027',
          sourceUrl: 'http://admission.njupt.edu.cn/',
          status: 'active',
        },
      });
      changes++;
    }

    // NJUPT Fees
    const existingNjuptFeeItems = new Set((njupt.fees || []).map((f) => f.item.trim().toLowerCase()));
    if (!existingNjuptFeeItems.has('application fee (njupt portal)')) {
      await prisma.fee.create({
        data: {
          universityId: njupt.id,
          item: 'Application Fee (NJUPT Portal)',
          cost: '800 CNY',
          notes: 'Payable directly inside admission.njupt.edu.cn application portal',
          validFor: '2027 Intake',
          sourceUrl: 'http://admission.njupt.edu.cn/',
        },
      });
      changes++;
    }
  }

  return changes;
}

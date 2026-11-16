// 25 WeChat Batch 3 Guides & University Upserts (2027 Admissions)
// Strict zero-competitor, global international audience, rich SEO & LLM support

import { WECHAT_BATCH3_25_GUIDES_DATA } from '../../src/data/newWechatBatch3Guides2027.ts';

export const WECHAT_BATCH3_25_GUIDE_SPECS = Object.values(WECHAT_BATCH3_25_GUIDES_DATA).map((guide) => ({
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

export async function upsert25WechatBatch3Universities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. Shanghai Institute of Technology (SIT) - NEW
  // ==========================================
  let sit = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'shanghai-institute-of-technology' },
        { name: 'Shanghai Institute of Technology' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sit) {
    sit = await prisma.university.create({
      data: {
        slug: 'shanghai-institute-of-technology',
        name: 'Shanghai Institute of Technology',
        location: 'Shanghai, China',
        country: 'China',
        city: 'Shanghai',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 180,
        rankingWorld: 1000,
        rankingNational: 180,
        majors: 'Chemical Engineering, Applied Chemistry, Mechanical Engineering, Computer Science, Materials Science, Business Administration',
        tuition: 'CNY 18,000–28,000 / year (Eligible for Shanghai Government Scholarship)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs (Science & Engineering): CNY 18,000 / academic year',
          'Master Programs (Engineering & Science): CNY 24,000 / academic year',
          'Doctoral Programs: CNY 28,000 / academic year',
          'Accommodation: CNY 4,800–7,200 / year (Double/Single Room)',
        ]),
        documents: JSON.stringify([
          'Valid International Passport (18+ months remaining)',
          'High School Diploma & Transcript (or Bachelor Degree for Graduate)',
          'Foreigner Physical Examination Form (Within 6 months)',
          'Certificate of Non-Criminal Record (Police Clearance)',
          'Language Proficiency Certificate (HSK 4 score ≥ 180 or IELTS 6.0 / English Medium Certificate)',
          'Financial Support Guarantee Statement ($5,000 equivalent)',
          'Study Plan or Personal Statement (600+ words)',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "First Applied Technology University in Shanghai, renowned for chemical and engineering tech",
          "Dual Campuses: Fengxian (Academic Waterfront Campus) & Xuhui (Downtown Center)",
          "Full Shanghai Government Scholarship (Type B Tuition & Type A Full) available for international students",
          "Official Admissions Portal: sit.edu.cn | Email: cie@sit.edu.cn",
        ]),
        badges: JSON.stringify(['Shanghai Campus', 'Applied Technology', 'Government Scholarship']),
        logo: '/images/universities/logos/shanghai-institute-of-technology.webp',
        isActive: true,
        officialUrl: 'https://www.sit.edu.cn',
        aliases: JSON.stringify(['SIT', 'Shanghai Institute of Technology', '上海应用技术大学']),
        legacySlugs: JSON.stringify(['sit']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Shanghai Municipal Education Commission',
        recognitionSourceUrl: 'https://edu.sh.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.sit.edu.cn',
          'https://is.sit.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 2. Guangdong Pharmaceutical University (GDPU) - NEW
  // ==========================================
  let gdpu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'guangdong-pharmaceutical-university' },
        { name: 'Guangdong Pharmaceutical University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!gdpu) {
    gdpu = await prisma.university.create({
      data: {
        slug: 'guangdong-pharmaceutical-university',
        name: 'Guangdong Pharmaceutical University',
        location: 'Guangzhou, Guangdong, China',
        country: 'China',
        city: 'Guangzhou',
        intake: 'September',
        degree: 'Bachelor, Master',
        taught: 'Chinese, English',
        rankingCountry: 210,
        rankingWorld: 1100,
        rankingNational: 210,
        majors: 'Pharmacy, Clinical Medicine, Chinese Materia Medica, Biotechnology, Preventive Medicine, Nursing, Pharmaceutical Engineering',
        tuition: 'CNY 20,000–32,000 / year (Guangdong Provincial Government Scholarship Eligible)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs (Pharmacy & Medicine): CNY 20,000–25,000 / year',
          'Master Programs (Medical & Pharmaceutical Sciences): CNY 28,000–32,000 / year',
          'Accommodation: CNY 4,000–6,000 / year (On-campus international dorm)',
        ]),
        documents: JSON.stringify([
          'Valid Passport Scan (18+ months validity)',
          'High School / Grade 12 Certificate with Science background (Biology, Chemistry, Physics)',
          'Foreigner Physical Examination Record',
          'Police Clearance Certificate',
          'Language Proficiency (HSK 4 for Chinese or English Medium Certificate / IELTS 6.0)',
          'Bank Financial Proof ($5,000+ equivalent)',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "One of China's three independent pharmaceutical universities",
          "Located in Guangzhou Higher Education Mega Center (HEMC) in the Greater Bay Area",
          "Extensive clinical teaching bases with 10+ affiliated top-tier hospitals",
          "Official Admissions Portal: gdpu.edu.cn",
        ]),
        badges: JSON.stringify(['Medical & Pharmacy', 'Guangzhou Campus', 'Greater Bay Area']),
        logo: '/images/universities/logos/guangdong-pharmaceutical-university.webp',
        isActive: true,
        officialUrl: 'https://www.gdpu.edu.cn',
        aliases: JSON.stringify(['GDPU', 'Guangdong Pharmaceutical University', '广东药科大学']),
        legacySlugs: JSON.stringify(['gdpu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Guangdong Provincial Department of Education',
        recognitionSourceUrl: 'https://edu.gd.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.gdpu.edu.cn',
          'https://gjjy.gdpu.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 3. Guangdong Polytechnic Normal University (GPNU) - NEW
  // ==========================================
  let gpnu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'guangdong-polytechnic-normal-university' },
        { name: 'Guangdong Polytechnic Normal University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!gpnu) {
    gpnu = await prisma.university.create({
      data: {
        slug: 'guangdong-polytechnic-normal-university',
        name: 'Guangdong Polytechnic Normal University',
        location: 'Guangzhou, Guangdong, China',
        country: 'China',
        city: 'Guangzhou',
        intake: 'September',
        degree: 'Bachelor, Master',
        taught: 'Chinese, English',
        rankingCountry: 250,
        rankingWorld: 1200,
        rankingNational: 250,
        majors: 'Electronic Information Engineering, Mechanical Engineering, Computer Science, Automation, International Economics & Trade',
        tuition: 'CNY 16,000–22,000 / year',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 16,000–18,000 / academic year',
          'Master Programs: CNY 20,000–22,000 / academic year',
          'Dormitory: CNY 3,500–5,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid Passport Copy',
          'Certified High School / Bachelor Certificate & Mark Sheets',
          'Foreigner Health Check Report',
          'Non-Criminal Background Certificate',
          'Language Proficiency Certificate',
          'Financial Guarantee Proof',
        ]),
        deadlineApplication: '30 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "Leading vocational and technical education normal university in Southern China",
          "Five campuses across Guangzhou and Heyuan",
          "Guangdong Provincial Government Outstanding Foreign Student Scholarship eligible",
          "Official Admissions Portal: gpnu.edu.cn",
        ]),
        badges: JSON.stringify(['Guangzhou Campus', 'Vocational Engineering', 'Scholarship Eligible']),
        logo: '/images/universities/logos/guangdong-polytechnic-normal-university.webp',
        isActive: true,
        officialUrl: 'https://www.gpnu.edu.cn',
        aliases: JSON.stringify(['GPNU', 'Guangdong Polytechnic Normal University', '广东技术师范大学']),
        legacySlugs: JSON.stringify(['gpnu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Guangdong Provincial Department of Education',
        recognitionSourceUrl: 'https://edu.gd.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.gpnu.edu.cn',
          'https://gjjl.gpnu.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 4. Guangdong University of Foreign Studies (GDUFS) - NEW
  // ==========================================
  let gdufs = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'guangdong-university-of-foreign-studies' },
        { name: 'Guangdong University of Foreign Studies' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!gdufs) {
    gdufs = await prisma.university.create({
      data: {
        slug: 'guangdong-university-of-foreign-studies',
        name: 'Guangdong University of Foreign Studies',
        location: 'Guangzhou, Guangdong, China',
        country: 'China',
        city: 'Guangzhou',
        intake: 'March & September',
        degree: 'Bachelor, Master, PhD, Chinese Language',
        taught: 'Chinese, English',
        rankingCountry: 110,
        rankingWorld: 800,
        rankingNational: 110,
        majors: 'International Economics and Trade, Business Administration, Finance, International Journalism, Chinese Language & Culture, Translation & Interpreting',
        tuition: 'CNY 19,000–28,000 / year (Spring & Autumn Intakes Available)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs (Business/Economics): CNY 19,000–22,000 / year',
          'Master Programs (International Business/MBA): CNY 24,000–28,000 / year',
          'Chinese Language Program: CNY 8,600 / semester (CNY 17,200 / year)',
          'On-Campus International Housing: CNY 4,800–9,600 / year',
        ]),
        documents: JSON.stringify([
          'Passport Copy with 18+ months validity',
          'Highest Academic Diploma and Complete Transcripts',
          'Foreigner Physical Examination Record',
          'Police Clearance Certificate',
          'Language Proficiency (HSK 4/5 or IELTS 6.0 / English Proficiency Certificate)',
          'Bank Financial Statement ($4,000+ equivalent)',
        ]),
        deadlineApplication: 'Spring Intake: 10 December 2026 / Autumn Intake: 30 June 2027',
        deadlineStartDate: 'March 2027 & September 2027',
        notes: JSON.stringify([
          "China's premier international trade, foreign languages, and international business institute in Southern China",
          "Spring Intake enrollment open for degree programs and intensive language tracks",
          "Guangdong Government Outstanding International Student Scholarship & GDUFS President Scholarship",
          "Official Admissions Portal: iie.gdufs.edu.cn | Email: iie@gdufs.edu.cn",
        ]),
        badges: JSON.stringify(['Spring Intake', 'International Business', 'Guangzhou Elite']),
        logo: '/images/universities/logos/guangdong-university-of-foreign-studies.webp',
        isActive: true,
        officialUrl: 'https://www.gdufs.edu.cn',
        aliases: JSON.stringify(['GDUFS', 'Guangdong University of Foreign Studies', '广东外语外贸大学']),
        legacySlugs: JSON.stringify(['gdufs']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education & Guangdong Provincial Government',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.gdufs.edu.cn',
          'https://iie.gdufs.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 5. Renmin University of China (RUC) - NEW
  // ==========================================
  let ruc = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'renmin-university-of-china' },
        { name: 'Renmin University of China' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!ruc) {
    ruc = await prisma.university.create({
      data: {
        slug: 'renmin-university-of-china',
        name: 'Renmin University of China',
        location: 'Beijing, China',
        country: 'China',
        city: 'Beijing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 6,
        rankingWorld: 120,
        rankingNational: 6,
        majors: 'Economics, Finance, Law, International Relations, Journalism & Communication, Business Administration, Philosophy, Statistics, AI',
        tuition: 'CNY 24,000–35,000 / year (Covered under CSC Type A & Beijing Municipal Scholarships)',
        tuitionDetails: JSON.stringify([
          'Undergraduate Programs (Liberal Arts): CNY 24,000 / year',
          'Undergraduate Programs (Science & Engineering): CNY 28,000 / year',
          'Master Programs (International MBA & Economics): CNY 30,000–35,000 / year',
          'Doctoral Programs: CNY 35,000 / year (100% Covered under CSC & RUC Fellowships)',
          'Accommodation: CNY 30–80 / day (International Students Residence)',
        ]),
        documents: JSON.stringify([
          'International Passport Scan (Valid through 2028)',
          'High School Graduation Diploma & Grade Reports (A-Level, IB, or National Diploma)',
          'Language Proficiency: HSK 5 score ≥ 210 for Chinese programs or IELTS 6.5+ for English programs',
          'Foreigner Physical Examination Record',
          'Certificate of Non-Criminal Record (Police Clearance)',
          'Personal Statement & 2 Academic Recommendation Letters',
          'Financial Guarantee Statement',
        ]),
        deadlineApplication: '15 April 2027 (Undergraduate) / 10 March 2027 (CSC Type A / BGS)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "Top 1 University in China for Humanities, Social Sciences, Law, and Economics",
          "National Project 985 & Double First-Class Founding Institution in Haidian, Beijing",
          "Full CSC Type A, Beijing Municipal Government Scholarship, and RUC Presidential Awards",
          "Official Admissions Portal: iso.ruc.edu.cn | Email: iso@ruc.edu.cn",
        ]),
        badges: JSON.stringify(['Project 985', 'Double First-Class', 'Beijing Elite', 'QS Top Ranked']),
        logo: '/images/universities/logos/renmin-university-of-china.webp',
        isActive: true,
        officialUrl: 'https://www.ruc.edu.cn',
        aliases: JSON.stringify(['RUC', 'Renmin University of China', '中国人民大学']),
        legacySlugs: JSON.stringify(['ruc']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.ruc.edu.cn',
          'https://iso.ruc.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 6. Guangxi University (GXU) - NEW
  // ==========================================
  let gxu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'guangxi-university' },
        { name: 'Guangxi University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!gxu) {
    gxu = await prisma.university.create({
      data: {
        slug: 'guangxi-university',
        name: 'Guangxi University',
        location: 'Nanning, Guangxi, China',
        country: 'China',
        city: 'Nanning',
        intake: 'September',
        degree: 'Bachelor, Master, PhD, Language',
        taught: 'Chinese, English',
        rankingCountry: 85,
        rankingWorld: 650,
        rankingNational: 85,
        majors: 'Civil Engineering, Electrical Engineering, Chemical Engineering, Agricultural Sciences, International Economy & Trade, Computer Science',
        tuition: 'CNY 13,000–22,000 / year (Low cost living & generous ASEAN/Belt & Road Scholarships)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 13,000–16,000 / academic year',
          'Master Programs: CNY 18,000–20,000 / academic year',
          'Doctoral Programs: CNY 22,000 / academic year',
          'Dormitory: CNY 3,000–4,500 / year (Double Room)',
        ]),
        documents: JSON.stringify([
          'Passport (Valid for 12+ months)',
          'Notarized Highest Diploma and Academic Transcript',
          'Foreigner Physical Examination Record',
          'Non-Criminal Record Certificate',
          'HSK 4 Certificate or English Proficiency (IELTS 6.0 / Medium of Instruction)',
          'Bank Financial Proof ($3,000+ equivalent)',
        ]),
        deadlineApplication: '30 June 2027 (Self-Funded) / 31 March 2027 (CSC & Provincial)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "Only National Project 211 and Double First-Class university in Guangxi Autonomous Region",
          "Located in Nanning, the permanent host city of the China-ASEAN Expo",
          "CSC High-Level Graduate (Agency 10593) and Guangxi Government ASEAN Scholarships available",
          "Official Admissions Portal: gxu.edu.cn",
        ]),
        badges: JSON.stringify(['Project 211', 'Double First-Class', 'ASEAN Gateway', 'Green City Campus']),
        logo: '/images/universities/logos/guangxi-university.webp',
        isActive: true,
        officialUrl: 'https://www.gxu.edu.cn',
        aliases: JSON.stringify(['GXU', 'Guangxi University', '广西大学']),
        legacySlugs: JSON.stringify(['gxu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education & Guangxi Government',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.gxu.edu.cn',
          'https://gjjy.gxu.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  // ==========================================
  // 7. Northeast Agricultural University (NEAU) - NEW
  // ==========================================
  let neau = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'northeast-agricultural-university' },
        { name: 'Northeast Agricultural University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!neau) {
    neau = await prisma.university.create({
      data: {
        slug: 'northeast-agricultural-university',
        name: 'Northeast Agricultural University',
        location: 'Harbin, Heilongjiang, China',
        country: 'China',
        city: 'Harbin',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 95,
        rankingWorld: 700,
        rankingNational: 95,
        majors: 'Agricultural Engineering, Food Science & Engineering, Biotechnology, Veterinary Medicine, Economics & Management, Computer Science',
        tuition: 'CNY 14,000–24,000 / year (100% Waived for CSC Type B Recipients)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 14,000–16,000 / year',
          'Master Programs: CNY 18,000–20,000 / year',
          'Doctoral Programs: CNY 24,000 / year',
          'Accommodation: CNY 3,000–4,800 / year',
        ]),
        documents: JSON.stringify([
          'Passport Copy (18+ months valid)',
          'Notarized Highest Degree Certificate and Academic Transcripts',
          'Study Plan / Research Proposal (800+ words for graduate)',
          'Two Recommendation Letters from Professors',
          'Foreigner Physical Examination Record',
          'Certificate of Non-Criminal Record',
          'Language Certificate (HSK 4 for Chinese or English Proficiency Certificate / IELTS 6.0)',
        ]),
        deadlineApplication: '15 March 2027 (CSC Type B Agency 10224) / 30 June 2027 (Self-Funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          "National Project 211 & Double First-Class University in Harbin, Heilongjiang",
          "World-renowned Agricultural Engineering & Food Science research hub (ESI Top 1%)",
          "CSC High-Level Postgraduate Program (Agency 10224): 100% Tuition, Free Dorm, Full Medical Insurance, CNY 3,000–3,500/month stipend",
          "Official Admissions Portal: sie.neau.edu.cn | Email: studyatneau@neau.edu.cn",
        ]),
        badges: JSON.stringify(['Project 211', 'Double First-Class', 'CSC Type B Agency 10224', 'Agricultural Powerhouse']),
        logo: '/images/universities/logos/northeast-agricultural-university.webp',
        isActive: true,
        officialUrl: 'https://www.neau.edu.cn',
        aliases: JSON.stringify(['NEAU', 'Northeast Agricultural University', '东北农业大学']),
        legacySlugs: JSON.stringify(['neau']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education & Heilongjiang Provincial Government',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.neau.edu.cn',
          'https://sie.neau.edu.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
  }

  console.log(`Upserted 25 WeChat Batch 3 universities (Changes: ${changes})`);
  return changes;
}

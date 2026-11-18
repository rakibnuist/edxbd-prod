// 7 WeChat Batch 5 Guides & University Upserts (2027 Admissions)
// Strict zero-competitor, global international audience, rich SEO & LLM support

import { WECHAT_BATCH5_7_GUIDES_DATA } from '../../src/data/newWechatBatch5Guides2027.ts';

export const WECHAT_BATCH5_7_GUIDE_SPECS = Object.values(WECHAT_BATCH5_7_GUIDES_DATA).map((guide) => ({
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

export async function upsertWechatBatch5Universities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. Kunming University of Science and Technology (KUST) - NEW
  // ==========================================
  let kust = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'kunming-university-of-science-and-technology' },
        { slug: 'kust' },
        { name: 'Kunming University of Science and Technology' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!kust) {
    kust = await prisma.university.create({
      data: {
        slug: 'kunming-university-of-science-and-technology',
        name: 'Kunming University of Science and Technology',
        location: 'Kunming, Yunnan, China',
        country: 'China',
        city: 'Kunming',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'Chinese, English',
        rankingCountry: 138,
        rankingNational: 138,
        rankingWorld: 650,
        majors: 'Civil Engineering, Computer Science, Mechanical Engineering, Environmental Engineering, Metallurgy, Business Administration',
        tuition: 'CNY 15,000–25,000 / year (Full Yunnan Provincial Government Scholarship Available)',
        tuitionDetails: JSON.stringify([
          'Undergraduate Programs: CNY 15,000–18,000 / year',
          'Master Programs: CNY 20,000–22,000 / year',
          'Doctoral Programs: CNY 25,000 / year',
          'Yunnan Provincial Government Scholarship: 100% Tuition Waiver, Free On-Campus Dorm, Monthly Stipend & Insurance',
          'On-Campus Dormitory: CNY 3,000–6,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid International Passport Scan',
          'Highest Academic Diploma (notarized translation in English or Chinese)',
          'Official Academic Transcripts (notarized)',
          'CSCA Exam Score Report (Mandatory for Bachelor applicants)',
          'Foreigner Physical Examination Form (issued after October 2026)',
          'Certificate of Non-Criminal Record (issued after October 2026)',
          'Study or Research Plan (minimum 1,000 words)',
          'Two Academic Recommendation Letters (Postgraduate applicants)',
          'HSK Level 4 or above certificate',
          'Bank Statement with minimum USD 3,000 balance',
        ]),
        deadlineApplication: '31 January 2027 (Yunnan Government Scholarship)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Kunming University of Science and Technology (KUST) is an accredited public university in Kunming, Yunnan, ranked #138 in China by ShanghaiRanking.',
          'Designated host institution for the Yunnan Provincial Government Full Scholarship covering tuition, housing, and monthly living allowances.',
          'Undergraduate applicants must provide a valid CSCA test score (compulsory Chinese and Math).',
          'Official Admissions Portal: http://kmust.at0086.cn/StuApplication/Login.aspx',
        ]),
        badges: JSON.stringify(['Full Scholarship', 'Yunnan Government Scholarship', 'CSCA Required', 'Engineering & Tech', 'Double First Class Provincial Key']),
        logo: '/images/universities/logos/kunming-university-of-science-and-technology.webp',
        isActive: true,
        officialUrl: 'https://www.kust.edu.cn',
        aliases: JSON.stringify(['KUST', 'Kunming University of Science and Technology', '昆明理工大学', 'KMUST', 'Kunming Tech']),
        legacySlugs: JSON.stringify(['kust', 'kmust']),
        relationshipType: 'authorized_representative',
        verificationStatus: 'verified',
        recognitionAuthority: 'Yunnan Provincial Department of Education & Ministry of Education of the PRC',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.kust.edu.cn',
          'http://kmust.at0086.cn/StuApplication/Login.aspx',
          'https://www.shanghairanking.com/universities/kunming-university-of-science-and-technology',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;

    // Add programs
    await prisma.program.createMany({
      data: [
        {
          universityId: kust.id,
          name: 'Computer Science and Technology',
          level: 'Bachelor',
          subject: 'Computer Science & Software',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September 2027',
          tuition: '16,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full Yunnan Government Scholarship)',
          applicationDeadline: '31 January 2027',
          eligibility: JSON.stringify([
            'High School Diploma or equivalent (GPA 75%+ or 3.0/4.0)',
            'Age under 25',
            'Valid CSCA score report (Chinese & Mathematics)',
            'HSK Level 4 certificate (score >= 180)',
            'Bank statement >= USD 3,000 and clean police clearance',
          ]),
          sourceUrl: 'https://www.kust.edu.cn',
          status: 'active',
        },
        {
          universityId: kust.id,
          name: 'Civil Engineering',
          level: 'Bachelor',
          subject: 'Civil Engineering & Construction',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September 2027',
          tuition: '16,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full Yunnan Government Scholarship)',
          applicationDeadline: '31 January 2027',
          eligibility: JSON.stringify([
            'High School Diploma or equivalent (GPA 75%+ or 3.0/4.0)',
            'Age under 25',
            'Valid CSCA score report (Chinese & Mathematics)',
            'HSK Level 4 certificate (score >= 180)',
          ]),
          sourceUrl: 'https://www.kust.edu.cn',
          status: 'active',
        },
        {
          universityId: kust.id,
          name: 'Environmental Science and Engineering',
          level: 'Master',
          subject: 'Environmental Engineering',
          languages: 'Chinese',
          duration: '3 years',
          intakes: 'September 2027',
          tuition: '20,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full Yunnan Government Scholarship)',
          applicationDeadline: '31 January 2027',
          eligibility: JSON.stringify([
            'Bachelor degree in relevant field',
            'Age under 35',
            'HSK Level 4 certificate (score >= 180)',
            'Two recommendation letters from Associate Professors or Professors',
          ]),
          sourceUrl: 'https://www.kust.edu.cn',
          status: 'active',
        },
        {
          universityId: kust.id,
          name: 'Materials Science and Engineering',
          level: 'Doctoral',
          subject: 'Materials Science & Metallurgy',
          languages: 'Chinese',
          duration: '3-4 years',
          intakes: 'September 2027',
          tuition: '25,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full Yunnan Government Scholarship)',
          applicationDeadline: '31 January 2027',
          eligibility: JSON.stringify([
            'Master degree in relevant field',
            'Age under 40',
            'HSK Level 4 certificate (score >= 180)',
            'Research proposal and two recommendation letters',
          ]),
          sourceUrl: 'https://www.kust.edu.cn',
          status: 'active',
        },
      ],
    });

    // Add scholarship
    await prisma.scholarship.create({
      data: {
        universityId: kust.id,
        title: 'Yunnan Provincial Government Full Scholarship',
        type: 'Full Scholarship',
        details: JSON.stringify([
          '100% full tuition waiver',
          'Free on-campus accommodation in international student dormitory',
          'Monthly living stipend: Undergraduate CNY 1,400/mo, Master CNY 1,700/mo, PhD CNY 2,000/mo',
          'Comprehensive medical insurance (CNY 800/year)',
        ]),
        amount: '100% Tuition, Dormitory, Monthly Stipend and Medical Insurance',
        condition: 'Age under 25 for Bachelor (with CSCA), under 35 for Master, under 40 for PhD. HSK 4 required.',
        eligiblePrograms: JSON.stringify(['All Chinese-taught Bachelor, Master and PhD programs']),
        coverage: 'Full tuition, free on-campus housing, living stipend and health insurance',
        deadline: '31 January 2027',
        sourceUrl: 'http://kmust.at0086.cn/StuApplication/Login.aspx',
        status: 'active',
      },
    });

    // Add fees
    await prisma.fee.createMany({
      data: [
        {
          universityId: kust.id,
          item: 'Undergraduate Tuition',
          cost: '16,000 CNY/Year',
          notes: 'Standard Chinese-taught STEM bachelor degree (100% waived under Yunnan Government Scholarship)',
          sourceUrl: 'https://www.kust.edu.cn',
        },
        {
          universityId: kust.id,
          item: 'Master Tuition',
          cost: '20,000 CNY/Year',
          notes: 'Standard Chinese-taught master degree (100% waived under Yunnan Government Scholarship)',
          sourceUrl: 'https://www.kust.edu.cn',
        },
        {
          universityId: kust.id,
          item: 'Doctoral Tuition',
          cost: '25,000 CNY/Year',
          notes: 'Standard doctoral degree (100% waived under Yunnan Government Scholarship)',
          sourceUrl: 'https://www.kust.edu.cn',
        },
        {
          universityId: kust.id,
          item: 'On-Campus Dormitory',
          cost: '3,000–6,000 CNY/Year',
          notes: 'Twin or single room options (free under Yunnan Government Scholarship)',
          sourceUrl: 'https://www.kust.edu.cn',
        },
      ],
    });
    console.log('✓ Upserted Kunming University of Science and Technology (KUST).');
  }

  // ==========================================
  // 2. Southwest Jiaotong University (SWJTU) - NEW
  // ==========================================
  let swjtu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'southwest-jiaotong-university' },
        { slug: 'swjtu' },
        { name: 'Southwest Jiaotong University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!swjtu) {
    swjtu = await prisma.university.create({
      data: {
        slug: 'southwest-jiaotong-university',
        name: 'Southwest Jiaotong University',
        location: 'Chengdu, Sichuan, China',
        country: 'China',
        city: 'Chengdu',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 53,
        rankingNational: 53,
        rankingWorld: 550,
        majors: 'Civil Engineering, Transportation Engineering, Mechanical Engineering, Computer Science, Electrical Engineering, Business Administration',
        tuition: 'CNY 22,000–35,000 / year (Full CSC Scholarship Available · Agency 10613)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs: CNY 22,000–26,000 / year',
          'Master Programs (English Taught): CNY 28,000–30,000 / year',
          'Doctoral Programs (English Taught): CNY 35,000 / year',
          'CSC Scholarship Type B (Agency 10613): Full tuition waiver, free on-campus room, monthly stipend (Master CNY 3,000/mo, PhD CNY 3,500/mo), and medical insurance',
          'Accommodation: Double room CNY 6,000 / year, Single room CNY 12,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid Passport Bio-data Page',
          'Highest Academic Diploma with certified English or Chinese translation',
          'Official Academic Transcripts',
          'Language Proficiency: IELTS 6.0+ / TOEFL 80+ / English MOI, or HSK 4 (>=180)',
          'Foreigner Physical Examination Form (within 6 months)',
          'Certificate of No Criminal Record',
          'Detailed Study Plan / Research Proposal (800+ words)',
          'Two Academic Recommendation Letters (Postgraduate applicants)',
        ]),
        deadlineApplication: '8 March 2027 (CSC Type B Round 1) / Mid-May 2027 (Round 2)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Southwest Jiaotong University (SWJTU) is a national Double First-Class key university in Chengdu, Sichuan, ranked #53 in China by ShanghaiRanking.',
          'World-famous for transportation engineering, high-speed rail technology, and civil engineering.',
          'Host institution for Chinese Government Scholarship (CSC) Type A (Bilateral) and Type B (Agency Number 10613).',
          'Official Admissions Portal: https://admission.swjtu.edu.cn',
        ]),
        badges: JSON.stringify(['Double First Class', 'CSC Agency 10613', 'Full Scholarship', 'Top 50 China', 'Engineering & Rail']),
        logo: '/images/universities/logos/southwest-jiaotong-university.webp',
        isActive: true,
        officialUrl: 'https://en.swjtu.edu.cn',
        aliases: JSON.stringify(['SWJTU', 'Southwest Jiaotong University', '西南交通大学', 'Southwest Jiaotong']),
        legacySlugs: JSON.stringify(['swjtu']),
        relationshipType: 'authorized_representative',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education of the PRC',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://en.swjtu.edu.cn',
          'https://admission.swjtu.edu.cn',
          'https://www.shanghairanking.com/universities/southwest-jiaotong-university',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;

    // Add programs
    await prisma.program.createMany({
      data: [
        {
          universityId: swjtu.id,
          name: 'Civil Engineering',
          level: 'Master',
          subject: 'Civil & Structural Engineering',
          languages: 'English',
          duration: '3 years',
          intakes: 'September 2027',
          tuition: '28,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '8 March 2027',
          eligibility: JSON.stringify([
            'Bachelor degree in Civil Engineering or related field',
            'Age under 35',
            'IELTS 6.0+ / TOEFL 80+ / English MOI Certificate',
            'Two recommendation letters and study plan',
          ]),
          sourceUrl: 'https://admission.swjtu.edu.cn',
          status: 'active',
        },
        {
          universityId: swjtu.id,
          name: 'Traffic and Transportation Engineering',
          level: 'Master',
          subject: 'Transportation & Logistics Engineering',
          languages: 'English',
          duration: '3 years',
          intakes: 'September 2027',
          tuition: '28,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '8 March 2027',
          eligibility: JSON.stringify([
            'Bachelor degree in Engineering or Logistics',
            'Age under 35',
            'IELTS 6.0+ / TOEFL 80+ / English MOI Certificate',
          ]),
          sourceUrl: 'https://admission.swjtu.edu.cn',
          status: 'active',
        },
        {
          universityId: swjtu.id,
          name: 'Mechanical Engineering',
          level: 'Doctoral',
          subject: 'Mechanical & Rail Vehicle Engineering',
          languages: 'English',
          duration: '4 years',
          intakes: 'September 2027',
          tuition: '35,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '8 March 2027',
          eligibility: JSON.stringify([
            'Master degree in relevant engineering field',
            'Age under 40',
            'IELTS 6.0+ / TOEFL 80+ / English MOI Certificate',
            'Research plan aligned with faculty supervisor',
          ]),
          sourceUrl: 'https://admission.swjtu.edu.cn',
          status: 'active',
        },
      ],
    });

    // Add CSC scholarship
    await prisma.scholarship.create({
      data: {
        universityId: swjtu.id,
        title: 'Chinese Government Scholarship (CSC) Type B (Agency 10613)',
        type: 'Full Scholarship',
        details: JSON.stringify([
          '100% full tuition waiver',
          'Free on-campus accommodation',
          'Monthly living stipend: Master CNY 3,000/mo, PhD CNY 3,500/mo',
          'Comprehensive medical insurance (CNY 800/yr)',
        ]),
        amount: 'Full Tuition, Free Accommodation, Monthly Stipend and Health Insurance',
        condition: 'Master applicants under 35, PhD applicants under 40. Apply via admission.swjtu.edu.cn and campuschina.org with Agency No. 10613.',
        eligiblePrograms: JSON.stringify(['English and Chinese taught Master and PhD programs']),
        coverage: 'Full tuition, free dorm, monthly stipend and health insurance',
        deadline: '8 March 2027 (Round 1) / Mid-May 2027 (Round 2)',
        sourceUrl: 'https://admission.swjtu.edu.cn',
        status: 'active',
      },
    });

    // Add fees
    await prisma.fee.createMany({
      data: [
        {
          universityId: swjtu.id,
          item: 'Master Tuition (English Taught)',
          cost: '28,000 CNY/Year',
          notes: 'English-medium postgraduate degree in Engineering & Tech',
          sourceUrl: 'https://en.swjtu.edu.cn',
        },
        {
          universityId: swjtu.id,
          item: 'Doctoral Tuition (English Taught)',
          cost: '35,000 CNY/Year',
          notes: 'English-medium doctoral research degree',
          sourceUrl: 'https://en.swjtu.edu.cn',
        },
        {
          universityId: swjtu.id,
          item: 'On-Campus Accommodation (Double Room)',
          cost: '6,000 CNY/Year',
          notes: 'Air-conditioned double room with private bathroom',
          sourceUrl: 'https://en.swjtu.edu.cn',
        },
      ],
    });
    console.log('✓ Upserted Southwest Jiaotong University (SWJTU).');
  }

  // ==========================================
  // 3. Central South University (CSU) - NEW
  // ==========================================
  let csu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'central-south-university' },
        { slug: 'csu' },
        { name: 'Central South University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!csu) {
    csu = await prisma.university.create({
      data: {
        slug: 'central-south-university',
        name: 'Central South University',
        location: 'Changsha, Hunan, China',
        country: 'China',
        city: 'Changsha',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 13,
        rankingNational: 13,
        rankingWorld: 120,
        majors: 'Mining Engineering, Metallurgical Engineering, Materials Science, Computer Science, Clinical Medicine (Xiangya), Civil Engineering, Business Administration',
        tuition: 'CNY 25,000–45,000 / year (Full CSC Scholarship Available · Agency 10533)',
        tuitionDetails: JSON.stringify([
          'Master Programs (English Taught): CNY 30,000–35,000 / year',
          'Doctoral Programs (English Taught): CNY 40,000–45,000 / year',
          'Clinical Medicine (Xiangya School of Medicine): CNY 40,000 / year',
          'CSC High-Level Postgraduate Program: 100% Tuition Waiver, Free Room, Monthly Stipend (Master CNY 3,000/mo, PhD CNY 3,500/mo) and Insurance',
          'Accommodation: Double room CNY 6,000 / year, Single room CNY 10,000 / year',
        ]),
        documents: JSON.stringify([
          'Valid Passport Bio-data Page',
          'Highest Academic Degree Certificate (notarized)',
          'Official Academic Transcripts (notarized)',
          'Language Proficiency: IELTS 6.0+ / TOEFL 85+ / English MOI, or HSK 4 (>=180 STEM, >=210 Humanities/Medicine)',
          'Two Academic Recommendation Letters by Professors or Associate Professors',
          'Detailed Study Plan / Research Proposal (1,000+ words)',
          'Foreigner Physical Examination Form (valid 6 months)',
          'Certificate of No Criminal Record',
        ]),
        deadlineApplication: '15 February 2027 (CSC Type B) / 29 March 2027 (Youth of Excellence) / 31 May 2027 (Self-Funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Central South University (CSU) is a national Class A Double First-Class and Project 985/211 key university in Changsha, Hunan, ranked #13 in China and Top 150 World by ShanghaiRanking.',
          'Home to the world-renowned Xiangya School of Medicine and world #1 faculties in Mining and Metallurgical Engineering.',
          'CSC Agency Number: 10533. Offers High-Level Postgraduate Program, Youth of Excellence Scheme, and Bilateral Type A options.',
          'Official Admissions Portal: https://intl.csu.edu.cn',
        ]),
        badges: JSON.stringify(['Project 985', 'Double First Class', 'Top 15 China', 'CSC Agency 10533', 'Xiangya Medicine', 'ARWU Top 150']),
        logo: '/images/universities/logos/central-south-university.webp',
        isActive: true,
        officialUrl: 'https://intl.csu.edu.cn',
        aliases: JSON.stringify(['CSU', 'Central South University', '中南大学', 'Zhongnan University']),
        legacySlugs: JSON.stringify(['csu']),
        relationshipType: 'authorized_representative',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education of the PRC',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://intl.csu.edu.cn',
          'https://www.csu.edu.cn',
          'https://www.shanghairanking.com/universities/central-south-university',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;

    // Add programs
    await prisma.program.createMany({
      data: [
        {
          universityId: csu.id,
          name: 'Computer Science and Technology',
          level: 'Master',
          subject: 'Computer Science & AI',
          languages: 'English',
          duration: '3 years',
          intakes: 'September 2027',
          tuition: '32,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '15 February 2027',
          eligibility: JSON.stringify([
            'Bachelor degree in Computer Science or related field',
            'Age under 35',
            'IELTS 6.0+ / TOEFL 85+ / English MOI',
            'Two recommendation letters and study plan',
          ]),
          sourceUrl: 'https://intl.csu.edu.cn',
          status: 'active',
        },
        {
          universityId: csu.id,
          name: 'Materials Science and Engineering',
          level: 'Master',
          subject: 'Materials & Metallurgy',
          languages: 'English',
          duration: '3 years',
          intakes: 'September 2027',
          tuition: '32,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '15 February 2027',
          eligibility: JSON.stringify([
            'Bachelor degree in Materials Science or Chemistry',
            'Age under 35',
            'IELTS 6.0+ / TOEFL 85+ / English MOI',
          ]),
          sourceUrl: 'https://intl.csu.edu.cn',
          status: 'active',
        },
        {
          universityId: csu.id,
          name: 'Mining Engineering',
          level: 'Doctoral',
          subject: 'Mining & Mineral Engineering',
          languages: 'English',
          duration: '4 years',
          intakes: 'September 2027',
          tuition: '42,000 CNY/Year',
          tuitionAfterScholarship: '0 CNY/Year (Full CSC Type B Scholarship)',
          applicationDeadline: '15 February 2027',
          eligibility: JSON.stringify([
            'Master degree in Mining or Geology',
            'Age under 40',
            'IELTS 6.0+ / TOEFL 85+ / English MOI',
            'Research plan and supervisor alignment',
          ]),
          sourceUrl: 'https://intl.csu.edu.cn',
          status: 'active',
        },
      ],
    });

    // Add CSC scholarship
    await prisma.scholarship.create({
      data: {
        universityId: csu.id,
        title: 'Chinese Government Scholarship (CSC) Type B High-Level Program (Agency 10533)',
        type: 'Full Scholarship',
        details: JSON.stringify([
          '100% full tuition waiver',
          'Free on-campus accommodation',
          'Monthly living stipend: Master CNY 3,000/mo, PhD CNY 3,500/mo',
          'Comprehensive medical insurance (CNY 800/yr)',
        ]),
        amount: 'Full Tuition, Free Accommodation, Monthly Stipend and Health Insurance',
        condition: 'Master applicants under 35, PhD applicants under 40. Apply via intl.csu.edu.cn and campuschina.org with Agency No. 10533.',
        eligiblePrograms: JSON.stringify(['English and Chinese taught Master and PhD programs']),
        coverage: 'Full tuition, free dorm, monthly stipend and health insurance',
        deadline: '15 February 2027',
        sourceUrl: 'https://intl.csu.edu.cn',
        status: 'active',
      },
    });

    // Add fees
    await prisma.fee.createMany({
      data: [
        {
          universityId: csu.id,
          item: 'Master Tuition (English Taught)',
          cost: '32,000 CNY/Year',
          notes: 'Standard English-taught engineering and science master degree',
          sourceUrl: 'https://intl.csu.edu.cn',
        },
        {
          universityId: csu.id,
          item: 'Doctoral Tuition (English Taught)',
          cost: '42,000 CNY/Year',
          notes: 'Standard English-taught doctoral research degree',
          sourceUrl: 'https://intl.csu.edu.cn',
        },
        {
          universityId: csu.id,
          item: 'On-Campus Accommodation (Double Room)',
          cost: '6,000 CNY/Year',
          notes: 'Air-conditioned double room with private bath',
          sourceUrl: 'https://intl.csu.edu.cn',
        },
      ],
    });
    console.log('✓ Upserted Central South University (CSU).');
  }

  // ==========================================
  // 4. Update Civil Aviation University of China (CAUC)
  // ==========================================
  const cauc = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'civil-aviation-university-of-china' },
        { slug: 'cauc' },
      ],
    },
    include: { programs: true, fees: true, scholarships: true },
  });

  if (cauc) {
    const existingProgNames = cauc.programs.map((p) => p.name);
    const newDegreePrograms = [
      {
        name: 'Communication Engineering',
        level: 'Bachelor',
        subject: 'Avionics & Communication',
        languages: 'English',
        duration: '4 years',
        intakes: 'September 2027',
        tuition: '15,000 CNY/Year',
        tuitionAfterScholarship: '0–7,500 CNY/Year (Tianjin Municipal / CAUC Scholarship)',
        applicationDeadline: '31 May 2027',
        eligibility: JSON.stringify([
          'High School Diploma (minimum 60% or equivalent)',
          'Age under 30',
          'IELTS 6.0+ / TOEFL 90+ / Duolingo 105+ for direct scholarship priority',
          'English self-introduction video (3 minutes)',
        ]),
        sourceUrl: 'http://cauc.at0086.cn/student',
        status: 'active',
      },
      {
        name: 'Business Administration (Aviation Management)',
        level: 'Bachelor',
        subject: 'Aviation Business & Economics',
        languages: 'English',
        duration: '4 years',
        intakes: 'September 2027',
        tuition: '15,000 CNY/Year',
        tuitionAfterScholarship: '0–7,500 CNY/Year (Tianjin Municipal / CAUC Scholarship)',
        applicationDeadline: '31 May 2027',
        eligibility: JSON.stringify([
          'High School Diploma (minimum 60% or equivalent)',
          'Age under 30',
          'IELTS 6.0+ / TOEFL 90+ / Duolingo 105+',
        ]),
        sourceUrl: 'http://cauc.at0086.cn/student',
        status: 'active',
      },
      {
        name: 'Air Traffic and Transportation',
        level: 'Master',
        subject: 'Air Traffic Management',
        languages: 'English',
        duration: '2 years',
        intakes: 'September 2027',
        tuition: '22,000 CNY/Year',
        tuitionAfterScholarship: '0–11,000 CNY/Year (Tianjin Municipal / CAUC Scholarship)',
        applicationDeadline: '31 May 2027',
        eligibility: JSON.stringify([
          'Bachelor degree in relevant aviation or engineering field',
          'Age under 35',
          'IELTS 6.0+ / TOEFL 90+ / Duolingo 105+',
          'Two recommendation letters from Associate Professors or Professors',
        ]),
        sourceUrl: 'http://cauc.at0086.cn/student',
        status: 'active',
      },
    ];

    for (const prog of newDegreePrograms) {
      if (!existingProgNames.includes(prog.name)) {
        await prisma.program.create({
          data: {
            universityId: cauc.id,
            ...prog,
          },
        });
        changes++;
      }
    }

    // Add degree fee items if missing
    const existingFeeItems = cauc.fees.map((f) => f.item);
    if (!existingFeeItems.includes('Bachelor Degree Tuition (English Taught)')) {
      await prisma.fee.create({
        data: {
          universityId: cauc.id,
          item: 'Bachelor Degree Tuition (English Taught)',
          cost: '15,000 CNY/Year',
          notes: 'English-taught bachelor in Communication Engineering or Business Administration',
          sourceUrl: 'https://www.cauc.edu.cn',
        },
      });
      changes++;
    }
    if (!existingFeeItems.includes('Master Degree Tuition (English Taught)')) {
      await prisma.fee.create({
        data: {
          universityId: cauc.id,
          item: 'Master Degree Tuition (English Taught)',
          cost: '22,000 CNY/Year',
          notes: 'English-taught master in Air Traffic and Transportation or Safety Science',
          sourceUrl: 'https://www.cauc.edu.cn',
        },
      });
      changes++;
    }

    // Add Tianjin Municipal Government Scholarship if missing
    const existingScholTitles = cauc.scholarships.map((s) => s.title);
    if (!existingScholTitles.some((t) => t.includes('Tianjin Municipal'))) {
      await prisma.scholarship.create({
        data: {
          universityId: cauc.id,
          title: 'Tianjin Municipal Government Scholarship (CAUC)',
          type: 'Full / Partial Scholarship',
          details: JSON.stringify([
            'First-Class: Full tuition waiver, on-campus accommodation, and 10 months living stipend (CNY 1,400–1,700/mo)',
            'Second-Class: Full tuition and on-campus accommodation waiver',
            'Applicable to outstanding degree students for their first academic year (renewable annually)',
          ]),
          amount: 'Full Tuition, Accommodation and Living Allowance',
          condition: 'Bachelor applicants under 30, Master applicants under 35. High school / bachelor GPA >= 75%.',
          eligiblePrograms: JSON.stringify(['English and Chinese taught Bachelor and Master programs']),
          coverage: 'Tuition, accommodation and monthly living stipend',
          deadline: '31 May 2027',
          sourceUrl: 'http://cauc.at0086.cn/student',
          status: 'active',
        },
      });
      changes++;
    }
    console.log('✓ Updated Civil Aviation University of China degree programs and scholarships.');
  }

  // ==========================================
  // 5. Update Nanjing University of Science and Technology (NJUST)
  // ==========================================
  const njust = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'nanjing-university-of-science-and-technology' },
        { slug: 'njust' },
      ],
    },
    include: { programs: true, fees: true, scholarships: true },
  });

  if (njust) {
    const existingNjustProgNames = njust.programs.map((p) => p.name);
    const newNjustPrograms = [
      {
        name: 'Computer Science and Technology (Master)',
        level: 'Master',
        subject: 'Computer Science & AI',
        languages: 'English',
        duration: '3 years',
        intakes: 'September 2027',
        tuition: '36,000 CNY/Year',
        tuitionAfterScholarship: '0–18,000 CNY/Year (CSC / Lanshan Scholarship)',
        applicationDeadline: '15 June 2027',
        eligibility: JSON.stringify([
          'Bachelor degree in relevant engineering or science field',
          'Age under 35',
          'IELTS 5.5+ / TOEFL 80+ / Duolingo 90+ / English MOI',
          'Two recommendation letters and study plan (1,000+ words)',
        ]),
        sourceUrl: 'https://njust.17gz.org',
        status: 'active',
      },
      {
        name: 'Materials Science and Engineering (Doctoral)',
        level: 'Doctoral',
        subject: 'Materials Science & Nano Tech',
        languages: 'English',
        duration: '4 years',
        intakes: 'September 2027',
        tuition: '44,200 CNY/Year',
        tuitionAfterScholarship: '0 CNY/Year (CSC High-Level Postgraduate Program)',
        applicationDeadline: '15 June 2027',
        eligibility: JSON.stringify([
          'Master degree in Materials Science, Physics, or Chemistry',
          'Age under 40',
          'IELTS 5.5+ / TOEFL 80+ / Duolingo 90+',
          'Supervisor acceptance letter and research proposal',
        ]),
        sourceUrl: 'https://njust.17gz.org',
        status: 'active',
      },
    ];

    for (const prog of newNjustPrograms) {
      if (!existingNjustProgNames.includes(prog.name)) {
        await prisma.program.create({
          data: {
            universityId: njust.id,
            ...prog,
          },
        });
        changes++;
      }
    }

    const existingNjustFees = njust.fees.map((f) => f.item);
    if (!existingNjustFees.includes('Master Tuition (English Taught)')) {
      await prisma.fee.create({
        data: {
          universityId: njust.id,
          item: 'Master Tuition (English Taught)',
          cost: '36,000 CNY/Year',
          notes: 'English-medium postgraduate degree programs',
          sourceUrl: 'https://study.njust.edu.cn',
        },
      });
      changes++;
    }
    if (!existingNjustFees.includes('Doctoral Tuition (English Taught)')) {
      await prisma.fee.create({
        data: {
          universityId: njust.id,
          item: 'Doctoral Tuition (English Taught)',
          cost: '44,200 CNY/Year',
          notes: 'English-medium doctoral research programs',
          sourceUrl: 'https://study.njust.edu.cn',
        },
      });
      changes++;
    }
    console.log('✓ Updated NJUST postgraduate programs and fees.');
  }

  // ==========================================
  // 6. Zhengzhou University (ZZU) - Upgrade to Master & PhD + CSC Type B, Henan Govt, President Scholarships
  // ==========================================
  const zzu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'zzu' },
        { slug: 'zhengzhou-university' },
        { name: 'Zhengzhou University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (zzu) {
    await prisma.university.update({
      where: { id: zzu.id },
      data: {
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 44,
        rankingWorld: 169,
        rankingNational: 44,
        badges: JSON.stringify([
          'Double First-Class',
          'Project 211',
          'Nature Index: #70',
          'CWTS Leiden: #25',
          'ARWU: #169',
          'U.S. News: #203',
          'QS: #511',
          'CSC Agency: 10459',
          'President Scholarship (Full PhD)',
          'Henan Govt Scholarship',
          'MBBS & Postgrad',
        ]),
        documents: JSON.stringify([
          'Passport (18+ months validity)',
          'White Background Photo',
          'Degree Certificate or Official Pre-Graduation Letter',
          'Academic Transcripts (English/Chinese translated)',
          'Supervisor Acceptance Letter (Official ZZU Template)',
          'Two Academic Recommendation Letters (Associate Professor or higher)',
          'Research Proposal (Min 3,000 words for PhD with Supervisor Signature) or Study Plan',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Non-Criminal Record Certificate (Police Clearance valid within 6 months)',
          'Language Proficiency Certificate (IELTS/TOEFL/Duolingo or HSK)',
        ]),
        notes: JSON.stringify([
          'Chinese Government Scholarship (CSC Type B): Agency No. 10459 · 50 Seats · Deadline 28 February 2027.',
          'President Scholarship of Zhengzhou University: Full Scholarship for PhD (~100 seats/year) · Dual-track CSC guarantee.',
          'Henan Provincial Government Scholarship: Up to CNY 30,000/yr tuition award for Master scholars.',
          'Dual Online Application Required: zzu.17gz.org & campuschina.org before deadlines.',
          'Mandatory Supervisor Acceptance Letter required before formal application.',
        ]),
        sourceUrls: JSON.stringify([
          'https://international.zzu.edu.cn',
          'https://zzu.17gz.org',
          'https://www.campuschina.org',
          'https://zzu.17gz.org/html/article_content/202611/102B7B407D524940970B664331A5870E.shtml',
        ]),
      },
    });
    changes++;

    // Add ZZU Scholarships
    const existingScholarships = zzu.scholarships.map((s) => s.title);
    if (!existingScholarships.includes('Chinese Government Scholarship (CSC Type B - High-Level Postgraduate)')) {
      await prisma.scholarship.create({
        data: {
          universityId: zzu.id,
          title: 'Chinese Government Scholarship (CSC Type B - High-Level Postgraduate)',
          type: 'Government',
          details: JSON.stringify([
            '100% full tuition waiver across program duration',
            'Free on-campus accommodation in university dormitory',
            'Monthly living allowance: Master CNY 3,000/mo, PhD CNY 3,500/mo',
            'Comprehensive Medical Insurance (CNY 800/yr)',
            'Agency No. 10459 with 50 designated candidate seats',
          ]),
          amount:
            'Full Scholarship: 100% Tuition + Free Campus Dorm + Monthly Living Allowance (Master CNY 3,000/mo, PhD CNY 3,500/mo) + Comprehensive Medical Insurance',
          condition:
            'Agency No. 10459. Excellent academic merit (GPA 3.2+/4.0 or 80%+), supervisor acceptance letter, age under 35 (Master) or under 40 (PhD).',
          eligiblePrograms: JSON.stringify([
            'Master Programs',
            'Doctoral Programs',
            'Chemistry',
            'Materials Science & Engineering',
            'Clinical Medicine',
            'Computer Science & Technology',
            'Environmental & Chemical Engineering',
          ]),
          coverage: 'Full scholarship covering tuition, accommodation, living allowance, and medical insurance',
          deadline: '28 February 2027',
          sourceUrl: 'https://zzu.17gz.org',
          status: 'active',
        },
      });
      changes++;
    }

    if (!existingScholarships.includes('President Scholarship of Zhengzhou University (PhD Full Award)')) {
      await prisma.scholarship.create({
        data: {
          universityId: zzu.id,
          title: 'President Scholarship of Zhengzhou University (PhD Full Award)',
          type: 'University',
          details: JSON.stringify([
            'Full scholarship covering 100% doctoral tuition waiver',
            'Free on-campus accommodation in doctoral dormitory',
            'Monthly doctoral living allowance',
            'Dual-track backup guarantee with CSC Type B (~100 seats/year)',
          ]),
          amount: 'Full Scholarship: 100% Tuition Waiver + Free On-Campus Accommodation + Monthly Living Allowance',
          condition:
            'Doctoral degree applicants with strong research background, supervisor acceptance letter, signed 3,000+ word research proposal. Dual-track guarantee with CSC Type B (~100 seats/year).',
          eligiblePrograms: JSON.stringify([
            'Doctoral Programs',
            'PhD in Chemistry',
            'PhD in Materials Science',
            'PhD in Clinical Medicine',
            'PhD in Engineering',
          ]),
          coverage: 'Full tuition waiver, campus dorm, and monthly doctoral living allowance',
          deadline: 'Round 1: 28 February 2027; Round 2: 31 May 2027',
          sourceUrl: 'https://zzu.17gz.org',
          status: 'active',
        },
      });
      changes++;
    }

    if (!existingScholarships.includes('Henan Provincial Government Scholarship (Master Program)')) {
      await prisma.scholarship.create({
        data: {
          universityId: zzu.id,
          title: 'Henan Provincial Government Scholarship (Master Program)',
          type: 'Provincial',
          details: JSON.stringify([
            'Tuition award covering up to CNY 30,000/year for Master programs',
            'Two evaluation rounds (Round 1: 28 Feb 2027, Round 2: 31 May 2027)',
            'Automatic fallback award for admitted Round 1 CSC Type B applicants',
          ]),
          amount: 'Tuition award up to CNY 30,000/year',
          condition:
            'Master degree applicants with bachelor degree, good academic standing, supervisor acceptance letter. Dual-track evaluation alongside CSC Type B.',
          eligiblePrograms: JSON.stringify(['Master Programs', 'Postgraduate Degrees']),
          coverage: 'Tuition fee coverage up to CNY 30,000/year',
          deadline: 'Round 1: 28 February 2027; Round 2: 31 May 2027',
          sourceUrl: 'https://zzu.17gz.org',
          status: 'active',
        },
      });
      changes++;
    }

    // Add ZZU Master & PhD Programs
    const existingProgNames = zzu.programs.map((p) => p.name);
    const newZzuPrograms = [
      {
        level: 'Master',
        name: 'Master in Chemistry & Chemical Engineering',
        subject: 'Chemistry & Chemical Engineering',
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 28,000 / year',
        tuitionAfterScholarship: 'CNY 0 / year (Full CSC or Henan Govt Scholarship)',
        applicationDeadline: '28 February 2027 (CSC Type B) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'Bachelor degree in Chemistry, Chemical Engineering or related science field',
          'GPA 3.0+/4.0 or 75%+',
          'Age under 35',
          'IELTS 6.0+ / TOEFL 80+ or HSK 5 (180+)',
          'Supervisor acceptance letter',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Master in Materials Science & Engineering',
        subject: 'Materials Science & Engineering',
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 28,000 / year',
        tuitionAfterScholarship: 'CNY 0 / year (Full CSC or Henan Govt Scholarship)',
        applicationDeadline: '28 February 2027 (CSC Type B) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'Bachelor degree in Materials Science, Physics, Chemistry, or Engineering',
          'GPA 3.0+/4.0 or 75%+',
          'Age under 35',
          'IELTS 6.0+ / TOEFL 80+ or HSK 5 (180+)',
          'Supervisor acceptance letter',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Master in Clinical Medicine & Health Sciences',
        subject: 'Clinical Medicine & Health Sciences',
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 35,000 / year',
        tuitionAfterScholarship: 'CNY 5,000 / year (Henan Govt) or CNY 0 (CSC Type B)',
        applicationDeadline: '28 February 2027 (CSC Type B) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'MBBS or Bachelor degree in Medicine / Health Sciences',
          'GPA 3.2+/4.0 or 80%+',
          'Age under 35',
          'IELTS 6.5+ / TOEFL 85+ or HSK 5 (210+)',
          'Supervisor acceptance letter',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
      {
        level: 'Master',
        name: 'Master in Computer Science & Technology (AI / Data Science)',
        subject: 'Computer Science & Technology',
        languages: 'English, Chinese',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 28,000 / year',
        tuitionAfterScholarship: 'CNY 0 / year (Full CSC or Henan Govt Scholarship)',
        applicationDeadline: '28 February 2027 (CSC Type B) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'Bachelor degree in Computer Science, Software Engineering, IT or Mathematics',
          'GPA 3.0+/4.0 or 75%+',
          'Age under 35',
          'IELTS 6.0+ / TOEFL 80+ or HSK 5 (180+)',
          'Supervisor acceptance letter',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
      {
        level: 'Doctoral',
        name: 'PhD in Chemistry, Materials Science & Advanced Engineering',
        subject: 'Chemistry, Materials Science & Engineering',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 34,000 / year',
        tuitionAfterScholarship: 'CNY 0 / year (Fully Funded via President Award / CSC Type B + Monthly Stipend)',
        applicationDeadline: '28 February 2027 (Round 1) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'Master degree in relevant discipline',
          'Age under 40',
          'Strong research track record (publications preferred)',
          'Supervisor acceptance letter',
          'Detailed research proposal (minimum 3,000 words signed by supervisor)',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
      {
        level: 'Doctoral',
        name: 'PhD in Clinical Medicine & Biomedical Sciences',
        subject: 'Clinical Medicine & Biomedical Sciences',
        languages: 'English, Chinese',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 40,000 / year',
        tuitionAfterScholarship: 'CNY 0 / year (Fully Funded via President Award / CSC Type B + Monthly Stipend)',
        applicationDeadline: '28 February 2027 (Round 1) / 31 May 2027 (Round 2)',
        eligibility: JSON.stringify([
          'Master degree in Medicine or Life Sciences',
          'Age under 40',
          'Supervisor acceptance letter',
          'Detailed research proposal (minimum 3,000 words signed by supervisor)',
        ]),
        sourceUrl: 'https://zzu.17gz.org',
        status: 'active',
      },
    ];

    for (const prog of newZzuPrograms) {
      if (!existingProgNames.includes(prog.name)) {
        await prisma.program.create({
          data: {
            universityId: zzu.id,
            ...prog,
          },
        });
        changes++;
      }
    }

    // Add ZZU Fees
    const existingFeeItems = zzu.fees.map((f) => f.item);
    if (!existingFeeItems.includes('Postgraduate Master Tuition (Science & Engineering)')) {
      await prisma.fee.create({
        data: {
          universityId: zzu.id,
          item: 'Postgraduate Master Tuition (Science & Engineering)',
          cost: '28,000 CNY/Year',
          notes: 'Master degree programs in science, technology and engineering',
          sourceUrl: 'https://international.zzu.edu.cn',
        },
      });
      changes++;
    }
    if (!existingFeeItems.includes('Postgraduate Doctoral Tuition (Science & Engineering)')) {
      await prisma.fee.create({
        data: {
          universityId: zzu.id,
          item: 'Postgraduate Doctoral Tuition (Science & Engineering)',
          cost: '34,000 CNY/Year',
          notes: 'PhD research programs (fully waived for President / CSC scholarship holders)',
          sourceUrl: 'https://international.zzu.edu.cn',
        },
      });
      changes++;
    }

    console.log(
      '✓ Updated Zhengzhou University (ZZU) with Master/PhD programs, CSC Type B, Henan Govt, and President Scholarships.'
    );
  }

  // ==========================================
  // 7. Beijing Technology and Business University (BTBU) - NEW
  // ==========================================
  let btbu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'beijing-technology-and-business-university' },
        { slug: 'btbu' },
        { name: 'Beijing Technology and Business University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!btbu) {
    btbu = await prisma.university.create({
      data: {
        slug: 'beijing-technology-and-business-university',
        name: 'Beijing Technology and Business University',
        location: 'Beijing, China',
        country: 'China',
        city: 'Beijing',
        intake: 'September',
        degree: 'Bachelor, Master, PhD',
        taught: 'English, Chinese',
        rankingCountry: 178,
        rankingWorld: 750,
        rankingNational: 178,
        majors:
          'Accounting, Computer Science & Technology, Cosmetic Technology & Engineering, Artificial Intelligence, Software Engineering, International Economics & Trade',
        tuition: 'CNY 20,000 – 27,000 / year',
        tuitionDetails: '[]',
        documents: JSON.stringify([
          'Passport Photo Page (including Chinese visa pages if applicable)',
          'White Background Passport Photo',
          'Notarized High School Diploma in Chinese or English',
          'Notarized High School Academic Transcripts',
          'China Scholastic Competency Assessment (CSCA) Score Report',
          'Proof of Chinese or English Language Proficiency',
          'Personal Statement / Study Plan (min 800 words)',
          'Foreigner Physical Examination Form (valid within 6 months)',
          'Certificate of No Criminal Record (Police Clearance valid within 6 months)',
          'Scholarship Application Form (for Beijing Government Scholarship)',
          'Proof of Financial Support',
          'Artworks Portfolio (min 2 pieces for School of Design and Art applicants)',
        ]),
        deadlineApplication: '1 June 2027',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'Mandatory CSCA exam required for all undergraduate applicants (submit score before interview).',
          'Accounting offered 100% in English (CSCA requirement: Mathematics only).',
          'Beijing Municipal Government Scholarship: Category A (Full), Category B (Partial), Category C (Tuition).',
          'Online application via btbu.17gz.org before 1 June 2027.',
          'Application Fee: CNY 420.00 (non-refundable).',
        ]),
        badges: JSON.stringify([
          'Beijing Municipal Key University',
          '9 ESI Top 1% Disciplines',
          'Double First-Class Candidate',
          'English Accounting Bachelor',
          'Beijing Government Scholarship',
          'Liangxiang Campus',
        ]),
        logo: '/images/universities/logos/beijing-technology-and-business-university.webp',
        isActive: true,
        officialUrl: 'http://www.btbu.edu.cn',
        aliases: JSON.stringify([
          'BTBU',
          'Beijing Technology and Business University (BTBU)',
          '北京工商大学',
        ]),
        legacySlugs: '[]',
        relationshipType: 'unverified',
        recognitionAuthority: 'Ministry of Education (MoE) PR China · Beijing Municipal Education Commission',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'http://www.btbu.edu.cn',
          'http://btbu.17gz.org',
          'https://english.beijing.gov.cn/studyinginbeijing/index.html',
          'https://mp.weixin.qq.com/s/mxAjrnCH8SX6xrf0MkAPGw',
        ]),
        verificationStatus: 'verified',
      },
    });
    changes++;

    // Add Programs
    await prisma.program.createMany({
      data: [
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in Accounting (English Medium)',
          subject: 'Accounting & Finance',
          languages: 'English',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 20,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'IELTS >= 5.5 or TOEFL >= 80 (native English speakers exempt)',
            'CSCA Test Subject: Mathematics only',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in Computer Science and Technology',
          subject: 'Computer Science and Technology',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 23,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'HSK Level 5 (180+)',
            'CSCA Test Subjects: Chinese (STEM) + Mathematics + Physics',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in Artificial Intelligence (Engineering)',
          subject: 'Artificial Intelligence',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 23,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'HSK Level 5 (180+)',
            'CSCA Test Subjects: Chinese (STEM) + Mathematics + Physics',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in Cosmetic Technology and Engineering',
          subject: 'Cosmetic Technology & Light Industry',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 23,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'HSK Level 5 (180+)',
            'CSCA Test Subjects: Chinese (STEM) + Mathematics + Chemistry',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in International Economics and Trade',
          subject: 'International Economics and Trade',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 20,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'HSK Level 5 (180+)',
            'CSCA Test Subjects: Chinese (Humanities) + Mathematics',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
        {
          universityId: btbu.id,
          level: 'Bachelor',
          name: 'Bachelor in Software Engineering',
          subject: 'Software Engineering',
          languages: 'Chinese',
          duration: '4 years',
          intakes: 'September',
          tuition: 'CNY 23,000 / year',
          tuitionAfterScholarship: 'CNY 0 / year (Beijing Govt Scholarship Category A/B/C)',
          applicationDeadline: '1 June 2027',
          eligibility: JSON.stringify([
            'High school diploma or equivalent',
            'Age 18–25',
            'HSK Level 5 (180+)',
            'CSCA Test Subjects: Chinese (STEM) + Mathematics + Physics',
          ]),
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
        },
      ],
    });
    changes += 6;

    // Add Scholarships
    await prisma.scholarship.createMany({
      data: [
        {
          universityId: btbu.id,
          title: 'Beijing Municipal Government Scholarship (Category A - Full Scholarship)',
          type: 'Government',
          amount:
            'Full Scholarship: 100% Tuition Waiver + Free Campus Twin Dormitory + Monthly Living Allowance + Comprehensive Medical Insurance',
          condition:
            'Merit-based admission score, high school GPA 80%+, CSCA score report, and video interview score.',
          eligiblePrograms: JSON.stringify(['All Undergraduate Programs', 'Accounting (English)']),
          coverage:
            '100% tuition waiver, on-campus twin room housing, monthly living allowance, and comprehensive insurance',
          deadline: '1 June 2027',
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
          details: JSON.stringify([
            '100% full tuition waiver across 4 years',
            'Free on-campus twin room accommodation at Liangxiang West Campus',
            'Monthly undergraduate living allowance',
            'Comprehensive medical insurance (CNY 800/yr)',
          ]),
        },
        {
          universityId: btbu.id,
          title: 'Beijing Municipal Government Scholarship (Category B - Partial Scholarship)',
          type: 'Government',
          amount: '100% Tuition Waiver + Free Campus Twin Dormitory + Comprehensive Medical Insurance',
          condition:
            'Merit-based admission score, high school GPA 75%+, CSCA score report, and interview score.',
          eligiblePrograms: JSON.stringify(['All Undergraduate Programs']),
          coverage: 'Tuition waiver, twin dormitory housing, and health insurance',
          deadline: '1 June 2027',
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
          details: JSON.stringify([
            '100% full tuition waiver',
            'Free on-campus twin room housing at Liangxiang West Campus',
            'Comprehensive medical insurance (CNY 800/yr)',
          ]),
        },
        {
          universityId: btbu.id,
          title: 'Beijing Municipal Government Scholarship (Category C - Tuition Award)',
          type: 'Government',
          amount: '100% Tuition Waiver + Comprehensive Medical Insurance',
          condition: 'Merit-based admission score, high school GPA 70%+, CSCA score report.',
          eligiblePrograms: JSON.stringify(['All Undergraduate Programs']),
          coverage: '100% annual tuition fee waiver and medical insurance',
          deadline: '1 June 2027',
          sourceUrl: 'http://btbu.17gz.org',
          status: 'active',
          details: JSON.stringify([
            '100% annual tuition waiver',
            'Comprehensive medical insurance (CNY 800/yr)',
          ]),
        },
      ],
    });
    changes += 3;

    // Add Fees
    await prisma.fee.createMany({
      data: [
        {
          universityId: btbu.id,
          item: 'Application Fee',
          cost: '420 CNY (Non-refundable)',
          notes: 'Payable online via application portal',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'Tuition Fee (Category I - Economics, Management, Law)',
          cost: '20,000 CNY/Year',
          notes: 'Undergraduate programs in economics, business, management, law and humanities',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'Tuition Fee (Category II - Science, Engineering, Agriculture)',
          cost: '23,000 CNY/Year',
          notes: 'Undergraduate programs in STEM, computer science, AI, cosmetic tech, materials',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'Tuition Fee (Category III - Arts & Design)',
          cost: '27,000 CNY/Year',
          notes: 'Undergraduate programs in design, media art and visual arts',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'On-Campus Accommodation (Liangxiang Campus Twin Room)',
          cost: '40 CNY/Day (~14,600 CNY/Year)',
          notes: 'Twin room with private bathroom, air conditioning and internet',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'Comprehensive Medical Insurance Fee',
          cost: '800 CNY/Year',
          notes: 'Mandatory international student comprehensive health insurance',
          sourceUrl: 'http://btbu.17gz.org',
        },
        {
          universityId: btbu.id,
          item: 'Residence Permit Fee',
          cost: '400 CNY/Year',
          notes: 'Collected by Beijing Municipal Public Security Bureau Exit-Entry Administration',
          sourceUrl: 'http://btbu.17gz.org',
        },
      ],
    });
    changes += 7;

    console.log('✓ Upserted Beijing Technology and Business University (BTBU) with programs, scholarships, and fees.');
  }

  return changes;
}

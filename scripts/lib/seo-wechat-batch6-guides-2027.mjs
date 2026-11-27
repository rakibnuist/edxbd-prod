// 5 WeChat Batch 6 Guides & University Upserts (2027 Admissions)
// Strict zero-competitor, global international audience, rich SEO & LLM support

import { WECHAT_BATCH6_5_GUIDES_DATA } from '../../src/data/newWechatBatch6Guides2027.ts';

export const WECHAT_BATCH6_5_GUIDE_SPECS = Object.values(WECHAT_BATCH6_5_GUIDES_DATA).map((guide) => ({
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

export async function upsertWechatBatch6Universities(prisma) {
  let changes = 0;

  // 1. SIAT (Shenzhen Institute of Advanced Technology, CAS)
  let siat = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'siat' },
        { slug: 'shenzhen-institute-of-advanced-technology' },
      ],
    },
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
    majors: 'Chemistry, Biology, Control Science & Intelligent Systems, Computer Applied Technology, Optical Engineering, Biomedical Engineering',
    tuition: 'Master: CNY 30,000 / year; PhD: CNY 40,000 / year (100% Waived with Scholarship)',
    tuitionDetails: JSON.stringify([
      'Master Programs: CNY 30,000 / year (100% Free on CSC/ANSO/UCAS scholarship)',
      'Doctoral Programs: CNY 40,000 / year (100% Free on CSC/ANSO/UCAS scholarship)',
      'SIAT Campus Accommodation: CNY 500 / person / month (double/triple with private bath)',
    ]),
    documents: JSON.stringify([
      'Valid Foreign Passport (min 1 year validity)',
      'Digital White Background Photograph',
      'Highest Diploma / Degree Certificate (Notarized)',
      'Official Academic Transcripts',
      'Curriculum Vitae (CV) & Detailed Research Proposal',
      'Two Letters of Recommendation from Professors',
      'SIAT Supervisor Provisional Acceptance Form',
      'Foreigner Physical Examination Form',
      'Certificate of Non-Criminal Record',
      'English Language Proficiency Certificate or HSK 5 (180+)',
    ]),
    deadlineApplication: 'Scholarship: February 28, 2027; Self-funded: April 15, 2027',
    deadlineStartDate: 'September 2027',
    notes: JSON.stringify([
      'Degrees officially conferred by the University of Chinese Academy of Sciences (UCAS).',
      'Undergraduate GPA minimum 3.0/4.0 or 80/100 required.',
      'Generous monthly stipends up to CNY 7,000/month for PhDs on CAS-ANSO & SIAT lab top-up.',
    ]),
    badges: JSON.stringify(['Double First Class / CAS Elite Institute', 'Full CSC & ANSO Fellowships', 'UCAS Degree Conferral']),
    logo: '/images/universities/logos/siat.webp',
    isActive: true,
    officialUrl: 'https://www.siat.ac.cn',
    aliases: JSON.stringify(['SIAT', 'Shenzhen Institute of Advanced Technology', '中国科学院深圳先进技术研究院', 'CAS SIAT']),
    legacySlugs: JSON.stringify(['shenzhen-institute-of-advanced-technology']),
    relationshipType: 'public_direct_application',
    verificationStatus: 'verified',
    recognitionAuthority: 'Ministry of Education (MoE), PR China & Chinese Academy of Sciences',
    recognitionSourceUrl: 'http://www.moe.gov.cn/',
    sourceUrls: JSON.stringify(['https://www.siat.ac.cn', 'https://english.siat.ac.cn', 'https://is.ucas.ac.cn']),
  };

  if (!siat) {
    siat = await prisma.university.create({ data: siatData });
    changes++;
    console.log('✓ Created SIAT');
  } else {
    await prisma.university.update({ where: { id: siat.id }, data: siatData });
    changes++;
    console.log('✓ Updated SIAT');
  }

  // 2. JSNU
  await prisma.university.update({
    where: { slug: 'jsnu' },
    data: {
      cscAgencyNumber: '10320',
      isCscDesignated: true,
      aliases: JSON.stringify(['JSNU', 'Jiangsu Normal University', '江苏师范大学', 'JSU Xuzhou']),
      legacySlugs: JSON.stringify(['jiangsu-normal-university']),
    },
  });
  changes++;

  // 3. NEFU
  const nefu = await prisma.university.findUnique({ where: { slug: 'northeast-forestry-university' } });
  if (nefu) {
    await prisma.university.update({
      where: { id: nefu.id },
      data: {
        cscAgencyNumber: '10225',
        isCscDesignated: true,
        aliases: JSON.stringify(['NEFU', 'Northeast Forestry University', '东北林业大学']),
        legacySlugs: JSON.stringify(['nefu']),
      },
    });
    changes++;
  }

  // 4. XSYU
  const xsyu = await prisma.university.findUnique({ where: { slug: 'xsyu' } });
  if (xsyu) {
    await prisma.university.update({
      where: { id: xsyu.id },
      data: {
        cscAgencyNumber: '10705',
        isCscDesignated: true,
        legacySlugs: JSON.stringify(['xian-shiyou-university']),
      },
    });
    changes++;
  }

  // 5. NMU
  const nmu = await prisma.university.findUnique({ where: { slug: 'nanjing-medical-university' } });
  if (nmu) {
    await prisma.university.update({
      where: { id: nmu.id },
      data: {
        isMoeMbbsListed: true,
        legacySlugs: JSON.stringify(['nmu']),
        aliases: JSON.stringify(['NMU', 'Nanjing Medical University', '南京医科大学']),
      },
    });
    changes++;
  }

  return changes;
}

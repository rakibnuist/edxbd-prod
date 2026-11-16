// Shenyang City University (SYCU) 2027 Admissions Guide & University Upsert
// Data accurately sourced from official brochure: 沈阳城市学院 2027 年春季留学生招生简章
// Strict zero-competitor, universal global audience, high SEO & LLM support

import { SHENYANG_CITY_UNIVERSITY_GUIDE_DATA } from '../../src/data/shenyangCityUniversityGuide2027.ts';

export const SHENYANG_CITY_UNIVERSITY_GUIDE_SPECS = [
  {
    slug: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.slug,
    title: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.title,
    metaTitle: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.metaTitle,
    metaDescription: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.metaDescription,
    excerpt: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.excerpt,
    category: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.category,
    categories: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.categories,
    tags: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.tags,
    author: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.author,
    reviewer: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.reviewer,
    featuredImage: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.featuredImage,
    sourceUrls: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.sourceUrls,
    deadlineAt: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.deadlineAt,
    content: SHENYANG_CITY_UNIVERSITY_GUIDE_DATA.content,
  },
];

export async function upsertShenyangCityUniversity(prisma) {
  let changes = 0;

  let sycu = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'shenyang-city-university' },
        { slug: 'sycu' },
        { name: 'Shenyang City University' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!sycu) {
    sycu = await prisma.university.create({
      data: {
        slug: 'shenyang-city-university',
        name: 'Shenyang City University',
        location: 'Shenyang, Liaoning, China',
        country: 'China',
        city: 'Shenyang',
        intake: 'March, September',
        degree: 'Bachelor, Non-Degree',
        taught: 'Chinese, English',
        rankingCountry: 450,
        rankingWorld: 1800,
        rankingNational: 6,
        majors: 'Business Administration, Computer Science and Technology, Artificial Intelligence, Civil Engineering, Chinese Language',
        tuition: 'CNY 12,000 / year (After CNY 10,000 University Scholarship; Original CNY 22,000)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs (March 4.5-Year & Sept 4-Year): CNY 22,000 / year (Net CNY 12,000 / year after CNY 10,000 scholarship)',
          '0.5-Year Chinese Language Foundation: CNY 8,000 (Net CNY 5,000 after CNY 3,000 scholarship)',
          '1-Year Chinese Language Program: CNY 16,000 / year (Net CNY 10,000 / year after CNY 6,000 scholarship)',
          'Accommodation: CNY 3,500–5,000 / year (4-bed dorm CNY 3,500, Standard double CNY 5,000; all with private bathroom)',
          'Registration Advance: March 4.5-year undergraduates pay first 1.5 years fees upon on-campus registration',
        ]),
        documents: JSON.stringify([
          'Valid International Passport Scan (all pages, 18+ months valid)',
          'High School Graduation Diploma (original, English translation, notarized)',
          'Complete High School Academic Transcripts (with English translation)',
          'Foreigner Physical Examination Form (within 6 months)',
          'Certificate of Non-Criminal Record (Police Clearance within 6 months)',
          'Family Financial Statement (Proof of solvency within 6 months)',
          '2-Minute English Self-Introduction Video (family background, study goals)',
          'Certificate of Completion in China (for applicants with prior Chinese study)',
          'Guardian Authorization and Undertaking (for applicants under 18)',
        ]),
        deadlineApplication: '25 December 2026 (March 2027 Intake) / 30 June 2027 (September 2027 Intake)',
        deadlineStartDate: 'March 2027 / September 2027',
        notes: JSON.stringify([
          'Innovative applied university in Shenyang, Liaoning, cultivating global applied talents',
          'Dual Intake Models: 4.5-Year track for March intake (0.5-yr Chinese foundation + 4-yr Bachelor); 4-Year direct degree for September intake',
          'Four Key Flagship Majors (Bilingual CN/EN): Business Administration, Computer Science & Technology, Artificial Intelligence, Civil Engineering',
          'Guaranteed Institutional Scholarship: CNY 10,000 / year for Bachelor students, reducing tuition to CNY 12,000 / year',
          'Official Admissions Portal: www.shenyangcu.edu.cn | Email: 18602440858@163.com | Phone: 024-89597619',
        ]),
        badges: JSON.stringify(['March Intake (0.5+4)', 'September Intake (4-Yr)', 'CNY 10,000 Scholarship', 'Private Bathroom Dorms', 'Applied Technology']),
        logo: '/images/universities/logos/shenyang-city-university.webp',
        isActive: true,
        officialUrl: 'https://www.shenyangcu.edu.cn',
        aliases: JSON.stringify(['SYCU', 'Shenyang City University', '沈阳城市学院']),
        legacySlugs: JSON.stringify(['sycu']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Liaoning Provincial Department of Education & Ministry of Education',
        recognitionSourceUrl: 'https://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://www.shenyangcu.edu.cn',
          'https://eduexpressint.com/universities/shenyang-city-university',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });
    changes++;
    console.log(`Created new university: Shenyang City University (ID: ${sycu.id})`);
  }

  // Upsert Programs
  const sycuPrograms = [
    {
      name: 'Business Administration (工商管理)',
      level: 'Bachelor',
      subject: 'Management & International Trade',
      languages: 'Chinese, English',
      duration: '4.5 Years (March: 0.5+4) / 4 Years (Sept)',
      intakes: 'March, September',
      tuition: '22,000 CNY/Year',
      tuitionAfterScholarship: '12,000 CNY/Year',
      applicationDeadline: '25 December 2026 (March Intake) / 30 June 2027 (Sept Intake)',
      eligibility: JSON.stringify([
        'High school diploma with passing grades (GPA >= 60%)',
        'Age 18-30 (under 18 requires notarized guardianship in China)',
        'Pass HSK 4 and thesis defense before bachelor graduation',
        'Valid passport, clean criminal background, and foreign physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
    {
      name: 'Computer Science and Technology (计算机科学与技术)',
      level: 'Bachelor',
      subject: 'Engineering & Computer Science',
      languages: 'Chinese, English',
      duration: '4.5 Years (March: 0.5+4) / 4 Years (Sept)',
      intakes: 'March, September',
      tuition: '22,000 CNY/Year',
      tuitionAfterScholarship: '12,000 CNY/Year',
      applicationDeadline: '25 December 2026 (March Intake) / 30 June 2027 (Sept Intake)',
      eligibility: JSON.stringify([
        'High school diploma with Mathematics & Science background',
        'Age 18-30 (under 18 requires notarized guardianship in China)',
        'Pass HSK 4 and thesis defense before bachelor graduation',
        'Valid passport, clean criminal background, and foreign physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
    {
      name: 'Artificial Intelligence (人工智能)',
      level: 'Bachelor',
      subject: 'Engineering & Intelligent Systems',
      languages: 'Chinese, English',
      duration: '4.5 Years (March: 0.5+4) / 4 Years (Sept)',
      intakes: 'March, September',
      tuition: '22,000 CNY/Year',
      tuitionAfterScholarship: '12,000 CNY/Year',
      applicationDeadline: '25 December 2026 (March Intake) / 30 June 2027 (Sept Intake)',
      eligibility: JSON.stringify([
        'High school diploma with strong Mathematics background',
        'Age 18-30 (under 18 requires notarized guardianship in China)',
        'Pass HSK 4 and thesis defense before bachelor graduation',
        'Valid passport, clean criminal background, and foreign physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
    {
      name: 'Civil Engineering (土木工程)',
      level: 'Bachelor',
      subject: 'Engineering & Infrastructure',
      languages: 'Chinese, English',
      duration: '4.5 Years (March: 0.5+4) / 4 Years (Sept)',
      intakes: 'March, September',
      tuition: '22,000 CNY/Year',
      tuitionAfterScholarship: '12,000 CNY/Year',
      applicationDeadline: '25 December 2026 (March Intake) / 30 June 2027 (Sept Intake)',
      eligibility: JSON.stringify([
        'High school diploma with Physics & Mathematics background',
        'Age 18-30 (under 18 requires notarized guardianship in China)',
        'Pass HSK 4 and thesis defense before bachelor graduation',
        'Valid passport, clean criminal background, and foreign physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
    {
      name: 'Chinese Language Foundation Program (0.5-Year)',
      level: 'Language',
      subject: 'Chinese Language & Culture',
      languages: 'Chinese, English',
      duration: '0.5 Year (1 Semester)',
      intakes: 'March',
      tuition: '8,000 CNY/0.5 Year',
      tuitionAfterScholarship: '5,000 CNY/0.5 Year',
      applicationDeadline: '25 December 2026',
      eligibility: JSON.stringify([
        'High school diploma or equivalent qualification',
        'Age 18-30',
        'Zero-beginner friendly Chinese foundation course',
        'Valid international passport and physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
    {
      name: 'Chinese Language Program (1-Year Zero-Beginner)',
      level: 'Language',
      subject: 'Chinese Language & Culture',
      languages: 'Chinese, English',
      duration: '1 Year (2 Semesters)',
      intakes: 'March, September',
      tuition: '16,000 CNY/Year',
      tuitionAfterScholarship: '10,000 CNY/Year',
      applicationDeadline: '25 December 2026 (March) / 30 June 2027 (Sept)',
      eligibility: JSON.stringify([
        'High school diploma or equivalent qualification',
        'Age 18-30',
        'Comprehensive 1-year language immersion program',
        'Valid international passport and physical examination form',
      ]),
      sourceUrl: 'https://www.shenyangcu.edu.cn',
    },
  ];

  const existingProgKeys = new Set(
    (sycu.programs || []).map((p) => `${p.level.trim().toLowerCase()}::${p.name.trim().toLowerCase()}`),
  );

  for (const prog of sycuPrograms) {
    const key = `${prog.level.toLowerCase()}::${prog.name.toLowerCase()}`;
    if (!existingProgKeys.has(key)) {
      await prisma.program.create({
        data: {
          universityId: sycu.id,
          ...prog,
          status: 'active',
        },
      });
      changes++;
    }
  }

  // Upsert Scholarships
  const existingScholarships = new Set((sycu.scholarships || []).map((s) => s.title.trim().toLowerCase()));

  if (!existingScholarships.has('shenyang city university international student scholarship (undergraduate)')) {
    await prisma.scholarship.create({
      data: {
        universityId: sycu.id,
        title: 'Shenyang City University International Student Scholarship (Undergraduate)',
        type: 'Partial (Tuition Reduction)',
        details: JSON.stringify([
          'Annual tuition reduction of CNY 10,000/year for all 4 bachelor degree majors',
          'Net tuition payable: CNY 12,000 / year (approx $1,650 USD)',
          'Available for both March (4.5-Year: 0.5+4) and September (4-Year) intakes',
          'Guaranteed upon admission meeting standard academic requirements',
        ]),
        amount: 'CNY 10,000 / year Tuition Waiver (Net Tuition: CNY 12,000 / year)',
        condition: 'High school graduate, age 18-30, clean criminal record, good physical health. Maintain passing academic standing and HSK 4 progression.',
        eligiblePrograms: JSON.stringify([
          'Business Administration (工商管理)',
          'Computer Science and Technology (计算机科学与技术)',
          'Artificial Intelligence (人工智能)',
          'Civil Engineering (土木工程)',
        ]),
        coverage: 'Annual CNY 10,000 tuition discount directly applied to student invoice',
        deadline: '25 December 2026 (March Intake) / 30 June 2027 (September Intake)',
        sourceUrl: 'https://www.shenyangcu.edu.cn',
        status: 'active',
      },
    });
    changes++;
  }

  if (!existingScholarships.has('shenyang city university language program scholarship')) {
    await prisma.scholarship.create({
      data: {
        universityId: sycu.id,
        title: 'Shenyang City University Language Program Scholarship',
        type: 'Partial (Tuition Reduction)',
        details: JSON.stringify([
          'CNY 6,000 discount for 1-year Chinese language (Tuition reduced from CNY 16,000 to CNY 10,000/year)',
          'CNY 3,000 discount for 0.5-year Chinese language (Tuition reduced from CNY 8,000 to CNY 5,000/semester)',
        ]),
        amount: 'CNY 3,000–6,000 Tuition Discount',
        condition: 'High school diploma or above, age 18-30, clean criminal record.',
        eligiblePrograms: JSON.stringify([
          'Chinese Language Foundation Program (0.5-Year)',
          'Chinese Language Program (1-Year Zero-Beginner)',
        ]),
        coverage: 'Tuition reduction applied directly to semester/annual invoice',
        deadline: '25 December 2026 (Spring Intake)',
        sourceUrl: 'https://www.shenyangcu.edu.cn',
        status: 'active',
      },
    });
    changes++;
  }

  // Upsert Fees
  const existingFeeItems = new Set((sycu.fees || []).map((f) => f.item.trim().toLowerCase()));

  const sycuFees = [
    {
      item: 'Undergraduate Tuition (Net after Scholarship)',
      cost: '12,000 CNY/Year',
      notes: 'Bilingual bachelor programs (Business Admin, CS, AI, Civil Eng); reduced from CNY 22,000',
      validFor: '2027 Intakes (March 4.5-Yr & Sept 4-Yr)',
    },
    {
      item: '0.5-Year Chinese Language Foundation Tuition',
      cost: '5,000 CNY/0.5 Year',
      notes: 'Net tuition after CNY 3,000 scholarship; original gross CNY 8,000',
      validFor: 'March 2027 Spring Intake',
    },
    {
      item: '1-Year Chinese Language Program Tuition',
      cost: '10,000 CNY/Year',
      notes: 'Net tuition after CNY 6,000 scholarship; original gross CNY 16,000',
      validFor: '2027 Academic Year',
    },
    {
      item: 'Application Fee & Admission Deposit',
      cost: '1,000 CNY',
      notes: 'Paid upon Pre-Admission Notice to secure admission; non-refundable, 100% credited toward tuition on registration',
      validFor: '2027 Intake',
    },
    {
      item: 'Comprehensive Medical Insurance',
      cost: '800 CNY/Year',
      notes: 'Compulsory medical and accidental insurance for international students in China',
      validFor: 'Annual',
    },
    {
      item: 'On-Campus Standard Double Room',
      cost: '5,000 CNY/Year',
      notes: 'Equipped with private bathroom; 1 semester billed at 50%, half semester at 25%',
      validFor: 'Annual',
    },
    {
      item: 'On-Campus 4-Bed Dormitory',
      cost: '3,500 CNY/Year',
      notes: 'Equipped with private bathroom; most economical option',
      validFor: 'Annual',
    },
    {
      item: 'On-Campus Small Single Room',
      cost: '7,000 CNY/Year',
      notes: 'Private single room with private bathroom',
      validFor: 'Annual',
    },
  ];

  for (const fee of sycuFees) {
    if (!existingFeeItems.has(fee.item.toLowerCase())) {
      await prisma.fee.create({
        data: {
          universityId: sycu.id,
          ...fee,
          sourceUrl: 'https://www.shenyangcu.edu.cn',
        },
      });
      changes++;
    }
  }

  console.log(`Upserted Shenyang City University details (Changes: ${changes})`);
  return changes;
}

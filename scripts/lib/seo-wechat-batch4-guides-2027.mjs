// 9 WeChat Batch 4 Guides & University Upserts (2027 Admissions)
// Strict zero-competitor, global international audience, rich SEO & LLM support

import { WECHAT_BATCH4_9_GUIDES_DATA } from '../../src/data/newWechatBatch4Guides2027.ts';

export const WECHAT_BATCH4_9_GUIDE_SPECS = Object.values(WECHAT_BATCH4_9_GUIDES_DATA).map((guide) => ({
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

export async function upsertWechatBatch4Universities(prisma) {
  let changes = 0;

  // ==========================================
  // 1. China University of Geosciences (Wuhan) - NEW
  // ==========================================
  let cug = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'china-university-of-geosciences' },
        { slug: 'cug' },
        { name: 'China University of Geosciences' },
        { name: 'China University of Geosciences (Wuhan)' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (!cug) {
    cug = await prisma.university.create({
      data: {
        slug: 'china-university-of-geosciences',
        name: 'China University of Geosciences',
        location: 'Wuhan, Hubei, China',
        country: 'China',
        city: 'Wuhan',
        intake: 'March, September',
        degree: 'Bachelor, Master, PhD, Foundation, Language',
        taught: 'Chinese, English',
        rankingCountry: 42,
        rankingWorld: 401,
        rankingNational: 42,
        majors: 'Geology, Geological Resources and Engineering, Petroleum Engineering, Environmental Science and Engineering, Computer Science and Technology, Civil Engineering, International Economics and Trade',
        tuition: 'CNY 22,000–35,000 / year (CSC Bilateral Type A & High-Level Type B Eligible)',
        tuitionDetails: JSON.stringify([
          'Bachelor Programs (Science & Engineering, Chinese/English): CNY 22,000 / academic year',
          'Bachelor Programs (Liberal Arts & Management): CNY 20,000 / academic year',
          'Master Programs (Engineering & Natural Sciences, English-Taught): CNY 28,000 / academic year',
          'Doctoral Programs (PhD, English-Taught): CNY 35,000 / academic year',
          'Non-Degree Intensive Chinese Language: CNY 12,000 / academic year (CNY 6,000 / semester)',
          'On-Campus Accommodation: CNY 1,200–6,000 / year (Quad/Double/Single Room)',
        ]),
        documents: JSON.stringify([
          'Valid Passport (valid beyond September 2027)',
          'High School Diploma / Upper Secondary Certificate (or Bachelor / Master Degree Certificate for Graduate Applicants)',
          'Official Academic Transcripts (Notarized Chinese or English translations)',
          'Foreigner Physical Examination Record (with blood test reports, within last 6 months)',
          'Certificate of Non-Criminal Record (Police Clearance within last 6 months)',
          'CSCA Exam Score Report (Mandatory for all Undergraduate Applicants)',
          'CUG Supervisor Recommendation Form (Mandatory for Master and PhD Applicants)',
          'Two Recommendation Letters from Professors / Associate Professors (for Graduate Applicants)',
          'Study Plan or Research Proposal (min 200 words Bachelor, 800 words Graduate)',
          'Language Proficiency Certificate (HSK 4+ for Chinese tracks; IELTS 6.0 / TOEFL 80 / English MOI for English tracks)',
          'Financial Support Statement (Bank balance proof minimum USD 3,000–5,000 equivalent)',
        ]),
        deadlineApplication: '31 March 2027 (CSC Bilateral Type A) / 15 June 2027 (Self-Funded)',
        deadlineStartDate: 'September 2027',
        notes: JSON.stringify([
          'National Key University founded in 1952; Double First-Class and Project 211 Institution',
          'Designated by Ministry of Education (MOE) as one of 17 National Pre-University Education Centers for CGS recipients',
          'Official HSK Test Center authorized by Center for Language Education and Cooperation (CLEC)',
          'Mandatory CSCA exam required for international undergraduate applicants (Chinese Science/Arts, Math, Physics/Chemistry)',
          'Pre-Admission Letters issued for Chinese Government Scholarship Bilateral Program (Type A & Type C)',
          'Admissions Office: International Education College, 388 Lumo Road, Wuhan | Email: overseas@cug.edu.cn',
        ]),
        badges: JSON.stringify(['Double First Class', 'Project 211', 'CSC Bilateral Host', 'National Key University']),
        logo: '/images/universities/logos/cug.webp',
        isActive: true,
        officialUrl: 'https://eniec.cug.edu.cn',
        aliases: JSON.stringify(['CUG', 'China University of Geosciences (Wuhan)', '中国地质大学（武汉）']),
        legacySlugs: JSON.stringify(['cug', 'cug-wuhan']),
        relationshipType: 'partner',
        verificationStatus: 'verified',
        recognitionAuthority: 'Ministry of Education (MoE), PR China',
        recognitionSourceUrl: 'http://www.moe.gov.cn/',
        sourceUrls: JSON.stringify([
          'https://eniec.cug.edu.cn',
          'https://iec.cug.edu.cn',
          'https://studyinchina.csc.edu.cn',
          'https://www.csca.cn',
        ]),
        lastVerifiedAt: new Date(),
      },
      include: { programs: true, scholarships: true, fees: true },
    });

    // Add CUG Programs
    const cugPrograms = [
      {
        level: 'Bachelor',
        name: 'Geological Resources and Geological Engineering',
        subject: 'Engineering & Earth Sciences',
        languages: 'Chinese, English',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 22,000 / year',
        tuitionAfterScholarship: 'CNY 0 (Full CSC Type A / Type B) / CNY 10,000 (Provincial)',
        applicationDeadline: '31 March 2027 (CSC) / 15 June 2027 (Self-funded)',
        eligibility: JSON.stringify([
          'High School Diploma or upper secondary school certificate (under 25 years old).',
          'Competitive academic GPA (minimum 75%+ or GPA 3.0/4.0 equivalent).',
          'CSCA Exam Transcript mandatory: Chinese (Science), Mathematics, and Physics or Chemistry.',
          'English-taught: IELTS 6.0, TOEFL 80, or certified English MOI. Chinese-taught: HSK Level 4.',
        ]),
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
      {
        level: 'Bachelor',
        name: 'Computer Science and Technology',
        subject: 'Computer Science & Software',
        languages: 'Chinese, English',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 22,000 / year',
        tuitionAfterScholarship: 'CNY 0 (Full CSC) / CNY 10,000 (Provincial)',
        applicationDeadline: '31 March 2027 (CSC) / 15 June 2027 (Self-funded)',
        eligibility: JSON.stringify([
          'High School Diploma or upper secondary certificate (under 25 years old).',
          'Strong mathematics and quantitative foundations (minimum 75%+ or GPA 3.0/4.0).',
          'CSCA Exam Transcript mandatory: Mathematics, Chinese, and Physics.',
          'Language: IELTS 6.0 / TOEFL 80 / English MOI or HSK 4.',
        ]),
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
      {
        level: 'Master',
        name: 'Geological Sciences & Petroleum Exploration Engineering',
        subject: 'Earth Sciences & Resource Engineering',
        languages: 'English',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 28,000 / year',
        tuitionAfterScholarship: 'CNY 0 (Full CSC Type A / Type B with CNY 3,000/mo stipend)',
        applicationDeadline: '31 March 2027 (CSC Bilateral) / 15 June 2027',
        eligibility: JSON.stringify([
          'Accredited Bachelor’s degree in Geology, Mining, Civil, Petroleum, or related STEM field (under 35 years old).',
          'Undergraduate GPA minimum 3.0/4.0 or 75% equivalent.',
          'Compulsory CUG Supervisor Recommendation Form signed by faculty professor.',
          'English proficiency: IELTS 6.0, TOEFL 80, or certified English Medium of Instruction.',
        ]),
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
      {
        level: 'Master',
        name: 'Environmental Science and Engineering',
        subject: 'Environmental Engineering & Ecology',
        languages: 'English',
        duration: '3 years',
        intakes: 'September',
        tuition: 'CNY 28,000 / year',
        tuitionAfterScholarship: 'CNY 0 (Full CSC with CNY 3,000/mo stipend)',
        applicationDeadline: '31 March 2027 (CSC Bilateral) / 15 June 2027',
        eligibility: JSON.stringify([
          'Bachelor’s degree in Environmental Science, Chemical Engineering, Ecology, or Civil Engineering (under 35).',
          'Undergraduate GPA minimum 3.0/4.0 or 75% equivalent.',
          'Signed CUG Supervisor Recommendation Form.',
          'English proficiency: IELTS 6.0 / TOEFL 80 / English MOI.',
        ]),
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
      {
        level: 'PhD',
        name: 'Earth and Environmental Sciences (Doctoral Research)',
        subject: 'Geosciences & Environmental Dynamics',
        languages: 'English',
        duration: '4 years',
        intakes: 'September',
        tuition: 'CNY 35,000 / year',
        tuitionAfterScholarship: 'CNY 0 (Full CSC Type A / Type B with CNY 3,500/mo stipend)',
        applicationDeadline: '31 March 2027',
        eligibility: JSON.stringify([
          'Master’s degree in related science or engineering specialization (under 40 years old).',
          'Strong research track record, master thesis, and published academic papers.',
          'Signed CUG Supervisor Recommendation Form.',
          'English proficiency: IELTS 6.5 / TOEFL 85 / certified English MOI.',
        ]),
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
      {
        level: 'Language',
        name: 'Intensive Chinese Language & Culture Program',
        subject: 'Chinese Language (Non-Degree)',
        languages: 'Chinese',
        duration: '1 semester to 1 year',
        intakes: 'March, September',
        tuition: 'CNY 6,000 / semester (CNY 12,000 / year)',
        tuitionAfterScholarship: 'CNY 6,000 / semester',
        applicationDeadline: '15 December 2026 (Spring) / 30 June 2027 (Fall)',
        eligibility: JSON.stringify([
          'Non-Chinese citizen holding valid passport, aged 18 to 45.',
          'High school graduation certificate or higher.',
          'Good physical and mental health with clean police clearance.',
        ]),
        sourceUrl: 'https://iec.cug.edu.cn',
      },
    ];

    for (const prog of cugPrograms) {
      await prisma.program.create({
        data: {
          universityId: cug.id,
          ...prog,
        },
      });
    }

    // Add CUG Scholarships
    await prisma.scholarship.create({
      data: {
        universityId: cug.id,
        title: 'Chinese Government Scholarship – Bilateral Program (CSC Type A / Type C)',
        type: 'Government Full Scholarship',
        details: JSON.stringify([
          '100% Tuition Fee Waiver for complete study duration',
          'Free On-Campus University Accommodation',
          'Comprehensive Medical Insurance (CNY 800/year covered)',
          'Monthly Living Stipend: Undergraduates CNY 2,500/mo, Master’s CNY 3,000/mo, PhD CNY 3,500/mo',
          'Pre-Admission Letter issued by CUG Wuhan for embassy / national ministry nomination',
        ]),
        amount: 'Full Funding (Tuition + Housing + Stipend)',
        condition: 'Must obtain CUG Pre-Admission Letter by 31 March 2027 and receive nomination from home country embassy or dispatching authority.',
        eligiblePrograms: JSON.stringify(['Bachelor', 'Master', 'PhD', 'General Scholar', 'Senior Scholar']),
        coverage: 'Full tuition, accommodation, health insurance, and monthly living allowance',
        renewal: 'Annual academic performance review through CSC evaluation',
        deadline: '31 March 2027 (or home country embassy deadline)',
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
    });

    await prisma.scholarship.create({
      data: {
        universityId: cug.id,
        title: 'Chinese Government Scholarship – High-Level Postgraduate Program (CSC Type B)',
        type: 'University Direct Full Scholarship',
        details: JSON.stringify([
          'Full Tuition Waiver for Master (3 years) and PhD (4 years)',
          'Free University On-Campus Residence',
          'Monthly Living Stipend: CNY 3,000/mo (Master) / CNY 3,500/mo (PhD)',
          'Comprehensive Medical Insurance covered',
        ]),
        amount: 'Full Funding',
        condition: 'Direct application through CUG international portal; requires CUG supervisor recommendation.',
        eligiblePrograms: JSON.stringify(['Master', 'PhD']),
        coverage: 'Full tuition, housing, insurance, and monthly living allowance',
        renewal: 'Annual academic evaluation',
        deadline: '15 March 2027',
        sourceUrl: 'https://eniec.cug.edu.cn',
      },
    });

    // Add CUG Fees
    const cugFees = [
      { item: 'Bachelor Tuition (Science & Engineering)', cost: 'CNY 22,000 / year' },
      { item: 'Bachelor Tuition (Liberal Arts & Management)', cost: 'CNY 20,000 / year' },
      { item: 'Master Tuition (English Taught)', cost: 'CNY 28,000 / year' },
      { item: 'PhD Tuition (English Taught)', cost: 'CNY 35,000 / year' },
      { item: 'Chinese Language Tuition', cost: 'CNY 6,000 / semester (CNY 12,000 / year)' },
      { item: 'On-Campus Accommodation (Double Room)', cost: 'CNY 2,400–4,000 / year' },
      { item: 'On-Campus Accommodation (Single Room)', cost: 'CNY 5,000–6,000 / year' },
      { item: 'Medical Insurance', cost: 'CNY 800 / year' },
      { item: 'Application Fee', cost: 'CNY 400 (one-time)' },
      { item: 'Residence Permit Fee', cost: 'CNY 400 / year' },
    ];
    for (const fee of cugFees) {
      await prisma.fee.create({
        data: {
          universityId: cug.id,
          ...fee,
        },
      });
    }

    changes++;
  }

  // ==========================================
  // 2. Update Northwestern Polytechnical University (NPU)
  // ==========================================
  const npu = await prisma.university.findFirst({
    where: { OR: [{ slug: 'npu' }, { name: 'Northwestern Polytechnical University' }] },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (npu) {
    const existingNotes = JSON.parse(npu.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        '2027 Admissions Open: Spring 2027 intake (Exchange, Foundation, Chinese Language; deadline 15 Dec 2026)',
        'Fall 2027 Bachelor Programs: 1 Nov 2026 – 20 May 2027 (Evaluated across 4 Admission Batches)',
        'Fall 2027 Postgraduate (CSC Type B): 1 Nov 2026 – 28 Feb 2027 (2 Batches)',
        'Fall 2027 Postgraduate (NPU President / Self-funded): 1 Nov 2026 – 30 April 2027 (4 Batches)',
        'Official Portal: admission.nwpu.edu.cn | WeChat: NPUINTL | studyat.nwpu.edu.cn',
      ]),
    ];

    await prisma.university.update({
      where: { id: npu.id },
      data: {
        intake: 'March, September',
        notes: JSON.stringify(updatedNotes),
        deadlineApplication: '15 Dec 2026 (Spring) / 28 Feb 2027 (CSC) / 20 May 2027 (Bachelor)',
        lastVerifiedAt: new Date(),
      },
    });

    // Check if Spring Foundation exists
    const hasSpringFoundation = npu.programs.some(
      (p) => p.name.includes('Foundation') && p.intakes.includes('March')
    );
    if (!hasSpringFoundation) {
      await prisma.program.create({
        data: {
          universityId: npu.id,
          level: 'Foundation',
          name: 'NPU International Pre-University Foundation Program (Chinese / English Track)',
          subject: 'STEM & Language Foundation',
          languages: 'English, Chinese',
          duration: '1 semester to 1 year',
          intakes: 'March, September',
          tuition: 'CNY 10,000 / semester (CNY 18,000 / year)',
          tuitionAfterScholarship: 'CNY 10,000 / semester',
          applicationDeadline: '15 December 2026 (Spring) / 15 June 2027 (Fall)',
          eligibility: JSON.stringify([
            'High School Graduate or current final-year student (under 24 years old).',
            'Strong foundation in Mathematics and basic English/Chinese proficiency.',
            'Direct degree progression pathway to NPU English-taught Bachelor degrees upon completion.',
          ]),
          sourceUrl: 'https://studyat.nwpu.edu.cn',
        },
      });
    }
    changes++;
  }

  // ==========================================
  // 3. Update Nanjing University of Aeronautics & Astronautics (NUAA)
  // ==========================================
  const nuaa = await prisma.university.findFirst({
    where: { OR: [{ slug: 'nuaa' }, { name: 'Nanjing University of Aeronautics and Astronautics' }] },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (nuaa) {
    const existingNotes = JSON.parse(nuaa.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        '2027 Postgraduate Brochure: 30+ English-taught Master (CNY 30,000–33,600/yr) & PhD (CNY 34,000–37,800/yr) majors',
        'Mandatory Supervisor Acceptance Letter required for all Master and PhD applications',
        'CSC Type B and NUAA Fly-High Scholarships open (Final Application Deadline 30 May 2027)',
        'NUAA International Foundation Program: Spring 2027 intake starts 8 March 2027 (0.5+4 Bachelor Pathway, tuition CNY 8,400/sem, deadline 27 Feb 2027)',
        'Admissions Office: cie.nuaa.edu.cn | Application Portal: nj.at0086.cn/StuApplication/Login.aspx',
      ]),
    ];

    await prisma.university.update({
      where: { id: nuaa.id },
      data: {
        intake: 'March, September',
        notes: JSON.stringify(updatedNotes),
        deadlineApplication: '27 February 2027 (Spring Foundation) / 30 May 2027 (Postgraduate)',
        lastVerifiedAt: new Date(),
      },
    });

    // Check if Foundation program exists
    const hasFoundation = nuaa.programs.some((p) => p.name.includes('Foundation'));
    if (!hasFoundation) {
      await prisma.program.create({
        data: {
          universityId: nuaa.id,
          level: 'Foundation',
          name: 'NUAA International Foundation Program (0.5+4 Fast-Track Pathway)',
          subject: 'Pre-Engineering & CSCA Preparation',
          languages: 'English',
          duration: '1 semester (0.5 year)',
          intakes: 'March',
          tuition: 'CNY 8,400 / semester (~USD 1,200)',
          tuitionAfterScholarship: 'CNY 8,400 / semester (Priority undergraduate scholarship in degree)',
          applicationDeadline: '27 February 2027 (Classes commence 8 March 2027)',
          eligibility: JSON.stringify([
            'Non-Chinese national, under 24 years old.',
            'High school graduate or current final-year secondary school student.',
            'Proficient in English (able to follow English medium curriculum).',
            'Progresses directly to 6 English-taught Bachelor degrees: Aeronautical Engineering, AI, Mechanical, Electrical, Civil, International Business.',
          ]),
          sourceUrl: 'http://cie.nuaa.edu.cn',
        },
      });
    }

    // Add NUAA Fly-High Scholarship if missing
    const hasFlyHigh = nuaa.scholarships.some((s) => s.title.includes('Fly-High') || s.title.includes('Fly High'));
    if (!hasFlyHigh) {
      await prisma.scholarship.create({
        data: {
          universityId: nuaa.id,
          title: 'NUAA Fly-High International Postgraduate Scholarship',
          type: 'University Entry Scholarship',
          details: JSON.stringify([
            'Merit-based single-year entrance award evaluated at the time of admission offer',
            'Based on academic record, research background, and interview scores',
            'Year 2 onward: Enrolled students compete annually for NUAA Academic Scholarships up to CNY 20,000/year',
          ]),
          amount: 'Tiered Tuition Waiver (Up to Full First-Year Tuition)',
          condition: 'Must secure NUAA Supervisor Acceptance Letter and hold minimum GPA 3.0/4.0 (75%+).',
          eligiblePrograms: JSON.stringify(['Master', 'PhD']),
          coverage: 'Partial to full tuition waiver',
          renewal: 'Annual competition based on GPA and research outputs',
          deadline: '30 May 2027',
          sourceUrl: 'http://cie.nuaa.edu.cn',
        },
      });
    }
    changes++;
  }

  // ==========================================
  // 4. Update Nanjing University of Science and Technology (NJUST)
  // ==========================================
  const njust = await prisma.university.findFirst({
    where: {
      OR: [
        { slug: 'nanjing-university-of-science-and-technology' },
        { slug: 'njust' },
        { name: 'Nanjing University of Science and Technology' },
      ],
    },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (njust) {
    const existingNotes = JSON.parse(njust.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        '2027 Undergraduate Admissions Guide: CSCA examination is MANDATORY for all international applicants',
        'English-Taught Bachelor Majors: Mechanical Engineering, Software Engineering, International Economics & Trade, Nanomaterials (CNY 19,800/yr)',
        'Chinese-Taught Bachelor Majors: Mechanical, Automation, Pharmacy, Aircraft Design, Chemical Engineering (CNY 18,000/yr)',
        'Quad Room Dormitory: CNY 4,000/year (Mandatory for first-year freshmen)',
        'Application Period: 20 October 2026 – 15 June 2027 | Portal: njust.17gz.org | CSCA Portal: csca.cn',
        'Scholarships: NJUST Lanshan Scholarship (Undergraduate, Master, PhD) & CSC Type B (Agency 10288)',
      ]),
    ];

    await prisma.university.update({
      where: { id: njust.id },
      data: {
        notes: JSON.stringify(updatedNotes),
        deadlineApplication: '5 March 2027 (CSC Type B) / 15 June 2027 (Undergraduate & Lanshan)',
        lastVerifiedAt: new Date(),
      },
    });

    // Check if English Bachelor Software Engineering is updated with CSCA
    for (const prog of njust.programs) {
      if (prog.level === 'Bachelor') {
        const elig = JSON.parse(prog.eligibility || '[]');
        if (!elig.some((e) => e.includes('CSCA'))) {
          elig.push('Mandatory China Scholastic Competency Assessment (CSCA) score report in designated subjects.');
          await prisma.program.update({
            where: { id: prog.id },
            data: { eligibility: JSON.stringify(elig) },
          });
        }
      }
    }
    changes++;
  }

  // ==========================================
  // 5. Update Guizhou University (GZU)
  // ==========================================
  const gzu = await prisma.university.findFirst({
    where: { OR: [{ slug: 'gzu' }, { name: 'Guizhou University' }] },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (gzu) {
    const existingNotes = JSON.parse(gzu.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        'Spring 2027 Chinese Language Program (Non-degree): Application Deadline 15 December 2026',
        'Tuition: CNY 6,000 / semester (CNY 12,000 / year); Registration Fee: CNY 500; Insurance: CNY 400 / semester',
        'Bank Financial Proof: Minimum RMB 20,000 equivalent funds certificate',
        'Application Portal: gzu.at0086.cn/StuApplication/Login.aspx | Email: cie@gzu.edu.cn',
      ]),
    ];

    await prisma.university.update({
      where: { id: gzu.id },
      data: {
        intake: 'March, September',
        notes: JSON.stringify(updatedNotes),
        deadlineApplication: '15 December 2026 (Spring Language) / 15 June 2027 (Fall Degree)',
        lastVerifiedAt: new Date(),
      },
    });

    const hasSpringLang = gzu.programs.some(
      (p) => p.name.includes('Chinese Language') && p.intakes.includes('March')
    );
    if (!hasSpringLang) {
      await prisma.program.create({
        data: {
          universityId: gzu.id,
          level: 'Language',
          name: 'Non-Degree Chinese Language Program (Spring & Fall)',
          subject: 'Chinese Language & HSK Preparation',
          languages: 'Chinese',
          duration: '1 semester to 1 year',
          intakes: 'March, September',
          tuition: 'CNY 6,000 / semester (CNY 12,000 / year)',
          tuitionAfterScholarship: 'CNY 6,000 / semester',
          applicationDeadline: '15 December 2026 (Spring) / 30 June 2027 (Fall)',
          eligibility: JSON.stringify([
            'Non-Chinese citizen holding valid passport, aged 16 to 35.',
            'High school diploma or current enrollment certificate with good academic standing.',
            'Foreigner Physical Examination Record and Police Clearance certificate.',
            'Bank funds statement showing minimum RMB 20,000 or equivalent balance.',
          ]),
          sourceUrl: 'http://cie.gzu.edu.cn',
        },
      });
    }
    changes++;
  }

  // ==========================================
  // 6. Update Universiti Malaya (UM)
  // ==========================================
  const um = await prisma.university.findFirst({
    where: { OR: [{ slug: 'universiti-malaya' }, { name: 'Universiti Malaya' }] },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (um) {
    const existingNotes = JSON.parse(um.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        'UCASS–Universiti Malaya Foundation Program (Beijing Campus): 1-year foundation at UCASS Wangjing Campus, Beijing',
        'Direct progression to Universiti Malaya Bachelor degrees in Kuala Lumpur (Business, Economics, Arts, Social Sciences, Creative Arts)',
        'IELTS Examination Waived for unconditional bachelor degree admission upon satisfactory foundation graduation',
        'Tuition: RMB 97,300 (UCASS Beijing instruction) + MYR 35,000 (UM enrolment); Single room accommodation RMB 40,000/yr',
      ]),
    ];

    await prisma.university.update({
      where: { id: um.id },
      data: {
        notes: JSON.stringify(updatedNotes),
        lastVerifiedAt: new Date(),
      },
    });

    const hasUcassPathway = um.programs.some((p) => p.name.includes('UCASS'));
    if (!hasUcassPathway) {
      await prisma.program.create({
        data: {
          universityId: um.id,
          level: 'Foundation',
          name: 'UCASS–Universiti Malaya Beijing Foundation Program (Humanities & Social Sciences)',
          subject: 'Social Sciences & Intercultural Foundations',
          languages: 'English',
          duration: '1 year (Beijing) + 3–3.5 years (Kuala Lumpur)',
          intakes: 'September',
          tuition: 'CNY 97,300 + MYR 35,000',
          tuitionAfterScholarship: 'Direct progression to UM bachelor with full IELTS exemption',
          applicationDeadline: '31 July 2027',
          eligibility: JSON.stringify([
            'Recognized Upper Secondary School Certificate / High School Diploma (Grade B or 75%+ equivalent).',
            'GCE A-Levels (B/C grades) or IB Diploma (28–30+ points).',
            'Pass joint oral admission interview with UCASS and Universiti Malaya academic board.',
            'Medical health clearance (free from hepatitis B or active infectious conditions).',
          ]),
          sourceUrl: 'https://www.um.edu.my',
        },
      });
    }
    changes++;
  }

  // ==========================================
  // 7. Update Xiamen University (XMU)
  // ==========================================
  const xmu = await prisma.university.findFirst({
    where: { OR: [{ slug: 'xiamen-university' }, { name: 'Xiamen University' }] },
    include: { programs: true, scholarships: true, fees: true },
  });

  if (xmu) {
    const existingNotes = JSON.parse(xmu.notes || '[]');
    const updatedNotes = [
      ...new Set([
        ...existingNotes,
        'International College Spring 2027 Admissions: SQA-AD 2.5+1 (Quota 100) & International Bachelor 1.5+2 (Quota 80) tracks',
        'Art & Design International Undergraduate 1.5+2 (Quota 20) with portfolio submission',
        'Articulations to 50+ universities in UK (Exeter, Newcastle, York, Sussex, Southampton), Australia, Singapore, Canada',
        'Spring Semester starts February 2027 at XMU Zhangzhou Campus; Tuition CNY 45,000/spring semester, Quad room CNY 600/sem',
        'Official Portal: liuxue.xmu.edu.cn | WeChat: xmu-ic',
      ]),
    ];

    await prisma.university.update({
      where: { id: xmu.id },
      data: {
        intake: 'March, September',
        notes: JSON.stringify(updatedNotes),
        lastVerifiedAt: new Date(),
      },
    });

    const hasSqaAd = xmu.programs.some((p) => p.name.includes('SQA-AD'));
    if (!hasSqaAd) {
      await prisma.program.create({
        data: {
          universityId: xmu.id,
          level: 'Bachelor',
          name: 'SQA-AD (2.5+1) & International Bachelor Articulation Program (Spring 2027 Intake)',
          subject: 'Business, IT, Engineering & Creative Arts',
          languages: 'English',
          duration: '2.5 years (XMU) + 1 year (Overseas)',
          intakes: 'March, September',
          tuition: 'CNY 45,000 / spring semester (CNY 90,000 / academic year)',
          tuitionAfterScholarship: 'CNY 45,000 / spring semester',
          applicationDeadline: '15 February 2027 (Spring) / 30 June 2027 (Fall)',
          eligibility: JSON.stringify([
            'High school diploma or predicted graduation certificate.',
            'Pass college entrance examination (English and academic aptitude).',
            'IELTS 4.5+ (SQA-AD) or IELTS 5.0+ (International Bachelor) grants written test exemption.',
            'Zhangzhou Campus study; progresses to UK, Australia, Singapore or Canada partner degrees.',
          ]),
          sourceUrl: 'https://liuxue.xmu.edu.cn',
        },
      });
    }
    changes++;
  }

  // ==========================================
  // 8. GLOBAL AUDIENCE CLEANUP: Cleanse HSC/SSC/Bangladeshi terms across all DB records
  // ==========================================
  console.log('Sweeping database to replace regional HSC/SSC terms with universal international standards...');
  const allUnis = await prisma.university.findMany({
    select: { id: true, slug: true, documents: true, notes: true },
  });

  for (const u of allUnis) {
    let docs = u.documents || '[]';
    let notes = u.notes || '[]';
    let modified = false;

    if (docs.includes('HSC') || docs.includes('SSC') || docs.includes('Bangladeshi')) {
      docs = docs
        .replace(/SSC and HSC or equivalent graduation certificates and full academic transcripts/g, 'High School Diploma / Secondary Leaving Certificate (or Bachelor / Master Degree for Graduate) and full academic transcripts')
        .replace(/Academic Certificates \(SSC & HSC \/ Bachelor Degree Certificate\)/g, 'High School Diploma / Secondary School Certificate (or Bachelor / Master Degree for Graduate Applicants)')
        .replace(/HSC Certificate/g, 'High School Diploma / Secondary Leaving Certificate')
        .replace(/HSC Transcript/g, 'Official Academic Transcripts / Grade Sheets')
        .replace(/SSC & HSC/g, 'Secondary & Higher Secondary Certificates')
        .replace(/SSC and HSC/g, 'Secondary & Higher Secondary Certificates')
        .replace(/\bHSC\b/g, 'High School Diploma')
        .replace(/\bSSC\b/g, 'Secondary School Certificate')
        .replace(/Bangladeshi Students/gi, 'International Students')
        .replace(/Bangladeshi/gi, 'International');
      modified = true;
    }

    if (notes.includes('HSC') || notes.includes('SSC') || notes.includes('Bangladeshi')) {
      notes = notes
        .replace(/Grade 12 \/ High School HSC: [0-9.]+\/[0-9.]+/g, 'Grade 12 / High School Diploma: 80%+ or GPA 3.5/4.0')
        .replace(/Requirements: HSC 5\.00\+/g, 'Minimum Academic Requirement: High School GPA 80%+ or equivalent (3.5/4.0)')
        .replace(/Requirements: HSC 4\.80\+/g, 'Minimum Academic Requirement: High School GPA 75%+ or equivalent (3.0/4.0)')
        .replace(/Requirements: HSC [0-9.]+\+/g, 'Minimum Academic Requirement: High School GPA 75%+ or equivalent')
        .replace(/HSC [0-9.]+\+/g, 'High School GPA 75%+ or equivalent')
        .replace(/HSC: [0-9.]+\/[0-9.]+/g, 'High School: 80%+ or GPA 3.5/4.0')
        .replace(/\bHSC\b/g, 'High School')
        .replace(/\bSSC\b/g, 'Secondary School')
        .replace(/Bangladeshi Students Only/gi, 'Open to all international nationalities')
        .replace(/Bangladeshi Students/gi, 'International Students')
        .replace(/Bangladeshi/gi, 'International');
      modified = true;
    }

    if (modified) {
      await prisma.university.update({
        where: { id: u.id },
        data: { documents: docs, notes: notes },
      });
      changes++;
    }
  }

  // Sweep programs
  const allProgs = await prisma.program.findMany({
    select: { id: true, eligibility: true },
  });

  for (const p of allProgs) {
    let elig = p.eligibility || '[]';
    if (elig.includes('HSC') || elig.includes('SSC') || elig.includes('Bangladeshi')) {
      elig = elig
        .replace(/Requirements: HSC 5\.00\+/g, 'Minimum Academic Standard: High School GPA 80%+ or equivalent (3.5/4.0)')
        .replace(/Requirements: HSC 4\.80\+/g, 'Minimum Academic Standard: High School GPA 75%+ or equivalent (3.0/4.0)')
        .replace(/Requirements: HSC [0-9.]+\+/g, 'Minimum Academic Standard: High School GPA 75%+ or equivalent')
        .replace(/HSC \/ A-Level \/ Diploma/g, 'High School Diploma / A-Level / IB / Upper Secondary Certificate')
        .replace(/HSC/g, 'High School Diploma')
        .replace(/SSC/g, 'Secondary School Certificate')
        .replace(/Bangladeshi students/gi, 'international students')
        .replace(/Bangladeshi/gi, 'International');

      await prisma.program.update({
        where: { id: p.id },
        data: { eligibility: elig },
      });
      changes++;
    }
  }

  console.log(`Upserted and cleaned up WeChat Batch 4 universities & programs. Total operations: ${changes}`);
  return changes;
}

// Wuzhou University (梧州学院) — March 2027 direct bachelor intake with 4-year scholarship.
// Global audience (all nationalities). No third-party / agency names.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SLUG = 'wuzhou-university';
const OFFICIAL = 'https://www.gxuwz.edu.cn';
const DEADLINE = '30 December 2026 (March 2027 Intake)';
const INTAKE = 'March 2027';

const MAJORS = [
  { id: 'iet', name: 'International Economics and Trade', subject: 'Business & International Trade', total: 9300 },
  { id: 'be', name: 'Business English', subject: 'Languages & Business Communication', total: 9000 },
  { id: 'cst', name: 'Computer Science and Technology', subject: 'Computer Science & Engineering', total: 9900 },
  { id: 'ai', name: 'Artificial Intelligence', subject: 'Artificial Intelligence & Data', total: 9900 },
];

const fmt = n => n.toLocaleString('en-US');

const ELIGIBILITY = [
  'Completed secondary education (High School Diploma / Secondary School Certificate or international equivalent)',
  'Minimum 60% overall marks (or equivalent GPA) in the most recent qualification',
  'Age 18–23 at the time of application',
  'Open to applicants of all nationalities (non-Chinese citizens with a valid ordinary passport)',
  'CSCA exam is not required for this intake',
  'A 2-minute self-introduction video in English is mandatory',
];

const DOCUMENTS = [
  'Valid ordinary passport (bio-data page scan)',
  'Recent passport-style photograph with a white background',
  'Highest academic certificate and transcripts with certified English translations',
  'Bank statement showing a minimum balance of USD 3,000 (or equivalent)',
  'Police clearance certificate (issued within the last 6 months)',
  'Foreigner Physical Examination Form (completed within the last 6 months)',
  '2-minute self-introduction video in English',
];

const SCHOLARSHIP_TITLE = 'Wuzhou University International Student Bachelor Scholarship (4 Years)';

async function main() {
  console.log('Upserting Wuzhou University (March 2027 direct bachelor)...');

  const base = {
    name: 'Wuzhou University',
    location: 'Wuzhou, Guangxi, China',
    country: 'China',
    city: 'Wuzhou',
    intake: 'March, September',
    degree: 'Bachelor',
    taught: 'English, Chinese',
    majors: MAJORS.map(m => m.name).join(', '),
    tuition: 'CNY 9,000–9,900 / year (tuition + twin-share accommodation, after scholarship)',
    tuitionDetails: JSON.stringify([
      ...MAJORS.map(m => `${m.name}: CNY ${fmt(m.total)} / year (tuition + twin-share room combined)`),
      'Scholarship applies for the full 4-year bachelor duration (unconditional on admission)',
      'Separate costs: medical insurance, residence permit, and in-China medical check (charged at cost)',
    ]),
    documents: JSON.stringify(DOCUMENTS),
    deadlineApplication: DEADLINE,
    deadlineStartDate: 'March 2027',
    notes: JSON.stringify([
      'Wuzhou University (梧州学院) is a public, Ministry of Education-recognised undergraduate university in Wuzhou, Guangxi Zhuang Autonomous Region.',
      'Located in the Pearl River (Xijiang) corridor on the Guangxi–Guangdong border, within easy high-speed rail reach of Guangzhou and Shenzhen — two of China\'s largest business and technology hubs.',
      'March 2027 direct-major bachelor degree: no foundation year, no CSCA exam.',
      '4-year unconditional scholarship: combined tuition + twin-share accommodation from CNY 9,000 / year.',
      'Limited capacity: 35 seats per major.',
      'Mandatory 2-minute English self-introduction video for every applicant.',
    ]),
    badges: JSON.stringify(['4-Year Scholarship', 'March Intake', 'No CSCA Exam', 'Near Guangzhou & Shenzhen', 'Direct Bachelor']),
    logo: '/images/universities/logos/wuzhou-university.webp',
    isActive: true,
    officialUrl: OFFICIAL,
    aliases: JSON.stringify(['WZU', 'Wuzhou University', '梧州学院', 'Wuzhou College', 'GXUWZ']),
    legacySlugs: JSON.stringify(['wzu', 'gxuwz']),
    relationshipType: 'authorized_representative',
    verificationStatus: 'verified',
    recognitionAuthority: 'Guangxi Department of Education & Ministry of Education of the PRC',
    recognitionSourceUrl: 'https://www.moe.gov.cn/',
    sourceUrls: JSON.stringify([OFFICIAL, 'https://www.shanghairanking.com/universities/wuzhou-university']),
    lastVerifiedAt: new Date(),
  };

  const uni = await prisma.university.upsert({
    where: { slug: SLUG },
    update: base,
    create: { slug: SLUG, ...base },
  });

  await prisma.program.deleteMany({ where: { universityId: uni.id } });
  await prisma.fee.deleteMany({ where: { universityId: uni.id } });
  await prisma.scholarship.deleteMany({ where: { universityId: uni.id } });

  await prisma.program.createMany({
    data: MAJORS.map(m => ({
      universityId: uni.id,
      name: m.name,
      level: 'Bachelor',
      subject: m.subject,
      languages: 'English',
      duration: '4 years',
      intakes: INTAKE,
      tuition: `${fmt(m.total)} CNY/Year (tuition + twin-share room)`,
      tuitionAfterScholarship: `${fmt(m.total)} CNY/Year (tuition + twin-share room)`,
      applicationDeadline: DEADLINE,
      eligibility: JSON.stringify([...ELIGIBILITY, 'Seat cap: 35 students for this major (first-come, merit-reviewed)']),
      sourceUrl: OFFICIAL,
      status: 'active',
    })),
  });

  await prisma.scholarship.create({
    data: {
      universityId: uni.id,
      title: SCHOLARSHIP_TITLE,
      type: 'Partial (Tuition + Accommodation Package)',
      details: JSON.stringify([
        'Unconditional scholarship granted on admission for the full 4-year bachelor duration',
        ...MAJORS.map(m => `${m.name}: total payable CNY ${fmt(m.total)} / year including twin-share room`),
        'Direct major entry from March 2027 — no foundation year required',
        '35 seats per major; applications are reviewed in order of completeness',
      ]),
      amount: 'Net payable CNY 9,000–9,900 / year (tuition + accommodation combined)',
      condition: 'Age 18–23; minimum 60% marks; complete documents including 2-minute English introduction video. Open to all nationalities.',
      eligiblePrograms: JSON.stringify(MAJORS.map(m => m.name)),
      coverage: 'Reduced tuition bundled with twin-share on-campus accommodation for 4 years',
      deadline: DEADLINE,
      sourceUrl: OFFICIAL,
      status: 'active',
    },
  });

  await prisma.fee.createMany({
    data: [
      ...MAJORS.map(m => ({
        universityId: uni.id,
        item: `${m.name} — Tuition + Twin-Share Accommodation`,
        cost: `${fmt(m.total)} CNY/Year`,
        notes: 'After 4-year scholarship; combined annual package',
        sourceUrl: OFFICIAL,
      })),
      { universityId: uni.id, item: 'Proof of Funds (Bank Statement)', cost: 'USD 3,000 minimum', notes: 'Required at application stage; not a fee', sourceUrl: OFFICIAL },
      { universityId: uni.id, item: 'Medical Insurance', cost: 'Charged at cost', notes: 'Mandatory for all international students in China', sourceUrl: OFFICIAL },
      { universityId: uni.id, item: 'Residence Permit', cost: 'Charged at cost', notes: 'Issued after arrival', sourceUrl: OFFICIAL },
    ],
  });
  console.log(`✓ Wuzhou University: ${MAJORS.length} programs, 1 scholarship, fees synced.`);

  // Profile details campaign (used by university detail page)
  const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
  if (record) {
    const parsed = JSON.parse(record.contentJson);
    parsed.universities = parsed.universities || [];
    const profile = {
      slug: SLUG,
      overview:
        'Wuzhou University (梧州学院) is a public undergraduate university in Wuzhou, Guangxi, on the Xijiang River at the Guangxi–Guangdong border — a short high-speed rail trip from Guangzhou and Shenzhen. For the March 2027 intake it offers direct-major English-taught bachelor degrees with a 4-year unconditional scholarship package (tuition + twin-share accommodation from CNY 9,000 / year) to students of all nationalities, with no CSCA exam requirement.',
      highlights: [
        { title: 'Gateway to the Greater Bay Area', description: 'Well connected by high-speed rail to Guangzhou and Shenzhen for internships, trade fairs and graduate careers.' },
        { title: '4-Year Unconditional Scholarship', description: 'Tuition plus twin-share room from CNY 9,000 / year, fixed for the full bachelor duration.' },
        { title: 'Direct Major Entry, No CSCA', description: 'Start your degree in March 2027 without a foundation year or CSCA exam. 35 seats per major.' },
      ],
      programs: MAJORS.map(m => ({
        id: `wuzhou-prog-${m.id}`,
        name: m.name,
        level: 'Bachelor',
        languages: ['English'],
        duration: '4 years',
        intake: INTAKE,
        deadline: DEADLINE,
        qualifications: ELIGIBILITY,
        languageRequirements: ['English-taught; proficiency assessed through the mandatory 2-minute English introduction video'],
        documents: DOCUMENTS,
        notes: ['35 seats for this major', 'Annual package includes twin-share on-campus room'],
        fees: [
          {
            key: 'tuition',
            item: 'Tuition + Twin-Share Accommodation',
            amount: m.total,
            currency: 'CNY',
            period: 'year',
            stage: 'in_china',
            displayAmount: `CNY ${fmt(m.total)} / year (after scholarship, room included)`,
          },
        ],
      })),
      scholarshipOptions: [
        {
          id: 'wuzhou-schol-bachelor-4yr',
          title: SCHOLARSHIP_TITLE,
          type: 'Partial (Tuition + Accommodation Package)',
          levels: ['Bachelor'],
          coverage: MAJORS.map(m => `${m.name}: CNY ${fmt(m.total)} / year total (tuition + twin-share room)`),
          conditions: ['Age 18–23', 'Minimum 60% marks', 'Complete documents and 2-minute English video', 'Open to all nationalities'],
          renewal: ['Unconditional for 4 years subject to normal enrolment, attendance and conduct rules.'],
          documents: DOCUMENTS,
          applicationSteps: [
            'Send passport and academic records for a free eligibility check.',
            'Record and submit the 2-minute English self-introduction video.',
            'Submit the full application before 30 December 2026.',
            'Receive the Admission Letter and JW202 form, then apply for the X1 study visa.',
          ],
          status: 'open',
          notes: ['35 seats per major; early applications strongly recommended.'],
        },
      ],
    };
    const idx = parsed.universities.findIndex(u => u.slug === SLUG);
    if (idx >= 0) parsed.universities[idx] = { ...parsed.universities[idx], ...profile };
    else parsed.universities.push(profile);
    await prisma.intakeCampaign.update({
      where: { slug: 'university-profile-details' },
      data: { contentJson: JSON.stringify(parsed) },
    });
    console.log('✓ Wuzhou University profile details saved.');
  }
}

main()
  .catch(e => {
    console.error('Error seeding Wuzhou University:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

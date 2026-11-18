// March 2027 intake data for Shandong University of Technology (new profile),
// Civil Aviation University of China and Hechi University (existing profiles).
// Global audience; no third-party / agency names.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const now = () => new Date();

const STD_DOCS = [
  'Valid ordinary passport (bio-data page scan)',
  'Recent passport-style photograph',
  'Secondary school certificate and transcripts with certified English translations',
  'Foreigner Physical Examination Form',
  'Police clearance certificate (non-criminal record)',
];

async function upsertPrograms(universityId, programs) {
  for (const p of programs) {
    const existing = await prisma.program.findFirst({ where: { universityId, name: p.name, level: p.level } });
    const data = { ...p, universityId, eligibility: JSON.stringify(p.eligibility), status: 'active' };
    if (existing) await prisma.program.update({ where: { id: existing.id }, data });
    else await prisma.program.create({ data });
  }
}

async function upsertFees(universityId, fees, sourceUrl) {
  for (const f of fees) {
    const existing = await prisma.fee.findFirst({ where: { universityId, item: f.item } });
    const data = { ...f, universityId, sourceUrl };
    if (existing) await prisma.fee.update({ where: { id: existing.id }, data });
    else await prisma.fee.create({ data });
  }
}

async function upsertScholarship(universityId, s) {
  const existing = await prisma.scholarship.findFirst({ where: { universityId, title: s.title } });
  const data = {
    ...s,
    universityId,
    details: JSON.stringify(s.details),
    eligiblePrograms: JSON.stringify(s.eligiblePrograms),
    status: 'active',
  };
  if (existing) await prisma.scholarship.update({ where: { id: existing.id }, data });
  else await prisma.scholarship.create({ data });
}

function addIntake(current, month) {
  const set = new Set(String(current || '').split(/,\s*/).filter(Boolean));
  set.add(month);
  return ['March', 'September'].filter(m => set.has(m)).concat([...set].filter(m => !['March', 'September'].includes(m))).join(', ');
}

// ---------------------------------------------------------------- SDUT
async function seedSdut() {
  const OFFICIAL = 'https://www.sdut.edu.cn';
  const DEADLINE = '30 December 2026 (March 2027 Intake)';
  const MAJORS = [
    ['Mechanical Design, Manufacturing and Automation', 'Mechanical Engineering'],
    ['Computer Science and Technology', 'Computer Science & Engineering'],
    ['International Economics and Trade', 'Business & International Trade'],
    ['Civil Engineering', 'Civil Engineering'],
    ['Electrical Engineering and Automation', 'Electrical Engineering'],
    ['Energy and Power Engineering (Vehicle Engine)', 'Energy & Automotive Engineering'],
    ['Business English', 'Languages & Business Communication'],
    ['Resource Exploration Engineering', 'Geology & Mining Engineering'],
  ];
  const ELIG = [
    'Completed secondary education (High School Diploma / Secondary School Certificate or international equivalent)',
    'Age 18–25',
    'No entrance exam and no interview',
    'Eligible regions: applicants from Asia and North Africa',
    'Valid CSCA score required before June 2027 to start the bachelor degree',
  ];
  const base = {
    name: 'Shandong University of Technology',
    location: 'Zibo, Shandong, China',
    country: 'China',
    city: 'Zibo',
    intake: 'March, September',
    degree: 'Bachelor, Language',
    taught: 'English, Chinese',
    rankingWorld: 801,
    majors: MAJORS.map(m => m[0]).join(', '),
    tuition: 'Bachelor CNY 12,000 / year; Language CNY 5,000 / semester; quad room free',
    tuitionDetails: JSON.stringify([
      'Chinese language semester (March–July 2027): CNY 5,000 / semester',
      'English-taught bachelor (from September 2027): CNY 12,000 / year',
      'Four-person (quad) dormitory: FREE',
      'Optional double room: CNY 5,200 / year; single room: CNY 10,400 / year',
    ]),
    documents: JSON.stringify([...STD_DOCS, 'CSCA score report (before June 2027 for bachelor entry)']),
    deadlineApplication: DEADLINE,
    deadlineStartDate: 'March 2027',
    notes: JSON.stringify([
      'Shandong University of Technology (山东理工大学, SDUT) is a comprehensive public university in Zibo, Shandong, founded in 1956 and listed in the ShanghaiRanking ARWU World #801–900 band.',
      'March 2027: 4.5-year pathway — one Chinese language semester followed by a 4-year English-taught bachelor.',
      'Free four-person accommodation throughout; no entrance exam or interview.',
      'A valid CSCA score is required before June 2027 to start the bachelor degree.',
      'Eligible regions for this intake: Asia and North Africa. Age 18–25.',
    ]),
    badges: JSON.stringify(['Free Accommodation', 'March Intake', 'English Taught', 'No Interview', 'ARWU Ranked']),
    logo: '/images/universities/logos/shandong-university-of-technology.webp',
    isActive: true,
    officialUrl: OFFICIAL,
    aliases: JSON.stringify(['SDUT', 'Shandong University of Technology', '山东理工大学', 'Shangdong University of Technology', 'Shandong Univ of Tech']),
    legacySlugs: JSON.stringify(['sdut']),
    relationshipType: 'authorized_representative',
    verificationStatus: 'verified',
    recognitionAuthority: 'Shandong Provincial Department of Education & Ministry of Education of the PRC',
    recognitionSourceUrl: 'https://www.moe.gov.cn/',
    sourceUrls: JSON.stringify([OFFICIAL, 'https://www.shanghairanking.com/universities/shandong-university-of-technology']),
    lastVerifiedAt: now(),
  };
  const uni = await prisma.university.upsert({
    where: { slug: 'shandong-university-of-technology' },
    update: base,
    create: { slug: 'shandong-university-of-technology', ...base },
  });

  await upsertPrograms(uni.id, [
    {
      name: 'Chinese Language (Pre-Bachelor Semester)',
      level: 'Language',
      subject: 'Chinese Language',
      languages: 'Chinese',
      duration: '0.5 year (1 semester)',
      intakes: 'March 2027',
      tuition: '5,000 CNY/Semester',
      tuitionAfterScholarship: '5,000 CNY/Semester (quad room free)',
      applicationDeadline: DEADLINE,
      eligibility: ELIG,
      sourceUrl: OFFICIAL,
    },
    ...MAJORS.map(([name, subject]) => ({
      name,
      level: 'Bachelor',
      subject,
      languages: 'English',
      duration: '4.5 years (0.5 language + 4 bachelor)',
      intakes: 'March 2027 (language) → September 2027 (bachelor)',
      tuition: '12,000 CNY/Year',
      tuitionAfterScholarship: '12,000 CNY/Year (quad room free)',
      applicationDeadline: DEADLINE,
      eligibility: ELIG,
      sourceUrl: OFFICIAL,
    })),
  ]);
  await upsertFees(uni.id, [
    { item: 'Chinese Language Tuition', cost: '5,000 CNY/Semester', notes: 'March 2027 language semester' },
    { item: 'English-taught Bachelor Tuition', cost: '12,000 CNY/Year', notes: '4 years from September 2027' },
    { item: 'Four-Person Dormitory', cost: 'Free', notes: 'Quad room provided free of charge' },
    { item: 'Double Room (optional)', cost: '5,200 CNY/Year' },
    { item: 'Single Room (optional)', cost: '10,400 CNY/Year' },
  ], OFFICIAL);
  await upsertScholarship(uni.id, {
    title: 'SDUT Free Accommodation Award (March 2027)',
    type: 'Accommodation Waiver',
    details: ['Free four-person dormitory for language and bachelor study', 'No entrance exam or interview', 'Applicants from Asia and North Africa, age 18–25'],
    amount: 'Free quad-room accommodation',
    condition: 'Age 18–25; Asia or North Africa; valid CSCA score before June 2027 for bachelor entry.',
    eligiblePrograms: MAJORS.map(m => m[0]),
    coverage: 'Accommodation (four-person room)',
    deadline: DEADLINE,
    sourceUrl: OFFICIAL,
  });
  console.log('✓ SDUT upserted.');
  return {
    slug: 'shandong-university-of-technology',
    overview:
      'Shandong University of Technology (SDUT) is a comprehensive public university in Zibo, Shandong, founded in 1956 and ranked in the ShanghaiRanking ARWU World #801–900 band. For March 2027 it offers a 4.5-year pathway: one Chinese language semester (CNY 5,000) followed by a 4-year English-taught bachelor (CNY 12,000 / year) with free four-person accommodation.',
    highlights: [
      { title: 'Free Accommodation', description: 'Four-person dormitory provided free for the full study period.' },
      { title: 'No Exam, No Interview', description: 'Admission on documents; a CSCA score is needed before June 2027 to begin the bachelor.' },
      { title: '8 English-taught Majors', description: 'Engineering, computing, trade, business English and resource exploration.' },
    ],
    programs: MAJORS.map(([name], i) => ({
      id: `sdut-prog-${i + 1}`,
      name,
      level: 'Bachelor',
      languages: ['English'],
      duration: '4.5 years (0.5 language + 4 bachelor)',
      intake: 'March 2027',
      deadline: DEADLINE,
      qualifications: ELIG,
      languageRequirements: ['English-taught bachelor; Chinese language semester included'],
      documents: [...STD_DOCS, 'CSCA score report'],
      notes: ['Free quad-room accommodation'],
      fees: [
        { key: 'tuition', item: 'Bachelor Tuition', amount: 12000, currency: 'CNY', period: 'year', stage: 'in_china', displayAmount: 'CNY 12,000 / year' },
        { key: 'language', item: 'Language Semester', amount: 5000, currency: 'CNY', period: 'semester', stage: 'in_china', displayAmount: 'CNY 5,000 / semester' },
        { key: 'housing', item: 'Quad Dormitory', amount: 0, currency: 'CNY', period: 'year', stage: 'in_china', displayAmount: 'Free' },
      ],
    })),
  };
}

// ---------------------------------------------------------------- CAUC
async function seedCauc() {
  const OFFICIAL = 'https://www.cauc.edu.cn';
  const DEADLINE = '6 January 2027 (March 2027 Intake)';
  const uni = await prisma.university.findUnique({ where: { slug: 'civil-aviation-university-of-china' } });
  if (!uni) return null;
  const ELIG = [
    'Completed secondary education with minimum 60% overall marks',
    'Age 17–24',
    'English: IELTS 5.5 / TOEFL 70 / Duolingo 85',
    'No entrance exam or interview',
    'Open to all nationalities (no country restriction)',
  ];
  const notes = [...new Set([...(JSON.parse(uni.notes || '[]')), 'March 2027: half-year foundation (CNY 7,500/semester) with direct entry to English-taught bachelor; 1st/2nd-class scholarship eligibility after foundation. Deadline 6 January 2027.'])];
  await prisma.university.update({
    where: { id: uni.id },
    data: {
      intake: addIntake(uni.intake, 'March'),
      degree: uni.degree?.includes('Foundation') ? uni.degree : `${uni.degree || 'Bachelor'}, Foundation`,
      location: 'Tianjin, China',
      officialUrl: OFFICIAL,
      logo: '/images/universities/logos/civil-aviation-university-of-china.webp',
      deadlineApplication: `${DEADLINE} / September intake per university calendar`,
      notes: JSON.stringify(notes),
      lastVerifiedAt: now(),
    },
  });
  await upsertPrograms(uni.id, [{
    name: 'International Foundation Program (0.5 + 4 Bachelor Pathway)',
    level: 'Foundation',
    subject: 'Foundation → English-taught Bachelor',
    languages: 'English',
    duration: '0.5 year foundation + 4 years bachelor',
    intakes: 'March 2027',
    tuition: '7,500 CNY/Semester',
    tuitionAfterScholarship: '7,500 CNY/Semester (scholarship eligibility after foundation)',
    applicationDeadline: DEADLINE,
    eligibility: ELIG,
    sourceUrl: OFFICIAL,
  }]);
  await upsertFees(uni.id, [
    { item: 'Foundation Tuition', cost: '7,500 CNY/Semester', notes: 'March 2027 half-year foundation' },
    { item: 'Foundation Accommodation (Double Room)', cost: '3,000 CNY/Semester' },
    { item: 'Application Fee', cost: '400 CNY', notes: 'One-off' },
  ], OFFICIAL);
  await upsertScholarship(uni.id, {
    title: 'CAUC Bachelor Scholarship (1st / 2nd Class) after Foundation',
    type: 'Partial (Merit)',
    details: ['Eligible after completing the half-year foundation', 'First- or second-class award based on foundation results', 'Applies to English-taught bachelor study'],
    amount: '1st or 2nd class (per university assessment)',
    condition: 'Successful completion of the March 2027 foundation.',
    eligiblePrograms: ['English-taught bachelor programmes'],
    coverage: 'Tuition reduction per scholarship class',
    deadline: DEADLINE,
    sourceUrl: OFFICIAL,
  });
  console.log('✓ CAUC updated.');
  return {
    slug: 'civil-aviation-university-of-china',
    addProgram: {
      id: 'cauc-prog-foundation-2027',
      name: 'International Foundation Program (0.5 + 4 Bachelor Pathway)',
      level: 'Foundation',
      languages: ['English'],
      duration: '0.5 + 4 years',
      intake: 'March 2027',
      deadline: DEADLINE,
      qualifications: ELIG,
      languageRequirements: ['IELTS 5.5 / TOEFL 70 / Duolingo 85'],
      documents: [...STD_DOCS, 'English proficiency certificate'],
      notes: ['Direct entry to English-taught bachelor after foundation', '1st/2nd-class scholarship eligibility'],
      fees: [
        { key: 'tuition', item: 'Foundation Tuition', amount: 7500, currency: 'CNY', period: 'semester', stage: 'in_china', displayAmount: 'CNY 7,500 / semester' },
        { key: 'housing', item: 'Double Room', amount: 3000, currency: 'CNY', period: 'semester', stage: 'in_china', displayAmount: 'CNY 3,000 / semester' },
        { key: 'application', item: 'Application Fee', amount: 400, currency: 'CNY', period: 'once', stage: 'pre_arrival', displayAmount: 'CNY 400' },
      ],
    },
  };
}

// ---------------------------------------------------------------- Hechi
async function seedHechi() {
  const OFFICIAL = 'https://www.hcnu.edu.cn';
  const DEADLINE = '30 December 2026 (March 2027 Intake)';
  const uni = await prisma.university.findUnique({ where: { slug: 'hcnu' } });
  if (!uni) return null;
  const ELIG = ['Completed secondary education', 'Age 18–25', 'Beginners accepted (no prior Chinese required)', 'Open to all nationalities'];
  const notes = [...new Set([...(JSON.parse(uni.notes || '[]')), 'March 2027: 1.5-year intensive Chinese (to June 2028, targets HSK 5) — CNY 9,000 tuition + CNY 3,000 quad room for the full period; 0.5-year option CNY 3,000 + CNY 1,500. Deadline 30 December 2026.'])];
  await prisma.university.update({
    where: { id: uni.id },
    data: {
      intake: addIntake(uni.intake, 'March'),
      degree: uni.degree?.includes('Language') ? uni.degree : `${uni.degree || 'Bachelor'}, Language`,
      logo: '/images/universities/logos/hechi-university.webp',
      deadlineApplication: `${DEADLINE} / September intake per university calendar`,
      notes: JSON.stringify(notes),
      lastVerifiedAt: now(),
    },
  });
  await upsertPrograms(uni.id, [
    {
      name: 'Intensive Chinese Language Program (1.5 Years, HSK 5 Track)',
      level: 'Language',
      subject: 'Chinese Language',
      languages: 'Chinese',
      duration: '1.5 years (March 2027 – June 2028)',
      intakes: 'March 2027',
      tuition: '9,000 CNY total (1.5 years)',
      tuitionAfterScholarship: '9,000 CNY total; CNY 1,000/year merit award if score > 80%',
      applicationDeadline: DEADLINE,
      eligibility: ELIG,
      sourceUrl: OFFICIAL,
    },
    {
      name: 'Chinese Language Program (0.5 Year)',
      level: 'Language',
      subject: 'Chinese Language',
      languages: 'Chinese',
      duration: '0.5 year (1 semester)',
      intakes: 'March 2027',
      tuition: '3,000 CNY total (0.5 year)',
      tuitionAfterScholarship: '3,000 CNY total',
      applicationDeadline: DEADLINE,
      eligibility: ELIG,
      sourceUrl: OFFICIAL,
    },
  ]);
  await upsertFees(uni.id, [
    { item: 'Chinese Language Tuition (1.5 Years)', cost: '9,000 CNY total', notes: 'March 2027 – June 2028' },
    { item: 'Accommodation, Quad Room (1.5 Years)', cost: '3,000 CNY total' },
    { item: 'Chinese Language Tuition (0.5 Year)', cost: '3,000 CNY total' },
    { item: 'Accommodation, Quad Room (0.5 Year)', cost: '1,500 CNY total' },
  ], OFFICIAL);
  await upsertScholarship(uni.id, {
    title: 'Hechi University Chinese Language Merit Scholarship',
    type: 'Partial (Merit)',
    details: ['CNY 1,000 per year', 'Awarded after the first semester', 'Requires a semester score above 80%'],
    amount: 'CNY 1,000 / year',
    condition: 'First-semester score above 80%.',
    eligiblePrograms: ['Intensive Chinese Language Program (1.5 Years, HSK 5 Track)'],
    coverage: 'Cash / tuition credit of CNY 1,000 per year',
    deadline: DEADLINE,
    sourceUrl: OFFICIAL,
  });
  console.log('✓ Hechi University updated.');
  return {
    slug: 'hcnu',
    addProgram: {
      id: 'hechi-prog-language-1-5yr',
      name: 'Intensive Chinese Language Program (1.5 Years, HSK 5 Track)',
      level: 'Language',
      languages: ['Chinese'],
      duration: '1.5 years',
      intake: 'March 2027',
      deadline: DEADLINE,
      qualifications: ELIG,
      languageRequirements: ['Beginners accepted'],
      documents: STD_DOCS,
      notes: ['Targets HSK 5', '0.5-year option available (CNY 3,000 + CNY 1,500 room)'],
      fees: [
        { key: 'tuition', item: 'Tuition (full 1.5 years)', amount: 9000, currency: 'CNY', period: 'program', stage: 'in_china', displayAmount: 'CNY 9,000 total' },
        { key: 'housing', item: 'Quad Room (full 1.5 years)', amount: 3000, currency: 'CNY', period: 'program', stage: 'in_china', displayAmount: 'CNY 3,000 total' },
      ],
    },
  };
}

async function main() {
  const sdutProfile = await seedSdut();
  const cauc = await seedCauc();
  const hechi = await seedHechi();

  const record = await prisma.intakeCampaign.findUnique({ where: { slug: 'university-profile-details' } });
  if (!record) return;
  const parsed = JSON.parse(record.contentJson);
  parsed.universities = parsed.universities || [];
  const list = parsed.universities;

  const i = list.findIndex(u => u.slug === sdutProfile.slug);
  if (i >= 0) list[i] = { ...list[i], ...sdutProfile };
  else list.push(sdutProfile);

  for (const extra of [cauc, hechi].filter(Boolean)) {
    let prof = list.find(u => u.slug === extra.slug);
    if (!prof) {
      prof = { slug: extra.slug, programs: [] };
      list.push(prof);
    }
    prof.programs = (prof.programs || []).filter(p => p.id !== extra.addProgram.id);
    prof.programs.unshift(extra.addProgram);
  }
  await prisma.intakeCampaign.update({ where: { slug: 'university-profile-details' }, data: { contentJson: JSON.stringify(parsed) } });
  console.log('✓ March 2027 profile details saved (SDUT, CAUC, Hechi).');
}

main()
  .catch(e => {
    console.error('Error seeding March 2027 universities:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

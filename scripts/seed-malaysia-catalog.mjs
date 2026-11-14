import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const malaysiaUniversities = [
  {
    name: 'Universiti Malaya',
    slug: 'universiti-malaya',
    location: 'Kuala Lumpur, Malaysia',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    intake: 'October, March',
    degree: 'Bachelor, Master, PhD',
    taught: 'English',
    rankingWorld: 60,
    rankingCountry: 1,
    rankingNational: 1,
    majors: 'Computer Science, Engineering, Medicine, Business Administration, Economics',
    tuition: 'RM 12,000 – RM 28,000 / year (approx. BDT 3.2L – 7.5L/year)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport', 'SSC/HSC Marksheet & Certificate', 'IELTS 6.0/MOI', 'Passport Photo (Blue background per EMGS)', 'Health Declaration']),
    deadlineApplication: 'June 30 for October intake; November 30 for March intake',
    notes: JSON.stringify(['Malaysia top-ranked premier research university', 'Public research institution established in 1905', 'MQA and Ministry of Higher Education accredited']),
    badges: JSON.stringify(['Premier Research University', 'QS World Top 100', 'Public University']),
    officialUrl: 'https://www.um.edu.my',
    recognitionAuthority: 'Malaysian Qualifications Agency (MQA) & UGC Bangladesh',
    recognitionSourceUrl: 'https://www2.mqa.gov.my/mqr/',
    sourceUrls: JSON.stringify(['https://isc.um.edu.my', 'https://educationmalaysia.gov.my']),
    aliases: JSON.stringify(['UM', 'University of Malaya']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'direct_application',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'Bachelor of Computer Science (Artificial Intelligence)',
        subject: 'Computer Science',
        languages: 'English',
        duration: '3.5 Years',
        intakes: 'October',
        tuition: 'RM 18,500 / year (~BDT 4,99,500/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.50 or A-Levels with strong Mathematics', 'IELTS 6.0 or verified English MOI']),
        sourceUrl: 'https://fsktm.um.edu.my',
      },
      {
        level: 'Bachelor',
        name: 'Bachelor of Electrical Engineering',
        subject: 'Engineering',
        languages: 'English',
        duration: '4 Years',
        intakes: 'October',
        tuition: 'RM 20,000 / year (~BDT 5,40,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.50 with Physics and Mathematics', 'IELTS 6.0 or verified English MOI']),
        sourceUrl: 'https://eng.um.edu.my',
      },
      {
        level: 'Master',
        name: 'Master of Business Administration (MBA)',
        subject: 'Business',
        languages: 'English',
        duration: '1.5 Years',
        intakes: 'October, March',
        tuition: 'RM 32,000 total (~BDT 8,64,000)',
        eligibility: JSON.stringify(['Bachelor degree with minimum CGPA 3.00/4.00', '2 years work experience preferred']),
        sourceUrl: 'https://fbl.um.edu.my',
      },
    ],
    fees: [
      { item: 'EMGS Visa Processing Fee', cost: 'RM 1,800', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'eVAL & Student Pass Immigration Fee', cost: 'RM 250', recipient: 'Immigration Department of Malaysia', refundable: 'Non-refundable' },
      { item: 'Compulsory Medical Insurance', cost: 'RM 650 / year', recipient: 'EMGS Insurance Partner', refundable: 'Non-refundable' },
      { item: 'Post-Arrival Medical Screening', cost: 'RM 250', recipient: 'EMGS Approved Clinic', refundable: 'Non-refundable' },
      { item: 'On-Campus Accommodation (Residential College)', cost: 'RM 450 – RM 800 / month', recipient: 'University of Malaya', refundable: 'Per semester policy' },
      { item: 'Application Fee', cost: 'RM 300', recipient: 'University of Malaya', refundable: 'Non-refundable' },
    ],
    scholarships: [
      {
        title: 'Malaysian International Scholarship (MIS)',
        amount: '100% Tuition + Monthly Stipend',
        coverage: 'Full tuition waiver, airfare, book allowance and RM 1,500/month stipend for postgraduates',
        type: 'Government',
        condition: 'First-class Honours / minimum CGPA 3.50 in Bachelor',
        details: JSON.stringify(['Ministry of Higher Education Malaysia Portal application', 'Annual CGPA evaluation']),
        eligiblePrograms: JSON.stringify(['Master of Business Administration (MBA)', 'Master of Science', 'PhD']),
      },
    ],
  },
  {
    name: 'Universiti Teknologi Malaysia',
    slug: 'universiti-teknologi-malaysia',
    location: 'Skudai, Johor & Kuala Lumpur, Malaysia',
    city: 'Johor Bahru',
    country: 'Malaysia',
    intake: 'September, February',
    degree: 'Bachelor, Master, PhD',
    taught: 'English',
    rankingWorld: 181,
    rankingCountry: 2,
    rankingNational: 2,
    majors: 'Engineering, Computing, Architecture, Applied Sciences, Management',
    tuition: 'RM 10,000 – RM 22,000 / year (approx. BDT 2.7L – 5.9L/year)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport', 'Academic Transcripts', 'IELTS 5.5–6.0 or MOI', 'Photo (White/Blue background per EMGS)', 'Medical Exam Report']),
    deadlineApplication: 'July 15 for September intake; December 15 for February intake',
    notes: JSON.stringify(['Leading engineering & technology public university in Malaysia', 'High graduate employability and research output', 'MQA accredited']),
    badges: JSON.stringify(['Premier Engineering Hub', 'QS Top 200', 'Public University']),
    officialUrl: 'https://www.utm.my',
    recognitionAuthority: 'Malaysian Qualifications Agency (MQA)',
    recognitionSourceUrl: 'https://www2.mqa.gov.my/mqr/',
    sourceUrls: JSON.stringify(['https://admission.utm.my']),
    aliases: JSON.stringify(['UTM']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'direct_application',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'Bachelor of Engineering (Mechanical)',
        subject: 'Engineering',
        languages: 'English',
        duration: '4 Years',
        intakes: 'September',
        tuition: 'RM 14,000 / year (~BDT 3,78,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.00 with Physics and Math', 'IELTS 5.5 or MOI']),
        sourceUrl: 'https://engineering.utm.my',
      },
      {
        level: 'Bachelor',
        name: 'Bachelor of Computer Science (Software Engineering)',
        subject: 'Computer Science',
        languages: 'English',
        duration: '4 Years',
        intakes: 'September, February',
        tuition: 'RM 13,500 / year (~BDT 3,64,500/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.00 with Math', 'IELTS 5.5 or MOI']),
        sourceUrl: 'https://computing.utm.my',
      },
    ],
    fees: [
      { item: 'EMGS Processing Fee', cost: 'RM 1,800', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'eVAL & Student Pass Fee', cost: 'RM 250', recipient: 'Immigration Malaysia', refundable: 'Non-refundable' },
      { item: 'Compulsory Medical Insurance', cost: 'RM 600 / year', recipient: 'EMGS Insurance Partner', refundable: 'Non-refundable' },
      { item: 'Hostel Accommodation (On-Campus)', cost: 'RM 350 – RM 600 / month', recipient: 'UTM Student Housing', refundable: 'Per semester' },
      { item: 'Application Fee', cost: 'RM 200', recipient: 'UTM', refundable: 'Non-refundable' },
    ],
    scholarships: [
      {
        title: 'UTM Young Scholars Award',
        amount: 'Up to 30% Tuition Reduction',
        coverage: 'Merit-based partial fee waiver for top international applicants',
        type: 'University Merit',
        condition: 'HSC GPA 5.0 or 3 A-Levels with grades AAA',
        details: JSON.stringify(['Maintain CGPA 3.60 annually', 'Faculty scholarship committee interview']),
        eligiblePrograms: JSON.stringify(['Bachelor of Engineering (Mechanical)', 'Bachelor of Computer Science (Software Engineering)']),
      },
    ],
  },
  {
    name: 'Asia Pacific University of Technology & Innovation',
    slug: 'asia-pacific-university',
    location: 'Technology Park Malaysia, Kuala Lumpur',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    intake: 'March, May, July, September, November',
    degree: 'Foundation, Diploma, Bachelor, Master',
    taught: 'English',
    rankingWorld: 600,
    rankingCountry: 12,
    rankingNational: 12,
    majors: 'Information Technology, Cybersecurity, AI, Software Engineering, Business, FinTech',
    tuition: 'RM 24,000 – RM 32,000 / year (approx. BDT 6.4L – 8.6L/year)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport Copy', 'SSC & HSC Transcripts', 'Passport Photos (White background)', 'EMGS Health Form', 'English Proficiency Proof (MOI accepted)']),
    deadlineApplication: 'Rolling admissions; apply 6–8 weeks before intake month',
    notes: JSON.stringify(['Premier Digital Tech Institution awarded by MDEC', 'Dual Degree option with De Montfort University (DMU), UK', '100% graduate employment track record']),
    badges: JSON.stringify(['Premier Digital Tech University', 'UK Dual Degree Option', 'High Tech Campus']),
    officialUrl: 'https://www.apu.edu.my',
    recognitionAuthority: 'MQA & De Montfort University UK (Dual Degree)',
    recognitionSourceUrl: 'https://www2.mqa.gov.my/mqr/',
    sourceUrls: JSON.stringify(['https://www.apu.edu.my/fees']),
    aliases: JSON.stringify(['APU', 'APIIT']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'partner_institution',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'BSc (Hons) in Computer Science (Cyber Security)',
        subject: 'Cybersecurity',
        languages: 'English',
        duration: '3 Years',
        intakes: 'March, May, September, November',
        tuition: 'RM 28,500 / year (~BDT 7,69,500/yr)',
        eligibility: JSON.stringify(['HSC GPA 3.50 or 2 C grades in A-Levels', 'English MOI accepted']),
        sourceUrl: 'https://www.apu.edu.my/our-courses',
      },
      {
        level: 'Bachelor',
        name: 'BSc (Hons) in Information Technology (Business Information Systems)',
        subject: 'Information Technology',
        languages: 'English',
        duration: '3 Years',
        intakes: 'March, May, September, November',
        tuition: 'RM 26,000 / year (~BDT 7,02,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 3.50 with Mathematics', 'English MOI accepted']),
        sourceUrl: 'https://www.apu.edu.my/our-courses',
      },
      {
        level: 'Master',
        name: 'MSc in Data Science and Business Analytics',
        subject: 'Data Science',
        languages: 'English',
        duration: '1 Year',
        intakes: 'May, September, November',
        tuition: 'RM 38,000 total (~BDT 10,26,000)',
        eligibility: JSON.stringify(['Relevant Bachelor degree with CGPA 2.75/4.00']),
        sourceUrl: 'https://www.apu.edu.my/postgraduate',
      },
    ],
    fees: [
      { item: 'EMGS Processing & Student Pass Fee', cost: 'RM 2,200', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'International Student Registration Fee', cost: 'RM 2,000', recipient: 'APU Malaysia', refundable: 'Non-refundable' },
      { item: 'On-Campus Premium Hostel (En-suite Twin/Single)', cost: 'RM 750 – RM 1,400 / month', recipient: 'APU Accommodation Office', refundable: 'Deposit refundable' },
      { item: 'Medical Insurance (Annual)', cost: 'RM 600 / year', recipient: 'EMGS Partner', refundable: 'Non-refundable' },
      { item: 'Refundable Security Deposit', cost: 'RM 1,500', recipient: 'APU Malaysia', refundable: 'Fully refundable upon graduation' },
    ],
    scholarships: [
      {
        title: 'APU International Student Merit Scholarship',
        amount: '15% – 30% Tuition Waiver',
        coverage: 'Merit discount deducted directly from annual tuition for students with GPA 4.5+ or A-Level ABB',
        type: 'Institutional Merit',
        condition: 'High academic score at HSC / A-Levels; maintains CGPA 3.25+ at APU',
        details: JSON.stringify(['GPA 4.50 = 15% discount', 'GPA 4.80 = 20% discount', 'GPA 5.00 = 30% discount']),
        eligiblePrograms: JSON.stringify(['BSc (Hons) in Computer Science (Cyber Security)', 'BSc (Hons) in Information Technology (Business Information Systems)']),
      },
    ],
  },
  {
    name: 'Taylor\'s University',
    slug: 'taylors-university',
    location: 'Subang Jaya, Selangor, Malaysia',
    city: 'Subang Jaya',
    country: 'Malaysia',
    intake: 'January, March, August',
    degree: 'Foundation, Diploma, Bachelor, Master, PhD',
    taught: 'English',
    rankingWorld: 251,
    rankingCountry: 5,
    rankingNational: 5,
    majors: 'Hospitality & Leisure Management, Business, Architecture, Pharmacy, Law, Media',
    tuition: 'RM 32,000 – RM 48,000 / year (approx. BDT 8.6L – 13.0L/year)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport', 'SSC/HSC Marksheet & Certificate', 'IELTS 6.0/MOI', 'Photo (White background)', 'Statement of Purpose']),
    deadlineApplication: '6 weeks prior to intake start date',
    notes: JSON.stringify(['#1 Private University in Southeast Asia for 4 consecutive years', 'World Top 20 for Hospitality Management', 'State of the art Lakeside Campus']),
    badges: JSON.stringify(['#1 Private University', 'World Top 20 Hospitality', 'Lakeside Campus']),
    officialUrl: 'https://university.taylors.edu.my',
    recognitionAuthority: 'MQA Accredited',
    recognitionSourceUrl: 'https://www2.mqa.gov.my/mqr/',
    sourceUrls: JSON.stringify(['https://university.taylors.edu.my/en/study/undergraduate.html']),
    aliases: JSON.stringify(['Taylor\'s', 'Taylors University']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'partner_institution',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'Bachelor of International Hospitality Management (Hons)',
        subject: 'Hospitality',
        languages: 'English',
        duration: '3 Years',
        intakes: 'March, August',
        tuition: 'RM 36,000 / year (~BDT 9,72,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 3.50 or 2 Principal Passes in A-Levels', 'IELTS 6.0 or MOI']),
        sourceUrl: 'https://university.taylors.edu.my',
      },
      {
        level: 'Bachelor',
        name: 'Bachelor of Business (Hons)',
        subject: 'Business',
        languages: 'English',
        duration: '3 Years',
        intakes: 'January, March, August',
        tuition: 'RM 34,500 / year (~BDT 9,31,500/yr)',
        eligibility: JSON.stringify(['HSC GPA 3.50 or A-Levels', 'IELTS 6.0 or MOI']),
        sourceUrl: 'https://university.taylors.edu.my',
      },
    ],
    fees: [
      { item: 'EMGS Processing & Visa Approval Letter Fee', cost: 'RM 2,100', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'International Student Enrolment Fee', cost: 'RM 2,800', recipient: 'Taylor\'s University', refundable: 'Non-refundable' },
      { item: 'Lakeside Hostel Accommodation (U-Residence)', cost: 'RM 850 – RM 1,600 / month', recipient: 'Taylor\'s Hostel Management', refundable: 'Deposit refundable' },
      { item: 'Medical Insurance (Annual)', cost: 'RM 650 / year', recipient: 'EMGS Partner', refundable: 'Non-refundable' },
    ],
    scholarships: [
      {
        title: 'Taylor\'s Distinction Award',
        amount: 'Up to RM 15,000 / year',
        coverage: 'Merit-based tuition discount applied across the degree duration',
        type: 'University Merit',
        condition: 'High academic profile (HSC GPA 4.80+ or A-Level AAB); interview required',
        details: JSON.stringify(['Portfolio and extracurricular leadership review', 'Maintain minimum CGPA 3.40 annually']),
        eligiblePrograms: JSON.stringify(['Bachelor of International Hospitality Management (Hons)', 'Bachelor of Business (Hons)']),
      },
    ],
  },
  {
    name: 'Monash University Malaysia',
    slug: 'monash-university-malaysia',
    location: 'Bandar Sunway, Selangor, Malaysia',
    city: 'Sunway',
    country: 'Malaysia',
    intake: 'February, July, October',
    degree: 'Bachelor, Master, PhD',
    taught: 'English',
    rankingWorld: 42,
    rankingCountry: 1,
    rankingNational: 1,
    majors: 'Business, Engineering, IT, Medicine, Pharmacy, Arts & Social Sciences',
    tuition: 'RM 44,000 – RM 58,000 / year (approx. BDT 11.9L – 15.6L/year; 1/3 of Australian campus cost)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport', 'A-Level / HSC Transcripts', 'IELTS 6.5 (min 6.0 each band)', 'Health Declaration', 'Passport Photos']),
    deadlineApplication: 'May 31 for July intake; November 30 for February intake',
    notes: JSON.stringify(['Australian Group of Eight (Go8) Premier University Branch Campus', 'Exact same internationally recognized Australian testamur/degree issued', 'Option to transfer to Melbourne campus after 1 or 2 years']),
    badges: JSON.stringify(['Australian Group of Eight (Go8)', 'QS World Top 50', 'Australia Transfer Option']),
    officialUrl: 'https://www.monash.edu.my',
    recognitionAuthority: 'TEQSA (Australia) & MQA (Malaysia)',
    recognitionSourceUrl: 'https://www.monash.edu.my/about/accreditations',
    sourceUrls: JSON.stringify(['https://www.monash.edu.my/study/courses']),
    aliases: JSON.stringify(['Monash Malaysia', 'Monash Sunway']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'direct_application',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'Bachelor of Computer Science',
        subject: 'Computer Science',
        languages: 'English',
        duration: '3 Years',
        intakes: 'February, July, October',
        tuition: 'RM 46,000 / year (~BDT 12,42,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.80 or A-Levels with strong Math background', 'IELTS 6.5']),
        sourceUrl: 'https://www.monash.edu.my',
      },
      {
        level: 'Bachelor',
        name: 'Bachelor of Business and Commerce',
        subject: 'Business',
        languages: 'English',
        duration: '3 Years',
        intakes: 'February, July, October',
        tuition: 'RM 43,500 / year (~BDT 11,74,500/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.50 or A-Levels with Math/English', 'IELTS 6.5']),
        sourceUrl: 'https://www.monash.edu.my',
      },
    ],
    fees: [
      { item: 'EMGS Processing & Immigration Fee', cost: 'RM 2,250', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'Application Processing Fee', cost: 'RM 100', recipient: 'Monash University Malaysia', refundable: 'Non-refundable' },
      { item: 'Student Amenities & General Service Fee', cost: 'RM 400 / year', recipient: 'Monash Malaysia', refundable: 'Non-refundable' },
      { item: 'Sunway Condominium / Hostel Accommodation', cost: 'RM 800 – RM 1,800 / month', recipient: 'Housing Provider', refundable: 'Deposit refundable' },
      { item: 'Hospitalisation & Surgical Insurance', cost: 'RM 650 / year', recipient: 'Monash Insurance Partner', refundable: 'Non-refundable' },
    ],
    scholarships: [
      {
        title: 'Monash High Achiever Award',
        amount: 'RM 5,000 / semester (RM 10,000 / year)',
        coverage: 'Merit fee reduction for students maintaining distinction grades',
        type: 'University Excellence',
        condition: 'Top academic score upon entry; maintains 75% average each semester',
        details: JSON.stringify(['Automatic consideration upon offer issuance', 'Applied to all undergraduate semesters']),
        eligiblePrograms: JSON.stringify(['Bachelor of Computer Science', 'Bachelor of Business and Commerce']),
      },
    ],
  },
  {
    name: 'University of Nottingham Malaysia',
    slug: 'university-of-nottingham-malaysia',
    location: 'Semenyih, Selangor, Malaysia',
    city: 'Semenyih',
    country: 'Malaysia',
    intake: 'September, February',
    degree: 'Foundation, Bachelor, Master, PhD',
    taught: 'English',
    rankingWorld: 108,
    rankingCountry: 3,
    rankingNational: 3,
    majors: 'Engineering, Computer Science, Economics, Pharmacy, Biosciences, International Relations',
    tuition: 'RM 42,000 – RM 56,000 / year (approx. BDT 11.3L – 15.1L/year; 1/3 of UK tuition fee)',
    tuitionDetails: JSON.stringify({ currency: 'MYR', bdtMultiplier: 27 }),
    documents: JSON.stringify(['Passport', 'SSC/HSC & A-Level Marksheets', 'IELTS 6.5 or GCSE English grade C/MOI', 'Passport Photos', 'Reference Letter']),
    deadlineApplication: 'July 15 for September intake; December 1 for February intake',
    notes: JSON.stringify(['UK Russell Group Premier University Branch Campus established in 2000', 'Awarded same British degree certificate as Nottingham UK campus', 'Inter-campus exchange to UK and China campuses']),
    badges: JSON.stringify(['UK Russell Group Branch', 'QS World Top 110', 'Inter-Campus Exchange']),
    officialUrl: 'https://www.nottingham.edu.my',
    recognitionAuthority: 'Quality Assurance Agency for Higher Education (UK) & MQA (Malaysia)',
    recognitionSourceUrl: 'https://www.nottingham.edu.my/about',
    sourceUrls: JSON.stringify(['https://www.nottingham.edu.my/study']),
    aliases: JSON.stringify(['UNM', 'Nottingham Malaysia']),
    legacySlugs: JSON.stringify([]),
    relationshipType: 'direct_application',
    verificationStatus: 'verified',
    programs: [
      {
        level: 'Bachelor',
        name: 'BEng (Hons) in Chemical Engineering',
        subject: 'Engineering',
        languages: 'English',
        duration: '3 Years',
        intakes: 'September',
        tuition: 'RM 51,000 / year (~BDT 13,77,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.50 with Math and Chemistry', 'IELTS 6.5']),
        sourceUrl: 'https://www.nottingham.edu.my',
      },
      {
        level: 'Bachelor',
        name: 'BSc (Hons) in Economics and International Economics',
        subject: 'Economics',
        languages: 'English',
        duration: '3 Years',
        intakes: 'September',
        tuition: 'RM 44,000 / year (~BDT 11,88,000/yr)',
        eligibility: JSON.stringify(['HSC GPA 4.50 in Business or Science', 'IELTS 6.5']),
        sourceUrl: 'https://www.nottingham.edu.my',
      },
    ],
    fees: [
      { item: 'EMGS Processing & Visa Approval Letter', cost: 'RM 2,200', recipient: 'EMGS Malaysia', refundable: 'Non-refundable' },
      { item: 'On-Campus Student Village Hall of Residence', cost: 'RM 450 – RM 850 / month', recipient: 'Nottingham Student Accommodation', refundable: 'Deposit refundable' },
      { item: 'Compulsory Medical Insurance', cost: 'RM 650 / year', recipient: 'EMGS Partner', refundable: 'Non-refundable' },
      { item: 'Application Fee', cost: 'RM 200', recipient: 'University of Nottingham Malaysia', refundable: 'Non-refundable' },
    ],
    scholarships: [
      {
        title: 'Nottingham High Achiever Award',
        amount: '25% Tuition Fee Waiver',
        coverage: '25% reduction for first-year tuition for academic high achievers',
        type: 'University Excellence',
        condition: 'HSC GPA 5.0 or A-Levels with grades A*AA',
        details: JSON.stringify(['Applied automatically upon offer acceptance', 'Renewable subject to 70% average']),
        eligiblePrograms: JSON.stringify(['BEng (Hons) in Chemical Engineering', 'BSc (Hons) in Economics and International Economics']),
      },
    ],
  },
];

async function main() {
  console.log(`Seeding ${malaysiaUniversities.length} verified Malaysia universities...`);
  let unisCreated = 0;
  let programsCreated = 0;
  let feesCreated = 0;
  let scholarshipsCreated = 0;
  let costPlansCreated = 0;

  for (const item of malaysiaUniversities) {
    const { programs, fees, scholarships, ...uniData } = item;

    const uni = await prisma.university.upsert({
      where: { slug: uniData.slug },
      update: {
        ...uniData,
        lastVerifiedAt: new Date('2026-11-14T00:00:00Z'),
        verificationExpiresAt: new Date('2027-04-15T00:00:00Z'),
        isActive: true,
      },
      create: {
        ...uniData,
        lastVerifiedAt: new Date('2026-11-14T00:00:00Z'),
        verificationExpiresAt: new Date('2027-04-15T00:00:00Z'),
        isActive: true,
      },
    });
    unisCreated++;

    // Clear old programs/fees/scholarships for clean idempotence
    await prisma.program.deleteMany({ where: { universityId: uni.id } });
    await prisma.fee.deleteMany({ where: { universityId: uni.id } });
    await prisma.scholarship.deleteMany({ where: { universityId: uni.id } });
    await prisma.costPlan.deleteMany({ where: { universityId: uni.id } });

    const createdPrograms = [];
    for (const prog of programs) {
      const p = await prisma.program.create({
        data: {
          universityId: uni.id,
          ...prog,
        },
      });
      createdPrograms.push(p);
      programsCreated++;
    }

    const createdFees = [];
    for (const fee of fees) {
      const f = await prisma.fee.create({
        data: {
          universityId: uni.id,
          ...fee,
          validFor: '2026/2027 Academic Year',
        },
      });
      createdFees.push(f);
      feesCreated++;
    }

    const createdScholarships = [];
    for (const s of scholarships) {
      const schol = await prisma.scholarship.create({
        data: {
          universityId: uni.id,
          ...s,
          status: 'active',
        },
      });
      createdScholarships.push(schol);
      scholarshipsCreated++;
    }

    // Create ClearCost Plan for each program
    for (const prog of createdPrograms) {
      const schol = createdScholarships[0];
      const appFee = createdFees.find(f => /application|enrolment/i.test(f.item))?.cost || null;
      const emgsFee = createdFees.find(f => /emgs|visa/i.test(f.item))?.cost || null;
      const hostelFee = createdFees.find(f => /hostel|accommodation/i.test(f.item))?.cost || null;
      const insFee = createdFees.find(f => /insurance/i.test(f.item))?.cost || null;

      await prisma.costPlan.create({
        data: {
          universityId: uni.id,
          programId: prog.id,
          scholarshipId: schol?.id || null,
          title: `${prog.name} ClearCost Plan`,
          programName: prog.name,
          scholarshipTitle: schol?.title || null,
          intake: prog.intakes.split(',')[0]?.trim() || 'Current intake',
          currency: 'MYR',
          tuitionBeforeScholarship: prog.tuition,
          scholarshipValue: schol?.amount || null,
          tuitionAfterScholarship: schol ? 'Subject to scholarship award' : prog.tuition,
          applicationFee: appFee,
          hostel: hostelFee,
          insurance: insFee,
          visa: emgsFee,
          serviceFee: 'Defined in written agreement (EduExpress Malaysia package)',
          otherCosts: JSON.stringify(createdFees.map(f => `${f.item}: ${f.cost}`)),
          notes: JSON.stringify([
            'EMGS and Visa fees are payable directly to EMGS Malaysia.',
            'Tuition is payable directly to the institution per semester/year.',
            'Bank remittance must be executed through a Bangladesh Bank Authorized Dealer Student File.',
          ]),
          lastVerifiedAt: new Date('2026-11-14T00:00:00Z'),
          isPublished: true,
        },
      });
      costPlansCreated++;
    }
  }

  console.log(`\n=== Malaysia Seeding Complete ===`);
  console.log(`Universities Upserted: ${unisCreated}`);
  console.log(`Programs Created: ${programsCreated}`);
  console.log(`Fees Created: ${feesCreated}`);
  console.log(`Scholarships Created: ${scholarshipsCreated}`);
  console.log(`CostPlans Created: ${costPlansCreated}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

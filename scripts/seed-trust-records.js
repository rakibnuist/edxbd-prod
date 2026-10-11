const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.office.upsert({
    where: { slug: 'dhanmondi-decision-desk' },
    update: {
      name: 'EduExpress International Dhanmondi Office',
      address: 'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209',
      city: 'Dhaka',
      postalCode: '1209',
      phonePrimary: '+8801983333566',
      phoneSecondary: '+8801329663505',
      email: 'info@eduexpressint.com',
      hours: 'Saturday to Thursday, 11:00 AM to 6:00 PM',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=EduExpress+International+Dhanmondi+Dhaka',
      photoUrl: '/images/office/dhanmondi-reception.webp',
      isHeadOffice: true,
      isPublished: true,
      lastVerifiedAt: new Date('2026-08-03T00:00:00+06:00'),
    },
    create: {
      slug: 'dhanmondi-decision-desk',
      name: 'EduExpress International Dhanmondi Office',
      address: 'Evergreen Latif, House: 12/1, Road: 4/A, Ground Floor, Dhanmondi, Dhaka 1209',
      city: 'Dhaka',
      postalCode: '1209',
      phonePrimary: '+8801983333566',
      phoneSecondary: '+8801329663505',
      email: 'info@eduexpressint.com',
      hours: 'Saturday to Thursday, 11:00 AM to 6:00 PM',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=EduExpress+International+Dhanmondi+Dhaka',
      photoUrl: '/images/office/dhanmondi-reception.webp',
      isHeadOffice: true,
      isPublished: true,
      lastVerifiedAt: new Date('2026-08-03T00:00:00+06:00'),
    },
  });

  const metrics = [
    {
      key: 'admission_jw202_records', value: '100+', label: 'Admission notices and JW202 records on file',
      definition: 'Records held in the EduExpress application archive. Any public sample must be redacted before publication.',
      evidenceNote: 'Company archive count supplied by management.', displayOrder: 1, isPublished: true,
    },
    {
      key: 'china_university_collaborations', value: '134+', label: 'China university routes we work with',
      definition: 'University routes available through direct collaboration, authorization, study-group access, network access and other institutional channels. The relationship type varies by university and is confirmed in writing before application.',
      evidenceNote: 'Company relationship records supplied by management.', displayOrder: 2, isPublished: true,
    },
    {
      key: 'china_students_supported', value: '2000+', label: 'Students supported through B2C and B2B channels',
      definition: 'Combined operational count across EduExpress direct-to-student services and B2B institutional channels since 2018 through 2025. This is not presented as a direct-to-student success total.',
      evidenceNote: 'Company operational records supplied by management.', displayOrder: 3, isPublished: true,
    },
    {
      key: 'china_service_since', value: '2018', label: 'The year we started',
      definition: 'The year EduExpress began its recorded China education service operations.',
      evidenceNote: 'Company operational record supplied by management.', displayOrder: 4, isPublished: true,
    },
    {
      key: 'china_visa_success', value: '98%', label: 'Recorded China visa success through 2025',
      definition: 'Company-recorded China visa outcomes through 2025. Past performance does not predict an individual result.',
      evidenceNote: 'Keep private until the case denominator and calculation method are stored.', displayOrder: 5, isPublished: false,
    },
  ];

  for (const metric of metrics) {
    await prisma.trustMetric.upsert({
      where: { key: metric.key },
      update: { ...metric, lastVerifiedAt: new Date('2026-08-03T00:00:00+06:00') },
      create: { ...metric, lastVerifiedAt: new Date('2026-08-03T00:00:00+06:00') },
    });
  }

  const includedItems = [
    'Application fees until successful admission',
    'Admission Notice',
    'Scholarship assistance',
    'JW202 Form',
    'Visa application processing',
    'Embassy fee',
    'Medical checkup in Bangladesh',
    'Pre-departure briefing and travel guidance',
    'One-way air ticket',
    'Airport pickup',
  ];
  const excludedItems = [
    'University registration or seat deposit',
    'Tuition deposit required directly by the university',
    'Any university or third party amount not listed as included in the signed package schedule',
  ];
  const securityOptions = [
    'No upfront deposit: the student provides original academic documents and original passport as documented security, then pays the package after visa issuance',
    'BDT 15,000 deposit: the student retains the original documents, and the deposit is deducted from the final package price',
  ];
  const packageTerms = {
    destination: 'China',
    includedItems: JSON.stringify(includedItems),
    excludedItems: JSON.stringify(excludedItems),
    paymentTerms: 'No Success, No Service Charge. Route 1: no upfront deposit; original academic documents and passport are held as documented security and the package is paid after visa issuance. Route 2: the student deposits BDT 15,000, retains the original documents and deducts the deposit from the final package price. Any university deposit or other excluded third-party payment is itemized separately before the student proceeds.',
    refundTerms: 'If EduExpress fails to secure the contracted admission or visa outcome, the original documents are returned or the BDT 15,000 deposit is refunded unconditionally. University and third-party amounts follow the receiving organization’s refund rules and are recorded separately in the signed ClearCost schedule.',
    securityOptions: JSON.stringify(securityOptions),
    complianceNote: 'Original documents are accepted only under the student-selected no-deposit security route and must be recorded with a custody receipt and return procedure. Students using the BDT 15,000 deposit route retain their originals. EduExpress does not claim embassy authorization, special access or a guaranteed official decision.',
    isPublished: true,
  };
  const packages = [
    {
      slug: 'china-full-scholarship-package',
      title: 'Full Scholarship Service Package',
      packageType: 'full_scholarship',
      priceLabel: '2,00,000 BDT',
      summary: 'A complete China application and arrival support package for students pursuing a scholarship route.',
      outcomeScope: 'Used for a scholarship award that may cover 100% tuition, accommodation, a monthly stipend, or a stated combination according to the official award letter.',
      displayOrder: 1,
    },
    {
      slug: 'china-partial-scholarship-package',
      title: 'Partial Scholarship Service Package',
      packageType: 'partial_scholarship',
      priceLabel: 'Written route based quote',
      summary: 'A complete China application and arrival support package when the student pays part or all of tuition and other study costs.',
      outcomeScope: 'The scholarship award and the student paid tuition, accommodation and other costs are itemized together before the student proceeds.',
      displayOrder: 2,
    },
  ];
  for (const servicePackage of packages) {
    await prisma.servicePackage.upsert({
      where: { slug: servicePackage.slug },
      update: { ...packageTerms, ...servicePackage },
      create: { ...packageTerms, ...servicePackage },
    });
  }

  const team = [
    ['abdullah-al-rakib', 'Abdullah Al Rakib', 'Founder and China Strategy Lead', 'China and strategy', 'Guides education fit, China route strategy and institutional decisions.', ['China strategy', 'Education fit'], 1],
    ['mukta-rahaman', 'Mukta Rahaman', 'Student Counselor', 'Student counseling', 'Helps students and parents understand study options, timelines and next steps.', ['Student counseling', 'Parent conversations'], 2],
    ['jannatun-ema', 'Jannatun Ema', 'Student Guidance Executive', 'Student guidance', 'Supports document readiness and keeps applicants clear about what happens next.', ['Document readiness', 'Student support'], 3],
    ['md-tauhidul-islam-nur', 'Md Tauhidul Islam Nur', 'China Admissions Counselor', 'China admissions', 'Supports China program matching, application preparation and intake planning.', ['China admissions', 'Program matching'], 4],
    ['md-taj-ahmed', 'Md Taj Ahmed', 'Application Support Executive', 'Application support', 'Coordinates application records and helps students follow required steps.', ['Application records', 'Process support'], 5],
    ['md-abdullah-al-razib', 'Md Abdullah Al Razib', 'Student Services Executive', 'Student services', 'Assists students with service questions and pre-departure preparation.', ['Student services', 'Pre-departure'], 6],
  ];

  for (const [slug, name, role, shortRole, bio, specialties, displayOrder] of team) {
    await prisma.teamMember.upsert({
      where: { slug },
      update: { name, role, shortRole, bio, specialties: JSON.stringify(specialties), displayOrder, isPublished: true },
      create: { slug, name, role, shortRole, bio, specialties: JSON.stringify(specialties), displayOrder, isPublished: true },
    });
  }
}

main().finally(() => prisma.$disconnect());

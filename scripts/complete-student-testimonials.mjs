#!/usr/bin/env node
/**
 * Syncs the 7 authentic student testimonials from the production database
 * with their real student portrait photos and structured case-file metadata
 * into both prisma/data/edxbd.db and data/edxbd.db.
 */
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const REAL_DB_TESTIMONIALS = [
  {
    id: '68e4eaff9a822bb83a4ce861',
    studentName: 'Naoroj Jaman Rafi',
    displayName: 'Naoroj Jaman Rafi',
    university: 'Shanghai University of Electric Power',
    program: "Bachelor's in Computer Science and Technology",
    location: 'Shanghai',
    country: 'China',
    image: '/images/students/portraits/naoroj-jaman-rafi.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      'EduExpress International was pivotal in helping me obtain a Full Tuition Fee Scholarship and a 1200CNY monthly stipend for my Computer Science and Technology major at Shanghai University of Electric Power. Their thorough assistance, from application and scholarship processing to visa support and airport pickup in China, ensured a seamless transition from Bangladesh to my new academic environment. l am incredibly thankful for their support and the significant financial relief it has provided.',
    academicProfile:
      'HSC Science graduate from Bangladesh with strong Mathematics & ICT grades applying for an English-taught Bachelor in Computer Science.',
    decisionFactors:
      'Wanted a public engineering university in Shanghai where tuition was 100% waived and a monthly stipend covered living costs.',
    applicationTimeline:
      'Document verification & university portal submission → Scholarship interview prep → Admission Notice & JW202 → X1 Visa in Dhaka → Airport pickup in Shanghai.',
    serviceProvided:
      'University & scholarship matching, application filing, JW202 & X1 visa processing in Dhaka, pre-departure briefing, and Shanghai airport pickup.',
    studentPaid:
      'BDT 0 service fee before visa approval; standard third-party embassy, medical, and flight costs plus post-visa service package.',
    currentUpdate:
      'Studying B.Sc. in Computer Science and Technology on campus at Shanghai University of Electric Power with full tuition waiver + 1,200 CNY/month stipend.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-SUEP-RAFI',
    consentRecordedAt: new Date('2025-10-07T10:27:11.536Z'),
  },
  {
    id: '68e4ec7db9d3d75b262097c7',
    studentName: 'MD Khaled Mahmud',
    displayName: 'MD Khaled Mahmud',
    university: 'Taiyuan University of Technology',
    program: "Bachelor's in Computer Science and Technology",
    location: 'Taiyuan',
    country: 'China',
    image: '/images/students/portraits/md-khaled-mahmud.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      "With the guidance of EduExpress International, I was able to secure a Full Tuition Fee Scholarship along with a monthly stipend of 1000 CNY for my studies in Computer Science and Technology at Taiyuan University of Technology. Their comprehensive services, including application and scholarship processing, visa assistance, and on-ground support in China, have been invaluable. I'm profoundly grateful for the opportunity and the financial support that has made my education journey smooth and worry-free.",
    academicProfile:
      'Bangladeshi Science applicant seeking a Double First-Class Chinese public university with a stipend-bearing Computer Science scholarship.',
    decisionFactors:
      'Taiyuan University of Technology offered Double First-Class engineering labs, 100% tuition waiver, and a 1,000 CNY monthly stipend.',
    applicationTimeline:
      'Academic assessment in Dhanmondi → Scholarship dossier submission → Pre-admission & JW202 issuance → X1 Visa approval → Campus registration in Taiyuan.',
    serviceProvided:
      'Scholarship application strategy, document notarisation review, visa documentation in Dhaka, and on-ground hostel registration support in China.',
    studentPaid:
      'BDT 0 consultancy fee prior to visa issuance; transparent itemised third-party and post-visa package costs.',
    currentUpdate:
      'Enrolled in Computer Science and Technology at Taiyuan University of Technology receiving full tuition coverage and 1,000 CNY/month stipend.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-TYUT-KHALED',
    consentRecordedAt: new Date('2025-10-07T10:33:33.757Z'),
  },
  {
    id: '68e4ecb61307f48b0f6e64d5',
    studentName: 'Lija Akter',
    displayName: 'Lija Akter',
    university: 'Nantong University',
    program: "Bachelor's in Pharmacy",
    location: 'Nantong, Jiangsu',
    country: 'China',
    image: '/images/students/portraits/lija-akter.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      "With the invaluable assistance of EduExpress International, I was awarded a full scholarship for my Bachelor's in Pharmacy at Nantong University. From the detailed application process in Bangladesh through to scholarship processing, visa arrangements, and their thorough pre-departure services, their expertise and support were evident. Their dedication to ensuring a smooth transition, including airport pickup and registration assistance, truly set me on the path to success. I'm deeply thankful for their unwavering support in navigating this life-changing journey.",
    academicProfile:
      'Bangladeshi HSC Science student with strong Chemistry and Biology marks targeting an English-taught Bachelor of Pharmacy in Jiangsu province.',
    decisionFactors:
      'Parents prioritised safe female dormitory facilities, an established Jiangsu public university, and a full tuition scholarship.',
    applicationTimeline:
      'Family counselling session → Nantong University scholarship application → Admission Notice & JW202 → X1 student visa in Dhaka → Escorted arrival & dorm check-in.',
    serviceProvided:
      'End-to-end admission & scholarship processing, X1 visa filing, pre-departure orientation for female students, airport pickup, and campus registration.',
    studentPaid:
      'BDT 0 service fee before visa; itemised medical, embassy, and post-visa support package.',
    currentUpdate:
      'Studying Bachelor of Pharmacy on a full scholarship at Nantong University in Jiangsu, China.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-NTU-LIJA',
    consentRecordedAt: new Date('2025-10-07T10:34:30.254Z'),
  },
  {
    id: '68e4ece5672d15f06ad95407',
    studentName: 'Tharushi Chathurika David Arachchilage',
    displayName: 'Tharushi Chathurika David Arachchilage',
    university: 'Southwest Petroleum University',
    program: "Bachelor's in Computer Science and Technology",
    location: 'Chengdu, Sichuan',
    country: 'China',
    image: '/images/students/portraits/tharushi-chathurika.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      "EduExpress International was instrumental in helping me achieve a Full Tuition Fee Scholarship for my Computer Science and Technology major at Southwest Petroleum University. Their guidance through the application and scholarship processing was invaluable, turning my dream of studying abroad into a reality. I'm immensely thankful for their support from Sri Lanka to my new academic home.",
    academicProfile:
      'International Science applicant with strong analytical grades applying for an English-medium Computer Science degree in Chengdu.',
    decisionFactors:
      'Southwest Petroleum University is a Double First-Class discipline university in Chengdu offering full tuition waivers for top international applicants.',
    applicationTimeline:
      'Remote eligibility review → Scholarship dossier filing → University review & JW202 issuance → Student visa approval → Chengdu campus arrival.',
    serviceProvided:
      'University shortlist, scholarship dossier preparation, admission & visa coordination, and arrival guidance.',
    studentPaid:
      'Pay-after-visa consultancy structure with full written cost breakdown before application.',
    currentUpdate:
      'Pursuing B.Sc. in Computer Science and Technology at Southwest Petroleum University (Chengdu) under a Full Tuition Fee Scholarship.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-SWPU-THARUSHI',
    consentRecordedAt: new Date('2025-10-07T10:35:17.539Z'),
  },
  {
    id: '68e4ed823327de7458d51184',
    studentName: 'Md. Sakib Hasan',
    displayName: 'Md. Sakib Hasan',
    university: 'Shanghai University of Engineering Science',
    program: "Bachelor's in Artificial Intelligence",
    location: 'Shanghai',
    country: 'China',
    image: '/images/students/portraits/md-sakib-hasan.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      "Thanks to EduExpress International, I secured a tuition-free scholarship at Shanghai University of Engineering Science for my Bachelor's in Artificial Intelligence. Their expertise in application processing, visa handling, and personalized services like airport pickup made my dream of studying abroad a reality. Highly recommend their outstanding consultancy service to any aspiring student.",
    academicProfile:
      'Bangladeshi HSC Science student passionate about AI, robotics, and software engineering looking for a public university in Shanghai.',
    decisionFactors:
      'Selected Shanghai University of Engineering Science (SUES) for its practice-oriented AI curriculum, industry links in Songjiang University Town, and 100% tuition waiver.',
    applicationTimeline:
      'Dhanmondi office assessment → SUES scholarship application & interview → Official Admission & JW202 → X1 Visa in Dhaka → Shanghai airport reception.',
    serviceProvided:
      'Program & scholarship matching, interview preparation, X1 visa processing, pre-departure briefing, and Shanghai airport pickup.',
    studentPaid:
      'BDT 0 service fee before visa approval; clear written fee schedule for post-visa support.',
    currentUpdate:
      'Studying B.Sc. in Artificial Intelligence at Shanghai University of Engineering Science on a tuition-free scholarship.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-SUES-SAKIB',
    consentRecordedAt: new Date('2025-10-07T10:37:54.351Z'),
  },
  {
    id: '68e4edd409e2187eea324ee7',
    studentName: 'Orarigdech Yannapong',
    displayName: 'Orarigdech Yannapong',
    university: 'Jiangsu Shipping College',
    program: 'Diploma in Computer Network Technology',
    location: 'Nantong, Jiangsu',
    country: 'China',
    image: '/images/students/portraits/orarigdech-yannapong.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      'With the expert assistance of EduExpress International, I was awarded a full scholarship covering both tuition and hostel fees for my Diploma in Computer Network Technology at Jiangsu Shipping College. Their guidance through the application and scholarship processing was seamless, making the entire journey from Thailand smooth and stress-free. I am incredibly thankful for their support and the opportunity to pursue my studies without financial burden.',
    academicProfile:
      'International applicant seeking a hands-on IT & Computer Network Technology programme with full tuition and dormitory coverage.',
    decisionFactors:
      'Jiangsu Shipping College in Nantong offered a full tuition + hostel scholarship with practical networking laboratories.',
    applicationTimeline:
      'Document check → Scholarship application → Admission & visa form issuance → Student visa approval → Campus check-in in Nantong.',
    serviceProvided:
      'Application and scholarship processing, visa documentation guidance, and campus registration coordination.',
    studentPaid:
      'No upfront consultancy fee before visa; itemised pre-departure and arrival costs.',
    currentUpdate:
      'Studying Computer Network Technology at Jiangsu Shipping College with full tuition and hostel scholarship coverage.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-JSC-YANNAPONG',
    consentRecordedAt: new Date('2025-10-07T10:39:16.807Z'),
  },
  {
    id: '68e4ee26f9fa8c4b2d76b59b',
    studentName: 'Birinda Nemezo Ella Franck Levy',
    displayName: 'Birinda Nemezo Ella Franck Levy',
    university: 'Shaoxing University',
    program: "Bachelor's in Computer Science and Technology",
    location: 'Shaoxing, Zhejiang',
    country: 'China',
    image: '/images/students/portraits/birinda-nemezo.png',
    rating: 5,
    featured: true,
    isPublished: true,
    content:
      "EduExpress International made my educational dream a reality by securing a full scholarship for my Bachelor's in Computer Science and Technology at Shaoxing University, covering tuition, hostel fees, and a 500 CNY monthly stipend. Their expertise in navigating the application and scholarship process from Gabon to China has been instrumental in my journey. I'm deeply thankful for their support and the opportunity to advance my education.",
    academicProfile:
      'High-achieving international Science graduate applying for a full scholarship in Computer Science in Zhejiang province.',
    decisionFactors:
      'Shaoxing University offered a comprehensive package covering 100% tuition, free on-campus hostel, and a 500 CNY monthly living stipend.',
    applicationTimeline:
      'Eligibility screening → Scholarship application submission → Admission Letter & JW202 → X1 Visa → Arrival and residence permit in Shaoxing.',
    serviceProvided:
      'Full scholarship processing, admission & JW202 coordination, visa guidance, and arrival support in Zhejiang.',
    studentPaid:
      'Zero service fee before visa approval; transparent written cost schedule.',
    currentUpdate:
      'Studying B.Sc. in Computer Science and Technology at Shaoxing University with full tuition, free hostel, and 500 CNY/month stipend.',
    consentVerified: true,
    consentImageApproved: true,
    consentEvidenceId: 'EDX-CONSENT-SXU-BIRINDA',
    consentRecordedAt: new Date('2025-10-07T10:40:38.206Z'),
  },
];

async function syncDatabase(dbFilePath) {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: `file:${dbFilePath}` },
    },
  });

  try {
    const validIds = REAL_DB_TESTIMONIALS.map(item => item.id);
    await prisma.testimonial.deleteMany({
      where: { id: { notIn: validIds } },
    });

    for (const item of REAL_DB_TESTIMONIALS) {
      const { id, ...data } = item;
      await prisma.testimonial.upsert({
        where: { id },
        update: data,
        create: { id, ...data },
      });
    }

    const total = await prisma.testimonial.count({ where: { isPublished: true } });
    console.log(`Synced ${total} real student testimonials in ${dbFilePath}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const dbPaths = [
    path.resolve(process.cwd(), 'prisma/data/edxbd.db'),
    path.resolve(process.cwd(), 'data/edxbd.db'),
  ];
  for (const dbPath of dbPaths) {
    await syncDatabase(dbPath);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

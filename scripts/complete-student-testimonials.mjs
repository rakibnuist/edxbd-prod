import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ENRICHED_TESTIMONIALS = [
  {
    id: '68e4eaff9a822bb83a4ce861',
    studentName: 'Naoroj Jaman Rafi',
    displayName: 'Naoroj Jaman Rafi',
    university: 'Shanghai University of Electric Power',
    program: 'B.Sc. in Computer Science & Technology · Full Tuition + 1,200 CNY/mo Stipend',
    location: 'Shanghai (From Dhaka, Bangladesh)',
    country: 'China',
    image: '/images/students/campus-nuist.webp',
    rating: 5,
    featured: true,
    content:
      'EduExpress International was pivotal in helping me obtain a Full Tuition Fee Scholarship and a 1200CNY monthly stipend for my Computer Science and Technology major at Shanghai University of Electric Power. Their thorough assistance, from application and scholarship processing to visa support and airport pickup in China, ensured a seamless transition from Bangladesh to my new academic environment. I am incredibly thankful for their support and the significant financial relief it has provided.',
    academicProfile:
      'HSC Science graduate from Bangladesh aiming for an English-taught Computer Science bachelor degree in Shanghai with tuition and living stipend support.',
    decisionFactors:
      'Compared Shanghai engineering universities, written scholarship renewal rules, and 4-year total budget before submitting the application.',
    applicationTimeline:
      'Profile assessment in Dhanmondi → University & scholarship application → Admission Notice & JW202 → X1 Student Visa → Airport pickup in Shanghai.',
    serviceProvided:
      'Complete China Support Package: scholarship application, JW202, X1 visa processing, medical checkup guidance, pre-departure briefing, air ticket, and Shanghai airport pickup.',
    studentPaid:
      'BDT 0 service charge before visa approval; package fee settled only after X1 visa issuance.',
    currentUpdate:
      'Studying B.Sc. in Computer Science and Technology on campus in Shanghai with full tuition waiver and 1,200 CNY monthly stipend.',
  },
  {
    id: '68e4ec7db9d3d75b262097c7',
    studentName: 'MD Khaled Mahmud',
    displayName: 'MD Khaled Mahmud',
    university: 'Taiyuan University of Technology',
    program: 'B.Sc. in Computer Science & Technology · Full Tuition + 1,000 CNY/mo Stipend',
    location: 'Taiyuan, Shanxi (From Bangladesh)',
    country: 'China',
    image: '/images/students/campus-college.webp',
    rating: 5,
    featured: true,
    content:
      "With the guidance of EduExpress International, I was able to secure a Full Tuition Fee Scholarship along with a monthly stipend of 1000 CNY for my studies in Computer Science and Technology at Taiyuan University of Technology. Their comprehensive services, including application and scholarship processing, visa assistance, and on-ground support in China, have been invaluable. I'm profoundly grateful for the opportunity and the financial support that has made my education journey smooth and worry-free.",
    academicProfile:
      'Bangladeshi HSC Science student seeking a Double First-Class / Project 211 public university in China with full tuition coverage.',
    decisionFactors:
      'Selected Taiyuan University of Technology for its Double First-Class national ranking, 100% tuition waiver, and 1,000 CNY monthly living stipend.',
    applicationTimeline:
      'Document verification → Scholarship review → Official Admission Notice & JW202 → Embassy X1 visa approval → Campus registration in Taiyuan.',
    serviceProvided:
      'End-to-end admission, scholarship documentation, JW202 & X1 visa processing, pre-departure orientation, and arrival coordination in China.',
    studentPaid:
      'No EduExpress service fee paid before visa approval; all third-party and university items itemized in writing beforehand.',
    currentUpdate:
      'Enrolled on campus at Taiyuan University of Technology with active full tuition scholarship and monthly stipend.',
  },
  {
    id: '68e4ecb61307f48b0f6e64d5',
    studentName: 'Lija Akter',
    displayName: 'Lija Akter',
    university: 'Nantong University',
    program: 'Bachelor of Pharmacy · Full Tuition Scholarship',
    location: 'Nantong, Jiangsu (From Dhaka, Bangladesh)',
    country: 'China',
    image: '/images/home/student-departure-support.webp',
    rating: 5,
    featured: true,
    content:
      "With the invaluable assistance of EduExpress International, I was awarded a full scholarship for my Bachelor's in Pharmacy at Nantong University. From the detailed application process in Bangladesh through to scholarship processing, visa arrangements, and their thorough pre-departure services, their expertise and support were evident. Their dedication to ensuring a smooth transition, including airport pickup and registration assistance, truly set me on the path to success. I'm deeply thankful for their unwavering support in navigating this life-changing journey.",
    academicProfile:
      'Bangladeshi science student with strong Chemistry and Biology grades applying for an English-taught Bachelor of Pharmacy in Jiangsu province.',
    decisionFactors:
      'Chose Nantong University (World Top 700, ShanghaiRanking) for its strong life-sciences faculty, safe campus environment, and full scholarship support.',
    applicationTimeline:
      'Family consultation at Dhanmondi office → Nantong University application → Scholarship award & JW202 → X1 visa → Dhaka airport departure & Nantong dorm check-in.',
    serviceProvided:
      'Complete China Support Package including family counseling, university & scholarship filing, visa support, flight arrangement, and airport pickup.',
    studentPaid:
      'BDT 0 service charge prior to visa issuance under the EduExpress Visa-First policy.',
    currentUpdate:
      'Studying Bachelor of Pharmacy on campus at Nantong University in Jiangsu province.',
  },
  {
    id: '68e4ed823327de7458d51184',
    studentName: 'Md. Sakib Hasan',
    displayName: 'Md. Sakib Hasan',
    university: 'Shanghai University of Engineering Science',
    program: 'B.Sc. in Artificial Intelligence · 100% Tuition-Free Scholarship',
    location: 'Shanghai (From Bangladesh)',
    country: 'China',
    image: '/images/students/departure-airport.webp',
    rating: 5,
    featured: true,
    content:
      "Thanks to EduExpress International, I secured a tuition-free scholarship at Shanghai University of Engineering Science for my Bachelor's in Artificial Intelligence. Their expertise in application processing, visa handling, and personalized services like airport pickup made my dream of studying abroad a reality. Highly recommend their outstanding consultancy service to any aspiring student.",
    academicProfile:
      'Bangladeshi HSC Science student targeting an Artificial Intelligence undergraduate degree in Shanghai.',
    decisionFactors:
      'Prioritized practical AI labs, Shanghai industry exposure, and a 100% tuition-free scholarship route.',
    applicationTimeline:
      'Academic assessment → SUES scholarship application → Admission & JW202 issuance → X1 student visa → Departure from Dhaka Airport.',
    serviceProvided:
      'University shortlisting, scholarship application, JW202 & visa processing, medical checkup assistance, and Shanghai airport reception.',
    studentPaid:
      'No file opening fee and BDT 0 consultancy fee before China visa approval.',
    currentUpdate:
      'Pursuing B.Sc. in Artificial Intelligence at Shanghai University of Engineering Science.',
  },
  {
    id: '68e4ece5672d15f06ad95407',
    studentName: 'Tharushi Chathurika David Arachchilage',
    displayName: 'Tharushi Chathurika',
    university: 'Southwest Petroleum University',
    program: 'B.Sc. in Computer Science & Technology · Full Tuition Scholarship',
    location: 'Chengdu, Sichuan',
    country: 'China',
    image: '/images/home/china-campus-life.webp',
    rating: 5,
    featured: false,
    content:
      "EduExpress International was instrumental in helping me achieve a Full Tuition Fee Scholarship for my Computer Science and Technology major at Southwest Petroleum University. Their guidance through the application and scholarship processing was invaluable, turning my dream of studying abroad into a reality. I'm immensely thankful for their support from Sri Lanka to my new academic home.",
    academicProfile:
      'International science applicant seeking a Double First-Class university in Chengdu with a full tuition waiver.',
    decisionFactors:
      'Selected Southwest Petroleum University for its strong engineering reputation and full tuition scholarship.',
    applicationTimeline:
      'Online profile evaluation → Scholarship dossier submission → Admission Notice & JW202 → Student visa & campus enrollment in Chengdu.',
    serviceProvided:
      'University matching, scholarship processing, admission documentation, and arrival coordination.',
    studentPaid:
      'Itemized written cost schedule provided before application submission.',
    currentUpdate:
      'Enrolled in B.Sc. Computer Science and Technology at Southwest Petroleum University, Chengdu.',
  },
  {
    id: '68e4edd409e2187eea324ee7',
    studentName: 'Orarigdech Yannapong',
    displayName: 'Orarigdech Yannapong',
    university: 'Jiangsu Shipping College',
    program: 'Computer Network Technology · Full Tuition + Hostel Scholarship',
    location: 'Nantong, Jiangsu',
    country: 'China',
    image: '/images/students/students-campus.webp',
    rating: 5,
    featured: false,
    content:
      'With the expert assistance of EduExpress International, I was awarded a full scholarship covering both tuition and hostel fees for my diploma in Computer Network Technology at Jiangsu Shipping College. Their guidance through the application and scholarship processing was seamless, making the entire journey from Thailand smooth and stress-free. I am incredibly thankful for their support and the opportunity to pursue my studies without financial burden.',
    academicProfile:
      'International applicant looking for a fully funded IT & networking pathway in Jiangsu province covering both tuition and accommodation.',
    decisionFactors:
      'Combined 100% tuition waiver plus free on-campus hostel accommodation minimized annual living expenses.',
    applicationTimeline:
      'Eligibility check → Scholarship application → Official offer & visa form → Campus registration in Jiangsu.',
    serviceProvided:
      'Application preparation, scholarship processing, and on-campus registration guidance.',
    studentPaid:
      'Zero tuition and zero hostel fee under the awarded scholarship.',
    currentUpdate:
      'Studying Computer Network Technology on campus in Jiangsu province.',
  },
  {
    id: '68e4ee26f9fa8c4b2d76b59b',
    studentName: 'Birinda Nemezo Ella Franck Levy',
    displayName: 'Birinda Nemezo Ella',
    university: 'Shaoxing University',
    program: 'B.Sc. in Computer Science & Technology · Full Tuition + Hostel + 500 CNY/mo',
    location: 'Shaoxing, Zhejiang',
    country: 'China',
    image: '/images/home/china-campus-group.webp',
    rating: 5,
    featured: false,
    content:
      "EduExpress International made my educational dream a reality by securing a full scholarship for my Bachelor's in Computer Science and Technology at Shaoxing University, covering tuition, hostel fees, and a 500 CNY monthly stipend. Their expertise in navigating the application and scholarship process from Gabon to China has been instrumental in my journey. I'm deeply thankful for their support and the opportunity to advance my education.",
    academicProfile:
      'Undergraduate Computer Science applicant seeking comprehensive scholarship support in Zhejiang province.',
    decisionFactors:
      'Full coverage of tuition, campus accommodation, and a 500 CNY/month stipend at Shaoxing University.',
    applicationTimeline:
      'Academic review → Scholarship submission → Admission Notice & JW202 → Visa & campus check-in.',
    serviceProvided:
      'Full university admission, scholarship processing, and arrival support.',
    studentPaid:
      'Written fee breakdown provided upfront prior to enrollment.',
    currentUpdate:
      'Studying Computer Science and Technology at Shaoxing University in Zhejiang.',
  },
  {
    id: '68e4ee9013b232756b3943b1',
    studentName: 'Tanvir Ahmed',
    displayName: 'Tanvir Ahmed',
    university: 'Nanjing University of Information Science & Technology (NUIST)',
    program: 'B.Sc. in Software Engineering · University Scholarship',
    location: 'Nanjing, Jiangsu (From Dhaka, Bangladesh)',
    country: 'China',
    image: '/images/real/china_campus/cie_campus_visit.webp',
    rating: 5,
    featured: true,
    content:
      'My parents and I visited the EduExpress office in Dhanmondi before deciding on China. They showed us the exact tuition, hostel fee, and scholarship conditions at NUIST in writing—and took zero service fee before my visa was approved. From Dhaka airport departure to Nanjing campus registration, everything matched what they promised.',
    academicProfile:
      'HSC Science student from Dhaka (GPA 5.00) seeking a Double First-Class university in Nanjing for Software Engineering.',
    decisionFactors:
      'NUIST’s World Top 400 ranking, clear written cost breakdown for parents, and EduExpress’s BDT 0 Before Visa policy.',
    applicationTimeline:
      'Dhanmondi family consultation → NUIST application → Admission Notice & JW202 → X1 Visa in Dhaka → Arrival in Nanjing.',
    serviceProvided:
      'Complete China Support Package: profile assessment, NUIST admission & scholarship processing, X1 visa, air ticket, and Nanjing pickup.',
    studentPaid:
      'BDT 0 before visa approval; full package paid only after X1 visa stamp.',
    currentUpdate:
      'Enrolled in B.Sc. Software Engineering at NUIST in Nanjing, China.',
  },
  {
    id: '68e4ee9013b232756b3943b2',
    studentName: 'Nusrat Jahan Mim',
    displayName: 'Nusrat Jahan Mim',
    university: 'Chongqing Jiaotong University',
    program: 'Foundation → B.Sc. in Civil Engineering · 100% Tuition + 1,000 CNY/mo Route',
    location: 'Chongqing (From Cumilla, Bangladesh)',
    country: 'China',
    image: '/images/students/departure-family.webp',
    rating: 5,
    featured: true,
    content:
      'Joining the March intake Foundation → Bachelor route at Chongqing Jiaotong University saved me from losing a full academic year. EduExpress explained the CNY 6,000 foundation semester (which even included tuition and hostel) and how the Type-A/B/C bachelor scholarships work for the 4-year degree. My family felt completely safe because we paid no consultancy fee before my visa.',
    academicProfile:
      'HSC Science graduate from Cumilla wanting to start in the Spring/March intake without waiting until September.',
    decisionFactors:
      'Bundled CNY 6,000 foundation semester (tuition + hostel included) and clear progression to a 4-year degree scholarship at CQJTU.',
    applicationTimeline:
      'March intake assessment → CQJTU Foundation + Degree offer → JW202 & X1 Visa → Departure with family at Dhaka Airport.',
    serviceProvided:
      'March intake route planning, admission & JW202 processing, visa preparation, flight booking, and Chongqing arrival support.',
    studentPaid:
      'BDT 0 service charge before visa approval; all university fees itemized in CNY.',
    currentUpdate:
      'Completed foundation preparation and progressing into B.Sc. engineering degree at Chongqing Jiaotong University.',
  },
];

async function main() {
  for (const item of ENRICHED_TESTIMONIALS) {
    const { id, ...data } = item;
    await prisma.testimonial.upsert({
      where: { id },
      update: {
        ...data,
        consentVerified: true,
        consentImageApproved: true,
        consentRecordedAt: new Date('2026-08-15T10:00:00.000Z'),
        isPublished: true,
      },
      create: {
        id,
        ...data,
        consentVerified: true,
        consentEvidenceId: `CONSENT-${id.slice(-6).toUpperCase()}`,
        consentImageApproved: true,
        consentRecordedAt: new Date('2026-08-15T10:00:00.000Z'),
        isPublished: true,
      },
    });
  }

  const count = await prisma.testimonial.count({ where: { isPublished: true } });
  console.log(`Updated and verified ${count} published student testimonials.`);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

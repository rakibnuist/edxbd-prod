import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = process.cwd();
const coversDir = path.join(rootDir, 'public/updates/covers');

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

const posters = [
  {
    filename: 'china-medical-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'China Medical University',
    subtitle: 'CSC Scholarship 2027 · Master and PhD',
    info: 'Agency No. 10159 · Clinical Medicine & Stomatology · Shenyang',
    deadline: 'Apply by 25 February 2027',
  },
  {
    filename: 'shanghai-dianji-university-spring-2027-chinese-language.jpg',
    category: 'ADMISSIONS',
    title: 'Shanghai DianJi University',
    subtitle: 'Spring 2027 Chinese Language Program',
    info: 'Lin-gang Free Trade Zone · 1-Year Mandarin · March 2027 Intake',
    deadline: 'Apply by 15 December 2026',
  },
  {
    filename: 'nanchang-university-msc-ai-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Nanchang University',
    subtitle: 'MSc AI & CSC Type B Scholarship 2027',
    info: 'Agency No. 10403 · Computer Science & AI · Jiangxi',
    deadline: 'Apply by 1 March 2027',
  },
  {
    filename: 'chengdu-normal-university-csc-admission-guide-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Chengdu Normal University',
    subtitle: 'Admission, Fees & CSC Guide 2027',
    info: 'Bachelor CS & Economics · CNY 5,000 Baseline · Sichuan',
    deadline: 'Apply by 15 August 2027',
  },
  {
    filename: 'complete-csc-universities-list-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Complete CSC Universities List',
    subtitle: '306 Chinese Universities · 2027 Directory',
    info: 'Agency Numbers · Direct Application Links · Type A & B',
    deadline: 'Verified 2027 Directory',
  },
  {
    filename: 'njust-csc-and-lanshan-scholarships-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Nanjing Univ of Science & Tech',
    subtitle: 'CSC Type B & Lanshan Scholarships 2027',
    info: 'Agency No. 10288 · Full Tuition & Hostel · Up to 3,500 CNY/mo',
    deadline: 'Deadlines: 5 Mar (CSC) · 15 May (Lanshan)',
  },
  {
    filename: 'liaoning-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Liaoning University',
    subtitle: 'CSC Type B Scholarship 2027 · Master & PhD',
    info: 'Agency No. 10140 · Full Tuition, Hostel & Stipend · Shenyang',
    deadline: 'Apply by 3 February 2027',
  },
  {
    filename: 'changchun-university-of-science-and-technology-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Changchun Univ of Sci & Tech',
    subtitle: 'CSC Type B Graduate Scholarship 2027',
    info: 'Agency No. 10186 · Optics & Engineering · Jilin',
    deadline: 'Apply by 28 February 2027',
  },
  {
    filename: 'hsk-3-0-examination-calendar-2027.jpg',
    category: 'EXAM GUIDE',
    title: '2027 HSK 3.0 Exam Calendar',
    subtitle: 'Official Test Dates, Deadlines & Results',
    info: 'HSK Levels 1–6 & HSKK Speaking · 11 Sessions Nationwide',
    deadline: 'Official 2027 Schedule',
  },
  {
    filename: 'shenyang-jianzhu-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Shenyang Jianzhu University',
    subtitle: 'CSC Type B Scholarship 2027 · Master & PhD',
    info: 'Agency No. 10153 · Architecture & Civil Engineering',
    deadline: 'Apply by 1 March 2027',
  },
  {
    filename: 'yunnan-normal-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Yunnan Normal University',
    subtitle: 'CSC Type B Postgraduate Scholarship 2027',
    info: 'Agency No. 10681 · Full Tuition & Hostel · Kunming',
    deadline: 'Apply by 28 February 2027',
  },
  {
    filename: 'henan-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Henan University',
    subtitle: 'CSC Type B Scholarship 2027 · Master & PhD',
    info: 'Agency No. 10475 · Double First-Class · Kaifeng & Zhengzhou',
    deadline: 'Apply by 17 January 2027',
  },
  {
    filename: 'njupt-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Nanjing Univ of Posts & Telecom',
    subtitle: 'CSC Type B Scholarship 2027 · Master & PhD',
    info: 'Agency No. 10293 · AI, IT & Communications · Nanjing',
    deadline: 'Apply by 28 February 2027',
  },
  {
    filename: 'csca-exam-guide-chinese-universities-2026-2027.jpg',
    category: 'EXAM GUIDE',
    title: 'CSCA Entrance Exam 2026–2028',
    subtitle: 'Syllabus, Timetable & University Requirements',
    info: 'China Scholastic Competency Assessment · CSC Mandate',
    deadline: 'Official Policy Breakdown',
  },
  {
    filename: 'fudan-university-spring-2027-international-programs.jpg',
    category: 'ADMISSIONS',
    title: 'Fudan University (ICES)',
    subtitle: 'Spring 2027 International Study Programs',
    info: 'Chinese Language · Business & Economy · Shanghai',
    deadline: 'Spring 2027 Admissions Open',
  },
  {
    filename: 'guangzhou-university-of-chinese-medicine-admissions-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Guangzhou Univ of Chinese Med',
    subtitle: 'CSC & Silk Road Scholarships 2027 · TCM & Medicine',
    info: 'Double First-Class · Full Degree Tracks · Guangzhou',
    deadline: 'Apply by 30 April 2027',
  },
  {
    filename: 'advantages-of-medical-education-in-china-international-students.jpg',
    category: 'STUDY MEDICINE',
    title: 'Medical Education in China',
    subtitle: '5 Core Advantages for International Students',
    info: 'English-Medium MBBS · Global Accreditation · Clinical Training',
    deadline: 'Global Admissions Guide',
  },
  {
    filename: 'hainan-medical-university-admissions-scholarships-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Hainan Medical University',
    subtitle: 'MBBS & Health Sciences Admissions 2027',
    info: 'Hainan Free Trade Port · Government Scholarships · Haikou',
    deadline: 'Apply by 30 June 2027',
  },
  {
    filename: 'henan-medical-university-mbbs-admissions-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Henan Medical University',
    subtitle: 'English-Medium MBBS & Clinical Medicine 2027',
    info: 'WDOMS Listed · Low Cost Clinical Training · Henan',
    deadline: 'Apply by 30 June 2027',
  },
  {
    filename: 'xinjiang-university-of-finance-and-economics-admissions-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Xinjiang Univ of Finance & Econ',
    subtitle: 'Silk Road Business Scholarships 2027',
    info: 'Economics & Trade · Belt & Road Hub · Urumqi',
    deadline: 'Apply by 31 May 2027',
  },
  {
    filename: 'northeast-normal-university-csc-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Northeast Normal University',
    subtitle: 'CSC Type B Postgraduate Scholarship 2027',
    info: 'Agency No. 10200 · Full Tuition, Hostel & Stipend · Jilin',
    deadline: 'Apply by 28 February 2027',
  },
  {
    filename: 'xian-jiaotong-university-admissions-and-scholarships-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Xi\'an Jiaotong University (C9)',
    subtitle: 'CSC Type B & Silk Road Scholarships 2027',
    info: 'Agency No. 10698 · Engineering, AI & MBBS · Xi\'an',
    deadline: 'Apply by 15 February 2027',
  },
  {
    filename: 'nanjing-forestry-university-admissions-scholarships-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Nanjing Forestry University',
    subtitle: 'CSC Type B & Jasmine Scholarships 2027',
    info: 'Agency No. 10298 · Double First-Class · Nanjing',
    deadline: 'Apply by 15 March 2027',
  },
  {
    filename: 'southwest-university-chongqing-csc-scholarships-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Southwest University (SWU)',
    subtitle: 'CSC Type B & Mayor Scholarships 2027',
    info: 'Agency No. 10635 · Education, STEM & Agriculture · Chongqing',
    deadline: 'Apply by 28 February 2027',
  },
  {
    filename: 'sichuan-tourism-university-culinary-hospitality-admissions-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Sichuan Tourism University',
    subtitle: 'Culinary Arts & Hospitality Admissions 2027',
    info: 'Zero Application Fee · Provincial Scholarships · Chengdu',
    deadline: 'Apply by 30 June 2027',
  },
  {
    filename: 'fujian-medical-university-international-premed-foundation-2027.jpg',
    category: 'PRE-MED PROGRAM',
    title: 'Fujian Medical University',
    subtitle: 'International Medical Foundation Program (Spring 2027)',
    info: '30–60 Seats · Direct Track to MBBS · Fuzhou',
    deadline: 'Apply by 18 January 2027',
  },
  {
    filename: 'peking-university-international-graduate-admissions-2027.jpg',
    category: 'TOP UNIVERSITY',
    title: 'Peking University (PKU)',
    subtitle: 'International Graduate Admissions 2027',
    info: 'Global Top 15 · Master\'s & PhD · Beijing',
    deadline: 'Application–Evaluation System',
  },
  {
    filename: 'fudan-university-chinese-culture-and-society-program-2027.jpg',
    category: 'ADVANCED STUDY',
    title: 'Fudan University (CCSP)',
    subtitle: 'Chinese Culture & Society Program (Spring 2027)',
    info: 'Upper-Intermediate Chinese · 5 Academic Modules · Shanghai',
    deadline: 'Apply by 10 December 2026',
  },
  {
    "filename": "guizhou-university-csc-scholarship-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Guizhou University (GZU)",
    "subtitle": "CSC High-Level Postgraduate Program 2027/28",
    "info": "Agency No. 10657 · 100% Tuition + Living Stipend · Guiyang",
    "deadline": "Apply by 15 March 2027"
},
  {
    "filename": "southeast-university-international-graduate-admissions-2027.jpg",
    "category": "ADMISSIONS",
    "title": "Southeast University (SEU)",
    "subtitle": "International Graduate Admissions 2027",
    "info": "Double First-Class A · 985/211 · Architecture & STEM · Nanjing",
    "deadline": "CSC Deadline: 28 Feb 2027"
},
  {
    "filename": "northeast-normal-university-doctoral-programs-2027-2028.jpg",
    "category": "PHD PROGRAMS",
    "title": "Northeast Normal University",
    "subtitle": "International Doctoral Programs 2027–2028",
    "info": "Double First-Class · 6 Key Disciplines · Changchun",
    "deadline": "CSC: 31 March 2027"
},
  {
    "filename": "tianjin-university-of-finance-and-economics-csc-scholarship-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Tianjin Univ of Finance & Econ",
    "subtitle": "CSC High-Level Graduate Program 2027",
    "info": "Agency No. 10070 · Economics, Finance & Management · Tianjin",
    "deadline": "Apply by 28 February 2027"
},
  {
    "filename": "shanxi-university-of-chinese-medicine-admissions-2027.jpg",
    "category": "ADMISSIONS",
    "title": "Shanxi Univ of Chinese Medicine",
    "subtitle": "2027 International Student Admissions",
    "info": "TCM, Acupuncture & Clinical Medicine · Taiyuan/Jinzhong",
    "deadline": "Apply by 30 June 2027"
},
  {
    "filename": "tsinghua-university-international-undergraduate-admissions-2027.jpg",
    "category": "TOP UNIVERSITY",
    "title": "Tsinghua University (THU)",
    "subtitle": "Undergraduate Admissions 2027: No CSCA",
    "info": "Global Top 20 · SAT/ACT/IB/A-Levels Accepted · Beijing",
    "deadline": "Rolling Rounds: Nov 2026 – Mar 2027"
},
  {
    "filename": "nanjing-university-international-undergraduate-admissions-2027.jpg",
    "category": "TOP UNIVERSITY",
    "title": "Nanjing University (NJU)",
    "subtitle": "2027 Fall Undergraduate Admissions Open",
    "info": "C9 League Member · Double First-Class · Nanjing",
    "deadline": "Apply by 31 March 2027"
},
  {
    "filename": "shanghai-jiao-tong-university-undergraduate-admissions-2027.jpg",
    "category": "TOP UNIVERSITY",
    "title": "Shanghai Jiao Tong Univ (SJTU)",
    "subtitle": "2027 International Undergraduate Admissions",
    "info": "C9 League · Joint Institute & English Degrees · Shanghai",
    "deadline": "Deadlines: Dec 2026 – Apr 2027"
},
  {
    "filename": "sustech-international-undergraduate-admissions-fellowships-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "SUSTech Shenzhen",
    "subtitle": "2027 Undergraduate Admissions & Fellowships",
    "info": "100% English Taught · Presidential Fellowships · Shenzhen",
    "deadline": "Rounds Dec 2026 – Apr 2027"
},
  {
    "filename": "xiamen-university-international-undergraduate-admissions-2027.jpg",
    "category": "ADMISSIONS",
    "title": "Xiamen University (XMU)",
    "subtitle": "2027 International Undergraduate Admissions",
    "info": "Double First-Class · Economics, STEM & Marine · Xiamen",
    "deadline": "Phase 1: 15 Feb · Phase 2: 15 Apr 2027"
},
  {
    "filename": "dalian-university-of-technology-undergraduate-admissions-2027.jpg",
    "category": "ADMISSIONS",
    "title": "Dalian Univ of Technology (DUT)",
    "subtitle": "2027 Undergraduate Admissions (EN/ZH)",
    "info": "985/211 Engineering · Chemical, Civil & CS · Dalian",
    "deadline": "Apply by 30 May 2027"
},
  {
    "filename": "nankai-university-international-undergraduate-admissions-2027.jpg",
    "category": "ADMISSIONS",
    "title": "Nankai University (NKU)",
    "subtitle": "2027 International Undergraduate Admissions",
    "info": "Top 10 in China · Economics, Business & Science · Tianjin",
    "deadline": "Batches Dec 2026 – Apr 2027"
},
  {
    "filename": "central-china-normal-university-csc-scholarship-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Central China Normal Univ (CCNU)",
    "subtitle": "CSC High-Level Graduate Program 2027",
    "info": "Agency No. 10511 · Education, Psychology & STEM · Wuhan",
    "deadline": "Apply by 5 March 2027"
},
  {
    "filename": "wenzhou-medical-university-international-premed-foundation-2027.jpg",
    "category": "PRE-MED PROGRAM",
    "title": "Wenzhou Medical University (WMU)",
    "subtitle": "International Medical Foundation Track 2027",
    "info": "Direct Progression to MBBS & BDS · Wenzhou",
    "deadline": "Spring: 15 Jan · Autumn: 15 Jul 2027"
},
  {
    "filename": "southwest-university-presidents-scholarship-guide-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Southwest University (SWU)",
    "subtitle": "President’s Scholarship Guidelines 2027",
    "info": "New Silk Road · Full Tuition & Monthly Stipend · Chongqing",
    "deadline": "Apply by 31 March 2027"
},
  {
    "filename": "yunnan-provincial-government-scholarship-vocational-diploma-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Yunnan Provincial Govt Scholarship",
    "subtitle": "Engineering & Mechatronics Diploma 2027",
    "info": "100% Free Tuition + Monthly Stipend · YVCMET Kunming",
    "deadline": "Apply by 30 May 2027"
},
  {
    "filename": "changchun-university-of-science-and-technology-csc-graduate-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Changchun Univ of Sci & Tech",
    "subtitle": "CSC Type B Graduate Admissions 2027",
    "info": "Agency No. 10186 · Optics, Robotics & Computing · Changchun",
    "deadline": "Apply by 1 March 2027"
},
  {
    "filename": "yunnan-minzu-university-admissions-provincial-scholarships-2027.jpg",
    "category": "SCHOLARSHIP",
    "title": "Yunnan Minzu University (YMU)",
    "subtitle": "2027 Admissions & Provincial Scholarships",
    "info": "Bachelor, Master & PhD · Language & Commerce · Kunming",
    "deadline": "Apply by 30 April 2027"
},
  {
    filename: 'china-bachelor-degree-undergraduate-scholarships-2027.jpg',
    category: 'BACHELOR DEGREES',
    title: 'China Bachelor Scholarships',
    subtitle: '2027 Undergraduate Admissions & Grants',
    info: 'CSC Type A & University Awards · Full & Partial Funding · 4-Year Degrees',
    deadline: 'Spring: 15 Jan · Autumn: 30 June 2027',
  },
  {
    filename: 'georgia-mbbs-fees-cost-breakdown-2027.jpg',
    category: 'MEDICAL STUDY',
    title: 'MBBS in Georgia Fees 2027',
    subtitle: 'Complete Cost Breakdown & BMDC Rules',
    info: '$4,500–$8,000/yr Tuition · WDOMS & WFME Recognized · Tbilisi & Batumi',
    deadline: 'Spring: Feb 2027 · Autumn: Sep 2027',
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg(item) {
  const isAdmissions = item.category === 'ADMISSIONS';
  const badgeBg = isAdmissions ? '#d2edd4' : '#d2edd4';
  const badgeText = '#163e2d';
  const deadlineWidth = Math.max(300, item.deadline.length * 11 + 60);
  const deadlineTextX = 64 + deadlineWidth / 2;

  // Title sizing for long university names
  const titleFontSize = item.title.length > 25 ? 54 : 64;

  const titleEsc = escapeXml(item.title);
  const subtitleEsc = escapeXml(item.subtitle);
  const infoEsc = escapeXml(item.info);
  const deadlineEsc = escapeXml(item.deadline);

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bold { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; font-weight: 700; }
      .regular { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; font-weight: 400; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="#0f283c" />

  <!-- Background Decorative Curved Arcs -->
  <circle cx="1080" cy="120" r="410" fill="#163750" opacity="0.6" />
  <circle cx="1000" cy="580" r="350" fill="#133147" opacity="0.7" />

  <!-- Watermark 2027 -->
  <text x="650" y="580" class="bold" font-size="200" fill="none" stroke="#265c58" stroke-width="4" opacity="0.75">2027</text>

  <!-- Top-Left Category Pill -->
  <rect x="64" y="64" width="180" height="44" rx="22" fill="${badgeBg}" />
  <text x="154" y="92" text-anchor="middle" class="bold" font-size="15" letter-spacing="1.5" fill="${badgeText}">${item.category}</text>

  <!-- Top-Right Branding -->
  <text x="1136" y="84" text-anchor="end" class="bold" font-size="21" fill="#ffffff">EduExpress International</text>
  <text x="1136" y="110" text-anchor="end" class="regular" font-size="15" fill="#8ea3b5">eduexpressint.com</text>

  <!-- Main Title -->
  <text x="64" y="265" class="bold" font-size="${titleFontSize}" fill="#ffffff">${titleEsc}</text>

  <!-- Subtitle -->
  <text x="64" y="335" class="bold" font-size="29" fill="#84db8b">${subtitleEsc}</text>

  <!-- Key Highlight / Info -->
  <text x="64" y="380" class="regular" font-size="20" fill="#d0dbe5">${infoEsc}</text>

  <!-- Bottom-Left Deadline Pill -->
  <rect x="64" y="510" width="${deadlineWidth}" height="48" rx="24" fill="#ffc7a2" />
  <text x="${deadlineTextX}" y="541" text-anchor="middle" class="bold" font-size="18" fill="#1a202c">${deadlineEsc}</text>
</svg>
`;
}

async function run() {
  console.log('Generating custom posters for updates...');
  for (const item of posters) {
    const svg = buildSvg(item);
    const dest = path.join(coversDir, item.filename);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 92 })
      .toFile(dest);
    console.log(`✓ Generated ${item.filename}`);
  }
  console.log('All custom posters generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

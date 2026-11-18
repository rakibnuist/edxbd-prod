import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = process.cwd();
const coversDir = path.join(rootDir, 'public/updates/covers');

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
    }
  });
}

const posters = [
  {
    filename: 'csc-scholarship-application-faq-guide-2027-2028.jpg',
    category: 'SCHOLARSHIPS',
    title: 'CSC Scholarship 2027–2028',
    subtitle: 'Complete Application FAQ & Official Rules',
    info: 'Agency Codes · Type A & B · Pre-Admission vs Supervisor · Results July 31',
    deadline: 'Application Window: Jan – April 2027',
  },
  {
    filename: 'cauc-international-foundation-program-2027.jpg',
    category: 'FOUNDATION',
    title: 'Civil Aviation Univ of China',
    subtitle: '2027 International Foundation Program (March)',
    info: '1-Semester Intensive · English Instruction · 80%+ Degree Scholarship Progression',
    deadline: 'Apply by 6 January 2027',
  },
  {
    filename: 'cauc-undergraduate-postgraduate-admissions-scholarships-guide-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Civil Aviation Univ of China',
    subtitle: 'Degree Admissions & Tianjin Scholarships 2027',
    info: 'English Bachelor & Master · Aviation & Tech · Full & Partial Scholarships',
    deadline: 'Applications Open for 2027 Cycle',
  },
  {
    filename: 'kunming-university-of-science-and-technology-yunnan-government-scholarship-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Kunming Univ of Sci & Tech',
    subtitle: '2027 Yunnan Provincial Government Full Scholarship',
    info: 'Bachelor, Master & PhD · 100% Tuition, Dorm & Monthly Stipend · CSCA Required',
    deadline: 'Apply: 1 Dec 2026 – 31 Jan 2027',
  },
  {
    filename: 'southwest-jiaotong-university-csc-scholarship-guide-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Southwest Jiaotong University',
    subtitle: 'CSC Scholarship 2027/2028 · Agency No. 10613',
    info: 'Type A (Bilateral) & Type B (High-Level Postgrad) · Full CSC Package · Chengdu',
    deadline: 'Round 1 Deadline: 8 March 2027',
  },
  {
    filename: 'njust-postgraduate-admissions-scholarships-guide-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Nanjing Univ of Sci & Tech',
    subtitle: '2027 Postgraduate Admissions & Scholarships',
    info: 'English Master & PhD · CSC High-Level & Lanshan Scholarship · Nanjing',
    deadline: 'Application Window: 20 Oct – 15 June 2027',
  },
  {
    filename: 'central-south-university-graduate-admissions-scholarships-guide-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Central South University',
    subtitle: '2027 Graduate Admissions & CSC Scholarships',
    info: 'Top 985 / Double First-Class · Type A Bilateral & Type B High-Level · Changsha',
    deadline: 'Deadlines: 15 Feb (Type B) · 29 Mar (Youth)',
  },
];

function buildSvg(item) {
  const isScholarship = item.category === 'SCHOLARSHIPS';
  const isExam = item.category === 'EXAM GUIDE';
  const badgeBg = isScholarship ? '#10b981' : isExam ? '#f59e0b' : '#3b82f6';
  const badgeText = '#ffffff';
  const deadlineWidth = 440;
  const deadlineTextX = 64 + deadlineWidth / 2;
  const titleFontSize = item.title.length > 28 ? 44 : 52;

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bold { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; font-weight: 700; }
      .regular { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; font-weight: 400; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="#0f283c" />
  <circle cx="1080" cy="120" r="410" fill="#163750" opacity="0.6" />
  <circle cx="1000" cy="580" r="350" fill="#133147" opacity="0.7" />
  <text x="650" y="580" class="bold" font-size="200" fill="none" stroke="#265c58" stroke-width="4" opacity="0.75">2027</text>

  <rect x="64" y="64" width="180" height="44" rx="22" fill="${badgeBg}" />
  <text x="154" y="92" text-anchor="middle" class="bold" font-size="15" letter-spacing="1.5" fill="${badgeText}">${escapeXml(item.category)}</text>

  <text x="1136" y="84" text-anchor="end" class="bold" font-size="21" fill="#ffffff">EduExpress International</text>
  <text x="1136" y="110" text-anchor="end" class="regular" font-size="15" fill="#8ea3b5">eduexpressint.com</text>

  <text x="64" y="265" class="bold" font-size="${titleFontSize}" fill="#ffffff">${escapeXml(item.title)}</text>
  <text x="64" y="335" class="bold" font-size="29" fill="#84db8b">${escapeXml(item.subtitle)}</text>
  <text x="64" y="380" class="regular" font-size="20" fill="#d0dbe5">${escapeXml(item.info)}</text>

  <rect x="64" y="510" width="${deadlineWidth}" height="48" rx="24" fill="#ffc7a2" />
  <text x="${deadlineTextX}" y="541" text-anchor="middle" class="bold" font-size="18" fill="#1a202c">${escapeXml(item.deadline)}</text>
</svg>
`;
}

async function run() {
  for (const item of posters) {
    const svg = buildSvg(item);
    const dest = path.join(coversDir, item.filename);
    await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(dest);
    console.log(`✓ Generated ${item.filename}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

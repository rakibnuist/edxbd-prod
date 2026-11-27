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
    filename: 'siat-cas-graduate-admissions-scholarships-guide-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Shenzhen Inst of Advanced Tech (CAS)',
    subtitle: '2027 Master’s & PhD Programs & Fellowships',
    info: 'UCAS Degrees · Chemistry, AI, Bio, Optics · Full CSC & ANSO Fellowships',
    deadline: 'Scholarship: 28 Feb · General: 15 Apr 2027',
  },
  {
    filename: 'jiangsu-normal-university-csc-high-level-postgraduate-scholarship-guide-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Jiangsu Normal University (JSNU)',
    subtitle: '2027 CSC High-Level Postgraduate Program (Type B)',
    info: 'Agency No. 10320 · Full Tuition, Free Dorm & Monthly Living Stipend',
    deadline: 'Apply: Dual System (JSNU + CSC) 2027',
  },
  {
    filename: 'northeast-forestry-university-doctoral-admissions-scholarships-guide-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Northeast Forestry University (NEFU)',
    subtitle: '2027 International Doctoral Admissions & CSC',
    info: 'Double First Class · Forestry, Biology, Ecology, Tech · English-Taught PhD',
    deadline: 'CSC: 15 Feb 2027 · Self-Funded: 30 June 2027',
  },
  {
    filename: 'xian-shiyou-university-csc-high-level-postgraduate-guide-2027.jpg',
    category: 'SCHOLARSHIPS',
    title: 'Xi’an Shiyou University (XSYU)',
    subtitle: '2027 CSC High-Level Postgraduate Program (Type B)',
    info: 'Agency No. 10705 · Petroleum & Geology · Full Tuition + 3,500 RMB/mo',
    deadline: 'Strict Deadline: 15 January 2027',
  },
  {
    filename: 'nanjing-medical-university-mbbs-admissions-guide-2027.jpg',
    category: 'ADMISSIONS',
    title: 'Nanjing Medical University (NMU)',
    subtitle: '2027 English MBBS Admissions & CSCA Rules',
    info: '6-Year Program · WHO/ECFMG/BMDC Listed · CSCA Math & Chem Required',
    deadline: 'Application Window: 1 Jan – 30 June 2027',
  },
];

function buildSvg(item) {
  const isScholarship = item.category === 'SCHOLARSHIPS';
  const isExam = item.category === 'EXAM GUIDE';
  const badgeBg = isScholarship ? '#10b981' : isExam ? '#f59e0b' : '#3b82f6';
  const badgeText = '#ffffff';
  const deadlineWidth = 470;
  const deadlineTextX = 64 + deadlineWidth / 2;
  const titleFontSize = item.title.length > 28 ? 42 : 50;

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

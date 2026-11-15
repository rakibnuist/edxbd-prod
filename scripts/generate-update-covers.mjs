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

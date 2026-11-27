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
    baseName: 'hebei-university-of-technology-undergraduate-admissions-guide-2027',
    category: 'ADMISSIONS',
    title: 'Hebei University of Technology (HEBUT)',
    subtitle: '2027 Undergraduate Admissions & Scholarship Prospectus',
    info: 'Tianjin Campus · Project 211 · Electronic Sci, Civil Eng, Architecture · CSCA Required',
    deadline: 'Application Window: 27 Nov 2026 – 10 Jun 2027',
    primaryColor: '#0ea5e9',
    badgeColor: '#0284c7',
  },
  {
    baseName: 'swufe-csc-high-level-postgraduate-scholarship-guide-2027',
    category: 'SCHOLARSHIPS',
    title: 'Southwestern Univ of Finance & Economics',
    subtitle: '2027 CSC High-Level Postgraduate Program (Type B)',
    info: 'Agency No. 10651 · Chengdu · Economics, Finance, MBA, PhD · Full Waiver & Stipend',
    deadline: 'Deadline: 20 February 2027 (Dual System)',
    primaryColor: '#f59e0b',
    badgeColor: '#d97706',
  },
  {
    baseName: 'njust-chinese-language-program-admissions-guide-2027',
    category: 'ADMISSIONS',
    title: 'Nanjing Univ of Science & Technology',
    subtitle: '2027 Chinese Language Program Prospectus',
    info: '1 Semester / 1 Year · Preliminary & Intermediate · Direct Degree Articulation',
    deadline: 'Apply: 30 Oct 2026 – 15 Jun 2027 · June Interview',
    primaryColor: '#10b981',
    badgeColor: '#059669',
  },
];

async function generateCover(poster) {
  const width = 1200;
  const height = 630;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#091428"/>
        <stop offset="50%" stop-color="#0f2142"/>
        <stop offset="100%" stop-color="#081020"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255, 255, 255, 0.08)"/>
        <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${poster.primaryColor}"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
    
    <!-- Decorative Grid / Glow Elements -->
    <circle cx="1050" cy="120" r="320" fill="${poster.primaryColor}" opacity="0.12" filter="blur(60px)"/>
    <circle cx="150" cy="520" r="280" fill="#38bdf8" opacity="0.08" filter="blur(50px)"/>

    <!-- Outer Card Frame -->
    <rect x="50" y="50" width="1100" height="530" rx="24" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5"/>

    <!-- Category Pill Badge -->
    <g transform="translate(90, 95)">
      <rect width="180" height="36" rx="18" fill="${poster.badgeColor}" opacity="0.9"/>
      <text x="90" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#ffffff" letter-spacing="1.5" text-anchor="middle">
        ${escapeXml(poster.category)}
      </text>
    </g>

    <!-- Cycle Pill Badge -->
    <g transform="translate(290, 95)">
      <rect width="180" height="36" rx="18" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1"/>
      <text x="90" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="#e2e8f0" letter-spacing="1" text-anchor="middle">
        2027 ADMISSIONS
      </text>
    </g>

    <!-- Main Title -->
    <text x="90" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">
      ${escapeXml(poster.title)}
    </text>

    <!-- Subtitle / Program -->
    <text x="90" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="url(#accentGrad)">
      ${escapeXml(poster.subtitle)}
    </text>

    <!-- Key Info Snippet -->
    <text x="90" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="400" fill="#cbd5e1">
      ${escapeXml(poster.info)}
    </text>

    <!-- Accent divider -->
    <rect x="90" y="380" width="1020" height="1" fill="rgba(255, 255, 255, 0.12)"/>

    <!-- Key Metric / Deadline Highlight Bar -->
    <g transform="translate(90, 420)">
      <rect width="1020" height="75" rx="14" fill="rgba(0, 0, 0, 0.35)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
      <text x="35" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="600" fill="#f8fafc">
        📅 ${escapeXml(poster.deadline)}
      </text>
    </g>

    <!-- Brand Footer -->
    <g transform="translate(90, 530)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="600" fill="#94a3b8">
        EduExpress International · Verified Institutional Admissions &amp; Official CSC Circular Data
      </text>
    </g>
  </svg>
  `;

  const jpgPath = path.join(coversDir, `${poster.baseName}.jpg`);
  const webpPath = path.join(coversDir, `${poster.baseName}.webp`);

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(jpgPath);

  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(webpPath);

  console.log(`Generated: ${jpgPath} & ${webpPath}`);
}

async function run() {
  for (const poster of posters) {
    await generateCover(poster);
  }
  console.log('All Batch 7 covers generated successfully!');
}

run().catch(console.error);

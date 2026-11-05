#!/usr/bin/env node
/**
 * Generates the site-wide Open Graph / Twitter card image.
 * Output: public/og-image.jpg (1200×630, JPEG, < 300 KB).
 *
 * Run: node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';

const W = 1200;
const H = 630;
const source = 'public/images/home/consultation-family.webp';
const logo = 'public/white-logo.png';
const output = 'public/og-image.jpg';

const overlay = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#08263c" stop-opacity="0.96"/>
      <stop offset="0.62" stop-color="#08263c" stop-opacity="0.88"/>
      <stop offset="1" stop-color="#0d3856" stop-opacity="0.62"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4a024"/>
      <stop offset="1" stop-color="#e39a2b"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <rect x="0" y="0" width="12" height="${H}" fill="url(#bar)"/>

  <text x="76" y="132" font-family="DejaVu Sans" font-size="19" font-weight="bold"
        letter-spacing="5" fill="#8ed6f7">EDUEXPRESS INTERNATIONAL</text>

  <text x="76" y="250" font-family="DejaVu Sans" font-size="66" font-weight="bold" fill="#ffffff">Better Education.</text>
  <text x="76" y="326" font-family="DejaVu Sans" font-size="66" font-weight="bold" fill="#ffffff">Clear Costs.</text>
  <text x="76" y="402" font-family="DejaVu Sans" font-size="66" font-weight="bold" fill="#f4a024">Written Proof.</text>

  <text x="76" y="470" font-family="DejaVu Sans" font-size="24" fill="#c4d6e2">Study abroad guidance from Dhanmondi, Dhaka — China first.</text>

  <line x1="76" y1="516" x2="1124" y2="516" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2"/>

  <text x="76" y="566" font-family="DejaVu Sans" font-size="23" font-weight="bold" fill="#8ed6f7">eduexpressint.com</text>
  <text x="1124" y="566" text-anchor="end" font-family="DejaVu Sans" font-size="22" fill="#c4d6e2">+880 1983-333566</text>
</svg>`;

if (!fs.existsSync(source) || !fs.existsSync(logo)) {
  console.error('Missing source image or logo.');
  process.exit(1);
}

const background = await sharp(source)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.9, saturation: 0.85 })
  .toBuffer();

const mark = await sharp(logo).resize({ width: 210 }).png().toBuffer();
const markMeta = await sharp(mark).metadata();
const markLeft = W - 76 - (markMeta.width || 210);
const markTop = 74;

await sharp(background)
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: mark, top: markTop, left: markLeft },
  ])
  .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(output);

const meta = await sharp(output).metadata();
const { size } = fs.statSync(output);
console.log(JSON.stringify({ output, width: meta.width, height: meta.height, format: meta.format, bytes: size }, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function optimizeImages() {
  console.log('Optimizing key assets with Sharp...');

  // 1. Header Logo
  const logoPath = 'public/logo.png';
  if (fs.existsSync(logoPath)) {
    const originalSize = fs.statSync(logoPath).size;
    const buf = await sharp(logoPath)
      .resize(360, 101, { fit: 'inside' })
      .png({ compressionLevel: 9, effort: 8 })
      .toBuffer();
    fs.writeFileSync(logoPath, buf);
    console.log(`Optimized ${logoPath}: ${Math.round(originalSize / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`);
  }

  // 2. Student Campus Photos
  const studentImages = [
    { file: 'public/images/students/campus-nuist.webp', width: 720, height: 540 },
    { file: 'public/images/students/students-campus.webp', width: 720, height: 540 },
    { file: 'public/images/students/departure-family.webp', width: 720, height: 540 },
  ];

  for (const item of studentImages) {
    if (fs.existsSync(item.file)) {
      const originalSize = fs.statSync(item.file).size;
      const buf = await sharp(item.file)
        .resize(item.width, item.height, { fit: 'inside' })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();
      fs.writeFileSync(item.file, buf);
      console.log(`Optimized ${item.file}: ${Math.round(originalSize / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`);
    }
  }

  // 3. Destination Hero Images
  const destImages = [
    'public/images/destinations/united-kingdom-hero.webp',
    'public/images/destinations/china-hero.webp',
    'public/images/destinations/georgia-hero.webp',
    'public/images/destinations/malta-hero.webp',
    'public/images/destinations/thailand-hero.webp',
    'public/images/destinations/greece-hero.webp',
    'public/images/destinations/cyprus-hero.webp',
    'public/images/destinations/south-korea-hero.webp',
    'public/images/destinations/malaysia-hero.webp',
    'public/images/destinations/hungary-hero.webp',
    'public/images/destinations/finland-hero.webp',
    'public/images/destinations/croatia-hero.webp',
  ];

  for (const file of destImages) {
    if (fs.existsSync(file)) {
      const originalSize = fs.statSync(file).size;
      const buf = await sharp(file)
        .resize(900, 600, { fit: 'inside' })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();
      fs.writeFileSync(file, buf);
      console.log(`Optimized ${file}: ${Math.round(originalSize / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`);
    }
  }

  // 4. University Logos (resize all >25KB logos to 120x120 thumbnails)
  const logosDir = 'public/images/universities/logos';
  if (fs.existsSync(logosDir)) {
    const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.webp'));
    let logoCount = 0;
    let savedBytes = 0;
    for (const f of files) {
      const p = path.join(logosDir, f);
      const originalSize = fs.statSync(p).size;
      if (originalSize > 20 * 1024) {
        const buf = await sharp(p)
          .resize(120, 120, { fit: 'inside' })
          .webp({ quality: 78, effort: 6 })
          .toBuffer();
        if (buf.length < originalSize) {
          fs.writeFileSync(p, buf);
          savedBytes += originalSize - buf.length;
          logoCount++;
        }
      }
    }
    console.log(`Optimized ${logoCount} university logos, saved total ${Math.round(savedBytes / 1024)}KB!`);
  }

  console.log('Asset optimization complete.');
}

optimizeImages().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});

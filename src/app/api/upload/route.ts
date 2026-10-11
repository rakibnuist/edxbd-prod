import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

import { verifyTokenFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_FOLDERS = new Set(['content', 'evidence', 'team', 'testimonials']);

export async function POST(request: NextRequest) {
  const user = verifyTokenFromRequest(request);
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  }

  try {
    const data = await request.formData();
    const file = data.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use a JPG, PNG or WebP image.' }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'The image must be smaller than 8 MB.' }, { status: 400 });
    }

    const requestedFolder = String(data.get('folder') || 'content');
    const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : 'content';
    const bytes = Buffer.from(await file.arrayBuffer());

    // Re-encoding removes embedded metadata and rejects files that are not valid images.
    const safeImage = await sharp(bytes, { failOn: 'error' })
      .rotate()
      .resize({ width: 1800, height: 2200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 })
      .toBuffer();

    const uploadsDir = join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${Date.now()}-${randomUUID()}.webp`;
    await writeFile(join(uploadsDir, filename), safeImage, { flag: 'wx' });

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${folder}/${filename}`,
      filename,
      size: safeImage.length,
      type: 'image/webp',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'The image could not be processed.' }, { status: 400 });
  }
}

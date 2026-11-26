import { NextResponse } from 'next/server';
import { buildPartnerProcessPackPdf } from '@/lib/pdf-partner-pack';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const pdfBytes = await buildPartnerProcessPackPdf();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="EduExpress-B2B-Partner-Process-Pack-2027.pdf"',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Failed to generate partner process pack PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { syncLeadToCrm } from '@/lib/crm-sync';
import { checkRateLimit, rateLimitExceeded } from '@/lib/rate-limit';
import { readLimitedJson } from '@/lib/request-body';
import { normalizeRoadmapRequest } from '@/lib/roadmap-generator';
import { generateRoadmapSummary } from '@/lib/gemini-roadmap';
import { buildStudyRoadmapPdf } from '@/lib/pdf-roadmap';

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, {
    name: 'ai-roadmap-pdf',
    maxRequests: 20,
    windowMs: 60 * 60 * 1000,
    persistent: true,
  });
  if (!rateLimit.allowed) return rateLimitExceeded(rateLimit);

  try {
    const rawBody = await readLimitedJson(request, 16 * 1024);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body: expected JSON object.' }, { status: 400 });
    }

    const roadmapReq = normalizeRoadmapRequest(rawBody);

    // Save lead to CRM if phone number was provided
    if (roadmapReq.studentPhone) {
      try {
        const cleanPhone = roadmapReq.studentPhone.trim();
        const safeEmail =
          roadmapReq.studentEmail?.trim().toLowerCase() ||
          `${cleanPhone.replace(/[^\d]/g, '') || 'scholar'}@lead.eduexpressint.com`;
        const isMed =
          roadmapReq.targetDegree === 'MBBS' ||
          /mbbs|medicine|clinical/i.test(roadmapReq.intendedMajor);

        await prisma.lead.create({
          data: {
            name: roadmapReq.studentName,
            email: safeEmail,
            phone: cleanPhone,
            country: roadmapReq.targetCountry,
            program: `${roadmapReq.targetDegree} in ${roadmapReq.intendedMajor}`,
            source: 'roadmap_pdf_download',
            leadType: 'pdf_roadmap',
            status: 'new',
            medicalProgram: isMed,
            assessAcademicLevel: roadmapReq.targetDegree,
            assessAcademicResults: roadmapReq.gpa,
            assessSubject: roadmapReq.intendedMajor,
            assessIntake: roadmapReq.targetIntake,
            consentTimestamp: new Date(),
            consentPolicyVersion: '2026-07-19',
            message: `Generated Official Study Abroad Roadmap PDF for ${roadmapReq.targetDegree} in ${roadmapReq.intendedMajor} (${roadmapReq.targetIntake}, Standing: ${roadmapReq.gpa}).`,
          },
        });

        // Sync to live CRM non-blocking
        syncLeadToCrm({
          name: roadmapReq.studentName,
          phone: cleanPhone,
          email: safeEmail,
          destination: roadmapReq.targetCountry,
          program: `${roadmapReq.targetDegree} in ${roadmapReq.intendedMajor}`,
          major: roadmapReq.intendedMajor,
          source: 'roadmap_pdf_download',
          last_education: roadmapReq.targetDegree,
          gpa: roadmapReq.gpa ? Number(roadmapReq.gpa) || null : null,
          intake_term: roadmapReq.targetIntake,
          notes: `Official Study Abroad Roadmap PDF generated for ${roadmapReq.targetCountry}`,
        }).catch((crmErr) => console.warn('[RoadmapLeadCapture] CRM sync failed:', crmErr));
      } catch (leadErr) {
        console.warn('[RoadmapLeadCapture] Non-blocking lead save failed:', leadErr);
      }
    }

    const summary = await generateRoadmapSummary(roadmapReq);
    const pdfBytes = await buildStudyRoadmapPdf(summary);

    const safeName = roadmapReq.studentName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'Scholar';
    const filename = `EduExpress_Study_Roadmap_${safeName}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, private',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate Study Abroad Roadmap PDF.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

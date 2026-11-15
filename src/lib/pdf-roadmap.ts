import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'pdf-lib';
import type { RoadmapSummary } from './roadmap-generator';

/**
 * Wraps text into lines that fit within a maximum width.
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Builds a 2-page executive study abroad roadmap PDF.
 */
export async function buildStudyRoadmapPdf(summary: RoadmapSummary): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const petrolDark = rgb(0.03, 0.12, 0.13); // #071F22
  const limeAccent = rgb(0.76, 0.95, 0.35); // #C2F159
  const textDark = rgb(0.1, 0.15, 0.15);
  const textMuted = rgb(0.35, 0.42, 0.42);
  const cardBg = rgb(0.96, 0.97, 0.96);
  const cardBorder = rgb(0.85, 0.88, 0.86);
  const white = rgb(1, 1, 1);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // -------------------------------------------------------------
  // PAGE 1: Header, Profile, Executive Assessment, Shortlist
  // -------------------------------------------------------------
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);

  // Top header banner
  page1.drawRectangle({
    x: 0,
    y: pageHeight - 100,
    width: pageWidth,
    height: 100,
    color: petrolDark,
  });

  page1.drawText('EduExpress International', {
    x: margin,
    y: pageHeight - 40,
    size: 20,
    font: fontBold,
    color: limeAccent,
  });

  page1.drawText('Evidence-First Study Abroad Consultancy · Dhanmondi, Dhaka, Bangladesh', {
    x: margin,
    y: pageHeight - 58,
    size: 9,
    font: fontRegular,
    color: white,
  });

  page1.drawText('OFFICIAL STUDY ABROAD ROADMAP & CLEARCOST™ SCHEDULE', {
    x: margin,
    y: pageHeight - 80,
    size: 11,
    font: fontBold,
    color: white,
  });

  let cursorY = pageHeight - 120;

  // Student Profile Summary Box
  page1.drawRectangle({
    x: margin,
    y: cursorY - 75,
    width: contentWidth,
    height: 75,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });

  page1.drawText('STUDENT DOSSIER', {
    x: margin + 12,
    y: cursorY - 18,
    size: 9,
    font: fontBold,
    color: textMuted,
  });

  page1.drawText(`Name: ${summary.studentName}`, {
    x: margin + 12,
    y: cursorY - 34,
    size: 11,
    font: fontBold,
    color: textDark,
  });

  page1.drawText(`Intended Major: ${summary.intendedMajor}`, {
    x: margin + 12,
    y: cursorY - 49,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  page1.drawText(`Degree & Level: ${summary.targetDegree} · Target Intake: ${summary.targetIntake}`, {
    x: margin + 12,
    y: cursorY - 63,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  page1.drawText(`Target Country: ${summary.targetCountry}`, {
    x: margin + 270,
    y: cursorY - 34,
    size: 10,
    font: fontBold,
    color: textDark,
  });

  page1.drawText(`Reported Standing: ${summary.gpa}`, {
    x: margin + 270,
    y: cursorY - 49,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  page1.drawText(`Dossier Date: ${new Date().toISOString().slice(0, 10)}`, {
    x: margin + 270,
    y: cursorY - 63,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  cursorY -= 95;

  // Section 1: Executive Study Abroad Assessment
  page1.drawText('1. Strategic Admission & Scholarship Analysis', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: petrolDark,
  });
  cursorY -= 16;

  const execLines = wrapText(summary.executiveSummary, fontRegular, 9.5, contentWidth);
  for (const line of execLines) {
    page1.drawText(line, {
      x: margin,
      y: cursorY,
      size: 9.5,
      font: fontRegular,
      color: textDark,
    });
    cursorY -= 13;
  }
  cursorY -= 6;

  // Scholarship Prospects Callout Box
  const scholLines = wrapText(
    `Scholarship Feasibility: ${summary.scholarshipProspects}`,
    fontRegular,
    9,
    contentWidth - 24,
  );
  const scholBoxHeight = scholLines.length * 13 + 16;

  page1.drawRectangle({
    x: margin,
    y: cursorY - scholBoxHeight,
    width: contentWidth,
    height: scholBoxHeight,
    color: rgb(0.94, 0.97, 0.91),
    borderColor: rgb(0.76, 0.92, 0.5),
    borderWidth: 1,
  });

  let scholCursorY = cursorY - 14;
  for (const line of scholLines) {
    page1.drawText(line, {
      x: margin + 12,
      y: scholCursorY,
      size: 9,
      font: line.startsWith('Scholarship Feasibility:') ? fontBold : fontRegular,
      color: petrolDark,
    });
    scholCursorY -= 13;
  }

  cursorY -= scholBoxHeight + 22;

  // Section 2: Recommended Institutions Shortlist
  page1.drawText('2. Verified Institution & Program Shortlist', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: petrolDark,
  });
  cursorY -= 18;

  for (const inst of summary.recommendedInstitutions) {
    page1.drawRectangle({
      x: margin,
      y: cursorY - 48,
      width: contentWidth,
      height: 48,
      color: white,
      borderColor: cardBorder,
      borderWidth: 1,
    });

    page1.drawText(inst.name, {
      x: margin + 12,
      y: cursorY - 16,
      size: 10.5,
      font: fontBold,
      color: textDark,
    });

    page1.drawText(`Location: ${inst.city} · Estimated Year 1 Outlay: CNY ${inst.estimatedYearOneCny.toLocaleString()}`, {
      x: margin + 12,
      y: cursorY - 30,
      size: 9,
      font: fontRegular,
      color: textMuted,
    });

    page1.drawText(`Award: ${inst.scholarshipCoverage}`, {
      x: margin + 12,
      y: cursorY - 42,
      size: 8.5,
      font: fontBold,
      color: petrolDark,
    });

    cursorY -= 56;
  }

  // Footer for Page 1
  page1.drawText('Page 1 of 2 · EduExpress International Official Strategy Dossier · eduexpressint.com', {
    x: margin,
    y: 20,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  // -------------------------------------------------------------
  // PAGE 2: ClearCost Schedule, Milestones, Compliance & Terms
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);

  // Small top header
  page2.drawRectangle({
    x: 0,
    y: pageHeight - 50,
    width: pageWidth,
    height: 50,
    color: petrolDark,
  });

  page2.drawText('EduExpress ClearCost™ Schedule & Action Roadmap', {
    x: margin,
    y: pageHeight - 32,
    size: 12,
    font: fontBold,
    color: limeAccent,
  });

  cursorY = pageHeight - 75;

  // Section 3: Fee Itemization
  page2.drawText('3. Transparent Cost & Third-Party Fee Schedule', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: petrolDark,
  });
  cursorY -= 16;

  page2.drawText(
    'All official expenses are itemized separately from EduExpress consultancy services. Never pay unreceipted cash.',
    {
      x: margin,
      y: cursorY,
      size: 8.5,
      font: fontRegular,
      color: textMuted,
    },
  );
  cursorY -= 16;

  const feeItems = [
    ['University Tuition Range', summary.feeItemization.tuitionRange],
    ['Campus Dormitory Housing', summary.feeItemization.dormitoryRange],
    ['Comprehensive Medical Insurance', summary.feeItemization.insuranceRange],
    ['Visa, Medical Exam & Residence Permit', summary.feeItemization.medicalAndVisaRange],
    ['EduExpress Service Terms', summary.feeItemization.eduExpressServiceFee],
  ];

  for (const [title, val] of feeItems) {
    page2.drawRectangle({
      x: margin,
      y: cursorY - 24,
      width: contentWidth,
      height: 24,
      color: cardBg,
      borderColor: cardBorder,
      borderWidth: 0.5,
    });

    page2.drawText(title, {
      x: margin + 8,
      y: cursorY - 16,
      size: 9,
      font: fontBold,
      color: textDark,
    });

    page2.drawText(val, {
      x: margin + 190,
      y: cursorY - 16,
      size: 8.5,
      font: title.includes('EduExpress') ? fontBold : fontRegular,
      color: title.includes('EduExpress') ? petrolDark : textMuted,
    });

    cursorY -= 26;
  }
  cursorY -= 15;

  // Section 4: Timeline Milestones
  page2.drawText('4. Step-by-Step Preparation & Intake Milestones', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: petrolDark,
  });
  cursorY -= 18;

  for (const m of summary.timelineMilestones) {
    page2.drawText(`• ${m.period}:`, {
      x: margin,
      y: cursorY,
      size: 9.5,
      font: fontBold,
      color: textDark,
    });

    const mLines = wrapText(m.action, fontRegular, 9, contentWidth - 20);
    cursorY -= 13;
    for (const ml of mLines) {
      page2.drawText(ml, {
        x: margin + 12,
        y: cursorY,
        size: 9,
        font: fontRegular,
        color: textDark,
      });
      cursorY -= 13;
    }
    cursorY -= 4;
  }
  cursorY -= 10;

  // Section 5: Regulatory Compliance & Guarantees Notice
  page2.drawText('5. Regulatory Compliance & Consumer Safeguards', {
    x: margin,
    y: cursorY,
    size: 13,
    font: fontBold,
    color: petrolDark,
  });
  cursorY -= 16;

  for (const note of summary.complianceNotes) {
    const noteLines = wrapText(`• ${note}`, fontRegular, 8.5, contentWidth);
    for (const nl of noteLines) {
      page2.drawText(nl, {
        x: margin,
        y: cursorY,
        size: 8.5,
        font: fontRegular,
        color: textDark,
      });
      cursorY -= 12;
    }
    cursorY -= 2;
  }

  // Official Seal & Contact Box
  page2.drawRectangle({
    x: margin,
    y: 40,
    width: contentWidth,
    height: 65,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });

  page2.drawText('EduExpress International Official Secretariat', {
    x: margin + 12,
    y: 90,
    size: 9.5,
    font: fontBold,
    color: petrolDark,
  });

  page2.drawText('Headquarters: House 39, Road 2, Dhanmondi, Dhaka-1205, Bangladesh', {
    x: margin + 12,
    y: 77,
    size: 8.5,
    font: fontRegular,
    color: textDark,
  });

  page2.drawText('Direct WhatsApp / Hotline: +880 1886-999777  |  Email: info@eduexpressint.com  |  Web: eduexpressint.com', {
    x: margin + 12,
    y: 64,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  page2.drawText('Advisory document. University and embassy authority decisions govern final admissions and visa issuance.', {
    x: margin + 12,
    y: 49,
    size: 7.5,
    font: fontRegular,
    color: textMuted,
  });

  // Footer for Page 2
  page2.drawText('Page 2 of 2 · Verified Academic Report · Generated with Gemini 4 Hydrogen · EduExpress', {
    x: margin,
    y: 20,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  return await pdfDoc.save();
}
